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

    var data = {"OkPercent": 98.09885931558935, "KoPercent": 1.9011406844106464};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8214990138067061, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97ac7069-145f-4589-a1d8-3da359841cc7"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=068914a0-0d89-4d8c-bbed-8e2d38a07066"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba2d322c-6888-4401-a66b-394aaabefd8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f4ef4bd0-dd61-4f7e-9e7f-dcf50553f557"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7da5aea-ab62-444d-af10-40b2b9877c07"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c11c9c42-d619-4e8a-a14d-4e8181e9d3a6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0ee1afe5-845f-41e6-91f4-342321e65c90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/073ad685-da0d-4b87-a9c0-f5a3a1d3a693"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57a11f1d-3fda-41d9-8793-c63304c8b630"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0ff5640c-3f27-404c-8516-c63e9d66aadb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fedc2c94-55ed-4a2f-b6e5-94592986ad1a"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/068914a0-0d89-4d8c-bbed-8e2d38a07066"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4016393442622951, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97ac7069-145f-4589-a1d8-3da359841cc7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/097302f5-32ff-499b-8c62-1662498c5ab7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7da5aea-ab62-444d-af10-40b2b9877c07"], "isController": false}, {"data": [0.8839285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a55a1dc8-3aee-4538-9d20-665cf10707e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9297752808988764, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a55a1dc8-3aee-4538-9d20-665cf10707e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=073ad685-da0d-4b87-a9c0-f5a3a1d3a693"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c11c9c42-d619-4e8a-a14d-4e8181e9d3a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bce13659-45ae-4852-92df-bc5e5baa5a37"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba2d322c-6888-4401-a66b-394aaabefd8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57a11f1d-3fda-41d9-8793-c63304c8b630"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ee1afe5-845f-41e6-91f4-342321e65c90"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fedc2c94-55ed-4a2f-b6e5-94592986ad1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/150359c3-75c5-4a24-9c8c-d62c30b23ed0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1315, 25, 1.9011406844106464, 276.2281368821292, 77, 2823, 94.0, 651.2000000000003, 884.0000000000007, 1500.84, 5.090112408261852, 716.4679205886822, 3.72808321341893], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/97ac7069-145f-4589-a1d8-3da359841cc7", 3, 0, 0.0, 410.3333333333333, 402, 422, 407.0, 422.0, 422.0, 422.0, 0.021605427283333572, 0.025536883615164128, 0.013855042886773156], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1202.2142857142858, 952, 1590, 1222.5, 1412.8, 1446.1999999999998, 1590.0, 0.2544274927079263, 306.16127071908704, 1.251017993930087], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=068914a0-0d89-4d8c-bbed-8e2d38a07066", 1, 0, 0.0, 896.0, 896, 896, 896.0, 896.0, 896.0, 896.0, 1.1160714285714286, 0.20163399832589285, 0.7694789341517857], "isController": false}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 513.1666666666666, 86, 1447, 421.5, 1275.1000000000006, 1447.0, 1447.0, 0.07707772646399508, 0.015392963927624013, 0.05177405226512168], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 513.1666666666666, 86, 1447, 421.5, 1275.1000000000006, 1447.0, 1447.0, 0.07613053849667563, 0.015203803830634929, 0.051137814514287165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba2d322c-6888-4401-a66b-394aaabefd8b", 3, 0, 0.0, 260.6666666666667, 173, 406, 203.0, 406.0, 406.0, 406.0, 0.08421289018639119, 0.03810413976532674, 0.05400370887603862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 90.41176470588233, 78, 241, 81.0, 116.19999999999989, 241.0, 241.0, 0.08616626033361548, 0.030669011318191722, 0.04871601184532649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 91.58823529411764, 78, 238, 82.0, 117.99999999999989, 238.0, 238.0, 0.0861640766758913, 0.06403404526401686, 0.04325032755020324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 146.82352941176467, 79, 558, 84.0, 306.7999999999998, 558.0, 558.0, 0.08616538685724422, 1.5121807604095392, 0.050304390316531084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 166.11764705882356, 79, 722, 85.0, 339.5999999999997, 722.0, 722.0, 0.08616495012569945, 4.582527054843991, 0.05021998988828968], "isController": false}, {"data": ["goToProfile", 12, 2, 16.666666666666668, 191.33333333333334, 82, 402, 189.0, 346.20000000000016, 402.0, 402.0, 0.07723399325489792, 0.15835859863746363, 0.0499179992212239], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f4ef4bd0-dd61-4f7e-9e7f-dcf50553f557", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 1.7545930631868132, 3.2784598214285716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 94.14285714285714, 79, 244, 82.0, 168.0, 244.0, 244.0, 0.07803572921601962, 0.05799334954432708, 0.039170278141634846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 451.8333333333333, 387, 582, 405.0, 582.0, 582.0, 582.0, 0.03374388392103932, 9.921822275181373, 0.019244558798717733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 120.35714285714285, 79, 299, 82.5, 272.5, 299.0, 299.0, 0.07803572921601962, 0.02925251177503414, 0.044036624536662856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 634.6666666666667, 545, 713, 639.5, 713.0, 713.0, 713.0, 0.03371828373935767, 30.339770979094666, 0.019197030683638202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 137.33333333333331, 81, 243, 93.0, 243.0, 243.0, 243.0, 0.03380605466439039, 0.05982087016784706, 0.018718782221395853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 94.64285714285714, 80, 242, 83.0, 165.5, 242.0, 242.0, 0.07145737312488196, 0.05310455170706561, 0.03586825174432552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 126.57142857142856, 78, 250, 81.0, 246.5, 250.0, 250.0, 0.07140052122380494, 0.03442525130433452, 0.03986396288192904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 182.57142857142858, 79, 561, 81.5, 559.0, 561.0, 561.0, 0.071285999429712, 9.179792917354067, 0.04103320781905577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 182.42857142857144, 80, 559, 82.0, 553.0, 559.0, 559.0, 0.07128962939576947, 3.0109723969101037, 0.04110491605646138], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 135.5, 81, 245, 84.0, 245.0, 245.0, 245.0, 0.03380643561846057, 0.025123728032859855, 0.018983105938100417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 369.0, 79, 738, 235.0, 722.0, 738.0, 738.0, 0.09505132771696717, 40.52643994163098, 0.052010507549076504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 114.35714285714285, 78, 556, 80.0, 320.0, 556.0, 556.0, 0.0780352942487988, 5.034980235123128, 0.045397206615163374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 308.4736842105263, 78, 624, 240.0, 566.0, 624.0, 624.0, 0.09504895020935782, 13.25179537774454, 0.05210202785684628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 178.28571428571428, 78, 562, 84.5, 445.0, 562.0, 562.0, 0.07792800565534669, 1.6561766815750365, 0.045410892804461936], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 630.0, 105, 2432, 406.5, 2065.1000000000013, 2432.0, 2432.0, 0.07610784481610443, 0.015199271743059916, 0.05156851529450565], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 290.7857142857143, 162, 645, 171.0, 642.0, 645.0, 645.0, 0.07125443431613557, 12.272522604196885, 0.15764844779849244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7da5aea-ab62-444d-af10-40b2b9877c07", 1, 0, 0.0, 2432.0, 2432, 2432, 2432.0, 2432.0, 2432.0, 2432.0, 0.41118421052631576, 0.07428620990953948, 0.2834922388980263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 515.9047619047619, 118, 1345, 500.0, 1089.6000000000001, 1325.0999999999997, 1345.0, 0.09636608097504118, 0.05919361809892666, 0.04357177294086335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 90.99999999999997, 78, 241, 83.0, 87.0, 241.0, 241.0, 0.09512270829369887, 0.0706917783315477, 0.04774714068648557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 123.15789473684207, 78, 250, 81.0, 249.0, 250.0, 250.0, 0.0951260420056575, 0.09313121135504543, 0.05046725974416101], "isController": false}, {"data": ["login", 21, 0, 0.0, 2409.6666666666665, 1439, 3404, 2420.0, 3339.2000000000003, 3400.7, 3404.0, 0.09443210331771457, 32.406600045192505, 0.18721744144085403], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c11c9c42-d619-4e8a-a14d-4e8181e9d3a6", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ee1afe5-845f-41e6-91f4-342321e65c90", 3, 0, 0.0, 740.0, 203, 1611, 406.0, 1611.0, 1611.0, 1611.0, 0.02509515245305115, 0.02516867340750345, 0.016092920030114182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/073ad685-da0d-4b87-a9c0-f5a3a1d3a693", 2, 0, 0.0, 182.5, 174, 191, 182.5, 191.0, 191.0, 191.0, 0.02257693089201454, 0.03214566918023164, 0.014033414563249273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 87.71428571428571, 81, 116, 84.0, 107.5, 116.0, 116.0, 0.0760225026607876, 0.06154556123612589, 0.027023623992701837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 467.2631578947368, 161, 819, 482.0, 804.0, 819.0, 819.0, 0.09500807568643335, 53.91771777163559, 0.20216073835025977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 287.4117647058824, 164, 802, 311.0, 544.3999999999997, 802.0, 802.0, 0.08612697142104436, 6.186675302584315, 0.19240531891044313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 495.5, 82, 935, 637.5, 924.3000000000001, 935.0, 935.0, 0.05617125492200622, 40.32622158436642, 0.09088333511208975], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 1121.8095238095236, 167, 2067, 1047.0, 1788.6000000000004, 2045.5999999999997, 2067.0, 0.09917027536279793, 0.03115673271721832, 0.044742839079699843], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 102.11111111111111, 81, 246, 85.5, 237.0, 246.0, 246.0, 0.09053688372046234, 0.07028986577906988, 0.0321830328850081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 289.42857142857144, 159, 645, 246.5, 594.0, 645.0, 645.0, 0.07789331953508816, 6.768345919711461, 0.1737603486838811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 273.94444444444446, 162, 974, 172.0, 402.5000000000009, 974.0, 974.0, 0.11572883448204918, 7.861166134769443, 0.25863184407468365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 111.54545454545455, 79, 248, 81.0, 247.2, 248.0, 248.0, 0.05319328990826575, 0.03953134142596703, 0.02670053809848496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57a11f1d-3fda-41d9-8793-c63304c8b630", 1, 0, 0.0, 1209.0, 1209, 1209, 1209.0, 1209.0, 1209.0, 1209.0, 0.8271298593879239, 0.1494326406120761, 0.5702672663358147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 132.0, 78, 311, 83.0, 297.20000000000005, 311.0, 311.0, 0.05315267865340105, 0.014222494092804577, 0.030313637044517786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 127.27272727272728, 79, 245, 83.0, 244.2, 245.0, 245.0, 0.0531531923324104, 0.01432644637084499, 0.031248263461045957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 124.63636363636364, 79, 245, 81.0, 243.0, 245.0, 245.0, 0.05319354713915432, 0.014337323252350187, 0.031323934496982474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 115.0, 105, 125, 115.0, 125.0, 125.0, 125.0, 0.17656925929195727, 0.05207413701774521, 0.10914877063653218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ff5640c-3f27-404c-8516-c63e9d66aadb", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.550579202586207, 1.0287580818965518], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 778.9642857142858, 620, 1206, 650.0, 1059.9, 1111.8999999999999, 1206.0, 0.2608071982786725, 312.01608039381887, 0.5149923387885506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 1121.8095238095236, 167, 2067, 1047.0, 1788.6000000000004, 2045.5999999999997, 2067.0, 0.09446906138239726, 0.02967973301243843, 0.04262178355338627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 109.5, 80, 247, 82.5, 247.0, 247.0, 247.0, 0.03535192844769682, 0.009528449464418283, 0.02081759067769647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 82.5, 79, 86, 82.0, 86.0, 86.0, 86.0, 0.035385704175513094, 0.009537553078556263, 0.020802923743807503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fedc2c94-55ed-4a2f-b6e5-94592986ad1a", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.5018446180555556, 1.9151475694444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 129.0, 78, 547, 81.5, 347.20000000000033, 547.0, 547.0, 0.0911170955919574, 4.578045786656913, 0.05313186542004981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 119.49999999999999, 77, 547, 80.0, 341.8000000000003, 547.0, 547.0, 0.09111801808186447, 1.5116237958500804, 0.053221385778502224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 90.88888888888889, 79, 244, 82.0, 101.80000000000022, 244.0, 244.0, 0.09111755683457608, 0.06771529370225819, 0.04573674239548057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 85.0, 80, 94, 84.5, 94.0, 94.0, 94.0, 0.035385704175513094, 0.009468440375088464, 0.02018090941259731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 115.94444444444447, 78, 244, 82.0, 243.1, 244.0, 244.0, 0.0911170955919574, 0.031983919730900846, 0.05154008456172677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 83.66666666666666, 81, 88, 83.0, 88.0, 88.0, 88.0, 0.03538591286808721, 0.02629753876231872, 0.01776206954511409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 193.33333333333334, 84, 250, 246.0, 250.0, 250.0, 250.0, 0.036578228638314475, 0.028791066682110806, 0.013002417211275848], "isController": false}, {"data": ["deleteAccount", 11, 2, 18.181818181818183, 619.8181818181818, 82, 2823, 406.0, 2430.4000000000015, 2823.0, 2823.0, 0.10746280321606862, 0.021112853650316038, 0.07312698745127538], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/068914a0-0d89-4d8c-bbed-8e2d38a07066", 3, 0, 0.0, 1125.3333333333335, 187, 2823, 366.0, 2823.0, 2823.0, 2823.0, 0.01771991896090395, 0.024428338801897216, 0.011363359489902601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1325.238095238095, 812, 2257, 1255.0, 1769.6, 2208.5999999999995, 2257.0, 0.09571427920311025, 0.0495396171656723, 0.04402482959439935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 196.33333333333334, 164, 331, 170.0, 331.0, 331.0, 331.0, 0.03533444047913502, 0.05476148148475318, 0.07946798478852336], "isController": false}, {"data": ["addBook", 61, 11, 18.0327868852459, 808.8524590163935, 404, 2878, 690.0, 1198.4, 1358.1, 2878.0, 0.2858160281880201, 85.21454980754272, 1.0393867518414048], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97ac7069-145f-4589-a1d8-3da359841cc7", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/097302f5-32ff-499b-8c62-1662498c5ab7", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.6336030505952381, 1.1838882688492063], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 152.55357142857142, 78, 363, 84.0, 330.6, 343.45, 363.0, 0.26147208785462156, 0.19431665904039744, 0.12639519871878677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7da5aea-ab62-444d-af10-40b2b9877c07", 3, 0, 0.0, 325.3333333333333, 212, 520, 244.0, 520.0, 520.0, 520.0, 0.029410611348574565, 0.024518416557193834, 0.018860320428610643], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 445.74999999999983, 382, 665, 406.0, 571.0, 639.6999999999999, 665.0, 0.26145255569873194, 76.87573241731563, 0.1314922521336396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a55a1dc8-3aee-4538-9d20-665cf10707e9", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 129.17857142857144, 77, 338, 84.0, 243.60000000000002, 250.04999999999995, 338.0, 0.261830287218474, 0.46331687542956534, 0.12733543265117192], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 623.9999999999997, 536, 848, 563.0, 735.5000000000001, 793.4499999999999, 848.0, 0.261264707803417, 235.08644333588376, 0.13114263653413702], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 86.38888888888889, 83, 94, 85.0, 92.2, 94.0, 94.0, 0.12111914086156082, 0.09048451441317776, 0.04305406960313295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 11, 6.179775280898877, 148.18539325842707, 80, 1918, 88.0, 245.49999999999997, 316.3499999999999, 1513.520000000004, 0.7551876726219012, 1.6233270127024264, 0.36366028566670766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 84.72727272727272, 80, 89, 84.0, 89.0, 89.0, 89.0, 0.055995031713549775, 0.04336333998910642, 0.019904483929425898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a55a1dc8-3aee-4538-9d20-665cf10707e9", 3, 0, 0.0, 264.3333333333333, 168, 404, 221.0, 404.0, 404.0, 404.0, 0.04847701381594894, 0.031166048921386445, 0.03108714753171205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 100.52941176470587, 79, 239, 86.0, 142.1999999999999, 239.0, 239.0, 0.08114054975108943, 0.06584745785464387, 0.02884292979433257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=073ad685-da0d-4b87-a9c0-f5a3a1d3a693", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c11c9c42-d619-4e8a-a14d-4e8181e9d3a6", 3, 0, 0.0, 532.3333333333334, 216, 1021, 360.0, 1021.0, 1021.0, 1021.0, 0.032676534980230695, 0.03277226701630559, 0.020954679007504712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 274.7272727272727, 162, 493, 189.0, 491.2, 493.0, 493.0, 0.05313162635908285, 0.08234364358580516, 0.11949427295407013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bce13659-45ae-4852-92df-bc5e5baa5a37", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.9237104668674698, 3.5944559487951806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 239.27777777777783, 159, 628, 165.0, 575.8000000000001, 628.0, 628.0, 0.09107928958154127, 6.186785082920103, 0.20354481860041493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba2d322c-6888-4401-a66b-394aaabefd8b", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57a11f1d-3fda-41d9-8793-c63304c8b630", 3, 0, 0.0, 304.3333333333333, 172, 466, 275.0, 466.0, 466.0, 466.0, 0.017989386262105358, 0.021262845546127788, 0.011536162414175637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 90.50000000000001, 82, 162, 84.0, 127.5, 162.0, 162.0, 0.07627515718130605, 0.06323985199895395, 0.027113434779292386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ee1afe5-845f-41e6-91f4-342321e65c90", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fedc2c94-55ed-4a2f-b6e5-94592986ad1a", 3, 0, 0.0, 730.0, 208, 1122, 860.0, 1122.0, 1122.0, 1122.0, 0.0251637742306176, 0.025237496225433868, 0.016136925532004128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 86.89473684210525, 82, 118, 85.0, 91.0, 118.0, 118.0, 0.0986162581877446, 0.07656242701099313, 0.03505499802767484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/150359c3-75c5-4a24-9c8c-d62c30b23ed0", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 92.72222222222223, 78, 248, 83.0, 113.9000000000002, 248.0, 248.0, 0.11627155868483947, 0.08640884390543246, 0.058362872230476065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 116.38888888888887, 77, 246, 82.0, 239.70000000000002, 246.0, 246.0, 0.11615076369127127, 0.04077123703789741, 0.06570029634576792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 170.77777777777777, 78, 726, 83.0, 293.1000000000007, 726.0, 726.0, 0.11579211455699867, 5.817806183700974, 0.06752027166116654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 135.22222222222223, 79, 405, 82.0, 261.0000000000002, 405.0, 405.0, 0.11603171533552505, 1.9249354372139496, 0.06777329900728421], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 24.0, 0.45627376425855515], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.1520912547528517], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.1520912547528517], "isController": false}, {"data": ["401/Unauthorized", 15, 60.0, 1.1406844106463878], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1315, 25, "401/Unauthorized", 15, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
