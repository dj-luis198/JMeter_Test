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

    var data = {"OkPercent": 96.6472303206997, "KoPercent": 3.3527696793002915};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7757125154894672, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3157894736842105, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84e86efb-b259-4d12-9f72-c3fc9f5ce90f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51994e52-2e5d-4239-9409-faa2ca050ec3"], "isController": false}, {"data": [0.4473684210526316, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4473684210526316, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf228e60-9ca2-48f3-8d0e-8f4c9a077d59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71ff6553-16d5-4794-bc6f-bf5c26e706ee"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=744e8368-e389-4599-83ac-e5d07f258c84"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a71ef44-a29d-4e38-9f7d-6fafe819454b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/162fdae7-7b54-4a6c-acf8-1fa4de219007"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b10e234-65ba-4874-affd-f1309c23b6e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9761c588-31da-49cc-aefe-ad623ac6201e"], "isController": false}, {"data": [0.74, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3d483c6-9c4e-48fb-81bf-8c938c60faae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a679424-766b-4131-9524-67f6ed9f60ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9443ca8-bd2d-4397-a4e3-3e16a730d255"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e42327ee-ef50-4b04-841d-a8cfe81fbcac"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/51994e52-2e5d-4239-9409-faa2ca050ec3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fbdf6ea7-586d-44e4-8785-c0c0ceabc077"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/84e86efb-b259-4d12-9f72-c3fc9f5ce90f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=162fdae7-7b54-4a6c-acf8-1fa4de219007"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9443ca8-bd2d-4397-a4e3-3e16a730d255"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/744e8368-e389-4599-83ac-e5d07f258c84"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b10e234-65ba-4874-affd-f1309c23b6e5"], "isController": false}, {"data": [0.2796610169491525, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7456140350877193, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9761c588-31da-49cc-aefe-ad623ac6201e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8942857142857142, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4a71ef44-a29d-4e38-9f7d-6fafe819454b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca598b16-f817-4373-924b-59492a531071"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3d483c6-9c4e-48fb-81bf-8c938c60faae"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7a679424-766b-4131-9524-67f6ed9f60ea"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf228e60-9ca2-48f3-8d0e-8f4c9a077d59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71ff6553-16d5-4794-bc6f-bf5c26e706ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e42327ee-ef50-4b04-841d-a8cfe81fbcac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbdf6ea7-586d-44e4-8785-c0c0ceabc077"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1372, 46, 3.3527696793002915, 315.9198250728861, 81, 1999, 97.0, 880.6000000000004, 1063.0, 1425.7499999999995, 5.334722746060198, 756.9901663528499, 3.9003871999704494], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1417.3684210526314, 1014, 1812, 1386.0, 1656.4, 1692.6, 1812.0, 0.25974972885773917, 312.5679324220637, 1.2771873874987467], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84e86efb-b259-4d12-9f72-c3fc9f5ce90f", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51994e52-2e5d-4239-9409-faa2ca050ec3", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.2796657314241486, 1.067264899380805], "isController": false}, {"data": ["deleteBook", 19, 5, 26.31578947368421, 558.5263157894735, 86, 1489, 531.0, 1175.0, 1489.0, 1489.0, 0.10171632921828323, 0.021434876120217994, 0.06785445296690472], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 19, 5, 26.31578947368421, 558.5263157894735, 86, 1489, 531.0, 1175.0, 1489.0, 1489.0, 0.10019670194645278, 0.021114642165936285, 0.06684071723699683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf228e60-9ca2-48f3-8d0e-8f4c9a077d59", 3, 0, 0.0, 662.6666666666666, 215, 1306, 467.0, 1306.0, 1306.0, 1306.0, 0.021795514483119373, 0.025761560250067202, 0.013976941253823297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 95.52941176470587, 83, 247, 86.0, 119.79999999999988, 247.0, 247.0, 0.08784303998925215, 0.03126582466529219, 0.04966401651965876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 87.05882352941177, 83, 95, 86.0, 91.8, 95.0, 95.0, 0.08784394781036042, 0.06528246512078542, 0.04409354411574732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 134.94117647058823, 82, 661, 85.0, 412.19999999999976, 661.0, 661.0, 0.0878403166385061, 1.541575354719867, 0.05128223448972527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 146.47058823529414, 82, 937, 86.0, 393.7999999999995, 937.0, 937.0, 0.0878421321869074, 4.671724949813723, 0.05119751109652817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71ff6553-16d5-4794-bc6f-bf5c26e706ee", 3, 0, 0.0, 316.0, 221, 488, 239.0, 488.0, 488.0, 488.0, 0.01834907276018985, 0.025295678105274746, 0.011766820747908205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=744e8368-e389-4599-83ac-e5d07f258c84", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["goToProfile", 19, 5, 26.31578947368421, 249.10526315789474, 85, 584, 204.0, 546.0, 584.0, 584.0, 0.10165157051676448, 0.1574146879163033, 0.0656900285828166], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 95.85714285714285, 83, 257, 88.0, 91.0, 240.39999999999975, 257.0, 0.13491028466070062, 0.10026047522147773, 0.06771863898007825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 129.66666666666669, 82, 335, 87.0, 261.6, 327.8999999999999, 335.0, 0.13490855127488582, 0.05539632197531816, 0.07586096549553195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 652.3000000000001, 490, 757, 678.0, 752.3000000000001, 757.0, 757.0, 0.08294349888855712, 24.388142656597328, 0.047303714209880235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a71ef44-a29d-4e38-9f7d-6fafe819454b", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/162fdae7-7b54-4a6c-acf8-1fa4de219007", 3, 0, 0.0, 517.0, 201, 804, 546.0, 804.0, 804.0, 804.0, 0.03508895048949086, 0.029252214258979847, 0.022501703276138343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 927.6999999999999, 809, 1021, 934.5, 1017.1, 1021.0, 1021.0, 0.08272940865018698, 74.44006732622688, 0.047100825432674805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 121.2, 83, 260, 87.0, 259.5, 260.0, 260.0, 0.08334930861748502, 0.14748920626453402, 0.046151423814564455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 132.26666666666665, 82, 266, 88.0, 264.8, 266.0, 266.0, 0.07443429932512902, 0.05531689627580389, 0.0373625291534339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 132.0, 84, 261, 87.0, 258.0, 261.0, 261.0, 0.07437266655758676, 0.01990049866872927, 0.0424156613961237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 108.8, 81, 258, 87.0, 253.2, 258.0, 258.0, 0.07443429932512902, 0.02006236973997618, 0.043759226751687176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 119.79999999999998, 82, 266, 85.0, 263.6, 266.0, 266.0, 0.07436971665137956, 0.020044962691192148, 0.0437938858796698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 104.30000000000001, 82, 271, 86.5, 252.80000000000007, 271.0, 271.0, 0.08334930861748502, 0.06194221079873642, 0.04680259028813856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 621.5294117647059, 83, 1095, 776.0, 1069.4, 1095.0, 1095.0, 0.08847254748894093, 46.837909429482174, 0.047539763856362216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 193.04761904761907, 82, 1010, 87.0, 732.6000000000004, 992.1999999999998, 1010.0, 0.13490508463688047, 11.593644103523593, 0.07820530064561719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 429.8235294117648, 81, 759, 497.0, 739.0, 759.0, 759.0, 0.08839204471597557, 15.298160665540102, 0.04758282692057715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 168.61904761904762, 82, 661, 88.0, 588.8000000000002, 660.0, 661.0, 0.13468790887400908, 3.804532568819108, 0.07821093369185972], "isController": false}, {"data": ["deleteBooks", 19, 5, 26.31578947368421, 448.2105263157894, 87, 1209, 413.0, 1072.0, 1209.0, 1209.0, 0.10033957022977762, 0.021144749071858975, 0.06729703186309458], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 278.0, 167, 534, 177.0, 527.4, 534.0, 534.0, 0.07433765152491303, 0.11520884079105172, 0.167187120568237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b10e234-65ba-4874-affd-f1309c23b6e5", 3, 0, 0.0, 428.0, 285, 584, 415.0, 584.0, 584.0, 584.0, 0.06313264168017003, 0.040588205507270776, 0.04048545055661946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9761c588-31da-49cc-aefe-ad623ac6201e", 3, 0, 0.0, 327.3333333333333, 200, 498, 284.0, 498.0, 498.0, 498.0, 0.03447443720481263, 0.028403255392376554, 0.02210763062938831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 586.72, 91, 1315, 501.0, 1195.0000000000005, 1312.3, 1315.0, 0.10701505059671593, 0.06573483088411554, 0.04838668791628855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 97.17647058823529, 83, 249, 87.0, 130.5999999999999, 249.0, 249.0, 0.08846978496638148, 0.06574756480411749, 0.044407685031953206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 166.23529411764704, 83, 268, 94.0, 264.8, 268.0, 268.0, 0.08839388314328649, 0.1017484277587991, 0.046045251168619135], "isController": false}, {"data": ["login", 25, 0, 0.0, 2480.44, 1073, 3658, 2547.0, 3274.6, 3545.4999999999995, 3658.0, 0.10675776662752215, 51.229048788299345, 0.2318853755204441], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a3d483c6-9c4e-48fb-81bf-8c938c60faae", 3, 0, 0.0, 310.3333333333333, 204, 433, 294.0, 433.0, 433.0, 433.0, 0.054016096796845464, 0.034727145564378184, 0.03463922874016457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 93.09523809523809, 87, 113, 91.0, 105.80000000000001, 112.5, 113.0, 0.14028243530307685, 0.11356849498657297, 0.0498660219241406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a679424-766b-4131-9524-67f6ed9f60ea", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9443ca8-bd2d-4397-a4e3-3e16a730d255", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 740.8235294117648, 171, 1180, 866.0, 1163.2, 1180.0, 1180.0, 0.08835070030922745, 62.23176569036978, 0.1854055280903256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e42327ee-ef50-4b04-841d-a8cfe81fbcac", 3, 0, 0.0, 286.6666666666667, 177, 400, 283.0, 400.0, 400.0, 400.0, 0.08006405124099279, 0.03622689818521484, 0.051343157859621034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51994e52-2e5d-4239-9409-faa2ca050ec3", 3, 0, 0.0, 328.0, 196, 574, 214.0, 574.0, 574.0, 574.0, 0.031718844165318616, 0.0318117704665842, 0.02034053483257737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbdf6ea7-586d-44e4-8785-c0c0ceabc077", 3, 0, 0.0, 418.3333333333333, 391, 459, 405.0, 459.0, 459.0, 459.0, 0.06841661155328513, 0.030956735045268993, 0.04387393384113663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 260.5294117647059, 171, 1023, 178.0, 556.5999999999996, 1023.0, 1023.0, 0.08780175396915575, 6.306978334917209, 0.19614673771291927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, 50.0, 559.65, 83, 1118, 491.0, 1106.5, 1117.65, 1118.0, 0.16534391534391535, 98.92652400586971, 0.24119382182126323], "isController": false}, {"data": ["register", 26, 10, 38.46153846153846, 874.5, 110, 1633, 899.5, 1562.1000000000001, 1622.1499999999999, 1633.0, 0.10700160913958359, 0.033245091301180724, 0.04827611662352307], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 327.1428571428571, 172, 1097, 181.0, 957.6000000000005, 1096.3, 1097.0, 0.1346153846153846, 15.526548727964743, 0.299472906650641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 104.46153846153845, 88, 263, 90.0, 199.79999999999995, 263.0, 263.0, 0.08691117677733357, 0.06747498587693378, 0.03089420737006779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84e86efb-b259-4d12-9f72-c3fc9f5ce90f", 3, 0, 0.0, 408.6666666666667, 182, 661, 383.0, 661.0, 661.0, 661.0, 0.020736562707365628, 0.024509915101056184, 0.013297860850752047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 254.73333333333338, 170, 357, 179.0, 352.8, 357.0, 357.0, 0.07417370492711198, 0.11495475558527998, 0.16681840082728405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=162fdae7-7b54-4a6c-acf8-1fa4de219007", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 0.24088541666666666, 0.9192708333333334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 89.0, 84, 100, 87.0, 100.0, 100.0, 100.0, 0.053305309970377475, 0.03961459071040749, 0.026756766918724636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 131.71428571428572, 83, 247, 87.0, 247.0, 247.0, 247.0, 0.05330571589576448, 0.0257009701640293, 0.029761366492026986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 208.28571428571428, 83, 923, 86.0, 923.0, 923.0, 923.0, 0.053295163844560844, 6.863038626145847, 0.03067743387592886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 166.71428571428572, 83, 494, 86.0, 494.0, 494.0, 494.0, 0.053304904051172705, 2.2513736721367654, 0.030735096044014622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 88.8, 87, 93, 88.0, 93.0, 93.0, 93.0, 0.14593001196626096, 0.04303795274786213, 0.0902086890377375], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 961.9824561403508, 651, 1444, 920.0, 1287.2, 1337.5, 1444.0, 0.26830347476535216, 320.9842331992601, 0.5297945566167402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, 38.46153846153846, 874.5, 110, 1633, 899.5, 1562.1000000000001, 1622.1499999999999, 1633.0, 0.10669511869831955, 0.033149865605187026, 0.04813783675646839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 100.72727272727273, 83, 244, 86.0, 212.80000000000013, 244.0, 244.0, 0.05215742057847321, 0.014058054765291607, 0.030713793563300142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 85.45454545454547, 82, 90, 85.0, 89.6, 90.0, 90.0, 0.05219702002467495, 0.01406872805352567, 0.030686138725443672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9443ca8-bd2d-4397-a4e3-3e16a730d255", 2, 0, 0.0, 396.0, 335, 457, 396.0, 457.0, 457.0, 457.0, 0.06360109393881576, 0.037359431644724286, 0.03953329716021115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 138.46153846153845, 85, 257, 88.0, 256.6, 257.0, 257.0, 0.08416309513019384, 0.022684584234310058, 0.04947869459802411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 125.84615384615384, 83, 265, 86.0, 262.6, 265.0, 265.0, 0.08415764669325185, 0.02268311571029054, 0.04955767671487389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 133.36363636363637, 82, 445, 85.0, 406.8000000000001, 445.0, 445.0, 0.05215494760798445, 0.013955523090417714, 0.029744618557678633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 114.38461538461539, 85, 265, 88.0, 259.0, 265.0, 265.0, 0.08424872816823822, 0.0626106270859661, 0.0422889123813227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 88.0, 83, 97, 87.0, 96.2, 97.0, 97.0, 0.052195533960312415, 0.038789845062302486, 0.02619971138242244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 100.3846153846154, 82, 261, 88.0, 192.59999999999994, 261.0, 261.0, 0.08425309630128906, 0.022544285533743366, 0.048050593984328926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 125.18181818181817, 89, 269, 94.0, 268.2, 269.0, 269.0, 0.048851544597019174, 0.038451508735544385, 0.017365197493471658], "isController": false}, {"data": ["deleteAccount", 18, 5, 27.77777777777778, 489.6111111111111, 83, 1993, 450.0, 922.9000000000017, 1993.0, 1993.0, 0.09570039396662183, 0.0196000969631075, 0.06511385854684269], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1262.7599999999995, 741, 1999, 1259.0, 1752.0000000000005, 1963.6, 1999.0, 0.10560420389214854, 0.05465842584261594, 0.04857380862617379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 224.0909090909091, 173, 542, 176.0, 503.0000000000001, 542.0, 542.0, 0.052132701421800945, 0.08079550503554503, 0.1172476673578199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/744e8368-e389-4599-83ac-e5d07f258c84", 3, 0, 0.0, 378.0, 203, 716, 215.0, 716.0, 716.0, 716.0, 0.052271182896868953, 0.034217886980990715, 0.03352025726133849], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b10e234-65ba-4874-affd-f1309c23b6e5", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.3302816499085923, 1.2604261882998171], "isController": false}, {"data": ["addBook", 59, 16, 27.11864406779661, 886.677966101695, 433, 1998, 722.0, 1664.0, 1758.0, 1998.0, 0.28679340666818975, 82.5696284794967, 1.0424837797669682], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 148.0350877192982, 84, 359, 89.0, 344.8, 349.29999999999995, 359.0, 0.2691523118766999, 0.2000243255255553, 0.13010780701070943], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 538.8245614035088, 406, 798, 506.0, 724.8000000000001, 769.8, 798.0, 0.2690887804141135, 79.12103603016155, 0.1353327362434262], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 128.80701754385962, 82, 357, 88.0, 256.6, 271.4999999999998, 357.0, 0.2695124661336309, 0.47691073108802656, 0.13107149231889473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9761c588-31da-49cc-aefe-ad623ac6201e", 1, 0, 0.0, 1209.0, 1209, 1209, 1209.0, 1209.0, 1209.0, 1209.0, 0.8271298593879239, 0.1494326406120761, 0.5702672663358147], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 812.4912280701756, 562, 1192, 812.0, 987.8, 1042.5999999999997, 1192.0, 0.26877410715127736, 241.8434140692046, 0.1349120030036685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 92.93333333333332, 86, 103, 92.0, 102.4, 103.0, 103.0, 0.07817059951638455, 0.05839893420901776, 0.027787205296839822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 16, 9.142857142857142, 150.5428571428571, 83, 951, 92.0, 296.6, 420.2, 647.7600000000036, 0.7363677294206258, 1.6260289752811874, 0.3519402171969216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 97.28571428571429, 86, 130, 88.0, 130.0, 130.0, 130.0, 0.05382627952755906, 0.04168382779819759, 0.019133560300812008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a71ef44-a29d-4e38-9f7d-6fafe819454b", 3, 0, 0.0, 931.6666666666666, 199, 1993, 603.0, 1993.0, 1993.0, 1993.0, 0.02400326444396438, 0.028371045962250867, 0.015392718409703719], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca598b16-f817-4373-924b-59492a531071", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 91.82352941176471, 86, 103, 90.0, 99.0, 103.0, 103.0, 0.08517759528617166, 0.06912361492461783, 0.030277973324381334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3d483c6-9c4e-48fb-81bf-8c938c60faae", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 322.42857142857144, 173, 1023, 176.0, 1023.0, 1023.0, 1023.0, 0.05326069588903515, 9.173367250568749, 0.11783780358596657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a679424-766b-4131-9524-67f6ed9f60ea", 3, 0, 0.0, 400.3333333333333, 195, 529, 477.0, 529.0, 529.0, 529.0, 0.0407686244666105, 0.033137778415731255, 0.0261439421221428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 281.6923076923077, 173, 530, 180.0, 521.6, 530.0, 530.0, 0.08410755415232525, 0.13035028167943377, 0.18915986055937994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf228e60-9ca2-48f3-8d0e-8f4c9a077d59", 1, 0, 0.0, 1072.0, 1072, 1072, 1072.0, 1072.0, 1072.0, 1072.0, 0.9328358208955224, 0.16852990904850745, 0.6431465718283582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 104.53333333333333, 88, 267, 92.0, 171.60000000000005, 267.0, 267.0, 0.07647637644731542, 0.06340668320680741, 0.027184961940256654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 103.76470588235293, 86, 256, 93.0, 151.1999999999999, 256.0, 256.0, 0.08509402890193664, 0.06606421189164026, 0.03024826808623529], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71ff6553-16d5-4794-bc6f-bf5c26e706ee", 1, 0, 0.0, 857.0, 857, 857, 857.0, 857.0, 857.0, 857.0, 1.1668611435239205, 0.21080987456242709, 0.8044960618436406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e42327ee-ef50-4b04-841d-a8cfe81fbcac", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 0.6273057725694445, 2.393934461805556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 87.2, 83, 92, 86.0, 91.4, 92.0, 92.0, 0.07426661715558856, 0.05519228091347939, 0.037278360564426294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 129.93333333333334, 82, 257, 86.0, 255.8, 257.0, 257.0, 0.07420562874429235, 0.019855803003843854, 0.04232039764322923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 132.06666666666672, 82, 263, 88.0, 260.6, 263.0, 263.0, 0.07426661715558856, 0.02001717415521723, 0.04366064797623469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbdf6ea7-586d-44e4-8785-c0c0ceabc077", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 131.60000000000002, 83, 265, 87.0, 260.2, 265.0, 265.0, 0.07426735256692726, 0.020017372371554612, 0.04373360702915736], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 21.73913043478261, 0.7288629737609329], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 10.869565217391305, 0.36443148688046645], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 10.869565217391305, 0.36443148688046645], "isController": false}, {"data": ["401/Unauthorized", 26, 56.52173913043478, 1.8950437317784257], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1372, 46, "401/Unauthorized", 26, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 19, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
