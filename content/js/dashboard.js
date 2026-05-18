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

    var data = {"OkPercent": 98.61111111111111, "KoPercent": 1.3888888888888888};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7441937624419376, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/84e61f05-8e2b-4254-8c05-522f2c45911b"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/206cea87-8c0f-491c-8e51-ef14f466a0d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7427e90-7056-41a1-8237-9b959c56f98c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88f8dc2c-19cd-4e6f-ba09-95efc02f00bc"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f811b56-1736-4670-925d-6c12a211ffe2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17e7ccde-3f39-4924-9e02-c8799c9be89f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/546cb041-dd8c-40cb-bae1-cafdb65c6e17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebd9c0a6-b39c-48c8-b30c-efbdc30fd761"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c91e2ab1-c79a-4262-aec9-51c0c8ed1be4"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43e00fa7-8d15-49c3-8c8a-32cd2805cf91"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8dbd675-0d9d-4650-9286-80f5e84986bc"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2293664a-aa49-49e2-bc2c-1bd214e0bb34"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9a81b70-c217-421d-8c87-4509bb2a0ad2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d0a9a615-b37f-4728-935f-c6dd6cbe5fde"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/706a8842-75dc-457a-a3fa-4673a128f669"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84e61f05-8e2b-4254-8c05-522f2c45911b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24107142857142858, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/88f8dc2c-19cd-4e6f-ba09-95efc02f00bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d568bfac-c0e2-42bf-bc0b-866e3b04f671"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=206cea87-8c0f-491c-8e51-ef14f466a0d2"], "isController": false}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/17e7ccde-3f39-4924-9e02-c8799c9be89f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=546cb041-dd8c-40cb-bae1-cafdb65c6e17"], "isController": false}, {"data": [0.2796610169491525, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f811b56-1736-4670-925d-6c12a211ffe2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebd9c0a6-b39c-48c8-b30c-efbdc30fd761"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9224137931034483, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e8dbd675-0d9d-4650-9286-80f5e84986bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/2293664a-aa49-49e2-bc2c-1bd214e0bb34"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43e00fa7-8d15-49c3-8c8a-32cd2805cf91"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f7427e90-7056-41a1-8237-9b959c56f98c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b9a81b70-c217-421d-8c87-4509bb2a0ad2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0a9a615-b37f-4728-935f-c6dd6cbe5fde"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 18, 1.3888888888888888, 482.1296296296293, 137, 3272, 160.0, 1320.6, 1635.4999999999986, 2049.1499999999996, 5.0675675675675675, 714.3310226119675, 3.7030133160504253], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2400.8392857142853, 1742, 3546, 2408.0, 2974.4000000000005, 3175.2999999999997, 3546.0, 0.24831390424838484, 298.8051573495373, 1.2209575272369315], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/84e61f05-8e2b-4254-8c05-522f2c45911b", 3, 0, 0.0, 690.3333333333334, 574, 885, 612.0, 885.0, 885.0, 885.0, 0.028536098164177685, 0.023510698064301342, 0.0182995160753353], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 547.7857142857143, 154, 921, 501.5, 893.5, 921.0, 921.0, 0.07159880123149938, 0.013519667615350783, 0.04842008774688801], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 547.7857142857143, 154, 921, 501.5, 893.5, 921.0, 921.0, 0.0716134510522062, 0.013522433872650823, 0.04842999497427031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 194.76470588235293, 137, 428, 147.0, 426.4, 428.0, 428.0, 0.12116806009935781, 0.03242192233127348, 0.06910365927541501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 147.11764705882354, 140, 152, 148.0, 152.0, 152.0, 152.0, 0.12116806009935781, 0.09004774778868291, 0.06082068641706047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 197.94117647058823, 142, 444, 146.0, 443.2, 444.0, 444.0, 0.12116978738266132, 0.03265904425548293, 0.07135291190600075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/206cea87-8c0f-491c-8e51-ef14f466a0d2", 3, 0, 0.0, 393.0, 231, 491, 457.0, 491.0, 491.0, 491.0, 0.017290767306617175, 0.02383671860140747, 0.011088154815766875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 163.58823529411765, 142, 442, 148.0, 208.3999999999998, 442.0, 442.0, 0.12116892373485388, 0.03265881147540983, 0.07123407430506058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7427e90-7056-41a1-8237-9b959c56f98c", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88f8dc2c-19cd-4e6f-ba09-95efc02f00bc", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 314.71428571428567, 148, 574, 264.0, 515.5, 574.0, 574.0, 0.07107464868816506, 0.14521320173523677, 0.04594369206146942], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f811b56-1736-4670-925d-6c12a211ffe2", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 176.5, 139, 444, 148.0, 408.7000000000006, 443.65, 444.0, 0.11468284459327728, 0.0852281686869961, 0.05756541222748489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 231.90000000000003, 137, 446, 149.0, 441.0, 445.8, 446.0, 0.11468087180398746, 0.065135151407421, 0.063477654432129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1087.0, 989, 1140, 1109.5, 1140.0, 1140.0, 1140.0, 0.052327939194934656, 15.38615157441687, 0.02984327782211117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1496.5, 1272, 1585, 1564.5, 1585.0, 1585.0, 1585.0, 0.052025076086673776, 46.812254913118124, 0.02961974546731525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 146.0, 140, 151, 146.5, 151.0, 151.0, 151.0, 0.0530215665221829, 0.09382331888495646, 0.029358621306716504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 174.72727272727272, 138, 446, 149.0, 389.4000000000002, 446.0, 446.0, 0.12330456226880394, 0.09163551942046856, 0.061893110357583235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 276.4545454545455, 139, 443, 149.0, 442.8, 443.0, 443.0, 0.12330732669715722, 0.06666740230696798, 0.0684408208905031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 436.0, 139, 1634, 149.0, 1561.4000000000003, 1634.0, 1634.0, 0.12331423831037072, 20.201442741555777, 0.07056849965808325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 379.6363636363636, 143, 1174, 149.0, 1101.6000000000004, 1174.0, 1174.0, 0.12330594446748647, 6.619199716396327, 0.07068416933829547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17e7ccde-3f39-4924-9e02-c8799c9be89f", 1, 0, 0.0, 992.0, 992, 992, 992.0, 992.0, 992.0, 992.0, 1.0080645161290323, 0.18212103074596775, 0.6950132308467742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 146.25, 141, 150, 147.0, 150.0, 150.0, 150.0, 0.05301453923738585, 0.039398500351221326, 0.029768906310055535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1103.1333333333332, 140, 1761, 1425.0, 1753.2, 1761.0, 1761.0, 0.07305135510263716, 43.8277216956437, 0.03876097292229771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 440.99999999999994, 142, 1765, 148.5, 1711.900000000001, 1764.5, 1765.0, 0.11468218698930589, 20.66297503512142, 0.06544948249663121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 785.1333333333334, 140, 1320, 883.0, 1299.0, 1320.0, 1320.0, 0.07305099933767094, 14.326176060213502, 0.03883212302031792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 343.75, 139, 1134, 149.5, 1129.7, 1133.9, 1134.0, 0.11468152939287599, 6.768763690107572, 0.06556110088534141], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 529.7142857142859, 149, 1106, 477.0, 1049.0, 1106.0, 1106.0, 0.07170771933598652, 0.013540234112898682, 0.04907397003385629], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/546cb041-dd8c-40cb-bae1-cafdb65c6e17", 3, 0, 0.0, 644.3333333333334, 243, 1229, 461.0, 1229.0, 1229.0, 1229.0, 0.017786737023093115, 0.02452045289479145, 0.011406208312335103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebd9c0a6-b39c-48c8-b30c-efbdc30fd761", 3, 0, 0.0, 354.3333333333333, 267, 464, 332.0, 464.0, 464.0, 464.0, 0.0908787979764321, 0.04112028944897155, 0.058278395837751046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 693.5454545454546, 294, 1772, 586.0, 1701.0000000000002, 1772.0, 1772.0, 0.12309758281110116, 26.932000388177038, 0.2711228632777529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c91e2ab1-c79a-4262-aec9-51c0c8ed1be4", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 669.8499999999997, 245, 1389, 605.0, 1148.0000000000002, 1377.2499999999998, 1389.0, 0.09209756816371263, 0.05657165075681177, 0.04164177154277241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 146.40000000000003, 139, 156, 147.0, 152.4, 156.0, 156.0, 0.07305028781813401, 0.05428834866171873, 0.0366678202524618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 283.3999999999999, 139, 451, 156.0, 449.2, 451.0, 451.0, 0.07305064357616992, 0.09269251583981455, 0.037571620068472804], "isController": false}, {"data": ["login", 20, 0, 0.0, 2949.15, 2063, 4928, 2789.5, 4089.3, 4886.549999999999, 4928.0, 0.09139305869719194, 21.99436433271643, 0.16820249845774213], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/43e00fa7-8d15-49c3-8c8a-32cd2805cf91", 3, 0, 0.0, 401.0, 331, 455, 417.0, 455.0, 455.0, 455.0, 0.07238683524756298, 0.03275315787568767, 0.04641994317633433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 165.95000000000002, 145, 422, 152.0, 166.00000000000003, 409.24999999999983, 422.0, 0.11366025812244619, 0.09201597068701943, 0.040402669879463296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8dbd675-0d9d-4650-9286-80f5e84986bc", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1252.2, 294, 1904, 1567.0, 1901.0, 1904.0, 1904.0, 0.0729973185651647, 58.257824514142015, 0.15172131479120335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2293664a-aa49-49e2-bc2c-1bd214e0bb34", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9a81b70-c217-421d-8c87-4509bb2a0ad2", 1, 0, 0.0, 830.0, 830, 830, 830.0, 830.0, 830.0, 830.0, 1.2048192771084338, 0.2176675451807229, 0.8306664156626506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0a9a615-b37f-4728-935f-c6dd6cbe5fde", 3, 0, 0.0, 325.6666666666667, 252, 463, 262.0, 463.0, 463.0, 463.0, 0.07434207265698568, 0.033637851885810574, 0.04767379008276751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 396.7647058823529, 289, 594, 300.0, 590.0, 594.0, 594.0, 0.1210412394622921, 0.18759028029947025, 0.2722245844547448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1144.6666666666667, 148, 1726, 1561.0, 1726.0, 1726.0, 1726.0, 0.07078643731860976, 56.463105887661925, 0.12204438973242726], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1094.9523809523807, 344, 2049, 1131.0, 1404.4, 1985.6999999999991, 2049.0, 0.09355745541541738, 0.029549955226074908, 0.042210492580002756], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 185.11764705882356, 142, 443, 152.0, 423.0, 443.0, 443.0, 0.0781745776273556, 0.06069217696655048, 0.027788619390974056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 662.3, 291, 2203, 301.5, 1857.400000000001, 2187.85, 2203.0, 0.11458428820240169, 27.5585955403795, 0.25183925686359887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/706a8842-75dc-457a-a3fa-4673a128f669", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 533.0588235294117, 280, 889, 586.0, 881.8, 889.0, 889.0, 0.07659969450239487, 0.11871456560087955, 0.17227450824122595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84e61f05-8e2b-4254-8c05-522f2c45911b", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.2754025342987805, 1.0509956173780488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 146.71428571428572, 143, 151, 146.0, 151.0, 151.0, 151.0, 0.040737938660303785, 0.03027497199266717, 0.020448535616597797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 144.71428571428572, 140, 150, 144.0, 150.0, 150.0, 150.0, 0.04073841283143608, 0.010900708120911609, 0.023233626067928392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 145.57142857142858, 143, 149, 144.0, 149.0, 149.0, 149.0, 0.04073841283143608, 0.010980275333473007, 0.02394973098098098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 187.28571428571428, 139, 433, 148.0, 433.0, 433.0, 433.0, 0.04067000935410215, 0.010961838458722846, 0.023949234023948825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 6.7114093959731544, 1.9793414429530203, 4.148752097315437], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1654.2857142857144, 1130, 2937, 1562.0, 2360.4000000000005, 2545.9, 2937.0, 0.2449372348335739, 293.030086821502, 0.4836553601889516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1094.9523809523807, 344, 2049, 1131.0, 1404.4, 1985.6999999999991, 2049.0, 0.09081866539808849, 0.02868491328979804, 0.040974827552653206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 245.90909090909093, 137, 440, 149.0, 438.2, 440.0, 440.0, 0.05522698289971784, 0.014885397734689575, 0.03252135809426744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 226.7272727272727, 143, 445, 148.0, 444.4, 445.0, 445.0, 0.05522698289971784, 0.014885397734689575, 0.032467425493779435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 146.76470588235293, 140, 157, 147.0, 153.8, 157.0, 157.0, 0.08014369292708338, 0.021601229734252943, 0.04711572572471113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 196.17647058823528, 140, 428, 148.0, 427.2, 428.0, 428.0, 0.08014407075307141, 0.02160133157016378, 0.047194213539162165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 164.35294117647058, 143, 433, 148.0, 207.3999999999998, 433.0, 433.0, 0.08014218165875459, 0.05955878929913305, 0.040227618527929554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 171.99999999999997, 140, 431, 147.0, 374.8000000000002, 431.0, 431.0, 0.05522698289971784, 0.014777532533713562, 0.03149663868499533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88f8dc2c-19cd-4e6f-ba09-95efc02f00bc", 3, 0, 0.0, 433.3333333333333, 239, 544, 517.0, 544.0, 544.0, 544.0, 0.07356727727506805, 0.034101498320213836, 0.04717693236714975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 195.52941176470588, 138, 429, 147.0, 428.2, 429.0, 429.0, 0.08014407075307141, 0.021444800181974186, 0.04570716535136104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 230.8181818181818, 142, 445, 148.0, 442.6, 445.0, 445.0, 0.05522587382393992, 0.0410418847461116, 0.02772079994678234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 152.0, 145, 161, 151.0, 160.8, 161.0, 161.0, 0.05701342925410885, 0.044875804666808336, 0.020266492430171507], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 543.3846153846152, 148, 1272, 491.0, 1012.7999999999997, 1272.0, 1272.0, 0.07152328082790949, 0.01339986947001249, 0.04867795404904297], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d568bfac-c0e2-42bf-bc0b-866e3b04f671", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 1.1960147471910112, 2.234755383895131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=206cea87-8c0f-491c-8e51-ef14f466a0d2", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1499.3500000000001, 1066, 3272, 1413.5, 1983.8000000000009, 3209.5499999999993, 3272.0, 0.0921026576221857, 0.04767032083960783, 0.042363624746142046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 485.4545454545455, 287, 886, 299.0, 882.2, 886.0, 886.0, 0.05518569988009653, 0.08552705635714178, 0.12411393244517803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17e7ccde-3f39-4924-9e02-c8799c9be89f", 3, 0, 0.0, 852.6666666666666, 437, 1497, 624.0, 1497.0, 1497.0, 1497.0, 0.022456602615445652, 0.026542944041889047, 0.0144008812345143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=546cb041-dd8c-40cb-bae1-cafdb65c6e17", 1, 0, 0.0, 1106.0, 1106, 1106, 1106.0, 1106.0, 1106.0, 1106.0, 0.9041591320072332, 0.16334906193490054, 0.6233753390596745], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 1457.0, 738, 2845, 1198.0, 2519.0, 2667.0, 2845.0, 0.26856635637389903, 88.15844010315907, 0.9754911862439402], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 250.91071428571422, 140, 726, 150.0, 587.9000000000001, 601.35, 726.0, 0.24655809304926318, 0.18323311407274342, 0.11918579693299343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f811b56-1736-4670-925d-6c12a211ffe2", 3, 0, 0.0, 404.6666666666667, 361, 474, 379.0, 474.0, 474.0, 474.0, 0.06309811757282574, 0.028550255021558522, 0.04046331107371963], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 951.5714285714284, 683, 1339, 878.5, 1266.2, 1322.9, 1339.0, 0.24635201062832962, 72.4356707813318, 0.12389773972030248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebd9c0a6-b39c-48c8-b30c-efbdc30fd761", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 0.6498707284172661, 2.4800472122302155], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 215.53571428571425, 139, 450, 150.5, 442.3, 446.0, 450.0, 0.24679170779861795, 0.4367056391905232, 0.12002174851924975], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1398.1964285714287, 974, 2336, 1337.5, 1833.8, 1904.45, 2336.0, 0.24561942147854118, 221.00878719928068, 0.12328943617184587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 150.94117647058823, 143, 159, 151.0, 155.8, 159.0, 159.0, 0.0811823977459946, 0.060648959253599484, 0.02885780544877152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, 5.172413793103448, 219.75287356321837, 139, 1956, 153.0, 405.5, 499.25, 897.0, 0.7294741078615509, 1.5626359248180508, 0.35069831293391135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 244.28571428571428, 147, 483, 160.0, 483.0, 483.0, 483.0, 0.04196994951614644, 0.03250211910771887, 0.014919005492067679], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8dbd675-0d9d-4650-9286-80f5e84986bc", 3, 0, 0.0, 794.3333333333334, 249, 1606, 528.0, 1606.0, 1606.0, 1606.0, 0.023384701728129457, 0.02763992577305927, 0.01499604895977052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 169.11764705882354, 147, 437, 151.0, 218.5999999999998, 437.0, 437.0, 0.11733443765745245, 0.09521964618490528, 0.04170872588604756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2293664a-aa49-49e2-bc2c-1bd214e0bb34", 2, 0, 0.0, 386.0, 233, 539, 386.0, 539.0, 539.0, 539.0, 0.013369073322682638, 0.026424808989364904, 0.008309975751843262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 336.1428571428571, 288, 578, 298.0, 578.0, 578.0, 578.0, 0.040635539843146815, 0.06297715012800195, 0.09139028150270226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43e00fa7-8d15-49c3-8c8a-32cd2805cf91", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.5458128776435045, 2.082939954682779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 379.70588235294116, 293, 863, 297.0, 635.7999999999998, 863.0, 863.0, 0.08008592748925907, 0.1241175458256388, 0.18011512793726916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7427e90-7056-41a1-8237-9b959c56f98c", 3, 0, 0.0, 351.3333333333333, 233, 555, 266.0, 555.0, 555.0, 555.0, 0.03246718109111373, 0.027066552986439542, 0.020820425374184263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 151.8181818181818, 140, 164, 151.0, 162.6, 164.0, 164.0, 0.12896267116863627, 0.10692315217009003, 0.04584219951697617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9a81b70-c217-421d-8c87-4509bb2a0ad2", 3, 0, 0.0, 584.3333333333333, 235, 1272, 246.0, 1272.0, 1272.0, 1272.0, 0.01973398587046612, 0.023324903221244295, 0.012654932345318441], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 197.4, 143, 518, 150.0, 475.40000000000003, 518.0, 518.0, 0.07350238882763689, 0.057064842888643885, 0.026127802278574055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0a9a615-b37f-4728-935f-c6dd6cbe5fde", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.5236639492753623, 1.9984148550724639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 179.8235294117647, 139, 440, 146.0, 438.4, 440.0, 440.0, 0.07664839128552879, 0.056962329851843164, 0.03847389953199394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 264.7647058823529, 137, 445, 149.0, 443.4, 445.0, 445.0, 0.0766497736577272, 0.020509802717009036, 0.04371432403917254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 280.70588235294116, 139, 448, 147.0, 445.6, 448.0, 448.0, 0.07664873687390382, 0.020659229860544387, 0.04506107382625986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 228.35294117647058, 140, 445, 145.0, 442.6, 445.0, 445.0, 0.07664873687390382, 0.020659229860544387, 0.045135926108363277], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 27.77777777777778, 0.38580246913580246], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07716049382716049], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07716049382716049], "isController": false}, {"data": ["401/Unauthorized", 11, 61.111111111111114, 0.8487654320987654], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 18, "401/Unauthorized", 11, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
