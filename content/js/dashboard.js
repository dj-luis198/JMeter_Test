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

    var data = {"OkPercent": 98.16933638443936, "KoPercent": 1.8306636155606408};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8011811023622047, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab3efd9a-4bef-46c1-a9ff-3c77d7277437"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/63f9e305-0bae-447d-8d4f-677f41f5bf5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd097d0f-843a-4aa5-9b11-d8c08016d761"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/06ab9487-b19d-44a7-80b4-7be0a0ddf77b"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=533b4d10-d440-477a-ac0b-a51e2f164d27"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01f47fa4-22d7-460f-81ac-5111cec56ef7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb0774fb-29c5-4d1b-9c89-484cc6d73efe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ac16430-6742-4b5a-8854-4466357c3375"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e669b9c4-114d-439f-9e55-cb064327f293"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82d203d7-b2fe-45dc-abfa-83b6aa3b55b7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ac16430-6742-4b5a-8854-4466357c3375"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52a725a5-2a89-4df1-a795-aa97515ffb84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/598b0990-1648-4c40-bef3-80121a1af508"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e669b9c4-114d-439f-9e55-cb064327f293"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb0774fb-29c5-4d1b-9c89-484cc6d73efe"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab3efd9a-4bef-46c1-a9ff-3c77d7277437"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4cee974-43ea-4337-bbd9-3dca2aacc5b5"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/6b371fe6-afd9-45f0-b648-826d110318af"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82d203d7-b2fe-45dc-abfa-83b6aa3b55b7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06ab9487-b19d-44a7-80b4-7be0a0ddf77b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd097d0f-843a-4aa5-9b11-d8c08016d761"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e13d5d7d-0bb5-40b3-ac02-159db71d0e8b"], "isController": false}, {"data": [0.30327868852459017, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/01f47fa4-22d7-460f-81ac-5111cec56ef7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6727272727272727, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.903954802259887, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/52a725a5-2a89-4df1-a795-aa97515ffb84"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4cee974-43ea-4337-bbd9-3dca2aacc5b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=598b0990-1648-4c40-bef3-80121a1af508"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/533b4d10-d440-477a-ac0b-a51e2f164d27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1311, 24, 1.8306636155606408, 319.03585049580494, 83, 2924, 97.0, 916.8, 1085.3999999999999, 1536.0799999999952, 5.147191620010836, 717.2924602820159, 3.765245757787532], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1464.2909090909095, 1043, 1960, 1450.0, 1733.8, 1839.3999999999999, 1960.0, 0.23811276154522196, 286.5299560059615, 1.1707985882619067], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab3efd9a-4bef-46c1-a9ff-3c77d7277437", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63f9e305-0bae-447d-8d4f-677f41f5bf5b", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.1486904226618704, 2.146329811151079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd097d0f-843a-4aa5-9b11-d8c08016d761", 3, 0, 0.0, 348.0, 188, 459, 397.0, 459.0, 459.0, 459.0, 0.02710320901994796, 0.02718261295262359, 0.017380638596776524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06ab9487-b19d-44a7-80b4-7be0a0ddf77b", 3, 0, 0.0, 553.3333333333334, 230, 844, 586.0, 844.0, 844.0, 844.0, 0.019880452214019694, 0.027406808309366346, 0.01274885770234987], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 512.6923076923077, 86, 929, 460.0, 895.4, 929.0, 929.0, 0.07803402283395561, 0.014783789482214246, 0.05275151528566455], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 512.6923076923077, 86, 929, 460.0, 895.4, 929.0, 929.0, 0.07769868450150316, 0.014720258587198843, 0.05252482435614687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 135.76470588235293, 84, 262, 86.0, 256.4, 262.0, 262.0, 0.09911785112498761, 0.026521768758053326, 0.05652814946971949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 107.23529411764706, 83, 260, 86.0, 256.8, 260.0, 260.0, 0.0992075070904189, 0.07372745399981326, 0.049797518207495416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 106.47058823529413, 84, 260, 86.0, 256.0, 260.0, 260.0, 0.09911727322550928, 0.02671520254906305, 0.058366909916974706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 125.7058823529412, 83, 259, 86.0, 255.0, 259.0, 259.0, 0.0992150339957396, 0.026741552131664185, 0.058327588345151594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=533b4d10-d440-477a-ac0b-a51e2f164d27", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 233.35714285714286, 85, 397, 224.5, 365.5, 397.0, 397.0, 0.07852243217624921, 0.1669478050175834, 0.050758048198751494], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01f47fa4-22d7-460f-81ac-5111cec56ef7", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 94.80952380952381, 84, 252, 86.0, 94.0, 236.29999999999978, 252.0, 0.12203838979061699, 0.09069454553775345, 0.06125755112536829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 102.04761904761905, 83, 254, 85.0, 221.80000000000013, 253.9, 254.0, 0.12204122668867283, 0.0413841436483353, 0.06911356299361317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 657.6666666666666, 505, 756, 671.0, 756.0, 756.0, 756.0, 0.04913361066526909, 14.446912925005732, 0.028021512332536278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb0774fb-29c5-4d1b-9c89-484cc6d73efe", 3, 0, 0.0, 371.3333333333333, 277, 449, 388.0, 449.0, 449.0, 449.0, 0.04347637059258293, 0.027951117161572687, 0.027880354839644652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 932.6666666666667, 833, 999, 926.0, 999.0, 999.0, 999.0, 0.04903563255966002, 44.12234837262994, 0.02791774783425956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 142.0, 84, 253, 89.0, 253.0, 253.0, 253.0, 0.049368900883703326, 0.08735981289186565, 0.027336100391659946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 87.2, 86, 93, 87.0, 92.4, 93.0, 93.0, 0.05310223241785085, 0.039463670771469235, 0.026654831506616537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 119.7, 84, 254, 86.5, 253.8, 254.0, 254.0, 0.053103360380644886, 0.02218517340902332, 0.029839524963889714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 176.8, 84, 828, 86.0, 770.2000000000002, 828.0, 828.0, 0.05310307838545401, 4.791105972835121, 0.03076244736157355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 178.39999999999998, 84, 667, 86.5, 626.3000000000002, 667.0, 667.0, 0.05310307838545401, 1.574288468533771, 0.030814305836559346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ac16430-6742-4b5a-8854-4466357c3375", 3, 0, 0.0, 346.3333333333333, 235, 439, 365.0, 439.0, 439.0, 439.0, 0.02067439889185222, 0.02850132789941216, 0.013257996685204712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e669b9c4-114d-439f-9e55-cb064327f293", 3, 0, 0.0, 334.6666666666667, 259, 450, 295.0, 450.0, 450.0, 450.0, 0.022556730176393633, 0.026661291429194427, 0.01446509064046076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 86.5, 86, 87, 86.5, 87.0, 87.0, 87.0, 0.049370932040912044, 0.03669070242493561, 0.027722935472191824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 675.2, 84, 1101, 960.0, 1084.2, 1101.0, 1101.0, 0.0777262481540016, 46.63245969570173, 0.04124146630567142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 165.2380952380952, 83, 920, 86.0, 254.8, 853.4999999999991, 920.0, 0.12203909900276622, 5.260422039171646, 0.07124622623143262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 470.1333333333334, 85, 764, 586.0, 763.4, 764.0, 764.0, 0.07772584539811178, 15.242969373426053, 0.04131715674971242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 147.90476190476193, 84, 671, 86.0, 258.0, 629.7999999999994, 671.0, 0.12203980822315852, 1.7400774553247131, 0.07136581977335464], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 444.6153846153846, 86, 723, 462.0, 673.4, 723.0, 723.0, 0.07766943886817704, 0.014714717910572602, 0.053123515692213935], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82d203d7-b2fe-45dc-abfa-83b6aa3b55b7", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ac16430-6742-4b5a-8854-4466357c3375", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.32788396098003625, 1.2512760889292196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 299.9, 173, 915, 179.0, 858.8000000000002, 915.0, 915.0, 0.05307799280262417, 6.424007698631119, 0.1180155996220847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 627.6190476190476, 102, 1311, 727.0, 1129.4, 1296.1, 1311.0, 0.10098290022889458, 0.062029535394506535, 0.04565926055271308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 98.93333333333334, 85, 255, 86.0, 162.60000000000005, 255.0, 255.0, 0.0777238316812701, 0.057761558505318895, 0.039013720199387536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 154.66666666666666, 85, 278, 87.0, 265.40000000000003, 278.0, 278.0, 0.0777250398988538, 0.09862376481957427, 0.03997576921881153], "isController": false}, {"data": ["login", 21, 0, 0.0, 2706.2857142857147, 1614, 4854, 2665.0, 3551.4, 4725.0999999999985, 4854.0, 0.10331645831180908, 35.45547568004369, 0.20483122057325875], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52a725a5-2a89-4df1-a795-aa97515ffb84", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 108.0952380952381, 85, 279, 91.0, 226.2000000000001, 276.4, 279.0, 0.12983881438614062, 0.10511364953721737, 0.04615364105132343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 787.1333333333333, 173, 1187, 1050.0, 1170.8, 1187.0, 1187.0, 0.07768840733585734, 62.00169664198333, 0.16147151068992485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 274.7058823529411, 171, 515, 187.0, 508.6, 515.0, 515.0, 0.09906009451498429, 0.1535237988235157, 0.22278847428516488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 786.1250000000001, 85, 1086, 1003.5, 1086.0, 1086.0, 1086.0, 0.06194203773818649, 55.582302337150516, 0.11501468945746518], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1128.086956521739, 215, 2668, 1069.0, 1751.0000000000005, 2512.5999999999976, 2668.0, 0.08895420792079207, 0.02788883624690594, 0.04013363677676361], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/598b0990-1648-4c40-bef3-80121a1af508", 3, 0, 0.0, 298.6666666666667, 213, 408, 275.0, 408.0, 408.0, 408.0, 0.03254396146794963, 0.02713056162741503, 0.020869662790319255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e669b9c4-114d-439f-9e55-cb064327f293", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 104.6, 86, 256, 93.0, 173.80000000000004, 256.0, 256.0, 0.07116154619807578, 0.055247489479951416, 0.025295705875097253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 287.90476190476187, 171, 1006, 183.0, 474.8000000000001, 956.0999999999992, 1006.0, 0.12197601138442773, 7.12888072488601, 0.2728407795574013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb0774fb-29c5-4d1b-9c89-484cc6d73efe", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 351.12499999999994, 171, 1074, 339.0, 677.8000000000004, 1074.0, 1074.0, 0.104875394921409, 7.994092412019375, 0.23419013663297542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 100.61538461538463, 84, 256, 87.0, 193.19999999999993, 256.0, 256.0, 0.06068839311140055, 0.045101432771265444, 0.030462728573495978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 137.92307692307693, 84, 259, 86.0, 257.0, 259.0, 259.0, 0.06068924306508688, 0.023250836811293803, 0.034219761001092405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 175.07692307692307, 83, 922, 86.0, 654.7999999999997, 922.0, 922.0, 0.06068867642665073, 4.215697512756293, 0.035277116751008364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 117.3076923076923, 84, 503, 85.0, 336.59999999999985, 503.0, 503.0, 0.06068895974454616, 1.3877584678605275, 0.03533654800029878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 3.429324127906977, 7.18795421511628], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1001.7454545454545, 677, 1602, 920.0, 1351.0, 1395.1999999999996, 1602.0, 0.24475337759661084, 292.81012964697663, 0.4832923139651827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1128.086956521739, 215, 2668, 1069.0, 1751.0000000000005, 2512.5999999999976, 2668.0, 0.09039388151327218, 0.02834020130324396, 0.04078317701087084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 142.11111111111111, 84, 259, 85.0, 259.0, 259.0, 259.0, 0.052368816115630344, 0.014115032468665991, 0.030838277458715917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab3efd9a-4bef-46c1-a9ff-3c77d7277437", 3, 0, 0.0, 291.6666666666667, 194, 461, 220.0, 461.0, 461.0, 461.0, 0.02783215355926857, 0.0277506140468879, 0.017848093265546577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 142.66666666666663, 84, 256, 89.0, 256.0, 256.0, 256.0, 0.05236851139596996, 0.014114950337195025, 0.030786956894896397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4cee974-43ea-4337-bbd9-3dca2aacc5b5", 3, 0, 0.0, 584.0, 229, 1221, 302.0, 1221.0, 1221.0, 1221.0, 0.038633407595327934, 0.03182980293742676, 0.02477467869882683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 150.20000000000002, 84, 840, 86.0, 489.6000000000002, 840.0, 840.0, 0.07152564194263644, 4.308586392544644, 0.04163947202155306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 126.06666666666668, 84, 669, 86.0, 332.4000000000002, 669.0, 669.0, 0.07152495982681424, 1.420040533790775, 0.04170892351359212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 95.86666666666667, 83, 177, 87.0, 147.00000000000003, 177.0, 177.0, 0.07152359563419972, 0.05315376589611913, 0.035901492339822906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 123.22222222222223, 84, 257, 86.0, 257.0, 257.0, 257.0, 0.052367901967287515, 0.014012505018590606, 0.029866069090718664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 87.6, 83, 111, 86.0, 101.4, 111.0, 111.0, 0.07152495982681424, 0.026300323769651482, 0.04039111338136631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 124.22222222222223, 84, 256, 87.0, 256.0, 256.0, 256.0, 0.05236820667985569, 0.03891816922204119, 0.02628638499359944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 96.55555555555556, 87, 152, 90.0, 152.0, 152.0, 152.0, 0.051899522524392776, 0.04085060073697322, 0.018448658397342745], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 495.38461538461536, 86, 1221, 451.0, 966.9999999999998, 1221.0, 1221.0, 0.07818655311573414, 0.014648231931388292, 0.0532129034877217], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1486.428571428571, 961, 2924, 1368.0, 2329.4000000000005, 2877.899999999999, 2924.0, 0.10240006241527613, 0.05300003230478159, 0.047100028708588926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 287.6666666666667, 171, 514, 178.0, 514.0, 514.0, 514.0, 0.05234140554121014, 0.08111895565810594, 0.11771704781387396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b371fe6-afd9-45f0-b648-826d110318af", 2, 0, 0.0, 423.5, 334, 513, 423.5, 513.0, 513.0, 513.0, 0.03603214066947717, 0.03180962418477282, 0.022396931187619356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82d203d7-b2fe-45dc-abfa-83b6aa3b55b7", 3, 0, 0.0, 325.0, 189, 528, 258.0, 528.0, 528.0, 528.0, 0.02368078304455934, 0.027989883865493153, 0.015185918814382129], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06ab9487-b19d-44a7-80b4-7be0a0ddf77b", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd097d0f-843a-4aa5-9b11-d8c08016d761", 1, 0, 0.0, 723.0, 723, 723, 723.0, 723.0, 723.0, 723.0, 1.3831258644536653, 0.2498811376210235, 0.953600449515906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e13d5d7d-0bb5-40b3-ac02-159db71d0e8b", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["addBook", 61, 13, 21.311475409836067, 929.8524590163937, 437, 2007, 718.0, 1673.6, 1775.0, 2007.0, 0.2815770159298735, 83.92998804595938, 1.0238856863670565], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/01f47fa4-22d7-460f-81ac-5111cec56ef7", 3, 0, 0.0, 651.3333333333334, 188, 1320, 446.0, 1320.0, 1320.0, 1320.0, 0.04194572223542736, 0.026967057752268563, 0.02689878671998434], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 153.50909090909093, 85, 356, 88.0, 346.8, 352.2, 356.0, 0.24561466185559644, 0.18253198991416883, 0.11872974376808618], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 539.3818181818181, 415, 772, 503.0, 711.8, 758.4, 772.0, 0.24530136387558316, 72.12674575126887, 0.12336933827727083], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 112.85454545454544, 83, 327, 89.0, 254.8, 263.4, 327.0, 0.24575623662304122, 0.4348733405868659, 0.11951816976393996], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 846.690909090909, 588, 1254, 832.0, 1063.8, 1104.0, 1254.0, 0.24517233386231121, 220.60649697630075, 0.12306501914573044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 104.4375, 86, 259, 91.0, 172.2000000000001, 259.0, 259.0, 0.10664960273022983, 0.07967475203967365, 0.03791060097051138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 13, 7.344632768361582, 166.90395480225996, 85, 1653, 94.0, 305.6, 434.89999999999986, 1167.8399999999992, 0.7545561121176596, 1.592411975114569, 0.36388948097623364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 92.15384615384616, 87, 105, 90.0, 101.0, 105.0, 105.0, 0.06044599847490096, 0.04681023124081685, 0.02148666352037495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 91.11764705882352, 86, 103, 89.0, 98.19999999999999, 103.0, 103.0, 0.10152526784754488, 0.08239013435674784, 0.03608906005518197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 290.38461538461536, 170, 1010, 175.0, 809.9999999999998, 1010.0, 1010.0, 0.06066347172382255, 5.6694462008334225, 0.13523962217156563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 247.06666666666666, 171, 924, 177.0, 574.8000000000002, 924.0, 924.0, 0.07149393731411577, 5.805521819353886, 0.1595720477174369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52a725a5-2a89-4df1-a795-aa97515ffb84", 3, 0, 0.0, 432.6666666666667, 201, 646, 451.0, 646.0, 646.0, 646.0, 0.03579354284487079, 0.029839603914620472, 0.02295354147278498], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4cee974-43ea-4337-bbd9-3dca2aacc5b5", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 92.80000000000001, 87, 112, 89.5, 110.4, 112.0, 112.0, 0.055957203930434005, 0.04639420521185397, 0.019891037334646464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=598b0990-1648-4c40-bef3-80121a1af508", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/533b4d10-d440-477a-ac0b-a51e2f164d27", 3, 0, 0.0, 311.6666666666667, 174, 456, 305.0, 456.0, 456.0, 456.0, 0.06931768294091822, 0.03136444638277224, 0.04445176933385706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 90.33333333333331, 86, 99, 90.0, 94.8, 99.0, 99.0, 0.07907805531246376, 0.061393607395906914, 0.028109777474352348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 107.25, 84, 256, 88.0, 223.80000000000004, 256.0, 256.0, 0.10493592350171177, 0.07798460721172135, 0.05267291472644517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 128.3125, 83, 257, 86.5, 254.9, 257.0, 257.0, 0.10493661172797808, 0.03792935880450965, 0.05929584664170049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 221.68750000000003, 83, 989, 172.5, 534.7000000000005, 989.0, 989.0, 0.10493661172797808, 5.927900195854347, 0.06112762587474503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 185.9375, 84, 671, 94.0, 379.8000000000003, 671.0, 671.0, 0.10493867646094313, 1.954982435069194, 0.0612313077982554], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 29.166666666666668, 0.5339435545385202], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.166666666666667, 0.07627765064836003], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.166666666666667, 0.07627765064836003], "isController": false}, {"data": ["401/Unauthorized", 15, 62.5, 1.1441647597254005], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1311, 24, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
