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

    var data = {"OkPercent": 99.0015360983103, "KoPercent": 0.9984639016897081};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7372432074221339, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0cd62c9-2551-4cb9-b9fe-9100318f3d12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd547e03-b134-4303-81e9-6bb96446c113"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/61473492-c91e-475d-a9fe-d7a9f1d8fbfd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b9f07b9-772c-4989-8e6d-d9fffe2c9016"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7975fdde-4a54-4588-b7b0-d54b5750e366"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ff30134-e606-4a85-ab60-9ddbfc193cc1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/872b174b-44ac-4628-aa56-48b5fd781281"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84ad2369-6352-481d-8ea1-bd717b4495b8"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af449f71-e0f6-41c1-a325-afbb39b40925"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b9f07b9-772c-4989-8e6d-d9fffe2c9016"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07e82c8d-0709-4cd3-a468-8f6882973246"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73ea3f72-e15e-4e1d-ba08-e281ed21804a"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4b0060b-c290-4974-b347-0756f993ad67"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0f0ebfb9-650b-43f1-b0c6-6024e09b5709"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=872b174b-44ac-4628-aa56-48b5fd781281"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33f5f181-8d53-40ef-b8af-205a07a4ed45"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd547e03-b134-4303-81e9-6bb96446c113"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61473492-c91e-475d-a9fe-d7a9f1d8fbfd"], "isController": false}, {"data": [0.175, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7975fdde-4a54-4588-b7b0-d54b5750e366"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1e7f3230-4473-4622-bb72-618e09549079"], "isController": false}, {"data": [0.3114754098360656, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f6d42be-96f2-4a62-9c3f-45a1855c6967"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2ff30134-e606-4a85-ab60-9ddbfc193cc1"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.952247191011236, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c3945d9-1d1f-4e1f-b041-ec9a8994d3bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/07e82c8d-0709-4cd3-a468-8f6882973246"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e7f3230-4473-4622-bb72-618e09549079"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a0cd62c9-2551-4cb9-b9fe-9100318f3d12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73ea3f72-e15e-4e1d-ba08-e281ed21804a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f0ebfb9-650b-43f1-b0c6-6024e09b5709"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1302, 13, 0.9984639016897081, 479.65130568356375, 138, 2581, 163.0, 1394.0, 1669.2499999999995, 2066.6400000000003, 5.026794125368709, 705.328550776605, 3.670038393491421], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2356.464285714285, 1694, 3179, 2286.5, 2788.5, 3048.2, 3179.0, 0.25063329663345774, 301.59697956107846, 1.232361961474082], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0cd62c9-2551-4cb9-b9fe-9100318f3d12", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.3001064161129568, 1.1452709717607974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd547e03-b134-4303-81e9-6bb96446c113", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 635.0, 147, 1141, 618.0, 1037.0, 1141.0, 1141.0, 0.07904128995385204, 0.014974619385788375, 0.053432434517331324], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 635.0, 147, 1141, 618.0, 1037.0, 1141.0, 1141.0, 0.08025781278939116, 0.01520509343861512, 0.054254811996073536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 166.66666666666666, 141, 433, 142.0, 346.3000000000003, 433.0, 433.0, 0.13439505426200316, 0.05278243260648008, 0.07570658899752489], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61473492-c91e-475d-a9fe-d7a9f1d8fbfd", 3, 0, 0.0, 963.0, 247, 2055, 587.0, 2055.0, 2055.0, 2055.0, 0.02145631137399066, 0.025360633658515656, 0.01375941842668021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 167.91666666666666, 139, 435, 142.5, 350.4000000000003, 435.0, 435.0, 0.13439806466786877, 0.09987981173071107, 0.06746152855398882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 270.0, 139, 1112, 143.5, 907.7000000000007, 1112.0, 1112.0, 0.1343935491096427, 3.326218466513607, 0.07817749748012096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 261.5, 139, 1301, 142.0, 1037.000000000001, 1301.0, 1301.0, 0.13439655944807813, 10.110727102886166, 0.07804800197114954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b9f07b9-772c-4989-8e6d-d9fffe2c9016", 1, 0, 0.0, 781.0, 781, 781, 781.0, 781.0, 781.0, 781.0, 1.2804097311139564, 0.23132402368758, 0.882782490396927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7975fdde-4a54-4588-b7b0-d54b5750e366", 3, 0, 0.0, 478.33333333333337, 235, 891, 309.0, 891.0, 891.0, 891.0, 0.03910527139058345, 0.03260045573935033, 0.025077273645654104], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 269.30769230769226, 144, 421, 255.0, 376.19999999999993, 421.0, 421.0, 0.07893570383323922, 0.1589565364075754, 0.05102476949256486], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 159.83333333333337, 141, 428, 144.0, 176.9000000000004, 428.0, 428.0, 0.11511527515748408, 0.0855495355418412, 0.057782472100534006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 205.33333333333334, 140, 434, 143.0, 425.0, 434.0, 434.0, 0.11491244310238061, 0.040336561787782256, 0.06499984438939997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 939.6666666666666, 835, 1125, 859.0, 1125.0, 1125.0, 1125.0, 0.04943642475776152, 14.535950322572672, 0.02819421099466087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1217.3333333333333, 1003, 1397, 1252.0, 1397.0, 1397.0, 1397.0, 0.04932020319923718, 44.3784055343433, 0.028079764126128202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 235.33333333333334, 142, 420, 144.0, 420.0, 420.0, 420.0, 0.050028349397992194, 0.08852672764566588, 0.02770124424673982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 144.15, 140, 152, 143.0, 149.8, 151.9, 152.0, 0.10169215750081353, 0.07557395689269443, 0.051044696245525545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 201.85, 138, 430, 142.5, 427.8, 429.9, 430.0, 0.10169629418703982, 0.03484885706077371, 0.05757162279319042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ff30134-e606-4a85-ab60-9ddbfc193cc1", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 242.6, 141, 1556, 143.0, 424.0, 1499.4499999999991, 1556.0, 0.10169422580185897, 4.601271440002949, 0.05934811458905363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 208.85, 139, 838, 144.0, 438.40000000000003, 818.0999999999997, 838.0, 0.10169267456818748, 1.521090027889216, 0.05944651855128616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/872b174b-44ac-4628-aa56-48b5fd781281", 3, 0, 0.0, 666.3333333333333, 294, 1310, 395.0, 1310.0, 1310.0, 1310.0, 0.03829021429756602, 0.031920976177105, 0.02455459705931154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 147.0, 141, 151, 149.0, 151.0, 151.0, 151.0, 0.050020008003201284, 0.03717307235394158, 0.028087406837735095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84ad2369-6352-481d-8ea1-bd717b4495b8", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.1871224442379182, 2.218140102230483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 252.3888888888889, 140, 1262, 143.5, 515.9000000000012, 1262.0, 1262.0, 0.11511748378762103, 5.783910343066091, 0.06712688344994308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1156.7142857142858, 139, 1958, 1395.5, 1891.0, 1958.0, 1958.0, 0.0697711506259469, 44.84837584286041, 0.03673497802208755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 244.88888888888889, 141, 1133, 143.0, 506.600000000001, 1133.0, 1133.0, 0.11511748378762103, 1.9097685778833733, 0.06723930286770444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 900.5, 145, 1274, 1109.0, 1272.0, 1274.0, 1274.0, 0.06962576153176675, 14.628423007584235, 0.03672642359815989], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 538.4166666666666, 147, 986, 548.0, 924.5000000000002, 986.0, 986.0, 0.07426248073816906, 0.014123650511482837, 0.050759324195953935], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 433.65, 283, 1698, 292.0, 583.9, 1642.3499999999992, 1698.0, 0.10161672204778018, 6.228058131433609, 0.22723840997774591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 615.9499999999999, 193, 1353, 584.5, 1074.7000000000003, 1339.5499999999997, 1353.0, 0.09462886558915931, 0.05812651997615353, 0.0427862937185359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 145.28571428571428, 140, 157, 144.5, 154.5, 157.0, 157.0, 0.06976454466176654, 0.051846502429301104, 0.03501853120717578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 225.42857142857144, 141, 446, 144.5, 434.5, 446.0, 446.0, 0.06976941209303253, 0.09351904455773669, 0.03560498178519991], "isController": false}, {"data": ["login", 20, 0, 0.0, 2876.2499999999995, 2121, 4374, 2734.0, 3601.4000000000005, 4336.4, 4374.0, 0.09310770233467563, 16.8390326036987, 0.16363860536300365], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 149.05555555555554, 144, 171, 148.0, 157.50000000000003, 171.0, 171.0, 0.11347160057996596, 0.09186323914139823, 0.04033560801865978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af449f71-e0f6-41c1-a325-afbb39b40925", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 1.068013168896321, 1.9955842391304348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1334.857142857143, 297, 2117, 1539.5, 2042.0, 2117.0, 2117.0, 0.06957074848186688, 59.4813787990598, 0.1437517237395271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b9f07b9-772c-4989-8e6d-d9fffe2c9016", 3, 0, 0.0, 444.0, 247, 672, 413.0, 672.0, 672.0, 672.0, 0.019389865563598757, 0.02673049500710962, 0.012434256237073423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07e82c8d-0709-4cd3-a468-8f6882973246", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73ea3f72-e15e-4e1d-ba08-e281ed21804a", 3, 0, 0.0, 340.3333333333333, 249, 490, 282.0, 490.0, 490.0, 490.0, 0.06856986126031404, 0.031829629608466095, 0.043972209206646705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 478.99999999999994, 282, 1737, 292.5, 1388.1000000000013, 1737.0, 1737.0, 0.1341801592271223, 13.567800203646346, 0.2989133853095089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 1059.75, 144, 1549, 1273.0, 1549.0, 1549.0, 1549.0, 0.04908637975677699, 44.046565142227784, 0.09093443593613862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4b0060b-c290-4974-b347-0756f993ad67", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1441.5238095238096, 218, 2581, 1492.0, 2259.0, 2554.7999999999997, 2581.0, 0.08776512381151395, 0.0278673858530979, 0.03959715546964789], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0f0ebfb9-650b-43f1-b0c6-6024e09b5709", 3, 0, 0.0, 866.6666666666666, 266, 2067, 267.0, 2067.0, 2067.0, 2067.0, 0.03717702459879794, 0.030992955728359875, 0.023840735175661442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=872b174b-44ac-4628-aa56-48b5fd781281", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33f5f181-8d53-40ef-b8af-205a07a4ed45", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.9020789194915255, 1.6855358403954803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 492.94444444444434, 284, 1405, 428.5, 911.8000000000008, 1405.0, 1405.0, 0.11480470444166645, 7.798392325544684, 0.25656658991759573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 165.875, 144, 422, 148.0, 237.2000000000002, 422.0, 422.0, 0.10459772369203815, 0.08120624056168976, 0.03718122209365418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 586.25, 286, 1679, 562.5, 1469.0000000000002, 1679.0, 1679.0, 0.11133997661860491, 16.80115082478567, 0.24684529484217557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 144.0769230769231, 139, 150, 144.0, 149.2, 150.0, 150.0, 0.0591341845623388, 0.04394640083197249, 0.02968258873539272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 166.30769230769232, 139, 433, 143.0, 322.5999999999999, 433.0, 433.0, 0.05913687457068903, 0.0226561042901528, 0.03334445466703665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 325.6153846153846, 140, 1663, 145.0, 1167.7999999999997, 1663.0, 1663.0, 0.058729721304884054, 4.079620031409107, 0.034138415223647293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 320.6923076923077, 140, 1305, 149.0, 956.9999999999997, 1305.0, 1305.0, 0.05882459411030064, 1.3451265096427083, 0.03425100878522688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 147.0, 147, 147, 147.0, 147.0, 147.0, 147.0, 6.802721088435374, 2.0062712585034013, 4.205197704081633], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1628.9821428571431, 1116, 2562, 1561.5, 2190.9, 2418.75, 2562.0, 0.24388544352309943, 291.77177875235174, 0.4815784832067451], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1441.5238095238096, 218, 2581, 1492.0, 2259.0, 2554.7999999999997, 2581.0, 0.08494836353045399, 0.026973001589747945, 0.03832631245221654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 266.5, 142, 566, 144.5, 566.0, 566.0, 566.0, 0.039177469037556506, 0.0105595522015289, 0.023070326005514227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 212.12500000000003, 141, 421, 143.0, 421.0, 421.0, 421.0, 0.0391776608977561, 0.010559603913848324, 0.023032179551219892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 238.68749999999997, 138, 1387, 144.0, 717.8000000000006, 1387.0, 1387.0, 0.09888629312369439, 5.586115910572799, 0.05760319711746456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 256.375, 140, 1119, 143.0, 637.4000000000005, 1119.0, 1119.0, 0.09888873780887279, 1.842273525476211, 0.05770119222734521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 215.625, 142, 430, 146.0, 430.0, 430.0, 430.0, 0.0391776608977561, 0.010483085044907393, 0.022343509730751526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 161.12499999999997, 141, 422, 143.5, 230.2000000000002, 422.0, 422.0, 0.09888568197128607, 0.07348828513686397, 0.0496359770832432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 179.0, 142, 425, 144.0, 425.0, 425.0, 425.0, 0.039177085322794694, 0.029115001885397233, 0.019665060406168434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 214.12500000000003, 140, 434, 143.0, 428.4, 434.0, 434.0, 0.09888812662624615, 0.0357431326831439, 0.05587806862217937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 187.125, 143, 425, 146.5, 425.0, 425.0, 425.0, 0.04124880765165382, 0.032467323210188456, 0.014662662094923819], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 832.9090909090909, 468, 2067, 587.0, 1915.6000000000006, 2067.0, 2067.0, 0.08116463878046441, 0.014663533373423748, 0.055245852763655956], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dd547e03-b134-4303-81e9-6bb96446c113", 3, 0, 0.0, 415.0, 255, 559, 431.0, 559.0, 559.0, 559.0, 0.06446621970087674, 0.029169285606842014, 0.04134064219099192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61473492-c91e-475d-a9fe-d7a9f1d8fbfd", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1666.4500000000003, 1288, 2200, 1692.0, 2002.4, 2190.2999999999997, 2200.0, 0.09439082521178942, 0.04885462633032069, 0.0434160924558133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 482.25000000000006, 286, 849, 430.5, 849.0, 849.0, 849.0, 0.03914966918529539, 0.06067434081744509, 0.08804852356810085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7975fdde-4a54-4588-b7b0-d54b5750e366", 1, 0, 0.0, 762.0, 762, 762, 762.0, 762.0, 762.0, 762.0, 1.3123359580052494, 0.23709194553805774, 0.9047941272965879], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e7f3230-4473-4622-bb72-618e09549079", 3, 0, 0.0, 449.3333333333333, 238, 571, 539.0, 571.0, 571.0, 571.0, 0.02161305428478801, 0.025545898472677495, 0.013859933900075646], "isController": false}, {"data": ["addBook", 61, 6, 9.836065573770492, 1435.2622950819673, 735, 2876, 1208.0, 2391.6, 2637.6, 2876.0, 0.29210222620204856, 98.48848695236819, 1.06113391330789], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1f6d42be-96f2-4a62-9c3f-45a1855c6967", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ff30134-e606-4a85-ab60-9ddbfc193cc1", 3, 0, 0.0, 491.6666666666667, 421, 584, 470.0, 584.0, 584.0, 584.0, 0.025329494507721276, 0.025403702011161867, 0.016243197975329072], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 258.03571428571433, 140, 596, 147.0, 572.5, 583.45, 596.0, 0.24510983984698143, 0.1821568243394071, 0.11848571359790606], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 923.3214285714287, 692, 1411, 845.5, 1154.5, 1291.5, 1411.0, 0.24500903470815488, 72.04079126980308, 0.12322231726044898], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 219.82142857142853, 139, 569, 148.5, 430.6, 432.75, 569.0, 0.24560218585945418, 0.4346007429466122, 0.11944325054492985], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1369.4107142857142, 971, 1958, 1390.0, 1684.7000000000003, 1836.3999999999999, 1958.0, 0.24452867098667316, 220.02732798936302, 0.12274193055385745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 153.8125, 142, 174, 149.0, 170.5, 174.0, 174.0, 0.11609850958538319, 0.08673374983673647, 0.041269392079179186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 6, 3.3707865168539324, 219.0449438202246, 142, 664, 155.5, 423.0, 464.3499999999999, 646.6200000000001, 0.7309161088982877, 1.5341370608857225, 0.3531191934771897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 194.6153846153846, 143, 431, 147.0, 427.0, 431.0, 431.0, 0.057367789310174395, 0.044426422776336225, 0.020392456356351056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c3945d9-1d1f-4e1f-b041-ec9a8994d3bb", 2, 0, 0.0, 245.5, 238, 253, 245.5, 253.0, 253.0, 253.0, 0.011324643556844049, 0.022394925002548045, 0.0070391949452453485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 171.58333333333334, 144, 423, 148.0, 343.2000000000003, 423.0, 423.0, 0.12371134020618557, 0.10039465206185567, 0.04397551546391753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07e82c8d-0709-4cd3-a468-8f6882973246", 3, 0, 0.0, 366.3333333333333, 298, 468, 333.0, 468.0, 468.0, 468.0, 0.08011322669372713, 0.03624914879696638, 0.05137469289929767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 517.0769230769231, 286, 1803, 303.0, 1313.3999999999996, 1803.0, 1803.0, 0.05868995002325025, 5.485006128585166, 0.13083996746093735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e7f3230-4473-4622-bb72-618e09549079", 1, 0, 0.0, 986.0, 986, 986, 986.0, 986.0, 986.0, 986.0, 1.0141987829614605, 0.18322927231237324, 0.6992425202839757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 472.49999999999994, 284, 1535, 290.5, 1050.6000000000004, 1535.0, 1535.0, 0.09879714476251637, 7.5307797969873045, 0.22061720814705954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 191.64999999999998, 144, 429, 149.0, 425.9, 428.85, 429.0, 0.09878640896585449, 0.08190396602735396, 0.03511548131208109], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 148.64285714285714, 142, 167, 145.0, 161.5, 167.0, 167.0, 0.06807583648184078, 0.05285184570611662, 0.024198832499404337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0cd62c9-2551-4cb9-b9fe-9100318f3d12", 3, 0, 0.0, 642.0, 295, 995, 636.0, 995.0, 995.0, 995.0, 0.03603993224492738, 0.023170203835850122, 0.023111545091961894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73ea3f72-e15e-4e1d-ba08-e281ed21804a", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f0ebfb9-650b-43f1-b0c6-6024e09b5709", 1, 0, 0.0, 717.0, 717, 717, 717.0, 717.0, 717.0, 717.0, 1.3947001394700138, 0.2519721931659693, 0.9615803695955369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 162.0, 140, 431, 143.0, 242.7000000000002, 431.0, 431.0, 0.11145942180424938, 0.08283263671194704, 0.05594740508533612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 232.0625, 141, 439, 145.0, 428.5, 439.0, 439.0, 0.11145010518103678, 0.0507457143951742, 0.06239137968264582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 404.25, 141, 1537, 282.0, 1327.7000000000003, 1537.0, 1537.0, 0.11145786892554614, 12.562534504047315, 0.06432773489745876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 316.75000000000006, 139, 1125, 144.0, 923.4000000000002, 1125.0, 1125.0, 0.11145709250242071, 4.122796763216373, 0.06443613160296198], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 30.76923076923077, 0.30721966205837176], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.07680491551459294], "isController": false}, {"data": ["401/Unauthorized", 8, 61.53846153846154, 0.6144393241167435], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1302, 13, "401/Unauthorized", 8, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
