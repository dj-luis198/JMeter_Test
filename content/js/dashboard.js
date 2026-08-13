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

    var data = {"OkPercent": 98.96249002394254, "KoPercent": 1.037509976057462};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8230027548209367, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3611111111111111, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=929d7e31-dd16-4a8c-a026-a7eb6ed9ce0e"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f79b36a2-716e-479b-b0d0-d0bb335e7c1a"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5fa3062f-c20d-4255-8019-c4feca88a642"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa7af946-e348-4a4b-8881-756765ae7653"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/610e50fd-fba5-4188-902b-416514a9814c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80a502c7-7507-43ac-accb-24f00449e96f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3fe1ecc6-4799-4895-a0a5-98e0a0b90b07"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d709c2a-44b8-45a6-bf63-09e01aaecac2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05263157894736842, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=153c5c41-5466-42b0-9cd4-96dc4182cad4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ac1abf3-8fae-4631-a6e2-94255f699efe"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/737175b1-66ce-46fd-99bd-fedad5443131"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0b7ca31-7b25-4601-bfc7-ab6440054f42"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a5438de-df49-4d01-942d-c49627f98904"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/929d7e31-dd16-4a8c-a026-a7eb6ed9ce0e"], "isController": false}, {"data": [0.275, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a5438de-df49-4d01-942d-c49627f98904"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f79b36a2-716e-479b-b0d0-d0bb335e7c1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3157894736842105, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3879310344827586, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8148148148148148, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=610e50fd-fba5-4188-902b-416514a9814c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34492c81-47dc-495a-b384-748530379b37"], "isController": false}, {"data": [0.9558823529411765, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa7af946-e348-4a4b-8881-756765ae7653"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3fe1ecc6-4799-4895-a0a5-98e0a0b90b07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31bf22be-6081-4e3a-834d-77e19b844516"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/153c5c41-5466-42b0-9cd4-96dc4182cad4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=737175b1-66ce-46fd-99bd-fedad5443131"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d709c2a-44b8-45a6-bf63-09e01aaecac2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fa3062f-c20d-4255-8019-c4feca88a642"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0b7ca31-7b25-4601-bfc7-ab6440054f42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1253, 13, 1.037509976057462, 319.775738228252, 77, 6447, 108.0, 852.6000000000001, 1022.3, 1811.420000000001, 4.904531897071372, 677.5113899545655, 3.5907797711544633], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1368.351851851852, 988, 1699, 1376.5, 1590.5, 1677.75, 1699.0, 0.24205260609972568, 291.27115561489205, 1.190170773156366], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=929d7e31-dd16-4a8c-a026-a7eb6ed9ce0e", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 485.08333333333337, 95, 778, 467.0, 742.9000000000001, 778.0, 778.0, 0.08510276158461343, 0.016185315252542444, 0.05750392492163454], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 485.08333333333337, 95, 778, 467.0, 742.9000000000001, 778.0, 778.0, 0.08595926963273902, 0.01634821070407805, 0.05808266729822852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 133.2, 78, 247, 81.0, 243.4, 247.0, 247.0, 0.12062823183137782, 0.05643453606382037, 0.06744500357863754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 105.79999999999998, 79, 240, 82.0, 239.4, 240.0, 240.0, 0.12077683661309543, 0.08975700455328674, 0.06062431056555767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f79b36a2-716e-479b-b0d0-d0bb335e7c1a", 1, 0, 0.0, 695.0, 695, 695, 695.0, 695.0, 695.0, 695.0, 1.4388489208633093, 0.2599482913669065, 0.9920188848920864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 203.39999999999998, 78, 645, 101.0, 585.0, 645.0, 645.0, 0.1207778090905431, 4.763237751117195, 0.06973817635573092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 257.1333333333334, 80, 1020, 122.0, 967.2, 1020.0, 1020.0, 0.120775864151308, 14.518123802306013, 0.06961910815076049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fa3062f-c20d-4255-8019-c4feca88a642", 3, 0, 0.0, 1367.3333333333333, 164, 3374, 564.0, 3374.0, 3374.0, 3374.0, 0.016006487963121055, 0.022066235847596892, 0.010264577241975414], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 192.58333333333331, 91, 317, 193.5, 288.80000000000007, 317.0, 317.0, 0.08500269175190549, 0.20959444640226108, 0.0549459945137846], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fa7af946-e348-4a4b-8881-756765ae7653", 3, 0, 0.0, 290.6666666666667, 193, 431, 248.0, 431.0, 431.0, 431.0, 0.029285149500688203, 0.029370945837115997, 0.01877986475141789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 90.57894736842105, 79, 241, 81.0, 96.0, 241.0, 241.0, 0.12223365928975811, 0.0908396628120175, 0.06135556726067936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 89.89473684210527, 78, 246, 81.0, 86.0, 246.0, 246.0, 0.12223680485859133, 0.032707895050052754, 0.06971317777091536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 572.75, 465, 701, 562.5, 701.0, 701.0, 701.0, 0.09004547296384674, 26.476358842465448, 0.05135405879969385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 870.75, 771, 938, 887.0, 938.0, 938.0, 938.0, 0.0892379082634303, 80.29642671894521, 0.05080634816169909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 120.5, 79, 240, 81.5, 240.0, 240.0, 240.0, 0.09086365907955113, 0.16078608423061197, 0.05031220185361865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 93.92307692307692, 79, 236, 82.0, 176.39999999999995, 236.0, 236.0, 0.058410165165974734, 0.04340833563604177, 0.02931916493682716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/610e50fd-fba5-4188-902b-416514a9814c", 3, 0, 0.0, 381.6666666666667, 208, 486, 451.0, 486.0, 486.0, 486.0, 0.03834502856704628, 0.024652158665337372, 0.024589748137070697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 119.76923076923076, 77, 251, 82.0, 249.0, 251.0, 251.0, 0.05841173986106993, 0.022378295770091393, 0.03293558589221686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 171.23076923076923, 79, 931, 81.0, 656.9999999999998, 931.0, 931.0, 0.05841173986106993, 4.057531667306949, 0.03395357895469945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 111.46153846153847, 78, 467, 82.0, 314.59999999999985, 467.0, 467.0, 0.05841226477830299, 1.3356978833417206, 0.03401092730593648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80a502c7-7507-43ac-accb-24f00449e96f", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 120.25, 79, 238, 82.0, 238.0, 238.0, 238.0, 0.09054895302773061, 0.06729272778720996, 0.05084535936615733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 552.8888888888889, 79, 1056, 804.5, 1020.9000000000001, 1056.0, 1056.0, 0.10467185373852972, 52.3369376977135, 0.056538247386111205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 123.0, 79, 242, 82.0, 239.0, 242.0, 242.0, 0.12223680485859133, 0.03294663880954219, 0.07186187160632028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3fe1ecc6-4799-4895-a0a5-98e0a0b90b07", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 374.33333333333337, 78, 732, 467.0, 709.5, 732.0, 732.0, 0.10467246241967842, 17.11097189108249, 0.05664079536533597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 113.84210526315789, 78, 239, 81.0, 237.0, 239.0, 239.0, 0.12223837770371991, 0.03294706274045576, 0.07198216968295225], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 597.9166666666667, 307, 1065, 521.5, 1023.0000000000001, 1065.0, 1065.0, 0.08625026953209229, 0.01640355467907712, 0.058953126123050384], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 268.84615384615387, 161, 1167, 169.0, 833.7999999999997, 1167.0, 1167.0, 0.0583889150890431, 5.456872206876417, 0.13016885765456218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d709c2a-44b8-45a6-bf63-09e01aaecac2", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 636.3684210526317, 173, 1826, 382.0, 1365.0, 1826.0, 1826.0, 0.08806488991888761, 0.0540945466396292, 0.03981840237543453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 82.61111111111111, 79, 93, 81.5, 87.60000000000001, 93.0, 93.0, 0.10476201562118055, 0.07785536512472499, 0.05258562112235039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 144.8888888888889, 78, 254, 83.5, 252.2, 254.0, 254.0, 0.10476750344859699, 0.11545342502430024, 0.054861976089727545], "isController": false}, {"data": ["login", 19, 0, 0.0, 3416.9473684210525, 1395, 9720, 2530.0, 8530.0, 9720.0, 9720.0, 0.08582489012155514, 21.734862282106413, 0.1594527294008971], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=153c5c41-5466-42b0-9cd4-96dc4182cad4", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 98.78947368421052, 81, 243, 85.0, 163.0, 243.0, 243.0, 0.12357803953196443, 0.1000451120820298, 0.04392813123987799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ac1abf3-8fae-4631-a6e2-94255f699efe", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/737175b1-66ce-46fd-99bd-fedad5443131", 3, 0, 0.0, 307.66666666666663, 173, 570, 180.0, 570.0, 570.0, 570.0, 0.02873012832790653, 0.028814298625742193, 0.01842394297069527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 637.7222222222223, 162, 1143, 892.0, 1104.3, 1143.0, 1143.0, 0.10461770945337247, 69.60492284443927, 0.2204168906744936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0b7ca31-7b25-4601-bfc7-ab6440054f42", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a5438de-df49-4d01-942d-c49627f98904", 1, 0, 0.0, 822.0, 822, 822, 822.0, 822.0, 822.0, 822.0, 1.2165450121654502, 0.21978596411192217, 0.8387507603406327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 402.99999999999994, 163, 1103, 324.0, 1049.6000000000001, 1103.0, 1103.0, 0.12054970666238045, 19.39116590402234, 0.26700661265370085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 690.0, 83, 1176, 909.5, 1176.0, 1176.0, 1176.0, 0.0953697963854847, 76.07212787897573, 0.1644290776548567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/929d7e31-dd16-4a8c-a026-a7eb6ed9ce0e", 3, 0, 0.0, 290.0, 194, 453, 223.0, 453.0, 453.0, 453.0, 0.03786779091930374, 0.024345340841674768, 0.024283707067392045], "isController": false}, {"data": ["register", 20, 4, 20.0, 1371.3, 325, 3773, 1214.5, 2986.000000000001, 3735.7499999999995, 3773.0, 0.07792319111052236, 0.02471626218036881, 0.035156752239317704], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 106.99999999999999, 82, 274, 84.0, 248.8, 274.0, 274.0, 0.08284875442075776, 0.0643210544575219, 0.029450143173003734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 240.31578947368422, 161, 480, 168.0, 341.0, 480.0, 480.0, 0.12216921078689831, 0.1893384155457106, 0.27476141840061213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a5438de-df49-4d01-942d-c49627f98904", 3, 0, 0.0, 292.6666666666667, 194, 449, 235.0, 449.0, 449.0, 449.0, 0.016039864409679524, 0.022112247973630463, 0.01028598075750933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 288.25, 161, 477, 320.0, 476.3, 477.0, 477.0, 0.11765051913291567, 0.18233532603900113, 0.2645987749639695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 122.49999999999999, 79, 330, 81.0, 330.0, 330.0, 330.0, 0.04244902579485801, 0.031546590458873966, 0.021307421150934584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 135.0, 79, 244, 82.0, 244.0, 244.0, 244.0, 0.04247516972369902, 0.011365426273724152, 0.0242241202330471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 135.33333333333334, 79, 247, 81.0, 247.0, 247.0, 247.0, 0.04247486903582047, 0.011448304544810987, 0.024970577304261648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f79b36a2-716e-479b-b0d0-d0bb335e7c1a", 3, 0, 0.0, 931.3333333333334, 317, 1569, 908.0, 1569.0, 1569.0, 1569.0, 0.020994436474334303, 0.024814713163511668, 0.013463229119283389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 79.66666666666667, 78, 82, 79.5, 82.0, 82.0, 82.0, 0.04252514299079331, 0.011461854946737259, 0.025041661351023793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 0.9606575732899023, 2.0135637214983713], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 937.0740740740741, 625, 1342, 885.5, 1226.5, 1273.5, 1342.0, 0.23742003561300534, 284.0369031524105, 0.46881182813427424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 4, 20.0, 1371.3, 325, 3773, 1214.5, 2986.000000000001, 3735.7499999999995, 3773.0, 0.07918126571253242, 0.025115307718193876, 0.03572436011639646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 97.88888888888889, 77, 236, 81.0, 236.0, 236.0, 236.0, 0.06056323811446452, 0.016323685273039266, 0.03566370369435753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 114.88888888888889, 79, 236, 80.0, 236.0, 236.0, 236.0, 0.06056242303525406, 0.01632346558372082, 0.03560408072970991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 145.0625, 79, 769, 81.0, 402.9000000000004, 769.0, 769.0, 0.0816914208690946, 4.6147724973705575, 0.04758684819181146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 135.0, 78, 621, 81.0, 352.2000000000003, 621.0, 621.0, 0.08169225506364337, 1.5219071663254313, 0.04766711171926456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 98.22222222222223, 79, 244, 80.0, 244.0, 244.0, 244.0, 0.06056405321561476, 0.016205615801834418, 0.03454043659953029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 101.3125, 79, 236, 82.0, 235.3, 236.0, 236.0, 0.08168975253110593, 0.060708888355636335, 0.04100442656346528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 98.88888888888889, 80, 237, 82.0, 237.0, 237.0, 237.0, 0.06056323811446452, 0.04500842207530029, 0.030399906631674575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 130.875, 78, 241, 82.5, 239.6, 241.0, 241.0, 0.0816914208690946, 0.029527380028489883, 0.04616083828162096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 103.77777777777777, 81, 249, 86.0, 249.0, 249.0, 249.0, 0.05641359943837128, 0.044403672995436766, 0.02005327167535854], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 489.9166666666667, 83, 908, 452.0, 828.2000000000003, 908.0, 908.0, 0.08787217527569895, 0.01651178814384675, 0.05980428074793866], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1972.6842105263158, 733, 6447, 1377.0, 4163.0, 6447.0, 6447.0, 0.08789866671601328, 0.045494427108874066, 0.04042995314769752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 217.0, 161, 475, 166.0, 475.0, 475.0, 475.0, 0.06052861658484095, 0.09380753371107674, 0.1361302773387585], "isController": false}, {"data": ["addBook", 58, 5, 8.620689655172415, 904.7758620689657, 422, 1847, 762.5, 1585.6000000000001, 1808.45, 1847.0, 0.27991467428549366, 81.87813395847611, 1.0199174146139591], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 145.79629629629625, 79, 341, 83.0, 322.0, 330.0, 341.0, 0.23824335234868238, 0.17705389759506573, 0.11516646427011502], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 515.5925925925926, 388, 815, 472.5, 695.5, 716.0, 815.0, 0.23815824292140778, 70.02643101680339, 0.11977685068801269], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 129.35185185185182, 78, 340, 86.0, 244.0, 247.75, 340.0, 0.23855804912528716, 0.42213592286623075, 0.11601748873475878], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 787.9814814814815, 540, 1018, 785.0, 959.5, 1009.0, 1018.0, 0.2378184124299757, 213.98942554467024, 0.11937369530176514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 84.93750000000001, 81, 96, 84.0, 92.5, 96.0, 96.0, 0.11195700850873265, 0.08363975733318406, 0.03979721786833856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=610e50fd-fba5-4188-902b-416514a9814c", 1, 0, 0.0, 925.0, 925, 925, 925.0, 925.0, 925.0, 925.0, 1.0810810810810811, 0.1953125, 0.7453547297297297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34492c81-47dc-495a-b384-748530379b37", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, 2.9411764705882355, 155.01764705882346, 80, 605, 91.0, 308.3000000000002, 404.4999999999999, 605.0, 0.6927747666979094, 1.4424821839724522, 0.3345718486389014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 85.66666666666667, 82, 89, 86.0, 89.0, 89.0, 89.0, 0.04312327506899724, 0.03339527063448712, 0.015328976684682614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa7af946-e348-4a4b-8881-756765ae7653", 1, 0, 0.0, 1065.0, 1065, 1065, 1065.0, 1065.0, 1065.0, 1065.0, 0.9389671361502347, 0.16963761737089203, 0.6473738262910799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fe1ecc6-4799-4895-a0a5-98e0a0b90b07", 3, 0, 0.0, 362.0, 167, 465, 454.0, 465.0, 465.0, 465.0, 0.019743596493537262, 0.02333626265235475, 0.012661095407639454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 95.86666666666667, 82, 239, 84.0, 153.80000000000007, 239.0, 239.0, 0.11422653406235246, 0.0926975095759911, 0.04060396327997685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31bf22be-6081-4e3a-834d-77e19b844516", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.7603236607142857, 1.4206659226190477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/153c5c41-5466-42b0-9cd4-96dc4182cad4", 3, 0, 0.0, 1274.6666666666667, 195, 2987, 642.0, 2987.0, 2987.0, 2987.0, 0.023424506718929344, 0.02349313320345746, 0.015021574946709247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=737175b1-66ce-46fd-99bd-fedad5443131", 1, 0, 0.0, 718.0, 718, 718, 718.0, 718.0, 718.0, 718.0, 1.392757660167131, 0.2516212569637883, 0.9602411211699164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 260.0, 162, 579, 165.0, 579.0, 579.0, 579.0, 0.04237527543929035, 0.06567340050991581, 0.0953029876334821], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d709c2a-44b8-45a6-bf63-09e01aaecac2", 3, 0, 0.0, 333.6666666666667, 175, 448, 378.0, 448.0, 448.0, 448.0, 0.018731268731268732, 0.025822566105769232, 0.012011913867382618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 287.25, 160, 1005, 182.0, 639.6000000000004, 1005.0, 1005.0, 0.0816559833421794, 6.224200417274834, 0.18234044229473728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fa3062f-c20d-4255-8019-c4feca88a642", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 100.76923076923079, 81, 245, 87.0, 190.19999999999993, 245.0, 245.0, 0.05764378799501603, 0.04779255469508653, 0.020490565263853355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 109.05555555555554, 82, 242, 85.5, 238.4, 242.0, 242.0, 0.10019984302024593, 0.07779187031356985, 0.03561791294860305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0b7ca31-7b25-4601-bfc7-ab6440054f42", 3, 0, 0.0, 297.0, 211, 415, 265.0, 415.0, 415.0, 415.0, 0.02836182120707911, 0.023053212094425957, 0.018187756438133414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 111.9375, 80, 240, 82.0, 237.9, 240.0, 240.0, 0.11785851085771532, 0.08758820972922007, 0.05915944783287663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 119.50000000000001, 78, 246, 81.5, 238.3, 246.0, 246.0, 0.11799932150390134, 0.03157403719928611, 0.06729648804519374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 145.0625, 79, 318, 80.5, 266.20000000000005, 318.0, 318.0, 0.11785937902839674, 0.03176678575374756, 0.06928842399911606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 149.06249999999997, 77, 242, 82.5, 240.6, 242.0, 242.0, 0.11786198361718428, 0.031767487771819196, 0.06940505480582237], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 30.76923076923077, 0.3192338387869114], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.07980845969672785], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.07980845969672785], "isController": false}, {"data": ["401/Unauthorized", 7, 53.84615384615385, 0.5586592178770949], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1253, 13, "401/Unauthorized", 7, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
