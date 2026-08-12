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

    var data = {"OkPercent": 97.99554565701558, "KoPercent": 2.0044543429844097};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7393107849393746, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0131528b-45a3-432f-8047-780d8d0f0eb9"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0f89059-3f29-4383-85b1-909cc2fcb2a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27941b8e-2144-49c8-9f5c-eefbe4b832ef"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/48e6abd0-dda3-40e2-b39e-5335efedd8e9"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/0ed23899-e6e6-4f31-9a2e-81b139f7d8aa"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d87b50ab-44e0-4b66-b342-980f1f12e020"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb3addc9-b54f-44ac-8414-03f16c77fa03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9e041fe-09a9-4d6b-b747-7bc2844721c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f280438-537b-4074-af6d-be622abafd79"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/395021b1-30a4-49fb-ba55-622b5fdf92fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/349bdfeb-55c1-4b59-851a-384f0cba558a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4ff56e8-c9a2-46b9-a068-a26272aa9919"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43828519-026d-4390-80e2-8ebbddbfb998"], "isController": false}, {"data": [0.34375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b0f89059-3f29-4383-85b1-909cc2fcb2a1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb3addc9-b54f-44ac-8414-03f16c77fa03"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ed23899-e6e6-4f31-9a2e-81b139f7d8aa"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35344827586206895, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48e6abd0-dda3-40e2-b39e-5335efedd8e9"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0131528b-45a3-432f-8047-780d8d0f0eb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e7c3b13-6afc-4933-8132-5402f3f7cf7c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e9e8331-a9be-45d0-8c84-397ed0e4092c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4ff56e8-c9a2-46b9-a068-a26272aa9919"], "isController": false}, {"data": [0.2786885245901639, 500, 1500, "addBook"], "isController": true}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4396551724137931, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9e041fe-09a9-4d6b-b747-7bc2844721c9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/43828519-026d-4390-80e2-8ebbddbfb998"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15aaced3-51db-489b-a757-9dc53df5fc3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f280438-537b-4074-af6d-be622abafd79"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6e9e8331-a9be-45d0-8c84-397ed0e4092c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=349bdfeb-55c1-4b59-851a-384f0cba558a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=395021b1-30a4-49fb-ba55-622b5fdf92fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1347, 27, 2.0044543429844097, 448.110616184112, 125, 4096, 149.0, 1266.0, 1484.7999999999988, 2014.2799999999993, 5.304089307160718, 747.7227180073734, 3.8767287450040357], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2158.224137931034, 1550, 2979, 2110.0, 2549.8, 2648.2999999999997, 2979.0, 0.24740544206660323, 297.7120886817876, 1.216490625786472], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0131528b-45a3-432f-8047-780d8d0f0eb9", 3, 0, 0.0, 439.66666666666663, 234, 712, 373.0, 712.0, 712.0, 712.0, 0.08964054142887024, 0.04056001060746407, 0.05748433158036275], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 603.3571428571428, 137, 1375, 546.0, 1181.5, 1375.0, 1375.0, 0.09114583333333334, 0.017954508463541668, 0.06132761637369792], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 603.3571428571428, 137, 1375, 546.0, 1181.5, 1375.0, 1375.0, 0.09029461844074094, 0.01778683052990042, 0.06075487510319385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0f89059-3f29-4383-85b1-909cc2fcb2a1", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 163.625, 126, 392, 131.5, 383.6, 392.0, 392.0, 0.1311249702919989, 0.04739514612238877, 0.07409393157735143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 133.31249999999997, 127, 147, 132.5, 142.8, 147.0, 147.0, 0.13112174654166392, 0.0974449698419983, 0.06581697043204615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 236.49999999999997, 128, 1034, 133.0, 584.6000000000005, 1034.0, 1034.0, 0.131123895690941, 2.4428068043057807, 0.07651028093294651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27941b8e-2144-49c8-9f5c-eefbe4b832ef", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 203.9375, 127, 1287, 131.5, 483.40000000000083, 1287.0, 1287.0, 0.1311260449106704, 7.407349012969186, 0.07638348221603015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48e6abd0-dda3-40e2-b39e-5335efedd8e9", 3, 0, 0.0, 490.3333333333333, 310, 688, 473.0, 688.0, 688.0, 688.0, 0.035001341718099196, 0.029179178431006522, 0.02244552187000502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ed23899-e6e6-4f31-9a2e-81b139f7d8aa", 3, 0, 0.0, 1560.0, 969, 2388, 1323.0, 2388.0, 2388.0, 2388.0, 0.045868052901154345, 0.02948873843742833, 0.029414083403409525], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 437.4285714285714, 130, 1323, 366.5, 1134.5, 1323.0, 1323.0, 0.09214527360564456, 0.15988516189595484, 0.059557624527755475], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 212.125, 127, 403, 133.0, 394.6, 403.0, 403.0, 0.12398775620907436, 0.0921432446045953, 0.06223604169088303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 163.375, 127, 393, 132.0, 389.5, 393.0, 393.0, 0.1239896778593182, 0.056455261037018666, 0.06941121370395914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 929.0, 776, 1169, 912.0, 1169.0, 1169.0, 1169.0, 0.03734631989363768, 10.981058063257196, 0.02129907306434024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1305.6, 1126, 1684, 1164.0, 1684.0, 1684.0, 1684.0, 0.03724172861207526, 33.51017286912139, 0.02120305447347644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 328.2, 131, 511, 403.0, 511.0, 511.0, 511.0, 0.037436638489356765, 0.06624530170186958, 0.02072907619479032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 177.0769230769231, 128, 397, 132.0, 394.6, 397.0, 397.0, 0.09986479842674532, 0.07421592929956368, 0.05012744764779991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 229.38461538461542, 127, 393, 132.0, 393.0, 393.0, 393.0, 0.10007313036449712, 0.02677738058581271, 0.05707295716100227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d87b50ab-44e0-4b66-b342-980f1f12e020", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.7513786764705882, 1.403952205882353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb3addc9-b54f-44ac-8414-03f16c77fa03", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 229.0, 128, 393, 132.0, 393.0, 393.0, 393.0, 0.10007236001416409, 0.026972628285067662, 0.058831602273951934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 170.30769230769232, 127, 394, 130.0, 392.0, 394.0, 394.0, 0.1000685084403938, 0.026971590165574894, 0.05892706112261471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9e041fe-09a9-4d6b-b747-7bc2844721c9", 3, 0, 0.0, 435.0, 360, 553, 392.0, 553.0, 553.0, 553.0, 0.015870076969873304, 0.021878182281059064, 0.01017710014018568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 183.0, 129, 391, 132.0, 391.0, 391.0, 391.0, 0.037531056949625816, 0.027891732752602778, 0.02107456811136215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 997.8124999999999, 128, 1694, 1399.0, 1604.4, 1694.0, 1694.0, 0.07191108194717233, 40.44834207034252, 0.0384134392823274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 354.25, 127, 1427, 131.5, 1154.7000000000003, 1427.0, 1427.0, 0.12374227577512936, 13.947123016256644, 0.07141766111631001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 666.0625000000001, 131, 1139, 850.5, 1072.5, 1139.0, 1139.0, 0.07191075874839324, 13.222362532472202, 0.03848349198644482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 348.1875, 125, 1173, 256.0, 1079.2, 1173.0, 1173.0, 0.12374227577512936, 4.577225572501373, 0.07153850318249666], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 460.8571428571429, 134, 720, 530.0, 712.5, 720.0, 720.0, 0.0902428176386033, 0.017776626465640048, 0.06129914607733809], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 429.53846153846155, 257, 791, 267.0, 788.6, 791.0, 791.0, 0.09976287132891819, 0.15461296562401677, 0.2243690358110338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 528.7619047619047, 141, 1127, 423.0, 1057.2, 1120.1, 1127.0, 0.09029073617046891, 0.05546179008908686, 0.04082481528020225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 162.99999999999997, 129, 381, 132.0, 380.3, 381.0, 381.0, 0.07191075874839324, 0.053441491608913344, 0.03609583007487708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 210.6875, 126, 393, 132.5, 391.6, 393.0, 393.0, 0.07191011235955055, 0.08674508426966292, 0.037236657303370786], "isController": false}, {"data": ["login", 21, 0, 0.0, 3181.571428571428, 1746, 4876, 2912.0, 4770.2, 4868.2, 4876.0, 0.09138977740061362, 26.157565598004656, 0.17396951906129643], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 157.74999999999997, 130, 420, 137.5, 247.1000000000002, 420.0, 420.0, 0.12274739353581537, 0.09937264574335056, 0.04363286254593438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f280438-537b-4074-af6d-be622abafd79", 3, 0, 0.0, 401.6666666666667, 224, 504, 477.0, 504.0, 504.0, 504.0, 0.11648223645894001, 0.05407020481459911, 0.07469726752086973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/395021b1-30a4-49fb-ba55-622b5fdf92fe", 3, 0, 0.0, 1372.6666666666667, 572, 2600, 946.0, 2600.0, 2600.0, 2600.0, 0.02955053634223461, 0.029637110179174753, 0.01895005097467519], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/349bdfeb-55c1-4b59-851a-384f0cba558a", 3, 0, 0.0, 414.6666666666667, 357, 485, 402.0, 485.0, 485.0, 485.0, 0.026574306189155912, 0.022153905647925874, 0.017041465883019902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4ff56e8-c9a2-46b9-a068-a26272aa9919", 3, 0, 0.0, 340.3333333333333, 264, 482, 275.0, 482.0, 482.0, 482.0, 0.02614538577516711, 0.0262219835850553, 0.01676640949774714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43828519-026d-4390-80e2-8ebbddbfb998", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1162.2499999999998, 261, 1827, 1532.0, 1736.7, 1827.0, 1827.0, 0.07186779918340214, 53.77856359008853, 0.150139833401458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0f89059-3f29-4383-85b1-909cc2fcb2a1", 3, 0, 0.0, 474.0, 298, 565, 559.0, 565.0, 565.0, 565.0, 0.047766136993280896, 0.030709023620354745, 0.03063127925675891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 387.87499999999994, 257, 1417, 269.5, 795.4000000000007, 1417.0, 1417.0, 0.13097898605892416, 9.983830042997946, 0.2924802968720581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 888.2222222222222, 130, 2076, 1256.0, 2076.0, 2076.0, 2076.0, 0.0669702652022502, 44.518919797526564, 0.10361642920126797], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1141.4166666666667, 366, 1825, 1122.5, 1764.0, 1814.0, 1825.0, 0.09561105423138672, 0.02987845444730835, 0.04313701860830143], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bb3addc9-b54f-44ac-8414-03f16c77fa03", 3, 0, 0.0, 349.3333333333333, 227, 484, 337.0, 484.0, 484.0, 484.0, 0.0663907761081727, 0.030040097262487, 0.0425748141058269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 625.4375000000001, 262, 1819, 512.0, 1640.5000000000002, 1819.0, 1819.0, 0.12361225924581071, 18.653032580521796, 0.2740534487820329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 152.39999999999998, 129, 392, 134.0, 247.4000000000001, 392.0, 392.0, 0.10723477266228196, 0.08325355885401774, 0.03811861059479554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ed23899-e6e6-4f31-9a2e-81b139f7d8aa", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 596.7142857142858, 260, 1823, 394.0, 1695.5, 1823.0, 1823.0, 0.08920265569049228, 15.363838318593656, 0.19735838680182993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 17, 0, 0.0, 178.00000000000003, 129, 399, 132.0, 393.4, 399.0, 399.0, 0.07947824867341453, 0.05906537816451997, 0.03989435529114752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 17, 0, 0.0, 176.9411764705882, 126, 396, 131.0, 392.8, 396.0, 396.0, 0.07947713396104686, 0.02126634248567074, 0.04532680296215953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 17, 0, 0.0, 193.64705882352942, 127, 413, 132.0, 398.59999999999997, 413.0, 413.0, 0.07947750552836177, 0.021421671411941262, 0.04672408039850957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 17, 0, 0.0, 145.23529411764704, 128, 389, 130.0, 184.99999999999983, 389.0, 389.0, 0.07947713396104686, 0.02142157126293841, 0.046801476346202395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 143.5, 134, 153, 143.5, 153.0, 153.0, 153.0, 0.0716358035746266, 0.021126965507360578, 0.0442826793581432], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1445.4827586206898, 1006, 2435, 1380.5, 2003.0000000000002, 2106.0499999999997, 2435.0, 0.253229771089019, 302.95084313507186, 0.5000298800214809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1141.4166666666667, 366, 1825, 1122.5, 1764.0, 1814.0, 1825.0, 0.09484141724691172, 0.029637942889659916, 0.0427897800469465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 151.41666666666666, 127, 377, 131.5, 304.10000000000025, 377.0, 377.0, 0.05447562669668879, 0.014682883758091899, 0.03207890908017904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 174.49999999999994, 127, 393, 132.0, 392.1, 393.0, 393.0, 0.05447513210219535, 0.014682750449419841, 0.03202541945851719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48e6abd0-dda3-40e2-b39e-5335efedd8e9", 1, 0, 0.0, 720.0, 720, 720, 720.0, 720.0, 720.0, 720.0, 1.3888888888888888, 0.2509223090277778, 0.9575737847222222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 286.93333333333334, 127, 1170, 135.0, 703.2000000000003, 1170.0, 1170.0, 0.10580965548376174, 6.37379867464589, 0.06159830334217432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 257.73333333333335, 125, 775, 132.0, 545.2000000000002, 775.0, 775.0, 0.10580965548376174, 2.100721203020513, 0.06170163308385768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 173.16666666666669, 127, 390, 131.0, 387.3, 390.0, 390.0, 0.05447587399730345, 0.01457655222193471, 0.03106827188908712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 150.2, 128, 394, 131.0, 247.60000000000008, 394.0, 394.0, 0.10581114826258095, 0.07863504280060947, 0.053112236530240824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 156.25, 128, 399, 132.0, 323.7000000000003, 399.0, 399.0, 0.05447068115586785, 0.040480652694936954, 0.02734172862706648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0131528b-45a3-432f-8047-780d8d0f0eb9", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 181.86666666666667, 126, 405, 131.0, 388.2, 405.0, 405.0, 0.10580890911014708, 0.038906817620710334, 0.05975172380347759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 178.08333333333334, 129, 395, 135.5, 393.2, 395.0, 395.0, 0.054620433504173914, 0.042992255277699384, 0.01941585722218682], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 561.4999999999999, 132, 1274, 508.0, 1121.5, 1274.0, 1274.0, 0.09030626725494749, 0.017436366333823568, 0.061455632208375265], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1779.666666666667, 1171, 4096, 1508.0, 3192.2000000000007, 4027.099999999999, 4096.0, 0.09058244512213533, 0.0468834921042302, 0.04166438637941967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 373.58333333333337, 262, 792, 267.5, 710.7000000000003, 792.0, 792.0, 0.05443806309371512, 0.08436836536106046, 0.12243247978986908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e7c3b13-6afc-4933-8132-5402f3f7cf7c", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.8748929794520548, 1.6347388698630136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e9e8331-a9be-45d0-8c84-397ed0e4092c", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4ff56e8-c9a2-46b9-a068-a26272aa9919", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["addBook", 61, 11, 18.0327868852459, 1315.5245901639346, 665, 3739, 1067.0, 2269.6000000000004, 2330.7, 3739.0, 0.2696752402762182, 85.6447143031216, 0.9800163324830458], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 220.89655172413794, 127, 538, 133.0, 527.0, 535.1, 538.0, 0.2543792707209459, 0.1890455322447655, 0.12296654199889477], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 802.586206896552, 626, 1275, 775.0, 1039.7, 1161.45, 1275.0, 0.2543056578624294, 74.77430715410046, 0.12789786503823353], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 188.6896551724138, 128, 531, 133.0, 392.2, 398.1, 531.0, 0.25486775439537024, 0.45099645601993243, 0.1239493571180609], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1222.98275862069, 873, 1901, 1242.0, 1546.2, 1576.4499999999998, 1901.0, 0.25386709619812137, 228.43005940982465, 0.12742938227132264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 171.57142857142856, 129, 410, 135.0, 395.5, 410.0, 410.0, 0.08818508790163583, 0.06588046117651505, 0.03134704296503461], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 11, 6.111111111111111, 198.21666666666667, 128, 2147, 137.0, 328.6000000000001, 415.1499999999998, 852.6199999999964, 0.7573844988639232, 1.611513033324918, 0.3639447832512834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 17, 0, 0.0, 183.64705882352945, 130, 455, 136.0, 403.79999999999995, 455.0, 455.0, 0.08108365925784604, 0.06279232596823428, 0.02882270700181246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9e041fe-09a9-4d6b-b747-7bc2844721c9", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43828519-026d-4390-80e2-8ebbddbfb998", 3, 0, 0.0, 601.0, 226, 1274, 303.0, 1274.0, 1274.0, 1274.0, 0.019445794846864366, 0.026807598039215685, 0.012470122346459245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 140.125, 129, 185, 136.0, 166.10000000000002, 185.0, 185.0, 0.13185110713726525, 0.10700026370221427, 0.04686894824019975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15aaced3-51db-489b-a757-9dc53df5fc3c", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f280438-537b-4074-af6d-be622abafd79", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 17, 0, 0.0, 373.5294117647059, 262, 793, 266.0, 789.8, 793.0, 793.0, 0.0794284886627513, 0.1230986440505726, 0.17863653260773074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e9e8331-a9be-45d0-8c84-397ed0e4092c", 3, 0, 0.0, 804.6666666666666, 395, 1507, 512.0, 1507.0, 1507.0, 1507.0, 0.04122634638376232, 0.03436870868776539, 0.026437468221357993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 505.3333333333332, 256, 1300, 509.0, 999.4000000000002, 1300.0, 1300.0, 0.10571197011874978, 8.58412855896966, 0.23594553851439443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=349bdfeb-55c1-4b59-851a-384f0cba558a", 1, 0, 0.0, 705.0, 705, 705, 705.0, 705.0, 705.0, 705.0, 1.4184397163120568, 0.2562610815602837, 0.9779476950354611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 136.15384615384613, 132, 159, 134.0, 150.6, 159.0, 159.0, 0.0969787392763894, 0.08040522426333457, 0.03447291122715405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=395021b1-30a4-49fb-ba55-622b5fdf92fe", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 141.5, 128, 208, 135.0, 173.00000000000003, 208.0, 208.0, 0.07245556436091928, 0.05625212272161214, 0.025755688893920527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 186.5, 126, 394, 132.0, 392.0, 394.0, 394.0, 0.09002462816613402, 0.06690306839299608, 0.04518814343495399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 185.5, 125, 393, 131.5, 391.0, 393.0, 393.0, 0.08987148377819719, 0.04333089396448793, 0.050176573392905294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 388.35714285714283, 125, 1432, 137.0, 1428.0, 1432.0, 1432.0, 0.08927603512374296, 11.496444203275155, 0.051388521333783965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 324.7142857142858, 130, 1038, 134.5, 970.5, 1038.0, 1038.0, 0.08957821457821458, 3.7834048759341727, 0.05164993873489967], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 29.62962962962963, 0.5939123979213066], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.14847809948032664], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.14847809948032664], "isController": false}, {"data": ["401/Unauthorized", 15, 55.55555555555556, 1.1135857461024499], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1347, 27, "401/Unauthorized", 15, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
