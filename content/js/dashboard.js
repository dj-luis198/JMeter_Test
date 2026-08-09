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

    var data = {"OkPercent": 98.56169568508706, "KoPercent": 1.4383043149129446};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7675180091683038, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0423728813559322, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/69713a77-4d1b-4a59-a07a-77e6f4d1555e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8c5c570-1e95-439a-bddc-c72371fde199"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/6de374cb-7788-47fa-b866-3da4ceb6f0b3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b58afab2-cb33-48cd-b21e-71acc0753006"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/30e738ed-2239-40e1-a0d6-a2758c8fd50f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f13196ab-cecd-4963-8d39-bc20ada1aa3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=531956b4-d6e7-4aa7-a12e-69330897f646"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c3ff575f-e616-423c-8d42-e3c72b3fd84a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40aaf955-c5dc-407e-b339-fe304e0b5847"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/451a6ada-fc3c-40e5-900c-008fb4cfa4fa"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5102981-5f33-4fad-881e-86f063ed372f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f13196ab-cecd-4963-8d39-bc20ada1aa3d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b58afab2-cb33-48cd-b21e-71acc0753006"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d87176a4-caec-4300-9b83-51a370cfa755"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69713a77-4d1b-4a59-a07a-77e6f4d1555e"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d98a0a09-a717-4f9a-a91a-fb4c24b00997"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3ff575f-e616-423c-8d42-e3c72b3fd84a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8c5c570-1e95-439a-bddc-c72371fde199"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3220338983050847, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d87176a4-caec-4300-9b83-51a370cfa755"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.17647058823529413, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/531956b4-d6e7-4aa7-a12e-69330897f646"], "isController": false}, {"data": [0.3, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30e738ed-2239-40e1-a0d6-a2758c8fd50f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4745762711864407, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40aaf955-c5dc-407e-b339-fe304e0b5847"], "isController": false}, {"data": [0.9329608938547486, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=451a6ada-fc3c-40e5-900c-008fb4cfa4fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d98a0a09-a717-4f9a-a91a-fb4c24b00997"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c51754db-df2b-473d-8851-06bc70696b07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 19, 1.4383043149129446, 418.8720666162003, 114, 3611, 131.0, 1166.8, 1452.6999999999982, 2140.3599999999997, 5.362245892056895, 731.9392663686006, 3.9351958148299993], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1937.1186440677961, 1417, 2644, 1918.0, 2311.0, 2553.0, 2644.0, 0.26127350908036157, 314.3992191755381, 1.284679802948848], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/69713a77-4d1b-4a59-a07a-77e6f4d1555e", 3, 0, 0.0, 1152.3333333333335, 261, 2801, 395.0, 2801.0, 2801.0, 2801.0, 0.029482870452267232, 0.024578655998781375, 0.018906658460601057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8c5c570-1e95-439a-bddc-c72371fde199", 3, 0, 0.0, 326.3333333333333, 226, 455, 298.0, 455.0, 455.0, 455.0, 0.046841332792055705, 0.030114463627705083, 0.030038224479280513], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 588.0000000000001, 119, 1398, 541.5, 1215.9000000000005, 1398.0, 1398.0, 0.07914523149980213, 0.015052279135338345, 0.053478422619047616], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 588.0000000000001, 119, 1398, 541.5, 1215.9000000000005, 1398.0, 1398.0, 0.08012927523070554, 0.015239430030449124, 0.05414334083988835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 206.31249999999997, 117, 355, 122.0, 354.3, 355.0, 355.0, 0.09385155031029668, 0.03392266119003766, 0.05303208329911662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 164.50000000000003, 117, 355, 120.5, 352.2, 355.0, 355.0, 0.0938493483335875, 0.0697454629705665, 0.0471079736752578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 230.5625, 117, 941, 119.5, 539.9000000000004, 941.0, 941.0, 0.09385044930902607, 1.7484114161739517, 0.05476137056849909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6de374cb-7788-47fa-b866-3da4ceb6f0b3", 1, 0, 0.0, 2024.0, 2024, 2024, 2024.0, 2024.0, 2024.0, 2024.0, 0.49407114624505927, 0.1577746726778656, 0.2948022171442688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 222.56249999999997, 116, 1050, 121.5, 569.1000000000005, 1050.0, 1050.0, 0.09385044930902607, 5.301639605842777, 0.05466971973909575], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 222.75, 117, 309, 222.0, 294.6, 309.0, 309.0, 0.07994137632402903, 0.19414798939111316, 0.05167434506362001], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b58afab2-cb33-48cd-b21e-71acc0753006", 3, 0, 0.0, 650.6666666666667, 223, 1393, 336.0, 1393.0, 1393.0, 1393.0, 0.04294856193898441, 0.035804448934159856, 0.02754188379550758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30e738ed-2239-40e1-a0d6-a2758c8fd50f", 3, 0, 0.0, 446.0, 222, 753, 363.0, 753.0, 753.0, 753.0, 0.018061843753010304, 0.02489970973111935, 0.01158262766713226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 134.6875, 117, 355, 120.0, 192.60000000000016, 355.0, 355.0, 0.09499213346394753, 0.07059473981060943, 0.04768159824264553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 134.18750000000003, 118, 351, 120.0, 190.70000000000016, 351.0, 351.0, 0.09499269743638458, 0.025417967868720092, 0.05417552275668808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 779.6666666666666, 691, 939, 709.0, 939.0, 939.0, 939.0, 0.122684333210649, 36.07326746718194, 0.06996840878419826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1276.6666666666667, 1252, 1317, 1261.0, 1317.0, 1317.0, 1317.0, 0.11997600479904019, 107.9546200134973, 0.06830665116976604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 198.0, 118, 358, 118.0, 358.0, 358.0, 358.0, 0.12447099825740603, 0.2202553211351755, 0.06892095313666916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 136.53846153846152, 117, 345, 119.0, 255.79999999999993, 345.0, 345.0, 0.06214862125674073, 0.046186621851933306, 0.031195694654262442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 189.30769230769232, 117, 350, 120.0, 349.6, 350.0, 350.0, 0.06214980972596715, 0.01662992955558105, 0.03544481335934064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f13196ab-cecd-4963-8d39-bc20ada1aa3d", 1, 0, 0.0, 1030.0, 1030, 1030, 1030.0, 1030.0, 1030.0, 1030.0, 0.970873786407767, 0.17540200242718446, 0.6693719660194175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 188.53846153846158, 114, 352, 118.0, 351.6, 352.0, 352.0, 0.06215010685037601, 0.01675139598701541, 0.03653746516008433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 189.3846153846154, 116, 355, 119.0, 353.8, 355.0, 355.0, 0.062150403977625855, 0.01675147607209447, 0.03659833359229335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=531956b4-d6e7-4aa7-a12e-69330897f646", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3ff575f-e616-423c-8d42-e3c72b3fd84a", 3, 0, 0.0, 644.3333333333334, 210, 1040, 683.0, 1040.0, 1040.0, 1040.0, 0.03603343903142116, 0.030039595494619008, 0.023107381149706927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 119.0, 118, 121, 118.0, 121.0, 121.0, 121.0, 0.12572290671360323, 0.09343274610258989, 0.07059635875031431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 23, 0, 0.0, 671.6521739130436, 116, 1762, 121.0, 1580.2, 1732.5999999999997, 1762.0, 0.12700656568724356, 49.70662303001773, 0.06992047939456522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 119.8125, 115, 126, 119.0, 124.6, 126.0, 126.0, 0.09499326141551834, 0.025603652490901428, 0.05584564782435746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 23, 0, 0.0, 481.5652173913043, 116, 1069, 354.0, 1037.6, 1064.0, 1069.0, 0.12700656568724356, 16.255934450807043, 0.07004450924386918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 192.3125, 117, 356, 120.5, 355.3, 356.0, 356.0, 0.09499326141551834, 0.025603652490901428, 0.055938414681208554], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 692.0000000000001, 120, 1426, 528.5, 1351.3000000000002, 1426.0, 1426.0, 0.07985625873427829, 0.015187506238770212, 0.05458274065016304], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 363.2307692307692, 237, 698, 245.0, 607.9999999999999, 698.0, 698.0, 0.06211328507608877, 0.09626346036694618, 0.13969423391624264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40aaf955-c5dc-407e-b339-fe304e0b5847", 3, 0, 0.0, 366.3333333333333, 221, 594, 284.0, 594.0, 594.0, 594.0, 0.019260276962782725, 0.022764995329382837, 0.012351154172096994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/451a6ada-fc3c-40e5-900c-008fb4cfa4fa", 3, 0, 0.0, 348.6666666666667, 258, 479, 309.0, 479.0, 479.0, 479.0, 0.02769137044592337, 0.027772497507776658, 0.017757812427887057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 17, 0, 0.0, 942.2352941176472, 193, 1729, 973.0, 1653.0, 1729.0, 1729.0, 0.08446071831356787, 0.05188065607347089, 0.03818878181560735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 23, 0, 0.0, 130.04347826086956, 117, 361, 120.0, 122.0, 313.1999999999993, 361.0, 0.12700656568724356, 0.09438671532030504, 0.06375134254222968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 23, 0, 0.0, 185.39130434782606, 114, 455, 120.0, 357.8, 435.7999999999997, 455.0, 0.12700656568724356, 0.11692239967861817, 0.06779579414996714], "isController": false}, {"data": ["login", 17, 0, 0.0, 3662.529411764706, 1855, 6383, 3504.0, 5872.599999999999, 6383.0, 6383.0, 0.08333496735230103, 17.709930012414457, 0.15012070549177434], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a5102981-5f33-4fad-881e-86f063ed372f", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f13196ab-cecd-4963-8d39-bc20ada1aa3d", 3, 0, 0.0, 1004.6666666666666, 222, 2271, 521.0, 2271.0, 2271.0, 2271.0, 0.026461093372378147, 0.026538616106867537, 0.016968865216010726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b58afab2-cb33-48cd-b21e-71acc0753006", 1, 0, 0.0, 1426.0, 1426, 1426, 1426.0, 1426.0, 1426.0, 1426.0, 0.7012622720897616, 0.1266928909537167, 0.48348746493688644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 129.0, 120, 189, 123.5, 158.90000000000003, 189.0, 189.0, 0.09923342181646778, 0.08033643231040215, 0.03527438041132253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d87176a4-caec-4300-9b83-51a370cfa755", 3, 0, 0.0, 446.66666666666663, 206, 867, 267.0, 867.0, 867.0, 867.0, 0.021948917552549366, 0.02607148442358484, 0.014075314966966878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 0, 0.0, 814.2173913043479, 238, 1883, 475.0, 1700.4, 1853.5999999999997, 1883.0, 0.12692176101184235, 66.12968105906552, 0.27133083157206395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69713a77-4d1b-4a59-a07a-77e6f4d1555e", 1, 0, 0.0, 1177.0, 1177, 1177, 1177.0, 1177.0, 1177.0, 1177.0, 0.8496176720475787, 0.15349538020390824, 0.5857715590484281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 461.50000000000006, 236, 1170, 468.5, 854.3000000000003, 1170.0, 1170.0, 0.09378388675595674, 7.148645857756221, 0.20942244145833946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 887.6, 117, 1435, 1370.0, 1435.0, 1435.0, 1435.0, 0.05899565791957712, 42.35390462761941, 0.0954531308995658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d98a0a09-a717-4f9a-a91a-fb4c24b00997", 3, 0, 0.0, 599.6666666666666, 237, 1018, 544.0, 1018.0, 1018.0, 1018.0, 0.017339136164236296, 0.020494271944121744, 0.011119172605320802], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1446.6818181818178, 315, 2760, 1462.5, 2321.5, 2694.449999999999, 2760.0, 0.08918183771337768, 0.027916828815462508, 0.04023633693709032], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 329.49999999999994, 236, 710, 244.0, 546.9000000000002, 710.0, 710.0, 0.09492506852403383, 0.14711531615980636, 0.21348870391684563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 138.83333333333331, 119, 354, 123.0, 175.8000000000003, 354.0, 354.0, 0.10650383413802897, 0.08268608216770804, 0.03785878479125248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 387.52941176470586, 236, 1529, 245.0, 685.7999999999993, 1529.0, 1529.0, 0.08977419150419298, 6.448662529572674, 0.2005531096855791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3ff575f-e616-423c-8d42-e3c72b3fd84a", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 119.90909090909092, 117, 125, 120.0, 124.2, 125.0, 125.0, 0.05411308651206722, 0.04021490120672183, 0.027162232878127492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 161.0, 114, 355, 119.0, 354.6, 355.0, 355.0, 0.05411282031100114, 0.014479406997279601, 0.030861217833617838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 161.36363636363635, 117, 356, 118.0, 355.4, 356.0, 356.0, 0.0541133527157524, 0.014585239599167639, 0.031812732748909126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 160.72727272727272, 115, 352, 119.0, 351.4, 352.0, 352.0, 0.05411308651206722, 0.014585167848955617, 0.03186542106130521], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8c5c570-1e95-439a-bddc-c72371fde199", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 120.0, 120, 120, 120.0, 120.0, 120.0, 120.0, 8.333333333333334, 2.457682291666667, 5.1513671875], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1346.0, 930, 2131, 1273.0, 1834.0, 2044.0, 2131.0, 0.2715702745621505, 324.8924614795977, 0.5362452101217463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1446.6818181818178, 315, 2760, 1462.5, 2321.5, 2694.449999999999, 2760.0, 0.08940763378633201, 0.027987510363157553, 0.04033820977469276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 119.6, 117, 123, 119.0, 123.0, 123.0, 123.0, 0.03847900200860391, 0.01037129351013152, 0.022659021690613432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 163.4, 117, 343, 120.0, 343.0, 343.0, 343.0, 0.03847900200860391, 0.01037129351013152, 0.022621444540214405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 209.22222222222223, 116, 1037, 119.0, 425.00000000000097, 1037.0, 1037.0, 0.11104667661973917, 5.5793785646754355, 0.06475312935703975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 216.94444444444446, 117, 702, 120.0, 390.6000000000005, 702.0, 702.0, 0.11104256631708823, 1.8421667759099323, 0.06485917257865516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 135.22222222222226, 117, 381, 119.5, 168.60000000000034, 381.0, 381.0, 0.11104256631708823, 0.08252284469463295, 0.05573816317088218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 165.2, 117, 351, 119.0, 351.0, 351.0, 351.0, 0.03847900200860391, 0.010296139209333467, 0.021945055833031916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d87176a4-caec-4300-9b83-51a370cfa755", 1, 0, 0.0, 1012.0, 1012, 1012, 1012.0, 1012.0, 1012.0, 1012.0, 0.9881422924901185, 0.17852180088932806, 0.6812777915019763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 144.0, 116, 352, 119.0, 343.0, 352.0, 352.0, 0.11104325134639942, 0.038978398231944676, 0.06281124883558813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 122.6, 120, 127, 122.0, 127.0, 127.0, 127.0, 0.03847840976428126, 0.028595771318962928, 0.01931435802621149], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 845.9166666666667, 134, 2801, 582.0, 2378.6000000000013, 2801.0, 2801.0, 0.07723250201126307, 0.014512520112630732, 0.05256310337892196], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 127.8, 122, 144, 124.0, 144.0, 144.0, 144.0, 0.03666845119795831, 0.02886208170464296, 0.01303448851177424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 17, 0, 0.0, 1937.764705882353, 1090, 3564, 1738.0, 3041.5999999999995, 3564.0, 3564.0, 0.08326639368350934, 0.04309686391822261, 0.038299288500911036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 289.4, 241, 475, 243.0, 475.0, 475.0, 475.0, 0.038443499588654555, 0.05957991586640115, 0.08646033159440569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/531956b4-d6e7-4aa7-a12e-69330897f646", 3, 0, 0.0, 423.3333333333333, 219, 570, 481.0, 570.0, 570.0, 570.0, 0.015873099857671207, 0.021882349575923683, 0.010179038645707121], "isController": false}, {"data": ["addBook", 60, 8, 13.333333333333334, 1252.6666666666667, 614, 4345, 973.5, 2176.8, 2458.2499999999995, 4345.0, 0.3077775383952479, 80.90474112863306, 1.1232978459419531], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30e738ed-2239-40e1-a0d6-a2758c8fd50f", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 221.84745762711862, 117, 495, 121.0, 480.0, 484.0, 495.0, 0.2731645886094996, 0.20300610540217698, 0.13204733531416243], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 744.2881355932204, 565, 1070, 704.0, 952.0, 1059.0, 1070.0, 0.27289925392119224, 80.24144176087087, 0.13724913649356837], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 189.77966101694918, 116, 469, 121.0, 360.0, 433.0, 469.0, 0.2736473010955168, 0.4842274507666763, 0.13308237885309315], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 1120.4745762711862, 811, 1635, 1137.0, 1429.0, 1544.0, 1635.0, 0.27219671979885124, 244.92308694580288, 0.13662999411778276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 127.47058823529412, 121, 147, 123.0, 143.8, 147.0, 147.0, 0.09028865815120694, 0.06745197606022785, 0.032094796452186845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40aaf955-c5dc-407e-b339-fe304e0b5847", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 8, 4.4692737430167595, 215.8994413407822, 118, 3611, 128.0, 335.0, 434.0, 2054.199999999978, 0.7608344526242413, 1.58853912081116, 0.36543265286821836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 148.36363636363635, 120, 359, 126.0, 316.20000000000016, 359.0, 359.0, 0.052819860267460564, 0.04090444257040647, 0.01877580970444887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 160.93749999999997, 122, 358, 129.0, 357.3, 358.0, 358.0, 0.09249517290816385, 0.07506200067059, 0.03287914349469887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=451a6ada-fc3c-40e5-900c-008fb4cfa4fa", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 325.3636363636364, 237, 477, 243.0, 476.6, 477.0, 477.0, 0.054080629301868244, 0.08381441279498525, 0.12162860281465093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 410.66666666666663, 238, 1155, 355.5, 778.8000000000006, 1155.0, 1155.0, 0.11095974010763095, 7.5372136525943, 0.2479738289124096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d98a0a09-a717-4f9a-a91a-fb4c24b00997", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 124.92307692307692, 120, 136, 123.0, 135.6, 136.0, 136.0, 0.05983834441109863, 0.04961206484865502, 0.021270661489882717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 23, 0, 0.0, 133.8695652173913, 120, 352, 123.0, 130.0, 307.59999999999934, 352.0, 0.125, 0.0970458984375, 0.04443359375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c51754db-df2b-473d-8851-06bc70696b07", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 121.23529411764706, 117, 136, 120.0, 134.4, 136.0, 136.0, 0.08994233109359293, 0.06684190816623459, 0.04514683416221364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 146.94117647058823, 115, 351, 119.0, 350.2, 351.0, 351.0, 0.08994328282400745, 0.03201336054558537, 0.050851435521247774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 250.1176470588235, 114, 1407, 121.0, 564.5999999999992, 1407.0, 1407.0, 0.08983111749910169, 4.7775055368334005, 0.052356762301578916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 222.17647058823533, 116, 940, 122.0, 468.7999999999996, 940.0, 940.0, 0.08983206687733167, 1.5765300679817378, 0.05244504226070323], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 36.8421052631579, 0.5299015897047691], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.0757002271006813], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.0757002271006813], "isController": false}, {"data": ["401/Unauthorized", 10, 52.63157894736842, 0.757002271006813], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 19, "401/Unauthorized", 10, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
