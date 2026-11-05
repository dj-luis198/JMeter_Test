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

    var data = {"OkPercent": 99.54954954954955, "KoPercent": 0.45045045045045046};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5915057915057915, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de33d106-bae5-4d88-adb2-f599664d6da8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e393d50f-57d9-4c0c-a43a-77fd4024956b"], "isController": false}, {"data": [0.125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4d91522d-f7b5-4044-b9f2-d5e12b68b1ad"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.25, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/189493e4-9792-4ad9-ab8d-bca90cbac725"], "isController": false}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/07771b02-a274-44b3-be3f-c700e78f92fa"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/774a1155-0fa5-48fd-ab74-0b4f4580a3fb"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/c9863b1e-0b67-45db-8c4f-f14d0d8e3e39"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3c001549-5e2c-41c6-9d52-9cc9e869083c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/133e7d41-58ea-4ebe-a080-b0a281c26cc5"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/48953336-c735-4848-ad5e-56f9ddacc786"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7f8bd99d-e06a-43b1-9652-c857a3428282"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50979a57-756b-4546-b3dd-b67d77c23826"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8c4d2578-2a10-4d9d-a65d-1cb17ca0c23a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0ed9ca8-3f53-4c16-a112-14eadad17709"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1de4a40b-f6bd-4f0f-8efc-f7a38a307c67"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.25925925925925924, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/de33d106-bae5-4d88-adb2-f599664d6da8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/040daaaf-cdbe-432e-8b45-279b64c97fbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.0, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b375f6e8-def2-41f7-bd2f-9bf5663de05a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/27c8efec-789d-4c83-be03-ea885d7d0667"], "isController": false}, {"data": [0.012195121951219513, 500, 1500, "addBook"], "isController": true}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.4537037037037037, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9259259259259259, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.37962962962962965, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7205882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e393d50f-57d9-4c0c-a43a-77fd4024956b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=189493e4-9792-4ad9-ab8d-bca90cbac725"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/b375f6e8-def2-41f7-bd2f-9bf5663de05a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=774a1155-0fa5-48fd-ab74-0b4f4580a3fb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c001549-5e2c-41c6-9d52-9cc9e869083c"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07771b02-a274-44b3-be3f-c700e78f92fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48953336-c735-4848-ad5e-56f9ddacc786"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9863b1e-0b67-45db-8c4f-f14d0d8e3e39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c4d2578-2a10-4d9d-a65d-1cb17ca0c23a"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1de4a40b-f6bd-4f0f-8efc-f7a38a307c67"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/50979a57-756b-4546-b3dd-b67d77c23826"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/99a0b59f-23a2-4ffe-8597-344f104011b1"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1110, 5, 0.45045045045045046, 1027.4027027027043, 139, 16375, 361.0, 2260.5999999999995, 3838.000000000001, 9578.770000000039, 4.326085516187744, 674.2496580054017, 3.137938217116878], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 3445.8518518518513, 1805, 7871, 3049.5, 5034.5, 6893.75, 7871.0, 0.23820026466696076, 286.634236635697, 1.1712288404278783], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de33d106-bae5-4d88-adb2-f599664d6da8", 1, 0, 0.0, 10701.0, 10701, 10701, 10701.0, 10701.0, 10701.0, 10701.0, 0.09344921035417252, 0.016882913980001867, 0.06442885010746659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e393d50f-57d9-4c0c-a43a-77fd4024956b", 3, 0, 0.0, 3269.6666666666665, 465, 8804, 540.0, 8804.0, 8804.0, 8804.0, 0.024807534875259444, 0.02068102109880841, 0.015908477768314163], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 3664.583333333333, 1146, 8053, 3323.5, 7725.700000000001, 8053.0, 8053.0, 0.08583813788466216, 0.015507866707678222, 0.05834310934348131], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 3664.583333333333, 1146, 8053, 3323.5, 7725.700000000001, 8053.0, 8053.0, 0.08759443775320266, 0.015825166976896968, 0.05953684441037994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 11, 0, 0.0, 275.4545454545455, 147, 887, 163.0, 829.0000000000002, 887.0, 887.0, 0.0769919928327454, 0.05213910878268659, 0.04214600744022621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 11, 0, 0.0, 178.72727272727272, 150, 290, 164.0, 272.00000000000006, 290.0, 290.0, 0.07698175532398821, 0.05721007402495609, 0.038641232652861277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 11, 0, 0.0, 471.27272727272725, 146, 1812, 168.0, 1678.8000000000006, 1812.0, 1812.0, 0.07699253172442273, 6.189190664130579, 0.04353386315277418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 11, 0, 0.0, 631.0909090909091, 148, 2129, 189.0, 2039.2000000000003, 2129.0, 2129.0, 0.07699360953040897, 18.909361187083974, 0.04345928350446913], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 1559.1666666666667, 540, 7845, 1028.5, 6087.000000000006, 7845.0, 7845.0, 0.08697984242151881, 0.12801354575139712, 0.05623110906547408], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 191.5, 143, 710, 158.0, 334.10000000000036, 710.0, 710.0, 0.10760860061740433, 0.07997084479477022, 0.054014473356783034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 228.50000000000003, 139, 732, 157.5, 554.2000000000002, 732.0, 732.0, 0.10760064022380934, 0.05909366215416481, 0.05967159528036692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 2717.0, 2717, 2717, 2717.0, 2717.0, 2717.0, 2717.0, 0.368052999631947, 108.21980240154582, 0.20990522635259476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 2959.0, 2959, 2959, 2959.0, 2959.0, 2959.0, 2959.0, 0.3379520108144643, 304.089813387124, 0.1924082249070632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 9.462733957219251, 2.9610210561497325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d91522d-f7b5-4044-b9f2-d5e12b68b1ad", 1, 0, 0.0, 918.0, 918, 918, 918.0, 918.0, 918.0, 918.0, 1.0893246187363836, 0.34786049836601307, 0.6499778730936819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 276.7272727272727, 148, 1063, 172.0, 921.8000000000005, 1063.0, 1063.0, 0.0749599645643804, 0.05570755179052097, 0.03762638846298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 279.63636363636357, 143, 621, 157.0, 615.2, 621.0, 621.0, 0.07499062617172854, 0.02006585114360705, 0.04276809148856393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 469.0909090909091, 143, 2355, 159.0, 2109.600000000001, 2355.0, 2355.0, 0.07499062617172854, 0.020212317210348708, 0.04408628608923885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 432.45454545454544, 144, 2355, 157.0, 2084.2000000000007, 2355.0, 2355.0, 0.07499113741103323, 0.020212455005317553, 0.04415982017466118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 2.9966292842741935, 2.2642074092741935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 853.0, 140, 1679, 1233.0, 1537.0, 1679.0, 1679.0, 0.10280940219038137, 48.7015895381964, 0.05579058739340288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 471.375, 140, 2088, 160.0, 1912.3000000000002, 2088.0, 2088.0, 0.10639995744001703, 17.974338855186332, 0.06083708504016598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 656.0526315789474, 140, 1407, 706.0, 1396.0, 1407.0, 1407.0, 0.10281107112902789, 15.92358330402316, 0.055891894496902135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 538.25, 139, 1926, 160.5, 1653.0000000000002, 1926.0, 1926.0, 0.10661335998667333, 5.901072901049476, 0.0610632183908046], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 3586.3333333333326, 428, 10701, 2597.5, 10487.1, 10701.0, 10701.0, 0.08642046436596186, 0.015613072175491157, 0.05958285922106355], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 830.1818181818182, 307, 2713, 383.0, 2608.6000000000004, 2713.0, 2713.0, 0.07486914914615138, 0.11603255829584204, 0.16838247117537758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/189493e4-9792-4ad9-ab8d-bca90cbac725", 3, 0, 0.0, 1314.6666666666667, 745, 2289, 910.0, 2289.0, 2289.0, 2289.0, 0.043049636230573854, 0.028181256009011724, 0.027606700317132322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 2334.7000000000003, 234, 6944, 1516.5, 6056.900000000003, 6906.45, 6944.0, 0.08805064673200023, 0.054085797650808745, 0.039811962340738395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 221.57894736842104, 140, 761, 175.0, 360.0, 761.0, 761.0, 0.10279271578355101, 0.07639185225711163, 0.05159712491479025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 329.63157894736844, 139, 905, 171.0, 779.0, 905.0, 905.0, 0.10280940219038137, 0.10878054859638112, 0.054089074877710926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07771b02-a274-44b3-be3f-c700e78f92fa", 3, 0, 0.0, 3405.6666666666665, 453, 8972, 792.0, 8972.0, 8972.0, 8972.0, 0.043661131405451824, 0.0197555249523366, 0.027998837522376332], "isController": false}, {"data": ["login", 20, 0, 0.0, 12302.0, 4205, 18830, 13115.5, 18634.0, 18821.45, 18830.0, 0.0849166755121537, 5.201366130187878, 0.1351618060715423], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/774a1155-0fa5-48fd-ab74-0b4f4580a3fb", 3, 0, 0.0, 6321.333333333333, 985, 11952, 6027.0, 11952.0, 11952.0, 11952.0, 0.03251539061822596, 0.02090426317415243, 0.020851340988901415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9863b1e-0b67-45db-8c4f-f14d0d8e3e39", 3, 0, 0.0, 2430.0, 674, 5530, 1086.0, 5530.0, 5530.0, 5530.0, 0.05208423757356898, 0.023566761141686488, 0.033400373704404594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 561.9375, 145, 2544, 253.5, 2283.6000000000004, 2544.0, 2544.0, 0.11227991382516614, 0.09089848492291282, 0.03991200061753952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c001549-5e2c-41c6-9d52-9cc9e869083c", 3, 0, 0.0, 3420.666666666667, 760, 6325, 3177.0, 6325.0, 6325.0, 6325.0, 0.03474313244082087, 0.02233648651387409, 0.022279938446750358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/133e7d41-58ea-4ebe-a080-b0a281c26cc5", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.665283203125, 1.2430826822916667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48953336-c735-4848-ad5e-56f9ddacc786", 3, 0, 0.0, 1759.3333333333335, 1118, 2977, 1183.0, 2977.0, 2977.0, 2977.0, 0.07232052456487151, 0.03352357649100815, 0.04637741972421773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f8bd99d-e06a-43b1-9652-c857a3428282", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.5243611453201971, 0.9797696018062397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1114.5263157894735, 311, 1898, 1409.0, 1827.0, 1898.0, 1898.0, 0.10270603370920138, 64.7449366178768, 0.21715759193541412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50979a57-756b-4546-b3dd-b67d77c23826", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c4d2578-2a10-4d9d-a65d-1cb17ca0c23a", 3, 0, 0.0, 2311.0, 1099, 3849, 1985.0, 3849.0, 3849.0, 3849.0, 0.027419045268843742, 0.027499374503029805, 0.01758317681628326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0ed9ca8-3f53-4c16-a112-14eadad17709", 1, 0, 0.0, 1940.0, 1940, 1940, 1940.0, 1940.0, 1940.0, 1940.0, 0.5154639175257733, 0.16460615335051546, 0.3075668492268041], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1de4a40b-f6bd-4f0f-8efc-f7a38a307c67", 3, 0, 0.0, 2080.3333333333335, 650, 3962, 1629.0, 3962.0, 3962.0, 3962.0, 0.07840267614467908, 0.03547516921910934, 0.050277757814133385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 11, 0, 0.0, 813.6363636363636, 314, 2280, 420.0, 2191.0000000000005, 2280.0, 2280.0, 0.07689995316093763, 25.17733413204421, 0.16758373137797725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 3208.0, 3208, 3208, 3208.0, 3208.0, 3208.0, 3208.0, 0.3117206982543641, 372.9263267612219, 0.7028936447942643], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 4751.590909090909, 1063, 9622, 4241.5, 8867.8, 9563.05, 9622.0, 0.0895535754264989, 0.028605625389252754, 0.04040405453812743], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 608.0714285714287, 146, 5218, 192.0, 2938.5, 5218.0, 5218.0, 0.07243002741993895, 0.056232296678565885, 0.025746611309431424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 835.4375, 290, 2248, 615.5, 2201.1, 2248.0, 2248.0, 0.10629463544261751, 23.977348810413552, 0.23395978658030225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 822.2941176470588, 305, 2395, 408.0, 2304.6, 2395.0, 2395.0, 0.089896671707931, 0.1393222832036001, 0.20217972162437997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 231.33333333333334, 147, 616, 157.0, 616.0, 616.0, 616.0, 0.03030976580654287, 0.02252512869021399, 0.015214081664612338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 282.6666666666667, 146, 891, 161.0, 891.0, 891.0, 891.0, 0.030380362133916636, 0.008129120336614412, 0.01732630027949933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 444.33333333333337, 146, 1097, 166.5, 1097.0, 1097.0, 1097.0, 0.03023644903142575, 0.008149667903001472, 0.01777572491886553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 418.6666666666667, 144, 946, 172.5, 946.0, 946.0, 946.0, 0.030263901218626422, 0.008157067125332903, 0.017821418393390364], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1770.740740740741, 1115, 4633, 1410.5, 2738.0, 3880.75, 4633.0, 0.24695761932854968, 295.4471690767901, 0.4876448303538354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de33d106-bae5-4d88-adb2-f599664d6da8", 3, 0, 0.0, 2838.333333333333, 753, 6630, 1132.0, 6630.0, 6630.0, 6630.0, 0.031764519032240986, 0.020421525093970036, 0.020369825030440998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 4751.590909090909, 1063, 9622, 4241.5, 8867.8, 9563.05, 9622.0, 0.0894130843856305, 0.028560749078435595, 0.040340668931798135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.5227754237288136, 3.3269332627118646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/040daaaf-cdbe-432e-8b45-279b64c97fbf", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.5534418327556326, 1.034106910745234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.5227754237288136, 3.3214159604519775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 277.8571428571429, 149, 998, 160.5, 916.5, 998.0, 998.0, 0.07322865123285664, 4.72484681644977, 0.04260093131152515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 371.78571428571433, 150, 1788, 167.0, 1351.5, 1788.0, 1788.0, 0.07322788517867604, 1.5562866629791197, 0.04267199726441543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 163.07142857142858, 146, 210, 157.5, 204.5, 210.0, 210.0, 0.0732171621027969, 0.05441236363303559, 0.036751583321130474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.4463682432432432, 3.08277027027027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 323.9285714285714, 151, 1230, 165.5, 1024.0, 1230.0, 1230.0, 0.07322750215759605, 0.02745009741873055, 0.04132327653843136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 1, 0, 0.0, 156.0, 156, 156, 156.0, 156.0, 156.0, 156.0, 6.41025641025641, 4.76387219551282, 3.2176482371794872], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 4820.166666666667, 1629, 8972, 4689.5, 8921.6, 8972.0, 8972.0, 0.08215857975201803, 0.014843102787229818, 0.055922392663238826], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 1, 0, 0.0, 1169.0, 1169, 1169, 1169.0, 1169.0, 1169.0, 1169.0, 0.8554319931565441, 0.6733185414884516, 0.30407934131736525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 7943.750000000001, 2414, 16375, 7128.0, 14358.200000000003, 16281.449999999999, 16375.0, 0.08744392658207925, 0.04525906356299023, 0.04022079044937434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 4.544881781524927, 6.595376649560117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b375f6e8-def2-41f7-bd2f-9bf5663de05a", 1, 0, 0.0, 3662.0, 3662, 3662, 3662.0, 3662.0, 3662.0, 3662.0, 0.27307482250136533, 0.049334806799563084, 0.1882722897323867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27c8efec-789d-4c83-be03-ea885d7d0667", 1, 0, 0.0, 1110.0, 1110, 1110, 1110.0, 1110.0, 1110.0, 1110.0, 0.9009009009009009, 0.28769003378378377, 0.537549268018018], "isController": false}, {"data": ["addBook", 41, 2, 4.878048780487805, 3114.121951219513, 1065, 6127, 2839.0, 4902.000000000001, 5590.599999999999, 6127.0, 0.19838485694516353, 99.22561389679873, 0.7128179979217976], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 444.6111111111112, 144, 2367, 197.0, 1082.0, 1470.75, 2367.0, 0.24941917663958466, 0.18535936857687885, 0.12056884027011174], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 962.7962962962962, 683, 2775, 763.5, 1499.5, 1769.0, 2775.0, 0.24943415400249433, 73.34192327012795, 0.12544784112430135], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 302.5185185185185, 139, 1309, 167.5, 792.5, 1139.75, 1309.0, 0.2500833611203735, 0.44253032260753583, 0.12162257210736913], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1303.351851851852, 963, 2916, 1119.5, 1932.0, 2185.0, 2916.0, 0.24779053440158588, 222.96235842384573, 0.12437923308829603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 434.70588235294116, 145, 1445, 164.0, 1270.6, 1445.0, 1445.0, 0.09082312463603968, 0.06785126010407262, 0.032284782585467235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 136, 2, 1.4705882352941178, 725.4338235294122, 142, 5164, 213.0, 1941.6999999999998, 2738.4000000000015, 4817.309999999996, 0.5763762041388897, 1.4855146409091486, 0.2675441129104032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 636.0, 153, 1741, 255.0, 1741.0, 1741.0, 1741.0, 0.029266151257225082, 0.02266411908884716, 0.010403202204716728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e393d50f-57d9-4c0c-a43a-77fd4024956b", 1, 0, 0.0, 5558.0, 5558, 5558, 5558.0, 5558.0, 5558.0, 5558.0, 0.1799208348326736, 0.032505228949262326, 0.12404698182799569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=189493e4-9792-4ad9-ab8d-bca90cbac725", 1, 0, 0.0, 3008.0, 3008, 3008, 3008.0, 3008.0, 3008.0, 3008.0, 0.3324468085106383, 0.06006119099069149, 0.22920649102393617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 11, 0, 0.0, 272.1818181818182, 150, 795, 182.0, 725.6000000000003, 795.0, 795.0, 0.07603196107163593, 0.06170171840872018, 0.027026986162183086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b375f6e8-def2-41f7-bd2f-9bf5663de05a", 3, 0, 0.0, 4380.333333333333, 2298, 7845, 2998.0, 7845.0, 7845.0, 7845.0, 0.016517640840417566, 0.019523292282407612, 0.01059236733581465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=774a1155-0fa5-48fd-ab74-0b4f4580a3fb", 1, 0, 0.0, 9988.0, 9988, 9988, 9988.0, 9988.0, 9988.0, 9988.0, 0.1001201441730076, 0.018088111984381258, 0.06902814627553064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c001549-5e2c-41c6-9d52-9cc9e869083c", 1, 0, 0.0, 1786.0, 1786, 1786, 1786.0, 1786.0, 1786.0, 1786.0, 0.5599104143337066, 0.10115569008958566, 0.3860319848824188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 681.3333333333334, 294, 1564, 327.5, 1564.0, 1564.0, 1564.0, 0.030142574376802275, 0.04671510306248556, 0.06779135624001527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 584.8571428571428, 300, 1937, 363.0, 1510.5, 1937.0, 1937.0, 0.07315097839433603, 6.35627200244272, 0.16318138176973118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07771b02-a274-44b3-be3f-c700e78f92fa", 1, 0, 0.0, 2198.0, 2198, 2198, 2198.0, 2198.0, 2198.0, 2198.0, 0.45495905368516837, 0.08219475090991811, 0.31367294131028206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48953336-c735-4848-ad5e-56f9ddacc786", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9863b1e-0b67-45db-8c4f-f14d0d8e3e39", 1, 0, 0.0, 1806.0, 1806, 1806, 1806.0, 1806.0, 1806.0, 1806.0, 0.5537098560354374, 0.10003547203765227, 0.3817569905869324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 171.18181818181816, 151, 212, 169.0, 208.0, 212.0, 212.0, 0.07623747279708357, 0.06320860781711324, 0.0271000391583383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c4d2578-2a10-4d9d-a65d-1cb17ca0c23a", 1, 0, 0.0, 2997.0, 2997, 2997, 2997.0, 2997.0, 2997.0, 2997.0, 0.33366700033366703, 0.06028163580246914, 0.23004775608942277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 289.42105263157896, 144, 1367, 164.0, 1287.0, 1367.0, 1367.0, 0.10031308240983701, 0.07787978565998088, 0.03565816601287175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1de4a40b-f6bd-4f0f-8efc-f7a38a307c67", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50979a57-756b-4546-b3dd-b67d77c23826", 3, 0, 0.0, 2143.0, 1072, 3545, 1812.0, 3545.0, 3545.0, 3545.0, 0.04527960153950645, 0.02101846087087767, 0.029036723643498605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99a0b59f-23a2-4ffe-8597-344f104011b1", 1, 0, 0.0, 1158.0, 1158, 1158, 1158.0, 1158.0, 1158.0, 1158.0, 0.8635578583765112, 0.27576505829015546, 0.515267433074266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 391.47058823529414, 149, 1195, 185.0, 1163.8, 1195.0, 1195.0, 0.08997470123106562, 0.06686596448910247, 0.04516308245387473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 328.2941176470588, 141, 1086, 168.0, 839.5999999999998, 1086.0, 1086.0, 0.09002663729326972, 0.024089158806988184, 0.05134331658131788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 332.5882352941177, 140, 1229, 166.0, 956.1999999999998, 1229.0, 1229.0, 0.09002377686812575, 0.02426422110898702, 0.052924134447862994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 338.70588235294116, 139, 1238, 167.0, 1116.3999999999999, 1238.0, 1238.0, 0.09002759080871255, 0.024265249085160808, 0.053014294196927415], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 60.0, 0.2702702702702703], "isController": false}, {"data": ["401/Unauthorized", 2, 40.0, 0.18018018018018017], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1110, 5, "406/Not Acceptable", 3, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 136, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
