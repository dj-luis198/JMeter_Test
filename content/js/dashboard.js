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

    var data = {"OkPercent": 97.27540500736377, "KoPercent": 2.72459499263623};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7686002522068096, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09649122807017543, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cbdaadb7-8685-4613-958c-2fcd3247069f"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=976ea2e5-1bb9-429a-9b8b-cf6ed90c1369"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b27a2645-e8da-43e6-8ec1-23dd211aae7b"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46ca1f5b-536c-4566-9613-92a752118c73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04946bee-25e7-4168-9df0-5db2250a6f9e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e738c989-09fe-47a8-863a-ef6249d53ff5"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c55d35e-4e9c-4854-b6b9-b9024669cddf"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ca555ee-dc26-4d4b-890b-d63f847f5ddb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1efb1894-8a50-4dfd-b7e7-c54c526cbbde"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=315f0076-6cb3-4894-9f54-9c4d22f1a998"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25643f0f-5c31-4098-b39b-428b9b53ec96"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11b00045-2870-47ba-9bb9-db508d366a8e"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=770c9e3c-15ca-4e62-b86c-0df9f8b8f262"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e32ddd4d-c439-46fd-8227-12900ef857ba"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4298245614035088, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/46ca1f5b-536c-4566-9613-92a752118c73"], "isController": false}, {"data": [0.2698412698412698, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3325c3ac-431b-4228-b4a4-542880874bf8"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8989071038251366, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ca555ee-dc26-4d4b-890b-d63f847f5ddb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/315f0076-6cb3-4894-9f54-9c4d22f1a998"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1efb1894-8a50-4dfd-b7e7-c54c526cbbde"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e738c989-09fe-47a8-863a-ef6249d53ff5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/04946bee-25e7-4168-9df0-5db2250a6f9e"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/976ea2e5-1bb9-429a-9b8b-cf6ed90c1369"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c55d35e-4e9c-4854-b6b9-b9024669cddf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25643f0f-5c31-4098-b39b-428b9b53ec96"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/770c9e3c-15ca-4e62-b86c-0df9f8b8f262"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cdf5e7a-21e2-4dee-aa92-6a7148f1d804"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e32ddd4d-c439-46fd-8227-12900ef857ba"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/11b00045-2870-47ba-9bb9-db508d366a8e"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1358, 37, 2.72459499263623, 353.3586156111921, 96, 2927, 112.0, 998.1000000000001, 1210.0, 1617.7400000000011, 5.236672129567146, 704.6071305914394, 3.8279065844018128], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1663.8421052631577, 1251, 2163, 1636.0, 1946.8000000000002, 2047.8999999999996, 2163.0, 0.2491868639177421, 299.85570062083593, 1.2252498631111635], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cbdaadb7-8685-4613-958c-2fcd3247069f", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 739.9999999999999, 105, 2927, 533.5, 2130.400000000001, 2927.0, 2927.0, 0.07833652391467194, 0.016390234617889122, 0.052307224830719666], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 739.9999999999999, 105, 2927, 533.5, 2130.400000000001, 2927.0, 2927.0, 0.07861364831201757, 0.016448216944189225, 0.05249226761068557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 139.8125, 99, 305, 103.0, 305.0, 305.0, 305.0, 0.10087636340709917, 0.026992308177290206, 0.05753105100561124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 142.74999999999997, 97, 314, 104.0, 312.6, 314.0, 314.0, 0.10087636340709917, 0.07496768803984616, 0.050635205850829076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 188.4375, 97, 308, 103.5, 307.3, 308.0, 308.0, 0.1008782714508187, 0.027189846601978474, 0.059403903989105146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 152.81250000000003, 99, 306, 103.5, 305.3, 306.0, 306.0, 0.10087699941365244, 0.027189503748211007, 0.05930464223341676], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 250.75, 102, 490, 222.0, 432.6000000000001, 490.0, 490.0, 0.0791405338029005, 0.1412154239335813, 0.05114379711334903], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 106.25, 102, 127, 104.5, 115.10000000000001, 127.0, 127.0, 0.09973134867949461, 0.07411675424325723, 0.05006046213013694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 114.5625, 100, 294, 103.0, 161.70000000000013, 294.0, 294.0, 0.09973321365347695, 0.02668642630962176, 0.056879098411748576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 759.0, 589, 810, 805.0, 810.0, 810.0, 810.0, 0.039900726991245784, 11.73213856425214, 0.02275588336219486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1091.0, 914, 1184, 1115.0, 1184.0, 1184.0, 1184.0, 0.03974120527127347, 35.75920636067926, 0.022626096360500423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 204.2, 99, 411, 104.0, 411.0, 411.0, 411.0, 0.03999136186583698, 0.07076596455165685, 0.022143654470634343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 136.31578947368422, 99, 310, 104.0, 308.0, 310.0, 310.0, 0.10907003444316878, 0.08105692989380023, 0.054748044632606206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=976ea2e5-1bb9-429a-9b8b-cf6ed90c1369", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 164.57894736842104, 100, 306, 103.0, 303.0, 306.0, 306.0, 0.10907128669674739, 0.03780719353838735, 0.0617225979919402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b27a2645-e8da-43e6-8ec1-23dd211aae7b", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1.1783613929889298, 2.2017700645756455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 185.68421052631575, 96, 1103, 102.0, 304.0, 1103.0, 1103.0, 0.10895370041173029, 5.187648780937117, 0.06356005857694999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 206.21052631578948, 99, 587, 104.0, 399.0, 587.0, 587.0, 0.10894370477402783, 1.7137691404055, 0.06366061778247957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46ca1f5b-536c-4566-9613-92a752118c73", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.31807053257042256, 1.2138259242957747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 141.8, 98, 302, 104.0, 302.0, 302.0, 302.0, 0.0400554367244266, 0.02976776108133657, 0.022492066520063768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 805.2666666666665, 98, 1448, 1014.0, 1370.6000000000001, 1448.0, 1448.0, 0.09863943341509447, 59.17948585428326, 0.05233798062063932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 103.31250000000001, 99, 110, 103.0, 109.3, 110.0, 110.0, 0.09973321365347695, 0.02688121774253871, 0.058632221308001095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 585.3333333333334, 101, 916, 806.0, 911.2, 916.0, 916.0, 0.09863943341509447, 19.34437451091281, 0.052434308192333745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 128.625, 100, 307, 103.0, 305.6, 307.0, 307.0, 0.0996084144208082, 0.02684758044935846, 0.05865612685131577], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 446.5000000000001, 104, 886, 450.5, 870.6, 886.0, 886.0, 0.07886551950196424, 0.016500915579390468, 0.05296851663816007], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 391.8421052631579, 205, 1203, 397.0, 614.0, 1203.0, 1203.0, 0.10888002567276395, 7.015564918998992, 0.2434075203863522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04946bee-25e7-4168-9df0-5db2250a6f9e", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e738c989-09fe-47a8-863a-ef6249d53ff5", 1, 0, 0.0, 864.0, 864, 864, 864.0, 864.0, 864.0, 864.0, 1.1574074074074074, 0.20910192418981483, 0.7979781539351852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 532.904761904762, 121, 1336, 394.0, 1098.0000000000002, 1316.6999999999998, 1336.0, 0.08826051140662038, 0.05421470866676194, 0.03990685232545434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 116.33333333333333, 99, 305, 103.0, 186.20000000000007, 305.0, 305.0, 0.09876933409714951, 0.0734018195780574, 0.049577575904233256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 157.26666666666665, 98, 310, 104.0, 309.4, 310.0, 310.0, 0.09876998446018911, 0.12532727845892486, 0.05079966648668581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c55d35e-4e9c-4854-b6b9-b9024669cddf", 2, 0, 0.0, 204.5, 183, 226, 204.5, 226.0, 226.0, 226.0, 0.027698912817671905, 0.0318916193476906, 0.017217146492625165], "isController": false}, {"data": ["login", 21, 0, 0.0, 2657.4761904761904, 1607, 4822, 2401.0, 4025.6, 4744.499999999999, 4822.0, 0.08851683716695541, 25.335273162696055, 0.16850059195634856], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 128.87499999999997, 103, 307, 109.0, 240.50000000000006, 307.0, 307.0, 0.09468688231604115, 0.07665568890624815, 0.033658227698280245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ca555ee-dc26-4d4b-890b-d63f847f5ddb", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1efb1894-8a50-4dfd-b7e7-c54c526cbbde", 1, 0, 0.0, 886.0, 886, 886, 886.0, 886.0, 886.0, 886.0, 1.128668171557562, 0.20390977708803612, 0.7781637979683973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 923.6000000000001, 204, 1555, 1120.0, 1475.8, 1555.0, 1555.0, 0.09857137224493014, 78.66800889729848, 0.20487571998173143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=315f0076-6cb3-4894-9f54-9c4d22f1a998", 1, 0, 0.0, 742.0, 742, 742, 742.0, 742.0, 742.0, 742.0, 1.3477088948787064, 0.24348256401617252, 0.9291821091644205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25643f0f-5c31-4098-b39b-428b9b53ec96", 3, 0, 0.0, 349.33333333333337, 196, 634, 218.0, 634.0, 634.0, 634.0, 0.08267195767195767, 0.03659956459435627, 0.053015545772707236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11b00045-2870-47ba-9bb9-db508d366a8e", 1, 0, 0.0, 687.0, 687, 687, 687.0, 687.0, 687.0, 687.0, 1.455604075691412, 0.262975345705968, 1.0035707787481805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 371.06249999999994, 201, 618, 402.5, 618.0, 618.0, 618.0, 0.10081089765803683, 0.15623720174150826, 0.2267260715883387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 8, 61.53846153846154, 553.9230769230769, 102, 1417, 108.0, 1363.3999999999999, 1417.0, 1417.0, 0.09118519713538195, 41.972398284666156, 0.11626249631752088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=770c9e3c-15ca-4e62-b86c-0df9f8b8f262", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e32ddd4d-c439-46fd-8227-12900ef857ba", 3, 0, 0.0, 318.6666666666667, 225, 499, 232.0, 499.0, 499.0, 499.0, 0.022847568637904117, 0.027005052644606068, 0.014651598377822626], "isController": false}, {"data": ["register", 24, 6, 25.0, 1052.9166666666667, 312, 2106, 1035.5, 1688.0, 2052.75, 2106.0, 0.0957392064017616, 0.03019898795680566, 0.04319483726329478], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 248.68749999999997, 205, 432, 210.5, 418.0, 432.0, 432.0, 0.09954210631096953, 0.15427082296436392, 0.22387253011148717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 108.11764705882354, 100, 124, 107.0, 116.0, 124.0, 124.0, 0.09394289377269135, 0.07293418022391565, 0.03339376302076138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 327.2631578947368, 203, 1421, 210.0, 444.0, 1421.0, 1421.0, 0.10147837976414288, 6.538647990861605, 0.22686071791947957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 104.72727272727273, 102, 118, 104.0, 115.20000000000002, 118.0, 118.0, 0.048220234964054004, 0.035835545710590916, 0.02420429762844117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 121.0, 101, 306, 102.0, 265.8000000000002, 306.0, 306.0, 0.04822086911541008, 0.012902849743771837, 0.02750096441738231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 122.36363636363637, 101, 308, 103.0, 268.20000000000016, 308.0, 308.0, 0.04822065772977143, 0.012996974153727458, 0.02834847261066641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 102.81818181818181, 100, 111, 102.0, 110.0, 111.0, 111.0, 0.04822108050290203, 0.012997088104297812, 0.028395812053955003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 105.75, 104, 107, 106.0, 107.0, 107.0, 107.0, 0.07729617963632147, 0.022796334228680746, 0.04778172041971825], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1143.4561403508774, 776, 1735, 1102.0, 1529.4, 1618.0999999999997, 1735.0, 0.25140699705368647, 300.7701716900284, 0.4964306133228066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1052.9166666666667, 312, 2106, 1035.5, 1688.0, 2052.75, 2106.0, 0.0934761441090555, 0.029485150925024343, 0.042173807205452774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 129.14285714285714, 97, 293, 103.0, 293.0, 293.0, 293.0, 0.054506096896267106, 0.014691096429071996, 0.032096851980907296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 101.85714285714285, 98, 105, 102.0, 105.0, 105.0, 105.0, 0.054506096896267106, 0.014691096429071996, 0.03204362337065703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 255.52941176470588, 97, 1117, 103.0, 1103.4, 1117.0, 1117.0, 0.09287536672111713, 9.853784039504811, 0.053661560114946924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 196.52941176470586, 100, 809, 103.0, 785.0, 809.0, 809.0, 0.09287587412587413, 3.23486328125, 0.05375255237926137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 102.76470588235294, 98, 119, 103.0, 107.79999999999998, 119.0, 119.0, 0.0928768889520209, 0.06902276610594521, 0.046619844649744856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 129.57142857142858, 98, 295, 103.0, 295.0, 295.0, 295.0, 0.054506096896267106, 0.014584639208571474, 0.03108550838615234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 103.3529411764706, 96, 119, 103.0, 115.0, 119.0, 119.0, 0.09287536672111713, 0.041262527930900725, 0.0520503261564349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 103.71428571428571, 101, 110, 103.0, 110.0, 110.0, 110.0, 0.05450694574222886, 0.04050760323226188, 0.027359931749517223], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 495.4, 104, 949, 525.0, 839.8000000000001, 949.0, 949.0, 0.07719106847876989, 0.015734715846811752, 0.05252108441872552], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 136.2857142857143, 103, 309, 108.0, 309.0, 309.0, 309.0, 0.05748259098672973, 0.04524508626494547, 0.020433264764814087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1553.3333333333333, 934, 2898, 1405.0, 2459.0000000000005, 2861.5999999999995, 2898.0, 0.08978234195101303, 0.046469376205114175, 0.04129637017473354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 234.71428571428572, 206, 399, 207.0, 399.0, 399.0, 399.0, 0.05446284078177518, 0.08440676593816133, 0.1224882053910432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46ca1f5b-536c-4566-9613-92a752118c73", 3, 0, 0.0, 452.6666666666667, 321, 538, 499.0, 538.0, 538.0, 538.0, 0.0371305510173771, 0.023871366620872317, 0.023810932781325806], "isController": false}, {"data": ["addBook", 63, 15, 23.80952380952381, 1021.0158730158731, 514, 3526, 850.0, 1825.6000000000001, 2087.9999999999995, 3526.0, 0.2912850293365637, 78.54922175170957, 1.0610916888983415], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3325c3ac-431b-4228-b4a4-542880874bf8", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 0.9618552334337349, 1.7972279743975903], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 185.35087719298244, 97, 508, 105.0, 408.4, 415.1, 508.0, 0.2526506152264104, 0.1877608576047835, 0.1221309126338605], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 657.0701754385966, 482, 927, 604.0, 893.0, 920.5999999999999, 927.0, 0.2522860658422371, 74.18048004339764, 0.12688215225464075], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 164.49122807017542, 97, 417, 106.0, 308.6, 408.4, 417.0, 0.25304317715686014, 0.44776780957835016, 0.12306201389073862], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 956.2105263157896, 672, 1320, 941.0, 1210.0, 1222.1999999999998, 1320.0, 0.2519114332434702, 226.67035044554072, 0.12644773113978874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 130.05263157894737, 104, 310, 109.0, 289.0, 310.0, 310.0, 0.09948737819341394, 0.07432406671675942, 0.03536465396719011], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 15, 8.19672131147541, 170.13661202185799, 99, 1750, 107.0, 317.19999999999993, 413.99999999999955, 946.9599999999967, 0.7565516129432339, 1.5682280749895612, 0.3648599668956992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 161.36363636363637, 104, 312, 109.0, 311.0, 312.0, 312.0, 0.04923726992766598, 0.03813003423109289, 0.017502310794600014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ca555ee-dc26-4d4b-890b-d63f847f5ddb", 3, 0, 0.0, 460.66666666666663, 219, 767, 396.0, 767.0, 767.0, 767.0, 0.02295069425850132, 0.02301793262058677, 0.014717730367593619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 108.12500000000001, 101, 118, 107.0, 115.2, 118.0, 118.0, 0.09537036485125204, 0.07739528631971723, 0.0339011843807185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 246.9090909090909, 206, 425, 208.0, 422.40000000000003, 425.0, 425.0, 0.048198261357263045, 0.07469789138083638, 0.10839901943923515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/315f0076-6cb3-4894-9f54-9c4d22f1a998", 3, 0, 0.0, 380.0, 213, 525, 402.0, 525.0, 525.0, 525.0, 0.02880488530854833, 0.02888927462097572, 0.018471882831328192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1efb1894-8a50-4dfd-b7e7-c54c526cbbde", 3, 0, 0.0, 432.0, 293, 595, 408.0, 595.0, 595.0, 595.0, 0.040094623311013995, 0.03342523772770405, 0.025711721329003116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e738c989-09fe-47a8-863a-ef6249d53ff5", 3, 0, 0.0, 404.3333333333333, 188, 525, 500.0, 525.0, 525.0, 525.0, 0.021968526424475866, 0.02596605450757548, 0.014087889666737454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04946bee-25e7-4168-9df0-5db2250a6f9e", 3, 0, 0.0, 526.0, 391, 654, 533.0, 654.0, 654.0, 654.0, 0.018316919338392874, 0.025251352017608666, 0.011746201528852201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 371.94117647058823, 201, 1220, 209.0, 1206.4, 1220.0, 1220.0, 0.09282364054318211, 13.191562783248608, 0.2059684491763267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/976ea2e5-1bb9-429a-9b8b-cf6ed90c1369", 3, 0, 0.0, 603.0, 194, 981, 634.0, 981.0, 981.0, 981.0, 0.038552978217567306, 0.02478585025380711, 0.024723101265822785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c55d35e-4e9c-4854-b6b9-b9024669cddf", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 117.47368421052633, 103, 307, 105.0, 117.0, 307.0, 307.0, 0.10727856856512091, 0.08894482882010513, 0.038134178669632826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 111.6, 103, 139, 106.0, 137.2, 139.0, 139.0, 0.10189663605238845, 0.07910920474770393, 0.03622106984674746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25643f0f-5c31-4098-b39b-428b9b53ec96", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/770c9e3c-15ca-4e62-b86c-0df9f8b8f262", 3, 0, 0.0, 562.0, 247, 949, 490.0, 949.0, 949.0, 949.0, 0.016028980396556973, 0.02209724348288372, 0.010279001100656654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cdf5e7a-21e2-4dee-aa92-6a7148f1d804", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.7112158964365256, 1.3289079899777283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 105.0, 97, 138, 104.0, 111.0, 138.0, 138.0, 0.10219724067450178, 0.075949316555953, 0.05129822432294328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 123.63157894736841, 98, 308, 103.0, 305.0, 308.0, 308.0, 0.10208412806722508, 0.03538524669435474, 0.05776861893606847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e32ddd4d-c439-46fd-8227-12900ef857ba", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 198.42105263157893, 98, 1317, 102.0, 318.0, 1317.0, 1317.0, 0.10153423574111976, 4.834383341505058, 0.05923178328853358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11b00045-2870-47ba-9bb9-db508d366a8e", 3, 0, 0.0, 362.0, 275, 492, 319.0, 492.0, 492.0, 492.0, 0.05594718585655142, 0.03596864976129201, 0.03587758988847861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 181.68421052631578, 98, 591, 104.0, 313.0, 591.0, 591.0, 0.10192914315143452, 1.6034246347986094, 0.05956169965505032], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 16.216216216216218, 0.4418262150220913], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.29455081001472755], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.81081081081081, 0.29455081001472755], "isController": false}, {"data": ["401/Unauthorized", 23, 62.16216216216216, 1.6936671575846833], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1358, 37, "401/Unauthorized", 23, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
