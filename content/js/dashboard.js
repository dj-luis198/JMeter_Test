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

    var data = {"OkPercent": 97.77070063694268, "KoPercent": 2.229299363057325};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8096532970768185, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36538461538461536, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6cb50999-39d8-4fca-ae8a-248b360e6904"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b660462-60db-41a7-b7d4-1d13771ae420"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b1cac00-cb4f-4e50-8db4-135b3d1c48f8"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d735a16-e297-4b4c-8c7b-63b07d2f0d98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b551f2cf-e2bd-4998-ae50-558126dd4289"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c3cc3004-48fc-4fe7-a0d7-356465a6542d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=030bc9ce-0294-4c35-bb00-6ec6373b3a73"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aaf32999-c825-4cee-af3d-c7b9c5000ee3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d281e46-91f4-468c-ab1e-cbed2ee4fe12"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f40acd3-7400-4b5d-8840-504fa7b5d0b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/605f4ca2-4d99-49b3-9047-2d78d7281878"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a21c087b-9847-424f-9d1f-b842edf67e55"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11b84499-e820-4aa3-b690-09d8eee0683e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d735a16-e297-4b4c-8c7b-63b07d2f0d98"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b1cac00-cb4f-4e50-8db4-135b3d1c48f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5d197ce-acc9-44c0-9e48-f757bd0f5a31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7eb6b263-aa25-4ffc-be69-388313def786"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3cc3004-48fc-4fe7-a0d7-356465a6542d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4807692307692308, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/855c8c05-adc5-4bf8-ae20-0cfb6e32e9cd"], "isController": false}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f40acd3-7400-4b5d-8840-504fa7b5d0b4"], "isController": false}, {"data": [0.3813559322033898, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cb50999-39d8-4fca-ae8a-248b360e6904"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/030bc9ce-0294-4c35-bb00-6ec6373b3a73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aaf32999-c825-4cee-af3d-c7b9c5000ee3"], "isController": false}, {"data": [0.8365384615384616, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9323529411764706, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b551f2cf-e2bd-4998-ae50-558126dd4289"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5d197ce-acc9-44c0-9e48-f757bd0f5a31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=855c8c05-adc5-4bf8-ae20-0cfb6e32e9cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/11b84499-e820-4aa3-b690-09d8eee0683e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b660462-60db-41a7-b7d4-1d13771ae420"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1256, 28, 2.229299363057325, 298.3869426751595, 77, 2878, 95.5, 799.3, 1031.3499999999988, 1531.0700000000031, 4.927789831333054, 650.9221153695254, 3.5958646510528443], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 1367.4423076923078, 974, 1923, 1359.5, 1591.7, 1719.5499999999988, 1923.0, 0.24350839401531293, 293.0230647009413, 1.1973288709639656], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6cb50999-39d8-4fca-ae8a-248b360e6904", 3, 0, 0.0, 257.0, 164, 416, 191.0, 416.0, 416.0, 416.0, 0.028511689792815053, 0.023769022643033644, 0.018283863571564342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b660462-60db-41a7-b7d4-1d13771ae420", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b1cac00-cb4f-4e50-8db4-135b3d1c48f8", 3, 0, 0.0, 372.0, 193, 656, 267.0, 656.0, 656.0, 656.0, 0.018857606215467008, 0.025996732526856376, 0.012092931069163414], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 497.8, 82, 1449, 442.0, 1114.2000000000003, 1449.0, 1449.0, 0.09080617724155048, 0.01848047591517492, 0.06085078010073432], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 497.8, 82, 1449, 442.0, 1114.2000000000003, 1449.0, 1449.0, 0.09042463408164741, 0.018402825920522777, 0.06059510147151022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 108.75000000000001, 77, 240, 80.0, 236.5, 240.0, 240.0, 0.10534771329619827, 0.028188743596834303, 0.06008111773923808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 80.25, 78, 82, 80.0, 81.3, 82.0, 82.0, 0.10534563243592023, 0.07828908816771024, 0.05287856940631152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 131.0625, 79, 279, 80.5, 250.30000000000004, 279.0, 279.0, 0.10534632604687912, 0.02839412694232289, 0.0620349947326837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d735a16-e297-4b4c-8c7b-63b07d2f0d98", 3, 0, 0.0, 443.3333333333333, 185, 678, 467.0, 678.0, 678.0, 678.0, 0.03353004291845493, 0.0279526171595583, 0.02150201319966023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 138.0625, 78, 239, 80.0, 237.6, 239.0, 239.0, 0.10534632604687912, 0.02839412694232289, 0.06193211746115354], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 205.13333333333333, 78, 378, 185.0, 356.40000000000003, 378.0, 378.0, 0.0903222698588564, 0.1835964784852353, 0.05837429510995231], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b551f2cf-e2bd-4998-ae50-558126dd4289", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 103.04545454545455, 79, 239, 81.0, 234.5, 238.54999999999998, 239.0, 0.12654805662450316, 0.09404596786254579, 0.06352119248534631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 101.77272727272728, 77, 250, 80.0, 236.7, 248.04999999999998, 250.0, 0.12643823492224046, 0.03383210582880263, 0.07210930585409028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 524.5, 391, 624, 541.5, 624.0, 624.0, 624.0, 0.034731568390799605, 10.21223430350181, 0.019807847597877903], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 807.75, 688, 917, 813.0, 917.0, 917.0, 917.0, 0.03459519299793294, 31.128815471402746, 0.019696286638471585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 119.25, 79, 234, 82.0, 234.0, 234.0, 234.0, 0.03480076561684357, 0.06158104228293022, 0.01926956455542022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 82.5, 78, 92, 80.5, 91.7, 92.0, 92.0, 0.06540507543385367, 0.04860670156754164, 0.032830282004883575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 119.41666666666669, 78, 237, 81.0, 237.0, 237.0, 237.0, 0.06540650140623977, 0.03387426553949463, 0.036386624642989515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 257.33333333333337, 78, 924, 163.0, 865.2000000000003, 924.0, 924.0, 0.06540650140623977, 9.823505069685178, 0.037515057121677894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 195.25000000000003, 79, 669, 82.0, 630.3000000000002, 669.0, 669.0, 0.06540685790905176, 3.219988983032371, 0.037579135484855586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3cc3004-48fc-4fe7-a0d7-356465a6542d", 3, 0, 0.0, 975.0, 173, 2344, 408.0, 2344.0, 2344.0, 2344.0, 0.021841055359794984, 0.025815388024549347, 0.014006145526951863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 86.25, 78, 106, 80.5, 106.0, 106.0, 106.0, 0.03484775885350873, 0.025897602038593894, 0.019567833340593282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 566.0000000000001, 79, 1081, 703.0, 1080.1, 1081.0, 1081.0, 0.09295840111550081, 46.480098268004234, 0.0502112544219795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 122.90909090909092, 77, 250, 80.5, 236.7, 248.04999999999998, 250.0, 0.12643823492224046, 0.03407905550638513, 0.07433185295233279], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 361.16666666666663, 78, 637, 465.5, 634.3, 637.0, 637.0, 0.09295696092709076, 15.195820454921037, 0.05030125478986562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 94.04545454545453, 77, 235, 80.0, 187.8999999999999, 234.54999999999998, 235.0, 0.12655388031454393, 0.03411022555352942, 0.07452342756803709], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 404.00000000000006, 82, 800, 412.0, 786.8, 800.0, 800.0, 0.09061308815445303, 0.018441179268933607, 0.06118153237303597], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=030bc9ce-0294-4c35-bb00-6ec6373b3a73", 1, 0, 0.0, 800.0, 800, 800, 800.0, 800.0, 800.0, 800.0, 1.25, 0.225830078125, 0.86181640625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 354.33333333333326, 158, 1005, 316.5, 949.5000000000002, 1005.0, 1005.0, 0.0653765690376569, 13.119951617933882, 0.144245568013424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aaf32999-c825-4cee-af3d-c7b9c5000ee3", 3, 0, 0.0, 317.6666666666667, 210, 422, 321.0, 422.0, 422.0, 422.0, 0.025294256517486763, 0.029896954887693502, 0.016220600696435196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d281e46-91f4-468c-ab1e-cbed2ee4fe12", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.8566042877906979, 3.4690679505813957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 634.05, 112, 1426, 615.0, 1031.5000000000002, 1406.6499999999996, 1426.0, 0.08982264518707811, 0.05517426154557826, 0.04061316867345426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 100.33333333333334, 79, 247, 81.5, 239.8, 247.0, 247.0, 0.09295552078330518, 0.06908120245712426, 0.04665931414318249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 151.61111111111114, 77, 248, 83.5, 245.3, 248.0, 248.0, 0.09295600082627557, 0.10243719014666391, 0.048676829425738484], "isController": false}, {"data": ["login", 20, 0, 0.0, 2676.0499999999997, 1748, 4291, 2557.5, 3591.900000000001, 4258.049999999999, 4291.0, 0.09066183136899365, 21.818389477561198, 0.16685672597461468], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 93.00000000000003, 81, 241, 83.0, 107.69999999999999, 221.49999999999972, 241.0, 0.1236205075183745, 0.10007949290305905, 0.04394322728192219], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f40acd3-7400-4b5d-8840-504fa7b5d0b4", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/605f4ca2-4d99-49b3-9047-2d78d7281878", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 1.1570142663043477, 2.1618829257246377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a21c087b-9847-424f-9d1f-b842edf67e55", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11b84499-e820-4aa3-b690-09d8eee0683e", 1, 0, 0.0, 778.0, 778, 778, 778.0, 778.0, 778.0, 778.0, 1.2853470437017993, 0.23221601863753213, 0.8861865359897172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d735a16-e297-4b4c-8c7b-63b07d2f0d98", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 673.0000000000001, 162, 1166, 791.5, 1161.5, 1166.0, 1166.0, 0.09291521486643438, 61.81894437991999, 0.19576114659956123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b1cac00-cb4f-4e50-8db4-135b3d1c48f8", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.29186439822294025, 1.113817649434572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5d197ce-acc9-44c0-9e48-f757bd0f5a31", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.009296438547486, 3.85169343575419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 261.625, 161, 360, 315.5, 332.0, 360.0, 360.0, 0.10528948026480305, 0.1631781300588305, 0.23679850883773576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, 60.0, 405.9, 78, 1024, 81.0, 1015.0, 1024.0, 1024.0, 0.06639268618169022, 31.78215294053207, 0.08627807373239764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7eb6b263-aa25-4ffc-be69-388313def786", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.9072043678977273, 1.6951127485795456], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 1053.75, 430, 2068, 1043.5, 1633.0, 1991.5, 2068.0, 0.0975173702815814, 0.03090272134411442, 0.04399709479501036], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3cc3004-48fc-4fe7-a0d7-356465a6542d", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 242.22727272727278, 161, 482, 166.5, 474.0, 480.79999999999995, 482.0, 0.12637504667260246, 0.19585663971623057, 0.2842204418818393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 100.36842105263159, 81, 242, 84.0, 235.0, 242.0, 242.0, 0.11184826311420885, 0.08683532146073832, 0.03975856227887893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 313.49999999999994, 164, 863, 316.0, 701.6000000000006, 863.0, 863.0, 0.16722174997561348, 16.908843352412873, 0.37252019725198926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 125.14285714285714, 80, 239, 81.0, 239.0, 239.0, 239.0, 0.046726164649653894, 0.03472520634608068, 0.0234543443651583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 157.42857142857144, 78, 314, 80.0, 314.0, 314.0, 314.0, 0.04670091400360264, 0.012496143004870239, 0.026634115017679635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 146.42857142857144, 77, 241, 79.0, 241.0, 241.0, 241.0, 0.046725852746812624, 0.012594077498164342, 0.027469690774981643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 148.28571428571428, 78, 250, 80.0, 250.0, 250.0, 250.0, 0.046774559985032146, 0.012607205620965695, 0.02754400358493592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 82.66666666666667, 82, 84, 82.0, 84.0, 84.0, 84.0, 0.1530143833520351, 0.04512728884015097, 0.09458799283382636], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 935.3269230769231, 628, 1574, 863.5, 1253.8, 1350.7499999999986, 1574.0, 0.25579095975719535, 306.01491519545874, 0.5050872271768057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 1053.75, 430, 2068, 1043.5, 1633.0, 1991.5, 2068.0, 0.0986671709655405, 0.03126708689288857, 0.04451585252546846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 80.4, 80, 81, 80.0, 81.0, 81.0, 81.0, 0.033063753529555685, 0.008911714818513055, 0.019470159549142656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 111.2, 80, 235, 80.0, 235.0, 235.0, 235.0, 0.033063753529555685, 0.008911714818513055, 0.019437870727336447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 96.31578947368422, 77, 237, 79.0, 237.0, 237.0, 237.0, 0.10953407662773403, 0.02952285659106894, 0.06439405676747645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 119.10526315789473, 79, 335, 81.0, 237.0, 335.0, 335.0, 0.10953407662773403, 0.02952285659106894, 0.06450102363918322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 110.0, 77, 234, 79.0, 234.0, 234.0, 234.0, 0.03306440946964687, 0.008847312690120354, 0.01885704602565798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 89.78947368421053, 79, 234, 81.0, 89.0, 234.0, 234.0, 0.10953407662773403, 0.08140178936885313, 0.05498097205728056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 80.4, 79, 81, 81.0, 81.0, 81.0, 81.0, 0.03306331625061994, 0.02457146842453298, 0.016596234914861962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 88.36842105263159, 78, 234, 80.0, 87.0, 234.0, 234.0, 0.10953533955955264, 0.029309260780583418, 0.06246937334255736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 86.2, 83, 92, 85.0, 92.0, 92.0, 92.0, 0.0322231387915034, 0.0253631346347185, 0.011454318867292224], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 400.80000000000007, 79, 693, 416.0, 670.8000000000001, 693.0, 693.0, 0.08706857520983526, 0.017243659231010344, 0.059247444537317596], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/855c8c05-adc5-4bf8-ae20-0cfb6e32e9cd", 3, 0, 0.0, 251.66666666666669, 169, 384, 202.0, 384.0, 384.0, 384.0, 0.02414739570337339, 0.02421814002672312, 0.015485146333217964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1459.6, 983, 2878, 1313.0, 2206.400000000001, 2846.8999999999996, 2878.0, 0.08898816012529533, 0.04605832506485012, 0.04093107755763096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 192.8, 160, 317, 162.0, 317.0, 317.0, 317.0, 0.03304561616855908, 0.05121425083935865, 0.07432036526971832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f40acd3-7400-4b5d-8840-504fa7b5d0b4", 3, 0, 0.0, 363.0, 222, 566, 301.0, 566.0, 566.0, 566.0, 0.05771117480714849, 0.025549218013581364, 0.03700879374026124], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 807.0508474576271, 404, 1623, 681.0, 1466.0, 1554.0, 1623.0, 0.2904629684330754, 77.65646403951527, 1.0589667518363168], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cb50999-39d8-4fca-ae8a-248b360e6904", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/030bc9ce-0294-4c35-bb00-6ec6373b3a73", 3, 0, 0.0, 832.6666666666666, 246, 1559, 693.0, 1559.0, 1559.0, 1559.0, 0.01730043943116155, 0.023850052405914444, 0.011094357317509197], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 154.76923076923083, 79, 473, 83.0, 324.4, 338.8999999999999, 473.0, 0.25648360971086404, 0.19060940135739018, 0.12398377617859152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aaf32999-c825-4cee-af3d-c7b9c5000ee3", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 509.63461538461536, 383, 720, 472.0, 653.0, 708.4, 720.0, 0.25627125326499434, 75.35225746636439, 0.12888642131979697], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 135.34615384615378, 78, 335, 85.0, 244.7, 273.99999999999955, 335.0, 0.2568395888590889, 0.45448567872330964, 0.12490831567561159], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 778.0769230769229, 545, 1248, 770.5, 933.0, 1028.2999999999986, 1248.0, 0.25625104717976016, 230.57514269364202, 0.12862601391640302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 84.16666666666666, 81, 89, 84.0, 88.4, 89.0, 89.0, 0.16509596202792873, 0.12333829194469285, 0.05868645525211529], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, 6.470588235294118, 134.69411764705873, 79, 508, 86.0, 263.9, 305.24999999999994, 464.6899999999995, 0.7775800793131681, 1.5790932587237623, 0.376591216146679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 87.42857142857143, 81, 112, 82.0, 112.0, 112.0, 112.0, 0.04736033774686576, 0.036676511555922414, 0.01683512005845619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b551f2cf-e2bd-4998-ae50-558126dd4289", 3, 0, 0.0, 332.3333333333333, 180, 439, 378.0, 439.0, 439.0, 439.0, 0.02462346616325358, 0.02910410339803833, 0.01579043891328436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5d197ce-acc9-44c0-9e48-f757bd0f5a31", 3, 0, 0.0, 259.6666666666667, 173, 354, 252.0, 354.0, 354.0, 354.0, 0.12015860936436096, 0.05436864160692114, 0.07705483738534867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 84.5, 80, 102, 83.0, 92.20000000000002, 102.0, 102.0, 0.10224426154082102, 0.08297361459025612, 0.03634463984458872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 330.2857142857143, 159, 553, 320.0, 553.0, 553.0, 553.0, 0.04662843135295724, 0.07226496148158511, 0.10486843496666068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=855c8c05-adc5-4bf8-ae20-0cfb6e32e9cd", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 218.31578947368425, 160, 472, 165.0, 415.0, 472.0, 472.0, 0.1094823214861937, 0.16967621503768496, 0.24622830701435947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11b84499-e820-4aa3-b690-09d8eee0683e", 3, 0, 0.0, 511.3333333333333, 193, 786, 555.0, 786.0, 786.0, 786.0, 0.01874297138573035, 0.025838699159690115, 0.012019418499312758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 84.66666666666667, 80, 96, 84.5, 93.00000000000001, 96.0, 96.0, 0.06361997667267522, 0.05274742206552858, 0.02261491358286502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 97.05555555555556, 80, 241, 87.0, 121.30000000000018, 241.0, 241.0, 0.08782672762492132, 0.06818578951348872, 0.031219657085421248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b660462-60db-41a7-b7d4-1d13771ae420", 3, 0, 0.0, 308.6666666666667, 172, 412, 342.0, 412.0, 412.0, 412.0, 0.059389476184820045, 0.03852969597537316, 0.03808504820445817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 81.66666666666667, 79, 88, 81.0, 86.80000000000001, 88.0, 88.0, 0.16741071428571427, 0.1244136265345982, 0.08403233119419642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 133.16666666666666, 78, 245, 81.0, 242.3, 245.0, 245.0, 0.1674083787893584, 0.06574811491190134, 0.09430345035644035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 218.0, 80, 781, 234.0, 619.0000000000006, 781.0, 781.0, 0.1674083787893584, 12.594224432729733, 0.09721892830736178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 176.33333333333334, 78, 457, 158.5, 391.9000000000002, 457.0, 457.0, 0.16741071428571427, 4.143387930733817, 0.09738377162388392], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 17.857142857142858, 0.3980891719745223], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.23885350318471338], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.714285714285714, 0.23885350318471338], "isController": false}, {"data": ["401/Unauthorized", 17, 60.714285714285715, 1.3535031847133758], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1256, 28, "401/Unauthorized", 17, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
