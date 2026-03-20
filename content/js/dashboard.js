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

    var data = {"OkPercent": 98.54070660522274, "KoPercent": 1.4592933947772657};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7620621282220753, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/738a476b-824c-4954-aebc-9ec252ec58a7"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/34ffedcf-ec47-495e-8a0e-e44dce532c80"], "isController": false}, {"data": [0.026785714285714284, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4657b1fa-8223-4c51-bef4-5599f6449401"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a57a75b-b790-4913-8b45-b30cdfccbd79"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8e705770-d67d-4b05-8f4d-1b379fe1d9db"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ecab126-d1da-477e-8e79-a3aa874c40d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76d6e3c1-c520-4cdb-862d-97d2609130dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b125d6b-2e5c-41a8-854a-250083ecca7a"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b7e25ba-964d-44e3-a249-2c9eba1bf6bc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2113fb4b-2dbc-4098-8b42-973b55f17eb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a10e0b05-d660-4a27-b69e-7047a1da86c1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/32bf9368-4e37-40a6-b64f-ab8a21480a60"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/18f829ab-7cf4-4927-982d-fb56d4c32e03"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a5a09ca-97f9-4509-8882-238568459641"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a57a75b-b790-4913-8b45-b30cdfccbd79"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34ffedcf-ec47-495e-8a0e-e44dce532c80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e705770-d67d-4b05-8f4d-1b379fe1d9db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b7e25ba-964d-44e3-a249-2c9eba1bf6bc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4657b1fa-8223-4c51-bef4-5599f6449401"], "isController": false}, {"data": [0.288135593220339, 500, 1500, "addBook"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b125d6b-2e5c-41a8-854a-250083ecca7a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=738a476b-824c-4954-aebc-9ec252ec58a7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9310344827586207, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ecab126-d1da-477e-8e79-a3aa874c40d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2113fb4b-2dbc-4098-8b42-973b55f17eb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a5a09ca-97f9-4509-8882-238568459641"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19735f7a-a086-4e42-846b-75c936a18f2b"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32bf9368-4e37-40a6-b64f-ab8a21480a60"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18f829ab-7cf4-4927-982d-fb56d4c32e03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/407c49ea-1fdd-4a9a-be01-5471272c9092"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1302, 19, 1.4592933947772657, 395.8463901689709, 119, 3929, 142.0, 1003.7, 1163.6999999999998, 1740.7900000000002, 5.040104053761111, 716.4641955007297, 3.682451276816683], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/738a476b-824c-4954-aebc-9ec252ec58a7", 3, 0, 0.0, 310.0, 225, 458, 247.0, 458.0, 458.0, 458.0, 0.034078129792237004, 0.02230830697011348, 0.02185348818056865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34ffedcf-ec47-495e-8a0e-e44dce532c80", 3, 0, 0.0, 1888.0, 839, 3929, 896.0, 3929.0, 3929.0, 3929.0, 0.0645647261379533, 0.029213857204347358, 0.04140381200903906], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1851.1428571428569, 1464, 2426, 1893.5, 2186.2, 2296.2, 2426.0, 0.24652444554010863, 296.65263618824787, 1.2121587727484835], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4657b1fa-8223-4c51-bef4-5599f6449401", 3, 0, 0.0, 354.0, 227, 459, 376.0, 459.0, 459.0, 459.0, 0.01894441708028644, 0.026116408312178735, 0.012148600796928479], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a57a75b-b790-4913-8b45-b30cdfccbd79", 3, 0, 0.0, 329.0, 206, 567, 214.0, 567.0, 567.0, 567.0, 0.026970655926352127, 0.022484326115686133, 0.017295635473604718], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 505.38461538461536, 132, 789, 455.0, 783.0, 789.0, 789.0, 0.06961215321099444, 0.01318823996380168, 0.04705827574712582], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 505.38461538461536, 132, 789, 455.0, 783.0, 789.0, 789.0, 0.0673191445290249, 0.012753822303350421, 0.04550818672000414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 147.27777777777777, 119, 508, 125.5, 171.40000000000055, 508.0, 508.0, 0.10114632501685772, 0.02706454399865138, 0.05768501348617667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 154.44444444444446, 121, 377, 127.0, 369.8, 377.0, 377.0, 0.1011485985299737, 0.07517000339971679, 0.05077185512149071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 238.6111111111111, 124, 516, 129.0, 511.5, 516.0, 516.0, 0.1009319382296538, 0.027204311475961376, 0.059435506594219964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 244.61111111111111, 121, 503, 127.0, 396.8000000000002, 503.0, 503.0, 0.1010049997474875, 0.02722400383818999, 0.05937989242967527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e705770-d67d-4b05-8f4d-1b379fe1d9db", 3, 0, 0.0, 569.6666666666666, 284, 922, 503.0, 922.0, 922.0, 922.0, 0.018374021583350688, 0.02533007207209966, 0.011782819830469027], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 314.4615384615384, 129, 896, 247.0, 727.5999999999999, 896.0, 896.0, 0.06955107456410202, 0.14349611349932856, 0.04495845828005542], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1ecab126-d1da-477e-8e79-a3aa874c40d1", 3, 0, 0.0, 373.3333333333333, 283, 437, 400.0, 437.0, 437.0, 437.0, 0.045817615345846635, 0.02945631194923408, 0.02938173900759045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76d6e3c1-c520-4cdb-862d-97d2609130dd", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.7409186484918794, 1.3844076276102089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 127.68750000000003, 125, 132, 127.0, 130.6, 132.0, 132.0, 0.1046586166747341, 0.07777852274362565, 0.052533719698059894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 157.0, 120, 376, 126.0, 370.4, 376.0, 376.0, 0.10465245573528162, 0.0378266505654503, 0.059135280468581373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 778.4, 628, 896, 860.0, 896.0, 896.0, 896.0, 0.05529566592570474, 16.258761771064883, 0.03153580947325348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1073.2, 877, 1135, 1113.0, 1135.0, 1135.0, 1135.0, 0.05528527200353826, 49.74578492992592, 0.031475892166076956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 227.6, 126, 377, 129.0, 377.0, 377.0, 377.0, 0.0555926173004225, 0.09837287358238826, 0.030782240243495664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 178.79999999999998, 122, 386, 128.0, 381.8, 386.0, 386.0, 0.10059620014619981, 0.07475948077271295, 0.05049457702651045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 176.93333333333334, 123, 377, 127.0, 376.4, 377.0, 377.0, 0.10059282706081171, 0.026916440053381258, 0.057369346683119174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 162.20000000000002, 126, 389, 127.0, 384.8, 389.0, 389.0, 0.10041639331092933, 0.02706535600958642, 0.059033856223808065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 235.86666666666667, 120, 550, 128.0, 448.00000000000006, 550.0, 550.0, 0.10042782252395203, 0.027068436539658947, 0.059138649396428794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 179.2, 127, 379, 130.0, 379.0, 379.0, 379.0, 0.05574508885767164, 0.04142774669989074, 0.03130217391910273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 678.75, 120, 1162, 639.0, 1153.1, 1161.6, 1162.0, 0.08734921342033314, 39.31025956091734, 0.047598497156783104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 205.8125, 121, 1139, 127.0, 611.9000000000005, 1139.0, 1139.0, 0.1046593012683399, 5.912234846069062, 0.06096608711578589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 541.25, 123, 901, 626.0, 883.5, 900.15, 901.0, 0.08734730599071498, 12.853275496678618, 0.047682757860165695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 190.93749999999997, 125, 898, 127.0, 531.2000000000004, 898.0, 898.0, 0.10465314024828958, 1.9496629637442278, 0.06106469853354787], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 490.0, 133, 728, 506.0, 706.4, 728.0, 728.0, 0.06732646603379788, 0.012755209385309366, 0.046049239275670804], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7b125d6b-2e5c-41a8-854a-250083ecca7a", 3, 0, 0.0, 561.0, 229, 1037, 417.0, 1037.0, 1037.0, 1037.0, 0.021472436548949998, 0.029601487234636473, 0.013769759115049315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 436.06666666666666, 249, 758, 259.0, 757.4, 758.0, 758.0, 0.10033377703159176, 0.15549775795814075, 0.22565301611694905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b7e25ba-964d-44e3-a249-2c9eba1bf6bc", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 461.85714285714283, 166, 1282, 328.0, 893.6000000000001, 1245.3999999999994, 1282.0, 0.09666861538319899, 0.059379452222687666, 0.04370856340080189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 181.35000000000002, 120, 479, 128.0, 380.20000000000005, 474.0999999999999, 479.0, 0.08744163271016596, 0.06498347899651982, 0.043891600793970025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 187.54999999999998, 119, 378, 127.0, 376.9, 377.95, 378.0, 0.08744507356316814, 0.08906758957654723, 0.04619900859147848], "isController": false}, {"data": ["login", 21, 0, 0.0, 2535.380952380952, 1254, 4453, 2444.0, 3935.8, 4401.999999999999, 4453.0, 0.10058338362502514, 28.788957912739125, 0.19147046171365348], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2113fb4b-2dbc-4098-8b42-973b55f17eb4", 3, 0, 0.0, 801.3333333333334, 406, 1373, 625.0, 1373.0, 1373.0, 1373.0, 0.029855499382986348, 0.024889301406194022, 0.019145616466303094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 149.81249999999997, 127, 382, 129.0, 249.70000000000013, 382.0, 382.0, 0.10415988542412603, 0.0843247509927739, 0.0370255842718573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a10e0b05-d660-4a27-b69e-7047a1da86c1", 1, 0, 0.0, 927.0, 927, 927, 927.0, 927.0, 927.0, 927.0, 1.0787486515641855, 0.34448321197411, 0.6436674083063646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32bf9368-4e37-40a6-b64f-ab8a21480a60", 3, 0, 0.0, 932.3333333333334, 206, 1719, 872.0, 1719.0, 1719.0, 1719.0, 0.03419777714448561, 0.0342979659447136, 0.021930215161014534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 876.6500000000001, 251, 1289, 950.5, 1286.8, 1289.0, 1289.0, 0.08729583686154008, 52.285730663426534, 0.18516265396803228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18f829ab-7cf4-4927-982d-fb56d4c32e03", 3, 0, 0.0, 1203.6666666666667, 260, 2897, 454.0, 2897.0, 2897.0, 2897.0, 0.04407292600155724, 0.028334644808943866, 0.02826291153094654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 451.1111111111111, 248, 885, 501.0, 756.3000000000002, 885.0, 885.0, 0.10085841719523948, 0.15631084774301277, 0.22683294414124663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 932.2857142857142, 129, 1267, 1244.0, 1267.0, 1267.0, 1267.0, 0.07219993192577846, 61.70281927841325, 0.12995584845234287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a5a09ca-97f9-4509-8882-238568459641", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 0.24816492101648352, 0.9470509958791209], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1242.5217391304348, 342, 2834, 1142.0, 2091.4000000000005, 2712.599999999998, 2834.0, 0.09352596972198389, 0.029465128028919856, 0.0421962871206607], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 138.25, 127, 162, 132.5, 159.9, 162.0, 162.0, 0.0790357636830666, 0.06136077356253705, 0.028094744121715077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 382.0, 254, 1266, 259.0, 738.9000000000005, 1266.0, 1266.0, 0.10456627868220347, 7.970530128567507, 0.2334998701090757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 490.4, 253, 1497, 260.0, 1345.8000000000002, 1497.0, 1497.0, 0.07060351887938095, 11.35701268715816, 0.15638035910126427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 159.125, 126, 358, 128.5, 358.0, 358.0, 358.0, 0.045260900805078275, 0.033636274914711495, 0.022718850599424058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 157.25, 120, 376, 126.5, 376.0, 376.0, 376.0, 0.04526064473788429, 0.02060817930570171, 0.025337563082023604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 282.5, 125, 1147, 126.0, 1147.0, 1147.0, 1147.0, 0.045260900805078275, 5.101404086847182, 0.02612225817949342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 256.25, 126, 641, 129.0, 641.0, 641.0, 641.0, 0.045261156875169725, 1.674209750809043, 0.0261666063184575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 2.217457706766917, 4.647850093984962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a57a75b-b790-4913-8b45-b30cdfccbd79", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1159.660714285714, 958, 1870, 1018.5, 1659.9, 1759.7499999999998, 1870.0, 0.2434930821876114, 291.3023781882376, 0.48080372283530304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1242.5217391304348, 342, 2834, 1142.0, 2091.4000000000005, 2712.599999999998, 2834.0, 0.09039850017097108, 0.028479826395575975, 0.04078526081932484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 162.85714285714286, 121, 378, 127.0, 378.0, 378.0, 378.0, 0.03436105616069193, 0.009261378418311497, 0.020234098500876208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34ffedcf-ec47-495e-8a0e-e44dce532c80", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 163.85714285714286, 125, 384, 127.0, 384.0, 384.0, 384.0, 0.03436105616069193, 0.009261378418311497, 0.020200542781969283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 316.375, 124, 1151, 128.0, 961.3000000000002, 1151.0, 1151.0, 0.07762091883762674, 8.74873600701014, 0.04479879202445059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 235.4375, 124, 882, 128.0, 699.3000000000002, 882.0, 882.0, 0.07762016571905382, 2.8711691719383694, 0.04487415830632798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 125.28571428571429, 120, 131, 125.0, 131.0, 131.0, 131.0, 0.034361393501769616, 0.009194357245590696, 0.01959673223147798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 143.12499999999997, 122, 373, 128.0, 203.60000000000016, 373.0, 373.0, 0.07761752991913225, 0.05768255885591761, 0.03896036169768942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 163.85714285714286, 122, 375, 128.0, 375.0, 375.0, 375.0, 0.03435920090315614, 0.025534523327443187, 0.017246708265842046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 206.87500000000003, 120, 385, 129.0, 384.3, 385.0, 385.0, 0.07762242511861676, 0.03534321846831549, 0.04345415546801471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 204.0, 130, 386, 134.0, 386.0, 386.0, 386.0, 0.034295232962618195, 0.026994099382685804, 0.012190883592180686], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 747.5384615384615, 132, 3929, 459.0, 2706.199999999999, 3929.0, 3929.0, 0.0676759052953793, 0.012679064588842845, 0.04605947280469774], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1174.952380952381, 680, 1982, 1090.0, 1751.6, 1959.3999999999996, 1982.0, 0.09939322800806505, 0.05144376059011179, 0.04571700233574086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 329.42857142857144, 250, 759, 256.0, 759.0, 759.0, 759.0, 0.034337627171854915, 0.05321661554856812, 0.07722612829763856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e705770-d67d-4b05-8f4d-1b379fe1d9db", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b7e25ba-964d-44e3-a249-2c9eba1bf6bc", 3, 0, 0.0, 386.0, 232, 469, 457.0, 469.0, 469.0, 469.0, 0.04504572140722833, 0.029253324937311368, 0.028886741918046816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4657b1fa-8223-4c51-bef4-5599f6449401", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 1195.762711864407, 642, 2133, 1018.0, 1934.0, 2055.0, 2133.0, 0.26015715255791805, 85.41752157044526, 0.9447189131494007], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 208.67857142857144, 125, 713, 130.0, 508.6, 518.15, 713.0, 0.24444434744271926, 0.18166225430069274, 0.11816401560951761], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b125d6b-2e5c-41a8-854a-250083ecca7a", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=738a476b-824c-4954-aebc-9ec252ec58a7", 1, 0, 0.0, 674.0, 674, 674, 674.0, 674.0, 674.0, 674.0, 1.483679525222552, 0.26804757047477745, 1.0229274851632046], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 701.625, 594, 1028, 630.5, 893.8000000000001, 1004.75, 1028.0, 0.24436328092613685, 71.85091821684622, 0.1228975485126567], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 178.91071428571433, 121, 520, 129.0, 390.5, 413.64999999999986, 520.0, 0.24460984729356675, 0.43284476884369427, 0.11896064839081665], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 945.5357142857144, 829, 1288, 886.5, 1145.4, 1245.95, 1288.0, 0.2440703968758989, 219.61497213892835, 0.12251189843184769], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 132.26666666666665, 126, 149, 130.0, 143.6, 149.0, 149.0, 0.06949688885594221, 0.051919062475386524, 0.02470397221051071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, 5.172413793103448, 191.91379310344828, 123, 818, 134.0, 372.0, 450.25, 641.75, 0.7371913011426465, 1.5980877180857598, 0.3541891081044439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 131.125, 127, 135, 130.5, 135.0, 135.0, 135.0, 0.0474704199945409, 0.03676176079655365, 0.01687425085743446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ecab126-d1da-477e-8e79-a3aa874c40d1", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 148.88888888888889, 128, 383, 132.0, 191.3000000000003, 383.0, 383.0, 0.100852201099289, 0.08184392491553627, 0.03584980585951288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2113fb4b-2dbc-4098-8b42-973b55f17eb4", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a5a09ca-97f9-4509-8882-238568459641", 3, 0, 0.0, 367.0, 230, 475, 396.0, 475.0, 475.0, 475.0, 0.02681636155606407, 0.026894925115310355, 0.017196690190574942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19735f7a-a086-4e42-846b-75c936a18f2b", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.9917265139751552, 1.8530425077639752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 479.375, 255, 1276, 268.0, 1276.0, 1276.0, 1276.0, 0.045228403437358664, 6.824945098725125, 0.1002732254918589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32bf9368-4e37-40a6-b64f-ab8a21480a60", 1, 0, 0.0, 659.0, 659, 659, 659.0, 659.0, 659.0, 659.0, 1.5174506828528074, 0.27414880500758726, 1.0462111153262519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 478.49999999999994, 248, 1278, 384.5, 1089.0000000000002, 1278.0, 1278.0, 0.07757011611276755, 11.70529453918503, 0.17197612900879938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 133.53333333333333, 126, 164, 130.0, 155.0, 164.0, 164.0, 0.10464045539526189, 0.08675756506892317, 0.037196411878784495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18f829ab-7cf4-4927-982d-fb56d4c32e03", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.2745654445288754, 1.0478011018237081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 133.39999999999998, 128, 163, 131.0, 141.60000000000002, 161.95, 163.0, 0.09054567350135592, 0.07029668987654097, 0.03218615737743511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/407c49ea-1fdd-4a9a-be01-5471272c9092", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 145.53333333333333, 125, 381, 129.0, 232.2000000000001, 381.0, 381.0, 0.07064574924526792, 0.052501382007469614, 0.03546085460162862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 194.9333333333333, 125, 393, 128.0, 385.8, 393.0, 393.0, 0.07064674742374862, 0.033051271288219886, 0.03949962674968444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 292.06666666666666, 124, 1116, 128.0, 1114.8, 1116.0, 1116.0, 0.07064641469445426, 8.492204977628635, 0.040722874720357946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 279.1333333333334, 123, 897, 129.0, 886.2, 897.0, 897.0, 0.07064641469445426, 2.786154774520193, 0.040791865359707996], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 31.57894736842105, 0.4608294930875576], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07680491551459294], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07680491551459294], "isController": false}, {"data": ["401/Unauthorized", 11, 57.89473684210526, 0.8448540706605223], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1302, 19, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
