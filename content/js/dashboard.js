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

    var data = {"OkPercent": 97.61727475800447, "KoPercent": 2.3827252419955323};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.767515923566879, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.14035087719298245, 500, 1500, "see books"], "isController": true}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c72d15c3-1518-49bd-8643-2ca53f911664"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cc73f5c1-435f-48c6-a955-50c0edc7a64e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fff4d2c-7685-4cb4-a941-92080e7613fd"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/baafbd00-b8ec-4f58-ba0b-5ed34a915483"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/696ea0ab-b5bc-4085-bf01-1172a120b8dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d4cbc60-612c-49dc-b04f-3d0745b02c7e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4cf682ec-aa7c-4f21-ad08-532d1a58fc87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7d4db32-a26c-49d0-ab59-c8f204c521ab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b477e87-bc5e-48f4-b7a3-e00a7e5f88d7"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4ecec8e-4f16-4f64-9d25-41a2751c301d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/85ca9b8c-d0ae-4cd3-8de8-a9eac08563e5"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a077f697-a830-462c-80ac-f3e3aa1e805b"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85ca9b8c-d0ae-4cd3-8de8-a9eac08563e5"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c72d15c3-1518-49bd-8643-2ca53f911664"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.43859649122807015, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d4cbc60-612c-49dc-b04f-3d0745b02c7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff9698e3-55f7-4f9b-bb27-fbb5f9d04433"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc73f5c1-435f-48c6-a955-50c0edc7a64e"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2542372881355932, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=696ea0ab-b5bc-4085-bf01-1172a120b8dd"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/366fff9e-67d3-4618-9597-a1ebceb57239"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8914285714285715, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4cf682ec-aa7c-4f21-ad08-532d1a58fc87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e7d4db32-a26c-49d0-ab59-c8f204c521ab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=366fff9e-67d3-4618-9597-a1ebceb57239"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=baafbd00-b8ec-4f58-ba0b-5ed34a915483"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1fff4d2c-7685-4cb4-a941-92080e7613fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ff9698e3-55f7-4f9b-bb27-fbb5f9d04433"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4ecec8e-4f16-4f64-9d25-41a2751c301d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b477e87-bc5e-48f4-b7a3-e00a7e5f88d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a077f697-a830-462c-80ac-f3e3aa1e805b"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1343, 32, 2.3827252419955323, 368.9389426656737, 95, 3560, 119.0, 995.0000000000007, 1271.8, 1819.919999999997, 5.301699465092868, 749.5995212852575, 3.8822749405384602], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1683.5087719298247, 1210, 2478, 1647.0, 2061.0, 2178.499999999999, 2478.0, 0.25981129495419114, 312.63987647568257, 1.2774901075140161], "isController": true}, {"data": ["deleteBook", 16, 2, 12.5, 606.1250000000001, 107, 1482, 501.0, 1288.8000000000002, 1482.0, 1482.0, 0.08586777436095593, 0.01673960396172444, 0.05784963948951608], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 606.1250000000001, 107, 1482, 501.0, 1288.8000000000002, 1482.0, 1482.0, 0.08476911013626634, 0.016525423448195478, 0.05710946274927417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 179.73333333333332, 96, 304, 103.0, 302.8, 304.0, 304.0, 0.11892397586636116, 0.04372933695919322, 0.067157979600574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 141.26666666666665, 96, 308, 102.0, 307.4, 308.0, 308.0, 0.11892020454275182, 0.08837722232132239, 0.05969236829587347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 187.13333333333333, 99, 583, 102.0, 419.2000000000001, 583.0, 583.0, 0.11892020454275182, 2.3610151078209856, 0.06934689271415546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 254.86666666666662, 95, 1214, 107.0, 669.8000000000003, 1214.0, 1214.0, 0.11892586161786742, 7.1638972426047935, 0.0692340530330059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c72d15c3-1518-49bd-8643-2ca53f911664", 3, 0, 0.0, 286.0, 187, 467, 204.0, 467.0, 467.0, 467.0, 0.018971732119142475, 0.026154064298362107, 0.01216611727692405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc73f5c1-435f-48c6-a955-50c0edc7a64e", 3, 0, 0.0, 582.3333333333334, 220, 986, 541.0, 986.0, 986.0, 986.0, 0.01635349719537523, 0.022544616088025424, 0.010487105948857163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fff4d2c-7685-4cb4-a941-92080e7613fd", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 208.76470588235296, 99, 404, 209.0, 306.3999999999999, 404.0, 404.0, 0.08727078584775867, 0.15714556831249102, 0.056404159672169864], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/baafbd00-b8ec-4f58-ba0b-5ed34a915483", 3, 0, 0.0, 388.0, 201, 681, 282.0, 681.0, 681.0, 681.0, 0.031157824768393502, 0.031249107458144652, 0.01998076653441901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/696ea0ab-b5bc-4085-bf01-1172a120b8dd", 3, 0, 0.0, 293.6666666666667, 216, 443, 222.0, 443.0, 443.0, 443.0, 0.0893734918223255, 0.04142833735514047, 0.0573130790657491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 102.93749999999999, 96, 116, 102.5, 112.5, 116.0, 116.0, 0.09984461681508153, 0.0742009310510518, 0.050117317424757724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 165.31250000000003, 98, 307, 104.0, 307.0, 307.0, 307.0, 0.09984586294907237, 0.045462044531254873, 0.055895157163628646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d4cbc60-612c-49dc-b04f-3d0745b02c7e", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 0.6691261574074073, 2.5535300925925926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 641.875, 505, 855, 604.0, 855.0, 855.0, 855.0, 0.07106057914372002, 20.894169701545568, 0.04052673654290283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1013.625, 806, 1320, 1017.5, 1320.0, 1320.0, 1320.0, 0.07086921087133694, 63.76824051681372, 0.040348388611317815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 199.125, 99, 301, 200.0, 301.0, 301.0, 301.0, 0.07125806106815832, 0.12609336587451456, 0.0394563677984822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 117.21428571428572, 99, 298, 102.0, 207.5, 298.0, 298.0, 0.07431984074319842, 0.05523183477106835, 0.037305076310550765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 142.85714285714286, 97, 306, 101.5, 300.0, 306.0, 306.0, 0.07432694298592567, 0.01988826404115589, 0.04238958467166073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 115.21428571428571, 99, 294, 101.0, 200.0, 294.0, 294.0, 0.07432615378081217, 0.02003322113623453, 0.04369564900004778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 129.28571428571428, 97, 305, 101.5, 295.5, 305.0, 305.0, 0.07432812682502096, 0.02003375293330643, 0.0437693949955934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4cf682ec-aa7c-4f21-ad08-532d1a58fc87", 3, 0, 0.0, 1423.3333333333333, 187, 3560, 523.0, 3560.0, 3560.0, 3560.0, 0.02434037581540259, 0.024411685510174277, 0.015608899855580437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 129.125, 99, 311, 104.0, 311.0, 311.0, 311.0, 0.07138331950281518, 0.05304951771644761, 0.04008340694738157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 659.2631578947368, 98, 1284, 885.0, 1221.0, 1284.0, 1284.0, 0.08901006750710909, 42.16474057957266, 0.048302235440998036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 225.0, 97, 1196, 102.5, 906.9000000000003, 1196.0, 1196.0, 0.09972388948099949, 11.239985247876191, 0.05755548699538153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 479.5263157894737, 96, 921, 594.0, 813.0, 921.0, 921.0, 0.08901256951178947, 13.786443912711464, 0.048390519517177086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 170.8125, 96, 599, 102.0, 534.6, 599.0, 599.0, 0.0998452398781888, 3.6932744480430335, 0.05772302930457791], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 409.87500000000006, 111, 682, 463.0, 671.5, 682.0, 682.0, 0.08474531384897326, 0.016520784450294226, 0.0576727447153352], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 262.64285714285717, 201, 592, 207.5, 499.0, 592.0, 592.0, 0.0742796203250264, 0.11511890376544617, 0.16705660703958572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 565.8636363636364, 140, 969, 588.0, 926.9999999999999, 969.0, 969.0, 0.09749871478966868, 0.05988934726826328, 0.04408389155040683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 105.36842105263159, 99, 130, 103.0, 112.0, 130.0, 130.0, 0.08900548086382161, 0.06614567474352367, 0.04467657926172296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 133.78947368421052, 97, 311, 103.0, 306.0, 311.0, 311.0, 0.08901215250124149, 0.09418195782229426, 0.04683020112061615], "isController": false}, {"data": ["login", 22, 0, 0.0, 2902.454545454545, 1723, 5287, 2763.0, 4077.7999999999997, 5122.899999999998, 5287.0, 0.0968096809680968, 42.244894801980195, 0.20443997524752475], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 107.5, 102, 116, 107.0, 113.9, 116.0, 116.0, 0.10194004651014621, 0.08252763530948361, 0.036236500907903535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7d4db32-a26c-49d0-ab59-c8f204c521ab", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b477e87-bc5e-48f4-b7a3-e00a7e5f88d7", 1, 0, 0.0, 667.0, 667, 667, 667.0, 667.0, 667.0, 667.0, 1.4992503748125936, 0.27086066341829085, 1.033662856071964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 771.3157894736843, 204, 1392, 991.0, 1324.0, 1392.0, 1392.0, 0.08896255612834955, 56.08117507684726, 0.1880989243139348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4ecec8e-4f16-4f64-9d25-41a2751c301d", 3, 0, 0.0, 383.6666666666667, 251, 515, 385.0, 515.0, 515.0, 515.0, 0.07395538025391347, 0.03346288364353507, 0.0474258135091828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85ca9b8c-d0ae-4cd3-8de8-a9eac08563e5", 3, 0, 0.0, 791.6666666666666, 195, 1890, 290.0, 1890.0, 1890.0, 1890.0, 0.019646365422396856, 0.02356668508513425, 0.012598743451211527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 438.66666666666663, 199, 1317, 401.0, 897.6000000000003, 1317.0, 1317.0, 0.11882317527210506, 9.648797682750043, 0.265209304547759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a077f697-a830-462c-80ac-f3e3aa1e805b", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, 38.46153846153846, 743.3846153846154, 99, 1632, 978.0, 1465.6, 1632.0, 1632.0, 0.1065180875906428, 78.43106346532016, 0.17481224906796672], "isController": false}, {"data": ["register", 25, 10, 40.0, 1044.2800000000002, 299, 2727, 903.0, 2095.200000000001, 2646.0, 2727.0, 0.10526936324667559, 0.03264995094447673, 0.04749457599605872], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 367.625, 199, 1301, 212.0, 1011.2000000000003, 1301.0, 1301.0, 0.09965866905847472, 15.03844693253731, 0.22094735686523656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 108.93333333333332, 102, 126, 108.0, 118.80000000000001, 126.0, 126.0, 0.10236113006687593, 0.07946982265934216, 0.03638618295345981], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85ca9b8c-d0ae-4cd3-8de8-a9eac08563e5", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 376.4444444444444, 204, 1482, 212.5, 729.6000000000012, 1482.0, 1482.0, 0.09456165419853745, 6.423333276968458, 0.2113272384844919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 104.5, 101, 111, 104.0, 110.6, 111.0, 111.0, 0.04458891252101252, 0.03313687737157279, 0.022381543980273866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c72d15c3-1518-49bd-8643-2ca53f911664", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 103.7, 99, 114, 102.0, 113.6, 114.0, 114.0, 0.04458990662873552, 0.011931283609642122, 0.025430181124200726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 123.0, 99, 310, 102.0, 289.70000000000005, 310.0, 310.0, 0.0445901054555994, 0.012018426861079528, 0.026214104965108245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 103.5, 100, 108, 103.0, 107.9, 108.0, 108.0, 0.04458970780364477, 0.012018319681451128, 0.026257415825779094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 117.0, 111, 123, 117.0, 123.0, 123.0, 123.0, 0.10614584439019212, 0.031304731451013694, 0.065615546385734], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1157.7543859649127, 782, 2040, 1086.0, 1617.4, 1746.4999999999993, 2040.0, 0.25857845361011816, 309.3497269332142, 0.5105914386715419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, 40.0, 1044.2800000000002, 299, 2727, 903.0, 2095.200000000001, 2646.0, 2727.0, 0.10604993679423767, 0.03289205070883778, 0.0478467488270877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d4cbc60-612c-49dc-b04f-3d0745b02c7e", 3, 0, 0.0, 298.3333333333333, 189, 483, 223.0, 483.0, 483.0, 483.0, 0.06061585710821951, 0.027427096803523805, 0.03887149690859129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 147.88888888888889, 101, 308, 104.0, 308.0, 308.0, 308.0, 0.05707581570853284, 0.01538371595269049, 0.033610075070552047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff9698e3-55f7-4f9b-bb27-fbb5f9d04433", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.26490331744868034, 1.010928335777126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 147.11111111111111, 99, 313, 101.0, 313.0, 313.0, 313.0, 0.05707147250740344, 0.015382545324261082, 0.03355178364204772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 140.53333333333333, 96, 305, 102.0, 300.2, 305.0, 305.0, 0.10560479868205211, 0.028463793394771862, 0.0620840711001908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 142.53333333333333, 99, 305, 102.0, 303.8, 305.0, 305.0, 0.10560331171985553, 0.02846339261199231, 0.06218632516315712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 141.6666666666667, 97, 305, 104.0, 302.0, 305.0, 305.0, 0.10560405519571951, 0.07848113867572515, 0.0530082855181639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 101.11111111111111, 99, 102, 102.0, 102.0, 102.0, 102.0, 0.05714902560911336, 0.015291829118063536, 0.03259280366769746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 141.6, 96, 306, 101.0, 304.2, 306.0, 306.0, 0.10560554217885354, 0.028257732965826045, 0.06022816077387741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 126.66666666666664, 99, 314, 104.0, 314.0, 314.0, 314.0, 0.05707074870481107, 0.042412929457384, 0.028646840658469615], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 674.1333333333333, 105, 1890, 523.0, 1702.8000000000002, 1890.0, 1890.0, 0.09182230547444586, 0.017653077348049388, 0.06248818744299365], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 111.66666666666667, 105, 121, 112.0, 121.0, 121.0, 121.0, 0.05585032113934655, 0.04396031136554035, 0.019853043842502093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc73f5c1-435f-48c6-a955-50c0edc7a64e", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1540.0909090909092, 831, 3127, 1430.0, 2155.7, 2981.799999999998, 3127.0, 0.09810260640788389, 0.05077576308220553, 0.045123366814563776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 276.8888888888889, 204, 623, 209.0, 623.0, 623.0, 623.0, 0.056957699415234285, 0.0882733095429461, 0.12809920093094196], "isController": false}, {"data": ["addBook", 59, 13, 22.033898305084747, 1141.5084745762713, 505, 3547, 843.0, 2087.0, 2860.0, 3547.0, 0.27831501485919147, 80.0865874053611, 1.0126509505165338], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=696ea0ab-b5bc-4085-bf01-1172a120b8dd", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 191.47368421052624, 100, 672, 105.0, 411.8, 418.1, 672.0, 0.25988118414633593, 0.19313435657750158, 0.12562615835198856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/366fff9e-67d3-4618-9597-a1ebceb57239", 2, 0, 0.0, 313.5, 223, 404, 313.5, 404.0, 404.0, 404.0, 0.023223678862968684, 0.026421470581404802, 0.014435421480741764], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 651.6140350877193, 478, 1019, 604.0, 815.0, 875.4999999999999, 1019.0, 0.25974972885773917, 76.3750447868913, 0.1306358499626325], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 151.38596491228074, 97, 408, 104.0, 305.2, 308.2, 408.0, 0.26059882867684375, 0.46113777105707116, 0.12673653972760565], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 961.0877192982458, 679, 1394, 932.0, 1289.0, 1342.4999999999998, 1394.0, 0.2594057333218042, 233.4137348296, 0.13020951848379625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 133.33333333333334, 101, 325, 107.5, 311.5, 325.0, 325.0, 0.09242666201110147, 0.06904921527196546, 0.03285479001175873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 13, 7.428571428571429, 206.32571428571427, 99, 2829, 110.0, 354.20000000000005, 533.3999999999999, 1994.52000000001, 0.7092342296703074, 1.5297137479989462, 0.33981897429532515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 107.0, 102, 114, 107.0, 113.8, 114.0, 114.0, 0.04479182997021343, 0.03468742301404224, 0.015922095809724306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4cf682ec-aa7c-4f21-ad08-532d1a58fc87", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 122.8, 101, 302, 107.0, 208.40000000000006, 302.0, 302.0, 0.11607661056297157, 0.0941988900174115, 0.0412616076610563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7d4db32-a26c-49d0-ab59-c8f204c521ab", 3, 0, 0.0, 384.0, 202, 527, 423.0, 527.0, 527.0, 527.0, 0.07900558306120299, 0.03574796889813547, 0.0506643875750553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=366fff9e-67d3-4618-9597-a1ebceb57239", 1, 0, 0.0, 620.0, 620, 620, 620.0, 620.0, 620.0, 620.0, 1.6129032258064515, 0.2913936491935484, 1.1120211693548387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 231.39999999999998, 203, 415, 212.5, 395.30000000000007, 415.0, 415.0, 0.04456864239458402, 0.06907269089863755, 0.10023592132297558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 313.79999999999995, 200, 610, 208.0, 608.2, 610.0, 610.0, 0.10552753213313353, 0.16354706396023722, 0.2373338930689517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=baafbd00-b8ec-4f58-ba0b-5ed34a915483", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fff4d2c-7685-4cb4-a941-92080e7613fd", 3, 0, 0.0, 743.6666666666667, 196, 1578, 457.0, 1578.0, 1578.0, 1578.0, 0.05888125613346418, 0.03785497423945044, 0.037759138861629044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 138.85714285714286, 103, 304, 107.0, 297.5, 304.0, 304.0, 0.07230433929327673, 0.05994764068358588, 0.025701933108156962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff9698e3-55f7-4f9b-bb27-fbb5f9d04433", 3, 0, 0.0, 429.6666666666667, 209, 555, 525.0, 555.0, 555.0, 555.0, 0.025038601176814255, 0.025111956453699454, 0.016056655051537787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4ecec8e-4f16-4f64-9d25-41a2751c301d", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 0.7002483042635659, 2.672298934108527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 132.21052631578948, 101, 314, 110.0, 299.0, 314.0, 314.0, 0.08710721522817506, 0.06762718369765544, 0.03096389291314035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b477e87-bc5e-48f4-b7a3-e00a7e5f88d7", 3, 0, 0.0, 671.3333333333333, 234, 1400, 380.0, 1400.0, 1400.0, 1400.0, 0.022123730650953903, 0.0262791318832457, 0.014187418418743224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 129.05555555555557, 99, 339, 103.5, 310.20000000000005, 339.0, 339.0, 0.09461235216819973, 0.0703125, 0.047490965834428384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 124.94444444444443, 98, 315, 102.0, 301.5, 315.0, 315.0, 0.09461434143162012, 0.033211522844107104, 0.053518290134878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 216.77777777777777, 99, 1175, 103.0, 392.00000000000125, 1175.0, 1175.0, 0.09461334678945377, 4.753709836962806, 0.055170586550187126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a077f697-a830-462c-80ac-f3e3aa1e805b", 3, 0, 0.0, 288.6666666666667, 189, 454, 223.0, 454.0, 454.0, 454.0, 0.04213542325032655, 0.03512656866669476, 0.027020437435919045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 201.38888888888889, 99, 784, 103.5, 439.3000000000005, 784.0, 784.0, 0.09461384410792285, 1.569618624078172, 0.055263272876839055], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 31.25, 0.7446016381236039], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.22338049143708116], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.25, 0.14892032762472077], "isController": false}, {"data": ["401/Unauthorized", 17, 53.125, 1.2658227848101267], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1343, 32, "401/Unauthorized", 17, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
