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

    var data = {"OkPercent": 98.14528593508501, "KoPercent": 1.8547140649149922};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8134130146082338, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a39070e-8a0c-43da-844e-97b88522e204"], "isController": false}, {"data": [0.37272727272727274, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99cfcf9f-977a-450c-9122-4ae0b026060e"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2851f533-d187-420e-8721-da06c220c96e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e822b1b-cdae-419e-ab12-27d25fe00571"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78fc4cc5-f67e-4e40-b074-ce5a666bb1c8"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6e822b1b-cdae-419e-ab12-27d25fe00571"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/62e9d007-85b3-46ec-a72f-076ebd91bb09"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81171dd1-dd47-471a-b9f1-89c2e14a0448"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64530693-fd8d-44fe-83cb-1e8d8cf56c0b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/466e9999-cca4-46c5-970d-b6461b00725c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11299868-0e2e-4321-a172-94fae0d2a7e4"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=049026ee-ca62-4a34-9e21-f261017169a0"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2851f533-d187-420e-8721-da06c220c96e"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/11299868-0e2e-4321-a172-94fae0d2a7e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3898305084745763, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45b9fda5-4331-4130-a415-9d5a876c9988"], "isController": false}, {"data": [0.8363636363636363, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ad2f726-4600-48ea-a952-a720df754dc9"], "isController": false}, {"data": [0.9393063583815029, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78fc4cc5-f67e-4e40-b074-ce5a666bb1c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=466e9999-cca4-46c5-970d-b6461b00725c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2ad2f726-4600-48ea-a952-a720df754dc9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/64530693-fd8d-44fe-83cb-1e8d8cf56c0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c89f65f-a281-436c-b5b7-ce09fdc59c72"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62e9d007-85b3-46ec-a72f-076ebd91bb09"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/99cfcf9f-977a-450c-9122-4ae0b026060e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81171dd1-dd47-471a-b9f1-89c2e14a0448"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/049026ee-ca62-4a34-9e21-f261017169a0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8a39070e-8a0c-43da-844e-97b88522e204"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1294, 24, 1.8547140649149922, 302.5533230293661, 77, 2663, 95.0, 831.5, 1036.75, 1536.1, 5.06622503592165, 696.5229516217597, 3.711680769829338], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a39070e-8a0c-43da-844e-97b88522e204", 1, 0, 0.0, 693.0, 693, 693, 693.0, 693.0, 693.0, 693.0, 1.443001443001443, 0.2606985028860029, 0.9948818542568544], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1358.0909090909095, 1015, 1893, 1343.0, 1620.8, 1660.7999999999997, 1893.0, 0.25074768400320957, 301.732893558463, 1.2329244032775002], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99cfcf9f-977a-450c-9122-4ae0b026060e", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 592.6428571428572, 91, 965, 646.0, 934.5, 965.0, 965.0, 0.07439527271181397, 0.014654872358967818, 0.050056975486757645], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 592.6428571428572, 91, 965, 646.0, 934.5, 965.0, 965.0, 0.0751056844273728, 0.01479481395249029, 0.05053497711958971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 93.14285714285714, 77, 238, 81.5, 165.0, 238.0, 238.0, 0.12490743466895068, 0.03342249716727782, 0.07123627133463593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 95.64285714285714, 78, 242, 82.5, 174.5, 242.0, 242.0, 0.12490409150116874, 0.09282423206288029, 0.0626959990542976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 116.35714285714286, 80, 244, 82.0, 243.5, 244.0, 244.0, 0.12490854909798184, 0.033666757374065416, 0.07355454600203423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 93.21428571428572, 79, 240, 81.5, 165.5, 240.0, 240.0, 0.12491077801570308, 0.03366735813704497, 0.07343387535688793], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 232.2857142857143, 81, 475, 209.0, 440.5, 475.0, 475.0, 0.07420717583390313, 0.16582736363106312, 0.047963427125903076], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 83.26315789473685, 81, 91, 83.0, 90.0, 91.0, 91.0, 0.12244556005954721, 0.09099713984894085, 0.06146193151426491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 90.36842105263159, 79, 239, 82.0, 91.0, 239.0, 239.0, 0.12244634916543147, 0.03276396452278147, 0.06983268350841014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 474.8333333333333, 469, 481, 475.0, 481.0, 481.0, 481.0, 0.10108838494456987, 29.723341623984904, 0.057651969538700006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 864.6666666666666, 712, 1071, 868.0, 1071.0, 1071.0, 1071.0, 0.10055304172951231, 90.47780370160885, 0.057248460281548515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 185.33333333333334, 81, 370, 166.0, 370.0, 370.0, 370.0, 0.10176563374548415, 0.18007746908868874, 0.05634874446649366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2851f533-d187-420e-8721-da06c220c96e", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 97.18181818181819, 81, 247, 82.0, 214.2000000000001, 247.0, 247.0, 0.06365777579731365, 0.04730817127124578, 0.03195321949201095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 95.63636363636364, 80, 239, 81.0, 207.80000000000013, 239.0, 239.0, 0.06365814419148369, 0.025725485827382263, 0.03581900904524358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 196.8181818181818, 80, 878, 82.0, 750.4000000000004, 878.0, 878.0, 0.06365888099261557, 5.222904872291604, 0.03692712432579458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 175.45454545454547, 80, 631, 83.0, 553.6000000000003, 631.0, 631.0, 0.06365814419148369, 1.7171987848528338, 0.0369888630800125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e822b1b-cdae-419e-ab12-27d25fe00571", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 108.66666666666667, 81, 238, 83.0, 238.0, 238.0, 238.0, 0.10176045588684238, 0.07562471379871781, 0.057140880991146836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 625.6875, 80, 1123, 771.0, 1118.1, 1123.0, 1123.0, 0.07570488343813728, 42.58226880734053, 0.0404400109772081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 90.15789473684214, 79, 241, 82.0, 85.0, 241.0, 241.0, 0.12244792740771293, 0.033003542934110126, 0.07198598857367498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 454.3125, 79, 796, 635.5, 749.1, 796.0, 796.0, 0.07570524164166817, 13.920061031436601, 0.04051413322229898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 106.68421052631578, 80, 242, 82.0, 239.0, 242.0, 242.0, 0.12244871654411055, 0.033003755631029794, 0.07210603132431509], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 439.7142857142858, 88, 735, 453.0, 714.0, 735.0, 735.0, 0.075340917652377, 0.01484115174737114, 0.05117674777475218], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/78fc4cc5-f67e-4e40-b074-ce5a666bb1c8", 3, 0, 0.0, 336.6666666666667, 257, 448, 305.0, 448.0, 448.0, 448.0, 0.028327274444077236, 0.028410264505925122, 0.018165602426703176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 325.0, 163, 961, 322.0, 866.6000000000004, 961.0, 961.0, 0.06362758197835505, 7.009710165518478, 0.14161994919916013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e822b1b-cdae-419e-ab12-27d25fe00571", 3, 0, 0.0, 795.6666666666666, 200, 1538, 649.0, 1538.0, 1538.0, 1538.0, 0.03767755548020044, 0.031410227729424915, 0.024161713638019163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62e9d007-85b3-46ec-a72f-076ebd91bb09", 3, 0, 0.0, 318.3333333333333, 194, 526, 235.0, 526.0, 526.0, 526.0, 0.030382823577071096, 0.024873958755316995, 0.019483776838160827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 474.24999999999994, 102, 1086, 384.0, 893.4000000000002, 1076.8999999999999, 1086.0, 0.0846399627584164, 0.05199075837406632, 0.03826982691127616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 93.125, 81, 243, 83.0, 137.30000000000013, 243.0, 243.0, 0.07570273428813407, 0.05625955155592776, 0.03799922404697355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 122.6875, 81, 246, 82.5, 245.3, 246.0, 246.0, 0.07570380884788266, 0.09132141589779987, 0.03920111781405252], "isController": false}, {"data": ["login", 20, 0, 0.0, 2564.7999999999997, 1799, 4018, 2476.0, 3412.3, 3987.8499999999995, 4018.0, 0.0874657243692628, 31.51037281991682, 0.17547810951583348], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/81171dd1-dd47-471a-b9f1-89c2e14a0448", 3, 0, 0.0, 308.6666666666667, 181, 463, 282.0, 463.0, 463.0, 463.0, 0.01897245199969644, 0.02242479596708912, 0.012166578919076168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 87.26315789473685, 80, 105, 84.0, 98.0, 105.0, 105.0, 0.1218792497369974, 0.09866982229684654, 0.0433242645549483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64530693-fd8d-44fe-83cb-1e8d8cf56c0b", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/466e9999-cca4-46c5-970d-b6461b00725c", 3, 0, 0.0, 392.3333333333333, 295, 581, 301.0, 581.0, 581.0, 581.0, 0.04160079873533572, 0.03468087420611809, 0.02667759554316776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11299868-0e2e-4321-a172-94fae0d2a7e4", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 720.3750000000001, 164, 1210, 853.5, 1202.3, 1210.0, 1210.0, 0.0756733747960366, 56.626269967720575, 0.15809010452384895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 224.85714285714286, 161, 486, 167.5, 409.0, 486.0, 486.0, 0.12481166810794428, 0.19343370828838627, 0.2807043668482379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 676.8888888888889, 81, 1153, 875.0, 1153.0, 1153.0, 1153.0, 0.09974841233777029, 79.56474970768173, 0.17178893235949327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=049026ee-ca62-4a34-9e21-f261017169a0", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1045.0434782608695, 270, 1970, 1122.0, 1870.2, 1950.5999999999997, 1970.0, 0.09813082118431102, 0.030615882900064426, 0.044273866589015325], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 208.5263157894737, 164, 335, 169.0, 324.0, 335.0, 335.0, 0.12237931145534767, 0.18966403054652026, 0.2752339397281891], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 97.13333333333334, 82, 242, 86.0, 155.00000000000006, 242.0, 242.0, 0.08825086780020003, 0.06851507802847562, 0.03137042566335236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2851f533-d187-420e-8721-da06c220c96e", 3, 0, 0.0, 342.0, 194, 426, 406.0, 426.0, 426.0, 426.0, 0.018121960796158142, 0.021419544157177808, 0.011621179286598811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 299.49999999999994, 162, 933, 169.0, 832.900000000001, 930.3499999999999, 933.0, 0.10508230571595202, 12.718068360637218, 0.23364393911531206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 97.81818181818181, 80, 241, 83.0, 210.2000000000001, 241.0, 241.0, 0.09131358746181431, 0.067860976619571, 0.045835140581418514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 95.72727272727272, 80, 239, 81.0, 208.0000000000001, 239.0, 239.0, 0.0914357912936502, 0.024466217592246247, 0.05214697472215988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11299868-0e2e-4321-a172-94fae0d2a7e4", 3, 0, 0.0, 290.3333333333333, 199, 454, 218.0, 454.0, 454.0, 454.0, 0.026022240341411793, 0.026098477373662023, 0.016687439281439204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 110.90909090909092, 79, 242, 82.0, 241.4, 242.0, 242.0, 0.09131510351812189, 0.024612273995118793, 0.05368329327920838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 125.18181818181817, 80, 241, 82.0, 240.8, 241.0, 241.0, 0.09131358746181431, 0.02461186537056714, 0.053771575429173865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 98.5, 88, 109, 98.5, 109.0, 109.0, 109.0, 0.03405878546371036, 0.010044680869180206, 0.021053917186063146], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 933.1999999999999, 629, 1471, 884.0, 1259.0, 1325.1999999999998, 1471.0, 0.26176639966493903, 313.1636187241506, 0.5168863868383855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1045.0434782608695, 270, 1970, 1122.0, 1870.2, 1950.5999999999997, 1970.0, 0.09509790949986768, 0.029669643300145543, 0.042905502137635616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 120.625, 80, 239, 82.0, 239.0, 239.0, 239.0, 0.04477578525533391, 0.012068473369601719, 0.02636699073141245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 160.875, 80, 244, 159.5, 244.0, 244.0, 244.0, 0.04473622403900999, 0.01205781038551441, 0.02630000671043361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 124.40000000000002, 79, 255, 82.0, 246.6, 255.0, 255.0, 0.09066511931529703, 0.02443708294045115, 0.05330117365996954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 133.79999999999995, 79, 242, 82.0, 241.4, 242.0, 242.0, 0.09066347531233566, 0.024436639830277974, 0.05338874571615079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 120.87500000000001, 79, 244, 81.0, 244.0, 244.0, 244.0, 0.044776537094562446, 0.011981221839755968, 0.02553661881174265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 127.79999999999998, 80, 359, 83.0, 330.8, 359.0, 359.0, 0.09066347531233566, 0.06737783663348383, 0.04550881475638724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 123.25, 81, 243, 84.0, 243.0, 243.0, 243.0, 0.044775033441353106, 0.03327519575084933, 0.022474967957866694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 145.86666666666667, 79, 252, 83.0, 246.0, 252.0, 252.0, 0.09066347531233566, 0.024259562730058568, 0.05170651326406644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 88.37500000000001, 83, 105, 84.5, 105.0, 105.0, 105.0, 0.043465977006498166, 0.03421247799534914, 0.015450796514028645], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 652.6153846153846, 86, 2663, 512.0, 1878.9999999999993, 2663.0, 2663.0, 0.0838693444643007, 0.015712901524486626, 0.05708054844099792], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1527.3500000000001, 1163, 2108, 1451.5, 2060.8, 2105.95, 2108.0, 0.0850785061915883, 0.04403477371244316, 0.03913278946898251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 305.125, 164, 487, 323.0, 487.0, 487.0, 487.0, 0.044714970013023235, 0.06929947012760534, 0.10056501556639894], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 870.3898305084746, 416, 1796, 716.0, 1497.0, 1619.0, 1796.0, 0.2650136998607555, 70.89179636616808, 0.9660349430669721], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 144.05454545454538, 81, 354, 84.0, 328.0, 331.2, 354.0, 0.2628547942324879, 0.19534423672941725, 0.12706359682136864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45b9fda5-4331-4130-a415-9d5a876c9988", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.7732105024213075, 1.444745006053269], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 512.418181818182, 397, 810, 479.0, 642.0, 684.3999999999999, 810.0, 0.26270413305247875, 77.24373771559651, 0.13212170754104155], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 124.47272727272727, 79, 333, 85.0, 245.8, 251.0, 333.0, 0.2632057503278108, 0.46575080038475897, 0.12800435904614238], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 786.3999999999999, 537, 1114, 789.0, 961.4, 1023.1999999999999, 1114.0, 0.26222192556711454, 235.94774956226817, 0.13162311498193052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 102.45, 82, 244, 84.0, 230.40000000000026, 243.95, 244.0, 0.107201243534425, 0.08008686650765148, 0.038106692037627635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ad2f726-4600-48ea-a952-a720df754dc9", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, 5.202312138728324, 151.971098265896, 81, 1117, 88.0, 300.4, 372.49999999999943, 1080.7399999999996, 0.6983522117177849, 1.4858433561677014, 0.33631300938335096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 101.45454545454547, 81, 248, 87.0, 216.80000000000013, 248.0, 248.0, 0.0879852184832948, 0.06813699048559842, 0.0312759956327337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78fc4cc5-f67e-4e40-b074-ce5a666bb1c8", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 97.14285714285714, 83, 245, 85.0, 169.5, 245.0, 245.0, 0.11755222677503863, 0.09539638715825888, 0.04178614311143951], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=466e9999-cca4-46c5-970d-b6461b00725c", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ad2f726-4600-48ea-a952-a720df754dc9", 3, 0, 0.0, 383.6666666666667, 185, 512, 454.0, 512.0, 512.0, 512.0, 0.024425989252564728, 0.024497549767953104, 0.015663801701677253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64530693-fd8d-44fe-83cb-1e8d8cf56c0b", 3, 0, 0.0, 425.0, 233, 530, 512.0, 530.0, 530.0, 530.0, 0.022429906542056073, 0.02651139018691589, 0.014383761682242991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 224.63636363636363, 163, 481, 169.0, 450.0000000000001, 481.0, 481.0, 0.09113051546733385, 0.14123450004556526, 0.20495466515749008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 306.7333333333333, 162, 601, 323.0, 572.8000000000001, 601.0, 601.0, 0.09061801486135443, 0.14044022420407176, 0.20380203928290944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c89f65f-a281-436c-b5b7-ce09fdc59c72", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62e9d007-85b3-46ec-a72f-076ebd91bb09", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 0.2458014455782313, 0.938031462585034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99cfcf9f-977a-450c-9122-4ae0b026060e", 3, 0, 0.0, 340.0, 179, 519, 322.0, 519.0, 519.0, 519.0, 0.018399602568584517, 0.02536533752537612, 0.011799224303421714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 86.36363636363637, 82, 98, 84.0, 96.80000000000001, 98.0, 98.0, 0.06189755392121004, 0.05131935867100325, 0.022002646120430132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 88.75, 83, 107, 86.0, 102.10000000000001, 107.0, 107.0, 0.07511102348158372, 0.058313734050643606, 0.026699621628219213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81171dd1-dd47-471a-b9f1-89c2e14a0448", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/049026ee-ca62-4a34-9e21-f261017169a0", 3, 0, 0.0, 1028.3333333333335, 177, 2663, 245.0, 2663.0, 2663.0, 2663.0, 0.03237642995898986, 0.026990897501618823, 0.020762228847399092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a39070e-8a0c-43da-844e-97b88522e204", 3, 0, 0.0, 476.0, 250, 703, 475.0, 703.0, 703.0, 703.0, 0.026727724668798945, 0.026649420787933323, 0.017139849478363906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 82.35, 80, 85, 82.0, 84.0, 84.95, 85.0, 0.10512759862282846, 0.0781270532734106, 0.05276912665247444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 125.95000000000003, 79, 325, 82.0, 245.0, 320.99999999999994, 325.0, 0.1051298090317019, 0.043920441702892644, 0.0590739180828528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 195.5, 80, 848, 82.5, 739.8000000000012, 845.3499999999999, 848.0, 0.1051298090317019, 9.485100888478298, 0.06090136984141168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 168.99999999999997, 79, 640, 82.0, 596.7000000000008, 639.8, 640.0, 0.10513036164844407, 3.1166840241274176, 0.061004356339360806], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 33.333333333333336, 0.6182380216383307], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.1545595054095827], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.166666666666667, 0.07727975270479134], "isController": false}, {"data": ["401/Unauthorized", 13, 54.166666666666664, 1.0046367851622875], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1294, 24, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
