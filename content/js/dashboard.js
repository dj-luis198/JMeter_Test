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

    var data = {"OkPercent": 99.17849141150111, "KoPercent": 0.8215085884988798};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7669027688345138, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.08771929824561403, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/987500fe-aafe-4e5d-9d0e-b1c26856a1d7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2c3cc6c1-303c-4127-b2f0-838b34bd06f1"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.38461538461538464, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c99f0509-6706-44ab-b3af-2c4cb3f8763f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f470534a-dbaf-49bd-acb3-4f7a659d6746"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c6f758d4-a82e-49b6-867c-b5529b32f281"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/32c29702-fd5c-40ba-aa79-fb570ad790a7"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/f3e242c7-d636-4737-b7d0-0ad1381fd421"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d46f6c9b-bfd0-44bf-bbb8-ca4ca547219e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6f758d4-a82e-49b6-867c-b5529b32f281"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc3101b8-04b7-4cef-8f85-b5cd871ef1ff"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9414926-d90f-4844-8b92-49988c694c6e"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/9f3d34b5-b28a-4bcf-95e5-1935e534122b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b2d0b7f-eb90-4f39-8277-574c893e08da"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f2542fd5-8300-4d32-b08e-82cc75cd93bc"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "register"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc521588-5068-4a5c-ae29-91850bf2e849"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=987500fe-aafe-4e5d-9d0e-b1c26856a1d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c99f0509-6706-44ab-b3af-2c4cb3f8763f"], "isController": false}, {"data": [0.41228070175438597, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89de3851-b95e-4d3e-868b-1c51ec3a1526"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.18421052631578946, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.328125, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f470534a-dbaf-49bd-acb3-4f7a659d6746"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9351351351351351, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b2d0b7f-eb90-4f39-8277-574c893e08da"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d46f6c9b-bfd0-44bf-bbb8-ca4ca547219e"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/615f0e3e-c7bc-42cf-b352-0333c5882a8c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32c29702-fd5c-40ba-aa79-fb570ad790a7"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89de3851-b95e-4d3e-868b-1c51ec3a1526"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bc3101b8-04b7-4cef-8f85-b5cd871ef1ff"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d9414926-d90f-4844-8b92-49988c694c6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f3d34b5-b28a-4bcf-95e5-1935e534122b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2542fd5-8300-4d32-b08e-82cc75cd93bc"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1339, 11, 0.8215085884988798, 405.0321135175499, 96, 3882, 127.0, 1097.0, 1380.0, 2221.1999999999975, 5.3055337628477925, 723.9798629189153, 3.880197034557291], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1721.4561403508767, 1226, 2445, 1674.0, 2103.4000000000005, 2264.8999999999996, 2445.0, 0.244031921087783, 293.65365990352177, 1.1999030494892455], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/987500fe-aafe-4e5d-9d0e-b1c26856a1d7", 3, 0, 0.0, 328.0, 220, 444, 320.0, 444.0, 444.0, 444.0, 0.025428038650618746, 0.030055080839972877, 0.0163063919732158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c3cc6c1-303c-4127-b2f0-838b34bd06f1", 1, 0, 0.0, 909.0, 909, 909, 909.0, 909.0, 909.0, 909.0, 1.1001100110011, 0.3513046617161716, 0.656413297579758], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 1020.4615384615388, 506, 1616, 957.0, 1603.2, 1616.0, 1616.0, 0.09444585709615315, 0.01706297222928548, 0.06419366849504159], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 1020.4615384615388, 506, 1616, 957.0, 1603.2, 1616.0, 1616.0, 0.09333448206542029, 0.016862186701272222, 0.06343828077884035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 116.18181818181819, 100, 299, 106.0, 127.89999999999999, 274.0999999999997, 299.0, 0.11187388761759472, 0.02993500508517671, 0.06380307653190949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 131.22727272727272, 100, 355, 107.0, 266.6999999999999, 349.44999999999993, 355.0, 0.11187274983219088, 0.08313980724833717, 0.05615487638061144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 178.72727272727275, 99, 325, 107.0, 316.7, 323.79999999999995, 325.0, 0.11187331872199989, 0.030153355436789032, 0.06587852655211517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c99f0509-6706-44ab-b3af-2c4cb3f8763f", 3, 0, 0.0, 652.0, 423, 1041, 492.0, 1041.0, 1041.0, 1041.0, 0.017817054484552616, 0.024562247962916773, 0.011425650174013233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 142.04545454545456, 99, 328, 104.0, 315.8, 326.34999999999997, 328.0, 0.11187502542614214, 0.030153815446889876, 0.0657702786196656], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 347.7333333333334, 104, 668, 320.0, 659.6, 668.0, 668.0, 0.10353395913859746, 0.24211847736057426, 0.0669263463728603], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f470534a-dbaf-49bd-acb3-4f7a659d6746", 3, 0, 0.0, 1070.3333333333333, 258, 1648, 1305.0, 1648.0, 1648.0, 1648.0, 0.0195146066831023, 0.02690246071059188, 0.012514249728421724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 106.21052631578947, 101, 121, 103.0, 120.0, 121.0, 121.0, 0.10621883315816542, 0.07893801956383192, 0.053316875237594756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 128.3157894736842, 99, 314, 104.0, 306.0, 314.0, 314.0, 0.10622002079676197, 0.028422154002258573, 0.06057860561065331], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 815.6666666666666, 805, 833, 809.0, 833.0, 833.0, 833.0, 0.03259452411994785, 9.583872331323336, 0.018589064537157755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1031.3333333333333, 887, 1270, 937.0, 1270.0, 1270.0, 1270.0, 0.032557735718006596, 29.29550782945715, 0.018536288987888522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 234.0, 105, 301, 296.0, 301.0, 301.0, 301.0, 0.03278401888359488, 0.05801234591511125, 0.018152869831053024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6f758d4-a82e-49b6-867c-b5529b32f281", 3, 0, 0.0, 1016.0, 294, 1461, 1293.0, 1461.0, 1461.0, 1461.0, 0.022160337428071237, 0.026192768620223524, 0.014210893467871202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 127.06666666666668, 101, 309, 108.0, 213.60000000000005, 309.0, 309.0, 0.1220156993533168, 0.09067768282018952, 0.061246161589457844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 172.86666666666667, 100, 315, 110.0, 312.6, 315.0, 315.0, 0.1220156993533168, 0.06930110424207915, 0.06753759608736323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 343.1333333333333, 101, 1152, 113.0, 1150.8, 1152.0, 1152.0, 0.1220156993533168, 21.984297786940253, 0.06963474091999837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 264.73333333333335, 99, 892, 106.0, 842.2, 892.0, 892.0, 0.12201470683933104, 7.2015844372275, 0.06975332947631288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 171.33333333333334, 106, 301, 107.0, 301.0, 301.0, 301.0, 0.032784377151474746, 0.024364170910422152, 0.01840919615439256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 661.421052631579, 96, 1340, 994.0, 1325.0, 1340.0, 1340.0, 0.0843376167965022, 39.951365423241676, 0.0457666816476907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 105.15789473684211, 100, 124, 103.0, 110.0, 124.0, 124.0, 0.10621705175006568, 0.028628814729509892, 0.06244400893900346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 479.7368421052632, 98, 901, 586.0, 850.0, 901.0, 901.0, 0.08433948863636363, 13.062667846679688, 0.045850060202858665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 144.6842105263158, 99, 428, 104.0, 328.0, 428.0, 428.0, 0.10621764554612641, 0.028628974776104387, 0.06254808619561937], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 928.3333333333333, 427, 1477, 1001.5, 1462.6000000000001, 1477.0, 1477.0, 0.09067416239742486, 0.016381562542503513, 0.06251558462166205], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 513.8, 205, 1301, 423.0, 1292.6, 1301.0, 1301.0, 0.12191355516181993, 29.321352955997334, 0.26794789770233585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32c29702-fd5c-40ba-aa79-fb570ad790a7", 3, 0, 0.0, 950.6666666666667, 340, 1858, 654.0, 1858.0, 1858.0, 1858.0, 0.022886961298148444, 0.02705161343540918, 0.014676859947054829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 1187.2631578947369, 163, 2296, 1036.0, 2182.0, 2296.0, 2296.0, 0.07903494176372712, 0.04854783043885191, 0.03573552542637271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 116.63157894736844, 100, 318, 107.0, 119.0, 318.0, 318.0, 0.08433649373246689, 0.06267585129922587, 0.042332966580554666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 149.10526315789474, 101, 348, 105.0, 310.0, 348.0, 348.0, 0.0843372424385004, 0.08923553005956873, 0.04437068326482782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3e242c7-d636-4737-b7d0-0ad1381fd421", 2, 0, 0.0, 373.5, 206, 541, 373.5, 541.0, 541.0, 541.0, 0.02909979775640559, 0.03366085004146721, 0.01808791139839078], "isController": false}, {"data": ["login", 19, 0, 0.0, 3813.157894736842, 1673, 6116, 3565.0, 5228.0, 6116.0, 6116.0, 0.08089340378155375, 15.393832629684898, 0.14323071889755062], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d46f6c9b-bfd0-44bf-bbb8-ca4ca547219e", 1, 0, 0.0, 1477.0, 1477, 1477, 1477.0, 1477.0, 1477.0, 1477.0, 0.6770480704129993, 0.1223182549085985, 0.4667929079214624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 138.89473684210526, 104, 338, 110.0, 322.0, 338.0, 338.0, 0.10685503146599479, 0.08650666121612273, 0.037983624466427834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6f758d4-a82e-49b6-867c-b5529b32f281", 1, 0, 0.0, 1045.0, 1045, 1045, 1045.0, 1045.0, 1045.0, 1045.0, 0.9569377990430622, 0.17288427033492823, 0.6597637559808613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc3101b8-04b7-4cef-8f85-b5cd871ef1ff", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 791.1578947368421, 209, 1443, 1097.0, 1429.0, 1443.0, 1443.0, 0.08429645733046429, 53.13970941985181, 0.17823310882007143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9414926-d90f-4844-8b92-49988c694c6e", 1, 0, 0.0, 1300.0, 1300, 1300, 1300.0, 1300.0, 1300.0, 1300.0, 0.7692307692307693, 0.13897235576923075, 0.5303485576923077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f3d34b5-b28a-4bcf-95e5-1935e534122b", 3, 0, 0.0, 1311.0, 532, 2733, 668.0, 2733.0, 2733.0, 2733.0, 0.045886995625439755, 0.038254100194254945, 0.02942623091865765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b2d0b7f-eb90-4f39-8277-574c893e08da", 3, 0, 0.0, 425.33333333333337, 238, 708, 330.0, 708.0, 708.0, 708.0, 0.032018442622950824, 0.032112246654072744, 0.020532660145577187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2542fd5-8300-4d32-b08e-82cc75cd93bc", 3, 0, 0.0, 546.6666666666666, 199, 1027, 414.0, 1027.0, 1027.0, 1027.0, 0.0879120879120879, 0.0397779304029304, 0.05637591575091575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 332.6818181818182, 210, 664, 245.0, 575.6999999999998, 659.8, 664.0, 0.11181191203451939, 0.17328662538943582, 0.25146761075732244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 928.25, 104, 1377, 1116.0, 1377.0, 1377.0, 1377.0, 0.042678047479327824, 38.29619148439584, 0.07906275006668445], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1743.1363636363637, 923, 2955, 1618.0, 2779.3999999999996, 2939.1, 2955.0, 0.08533184390478518, 0.026984377484805113, 0.03849932801172925], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 266.05263157894734, 203, 536, 215.0, 430.0, 536.0, 536.0, 0.10615533318806814, 0.1645200329779923, 0.23874583235558683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 113.84615384615384, 105, 134, 112.0, 130.8, 134.0, 134.0, 0.08268931081639792, 0.06419726767484019, 0.02939346595426645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 371.33333333333337, 202, 1250, 233.0, 773.6000000000004, 1250.0, 1250.0, 0.07590785798145823, 6.163945396314927, 0.16942376921733937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc521588-5068-4a5c-ae29-91850bf2e849", 2, 0, 0.0, 409.0, 339, 479, 409.0, 479.0, 479.0, 479.0, 0.034549474847982306, 0.030534447985765618, 0.02147533275462963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 143.75, 104, 323, 112.5, 323.0, 323.0, 323.0, 0.06362638586221706, 0.0472848433995578, 0.03193746321599567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 106.75, 101, 115, 106.0, 115.0, 115.0, 115.0, 0.06362233780280256, 0.01702394585739053, 0.036284614528160834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 129.125, 100, 303, 105.0, 303.0, 303.0, 303.0, 0.06362992833679322, 0.017150254122026296, 0.03740743833862257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=987500fe-aafe-4e5d-9d0e-b1c26856a1d7", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.26451546486090777, 1.0094482064421668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 128.875, 100, 309, 103.0, 309.0, 309.0, 309.0, 0.06362942224484602, 0.017150117714431153, 0.03746927891957241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c99f0509-6706-44ab-b3af-2c4cb3f8763f", 1, 0, 0.0, 963.0, 963, 963, 963.0, 963.0, 963.0, 963.0, 1.0384215991692627, 0.18760546469366562, 0.7159430166147456], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1168.1929824561407, 797, 1995, 1072.0, 1649.8000000000004, 1797.1999999999994, 1995.0, 0.24693176452240365, 295.4162377400545, 0.48759377721123065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1743.1363636363637, 923, 2955, 1618.0, 2779.3999999999996, 2939.1, 2955.0, 0.0871708310550048, 0.02756591798809722, 0.03932902729239474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 157.3, 101, 424, 106.0, 412.90000000000003, 424.0, 424.0, 0.053954602597374564, 0.014542451481323614, 0.03177209508419616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89de3851-b95e-4d3e-868b-1c51ec3a1526", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 144.10000000000002, 100, 311, 105.5, 309.5, 311.0, 311.0, 0.05395547594125328, 0.014542686874790923, 0.031719918473275856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 307.9230769230769, 100, 1077, 106.0, 1045.8, 1077.0, 1077.0, 0.08539597456513742, 11.840929366854537, 0.04907445954201482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 274.53846153846155, 98, 908, 107.0, 905.2, 908.0, 908.0, 0.08545098400094654, 3.884938606754572, 0.04918952001196314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 126.0, 100, 307, 105.5, 287.9000000000001, 307.0, 307.0, 0.054016680350892354, 0.014453682047016119, 0.0308063880126183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 137.46153846153848, 99, 309, 106.0, 307.0, 309.0, 309.0, 0.08589929959032643, 0.06383727244945156, 0.04311742186467556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 107.20000000000002, 101, 123, 107.0, 121.60000000000001, 123.0, 123.0, 0.05401434621035347, 0.04014152096296777, 0.02711266987511883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 170.84615384615384, 100, 335, 106.0, 330.2, 335.0, 335.0, 0.08577687455462008, 0.04277245292169231, 0.04781132881575127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 113.2, 106, 119, 113.5, 118.9, 119.0, 119.0, 0.05486817919947327, 0.043187258237085406, 0.019503923074812763], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 1115.3333333333333, 444, 2733, 971.0, 2470.500000000001, 2733.0, 2733.0, 0.09138957854172697, 0.016510812529511216, 0.06220560180037469], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1782.631578947368, 1096, 2690, 1796.0, 2232.0, 2690.0, 2690.0, 0.08010590844316276, 0.041461065893433846, 0.0368455887468063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 307.7, 209, 527, 221.5, 518.0, 527.0, 527.0, 0.05392289026691831, 0.08356994809921812, 0.12127384402803991], "isController": false}, {"data": ["addBook", 64, 5, 7.8125, 1201.6874999999995, 535, 4258, 1028.0, 1920.5, 2100.75, 4258.0, 0.30634468563769957, 92.7487938051959, 1.1158190083287463], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 191.1754385964913, 101, 494, 109.0, 429.0, 438.4999999999998, 494.0, 0.24796624178883717, 0.1842795996106495, 0.11986649383347109], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 663.6491228070173, 492, 985, 607.0, 880.6, 900.0999999999999, 985.0, 0.2477894572106732, 72.85832780425937, 0.1246206742807585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f470534a-dbaf-49bd-acb3-4f7a659d6746", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 155.6666666666667, 101, 421, 111.0, 307.2, 318.0999999999999, 421.0, 0.2483454528818965, 0.4394550396699184, 0.12077737845232857], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 973.8421052631578, 688, 1560, 935.0, 1268.4000000000003, 1371.5999999999997, 1560.0, 0.24742912457839378, 222.63716122964678, 0.12419782229813907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 138.46666666666667, 102, 314, 117.0, 305.0, 314.0, 314.0, 0.07501200192030726, 0.05603923971585454, 0.02666442255760922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 5, 2.7027027027027026, 221.56216216216214, 102, 2659, 117.0, 437.4, 591.4999999999998, 2343.379999999995, 0.7694611276556806, 1.5604049406163176, 0.37340635762057667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 141.12499999999997, 106, 313, 119.5, 313.0, 313.0, 313.0, 0.06365980201801573, 0.04929904589871725, 0.022629070248591527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 121.95454545454545, 102, 330, 109.5, 131.79999999999998, 300.8999999999996, 330.0, 0.11118916815340062, 0.0902326159526132, 0.03952427461702913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b2d0b7f-eb90-4f39-8277-574c893e08da", 1, 0, 0.0, 1429.0, 1429, 1429, 1429.0, 1429.0, 1429.0, 1429.0, 0.6997900629811056, 0.1264269156752974, 0.48247244576627013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d46f6c9b-bfd0-44bf-bbb8-ca4ca547219e", 3, 0, 0.0, 1672.3333333333333, 353, 3882, 782.0, 3882.0, 3882.0, 3882.0, 0.03262962117009822, 0.027201972596556486, 0.02092459430504345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 277.5, 210, 633, 227.0, 633.0, 633.0, 633.0, 0.06356773937226858, 0.09851758045292015, 0.14296533571712355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/615f0e3e-c7bc-42cf-b352-0333c5882a8c", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.879713326446281, 1.6437456955922864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32c29702-fd5c-40ba-aa79-fb570ad790a7", 1, 0, 0.0, 1122.0, 1122, 1122, 1122.0, 1122.0, 1122.0, 1122.0, 0.8912655971479501, 0.16101966354723707, 0.6144858511586452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 475.9230769230769, 203, 1304, 411.0, 1253.6, 1304.0, 1304.0, 0.08533543389786005, 15.818190652898123, 0.1885623338420638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89de3851-b95e-4d3e-868b-1c51ec3a1526", 3, 0, 0.0, 430.3333333333333, 257, 550, 484.0, 550.0, 550.0, 550.0, 0.027062134661182072, 0.027141418258822256, 0.01735429859457314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 119.46666666666667, 104, 142, 118.0, 141.4, 142.0, 142.0, 0.12768022063142126, 0.1058598704258561, 0.04538632842757553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc3101b8-04b7-4cef-8f85-b5cd871ef1ff", 3, 0, 0.0, 450.0, 245, 560, 545.0, 560.0, 560.0, 560.0, 0.04653615859522849, 0.030190938828219528, 0.029842523578320356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9414926-d90f-4844-8b92-49988c694c6e", 3, 0, 0.0, 504.66666666666663, 270, 915, 329.0, 915.0, 915.0, 915.0, 0.017087882982177338, 0.02355702618148471, 0.01095804995927388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 124.00000000000001, 102, 334, 109.0, 137.0, 334.0, 334.0, 0.08840622193684074, 0.06863568988260585, 0.03142564920411135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f3d34b5-b28a-4bcf-95e5-1935e534122b", 1, 0, 0.0, 1040.0, 1040, 1040, 1040.0, 1040.0, 1040.0, 1040.0, 0.9615384615384616, 0.17371544471153846, 0.6629356971153846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 106.33333333333333, 100, 118, 105.0, 116.8, 118.0, 118.0, 0.07603136547263632, 0.05650377844206663, 0.0381641814970069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 152.66666666666663, 100, 343, 107.0, 340.6, 343.0, 343.0, 0.07603213624958816, 0.02795765010010898, 0.04293637694198748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 241.46666666666667, 100, 1146, 106.0, 651.0000000000002, 1146.0, 1146.0, 0.07594898253679729, 4.57504111529815, 0.04421457043255477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2542fd5-8300-4d32-b08e-82cc75cd93bc", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 205.73333333333332, 101, 832, 106.0, 519.4000000000002, 832.0, 832.0, 0.07595821285516795, 1.5080573465517504, 0.04429412191039969], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 45.45454545454545, 0.37341299477221807], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 9.090909090909092, 0.07468259895444361], "isController": false}, {"data": ["401/Unauthorized", 5, 45.45454545454545, 0.37341299477221807], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1339, 11, "406/Not Acceptable", 5, "401/Unauthorized", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
