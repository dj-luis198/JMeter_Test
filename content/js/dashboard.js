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

    var data = {"OkPercent": 97.94050343249428, "KoPercent": 2.059496567505721};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7329212752114509, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bb61654-6325-43c9-87a8-6cd0bf635607"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf557a4d-5814-4b5e-a610-90d1984c7021"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/56434b12-d00c-482d-934b-c67e8332f066"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c1d0b3e-9d61-40fc-873e-22f1701eed0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59d8aeb5-3802-4bec-8dc4-46ca9df9d593"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97e876ad-92d5-49af-a14f-c14959e1c6f4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4bd8cf06-6a6c-40f7-a6fa-338afb9629a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2cfc4148-6981-410b-9bb2-5afa2e2ca708"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65e41f21-d6b9-4bff-819c-0886e8927135"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a699b321-da34-4a1e-b528-00a698b6e8cf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a9172083-c88a-49ad-b07e-9f23ca325f20"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1c1d0b3e-9d61-40fc-873e-22f1701eed0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c49f705b-0735-474a-bdf0-e5a5388715e1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=265e7324-508c-4fc0-b98d-d87f241b0e5a"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a238d1a4-373d-4d8e-affb-9c85ad61c52a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7dffcb91-6ee5-4fde-9ab0-50307d25ed81"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8bb61654-6325-43c9-87a8-6cd0bf635607"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/265e7324-508c-4fc0-b98d-d87f241b0e5a"], "isController": false}, {"data": [0.14583333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/79f6d980-2752-4f57-9f16-aa35a1fc6c04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.17391304347826086, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf557a4d-5814-4b5e-a610-90d1984c7021"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "addBook"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77aef2a1-7830-4411-86d7-37221973554f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56434b12-d00c-482d-934b-c67e8332f066"], "isController": false}, {"data": [0.9352941176470588, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bd8cf06-6a6c-40f7-a6fa-338afb9629a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97e876ad-92d5-49af-a14f-c14959e1c6f4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65e41f21-d6b9-4bff-819c-0886e8927135"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7dffcb91-6ee5-4fde-9ab0-50307d25ed81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c49f705b-0735-474a-bdf0-e5a5388715e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a238d1a4-373d-4d8e-affb-9c85ad61c52a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9172083-c88a-49ad-b07e-9f23ca325f20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cfc4148-6981-410b-9bb2-5afa2e2ca708"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1311, 27, 2.059496567505721, 451.9038901601829, 115, 3532, 146.0, 1226.6, 1510.7999999999997, 2210.3199999999865, 5.115518633988739, 740.9018413830728, 3.727413531736896], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2020.1964285714287, 1534, 2874, 2013.0, 2559.6, 2629.2, 2874.0, 0.2459711247468913, 295.9860398346942, 1.2094380987310525], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bb61654-6325-43c9-87a8-6cd0bf635607", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 760.2352941176471, 131, 2110, 623.0, 1478.7999999999995, 2110.0, 2110.0, 0.0850318869576091, 0.017076716268600724, 0.05707706796298612], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 760.2352941176471, 131, 2110, 623.0, 1478.7999999999995, 2110.0, 2110.0, 0.08426395435867695, 0.01692249451045121, 0.05656159849960594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 166.2941176470588, 118, 383, 127.0, 362.2, 383.0, 383.0, 0.09022827754218173, 0.024143113326716592, 0.05145831453577551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 125.05882352941177, 119, 133, 125.0, 132.2, 133.0, 133.0, 0.0902215735703861, 0.06704943113971075, 0.04528700079607271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 230.11764705882356, 118, 452, 129.0, 396.79999999999995, 452.0, 452.0, 0.09022827754218173, 0.024319340431291168, 0.05313247202923396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 138.23529411764707, 119, 371, 125.0, 181.39999999999984, 371.0, 371.0, 0.09022396773166332, 0.024318178802674877, 0.05304182477974738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf557a4d-5814-4b5e-a610-90d1984c7021", 3, 0, 0.0, 574.0, 365, 977, 380.0, 977.0, 977.0, 977.0, 0.10048568079048735, 0.045467153743091605, 0.06443905962150394], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 297.4117647058824, 120, 806, 264.0, 536.3999999999997, 806.0, 806.0, 0.08533236957951221, 0.1481796989900663, 0.05515133789861511], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/56434b12-d00c-482d-934b-c67e8332f066", 3, 0, 0.0, 351.6666666666667, 230, 561, 264.0, 561.0, 561.0, 561.0, 0.04231192350004231, 0.03464013268314011, 0.027133622817409945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 149.9, 118, 372, 128.0, 342.2000000000005, 371.65, 372.0, 0.09432182607055273, 0.07009659144501038, 0.04734513535182041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 135.95000000000002, 117, 358, 124.0, 139.60000000000002, 347.09999999999985, 358.0, 0.094222289224739, 0.03228769657125089, 0.05334048931990351], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 883.8333333333334, 702, 1003, 949.5, 1003.0, 1003.0, 1003.0, 0.061452742840755456, 18.06914681828424, 0.03504726740136835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1183.3333333333335, 947, 1382, 1164.0, 1382.0, 1382.0, 1382.0, 0.06110104075439419, 54.97882387497709, 0.034787018320128725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 284.5, 118, 379, 359.0, 379.0, 379.0, 379.0, 0.06167065812870667, 0.10912815676681296, 0.03414771792868816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c1d0b3e-9d61-40fc-873e-22f1701eed0d", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 125.0, 117, 130, 127.0, 129.9, 130.0, 130.0, 0.06381254426995259, 0.04742318963811906, 0.03203090601050355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 125.7, 116, 130, 127.5, 129.9, 130.0, 130.0, 0.06381498758798491, 0.017075494725691275, 0.03639448510877265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 122.39999999999999, 116, 128, 122.0, 128.0, 128.0, 128.0, 0.0638170238292767, 0.017200682203984734, 0.03751743002463337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 149.4, 119, 367, 126.5, 343.6000000000001, 367.0, 367.0, 0.0638170238292767, 0.017200682203984734, 0.03757975133696665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 205.83333333333334, 120, 375, 127.5, 375.0, 375.0, 375.0, 0.061820617175828145, 0.04594286100664571, 0.03471372546494256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59d8aeb5-3802-4bec-8dc4-46ca9df9d593", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.7585176662707839, 1.417291419239905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 171.40000000000003, 119, 827, 125.5, 331.90000000000043, 803.3499999999997, 827.0, 0.09432582971357963, 4.2678799400205625, 0.05504796468440935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 741.0, 120, 1512, 1063.0, 1394.0, 1512.0, 1512.0, 0.09243627978029356, 43.78776318494067, 0.05016150503291218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 226.9, 117, 948, 127.0, 381.0, 919.6499999999996, 948.0, 0.09421208081512293, 1.4091974396689386, 0.05507358552337166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 572.9473684210527, 116, 1170, 746.0, 1109.0, 1170.0, 1170.0, 0.09243852837862822, 14.317063240116376, 0.05025299725846785], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 447.5625, 129, 896, 491.0, 733.6000000000001, 896.0, 896.0, 0.08166807033662558, 0.016504088188755327, 0.05521467377434092], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97e876ad-92d5-49af-a14f-c14959e1c6f4", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bd8cf06-6a6c-40f7-a6fa-338afb9629a3", 3, 0, 0.0, 504.66666666666663, 217, 1000, 297.0, 1000.0, 1000.0, 1000.0, 0.03457575548025724, 0.028824384695618096, 0.02217260361201392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 277.8, 244, 488, 257.0, 465.30000000000007, 488.0, 488.0, 0.06376168432865321, 0.09881815725544206, 0.14340152246961754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cfc4148-6981-410b-9bb2-5afa2e2ca708", 3, 0, 0.0, 332.0, 245, 479, 272.0, 479.0, 479.0, 479.0, 0.08504606661941885, 0.03942239546420978, 0.054538004961020556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 689.6956521739132, 178, 2354, 538.0, 1261.6000000000001, 2140.399999999997, 2354.0, 0.11094496165163283, 0.06814880945202836, 0.0501635910592832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 126.8421052631579, 120, 150, 127.0, 133.0, 150.0, 150.0, 0.09243987759014105, 0.06869799496689193, 0.04640048543098877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 187.78947368421052, 117, 376, 126.0, 373.0, 376.0, 376.0, 0.09243987759014105, 0.09780876439507831, 0.04863356224366179], "isController": false}, {"data": ["login", 23, 0, 0.0, 3354.782608695652, 1860, 5482, 3141.0, 4987.200000000001, 5402.399999999999, 5482.0, 0.11099957530597274, 34.79376701189143, 0.21549055628884986], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65e41f21-d6b9-4bff-819c-0886e8927135", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a699b321-da34-4a1e-b528-00a698b6e8cf", 2, 0, 0.0, 655.0, 504, 806, 655.0, 806.0, 806.0, 806.0, 0.02314627287141088, 0.026333406147650076, 0.014387307307278345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9172083-c88a-49ad-b07e-9f23ca325f20", 3, 0, 0.0, 1180.6666666666667, 265, 2092, 1185.0, 2092.0, 2092.0, 2092.0, 0.06891798759476223, 0.030510567424764528, 0.04419545428440156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c1d0b3e-9d61-40fc-873e-22f1701eed0d", 3, 0, 0.0, 785.3333333333334, 244, 1831, 281.0, 1831.0, 1831.0, 1831.0, 0.02644080344788077, 0.026518266739231983, 0.016955853773543333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 154.84999999999997, 124, 364, 132.5, 340.90000000000043, 363.95, 364.0, 0.09098146252701012, 0.07365589104969862, 0.03234106675764813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c49f705b-0735-474a-bdf0-e5a5388715e1", 3, 0, 0.0, 462.33333333333337, 236, 901, 250.0, 901.0, 901.0, 901.0, 0.017970851279225097, 0.024774269260259857, 0.011524276373721823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=265e7324-508c-4fc0-b98d-d87f241b0e5a", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.28228759765625, 1.0772705078125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 869.6842105263157, 245, 1647, 1185.0, 1521.0, 1647.0, 1647.0, 0.09237920203817693, 58.23499715417359, 0.19532294583904625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a238d1a4-373d-4d8e-affb-9c85ad61c52a", 3, 0, 0.0, 455.3333333333333, 265, 572, 529.0, 572.0, 572.0, 572.0, 0.03738597278301181, 0.031167147232191814, 0.02397472864014755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7dffcb91-6ee5-4fde-9ab0-50307d25ed81", 1, 0, 0.0, 664.0, 664, 664, 664.0, 664.0, 664.0, 664.0, 1.5060240963855422, 0.2720844314759036, 1.0383330195783131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 372.82352941176464, 240, 575, 269.0, 525.4, 575.0, 575.0, 0.09015936994510886, 0.13972941416297632, 0.2027705361167829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 758.0, 120, 1757, 600.5, 1718.6000000000001, 1757.0, 1757.0, 0.1097263242595759, 65.65009561048984, 0.16006220396752102], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1467.7916666666667, 227, 3532, 1466.0, 2751.5, 3468.75, 3532.0, 0.0992773436692079, 0.031169595693017905, 0.0447911452882559], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 380.1499999999999, 241, 1069, 260.5, 753.2, 1053.2499999999998, 1069.0, 0.09415220645695832, 5.7705602306375985, 0.21054603277909067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 158.5625, 121, 359, 131.0, 354.8, 359.0, 359.0, 0.10589434391835546, 0.08221289396005137, 0.03764213006472792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 644.75, 248, 1766, 389.0, 1601.5000000000002, 1766.0, 1766.0, 0.08659929962816426, 26.001376286134914, 0.1892245438652515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bb61654-6325-43c9-87a8-6cd0bf635607", 3, 0, 0.0, 541.0, 419, 677, 527.0, 677.0, 677.0, 677.0, 0.022093913863194484, 0.022158642126465563, 0.014168297627113653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 165.99999999999997, 121, 384, 131.0, 384.0, 384.0, 384.0, 0.03371690324693778, 0.025057190791913726, 0.016924304950123068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 163.42857142857144, 123, 370, 128.0, 370.0, 370.0, 370.0, 0.033719339486309945, 0.01625753868089944, 0.018826003993333205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 330.57142857142856, 120, 1305, 129.0, 1305.0, 1305.0, 1305.0, 0.03352923989213165, 4.317698865813587, 0.019299894502641624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 280.42857142857144, 119, 925, 139.0, 925.0, 925.0, 925.0, 0.03359037971524956, 1.4187155548650867, 0.019367890536150446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 132.33333333333334, 129, 137, 131.0, 137.0, 137.0, 137.0, 0.056907638902061956, 0.016783307566819054, 0.03517825725098166], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1378.1071428571427, 948, 2324, 1247.0, 2017.8000000000002, 2066.5, 2324.0, 0.25422882410089254, 304.14605786429627, 0.5020026194648484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/265e7324-508c-4fc0-b98d-d87f241b0e5a", 3, 0, 0.0, 974.6666666666666, 245, 2327, 352.0, 2327.0, 2327.0, 2327.0, 0.025703637064644645, 0.02577894068885747, 0.016483126633251938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1467.7916666666667, 227, 3532, 1466.0, 2751.5, 3468.75, 3532.0, 0.09963922298012613, 0.03128321307432671, 0.04495441505548659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 154.5, 120, 357, 126.0, 357.0, 357.0, 357.0, 0.05180676078228209, 0.01396354099209947, 0.030507301515347755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 200.625, 119, 478, 126.5, 478.0, 478.0, 478.0, 0.051722020003491236, 0.013940700704065997, 0.030406890666114964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 222.31250000000003, 119, 1426, 125.0, 691.0000000000007, 1426.0, 1426.0, 0.10387519395446371, 5.867940392274932, 0.060509329290857033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 175.5, 118, 710, 125.0, 456.60000000000025, 710.0, 710.0, 0.1038738452149864, 1.9351448837262146, 0.060609982925736695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79f6d980-2752-4f57-9f16-aa35a1fc6c04", 1, 0, 0.0, 1037.0, 1037, 1037, 1037.0, 1037.0, 1037.0, 1037.0, 0.9643201542912248, 0.3079420805207329, 0.5753902483124398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 186.0, 121, 379, 127.5, 379.0, 379.0, 379.0, 0.051722020003491236, 0.013839681133746678, 0.029497714533241095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 126.625, 118, 151, 126.5, 136.3, 151.0, 151.0, 0.10387519395446371, 0.07719631113217469, 0.05214047821542417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 189.0, 122, 382, 129.0, 382.0, 382.0, 382.0, 0.051803070627011415, 0.03849818041714422, 0.02600271318582409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 185.875, 115, 378, 126.0, 376.6, 378.0, 378.0, 0.10387317085838191, 0.03754497789449083, 0.05869493504680785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 136.0, 129, 155, 132.0, 155.0, 155.0, 155.0, 0.0536113977831687, 0.0421980338019863, 0.019057176555735748], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 826.3124999999999, 122, 2327, 624.5, 1979.8000000000004, 2327.0, 2327.0, 0.08258192384914347, 0.0162653728186759, 0.05619542657434695], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1887.1304347826087, 1246, 3400, 1756.0, 2793.800000000001, 3332.999999999999, 3400.0, 0.10977053186209003, 0.05681482606143332, 0.05049015674516055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf557a4d-5814-4b5e-a610-90d1984c7021", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 421.375, 248, 762, 263.0, 762.0, 762.0, 762.0, 0.05167591450219945, 0.08008757452635794, 0.11622034286969271], "isController": false}, {"data": ["addBook", 57, 8, 14.035087719298245, 1310.543859649123, 607, 4519, 1026.0, 2199.4, 2529.499999999999, 4519.0, 0.2823081913950482, 101.89884374365425, 1.0223805081052166], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 215.66071428571425, 119, 603, 129.5, 509.3, 533.45, 603.0, 0.2552974214960429, 0.18972786890477406, 0.12341037464896604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77aef2a1-7830-4411-86d7-37221973554f", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 805.8214285714288, 591, 1178, 748.5, 1040.0, 1124.6, 1178.0, 0.25519271607076127, 75.0351317204546, 0.1283439929457442], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 223.2678571428571, 119, 548, 132.0, 385.3, 486.49999999999994, 548.0, 0.2557918585105606, 0.45263168713001534, 0.1243987749397062], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1159.8035714285716, 820, 1780, 1107.5, 1521.1000000000001, 1558.1999999999998, 1780.0, 0.2548582351067219, 229.32188794201977, 0.12792688754380377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 162.5, 123, 380, 131.5, 365.3, 380.0, 380.0, 0.08992148730139997, 0.06717767361872165, 0.03196427868916952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56434b12-d00c-482d-934b-c67e8332f066", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.2928104740680713, 1.1174280794165317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 8, 4.705882352941177, 213.81764705882347, 120, 2607, 134.0, 362.8, 421.34999999999997, 2119.9399999999946, 0.7261915949730455, 1.6644880362604548, 0.34703932087202793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 167.0, 125, 384, 131.0, 384.0, 384.0, 384.0, 0.03353309476931626, 0.025968500148503704, 0.01191996728128039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bd8cf06-6a6c-40f7-a6fa-338afb9629a3", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 132.76470588235293, 123, 152, 131.0, 149.6, 152.0, 152.0, 0.08948734280495445, 0.07262107604581752, 0.031809953887698646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97e876ad-92d5-49af-a14f-c14959e1c6f4", 3, 0, 0.0, 390.0, 236, 469, 465.0, 469.0, 469.0, 469.0, 0.03325905477766322, 0.027726705496613123, 0.02132823499739471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65e41f21-d6b9-4bff-819c-0886e8927135", 3, 0, 0.0, 742.0, 248, 1480, 498.0, 1480.0, 1480.0, 1480.0, 0.05167513564723107, 0.033222133106536905, 0.033138026440444404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 535.1428571428571, 245, 1439, 276.0, 1439.0, 1439.0, 1439.0, 0.03350628960922093, 5.770962895972544, 0.07413173087508855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 395.49999999999994, 238, 1548, 257.5, 819.3000000000008, 1548.0, 1548.0, 0.10378827192527244, 7.911226819943566, 0.23176255594836534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 154.60000000000002, 127, 350, 133.5, 328.9000000000001, 350.0, 350.0, 0.06579077218629314, 0.05454723201773719, 0.02338656355059639], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7dffcb91-6ee5-4fde-9ab0-50307d25ed81", 3, 0, 0.0, 732.6666666666667, 270, 1371, 557.0, 1371.0, 1371.0, 1371.0, 0.017688470654827183, 0.024384984773174846, 0.011343192444664568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c49f705b-0735-474a-bdf0-e5a5388715e1", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 158.47368421052633, 123, 366, 133.0, 360.0, 366.0, 366.0, 0.09300777349180553, 0.07220818352147011, 0.033061356983415245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a238d1a4-373d-4d8e-affb-9c85ad61c52a", 1, 0, 0.0, 896.0, 896, 896, 896.0, 896.0, 896.0, 896.0, 1.1160714285714286, 0.20163399832589285, 0.7694789341517857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9172083-c88a-49ad-b07e-9f23ca325f20", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 0.6522168321299638, 2.4890004512635375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cfc4148-6981-410b-9bb2-5afa2e2ca708", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 158.24999999999997, 119, 384, 126.0, 381.2, 384.0, 384.0, 0.0866593367311015, 0.06440210473864086, 0.04349892488260368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 201.4375, 118, 379, 130.5, 372.0, 379.0, 379.0, 0.08666496947768106, 0.0557313304697783, 0.0476064895812457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 452.56249999999994, 122, 1384, 131.0, 1381.9, 1384.0, 1384.0, 0.08666027547135066, 19.511785289689055, 0.049084921653694706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 375.875, 116, 1067, 135.0, 1011.7, 1067.0, 1067.0, 0.08666590833996869, 6.388183035690105, 0.049172746821798646], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.925925925925927, 0.5339435545385202], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.11111111111111, 0.2288329519450801], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.11111111111111, 0.2288329519450801], "isController": false}, {"data": ["401/Unauthorized", 14, 51.851851851851855, 1.0678871090770403], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1311, 27, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
