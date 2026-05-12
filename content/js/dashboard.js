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

    var data = {"OkPercent": 98.61751152073732, "KoPercent": 1.3824884792626728};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8229235880398671, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.375, 500, 1500, "see books"], "isController": true}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee88b432-642b-4cd0-b528-a9225859cb60"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c74e0758-e05d-495f-bdf0-ef8b877d832d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=081f7b31-7c6d-4eb8-b4be-4e619b374d68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c682b933-a0b3-4a6f-a30c-810c4c3d33e1"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0890f7b-4303-495e-9972-031ae15e978e"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/77661b83-d736-4a00-a2df-403fbb5af4f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b07f765f-47e9-4b40-bc83-f6ff38b5d81a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1bebbff5-201c-41f6-81f0-de32f7a63692"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0890f7b-4303-495e-9972-031ae15e978e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b42032dc-26c6-43c9-9ec1-321054dd9f45"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1bd186f-dc54-4db2-bccd-505bb62b4ff1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3440b3e8-2aa6-483b-9f31-13c7c76b0614"], "isController": false}, {"data": [0.35, 500, 1500, "register"], "isController": true}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c74e0758-e05d-495f-bdf0-ef8b877d832d"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/081f7b31-7c6d-4eb8-b4be-4e619b374d68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b07f765f-47e9-4b40-bc83-f6ff38b5d81a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4eae5c42-dbef-41dd-bdac-c4da3b3d5433"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4d9290b-0d33-4798-8e00-e3478e72d37f"], "isController": false}, {"data": [0.39344262295081966, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b42032dc-26c6-43c9-9ec1-321054dd9f45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8839285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9353932584269663, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77661b83-d736-4a00-a2df-403fbb5af4f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8ef6930-d6de-4703-b21d-5ccb2a5f94e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1bebbff5-201c-41f6-81f0-de32f7a63692"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c682b933-a0b3-4a6f-a30c-810c4c3d33e1"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81af6dfb-f78d-40ed-be31-217c23115d2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee88b432-642b-4cd0-b528-a9225859cb60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/676e607f-6be1-4054-94fe-c142e811020b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3440b3e8-2aa6-483b-9f31-13c7c76b0614"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a1bd186f-dc54-4db2-bccd-505bb62b4ff1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1302, 18, 1.3824884792626728, 302.5890937019965, 78, 3600, 96.5, 852.0, 1058.0, 1500.0400000000009, 5.058157152513927, 700.4350882882975, 3.7022161730884284], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1397.4999999999998, 963, 3952, 1303.5, 1700.8000000000002, 1860.499999999999, 3952.0, 0.25286390954696725, 304.2801723298587, 1.2433298677431446], "isController": true}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 529.0833333333333, 98, 935, 523.0, 889.1000000000001, 935.0, 935.0, 0.0584726932522512, 0.011120661143433517, 0.0395099912169142], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 529.0833333333333, 98, 935, 523.0, 889.1000000000001, 935.0, 935.0, 0.05810715928625039, 0.011051141866208267, 0.03926299996368303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 112.78571428571429, 79, 236, 80.0, 235.0, 236.0, 236.0, 0.09234828496042216, 0.034617723449868076, 0.05211339462401056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 80.57142857142857, 79, 86, 80.0, 84.0, 86.0, 86.0, 0.09234828496042216, 0.06862992661609499, 0.046354510224274406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee88b432-642b-4cd0-b528-a9225859cb60", 3, 0, 0.0, 339.3333333333333, 189, 579, 250.0, 579.0, 579.0, 579.0, 0.019492164150011693, 0.02303907813434, 0.012499857869636408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 152.8571428571429, 78, 718, 80.0, 515.5, 718.0, 718.0, 0.09234767580688781, 1.9626328940772158, 0.05381364981101708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 185.92857142857142, 78, 947, 79.5, 592.5, 947.0, 947.0, 0.09234828496042216, 5.958480633657652, 0.05372382091029024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c74e0758-e05d-495f-bdf0-ef8b877d832d", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=081f7b31-7c6d-4eb8-b4be-4e619b374d68", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c682b933-a0b3-4a6f-a30c-810c4c3d33e1", 2, 0, 0.0, 267.0, 169, 365, 267.0, 365.0, 365.0, 365.0, 0.012266476945156582, 0.024245458336911056, 0.0076246216558517235], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 327.58333333333326, 80, 1410, 232.0, 1086.300000000001, 1410.0, 1410.0, 0.05799959400284198, 0.12492002399733203, 0.03749111126013785], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0890f7b-4303-495e-9972-031ae15e978e", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77661b83-d736-4a00-a2df-403fbb5af4f8", 2, 0, 0.0, 604.5, 212, 997, 604.5, 997.0, 997.0, 997.0, 0.050983991026817575, 0.04505909363209952, 0.03169073270368104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 95.86363636363637, 79, 240, 81.0, 190.4999999999999, 239.1, 240.0, 0.11561118906107949, 0.08591808093308739, 0.05803139763417466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 109.5909090909091, 78, 236, 80.5, 236.0, 236.0, 236.0, 0.11561301171895529, 0.03882848218508592, 0.06549419635819013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 503.5, 464, 618, 466.0, 618.0, 618.0, 618.0, 0.021899088997897685, 6.439059283571304, 0.012489324194113525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 855.5, 695, 1007, 860.0, 1007.0, 1007.0, 1007.0, 0.021871548396268713, 19.680057693043754, 0.01245225851076627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 159.5, 79, 235, 162.0, 235.0, 235.0, 235.0, 0.021944261575597982, 0.03883105661619486, 0.012150777649769585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 92.07692307692307, 78, 234, 81.0, 172.79999999999995, 234.0, 234.0, 0.08761820032216537, 0.06511469770035923, 0.04398022945858692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 115.23076923076923, 78, 235, 79.0, 235.0, 235.0, 235.0, 0.087527352297593, 0.023420404814004377, 0.049917943107221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 115.23076923076923, 78, 237, 80.0, 235.8, 237.0, 237.0, 0.08761938140716727, 0.023616161394900553, 0.051510612897572944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b07f765f-47e9-4b40-bc83-f6ff38b5d81a", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 127.9230769230769, 78, 238, 80.0, 238.0, 238.0, 238.0, 0.087527352297593, 0.02359135667396061, 0.05154198577680525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 80.5, 79, 81, 81.0, 81.0, 81.0, 81.0, 0.02194510432153967, 0.016308812879581726, 0.01232269041492706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 157.40909090909096, 79, 942, 81.0, 265.59999999999997, 842.2499999999986, 942.0, 0.1156136192843517, 4.758351318586466, 0.06751654719926008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 591.5624999999998, 78, 1081, 921.0, 1036.2, 1081.0, 1081.0, 0.07743983892513503, 39.20441474387983, 0.04178272559193077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 133.86363636363635, 78, 634, 80.0, 237.0, 574.4499999999991, 634.0, 0.11561422685613386, 1.5749461835480953, 0.06762980653010174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 377.31250000000006, 78, 709, 464.0, 662.8000000000001, 709.0, 709.0, 0.0774402137349899, 12.817253422494447, 0.041858553029606366], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 426.41666666666663, 82, 639, 443.0, 626.7, 639.0, 639.0, 0.05825864898193011, 0.01107995301682704, 0.039820507226499914], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1bebbff5-201c-41f6-81f0-de32f7a63692", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 233.00000000000003, 159, 473, 162.0, 411.79999999999995, 473.0, 473.0, 0.08747964415972437, 0.13557636257957284, 0.19674377001938012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 603.9000000000001, 110, 1298, 506.0, 1109.9, 1288.6, 1298.0, 0.08639756704451203, 0.05307038053808405, 0.03906452494297761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 80.5625, 79, 85, 80.0, 84.3, 85.0, 85.0, 0.07743796493028163, 0.05754911260932063, 0.03887022849039527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 141.49999999999997, 78, 244, 84.0, 242.6, 244.0, 244.0, 0.07743946411890829, 0.08614573199653458, 0.040506360320986576], "isController": false}, {"data": ["login", 20, 0, 0.0, 2554.05, 1726, 4779, 2453.5, 3170.7000000000003, 4699.199999999999, 4779.0, 0.08741105924721596, 21.036068944380343, 0.16087390845439764], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 91.13636363636364, 82, 138, 85.0, 126.19999999999999, 137.39999999999998, 138.0, 0.12073516741028553, 0.09774360721008467, 0.04291757904037494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0890f7b-4303-495e-9972-031ae15e978e", 3, 0, 0.0, 306.3333333333333, 189, 493, 237.0, 493.0, 493.0, 493.0, 0.030275507114744173, 0.030364204889494397, 0.019414957361994147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b42032dc-26c6-43c9-9ec1-321054dd9f45", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.0323660714285714, 3.9397321428571432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 683.2499999999999, 158, 1165, 1004.5, 1116.7, 1165.0, 1165.0, 0.07740836784456401, 52.14410312276242, 0.16295255169427567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 651.1666666666667, 80, 1087, 858.0, 1087.0, 1087.0, 1087.0, 0.03279261947444362, 26.15717382957676, 0.05653844695520528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 306.7857142857142, 160, 1028, 314.5, 711.0, 1028.0, 1028.0, 0.09229896954793283, 8.020088984035574, 0.20589572029456554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1bd186f-dc54-4db2-bccd-505bb62b4ff1", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.28272936228482004, 1.0789563771517996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3440b3e8-2aa6-483b-9f31-13c7c76b0614", 3, 0, 0.0, 693.3333333333334, 270, 1410, 400.0, 1410.0, 1410.0, 1410.0, 0.017845352178025232, 0.024601258617817992, 0.01144379680687165], "isController": false}, {"data": ["register", 20, 4, 20.0, 1122.6500000000003, 370, 1973, 1123.0, 1619.3000000000004, 1956.1499999999996, 1973.0, 0.09150009836260574, 0.029022687449389007, 0.04128227094094126], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 283.0, 159, 1026, 171.5, 477.3, 944.0999999999988, 1026.0, 0.11556139198949442, 6.455120444845699, 0.258556303348654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 22, 0, 0.0, 86.95454545454544, 81, 102, 84.5, 99.0, 101.55, 102.0, 0.11140594300066843, 0.08649191863821426, 0.03960133130101886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 271.94117647058823, 162, 930, 165.0, 565.1999999999997, 930.0, 930.0, 0.08049623561721672, 5.782208112363275, 0.1798264077962972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 119.25, 78, 240, 80.5, 240.0, 240.0, 240.0, 0.04184428694719774, 0.031097170280095194, 0.021003870596542615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 138.0, 78, 240, 79.5, 240.0, 240.0, 240.0, 0.04184538131603724, 0.011196908672455277, 0.02386494403180249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 137.625, 78, 237, 80.0, 237.0, 237.0, 237.0, 0.04181148247837562, 0.011269501136749679, 0.024580578566388792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 118.5, 78, 236, 79.5, 236.0, 236.0, 236.0, 0.04184538131603724, 0.011278637932838162, 0.0246413720054399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 3.596608231707317, 7.53858612804878], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 984.3571428571428, 620, 3600, 848.5, 1354.7000000000003, 1468.8999999999994, 3600.0, 0.2432392518655582, 290.998708877364, 0.48030250710171746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 4, 20.0, 1122.6500000000003, 370, 1973, 1123.0, 1619.3000000000004, 1956.1499999999996, 1973.0, 0.08772583920730932, 0.027825539623568422, 0.03957943136111026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 79.2, 78, 80, 79.0, 80.0, 80.0, 80.0, 0.02434689455359969, 0.006562248922649915, 0.014337087320137316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 79.6, 78, 81, 80.0, 81.0, 81.0, 81.0, 0.02434677599992209, 0.006562216968729001, 0.014313241359329197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c74e0758-e05d-495f-bdf0-ef8b877d832d", 3, 0, 0.0, 398.0, 216, 671, 307.0, 671.0, 671.0, 671.0, 0.03801076971808679, 0.024437262432689264, 0.024375395945517898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 22, 0, 0.0, 214.81818181818178, 78, 942, 80.0, 855.3, 929.3999999999999, 942.0, 0.11635840504360796, 14.304289749287305, 0.06704244040598506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 22, 0, 0.0, 164.36363636363637, 78, 466, 81.0, 460.2, 465.4, 466.0, 0.11635902046860952, 4.692551452504364, 0.0671564268524885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 79.0, 78, 80, 79.0, 80.0, 80.0, 80.0, 0.02434677599992209, 0.006514664671854153, 0.013885270687455566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 22, 0, 0.0, 95.54545454545453, 79, 239, 81.0, 193.1999999999999, 238.7, 239.0, 0.11635594340870024, 0.08647155559962978, 0.058405229406320244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/081f7b31-7c6d-4eb8-b4be-4e619b374d68", 3, 0, 0.0, 870.6666666666666, 331, 1314, 967.0, 1314.0, 1314.0, 1314.0, 0.027426063902728896, 0.02750641369931892, 0.017587677698039036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 79.6, 79, 80, 80.0, 80.0, 80.0, 80.0, 0.02434677599992209, 0.0180936489608796, 0.012220940296835892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 22, 0, 0.0, 109.0, 78, 243, 80.0, 237.1, 242.25, 243.0, 0.11635717421313461, 0.054965955609738035, 0.06502738029755703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 84.2, 83, 86, 84.0, 86.0, 86.0, 86.0, 0.026039903548197255, 0.020496252206881824, 0.009256371964398243], "isController": false}, {"data": ["deleteAccount", 10, 1, 10.0, 708.8, 80, 1502, 625.0, 1465.3000000000002, 1502.0, 1502.0, 0.06064281382656155, 0.011483048438447543, 0.041271461870830806], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1338.35, 905, 2541, 1253.0, 2116.4000000000015, 2522.6, 2541.0, 0.08799215110012187, 0.04554281258111776, 0.04047295231265371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 160.8, 160, 162, 161.0, 162.0, 162.0, 162.0, 0.02433717698481847, 0.03771787097158878, 0.05473488144144232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b07f765f-47e9-4b40-bc83-f6ff38b5d81a", 3, 0, 0.0, 562.0, 244, 926, 516.0, 926.0, 926.0, 926.0, 0.021833266620574214, 0.021897231268876678, 0.014001150795094792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4eae5c42-dbef-41dd-bdac-c4da3b3d5433", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4d9290b-0d33-4798-8e00-e3478e72d37f", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["addBook", 61, 10, 16.39344262295082, 875.3770491803276, 414, 2296, 727.0, 1469.0, 1571.3, 2296.0, 0.2772324025596277, 82.59460466971849, 1.0090373573502944], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b42032dc-26c6-43c9-9ec1-321054dd9f45", 3, 0, 0.0, 790.3333333333334, 298, 1135, 938.0, 1135.0, 1135.0, 1135.0, 0.06451057973507655, 0.029189357367108208, 0.041369089218131774], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 149.51785714285717, 79, 333, 82.0, 323.0, 323.6, 333.0, 0.2441895957790084, 0.18147293201936074, 0.11804086905332925], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 485.78571428571433, 384, 727, 465.5, 643.6000000000001, 704.2, 727.0, 0.24386207857584546, 71.70354808437628, 0.1226454789712504], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 128.46428571428567, 78, 386, 84.0, 244.3, 248.75, 386.0, 0.24449450760552557, 0.4326406716613402, 0.11890455545659348], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 833.1607142857142, 539, 3361, 749.0, 1088.7, 1310.5499999999993, 3361.0, 0.2436276151901818, 219.21655639979292, 0.12228964278100922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 93.82352941176472, 81, 239, 84.0, 125.39999999999989, 239.0, 239.0, 0.0795876423799514, 0.05945756486392854, 0.02829091975224835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 10, 5.617977528089888, 148.1123595505618, 79, 1807, 89.0, 270.1, 304.2499999999999, 885.0700000000093, 0.7243958619903793, 1.5025475308478686, 0.3496074832534327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 89.87500000000001, 81, 105, 87.5, 105.0, 105.0, 105.0, 0.04262211235188816, 0.03300716317875714, 0.015150829000085244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77661b83-d736-4a00-a2df-403fbb5af4f8", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8ef6930-d6de-4703-b21d-5ccb2a5f94e0", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 90.0, 80, 135, 84.5, 118.5, 135.0, 135.0, 0.09356037317223129, 0.07592643565051191, 0.033257788901066586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bebbff5-201c-41f6-81f0-de32f7a63692", 3, 0, 0.0, 658.6666666666666, 282, 949, 745.0, 949.0, 949.0, 949.0, 0.028981867011872907, 0.02416099004472868, 0.0185853769574836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 297.25, 160, 475, 315.5, 475.0, 475.0, 475.0, 0.04179313443284104, 0.0647711956493347, 0.09399373886604777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c682b933-a0b3-4a6f-a30c-810c4c3d33e1", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 22, 0, 0.0, 333.0, 159, 1022, 167.0, 935.0, 1009.3999999999999, 1022.0, 0.11630611770179111, 19.129656250991246, 0.2575172741017996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81af6dfb-f78d-40ed-be31-217c23115d2d", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee88b432-642b-4cd0-b528-a9225859cb60", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 99.00000000000001, 81, 234, 89.0, 181.99999999999994, 234.0, 234.0, 0.0846519502507, 0.07018506422152765, 0.03009112294067852], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 84.8125, 79, 98, 82.5, 96.6, 98.0, 98.0, 0.07668968955055049, 0.05953935858660902, 0.027260788082422244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/676e607f-6be1-4054-94fe-c142e811020b", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3440b3e8-2aa6-483b-9f31-13c7c76b0614", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 90.35294117647058, 79, 235, 81.0, 115.7999999999999, 235.0, 235.0, 0.08058667096462245, 0.05988911777741961, 0.040450731324039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 116.70588235294117, 79, 239, 80.0, 238.2, 239.0, 239.0, 0.08058819904337068, 0.028683621396640893, 0.04556233082403804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 161.82352941176472, 79, 849, 80.0, 359.3999999999996, 849.0, 849.0, 0.08052788396405614, 4.282729884904338, 0.04693450773778226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1bd186f-dc54-4db2-bccd-505bb62b4ff1", 3, 0, 0.0, 906.6666666666667, 220, 1502, 998.0, 1502.0, 1502.0, 1502.0, 0.038875714341251026, 0.032409083472637976, 0.02493006420972152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 139.64705882352942, 78, 471, 81.0, 282.99999999999983, 471.0, 471.0, 0.08052826542116283, 1.413250704030203, 0.04701337094871771], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 22.22222222222222, 0.30721966205837176], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07680491551459294], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07680491551459294], "isController": false}, {"data": ["401/Unauthorized", 12, 66.66666666666667, 0.9216589861751152], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1302, 18, "401/Unauthorized", 12, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
