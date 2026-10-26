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

    var data = {"OkPercent": 96.52830188679245, "KoPercent": 3.4716981132075473};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7206072351421189, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48487a9e-8bc9-4a0f-b0da-19a8426dcbbf"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1bbb5dea-994d-4199-a3ca-e813b30a605a"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24074074074074073, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.36666666666666664, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.22, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9a2b555-658f-4b53-9328-abb0df39422d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c7cf8aa2-df59-4455-baa8-704e04acc6bc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/973d6020-9859-4b92-90f5-3c5ce30bf60f"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3e774dce-5a7f-49b4-853a-e747662607be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=973d6020-9859-4b92-90f5-3c5ce30bf60f"], "isController": false}, {"data": [0.3958333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7cf8aa2-df59-4455-baa8-704e04acc6bc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1bbb5dea-994d-4199-a3ca-e813b30a605a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9a2b555-658f-4b53-9328-abb0df39422d"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/943ac3ff-c1d5-443d-a975-974272baf174"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/331647c4-dc13-4267-8249-6cee56ff0e24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.275, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48487a9e-8bc9-4a0f-b0da-19a8426dcbbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38368e50-5f52-44a3-b0fc-1ab262a600f1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e510a6b-4fd9-4040-9f50-3173bc39ea21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/38368e50-5f52-44a3-b0fc-1ab262a600f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.4, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e510a6b-4fd9-4040-9f50-3173bc39ea21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=896c325b-dfcc-44f6-a0ee-166f4737acad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/260f4431-6c82-421b-a0fd-4b22e42bd4bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/896c325b-dfcc-44f6-a0ee-166f4737acad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e774dce-5a7f-49b4-853a-e747662607be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=069d16e6-51f1-4ba1-9ea4-97e2177ea7d4"], "isController": false}, {"data": [0.075, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/069d16e6-51f1-4ba1-9ea4-97e2177ea7d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a67c8cce-3902-48cf-a053-ca084625bb82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.22, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1325, 46, 3.4716981132075473, 451.9328301886797, 132, 2706, 151.0, 1278.2000000000003, 1596.9000000000012, 2056.1000000000004, 5.285602020097255, 728.7533095784582, 3.8727046587595386], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48487a9e-8bc9-4a0f-b0da-19a8426dcbbf", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2357.592592592593, 1686, 3164, 2411.5, 2809.5, 3017.5, 3164.0, 0.24330790615523945, 292.7823397814622, 1.1963430737222955], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 436.42105263157896, 280, 880, 294.0, 857.0, 880.0, 880.0, 0.10193133047210301, 0.1579736537687768, 0.2292459512473176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 147.125, 142, 152, 148.0, 151.3, 152.0, 152.0, 0.10399402034383022, 0.08073754509115727, 0.03696662441909591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bbb5dea-994d-4199-a3ca-e813b30a605a", 3, 0, 0.0, 329.0, 251, 471, 265.0, 471.0, 471.0, 471.0, 0.02983293556085919, 0.02992033673926014, 0.01913114682776452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 558.4375, 282, 1442, 558.0, 1050.7000000000003, 1442.0, 1442.0, 0.09010480314916287, 6.868208922416949, 0.20120692920015093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 141.25, 136, 148, 140.5, 148.0, 148.0, 148.0, 0.025733070856010603, 0.01912389347795319, 0.012916795332020945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 278.25, 134, 421, 279.0, 421.0, 421.0, 421.0, 0.02568597609919924, 0.006873005323418546, 0.014649033244074567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 143.0, 138, 148, 143.0, 148.0, 148.0, 148.0, 0.02573273976480276, 0.006935777514731994, 0.015128036463292248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 281.25, 141, 420, 282.0, 420.0, 420.0, 420.0, 0.025686800837389705, 0.006923395538202694, 0.015126114164986321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 143.6, 137, 150, 144.0, 150.0, 150.0, 150.0, 0.0632287108930423, 0.01864752997040896, 0.03908571679228104], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1627.9259259259265, 1080, 2571, 1519.5, 2214.5, 2427.75, 2571.0, 0.2552382933066121, 305.35373398261544, 0.5039959268222359], "isController": false}, {"data": ["deleteBook", 15, 5, 33.333333333333336, 504.9999999999999, 142, 1687, 501.0, 1180.6000000000004, 1687.0, 1687.0, 0.10557358126702375, 0.023094220902161445, 0.07007308990998093], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, 33.333333333333336, 504.9999999999999, 142, 1687, 501.0, 1180.6000000000004, 1687.0, 1687.0, 0.10138697380160597, 0.022178400519101304, 0.06729428371792792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 11, 44.0, 753.9200000000002, 167, 1948, 609.0, 1663.4, 1869.1, 1948.0, 0.10054535802191085, 0.031043379289264973, 0.0453632377012918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 180.00000000000003, 133, 418, 146.0, 416.2, 418.0, 418.0, 0.10412617315488422, 0.02786188617620925, 0.059384458127394894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 175.625, 141, 398, 144.5, 398.0, 398.0, 398.0, 0.042734129612615114, 0.011518183372150168, 0.025164726715241125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 162.8666666666667, 139, 425, 142.0, 261.80000000000007, 425.0, 425.0, 0.10412761880961306, 0.07738390421300345, 0.05226718366029406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 141.125, 135, 147, 140.5, 147.0, 147.0, 147.0, 0.042792877125602445, 0.011534017662760033, 0.025157531278918625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 252.13333333333333, 134, 455, 142.0, 448.4, 455.0, 455.0, 0.10413412475268145, 0.028067400812246176, 0.06132116916588567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9a2b555-658f-4b53-9328-abb0df39422d", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 180.33333333333331, 134, 441, 144.0, 415.20000000000005, 441.0, 441.0, 0.10412906450448449, 0.028066036917224337, 0.061216500812206705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7cf8aa2-df59-4455-baa8-704e04acc6bc", 3, 0, 0.0, 488.0, 256, 944, 264.0, 944.0, 944.0, 944.0, 0.01906420187718841, 0.026281541324834935, 0.01222541591733762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/973d6020-9859-4b92-90f5-3c5ce30bf60f", 3, 0, 0.0, 635.3333333333334, 309, 1114, 483.0, 1114.0, 1114.0, 1114.0, 0.01605514406815944, 0.022133312216359124, 0.010295779236417349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 286.9375, 139, 1372, 146.0, 704.2000000000007, 1372.0, 1372.0, 0.10207662126383617, 5.766338489664742, 0.059461625570193626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 273.6875, 139, 1113, 147.5, 641.9000000000005, 1113.0, 1113.0, 0.10208052877713907, 1.9017358275540868, 0.059563589789395105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 142.87500000000003, 135, 148, 142.0, 148.0, 148.0, 148.0, 0.042792877125602445, 0.01145043782462409, 0.024405312735695142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 178.68750000000003, 133, 441, 142.5, 426.3, 441.0, 441.0, 0.1022553700046654, 0.07599251618510779, 0.05132740252187306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 145.75, 142, 150, 145.5, 150.0, 150.0, 150.0, 0.04279241932291694, 0.031801788188222456, 0.02147978860544854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 193.68750000000003, 132, 440, 141.5, 426.7, 440.0, 440.0, 0.1022586376592998, 0.036961404554344074, 0.05778262130430892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e774dce-5a7f-49b4-853a-e747662607be", 3, 0, 0.0, 377.0, 274, 506, 351.0, 506.0, 506.0, 506.0, 0.02604731929672238, 0.026123629802474495, 0.01670352181462991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 219.62500000000003, 135, 442, 150.5, 442.0, 442.0, 442.0, 0.043864699334901495, 0.034526316078057236, 0.015592529841703267], "isController": false}, {"data": ["deleteAccount", 15, 5, 33.333333333333336, 399.5333333333333, 135, 944, 471.0, 681.2000000000002, 944.0, 944.0, 0.10302056290435571, 0.021596758629689152, 0.07008885952802846], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=973d6020-9859-4b92-90f5-3c5ce30bf60f", 1, 0, 0.0, 1990.0, 1990, 1990, 1990.0, 1990.0, 1990.0, 1990.0, 0.5025125628140704, 0.09078596105527638, 0.3464588567839196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1221.7083333333333, 838, 2142, 1095.0, 1895.5, 2111.25, 2142.0, 0.10163204119485403, 0.05260252132155531, 0.04674676894802368], "isController": false}, {"data": ["goToProfile", 15, 5, 33.333333333333336, 277.8, 139, 1114, 241.0, 623.8000000000003, 1114.0, 1114.0, 0.10545260257023142, 0.1750403356204831, 0.06813913284567363], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 324.375, 284, 541, 296.5, 541.0, 541.0, 541.0, 0.042701511099724046, 0.0661790020656856, 0.09603669927994576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7cf8aa2-df59-4455-baa8-704e04acc6bc", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1bbb5dea-994d-4199-a3ca-e813b30a605a", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 201.42105263157893, 133, 440, 144.0, 428.0, 440.0, 440.0, 0.10201232738440393, 0.07581189564407362, 0.05120540651912463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 1115.4, 834, 1248, 1150.0, 1247.8, 1248.0, 1248.0, 0.04414231482298932, 12.979306220755717, 0.025174913922486095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 217.31578947368425, 135, 443, 142.0, 439.0, 443.0, 443.0, 0.10200466000236222, 0.027294215664694577, 0.0581745326575972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9a2b555-658f-4b53-9328-abb0df39422d", 3, 0, 0.0, 348.3333333333333, 265, 485, 295.0, 485.0, 485.0, 485.0, 0.03971721344030503, 0.03311060664733762, 0.025469697421028937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 1473.5, 1135, 1659, 1520.5, 1658.6, 1659.0, 1659.0, 0.04407150160420266, 39.65561461289796, 0.025091489682861474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/943ac3ff-c1d5-443d-a975-974272baf174", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/331647c4-dc13-4267-8249-6cee56ff0e24", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 198.40000000000003, 140, 422, 145.0, 421.4, 422.0, 422.0, 0.04428541061432722, 0.07836441800113371, 0.024521316228831573], "isController": false}, {"data": ["addBook", 60, 15, 25.0, 1221.6499999999999, 702, 2616, 1086.5, 2175.1, 2340.6, 2616.0, 0.2715116410616105, 66.00568194673846, 0.9905137085096273], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/48487a9e-8bc9-4a0f-b0da-19a8426dcbbf", 3, 0, 0.0, 319.3333333333333, 241, 463, 254.0, 463.0, 463.0, 463.0, 0.05809562539940742, 0.026286757586320417, 0.037255332694281454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38368e50-5f52-44a3-b0fc-1ab262a600f1", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e510a6b-4fd9-4040-9f50-3173bc39ea21", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 163.18749999999997, 140, 442, 143.5, 237.6000000000002, 442.0, 442.0, 0.08240201884946181, 0.06123821908636762, 0.04136195086779627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 177.375, 136, 417, 144.5, 414.2, 417.0, 417.0, 0.08240541403570215, 0.02978545299801197, 0.046564289742586085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 254.93750000000003, 138, 1377, 143.0, 712.0000000000007, 1377.0, 1377.0, 0.08240583845365444, 4.655130157768553, 0.04800301038828601], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 252.37037037037032, 140, 597, 149.0, 564.5, 594.25, 597.0, 0.2567833604382436, 0.1908321653256869, 0.12412867521184627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 240.4375, 139, 840, 141.5, 560.7000000000003, 840.0, 840.0, 0.08240626287597858, 1.5352089610372888, 0.04808373248866914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38368e50-5f52-44a3-b0fc-1ab262a600f1", 3, 0, 0.0, 1138.0, 241, 2706, 467.0, 2706.0, 2706.0, 2706.0, 0.034174792672924455, 0.028490118501093592, 0.021915475770071993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 145.5, 140, 159, 144.5, 158.1, 159.0, 159.0, 0.04428639123483744, 0.03291205442354619, 0.024867846640655795], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 866.3703703703703, 660, 1319, 830.0, 1110.0, 1134.5, 1319.0, 0.2565405975495622, 75.43145362909931, 0.1290218825566646], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 208.4074074074074, 135, 589, 147.0, 423.0, 475.0, 589.0, 0.2573806278180796, 0.45544306406871105, 0.12517143813808945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 773.9499999999999, 132, 1911, 295.0, 1662.2000000000003, 1899.1, 1911.0, 0.0901319080474274, 36.50874353444391, 0.04950213387292302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 199.73684210526315, 132, 437, 142.0, 418.0, 437.0, 437.0, 0.102008493549305, 0.027494476776961114, 0.05996983702800939], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1373.9999999999998, 931, 1940, 1374.5, 1756.0, 1840.5, 1940.0, 0.2560018204573899, 230.35088805075947, 0.1285009137842758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 146.56250000000003, 136, 154, 149.5, 151.9, 154.0, 154.0, 0.08429837409510964, 0.06297681267847546, 0.029965437666621006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 646.7, 134, 1380, 431.0, 1315.6000000000001, 1377.1, 1380.0, 0.09012865866023749, 11.938729059169464, 0.049588365516775194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 169.3157894736842, 133, 416, 143.0, 396.0, 416.0, 416.0, 0.102008493549305, 0.027494476776961114, 0.060069454697491136], "isController": false}, {"data": ["deleteBooks", 15, 5, 33.333333333333336, 464.79999999999995, 137, 1990, 466.0, 1155.4000000000005, 1990.0, 1990.0, 0.101615689462453, 0.022228432069911593, 0.06764455890322799], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 15, 8.620689655172415, 181.93678160919538, 134, 428, 148.5, 272.0, 334.0, 423.5, 0.742970601421892, 1.5351665078780503, 0.3584002513930699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e510a6b-4fd9-4040-9f50-3173bc39ea21", 3, 0, 0.0, 334.3333333333333, 259, 471, 273.0, 471.0, 471.0, 471.0, 0.02853094180638903, 0.028614528549962433, 0.01829620942662317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 213.75, 143, 419, 146.5, 419.0, 419.0, 419.0, 0.027621829531879045, 0.021390733221464925, 0.009818697216410129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 458.68750000000006, 284, 1519, 297.5, 1073.8000000000004, 1519.0, 1519.0, 0.08234137705660456, 6.276444327258084, 0.18387094854693203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 146.0, 136, 159, 146.0, 155.4, 159.0, 159.0, 0.10819154230649942, 0.0877999723209971, 0.03845871230426347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 484.25, 157, 1560, 386.0, 1005.0, 1448.0, 1560.0, 0.10397937742347767, 0.06387014492125728, 0.047014113034248205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 155.65000000000003, 132, 425, 141.0, 149.8, 411.24999999999983, 425.0, 0.09012825250331222, 0.0669800782763873, 0.045240157994826634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 223.74999999999997, 133, 441, 143.0, 417.9, 439.84999999999997, 441.0, 0.09012865866023749, 0.08503251673013226, 0.047995271061940924], "isController": false}, {"data": ["login", 24, 0, 0.0, 2644.6666666666665, 1349, 4066, 2438.5, 3974.5, 4054.75, 4066.0, 0.102262559120542, 51.11044922291107, 0.22494767033107504], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 425.75, 284, 569, 425.0, 569.0, 569.0, 569.0, 0.02566356351411175, 0.03977351103212436, 0.05771795583300719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 149.0, 141, 192, 149.0, 153.0, 192.0, 192.0, 0.10051208261035167, 0.08137159812888822, 0.035728904365398446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 506.62499999999994, 273, 1511, 298.0, 1056.0000000000005, 1511.0, 1511.0, 0.10198293060698965, 7.773615272979622, 0.22773117060469503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=896c325b-dfcc-44f6-a0ee-166f4737acad", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/260f4431-6c82-421b-a0fd-4b22e42bd4bf", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.1486904226618704, 2.146329811151079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/896c325b-dfcc-44f6-a0ee-166f4737acad", 3, 0, 0.0, 347.3333333333333, 267, 478, 297.0, 478.0, 478.0, 478.0, 0.06958942240779402, 0.03148740141498492, 0.044626029343539785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 149.56249999999997, 140, 157, 150.0, 156.3, 157.0, 157.0, 0.08596096297768775, 0.07127036871880557, 0.030556436058474946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 946.15, 274, 2062, 715.5, 1806.8000000000002, 2049.7999999999997, 2062.0, 0.09007061536244415, 48.56687183767699, 0.1922004898715593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e774dce-5a7f-49b4-853a-e747662607be", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 164.55000000000004, 137, 417, 147.0, 206.5000000000001, 406.6999999999998, 417.0, 0.09428269723940262, 0.07319799248566904, 0.033514552534318905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=069d16e6-51f1-4ba1-9ea4-97e2177ea7d4", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, 50.0, 881.9499999999999, 135, 1800, 719.0, 1797.7, 1799.9, 1800.0, 0.08808787646556204, 52.70364747121729, 0.12849732956097004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 475.66666666666663, 284, 866, 544.0, 710.6000000000001, 866.0, 866.0, 0.10402363416968335, 0.16121631584696042, 0.2339515913015437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/069d16e6-51f1-4ba1-9ea4-97e2177ea7d4", 3, 0, 0.0, 329.3333333333333, 239, 498, 251.0, 498.0, 498.0, 498.0, 0.025399405653907695, 0.03002123760720666, 0.016288030318423883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a67c8cce-3902-48cf-a053-ca084625bb82", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 159.6875, 132, 441, 141.5, 236.6000000000002, 441.0, 441.0, 0.09018047367293797, 0.06701888717295487, 0.04526637057411144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 252.81249999999994, 133, 503, 147.0, 459.6, 503.0, 503.0, 0.09018199854581527, 0.03259630098805652, 0.05095855362165269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 315.1875, 138, 1309, 148.0, 814.8000000000005, 1309.0, 1309.0, 0.09018149024912636, 5.094379024701274, 0.05253247942734754], "isController": false}, {"data": ["register", 25, 11, 44.0, 753.9200000000002, 167, 1948, 609.0, 1663.4, 1869.1, 1948.0, 0.10075241906558177, 0.031107309386498368, 0.04545665782060427], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 326.375, 132, 1257, 148.5, 792.2000000000005, 1257.0, 1257.0, 0.09018098195816729, 1.6800501173761844, 0.052620250703129846], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 23.91304347826087, 0.8301886792452831], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 10.869565217391305, 0.37735849056603776], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 10.869565217391305, 0.37735849056603776], "isController": false}, {"data": ["401/Unauthorized", 25, 54.34782608695652, 1.8867924528301887], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1325, 46, "401/Unauthorized", 25, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
