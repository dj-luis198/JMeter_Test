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

    var data = {"OkPercent": 97.18844984802432, "KoPercent": 2.811550151975684};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7706302794022092, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.12727272727272726, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/63ebb4e0-6380-40e9-8736-6de89a55aedb"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/972582bf-3813-4b9c-9701-61b22df7fc16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2f52b4d-380e-452a-b55e-45f8df0ff1d3"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b44b7bc0-a6d4-427c-a34c-bdf95b8635e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/138065a0-1b89-4397-b958-ae9cd3ad9e11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9bd53b56-b68f-4161-a76d-0625d97d485d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd8f47c8-f059-411c-813d-db06ca2d54d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f4d7bff-8667-4283-a449-3ff4e1842ff0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8478260869565217, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/63677b1e-aef3-426b-8835-e51d9770472d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f862484-a1f3-4eb7-ac6a-73cd5620fa8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2f52b4d-380e-452a-b55e-45f8df0ff1d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=972582bf-3813-4b9c-9701-61b22df7fc16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/918ed4bf-2ea2-4ded-a7ef-2dddfd58d4fb"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fa3143df-78cd-4b5d-b846-35af7ca7590a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63ebb4e0-6380-40e9-8736-6de89a55aedb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12b9568d-e7ff-4f48-a46d-4194fbac3fc9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.28125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.26, 500, 1500, "register"], "isController": true}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6c869a6c-f881-42bf-946d-2a557865ec51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=138065a0-1b89-4397-b958-ae9cd3ad9e11"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.39090909090909093, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.26, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.27586206896551724, 500, 1500, "addBook"], "isController": true}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9181286549707602, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f4d7bff-8667-4283-a449-3ff4e1842ff0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b44b7bc0-a6d4-427c-a34c-bdf95b8635e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa3143df-78cd-4b5d-b846-35af7ca7590a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7f862484-a1f3-4eb7-ac6a-73cd5620fa8a"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=918ed4bf-2ea2-4ded-a7ef-2dddfd58d4fb"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63677b1e-aef3-426b-8835-e51d9770472d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c869a6c-f881-42bf-946d-2a557865ec51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12b9568d-e7ff-4f48-a46d-4194fbac3fc9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 37, 2.811550151975684, 360.61626139817724, 100, 3479, 115.5, 1014.3, 1214.4499999999996, 1628.2799999999988, 5.2079211055355925, 741.9191049219504, 3.8109558152810536], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1740.272727272727, 1232, 2491, 1807.0, 2064.6, 2167.3999999999996, 2491.0, 0.24538344509433876, 295.2800424624898, 1.206548482470699], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/63ebb4e0-6380-40e9-8736-6de89a55aedb", 3, 0, 0.0, 581.0, 203, 1229, 311.0, 1229.0, 1229.0, 1229.0, 0.06317252416349049, 0.029283097138284656, 0.04051102623765504], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 441.18749999999994, 105, 995, 441.0, 873.9000000000001, 995.0, 995.0, 0.08371791249385196, 0.01751617456231229, 0.055900510417647736], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 441.18749999999994, 105, 995, 441.0, 873.9000000000001, 995.0, 995.0, 0.08382361415990401, 0.01753829036499945, 0.05597109002132263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/972582bf-3813-4b9c-9701-61b22df7fc16", 3, 0, 0.0, 273.3333333333333, 196, 397, 227.0, 397.0, 397.0, 397.0, 0.026563952716164164, 0.03139769281002346, 0.017034826448842254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 152.6875, 100, 310, 103.0, 305.1, 310.0, 310.0, 0.10490565048059902, 0.028070457257504032, 0.059829003789716624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 104.87500000000001, 102, 130, 103.0, 113.90000000000002, 130.0, 130.0, 0.10504201680672269, 0.07806345194327731, 0.05272616859243698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 164.93750000000006, 100, 305, 103.0, 304.3, 305.0, 305.0, 0.1049035870470296, 0.028274794946269697, 0.06177428026304575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 152.625, 101, 304, 103.0, 304.0, 304.0, 304.0, 0.1050433960529944, 0.028312477842408642, 0.0617540277577174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2f52b4d-380e-452a-b55e-45f8df0ff1d3", 3, 0, 0.0, 310.3333333333333, 202, 445, 284.0, 445.0, 445.0, 445.0, 0.018335503034525753, 0.02167194385363379, 0.01175811880794783], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 209.25000000000003, 101, 414, 199.0, 369.20000000000005, 414.0, 414.0, 0.08338197281747686, 0.13661533681105645, 0.05388478565621613], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b44b7bc0-a6d4-427c-a34c-bdf95b8635e7", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 114.52631578947368, 101, 304, 103.0, 116.0, 304.0, 304.0, 0.08397159108486876, 0.06240466876521985, 0.042149802556272015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 112.73684210526316, 100, 303, 102.0, 108.0, 303.0, 303.0, 0.08397233332596733, 0.04238323978520761, 0.04677694020285948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 726.8888888888889, 505, 818, 802.0, 818.0, 818.0, 818.0, 0.09522298047928901, 27.998717961434693, 0.05430685605459451], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1008.8888888888889, 699, 1196, 1037.0, 1196.0, 1196.0, 1196.0, 0.0949868073878628, 85.46929625659631, 0.05407940303430079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/138065a0-1b89-4397-b958-ae9cd3ad9e11", 3, 0, 0.0, 268.0, 195, 410, 199.0, 410.0, 410.0, 410.0, 0.10022383322754151, 0.04534867453980557, 0.06427114305281796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 192.66666666666666, 102, 310, 105.0, 310.0, 310.0, 310.0, 0.09593348611629271, 0.1697573016042211, 0.05311942053509567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bd53b56-b68f-4161-a76d-0625d97d485d", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.6751288319238901, 1.2614792547568712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 116.93333333333335, 101, 304, 103.0, 186.40000000000006, 304.0, 304.0, 0.07141938893570826, 0.05307632322272851, 0.03584918546186919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 142.46666666666667, 101, 306, 102.0, 305.4, 306.0, 306.0, 0.07142074915604482, 0.019110630145269803, 0.04073214600305681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 129.4, 100, 305, 103.0, 303.8, 305.0, 305.0, 0.0714204090961033, 0.01925003213918409, 0.04198738894126385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 115.66666666666669, 101, 299, 103.0, 182.00000000000006, 299.0, 299.0, 0.07142108921922465, 0.019250215453619147, 0.042057535936711396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 125.44444444444444, 102, 302, 104.0, 302.0, 302.0, 302.0, 0.09593144099683426, 0.0712927994126864, 0.053867752512870806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 257.89473684210526, 101, 1209, 103.0, 1139.0, 1209.0, 1209.0, 0.08397159108486876, 11.949235962104504, 0.048226694016361205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 663.7368421052632, 102, 1395, 908.0, 1302.0, 1395.0, 1395.0, 0.1150978028435215, 54.522697646401376, 0.062459015338296675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 228.8947368421053, 100, 807, 103.0, 804.0, 807.0, 807.0, 0.08397159108486876, 3.9175492200586035, 0.04830869752328002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 479.10526315789474, 101, 905, 606.0, 819.0, 905.0, 905.0, 0.1150978028435215, 17.826576764176718, 0.06257141553638605], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 338.8, 105, 900, 369.0, 659.4000000000001, 900.0, 900.0, 0.0883158173628897, 0.017973648767994347, 0.059630425903029236], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cd8f47c8-f059-411c-813d-db06ca2d54d5", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f4d7bff-8667-4283-a449-3ff4e1842ff0", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 261.1333333333333, 204, 609, 208.0, 489.00000000000006, 609.0, 609.0, 0.07138404138370825, 0.11063132194916504, 0.1605443821354298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 444.8695652173913, 119, 1206, 375.0, 807.2, 1131.199999999999, 1206.0, 0.10153225414847547, 0.062366980331436596, 0.04590765006908608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 114.26315789473685, 101, 307, 103.0, 108.0, 307.0, 307.0, 0.11509571117034165, 0.08553499628967773, 0.057772651896050395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 157.4736842105263, 101, 309, 104.0, 308.0, 309.0, 309.0, 0.11509850008480942, 0.12178339446679105, 0.06055449459642832], "isController": false}, {"data": ["login", 23, 0, 0.0, 2545.130434782609, 1432, 4783, 2643.0, 3678.6000000000004, 4594.599999999998, 4783.0, 0.10298937866060075, 48.34962581691847, 0.22221515180858303], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/63677b1e-aef3-426b-8835-e51d9770472d", 3, 0, 0.0, 373.3333333333333, 196, 543, 381.0, 543.0, 543.0, 543.0, 0.07197524051726206, 0.03256692197883928, 0.0461559973369161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f862484-a1f3-4eb7-ac6a-73cd5620fa8a", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 119.05263157894737, 103, 309, 106.0, 126.0, 309.0, 309.0, 0.08844737613875997, 0.07160436994046095, 0.03144027823682483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2f52b4d-380e-452a-b55e-45f8df0ff1d3", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=972582bf-3813-4b9c-9701-61b22df7fc16", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/918ed4bf-2ea2-4ded-a7ef-2dddfd58d4fb", 3, 0, 0.0, 309.3333333333333, 198, 467, 263.0, 467.0, 467.0, 467.0, 0.037284680967413185, 0.03071859620069101, 0.023909772625587234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 779.263157894737, 205, 1499, 1013.0, 1406.0, 1499.0, 1499.0, 0.11502463948856413, 72.51047211371397, 0.24320356674758753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa3143df-78cd-4b5d-b846-35af7ca7590a", 3, 0, 0.0, 790.0, 199, 1645, 526.0, 1645.0, 1645.0, 1645.0, 0.026006900497598698, 0.026083092588900254, 0.016677602207118957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63ebb4e0-6380-40e9-8736-6de89a55aedb", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12b9568d-e7ff-4f48-a46d-4194fbac3fc9", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 321.625, 206, 435, 404.5, 418.90000000000003, 435.0, 435.0, 0.10483210483210482, 0.16246928746928746, 0.23576986076986076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, 43.75, 683.0000000000001, 101, 1405, 905.0, 1330.1000000000001, 1405.0, 1405.0, 0.16530804120302928, 111.26266366141813, 0.2574160189949271], "isController": false}, {"data": ["register", 25, 10, 40.0, 854.7199999999999, 124, 1844, 850.0, 1466.2000000000003, 1755.4999999999998, 1844.0, 0.1029331840115944, 0.03192537035359607, 0.04644055763023106], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 394.7894736842105, 206, 1514, 208.0, 1256.0, 1514.0, 1514.0, 0.08393301262087459, 15.964235011330956, 0.18537651548784959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 137.23076923076923, 103, 316, 106.0, 312.4, 316.0, 316.0, 0.09105809506465123, 0.07069451716445092, 0.03236830723001275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c869a6c-f881-42bf-946d-2a557865ec51", 3, 0, 0.0, 899.3333333333334, 243, 2065, 390.0, 2065.0, 2065.0, 2065.0, 0.05802595694473995, 0.026255234424866058, 0.03721065598344326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=138065a0-1b89-4397-b958-ae9cd3ad9e11", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 0.9217554209183673, 3.5176179846938775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 11, 0, 0.0, 382.90909090909093, 206, 610, 408.0, 592.2, 610.0, 610.0, 0.10764367984812456, 0.16682667960837272, 0.24209315887717858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 166.72727272727272, 103, 393, 105.0, 375.6000000000001, 393.0, 393.0, 0.0671480981827283, 0.04990205343462522, 0.033705197720627286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 139.63636363636365, 102, 303, 103.0, 302.8, 303.0, 303.0, 0.0672314105149926, 0.017989654766707004, 0.03834291380933172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 139.27272727272728, 101, 304, 102.0, 304.0, 304.0, 304.0, 0.06723182143228228, 0.018121076870419833, 0.039524957521712825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 157.72727272727272, 101, 305, 103.0, 304.8, 305.0, 305.0, 0.06714891798675335, 0.018098731801117113, 0.039541794478527605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 107.33333333333333, 105, 112, 105.0, 112.0, 112.0, 112.0, 0.22554695135704084, 0.06651872979475228, 0.13942501973535823], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1212.6000000000006, 805, 2066, 1115.0, 1632.2, 1727.1999999999998, 2066.0, 0.2405191715645116, 287.7445471843951, 0.47493141103851805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, 40.0, 854.7199999999999, 124, 1844, 850.0, 1466.2000000000003, 1755.4999999999998, 1844.0, 0.10073455638516059, 0.031243452253834965, 0.04544859868158613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 191.88888888888889, 102, 305, 105.0, 305.0, 305.0, 305.0, 0.04155258941886395, 0.011199721366803176, 0.024468956464428676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 147.22222222222226, 101, 303, 103.0, 303.0, 303.0, 303.0, 0.041591378569349004, 0.01121017625501985, 0.024451181541746192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 211.23076923076923, 101, 1107, 103.0, 787.7999999999997, 1107.0, 1107.0, 0.0937937403500671, 6.515318197518795, 0.054520429900001444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 172.38461538461536, 101, 600, 104.0, 483.5999999999999, 600.0, 600.0, 0.0937937403500671, 2.1447567720884257, 0.054612025349562054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 124.33333333333331, 101, 305, 102.0, 305.0, 305.0, 305.0, 0.04155258941886395, 0.011118563965594457, 0.02369796115294585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 110.69230769230768, 102, 179, 103.0, 157.79999999999998, 179.0, 179.0, 0.0937423383665758, 0.06966593700875409, 0.047054259687910126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 173.22222222222223, 103, 329, 104.0, 329.0, 329.0, 329.0, 0.04159080196308585, 0.030908789349519857, 0.020876633016627077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 134.23076923076923, 101, 314, 103.0, 308.8, 314.0, 314.0, 0.09379306364220111, 0.03593334018744183, 0.05288542185234085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 107.0, 103, 116, 107.0, 116.0, 116.0, 116.0, 0.039696016725255044, 0.031245106914605046, 0.014110693445305505], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 579.3333333333334, 103, 2367, 445.0, 1684.2000000000003, 2367.0, 2367.0, 0.08977735216662677, 0.01778012404237491, 0.0610906826071343], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1325.9130434782605, 728, 3479, 1221.0, 2170.4000000000015, 3309.9999999999977, 3479.0, 0.10191782764365984, 0.05275043813587862, 0.04687821955094119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 366.2222222222222, 206, 633, 213.0, 633.0, 633.0, 633.0, 0.04153226364680963, 0.06436689688231141, 0.09340703435410408], "isController": false}, {"data": ["addBook", 58, 13, 22.413793103448278, 1024.8275862068965, 518, 2542, 829.5, 1813.4, 2010.7499999999998, 2542.0, 0.2804072673828333, 82.10967546333674, 1.0193516140943328], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 202.4, 101, 706, 106.0, 411.4, 413.59999999999997, 706.0, 0.24170193317600736, 0.17962419057318516, 0.11683833683801137], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 670.4909090909091, 501, 931, 609.0, 855.9999999999999, 913.2, 931.0, 0.24161592732192905, 71.04310503648401, 0.1215158228230405], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 134.6, 100, 452, 104.0, 304.6, 311.0, 452.0, 0.24238684941166103, 0.42891110462297827, 0.11787954199903046], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1008.8363636363636, 701, 1511, 1001.0, 1256.1999999999998, 1322.2, 1511.0, 0.24130533021537598, 217.1269602973211, 0.1211239645807649], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 11, 0, 0.0, 108.81818181818181, 104, 121, 107.0, 119.4, 121.0, 121.0, 0.10488576986155078, 0.07835704486727182, 0.03728361350547313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 13, 7.60233918128655, 164.8187134502923, 102, 1117, 107.0, 310.0, 364.20000000000005, 986.6800000000002, 0.6931580035428075, 1.5266387005111532, 0.3321896711857055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 107.9090909090909, 102, 121, 107.0, 119.80000000000001, 121.0, 121.0, 0.07077459578054728, 0.054808842240208974, 0.025158157093866415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f4d7bff-8667-4283-a449-3ff4e1842ff0", 3, 0, 0.0, 389.3333333333333, 214, 610, 344.0, 610.0, 610.0, 610.0, 0.02660352762776344, 0.026681467650110407, 0.017060204891501948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b44b7bc0-a6d4-427c-a34c-bdf95b8635e7", 3, 0, 0.0, 387.3333333333333, 197, 615, 350.0, 615.0, 615.0, 615.0, 0.02222436234600369, 0.02626844390570944, 0.01425195111381096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 119.3125, 103, 317, 105.0, 178.40000000000015, 317.0, 317.0, 0.10403391505630835, 0.08442596036307837, 0.03698080574267211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa3143df-78cd-4b5d-b846-35af7ca7590a", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f862484-a1f3-4eb7-ac6a-73cd5620fa8a", 3, 0, 0.0, 1053.6666666666665, 327, 2367, 467.0, 2367.0, 2367.0, 2367.0, 0.01909332179248105, 0.02256765997021442, 0.012244089821350152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 344.09090909090907, 207, 698, 209.0, 680.6, 698.0, 698.0, 0.0670233119264937, 0.10387304299545459, 0.1507369993815576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=918ed4bf-2ea2-4ded-a7ef-2dddfd58d4fb", 1, 0, 0.0, 900.0, 900, 900, 900.0, 900.0, 900.0, 900.0, 1.1111111111111112, 0.2007378472222222, 0.7660590277777778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 338.23076923076917, 205, 1210, 210.0, 890.7999999999997, 1210.0, 1210.0, 0.09367141508686222, 8.754280513463465, 0.20882561489879886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 109.73333333333333, 104, 163, 106.0, 130.60000000000002, 163.0, 163.0, 0.07128430557205655, 0.05910192913151954, 0.025339342996316978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63677b1e-aef3-426b-8835-e51d9770472d", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 0.8770100121359223, 3.3468598300970878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 119.4736842105263, 103, 305, 107.0, 129.0, 305.0, 305.0, 0.11315922694380752, 0.08785311076203806, 0.040224568952681575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c869a6c-f881-42bf-946d-2a557865ec51", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 11, 0, 0.0, 121.00000000000001, 100, 308, 103.0, 267.20000000000016, 308.0, 308.0, 0.10796274303885676, 0.08023403071540039, 0.05419223625192615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 11, 0, 0.0, 194.8181818181818, 101, 307, 116.0, 306.4, 307.0, 307.0, 0.10775123179249073, 0.028831872569475055, 0.061451874381654864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 11, 0, 0.0, 223.54545454545456, 101, 416, 301.0, 394.80000000000007, 416.0, 416.0, 0.10775228728718923, 0.029042608682875223, 0.06334655951844523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12b9568d-e7ff-4f48-a46d-4194fbac3fc9", 3, 0, 0.0, 442.0, 381, 531, 414.0, 531.0, 531.0, 531.0, 0.027896337210924205, 0.027978064761346837, 0.017889252703620014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 11, 0, 0.0, 205.8181818181818, 101, 410, 107.0, 390.20000000000005, 410.0, 410.0, 0.10795744513798923, 0.029097905134848664, 0.06357259708809328], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 27.027027027027028, 0.7598784194528876], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.303951367781155], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.108108108108109, 0.22796352583586627], "isController": false}, {"data": ["401/Unauthorized", 20, 54.054054054054056, 1.5197568389057752], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 37, "401/Unauthorized", 20, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
