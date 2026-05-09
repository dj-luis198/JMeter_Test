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

    var data = {"OkPercent": 97.75541795665634, "KoPercent": 2.2445820433436534};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.713527851458886, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6e5eb7b-924a-4269-b3f1-a8882971db34"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7f71027-dcc7-4410-aff4-34a0de91e73d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f986d543-2f2d-4bc6-8b0c-a40da03d4977"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e128f60-4cb7-4f66-a3ed-ab66ebc1e024"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57ee3dbb-ce06-4a81-935f-3ac9931452dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf599d55-4afb-4723-b60e-0bc8daa8f710"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a4362d6-f67b-49a7-93d0-54038fa69f03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/fd2c2311-8578-4a5c-88a4-d272caafc95a"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e128f60-4cb7-4f66-a3ed-ab66ebc1e024"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe57fbd8-7cc5-40ee-9235-abe4b1fedcf5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c0da822e-8ab5-44a8-9af2-79af0f397053"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07692307692307693, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5e9f3f0-7f98-481a-b6d5-91a99c1f9188"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6e5eb7b-924a-4269-b3f1-a8882971db34"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e7f71027-dcc7-4410-aff4-34a0de91e73d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b88034b3-6184-4796-956e-0c862b0c75e3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f986d543-2f2d-4bc6-8b0c-a40da03d4977"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6159c8fa-4c82-4f33-87e9-918ed394f498"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88543620-c6d3-4e6b-8cc9-8d605ae41e65"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7d71d50-32a1-45ef-a8f4-0a6c8edfc03f"], "isController": false}, {"data": [0.23275862068965517, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a7fda07-2d42-4995-b012-7d480211673a"], "isController": false}, {"data": [0.8981481481481481, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57ee3dbb-ce06-4a81-935f-3ac9931452dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd2c2311-8578-4a5c-88a4-d272caafc95a"], "isController": false}, {"data": [0.3611111111111111, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2a4362d6-f67b-49a7-93d0-54038fa69f03"], "isController": false}, {"data": [0.9205882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/312960d9-f8a0-4763-8343-083cc4cfdef3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bf599d55-4afb-4723-b60e-0bc8daa8f710"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b88034b3-6184-4796-956e-0c862b0c75e3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0da822e-8ab5-44a8-9af2-79af0f397053"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c5e9f3f0-7f98-481a-b6d5-91a99c1f9188"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1292, 29, 2.2445820433436534, 514.8080495356036, 140, 4401, 170.5, 1441.0000000000005, 1742.35, 2264.979999999999, 5.172986759235903, 750.5630584133105, 3.7701695997441536], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2439.24074074074, 1763, 3097, 2394.5, 2953.0, 3035.5, 3097.0, 0.23668327832638622, 284.8092078355862, 1.1637698304427293], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b6e5eb7b-924a-4269-b3f1-a8882971db34", 3, 0, 0.0, 346.0, 261, 463, 314.0, 463.0, 463.0, 463.0, 0.019274136036852147, 0.02657095251174116, 0.0123600416642574], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 776.4285714285713, 149, 2918, 537.5, 2343.5, 2918.0, 2918.0, 0.10149119563877834, 0.020820703569590336, 0.0679416158304517], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 776.4285714285713, 149, 2918, 537.5, 2343.5, 2918.0, 2918.0, 0.0999214902576547, 0.020498681839269145, 0.06689080231603739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 224.375, 145, 455, 150.5, 455.0, 455.0, 455.0, 0.09310445155659004, 0.03365262219959267, 0.05260992508001164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 188.5625, 146, 444, 153.0, 441.2, 444.0, 444.0, 0.0932710748908437, 0.06931571092962115, 0.04681770751356802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 265.3125, 145, 876, 149.5, 568.7000000000003, 876.0, 876.0, 0.0932710748908437, 1.73761780938307, 0.054423307858671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 312.75, 142, 1742, 150.0, 936.3000000000009, 1742.0, 1742.0, 0.09311041148982478, 5.259834650821409, 0.05423863325554734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7f71027-dcc7-4410-aff4-34a0de91e73d", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f986d543-2f2d-4bc6-8b0c-a40da03d4977", 3, 0, 0.0, 323.0, 239, 464, 266.0, 464.0, 464.0, 464.0, 0.06617257808364214, 0.02994136833862714, 0.04243488894035645], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 273.7857142857143, 147, 695, 256.0, 543.5, 695.0, 695.0, 0.10036130068245686, 0.15747959394893044, 0.06486101079959282], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6e128f60-4cb7-4f66-a3ed-ab66ebc1e024", 3, 0, 0.0, 425.66666666666663, 238, 780, 259.0, 780.0, 780.0, 780.0, 0.030813475760065732, 0.03090374961483155, 0.019759943765406737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57ee3dbb-ce06-4a81-935f-3ac9931452dc", 3, 0, 0.0, 373.0, 238, 489, 392.0, 489.0, 489.0, 489.0, 0.043012602692588935, 0.027652959087846072, 0.027582951596484436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 163.52631578947367, 141, 446, 149.0, 157.0, 446.0, 446.0, 0.0966493206570119, 0.07182630177733014, 0.04851342853291418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf599d55-4afb-4723-b60e-0bc8daa8f710", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 192.94736842105266, 140, 439, 148.0, 438.0, 439.0, 439.0, 0.0966542372708913, 0.03350309293559267, 0.05469588570890796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1053.2857142857142, 857, 1337, 1118.0, 1337.0, 1337.0, 1337.0, 0.061641965850350915, 18.124784665900545, 0.03515518364902826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1516.142857142857, 1306, 1784, 1522.0, 1784.0, 1784.0, 1784.0, 0.061158873278814564, 55.03086168210928, 0.03481994445463759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 364.7142857142857, 147, 456, 449.0, 456.0, 456.0, 456.0, 0.061882282218568216, 0.1095026322070758, 0.03426489650188299], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a4362d6-f67b-49a7-93d0-54038fa69f03", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 251.22222222222223, 149, 455, 152.0, 455.0, 455.0, 455.0, 0.05910747709585263, 0.04392655280267954, 0.029669182839129154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 266.2222222222223, 147, 598, 152.0, 598.0, 598.0, 598.0, 0.05910825348246127, 0.015816075638861705, 0.03371017581421619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 216.22222222222223, 147, 458, 151.0, 458.0, 458.0, 458.0, 0.05910747709585263, 0.01593131218599153, 0.034748731652053985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 249.0, 142, 457, 154.0, 457.0, 457.0, 457.0, 0.059111359232865916, 0.015932358543233393, 0.03480873986075991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 191.28571428571428, 146, 446, 149.0, 446.0, 446.0, 446.0, 0.06204463668433461, 0.04610934425466664, 0.034839517669426175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1224.4285714285716, 144, 1907, 1591.5, 1850.5, 1907.0, 1907.0, 0.08058435167011069, 51.79902091811479, 0.042428200781668216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 256.9473684210526, 143, 1598, 152.0, 444.0, 1598.0, 1598.0, 0.09665374558699345, 4.602006940311225, 0.056384663466918984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 901.1428571428571, 150, 1421, 1122.0, 1383.5, 1421.0, 1421.0, 0.08044867374614996, 16.90232471526916, 0.04243532860410058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 202.26315789473682, 143, 895, 147.0, 450.0, 895.0, 895.0, 0.09665669576541928, 1.5204849399965408, 0.05648077580988137], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 485.9285714285714, 150, 1258, 477.5, 987.0, 1258.0, 1258.0, 0.1001796077252789, 0.02055163409040494, 0.06753877711110634], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 585.1111111111111, 304, 1048, 589.0, 1048.0, 1048.0, 1048.0, 0.05904814392000945, 0.09151309023540527, 0.13280065961697438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd2c2311-8578-4a5c-88a4-d272caafc95a", 3, 0, 0.0, 1409.0, 248, 2368, 1611.0, 2368.0, 2368.0, 2368.0, 0.027482090837470916, 0.02291068835767025, 0.017623606428977114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 840.1666666666667, 260, 1966, 692.0, 1869.0, 1957.75, 1966.0, 0.10453963358858427, 0.0642142866476753, 0.0472674319839009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 168.78571428571428, 142, 432, 148.0, 299.0, 432.0, 432.0, 0.08058296015748212, 0.059886360038910055, 0.04044886867279864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 248.64285714285717, 141, 448, 148.5, 446.5, 448.0, 448.0, 0.08044358893326055, 0.1078267302554084, 0.04105226678541673], "isController": false}, {"data": ["login", 24, 0, 0.0, 3358.6249999999995, 1922, 5001, 3423.0, 4943.0, 4998.25, 5001.0, 0.10486210633017583, 36.73243720152531, 0.20893057855482539], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e128f60-4cb7-4f66-a3ed-ab66ebc1e024", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 158.52631578947367, 149, 206, 153.0, 183.0, 206.0, 206.0, 0.09370222419490064, 0.07585853892341075, 0.03330821250678108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe57fbd8-7cc5-40ee-9235-abe4b1fedcf5", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0da822e-8ab5-44a8-9af2-79af0f397053", 3, 0, 0.0, 356.0, 257, 545, 266.0, 545.0, 545.0, 545.0, 0.07562580352416244, 0.033480173435176085, 0.048497015931835946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1417.0714285714287, 306, 2075, 1740.5, 2008.0, 2075.0, 2075.0, 0.08037569898152508, 68.71936125001436, 0.16607763359589398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 593.7499999999999, 294, 2183, 578.5, 1284.900000000001, 2183.0, 2183.0, 0.09302379664998053, 7.090708239946163, 0.20772513575660323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 992.1538461538462, 147, 2231, 1462.0, 2050.6, 2231.0, 2231.0, 0.11343111677297198, 73.08488192257018, 0.17241325246276407], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1219.4166666666665, 372, 2599, 1144.5, 2187.0, 2518.75, 2599.0, 0.10280441887660471, 0.03227697330940275, 0.04638246242284314], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5e9f3f0-7f98-481a-b6d5-91a99c1f9188", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 160.875, 148, 227, 155.0, 203.90000000000003, 227.0, 227.0, 0.08477989021004217, 0.06582032491892924, 0.030136601598100932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 452.7894736842105, 289, 1749, 302.0, 891.0, 1749.0, 1749.0, 0.09657612231620039, 6.222776414204823, 0.2159014412080148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6e5eb7b-924a-4269-b3f1-a8882971db34", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 507.3333333333333, 293, 1657, 307.0, 1479.7000000000003, 1657.0, 1657.0, 0.08630775427223383, 11.591573426321947, 0.19165453463338383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 176.45454545454544, 146, 436, 149.0, 381.4000000000002, 436.0, 436.0, 0.07892150180443253, 0.05865162389958316, 0.03961489446042805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 227.18181818181816, 145, 450, 148.0, 447.40000000000003, 450.0, 450.0, 0.07891923692272372, 0.031892788216640475, 0.04440608341763343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 359.09090909090907, 142, 1896, 149.0, 1604.600000000001, 1896.0, 1896.0, 0.07891980313096383, 6.4749901013940105, 0.045779651425578625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 283.45454545454544, 146, 887, 150.0, 830.0000000000002, 887.0, 887.0, 0.07891640600338623, 2.128795273804058, 0.04585474762892071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 155.0, 150, 161, 154.0, 161.0, 161.0, 161.0, 0.05552059814191065, 0.016374238905133804, 0.03432083849983344], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1674.3148148148152, 1168, 2495, 1504.0, 2341.0, 2438.0, 2495.0, 0.240247722095672, 287.4197992485585, 0.47439540437250854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1219.4166666666665, 372, 2599, 1144.5, 2187.0, 2518.75, 2599.0, 0.10545695818192205, 0.03310977739793744, 0.04757921355473436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 211.88888888888889, 145, 438, 148.0, 438.0, 438.0, 438.0, 0.04313174832145613, 0.011625354039767472, 0.025398871326013716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7f71027-dcc7-4410-aff4-34a0de91e73d", 3, 0, 0.0, 411.6666666666667, 251, 498, 486.0, 498.0, 498.0, 498.0, 0.018984458057003998, 0.02243898672037159, 0.012174278115982382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 216.22222222222223, 143, 474, 148.0, 474.0, 474.0, 474.0, 0.04313195502774823, 0.011625409753572763, 0.025356871998734796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b88034b3-6184-4796-956e-0c862b0c75e3", 3, 0, 0.0, 404.6666666666667, 243, 567, 404.0, 567.0, 567.0, 567.0, 0.03888932099245547, 0.025002086250032408, 0.02493878982914625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 377.5, 145, 1788, 150.0, 1438.0000000000005, 1788.0, 1788.0, 0.0847682119205298, 9.554314983443708, 0.04892384105960265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f986d543-2f2d-4bc6-8b0c-a40da03d4977", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 351.75, 145, 1190, 151.0, 986.3000000000002, 1190.0, 1190.0, 0.08476911013626634, 3.135608556117151, 0.049007141797528984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 182.55555555555554, 146, 447, 149.0, 447.0, 447.0, 447.0, 0.043131128214467136, 0.011540946416761715, 0.02459822155981329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 168.50000000000003, 142, 449, 150.5, 242.50000000000023, 449.0, 449.0, 0.08476506831534725, 0.0629943525273235, 0.04254809093172703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6159c8fa-4c82-4f33-87e9-918ed394f498", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.5702427455357142, 1.0654994419642856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 190.55555555555554, 146, 504, 152.0, 504.0, 504.0, 504.0, 0.043131128214467136, 0.03205350446407177, 0.02164980459202745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 202.375, 140, 449, 149.5, 443.4, 449.0, 449.0, 0.08476731372382809, 0.03859644533567856, 0.04745396737518013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 154.55555555555554, 151, 160, 154.0, 160.0, 160.0, 160.0, 0.04218400663695038, 0.03320342709900587, 0.014995096109228454], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 559.6428571428572, 147, 1611, 491.0, 1215.0, 1611.0, 1611.0, 0.10199101022095623, 0.02032563589573605, 0.06940027237063533], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/88543620-c6d3-4e6b-8cc9-8d605ae41e65", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1646.6666666666667, 1032, 4401, 1507.5, 2321.0, 3906.0, 4401.0, 0.1066861072462093, 0.05521839535204193, 0.049071441907191975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 443.55555555555554, 297, 943, 310.0, 943.0, 943.0, 943.0, 0.04310014558271397, 0.06679680765602253, 0.09693323757518581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7d71d50-32a1-45ef-a8f4-0a6c8edfc03f", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["addBook", 58, 10, 17.24137931034483, 1531.7931034482756, 743, 2912, 1225.0, 2610.7, 2810.0, 2912.0, 0.2718422939740063, 96.42148492241948, 0.9848699111591261], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6a7fda07-2d42-4995-b012-7d480211673a", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.6794381648936171, 1.26953125], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 278.2777777777777, 146, 613, 153.0, 592.0, 600.75, 613.0, 0.24148972327066526, 0.1794664837978284, 0.11673575490134698], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 953.1481481481483, 700, 1354, 882.0, 1235.0, 1312.5, 1354.0, 0.2412297355854065, 70.92955184317387, 0.12132159553367611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57ee3dbb-ce06-4a81-935f-3ac9931452dc", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 210.25925925925927, 145, 451, 151.5, 435.5, 440.25, 451.0, 0.2420135527589545, 0.4282505445304937, 0.11769799733785093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd2c2311-8578-4a5c-88a4-d272caafc95a", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1394.5370370370365, 1017, 1898, 1338.5, 1773.5, 1877.0, 1898.0, 0.24092407768463037, 216.78390859998572, 0.12093259368154298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 155.55555555555554, 148, 179, 153.0, 163.70000000000002, 179.0, 179.0, 0.09022918212259139, 0.06740754328494376, 0.03207365458263991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a4362d6-f67b-49a7-93d0-54038fa69f03", 3, 0, 0.0, 486.0, 270, 695, 493.0, 695.0, 695.0, 695.0, 0.037360365633445, 0.03114579960522547, 0.023958307388634976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, 5.882352941176471, 233.41764705882366, 145, 2021, 155.0, 404.00000000000006, 447.24999999999994, 1492.049999999994, 0.7142737096855515, 1.5814138102720963, 0.34312875256298214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 153.54545454545453, 150, 167, 152.0, 164.4, 167.0, 167.0, 0.08156909272922769, 0.06316825247488043, 0.02899526343109266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/312960d9-f8a0-4763-8343-083cc4cfdef3", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf599d55-4afb-4723-b60e-0bc8daa8f710", 3, 0, 0.0, 870.3333333333334, 255, 1700, 656.0, 1700.0, 1700.0, 1700.0, 0.04056082095101605, 0.03381388751808337, 0.026010682706217977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 154.375, 147, 179, 153.0, 166.4, 179.0, 179.0, 0.099161465854369, 0.0804718536376764, 0.03524880231542023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 579.8181818181819, 297, 2046, 308.0, 1811.8000000000009, 2046.0, 2046.0, 0.07883270267171195, 8.68482472713135, 0.17546295176513588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 603.375, 299, 1940, 444.0, 1585.8000000000004, 1940.0, 1940.0, 0.08469776133229578, 12.780852896531096, 0.1877784108053169], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b88034b3-6184-4796-956e-0c862b0c75e3", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0da822e-8ab5-44a8-9af2-79af0f397053", 1, 0, 0.0, 1258.0, 1258, 1258, 1258.0, 1258.0, 1258.0, 1258.0, 0.794912559618442, 0.14361213235294118, 0.5480549483306836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5e9f3f0-7f98-481a-b6d5-91a99c1f9188", 3, 0, 0.0, 480.0, 259, 819, 362.0, 819.0, 819.0, 819.0, 0.0577689626619938, 0.03713987671140552, 0.03704585170707285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 191.33333333333334, 149, 447, 155.0, 447.0, 447.0, 447.0, 0.058732551537813975, 0.048695250249613346, 0.020877586679457313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 174.78571428571428, 147, 455, 152.5, 308.0, 455.0, 455.0, 0.08143085647811545, 0.06322024501963065, 0.028946124763705103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 149.1111111111111, 143, 163, 148.0, 154.0, 163.0, 163.0, 0.08636904533415224, 0.06418637060477525, 0.04335321220874439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 214.94444444444443, 145, 455, 148.0, 448.7, 455.0, 455.0, 0.08637070305752288, 0.03752477159747414, 0.04845231497476056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 337.6111111111111, 144, 1508, 150.0, 1317.2000000000003, 1508.0, 1508.0, 0.08637028862071447, 8.65581927317003, 0.04995156666106859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 309.44444444444446, 141, 1182, 151.0, 1146.0, 1182.0, 1182.0, 0.08637153194307155, 2.842481867976315, 0.050036632925787666], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 24.137931034482758, 0.541795665634675], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.23219814241486067], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.344827586206897, 0.23219814241486067], "isController": false}, {"data": ["401/Unauthorized", 16, 55.172413793103445, 1.238390092879257], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1292, 29, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
