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

    var data = {"OkPercent": 98.2315112540193, "KoPercent": 1.7684887459807075};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7396551724137931, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c7a41dc5-fa5e-4013-a3d4-f1c2188e3964"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1711f68a-3232-4602-b427-29e2d4155902"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c342505d-1549-4b4c-8a6c-29ac6d5a03d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18d6ccd4-64ba-45cc-a520-7bc0c187cf31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c24d9a11-2e3d-473c-887e-9d152f6f9090"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d7b546e-a45e-4504-94da-ae010594f9aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a8549ce-e43e-45a7-a681-6c3fe95e338a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3028945a-30dc-4265-8c8c-0ac9ea3b704e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=263570d3-b3d9-41cd-9486-180e3b2aca2e"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2a06b83-a214-4e6d-9670-a7adac9652f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5227272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9baddd4f-9a62-401b-bf92-1c8b5814cf89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7e9ecbf-e36c-4914-a0aa-dd373f31cc7f"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3bdef668-50b1-4d80-91b4-f062e1d9d26d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2403846153846154, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7438d343-65e9-49da-8870-80348b263007"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7a41dc5-fa5e-4013-a3d4-f1c2188e3964"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d2a06b83-a214-4e6d-9670-a7adac9652f6"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a8549ce-e43e-45a7-a681-6c3fe95e338a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d7b546e-a45e-4504-94da-ae010594f9aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18d6ccd4-64ba-45cc-a520-7bc0c187cf31"], "isController": false}, {"data": [0.30357142857142855, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1711f68a-3232-4602-b427-29e2d4155902"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/263570d3-b3d9-41cd-9486-180e3b2aca2e"], "isController": false}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3557692307692308, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e94e07b-ad04-4931-9ad7-ffb83a88f484"], "isController": false}, {"data": [0.9512195121951219, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c342505d-1549-4b4c-8a6c-29ac6d5a03d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9baddd4f-9a62-401b-bf92-1c8b5814cf89"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1e94e07b-ad04-4931-9ad7-ffb83a88f484"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e4be4e90-0541-47f4-a92d-97faa71f7d07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e7e9ecbf-e36c-4914-a0aa-dd373f31cc7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1244, 22, 1.7684887459807075, 454.2797427652733, 126, 2454, 151.0, 1294.0, 1585.25, 2036.749999999997, 4.8852515668933885, 698.4629652389708, 3.566375999434505], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 2252.076923076923, 1598, 2856, 2263.5, 2733.3, 2815.1, 2856.0, 0.23555632061027207, 283.45462012438054, 1.158228588156953], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c7a41dc5-fa5e-4013-a3d4-f1c2188e3964", 3, 0, 0.0, 550.3333333333334, 243, 933, 475.0, 933.0, 933.0, 933.0, 0.01798464111648652, 0.024793279664166803, 0.011533119465976056], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 492.7692307692307, 136, 731, 562.0, 708.1999999999999, 731.0, 731.0, 0.085675684581672, 0.016984535127030676, 0.05760196642172208], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 492.7692307692307, 136, 731, 562.0, 708.1999999999999, 731.0, 731.0, 0.08640284996477422, 0.01712868998325114, 0.0580908584123144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 164.8235294117647, 127, 401, 134.0, 400.2, 401.0, 401.0, 0.10606041700460427, 0.028379447518810125, 0.06048758157293837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 134.52941176470588, 128, 139, 134.0, 138.2, 139.0, 139.0, 0.10605909363146336, 0.07881930688822619, 0.05323669348298063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 181.23529411764707, 132, 399, 135.0, 397.4, 399.0, 399.0, 0.10605777029134693, 0.028585883398839603, 0.06245394090398653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 149.7058823529412, 130, 398, 135.0, 189.99999999999983, 398.0, 398.0, 0.10588469779261549, 0.02853923495191589, 0.06224862116323684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1711f68a-3232-4602-b427-29e2d4155902", 3, 0, 0.0, 422.66666666666663, 224, 712, 332.0, 712.0, 712.0, 712.0, 0.026951029978529013, 0.027029988074169235, 0.01728304982347075], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 233.69230769230768, 134, 330, 243.0, 310.0, 330.0, 330.0, 0.08538419604211411, 0.18141576028058562, 0.055186720458710176], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c342505d-1549-4b4c-8a6c-29ac6d5a03d4", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 134.4666666666667, 133, 137, 134.0, 137.0, 137.0, 137.0, 0.09308502386079445, 0.06917744449029743, 0.04672431861762534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 888.8571428571428, 788, 1176, 795.0, 1176.0, 1176.0, 1176.0, 0.03047731834429791, 8.961343535434237, 0.017381595618232402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 132.99999999999997, 128, 134, 133.0, 134.0, 134.0, 134.0, 0.09308560151915701, 0.034228351391940026, 0.05256669971205521], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1483.142857142857, 1051, 1964, 1469.0, 1964.0, 1964.0, 1964.0, 0.03037060819312236, 27.327526638006216, 0.0172910786880765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 211.14285714285714, 133, 402, 136.0, 402.0, 402.0, 402.0, 0.030564615780947765, 0.05408504276863023, 0.016923962058395883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18d6ccd4-64ba-45cc-a520-7bc0c187cf31", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 134.91666666666666, 129, 142, 134.5, 140.5, 142.0, 142.0, 0.056725787543017055, 0.042156566718980444, 0.02847368632530348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 155.75, 129, 393, 134.5, 316.2000000000003, 393.0, 393.0, 0.056726592008168625, 0.022278851971958155, 0.0319548722233515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 278.75, 127, 1593, 135.5, 1234.2000000000012, 1593.0, 1593.0, 0.056338028169014086, 4.238340852406103, 0.03271713615023474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 235.75, 132, 1072, 135.0, 872.2000000000007, 1072.0, 1072.0, 0.05647616940968284, 1.3977760008047853, 0.032852511306999746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c24d9a11-2e3d-473c-887e-9d152f6f9090", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 137.42857142857144, 134, 151, 135.0, 151.0, 151.0, 151.0, 0.030564482324996506, 0.02271442485285385, 0.01716267318054003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 699.0454545454545, 131, 1580, 135.5, 1575.6, 1579.7, 1580.0, 0.10675776662752215, 39.31461381136145, 0.05900868741325931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 274.93333333333334, 128, 1464, 134.0, 825.0000000000005, 1464.0, 1464.0, 0.09308502386079445, 5.607287907712404, 0.05419051323979323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 513.7727272727275, 131, 1189, 399.0, 1052.4, 1169.0499999999997, 1189.0, 0.10662530897106576, 12.842547057504968, 0.05903959979159598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 265.40000000000003, 128, 1192, 134.0, 793.6000000000003, 1192.0, 1192.0, 0.09308560151915701, 1.8481006852651698, 0.05428175343796155], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 412.6923076923077, 137, 680, 452.0, 611.5999999999999, 680.0, 680.0, 0.08642180488615589, 0.017132447648329732, 0.05863594814691706], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d7b546e-a45e-4504-94da-ae010594f9aa", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a8549ce-e43e-45a7-a681-6c3fe95e338a", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 437.8333333333333, 264, 1727, 273.5, 1371.2000000000012, 1727.0, 1727.0, 0.05630181526436048, 5.693030810288688, 0.12542365649793324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3028945a-30dc-4265-8c8c-0ac9ea3b704e", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.856128518766756, 1.599677446380697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=263570d3-b3d9-41cd-9486-180e3b2aca2e", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 468.0869565217392, 176, 1204, 375.0, 821.4000000000001, 1135.399999999999, 1204.0, 0.09822175910900054, 0.06033348289019662, 0.044410814909635984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 171.04545454545453, 128, 401, 135.0, 399.7, 400.85, 401.0, 0.10675673052660184, 0.07933776555736718, 0.05358687450261069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 230.54545454545456, 126, 408, 135.0, 403.1, 407.4, 408.0, 0.1066206582371728, 0.09404085933827343, 0.05714390214646771], "isController": false}, {"data": ["login", 23, 0, 0.0, 2640.6956521739135, 1488, 4128, 2568.0, 3757.2000000000003, 4063.999999999999, 4128.0, 0.09378606176016051, 34.275034539010925, 0.1888344444093313], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2a06b83-a214-4e6d-9670-a7adac9652f6", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 0.2656824448529412, 1.0139016544117647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 140.86666666666667, 134, 164, 137.0, 156.8, 164.0, 164.0, 0.0899911808642753, 0.07285418841453538, 0.03198905257284786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 914.2727272727274, 265, 1716, 799.5, 1711.9, 1715.7, 1716.0, 0.10655042983412036, 52.24495153014893, 0.22848180772490617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9baddd4f-9a62-401b-bf92-1c8b5814cf89", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7e9ecbf-e36c-4914-a0aa-dd373f31cc7f", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 1080.909090909091, 133, 2099, 1454.0, 2038.8000000000002, 2099.0, 2099.0, 0.04769730423508701, 36.317177994415076, 0.07993448260349231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 332.9411764705883, 264, 536, 273.0, 536.0, 536.0, 536.0, 0.1057963979438159, 0.1639637534539412, 0.23793857857871872], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 998.695652173913, 183, 1677, 1101.0, 1601.4, 1671.0, 1677.0, 0.09637261844404311, 0.03021464905701488, 0.04348061496205852], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 472.8666666666667, 267, 1599, 274.0, 1037.4000000000003, 1599.0, 1599.0, 0.09300710574287875, 7.552455523226975, 0.2075887113400464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 137.72727272727272, 134, 141, 138.0, 140.8, 141.0, 141.0, 0.07242846043430738, 0.05623108012233825, 0.025746054295007703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 661.4166666666665, 270, 1942, 535.0, 1602.4000000000012, 1942.0, 1942.0, 0.09734412771549557, 9.843077273492383, 0.21685369076204228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bdef668-50b1-4d80-91b4-f062e1d9d26d", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.5743452113309352, 1.0731649055755395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 133.75, 129, 138, 134.0, 138.0, 138.0, 138.0, 0.048384560486748676, 0.03595766653360912, 0.02428678133807502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 133.87499999999997, 133, 135, 134.0, 135.0, 135.0, 135.0, 0.04838485312173024, 0.022030700945319066, 0.027086540089874864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 299.125, 133, 1453, 135.0, 1453.0, 1453.0, 1453.0, 0.048001920076803074, 5.410347273265931, 0.027704233169326773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 264.5, 126, 1187, 134.0, 1187.0, 1187.0, 1187.0, 0.048078945628722364, 1.7784397292854868, 0.027795640441605117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 140.5, 137, 144, 140.5, 144.0, 144.0, 144.0, 0.02185768461546868, 0.006446309329952678, 0.013511635118741872], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1593.1153846153848, 1034, 2301, 1567.0, 2165.4, 2265.2, 2301.0, 0.24099959215453637, 288.3192972312855, 0.47588005403952394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 998.695652173913, 183, 1677, 1101.0, 1601.4, 1671.0, 1677.0, 0.09453155504408048, 0.02963744066089887, 0.04264997893590349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 206.0909090909091, 131, 405, 134.0, 403.6, 405.0, 405.0, 0.07193915255678289, 0.019389849712570385, 0.04236260643724617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7438d343-65e9-49da-8870-80348b263007", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 182.45454545454547, 132, 402, 134.0, 401.8, 402.0, 402.0, 0.07193774115492774, 0.019389469295664118, 0.04229152360865869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 435.2727272727273, 133, 1324, 395.0, 1298.2, 1324.0, 1324.0, 0.07193727069994964, 11.784824485321527, 0.04116722717790087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 348.1818181818182, 130, 1058, 135.0, 1057.0, 1058.0, 1058.0, 0.07206498951781971, 3.8685284820492667, 0.04131069223335954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 157.72727272727275, 132, 397, 134.0, 344.6000000000002, 397.0, 397.0, 0.07193821161605923, 0.01924909178007835, 0.04102726131228378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 183.36363636363635, 130, 403, 136.0, 401.8, 403.0, 403.0, 0.0725014994628298, 0.05388050887813816, 0.03639235422255324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 207.72727272727272, 132, 402, 136.0, 402.0, 402.0, 402.0, 0.07193585937193456, 0.053460145490275585, 0.036108429411303086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 229.54545454545453, 128, 402, 134.0, 402.0, 402.0, 402.0, 0.07250197732665437, 0.03919895613630372, 0.04024168698919062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 140.7272727272727, 134, 162, 138.0, 158.60000000000002, 162.0, 162.0, 0.07093204709887928, 0.05583127925946943, 0.02521412611717974], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 547.0769230769231, 133, 1481, 535.0, 1173.3999999999996, 1481.0, 1481.0, 0.08463266169721038, 0.016421737166758897, 0.057593696087366954], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1401.7826086956522, 1079, 2454, 1255.0, 2031.2, 2376.3999999999987, 2454.0, 0.09700139175909915, 0.05020579846906499, 0.04461685109232002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7a41dc5-fa5e-4013-a3d4-f1c2188e3964", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2a06b83-a214-4e6d-9670-a7adac9652f6", 3, 0, 0.0, 681.0, 241, 1481, 321.0, 1481.0, 1481.0, 1481.0, 0.02924489676551442, 0.029330575174007136, 0.01875405163673939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 415.7272727272727, 266, 808, 272.0, 806.6, 808.0, 808.0, 0.07187240687622919, 0.11138819307868722, 0.16164272757417558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a8549ce-e43e-45a7-a681-6c3fe95e338a", 3, 0, 0.0, 373.3333333333333, 243, 535, 342.0, 535.0, 535.0, 535.0, 0.029284291905821717, 0.024413109235289523, 0.018779314796376557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d7b546e-a45e-4504-94da-ae010594f9aa", 3, 0, 0.0, 380.3333333333333, 256, 575, 310.0, 575.0, 575.0, 575.0, 0.02854234256519547, 0.02862596270942944, 0.018303520460102564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18d6ccd4-64ba-45cc-a520-7bc0c187cf31", 3, 0, 0.0, 310.0, 222, 456, 252.0, 456.0, 456.0, 456.0, 0.020111012790604135, 0.02377053627691524, 0.012896710676266323], "isController": false}, {"data": ["addBook", 56, 7, 12.5, 1340.7321428571431, 675, 2474, 1103.5, 2345.4, 2428.2999999999997, 2474.0, 0.25741445566036, 83.49292903893624, 0.935223742289058], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1711f68a-3232-4602-b427-29e2d4155902", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/263570d3-b3d9-41cd-9486-180e3b2aca2e", 3, 0, 0.0, 389.3333333333333, 269, 565, 334.0, 565.0, 565.0, 565.0, 0.07862665443585375, 0.03557651356309789, 0.05042138972611715], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 270.5192307692307, 132, 549, 138.0, 539.4, 546.35, 549.0, 0.24255088904229716, 0.18025510406366027, 0.11724872077728231], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 866.7307692307689, 631, 1260, 797.0, 1082.9, 1201.7, 1260.0, 0.24230224409155296, 71.24490495461492, 0.12186099190151345], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 192.73076923076925, 129, 409, 137.0, 402.7, 406.0, 409.0, 0.2427490395074062, 0.42955201131583987, 0.11805568522918777], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1321.0769230769233, 899, 1730, 1329.0, 1676.0000000000002, 1725.05, 1730.0, 0.24164579373672693, 217.43330997230368, 0.1212948613092555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 140.83333333333331, 132, 157, 138.0, 156.4, 157.0, 157.0, 0.09445992537665895, 0.07056820596986729, 0.03357755159873424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e94e07b-ad04-4931-9ad7-ffb83a88f484", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 7, 4.2682926829268295, 193.09756097560975, 128, 621, 140.0, 339.0, 404.0, 569.6499999999995, 0.7060900264783759, 1.5185627811982003, 0.34018339100811573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 139.5, 135, 151, 137.5, 151.0, 151.0, 151.0, 0.04820293435362878, 0.037329030217214475, 0.01713463682101648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c342505d-1549-4b4c-8a6c-29ac6d5a03d4", 3, 0, 0.0, 420.0, 215, 627, 418.0, 627.0, 627.0, 627.0, 0.017785577082691073, 0.024518853823306222, 0.011405464470345515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 157.35294117647058, 134, 409, 137.0, 239.39999999999986, 409.0, 409.0, 0.1080188079806837, 0.08765979436713686, 0.03839731064938366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9baddd4f-9a62-401b-bf92-1c8b5814cf89", 3, 0, 0.0, 416.6666666666667, 330, 468, 452.0, 468.0, 468.0, 468.0, 0.02175489485134155, 0.02181862989485134, 0.013950892857142856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e94e07b-ad04-4931-9ad7-ffb83a88f484", 3, 0, 0.0, 355.6666666666667, 217, 587, 263.0, 587.0, 587.0, 587.0, 0.024404529480671615, 0.024476027125634518, 0.015650040064102564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 433.75, 266, 1586, 269.5, 1586.0, 1586.0, 1586.0, 0.047963068437303275, 7.237604778695405, 0.10633608996073024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 667.6363636363635, 265, 1598, 538.0, 1570.6000000000001, 1598.0, 1598.0, 0.07187381571553651, 15.724968667508461, 0.15830233434718974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 163.16666666666663, 135, 403, 139.0, 330.10000000000025, 403.0, 403.0, 0.059969415598045, 0.04972073617455098, 0.021317253200867557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4be4e90-0541-47f4-a92d-97faa71f7d07", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.6212761429961089, 1.160855423151751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 164.50000000000003, 134, 406, 138.0, 329.0999999999998, 405.4, 406.0, 0.10493780050370144, 0.08147026503949477, 0.03730210877280012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7e9ecbf-e36c-4914-a0aa-dd373f31cc7f", 3, 0, 0.0, 398.3333333333333, 280, 573, 342.0, 573.0, 573.0, 573.0, 0.04524272723159752, 0.02814415746731213, 0.02901307703328357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 221.41666666666669, 132, 410, 135.0, 406.7, 410.0, 410.0, 0.09745084822842479, 0.0724219682635071, 0.04891575780215854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 287.0, 131, 400, 395.5, 399.7, 400.0, 400.0, 0.0976578394830645, 0.038354226346457465, 0.05501200886244893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 439.0833333333333, 133, 1543, 397.0, 1241.500000000001, 1543.0, 1543.0, 0.09765863424400009, 7.34691277914093, 0.056713217282322974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 243.66666666666666, 127, 790, 133.5, 714.4000000000003, 790.0, 790.0, 0.0976578394830645, 2.4170156323752012, 0.056808124725337326], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 31.818181818181817, 0.5627009646302251], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.1607717041800643], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.1607717041800643], "isController": false}, {"data": ["401/Unauthorized", 11, 50.0, 0.8842443729903537], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1244, 22, "401/Unauthorized", 11, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
