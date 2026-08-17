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

    var data = {"OkPercent": 98.14814814814815, "KoPercent": 1.8518518518518519};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6650099403578529, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8585ac61-c8fc-4fb3-9896-c3fc699dfda1"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81154401-c499-4193-b3c7-dff4a453d4de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cec5387a-edae-465e-b331-b9fd7f7e8fe6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/21a0d66a-0d03-4978-a5c6-9e1eb26f0fce"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da5a2df3-8bf4-444b-97f4-e9123cf3e951"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81a2f3fa-ca2e-485c-a66c-d051598c9a38"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/885d8cf0-20ea-4a3d-91c1-6a905a218478"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd798497-2dbf-454e-82f0-f015d10f3e73"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4fa20dc-0f2b-43bb-9239-ade46484b1f3"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/b10035a9-7556-4ef9-8382-3da0a6d9d551"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5681818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4a8d0a6-5838-428f-8c47-b951ba69583c"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c93d6673-4c44-4e2d-a610-10a8758d6df3"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cd2de9e9-6ea0-4ebd-a8ac-6d111a2a1629"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a12c0d4e-e7aa-482f-993e-9653c8d590c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b791029f-705e-4532-828d-e7cb37644526"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76ad77af-bdb7-4103-9ae8-99933218fcdc"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "register"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fd798497-2dbf-454e-82f0-f015d10f3e73"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81a2f3fa-ca2e-485c-a66c-d051598c9a38"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81154401-c499-4193-b3c7-dff4a453d4de"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.07017543859649122, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/abe62e43-8d08-4bb4-b951-9dcd15cb1c24"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/da5a2df3-8bf4-444b-97f4-e9123cf3e951"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=885d8cf0-20ea-4a3d-91c1-6a905a218478"], "isController": false}, {"data": [0.20535714285714285, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a4fa20dc-0f2b-43bb-9239-ade46484b1f3"], "isController": false}, {"data": [0.9035087719298246, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.4473684210526316, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9385964912280702, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.15789473684210525, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9171597633136095, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8585ac61-c8fc-4fb3-9896-c3fc699dfda1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4a8d0a6-5838-428f-8c47-b951ba69583c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd2de9e9-6ea0-4ebd-a8ac-6d111a2a1629"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abe62e43-8d08-4bb4-b951-9dcd15cb1c24"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/76ad77af-bdb7-4103-9ae8-99933218fcdc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 24, 1.8518518518518519, 595.7368827160504, 154, 3311, 202.0, 1713.1999999999998, 2063.899999999999, 2585.979999999998, 5.029162155554779, 727.5027621465325, 3.6709968793292123], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/8585ac61-c8fc-4fb3-9896-c3fc699dfda1", 3, 0, 0.0, 1274.3333333333333, 283, 2958, 582.0, 2958.0, 2958.0, 2958.0, 0.020500064916872236, 0.02423038271912861, 0.013146200483801532], "isController": false}, {"data": ["see books", 57, 0, 0.0, 2916.649122807017, 2236, 3716, 2945.0, 3546.6, 3662.1, 3716.0, 0.2590967976544922, 311.78040356741064, 1.2739769298734063], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/81154401-c499-4193-b3c7-dff4a453d4de", 3, 0, 0.0, 389.0, 283, 572, 312.0, 572.0, 572.0, 572.0, 0.04740310016275064, 0.030475625918435067, 0.030398472435097256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cec5387a-edae-465e-b331-b9fd7f7e8fe6", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21a0d66a-0d03-4978-a5c6-9e1eb26f0fce", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.5340065844481605, 0.9977921195652174], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 617.4285714285714, 176, 1178, 573.0, 1039.5, 1178.0, 1178.0, 0.08652015919709292, 0.017043312609695202, 0.05821522430351271], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 617.4285714285714, 176, 1178, 573.0, 1039.5, 1178.0, 1178.0, 0.08535388329685471, 0.016813571877114797, 0.05743049374173134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 253.6842105263158, 158, 570, 189.0, 516.0, 570.0, 570.0, 0.10901684023295177, 0.05502391915540637, 0.060728028086180684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 179.1578947368421, 160, 201, 179.0, 200.0, 201.0, 201.0, 0.10923683696114618, 0.08118089153069555, 0.05483177167776283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 425.2631578947369, 161, 1467, 176.0, 1392.0, 1467.0, 1467.0, 0.10923055696086097, 5.095962547572783, 0.0628401328157338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 516.5263157894738, 159, 2204, 175.0, 2025.0, 2204.0, 2204.0, 0.10901496373818048, 15.512931317345426, 0.06260964251698338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da5a2df3-8bf4-444b-97f4-e9123cf3e951", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 307.37499999999994, 174, 639, 287.5, 500.40000000000015, 639.0, 639.0, 0.0931711379107537, 0.1467570529823499, 0.06021093800043092], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81a2f3fa-ca2e-485c-a66c-d051598c9a38", 1, 0, 0.0, 1107.0, 1107, 1107, 1107.0, 1107.0, 1107.0, 1107.0, 0.9033423667570009, 0.16320150180668475, 0.6228122177055104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 200.57142857142856, 159, 529, 176.0, 364.0, 529.0, 529.0, 0.08232049721580319, 0.06117763513791623, 0.041321030829026204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 250.64285714285714, 160, 539, 180.5, 523.0, 539.0, 539.0, 0.08231468905626209, 0.02202561015763263, 0.04694509610239947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1382.2, 1195, 1575, 1353.0, 1575.0, 1575.0, 1575.0, 0.06449366027319516, 18.96327751138313, 0.0367815406245566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1842.2, 1473, 2060, 1960.0, 2060.0, 2060.0, 2060.0, 0.06417414295432083, 57.744006636408564, 0.03653664584215728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 399.2, 172, 567, 520.0, 567.0, 567.0, 567.0, 0.06568144499178982, 0.11622536945812807, 0.03636853448275862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 195.0, 157, 508, 172.0, 347.5, 508.0, 508.0, 0.07764362684472938, 0.05770195315316314, 0.0389734611310458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 198.92857142857142, 154, 515, 174.0, 356.5, 515.0, 515.0, 0.07764577995185962, 0.020776312213681185, 0.044282358878794933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/885d8cf0-20ea-4a3d-91c1-6a905a218478", 3, 0, 0.0, 446.0, 339, 575, 424.0, 575.0, 575.0, 575.0, 0.024437728594586226, 0.02450932350257818, 0.01567132986046057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 223.35714285714286, 159, 525, 174.5, 524.5, 525.0, 525.0, 0.07765094789621396, 0.020929357050151417, 0.04565026429054766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd798497-2dbf-454e-82f0-f015d10f3e73", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 0.2548153208744711, 0.9724303596614952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 255.14285714285714, 158, 761, 168.5, 634.5, 761.0, 761.0, 0.07764793317840722, 0.020928544489492572, 0.0457243200259566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 182.8, 165, 202, 186.0, 202.0, 202.0, 202.0, 0.06568748522031582, 0.04881657837173862, 0.03688506250164219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1391.6666666666667, 167, 2363, 1827.0, 2217.8, 2363.0, 2363.0, 0.08447848614552826, 50.68351675137981, 0.04482419675039423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 177.92857142857144, 157, 208, 171.5, 204.5, 208.0, 208.0, 0.08232049721580319, 0.02218794651519695, 0.04839544855850929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 1078.4, 158, 1712, 1372.0, 1625.0, 1712.0, 1712.0, 0.08447753460763001, 16.567056507022897, 0.04490618945776686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 200.99999999999997, 162, 489, 179.0, 343.5, 489.0, 489.0, 0.0823113013416742, 0.022185467939748127, 0.04847042452053667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4fa20dc-0f2b-43bb-9239-ade46484b1f3", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 718.6153846153845, 187, 1519, 588.0, 1463.8, 1519.0, 1519.0, 0.08363947525879983, 0.016580872536656608, 0.056748177624510225], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b10035a9-7556-4ef9-8382-3da0a6d9d551", 2, 0, 0.0, 506.0, 373, 639, 506.0, 639.0, 639.0, 639.0, 0.024420918959180433, 0.027568928043762285, 0.015179604411639009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 491.2142857142858, 337, 1269, 361.5, 986.0, 1269.0, 1269.0, 0.07756748371082842, 0.12021444985262178, 0.1744510888535526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 837.4545454545454, 222, 1420, 812.0, 1330.7999999999997, 1416.7, 1420.0, 0.09262689885142646, 0.05689679626713598, 0.04188110758614302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 195.33333333333331, 157, 524, 173.0, 326.0000000000001, 524.0, 524.0, 0.08447087444249224, 0.06277571821360994, 0.04240041939789161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4a8d0a6-5838-428f-8c47-b951ba69583c", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 0.7169208829365079, 2.7359250992063493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 252.86666666666662, 157, 716, 173.0, 600.8000000000001, 716.0, 716.0, 0.08448324415657561, 0.10719911644607152, 0.04345166854407209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c93d6673-4c44-4e2d-a610-10a8758d6df3", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 0.9392233455882353, 1.7549402573529411], "isController": false}, {"data": ["login", 22, 0, 0.0, 3729.6818181818185, 2654, 5102, 3785.0, 4864.8, 5074.25, 5102.0, 0.09414140895455965, 25.726567915805486, 0.17751806873178685], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 188.2142857142857, 171, 205, 188.5, 204.5, 205.0, 205.0, 0.08457579199188073, 0.06847005035280188, 0.03006405105961385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd2de9e9-6ea0-4ebd-a8ac-6d111a2a1629", 3, 0, 0.0, 864.3333333333334, 272, 2038, 283.0, 2038.0, 2038.0, 2038.0, 0.038892850197705324, 0.025004355188954427, 0.0249410530239191], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a12c0d4e-e7aa-482f-993e-9653c8d590c4", 1, 0, 0.0, 850.0, 850, 850, 850.0, 850.0, 850.0, 850.0, 1.176470588235294, 0.3756893382352941, 0.7019761029411765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b791029f-705e-4532-828d-e7cb37644526", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.1244223151408452, 2.1009848151408455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76ad77af-bdb7-4103-9ae8-99933218fcdc", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1594.2000000000003, 344, 2539, 1999.0, 2386.0, 2539.0, 2539.0, 0.08438960995122281, 67.34980385569095, 0.17539962875604087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 804.421052631579, 331, 2367, 698.0, 2212.0, 2367.0, 2367.0, 0.10891123161406445, 20.71514464414688, 0.2405440241410343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 1021.2727272727271, 174, 2247, 190.0, 2239.2, 2247.0, 2247.0, 0.10708409995813985, 58.247361837173756, 0.14812476575353134], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1515.4090909090903, 202, 2343, 1678.5, 2285.4, 2339.4, 2343.0, 0.09744645981440879, 0.030815366642305053, 0.04396510198657897], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 460.57142857142856, 337, 1036, 374.0, 875.5, 1036.0, 1036.0, 0.08223297777360086, 0.12744505442060994, 0.18494389434824493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 201.74999999999997, 163, 486, 188.5, 233.60000000000008, 473.54999999999984, 486.0, 0.11350737797956867, 0.08812340380249717, 0.0403483257661748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd798497-2dbf-454e-82f0-f015d10f3e73", 3, 0, 0.0, 613.0, 327, 941, 571.0, 941.0, 941.0, 941.0, 0.02029591443242475, 0.023989083757856213, 0.013015283669230718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81a2f3fa-ca2e-485c-a66c-d051598c9a38", 3, 0, 0.0, 383.0, 268, 602, 279.0, 602.0, 602.0, 602.0, 0.034867098243860487, 0.0283408672900129, 0.022359434746225638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 655.4444444444445, 337, 2103, 684.5, 894.3000000000019, 2103.0, 2103.0, 0.08648773315651398, 5.874892303252419, 0.19328356685021283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 174.5, 163, 191, 172.0, 191.0, 191.0, 191.0, 0.03712038605201494, 0.027586536899983763, 0.018632693780015315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 262.0, 159, 594, 170.0, 594.0, 594.0, 594.0, 0.03712073053597695, 0.009932695475446956, 0.021170416633799354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81154401-c499-4193-b3c7-dff4a453d4de", 1, 0, 0.0, 1519.0, 1519, 1519, 1519.0, 1519.0, 1519.0, 1519.0, 0.6583278472679394, 0.11893618334430547, 0.4538861915734036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 218.375, 160, 523, 171.5, 523.0, 523.0, 523.0, 0.03711694156401513, 0.010004175655925951, 0.02182070197415733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 323.125, 157, 704, 193.5, 704.0, 704.0, 704.0, 0.037122969837587005, 0.010005800464037123, 0.02186049883990719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 354.0, 187, 521, 354.0, 521.0, 521.0, 521.0, 0.06119576525304449, 0.018047969830487728, 0.03782902285661832], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 2012.2280701754378, 1332, 2944, 1963.0, 2670.0, 2745.699999999999, 2944.0, 0.2665232740280083, 318.85449421948425, 0.5262793555513993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1515.4090909090903, 202, 2343, 1678.5, 2285.4, 2339.4, 2343.0, 0.09430727023319616, 0.029822664823388204, 0.042548787937242795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 186.6, 164, 219, 191.0, 219.0, 219.0, 219.0, 0.044021059674948494, 0.011865051240513463, 0.025922557601556585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 188.0, 165, 220, 173.0, 220.0, 220.0, 220.0, 0.044020284547119315, 0.011864842319340752, 0.025879112595083815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abe62e43-8d08-4bb4-b951-9dcd15cb1c24", 3, 0, 0.0, 745.3333333333333, 391, 1404, 441.0, 1404.0, 1404.0, 1404.0, 0.03367041156466402, 0.028069636724317892, 0.0215920282494753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 373.65, 157, 2244, 172.5, 1338.8000000000018, 2202.7999999999993, 2244.0, 0.11281079373674473, 10.178100481279047, 0.06535094027796579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 370.25, 161, 1594, 173.0, 1422.9000000000015, 1589.1499999999999, 1594.0, 0.11282224854741355, 3.3447169219270036, 0.06546775399108704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 177.8, 166, 190, 175.0, 190.0, 190.0, 190.0, 0.04401679680966257, 0.011777931958835492, 0.025103329430510683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 192.60000000000002, 160, 477, 175.0, 201.00000000000003, 463.24999999999983, 477.0, 0.11282033925076013, 0.0838440216502231, 0.056630521850479204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 176.4, 161, 193, 175.0, 193.0, 193.0, 193.0, 0.04401640931739352, 0.032711413564977025, 0.022094174208144798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 246.10000000000002, 157, 593, 178.0, 561.0000000000002, 591.85, 593.0, 0.11282543085211406, 0.04713546808450625, 0.06339819620342425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 187.4, 173, 196, 192.0, 196.0, 196.0, 196.0, 0.043653634601616934, 0.03436018504775708, 0.015517502924793519], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 780.7692307692308, 174, 2038, 582.0, 1806.7999999999997, 2038.0, 2038.0, 0.08627326059833824, 0.01674007152385124, 0.05871014631613177], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1932.7727272727273, 1152, 3311, 1726.0, 2920.7, 3260.5999999999995, 3311.0, 0.09373069467226211, 0.04851295720341691, 0.043112458193979936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 375.0, 354, 404, 368.0, 404.0, 404.0, 404.0, 0.04394870307377229, 0.06811190603327795, 0.09884166326064217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da5a2df3-8bf4-444b-97f4-e9123cf3e951", 3, 0, 0.0, 616.3333333333334, 292, 1055, 502.0, 1055.0, 1055.0, 1055.0, 0.021087110854941766, 0.021148889500024602, 0.013522658979243254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=885d8cf0-20ea-4a3d-91c1-6a905a218478", 1, 0, 0.0, 836.0, 836, 836, 836.0, 836.0, 836.0, 836.0, 1.1961722488038278, 0.2161053379186603, 0.8247046949760766], "isController": false}, {"data": ["addBook", 56, 9, 16.071428571428573, 1731.071428571429, 872, 3371, 1426.5, 3097.1000000000004, 3260.5499999999997, 3371.0, 0.2549893678540368, 88.18815113356435, 0.9244565183364676], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a4fa20dc-0f2b-43bb-9239-ade46484b1f3", 3, 0, 0.0, 517.0, 298, 639, 614.0, 639.0, 639.0, 639.0, 0.042389645622562595, 0.02725245771632849, 0.02718346415248968], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 303.2982456140352, 158, 769, 191.0, 695.8000000000001, 716.6999999999997, 769.0, 0.2693494501963416, 0.20017083164005461, 0.13020310336639557], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 1108.3684210526314, 777, 1759, 1018.0, 1532.2, 1578.1, 1759.0, 0.2691434156660355, 79.13710060828774, 0.13536021393360184], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 244.84210526315795, 156, 805, 183.0, 539.2, 592.8999999999997, 805.0, 0.27001293219833156, 0.47779632142907896, 0.13131488304176675], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1695.7192982456145, 1117, 2251, 1727.0, 2111.6000000000004, 2243.2, 2251.0, 0.2673809333940022, 240.58983387347018, 0.13421269508253628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 207.16666666666663, 169, 495, 181.0, 298.8000000000003, 495.0, 495.0, 0.08738542799440734, 0.06528305899972812, 0.031062788857386982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 9, 5.325443786982248, 249.19526627218931, 160, 826, 188.0, 440.0, 528.5, 744.8000000000013, 0.7059344441706106, 1.6078838309683834, 0.33637701206980813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 236.875, 179, 516, 196.5, 516.0, 516.0, 516.0, 0.03703120805058463, 0.02867748826573595, 0.013163437236731256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8585ac61-c8fc-4fb3-9896-c3fc699dfda1", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 205.10526315789474, 164, 524, 187.0, 222.0, 524.0, 524.0, 0.10856770625007142, 0.0881052381775482, 0.03859242683108008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 522.875, 350, 877, 378.5, 877.0, 877.0, 877.0, 0.03708734533418016, 0.05747814164584367, 0.08341030889122746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 642.0, 332, 2435, 371.0, 1616.500000000001, 2396.1999999999994, 2435.0, 0.11270081877144837, 13.640133870963197, 0.25058322673714223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4a8d0a6-5838-428f-8c47-b951ba69583c", 3, 0, 0.0, 395.6666666666667, 340, 496, 351.0, 496.0, 496.0, 496.0, 0.06519046480801408, 0.029496987657271996, 0.04180508322649341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd2de9e9-6ea0-4ebd-a8ac-6d111a2a1629", 1, 0, 0.0, 1381.0, 1381, 1381, 1381.0, 1381.0, 1381.0, 1381.0, 0.724112961622013, 0.13082118935553946, 0.4992419442433019], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abe62e43-8d08-4bb4-b951-9dcd15cb1c24", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.2890625, 1.103125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 235.5, 174, 539, 187.0, 528.0, 539.0, 539.0, 0.07949802674540757, 0.06591193819028421, 0.0282590641946566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 182.33333333333334, 160, 210, 177.0, 208.8, 210.0, 210.0, 0.08756720783201107, 0.0679843068617664, 0.031127405909035184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76ad77af-bdb7-4103-9ae8-99933218fcdc", 3, 0, 0.0, 953.6666666666666, 263, 1460, 1138.0, 1460.0, 1460.0, 1460.0, 0.0303483996277263, 0.025300212059442398, 0.01946170158418646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 177.7222222222222, 160, 200, 177.0, 199.1, 200.0, 200.0, 0.08670603763042034, 0.06443681116870105, 0.04352236654495708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 329.5, 157, 567, 193.5, 567.0, 567.0, 567.0, 0.08670645529559676, 0.030435696927219563, 0.04904522042707746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 326.88888888888897, 158, 1915, 175.5, 697.3000000000019, 1915.0, 1915.0, 0.08670520231213873, 4.356376633249036, 0.05055921844894027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 359.3888888888889, 159, 1044, 198.0, 619.2000000000007, 1044.0, 1044.0, 0.08655510675129832, 1.4359263049384496, 0.05055622174937488], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 20.833333333333332, 0.38580246913580246], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 16.666666666666668, 0.30864197530864196], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.15432098765432098], "isController": false}, {"data": ["401/Unauthorized", 13, 54.166666666666664, 1.0030864197530864], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 24, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
