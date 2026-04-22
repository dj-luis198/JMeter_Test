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

    var data = {"OkPercent": 99.07749077490774, "KoPercent": 0.922509225092251};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7452153110047847, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c5efa89-99ff-426f-a580-5e25653cc138"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2cd01a3-9f02-48de-8506-9418b044d335"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.26595744680851063, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9c5efa89-99ff-426f-a580-5e25653cc138"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af929702-e173-4abc-9d4a-6e7361a659d9"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.34210526315789475, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.2653061224489796, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8829787234042553, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/edcd0ac4-1c13-457f-8056-fd5e4171421e"], "isController": false}, {"data": [0.9893617021276596, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.3723404255319149, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fb9a183-7d60-4fa0-ad29-de2b463785cb"], "isController": false}, {"data": [0.9413793103448276, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fb9a183-7d60-4fa0-ad29-de2b463785cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=edcd0ac4-1c13-457f-8056-fd5e4171421e"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6fe6f82-a09c-4e20-96c1-024a78cf036c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.07894736842105263, 500, 1500, "login"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9bef1a0f-2682-4ec0-b9be-41604e726d60"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de245dbd-2cfa-4366-b60d-278b2740bba9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6fe6f82-a09c-4e20-96c1-024a78cf036c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bef1a0f-2682-4ec0-b9be-41604e726d60"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/2aba2b46-0031-42e7-88fc-bd9dfd79faf0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/93cbda47-ca47-4bc1-992d-3d2515327d05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67d5c0ec-a8d2-4a78-8273-8505a8e13ebb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af929702-e173-4abc-9d4a-6e7361a659d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b42f7d1-698f-45a9-aa89-c0a978339bf8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93cbda47-ca47-4bc1-992d-3d2515327d05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/608a31e7-cd09-4fea-9cb5-dc74308ce552"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68603f14-2257-4c7e-ae8e-f83832909e89"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68603f14-2257-4c7e-ae8e-f83832909e89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "register"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/645879b0-d544-40c9-ae2c-053ef60bb509"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2aba2b46-0031-42e7-88fc-bd9dfd79faf0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1084, 10, 0.922509225092251, 509.02029520295184, 124, 15898, 143.0, 1274.5, 1535.75, 2373.8500000000017, 4.651162790697675, 680.6218799946902, 3.392077650336823], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c5efa89-99ff-426f-a580-5e25653cc138", 1, 0, 0.0, 696.0, 696, 696, 696.0, 696.0, 696.0, 696.0, 1.4367816091954022, 0.25957480244252873, 0.9905935704022989], "isController": false}, {"data": ["see books", 47, 0, 0.0, 2219.2340425531916, 1555, 3920, 2053.0, 2913.2000000000003, 2996.6, 3920.0, 0.2389389078966767, 287.52357615288025, 1.1748607434177414], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 439.72222222222223, 254, 767, 500.0, 762.5, 767.0, 767.0, 0.21717098595627624, 0.3365726120240336, 0.4884226373606486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 256.93333333333334, 130, 1991, 132.0, 881.0000000000007, 1991.0, 1991.0, 0.1241567686131689, 0.09639124125729422, 0.04413385134296238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 412.79999999999995, 255, 1275, 267.0, 818.4000000000003, 1275.0, 1275.0, 0.09143888225110336, 7.425111079192168, 0.20408848959730314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2cd01a3-9f02-48de-8506-9418b044d335", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 155.70000000000002, 128, 382, 129.5, 357.9000000000001, 382.0, 382.0, 0.05292041299090298, 0.03932854910749724, 0.026563566677074348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 153.70000000000002, 125, 378, 129.0, 353.70000000000005, 378.0, 378.0, 0.05292125317527519, 0.014160569697290432, 0.03018165220152413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 178.79999999999998, 126, 385, 128.0, 384.7, 385.0, 385.0, 0.052921533242661106, 0.014264007006811002, 0.031112073253986315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 128.39999999999998, 127, 131, 128.0, 130.9, 131.0, 131.0, 0.05292181331301136, 0.014264082494522592, 0.031163919363033057], "isController": false}, {"data": ["https://demoqa.com/books", 47, 0, 0.0, 1521.9361702127658, 1011, 2465, 1467.0, 2221.2000000000007, 2407.7999999999997, 2465.0, 0.23093099585306892, 276.27375564429747, 0.455998509389556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c5efa89-99ff-426f-a580-5e25653cc138", 3, 0, 0.0, 442.66666666666663, 234, 786, 308.0, 786.0, 786.0, 786.0, 0.033172630368437345, 0.027654657022645846, 0.02127281309434296], "isController": false}, {"data": ["deleteBook", 9, 0, 0.0, 687.5555555555555, 443, 1257, 522.0, 1257.0, 1257.0, 1257.0, 0.10908033160420808, 0.019706895846463374, 0.07414053788723518], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 9, 0, 0.0, 687.5555555555555, 443, 1257, 522.0, 1257.0, 1257.0, 1257.0, 0.11094537789228436, 0.02004384268561778, 0.07540818653616203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af929702-e173-4abc-9d4a-6e7361a659d9", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 19, 4, 21.05263157894737, 1179.0000000000002, 264, 2371, 1089.0, 2284.0, 2371.0, 2371.0, 0.10454207818647004, 0.033120752978073674, 0.047166445431786296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 187.3076923076923, 126, 386, 128.0, 385.2, 386.0, 386.0, 0.12270286086439446, 0.07536197343954996, 0.06760087001047693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 127.75, 126, 129, 128.0, 129.0, 129.0, 129.0, 0.0341924178313459, 0.009215925118604949, 0.02013479292216951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 150.53846153846152, 126, 385, 130.0, 285.7999999999999, 385.0, 385.0, 0.12240478320229745, 0.09096683595405113, 0.06144146344334071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 128.0, 126, 129, 128.5, 129.0, 129.0, 129.0, 0.0341924178313459, 0.009215925118604949, 0.020101401889131086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 411.07692307692304, 124, 1021, 377.0, 1019.8, 1021.0, 1021.0, 0.12168069114632571, 8.28172750896225, 0.06924062766176511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 468.61538461538464, 124, 1523, 129.0, 1474.6, 1523.0, 1523.0, 0.12124490538234114, 25.201225375043133, 0.06887424688260695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 228.6, 126, 1133, 128.0, 685.4000000000003, 1133.0, 1133.0, 0.12632323589601072, 7.609502836482993, 0.07354051923060728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 196.73333333333332, 125, 889, 128.0, 596.8000000000002, 889.0, 889.0, 0.12632536360650493, 2.5080354774256577, 0.07366512251454847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 130.0, 127, 135, 129.0, 135.0, 135.0, 135.0, 0.03419212555348503, 0.009149064845366112, 0.019500196604721933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 131.0, 127, 155, 129.0, 141.20000000000002, 155.0, 155.0, 0.1262945188178833, 0.09385754767618086, 0.06339392839100783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 129.25, 128, 130, 129.5, 130.0, 130.0, 130.0, 0.03419183328062092, 0.02541014172514895, 0.017162697564686677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 181.20000000000002, 127, 408, 129.0, 396.0, 408.0, 408.0, 0.12632323589601072, 0.046450106532595604, 0.07133644193763002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 133.5, 130, 143, 130.5, 143.0, 143.0, 143.0, 0.03648370090661997, 0.028716663018296576, 0.012968815556650066], "isController": false}, {"data": ["deleteAccount", 9, 0, 0.0, 567.8888888888889, 436, 985, 489.0, 985.0, 985.0, 985.0, 0.11796316927714792, 0.02131170538698473, 0.08029329002555868], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1331.8947368421054, 695, 2096, 1277.0, 2061.0, 2096.0, 2096.0, 0.10554206962443687, 0.05462626650483549, 0.04854522929014626], "isController": false}, {"data": ["goToProfile", 9, 0, 0.0, 339.44444444444446, 215, 887, 257.0, 887.0, 887.0, 887.0, 0.1094198317366143, 0.21695188642829355, 0.07073821153285027], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 259.75, 256, 264, 259.5, 264.0, 264.0, 264.0, 0.03415446356145669, 0.052932747726593524, 0.07681418904495582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 170.99999999999997, 125, 385, 130.0, 384.1, 385.0, 385.0, 0.2175121444280639, 0.1616472088962467, 0.109180900621118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 183.5, 126, 385, 128.5, 376.0, 385.0, 385.0, 0.21752528731465032, 0.05820500851974042, 0.12405739042163652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 917.5, 631, 1016, 1011.5, 1016.0, 1016.0, 1016.0, 0.0903179190751445, 26.556467045249278, 0.051509438222543356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1226.0, 1118, 1514, 1136.0, 1514.0, 1514.0, 1514.0, 0.08855238980761992, 79.67959600739412, 0.05041605786898674], "isController": false}, {"data": ["addBook", 49, 6, 12.244897959183673, 2567.326530612245, 658, 16672, 1142.0, 7258.0, 15307.5, 16672.0, 0.2532535326283582, 93.77656900900342, 0.917014405732833], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 313.5, 129, 378, 373.5, 378.0, 378.0, 378.0, 0.09085127646043427, 0.16076417279912783, 0.05030534546197874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 7, 0, 0.0, 201.71428571428572, 127, 385, 129.0, 385.0, 385.0, 385.0, 0.08335020182656014, 0.06194287459962135, 0.041837894276222566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 7, 0, 0.0, 164.14285714285714, 126, 381, 128.0, 381.0, 381.0, 381.0, 0.08335119430354122, 0.022302956288252244, 0.04753622800123836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 7, 0, 0.0, 236.57142857142858, 127, 384, 133.0, 384.0, 384.0, 384.0, 0.08334920937321395, 0.022465216588874074, 0.049000218791674606], "isController": false}, {"data": ["https://demoqa.com/books-0", 47, 0, 0.0, 253.2978723404254, 127, 624, 131.0, 521.0, 613.1999999999998, 624.0, 0.23193955753828238, 0.17236914383460242, 0.11211921970844703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 7, 0, 0.0, 199.2857142857143, 124, 382, 128.0, 382.0, 382.0, 382.0, 0.08335317932841152, 0.02246628661586092, 0.049083952280304835], "isController": false}, {"data": ["https://demoqa.com/books-3", 47, 0, 0.0, 842.8510638297871, 625, 1177, 763.0, 1052.4000000000003, 1144.3999999999999, 1177.0, 0.2316891618767808, 68.12430639597649, 0.11652335777982628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 192.0, 128, 381, 129.5, 381.0, 381.0, 381.0, 0.09083064626004815, 0.06750207207411782, 0.05100353671828876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/edcd0ac4-1c13-457f-8056-fd5e4171421e", 3, 0, 0.0, 1120.0, 215, 2160, 985.0, 2160.0, 2160.0, 2160.0, 0.038575286100038575, 0.02480019207277871, 0.024737406776391926], "isController": false}, {"data": ["https://demoqa.com/books-1", 47, 0, 0.0, 198.65957446808517, 126, 515, 130.0, 388.0, 397.59999999999997, 515.0, 0.23242128583367538, 0.4112767284478709, 0.11303300814958041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1087.2142857142858, 127, 1906, 1373.5, 1842.5, 1906.0, 1906.0, 0.19132740218386565, 122.98382877734957, 0.10073515846008774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 170.61111111111111, 125, 384, 129.0, 383.1, 384.0, 384.0, 0.21752528731465032, 0.05862986259652685, 0.12788107711271435], "isController": false}, {"data": ["https://demoqa.com/books-2", 47, 0, 0.0, 1264.148936170213, 880, 1913, 1270.0, 1689.2000000000003, 1856.1999999999994, 1913.0, 0.23155903277299333, 208.35722472650167, 0.1162317801223814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 746.6428571428572, 128, 1153, 984.0, 1144.5, 1153.0, 1153.0, 0.19132217287324907, 40.19692731465665, 0.10091924325247695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 133.79999999999998, 129, 147, 133.0, 141.6, 147.0, 147.0, 0.08871435161637549, 0.06627585838528052, 0.03153517967613347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 211.11111111111111, 124, 382, 129.5, 381.1, 382.0, 382.0, 0.21751477287832466, 0.05862702862736094, 0.12808731254456032], "isController": false}, {"data": ["deleteBooks", 9, 0, 0.0, 531.4444444444445, 410, 705, 455.0, 705.0, 705.0, 705.0, 0.1115462793118834, 0.02015240397724456, 0.07690593085370086], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fb9a183-7d60-4fa0-ad29-de2b463785cb", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 145, 6, 4.137931034482759, 609.151724137931, 127, 15898, 134.0, 348.4000000000001, 441.7999999999996, 15341.85999999999, 0.64709032488397, 1.4557309680136556, 0.3102660391935916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 243.0, 130, 924, 135.0, 871.4000000000002, 924.0, 924.0, 0.05517819799041003, 0.042730772467182765, 0.019614125066903566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fb9a183-7d60-4fa0-ad29-de2b463785cb", 3, 0, 0.0, 328.3333333333333, 225, 489, 271.0, 489.0, 489.0, 489.0, 0.04159618424336541, 0.026742338502814676, 0.02667463638002274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=edcd0ac4-1c13-457f-8056-fd5e4171421e", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 0, 0.0, 475.42857142857144, 257, 767, 502.0, 767.0, 767.0, 767.0, 0.08322138076159452, 0.12897688600454152, 0.18716683583393767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6fe6f82-a09c-4e20-96c1-024a78cf036c", 3, 0, 0.0, 330.0, 223, 463, 304.0, 463.0, 463.0, 463.0, 0.03461285521442664, 0.028855313217495644, 0.022196394782688957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 153.69230769230768, 129, 387, 133.0, 290.9999999999999, 387.0, 387.0, 0.11777922736826846, 0.0955806034599913, 0.04186683472856418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 600.7894736842105, 223, 1941, 441.0, 1840.0, 1941.0, 1941.0, 0.10626101059813764, 0.06527165592405133, 0.04804574990911887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 130.49999999999997, 128, 137, 130.0, 135.0, 137.0, 137.0, 0.19129864451246176, 0.1421662778066244, 0.09602295242129427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 219.85714285714286, 125, 392, 129.5, 389.0, 392.0, 392.0, 0.19132478749282533, 0.25645208680678927, 0.0976375659387214], "isController": false}, {"data": ["login", 19, 0, 0.0, 2777.78947368421, 1250, 4216, 2654.0, 3889.0, 4216.0, 4216.0, 0.10365803758967784, 26.25104638356202, 0.1925846569055348], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 336.6, 257, 764, 260.0, 738.9000000000001, 764.0, 764.0, 0.05288431028282529, 0.08196035197152708, 0.11893805330209632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 131.66666666666669, 124, 139, 131.0, 139.0, 139.0, 139.0, 0.21123041718007393, 0.17100587484597782, 0.0750858123569794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bef1a0f-2682-4ec0-b9be-41604e726d60", 3, 0, 0.0, 785.0, 313, 1557, 485.0, 1557.0, 1557.0, 1557.0, 0.045126353790613714, 0.02901189737515042, 0.028938449533694344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 397.0666666666667, 255, 1262, 261.0, 828.2000000000003, 1262.0, 1262.0, 0.12615749501677895, 10.244366410777214, 0.2815792579205881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de245dbd-2cfa-4366-b60d-278b2740bba9", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6fe6f82-a09c-4e20-96c1-024a78cf036c", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bef1a0f-2682-4ec0-b9be-41604e726d60", 1, 0, 0.0, 705.0, 705, 705, 705.0, 705.0, 705.0, 705.0, 1.4184397163120568, 0.2562610815602837, 0.9779476950354611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2aba2b46-0031-42e7-88fc-bd9dfd79faf0", 3, 0, 0.0, 1386.3333333333333, 520, 2752, 887.0, 2752.0, 2752.0, 2752.0, 0.022564874012786763, 0.026670917168108314, 0.014470313087626929], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93cbda47-ca47-4bc1-992d-3d2515327d05", 3, 0, 0.0, 338.0, 253, 504, 257.0, 504.0, 504.0, 504.0, 0.027748487707419948, 0.027829782105000277, 0.01779444035925042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67d5c0ec-a8d2-4a78-8273-8505a8e13ebb", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.6517059948979592, 1.2177136479591837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 133.42857142857142, 130, 139, 133.0, 139.0, 139.0, 139.0, 0.09066183136899365, 0.07516786604714416, 0.032227447869446965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1218.7857142857142, 258, 2040, 1504.5, 1976.0, 2040.0, 2040.0, 0.1909620394745816, 163.2681213597861, 0.39457851097349717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af929702-e173-4abc-9d4a-6e7361a659d9", 3, 0, 0.0, 508.3333333333333, 227, 855, 443.0, 855.0, 855.0, 855.0, 0.03590234561991384, 0.02993030831139301, 0.02302331408568693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 154.28571428571428, 128, 414, 133.5, 278.5, 414.0, 414.0, 0.18326286439857056, 0.1422792746063121, 0.06514422132917938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b42f7d1-698f-45a9-aa89-c0a978339bf8", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93cbda47-ca47-4bc1-992d-3d2515327d05", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/608a31e7-cd09-4fea-9cb5-dc74308ce552", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68603f14-2257-4c7e-ae8e-f83832909e89", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.28451033464566927, 1.0857529527559056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 699.9230769230769, 255, 1653, 515.0, 1606.2, 1653.0, 1653.0, 0.12080998448056353, 33.49727262747777, 0.2645713249370394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1419.0, 1247, 1645, 1392.0, 1645.0, 1645.0, 1645.0, 0.08780980396461265, 105.0510531688363, 0.19800081772879943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68603f14-2257-4c7e-ae8e-f83832909e89", 3, 0, 0.0, 412.6666666666667, 400, 436, 402.0, 436.0, 436.0, 436.0, 0.029122537932105657, 0.024278261602904486, 0.018675585848388066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 129.20000000000002, 127, 132, 129.0, 132.0, 132.0, 132.0, 0.09165174779883054, 0.06811228522940432, 0.046004881219334846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 213.8, 124, 384, 132.0, 383.4, 384.0, 384.0, 0.09151251891258724, 0.033649915808482596, 0.051678358661964956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 247.5333333333333, 125, 1148, 130.0, 688.4000000000003, 1148.0, 1148.0, 0.09151251891258724, 5.512562809998657, 0.05327506146590853], "isController": false}, {"data": ["register", 19, 4, 21.05263157894737, 1179.0000000000002, 264, 2371, 1089.0, 2284.0, 2371.0, 2371.0, 0.11046062078868883, 0.03499585045957432, 0.04983672539489672], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 204.93333333333334, 125, 1014, 130.0, 634.8000000000002, 1014.0, 1014.0, 0.09165454789866673, 1.8196888671803397, 0.053447251662002475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/645879b0-d544-40c9-ae2c-053ef60bb509", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2aba2b46-0031-42e7-88fc-bd9dfd79faf0", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 40.0, 0.36900369003690037], "isController": false}, {"data": ["401/Unauthorized", 6, 60.0, 0.5535055350553506], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1084, 10, "401/Unauthorized", 6, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 19, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 145, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
