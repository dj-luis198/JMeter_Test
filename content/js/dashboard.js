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

    var data = {"OkPercent": 67.41573033707866, "KoPercent": 32.58426966292135};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5011848341232228, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f31a5d4-6f46-4435-9590-0d8801faf0e9"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cb098a7c-9daa-4a33-86f4-740699d45b9f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20d5ee40-c766-4cd4-acbc-1dbd9ef7e373"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3958333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/20d5ee40-c766-4cd4-acbc-1dbd9ef7e373"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f16f37f1-1666-4d25-b40b-4b7ee85850a5"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d5b7fc1-aa9c-49fa-a186-7057d7b450e0"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=579166db-f2e4-4060-a28f-5a9e8741228d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d5b7fc1-aa9c-49fa-a186-7057d7b450e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2876a203-0779-452d-a691-7fe41a03922f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bdb95eba-8e38-4576-9845-c46b6edd20dd"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9157608695652174, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0af46b2-3ef1-46bd-b642-a9d34cdcdfa6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2876a203-0779-452d-a691-7fe41a03922f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0af46b2-3ef1-46bd-b642-a9d34cdcdfa6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/579166db-f2e4-4060-a28f-5a9e8741228d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bdb95eba-8e38-4576-9845-c46b6edd20dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e424975d-ebc2-4ad3-87f5-d8f682b56e50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=883fbab7-9881-4a51-b268-bfa9dfc3b1ff"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/883fbab7-9881-4a51-b268-bfa9dfc3b1ff"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3156acf-bd4b-43ee-91da-597501150554"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3156acf-bd4b-43ee-91da-597501150554"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f16f37f1-1666-4d25-b40b-4b7ee85850a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83984c8b-6465-4173-9eb2-eab4624a109c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78c470df-11a7-4df5-ab53-25595ce38cb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e65455be-ac1f-4414-9f7c-e4a08c69ff90"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8841d368-1cdc-4252-baaa-479d3dc1cd08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8841d368-1cdc-4252-baaa-479d3dc1cd08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83984c8b-6465-4173-9eb2-eab4624a109c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb098a7c-9daa-4a33-86f4-740699d45b9f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3958333333333333, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 623, 203, 32.58426966292135, 320.87158908507257, 139, 2638, 154.0, 689.0000000000001, 1058.7999999999997, 1623.56, 2.4781225139220364, 2.5647196014817024, 1.1877936679594272], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/5f31a5d4-6f46-4435-9590-0d8801faf0e9", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["see books", 56, 56, 100.0, 837.6785714285712, 565, 1370, 899.5, 1056.0, 1084.7999999999997, 1370.0, 0.2537162636655657, 1.6335019725306839, 0.42591626683701905], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 25, 0, 0.0, 199.68, 141, 449, 154.0, 443.2, 447.8, 449.0, 0.1315484835090821, 0.10212992616183621, 0.04676137499736903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, 100.0, 227.4, 146, 448, 152.0, 444.4, 448.0, 448.0, 0.09197939661515821, 0.04572022741905813, 0.04616934556659308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb098a7c-9daa-4a33-86f4-740699d45b9f", 3, 0, 0.0, 607.3333333333334, 230, 870, 722.0, 870.0, 870.0, 870.0, 0.017266982076872602, 0.0238039287420428, 0.011072901917786144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 184.3125, 139, 453, 148.0, 438.3, 453.0, 453.0, 0.09611225911865058, 0.04777455067518862, 0.04824384881541641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20d5ee40-c766-4cd4-acbc-1dbd9ef7e373", 1, 0, 0.0, 1128.0, 1128, 1128, 1128.0, 1128.0, 1128.0, 1128.0, 0.8865248226950354, 0.16016317597517732, 0.6112173093971632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 433.5, 418, 449, 433.5, 449.0, 449.0, 449.0, 0.26072220049537215, 0.07689268022422109, 0.16116909464215878], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, 100.0, 290.9107142857142, 140, 924, 151.5, 594.9, 626.7999999999998, 924.0, 0.24796535569744688, 0.12325621684570356, 0.11986606549827752], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 602.4285714285714, 141, 1248, 538.0, 1199.0, 1248.0, 1248.0, 0.07508071176514754, 0.01478989467248721, 0.05051817422479165], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 602.4285714285714, 141, 1248, 538.0, 1199.0, 1248.0, 1248.0, 0.07436721468221295, 0.014649345302913602, 0.05003809659769993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 960.7499999999999, 191, 1619, 1043.0, 1391.5, 1565.75, 1619.0, 0.09631939511419868, 0.03052308956499753, 0.04345660209253886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20d5ee40-c766-4cd4-acbc-1dbd9ef7e373", 3, 0, 0.0, 444.0, 335, 546, 451.0, 546.0, 546.0, 546.0, 0.021564272313630777, 0.02971405101028616, 0.013828651190707236], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 580.4285714285713, 140, 2118, 459.0, 1503.0, 2118.0, 2118.0, 0.07426622319121962, 0.016774137185628424, 0.04964895947716579], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 252.33333333333334, 152, 451, 154.0, 451.0, 451.0, 451.0, 0.022340211636271565, 0.01758419001839344, 0.007941247105080908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f16f37f1-1666-4d25-b40b-4b7ee85850a5", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 0.719777141434263, 2.746825199203187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1229.952380952381, 743, 2638, 1060.0, 1742.6000000000001, 2551.3999999999987, 2638.0, 0.09512032721392562, 0.049232200608770094, 0.04375163488062399], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 270.07142857142856, 139, 369, 267.0, 360.5, 369.0, 369.0, 0.07502237274330023, 0.16456149088210234, 0.04759022445086303], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 3, 100.0, 298.3333333333333, 151, 591, 153.0, 591.0, 591.0, 591.0, 0.02121070716497688, 0.010543212838841048, 0.010646780744920037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d5b7fc1-aa9c-49fa-a186-7057d7b450e0", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["addBook", 64, 64, 100.0, 900.328125, 569, 2475, 786.5, 1115.0, 1685.25, 2475.0, 0.3021148036253776, 0.9718189066630476, 0.5905243565308723], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=579166db-f2e4-4060-a28f-5a9e8741228d", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d5b7fc1-aa9c-49fa-a186-7057d7b450e0", 3, 0, 0.0, 378.6666666666667, 315, 481, 340.0, 481.0, 481.0, 481.0, 0.01876747721315475, 0.02587248242112968, 0.012035133499321242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2876a203-0779-452d-a691-7fe41a03922f", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 189.375, 142, 490, 149.5, 451.50000000000006, 490.0, 490.0, 0.09647097128179774, 0.07207059866267115, 0.034292415572826536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdb95eba-8e38-4576-9845-c46b6edd20dd", 3, 0, 0.0, 313.6666666666667, 227, 439, 275.0, 439.0, 439.0, 439.0, 0.06399726944983682, 0.028957097830492565, 0.04103991563026644], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 496.64285714285717, 247, 1128, 438.0, 917.0, 1128.0, 1128.0, 0.07436998002634822, 0.01464989003867239, 0.050517219970464496], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 9, 4.891304347826087, 236.5380434782609, 140, 2039, 154.0, 387.5, 516.25, 1940.4000000000005, 0.7663058643222149, 1.599157545093352, 0.3712566778454311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 191.0, 140, 447, 150.0, 447.0, 447.0, 447.0, 0.04155067104333735, 0.032177423962271995, 0.014769965097436324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0af46b2-3ef1-46bd-b642-a9d34cdcdfa6", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.2867683531746032, 1.0943700396825398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2876a203-0779-452d-a691-7fe41a03922f", 3, 0, 0.0, 389.3333333333333, 301, 469, 398.0, 469.0, 469.0, 469.0, 0.02232840619836556, 0.02639142021688325, 0.014318671943613331], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0af46b2-3ef1-46bd-b642-a9d34cdcdfa6", 3, 0, 0.0, 503.6666666666667, 333, 686, 492.0, 686.0, 686.0, 686.0, 0.018794755010368442, 0.025910087066702586, 0.012052626097143825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/579166db-f2e4-4060-a28f-5a9e8741228d", 3, 0, 0.0, 447.3333333333333, 369, 506, 467.0, 506.0, 506.0, 506.0, 0.01944125823823318, 0.02297890906999501, 0.012467213128033646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 21, 21, 100.0, 176.42857142857144, 140, 447, 150.0, 375.6000000000002, 445.2, 447.0, 0.09894412483921579, 0.049182187053868, 0.04966531266343449], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bdb95eba-8e38-4576-9845-c46b6edd20dd", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 149.49999999999997, 140, 159, 150.0, 155.4, 159.0, 159.0, 0.0924869747510559, 0.07505534767395258, 0.032876229306039395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 574.4761904761904, 233, 1073, 550.0, 977.4000000000001, 1065.1, 1073.0, 0.09743965701240731, 0.0598530705671916, 0.04405718866869589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e424975d-ebc2-4ad3-87f5-d8f682b56e50", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.9917265139751552, 1.8530425077639752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=883fbab7-9881-4a51-b268-bfa9dfc3b1ff", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["login", 21, 5, 23.80952380952381, 2143.8095238095243, 1391, 3811, 2009.0, 3143.8, 3754.1999999999994, 3811.0, 0.09399001020462967, 0.14037310117800814, 0.14102435264380472], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/883fbab7-9881-4a51-b268-bfa9dfc3b1ff", 3, 0, 0.0, 335.6666666666667, 244, 445, 318.0, 445.0, 445.0, 445.0, 0.032231724612144914, 0.02687026260797628, 0.02066943277536637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, 100.0, 146.28571428571428, 140, 152, 145.0, 152.0, 152.0, 152.0, 0.0398202400591615, 0.019793459170032425, 0.0199878939359463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 211.26666666666668, 146, 448, 153.0, 447.4, 448.0, 448.0, 0.08761784600287385, 0.07093280696912346, 0.031145406196334068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 25, 25, 100.0, 170.48000000000002, 140, 431, 149.0, 258.40000000000055, 426.2, 431.0, 0.12598583919167483, 0.06262382045758057, 0.06323898568800866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3156acf-bd4b-43ee-91da-597501150554", 1, 0, 0.0, 706.0, 706, 706, 706.0, 706.0, 706.0, 706.0, 1.41643059490085, 0.2558981055240793, 0.9765625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3156acf-bd4b-43ee-91da-597501150554", 3, 0, 0.0, 345.6666666666667, 230, 415, 392.0, 415.0, 415.0, 415.0, 0.043228911496008535, 0.02779202480619038, 0.027721665249719012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f16f37f1-1666-4d25-b40b-4b7ee85850a5", 3, 0, 0.0, 919.0, 287, 2118, 352.0, 2118.0, 2118.0, 2118.0, 0.10182608105356052, 0.046073649955875366, 0.06529862619645645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83984c8b-6465-4173-9eb2-eab4624a109c", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 21, 0, 0.0, 179.8571428571429, 142, 452, 152.0, 368.60000000000014, 448.59999999999997, 452.0, 0.10186114870272552, 0.08445323754747457, 0.03620845520292196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 15, 100.0, 193.86666666666667, 144, 504, 151.0, 477.6, 504.0, 504.0, 0.08069375107591668, 0.040110468064103115, 0.04050448052052849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78c470df-11a7-4df5-ab53-25595ce38cb5", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 151.06666666666666, 142, 164, 151.0, 159.2, 164.0, 164.0, 0.07805304484927957, 0.06059782290544655, 0.027745418286267347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e65455be-ac1f-4414-9f7c-e4a08c69ff90", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.7846091830466831, 1.4660434582309583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8841d368-1cdc-4252-baaa-479d3dc1cd08", 3, 0, 0.0, 461.33333333333337, 224, 888, 272.0, 888.0, 888.0, 888.0, 0.028325134780432998, 0.02840811857373505, 0.0181642303116709], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8841d368-1cdc-4252-baaa-479d3dc1cd08", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83984c8b-6465-4173-9eb2-eab4624a109c", 3, 0, 0.0, 350.0, 233, 448, 369.0, 448.0, 448.0, 448.0, 0.054249547920433995, 0.034877232142857144, 0.034788935352622063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb098a7c-9daa-4a33-86f4-740699d45b9f", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 18, 100.0, 196.88888888888889, 140, 445, 151.0, 443.2, 445.0, 445.0, 0.09415161548480237, 0.04679997293141055, 0.04725969761639493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 9, 100.0, 147.77777777777777, 139, 161, 150.0, 161.0, 161.0, 161.0, 0.09407042739330845, 0.046759616741400396, 0.05353726038171689], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 960.7499999999999, 191, 1619, 1043.0, 1391.5, 1565.75, 1619.0, 0.09505891672442816, 0.030123650856520447, 0.042887909694029114], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.4630541871921183, 0.8025682182985554], "isController": false}, {"data": ["401/Unauthorized", 13, 6.403940886699507, 2.086677367576244], "isController": false}, {"data": ["404/Not Found", 185, 91.13300492610837, 29.69502407704655], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 623, 203, "404/Not Found", 185, "401/Unauthorized", 13, "406/Not Acceptable", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 56, 56, "404/Not Found", 56, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 3, "404/Not Found", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 25, 25, "404/Not Found", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
