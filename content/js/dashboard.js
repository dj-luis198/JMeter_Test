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

    var data = {"OkPercent": 98.52598913886735, "KoPercent": 1.474010861132661};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7483377659574468, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23bc3af0-bc79-473e-a79f-2f277e978eff"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/14efc05e-ca40-4efe-b434-f60acee94a08"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fe042c25-d715-42a4-8e3a-db371082d4f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7eba68e-dc07-444d-833c-16315b13971b"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8749452-0e89-4af8-949b-ed94d3475731"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1cf28bb-5765-416f-b4ea-5c5923a1cd45"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f2a6c23b-583a-424a-97ec-56eaf507735d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c991e61a-0a3e-44d4-9dcf-bb14b7b0760c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49be9f24-3539-476f-ad0f-eb65a34d1ca0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eccbcc73-6ef4-498c-b95a-639da3ebe065"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.575, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8749452-0e89-4af8-949b-ed94d3475731"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dde7025b-7f1e-46dd-a188-a0fbb9a6d9bc"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3fd44315-226c-4ffb-b0f7-c39d87fcf3fd"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af3bd42d-a858-48b0-97cc-4f008bbe39c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4fd03ae-8136-4da5-81f8-29fb072fecb1"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24545454545454545, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14efc05e-ca40-4efe-b434-f60acee94a08"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c1e558d1-f6d7-4483-843a-c9ac87725d88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe042c25-d715-42a4-8e3a-db371082d4f4"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dde7025b-7f1e-46dd-a188-a0fbb9a6d9bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2a6c23b-583a-424a-97ec-56eaf507735d"], "isController": false}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7eba68e-dc07-444d-833c-16315b13971b"], "isController": false}, {"data": [0.2796610169491525, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49be9f24-3539-476f-ad0f-eb65a34d1ca0"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23bc3af0-bc79-473e-a79f-2f277e978eff"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.37272727272727274, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9364161849710982, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eccbcc73-6ef4-498c-b95a-639da3ebe065"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c991e61a-0a3e-44d4-9dcf-bb14b7b0760c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1cf28bb-5765-416f-b4ea-5c5923a1cd45"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3fd44315-226c-4ffb-b0f7-c39d87fcf3fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1e558d1-f6d7-4483-843a-c9ac87725d88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af3bd42d-a858-48b0-97cc-4f008bbe39c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9c8931a-94bf-4010-9059-fbe63c39d286"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1289, 19, 1.474010861132661, 442.5259891388676, 129, 2364, 144.0, 1290.0, 1565.0, 1974.7999999999984, 5.009346375510553, 700.6317995306895, 3.6570570903722612], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2197.7454545454534, 1618, 2927, 2129.0, 2698.7999999999997, 2805.8, 2927.0, 0.25008184496744384, 300.9332617521416, 1.2296504779405077], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/23bc3af0-bc79-473e-a79f-2f277e978eff", 3, 0, 0.0, 328.0, 223, 471, 290.0, 471.0, 471.0, 471.0, 0.06658676255160474, 0.030128776024326363, 0.04270049551649132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14efc05e-ca40-4efe-b434-f60acee94a08", 3, 0, 0.0, 497.33333333333337, 361, 765, 366.0, 765.0, 765.0, 765.0, 0.02625039375590634, 0.031027076734276012, 0.016833748599979], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 600.1999999999999, 136, 1300, 529.0, 1072.6000000000001, 1300.0, 1300.0, 0.08649621146593779, 0.016285614815071098, 0.05851446180615622], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 600.1999999999999, 136, 1300, 529.0, 1072.6000000000001, 1300.0, 1300.0, 0.08591409735785513, 0.01617601364315866, 0.05812066312796046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe042c25-d715-42a4-8e3a-db371082d4f4", 3, 0, 0.0, 522.0, 242, 764, 560.0, 764.0, 764.0, 764.0, 0.05339408393549994, 0.03432725122806393, 0.03424034679457516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 213.9375, 130, 402, 134.0, 395.7, 402.0, 402.0, 0.10487814470562017, 0.03790822588785905, 0.05926280906278268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 150.125, 131, 393, 133.5, 214.50000000000017, 393.0, 393.0, 0.10488020713840909, 0.0779432008128216, 0.052644947723771755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 255.6875, 131, 792, 134.5, 514.8000000000003, 792.0, 792.0, 0.10487883217420374, 1.9538675503254523, 0.061196388890709705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 295.1875, 130, 1435, 133.0, 709.1000000000008, 1435.0, 1435.0, 0.10488020713840909, 5.924713883927108, 0.06109476909966897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7eba68e-dc07-444d-833c-16315b13971b", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 280.53333333333336, 139, 461, 266.0, 404.00000000000006, 461.0, 461.0, 0.08623167576889912, 0.1665180817045128, 0.05574181697326818], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a8749452-0e89-4af8-949b-ed94d3475731", 2, 0, 0.0, 255.5, 237, 274, 255.5, 274.0, 274.0, 274.0, 0.024526635926616306, 0.028370898686598648, 0.01524531617899539], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1cf28bb-5765-416f-b4ea-5c5923a1cd45", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2a6c23b-583a-424a-97ec-56eaf507735d", 3, 0, 0.0, 421.6666666666667, 266, 518, 481.0, 518.0, 518.0, 518.0, 0.029063853285668614, 0.024229338627798604, 0.018637952790614313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 159.19999999999996, 129, 398, 133.0, 366.50000000000057, 397.7, 398.0, 0.11577424023154849, 0.08603925470332852, 0.05811324167872648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 172.0, 130, 399, 132.5, 395.5, 398.85, 399.0, 0.11577491041916306, 0.03967325787703547, 0.06554171442381722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1002.75, 773, 1166, 1036.0, 1166.0, 1166.0, 1166.0, 0.036052600744486206, 10.60066167788804, 0.02056124886208979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1276.5, 907, 1455, 1372.0, 1455.0, 1455.0, 1455.0, 0.03592308866716361, 32.323658328768104, 0.020452305364215214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 198.0, 133, 391, 134.0, 391.0, 391.0, 391.0, 0.03634579388300289, 0.06431501808203245, 0.020125063605139295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c991e61a-0a3e-44d4-9dcf-bb14b7b0760c", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 140.0, 131, 209, 133.0, 181.0, 209.0, 209.0, 0.06425761797010185, 0.047753952417233896, 0.03225431214514878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 170.0, 130, 403, 132.0, 395.5, 403.0, 403.0, 0.06425702811244981, 0.024087421113023522, 0.03626111589213999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 283.4285714285714, 131, 1453, 133.5, 926.5, 1453.0, 1453.0, 0.06425761797010185, 4.146019305111235, 0.03738201268628972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 255.78571428571425, 130, 1054, 134.5, 727.5, 1054.0, 1054.0, 0.06425820783858338, 1.3656572438507188, 0.037445107999687886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 134.5, 134, 136, 134.0, 136.0, 136.0, 136.0, 0.036346124140187, 0.02701113327215069, 0.020409200566999536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 936.0555555555553, 131, 1811, 1375.5, 1682.3000000000002, 1811.0, 1811.0, 0.08305264614958704, 41.52712512400222, 0.044860684953628945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 248.7, 130, 1421, 133.0, 398.20000000000005, 1369.8999999999992, 1421.0, 0.11559624543394831, 5.230284202400356, 0.06746124635871827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49be9f24-3539-476f-ad0f-eb65a34d1ca0", 3, 0, 0.0, 327.0, 245, 486, 250.0, 486.0, 486.0, 486.0, 0.021205010037038084, 0.025187852091520822, 0.01359826490005372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 597.1666666666666, 131, 1060, 777.5, 1059.1, 1060.0, 1060.0, 0.08305226294346447, 13.57668391346877, 0.044941583691303966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 205.15, 130, 793, 134.0, 398.6, 773.2999999999997, 793.0, 0.1155969135624079, 1.7290656698841143, 0.06757452388521228], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 444.1333333333333, 261, 529, 461.0, 520.6, 529.0, 529.0, 0.08603976184193922, 0.01619967390930262, 0.058911469745551746], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eccbcc73-6ef4-498c-b95a-639da3ebe065", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 445.3571428571429, 266, 1591, 271.0, 1100.0, 1591.0, 1591.0, 0.06421753230371223, 5.580022463235463, 0.14325311684380004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 787.3999999999999, 222, 1347, 786.5, 1313.2000000000003, 1345.7, 1347.0, 0.09168592071001577, 0.05631879309238273, 0.04145564578978252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 150.66666666666669, 133, 397, 135.0, 181.00000000000034, 397.0, 397.0, 0.08304996378098801, 0.06171974847395692, 0.041687188851003754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 220.94444444444446, 131, 401, 135.0, 395.6, 401.0, 401.0, 0.08305073015433595, 0.09152161625948739, 0.04348988972708607], "isController": false}, {"data": ["login", 20, 0, 0.0, 2804.9, 1518, 4254, 2673.5, 3864.7000000000007, 4236.2, 4254.0, 0.09342563786354251, 22.483518403682837, 0.1719433174976877], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8749452-0e89-4af8-949b-ed94d3475731", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 151.0, 132, 397, 137.0, 157.30000000000004, 385.0999999999998, 397.0, 0.11018615951650314, 0.0892034435929503, 0.03916773639063197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dde7025b-7f1e-46dd-a188-a0fbb9a6d9bc", 3, 0, 0.0, 305.6666666666667, 215, 438, 264.0, 438.0, 438.0, 438.0, 0.03103726541000228, 0.025874491118169213, 0.01990345470628401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1103.111111111111, 268, 1949, 1512.5, 1819.4, 1949.0, 1949.0, 0.08299788355396938, 55.22068215038295, 0.17486652614663883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fd44315-226c-4ffb-b0f7-c39d87fcf3fd", 3, 0, 0.0, 470.0, 296, 652, 462.0, 652.0, 652.0, 652.0, 0.023564342437024294, 0.023633378596507763, 0.015111248242492792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 528.4375000000001, 264, 1574, 527.5, 1022.4000000000005, 1574.0, 1574.0, 0.10478679162491568, 7.987338654946919, 0.2339922826165262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1029.5, 133, 1589, 1375.0, 1589.0, 1589.0, 1589.0, 0.05381986491213907, 42.92964650439977, 0.09279196435779447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af3bd42d-a858-48b0-97cc-4f008bbe39c6", 3, 0, 0.0, 381.6666666666667, 359, 425, 361.0, 425.0, 425.0, 425.0, 0.023158333526319446, 0.023226180206572335, 0.014850884455354593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4fd03ae-8136-4da5-81f8-29fb072fecb1", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.1323969414893618, 2.115885416666667], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1138.3181818181818, 403, 1814, 1160.5, 1727.3, 1803.1999999999998, 1814.0, 0.08851088482722273, 0.027848240041519652, 0.03993362186540713], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 153.0, 132, 397, 136.0, 218.50000000000017, 397.0, 397.0, 0.07364007492877625, 0.05717173785974327, 0.02617674538483843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 436.65, 264, 1557, 269.0, 791.0, 1518.6999999999994, 1557.0, 0.11550745311841247, 7.079416833550872, 0.25830128603110614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 461.3888888888888, 264, 1545, 271.5, 1433.4, 1545.0, 1545.0, 0.10402519721443639, 13.971116753835929, 0.23099779307654522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 134.28571428571428, 132, 136, 135.0, 136.0, 136.0, 136.0, 0.041071617165589026, 0.030522949866223874, 0.020616026585071053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 170.57142857142858, 131, 397, 133.0, 397.0, 397.0, 397.0, 0.041072822113607424, 0.010990188729617613, 0.023424343861666735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 132.0, 129, 135, 132.0, 135.0, 135.0, 135.0, 0.041072581118347704, 0.011070344129554656, 0.024146185384028632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 170.14285714285717, 131, 393, 134.0, 393.0, 393.0, 393.0, 0.041073063111695264, 0.011070474041824114, 0.024186579156593987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.7175714720194648, 1.5040488138686132], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1528.9272727272726, 1039, 2364, 1554.0, 2131.2, 2234.0, 2364.0, 0.23520556966788975, 281.387632009126, 0.4644391229184307], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1138.3181818181818, 403, 1814, 1160.5, 1727.3, 1803.1999999999998, 1814.0, 0.08657327246969936, 0.027238607744372735, 0.039059425665040136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 131.8, 130, 134, 132.0, 134.0, 134.0, 134.0, 0.03492059057702784, 0.009412190428964535, 0.020563589958933388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 132.0, 131, 134, 131.0, 134.0, 134.0, 134.0, 0.03492059057702784, 0.009412190428964535, 0.02052948781969801], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14efc05e-ca40-4efe-b434-f60acee94a08", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 254.62500000000003, 129, 1569, 132.5, 751.4000000000008, 1569.0, 1569.0, 0.07422596238599356, 4.193046542287923, 0.043238072815669104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 238.81249999999997, 130, 1052, 134.5, 591.4000000000004, 1052.0, 1052.0, 0.07422665107906994, 1.3828247502969064, 0.04331096095678153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1e558d1-f6d7-4483-843a-c9ac87725d88", 3, 0, 0.0, 347.0, 230, 521, 290.0, 521.0, 521.0, 521.0, 0.06740967104080532, 0.030501120685781057, 0.043228207015099766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 134.12499999999997, 130, 151, 132.5, 141.9, 151.0, 151.0, 0.07422389638344064, 0.05516053237089681, 0.03725691673934423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 239.2, 132, 400, 134.0, 400.0, 400.0, 400.0, 0.03485583626122358, 0.009326659312085215, 0.019878719117729073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 213.0625, 130, 395, 132.5, 392.9, 395.0, 395.0, 0.07413791505648382, 0.026797163877227612, 0.041892628026912064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 134.0, 132, 137, 134.0, 137.0, 137.0, 137.0, 0.034920834468260456, 0.025951909209322464, 0.017528621988951047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe042c25-d715-42a4-8e3a-db371082d4f4", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 502.85714285714283, 133, 765, 466.5, 764.5, 765.0, 765.0, 0.08089726625023837, 0.015117450912694515, 0.05505821894556192], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 142.8, 135, 154, 140.0, 154.0, 154.0, 154.0, 0.037026888926738596, 0.029144211401319637, 0.01316190192317661], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dde7025b-7f1e-46dd-a188-a0fbb9a6d9bc", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2a6c23b-583a-424a-97ec-56eaf507735d", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1442.8, 935, 2290, 1310.5, 2019.7000000000005, 2277.5, 2290.0, 0.09352568449110338, 0.04840684841824686, 0.043018161518857116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 374.0, 267, 537, 269.0, 537.0, 537.0, 537.0, 0.03482354907682771, 0.05396969959465389, 0.07831897805071703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7eba68e-dc07-444d-833c-16315b13971b", 3, 0, 0.0, 327.6666666666667, 235, 439, 309.0, 439.0, 439.0, 439.0, 0.048014596437316946, 0.03086875910276724, 0.030790610345545043], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 1308.830508474576, 676, 2476, 1049.0, 2284.0, 2432.0, 2476.0, 0.2739242669043772, 89.91670609406049, 0.9949522779820602], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49be9f24-3539-476f-ad0f-eb65a34d1ca0", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 235.34545454545452, 131, 539, 135.0, 530.0, 537.2, 539.0, 0.2367882897427618, 0.17597254735765794, 0.11446308927994833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23bc3af0-bc79-473e-a79f-2f277e978eff", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 0.5962510313531353, 2.2754228547854787], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 846.7636363636361, 646, 1231, 781.0, 1077.2, 1180.3999999999999, 1231.0, 0.23658152599385748, 69.56282388817436, 0.11898387293636387], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 194.63636363636365, 132, 532, 136.0, 397.4, 409.0, 532.0, 0.23723973722464015, 0.419803128760789, 0.11537635657995195], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1291.8909090909092, 904, 1832, 1298.0, 1624.1999999999998, 1721.6, 1832.0, 0.23579142319415922, 212.16553706721555, 0.11835624172050571], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 151.83333333333334, 131, 391, 137.5, 169.60000000000036, 391.0, 391.0, 0.10353693680220419, 0.07734937173211544, 0.03680414550390852], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, 5.202312138728324, 192.60115606936427, 132, 631, 140.0, 336.2, 403.3999999999995, 593.2599999999995, 0.7277010116305971, 1.54828708961659, 0.350446827612678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 208.42857142857142, 133, 393, 136.0, 393.0, 393.0, 393.0, 0.04139219697955226, 0.03205469941873529, 0.014713632520075215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eccbcc73-6ef4-498c-b95a-639da3ebe065", 3, 0, 0.0, 408.3333333333333, 334, 461, 430.0, 461.0, 461.0, 461.0, 0.033119528377915895, 0.027610388078073766, 0.021238760060056743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c991e61a-0a3e-44d4-9dcf-bb14b7b0760c", 3, 0, 0.0, 531.3333333333334, 365, 741, 488.0, 741.0, 741.0, 741.0, 0.035792688746778656, 0.029302933658251408, 0.02295299376014126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 136.68749999999997, 133, 147, 136.0, 142.1, 147.0, 147.0, 0.09841006242888335, 0.07986207214687702, 0.03498170187901713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1cf28bb-5765-416f-b4ea-5c5923a1cd45", 3, 0, 0.0, 306.0, 232, 447, 239.0, 447.0, 447.0, 447.0, 0.01781927689374365, 0.021061782031635157, 0.011427075351782225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 306.1428571428571, 266, 530, 270.0, 530.0, 530.0, 530.0, 0.04103959148018081, 0.06360335124906928, 0.09229900310435195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 472.1875, 264, 1702, 404.5, 883.7000000000008, 1702.0, 1702.0, 0.07408985246858127, 5.647474585154709, 0.16544502822360316], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 161.14285714285714, 135, 403, 138.5, 286.0, 403.0, 403.0, 0.06506815889644403, 0.05394811221004002, 0.023129697107720337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3fd44315-226c-4ffb-b0f7-c39d87fcf3fd", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1e558d1-f6d7-4483-843a-c9ac87725d88", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 150.94444444444446, 132, 397, 136.0, 168.40000000000038, 397.0, 397.0, 0.08173087837991236, 0.06345317217971712, 0.029052773174109474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af3bd42d-a858-48b0-97cc-4f008bbe39c6", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9c8931a-94bf-4010-9059-fbe63c39d286", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 133.94444444444446, 131, 142, 134.0, 137.5, 142.0, 142.0, 0.10425958319335518, 0.07748197540053058, 0.05233342359510212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 146.83333333333334, 130, 396, 132.0, 162.90000000000038, 396.0, 396.0, 0.10426320667284522, 0.04529838102409639, 0.058489667805838745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 296.8333333333333, 131, 1413, 133.0, 1300.5000000000002, 1413.0, 1413.0, 0.10426320667284522, 10.449003797642494, 0.06029979292168675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 263.6666666666667, 129, 1058, 135.0, 809.6000000000004, 1058.0, 1058.0, 0.10410822628501362, 3.426195401019104, 0.060311829441806394], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 31.57894736842105, 0.46547711404189296], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07757951900698215], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07757951900698215], "isController": false}, {"data": ["401/Unauthorized", 11, 57.89473684210526, 0.8533747090768037], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1289, 19, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
