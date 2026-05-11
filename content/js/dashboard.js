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

    var data = {"OkPercent": 98.4579799537394, "KoPercent": 1.5420200462606013};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7846715328467153, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.14035087719298245, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df808b43-1771-4d4c-afae-0547d9b11f45"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/11763dc8-58d9-4b33-a89e-8a68d1e4e1d4"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e67e85e9-2c10-4ee4-9c0e-93ee06420106"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7318b3e-aeda-4aa7-9f45-d1b22f2c07ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28c08d72-12b9-436c-8ea2-e5d70f7677db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0bfd67f-8401-41ad-9a14-0ca69de77587"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28c08d72-12b9-436c-8ea2-e5d70f7677db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4169a611-bade-4f50-aaf8-b956ad900084"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ec1ac6ef-41e1-40d5-b908-fd5046904f2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/794ff6b2-41c9-4fdc-9a3f-8e0c4a39c7eb"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f94fd8c-af62-4f42-904e-457a2cc85a14"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a6d5069-f97a-4cb9-90b3-7cd794f4f2e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48693d44-bf95-4ab6-83eb-645021a7a5f7"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e67e85e9-2c10-4ee4-9c0e-93ee06420106"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93800acb-15cc-4aeb-be1e-f033458f8a26"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0258b088-9b65-4447-b408-1a8963a4a56c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1f94fd8c-af62-4f42-904e-457a2cc85a14"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e47ff1ed-7d68-457c-9f1d-d0f8802ed412"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11763dc8-58d9-4b33-a89e-8a68d1e4e1d4"], "isController": false}, {"data": [0.30357142857142855, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df808b43-1771-4d4c-afae-0547d9b11f45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7318b3e-aeda-4aa7-9f45-d1b22f2c07ea"], "isController": false}, {"data": [0.5087719298245614, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9378698224852071, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0bfd67f-8401-41ad-9a14-0ca69de77587"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a6d5069-f97a-4cb9-90b3-7cd794f4f2e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/93800acb-15cc-4aeb-be1e-f033458f8a26"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec1ac6ef-41e1-40d5-b908-fd5046904f2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0258b088-9b65-4447-b408-1a8963a4a56c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4169a611-bade-4f50-aaf8-b956ad900084"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e865690-1fc6-41e5-ad89-66377ca493d3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1297, 20, 1.5420200462606013, 369.4217424826527, 99, 3416, 116.0, 1015.2, 1301.1, 1883.8799999999983, 5.055702380117096, 721.4155715426227, 3.6996028549906064], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1671.7368421052631, 1227, 2250, 1647.0, 2059.4, 2091.7, 2250.0, 0.2570786841179495, 309.35253028003535, 1.264053881380738], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df808b43-1771-4d4c-afae-0547d9b11f45", 1, 0, 0.0, 1094.0, 1094, 1094, 1094.0, 1094.0, 1094.0, 1094.0, 0.9140767824497258, 0.16514082495429616, 0.6302130941499086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11763dc8-58d9-4b33-a89e-8a68d1e4e1d4", 3, 0, 0.0, 789.6666666666666, 369, 1580, 420.0, 1580.0, 1580.0, 1580.0, 0.022197886761180334, 0.026237150660757096, 0.01423497295557463], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 550.3846153846154, 103, 1538, 441.0, 1357.9999999999998, 1538.0, 1538.0, 0.08584257791864765, 0.016263144644743793, 0.05803015014197042], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 550.3846153846154, 103, 1538, 441.0, 1357.9999999999998, 1538.0, 1538.0, 0.08799837541460773, 0.016671567217220608, 0.05948748350030461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 132.0, 100, 306, 103.0, 306.0, 306.0, 306.0, 0.1182941976696043, 0.04434382102932851, 0.06675502644720276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 103.21428571428571, 101, 104, 103.5, 104.0, 104.0, 104.0, 0.11829219862950038, 0.08791051089555643, 0.059377138765198435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 195.64285714285714, 100, 595, 104.5, 451.0, 595.0, 595.0, 0.11829719635644635, 2.5141289893617023, 0.06893518264242138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 217.92857142857144, 101, 1108, 104.0, 707.0, 1108.0, 1108.0, 0.11829519721499307, 7.632622976835266, 0.06881849503160171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e67e85e9-2c10-4ee4-9c0e-93ee06420106", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 272.0769230769231, 101, 481, 281.0, 437.79999999999995, 481.0, 481.0, 0.08648965118058374, 0.1875328494348234, 0.05590771096821839], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d7318b3e-aeda-4aa7-9f45-d1b22f2c07ea", 3, 0, 0.0, 442.33333333333337, 192, 762, 373.0, 762.0, 762.0, 762.0, 0.02015329943100518, 0.0238205176542903, 0.012923828085638087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 103.4705882352941, 101, 106, 103.0, 105.2, 106.0, 106.0, 0.10531858873091102, 0.07826899025803055, 0.05286499473407057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 708.6666666666667, 605, 821, 706.5, 821.0, 821.0, 821.0, 0.03097173828881146, 9.10671941540844, 0.017663569492837785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 126.64705882352939, 101, 304, 103.0, 304.0, 304.0, 304.0, 0.10531924120584335, 0.037486099408973204, 0.05954457559443419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1049.6666666666667, 703, 1233, 1128.5, 1233.0, 1233.0, 1233.0, 0.030908557034014864, 27.811573950654488, 0.017597352295733074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 206.0, 101, 318, 204.5, 318.0, 318.0, 318.0, 0.031084861672365557, 0.055005634131178115, 0.01721202789866335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28c08d72-12b9-436c-8ea2-e5d70f7677db", 3, 0, 0.0, 368.3333333333333, 199, 573, 333.0, 573.0, 573.0, 573.0, 0.02497772819236181, 0.029522829123198483, 0.016017618665023686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 117.60000000000001, 102, 304, 104.0, 188.20000000000007, 304.0, 304.0, 0.08185270877897587, 0.06082999158281312, 0.04108622296132187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 142.6, 101, 304, 103.0, 303.4, 304.0, 304.0, 0.0818540487740992, 0.030098415851309394, 0.04622408978297764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 235.86666666666662, 100, 1100, 103.0, 623.6000000000004, 1100.0, 1100.0, 0.08176570310328099, 4.9254307434274, 0.04760084096025642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 203.26666666666668, 102, 599, 104.0, 422.60000000000014, 599.0, 599.0, 0.08185360210418326, 1.62510308438015, 0.0477319475291126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 138.33333333333334, 104, 306, 105.0, 306.0, 306.0, 306.0, 0.03108405646936925, 0.02310055368475586, 0.017454426240124336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 589.2380952380952, 101, 1322, 301.0, 1317.4, 1321.9, 1322.0, 0.10510826150935464, 40.549016463519926, 0.05792098674134358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 173.11764705882354, 100, 1103, 102.0, 465.3999999999994, 1103.0, 1103.0, 0.10531989368886026, 5.601248089140899, 0.06138417057486076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 390.57142857142856, 101, 909, 108.0, 813.4, 899.4999999999999, 909.0, 0.10510931368623369, 13.26145793187415, 0.058024212368363096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 174.7058823529412, 99, 822, 103.0, 491.5999999999997, 822.0, 822.0, 0.10532119867914827, 1.8483604161116651, 0.06148778390258409], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 727.3846153846154, 111, 3416, 432.0, 2487.199999999999, 3416.0, 3416.0, 0.08771278784975474, 0.016617461760598064, 0.05999285857662386], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 394.93333333333334, 206, 1203, 407.0, 845.4000000000002, 1203.0, 1203.0, 0.08171848526615712, 6.635785733450645, 0.18239289260284272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0bfd67f-8401-41ad-9a14-0ca69de77587", 1, 0, 0.0, 914.0, 914, 914, 914.0, 914.0, 914.0, 914.0, 1.0940919037199124, 0.19766308807439825, 0.7543250820568927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28c08d72-12b9-436c-8ea2-e5d70f7677db", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4169a611-bade-4f50-aaf8-b956ad900084", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec1ac6ef-41e1-40d5-b908-fd5046904f2c", 3, 0, 0.0, 346.3333333333333, 212, 521, 306.0, 521.0, 521.0, 521.0, 0.036519897257355716, 0.02968430450898998, 0.023419335155270428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/794ff6b2-41c9-4fdc-9a3f-8e0c4a39c7eb", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 530.7727272727271, 108, 977, 631.5, 954.5999999999999, 976.25, 977.0, 0.0955499769811419, 0.05869231984486158, 0.04320277279518428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 106.8095238095238, 102, 145, 104.0, 126.60000000000002, 143.7, 145.0, 0.10521411071530565, 0.07819134595151132, 0.052812551667643655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 151.52380952380955, 101, 312, 103.0, 307.8, 311.6, 312.0, 0.10521569216894634, 0.0958801480535097, 0.05621876409138735], "isController": false}, {"data": ["login", 22, 0, 0.0, 2733.318181818182, 1507, 4015, 2681.5, 3832.4, 3989.4999999999995, 4015.0, 0.09345040119956333, 30.618156151903626, 0.18325869248021612], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 123.82352941176471, 103, 309, 106.0, 199.3999999999999, 309.0, 309.0, 0.10425802020152462, 0.0844041979951796, 0.03706046811851071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f94fd8c-af62-4f42-904e-457a2cc85a14", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 697.4761904761906, 204, 1428, 407.0, 1422.6, 1427.8, 1428.0, 0.10505252626313157, 53.9556106178089, 0.2247461621435718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a6d5069-f97a-4cb9-90b3-7cd794f4f2e6", 3, 0, 0.0, 358.3333333333333, 207, 481, 387.0, 481.0, 481.0, 481.0, 0.017719604970939846, 0.024427905941383547, 0.011363158135661296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48693d44-bf95-4ab6-83eb-645021a7a5f7", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 0.9765625, 1.8247085244648318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 916.625, 101, 1423, 1126.5, 1423.0, 1423.0, 1423.0, 0.04118913018854324, 36.96014485058643, 0.0764804515744545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 365.78571428571433, 205, 1211, 307.5, 811.5, 1211.0, 1211.0, 0.11818933932159319, 10.269768156309622, 0.2636506048761545], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1169.9565217391307, 179, 2253, 1091.0, 2240.4, 2251.6, 2253.0, 0.09702226028119582, 0.030418324130279804, 0.04377371508780514], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e67e85e9-2c10-4ee4-9c0e-93ee06420106", 3, 0, 0.0, 907.3333333333334, 206, 1266, 1250.0, 1266.0, 1266.0, 1266.0, 0.061814885024313856, 0.02796962571087118, 0.0396404047844721], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 125.0, 104, 316, 107.0, 230.39999999999992, 316.0, 316.0, 0.08990095030592765, 0.06979614794259031, 0.031956978429060215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 331.94117647058823, 205, 1206, 209.0, 650.7999999999995, 1206.0, 1206.0, 0.10525077545056619, 7.560376991251803, 0.2351273785901349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93800acb-15cc-4aeb-be1e-f033458f8a26", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 383.6, 207, 1023, 409.0, 656.4000000000002, 1023.0, 1023.0, 0.08789045333895831, 7.136968024720654, 0.19616851639449923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0258b088-9b65-4447-b408-1a8963a4a56c", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 104.9, 101, 112, 103.0, 111.9, 112.0, 112.0, 0.06926454901852135, 0.05147492363583471, 0.03476755683156247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 104.2, 101, 113, 102.0, 112.5, 113.0, 113.0, 0.06926358951626309, 0.018533421413531335, 0.03950189089599379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 104.39999999999999, 100, 114, 102.5, 113.5, 114.0, 114.0, 0.06926310977510268, 0.018668572556570645, 0.040719132895128726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 103.9, 100, 111, 103.0, 110.8, 111.0, 111.0, 0.06926454901852135, 0.01866896047764833, 0.040787620173992546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 2.656953828828829, 5.569045608108108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f94fd8c-af62-4f42-904e-457a2cc85a14", 3, 0, 0.0, 764.3333333333334, 203, 1882, 208.0, 1882.0, 1882.0, 1882.0, 0.07895983576354161, 0.03572726943727957, 0.050635050929094066], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1168.5964912280701, 799, 1741, 1104.0, 1622.0, 1650.8999999999996, 1741.0, 0.2526886963923147, 302.3035296898135, 0.4989614688527933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e47ff1ed-7d68-457c-9f1d-d0f8802ed412", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1169.9565217391307, 179, 2253, 1091.0, 2240.4, 2251.6, 2253.0, 0.09807349542465824, 0.030747906344075933, 0.044248002818546975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 102.0, 101, 103, 102.0, 103.0, 103.0, 103.0, 0.02050199125590073, 0.005525927330691993, 0.012072949929011855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 153.0, 102, 305, 102.5, 305.0, 305.0, 305.0, 0.020480576733040802, 0.0055201554475774045, 0.012040339055947816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 173.64705882352942, 101, 900, 103.0, 425.59999999999957, 900.0, 900.0, 0.0907348993109485, 4.825571538130007, 0.05288351840584119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 167.88235294117644, 101, 801, 104.0, 404.19999999999965, 801.0, 801.0, 0.0907353835971776, 1.5923830480950907, 0.052972409438081104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 117.70588235294117, 102, 308, 104.0, 157.59999999999985, 308.0, 308.0, 0.09073393075399896, 0.06743019658573557, 0.045544180085503386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 102.0, 101, 103, 102.0, 103.0, 103.0, 103.0, 0.02050199125590073, 0.005485884379020312, 0.011692541888130884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 114.94117647058823, 100, 309, 103.0, 148.19999999999987, 309.0, 309.0, 0.0907353835971776, 0.03229529163419763, 0.051299267311777454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 111.5, 103, 126, 108.5, 126.0, 126.0, 126.0, 0.020500520200700093, 0.015235249875715597, 0.01029030017886704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 114.0, 104, 139, 106.5, 139.0, 139.0, 139.0, 0.020336570237429456, 0.016007105089226703, 0.007229015201586253], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 676.2307692307692, 102, 1882, 521.0, 1635.6, 1882.0, 1882.0, 0.08679744147849426, 0.016261479796226313, 0.059073378890862234], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1569.8181818181818, 878, 2539, 1385.5, 2368.3999999999996, 2525.2, 2539.0, 0.0943719972546328, 0.048844881391557994, 0.04340743233098833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 266.0, 207, 409, 224.0, 409.0, 409.0, 409.0, 0.020468419786821408, 0.031722052931333566, 0.0460339558291501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11763dc8-58d9-4b33-a89e-8a68d1e4e1d4", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["addBook", 56, 9, 16.071428571428573, 1056.2142857142853, 526, 3457, 847.0, 1860.3000000000002, 1941.9499999999998, 3457.0, 0.2938753233940501, 89.00264053209801, 1.0692082536327714], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/df808b43-1771-4d4c-afae-0547d9b11f45", 3, 0, 0.0, 354.6666666666667, 303, 407, 354.0, 407.0, 407.0, 407.0, 0.046233510048082856, 0.030265491115460483, 0.029648442315990627], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 196.87719298245608, 101, 438, 104.0, 414.6, 422.2, 438.0, 0.2538116272442291, 0.188623680012557, 0.12269214402919279], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7318b3e-aeda-4aa7-9f45-d1b22f2c07ea", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 672.0000000000001, 499, 942, 606.0, 846.6000000000003, 915.1, 942.0, 0.2534076662487663, 74.5102678035557, 0.12744623839659633], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 160.4035087719298, 100, 421, 105.0, 308.2, 312.29999999999995, 421.0, 0.2542089419110269, 0.44983066674099675, 0.12362895807782362], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 969.4385964912282, 696, 1320, 995.0, 1214.2, 1309.1, 1320.0, 0.2531971695221681, 227.82725820919637, 0.12709311048280703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 119.6, 102, 315, 106.0, 192.00000000000006, 315.0, 315.0, 0.09347891115764284, 0.06983531937069998, 0.033228831700568354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 9, 5.325443786982248, 171.15976331360955, 103, 2228, 108.0, 308.0, 349.0, 1090.5000000000184, 0.7521641409083829, 1.6336760353383626, 0.35932684230144424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 153.3, 103, 366, 106.0, 360.1, 366.0, 366.0, 0.07287142565657154, 0.0564326567828723, 0.025903514588859415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0bfd67f-8401-41ad-9a14-0ca69de77587", 3, 0, 0.0, 456.66666666666663, 281, 799, 290.0, 799.0, 799.0, 799.0, 0.02129668410628465, 0.02517195963213528, 0.013657053284303635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 110.42857142857143, 103, 140, 106.0, 132.5, 140.0, 140.0, 0.11189616036318296, 0.09080635670098149, 0.03977558825410019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 210.7, 204, 220, 209.0, 219.9, 220.0, 220.0, 0.06920942078635745, 0.10726108475385669, 0.15565360944431755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 304.6470588235294, 205, 1209, 212.0, 570.5999999999995, 1209.0, 1209.0, 0.09068407800964452, 6.514021525466223, 0.20258577146812187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a6d5069-f97a-4cb9-90b3-7cd794f4f2e6", 1, 0, 0.0, 3416.0, 3416, 3416, 3416.0, 3416.0, 3416.0, 3416.0, 0.2927400468384075, 0.05288760611826698, 0.20183054010538642], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 107.86666666666666, 103, 131, 105.0, 122.60000000000001, 131.0, 131.0, 0.08531112968997936, 0.07073159092460203, 0.03032544063198485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93800acb-15cc-4aeb-be1e-f033458f8a26", 3, 0, 0.0, 427.66666666666663, 191, 791, 301.0, 791.0, 791.0, 791.0, 0.020112495893698755, 0.02377228925456386, 0.012897661754748225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec1ac6ef-41e1-40d5-b908-fd5046904f2c", 1, 0, 0.0, 954.0, 954, 954, 954.0, 954.0, 954.0, 954.0, 1.0482180293501049, 0.1893753275681342, 0.7226971960167715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 108.80952380952381, 102, 132, 107.0, 113.6, 130.2, 132.0, 0.10315456483510006, 0.08008581937881304, 0.03666822421872697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0258b088-9b65-4447-b408-1a8963a4a56c", 3, 0, 0.0, 377.6666666666667, 204, 469, 460.0, 469.0, 469.0, 469.0, 0.028247523633761443, 0.028330280050657228, 0.018114460142744152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4169a611-bade-4f50-aaf8-b956ad900084", 3, 0, 0.0, 368.3333333333333, 205, 488, 412.0, 488.0, 488.0, 488.0, 0.04972815276488529, 0.03197041071310171, 0.031889472964460944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 104.26666666666668, 101, 109, 104.0, 109.0, 109.0, 109.0, 0.08804832091852008, 0.06543434787011113, 0.04419612983605403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 196.26666666666668, 100, 306, 106.0, 305.4, 306.0, 306.0, 0.08794713790697538, 0.03233889550121074, 0.04966493972689483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e865690-1fc6-41e5-ad89-66377ca493d3", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.2005110432330826, 2.2431567199248117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 237.8, 101, 914, 105.0, 550.4000000000002, 914.0, 914.0, 0.08805142203046579, 5.3040720572481, 0.051260144257579764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 193.06666666666666, 101, 848, 103.0, 524.0000000000002, 848.0, 848.0, 0.08805193890369466, 1.74816347502847, 0.051346433382838085], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 35.0, 0.5397070161912105], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.07710100231303008], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07710100231303008], "isController": false}, {"data": ["401/Unauthorized", 11, 55.0, 0.8481110254433307], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1297, 20, "401/Unauthorized", 11, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
