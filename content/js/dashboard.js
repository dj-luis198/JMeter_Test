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

    var data = {"OkPercent": 97.55725190839695, "KoPercent": 2.4427480916030535};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7416173570019724, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bbbfb78a-2c34-4065-9928-edeaf134773b"], "isController": false}, {"data": [0.03508771929824561, 500, 1500, "see books"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e14a464-1b00-4da8-b454-141d1b14415f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb02a82d-7cd1-472a-a68a-b2d83460c7ce"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/af08c0ba-2cc8-45f9-a028-df12937db4e8"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af08c0ba-2cc8-45f9-a028-df12937db4e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6e7cc134-dd54-4203-9d79-40ccf51d2b7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.22321428571428573, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb02a82d-7cd1-472a-a68a-b2d83460c7ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8301c4e5-c4b2-4487-a6e4-3de6e3107a42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9635b3c8-eae5-4050-932e-a4ee55e232d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbbfb78a-2c34-4065-9928-edeaf134773b"], "isController": false}, {"data": [0.4649122807017544, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9635b3c8-eae5-4050-932e-a4ee55e232d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8301c4e5-c4b2-4487-a6e4-3de6e3107a42"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.878698224852071, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32c3421f-4f1b-4915-bc3c-e43d71ca62a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f71d672d-77ab-46f8-8b7e-c48f2010539b"], "isController": false}, {"data": [0.5681818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dc1230ac-0ec3-43ce-89c1-a2d16f3bae99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/17384713-52c2-43c5-a06c-06e135efe5f1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e51c6f5c-ea46-48a1-ba4b-5d8123385f1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8ae0919-2065-43c5-af49-4b8dc4732785"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc1230ac-0ec3-43ce-89c1-a2d16f3bae99"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e7cc134-dd54-4203-9d79-40ccf51d2b7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e51c6f5c-ea46-48a1-ba4b-5d8123385f1b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8ae0919-2065-43c5-af49-4b8dc4732785"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.17857142857142858, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e14a464-1b00-4da8-b454-141d1b14415f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/32c3421f-4f1b-4915-bc3c-e43d71ca62a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1310, 32, 2.4427480916030535, 457.00763358778664, 113, 5033, 127.0, 1247.9, 1588.2500000000002, 3421.7600000000284, 5.151375731908251, 737.1972929287047, 3.7846121881648127], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/bbbfb78a-2c34-4065-9928-edeaf134773b", 3, 0, 0.0, 1146.6666666666667, 218, 2791, 431.0, 2791.0, 2791.0, 2791.0, 0.05689468793263669, 0.025743364657019856, 0.03648520026930152], "isController": false}, {"data": ["see books", 57, 0, 0.0, 2052.59649122807, 1379, 4391, 1945.0, 2439.4, 4151.799999999999, 4391.0, 0.2517045253824142, 302.8841652393291, 1.2376291848637264], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 370.0, 233, 1024, 248.5, 632.7000000000004, 1024.0, 1024.0, 0.09122162864815248, 6.95333857798309, 0.20370083653084148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 119.5, 116, 133, 119.0, 124.9, 133.0, 133.0, 0.14905968184039023, 0.11572504596006856, 0.052986058779201206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e14a464-1b00-4da8-b454-141d1b14415f", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb02a82d-7cd1-472a-a68a-b2d83460c7ce", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 355.4117647058824, 230, 812, 239.0, 710.3999999999999, 812.0, 812.0, 0.08113396649644443, 0.12574180159165751, 0.18247219222784328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 145.625, 115, 341, 117.0, 341.0, 341.0, 341.0, 0.03921856999289163, 0.029145831801357942, 0.019685883765963183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 144.125, 113, 343, 115.5, 343.0, 343.0, 343.0, 0.03921953132660065, 0.010494288655750564, 0.02236738895970193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 143.125, 113, 340, 115.0, 340.0, 340.0, 340.0, 0.039219339056088556, 0.010570837479961369, 0.023056681749770814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 143.25, 113, 342, 115.0, 342.0, 342.0, 342.0, 0.03921953132660065, 0.010570889302872831, 0.02309509510736347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 123.0, 119, 127, 123.0, 127.0, 127.0, 127.0, 0.04401989699344104, 0.012982430558612493, 0.027211518356297048], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1488.3157894736844, 906, 3901, 1357.0, 1944.4, 3657.8999999999987, 3901.0, 0.2517234222020059, 301.1487261745989, 0.4970554293871639], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 1090.7857142857142, 116, 3724, 533.0, 3588.5, 3724.0, 3724.0, 0.08061590551815874, 0.016538182068143472, 0.05396699534443145], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 1090.7857142857142, 116, 3724, 533.0, 3588.5, 3724.0, 3724.0, 0.07959474902070032, 0.016328693978088702, 0.053283398880556714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, 40.90909090909091, 1321.4545454545455, 176, 5033, 1101.5, 2108.6, 4602.799999999994, 5033.0, 0.09538302789086447, 0.029553157611782406, 0.04303413953669862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 138.94736842105263, 113, 340, 115.0, 340.0, 340.0, 340.0, 0.0962580932791586, 0.02575656011571236, 0.05489719382327014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 115.8, 113, 121, 115.0, 121.0, 121.0, 121.0, 0.02762369892378069, 0.0074454501005502645, 0.016266689893593513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 128.26315789473685, 113, 341, 116.0, 124.0, 341.0, 341.0, 0.0962556550197324, 0.07153374362306286, 0.048315826836076624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 116.0, 114, 120, 115.0, 120.0, 120.0, 120.0, 0.027623851538372293, 0.007445491234951907, 0.0162398033458009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 187.94736842105263, 114, 348, 117.0, 346.0, 348.0, 348.0, 0.09625663030867981, 0.025944169887886354, 0.056682371168099537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 145.47368421052627, 113, 459, 116.0, 340.0, 459.0, 459.0, 0.09625711796056498, 0.02594430132530853, 0.05658865723853527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af08c0ba-2cc8-45f9-a028-df12937db4e8", 3, 0, 0.0, 1306.6666666666667, 232, 3079, 609.0, 3079.0, 3079.0, 3079.0, 0.037848203471941864, 0.02433274800035325, 0.02427114610668147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 293.1111111111111, 113, 1468, 117.0, 1091.8000000000006, 1468.0, 1468.0, 0.1480518839602234, 14.837398034405613, 0.08562462472959968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 252.55555555555557, 113, 1133, 115.0, 926.0000000000003, 1133.0, 1133.0, 0.14777475842931853, 4.86325832053987, 0.08560866267948476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 115.8, 114, 120, 114.0, 120.0, 120.0, 120.0, 0.027623851538372293, 0.007391538399916024, 0.01575422783047795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 116.05555555555556, 114, 124, 115.5, 117.70000000000002, 124.0, 124.0, 0.1480518839602234, 0.11002683954465821, 0.07431510581597152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 116.6, 115, 119, 116.0, 119.0, 119.0, 119.0, 0.027624309392265192, 0.02052939399171271, 0.013866108425414365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af08c0ba-2cc8-45f9-a028-df12937db4e8", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 203.44444444444446, 113, 345, 116.0, 344.1, 345.0, 345.0, 0.14777233209368765, 0.0642014342125787, 0.08289745626349448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 124.4, 117, 135, 125.0, 135.0, 135.0, 135.0, 0.0266250605720128, 0.020956834786174137, 0.009464377000207675], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 478.00000000000006, 114, 1016, 460.0, 853.1999999999998, 1016.0, 1016.0, 0.08265723950253058, 0.0160384352189781, 0.056249393979373834], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1691.681818181818, 921, 2641, 1659.5, 2537.6, 2629.45, 2641.0, 0.09613871943225716, 0.049759298143648725, 0.04422005552011047], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 379.28571428571433, 114, 2013, 228.5, 1229.5, 2013.0, 2013.0, 0.0804107842348914, 0.15424219835904565, 0.05196748855582232], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 234.4, 231, 241, 233.0, 241.0, 241.0, 241.0, 0.027605702233853426, 0.04278344672375525, 0.062085871332582455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e7cc134-dd54-4203-9d79-40ccf51d2b7a", 3, 0, 0.0, 1140.3333333333333, 216, 2721, 484.0, 2721.0, 2721.0, 2721.0, 0.016269774555157247, 0.02242919766962596, 0.010433416625540292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 118.5, 114, 139, 116.0, 129.20000000000002, 139.0, 139.0, 0.09128199861935976, 0.0678375009270828, 0.04581928446323332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 144.0625, 113, 341, 116.0, 339.6, 341.0, 341.0, 0.09128460256966157, 0.03299483742782811, 0.05158159488463908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 969.7777777777778, 573, 1811, 906.0, 1811.0, 1811.0, 1811.0, 0.04935482278876684, 14.51195663424786, 0.02814767237171859], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1968.3333333333333, 1020, 3607, 1355.0, 3607.0, 3607.0, 3607.0, 0.04923251972035929, 44.299507785917854, 0.02802984277047799], "isController": false}, {"data": ["addBook", 56, 13, 23.214285714285715, 1307.9285714285709, 591, 3642, 968.5, 2497.2000000000003, 2947.85, 3642.0, 0.26430304231680496, 68.76882716704897, 0.963366706017142], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bb02a82d-7cd1-472a-a68a-b2d83460c7ce", 3, 0, 0.0, 289.6666666666667, 213, 432, 224.0, 432.0, 432.0, 432.0, 0.029480552662093908, 0.029566921468721134, 0.01890517211729329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 217.11111111111111, 113, 353, 117.0, 353.0, 353.0, 353.0, 0.04956902486712748, 0.08771393853440916, 0.02744691123013797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8301c4e5-c4b2-4487-a6e4-3de6e3107a42", 3, 0, 0.0, 919.0, 288, 2013, 456.0, 2013.0, 2013.0, 2013.0, 0.017060673441649653, 0.023519515633263766, 0.010940601132828718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9635b3c8-eae5-4050-932e-a4ee55e232d0", 3, 0, 0.0, 374.0, 323, 427, 372.0, 427.0, 427.0, 427.0, 0.022214159305141097, 0.022279239849980377, 0.014245408148153633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 116.49999999999999, 115, 122, 116.0, 122.0, 122.0, 122.0, 0.05671305321811131, 0.0421471030263503, 0.02846729429112228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 171.375, 114, 342, 115.5, 342.0, 342.0, 342.0, 0.0567158676818807, 0.015175925532065733, 0.032345768287322586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 171.375, 114, 341, 115.0, 341.0, 341.0, 341.0, 0.05671626977093717, 0.015286807086697909, 0.033342963283304855], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 206.73684210526315, 114, 539, 117.0, 461.0, 467.0, 539.0, 0.25412167524141555, 0.1888540965417161, 0.12284202074658274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 199.37500000000003, 114, 341, 115.5, 341.0, 341.0, 341.0, 0.0567158676818807, 0.015286698711131906, 0.03339811348845123], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 776.2982456140353, 561, 2031, 685.0, 1030.0, 1146.999999999999, 2031.0, 0.2534099194423204, 74.51093031727368, 0.12744737159452635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 115.55555555555556, 113, 117, 116.0, 117.0, 117.0, 117.0, 0.049568205851251324, 0.036837309231252204, 0.027833709340302253], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 185.29824561403504, 113, 859, 118.0, 345.2, 414.99999999999966, 859.0, 0.2545608824777259, 0.45045343657191345, 0.1238001166737378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 578.0909090909091, 113, 1586, 117.5, 1476.7, 1569.6499999999999, 1586.0, 0.10445203040503649, 38.465503418726826, 0.05773422774340884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 206.50000000000003, 114, 895, 115.5, 508.60000000000036, 895.0, 895.0, 0.09128460256966157, 5.15669416555889, 0.053175063899221796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbbfb78a-2c34-4065-9928-edeaf134773b", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1277.385964912281, 789, 3786, 1131.0, 1480.6, 3542.3999999999987, 3786.0, 0.25228271597834795, 227.00443130302915, 0.12663409766881917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 132.76470588235296, 116, 341, 118.0, 180.99999999999986, 341.0, 341.0, 0.08350320504948792, 0.06238276549107252, 0.029682779919935162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 434.0454545454546, 113, 915, 117.5, 912.0, 914.55, 915.0, 0.10445252632678448, 12.580844994231372, 0.057836506276647257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 193.5, 114, 909, 116.0, 513.5000000000005, 909.0, 909.0, 0.09128460256966157, 1.7006103053184691, 0.05326420901891873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9635b3c8-eae5-4050-932e-a4ee55e232d0", 1, 0, 0.0, 2083.0, 2083, 2083, 2083.0, 2083.0, 2083.0, 2083.0, 0.48007681228996635, 0.08673262722035525, 0.33099045847335573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8301c4e5-c4b2-4487-a6e4-3de6e3107a42", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 582.5384615384615, 119, 2083, 457.0, 1785.7999999999997, 2083.0, 2083.0, 0.07987073229173706, 0.015833748686740843, 0.05419113987822785], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 13, 7.6923076923076925, 243.0769230769231, 114, 3169, 123.0, 356.0, 825.5, 2599.2000000000094, 0.6835518811833133, 1.484921032567809, 0.3259803370133232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 118.75, 115, 125, 118.0, 125.0, 125.0, 125.0, 0.04057535858473149, 0.03142212827899617, 0.014423271996916273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 373.75, 233, 458, 456.5, 458.0, 458.0, 458.0, 0.05666645416746354, 0.0878219362927389, 0.12744418354264506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 122.2105263157895, 116, 137, 119.0, 133.0, 137.0, 137.0, 0.09725883647718256, 0.07892782530521358, 0.03457247702899849], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32c3421f-4f1b-4915-bc3c-e43d71ca62a4", 1, 0, 0.0, 648.0, 648, 648, 648.0, 648.0, 648.0, 648.0, 1.5432098765432098, 0.27880256558641975, 1.0639708719135803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f71d672d-77ab-46f8-8b7e-c48f2010539b", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.8209150064267352, 1.533880944730077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 792.3636363636363, 145, 1946, 743.5, 1562.0, 1890.1999999999991, 1946.0, 0.09354059661893262, 0.057458042259090444, 0.042294234604068164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 117.31818181818181, 114, 129, 116.0, 125.3, 128.85, 129.0, 0.10445004676513457, 0.0776235210822924, 0.05242902738015544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 188.54545454545453, 113, 461, 116.0, 425.3999999999999, 460.7, 461.0, 0.10445203040503649, 0.0921281003261752, 0.05598161466221638], "isController": false}, {"data": ["login", 22, 0, 0.0, 3912.545454545455, 1774, 6105, 3667.0, 5762.7, 6080.25, 6105.0, 0.09456996457924963, 46.40883740870775, 0.20683821443309605], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dc1230ac-0ec3-43ce-89c1-a2d16f3bae99", 3, 0, 0.0, 885.3333333333334, 225, 1415, 1016.0, 1415.0, 1415.0, 1415.0, 0.04047272138578598, 0.026020060135718528, 0.025954186565754683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17384713-52c2-43c5-a06c-06e135efe5f1", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.9202764769452451, 1.7195380043227666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 319.0, 230, 684, 236.5, 684.0, 684.0, 684.0, 0.039196472317491425, 0.0607468765311122, 0.08815378490935816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e51c6f5c-ea46-48a1-ba4b-5d8123385f1b", 1, 0, 0.0, 1340.0, 1340, 1340, 1340.0, 1340.0, 1340.0, 1340.0, 0.746268656716418, 0.13482392723880596, 0.5145172574626865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 135.6875, 115, 389, 118.0, 209.80000000000018, 389.0, 389.0, 0.08902985282252456, 0.07207592577136021, 0.031647330495506776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 490.1111111111111, 230, 1584, 457.0, 1281.6000000000004, 1584.0, 1584.0, 0.14763295167481383, 19.827861516190413, 0.32783293793674745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8ae0919-2065-43c5-af49-4b8dc4732785", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc1230ac-0ec3-43ce-89c1-a2d16f3bae99", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e7cc134-dd54-4203-9d79-40ccf51d2b7a", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 120.12500000000001, 114, 131, 117.5, 131.0, 131.0, 131.0, 0.05491375108969475, 0.045529076831202, 0.01952012245766493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 697.2727272727271, 230, 1704, 238.0, 1603.0, 1689.2999999999997, 1704.0, 0.10439304932097067, 51.18712153812482, 0.22385562085393515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e51c6f5c-ea46-48a1-ba4b-5d8123385f1b", 3, 0, 0.0, 389.0, 304, 460, 403.0, 460.0, 460.0, 460.0, 0.020401224073444406, 0.0241135561883713, 0.013082816218973137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8ae0919-2065-43c5-af49-4b8dc4732785", 3, 0, 0.0, 394.3333333333333, 243, 590, 350.0, 590.0, 590.0, 590.0, 0.08419162012741, 0.03809451561754553, 0.053990068896809136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 167.31818181818184, 115, 495, 119.0, 344.7, 472.49999999999966, 495.0, 0.10579873233882525, 0.08213866426695905, 0.037608143136066786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 335.5263157894737, 231, 801, 235.0, 465.0, 801.0, 801.0, 0.09619912205643345, 0.1490898502964452, 0.21635408017184202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 5, 35.714285714285715, 1383.0, 114, 3724, 1407.0, 3669.5, 3724.0, 3724.0, 0.07653493546464905, 58.86885081086031, 0.12896051207338607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e14a464-1b00-4da8-b454-141d1b14415f", 3, 0, 0.0, 373.6666666666667, 223, 519, 379.0, 519.0, 519.0, 519.0, 0.02022776462973077, 0.02788560651266595, 0.012971580833518754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 150.2941176470588, 114, 471, 116.0, 366.9999999999999, 471.0, 471.0, 0.08117929641426272, 0.060329535714115166, 0.040748201520440466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32c3421f-4f1b-4915-bc3c-e43d71ca62a4", 3, 0, 0.0, 399.0, 220, 531, 446.0, 531.0, 531.0, 531.0, 0.025508468811645466, 0.025583200653867082, 0.016357969908509625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 182.41176470588235, 113, 344, 116.0, 343.2, 344.0, 344.0, 0.08118162239084653, 0.02172242630380073, 0.046298894019779664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 155.41176470588232, 114, 341, 115.0, 341.0, 341.0, 341.0, 0.0811823977459946, 0.02188119314247511, 0.04772637054989136], "isController": false}, {"data": ["register", 22, 9, 40.90909090909091, 1321.4545454545455, 176, 5033, 1101.5, 2108.6, 4602.799999999994, 5033.0, 0.09627629546319838, 0.029829924641917825, 0.043437156742185214], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 176.47058823529414, 113, 462, 116.0, 368.3999999999999, 462.0, 462.0, 0.08118201006656925, 0.02188108865075499, 0.04780542194349732], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 28.125, 0.6870229007633588], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.22900763358778625], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.25, 0.15267175572519084], "isController": false}, {"data": ["401/Unauthorized", 18, 56.25, 1.3740458015267176], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1310, 32, "401/Unauthorized", 18, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
