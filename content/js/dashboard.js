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

    var data = {"OkPercent": 99.05882352941177, "KoPercent": 0.9411764705882353};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8186702484889188, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b21a9ca3-6be1-43c8-aefb-2d7c76e95709"], "isController": false}, {"data": [0.41509433962264153, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28049c2f-190d-472f-8f67-926070a5a237"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85665f7d-e7d8-40c6-8186-f978fe07028f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/050bc660-29ff-4dd6-bb5e-9607f86064ac"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c22ab5f9-82ed-40c2-bd0a-c5964a9684b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/afbce106-d4a8-4c1e-8747-ec21b7a955ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eac6ee50-deb2-42e7-9d2e-eb2d0cb5b359"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d1dc3e88-5bea-44f7-9202-9de74ba21c1d"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81dc56e2-bf9c-4745-a70e-0d60892378b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d0737c4-33a2-4624-b990-04641bbc978e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=050bc660-29ff-4dd6-bb5e-9607f86064ac"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/264ab649-8a87-4725-a5be-b80721e7fee9"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5cbe23e-b043-4cd3-8da4-e5dc6987b38e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b569a09f-6857-4e38-9124-14e6cedc1b17"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c22ab5f9-82ed-40c2-bd0a-c5964a9684b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7db81605-8ab3-4711-929f-ea193997ca48"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eac6ee50-deb2-42e7-9d2e-eb2d0cb5b359"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=264ab649-8a87-4725-a5be-b80721e7fee9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afbce106-d4a8-4c1e-8747-ec21b7a955ec"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6d0737c4-33a2-4624-b990-04641bbc978e"], "isController": false}, {"data": [0.425, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1dc3e88-5bea-44f7-9202-9de74ba21c1d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/85665f7d-e7d8-40c6-8186-f978fe07028f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7547169811320755, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b21a9ca3-6be1-43c8-aefb-2d7c76e95709"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a57f83f-ae67-4134-a88f-98a13c21e877"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9739884393063584, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2a57f83f-ae67-4134-a88f-98a13c21e877"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81dc56e2-bf9c-4745-a70e-0d60892378b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b84e1c1-7ceb-4444-9645-499ada96d96b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b569a09f-6857-4e38-9124-14e6cedc1b17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f326d64-54d4-48b3-8035-00b71a9c1ea4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7db81605-8ab3-4711-929f-ea193997ca48"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1275, 12, 0.9411764705882353, 300.7505882352943, 76, 1875, 96.0, 843.0, 1018.0, 1408.8000000000002, 5.012600301149162, 689.9324702610287, 3.6536081876403035], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/b21a9ca3-6be1-43c8-aefb-2d7c76e95709", 3, 0, 0.0, 287.3333333333333, 173, 459, 230.0, 459.0, 459.0, 459.0, 0.019001653143823512, 0.0261953128463843, 0.012185304913194115], "isController": false}, {"data": ["see books", 53, 0, 0.0, 1338.679245283019, 1003, 1737, 1343.0, 1606.8, 1645.6, 1737.0, 0.23556497815468175, 283.46523183844016, 1.1582711572351783], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/28049c2f-190d-472f-8f67-926070a5a237", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.9532416044776119, 1.781133395522388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85665f7d-e7d8-40c6-8186-f978fe07028f", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.2724948152337858, 1.039899132730015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/050bc660-29ff-4dd6-bb5e-9607f86064ac", 3, 0, 0.0, 591.0, 186, 1337, 250.0, 1337.0, 1337.0, 1337.0, 0.026773283832506337, 0.02685172118748438, 0.017169065478527826], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 584.857142857143, 92, 1011, 565.0, 968.5, 1011.0, 1011.0, 0.08455995602882287, 0.015967062009627758, 0.05718532182613265], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 584.857142857143, 92, 1011, 565.0, 968.5, 1011.0, 1011.0, 0.0841654693126687, 0.01589257292336734, 0.05691854247951473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c22ab5f9-82ed-40c2-bd0a-c5964a9684b8", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 0.2548153208744711, 0.9724303596614952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 123.11111111111111, 77, 237, 80.0, 236.1, 237.0, 237.0, 0.0942378773441672, 0.03307937643320105, 0.05330534446561888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 89.27777777777779, 77, 236, 81.0, 103.70000000000022, 236.0, 236.0, 0.0942363972378265, 0.07003310380662692, 0.04730225408226838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 179.44444444444443, 78, 694, 85.0, 354.70000000000056, 694.0, 694.0, 0.0942378773441672, 1.5633814350072772, 0.05504367336628169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 171.05555555555554, 78, 848, 80.5, 376.4000000000008, 848.0, 848.0, 0.09411715494298069, 4.728779400173071, 0.054881248986933404], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 228.92857142857144, 81, 445, 190.5, 387.0, 445.0, 445.0, 0.08458754508818252, 0.17986654049024525, 0.05467862586022513], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 101.46666666666665, 78, 234, 81.0, 234.0, 234.0, 234.0, 0.07761283612825781, 0.05767907059922284, 0.03895800563469191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 100.13333333333333, 76, 233, 80.0, 233.0, 233.0, 233.0, 0.0776156473144986, 0.02853992031460209, 0.04383060708372141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 466.25, 393, 543, 464.5, 543.0, 543.0, 543.0, 0.05002688945308103, 14.709566548269697, 0.028530960391210277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 890.25, 537, 1170, 927.0, 1170.0, 1170.0, 1170.0, 0.04973763398075154, 44.754010485314964, 0.028317422471463034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 197.75, 83, 238, 235.0, 238.0, 238.0, 238.0, 0.05016869222761536, 0.08877506866839749, 0.027778953606501865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afbce106-d4a8-4c1e-8747-ec21b7a955ec", 3, 0, 0.0, 730.3333333333334, 188, 1180, 823.0, 1180.0, 1180.0, 1180.0, 0.02062748819076301, 0.024380992715058752, 0.013227913976498414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 88.26315789473684, 78, 236, 80.0, 82.0, 236.0, 236.0, 0.1041455406523896, 0.07739722308248874, 0.05227617958528149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 104.31578947368422, 78, 237, 80.0, 234.0, 237.0, 237.0, 0.10414668238002577, 0.036100186367747415, 0.05893580247759476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 132.26315789473685, 77, 927, 80.0, 231.0, 927.0, 927.0, 0.10414668238002577, 4.958770632348507, 0.060755800010962806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 140.89473684210526, 78, 633, 80.0, 237.0, 633.0, 633.0, 0.10414611151307857, 1.6382992700179788, 0.06085717217270714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 81.5, 78, 88, 80.0, 88.0, 88.0, 88.0, 0.05026893882270145, 0.03735806879304278, 0.02822718732720052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 620.3333333333333, 78, 1096, 774.0, 995.8000000000001, 1096.0, 1096.0, 0.09144166935911582, 54.86113201357605, 0.048518854510207945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 142.59999999999997, 78, 539, 80.0, 366.2000000000001, 539.0, 539.0, 0.07754623047773647, 4.671256689977925, 0.04514442662317185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 455.5333333333333, 79, 695, 616.0, 657.8000000000001, 695.0, 695.0, 0.09152982957145735, 17.950096030046193, 0.04865501682623367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 163.53333333333333, 78, 623, 82.0, 436.4000000000001, 623.0, 623.0, 0.07761484409764983, 1.5409477322236136, 0.04526016657439124], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 432.0, 83, 820, 420.5, 764.5, 820.0, 820.0, 0.08403512668295347, 0.015867960932669855, 0.057510367458597694], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/eac6ee50-deb2-42e7-9d2e-eb2d0cb5b359", 3, 0, 0.0, 358.66666666666663, 193, 682, 201.0, 682.0, 682.0, 682.0, 0.04681282671451978, 0.03902592747912929, 0.030019944214714836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 246.31578947368425, 159, 1010, 162.0, 473.0, 1010.0, 1010.0, 0.10409932171073538, 6.707525507758139, 0.23271998343998948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1dc3e88-5bea-44f7-9202-9de74ba21c1d", 3, 0, 0.0, 533.3333333333334, 185, 864, 551.0, 864.0, 864.0, 864.0, 0.041813594993518895, 0.02688211266673171, 0.026814056685296947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 613.9047619047619, 101, 1066, 617.0, 1004.2, 1060.6, 1066.0, 0.09165782823322989, 0.05630153706904453, 0.041442943820298284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81dc56e2-bf9c-4745-a70e-0d60892378b8", 3, 0, 0.0, 380.0, 247, 599, 294.0, 599.0, 599.0, 599.0, 0.04101554489151388, 0.03419297215728094, 0.026302286274831495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 94.86666666666666, 79, 237, 81.0, 162.60000000000005, 237.0, 237.0, 0.09151028575611898, 0.06800715572305327, 0.04593387390492691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 133.13333333333335, 78, 243, 81.0, 241.8, 243.0, 243.0, 0.09152927106088526, 0.11613968053233424, 0.04707560165240844], "isController": false}, {"data": ["login", 21, 0, 0.0, 2319.904761904762, 1527, 3493, 2224.0, 3337.6, 3478.7, 3493.0, 0.09226267623269525, 21.152703035551884, 0.16834591831018714], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d0737c4-33a2-4624-b990-04641bbc978e", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 0.9312580541237113, 3.5538820876288657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 100.39999999999999, 80, 234, 82.0, 207.0, 234.0, 234.0, 0.07644130072517313, 0.06188460771598489, 0.027172493617151388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=050bc660-29ff-4dd6-bb5e-9607f86064ac", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/264ab649-8a87-4725-a5be-b80721e7fee9", 3, 0, 0.0, 313.0, 171, 595, 173.0, 595.0, 595.0, 595.0, 0.03642500698145967, 0.02960717527106276, 0.023358484294751156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 722.1999999999999, 162, 1188, 856.0, 1101.6000000000001, 1188.0, 1188.0, 0.09137760883073212, 72.92679792108325, 0.18992383866673979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 309.94444444444446, 159, 938, 316.5, 518.6000000000007, 938.0, 938.0, 0.09407681894916192, 6.39039964845322, 0.2102437242922026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 675.0, 79, 1250, 811.0, 1250.0, 1250.0, 1250.0, 0.07453230975627935, 59.45101713311471, 0.12850272741671015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5cbe23e-b043-4cd3-8da4-e5dc6987b38e", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b569a09f-6857-4e38-9124-14e6cedc1b17", 3, 0, 0.0, 299.6666666666667, 181, 436, 282.0, 436.0, 436.0, 436.0, 0.024107035236449838, 0.028493699525894974, 0.015459264132749409], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 1067.5833333333333, 172, 1875, 1080.5, 1555.0, 1804.75, 1875.0, 0.0949772845994333, 0.03009778208253526, 0.04285107957513495], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c22ab5f9-82ed-40c2-bd0a-c5964a9684b8", 3, 0, 0.0, 492.6666666666667, 165, 1070, 243.0, 1070.0, 1070.0, 1070.0, 0.016180357046545496, 0.0223059284154037, 0.010376075319562052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 92.46666666666667, 79, 236, 82.0, 149.00000000000006, 236.0, 236.0, 0.06822430331615596, 0.052967110484710936, 0.02425160781941482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 298.2, 158, 702, 316.0, 564.0000000000001, 702.0, 702.0, 0.07751216941059746, 6.29422028893953, 0.17300453801455162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7db81605-8ab3-4711-929f-ea193997ca48", 3, 0, 0.0, 407.6666666666667, 270, 508, 445.0, 508.0, 508.0, 508.0, 0.07118957784580338, 0.03346280937804039, 0.045652170688877815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 262.3333333333334, 160, 1017, 164.0, 605.4000000000003, 1017.0, 1017.0, 0.0827043210250925, 6.715838549448914, 0.18459324464213842], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eac6ee50-deb2-42e7-9d2e-eb2d0cb5b359", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 100.12499999999999, 79, 236, 81.0, 236.0, 236.0, 236.0, 0.039642621764790414, 0.029460971838872564, 0.019898737878029565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 98.5, 77, 233, 79.5, 233.0, 233.0, 233.0, 0.03964321110009911, 0.010607656095143705, 0.02260901883052527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 118.375, 78, 239, 80.0, 239.0, 239.0, 239.0, 0.03964321110009911, 0.010685084241823586, 0.0233058721506442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 117.125, 78, 233, 79.0, 233.0, 233.0, 233.0, 0.03964360400003965, 0.010685190140635684, 0.023344817589867093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 3.5532756024096384, 7.447759789156626], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 909.245283018868, 620, 1404, 870.0, 1251.2, 1282.4999999999998, 1404.0, 0.22622309865888118, 270.641473870165, 0.44670225145337666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 1067.5833333333333, 172, 1875, 1080.5, 1555.0, 1804.75, 1875.0, 0.09435482919810188, 0.029900529369906313, 0.042570245204612375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 99.12500000000001, 78, 238, 79.5, 238.0, 238.0, 238.0, 0.037782185699442715, 0.010183479739302918, 0.02224868943043355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=264ab649-8a87-4725-a5be-b80721e7fee9", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 137.875, 78, 240, 80.0, 240.0, 240.0, 240.0, 0.03778236413697996, 0.01018352783379538, 0.022211897666466734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afbce106-d4a8-4c1e-8747-ec21b7a955ec", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 192.0, 76, 846, 80.0, 843.6, 846.0, 846.0, 0.06724828965183319, 8.08372601197468, 0.03876408571466999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 183.2, 78, 629, 81.0, 622.4, 629.0, 629.0, 0.06731226608987534, 2.6546625523913803, 0.03886669843431669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 81.4, 78, 92, 80.0, 89.0, 92.0, 92.0, 0.06747456209009203, 0.05014466967828129, 0.033869067299128225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 98.625, 78, 233, 80.0, 233.0, 233.0, 233.0, 0.0377820072635909, 0.010109638662328032, 0.02154755101751668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 100.33333333333334, 77, 233, 80.0, 232.4, 233.0, 233.0, 0.06747881165314092, 0.031569188837205116, 0.03772838766127436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 100.0, 79, 234, 80.5, 234.0, 234.0, 234.0, 0.037781115109612455, 0.028077566990639728, 0.01896434879525469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 104.125, 81, 254, 82.5, 254.0, 254.0, 254.0, 0.03950656302778299, 0.03109598613319638, 0.014043348576282236], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 674.8571428571429, 79, 1337, 597.0, 1258.5, 1337.0, 1337.0, 0.08354418293789087, 0.015612086083329356, 0.05685969537702296], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1280.047619047619, 794, 1856, 1216.0, 1649.4, 1836.0999999999997, 1856.0, 0.09075116031840694, 0.04697081539917546, 0.04174198877926725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 239.875, 159, 474, 167.0, 474.0, 474.0, 474.0, 0.037766846373910666, 0.05853123554237912, 0.08493852265538697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d0737c4-33a2-4624-b990-04641bbc978e", 3, 0, 0.0, 419.66666666666663, 194, 736, 329.0, 736.0, 736.0, 736.0, 0.09120481561426443, 0.04126780394004803, 0.05848746313805369], "isController": false}, {"data": ["addBook", 60, 3, 5.0, 897.0333333333333, 405, 2687, 705.0, 1543.1, 1753.8499999999995, 2687.0, 0.2646424460019143, 85.43465781593898, 0.9625722873597946], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1dc3e88-5bea-44f7-9202-9de74ba21c1d", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85665f7d-e7d8-40c6-8186-f978fe07028f", 3, 0, 0.0, 406.3333333333333, 170, 656, 393.0, 656.0, 656.0, 656.0, 0.017098206398148835, 0.023571257843802186, 0.01096467011860456], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 136.33962264150946, 78, 356, 81.0, 321.0, 333.49999999999994, 356.0, 0.22705560291830712, 0.16873956427815595, 0.1097583236763301], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 532.6226415094337, 388, 813, 500.0, 699.0, 724.6999999999999, 813.0, 0.2268049178153123, 66.68817646973866, 0.11406692644031821], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b21a9ca3-6be1-43c8-aefb-2d7c76e95709", 1, 0, 0.0, 820.0, 820, 820, 820.0, 820.0, 820.0, 820.0, 1.2195121951219512, 0.2203220274390244, 0.840796493902439], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 107.32075471698113, 77, 320, 81.0, 237.2, 248.2999999999999, 320.0, 0.2273351176995402, 0.4022765949917645, 0.11055946153747169], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a57f83f-ae67-4134-a88f-98a13c21e877", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 167.0, 5.9880239520958085, 1.0818207335329342, 4.128461826347305], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 770.4528301886793, 539, 1082, 774.0, 941.8, 1034.7999999999997, 1082.0, 0.22657803048115768, 203.8753101086399, 0.11373155045636235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 98.60000000000001, 80, 263, 82.0, 169.40000000000006, 263.0, 263.0, 0.0856697374508113, 0.06400131752917054, 0.030452914484468074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 3, 1.7341040462427746, 159.3699421965318, 79, 1457, 88.0, 293.4, 412.19999999999993, 1225.3799999999972, 0.7118638488379748, 1.4778150769059846, 0.34551226807846136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 104.25, 80, 250, 84.0, 250.0, 250.0, 250.0, 0.040678310833142654, 0.03150185594793176, 0.014459868303968679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 92.0, 80, 242, 82.5, 106.10000000000022, 242.0, 242.0, 0.09221547683086144, 0.07483502074848229, 0.03277972027972028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a57f83f-ae67-4134-a88f-98a13c21e877", 3, 0, 0.0, 344.6666666666667, 190, 560, 284.0, 560.0, 560.0, 560.0, 0.10765421466250404, 0.048710728639609575, 0.06903606864750421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 238.875, 160, 470, 163.0, 470.0, 470.0, 470.0, 0.03962691261770431, 0.061413974926071035, 0.08912185523298148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 316.4, 158, 926, 177.0, 924.2, 926.0, 926.0, 0.06721966040627562, 10.812698122947, 0.1488854210079364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 85.26315789473685, 81, 100, 84.0, 96.0, 100.0, 100.0, 0.10512803488037537, 0.08716181798187371, 0.03736973114888343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81dc56e2-bf9c-4745-a70e-0d60892378b8", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b84e1c1-7ceb-4444-9645-499ada96d96b", 1, 0, 0.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 2.008402122641509, 3.752702437106918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 107.99999999999999, 81, 241, 86.0, 240.4, 241.0, 241.0, 0.08633888588301657, 0.06703067800488102, 0.03069077584122854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b569a09f-6857-4e38-9124-14e6cedc1b17", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f326d64-54d4-48b3-8035-00b71a9c1ea4", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 93.46666666666665, 79, 252, 81.0, 156.00000000000006, 252.0, 252.0, 0.08274081714831015, 0.06149000180650784, 0.041532011732647874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 122.33333333333331, 78, 242, 81.0, 237.8, 242.0, 242.0, 0.08274492497793469, 0.030425998455428066, 0.046727179639232126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 125.4666666666667, 78, 764, 80.0, 355.40000000000026, 764.0, 764.0, 0.08274492497793469, 4.984417449870366, 0.048170906194836716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 156.66666666666666, 79, 609, 81.0, 386.4000000000001, 609.0, 609.0, 0.08274446853227861, 1.6427901469265946, 0.048251445614818984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7db81605-8ab3-4711-929f-ea193997ca48", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 41.666666666666664, 0.39215686274509803], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 8.333333333333334, 0.0784313725490196], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 8.333333333333334, 0.0784313725490196], "isController": false}, {"data": ["401/Unauthorized", 5, 41.666666666666664, 0.39215686274509803], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1275, 12, "406/Not Acceptable", 5, "401/Unauthorized", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
