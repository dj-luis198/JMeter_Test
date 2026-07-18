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

    var data = {"OkPercent": 97.08812260536398, "KoPercent": 2.9118773946360155};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7172050098879367, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a715ee7-ca0b-4722-8b0f-983d1fbed97b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/08facc8a-a2e8-444b-bbbc-a577538ce318"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81044e72-89ab-4a02-b036-78111637b93f"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f0208ed-31ac-4a98-a9bc-453c75decaca"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.38461538461538464, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ce88061-238e-4119-b98e-3dd197eb6c3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d65603df-f9f9-4587-964e-f1a5bfdff430"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08facc8a-a2e8-444b-bbbc-a577538ce318"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a715ee7-ca0b-4722-8b0f-983d1fbed97b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28ba2c04-2864-469a-8784-660bfee22631"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c192736-0eb0-42ef-b951-8f66c0e7ea79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.2413793103448276, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28ba2c04-2864-469a-8784-660bfee22631"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6aab6e43-bdc0-4f76-87fb-c46d784e2acc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.2636363636363636, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8976608187134503, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a03c188b-d3a3-4f43-b9a5-7f905c99735f"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90bb3281-7a4b-46a4-8aaa-ec017e5022a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/758f392e-a6df-4dfc-ba11-138623ab7cc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90bb3281-7a4b-46a4-8aaa-ec017e5022a0"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a03c188b-d3a3-4f43-b9a5-7f905c99735f"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c192736-0eb0-42ef-b951-8f66c0e7ea79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/205c6749-8a47-4ba5-aef7-c091933ca65c"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ce88061-238e-4119-b98e-3dd197eb6c3c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d65603df-f9f9-4587-964e-f1a5bfdff430"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81044e72-89ab-4a02-b036-78111637b93f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c0a17de-6a21-406c-9880-35cffe9bd86c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8f0208ed-31ac-4a98-a9bc-453c75decaca"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "register"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1305, 38, 2.9118773946360155, 483.50881226053576, 135, 2526, 162.0, 1391.4, 1692.000000000001, 2152.0800000000017, 5.303498276871058, 752.1904116218241, 3.886759548582889], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2473.690909090909, 1689, 3180, 2477.0, 2957.0, 3030.9999999999995, 3180.0, 0.23610419492762333, 284.11234414440133, 1.160922481895101], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 180.5, 146, 423, 160.5, 346.5000000000003, 423.0, 423.0, 0.062407688627238875, 0.048451281697905184, 0.02218398306671382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 482.4285714285714, 287, 1377, 325.0, 927.8000000000001, 1333.3999999999994, 1377.0, 0.1253259967892673, 7.3246704224679675, 0.28033415976379034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a715ee7-ca0b-4722-8b0f-983d1fbed97b", 3, 0, 0.0, 388.0, 323, 509, 332.0, 509.0, 509.0, 509.0, 0.024529242945798547, 0.028992734744854993, 0.0157300158213617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08facc8a-a2e8-444b-bbbc-a577538ce318", 3, 0, 0.0, 345.0, 240, 526, 269.0, 526.0, 526.0, 526.0, 0.09946619807035575, 0.04500586436126123, 0.06378528977819038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81044e72-89ab-4a02-b036-78111637b93f", 3, 0, 0.0, 346.3333333333333, 254, 493, 292.0, 493.0, 493.0, 493.0, 0.04804920238324044, 0.030891007391568966, 0.030812802309564995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 445.3157894736843, 287, 1857, 307.0, 616.0, 1857.0, 1857.0, 0.09336242309884624, 6.01570523333235, 0.20871703292990937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 148.9090909090909, 142, 159, 148.0, 158.8, 159.0, 159.0, 0.05088116934178269, 0.037813056512789676, 0.025539961954762016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 172.09090909090907, 143, 414, 147.0, 362.6000000000002, 414.0, 414.0, 0.050882346138723784, 0.013615002775400698, 0.029018838032240906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 205.81818181818184, 139, 472, 155.0, 467.20000000000005, 472.0, 472.0, 0.050882346138723784, 0.013714382357702894, 0.029913254272960658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 226.8181818181818, 141, 446, 156.0, 444.0, 446.0, 446.0, 0.0508821107749808, 0.013714318919819043, 0.02996280546612639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 154.0, 149, 164, 149.0, 164.0, 164.0, 164.0, 0.1165954139137194, 0.03438653808783521, 0.0720750947337738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f0208ed-31ac-4a98-a9bc-453c75decaca", 1, 0, 0.0, 754.0, 754, 754, 754.0, 754.0, 754.0, 754.0, 1.3262599469496021, 0.2396075099469496, 0.9143940649867374], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1726.581818181818, 1103, 2526, 1643.0, 2330.4, 2405.7999999999997, 2526.0, 0.2381375049251166, 284.89524588238606, 0.4702285497642439], "isController": false}, {"data": ["deleteBook", 13, 3, 23.076923076923077, 630.9999999999999, 150, 1464, 585.0, 1301.1999999999998, 1464.0, 1464.0, 0.10768185809187747, 0.02229350968308401, 0.07200091788429999], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, 23.076923076923077, 630.9999999999999, 150, 1464, 585.0, 1301.1999999999998, 1464.0, 1464.0, 0.10717936879596346, 0.022189478696039308, 0.07166493101358705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 1172.5217391304348, 203, 1975, 1050.0, 1868.2, 1955.7999999999997, 1975.0, 0.10874807326783233, 0.03376213959470066, 0.049064072118885284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ce88061-238e-4119-b98e-3dd197eb6c3c", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 210.7777777777778, 137, 439, 147.5, 434.5, 439.0, 439.0, 0.08484762780173938, 0.02978321136486837, 0.04799378078672606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 2, 0, 0.0, 146.0, 138, 154, 146.0, 154.0, 154.0, 154.0, 0.06516780710329098, 0.017564760508308894, 0.03837518328445748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 148.16666666666669, 137, 163, 148.0, 158.5, 163.0, 163.0, 0.08485082753126517, 0.06305808569462187, 0.04259113803815459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 2, 0, 0.0, 290.0, 148, 432, 290.0, 432.0, 432.0, 432.0, 0.06458279514337381, 0.017407081503487472, 0.03796761980108499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 260.94444444444446, 135, 1089, 148.0, 511.2000000000009, 1089.0, 1089.0, 0.08484842771149649, 1.407612951523265, 0.04955936267046285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 245.6666666666666, 137, 1338, 146.5, 529.8000000000013, 1338.0, 1338.0, 0.08484682790706445, 4.26300531736249, 0.049475570005703594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 195.83333333333334, 138, 433, 148.0, 432.1, 433.0, 433.0, 0.060243080831153706, 0.016237392880271897, 0.03541634244175247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 196.75, 139, 470, 146.0, 459.20000000000005, 470.0, 470.0, 0.06024338326840435, 0.01623747439656211, 0.035475351670749826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d65603df-f9f9-4587-964e-f1a5bfdff430", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 150.08333333333331, 142, 160, 148.5, 159.1, 160.0, 160.0, 0.060241568690448694, 0.044769368919366656, 0.03023844365907288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08facc8a-a2e8-444b-bbbc-a577538ce318", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 2, 0, 0.0, 146.5, 144, 149, 146.5, 149.0, 149.0, 149.0, 0.0651890482398957, 0.01744316329856584, 0.037178129074315516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 148.0, 138, 156, 147.0, 156.0, 156.0, 156.0, 0.060242173537621235, 0.016119487841121306, 0.034356864595674615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 2, 0, 0.0, 147.5, 145, 150, 147.5, 150.0, 150.0, 150.0, 0.06517630189663039, 0.048436685296226294, 0.03271544841295705], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 455.1538461538461, 145, 867, 493.0, 778.5999999999999, 867.0, 867.0, 0.10672446206766331, 0.021421857169831457, 0.07261945443275948], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 2, 0, 0.0, 156.0, 154, 158, 156.0, 158.0, 158.0, 158.0, 0.05028789821729401, 0.0395820761358779, 0.01787577631942873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1398.1304347826087, 836, 1931, 1421.0, 1770.0000000000002, 1907.1999999999996, 1931.0, 0.10816861135017942, 0.05598570704647958, 0.04975333588470167], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 271.35714285714283, 145, 426, 280.5, 387.0, 426.0, 426.0, 0.08037246898483831, 0.13556126534970636, 0.05194272636331801], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a715ee7-ca0b-4722-8b0f-983d1fbed97b", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.27331930786686837, 1.0430455748865355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28ba2c04-2864-469a-8784-660bfee22631", 3, 0, 0.0, 335.3333333333333, 265, 446, 295.0, 446.0, 446.0, 446.0, 0.06975933031042901, 0.031564280316242296, 0.04473498721078944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 0, 0.0, 439.0, 300, 578, 439.0, 578.0, 578.0, 578.0, 0.06426941739773129, 0.09960504434589801, 0.14454342604196793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c192736-0eb0-42ef-b951-8f66c0e7ea79", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 177.5238095238095, 137, 470, 148.0, 388.0000000000002, 467.19999999999993, 470.0, 0.12565069107880092, 0.09337907803805422, 0.06307075704541375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 184.9047619047619, 135, 434, 146.0, 426.40000000000003, 433.6, 434.0, 0.1256461803561172, 0.0426065823640628, 0.07115509599966495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 1109.3333333333333, 724, 1275, 1136.0, 1275.0, 1275.0, 1275.0, 0.077592226983128, 22.814691037451183, 0.044251816951315186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1467.6666666666667, 1005, 1755, 1584.0, 1755.0, 1755.0, 1755.0, 0.07729369025841858, 69.54899836233994, 0.044006075606111354], "isController": false}, {"data": ["addBook", 58, 17, 29.310344827586206, 1303.0517241379314, 740, 2749, 1095.5, 2294.9, 2501.7999999999997, 2749.0, 0.27451722832260506, 74.751283471578, 0.9982402646961378], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 248.66666666666666, 145, 458, 152.0, 458.0, 458.0, 458.0, 0.07825950853028643, 0.1384826459539834, 0.043333145836594145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 170.72727272727275, 140, 411, 145.0, 360.00000000000017, 411.0, 411.0, 0.05808458171180543, 0.043166373713558526, 0.029155737304558584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 223.72727272727272, 139, 442, 148.0, 441.2, 442.0, 442.0, 0.0580815147659051, 0.0155413428182207, 0.033124613889930245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 265.3636363636364, 140, 596, 153.0, 565.0000000000001, 596.0, 596.0, 0.05808458171180543, 0.01565560991451006, 0.03414738104541686], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 267.2727272727273, 138, 640, 156.0, 590.0, 624.8, 640.0, 0.2398102446936533, 0.17821835567565444, 0.11592389758140467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 185.72727272727272, 136, 582, 145.0, 497.2000000000003, 582.0, 582.0, 0.05808090141558997, 0.015654617959670734, 0.034201937064063236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28ba2c04-2864-469a-8784-660bfee22631", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6aab6e43-bdc0-4f76-87fb-c46d784e2acc", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.6779956210191083, 1.266835854564756], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 950.3272727272728, 676, 1463, 882.0, 1208.3999999999999, 1301.4, 1463.0, 0.23921363952679192, 70.33675266125174, 0.12030764097294712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 147.55555555555557, 145, 156, 147.0, 156.0, 156.0, 156.0, 0.07825950853028643, 0.05815965428862107, 0.043944548246987014], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 199.74545454545455, 135, 549, 149.0, 462.8, 467.0, 549.0, 0.24029954430468234, 0.42521755300789493, 0.11686442682005059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 905.2631578947369, 136, 1893, 1267.0, 1789.0, 1893.0, 1893.0, 0.09512794708883449, 45.062826298246144, 0.05162216618852357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 239.2857142857143, 137, 1154, 151.0, 464.0, 1085.599999999999, 1154.0, 0.12544578054156735, 5.407265000104538, 0.07323504133737149], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1457.418181818182, 955, 1937, 1444.0, 1797.9999999999998, 1877.3999999999999, 1937.0, 0.23877227636805662, 214.8477139928694, 0.11985249028630966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 205.26315789473685, 149, 459, 159.0, 447.0, 459.0, 459.0, 0.09156847152943445, 0.06840808664064194, 0.03254973011397865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 664.1578947368421, 137, 1306, 836.0, 1261.0, 1306.0, 1306.0, 0.09513795002753993, 14.735155037304091, 0.05172050254118472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 284.5238095238096, 138, 1230, 156.0, 466.4, 1153.699999999999, 1230.0, 0.1254307950520538, 1.7884270866308691, 0.07334878384391631], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 434.61538461538464, 149, 754, 477.0, 745.6, 754.0, 754.0, 0.10754645179437118, 0.02226547634805341, 0.07237895595145519], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 17, 9.941520467836257, 202.50877192982458, 139, 510, 158.0, 357.8, 391.40000000000003, 495.6, 0.7421907213138945, 1.6543015119965798, 0.35485315691474356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 154.72727272727275, 142, 179, 152.0, 176.20000000000002, 179.0, 179.0, 0.05167278910925507, 0.040016134534803974, 0.018368061753680512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a03c188b-d3a3-4f43-b9a5-7f905c99735f", 1, 0, 0.0, 733.0, 733, 733, 733.0, 733.0, 733.0, 733.0, 1.364256480218281, 0.24647211800818555, 0.9405908935879945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 479.18181818181813, 291, 854, 315.0, 831.4000000000001, 854.0, 854.0, 0.05803585560679125, 0.08994424106247823, 0.1305239994750393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90bb3281-7a4b-46a4-8aaa-ec017e5022a0", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 0.6022135416666667, 2.2981770833333335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/758f392e-a6df-4dfc-ba11-138623ab7cc8", 2, 0, 0.0, 256.5, 254, 259, 256.5, 259.0, 259.0, 259.0, 0.011575949806681638, 0.022891892928252264, 0.007195402394485218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 168.33333333333331, 146, 447, 150.0, 193.2000000000004, 447.0, 447.0, 0.08560137342648032, 0.06946752081777846, 0.030428613210194175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90bb3281-7a4b-46a4-8aaa-ec017e5022a0", 3, 0, 0.0, 350.3333333333333, 260, 502, 289.0, 502.0, 502.0, 502.0, 0.09902297332981251, 0.04590127409559018, 0.06350106037100607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 651.8260869565219, 159, 1366, 663.0, 1184.0000000000002, 1336.3999999999996, 1366.0, 0.10722560733982592, 0.06586416700854542, 0.04848189081869082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 149.73684210526318, 136, 163, 149.0, 161.0, 163.0, 163.0, 0.09513080485667794, 0.07069779540618351, 0.047751204781574665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 275.7368421052632, 141, 585, 157.0, 451.0, 585.0, 585.0, 0.095128899659038, 0.10065396424655407, 0.050048284175057196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a03c188b-d3a3-4f43-b9a5-7f905c99735f", 3, 0, 0.0, 730.0, 348, 1358, 484.0, 1358.0, 1358.0, 1358.0, 0.032236573467150934, 0.026874304898884614, 0.02067254222991124], "isController": false}, {"data": ["login", 23, 0, 0.0, 2983.3478260869565, 1235, 4870, 3129.0, 4127.400000000001, 4728.199999999998, 4870.0, 0.10813250463089205, 50.7641293261817, 0.23331222349813355], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0c192736-0eb0-42ef-b951-8f66c0e7ea79", 3, 0, 0.0, 395.3333333333333, 297, 509, 380.0, 509.0, 509.0, 509.0, 0.03014469453376206, 0.025130391504220258, 0.019331070387861738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/205c6749-8a47-4ba5-aef7-c091933ca65c", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.9283021438953489, 1.7345339752906979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 408.7272727272727, 292, 615, 308.0, 613.0, 615.0, 615.0, 0.05084683085570594, 0.0788026568046927, 0.11435571431708083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 158.14285714285717, 147, 177, 157.0, 172.6, 176.6, 177.0, 0.12775587677033143, 0.1034273650806687, 0.04541322182070375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 376.91666666666663, 292, 626, 310.5, 612.8000000000001, 626.0, 626.0, 0.06019684367882977, 0.09329335050615513, 0.13538411229721187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ce88061-238e-4119-b98e-3dd197eb6c3c", 3, 0, 0.0, 461.6666666666667, 313, 646, 426.0, 646.0, 646.0, 646.0, 0.024891514482712845, 0.0294209274370867, 0.015962331878562597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d65603df-f9f9-4587-964e-f1a5bfdff430", 3, 0, 0.0, 514.6666666666666, 245, 867, 432.0, 867.0, 867.0, 867.0, 0.035174111853675694, 0.029323209784265444, 0.02255631521866573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 176.09090909090912, 144, 410, 152.0, 361.20000000000016, 410.0, 410.0, 0.0588181823042825, 0.048766246851890474, 0.02090802574097542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1074.157894736842, 282, 2039, 1459.0, 1941.0, 2039.0, 2039.0, 0.09505560753040529, 59.922178497858745, 0.20098183218432783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81044e72-89ab-4a02-b036-78111637b93f", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 154.1578947368421, 143, 175, 153.0, 172.0, 175.0, 175.0, 0.09471018682830538, 0.073529881375491, 0.03366651172412418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c0a17de-6a21-406c-9880-35cffe9bd86c", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.8381520669291338, 1.5660884186351707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f0208ed-31ac-4a98-a9bc-453c75decaca", 3, 0, 0.0, 675.6666666666666, 334, 1205, 488.0, 1205.0, 1205.0, 1205.0, 0.021042147421284834, 0.024871105887592847, 0.013493825006487995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 476.27777777777777, 282, 1487, 313.0, 698.6000000000013, 1487.0, 1487.0, 0.08479087273361063, 5.75962887947684, 0.18949140785822965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, 40.0, 1056.5333333333333, 145, 1903, 1423.0, 1889.8, 1903.0, 1903.0, 0.12865928448283256, 92.36651063154554, 0.208166701690583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 149.05263157894737, 137, 158, 149.0, 157.0, 158.0, 158.0, 0.09343634280318863, 0.0694385321027603, 0.0469006642586318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 177.21052631578948, 138, 432, 148.0, 415.0, 432.0, 432.0, 0.09343312646911298, 0.03238656480816704, 0.05287308400621576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 277.5263157894737, 137, 1698, 148.0, 469.0, 1698.0, 1698.0, 0.09343312646911298, 4.4486625309189884, 0.05450585862584458], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 1172.5217391304348, 203, 1975, 1050.0, 1868.2, 1955.7999999999997, 1975.0, 0.10940242492853167, 0.03396529089153463, 0.04935929718455238], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 232.57894736842104, 136, 1236, 148.0, 426.0, 1236.0, 1236.0, 0.09343128866334248, 1.4697467796939387, 0.0545960280023407], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 23.68421052631579, 0.6896551724137931], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 7.894736842105263, 0.22988505747126436], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.894736842105263, 0.22988505747126436], "isController": false}, {"data": ["401/Unauthorized", 23, 60.526315789473685, 1.7624521072796935], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1305, 38, "401/Unauthorized", 23, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
