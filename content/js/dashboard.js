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

    var data = {"OkPercent": 99.2289899768697, "KoPercent": 0.7710100231303006};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8145321831453218, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d374395-5192-4275-93c9-58f29aacee47"], "isController": false}, {"data": [0.39473684210526316, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/71f42e79-1433-45a7-aff4-0c8859e0d300"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8352530-2f12-49d1-9bba-858a6a7ea284"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b99b5609-7a07-4aad-a2f6-667882abe903"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=229a5bcd-c715-4a89-a297-6e3b535a07e8"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8937a4f2-f77d-4f18-8c68-76334bf9b17e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a72f4cee-aedd-439e-acbf-507a68860c3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eba1441b-6098-40e1-bdca-acbee841793b"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce38e4fe-5cf0-45f7-bfc8-3638114344c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/218fa131-114a-4364-ad57-456e8fa36e0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0920c7a3-8195-4522-99b2-6bb10d81804c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/229a5bcd-c715-4a89-a297-6e3b535a07e8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b38c07e-b83f-4721-affe-11bde25aa863"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b99b5609-7a07-4aad-a2f6-667882abe903"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38384185-4c4d-4664-8d42-0a52bb141267"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f36979bd-1086-4a12-90b6-2dd4baee16d8"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/38384185-4c4d-4664-8d42-0a52bb141267"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b38c07e-b83f-4721-affe-11bde25aa863"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b39a1bf-0ea1-44dc-8556-75eae9cb5325"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/456f72e2-5f73-4901-83b8-9466226949cb"], "isController": false}, {"data": [0.4051724137931034, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8937a4f2-f77d-4f18-8c68-76334bf9b17e"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8596491228070176, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c8352530-2f12-49d1-9bba-858a6a7ea284"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9682080924855492, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f36979bd-1086-4a12-90b6-2dd4baee16d8"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eba1441b-6098-40e1-bdca-acbee841793b"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce38e4fe-5cf0-45f7-bfc8-3638114344c3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a72f4cee-aedd-439e-acbf-507a68860c3e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0920c7a3-8195-4522-99b2-6bb10d81804c"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3938945-237d-4e77-b04f-4d525d6893ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=218fa131-114a-4364-ad57-456e8fa36e0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b669efb5-a045-404b-b828-c66ecfc3369e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1297, 10, 0.7710100231303006, 323.9275250578257, 76, 2963, 124.0, 849.4000000000001, 1088.2999999999997, 2073.2999999999997, 5.161387884069737, 736.5370866562007, 3.7644187817612393], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/6d374395-5192-4275-93c9-58f29aacee47", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1348.1052631578948, 993, 2199, 1310.0, 1630.4, 1724.6, 2199.0, 0.2628642052738861, 316.31334591401804, 1.292501243705094], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/71f42e79-1433-45a7-aff4-0c8859e0d300", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.5651963495575222, 1.056070243362832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8352530-2f12-49d1-9bba-858a6a7ea284", 1, 0, 0.0, 1093.0, 1093, 1093, 1093.0, 1093.0, 1093.0, 1093.0, 0.9149130832570906, 0.16529191445562672, 0.6307896843549863], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 675.6923076923076, 90, 1144, 742.0, 1085.2, 1144.0, 1144.0, 0.08242664029014178, 0.015615984586218264, 0.05572095372378198], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 675.6923076923076, 90, 1144, 742.0, 1085.2, 1144.0, 1144.0, 0.08217913787762894, 0.01556909448072267, 0.05555364045678958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 133.0666666666667, 78, 241, 82.0, 241.0, 241.0, 241.0, 0.11664981724861966, 0.042893109884127846, 0.06587373143323742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 106.13333333333334, 78, 240, 83.0, 236.4, 240.0, 240.0, 0.11664618878019192, 0.08668725552902935, 0.05855091897755728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 139.4, 77, 634, 81.0, 398.20000000000016, 634.0, 634.0, 0.11664891011034988, 2.315921336835393, 0.06802241457411483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 158.86666666666667, 77, 784, 81.0, 458.20000000000016, 784.0, 784.0, 0.11665072440099852, 7.02684673893179, 0.06790955583292506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b99b5609-7a07-4aad-a2f6-667882abe903", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=229a5bcd-c715-4a89-a297-6e3b535a07e8", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 296.9230769230769, 79, 525, 226.0, 510.2, 525.0, 525.0, 0.0819971994802639, 0.1962709408232519, 0.05300374861235509], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 81.81250000000001, 79, 96, 80.5, 87.60000000000001, 96.0, 96.0, 0.10774918683035564, 0.0800753234159186, 0.05408504104570586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 119.93750000000001, 76, 250, 80.0, 244.4, 250.0, 250.0, 0.10774846121728823, 0.03894570235161016, 0.0608847200897006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 574.0, 467, 628, 627.0, 628.0, 628.0, 628.0, 0.02909147328917894, 8.553859074842663, 0.016591230860234864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 914.3333333333334, 708, 1024, 1011.0, 1024.0, 1024.0, 1024.0, 0.028934906106229685, 26.03567937652511, 0.016473681894464753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 186.66666666666666, 80, 244, 236.0, 244.0, 244.0, 244.0, 0.029156502385973778, 0.051593342112680164, 0.016144274270358527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 117.7142857142857, 79, 256, 83.5, 249.5, 256.0, 256.0, 0.06760149882180244, 0.05023900449549967, 0.03393278358828756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 93.21428571428574, 79, 249, 81.5, 166.0, 249.0, 249.0, 0.06760215167991347, 0.025341375776217565, 0.038148814668701174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 182.64285714285717, 78, 948, 82.0, 637.0, 948.0, 948.0, 0.06760182524928172, 4.361793689188537, 0.03932751273570101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 165.42857142857144, 79, 621, 83.0, 434.5, 621.0, 621.0, 0.06760215167991347, 1.436724914169411, 0.03939372036369958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8937a4f2-f77d-4f18-8c68-76334bf9b17e", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 79.66666666666667, 79, 80, 80.0, 80.0, 80.0, 80.0, 0.029201059025073976, 0.021701177654376264, 0.016397079042399936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 119.99999999999999, 79, 705, 81.0, 269.6000000000005, 705.0, 705.0, 0.10774918683035564, 6.086783394250908, 0.06276600580498744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 545.5, 80, 1099, 717.5, 1064.8, 1099.0, 1099.0, 0.09719799772124695, 48.59993751316223, 0.05250126222399819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 143.5625, 79, 622, 81.0, 352.5000000000003, 622.0, 622.0, 0.10774918683035564, 2.007341570814786, 0.06287122962025146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 415.3888888888888, 78, 716, 473.0, 715.1, 716.0, 716.0, 0.09711461682888405, 15.875478997615296, 0.05255106273064721], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 673.4615384615383, 87, 1440, 628.0, 1407.2, 1440.0, 1440.0, 0.08204429129510069, 0.015543547374267124, 0.056115780667209424], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 325.57142857142856, 162, 1191, 170.0, 844.5, 1191.0, 1191.0, 0.06757441632597898, 5.871710536239194, 0.15074147838342689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a72f4cee-aedd-439e-acbf-507a68860c3e", 3, 0, 0.0, 424.3333333333333, 260, 525, 488.0, 525.0, 525.0, 525.0, 0.017561729479119104, 0.02421026183075176, 0.01126191636519031], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eba1441b-6098-40e1-bdca-acbee841793b", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 592.952380952381, 100, 2166, 635.0, 1055.6000000000001, 2060.5999999999985, 2166.0, 0.10002286236854138, 0.0614398246384888, 0.04522518093421354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 99.77777777777779, 79, 247, 82.0, 235.3, 247.0, 247.0, 0.09719747286570549, 0.07223366879961121, 0.04878857524704358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce38e4fe-5cf0-45f7-bfc8-3638114344c3", 3, 0, 0.0, 354.0, 202, 457, 403.0, 457.0, 457.0, 457.0, 0.018674485051074715, 0.022072609121240983, 0.011975499853716534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 152.0, 78, 245, 82.5, 245.0, 245.0, 245.0, 0.09711514078997772, 0.10702054794520548, 0.050854781841626784], "isController": false}, {"data": ["login", 21, 0, 0.0, 3070.8095238095234, 1620, 5968, 2925.0, 4923.6, 5887.5999999999985, 5968.0, 0.09949164507066276, 17.14364021126577, 0.1736800997166857], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/218fa131-114a-4364-ad57-456e8fa36e0c", 3, 0, 0.0, 304.0, 193, 510, 209.0, 510.0, 510.0, 510.0, 0.1015744032503809, 0.047150097342136446, 0.06513723125105807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 97.1875, 82, 246, 84.5, 148.0000000000001, 246.0, 246.0, 0.11256428475949938, 0.0911287031890869, 0.04001308559810329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0920c7a3-8195-4522-99b2-6bb10d81804c", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/229a5bcd-c715-4a89-a297-6e3b535a07e8", 3, 0, 0.0, 618.3333333333334, 289, 1096, 470.0, 1096.0, 1096.0, 1096.0, 0.02288032825644272, 0.027043773404669114, 0.014672606336325573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b38c07e-b83f-4721-affe-11bde25aa863", 3, 0, 0.0, 689.3333333333333, 217, 1425, 426.0, 1425.0, 1425.0, 1425.0, 0.027982986344302664, 0.02806496774960824, 0.0179448187168868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b99b5609-7a07-4aad-a2f6-667882abe903", 3, 0, 0.0, 1285.0, 188, 2906, 761.0, 2906.0, 2906.0, 2906.0, 0.037436825357209706, 0.024068271510575903, 0.024007339177637733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 668.9444444444446, 160, 1182, 805.0, 1146.9, 1182.0, 1182.0, 0.0970716712506067, 64.58434449657553, 0.20451829868413957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38384185-4c4d-4664-8d42-0a52bb141267", 1, 0, 0.0, 764.0, 764, 764, 764.0, 764.0, 764.0, 764.0, 1.3089005235602096, 0.23647128599476439, 0.9024255562827225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 297.73333333333335, 159, 865, 197.0, 634.6000000000001, 865.0, 865.0, 0.11657457275419086, 9.466204424199328, 0.2601904998523389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 629.0, 79, 1105, 789.0, 1105.0, 1105.0, 1105.0, 0.04818766203101358, 34.594675504283884, 0.0779661313017415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f36979bd-1086-4a12-90b6-2dd4baee16d8", 1, 0, 0.0, 816.0, 816, 816, 816.0, 816.0, 816.0, 816.0, 1.2254901960784315, 0.22140203737745098, 0.8449180453431373], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1150.8636363636363, 105, 2337, 1084.0, 2124.4999999999995, 2326.95, 2337.0, 0.09365607785374326, 0.02976640258490775, 0.042254988250419324], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 261.875, 161, 786, 166.0, 466.8000000000003, 786.0, 786.0, 0.10768971899713949, 8.208613337119301, 0.24047461299007236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 89.875, 82, 120, 85.5, 108.80000000000001, 120.0, 120.0, 0.10745538922356765, 0.08342483831321902, 0.038197032888065065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38384185-4c4d-4664-8d42-0a52bb141267", 3, 0, 0.0, 394.3333333333333, 265, 526, 392.0, 526.0, 526.0, 526.0, 0.052053511009317585, 0.033465392006315826, 0.03338066949490743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 354.40000000000003, 161, 1115, 319.0, 910.100000000001, 1107.1, 1115.0, 0.10051311947491946, 12.165061623965343, 0.22348463908251623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 106.71428571428571, 82, 238, 85.0, 238.0, 238.0, 238.0, 0.03834544866913903, 0.028496959411342587, 0.019247617789001432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 149.42857142857142, 80, 243, 84.0, 243.0, 243.0, 243.0, 0.038346498964644524, 0.018488490572239325, 0.02140941529806186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 228.71428571428572, 80, 953, 82.0, 953.0, 953.0, 953.0, 0.038346498964644524, 4.938037236162392, 0.022072775492204707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 159.14285714285714, 79, 479, 80.0, 479.0, 479.0, 479.0, 0.038346709030649975, 1.6196027862992688, 0.02211034436714235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 3.3899066091954024, 7.105334051724139], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 897.0, 620, 1771, 849.0, 1253.2, 1379.0, 1771.0, 0.2556145511946617, 305.8038692251292, 0.5047388891753964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b38c07e-b83f-4721-affe-11bde25aa863", 1, 0, 0.0, 1440.0, 1440, 1440, 1440.0, 1440.0, 1440.0, 1440.0, 0.6944444444444444, 0.1254611545138889, 0.4787868923611111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1150.8636363636363, 105, 2337, 1084.0, 2124.4999999999995, 2326.95, 2337.0, 0.09137464851910769, 0.029041303417827194, 0.041225671499831786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 98.88888888888889, 78, 241, 81.0, 241.0, 241.0, 241.0, 0.05502837018196048, 0.014831865400606535, 0.03240440158175993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 81.44444444444444, 79, 88, 81.0, 88.0, 88.0, 88.0, 0.055029043106083766, 0.01483204677468664, 0.03235105854478752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b39a1bf-0ea1-44dc-8556-75eae9cb5325", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 1.0898837457337884, 2.0364494453924915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 182.5625, 79, 1007, 80.5, 527.5000000000005, 1007.0, 1007.0, 0.09915900766623079, 5.6015216356433255, 0.057762058664947914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 140.6875, 78, 477, 81.5, 371.3000000000001, 477.0, 477.0, 0.0991571641051066, 1.8472742431519582, 0.05785781792265741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 99.77777777777777, 79, 242, 82.0, 242.0, 242.0, 242.0, 0.05502803372607045, 0.014724298086858694, 0.031383175484399554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 112.6875, 81, 241, 83.5, 240.3, 241.0, 241.0, 0.09906261995864135, 0.07361977909035748, 0.049724791658927396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 99.33333333333333, 80, 242, 82.0, 242.0, 242.0, 242.0, 0.055027697274294726, 0.04089460705638505, 0.02762132460838622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 110.5, 78, 244, 81.0, 239.8, 244.0, 244.0, 0.0991583931382392, 0.03584082056669022, 0.05603078635704458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 123.0, 82, 270, 86.0, 270.0, 270.0, 270.0, 0.05188904968088234, 0.04084235746366325, 0.018444935628751144], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 653.6153846153846, 81, 1425, 510.0, 1293.3999999999999, 1425.0, 1425.0, 0.0826504078479741, 0.015484534042431448, 0.056250953658552094], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1832.2857142857142, 1160, 2963, 1696.0, 2687.2, 2936.2, 2963.0, 0.10061277973946081, 0.052074973888588116, 0.0462779484934434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 200.55555555555554, 164, 484, 165.0, 484.0, 484.0, 484.0, 0.05500012222249383, 0.08523944723349386, 0.12369656394375321], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/456f72e2-5f73-4901-83b8-9466226949cb", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["addBook", 58, 2, 3.4482758620689653, 989.6379310344827, 506, 2717, 800.5, 1549.5, 1751.1499999999994, 2717.0, 0.2740528638524273, 97.14214247913891, 0.9949412809254482], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8937a4f2-f77d-4f18-8c68-76334bf9b17e", 3, 0, 0.0, 365.6666666666667, 199, 612, 286.0, 612.0, 612.0, 612.0, 0.08530482256596907, 0.03859821073134668, 0.05470393895018198], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 142.4912280701754, 80, 600, 84.0, 328.0, 330.1, 600.0, 0.2564967937900776, 0.19061919929125887, 0.12399014934188322], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 493.12280701754383, 387, 724, 471.0, 643.6, 709.8, 724.0, 0.25669431759842204, 75.47665242745008, 0.12909919293280012], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 120.78947368421049, 78, 368, 85.0, 242.0, 338.29999999999995, 368.0, 0.25713435044254174, 0.45500726855652895, 0.12505166652381425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8352530-2f12-49d1-9bba-858a6a7ea284", 3, 0, 0.0, 644.0, 175, 1008, 749.0, 1008.0, 1008.0, 1008.0, 0.018111785942839204, 0.024968559071589853, 0.0116146543969379], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 752.9298245614035, 539, 1146, 743.0, 977.8000000000001, 1051.9999999999995, 1146.0, 0.25634798564451283, 230.66236809462612, 0.12867467248171832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 87.99999999999999, 83, 115, 85.5, 95.9, 114.04999999999998, 115.0, 0.10092294028894237, 0.07539653254007903, 0.03587495143083499], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 2, 1.1560693641618498, 177.21965317919083, 79, 2206, 91.0, 292.79999999999995, 462.7999999999994, 1280.9999999999886, 0.7202241437450823, 1.5686886131209852, 0.34602486620691664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 91.0, 82, 124, 85.0, 124.0, 124.0, 124.0, 0.038370040672243116, 0.02971429907528202, 0.013639350395211419], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 85.86666666666666, 82, 94, 85.0, 91.6, 94.0, 94.0, 0.11040208439135331, 0.08959387903243614, 0.03924449093598888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f36979bd-1086-4a12-90b6-2dd4baee16d8", 3, 0, 0.0, 283.6666666666667, 207, 411, 233.0, 411.0, 411.0, 411.0, 0.02396568114460093, 0.02874789551362449, 0.015368617140255154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 358.85714285714283, 165, 1036, 173.0, 1036.0, 1036.0, 1036.0, 0.038328441894082084, 6.60150731731022, 0.08480060825868413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eba1441b-6098-40e1-bdca-acbee841793b", 3, 0, 0.0, 289.3333333333333, 219, 423, 226.0, 423.0, 423.0, 423.0, 0.018921117859643146, 0.02608428845559529, 0.012133659564940431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 316.81250000000006, 163, 1093, 169.5, 725.5000000000003, 1093.0, 1093.0, 0.09901173907931458, 7.547137178057142, 0.22109640417210713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce38e4fe-5cf0-45f7-bfc8-3638114344c3", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.2876816281847134, 1.0978552945859872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a72f4cee-aedd-439e-acbf-507a68860c3e", 1, 0, 0.0, 1358.0, 1358, 1358, 1358.0, 1358.0, 1358.0, 1358.0, 0.7363770250368188, 0.1330368648748159, 0.5076974410898379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0920c7a3-8195-4522-99b2-6bb10d81804c", 3, 0, 0.0, 552.0, 335, 833, 488.0, 833.0, 833.0, 833.0, 0.019320560296248592, 0.026634952101110932, 0.012389812429560457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3938945-237d-4e77-b04f-4d525d6893ad", 1, 0, 0.0, 2595.0, 2595, 2595, 2595.0, 2595.0, 2595.0, 2595.0, 0.3853564547206166, 0.12305816473988439, 0.22993436897880537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 98.7142857142857, 81, 254, 84.0, 175.0, 254.0, 254.0, 0.06926201324883367, 0.0574252434065037, 0.024620481272046347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=218fa131-114a-4364-ad57-456e8fa36e0c", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b669efb5-a045-404b-b828-c66ecfc3369e", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 86.5, 80, 105, 84.0, 96.9, 105.0, 105.0, 0.09765519037336834, 0.07581628549494905, 0.03471336845303328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 105.44999999999997, 79, 246, 82.0, 245.20000000000002, 246.0, 246.0, 0.10063551326627654, 0.07478869687073872, 0.050514310369986465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 142.6, 78, 245, 82.0, 237.0, 244.6, 245.0, 0.10056062548709054, 0.04201155818689192, 0.05650642959499208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 222.29999999999998, 78, 874, 159.5, 805.4000000000013, 873.7, 874.0, 0.10055607509527688, 9.07244601709956, 0.05825182006495922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 183.05, 78, 627, 81.0, 589.1000000000008, 627.0, 627.0, 0.10063855160996524, 2.9835202799261316, 0.05839787828773568], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 40.0, 0.3084040092521203], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 10.0, 0.07710100231303008], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 10.0, 0.07710100231303008], "isController": false}, {"data": ["401/Unauthorized", 4, 40.0, 0.3084040092521203], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1297, 10, "406/Not Acceptable", 4, "401/Unauthorized", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
