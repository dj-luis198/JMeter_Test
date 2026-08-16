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

    var data = {"OkPercent": 99.03917220990392, "KoPercent": 0.9608277900960828};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7405750798722045, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7085516d-328b-4630-b9de-5e8c07e87fd5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/968e74cd-15ec-4e8c-996b-36aeff216072"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c58d4d62-9056-4564-ba2a-0980945c7789"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff3d4fe3-0c80-4870-aed7-d7254069d2bc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f76d2e65-1775-4df3-b616-5c281225b1c5"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/929796b2-4482-4a6f-aca5-6518ff98bfe3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49a9091f-8574-4af5-99e0-d3d0149afb30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e130258-753e-42b4-81b3-d9cceb3a94c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=220b6e91-0559-431b-a6b5-617a682ec397"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0db6430f-fa3b-4876-8455-ce053c55fe30"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e130258-753e-42b4-81b3-d9cceb3a94c9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb7adf76-6574-46a0-99b4-91aeab94a508"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/220b6e91-0559-431b-a6b5-617a682ec397"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c37dd028-0071-47a4-a088-43eaf2e8b958"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41225421-1a0d-4d9f-8dbd-3005203542aa"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [0.8478260869565217, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f76d2e65-1775-4df3-b616-5c281225b1c5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ff3d4fe3-0c80-4870-aed7-d7254069d2bc"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=968e74cd-15ec-4e8c-996b-36aeff216072"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7085516d-328b-4630-b9de-5e8c07e87fd5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=929796b2-4482-4a6f-aca5-6518ff98bfe3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6b71dcf-126f-4b16-9b0b-e618c5551088"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.20689655172413793, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/49614b6e-3ed6-4a6e-a0ab-3d95fb2e81ed"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.29365079365079366, 500, 1500, "addBook"], "isController": true}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49a9091f-8574-4af5-99e0-d3d0149afb30"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.29310344827586204, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9402173913043478, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bb7adf76-6574-46a0-99b4-91aeab94a508"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c815242a-864b-4bcb-b51b-12de5ddaf1d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0db6430f-fa3b-4876-8455-ce053c55fe30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/41225421-1a0d-4d9f-8dbd-3005203542aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c37dd028-0071-47a4-a088-43eaf2e8b958"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1353, 13, 0.9608277900960828, 477.86326681448656, 137, 3311, 154.0, 1382.4000000000012, 1651.6, 2231.2200000000003, 5.266804727278389, 729.8960423117984, 3.858085608446351], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2328.775862068965, 1684, 3007, 2333.0, 2825.3, 2898.9, 3007.0, 0.2467434123763092, 296.91482077733747, 1.2132354309714033], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7085516d-328b-4630-b9de-5e8c07e87fd5", 3, 0, 0.0, 837.3333333333334, 421, 1553, 538.0, 1553.0, 1553.0, 1553.0, 0.02253792005048494, 0.026639058497171488, 0.014453028157374781], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/968e74cd-15ec-4e8c-996b-36aeff216072", 3, 0, 0.0, 400.3333333333333, 256, 599, 346.0, 599.0, 599.0, 599.0, 0.043051489581539516, 0.027677959610527526, 0.027607888826703404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c58d4d62-9056-4564-ba2a-0980945c7789", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.1244223151408452, 2.1009848151408455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff3d4fe3-0c80-4870-aed7-d7254069d2bc", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f76d2e65-1775-4df3-b616-5c281225b1c5", 3, 0, 0.0, 1472.0, 244, 3311, 861.0, 3311.0, 3311.0, 3311.0, 0.022852964029434618, 0.027011429814738638, 0.014655058313146549], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 678.1666666666666, 508, 1133, 598.0, 1093.1000000000001, 1133.0, 1133.0, 0.07015943732131269, 0.012675288969182468, 0.04768649255432972], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 678.1666666666666, 508, 1133, 598.0, 1093.1000000000001, 1133.0, 1133.0, 0.07058865052147366, 0.012752832369602174, 0.04797822340131413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/929796b2-4482-4a6f-aca5-6518ff98bfe3", 3, 0, 0.0, 375.3333333333333, 309, 457, 360.0, 457.0, 457.0, 457.0, 0.0348711510966977, 0.028548484703188385, 0.022362033743650544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 212.66666666666666, 139, 425, 143.5, 424.4, 425.0, 425.0, 0.07120098257355952, 0.03687524846176211, 0.03961018203717878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 168.08333333333334, 140, 417, 145.0, 339.0000000000003, 417.0, 417.0, 0.07132158904500392, 0.05300364185864061, 0.03580009450110548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 404.25, 140, 1153, 281.5, 1150.6, 1153.0, 1153.0, 0.07120520747417328, 3.5054425626160794, 0.040910544007785106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 433.3333333333333, 140, 1675, 149.5, 1547.2000000000005, 1675.0, 1675.0, 0.07131735032271101, 10.711264742633512, 0.040905329189002866], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 335.58333333333337, 232, 534, 285.0, 525.0, 534.0, 534.0, 0.07059487951807229, 0.16802477549357586, 0.045638486563441265], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49a9091f-8574-4af5-99e0-d3d0149afb30", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 143.00000000000003, 139, 148, 142.0, 147.6, 148.0, 148.0, 0.11667960288350811, 0.08671208768979459, 0.0585676912911359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 191.86956521739128, 138, 436, 144.0, 428.6, 435.4, 436.0, 0.11668433842516729, 0.038841933307290744, 0.06612046453049773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 973.2, 825, 1138, 968.0, 1138.0, 1138.0, 1138.0, 0.05685048322910744, 16.715929683058555, 0.03242254121660034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1629.6, 1473, 1726, 1656.0, 1726.0, 1726.0, 1726.0, 0.05628602305475504, 50.64626248494349, 0.03204565570402558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 257.8, 141, 445, 143.0, 445.0, 445.0, 445.0, 0.05709978758879017, 0.10103985850672635, 0.03161677691683987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 164.5625, 138, 435, 146.0, 247.4000000000002, 435.0, 435.0, 0.09770634358435722, 0.07261184323017172, 0.049044004494491804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 195.5625, 137, 438, 143.0, 434.5, 438.0, 438.0, 0.09788147776561057, 0.035379279255856065, 0.05530924811731095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 258.81249999999994, 139, 1703, 144.0, 813.3000000000009, 1703.0, 1703.0, 0.09788267537822477, 5.529421247652345, 0.05701857017881941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 221.0625, 138, 833, 144.0, 547.4000000000003, 833.0, 833.0, 0.09788028018230202, 1.8234862011745634, 0.057112761141528766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e130258-753e-42b4-81b3-d9cceb3a94c9", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 0.7002483042635659, 2.672298934108527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 142.0, 139, 145, 141.0, 145.0, 145.0, 145.0, 0.05729936626900907, 0.04258282981515225, 0.03217493711394552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 219.695652173913, 138, 1295, 144.0, 427.8, 1122.5999999999976, 1295.0, 0.11668552237064396, 4.595032470600322, 0.06816233936715861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 916.7058823529412, 139, 1676, 1277.0, 1657.6, 1676.0, 1676.0, 0.08738877208494189, 46.26415208152345, 0.04695740889720511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 186.00000000000003, 138, 820, 143.0, 329.4000000000003, 739.3999999999988, 820.0, 0.11668137866658548, 1.5217427663886607, 0.06827386546383385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 752.5294117647057, 141, 1434, 1109.0, 1288.3999999999999, 1434.0, 1434.0, 0.08738697522836272, 15.124211589569079, 0.047041782218806706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=220b6e91-0559-431b-a6b5-617a682ec397", 1, 0, 0.0, 759.0, 759, 759, 759.0, 759.0, 759.0, 759.0, 1.3175230566534915, 0.2380290678524374, 0.9083703886693018], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 625.4166666666666, 258, 1335, 533.5, 1245.6000000000004, 1335.0, 1335.0, 0.07058366811559252, 0.012751932227914665, 0.04866413055625812], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 460.1875, 283, 1845, 291.5, 1161.8000000000006, 1845.0, 1845.0, 0.09761990469856804, 7.441045061119212, 0.21798839314586244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 741.0000000000001, 197, 1599, 561.0, 1582.4, 1597.4, 1599.0, 0.09304757389528161, 0.05715519919934778, 0.04207131514991736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 143.52941176470588, 140, 147, 144.0, 146.2, 147.0, 147.0, 0.08738697522836272, 0.06494285952029691, 0.04386416530017426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 235.70588235294122, 139, 556, 145.0, 461.5999999999999, 556.0, 556.0, 0.08738787364741564, 0.10059043038527772, 0.04552121083609633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0db6430f-fa3b-4876-8455-ce053c55fe30", 3, 0, 0.0, 419.33333333333337, 271, 713, 274.0, 713.0, 713.0, 713.0, 0.01906202146383617, 0.02253066404140271, 0.012224017670493897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e130258-753e-42b4-81b3-d9cceb3a94c9", 3, 0, 0.0, 507.66666666666663, 295, 913, 315.0, 913.0, 913.0, 913.0, 0.08258320257659592, 0.03736674856167589, 0.0529586292564759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb7adf76-6574-46a0-99b4-91aeab94a508", 1, 0, 0.0, 1037.0, 1037, 1037, 1037.0, 1037.0, 1037.0, 1037.0, 0.9643201542912248, 0.17421799662487947, 0.664853543876567], "isController": false}, {"data": ["login", 21, 0, 0.0, 3407.380952380952, 1830, 5582, 3386.0, 4949.6, 5527.4, 5582.0, 0.08899775810409348, 25.472922266550402, 0.16941607273023931], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/220b6e91-0559-431b-a6b5-617a682ec397", 3, 0, 0.0, 582.3333333333333, 237, 1123, 387.0, 1123.0, 1123.0, 1123.0, 0.04364144191324081, 0.03638207445957348, 0.02798621112274883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 173.78260869565216, 142, 455, 147.0, 328.4000000000004, 451.19999999999993, 455.0, 0.11560751750448607, 0.093592414073456, 0.04109485973792278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1067.7058823529412, 283, 1817, 1423.0, 1803.4, 1817.0, 1817.0, 0.08732278611054038, 61.50773163813694, 0.18324843172128621], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c37dd028-0071-47a4-a088-43eaf2e8b958", 3, 0, 0.0, 331.3333333333333, 232, 498, 264.0, 498.0, 498.0, 498.0, 0.021851236780001747, 0.026211525890073712, 0.0140126746278006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 650.9166666666666, 287, 1822, 573.0, 1693.0000000000005, 1822.0, 1822.0, 0.07114146480276029, 14.276866926184802, 0.15696511993265275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1772.0, 1618, 1871, 1796.0, 1871.0, 1871.0, 1871.0, 0.05619619214602019, 67.2301827640659, 0.1267158277980084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41225421-1a0d-4d9f-8dbd-3005203542aa", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1162.9545454545455, 337, 3028, 1223.0, 1998.7999999999997, 2898.999999999998, 3028.0, 0.0910731731549403, 0.0286544145650842, 0.04108965429451408], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 412.0869565217391, 284, 1442, 289.0, 582.2, 1270.1999999999975, 1442.0, 0.1165938377622094, 6.23748319211116, 0.26092524655794713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 147.6, 141, 163, 147.0, 160.0, 163.0, 163.0, 0.09826271519534628, 0.07628794783232451, 0.03492932454209575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f76d2e65-1775-4df3-b616-5c281225b1c5", 1, 0, 0.0, 1335.0, 1335, 1335, 1335.0, 1335.0, 1335.0, 1335.0, 0.7490636704119851, 0.13532888576779026, 0.5164442883895132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff3d4fe3-0c80-4870-aed7-d7254069d2bc", 3, 0, 0.0, 743.6666666666667, 299, 1398, 534.0, 1398.0, 1398.0, 1398.0, 0.02622308855537005, 0.026299914010122112, 0.016816238429062175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 491.7619047619047, 285, 1668, 293.0, 879.4000000000001, 1590.099999999999, 1668.0, 0.11135385072220925, 6.508069177254121, 0.24908070933728552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 171.69999999999996, 140, 429, 143.0, 400.7000000000001, 429.0, 429.0, 0.05942512137581041, 0.044162614616202855, 0.029828625378092336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=968e74cd-15ec-4e8c-996b-36aeff216072", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7085516d-328b-4630-b9de-5e8c07e87fd5", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=929796b2-4482-4a6f-aca5-6518ff98bfe3", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.2956858633387889, 1.1284011865793782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 169.5, 139, 420, 141.0, 392.60000000000014, 420.0, 420.0, 0.05942512137581041, 0.01590086255563677, 0.03389088953464187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 170.89999999999998, 139, 430, 142.0, 401.60000000000014, 430.0, 430.0, 0.05942406199118147, 0.01601664170856063, 0.03493484894403442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6b71dcf-126f-4b16-9b0b-e618c5551088", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.9676846590909091, 1.8081202651515151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 169.9, 138, 419, 142.5, 392.10000000000014, 419.0, 419.0, 0.05932781584645962, 0.015990700364866068, 0.0349362040580226], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1618.8965517241381, 1111, 2424, 1570.0, 2239.5, 2302.35, 2424.0, 0.2476399485933624, 296.2634720935396, 0.48899216411697144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49614b6e-3ed6-4a6e-a0ab-3d95fb2e81ed", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.5946665502793296, 1.1111353584729982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1162.9545454545455, 337, 3028, 1223.0, 1998.7999999999997, 2898.999999999998, 3028.0, 0.08734213900898433, 0.027480516747855153, 0.0394063166231941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 184.2857142857143, 140, 433, 143.0, 433.0, 433.0, 433.0, 0.03734050270985363, 0.010064432371015236, 0.021988596810587634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 221.57142857142856, 140, 423, 142.0, 423.0, 423.0, 423.0, 0.0372862035720183, 0.010049797056520558, 0.021920209521831074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 198.13333333333333, 139, 434, 144.0, 422.0, 434.0, 434.0, 0.09978247420623042, 0.026894495000898043, 0.05866118112514718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 264.40000000000003, 139, 556, 146.0, 491.80000000000007, 556.0, 556.0, 0.0997811466849377, 0.026894137192424613, 0.05875784321388421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 142.71428571428572, 140, 147, 142.0, 147.0, 147.0, 147.0, 0.037340303523324354, 0.009991448403702025, 0.02129564185314592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 182.39999999999998, 140, 434, 145.0, 431.6, 434.0, 434.0, 0.09978247420623042, 0.07415474889740366, 0.05008612474804925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 145.42857142857142, 141, 153, 145.0, 153.0, 153.0, 153.0, 0.03734090108928743, 0.027750415750925524, 0.01874338199208373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 199.66666666666666, 138, 433, 145.0, 430.0, 433.0, 433.0, 0.09978247420623042, 0.026699607355963998, 0.05690719232074078], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 814.5833333333334, 457, 1581, 669.0, 1526.1000000000001, 1581.0, 1581.0, 0.07017584898157299, 0.012678253966397464, 0.047766178457183964], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 148.71428571428572, 142, 156, 148.0, 156.0, 156.0, 156.0, 0.03746280478667608, 0.029487324861387623, 0.013316856389013764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1789.2380952380952, 1073, 3079, 1639.0, 2831.8, 3061.7, 3079.0, 0.09128132905615105, 0.04724521914039068, 0.04198584568891323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 410.7142857142857, 285, 578, 297.0, 578.0, 578.0, 578.0, 0.037257824143070044, 0.05774235050298063, 0.08379371972801788], "isController": false}, {"data": ["addBook", 63, 7, 11.11111111111111, 1383.0476190476193, 725, 3089, 1158.0, 2354.4, 2555.2, 3089.0, 0.29049795037557236, 83.82508565078457, 1.058580258992756], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 246.94827586206895, 139, 588, 146.0, 566.1, 586.05, 588.0, 0.24872954949932458, 0.18484686246971288, 0.1202354755880524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49a9091f-8574-4af5-99e0-d3d0149afb30", 3, 0, 0.0, 343.3333333333333, 248, 469, 313.0, 469.0, 469.0, 469.0, 0.01999973333688884, 0.027571246966707107, 0.012825349828668951], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 944.2413793103445, 691, 1301, 856.5, 1263.8, 1279.45, 1301.0, 0.24863465281171496, 73.10684337410085, 0.12504574824026682], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 187.3793103448276, 138, 437, 144.5, 419.1, 422.5, 437.0, 0.24922118380062305, 0.44100467289719625, 0.12120327102803738], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1367.8965517241375, 970, 1866, 1406.5, 1719.1, 1735.5499999999997, 1866.0, 0.24827810572366646, 223.40107595651278, 0.12462397103707476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 162.33333333333334, 140, 424, 148.0, 165.8, 398.2999999999996, 424.0, 0.10579185201231216, 0.07903395194279181, 0.03760569739500159], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 7, 3.8043478260869565, 221.02717391304347, 140, 1254, 151.5, 368.5, 458.0, 1038.1000000000015, 0.7573948908775078, 1.5616566456770864, 0.36604311079370044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 233.4, 143, 435, 150.0, 434.7, 435.0, 435.0, 0.05486998556919379, 0.042492088433955744, 0.019504565182799357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 148.16666666666669, 141, 158, 147.0, 157.4, 158.0, 158.0, 0.07195538765965101, 0.05839348354020507, 0.02557789170714157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb7adf76-6574-46a0-99b4-91aeab94a508", 3, 0, 0.0, 489.0, 338, 625, 504.0, 625.0, 625.0, 625.0, 0.028313105192623495, 0.028396053742992505, 0.01815651602521754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 373.2, 284, 860, 288.5, 830.6000000000001, 860.0, 860.0, 0.05927717413855447, 0.09186804234168548, 0.13331575394637785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 487.2666666666667, 287, 859, 561.0, 850.6, 859.0, 859.0, 0.09968764537781619, 0.1544963800923772, 0.22419985088389713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c815242a-864b-4bcb-b51b-12de5ddaf1d2", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.8470449270557029, 1.5827047413793103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0db6430f-fa3b-4876-8455-ce053c55fe30", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 167.18750000000003, 144, 445, 148.0, 246.20000000000022, 445.0, 445.0, 0.09609205618982987, 0.07967007393082573, 0.03415772309872858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41225421-1a0d-4d9f-8dbd-3005203542aa", 3, 0, 0.0, 776.3333333333333, 275, 1581, 473.0, 1581.0, 1581.0, 1581.0, 0.04108125872976748, 0.026411291012789967, 0.026344426984909484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 184.8235294117647, 141, 444, 149.0, 441.6, 444.0, 444.0, 0.08913403661835952, 0.0692007413199178, 0.031684364579182486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c37dd028-0071-47a4-a088-43eaf2e8b958", 1, 0, 0.0, 568.0, 568, 568, 568.0, 568.0, 568.0, 568.0, 1.7605633802816902, 0.31807053257042256, 1.2138259242957747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 173.14285714285714, 141, 461, 145.0, 367.8000000000002, 456.8999999999999, 461.0, 0.11143953343982001, 0.08281785639424122, 0.05593742205865965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 221.9047619047619, 140, 431, 144.0, 428.4, 430.9, 431.0, 0.11144130757800891, 0.037789714232646994, 0.06311068841541075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 248.57142857142856, 138, 1522, 144.0, 429.4, 1412.7999999999984, 1522.0, 0.11143835071240946, 4.8034831532409985, 0.06505752673193771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 270.2380952380952, 139, 1116, 145.0, 434.8, 1047.8999999999992, 1116.0, 0.11144189896995844, 1.588969523957355, 0.06516842817834949], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 46.15384615384615, 0.4434589800443459], "isController": false}, {"data": ["401/Unauthorized", 7, 53.84615384615385, 0.5173688100517368], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1353, 13, "401/Unauthorized", 7, "406/Not Acceptable", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
