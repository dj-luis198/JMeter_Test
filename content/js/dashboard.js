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

    var data = {"OkPercent": 98.31932773109244, "KoPercent": 1.680672268907563};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7776315789473685, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a895c78d-f15a-49ee-b486-4574c41bf3ae"], "isController": false}, {"data": [0.1, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=553e2a84-a30c-460c-9fd9-a0b054c2a714"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35eb9560-fe56-474f-9006-6ef80882d715"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68b8ea9f-a64b-446b-81f9-e8e38b803b0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=665eb8ff-5d32-49ea-9bb8-5eb2240d1c4d"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=994bfdf4-8218-4373-8e4d-15cd027430db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49f690b7-b6b4-4782-a8ed-0a9baffdd747"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2849d00-2719-49a0-bcf8-3b65b7f38ba9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2849d00-2719-49a0-bcf8-3b65b7f38ba9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/32513be0-8166-4621-aa8f-03faebb7827c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a6ebea6-d4bc-4ee2-8532-6708f1641920"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=480619cd-07d6-4fd9-b15f-98ae3f625b94"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fb85a3f-210e-43ce-8435-640dee3b1efe"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/74612161-a51e-40ed-a4c5-36a067038290"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/68b8ea9f-a64b-446b-81f9-e8e38b803b0e"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/480619cd-07d6-4fd9-b15f-98ae3f625b94"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35eb9560-fe56-474f-9006-6ef80882d715"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/665eb8ff-5d32-49ea-9bb8-5eb2240d1c4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/553e2a84-a30c-460c-9fd9-a0b054c2a714"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.28688524590163933, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d95bb3b8-99a2-463a-b17c-b98c158a30d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a895c78d-f15a-49ee-b486-4574c41bf3ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9180790960451978, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/994bfdf4-8218-4373-8e4d-15cd027430db"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/49f690b7-b6b4-4782-a8ed-0a9baffdd747"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a6ebea6-d4bc-4ee2-8532-6708f1641920"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c28efc3-9b8b-4bfb-882a-6dd619b55c72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74612161-a51e-40ed-a4c5-36a067038290"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fb85a3f-210e-43ce-8435-640dee3b1efe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 22, 1.680672268907563, 371.74637127578296, 95, 3429, 114.0, 1047.0, 1279.0, 1792.3000000000015, 5.143115337013535, 717.8163423263364, 3.7637032996581734], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a895c78d-f15a-49ee-b486-4574c41bf3ae", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1708.5999999999997, 1209, 2230, 1721.0, 2069.4, 2118.4, 2230.0, 0.2441948230697509, 293.8493342222395, 1.20070403726191], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=553e2a84-a30c-460c-9fd9-a0b054c2a714", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 581.3846153846152, 103, 1582, 521.0, 1258.7999999999997, 1582.0, 1582.0, 0.06641972154809044, 0.012583423808915572, 0.04490017083918764], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 581.3846153846152, 103, 1582, 521.0, 1258.7999999999997, 1582.0, 1582.0, 0.06718624025799516, 0.01272864317387799, 0.04541834255421413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 151.4375, 98, 307, 103.0, 305.6, 307.0, 307.0, 0.08348987685243164, 0.030177432294927992, 0.04717708007201002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 128.75, 100, 308, 104.5, 300.3, 308.0, 308.0, 0.08348900554158276, 0.062046028532367646, 0.041907567234739776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 171.25, 98, 814, 101.5, 461.2000000000004, 814.0, 814.0, 0.08349031251467603, 1.5554045464388773, 0.0487162712182802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 224.8125, 97, 1082, 103.0, 538.1000000000006, 1082.0, 1082.0, 0.08349031251467603, 4.716392417840314, 0.04863473770996509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35eb9560-fe56-474f-9006-6ef80882d715", 1, 0, 0.0, 801.0, 801, 801, 801.0, 801.0, 801.0, 801.0, 1.2484394506866416, 0.2255481429463171, 0.8607404806491885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68b8ea9f-a64b-446b-81f9-e8e38b803b0e", 1, 0, 0.0, 650.0, 650, 650, 650.0, 650.0, 650.0, 650.0, 1.5384615384615385, 0.2779447115384615, 1.0606971153846154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=665eb8ff-5d32-49ea-9bb8-5eb2240d1c4d", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 454.0714285714286, 99, 3429, 213.5, 1885.0, 3429.0, 3429.0, 0.06841884059387554, 0.14253606955752557, 0.04422693887998358], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=994bfdf4-8218-4373-8e4d-15cd027430db", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 114.58823529411765, 99, 303, 103.0, 146.19999999999987, 303.0, 303.0, 0.09488989980742932, 0.07051876343110715, 0.04763028173927605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 128.0588235294118, 97, 359, 101.0, 309.4, 359.0, 359.0, 0.09488989980742932, 0.03377400156289247, 0.05364811545868103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 751.5, 609, 814, 786.5, 814.0, 814.0, 814.0, 0.06945971915120222, 20.423463710190898, 0.039613746078420026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1053.5, 884, 1207, 1095.5, 1207.0, 1207.0, 1207.0, 0.06919776721871108, 62.26427258009642, 0.03939677567237164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 133.5, 102, 285, 103.5, 285.0, 285.0, 285.0, 0.07001085168201071, 0.12388638989043303, 0.038765774320019604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49f690b7-b6b4-4782-a8ed-0a9baffdd747", 1, 0, 0.0, 834.0, 834, 834, 834.0, 834.0, 834.0, 834.0, 1.199040767386091, 0.21662357613908872, 0.8266824040767387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 116.66666666666667, 96, 305, 104.0, 193.40000000000006, 305.0, 305.0, 0.07463911985549868, 0.055469111533236796, 0.0374653394587171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 154.33333333333331, 96, 306, 104.0, 300.0, 306.0, 306.0, 0.07463763428554368, 0.027444880107080124, 0.0421488827990108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 188.0, 98, 908, 102.0, 603.2000000000002, 908.0, 908.0, 0.07463911985549868, 4.496137153425686, 0.04345201886379355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 162.4, 95, 811, 103.0, 509.8000000000002, 811.0, 811.0, 0.07464097690110567, 1.4819052389257672, 0.04352599154317732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2849d00-2719-49a0-bcf8-3b65b7f38ba9", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 142.16666666666669, 99, 314, 104.0, 314.0, 314.0, 314.0, 0.0700100347716506, 0.05202894185666612, 0.039312275384471775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 975.1666666666667, 99, 1332, 1138.5, 1324.8, 1332.0, 1332.0, 0.06877500257906259, 51.57297968056877, 0.035506886097133226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 160.64705882352942, 97, 697, 101.0, 384.9999999999997, 697.0, 697.0, 0.09478303049225846, 5.040864074513401, 0.05524291287766856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 652.5833333333334, 100, 827, 794.5, 826.1, 827.0, 827.0, 0.06877539674806998, 16.85496468813223, 0.035574253070534904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 173.4705882352941, 100, 514, 104.0, 347.59999999999985, 514.0, 514.0, 0.09478514438007728, 1.6634553262281644, 0.055336708544044426], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 578.8461538461539, 102, 936, 577.0, 897.5999999999999, 936.0, 936.0, 0.0674448767833982, 0.012777642671854734, 0.04613022859922179], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 320.93333333333334, 200, 1012, 208.0, 773.8000000000002, 1012.0, 1012.0, 0.07459828821794635, 6.057604409629147, 0.1665008538395739], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2849d00-2719-49a0-bcf8-3b65b7f38ba9", 3, 0, 0.0, 468.3333333333333, 206, 728, 471.0, 728.0, 728.0, 728.0, 0.030647896532701308, 0.030737685292074456, 0.01965376177390025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 707.8095238095237, 180, 2184, 597.0, 1286.2, 2095.8999999999987, 2184.0, 0.09355370428119571, 0.05746609374303916, 0.0423001612130797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 102.91666666666667, 98, 110, 103.0, 108.2, 110.0, 110.0, 0.06877382009914892, 0.051110231538527666, 0.03452123391695561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 168.99999999999997, 100, 313, 104.5, 309.7, 313.0, 313.0, 0.06877539674806998, 0.10448397676537848, 0.03441008619849726], "isController": false}, {"data": ["login", 21, 0, 0.0, 3185.52380952381, 1922, 5470, 3224.0, 4272.2, 5354.699999999999, 5470.0, 0.09511343409318399, 32.64041474552627, 0.18856822152598182], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 107.47058823529413, 102, 124, 106.0, 115.19999999999999, 124.0, 124.0, 0.09212644083043858, 0.07458283149261091, 0.03274807076394496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32513be0-8166-4621-aa8f-03faebb7827c", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.1528373194945847, 2.1540782942238264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a6ebea6-d4bc-4ee2-8532-6708f1641920", 3, 0, 0.0, 318.6666666666667, 198, 424, 334.0, 424.0, 424.0, 424.0, 0.03254678600488202, 0.02681507662055872, 0.020871474098182807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 1079.4999999999998, 205, 1436, 1244.0, 1429.1, 1436.0, 1436.0, 0.06873363996173827, 68.54219484769771, 0.13992844541689817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=480619cd-07d6-4fd9-b15f-98ae3f625b94", 1, 0, 0.0, 936.0, 936, 936, 936.0, 936.0, 936.0, 936.0, 1.0683760683760686, 0.19301716079059827, 0.736595219017094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fb85a3f-210e-43ce-8435-640dee3b1efe", 1, 0, 0.0, 840.0, 840, 840, 840.0, 840.0, 840.0, 840.0, 1.1904761904761907, 0.21507626488095238, 0.8207775297619048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 393.8125, 202, 1187, 404.5, 785.9000000000004, 1187.0, 1187.0, 0.08344372242445736, 6.360470239600826, 0.1863325212781492], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 948.375, 99, 1397, 1130.0, 1397.0, 1397.0, 1397.0, 0.09215315854950928, 82.69157597739944, 0.1711110467158918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74612161-a51e-40ed-a4c5-36a067038290", 3, 0, 0.0, 312.0, 198, 507, 231.0, 507.0, 507.0, 507.0, 0.028600301256506568, 0.02868409120159399, 0.018340687980246725], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1147.9999999999998, 284, 2432, 1124.5, 1918.3999999999999, 2364.0499999999993, 2432.0, 0.09218829879065714, 0.02900526730416272, 0.04159276761844101], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 122.99999999999999, 99, 307, 108.0, 200.80000000000007, 307.0, 307.0, 0.0892692419851099, 0.06930571033023668, 0.03173242586189453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 311.94117647058823, 202, 798, 211.0, 648.3999999999999, 798.0, 798.0, 0.09472915819212187, 6.804587851542692, 0.2116223709175912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68b8ea9f-a64b-446b-81f9-e8e38b803b0e", 3, 0, 0.0, 1223.6666666666667, 260, 2896, 515.0, 2896.0, 2896.0, 2896.0, 0.03220127946417071, 0.026844881740801168, 0.020649909031385513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 409.4166666666667, 206, 1224, 404.0, 981.0000000000009, 1224.0, 1224.0, 0.08536247038989309, 8.631536508906152, 0.1901621308962348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 117.69230769230768, 97, 286, 104.0, 219.19999999999993, 286.0, 286.0, 0.0605637083624505, 0.045008771546703935, 0.03040014267412066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 117.0, 96, 306, 101.0, 225.99999999999994, 306.0, 306.0, 0.06056963411281793, 0.01620710912784386, 0.03454361945496648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 118.23076923076923, 96, 296, 103.0, 222.79999999999995, 296.0, 296.0, 0.060568223114697575, 0.016325028886383333, 0.03560749054203901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 132.69230769230768, 97, 306, 103.0, 302.0, 306.0, 306.0, 0.060570198530473796, 0.016325561322666764, 0.03566780245495674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 9.803921568627452, 2.891390931372549, 6.060431985294118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/480619cd-07d6-4fd9-b15f-98ae3f625b94", 3, 0, 0.0, 438.0, 336, 637, 341.0, 637.0, 637.0, 637.0, 0.020676963794636394, 0.024439471203881756, 0.013259641495909408], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1199.7818181818184, 784, 1794, 1153.0, 1631.4, 1659.6, 1794.0, 0.24798567995419027, 296.67708699675813, 0.4896748485032937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1147.9999999999998, 284, 2432, 1124.5, 1918.3999999999999, 2364.0499999999993, 2432.0, 0.09181318520806118, 0.0288872450619113, 0.04142352692004324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 16, 0, 0.0, 152.25000000000003, 99, 307, 102.0, 306.3, 307.0, 307.0, 0.08010012515644556, 0.021589486858573217, 0.04716833541927409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 16, 0, 0.0, 139.56249999999994, 95, 308, 102.0, 305.2, 308.0, 308.0, 0.0801013281801479, 0.021589811111055485, 0.04709081988715725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 166.79999999999998, 97, 1081, 102.0, 495.4000000000003, 1081.0, 1081.0, 0.09017674642298906, 5.4320980841198745, 0.05249742620536251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35eb9560-fe56-474f-9006-6ef80882d715", 3, 0, 0.0, 315.0, 197, 505, 243.0, 505.0, 505.0, 505.0, 0.055615290497200695, 0.03524836282488599, 0.03566475334618664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 173.73333333333335, 96, 810, 101.0, 501.6000000000002, 810.0, 810.0, 0.09017457798297504, 1.7903058759257924, 0.052584224934473144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 16, 0, 0.0, 121.31250000000001, 98, 415, 102.0, 200.8000000000002, 415.0, 415.0, 0.08010052616033121, 0.021433148601494877, 0.045682331325813896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 116.53333333333332, 100, 309, 103.0, 188.4000000000001, 309.0, 309.0, 0.09017403588926629, 0.06701410284348794, 0.045263139108479365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/665eb8ff-5d32-49ea-9bb8-5eb2240d1c4d", 3, 0, 0.0, 2139.6666666666665, 433, 3429, 2557.0, 3429.0, 3429.0, 3429.0, 0.06803646754660499, 0.030784729781829726, 0.043630156597269466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 16, 0, 0.0, 114.18750000000001, 98, 298, 102.0, 162.90000000000015, 298.0, 298.0, 0.08010012515644556, 0.059527534418022526, 0.04020650813516896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 114.19999999999997, 98, 298, 100.0, 184.60000000000008, 298.0, 298.0, 0.09017457798297504, 0.03315794377915645, 0.05092280530106286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 16, 0, 0.0, 160.0, 105, 324, 109.5, 316.3, 324.0, 324.0, 0.07739938080495357, 0.060921778250773995, 0.027513061145510834], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 535.0833333333334, 309, 1079, 499.5, 946.4000000000005, 1079.0, 1079.0, 0.07189632549863097, 0.013509815720730706, 0.048931394054773016], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1632.2380952380952, 899, 3255, 1414.0, 2730.8, 3208.2999999999993, 3255.0, 0.09634132354627825, 0.04986416160110105, 0.04431324549833696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/553e2a84-a30c-460c-9fd9-a0b054c2a714", 3, 0, 0.0, 556.3333333333334, 204, 1013, 452.0, 1013.0, 1013.0, 1013.0, 0.030923690639398843, 0.025779808505045715, 0.019830621926958242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 16, 0, 0.0, 276.0625, 199, 714, 208.0, 501.2000000000002, 714.0, 714.0, 0.08005844266314409, 0.1240749497132907, 0.18005331391916096], "isController": false}, {"data": ["addBook", 61, 12, 19.672131147540984, 1052.0655737704917, 505, 4217, 836.0, 1841.0000000000002, 2062.7, 4217.0, 0.2842365220632776, 84.72333808274311, 1.0337201420600157], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d95bb3b8-99a2-463a-b17c-b98c158a30d2", 2, 0, 0.0, 229.0, 209, 249, 229.0, 249.0, 249.0, 249.0, 0.01916994153167833, 0.02693900963289562, 0.011915691196204352], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 191.94545454545457, 101, 433, 105.0, 411.4, 426.79999999999995, 433.0, 0.24934038135477965, 0.1853008107529173, 0.12053075075255461], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 657.7636363636364, 472, 929, 609.0, 811.0, 889.9999999999999, 929.0, 0.2493245571089231, 73.30969814445865, 0.1253927215928666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a895c78d-f15a-49ee-b486-4574c41bf3ae", 3, 0, 0.0, 579.0, 228, 1079, 430.0, 1079.0, 1079.0, 1079.0, 0.035418708161650984, 0.029527119662105528, 0.022713168970850406], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 162.19999999999996, 99, 415, 106.0, 303.8, 326.9999999999996, 415.0, 0.24975138384971324, 0.4419428784528129, 0.12146112222378633], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1004.2727272727275, 683, 1385, 994.0, 1226.2, 1284.1999999999998, 1385.0, 0.24850445500713889, 223.60474543966086, 0.12473758776725524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 112.91666666666667, 103, 138, 108.5, 135.0, 138.0, 138.0, 0.08899832386490054, 0.06648800562172745, 0.03163612293635137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 12, 6.779661016949152, 176.81920903954796, 99, 2678, 109.0, 332.80000000000007, 374.59999999999997, 1018.1599999999976, 0.7440632579881706, 1.5701981120971233, 0.3589770233686308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 127.38461538461543, 103, 311, 108.0, 248.19999999999993, 311.0, 311.0, 0.059946785699463705, 0.046423633847338594, 0.02130920897910624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 109.00000000000001, 104, 130, 106.5, 120.9, 130.0, 130.0, 0.08217686515803638, 0.06668845209602367, 0.029211307536645748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 253.61538461538464, 204, 592, 209.0, 514.8, 592.0, 592.0, 0.06053409699424926, 0.09381602727526717, 0.1361426029079649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/994bfdf4-8218-4373-8e4d-15cd027430db", 3, 0, 0.0, 294.6666666666667, 195, 494, 195.0, 494.0, 494.0, 494.0, 0.04595658634476631, 0.029545656911104643, 0.029470857779684126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49f690b7-b6b4-4782-a8ed-0a9baffdd747", 3, 0, 0.0, 474.6666666666667, 239, 595, 590.0, 595.0, 595.0, 595.0, 0.021304397227587774, 0.025181076280394274, 0.013661999524201794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 310.66666666666663, 200, 1185, 206.0, 838.8000000000002, 1185.0, 1185.0, 0.09011877654748959, 7.317914542617169, 0.20114205835791574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a6ebea6-d4bc-4ee2-8532-6708f1641920", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 125.06666666666665, 101, 300, 106.0, 204.00000000000006, 300.0, 300.0, 0.07276890536161294, 0.06033281313672792, 0.02586707182776085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c28efc3-9b8b-4bfb-882a-6dd619b55c72", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 111.83333333333334, 102, 158, 105.5, 147.80000000000004, 158.0, 158.0, 0.06962980155506557, 0.054058293199489384, 0.024751218521527212], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74612161-a51e-40ed-a4c5-36a067038290", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.3131092937608319, 1.1948927642980938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fb85a3f-210e-43ce-8435-640dee3b1efe", 2, 0, 0.0, 305.5, 218, 393, 305.5, 393.0, 393.0, 393.0, 0.01133908981126085, 0.022423493034964083, 0.0070481744774096985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 104.16666666666666, 99, 114, 104.0, 111.9, 114.0, 114.0, 0.08554868789699938, 0.06357671043907864, 0.04294143122954852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 167.83333333333334, 96, 310, 103.0, 308.8, 310.0, 310.0, 0.08543357539513029, 0.03355325804499502, 0.048125912181403954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 254.91666666666669, 99, 1121, 103.5, 877.4000000000009, 1121.0, 1121.0, 0.085426277122843, 6.426665823527109, 0.049609530724984335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 224.66666666666666, 98, 821, 101.5, 663.8000000000006, 821.0, 821.0, 0.08555295728055666, 2.1174217680588034, 0.0497666453972509], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.45836516424751717], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07639419404125286], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07639419404125286], "isController": false}, {"data": ["401/Unauthorized", 14, 63.63636363636363, 1.0695187165775402], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 22, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
