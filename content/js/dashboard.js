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

    var data = {"OkPercent": 97.4207811348563, "KoPercent": 2.5792188651436994};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8037854889589905, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f9ba5a0-b660-409f-8969-d522453824fa"], "isController": false}, {"data": [0.4152542372881356, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/883a90f8-23ec-4e09-a764-693dbac95fd2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28e5edbb-4f16-4b10-9540-1d9b17c7ca85"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.71875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91169246-d42d-40a2-ab92-4faa3d594611"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d2a5d0e1-8e7e-423f-bf08-07a17db7604c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8236400b-8146-47e1-902a-4e827f0de911"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e5023f1-1ac8-4681-9858-d150fdf4eb26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f22a1b2-c307-4137-b424-72d2a373130b"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d03c4a14-035c-4677-9d1a-c881dfe37b79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cd797a7-0391-4ad9-8a2e-0ebe209d8f92"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88d6a0f0-9ced-4d14-b987-c9371df5c55a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb521179-7cc0-45cd-8f61-d885c856284b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aaaafbe8-4814-4b93-9727-98551548a90e"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a696dfc2-fd66-4a24-a675-5c089286cd83"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/28e5edbb-4f16-4b10-9540-1d9b17c7ca85"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=883a90f8-23ec-4e09-a764-693dbac95fd2"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91169246-d42d-40a2-ab92-4faa3d594611"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88d6a0f0-9ced-4d14-b987-c9371df5c55a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f22a1b2-c307-4137-b424-72d2a373130b"], "isController": false}, {"data": [0.3017241379310345, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d6537337-0f2f-4973-9a19-adf6d8340650"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb521179-7cc0-45cd-8f61-d885c856284b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.847457627118644, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8236400b-8146-47e1-902a-4e827f0de911"], "isController": false}, {"data": [0.9028571428571428, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2a5d0e1-8e7e-423f-bf08-07a17db7604c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4e5023f1-1ac8-4681-9858-d150fdf4eb26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6537337-0f2f-4973-9a19-adf6d8340650"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6cd797a7-0391-4ad9-8a2e-0ebe209d8f92"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d03c4a14-035c-4677-9d1a-c881dfe37b79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aaaafbe8-4814-4b93-9727-98551548a90e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29ff571f-88d0-41f9-a7f5-b81e68654297"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1357, 35, 2.5792188651436994, 302.64922623433984, 76, 2902, 94.0, 788.2, 998.0, 1649.4800000000032, 5.43101964692369, 779.1893503725572, 3.969425750717399], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/7f9ba5a0-b660-409f-8969-d522453824fa", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.83160400390625, 1.5538533528645833], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1307.762711864407, 967, 1958, 1282.0, 1580.0, 1688.0, 1958.0, 0.2591925493124808, 311.8958895054474, 1.2744477400276766], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/883a90f8-23ec-4e09-a764-693dbac95fd2", 3, 0, 0.0, 432.66666666666663, 179, 938, 181.0, 938.0, 938.0, 938.0, 0.03715492364663191, 0.023887035873078784, 0.023826562364539342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28e5edbb-4f16-4b10-9540-1d9b17c7ca85", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 0.27290643882175225, 1.0414699773413896], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 402.4374999999999, 82, 627, 443.5, 600.4, 627.0, 627.0, 0.08023267475679471, 0.016214012824691607, 0.05381328508925885], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 402.4374999999999, 82, 627, 443.5, 600.4, 627.0, 627.0, 0.08230749049605696, 0.01663330694778104, 0.0552048958167218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 107.58823529411764, 78, 237, 80.0, 234.6, 237.0, 237.0, 0.08062450795337057, 0.04294292496229618, 0.04478624723742494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91169246-d42d-40a2-ab92-4faa3d594611", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 96.05882352941177, 79, 230, 81.0, 176.39999999999995, 230.0, 230.0, 0.08062297849737737, 0.05991610023096112, 0.040468956003566384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 204.35294117647058, 78, 637, 80.0, 628.2, 637.0, 637.0, 0.08062412558393207, 4.201337634274739, 0.04625420164330939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 228.2941176470588, 78, 848, 82.0, 747.1999999999999, 848.0, 848.0, 0.08062412558393207, 12.820083521555098, 0.04617546714566883], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 238.75000000000003, 78, 543, 213.5, 470.20000000000005, 543.0, 543.0, 0.07948296332358011, 0.12035963867541642, 0.05136994010213561], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 109.625, 78, 238, 81.0, 238.0, 238.0, 238.0, 0.09319067394330513, 0.06925595983481952, 0.04677735000669808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 128.5, 77, 237, 81.0, 236.3, 237.0, 237.0, 0.09319067394330513, 0.02493578580123594, 0.053147806233291205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 543.1428571428571, 390, 624, 616.0, 624.0, 624.0, 624.0, 0.05754212905877518, 16.919296521783806, 0.03281699547883272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2a5d0e1-8e7e-423f-bf08-07a17db7604c", 3, 0, 0.0, 353.3333333333333, 171, 506, 383.0, 506.0, 506.0, 506.0, 0.04568296025582458, 0.029369741700928886, 0.02929538792447084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 820.2857142857143, 623, 1019, 848.0, 1019.0, 1019.0, 1019.0, 0.05746984885429752, 51.71147102031559, 0.032719650275444774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 191.71428571428572, 78, 237, 236.0, 237.0, 237.0, 237.0, 0.05772291352282941, 0.10214249931969423, 0.0319618085619573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 101.86666666666667, 77, 240, 81.0, 238.2, 240.0, 240.0, 0.0689135548368127, 0.05121407737384225, 0.034591374205197006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 100.13333333333333, 76, 238, 79.0, 235.6, 238.0, 238.0, 0.06891450466551197, 0.018440013943701445, 0.03930280344204979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 100.73333333333333, 77, 238, 80.0, 235.0, 238.0, 238.0, 0.06891482128089682, 0.018574697923366718, 0.04051437735458973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 111.93333333333332, 78, 236, 81.0, 235.4, 236.0, 236.0, 0.06891387144346996, 0.01857444191249776, 0.04058111765665271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 80.57142857142857, 79, 81, 81.0, 81.0, 81.0, 81.0, 0.05779678649867068, 0.042952494653797246, 0.03245425023118714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 632.7142857142857, 78, 1063, 783.0, 1039.5, 1063.0, 1063.0, 0.08324859815307038, 53.511578709319686, 0.04383094439588276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 138.93750000000003, 78, 245, 80.0, 241.5, 245.0, 245.0, 0.09319175951866457, 0.02511809143276506, 0.05478656174827741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 438.85714285714283, 79, 645, 548.5, 638.5, 645.0, 645.0, 0.08324859815307038, 17.490590864358303, 0.043912241855016625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 109.18749999999999, 78, 239, 80.0, 236.9, 239.0, 239.0, 0.09319067394330513, 0.025117798836281457, 0.05487693006622362], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 508.0000000000001, 81, 1725, 417.0, 1295.2000000000005, 1725.0, 1725.0, 0.0825388964549544, 0.016680071176901488, 0.0558034274921588], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8236400b-8146-47e1-902a-4e827f0de911", 3, 0, 0.0, 612.3333333333334, 200, 1094, 543.0, 1094.0, 1094.0, 1094.0, 0.03655549733754128, 0.0304748140239073, 0.023442164633774843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e5023f1-1ac8-4681-9858-d150fdf4eb26", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 225.4, 157, 475, 163.0, 474.4, 475.0, 475.0, 0.06888791935520908, 0.106762820328825, 0.15493054519047508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f22a1b2-c307-4137-b424-72d2a373130b", 3, 0, 0.0, 258.6666666666667, 182, 411, 183.0, 411.0, 411.0, 411.0, 0.043479521145540455, 0.027953142663555464, 0.02788237521377431], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 676.1739130434781, 96, 1512, 678.0, 1272.0000000000002, 1477.9999999999995, 1512.0, 0.09647003556808267, 0.05925747301984766, 0.04361877584767801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 82.5, 78, 105, 81.0, 94.0, 105.0, 105.0, 0.08324612310912377, 0.06186552703715156, 0.0417856516387594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 159.78571428571425, 79, 246, 158.5, 245.5, 246.0, 246.0, 0.08324859815307038, 0.11158656962258653, 0.042483729358807405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d03c4a14-035c-4677-9d1a-c881dfe37b79", 3, 0, 0.0, 287.6666666666667, 200, 395, 268.0, 395.0, 395.0, 395.0, 0.01903770735236258, 0.026245016483481615, 0.012208425613331473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cd797a7-0391-4ad9-8a2e-0ebe209d8f92", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["login", 23, 0, 0.0, 2807.95652173913, 1645, 4288, 2417.0, 4022.0000000000005, 4258.0, 4288.0, 0.10094404627626191, 36.890990064966275, 0.20324675689820892], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 85.75, 80, 102, 83.5, 95.0, 102.0, 102.0, 0.09245989552031807, 0.07485278651010124, 0.03286660348573806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88d6a0f0-9ced-4d14-b987-c9371df5c55a", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb521179-7cc0-45cd-8f61-d885c856284b", 3, 0, 0.0, 487.33333333333337, 286, 820, 356.0, 820.0, 820.0, 820.0, 0.08541654803257218, 0.03864876359546723, 0.05477558581515859], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aaaafbe8-4814-4b93-9727-98551548a90e", 3, 0, 0.0, 458.0, 216, 846, 312.0, 846.0, 846.0, 846.0, 0.04250074376301585, 0.0354311213467069, 0.027254708728236075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 716.5, 161, 1142, 866.0, 1121.5, 1142.0, 1142.0, 0.08320703693798104, 71.1400896332947, 0.17192793304805207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a696dfc2-fd66-4a24-a675-5c089286cd83", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.7374963914549654, 1.3780131351039262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 352.41176470588243, 158, 952, 312.0, 932.8, 952.0, 952.0, 0.08059278362733896, 17.117623908441857, 0.17761616175682785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 558.8333333333333, 78, 1101, 778.0, 1052.7000000000003, 1101.0, 1101.0, 0.07674940679104335, 53.569624403593146, 0.12203205646837605], "isController": false}, {"data": ["register", 25, 8, 32.0, 1044.16, 104, 2078, 983.0, 1709.4000000000003, 2002.6999999999998, 2078.0, 0.10526049868213856, 0.032943246696925554, 0.04749057655385548], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 85.36842105263159, 79, 103, 83.0, 102.0, 103.0, 103.0, 0.09615530600160933, 0.0746518244836713, 0.03418020643025957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 279.1875, 158, 477, 314.5, 474.9, 477.0, 477.0, 0.09314618711904665, 0.14435839741985063, 0.2094879579444965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 313.64705882352933, 159, 1022, 164.0, 993.1999999999999, 1022.0, 1022.0, 0.0970053866520588, 13.78584852787193, 0.21524741901476765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 113.86666666666667, 78, 243, 82.0, 241.2, 243.0, 243.0, 0.07391274354248997, 0.05492929476155749, 0.03710073259847641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 111.86666666666666, 78, 238, 82.0, 236.2, 238.0, 238.0, 0.07391420039618012, 0.019777823152884132, 0.04215419241344647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 131.73333333333332, 77, 238, 81.0, 238.0, 238.0, 238.0, 0.07391492884456184, 0.019922383165135806, 0.043453893715259984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 111.46666666666667, 78, 238, 81.0, 237.4, 238.0, 238.0, 0.07385669831015874, 0.019906688216409972, 0.04349178621193918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 83.66666666666667, 81, 87, 83.0, 87.0, 87.0, 87.0, 0.024201940995667852, 0.00713768181708173, 0.014960770166267335], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 878.542372881356, 623, 1629, 797.0, 1202.0, 1352.0, 1629.0, 0.2663644859391154, 318.6645284614968, 0.5259658111024329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28e5edbb-4f16-4b10-9540-1d9b17c7ca85", 3, 0, 0.0, 1163.0, 164, 2902, 423.0, 2902.0, 2902.0, 2902.0, 0.03883294068915526, 0.02496583914748751, 0.02490263449141792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1044.16, 104, 2078, 983.0, 1709.4000000000003, 2002.6999999999998, 2078.0, 0.10488512980583665, 0.032825767968920436, 0.04732122067411771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 120.5, 79, 235, 84.0, 235.0, 235.0, 235.0, 0.04072946471301001, 0.010977863535928478, 0.023984245333930697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 79.5, 79, 81, 79.0, 81.0, 81.0, 81.0, 0.04072987943955686, 0.01097797531769306, 0.02394471427989573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 112.73684210526315, 76, 240, 80.0, 236.0, 240.0, 240.0, 0.0986019284461374, 0.026576301026497974, 0.057967149340405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 125.42105263157897, 78, 319, 80.0, 237.0, 319.0, 319.0, 0.09868130612499286, 0.026597695791501983, 0.05811018319665107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 90.78947368421052, 79, 237, 82.0, 94.0, 237.0, 237.0, 0.09867310638518864, 0.07333030660071148, 0.04952927410350289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 120.25, 78, 235, 84.0, 235.0, 235.0, 235.0, 0.040730294174549674, 0.010898535745924426, 0.023228995896422862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 96.31578947368422, 78, 235, 80.0, 234.0, 235.0, 235.0, 0.0986807936013296, 0.02640482172535577, 0.05627889010075829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 118.75, 80, 234, 80.5, 234.0, 234.0, 234.0, 0.04072946471301001, 0.030268674459570915, 0.0204442820922726], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 513.4, 79, 1094, 423.0, 1000.4000000000001, 1094.0, 1094.0, 0.08745590764656153, 0.01681362599481095, 0.059516705900358575], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 127.25, 80, 244, 92.5, 244.0, 244.0, 244.0, 0.03631477648255075, 0.02858370102044522, 0.012908768202781713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=883a90f8-23ec-4e09-a764-693dbac95fd2", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1540.7826086956518, 862, 2410, 1462.0, 2299.6, 2394.3999999999996, 2410.0, 0.09790316950869636, 0.05067253890586823, 0.045031633631441394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 240.5, 161, 470, 165.5, 470.0, 470.0, 470.0, 0.04069589988808628, 0.06307069640858683, 0.09152603265845966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91169246-d42d-40a2-ab92-4faa3d594611", 3, 0, 0.0, 274.0, 175, 437, 210.0, 437.0, 437.0, 437.0, 0.024537870112874203, 0.02900293176427286, 0.015735548216914773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88d6a0f0-9ced-4d14-b987-c9371df5c55a", 3, 0, 0.0, 265.3333333333333, 177, 377, 242.0, 377.0, 377.0, 377.0, 0.057945261043401, 0.03672507267301489, 0.037158907635253896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f22a1b2-c307-4137-b424-72d2a373130b", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["addBook", 58, 16, 27.586206896551722, 823.5689655172413, 409, 1992, 670.5, 1523.2, 1671.8, 1992.0, 0.2776514516862538, 87.04349168392015, 1.0073560431077813], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d6537337-0f2f-4973-9a19-adf6d8340650", 3, 0, 0.0, 438.3333333333333, 434, 442, 439.0, 442.0, 442.0, 442.0, 0.04105258836569645, 0.034223853777522344, 0.026326041367324877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb521179-7cc0-45cd-8f61-d885c856284b", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.504648219273743, 1.925846717877095], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 130.32203389830502, 78, 330, 81.0, 318.0, 323.0, 330.0, 0.2671242489960203, 0.198517142076144, 0.12912744458303715], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 492.57627118644064, 383, 725, 466.0, 643.0, 708.0, 725.0, 0.2670891806247171, 78.53308729911724, 0.13432707814622], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 119.91525423728814, 78, 328, 82.0, 239.0, 240.0, 328.0, 0.26726824672030147, 0.4729395147042835, 0.12998006529952164], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 746.4915254237291, 541, 1310, 705.0, 920.0, 1020.0, 1310.0, 0.26679569328443586, 240.06323379414, 0.1339189319806641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 94.11764705882354, 80, 244, 83.0, 133.5999999999999, 244.0, 244.0, 0.09355566562104452, 0.06989266035165924, 0.033256115513730665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8236400b-8146-47e1-902a-4e827f0de911", 1, 0, 0.0, 1725.0, 1725, 1725, 1725.0, 1725.0, 1725.0, 1725.0, 0.5797101449275363, 0.10473278985507246, 0.39968297101449274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 16, 9.142857142857142, 132.83428571428576, 79, 887, 85.0, 236.00000000000003, 350.99999999999994, 637.720000000003, 0.7584787084191137, 1.7325143569184094, 0.36036203814064366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 122.39999999999998, 81, 402, 86.0, 312.6, 402.0, 402.0, 0.0738959938518533, 0.05722609680128875, 0.02626771656452598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2a5d0e1-8e7e-423f-bf08-07a17db7604c", 1, 0, 0.0, 1111.0, 1111, 1111, 1111.0, 1111.0, 1111.0, 1111.0, 0.9000900090009001, 0.16261391764176417, 0.6205698694869487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e5023f1-1ac8-4681-9858-d150fdf4eb26", 3, 0, 0.0, 405.3333333333333, 300, 581, 335.0, 581.0, 581.0, 581.0, 0.04395604395604395, 0.02734375, 0.028187957875457876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 93.94117647058822, 80, 250, 83.0, 129.9999999999999, 250.0, 250.0, 0.08245302602605514, 0.06691256311294125, 0.029309474095199295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 258.79999999999995, 161, 482, 170.0, 479.6, 482.0, 482.0, 0.07382616399251896, 0.11441613501574958, 0.16603677311989368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6537337-0f2f-4973-9a19-adf6d8340650", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 242.57894736842107, 158, 474, 172.0, 401.0, 474.0, 474.0, 0.09855282950360496, 0.15273763713107527, 0.22164762338554905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cd797a7-0391-4ad9-8a2e-0ebe209d8f92", 3, 0, 0.0, 286.6666666666667, 217, 404, 239.0, 404.0, 404.0, 404.0, 0.050471063257065955, 0.031988007865074025, 0.032365883664199194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d03c4a14-035c-4677-9d1a-c881dfe37b79", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 97.20000000000002, 80, 239, 88.0, 157.40000000000003, 239.0, 239.0, 0.07365759041469223, 0.06106962330280635, 0.026182971592722627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 85.42857142857143, 80, 103, 83.0, 99.0, 103.0, 103.0, 0.08403058713371668, 0.0652385905969773, 0.02987024777018835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aaaafbe8-4814-4b93-9727-98551548a90e", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29ff571f-88d0-41f9-a7f5-b81e68654297", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.7549312943262412, 1.410590277777778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 91.05882352941177, 79, 249, 81.0, 117.79999999999988, 249.0, 249.0, 0.09704968944099378, 0.07212384146933229, 0.048714394895186336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 88.17647058823528, 77, 233, 79.0, 111.39999999999989, 233.0, 233.0, 0.09705190564271197, 0.043118074347468664, 0.054390992155922455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 206.4705882352941, 78, 941, 80.0, 911.4, 941.0, 941.0, 0.09705135158279338, 10.296842887420432, 0.05607436203008592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 178.70588235294122, 78, 658, 80.0, 626.8, 658.0, 658.0, 0.09705135158279338, 3.3802950075642966, 0.05616913874061599], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.857142857142858, 0.5895357406042742], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.571428571428571, 0.2210759027266028], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.714285714285714, 0.14738393515106854], "isController": false}, {"data": ["401/Unauthorized", 22, 62.857142857142854, 1.621223286661754], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1357, 35, "401/Unauthorized", 22, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
