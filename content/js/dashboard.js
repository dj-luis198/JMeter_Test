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

    var data = {"OkPercent": 97.15142428785607, "KoPercent": 2.848575712143928};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7644974226804123, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.044642857142857144, 500, 1500, "see books"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca8d7169-5de1-41da-9be3-bdd65d29f108"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0a3844a-4296-4964-98ba-7c57a3fca874"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0a3844a-4296-4964-98ba-7c57a3fca874"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c019d55b-3a30-4e1b-a81e-04eac822762e"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4017857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea25a9bd-7a18-4283-bd8e-848b73944813"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8a70b1f-2bc7-4de8-a16f-a01a63ca811c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71c85673-e7dd-4780-83f3-3e52b5d51696"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/71c85673-e7dd-4780-83f3-3e52b5d51696"], "isController": false}, {"data": [0.4772727272727273, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.25833333333333336, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/48df22d4-2b9a-4f2b-924e-4e9baa1307a8"], "isController": false}, {"data": [0.9464285714285714, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48df22d4-2b9a-4f2b-924e-4e9baa1307a8"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/03eb67cd-c00c-415e-8a4a-e108836a8174"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5bd51b3-08ea-4d89-8866-8f1890377d45"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03eb67cd-c00c-415e-8a4a-e108836a8174"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50ff5261-ae04-405f-b803-7ff2ede6c930"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/132d826a-9e5b-470e-9fed-d5f70f37f9db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5bd51b3-08ea-4d89-8866-8f1890377d45"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea25a9bd-7a18-4283-bd8e-848b73944813"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4cae9e45-b7f2-4d62-8355-7868e7bfbf11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c019d55b-3a30-4e1b-a81e-04eac822762e"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be9268ed-d50d-4206-b350-e5cbbc708a9e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/50ff5261-ae04-405f-b803-7ff2ede6c930"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca8d7169-5de1-41da-9be3-bdd65d29f108"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be9268ed-d50d-4206-b350-e5cbbc708a9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4cae9e45-b7f2-4d62-8355-7868e7bfbf11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1334, 38, 2.848575712143928, 373.00974512743664, 118, 1892, 136.0, 993.5, 1132.0, 1505.500000000001, 5.351068609203517, 752.0646930819688, 3.9256953831990886], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1847.142857142857, 1480, 2413, 1801.0, 2172.2000000000003, 2341.1, 2413.0, 0.24633792284344344, 296.4271206780891, 1.2112416421061891], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 409.4375, 248, 1496, 258.5, 978.0000000000005, 1496.0, 1496.0, 0.08519112095541842, 6.493665116698525, 0.19023451851043327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca8d7169-5de1-41da-9be3-bdd65d29f108", 3, 0, 0.0, 350.6666666666667, 222, 518, 312.0, 518.0, 518.0, 518.0, 0.019909874634156055, 0.02353279778535828, 0.012767725595471168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 165.78571428571428, 127, 379, 131.0, 375.5, 379.0, 379.0, 0.0813612906225301, 0.06316623637198382, 0.028921396275977496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0a3844a-4296-4964-98ba-7c57a3fca874", 1, 0, 0.0, 675.0, 675, 675, 675.0, 675.0, 675.0, 675.0, 1.4814814814814814, 0.26765046296296297, 1.021412037037037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 468.0, 242, 1278, 497.5, 753.1, 1251.7999999999997, 1278.0, 0.1062439573749243, 6.511659983811077, 0.23758597460238198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 128.0909090909091, 123, 134, 128.0, 133.8, 134.0, 134.0, 0.060567017404758366, 0.045011230708028434, 0.030401803658247854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 170.18181818181822, 122, 373, 127.0, 373.0, 373.0, 373.0, 0.06056735089419434, 0.016206498188485595, 0.03454231730684521], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0a3844a-4296-4964-98ba-7c57a3fca874", 3, 0, 0.0, 309.6666666666667, 232, 455, 242.0, 455.0, 455.0, 455.0, 0.019369709648052374, 0.0228943410586192, 0.01242133073133567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 148.63636363636365, 120, 387, 127.0, 335.20000000000016, 387.0, 387.0, 0.06056735089419434, 0.01632479379570082, 0.03560697777178222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c019d55b-3a30-4e1b-a81e-04eac822762e", 3, 0, 0.0, 562.0, 221, 905, 560.0, 905.0, 905.0, 905.0, 0.030228527669178995, 0.03031708780883479, 0.019384830569102413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 182.72727272727272, 121, 503, 127.0, 477.4000000000001, 503.0, 503.0, 0.06056768438730281, 0.01632488368251521, 0.035666321958538666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 128.33333333333334, 125, 130, 130.0, 130.0, 130.0, 130.0, 0.12401306270927204, 0.03657416497871109, 0.07666041864743087], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1203.6785714285713, 969, 1892, 1006.5, 1630.5, 1804.95, 1892.0, 0.24855968539445536, 297.363797059894, 0.49080828502694207], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 499.1428571428571, 125, 1251, 445.0, 1177.5, 1251.0, 1251.0, 0.0745716127176559, 0.015298208217259067, 0.04992074269331359], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 499.1428571428571, 125, 1251, 445.0, 1177.5, 1251.0, 1251.0, 0.07608488899758159, 0.015608653637129426, 0.05093378067172088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea25a9bd-7a18-4283-bd8e-848b73944813", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 867.958333333333, 136, 1563, 902.5, 1325.0, 1512.0, 1563.0, 0.09752133279154815, 0.030189709467696058, 0.04399888256806177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 153.64705882352942, 120, 377, 126.0, 374.6, 377.0, 377.0, 0.0850727371902977, 0.022763603505997626, 0.04851804542884166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 167.33333333333334, 121, 378, 126.5, 378.0, 378.0, 378.0, 0.04045743877440932, 0.010904544044665012, 0.023824058184539865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 147.76470588235293, 121, 481, 127.0, 201.79999999999976, 481.0, 481.0, 0.08507018290089324, 0.06322110272224585, 0.04270124415142492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 250.16666666666666, 121, 375, 251.5, 375.0, 375.0, 375.0, 0.04045798438321803, 0.010904691103289234, 0.023784869725290286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 205.88235294117646, 121, 499, 127.0, 402.9999999999999, 499.0, 499.0, 0.08507231146474503, 0.022929646449482057, 0.05009629278636841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8a70b1f-2bc7-4de8-a16f-a01a63ca811c", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 1.068013168896321, 1.9955842391304348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 153.76470588235293, 118, 372, 126.0, 364.0, 372.0, 372.0, 0.08507401439252149, 0.022930105441734308, 0.050014215492478455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71c85673-e7dd-4780-83f3-3e52b5d51696", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 268.0, 120, 1122, 127.0, 993.0, 1122.0, 1122.0, 0.08134663544505326, 10.475342618228618, 0.04682424914150247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 247.00000000000006, 120, 872, 125.5, 733.5, 872.0, 872.0, 0.08134285432075812, 3.435578093497801, 0.04690150905520275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 146.14285714285717, 120, 380, 129.0, 256.5, 380.0, 380.0, 0.08169505569852191, 0.060712829479077315, 0.04100708850492213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 208.83333333333331, 125, 375, 127.5, 375.0, 375.0, 375.0, 0.040526301569718745, 0.010843951787209899, 0.023112656363980223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 199.07142857142858, 122, 383, 127.5, 382.0, 383.0, 383.0, 0.08157462330004311, 0.03933062194823507, 0.045544313957418044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 211.66666666666669, 122, 391, 128.0, 391.0, 391.0, 391.0, 0.040519185834492634, 0.030112402753953996, 0.02033873195207931], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 443.7857142857143, 120, 640, 503.0, 626.5, 640.0, 640.0, 0.07612584690004676, 0.0151710061797875, 0.051800197859232434], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 129.33333333333334, 128, 132, 129.0, 132.0, 132.0, 132.0, 0.03988698687053349, 0.03139542130629882, 0.014178577364134949], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71c85673-e7dd-4780-83f3-3e52b5d51696", 3, 0, 0.0, 353.0, 202, 640, 217.0, 640.0, 640.0, 640.0, 0.023734552761910787, 0.028470646786341557, 0.015220400045886803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1134.7272727272725, 792, 1537, 1115.0, 1417.9, 1520.3499999999997, 1537.0, 0.09987107552069148, 0.05169108400973289, 0.04593679352563055], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 221.5, 122, 372, 222.5, 342.0, 372.0, 372.0, 0.07459028621358395, 0.14603795713189693, 0.0482058455474927], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 464.1666666666667, 250, 766, 382.5, 766.0, 766.0, 766.0, 0.040415743279198696, 0.06263650838289875, 0.09089595387890097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 158.5625, 122, 382, 126.5, 379.9, 382.0, 382.0, 0.08524876655690888, 0.06335381967754654, 0.042790884775635904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 172.125, 122, 385, 128.0, 376.6, 385.0, 385.0, 0.08525103766497408, 0.03081400421459817, 0.04817224772353088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 833.6666666666666, 633, 873, 860.0, 873.0, 873.0, 873.0, 0.04522044969224972, 13.296313669765105, 0.025789787715111166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1043.5555555555557, 822, 1151, 1083.0, 1151.0, 1151.0, 1151.0, 0.045173239372995444, 40.64696019390613, 0.025718748588336268], "isController": false}, {"data": ["addBook", 60, 16, 26.666666666666668, 1058.3999999999999, 613, 2054, 911.5, 1788.5, 1951.2499999999995, 2054.0, 0.28380065841752755, 74.66625338195784, 1.03372449785021], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 206.55555555555554, 119, 376, 127.0, 376.0, 376.0, 376.0, 0.04538921249716317, 0.08031762992662077, 0.025132503404190938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 126.6875, 123, 130, 126.5, 130.0, 130.0, 130.0, 0.0750842351262823, 0.055799905206153154, 0.03768876645987217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 141.125, 120, 376, 125.0, 205.90000000000018, 376.0, 376.0, 0.07499800786541608, 0.027108044591003053, 0.04237863505969373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 187.37499999999997, 120, 866, 126.5, 519.5000000000003, 866.0, 866.0, 0.07482614612611012, 4.226951099067479, 0.04358769156662567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48df22d4-2b9a-4f2b-924e-4e9baa1307a8", 3, 0, 0.0, 345.0, 203, 612, 220.0, 612.0, 612.0, 612.0, 0.04345181194055792, 0.027935328314649052, 0.027864605964485385], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 229.32142857142858, 125, 514, 129.0, 502.6, 509.15, 514.0, 0.2495187851999715, 0.1854333940792757, 0.12061699089256435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 173.5, 121, 888, 126.0, 359.50000000000057, 888.0, 888.0, 0.0748184483589041, 1.3938497920280943, 0.043656272357856636], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 699.0892857142858, 595, 1030, 624.0, 877.1, 1010.5, 1030.0, 0.24945320747825078, 73.34752562463528, 0.12545742368290932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 124.77777777777777, 120, 130, 125.0, 130.0, 130.0, 130.0, 0.04538692352303387, 0.033729930469754664, 0.025485821314203586], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 197.26785714285714, 121, 530, 129.0, 381.3, 403.8999999999998, 530.0, 0.24999553579400366, 0.4423749129479831, 0.1215798601810682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 186.81249999999997, 120, 1117, 125.0, 426.1000000000007, 1117.0, 1117.0, 0.08524967498561412, 4.815779323557149, 0.049659600711834784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 604.0625, 121, 1162, 621.0, 1136.1000000000001, 1162.0, 1162.0, 0.09372016330738456, 42.17741409961282, 0.051070167114766196], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 966.6607142857143, 836, 1290, 873.5, 1140.4, 1279.75, 1290.0, 0.24917239169899977, 224.20575604910476, 0.125072860677037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 202.49999999999997, 121, 622, 126.0, 456.10000000000014, 622.0, 622.0, 0.08525058343368037, 1.5881979725013589, 0.04974338242346096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 477.81250000000006, 121, 879, 486.5, 874.1, 879.0, 879.0, 0.09372126125387331, 13.791211728044331, 0.05116229007901874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 131.70000000000002, 123, 140, 131.0, 138.9, 139.95, 140.0, 0.10819524914660998, 0.08082945859097328, 0.03846002997008401], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 456.2857142857143, 125, 942, 436.0, 936.0, 942.0, 942.0, 0.07619835520407552, 0.015631930988782513, 0.05137117069247977], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 16, 9.090909090909092, 171.43181818181816, 121, 922, 132.0, 261.20000000000005, 345.80000000000007, 525.4499999999947, 0.7488756228219846, 1.5884312478459188, 0.3596492796858977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 132.36363636363635, 126, 139, 131.0, 139.0, 139.0, 139.0, 0.061918110484424776, 0.04795025548256724, 0.022009953336260372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48df22d4-2b9a-4f2b-924e-4e9baa1307a8", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 317.75000000000006, 247, 1015, 255.5, 652.4000000000003, 1015.0, 1015.0, 0.07477264442803601, 5.69952017722285, 0.16696972467310334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03eb67cd-c00c-415e-8a4a-e108836a8174", 3, 0, 0.0, 433.6666666666667, 222, 613, 466.0, 613.0, 613.0, 613.0, 0.06902422750385385, 0.03123166543956929, 0.04426358339277086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 129.99999999999997, 122, 138, 130.0, 135.6, 138.0, 138.0, 0.08364947915897829, 0.06788351287217867, 0.029734775794793063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5bd51b3-08ea-4d89-8866-8f1890377d45", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 586.7272727272727, 137, 1392, 521.5, 1093.8999999999999, 1353.4499999999994, 1392.0, 0.10379512729056975, 0.06375696783766442, 0.04693080462454472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 141.68750000000003, 121, 367, 126.5, 206.00000000000017, 367.0, 367.0, 0.09371851643588482, 0.06964823340596518, 0.04704230219535625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 185.81249999999997, 119, 384, 126.0, 377.0, 384.0, 384.0, 0.09372345722402836, 0.09546246668423981, 0.04951600620917904], "isController": false}, {"data": ["login", 22, 0, 0.0, 2430.545454545454, 1505, 3786, 2405.0, 3435.4999999999995, 3756.5999999999995, 3786.0, 0.09985203743543658, 49.000937992168424, 0.2183908730699055], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 358.4545454545455, 251, 628, 261.0, 605.4000000000001, 628.0, 628.0, 0.06052436105532477, 0.09380093847148477, 0.13612070655313763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 148.875, 123, 380, 133.5, 216.90000000000015, 380.0, 380.0, 0.08451433310267964, 0.06842029506066544, 0.030042204345093148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03eb67cd-c00c-415e-8a4a-e108836a8174", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 0.5942896792763158, 2.2679379111842106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 469.64285714285717, 252, 1242, 261.5, 1121.5, 1242.0, 1242.0, 0.0812814602794921, 13.999529547262265, 0.179832962970489], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50ff5261-ae04-405f-b803-7ff2ede6c930", 1, 0, 0.0, 942.0, 942, 942, 942.0, 942.0, 942.0, 942.0, 1.0615711252653928, 0.19178775212314225, 0.7319035297239915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/132d826a-9e5b-470e-9fed-d5f70f37f9db", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.6808868603411514, 1.2722381396588487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5bd51b3-08ea-4d89-8866-8f1890377d45", 3, 0, 0.0, 308.0, 232, 445, 247.0, 445.0, 445.0, 445.0, 0.01955072435433733, 0.026952251836138863, 0.012537411125665539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea25a9bd-7a18-4283-bd8e-848b73944813", 3, 0, 0.0, 409.3333333333333, 223, 526, 479.0, 526.0, 526.0, 526.0, 0.032474913129607375, 0.026882716174671733, 0.02082538374522348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 152.37500000000003, 125, 420, 130.5, 234.50000000000017, 420.0, 420.0, 0.07676769615345863, 0.06364821683035779, 0.027288516992049747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4cae9e45-b7f2-4d62-8355-7868e7bfbf11", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c019d55b-3a30-4e1b-a81e-04eac822762e", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 748.6249999999999, 248, 1288, 876.0, 1265.6, 1288.0, 1288.0, 0.09364885192360596, 56.09086096949974, 0.19863799450983605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be9268ed-d50d-4206-b350-e5cbbc708a9e", 3, 0, 0.0, 432.0, 251, 557, 488.0, 557.0, 557.0, 557.0, 0.034822983168891465, 0.029030488247243177, 0.022331144805571676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50ff5261-ae04-405f-b803-7ff2ede6c930", 3, 0, 0.0, 422.6666666666667, 318, 578, 372.0, 578.0, 578.0, 578.0, 0.0467275162767515, 0.029067800652627644, 0.029965236674869944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca8d7169-5de1-41da-9be3-bdd65d29f108", 1, 0, 0.0, 930.0, 930, 930, 930.0, 930.0, 930.0, 930.0, 1.075268817204301, 0.1942624327956989, 0.7413474462365591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 145.75, 122, 380, 130.0, 214.80000000000018, 380.0, 380.0, 0.08933606552800408, 0.06935758993629222, 0.031756179543157695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 384.7647058823529, 243, 856, 260.0, 671.1999999999998, 856.0, 856.0, 0.08501530275449581, 0.13175711471814927, 0.19120140844101938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, 40.0, 754.7333333333333, 120, 1272, 994.0, 1260.0, 1272.0, 1272.0, 0.0752396382478193, 54.015711917457104, 0.1217353834462764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be9268ed-d50d-4206-b350-e5cbbc708a9e", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4cae9e45-b7f2-4d62-8355-7868e7bfbf11", 3, 0, 0.0, 349.0, 225, 416, 406.0, 416.0, 416.0, 416.0, 0.016975142732658474, 0.023401604646096565, 0.010885752338325911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 151.7, 120, 376, 126.5, 350.80000000000047, 375.85, 376.0, 0.10645942565139861, 0.0791168192585101, 0.05343764139142469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 186.45, 118, 378, 125.5, 374.0, 377.8, 378.0, 0.10645942565139861, 0.036481066856519306, 0.06026809477550368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 275.80000000000007, 119, 1151, 127.5, 387.8, 1112.8499999999995, 1151.0, 0.10631737863871228, 4.810451272419677, 0.062046157689935995], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 867.958333333333, 136, 1563, 902.5, 1325.0, 1512.0, 1563.0, 0.09423516385139115, 0.029172409121963862, 0.04251625556576437], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 248.35000000000002, 121, 620, 127.5, 380.9, 608.0499999999998, 620.0, 0.10631455286756929, 1.590222765533885, 0.06214833139309274], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 26.31578947368421, 0.7496251874062968], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 7.894736842105263, 0.22488755622188905], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.894736842105263, 0.22488755622188905], "isController": false}, {"data": ["401/Unauthorized", 22, 57.89473684210526, 1.6491754122938531], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1334, 38, "401/Unauthorized", 22, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
