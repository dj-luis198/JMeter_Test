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

    var data = {"OkPercent": 67.84565916398714, "KoPercent": 32.154340836012864};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5172004744958482, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60dd2303-fc78-4c4a-8ffb-23f785761205"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e601ff8a-77a7-4f2f-b98c-94c2804ade7a"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60dd2303-fc78-4c4a-8ffb-23f785761205"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75d5deba-bf52-48fb-b77e-3fc93d23abbe"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b57d43de-a45b-4bc0-bb04-15708f22f1fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d37f20c-08ac-4380-9dc2-369b5e9fc88c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75d5deba-bf52-48fb-b77e-3fc93d23abbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1ca2f8f-7408-497a-baf1-77161bd904e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9447513812154696, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f1ca2f8f-7408-497a-baf1-77161bd904e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ac4649e-93d5-4a0b-8157-c224ca4dee67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/558bb502-dc19-41e2-99e3-f17d3f7d61ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d37f20c-08ac-4380-9dc2-369b5e9fc88c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67c58924-63ca-4973-9440-46ea6c2dfb85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ac4649e-93d5-4a0b-8157-c224ca4dee67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cc19b7b-cad8-41a8-98c5-012b71d81471"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=854ac474-64eb-4dae-84b4-a084422ff86c"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bb8f3343-ff0f-4881-ad46-6459493ee394"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da588508-9d9e-43dc-9552-98b373968532"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/683dc8f3-ce9b-4aaa-97c6-33db5d5d5ceb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=683dc8f3-ce9b-4aaa-97c6-33db5d5d5ceb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e601ff8a-77a7-4f2f-b98c-94c2804ade7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3172ea67-4ad9-47a3-84b7-274415b442a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f2eb109d-f09e-497f-877d-a3dcffc611da"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67c58924-63ca-4973-9440-46ea6c2dfb85"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da588508-9d9e-43dc-9552-98b373968532"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/854ac474-64eb-4dae-84b4-a084422ff86c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2cc19b7b-cad8-41a8-98c5-012b71d81471"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afc5afc0-a3bf-4f7c-968d-6a6ea0e7aebd"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3172ea67-4ad9-47a3-84b7-274415b442a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2eb109d-f09e-497f-877d-a3dcffc611da"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 622, 200, 32.154340836012864, 256.508038585209, 82, 3372, 89.0, 618.5000000000007, 1011.5000000000002, 1871.6099999999983, 2.42698558245703, 2.511204262344655, 1.1639263905417796], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/60dd2303-fc78-4c4a-8ffb-23f785761205", 3, 0, 0.0, 239.0, 171, 350, 196.0, 350.0, 350.0, 350.0, 0.04104472506874991, 0.034217298470399914, 0.02632099882338455], "isController": false}, {"data": ["see books", 57, 57, 100.0, 495.35087719298235, 333, 856, 514.0, 622.6, 816.6999999999998, 856.0, 0.2679314283565462, 1.7223710770960932, 0.4497794192821318], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, 100.0, 117.73333333333333, 82, 259, 83.0, 255.4, 259.0, 259.0, 0.07752098234588828, 0.03853337891997767, 0.03891189934158845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 133.41666666666666, 84, 298, 89.5, 285.40000000000003, 298.0, 298.0, 0.08190343584913387, 0.06358714013677873, 0.029114111961996803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 21, 100.0, 93.14285714285714, 82, 246, 86.0, 92.4, 230.6999999999998, 246.0, 0.1044106021508584, 0.05189941063944036, 0.0524092280327551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 3.429324127906977, 7.18795421511628], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, 100.0, 170.89473684210532, 82, 584, 87.0, 346.0, 555.1999999999998, 584.0, 0.2548966997585189, 0.12670158220418568, 0.12321666638717467], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 566.7857142857142, 86, 1479, 431.5, 1307.5, 1479.0, 1479.0, 0.10558069381598793, 0.019936309860482657, 0.07140100631598793], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 566.7857142857142, 86, 1479, 431.5, 1307.5, 1479.0, 1479.0, 0.11121614858477451, 0.021000426494069795, 0.07521209267085581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e601ff8a-77a7-4f2f-b98c-94c2804ade7a", 3, 0, 0.0, 250.0, 168, 410, 172.0, 410.0, 410.0, 410.0, 0.03364511136531862, 0.028048544989121415, 0.021575803837785703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 897.3913043478262, 195, 1893, 841.0, 1580.4000000000008, 1874.3999999999996, 1893.0, 0.09201214560321963, 0.029128845007540993, 0.0415132922545776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 113.00000000000001, 84, 301, 86.5, 301.0, 301.0, 301.0, 0.04211989427906536, 0.03315296366106121, 0.014972306169511515], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 394.7142857142857, 86, 564, 387.5, 544.0, 564.0, 564.0, 0.1102805063450677, 0.022416112966624394, 0.0743947249486014], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1387.8636363636367, 709, 3189, 1268.0, 2050.2, 3019.3499999999976, 3189.0, 0.09881778001365482, 0.05114592129612994, 0.04545231873674943], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 225.0, 84, 443, 202.0, 407.0, 443.0, 443.0, 0.09950974863837493, 0.2057700935059938, 0.06320423878359283], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60dd2303-fc78-4c4a-8ffb-23f785761205", 1, 0, 0.0, 828.0, 828, 828, 828.0, 828.0, 828.0, 828.0, 1.2077294685990339, 0.21819331219806765, 0.8326728562801933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, 100.0, 85.25, 83, 88, 85.0, 88.0, 88.0, 88.0, 0.04317556263155054, 0.021461290409628152, 0.02167210858654002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75d5deba-bf52-48fb-b77e-3fc93d23abbe", 3, 0, 0.0, 382.6666666666667, 177, 604, 367.0, 604.0, 604.0, 604.0, 0.08274264280001103, 0.037385022202609156, 0.05306087445183], "isController": false}, {"data": ["addBook", 62, 62, 100.0, 533.5806451612906, 341, 1199, 485.0, 699.0000000000001, 789.1999999999995, 1199.0, 0.27766830281967686, 0.8863841554964887, 0.5427757537350865], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b57d43de-a45b-4bc0-bb04-15708f22f1fa", 1, 0, 0.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 0.38707386363636365, 0.7232481060606061], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d37f20c-08ac-4380-9dc2-369b5e9fc88c", 3, 0, 0.0, 272.0, 175, 366, 275.0, 366.0, 366.0, 366.0, 0.0299547682998672, 0.03540552203672455, 0.019209275244380986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75d5deba-bf52-48fb-b77e-3fc93d23abbe", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1ca2f8f-7408-497a-baf1-77161bd904e2", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 94.19047619047618, 84, 249, 86.0, 91.6, 233.29999999999978, 249.0, 0.10110687960096484, 0.07553394813939268, 0.035940336108155474], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 612.9285714285714, 86, 3372, 412.0, 2100.0, 3372.0, 3372.0, 0.11148005701408631, 0.021050259091596794, 0.0762926087726842], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 9, 4.972375690607735, 144.8950276243093, 83, 941, 90.0, 251.8, 346.6, 870.4800000000006, 0.73337250055712, 1.5527939251129435, 0.35369997315694574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1ca2f8f-7408-497a-baf1-77161bd904e2", 3, 0, 0.0, 389.3333333333333, 201, 524, 443.0, 524.0, 524.0, 524.0, 0.01813444880342862, 0.024999801654466212, 0.011629187546469525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 129.33333333333334, 85, 259, 89.0, 257.5, 259.0, 259.0, 0.0962556550197324, 0.07454173284242949, 0.0342158773702955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ac4649e-93d5-4a0b-8157-c224ca4dee67", 3, 0, 0.0, 728.3333333333334, 281, 1500, 404.0, 1500.0, 1500.0, 1500.0, 0.022124546446797844, 0.03050047337310835, 0.014187941569072833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/558bb502-dc19-41e2-99e3-f17d3f7d61ac", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d37f20c-08ac-4380-9dc2-369b5e9fc88c", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 13, 100.0, 110.84615384615384, 83, 256, 86.0, 252.0, 256.0, 256.0, 0.08405697769903722, 0.04178222817266596, 0.04219266263408704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67c58924-63ca-4973-9440-46ea6c2dfb85", 3, 0, 0.0, 352.0, 247, 433, 376.0, 433.0, 433.0, 433.0, 0.0203796040922245, 0.024088002102495825, 0.013068951842995532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 93.35294117647058, 85, 143, 87.0, 116.59999999999998, 143.0, 143.0, 0.13017244019724955, 0.10563798613663511, 0.04627223460136604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ac4649e-93d5-4a0b-8157-c224ca4dee67", 1, 0, 0.0, 3372.0, 3372, 3372, 3372.0, 3372.0, 3372.0, 3372.0, 0.2965599051008304, 0.05357771723013049, 0.20446415332147094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cc19b7b-cad8-41a8-98c5-012b71d81471", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=854ac474-64eb-4dae-84b4-a084422ff86c", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 588.8181818181819, 156, 1722, 498.0, 1130.1999999999998, 1638.8999999999987, 1722.0, 0.09849614298058283, 0.06050202532694004, 0.044534877148447116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb8f3343-ff0f-4881-ad46-6459493ee394", 1, 0, 0.0, 1003.0, 1003, 1003, 1003.0, 1003.0, 1003.0, 1003.0, 0.9970089730807576, 0.31838079511465606, 0.5948950024925225], "isController": false}, {"data": ["login", 22, 5, 22.727272727272727, 2371.545454545455, 1513, 4639, 2216.5, 3211.4, 4429.449999999997, 4639.0, 0.10015888841844563, 0.1493935976845086, 0.15031836014859937], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/da588508-9d9e-43dc-9552-98b373968532", 3, 0, 0.0, 280.6666666666667, 160, 518, 164.0, 518.0, 518.0, 518.0, 0.028393495996517065, 0.023670489338242253, 0.01820806872172481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, 100.0, 85.75, 83, 90, 86.0, 89.4, 90.0, 90.0, 0.09053528990154287, 0.045002404843638016, 0.04544447168886039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 122.6, 84, 294, 86.0, 268.20000000000005, 294.0, 294.0, 0.07479245094861758, 0.06054974788711326, 0.026586379048141408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/683dc8f3-ce9b-4aaa-97c6-33db5d5d5ceb", 3, 0, 0.0, 311.3333333333333, 261, 405, 268.0, 405.0, 405.0, 405.0, 0.01690074194257128, 0.02329903715064758, 0.01083804089416192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 12, 100.0, 100.91666666666666, 82, 288, 84.0, 227.4000000000002, 288.0, 288.0, 0.07928118393234672, 0.03940832287262156, 0.03979543802854122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=683dc8f3-ce9b-4aaa-97c6-33db5d5d5ceb", 1, 0, 0.0, 756.0, 756, 756, 756.0, 756.0, 756.0, 756.0, 1.3227513227513228, 0.23897362764550265, 0.911975033068783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e601ff8a-77a7-4f2f-b98c-94c2804ade7a", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 101.00000000000001, 85, 256, 88.0, 189.59999999999994, 256.0, 256.0, 0.0869146631722515, 0.07206108304027492, 0.030895446674511273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3172ea67-4ad9-47a3-84b7-274415b442a6", 3, 0, 0.0, 358.0, 222, 471, 381.0, 471.0, 471.0, 471.0, 0.06465377901338333, 0.028622766750716577, 0.04146091948449387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2eb109d-f09e-497f-877d-a3dcffc611da", 3, 0, 0.0, 330.3333333333333, 202, 408, 381.0, 408.0, 408.0, 408.0, 0.20706791827719492, 0.09167069298729984, 0.13278769498895637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 21, 100.0, 104.80952380952382, 83, 349, 84.0, 214.40000000000012, 338.6999999999998, 349.0, 0.0993184860079171, 0.04936827087698223, 0.04985322442194277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 103.5238095238095, 84, 260, 86.0, 217.2000000000001, 258.7, 260.0, 0.09596928982725528, 0.07450740762955854, 0.03411408349328215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, 100.0, 124.47058823529412, 82, 256, 86.0, 252.8, 256.0, 256.0, 0.12434262977347699, 0.061807029838574015, 0.062414171585514815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 8, 100.0, 105.75, 84, 248, 86.0, 248.0, 248.0, 248.0, 0.10805700006753563, 0.05371192679138246, 0.06113820743567232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67c58924-63ca-4973-9440-46ea6c2dfb85", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da588508-9d9e-43dc-9552-98b373968532", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/854ac474-64eb-4dae-84b4-a084422ff86c", 3, 0, 0.0, 444.0, 383, 564, 385.0, 564.0, 564.0, 564.0, 0.024940765681506424, 0.02501383433096396, 0.015993915492372283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cc19b7b-cad8-41a8-98c5-012b71d81471", 3, 0, 0.0, 472.6666666666667, 175, 849, 394.0, 849.0, 849.0, 849.0, 0.0333000333000333, 0.027760867604617604, 0.02135451354201354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afc5afc0-a3bf-4f7c-968d-6a6ea0e7aebd", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 897.3913043478262, 195, 1893, 841.0, 1580.4000000000008, 1874.3999999999996, 1893.0, 0.09146911326660065, 0.028956933955323304, 0.04126829133707959], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3172ea67-4ad9-47a3-84b7-274415b442a6", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.101610137195122, 4.203982469512195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2eb109d-f09e-497f-877d-a3dcffc611da", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.020700918079096, 3.895215395480226], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.5, 0.8038585209003215], "isController": false}, {"data": ["401/Unauthorized", 11, 5.5, 1.7684887459807075], "isController": false}, {"data": ["404/Not Found", 184, 92.0, 29.581993569131832], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 622, 200, "404/Not Found", 184, "401/Unauthorized", 11, "406/Not Acceptable", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, "404/Not Found", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
