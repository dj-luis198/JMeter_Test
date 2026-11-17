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

    var data = {"OkPercent": 98.21705426356588, "KoPercent": 1.7829457364341086};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7593333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6f08f7f-046c-4274-939f-0923896f8046"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cacec947-16a7-4850-b1ea-b26394fddcb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d03e5d1b-d668-4837-8fd5-27d699f64739"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69786bee-6f37-414f-b54a-e1335c951b5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4fe5868f-2e12-4ac0-9e9c-e9e66097bd3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2fd9525-db17-4a05-ae93-356a7a457793"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/923ad56f-299b-4ce1-b60b-7e17988d5cc6"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00ba0f64-640a-483c-809c-78b326cafbd0"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/32c995ce-00d2-4ac8-a31b-957eed59cac8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/547b2b6a-d714-487d-b29c-44eebdea737b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6f08f7f-046c-4274-939f-0923896f8046"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/974dd872-ac81-4be7-b91c-44964bc6b75e"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f1c9c19b-4737-4ef9-9600-4900382eb5ec"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff113dc0-1384-4cc0-8bad-6916de842180"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cacec947-16a7-4850-b1ea-b26394fddcb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=974dd872-ac81-4be7-b91c-44964bc6b75e"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c05e5008-fb6a-43cd-a13f-3691fc8abedb"], "isController": false}, {"data": [0.37037037037037035, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69786bee-6f37-414f-b54a-e1335c951b5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4860d283-7783-4102-9df8-de8c0d7e4f0a"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d03e5d1b-d668-4837-8fd5-27d699f64739"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4fe5868f-2e12-4ac0-9e9c-e9e66097bd3e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=923ad56f-299b-4ce1-b60b-7e17988d5cc6"], "isController": false}, {"data": [0.275, 500, 1500, "addBook"], "isController": true}, {"data": [0.8981481481481481, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/00ba0f64-640a-483c-809c-78b326cafbd0"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32c995ce-00d2-4ac8-a31b-957eed59cac8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff113dc0-1384-4cc0-8bad-6916de842180"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c05e5008-fb6a-43cd-a13f-3691fc8abedb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1c9c19b-4737-4ef9-9600-4900382eb5ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1290, 23, 1.7829457364341086, 396.07751937984517, 125, 4451, 140.0, 1005.9000000000001, 1169.2500000000002, 1705.7799999999966, 5.022054214827128, 692.5581791233401, 3.6746240211373977], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1894.7222222222224, 1517, 2405, 1886.0, 2217.5, 2359.5, 2405.0, 0.23530437056080875, 283.1505883290121, 1.1569897517321015], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6f08f7f-046c-4274-939f-0923896f8046", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 649.4615384615385, 134, 1869, 499.0, 1500.9999999999995, 1869.0, 1869.0, 0.07765088163616381, 0.014711202184976346, 0.05249250930317294], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 649.4615384615385, 134, 1869, 499.0, 1500.9999999999995, 1869.0, 1869.0, 0.07756193021812802, 0.014694350060856284, 0.05243237755656054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cacec947-16a7-4850-b1ea-b26394fddcb0", 3, 0, 0.0, 482.66666666666663, 233, 981, 234.0, 981.0, 981.0, 981.0, 0.04710981297404249, 0.030593775027088144, 0.030210394387650948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 171.72222222222226, 125, 393, 129.0, 384.90000000000003, 393.0, 393.0, 0.08820243438718908, 0.02360104201375958, 0.050302950861443776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 157.55555555555554, 127, 382, 129.5, 379.3, 382.0, 382.0, 0.08819984124028576, 0.06554695232798581, 0.044272185935065315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 199.77777777777774, 127, 521, 130.5, 506.6, 521.0, 521.0, 0.08820027342084762, 0.023772729945462832, 0.05193824694606554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 171.11111111111111, 125, 380, 130.5, 380.0, 380.0, 380.0, 0.08820027342084762, 0.023772729945462832, 0.05185211386655299], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d03e5d1b-d668-4837-8fd5-27d699f64739", 3, 0, 0.0, 360.0, 223, 515, 342.0, 515.0, 515.0, 515.0, 0.01996539331824837, 0.027523906478770132, 0.01280332839744443], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 341.2307692307692, 132, 1198, 233.0, 970.3999999999999, 1198.0, 1198.0, 0.0773827948284483, 0.17209417374520822, 0.05002095473999381], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 154.84615384615384, 126, 381, 131.0, 308.19999999999993, 381.0, 381.0, 0.07119503606302403, 0.052909592230430944, 0.03573657083632261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 192.92307692307693, 125, 379, 132.0, 379.0, 379.0, 379.0, 0.07119503606302403, 0.02727574248207802, 0.040143475111858354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 791.1666666666667, 621, 883, 872.0, 883.0, 883.0, 883.0, 0.07238858190768044, 21.2846466079917, 0.041284113119223996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1039.0, 872, 1299, 1022.0, 1299.0, 1299.0, 1299.0, 0.07194244604316546, 64.73393941097122, 0.04095941996402878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 301.0, 131, 392, 379.0, 392.0, 392.0, 392.0, 0.07282172029177235, 0.1288603097350503, 0.040322183013120044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 148.46153846153848, 126, 374, 130.0, 277.5999999999999, 374.0, 374.0, 0.07187244299962404, 0.053413016721400294, 0.03607659736504566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 226.76923076923077, 126, 397, 128.0, 394.6, 397.0, 397.0, 0.07177442953131298, 0.019205267276933356, 0.040933854342076935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69786bee-6f37-414f-b54a-e1335c951b5c", 3, 0, 0.0, 353.6666666666667, 242, 522, 297.0, 522.0, 522.0, 522.0, 0.047630388187663734, 0.030621750218305946, 0.030544226800031753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 206.3846153846154, 125, 390, 130.0, 389.6, 390.0, 390.0, 0.07187244299962404, 0.01937186940224242, 0.042253135435325856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 205.92307692307693, 126, 383, 130.0, 382.2, 383.0, 383.0, 0.07177601466439192, 0.019345878952511886, 0.04226653988537923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4fe5868f-2e12-4ac0-9e9c-e9e66097bd3e", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 128.33333333333334, 125, 133, 127.5, 133.0, 133.0, 133.0, 0.07282525579871099, 0.054121112951971743, 0.040893087972909005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 837.6666666666667, 127, 1439, 1128.0, 1331.0, 1439.0, 1439.0, 0.08024608800320984, 48.144256971378894, 0.04257849070482814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 270.46153846153845, 126, 887, 133.0, 689.3999999999999, 887.0, 887.0, 0.07119503606302403, 4.945514618599977, 0.041384253985552885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 610.1333333333333, 128, 1181, 654.0, 1046.0, 1181.0, 1181.0, 0.08024694660368173, 15.737387520529843, 0.0426573124361368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 193.3846153846154, 126, 645, 130.0, 538.9999999999999, 645.0, 645.0, 0.07119425626646367, 1.6279803182109431, 0.04145332634625601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2fd9525-db17-4a05-ae93-356a7a457793", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 568.5384615384615, 134, 1581, 504.0, 1311.3999999999996, 1581.0, 1581.0, 0.07782800011973538, 0.014744757835184244, 0.05323196672852995], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/923ad56f-299b-4ce1-b60b-7e17988d5cc6", 3, 0, 0.0, 336.3333333333333, 225, 554, 230.0, 554.0, 554.0, 554.0, 0.02283226655910132, 0.026986966105500294, 0.0146417855212987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 416.7692307692308, 253, 766, 505.0, 669.1999999999999, 766.0, 766.0, 0.07172136800233922, 0.11115411232393783, 0.16130303760682346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00ba0f64-640a-483c-809c-78b326cafbd0", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 569.4761904761905, 134, 2754, 503.0, 813.8000000000001, 2561.699999999997, 2754.0, 0.09800261340302407, 0.060198870928224756, 0.0443117285210939], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32c995ce-00d2-4ac8-a31b-957eed59cac8", 3, 0, 0.0, 642.0, 283, 1198, 445.0, 1198.0, 1198.0, 1198.0, 0.015263214127630997, 0.021041572861496508, 0.009787933538877951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 147.33333333333331, 127, 384, 131.0, 233.4000000000001, 384.0, 384.0, 0.08024780522252715, 0.05963728493588201, 0.04028063660583883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 247.53333333333336, 125, 395, 198.0, 387.8, 395.0, 395.0, 0.08024866385974674, 0.10182594131682707, 0.04127372685494786], "isController": false}, {"data": ["login", 21, 0, 0.0, 2663.142857142857, 1434, 5349, 2170.0, 5225.400000000001, 5343.4, 5349.0, 0.0937495814750827, 32.17237660211338, 0.18586429999196433], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 132.30769230769232, 128, 142, 132.0, 139.2, 142.0, 142.0, 0.06861389378569242, 0.055547771433924815, 0.02439009505663285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/547b2b6a-d714-487d-b29c-44eebdea737b", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6f08f7f-046c-4274-939f-0923896f8046", 3, 0, 0.0, 316.6666666666667, 233, 457, 260.0, 457.0, 457.0, 457.0, 0.028807927941769573, 0.028892326168161477, 0.018473833999116555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/974dd872-ac81-4be7-b91c-44964bc6b75e", 3, 0, 0.0, 846.0, 442, 1467, 629.0, 1467.0, 1467.0, 1467.0, 0.08016888912642635, 0.03627433459822025, 0.051410387883808556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 986.7333333333333, 258, 1569, 1258.0, 1461.6000000000001, 1569.0, 1569.0, 0.08019117576301904, 63.999110337377644, 0.1666733910308843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1c9c19b-4737-4ef9-9600-4900382eb5ec", 3, 0, 0.0, 549.0, 229, 965, 453.0, 965.0, 965.0, 965.0, 0.03634161114476075, 0.030296505905511813, 0.023305004542701395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 402.33333333333337, 258, 885, 266.5, 776.1000000000001, 885.0, 885.0, 0.08814283056009872, 0.13660417197155925, 0.19823529177725327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff113dc0-1384-4cc0-8bad-6916de842180", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 910.2499999999999, 132, 1425, 1026.0, 1425.0, 1425.0, 1425.0, 0.09577741329151053, 85.94371991990614, 0.17784060468471272], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 806.6956521739131, 245, 3024, 664.0, 1477.6000000000013, 2782.7999999999965, 3024.0, 0.09521719871001394, 0.029706860399167055, 0.04295932207424458], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cacec947-16a7-4850-b1ea-b26394fddcb0", 1, 0, 0.0, 1581.0, 1581, 1581, 1581.0, 1581.0, 1581.0, 1581.0, 0.6325110689437066, 0.1142720192915876, 0.4360867330803289], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 160.22222222222223, 126, 385, 133.5, 384.1, 385.0, 385.0, 0.0768199936836894, 0.05964052243997371, 0.02730710712974897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 447.076923076923, 255, 1016, 402.0, 913.9999999999999, 1016.0, 1016.0, 0.07114477414270548, 6.649000757965478, 0.15860602931438328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=974dd872-ac81-4be7-b91c-44964bc6b75e", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 443.15384615384613, 255, 1285, 347.0, 980.1999999999997, 1285.0, 1285.0, 0.08019592481323604, 7.494897148726427, 0.17878413917385858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 152.45454545454544, 127, 379, 130.0, 330.00000000000017, 379.0, 379.0, 0.06774733937721718, 0.05034738795513895, 0.03400598871082972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 152.63636363636365, 126, 383, 129.0, 333.8000000000002, 383.0, 383.0, 0.06774859113725248, 0.018128040987897637, 0.038637868382964305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 175.1818181818182, 126, 381, 131.0, 380.2, 381.0, 381.0, 0.06774900840087704, 0.01826047492054889, 0.039829006891921856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 152.8181818181818, 127, 391, 127.0, 340.6000000000002, 391.0, 391.0, 0.06774692213415122, 0.018259912606470446, 0.03989393949891913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 2.200909514925373, 4.613164645522388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c05e5008-fb6a-43cd-a13f-3691fc8abedb", 3, 0, 0.0, 359.3333333333333, 235, 500, 343.0, 500.0, 500.0, 500.0, 0.025737375817161682, 0.030420706898474634, 0.016504762486916836], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1225.4629629629628, 1001, 1823, 1045.0, 1683.0, 1766.25, 1823.0, 0.22849888924151063, 273.3641105998096, 0.45119604887337356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 806.6956521739131, 245, 3024, 664.0, 1477.6000000000013, 2782.7999999999965, 3024.0, 0.09364439558649891, 0.029216160783355725, 0.04224971754000244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 166.92307692307693, 126, 380, 128.0, 378.8, 380.0, 380.0, 0.06391095728781562, 0.017226000206481556, 0.03763506566850862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 167.6923076923077, 126, 392, 129.0, 386.4, 392.0, 392.0, 0.0639892891774423, 0.017247113098607495, 0.03761870320783229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69786bee-6f37-414f-b54a-e1335c951b5c", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4860d283-7783-4102-9df8-de8c0d7e4f0a", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 320.3888888888889, 127, 1123, 135.5, 935.8000000000003, 1123.0, 1123.0, 0.07762501940625484, 7.779389762230253, 0.04489381005157751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d03e5d1b-d668-4837-8fd5-27d699f64739", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 213.33333333333334, 127, 634, 129.0, 625.0, 634.0, 634.0, 0.07762368039743324, 2.5545906051628373, 0.044968840021907125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 130.38888888888886, 126, 138, 130.0, 133.5, 138.0, 138.0, 0.07762434989606963, 0.057687627217684556, 0.03896378500642557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 148.53846153846155, 125, 382, 129.0, 283.5999999999999, 382.0, 382.0, 0.06399023410581031, 0.017122386860343775, 0.036494430388469945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 199.66666666666669, 126, 393, 131.0, 381.3, 393.0, 393.0, 0.07762368039743324, 0.03372452433933623, 0.04354540230628579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 149.46153846153845, 126, 384, 129.0, 285.9999999999999, 384.0, 384.0, 0.06398865924070073, 0.047554071955247315, 0.032119307470429855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 173.76923076923077, 128, 397, 134.0, 393.4, 397.0, 397.0, 0.0633410966780031, 0.049856371018037596, 0.022515780459758914], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 633.3076923076922, 133, 1940, 515.0, 1556.3999999999996, 1940.0, 1940.0, 0.08095703672335736, 0.015167281369294863, 0.05509846399591478], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1482.0476190476193, 818, 4451, 1163.0, 3585.2000000000007, 4393.4, 4451.0, 0.09674343181200448, 0.05007228404332263, 0.04449819959321691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 339.3076923076923, 254, 777, 261.0, 672.1999999999999, 777.0, 777.0, 0.06386888209804364, 0.09898429286093288, 0.14364261276542434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fe5868f-2e12-4ac0-9e9c-e9e66097bd3e", 3, 0, 0.0, 381.6666666666667, 270, 576, 299.0, 576.0, 576.0, 576.0, 0.018413267372917767, 0.02538417556129777, 0.011807987215054688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=923ad56f-299b-4ce1-b60b-7e17988d5cc6", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["addBook", 60, 11, 18.333333333333332, 1206.2333333333333, 658, 2311, 1033.0, 2021.2, 2166.3999999999996, 2311.0, 0.29134982373335666, 82.45352230556041, 1.0608329706635007], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 247.27777777777777, 127, 613, 133.0, 525.5, 543.5, 613.0, 0.22938312929562388, 0.1704692982362986, 0.11088344629036506], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 750.6111111111113, 625, 1046, 653.0, 917.0, 1039.5, 1046.0, 0.2290484310182475, 67.34784384305092, 0.11519525583437253], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 197.462962962963, 126, 531, 131.0, 386.5, 425.0, 531.0, 0.2298058140870964, 0.40664856945880734, 0.11176103067907618], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 968.7407407407406, 870, 1303, 893.0, 1166.5, 1276.25, 1303.0, 0.22904648795385138, 206.09643248165509, 0.11497060039871056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 131.76923076923077, 128, 137, 132.0, 136.2, 137.0, 137.0, 0.08143424497926559, 0.060837106844861495, 0.028947329269973315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, 6.32183908045977, 211.75287356321843, 127, 1487, 134.0, 378.5, 441.0, 1411.25, 0.70506716372551, 1.4746752613611038, 0.34047617992382034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 157.54545454545456, 130, 383, 135.0, 334.4000000000002, 383.0, 383.0, 0.06980802792321117, 0.0540603184991274, 0.024814572425828973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 132.66666666666669, 127, 136, 133.0, 135.1, 136.0, 136.0, 0.08748863862817814, 0.0709990807617344, 0.0310994770123602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 331.72727272727275, 259, 763, 264.0, 714.2000000000002, 763.0, 763.0, 0.06769230769230769, 0.10490985576923077, 0.15224158653846154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00ba0f64-640a-483c-809c-78b326cafbd0", 3, 0, 0.0, 811.6666666666666, 235, 1940, 260.0, 1940.0, 1940.0, 1940.0, 0.03318106909404621, 0.027337658163096017, 0.021278224646898124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 453.1111111111111, 257, 1252, 272.0, 1068.4000000000003, 1252.0, 1252.0, 0.07757985337407713, 10.419371635512608, 0.17227340487201478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32c995ce-00d2-4ac8-a31b-957eed59cac8", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff113dc0-1384-4cc0-8bad-6916de842180", 3, 0, 0.0, 393.0, 219, 715, 245.0, 715.0, 715.0, 715.0, 0.038452171906843205, 0.024721041509119572, 0.02465845659390661], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 132.76923076923075, 127, 140, 132.0, 139.2, 140.0, 140.0, 0.07191180293953323, 0.059622188179359104, 0.025562398701162208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 133.06666666666663, 129, 142, 133.0, 138.4, 142.0, 142.0, 0.07901307402998282, 0.06134315806038705, 0.028086678659095456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c05e5008-fb6a-43cd-a13f-3691fc8abedb", 1, 0, 0.0, 907.0, 907, 907, 907.0, 907.0, 907.0, 907.0, 1.1025358324145536, 0.1991886025358324, 0.7601467750826901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1c9c19b-4737-4ef9-9600-4900382eb5ec", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 155.15384615384616, 126, 380, 129.0, 313.99999999999994, 380.0, 380.0, 0.08038286979211752, 0.059737660070118596, 0.0403484326886215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 225.3846153846154, 127, 388, 128.0, 386.0, 388.0, 388.0, 0.08030292735055934, 0.030765093861767775, 0.04527897931890763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 245.23076923076925, 125, 879, 128.0, 684.9999999999998, 879.0, 879.0, 0.0804251396613483, 5.586677469283783, 0.04674952904894179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 226.6923076923077, 126, 905, 128.0, 698.5999999999998, 905.0, 905.0, 0.08042712992693506, 1.8391060099172838, 0.046829228069687014], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 34.78260869565217, 0.6201550387596899], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.3478260869565215, 0.07751937984496124], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.07751937984496124], "isController": false}, {"data": ["401/Unauthorized", 13, 56.52173913043478, 1.0077519379844961], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1290, 23, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
