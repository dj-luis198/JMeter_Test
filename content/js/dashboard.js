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

    var data = {"OkPercent": 99.3140243902439, "KoPercent": 0.6859756097560976};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8395915678524374, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4915254237288136, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f922fa2-e84c-4df2-8ff0-fc32a5c30447"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/abe85113-436a-48ca-8a71-07c019d6ac51"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e81a37c-2c02-4921-a776-279ff6538e5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41bc58f5-49f0-4af4-9972-b0721ce1da4e"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7c62876-92a2-476c-a4dd-cd85c4733f8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03d79552-51e0-49cd-bd60-6e1ba21eb3ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4969c76-34b6-46d9-8262-a2a742b433ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c0b4c7f-0a12-47fc-bc87-720744410796"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/534a2578-f0dc-4c99-ae49-9509779b9f4f"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46af4451-b3d7-40ca-8c36-470b8fa9b394"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22ec0d83-74a5-46b9-8ca3-bdd8a8676dec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dd79365-bd78-4212-bc07-e07a6b8c1153"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae6ac907-8fac-4392-a560-da325cae0539"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f4969c76-34b6-46d9-8262-a2a742b433ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30ba5895-f227-41ad-8a2c-fbd42626f032"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/41bc58f5-49f0-4af4-9972-b0721ce1da4e"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c90e731-79f0-44cc-b8ca-bcfb35435964"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9dd79365-bd78-4212-bc07-e07a6b8c1153"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abe85113-436a-48ca-8a71-07c019d6ac51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d85ca637-206c-493b-b2e0-d6d3c6fff0cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03d79552-51e0-49cd-bd60-6e1ba21eb3ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9c0b4c7f-0a12-47fc-bc87-720744410796"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f922fa2-e84c-4df2-8ff0-fc32a5c30447"], "isController": false}, {"data": [0.45614035087719296, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8389830508474576, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9624277456647399, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/22ec0d83-74a5-46b9-8ca3-bdd8a8676dec"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/46af4451-b3d7-40ca-8c36-470b8fa9b394"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7c62876-92a2-476c-a4dd-cd85c4733f8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30ba5895-f227-41ad-8a2c-fbd42626f032"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c90e731-79f0-44cc-b8ca-bcfb35435964"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a57c6ba2-5c14-411c-8622-98e5f1b6aee6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1312, 9, 0.6859756097560976, 271.2545731707317, 77, 2611, 94.5, 658.1000000000001, 816.3499999999999, 1234.6099999999997, 5.1355720565382645, 752.6152202544398, 3.7538022303237524], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1167.6101694915253, 954, 1528, 1150.0, 1395.0, 1473.0, 1528.0, 0.24906179687532978, 299.70499847106663, 1.2246349094407085], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f922fa2-e84c-4df2-8ff0-fc32a5c30447", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.0627297794117647, 4.055606617647059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abe85113-436a-48ca-8a71-07c019d6ac51", 3, 0, 0.0, 771.3333333333334, 183, 1793, 338.0, 1793.0, 1793.0, 1793.0, 0.037702651753173305, 0.024239172269699637, 0.02417780727661179], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 496.0, 375, 833, 465.5, 779.6000000000001, 833.0, 833.0, 0.06889978526233592, 0.012447715110871237, 0.046830322795493956], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 496.0, 375, 833, 465.5, 779.6000000000001, 833.0, 833.0, 0.06791325213926744, 0.012269484029066873, 0.04615978856340834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e81a37c-2c02-4921-a776-279ff6538e5e", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 111.80952380952381, 77, 243, 82.0, 242.0, 242.9, 243.0, 0.13304106534216897, 0.04511418566197433, 0.07534291730547496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 96.90476190476191, 77, 246, 83.0, 205.0000000000001, 244.89999999999998, 246.0, 0.13303853682950162, 0.0988694594992683, 0.06677910930699593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 119.57142857142858, 79, 400, 82.0, 248.4, 385.1999999999998, 400.0, 0.13304275107067737, 1.896960468088746, 0.07780006485834115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 132.66666666666669, 79, 699, 80.0, 243.20000000000002, 653.5999999999993, 699.0, 0.13304359395095125, 5.734764182209537, 0.07767063236887287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41bc58f5-49f0-4af4-9972-b0721ce1da4e", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 204.08333333333331, 155, 412, 179.5, 370.90000000000015, 412.0, 412.0, 0.06919577213832234, 0.15226110700261214, 0.044733985503485736], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c7c62876-92a2-476c-a4dd-cd85c4733f8b", 3, 0, 0.0, 275.0, 161, 467, 197.0, 467.0, 467.0, 467.0, 0.022495838269920066, 0.02256174404610147, 0.014426042119707853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03d79552-51e0-49cd-bd60-6e1ba21eb3ee", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 93.66666666666667, 79, 236, 84.0, 147.20000000000005, 236.0, 236.0, 0.0961125670385155, 0.07142740577764678, 0.04824400337675485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4969c76-34b6-46d9-8262-a2a742b433ba", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 1.129150390625, 4.30908203125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 93.19999999999999, 78, 245, 83.0, 149.00000000000006, 245.0, 245.0, 0.09611195120075865, 0.04496487508650075, 0.05373759354896583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 473.5, 404, 543, 473.5, 543.0, 543.0, 543.0, 0.058365191000087545, 17.161304060758162, 0.033286397992237426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 665.0, 543, 733, 692.0, 733.0, 733.0, 733.0, 0.05824111822947001, 52.405460559842744, 0.03315876164822364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 160.25, 79, 246, 158.0, 246.0, 246.0, 246.0, 0.058763038049067136, 0.10398303217276335, 0.03253773688849714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 81.75, 80, 86, 81.5, 85.10000000000001, 86.0, 86.0, 0.05783411248734879, 0.0429802339871801, 0.029030013494626247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 107.08333333333333, 78, 242, 82.0, 240.20000000000002, 242.0, 242.0, 0.05783439122073941, 0.015475217963361912, 0.03298367624307794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 106.83333333333334, 78, 237, 80.5, 237.0, 237.0, 237.0, 0.05783494869558093, 0.015588326015605797, 0.03400062413548801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 80.24999999999999, 78, 83, 80.0, 82.7, 83.0, 83.0, 0.05783411248734879, 0.015588100631355727, 0.03405661116198371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c0b4c7f-0a12-47fc-bc87-720744410796", 1, 0, 0.0, 922.0, 922, 922, 922.0, 922.0, 922.0, 922.0, 1.0845986984815619, 0.19594800704989154, 0.7477799620390455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 82.0, 79, 87, 81.0, 87.0, 87.0, 87.0, 0.05876044834222085, 0.04366865350432624, 0.03299536894216503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 423.5789473684211, 79, 817, 538.0, 807.0, 817.0, 817.0, 0.09414422895876483, 44.59683159765234, 0.05108834135210932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 186.86666666666667, 79, 730, 82.0, 713.2, 730.0, 730.0, 0.09611441459913882, 11.55364095419187, 0.05540345226958171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/534a2578-f0dc-4c99-ae49-9509779b9f4f", 1, 0, 0.0, 1132.0, 1132, 1132, 1132.0, 1132.0, 1132.0, 1132.0, 0.8833922261484098, 0.28209888471731454, 0.5271021974381626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 327.10526315789474, 81, 624, 387.0, 565.0, 624.0, 624.0, 0.09407291145758549, 14.570199744022656, 0.05114150824870897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 175.2, 78, 554, 83.0, 455.00000000000006, 554.0, 554.0, 0.09611318288416439, 3.790513708943652, 0.05549660279945664], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 501.50000000000006, 160, 1158, 372.0, 1087.2000000000003, 1158.0, 1158.0, 0.06795209377388942, 0.012276501316571818, 0.046849783402701094], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46af4451-b3d7-40ca-8c36-470b8fa9b394", 1, 0, 0.0, 1158.0, 1158, 1158, 1158.0, 1158.0, 1158.0, 1158.0, 0.8635578583765112, 0.15601387089810018, 0.5953826640759932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22ec0d83-74a5-46b9-8ca3-bdd8a8676dec", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.5161830357142857, 1.9698660714285716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dd79365-bd78-4212-bc07-e07a6b8c1153", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.49632984203296704, 1.8941019917582418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 190.58333333333337, 161, 325, 164.5, 322.90000000000003, 325.0, 325.0, 0.05781126548860155, 0.08959617024454165, 0.13001889103539976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 458.7619047619048, 95, 1163, 463.0, 1004.2000000000002, 1151.7999999999997, 1163.0, 0.10166242266394276, 0.062446937359003904, 0.04596650555996631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 91.10526315789474, 79, 247, 83.0, 87.0, 247.0, 247.0, 0.09414282953706503, 0.06996356765401024, 0.04725528748247209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 121.21052631578947, 79, 357, 82.0, 246.0, 357.0, 357.0, 0.09414562842206971, 0.09961358484255382, 0.04953097515050913], "isController": false}, {"data": ["login", 21, 0, 0.0, 2237.809523809524, 1041, 3707, 2092.0, 3544.2000000000007, 3705.0, 3707.0, 0.10032677865046151, 23.0015282664727, 0.1830599801854612], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ae6ac907-8fac-4392-a560-da325cae0539", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.703383122246696, 1.3142724394273126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 87.53333333333333, 81, 112, 86.0, 100.60000000000001, 112.0, 112.0, 0.10001066780456583, 0.08096566758787603, 0.03555066707115426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4969c76-34b6-46d9-8262-a2a742b433ba", 3, 0, 0.0, 272.0, 166, 381, 269.0, 381.0, 381.0, 381.0, 0.05547439856506223, 0.02510072070489469, 0.035574402725642114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30ba5895-f227-41ad-8a2c-fbd42626f032", 3, 0, 0.0, 249.33333333333334, 167, 348, 233.0, 348.0, 348.0, 348.0, 0.021079258010118045, 0.02904573540261383, 0.013517623137998876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 526.0, 163, 898, 645.0, 893.0, 898.0, 898.0, 0.09403333729263175, 59.27774876612177, 0.1988203842622837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41bc58f5-49f0-4af4-9972-b0721ce1da4e", 3, 0, 0.0, 445.33333333333337, 173, 895, 268.0, 895.0, 895.0, 895.0, 0.024621849429183457, 0.024693983753683018, 0.015789402140459444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 247.42857142857144, 160, 782, 167.0, 480.4, 751.8999999999996, 782.0, 0.13296946134704396, 7.771392253579094, 0.2974313644091407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 747.5, 623, 820, 773.5, 820.0, 820.0, 820.0, 0.058170818608844876, 69.59252250483544, 0.13116837907013945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c90e731-79f0-44cc-b8ca-bcfb35435964", 3, 0, 0.0, 268.3333333333333, 186, 344, 275.0, 344.0, 344.0, 344.0, 0.02253707348588428, 0.022603100068362456, 0.014452485275778656], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 988.4761904761903, 174, 1855, 935.0, 1686.8, 1838.3999999999996, 1855.0, 0.10148702657510282, 0.03222439627300977, 0.04578809206806397], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9dd79365-bd78-4212-bc07-e07a6b8c1153", 3, 0, 0.0, 391.33333333333337, 176, 648, 350.0, 648.0, 648.0, 648.0, 0.02485110048956668, 0.024923906448032208, 0.015936415353009884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 323.9333333333333, 161, 939, 321.0, 865.2, 939.0, 939.0, 0.09606024898816538, 15.451885172380118, 0.2127646960173421], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 23, 0, 0.0, 99.34782608695652, 80, 247, 85.0, 183.20000000000022, 245.59999999999997, 247.0, 0.15260793693974642, 0.11847979479208828, 0.05424735258405048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abe85113-436a-48ca-8a71-07c019d6ac51", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.506061799719888, 1.9312412464985995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 251.35294117647055, 163, 483, 180.0, 365.3999999999999, 483.0, 483.0, 0.08668206548065205, 0.1343402714040965, 0.19494999687689618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d85ca637-206c-493b-b2e0-d6d3c6fff0cc", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 1.0609167358803988, 1.9823245431893688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03d79552-51e0-49cd-bd60-6e1ba21eb3ee", 3, 0, 0.0, 318.3333333333333, 168, 450, 337.0, 450.0, 450.0, 450.0, 0.02027355787424988, 0.027948736197086013, 0.013000946944099043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 108.5, 80, 242, 83.0, 242.0, 242.0, 242.0, 0.035298893379692546, 0.026232869005806667, 0.017718389840978486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 106.83333333333333, 77, 236, 82.5, 236.0, 236.0, 236.0, 0.035298478047288195, 0.018281210473058435, 0.019637076491801925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 187.33333333333331, 78, 719, 81.5, 719.0, 719.0, 719.0, 0.03529868571226864, 5.301564991131205, 0.020246186271164503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 198.5, 78, 633, 81.0, 633.0, 633.0, 633.0, 0.035298893379692546, 1.737769576913347, 0.020280776958059032], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 747.9152542372882, 618, 1150, 650.0, 1051.0, 1122.0, 1150.0, 0.2599588471926647, 311.0011575603964, 0.5133171767808282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 988.4761904761903, 174, 1855, 935.0, 1686.8, 1838.3999999999996, 1855.0, 0.10068465565847765, 0.03196962559691617, 0.04542608487716472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 131.66666666666666, 79, 233, 83.0, 233.0, 233.0, 233.0, 0.022566571385587483, 0.006082396193771627, 0.013288713423348879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 135.0, 81, 242, 82.0, 242.0, 242.0, 242.0, 0.022566231890598906, 0.006082304689262986, 0.013266476170059122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 23, 0, 0.0, 199.34782608695656, 78, 735, 84.0, 558.0, 699.9999999999995, 735.0, 0.14090374436385023, 16.570255209992528, 0.0812565665739561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 23, 0, 0.0, 159.47826086956522, 78, 564, 81.0, 484.2000000000003, 561.4, 564.0, 0.14104199372056514, 5.442321394077463, 0.08147402872657476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 80.66666666666667, 78, 83, 81.0, 83.0, 83.0, 83.0, 0.022566741136912417, 0.006038366280775393, 0.012870094554645365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 23, 0, 0.0, 96.39130434782608, 79, 246, 83.0, 180.80000000000024, 245.6, 246.0, 0.1410376693218541, 0.1048141272987607, 0.0707942988588213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 83.66666666666667, 82, 85, 84.0, 85.0, 85.0, 85.0, 0.0225652134669194, 0.016769655711255528, 0.011326679416012274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 23, 0, 0.0, 129.91304347826087, 79, 247, 82.0, 245.2, 246.8, 247.0, 0.14089856528504394, 0.06530437918866931, 0.07881274197797082], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 540.3333333333334, 338, 949, 476.5, 932.8000000000001, 949.0, 949.0, 0.06871592835219205, 0.012414498774565944, 0.04677246295066196], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 143.66666666666666, 85, 257, 89.0, 257.0, 257.0, 257.0, 0.022898665771074408, 0.01802375450340427, 0.008139760098311605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1278.8095238095239, 659, 2611, 1065.0, 2150.6000000000004, 2575.6999999999994, 2611.0, 0.1021703910206822, 0.05288115941500154, 0.04699438883861457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 219.66666666666666, 165, 329, 165.0, 329.0, 329.0, 329.0, 0.02255147373880883, 0.03495037971043908, 0.05071879298874682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c0b4c7f-0a12-47fc-bc87-720744410796", 3, 0, 0.0, 459.6666666666667, 354, 613, 412.0, 613.0, 613.0, 613.0, 0.01678838243935197, 0.023144140504770698, 0.010765987436693809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f922fa2-e84c-4df2-8ff0-fc32a5c30447", 3, 0, 0.0, 315.0, 191, 486, 268.0, 486.0, 486.0, 486.0, 0.08287063893262617, 0.03749680602745781, 0.05314295530510207], "isController": false}, {"data": ["addBook", 57, 5, 8.771929824561404, 835.8421052631579, 424, 1940, 722.0, 1241.6000000000001, 1495.3999999999987, 1940.0, 0.2771443435811911, 99.96957527933232, 1.0049473835993756], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 138.05084745762713, 80, 383, 84.0, 325.0, 331.0, 383.0, 0.26058574375146304, 0.19365795995592125, 0.1259667413642326], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 455.64406779661016, 383, 664, 404.0, 574.0, 634.0, 664.0, 0.2605489191635938, 76.61003327242818, 0.131037786493409], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 122.20338983050847, 78, 269, 84.0, 245.0, 247.0, 269.0, 0.2607262330362233, 0.4613632170523795, 0.12679850005081952], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 606.0508474576272, 537, 821, 563.0, 731.0, 789.0, 821.0, 0.26037299534859093, 234.28407890156797, 0.13069503868083565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 106.35294117647058, 81, 244, 85.0, 239.2, 244.0, 244.0, 0.08749716920923147, 0.06536653754400593, 0.031102509367343996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 5, 2.8901734104046244, 140.76300578034687, 79, 969, 87.0, 249.6, 295.39999999999986, 864.6599999999987, 0.7501615232181496, 1.6917973374144144, 0.3578037395335123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 84.16666666666667, 83, 85, 84.5, 85.0, 85.0, 85.0, 0.03512798295121894, 0.0272036039846842, 0.012486900189691107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22ec0d83-74a5-46b9-8ca3-bdd8a8676dec", 3, 0, 0.0, 303.33333333333337, 155, 565, 190.0, 565.0, 565.0, 565.0, 0.03430453277226364, 0.02205450918789736, 0.02199867498742167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46af4451-b3d7-40ca-8c36-470b8fa9b394", 3, 0, 0.0, 569.3333333333334, 186, 949, 573.0, 949.0, 949.0, 949.0, 0.0708415981864551, 0.03288415332483234, 0.04542901967035043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7c62876-92a2-476c-a4dd-cd85c4733f8b", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 111.85714285714285, 81, 300, 85.0, 253.20000000000002, 295.49999999999994, 300.0, 0.13220518244315177, 0.10728760411158118, 0.04699481094658911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 323.1666666666667, 162, 802, 166.0, 802.0, 802.0, 802.0, 0.03528187276180619, 7.080464307607948, 0.07784522577458411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 23, 0, 0.0, 322.21739130434787, 160, 820, 323.0, 645.0, 784.9999999999995, 820.0, 0.14082609813742178, 22.16504244682284, 0.3120214113071111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 88.33333333333334, 82, 110, 86.0, 107.00000000000001, 110.0, 110.0, 0.060185974661704666, 0.04990028563260475, 0.02139423318052783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 88.63157894736842, 82, 121, 85.0, 99.0, 121.0, 121.0, 0.09444842122007475, 0.07332665514644476, 0.03357346223057345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30ba5895-f227-41ad-8a2c-fbd42626f032", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c90e731-79f0-44cc-b8ca-bcfb35435964", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.5267173833819242, 2.0100674198250728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 92.70588235294117, 81, 238, 83.0, 125.1999999999999, 238.0, 238.0, 0.08679403265497841, 0.06450220590863141, 0.043566535922518454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 127.11764705882351, 79, 252, 81.0, 244.79999999999998, 252.0, 252.0, 0.08671965067284246, 0.023204281527694177, 0.04945730077435547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 119.05882352941177, 79, 246, 82.0, 244.4, 246.0, 246.0, 0.08672230497684005, 0.02337437126328892, 0.050983230074275104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a57c6ba2-5c14-411c-8622-98e5f1b6aee6", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.8003406954887218, 1.495437813283208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 137.64705882352942, 79, 249, 83.0, 245.0, 249.0, 249.0, 0.08679314640472155, 0.023393465241897605, 0.05110963601762412], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 44.44444444444444, 0.3048780487804878], "isController": false}, {"data": ["401/Unauthorized", 5, 55.55555555555556, 0.38109756097560976], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1312, 9, "401/Unauthorized", 5, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
