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

    var data = {"OkPercent": 96.61798616448885, "KoPercent": 3.3820138355111453};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7606524633821571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/70af947b-82bc-45ea-8e77-db2f13b3c35b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/160bd946-cab2-4f78-a0e3-890c1fddc113"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0920bb70-c2c9-4fa3-a66a-67d132344572"], "isController": false}, {"data": [0.026785714285714284, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7efab019-bfb3-4ec7-866a-20261ed9b6b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0920bb70-c2c9-4fa3-a66a-67d132344572"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.1724137931034483, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70af947b-82bc-45ea-8e77-db2f13b3c35b"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8430232558139535, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c7e851e-6b70-41a7-9667-8ad363acbb59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3c306c3-6860-427c-b7d5-d18588b1d74d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b83e4e6b-5e6e-4a7f-bfc4-e364fd16a425"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/33a35ff1-dd31-4f82-83f9-a87017f3de63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/401a3d49-ef36-46e2-a0ac-77c65e7a6b9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b83e4e6b-5e6e-4a7f-bfc4-e364fd16a425"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3fd23f4-ce57-48a5-8455-98b8563b2520"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33a35ff1-dd31-4f82-83f9-a87017f3de63"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/88ea530c-5c65-4a5a-b76c-5a9295f5da70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/633ed64f-34c8-41a3-a0ff-9fe271e2e0ad"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3fd23f4-ce57-48a5-8455-98b8563b2520"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88ea530c-5c65-4a5a-b76c-5a9295f5da70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=160bd946-cab2-4f78-a0e3-890c1fddc113"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3c306c3-6860-427c-b7d5-d18588b1d74d"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=633ed64f-34c8-41a3-a0ff-9fe271e2e0ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1301, 44, 3.3820138355111453, 377.37586471944644, 107, 2112, 123.0, 1082.8, 1296.7999999999997, 1748.4000000000005, 5.058890776953855, 710.3866293001544, 3.721711277467133], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/70af947b-82bc-45ea-8e77-db2f13b3c35b", 3, 0, 0.0, 381.3333333333333, 212, 610, 322.0, 610.0, 610.0, 610.0, 0.044744731307888495, 0.02876655088967441, 0.02869372417856131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/160bd946-cab2-4f78-a0e3-890c1fddc113", 3, 0, 0.0, 290.6666666666667, 208, 444, 220.0, 444.0, 444.0, 444.0, 0.08166598611678236, 0.03695173199945556, 0.052370440315775146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0920bb70-c2c9-4fa3-a66a-67d132344572", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1874.9642857142858, 1339, 2602, 1865.5, 2252.8, 2311.65, 2602.0, 0.25040691123075, 301.32406759058244, 1.2312488262176036], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 135.6, 112, 353, 119.0, 223.4000000000001, 353.0, 353.0, 0.06934556280858777, 0.053837619563307876, 0.02465018052961518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 329.11111111111103, 223, 686, 232.0, 482.6000000000003, 686.0, 686.0, 0.10621850326326847, 0.16461793425664753, 0.23888790333526103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 323.6315789473684, 226, 460, 235.0, 459.0, 460.0, 460.0, 0.10500022105309696, 0.16272983477662584, 0.23614795809109598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7efab019-bfb3-4ec7-866a-20261ed9b6b6", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.8209150064267352, 1.533880944730077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 116.125, 115, 118, 116.0, 118.0, 118.0, 118.0, 0.04522507956787437, 0.03360965385854726, 0.022700870017468188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 168.875, 109, 341, 115.0, 341.0, 341.0, 341.0, 0.045171964020530656, 0.012087029435181055, 0.02576213573045889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 140.125, 111, 322, 115.0, 322.0, 322.0, 322.0, 0.04522610224491065, 0.012189847870698572, 0.026588001515074424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 140.25, 109, 326, 114.5, 326.0, 326.0, 326.0, 0.045171964020530656, 0.012175255927408654, 0.02660028740662108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 124.5, 120, 129, 124.5, 129.0, 129.0, 129.0, 0.052559655208661835, 0.015500992063492064, 0.032490489987385685], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1272.3035714285718, 877, 2100, 1140.0, 1776.3000000000002, 1827.4499999999998, 2100.0, 0.2574452239313724, 307.9939902630539, 0.5083537527238624], "isController": false}, {"data": ["deleteBook", 11, 2, 18.181818181818183, 471.63636363636374, 117, 873, 480.0, 850.2, 873.0, 873.0, 0.10292301358583779, 0.02073262764792844, 0.06906002633893484], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 2, 18.181818181818183, 471.63636363636374, 117, 873, 480.0, 850.2, 873.0, 873.0, 0.09739253619018105, 0.01961857817964496, 0.06534914670857497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 9, 42.857142857142854, 941.6666666666666, 211, 1749, 913.0, 1477.2, 1724.2999999999997, 1749.0, 0.09126665073121971, 0.028215248049718596, 0.04117694593537452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 147.8421052631579, 108, 344, 115.0, 325.0, 344.0, 344.0, 0.11139317687477648, 0.03861202635914333, 0.06303653769486477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 273.14285714285717, 115, 343, 328.0, 343.0, 343.0, 343.0, 0.06445790898543251, 0.017373420781229856, 0.037957147576382626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 126.15789473684214, 111, 324, 116.0, 118.0, 324.0, 324.0, 0.11139513613658217, 0.08278486191400296, 0.05591513669355785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 146.28571428571428, 109, 343, 115.0, 343.0, 343.0, 343.0, 0.06458517862415117, 0.017407723926040744, 0.03796902102708887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0920bb70-c2c9-4fa3-a66a-67d132344572", 3, 0, 0.0, 310.0, 209, 503, 218.0, 503.0, 503.0, 503.0, 0.04348645396958847, 0.027957599801411864, 0.0278868210677374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 209.84210526315792, 109, 915, 116.0, 461.0, 915.0, 915.0, 0.11139382995438715, 1.7523115135783216, 0.06509233412579295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 180.5263157894737, 108, 1180, 115.0, 323.0, 1180.0, 1180.0, 0.11139252380282351, 5.303769290327025, 0.06498278912222691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 218.93333333333334, 108, 1014, 115.0, 611.4000000000003, 1014.0, 1014.0, 0.06707807888382077, 4.040672548575709, 0.03905027222520347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 256.66666666666663, 109, 897, 117.0, 637.2000000000002, 897.0, 897.0, 0.06711349339155802, 1.3324562671698688, 0.03913642970756414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 158.6, 108, 344, 115.0, 342.2, 344.0, 344.0, 0.06734732361735946, 0.050050110617979045, 0.03380519955011988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 241.14285714285714, 111, 343, 323.0, 343.0, 343.0, 343.0, 0.06445138064064672, 0.017245779585485548, 0.03675742802161883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 211.39999999999998, 108, 459, 115.0, 388.80000000000007, 459.0, 459.0, 0.06728056443908194, 0.024739624215620752, 0.037994245829726346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 180.7142857142857, 114, 345, 116.0, 345.0, 345.0, 345.0, 0.06458398686177182, 0.04799649804864097, 0.03241813403022531], "isController": false}, {"data": ["deleteAccount", 11, 2, 18.181818181818183, 554.7272727272726, 114, 1404, 484.0, 1314.6000000000004, 1404.0, 1404.0, 0.09645484597914822, 0.018950157506379173, 0.06563622109642854], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 119.71428571428571, 113, 134, 118.0, 134.0, 134.0, 134.0, 0.06273806856374636, 0.04938172193591754, 0.02230142280976921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1314.8095238095239, 1019, 2112, 1205.0, 2021.2000000000003, 2109.4, 2112.0, 0.0909185369908562, 0.04705744590347049, 0.04181897551044264], "isController": false}, {"data": ["goToProfile", 12, 2, 16.666666666666668, 205.41666666666669, 114, 252, 215.0, 247.8, 252.0, 252.0, 0.07734001894830464, 0.12315995204918825, 0.04998652591857385], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 456.57142857142856, 232, 689, 454.0, 689.0, 689.0, 689.0, 0.06438261669349277, 0.09978048114509083, 0.14479801391124397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 125.94444444444444, 109, 344, 114.5, 139.70000000000033, 344.0, 344.0, 0.10629063402363195, 0.07899137938670303, 0.05335291590639338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 761.2222222222222, 562, 1021, 672.0, 1021.0, 1021.0, 1021.0, 0.050257429723360766, 14.77735304238935, 0.028662440389104187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 150.7777777777778, 108, 341, 115.0, 340.1, 341.0, 341.0, 0.10629377236598127, 0.02844188830886608, 0.06062066705247369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1177.3333333333333, 869, 1468, 1239.0, 1468.0, 1468.0, 1468.0, 0.050278767834996255, 45.240923678576216, 0.02862550942168244], "isController": false}, {"data": ["addBook", 58, 27, 46.55172413793103, 1008.8620689655168, 561, 2272, 816.5, 2020.4, 2074.7, 2272.0, 0.2709735894189485, 62.580673407329364, 0.9865862233289573], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 217.77777777777777, 109, 345, 130.0, 345.0, 345.0, 345.0, 0.05044786493424962, 0.0892690734969339, 0.027933534587616732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 150.41666666666663, 110, 327, 115.0, 327.0, 327.0, 327.0, 0.07585239124663405, 0.056370771229188, 0.03807434482497061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 130.16666666666669, 108, 328, 113.5, 264.10000000000025, 328.0, 328.0, 0.07585095287759552, 0.020296055750450362, 0.04325874656300369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 170.75000000000003, 109, 345, 115.0, 344.7, 345.0, 345.0, 0.07585095287759552, 0.020444202142789417, 0.04459206409405518], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 186.58928571428572, 109, 507, 116.5, 461.6, 464.45, 507.0, 0.2589715131335553, 0.19245832177210506, 0.12518642480577136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 169.25, 109, 344, 115.0, 341.90000000000003, 344.0, 344.0, 0.07574753347094135, 0.020416327380839663, 0.04460523699509535], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 717.1964285714287, 538, 1083, 678.0, 999.0000000000001, 1027.05, 1083.0, 0.2587704705925844, 76.0871103425012, 0.13014335190935641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 143.33333333333334, 110, 341, 116.0, 341.0, 341.0, 341.0, 0.05051412150330026, 0.03754027975001122, 0.028364863148825827], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 152.9464285714286, 108, 399, 116.0, 343.6, 346.15, 399.0, 0.25944543538187126, 0.45909680557807686, 0.1261756121290741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 844.375, 110, 1601, 1177.5, 1585.6, 1601.0, 1601.0, 0.09147352413185908, 46.30905781734167, 0.0493546114090353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 151.2777777777778, 109, 346, 114.0, 342.4, 346.0, 346.0, 0.10629188933833299, 0.028648985798222563, 0.06248800525554342], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1081.1071428571427, 759, 1588, 1018.5, 1361.0, 1485.8, 1588.0, 0.2580526243030275, 232.1962049559928, 0.1295303211833556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 552.5, 109, 1022, 647.5, 996.1, 1022.0, 1022.0, 0.09147195527021387, 15.139669368186054, 0.04944309300982752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 131.0, 111, 326, 118.0, 136.0, 326.0, 326.0, 0.10293249253739428, 0.07689780936631507, 0.036589284456651876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 137.6111111111111, 109, 333, 114.0, 326.7, 333.0, 333.0, 0.10629188933833299, 0.028648985798222563, 0.06259180592872539], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70af947b-82bc-45ea-8e77-db2f13b3c35b", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["deleteBooks", 11, 2, 18.181818181818183, 419.3636363636364, 120, 743, 435.0, 714.8000000000001, 743.0, 743.0, 0.09769788262043484, 0.01968008661805457, 0.06609178494031548], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 27, 15.69767441860465, 147.35465116279076, 111, 454, 119.0, 233.70000000000002, 306.7, 414.58000000000055, 0.7083377947632422, 1.5527183685477428, 0.3370685368294471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 176.5, 117, 346, 119.0, 346.0, 346.0, 346.0, 0.0470347528029773, 0.036424373996836915, 0.016719384785433337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 359.58333333333337, 221, 672, 236.5, 669.9, 672.0, 672.0, 0.07569354207930161, 0.11731020632798013, 0.1702365502037418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c7e851e-6b70-41a7-9667-8ad363acbb59", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.9020789194915255, 1.6855358403954803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3c306c3-6860-427c-b7d5-d18588b1d74d", 3, 0, 0.0, 307.0, 210, 484, 227.0, 484.0, 484.0, 484.0, 0.024225393057002352, 0.024296365888224036, 0.015535164167413617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 130.1578947368421, 112, 344, 118.0, 133.0, 344.0, 344.0, 0.11241605774635387, 0.09122826561251961, 0.03996039552702423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b83e4e6b-5e6e-4a7f-bfc4-e364fd16a425", 1, 0, 0.0, 743.0, 743, 743, 743.0, 743.0, 743.0, 743.0, 1.3458950201884252, 0.24315486204576042, 0.927931527590848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 563.952380952381, 126, 1445, 418.0, 1329.6000000000004, 1444.1, 1445.0, 0.08990919171636647, 0.05522742342733839, 0.040652300551443046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33a35ff1-dd31-4f82-83f9-a87017f3de63", 3, 0, 0.0, 707.6666666666666, 211, 1428, 484.0, 1428.0, 1428.0, 1428.0, 0.026022014624372217, 0.02609825099534206, 0.01668729453450953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 128.25, 110, 326, 116.0, 181.80000000000015, 326.0, 326.0, 0.09146881770836311, 0.06797633816021907, 0.0459130588887682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 142.31249999999997, 109, 345, 116.0, 334.5, 345.0, 345.0, 0.09147404709769999, 0.10175817763688233, 0.047847447731157774], "isController": false}, {"data": ["login", 21, 0, 0.0, 2731.190476190476, 1545, 4280, 2821.0, 3940.0, 4250.7, 4280.0, 0.09111617312072894, 46.83687815245688, 0.20222756671005532], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/401a3d49-ef36-46e2-a0ac-77c65e7a6b9b", 2, 0, 0.0, 375.5, 218, 533, 375.5, 533.0, 533.0, 533.0, 0.07418397626112759, 0.04364828681379822, 0.04611142665059347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 287.0, 230, 458, 233.5, 458.0, 458.0, 458.0, 0.0451416318699921, 0.06996071267351314, 0.10152458808260918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 144.66666666666669, 113, 347, 119.0, 344.3, 347.0, 347.0, 0.10259508569539519, 0.08305793558738536, 0.036469346868285006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b83e4e6b-5e6e-4a7f-bfc4-e364fd16a425", 3, 0, 0.0, 654.0, 238, 1404, 320.0, 1404.0, 1404.0, 1404.0, 0.01975581808842704, 0.02335070816376256, 0.012668932823633225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3fd23f4-ce57-48a5-8455-98b8563b2520", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33a35ff1-dd31-4f82-83f9-a87017f3de63", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 456.5333333333334, 222, 1129, 451.0, 934.0000000000001, 1129.0, 1129.0, 0.06704210244033253, 5.444019495284706, 0.1496357029923125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88ea530c-5c65-4a5a-b76c-5a9295f5da70", 3, 0, 0.0, 619.6666666666666, 233, 1180, 446.0, 1180.0, 1180.0, 1180.0, 0.03469090404495941, 0.028920379316126645, 0.02224644562778973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 142.66666666666669, 111, 334, 120.0, 288.10000000000014, 334.0, 334.0, 0.07560436237170884, 0.06268369497420001, 0.02687498818681838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 974.5625, 226, 1719, 1294.0, 1698.7, 1719.0, 1719.0, 0.0914087226773615, 61.57507249318719, 0.19242473420057357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/633ed64f-34c8-41a3-a0ff-9fe271e2e0ad", 3, 0, 0.0, 575.0, 252, 957, 516.0, 957.0, 957.0, 957.0, 0.026018178033719558, 0.02609440316467772, 0.016684834220842295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3fd23f4-ce57-48a5-8455-98b8563b2520", 3, 0, 0.0, 336.6666666666667, 233, 540, 237.0, 540.0, 540.0, 540.0, 0.04174145343740869, 0.026835732597292373, 0.026767794033754923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88ea530c-5c65-4a5a-b76c-5a9295f5da70", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 133.75, 110, 355, 118.5, 199.60000000000016, 355.0, 355.0, 0.08922546717896955, 0.06927172500711015, 0.031716865286274334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=160bd946-cab2-4f78-a0e3-890c1fddc113", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3c306c3-6860-427c-b7d5-d18588b1d74d", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, 30.76923076923077, 956.0000000000001, 114, 1580, 1263.0, 1580.0, 1580.0, 1580.0, 0.07167747342419832, 59.372101025263554, 0.12650707918431037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 362.8947368421052, 225, 1297, 234.0, 786.0, 1297.0, 1297.0, 0.11131942816967424, 7.172745140760487, 0.24886094409128193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 114.73684210526316, 108, 130, 115.0, 118.0, 130.0, 130.0, 0.10518856434218395, 0.07817236080508005, 0.0527997285858228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=633ed64f-34c8-41a3-a0ff-9fe271e2e0ad", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.3001064161129568, 1.1452709717607974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 136.36842105263162, 107, 329, 115.0, 325.0, 329.0, 329.0, 0.1051868173237152, 0.02814569135419723, 0.059989356754931326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 182.8421052631579, 109, 344, 115.0, 342.0, 344.0, 344.0, 0.10506641303265905, 0.02831868163770889, 0.06176755922427808], "isController": false}, {"data": ["register", 21, 9, 42.857142857142854, 941.6666666666666, 211, 1749, 913.0, 1477.2, 1724.2999999999997, 1749.0, 0.09282752645584504, 0.028697795567264595, 0.041881169162695714], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 172.05263157894737, 108, 342, 116.0, 327.0, 342.0, 342.0, 0.1051751720167616, 0.028347995582642775, 0.0619342077403391], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 20.454545454545453, 0.6917755572636434], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 4.545454545454546, 0.15372790161414296], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 4.545454545454546, 0.15372790161414296], "isController": false}, {"data": ["401/Unauthorized", 31, 70.45454545454545, 2.382782475019216], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1301, 44, "401/Unauthorized", 31, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 27, "401/Unauthorized", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
