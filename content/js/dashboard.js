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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7592838196286472, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.017857142857142856, 500, 1500, "see books"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11a21495-96b6-4195-9c6f-94da422c3264"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a2419b19-4c52-4c85-8edd-af0817028ef1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8538c8a-c258-4eea-b834-5de73909123f"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37298110-6064-443a-943d-0cad9ba6b807"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/448c004a-2f70-44fc-b188-3a2d3d337214"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d597fa8e-2353-4ce3-843f-fa977e138b0a"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/303d65ed-761b-4257-b1fb-965977f0bf26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f87529af-3d38-4a3e-80e9-3bee7725683f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c513f5b1-6e97-48cb-8b48-d536d8d86cdc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2733f438-1166-4469-9130-0d4569653257"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2419b19-4c52-4c85-8edd-af0817028ef1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f1eaa1f-1a1a-4743-a00b-898b0a5f6502"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbf968bd-b3a7-4235-8e3d-7ee3b4fcce69"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/11a21495-96b6-4195-9c6f-94da422c3264"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f8538c8a-c258-4eea-b834-5de73909123f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3482142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8917b4d2-3582-45de-9680-9afe790f2b7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37298110-6064-443a-943d-0cad9ba6b807"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f87529af-3d38-4a3e-80e9-3bee7725683f"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d597fa8e-2353-4ce3-843f-fa977e138b0a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=448c004a-2f70-44fc-b188-3a2d3d337214"], "isController": false}, {"data": [0.26785714285714285, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4732142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9226190476190477, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b224ab52-7cf0-4b5f-bd0d-3ffefe21f010"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b224ab52-7cf0-4b5f-bd0d-3ffefe21f010"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=303d65ed-761b-4257-b1fb-965977f0bf26"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2733f438-1166-4469-9130-0d4569653257"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c513f5b1-6e97-48cb-8b48-d536d8d86cdc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8917b4d2-3582-45de-9680-9afe790f2b7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16c0ce6a-480c-4f9f-90f9-4800d59028df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dbf968bd-b3a7-4235-8e3d-7ee3b4fcce69"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1294, 24, 1.8547140649149922, 420.4729520865534, 113, 2463, 136.0, 1172.0, 1420.25, 1872.5499999999995, 5.210598373198035, 754.8482667097024, 3.8108627222255778], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1980.2678571428573, 1411, 3049, 1948.0, 2401.1, 2583.7, 3049.0, 0.25026814444047196, 301.158293204773, 1.2305665109939221], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 687.0714285714287, 126, 1479, 562.5, 1449.5, 1479.0, 1479.0, 0.08382781766252118, 0.015828815737475226, 0.056690198956343675], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 687.0714285714287, 126, 1479, 562.5, 1449.5, 1479.0, 1479.0, 0.0845640421612153, 0.01596783357494488, 0.05718808515297031], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11a21495-96b6-4195-9c6f-94da422c3264", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 165.15000000000003, 115, 360, 118.0, 355.7, 359.8, 360.0, 0.1324608578165152, 0.05533862790420431, 0.07443161873791294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 131.70000000000002, 115, 350, 120.0, 124.9, 338.74999999999983, 350.0, 0.13245471704361073, 0.09843558561541772, 0.06648605914103116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 235.70000000000007, 116, 694, 122.0, 657.8000000000006, 693.8, 694.0, 0.13245998052838284, 3.926895129777666, 0.07686300823238779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 269.04999999999995, 114, 1272, 119.0, 873.6000000000009, 1254.2999999999997, 1272.0, 0.13246261242764232, 11.951141682838145, 0.07673517743366935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2419b19-4c52-4c85-8edd-af0817028ef1", 3, 0, 0.0, 355.0, 229, 533, 303.0, 533.0, 533.0, 533.0, 0.07528986598403856, 0.03406670368418411, 0.048281587235858056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8538c8a-c258-4eea-b834-5de73909123f", 1, 0, 0.0, 1466.0, 1466, 1466, 1466.0, 1466.0, 1466.0, 1466.0, 0.6821282401091405, 0.12323605900409278, 0.47029544679399726], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 252.07142857142856, 117, 417, 234.0, 406.0, 417.0, 417.0, 0.08381527114240214, 0.16472483708406674, 0.05417941669061389], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37298110-6064-443a-943d-0cad9ba6b807", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 135.7777777777778, 115, 351, 120.0, 170.10000000000028, 351.0, 351.0, 0.08680597418004524, 0.06451108042091253, 0.04357253000834302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 132.27777777777774, 115, 350, 120.0, 146.6000000000003, 350.0, 350.0, 0.08680681144113775, 0.030470923937942776, 0.04910198654976683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 826.2857142857143, 689, 927, 914.0, 927.0, 927.0, 927.0, 0.07002731065115396, 20.590354456988226, 0.03993745060573624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1190.857142857143, 1035, 1430, 1131.0, 1430.0, 1430.0, 1430.0, 0.0699321657991748, 62.925085713732685, 0.039814895176678626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 286.5714285714286, 117, 365, 351.0, 365.0, 365.0, 365.0, 0.07042395219219702, 0.12461738415259865, 0.038994512590796594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 161.5, 117, 364, 121.0, 361.90000000000003, 364.0, 364.0, 0.061706810374971714, 0.04585828388218113, 0.030973926301499477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 217.91666666666666, 116, 372, 120.5, 368.7, 372.0, 372.0, 0.06163613110005085, 0.024207028701891717, 0.03472048335567643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 225.49999999999997, 116, 1171, 119.5, 924.1000000000009, 1171.0, 1171.0, 0.061709666304979455, 4.642452144475185, 0.0358366030885688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 247.58333333333331, 117, 714, 121.5, 607.2000000000004, 714.0, 714.0, 0.06163391508900965, 1.525429366891288, 0.035852801518248774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/448c004a-2f70-44fc-b188-3a2d3d337214", 3, 0, 0.0, 526.0, 289, 894, 395.0, 894.0, 894.0, 894.0, 0.020180684394276758, 0.023852885753782194, 0.012941389406486072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 118.57142857142858, 114, 123, 119.0, 123.0, 123.0, 123.0, 0.07058657443354274, 0.05245740541399026, 0.03963601591727254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d597fa8e-2353-4ce3-843f-fa977e138b0a", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 205.0, 116, 1421, 120.0, 467.9000000000015, 1421.0, 1421.0, 0.0868072300777407, 4.361502869762631, 0.05061871250409923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 865.7500000000002, 117, 1584, 1106.0, 1525.2, 1584.0, 1584.0, 0.09514408382193784, 53.51637528171569, 0.050824036963476565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 177.16666666666666, 115, 695, 120.0, 392.6000000000005, 695.0, 695.0, 0.0868072300777407, 1.4401089641727272, 0.05070348518972202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 622.0, 116, 1036, 754.5, 987.0, 1036.0, 1036.0, 0.09514295228580943, 17.494108384175348, 0.0509163455592027], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 525.2142857142857, 128, 1466, 474.5, 1208.5, 1466.0, 1466.0, 0.08476628723661904, 0.016006022569023975, 0.05801074526217002], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 468.8333333333333, 237, 1292, 359.5, 1123.4000000000005, 1292.0, 1292.0, 0.06159405412064222, 6.228162381495606, 0.13721318664538248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 649.6818181818184, 162, 1471, 587.0, 1209.8, 1434.6999999999994, 1471.0, 0.09792401096748922, 0.060150588768115944, 0.04427618855268312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 141.0625, 115, 459, 119.5, 228.70000000000022, 459.0, 459.0, 0.09514182077659511, 0.07070598204198134, 0.047756734257001845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 195.6875, 115, 373, 122.0, 369.5, 373.0, 373.0, 0.09514464960009515, 0.11477287931495853, 0.04926801801801802], "isController": false}, {"data": ["login", 22, 0, 0.0, 2866.1818181818185, 1694, 5105, 2952.5, 3723.0999999999995, 4921.699999999997, 5105.0, 0.09925334416097087, 37.91533700316934, 0.20211942545848277], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/303d65ed-761b-4257-b1fb-965977f0bf26", 3, 0, 0.0, 740.0, 249, 1658, 313.0, 1658.0, 1658.0, 1658.0, 0.08211079483249398, 0.03806177468797898, 0.052655685488285524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 125.72222222222221, 120, 145, 124.0, 137.8, 145.0, 145.0, 0.08949569177683753, 0.07245305515917803, 0.031812921686297714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f87529af-3d38-4a3e-80e9-3bee7725683f", 3, 0, 0.0, 363.6666666666667, 225, 449, 417.0, 449.0, 449.0, 449.0, 0.06752346440388035, 0.042795633201287445, 0.04330117997254045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c513f5b1-6e97-48cb-8b48-d536d8d86cdc", 1, 0, 0.0, 951.0, 951, 951, 951.0, 951.0, 951.0, 951.0, 1.0515247108307044, 0.18997272607781285, 0.7249769978969506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2733f438-1166-4469-9130-0d4569653257", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1017.1875000000001, 238, 1703, 1225.5, 1645.6000000000001, 1703.0, 1703.0, 0.09507454438495684, 71.14413533044348, 0.19862130769093644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2419b19-4c52-4c85-8edd-af0817028ef1", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f1eaa1f-1a1a-4743-a00b-898b0a5f6502", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 1.071597105704698, 2.002280830536913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 462.3499999999999, 236, 1392, 467.5, 1017.5000000000005, 1374.3499999999997, 1392.0, 0.13235041094802602, 16.018315952691346, 0.2942728668422515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 1044.5555555555557, 115, 1548, 1183.0, 1548.0, 1548.0, 1548.0, 0.08671272075613493, 80.69070295112293, 0.164844495187444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbf968bd-b3a7-4235-8e3d-7ee3b4fcce69", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["register", 24, 9, 37.5, 1208.4999999999995, 296, 2463, 1180.0, 2080.0, 2407.25, 2463.0, 0.09501413335233616, 0.029552735813202214, 0.04286770469607354], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 369.33333333333326, 237, 1773, 244.0, 628.2000000000019, 1773.0, 1773.0, 0.08675493177688559, 5.893042427680125, 0.19388070473922914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 143.93333333333337, 119, 399, 125.0, 240.0000000000001, 399.0, 399.0, 0.07979147827012076, 0.06194748557104101, 0.028363377041331985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11a21495-96b6-4195-9c6f-94da422c3264", 3, 0, 0.0, 932.0, 227, 1650, 919.0, 1650.0, 1650.0, 1650.0, 0.03478865889719951, 0.02900187351423436, 0.02230913347248797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8538c8a-c258-4eea-b834-5de73909123f", 3, 0, 0.0, 388.0, 240, 608, 316.0, 608.0, 608.0, 608.0, 0.017699428308465638, 0.024400090783317698, 0.011350219325415788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 358.0833333333333, 236, 493, 355.0, 488.8, 493.0, 493.0, 0.0993533751169472, 0.15397832647519064, 0.22344806923274355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 149.625, 116, 357, 121.5, 357.0, 357.0, 357.0, 0.03995066093374682, 0.02968989547908333, 0.020053359101509634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 148.375, 113, 345, 120.5, 345.0, 345.0, 345.0, 0.03995225705282188, 0.018191152198123242, 0.022365850933134902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 293.75, 118, 1275, 120.0, 1275.0, 1275.0, 1275.0, 0.03990383176544528, 4.497603159198831, 0.02303043415368961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 298.75, 117, 1098, 120.0, 1098.0, 1098.0, 1098.0, 0.03990542414477688, 1.4761012494138892, 0.023070323333699135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 128.0, 128, 128, 128.0, 128.0, 128.0, 128.0, 7.8125, 2.3040771484375, 4.82940673828125], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1340.6964285714287, 928, 2169, 1196.5, 1889.9, 2073.35, 2169.0, 0.2578150177247825, 308.4363922010957, 0.5090839510151466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1208.4999999999995, 296, 2463, 1180.0, 2080.0, 2407.25, 2463.0, 0.09686676380250481, 0.030128969014743927, 0.043703559449958226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 230.9090909090909, 116, 412, 123.0, 402.00000000000006, 412.0, 412.0, 0.05508262393590386, 0.014846488482724088, 0.032436349837255886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 207.36363636363635, 114, 368, 121.0, 367.6, 368.0, 368.0, 0.0550162297877874, 0.014828593184989572, 0.03234352571508595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8917b4d2-3582-45de-9680-9afe790f2b7d", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 135.73333333333332, 117, 352, 121.0, 217.00000000000009, 352.0, 352.0, 0.07598360780300997, 0.020479956790655028, 0.04467005068106641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 150.13333333333333, 115, 356, 119.0, 353.0, 356.0, 356.0, 0.07589326371391275, 0.02045560623539055, 0.04469105275340761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 136.66666666666666, 117, 352, 121.0, 220.00000000000009, 352.0, 352.0, 0.07598322290438271, 0.0564680006154641, 0.03814001618442648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 162.0, 116, 360, 120.0, 357.6, 360.0, 360.0, 0.055020632737276476, 0.014722317744154056, 0.03137895460797799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 151.73333333333335, 117, 364, 119.0, 359.2, 364.0, 364.0, 0.07589326371391275, 0.02030737720469931, 0.04328287696184087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 184.9090909090909, 117, 360, 122.0, 359.4, 360.0, 360.0, 0.05508317559514867, 0.040935836550691544, 0.02764917212490861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 145.1818181818182, 118, 348, 125.0, 304.8000000000002, 348.0, 348.0, 0.057119119327032924, 0.0449589943140513, 0.020304061948281233], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 762.5714285714286, 115, 1946, 557.5, 1802.0, 1946.0, 1946.0, 0.08543149004723141, 0.015964771333463516, 0.05814418585315548], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/37298110-6064-443a-943d-0cad9ba6b807", 3, 0, 0.0, 386.0, 255, 473, 430.0, 473.0, 473.0, 473.0, 0.02091714718001994, 0.024723359834196747, 0.013413665346562267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1488.2727272727275, 999, 2422, 1461.5, 1840.1999999999998, 2339.4999999999986, 2422.0, 0.10050297169014019, 0.052018139644310846, 0.046227441080132846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f87529af-3d38-4a3e-80e9-3bee7725683f", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 464.9090909090909, 239, 724, 487.0, 723.6, 724.0, 724.0, 0.05498268045565647, 0.08521241590149103, 0.12365733700134458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d597fa8e-2353-4ce3-843f-fa977e138b0a", 3, 0, 0.0, 347.6666666666667, 229, 451, 363.0, 451.0, 451.0, 451.0, 0.04250736794377692, 0.02732814182583315, 0.027258956656653822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=448c004a-2f70-44fc-b188-3a2d3d337214", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["addBook", 56, 11, 19.642857142857142, 1190.8035714285713, 608, 2397, 1009.0, 1987.5, 2304.0499999999997, 2397.0, 0.26106617561362205, 84.65715852340271, 0.9480766765343466], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 205.8392857142857, 117, 487, 122.0, 477.6, 485.15, 487.0, 0.2590769458529183, 0.1925366755801473, 0.12523739081757282], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 753.3392857142859, 571, 1180, 702.5, 1036.9, 1098.15, 1180.0, 0.258997863267628, 76.15397133911145, 0.13025771443635592], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 173.625, 116, 493, 122.0, 354.6, 360.15, 493.0, 0.25956208168789513, 0.4593032148617832, 0.12623234050837087], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1126.6607142857144, 806, 1962, 1065.0, 1423.7, 1570.9999999999998, 1962.0, 0.2584360924462822, 232.5412502653585, 0.12972280421620025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 142.75, 120, 351, 123.5, 284.10000000000025, 351.0, 351.0, 0.0973291265521968, 0.07271170098870171, 0.0345974629541012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 11, 6.5476190476190474, 183.0476190476191, 116, 601, 127.0, 332.69999999999993, 436.29999999999956, 571.3300000000002, 0.7163507048379257, 1.5645062416852151, 0.34229364675808666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 159.25, 120, 393, 124.5, 393.0, 393.0, 393.0, 0.03928481985454795, 0.030422716938141144, 0.013964525807671343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b224ab52-7cf0-4b5f-bd0d-3ffefe21f010", 3, 0, 0.0, 365.0, 243, 582, 270.0, 582.0, 582.0, 582.0, 0.038946876460507866, 0.025039088870280935, 0.024975698771875162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b224ab52-7cf0-4b5f-bd0d-3ffefe21f010", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 160.70000000000005, 119, 354, 125.5, 350.8, 353.85, 354.0, 0.12354678098862133, 0.10026110839994563, 0.04391701980454899], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=303d65ed-761b-4257-b1fb-965977f0bf26", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 473.625, 238, 1395, 244.0, 1395.0, 1395.0, 1395.0, 0.03987936492111363, 6.017777667867202, 0.08841418770718577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 305.93333333333334, 236, 717, 243.0, 573.6000000000001, 717.0, 717.0, 0.07584606283087844, 0.11754658370371494, 0.17057957294874324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2733f438-1166-4469-9130-0d4569653257", 3, 0, 0.0, 357.6666666666667, 239, 506, 328.0, 506.0, 506.0, 506.0, 0.03868372188982876, 0.02486990583737363, 0.02480694405044357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c513f5b1-6e97-48cb-8b48-d536d8d86cdc", 3, 0, 0.0, 799.3333333333334, 219, 1946, 233.0, 1946.0, 1946.0, 1946.0, 0.019327530779092765, 0.0228444870634394, 0.012394282433207275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8917b4d2-3582-45de-9680-9afe790f2b7d", 3, 0, 0.0, 578.3333333333334, 215, 1080, 440.0, 1080.0, 1080.0, 1080.0, 0.019175455417066153, 0.026434913310961972, 0.012296760147011825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16c0ce6a-480c-4f9f-90f9-4800d59028df", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 162.41666666666663, 117, 366, 123.0, 361.5, 366.0, 366.0, 0.06341723786220492, 0.05257933100098825, 0.02254284627133065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 124.6875, 118, 133, 123.5, 133.0, 133.0, 133.0, 0.09519672999232477, 0.07390761752333808, 0.03383946261445919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbf968bd-b3a7-4235-8e3d-7ee3b4fcce69", 3, 0, 0.0, 617.0, 228, 1145, 478.0, 1145.0, 1145.0, 1145.0, 0.04062013404644236, 0.02574459667591903, 0.026048718773271952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 119.58333333333334, 116, 123, 119.0, 123.0, 123.0, 123.0, 0.09945053578976157, 0.07390806419532085, 0.049919507222595166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 234.74999999999997, 116, 358, 233.5, 357.4, 358.0, 358.0, 0.0994521842185959, 0.02661122898036648, 0.05671882381216797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 177.5, 115, 373, 118.5, 366.40000000000003, 373.0, 373.0, 0.09945300845350571, 0.026805693684733962, 0.05846749129786176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 156.16666666666669, 114, 355, 117.5, 352.6, 355.0, 355.0, 0.09945465696431235, 0.026806138009912314, 0.0585655841303519], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 37.5, 0.6955177743431221], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.166666666666667, 0.07727975270479134], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.166666666666667, 0.07727975270479134], "isController": false}, {"data": ["401/Unauthorized", 13, 54.166666666666664, 1.0046367851622875], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1294, 24, "401/Unauthorized", 13, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
