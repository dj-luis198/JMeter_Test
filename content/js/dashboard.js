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

    var data = {"OkPercent": 98.56169568508706, "KoPercent": 1.4383043149129446};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8198697068403908, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38181818181818183, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0da18d1-c92b-4b2c-a951-597f110894e9"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc6414e2-98d1-4cbf-9917-cb13b7196cf6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b00556bb-cf7e-4fb8-acd5-ea7da7e8d931"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c4285e6-5b86-434f-95f8-8835e67cad0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/269d00ef-f248-4a31-926e-bc0892bcec30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73697eda-531a-4715-b7ae-95bb9ef7e2f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e30ce29-6a7a-48d4-a680-7951e240b2f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea631095-5e23-44cd-8472-596da2703ace"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fdc56283-1734-47ae-910c-eb0f7847d1b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4fbbdffb-88b6-4c9e-b63a-bd480460fba0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e5c84ae-c430-419a-bf0d-39a740de00ab"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc0a037c-961a-4cd5-b31b-b850ccbe009c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c58a41a2-3a6c-41ec-8d34-652180d1146b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/215a905f-c899-4ecc-90d3-c64466f05321"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc6414e2-98d1-4cbf-9917-cb13b7196cf6"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ff2aac3-6929-4f19-b418-476e2ff90737"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea631095-5e23-44cd-8472-596da2703ace"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdc56283-1734-47ae-910c-eb0f7847d1b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d0da18d1-c92b-4b2c-a951-597f110894e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4818181818181818, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49f222e5-8b39-4144-8374-666438067bf0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b00556bb-cf7e-4fb8-acd5-ea7da7e8d931"], "isController": false}, {"data": [0.4112903225806452, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c4285e6-5b86-434f-95f8-8835e67cad0b"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e30ce29-6a7a-48d4-a680-7951e240b2f4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.946927374301676, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4fbbdffb-88b6-4c9e-b63a-bd480460fba0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/73697eda-531a-4715-b7ae-95bb9ef7e2f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=215a905f-c899-4ecc-90d3-c64466f05321"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc0a037c-961a-4cd5-b31b-b850ccbe009c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c58a41a2-3a6c-41ec-8d34-652180d1146b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 19, 1.4383043149129446, 303.81529144587404, 77, 2674, 95.0, 851.8, 1030.0, 1580.0, 5.122517750435279, 717.7369282610003, 3.744031737264475], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1384.636363636364, 969, 3004, 1345.0, 1669.6, 1911.1999999999966, 3004.0, 0.2549211366701738, 306.75514035436356, 1.2534452374358642], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0da18d1-c92b-4b2c-a951-597f110894e9", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 497.7692307692307, 85, 1228, 433.0, 1027.1999999999998, 1228.0, 1228.0, 0.08693558741707683, 0.016470218709875882, 0.058769031788331906], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 497.7692307692307, 85, 1228, 433.0, 1027.1999999999998, 1228.0, 1228.0, 0.08552012683292656, 0.01620205527889429, 0.057812171076435256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc6414e2-98d1-4cbf-9917-cb13b7196cf6", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b00556bb-cf7e-4fb8-acd5-ea7da7e8d931", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 99.5, 77, 237, 79.0, 236.3, 237.0, 237.0, 0.09564058269025004, 0.03456930729319218, 0.054043000155415945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 110.12500000000001, 79, 244, 81.0, 237.70000000000002, 244.0, 244.0, 0.09563943931378702, 0.07107579425565619, 0.04800651543680325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 172.43750000000003, 78, 465, 159.5, 306.10000000000014, 465.0, 465.0, 0.09564172609405168, 1.7817824741020138, 0.055806573575386605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 199.375, 77, 895, 159.5, 435.80000000000047, 895.0, 895.0, 0.0955509107196178, 5.397699173260675, 0.05566027172290236], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 355.53846153846155, 79, 2378, 187.0, 1537.5999999999992, 2378.0, 2378.0, 0.08818461788926725, 0.1998793926962786, 0.05700335313530234], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c4285e6-5b86-434f-95f8-8835e67cad0b", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/269d00ef-f248-4a31-926e-bc0892bcec30", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.7357970910138248, 1.3748379896313365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 83.26666666666667, 79, 103, 81.0, 97.60000000000001, 103.0, 103.0, 0.09541317083410195, 0.07090763965307771, 0.047892939266336323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73697eda-531a-4715-b7ae-95bb9ef7e2f3", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 79.59999999999998, 77, 90, 79.0, 84.60000000000001, 90.0, 90.0, 0.09541620548834014, 0.03508533389310841, 0.053882823333715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 558.6666666666666, 467, 626, 583.0, 626.0, 626.0, 626.0, 0.06276741534244856, 18.45570418501742, 0.035797041562490195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 937.6666666666667, 852, 1011, 948.0, 1011.0, 1011.0, 1011.0, 0.062416128327559835, 56.16214198498892, 0.03553574493649159], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 132.16666666666666, 78, 238, 82.5, 238.0, 238.0, 238.0, 0.06291814349531259, 0.11133562110693988, 0.034838464220549065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e30ce29-6a7a-48d4-a680-7951e240b2f4", 3, 0, 0.0, 276.0, 181, 462, 185.0, 462.0, 462.0, 462.0, 0.03273286707182682, 0.027288044456688962, 0.02099080342822228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 92.92307692307693, 79, 237, 81.0, 175.39999999999995, 237.0, 237.0, 0.06118251686048975, 0.0454686477840163, 0.030710755533488013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea631095-5e23-44cd-8472-596da2703ace", 3, 0, 0.0, 354.6666666666667, 176, 550, 338.0, 550.0, 550.0, 550.0, 0.05848409232688709, 0.037599636180208985, 0.037504447227854024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 91.92307692307692, 78, 243, 79.0, 178.19999999999993, 243.0, 243.0, 0.06118366866690199, 0.02344025767737381, 0.03449854394634663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 173.84615384615384, 78, 820, 80.0, 591.5999999999998, 820.0, 820.0, 0.06118395662528121, 4.250101813927822, 0.03556501324867984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 157.53846153846155, 77, 620, 81.0, 467.59999999999985, 620.0, 620.0, 0.06118338071123326, 1.3990642619637041, 0.03562442787656018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdc56283-1734-47ae-910c-eb0f7847d1b9", 3, 0, 0.0, 321.0, 221, 372, 370.0, 372.0, 372.0, 372.0, 0.030384977667041416, 0.030671815021320124, 0.019485158204450386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 82.16666666666666, 78, 86, 82.0, 86.0, 86.0, 86.0, 0.0630179286006869, 0.04683265982922141, 0.03538604389198727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 589.1764705882352, 79, 1156, 762.0, 1048.0, 1156.0, 1156.0, 0.08446113793994316, 44.71424460380273, 0.04538427644130447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 172.53333333333333, 79, 843, 81.0, 477.60000000000025, 843.0, 843.0, 0.09532343240615408, 5.742125936949904, 0.05549362842290558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4fbbdffb-88b6-4c9e-b63a-bd480460fba0", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 433.2941176470588, 78, 707, 622.0, 703.8, 707.0, 707.0, 0.08446155757048814, 14.617904608123213, 0.04546698391504161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 144.13333333333335, 77, 633, 80.0, 445.8000000000001, 633.0, 633.0, 0.09532161512944676, 1.892493998709981, 0.055585657989222305], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 448.6923076923077, 85, 945, 429.0, 782.5999999999999, 945.0, 945.0, 0.08551731396695084, 0.016201522372644987, 0.058491221729949486], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 280.53846153846155, 160, 901, 164.0, 732.5999999999999, 901.0, 901.0, 0.0611592021076402, 5.71577583976289, 0.1363447747106699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e5c84ae-c430-419a-bf0d-39a740de00ab", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 626.1818181818182, 138, 1580, 606.5, 1064.8, 1505.599999999999, 1580.0, 0.0963315205492648, 0.059172389087390205, 0.043556146498349234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 104.17647058823529, 79, 237, 82.0, 235.4, 237.0, 237.0, 0.08445987907332608, 0.06276754685039175, 0.04239490023797813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc0a037c-961a-4cd5-b31b-b850ccbe009c", 3, 0, 0.0, 485.66666666666663, 160, 962, 335.0, 962.0, 962.0, 962.0, 0.018761960749978112, 0.025864877531301206, 0.012031595923651328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c58a41a2-3a6c-41ec-8d34-652180d1146b", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 127.52941176470588, 78, 240, 81.0, 238.4, 240.0, 240.0, 0.08446071831356787, 0.09722104053120824, 0.04399642656637371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/215a905f-c899-4ecc-90d3-c64466f05321", 3, 0, 0.0, 252.33333333333334, 178, 367, 212.0, 367.0, 367.0, 367.0, 0.01829915457905845, 0.021628981209818106, 0.011734809414305058], "isController": false}, {"data": ["login", 22, 0, 0.0, 2468.0, 1527, 3270, 2442.0, 3198.2, 3264.0, 3270.0, 0.09522078236857368, 31.198205101778033, 0.18673045647544603], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 93.73333333333332, 78, 236, 83.0, 149.60000000000005, 236.0, 236.0, 0.09634839579920994, 0.07800080089604008, 0.03424884381925041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 703.8235294117648, 166, 1239, 842.0, 1134.1999999999998, 1239.0, 1239.0, 0.0844259038537942, 59.46724868550109, 0.17716927238528007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 340.625, 160, 976, 317.0, 631.6000000000004, 976.0, 976.0, 0.09550471256066041, 7.279815237553049, 0.21326510093654308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 785.3749999999999, 79, 1098, 984.0, 1098.0, 1098.0, 1098.0, 0.08314625426124553, 74.60943183825975, 0.15438692304294505], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1036.5217391304348, 149, 1819, 1030.0, 1564.6000000000001, 1780.9999999999995, 1819.0, 0.09178961819509683, 0.028777791302335046, 0.041412894146615954], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dc6414e2-98d1-4cbf-9917-cb13b7196cf6", 3, 0, 0.0, 277.6666666666667, 187, 440, 206.0, 440.0, 440.0, 440.0, 0.04275818819303896, 0.027489395078532538, 0.02741980167327043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 273.3333333333333, 160, 924, 175.0, 610.8000000000002, 924.0, 924.0, 0.09526954931151872, 7.736172716547685, 0.21263840879210913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 101.5, 81, 241, 85.0, 224.8000000000003, 240.9, 241.0, 0.11436086571175343, 0.08878602367269921, 0.040651713983474856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ff2aac3-6929-4f19-b418-476e2ff90737", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea631095-5e23-44cd-8472-596da2703ace", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 227.8125, 161, 405, 166.5, 351.80000000000007, 405.0, 405.0, 0.12356166499343578, 0.19149644760213141, 0.2778930805467604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdc56283-1734-47ae-910c-eb0f7847d1b9", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 103.5, 79, 240, 81.0, 237.0, 240.0, 240.0, 0.06637776534511697, 0.049329569753548845, 0.033318526745498164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0da18d1-c92b-4b2c-a951-597f110894e9", 3, 0, 0.0, 269.0, 179, 408, 220.0, 408.0, 408.0, 408.0, 0.02708754695174805, 0.02716690499945825, 0.017370594887676973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 113.92857142857143, 78, 238, 80.5, 237.5, 238.0, 238.0, 0.06638059789952823, 0.03200493113012968, 0.037061265735757805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 192.64285714285714, 78, 806, 80.0, 790.0, 806.0, 806.0, 0.06638091264271896, 8.548144609040133, 0.038209771981565076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 175.78571428571428, 78, 716, 80.5, 592.5, 716.0, 716.0, 0.06638059789952823, 2.8036356712737964, 0.03827441561366492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 85.0, 85, 85, 85.0, 85.0, 85.0, 85.0, 11.76470588235294, 3.4696691176470584, 7.27251838235294], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 965.4181818181817, 625, 2674, 860.0, 1329.0, 1548.7999999999972, 2674.0, 0.25080485558200405, 300.0498011516503, 0.4952416191277463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1036.5217391304348, 149, 1819, 1030.0, 1564.6000000000001, 1780.9999999999995, 1819.0, 0.09159004296767669, 0.028715220672270916, 0.04132285141705725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 104.5, 78, 232, 79.5, 232.0, 232.0, 232.0, 0.046947254759277954, 0.012653752259336636, 0.027645697870941996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 80.0, 78, 85, 79.5, 85.0, 85.0, 85.0, 0.047003893489177356, 0.012669018167004834, 0.027633148320785905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 146.35, 77, 944, 80.0, 237.60000000000002, 908.6999999999995, 944.0, 0.10740850138288445, 4.859820367672726, 0.06268293010391772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 161.75000000000003, 77, 621, 82.5, 237.9, 601.8499999999997, 621.0, 0.10731628792960052, 1.6052064329407345, 0.06273391597134655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49f222e5-8b39-4144-8374-666438067bf0", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 80.9, 79, 83, 81.0, 82.9, 83.0, 83.0, 0.10740504051855153, 0.07981956624474386, 0.05391229572903856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 106.0, 78, 231, 80.5, 231.0, 231.0, 231.0, 0.04694762210294049, 0.012562156695513372, 0.026774815730583244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 95.45000000000002, 78, 235, 80.0, 218.20000000000033, 234.9, 235.0, 0.10740734773665866, 0.03680589679764993, 0.0608047260575596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 81.66666666666667, 79, 85, 80.5, 85.0, 85.0, 85.0, 0.04700352526439483, 0.03493133078730905, 0.023593566392479434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 137.66666666666669, 82, 246, 87.5, 246.0, 246.0, 246.0, 0.04662185788103656, 0.03669650141808151, 0.016572613543649715], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 493.38461538461536, 80, 985, 424.0, 975.8, 985.0, 985.0, 0.08453745009039004, 0.01583807095293215, 0.05753525374240789], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1321.5454545454547, 991, 1909, 1293.5, 1764.2, 1891.1499999999996, 1909.0, 0.0976818325111779, 0.0505579797176995, 0.04492982725855937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 188.83333333333334, 161, 318, 163.5, 318.0, 318.0, 318.0, 0.046917885880062245, 0.07271355946451054, 0.1055194249822103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b00556bb-cf7e-4fb8-acd5-ea7da7e8d931", 3, 0, 0.0, 522.0, 180, 962, 424.0, 962.0, 962.0, 962.0, 0.01767002986235047, 0.02435956265203588, 0.011331366806259903], "isController": false}, {"data": ["addBook", 62, 8, 12.903225806451612, 864.2258064516129, 409, 2458, 698.5, 1444.5, 1500.05, 2458.0, 0.29601619495053666, 92.5286534426206, 1.0764250703038463], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6c4285e6-5b86-434f-95f8-8835e67cad0b", 3, 0, 0.0, 361.6666666666667, 190, 495, 400.0, 495.0, 495.0, 495.0, 0.03004296143485184, 0.030130977923430505, 0.019265831388886108], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 176.81818181818187, 79, 1818, 82.0, 328.8, 415.4, 1818.0, 0.2517035755637016, 0.1870570517616962, 0.12167311514065654], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 508.30909090909097, 386, 795, 470.0, 633.8, 711.0, 795.0, 0.25156887498399105, 73.96960211809558, 0.1265214556804252], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 160.92727272727274, 78, 1999, 82.0, 240.2, 266.5999999999997, 1999.0, 0.25203114188436815, 0.44597698153757326, 0.12256983267423371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e30ce29-6a7a-48d4-a680-7951e240b2f4", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 763.7454545454547, 542, 1143, 778.0, 954.0, 1019.5999999999999, 1143.0, 0.2512218517334308, 226.04986379065227, 0.12610159354588224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 96.5, 81, 265, 83.0, 146.7000000000001, 265.0, 265.0, 0.12335494614785632, 0.0921548181670997, 0.0438488285134958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 8, 4.4692737430167595, 142.02793296089388, 79, 1978, 86.0, 239.0, 293.0, 878.7999999999844, 0.7565287586588731, 1.5803417560553998, 0.3662372494262638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 105.78571428571429, 79, 239, 82.0, 239.0, 239.0, 239.0, 0.06807318840227365, 0.05271683437793262, 0.02419789118987071], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fbbdffb-88b6-4c9e-b63a-bd480460fba0", 3, 0, 0.0, 990.0, 171, 2378, 421.0, 2378.0, 2378.0, 2378.0, 0.03170342502668371, 0.026244078724888247, 0.02033064690838767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 84.6875, 80, 102, 83.0, 98.5, 102.0, 102.0, 0.0934121108801756, 0.07580611732561127, 0.03320508628943743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73697eda-531a-4715-b7ae-95bb9ef7e2f3", 3, 0, 0.0, 488.0, 191, 985, 288.0, 985.0, 985.0, 985.0, 0.018441111384312762, 0.025422560778829602, 0.01182584291246619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=215a905f-c899-4ecc-90d3-c64466f05321", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 320.14285714285717, 161, 1041, 163.5, 948.5, 1041.0, 1041.0, 0.06635228322946041, 11.428199572264745, 0.14680257529799284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 275.40000000000003, 158, 1025, 241.5, 318.9, 989.6999999999995, 1025.0, 0.10726851454561058, 6.574454782633763, 0.2398771205644469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc0a037c-961a-4cd5-b31b-b850ccbe009c", 1, 0, 0.0, 945.0, 945, 945, 945.0, 945.0, 945.0, 945.0, 1.0582010582010584, 0.19117890211640212, 0.7295800264550265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c58a41a2-3a6c-41ec-8d34-652180d1146b", 3, 0, 0.0, 428.6666666666667, 277, 545, 464.0, 545.0, 545.0, 545.0, 0.08579027138322515, 0.03881786367925877, 0.055015245646143726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 86.07692307692308, 81, 96, 84.0, 95.2, 96.0, 96.0, 0.061173591830972665, 0.05071912057079667, 0.021745300221166063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 89.70588235294119, 81, 110, 85.0, 106.8, 110.0, 110.0, 0.0804079045700069, 0.06242605872378466, 0.02858249732761964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 81.00000000000001, 80, 83, 81.0, 83.0, 83.0, 83.0, 0.12363900501510713, 0.0918840652504849, 0.062060984939223705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 79.875, 78, 83, 80.0, 82.3, 83.0, 83.0, 0.12363996043521265, 0.033083348788328394, 0.07051341493570723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 136.0625, 79, 323, 81.0, 269.80000000000007, 323.0, 323.0, 0.12363996043521265, 0.03332483308605341, 0.07268677361523244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 120.06249999999999, 78, 248, 80.5, 242.4, 248.0, 248.0, 0.12363996043521265, 0.03332483308605341, 0.07280751576409496], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 36.8421052631579, 0.5299015897047691], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.0757002271006813], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.0757002271006813], "isController": false}, {"data": ["401/Unauthorized", 10, 52.63157894736842, 0.757002271006813], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 19, "401/Unauthorized", 10, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
