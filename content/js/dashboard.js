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

    var data = {"OkPercent": 98.55732725892179, "KoPercent": 1.442672741078208};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7744904667981591, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.044642857142857144, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84a57aa4-4775-434c-ba10-00c1e09bb6b0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5156442f-ee48-4e7e-babd-b27f92353ecd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c60aeebb-67cb-4335-ab0f-8e5e97ca59df"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef269baa-fe53-4093-ab72-94460be93017"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/10630f79-a589-45cc-a5e8-25cadeab94ac"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7925d3fa-d824-40d9-92e1-4852811bbbd3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3adbf815-a97d-45ac-b943-b666f185324b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc2c1b0a-5a91-404b-98d7-3b079e67e07b"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/84a57aa4-4775-434c-ba10-00c1e09bb6b0"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b2f4823-0648-4083-b4d2-a3da9ff37ff1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5156442f-ee48-4e7e-babd-b27f92353ecd"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b96236c7-273d-44c2-89f1-a622961471ab"], "isController": false}, {"data": [0.3, 500, 1500, "register"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40e7dd42-1194-438c-868a-c9f769dbbc4a"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5d87bbc3-20dd-43e1-b413-6a7e39ba9c52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3482142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.15, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c60aeebb-67cb-4335-ab0f-8e5e97ca59df"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5089285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9120879120879121, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7925d3fa-d824-40d9-92e1-4852811bbbd3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27727203-4424-4027-8289-030e340d8823"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4b2f4823-0648-4083-b4d2-a3da9ff37ff1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b96236c7-273d-44c2-89f1-a622961471ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7291ff24-31d3-44e5-b112-3c3ff82ecd62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10630f79-a589-45cc-a5e8-25cadeab94ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d87bbc3-20dd-43e1-b413-6a7e39ba9c52"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3adbf815-a97d-45ac-b943-b666f185324b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/484c4704-f119-4816-88c1-036f1680a4a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0027a1b-3452-419d-902c-8637c261f566"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dc2c1b0a-5a91-404b-98d7-3b079e67e07b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1317, 19, 1.442672741078208, 396.0151860288541, 100, 4608, 124.0, 1122.4, 1402.3999999999996, 1923.82, 5.108591510506166, 690.1215449670967, 3.7420570699396047], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1853.660714285715, 1300, 2856, 1812.5, 2256.9, 2416.65, 2856.0, 0.2536231884057971, 305.19393257472825, 1.2470632359601448], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84a57aa4-4775-434c-ba10-00c1e09bb6b0", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 0.6948617788461539, 2.6517427884615383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5156442f-ee48-4e7e-babd-b27f92353ecd", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.28009932170542634, 1.0689195736434107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c60aeebb-67cb-4335-ab0f-8e5e97ca59df", 1, 0, 0.0, 1174.0, 1174, 1174, 1174.0, 1174.0, 1174.0, 1174.0, 0.8517887563884157, 0.153887617120954, 0.587268419931857], "isController": false}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 466.4545454545455, 125, 548, 488.0, 545.6, 548.0, 548.0, 0.06834378164783071, 0.013057157147206294, 0.04615510893066834], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 466.4545454545455, 125, 548, 488.0, 545.6, 548.0, 548.0, 0.06828057107386716, 0.013045080695220361, 0.04611242046865301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef269baa-fe53-4093-ab72-94460be93017", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.7257634943181818, 1.3560901988636365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 161.07692307692307, 102, 340, 112.0, 339.6, 340.0, 340.0, 0.08886458404538929, 0.04431213257912366, 0.049532392849818856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 161.69230769230768, 102, 540, 110.0, 462.3999999999999, 540.0, 540.0, 0.08886822892455772, 0.06604367403475432, 0.044607685221897134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 295.6923076923077, 103, 921, 115.0, 895.8, 921.0, 921.0, 0.08886640644759958, 4.040217175825603, 0.051155594396631275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 370.0769230769231, 104, 1256, 320.0, 1246.4, 1256.0, 1256.0, 0.0888651915044877, 12.321967881214583, 0.05106811260586921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10630f79-a589-45cc-a5e8-25cadeab94ac", 3, 0, 0.0, 475.0, 221, 763, 441.0, 763.0, 763.0, 763.0, 0.021765311896919486, 0.025725861815662318, 0.013957573058896933], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 400.50000000000006, 108, 1910, 240.0, 1481.9000000000015, 1910.0, 1910.0, 0.06628296196462699, 0.13627707935175262, 0.04284550511759702], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 111.78947368421053, 103, 118, 112.0, 117.0, 118.0, 118.0, 0.09771651923472537, 0.0726194054078379, 0.04904911219399301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 820.5, 632, 1003, 823.5, 1003.0, 1003.0, 1003.0, 0.021606555428917134, 6.353044701262363, 0.012322488643054304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 136.31578947368422, 102, 357, 114.0, 348.0, 357.0, 357.0, 0.09772305286817161, 0.041598598059940234, 0.054868761797486974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1224.25, 1161, 1275, 1230.5, 1275.0, 1275.0, 1275.0, 0.02153895859135211, 19.380792801949276, 0.012262903182381131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 284.0, 123, 344, 334.5, 344.0, 344.0, 344.0, 0.02164033758926639, 0.038293253624756544, 0.011982491614369184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 124.99999999999997, 102, 340, 113.0, 141.1000000000003, 340.0, 340.0, 0.0899325505870597, 0.06683463964526605, 0.0451419248063952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 146.16666666666666, 103, 323, 114.0, 319.4, 323.0, 323.0, 0.089839636249295, 0.024039121418268392, 0.05123666754842606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 135.94444444444443, 101, 339, 112.0, 327.3, 339.0, 339.0, 0.08993614533681087, 0.024240601672812303, 0.05287261669214858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 170.7222222222222, 102, 339, 114.0, 339.0, 339.0, 339.0, 0.08983201413357023, 0.02421253505943885, 0.05289912551029575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 212.25, 107, 508, 117.0, 508.0, 508.0, 508.0, 0.021667885485225212, 0.016102793802984752, 0.012167025541020017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 661.4736842105264, 106, 1476, 327.0, 1454.0, 1476.0, 1476.0, 0.10158200608422753, 43.31088442006031, 0.055583986265043496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 223.94736842105266, 102, 961, 113.0, 786.0, 961.0, 961.0, 0.09762313359982737, 9.270012983234512, 0.0565086210218573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 479.9473684210528, 103, 1022, 336.0, 956.0, 1022.0, 1022.0, 0.10157711841753542, 14.161957447874899, 0.055680508219727344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 223.36842105263156, 107, 911, 112.0, 811.0, 911.0, 911.0, 0.09771852949042358, 3.048038621963011, 0.05665926866681067], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 484.45454545454544, 117, 1174, 474.0, 1068.2000000000003, 1174.0, 1174.0, 0.06823271076153908, 0.013035936928163362, 0.04660105148158027], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7925d3fa-d824-40d9-92e1-4852811bbbd3", 3, 0, 0.0, 607.0, 436, 916, 469.0, 916.0, 916.0, 916.0, 0.03347840642785403, 0.033576487696685635, 0.021468899955362126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 311.61111111111103, 219, 666, 232.0, 473.4000000000003, 666.0, 666.0, 0.08978048670999407, 0.13914221914918026, 0.20191841884093392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3adbf815-a97d-45ac-b943-b666f185324b", 3, 0, 0.0, 392.33333333333337, 255, 665, 257.0, 665.0, 665.0, 665.0, 0.02080169741850935, 0.024586902124546697, 0.013339630180489396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc2c1b0a-5a91-404b-98d7-3b079e67e07b", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 767.7, 158, 2152, 687.5, 1798.7000000000014, 2137.6, 2152.0, 0.08357709987463435, 0.05133788654408692, 0.037789255119097365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 114.42105263157896, 106, 131, 116.0, 120.0, 131.0, 131.0, 0.10169291949667357, 0.07557452318063339, 0.05104507873172873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 148.1578947368421, 102, 352, 114.0, 337.0, 352.0, 352.0, 0.10169999571789491, 0.0995673066629555, 0.053954942218344536], "isController": false}, {"data": ["login", 20, 0, 0.0, 3527.0999999999995, 1813, 6272, 3342.5, 5545.6, 6237.65, 6272.0, 0.08260776182530111, 19.880122584755565, 0.15203377728121334], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 140.0, 105, 352, 118.0, 345.0, 352.0, 352.0, 0.09704473251407149, 0.07856453442789577, 0.034496369760861345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84a57aa4-4775-434c-ba10-00c1e09bb6b0", 3, 0, 0.0, 659.3333333333334, 212, 984, 782.0, 984.0, 984.0, 984.0, 0.06810751907010534, 0.03081687874591355, 0.043675720237014166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 778.9473684210526, 218, 1593, 446.0, 1573.0, 1593.0, 1593.0, 0.10151036741410353, 57.60781177373339, 0.21599648954443215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b2f4823-0648-4083-b4d2-a3da9ff37ff1", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5156442f-ee48-4e7e-babd-b27f92353ecd", 3, 0, 0.0, 319.3333333333333, 206, 524, 228.0, 524.0, 524.0, 524.0, 0.021336823089287492, 0.025344422998961606, 0.013682793452440221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 994.5, 108, 1669, 1340.0, 1669.0, 1669.0, 1669.0, 0.03228913847197033, 25.75557004455901, 0.0556703847385387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 567.8461538461538, 216, 1797, 436.0, 1617.7999999999997, 1797.0, 1797.0, 0.08879902730911625, 16.46021915642632, 0.19621569924110985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b96236c7-273d-44c2-89f1-a622961471ab", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["register", 20, 4, 20.0, 1261.95, 847, 2097, 1231.5, 1740.8, 2079.2, 2097.0, 0.08365260745177427, 0.02653356142610965, 0.03774170375265597], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 373.3684210526316, 216, 1070, 234.0, 921.0, 1070.0, 1070.0, 0.09756398143203386, 12.421650947846917, 0.2167960325478577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 120.28571428571428, 108, 128, 119.5, 128.0, 128.0, 128.0, 0.12505136038015613, 0.09708577295139076, 0.04445185076013363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40e7dd42-1194-438c-868a-c9f769dbbc4a", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 1.068013168896321, 1.9955842391304348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 307.4, 217, 670, 231.5, 458.8, 659.4499999999998, 670.0, 0.12488448185428479, 0.19354655537377927, 0.28086812667032995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d87bbc3-20dd-43e1-b413-6a7e39ba9c52", 3, 0, 0.0, 864.6666666666666, 216, 1550, 828.0, 1550.0, 1550.0, 1550.0, 0.04895721139723881, 0.03147476969711805, 0.03139508673585953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 146.85714285714286, 109, 347, 115.0, 347.0, 347.0, 347.0, 0.04015119793966996, 0.029838927375086755, 0.020154019278310894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 174.85714285714286, 102, 348, 116.0, 348.0, 348.0, 348.0, 0.04010197358998596, 0.010730410902007962, 0.02287065681303887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 112.71428571428572, 110, 115, 112.0, 115.0, 115.0, 115.0, 0.04015004645933948, 0.010821692209743843, 0.02360383590676012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 143.71428571428572, 107, 346, 110.0, 346.0, 346.0, 346.0, 0.04014958588569986, 0.010821568070755041, 0.023642773719801773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 2.520699786324786, 5.2834535256410255], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1294.8928571428569, 819, 2366, 1213.5, 1788.0000000000002, 1931.1, 2366.0, 0.239105744515512, 286.0535970470441, 0.4721404447366848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 4, 20.0, 1261.95, 847, 2097, 1231.5, 1740.8, 2079.2, 2097.0, 0.0828960566345859, 0.026293592963782714, 0.03740036930193231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 111.22222222222223, 105, 117, 111.0, 117.0, 117.0, 117.0, 0.04287980789846062, 0.011557448222631963, 0.025250511877706786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 134.22222222222223, 106, 317, 114.0, 317.0, 317.0, 317.0, 0.04283776386872606, 0.011546116042742569, 0.02518391977438778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 238.28571428571425, 106, 1217, 113.0, 778.5, 1217.0, 1217.0, 0.11855163770619516, 7.649168987420825, 0.06896767985977036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 246.78571428571425, 107, 904, 116.5, 624.0, 904.0, 904.0, 0.11833419266497054, 2.514915258982833, 0.0689567414566939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 137.77777777777777, 106, 335, 114.0, 335.0, 335.0, 335.0, 0.04283429789826378, 0.011461521117308865, 0.024428935520103563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 159.85714285714283, 107, 331, 116.5, 329.5, 331.0, 331.0, 0.11854260336491647, 0.08809660269599749, 0.05950283020465534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 112.66666666666667, 105, 117, 113.0, 117.0, 117.0, 117.0, 0.04287980789846062, 0.03186673223703958, 0.02152365357403199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 177.92857142857144, 108, 348, 114.0, 345.5, 348.0, 348.0, 0.11854661845770849, 0.044438443609913884, 0.06689747093490944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 151.88888888888889, 113, 350, 118.0, 350.0, 350.0, 350.0, 0.04156659892850545, 0.032717459703491596, 0.014775626962867171], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 617.5454545454545, 108, 916, 662.0, 898.4000000000001, 916.0, 916.0, 0.06561914647386569, 0.012373496725008055, 0.04465876925325412], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1970.1999999999998, 1252, 4608, 1645.5, 4095.0000000000036, 4591.099999999999, 4608.0, 0.08365925585091921, 0.04330020078221404, 0.03847998975174116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 252.55555555555554, 219, 448, 231.0, 448.0, 448.0, 448.0, 0.042811477281376055, 0.06634942816947637, 0.09628401579981354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c60aeebb-67cb-4335-ab0f-8e5e97ca59df", 3, 0, 0.0, 1046.3333333333333, 272, 2205, 662.0, 2205.0, 2205.0, 2205.0, 0.04230774654839301, 0.027199804502954488, 0.027130944238390048], "isController": false}, {"data": ["addBook", 63, 11, 17.46031746031746, 1189.111111111111, 579, 5296, 949.0, 2007.0, 2335.7999999999997, 5296.0, 0.30311194934662533, 81.71666422593388, 1.1051003471954928], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 218.6428571428572, 104, 583, 117.0, 441.6, 469.4, 583.0, 0.2402515777235305, 0.17854633852305343, 0.11613723727846445], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 692.0535714285712, 499, 1007, 661.0, 904.2, 923.3, 1007.0, 0.24008162775343617, 70.59197001980674, 0.12074417802052699], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 159.42857142857144, 102, 350, 115.0, 332.0, 344.3, 350.0, 0.24040319049377099, 0.42540095817843065, 0.11691483287685346], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1073.4107142857144, 704, 1924, 1095.5, 1358.9, 1483.6, 1924.0, 0.23961114534127473, 215.60252976954544, 0.12027356318888205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 129.75, 112, 335, 119.0, 124.80000000000001, 324.4999999999999, 335.0, 0.12560131630179486, 0.09383301461999322, 0.044647342904153633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 11, 6.043956043956044, 209.21428571428572, 104, 3660, 121.0, 323.80000000000007, 482.14999999999986, 2164.3399999999774, 0.7448423758016264, 1.5148594711107564, 0.36059118794173856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 119.57142857142857, 112, 131, 117.0, 131.0, 131.0, 131.0, 0.04234750361466191, 0.032794502310963765, 0.015053214175524353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 122.15384615384616, 111, 182, 116.0, 161.59999999999997, 182.0, 182.0, 0.08582500940774142, 0.06964900665804015, 0.03050810881290808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7925d3fa-d824-40d9-92e1-4852811bbbd3", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.32788396098003625, 1.2512760889292196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27727203-4424-4027-8289-030e340d8823", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 324.85714285714283, 221, 696, 232.0, 696.0, 696.0, 696.0, 0.04007671828929665, 0.06211108586436894, 0.09013347873071309], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b2f4823-0648-4083-b4d2-a3da9ff37ff1", 3, 0, 0.0, 760.6666666666666, 483, 1217, 582.0, 1217.0, 1217.0, 1217.0, 0.01698696533526607, 0.02341790305821999, 0.010893333890128308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 480.7142857142857, 220, 1549, 443.0, 1112.5, 1549.0, 1549.0, 0.11821828161283512, 10.272283024593625, 0.26371516782773907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b96236c7-273d-44c2-89f1-a622961471ab", 3, 0, 0.0, 353.3333333333333, 230, 578, 252.0, 578.0, 578.0, 578.0, 0.0959079283887468, 0.04339583999360613, 0.061503456681585675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 142.33333333333337, 110, 348, 119.0, 336.3, 348.0, 348.0, 0.08872589613155092, 0.07356277911688157, 0.03153928339051224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7291ff24-31d3-44e5-b112-3c3ff82ecd62", 2, 0, 0.0, 218.5, 213, 224, 218.5, 224.0, 224.0, 224.0, 0.017995968902965735, 0.025649527943240717, 0.011185970905017276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10630f79-a589-45cc-a5e8-25cadeab94ac", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 132.8947368421053, 107, 346, 120.0, 157.0, 346.0, 346.0, 0.10222143314449268, 0.07936136655260906, 0.03633652506308138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d87bbc3-20dd-43e1-b413-6a7e39ba9c52", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3adbf815-a97d-45ac-b943-b666f185324b", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/484c4704-f119-4816-88c1-036f1680a4a0", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.1283955388692581, 2.1084087897526502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 124.55, 103, 332, 114.5, 126.50000000000001, 321.7499999999999, 332.0, 0.12497578594147384, 0.09287751279439609, 0.06273198630265386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 143.2, 103, 344, 111.0, 325.40000000000003, 343.09999999999997, 344.0, 0.12498047180128105, 0.03344204030620215, 0.0712779253241681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 156.15, 100, 338, 111.5, 337.0, 337.95, 338.0, 0.1249750049990002, 0.03368466931613677, 0.07347163379824034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0027a1b-3452-419d-902c-8637c261f566", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.9979248046875, 1.8646240234375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc2c1b0a-5a91-404b-98d7-3b079e67e07b", 3, 0, 0.0, 997.6666666666666, 376, 1910, 707.0, 1910.0, 1910.0, 1910.0, 0.029082166815308855, 0.024244605863934236, 0.01864969681841095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 157.1, 103, 344, 113.0, 340.0, 343.85, 344.0, 0.12497031954910709, 0.033683406440970266, 0.07359092059385895], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 21.05263157894737, 0.30372057706909644], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07593014426727411], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07593014426727411], "isController": false}, {"data": ["401/Unauthorized", 13, 68.42105263157895, 0.9870918754745635], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1317, 19, "401/Unauthorized", 13, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
