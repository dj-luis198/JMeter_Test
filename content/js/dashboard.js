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

    var data = {"OkPercent": 98.95131086142322, "KoPercent": 1.048689138576779};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8081619537275064, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3620689655172414, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1897f420-121b-4a73-a3b4-a2aad13131d8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f188db98-4f6e-464f-b411-79d234f4cfbd"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9221a3c-148a-44c4-a46a-8b1f488fce03"], "isController": false}, {"data": [0.9, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ab368a9-cb26-49a1-b482-2544fe92888f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b41587c7-de81-45eb-9ab0-d4d274380811"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=804af166-2195-4e3a-8524-f9a0cb0f522b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7db3c2c-0c75-4cf5-9114-8eebfa9faa9b"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/804af166-2195-4e3a-8524-f9a0cb0f522b"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ed10c50-811a-4c1e-8738-77593663c3b3"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3332ca51-cd46-41a8-8c98-d4ddd47c3c70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/52386ed6-75f4-4f86-836e-acf044cd6353"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6308664e-c748-4ab7-a093-cb8e46dfe668"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da74eea1-ada4-470d-80de-42c7c0504de8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21c4e040-8cca-44d8-ba18-a698ab80645c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/19ebf6eb-ff22-4c2f-9714-ae0e6113a787"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1897f420-121b-4a73-a3b4-a2aad13131d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f188db98-4f6e-464f-b411-79d234f4cfbd"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d9221a3c-148a-44c4-a46a-8b1f488fce03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3332ca51-cd46-41a8-8c98-d4ddd47c3c70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/714d553f-5871-4ab0-ad09-569046f18292"], "isController": false}, {"data": [0.35344827586206895, 500, 1500, "addBook"], "isController": true}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7672413793103449, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ab368a9-cb26-49a1-b482-2544fe92888f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47533de0-6757-44ac-a647-2439c1bf632a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9568965517241379, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a7db3c2c-0c75-4cf5-9114-8eebfa9faa9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77a61535-66dd-4ed8-85ec-c1874e257a6f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b41587c7-de81-45eb-9ab0-d4d274380811"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52386ed6-75f4-4f86-836e-acf044cd6353"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6308664e-c748-4ab7-a093-cb8e46dfe668"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ed10c50-811a-4c1e-8738-77593663c3b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da74eea1-ada4-470d-80de-42c7c0504de8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19ebf6eb-ff22-4c2f-9714-ae0e6113a787"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/21c4e040-8cca-44d8-ba18-a698ab80645c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1335, 14, 1.048689138576779, 330.5250936329593, 81, 2636, 116.0, 912.6000000000004, 1070.8000000000002, 1637.000000000005, 5.249209669555371, 765.4486171244652, 3.8321488411435802], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1393.0172413793102, 1014, 1785, 1358.5, 1694.2, 1756.1, 1785.0, 0.25408173546586765, 305.7464106163454, 1.2493179082721129], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1897f420-121b-4a73-a3b4-a2aad13131d8", 3, 0, 0.0, 541.3333333333334, 179, 1020, 425.0, 1020.0, 1020.0, 1020.0, 0.031702754969406846, 0.026429282381722305, 0.020330217216709464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f188db98-4f6e-464f-b411-79d234f4cfbd", 3, 0, 0.0, 457.33333333333337, 225, 879, 268.0, 879.0, 879.0, 879.0, 0.02944640753828033, 0.029532676310365137, 0.018883275667451904], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 653.8, 86, 997, 744.0, 965.2, 997.0, 997.0, 0.08241441263248116, 0.015517088628459345, 0.055753135525007276], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 653.8, 86, 997, 744.0, 965.2, 997.0, 997.0, 0.08303073244176779, 0.01563313009255159, 0.05617007427099017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 123.17647058823529, 82, 255, 84.0, 252.6, 255.0, 255.0, 0.07855822550831792, 0.04184236367837338, 0.04363844443160813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 105.64705882352942, 83, 258, 86.0, 248.39999999999998, 258.0, 258.0, 0.07855713645374603, 0.05838084066533274, 0.039432000134009236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 209.4705882352941, 82, 653, 86.0, 583.4, 653.0, 653.0, 0.07849221080237509, 4.090243172909106, 0.045031118410117185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 286.4117647058824, 82, 956, 246.0, 927.1999999999999, 956.0, 956.0, 0.07849257321741057, 12.481144287529839, 0.04495467342472331], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9221a3c-148a-44c4-a46a-8b1f488fce03", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 265.8666666666667, 125, 1020, 217.0, 571.2000000000003, 1020.0, 1020.0, 0.08224901712424536, 0.15236951707489596, 0.05316734967621304], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ab368a9-cb26-49a1-b482-2544fe92888f", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 93.68421052631581, 81, 247, 85.0, 95.0, 247.0, 247.0, 0.09705712578092675, 0.072129367889927, 0.04871812758925424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 110.73684210526315, 82, 257, 84.0, 257.0, 257.0, 257.0, 0.09697241900251108, 0.033613383724965806, 0.05487594229120307], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 561.0, 407, 672, 607.0, 672.0, 672.0, 672.0, 0.10443137118390365, 30.70629057593901, 0.05955851637832005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 933.6666666666666, 826, 1066, 911.0, 1066.0, 1066.0, 1066.0, 0.103978926937474, 93.56042123379662, 0.05919893984819077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b41587c7-de81-45eb-9ab0-d4d274380811", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 140.0, 83, 260, 84.5, 260.0, 260.0, 260.0, 0.10547781449968356, 0.18664628893889318, 0.05840421955207088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 98.41666666666666, 83, 249, 85.0, 200.70000000000016, 249.0, 249.0, 0.06779163112313784, 0.05038030398897256, 0.0340282210911063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 126.75000000000001, 82, 258, 85.5, 255.9, 258.0, 258.0, 0.06779278006892266, 0.018139864979379697, 0.038663069883057455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 113.08333333333333, 83, 255, 86.0, 253.5, 255.0, 255.0, 0.06779201410073893, 0.01827206630058979, 0.03985428953969222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 113.50000000000001, 81, 260, 85.0, 258.8, 260.0, 260.0, 0.06779239708266718, 0.01827216952618764, 0.039920718203953424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 85.0, 82, 88, 84.5, 88.0, 88.0, 88.0, 0.10547596027072162, 0.07838594313087809, 0.059227223784829044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 501.9545454545455, 83, 1004, 290.0, 990.0, 1001.9, 1004.0, 0.10091465372512684, 41.28901017919232, 0.055384800188985624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 144.1052631578947, 81, 1054, 84.0, 247.0, 1054.0, 1054.0, 0.0970591089973794, 4.621307643213269, 0.056621139346230275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 357.6363636363636, 82, 739, 261.5, 686.5, 731.8, 739.0, 0.10091511662576547, 13.502288508291095, 0.05548360416045504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 140.94736842105263, 82, 655, 85.0, 251.0, 655.0, 655.0, 0.09697588362893965, 1.5255060131427842, 0.05666729137425035], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 660.5, 194, 2245, 451.0, 1710.5, 2245.0, 2245.0, 0.08101570547318959, 0.014636626477089914, 0.05585653131257016], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=804af166-2195-4e3a-8524-f9a0cb0f522b", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7db3c2c-0c75-4cf5-9114-8eebfa9faa9b", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 0.9312580541237113, 3.5538820876288657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 241.33333333333337, 169, 505, 175.0, 456.70000000000016, 505.0, 505.0, 0.06775871122931242, 0.10501276828214728, 0.1523909296495181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/804af166-2195-4e3a-8524-f9a0cb0f522b", 3, 0, 0.0, 347.3333333333333, 180, 449, 413.0, 449.0, 449.0, 449.0, 0.04651523373904954, 0.028935745988061087, 0.02982910496937747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 628.4347826086956, 152, 1597, 568.0, 1416.2000000000003, 1576.5999999999997, 1597.0, 0.09471178791148153, 0.05817745566047059, 0.042823786917007764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 88.27272727272727, 83, 124, 85.5, 94.7, 119.64999999999993, 124.0, 0.10091372793658948, 0.07499545601537558, 0.05065396109317089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 122.13636363636361, 83, 261, 84.5, 254.1, 260.09999999999997, 261.0, 0.10091419082873486, 0.09589715009151083, 0.053700253890930104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ed10c50-811a-4c1e-8738-77593663c3b3", 1, 0, 0.0, 1176.0, 1176, 1176, 1176.0, 1176.0, 1176.0, 1176.0, 0.8503401360544217, 0.15362590348639457, 0.5862696641156463], "isController": false}, {"data": ["login", 23, 0, 0.0, 2737.304347826087, 1785, 3975, 2705.0, 3455.0000000000005, 3886.9999999999986, 3975.0, 0.09390706466930424, 29.435973244652402, 0.1823077750456266], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3332ca51-cd46-41a8-8c98-d4ddd47c3c70", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 91.89473684210526, 85, 119, 89.0, 103.0, 119.0, 119.0, 0.09624492814556286, 0.07791703655534336, 0.03421206430174305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52386ed6-75f4-4f86-836e-acf044cd6353", 3, 0, 0.0, 366.0, 178, 488, 432.0, 488.0, 488.0, 488.0, 0.045531811559009226, 0.02927256765268334, 0.029198459886474015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6308664e-c748-4ab7-a093-cb8e46dfe668", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 0.8770100121359223, 3.3468598300970878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 599.3181818181818, 169, 1092, 384.5, 1081.7, 1090.95, 1092.0, 0.10087439761936422, 54.94020541122366, 0.2151372207040116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da74eea1-ada4-470d-80de-42c7c0504de8", 3, 0, 0.0, 329.6666666666667, 217, 459, 313.0, 459.0, 459.0, 459.0, 0.028226527290347466, 0.028309222194518407, 0.018100995690750167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21c4e040-8cca-44d8-ba18-a698ab80645c", 1, 0, 0.0, 2245.0, 2245, 2245, 2245.0, 2245.0, 2245.0, 2245.0, 0.44543429844098, 0.08047396993318486, 0.30710606904231624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19ebf6eb-ff22-4c2f-9714-ae0e6113a787", 3, 0, 0.0, 693.6666666666667, 208, 1605, 268.0, 1605.0, 1605.0, 1605.0, 0.09609224855861628, 0.044605321108263936, 0.0616216567905189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 422.5882352941176, 171, 1044, 335.0, 1013.6, 1044.0, 1044.0, 0.07846105562427308, 16.66485237494692, 0.17291810656165194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 1, 14.285714285714286, 891.5714285714286, 125, 1155, 991.0, 1155.0, 1155.0, 1155.0, 0.12113031891882538, 124.21660723710394, 0.24528551605841942], "isController": false}, {"data": ["register", 24, 6, 25.0, 1184.916666666667, 224, 2145, 1214.5, 1991.5, 2129.25, 2145.0, 0.09398312219763867, 0.029645066865075478, 0.04240254146026276], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 266.6842105263158, 167, 1136, 173.0, 496.0, 1136.0, 1136.0, 0.09692937929486427, 6.245538139797673, 0.2166911673740811], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 112.66666666666667, 86, 253, 89.0, 250.6, 253.0, 253.0, 0.09412945938313828, 0.07307902364218255, 0.03346008126509994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 330.0769230769231, 169, 1063, 331.0, 838.1999999999998, 1063.0, 1063.0, 0.06217269662115307, 5.8104943327195775, 0.13860420054281547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1897f420-121b-4a73-a3b4-a2aad13131d8", 1, 0, 0.0, 960.0, 960, 960, 960.0, 960.0, 960.0, 960.0, 1.0416666666666667, 0.18819173177083334, 0.7181803385416667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 104.11111111111113, 83, 247, 87.0, 247.0, 247.0, 247.0, 0.05488608088988632, 0.040789362848831535, 0.02755023982168122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 103.44444444444444, 83, 247, 85.0, 247.0, 247.0, 247.0, 0.05488741980338107, 0.014686672877076574, 0.031302981606615765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 103.77777777777777, 82, 248, 85.0, 248.0, 248.0, 248.0, 0.05488775454196169, 0.014793965091388112, 0.03226799632252045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 140.8888888888889, 83, 255, 87.0, 255.0, 255.0, 255.0, 0.05483190973449171, 0.014778913170624717, 0.032288712470604004], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 936.5344827586206, 658, 1429, 905.5, 1327.8, 1399.55, 1429.0, 0.25215746799121797, 301.66799583722803, 0.49791250027172146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1184.916666666667, 224, 2145, 1214.5, 1991.5, 2129.25, 2145.0, 0.09554520482503284, 0.030137794100083604, 0.04310730920816912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 101.66666666666667, 81, 246, 84.0, 246.0, 246.0, 246.0, 0.04659398005777654, 0.012558533687447583, 0.027437665991053958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 84.11111111111111, 82, 88, 83.0, 88.0, 88.0, 88.0, 0.04659373883691673, 0.012558468670887715, 0.027392022245921754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f188db98-4f6e-464f-b411-79d234f4cfbd", 1, 0, 0.0, 907.0, 907, 907, 907.0, 907.0, 907.0, 907.0, 1.1025358324145536, 0.1991886025358324, 0.7601467750826901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 194.66666666666666, 82, 938, 84.0, 815.6000000000001, 938.0, 938.0, 0.08906358546244782, 10.706080797742533, 0.05133912667216881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 188.13333333333333, 82, 491, 85.0, 491.0, 491.0, 491.0, 0.08906358546244782, 3.512491538959381, 0.051426102829846984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 133.22222222222223, 81, 360, 85.0, 360.0, 360.0, 360.0, 0.046593256402689985, 0.01246733618587603, 0.02657271654215913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 96.2, 83, 249, 85.0, 152.40000000000006, 249.0, 249.0, 0.0890604126465786, 0.06618649807035772, 0.04470415244173964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 104.22222222222221, 83, 244, 87.0, 244.0, 244.0, 244.0, 0.04659156796156714, 0.03462517892456307, 0.0233867831369585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 149.86666666666667, 82, 255, 85.0, 251.4, 255.0, 255.0, 0.08906305664410402, 0.04166713053675336, 0.04979645380596129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9221a3c-148a-44c4-a46a-8b1f488fce03", 3, 0, 0.0, 707.0, 272, 1376, 473.0, 1376.0, 1376.0, 1376.0, 0.017724734867507606, 0.02443497791793448, 0.011366447815426428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 114.55555555555556, 86, 254, 94.0, 254.0, 254.0, 254.0, 0.04550395631620194, 0.03581659061607301, 0.016175234471774907], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 668.5, 382, 1859, 463.5, 1732.0, 1859.0, 1859.0, 0.08088324503579084, 0.01461269563634893, 0.05505431815424435], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1507.1739130434783, 1058, 2636, 1437.0, 2021.0000000000005, 2533.3999999999987, 2636.0, 0.09451290923062382, 0.04891781434788147, 0.04347224633557014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3332ca51-cd46-41a8-8c98-d4ddd47c3c70", 3, 0, 0.0, 388.0, 210, 500, 454.0, 500.0, 500.0, 500.0, 0.04451302747937563, 0.028617587653569945, 0.028545138064573566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 239.55555555555554, 167, 497, 177.0, 497.0, 497.0, 497.0, 0.046571075222635615, 0.07217607068195578, 0.10473943968528303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/714d553f-5871-4ab0-ad09-569046f18292", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["addBook", 58, 6, 10.344827586206897, 984.6206896551727, 440, 2528, 810.5, 1611.8, 1852.25, 2528.0, 0.2710508360516305, 96.11988300271751, 0.9829015626898524], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 140.46551724137927, 83, 565, 86.5, 343.1, 348.15, 565.0, 0.2528026221734052, 0.18787382370504035, 0.1222043925545269], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 550.0517241379313, 406, 845, 498.0, 686.1000000000001, 760.4999999999998, 845.0, 0.2529227844182122, 74.36769644578077, 0.12720237692908132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ab368a9-cb26-49a1-b482-2544fe92888f", 3, 0, 0.0, 283.0, 185, 468, 196.0, 468.0, 468.0, 468.0, 0.023137079483580385, 0.027347244663047, 0.014837254746957473], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 128.12068965517238, 83, 347, 88.0, 253.0, 269.0999999999998, 347.0, 0.25337136816170336, 0.44834855381738914, 0.12322162240676589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47533de0-6757-44ac-a647-2439c1bf632a", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 789.9827586206899, 565, 1062, 814.5, 988.9, 1031.1499999999999, 1062.0, 0.2528191514866202, 227.48711691632556, 0.1269033631485574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 91.76923076923076, 86, 100, 92.0, 98.8, 100.0, 100.0, 0.06346323769911591, 0.047411500820140305, 0.02255919777585761], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 6, 3.4482758620689653, 168.75862068965523, 84, 1360, 95.0, 339.0, 405.5, 1077.25, 0.7050071716246769, 1.582020487498278, 0.33714723684796966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 113.55555555555556, 87, 284, 89.0, 284.0, 284.0, 284.0, 0.05863421371519408, 0.04540715964467666, 0.020842630656572894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7db3c2c-0c75-4cf5-9114-8eebfa9faa9b", 3, 0, 0.0, 744.0, 176, 1859, 197.0, 1859.0, 1859.0, 1859.0, 0.0717772035601493, 0.0332717245669442, 0.046029000980955116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 126.29411764705884, 85, 299, 93.0, 269.4, 299.0, 299.0, 0.07664217122762726, 0.06219691825210766, 0.027243896803570623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77a61535-66dd-4ed8-85ec-c1874e257a6f", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 1.075205176767677, 2.009022516835017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b41587c7-de81-45eb-9ab0-d4d274380811", 3, 0, 0.0, 325.0, 172, 584, 219.0, 584.0, 584.0, 584.0, 0.03910323253388947, 0.024783201088373306, 0.02507596617570386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 264.44444444444446, 168, 503, 185.0, 503.0, 503.0, 503.0, 0.05480252822330203, 0.08493321512732455, 0.12325217040846151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52386ed6-75f4-4f86-836e-acf044cd6353", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6308664e-c748-4ab7-a093-cb8e46dfe668", 3, 0, 0.0, 701.6666666666666, 247, 1412, 446.0, 1412.0, 1412.0, 1412.0, 0.09072763563781527, 0.04105189242726667, 0.058181459051593776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 342.3333333333333, 168, 1027, 175.0, 902.2, 1027.0, 1027.0, 0.08901601694864962, 14.31877688098262, 0.19716236410221413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ed10c50-811a-4c1e-8738-77593663c3b3", 3, 0, 0.0, 276.6666666666667, 211, 382, 237.0, 382.0, 382.0, 382.0, 0.02361962948674545, 0.027917602430459872, 0.015146702502893404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 89.83333333333334, 86, 100, 88.5, 99.4, 100.0, 100.0, 0.06855223394592372, 0.05683676427743089, 0.02436817691046507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 91.77272727272727, 85, 122, 88.5, 100.4, 118.84999999999995, 122.0, 0.10217445824315664, 0.07932489678057571, 0.036319826953622084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da74eea1-ada4-470d-80de-42c7c0504de8", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19ebf6eb-ff22-4c2f-9714-ae0e6113a787", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 98.6923076923077, 84, 246, 85.0, 184.39999999999995, 246.0, 246.0, 0.06224861137713082, 0.04626093091601226, 0.031245885007661366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 174.8461538461538, 81, 259, 247.0, 257.8, 259.0, 259.0, 0.062200361719026605, 0.02382976598310064, 0.03507180852336341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 164.61538461538458, 82, 972, 84.0, 681.5999999999997, 972.0, 972.0, 0.06225039983910666, 4.324181564364519, 0.0361849154112836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21c4e040-8cca-44d8-ba18-a698ab80645c", 3, 0, 0.0, 565.0, 186, 1111, 398.0, 1111.0, 1111.0, 1111.0, 0.02299132460684835, 0.023058682003157475, 0.014743785636553139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 180.3076923076923, 83, 492, 87.0, 397.9999999999999, 492.0, 492.0, 0.062199468912226975, 1.4222988833999186, 0.03621605194851798], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 42.857142857142854, 0.449438202247191], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.0749063670411985], "isController": false}, {"data": ["401/Unauthorized", 7, 50.0, 0.5243445692883895], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1335, 14, "401/Unauthorized", 7, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
