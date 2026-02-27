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

    var data = {"OkPercent": 98.49397590361446, "KoPercent": 1.5060240963855422};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8152948801036941, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3050847457627119, 500, 1500, "see books"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67c61264-e97d-4e18-9701-a924aafe3c09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0937c9f3-ada7-4681-bcb0-3e59b5cc6a32"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba3ba335-5793-4f57-89fc-abbc8ec4ea61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6069b62d-bf39-4bf3-b57e-0730a66a3d18"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e8d1a37-ac86-436e-9537-fffceb737a20"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb4efd48-7a42-4fd3-9f58-0959a6cb734e"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e8d1a37-ac86-436e-9537-fffceb737a20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb07bec5-ba13-4df0-9151-65523efa9355"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05263157894736842, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fc12f8f-76bc-4070-a1a1-e632f8ff338b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b44925c-12f6-479c-acd8-ca2a37c02170"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49a35953-fd89-446c-af50-b9a539ae135d"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0937c9f3-ada7-4681-bcb0-3e59b5cc6a32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3aca08e9-c37b-4165-b9bf-32032aa58cef"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44d54201-13f3-4717-b7e3-c701e2c5bce2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9fc12f8f-76bc-4070-a1a1-e632f8ff338b"], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/483dd0d5-f241-4978-800c-7177c03711a4"], "isController": false}, {"data": [0.41379310344827586, 500, 1500, "addBook"], "isController": true}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba3ba335-5793-4f57-89fc-abbc8ec4ea61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb4efd48-7a42-4fd3-9f58-0959a6cb734e"], "isController": false}, {"data": [0.7203389830508474, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.96, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6069b62d-bf39-4bf3-b57e-0730a66a3d18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/480dad60-5d32-4e49-ba08-a6827ab0e08e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3aca08e9-c37b-4165-b9bf-32032aa58cef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb07bec5-ba13-4df0-9151-65523efa9355"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44d54201-13f3-4717-b7e3-c701e2c5bce2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/67c61264-e97d-4e18-9701-a924aafe3c09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49a35953-fd89-446c-af50-b9a539ae135d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b44925c-12f6-479c-acd8-ca2a37c02170"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1328, 20, 1.5060240963855422, 314.13253012048165, 98, 2243, 111.0, 800.0, 985.55, 1353.3300000000008, 5.257906656319782, 732.856300165151, 3.8569988829917805], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1456.813559322034, 1201, 2397, 1414.0, 1731.0, 1784.0, 2397.0, 0.27255760666703627, 327.9792518770096, 1.3401636226255151], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 644.5000000000001, 104, 2243, 522.5, 1648.5, 2243.0, 2243.0, 0.08344459279038718, 0.016437467218195688, 0.056145824641188245], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 644.5000000000001, 104, 2243, 522.5, 1648.5, 2243.0, 2243.0, 0.0820787017494489, 0.01616840497631443, 0.05522678272008817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 136.0588235294118, 99, 300, 102.0, 300.0, 300.0, 300.0, 0.09622296559179953, 0.025747160714993236, 0.05487716006407317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 129.23529411764707, 98, 338, 104.0, 304.4, 338.0, 338.0, 0.09622296559179953, 0.07150945001499946, 0.04829941827557125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 147.4705882352941, 98, 299, 101.0, 298.2, 299.0, 299.0, 0.09622514419620873, 0.025935683396634383, 0.05666383002960338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67c61264-e97d-4e18-9701-a924aafe3c09", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 113.35294117647061, 98, 302, 101.0, 154.79999999999987, 302.0, 302.0, 0.09622514419620873, 0.025935683396634383, 0.05656986016222427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0937c9f3-ada7-4681-bcb0-3e59b5cc6a32", 3, 0, 0.0, 548.6666666666667, 187, 1154, 305.0, 1154.0, 1154.0, 1154.0, 0.02080487111382345, 0.024590653324965153, 0.013341665395257876], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 211.00000000000003, 101, 381, 194.0, 372.0, 381.0, 381.0, 0.0826875826875827, 0.19156110464704212, 0.053444694557975805], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba3ba335-5793-4f57-89fc-abbc8ec4ea61", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 112.45, 100, 300, 102.5, 107.7, 290.39999999999986, 300.0, 0.10028832894571894, 0.07453068196063682, 0.05034004011533157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 142.1, 99, 304, 101.0, 301.9, 303.9, 304.0, 0.10028983763075287, 0.026835366709791298, 0.05719654802378875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 533.0, 487, 700, 494.0, 700.0, 700.0, 700.0, 0.03197319367442336, 9.40118055022669, 0.018234712017444574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 857.4, 691, 908, 897.0, 908.0, 908.0, 908.0, 0.03189365380076672, 28.697965752993223, 0.018158203286959964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 223.8, 99, 311, 297.0, 311.0, 311.0, 311.0, 0.03201167786008336, 0.056645664338350624, 0.017725216158854747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 126.11764705882354, 100, 307, 103.0, 299.0, 307.0, 307.0, 0.10098669945764202, 0.07504968582740779, 0.05069058937619922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 112.82352941176471, 99, 298, 101.0, 148.39999999999986, 298.0, 298.0, 0.10098729936199788, 0.0359442386745714, 0.05709541591916264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 184.05882352941177, 98, 913, 101.0, 424.99999999999955, 913.0, 913.0, 0.10098909911783051, 5.370922611533549, 0.05886002985118959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 189.1764705882353, 99, 799, 102.0, 400.5999999999997, 799.0, 799.0, 0.10086805864587597, 1.7702089340916238, 0.05888798713338911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 101.6, 98, 105, 101.0, 105.0, 105.0, 105.0, 0.032053747724183915, 0.023821193377054645, 0.017998930606841552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6069b62d-bf39-4bf3-b57e-0730a66a3d18", 3, 0, 0.0, 340.0, 244, 491, 285.0, 491.0, 491.0, 491.0, 0.055975370836831795, 0.035986769987872, 0.035895664241067264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 557.3750000000001, 99, 907, 688.5, 907.0, 907.0, 907.0, 0.08800589639505846, 49.50130779856, 0.047010962234469704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 112.1, 99, 296, 101.0, 121.20000000000002, 287.29999999999984, 296.0, 0.10028983763075287, 0.02703124529891386, 0.05895945532589183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 461.0, 99, 726, 590.0, 715.5, 726.0, 726.0, 0.08810475655554453, 16.19998248229645, 0.04714981112542813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 121.79999999999998, 99, 297, 100.0, 277.7000000000004, 296.85, 297.0, 0.10029084344599337, 0.027031516397552906, 0.05905798691204493], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 424.7142857142857, 104, 798, 426.0, 698.0, 798.0, 798.0, 0.08227792307014192, 0.01620764890834827, 0.0558888403220593], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3e8d1a37-ac86-436e-9537-fffceb737a20", 3, 0, 0.0, 266.0, 183, 428, 187.0, 428.0, 428.0, 428.0, 0.020353057707702956, 0.024056625174697078, 0.01305192828260899], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb4efd48-7a42-4fd3-9f58-0959a6cb734e", 3, 0, 0.0, 484.6666666666667, 180, 880, 394.0, 880.0, 880.0, 880.0, 0.028630598474943453, 0.028714477181413015, 0.018360116860559442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 335.1764705882353, 201, 1016, 206.0, 687.9999999999998, 1016.0, 1016.0, 0.10080704937766471, 7.241175121116704, 0.22520021503033105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e8d1a37-ac86-436e-9537-fffceb737a20", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb07bec5-ba13-4df0-9151-65523efa9355", 3, 0, 0.0, 273.0, 177, 371, 271.0, 371.0, 371.0, 371.0, 0.017648719879518073, 0.020860189414886106, 0.01131770122482116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 467.68421052631584, 134, 983, 381.0, 784.0, 983.0, 983.0, 0.07916567709570296, 0.048628135637887863, 0.035794637202451636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 119.0625, 99, 300, 102.5, 198.5000000000001, 300.0, 300.0, 0.08810378626021453, 0.0654755677187727, 0.044223970837646745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 188.37500000000003, 99, 306, 103.5, 305.3, 306.0, 306.0, 0.08810427140520806, 0.10628007934890943, 0.04562235343028474], "isController": false}, {"data": ["login", 19, 0, 0.0, 2143.5263157894738, 1181, 3222, 2178.0, 3003.0, 3222.0, 3222.0, 0.08310915731688646, 26.278738784364542, 0.16166046765304112], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 125.1, 101, 303, 105.0, 283.2000000000004, 302.95, 303.0, 0.09953170333580504, 0.08057791217322498, 0.035380410170149444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fc12f8f-76bc-4070-a1a1-e632f8ff338b", 1, 0, 0.0, 798.0, 798, 798, 798.0, 798.0, 798.0, 798.0, 1.2531328320802004, 0.22639606829573933, 0.8639763471177945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b44925c-12f6-479c-acd8-ca2a37c02170", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49a35953-fd89-446c-af50-b9a539ae135d", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 694.125, 201, 1038, 803.0, 1019.8000000000001, 1038.0, 1038.0, 0.0879565494645645, 65.81775067960179, 0.18375102386920864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0937c9f3-ada7-4681-bcb0-3e59b5cc6a32", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3aca08e9-c37b-4165-b9bf-32032aa58cef", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 301.52941176470586, 200, 639, 208.0, 606.1999999999999, 639.0, 639.0, 0.09616690048422863, 0.14903991315280354, 0.21628161310076027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 578.3333333333334, 101, 1012, 795.0, 1012.0, 1012.0, 1012.0, 0.05737161507471059, 38.13815463403284, 0.08876539272464173], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 994.8260869565217, 176, 1872, 989.0, 1472.6000000000001, 1800.599999999999, 1872.0, 0.09502797127676277, 0.02979307659254485, 0.0428739479783832], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 276.25, 200, 598, 208.5, 406.9, 588.4499999999998, 598.0, 0.10023706064843355, 0.1553478664541641, 0.225435498704436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 104.13333333333333, 101, 112, 103.0, 110.8, 112.0, 112.0, 0.11584800741427248, 0.08994059169369788, 0.041180346385542174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 319.7368421052632, 201, 600, 212.0, 597.0, 600.0, 600.0, 0.08728929971010764, 0.13528136585931722, 0.19631568089099405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 100.85714285714285, 100, 102, 101.0, 102.0, 102.0, 102.0, 0.034693139183918247, 0.025782694256798615, 0.01741432962942771], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44d54201-13f3-4717-b7e3-c701e2c5bce2", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 101.57142857142857, 99, 109, 101.0, 109.0, 109.0, 109.0, 0.03469331112961421, 0.009283171142103802, 0.019786029003608104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 101.71428571428571, 99, 111, 100.0, 111.0, 111.0, 111.0, 0.034693139183918247, 0.009350885170665464, 0.020395771278045684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 103.85714285714286, 100, 110, 102.0, 110.0, 110.0, 110.0, 0.03469210754553339, 0.009350607111882047, 0.020429043798785775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 106.0, 104, 108, 106.0, 108.0, 108.0, 108.0, 0.025784160790026687, 0.0076043130454961525, 0.015938841582116108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fc12f8f-76bc-4070-a1a1-e632f8ff338b", 3, 0, 0.0, 492.0, 219, 876, 381.0, 876.0, 876.0, 876.0, 0.016938051898191017, 0.023350471936471013, 0.010861966874816503], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 952.0677966101697, 784, 1929, 805.0, 1288.0, 1360.0, 1929.0, 0.261178668342932, 312.4604877345628, 0.5157258470599693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 994.8260869565217, 176, 1872, 989.0, 1472.6000000000001, 1800.599999999999, 1872.0, 0.09358800120443689, 0.02934161858413561, 0.04222427398090805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 101.5, 99, 109, 100.0, 109.0, 109.0, 109.0, 0.033781691449290864, 0.009105221523441679, 0.019892929632736714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 134.5, 99, 299, 101.5, 299.0, 299.0, 299.0, 0.03378131105268196, 0.009105118994668183, 0.019859716068080603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 245.79999999999998, 99, 909, 102.0, 896.4, 909.0, 909.0, 0.1179245283018868, 14.175372813482705, 0.0679755060927673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 176.99999999999997, 98, 593, 101.0, 539.6, 593.0, 593.0, 0.11819865253536109, 4.6615209211614985, 0.06824894852448682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 101.16666666666666, 100, 103, 101.0, 103.0, 103.0, 103.0, 0.03378112085759006, 0.009039088979472339, 0.019265795489094326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 114.59999999999998, 100, 297, 101.0, 181.20000000000007, 297.0, 297.0, 0.11865586634603216, 0.08818077567317428, 0.059559682911973166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 102.5, 100, 105, 102.5, 105.0, 105.0, 105.0, 0.03378112085759006, 0.025104915012330108, 0.016956539180470007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 166.5333333333333, 99, 304, 101.0, 301.6, 304.0, 304.0, 0.11846844000758198, 0.05542410220667214, 0.0662374324729892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 108.0, 102, 115, 107.5, 115.0, 115.0, 115.0, 0.034121734976484436, 0.026857537491256304, 0.012129210479922202], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 574.8571428571428, 101, 1230, 421.0, 1192.0, 1230.0, 1230.0, 0.08166550973861203, 0.015768005786584688, 0.055575384557052104], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1105.0526315789473, 626, 1643, 1096.0, 1448.0, 1643.0, 1643.0, 0.08157272208173587, 0.04222025654621095, 0.03752026572314218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 238.66666666666666, 201, 405, 206.5, 405.0, 405.0, 405.0, 0.03376135225469564, 0.052323501980666, 0.07593007250250397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/483dd0d5-f241-4978-800c-7177c03711a4", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 0.48238057024169184, 0.901328833081571], "isController": false}, {"data": ["addBook", 58, 5, 8.620689655172415, 965.2413793103448, 525, 1972, 828.0, 1481.2, 1548.9999999999993, 1972.0, 0.2820654975538113, 76.67533474761217, 1.029250313676286], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 186.2542372881356, 99, 892, 103.0, 403.0, 411.0, 892.0, 0.2619951597504385, 0.19470538727547237, 0.12664805085592487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba3ba335-5793-4f57-89fc-abbc8ec4ea61", 3, 0, 0.0, 346.3333333333333, 204, 421, 414.0, 421.0, 421.0, 421.0, 0.01626280696048138, 0.02241959227787716, 0.010428948474006614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb4efd48-7a42-4fd3-9f58-0959a6cb734e", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 575.9322033898305, 488, 809, 504.0, 791.0, 802.0, 809.0, 0.2625092323162213, 77.18643042782331, 0.1320236861746621], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 163.81355932203397, 98, 408, 104.0, 307.0, 312.0, 408.0, 0.26295499012804574, 0.4653070723750184, 0.12788240730836598], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 755.8135593220337, 678, 1003, 697.0, 909.0, 984.0, 1003.0, 0.26226068712300027, 235.9826272783897, 0.13164257146603722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 106.78947368421052, 101, 118, 105.0, 116.0, 118.0, 118.0, 0.08649652648159445, 0.06461898706876928, 0.030746812147754276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 5, 2.857142857142857, 168.66285714285712, 100, 1559, 106.0, 299.00000000000006, 386.59999999999997, 1049.040000000006, 0.7729818548030885, 1.6464815453342816, 0.3703325009054931], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 105.28571428571428, 101, 112, 105.0, 112.0, 112.0, 112.0, 0.03400666530640005, 0.02633523983200707, 0.012088306808134393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6069b62d-bf39-4bf3-b57e-0730a66a3d18", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/480dad60-5d32-4e49-ba08-a6827ab0e08e", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.8188100961538461, 1.5299479166666665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 117.58823529411764, 102, 308, 105.0, 150.39999999999986, 308.0, 308.0, 0.09547289973660711, 0.07747849578234425, 0.03393763232824706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3aca08e9-c37b-4165-b9bf-32032aa58cef", 3, 0, 0.0, 651.6666666666666, 195, 1366, 394.0, 1366.0, 1366.0, 1366.0, 0.019095630919645584, 0.02257038928034932, 0.01224557060927793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 205.7142857142857, 202, 213, 204.0, 213.0, 213.0, 213.0, 0.03467457907537758, 0.05373882518810959, 0.07798394102597125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 405.40000000000003, 201, 1012, 396.0, 998.8, 1012.0, 1012.0, 0.11782726522917403, 18.95324436147441, 0.2609766530183418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb07bec5-ba13-4df0-9151-65523efa9355", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 140.23529411764702, 102, 302, 107.0, 300.4, 302.0, 302.0, 0.1048327916972429, 0.0869170313974211, 0.03726478142362931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44d54201-13f3-4717-b7e3-c701e2c5bce2", 3, 0, 0.0, 559.6666666666666, 204, 1028, 447.0, 1028.0, 1028.0, 1028.0, 0.01922571631814715, 0.026504202020622786, 0.012328991258707648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 119.0, 101, 312, 105.0, 175.50000000000014, 312.0, 312.0, 0.08404685612228817, 0.06525122130587803, 0.029876030887219625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67c61264-e97d-4e18-9701-a924aafe3c09", 3, 0, 0.0, 386.66666666666663, 193, 686, 281.0, 686.0, 686.0, 686.0, 0.03878825491641131, 0.024937110501273545, 0.024873978575953866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49a35953-fd89-446c-af50-b9a539ae135d", 3, 0, 0.0, 255.33333333333334, 191, 377, 198.0, 377.0, 377.0, 377.0, 0.03190233631442942, 0.03223465231770473, 0.020458203951636056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 122.63157894736841, 100, 298, 102.0, 296.0, 298.0, 298.0, 0.08740896816013323, 0.06495920387681776, 0.043875204721004375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 143.00000000000003, 98, 303, 102.0, 299.0, 303.0, 303.0, 0.08740816392251036, 0.02338851261207797, 0.04984996848705669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 163.26315789473685, 99, 301, 101.0, 299.0, 301.0, 301.0, 0.08733142736323439, 0.023538548781496766, 0.051341327414713964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 174.31578947368422, 99, 306, 103.0, 303.0, 306.0, 306.0, 0.08741017454431695, 0.023559773607647928, 0.05147298364279602], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b44925c-12f6-479c-acd8-ca2a37c02170", 3, 0, 0.0, 592.6666666666667, 185, 1230, 363.0, 1230.0, 1230.0, 1230.0, 0.09503595526974372, 0.04467184876611651, 0.06094428121139164], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 35.0, 0.5271084337349398], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.0, 0.15060240963855423], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 10.0, 0.15060240963855423], "isController": false}, {"data": ["401/Unauthorized", 9, 45.0, 0.677710843373494], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1328, 20, "401/Unauthorized", 9, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
