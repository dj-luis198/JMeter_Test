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

    var data = {"OkPercent": 95.35740604274135, "KoPercent": 4.642593957258659};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7303829252981795, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=581a3016-6582-440e-b38f-3f9f1a393548"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5198993b-7abc-490a-a9c5-0a78c9a4c713"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48284496-6792-4f57-b806-2ca3263bbbbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3392857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4722222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/581a3016-6582-440e-b38f-3f9f1a393548"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61a48777-232f-435e-b17f-c92a52e96e0f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/da02e397-b6e6-4ef3-8e99-ac8d21b9bb62"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c601779-4524-4e90-b3e5-634e6230773f"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61a48777-232f-435e-b17f-c92a52e96e0f"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56c7889b-103d-43a8-b4e7-1fb3568197f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.17796610169491525, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da02e397-b6e6-4ef3-8e99-ac8d21b9bb62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56c7889b-103d-43a8-b4e7-1fb3568197f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8505747126436781, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5198993b-7abc-490a-a9c5-0a78c9a4c713"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/b7ab2ec8-611b-4c17-adda-e5bf75545db7"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cd56fde4-1f58-495f-8567-187f0e9edd7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1ab3fbc-da17-480b-986a-7a70c102ea84"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24197a18-2914-4a0e-9aa2-e34ac41aa362"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67e3f492-b19f-47ba-8f3c-2465a931a621"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67e3f492-b19f-47ba-8f3c-2465a931a621"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24197a18-2914-4a0e-9aa2-e34ac41aa362"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd56fde4-1f58-495f-8567-187f0e9edd7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12543f98-91f9-4e68-94f7-51e6fa334042"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.18, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48284496-6792-4f57-b806-2ca3263bbbbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12543f98-91f9-4e68-94f7-51e6fa334042"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1357, 63, 4.642593957258659, 421.15770081061146, 137, 2067, 154.0, 1140.2, 1317.0, 1740.3600000000006, 5.3149614009251245, 743.7621853727425, 3.893536025803217], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=581a3016-6582-440e-b38f-3f9f1a393548", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2127.375, 1674, 2691, 2103.0, 2501.2, 2556.0, 2691.0, 0.25386003245781846, 305.47813428600733, 1.2482277963135897], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 150.1875, 144, 170, 147.5, 161.60000000000002, 170.0, 170.0, 0.07834764810153856, 0.060826543203831206, 0.027850140536093783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 445.9523809523809, 284, 1426, 300.0, 869.6, 1370.499999999999, 1426.0, 0.12975618195524027, 7.58359233079176, 0.2902437736341617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5198993b-7abc-490a-a9c5-0a78c9a4c713", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 395.45000000000005, 285, 849, 299.5, 596.5, 836.4499999999998, 849.0, 0.09139974133873202, 0.1416517475630544, 0.20556016045224593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48284496-6792-4f57-b806-2ca3263bbbbd", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 179.0, 144, 432, 148.0, 432.0, 432.0, 432.0, 0.04533913674283641, 0.03369441705204933, 0.02275812137286906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 254.0, 138, 577, 145.0, 577.0, 577.0, 577.0, 0.04527641249830214, 0.012114977563022251, 0.025821704002937935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 237.66666666666666, 141, 424, 152.0, 424.0, 424.0, 424.0, 0.04527960153950645, 0.012204267602445099, 0.026619453248811414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 7, 7, 100.0, 192.57142857142858, 146, 432, 152.0, 432.0, 432.0, 432.0, 0.033627170753969204, 0.009917388249705762, 0.020787108483654795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 145.33333333333334, 142, 152, 144.0, 152.0, 152.0, 152.0, 0.045341192473362046, 0.012220868283835864, 0.026699940489684878], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1400.9821428571431, 1104, 2067, 1187.0, 1893.0, 1928.7999999999997, 2067.0, 0.24286792321904083, 290.55447072140447, 0.47956927807509825], "isController": false}, {"data": ["deleteBook", 18, 7, 38.888888888888886, 380.8333333333333, 144, 791, 432.0, 618.2000000000003, 791.0, 791.0, 0.08441113851867832, 0.019000749441948586, 0.05580239381782201], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 7, 38.888888888888886, 380.8333333333333, 144, 791, 432.0, 618.2000000000003, 791.0, 791.0, 0.08380044321123298, 0.01886328335955977, 0.055398676243971025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, 42.30769230769231, 910.9230769230767, 207, 2034, 1026.5, 1418.2, 1841.499999999999, 2034.0, 0.10183419043776952, 0.03150189274509727, 0.045944722638915546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/581a3016-6582-440e-b38f-3f9f1a393548", 3, 0, 0.0, 610.6666666666667, 239, 1272, 321.0, 1272.0, 1272.0, 1272.0, 0.04269611749971536, 0.02744948960349539, 0.027379997224752366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 188.0, 145, 425, 148.0, 425.0, 425.0, 425.0, 0.04129817875031711, 0.01113114974129641, 0.024319142369571504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 11, 0, 0.0, 222.54545454545456, 137, 444, 144.0, 441.2, 444.0, 444.0, 0.14317696673087937, 0.05786057817462383, 0.0805624658327693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 250.71428571428572, 144, 572, 150.0, 572.0, 572.0, 572.0, 0.041294037141036834, 0.011130033448170085, 0.02427637730361736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 11, 0, 0.0, 173.1818181818182, 137, 446, 148.0, 386.60000000000025, 446.0, 446.0, 0.14315833311642678, 0.106390128419532, 0.07185877267758141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 11, 0, 0.0, 306.0, 139, 1033, 150.0, 915.0000000000005, 1033.0, 1033.0, 0.14152642684370337, 3.817720596276568, 0.08223459372265966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61a48777-232f-435e-b17f-c92a52e96e0f", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da02e397-b6e6-4ef3-8e99-ac8d21b9bb62", 3, 0, 0.0, 784.0, 326, 1046, 980.0, 1046.0, 1046.0, 1046.0, 0.027016074564365798, 0.02252218976541042, 0.017324761358008013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 11, 0, 0.0, 252.45454545454544, 139, 1331, 145.0, 1094.8000000000009, 1331.0, 1331.0, 0.14098587577862653, 11.567212713241137, 0.0817828224731486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 269.125, 139, 1277, 145.5, 687.6000000000006, 1277.0, 1277.0, 0.08290756842465256, 4.683473032046367, 0.04829527789580591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 241.5, 141, 1126, 145.0, 639.5000000000005, 1126.0, 1126.0, 0.08290585004404373, 1.5445161504482097, 0.04837523964972278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c601779-4524-4e90-b3e5-634e6230773f", 2, 0, 0.0, 291.5, 242, 341, 291.5, 341.0, 341.0, 341.0, 0.03593438381515353, 0.031758415383509715, 0.022336167283540258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 212.85714285714283, 144, 605, 148.0, 605.0, 605.0, 605.0, 0.04136602431140343, 0.011068643223949745, 0.02359156074009727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 164.4375, 143, 429, 145.0, 242.1000000000002, 429.0, 429.0, 0.082904990880451, 0.06161200982424142, 0.04161441925053889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 188.71428571428572, 145, 431, 150.0, 431.0, 431.0, 431.0, 0.041365779863138365, 0.0307415610115706, 0.02076368247036437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 197.87499999999997, 140, 431, 145.0, 429.6, 431.0, 431.0, 0.08290713882282227, 0.029966801520309658, 0.046847796095073765], "isController": false}, {"data": ["deleteAccount", 17, 7, 41.1764705882353, 466.4117647058824, 143, 1272, 445.0, 1200.8, 1272.0, 1272.0, 0.08167383314516323, 0.01767848134713781, 0.05555960087919479], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 192.85714285714286, 147, 445, 152.0, 445.0, 445.0, 445.0, 0.040783747094158024, 0.03210126968544078, 0.014497347599876484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1155.3750000000002, 794, 1697, 1149.0, 1531.5, 1683.5, 1697.0, 0.09930157889510444, 0.051396325014067726, 0.04567484732382245], "isController": false}, {"data": ["goToProfile", 19, 7, 36.8421052631579, 229.36842105263156, 142, 356, 239.0, 346.0, 356.0, 356.0, 0.08903384223203156, 0.11751130934808485, 0.05752695470286127], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/61a48777-232f-435e-b17f-c92a52e96e0f", 3, 0, 0.0, 343.0, 284, 445, 300.0, 445.0, 445.0, 445.0, 0.03457296624526062, 0.028822059425166816, 0.02217081494243601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 446.1428571428571, 292, 1037, 299.0, 1037.0, 1037.0, 1037.0, 0.041257772669672586, 0.06394148947926798, 0.0927896977131406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 173.61904761904765, 138, 447, 145.0, 372.8000000000002, 445.0, 447.0, 0.1298765554263662, 0.0965195885541647, 0.0651919428605002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 11, 0, 0.0, 877.5454545454546, 705, 1035, 971.0, 1034.4, 1035.0, 1035.0, 0.04708420367770435, 13.844319223945314, 0.02685270990994076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 145.2857142857143, 139, 150, 145.0, 149.0, 149.9, 150.0, 0.12987173619958195, 0.04403946709297579, 0.07354808423728185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 11, 0, 0.0, 1265.6363636363635, 1002, 1477, 1292.0, 1447.4, 1477.0, 1477.0, 0.04702603104573068, 42.31410539789366, 0.02677360947232518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56c7889b-103d-43a8-b4e7-1fb3568197f4", 3, 0, 0.0, 354.3333333333333, 250, 467, 346.0, 467.0, 467.0, 467.0, 0.03572661990449083, 0.029039508431482296, 0.022910625394481427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 11, 0, 0.0, 279.54545454545456, 137, 452, 151.0, 451.8, 452.0, 452.0, 0.047264258767519995, 0.08363558289721312, 0.026170737032406095], "isController": false}, {"data": ["addBook", 59, 24, 40.67796610169491, 1190.0338983050847, 727, 3154, 1023.0, 2026.0, 2079.0, 3154.0, 0.2667052409840067, 66.00515915013698, 0.9702718655918596], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da02e397-b6e6-4ef3-8e99-ac8d21b9bb62", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 148.76923076923077, 142, 174, 145.0, 166.0, 174.0, 174.0, 0.060135628972420876, 0.044690638328137, 0.0301852668865472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 143.92307692307693, 141, 149, 143.0, 148.2, 149.0, 149.0, 0.06013813266472066, 0.016091648779427207, 0.034297528785348495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 167.23076923076923, 142, 428, 145.0, 317.5999999999999, 428.0, 428.0, 0.06013507262466463, 0.016208281293366638, 0.03535284542973448], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 280.94642857142856, 138, 604, 150.0, 580.9, 598.15, 604.0, 0.24392474921486723, 0.1812761075708144, 0.11791284263804616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 188.15384615384616, 140, 431, 147.0, 423.4, 431.0, 431.0, 0.06013646351335723, 0.016208656181334567, 0.03541239013530704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56c7889b-103d-43a8-b4e7-1fb3568197f4", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 11, 0, 0.0, 172.27272727272728, 138, 444, 147.0, 385.2000000000002, 444.0, 444.0, 0.047262228027360534, 0.035123589383614616, 0.02653884874583233], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 819.303571428571, 683, 1197, 726.5, 1035.9, 1159.0, 1197.0, 0.2438493359460048, 71.699801328108, 0.1226390703244067], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 212.76785714285714, 138, 445, 149.0, 431.6, 435.75, 445.0, 0.24442514261770598, 0.43251792814773754, 0.11887082131212653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 694.8333333333334, 142, 1330, 753.5, 1288.6000000000001, 1330.0, 1330.0, 0.09408370313455539, 42.34101998004642, 0.05126826791902529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 267.4761904761905, 138, 1281, 148.0, 433.8, 1196.2999999999988, 1281.0, 0.12987334256877103, 5.598112401126188, 0.07581984480135563], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1116.9285714285716, 957, 1450, 1029.0, 1325.1000000000001, 1411.5, 1450.0, 0.24351955331556221, 219.11932213505767, 0.12223540078535056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 588.6111111111111, 143, 1151, 576.0, 1102.4, 1151.0, 1151.0, 0.09408075264602117, 13.844111377891023, 0.051358535868286946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 165.20000000000005, 145, 432, 151.0, 165.5, 418.6999999999998, 432.0, 0.0943716733985127, 0.07050227553697483, 0.033546180778377566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 230.0952380952381, 137, 1034, 148.0, 439.8, 974.8999999999992, 1034.0, 0.12988137501082345, 1.8518846908514033, 0.0759513714081615], "isController": false}, {"data": ["deleteBooks", 17, 7, 41.1764705882353, 346.0, 146, 604, 416.0, 568.8, 604.0, 604.0, 0.08282380453582129, 0.018859924240578793, 0.05467189441182919], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 24, 13.793103448275861, 196.1436781609196, 141, 1422, 151.0, 283.0, 353.75, 1195.5, 0.7361807450656851, 1.634739718855112, 0.351034460874532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 191.33333333333334, 143, 490, 154.0, 490.0, 490.0, 490.0, 0.047075807742401186, 0.036456167519261846, 0.016733978533431667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 361.15384615384613, 286, 576, 301.0, 574.8, 576.0, 576.0, 0.06009309807655861, 0.09313256508544777, 0.13515078600616648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5198993b-7abc-490a-a9c5-0a78c9a4c713", 3, 0, 0.0, 483.0, 227, 712, 510.0, 712.0, 712.0, 712.0, 0.0443977445945746, 0.028543471866629175, 0.028471209912536443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 11, 0, 0.0, 150.1818181818182, 145, 154, 151.0, 153.8, 154.0, 154.0, 0.1394417260350379, 0.1131602288428872, 0.049567176051517385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7ab2ec8-611b-4c17-adda-e5bf75545db7", 2, 0, 0.0, 430.0, 246, 614, 430.0, 614.0, 614.0, 614.0, 0.016762492247347334, 0.028646837336775234, 0.010419263979918535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 459.5416666666667, 200, 941, 373.5, 846.5, 935.25, 941.0, 0.09862662425721824, 0.06058217447049831, 0.044593874053800824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 146.22222222222226, 139, 151, 146.0, 151.0, 151.0, 151.0, 0.09408026091592361, 0.06991706890333776, 0.04722388096756322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 223.55555555555554, 138, 446, 145.0, 432.5, 446.0, 446.0, 0.09408321137361489, 0.09582889595964876, 0.049706071633911775], "isController": false}, {"data": ["login", 24, 0, 0.0, 2543.666666666666, 1314, 3594, 2741.0, 3472.0, 3580.0, 3594.0, 0.10044656870336036, 55.20852979051659, 0.2278930573633613], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cd56fde4-1f58-495f-8567-187f0e9edd7e", 3, 0, 0.0, 809.3333333333334, 219, 1745, 464.0, 1745.0, 1745.0, 1745.0, 0.04098080732190425, 0.026346710436445597, 0.026280009903695105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1ab3fbc-da17-480b-986a-7a70c102ea84", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.8630701013513513, 1.6126478040540542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 467.8888888888889, 293, 1010, 307.0, 1010.0, 1010.0, 1010.0, 0.04524136266984362, 0.07011527593461116, 0.10174888498891586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 179.14285714285717, 145, 455, 151.0, 382.8000000000002, 453.09999999999997, 455.0, 0.12654795263490914, 0.10244946556087861, 0.04498384253819036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 470.75000000000006, 288, 1422, 299.0, 1031.4000000000003, 1422.0, 1422.0, 0.08284103323478702, 6.314530454758441, 0.18498669689501454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24197a18-2914-4a0e-9aa2-e34ac41aa362", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67e3f492-b19f-47ba-8f3c-2465a931a621", 3, 0, 0.0, 323.0, 260, 414, 295.0, 414.0, 414.0, 414.0, 0.022156573116691284, 0.030544624723042833, 0.014208479505169867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67e3f492-b19f-47ba-8f3c-2465a931a621", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24197a18-2914-4a0e-9aa2-e34ac41aa362", 3, 0, 0.0, 359.6666666666667, 245, 453, 381.0, 453.0, 453.0, 453.0, 0.07404847706965494, 0.03350500752826183, 0.047485514266673245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 148.07692307692307, 141, 154, 148.0, 153.6, 154.0, 154.0, 0.06082127434605434, 0.050427013593554816, 0.021620062365199002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 844.0555555555555, 293, 1470, 902.0, 1436.7, 1470.0, 1470.0, 0.09400655956882326, 56.3051095094816, 0.19939672596043367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd56fde4-1f58-495f-8567-187f0e9edd7e", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12543f98-91f9-4e68-94f7-51e6fa334042", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 151.38888888888889, 141, 167, 150.5, 161.60000000000002, 167.0, 167.0, 0.09519729639678233, 0.07390805726117379, 0.03383966395354372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 25, 14, 56.0, 715.3600000000001, 142, 1729, 150.0, 1533.6000000000004, 1696.3, 1729.0, 0.10335148185354681, 54.41897993120925, 0.14088906303613583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 11, 0, 0.0, 535.4545454545455, 290, 1469, 300.0, 1352.4000000000005, 1469.0, 1469.0, 0.140718945887169, 15.502695447422285, 0.3132070927145964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48284496-6792-4f57-b806-2ca3263bbbbd", 3, 0, 0.0, 303.0, 225, 445, 239.0, 445.0, 445.0, 445.0, 0.02277644915157727, 0.02284317702995103, 0.01460599115514558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 160.45000000000002, 140, 413, 145.5, 160.00000000000003, 400.3999999999998, 413.0, 0.091460765618069, 0.06797035413608447, 0.045909017116882285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 232.2, 138, 448, 149.0, 438.20000000000005, 447.55, 448.0, 0.09146243866300206, 0.0244733478453736, 0.05216217204999336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12543f98-91f9-4e68-94f7-51e6fa334042", 3, 0, 0.0, 590.0, 231, 1183, 356.0, 1183.0, 1183.0, 1183.0, 0.045053839338008925, 0.028965277569195185, 0.028891947752564314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 187.1, 137, 429, 147.0, 425.50000000000006, 428.9, 429.0, 0.09146118387356407, 0.024651647215921564, 0.05376917255066949], "isController": false}, {"data": ["register", 26, 11, 42.30769230769231, 910.9230769230767, 207, 2034, 1026.5, 1418.2, 1841.499999999999, 2034.0, 0.10146301868090271, 0.031387072635814105, 0.04577726038142291], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 158.74999999999997, 139, 435, 144.0, 150.8, 420.7999999999998, 435.0, 0.09146369348687039, 0.024652323635133033, 0.05385996794197544], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 17.46031746031746, 0.810611643330877], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 7, 11.11111111111111, 0.5158437730287398], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 7, 11.11111111111111, 0.5158437730287398], "isController": false}, {"data": ["401/Unauthorized", 38, 60.317460317460316, 2.800294767870302], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1357, 63, "401/Unauthorized", 38, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 7, "Test failed: code expected to contain /204/", 7, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 7, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 24, "401/Unauthorized", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 25, 14, "Test failed: code expected to contain /200/", 7, "Test failed: code expected to contain /204/", 7, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
