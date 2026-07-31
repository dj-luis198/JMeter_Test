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

    var data = {"OkPercent": 99.20127795527156, "KoPercent": 0.7987220447284346};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7542955326460481, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a3af7bd7-00f1-4680-90b9-54f52e2699bf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=206ad179-0ab6-4e94-b88a-e1d59581fa0d"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=459361f9-929a-424a-aba3-c1edf1550955"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c669ad1-67c7-4c36-a0d7-8fcc657685c9"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=439527c5-c5ad-494d-99f3-b79f8f2bb864"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7812d4cb-ce42-410a-9c86-4f63e7454af5"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cad1803f-26d4-4410-9c40-2a24dd731ee2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/acfd8192-a0a7-4582-87a4-70b51f6ce70a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b684b523-2168-4a7a-a59f-b5c804b1a967"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9bab6102-d341-4e9f-a462-a7be507ff8b9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/659ff8e9-0247-43ab-9c69-da422b38fade"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a5a9c033-4e74-43e0-93a7-9448001dd130"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7812d4cb-ce42-410a-9c86-4f63e7454af5"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/206ad179-0ab6-4e94-b88a-e1d59581fa0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2b101e7e-b2b4-4f3a-89ba-aae892505427"], "isController": false}, {"data": [0.35185185185185186, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78a4a823-694d-4e84-9903-fae1d717e514"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/439527c5-c5ad-494d-99f3-b79f8f2bb864"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b974d139-22a8-4117-8c45-d76662622456"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/459361f9-929a-424a-aba3-c1edf1550955"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3157894736842105, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f661cf06-80da-46f5-912b-7afeb671bb78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3af7bd7-00f1-4680-90b9-54f52e2699bf"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.46296296296296297, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9464285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=659ff8e9-0247-43ab-9c69-da422b38fade"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f661cf06-80da-46f5-912b-7afeb671bb78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c669ad1-67c7-4c36-a0d7-8fcc657685c9"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cad1803f-26d4-4410-9c40-2a24dd731ee2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/78a4a823-694d-4e84-9903-fae1d717e514"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b101e7e-b2b4-4f3a-89ba-aae892505427"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b974d139-22a8-4117-8c45-d76662622456"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5a9c033-4e74-43e0-93a7-9448001dd130"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1252, 10, 0.7987220447284346, 452.33067092651754, 125, 4426, 161.0, 1186.4, 1424.7499999999995, 2175.970000000001, 4.903957634819666, 668.5966052052162, 3.587948399261273], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2124.537037037036, 1552, 2933, 2076.0, 2548.5, 2671.0, 2933.0, 0.25155123260103973, 302.7008839667533, 1.2368754454553077], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a3af7bd7-00f1-4680-90b9-54f52e2699bf", 3, 0, 0.0, 659.0, 278, 954, 745.0, 954.0, 954.0, 954.0, 0.048260995463466426, 0.031027169935008526, 0.03094862013770471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=206ad179-0ab6-4e94-b88a-e1d59581fa0d", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.2796657314241486, 1.067264899380805], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 617.6153846153846, 465, 1150, 525.0, 1094.3999999999999, 1150.0, 1150.0, 0.07051191651389085, 0.012738969292060358, 0.04792606825553518], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 617.6153846153846, 465, 1150, 525.0, 1094.3999999999999, 1150.0, 1150.0, 0.07151423133203508, 0.012920051559010243, 0.04860732910849259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 227.28571428571428, 128, 429, 133.0, 420.5, 429.0, 429.0, 0.12070838578400096, 0.05819868600300047, 0.06739327007639116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 169.85714285714286, 128, 399, 133.5, 389.5, 399.0, 399.0, 0.1204487576570996, 0.08951318806352812, 0.06045963030834882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 314.42857142857144, 126, 1020, 137.0, 897.5, 1020.0, 1020.0, 0.12071046732195206, 5.098299545180203, 0.06960049685290567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 385.92857142857144, 128, 1421, 135.5, 1370.0, 1421.0, 1421.0, 0.1207094265440029, 15.544251994938827, 0.06948201645097042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=459361f9-929a-424a-aba3-c1edf1550955", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c669ad1-67c7-4c36-a0d7-8fcc657685c9", 1, 0, 0.0, 674.0, 674, 674, 674.0, 674.0, 674.0, 674.0, 1.483679525222552, 0.26804757047477745, 1.0229274851632046], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 269.8461538461538, 233, 350, 254.0, 339.2, 350.0, 350.0, 0.07043054735370761, 0.17498647259439046, 0.045532248386869575], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=439527c5-c5ad-494d-99f3-b79f8f2bb864", 1, 0, 0.0, 1521.0, 1521, 1521, 1521.0, 1521.0, 1521.0, 1521.0, 0.6574621959237344, 0.1187797912557528, 0.45328936554898097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 149.8235294117647, 127, 387, 134.0, 198.99999999999983, 387.0, 387.0, 0.08095392293186537, 0.06016204624135697, 0.04063507459665898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 160.64705882352942, 126, 384, 131.0, 380.8, 384.0, 384.0, 0.08095276644174496, 0.02166118945804504, 0.046168374611307676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 869.25, 625, 1051, 900.5, 1051.0, 1051.0, 1051.0, 0.05234848385703629, 15.392192387221735, 0.02985499469971601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1198.5, 1161, 1296, 1168.5, 1296.0, 1296.0, 1296.0, 0.052090115900507876, 46.870777851933845, 0.029656774970699306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 325.25, 144, 397, 380.0, 397.0, 397.0, 397.0, 0.052796916660067056, 0.09342579393363427, 0.029234230220955094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 192.20000000000005, 128, 493, 133.0, 437.8, 493.0, 493.0, 0.108537564851195, 0.08066121762867129, 0.05448076985694749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 201.93333333333337, 126, 398, 134.0, 396.8, 398.0, 398.0, 0.108537564851195, 0.029042278094948665, 0.06190032995419715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 184.46666666666667, 126, 397, 132.0, 395.8, 397.0, 397.0, 0.10854227721697601, 0.029255535656138067, 0.0638109871920113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 214.73333333333335, 128, 391, 134.0, 386.8, 391.0, 391.0, 0.10854070638291714, 0.029255112267270636, 0.06391606049697171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 197.75, 127, 392, 136.0, 392.0, 392.0, 392.0, 0.05262465465070385, 0.039108752137876596, 0.029549976976713587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 161.23529411764707, 126, 390, 131.0, 386.0, 390.0, 390.0, 0.08095238095238094, 0.021819196428571427, 0.047591145833333334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 836.0555555555557, 127, 1687, 1192.5, 1516.9000000000003, 1687.0, 1687.0, 0.08766290690199288, 43.83230002203748, 0.047350906093546065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 191.7058823529412, 126, 397, 132.0, 393.8, 397.0, 397.0, 0.08095507945502946, 0.021819923759363407, 0.04767178995252223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 653.111111111111, 130, 1174, 767.5, 1135.3, 1174.0, 1174.0, 0.08766205304528232, 14.330253544225506, 0.047436052358596235], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 616.7692307692307, 229, 1521, 539.0, 1182.1999999999998, 1521.0, 1521.0, 0.07145605452646622, 0.012909541100972902, 0.04926560009344253], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7812d4cb-ce42-410a-9c86-4f63e7454af5", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 448.2, 263, 886, 284.0, 830.8000000000001, 886.0, 886.0, 0.10843242852495752, 0.16804908600498789, 0.24386707313767303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cad1803f-26d4-4410-9c40-2a24dd731ee2", 3, 0, 0.0, 292.3333333333333, 235, 404, 238.0, 404.0, 404.0, 404.0, 0.023896194929227437, 0.028244493420580996, 0.015324057295110041], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acfd8192-a0a7-4582-87a4-70b51f6ce70a", 1, 0, 0.0, 788.0, 788, 788, 788.0, 788.0, 788.0, 788.0, 1.2690355329949237, 0.40524865164974616, 0.7572077252538071], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b684b523-2168-4a7a-a59f-b5c804b1a967", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.8381520669291338, 1.5660884186351707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 744.3000000000002, 247, 1442, 613.0, 1360.2, 1438.2, 1442.0, 0.09167667470365515, 0.0563131136607413, 0.04145146522245345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 166.55555555555554, 127, 407, 136.0, 398.90000000000003, 407.0, 407.0, 0.08765863778476883, 0.06514474936934479, 0.04400052716930779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 240.1111111111111, 126, 513, 133.0, 420.3000000000001, 513.0, 513.0, 0.08766290690199288, 0.09660421902090274, 0.04590507689985], "isController": false}, {"data": ["login", 20, 0, 0.0, 3486.1000000000004, 2162, 5618, 3432.5, 5349.600000000002, 5608.9, 5618.0, 0.08653850314351112, 20.826082353284786, 0.15926803029712996], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 139.52941176470588, 133, 149, 139.0, 147.4, 149.0, 149.0, 0.07975753708725475, 0.06456933422395916, 0.028351312011485087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bab6102-d341-4e9f-a462-a7be507ff8b9", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.6212761429961089, 1.160855423151751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/659ff8e9-0247-43ab-9c69-da422b38fade", 3, 0, 0.0, 534.0, 350, 891, 361.0, 891.0, 891.0, 891.0, 0.058850069639249075, 0.03783492432861879, 0.037739139710065324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1027.8333333333335, 264, 1823, 1324.0, 1664.6000000000004, 1823.0, 1823.0, 0.08760275072637282, 58.28442179751111, 0.18456842565689896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 611.3571428571428, 258, 1552, 512.5, 1504.5, 1552.0, 1552.0, 0.12031419191832386, 20.7223403581066, 0.26619179263849024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1396.5, 1288, 1688, 1305.0, 1688.0, 1688.0, 1688.0, 0.05182555518125988, 62.0013814749553, 0.11686055362649322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5a9c033-4e74-43e0-93a7-9448001dd130", 3, 0, 0.0, 364.3333333333333, 254, 542, 297.0, 542.0, 542.0, 542.0, 0.08065600215082673, 0.03743992808173142, 0.05172276179594031], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1395.5238095238096, 261, 2863, 1332.0, 2648.4, 2849.6, 2863.0, 0.09051685122046887, 0.028741120727927897, 0.04083865748423498], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7812d4cb-ce42-410a-9c86-4f63e7454af5", 3, 0, 0.0, 398.3333333333333, 255, 555, 385.0, 555.0, 555.0, 555.0, 0.02831016618067548, 0.023601020699449842, 0.018154631307269107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 387.99999999999994, 262, 778, 269.0, 588.3999999999999, 778.0, 778.0, 0.0809019135682027, 0.12538216487572038, 0.18195029975348712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 153.15384615384613, 128, 382, 134.0, 285.19999999999993, 382.0, 382.0, 0.14776085473971357, 0.11471667921686747, 0.052524366333257556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 451.56250000000006, 262, 1698, 270.0, 885.3000000000009, 1698.0, 1698.0, 0.09050285649640816, 6.898550407616382, 0.20209579515244075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/206ad179-0ab6-4e94-b88a-e1d59581fa0d", 3, 0, 0.0, 405.33333333333337, 233, 676, 307.0, 676.0, 676.0, 676.0, 0.01658961711163706, 0.022870126454356432, 0.010638523994116215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 156.3, 127, 380, 131.0, 356.30000000000007, 380.0, 380.0, 0.06009001484223367, 0.044656739545839666, 0.03016237073135557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 154.7, 125, 375, 129.5, 351.70000000000005, 375.0, 375.0, 0.06000096001536025, 0.016054944379110068, 0.03421929750876014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 182.20000000000002, 126, 386, 132.5, 385.3, 386.0, 386.0, 0.06008893161879582, 0.01619584485037856, 0.035325719564956136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 182.1, 125, 381, 134.5, 380.9, 381.0, 381.0, 0.06008820949153357, 0.016195650214514908, 0.03538397492519018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b101e7e-b2b4-4f3a-89ba-aae892505427", 3, 0, 0.0, 660.0, 238, 1061, 681.0, 1061.0, 1061.0, 1061.0, 0.01756789993324198, 0.024218768299895766, 0.011265873329585516], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1408.8333333333335, 1014, 2385, 1297.0, 1978.0, 2117.25, 2385.0, 0.2410585147224256, 288.38978910727997, 0.4759964030944771], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78a4a823-694d-4e84-9903-fae1d717e514", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.2976343698517298, 1.1358371087314663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1395.5238095238096, 261, 2863, 1332.0, 2648.4, 2849.6, 2863.0, 0.08879455055158329, 0.028194251821345363, 0.04006160386214012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/439527c5-c5ad-494d-99f3-b79f8f2bb864", 3, 0, 0.0, 610.0, 240, 941, 649.0, 941.0, 941.0, 941.0, 0.017489244114869355, 0.024110334904450432, 0.011215433237725466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 240.74999999999997, 126, 516, 137.0, 516.0, 516.0, 516.0, 0.040897286465043044, 0.011023096742531133, 0.024083070057051716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 194.375, 128, 389, 132.5, 389.0, 389.0, 389.0, 0.04094857370999196, 0.011036920257771272, 0.024073282591225747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b974d139-22a8-4117-8c45-d76662622456", 3, 0, 0.0, 367.0, 323, 448, 330.0, 448.0, 448.0, 448.0, 0.021938644923031922, 0.025930735584482063, 0.014068727375772423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 190.30769230769232, 127, 401, 131.0, 396.6, 401.0, 401.0, 0.1676532415109426, 0.04518778775099625, 0.098561768935144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 192.23076923076923, 125, 418, 132.0, 407.59999999999997, 418.0, 418.0, 0.16820422580770375, 0.04533629523723265, 0.09904994937699742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 163.625, 127, 390, 131.5, 390.0, 390.0, 390.0, 0.0408943596454459, 0.010942436077004078, 0.023322564485293365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 131.76923076923077, 127, 136, 133.0, 135.6, 136.0, 136.0, 0.1682259922098425, 0.12501951178875992, 0.08444156249595611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 233.25, 128, 410, 139.5, 410.0, 410.0, 410.0, 0.04094668741298829, 0.03043010656375399, 0.020553317705347636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 207.6153846153846, 128, 381, 133.0, 380.6, 381.0, 381.0, 0.1676727028839705, 0.044865547451374915, 0.09562583836351442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 201.25000000000003, 133, 408, 138.0, 408.0, 408.0, 408.0, 0.04138002379351368, 0.03257060466559768, 0.014709305332850565], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 680.6666666666667, 404, 1061, 611.0, 1028.9, 1061.0, 1061.0, 0.0683172882591047, 0.012342478835873407, 0.04650112296542576], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2078.15, 1096, 4426, 1543.5, 3944.9000000000024, 4407.2, 4426.0, 0.09067210699308625, 0.046929899127280975, 0.04170562733764026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/459361f9-929a-424a-aba3-c1edf1550955", 3, 0, 0.0, 448.6666666666667, 250, 622, 474.0, 622.0, 622.0, 622.0, 0.03529162647342541, 0.022689115327153377, 0.022631674528856786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 480.375, 260, 916, 276.0, 916.0, 916.0, 916.0, 0.0408649057297706, 0.06333262245424408, 0.09190613075748211], "isController": false}, {"data": ["addBook", 57, 6, 10.526315789473685, 1302.491228070175, 674, 2703, 1071.0, 2175.2000000000003, 2384.899999999999, 2703.0, 0.2749677998234417, 76.04384594476765, 1.0028212465086326], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 228.05555555555551, 127, 751, 135.0, 533.5, 560.5, 751.0, 0.24229480098174266, 0.18006478862022085, 0.11712492820894786], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 817.1296296296293, 630, 1200, 772.5, 1054.5, 1171.75, 1200.0, 0.24246016244830884, 71.29133819488409, 0.12194041373132719], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f661cf06-80da-46f5-912b-7afeb671bb78", 3, 0, 0.0, 471.0, 245, 632, 536.0, 632.0, 632.0, 632.0, 0.023633584899714823, 0.023856688402999888, 0.015155651774882225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3af7bd7-00f1-4680-90b9-54f52e2699bf", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 209.462962962963, 126, 529, 135.5, 402.5, 417.0, 529.0, 0.243000243000243, 0.42999652374652375, 0.11817785255285256], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1176.2777777777776, 876, 1849, 1140.0, 1461.5, 1531.75, 1849.0, 0.24190297003090983, 217.66471765387718, 0.12142395175379654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 161.74999999999997, 134, 411, 146.5, 243.70000000000016, 411.0, 411.0, 0.09374707040404986, 0.07003565318271304, 0.0333241539326896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 6, 3.5714285714285716, 207.1071428571428, 129, 1185, 141.5, 357.7999999999999, 416.2999999999999, 1087.0200000000004, 0.6810166605861607, 1.4149685587174186, 0.3283394011715108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 187.9, 133, 393, 137.0, 391.5, 393.0, 393.0, 0.06133351324497219, 0.047497535159436464, 0.021802147286298704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=659ff8e9-0247-43ab-9c69-da422b38fade", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 0.2783729776579353, 1.062331471494607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f661cf06-80da-46f5-912b-7afeb671bb78", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.27045518338323354, 1.0321154565868262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 168.35714285714283, 128, 401, 135.0, 360.5, 401.0, 401.0, 0.12174865859067231, 0.0988018899305163, 0.04327784348340305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 366.1, 261, 766, 268.0, 740.3000000000001, 766.0, 766.0, 0.059954554447728625, 0.0929178495200638, 0.13483919813781153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c669ad1-67c7-4c36-a0d7-8fcc657685c9", 2, 0, 0.0, 285.0, 256, 314, 285.0, 314.0, 314.0, 314.0, 0.023303233323623652, 0.026511979318380424, 0.014484871103990679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 404.6153846153846, 258, 552, 503.0, 546.0, 552.0, 552.0, 0.1673791007879693, 0.25940491499072976, 0.37643952061981767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cad1803f-26d4-4410-9c40-2a24dd731ee2", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78a4a823-694d-4e84-9903-fae1d717e514", 3, 0, 0.0, 493.3333333333333, 293, 597, 590.0, 597.0, 597.0, 597.0, 0.02048984386738973, 0.02824690389921729, 0.013139645969647713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 158.5333333333333, 135, 404, 139.0, 258.2000000000001, 404.0, 404.0, 0.10816891658013153, 0.0896830177505192, 0.038450669565593634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b101e7e-b2b4-4f3a-89ba-aae892505427", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b974d139-22a8-4117-8c45-d76662622456", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 141.83333333333334, 131, 160, 138.5, 158.2, 160.0, 160.0, 0.08748778816290226, 0.06792264803662822, 0.031099174698531663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 131.3125, 127, 135, 131.0, 135.0, 135.0, 135.0, 0.09057150620414818, 0.0673094884974187, 0.04546265057512906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 162.875, 125, 402, 131.5, 389.40000000000003, 402.0, 402.0, 0.09057150620414818, 0.03273708860723666, 0.051178650173218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5a9c033-4e74-43e0-93a7-9448001dd130", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 316.5, 126, 1570, 134.0, 751.0000000000009, 1570.0, 1570.0, 0.09057509524537359, 5.116613887214193, 0.05276176202525913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 233.37499999999997, 129, 755, 133.0, 503.7000000000003, 755.0, 755.0, 0.0905730443298444, 1.687354145556543, 0.05284901756550979], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 40.0, 0.3194888178913738], "isController": false}, {"data": ["401/Unauthorized", 6, 60.0, 0.4792332268370607], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1252, 10, "401/Unauthorized", 6, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
