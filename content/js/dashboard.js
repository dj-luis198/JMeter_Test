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

    var data = {"OkPercent": 98.54628921193573, "KoPercent": 1.4537107880642692};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7301378857518056, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=887318c9-0590-415f-a5ac-68a8062ef1c1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0d76a7e9-07e3-4396-a393-2992eb8b8d70"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/47b0bf59-4abc-4680-a648-2ef6777e9ade"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da20b651-cff5-4dc4-b274-86091effc0c6"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c955a207-2758-47cd-a2cb-4601bff9cc7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0d42c7e-662d-4219-b1dc-e0647047ee6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40b61875-2451-442f-8333-cf303c6c8a84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3498620-95a9-4e65-9c92-febcebc50af9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3498620-95a9-4e65-9c92-febcebc50af9"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1635c4e2-bc8c-4d88-ab5b-2ee30801aa94"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f73f4109-89d3-41da-ab8c-2fcf8fd0c6f3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e15beabd-1ddd-4d73-a5a3-91471ba92cc4"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d39659f3-22d1-4461-ab70-3a4fb3dc8352"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/887318c9-0590-415f-a5ac-68a8062ef1c1"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0d42c7e-662d-4219-b1dc-e0647047ee6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47b0bf59-4abc-4680-a648-2ef6777e9ade"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.26785714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c955a207-2758-47cd-a2cb-4601bff9cc7e"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1635c4e2-bc8c-4d88-ab5b-2ee30801aa94"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da20b651-cff5-4dc4-b274-86091effc0c6"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01ec2614-f112-41ff-a51d-2e5bb8ec03d7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40b61875-2451-442f-8333-cf303c6c8a84"], "isController": false}, {"data": [0.2796610169491525, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c77c4c89-e519-4bc6-aff7-36131e922b25"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.36607142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9195402298850575, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d39659f3-22d1-4461-ab70-3a4fb3dc8352"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/01ec2614-f112-41ff-a51d-2e5bb8ec03d7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f73f4109-89d3-41da-ab8c-2fcf8fd0c6f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0cbe405-4156-498f-ad8c-adc32db79c5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/971358e5-b7a8-4633-b47f-754ef4c50052"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d76a7e9-07e3-4396-a393-2992eb8b8d70"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e15beabd-1ddd-4d73-a5a3-91471ba92cc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1307, 19, 1.4537107880642692, 479.8699311400153, 134, 3338, 158.0, 1327.200000000001, 1651.0, 2201.320000000007, 5.110779168980268, 723.7583931203907, 3.732046316925008], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2256.267857142857, 1672, 3052, 2246.0, 2703.9000000000005, 2947.45, 3052.0, 0.2619932068904213, 315.2657270121429, 1.288218551458273], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=887318c9-0590-415f-a5ac-68a8062ef1c1", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d76a7e9-07e3-4396-a393-2992eb8b8d70", 3, 0, 0.0, 854.3333333333334, 249, 1846, 468.0, 1846.0, 1846.0, 1846.0, 0.023238160157399802, 0.023306240704735935, 0.014902075361353389], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 733.2142857142858, 144, 2014, 555.0, 1661.5, 2014.0, 2014.0, 0.08659561702469831, 0.016351446378756858, 0.05856197733359725], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 733.2142857142858, 144, 2014, 555.0, 1661.5, 2014.0, 2014.0, 0.08691549330750702, 0.016411847124959647, 0.058778299917430284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 187.94117647058823, 136, 424, 140.0, 418.4, 424.0, 424.0, 0.08317473053833623, 0.029604241177362774, 0.04702468393602395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 160.70588235294122, 138, 417, 143.0, 217.79999999999984, 417.0, 417.0, 0.08317188203291649, 0.06181035373735298, 0.04174838609855379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47b0bf59-4abc-4680-a648-2ef6777e9ade", 3, 0, 0.0, 602.6666666666666, 283, 1027, 498.0, 1027.0, 1027.0, 1027.0, 0.029383245673317075, 0.024495602919715177, 0.018842771476703983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 260.58823529411757, 136, 1103, 141.0, 554.9999999999995, 1103.0, 1103.0, 0.08317310279706253, 1.4596669314751483, 0.04855745885377679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 252.47058823529412, 135, 1519, 139.0, 637.3999999999992, 1519.0, 1519.0, 0.0831751374836096, 4.423519276143903, 0.048477421008082666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da20b651-cff5-4dc4-b274-86091effc0c6", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 255.99999999999997, 140, 342, 254.0, 317.0, 342.0, 342.0, 0.08642348743464223, 0.17651828512651782, 0.05586540583543734], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c955a207-2758-47cd-a2cb-4601bff9cc7e", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 171.66666666666666, 137, 419, 141.0, 413.6, 419.0, 419.0, 0.10266413428468765, 0.076296295108054, 0.0515325830296186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 201.2222222222222, 138, 420, 140.0, 418.2, 420.0, 420.0, 0.10250744602698224, 0.03598216014510498, 0.057982998712962065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 964.0, 692, 1127, 1077.0, 1127.0, 1127.0, 1127.0, 0.042139684626600254, 12.390466449436591, 0.024032788888607957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1564.6, 1345, 1654, 1650.0, 1654.0, 1654.0, 1654.0, 0.04189604752687631, 37.69813721007935, 0.023852925496258684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 246.0, 137, 409, 139.0, 409.0, 409.0, 409.0, 0.04229116622119971, 0.07483554022735732, 0.023417081296308827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 143.2857142857143, 138, 161, 142.0, 154.0, 161.0, 161.0, 0.08102789674730872, 0.06021702092256048, 0.040672205984488945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 199.21428571428572, 137, 418, 140.5, 417.5, 418.0, 418.0, 0.08102883468960168, 0.021681543657178576, 0.04621175728391346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 140.21428571428572, 136, 143, 141.0, 142.0, 143.0, 143.0, 0.081027427784305, 0.02183942389498845, 0.047635265162257426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0d42c7e-662d-4219-b1dc-e0647047ee6f", 3, 0, 0.0, 386.0, 285, 526, 347.0, 526.0, 526.0, 526.0, 0.016823782098374263, 0.023192941792517904, 0.010788688389907975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 158.7857142857143, 137, 410, 139.5, 276.0, 410.0, 410.0, 0.08103024164375633, 0.0218401823180437, 0.04771605049920417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40b61875-2451-442f-8333-cf303c6c8a84", 3, 0, 0.0, 497.66666666666663, 259, 974, 260.0, 974.0, 974.0, 974.0, 0.02941032302338121, 0.02949648607911377, 0.018860135532571935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 141.6, 140, 145, 141.0, 145.0, 145.0, 145.0, 0.042386171935267836, 0.03149987972923714, 0.023800828967557624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 978.0588235294119, 136, 1807, 1375.0, 1762.2, 1807.0, 1807.0, 0.08573128788566473, 45.38666977757774, 0.04606677773911465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 279.27777777777777, 136, 1679, 141.5, 674.6000000000016, 1679.0, 1679.0, 0.10266881890931491, 5.158445303543215, 0.05986786380410789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 698.4117647058824, 136, 1253, 972.0, 1241.8, 1253.0, 1253.0, 0.08573042320571267, 14.837509329487231, 0.046150034229132206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 217.33333333333337, 137, 695, 141.0, 445.7000000000004, 695.0, 695.0, 0.10250511101872996, 1.7005326528607467, 0.05987250570896521], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 496.64285714285717, 165, 855, 505.0, 797.5, 855.0, 855.0, 0.08701002479785706, 0.016429697065276163, 0.05954627185349998], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3498620-95a9-4e65-9c92-febcebc50af9", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3498620-95a9-4e65-9c92-febcebc50af9", 3, 0, 0.0, 365.3333333333333, 247, 578, 271.0, 578.0, 578.0, 578.0, 0.06760868095463458, 0.030591167489238954, 0.04335582730489262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 343.99999999999994, 282, 560, 285.5, 557.5, 560.0, 560.0, 0.08096089010715753, 0.1254735669922451, 0.18208293937185915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 646.6190476190476, 153, 1280, 620.0, 1204.8000000000002, 1276.8, 1280.0, 0.0991351637146418, 0.060894548805185245, 0.044823809374881986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 157.82352941176467, 137, 413, 141.0, 209.7999999999998, 413.0, 413.0, 0.08572955854320266, 0.06371112700329806, 0.04303221981563102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 219.8235294117647, 136, 426, 142.0, 417.2, 426.0, 426.0, 0.08573042320571267, 0.09868257239177795, 0.0446578284483802], "isController": false}, {"data": ["login", 21, 0, 0.0, 3390.5238095238096, 1881, 5021, 3551.0, 4748.6, 5000.2, 5021.0, 0.09885423237334891, 28.294040553477785, 0.18817885054887637], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 161.94444444444443, 141, 420, 145.0, 197.70000000000036, 420.0, 420.0, 0.09934213431056559, 0.08042444271822155, 0.03531302430570886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1635c4e2-bc8c-4d88-ab5b-2ee30801aa94", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1137.0, 276, 1951, 1517.0, 1903.8, 1951.0, 1951.0, 0.08566821205402136, 60.3422958844613, 0.1797762784090909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f73f4109-89d3-41da-ab8c-2fcf8fd0c6f3", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e15beabd-1ddd-4d73-a5a3-91471ba92cc4", 3, 0, 0.0, 1236.3333333333333, 231, 3022, 456.0, 3022.0, 3022.0, 3022.0, 0.04730368968779565, 0.030411714561652474, 0.030334722879217912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 480.2941176470588, 281, 1658, 291.0, 995.5999999999995, 1658.0, 1658.0, 0.08311414015977471, 5.9702575132738165, 0.18567473556258493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1258.7142857142858, 139, 1799, 1662.0, 1799.0, 1799.0, 1799.0, 0.05858475959325438, 50.067150165292716, 0.10544929802904131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d39659f3-22d1-4461-ab70-3a4fb3dc8352", 3, 0, 0.0, 433.6666666666667, 247, 542, 512.0, 542.0, 542.0, 542.0, 0.08264007492700128, 0.03739248181918352, 0.052995100132224124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/887318c9-0590-415f-a5ac-68a8062ef1c1", 3, 0, 0.0, 404.6666666666667, 292, 509, 413.0, 509.0, 509.0, 509.0, 0.04964832436905254, 0.03191908874637981, 0.03183828092676872], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1166.7916666666665, 238, 2799, 1149.5, 2150.0, 2723.5, 2799.0, 0.09780190224699871, 0.03070635895743172, 0.04412546761534512], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 513.9444444444445, 280, 1823, 287.0, 1067.0000000000011, 1823.0, 1823.0, 0.10242112151128055, 6.957206952900509, 0.2288916469885345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 168.05882352941177, 138, 424, 144.0, 263.9999999999999, 424.0, 424.0, 0.10905964921284594, 0.0846703331291138, 0.03876729718112883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 456.9, 282, 1533, 292.5, 560.9, 1484.3999999999992, 1533.0, 0.09946092180382328, 6.095929787116329, 0.2224175437876708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 143.14285714285714, 138, 151, 141.0, 151.0, 151.0, 151.0, 0.039301555218685086, 0.02920750343888608, 0.019727538459379034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0d42c7e-662d-4219-b1dc-e0647047ee6f", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 140.57142857142858, 136, 148, 140.0, 148.0, 148.0, 148.0, 0.03930199654142431, 0.0105163545433108, 0.022414419902531048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 218.71428571428572, 137, 421, 139.0, 421.0, 421.0, 421.0, 0.039301555218685086, 0.010592997305036213, 0.023105015860984783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 179.14285714285714, 136, 421, 139.0, 421.0, 421.0, 421.0, 0.03930199654142431, 0.01059311625530577, 0.023143656166483256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47b0bf59-4abc-4680-a648-2ef6777e9ade", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 1.787405303030303, 3.7464488636363633], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1543.5178571428569, 1082, 2483, 1403.0, 2122.9000000000005, 2372.65, 2483.0, 0.26237742054883734, 313.89461212652213, 0.5180929144040519], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c955a207-2758-47cd-a2cb-4601bff9cc7e", 3, 0, 0.0, 1033.0, 247, 1484, 1368.0, 1484.0, 1484.0, 1484.0, 0.022760378732702112, 0.026901997128398886, 0.014595685580541395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1166.7916666666665, 238, 2799, 1149.5, 2150.0, 2723.5, 2799.0, 0.09563124591574887, 0.03002484918155592, 0.04314612852839451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 194.8, 138, 419, 139.0, 419.0, 419.0, 419.0, 0.04409326607640481, 0.011884513122155984, 0.02596507758210166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 140.0, 138, 143, 139.0, 143.0, 143.0, 143.0, 0.04409365492305658, 0.011884617928480092, 0.025922246351250056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1635c4e2-bc8c-4d88-ab5b-2ee30801aa94", 3, 0, 0.0, 441.0, 256, 808, 259.0, 808.0, 808.0, 808.0, 0.020997669258712284, 0.024818534205203226, 0.013465302226452865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 448.0, 137, 1812, 143.0, 1575.9999999999998, 1812.0, 1812.0, 0.10000470610381665, 15.901799560788156, 0.05727521368652643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 392.8823529411765, 137, 1098, 406.0, 1094.8, 1098.0, 1098.0, 0.10025417381714818, 5.22426296596076, 0.05751599459512057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 157.2941176470588, 136, 420, 141.0, 199.9999999999998, 420.0, 420.0, 0.10082020199623999, 0.07492595089759634, 0.05060701545514391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 195.6, 136, 422, 140.0, 422.0, 422.0, 422.0, 0.04409326607640481, 0.011798393461850507, 0.02514694080919962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 189.64705882352942, 134, 415, 140.0, 414.2, 415.0, 415.0, 0.10082139785902797, 0.053700367701568656, 0.05600545251015627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 198.6, 138, 413, 141.0, 413.0, 413.0, 413.0, 0.04409326607640481, 0.03276853074623443, 0.022132752698507882], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 645.857142857143, 139, 1368, 552.0, 1171.0, 1368.0, 1368.0, 0.08457374830852504, 0.01580448323929538, 0.057560411708027254], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 200.6, 141, 430, 144.0, 430.0, 430.0, 430.0, 0.04224899869873084, 0.033254582960133845, 0.015018198756189477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da20b651-cff5-4dc4-b274-86091effc0c6", 3, 0, 0.0, 413.0, 237, 642, 360.0, 642.0, 642.0, 642.0, 0.027999701336519075, 0.028081731711528408, 0.01795553764093183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1749.3333333333335, 872, 3338, 1514.0, 2780.0, 3289.0999999999995, 3338.0, 0.09919603971620486, 0.05134170024373884, 0.04562630342415282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 396.8, 280, 836, 285.0, 836.0, 836.0, 836.0, 0.04403850727075755, 0.06825108499872289, 0.09904363500444788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01ec2614-f112-41ff-a51d-2e5bb8ec03d7", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40b61875-2451-442f-8333-cf303c6c8a84", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 1478.8474576271196, 721, 5273, 1185.0, 2435.0, 2710.0, 5273.0, 0.2695701042185437, 88.52860966220354, 0.9788246829124537], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c77c4c89-e519-4bc6-aff7-36131e922b25", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.572286626344086, 1.0693184363799282], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 261.0535714285714, 139, 614, 143.0, 554.8000000000001, 565.05, 614.0, 0.2635815078744975, 0.19588430419188735, 0.12741488906042606], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 899.0535714285714, 671, 1259, 826.5, 1117.2, 1243.45, 1259.0, 0.26343767346900376, 77.45942295388899, 0.13249062679349308], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 227.26785714285717, 137, 511, 145.0, 415.90000000000003, 425.05, 511.0, 0.26412353435020897, 0.4673748478931432, 0.12845070322891022], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1281.125, 942, 1923, 1239.5, 1627.6000000000001, 1785.65, 1923.0, 0.2630948409920555, 236.7332003960517, 0.13206127760734035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 160.40000000000003, 141, 417, 144.0, 167.3, 404.54999999999984, 417.0, 0.1011659374288677, 0.07557806848933964, 0.03596132932041782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, 4.597701149425287, 243.7471264367815, 136, 3020, 147.0, 412.5, 546.0, 1966.25, 0.7421941648182904, 1.627911026008787, 0.3565219579103395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 148.14285714285714, 141, 158, 145.0, 158.0, 158.0, 158.0, 0.03994521798676101, 0.030934138538575667, 0.014199276706231454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d39659f3-22d1-4461-ab70-3a4fb3dc8352", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 162.88235294117646, 139, 432, 146.0, 224.7999999999998, 432.0, 432.0, 0.08463859320700609, 0.06868620210451372, 0.03008637492905294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 364.7142857142857, 281, 564, 290.0, 564.0, 564.0, 564.0, 0.03927046692585175, 0.06086155372199875, 0.08832020051780916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 657.3529411764706, 280, 1948, 554.0, 1716.7999999999997, 1948.0, 1948.0, 0.09992123855314046, 21.222919783082748, 0.22021359817849462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01ec2614-f112-41ff-a51d-2e5bb8ec03d7", 3, 0, 0.0, 409.6666666666667, 259, 628, 342.0, 628.0, 628.0, 628.0, 0.027627107718092993, 0.027887910492775513, 0.01771660228015729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f73f4109-89d3-41da-ab8c-2fcf8fd0c6f3", 3, 0, 0.0, 747.6666666666666, 265, 1042, 936.0, 1042.0, 1042.0, 1042.0, 0.029219830524982955, 0.024074020526930945, 0.01873797725723191], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0cbe405-4156-498f-ad8c-adc32db79c5d", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 1.0073688880126184, 1.882270307570978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/971358e5-b7a8-4633-b47f-754ef4c50052", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.9097889957264957, 1.6999421296296298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 146.85714285714283, 139, 164, 144.5, 160.0, 164.0, 164.0, 0.08236747661352004, 0.06829100355945167, 0.0292790639524622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d76a7e9-07e3-4396-a393-2992eb8b8d70", 1, 0, 0.0, 855.0, 855, 855, 855.0, 855.0, 855.0, 855.0, 1.1695906432748537, 0.2113029970760234, 0.8063779239766082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 146.94117647058823, 140, 167, 144.0, 162.2, 167.0, 167.0, 0.08662376242668827, 0.06725184680587615, 0.030792040550111845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e15beabd-1ddd-4d73-a5a3-91471ba92cc4", 1, 0, 0.0, 740.0, 740, 740, 740.0, 740.0, 740.0, 740.0, 1.3513513513513513, 0.244140625, 0.9316934121621622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 140.69999999999996, 138, 144, 141.0, 142.0, 143.9, 144.0, 0.09966711184643291, 0.07406901573743696, 0.05002821825104152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 181.95000000000002, 135, 420, 141.5, 415.1, 419.8, 420.0, 0.09953170333580504, 0.034107104199740224, 0.05634621916383416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 271.95, 135, 1391, 142.5, 418.8, 1342.3999999999992, 1391.0, 0.0996710854181202, 4.509732141744743, 0.058167422505731085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 291.0, 137, 1244, 146.5, 419.6, 1202.7999999999993, 1244.0, 0.09953814301640389, 1.4888631593157748, 0.05818704336876891], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 36.8421052631579, 0.5355776587605203], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07651109410864575], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07651109410864575], "isController": false}, {"data": ["401/Unauthorized", 10, 52.63157894736842, 0.7651109410864575], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1307, 19, "401/Unauthorized", 10, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
