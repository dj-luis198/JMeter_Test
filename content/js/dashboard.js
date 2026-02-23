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

    var data = {"OkPercent": 98.31546707503828, "KoPercent": 1.6845329249617151};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8021653543307087, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2545454545454545, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9bb816f-d910-47c4-aef8-252369c02480"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=209b5bdd-c186-43a6-b037-b6047dd7c02a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa8b450d-5bf9-4aff-b2c2-64afbcb37fc3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/862c9a13-71c3-484b-bfe9-c92bf4b6edfa"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/20b2763c-2d65-4647-b027-7f22129563fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf62e974-05c8-4675-a715-6186380c8c58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83fbc47b-b572-4a13-a1c1-9dffa3f8ca90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99c82afd-812b-498f-b5de-edbb2a6b0f34"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d371a933-3bfe-4ab2-9886-c41f66f40fae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa8b450d-5bf9-4aff-b2c2-64afbcb37fc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=720a95df-ce15-40cb-bbca-7d64b031fa3b"], "isController": false}, {"data": [0.8958333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea463c65-a111-46af-8707-530bd0b05677"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/885e81ce-252d-415d-a7a2-11ee8cca50a4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/209b5bdd-c186-43a6-b037-b6047dd7c02a"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e742ed82-673a-47dd-b417-7028d1f75bce"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b987a60-74e0-4cab-9f0c-0e2583eca683"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83fbc47b-b572-4a13-a1c1-9dffa3f8ca90"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=862c9a13-71c3-484b-bfe9-c92bf4b6edfa"], "isController": false}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6812991f-65f3-4117-852f-98de6554bd7d"], "isController": false}, {"data": [0.3474576271186441, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20b2763c-2d65-4647-b027-7f22129563fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75950f32-3207-4d61-9127-b68e79765201"], "isController": false}, {"data": [0.7909090909090909, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9479768786127167, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75950f32-3207-4d61-9127-b68e79765201"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/720a95df-ce15-40cb-bbca-7d64b031fa3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9bb816f-d910-47c4-aef8-252369c02480"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf62e974-05c8-4675-a715-6186380c8c58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b987a60-74e0-4cab-9f0c-0e2583eca683"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d371a933-3bfe-4ab2-9886-c41f66f40fae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94913263-6678-4d52-9b4e-e449f9f09648"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99c82afd-812b-498f-b5de-edbb2a6b0f34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea463c65-a111-46af-8707-530bd0b05677"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1306, 22, 1.6845329249617151, 322.00459418070494, 97, 1989, 114.0, 802.3, 992.2999999999997, 1310.4400000000005, 5.05155994956176, 725.1463495251108, 3.684049867473911], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1465.7636363636364, 1197, 1871, 1482.0, 1713.8, 1735.1999999999998, 1871.0, 0.24134027223182708, 290.41337989098, 1.186668233093017], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9bb816f-d910-47c4-aef8-252369c02480", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=209b5bdd-c186-43a6-b037-b6047dd7c02a", 1, 0, 0.0, 902.0, 902, 902, 902.0, 902.0, 902.0, 902.0, 1.1086474501108647, 0.2002927522172949, 0.7643604490022172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa8b450d-5bf9-4aff-b2c2-64afbcb37fc3", 2, 0, 0.0, 184.5, 184, 185, 184.5, 185.0, 185.0, 185.0, 0.08081461128171973, 0.04968046660336189, 0.050232910235170514], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 495.8, 105, 1184, 415.0, 995.0000000000001, 1184.0, 1184.0, 0.0681362907511799, 0.013347792895201842, 0.04587666138988949], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 495.8, 105, 1184, 415.0, 995.0000000000001, 1184.0, 1184.0, 0.06821499547507197, 0.01336321102763617, 0.04592965385437463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 24, 0, 0.0, 150.0, 98, 304, 101.0, 298.0, 302.5, 304.0, 0.11852378624235152, 0.04654913675175686, 0.0667660846654913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 24, 0, 0.0, 126.99999999999997, 100, 301, 102.0, 299.5, 300.75, 301.0, 0.11852085967130215, 0.08808044356431731, 0.05949191588969659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 24, 0, 0.0, 194.66666666666669, 99, 688, 101.0, 541.5, 687.0, 688.0, 0.11852261559658853, 2.933415445225267, 0.06894528452835406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 24, 0, 0.0, 199.875, 99, 891, 101.5, 499.5, 842.75, 891.0, 0.11852320091657942, 8.916565608147483, 0.06882987969895107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/862c9a13-71c3-484b-bfe9-c92bf4b6edfa", 3, 0, 0.0, 742.3333333333334, 193, 1066, 968.0, 1066.0, 1066.0, 1066.0, 0.01771646568320597, 0.024423578179810314, 0.011361144985649663], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 194.79999999999998, 99, 283, 192.0, 277.0, 283.0, 283.0, 0.06843440334324873, 0.13727870024818878, 0.04423286174425607], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/20b2763c-2d65-4647-b027-7f22129563fb", 3, 0, 0.0, 255.0, 191, 381, 193.0, 381.0, 381.0, 381.0, 0.04835434060797524, 0.031087181868734083, 0.031008480142484123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 154.2, 99, 300, 103.0, 299.4, 300.0, 300.0, 0.0927058998034635, 0.06889569311565988, 0.04653401611228539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 643.8333333333333, 491, 796, 691.0, 796.0, 796.0, 796.0, 0.02990207071839725, 8.792201633400612, 0.017053524706585933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 140.0666666666667, 99, 296, 101.0, 296.0, 296.0, 296.0, 0.09259773691130987, 0.03404895951009624, 0.05229119596150403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 819.0, 684, 891, 878.0, 891.0, 891.0, 891.0, 0.029899984551674648, 26.904058658163443, 0.017023135735963202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 168.33333333333334, 101, 306, 102.0, 306.0, 306.0, 306.0, 0.02998905399529172, 0.053066568202606045, 0.0166052672024711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 102.3, 100, 107, 101.5, 106.7, 107.0, 107.0, 0.07079595896666219, 0.05261301247424797, 0.03553625284068785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 120.7, 98, 295, 100.5, 276.30000000000007, 295.0, 295.0, 0.07079696139441695, 0.040210461666985255, 0.03918722433433157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 278.4, 99, 901, 101.0, 898.4, 901.0, 901.0, 0.07079946758800375, 12.75636321277364, 0.04040547740080994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 223.10000000000002, 99, 704, 104.0, 684.4000000000001, 704.0, 704.0, 0.07079796385055966, 4.178656228096879, 0.040473757849724235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 101.16666666666667, 100, 102, 101.0, 102.0, 102.0, 102.0, 0.02998935377940831, 0.02228700998645481, 0.01683972502261697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 491.5000000000001, 100, 1022, 353.0, 920.3000000000001, 1016.9499999999999, 1022.0, 0.10458992903573315, 42.36509553799752, 0.057442750087594065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 208.79999999999998, 97, 905, 102.0, 546.2000000000003, 905.0, 905.0, 0.09259487888589842, 5.577762384950863, 0.053905169726412995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 380.45000000000005, 99, 818, 355.0, 711.0, 812.6499999999999, 818.0, 0.10459102295249999, 13.854459875615126, 0.0575454905580454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 153.99999999999997, 98, 689, 101.0, 455.60000000000014, 689.0, 689.0, 0.09271105672062449, 1.8406645567175342, 0.054063342125431874], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 480.86666666666673, 106, 1815, 404.0, 1267.2000000000003, 1815.0, 1815.0, 0.06832187803178333, 0.01338414915349193, 0.04645531863046518], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 383.0, 201, 1003, 208.0, 1000.5, 1003.0, 1003.0, 0.07074337134610487, 17.01444402784459, 0.15548342924955433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 559.6521739130433, 108, 1311, 504.0, 1100.0000000000002, 1277.5999999999995, 1311.0, 0.09583213543164044, 0.0588656378774432, 0.043330350297704615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 122.1, 100, 298, 102.0, 279.5000000000004, 298.0, 298.0, 0.10458883514184861, 0.07772666361615897, 0.05249869263956073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 139.9, 98, 298, 101.0, 296.9, 297.95, 298.0, 0.10458992903573315, 0.09867610394670097, 0.055696179983579376], "isController": false}, {"data": ["login", 23, 0, 0.0, 2213.5652173913045, 1455, 3152, 2165.0, 3016.4, 3129.9999999999995, 3152.0, 0.09661064649324355, 30.28343410943886, 0.18755641090398162], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf62e974-05c8-4675-a715-6186380c8c58", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.5132501775568182, 1.9586736505681819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 120.00000000000001, 100, 324, 104.0, 204.00000000000006, 324.0, 324.0, 0.08888256835069507, 0.07195668863547482, 0.031594975468411134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83fbc47b-b572-4a13-a1c1-9dffa3f8ca90", 3, 0, 0.0, 365.0, 204, 618, 273.0, 618.0, 618.0, 618.0, 0.045625988563085536, 0.02933311439195766, 0.029258853342864096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99c82afd-812b-498f-b5de-edbb2a6b0f34", 2, 0, 0.0, 198.5, 198, 199, 198.5, 199.0, 199.0, 199.0, 0.017809756184437836, 0.025358031754795278, 0.01107022442519012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 615.85, 201, 1125, 599.0, 1022.3000000000001, 1119.8999999999999, 1125.0, 0.10453362323991512, 56.365453507691065, 0.22306291029447123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d371a933-3bfe-4ab2-9886-c41f66f40fae", 3, 0, 0.0, 252.0, 182, 378, 196.0, 378.0, 378.0, 378.0, 0.06986818202990358, 0.03243230064278727, 0.0448047912105827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa8b450d-5bf9-4aff-b2c2-64afbcb37fc3", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=720a95df-ce15-40cb-bbca-7d64b031fa3b", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 24, 0, 0.0, 373.0, 202, 991, 306.5, 751.5, 943.5, 991.0, 0.11846060444523418, 11.978297107216719, 0.2638949044664584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 594.3, 99, 993, 799.5, 992.3, 993.0, 993.0, 0.049807990197787526, 35.75793441283851, 0.08058777164032654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea463c65-a111-46af-8707-530bd0b05677", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.2796657314241486, 1.067264899380805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/885e81ce-252d-415d-a7a2-11ee8cca50a4", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 1.1697287087912087, 2.185639880952381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/209b5bdd-c186-43a6-b037-b6047dd7c02a", 3, 0, 0.0, 327.6666666666667, 205, 568, 210.0, 568.0, 568.0, 568.0, 0.01993103860642178, 0.02355781288408772, 0.012781297543831675], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 926.8260869565216, 108, 1989, 871.0, 1859.2000000000003, 1984.3999999999999, 1989.0, 0.10184742370299521, 0.03208678175425545, 0.04595069311599979], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 104.61538461538461, 100, 109, 105.0, 109.0, 109.0, 109.0, 0.07047598395316057, 0.054715241448010404, 0.02505200992085005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 377.73333333333335, 200, 1205, 214.0, 846.2000000000003, 1205.0, 1205.0, 0.09253318857030055, 7.513972029530424, 0.20653094425492274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e742ed82-673a-47dd-b417-7028d1f75bce", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.7740885416666667, 3.3148871527777777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b987a60-74e0-4cab-9f0c-0e2583eca683", 3, 0, 0.0, 357.3333333333333, 245, 552, 275.0, 552.0, 552.0, 552.0, 0.1319377253936142, 0.05969838486234497, 0.08460850228692057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 329.11111111111114, 200, 1179, 208.0, 566.1000000000009, 1179.0, 1179.0, 0.08011821888297398, 5.4422273574229525, 0.17904891884914628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 102.25, 100, 108, 101.0, 108.0, 108.0, 108.0, 0.03974207394012856, 0.029534881121521327, 0.019948658208228595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 175.375, 99, 300, 104.0, 300.0, 300.0, 300.0, 0.03970459779242436, 0.025532693013976017, 0.021810386970936235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 298.25, 98, 876, 104.5, 876.0, 876.0, 876.0, 0.03970459779242436, 8.939592944120742, 0.02248893234336536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 274.0, 100, 694, 102.5, 694.0, 694.0, 694.0, 0.039742468802161986, 2.9294352284695178, 0.022549193724664178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 107.0, 106, 108, 107.0, 108.0, 108.0, 108.0, 0.016623722051367303, 0.004902699276868091, 0.010276187557144044], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 928.981818181818, 782, 1443, 801.0, 1289.4, 1308.3999999999999, 1443.0, 0.24097969198413915, 288.2954897090718, 0.47584075897649347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 926.8260869565216, 108, 1989, 871.0, 1859.2000000000003, 1984.3999999999999, 1989.0, 0.09671749240977941, 0.03047060944635543, 0.04363621239581844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 100.66666666666667, 98, 102, 101.0, 102.0, 102.0, 102.0, 0.030933734784469202, 0.008337608203626464, 0.018215861401401297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 134.33333333333331, 100, 304, 100.5, 304.0, 304.0, 304.0, 0.030934053753074075, 0.008337694175633245, 0.01818584019467831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 145.76923076923077, 98, 304, 101.0, 301.2, 304.0, 304.0, 0.06895125146521408, 0.01858451699648349, 0.04053579431841688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 192.9230769230769, 98, 308, 107.0, 306.8, 308.0, 308.0, 0.06894942294636795, 0.018584024153513238, 0.04060205277017566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 115.38461538461537, 98, 298, 100.0, 219.99999999999994, 298.0, 298.0, 0.06895161718062141, 0.051242363939895404, 0.034610479717616605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 134.5, 98, 304, 101.5, 304.0, 304.0, 304.0, 0.030933894267949395, 0.008277233427166146, 0.017641986574689888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 132.07692307692307, 98, 304, 101.0, 301.2, 304.0, 304.0, 0.06894686318290541, 0.018448672375113367, 0.03932125790900075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 135.5, 100, 297, 102.0, 297.0, 297.0, 297.0, 0.030933734784469202, 0.022988840010723696, 0.015527284842985519], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 555.2307692307693, 102, 1198, 552.0, 1145.2, 1198.0, 1198.0, 0.07036078847382037, 0.01365248772745478, 0.047881489091371604], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 106.66666666666667, 103, 118, 105.0, 118.0, 118.0, 118.0, 0.03302637155768882, 0.02599536667529022, 0.011739843014647196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83fbc47b-b572-4a13-a1c1-9dffa3f8ca90", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=862c9a13-71c3-484b-bfe9-c92bf4b6edfa", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1171.1739130434783, 778, 1817, 1143.0, 1642.4000000000005, 1810.3999999999999, 1817.0, 0.09665733713238693, 0.050027723320473706, 0.044458599403666255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 271.5, 203, 602, 204.0, 602.0, 602.0, 602.0, 0.030917476103367425, 0.047916049390668077, 0.06953412838481952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6812991f-65f3-4117-852f-98de6554bd7d", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.9676846590909091, 1.8081202651515151], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 982.9830508474575, 513, 2461, 803.0, 1636.0, 1800.0, 2461.0, 0.26601860326706916, 92.74936566962293, 0.9647753608159106], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20b2763c-2d65-4647-b027-7f22129563fb", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 181.12727272727273, 100, 419, 103.0, 405.4, 413.0, 419.0, 0.24172742815201578, 0.1796431375231289, 0.11685066106957795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75950f32-3207-4d61-9127-b68e79765201", 1, 0, 0.0, 1815.0, 1815, 1815, 1815.0, 1815.0, 1815.0, 1815.0, 0.5509641873278236, 0.09953942837465565, 0.37986398071625344], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 562.4909090909094, 488, 796, 499.0, 698.0, 703.6, 796.0, 0.24145257871354064, 70.99507512193355, 0.12143366995847014], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 152.12727272727267, 99, 434, 103.0, 304.2, 310.0, 434.0, 0.24189008514530996, 0.4280320647297868, 0.11763795156480895], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 745.3454545454542, 679, 996, 694.0, 893.4, 912.6, 996.0, 0.24147272016824065, 217.27757807114884, 0.1212079864906989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 110.38888888888889, 100, 200, 105.0, 122.60000000000012, 200.0, 200.0, 0.0819254296533644, 0.06120405633283572, 0.02912193007209438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 8, 4.624277456647399, 164.87861271676297, 100, 1239, 106.0, 300.6, 367.99999999999983, 1091.7399999999982, 0.7359885645245003, 1.6038470093019597, 0.35414713469654296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 109.125, 101, 120, 107.5, 120.0, 120.0, 120.0, 0.04070563213302601, 0.03152301394676721, 0.014469580172286589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75950f32-3207-4d61-9127-b68e79765201", 3, 0, 0.0, 430.0, 246, 761, 283.0, 761.0, 761.0, 761.0, 0.02267488001209327, 0.027199522410339745, 0.01454085729942179], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 24, 0, 0.0, 129.70833333333334, 101, 309, 104.0, 301.5, 307.25, 309.0, 0.11819690619598032, 0.095919559618027, 0.04201530649935238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 427.5, 203, 977, 305.5, 977.0, 977.0, 977.0, 0.03968391759634511, 11.915067192933288, 0.08671168517756073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 310.9230769230769, 198, 604, 213.0, 526.4, 604.0, 604.0, 0.06890958532331848, 0.10679639834776018, 0.15497927246054927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/720a95df-ce15-40cb-bbca-7d64b031fa3b", 3, 0, 0.0, 556.6666666666667, 205, 1198, 267.0, 1198.0, 1198.0, 1198.0, 0.019332014460346818, 0.026650742591005458, 0.012397157710573968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 131.29999999999998, 101, 347, 105.5, 324.80000000000007, 347.0, 347.0, 0.07491534565940487, 0.06211243014144017, 0.026630064277366573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9bb816f-d910-47c4-aef8-252369c02480", 3, 0, 0.0, 268.3333333333333, 181, 432, 192.0, 432.0, 432.0, 432.0, 0.02426615114576677, 0.028681769143971074, 0.015561301353242362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf62e974-05c8-4675-a715-6186380c8c58", 3, 0, 0.0, 579.3333333333334, 180, 1179, 379.0, 1179.0, 1179.0, 1179.0, 0.0281780098810888, 0.0234908474301655, 0.018069882638588847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b987a60-74e0-4cab-9f0c-0e2583eca683", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 0.9765625, 3.7267736486486487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d371a933-3bfe-4ab2-9886-c41f66f40fae", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5982253725165563, 2.282957367549669], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 106.45, 102, 120, 106.0, 111.0, 119.55, 120.0, 0.10088119725804906, 0.07832085138686426, 0.03586011308782213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94913263-6678-4d52-9b4e-e449f9f09648", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 1.6128077651515151, 3.013533775252525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99c82afd-812b-498f-b5de-edbb2a6b0f34", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 112.66666666666667, 100, 301, 101.0, 124.60000000000028, 301.0, 301.0, 0.0801538954793203, 0.05956749458961205, 0.040233498316768194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 111.5, 99, 299, 100.0, 127.10000000000028, 299.0, 299.0, 0.08015496626811837, 0.028135993476276357, 0.04533939226949881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 204.88888888888889, 99, 878, 103.0, 446.0000000000007, 878.0, 878.0, 0.08015496626811837, 4.0272695614298755, 0.046739668915458776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea463c65-a111-46af-8707-530bd0b05677", 3, 0, 0.0, 384.0, 184, 681, 287.0, 681.0, 681.0, 681.0, 0.025650452730490693, 0.030317966752738186, 0.016449020793967015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 176.83333333333331, 98, 494, 101.0, 319.40000000000026, 494.0, 494.0, 0.08015460933534016, 1.3297437473838425, 0.04681773676780991], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.45941807044410415], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.15313935681470137], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.15313935681470137], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.9188361408882083], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1306, 22, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
