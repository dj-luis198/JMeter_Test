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

    var data = {"OkPercent": 98.07121661721068, "KoPercent": 1.9287833827893175};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8132568514977693, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.39655172413793105, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b80f9e94-5d0d-40a3-852b-9734a1886bd4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/20e66896-80c6-4965-9939-2113575bfe76"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8014ead2-6945-4808-a1fb-413f37c7c12c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8bf106be-c7a2-4b9c-86fc-4113e36cadca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c73e508-769f-454a-9cfa-9a9a46aae4f9"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/32798309-d4c4-4aad-9a5b-8ab9ff35e170"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ae70395-4f25-45bc-8f37-6d9ea61ec2ba"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d0e7626-a2fa-485c-ac94-073d99576a60"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/74368baa-bff2-4909-bb89-278f8368ce77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e18d336-1bf7-47c9-880c-ff5cb1f72338"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ba16f24d-3889-4581-9a95-57be7ae14430"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94a5b880-a81d-4eb3-a6a5-7be5ceed47b4"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7aa16c1-01ea-471a-bb8c-911010fff7be"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/00af8753-cd69-449e-9da8-b4d992386a76"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/adeab637-84bc-498c-8e4c-3f42b8e254e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20e66896-80c6-4965-9939-2113575bfe76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ae70395-4f25-45bc-8f37-6d9ea61ec2ba"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32798309-d4c4-4aad-9a5b-8ab9ff35e170"], "isController": false}, {"data": [0.39344262295081966, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c73e508-769f-454a-9cfa-9a9a46aae4f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8103448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8014ead2-6945-4808-a1fb-413f37c7c12c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d0e7626-a2fa-485c-ac94-073d99576a60"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e7aa16c1-01ea-471a-bb8c-911010fff7be"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e18d336-1bf7-47c9-880c-ff5cb1f72338"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00af8753-cd69-449e-9da8-b4d992386a76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74368baa-bff2-4909-bb89-278f8368ce77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba16f24d-3889-4581-9a95-57be7ae14430"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94a5b880-a81d-4eb3-a6a5-7be5ceed47b4"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7926797b-c8fc-4705-9cdf-c94f7dff22ae"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1348, 26, 1.9287833827893175, 296.74554896142405, 76, 2587, 92.0, 794.2000000000003, 1052.0, 1596.57, 5.284264417064882, 725.6613760219152, 3.866191708448159], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1343.7413793103449, 1018, 1832, 1328.5, 1696.6, 1759.6, 1832.0, 0.2634830643988952, 317.05966510819843, 1.295544169187927], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b80f9e94-5d0d-40a3-852b-9734a1886bd4", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20e66896-80c6-4965-9939-2113575bfe76", 3, 0, 0.0, 474.6666666666667, 356, 607, 461.0, 607.0, 607.0, 607.0, 0.01669300451823989, 0.02301265434073761, 0.010704823860980657], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 453.92857142857144, 81, 687, 468.0, 669.0, 687.0, 687.0, 0.07777864198491094, 0.015321350792786587, 0.05233348078867543], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 453.92857142857144, 81, 687, 468.0, 669.0, 687.0, 687.0, 0.07599072913104601, 0.014969155905836631, 0.05113048083133857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 102.85714285714286, 78, 239, 80.0, 238.5, 239.0, 239.0, 0.07937902919447296, 0.029756061864613395, 0.04479466700497253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 81.71428571428571, 79, 92, 81.0, 88.0, 92.0, 92.0, 0.07937632884479093, 0.05898963501063076, 0.03984319631467045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 152.07142857142856, 79, 465, 80.5, 351.0, 465.0, 465.0, 0.07937902919447296, 1.6870147779655156, 0.046256446002415394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 169.14285714285714, 78, 856, 79.0, 551.0, 856.0, 856.0, 0.07937812905749811, 5.12162239859444, 0.046178403762523315], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 228.13333333333327, 79, 364, 234.0, 359.2, 364.0, 364.0, 0.07409090460055123, 0.14504645191006352, 0.04788414127406719], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8014ead2-6945-4808-a1fb-413f37c7c12c", 3, 0, 0.0, 595.0, 210, 1131, 444.0, 1131.0, 1131.0, 1131.0, 0.03256374352795598, 0.027147053116892986, 0.020882348551456143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 98.63157894736842, 79, 256, 81.0, 239.0, 256.0, 256.0, 0.09127638007484663, 0.06783332542671708, 0.045816464217257005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 130.3684210526316, 78, 255, 81.0, 238.0, 255.0, 255.0, 0.09127857259529001, 0.02442414930772409, 0.05205731093325135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 541.0, 392, 674, 561.0, 674.0, 674.0, 674.0, 0.03262046738605671, 9.59150051295685, 0.018603860306110467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 736.8, 556, 887, 776.0, 887.0, 887.0, 887.0, 0.03253873736683522, 29.278413079677605, 0.01852547254381341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 144.4, 82, 239, 83.0, 239.0, 239.0, 239.0, 0.03266735485894236, 0.05780590527773785, 0.018088271684590155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bf106be-c7a2-4b9c-86fc-4113e36cadca", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 89.83333333333334, 79, 243, 80.0, 103.50000000000023, 243.0, 243.0, 0.09034557181218159, 0.06714158217682635, 0.04534924210103646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 114.7222222222222, 78, 240, 79.0, 238.2, 240.0, 240.0, 0.09034783918084625, 0.02417510540581238, 0.05152650203282638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 101.38888888888889, 78, 317, 79.0, 247.7000000000001, 317.0, 317.0, 0.09034783918084625, 0.02435156602921247, 0.053114647643427194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 96.88888888888889, 77, 238, 80.0, 236.2, 238.0, 238.0, 0.09034693221972374, 0.024351321574847415, 0.05320234387548185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 111.2, 79, 235, 81.0, 235.0, 235.0, 235.0, 0.032701111837802485, 0.024302291121648136, 0.018362440729234795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 112.36842105263159, 78, 236, 80.0, 236.0, 236.0, 236.0, 0.09127769557447299, 0.024602191385307174, 0.05366130149983666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 576.875, 78, 1030, 809.5, 965.6, 1030.0, 1030.0, 0.07961902297506432, 44.78388294821778, 0.04253086481187518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 105.3157894736842, 79, 256, 80.0, 235.0, 256.0, 256.0, 0.09127857259529001, 0.024602427769824266, 0.053750956323203015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 439.49999999999994, 80, 690, 619.5, 649.4000000000001, 690.0, 690.0, 0.07961783439490445, 14.639476606041002, 0.04260798168789809], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c73e508-769f-454a-9cfa-9a9a46aae4f9", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 385.35714285714283, 83, 708, 430.5, 618.5, 708.0, 708.0, 0.07604273601764192, 0.01497940056597522, 0.051653471215108604], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/32798309-d4c4-4aad-9a5b-8ab9ff35e170", 3, 0, 0.0, 357.66666666666663, 181, 641, 251.0, 641.0, 641.0, 641.0, 0.018332365791805433, 0.02166823573894711, 0.011756106969354394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 218.88888888888889, 159, 481, 163.0, 406.3000000000001, 481.0, 481.0, 0.09030930938464239, 0.13996179100920653, 0.20310775343049947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ae70395-4f25-45bc-8f37-6d9ea61ec2ba", 3, 0, 0.0, 321.0, 170, 618, 175.0, 618.0, 618.0, 618.0, 0.02529532289479675, 0.029898215309572592, 0.01622128453865547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 614.7142857142857, 104, 1210, 631.0, 1094.4, 1199.6999999999998, 1210.0, 0.0943782049265423, 0.057972549705854595, 0.0426729578915909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 91.125, 79, 243, 81.0, 133.80000000000013, 243.0, 243.0, 0.07962219269565911, 0.05917235218886384, 0.039966608442938256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 125.93749999999999, 79, 320, 80.5, 266.1000000000001, 320.0, 320.0, 0.07961783439490445, 0.09604290032842357, 0.04122788739052548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d0e7626-a2fa-485c-ac94-073d99576a60", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 0.255175229519774, 0.9738038488700566], "isController": false}, {"data": ["login", 21, 0, 0.0, 2689.1428571428573, 1730, 3755, 2580.0, 3566.2000000000003, 3738.3999999999996, 3755.0, 0.09129124951637374, 26.12936496475506, 0.1737819614468359], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/74368baa-bff2-4909-bb89-278f8368ce77", 3, 0, 0.0, 384.33333333333337, 187, 776, 190.0, 776.0, 776.0, 776.0, 0.02171835635479107, 0.021781984351924244, 0.013927461594706512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 83.73684210526316, 80, 91, 83.0, 91.0, 91.0, 91.0, 0.09303190994511118, 0.07531587240673551, 0.03306993673830124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e18d336-1bf7-47c9-880c-ff5cb1f72338", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba16f24d-3889-4581-9a95-57be7ae14430", 3, 0, 0.0, 432.0, 364, 543, 389.0, 543.0, 543.0, 543.0, 0.030125018828136767, 0.024662897901290358, 0.019318452829241353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 694.1874999999999, 162, 1111, 895.0, 1048.7, 1111.0, 1111.0, 0.07958575613929497, 59.553898909302085, 0.1662635047079949], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94a5b880-a81d-4eb3-a6a5-7be5ceed47b4", 3, 0, 0.0, 338.6666666666667, 258, 436, 322.0, 436.0, 436.0, 436.0, 0.02077015743779338, 0.028633338785499663, 0.013319404346501614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 286.78571428571433, 160, 938, 245.5, 633.0, 938.0, 938.0, 0.07933989209774674, 6.89404223822086, 0.17698728719907514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, 50.0, 476.4000000000001, 79, 1123, 393.0, 1103.4, 1123.0, 1123.0, 0.056312964933916736, 33.69247586637496, 0.08204974968887087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7aa16c1-01ea-471a-bb8c-911010fff7be", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00af8753-cd69-449e-9da8-b4d992386a76", 3, 0, 0.0, 511.66666666666663, 274, 954, 307.0, 954.0, 954.0, 954.0, 0.11583906093134605, 0.052414158429222334, 0.07428481446443741], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1106.875, 136, 1971, 1158.5, 1834.0, 1962.75, 1971.0, 0.09517389062933734, 0.029741840821667923, 0.04293978268628307], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/adeab637-84bc-498c-8e4c-3f42b8e254e0", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 255.05263157894737, 161, 490, 167.0, 477.0, 490.0, 490.0, 0.09124087591240876, 0.14140553718065693, 0.20520286838503649], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 94.52941176470588, 81, 237, 84.0, 128.99999999999991, 237.0, 237.0, 0.09686112962868001, 0.07519980278789122, 0.03443110467269485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 354.8, 159, 1092, 318.0, 897.6000000000001, 1092.0, 1092.0, 0.07969143476459149, 12.81886016510737, 0.17650926446133902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 105.88888888888889, 80, 308, 81.0, 308.0, 308.0, 308.0, 0.05106875556791294, 0.03795246385466967, 0.025634121447175046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 79.77777777777777, 79, 81, 80.0, 81.0, 81.0, 81.0, 0.051135201472693806, 0.013682661331560647, 0.029163044589895687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 96.44444444444444, 78, 234, 79.0, 234.0, 234.0, 234.0, 0.051135201472693806, 0.013782534771937003, 0.03006190555328288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 97.66666666666667, 79, 237, 80.0, 237.0, 237.0, 237.0, 0.051135492008658946, 0.013782613080458857, 0.03011201336056772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 84.5, 83, 86, 84.5, 86.0, 86.0, 86.0, 0.020467477178762947, 0.006036306746080479, 0.012652258841950143], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 922.0517241379309, 626, 1461, 855.0, 1336.0, 1422.7, 1461.0, 0.25671327340406225, 307.1183229652154, 0.5069084363505996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1106.875, 136, 1971, 1158.5, 1834.0, 1962.75, 1971.0, 0.09435520015096832, 0.0294860000471776, 0.042570412568112656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 95.36363636363637, 78, 243, 81.0, 211.0000000000001, 243.0, 243.0, 0.06060739630625468, 0.01633558728567021, 0.03568970700456208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 80.00000000000001, 78, 82, 80.0, 81.8, 82.0, 82.0, 0.06066187621668422, 0.01635027132402817, 0.03566254832269912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 131.76470588235296, 77, 932, 80.0, 271.1999999999994, 932.0, 932.0, 0.09424234696705953, 5.012108798978303, 0.054927783336844324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20e66896-80c6-4965-9939-2113575bfe76", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 143.11764705882356, 78, 471, 80.0, 295.79999999999984, 471.0, 471.0, 0.09424234696705953, 1.6539293688257404, 0.05501981687880434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 107.70588235294117, 79, 350, 81.0, 277.19999999999993, 350.0, 350.0, 0.09424130208217842, 0.07003674891068142, 0.04730471608421846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 94.90909090909092, 79, 243, 80.0, 210.80000000000013, 243.0, 243.0, 0.06060739630625468, 0.01621721346475955, 0.03456515570591087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 108.82352941176471, 77, 242, 81.0, 238.8, 242.0, 242.0, 0.09424182452172274, 0.0335433332224606, 0.05328171168099697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 95.81818181818181, 79, 236, 80.0, 208.2000000000001, 236.0, 236.0, 0.06066087263422597, 0.04508098054164644, 0.030448914583976704], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 558.8571428571429, 79, 1207, 534.5, 1080.5, 1207.0, 1207.0, 0.07613454060962013, 0.014700084291812819, 0.05181142425972755], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 84.36363636363636, 82, 93, 82.0, 92.4, 93.0, 93.0, 0.06153983865373211, 0.048438583940339924, 0.021875489521443834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1594.4761904761904, 1138, 2587, 1593.0, 2276.2000000000003, 2564.7999999999997, 2587.0, 0.09170425813438604, 0.04746411797971152, 0.0421803765442342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 192.36363636363635, 159, 479, 163.0, 419.0000000000002, 479.0, 479.0, 0.060579692585596354, 0.09388669153646621, 0.13624514846155117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ae70395-4f25-45bc-8f37-6d9ea61ec2ba", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32798309-d4c4-4aad-9a5b-8ab9ff35e170", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["addBook", 61, 9, 14.754098360655737, 829.967213114754, 408, 1726, 683.0, 1404.4, 1543.7, 1726.0, 0.29099443771287914, 81.0163379512799, 1.0602681233482487], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8c73e508-769f-454a-9cfa-9a9a46aae4f9", 3, 0, 0.0, 396.3333333333333, 234, 526, 429.0, 526.0, 526.0, 526.0, 0.027227183620126334, 0.03218160928537719, 0.01746014053764612], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 145.58620689655174, 78, 341, 82.0, 323.1, 331.15, 341.0, 0.25742996129673684, 0.19131269584650074, 0.12444124105652807], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 502.98275862068976, 387, 793, 467.0, 628.0, 718.1, 793.0, 0.2571355104139882, 75.60637776420673, 0.12932108189766006], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 116.70689655172411, 78, 242, 82.5, 238.0, 240.1, 242.0, 0.2577560117145663, 0.4561073176042912, 0.12535399788462306], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 774.810344827586, 543, 1125, 754.5, 1021.1, 1066.6, 1125.0, 0.25714121042574606, 231.37611314712026, 0.1290728341394858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 105.66666666666667, 81, 242, 85.0, 237.8, 242.0, 242.0, 0.08118772225138966, 0.06065293703350888, 0.02885969814404867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 9, 5.0, 143.1277777777777, 79, 1047, 87.0, 255.9, 311.34999999999985, 983.8199999999998, 0.7316389118090585, 1.5565983033090403, 0.3518590932047004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 102.33333333333333, 80, 244, 83.0, 244.0, 244.0, 244.0, 0.05111196928738556, 0.03958182777821949, 0.018168707832625336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8014ead2-6945-4808-a1fb-413f37c7c12c", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 84.85714285714285, 80, 96, 84.0, 93.5, 96.0, 96.0, 0.07730194138304217, 0.06273233719658988, 0.02747842447600327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d0e7626-a2fa-485c-ac94-073d99576a60", 3, 0, 0.0, 432.0, 284, 572, 440.0, 572.0, 572.0, 572.0, 0.02577585318074028, 0.02585136837560573, 0.016529437098326286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7aa16c1-01ea-471a-bb8c-911010fff7be", 3, 0, 0.0, 374.6666666666667, 235, 620, 269.0, 620.0, 620.0, 620.0, 0.05179468586523023, 0.03329899237754873, 0.033214691131023294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 204.33333333333334, 160, 546, 162.0, 546.0, 546.0, 546.0, 0.05104558370624968, 0.07911068490411938, 0.11480271413622366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 279.29411764705884, 158, 1191, 164.0, 707.7999999999996, 1191.0, 1191.0, 0.09419900370700786, 6.766505778000654, 0.2104380201724396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e18d336-1bf7-47c9-880c-ff5cb1f72338", 3, 0, 0.0, 620.0, 325, 1207, 328.0, 1207.0, 1207.0, 1207.0, 0.0911854103343465, 0.04232760258358663, 0.05847501899696049], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 94.77777777777779, 80, 253, 82.0, 122.5000000000002, 253.0, 253.0, 0.08823615917803117, 0.07315673744350436, 0.03136519720781576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 116.5, 81, 241, 86.5, 241.0, 241.0, 241.0, 0.0769619278962938, 0.05975071550542341, 0.027357560306885687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00af8753-cd69-449e-9da8-b4d992386a76", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74368baa-bff2-4909-bb89-278f8368ce77", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba16f24d-3889-4581-9a95-57be7ae14430", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 80.33333333333334, 79, 83, 80.0, 82.4, 83.0, 83.0, 0.079725319698532, 0.05924899247127231, 0.040018373364302195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 149.33333333333331, 76, 317, 85.0, 275.0, 317.0, 317.0, 0.0797274384637054, 0.037299568541678846, 0.044576773536868626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94a5b880-a81d-4eb3-a6a5-7be5ceed47b4", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 225.8, 77, 1012, 85.0, 818.2, 1012.0, 1012.0, 0.07972786223025406, 9.583860007839908, 0.045957714335069635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7926797b-c8fc-4705-9cdf-c94f7dff22ae", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 215.86666666666665, 78, 617, 234.0, 526.4000000000001, 617.0, 617.0, 0.0797274384637054, 3.1442923791199155, 0.04603532888897157], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 30.76923076923077, 0.5934718100890207], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.538461538461538, 0.22255192878338279], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.14836795252225518], "isController": false}, {"data": ["401/Unauthorized", 13, 50.0, 0.9643916913946587], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1348, 26, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
