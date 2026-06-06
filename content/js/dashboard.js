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

    var data = {"OkPercent": 97.66252739225712, "KoPercent": 2.337472607742878};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7574039067422811, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b248bbc-1c42-4981-9ae3-f7c090c27373"], "isController": false}, {"data": [0.008620689655172414, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=712870fb-9b92-462e-b094-f5eca12d0dd6"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c7d7584b-951f-46b9-8f77-f12b707c694f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd5cc317-c980-47c6-bb15-e02e12840db3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/198f9731-cda4-4f0d-9612-9d482cfe61a6"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d09859e-1ccb-4a23-acd6-fbcf13efef13"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c05ea1c-1d70-42bd-808a-76e0065443c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef6047eb-97c0-47a8-bb0e-4a1fe852e85e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=187b5ae7-9f70-4dc0-aaad-e2f1cbe14890"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bb3879e-5f0d-4cc0-a1c7-b97a51c7b870"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b774d85a-3741-4488-8b3c-bbbf19adc2eb"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2087059a-4e4d-4c2e-99ab-14c8e1148c2a"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/38946882-fcb3-4edc-b87e-472152634399"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.31896551724137934, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd5cc317-c980-47c6-bb15-e02e12840db3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2a7f0d74-e7c9-45d0-8b4f-c686c007bff2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/187b5ae7-9f70-4dc0-aaad-e2f1cbe14890"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc2d2880-9684-4b66-a622-8711156cc47c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/712870fb-9b92-462e-b094-f5eca12d0dd6"], "isController": false}, {"data": [0.9568965517241379, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d09859e-1ccb-4a23-acd6-fbcf13efef13"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.45689655172413796, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.904891304347826, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7c05ea1c-1d70-42bd-808a-76e0065443c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b774d85a-3741-4488-8b3c-bbbf19adc2eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a7f0d74-e7c9-45d0-8b4f-c686c007bff2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc2d2880-9684-4b66-a622-8711156cc47c"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b248bbc-1c42-4981-9ae3-f7c090c27373"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38946882-fcb3-4edc-b87e-472152634399"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2087059a-4e4d-4c2e-99ab-14c8e1148c2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1369, 32, 2.337472607742878, 415.19795471146847, 118, 2286, 137.0, 1153.0, 1439.0, 1942.2999999999986, 5.387685066391707, 747.3865313838066, 3.9497517628533085], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/3b248bbc-1c42-4981-9ae3-f7c090c27373", 3, 0, 0.0, 350.6666666666667, 218, 602, 232.0, 602.0, 602.0, 602.0, 0.02348980151117723, 0.02776415015855616, 0.015063446932623419], "isController": false}, {"data": ["see books", 58, 0, 0.0, 2057.3620689655177, 1450, 2792, 2026.5, 2497.4, 2547.1499999999996, 2792.0, 0.26073040476147663, 313.74750841614144, 1.2820093632558933], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=712870fb-9b92-462e-b094-f5eca12d0dd6", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 433.5714285714285, 124, 775, 484.5, 684.5, 775.0, 775.0, 0.07517666516313337, 0.01542233344341345, 0.0503257851262968], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 433.5714285714285, 124, 775, 484.5, 684.5, 775.0, 775.0, 0.07601465997013711, 0.015594246301072348, 0.050886767001493145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 221.38888888888886, 121, 380, 127.0, 380.0, 380.0, 380.0, 0.09126030480941806, 0.039649116803050125, 0.05119528817976252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 167.3888888888889, 121, 380, 127.0, 371.90000000000003, 380.0, 380.0, 0.0913793716145212, 0.06790986503774477, 0.04586816114244521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 255.77777777777777, 120, 977, 128.0, 772.7000000000003, 977.0, 977.0, 0.09137148600493405, 3.0070300523355566, 0.05293319919491569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 275.6111111111111, 120, 1374, 124.5, 1123.8000000000004, 1374.0, 1374.0, 0.09137148600493405, 9.157027054208672, 0.05284396922811399], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7d7584b-951f-46b9-8f77-f12b707c694f", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.5440135221465077, 1.016490097955707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd5cc317-c980-47c6-bb15-e02e12840db3", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/198f9731-cda4-4f0d-9612-9d482cfe61a6", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.663900077962578, 1.2404983108108107], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 361.00000000000006, 121, 1978, 225.5, 1222.0, 1978.0, 1978.0, 0.0742032426817052, 0.1394105844300396, 0.04795570894573093], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9d09859e-1ccb-4a23-acd6-fbcf13efef13", 2, 0, 0.0, 291.0, 214, 368, 291.0, 368.0, 368.0, 368.0, 0.02361637559483746, 0.033625659782493184, 0.014679514713001995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c05ea1c-1d70-42bd-808a-76e0065443c2", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef6047eb-97c0-47a8-bb0e-4a1fe852e85e", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.7208486173814899, 1.346906743792325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 139.4, 121, 375, 127.0, 137.20000000000002, 363.14999999999986, 375.0, 0.09976654628170081, 0.07414291183630306, 0.05007812967655686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 136.59999999999997, 120, 364, 125.0, 127.9, 352.1999999999998, 364.0, 0.09976803930860749, 0.02669574489312349, 0.0568989599181902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 851.1428571428571, 717, 977, 852.0, 977.0, 977.0, 977.0, 0.047888133320563166, 14.080701231922228, 0.02731120103438368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1305.7142857142858, 957, 1517, 1375.0, 1517.0, 1517.0, 1517.0, 0.04764303118576699, 42.86928320846889, 0.027124889825490384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 263.85714285714283, 123, 377, 356.0, 377.0, 377.0, 377.0, 0.04801492578264329, 0.084963911638818, 0.026586389569100335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=187b5ae7-9f70-4dc0-aaad-e2f1cbe14890", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 158.33333333333331, 119, 378, 126.0, 375.0, 378.0, 378.0, 0.07989943324668683, 0.05937838740305536, 0.04010577020390336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 172.2, 118, 380, 124.0, 372.8, 380.0, 380.0, 0.07979402502340624, 0.029340927951315005, 0.04506076647480636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 262.8666666666667, 120, 1256, 126.0, 723.8000000000003, 1256.0, 1256.0, 0.07942517354400419, 4.78444111318352, 0.04623827485875557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 215.33333333333331, 120, 999, 125.0, 625.2000000000003, 999.0, 999.0, 0.07953298232777133, 1.5790300190614048, 0.04637870590558905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bb3879e-5f0d-4cc0-a1c7-b97a51c7b870", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 197.14285714285714, 124, 382, 127.0, 382.0, 382.0, 382.0, 0.04809542131589073, 0.035742788692766446, 0.02700670630530973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 716.7727272727271, 120, 1982, 193.0, 1486.8999999999999, 1909.399999999999, 1982.0, 0.09800602291559009, 40.098950235771305, 0.05378846179547034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 162.39999999999998, 121, 380, 125.0, 374.8, 379.75, 380.0, 0.09977003008066407, 0.026891140920178986, 0.058653865340390396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 507.99999999999994, 121, 1069, 371.5, 1009.5, 1060.3, 1069.0, 0.09800558631842014, 13.112997795988008, 0.05388393075905327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 194.15, 122, 500, 127.0, 376.0, 493.7999999999999, 500.0, 0.09964575932559751, 0.02685764606822745, 0.058678118040366496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b774d85a-3741-4488-8b3c-bbbf19adc2eb", 3, 0, 0.0, 446.6666666666667, 330, 544, 466.0, 544.0, 544.0, 544.0, 0.025738038246724836, 0.025813442655650786, 0.016505187287124974], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 421.0, 126, 851, 448.0, 765.3999999999999, 851.0, 851.0, 0.07332453438920662, 0.014536016094735298, 0.04974963901767685], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 441.06666666666666, 247, 1635, 256.0, 1099.2000000000003, 1635.0, 1635.0, 0.0793680189213357, 6.444920827094125, 0.17714673129428074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 653.4545454545455, 180, 1285, 670.5, 1246.2, 1281.25, 1285.0, 0.09411362080766598, 0.057810026843771394, 0.04255332659565366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 127.45454545454545, 121, 138, 127.0, 134.1, 137.54999999999998, 138.0, 0.09800383996863878, 0.07283293185169347, 0.04919333373425813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 216.18181818181816, 118, 510, 127.5, 450.19999999999993, 505.3499999999999, 510.0, 0.09800383996863878, 0.09313148997019792, 0.05215154623331151], "isController": false}, {"data": ["login", 22, 0, 0.0, 2848.5454545454545, 1449, 4632, 2782.5, 4300.6, 4588.499999999999, 4632.0, 0.09581881533101046, 36.60332762821211, 0.1951253538763066], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 156.35000000000002, 125, 385, 130.0, 346.7000000000005, 384.2, 385.0, 0.1010192845814266, 0.08178221378711197, 0.035909198816053985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2087059a-4e4d-4c2e-99ab-14c8e1148c2a", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 879.5454545454543, 249, 2113, 501.5, 1618.5, 2040.849999999999, 2113.0, 0.0979479896175131, 53.346367326108926, 0.20889600093941024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 520.6111111111111, 247, 1502, 379.0, 1249.1000000000004, 1502.0, 1502.0, 0.09120389136603162, 12.249149713721119, 0.20252687031313335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 928.9166666666666, 121, 1890, 1137.5, 1873.8, 1890.0, 1890.0, 0.08160378641568969, 56.95788893979681, 0.12975055167559776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38946882-fcb3-4edc-b87e-472152634399", 3, 0, 0.0, 359.3333333333333, 268, 510, 300.0, 510.0, 510.0, 510.0, 0.02366602505443186, 0.023735359112208514, 0.015176454868890221], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1020.6818181818184, 238, 1611, 1078.0, 1412.7, 1583.9999999999995, 1611.0, 0.09858088337433402, 0.03085903717843588, 0.044476921991154605], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 130.86666666666667, 125, 151, 129.0, 142.6, 151.0, 151.0, 0.08049369466058491, 0.06249266333512209, 0.028612993023879797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 360.25, 249, 751, 257.5, 612.4000000000002, 744.6499999999999, 751.0, 0.09958175662218681, 0.1543322732025493, 0.22396170459071899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 419.9230769230769, 249, 733, 493.0, 640.1999999999999, 733.0, 733.0, 0.11506868715479394, 0.17833399073697068, 0.2587921743334868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 149.9, 121, 370, 126.0, 346.20000000000005, 370.0, 370.0, 0.044847473741804124, 0.033329030778821225, 0.022511329593054023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 159.20000000000002, 119, 486, 123.0, 450.10000000000014, 486.0, 486.0, 0.044847473741804124, 0.01200020293481868, 0.025577074868372664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 151.8, 123, 381, 127.0, 356.4000000000001, 381.0, 381.0, 0.044847473741804124, 0.012087795656970643, 0.026365409367740313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 149.0, 119, 371, 125.0, 347.0000000000001, 371.0, 371.0, 0.04484868055181817, 0.01208812092998224, 0.02640991637963511], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 129.0, 126, 132, 129.0, 132.0, 132.0, 132.0, 0.320358801858081, 0.09448081851673874, 0.19803429841422393], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1419.603448275862, 952, 2282, 1350.0, 1970.8, 2024.7499999999998, 2282.0, 0.2518158965297165, 301.2593576198188, 0.49723803006160805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1020.6818181818184, 238, 1611, 1078.0, 1412.7, 1583.9999999999995, 1611.0, 0.09708223748080419, 0.030389912052318502, 0.043800775113409705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 183.0, 120, 364, 124.5, 364.0, 364.0, 364.0, 0.041751910149889354, 0.011253444532587366, 0.02458632990271805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 217.625, 125, 370, 127.5, 370.0, 370.0, 370.0, 0.041751474348937945, 0.01125332707061218, 0.024545300349668595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 225.66666666666669, 121, 1341, 125.0, 760.8000000000004, 1341.0, 1341.0, 0.07802543629223127, 4.700123255806393, 0.045423401778979945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 198.6, 122, 960, 125.0, 597.6000000000003, 960.0, 960.0, 0.07802908924447034, 1.5491720625949355, 0.045501728669447974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd5cc317-c980-47c6-bb15-e02e12840db3", 3, 0, 0.0, 324.0, 229, 486, 257.0, 486.0, 486.0, 486.0, 0.07092198581560284, 0.03209035165484634, 0.04548057033096927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 131.125, 121, 174, 125.0, 174.0, 174.0, 174.0, 0.04175212805377674, 0.01117195613938948, 0.023811760530669548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 141.46666666666667, 119, 363, 125.0, 224.4000000000001, 363.0, 363.0, 0.07804289237364856, 0.057998672945650934, 0.03917387371099156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 191.00000000000003, 122, 381, 131.5, 381.0, 381.0, 381.0, 0.041750820664568686, 0.031027709497789817, 0.02095695490389483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 124.00000000000001, 119, 128, 124.0, 127.4, 128.0, 128.0, 0.07804817133134571, 0.02869896299996358, 0.04407485925313103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 130.75, 127, 145, 129.0, 145.0, 145.0, 145.0, 0.044201581311571425, 0.03479147904016266, 0.015712280856847654], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 493.66666666666663, 126, 1011, 498.0, 898.5000000000005, 1011.0, 1011.0, 0.08212147134302823, 0.01602598374679213, 0.05588376817792985], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1419.181818181818, 992, 2286, 1330.5, 1972.8999999999996, 2254.1999999999994, 2286.0, 0.09476386567652786, 0.04904770391460914, 0.043587676497699825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 409.5, 253, 752, 260.5, 752.0, 752.0, 752.0, 0.04172294918666326, 0.06466242222581503, 0.09383589060242722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a7f0d74-e7c9-45d0-8b4f-c686c007bff2", 3, 0, 0.0, 986.6666666666666, 346, 1978, 636.0, 1978.0, 1978.0, 1978.0, 0.05804953560371517, 0.02626590315402477, 0.0372257764125387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/187b5ae7-9f70-4dc0-aaad-e2f1cbe14890", 3, 0, 0.0, 953.3333333333334, 223, 1626, 1011.0, 1626.0, 1626.0, 1626.0, 0.01615169673574209, 0.0222664178632382, 0.010357696148897108], "isController": false}, {"data": ["addBook", 63, 15, 23.80952380952381, 1211.1587301587301, 623, 3416, 999.0, 2143.8, 2232.0, 3416.0, 0.28576612537421753, 77.08093836466932, 1.040752680474916], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dc2d2880-9684-4b66-a622-8711156cc47c", 3, 0, 0.0, 406.3333333333333, 222, 548, 449.0, 548.0, 548.0, 548.0, 0.01897065240073606, 0.026152575819374094, 0.012165424879378267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/712870fb-9b92-462e-b094-f5eca12d0dd6", 3, 0, 0.0, 353.6666666666667, 220, 471, 370.0, 471.0, 471.0, 471.0, 0.044730721059223474, 0.028757543649728635, 0.028684739741754638], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 217.05172413793093, 121, 527, 128.5, 500.1, 504.34999999999997, 527.0, 0.25315461199690975, 0.1881354098922347, 0.12237454388522494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d09859e-1ccb-4a23-acd6-fbcf13efef13", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.28361705259026687, 1.082343995290424], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 779.8793103448277, 582, 1213, 733.5, 1010.3, 1118.45, 1213.0, 0.2530806018082173, 74.41409999847279, 0.12728174797971864], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 197.10344827586206, 121, 503, 129.0, 375.0, 379.1, 503.0, 0.2536361807638822, 0.4488171479923384, 0.1233504082230599], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1199.98275862069, 825, 1993, 1154.5, 1500.2, 1642.9999999999995, 1993.0, 0.25242853661084225, 227.13564096447286, 0.12670729279098916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 131.6153846153846, 123, 148, 131.0, 145.2, 148.0, 148.0, 0.11777602623687476, 0.08798697272579023, 0.041865696826389076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 15, 8.152173913043478, 191.20652173913044, 119, 1056, 133.0, 357.0, 402.25, 1038.15, 0.7522762489216692, 1.5881622599053113, 0.36199621255483644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 158.4, 124, 397, 133.0, 371.6000000000001, 397.0, 397.0, 0.042949791693510285, 0.03326092266890005, 0.015267308766052484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c05ea1c-1d70-42bd-808a-76e0065443c2", 3, 0, 0.0, 337.3333333333333, 228, 434, 350.0, 434.0, 434.0, 434.0, 0.019551616266944735, 0.026953481409671534, 0.01253798308785193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b774d85a-3741-4488-8b3c-bbbf19adc2eb", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 131.66666666666666, 125, 155, 130.0, 137.90000000000003, 155.0, 155.0, 0.0874389142029943, 0.0709587282252815, 0.03108180153309563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a7f0d74-e7c9-45d0-8b4f-c686c007bff2", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 339.29999999999995, 249, 751, 255.0, 737.3000000000001, 751.0, 751.0, 0.044821944824185916, 0.06946526019138971, 0.10080560442392596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc2d2880-9684-4b66-a622-8711156cc47c", 1, 0, 0.0, 851.0, 851, 851, 851.0, 851.0, 851.0, 851.0, 1.1750881316098707, 0.21229619565217392, 0.8101681844888367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 369.06666666666666, 244, 1705, 254.0, 981.4000000000004, 1705.0, 1705.0, 0.07797108832045078, 6.331485878786147, 0.17402882948502696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 197.26666666666665, 127, 388, 137.0, 380.2, 388.0, 388.0, 0.07617113114129745, 0.06315360384664212, 0.027076456772883076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 142.95454545454547, 123, 362, 131.5, 145.8, 329.74999999999955, 362.0, 0.09887151646435458, 0.07676060116129091, 0.03514573436818854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b248bbc-1c42-4981-9ae3-f7c090c27373", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38946882-fcb3-4edc-b87e-472152634399", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 142.6923076923077, 122, 357, 124.0, 267.3999999999999, 357.0, 357.0, 0.11544677903486493, 0.08579589731009005, 0.057948871507734936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 216.69230769230768, 122, 375, 126.0, 373.0, 375.0, 375.0, 0.11519512281572325, 0.030823694972175946, 0.06569721848084216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 159.92307692307693, 119, 370, 123.0, 364.0, 370.0, 370.0, 0.1154457538163702, 0.031116238333318533, 0.06786947636470202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2087059a-4e4d-4c2e-99ab-14c8e1148c2a", 3, 0, 0.0, 343.3333333333333, 240, 528, 262.0, 528.0, 528.0, 528.0, 0.1026132165822958, 0.04642980828430702, 0.06580339735257901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 240.46153846153845, 122, 376, 145.0, 375.2, 376.0, 376.0, 0.11519410206197443, 0.031048410321391547, 0.06783402689782284], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.875, 0.5113221329437546], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.2191380569758948], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.25, 0.14609203798392986], "isController": false}, {"data": ["401/Unauthorized", 20, 62.5, 1.4609203798392987], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1369, 32, "401/Unauthorized", 20, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
