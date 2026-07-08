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

    var data = {"OkPercent": 98.12680115273776, "KoPercent": 1.8731988472622478};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.821964956195244, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b28b4d62-ceec-4d94-bae3-606751a0ec65"], "isController": false}, {"data": [0.38333333333333336, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d2df2a73-c79b-4dde-a724-28ff4f8e36c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70a91b94-e1b5-4501-b38e-270f7a2a8fb1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72185b44-8b1a-461b-af9f-b4edd4287799"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd11b5f1-b6a4-40e3-aeff-48773ff188ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a11b229b-e021-4068-b7ec-eb99eee49fea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3515625, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25a0bcdd-6bc7-43d6-9514-9787a70a2aa1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc32a227-dbd2-48e6-82c5-3e5020f39e2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cb0bb03-e4b7-4ecb-8604-8ad6a0fddfcc"], "isController": false}, {"data": [0.9069148936170213, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25a0bcdd-6bc7-43d6-9514-9787a70a2aa1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6cb0bb03-e4b7-4ecb-8604-8ad6a0fddfcc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b921b36-e4eb-4146-a478-e33fa58dd944"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b921b36-e4eb-4146-a478-e33fa58dd944"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dd11b5f1-b6a4-40e3-aeff-48773ff188ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a11b229b-e021-4068-b7ec-eb99eee49fea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cbb1bce7-4704-4e6b-8fd3-91927b878756"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0766bac-1d61-4cd2-9be1-faa354f7e187"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2df2a73-c79b-4dde-a724-28ff4f8e36c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6fb5e97-8af7-4ffc-aa52-3106bbd31458"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1167a917-a00b-442a-b433-3c3f172bb882"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72185b44-8b1a-461b-af9f-b4edd4287799"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cbb1bce7-4704-4e6b-8fd3-91927b878756"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b28b4d62-ceec-4d94-bae3-606751a0ec65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1167a917-a00b-442a-b433-3c3f172bb882"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "register"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1388, 26, 1.8731988472622478, 287.43443804034547, 77, 2151, 91.0, 814.4000000000005, 1017.55, 1375.11, 5.379594747531122, 745.3892459156453, 3.955480843672], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b28b4d62-ceec-4d94-bae3-606751a0ec65", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["see books", 60, 0, 0.0, 1349.7666666666669, 968, 1764, 1341.0, 1648.8, 1716.95, 1764.0, 0.27402515550927575, 329.7431444115424, 1.3473795488175815], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 210.4, 158, 345, 168.0, 336.0, 345.0, 345.0, 0.07701272763678745, 0.11935468628865398, 0.17320342944093894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 23, 0, 0.0, 99.91304347826086, 81, 250, 85.0, 187.60000000000022, 249.6, 250.0, 0.11495459293579036, 0.08924697400776693, 0.04086276545764423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 327.8666666666667, 160, 1045, 177.0, 979.6, 1045.0, 1045.0, 0.10275239413078324, 16.52835810879081, 0.22758718754709484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 92.2, 79, 241, 82.0, 146.80000000000007, 241.0, 241.0, 0.06744119128120278, 0.05011986969237825, 0.03385231671732249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 111.93333333333332, 78, 236, 81.0, 236.0, 236.0, 236.0, 0.06744301065599569, 0.018046274335686344, 0.03846359201474754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 92.6, 78, 242, 80.0, 161.00000000000006, 242.0, 242.0, 0.06744301065599569, 0.018177998965873837, 0.039649113686434964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 103.93333333333335, 80, 241, 81.0, 237.4, 241.0, 241.0, 0.06744240418682446, 0.01817783550348003, 0.03971461887173354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2df2a73-c79b-4dde-a724-28ff4f8e36c9", 3, 0, 0.0, 329.0, 297, 391, 299.0, 391.0, 391.0, 391.0, 0.024831148192292412, 0.02490389569676202, 0.015923620422791683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70a91b94-e1b5-4501-b38e-270f7a2a8fb1", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.9310085641399416, 1.7395909256559765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 3.4696691176470584, 7.27251838235294], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 942.8000000000002, 619, 1376, 919.5, 1288.4, 1371.6, 1376.0, 0.2675991008670211, 320.141557136868, 0.5284036933135905], "isController": false}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 548.090909090909, 82, 966, 476.0, 951.8000000000001, 966.0, 966.0, 0.08481241036870268, 0.0162035073786797, 0.05727698914015636], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 548.090909090909, 82, 966, 476.0, 951.8000000000001, 966.0, 966.0, 0.0866448741680123, 0.01655360166988303, 0.058514520400929464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, 33.333333333333336, 802.0476190476192, 121, 1692, 807.0, 1452.0000000000002, 1672.2999999999997, 1692.0, 0.09337192706318612, 0.02917872720724566, 0.04212678740546092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 81.53846153846155, 78, 87, 81.0, 85.8, 87.0, 87.0, 0.06630454186111749, 0.02540213067095096, 0.03738595937571724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 115.55555555555554, 79, 243, 80.0, 243.0, 243.0, 243.0, 0.061229488121479304, 0.01650326047024247, 0.03605603646216018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 85.15384615384615, 80, 99, 84.0, 97.0, 99.0, 99.0, 0.06630318918339972, 0.049274147430241395, 0.03328109300807369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 133.44444444444446, 79, 245, 83.0, 245.0, 245.0, 245.0, 0.061229488121479304, 0.01650326047024247, 0.03599624204016654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 161.3846153846154, 77, 647, 83.0, 484.1999999999998, 647.0, 647.0, 0.06630521822067396, 1.5161839721161057, 0.03860665162473287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 211.9230769230769, 80, 844, 233.0, 603.5999999999998, 844.0, 844.0, 0.06625182829564624, 4.602138062758319, 0.038510865936877296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 23, 0, 0.0, 101.04347826086955, 78, 237, 82.0, 235.0, 236.6, 237.0, 0.11579493220961903, 0.03121035282212388, 0.06807475506854556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72185b44-8b1a-461b-af9f-b4edd4287799", 3, 0, 0.0, 315.3333333333333, 167, 406, 373.0, 406.0, 406.0, 406.0, 0.032101698179833715, 0.02676186492140434, 0.0205860499395418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 23, 0, 0.0, 122.34782608695653, 78, 246, 82.0, 241.8, 245.8, 246.0, 0.11579318330564366, 0.03120988143784927, 0.06818680618486633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 23, 0, 0.0, 96.17391304347825, 79, 248, 82.0, 179.4000000000002, 246.2, 248.0, 0.11579143445449648, 0.08605203283190607, 0.05812187237266718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 98.99999999999999, 79, 243, 81.0, 243.0, 243.0, 243.0, 0.06116124823311949, 0.01636541212487768, 0.034881024382950966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 23, 0, 0.0, 115.73913043478261, 77, 243, 82.0, 242.0, 242.8, 243.0, 0.11579376626776552, 0.03098387886461695, 0.06603863232458504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 120.55555555555554, 80, 247, 83.0, 247.0, 247.0, 247.0, 0.06122865501054494, 0.045502935999047554, 0.030733914722089938], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 454.72727272727275, 81, 801, 428.0, 759.8000000000002, 801.0, 801.0, 0.08522375108466591, 0.016070245676831536, 0.05800117860573943], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 86.33333333333333, 81, 94, 86.0, 94.0, 94.0, 94.0, 0.058689655622142956, 0.04619517815571018, 0.02086233852193363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1351.5238095238096, 926, 1947, 1253.0, 1871.2, 1940.1999999999998, 1947.0, 0.09522902580706599, 0.04928846062279783, 0.04380163198742977], "isController": false}, {"data": ["goToProfile", 11, 1, 9.090909090909092, 449.72727272727275, 79, 2151, 334.0, 1804.4000000000012, 2151.0, 2151.0, 0.0831280322839049, 0.17313420076175506, 0.053733594021583064], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 274.1111111111111, 162, 490, 190.0, 490.0, 490.0, 490.0, 0.06112718529687436, 0.09473519830677696, 0.13747647240107583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd11b5f1-b6a4-40e3-aeff-48773ff188ec", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 82.46666666666667, 79, 89, 82.0, 87.2, 89.0, 89.0, 0.07704555960758128, 0.057257491075556013, 0.0386732594123992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a11b229b-e021-4068-b7ec-eb99eee49fea", 3, 0, 0.0, 394.0, 169, 595, 418.0, 595.0, 595.0, 595.0, 0.02743559494087629, 0.022871926641791728, 0.017593789724455175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 93.46666666666667, 78, 255, 83.0, 154.80000000000007, 255.0, 255.0, 0.07704753833115033, 0.020616235842514832, 0.043941174204484165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 604.7142857142857, 478, 733, 625.0, 733.0, 733.0, 733.0, 0.08549722744705279, 25.1390236445636, 0.04876013752839729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 822.2857142857142, 697, 1015, 845.0, 1015.0, 1015.0, 1015.0, 0.08542002245326305, 76.86108635582931, 0.04863268856469957], "isController": false}, {"data": ["addBook", 64, 15, 23.4375, 838.4375, 403, 2793, 684.5, 1417.5, 2196.0, 2793.0, 0.30058661356303157, 74.2129892458094, 1.0963137190783263], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 151.85714285714283, 78, 243, 111.0, 243.0, 243.0, 243.0, 0.08590221873159239, 0.1520066604898881, 0.047564998067200076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25a0bcdd-6bc7-43d6-9514-9787a70a2aa1", 3, 0, 0.0, 609.3333333333334, 369, 962, 497.0, 962.0, 962.0, 962.0, 0.018995276507908367, 0.02618652213899477, 0.0121812157293553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc32a227-dbd2-48e6-82c5-3e5020f39e2a", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 1.064453125, 1.9889322916666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 81.66666666666667, 79, 84, 82.0, 84.0, 84.0, 84.0, 0.06549110139659774, 0.048670632971495, 0.0328734630057141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 96.0, 77, 245, 80.5, 202.10000000000014, 245.0, 245.0, 0.06549002914306297, 0.017523699204296146, 0.0373497822456531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 109.33333333333334, 78, 237, 81.0, 236.1, 237.0, 237.0, 0.06549038655700666, 0.017651705751693197, 0.03850118428449024], "isController": false}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 149.81666666666663, 79, 353, 85.0, 329.8, 335.9, 353.0, 0.2686643352572685, 0.19966167883865363, 0.12987191987533975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 108.66666666666666, 78, 237, 82.0, 236.1, 237.0, 237.0, 0.06549074397485156, 0.01765180208697171, 0.038565350211753405], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 510.2666666666668, 388, 738, 479.5, 649.8, 723.9, 738.0, 0.268517648322436, 78.95310423183814, 0.13504549695903761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 83.42857142857143, 80, 90, 81.0, 90.0, 90.0, 90.0, 0.0860616939400273, 0.06395795809410232, 0.04832565821827704], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 120.88333333333334, 79, 318, 85.0, 244.0, 257.44999999999993, 318.0, 0.2688087739183807, 0.4756655257227596, 0.130729267003275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 92.19999999999999, 77, 245, 81.0, 150.80000000000007, 245.0, 245.0, 0.07704832984903663, 0.020766932654623156, 0.04529599079015631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 463.7727272727273, 79, 1073, 83.5, 1046.0, 1070.75, 1073.0, 0.10537912535325958, 43.11563899566509, 0.05783502778176941], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 791.4166666666666, 539, 1235, 785.5, 1014.9, 1045.55, 1235.0, 0.2680390264822558, 241.181987191085, 0.13454302696472606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 104.13333333333333, 79, 243, 82.0, 241.8, 243.0, 243.0, 0.07704635108481263, 0.020766399315828403, 0.045370068070451186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 339.59090909090907, 79, 737, 158.5, 702.0, 735.35, 737.0, 0.10537963011749828, 14.099633596223576, 0.05793821460561673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 96.53333333333333, 83, 242, 85.0, 153.80000000000007, 242.0, 242.0, 0.09754257733500672, 0.0728711637317189, 0.03467333803705318], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 453.3636363636364, 85, 781, 441.0, 755.8000000000001, 781.0, 781.0, 0.08690705685301646, 0.016603691969787948, 0.05935511260389344], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cb0bb03-e4b7-4ecb-8604-8ad6a0fddfcc", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 15, 7.9787234042553195, 149.99468085106375, 80, 1518, 88.5, 264.4999999999999, 336.99999999999966, 1340.8899999999971, 0.7579881060376978, 1.6055392286563854, 0.3642210966636428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 95.8, 80, 249, 85.0, 153.60000000000005, 249.0, 249.0, 0.06791632708503124, 0.05259535876799783, 0.024142131893507196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25a0bcdd-6bc7-43d6-9514-9787a70a2aa1", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cb0bb03-e4b7-4ecb-8604-8ad6a0fddfcc", 3, 0, 0.0, 305.3333333333333, 184, 544, 188.0, 544.0, 544.0, 544.0, 0.04004485023226013, 0.033383743959901756, 0.025679803046078274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 206.58333333333334, 161, 330, 167.0, 327.0, 330.0, 330.0, 0.06546109156370182, 0.10145190655429179, 0.14722352917109893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 88.46153846153847, 81, 123, 86.0, 110.6, 123.0, 123.0, 0.06285294345169026, 0.0510066367269088, 0.022342257242593023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 526.6190476190476, 103, 1204, 480.0, 1158.4, 1200.3999999999999, 1204.0, 0.09669309611293753, 0.05939448970218527, 0.04371963232450203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 83.5909090909091, 79, 110, 82.0, 86.0, 106.39999999999995, 110.0, 0.10537710634465978, 0.07831247844559189, 0.0528943678331593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 117.45454545454545, 78, 243, 81.0, 242.7, 243.0, 243.0, 0.10537912535325958, 0.1001401063371174, 0.05607621425492168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b921b36-e4eb-4146-a478-e33fa58dd944", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["login", 21, 0, 0.0, 2469.0000000000005, 1657, 3350, 2541.0, 3045.6, 3320.5999999999995, 3350.0, 0.09301789930147987, 37.2189989128533, 0.19175857951701564], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2b921b36-e4eb-4146-a478-e33fa58dd944", 3, 0, 0.0, 438.33333333333337, 180, 801, 334.0, 801.0, 801.0, 801.0, 0.04131719208362599, 0.026562973426159292, 0.026495725392169017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 208.13333333333335, 160, 483, 166.0, 385.20000000000005, 483.0, 483.0, 0.06741633632661866, 0.10448215405307014, 0.15162092046894804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd11b5f1-b6a4-40e3-aeff-48773ff188ec", 3, 0, 0.0, 1165.0, 428, 2151, 916.0, 2151.0, 2151.0, 2151.0, 0.044987628402189395, 0.02892271031716278, 0.028849488265726923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 91.2, 81, 141, 87.0, 119.4, 141.0, 141.0, 0.07501612846762054, 0.06073083056607171, 0.02666588941622449], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a11b229b-e021-4068-b7ec-eb99eee49fea", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 23, 0, 0.0, 248.30434782608697, 163, 491, 169.0, 423.4000000000002, 489.0, 491.0, 0.1157436529703344, 0.17938005592179754, 0.2603101882721485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbb1bce7-4704-4e6b-8fd3-91927b878756", 3, 0, 0.0, 303.6666666666667, 180, 431, 300.0, 431.0, 431.0, 431.0, 0.036570202598922394, 0.0304870731952605, 0.023451594765585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0766bac-1d61-4cd2-9be1-faa354f7e187", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2df2a73-c79b-4dde-a724-28ff4f8e36c9", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6fb5e97-8af7-4ffc-aa52-3106bbd31458", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 1.013764880952381, 1.8942212301587302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1167a917-a00b-442a-b433-3c3f172bb882", 3, 0, 0.0, 660.0, 388, 1178, 414.0, 1178.0, 1178.0, 1178.0, 0.038154832309512, 0.031808113784069086, 0.0244677798338993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72185b44-8b1a-461b-af9f-b4edd4287799", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 0.2758229961832061, 1.0526001908396947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 112.16666666666666, 83, 250, 85.0, 246.70000000000002, 250.0, 250.0, 0.06332453825857519, 0.052502473614775724, 0.022509894459102904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 555.8636363636364, 162, 1170, 247.0, 1142.3999999999999, 1168.2, 1170.0, 0.10533472502848826, 57.369476959225885, 0.22464986677551255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cbb1bce7-4704-4e6b-8fd3-91927b878756", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b28b4d62-ceec-4d94-bae3-606751a0ec65", 3, 0, 0.0, 387.3333333333333, 368, 414, 380.0, 414.0, 414.0, 414.0, 0.018226666828681484, 0.025126931646961614, 0.011688324756673998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 87.86363636363635, 80, 101, 85.5, 99.7, 100.85, 101.0, 0.10357815442561205, 0.0804146804378531, 0.036818797080979286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 310.7692307692308, 162, 925, 320.0, 685.3999999999999, 925.0, 925.0, 0.06622314142206555, 6.189038096135625, 0.1476340270419651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 722.5555555555555, 79, 1103, 796.0, 1103.0, 1103.0, 1103.0, 0.10970793310254034, 102.08894570676289, 0.20855935199180847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1167a917-a00b-442a-b433-3c3f172bb882", 1, 0, 0.0, 781.0, 781, 781, 781.0, 781.0, 781.0, 781.0, 1.2804097311139564, 0.23132402368758, 0.882782490396927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 81.66666666666666, 78, 92, 81.0, 87.8, 92.0, 92.0, 0.10281014393420151, 0.07640480423235092, 0.05160587302947224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 112.73333333333333, 78, 241, 82.0, 239.2, 241.0, 241.0, 0.10281366736351485, 0.04810019620274855, 0.05748462078892354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 201.66666666666666, 78, 966, 81.0, 900.0, 966.0, 966.0, 0.10281296265833197, 12.358854402279707, 0.059264711678181724], "isController": false}, {"data": ["register", 21, 7, 33.333333333333336, 802.0476190476192, 121, 1692, 807.0, 1452.0000000000002, 1672.2999999999997, 1692.0, 0.09492469307682572, 0.029663966586508037, 0.04282735175927098], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 203.20000000000002, 78, 715, 83.0, 669.4, 715.0, 715.0, 0.10281296265833197, 4.054739763256018, 0.05936511496202775], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 26.923076923076923, 0.5043227665706052], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 3.8461538461538463, 0.07204610951008646], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.8461538461538463, 0.07204610951008646], "isController": false}, {"data": ["401/Unauthorized", 17, 65.38461538461539, 1.2247838616714697], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1388, 26, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
