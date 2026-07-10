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

    var data = {"OkPercent": 98.84348496530455, "KoPercent": 1.1565150346954511};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7342819324950364, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb625d8c-620c-4858-a193-26d9928da81a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f88eb21a-3abc-43c0-bc16-45c6c87ea9d9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2a3af42-8c5d-4df1-8c8f-c64cd5554e05"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b2e1ca7-f7f6-458e-9980-2a681cc211e5"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73bc14b1-6bc9-4b64-8a38-3f7c261cb6d2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c1134918-d4bb-4713-ab6e-0e1e66f01c71"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/348646ee-6617-4fdc-943a-3e2c78809439"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f4d750f-e0b7-4d3d-8b5c-68143f97d2f8"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/989a6373-4c38-430e-9226-4e8da71a5182"], "isController": false}, {"data": [0.6086956521739131, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c27e4ac5-5446-4bce-a183-db1d397a689b"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a26e2511-e4e6-49b1-b217-e9cca4746567"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30795ecd-d284-430a-b72b-d5355e7e3684"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d2a3af42-8c5d-4df1-8c8f-c64cd5554e05"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2982456140350877, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=348646ee-6617-4fdc-943a-3e2c78809439"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2b2e1ca7-f7f6-458e-9980-2a681cc211e5"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51703904-050e-41c8-a421-243f03828720"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb625d8c-620c-4858-a193-26d9928da81a"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f4d750f-e0b7-4d3d-8b5c-68143f97d2f8"], "isController": false}, {"data": [0.3055555555555556, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0f71892-d732-4a0a-ae0a-97941c927b31"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9b68365-6245-455d-9d53-031898b11c56"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.40350877192982454, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9515151515151515, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c27e4ac5-5446-4bce-a183-db1d397a689b"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1134918-d4bb-4713-ab6e-0e1e66f01c71"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/73bc14b1-6bc9-4b64-8a38-3f7c261cb6d2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9b68365-6245-455d-9d53-031898b11c56"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/51703904-050e-41c8-a421-243f03828720"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/30795ecd-d284-430a-b72b-d5355e7e3684"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f88eb21a-3abc-43c0-bc16-45c6c87ea9d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=989a6373-4c38-430e-9226-4e8da71a5182"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a26e2511-e4e6-49b1-b217-e9cca4746567"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1297, 15, 1.1565150346954511, 479.1634541249028, 126, 4615, 181.0, 1303.6000000000001, 1559.5999999999995, 2103.16, 5.084141164295766, 753.6126385203072, 3.720995320100977], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2206.473684210527, 1584, 2974, 2131.0, 2689.0, 2828.8999999999996, 2974.0, 0.24760862199285844, 297.9567902252696, 1.2174896598965257], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fb625d8c-620c-4858-a193-26d9928da81a", 3, 0, 0.0, 409.6666666666667, 260, 596, 373.0, 596.0, 596.0, 596.0, 0.017073975846015502, 0.023537854071574108, 0.010949131646045098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f88eb21a-3abc-43c0-bc16-45c6c87ea9d9", 1, 0, 0.0, 774.0, 774, 774, 774.0, 774.0, 774.0, 774.0, 1.2919896640826873, 0.23341610142118863, 0.890766311369509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2a3af42-8c5d-4df1-8c8f-c64cd5554e05", 1, 0, 0.0, 2539.0, 2539, 2539, 2539.0, 2539.0, 2539.0, 2539.0, 0.3938558487593541, 0.07115559767625049, 0.27154514572666405], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 841.0, 483, 1639, 755.5, 1569.5, 1639.0, 1639.0, 0.0805268758448132, 0.014548312530557075, 0.05473311092577148], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 841.0, 483, 1639, 755.5, 1569.5, 1639.0, 1639.0, 0.08355016590675801, 0.0150945123952639, 0.05678800338974959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 147.57894736842107, 130, 402, 133.0, 141.0, 402.0, 402.0, 0.08585358800218701, 0.029759282354376502, 0.048583881779609324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 134.78947368421052, 131, 148, 133.0, 145.0, 148.0, 148.0, 0.08584621779637276, 0.0637978239678122, 0.04309077729231993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 225.31578947368422, 131, 1053, 134.0, 435.0, 1053.0, 1053.0, 0.08585358800218701, 1.3505436593736304, 0.05016804286579277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 237.94736842105263, 130, 1187, 133.0, 530.0, 1187.0, 1187.0, 0.0858520362747446, 4.087701561659836, 0.05008329624374749], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b2e1ca7-f7f6-458e-9980-2a681cc211e5", 1, 0, 0.0, 926.0, 926, 926, 926.0, 926.0, 926.0, 926.0, 1.0799136069114472, 0.1951015793736501, 0.7445498110151187], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 341.42857142857144, 221, 617, 277.5, 591.5, 617.0, 617.0, 0.08090053856644246, 0.17471830179656983, 0.05230093411228995], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73bc14b1-6bc9-4b64-8a38-3f7c261cb6d2", 1, 0, 0.0, 1161.0, 1161, 1161, 1161.0, 1161.0, 1161.0, 1161.0, 0.8613264427217916, 0.15561073428079242, 0.5938442075796727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1134918-d4bb-4713-ab6e-0e1e66f01c71", 3, 0, 0.0, 882.3333333333334, 399, 1780, 468.0, 1780.0, 1780.0, 1780.0, 0.018168054504163512, 0.02504612982588948, 0.011650738077214232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 133.4, 131, 140, 132.0, 138.2, 140.0, 140.0, 0.09239354723466113, 0.06866356391169641, 0.04637722976427327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 168.46666666666667, 128, 398, 134.0, 396.2, 398.0, 398.0, 0.09239354723466113, 0.03397387726441185, 0.052175887286031945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/348646ee-6617-4fdc-943a-3e2c78809439", 3, 0, 0.0, 476.0, 221, 882, 325.0, 882.0, 882.0, 882.0, 0.028799354894450364, 0.023727593501905557, 0.018468336309266673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 876.0, 631, 1063, 904.0, 1063.0, 1063.0, 1063.0, 0.11005034803422566, 32.358456337524416, 0.06276308911326932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1352.125, 1039, 1567, 1448.0, 1567.0, 1567.0, 1567.0, 0.10888057162300102, 97.97092973800613, 0.06198962232051719], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 301.25, 132, 412, 394.5, 412.0, 412.0, 412.0, 0.11056290338184281, 0.19564451262490154, 0.0612198888842821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 159.45454545454547, 128, 397, 134.0, 347.4000000000002, 397.0, 397.0, 0.059933419419517596, 0.04454036345532508, 0.03008376716956254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 156.00000000000003, 127, 391, 133.0, 340.00000000000017, 391.0, 391.0, 0.059933419419517596, 0.016036871993113103, 0.034180778262693626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 179.36363636363635, 128, 391, 133.0, 390.0, 391.0, 391.0, 0.05993439907592053, 0.016154193500931707, 0.03523487133174235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 155.72727272727272, 128, 390, 132.0, 339.20000000000016, 390.0, 390.0, 0.05993407252022775, 0.016154105483967635, 0.03529320872040755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 131.375, 126, 135, 132.0, 135.0, 135.0, 135.0, 0.11099087100086018, 0.0824844265934127, 0.06232397541552207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 220.13333333333335, 129, 1165, 134.0, 701.8000000000003, 1165.0, 1165.0, 0.09239582370876837, 5.565771630247313, 0.053789287474206166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 788.9999999999998, 130, 1766, 850.0, 1665.7000000000005, 1762.25, 1766.0, 0.09701202949165696, 43.65887121956248, 0.05286397700814901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 229.93333333333334, 130, 650, 136.0, 579.8000000000001, 650.0, 650.0, 0.09239525457972479, 1.8343946917386322, 0.053879185890012685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 617.5, 127, 1191, 656.0, 1190.0, 1190.95, 1191.0, 0.0970125000606328, 14.275522018199545, 0.05295897220106811], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 734.8571428571428, 215, 2539, 571.5, 1850.0, 2539.0, 2539.0, 0.08363201911589008, 0.01510930032855436, 0.05766035692951015], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9f4d750f-e0b7-4d3d-8b5c-68143f97d2f8", 3, 0, 0.0, 588.0, 394, 913, 457.0, 913.0, 913.0, 913.0, 0.024505399356324845, 0.024577192518501576, 0.015714725498684877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 341.1818181818182, 264, 788, 270.0, 738.6000000000001, 788.0, 788.0, 0.05988936800383292, 0.09281682326375278, 0.13469259229768282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/989a6373-4c38-430e-9226-4e8da71a5182", 3, 0, 0.0, 348.3333333333333, 235, 447, 363.0, 447.0, 447.0, 447.0, 0.026788345283911812, 0.026866826764235772, 0.017178724026466884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 778.5217391304346, 248, 1736, 746.0, 1232.2, 1642.5999999999985, 1736.0, 0.10100655225112865, 0.06204406383394523, 0.04566995477760992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 146.74999999999997, 130, 399, 133.0, 140.60000000000002, 386.0999999999998, 399.0, 0.09701344121227995, 0.0720969030884229, 0.048696199983507715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 248.39999999999998, 127, 541, 136.0, 402.0, 534.05, 541.0, 0.0970125000606328, 0.09881253668285159, 0.0512536743484398], "isController": false}, {"data": ["login", 23, 0, 0.0, 3538.869565217391, 2019, 5571, 3530.0, 5351.0, 5537.4, 5571.0, 0.09803127623934975, 40.924236807867224, 0.20444965427991765], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 158.66666666666669, 134, 402, 139.0, 260.4000000000001, 402.0, 402.0, 0.09390024038461539, 0.0760188469519982, 0.03337860107421875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c27e4ac5-5446-4bce-a183-db1d397a689b", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.5409103667664671, 2.0642309131736525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 951.7499999999998, 261, 1902, 1062.0, 1801.5000000000005, 1898.2, 1902.0, 0.09695042440048281, 58.0683336130757, 0.20564093925571159], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a26e2511-e4e6-49b1-b217-e9cca4746567", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30795ecd-d284-430a-b72b-d5355e7e3684", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 404.5263157894737, 265, 1322, 274.0, 666.0, 1322.0, 1322.0, 0.08579388695978073, 5.528034916418692, 0.191797137814333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 0, 0.0, 1484.875, 1177, 1699, 1580.5, 1699.0, 1699.0, 1699.0, 0.10868088574921886, 130.020122945252, 0.2450626613231898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2a3af42-8c5d-4df1-8c8f-c64cd5554e05", 3, 0, 0.0, 620.6666666666666, 504, 741, 617.0, 741.0, 741.0, 741.0, 0.03704206744125745, 0.023476857196656334, 0.02375419038387929], "isController": false}, {"data": ["register", 24, 9, 37.5, 1167.7916666666667, 202, 2171, 1131.0, 2003.0, 2154.0, 2171.0, 0.09402988583204695, 0.029246600231940385, 0.04242363989688056], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 434.5333333333333, 265, 1297, 273.0, 920.8000000000002, 1297.0, 1297.0, 0.09231678196006991, 7.496399164686984, 0.20604793202715344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 161.875, 133, 418, 141.0, 246.50000000000017, 418.0, 418.0, 0.09549730220121282, 0.07414097192379315, 0.033946306641837364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 557.8666666666666, 268, 1640, 531.0, 1133.0000000000002, 1640.0, 1640.0, 0.09346260249732075, 7.5894432238055485, 0.20860536467549787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 163.5, 127, 383, 132.5, 383.0, 383.0, 383.0, 0.07099940537997994, 0.05276420653727025, 0.03563837340362274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 166.75, 131, 394, 134.5, 394.0, 394.0, 394.0, 0.07099877527112658, 0.018997719164344416, 0.040491489021814375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 165.5, 126, 394, 133.0, 394.0, 394.0, 394.0, 0.07083595278783747, 0.01909250289984682, 0.04164379255691226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 198.5, 132, 393, 134.5, 393.0, 393.0, 393.0, 0.07083783448739972, 0.019093010076681956, 0.04171407636318558], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1513.0701754385966, 1040, 2393, 1426.0, 2051.8, 2260.2999999999997, 2393.0, 0.24937219456281115, 298.3358404991381, 0.49241267324805094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1167.7916666666667, 202, 2171, 1131.0, 2003.0, 2154.0, 2171.0, 0.09407817112035342, 0.029261618654133365, 0.0424454248609407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 170.14285714285714, 131, 396, 133.0, 396.0, 396.0, 396.0, 0.054431501842895136, 0.014670990731092829, 0.03205292540162672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=348646ee-6617-4fdc-943a-3e2c78809439", 1, 0, 0.0, 860.0, 860, 860, 860.0, 860.0, 860.0, 860.0, 1.1627906976744187, 0.21007449127906977, 0.8016896802325582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 207.42857142857142, 131, 397, 134.0, 397.0, 397.0, 397.0, 0.05443234836702955, 0.014671218895800933, 0.03200026730171073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b2e1ca7-f7f6-458e-9980-2a681cc211e5", 3, 0, 0.0, 452.0, 271, 550, 535.0, 550.0, 550.0, 550.0, 0.02084462417142619, 0.024637640093244952, 0.013367158078681508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 352.6875, 128, 1437, 134.0, 1350.9, 1437.0, 1437.0, 0.0973964705953968, 10.977659399215959, 0.05621222082214796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 313.75, 132, 1058, 136.0, 1048.9, 1058.0, 1058.0, 0.09723783767358474, 3.596826665957641, 0.05621562490504118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51703904-050e-41c8-a421-243f03828720", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 167.14285714285714, 128, 389, 131.0, 389.0, 389.0, 389.0, 0.05443319491749483, 0.014565132233782795, 0.031043931476383766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 200.81250000000003, 129, 402, 135.5, 398.5, 402.0, 402.0, 0.09739172779012083, 0.07237803207840034, 0.048886082113400495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 205.14285714285714, 131, 394, 133.0, 394.0, 394.0, 394.0, 0.05443107859070161, 0.04045122149172259, 0.02732184999572327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 207.49999999999997, 127, 543, 134.0, 444.30000000000007, 543.0, 543.0, 0.09739528485077216, 0.04434624175944582, 0.054523288125688615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 176.0, 134, 410, 137.0, 410.0, 410.0, 410.0, 0.0537845085248446, 0.0423342908896726, 0.019118712014690856], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 598.9285714285714, 425, 913, 521.0, 907.5, 913.0, 913.0, 0.0823200131712021, 0.014872268004562879, 0.05603227459016393], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb625d8c-620c-4858-a193-26d9928da81a", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1752.2608695652175, 1087, 4615, 1464.0, 3153.4000000000015, 4406.599999999997, 4615.0, 0.09890303632321512, 0.05119004809697658, 0.045491533308822586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 414.85714285714283, 264, 791, 268.0, 791.0, 791.0, 791.0, 0.05437484464330102, 0.0842703891102722, 0.12229030001320533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f4d750f-e0b7-4d3d-8b5c-68143f97d2f8", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["addBook", 54, 6, 11.11111111111111, 1334.314814814815, 672, 2525, 1092.5, 2260.5, 2367.5, 2525.0, 0.26586186014681484, 89.3991275792293, 0.9651964439129942], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e0f71892-d732-4a0a-ae0a-97941c927b31", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.732421875, 1.3685313933486238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9b68365-6245-455d-9d53-031898b11c56", 3, 0, 0.0, 417.3333333333333, 256, 542, 454.0, 542.0, 542.0, 542.0, 0.03874217085297346, 0.024907482888874538, 0.02484442597016853], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 244.63157894736835, 131, 564, 136.0, 537.4, 542.8, 564.0, 0.25037006452519733, 0.18606603428093277, 0.12102849798825456], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 852.0350877192983, 631, 1329, 794.0, 1063.2, 1192.5999999999997, 1329.0, 0.2503029983664436, 73.59739236147705, 0.1258848087487485], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 190.03508771929828, 131, 540, 136.0, 400.2, 405.4, 540.0, 0.25085267906260317, 0.443891654747497, 0.12199671305974255], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1265.6666666666663, 903, 1854, 1268.0, 1572.8, 1722.9999999999995, 1854.0, 0.2499967105695978, 224.9474796178669, 0.12548663011013014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 139.60000000000002, 132, 172, 137.0, 157.60000000000002, 172.0, 172.0, 0.0907858422505205, 0.06782340754067206, 0.03227152986248971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 6, 3.6363636363636362, 202.2121212121212, 129, 551, 141.0, 375.40000000000003, 459.09999999999974, 545.72, 0.699111069682307, 1.588967411626005, 0.3326032499661037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 172.87500000000003, 134, 404, 139.5, 404.0, 404.0, 404.0, 0.07451009611802399, 0.05770166623202444, 0.026486010729453842], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 151.89473684210526, 133, 400, 138.0, 146.0, 400.0, 400.0, 0.08924126140174538, 0.07242137521958047, 0.03172247963890167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c27e4ac5-5446-4bce-a183-db1d397a689b", 3, 0, 0.0, 683.0, 243, 1381, 425.0, 1381.0, 1381.0, 1381.0, 0.07982120051085569, 0.03611701455406556, 0.05118742350468284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 364.375, 262, 777, 269.5, 777.0, 777.0, 777.0, 0.07075200537715241, 0.10965178958353601, 0.1591229183433418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1134918-d4bb-4713-ab6e-0e1e66f01c71", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73bc14b1-6bc9-4b64-8a38-3f7c261cb6d2", 3, 0, 0.0, 435.6666666666667, 234, 566, 507.0, 566.0, 566.0, 566.0, 0.021160736957932455, 0.0250112747051604, 0.013569873635132467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9b68365-6245-455d-9d53-031898b11c56", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.28009932170542634, 1.0689195736434107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 630.9999999999999, 268, 1572, 533.5, 1486.6000000000001, 1572.0, 1572.0, 0.09715458508920005, 14.66058182313615, 0.21539569999878555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51703904-050e-41c8-a421-243f03828720", 3, 0, 0.0, 418.3333333333333, 347, 504, 404.0, 504.0, 504.0, 504.0, 0.07272903585541468, 0.03290799473926641, 0.04663938822759339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 144.9090909090909, 130, 200, 138.0, 192.60000000000002, 200.0, 200.0, 0.06037023418162659, 0.050053055488477514, 0.02145973168175008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30795ecd-d284-430a-b72b-d5355e7e3684", 3, 0, 0.0, 635.3333333333334, 284, 902, 720.0, 902.0, 902.0, 902.0, 0.07932310946589106, 0.035117001586462186, 0.05086800965097832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f88eb21a-3abc-43c0-bc16-45c6c87ea9d9", 3, 0, 0.0, 400.6666666666667, 279, 550, 373.0, 550.0, 550.0, 550.0, 0.03601224416301542, 0.030021926204909666, 0.02309378938839205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=989a6373-4c38-430e-9226-4e8da71a5182", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 138.90000000000003, 132, 157, 138.0, 144.8, 156.39999999999998, 157.0, 0.09604902342155436, 0.07456931017591378, 0.03414242629438065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a26e2511-e4e6-49b1-b217-e9cca4746567", 3, 0, 0.0, 1244.6666666666667, 257, 3016, 461.0, 3016.0, 3016.0, 3016.0, 0.02593854294558094, 0.02601453477061682, 0.016633766146742984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 152.66666666666669, 131, 395, 135.0, 245.00000000000009, 395.0, 395.0, 0.0935722127956882, 0.06953950579835812, 0.04696886462596067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 223.33333333333334, 127, 400, 134.0, 398.8, 400.0, 400.0, 0.09354536950420954, 0.034397411911443715, 0.052826336919239165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 334.06666666666666, 132, 1508, 188.0, 843.2000000000004, 1508.0, 1508.0, 0.09354361938972143, 5.63491294402038, 0.0544574898816985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 329.9333333333334, 131, 1178, 395.0, 711.8000000000003, 1178.0, 1178.0, 0.09354595289025813, 1.8572403982874854, 0.054550201825393364], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 60.0, 0.6939090208172706], "isController": false}, {"data": ["401/Unauthorized", 6, 40.0, 0.4626060138781804], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1297, 15, "406/Not Acceptable", 9, "401/Unauthorized", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
