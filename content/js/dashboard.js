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

    var data = {"OkPercent": 97.71217712177122, "KoPercent": 2.2878228782287824};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7730720606826802, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e43942fb-671a-4b85-9b3f-7908660688bf"], "isController": false}, {"data": [0.11403508771929824, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1961923a-ff09-422f-b41d-c54d5ed97d45"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3669de5c-3be0-4b32-99ef-092a8f37611a"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a88d4091-c479-4b30-af83-cb08eba687f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cca80602-dafc-49c4-9aed-5df378cf889d"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6cc1218-cc33-40c0-b706-c3aedeb18a8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe1e4c36-d506-478a-8745-a1d4db6722ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e6520336-a929-4b0d-997e-05c283617d60"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=297682c7-6dd8-4031-96f8-5d39efb2f442"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a88d4091-c479-4b30-af83-cb08eba687f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0509b10d-a073-498e-a8a0-145b8f81e3c7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cca80602-dafc-49c4-9aed-5df378cf889d"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb643888-7a9b-46e3-bad0-5ffeecbbc91e"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42e05cad-47b5-4f5f-be2c-2714b7680712"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a6930b7f-c8b7-4661-b03c-dec29c149be8"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d41ce87a-f1c4-4450-ae3b-39525a2fd440"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6930b7f-c8b7-4661-b03c-dec29c149be8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41228070175438597, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2786885245901639, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1961923a-ff09-422f-b41d-c54d5ed97d45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5087719298245614, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e43942fb-671a-4b85-9b3f-7908660688bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15288dd6-dda8-4d90-a732-c554a11d8965"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15288dd6-dda8-4d90-a732-c554a11d8965"], "isController": false}, {"data": [0.9162011173184358, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe1e4c36-d506-478a-8745-a1d4db6722ed"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6520336-a929-4b0d-997e-05c283617d60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0024e3f-3bcf-494a-8a37-fafd23a7ca19"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b6cc1218-cc33-40c0-b706-c3aedeb18a8d"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/297682c7-6dd8-4031-96f8-5d39efb2f442"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb643888-7a9b-46e3-bad0-5ffeecbbc91e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3669de5c-3be0-4b32-99ef-092a8f37611a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42e05cad-47b5-4f5f-be2c-2714b7680712"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1355, 31, 2.2878228782287824, 366.95645756457566, 100, 3428, 115.0, 1020.4000000000001, 1239.0, 1646.9600000000005, 5.307128001660681, 753.1534519159026, 3.877918951000129], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e43942fb-671a-4b85-9b3f-7908660688bf", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1706.5087719298247, 1250, 2487, 1734.0, 2032.0, 2097.3999999999996, 2487.0, 0.26247686059255304, 315.84739841397203, 1.2905966729331098], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1961923a-ff09-422f-b41d-c54d5ed97d45", 1, 0, 0.0, 785.0, 785, 785, 785.0, 785.0, 785.0, 785.0, 1.2738853503184713, 0.23014530254777069, 0.8782842356687898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3669de5c-3be0-4b32-99ef-092a8f37611a", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 519.25, 106, 968, 455.5, 909.2, 968.0, 968.0, 0.08747471434038598, 0.01767753779181018, 0.05867063207315073], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 519.25, 106, 968, 455.5, 909.2, 968.0, 968.0, 0.08693431569110063, 0.017568330032546035, 0.058308178413666076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 138.64705882352942, 100, 311, 103.0, 307.0, 311.0, 311.0, 0.09181595761343321, 0.06512772544868299, 0.05009581602782564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 127.23529411764706, 102, 306, 103.0, 305.2, 306.0, 306.0, 0.09181546172375428, 0.06823395153493848, 0.04608705793555635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 358.1764705882353, 102, 821, 303.0, 811.4, 821.0, 821.0, 0.09181645350846872, 7.9577881450105865, 0.05174696836923177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 415.47058823529414, 101, 1212, 104.0, 1206.4, 1212.0, 1212.0, 0.09181546172375428, 24.316207935353813, 0.051656745871004675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a88d4091-c479-4b30-af83-cb08eba687f3", 3, 0, 0.0, 314.6666666666667, 212, 411, 321.0, 411.0, 411.0, 411.0, 0.04445168842329861, 0.02857815255078605, 0.028505802797492923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cca80602-dafc-49c4-9aed-5df378cf889d", 2, 0, 0.0, 249.0, 229, 269, 249.0, 269.0, 269.0, 269.0, 0.01427480425674663, 0.028054730045608, 0.008872961825604717], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 226.35294117647064, 101, 388, 213.0, 346.4, 388.0, 388.0, 0.09301409437100587, 0.1580886954362908, 0.06011612912271295], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6cc1218-cc33-40c0-b706-c3aedeb18a8d", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 131.75000000000003, 102, 309, 104.0, 304.1, 309.0, 309.0, 0.09882521525367197, 0.07344334844535584, 0.04960562562537832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 140.375, 101, 305, 103.0, 302.9, 305.0, 305.0, 0.0988398670603788, 0.026447386303265423, 0.05636961168287229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 719.1428571428571, 601, 808, 803.0, 808.0, 808.0, 808.0, 0.03936011695577609, 11.57318126388147, 0.022447566701341057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1124.142857142857, 907, 1412, 1108.0, 1412.0, 1412.0, 1412.0, 0.039181662981724555, 35.25572922497271, 0.022307528826509194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 247.28571428571428, 100, 307, 306.0, 307.0, 307.0, 307.0, 0.03942573599400728, 0.06976507189564571, 0.02183046123886927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 103.92307692307692, 101, 106, 104.0, 106.0, 106.0, 106.0, 0.0641240652684332, 0.04765470084890397, 0.03218727494919401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 104.23076923076923, 101, 121, 103.0, 114.6, 121.0, 121.0, 0.06412564680580288, 0.017158620336708973, 0.03657165794393445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 119.38461538461539, 102, 306, 103.0, 228.39999999999992, 306.0, 306.0, 0.06412564680580288, 0.017283865740626556, 0.037698866579192705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe1e4c36-d506-478a-8745-a1d4db6722ed", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 120.07692307692307, 102, 306, 103.0, 232.79999999999995, 306.0, 306.0, 0.06412596312263844, 0.01728395099789864, 0.03776167554975682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 104.42857142857143, 102, 112, 103.0, 112.0, 112.0, 112.0, 0.039468861887175445, 0.029331839742324717, 0.02216269100109949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 647.0, 102, 1302, 903.0, 1268.4, 1302.0, 1302.0, 0.08583967295084605, 43.456884551340174, 0.04631486260287348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 140.8125, 101, 306, 103.0, 303.9, 306.0, 306.0, 0.09884047764660824, 0.02664059749068737, 0.058107390178963034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 504.5624999999999, 102, 915, 703.5, 912.9, 915.0, 915.0, 0.08583967295084605, 14.207461328556713, 0.04639869040848954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 128.125, 100, 304, 103.0, 302.6, 304.0, 304.0, 0.09884108824038153, 0.02664076206479033, 0.05820427364155279], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 481.25, 104, 971, 466.0, 840.8000000000002, 971.0, 971.0, 0.08689324079203188, 0.0175600293128917, 0.058747340591634355], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 225.15384615384616, 206, 408, 209.0, 335.99999999999994, 408.0, 408.0, 0.06409150294574407, 0.09932931169423423, 0.14414329226957873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6520336-a929-4b0d-997e-05c283617d60", 3, 0, 0.0, 437.66666666666663, 203, 882, 228.0, 882.0, 882.0, 882.0, 0.045535267064341335, 0.02927478920965955, 0.02920067581925535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=297682c7-6dd8-4031-96f8-5d39efb2f442", 1, 0, 0.0, 769.0, 769, 769, 769.0, 769.0, 769.0, 769.0, 1.3003901170351106, 0.2349337613784135, 0.8965580299089727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 685.3043478260871, 131, 1691, 578.0, 1422.6000000000004, 1654.9999999999995, 1691.0, 0.10353691090873895, 0.06359835640780938, 0.04681405249096303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 104.1875, 101, 111, 104.0, 108.2, 111.0, 111.0, 0.08583737037215865, 0.06379124888009056, 0.043086336300087444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 193.8125, 102, 312, 109.5, 309.9, 312.0, 312.0, 0.0858387519045473, 0.09548932447584713, 0.04489978661022769], "isController": false}, {"data": ["login", 23, 0, 0.0, 2944.1739130434785, 1558, 4682, 2830.0, 4114.2, 4575.399999999999, 4682.0, 0.1008493267211253, 36.85637387613291, 0.20305604290261903], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 107.3125, 103, 114, 106.5, 114.0, 114.0, 114.0, 0.1012965964343598, 0.08200671723055106, 0.03600777451377634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a88d4091-c479-4b30-af83-cb08eba687f3", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0509b10d-a073-498e-a8a0-145b8f81e3c7", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cca80602-dafc-49c4-9aed-5df378cf889d", 1, 0, 0.0, 971.0, 971, 971, 971.0, 971.0, 971.0, 971.0, 1.0298661174047374, 0.1860597966014418, 0.710044412976313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 752.8125000000001, 207, 1409, 1011.0, 1374.0, 1409.0, 1409.0, 0.08578996471887701, 57.79014455106379, 0.1805966725557903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb643888-7a9b-46e3-bad0-5ffeecbbc91e", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 0.9217554209183673, 3.5176179846938775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 591.8235294117648, 206, 1507, 409.0, 1354.9999999999998, 1507.0, 1507.0, 0.09176342309955252, 32.388903845427215, 0.19947263864373663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 759.6666666666666, 101, 1515, 1016.5, 1484.4, 1515.0, 1515.0, 0.06391784426417245, 44.613438110881475, 0.10162978851183278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42e05cad-47b5-4f5f-be2c-2714b7680712", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6930b7f-c8b7-4661-b03c-dec29c149be8", 3, 0, 0.0, 1012.6666666666666, 388, 1971, 679.0, 1971.0, 1971.0, 1971.0, 0.02548181872234161, 0.030118647064069786, 0.016340879844730784], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1018.9999999999999, 151, 2297, 1046.0, 1493.6000000000004, 2155.199999999998, 2297.0, 0.10607486118029037, 0.0332564867083587, 0.04785799400907632], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 299.625, 206, 617, 214.5, 607.9, 617.0, 617.0, 0.09876238387704084, 0.1530624054813123, 0.22211891608283696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 151.33333333333337, 103, 323, 106.0, 310.40000000000003, 323.0, 323.0, 0.10372666870278276, 0.08052998204952373, 0.03687158926544231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d41ce87a-f1c4-4450-ae3b-39525a2fd440", 2, 0, 0.0, 242.0, 205, 279, 242.0, 279.0, 279.0, 279.0, 0.021431173785388224, 0.03054570130837316, 0.013321232533593364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 298.8, 206, 1209, 209.0, 590.0000000000005, 1179.0499999999997, 1209.0, 0.10553811245085881, 6.468398962098625, 0.23600754267697424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6930b7f-c8b7-4661-b03c-dec29c149be8", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 126.9, 102, 306, 104.5, 287.50000000000006, 306.0, 306.0, 0.04709694435025056, 0.035000756494668626, 0.02364045839455936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 145.3, 100, 306, 104.5, 305.9, 306.0, 306.0, 0.047052402260397405, 0.0125901935735829, 0.026834573164132895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 106.5, 101, 122, 103.0, 121.3, 122.0, 122.0, 0.047097831615832406, 0.012694337427704828, 0.027688373664776472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 145.2, 102, 306, 103.0, 305.8, 306.0, 306.0, 0.047052402260397405, 0.012682092796747738, 0.027707615784198864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 116.33333333333333, 104, 141, 104.0, 141.0, 141.0, 141.0, 0.06162441970338113, 0.018174389404708106, 0.03809400163304712], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1198.1754385964914, 807, 2040, 1124.0, 1614.2, 1657.0999999999997, 2040.0, 0.26017655489725305, 311.2616116625282, 0.5137470644553181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1018.9999999999999, 151, 2297, 1046.0, 1493.6000000000004, 2155.199999999998, 2297.0, 0.1017708121310808, 0.031907085460933286, 0.04591612812945248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 154.125, 100, 303, 105.0, 303.0, 303.0, 303.0, 0.044517403522439554, 0.011998831418157534, 0.02621483820706157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 129.5, 102, 305, 103.5, 305.0, 305.0, 305.0, 0.04451789897775774, 0.011998964958848767, 0.02617165545372086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 181.7777777777778, 102, 1112, 103.0, 386.60000000000116, 1112.0, 1112.0, 0.10158242849725728, 5.103861199251112, 0.05923437182554911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 142.0, 100, 602, 103.0, 334.70000000000044, 602.0, 602.0, 0.10158242849725728, 1.68522559411612, 0.059333573415878464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 128.5, 102, 302, 103.5, 302.0, 302.0, 302.0, 0.04451789897775774, 0.011912015937407833, 0.025389114260752462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 124.00000000000001, 102, 445, 104.0, 150.70000000000047, 445.0, 445.0, 0.10169606436230919, 0.07557686033175516, 0.051046657306862225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 104.125, 102, 105, 104.5, 105.0, 105.0, 105.0, 0.044517155798916005, 0.033083550354467854, 0.022345525469377764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 159.3888888888889, 101, 307, 103.0, 306.1, 307.0, 307.0, 0.10169836265636123, 0.035698155728442774, 0.05752534337322169], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 150.62500000000003, 104, 465, 106.0, 465.0, 465.0, 465.0, 0.04327224734416582, 0.034059991561911765, 0.015381931673121444], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 493.42857142857133, 102, 926, 449.0, 904.0, 926.0, 926.0, 0.08041216980752773, 0.015526010465069528, 0.05472245595997771], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1617.5217391304348, 712, 3428, 1363.0, 2995.800000000001, 3406.2, 3428.0, 0.10317510160504571, 0.05340117563542405, 0.04745651646091458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 259.625, 206, 410, 210.0, 410.0, 410.0, 410.0, 0.04449116016261519, 0.06895260857233428, 0.10006166196728787], "isController": false}, {"data": ["addBook", 61, 13, 21.311475409836067, 1050.0983606557377, 527, 2501, 822.0, 1867.6000000000001, 2019.5, 2501.0, 0.28333480419707097, 90.04512436975423, 1.0286082150255698], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1961923a-ff09-422f-b41d-c54d5ed97d45", 3, 0, 0.0, 497.66666666666663, 276, 926, 291.0, 926.0, 926.0, 926.0, 0.060955786736020805, 0.039188697527226916, 0.039089485634752924], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 195.80701754385973, 102, 431, 105.0, 414.2, 420.9, 431.0, 0.2613791648706403, 0.19424760201812227, 0.12635027989352238], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 663.3333333333331, 500, 919, 610.0, 829.6, 912.5, 919.0, 0.261207880229313, 76.80378970531626, 0.1313691975762658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e43942fb-671a-4b85-9b3f-7908660688bf", 3, 0, 0.0, 342.3333333333333, 199, 446, 382.0, 446.0, 446.0, 446.0, 0.029995800587917693, 0.03008367890995261, 0.01923558826764253], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 168.35087719298247, 101, 427, 106.0, 307.0, 322.09999999999945, 427.0, 0.2618077596145455, 0.46327701213042616, 0.1273244768437926], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1000.9122807017544, 701, 1626, 1008.0, 1223.0, 1306.4, 1626.0, 0.26072875975445753, 234.60419633933392, 0.1308736157361242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 121.60000000000001, 104, 304, 106.5, 171.10000000000008, 297.5499999999999, 304.0, 0.09937591922725286, 0.07424079903207854, 0.035325033787812536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15288dd6-dda8-4d90-a732-c554a11d8965", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15288dd6-dda8-4d90-a732-c554a11d8965", 3, 0, 0.0, 298.0, 204, 388, 302.0, 388.0, 388.0, 388.0, 0.04753152924773433, 0.030124963361112873, 0.030480830930350467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 13, 7.262569832402234, 174.972067039106, 102, 1062, 109.0, 335.0, 428.0, 993.199999999999, 0.7445365987571646, 1.6295471259951417, 0.3574259856791089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 108.2, 103, 133, 105.0, 130.70000000000002, 133.0, 133.0, 0.04855358859573311, 0.037600581793375346, 0.017259283446139504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 114.23529411764704, 104, 145, 110.0, 138.6, 145.0, 145.0, 0.09250542789201896, 0.07507032283033961, 0.03288278882099111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe1e4c36-d506-478a-8745-a1d4db6722ed", 3, 0, 0.0, 327.0, 251, 394, 336.0, 394.0, 394.0, 394.0, 0.05152071991619297, 0.033122858670078484, 0.03303900333167322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6520336-a929-4b0d-997e-05c283617d60", 1, 0, 0.0, 775.0, 775, 775, 775.0, 775.0, 775.0, 775.0, 1.2903225806451613, 0.2331149193548387, 0.889616935483871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0024e3f-3bcf-494a-8a37-fafd23a7ca19", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 295.90000000000003, 206, 613, 223.0, 594.4000000000001, 613.0, 613.0, 0.047028946316457786, 0.07288568144943212, 0.10576920250664285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6cc1218-cc33-40c0-b706-c3aedeb18a8d", 3, 0, 0.0, 388.6666666666667, 311, 529, 326.0, 529.0, 529.0, 529.0, 0.028118321898549094, 0.02820069979473625, 0.018031606165410715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 351.6666666666667, 206, 1558, 218.5, 524.8000000000017, 1558.0, 1558.0, 0.1015211248540634, 6.896072463170392, 0.22688032633401578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/297682c7-6dd8-4031-96f8-5d39efb2f442", 3, 0, 0.0, 361.33333333333337, 217, 642, 225.0, 642.0, 642.0, 642.0, 0.04224578598284821, 0.026774917092645005, 0.02709121041217805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb643888-7a9b-46e3-bad0-5ffeecbbc91e", 3, 0, 0.0, 329.6666666666667, 205, 550, 234.0, 550.0, 550.0, 550.0, 0.12062241164408347, 0.05599204394676531, 0.0773522626754051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 126.61538461538461, 105, 308, 107.0, 242.39999999999995, 308.0, 308.0, 0.06319791155209209, 0.052397487214576356, 0.022464882622032736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3669de5c-3be0-4b32-99ef-092a8f37611a", 3, 0, 0.0, 291.3333333333333, 220, 403, 251.0, 403.0, 403.0, 403.0, 0.02037143924218246, 0.024078351526160325, 0.013063715920279769], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 112.125, 103, 148, 107.5, 137.5, 148.0, 148.0, 0.08195587700471758, 0.06362785372924852, 0.029132753154020703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42e05cad-47b5-4f5f-be2c-2714b7680712", 3, 0, 0.0, 379.6666666666667, 213, 474, 452.0, 474.0, 474.0, 474.0, 0.04710019782083085, 0.030280888898483373, 0.030204228420259365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 113.85, 102, 305, 104.0, 106.0, 295.04999999999984, 305.0, 0.1055955058552708, 0.0784747851131456, 0.053003994150008976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 133.15, 101, 303, 103.0, 302.9, 303.0, 303.0, 0.10559717844339199, 0.03618559562088501, 0.05977996517933041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 173.14999999999998, 101, 1104, 103.0, 305.9, 1064.0999999999995, 1104.0, 0.10559773598454049, 4.77789021828372, 0.06162617873472793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 147.79999999999998, 100, 806, 103.0, 281.40000000000043, 780.7499999999997, 806.0, 0.10559717844339199, 1.579492483460842, 0.06172897560177192], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 22.580645161290324, 0.5166051660516605], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.67741935483871, 0.22140221402214022], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.14760147601476015], "isController": false}, {"data": ["401/Unauthorized", 19, 61.29032258064516, 1.4022140221402215], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1355, 31, "401/Unauthorized", 19, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
