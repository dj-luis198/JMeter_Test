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

    var data = {"OkPercent": 97.97687861271676, "KoPercent": 2.023121387283237};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.829397141081417, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.475, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c58728d-5afe-435b-9757-f9f2bd983280"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e33da85b-8f86-4731-970d-dc8fb7fa903c"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1018507d-ecc8-40b0-8e84-59c2b62e09b1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a1eb44b-26cf-45a6-b62a-f7a74a9f6114"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/51bb3051-f44f-4a23-8f4c-d6dc2ad0002b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0c61f08-160a-4acd-bd99-5c421707f45b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2be4a688-b2c9-4a3c-9d12-821772f9480a"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8958333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=982fb7ef-7278-4d52-802d-414266f0640f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d1b83b5d-35db-4e78-98a6-ea7624dfcfaa"], "isController": false}, {"data": [0.0625, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b597dac1-4fe2-49e4-bd92-2b00ce327ede"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be09acfa-96f1-4b50-aa71-a79aa7ea8818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/93f99da1-2609-4f05-bb7c-a1b4153ea67a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1e8005c-3c4d-40dd-a09a-1b55f1b8bae0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68097000-7bbb-41e7-a036-568831972a89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8aabd0ad-6178-40ec-9a91-5ff8ec9cfd36"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c61d38d-db12-4139-9174-ef88ac9be000"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a3fd9d0-6d2b-4aaa-830e-98b5de178b67"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e33da85b-8f86-4731-970d-dc8fb7fa903c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51bb3051-f44f-4a23-8f4c-d6dc2ad0002b"], "isController": false}, {"data": [0.4180327868852459, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a1eb44b-26cf-45a6-b62a-f7a74a9f6114"], "isController": false}, {"data": [0.8416666666666667, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9423076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2be4a688-b2c9-4a3c-9d12-821772f9480a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1b83b5d-35db-4e78-98a6-ea7624dfcfaa"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09ecf5fd-b87e-4ca4-a08f-1889d95bf067"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b597dac1-4fe2-49e4-bd92-2b00ce327ede"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7c61d38d-db12-4139-9174-ef88ac9be000"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/982fb7ef-7278-4d52-802d-414266f0640f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68097000-7bbb-41e7-a036-568831972a89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1e8005c-3c4d-40dd-a09a-1b55f1b8bae0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be09acfa-96f1-4b50-aa71-a79aa7ea8818"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1384, 28, 2.023121387283237, 267.5693641618499, 81, 1410, 95.0, 674.0, 825.0, 1199.3500000000008, 5.417741537714762, 771.5290330172984, 3.957995499242534], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 1221.6833333333332, 993, 1607, 1192.0, 1455.7, 1519.3999999999999, 1607.0, 0.2566339886054509, 308.81753199771384, 1.2618673170199661], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5c58728d-5afe-435b-9757-f9f2bd983280", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.947170350609756, 3.6382907774390243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e33da85b-8f86-4731-970d-dc8fb7fa903c", 3, 0, 0.0, 319.0, 192, 420, 345.0, 420.0, 420.0, 420.0, 0.029574424038091858, 0.02966106785851596, 0.018965369581719065], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 405.9285714285715, 87, 949, 395.0, 914.5, 949.0, 949.0, 0.09280619415055816, 0.019038993931137803, 0.06212758407246838], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 405.9285714285715, 87, 949, 395.0, 914.5, 949.0, 949.0, 0.0913039508523876, 0.018730811904078676, 0.061121931942687203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 130.26315789473685, 83, 258, 86.0, 257.0, 258.0, 258.0, 0.10434457874995196, 0.04441723896006898, 0.05858656343875797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 94.57894736842105, 83, 257, 85.0, 94.0, 257.0, 257.0, 0.10434400571146137, 0.07754471518205283, 0.05237579974188588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1018507d-ecc8-40b0-8e84-59c2b62e09b1", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.8701251702997276, 1.6258302111716623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 146.47368421052633, 82, 586, 87.0, 416.0, 586.0, 586.0, 0.10434285965336204, 3.254664880939305, 0.06050019529962875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 190.73684210526318, 83, 758, 86.0, 743.0, 758.0, 758.0, 0.10434343267926476, 9.908153323750213, 0.06039862966868214], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 180.42857142857147, 83, 333, 172.5, 323.0, 333.0, 333.0, 0.09362794928040233, 0.16551430793898134, 0.06050941337073993], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7a1eb44b-26cf-45a6-b62a-f7a74a9f6114", 3, 0, 0.0, 268.3333333333333, 173, 390, 242.0, 390.0, 390.0, 390.0, 0.016566256743847013, 0.02283792230149483, 0.010623543549927936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 87.3157894736842, 82, 115, 85.0, 93.0, 115.0, 115.0, 0.09049989282907428, 0.06725626801066946, 0.04542670401771893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 84.52631578947367, 82, 87, 85.0, 87.0, 87.0, 87.0, 0.09050032389589605, 0.024215906979956563, 0.05161346597187822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 511.66666666666663, 411, 589, 534.0, 589.0, 589.0, 589.0, 0.02932365001246255, 8.62212674048081, 0.016723644147732548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 654.3333333333333, 568, 738, 655.0, 738.0, 738.0, 738.0, 0.029322933466263964, 26.3848270771633, 0.01669459981526552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 235.66666666666669, 85, 309, 255.5, 309.0, 309.0, 309.0, 0.029370156983489076, 0.05197141059968966, 0.01626257715784991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51bb3051-f44f-4a23-8f4c-d6dc2ad0002b", 3, 0, 0.0, 296.0, 163, 539, 186.0, 539.0, 539.0, 539.0, 0.030696189579666844, 0.024950646282691443, 0.019684730947898334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 87.08333333333334, 83, 93, 87.0, 91.80000000000001, 93.0, 93.0, 0.07468817686160281, 0.05550556893718724, 0.037489963776234224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 148.91666666666669, 85, 334, 87.5, 310.9000000000001, 334.0, 334.0, 0.07469003634915103, 0.029333831007568593, 0.04207392835358263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 168.41666666666666, 81, 587, 86.0, 488.30000000000035, 587.0, 587.0, 0.07469003634915103, 5.618972523791889, 0.04337468256734552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 162.5, 82, 422, 86.0, 395.6000000000001, 422.0, 422.0, 0.0745749229392463, 1.8457172049008153, 0.043380659925922244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0c61f08-160a-4acd-bd99-5c421707f45b", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 1.0301159274193548, 1.924773185483871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 86.0, 84, 88, 86.0, 88.0, 88.0, 88.0, 0.029394473838918283, 0.021844916593180483, 0.016505685993533217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 420.27777777777766, 82, 833, 415.0, 770.9000000000001, 833.0, 833.0, 0.08584141275889533, 38.631695518422525, 0.04677686359322616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 138.47368421052633, 83, 259, 86.0, 257.0, 259.0, 259.0, 0.09049946176635897, 0.02439243305421394, 0.05320378513998838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 316.83333333333337, 84, 601, 329.0, 596.5, 601.0, 601.0, 0.08577759775072077, 12.622290783077986, 0.04682585658462198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 103.5263157894737, 81, 256, 86.0, 255.0, 256.0, 256.0, 0.09049989282907428, 0.024392549239086427, 0.05329241735930839], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2be4a688-b2c9-4a3c-9d12-821772f9480a", 3, 0, 0.0, 255.0, 194, 371, 200.0, 371.0, 371.0, 371.0, 0.032190913578127346, 0.026836240128119835, 0.02064326163701526], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 363.2142857142858, 86, 818, 368.5, 704.0, 818.0, 818.0, 0.09128906683011757, 0.018727758478472082, 0.0615449798348972], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 293.16666666666674, 171, 674, 257.0, 598.1000000000003, 674.0, 674.0, 0.07453323561197997, 7.5365244395255955, 0.1660378248406852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 429.5416666666667, 110, 1007, 405.5, 841.0, 979.0, 1007.0, 0.10449411785194924, 0.06418632825085555, 0.047246852114699714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 96.66666666666669, 83, 260, 86.5, 116.00000000000023, 260.0, 260.0, 0.08583977529054379, 0.06379303612900764, 0.04308754345638624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=982fb7ef-7278-4d52-802d-414266f0640f", 1, 0, 0.0, 818.0, 818, 818, 818.0, 818.0, 818.0, 818.0, 1.2224938875305624, 0.2208607121026895, 0.8428522310513448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 142.94444444444443, 82, 264, 86.0, 260.4, 264.0, 264.0, 0.08577269283369152, 0.08736417834525415, 0.045315455881862414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1b83b5d-35db-4e78-98a6-ea7624dfcfaa", 3, 0, 0.0, 586.0, 169, 1207, 382.0, 1207.0, 1207.0, 1207.0, 0.050039197371274165, 0.03217038242456591, 0.03208893841842777], "isController": false}, {"data": ["login", 24, 0, 0.0, 1939.5416666666665, 1323, 2744, 1888.5, 2625.5, 2740.25, 2744.0, 0.1009773768601926, 30.339486138225407, 0.19421381223256773], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 98.36842105263159, 87, 260, 88.0, 98.0, 260.0, 260.0, 0.08953774958647698, 0.07248710391327091, 0.031827871923317985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b597dac1-4fe2-49e4-bd92-2b00ce327ede", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.5251862281976745, 2.0042242005813957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be09acfa-96f1-4b50-aa71-a79aa7ea8818", 3, 0, 0.0, 329.3333333333333, 179, 411, 398.0, 411.0, 411.0, 411.0, 0.050779464784441175, 0.03264630304338259, 0.03256365417491833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93f99da1-2609-4f05-bb7c-a1b4153ea67a", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.5859375, 1.094825114678899], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1e8005c-3c4d-40dd-a09a-1b55f1b8bae0", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 528.0000000000001, 170, 922, 586.0, 868.9000000000001, 922.0, 922.0, 0.08573592382839479, 51.351422732582506, 0.18185393218288426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68097000-7bbb-41e7-a036-568831972a89", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8aabd0ad-6178-40ec-9a91-5ff8ec9cfd36", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 413.25, 83, 824, 370.5, 821.0, 824.0, 824.0, 0.05862094233164798, 35.07335632373415, 0.08551272715615153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 313.63157894736844, 170, 1016, 183.0, 829.0, 1016.0, 1016.0, 0.10429417544475977, 13.278525786391807, 0.23175113522837681], "isController": false}, {"data": ["register", 24, 6, 25.0, 810.4583333333333, 137, 1324, 871.0, 1200.5, 1311.25, 1324.0, 0.10170008644507347, 0.032079226486092516, 0.04588421868908588], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 244.94736842105263, 171, 371, 175.0, 349.0, 371.0, 371.0, 0.09046240572865087, 0.14019906044078997, 0.20345207069637006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 99.44444444444446, 87, 255, 89.5, 114.60000000000022, 255.0, 255.0, 0.09985742578651592, 0.07752602880886733, 0.03549619432255058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c61d38d-db12-4139-9174-ef88ac9be000", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.5176620702005731, 1.9755103868194843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 316.85714285714283, 171, 814, 261.0, 748.0, 814.0, 814.0, 0.09806256391577826, 16.889826490550973, 0.21696068654301445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 121.7142857142857, 83, 412, 86.0, 337.5, 412.0, 412.0, 0.06584516978647352, 0.04893376387451792, 0.03305118874047597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 97.07142857142856, 83, 255, 85.0, 171.5, 255.0, 255.0, 0.06584609885380756, 0.02468310095147613, 0.03715785014838889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 180.14285714285717, 84, 573, 86.0, 414.5, 573.0, 573.0, 0.06569500624102559, 4.238762231295693, 0.03821821652135557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 168.14285714285714, 83, 580, 86.0, 417.5, 580.0, 580.0, 0.0656931566500244, 1.3961537096690941, 0.03828129399095311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 89.33333333333333, 86, 93, 89.0, 93.0, 93.0, 93.0, 0.18718412678604857, 0.055204693641979156, 0.11571050024957882], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 801.4833333333333, 647, 1243, 678.5, 1093.0, 1107.75, 1243.0, 0.25836900260952694, 309.09915071955766, 0.5101778547621714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 810.4583333333333, 137, 1324, 871.0, 1200.5, 1311.25, 1324.0, 0.10113780025284451, 0.03190186472819216, 0.04563053097345132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 86.0, 83, 89, 86.0, 89.0, 89.0, 89.0, 0.03326237360298031, 0.008965249135178287, 0.019587120393161257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 85.71428571428572, 82, 90, 85.0, 90.0, 90.0, 90.0, 0.033262531658802455, 0.008965291736161599, 0.01955473052597566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a3fd9d0-6d2b-4aaa-830e-98b5de178b67", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.9979248046875, 1.8646240234375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 113.55555555555556, 83, 591, 85.0, 138.30000000000072, 591.0, 591.0, 0.1017984390906006, 5.114714336966972, 0.05936033112770049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 132.05555555555557, 82, 591, 85.5, 289.50000000000045, 591.0, 591.0, 0.1017984390906006, 1.6888091526693814, 0.059459743665874906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 85.85714285714286, 83, 88, 86.0, 88.0, 88.0, 88.0, 0.033262531658802455, 0.0089003258540155, 0.018970037586660774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 86.05555555555556, 83, 89, 86.0, 88.1, 89.0, 89.0, 0.1017984390906006, 0.07565294155072956, 0.05109804462164914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 86.0, 83, 89, 86.0, 89.0, 89.0, 89.0, 0.033262531658802455, 0.024719518156590497, 0.016696231711547327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 112.77777777777779, 81, 255, 86.0, 251.4, 255.0, 255.0, 0.10180074201429734, 0.03573409292711067, 0.057583253919328566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 89.85714285714286, 88, 92, 89.0, 92.0, 92.0, 92.0, 0.03248259860788863, 0.02556735788863109, 0.011546548723897912], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 342.8571428571428, 85, 539, 378.0, 513.0, 539.0, 539.0, 0.09170766217517475, 0.018276282842806517, 0.062402918841994254], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1077.7083333333333, 647, 1410, 1057.5, 1399.5, 1408.5, 1410.0, 0.10223859933118916, 0.05291646254446314, 0.04702576199706064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 174.0, 171, 178, 174.0, 178.0, 178.0, 178.0, 0.033248470570353766, 0.05152863554214006, 0.0747765895737546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e33da85b-8f86-4731-970d-dc8fb7fa903c", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51bb3051-f44f-4a23-8f4c-d6dc2ad0002b", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["addBook", 61, 10, 16.39344262295082, 808.0819672131146, 435, 1458, 712.0, 1226.2, 1336.0, 1458.0, 0.28501343301016235, 90.5366177286532, 1.0356786955379045], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 160.56666666666666, 83, 358, 88.0, 343.8, 346.95, 358.0, 0.25904051393637967, 0.19250960068904777, 0.1252197796860429], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a1eb44b-26cf-45a6-b62a-f7a74a9f6114", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 477.4999999999999, 407, 679, 422.5, 601.9, 674.3499999999999, 679.0, 0.2587947067855972, 76.09423658796432, 0.13015554101033455], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 141.03333333333327, 82, 267, 89.0, 256.9, 262.75, 267.0, 0.2593540355487931, 0.45893507071720036, 0.1261311618196279], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 636.8833333333334, 561, 861, 587.0, 765.6, 822.2999999999997, 861.0, 0.2588192665061987, 232.88603095801952, 0.12991513963299428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 91.42857142857143, 85, 102, 90.5, 99.5, 102.0, 102.0, 0.09993860914009965, 0.0746611679611096, 0.035525052467769797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 10, 5.4945054945054945, 135.22527472527477, 84, 618, 91.0, 253.50000000000009, 296.7, 490.1799999999981, 0.7334391849959299, 1.59882564095331, 0.3512218487301831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 101.21428571428571, 86, 256, 88.5, 177.5, 256.0, 256.0, 0.06481391462155618, 0.050192806928607475, 0.023039321213131302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2be4a688-b2c9-4a3c-9d12-821772f9480a", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 118.1578947368421, 86, 265, 89.0, 258.0, 265.0, 265.0, 0.1020978419740349, 0.0828547916801006, 0.03629259226420772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1b83b5d-35db-4e78-98a6-ea7624dfcfaa", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.504648219273743, 1.925846717877095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 315.78571428571433, 170, 666, 256.5, 664.5, 666.0, 666.0, 0.06566573327517226, 5.705860278270271, 0.14648368792829303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 237.8333333333333, 170, 678, 174.5, 376.50000000000045, 678.0, 678.0, 0.10174895142052842, 6.9115481438588855, 0.22738947520151945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09ecf5fd-b87e-4ca4-a08f-1889d95bf067", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 89.66666666666667, 86, 100, 89.0, 97.30000000000001, 100.0, 100.0, 0.07229786721291721, 0.05994227467164719, 0.02569963248584167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b597dac1-4fe2-49e4-bd92-2b00ce327ede", 3, 0, 0.0, 251.0, 172, 374, 207.0, 374.0, 374.0, 374.0, 0.028764562059542642, 0.029036102521693273, 0.018446024497818687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c61d38d-db12-4139-9174-ef88ac9be000", 3, 0, 0.0, 284.6666666666667, 167, 374, 313.0, 374.0, 374.0, 374.0, 0.03738364340988673, 0.03116520532966143, 0.023973234868970333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 88.72222222222221, 84, 96, 87.5, 95.1, 96.0, 96.0, 0.08450347168429503, 0.06560572264552203, 0.030038343450276752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/982fb7ef-7278-4d52-802d-414266f0640f", 3, 0, 0.0, 304.3333333333333, 172, 487, 254.0, 487.0, 487.0, 487.0, 0.034681679980578264, 0.028912689593183893, 0.0222405304562953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68097000-7bbb-41e7-a036-568831972a89", 3, 0, 0.0, 278.3333333333333, 193, 430, 212.0, 430.0, 430.0, 430.0, 0.0404214611010806, 0.02598710471179498, 0.02592131457328411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1e8005c-3c4d-40dd-a09a-1b55f1b8bae0", 3, 0, 0.0, 358.6666666666667, 333, 379, 364.0, 379.0, 379.0, 379.0, 0.027837835329924746, 0.03290337893325415, 0.017851736848942628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 87.28571428571428, 85, 96, 86.5, 92.5, 96.0, 96.0, 0.09824423516862922, 0.07301158492512386, 0.04931400085612833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 133.42857142857142, 83, 262, 84.5, 261.0, 262.0, 262.0, 0.09812579727210283, 0.04731065225619244, 0.054785078220278394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be09acfa-96f1-4b50-aa71-a79aa7ea8818", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 202.21428571428572, 81, 727, 85.5, 653.5, 727.0, 727.0, 0.09824768240734892, 12.651760322147132, 0.056552725671417635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 182.28571428571428, 83, 595, 86.5, 507.0, 595.0, 595.0, 0.09812442176680031, 4.144360517886681, 0.05657759977151028], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 21.428571428571427, 0.43352601156069365], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.21676300578034682], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.714285714285714, 0.21676300578034682], "isController": false}, {"data": ["401/Unauthorized", 16, 57.142857142857146, 1.1560693641618498], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1384, 28, "401/Unauthorized", 16, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
