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

    var data = {"OkPercent": 99.09159727479182, "KoPercent": 0.9084027252081757};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8258317025440313, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f616b514-5d4a-4c4d-ae17-510d02e68045"], "isController": false}, {"data": [0.39473684210526316, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3bed8906-5289-45ac-8373-7314ae31708c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f492a7e-261c-45f0-a177-b0b181c05e26"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e7e2f5d7-baef-4694-a250-daf6e410aac9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6aa82703-0dcf-46db-88ea-262413963e1d"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/72f955ed-882a-4135-9931-31755acc8bb3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d173ebb-5b44-4825-89d9-3f98596dd311"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7210de3a-9b67-4d38-830b-797c35b3f515"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4deaed4f-8ee9-448a-b7fd-54397fc412ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7d17f3d4-c0cb-42a8-8e9a-c415c72ea118"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b15f29c-53b4-46a2-9c73-ee19bb15ca7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46b4fb7d-15f5-4a68-ba10-51f68700f9ef"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3f65f884-0cd8-4e93-94a7-61be03039aad"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f616b514-5d4a-4c4d-ae17-510d02e68045"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=666c3fd9-54bc-44b6-9c70-934c29532a36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8d173ebb-5b44-4825-89d9-3f98596dd311"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6aa82703-0dcf-46db-88ea-262413963e1d"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46b4fb7d-15f5-4a68-ba10-51f68700f9ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7e2f5d7-baef-4694-a250-daf6e410aac9"], "isController": false}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f492a7e-261c-45f0-a177-b0b181c05e26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bed8906-5289-45ac-8373-7314ae31708c"], "isController": false}, {"data": [0.375, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72f955ed-882a-4135-9931-31755acc8bb3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0eddad9-5396-404b-8118-68589fe9bb36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5c55d57-0c4f-4082-a215-275be891a9ff"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b15f29c-53b4-46a2-9c73-ee19bb15ca7a"], "isController": false}, {"data": [0.9265536723163842, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d17f3d4-c0cb-42a8-8e9a-c415c72ea118"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0eddad9-5396-404b-8118-68589fe9bb36"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/666c3fd9-54bc-44b6-9c70-934c29532a36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f65f884-0cd8-4e93-94a7-61be03039aad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 12, 0.9084027252081757, 312.26040878122654, 77, 3093, 99.0, 844.3999999999999, 1037.8999999999999, 1624.7199999999993, 5.169040538425419, 724.2590910952907, 3.7828651723176554], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f616b514-5d4a-4c4d-ae17-510d02e68045", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1356.3508771929821, 1046, 1814, 1352.0, 1674.8, 1719.2, 1814.0, 0.24734215665003254, 297.6336634166848, 1.2161794518876112], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3bed8906-5289-45ac-8373-7314ae31708c", 3, 0, 0.0, 302.0, 166, 532, 208.0, 532.0, 532.0, 532.0, 0.041608876560332866, 0.02675049843966713, 0.026682775658807216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f492a7e-261c-45f0-a177-b0b181c05e26", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 445.9230769230769, 383, 600, 436.0, 576.0, 600.0, 600.0, 0.07496554468234791, 0.013543579849838247, 0.050953143651283346], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 445.9230769230769, 383, 600, 436.0, 576.0, 600.0, 600.0, 0.07346209920773951, 0.013271961282648253, 0.049931270555260455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 131.53846153846155, 79, 247, 82.0, 246.6, 247.0, 247.0, 0.05884909281859993, 0.03614409426719299, 0.03242181841433383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 81.92307692307693, 78, 85, 82.0, 84.6, 85.0, 85.0, 0.0588504248547979, 0.04373552081494258, 0.029540154663443473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 197.00000000000003, 80, 639, 82.0, 637.0, 639.0, 639.0, 0.0588506912692736, 4.005445598760514, 0.0334881299853326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 262.38461538461536, 77, 864, 84.0, 807.5999999999999, 864.0, 864.0, 0.0588506912692736, 12.232345181656239, 0.033430658607139944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7e2f5d7-baef-4694-a250-daf6e410aac9", 3, 0, 0.0, 410.33333333333337, 167, 682, 382.0, 682.0, 682.0, 682.0, 0.021983175542984436, 0.02598336926971891, 0.014097283795468535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6aa82703-0dcf-46db-88ea-262413963e1d", 3, 0, 0.0, 345.0, 278, 407, 350.0, 407.0, 407.0, 407.0, 0.022917382834880255, 0.027087570661930408, 0.014696368549711623], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 333.0, 166, 1099, 205.0, 1068.6, 1099.0, 1099.0, 0.07555943039814007, 0.17402167792792791, 0.048847991136297585], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 82.33333333333334, 80, 88, 81.0, 86.8, 88.0, 88.0, 0.0895597243948748, 0.0665575686176755, 0.04495478353414614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 104.13333333333333, 79, 253, 81.0, 248.8, 253.0, 253.0, 0.0895597243948748, 0.023964223129097358, 0.051077030318952034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72f955ed-882a-4135-9931-31755acc8bb3", 3, 0, 0.0, 648.3333333333334, 257, 1099, 589.0, 1099.0, 1099.0, 1099.0, 0.026588673225206062, 0.026839673070105468, 0.017050679119028626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 617.4, 551, 641, 634.0, 641.0, 641.0, 641.0, 0.05087763927753752, 14.959715244212667, 0.029016153650470618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 829.2, 696, 875, 861.0, 875.0, 875.0, 875.0, 0.050760905980649945, 45.67475242954386, 0.02890000799484269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 112.8, 80, 239, 82.0, 239.0, 239.0, 239.0, 0.05115979249588164, 0.09052885156497804, 0.028327736665200085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 108.53846153846156, 80, 260, 83.0, 251.2, 260.0, 260.0, 0.07130906996516827, 0.05299433812841118, 0.03579381050985985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 152.6153846153846, 79, 315, 84.0, 287.4, 315.0, 315.0, 0.07125005480773447, 0.027296820877362214, 0.04017449755009427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d173ebb-5b44-4825-89d9-3f98596dd311", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 183.30769230769232, 78, 1038, 82.0, 721.9999999999998, 1038.0, 1038.0, 0.07131572017905732, 4.953897858402637, 0.041454405254322826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 173.84615384615387, 79, 617, 83.0, 466.1999999999999, 617.0, 617.0, 0.07125278845047109, 1.6293187582557316, 0.041487407097325825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 81.8, 78, 85, 83.0, 85.0, 85.0, 85.0, 0.05116188644107685, 0.03802167537271434, 0.02872859834337812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 606.5, 79, 1254, 750.0, 1062.2000000000003, 1254.0, 1254.0, 0.08180921069450907, 46.01581354466527, 0.043700818603414515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 91.53333333333333, 79, 237, 81.0, 144.60000000000005, 237.0, 237.0, 0.08956025912768308, 0.02413928859300833, 0.05265163671373555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7210de3a-9b67-4d38-830b-797c35b3f515", 1, 0, 0.0, 1341.0, 1341, 1341, 1341.0, 1341.0, 1341.0, 1341.0, 0.7457121551081282, 0.23813269015659955, 0.4449512956748695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 469.5625, 79, 820, 620.5, 751.4000000000001, 820.0, 820.0, 0.08174233793304281, 15.030112951307112, 0.04374492303447994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 91.26666666666667, 78, 233, 82.0, 143.60000000000005, 233.0, 233.0, 0.08955918966845189, 0.024139000340324922, 0.052738468134840316], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 502.3846153846154, 369, 668, 477.0, 651.1999999999999, 668.0, 668.0, 0.07348535380371497, 0.013276162552428973, 0.05066470682170192], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 347.69230769230774, 162, 1118, 317.0, 870.7999999999997, 1118.0, 1118.0, 0.07121258600289232, 6.655338273478242, 0.15875720513880978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4deaed4f-8ee9-448a-b7fd-54397fc412ba", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d17f3d4-c0cb-42a8-8e9a-c415c72ea118", 3, 0, 0.0, 341.3333333333333, 246, 441, 337.0, 441.0, 441.0, 441.0, 0.020640828935690057, 0.02439676102392272, 0.013236469076598117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 682.6190476190475, 210, 2549, 497.0, 1729.4000000000005, 2481.199999999999, 2549.0, 0.09733262265069176, 0.05978732387430187, 0.04400879324928739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 82.31250000000001, 79, 85, 82.5, 85.0, 85.0, 85.0, 0.08180921069450907, 0.060797665369649805, 0.04106438896189225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 149.1875, 78, 336, 85.5, 282.80000000000007, 336.0, 336.0, 0.08181046560381237, 0.09868786878623947, 0.04236328065080225], "isController": false}, {"data": ["login", 21, 0, 0.0, 2774.428571428572, 1534, 4277, 2553.0, 4221.400000000001, 4275.7, 4277.0, 0.0965863620056848, 27.644931106040328, 0.18386173403565417], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b15f29c-53b4-46a2-9c73-ee19bb15ca7a", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 109.26666666666668, 81, 251, 87.0, 249.2, 251.0, 251.0, 0.08840013436820424, 0.0715661244055091, 0.0314234852636976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46b4fb7d-15f5-4a68-ba10-51f68700f9ef", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 710.8125, 164, 1339, 832.5, 1145.1000000000001, 1339.0, 1339.0, 0.08170769073639056, 61.141739304590956, 0.17069646231232766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f65f884-0cd8-4e93-94a7-61be03039aad", 3, 0, 0.0, 1231.3333333333333, 174, 2788, 732.0, 2788.0, 2788.0, 2788.0, 0.05077688636132832, 0.03264464536576284, 0.03256200069395078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f616b514-5d4a-4c4d-ae17-510d02e68045", 3, 0, 0.0, 555.3333333333334, 182, 1023, 461.0, 1023.0, 1023.0, 1023.0, 0.026199500462857843, 0.02627625681187012, 0.016801111950465478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 358.6923076923076, 160, 946, 172.0, 890.0, 946.0, 946.0, 0.05882645742548272, 16.31095219954387, 0.12882870442646466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 911.4, 774, 958, 942.0, 958.0, 958.0, 958.0, 0.05072074174012721, 60.67964050406273, 0.11436932878706418], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1028.409090909091, 387, 2068, 981.5, 1598.1999999999998, 2002.299999999999, 2068.0, 0.08966928337939074, 0.02835600030161486, 0.040456258712186055], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=666c3fd9-54bc-44b6-9c70-934c29532a36", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 97.70588235294116, 83, 256, 86.0, 129.59999999999988, 256.0, 256.0, 0.07847409431662912, 0.060924711896211084, 0.027895088214114256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 208.53333333333333, 162, 336, 167.0, 331.8, 336.0, 336.0, 0.08951536382027701, 0.13873133045193325, 0.20132215124814257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d173ebb-5b44-4825-89d9-3f98596dd311", 3, 0, 0.0, 630.3333333333334, 189, 1241, 461.0, 1241.0, 1241.0, 1241.0, 0.05190491020450534, 0.033369856007128273, 0.03328537535900896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 24, 0, 0.0, 250.70833333333334, 161, 497, 175.0, 372.0, 476.0, 497.0, 0.12678288431061807, 0.19648870839936608, 0.28513767828843106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 83.26666666666665, 80, 91, 82.0, 88.6, 91.0, 91.0, 0.07866252726967612, 0.05845916333224954, 0.039484901383411646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 103.2, 78, 241, 81.0, 235.0, 241.0, 241.0, 0.07866417738247572, 0.02104881308867026, 0.04486316366344319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 92.46666666666667, 77, 238, 82.0, 151.60000000000005, 238.0, 238.0, 0.07859946237967733, 0.021185011344522404, 0.04620788706305249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 135.06666666666666, 78, 245, 83.0, 242.6, 245.0, 245.0, 0.07866376484778562, 0.021202342869129715, 0.04632250996407688], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 919.6140350877193, 631, 1460, 875.0, 1305.4, 1369.3, 1460.0, 0.24325085564555363, 291.01259103236515, 0.48032542003448186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1028.409090909091, 387, 2068, 981.5, 1598.1999999999998, 2002.299999999999, 2068.0, 0.09326894949486385, 0.029494318013201796, 0.042080326822878024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 119.5, 78, 236, 82.0, 236.0, 236.0, 236.0, 0.03735908619675163, 0.010069441201468212, 0.021999540016251203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 80.0, 78, 82, 80.0, 82.0, 82.0, 82.0, 0.03735908619675163, 0.010069441201468212, 0.021963056533637188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6aa82703-0dcf-46db-88ea-262413963e1d", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 156.82352941176472, 79, 725, 82.0, 338.5999999999997, 725.0, 725.0, 0.07484964028143465, 3.980742762975405, 0.043625025867155096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 151.52941176470588, 79, 633, 82.0, 320.1999999999997, 633.0, 633.0, 0.07490108650634897, 1.3144951363860666, 0.04372815614453266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 92.8235294117647, 81, 239, 84.0, 115.7999999999999, 239.0, 239.0, 0.07489943649188663, 0.05566256950227121, 0.03759600620784153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46b4fb7d-15f5-4a68-ba10-51f68700f9ef", 3, 0, 0.0, 278.6666666666667, 175, 381, 280.0, 381.0, 381.0, 381.0, 0.02243946953094029, 0.026522693316030008, 0.014389894197901161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 122.25, 80, 247, 81.0, 247.0, 247.0, 247.0, 0.0373594351253409, 0.00999656760189786, 0.021306552844920987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 109.58823529411767, 79, 246, 82.0, 242.0, 246.0, 246.0, 0.07484832207673274, 0.026640636695050325, 0.04231716371089175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 121.0, 82, 236, 83.0, 236.0, 236.0, 236.0, 0.03735908619675163, 0.027763930269265612, 0.018752510063603844], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 491.9230769230769, 375, 732, 461.0, 712.0, 732.0, 732.0, 0.07437283675162333, 0.013436498827197576, 0.050622917203009245], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 84.25, 84, 85, 84.0, 85.0, 85.0, 85.0, 0.03568847529911403, 0.028090733487388584, 0.01268613770398194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7e2f5d7-baef-4694-a250-daf6e410aac9", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1458.7619047619048, 981, 3093, 1241.0, 2821.8000000000006, 3086.7, 3093.0, 0.09884027411702688, 0.0511575637519768, 0.04546266514562467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 244.75, 164, 484, 165.5, 484.0, 484.0, 484.0, 0.03733014782738539, 0.05785443808794983, 0.08395637738912946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f492a7e-261c-45f0-a177-b0b181c05e26", 3, 0, 0.0, 294.3333333333333, 205, 449, 229.0, 449.0, 449.0, 449.0, 0.031554700072575805, 0.026305855106076387, 0.020235273158520296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bed8906-5289-45ac-8373-7314ae31708c", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["addBook", 60, 7, 11.666666666666666, 1049.65, 420, 4345, 712.0, 1769.8999999999996, 3235.2999999999965, 4345.0, 0.29347315698857407, 88.87622479187861, 1.0682537552336047], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72f955ed-882a-4135-9931-31755acc8bb3", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0eddad9-5396-404b-8118-68589fe9bb36", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 0.2923366707119741, 1.1156199433656957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5c55d57-0c4f-4082-a215-275be891a9ff", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 1.040182206840391, 1.9435820439739413], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 142.7894736842105, 79, 568, 84.0, 329.0, 338.6999999999997, 568.0, 0.24404550378270531, 0.1813658480260144, 0.1179712152074601], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 503.08771929824576, 387, 729, 480.0, 643.2, 718.0999999999999, 729.0, 0.24425570572758204, 71.81928753663836, 0.1228434457516648], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 136.1228070175438, 78, 328, 85.0, 246.2, 252.89999999999984, 328.0, 0.24441909727880073, 0.43250723073162783, 0.11886788129379176], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 773.40350877193, 545, 1130, 785.0, 972.2, 1042.4, 1130.0, 0.2438773938491554, 219.44130767620143, 0.12241501995943935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 24, 0, 0.0, 95.95833333333333, 83, 254, 88.0, 103.0, 217.25, 254.0, 0.13327780091628488, 0.09956788837984173, 0.047376093294460644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b15f29c-53b4-46a2-9c73-ee19bb15ca7a", 3, 0, 0.0, 276.0, 187, 418, 223.0, 418.0, 418.0, 418.0, 0.04508024283224139, 0.029275743636172386, 0.02890887968083188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, 3.9548022598870056, 209.81920903954804, 81, 3061, 88.0, 306.2000000000001, 458.29999999999995, 2877.7, 0.715729882733522, 1.50969138571573, 0.344644030529721], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 86.73333333333332, 81, 98, 86.0, 96.8, 98.0, 98.0, 0.0821067497222055, 0.0635846216110439, 0.029186383690315235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d17f3d4-c0cb-42a8-8e9a-c415c72ea118", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 87.69230769230766, 81, 99, 86.0, 97.4, 99.0, 99.0, 0.05797540950707523, 0.04704840361365187, 0.020608446348218148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 240.53333333333333, 162, 332, 187.0, 327.2, 332.0, 332.0, 0.07856447000408535, 0.12175958388328463, 0.17669333439395368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0eddad9-5396-404b-8118-68589fe9bb36", 3, 0, 0.0, 251.66666666666666, 171, 375, 209.0, 375.0, 375.0, 375.0, 0.021522347370686562, 0.025438685971016575, 0.013801765729248872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 289.11764705882354, 164, 809, 322.0, 545.7999999999997, 809.0, 809.0, 0.0748196626073332, 5.374448342524415, 0.16714509760665103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 107.53846153846155, 81, 343, 85.0, 246.1999999999999, 343.0, 343.0, 0.06863019411786445, 0.05690140117779972, 0.024395889315334627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/666c3fd9-54bc-44b6-9c70-934c29532a36", 3, 0, 0.0, 312.0, 175, 467, 294.0, 467.0, 467.0, 467.0, 0.036855036855036855, 0.029956714527027025, 0.023634252149877147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 109.56249999999999, 82, 260, 86.0, 257.2, 260.0, 260.0, 0.08179164600575609, 0.06350035017048446, 0.02907437416610861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f65f884-0cd8-4e93-94a7-61be03039aad", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.27045518338323354, 1.0321154565868262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 24, 0, 0.0, 90.0, 79, 251, 82.5, 90.5, 211.5, 251.0, 0.12684319010623119, 0.09426530045980656, 0.06366933565879182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 24, 0, 0.0, 121.83333333333333, 79, 246, 83.0, 242.0, 245.25, 246.0, 0.12684117898875868, 0.03393992484660145, 0.07233910989202645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 24, 0, 0.0, 121.66666666666667, 77, 245, 81.5, 242.0, 244.5, 245.0, 0.12684386049289412, 0.03418838427347536, 0.07457031642258032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 24, 0, 0.0, 145.33333333333334, 78, 330, 82.5, 244.5, 308.75, 330.0, 0.12684386049289412, 0.03418838427347536, 0.07469418738009291], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 41.666666666666664, 0.3785011355034065], "isController": false}, {"data": ["401/Unauthorized", 7, 58.333333333333336, 0.5299015897047691], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 12, "401/Unauthorized", 7, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
