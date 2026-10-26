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

    var data = {"OkPercent": 99.51140065146579, "KoPercent": 0.48859934853420195};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7453027139874739, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=954f18d6-753a-45c7-9bdb-afcc631a3e19"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94671298-a6f5-4104-abc1-463de035aa98"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a60a125-b7be-4f07-b79b-c01f9475f64d"], "isController": false}, {"data": [0.96875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ad24992-4b6f-47c3-9ed1-a6488ed82cfd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/296535fb-1129-4c15-8b63-f8fa7faa5bd2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a47373fb-8636-4b3c-8207-0e3c4aca6521"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87a072c9-2c7d-412b-aa7c-408a9f4b91e4"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0724449d-0411-41a1-ab85-9e90a829eb97"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dd1784f5-d036-4066-a2eb-d30969156b1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=053644ef-64e7-42ae-9f52-37e13e63501e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3340fb8d-bef6-40b6-96de-cb3fc9e886da"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c795a114-2416-435e-8f51-e31dd83b71b2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0a60a125-b7be-4f07-b79b-c01f9475f64d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3ad24992-4b6f-47c3-9ed1-a6488ed82cfd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1453a5c-47a4-4614-8116-61e95914a659"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c30349d-894b-49e4-9103-ea01e86c5970"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/954f18d6-753a-45c7-9bdb-afcc631a3e19"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a38ff7ca-ceef-4d08-9ff1-074efba9de86"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "register"], "isController": true}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/33013dec-993f-480c-8697-a3b514568752"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a47373fb-8636-4b3c-8207-0e3c4aca6521"], "isController": false}, {"data": [0.2982456140350877, 500, 1500, "addBook"], "isController": true}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87a072c9-2c7d-412b-aa7c-408a9f4b91e4"], "isController": false}, {"data": [0.9903846153846154, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.36538461538461536, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9728915662650602, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cbaa5162-a9f2-413e-81cf-90c4dd139f60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd1784f5-d036-4066-a2eb-d30969156b1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cbaa5162-a9f2-413e-81cf-90c4dd139f60"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c795a114-2416-435e-8f51-e31dd83b71b2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c30349d-894b-49e4-9103-ea01e86c5970"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33013dec-993f-480c-8697-a3b514568752"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3340fb8d-bef6-40b6-96de-cb3fc9e886da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1453a5c-47a4-4614-8116-61e95914a659"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93c97557-7065-45da-bce4-4bc90167bdbf"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a38ff7ca-ceef-4d08-9ff1-074efba9de86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/053644ef-64e7-42ae-9f52-37e13e63501e"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1228, 6, 0.48859934853420195, 474.69951140065126, 133, 2670, 227.0, 1279.4000000000005, 1554.0, 2070.71, 4.761166253101737, 671.0459744664042, 3.460011825372208], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=954f18d6-753a-45c7-9bdb-afcc631a3e19", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["see books", 52, 0, 0.0, 2378.5384615384605, 1692, 3151, 2351.0, 2818.2, 3097.1499999999996, 3151.0, 0.2244242654421158, 270.0590819806736, 1.1034923598643096], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/94671298-a6f5-4104-abc1-463de035aa98", 2, 0, 0.0, 300.0, 264, 336, 300.0, 336.0, 336.0, 336.0, 0.06504488096786783, 0.03998608649343047, 0.04043072923442175], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 780.0000000000001, 492, 2670, 593.0, 1842.5, 2670.0, 2670.0, 0.0852483772362476, 0.015401318153033016, 0.05794225640276205], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 780.0000000000001, 492, 2670, 593.0, 1842.5, 2670.0, 2670.0, 0.08598980406608932, 0.015535267336158712, 0.05844619495117007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 230.23076923076923, 139, 435, 143.0, 432.2, 435.0, 435.0, 0.08296901426428822, 0.041372319462616075, 0.04624625043877844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 143.6923076923077, 136, 152, 142.0, 151.2, 152.0, 152.0, 0.08296742571224344, 0.0616584091474778, 0.04164575860946595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 358.8461538461538, 137, 1138, 148.0, 1014.3999999999999, 1138.0, 1138.0, 0.08282048341679091, 3.7653456799561686, 0.04767528278416982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 364.0769230769231, 140, 1554, 143.0, 1465.1999999999998, 1554.0, 1554.0, 0.08282101105341956, 11.483887232026248, 0.04759470662249546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a60a125-b7be-4f07-b79b-c01f9475f64d", 1, 0, 0.0, 780.0, 780, 780, 780.0, 780.0, 780.0, 780.0, 1.2820512820512822, 0.23162059294871795, 0.8839142628205128], "isController": false}, {"data": ["goToProfile", 16, 0, 0.0, 311.75000000000006, 239, 604, 272.0, 467.5000000000001, 604.0, 604.0, 0.09481369109699442, 0.19664697492474162, 0.06129556983028349], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ad24992-4b6f-47c3-9ed1-a6488ed82cfd", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 144.52631578947367, 137, 151, 143.0, 150.0, 151.0, 151.0, 0.16906471619373037, 0.1256428213119422, 0.08486256262068106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 172.73684210526318, 136, 443, 142.0, 425.0, 443.0, 443.0, 0.16906772497130299, 0.04523882484583693, 0.09642143689769624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/296535fb-1129-4c15-8b63-f8fa7faa5bd2", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 821.0, 802, 840, 821.0, 840.0, 840.0, 840.0, 0.4757373929590866, 139.88258949809705, 0.27131898192197906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1738.5, 1543, 1934, 1738.5, 1934.0, 1934.0, 1934.0, 0.3748125937031484, 337.2570306643553, 0.2133942794227886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 291.0, 143, 439, 291.0, 439.0, 439.0, 439.0, 0.5206977349648529, 0.9213909138245249, 0.2883160309815152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a47373fb-8636-4b3c-8207-0e3c4aca6521", 3, 0, 0.0, 381.6666666666667, 237, 531, 377.0, 531.0, 531.0, 531.0, 0.04287613085795138, 0.02756522084780403, 0.027495435478569082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 159.61111111111114, 137, 421, 143.0, 179.80000000000038, 421.0, 421.0, 0.08417587145409142, 0.06255648259430036, 0.042252341725979484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 221.11111111111111, 135, 443, 145.0, 425.90000000000003, 443.0, 443.0, 0.08417469054110298, 0.03657068803456774, 0.04722039389078801], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87a072c9-2c7d-412b-aa7c-408a9f4b91e4", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 0.6187125428082192, 2.361140839041096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 319.3888888888889, 135, 1654, 143.0, 1543.3000000000002, 1654.0, 1654.0, 0.08417665874782544, 8.435979047611253, 0.048682898342655115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0724449d-0411-41a1-ab85-9e90a829eb97", 2, 0, 0.0, 314.5, 239, 390, 314.5, 390.0, 390.0, 390.0, 0.01505502612047032, 0.02143576961293528, 0.009357933716483748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 295.7222222222223, 137, 1119, 143.5, 1075.8000000000002, 1119.0, 1119.0, 0.08417587145409142, 2.7702228147008485, 0.04876464601707835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd1784f5-d036-4066-a2eb-d30969156b1b", 3, 0, 0.0, 678.0, 245, 1018, 771.0, 1018.0, 1018.0, 1018.0, 0.046395100677368475, 0.029404707362902474, 0.029752066515109334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 138.5, 136, 141, 138.5, 141.0, 141.0, 141.0, 0.5644933672029354, 0.41951118402483767, 0.31697625599774204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 172.42105263157896, 135, 423, 142.0, 422.0, 423.0, 423.0, 0.16906772497130299, 0.04556903524617151, 0.09939333050070741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 966.3888888888887, 138, 1761, 1270.5, 1755.6, 1761.0, 1761.0, 0.08809537792917131, 44.04853971205046, 0.04758450426773164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 170.94736842105263, 136, 421, 142.0, 411.0, 421.0, 421.0, 0.1690602032281601, 0.04556700790134002, 0.09955400639314506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 688.0555555555557, 140, 1173, 957.0, 1142.4, 1173.0, 1173.0, 0.08809365334168591, 14.400807922800595, 0.047669601694334596], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 609.5714285714287, 292, 1609, 527.5, 1194.5, 1609.0, 1609.0, 0.08542888350551321, 0.01543392914894526, 0.05889921069813704], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 529.8333333333334, 279, 1795, 298.0, 1684.3000000000002, 1795.0, 1795.0, 0.08411765255670932, 11.297431549260233, 0.18679120655089587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=053644ef-64e7-42ae-9f52-37e13e63501e", 1, 0, 0.0, 1609.0, 1609, 1609, 1609.0, 1609.0, 1609.0, 1609.0, 0.6215040397762585, 0.11228344468614046, 0.42849790242386576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3340fb8d-bef6-40b6-96de-cb3fc9e886da", 3, 0, 0.0, 376.0, 289, 522, 317.0, 522.0, 522.0, 522.0, 0.020420248718629394, 0.024136042674916446, 0.013095016268131478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 447.05, 159, 1595, 334.0, 959.8000000000006, 1564.6499999999996, 1595.0, 0.09612149757293217, 0.059043380833373384, 0.043461184937761334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 188.22222222222223, 136, 418, 143.5, 416.2, 418.0, 418.0, 0.08809494677596966, 0.0654689985317509, 0.04421953383090665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c795a114-2416-435e-8f51-e31dd83b71b2", 3, 0, 0.0, 377.0, 247, 553, 331.0, 553.0, 553.0, 553.0, 0.059450675756014426, 0.038221056190797034, 0.0381242940232254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 259.55555555555554, 137, 571, 144.0, 457.6000000000002, 571.0, 571.0, 0.08809537792917131, 0.09708080059121786, 0.04613154230535815], "isController": false}, {"data": ["login", 20, 0, 0.0, 2227.5499999999993, 1455, 4050, 2015.0, 3320.9, 4014.1499999999996, 4050.0, 0.0950877660080254, 11.510754797772094, 0.1592348644048457], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 160.89473684210526, 140, 418, 145.0, 152.0, 418.0, 418.0, 0.16290694583772755, 0.13188462705026965, 0.05790832840325471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a60a125-b7be-4f07-b79b-c01f9475f64d", 3, 0, 0.0, 651.0, 392, 1152, 409.0, 1152.0, 1152.0, 1152.0, 0.026669511414550887, 0.026747644748773204, 0.017102518713107175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ad24992-4b6f-47c3-9ed1-a6488ed82cfd", 3, 0, 0.0, 464.3333333333333, 312, 551, 530.0, 551.0, 551.0, 551.0, 0.0188924014761263, 0.02233017895827298, 0.012115244436187764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1453a5c-47a4-4614-8116-61e95914a659", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1173.0555555555554, 283, 1901, 1416.0, 1900.1, 1901.0, 1901.0, 0.08803118260112583, 58.56946882962542, 0.18547107992253253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c30349d-894b-49e4-9103-ea01e86c5970", 3, 0, 0.0, 389.0, 304, 486, 377.0, 486.0, 486.0, 486.0, 0.027235835096097106, 0.0273156275817302, 0.01746568852191123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/954f18d6-753a-45c7-9bdb-afcc631a3e19", 3, 0, 0.0, 754.3333333333334, 244, 1381, 638.0, 1381.0, 1381.0, 1381.0, 0.03467686937223308, 0.028908679186943002, 0.022237445528417693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 596.7692307692308, 284, 1696, 563.0, 1605.1999999999998, 1696.0, 1696.0, 0.08274510053529716, 15.33803387496897, 0.1828385766410581], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a38ff7ca-ceef-4d08-9ff1-074efba9de86", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.2745654445288754, 1.0478011018237081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1878.0, 1685, 2071, 1878.0, 2071.0, 2071.0, 2071.0, 0.36509675063891933, 436.7826419313618, 0.8232503879152976], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 919.8636363636363, 226, 1886, 950.5, 1325.3, 1803.199999999999, 1886.0, 0.09187875345589402, 0.02920152142863109, 0.041453109469358436], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 378.6315789473684, 280, 594, 297.0, 568.0, 594.0, 594.0, 0.1688438638585266, 0.2616750116635564, 0.37973380709588556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 196.54545454545453, 142, 428, 148.0, 424.40000000000003, 428.0, 428.0, 0.07257133432294244, 0.05634200272142504, 0.025796841497608445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 593.4285714285714, 283, 1989, 563.5, 1418.5, 1989.0, 1989.0, 0.07368808884678141, 6.402942876927733, 0.16437953971261646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 240.83333333333331, 144, 432, 150.0, 432.0, 432.0, 432.0, 0.03568497305784534, 0.02651978954787139, 0.017912183741926276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 189.0, 140, 422, 142.5, 422.0, 422.0, 422.0, 0.03568518529532465, 0.00954857497160054, 0.020351707238739837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 193.66666666666666, 141, 444, 144.5, 444.0, 444.0, 444.0, 0.035684336360554535, 0.009618043784680714, 0.020978486805716633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 237.50000000000003, 142, 426, 147.5, 426.0, 426.0, 426.0, 0.035685397535328546, 0.009618329804444022, 0.02101395968144835], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1612.480769230769, 1081, 2561, 1503.0, 2173.0, 2372.5499999999984, 2561.0, 0.22524961555955036, 269.4768496458816, 0.44478000259903405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 919.8636363636363, 226, 1886, 950.5, 1325.3, 1803.199999999999, 1886.0, 0.08707801794598788, 0.02767571948212328, 0.039287152627975004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 255.9, 137, 441, 148.0, 439.1, 441.0, 441.0, 0.06796664197212009, 0.018319133969047992, 0.04002332530194181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 253.0, 134, 429, 145.0, 428.5, 429.0, 429.0, 0.06783294103282436, 0.018283097387753442, 0.03987835009937526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 526.6363636363636, 140, 1530, 149.0, 1486.4, 1530.0, 1530.0, 0.07569710148916843, 18.59094334717099, 0.042727465489003275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 407.09090909090907, 136, 1101, 148.0, 1047.8000000000002, 1101.0, 1101.0, 0.0756955387802008, 6.084929426812737, 0.04280050483763307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 224.5, 133, 425, 144.5, 424.7, 425.0, 425.0, 0.06796294660151286, 0.01818539782110793, 0.0387601179836753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 170.63636363636363, 141, 416, 148.0, 362.8000000000002, 416.0, 416.0, 0.07569814333099358, 0.05625613972156847, 0.03799691960169013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33013dec-993f-480c-8697-a3b514568752", 3, 0, 0.0, 518.3333333333334, 259, 942, 354.0, 942.0, 942.0, 942.0, 0.0778694907335306, 0.03447347246015677, 0.04993583878419768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 238.3, 134, 539, 146.0, 527.3000000000001, 539.0, 539.0, 0.06796479423658545, 0.05050899259183743, 0.034115140857036055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 248.00000000000003, 140, 446, 148.0, 445.0, 446.0, 446.0, 0.0756986642626606, 0.051263264470487846, 0.04143802946054379], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 147.89999999999998, 144, 152, 148.5, 151.9, 152.0, 152.0, 0.06669378880744836, 0.05249530642461268, 0.023707557740147663], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 687.6428571428571, 486, 1152, 593.0, 1085.0, 1152.0, 1152.0, 0.08729376847198493, 0.015770846843083216, 0.05941773107907569], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1229.5, 846, 2179, 1090.0, 1930.9000000000005, 2167.7999999999997, 2179.0, 0.09210732345328777, 0.04767273577172121, 0.042365770846189976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 553.4, 283, 964, 571.0, 952.2, 964.0, 964.0, 0.06776674685731711, 0.10502522193609595, 0.15240900196523566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a47373fb-8636-4b3c-8207-0e3c4aca6521", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["addBook", 57, 2, 3.508771929824561, 1505.0701754385964, 758, 2623, 1177.0, 2451.2, 2591.2, 2623.0, 0.267591814507232, 102.13322316687871, 0.9696031322912901], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 250.75000000000006, 141, 638, 148.0, 571.7, 594.05, 638.0, 0.22714466057161828, 0.1688057487255874, 0.10980137400678813], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 906.1153846153846, 672, 1269, 842.5, 1169.0, 1254.1, 1269.0, 0.2268998498970224, 66.7160896538032, 0.11411467060250638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87a072c9-2c7d-412b-aa7c-408a9f4b91e4", 3, 0, 0.0, 442.66666666666663, 266, 714, 348.0, 714.0, 714.0, 714.0, 0.07015410518438837, 0.03297608329630756, 0.044988146879311554], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 201.73076923076923, 137, 574, 145.5, 422.7, 438.79999999999995, 574.0, 0.22732936089847558, 0.40226640815238063, 0.11055666184320395], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1360.2115384615379, 939, 1962, 1308.5, 1701.2, 1936.7999999999997, 1962.0, 0.22584147665580892, 203.21255768186754, 0.11336183496199782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 168.71428571428572, 144, 426, 149.5, 291.5, 426.0, 426.0, 0.07531457283188173, 0.056265281461317894, 0.026771977061332962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 2, 1.2048192771084338, 225.87349397590364, 136, 1319, 150.0, 392.6, 444.6, 1120.6800000000037, 0.7030353338782562, 1.5142986693150489, 0.339895812598732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 150.0, 145, 153, 151.0, 153.0, 153.0, 153.0, 0.03847559685269618, 0.029796043265808658, 0.013676872318731843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cbaa5162-a9f2-413e-81cf-90c4dd139f60", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.32788396098003625, 1.2512760889292196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd1784f5-d036-4066-a2eb-d30969156b1b", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 145.69230769230768, 138, 151, 145.0, 150.6, 151.0, 151.0, 0.07975753708725475, 0.0647251106635827, 0.028351312011485084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbaa5162-a9f2-413e-81cf-90c4dd139f60", 3, 0, 0.0, 387.0, 240, 617, 304.0, 617.0, 617.0, 617.0, 0.017818006877750654, 0.02456356091382618, 0.011426260920953382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 484.8333333333333, 292, 866, 298.0, 866.0, 866.0, 866.0, 0.03565358972225853, 0.0552561004777581, 0.08018575891636856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c795a114-2416-435e-8f51-e31dd83b71b2", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c30349d-894b-49e4-9103-ea01e86c5970", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 751.2727272727273, 287, 1947, 569.0, 1849.8000000000004, 1947.0, 1947.0, 0.0756211244173736, 24.758640787628387, 0.16479685201289684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 148.1111111111111, 142, 156, 149.5, 153.3, 156.0, 156.0, 0.08978720432574797, 0.07444271139898441, 0.03191654528766823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33013dec-993f-480c-8697-a3b514568752", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 166.1111111111111, 143, 443, 149.0, 187.4000000000004, 443.0, 443.0, 0.08387072725239497, 0.06511448063052148, 0.029813422577999776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3340fb8d-bef6-40b6-96de-cb3fc9e886da", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1453a5c-47a4-4614-8116-61e95914a659", 3, 0, 0.0, 350.6666666666667, 272, 496, 284.0, 496.0, 496.0, 496.0, 0.02299132460684835, 0.023058682003157475, 0.014743785636553139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93c97557-7065-45da-bce4-4bc90167bdbf", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1.3141396604938271, 2.455471965020576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a38ff7ca-ceef-4d08-9ff1-074efba9de86", 3, 0, 0.0, 484.0, 279, 604, 569.0, 604.0, 604.0, 604.0, 0.018529498962348057, 0.021901240472749283, 0.01188252374864117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 183.92857142857144, 136, 444, 142.0, 434.0, 444.0, 444.0, 0.0738529061118555, 0.05488482573351761, 0.037070697013177466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 221.1428571428571, 135, 424, 143.0, 423.0, 424.0, 424.0, 0.07374398196432898, 0.027643705292710933, 0.0416147331257967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 344.14285714285717, 136, 1544, 145.0, 996.5, 1544.0, 1544.0, 0.07385368529889642, 4.76517516017018, 0.042964546274609106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 315.7857142857143, 138, 1141, 147.5, 798.0, 1141.0, 1141.0, 0.0738556333384329, 1.569627975326943, 0.043037804192889814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/053644ef-64e7-42ae-9f52-37e13e63501e", 3, 0, 0.0, 465.66666666666663, 266, 859, 272.0, 859.0, 859.0, 859.0, 0.04581621588600925, 0.029753694886910306, 0.029380841567525465], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 66.66666666666667, 0.3257328990228013], "isController": false}, {"data": ["401/Unauthorized", 2, 33.333333333333336, 0.16286644951140064], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1228, 6, "406/Not Acceptable", 4, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
