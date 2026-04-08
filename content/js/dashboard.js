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

    var data = {"OkPercent": 96.03815113719736, "KoPercent": 3.961848862802641};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7790914747977598, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3813559322033898, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa72b47e-788b-4bda-bedb-ccf56d904bdb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a73b08e-a900-4586-9d79-4e91549b86d8"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6052631578947368, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/315feffb-c2a1-49d3-ba51-5ba3e6b53039"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4d89d41c-aae0-4cdb-ae50-8cffc45fa17e"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08563ef0-4806-420c-b12a-197879c40fc0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b546f6a-ca07-4975-96c7-dcc4aba09369"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4a4b198-12e8-4354-ac63-cc2ae76271cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=189ea470-2e25-46be-9505-a3fa70ec199a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a3b7ad5d-7a18-4f21-bd5b-c2cd398e3bd6"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b76a6b3-9448-43b4-8b41-653cbba63095"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5185a20a-8362-4fb6-9809-8436d8000322"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c439857c-1cac-439f-9588-ba6beea3b83f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa72b47e-788b-4bda-bedb-ccf56d904bdb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5185a20a-8362-4fb6-9809-8436d8000322"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b546f6a-ca07-4975-96c7-dcc4aba09369"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2a73b08e-a900-4586-9d79-4e91549b86d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=315feffb-c2a1-49d3-ba51-5ba3e6b53039"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=306da90c-d467-40a8-8fa8-3c7127564262"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b76a6b3-9448-43b4-8b41-653cbba63095"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad9cf916-6bfc-46fc-9fe3-896aa8dd7ab1"], "isController": false}, {"data": [0.40384615384615385, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.21296296296296297, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d89d41c-aae0-4cdb-ae50-8cffc45fa17e"], "isController": false}, {"data": [0.8813559322033898, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12e9c524-261c-415f-a98d-ac2d6ce4248a"], "isController": false}, {"data": [0.8532934131736527, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/189ea470-2e25-46be-9505-a3fa70ec199a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/08563ef0-4806-420c-b12a-197879c40fc0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3b7ad5d-7a18-4f21-bd5b-c2cd398e3bd6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/12e9c524-261c-415f-a98d-ac2d6ce4248a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b4a4b198-12e8-4354-ac63-cc2ae76271cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/306da90c-d467-40a8-8fa8-3c7127564262"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b960eba-fddd-44fc-90ed-5535ab8b1472"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c439857c-1cac-439f-9588-ba6beea3b83f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1363, 54, 3.961848862802641, 313.5502567865001, 78, 2608, 95.0, 879.0, 1087.9999999999998, 1444.4799999999982, 5.26863058125017, 789.549850744682, 3.840582371154344], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1356.966101694915, 949, 1827, 1315.0, 1707.0, 1758.0, 1827.0, 0.25161953420533006, 302.7843024194924, 1.237211283909997], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa72b47e-788b-4bda-bedb-ccf56d904bdb", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a73b08e-a900-4586-9d79-4e91549b86d8", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["deleteBook", 19, 5, 26.31578947368421, 469.0526315789473, 83, 1367, 419.0, 1084.0, 1367.0, 1367.0, 0.10108802638929532, 0.021302472666329706, 0.06743531530153493], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 19, 5, 26.31578947368421, 469.0526315789473, 83, 1367, 419.0, 1084.0, 1367.0, 1367.0, 0.09779246380392095, 0.02060799247512726, 0.06523686203284798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 98.89473684210526, 79, 249, 82.0, 242.0, 249.0, 249.0, 0.0961893817047796, 0.02573817440147423, 0.05485800675350712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 83.42105263157896, 80, 97, 83.0, 90.0, 97.0, 97.0, 0.09618499919002106, 0.07148123474961526, 0.048280360921553536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 114.47368421052632, 78, 244, 82.0, 242.0, 244.0, 244.0, 0.09618889473897371, 0.02592591303511401, 0.056642483913673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 124.10526315789474, 80, 252, 82.0, 245.0, 252.0, 252.0, 0.09618986867551613, 0.025926175541447705, 0.056549122014317096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/315feffb-c2a1-49d3-ba51-5ba3e6b53039", 3, 0, 0.0, 562.0, 173, 1171, 342.0, 1171.0, 1171.0, 1171.0, 0.04349212792484561, 0.03625759753109688, 0.02789045963930529], "isController": false}, {"data": ["goToProfile", 19, 5, 26.31578947368421, 419.26315789473693, 80, 1995, 185.0, 1891.0, 1995.0, 1995.0, 0.10191274123818617, 0.11436373763637533, 0.06585880425512514], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4d89d41c-aae0-4cdb-ae50-8cffc45fa17e", 3, 0, 0.0, 1083.6666666666667, 161, 1986, 1104.0, 1986.0, 1986.0, 1986.0, 0.08980153859969467, 0.04063285763462748, 0.057587575208788586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08563ef0-4806-420c-b12a-197879c40fc0", 1, 0, 0.0, 1600.0, 1600, 1600, 1600.0, 1600.0, 1600.0, 1600.0, 0.625, 0.1129150390625, 0.430908203125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 82.66666666666664, 80, 87, 83.0, 86.1, 87.0, 87.0, 0.08987597115979948, 0.06679259184824941, 0.04511352458607122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 107.05555555555556, 78, 238, 81.5, 236.2, 238.0, 238.0, 0.08987866380386478, 0.04654848766665002, 0.050000858216407845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 548.9, 404, 647, 550.0, 646.7, 647.0, 647.0, 0.06780856286531863, 19.937968938592565, 0.038672071009127035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 863.1, 725, 1068, 826.5, 1065.7, 1068.0, 1068.0, 0.06760045427505273, 60.82700758561597, 0.03848736801011303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b546f6a-ca07-4975-96c7-dcc4aba09369", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 195.7, 83, 250, 241.0, 249.7, 250.0, 250.0, 0.06792140135435273, 0.1201890422403195, 0.037608822820232424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4a4b198-12e8-4354-ac63-cc2ae76271cf", 1, 0, 0.0, 840.0, 840, 840, 840.0, 840.0, 840.0, 840.0, 1.1904761904761907, 0.21507626488095238, 0.8207775297619048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 106.46153846153848, 80, 241, 82.0, 239.0, 241.0, 241.0, 0.06752229534251983, 0.05018014331607187, 0.033893027154350774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 117.61538461538461, 78, 243, 80.0, 242.6, 243.0, 243.0, 0.06752510115779578, 0.018068239958238322, 0.038510409254055404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 118.23076923076924, 78, 243, 82.0, 242.2, 243.0, 243.0, 0.06746692823075766, 0.0181844454996964, 0.03966317460441026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 130.30769230769232, 81, 242, 82.0, 242.0, 242.0, 242.0, 0.06746762851285777, 0.018184634247606198, 0.03972947264966136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 82.7, 79, 85, 83.0, 84.9, 85.0, 85.0, 0.06799483239273815, 0.05053131586999388, 0.038180692017406676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 627.8125, 79, 1117, 896.0, 1070.8, 1117.0, 1117.0, 0.09742493713047026, 54.799303202388124, 0.05204242247106174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 228.33333333333334, 79, 969, 82.0, 891.6000000000001, 969.0, 969.0, 0.08987821501864973, 13.4989501335066, 0.05155124181733751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 433.125, 80, 733, 551.0, 718.3000000000001, 733.0, 733.0, 0.09742612359721606, 17.91391926266692, 0.05213819895632265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 165.38888888888889, 79, 635, 82.0, 497.30000000000024, 635.0, 635.0, 0.08987821501864973, 4.424717398549965, 0.05163901351169166], "isController": false}, {"data": ["deleteBooks", 19, 5, 26.31578947368421, 360.36842105263156, 83, 1600, 257.0, 840.0, 1600.0, 1600.0, 0.09778441110625048, 0.02060629551478346, 0.06558330492009984], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=189ea470-2e25-46be-9505-a3fa70ec199a", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 251.15384615384616, 162, 483, 169.0, 481.0, 483.0, 483.0, 0.0674368298465034, 0.10451391500625087, 0.15166701087548567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 26, 0, 0.0, 484.49999999999994, 93, 1294, 491.5, 871.0, 1158.1999999999994, 1294.0, 0.11099205553017917, 0.06817773723484638, 0.050184884482883746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 94.1875, 80, 239, 83.0, 143.8000000000001, 239.0, 239.0, 0.09742197109003009, 0.0724005078120243, 0.04890126283230025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 122.75, 80, 247, 84.0, 245.6, 247.0, 247.0, 0.09742375069262198, 0.11752215629205205, 0.05044818730933868], "isController": false}, {"data": ["login", 26, 0, 0.0, 2509.0000000000005, 1589, 3978, 2479.0, 3203.4, 3765.199999999999, 3978.0, 0.11167905158713114, 51.53564568478588, 0.2397257285984279], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 86.05555555555556, 81, 95, 86.0, 94.1, 95.0, 95.0, 0.08914951363987558, 0.0721727996166571, 0.031689866176674526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3b7ad5d-7a18-4f21-bd5b-c2cd398e3bd6", 3, 0, 0.0, 879.6666666666666, 343, 1891, 405.0, 1891.0, 1891.0, 1891.0, 0.07129616426636247, 0.0330487428109701, 0.045720522006749365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 733.8125, 162, 1200, 980.5, 1168.5, 1200.0, 1200.0, 0.09737335378173763, 72.86433086628813, 0.20342377644295137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b76a6b3-9448-43b4-8b41-653cbba63095", 3, 0, 0.0, 535.0, 180, 1149, 276.0, 1149.0, 1149.0, 1149.0, 0.042908633217003264, 0.028088952278448424, 0.027516278462726702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5185a20a-8362-4fb6-9809-8436d8000322", 3, 0, 0.0, 741.0, 614, 987, 622.0, 987.0, 987.0, 987.0, 0.06588338640606127, 0.02981051663555507, 0.04224943724607445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c439857c-1cac-439f-9588-ba6beea3b83f", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 0.9170764593908629, 3.4997620558375635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa72b47e-788b-4bda-bedb-ccf56d904bdb", 3, 0, 0.0, 289.0, 186, 428, 253.0, 428.0, 428.0, 428.0, 0.07359795888327364, 0.03330115978116874, 0.04719660774741181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 234.52631578947364, 163, 336, 173.0, 333.0, 336.0, 336.0, 0.09614460148062687, 0.14900535405249496, 0.21623146211902702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, 50.0, 521.95, 80, 1153, 525.5, 1117.5000000000002, 1151.75, 1153.0, 0.13512600499966218, 80.8469180714141, 0.19711374020336464], "isController": false}, {"data": ["register", 29, 10, 34.48275862068966, 863.8275862068965, 198, 1641, 919.0, 1424.0, 1539.5, 1641.0, 0.11665888940737285, 0.036408761686002544, 0.05263320986934204], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5185a20a-8362-4fb6-9809-8436d8000322", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 88.71428571428572, 82, 110, 86.5, 103.5, 110.0, 110.0, 0.07202387076859759, 0.055916969981479575, 0.025602235312274926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 321.1666666666667, 162, 1055, 166.0, 975.8000000000002, 1055.0, 1055.0, 0.0898391878537418, 18.029177966752012, 0.19821940601323632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b546f6a-ca07-4975-96c7-dcc4aba09369", 3, 0, 0.0, 412.6666666666667, 217, 656, 365.0, 656.0, 656.0, 656.0, 0.030477583737161317, 0.025407907536090537, 0.019544544258531183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a73b08e-a900-4586-9d79-4e91549b86d8", 3, 0, 0.0, 878.3333333333334, 217, 1995, 423.0, 1995.0, 1995.0, 1995.0, 0.03646042221168921, 0.030395553803429707, 0.023381195233407467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=315feffb-c2a1-49d3-ba51-5ba3e6b53039", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.5018446180555556, 1.9151475694444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 401.6923076923077, 160, 1082, 316.0, 1037.2, 1082.0, 1082.0, 0.10653554599467323, 29.53936501229256, 0.23331060489653757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=306da90c-d467-40a8-8fa8-3c7127564262", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 82.63636363636363, 80, 89, 82.0, 88.0, 89.0, 89.0, 0.0765579543714592, 0.05689512038738325, 0.038428504440361354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 111.27272727272728, 78, 242, 82.0, 242.0, 242.0, 242.0, 0.07656275013398481, 0.020486517125695155, 0.043664693435788215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b76a6b3-9448-43b4-8b41-653cbba63095", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 124.36363636363637, 79, 243, 83.0, 242.4, 243.0, 243.0, 0.07656328303357648, 0.02063619738014366, 0.04501083631466117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 80.45454545454545, 78, 83, 80.0, 82.6, 83.0, 83.0, 0.07656275013398481, 0.020636053747050593, 0.04508529133866489], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 86.6, 83, 91, 85.0, 91.0, 91.0, 91.0, 0.07181741141322302, 0.021180525631634136, 0.044394942797431815], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 956.0169491525425, 625, 1457, 881.0, 1369.0, 1379.0, 1457.0, 0.25540793842504206, 305.55668852244344, 0.5043309096635109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 29, 10, 34.48275862068966, 863.8275862068965, 198, 1641, 919.0, 1424.0, 1539.5, 1641.0, 0.11209852300532275, 0.03498549000583685, 0.05057570080904209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 134.44444444444446, 78, 246, 81.0, 246.0, 246.0, 246.0, 0.049368359270006525, 0.013306315584493947, 0.0290714068748183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 99.66666666666667, 80, 241, 81.0, 241.0, 241.0, 241.0, 0.04941335368431455, 0.013318442985225408, 0.029049647380817736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 104.71428571428572, 79, 249, 81.0, 245.5, 249.0, 249.0, 0.07204536799744753, 0.01941847809306203, 0.04235479642037443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 91.78571428571429, 78, 236, 81.0, 159.5, 236.0, 236.0, 0.07204573875185903, 0.019418578022962006, 0.04242537155016699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 93.71428571428572, 79, 239, 82.5, 164.5, 239.0, 239.0, 0.07204388501795951, 0.05354042626822968, 0.03616265322190546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 99.33333333333333, 80, 240, 81.0, 240.0, 240.0, 240.0, 0.04941335368431455, 0.01322193252881073, 0.028181053273085645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 92.64285714285714, 78, 242, 81.0, 163.0, 242.0, 242.0, 0.07204536799744753, 0.019277764483692016, 0.041088373936044295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 117.55555555555556, 80, 243, 83.0, 243.0, 243.0, 243.0, 0.04941226851724763, 0.0367214222086186, 0.024802642595571564], "isController": false}, {"data": ["deleteAccount", 19, 5, 26.31578947368421, 497.6842105263158, 80, 1171, 428.0, 1149.0, 1171.0, 1171.0, 0.09639336610707781, 0.01961953792064289, 0.06558672802865419], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 86.88888888888889, 82, 94, 85.0, 94.0, 94.0, 94.0, 0.04945707126214446, 0.038928124450476984, 0.017580443300215413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad9cf916-6bfc-46fc-9fe3-896aa8dd7ab1", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.7865417179802955, 1.4696544027093594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 26, 0, 0.0, 1338.5000000000002, 824, 2608, 1213.0, 2053.9, 2439.2999999999993, 2608.0, 0.10954933090639431, 0.05670033728553611, 0.050388412946202846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 254.11111111111111, 163, 486, 167.0, 486.0, 486.0, 486.0, 0.04934562222088197, 0.07647607662552704, 0.11097946091278435], "isController": false}, {"data": ["addBook", 54, 24, 44.44444444444444, 838.5185185185188, 409, 1731, 600.0, 1556.0, 1607.5, 1731.0, 0.25081514923501375, 90.01489722965378, 0.9050001698227573], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 165.2542372881356, 79, 434, 85.0, 330.0, 367.0, 434.0, 0.25638462908966075, 0.19053584251682795, 0.12393592910095906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d89d41c-aae0-4cdb-ae50-8cffc45fa17e", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 490.06779661016947, 383, 734, 469.0, 644.0, 652.0, 734.0, 0.2562643605769857, 75.35023078723108, 0.12888295478237075], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 139.57627118644072, 79, 338, 86.0, 246.0, 246.0, 338.0, 0.25652843117646545, 0.45393507548022993, 0.124756990943242], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 789.322033898305, 541, 1126, 791.0, 1040.0, 1105.0, 1126.0, 0.2558210120105797, 230.1881962924923, 0.12841015641937303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 87.99999999999999, 80, 116, 84.0, 112.39999999999999, 116.0, 116.0, 0.10264103272669851, 0.07668006839445739, 0.03648567960206861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12e9c524-261c-415f-a98d-ac2d6ce4248a", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 24, 14.37125748502994, 123.45508982035935, 80, 858, 87.0, 243.20000000000002, 300.4, 546.5599999999969, 0.7121201137686506, 1.7543445123576293, 0.33359392656421233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 100.36363636363637, 81, 248, 85.0, 216.80000000000013, 248.0, 248.0, 0.07486354417629684, 0.057975381378714254, 0.02661165046891802], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/189ea470-2e25-46be-9505-a3fa70ec199a", 3, 0, 0.0, 344.0, 169, 602, 261.0, 602.0, 602.0, 602.0, 0.03785823353482327, 0.03156085158941484, 0.024277578145703724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08563ef0-4806-420c-b12a-197879c40fc0", 3, 0, 0.0, 648.3333333333334, 164, 1404, 377.0, 1404.0, 1404.0, 1404.0, 0.042959632265547804, 0.027618904207179988, 0.027548982930706113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 93.73684210526314, 82, 245, 85.0, 90.0, 245.0, 245.0, 0.0989830791031091, 0.08032708860808953, 0.03518539139993332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3b7ad5d-7a18-4f21-bd5b-c2cd398e3bd6", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12e9c524-261c-415f-a98d-ac2d6ce4248a", 3, 0, 0.0, 355.3333333333333, 185, 450, 431.0, 450.0, 450.0, 450.0, 0.05682463916354131, 0.03534892104216388, 0.03644027967193242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 209.18181818181816, 160, 325, 170.0, 324.6, 325.0, 325.0, 0.0765148195293643, 0.11858302596982534, 0.172083622437623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4a4b198-12e8-4354-ac63-cc2ae76271cf", 3, 0, 0.0, 707.3333333333334, 401, 1118, 603.0, 1118.0, 1118.0, 1118.0, 0.04426214996016406, 0.028456297581811205, 0.02838425632211042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 210.5, 161, 482, 165.5, 407.0, 482.0, 482.0, 0.07201386781340177, 0.11160742990221545, 0.16196087653736746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 86.15384615384615, 82, 93, 85.0, 92.2, 93.0, 93.0, 0.06770798068760057, 0.056136792581809467, 0.02406807126004552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/306da90c-d467-40a8-8fa8-3c7127564262", 3, 0, 0.0, 360.6666666666667, 207, 534, 341.0, 534.0, 534.0, 534.0, 0.03138305106022408, 0.025856283279110395, 0.020125198759323382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b960eba-fddd-44fc-90ed-5535ab8b1472", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c439857c-1cac-439f-9588-ba6beea3b83f", 3, 0, 0.0, 258.6666666666667, 187, 385, 204.0, 385.0, 385.0, 385.0, 0.07285620613449255, 0.03296553597882313, 0.04672093948077811], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 99.8125, 81, 240, 85.5, 156.7000000000001, 240.0, 240.0, 0.09292600766639564, 0.07214470321756301, 0.03303229178766407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 83.0, 80, 90, 83.0, 88.4, 90.0, 90.0, 0.10680249753532699, 0.07937177795349984, 0.05360984739566218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 129.61538461538464, 79, 242, 82.0, 241.6, 242.0, 242.0, 0.10680688493612127, 0.06559894014706487, 0.058843276301195416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 281.0, 78, 999, 82.0, 955.0, 999.0, 999.0, 0.1066115566927455, 22.159626908244352, 0.06056164300710197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 221.3846153846154, 79, 641, 83.0, 636.2, 641.0, 641.0, 0.10680512993254845, 7.269279738039879, 0.06077590589235686], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 18.51851851851852, 0.7336757153338225], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 9.25925925925926, 0.36683785766691124], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 9.25925925925926, 0.36683785766691124], "isController": false}, {"data": ["401/Unauthorized", 34, 62.96296296296296, 2.494497432134996], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1363, 54, "401/Unauthorized", 34, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 19, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 29, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 24, "401/Unauthorized", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
