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

    var data = {"OkPercent": 98.25227963525836, "KoPercent": 1.7477203647416413};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7573481384715872, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c7ce3a7a-7359-44f5-9fe1-c013922334ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/acd7efed-6606-4088-b474-0279b0f5a0c8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ba4ba38-b809-440d-ac27-bdd924b580ff"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0d33367-fa89-465e-9ea5-e032a27b0026"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a63f679-bccd-481a-8f2e-8371884661dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/022713ed-3e64-4286-bb4c-8826034a60eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/97b019b0-3c99-4c73-ad5d-25f25152c87b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05263157894736842, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/12145ca2-d340-44ed-9c75-a793066afe1a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ed92f2cb-b2f5-459c-a571-40aad84d2ce9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92b3c5ee-ada3-4d3e-981f-235f23ab1406"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ba4ba38-b809-440d-ac27-bdd924b580ff"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8a827227-d641-46fa-830c-f2238551aba5"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f28fb56c-3410-48da-9e2f-4766da1c288a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f28fb56c-3410-48da-9e2f-4766da1c288a"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e438ff9-1689-48e2-9563-c63a01df153a"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a63f679-bccd-481a-8f2e-8371884661dc"], "isController": false}, {"data": [0.35964912280701755, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=093d6075-4915-444d-86dd-69351d949bef"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7ce3a7a-7359-44f5-9fe1-c013922334ff"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acd7efed-6606-4088-b474-0279b0f5a0c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.39473684210526316, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0d33367-fa89-465e-9ea5-e032a27b0026"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=022713ed-3e64-4286-bb4c-8826034a60eb"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9463276836158192, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6755bd1e-de7f-44e9-b0b1-1cfc13ce30c9"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97b019b0-3c99-4c73-ad5d-25f25152c87b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed92f2cb-b2f5-459c-a571-40aad84d2ce9"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/093d6075-4915-444d-86dd-69351d949bef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/92b3c5ee-ada3-4d3e-981f-235f23ab1406"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a827227-d641-46fa-830c-f2238551aba5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 23, 1.7477203647416413, 404.86322188449805, 127, 4765, 139.0, 1037.8999999999999, 1200.6499999999985, 1806.409999999998, 5.153105176599577, 706.0490777530053, 3.7723999836028663], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1954.5964912280704, 1556, 2563, 1905.0, 2305.0, 2393.7999999999997, 2563.0, 0.2530476706296004, 304.5020799783245, 1.2442334195508182], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 534.0714285714286, 133, 820, 562.0, 788.0, 820.0, 820.0, 0.07969261420236232, 0.01569837768606802, 0.05362129998576917], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 534.0714285714286, 133, 820, 562.0, 788.0, 820.0, 820.0, 0.07800225092209805, 0.015365398758649892, 0.05248393641145073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 149.85714285714286, 128, 391, 131.0, 263.0, 391.0, 391.0, 0.11232168931820734, 0.06620523679819001, 0.062037049108647165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7ce3a7a-7359-44f5-9fe1-c013922334ff", 3, 0, 0.0, 436.33333333333337, 229, 766, 314.0, 766.0, 766.0, 766.0, 0.02582422312128777, 0.025899880024963417, 0.01656045558233623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 135.42857142857144, 129, 177, 132.0, 156.0, 177.0, 177.0, 0.1123234916559692, 0.08347478237323491, 0.05638112764762516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 367.57142857142856, 128, 895, 261.0, 894.0, 895.0, 895.0, 0.11231808481619948, 7.1006245938497825, 0.06407207712241067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 350.85714285714283, 128, 1147, 133.5, 1145.5, 1147.0, 1147.0, 0.11231628265194789, 21.680011850872056, 0.06396136520441564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acd7efed-6606-4088-b474-0279b0f5a0c8", 3, 0, 0.0, 331.0, 253, 478, 262.0, 478.0, 478.0, 478.0, 0.017214074227088066, 0.02373099099990819, 0.011038973381303219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ba4ba38-b809-440d-ac27-bdd924b580ff", 3, 0, 0.0, 418.6666666666667, 238, 554, 464.0, 554.0, 554.0, 554.0, 0.04136960988457879, 0.026219606264737925, 0.026529339672076893], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 275.1333333333333, 132, 936, 235.0, 539.4000000000003, 936.0, 936.0, 0.08127174019050096, 0.1742844954514916, 0.052530327904381086], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0d33367-fa89-465e-9ea5-e032a27b0026", 1, 0, 0.0, 916.0, 916, 916, 916.0, 916.0, 916.0, 916.0, 1.0917030567685588, 0.19723150927947597, 0.7526780840611353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a63f679-bccd-481a-8f2e-8371884661dc", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 132.93333333333337, 128, 138, 133.0, 136.8, 138.0, 138.0, 0.08904138049756323, 0.06617235406117736, 0.044694599195065916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 167.73333333333335, 129, 402, 132.0, 399.6, 402.0, 402.0, 0.08903979485231266, 0.023825101356966475, 0.050780508001709565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 795.75, 652, 954, 788.5, 954.0, 954.0, 954.0, 0.07489795154102535, 22.022484599108715, 0.04271523798824102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 973.5, 891, 1179, 912.0, 1179.0, 1179.0, 1179.0, 0.0749864087134207, 67.4729023723825, 0.04269245730461354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 263.25, 134, 400, 259.5, 400.0, 400.0, 400.0, 0.07570595805889924, 0.13396405859641153, 0.04191921701112878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 148.2777777777778, 128, 395, 133.0, 172.70000000000036, 395.0, 395.0, 0.0961939269567448, 0.07148786954500272, 0.04828484224195979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/022713ed-3e64-4286-bb4c-8826034a60eb", 3, 0, 0.0, 783.3333333333334, 377, 1037, 936.0, 1037.0, 1037.0, 1037.0, 0.026825713340427243, 0.026904304297479278, 0.017202687265833877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 160.61111111111111, 128, 393, 132.5, 390.3, 393.0, 393.0, 0.09619598328327579, 0.02573994083947028, 0.05486177171624323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 190.61111111111111, 128, 407, 132.5, 394.40000000000003, 407.0, 407.0, 0.09619649737864544, 0.025927962184088032, 0.05655301896674274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 175.11111111111111, 128, 398, 131.5, 393.5, 398.0, 398.0, 0.09619649737864544, 0.025927962184088032, 0.05664696085871407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 198.0, 132, 385, 137.5, 385.0, 385.0, 385.0, 0.0760687661646128, 0.05653157329225619, 0.042714395063137074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 637.0, 130, 1306, 636.0, 1282.8000000000002, 1305.4, 1306.0, 0.09727910347578238, 43.77906403214588, 0.053009511464342345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 166.46666666666664, 127, 396, 133.0, 388.8, 396.0, 396.0, 0.08903873778685313, 0.02399872229411276, 0.0523450392067242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 558.6999999999999, 127, 1050, 521.0, 1039.1, 1049.5, 1050.0, 0.09740085810155986, 14.332669434880222, 0.05317097624880075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 149.20000000000002, 127, 393, 132.0, 239.4000000000001, 393.0, 393.0, 0.0890408519428714, 0.023999292125227056, 0.05243323605620259], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 541.4285714285714, 134, 916, 576.5, 831.0, 916.0, 916.0, 0.07799008411787645, 0.01536300206116651, 0.05297624435964571], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 369.8333333333333, 264, 788, 269.5, 571.1000000000004, 788.0, 788.0, 0.09612509078480796, 0.14897511628465843, 0.21618758210684838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 526.8947368421053, 136, 1187, 493.0, 1095.0, 1187.0, 1187.0, 0.07888530906433719, 0.04845591738424619, 0.03566786923514465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97b019b0-3c99-4c73-ad5d-25f25152c87b", 3, 0, 0.0, 701.3333333333334, 247, 1369, 488.0, 1369.0, 1369.0, 1369.0, 0.023415730687876116, 0.02348433146137575, 0.015015947088253889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 162.95, 129, 407, 133.5, 365.0000000000004, 405.84999999999997, 407.0, 0.09739469198928659, 0.07238023496469442, 0.04888757000243487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 229.35, 130, 464, 134.5, 412.90000000000003, 461.49999999999994, 464.0, 0.0972644376899696, 0.0990691489361702, 0.05138677811550152], "isController": false}, {"data": ["login", 19, 0, 0.0, 2809.789473684211, 1319, 6322, 2238.0, 5381.0, 6322.0, 6322.0, 0.08002763059245718, 20.26672597223041, 0.14868209102721783], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 153.4, 133, 386, 138.0, 240.80000000000007, 386.0, 386.0, 0.08595446705365277, 0.06958618475339663, 0.030554126960478135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12145ca2-d340-44ed-9c75-a793066afe1a", 2, 0, 0.0, 263.5, 260, 267, 263.5, 267.0, 267.0, 267.0, 0.016240357287860333, 0.027469041818920015, 0.010094714271213966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed92f2cb-b2f5-459c-a571-40aad84d2ce9", 3, 0, 0.0, 1569.0, 275, 3651, 781.0, 3651.0, 3651.0, 3651.0, 0.026062027625749284, 0.026138381222309097, 0.016712953913647816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92b3c5ee-ada3-4d3e-981f-235f23ab1406", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.307775234241908, 1.174536839863714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 826.6, 265, 1438, 927.5, 1422.5000000000002, 1437.8, 1438.0, 0.09719873252852783, 58.217057451133336, 0.20616762407418207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ba4ba38-b809-440d-ac27-bdd924b580ff", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 0.29092441626409016, 1.1102304750402576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a827227-d641-46fa-830c-f2238551aba5", 3, 0, 0.0, 336.0, 226, 550, 232.0, 550.0, 550.0, 550.0, 0.05118143819841338, 0.03290473321675339, 0.03282143009468566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 560.1428571428572, 264, 1280, 514.5, 1278.0, 1280.0, 1280.0, 0.11219656838781544, 28.899358238133207, 0.2461813096545147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 661.25, 131, 1340, 590.0, 1340.0, 1340.0, 1340.0, 0.08880896082414716, 53.13507773559352, 0.12954920432721662], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1168.318181818182, 215, 4765, 864.0, 3141.699999999999, 4572.849999999997, 4765.0, 0.09200209095661264, 0.028799660219550445, 0.04150875588081547], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f28fb56c-3410-48da-9e2f-4766da1c288a", 3, 0, 0.0, 331.3333333333333, 233, 479, 282.0, 479.0, 479.0, 479.0, 0.015946420028703556, 0.021983427350768088, 0.010226057114761069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 354.6666666666667, 262, 537, 271.0, 536.4, 537.0, 537.0, 0.08896955461840958, 0.13788543279239843, 0.20009461356073951], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 174.05, 131, 404, 135.0, 389.0, 403.25, 404.0, 0.1256005275222156, 0.09751212830093886, 0.044647062517662574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f28fb56c-3410-48da-9e2f-4766da1c288a", 1, 0, 0.0, 724.0, 724, 724, 724.0, 724.0, 724.0, 724.0, 1.3812154696132597, 0.2495359979281768, 0.9522833218232044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 448.07692307692304, 267, 549, 520.0, 546.2, 549.0, 549.0, 0.08218537226812661, 0.12737127518507513, 0.18483682845067928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 164.75, 130, 388, 133.0, 388.0, 388.0, 388.0, 0.03917363222814724, 0.029112435669550827, 0.01966332711451922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 211.5, 129, 513, 132.0, 513.0, 513.0, 513.0, 0.03917439952990721, 0.010482212374213451, 0.022341649731900202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 209.62499999999997, 128, 503, 132.0, 503.0, 503.0, 503.0, 0.039174207701649234, 0.010558673169585144, 0.02303014944960238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e438ff9-1689-48e2-9563-c63a01df153a", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 214.375, 129, 539, 132.0, 539.0, 539.0, 539.0, 0.03917478319205927, 0.010558828282234726, 0.023068744399230217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 136.5, 134, 139, 136.5, 139.0, 139.0, 139.0, 0.1105644314224114, 0.032607869423406495, 0.06834695809608049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a63f679-bccd-481a-8f2e-8371884661dc", 3, 0, 0.0, 412.3333333333333, 235, 632, 370.0, 632.0, 632.0, 632.0, 0.051524259338772006, 0.0331251341777587, 0.0330412730785745], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1288.8947368421054, 1018, 1881, 1081.0, 1759.0000000000002, 1820.4999999999998, 1881.0, 0.26359722344257974, 315.35392045953785, 0.5205015486336877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1168.318181818182, 215, 4765, 864.0, 3141.699999999999, 4572.849999999997, 4765.0, 0.0904452785509022, 0.02831232707479413, 0.04080636590870782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 206.88888888888889, 131, 525, 133.0, 525.0, 525.0, 525.0, 0.04710463509609345, 0.01269617117824394, 0.027738373987250348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 159.22222222222223, 129, 382, 132.0, 382.0, 382.0, 382.0, 0.0471048816359002, 0.012696237628426227, 0.027692518305480394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=093d6075-4915-444d-86dd-69351d949bef", 1, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 1.6666666666666667, 0.30110677083333337, 1.1490885416666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 208.60000000000002, 128, 912, 131.0, 392.9, 886.0499999999996, 912.0, 0.1155428201691547, 5.22786691525223, 0.06743006770809262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7ce3a7a-7359-44f5-9fe1-c013922334ff", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 221.25, 128, 914, 132.5, 607.2000000000005, 899.8499999999998, 914.0, 0.11554081768236675, 1.7282266037065495, 0.06754173189908666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 163.33333333333337, 130, 402, 134.0, 402.0, 402.0, 402.0, 0.0471043885588674, 0.012604103969853191, 0.026864221599979064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 145.59999999999997, 128, 383, 133.0, 137.0, 370.6999999999998, 383.0, 0.11554148517025038, 0.08586627950640677, 0.05799640954834833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 135.77777777777777, 133, 139, 136.0, 139.0, 139.0, 139.0, 0.04710340243576928, 0.03500555591173869, 0.023643700050767002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 184.3, 127, 405, 132.0, 396.5, 404.6, 405.0, 0.11554081768236675, 0.03959303996556884, 0.06540919141647265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acd7efed-6606-4088-b474-0279b0f5a0c8", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 165.66666666666666, 135, 395, 137.0, 395.0, 395.0, 395.0, 0.04596268851085996, 0.036177663027102666, 0.01633829943159475], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 559.6428571428572, 131, 1037, 552.0, 909.0, 1037.0, 1037.0, 0.07832781308745859, 0.015123562125145467, 0.05330400003356907], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1544.842105263158, 818, 4275, 1100.0, 3858.0, 4275.0, 4275.0, 0.08027038445289396, 0.04154619507815801, 0.03692124128643853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 344.55555555555554, 267, 659, 273.0, 659.0, 659.0, 659.0, 0.0470703911549505, 0.07294991285440082, 0.10586241291977636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0d33367-fa89-465e-9ea5-e032a27b0026", 3, 0, 0.0, 378.3333333333333, 230, 499, 406.0, 499.0, 499.0, 499.0, 0.05473653481243614, 0.03519031779119836, 0.03510122837906875], "isController": false}, {"data": ["addBook", 60, 8, 13.333333333333334, 1200.8666666666663, 670, 1976, 1065.5, 1844.2, 1899.95, 1976.0, 0.2807253944191792, 79.4258222622256, 1.022884017718451], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 236.85964912280696, 130, 638, 136.0, 529.4, 536.4, 638.0, 0.264748094510425, 0.19675126945550142, 0.12797881521744178], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 768.7719298245614, 633, 1165, 669.0, 1017.0000000000001, 1048.5, 1165.0, 0.2646251839609283, 77.80859046757413, 0.1330878610740997], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 201.26315789473682, 128, 530, 134.0, 400.4, 420.79999999999995, 530.0, 0.2652853213442985, 0.4694306662850281, 0.12901571291939515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=022713ed-3e64-4286-bb4c-8826034a60eb", 1, 0, 0.0, 746.0, 746, 746, 746.0, 746.0, 746.0, 746.0, 1.3404825737265416, 0.24217702747989275, 0.924199899463807], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1047.7368421052631, 884, 1706, 936.0, 1286.0, 1310.4, 1706.0, 0.2642902184799139, 237.80880316087624, 0.13266130107292556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 135.0, 130, 139, 135.0, 138.6, 139.0, 139.0, 0.08274510053529716, 0.06181640811474835, 0.029413297455906408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 8, 4.519774011299435, 201.2033898305084, 129, 1060, 137.0, 351.600000000001, 427.1, 1028.8, 0.7684259424071268, 1.6209154308177876, 0.3698660355733456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 137.375, 132, 155, 134.5, 155.0, 155.0, 155.0, 0.03774510729046747, 0.029230341876309282, 0.01341720610715836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 134.64285714285717, 129, 141, 134.5, 140.0, 141.0, 141.0, 0.10972560760555213, 0.0890449022658338, 0.039004024578536106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6755bd1e-de7f-44e9-b0b1-1cfc13ce30c9", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 459.5, 264, 778, 398.5, 778.0, 778.0, 778.0, 0.03914832812171215, 0.06067226243081757, 0.08804550748467098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97b019b0-3c99-4c73-ad5d-25f25152c87b", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed92f2cb-b2f5-459c-a571-40aad84d2ce9", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 395.5999999999999, 258, 1047, 269.0, 775.2, 1033.4499999999998, 1047.0, 0.11545144400893595, 7.075984052186938, 0.2581760367539672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/093d6075-4915-444d-86dd-69351d949bef", 3, 0, 0.0, 409.0, 229, 749, 249.0, 749.0, 749.0, 749.0, 0.015599407222525544, 0.021505042183397032, 0.010003526116007591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 155.83333333333334, 132, 455, 136.0, 190.40000000000043, 455.0, 455.0, 0.0954497006591332, 0.07913749595664463, 0.03392938578117626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 135.09999999999997, 130, 141, 134.5, 139.8, 140.95, 141.0, 0.09419300145999152, 0.073128355625677, 0.03348266848773136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92b3c5ee-ada3-4d3e-981f-235f23ab1406", 3, 0, 0.0, 408.3333333333333, 262, 555, 408.0, 555.0, 555.0, 555.0, 0.03252561392096276, 0.02643764907573047, 0.020857896948013228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a827227-d641-46fa-830c-f2238551aba5", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 132.30769230769232, 127, 138, 132.0, 137.2, 138.0, 138.0, 0.08225661533010212, 0.06113016041621847, 0.041288965116867665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 231.30769230769232, 127, 406, 133.0, 400.4, 406.0, 406.0, 0.08225505394033344, 0.02200965310512829, 0.046911085450346425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 192.23076923076925, 128, 416, 131.0, 406.8, 416.0, 416.0, 0.08225869727533884, 0.022171289499993672, 0.048359116952884744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 290.9230769230769, 128, 402, 384.0, 398.8, 402.0, 402.0, 0.08225921777811526, 0.022171429791757624, 0.04843975421894873], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 30.434782608695652, 0.5319148936170213], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.1519756838905775], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.1519756838905775], "isController": false}, {"data": ["401/Unauthorized", 12, 52.17391304347826, 0.9118541033434651], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 23, "401/Unauthorized", 12, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
