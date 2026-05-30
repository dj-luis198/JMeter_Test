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

    var data = {"OkPercent": 97.86921381337253, "KoPercent": 2.1307861866274798};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8133291219204043, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.35964912280701755, 500, 1500, "see books"], "isController": true}, {"data": [0.59375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.59375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1366f0ae-08a7-4353-b1e0-7b6939477e5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7365db5c-8eaf-4d68-b326-c74b4171ecf0"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cae315bb-ae0f-48d2-ad47-ce2a83fabb85"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0dcef80-5d12-4753-86e1-50a241728346"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c2672fe-ce0b-4d4f-b5c5-65539947416f"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30b6a5ce-1ab5-43dc-a35f-dc4e8c573ce7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b90aade2-2b2f-43e5-98af-4c0afd67bafa"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07b75c5b-f0c9-4a86-824f-c0e8884b8bd0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1246e8f0-dfc8-4de5-bb28-9d63a8f573fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7e4c785-0572-4804-b3d0-ba74e09a3658"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98af6e7a-83e8-49f6-a8c1-bc4111e1867c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c3c872a-77ec-4021-a98a-72cf9ffde293"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb2bd08f-ab8a-45ab-ac69-8319dfb6dcb1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb599409-3e58-4cdd-aa2a-c7d66ad6d5af"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb2bd08f-ab8a-45ab-ac69-8319dfb6dcb1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/07b75c5b-f0c9-4a86-824f-c0e8884b8bd0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c3c872a-77ec-4021-a98a-72cf9ffde293"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c2672fe-ce0b-4d4f-b5c5-65539947416f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1366f0ae-08a7-4353-b1e0-7b6939477e5a"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7365db5c-8eaf-4d68-b326-c74b4171ecf0"], "isController": false}, {"data": [0.425, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b90aade2-2b2f-43e5-98af-4c0afd67bafa"], "isController": false}, {"data": [0.359375, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d0dcef80-5d12-4753-86e1-50a241728346"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7719298245614035, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cae315bb-ae0f-48d2-ad47-ce2a83fabb85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9162162162162162, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30b6a5ce-1ab5-43dc-a35f-dc4e8c573ce7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb599409-3e58-4cdd-aa2a-c7d66ad6d5af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1246e8f0-dfc8-4de5-bb28-9d63a8f573fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98af6e7a-83e8-49f6-a8c1-bc4111e1867c"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1361, 29, 2.1307861866274798, 297.6745040411463, 77, 5390, 96.0, 788.8, 1016.9999999999986, 1483.4999999999911, 5.388925184613253, 732.9797013583675, 3.951363162231989], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1388.3859649122805, 962, 2003, 1390.0, 1677.4, 1931.4999999999995, 2003.0, 0.26275030423719437, 316.17517756533033, 1.2919411931975329], "isController": true}, {"data": ["deleteBook", 16, 3, 18.75, 510.43749999999994, 83, 1530, 433.0, 1146.4000000000003, 1530.0, 1530.0, 0.08720629193396304, 0.017623293004965308, 0.05849059704970213], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 510.43749999999994, 83, 1530, 433.0, 1146.4000000000003, 1530.0, 1530.0, 0.08869523762008504, 0.017924190170904637, 0.05948925574994595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 132.2941176470588, 78, 265, 88.0, 261.8, 265.0, 265.0, 0.09858044164037855, 0.026377969735804415, 0.05622165812302839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 92.76470588235294, 79, 238, 81.0, 119.5999999999999, 238.0, 238.0, 0.09857415385685872, 0.07325676863776318, 0.049479604572681045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1366f0ae-08a7-4353-b1e0-7b6939477e5a", 3, 0, 0.0, 295.6666666666667, 174, 454, 259.0, 454.0, 454.0, 454.0, 0.05708848715509039, 0.046737482159847764, 0.03660947906755471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 124.58823529411765, 78, 267, 83.0, 260.6, 267.0, 267.0, 0.09857586862736002, 0.02656927709096813, 0.058048094513962985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 119.05882352941175, 78, 235, 86.0, 235.0, 235.0, 235.0, 0.0985815849599295, 0.026570817821230993, 0.057955189595583545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7365db5c-8eaf-4d68-b326-c74b4171ecf0", 3, 0, 0.0, 603.3333333333334, 209, 1233, 368.0, 1233.0, 1233.0, 1233.0, 0.017809967645225445, 0.024552478182789637, 0.011421105553741578], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 172.1875, 79, 266, 175.0, 252.70000000000002, 266.0, 266.0, 0.08752017066433279, 0.17175512984437818, 0.05656439740994995], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 12, 0, 0.0, 84.08333333333333, 79, 91, 82.0, 90.7, 91.0, 91.0, 0.08694833095433038, 0.06461687485961468, 0.04364398643606037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 12, 0, 0.0, 94.0, 78, 239, 80.0, 193.70000000000016, 239.0, 239.0, 0.08695085103145447, 0.045032162757501326, 0.048372071748943916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cae315bb-ae0f-48d2-ad47-ce2a83fabb85", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 622.5, 469, 711, 657.5, 711.0, 711.0, 711.0, 0.05676013168350551, 16.689363328697922, 0.03237101260074923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 921.1666666666666, 847, 1093, 881.5, 1093.0, 1093.0, 1093.0, 0.05666525003541578, 50.98749158875194, 0.03226156325258535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 160.0, 78, 240, 161.5, 240.0, 240.0, 240.0, 0.05708848715509039, 0.10101986203615605, 0.03161051974310181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 82.28571428571429, 78, 88, 81.0, 87.5, 88.0, 88.0, 0.11166322371726871, 0.08298409496957178, 0.05604970409245715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 125.0, 78, 236, 81.0, 235.5, 236.0, 236.0, 0.1115289019182971, 0.04180777894175004, 0.06293727793798992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 159.7857142857143, 78, 1034, 79.5, 634.0, 1034.0, 1034.0, 0.11166055192215664, 7.204543500259212, 0.06495877532301803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 154.78571428571428, 78, 625, 82.5, 442.5, 625.0, 625.0, 0.11153067890317545, 2.370322557677294, 0.06499213808294696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0dcef80-5d12-4753-86e1-50a241728346", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 851.6666666666666, 79, 4543, 85.0, 4543.0, 4543.0, 4543.0, 0.05708848715509039, 0.042426112036156045, 0.03205652354900095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 509.0526315789473, 78, 1123, 700.0, 1030.0, 1123.0, 1123.0, 0.09403519885969949, 44.54518321706789, 0.051029175039098845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 12, 0, 0.0, 203.58333333333334, 78, 769, 80.5, 749.5000000000001, 769.0, 769.0, 0.08695022099847838, 13.059190117563945, 0.04987183899717412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 362.99999999999994, 79, 784, 458.0, 705.0, 784.0, 784.0, 0.09410319653700236, 14.574890357394034, 0.051157972336136615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 12, 0, 0.0, 172.75, 78, 626, 80.5, 625.4, 626.0, 626.0, 0.08694833095433038, 4.28047878641867, 0.049955665408331094], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 461.5, 83, 812, 443.0, 782.0, 812.0, 812.0, 0.07954545454545454, 0.015020197088068182, 0.054437810724431816], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8c2672fe-ce0b-4d4f-b5c5-65539947416f", 3, 0, 0.0, 346.0, 193, 442, 403.0, 442.0, 442.0, 442.0, 0.02114656685487111, 0.025366243118554704, 0.01356078668753128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 289.9285714285715, 161, 1114, 173.0, 727.5, 1114.0, 1114.0, 0.11145254509847628, 9.68439120788686, 0.2486225162004235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 574.75, 109, 1455, 482.0, 1423.6000000000006, 1454.65, 1455.0, 0.09343742262213438, 0.05739466682551029, 0.04224758464262522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 87.42105263157896, 79, 144, 82.0, 95.0, 144.0, 144.0, 0.09410645917017914, 0.06993653850440071, 0.04723703126315633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 158.5263157894737, 79, 259, 89.0, 246.0, 259.0, 259.0, 0.09410226439764645, 0.0995677022455772, 0.04950816089506112], "isController": false}, {"data": ["login", 20, 0, 0.0, 2673.75, 1307, 6308, 2437.0, 3408.7000000000003, 6164.049999999997, 6308.0, 0.09059324989695018, 32.637094128085266, 0.1817527076057563], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/30b6a5ce-1ab5-43dc-a35f-dc4e8c573ce7", 3, 0, 0.0, 361.6666666666667, 162, 499, 424.0, 499.0, 499.0, 499.0, 0.0187444938049448, 0.025840797937480866, 0.012020394790280355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 12, 0, 0.0, 87.16666666666667, 81, 98, 85.0, 97.7, 98.0, 98.0, 0.08263495320795775, 0.06689880489198922, 0.029374143523141227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b90aade2-2b2f-43e5-98af-4c0afd67bafa", 1, 0, 0.0, 742.0, 742, 742, 742.0, 742.0, 742.0, 742.0, 1.3477088948787064, 0.24348256401617252, 0.9291821091644205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 611.6842105263156, 161, 1203, 783.0, 1111.0, 1203.0, 1203.0, 0.09399751648666967, 59.25516766033997, 0.1987446461611909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07b75c5b-f0c9-4a86-824f-c0e8884b8bd0", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.5018446180555556, 1.9151475694444444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1246e8f0-dfc8-4de5-bb28-9d63a8f573fa", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 268.76470588235287, 160, 482, 315.0, 379.5999999999999, 482.0, 482.0, 0.09852330945591951, 0.15269188682279713, 0.22158123210642836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 1097.6, 79, 5390, 957.0, 4968.300000000001, 5390.0, 5390.0, 0.08893394875625872, 63.84707140506746, 0.143588376444065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7e4c785-0572-4804-b3d0-ba74e09a3658", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98af6e7a-83e8-49f6-a8c1-bc4111e1867c", 3, 0, 0.0, 304.0, 177, 451, 284.0, 451.0, 451.0, 451.0, 0.08261504144521246, 0.03738115482058767, 0.05297904676011345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c3c872a-77ec-4021-a98a-72cf9ffde293", 1, 0, 0.0, 812.0, 812, 812, 812.0, 812.0, 812.0, 812.0, 1.2315270935960592, 0.22249268780788176, 0.8490802032019704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb2bd08f-ab8a-45ab-ac69-8319dfb6dcb1", 3, 0, 0.0, 322.66666666666663, 169, 623, 176.0, 623.0, 623.0, 623.0, 0.021238637329028972, 0.02510335030654433, 0.013619829276753603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb599409-3e58-4cdd-aa2a-c7d66ad6d5af", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.3186315035273369, 1.2159667107583776], "isController": false}, {"data": ["register", 21, 7, 33.333333333333336, 801.8095238095239, 202, 1852, 785.0, 1555.6000000000004, 1831.8999999999996, 1852.0, 0.08686623840232305, 0.027145699500725953, 0.039191603654173096], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 23, 0, 0.0, 89.0, 80, 103, 88.0, 100.80000000000001, 102.8, 103.0, 0.1052178925313595, 0.08168771929924884, 0.0374016727357567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 12, 0, 0.0, 290.1666666666667, 159, 850, 176.5, 830.8000000000001, 850.0, 850.0, 0.08689040947105463, 17.437408923464034, 0.19171327975091418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb2bd08f-ab8a-45ab-ac69-8319dfb6dcb1", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07b75c5b-f0c9-4a86-824f-c0e8884b8bd0", 3, 0, 0.0, 856.0, 247, 1918, 403.0, 1918.0, 1918.0, 1918.0, 0.027259097723865342, 0.027338958361728224, 0.017480606287765207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c3c872a-77ec-4021-a98a-72cf9ffde293", 3, 0, 0.0, 286.0, 171, 421, 266.0, 421.0, 421.0, 421.0, 0.02969708968521085, 0.024757241759057615, 0.01904403212235201], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c2672fe-ce0b-4d4f-b5c5-65539947416f", 1, 0, 0.0, 752.0, 752, 752, 752.0, 752.0, 752.0, 752.0, 1.3297872340425532, 0.24024476396276595, 0.9168259640957447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1366f0ae-08a7-4353-b1e0-7b6939477e5a", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 301.3684210526316, 165, 945, 317.0, 434.0, 945.0, 945.0, 0.09240975457914652, 5.954321083163916, 0.2065872880047275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 112.49999999999999, 80, 261, 88.0, 252.60000000000002, 261.0, 261.0, 0.06705296625559473, 0.0498313548051832, 0.033657445952515325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 84.08333333333334, 79, 91, 84.0, 90.7, 91.0, 91.0, 0.06705671321520176, 0.017942909590786406, 0.03824328175554475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 107.33333333333334, 78, 236, 81.5, 235.1, 236.0, 236.0, 0.06699793423036123, 0.01805803696052705, 0.03938745742839595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 142.16666666666669, 78, 356, 84.0, 319.40000000000015, 356.0, 356.0, 0.06695307705183284, 0.01804594654912682, 0.0394264701779836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 3.5532756024096384, 7.447759789156626], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 967.8947368421051, 634, 1627, 867.0, 1318.6000000000001, 1555.6999999999996, 1627.0, 0.2535282684019268, 303.30794969576607, 0.500619295613961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, 33.333333333333336, 801.8095238095239, 202, 1852, 785.0, 1555.6000000000004, 1831.8999999999996, 1852.0, 0.08739003420695625, 0.027309385689673827, 0.03942792558946659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 110.2, 78, 232, 80.0, 232.0, 232.0, 232.0, 0.030850105507360833, 0.008315067500030849, 0.018166614864197836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 116.0, 79, 260, 80.0, 260.0, 260.0, 260.0, 0.030849915162733305, 0.008315016196205461, 0.018136375906216258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 23, 0, 0.0, 103.21739130434783, 77, 261, 81.0, 236.4, 256.3999999999999, 261.0, 0.10402626889433646, 0.02803833028792662, 0.06115606823670951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 23, 0, 0.0, 115.91304347826086, 79, 237, 85.0, 234.0, 236.39999999999998, 237.0, 0.1040290919617173, 0.028039091192806613, 0.061259318801675317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 23, 0, 0.0, 99.69565217391303, 78, 239, 88.0, 182.6000000000002, 238.6, 239.0, 0.10402815092223218, 0.07730998325372919, 0.052217255443386075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 81.4, 79, 88, 80.0, 88.0, 88.0, 88.0, 0.030849534480524687, 0.008254660593421646, 0.017593875133424235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 23, 0, 0.0, 111.78260869565216, 79, 266, 82.0, 254.00000000000003, 265.6, 266.0, 0.10402862143984658, 0.02783578347120895, 0.0593288231649125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 114.0, 79, 237, 83.0, 237.0, 237.0, 237.0, 0.030848963474827244, 0.022925841019866732, 0.015484733619200393], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 471.0, 81, 876, 418.0, 847.0, 876.0, 876.0, 0.08027983255920637, 0.015002069714433169, 0.054637997089856075], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 87.6, 82, 92, 91.0, 92.0, 92.0, 92.0, 0.03174200101574403, 0.02498442658075165, 0.011283289423565261], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7365db5c-8eaf-4d68-b326-c74b4171ecf0", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1248.3, 729, 1867, 1230.0, 1817.9000000000003, 1865.2, 1867.0, 0.09112862805850458, 0.047166184444343194, 0.04191560919487857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 233.2, 160, 498, 167.0, 498.0, 498.0, 498.0, 0.0308335543071392, 0.04778598699749015, 0.06934538629818514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b90aade2-2b2f-43e5-98af-4c0afd67bafa", 3, 0, 0.0, 403.0, 183, 818, 208.0, 818.0, 818.0, 818.0, 0.05047445992327882, 0.03245021430614443, 0.032368061864863046], "isController": false}, {"data": ["addBook", 64, 14, 21.875, 826.9687499999999, 405, 2296, 691.5, 1384.0, 1590.0, 2296.0, 0.31376086519558577, 83.30185798368198, 1.1435352162866401], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d0dcef80-5d12-4753-86e1-50a241728346", 3, 0, 0.0, 299.0, 163, 393, 341.0, 393.0, 393.0, 393.0, 0.023823515397932118, 0.023893310853199498, 0.015277449652970792], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 160.38596491228066, 80, 635, 90.0, 322.2, 365.5999999999997, 635.0, 0.2546939650935218, 0.18927940179313488, 0.123118664766888], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 530.4385964912282, 384, 788, 475.0, 704.0, 770.4, 788.0, 0.25475429618538964, 74.90622171724507, 0.12812349856980043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cae315bb-ae0f-48d2-ad47-ce2a83fabb85", 3, 0, 0.0, 298.0, 204, 415, 275.0, 415.0, 415.0, 415.0, 0.06037310579380572, 0.027317258155400374, 0.03871582630657463], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 124.10526315789473, 79, 264, 87.0, 245.4, 261.2, 264.0, 0.2553729116544132, 0.45189034757597346, 0.12419502930068144], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 805.438596491228, 544, 1308, 775.0, 1001.8000000000001, 1087.3999999999992, 1308.0, 0.2542928650775593, 228.81316699596476, 0.12764309829088427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 99.42105263157893, 80, 243, 91.0, 108.0, 243.0, 243.0, 0.09277660857548842, 0.06931064996118032, 0.032979185079568145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 14, 7.5675675675675675, 141.01081081081085, 78, 1780, 91.0, 238.20000000000002, 316.7999999999997, 754.0199999999837, 0.7541816313967852, 1.5482340875319507, 0.36449059999225436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 103.66666666666667, 80, 264, 90.0, 214.20000000000016, 264.0, 264.0, 0.06499098250117796, 0.05032993078460364, 0.023102263310965605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 101.64705882352939, 82, 269, 92.0, 139.3999999999999, 269.0, 269.0, 0.09747818208924415, 0.07910582941031434, 0.03465044753953601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 258.58333333333337, 161, 590, 176.5, 561.5000000000001, 590.0, 590.0, 0.06691947356680794, 0.1037121138188713, 0.1505034644769128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 23, 0, 0.0, 241.9565217391304, 158, 503, 180.0, 442.6000000000002, 502.6, 503.0, 0.10398723217636234, 0.16115989986707718, 0.23386972236539302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 86.85714285714285, 80, 101, 84.0, 99.0, 101.0, 101.0, 0.10757976270978054, 0.08919454935605828, 0.038241243775742305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 100.36842105263158, 81, 275, 91.0, 116.0, 275.0, 275.0, 0.09015677789166002, 0.06999476408581028, 0.032047917141176024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30b6a5ce-1ab5-43dc-a35f-dc4e8c573ce7", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb599409-3e58-4cdd-aa2a-c7d66ad6d5af", 3, 0, 0.0, 435.66666666666663, 174, 876, 257.0, 876.0, 876.0, 876.0, 0.02122000905387053, 0.02923968044434699, 0.013607883410196921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1246e8f0-dfc8-4de5-bb28-9d63a8f573fa", 3, 0, 0.0, 242.0, 166, 389, 171.0, 389.0, 389.0, 389.0, 0.05516024049864857, 0.03546271972162465, 0.03537294068435472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 83.47368421052632, 78, 92, 81.0, 90.0, 92.0, 92.0, 0.09244842351109381, 0.06870434598822499, 0.04640477508271701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 135.1578947368421, 77, 265, 85.0, 260.0, 265.0, 265.0, 0.09245067270028952, 0.03204601853879279, 0.052317121013064745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 185.89473684210526, 78, 856, 88.0, 354.0, 856.0, 856.0, 0.09244617443133438, 4.401670455236589, 0.0539301027855492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 150.94736842105263, 78, 693, 89.0, 265.0, 693.0, 693.0, 0.09244662423853175, 1.4542572430713687, 0.05402064509497674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98af6e7a-83e8-49f6-a8c1-bc4111e1867c", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.0627297794117647, 4.055606617647059], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 24.137931034482758, 0.5143277002204262], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.2204261572373255], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.4482758620689653, 0.07347538574577517], "isController": false}, {"data": ["401/Unauthorized", 18, 62.06896551724138, 1.322556943423953], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1361, 29, "401/Unauthorized", 18, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
