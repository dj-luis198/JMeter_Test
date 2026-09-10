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

    var data = {"OkPercent": 97.30134932533733, "KoPercent": 2.6986506746626686};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7742142398973701, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a62047af-4ef8-4623-a9d7-a931951c46a8"], "isController": false}, {"data": [0.2542372881355932, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/39e0da19-6eff-4824-8ac4-f31667e90180"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19fc4d03-7785-468c-ab9d-04ac66fad3a8"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5be757e3-e607-4117-8d0f-ced0a4cc8a86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d328fea4-a614-46cd-b98c-8424d64c5793"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea9c6102-684f-41bc-bfc8-41d1f4d89fed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef3a6d77-b254-4ca6-b320-f0b16f012299"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/340886d3-98e5-4e55-bafe-7faf0a2b34f3"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05126603-8e01-4ef6-baf2-43472fde306b"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=867c0c8e-d3a1-4189-bc0c-c1d6b0a55472"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b3aa5dc7-9229-4d16-8251-1fb5c9221754"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3deb9902-5cfa-4d18-87a0-706f7c6207f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5be757e3-e607-4117-8d0f-ced0a4cc8a86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44b2c489-84d0-45e4-a011-2f70413fc44a"], "isController": false}, {"data": [0.28125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19fc4d03-7785-468c-ab9d-04ac66fad3a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3deb9902-5cfa-4d18-87a0-706f7c6207f9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea9c6102-684f-41bc-bfc8-41d1f4d89fed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44b2c489-84d0-45e4-a011-2f70413fc44a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4576271186440678, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a62047af-4ef8-4623-a9d7-a931951c46a8"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d328fea4-a614-46cd-b98c-8424d64c5793"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4ef9e56f-8f66-4e3b-abef-605837748716"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3aa5dc7-9229-4d16-8251-1fb5c9221754"], "isController": false}, {"data": [0.3148148148148148, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6864406779661016, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef3a6d77-b254-4ca6-b320-f0b16f012299"], "isController": false}, {"data": [0.9011976047904192, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/867c0c8e-d3a1-4189-bc0c-c1d6b0a55472"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/05126603-8e01-4ef6-baf2-43472fde306b"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ef9e56f-8f66-4e3b-abef-605837748716"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=340886d3-98e5-4e55-bafe-7faf0a2b34f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1334, 36, 2.6986506746626686, 338.1476761619191, 83, 2831, 101.5, 925.5, 1179.25, 1760.5500000000006, 5.243380919439029, 774.5558893026088, 3.8413456885081914], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a62047af-4ef8-4623-a9d7-a931951c46a8", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1481.3389830508468, 1022, 2133, 1457.0, 1946.0, 2000.0, 2133.0, 0.2605477685629245, 313.52655803563545, 1.2811113424944578], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/39e0da19-6eff-4824-8ac4-f31667e90180", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.49974325117370894, 0.9337710289514867], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 612.375, 87, 1375, 615.5, 1218.9, 1375.0, 1375.0, 0.08618739293909784, 0.01741738635384234, 0.05780720587205482], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 612.375, 87, 1375, 615.5, 1218.9, 1375.0, 1375.0, 0.08615769011232809, 0.017411383786738177, 0.05778728373073568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 129.25000000000003, 84, 263, 88.0, 256.0, 263.0, 263.0, 0.09789525208027411, 0.0445738879711209, 0.054803177006852666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 119.43750000000003, 85, 256, 89.5, 255.3, 256.0, 256.0, 0.09779891320957695, 0.07268063764891412, 0.04909047010715093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 225.12499999999997, 84, 683, 172.0, 678.1, 683.0, 683.0, 0.09790064308484928, 3.6213438316476063, 0.056598809283428475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19fc4d03-7785-468c-ab9d-04ac66fad3a8", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 0.9661179812834224, 3.6869151069518717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 251.0, 84, 973, 90.0, 966.0, 973.0, 973.0, 0.09789764800900659, 11.034147636536625, 0.056501474583323136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5be757e3-e607-4117-8d0f-ced0a4cc8a86", 1, 0, 0.0, 1137.0, 1137, 1137, 1137.0, 1137.0, 1137.0, 1137.0, 0.8795074758135445, 0.15889539357959542, 0.6063791776605101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d328fea4-a614-46cd-b98c-8424d64c5793", 3, 0, 0.0, 399.0, 308, 464, 425.0, 464.0, 464.0, 464.0, 0.08236553825879252, 0.037268261126211455, 0.052819046344342854], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 305.4117647058824, 84, 1224, 200.0, 716.7999999999995, 1224.0, 1224.0, 0.085152422836878, 0.1304728041318961, 0.055030144583805014], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ea9c6102-684f-41bc-bfc8-41d1f4d89fed", 3, 0, 0.0, 323.6666666666667, 196, 576, 199.0, 576.0, 576.0, 576.0, 0.04136504653567735, 0.02621671406411582, 0.026526413305756634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 107.55555555555556, 85, 263, 88.5, 259.4, 263.0, 263.0, 0.09796078303319238, 0.07280093348462832, 0.04917172117095789], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 631.5555555555555, 500, 720, 669.0, 720.0, 720.0, 720.0, 0.04913575663605691, 14.447543911670289, 0.028022736206501208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 96.05555555555556, 84, 252, 87.0, 107.10000000000022, 252.0, 252.0, 0.09796024990748199, 0.04255998704747807, 0.05495382942943597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 828.0, 585, 1029, 821.0, 1029.0, 1029.0, 1029.0, 0.049090998347269724, 44.17216660564383, 0.027949269566853757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 204.0, 85, 276, 252.0, 276.0, 276.0, 276.0, 0.04929454035579704, 0.08722822961396898, 0.027294926154039962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 89.00000000000001, 85, 103, 87.0, 103.0, 103.0, 103.0, 0.05450944527554524, 0.040509460795595635, 0.02736118639807642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 89.99999999999999, 85, 96, 89.0, 96.0, 96.0, 96.0, 0.054514728062364855, 0.01458694871981247, 0.031090430848067455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 108.33333333333333, 83, 260, 91.0, 260.0, 260.0, 260.0, 0.054515388482715595, 0.014693600801981937, 0.03204908580722147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 108.66666666666667, 84, 265, 90.0, 265.0, 265.0, 265.0, 0.05451406765801508, 0.014693244798449377, 0.032101545700960056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 106.1111111111111, 84, 253, 88.0, 253.0, 253.0, 253.0, 0.049294270362641515, 0.03663373022067402, 0.027679888143084835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 495.3499999999999, 84, 1273, 90.0, 1189.9000000000003, 1269.3999999999999, 1273.0, 0.09486181005819773, 38.42463307007205, 0.05209988474290078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 200.94444444444446, 83, 957, 87.5, 625.8000000000005, 957.0, 957.0, 0.09796131616470563, 9.817443730067593, 0.05665514487390201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 335.95, 84, 715, 90.5, 701.6, 714.35, 715.0, 0.09486181005819773, 12.565697361774484, 0.05219252322928574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 186.55555555555557, 84, 697, 88.0, 522.4000000000003, 697.0, 697.0, 0.09796238244514106, 3.2239360536942705, 0.056751427937783004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef3a6d77-b254-4ca6-b320-f0b16f012299", 3, 0, 0.0, 502.33333333333337, 208, 936, 363.0, 936.0, 936.0, 936.0, 0.018698578908002993, 0.022101087244452755, 0.011990950666915981], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 441.75, 88, 1288, 417.0, 1182.3000000000002, 1288.0, 1288.0, 0.08634040785050158, 0.017448308739807787, 0.058373577744140995], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 200.44444444444446, 173, 352, 182.0, 352.0, 352.0, 352.0, 0.05447974866675948, 0.08443296985756572, 0.12252623162065145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/340886d3-98e5-4e55-bafe-7faf0a2b34f3", 3, 0, 0.0, 297.6666666666667, 195, 401, 297.0, 401.0, 401.0, 401.0, 0.07293414047115454, 0.03300079923662266, 0.04677091690370262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 680.1739130434783, 107, 1853, 624.0, 1461.8000000000002, 1790.599999999999, 1853.0, 0.09907515496646523, 0.06085768796279944, 0.044796676513157614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 90.60000000000001, 85, 129, 89.0, 93.7, 127.24999999999997, 129.0, 0.0948604602629532, 0.07049688501963611, 0.04761550446792768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 121.39999999999999, 84, 261, 88.0, 257.9, 260.85, 261.0, 0.0948622599984822, 0.08949846619583365, 0.05051600622770737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05126603-8e01-4ef6-baf2-43472fde306b", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["login", 23, 0, 0.0, 3048.043478260869, 1749, 4566, 2959.0, 4222.6, 4509.799999999999, 4566.0, 0.09748406347484063, 45.76508814228223, 0.21033660213998712], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=867c0c8e-d3a1-4189-bc0c-c1d6b0a55472", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3aa5dc7-9229-4d16-8251-1fb5c9221754", 3, 0, 0.0, 736.0, 210, 1552, 446.0, 1552.0, 1552.0, 1552.0, 0.043839780216568515, 0.02818475453376394, 0.0281134007248177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 92.77777777777779, 86, 127, 90.5, 102.70000000000005, 127.0, 127.0, 0.09386831318641205, 0.07599299964017146, 0.0333672519529824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 587.9, 172, 1363, 184.5, 1279.0000000000002, 1359.35, 1363.0, 0.09482133290347664, 51.12850072212371, 0.20233798293690114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3deb9902-5cfa-4d18-87a0-706f7c6207f9", 3, 0, 0.0, 772.6666666666667, 324, 1488, 506.0, 1488.0, 1488.0, 1488.0, 0.01773531811248921, 0.02096254559454698, 0.01137323459687622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5be757e3-e607-4117-8d0f-ced0a4cc8a86", 3, 0, 0.0, 268.6666666666667, 191, 406, 209.0, 406.0, 406.0, 406.0, 0.03055207601356512, 0.030641584048761113, 0.019592314370678154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44b2c489-84d0-45e4-a011-2f70413fc44a", 3, 0, 0.0, 290.6666666666667, 190, 455, 227.0, 455.0, 455.0, 455.0, 0.08448800270361607, 0.03822862101498253, 0.05418013194209755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, 43.75, 569.0625, 84, 1283, 792.0, 1096.8000000000002, 1283.0, 1283.0, 0.0854659765289062, 57.52395426034539, 0.13308675898327538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 405.0, 173, 1059, 354.0, 1054.8, 1059.0, 1059.0, 0.09774335039769326, 14.749426235078868, 0.21670101683629212], "isController": false}, {"data": ["register", 24, 9, 37.5, 1134.541666666666, 275, 2024, 1158.5, 1736.5, 1967.0, 2024.0, 0.0982982122012656, 0.030574199791116297, 0.044349388707992876], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/19fc4d03-7785-468c-ab9d-04ac66fad3a8", 3, 0, 0.0, 297.6666666666667, 200, 415, 278.0, 415.0, 415.0, 415.0, 0.0677659814772984, 0.03145647447481364, 0.04345670036141856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 98.42105263157896, 88, 137, 96.0, 104.0, 137.0, 137.0, 0.08923329810966303, 0.06927780468474815, 0.03171964893741928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 341.0555555555556, 175, 1043, 181.5, 809.9000000000003, 1043.0, 1043.0, 0.09791229234434666, 13.150122322370784, 0.21742350942133837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 290.73333333333335, 172, 840, 180.0, 655.2, 840.0, 840.0, 0.10915918319821852, 8.864052584707528, 0.24363960140524257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3deb9902-5cfa-4d18-87a0-706f7c6207f9", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea9c6102-684f-41bc-bfc8-41d1f4d89fed", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 108.66666666666667, 85, 263, 90.0, 263.0, 263.0, 263.0, 0.04372731645458918, 0.032496570138615594, 0.02194906314224496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 106.33333333333333, 84, 252, 87.0, 252.0, 252.0, 252.0, 0.04372859121055317, 0.011700814445011297, 0.024938962174768604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44b2c489-84d0-45e4-a011-2f70413fc44a", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 87.22222222222223, 84, 93, 87.0, 93.0, 93.0, 93.0, 0.04372816628364032, 0.01178610731863743, 0.025707379006593235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 126.33333333333333, 85, 263, 90.0, 263.0, 263.0, 263.0, 0.043693350357557253, 0.011776723338560353, 0.025729580337506858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 91.33333333333333, 88, 94, 92.0, 94.0, 94.0, 94.0, 0.0356938892061679, 0.0105269087307253, 0.022064679558109652], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1046.8474576271183, 668, 1756, 1009.0, 1491.0, 1617.0, 1756.0, 0.2743573527770545, 328.2267759697835, 0.541748600893754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a62047af-4ef8-4623-a9d7-a931951c46a8", 3, 0, 0.0, 590.6666666666667, 184, 1179, 409.0, 1179.0, 1179.0, 1179.0, 0.016682422287716176, 0.022998065881666016, 0.010698037730078406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1134.541666666666, 275, 2024, 1158.5, 1736.5, 1967.0, 2024.0, 0.09626376270982492, 0.029941414475663317, 0.04343150231634679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 112.71428571428572, 85, 259, 88.0, 259.0, 259.0, 259.0, 0.044686175374087124, 0.012044320706296921, 0.026314222412670448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 89.57142857142857, 85, 94, 89.0, 94.0, 94.0, 94.0, 0.044685604851579956, 0.012044166932652409, 0.026270248164698373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 104.15789473684211, 84, 254, 86.0, 254.0, 254.0, 254.0, 0.08895380956393907, 0.02397583148403045, 0.052295110700675114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d328fea4-a614-46cd-b98c-8424d64c5793", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.5018446180555556, 1.9151475694444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 105.26315789473684, 85, 265, 87.0, 258.0, 265.0, 265.0, 0.08895297664750276, 0.023975606987022228, 0.05238148917816813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 97.94736842105264, 85, 255, 89.0, 96.0, 255.0, 255.0, 0.0889521437466643, 0.066106036514855, 0.04464980652908735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 113.00000000000001, 86, 261, 88.0, 261.0, 261.0, 261.0, 0.044685604851579956, 0.011956890360676667, 0.025484759016916693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 105.05263157894738, 84, 262, 87.0, 256.0, 262.0, 262.0, 0.08895422602800654, 0.023802205011400186, 0.05073170703159748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 112.57142857142857, 85, 257, 87.0, 257.0, 257.0, 257.0, 0.044684463850268745, 0.03320788768560011, 0.02242950626859193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 94.14285714285714, 89, 102, 93.0, 102.0, 102.0, 102.0, 0.04194505198190371, 0.033015343649818736, 0.014910155196692334], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 533.2499999999999, 84, 1488, 450.5, 1271.7000000000003, 1488.0, 1488.0, 0.08642482120865112, 0.017022271608906077, 0.05881044504731759], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1740.3478260869565, 1137, 2831, 1618.0, 2650.2000000000003, 2814.2, 2831.0, 0.10073580939032936, 0.05213865134460407, 0.046334537326997195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 228.42857142857142, 173, 519, 180.0, 519.0, 519.0, 519.0, 0.04465937655510329, 0.06921331112592669, 0.10043998457656532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ef9e56f-8f66-4e3b-abef-605837748716", 3, 0, 0.0, 577.3333333333334, 441, 690, 601.0, 690.0, 690.0, 690.0, 0.02407028523288001, 0.024140803646648213, 0.015435697235928912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3aa5dc7-9229-4d16-8251-1fb5c9221754", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["addBook", 54, 14, 25.925925925925927, 909.3888888888893, 445, 1873, 789.0, 1584.0, 1827.75, 1873.0, 0.25189739379492754, 79.15117575440938, 0.914139359317638], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 175.677966101695, 85, 448, 93.0, 354.0, 362.0, 448.0, 0.275555431010728, 0.20478289355387108, 0.13320306479522495], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 547.8813559322034, 417, 843, 509.0, 698.0, 783.0, 843.0, 0.2755116812283151, 81.00958212991543, 0.13856300374275615], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 121.57627118644066, 84, 340, 91.0, 261.0, 264.0, 340.0, 0.27594593330527106, 0.48829495229409287, 0.1342002683457275], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 869.4915254237287, 580, 1397, 841.0, 1128.0, 1227.0, 1397.0, 0.27485581716032015, 247.31574742584718, 0.13796473634805131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 127.39999999999998, 88, 365, 95.0, 309.8, 365.0, 365.0, 0.11168276139350304, 0.08343487545510725, 0.03969973158909679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef3a6d77-b254-4ca6-b320-f0b16f012299", 1, 0, 0.0, 1288.0, 1288, 1288, 1288.0, 1288.0, 1288.0, 1288.0, 0.7763975155279502, 0.14026712927018634, 0.5352896933229814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 14, 8.383233532934131, 146.9041916167664, 85, 651, 94.0, 277.2000000000003, 425.5999999999998, 576.1999999999992, 0.7244113615463362, 1.6870454806707962, 0.34199936180226603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 114.77777777777777, 89, 259, 94.0, 259.0, 259.0, 259.0, 0.04568249649767527, 0.035377167697906726, 0.016238699926908004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 92.37499999999999, 86, 106, 91.5, 102.5, 106.0, 106.0, 0.09776604585227551, 0.07933943760082124, 0.03475277411155106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/867c0c8e-d3a1-4189-bc0c-c1d6b0a55472", 3, 0, 0.0, 440.0, 294, 590, 436.0, 590.0, 590.0, 590.0, 0.05135315565141478, 0.03301513099334121, 0.032931548383231486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 236.88888888888889, 176, 526, 181.0, 526.0, 526.0, 526.0, 0.04367384373498712, 0.06768592774162553, 0.09822349816569856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05126603-8e01-4ef6-baf2-43472fde306b", 3, 0, 0.0, 641.3333333333334, 227, 1224, 473.0, 1224.0, 1224.0, 1224.0, 0.026724391351986957, 0.02680268546727598, 0.017137711902153095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 232.26315789473682, 172, 512, 180.0, 356.0, 512.0, 512.0, 0.08891467934558796, 0.13780038683735166, 0.19997119778602448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ef9e56f-8f66-4e3b-abef-605837748716", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 111.33333333333333, 89, 253, 93.0, 253.0, 253.0, 253.0, 0.05379493371268724, 0.04460146359577292, 0.01912241784318179], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 94.99999999999999, 87, 116, 92.0, 105.9, 115.5, 116.0, 0.0908401349884406, 0.07052530011309596, 0.032290829234172244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=340886d3-98e5-4e55-bafe-7faf0a2b34f3", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 100.86666666666667, 85, 266, 89.0, 164.00000000000006, 266.0, 266.0, 0.10922833820006261, 0.08117457555688248, 0.05482750569807831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 144.06666666666663, 83, 265, 89.0, 263.8, 265.0, 265.0, 0.10923390620448586, 0.040166217593941164, 0.06168586604281969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 142.8, 84, 754, 88.0, 454.00000000000017, 754.0, 754.0, 0.10923390620448586, 6.580069875564376, 0.06359177013545005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 159.86666666666665, 84, 673, 87.0, 425.8000000000002, 673.0, 673.0, 0.10923390620448586, 2.1687055099402857, 0.06369844387197786], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 25.0, 0.6746626686656672], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.11111111111111, 0.29985007496251875], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.333333333333334, 0.22488755622188905], "isController": false}, {"data": ["401/Unauthorized", 20, 55.55555555555556, 1.4992503748125936], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1334, 36, "401/Unauthorized", 20, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
