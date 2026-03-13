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

    var data = {"OkPercent": 97.55192878338279, "KoPercent": 2.4480712166172105};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8155555555555556, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c83b2bc-b599-4e36-b3f5-3a4bebda8ffd"], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "see books"], "isController": true}, {"data": [0.6875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a5df4a8-eca2-401b-b5b7-4e13045176c5"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b247a87-f6e9-45fe-9fcf-7b7a7e9181ef"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4744fdba-6f33-40ce-b220-e60355f1f59d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/58a76f29-6f4f-45d5-8d82-8f593d0534fc"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8913043478260869, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa9e341e-ecf8-4795-bc84-bc43c086705d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a16614ba-9319-452b-be1c-4a5e283bc7c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1ff698d0-938f-482d-bcd7-deef88391526"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/117ec284-ae86-4146-9cbc-65b4fbd32854"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7191ab72-f803-414e-8134-c81f252657f5"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58a76f29-6f4f-45d5-8d82-8f593d0534fc"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d662b047-07bf-4851-8d00-9d9df8ae84d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b247a87-f6e9-45fe-9fcf-7b7a7e9181ef"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=673903b2-6fe6-485a-9b9e-22b833fb367b"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/035cf77c-4b1b-44d3-ae89-4379c03ee2f6"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.36885245901639346, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a24d559d-118c-4074-901c-75ea6766200d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e9fc8ff-e177-4cc3-ad98-ee1e83a18df6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9073033707865169, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e9fc8ff-e177-4cc3-ad98-ee1e83a18df6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ff698d0-938f-482d-bcd7-deef88391526"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=035cf77c-4b1b-44d3-ae89-4379c03ee2f6"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a5df4a8-eca2-401b-b5b7-4e13045176c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa9e341e-ecf8-4795-bc84-bc43c086705d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4744fdba-6f33-40ce-b220-e60355f1f59d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/673903b2-6fe6-485a-9b9e-22b833fb367b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7191ab72-f803-414e-8134-c81f252657f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=117ec284-ae86-4146-9cbc-65b4fbd32854"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c83b2bc-b599-4e36-b3f5-3a4bebda8ffd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d662b047-07bf-4851-8d00-9d9df8ae84d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1348, 33, 2.4480712166172105, 270.46068249258167, 77, 2629, 95.5, 659.0, 833.2999999999997, 1386.8499999999997, 5.3436082833856595, 752.7579033336604, 3.90794171111415], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c83b2bc-b599-4e36-b3f5-3a4bebda8ffd", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1187.4464285714282, 961, 1519, 1181.0, 1390.2000000000003, 1485.75, 1519.0, 0.26192948484083106, 315.1897103223604, 1.2879052306382661], "isController": true}, {"data": ["deleteBook", 16, 3, 18.75, 438.1875, 83, 799, 441.0, 753.5, 799.0, 799.0, 0.08634786316022386, 0.017449815363983226, 0.057914835709698485], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 438.1875, 83, 799, 441.0, 753.5, 799.0, 799.0, 0.088077111511128, 0.01779927467122466, 0.05907466909153965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 119.8235294117647, 79, 247, 83.0, 245.4, 247.0, 247.0, 0.10721561059290233, 0.028688552053178943, 0.06114640291626461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 111.94117647058825, 80, 245, 84.0, 243.4, 245.0, 245.0, 0.10732052220903512, 0.07975675527448801, 0.053869871499457087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 118.82352941176471, 77, 240, 84.0, 238.4, 240.0, 240.0, 0.10732526499870577, 0.02892751283168242, 0.06320032694748007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 117.76470588235294, 78, 242, 82.0, 238.8, 242.0, 242.0, 0.10721358206884374, 0.028897410791993036, 0.06302985977094133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a5df4a8-eca2-401b-b5b7-4e13045176c5", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.5032425139275766, 1.920482242339833], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 191.3125, 81, 304, 182.0, 289.3, 304.0, 304.0, 0.08681450453334491, 0.1491435460876501, 0.05610832449362728], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4b247a87-f6e9-45fe-9fcf-7b7a7e9181ef", 3, 0, 0.0, 497.33333333333337, 182, 990, 320.0, 990.0, 990.0, 990.0, 0.03404680300519781, 0.034401457203168624, 0.021833399062578022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4744fdba-6f33-40ce-b220-e60355f1f59d", 3, 0, 0.0, 327.33333333333337, 176, 629, 177.0, 629.0, 629.0, 629.0, 0.03173830707870042, 0.0264589207124192, 0.020353015932630156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 83.9375, 79, 86, 84.0, 86.0, 86.0, 86.0, 0.07724095315336191, 0.05740270053682462, 0.03877133781330862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 508.375, 401, 584, 559.5, 584.0, 584.0, 584.0, 0.038552544708904186, 11.335728209378871, 0.021986998154296923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 91.5, 78, 244, 82.0, 132.0000000000001, 244.0, 244.0, 0.0772413260404648, 0.03516969557262374, 0.04324081069599262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 675.625, 548, 725, 718.0, 725.0, 725.0, 725.0, 0.038554774285893295, 34.69165367451095, 0.021950618563159947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 145.375, 81, 257, 90.5, 257.0, 257.0, 257.0, 0.038611715759854434, 0.06832463765317992, 0.021379729331872523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 93.29411764705883, 80, 247, 84.0, 123.7999999999999, 247.0, 247.0, 0.09323037774755408, 0.06928546627528188, 0.04679727945531523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 112.76470588235294, 79, 247, 83.0, 244.6, 247.0, 247.0, 0.09323140033563304, 0.024946683292933057, 0.053171033003915714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 102.94117647058823, 78, 250, 82.0, 246.0, 250.0, 250.0, 0.09323037774755408, 0.025128500252270435, 0.05480926504299566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 103.58823529411764, 79, 251, 83.0, 243.0, 251.0, 251.0, 0.09323191163808468, 0.025128913683702514, 0.054901213591567445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 124.375, 81, 246, 86.5, 246.0, 246.0, 246.0, 0.038640062983302664, 0.028715906181927077, 0.021697300991600617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58a76f29-6f4f-45d5-8d82-8f593d0534fc", 3, 0, 0.0, 235.66666666666666, 180, 346, 181.0, 346.0, 346.0, 346.0, 0.02257625128872768, 0.02708121289028694, 0.014477609062107266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 160.6875, 80, 711, 82.5, 708.2, 711.0, 711.0, 0.07724169893116799, 8.70599372954302, 0.04457992584796903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 388.52941176470586, 78, 779, 546.0, 755.0, 779.0, 779.0, 0.11277023396506776, 53.73416785724947, 0.06116593227815773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 144.31249999999997, 79, 582, 83.0, 576.4, 582.0, 582.0, 0.07724058026985928, 2.857128309879553, 0.044654710468512396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 304.7058823529411, 80, 654, 386.0, 591.5999999999999, 654.0, 654.0, 0.11276724177959975, 17.568174949254743, 0.06127443359336133], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 339.5, 85, 678, 361.0, 661.9, 678.0, 678.0, 0.0882471361046611, 0.017833634499666316, 0.05966269083443183], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 208.1764705882353, 164, 492, 167.0, 367.9999999999999, 492.0, 492.0, 0.0931884709416421, 0.14442392908631446, 0.20958305525254078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 390.7391304347826, 105, 1029, 327.0, 767.8000000000001, 978.1999999999992, 1029.0, 0.09941560911511463, 0.06106681458340537, 0.04495061232450984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 83.17647058823528, 79, 86, 83.0, 86.0, 86.0, 86.0, 0.11276948590381426, 0.08380622927031509, 0.05660499585406302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa9e341e-ecf8-4795-bc84-bc43c086705d", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 158.8823529411765, 80, 260, 83.0, 253.6, 260.0, 260.0, 0.11276948590381426, 0.11984349087893864, 0.05929985489220564], "isController": false}, {"data": ["login", 23, 0, 0.0, 2177.8260869565215, 1104, 3211, 2086.0, 2995.8, 3176.1999999999994, 3211.0, 0.10396467009298058, 43.40119747241546, 0.2168240756749793], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a16614ba-9319-452b-be1c-4a5e283bc7c9", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 1.9591161809815951, 3.660611579754601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 88.3125, 81, 99, 87.0, 96.9, 99.0, 99.0, 0.07876186350569055, 0.06376326645138423, 0.027997381168038436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 476.05882352941165, 161, 865, 649.0, 841.8, 865.0, 865.0, 0.11270593695097292, 71.46568995093976, 0.23821171520204196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ff698d0-938f-482d-bcd7-deef88391526", 3, 0, 0.0, 549.3333333333334, 182, 836, 630.0, 836.0, 836.0, 836.0, 0.030957515968918655, 0.031048211816483845, 0.01985231330038078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/117ec284-ae86-4146-9cbc-65b4fbd32854", 3, 0, 0.0, 508.3333333333333, 304, 860, 361.0, 860.0, 860.0, 860.0, 0.02287701317715959, 0.0270398550931857, 0.014670480455405076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, 38.46153846153846, 525.1538461538463, 80, 966, 783.0, 905.5999999999999, 966.0, 966.0, 0.06113475510827906, 45.014550733029225, 0.10033135478144324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 269.76470588235287, 160, 491, 170.0, 488.6, 491.0, 491.0, 0.10715613910127517, 0.1660710866735583, 0.24099666831077804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7191ab72-f803-414e-8134-c81f252657f5", 1, 0, 0.0, 678.0, 678, 678, 678.0, 678.0, 678.0, 678.0, 1.4749262536873156, 0.26646616887905605, 1.0168925147492625], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 915.6666666666665, 141, 1820, 881.0, 1589.0, 1780.25, 1820.0, 0.09498292286199377, 0.029682163394373053, 0.042853623400626095], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58a76f29-6f4f-45d5-8d82-8f593d0534fc", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 256.43750000000006, 165, 796, 169.0, 791.1, 796.0, 796.0, 0.0772092709032037, 11.650843164446096, 0.17117612037890448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 96.1578947368421, 81, 244, 87.0, 104.0, 244.0, 244.0, 0.10623546251565576, 0.08247772724604133, 0.037763387066112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 266.5263157894737, 166, 657, 175.0, 584.0, 657.0, 657.0, 0.09368004812196155, 6.036171052988393, 0.2094271018228165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d662b047-07bf-4851-8d00-9d9df8ae84d1", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 0.6716136152416357, 2.5630227695167282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 104.125, 82, 244, 83.0, 244.0, 244.0, 244.0, 0.056613120090581, 0.042072836317316537, 0.028417132545467412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 84.125, 81, 89, 83.5, 89.0, 89.0, 89.0, 0.05661352072408693, 0.015148539724999823, 0.03228739853795583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 124.12500000000001, 81, 251, 85.5, 251.0, 251.0, 251.0, 0.05654549438432559, 0.015240777783275254, 0.03324256603453516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 102.87500000000001, 80, 245, 82.0, 245.0, 245.0, 245.0, 0.05661392136326323, 0.015259220992442042, 0.03333808064653098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 86.33333333333333, 85, 88, 86.0, 88.0, 88.0, 88.0, 0.025076902501003077, 0.007395727104788016, 0.01550163992493647], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 780.75, 620, 1174, 659.0, 1044.0000000000002, 1116.8999999999999, 1174.0, 0.2588661661920787, 309.69393120631634, 0.5111595586331866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b247a87-f6e9-45fe-9fcf-7b7a7e9181ef", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 915.6666666666665, 141, 1820, 881.0, 1589.0, 1780.25, 1820.0, 0.0955307529415511, 0.02985336029423472, 0.043100788924801375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 123.75, 82, 246, 83.5, 246.0, 246.0, 246.0, 0.040052869788120324, 0.010795500060079306, 0.023585820783434134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 123.75, 80, 248, 83.5, 248.0, 248.0, 248.0, 0.040052067687994394, 0.010795283869029738, 0.023546235105637327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=673903b2-6fe6-485a-9b9e-22b833fb367b", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.504648219273743, 1.925846717877095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 182.6315789473684, 80, 709, 83.0, 568.0, 709.0, 709.0, 0.10478018220722211, 14.910317944088744, 0.06017751624092824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 183.00000000000003, 79, 566, 84.0, 564.0, 566.0, 566.0, 0.10487619089674663, 4.892817136631598, 0.06033507425510306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 109.73684210526316, 80, 243, 84.0, 243.0, 243.0, 243.0, 0.10486345674106452, 0.07793075251948253, 0.05263653980947966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 81.25, 78, 83, 82.0, 83.0, 83.0, 83.0, 0.04011875150445318, 0.010734900304902512, 0.022880225467383455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 107.15789473684211, 79, 247, 82.0, 241.0, 247.0, 247.0, 0.1048767697954903, 0.0529343071233406, 0.05842179435873375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 82.5, 78, 86, 83.0, 86.0, 86.0, 86.0, 0.04012036108324975, 0.029816010531594783, 0.020138540621865597], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 543.1333333333333, 80, 1357, 438.0, 1178.2, 1357.0, 1357.0, 0.0859894519605595, 0.016531696070282046, 0.05851873316039899], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 127.75, 85, 252, 87.0, 252.0, 252.0, 252.0, 0.04642956634785031, 0.036545146949577494, 0.016504259912712416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/035cf77c-4b1b-44d3-ae89-4379c03ee2f6", 3, 0, 0.0, 544.3333333333333, 257, 1059, 317.0, 1059.0, 1059.0, 1059.0, 0.10562636434053939, 0.04676167171325963, 0.06773565681994226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1306.2173913043478, 728, 2629, 1250.0, 1979.4, 2510.1999999999985, 2629.0, 0.10072169282511212, 0.05213134491924748, 0.046328044258425585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 207.75, 161, 332, 169.0, 332.0, 332.0, 332.0, 0.04002041040930875, 0.06202381964802049, 0.09000684098890434], "isController": false}, {"data": ["addBook", 61, 14, 22.950819672131146, 816.0163934426229, 421, 1975, 702.0, 1271.4, 1442.3999999999999, 1975.0, 0.27853881278538817, 83.06531374857306, 1.0122048016552512], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 159.91071428571433, 80, 348, 86.5, 327.6, 336.2, 348.0, 0.2595500514465281, 0.1928882706550858, 0.12546608932229628], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 470.3214285714286, 385, 654, 415.5, 575.5, 596.9999999999999, 654.0, 0.2595199807213729, 76.30749120644352, 0.1305203028042061], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a24d559d-118c-4074-901c-75ea6766200d", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 1.1654596259124086, 2.1776630930656933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e9fc8ff-e177-4cc3-ad98-ee1e83a18df6", 3, 0, 0.0, 322.3333333333333, 246, 438, 283.0, 438.0, 438.0, 438.0, 0.05604543416529667, 0.02535909944328202, 0.03594059417501121], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 124.60714285714288, 78, 388, 84.0, 251.3, 331.34999999999997, 388.0, 0.2599005880250804, 0.45990221240375556, 0.1263969656606348], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 617.5, 539, 827, 569.5, 742.3, 782.55, 827.0, 0.2593180860472978, 233.33486965793168, 0.13016552366046003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 90.94736842105263, 82, 111, 89.0, 102.0, 111.0, 111.0, 0.09441932117477514, 0.07053787177607714, 0.03356311807384585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 14, 7.865168539325842, 148.85955056179765, 79, 958, 90.0, 281.79999999999995, 399.19999999999925, 939.0400000000002, 0.7538731290817148, 1.63962607839857, 0.36236137522552664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 115.625, 85, 251, 96.0, 251.0, 251.0, 251.0, 0.05703896474278992, 0.04417177640725821, 0.020275569498413606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e9fc8ff-e177-4cc3-ad98-ee1e83a18df6", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 0.9661179812834224, 3.6869151069518717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 125.0, 82, 375, 90.0, 278.9999999999999, 375.0, 375.0, 0.10429319885645574, 0.08463637524386203, 0.037072973031005756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ff698d0-938f-482d-bcd7-deef88391526", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 231.0, 165, 490, 173.0, 490.0, 490.0, 490.0, 0.056512340882440205, 0.0875830908012037, 0.12709757915259745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=035cf77c-4b1b-44d3-ae89-4379c03ee2f6", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 320.36842105263156, 164, 946, 172.0, 651.0, 946.0, 946.0, 0.10472012169580458, 19.917986748770915, 0.23128743572113583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a5df4a8-eca2-401b-b5b7-4e13045176c5", 3, 0, 0.0, 632.3333333333333, 267, 1357, 273.0, 1357.0, 1357.0, 1357.0, 0.020682238093924936, 0.024445705247083806, 0.01326302377767973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa9e341e-ecf8-4795-bc84-bc43c086705d", 3, 0, 0.0, 292.6666666666667, 186, 498, 194.0, 498.0, 498.0, 498.0, 0.0324573456382737, 0.026741387308095943, 0.020814118133919007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4744fdba-6f33-40ce-b220-e60355f1f59d", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 0.2758229961832061, 1.0526001908396947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/673903b2-6fe6-485a-9b9e-22b833fb367b", 3, 0, 0.0, 326.6666666666667, 233, 477, 270.0, 477.0, 477.0, 477.0, 0.03247421006484017, 0.02707241275262229, 0.020824932886632532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 102.7058823529412, 82, 342, 88.0, 144.3999999999998, 342.0, 342.0, 0.09208751564133538, 0.07634990310497435, 0.03273423407563093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 95.82352941176472, 82, 168, 89.0, 120.79999999999995, 168.0, 168.0, 0.11252987006109709, 0.08736449872907441, 0.04000085224828061], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7191ab72-f803-414e-8134-c81f252657f5", 3, 0, 0.0, 260.3333333333333, 158, 433, 190.0, 433.0, 433.0, 433.0, 0.026282590412111017, 0.026359590188709, 0.016854395544224837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=117ec284-ae86-4146-9cbc-65b4fbd32854", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c83b2bc-b599-4e36-b3f5-3a4bebda8ffd", 3, 0, 0.0, 240.66666666666666, 164, 357, 201.0, 357.0, 357.0, 357.0, 0.046284153848527396, 0.02975625125352917, 0.029680918971874665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d662b047-07bf-4851-8d00-9d9df8ae84d1", 3, 0, 0.0, 264.0, 188, 409, 195.0, 409.0, 409.0, 409.0, 0.06981127684825356, 0.03158778477183348, 0.04476829928094385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 93.42105263157895, 80, 247, 84.0, 92.0, 247.0, 247.0, 0.09379288556280668, 0.069703501868453, 0.04707963201101819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 99.3157894736842, 79, 252, 83.0, 234.0, 252.0, 252.0, 0.09379381158304208, 0.0325115884722469, 0.053077192923997395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 162.57894736842107, 79, 573, 83.0, 316.0, 573.0, 573.0, 0.09371886314086438, 4.462267406120828, 0.05467254814190022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 145.26315789473682, 81, 558, 83.0, 336.0, 558.0, 558.0, 0.09379381158304208, 1.4754495469512074, 0.05480786615376261], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 24.242424242424242, 0.5934718100890207], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.090909090909092, 0.22255192878338279], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.0606060606060606, 0.14836795252225518], "isController": false}, {"data": ["401/Unauthorized", 20, 60.60606060606061, 1.4836795252225519], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1348, 33, "401/Unauthorized", 20, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
