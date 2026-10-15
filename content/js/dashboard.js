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

    var data = {"OkPercent": 99.51495553759095, "KoPercent": 0.4850444624090542};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.771557719054242, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.046296296296296294, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9422a15c-58d9-493b-a2b1-3cc25e416043"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09eda4f1-e6d2-4564-91f5-f469078a7b00"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=908b6cc0-77e0-4b4c-877d-3481659ac654"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/924da82a-aabd-4e2d-8c66-64177f38d2ad"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=edc8ac12-3ade-4d37-981e-c0e261d105d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3da87660-63ed-42ca-ae00-cb451fdaafd6"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bbee48b5-8ee5-40fc-bfbe-7f6a07c90d2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec6dad8c-bbe1-4e24-a5cc-d5a3f0965653"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/616d10b4-a79b-44ae-8f7e-cdc37f9d05d6"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51efba96-a11f-4963-b3a6-b3414675efc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e7098632-ec31-41d7-92a0-4cf6b1a335c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8415fe6d-4b71-4cd5-9269-8df45845c9fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/908b6cc0-77e0-4b4c-877d-3481659ac654"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/34c08b80-fe14-4d91-b383-9209a50adf3f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/13391be2-a8c4-4022-9971-3d29674d61d4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2ff6d249-eb20-4e0d-a20b-d492a36b35ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e8db4ca-4ed1-4128-8ab7-a277ec162013"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b515849-3f6c-4ae5-b9d3-68be45194414"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/af7234f8-f205-4a57-993b-e5935788e41e"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/edc8ac12-3ade-4d37-981e-c0e261d105d0"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13391be2-a8c4-4022-9971-3d29674d61d4"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=924da82a-aabd-4e2d-8c66-64177f38d2ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.37962962962962965, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a6d2d87-3ecb-437e-a1a8-8c2e9597e8b1"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.48148148148148145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9608433734939759, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3da87660-63ed-42ca-ae00-cb451fdaafd6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a6d2d87-3ecb-437e-a1a8-8c2e9597e8b1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbee48b5-8ee5-40fc-bfbe-7f6a07c90d2d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/51efba96-a11f-4963-b3a6-b3414675efc3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ff6d249-eb20-4e0d-a20b-d492a36b35ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e8db4ca-4ed1-4128-8ab7-a277ec162013"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b515849-3f6c-4ae5-b9d3-68be45194414"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af7234f8-f205-4a57-993b-e5935788e41e"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1237, 6, 0.4850444624090542, 412.45513338722753, 103, 3327, 137.0, 1151.4, 1396.5999999999995, 2043.9799999999968, 4.816246753802966, 683.2132032068241, 3.504399278341685], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1841.2222222222224, 1364, 2599, 1781.5, 2247.0, 2403.5, 2599.0, 0.240919778175345, 289.90808502655693, 1.1846006671024043], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9422a15c-58d9-493b-a2b1-3cc25e416043", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.8064038825757576, 1.5067668876262625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09eda4f1-e6d2-4564-91f5-f469078a7b00", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.9310085641399416, 1.7395909256559765], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 1050.0, 466, 2617, 817.5, 2614.0, 2617.0, 2617.0, 0.0720963206844344, 0.013025214186152701, 0.04900296796520151], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 1050.0, 466, 2617, 817.5, 2614.0, 2617.0, 2617.0, 0.07101642254771416, 0.01283011540168664, 0.04826897470039947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=908b6cc0-77e0-4b4c-877d-3481659ac654", 1, 0, 0.0, 933.0, 933, 933, 933.0, 933.0, 933.0, 933.0, 1.0718113612004287, 0.19363779474812431, 0.7389636923901393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 154.9375, 104, 340, 113.5, 339.3, 340.0, 340.0, 0.08921999420070038, 0.023873318760734282, 0.05088327794258694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 118.625, 108, 162, 115.0, 143.8, 162.0, 162.0, 0.08919910354900933, 0.06628956816483994, 0.04477376877362382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 126.0, 104, 323, 113.0, 183.70000000000016, 323.0, 323.0, 0.08922596475574392, 0.024049185813071604, 0.05254224291768905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 182.8125, 106, 347, 117.0, 341.4, 347.0, 347.0, 0.08922148676455008, 0.024047978854507636, 0.05245247561744057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/924da82a-aabd-4e2d-8c66-64177f38d2ad", 3, 0, 0.0, 407.3333333333333, 352, 516, 354.0, 516.0, 516.0, 516.0, 0.061831447474185376, 0.02797711978812424, 0.03965102588676601], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 276.66666666666663, 204, 478, 239.0, 451.30000000000007, 478.0, 478.0, 0.07183908045977011, 0.17140121752274906, 0.0464428430316092], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 136.23809523809527, 110, 339, 115.0, 291.0000000000001, 338.4, 339.0, 0.09650912700601115, 0.0717221148941157, 0.048443057891689185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 155.7619047619048, 105, 350, 113.0, 342.4, 349.3, 350.0, 0.09651356245346666, 0.03963052252902301, 0.054270926208487676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 886.5, 882, 891, 886.5, 891.0, 891.0, 891.0, 0.05808550185873606, 17.079066166647305, 0.033126887778810406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1164.0, 1162, 1166, 1164.0, 1166.0, 1166.0, 1166.0, 0.05762028233938346, 51.84683133462979, 0.032805297464707575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 223.0, 108, 338, 223.0, 338.0, 338.0, 338.0, 0.059021424777194124, 0.10444025556276927, 0.03268080844596588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 113.75, 105, 119, 114.0, 118.4, 119.0, 119.0, 0.06690977217222575, 0.04972493810846074, 0.03358556923488675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 130.66666666666666, 106, 336, 112.5, 271.2000000000002, 336.0, 336.0, 0.06691201070592172, 0.017904190364670457, 0.03816075610572098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 164.5, 107, 331, 111.5, 330.4, 331.0, 331.0, 0.06691163760657073, 0.018034777323646015, 0.03933672445230037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 146.66666666666669, 105, 323, 112.5, 322.7, 323.0, 323.0, 0.06683300659418999, 0.01801358380859027, 0.03935576462528961], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=edc8ac12-3ade-4d37-981e-c0e261d105d0", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 220.5, 115, 326, 220.5, 326.0, 326.0, 326.0, 0.05904407640303486, 0.04387943568623978, 0.03315463274584478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 253.14285714285717, 107, 1428, 113.0, 1120.8000000000006, 1416.9999999999998, 1428.0, 0.09651178822556183, 8.294152347879038, 0.05594847247116136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 924.3571428571427, 109, 1573, 1156.0, 1514.0, 1573.0, 1573.0, 0.12169785898695226, 78.22647713492816, 0.06407473769765036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3da87660-63ed-42ca-ae00-cb451fdaafd6", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 175.8571428571429, 108, 672, 112.0, 597.0000000000002, 670.9, 672.0, 0.09651178822556183, 2.726170779907165, 0.056042722264350385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 622.5714285714286, 109, 1111, 724.5, 1033.0, 1111.0, 1111.0, 0.1217042066189702, 25.570142100527676, 0.06419693153269061], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 753.0833333333333, 213, 2158, 516.5, 1904.500000000001, 2158.0, 2158.0, 0.0711283926761465, 0.012850344379967873, 0.04903969260679632], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 334.3333333333333, 220, 446, 333.0, 446.0, 446.0, 446.0, 0.06678948510872772, 0.10351065709721766, 0.15021111738808585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbee48b5-8ee5-40fc-bfbe-7f6a07c90d2d", 3, 0, 0.0, 335.6666666666667, 231, 479, 297.0, 479.0, 479.0, 479.0, 0.02252049364922079, 0.022586471657958743, 0.014441853023751615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec6dad8c-bbe1-4e24-a5cc-d5a3f0965653", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 629.6666666666666, 189, 1499, 512.0, 1388.4, 1492.5, 1499.0, 0.09039723126194535, 0.05552720553101917, 0.040872966869414745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 113.85714285714285, 108, 120, 113.5, 119.0, 120.0, 120.0, 0.1216999747907195, 0.09044304767161869, 0.061087682658622876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 249.49999999999997, 106, 452, 331.0, 401.5, 452.0, 452.0, 0.1216999747907195, 0.16312686353086397, 0.06210637664403627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/616d10b4-a79b-44ae-8f7e-cdc37f9d05d6", 1, 0, 0.0, 836.0, 836, 836, 836.0, 836.0, 836.0, 836.0, 1.1961722488038278, 0.3819807864832536, 0.7137316836124402], "isController": false}, {"data": ["login", 21, 0, 0.0, 2949.714285714286, 1921, 4675, 2999.0, 3686.4, 4579.0999999999985, 4675.0, 0.09086700099953701, 10.48229283405522, 0.151449227251879], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51efba96-a11f-4963-b3a6-b3414675efc3", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7098632-ec31-41d7-92a0-4cf6b1a335c2", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 121.0, 113, 160, 118.0, 128.2, 156.89999999999995, 160.0, 0.09626359723310918, 0.07793215049438233, 0.034218700578956776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8415fe6d-4b71-4cd5-9269-8df45845c9fd", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.8023516017587939, 1.499195194723618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/908b6cc0-77e0-4b4c-877d-3481659ac654", 3, 0, 0.0, 459.6666666666667, 438, 478, 463.0, 478.0, 478.0, 478.0, 0.03133224714876551, 0.0258144262804445, 0.020092619428082048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1039.7857142857142, 222, 1687, 1274.5, 1628.0, 1687.0, 1687.0, 0.12157421237278127, 103.94313610450172, 0.2512047515978325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34c08b80-fe14-4d91-b383-9209a50adf3f", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.5957760027985074, 1.1132083722014925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13391be2-a8c4-4022-9971-3d29674d61d4", 3, 0, 0.0, 437.3333333333333, 283, 525, 504.0, 525.0, 525.0, 525.0, 0.03431198746468725, 0.034412510865462695, 0.02200345550307092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ff6d249-eb20-4e0d-a20b-d492a36b35ca", 3, 0, 0.0, 477.66666666666663, 234, 794, 405.0, 794.0, 794.0, 794.0, 0.027474791878451522, 0.022904603515857533, 0.017618925781428874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e8db4ca-4ed1-4128-8ab7-a277ec162013", 3, 0, 0.0, 439.0, 389, 488, 440.0, 488.0, 488.0, 488.0, 0.040027752575118744, 0.03336949034664034, 0.025668838728184876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 345.0625, 222, 462, 366.0, 457.1, 462.0, 462.0, 0.08913897323045211, 0.13814799855149168, 0.20047563998997187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1385.0, 1278, 1492, 1385.0, 1492.0, 1492.0, 1492.0, 0.05708414202534536, 68.29247952106405, 0.12871805071926018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b515849-3f6c-4ae5-b9d3-68be45194414", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af7234f8-f205-4a57-993b-e5935788e41e", 3, 0, 0.0, 767.0, 223, 1301, 777.0, 1301.0, 1301.0, 1301.0, 0.02448419952990337, 0.02455593058321363, 0.015701130557913293], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1422.0000000000002, 137, 2440, 1409.0, 2313.7, 2430.1, 2440.0, 0.09269402544872335, 0.0296087627454285, 0.04182093726299823], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/edc8ac12-3ade-4d37-981e-c0e261d105d0", 3, 0, 0.0, 368.3333333333333, 223, 504, 378.0, 504.0, 504.0, 504.0, 0.06647021026743181, 0.030076039150953846, 0.04262575332904969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 403.8095238095238, 223, 1544, 231.0, 1285.2000000000005, 1532.9999999999998, 1544.0, 0.09645814864660031, 11.125490221268102, 0.21458618736536048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 121.94117647058823, 111, 136, 121.0, 131.2, 136.0, 136.0, 0.11028576989198483, 0.08562225299231242, 0.03920314476629148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13391be2-a8c4-4022-9971-3d29674d61d4", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 468.52941176470586, 226, 1376, 451.0, 1197.6, 1376.0, 1376.0, 0.10615313526407154, 15.08587403252345, 0.2355455627208922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=924da82a-aabd-4e2d-8c66-64177f38d2ad", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 141.875, 106, 351, 112.5, 351.0, 351.0, 351.0, 0.04078448965858284, 0.030309567021661665, 0.02047190203565584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 165.875, 105, 333, 113.0, 333.0, 333.0, 333.0, 0.04074170269760999, 0.018550604377695953, 0.02280779401504387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 233.87499999999997, 110, 867, 114.0, 867.0, 867.0, 867.0, 0.04078511343359673, 4.596933349796075, 0.023539064491460617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 232.625, 105, 870, 113.0, 870.0, 870.0, 870.0, 0.04074170269760999, 1.507035184916403, 0.023553796872055773], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1260.555555555555, 880, 2084, 1129.5, 1781.0, 1904.5, 2084.0, 0.2395687762028349, 286.6075439209423, 0.4730547514473947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1422.0000000000002, 137, 2440, 1409.0, 2313.7, 2430.1, 2440.0, 0.08892122387939048, 0.028403636675962976, 0.04011875530495938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 205.2, 108, 335, 139.0, 335.0, 335.0, 335.0, 0.13942334504489431, 0.03757894846913167, 0.08210183306842897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 156.4, 108, 338, 111.0, 338.0, 338.0, 338.0, 0.13950503613180437, 0.03760096676990039, 0.08201370288217405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 258.8823529411765, 105, 1300, 114.0, 1050.3999999999999, 1300.0, 1300.0, 0.1074290336442456, 11.397882285426304, 0.062070382605343644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 252.94117647058823, 106, 887, 115.0, 883.0, 887.0, 887.0, 0.10743310709184899, 3.741891170262516, 0.06217765130689215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 153.82352941176472, 109, 337, 115.0, 334.6, 337.0, 337.0, 0.10741885137654099, 0.07982982997807392, 0.053919228132365306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 153.4, 107, 320, 116.0, 320.0, 320.0, 320.0, 0.13950892857142858, 0.03732953752790178, 0.07956368582589285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 150.6470588235294, 108, 340, 112.0, 335.2, 340.0, 340.0, 0.1074276758970211, 0.0477278059161053, 0.06020590567850056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 154.4, 109, 321, 114.0, 321.0, 321.0, 321.0, 0.1395400759098013, 0.10370116969468632, 0.07004257716566198], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 601.4999999999999, 438, 996, 510.5, 935.4000000000002, 996.0, 996.0, 0.070992894794446, 0.012825864782199714, 0.048322312179422705], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 161.2, 114, 340, 118.0, 340.0, 340.0, 340.0, 0.15933715742511154, 0.12541577039515617, 0.05663938017845762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1746.5714285714287, 1164, 3327, 1624.0, 2816.8000000000006, 3291.8999999999996, 3327.0, 0.09302037146135003, 0.04814530944776906, 0.04278573726396081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 363.0, 220, 660, 256.0, 660.0, 660.0, 660.0, 0.13899699766485044, 0.21541819852941177, 0.3126075054903814], "isController": false}, {"data": ["addBook", 56, 3, 5.357142857142857, 1213.7321428571427, 592, 3086, 958.5, 2062.7000000000003, 2279.099999999999, 3086.0, 0.2647704062334518, 97.17690308900778, 0.9601944215594032], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1a6d2d87-3ecb-437e-a1a8-8c2e9597e8b1", 3, 0, 0.0, 360.33333333333337, 204, 672, 205.0, 672.0, 672.0, 672.0, 0.01881845211958499, 0.02594275544480548, 0.012067822485541155], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 197.4814814814815, 108, 576, 115.0, 456.5, 467.5, 576.0, 0.24083919078031896, 0.17898303142951438, 0.11642128851197059], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 734.6296296296294, 534, 1134, 678.5, 919.0, 1010.5, 1134.0, 0.24066959629903642, 70.76485229460633, 0.12103988485742555], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 162.5370370370371, 107, 452, 115.5, 338.5, 344.75, 452.0, 0.24099826838281235, 0.4264539670992734, 0.11720423599085991], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1056.7962962962963, 750, 1638, 1005.0, 1325.5, 1451.5, 1638.0, 0.24010030857335954, 216.04267970563257, 0.12051910020186211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 137.52941176470588, 109, 404, 117.0, 204.79999999999984, 404.0, 404.0, 0.10198205115899601, 0.07618776282874214, 0.03625143224792437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 3, 1.8072289156626506, 194.6987951807229, 108, 1620, 122.0, 333.6, 411.6500000000001, 1313.1400000000058, 0.7143379679236432, 1.5575294207192436, 0.34352384452606255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 120.875, 111, 150, 116.0, 150.0, 150.0, 150.0, 0.041553045059083235, 0.0321792624334502, 0.014770808985845993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3da87660-63ed-42ca-ae00-cb451fdaafd6", 3, 0, 0.0, 426.6666666666667, 244, 531, 505.0, 531.0, 531.0, 531.0, 0.026210029704700332, 0.026286816901100823, 0.01680786410099598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 120.06249999999999, 111, 149, 118.0, 136.4, 149.0, 149.0, 0.08514261387824607, 0.06909522669220945, 0.030265538527032784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 404.5, 221, 983, 233.5, 983.0, 983.0, 983.0, 0.04071702684269995, 6.144180463270697, 0.09027131854456988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 441.47058823529414, 224, 1415, 232.0, 1341.3999999999999, 1415.0, 1415.0, 0.10734152917479621, 15.25476175113498, 0.2381825165116529], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a6d2d87-3ecb-437e-a1a8-8c2e9597e8b1", 1, 0, 0.0, 942.0, 942, 942, 942.0, 942.0, 942.0, 942.0, 1.0615711252653928, 0.19178775212314225, 0.7319035297239915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbee48b5-8ee5-40fc-bfbe-7f6a07c90d2d", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51efba96-a11f-4963-b3a6-b3414675efc3", 3, 0, 0.0, 797.6666666666666, 246, 1151, 996.0, 1151.0, 1151.0, 1151.0, 0.020145179594276082, 0.027771756374270574, 0.012918621028881472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ff6d249-eb20-4e0d-a20b-d492a36b35ca", 1, 0, 0.0, 2158.0, 2158, 2158, 2158.0, 2158.0, 2158.0, 2158.0, 0.4633920296570899, 0.08371828660797034, 0.3194870829471733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 134.16666666666666, 108, 332, 116.0, 271.7000000000002, 332.0, 332.0, 0.06750788998464197, 0.055970897067344746, 0.023996945267978194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 118.42857142857143, 112, 141, 116.5, 133.5, 141.0, 141.0, 0.1275324296749745, 0.09901199374180149, 0.04533379336102609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e8db4ca-4ed1-4128-8ab7-a277ec162013", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b515849-3f6c-4ae5-b9d3-68be45194414", 3, 0, 0.0, 338.6666666666667, 211, 545, 260.0, 545.0, 545.0, 545.0, 0.018370871146709777, 0.025325728940858043, 0.011780799530930424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 112.99999999999999, 105, 130, 113.0, 120.39999999999999, 130.0, 130.0, 0.10685036549110313, 0.07940735169797801, 0.05363387486565138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 157.52941176470588, 103, 342, 114.0, 337.2, 342.0, 342.0, 0.10670215036215965, 0.047405470525100114, 0.059799297962616585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af7234f8-f205-4a57-993b-e5935788e41e", 1, 0, 0.0, 1313.0, 1313, 1313, 1313.0, 1313.0, 1313.0, 1313.0, 0.7616146230007617, 0.13759639185072353, 0.525097581873572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 313.2352941176471, 105, 1270, 113.0, 1089.1999999999998, 1270.0, 1270.0, 0.10623008185965131, 11.27067727535462, 0.061377651846528776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 295.94117647058823, 108, 901, 182.0, 900.2, 901.0, 901.0, 0.106325092096293, 3.7032990487031467, 0.06153637999024311], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 50.0, 0.2425222312045271], "isController": false}, {"data": ["401/Unauthorized", 3, 50.0, 0.2425222312045271], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1237, 6, "406/Not Acceptable", 3, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
