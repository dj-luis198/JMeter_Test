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

    var data = {"OkPercent": 99.31766489764973, "KoPercent": 0.6823351023502654};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8283387622149837, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36607142857142855, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/14955919-0125-483a-83dd-7d9c3ab688f0"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=007039f8-809d-4433-8ac1-ac9744beab94"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ac716f6-96a1-4a3a-923c-9815f0321aa7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=128b3e75-4489-4e33-a614-a931082ce97c"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7891974c-8fcc-45b2-8424-c285a3336e47"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eebac354-046c-44bf-a983-5713fbd323ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6d1dcc1-ea13-43e8-9cb3-15fd0108786b"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5f01848-9a30-4cf9-9acc-562a5131c5cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b072ba1-de7a-4ae1-999f-398979468898"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebb71d39-d2a3-4ebe-828e-0ca07b8f4db5"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9efab3c1-78ac-4697-a381-7e7906e1b110"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c01f2329-9b09-45eb-90d6-dcc16d5a02d2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97e2ceab-8780-476a-8526-93fd561811e3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eebac354-046c-44bf-a983-5713fbd323ce"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee078591-6492-43f2-9e40-910ee32c4a52"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d72e6c0-207f-4b8a-b787-2f4fd5c050a6"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ac716f6-96a1-4a3a-923c-9815f0321aa7"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14955919-0125-483a-83dd-7d9c3ab688f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5f01848-9a30-4cf9-9acc-562a5131c5cd"], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee078591-6492-43f2-9e40-910ee32c4a52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/128b3e75-4489-4e33-a614-a931082ce97c"], "isController": false}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1b072ba1-de7a-4ae1-999f-398979468898"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9d603eb-a340-4fcc-b677-73a43ba0b902"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b3764af-03cb-4ffd-acf5-73d8d2dc178e"], "isController": false}, {"data": [0.38524590163934425, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7946428571428571, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9606741573033708, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebb71d39-d2a3-4ebe-828e-0ca07b8f4db5"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92e75aad-9f00-405f-a675-ce09d7f92d84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/007039f8-809d-4433-8ac1-ac9744beab94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97e2ceab-8780-476a-8526-93fd561811e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7891974c-8fcc-45b2-8424-c285a3336e47"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d72e6c0-207f-4b8a-b787-2f4fd5c050a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9efab3c1-78ac-4697-a381-7e7906e1b110"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1319, 9, 0.6823351023502654, 310.56482183472303, 81, 1826, 100.0, 846.0, 1057.0, 1425.7999999999986, 5.101014788688819, 715.8226691572303, 3.7198512538383297], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1418.0000000000002, 1007, 2131, 1376.5, 1723.3000000000002, 1823.3, 2131.0, 0.24433129578484886, 294.0124754850631, 1.2013750725358534], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/14955919-0125-483a-83dd-7d9c3ab688f0", 3, 0, 0.0, 474.33333333333337, 181, 936, 306.0, 936.0, 936.0, 936.0, 0.03933910306845004, 0.02493269325334382, 0.02522722429845266], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 519.9230769230769, 388, 767, 473.0, 754.6, 767.0, 767.0, 0.0796241738991958, 0.014385226729835178, 0.05411955569710964], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 519.9230769230769, 388, 767, 473.0, 754.6, 767.0, 767.0, 0.07741505186808476, 0.013986117769136407, 0.052618043066588856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=007039f8-809d-4433-8ac1-ac9744beab94", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ac716f6-96a1-4a3a-923c-9815f0321aa7", 1, 0, 0.0, 843.0, 843, 843, 843.0, 843.0, 843.0, 843.0, 1.1862396204033216, 0.21431086892052195, 0.8178566132858838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 116.00000000000001, 82, 297, 84.0, 256.99999999999994, 297.0, 297.0, 0.11011575108658336, 0.05865080675981164, 0.06116838884462667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 85.88235294117646, 83, 91, 86.0, 89.4, 91.0, 91.0, 0.11011147167220461, 0.08183088861576926, 0.05527079730421208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 193.58823529411765, 82, 672, 85.0, 646.4, 672.0, 672.0, 0.11011147167220461, 5.73792852389095, 0.06317114358859763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=128b3e75-4489-4e33-a614-a931082ce97c", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 252.47058823529412, 82, 1147, 84.0, 1075.0, 1147.0, 1147.0, 0.11011575108658336, 17.50956200447912, 0.06306606378292946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7891974c-8fcc-45b2-8424-c285a3336e47", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eebac354-046c-44bf-a983-5713fbd323ce", 3, 0, 0.0, 484.33333333333337, 164, 948, 341.0, 948.0, 948.0, 948.0, 0.03635922918434129, 0.029956122742697853, 0.02331630256938553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6d1dcc1-ea13-43e8-9cb3-15fd0108786b", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 288.93333333333334, 164, 1496, 185.0, 758.0000000000005, 1496.0, 1496.0, 0.08058840279158228, 0.17047909973352102, 0.05209914321096432], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a5f01848-9a30-4cf9-9acc-562a5131c5cd", 3, 0, 0.0, 314.0, 181, 471, 290.0, 471.0, 471.0, 471.0, 0.022140058006951978, 0.02616879903100346, 0.014197888760968553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 105.87499999999999, 82, 253, 85.0, 250.2, 253.0, 253.0, 0.0823002931947945, 0.06116262023558459, 0.04131088935754334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 136.4375, 81, 257, 85.5, 254.9, 257.0, 257.0, 0.0823007165306133, 0.029747610064348874, 0.046505129006373165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 651.0, 485, 778, 670.5, 778.0, 778.0, 778.0, 0.05709391949757351, 16.78750802883243, 0.03256137596345989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 959.0, 741, 1171, 962.0, 1171.0, 1171.0, 1171.0, 0.0570279864843672, 51.3138824831411, 0.032468082148814525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 168.5, 82, 256, 168.0, 256.0, 256.0, 256.0, 0.057430007178750894, 0.10162419239052405, 0.03179962311557789], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b072ba1-de7a-4ae1-999f-398979468898", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 113.16666666666666, 84, 252, 85.0, 249.3, 252.0, 252.0, 0.08182710841182675, 0.060810966309961086, 0.04107337277703022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 102.22222222222221, 82, 246, 84.0, 246.0, 246.0, 246.0, 0.08182822437299123, 0.021895442849804294, 0.046667659212721556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 129.94444444444446, 82, 250, 86.5, 247.3, 250.0, 250.0, 0.08176800599632045, 0.022039032866195744, 0.04807064415018057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 121.0, 82, 256, 84.0, 254.2, 256.0, 256.0, 0.08176392030743233, 0.022037931645362625, 0.04814808979041182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 85.25, 83, 87, 85.5, 87.0, 87.0, 87.0, 0.05756472433692633, 0.0427800343949228, 0.032323941888410784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 773.2307692307692, 82, 1077, 944.0, 1075.0, 1077.0, 1077.0, 0.06033322504292941, 41.76370804230287, 0.03148096312711746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 136.18749999999997, 81, 730, 84.5, 391.9000000000003, 730.0, 730.0, 0.08229859989506928, 4.649072219914719, 0.04794054183340706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 525.6153846153846, 81, 829, 590.0, 773.8, 829.0, 829.0, 0.06033406507725081, 13.650074605392009, 0.0315403214297317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 160.875, 82, 659, 84.5, 372.0000000000003, 659.0, 659.0, 0.08223092499511753, 1.5319424582678054, 0.04798142352010032], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 629.0, 191, 1615, 517.0, 1331.3999999999996, 1615.0, 1615.0, 0.07721870118144612, 0.013950644256413607, 0.05323867483798922], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 263.3333333333333, 168, 504, 175.0, 500.4, 504.0, 504.0, 0.08173162060181716, 0.1266680487256678, 0.18381633031834466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebb71d39-d2a3-4ebe-828e-0ca07b8f4db5", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 604.2272727272727, 86, 1185, 662.5, 1055.3999999999999, 1168.7999999999997, 1185.0, 0.0940162904590559, 0.0577502409167443, 0.04250931883060828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 96.92307692307692, 83, 246, 83.0, 182.79999999999995, 246.0, 246.0, 0.06033322504292941, 0.044837484626630154, 0.030284450851626676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 193.0, 81, 340, 246.0, 309.2, 340.0, 340.0, 0.06033378506321124, 0.08585055263426589, 0.030511346232387177], "isController": false}, {"data": ["login", 22, 0, 0.0, 2252.409090909091, 1382, 3519, 2240.0, 3287.7999999999997, 3503.85, 3519.0, 0.0913761666036725, 20.003235806581575, 0.16541649620165888], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9efab3c1-78ac-4697-a381-7e7906e1b110", 3, 0, 0.0, 292.3333333333333, 199, 412, 266.0, 412.0, 412.0, 412.0, 0.048982790712862885, 0.031491214732390686, 0.03141149013813147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 90.3125, 85, 117, 88.5, 100.20000000000002, 117.0, 117.0, 0.082608785444332, 0.06687762024741331, 0.02936484170091489], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c01f2329-9b09-45eb-90d6-dcc16d5a02d2", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97e2ceab-8780-476a-8526-93fd561811e3", 1, 0, 0.0, 906.0, 906, 906, 906.0, 906.0, 906.0, 906.0, 1.1037527593818985, 0.19940845750551875, 0.7609857891832229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eebac354-046c-44bf-a983-5713fbd323ce", 1, 0, 0.0, 770.0, 770, 770, 770.0, 770.0, 770.0, 770.0, 1.2987012987012987, 0.2346286525974026, 0.8953936688311688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 883.9999999999999, 167, 1166, 1033.0, 1163.2, 1166.0, 1166.0, 0.0603097135752526, 55.52263459069421, 0.1237681088613526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee078591-6492-43f2-9e40-910ee32c4a52", 3, 0, 0.0, 679.6666666666666, 179, 1496, 364.0, 1496.0, 1496.0, 1496.0, 0.015268341094740056, 0.021048640799552126, 0.009791221340051403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 369.4117647058824, 167, 1233, 178.0, 1161.8, 1233.0, 1233.0, 0.11004732034774953, 23.3736639567514, 0.24253018411887697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1044.5, 828, 1255, 1047.5, 1255.0, 1255.0, 1255.0, 0.05695733895312411, 68.14077896280686, 0.12843212465113632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d72e6c0-207f-4b8a-b787-2f4fd5c050a6", 3, 0, 0.0, 400.6666666666667, 264, 470, 468.0, 470.0, 470.0, 470.0, 0.05891941787615138, 0.0378795085629554, 0.0377836110729226], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 957.2608695652176, 487, 1458, 1004.0, 1355.2, 1441.1999999999998, 1458.0, 0.09000054782942157, 0.0286295900279393, 0.04060571591522731], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4ac716f6-96a1-4a3a-923c-9815f0321aa7", 3, 0, 0.0, 300.6666666666667, 177, 417, 308.0, 417.0, 417.0, 417.0, 0.015570664867389837, 0.021465418526496083, 0.00998509433227799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 296.43749999999994, 169, 814, 188.0, 594.9000000000002, 814.0, 814.0, 0.08219459570533237, 6.265255967135005, 0.18354318105928286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 98.0625, 84, 250, 87.5, 138.7000000000001, 250.0, 250.0, 0.08669079560477666, 0.06730388916581782, 0.030815868750135457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 23, 0, 0.0, 278.1304347826087, 167, 975, 184.0, 500.6, 880.1999999999987, 975.0, 0.1010989010989011, 5.408542239010989, 0.2262491414835165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14955919-0125-483a-83dd-7d9c3ab688f0", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.29520271650326796, 1.1265573937908497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 103.29999999999998, 83, 255, 87.0, 238.40000000000006, 255.0, 255.0, 0.049179924754715124, 0.036548752674158407, 0.024686016917894113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 100.4, 82, 247, 84.5, 230.90000000000006, 247.0, 247.0, 0.04918161787850173, 0.01315992509639597, 0.02804889144633302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 118.4, 82, 257, 86.0, 255.6, 257.0, 257.0, 0.04918065036492043, 0.01325572216866996, 0.028912843280939547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 117.8, 81, 253, 85.0, 252.3, 253.0, 253.0, 0.04918210164956769, 0.013256113335235041, 0.028961725873720038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5f01848-9a30-4cf9-9acc-562a5131c5cd", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 963.6607142857142, 654, 1756, 899.0, 1363.6000000000001, 1472.3999999999999, 1756.0, 0.24300598402235654, 290.71963943987123, 0.47984189423164547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 957.2608695652176, 487, 1458, 1004.0, 1355.2, 1441.1999999999998, 1458.0, 0.0889487036693274, 0.028294993541550646, 0.04013115341330982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 85.25, 83, 90, 84.0, 90.0, 90.0, 90.0, 0.025298042563956614, 0.00681861303481643, 0.014897187173892419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 129.75, 85, 245, 94.5, 245.0, 245.0, 245.0, 0.02527230913088529, 0.006811677070433925, 0.014857353610149358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 213.3125, 83, 983, 86.0, 927.7, 983.0, 983.0, 0.08853915921000935, 9.979342448024745, 0.051100237395620626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 168.4375, 82, 699, 85.0, 549.9000000000001, 699.0, 699.0, 0.0885396491616402, 3.2750807578440595, 0.05118698467157324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 127.75000000000001, 82, 255, 87.5, 250.8, 255.0, 255.0, 0.08845839138415268, 0.0657390975032619, 0.04440196598774851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 89.75, 82, 96, 90.5, 96.0, 96.0, 96.0, 0.025298362563483077, 0.006769288420306996, 0.014427972399486443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 126.18749999999999, 82, 257, 85.0, 252.1, 257.0, 257.0, 0.08853866926380097, 0.04031362748461641, 0.04956522671432999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 86.0, 85, 88, 85.5, 88.0, 88.0, 88.0, 0.025297882567229122, 0.01880047718130992, 0.01269835121050368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee078591-6492-43f2-9e40-910ee32c4a52", 1, 0, 0.0, 1615.0, 1615, 1615, 1615.0, 1615.0, 1615.0, 1615.0, 0.6191950464396285, 0.11186629256965944, 0.426905959752322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 94.25, 87, 108, 91.0, 108.0, 108.0, 108.0, 0.026301427509978104, 0.020702100168986673, 0.009349335560187529], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 532.8461538461538, 364, 948, 462.0, 943.2, 948.0, 948.0, 0.07688622612830537, 0.013890577962633295, 0.052333691026785985], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/128b3e75-4489-4e33-a614-a931082ce97c", 3, 0, 0.0, 408.66666666666663, 240, 717, 269.0, 717.0, 717.0, 717.0, 0.020071588666242934, 0.027670305339042585, 0.012871428929849797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1220.0454545454545, 905, 1751, 1148.5, 1560.7, 1724.7499999999995, 1751.0, 0.0925298934644454, 0.047891448765777396, 0.04256013654468142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 218.0, 173, 331, 184.0, 331.0, 331.0, 331.0, 0.025258584761495815, 0.039145873062982284, 0.056807149126684435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b072ba1-de7a-4ae1-999f-398979468898", 3, 0, 0.0, 530.0, 258, 931, 401.0, 931.0, 931.0, 931.0, 0.0595214475616047, 0.02693190498392921, 0.03816967828657593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9d603eb-a340-4fcc-b677-73a43ba0b902", 2, 0, 0.0, 190.5, 171, 210, 190.5, 210.0, 210.0, 210.0, 0.08552856654122476, 0.050323204434656175, 0.053163020120595275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b3764af-03cb-4ffd-acf5-73d8d2dc178e", 2, 0, 0.0, 179.0, 178, 180, 179.0, 180.0, 180.0, 180.0, 0.021989379129880266, 0.02501721356085011, 0.013668202945477334], "isController": false}, {"data": ["addBook", 61, 5, 8.19672131147541, 943.7213114754101, 450, 3151, 729.0, 1664.8000000000002, 1693.4, 3151.0, 0.2815328308818439, 94.94534267968487, 1.022661337638632], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 152.0714285714286, 82, 479, 88.0, 338.0, 363.84999999999985, 479.0, 0.24389394097766628, 0.1812532119960977, 0.1178979499843211], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 531.3571428571428, 406, 803, 491.5, 666.8000000000001, 741.9499999999999, 803.0, 0.243727286575414, 71.6639147607338, 0.12257768807259592], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 126.92857142857139, 81, 374, 86.5, 252.9, 337.25, 374.0, 0.24420556875913044, 0.4321293853433051, 0.11876403636918649], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 810.0535714285716, 564, 1307, 793.5, 1036.6, 1100.3999999999999, 1307.0, 0.24340523929777588, 219.01646218091096, 0.12217802050689142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 23, 0, 0.0, 100.39130434782608, 85, 254, 89.0, 117.4, 226.9999999999996, 254.0, 0.10368113093574474, 0.07745709488852025, 0.03685540201231551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 5, 2.808988764044944, 160.60674157303362, 84, 1826, 93.0, 271.29999999999995, 367.5999999999998, 1799.9300000000003, 0.7176117236791711, 1.5241493164042816, 0.34662466739906067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 89.4, 87, 93, 89.5, 92.8, 93.0, 93.0, 0.05207628133690229, 0.04032860459000343, 0.018511490631476987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 117.94117647058823, 83, 400, 90.0, 277.5999999999999, 400.0, 400.0, 0.10253626466419373, 0.08321058196869628, 0.03644843782985012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebb71d39-d2a3-4ebe-828e-0ca07b8f4db5", 3, 0, 0.0, 264.0, 174, 441, 177.0, 441.0, 441.0, 441.0, 0.033227742950180536, 0.033325089853354896, 0.021308155472609263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 240.4, 169, 503, 175.5, 487.00000000000006, 503.0, 503.0, 0.04915913302952989, 0.0761870548026015, 0.11056004235059311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 373.4375, 171, 1238, 181.0, 1179.2, 1238.0, 1238.0, 0.08841684119782717, 13.342060323080663, 0.19602376340758504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92e75aad-9f00-405f-a675-ce09d7f92d84", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/007039f8-809d-4433-8ac1-ac9744beab94", 3, 0, 0.0, 283.3333333333333, 167, 475, 208.0, 475.0, 475.0, 475.0, 0.049888582166494826, 0.03207355136029534, 0.03199235249609206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97e2ceab-8780-476a-8526-93fd561811e3", 3, 0, 0.0, 259.6666666666667, 178, 415, 186.0, 415.0, 415.0, 415.0, 0.03781290176208122, 0.03073529156898334, 0.024248507965917973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7891974c-8fcc-45b2-8424-c285a3336e47", 3, 0, 0.0, 319.6666666666667, 185, 462, 312.0, 462.0, 462.0, 462.0, 0.03971616183012074, 0.033109729963196353, 0.025469023048612583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d72e6c0-207f-4b8a-b787-2f4fd5c050a6", 1, 0, 0.0, 715.0, 715, 715, 715.0, 715.0, 715.0, 715.0, 1.3986013986013985, 0.2526770104895105, 0.9642701048951049], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 98.61111111111111, 85, 257, 88.0, 117.50000000000023, 257.0, 257.0, 0.08238928939237898, 0.0683090885684861, 0.02928681771369722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9efab3c1-78ac-4697-a381-7e7906e1b110", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 88.07692307692307, 85, 100, 87.0, 98.0, 100.0, 100.0, 0.06012200141517942, 0.04667674914557386, 0.02137149269055206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 23, 0, 0.0, 101.73913043478262, 82, 248, 85.0, 196.2000000000002, 247.8, 248.0, 0.10113757788692819, 0.07516181325385972, 0.0507663232752745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 23, 0, 0.0, 132.65217391304353, 81, 357, 85.0, 252.0, 336.3999999999997, 357.0, 0.10113757788692819, 0.03366672089986061, 0.057310721572645364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 23, 0, 0.0, 148.3913043478261, 82, 855, 85.0, 254.2, 734.9999999999983, 855.0, 0.10113668843304092, 3.9827251734164415, 0.059079422531495285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 23, 0, 0.0, 133.26086956521738, 82, 499, 85.0, 257.8, 451.3999999999993, 499.0, 0.10113757788692819, 1.3190226179901765, 0.05917870927563507], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 44.44444444444444, 0.3032600454890068], "isController": false}, {"data": ["401/Unauthorized", 5, 55.55555555555556, 0.37907505686125853], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1319, 9, "401/Unauthorized", 5, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
