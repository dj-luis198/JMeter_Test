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

    var data = {"OkPercent": 99.7609561752988, "KoPercent": 0.23904382470119523};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.753618194348725, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7dda9e6d-11b0-4050-960b-d41ac715d42d"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6afd8d8c-6aa4-46c0-9490-f90b05355cce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03aeaeb1-c74e-45f7-99b5-b46b7c928a61"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63d659ff-1c11-43f7-abb0-af95ebde05bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/826c9c40-de52-4def-b9c1-c4814262567e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98695bec-0759-4550-a1f0-bc354d8ba127"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e98e460-b507-4c91-9fd6-5d02485952a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d4589713-3491-4299-8105-865b0f95804b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c85f1e87-67ad-43bf-bbac-717119181a06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3891526-ae70-4ed1-a3e4-67dd5c244491"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.65, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96a8acc5-c1ae-4a79-bbfb-b925aeb117de"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/507ec2c4-7b23-4e77-b9b8-5462bd4d264f"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb4511a2-4bdd-4d5a-874c-918d83410872"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc6df09e-a3aa-4263-83b3-daf910a6d1b2"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2760aff6-778d-4922-9db6-2c5d48dc6ab2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3fecfce3-2f36-40c5-bb91-5146b61edf00"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b80ca4e-d115-4ad2-87cf-a9ddde4823f4"], "isController": false}, {"data": [0.35, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/63d659ff-1c11-43f7-abb0-af95ebde05bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2358490566037736, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.21052631578947367, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98695bec-0759-4550-a1f0-bc354d8ba127"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03aeaeb1-c74e-45f7-99b5-b46b7c928a61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c4dd24a-55b4-4bdd-9c4a-751140ab2602"], "isController": false}, {"data": [0.33064516129032256, 500, 1500, "addBook"], "isController": true}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/96a8acc5-c1ae-4a79-bbfb-b925aeb117de"], "isController": false}, {"data": [0.32075471698113206, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c85f1e87-67ad-43bf-bbac-717119181a06"], "isController": false}, {"data": [0.96045197740113, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c3891526-ae70-4ed1-a3e4-67dd5c244491"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb4511a2-4bdd-4d5a-874c-918d83410872"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=507ec2c4-7b23-4e77-b9b8-5462bd4d264f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2760aff6-778d-4922-9db6-2c5d48dc6ab2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b80ca4e-d115-4ad2-87cf-a9ddde4823f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1255, 3, 0.23904382470119523, 471.2278884462148, 137, 3400, 159.0, 1278.6000000000013, 1648.2, 2113.9600000000005, 4.845372765530288, 649.8142076741728, 3.534669118711633], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/7dda9e6d-11b0-4050-960b-d41ac715d42d", 2, 0, 0.0, 253.0, 252, 254, 253.0, 254.0, 254.0, 254.0, 0.015838698692515425, 0.022551584661804187, 0.009845050505650457], "isController": false}, {"data": ["see books", 53, 0, 0.0, 2340.3773584905666, 1689, 3406, 2299.0, 2807.2, 2998.7, 3406.0, 0.24064984539382575, 289.5824166480314, 1.183273409724524], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6afd8d8c-6aa4-46c0-9490-f90b05355cce", 2, 0, 0.0, 263.5, 262, 265, 263.5, 265.0, 265.0, 265.0, 0.03515803536898358, 0.03107228711809584, 0.021853603039412157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03aeaeb1-c74e-45f7-99b5-b46b7c928a61", 3, 0, 0.0, 313.0, 225, 463, 251.0, 463.0, 463.0, 463.0, 0.018510977009366554, 0.02551887618315995, 0.011870646063949254], "isController": false}, {"data": ["deleteBook", 10, 0, 0.0, 704.8, 504, 1357, 588.0, 1304.9, 1357.0, 1357.0, 0.06771947883089093, 0.012234476155971502, 0.04602808326787117], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 10, 0, 0.0, 704.8, 504, 1357, 588.0, 1304.9, 1357.0, 1357.0, 0.06613712872269363, 0.011948602357127268, 0.044952579678705834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63d659ff-1c11-43f7-abb0-af95ebde05bc", 1, 0, 0.0, 1246.0, 1246, 1246, 1246.0, 1246.0, 1246.0, 1246.0, 0.8025682182985554, 0.14499523475120385, 0.5533331661316212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/826c9c40-de52-4def-b9c1-c4814262567e", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98695bec-0759-4550-a1f0-bc354d8ba127", 3, 0, 0.0, 408.3333333333333, 262, 595, 368.0, 595.0, 595.0, 595.0, 0.020749470888492345, 0.024525172134152246, 0.013306138558050103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 187.55555555555554, 138, 432, 141.0, 418.5, 432.0, 432.0, 0.118538811582559, 0.0416094895257789, 0.06705108775823351], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e98e460-b507-4c91-9fd6-5d02485952a6", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.6625226919087137, 1.2379246628630707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 161.33333333333331, 139, 426, 143.0, 205.50000000000034, 426.0, 426.0, 0.11874995876737543, 0.0882507017792702, 0.05960691289690524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 251.1111111111111, 138, 829, 142.0, 584.2000000000004, 829.0, 829.0, 0.11875230907267642, 1.970069367017206, 0.06936237844381697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 245.61111111111111, 138, 1418, 143.0, 533.3000000000014, 1418.0, 1418.0, 0.11874760855510548, 5.966300675954269, 0.06924366844348274], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 270.75000000000006, 225, 385, 258.0, 367.9000000000001, 385.0, 385.0, 0.07399140466515806, 0.19688891192556462, 0.04783428700032679], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d4589713-3491-4299-8105-865b0f95804b", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.5573053010471205, 1.0413258071553229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 189.19999999999996, 139, 463, 143.0, 440.00000000000006, 461.95, 463.0, 0.11110123544573816, 0.08256644548262378, 0.055767612323349036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 198.3, 139, 432, 141.0, 430.50000000000006, 432.0, 432.0, 0.11110679029148866, 0.02972974662096474, 0.06336559133811463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 849.0, 849, 849, 849.0, 849.0, 849.0, 849.0, 1.1778563015312131, 346.32886116018847, 0.67174617196702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 1255.0, 1255, 1255, 1255.0, 1255.0, 1255.0, 1255.0, 0.7968127490039841, 716.9735122011953, 0.4536541334661355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 4.243480215827338, 1.327843974820144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 169.8181818181818, 138, 432, 144.0, 376.0000000000002, 432.0, 432.0, 0.06334033915872513, 0.047072263769326, 0.03179388117928195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 191.27272727272725, 139, 417, 141.0, 417.0, 417.0, 417.0, 0.06344701885530042, 0.03430329765880501, 0.03521579917288159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 395.99999999999994, 138, 1664, 140.0, 1562.2000000000003, 1664.0, 1664.0, 0.06344775077723494, 10.394064156490993, 0.036308966753378594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 392.72727272727275, 138, 1124, 141.0, 1119.4, 1124.0, 1124.0, 0.06344738481415683, 3.405925913642341, 0.036370717662021546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c85f1e87-67ad-43bf-bbac-717119181a06", 3, 0, 0.0, 393.6666666666667, 328, 508, 345.0, 508.0, 508.0, 508.0, 0.029487507126147554, 0.029573896307181192, 0.01890963184847353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 144.0, 6.944444444444444, 5.160861545138889, 3.8994683159722223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 963.2222222222223, 139, 1808, 1272.0, 1806.2, 1808.0, 1808.0, 0.13721603903034, 68.60934462665803, 0.07411690997103217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 212.8, 137, 432, 143.0, 429.6, 431.95, 432.0, 0.11110740753086008, 0.02994691843605213, 0.06531900325544704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3891526-ae70-4ed1-a3e4-67dd5c244491", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 0.28722426470588236, 1.0961098966613672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 653.2222222222222, 138, 1302, 822.5, 1260.6000000000001, 1302.0, 1302.0, 0.1372233615149459, 22.432118509525587, 0.0742548723822738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 204.15000000000003, 138, 576, 140.5, 429.8, 568.7499999999999, 576.0, 0.11110740753086008, 0.02994691843605213, 0.0654275065831139], "isController": false}, {"data": ["deleteBooks", 10, 0, 0.0, 709.3, 482, 1246, 631.0, 1238.6, 1246.0, 1246.0, 0.0661638216223369, 0.011953424804816728, 0.045616853579462754], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96a8acc5-c1ae-4a79-bbfb-b925aeb117de", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 643.1818181818181, 280, 1816, 558.0, 1713.0000000000005, 1816.0, 1816.0, 0.06328895435140329, 13.846723097519648, 0.13939414670667294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/507ec2c4-7b23-4e77-b9b8-5462bd4d264f", 3, 0, 0.0, 581.3333333333334, 259, 1042, 443.0, 1042.0, 1042.0, 1042.0, 0.02075937804903365, 0.024536882062513407, 0.013312491782746188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 707.8421052631578, 164, 2083, 574.0, 1194.0, 2083.0, 2083.0, 0.08417396543551167, 0.051704515877868, 0.038059126949845604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 159.83333333333334, 139, 421, 142.5, 189.70000000000036, 421.0, 421.0, 0.1372055796935742, 0.10196625600274412, 0.06887076949462612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 236.6111111111111, 138, 439, 143.0, 435.4, 439.0, 439.0, 0.1372223153978685, 0.15121851510207815, 0.07185708486437861], "isController": false}, {"data": ["login", 19, 0, 0.0, 2825.842105263158, 1586, 4577, 2618.0, 4326.0, 4577.0, 4577.0, 0.08729571653702488, 5.6218468370809225, 0.13932945546999553], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 177.75, 140, 421, 150.5, 391.7000000000005, 420.75, 421.0, 0.10469176128184593, 0.0847553418971194, 0.037214649518156166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb4511a2-4bdd-4d5a-874c-918d83410872", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc6df09e-a3aa-4263-83b3-daf910a6d1b2", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.7807724633251835, 1.4588745415647923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1125.2222222222222, 286, 1961, 1425.0, 1950.2, 1961.0, 1961.0, 0.13705409829824497, 91.18570830319412, 0.288756448204972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2760aff6-778d-4922-9db6-2c5d48dc6ab2", 3, 0, 0.0, 602.6666666666666, 257, 974, 577.0, 974.0, 974.0, 974.0, 0.0351881392511964, 0.029334903848409494, 0.02256531065262269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 494.50000000000006, 282, 1559, 291.0, 930.800000000001, 1559.0, 1559.0, 0.11842650648385124, 8.044412150148363, 0.26466062581829425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 1400.0, 1400, 1400, 1400.0, 1400.0, 1400.0, 1400.0, 0.7142857142857143, 854.5340401785714, 1.610630580357143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fecfce3-2f36-40c5-bb91-5146b61edf00", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b80ca4e-d115-4ad2-87cf-a9ddde4823f4", 3, 0, 0.0, 381.6666666666667, 234, 526, 385.0, 526.0, 526.0, 526.0, 0.023804045100730784, 0.023873783514111832, 0.015264963817851447], "isController": false}, {"data": ["register", 20, 2, 10.0, 1156.3999999999999, 158, 1948, 1115.0, 1642.0, 1932.7499999999998, 1948.0, 0.07924150035856779, 0.02541299679468131, 0.0357515362945882], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/63d659ff-1c11-43f7-abb0-af95ebde05bc", 3, 0, 0.0, 416.0, 252, 693, 303.0, 693.0, 693.0, 693.0, 0.026235472107320572, 0.026312333842009986, 0.016824179704238777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 168.13333333333333, 142, 430, 149.0, 270.4000000000001, 430.0, 430.0, 0.06991931311266797, 0.054283060473213914, 0.024854130833018698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 468.1, 280, 896, 311.0, 870.4000000000001, 894.9, 896.0, 0.1110136657822578, 0.1720494996059015, 0.24967233622708956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 530.625, 282, 1800, 555.5, 1032.1000000000008, 1800.0, 1800.0, 0.08922546717896955, 6.8011818279091685, 0.19924334364073365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 167.0, 138, 425, 144.5, 342.2000000000003, 425.0, 425.0, 0.05372901769923391, 0.03992947506749708, 0.026969448337310773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 188.66666666666663, 139, 420, 142.5, 418.8, 420.0, 420.0, 0.053731182891991365, 0.014377289172271128, 0.030643565243088824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 213.66666666666669, 140, 433, 144.0, 431.2, 433.0, 433.0, 0.053666302928391266, 0.014464745711167957, 0.03154991637001127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 165.66666666666669, 138, 432, 141.5, 346.2000000000003, 432.0, 432.0, 0.05373190466169049, 0.014482427428346267, 0.03164095557714782], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1621.9056603773586, 1100, 2788, 1533.0, 2221.6, 2414.1, 2788.0, 0.22987708082131178, 275.0129068661682, 0.45391743888739494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 2, 10.0, 1156.3999999999999, 158, 1948, 1115.0, 1642.0, 1932.7499999999998, 1948.0, 0.07778378441446313, 0.02494550273604462, 0.0350938558588691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 142.2, 139, 147, 142.0, 147.0, 147.0, 147.0, 0.026771038020228195, 0.007215631341389631, 0.015764585865427345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 198.6, 139, 426, 142.0, 426.0, 426.0, 426.0, 0.026771181358690995, 0.0072156699755846826, 0.015738526540949198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 358.1333333333333, 138, 1715, 142.0, 1425.8000000000002, 1715.0, 1715.0, 0.06874868231692226, 8.26408395531794, 0.03962896049700714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 319.40000000000003, 138, 1115, 143.0, 1051.4, 1115.0, 1115.0, 0.06875435444244803, 2.7115356628836493, 0.03969937301758278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 160.39999999999998, 139, 415, 142.0, 254.8000000000001, 415.0, 415.0, 0.06883986470671923, 0.05115931351739583, 0.03455438521411493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 198.2, 138, 426, 143.0, 426.0, 426.0, 426.0, 0.026771468040221454, 0.007163459221699881, 0.0152681028666888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 176.79999999999998, 139, 413, 141.0, 413.0, 413.0, 413.0, 0.06884144438529179, 0.032206680947441856, 0.03849025549354726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 198.2, 140, 416, 145.0, 416.0, 416.0, 416.0, 0.026770178021683844, 0.01989463425244278, 0.013437374514790523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 146.2, 140, 150, 148.0, 150.0, 150.0, 150.0, 0.027298536798427604, 0.021486934237824853, 0.009703776752566062], "isController": false}, {"data": ["deleteAccount", 10, 0, 0.0, 532.2, 443, 693, 517.0, 683.2, 693.0, 693.0, 0.06538597340098602, 0.011812895585139076, 0.04450588228563209], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1669.9473684210527, 826, 3400, 1595.0, 2747.0, 3400.0, 3400.0, 0.08691117677733357, 0.04498332391795585, 0.03997574634973058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 399.4, 280, 842, 293.0, 842.0, 842.0, 842.0, 0.02675012706310355, 0.041457472313618494, 0.06016166272102293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98695bec-0759-4550-a1f0-bc354d8ba127", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03aeaeb1-c74e-45f7-99b5-b46b7c928a61", 1, 0, 0.0, 1172.0, 1172, 1172, 1172.0, 1172.0, 1172.0, 1172.0, 0.8532423208191127, 0.15415022397610922, 0.5882705844709898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c4dd24a-55b4-4bdd-9c4a-751140ab2602", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["addBook", 62, 1, 1.6129032258064515, 1539.016129032258, 809, 4205, 1178.0, 2652.4000000000005, 3310.9999999999986, 4205.0, 0.2773528017106405, 86.63464772559519, 1.0103535143843214], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 257.77358490566047, 138, 600, 146.0, 572.8, 590.6999999999999, 600.0, 0.23148754771700866, 0.17203322637953475, 0.11190071886710867], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 910.1698113207548, 684, 1268, 837.0, 1150.4, 1249.0, 1268.0, 0.23139961840893117, 68.03917100268075, 0.116377737774023], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 219.1698113207547, 139, 485, 146.0, 425.2, 433.3, 485.0, 0.23197489418881004, 0.41048682448254276, 0.11281591533791738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96a8acc5-c1ae-4a79-bbfb-b925aeb117de", 3, 0, 0.0, 393.0, 247, 560, 372.0, 560.0, 560.0, 560.0, 0.037005057357838905, 0.023790686289626252, 0.023730456704082893], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1360.3584905660375, 960, 2162, 1371.0, 1748.4, 1848.0999999999997, 2162.0, 0.23050293130142824, 207.4069427659591, 0.11570166668841224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 147.875, 141, 158, 147.0, 156.6, 158.0, 158.0, 0.08641875286937264, 0.0645608847119825, 0.030719166059034807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c85f1e87-67ad-43bf-bbac-717119181a06", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.28053425854037267, 1.0705793866459627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 1, 0.5649717514124294, 254.93220338983048, 140, 2789, 150.0, 371.4000000000007, 575.2999999999996, 2190.7399999999993, 0.7206899078982728, 1.4295941691300418, 0.3517124846802498], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 192.24999999999997, 140, 418, 146.0, 417.7, 418.0, 418.0, 0.05308747931800285, 0.04111169052653932, 0.018870939913821324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3891526-ae70-4ed1-a3e4-67dd5c244491", 3, 0, 0.0, 322.3333333333333, 245, 467, 255.0, 467.0, 467.0, 467.0, 0.018724371017170248, 0.025813057050037762, 0.012007490528588995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 164.38888888888889, 141, 423, 146.0, 201.60000000000036, 423.0, 423.0, 0.11811953697141507, 0.0958567726789511, 0.0419878041578077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 405.41666666666663, 286, 853, 293.0, 769.3000000000003, 853.0, 853.0, 0.053630086478514444, 0.08311615941543206, 0.12061532144533084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb4511a2-4bdd-4d5a-874c-918d83410872", 3, 0, 0.0, 334.6666666666667, 251, 490, 263.0, 490.0, 490.0, 490.0, 0.01823165136220822, 0.025133803228825455, 0.011691521218603576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 557.2, 282, 1856, 289.0, 1731.2, 1856.0, 1856.0, 0.06870302430712999, 11.051306380850635, 0.15217093684588998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=507ec2c4-7b23-4e77-b9b8-5462bd4d264f", 1, 0, 0.0, 772.0, 772, 772, 772.0, 772.0, 772.0, 772.0, 1.2953367875647668, 0.23402080634715025, 0.8930739961139896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 149.36363636363637, 141, 191, 147.0, 182.60000000000002, 191.0, 191.0, 0.06806720089106154, 0.056434622613780516, 0.024195762816744532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 166.11111111111111, 141, 419, 147.5, 213.80000000000032, 419.0, 419.0, 0.13920360073313898, 0.10807310799106004, 0.04948252994810799], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2760aff6-778d-4922-9db6-2c5d48dc6ab2", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 633.0, 1.5797788309636651, 0.2854092614533965, 1.0891834518167456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b80ca4e-d115-4ad2-87cf-a9ddde4823f4", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 144.50000000000003, 138, 157, 144.0, 153.5, 157.0, 157.0, 0.08929817217803823, 0.06636319240965537, 0.044823496581554344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 245.8125, 138, 427, 145.0, 421.4, 427.0, 427.0, 0.089295181966838, 0.03227576096237882, 0.05045744596246254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 349.00000000000006, 139, 1657, 149.0, 888.4000000000008, 1657.0, 1657.0, 0.089295181966838, 5.044311208010336, 0.052016187542205924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 273.37499999999994, 138, 832, 145.5, 549.2000000000003, 832.0, 832.0, 0.08929568032146445, 1.6635571596997432, 0.052103680656323245], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 66.66666666666667, 0.1593625498007968], "isController": false}, {"data": ["401/Unauthorized", 1, 33.333333333333336, 0.0796812749003984], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1255, 3, "406/Not Acceptable", 2, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
