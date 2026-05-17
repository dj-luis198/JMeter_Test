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

    var data = {"OkPercent": 99.29356357927786, "KoPercent": 0.706436420722135};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8296146044624746, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b386587f-e710-4023-83d3-2b16623e04ed"], "isController": false}, {"data": [0.3490566037735849, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7800adc9-607c-41f0-887f-49fbf654ec21"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e82ae89f-2156-4294-9fba-6641a2ab3f36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e06836ab-d440-4cd7-971a-12488f6eb2c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5534f4c2-698b-40f5-88ad-cf8718f44413"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b5c90dd-cf18-49eb-a23f-77afd73038ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae81f785-bce1-4194-b791-7f87bc169d2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a68bd903-11db-42f6-aa0e-21a28b5db39e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cc9260a-0a01-418a-95ee-593f3648f368"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdb7d41c-737b-4f68-b7dc-8ca689b41368"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b44c7b6d-8130-4530-840e-530f464e963a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d057f89c-60bc-4779-8d8d-21d6f12250ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3a0fbf4-f563-45da-9d08-bafa870cb0a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ff4263c-dd34-4c07-b4bb-00910cdea578"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=082fcb31-4c39-4034-939f-4382450e4c96"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=291f69f7-3044-4362-b6e1-09509244f9d9"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae81f785-bce1-4194-b791-7f87bc169d2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d057f89c-60bc-4779-8d8d-21d6f12250ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4811320754716981, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b386587f-e710-4023-83d3-2b16623e04ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cc9260a-0a01-418a-95ee-593f3648f368"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3951612903225806, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7641509433962265, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b5c90dd-cf18-49eb-a23f-77afd73038ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9661016949152542, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/082fcb31-4c39-4034-939f-4382450e4c96"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cdb7d41c-737b-4f68-b7dc-8ca689b41368"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b44c7b6d-8130-4530-840e-530f464e963a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e06836ab-d440-4cd7-971a-12488f6eb2c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d68f752-c846-4f88-bfb8-3633ae1f4034"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9ff4263c-dd34-4c07-b4bb-00910cdea578"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c3a0fbf4-f563-45da-9d08-bafa870cb0a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/291f69f7-3044-4362-b6e1-09509244f9d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1274, 9, 0.706436420722135, 305.88383045525893, 81, 1987, 101.5, 824.0, 1053.75, 1478.0, 4.941336177639871, 680.6657025719966, 3.6035904319790557], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b386587f-e710-4023-83d3-2b16623e04ed", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["see books", 53, 0, 0.0, 1391.509433962264, 999, 1933, 1368.0, 1707.4, 1802.1999999999996, 1933.0, 0.23406895759818752, 281.66406294854016, 1.1509152358465566], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7800adc9-607c-41f0-887f-49fbf654ec21", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 637.2500000000001, 382, 1441, 470.0, 1372.9000000000003, 1441.0, 1441.0, 0.08148520364510478, 0.014721447924164438, 0.05538447435253216], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 637.2500000000001, 382, 1441, 470.0, 1372.9000000000003, 1441.0, 1441.0, 0.0787344745458005, 0.01422449003024716, 0.05351483816784878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 123.05882352941177, 82, 257, 85.0, 251.4, 257.0, 257.0, 0.10307028180627636, 0.03668563109327254, 0.058273076375078815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 98.4705882352941, 82, 298, 85.0, 137.99999999999986, 298.0, 298.0, 0.10307090672082941, 0.07659859376421015, 0.05173676372510383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 117.52941176470587, 81, 489, 84.0, 295.3999999999998, 489.0, 489.0, 0.10307090672082941, 1.8088683610210083, 0.06017403636280959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 132.23529411764707, 83, 561, 86.0, 310.5999999999998, 561.0, 561.0, 0.10306965689930095, 5.481573314735323, 0.060072652740137136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e82ae89f-2156-4294-9fba-6641a2ab3f36", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e06836ab-d440-4cd7-971a-12488f6eb2c1", 3, 0, 0.0, 358.3333333333333, 310, 424, 341.0, 424.0, 424.0, 424.0, 0.01930290766132405, 0.02281538337183191, 0.01237849221771106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5534f4c2-698b-40f5-88ad-cf8718f44413", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.879713326446281, 1.6437456955922864], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 231.58333333333334, 170, 434, 188.5, 406.7000000000001, 434.0, 434.0, 0.08144870089322075, 0.20097042733418402, 0.05265531249151576], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5b5c90dd-cf18-49eb-a23f-77afd73038ce", 3, 0, 0.0, 294.0, 170, 412, 300.0, 412.0, 412.0, 412.0, 0.03279512883019776, 0.032891208309192475, 0.021030730402177594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 86.27777777777777, 82, 95, 85.5, 95.0, 95.0, 95.0, 0.12202893441622714, 0.09068751864330943, 0.06125280497064526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 112.61111111111111, 81, 256, 84.5, 251.5, 256.0, 256.0, 0.12203058900097624, 0.04283517311394946, 0.06902620013694544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 646.0, 596, 681, 661.0, 681.0, 681.0, 681.0, 0.027919183270825383, 8.209166885754701, 0.0159226592091426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 855.3333333333334, 652, 973, 941.0, 973.0, 973.0, 973.0, 0.027829829866973414, 25.04132983392549, 0.015844522277778807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae81f785-bce1-4194-b791-7f87bc169d2f", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.0443009393063585, 3.9852781791907517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 83.0, 82, 84, 83.0, 84.0, 84.0, 84.0, 0.028053113895642415, 0.0496408616981485, 0.01553331599495044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a68bd903-11db-42f6-aa0e-21a28b5db39e", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.7788681402439025, 1.4553163109756098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 119.13333333333333, 82, 274, 84.0, 265.0, 274.0, 274.0, 0.09514566801773515, 0.07070884117333638, 0.047758665391714715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cc9260a-0a01-418a-95ee-593f3648f368", 3, 0, 0.0, 259.3333333333333, 184, 394, 200.0, 394.0, 394.0, 394.0, 0.01803957883596611, 0.02486901574554573, 0.011568349709262122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 138.79999999999998, 81, 261, 86.0, 253.8, 261.0, 261.0, 0.09504559020143329, 0.05398292505972031, 0.052609219263840226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 276.73333333333335, 82, 969, 86.0, 946.8000000000001, 969.0, 969.0, 0.09465812640015145, 17.05512036372385, 0.05402168854321143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 186.86666666666667, 82, 657, 85.0, 552.0, 657.0, 657.0, 0.09490607462148294, 5.601571545735238, 0.05425587508146105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 83.33333333333333, 83, 84, 83.0, 84.0, 84.0, 84.0, 0.028053113895642415, 0.02084806608846082, 0.015752480947260145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 731.0714285714286, 82, 1221, 936.5, 1171.5, 1221.0, 1221.0, 0.07820879513764747, 50.27203087641334, 0.04117745435958169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 156.83333333333334, 82, 885, 84.5, 320.7000000000009, 885.0, 885.0, 0.12189423643418727, 6.1243984117350285, 0.07107851851099417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 446.42857142857144, 83, 743, 487.5, 737.0, 743.0, 743.0, 0.07820879513764747, 16.43172459471085, 0.0412538301360833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 159.66666666666669, 81, 508, 87.0, 356.80000000000024, 508.0, 508.0, 0.12189753834693394, 2.0222478879558463, 0.07119948447499408], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 500.1666666666667, 170, 1552, 443.0, 1308.400000000001, 1552.0, 1552.0, 0.0787246604999016, 0.014222716984845502, 0.05427696319622121], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 419.7333333333334, 166, 1207, 185.0, 1114.6000000000001, 1207.0, 1207.0, 0.09460857279814315, 22.75424871332341, 0.20793559955029392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdb7d41c-737b-4f68-b7dc-8ca689b41368", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 541.7499999999999, 111, 1026, 531.0, 952.5000000000003, 1023.05, 1026.0, 0.0881356230968214, 0.05413799504677798, 0.0398503842713167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 86.14285714285714, 83, 95, 85.0, 93.0, 95.0, 95.0, 0.07820617381880747, 0.058120017847766096, 0.03925583334264359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 156.92857142857142, 82, 260, 88.0, 259.5, 260.0, 260.0, 0.0782092320412051, 0.10483179428737423, 0.03991202159692079], "isController": false}, {"data": ["login", 20, 0, 0.0, 2349.4500000000003, 1539, 3754, 2270.5, 3463.700000000001, 3741.95, 3754.0, 0.08547885253188361, 15.45931376909384, 0.15023075283362397], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 110.66666666666666, 85, 297, 89.0, 256.50000000000006, 297.0, 297.0, 0.11624677899549866, 0.0941099411985043, 0.04132209722105617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b44c7b6d-8130-4530-840e-530f464e963a", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d057f89c-60bc-4779-8d8d-21d6f12250ea", 3, 0, 0.0, 298.3333333333333, 171, 399, 325.0, 399.0, 399.0, 399.0, 0.025597488033174343, 0.03019703666413536, 0.016415055802523913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3a0fbf4-f563-45da-9d08-bafa870cb0a1", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ff4263c-dd34-4c07-b4bb-00910cdea578", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 818.5714285714286, 169, 1307, 1022.0, 1257.5, 1307.0, 1307.0, 0.07816949379669232, 66.83310690934572, 0.16151902519849468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=082fcb31-4c39-4034-939f-4382450e4c96", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.0627297794117647, 4.055606617647059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 261.2352941176471, 168, 644, 176.0, 566.4, 644.0, 644.0, 0.1030165674879713, 7.399889295063689, 0.23013621857994693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 949.0, 765, 1056, 1026.0, 1056.0, 1056.0, 1056.0, 0.027808160768246788, 33.26822795971524, 0.06270414376355647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=291f69f7-3044-4362-b6e1-09509244f9d9", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1071.8181818181818, 127, 1655, 1058.5, 1513.5, 1634.8999999999996, 1655.0, 0.09001562998666132, 0.02860937103624357, 0.040612520560388214], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ae81f785-bce1-4194-b791-7f87bc169d2f", 3, 0, 0.0, 242.0, 172, 370, 184.0, 370.0, 370.0, 370.0, 0.07198042132539949, 0.03256926615960459, 0.04615931966505111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 106.61111111111111, 85, 254, 88.0, 249.5, 254.0, 254.0, 0.089897965808807, 0.06979383087695465, 0.031955917533599366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 287.0, 169, 974, 187.0, 482.60000000000076, 974.0, 974.0, 0.12182328855199485, 8.275146938766877, 0.2722517850495753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 322.8823529411764, 168, 973, 338.0, 590.5999999999997, 973.0, 973.0, 0.08900523560209424, 6.393426865183246, 0.19883528304973822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 106.375, 83, 248, 86.5, 248.0, 248.0, 248.0, 0.048117117062931175, 0.035758912192276, 0.024152537275729125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 106.75, 82, 254, 86.0, 254.0, 254.0, 254.0, 0.04807027874752889, 0.012862555055491129, 0.027415080848200067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 104.625, 83, 247, 84.5, 247.0, 247.0, 247.0, 0.0481197218680076, 0.012969768784736423, 0.028289133363809154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d057f89c-60bc-4779-8d8d-21d6f12250ea", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 146.5, 84, 249, 88.5, 249.0, 249.0, 249.0, 0.04807316736072302, 0.012957220890194876, 0.028308710857925762], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 943.9622641509436, 655, 1590, 849.0, 1335.6, 1441.6999999999996, 1590.0, 0.23876347549520896, 285.64412430679755, 0.4714645971204224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1071.8181818181818, 127, 1655, 1058.5, 1513.5, 1634.8999999999996, 1655.0, 0.08799049702632115, 0.027965729701192273, 0.039698837525547245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 104.0, 82, 249, 84.0, 249.0, 249.0, 249.0, 0.03716971225996497, 0.010018399007568683, 0.021888023918709837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b386587f-e710-4023-83d3-2b16623e04ed", 3, 0, 0.0, 287.0, 186, 474, 201.0, 474.0, 474.0, 474.0, 0.05901445854234287, 0.027355660470148518, 0.03784455837513524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 144.5, 82, 247, 85.0, 247.0, 247.0, 247.0, 0.0371415837171297, 0.010010817486257614, 0.0218351888649532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cc9260a-0a01-418a-95ee-593f3648f368", 1, 0, 0.0, 1552.0, 1552, 1552, 1552.0, 1552.0, 1552.0, 1552.0, 0.6443298969072165, 0.11640725676546392, 0.4442352609536082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 181.05555555555554, 81, 809, 90.5, 312.2000000000008, 809.0, 809.0, 0.09201419063295539, 4.623119020675077, 0.05365497617854842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 154.1111111111111, 82, 653, 84.5, 295.70000000000056, 653.0, 653.0, 0.09201466100265308, 1.5264988645135236, 0.053745108526180724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 104.375, 81, 247, 84.0, 247.0, 247.0, 247.0, 0.03717005766005194, 0.009945894334818586, 0.021198548509248374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 95.27777777777779, 82, 249, 84.0, 110.40000000000022, 249.0, 249.0, 0.09209469381072494, 0.06844146678707196, 0.04622721935421154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 84.625, 83, 91, 84.0, 91.0, 91.0, 91.0, 0.037168158039007984, 0.027622039323911204, 0.018656673078173928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 140.38888888888889, 82, 257, 88.0, 249.8, 257.0, 257.0, 0.09209610740452703, 0.03232757242335557, 0.05209385936412754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 88.875, 84, 95, 87.5, 95.0, 95.0, 95.0, 0.03884720907082332, 0.030577002452230072, 0.013808968849394226], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 472.41666666666663, 370, 743, 415.0, 736.1, 743.0, 743.0, 0.08019889325527307, 0.014489057863501485, 0.05458850449113803], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1333.85, 799, 1987, 1267.0, 1756.2, 1975.4999999999998, 1987.0, 0.0881845879795588, 0.04564241370035759, 0.0405614657601291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 251.125, 168, 333, 254.5, 333.0, 333.0, 333.0, 0.037125553982875835, 0.05753735758869526, 0.08349624103765922], "isController": false}, {"data": ["addBook", 62, 5, 8.064516129032258, 928.4354838709676, 452, 1789, 758.0, 1547.4, 1657.9999999999995, 1789.0, 0.29961098895788535, 99.40439762938846, 1.0890204427114794], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 161.30188679245282, 83, 440, 89.0, 338.6, 357.2999999999999, 440.0, 0.23939113349443303, 0.17790688729420265, 0.11572129988256283], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 538.9056603773586, 406, 748, 496.0, 673.8, 741.2, 748.0, 0.23934464726018118, 70.37527328473433, 0.12037352865136065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b5c90dd-cf18-49eb-a23f-77afd73038ce", 1, 0, 0.0, 740.0, 740, 740, 740.0, 740.0, 740.0, 740.0, 1.3513513513513513, 0.244140625, 0.9316934121621622], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 122.22641509433966, 83, 347, 86.0, 249.6, 255.3, 347.0, 0.23970620160648382, 0.4241676145614733, 0.11657586757815326], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 780.7358490566033, 564, 1199, 736.0, 1020.6, 1105.3, 1199.0, 0.2391664372774737, 215.20238067202385, 0.1200503405865444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 89.11764705882354, 84, 98, 89.0, 94.8, 98.0, 98.0, 0.09100642398286937, 0.06798819760438972, 0.0323499397751606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 5, 2.824858757062147, 153.33333333333331, 83, 1258, 92.0, 284.4000000000002, 349.79999999999995, 708.8799999999992, 0.7438443726282081, 1.5133388342445777, 0.3619863678436498], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 97.375, 87, 145, 89.5, 145.0, 145.0, 145.0, 0.04691009094693883, 0.03632783410246337, 0.01667507139129466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 90.88235294117646, 84, 130, 88.0, 102.79999999999998, 130.0, 130.0, 0.0994966639353857, 0.08074387473662648, 0.03536795475828163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 255.25, 171, 502, 177.0, 502.0, 502.0, 502.0, 0.04804371978500435, 0.07445838212773624, 0.10805145182115726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/082fcb31-4c39-4034-939f-4382450e4c96", 3, 0, 0.0, 276.0, 191, 387, 250.0, 387.0, 387.0, 387.0, 0.06666222251849876, 0.030162919694242608, 0.04274888618536542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdb7d41c-737b-4f68-b7dc-8ca689b41368", 3, 0, 0.0, 414.0, 201, 743, 298.0, 743.0, 743.0, 743.0, 0.02214038479988782, 0.026169185289190326, 0.014198098325448896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 313.9444444444445, 168, 892, 333.0, 536.5000000000006, 892.0, 892.0, 0.09197375682138696, 6.247543973355714, 0.20554378206307355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b44c7b6d-8130-4530-840e-530f464e963a", 3, 0, 0.0, 670.0, 343, 947, 720.0, 947.0, 947.0, 947.0, 0.019525529629991215, 0.023078515002115264, 0.012521254352565979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e06836ab-d440-4cd7-971a-12488f6eb2c1", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 106.8, 85, 248, 90.0, 189.20000000000005, 248.0, 248.0, 0.099846901417826, 0.082783221976303, 0.03549245323836784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 109.0, 84, 353, 88.0, 232.0, 353.0, 353.0, 0.07777950621124914, 0.06038545648236627, 0.027648183848529965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d68f752-c846-4f88-bfb8-3633ae1f4034", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 0.9795580904907976, 1.8303057898773005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ff4263c-dd34-4c07-b4bb-00910cdea578", 3, 0, 0.0, 566.0, 182, 990, 526.0, 990.0, 990.0, 990.0, 0.0233064014916097, 0.027547377544282162, 0.014945836894033561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3a0fbf4-f563-45da-9d08-bafa870cb0a1", 3, 0, 0.0, 535.3333333333334, 204, 984, 418.0, 984.0, 984.0, 984.0, 0.03565613226047993, 0.02972505036428682, 0.022865423357143706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/291f69f7-3044-4362-b6e1-09509244f9d9", 3, 0, 0.0, 339.3333333333333, 182, 434, 402.0, 434.0, 434.0, 434.0, 0.02004570420558874, 0.027634621520399846, 0.012854829845380803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 94.05882352941178, 82, 248, 84.0, 119.99999999999989, 248.0, 248.0, 0.08904626215219577, 0.0661759819314658, 0.04469704955686389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 139.23529411764707, 81, 335, 84.0, 284.59999999999997, 335.0, 335.0, 0.0890457957289446, 0.03169391948164871, 0.05034402122956529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 189.3529411764706, 82, 888, 86.0, 382.3999999999995, 888.0, 888.0, 0.08904626215219577, 4.7357644245123405, 0.051899320760350316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 180.7058823529412, 82, 684, 87.0, 353.5999999999997, 684.0, 684.0, 0.0890448628971008, 1.5627148371002804, 0.05198546309876123], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 44.44444444444444, 0.3139717425431711], "isController": false}, {"data": ["401/Unauthorized", 5, 55.55555555555556, 0.3924646781789639], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1274, 9, "401/Unauthorized", 5, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
