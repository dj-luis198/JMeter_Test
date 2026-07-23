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

    var data = {"OkPercent": 97.2560975609756, "KoPercent": 2.7439024390243905};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7232786885245902, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/145ab6fd-3e6c-4e28-9760-a07d7bd5a4fd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2fdc78c8-6430-4f04-acc6-41fec01bcdb5"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec091bfc-5900-4a7e-8a9f-dc59786405ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8ee9a1ad-bfdd-4ac1-bccf-3dbfb7ea55b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=145ab6fd-3e6c-4e28-9760-a07d7bd5a4fd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94463555-2e64-46c4-a7a6-451e8276caf5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.2711864406779661, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/50be79ed-cb5e-4bba-a3b6-d0a761876828"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/94463555-2e64-46c4-a7a6-451e8276caf5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/568dbaf3-d4c0-4389-99be-87aa1ce10bc7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ad545dd-0268-4df7-9e34-1b2d4d61453b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c6f0a19-3f94-4afe-89df-6135eb590c06"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7c6f0a19-3f94-4afe-89df-6135eb590c06"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0ad545dd-0268-4df7-9e34-1b2d4d61453b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=644348d8-5bad-4c78-b84e-217012e9379d"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/701106ca-0515-420e-a451-a6c32f110035"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=701106ca-0515-420e-a451-a6c32f110035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/644348d8-5bad-4c78-b84e-217012e9379d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50be79ed-cb5e-4bba-a3b6-d0a761876828"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6e18fdb-723d-4234-8e49-65954cf51b92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ec091bfc-5900-4a7e-8a9f-dc59786405ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ee9a1ad-bfdd-4ac1-bccf-3dbfb7ea55b9"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/673e0ea1-9bca-4e83-8de7-18972eb5504e"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/05c049c8-ae64-4290-98ea-2134c9dce638"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1312, 36, 2.7439024390243905, 456.2378048780486, 126, 2820, 152.0, 1287.3000000000004, 1560.6999999999998, 2160.87, 5.129528411801044, 714.2834599893363, 3.760136359393449], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2190.375, 1581, 2835, 2184.5, 2640.3, 2724.9, 2835.0, 0.2553987184457164, 307.3300643627574, 1.2557935032950995], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 386.4375, 265, 806, 277.0, 621.9000000000002, 806.0, 806.0, 0.0831358856050214, 0.12884438521012595, 0.186974555223012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 156.93333333333334, 131, 384, 141.0, 244.2000000000001, 384.0, 384.0, 0.08839909243598433, 0.06863015477207768, 0.0314231148893538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/145ab6fd-3e6c-4e28-9760-a07d7bd5a4fd", 3, 0, 0.0, 385.0, 226, 579, 350.0, 579.0, 579.0, 579.0, 0.02240846143503787, 0.0264860427964266, 0.01437000944890124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2fdc78c8-6430-4f04-acc6-41fec01bcdb5", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 0.5005265478056427, 0.9352346199059561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 602.2941176470588, 262, 2024, 531.0, 1527.9999999999995, 2024.0, 2024.0, 0.09046162032725821, 12.855886033324463, 0.2007273097645337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 207.625, 133, 413, 138.0, 413.0, 413.0, 413.0, 0.03687230659322932, 0.02740217316156984, 0.018508169520429562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 167.87499999999997, 127, 409, 135.0, 409.0, 409.0, 409.0, 0.03687315634218289, 0.009866450036873156, 0.02102922197640118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec091bfc-5900-4a7e-8a9f-dc59786405ac", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 199.625, 128, 396, 139.5, 396.0, 396.0, 396.0, 0.03687213664813842, 0.009938193080943557, 0.0216767834591595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ee9a1ad-bfdd-4ac1-bccf-3dbfb7ea55b9", 3, 0, 0.0, 585.0, 239, 1002, 514.0, 1002.0, 1002.0, 1002.0, 0.027744638348639127, 0.02312956341499505, 0.0177919718576885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 229.74999999999997, 132, 398, 135.0, 398.0, 398.0, 398.0, 0.03687315634218289, 0.009938467920353982, 0.021713391869469027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 138.25, 132, 149, 136.0, 149.0, 149.0, 149.0, 0.043946868236302304, 0.01296089278062822, 0.027166374603104844], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1493.946428571429, 1024, 2262, 1440.5, 2082.9, 2161.2, 2262.0, 0.2526494353736279, 302.2565598621256, 0.4988839436772223], "isController": false}, {"data": ["deleteBook", 14, 4, 28.571428571428573, 587.0000000000001, 129, 1402, 550.0, 1376.5, 1402.0, 1402.0, 0.07282449816118142, 0.015534131931981918, 0.048502253658130594], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, 28.571428571428573, 587.0000000000001, 129, 1402, 550.0, 1376.5, 1402.0, 1402.0, 0.07337064754837222, 0.015650630594511876, 0.04886599768358384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1271.0454545454545, 163, 2517, 1250.5, 2225.4, 2477.3999999999996, 2517.0, 0.09141603437242893, 0.028616205361965946, 0.04124434363287321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 204.2777777777778, 128, 413, 135.0, 385.1, 413.0, 413.0, 0.10781089968195785, 0.028847838391461378, 0.061485903724866585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 15, 0, 0.0, 186.86666666666667, 128, 412, 135.0, 401.8, 412.0, 412.0, 0.08439578246143113, 0.02274730074155761, 0.04969790705492477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 150.88888888888889, 129, 383, 137.5, 179.6000000000003, 383.0, 383.0, 0.10779346771585642, 0.08010823137867845, 0.054107267974560745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 15, 0, 0.0, 182.66666666666666, 126, 383, 136.0, 383.0, 383.0, 383.0, 0.08440528039434148, 0.02274986073128735, 0.04962107304432965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 147.11111111111106, 126, 379, 133.0, 165.70000000000033, 379.0, 379.0, 0.10781154541860827, 0.02905858060110926, 0.06348668153068436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 234.55555555555554, 128, 420, 136.5, 410.1, 420.0, 420.0, 0.10780960823186253, 0.029058058468744194, 0.0633802579644348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 257.4, 127, 1504, 134.0, 839.2000000000004, 1504.0, 1504.0, 0.08459187241289857, 5.095674509155661, 0.049246127807040296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 212.06666666666663, 127, 784, 138.0, 550.0000000000001, 784.0, 784.0, 0.08458662516282925, 1.6793639121032182, 0.049325677186423285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 152.06666666666666, 128, 396, 136.0, 244.2000000000001, 396.0, 396.0, 0.08458901019579537, 0.0628635124599612, 0.04245971800843634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 15, 0, 0.0, 168.79999999999998, 128, 412, 132.0, 400.6, 412.0, 412.0, 0.084521803807989, 0.022616185784559557, 0.048203841234243726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 237.46666666666667, 127, 410, 136.0, 407.6, 410.0, 410.0, 0.08458662516282925, 0.03110320696091534, 0.047767212673332095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 15, 0, 0.0, 187.33333333333334, 128, 399, 138.0, 396.0, 399.0, 399.0, 0.08451751766416118, 0.06281038177971354, 0.042423832108768406], "isController": false}, {"data": ["deleteAccount", 13, 4, 30.76923076923077, 565.8461538461538, 128, 1502, 514.0, 1452.0, 1502.0, 1502.0, 0.06839081669156795, 0.014184723924685928, 0.046530621001767636], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 15, 0, 0.0, 159.06666666666666, 135, 403, 142.0, 257.2000000000001, 403.0, 403.0, 0.08638015329597871, 0.06799062847320199, 0.030705445116929932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1679.0476190476188, 999, 2778, 1534.0, 2476.4, 2749.9999999999995, 2778.0, 0.09663036125950775, 0.05001376119876865, 0.04444619155588686], "isController": false}, {"data": ["goToProfile", 15, 5, 33.333333333333336, 260.73333333333335, 128, 563, 239.0, 498.80000000000007, 563.0, 563.0, 0.07533562018793726, 0.13618777120823267, 0.04867877801857274], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=145ab6fd-3e6c-4e28-9760-a07d7bd5a4fd", 1, 0, 0.0, 906.0, 906, 906, 906.0, 906.0, 906.0, 906.0, 1.1037527593818985, 0.19940845750551875, 0.7609857891832229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 15, 0, 0.0, 412.3333333333333, 262, 794, 278.0, 790.4, 794.0, 794.0, 0.08432983083435934, 0.13069476712317216, 0.18965976602688436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94463555-2e64-46c4-a7a6-451e8276caf5", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 149.75, 126, 392, 133.5, 217.00000000000017, 392.0, 392.0, 0.08331510815342477, 0.061916794242926024, 0.04182027889732454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 164.625, 127, 413, 131.0, 387.8, 413.0, 413.0, 0.08319424295838729, 0.02226095954159972, 0.047446716687205244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 938.8571428571428, 650, 1117, 1043.0, 1117.0, 1117.0, 1117.0, 0.04931348582941761, 14.499802195682955, 0.028124097387089726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1410.4285714285713, 1040, 2039, 1309.0, 2039.0, 2039.0, 2039.0, 0.048871078095982796, 43.974281976957286, 0.02782406106441208], "isController": false}, {"data": ["addBook", 59, 12, 20.338983050847457, 1307.1186440677964, 681, 2594, 1078.0, 2456.0, 2521.0, 2594.0, 0.26696590981077095, 71.41448999188921, 0.972673960529769], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 292.7142857142857, 127, 454, 378.0, 454.0, 454.0, 454.0, 0.049434330023587235, 0.08747559179955085, 0.027372329222044887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50be79ed-cb5e-4bba-a3b6-d0a761876828", 3, 0, 0.0, 485.3333333333333, 262, 645, 549.0, 645.0, 645.0, 645.0, 0.028282409284172222, 0.028365267905121946, 0.018136831474550547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 188.29999999999998, 129, 409, 138.0, 407.6, 409.0, 409.0, 0.06122498959175177, 0.045500211991526464, 0.030732074853672277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 161.3, 131, 391, 136.0, 366.1000000000001, 391.0, 391.0, 0.06132824717736742, 0.016410097389256518, 0.034976265968342364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 184.0, 127, 411, 130.5, 407.8, 411.0, 411.0, 0.06133088009812941, 0.016530588776448942, 0.03605584943268936], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 244.8035714285714, 128, 561, 139.5, 527.5, 545.3, 561.0, 0.2540581248695684, 0.18880686818920073, 0.12281130059612924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 210.5, 130, 399, 139.0, 397.0, 399.0, 399.0, 0.06133012781198636, 0.01653038601182445, 0.03611529987365994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94463555-2e64-46c4-a7a6-451e8276caf5", 3, 0, 0.0, 415.0, 279, 507, 459.0, 507.0, 507.0, 507.0, 0.03250024375182814, 0.027094115966286414, 0.020841627666374166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/568dbaf3-d4c0-4389-99be-87aa1ce10bc7", 2, 0, 0.0, 365.5, 296, 435, 365.5, 435.0, 435.0, 435.0, 0.011585270487102697, 0.022910324937873986, 0.007201195961953971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ad545dd-0268-4df7-9e34-1b2d4d61453b", 1, 0, 0.0, 1116.0, 1116, 1116, 1116.0, 1116.0, 1116.0, 1116.0, 0.8960573476702509, 0.16188536066308243, 0.6177895385304659], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 856.9642857142856, 626, 1237, 799.5, 1099.3, 1204.5, 1237.0, 0.25391873693565425, 74.66053955464467, 0.1277032710174433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 131.42857142857142, 128, 137, 131.0, 137.0, 137.0, 137.0, 0.049530521414874726, 0.036809303512421544, 0.02781254864604782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c6f0a19-3f94-4afe-89df-6135eb590c06", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 209.8214285714286, 127, 548, 138.0, 412.0, 414.15, 548.0, 0.2545581824545773, 0.4504486587965762, 0.12379880357654247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1008.2500000000001, 132, 1803, 1347.0, 1770.1000000000001, 1803.0, 1803.0, 0.08350076977272133, 46.967276912689506, 0.04460441510320173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 167.8125, 130, 412, 134.0, 402.90000000000003, 412.0, 412.0, 0.08319424295838729, 0.022423448297377822, 0.04890911548920815], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1241.3214285714284, 880, 1627, 1231.5, 1571.5, 1620.3, 1627.0, 0.2532973892276239, 227.91743607633296, 0.12714341607714716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 723.6875, 128, 1271, 1030.5, 1147.1000000000001, 1271.0, 1271.0, 0.0835025129037477, 15.353759537552646, 0.04468689167114623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 184.375, 127, 410, 136.5, 401.6, 410.0, 410.0, 0.083315975838367, 0.022456259112684857, 0.04906204436575714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 156.70588235294116, 131, 398, 142.0, 200.3999999999998, 398.0, 398.0, 0.0929642470442838, 0.06945082909070029, 0.03304588469152275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c6f0a19-3f94-4afe-89df-6135eb590c06", 3, 0, 0.0, 1228.0, 236, 2820, 628.0, 2820.0, 2820.0, 2820.0, 0.022923511882020325, 0.027094814988156184, 0.014700298960800794], "isController": false}, {"data": ["deleteBooks", 13, 4, 30.76923076923077, 467.6153846153846, 132, 1116, 481.0, 1032.0, 1116.0, 1116.0, 0.06848665563855903, 0.014780811421993698, 0.04571607737411625], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, 6.896551724137931, 203.29885057471265, 127, 719, 144.0, 385.0, 444.0, 679.25, 0.7450639513224885, 1.5962448201462722, 0.35774159314155785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 142.62500000000003, 130, 152, 142.5, 152.0, 152.0, 152.0, 0.03649085675970314, 0.028259032627387298, 0.012971359238800727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 404.2, 267, 807, 277.5, 805.2, 807.0, 807.0, 0.06117442664268629, 0.0948084131659601, 0.13758271929502588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ad545dd-0268-4df7-9e34-1b2d4d61453b", 3, 0, 0.0, 770.3333333333333, 371, 1377, 563.0, 1377.0, 1377.0, 1377.0, 0.018795226012592803, 0.025910736381292484, 0.012052928139585879], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 144.38888888888886, 132, 175, 142.0, 157.90000000000003, 175.0, 175.0, 0.10609454202522693, 0.08609820744430037, 0.03771329423552988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=644348d8-5bad-4c78-b84e-217012e9379d", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 618.3333333333335, 157, 2034, 415.0, 1131.8, 1944.5999999999988, 2034.0, 0.09749122578967892, 0.059884747091511766, 0.044080505410763034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 137.3125, 126, 183, 134.5, 153.60000000000002, 183.0, 183.0, 0.08349641226353555, 0.0620515329419439, 0.04191128506196999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 230.875, 127, 422, 135.5, 403.8, 422.0, 422.0, 0.08350033400133601, 0.10072635505385771, 0.043238332133016026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/701106ca-0515-420e-a451-a6c32f110035", 3, 0, 0.0, 752.6666666666667, 300, 1502, 456.0, 1502.0, 1502.0, 1502.0, 0.11750421056754534, 0.05316759527633074, 0.07535263503192198], "isController": false}, {"data": ["login", 21, 0, 0.0, 3305.1904761904757, 1506, 5300, 3056.0, 5137.2, 5284.7, 5300.0, 0.09623095429029671, 38.50462986166801, 0.19838236768243786], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 444.625, 269, 822, 290.0, 822.0, 822.0, 822.0, 0.03684886897002805, 0.05710854985882277, 0.08287396995895957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=701106ca-0515-420e-a451-a6c32f110035", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 0.7434735082304527, 2.837255658436214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/644348d8-5bad-4c78-b84e-217012e9379d", 3, 0, 0.0, 1112.6666666666667, 241, 2518, 579.0, 2518.0, 2518.0, 2518.0, 0.02868617326448652, 0.0239144823340983, 0.018395755641614074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 140.6875, 132, 151, 141.0, 146.8, 151.0, 151.0, 0.08333376736337168, 0.06746454408616712, 0.029622550117448528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 483.8666666666667, 266, 1900, 279.0, 1089.4000000000005, 1900.0, 1900.0, 0.08452228007302724, 6.863462268549823, 0.1886508676916402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50be79ed-cb5e-4bba-a3b6-d0a761876828", 1, 0, 0.0, 684.0, 684, 684, 684.0, 684.0, 684.0, 684.0, 1.461988304093567, 0.2641287463450292, 1.0079724049707601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6e18fdb-723d-4234-8e49-65954cf51b92", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 146.79999999999998, 135, 209, 139.5, 202.8, 209.0, 209.0, 0.06180240534961621, 0.051240470841625155, 0.021968823776621384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec091bfc-5900-4a7e-8a9f-dc59786405ac", 3, 0, 0.0, 350.3333333333333, 231, 505, 315.0, 505.0, 505.0, 505.0, 0.024232633279483037, 0.028642152160743135, 0.015539807148626818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ee9a1ad-bfdd-4ac1-bccf-3dbfb7ea55b9", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1146.6875, 268, 1944, 1480.5, 1904.1000000000001, 1944.0, 1944.0, 0.08343850061014403, 62.436901670986344, 0.17431231682641662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 174.75, 129, 418, 142.0, 392.1, 418.0, 418.0, 0.07995322736199323, 0.06207306225857873, 0.028420873788833532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/673e0ea1-9bca-4e83-8de7-18972eb5504e", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.8701251702997276, 1.6258302111716623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 404.2222222222223, 267, 803, 291.0, 577.1000000000004, 803.0, 803.0, 0.10770768135280848, 0.1669258694403389, 0.24223709976124796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 9, 56.25, 748.5000000000001, 128, 2167, 134.5, 1832.4000000000003, 2167.0, 2167.0, 0.09673460257193124, 50.64565387679034, 0.13138051613956384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05c049c8-ae64-4290-98ea-2134c9dce638", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 164.8823529411765, 128, 391, 138.0, 383.0, 391.0, 391.0, 0.09065071214132979, 0.06736835150346873, 0.045502408242815935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 241.1176470588235, 128, 415, 137.0, 403.8, 415.0, 415.0, 0.0905300266797314, 0.040220543792569084, 0.05073592258085131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 348.7647058823529, 126, 1642, 137.0, 1338.7999999999997, 1642.0, 1642.0, 0.09065506281862587, 9.618216784918197, 0.05237871219150615], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1271.0454545454545, 163, 2517, 1250.5, 2225.4, 2477.3999999999996, 2517.0, 0.09381223055634917, 0.02936629305235149, 0.04232543995804035], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 322.2941176470588, 127, 778, 377.0, 758.8, 778.0, 778.0, 0.09053725874483405, 3.1534093935068808, 0.052399062606514425], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 19.444444444444443, 0.5335365853658537], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 13.88888888888889, 0.38109756097560976], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.11111111111111, 0.3048780487804878], "isController": false}, {"data": ["401/Unauthorized", 20, 55.55555555555556, 1.524390243902439], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1312, 36, "401/Unauthorized", 20, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
