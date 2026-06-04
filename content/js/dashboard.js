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

    var data = {"OkPercent": 97.8790259230165, "KoPercent": 2.1209740769835035};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7358108108108108, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/27b55f73-3fbb-43b8-84d0-f5c81b03eddd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27585177-91e5-452b-bf67-a402bce38a2b"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f248c11-be45-4ce9-85ca-9f8e56a7e09b"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8374fbba-4fd4-44b9-87bc-026b2143a5ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a8995ed-3a14-44f2-a9f7-b0ed9ca26931"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84dd0af7-cbe3-4351-a0dd-b11343a391c9"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f45887e5-8335-44ab-92c5-7ab2ecd9ee21"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/42934887-1385-4bcc-a3f3-8fa8afb31930"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f350efda-2ebd-4f69-a3f8-d1efc63b84fe"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6351c7d-2352-482d-bdcb-9e206e321cf0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f707a5f-1a7e-44c6-94e6-2a724a6dc1be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3055555555555556, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/27585177-91e5-452b-bf67-a402bce38a2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f248c11-be45-4ce9-85ca-9f8e56a7e09b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a8995ed-3a14-44f2-a9f7-b0ed9ca26931"], "isController": false}, {"data": [0.25862068965517243, 500, 1500, "addBook"], "isController": true}, {"data": [0.8981481481481481, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27b55f73-3fbb-43b8-84d0-f5c81b03eddd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8374fbba-4fd4-44b9-87bc-026b2143a5ff"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.42592592592592593, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16335cc6-167a-45d9-acac-3fd4aaab3760"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5cb22d7-bc7a-4ff8-a013-1d9210a8b7ff"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c65be6d3-00ab-4783-8bc6-c8fe0cc51ad9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f707a5f-1a7e-44c6-94e6-2a724a6dc1be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42934887-1385-4bcc-a3f3-8fa8afb31930"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/84dd0af7-cbe3-4351-a0dd-b11343a391c9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b6351c7d-2352-482d-bdcb-9e206e321cf0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f350efda-2ebd-4f69-a3f8-d1efc63b84fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ed4cf33-61fd-46c6-872f-0aaf4434f068"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f45887e5-8335-44ab-92c5-7ab2ecd9ee21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1273, 27, 2.1209740769835035, 452.7886881382565, 126, 2884, 153.0, 1272.4000000000046, 1553.3, 1983.7199999999998, 4.99429167761906, 707.2546834357628, 3.6518558729515753], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2209.314814814815, 1622, 2917, 2142.0, 2690.5, 2749.75, 2917.0, 0.25280188758742733, 304.2061404452005, 1.2430249062526333], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/27b55f73-3fbb-43b8-84d0-f5c81b03eddd", 3, 0, 0.0, 592.3333333333334, 431, 770, 576.0, 770.0, 770.0, 770.0, 0.026627140156390068, 0.026705149356066993, 0.01707534704039337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27585177-91e5-452b-bf67-a402bce38a2b", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 744.4615384615386, 138, 2884, 547.0, 2166.7999999999993, 2884.0, 2884.0, 0.06937958639092728, 0.013753960973982656, 0.046645680453635756], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 744.4615384615386, 138, 2884, 547.0, 2166.7999999999993, 2884.0, 2884.0, 0.07055209729676926, 0.013986402100824375, 0.04743398969396671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 196.80952380952382, 130, 420, 134.0, 401.4, 418.2, 420.0, 0.10969608959558708, 0.0293522739738192, 0.06256105109748326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 164.33333333333334, 129, 482, 136.0, 341.60000000000014, 472.89999999999986, 482.0, 0.10969494358545759, 0.08152133991067698, 0.05506171972941914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 220.52380952380952, 127, 418, 134.0, 408.40000000000003, 417.3, 418.0, 0.10969608959558708, 0.029566524148810582, 0.06459642775990138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 183.95238095238096, 129, 411, 134.0, 402.8, 410.3, 411.0, 0.10969608959558708, 0.029566524148810582, 0.06448930267240569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f248c11-be45-4ce9-85ca-9f8e56a7e09b", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 0.7344067581300813, 2.802654979674797], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 282.3846153846154, 135, 576, 251.0, 524.0, 576.0, 576.0, 0.06938847404070435, 0.13580062456298606, 0.04484813932138072], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 168.94444444444446, 132, 469, 135.5, 406.9000000000001, 469.0, 469.0, 0.1105522082803604, 0.08215842822397879, 0.055492026421977786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 190.83333333333331, 127, 403, 132.5, 401.2, 403.0, 403.0, 0.11055492430058657, 0.029582079353867887, 0.06305085526517827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 934.6666666666666, 797, 1060, 956.5, 1060.0, 1060.0, 1060.0, 0.03806261299838234, 11.19167201922162, 0.02170758397563993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1347.6666666666665, 937, 1552, 1383.0, 1552.0, 1552.0, 1552.0, 0.0379386658235852, 34.13727819712298, 0.02159984587417009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8374fbba-4fd4-44b9-87bc-026b2143a5ff", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 260.8333333333333, 130, 391, 259.5, 391.0, 391.0, 391.0, 0.038282884998213466, 0.06774276134449492, 0.021197652142565464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 160.72727272727272, 132, 397, 136.0, 347.20000000000016, 397.0, 397.0, 0.06598324025697472, 0.04903637288628688, 0.033120493644614266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 227.9090909090909, 130, 402, 134.0, 401.4, 402.0, 402.0, 0.06598244866865415, 0.03567410443821943, 0.036623070763176994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 453.18181818181813, 131, 1557, 134.0, 1530.8000000000002, 1557.0, 1557.0, 0.06598205288161621, 10.809235669147993, 0.03775926073108115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 361.1818181818182, 130, 1050, 137.0, 1000.0000000000002, 1050.0, 1050.0, 0.06598244866865415, 3.5420109500872767, 0.03782392321142576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 178.33333333333334, 133, 391, 136.5, 391.0, 391.0, 391.0, 0.03828117523207963, 0.02844919370274667, 0.02149577710785721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 948.8750000000001, 132, 1607, 1335.5, 1605.6, 1607.0, 1607.0, 0.13120131201312013, 73.79774305555556, 0.0700850758507585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 177.88888888888889, 131, 401, 134.0, 400.1, 401.0, 401.0, 0.1103725687375831, 0.029748856417551692, 0.06488699841799318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a8995ed-3a14-44f2-a9f7-b0ed9ca26931", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 0.6339089912280702, 2.419133771929825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 682.6249999999999, 131, 1209, 794.0, 1192.2, 1209.0, 1209.0, 0.1312002361604251, 24.12402701699863, 0.07021262638272749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 199.05555555555554, 130, 545, 133.0, 410.0000000000002, 545.0, 545.0, 0.11037933698811582, 0.029750680672578092, 0.06499876973030648], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 390.46153846153845, 136, 577, 452.0, 549.0, 577.0, 577.0, 0.0707741053880871, 0.01403041347048992, 0.048019209725450915], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 675.4545454545454, 266, 1693, 545.0, 1666.8000000000002, 1693.0, 1693.0, 0.06592945548263358, 14.424427191030597, 0.14520985982498727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 561.2857142857142, 158, 1481, 476.0, 1268.0000000000002, 1466.6, 1481.0, 0.09165302782324058, 0.0562985883797054, 0.041440773322422256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 136.18750000000003, 129, 159, 134.0, 148.5, 159.0, 159.0, 0.13119162997400766, 0.0974969046974803, 0.0658520486392968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 229.3125, 130, 405, 133.0, 398.0, 405.0, 405.0, 0.13120453967707282, 0.158271882457133, 0.06794063199586706], "isController": false}, {"data": ["login", 21, 0, 0.0, 2912.047619047619, 1538, 3797, 2910.0, 3668.8, 3784.2, 3797.0, 0.08852280726898709, 30.378685947425883, 0.17550189928844523], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 141.8333333333333, 136, 170, 138.5, 155.60000000000002, 170.0, 170.0, 0.10715625167431643, 0.086750520154305, 0.038090698837354664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1086.8749999999998, 269, 1742, 1467.0, 1741.3, 1742.0, 1742.0, 0.13104549735861418, 98.06114411421434, 0.27376863303165566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84dd0af7-cbe3-4351-a0dd-b11343a391c9", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 425.61904761904754, 267, 893, 277.0, 743.4000000000002, 882.7999999999998, 893.0, 0.10961707103186202, 0.16988505051520025, 0.24653136190076003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 969.6999999999999, 134, 1686, 1256.0, 1685.8, 1686.0, 1686.0, 0.06115347688092806, 43.903036575894525, 0.09894441454718908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f45887e5-8335-44ab-92c5-7ab2ecd9ee21", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42934887-1385-4bcc-a3f3-8fa8afb31930", 3, 0, 0.0, 388.6666666666667, 255, 588, 323.0, 588.0, 588.0, 588.0, 0.024323206771580765, 0.028749206962112552, 0.015597889759119176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f350efda-2ebd-4f69-a3f8-d1efc63b84fe", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1052.0, 169, 2033, 1190.5, 1878.1999999999998, 2028.05, 2033.0, 0.09589148570780993, 0.030017167844969623, 0.04326354140332831], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6351c7d-2352-482d-bdcb-9e206e321cf0", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.3131092937608319, 1.1948927642980938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f707a5f-1a7e-44c6-94e6-2a724a6dc1be", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 137.9333333333333, 133, 150, 138.0, 145.2, 150.0, 150.0, 0.0739338735435027, 0.05739983346394985, 0.026281181611166975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 430.8333333333333, 268, 859, 278.0, 805.9000000000001, 859.0, 859.0, 0.11028060286729567, 0.17091339526406077, 0.2480236605501777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 652.6875, 272, 1870, 534.5, 1677.5000000000002, 1870.0, 1870.0, 0.17672528055138287, 26.667762858144826, 0.39180719548025095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 171.625, 133, 392, 136.5, 392.0, 392.0, 392.0, 0.03966935591841997, 0.029480839701091402, 0.01991215716998815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 133.375, 131, 137, 133.0, 137.0, 137.0, 137.0, 0.03966974933677138, 0.010614757146753279, 0.02262415391862743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 200.0, 131, 406, 133.0, 406.0, 406.0, 406.0, 0.03961651216226923, 0.010677888043736629, 0.02329017609539656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 165.125, 131, 391, 132.5, 391.0, 391.0, 391.0, 0.03967053619688487, 0.010692449209316625, 0.02336067707687654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 136.5, 136, 137, 136.5, 137.0, 137.0, 137.0, 0.07694379255953526, 0.02269240757126919, 0.047563887392759595], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1502.6851851851852, 1038, 2357, 1336.0, 2134.0, 2174.75, 2357.0, 0.25368667816086554, 303.49746283959956, 0.5009320930090528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1052.0, 169, 2033, 1190.5, 1878.1999999999998, 2028.05, 2033.0, 0.09232099169530715, 0.028899486569393912, 0.04165263492503116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 171.14285714285717, 131, 397, 135.0, 397.0, 397.0, 397.0, 0.05413473361844293, 0.014591002420595947, 0.03187816833195419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27585177-91e5-452b-bf67-a402bce38a2b", 3, 0, 0.0, 518.0, 231, 980, 343.0, 980.0, 980.0, 980.0, 0.026378960141391225, 0.026456242251180456, 0.01691619514275414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 169.85714285714286, 126, 401, 133.0, 401.0, 401.0, 401.0, 0.05413640828132371, 0.014591453794575533, 0.03182628689976257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 284.33333333333337, 130, 1554, 136.0, 864.0000000000005, 1554.0, 1554.0, 0.07543564082576881, 4.544118259511177, 0.043915722673439114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 248.19999999999996, 127, 796, 136.0, 560.2000000000002, 796.0, 796.0, 0.0754367789501212, 1.4977049145804204, 0.043990053975015334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 169.73333333333335, 130, 402, 135.0, 395.4, 402.0, 402.0, 0.07543602019673715, 0.05606133922823923, 0.037865346075315325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f248c11-be45-4ce9-85ca-9f8e56a7e09b", 3, 0, 0.0, 340.0, 251, 440, 329.0, 440.0, 440.0, 440.0, 0.1279263144428809, 0.05788332587096499, 0.08203608055093599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 133.14285714285717, 130, 136, 133.0, 136.0, 136.0, 136.0, 0.05413431496891143, 0.014485158497540757, 0.030873476505707306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 151.13333333333333, 130, 391, 134.0, 242.80000000000007, 391.0, 391.0, 0.07543791710881668, 0.027739150770221134, 0.04260081334647629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 133.28571428571428, 128, 137, 133.0, 137.0, 137.0, 137.0, 0.05413389632585512, 0.04023036631247632, 0.027172678429189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 139.57142857142858, 137, 143, 140.0, 143.0, 143.0, 143.0, 0.051238882992350764, 0.040330605167807336, 0.018213821688687185], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 552.2307692307693, 134, 1114, 477.0, 1060.3999999999999, 1114.0, 1114.0, 0.07038783698176955, 0.013657736097048583, 0.04789989597489861], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1508.047619047619, 969, 2108, 1629.0, 2038.8000000000002, 2104.2, 2108.0, 0.09232960790693176, 0.04778778534245491, 0.042468013011879746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 306.85714285714283, 263, 535, 270.0, 535.0, 535.0, 535.0, 0.054077021128664686, 0.08380882083124107, 0.12162048794854959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a8995ed-3a14-44f2-a9f7-b0ed9ca26931", 3, 0, 0.0, 391.66666666666663, 240, 689, 246.0, 689.0, 689.0, 689.0, 0.07260758023137616, 0.03214398083159882, 0.04656150164577182], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 1340.1724137931033, 679, 2902, 1073.0, 2333.3, 2514.7999999999997, 2902.0, 0.28223157587406633, 88.41410678876427, 1.0254131970633318], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 261.2037037037037, 131, 649, 137.5, 538.0, 599.75, 649.0, 0.25538073010513174, 0.18978978086914575, 0.12345064590042988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27b55f73-3fbb-43b8-84d0-f5c81b03eddd", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8374fbba-4fd4-44b9-87bc-026b2143a5ff", 3, 0, 0.0, 446.3333333333333, 224, 671, 444.0, 671.0, 671.0, 671.0, 0.019689948937399088, 0.02327285305719274, 0.012626692515194078], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 845.5185185185186, 649, 1187, 785.5, 1092.0, 1181.0, 1187.0, 0.2548131370328426, 74.92352288009627, 0.1281530913788222], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 201.462962962963, 131, 531, 136.5, 401.0, 409.5, 531.0, 0.25558621538345033, 0.45226779519024607, 0.12429876490327955], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1240.1111111111113, 902, 1822, 1194.5, 1591.0, 1601.5, 1822.0, 0.25437141995779317, 228.88385081528395, 0.12768252915850165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 141.75, 134, 162, 141.0, 153.60000000000002, 162.0, 162.0, 0.16059419853457793, 0.11997515808491419, 0.05708621901033825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 12, 7.0588235294117645, 207.22352941176473, 129, 1387, 140.0, 367.4000000000001, 406.69999999999993, 1147.0199999999973, 0.7355263556399728, 1.5706453797587472, 0.3537058697707321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 141.375, 137, 149, 140.0, 149.0, 149.0, 149.0, 0.04043160740909206, 0.03131080534708008, 0.014372172946200691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16335cc6-167a-45d9-acac-3fd4aaab3760", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.8125596374045801, 1.5182689249363868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 151.28571428571428, 130, 394, 139.0, 148.8, 369.49999999999966, 394.0, 0.10789426362165079, 0.08755872370077325, 0.03835303902175868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5cb22d7-bc7a-4ff8-a013-1d9210a8b7ff", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 373.87500000000006, 266, 791, 274.5, 791.0, 791.0, 791.0, 0.039589457327513684, 0.061355926541761925, 0.08903761740748438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 489.26666666666665, 266, 1693, 275.0, 1159.6000000000004, 1693.0, 1693.0, 0.0753844607498241, 6.1214439736405675, 0.16825556431550912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c65be6d3-00ab-4783-8bc6-c8fe0cc51ad9", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 139.36363636363635, 133, 156, 139.0, 153.20000000000002, 156.0, 156.0, 0.06734419003305987, 0.05583517318170687, 0.02393875505081425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f707a5f-1a7e-44c6-94e6-2a724a6dc1be", 3, 0, 0.0, 339.6666666666667, 245, 477, 297.0, 477.0, 477.0, 477.0, 0.020568654741417728, 0.024311453569690028, 0.013190185494984675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 157.375, 134, 403, 139.0, 228.00000000000017, 403.0, 403.0, 0.12285672602182243, 0.09538193084702033, 0.04367172682806969], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42934887-1385-4bcc-a3f3-8fa8afb31930", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84dd0af7-cbe3-4351-a0dd-b11343a391c9", 3, 0, 0.0, 762.0, 446, 1323, 517.0, 1323.0, 1323.0, 1323.0, 0.016612491486098113, 0.02290166062618018, 0.010653192782426199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6351c7d-2352-482d-bdcb-9e206e321cf0", 3, 0, 0.0, 961.0, 249, 1520, 1114.0, 1520.0, 1520.0, 1520.0, 0.029503456821690942, 0.024595818007926595, 0.01891986000609738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f350efda-2ebd-4f69-a3f8-d1efc63b84fe", 3, 0, 0.0, 378.6666666666667, 335, 426, 375.0, 426.0, 426.0, 426.0, 0.043037902045734946, 0.02766922413422087, 0.027599175465526638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 169.24999999999997, 127, 402, 136.5, 397.1, 402.0, 402.0, 0.17699115044247787, 0.13153346238938052, 0.0888412610619469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ed4cf33-61fd-46c6-872f-0aaf4434f068", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 1.2572281003937007, 2.349132627952756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f45887e5-8335-44ab-92c5-7ab2ecd9ee21", 3, 0, 0.0, 782.6666666666666, 257, 1626, 465.0, 1626.0, 1626.0, 1626.0, 0.027807129748067407, 0.023181659923437705, 0.017832046094952078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 232.37499999999997, 127, 412, 134.5, 405.7, 412.0, 412.0, 0.17700681476236838, 0.08059514392866626, 0.09909097320559342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 397.18749999999994, 128, 1467, 263.0, 1461.4, 1467.0, 1467.0, 0.17699310833084436, 19.949080776612572, 0.10215129592141506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 363.125, 131, 1036, 392.5, 868.7000000000002, 1036.0, 1036.0, 0.17699115044247787, 6.546900926438052, 0.10232300884955751], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.925925925925927, 0.5498821681068342], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.15710919088766692], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.15710919088766692], "isController": false}, {"data": ["401/Unauthorized", 16, 59.25925925925926, 1.2568735271013354], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1273, 27, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
