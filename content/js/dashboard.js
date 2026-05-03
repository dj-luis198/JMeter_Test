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

    var data = {"OkPercent": 97.7761304670126, "KoPercent": 2.223869532987398};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7827895073576455, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7c5a6c7-2943-4f74-a84a-314bd57e7f43"], "isController": false}, {"data": [0.14655172413793102, 500, 1500, "see books"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb74ca66-3d05-4c36-8fd0-e89cb61be9ed"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19d610a6-ace5-48a5-a1aa-27d71874647d"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb74ca66-3d05-4c36-8fd0-e89cb61be9ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4224137931034483, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e1bc5e5-ecc3-448c-b338-00c32283dc19"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/abc7868d-9c41-4e54-a070-7b7aa848e0c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5670451e-9184-4693-b6d0-5e4efda5fed5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de65e065-dd7c-4773-b659-a5dacedede94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c7c5a6c7-2943-4f74-a84a-314bd57e7f43"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abc7868d-9c41-4e54-a070-7b7aa848e0c4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7ce47f65-04d0-421e-a09b-f4ef227a0e3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/534ed5bc-5fd3-4fba-8a8e-530dc13a2f54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.319672131147541, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9568965517241379, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=addf2202-1f71-4692-bb58-fb58c36972eb"], "isController": false}, {"data": [0.5431034482758621, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8c0de05-5fac-44fc-846b-bd780e44522f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/addf2202-1f71-4692-bb58-fb58c36972eb"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ce47f65-04d0-421e-a09b-f4ef227a0e3b"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5670451e-9184-4693-b6d0-5e4efda5fed5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e1bc5e5-ecc3-448c-b338-00c32283dc19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7ccf2fa-6591-4f9c-9128-1ceb71b9d00d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de65e065-dd7c-4773-b659-a5dacedede94"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19d610a6-ace5-48a5-a1aa-27d71874647d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b7ccf2fa-6591-4f9c-9128-1ceb71b9d00d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6502062-05d4-497c-8295-915652ec2f83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84ba28ba-dd60-4dd6-af0c-fe4799604689"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1349, 30, 2.223869532987398, 358.0948851000738, 97, 5241, 111.0, 1012.0, 1227.5, 1630.5, 5.279554153588453, 743.2043879261508, 3.8730869137796753], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7c5a6c7-2943-4f74-a84a-314bd57e7f43", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1755.0862068965514, 1208, 5661, 1699.5, 2023.0, 2290.9499999999957, 5661.0, 0.251103991687592, 302.1619625819876, 1.2346763653779549], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 296.9375, 203, 1021, 211.0, 599.6000000000004, 1021.0, 1021.0, 0.07348618459729571, 5.601460200628766, 0.16409701841288213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 121.26666666666668, 103, 307, 107.0, 196.00000000000006, 307.0, 307.0, 0.08395788672401923, 0.0651821483843704, 0.029844405046428713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb74ca66-3d05-4c36-8fd0-e89cb61be9ed", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19d610a6-ace5-48a5-a1aa-27d71874647d", 1, 0, 0.0, 807.0, 807, 807, 807.0, 807.0, 807.0, 807.0, 1.2391573729863692, 0.22387120508054523, 0.8543409231722429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 23, 0, 0.0, 321.69565217391306, 202, 597, 395.0, 412.2, 560.1999999999995, 597.0, 0.13143983770037432, 0.20370607659227932, 0.2956112756093379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 124.0, 99, 307, 104.5, 286.9000000000001, 307.0, 307.0, 0.04692962902128259, 0.03487641375507426, 0.023556473942323485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb74ca66-3d05-4c36-8fd0-e89cb61be9ed", 3, 0, 0.0, 309.0, 228, 438, 261.0, 438.0, 438.0, 438.0, 0.034580936682304934, 0.03468224802024138, 0.02217592619275414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 161.70000000000002, 101, 304, 103.0, 303.9, 304.0, 304.0, 0.04688562252385306, 0.01254556696439037, 0.02673945659563495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 141.1, 98, 302, 102.5, 301.4, 302.0, 302.0, 0.04693095049254033, 0.012649357749942509, 0.02759026581690359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 140.70000000000002, 100, 302, 102.0, 301.0, 302.0, 302.0, 0.04688826058619703, 0.01263785148612342, 0.02761095813816095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 113.66666666666667, 107, 123, 111.0, 123.0, 123.0, 123.0, 0.050958010599266204, 0.015028632032205462, 0.03150041084896046], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1251.0172413793102, 795, 5241, 1100.5, 1605.9, 1759.9999999999955, 5241.0, 0.25001293170336397, 299.1023848755108, 0.4936778788126972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e1bc5e5-ecc3-448c-b338-00c32283dc19", 3, 0, 0.0, 376.3333333333333, 276, 488, 365.0, 488.0, 488.0, 488.0, 0.09882399446585631, 0.044715283954277436, 0.06337345999275291], "isController": false}, {"data": ["deleteBook", 13, 3, 23.076923076923077, 428.2307692307692, 103, 1186, 433.0, 932.7999999999997, 1186.0, 1186.0, 0.067639284896668, 0.014003445701263294, 0.045226658268122125], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, 23.076923076923077, 428.2307692307692, 103, 1186, 433.0, 932.7999999999997, 1186.0, 1186.0, 0.06786633464367564, 0.014050452094198473, 0.04537847390800458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, 36.36363636363637, 1057.9545454545457, 149, 2406, 1090.5, 1663.1, 2295.1499999999983, 2406.0, 0.0898333183611136, 0.02797720887879852, 0.04053026668245555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 130.71428571428572, 100, 303, 102.0, 303.0, 303.0, 303.0, 0.0436716639527847, 0.011770878174774, 0.025716809925321455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 165.0, 98, 308, 102.5, 306.6, 308.0, 308.0, 0.09852338082981318, 0.026362701511102354, 0.05618911562950283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 101.71428571428571, 99, 104, 103.0, 104.0, 104.0, 104.0, 0.04372731645458918, 0.01178587826315099, 0.02570687940006122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 103.31250000000001, 99, 108, 103.5, 106.6, 108.0, 108.0, 0.09852034753052591, 0.07321678170969749, 0.049452596319033516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abc7868d-9c41-4e54-a070-7b7aa848e0c4", 3, 0, 0.0, 345.3333333333333, 187, 549, 300.0, 549.0, 549.0, 549.0, 0.020938169585214862, 0.024748207605441132, 0.013427146511351977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 128.125, 100, 306, 103.0, 304.6, 306.0, 306.0, 0.09852216748768473, 0.026554802955665025, 0.05801647167487684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 127.93750000000003, 100, 303, 103.0, 302.3, 303.0, 303.0, 0.09852398751208459, 0.026555293509116548, 0.057921328595971606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 254.93333333333334, 101, 992, 103.0, 941.6, 992.0, 992.0, 0.08452990104366251, 10.161099462812478, 0.04872576457295494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 222.0, 99, 802, 103.0, 796.0, 802.0, 802.0, 0.08462527926342157, 3.337453526617471, 0.048863385533026424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 101.71428571428571, 100, 103, 102.0, 103.0, 103.0, 103.0, 0.04372649700785828, 0.011700254082180827, 0.02493776782479417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 103.60000000000001, 102, 108, 103.0, 107.4, 108.0, 108.0, 0.08495454931611589, 0.06313516799762127, 0.042643201512190976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5670451e-9184-4693-b6d0-5e4efda5fed5", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 102.99999999999999, 101, 105, 103.0, 105.0, 105.0, 105.0, 0.043725404459991256, 0.03249514921294272, 0.021948103410581548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 161.8, 100, 401, 102.0, 344.00000000000006, 401.0, 401.0, 0.08485794779539052, 0.039699818545421636, 0.047445316124141525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de65e065-dd7c-4773-b659-a5dacedede94", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 106.42857142857143, 105, 110, 106.0, 110.0, 110.0, 110.0, 0.04274469813083541, 0.03364475263032553, 0.0151944044136954], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 508.61538461538464, 101, 1618, 438.0, 1262.7999999999997, 1618.0, 1618.0, 0.0691085003455425, 0.013871537929934612, 0.04702409826697145], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1464.0476190476195, 999, 2409, 1462.0, 1893.2000000000003, 2363.1999999999994, 2409.0, 0.10073053622222115, 0.052135922068141806, 0.04633211187565055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7c5a6c7-2943-4f74-a84a-314bd57e7f43", 3, 0, 0.0, 349.6666666666667, 209, 535, 305.0, 535.0, 535.0, 535.0, 0.02217344065278609, 0.02620825618823773, 0.014219296251949416], "isController": false}, {"data": ["goToProfile", 13, 3, 23.076923076923077, 231.23076923076928, 102, 471, 209.0, 428.59999999999997, 471.0, 471.0, 0.0675275564374539, 0.13740883779880944, 0.04364029206966766], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abc7868d-9c41-4e54-a070-7b7aa848e0c4", 1, 0, 0.0, 860.0, 860, 860, 860.0, 860.0, 860.0, 860.0, 1.1627906976744187, 0.21007449127906977, 0.8016896802325582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ce47f65-04d0-421e-a09b-f4ef227a0e3b", 3, 0, 0.0, 887.3333333333334, 471, 1497, 694.0, 1497.0, 1497.0, 1497.0, 0.017190203875817968, 0.023698083793648794, 0.011023665896927538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 236.14285714285714, 205, 406, 208.0, 406.0, 406.0, 406.0, 0.04364253026921206, 0.06763739798558549, 0.09815307344726111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/534ed5bc-5fd3-4fba-8a8e-530dc13a2f54", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.0861766581632655, 2.0295227465986394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 104.6875, 100, 112, 103.5, 110.6, 112.0, 112.0, 0.07352130279748557, 0.054638390067271995, 0.036904247693269124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 115.0, 100, 303, 103.0, 163.70000000000016, 303.0, 303.0, 0.07352265416781546, 0.02657477770885029, 0.04154496657016818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 778.4285714285714, 605, 907, 808.0, 907.0, 907.0, 907.0, 0.048870395710575554, 14.369518988766792, 0.027871397553687623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1034.0, 873, 1192, 1091.0, 1192.0, 1192.0, 1192.0, 0.04870175048006011, 43.82192069050385, 0.0277276567674561], "isController": false}, {"data": ["addBook", 61, 10, 16.39344262295082, 975.6721311475411, 516, 1975, 832.0, 1777.8, 1850.2, 1975.0, 0.3015100215011245, 83.96605193324766, 1.0981531352717298], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 142.42857142857144, 103, 374, 104.0, 374.0, 374.0, 374.0, 0.04904296163439173, 0.08678305320460723, 0.027155624264355575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 114.47058823529412, 100, 305, 103.0, 144.19999999999987, 305.0, 305.0, 0.09042793691321577, 0.06720279295991914, 0.045390585520891515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 137.5294117647059, 98, 312, 103.0, 306.4, 312.0, 312.0, 0.09043034203947017, 0.03218671870844194, 0.05112680528219586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 163.99999999999997, 100, 923, 103.0, 428.59999999999957, 923.0, 923.0, 0.09042986100398424, 4.809348627394396, 0.052705731258411305], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 284.25862068965506, 100, 4133, 105.5, 414.2, 788.1499999999961, 4133.0, 0.25076092971776426, 0.18635651124533067, 0.12121744161161456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 179.41176470588235, 100, 793, 104.0, 400.99999999999966, 793.0, 793.0, 0.09042841792823175, 1.586995878192921, 0.052793199184548445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=addf2202-1f71-4692-bb58-fb58c36972eb", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 637.0862068965519, 486, 912, 602.0, 834.5000000000001, 888.15, 912.0, 0.25095514393142865, 73.78914481085339, 0.12621279211395095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 104.0, 102, 107, 104.0, 107.0, 107.0, 107.0, 0.04904399246123773, 0.036447732678712805, 0.02753935123555829], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 167.58620689655172, 101, 417, 108.5, 308.2, 312.25, 417.0, 0.2514774299006664, 0.4449971708789136, 0.12230054696341003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 177.8125, 99, 909, 102.5, 492.50000000000045, 909.0, 909.0, 0.07352299201816018, 4.153335538544429, 0.04282857884651616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 831.4666666666667, 101, 1290, 1122.0, 1282.8, 1290.0, 1290.0, 0.07806970062872133, 46.83851664641192, 0.04142370183099471], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 963.206896551724, 691, 1312, 980.5, 1189.7, 1215.3, 1312.0, 0.25083684360755276, 225.70343280221516, 0.1259083375139474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 158.4375, 100, 803, 102.0, 454.4000000000003, 803.0, 803.0, 0.07352265416781546, 1.3697094562769965, 0.042900181509052476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 605.7333333333333, 100, 919, 802.0, 913.0, 919.0, 919.0, 0.07807010695604653, 15.310483188903635, 0.04150015776667448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 23, 0, 0.0, 108.65217391304348, 103, 132, 107.0, 117.0, 128.99999999999994, 132.0, 0.12778558689697703, 0.09546481833612054, 0.04542378284228481], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 428.7692307692308, 107, 866, 423.0, 863.6, 866.0, 866.0, 0.06798238733226654, 0.014074478627383306, 0.04575226923901562], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 10, 5.555555555555555, 154.1555555555555, 100, 464, 108.0, 260.8, 326.0, 463.19, 0.7319929728674606, 1.5755799265160388, 0.35167592078616045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 131.7, 103, 303, 105.0, 290.20000000000005, 303.0, 303.0, 0.047593664331404203, 0.036857202944144074, 0.016918060367803838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 305.0, 205, 1026, 208.0, 690.7999999999997, 1026.0, 1026.0, 0.09037841975991238, 6.492065472519643, 0.20190293922582908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8c0de05-5fac-44fc-846b-bd780e44522f", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 0.9392233455882353, 1.7549402573529411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 119.43749999999999, 103, 303, 106.0, 178.40000000000012, 303.0, 303.0, 0.09040416311171129, 0.07336509721272665, 0.03213585485611612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/addf2202-1f71-4692-bb58-fb58c36972eb", 3, 0, 0.0, 727.6666666666667, 204, 1618, 361.0, 1618.0, 1618.0, 1618.0, 0.01678218403343011, 0.023135595501815272, 0.010762012547479596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 626.4285714285716, 190, 1529, 579.0, 1216.6000000000001, 1498.8999999999996, 1529.0, 0.1033576469893394, 0.06348824214481882, 0.046732998589906385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 103.46666666666665, 100, 110, 103.0, 107.0, 110.0, 110.0, 0.07807051328760137, 0.05801919981627406, 0.03918773811506553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 142.73333333333332, 98, 312, 102.0, 307.2, 312.0, 312.0, 0.07807091962338589, 0.0990626447564968, 0.040153663087548724], "isController": false}, {"data": ["login", 21, 0, 0.0, 2756.4285714285716, 1886, 3460, 2735.0, 3423.6, 3456.7, 3460.0, 0.09736827463417348, 38.95970275581196, 0.20072698022728538], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ce47f65-04d0-421e-a09b-f4ef227a0e3b", 1, 0, 0.0, 866.0, 866, 866, 866.0, 866.0, 866.0, 866.0, 1.1547344110854503, 0.2086190098152425, 0.7961352482678984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 307.1, 204, 611, 209.5, 590.7, 611.0, 611.0, 0.04686255213458925, 0.07262780296639955, 0.10539497809175688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 124.31249999999999, 101, 320, 106.0, 224.8000000000001, 320.0, 320.0, 0.0699205964226875, 0.056605639096101494, 0.024854587009627192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 394.1333333333334, 205, 1095, 212.0, 1044.6000000000001, 1095.0, 1095.0, 0.08447943770486263, 13.58904005134942, 0.1871142545675216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5670451e-9184-4693-b6d0-5e4efda5fed5", 3, 0, 0.0, 272.0, 195, 420, 201.0, 420.0, 420.0, 420.0, 0.021684291176661923, 0.025630098067206848, 0.013905616412117183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e1bc5e5-ecc3-448c-b338-00c32283dc19", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.5117962110481586, 1.953125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7ccf2fa-6591-4f9c-9128-1ceb71b9d00d", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 122.11764705882354, 104, 307, 106.0, 170.19999999999987, 307.0, 307.0, 0.09148441536077148, 0.07584987172001463, 0.032519850772774236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 943.5333333333333, 206, 1391, 1227.0, 1385.6, 1391.0, 1391.0, 0.07802868334399725, 62.273264698978345, 0.16217875753627034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de65e065-dd7c-4773-b659-a5dacedede94", 3, 0, 0.0, 275.0, 197, 425, 203.0, 425.0, 425.0, 425.0, 0.07730564073491895, 0.034978789264823354, 0.04957425528899425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19d610a6-ace5-48a5-a1aa-27d71874647d", 3, 0, 0.0, 404.6666666666667, 299, 516, 399.0, 516.0, 516.0, 516.0, 0.025974025974025976, 0.026050121753246752, 0.016656520562770564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 119.93333333333332, 102, 311, 105.0, 192.80000000000007, 311.0, 311.0, 0.07994244144216164, 0.062064688424334484, 0.0284170397313934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7ccf2fa-6591-4f9c-9128-1ceb71b9d00d", 3, 0, 0.0, 622.0, 223, 913, 730.0, 913.0, 913.0, 913.0, 0.022579479768786125, 0.022645630588421242, 0.01447967940901975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 295.31249999999994, 205, 412, 211.5, 412.0, 412.0, 412.0, 0.09845608550911027, 0.15258770283491993, 0.22143004387449314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 664.3076923076924, 101, 1296, 1008.0, 1287.2, 1296.0, 1296.0, 0.07719485763486832, 49.737472536444876, 0.11733479187078769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6502062-05d4-497c-8295-915652ec2f83", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84ba28ba-dd60-4dd6-af0c-fe4799604689", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.8043726385390427, 1.5029715050377832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 23, 0, 0.0, 110.69565217391303, 99, 295, 103.0, 104.6, 256.99999999999943, 295.0, 0.13151649960259146, 0.09773833613044149, 0.06601511796458204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 23, 0, 0.0, 154.95652173913047, 98, 310, 103.0, 307.6, 309.6, 310.0, 0.13152176399277202, 0.03519234700587845, 0.07500850602712779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 23, 0, 0.0, 147.1304347826087, 98, 307, 103.0, 306.0, 306.8, 307.0, 0.13151950777394655, 0.035448617329696536, 0.07731908562491781], "isController": false}, {"data": ["register", 22, 8, 36.36363636363637, 1057.9545454545457, 149, 2406, 1090.5, 1663.1, 2295.1499999999983, 2406.0, 0.09240242094342871, 0.028777316465691403, 0.041689373511586005], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 23, 0, 0.0, 190.5217391304348, 97, 309, 106.0, 307.6, 308.8, 309.0, 0.1315187557182068, 0.03544841462717292, 0.07744707978327997], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 26.666666666666668, 0.5930318754633062], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.2223869532987398], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.2223869532987398], "isController": false}, {"data": ["401/Unauthorized", 16, 53.333333333333336, 1.1860637509266123], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1349, 30, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
