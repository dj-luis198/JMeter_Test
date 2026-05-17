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

    var data = {"OkPercent": 96.5948575399583, "KoPercent": 3.4051424600416955};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8038922155688623, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97aaae82-f08f-4ae9-9d20-c50aedfe4ffc"], "isController": false}, {"data": [0.425, 500, 1500, "see books"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1293108-d69c-43ca-bf39-e30e25d2ad32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e140354-6af4-4b9e-bd25-56c6ef0af404"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dfccc96-32b4-4067-9b5b-97b61dfd5411"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02f315ad-ae6f-4bae-aaf6-7a4b887fba66"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0a5cf841-d480-4b64-9ffd-8a86dc532956"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a5cf841-d480-4b64-9ffd-8a86dc532956"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49166666666666664, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1293108-d69c-43ca-bf39-e30e25d2ad32"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88722bfa-a672-486f-90b6-c2fdf0e88aa3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88722bfa-a672-486f-90b6-c2fdf0e88aa3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97aaae82-f08f-4ae9-9d20-c50aedfe4ffc"], "isController": false}, {"data": [0.4782608695652174, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1f7ce42-0ebe-40cf-8483-c30106d40c50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b22cc67-8cb0-440d-9213-d905b8409bbc"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b22cc67-8cb0-440d-9213-d905b8409bbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8416666666666667, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8671875, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ae21f64-2fb0-4c12-bce3-8ed4507f6df6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1f7ce42-0ebe-40cf-8483-c30106d40c50"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ae21f64-2fb0-4c12-bce3-8ed4507f6df6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6dcdff8-3242-4839-b6e1-1b16ce9f814d"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6dcdff8-3242-4839-b6e1-1b16ce9f814d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e140354-6af4-4b9e-bd25-56c6ef0af404"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f21201a6-5cb1-4da8-986e-90b18c11b248"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.29411764705882354, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f1996c0-2cc0-4f22-849e-8a371db19d66"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f21201a6-5cb1-4da8-986e-90b18c11b248"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8dfccc96-32b4-4067-9b5b-97b61dfd5411"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1439, 49, 3.4051424600416955, 275.6789437109102, 76, 1815, 89.0, 779.0, 950.0, 1306.7999999999993, 5.703572759197457, 790.8186078565823, 4.190763656717453], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97aaae82-f08f-4ae9-9d20-c50aedfe4ffc", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["see books", 60, 0, 0.0, 1272.9166666666663, 937, 2084, 1247.5, 1520.6, 1621.6499999999999, 2084.0, 0.2612625950342689, 314.3873245866608, 1.2846261386694766], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 232.6842105263158, 159, 1017, 164.0, 319.0, 1017.0, 1017.0, 0.09659232446886931, 6.22382038212432, 0.2159376620463338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1293108-d69c-43ca-bf39-e30e25d2ad32", 3, 0, 0.0, 347.3333333333333, 207, 423, 412.0, 423.0, 423.0, 423.0, 0.07547359682004579, 0.03414983710282019, 0.04839940941910488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 96.93333333333334, 80, 237, 83.0, 154.80000000000004, 237.0, 237.0, 0.11858832458415026, 0.09206808402773385, 0.04215444350452217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e140354-6af4-4b9e-bd25-56c6ef0af404", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dfccc96-32b4-4067-9b5b-97b61dfd5411", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02f315ad-ae6f-4bae-aaf6-7a4b887fba66", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a5cf841-d480-4b64-9ffd-8a86dc532956", 3, 0, 0.0, 953.0, 177, 1783, 899.0, 1783.0, 1783.0, 1783.0, 0.040482552020079346, 0.03374863793080183, 0.025960490716001407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 272.0, 159, 1065, 164.5, 694.0, 1065.0, 1065.0, 0.07822452674161322, 6.797125344676821, 0.17449918842053505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 17, 0, 0.0, 90.52941176470588, 79, 234, 81.0, 123.59999999999991, 234.0, 234.0, 0.07726956624501724, 0.05742396475825989, 0.03878570024408093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 17, 0, 0.0, 106.70588235294117, 77, 235, 80.0, 234.2, 235.0, 235.0, 0.07727097111429286, 0.020676021567691643, 0.04406860071362015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 17, 0, 0.0, 89.47058823529412, 78, 241, 80.0, 116.19999999999989, 241.0, 241.0, 0.07727026867326948, 0.020826752103342165, 0.04542646654424632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 17, 0, 0.0, 98.47058823529412, 77, 237, 80.0, 235.4, 237.0, 237.0, 0.07727026867326948, 0.020826752103342165, 0.04550192579099756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a5cf841-d480-4b64-9ffd-8a86dc532956", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 83.33333333333333, 82, 85, 83.0, 85.0, 85.0, 85.0, 0.0368903863653132, 0.010879781916332603, 0.022804311102776614], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 876.0833333333334, 617, 1747, 797.5, 1175.7, 1272.1, 1747.0, 0.2550944487196385, 305.1816458481253, 0.5037118899522548], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 509.6666666666667, 80, 1231, 435.0, 1060.0, 1231.0, 1231.0, 0.07885481776651614, 0.01664883945421952, 0.05259041361980412], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 509.6666666666667, 80, 1231, 435.0, 1060.0, 1231.0, 1231.0, 0.07691873791734825, 0.01624006947044013, 0.051299189532898144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1293108-d69c-43ca-bf39-e30e25d2ad32", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, 45.833333333333336, 853.2916666666669, 164, 1667, 889.5, 1364.5, 1596.75, 1667.0, 0.0970767755948986, 0.0299098854494048, 0.04379831086410465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88722bfa-a672-486f-90b6-c2fdf0e88aa3", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 109.4, 77, 231, 80.0, 231.0, 231.0, 231.0, 0.029302827136762154, 0.007898027626705424, 0.017255473401823807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 126.66666666666667, 78, 318, 79.0, 244.2000000000001, 318.0, 318.0, 0.13570464637630897, 0.0363115948311608, 0.07739405613648873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 173.2, 80, 237, 234.0, 237.0, 237.0, 237.0, 0.02927623296855147, 0.007890859667304888, 0.01721122289752733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 80.38888888888889, 78, 89, 80.0, 82.70000000000002, 89.0, 89.0, 0.13570260021260072, 0.10084929566580973, 0.0681163442473406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 100.94444444444444, 77, 318, 79.0, 241.5000000000001, 318.0, 318.0, 0.13570362328674176, 0.03657636721400462, 0.07991141097842312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 122.16666666666666, 77, 241, 80.0, 234.70000000000002, 241.0, 241.0, 0.13570260021260072, 0.03657609146355254, 0.07977828645311098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 151.86666666666665, 77, 850, 80.0, 482.8000000000002, 850.0, 850.0, 0.11226284474048573, 6.762528124181416, 0.06535510141076975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 136.20000000000002, 78, 612, 80.0, 385.20000000000016, 612.0, 612.0, 0.1122645251584801, 2.2288747399205167, 0.06546571301071004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88722bfa-a672-486f-90b6-c2fdf0e88aa3", 3, 0, 0.0, 256.6666666666667, 174, 410, 186.0, 410.0, 410.0, 410.0, 0.024586334915054214, 0.02465836519312566, 0.015766627533416927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 140.8, 78, 235, 79.0, 235.0, 235.0, 235.0, 0.029276061549991805, 0.0078336336569314, 0.016696503852729697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 80.13333333333334, 79, 84, 80.0, 82.8, 84.0, 84.0, 0.11226200455035325, 0.083429087366034, 0.05635026400281403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 80.2, 78, 83, 80.0, 83.0, 83.0, 83.0, 0.029302140228322275, 0.02177629757202466, 0.01470830085679458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 90.53333333333333, 78, 234, 80.0, 145.80000000000007, 234.0, 234.0, 0.11226368494319458, 0.041280292484320504, 0.06339682312482224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 83.6, 80, 90, 83.0, 90.0, 90.0, 90.0, 0.027961703650680028, 0.022008919084421975, 0.009939511844577666], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 506.2142857142856, 79, 1783, 415.0, 1440.0, 1783.0, 1783.0, 0.07808404073755955, 0.0155612517011166, 0.05313266025355003], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/97aaae82-f08f-4ae9-9d20-c50aedfe4ffc", 3, 0, 0.0, 252.66666666666669, 175, 407, 176.0, 407.0, 407.0, 407.0, 0.07148133145893398, 0.03234344099216088, 0.045839265291048155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1161.6521739130435, 770, 1686, 1179.0, 1415.2, 1637.9999999999993, 1686.0, 0.09670854567166187, 0.05005422774021562, 0.04448215333139916], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 159.13333333333333, 78, 223, 176.0, 213.4, 223.0, 223.0, 0.07899559731204314, 0.12543636838806851, 0.05104884758589455], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 284.4, 160, 321, 314.0, 321.0, 321.0, 321.0, 0.02926166955381806, 0.04534987263858326, 0.06581018064691699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1f7ce42-0ebe-40cf-8483-c30106d40c50", 3, 0, 0.0, 361.3333333333333, 223, 463, 398.0, 463.0, 463.0, 463.0, 0.02303156860336568, 0.02722253437461614, 0.014769593147340622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 89.57894736842105, 79, 238, 81.0, 86.0, 238.0, 238.0, 0.09663211644678622, 0.0718135162265667, 0.04850479282582824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 88.63157894736844, 78, 242, 80.0, 86.0, 242.0, 242.0, 0.09663457381609931, 0.03349627702589298, 0.054684758311844855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 527.2, 386, 625, 538.0, 624.9, 625.0, 625.0, 0.062244408895970924, 18.301922924304574, 0.03549876444848341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 823.4, 687, 999, 856.0, 991.9, 999.0, 999.0, 0.06203858800173708, 55.8224305361685, 0.03532079766114523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b22cc67-8cb0-440d-9213-d905b8409bbc", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 0.30569215313028764, 1.1665873519458545], "isController": false}, {"data": ["addBook", 66, 24, 36.36363636363637, 791.8636363636363, 405, 3080, 632.5, 1500.8000000000002, 1664.1499999999999, 3080.0, 0.3122412773506801, 74.82417947959787, 1.1375572885866352], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 144.5, 78, 241, 88.5, 240.5, 241.0, 241.0, 0.06239276243955701, 0.11040594291062236, 0.0345475549836219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b22cc67-8cb0-440d-9213-d905b8409bbc", 3, 0, 0.0, 294.6666666666667, 191, 385, 308.0, 385.0, 385.0, 385.0, 0.02089223783723554, 0.024693917834310627, 0.013397691581820968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 98.125, 78, 360, 80.0, 171.0000000000002, 360.0, 360.0, 0.08645797872052999, 0.06425246270148761, 0.043397852599953525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 108.9375, 77, 237, 80.0, 237.0, 237.0, 237.0, 0.0864575115366742, 0.023134138829149147, 0.0493077995482595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 118.74999999999999, 79, 241, 80.0, 236.1, 241.0, 241.0, 0.08645797872052999, 0.023303127077017847, 0.05082783514624907], "isController": false}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 149.2833333333333, 79, 615, 82.0, 319.9, 322.9, 615.0, 0.25600873843160515, 0.19025649408833156, 0.12375422414418413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 108.56249999999999, 77, 237, 79.0, 237.0, 237.0, 237.0, 0.08645797872052999, 0.023303127077017847, 0.05091226676609334], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 492.43333333333345, 385, 792, 464.5, 626.0, 690.6999999999997, 792.0, 0.25621207527510775, 75.33485717244353, 0.1288566589518364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 98.5, 78, 234, 80.5, 220.50000000000006, 234.0, 234.0, 0.06239393031845862, 0.04636892673080763, 0.03503565423155636], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 127.8833333333333, 78, 333, 82.0, 239.0, 240.0, 333.0, 0.25645519086677576, 0.45380547446347436, 0.1247213721207562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 462.59090909090907, 77, 1086, 158.0, 1058.1, 1084.65, 1086.0, 0.1041622279353626, 42.617748074774276, 0.05716716025358768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 141.68421052631578, 79, 779, 80.0, 237.0, 779.0, 779.0, 0.09663408233223815, 4.601070707221617, 0.05637319256121007], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 724.1333333333334, 535, 1098, 701.5, 916.8, 950.3499999999999, 1098.0, 0.2558002711482874, 230.16953362814314, 0.1283997454787302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 325.90909090909093, 78, 626, 158.0, 626.0, 626.0, 626.0, 0.10423872563419788, 13.946982318506164, 0.057310939972708405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 125.6842105263158, 78, 624, 80.0, 238.0, 624.0, 624.0, 0.09663408233223815, 1.5201292131188395, 0.05646756178223764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 86.21428571428571, 79, 95, 83.5, 95.0, 95.0, 95.0, 0.07650315029043873, 0.05715323239471254, 0.0271944792048044], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 354.1428571428572, 82, 591, 399.5, 582.0, 591.0, 591.0, 0.08018373530203494, 0.01644952326473806, 0.05405802188156863], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 192, 24, 12.5, 139.0781250000001, 78, 1815, 84.5, 269.70000000000005, 336.4, 1216.0799999999956, 0.7962146627906495, 1.6928714035564256, 0.38215938755748713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 17, 0, 0.0, 87.05882352941177, 80, 111, 83.0, 102.19999999999999, 111.0, 111.0, 0.07718116234830497, 0.05977017748262289, 0.02743549130349903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ae21f64-2fb0-4c12-bce3-8ed4507f6df6", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1f7ce42-0ebe-40cf-8483-c30106d40c50", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 227.93749999999997, 159, 597, 163.5, 404.5000000000002, 597.0, 597.0, 0.08642061995992244, 0.13393508191054387, 0.1943619997731459], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ae21f64-2fb0-4c12-bce3-8ed4507f6df6", 3, 0, 0.0, 262.3333333333333, 194, 395, 198.0, 395.0, 395.0, 395.0, 0.04642812925591185, 0.029848813567846973, 0.029773246951219513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 92.77777777777777, 80, 239, 82.0, 118.40000000000019, 239.0, 239.0, 0.13276196517211114, 0.10773944634572692, 0.04719272980727388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6dcdff8-3242-4839-b6e1-1b16ce9f814d", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 511.4347826086956, 91, 1506, 490.0, 842.8000000000001, 1375.199999999998, 1506.0, 0.09728902029956558, 0.059760540789479254, 0.04398907851435436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 81.5909090909091, 78, 88, 81.0, 87.7, 88.0, 88.0, 0.10423675008765364, 0.07746500665693791, 0.05232196244634177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 129.22727272727272, 78, 239, 80.0, 236.7, 238.7, 239.0, 0.1041622279353626, 0.09898370808062157, 0.05542865715949604], "isController": false}, {"data": ["login", 23, 0, 0.0, 2246.217391304348, 1326, 3697, 2322.0, 3063.600000000001, 3618.3999999999987, 3697.0, 0.09722650817336755, 50.700073791749276, 0.21679050937178992], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 17, 0, 0.0, 217.70588235294116, 159, 470, 163.0, 363.5999999999999, 470.0, 470.0, 0.0772414795832595, 0.11970920712757112, 0.17371789792992834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6dcdff8-3242-4839-b6e1-1b16ce9f814d", 3, 0, 0.0, 314.0, 185, 456, 301.0, 456.0, 456.0, 456.0, 0.058965740904534464, 0.026680462193132456, 0.037813316921202114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 88.42105263157893, 80, 119, 86.0, 96.0, 119.0, 119.0, 0.09446062980382018, 0.07647252158922552, 0.03357780200057671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 264.6, 158, 931, 166.0, 563.2000000000003, 931.0, 931.0, 0.11219399088984794, 9.11048805788462, 0.250413189432074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 84.6875, 80, 99, 82.5, 95.5, 99.0, 99.0, 0.09102908379227163, 0.07547235560511584, 0.032357994629284056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 559.7272727272729, 159, 1166, 318.5, 1140.3999999999999, 1164.5, 1166.0, 0.10412180357895036, 56.708871739686025, 0.22206304042765665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 107.54545454545456, 80, 242, 86.5, 237.4, 241.39999999999998, 242.0, 0.10498136580756916, 0.08150408771193113, 0.037317594876909346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e140354-6af4-4b9e-bd25-56c6ef0af404", 3, 0, 0.0, 513.3333333333333, 203, 1097, 240.0, 1097.0, 1097.0, 1097.0, 0.025546481823678184, 0.030644135911541047, 0.01638234674239779], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f21201a6-5cb1-4da8-986e-90b18c11b248", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 247.66666666666663, 160, 399, 239.0, 398.1, 399.0, 399.0, 0.13561978240559355, 0.21018417448991894, 0.30501206921883006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 7, 41.1764705882353, 575.2352941176471, 78, 1163, 777.0, 1095.8, 1163.0, 1163.0, 0.10541262843288625, 74.19405602603693, 0.16847369877411314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f1996c0-2cc0-4f22-849e-8a371db19d66", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f21201a6-5cb1-4da8-986e-90b18c11b248", 3, 0, 0.0, 319.66666666666663, 174, 611, 174.0, 611.0, 611.0, 611.0, 0.02313779327152972, 0.027348088336238415, 0.014837712482068211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 80.85714285714285, 77, 88, 81.0, 85.0, 88.0, 88.0, 0.07832737485803162, 0.05821009010445515, 0.03931667058303541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 91.78571428571429, 76, 239, 80.5, 166.0, 239.0, 239.0, 0.07832956605420405, 0.029362659596490835, 0.04420244066535371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 189.64285714285714, 79, 983, 82.5, 611.0, 983.0, 983.0, 0.07826038347587903, 5.0495034046760585, 0.0455281527754486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dfccc96-32b4-4067-9b5b-97b61dfd5411", 3, 0, 0.0, 255.33333333333331, 165, 420, 181.0, 420.0, 420.0, 420.0, 0.03785680034323499, 0.031559656796557554, 0.024276659074275043], "isController": false}, {"data": ["register", 24, 11, 45.833333333333336, 853.2916666666669, 164, 1667, 889.5, 1364.5, 1596.75, 1667.0, 0.09686715476949653, 0.029845300126734527, 0.04370373584326894], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 151.57142857142856, 78, 615, 81.5, 424.5, 615.0, 615.0, 0.07826082095601183, 1.6632498888975844, 0.04560483386345723], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 22.448979591836736, 0.7644197359277276], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 8.16326530612245, 0.27797081306462823], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 6.122448979591836, 0.20847810979847117], "isController": false}, {"data": ["401/Unauthorized", 31, 63.265306122448976, 2.1542738012508686], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1439, 49, "401/Unauthorized", 31, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 192, 24, "401/Unauthorized", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
