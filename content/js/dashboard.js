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

    var data = {"OkPercent": 96.10983981693364, "KoPercent": 3.8901601830663615};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6942633637548892, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=383debb4-da0d-4100-9e29-b9cdcbd75c1c"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14e79a32-edff-411d-8365-b991702b847d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c44f4a9-61f7-4c69-84b5-d8f7e073e401"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.18518518518518517, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/87eb06a3-b118-48b9-ba65-cd150a262322"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87f95fdf-40f1-4c50-beac-f8ede96315fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c791b127-fce6-453c-b118-9e58d74a8950"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/383debb4-da0d-4100-9e29-b9cdcbd75c1c"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.34375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.53125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/14e79a32-edff-411d-8365-b991702b847d"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a20ad81e-0c67-4b3e-be27-3edcf812bee2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=814f0d6d-b98b-4460-816a-3ba2d80c640c"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.26851851851851855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.34375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8908045977011494, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/814f0d6d-b98b-4460-816a-3ba2d80c640c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a20ad81e-0c67-4b3e-be27-3edcf812bee2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/52ec4de6-1c80-481d-99c9-bfa5efda1d6b"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/965d17db-643c-4fd2-868d-18892633fe1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c791b127-fce6-453c-b118-9e58d74a8950"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/653fe5d7-abce-4d20-aa48-d065af76c47c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87eb06a3-b118-48b9-ba65-cd150a262322"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6c44f4a9-61f7-4c69-84b5-d8f7e073e401"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f844f488-c681-4773-98fd-6774d6dceb3d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b681bcb4-e54a-4f00-8fa4-3a682d3c49b8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b681bcb4-e54a-4f00-8fa4-3a682d3c49b8"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f844f488-c681-4773-98fd-6774d6dceb3d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=653fe5d7-abce-4d20-aa48-d065af76c47c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1311, 51, 3.8901601830663615, 501.77269260106755, 144, 2886, 163.0, 1406.1999999999996, 1750.7999999999997, 2268.039999999999, 5.158492822966507, 709.4219921518411, 3.7769902656072936], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=383debb4-da0d-4100-9e29-b9cdcbd75c1c", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2497.8333333333335, 1781, 3243, 2422.5, 3086.0, 3170.75, 3243.0, 0.24443679950750513, 294.13969580773914, 1.2018938335159066], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 416.81250000000006, 300, 908, 305.5, 695.9000000000002, 908.0, 908.0, 0.09362912333881454, 0.14510685423701042, 0.21057409282157216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 173.31578947368425, 151, 463, 156.0, 169.0, 463.0, 463.0, 0.11027790030877811, 0.08561614330613145, 0.039200347375385976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14e79a32-edff-411d-8365-b991702b847d", 1, 0, 0.0, 1549.0, 1549, 1549, 1549.0, 1549.0, 1549.0, 1549.0, 0.6455777921239509, 0.11663270658489348, 0.4450956262104584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c44f4a9-61f7-4c69-84b5-d8f7e073e401", 1, 0, 0.0, 867.0, 867, 867, 867.0, 867.0, 867.0, 867.0, 1.1534025374855825, 0.20837838811995388, 0.7952169838523645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 459.41176470588243, 302, 1086, 311.0, 729.1999999999997, 1086.0, 1086.0, 0.11370781105775019, 0.17622489858266557, 0.2557315320957018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 242.28571428571428, 151, 462, 155.0, 462.0, 462.0, 462.0, 0.039058358767764575, 0.02902676857643442, 0.01960546524085058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 194.28571428571428, 146, 455, 152.0, 455.0, 455.0, 455.0, 0.03899764899887464, 0.018802437910171704, 0.021772961955007858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 348.8571428571429, 147, 1225, 151.0, 1225.0, 1225.0, 1225.0, 0.03883107373466173, 5.000437933035814, 0.022351703435995296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 450.57142857142856, 149, 1213, 448.0, 1213.0, 1213.0, 1213.0, 0.038833658796378484, 1.6401694846496095, 0.022391114928213208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, 100.0, 157.16666666666666, 150, 162, 157.5, 162.0, 162.0, 162.0, 0.07182876023559832, 0.021183872647608102, 0.04440195823157592], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1740.7407407407402, 1169, 2626, 1651.0, 2457.0, 2547.0, 2626.0, 0.2396219298440239, 286.6711341549999, 0.47315970912560185], "isController": false}, {"data": ["deleteBook", 16, 6, 37.5, 433.49999999999994, 150, 928, 504.5, 722.2000000000003, 928.0, 928.0, 0.09155937052932761, 0.02046450286123033, 0.06058878755364807], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 6, 37.5, 433.49999999999994, 150, 928, 504.5, 722.2000000000003, 928.0, 928.0, 0.09071991925927186, 0.02027687648482993, 0.060033286414125094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 1216.375, 196, 2294, 1202.5, 1940.0, 2255.5, 2294.0, 0.09443465122135482, 0.029234164489423318, 0.042606258656509695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87eb06a3-b118-48b9-ba65-cd150a262322", 3, 0, 0.0, 473.6666666666667, 263, 611, 547.0, 611.0, 611.0, 611.0, 0.04629701075633883, 0.02976451700643528, 0.029689163798824053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87f95fdf-40f1-4c50-beac-f8ede96315fa", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.856128518766756, 1.599677446380697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 191.0, 147, 438, 151.0, 438.0, 438.0, 438.0, 0.04904571060228132, 0.01321935168577114, 0.028881409661304338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 217.0, 145, 460, 152.5, 453.7, 460.0, 460.0, 0.1062686708150807, 0.03730242513962522, 0.060110523107532086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c791b127-fce6-453c-b118-9e58d74a8950", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 153.71428571428572, 149, 164, 152.0, 164.0, 164.0, 164.0, 0.0490419308508775, 0.013218332924650574, 0.028831291379129154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 183.88888888888889, 144, 456, 151.5, 443.40000000000003, 456.0, 456.0, 0.10626051536349952, 0.07896899628088196, 0.05333779775081909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/383debb4-da0d-4100-9e29-b9cdcbd75c1c", 3, 0, 0.0, 562.0, 265, 1049, 372.0, 1049.0, 1049.0, 1049.0, 0.07040105132236642, 0.032679654682843264, 0.045146507521178984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 240.1111111111111, 144, 878, 150.5, 499.1000000000006, 878.0, 878.0, 0.10608703852138243, 1.7599558817895704, 0.06196468406690556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 279.88888888888886, 145, 1601, 153.0, 563.3000000000017, 1601.0, 1601.0, 0.10608766377283095, 5.330220185314521, 0.06186144803767291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 238.89473684210523, 146, 1470, 152.0, 458.0, 1470.0, 1470.0, 0.10948736861515766, 5.213058502630578, 0.06387138331527752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 222.78947368421058, 145, 896, 152.0, 447.0, 896.0, 896.0, 0.10948799953899789, 1.7223313200507102, 0.06397867325035296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 152.85714285714286, 147, 165, 151.0, 165.0, 165.0, 165.0, 0.049041587266001566, 0.013122455967660577, 0.027969030237641523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 168.68421052631578, 147, 443, 153.0, 163.0, 443.0, 443.0, 0.10948926140849291, 0.08136848430846007, 0.05495847691793492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 153.42857142857142, 149, 159, 152.0, 159.0, 159.0, 159.0, 0.04904227444056777, 0.03644645590749226, 0.024616922912550618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 199.8421052631579, 146, 460, 151.0, 449.0, 460.0, 460.0, 0.10949178523474463, 0.03795295022733952, 0.061960554864028496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 156.2857142857143, 152, 161, 156.0, 161.0, 161.0, 161.0, 0.044545980997957244, 0.03506255926206401, 0.015834704182867615], "isController": false}, {"data": ["deleteAccount", 16, 6, 37.5, 551.1249999999999, 148, 1408, 530.0, 1179.1000000000001, 1408.0, 1408.0, 0.09380148089087956, 0.020003807021040845, 0.06381294592344626], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1651.0000000000002, 1162, 2886, 1558.0, 2255.8, 2824.2999999999993, 2886.0, 0.09641253546603984, 0.049901019333008896, 0.04434600019971168], "isController": false}, {"data": ["goToProfile", 16, 6, 37.5, 391.68749999999994, 148, 2020, 270.5, 1059.600000000001, 2020.0, 2020.0, 0.09126429569631805, 0.1466055296894162, 0.058967519179762146], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 350.0, 301, 587, 310.0, 587.0, 587.0, 587.0, 0.048985647205368826, 0.07591818565910188, 0.11016986866598087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 171.25000000000003, 147, 446, 151.5, 253.5000000000002, 446.0, 446.0, 0.09371192952862899, 0.06964333825320963, 0.0470389958766751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 984.6249999999999, 872, 1356, 888.0, 1356.0, 1356.0, 1356.0, 0.044279135671271695, 13.019536093030464, 0.02525294456252214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 188.875, 146, 462, 152.0, 454.3, 462.0, 462.0, 0.09371577177866677, 0.02507629049546357, 0.05344727609252089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1578.0, 1330, 1912, 1547.0, 1912.0, 1912.0, 1912.0, 0.04412551502749571, 39.70421598612253, 0.025122241465849612], "isController": false}, {"data": ["addBook", 60, 17, 28.333333333333332, 1399.7000000000003, 760, 2973, 1178.5, 2538.0, 2672.5, 2973.0, 0.269036580006995, 70.80224816494632, 0.9795576338008591], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 263.125, 145, 453, 157.5, 453.0, 453.0, 453.0, 0.044461488014850135, 0.07867599246377778, 0.024618812211347683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 151.86666666666667, 149, 155, 152.0, 154.4, 155.0, 155.0, 0.07164795062978549, 0.05324618205983082, 0.035963912718466544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 209.93333333333337, 145, 458, 150.0, 454.4, 458.0, 458.0, 0.07164863509350147, 0.026345800195839604, 0.04046095447923384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14e79a32-edff-411d-8365-b991702b847d", 3, 0, 0.0, 1266.3333333333333, 615, 2020, 1164.0, 2020.0, 2020.0, 2020.0, 0.022908107943004626, 0.02707660805372715, 0.014690420783762733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 385.33333333333337, 147, 1614, 439.0, 916.2000000000004, 1614.0, 1614.0, 0.07164897733026357, 4.316015912342253, 0.04171127313067818], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 273.07407407407413, 146, 627, 154.0, 604.0, 608.75, 627.0, 0.24087679152113695, 0.17901097494881368, 0.11643946465133084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 340.26666666666665, 145, 1212, 167.0, 759.0000000000002, 1212.0, 1212.0, 0.07155088937755497, 1.4205553332840428, 0.04172404402049218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a20ad81e-0c67-4b3e-be27-3edcf812bee2", 3, 0, 0.0, 393.3333333333333, 270, 476, 434.0, 476.0, 476.0, 476.0, 0.03904775540486015, 0.025103944311392835, 0.025040390021996903], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 995.9444444444449, 716, 1365, 896.0, 1331.0, 1348.0, 1365.0, 0.24078764313487674, 70.79956198386722, 0.12109925411568508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 152.875, 145, 174, 151.0, 174.0, 174.0, 174.0, 0.04446124091323389, 0.03304199642087011, 0.024966028833114735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=814f0d6d-b98b-4460-816a-3ba2d80c640c", 1, 0, 0.0, 878.0, 878, 878, 878.0, 878.0, 878.0, 878.0, 1.1389521640091116, 0.2057677249430524, 0.7852541287015945], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 232.7222222222222, 146, 613, 153.0, 452.0, 462.75, 613.0, 0.24141846761863034, 0.4271975227782795, 0.11740859069734172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1157.4666666666665, 145, 2168, 1647.0, 2128.4, 2168.0, 2168.0, 0.07823787443342739, 42.24758118646432, 0.04196117249886555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 187.3125, 144, 455, 151.0, 443.1, 455.0, 455.0, 0.0937141250614999, 0.025258885270482395, 0.055093655553733335], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1465.9074074074074, 1017, 2040, 1464.5, 1824.5, 1950.75, 2040.0, 0.24032363582958383, 216.24362996335066, 0.12063120001602158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 816.3333333333333, 151, 1347, 1186.0, 1331.4, 1347.0, 1347.0, 0.07835967088938227, 13.832655168473291, 0.04210301847982238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 185.9375, 145, 440, 151.0, 437.2, 440.0, 440.0, 0.09371522286651437, 0.025259181163240205, 0.05518581971534001], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 181.0, 152, 455, 157.0, 249.3999999999998, 455.0, 455.0, 0.11634113959568033, 0.086915011514351, 0.04135563946565199], "isController": false}, {"data": ["deleteBooks", 16, 6, 37.5, 584.3124999999998, 150, 1549, 501.5, 1406.9, 1549.0, 1549.0, 0.0909493980286718, 0.020328167454894783, 0.06027396019258535], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 17, 9.770114942528735, 209.99425287356323, 148, 1720, 157.0, 352.5, 405.25, 862.75, 0.701980877072659, 1.4866388189877757, 0.3379260045588413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 157.57142857142858, 150, 170, 155.0, 170.0, 170.0, 170.0, 0.0393860280878646, 0.030501094017262333, 0.01400050217185812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 581.4666666666667, 302, 1766, 598.0, 1072.4000000000005, 1766.0, 1766.0, 0.0714993898718731, 5.805964583373055, 0.15958421764175945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/814f0d6d-b98b-4460-816a-3ba2d80c640c", 3, 0, 0.0, 441.66666666666663, 283, 736, 306.0, 736.0, 736.0, 736.0, 0.044523597506678544, 0.028624383162659545, 0.028551916369842684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 156.8333333333333, 148, 177, 157.0, 164.40000000000003, 177.0, 177.0, 0.10920077168545325, 0.08861898561583169, 0.03881746181006346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a20ad81e-0c67-4b3e-be27-3edcf812bee2", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 0.19744706284153005, 0.7535006830601093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52ec4de6-1c80-481d-99c9-bfa5efda1d6b", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 786.5238095238095, 318, 2588, 675.0, 1218.8, 2452.499999999998, 2588.0, 0.09497621072055286, 0.058339879436745845, 0.04294334527696872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 152.0, 147, 164, 151.0, 162.8, 164.0, 164.0, 0.07835926154231923, 0.058233787142289974, 0.039332676203859454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 189.20000000000002, 146, 455, 149.0, 451.4, 455.0, 455.0, 0.07823828251322226, 0.09144099268732853, 0.04067779454105423], "isController": false}, {"data": ["login", 21, 0, 0.0, 3381.0476190476193, 2133, 7482, 2985.0, 4806.2, 7215.599999999997, 7482.0, 0.09526272097549025, 43.542780545878074, 0.20390847208802274], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 697.2857142857142, 301, 1674, 602.0, 1674.0, 1674.0, 1674.0, 0.038793198998027086, 6.681554855661591, 0.08582887038360933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/965d17db-643c-4fd2-868d-18892633fe1a", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.0574037665562914, 1.9757605546357617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 192.9375, 147, 462, 156.0, 453.6, 462.0, 462.0, 0.0935535740388832, 0.07573819617015055, 0.03325537202163426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 455.4736842105263, 300, 1623, 309.0, 902.0, 1623.0, 1623.0, 0.10939218248919033, 7.048565181187999, 0.244552476221594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c791b127-fce6-453c-b118-9e58d74a8950", 3, 0, 0.0, 639.0, 249, 1408, 260.0, 1408.0, 1408.0, 1408.0, 0.017531044558071588, 0.024167960189919648, 0.011242238860482104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/653fe5d7-abce-4d20-aa48-d065af76c47c", 3, 0, 0.0, 599.3333333333334, 531, 648, 619.0, 648.0, 648.0, 648.0, 0.023210652141956348, 0.027434205054506347, 0.014884435130095705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87eb06a3-b118-48b9-ba65-cd150a262322", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 220.6666666666667, 148, 466, 162.0, 465.4, 466.0, 466.0, 0.07128769336786826, 0.05910473795832046, 0.02534054725185942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1311.9333333333336, 303, 2320, 1796.0, 2280.4, 2320.0, 2320.0, 0.07817548833621714, 56.16350004364798, 0.16381734655454563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 157.86666666666667, 149, 191, 155.0, 178.4, 191.0, 191.0, 0.07394517211971231, 0.05740860530778445, 0.026285197901928983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c44f4a9-61f7-4c69-84b5-d8f7e073e401", 3, 0, 0.0, 612.6666666666666, 275, 866, 697.0, 866.0, 866.0, 866.0, 0.020939777200770584, 0.02475010775260351, 0.013428177436692074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f844f488-c681-4773-98fd-6774d6dceb3d", 3, 0, 0.0, 582.6666666666666, 271, 1081, 396.0, 1081.0, 1081.0, 1081.0, 0.027772891806071155, 0.027854257700034253, 0.01781009012303391], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 12, 60.0, 799.3, 148, 2059, 154.5, 1983.2000000000005, 2056.45, 2059.0, 0.10022048506714773, 47.975507053016635, 0.13023769480356784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 516.9999999999999, 298, 1752, 311.5, 995.1000000000012, 1752.0, 1752.0, 0.10598709312732582, 7.199434358292312, 0.23686091254887184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b681bcb4-e54a-4f00-8fa4-3a682d3c49b8", 3, 0, 0.0, 420.3333333333333, 351, 513, 397.0, 513.0, 513.0, 513.0, 0.017138939670932357, 0.02362741194869744, 0.010990791390539306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b681bcb4-e54a-4f00-8fa4-3a682d3c49b8", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 180.58823529411765, 145, 640, 153.0, 257.5999999999997, 640.0, 640.0, 0.11382124707914594, 0.08458786037815436, 0.057132930662774424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 241.17647058823533, 147, 487, 150.0, 465.4, 487.0, 487.0, 0.11382429546108884, 0.030456891558924157, 0.06491541850515221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f844f488-c681-4773-98fd-6774d6dceb3d", 1, 0, 0.0, 803.0, 803, 803, 803.0, 803.0, 803.0, 803.0, 1.2453300124533002, 0.22498637920298878, 0.8585966687422166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=653fe5d7-abce-4d20-aa48-d065af76c47c", 1, 0, 0.0, 1346.0, 1346, 1346, 1346.0, 1346.0, 1346.0, 1346.0, 0.7429420505200593, 0.13422292904903416, 0.5122237184249628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 222.2941176470588, 144, 486, 151.0, 455.59999999999997, 486.0, 486.0, 0.11382505758208795, 0.03067941005142214, 0.06691668424259467], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 1216.375, 196, 2294, 1202.5, 1940.0, 2255.5, 2294.0, 0.09477849475953906, 0.029340608240990117, 0.042761391190338914], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 237.29411764705878, 145, 458, 152.0, 451.6, 458.0, 458.0, 0.11382429546108884, 0.030679204635996597, 0.06702739273734039], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 19.607843137254903, 0.7627765064836003], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 11.764705882352942, 0.4576659038901602], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 6, 11.764705882352942, 0.4576659038901602], "isController": false}, {"data": ["401/Unauthorized", 29, 56.86274509803921, 2.212051868802441], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1311, 51, "401/Unauthorized", 29, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 6, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 12, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 6, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
