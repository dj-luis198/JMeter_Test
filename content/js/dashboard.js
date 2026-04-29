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

    var data = {"OkPercent": 98.82648784576698, "KoPercent": 1.173512154233026};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6985611510791367, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5af4aa5c-4b62-4a0d-b3b7-59481e10658c"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e60dce21-6193-41f9-82c1-a64667affd7c"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6da243f-fae6-4b57-bddf-cfe9ee2c93a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d225c54-3c57-451e-aa0e-9ea484c4227e"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/09bb4929-f631-4ff8-8e84-d087e7c8e295"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/02103bb1-859b-4dab-a0db-371f71a5ebb3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32120944-4d32-4aea-9c2c-4c060201afed"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed0d2e11-915f-4894-885c-c456b6261f4c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/073bcea0-796c-487a-b790-b4968654f9ac"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0b5513d-55fa-45f6-aedd-38717e8e2a7a"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4a7397e4-d99c-4a3d-bbc6-d0d64f9f4b98"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/5d3480ec-0a2c-4878-adc5-0c5ca8aaa881"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/32479615-09f6-4338-9ea1-028523228962"], "isController": false}, {"data": [0.2, 500, 1500, "register"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2d225c54-3c57-451e-aa0e-9ea484c4227e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f922f7c1-1990-42db-ab99-3c85be905f0d"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=faed9149-596b-4ee7-be60-bf40b58c3cb6"], "isController": false}, {"data": [0.25961538461538464, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09bb4929-f631-4ff8-8e84-d087e7c8e295"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6da243f-fae6-4b57-bddf-cfe9ee2c93a8"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02103bb1-859b-4dab-a0db-371f71a5ebb3"], "isController": false}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9903846153846154, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8173076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5af4aa5c-4b62-4a0d-b3b7-59481e10658c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/32120944-4d32-4aea-9c2c-4c060201afed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/faed9149-596b-4ee7-be60-bf40b58c3cb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32479615-09f6-4338-9ea1-028523228962"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f922f7c1-1990-42db-ab99-3c85be905f0d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=073bcea0-796c-487a-b790-b4968654f9ac"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d3480ec-0a2c-4878-adc5-0c5ca8aaa881"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a7397e4-d99c-4a3d-bbc6-d0d64f9f4b98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0b5513d-55fa-45f6-aedd-38717e8e2a7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1193, 14, 1.173512154233026, 698.7476948868397, 136, 17000, 249.0, 1556.0, 2001.1999999999957, 7515.79999999999, 4.654901302826106, 675.1828845134302, 3.4004656974158083], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5af4aa5c-4b62-4a0d-b3b7-59481e10658c", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["see books", 52, 0, 0.0, 3527.75, 1743, 10441, 2644.0, 7145.800000000005, 9069.099999999995, 10441.0, 0.23560861783829096, 283.5171931282708, 1.1584857332185496], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e60dce21-6193-41f9-82c1-a64667affd7c", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 0.9618552334337349, 1.7972279743975903], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 1348.5, 220, 11614, 566.0, 6293.5, 11614.0, 11614.0, 0.07080039850510016, 0.013368908953216107, 0.047880152309357285], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 1348.5, 220, 11614, 566.0, 6293.5, 11614.0, 11614.0, 0.07009182028457278, 0.013235111433477857, 0.047400962448307285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6da243f-fae6-4b57-bddf-cfe9ee2c93a8", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 170.71428571428572, 142, 425, 150.0, 303.0, 425.0, 425.0, 0.0851876867283669, 0.031933498080234636, 0.04807257154244477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 171.2142857142857, 145, 443, 149.0, 306.0, 443.0, 443.0, 0.08518872344697914, 0.06330919779604602, 0.04276074594897195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 282.3571428571429, 144, 1126, 150.0, 785.5, 1126.0, 1126.0, 0.08504279474921488, 1.8073848087752016, 0.04955688527726989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 308.3571428571428, 140, 1510, 149.5, 978.5, 1510.0, 1510.0, 0.0850345300931128, 5.486583762428707, 0.04946902769088733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d225c54-3c57-451e-aa0e-9ea484c4227e", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 599.9285714285714, 144, 4291, 248.0, 2653.5, 4291.0, 4291.0, 0.07063001977640554, 0.1363332803608185, 0.04565627743219518], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/09bb4929-f631-4ff8-8e84-d087e7c8e295", 3, 0, 0.0, 557.0, 235, 933, 503.0, 933.0, 933.0, 933.0, 0.015372790161414298, 0.02119263227004868, 0.009858202024084037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02103bb1-859b-4dab-a0db-371f71a5ebb3", 3, 0, 0.0, 2411.3333333333335, 224, 5291, 1719.0, 5291.0, 5291.0, 5291.0, 0.07218479307025986, 0.03393061236766121, 0.04629037836862367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 177.25, 141, 444, 149.0, 404.7000000000006, 443.4, 444.0, 0.09465573708422467, 0.07034474211044431, 0.04751274302860496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 235.70000000000002, 141, 445, 151.0, 443.8, 444.95, 445.0, 0.09452287217199382, 0.032390699067531864, 0.053510653318461734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 973.8, 689, 1179, 1032.0, 1179.0, 1179.0, 1179.0, 0.034737902525445515, 10.21409674940077, 0.019811460034043143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1550.0, 995, 1775, 1616.0, 1775.0, 1775.0, 1775.0, 0.03474683456337128, 31.265262818541608, 0.01978262163129439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 202.0, 138, 438, 144.0, 438.0, 438.0, 438.0, 0.034955012898399765, 0.06185398766787145, 0.019354972962297524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 203.0, 138, 533, 149.5, 501.5000000000001, 533.0, 533.0, 0.055757158986892416, 0.04143671678615736, 0.027987480194592487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 194.58333333333331, 142, 445, 147.0, 440.20000000000005, 445.0, 445.0, 0.055757158986892416, 0.021898115988829982, 0.03140877722227127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 317.99999999999994, 139, 1640, 147.0, 1282.1000000000013, 1640.0, 1640.0, 0.05575560459983738, 4.194524806888141, 0.03237890579625973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 298.5, 136, 851, 147.0, 729.8000000000004, 851.0, 851.0, 0.05568522995679754, 1.3782003780795091, 0.03239241729583242], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 150.4, 139, 175, 145.0, 175.0, 175.0, 175.0, 0.03495354673638734, 0.025976219791397234, 0.019627235716233128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 261.55, 138, 1317, 146.0, 443.9, 1273.3499999999995, 1317.0, 0.09465708105959136, 4.282867785651407, 0.0552412808996209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1086.8749999999998, 143, 2277, 1373.0, 2031.3000000000002, 2277.0, 2277.0, 0.07626565233349063, 42.89768851022198, 0.04073956233048767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 256.35, 138, 1136, 150.0, 455.6, 1102.0499999999995, 1136.0, 0.09465932110334904, 1.4158871323668618, 0.055335028918422596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 754.875, 144, 1294, 910.0, 1214.9, 1294.0, 1294.0, 0.07626528880711556, 14.023037926489794, 0.04081384596318293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32120944-4d32-4aea-9c2c-4c060201afed", 1, 0, 0.0, 12046.0, 12046, 12046, 12046.0, 12046.0, 12046.0, 12046.0, 0.08301510874979245, 0.014997846795616804, 0.05723502614975926], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 2186.538461538462, 264, 12046, 630.0, 11121.199999999999, 12046.0, 12046.0, 0.06648460114353513, 0.012011378136283205, 0.04583801602278888], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 571.0833333333333, 282, 2069, 300.5, 1736.9000000000012, 2069.0, 2069.0, 0.05564727050138191, 5.6268456707003205, 0.12396552593626532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed0d2e11-915f-4894-885c-c456b6261f4c", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/073bcea0-796c-487a-b790-b4968654f9ac", 3, 0, 0.0, 779.0, 247, 1688, 402.0, 1688.0, 1688.0, 1688.0, 0.016009306743653643, 0.01892245858925989, 0.010266384858397683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 1042.55, 165, 5328, 448.5, 3971.0000000000045, 5271.249999999999, 5328.0, 0.08590954583918592, 0.05277060970004682, 0.03884386691752254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 165.875, 140, 436, 150.0, 238.6000000000002, 436.0, 436.0, 0.07626456176476196, 0.05667708154588267, 0.03828123510457778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 251.43750000000006, 140, 596, 150.5, 494.5000000000001, 596.0, 596.0, 0.07626492528420602, 0.0919982899973784, 0.03949167639838891], "isController": false}, {"data": ["login", 20, 0, 0.0, 4139.349999999999, 1521, 15294, 2924.0, 13767.900000000021, 15269.55, 15294.0, 0.08625336927223719, 25.915536556603772, 0.16589454177897575], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 347.95000000000005, 141, 3935, 155.0, 199.10000000000005, 3748.2999999999975, 3935.0, 0.09752434451449943, 0.07895281406496096, 0.03466685683913847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0b5513d-55fa-45f6-aedd-38717e8e2a7a", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1255.375, 294, 2429, 1521.0, 2179.1000000000004, 2429.0, 2429.0, 0.07621007306640755, 57.02788045795109, 0.15921132696026596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a7397e4-d99c-4a3d-bbc6-d0d64f9f4b98", 3, 0, 0.0, 5962.333333333333, 300, 17000, 587.0, 17000.0, 17000.0, 17000.0, 0.02847623658057351, 0.023461378510882668, 0.018261128275953716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d3480ec-0a2c-4878-adc5-0c5ca8aaa881", 3, 0, 0.0, 2053.3333333333335, 238, 4291, 1631.0, 4291.0, 4291.0, 4291.0, 0.02056498879208111, 0.02062523778268291, 0.013187834609505138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 543.3571428571429, 290, 1663, 450.0, 1275.0, 1663.0, 1663.0, 0.08495918924659404, 7.382317062763601, 0.18952252177079223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, 16.666666666666668, 1447.5, 144, 1924, 1775.0, 1924.0, 1924.0, 1924.0, 0.039765911335273026, 39.646652435164995, 0.07900109273410523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32479615-09f6-4338-9ea1-028523228962", 3, 0, 0.0, 450.6666666666667, 230, 697, 425.0, 697.0, 697.0, 697.0, 0.09221689413500554, 0.04172574311447191, 0.0591364848456904], "isController": false}, {"data": ["register", 20, 5, 25.0, 1256.7499999999998, 164, 2574, 1284.0, 1917.3000000000002, 2541.5499999999993, 2574.0, 0.08586086247236355, 0.027083065018138106, 0.03873800631077339], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 517.8499999999999, 297, 1467, 437.0, 886.6, 1438.0499999999997, 1467.0, 0.09445769475995938, 5.789283516246723, 0.21122917503010838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 460.06250000000006, 150, 3734, 157.5, 1557.700000000002, 3734.0, 3734.0, 0.08964087623956524, 0.06959423497114683, 0.03186453022578296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d225c54-3c57-451e-aa0e-9ea484c4227e", 3, 0, 0.0, 757.6666666666666, 486, 1016, 771.0, 1016.0, 1016.0, 1016.0, 0.06479481641468682, 0.02931796706263499, 0.04155136339092873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f922f7c1-1990-42db-ab99-3c85be905f0d", 3, 0, 0.0, 404.6666666666667, 231, 627, 356.0, 627.0, 627.0, 627.0, 0.02705676509316546, 0.027136032959649344, 0.017350855219249988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 476.7142857142858, 287, 1024, 447.0, 816.0, 1024.0, 1024.0, 0.06714306268284495, 0.10405863327897943, 0.15100632163924993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 152.33333333333334, 145, 158, 152.5, 158.0, 158.0, 158.0, 0.03388988048168817, 0.025185741256410835, 0.01701113141365988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 151.0, 144, 166, 150.0, 166.0, 166.0, 166.0, 0.03389141191622043, 0.00906860045414492, 0.019328695858469462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 149.66666666666666, 144, 164, 148.0, 164.0, 164.0, 164.0, 0.03389198623985359, 0.009134949416210538, 0.019924780973038927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 195.0, 139, 429, 147.0, 429.0, 429.0, 429.0, 0.03383827560147535, 0.009120472720710152, 0.01992625018329066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=faed9149-596b-4ee7-be60-bf40b58c3cb6", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.2867683531746032, 1.0943700396825398], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1650.0000000000002, 1135, 2460, 1491.5, 2213.8, 2330.3999999999996, 2460.0, 0.23356195455423354, 279.4212969201263, 0.46119362510611345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 5, 25.0, 1256.7499999999998, 164, 2574, 1284.0, 1917.3000000000002, 2541.5499999999993, 2574.0, 0.08659845594953042, 0.027315723898142897, 0.039070787742854544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 195.33333333333334, 143, 431, 149.0, 431.0, 431.0, 431.0, 0.07159819095237527, 0.019297949905132398, 0.04216182533621317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 198.5, 143, 444, 151.0, 444.0, 444.0, 444.0, 0.07159562789365663, 0.01929725908071214, 0.042090398429669225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 331.49999999999994, 139, 1277, 148.5, 1177.6000000000001, 1277.0, 1277.0, 0.08840462798227487, 9.9641792908015, 0.05102259290773872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 344.8125, 141, 1175, 147.0, 1170.1, 1175.0, 1175.0, 0.08840560491535163, 3.2701224624828713, 0.05110949034168766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 185.62499999999997, 144, 448, 148.5, 434.0, 448.0, 448.0, 0.0884007204658718, 0.06569623854934417, 0.0443730178900958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 148.0, 147, 150, 148.0, 150.0, 150.0, 150.0, 0.07159733657907927, 0.01915788107682394, 0.04083285601775614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 275.875, 138, 449, 151.0, 448.3, 449.0, 449.0, 0.08825930584055956, 0.04018642709781338, 0.049408835032324974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 160.5, 146, 198, 150.5, 198.0, 198.0, 198.0, 0.07159562789365663, 0.05320729768268818, 0.03593764915755811], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 3218.5, 503, 17000, 734.0, 15626.600000000006, 17000.0, 17000.0, 0.06152678722498808, 0.011115679332639447, 0.04187907294513349], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 261.66666666666663, 154, 459, 173.0, 459.0, 459.0, 459.0, 0.07851142341210646, 0.061797077412263486, 0.02790835754102222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2072.15, 933, 7685, 1472.5, 5485.300000000007, 7591.249999999998, 7685.0, 0.08499065102838688, 0.0439893018018018, 0.03909237952575217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 361.1666666666667, 297, 596, 314.0, 596.0, 596.0, 596.0, 0.07146685724495266, 0.11075967035912096, 0.1607306369483652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09bb4929-f631-4ff8-8e84-d087e7c8e295", 1, 0, 0.0, 1032.0, 1032, 1032, 1032.0, 1032.0, 1032.0, 1032.0, 0.9689922480620154, 0.17506207606589147, 0.6680747335271318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6da243f-fae6-4b57-bddf-cfe9ee2c93a8", 3, 0, 0.0, 394.3333333333333, 249, 521, 413.0, 521.0, 521.0, 521.0, 0.03832151753209427, 0.02463704333524941, 0.024574671073641183], "isController": false}, {"data": ["addBook", 52, 7, 13.461538461538462, 3246.1730769230767, 769, 16967, 1357.5, 11307.2, 13955.999999999989, 16967.0, 0.24165028556557785, 84.31579549850827, 0.876749241647962], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02103bb1-859b-4dab-a0db-371f71a5ebb3", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.4990719958563536, 1.9045666436464088], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 269.09615384615375, 143, 669, 151.0, 592.7, 602.35, 669.0, 0.2349974466623584, 0.17464165713872531, 0.11359739853307363], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 914.673076923077, 686, 1359, 858.5, 1168.7, 1280.55, 1359.0, 0.23470364151726877, 69.01066350042427, 0.118039429083392], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 240.84615384615384, 138, 594, 151.5, 445.7, 453.15, 594.0, 0.2354816505452306, 0.4166921394413651, 0.11452134958156722], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1379.6153846153852, 988, 1859, 1336.5, 1726.8, 1766.8, 1859.0, 0.23419414694781973, 210.7283050930471, 0.11755448391716733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 785.8571428571429, 148, 5963, 154.5, 4565.5, 5963.0, 5963.0, 0.06675917581028949, 0.04987379833483541, 0.023730800776313843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 156, 7, 4.487179487179487, 1004.0641025641025, 143, 13039, 165.0, 3822.4000000000005, 6050.800000000002, 13032.73, 0.6625469835000318, 1.4521916342825592, 0.3170017559087724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 828.8333333333334, 147, 4208, 154.0, 4208.0, 4208.0, 4208.0, 0.033371710800754205, 0.025843522133787187, 0.011862600323705595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5af4aa5c-4b62-4a0d-b3b7-59481e10658c", 3, 0, 0.0, 629.6666666666666, 284, 1085, 520.0, 1085.0, 1085.0, 1085.0, 0.01941157059017645, 0.022943819275042545, 0.012448175150601435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32120944-4d32-4aea-9c2c-4c060201afed", 3, 0, 0.0, 4327.333333333334, 260, 12422, 300.0, 12422.0, 12422.0, 12422.0, 0.022656727915354464, 0.018887981833080332, 0.01452921679467718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 159.35714285714283, 146, 182, 161.0, 174.5, 182.0, 182.0, 0.08737876196776972, 0.07090991327657874, 0.03106041929323064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 351.0, 297, 579, 304.5, 579.0, 579.0, 579.0, 0.033807959520603136, 0.052395734139840985, 0.07603489333588771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 632.6875, 295, 1604, 588.5, 1480.1000000000001, 1604.0, 1604.0, 0.08818293549969411, 13.306764061733567, 0.19550518488103572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/faed9149-596b-4ee7-be60-bf40b58c3cb6", 3, 0, 0.0, 488.6666666666667, 411, 532, 523.0, 532.0, 532.0, 532.0, 0.029011575618671848, 0.02418575688783158, 0.018604428375255062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32479615-09f6-4338-9ea1-028523228962", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 0.6843335700757576, 2.611564867424242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 208.5, 144, 545, 154.0, 511.4000000000001, 545.0, 545.0, 0.05650249552688577, 0.046846307326490255, 0.020084871456822678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 452.4375, 150, 4613, 157.0, 1685.6000000000029, 4613.0, 4613.0, 0.07332151023980717, 0.05692441468813154, 0.026063505593056452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f922f7c1-1990-42db-ab99-3c85be905f0d", 1, 0, 0.0, 960.0, 960, 960, 960.0, 960.0, 960.0, 960.0, 1.0416666666666667, 0.18819173177083334, 0.7181803385416667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=073bcea0-796c-487a-b790-b4968654f9ac", 1, 0, 0.0, 779.0, 779, 779, 779.0, 779.0, 779.0, 779.0, 1.2836970474967906, 0.23191792362002567, 0.8850489409499358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d3480ec-0a2c-4878-adc5-0c5ca8aaa881", 1, 0, 0.0, 692.0, 692, 692, 692.0, 692.0, 692.0, 692.0, 1.445086705202312, 0.2610752348265896, 0.9963195447976879], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a7397e4-d99c-4a3d-bbc6-d0d64f9f4b98", 1, 0, 0.0, 9734.0, 9734, 9734, 9734.0, 9734.0, 9734.0, 9734.0, 0.10273268954181221, 0.018560105044175056, 0.07082937384425725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 170.5, 138, 433, 151.0, 296.0, 433.0, 433.0, 0.06719107702497108, 0.049933993765627925, 0.03372677108479994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 262.35714285714283, 144, 577, 150.5, 513.5, 577.0, 577.0, 0.06719236694711482, 0.017979207562020955, 0.038320646774526415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 259.14285714285717, 137, 590, 152.5, 511.5, 590.0, 590.0, 0.06719494693999012, 0.01811113804241921, 0.03950327935339263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0b5513d-55fa-45f6-aedd-38717e8e2a7a", 2, 0, 0.0, 305.5, 237, 374, 305.5, 374.0, 374.0, 374.0, 0.023561566372932472, 0.027128014407897836, 0.014645446285519061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 209.35714285714283, 144, 444, 148.5, 436.5, 444.0, 444.0, 0.06719139950086389, 0.018110181896717217, 0.03956681044826262], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 35.714285714285715, 0.4191114836546521], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.08382229673093043], "isController": false}, {"data": ["401/Unauthorized", 8, 57.142857142857146, 0.6705783738474435], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1193, 14, "401/Unauthorized", 8, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 156, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
