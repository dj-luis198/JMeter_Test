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

    var data = {"OkPercent": 98.39080459770115, "KoPercent": 1.6091954022988506};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7769332452081956, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05357142857142857, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2b67031-3315-43e5-bd7c-a2ac18879ba5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51375430-4e33-4eed-8833-d3bdd3263e7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/26b03547-8c81-44e9-8d87-2b8c75189d25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b1539bc-80ba-43a3-8108-dc9d384f1f23"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72ca649b-44cb-4795-b6fc-9cfadfc163b4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28066c68-5d7d-4af2-9de1-4f0b8cc414b4"], "isController": false}, {"data": [0.8409090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ed4ee59-0165-4281-98f2-b5b9f2d0edbe"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d25ad7e7-dcb4-4479-bb63-68d570068ce7"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/549410ea-2463-47fa-9229-78e615b03ea4"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a2b67031-3315-43e5-bd7c-a2ac18879ba5"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0f1c769-499f-44f1-98e8-33cd25f17245"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b1539bc-80ba-43a3-8108-dc9d384f1f23"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7d5100f-3253-4916-9470-62a1110fb60c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26b03547-8c81-44e9-8d87-2b8c75189d25"], "isController": false}, {"data": [0.2627118644067797, 500, 1500, "addBook"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72ca649b-44cb-4795-b6fc-9cfadfc163b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f3f60e8-32d3-487f-9892-beecfb7b2f08"], "isController": false}, {"data": [0.9281609195402298, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9fa75823-086b-4d67-998b-15cbaf8388fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28066c68-5d7d-4af2-9de1-4f0b8cc414b4"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fa75823-086b-4d67-998b-15cbaf8388fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31e3150d-5a4e-41ab-a07a-4e19a29fba68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ed4ee59-0165-4281-98f2-b5b9f2d0edbe"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51375430-4e33-4eed-8833-d3bdd3263e7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0f1c769-499f-44f1-98e8-33cd25f17245"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a7d5100f-3253-4916-9470-62a1110fb60c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0754ebd5-7879-4b6f-952b-72e12441a264"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d25ad7e7-dcb4-4479-bb63-68d570068ce7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f0f32a1f-cca2-40e7-af02-f757f7ce0eda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1305, 21, 1.6091954022988506, 382.2720306513413, 119, 2325, 143.0, 997.0, 1175.7000000000028, 1573.88, 5.082310055963828, 730.1151766650406, 3.71585353356856], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1804.5000000000002, 1479, 2289, 1759.0, 2087.8, 2107.0, 2289.0, 0.25037780221942035, 301.28881694252937, 1.2311056974363102], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2b67031-3315-43e5-bd7c-a2ac18879ba5", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 573.5, 124, 948, 482.0, 930.0000000000001, 948.0, 948.0, 0.09225872421560864, 0.017546275918935338, 0.062339207939632046], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 573.5, 124, 948, 482.0, 930.0000000000001, 948.0, 948.0, 0.0928993899606726, 0.017668121284024403, 0.06277210570015174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 176.65000000000003, 121, 448, 126.5, 362.9, 443.74999999999994, 448.0, 0.10793774151069663, 0.028881778490166873, 0.06155824320531917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 143.15000000000003, 120, 367, 127.5, 165.70000000000002, 356.9999999999999, 367.0, 0.10793599395558434, 0.0802141517580075, 0.054178809465986674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 150.0, 120, 377, 125.5, 339.2000000000005, 376.2, 377.0, 0.10793774151069663, 0.02909259439155495, 0.06356099426850592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 186.35000000000002, 120, 379, 126.0, 374.8, 378.8, 379.0, 0.10793541144978844, 0.029091966367325795, 0.06345421649684829], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 245.23076923076923, 122, 391, 230.0, 358.59999999999997, 391.0, 391.0, 0.07839448102853559, 0.15137107424560386, 0.05067491806269146], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/51375430-4e33-4eed-8833-d3bdd3263e7c", 3, 0, 0.0, 387.6666666666667, 351, 421, 391.0, 421.0, 421.0, 421.0, 0.030790705312423023, 0.025668944109738072, 0.019745341622875442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 143.2857142857143, 121, 361, 126.5, 250.5, 361.0, 361.0, 0.07458114695149562, 0.055426028154382974, 0.03743623977838745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 211.7142857142857, 120, 378, 126.0, 377.5, 378.0, 378.0, 0.07458233890214798, 0.027957972186114902, 0.042087829360935906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 746.6666666666666, 600, 896, 750.0, 896.0, 896.0, 896.0, 0.05230718264796395, 15.380048460425257, 0.02983144010391694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1004.1666666666666, 834, 1118, 1077.0, 1118.0, 1118.0, 1118.0, 0.05221523118293606, 46.98335680299193, 0.029728007597316135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 244.33333333333334, 121, 374, 243.5, 374.0, 374.0, 374.0, 0.05265236277477952, 0.09317000131630906, 0.02915418915361327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 145.66666666666669, 123, 361, 127.0, 291.40000000000026, 361.0, 361.0, 0.05990594766217039, 0.044519947432530925, 0.030069977635112873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 145.33333333333331, 122, 376, 124.5, 301.90000000000026, 376.0, 376.0, 0.059906246723877135, 0.016029601174162435, 0.03416528133471118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26b03547-8c81-44e9-8d87-2b8c75189d25", 3, 0, 0.0, 671.3333333333334, 228, 1366, 420.0, 1366.0, 1366.0, 1366.0, 0.01887053554579879, 0.026014556652492797, 0.012101222338939979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 184.08333333333331, 120, 375, 124.0, 372.0, 375.0, 375.0, 0.05990744300056413, 0.0161469279962458, 0.03521902410775352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 143.08333333333334, 119, 357, 124.5, 288.30000000000024, 357.0, 357.0, 0.05983813783715051, 0.016128248088919474, 0.03523671593340015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 122.83333333333333, 121, 128, 122.0, 128.0, 128.0, 128.0, 0.05265190073361649, 0.039129000447541154, 0.0295652762908491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 640.8947368421052, 121, 1133, 1073.0, 1128.0, 1133.0, 1133.0, 0.08970981236484508, 42.496214998418274, 0.0486819592386942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 194.85714285714286, 120, 1120, 123.5, 624.0, 1120.0, 1120.0, 0.07458154426414652, 4.812137954880829, 0.04338797985232854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 444.0526315789474, 120, 878, 597.0, 873.0, 878.0, 878.0, 0.08971193027022177, 13.894762298797389, 0.048770717848896784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 192.2142857142857, 121, 836, 122.5, 606.5, 836.0, 836.0, 0.07458273622749866, 1.5850808390291458, 0.04346150798301644], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 471.99999999999994, 123, 1032, 444.0, 909.0000000000005, 1032.0, 1032.0, 0.09309614504379399, 0.017705541257108277, 0.06363236671735234], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 351.8333333333333, 249, 738, 253.5, 664.5000000000002, 738.0, 738.0, 0.059799075107638336, 0.09267688690998246, 0.13448952145790144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b1539bc-80ba-43a3-8108-dc9d384f1f23", 3, 0, 0.0, 302.3333333333333, 230, 379, 298.0, 379.0, 379.0, 379.0, 0.040119288016368666, 0.025792836533960976, 0.025727538213621837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72ca649b-44cb-4795-b6fc-9cfadfc163b4", 3, 0, 0.0, 457.33333333333337, 212, 855, 305.0, 855.0, 855.0, 855.0, 0.019877554265723144, 0.027402813253690598, 0.012746999317537302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28066c68-5d7d-4af2-9de1-4f0b8cc414b4", 3, 0, 0.0, 462.3333333333333, 241, 679, 467.0, 679.0, 679.0, 679.0, 0.04035295383622081, 0.026415947319218768, 0.025877382505649416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 487.5, 146, 1014, 447.0, 749.1999999999999, 975.8999999999994, 1014.0, 0.09608665269042627, 0.05902197709206848, 0.04344542987858141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 128.26315789473685, 121, 192, 123.0, 136.0, 192.0, 192.0, 0.08971150668114641, 0.06667036775815667, 0.045030971127059824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 188.26315789473685, 121, 378, 126.0, 375.0, 378.0, 378.0, 0.08971023593792052, 0.09492058578423271, 0.04719746993526698], "isController": false}, {"data": ["login", 22, 0, 0.0, 2461.9090909090914, 1198, 3956, 2374.0, 3709.3999999999996, 3927.2, 3956.0, 0.09184538247339614, 30.0922866708345, 0.1801112085808636], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 132.21428571428575, 125, 161, 129.0, 149.5, 161.0, 161.0, 0.07745333436604446, 0.06270392010688561, 0.027532239950429867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ed4ee59-0165-4281-98f2-b5b9f2d0edbe", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d25ad7e7-dcb4-4479-bb63-68d570068ce7", 3, 0, 0.0, 661.3333333333334, 310, 847, 827.0, 847.0, 847.0, 847.0, 0.054815545688757336, 0.03524111417164574, 0.03515189616108462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 770.3157894736843, 245, 1307, 1201.0, 1256.0, 1307.0, 1307.0, 0.08965774336178786, 56.51941469862022, 0.18956880081588545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 371.65, 247, 729, 275.5, 568.2000000000002, 721.3, 729.0, 0.1078626477044132, 0.1671660370184607, 0.24258562271803086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 883.75, 122, 1246, 1108.0, 1246.0, 1246.0, 1246.0, 0.06954586549829614, 62.40542713114612, 0.1291335644646707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/549410ea-2463-47fa-9229-78e615b03ea4", 1, 0, 0.0, 301.0, 301, 301, 301.0, 301.0, 301.0, 301.0, 3.3222591362126246, 1.0609167358803988, 1.9823245431893688], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1115.636363636364, 241, 1828, 1089.5, 1739.1, 1819.3, 1828.0, 0.09361821640276258, 0.029455163257403286, 0.04223790622859015], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 133.05882352941174, 122, 149, 130.0, 149.0, 149.0, 149.0, 0.10076462568905221, 0.07823034904569971, 0.03581867553790528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 428.2857142857143, 245, 1242, 262.0, 991.0, 1242.0, 1242.0, 0.07453151618398637, 6.4762303938857535, 0.16626101336243612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 469.3333333333333, 253, 1196, 499.0, 921.8000000000002, 1196.0, 1196.0, 0.07079378713724083, 5.748667528187726, 0.15800933622565283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 145.16666666666669, 121, 366, 126.5, 294.60000000000025, 366.0, 366.0, 0.06115241730409569, 0.045446278875407045, 0.030695646967094904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 206.58333333333331, 121, 379, 126.0, 378.1, 379.0, 379.0, 0.06107429688215714, 0.023986373433698763, 0.03440399438625421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 183.16666666666666, 120, 836, 125.0, 623.3000000000008, 836.0, 836.0, 0.060932882430003346, 4.584014266228458, 0.03538550203617382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 228.83333333333334, 120, 876, 125.5, 726.6000000000006, 876.0, 876.0, 0.06092050888931759, 1.5077726795631998, 0.035437809044664884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 123.0, 8.130081300813009, 2.3977388211382116, 5.025724085365853], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1163.875, 957, 1754, 1005.5, 1572.6, 1589.65, 1754.0, 0.2526403168831403, 302.24565097740225, 0.4988659382204197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1115.636363636364, 241, 1828, 1089.5, 1739.1, 1819.3, 1828.0, 0.09229194459127253, 0.029037877453077936, 0.04163952968864054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 208.0, 121, 374, 132.5, 374.0, 374.0, 374.0, 0.08777576218620164, 0.023658310901749666, 0.05168826620925742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 123.5, 120, 127, 123.5, 127.0, 127.0, 127.0, 0.08778089887640449, 0.023659695400280897, 0.05160556750351123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 282.64705882352933, 120, 880, 125.0, 874.4, 880.0, 880.0, 0.10464951645767542, 16.640373235193632, 0.059935413550265625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2b67031-3315-43e5-bd7c-a2ac18879ba5", 3, 0, 0.0, 350.0, 212, 619, 219.0, 619.0, 619.0, 619.0, 0.06607492896945136, 0.029897184657401495, 0.04237226890293593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 281.2352941176471, 120, 869, 125.0, 864.2, 869.0, 869.0, 0.10466949069057235, 5.454345919583046, 0.060049069595975765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 180.99999999999997, 120, 376, 126.0, 365.59999999999997, 376.0, 376.0, 0.10482180293501048, 0.07789979690775681, 0.05261563155136268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 164.16666666666666, 120, 373, 123.0, 373.0, 373.0, 373.0, 0.08777704630239193, 0.023487217467632212, 0.05006034671933289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 195.9411764705882, 120, 377, 126.0, 376.2, 377.0, 377.0, 0.10482115660897393, 0.05583075391075403, 0.05822728540951159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 167.16666666666669, 122, 378, 126.0, 378.0, 378.0, 378.0, 0.08745335820895522, 0.06499219296583489, 0.043897486444729475], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 506.5833333333333, 124, 855, 442.0, 852.6, 855.0, 855.0, 0.09314672938546445, 0.01750291326098937, 0.0633940509318554], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 174.16666666666669, 128, 377, 129.5, 377.0, 377.0, 377.0, 0.10064581061813302, 0.07921926109200704, 0.035776440493164474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0f1c769-499f-44f1-98e8-33cd25f17245", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1277.0454545454547, 729, 2325, 1160.0, 2043.1, 2287.3499999999995, 2325.0, 0.09441128128982976, 0.048865213948837666, 0.04342550145264631], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b1539bc-80ba-43a3-8108-dc9d384f1f23", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 378.33333333333337, 249, 751, 260.5, 751.0, 751.0, 751.0, 0.08729304274449327, 0.13528716683155353, 0.1963240990630547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7d5100f-3253-4916-9470-62a1110fb60c", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26b03547-8c81-44e9-8d87-2b8c75189d25", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 1182.627118644068, 643, 2267, 1023.0, 1811.0, 1931.0, 2267.0, 0.2782848221571319, 91.36948467635239, 1.0102149912387448], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 222.41071428571428, 121, 510, 128.0, 494.40000000000003, 506.0, 510.0, 0.2538807485855215, 0.18867504850935732, 0.12272555717757146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72ca649b-44cb-4795-b6fc-9cfadfc163b4", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 715.5, 597, 1017, 628.0, 909.7000000000004, 1000.6, 1017.0, 0.25346706738603036, 74.52773371021472, 0.12747611299199768], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 185.01785714285717, 120, 514, 128.0, 376.0, 417.2999999999999, 514.0, 0.25433736034153875, 0.45005790716686345, 0.12369141157234989], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 930.0178571428571, 830, 1248, 871.5, 1118.0, 1138.8, 1248.0, 0.25323553618102723, 227.86178059627923, 0.12711236874711718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 150.46666666666667, 125, 381, 132.0, 249.60000000000008, 381.0, 381.0, 0.07222093829443033, 0.05395411894066328, 0.02567228665934828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f3f60e8-32d3-487f-9892-beecfb7b2f08", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.580870977722772, 2.953859839108911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, 6.32183908045977, 195.3218390804598, 122, 1508, 132.0, 379.5, 447.0, 808.25, 0.7427010414888169, 1.6101734903214102, 0.35653618266604065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 152.24999999999997, 124, 376, 132.0, 308.2000000000003, 376.0, 376.0, 0.06028969196991544, 0.04668918528529585, 0.02143110144243088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fa75823-086b-4d67-998b-15cbaf8388fe", 3, 0, 0.0, 284.6666666666667, 202, 415, 237.0, 415.0, 415.0, 415.0, 0.03065353333060858, 0.025554589472554873, 0.0196573765173499], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28066c68-5d7d-4af2-9de1-4f0b8cc414b4", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 151.55, 126, 510, 131.5, 155.20000000000005, 492.34999999999974, 510.0, 0.10703085699607197, 0.08685804898802325, 0.03804612494782246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fa75823-086b-4d67-998b-15cbaf8388fe", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31e3150d-5a4e-41ab-a07a-4e19a29fba68", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 1.1404854910714284, 2.130998883928571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ed4ee59-0165-4281-98f2-b5b9f2d0edbe", 3, 0, 0.0, 335.0, 240, 477, 288.0, 477.0, 477.0, 477.0, 0.026908966964758224, 0.026987801828912788, 0.01725607582049925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 395.58333333333337, 251, 998, 254.0, 921.8000000000003, 998.0, 998.0, 0.06088063843496172, 6.156024432478299, 0.1356239092218947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51375430-4e33-4eed-8833-d3bdd3263e7c", 1, 0, 0.0, 1032.0, 1032, 1032, 1032.0, 1032.0, 1032.0, 1032.0, 0.9689922480620154, 0.17506207606589147, 0.6680747335271318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0f1c769-499f-44f1-98e8-33cd25f17245", 3, 0, 0.0, 377.6666666666667, 208, 463, 462.0, 463.0, 463.0, 463.0, 0.025601420025430744, 0.0256764241856615, 0.01641757729495396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 483.52941176470586, 246, 1256, 254.0, 1228.0, 1256.0, 1256.0, 0.10456969570218551, 22.21023573930775, 0.23045820172416975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7d5100f-3253-4916-9470-62a1110fb60c", 3, 0, 0.0, 883.3333333333334, 278, 1992, 380.0, 1992.0, 1992.0, 1992.0, 0.025856050746808933, 0.025931800895481225, 0.016580865876046093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0754ebd5-7879-4b6f-952b-72e12441a264", 2, 0, 0.0, 320.0, 214, 426, 320.0, 426.0, 426.0, 426.0, 0.055520084390528274, 0.032612627696194094, 0.03451028683063598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 152.25, 123, 368, 130.0, 303.2000000000002, 368.0, 368.0, 0.05873571376128827, 0.048697872054036855, 0.02087871075108294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 157.89473684210526, 124, 380, 131.0, 366.0, 380.0, 380.0, 0.09009051726181727, 0.06994332150697727, 0.032024363557911606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d25ad7e7-dcb4-4479-bb63-68d570068ce7", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 144.86666666666667, 120, 362, 126.0, 238.4000000000001, 362.0, 362.0, 0.07083658000991713, 0.0526432005737763, 0.03555664270029043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0f32a1f-cca2-40e7-af02-f757f7ce0eda", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.534901067839196, 0.9994634631490787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 237.46666666666667, 119, 378, 130.0, 376.8, 378.0, 378.0, 0.07083691453290139, 0.02604732378136895, 0.04000256488661372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 252.60000000000002, 120, 1070, 125.0, 656.0000000000002, 1070.0, 1070.0, 0.0708372490590452, 4.267118743595132, 0.041238716216535305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 241.86666666666665, 121, 621, 126.0, 482.4000000000001, 621.0, 621.0, 0.07083758358834864, 1.4063935198959159, 0.04130808829432544], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 28.571428571428573, 0.45977011494252873], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.761904761904762, 0.07662835249042145], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.07662835249042145], "isController": false}, {"data": ["401/Unauthorized", 13, 61.904761904761905, 0.9961685823754789], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1305, 21, "401/Unauthorized", 13, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
