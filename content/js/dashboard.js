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

    var data = {"OkPercent": 98.54838709677419, "KoPercent": 1.4516129032258065};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7175572519083969, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=634de28b-64d1-47b5-bfec-057af0d31a9d"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4583333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8293688e-592b-4f46-96ad-0c3b82c604cd"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2c23459b-d998-4143-b498-52135c7c9258"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c87222e-4d38-4540-bd59-8c9a2408873d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c23459b-d998-4143-b498-52135c7c9258"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ea51fe5-34e9-46db-8617-bec71cc13f3b"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/21cca3a2-dec7-459a-8d73-e35f83830cf8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e47aa440-cf3f-418e-adce-e0c81f59d3dd"], "isController": false}, {"data": [0.525, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=682b0cf5-5d65-4615-9913-a338ae8349f1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71a3de54-ce3b-45ed-92d6-410beea29e3f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f28a95fe-ebff-431a-9daf-b0b03800d339"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dc3c261-651e-41ad-98d3-fc38f31c57cc"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24528301886792453, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/634de28b-64d1-47b5-bfec-057af0d31a9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ec3b5f7-15ad-48b1-ba49-6353be2d1670"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2f3f082e-1cc4-403a-a528-bc3a98e844d6"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3018867924528302, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9212121212121213, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ce6afa8f-546e-4fcd-b552-13973f156467"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85034d11-3977-4c69-b806-3cc44265ac0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/682b0cf5-5d65-4615-9913-a338ae8349f1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/85034d11-3977-4c69-b806-3cc44265ac0d"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8293688e-592b-4f46-96ad-0c3b82c604cd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5ea51fe5-34e9-46db-8617-bec71cc13f3b"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ec3b5f7-15ad-48b1-ba49-6353be2d1670"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5599a9e2-adce-481f-ae01-cada5f58c152"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/71a3de54-ce3b-45ed-92d6-410beea29e3f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c87222e-4d38-4540-bd59-8c9a2408873d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e47aa440-cf3f-418e-adce-e0c81f59d3dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b57ec29d-4777-42fa-8f5f-26b64c22320b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9dc3c261-651e-41ad-98d3-fc38f31c57cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1240, 18, 1.4516129032258065, 495.03951612903165, 138, 3039, 170.0, 1386.6000000000004, 1657.0, 2218.7699999999995, 4.877780137993974, 699.6611868162748, 3.5572460911377815], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2336.5283018867926, 1692, 3203, 2293.0, 2829.8, 3070.0, 3203.0, 0.2456023281247104, 295.542094189941, 1.2076247286210124], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=634de28b-64d1-47b5-bfec-057af0d31a9d", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 0.5865716314935066, 2.2384841720779223], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 793.5833333333335, 143, 1671, 562.5, 1635.3000000000002, 1671.0, 1671.0, 0.09556270506163794, 0.018174645323001944, 0.0645717073670882], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 793.5833333333335, 143, 1671, 562.5, 1635.3000000000002, 1671.0, 1671.0, 0.09366584709050463, 0.01781389035241775, 0.06329000068298013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 163.83333333333334, 139, 420, 140.0, 337.5000000000003, 420.0, 420.0, 0.09548514410299663, 0.037500920039148906, 0.05378809956713401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 142.25, 138, 158, 141.0, 153.8, 158.0, 158.0, 0.09548666369597048, 0.07096225690686868, 0.047929829238016426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 370.3333333333333, 139, 819, 416.0, 744.6000000000003, 819.0, 819.0, 0.09548590389343772, 2.3632605800370805, 0.05554469734947045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 299.5, 138, 1505, 140.0, 1178.300000000001, 1505.0, 1505.0, 0.09548590389343772, 7.183457079583523, 0.05545144939644951], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 314.0833333333333, 145, 780, 261.0, 682.8000000000004, 780.0, 780.0, 0.09733623179001331, 0.19587649248888744, 0.06291843173080043], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8293688e-592b-4f46-96ad-0c3b82c604cd", 3, 0, 0.0, 348.6666666666667, 279, 441, 326.0, 441.0, 441.0, 441.0, 0.042275552048250495, 0.027179106541437088, 0.027110298676775224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 185.0, 140, 513, 142.0, 454.20000000000005, 513.0, 513.0, 0.11030141700553713, 0.08197204916134156, 0.0553661409578575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c23459b-d998-4143-b498-52135c7c9258", 3, 0, 0.0, 886.6666666666666, 259, 1743, 658.0, 1743.0, 1743.0, 1743.0, 0.018633771848097492, 0.025688158781475547, 0.011949391452067729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1025.2, 839, 1110, 1102.0, 1110.0, 1110.0, 1110.0, 0.0268381445180406, 7.891305598571138, 0.015306129295445031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 178.66666666666666, 139, 434, 141.0, 423.2, 434.0, 434.0, 0.11030303921640722, 0.0405593467118664, 0.06228961993249454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1518.4, 1367, 1659, 1517.0, 1659.0, 1659.0, 1659.0, 0.026800598189351585, 24.115225361205063, 0.015258543695695289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 362.8, 139, 420, 418.0, 420.0, 420.0, 420.0, 0.02693733298853547, 0.0476664525148694, 0.01491549590283165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 167.0, 138, 418, 142.0, 363.8000000000002, 418.0, 418.0, 0.055535921643863284, 0.04127230114353512, 0.02787642941889231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 243.8181818181818, 139, 418, 148.0, 417.8, 418.0, 418.0, 0.05545948180676908, 0.014839744155326883, 0.03162923571792299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 193.9090909090909, 140, 418, 141.0, 417.8, 418.0, 418.0, 0.05545892258438579, 0.014947912727822733, 0.03260378065996118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 243.54545454545456, 139, 418, 142.0, 417.8, 418.0, 418.0, 0.05553676281258362, 0.01496889310182918, 0.032703777320300706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 195.2, 139, 417, 140.0, 417.0, 417.0, 417.0, 0.02697773797062664, 0.0200488853473114, 0.015148632161240546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 777.1999999999999, 139, 1656, 416.5, 1530.9, 1649.75, 1656.0, 0.09599093845540982, 38.88199672700897, 0.0527200232298071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 251.0666666666667, 138, 1247, 140.0, 750.2000000000003, 1247.0, 1247.0, 0.11007639301675363, 6.630819887960578, 0.06408223348670644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 582.4499999999999, 138, 1255, 141.5, 1248.9, 1254.7, 1255.0, 0.09599001703822803, 12.71514325010199, 0.052813257421228194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 270.4666666666667, 138, 1114, 141.0, 780.4000000000002, 1114.0, 1114.0, 0.11007639301675363, 2.185432054429107, 0.06418972996426187], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 585.8333333333333, 143, 1668, 483.5, 1447.500000000001, 1668.0, 1668.0, 0.0933968431867003, 0.01776272969786121, 0.06383789761760218], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 462.09090909090907, 282, 836, 557.0, 781.6000000000001, 836.0, 836.0, 0.05541924660053303, 0.08588900815922454, 0.12463918449319099], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c87222e-4d38-4540-bd59-8c9a2408873d", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c23459b-d998-4143-b498-52135c7c9258", 1, 0, 0.0, 933.0, 933, 933, 933.0, 933.0, 933.0, 933.0, 1.0718113612004287, 0.19363779474812431, 0.7389636923901393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ea51fe5-34e9-46db-8617-bec71cc13f3b", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 820.9999999999999, 185, 2403, 666.0, 1644.1999999999998, 2306.5499999999984, 2403.0, 0.09273231552591868, 0.0569615492830106, 0.041928771570801125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 156.6, 140, 424, 141.0, 152.8, 410.4499999999998, 424.0, 0.09598817425693154, 0.07133496153273916, 0.04818156403131134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 223.7, 139, 422, 141.0, 420.9, 421.95, 422.0, 0.09599047774460773, 0.0905628911611968, 0.05111680421302207], "isController": false}, {"data": ["login", 22, 0, 0.0, 3238.4999999999995, 2009, 5732, 3054.5, 5383.4, 5705.9, 5732.0, 0.0922636896249481, 25.21343268236757, 0.17397734087658892], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/21cca3a2-dec7-459a-8d73-e35f83830cf8", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 1.0435814950980393, 1.9499336192810457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 165.6, 142, 420, 144.0, 264.0000000000001, 420.0, 420.0, 0.10443573373065328, 0.08454806959249177, 0.03712363972456816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e47aa440-cf3f-418e-adce-e0c81f59d3dd", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 935.1, 280, 1798, 701.5, 1672.9, 1791.75, 1798.0, 0.09592326139088729, 51.722670301258994, 0.20468937350119903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=682b0cf5-5d65-4615-9913-a338ae8349f1", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 0.5329323377581121, 2.033785029498525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71a3de54-ce3b-45ed-92d6-410beea29e3f", 1, 0, 0.0, 820.0, 820, 820, 820.0, 820.0, 820.0, 820.0, 1.2195121951219512, 0.2203220274390244, 0.840796493902439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1265.142857142857, 139, 1799, 1657.0, 1799.0, 1799.0, 1799.0, 0.03749230068825152, 32.04131350258429, 0.06748404903457325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 593.8333333333334, 280, 1664, 558.0, 1378.400000000001, 1664.0, 1664.0, 0.09537965075151217, 9.644436646550833, 0.21247742184829865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f28a95fe-ebff-431a-9daf-b0b03800d339", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.7923968672456575, 1.480594758064516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dc3c261-651e-41ad-98d3-fc38f31c57cc", 1, 0, 0.0, 1668.0, 1668, 1668, 1668.0, 1668.0, 1668.0, 1668.0, 0.5995203836930455, 0.10831178806954436, 0.4133412020383693], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1441.8636363636365, 536, 2553, 1415.0, 2347.8999999999996, 2540.5499999999997, 2553.0, 0.0920390412878772, 0.029105385748172816, 0.04152542683105397], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 165.73333333333332, 141, 419, 146.0, 266.6000000000001, 419.0, 419.0, 0.07698703538324146, 0.05977020813445016, 0.027366485233886614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 483.93333333333334, 281, 1760, 286.0, 1205.0000000000005, 1760.0, 1760.0, 0.10996180659917455, 8.929228008555029, 0.24543102966403002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 673.6666666666666, 280, 1933, 558.5, 1851.7000000000003, 1933.0, 1933.0, 0.08363418407883916, 16.783940559617236, 0.18452880849165748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 179.9333333333333, 140, 423, 142.0, 420.6, 423.0, 423.0, 0.07360120902252688, 0.054697773502092734, 0.036944356872635566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 178.4, 138, 431, 141.0, 423.8, 431.0, 431.0, 0.07360301477948537, 0.027064441892873266, 0.041564619153467194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 215.13333333333333, 139, 1234, 141.0, 584.8000000000004, 1234.0, 1234.0, 0.07360265362100521, 4.4337021414078714, 0.04284862816920759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 224.26666666666665, 139, 1113, 141.0, 697.8000000000002, 1113.0, 1113.0, 0.07360301477948537, 1.4612977714233841, 0.04292071636587568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 143.0, 6.993006993006993, 2.0623907342657346, 4.3228256118881125], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1615.3773584905657, 1105, 2628, 1509.0, 2227.8, 2446.1, 2628.0, 0.2369361032504951, 283.45795180473783, 0.46785625075439563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1441.8636363636365, 536, 2553, 1415.0, 2347.8999999999996, 2540.5499999999997, 2553.0, 0.09244823949136659, 0.029234785961314614, 0.04171004555176891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 171.88888888888889, 140, 420, 141.0, 420.0, 420.0, 420.0, 0.045257287680463436, 0.01219825332012491, 0.0266505317102729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 172.33333333333337, 139, 416, 141.0, 416.0, 416.0, 416.0, 0.04525706010137581, 0.01219819198044895, 0.02660620134866039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 351.26666666666665, 139, 1506, 142.0, 1342.2, 1506.0, 1506.0, 0.07701312303616537, 9.25752891521882, 0.04439285100014376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 270.2, 138, 1108, 142.0, 937.6000000000001, 1108.0, 1108.0, 0.07717955050629785, 3.0438087207746767, 0.04456415582293982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/634de28b-64d1-47b5-bfec-057af0d31a9d", 3, 0, 0.0, 410.0, 258, 511, 461.0, 511.0, 511.0, 511.0, 0.0819493006993007, 0.03707992447006119, 0.05255212316979896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 202.44444444444446, 139, 423, 141.0, 423.0, 423.0, 423.0, 0.045256832524576976, 0.012109738390365323, 0.025810537299172806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 142.33333333333334, 139, 150, 141.0, 150.0, 150.0, 150.0, 0.07717438839297198, 0.057353231999073905, 0.038737925423816016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 205.88888888888889, 140, 428, 146.0, 428.0, 428.0, 428.0, 0.04525660495006688, 0.03363308238964931, 0.02271669428157654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 216.86666666666665, 138, 427, 142.0, 426.4, 427.0, 427.0, 0.07706891502381429, 0.03605580881257354, 0.043090354311492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 178.88888888888889, 141, 420, 146.0, 420.0, 420.0, 420.0, 0.04699837072314827, 0.036992858205915524, 0.01670645209299411], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 727.5, 139, 2338, 592.5, 1956.1000000000013, 2338.0, 2338.0, 0.09287997585120628, 0.017452788431025008, 0.06321250309599918], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ec3b5f7-15ad-48b1-ba49-6353be2d1670", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1655.4545454545455, 1164, 3039, 1538.0, 2434.1, 2965.049999999999, 3039.0, 0.09181318520806118, 0.04752049625026605, 0.042230478743160965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 410.44444444444446, 282, 844, 288.0, 844.0, 844.0, 844.0, 0.045224539840307124, 0.07008920383453848, 0.10171105005100323], "isController": false}, {"data": ["addBook", 56, 9, 16.071428571428573, 1454.8928571428569, 706, 2733, 1230.0, 2396.4000000000005, 2522.2, 2733.0, 0.2590409932371798, 89.56812593815629, 0.9393849857990028], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 258.9245283018867, 139, 573, 143.0, 562.0, 562.9, 573.0, 0.23856572485719815, 0.1772934732581326, 0.1153222986370245], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 884.3962264150945, 686, 1253, 832.0, 1112.8, 1116.3, 1253.0, 0.2380043559287783, 69.98118313144127, 0.11969945635089925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f3f082e-1cc4-403a-a528-bc3a98e844d6", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.5837951325411335, 1.0908220978062155], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 210.1132075471698, 139, 562, 144.0, 425.0, 429.0, 562.0, 0.23873551258316328, 0.4224499500006757, 0.11610379420548372], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1352.716981132075, 963, 2064, 1267.0, 1668.2, 1874.2999999999997, 2064.0, 0.2375595019318518, 213.75645742334223, 0.11924373436813654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 192.5, 144, 423, 146.5, 421.5, 423.0, 423.0, 0.08429511720533588, 0.0629743795528144, 0.029964279944084238], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 9, 5.454545454545454, 225.1878787878787, 139, 1220, 150.0, 422.20000000000005, 523.7999999999995, 852.3800000000019, 0.6869847614289284, 1.5066133667978183, 0.32987141154550753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 150.06666666666666, 141, 185, 144.0, 173.6, 185.0, 185.0, 0.07602057623596788, 0.058871403276486836, 0.027022939208879205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce6afa8f-546e-4fcd-b552-13973f156467", 1, 0, 0.0, 1040.0, 1040, 1040, 1040.0, 1040.0, 1040.0, 1040.0, 0.9615384615384616, 0.3070537860576923, 0.57373046875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85034d11-3977-4c69-b806-3cc44265ac0d", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 147.66666666666669, 140, 162, 144.5, 161.7, 162.0, 162.0, 0.08854716243239055, 0.07185809763800445, 0.03147574914588883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/682b0cf5-5d65-4615-9913-a338ae8349f1", 3, 0, 0.0, 361.3333333333333, 236, 591, 257.0, 591.0, 591.0, 591.0, 0.07155805743726744, 0.033216728484877396, 0.04588846782272684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85034d11-3977-4c69-b806-3cc44265ac0d", 3, 0, 0.0, 399.66666666666663, 229, 670, 300.0, 670.0, 670.0, 670.0, 0.07424088693112921, 0.033592067979905466, 0.0476089021010171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 414.6, 281, 1657, 284.0, 1166.8000000000002, 1657.0, 1657.0, 0.07355032313108628, 5.972506506139, 0.1641618312436869], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8293688e-592b-4f46-96ad-0c3b82c604cd", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ea51fe5-34e9-46db-8617-bec71cc13f3b", 3, 0, 0.0, 1100.6666666666665, 456, 2338, 508.0, 2338.0, 2338.0, 2338.0, 0.025172642372269818, 0.025246390347969824, 0.016142612458779796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 533.0666666666666, 281, 1646, 294.0, 1481.6000000000001, 1646.0, 1646.0, 0.07695346367540003, 12.378440581344941, 0.17044490805343648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 200.1818181818182, 142, 421, 149.0, 420.8, 421.0, 421.0, 0.05444412547886083, 0.04513970950346958, 0.01935318522881381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ec3b5f7-15ad-48b1-ba49-6353be2d1670", 3, 0, 0.0, 566.3333333333334, 263, 1065, 371.0, 1065.0, 1065.0, 1065.0, 0.03479915090071802, 0.02901062026586551, 0.02231586174297347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5599a9e2-adce-481f-ae01-cada5f58c152", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 163.04999999999998, 141, 455, 147.0, 170.10000000000005, 440.8499999999998, 455.0, 0.09249709790355327, 0.0718117117512938, 0.0328798277704037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71a3de54-ce3b-45ed-92d6-410beea29e3f", 3, 0, 0.0, 363.3333333333333, 226, 547, 317.0, 547.0, 547.0, 547.0, 0.024306061931845802, 0.024377271097661756, 0.01558689518415893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c87222e-4d38-4540-bd59-8c9a2408873d", 3, 0, 0.0, 408.0, 227, 740, 257.0, 740.0, 740.0, 740.0, 0.02366191850835266, 0.023731240535232595, 0.01517382143927563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e47aa440-cf3f-418e-adce-e0c81f59d3dd", 3, 0, 0.0, 384.0, 340, 436, 376.0, 436.0, 436.0, 436.0, 0.01557511097266568, 0.021471547841549202, 0.009987945513070114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b57ec29d-4777-42fa-8f5f-26b64c22320b", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.8294439935064934, 1.54981737012987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dc3c261-651e-41ad-98d3-fc38f31c57cc", 3, 0, 0.0, 585.3333333333334, 382, 780, 594.0, 780.0, 780.0, 780.0, 0.02075119319360863, 0.024527207840492497, 0.01330724303105762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 164.16666666666666, 138, 416, 141.0, 335.0000000000003, 416.0, 416.0, 0.08452966286752793, 0.06281940765838746, 0.04242992843155211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 278.8333333333333, 138, 424, 277.5, 422.5, 424.0, 424.0, 0.08452966286752793, 0.04377822058015526, 0.04702512820332202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 438.9166666666667, 138, 1520, 140.0, 1518.5, 1520.0, 1520.0, 0.08371586834284439, 12.573417617481267, 0.048016718756540296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 369.5, 139, 1107, 277.5, 1022.1000000000004, 1107.0, 1107.0, 0.08395776924207124, 4.13325300498849, 0.04823745530997908], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 27.77777777777778, 0.4032258064516129], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.08064516129032258], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.08064516129032258], "isController": false}, {"data": ["401/Unauthorized", 11, 61.111111111111114, 0.8870967741935484], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1240, 18, "401/Unauthorized", 11, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
