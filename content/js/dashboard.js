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

    var data = {"OkPercent": 97.07016191210485, "KoPercent": 2.9298380878951424};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7304869913275517, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b24c0800-ffa4-468b-899a-1c1b41e34703"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64e8a1f6-f916-431d-b24f-74879d2ebdd3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4b993bef-66b0-437d-ab55-0edfa431e755"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.32727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdd11a34-fc89-425c-9534-6e3258217f31"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a5977a0d-9a84-4bfc-b8ab-1580bd386404"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/699407d8-8b08-4a5a-ac61-276a91f5d784"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88fe354e-e6d0-4097-9488-b22e1d5bd4c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.21666666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8909090909090909, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=699407d8-8b08-4a5a-ac61-276a91f5d784"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fdd11a34-fc89-425c-9534-6e3258217f31"], "isController": false}, {"data": [0.37272727272727274, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d38a41e-94ed-44da-97af-8d0fb2331994"], "isController": false}, {"data": [0.8628571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5977a0d-9a84-4bfc-b8ab-1580bd386404"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d38a41e-94ed-44da-97af-8d0fb2331994"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6cbd70e4-d106-4cd9-909b-b3617dbb49d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c3b6d834-1ee0-4697-bce9-524020f53922"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa1afceb-2777-4964-9c1d-54bc726d6949"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b993bef-66b0-437d-ab55-0edfa431e755"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cbd70e4-d106-4cd9-909b-b3617dbb49d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7dd671d-8441-4c23-b941-814244cc1443"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2266c72c-d533-4f0d-8c26-c0ecfe2c6bda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ebf4f99-df07-43db-a557-74f0b95408ba"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64e8a1f6-f916-431d-b24f-74879d2ebdd3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7ebf4f99-df07-43db-a557-74f0b95408ba"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7dd671d-8441-4c23-b941-814244cc1443"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1297, 38, 2.9298380878951424, 453.1804163454126, 126, 4029, 150.0, 1224.2, 1542.4999999999995, 2172.5399999999986, 5.11274046042258, 691.8165810211191, 3.754637978949858], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2312.0181818181813, 1654, 4594, 2167.0, 2828.2, 3279.1999999999957, 4594.0, 0.2542047781254478, 305.89317177801223, 1.2499229080679974], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 145.33333333333331, 136, 160, 145.5, 151.9, 160.0, 160.0, 0.09143228677228789, 0.0709850273280946, 0.032501320688586716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 328.7333333333334, 266, 546, 278.0, 540.0, 546.0, 546.0, 0.15011709133123838, 0.23265217181901884, 0.3376168567732832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b24c0800-ffa4-468b-899a-1c1b41e34703", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 481.94444444444446, 268, 832, 534.0, 807.7, 832.0, 832.0, 0.12487079341514683, 0.19352534096663868, 0.2808373410498859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 221.29999999999998, 134, 422, 143.5, 420.1, 422.0, 422.0, 0.05081765608643067, 0.03776585574391966, 0.025508081277759144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 189.5, 128, 422, 134.0, 419.7, 422.0, 422.0, 0.05081998038348757, 0.013598315063550385, 0.028983270062457756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 246.9, 127, 423, 138.5, 422.9, 423.0, 423.0, 0.05081998038348757, 0.013697572837736885, 0.02987659003013625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64e8a1f6-f916-431d-b24f-74879d2ebdd3", 1, 0, 0.0, 842.0, 842, 842, 842.0, 842.0, 842.0, 842.0, 1.187648456057007, 0.21456539489311163, 0.8188279394299288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b993bef-66b0-437d-ab55-0edfa431e755", 3, 0, 0.0, 803.3333333333334, 240, 1579, 591.0, 1579.0, 1579.0, 1579.0, 0.024956534036553003, 0.029497778348542954, 0.01600402736068015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 245.0, 132, 429, 136.0, 427.8, 429.0, 429.0, 0.05081894733632488, 0.013697294399243816, 0.02992561058965225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 150.0, 144, 156, 150.0, 156.0, 156.0, 156.0, 0.068575347162695, 0.020224369963997943, 0.0423908151894394], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1573.8181818181818, 1024, 4029, 1330.0, 2252.4, 2541.9999999999945, 4029.0, 0.25125169023864347, 300.5843707458521, 0.4961239430298213], "isController": false}, {"data": ["deleteBook", 11, 2, 18.181818181818183, 569.909090909091, 160, 1353, 502.0, 1240.4000000000003, 1353.0, 1353.0, 0.09313825103298787, 0.018761602591783513, 0.06249457575526655], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 2, 18.181818181818183, 569.909090909091, 160, 1353, 502.0, 1240.4000000000003, 1353.0, 1353.0, 0.09124920156948627, 0.01838107584882496, 0.061227047715037036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, 33.333333333333336, 1162.4285714285716, 339, 2497, 1114.0, 1728.2, 2420.199999999999, 2497.0, 0.09075312125913473, 0.028360350393479606, 0.04094525588058618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 222.55555555555554, 128, 419, 133.0, 419.0, 419.0, 419.0, 0.042611820519011974, 0.011485217249264946, 0.02509270290328537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 166.76470588235296, 132, 421, 134.0, 389.0, 421.0, 421.0, 0.09179364787956673, 0.024561972186524693, 0.0523510648063154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 199.11111111111111, 134, 398, 148.0, 398.0, 398.0, 398.0, 0.04261222402666578, 0.011485326007187262, 0.025051327015676566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 136.6470588235294, 127, 145, 135.0, 144.2, 145.0, 145.0, 0.09179315223084358, 0.06821737192155465, 0.046075859615872655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 197.88235294117646, 126, 421, 134.0, 409.8, 421.0, 421.0, 0.09179364787956673, 0.02474125665503947, 0.0540542672572058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 262.47058823529414, 132, 422, 149.0, 420.4, 422.0, 422.0, 0.091660511034308, 0.024705372114715823, 0.05388635511977872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 152.44444444444443, 129, 419, 134.0, 195.80000000000035, 419.0, 419.0, 0.08925737860996509, 0.024057652828467155, 0.05247357609687401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 154.16666666666666, 133, 395, 138.5, 198.8000000000003, 395.0, 395.0, 0.0892494124413681, 0.024055505697087497, 0.05255605049037594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 163.22222222222223, 133, 398, 134.0, 398.0, 398.0, 398.0, 0.042664947427303666, 0.011416206635821489, 0.024332352829634123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 153.7222222222222, 133, 416, 137.0, 175.7000000000004, 416.0, 416.0, 0.08925295278518798, 0.06632958698196098, 0.04480079856600256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 228.11111111111111, 129, 429, 135.0, 429.0, 429.0, 429.0, 0.04266454292053018, 0.03170675504152682, 0.02141560064565675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 139.27777777777777, 129, 166, 138.5, 148.00000000000003, 166.0, 166.0, 0.08925295278518798, 0.023882137756974127, 0.05090207463530252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 197.33333333333334, 135, 416, 142.0, 416.0, 416.0, 416.0, 0.042207944473104164, 0.03322226879425972, 0.015003605261923745], "isController": false}, {"data": ["deleteAccount", 11, 2, 18.181818181818183, 577.5454545454545, 134, 1215, 497.0, 1192.8000000000002, 1215.0, 1215.0, 0.09359312515953373, 0.018387924891517058, 0.06368885869565218], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1371.6190476190475, 968, 1938, 1405.0, 1703.0, 1915.3999999999996, 1938.0, 0.08918068431311763, 0.04615797137300034, 0.04101963116355313], "isController": false}, {"data": ["goToProfile", 12, 3, 25.0, 323.41666666666663, 133, 1086, 228.0, 898.2000000000007, 1086.0, 1086.0, 0.07752538956508256, 0.15175115520906013, 0.05010002592255213], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 459.1111111111111, 264, 849, 283.0, 849.0, 849.0, 849.0, 0.0425843999148312, 0.06599750260237999, 0.09577331348032837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdd11a34-fc89-425c-9534-6e3258217f31", 1, 0, 0.0, 968.0, 968, 968, 968.0, 968.0, 968.0, 968.0, 1.0330578512396695, 0.18663642820247933, 0.7122449638429752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5977a0d-9a84-4bfc-b8ab-1580bd386404", 3, 0, 0.0, 625.0, 344, 1048, 483.0, 1048.0, 1048.0, 1048.0, 0.01801996612246369, 0.021298989905815646, 0.011555772545980947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/699407d8-8b08-4a5a-ac61-276a91f5d784", 3, 0, 0.0, 592.6666666666666, 453, 800, 525.0, 800.0, 800.0, 800.0, 0.10615335621527901, 0.04989760624181735, 0.06807360408336577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88fe354e-e6d0-4097-9488-b22e1d5bd4c3", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.653038726993865, 1.2202038599182004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 135.73333333333332, 126, 146, 134.0, 144.2, 146.0, 146.0, 0.15033223423766526, 0.11172151392076489, 0.07545973476382806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 874.1428571428571, 662, 1115, 803.0, 1115.0, 1115.0, 1115.0, 0.033103813559322036, 9.733620336500266, 0.01887951867055085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 171.4, 130, 408, 134.0, 403.8, 408.0, 408.0, 0.15035333032626674, 0.04023126221620809, 0.08574838370169899], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1376.4285714285713, 918, 1583, 1437.0, 1583.0, 1583.0, 1583.0, 0.03305426093033578, 29.74228208830918, 0.018818978635142345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 657.1428571428571, 133, 2981, 395.0, 2981.0, 2981.0, 2981.0, 0.03323962923567847, 0.058818562670946664, 0.018405146266239934], "isController": false}, {"data": ["addBook", 60, 22, 36.666666666666664, 1214.5333333333333, 667, 2996, 982.5, 2350.3999999999996, 2486.8499999999995, 2996.0, 0.27001606595592437, 60.22619136854268, 0.9855674303246043], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 175.2857142857143, 128, 420, 137.0, 408.0, 420.0, 420.0, 0.07986491420226359, 0.05935273408976817, 0.0400884432616831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 249.92857142857144, 132, 420, 146.5, 413.0, 420.0, 420.0, 0.07974663355282645, 0.047004677282462576, 0.044045329552963156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 481.1428571428571, 127, 1608, 140.5, 1531.0, 1608.0, 1608.0, 0.07974617930358802, 15.393120850706609, 0.04541349105988369], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 260.90909090909093, 127, 2002, 142.0, 536.4, 566.2, 2002.0, 0.2526308053410745, 0.18774613560991965, 0.12212133656624209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 351.14285714285717, 126, 1087, 136.5, 1068.0, 1087.0, 1087.0, 0.07986673664514067, 5.049086399407845, 0.045560140365789654], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 872.2363636363636, 634, 3447, 789.0, 1140.8, 1271.5999999999995, 3447.0, 0.25251365869335657, 74.24739989842064, 0.1269966154561315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 176.71428571428572, 133, 403, 140.0, 403.0, 403.0, 403.0, 0.03323852439945109, 0.024701676824201445, 0.0186642104782074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=699407d8-8b08-4a5a-ac61-276a91f5d784", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 202.70909090909092, 128, 533, 142.0, 414.2, 455.39999999999975, 533.0, 0.25313659250531584, 0.4479331109566722, 0.12310744440199932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 897.0714285714286, 134, 1700, 1185.5, 1688.5, 1700.0, 1700.0, 0.08006084624314479, 41.17432820372054, 0.043135461522185434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 152.53333333333333, 132, 395, 134.0, 243.2000000000001, 395.0, 395.0, 0.15033826108744675, 0.04052085943372588, 0.08838245427211225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdd11a34-fc89-425c-9534-6e3258217f31", 3, 0, 0.0, 634.6666666666666, 442, 1002, 460.0, 1002.0, 1002.0, 1002.0, 0.02377179080824089, 0.023841434726624405, 0.015244279912836767], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1311.4545454545455, 880, 3895, 1194.0, 1713.6, 1720.6, 3895.0, 0.2519064739963817, 226.66588810629307, 0.12644524183021502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 637.5714285714286, 129, 1198, 821.0, 1130.5, 1198.0, 1198.0, 0.08006267763906602, 13.46129720123754, 0.04321463445668895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 135.0, 126, 142, 134.0, 141.4, 142.0, 142.0, 0.15036388059103029, 0.04052776469055114, 0.08854435546522585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 174.0, 136, 403, 146.5, 403.0, 403.0, 403.0, 0.12264755181859063, 0.09162634486447445, 0.04359737193551464], "isController": false}, {"data": ["deleteBooks", 11, 2, 18.181818181818183, 481.0909090909091, 144, 968, 457.0, 942.8000000000001, 968.0, 968.0, 0.09120985729803235, 0.018373150409200588, 0.061702691105380555], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d38a41e-94ed-44da-97af-8d0fb2331994", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.28361705259026687, 1.082343995290424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 22, 12.571428571428571, 201.2342857142857, 130, 1362, 143.0, 357.00000000000006, 427.7999999999997, 1046.6000000000038, 0.7375035294811768, 1.497609566685069, 0.3545531755848403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 146.0, 136, 163, 144.5, 161.9, 163.0, 163.0, 0.050385702553043546, 0.03901939660601908, 0.017910542704402198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5977a0d-9a84-4bfc-b8ab-1580bd386404", 1, 0, 0.0, 751.0, 751, 751, 751.0, 751.0, 751.0, 751.0, 1.3315579227696406, 0.2405646637816245, 0.9180467709720372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d38a41e-94ed-44da-97af-8d0fb2331994", 3, 0, 0.0, 301.3333333333333, 217, 444, 243.0, 444.0, 444.0, 444.0, 0.018240075878715657, 0.025145417104935154, 0.011696923659202422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 716.4285714285714, 263, 1749, 540.0, 1669.5, 1749.0, 1749.0, 0.07968490312592492, 20.52507126284919, 0.1748443298499647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 140.58823529411765, 131, 151, 142.0, 149.4, 151.0, 151.0, 0.09078626243638287, 0.07367517977015055, 0.032271679225432975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 746.904761904762, 330, 1694, 602.0, 1554.8000000000002, 1687.8999999999999, 1694.0, 0.08912050790201836, 0.05474296823278277, 0.04029569839710401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 136.92857142857142, 133, 142, 136.0, 142.0, 142.0, 142.0, 0.08005993057660306, 0.059497663250776295, 0.040186332340208956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 245.2857142857143, 132, 542, 138.5, 482.5, 542.0, 542.0, 0.08005764150188135, 0.09013185922435582, 0.04181582167732196], "isController": false}, {"data": ["login", 21, 0, 0.0, 3092.285714285714, 1841, 5273, 2912.0, 4292.8, 5176.999999999998, 5273.0, 0.09020812302669731, 36.09473077842093, 0.18596615987241996], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 496.9, 271, 852, 412.0, 849.3, 852.0, 852.0, 0.050783332910138895, 0.07870424739100627, 0.11421290594926746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cbd70e4-d106-4cd9-909b-b3617dbb49d5", 3, 0, 0.0, 645.0, 352, 1086, 497.0, 1086.0, 1086.0, 1086.0, 0.020492923110552487, 0.02422194134583857, 0.013141620614514455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 178.46666666666667, 130, 404, 145.0, 402.2, 404.0, 404.0, 0.1384645207742936, 0.11209676535340761, 0.04921981011898718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 312.16666666666663, 269, 836, 279.5, 364.4000000000008, 836.0, 836.0, 0.08918794377195634, 0.13822389332626436, 0.20058577588556195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3b6d834-1ee0-4697-bce9-524020f53922", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.9123883928571429, 1.7047991071428572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa1afceb-2777-4964-9c1d-54bc726d6949", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.83160400390625, 1.5538533528645833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b993bef-66b0-437d-ab55-0edfa431e755", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cbd70e4-d106-4cd9-909b-b3617dbb49d5", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 141.14285714285714, 134, 160, 137.5, 155.5, 160.0, 160.0, 0.08648221246208682, 0.07170253748077314, 0.030741723961132422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1037.0714285714284, 272, 1837, 1325.5, 1828.5, 1837.0, 1837.0, 0.07999542883263813, 54.74018672147306, 0.16821583409519456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7dd671d-8441-4c23-b941-814244cc1443", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 141.07142857142858, 135, 155, 140.5, 152.5, 155.0, 155.0, 0.07851714758419562, 0.06095813704046437, 0.027910392305319536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2266c72c-d533-4f0d-8c26-c0ecfe2c6bda", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ebf4f99-df07-43db-a557-74f0b95408ba", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 1134.5000000000002, 133, 3124, 1429.5, 2780.200000000001, 3124.0, 3124.0, 0.05559545043897241, 38.80456570397739, 0.08839712814751326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 434.1176470588235, 269, 566, 532.0, 562.8, 566.0, 566.0, 0.09159334709029487, 0.14195179866435348, 0.2059955843251456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64e8a1f6-f916-431d-b24f-74879d2ebdd3", 3, 0, 0.0, 530.6666666666667, 231, 1104, 257.0, 1104.0, 1104.0, 1104.0, 0.019723217514217153, 0.027190047582262254, 0.01264802685644785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ebf4f99-df07-43db-a557-74f0b95408ba", 3, 0, 0.0, 658.0, 225, 1215, 534.0, 1215.0, 1215.0, 1215.0, 0.0325506705438132, 0.02713615470791198, 0.020873965159932294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7dd671d-8441-4c23-b941-814244cc1443", 3, 0, 0.0, 342.3333333333333, 225, 503, 299.0, 503.0, 503.0, 503.0, 0.07781293769777455, 0.035208327929657106, 0.04989957267728381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 182.66666666666666, 133, 430, 140.5, 402.1, 430.0, 430.0, 0.1252121650574585, 0.09305318125852138, 0.06285063753860709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 254.9444444444444, 129, 423, 143.5, 405.90000000000003, 423.0, 423.0, 0.12498958420131655, 0.033444478585117905, 0.07128312223981335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 250.5, 132, 565, 141.0, 453.4000000000002, 565.0, 565.0, 0.12520781018495977, 0.03374741758891494, 0.07360849778451736], "isController": false}, {"data": ["register", 21, 7, 33.333333333333336, 1162.4285714285716, 339, 2497, 1114.0, 1728.2, 2420.199999999999, 2497.0, 0.09088823776362999, 0.02840257430113437, 0.04100621664726275], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 196.50000000000003, 127, 420, 140.0, 411.90000000000003, 420.0, 420.0, 0.12520955209760778, 0.033747887088808354, 0.07373179679185304], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 18.42105263157895, 0.5397070161912105], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 7.894736842105263, 0.2313030069390902], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.2631578947368425, 0.15420200462606015], "isController": false}, {"data": ["401/Unauthorized", 26, 68.42105263157895, 2.004626060138782], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1297, 38, "401/Unauthorized", 26, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 22, "401/Unauthorized", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
