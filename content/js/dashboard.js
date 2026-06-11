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

    var data = {"OkPercent": 97.37991266375546, "KoPercent": 2.6200873362445414};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7918227215980025, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3474576271186441, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2e525e2-ee63-4cf2-bd86-d88126f2713f"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a69e70d6-3de9-4e08-a5d3-4aa8186d7d35"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e662aea7-187b-471c-9e8a-f07dabcde63a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c643480-d70f-4bfd-ac7b-5a019a045f34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/028a9470-e653-4421-aa21-464d8018381d"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72cb1479-9b33-4c9d-8465-6bb83974157f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed1684ed-9463-464d-aebf-0a2a151c8e87"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=028a9470-e653-4421-aa21-464d8018381d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8087555f-7119-4411-b2a0-aa67aab43a7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=506b783e-c28c-4a06-8219-1f8af0f63f86"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/73a12817-cd51-43c6-bb71-5f7f23f455a7"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68f5d12b-74f7-4137-8ec2-3af4b1d39c59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=024c6f8e-7e79-4f74-add2-dc1e8df4f5b3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2647058823529412, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4830508474576271, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73a12817-cd51-43c6-bb71-5f7f23f455a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/506b783e-c28c-4a06-8219-1f8af0f63f86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/627fd740-933a-48fe-9090-936b7577028a"], "isController": false}, {"data": [0.3389830508474576, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a69e70d6-3de9-4e08-a5d3-4aa8186d7d35"], "isController": false}, {"data": [0.8135593220338984, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9265536723163842, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e662aea7-187b-471c-9e8a-f07dabcde63a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/68f5d12b-74f7-4137-8ec2-3af4b1d39c59"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed1684ed-9463-464d-aebf-0a2a151c8e87"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=627fd740-933a-48fe-9090-936b7577028a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72cb1479-9b33-4c9d-8465-6bb83974157f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/024c6f8e-7e79-4f74-add2-dc1e8df4f5b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98eed6b1-d94b-4dbc-98a7-70c78747afc6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a2acac5-3892-4cc8-a4e2-536851425d70"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8087555f-7119-4411-b2a0-aa67aab43a7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1374, 36, 2.6200873362445414, 317.01673944686996, 80, 2587, 97.0, 892.0, 1078.25, 1703.5, 5.3247558518059215, 763.7945735460103, 3.9009024460839403], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1394.4237288135591, 1001, 2073, 1335.0, 1657.0, 1739.0, 2073.0, 0.2553913547862071, 307.32174752075593, 1.2557572962388213], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c2e525e2-ee63-4cf2-bd86-d88126f2713f", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 513.3750000000002, 87, 1675, 450.5, 1320.1000000000004, 1675.0, 1675.0, 0.08543494396001644, 0.0178754265072593, 0.057047014582677004], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 513.3750000000002, 87, 1675, 450.5, 1320.1000000000004, 1675.0, 1675.0, 0.08669314419779041, 0.01813867787536777, 0.05788714584496015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 129.66666666666669, 81, 260, 84.0, 251.0, 260.0, 260.0, 0.08169786314700168, 0.02867758108512917, 0.046212126799622374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 112.33333333333334, 82, 252, 85.5, 249.3, 252.0, 252.0, 0.08175686417005427, 0.06075876331387823, 0.04103811346035928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 170.22222222222223, 81, 490, 88.0, 277.60000000000036, 490.0, 490.0, 0.08176057777474961, 1.3563863386023483, 0.04775577150189639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 176.83333333333331, 82, 948, 84.0, 318.000000000001, 948.0, 948.0, 0.08169934640522876, 4.104864692549474, 0.047640222176833696], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 323.0625, 84, 1407, 194.0, 1156.4000000000003, 1407.0, 1407.0, 0.08470672942023538, 0.1508166506297416, 0.05474089667367262], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a69e70d6-3de9-4e08-a5d3-4aa8186d7d35", 3, 0, 0.0, 368.6666666666667, 197, 486, 423.0, 486.0, 486.0, 486.0, 0.02512562814070352, 0.029697641855108876, 0.01611246335845896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e662aea7-187b-471c-9e8a-f07dabcde63a", 1, 0, 0.0, 912.0, 912, 912, 912.0, 912.0, 912.0, 912.0, 1.0964912280701753, 0.1980965597587719, 0.7559793037280701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 84.82352941176472, 83, 90, 84.0, 87.6, 90.0, 90.0, 0.11684410933859361, 0.08683434297526342, 0.05865026582034875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 93.3529411764706, 82, 245, 84.0, 116.99999999999989, 245.0, 245.0, 0.11684732179065084, 0.03126578727601399, 0.06663948820873056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 589.7777777777778, 488, 748, 643.0, 748.0, 748.0, 748.0, 0.0468640162461923, 13.779576808169962, 0.026727134265406547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 817.2222222222222, 571, 1054, 816.0, 1054.0, 1054.0, 1054.0, 0.046844746101476126, 42.15098488638848, 0.02667039743863338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 176.44444444444446, 83, 253, 245.0, 253.0, 253.0, 253.0, 0.04700475270277328, 0.08317637880607928, 0.026027045686008252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c643480-d70f-4bfd-ac7b-5a019a045f34", 2, 0, 0.0, 193.0, 190, 196, 193.0, 196.0, 196.0, 196.0, 0.018437088046313967, 0.026251244503443124, 0.011460162638162928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 108.71428571428572, 82, 258, 85.5, 253.5, 258.0, 258.0, 0.06955830476474388, 0.05169323234958016, 0.034915008446365574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 95.35714285714286, 81, 248, 83.5, 167.5, 248.0, 248.0, 0.06955968718014965, 0.026075178495125854, 0.03925347860542765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 176.85714285714286, 81, 892, 85.0, 570.5, 892.0, 892.0, 0.06956037840845855, 4.488163129335102, 0.04046690540782256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 136.57142857142856, 83, 654, 84.0, 451.0, 654.0, 654.0, 0.06955899596557824, 1.478313042187531, 0.04053402987558877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 142.33333333333334, 82, 279, 85.0, 279.0, 279.0, 279.0, 0.04700524369607454, 0.03493260786397727, 0.026394546020744983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/028a9470-e653-4421-aa21-464d8018381d", 3, 0, 0.0, 604.3333333333333, 311, 1190, 312.0, 1190.0, 1190.0, 1190.0, 0.02235835979072575, 0.03082280394326939, 0.014337880464755773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 628.1428571428572, 81, 1088, 824.5, 1082.0, 1088.0, 1088.0, 0.06410520580060534, 37.08744168286468, 0.03414532306734252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 103.6470588235294, 83, 252, 84.0, 244.79999999999998, 252.0, 252.0, 0.11671976271558827, 0.0314596235444359, 0.06861845425271888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 457.5, 83, 751, 649.5, 709.5, 751.0, 751.0, 0.06405651614910526, 12.114214984534927, 0.034181943955123834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 83.52941176470588, 81, 86, 83.0, 85.2, 86.0, 86.0, 0.1168481249312658, 0.03149422117288024, 0.06880802669292313], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 465.53333333333336, 83, 1792, 393.0, 1285.0000000000002, 1792.0, 1792.0, 0.08647427102189528, 0.01825755604974, 0.05797604446507016], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 287.07142857142856, 166, 1141, 172.0, 824.0, 1141.0, 1141.0, 0.06952859611831781, 6.041514120202527, 0.15510076059317826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72cb1479-9b33-4c9d-8465-6bb83974157f", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed1684ed-9463-464d-aebf-0a2a151c8e87", 3, 0, 0.0, 272.0, 173, 442, 201.0, 442.0, 442.0, 442.0, 0.0327908273125731, 0.027336363524576725, 0.021027971941982096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 556.3333333333331, 99, 1266, 518.0, 1062.0, 1220.75, 1266.0, 0.10514786418400876, 0.06458789704271632, 0.04754244249726178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 84.57142857142857, 82, 91, 84.0, 89.0, 91.0, 91.0, 0.06410432521039955, 0.0476400307471817, 0.03217736636537634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 155.07142857142853, 81, 255, 86.5, 255.0, 255.0, 255.0, 0.06405710233122097, 0.07899005685067832, 0.03307412607810391], "isController": false}, {"data": ["login", 24, 0, 0.0, 2697.541666666666, 1549, 4593, 2669.0, 3267.0, 4269.75, 4593.0, 0.10198704764494909, 45.8902747183139, 0.2172951574212575], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=028a9470-e653-4421-aa21-464d8018381d", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8087555f-7119-4411-b2a0-aa67aab43a7c", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 89.11764705882354, 85, 115, 86.0, 101.39999999999999, 115.0, 115.0, 0.11228756184072339, 0.09090467652925752, 0.03991471924806965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=506b783e-c28c-4a06-8219-1f8af0f63f86", 1, 0, 0.0, 1792.0, 1792, 1792, 1792.0, 1792.0, 1792.0, 1792.0, 0.5580357142857143, 0.10081699916294642, 0.38473946707589285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73a12817-cd51-43c6-bb71-5f7f23f455a7", 3, 0, 0.0, 392.6666666666667, 203, 578, 397.0, 578.0, 578.0, 578.0, 0.04500855162480871, 0.028936161933267323, 0.02886290582710715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 725.9285714285713, 169, 1173, 908.0, 1167.0, 1173.0, 1173.0, 0.06403132046303793, 49.280690118995345, 0.13347600311924004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68f5d12b-74f7-4137-8ec2-3af4b1d39c59", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.26451546486090777, 1.0094482064421668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=024c6f8e-7e79-4f74-add2-dc1e8df4f5b3", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.0883377259036144, 4.153332078313253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 345.94444444444446, 170, 1034, 332.0, 554.3000000000008, 1034.0, 1034.0, 0.0816637630662021, 5.5472122529104055, 0.1825029149426539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, 47.05882352941177, 548.1176470588235, 83, 1333, 656.0, 1240.1999999999998, 1333.0, 1333.0, 0.0884463104881716, 56.029538628926105, 0.13316230190627812], "isController": false}, {"data": ["register", 24, 9, 37.5, 1073.0416666666667, 127, 2587, 1069.5, 1811.0, 2412.5, 2587.0, 0.1047742115740579, 0.03258846326790766, 0.04727117748751441], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 97.10000000000002, 83, 266, 86.0, 100.60000000000001, 257.7499999999999, 266.0, 0.09206238146968386, 0.07147421217617057, 0.03272529966305168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 199.1764705882353, 168, 336, 170.0, 333.6, 336.0, 336.0, 0.11664928363616402, 0.18078360657284406, 0.2623469728653181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 358.3333333333333, 168, 1149, 333.0, 935.7000000000004, 1149.0, 1149.0, 0.118519298892503, 15.917748841144634, 0.2631833172564099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 102.0, 82, 249, 85.0, 207.00000000000014, 249.0, 249.0, 0.05873916384800262, 0.04365283563313476, 0.029484306853391942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 133.99999999999997, 82, 354, 84.5, 322.2000000000001, 354.0, 354.0, 0.05873945137352417, 0.02306938414132712, 0.03308874368550898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 195.25, 81, 1092, 84.0, 838.5000000000009, 1092.0, 1092.0, 0.058738301288326744, 4.418914719634746, 0.03411104475858558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 117.83333333333333, 81, 491, 83.5, 371.00000000000045, 491.0, 491.0, 0.05873801377406423, 1.4537562806844937, 0.03416823913224375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 86.0, 83, 88, 86.5, 88.0, 88.0, 88.0, 0.03579034018718348, 0.010555354234892003, 0.02212430208836635], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 962.4406779661019, 653, 1723, 913.0, 1301.0, 1389.0, 1723.0, 0.2548287896064407, 304.8638251906897, 0.5031873169767803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1073.0416666666667, 127, 2587, 1069.5, 1811.0, 2412.5, 2587.0, 0.10262286950646952, 0.03191932025176811, 0.04630055245311417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 120.4, 84, 255, 85.0, 255.0, 255.0, 255.0, 0.031343639121876606, 0.008448090232068304, 0.018457240615714448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 120.6, 83, 255, 85.0, 255.0, 255.0, 255.0, 0.03134304967873374, 0.008447931358721203, 0.018426285065036827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73a12817-cd51-43c6-bb71-5f7f23f455a7", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 91.69999999999999, 81, 246, 83.5, 86.9, 238.0499999999999, 246.0, 0.09517283386630121, 0.025652052878026497, 0.05595121678468098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 128.75000000000003, 81, 331, 84.0, 248.8, 326.9, 331.0, 0.09517238097504103, 0.02565193080967903, 0.056043892312450924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 102.05, 82, 247, 85.0, 230.70000000000033, 246.95, 247.0, 0.09516875800012373, 0.07072600081845132, 0.047770255480530856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/506b783e-c28c-4a06-8219-1f8af0f63f86", 3, 0, 0.0, 519.6666666666666, 285, 835, 439.0, 835.0, 835.0, 835.0, 0.021984947639183038, 0.02598546382743282, 0.014098420198304228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 86.0, 83, 95, 84.0, 95.0, 95.0, 95.0, 0.03134304967873374, 0.008386714464817426, 0.017875333019902837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 124.49999999999999, 80, 252, 84.0, 247.9, 251.8, 252.0, 0.09517283386630121, 0.025466168436881376, 0.054278256814374905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 117.4, 84, 248, 85.0, 248.0, 248.0, 248.0, 0.031312625250501, 0.023270417788702404, 0.015717470096442886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 121.6, 85, 250, 87.0, 250.0, 250.0, 250.0, 0.032507427947285956, 0.02558690129444578, 0.011555374778136803], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 460.53333333333336, 83, 1190, 462.0, 977.0000000000001, 1190.0, 1190.0, 0.08572947207791094, 0.017475193820048123, 0.05833064535717756], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1463.5416666666667, 888, 2362, 1409.0, 2197.0, 2356.25, 2362.0, 0.10561474381823702, 0.05466388107779846, 0.04857865658045863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 239.2, 170, 506, 171.0, 506.0, 506.0, 506.0, 0.03129400719762166, 0.048499599045532776, 0.0703809556407448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/627fd740-933a-48fe-9090-936b7577028a", 3, 0, 0.0, 668.0, 396, 1049, 559.0, 1049.0, 1049.0, 1049.0, 0.12587060501804145, 0.05695317089032475, 0.08071780334815809], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 887.6610169491529, 428, 2448, 712.0, 1543.0, 1639.0, 2448.0, 0.26959350782278113, 77.61734796382649, 0.9807659739865111], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 154.2203389830508, 83, 404, 86.0, 339.0, 354.0, 404.0, 0.2557323046248537, 0.1900510584174938, 0.1236205964739283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a69e70d6-3de9-4e08-a5d3-4aa8186d7d35", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 524.5762711864407, 402, 816, 491.0, 665.0, 750.0, 816.0, 0.2556181844176888, 75.16023354133, 0.1285579736085056], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 132.6271186440678, 82, 347, 87.0, 252.0, 259.0, 347.0, 0.2560641636033002, 0.4531135395011523, 0.12453120456488623], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 806.4915254237287, 567, 1384, 808.0, 985.0, 1062.0, 1384.0, 0.2552598675244552, 229.68327749749068, 0.1281284881909863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 88.55555555555556, 85, 97, 87.0, 97.0, 97.0, 97.0, 0.12289793326642225, 0.09181339741095021, 0.04368637471579853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 11, 6.214689265536723, 150.89830508474583, 83, 1363, 89.0, 297.20000000000016, 379.49999999999966, 898.8999999999993, 0.7397964514848174, 1.6536684186328394, 0.3531429267413429], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 104.25, 83, 252, 87.0, 214.80000000000013, 252.0, 252.0, 0.05888790197127252, 0.04560361939767491, 0.02093280890385078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e662aea7-187b-471c-9e8a-f07dabcde63a", 3, 0, 0.0, 432.0, 195, 784, 317.0, 784.0, 784.0, 784.0, 0.018963697162398784, 0.02614298746183556, 0.01216096465166849], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 88.66666666666667, 83, 109, 87.0, 97.30000000000001, 109.0, 109.0, 0.08103837166898527, 0.06576453794621753, 0.028806608679209606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68f5d12b-74f7-4137-8ec2-3af4b1d39c59", 3, 0, 0.0, 830.3333333333334, 193, 1833, 465.0, 1833.0, 1833.0, 1833.0, 0.025483117434699512, 0.030120182098110005, 0.016341712677850926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed1684ed-9463-464d-aebf-0a2a151c8e87", 1, 0, 0.0, 947.0, 947, 947, 947.0, 947.0, 947.0, 947.0, 1.0559662090813093, 0.19077514519535377, 0.7280392027455121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 298.9166666666667, 167, 1175, 178.0, 971.3000000000008, 1175.0, 1175.0, 0.05871301080319399, 5.936841963228531, 0.1307950811952012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 248.64999999999998, 166, 579, 176.0, 479.70000000000033, 574.8, 579.0, 0.09513028091971955, 0.14743335529257318, 0.21395023140440833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=627fd740-933a-48fe-9090-936b7577028a", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72cb1479-9b33-4c9d-8465-6bb83974157f", 3, 0, 0.0, 336.3333333333333, 203, 510, 296.0, 510.0, 510.0, 510.0, 0.024777006937561942, 0.02484959582507433, 0.015888900933267263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/024c6f8e-7e79-4f74-add2-dc1e8df4f5b3", 3, 0, 0.0, 668.0, 172, 1407, 425.0, 1407.0, 1407.0, 1407.0, 0.07255139056831923, 0.03211910519951632, 0.046525468561064084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 101.21428571428571, 84, 249, 86.5, 186.5, 249.0, 249.0, 0.07298927578997857, 0.060515522603214654, 0.025945406628468948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 87.57142857142857, 83, 98, 86.0, 97.5, 98.0, 98.0, 0.06372499931723216, 0.04947399849335895, 0.022652245851047366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98eed6b1-d94b-4dbc-98a7-70c78747afc6", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 1.1404854910714284, 2.130998883928571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a2acac5-3892-4cc8-a4e2-536851425d70", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8087555f-7119-4411-b2a0-aa67aab43a7c", 3, 0, 0.0, 891.6666666666666, 173, 2040, 462.0, 2040.0, 2040.0, 2040.0, 0.07418214188571005, 0.03351719171138201, 0.04757123031082317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 112.83333333333333, 82, 252, 85.0, 251.1, 252.0, 252.0, 0.1191697838392532, 0.08856270068522626, 0.05981764540368765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 138.38888888888889, 82, 251, 84.5, 249.2, 251.0, 251.0, 0.11917451783976324, 0.05177677619687631, 0.06685462860585677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 216.16666666666669, 81, 899, 85.5, 835.1000000000001, 899.0, 899.0, 0.11858879335902757, 11.884679089666305, 0.0685848815759133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 189.11111111111111, 81, 658, 86.0, 586.0000000000001, 658.0, 658.0, 0.11872176235860568, 3.907125985225736, 0.06877772235596741], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 25.0, 0.6550218340611353], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.11111111111111, 0.29112081513828236], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.11111111111111, 0.29112081513828236], "isController": false}, {"data": ["401/Unauthorized", 19, 52.77777777777778, 1.3828238719068413], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1374, 36, "401/Unauthorized", 19, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
