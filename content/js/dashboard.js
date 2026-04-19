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

    var data = {"OkPercent": 98.71212121212122, "KoPercent": 1.2878787878787878};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.83235485975212, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.39655172413793105, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64c935f8-a194-40d4-a59e-722a7697485a"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9380ae79-b290-4db6-888c-247941b9df23"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3f9f095-3a3f-49d9-8e3b-7f493c7c42d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/577ff341-f757-4c10-a238-d19d7ad0a219"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be862d2a-f28c-47d0-a10b-36bf4d4a7a7c"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b5fe0bd-9eba-48e0-942c-4b38263da23f"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=619a8b85-a7f0-415e-aaa6-6133f06cbc84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dcd38a74-1dda-4c36-bf03-e0bc244a54c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=890d5774-cce0-4923-9dff-8a2f535947ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dba9d974-2849-4b16-b09e-244f9d9beada"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b353938-7b41-4994-89db-d5e2f730d0bf"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/96aee6df-9ba4-40ce-a43f-cbe65256e037"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9380ae79-b290-4db6-888c-247941b9df23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=577ff341-f757-4c10-a238-d19d7ad0a219"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=301d7df5-55a5-4b8c-bb32-fdb125ed52ec"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3813559322033898, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64c935f8-a194-40d4-a59e-722a7697485a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8189655172413793, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3f9f095-3a3f-49d9-8e3b-7f493c7c42d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9289772727272727, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e49ccded-0968-4a4a-870c-8fc0de4562e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4931c8d9-6829-4821-b6ef-882cecd8fcad"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dba9d974-2849-4b16-b09e-244f9d9beada"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9bb21258-a7d2-4581-8be8-5c706d65eee2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e49ccded-0968-4a4a-870c-8fc0de4562e2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/be862d2a-f28c-47d0-a10b-36bf4d4a7a7c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b5fe0bd-9eba-48e0-942c-4b38263da23f"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96aee6df-9ba4-40ce-a43f-cbe65256e037"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/619a8b85-a7f0-415e-aaa6-6133f06cbc84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b353938-7b41-4994-89db-d5e2f730d0bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/890d5774-cce0-4923-9dff-8a2f535947ee"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/301d7df5-55a5-4b8c-bb32-fdb125ed52ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1320, 17, 1.2878787878787878, 286.97196969696984, 79, 2225, 92.0, 797.0, 960.0, 1284.9699999999984, 5.221126576720895, 722.6750806345152, 3.820629519043268], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1329.9827586206895, 987, 1732, 1295.0, 1581.2, 1724.2, 1732.0, 0.2630218489529009, 316.50460419321445, 1.293276376443219], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/64c935f8-a194-40d4-a59e-722a7697485a", 3, 0, 0.0, 442.0, 178, 688, 460.0, 688.0, 688.0, 688.0, 0.020544568016216513, 0.028322345556209938, 0.013174739255190927], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 631.7692307692307, 364, 1978, 422.0, 1671.9999999999998, 1978.0, 1978.0, 0.09548572855610889, 0.017250839631718893, 0.06490045612798026], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 631.7692307692307, 364, 1978, 422.0, 1671.9999999999998, 1978.0, 1978.0, 0.09702940737423496, 0.017529726918196747, 0.06594967532467533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 106.0, 80, 253, 82.0, 242.5, 252.5, 253.0, 0.11800036580113397, 0.049297418446997185, 0.06630606492380126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 91.10000000000001, 80, 246, 83.0, 88.60000000000001, 238.1499999999999, 246.0, 0.1180010620095581, 0.0876941486223376, 0.05923100182901646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 153.04999999999998, 80, 636, 82.0, 447.4000000000005, 627.6999999999998, 636.0, 0.11800315068412326, 3.4983094204865273, 0.06847409388330669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 205.20000000000005, 79, 960, 82.0, 810.4000000000013, 955.65, 960.0, 0.11789116287843063, 10.636465376102283, 0.06829398224559087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9380ae79-b290-4db6-888c-247941b9df23", 1, 0, 0.0, 933.0, 933, 933, 933.0, 933.0, 933.0, 933.0, 1.0718113612004287, 0.19363779474812431, 0.7389636923901393], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 227.92857142857142, 84, 598, 192.5, 433.0, 598.0, 598.0, 0.08796843189986679, 0.18675496825282129, 0.05686408052567422], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b3f9f095-3a3f-49d9-8e3b-7f493c7c42d9", 3, 0, 0.0, 299.6666666666667, 235, 401, 263.0, 401.0, 401.0, 401.0, 0.031597906112088306, 0.03169047810265106, 0.02026298015651496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 92.76470588235294, 81, 239, 83.0, 118.99999999999989, 239.0, 239.0, 0.08381113899337891, 0.06228542653707164, 0.04206926312753591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/577ff341-f757-4c10-a238-d19d7ad0a219", 3, 0, 0.0, 272.3333333333333, 170, 422, 225.0, 422.0, 422.0, 422.0, 0.09706224925585609, 0.04391814012553384, 0.062243694998058756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 91.76470588235296, 80, 245, 82.0, 120.19999999999989, 245.0, 245.0, 0.083812791804095, 0.022426469681955104, 0.047799482825772927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 500.0, 479, 551, 485.0, 551.0, 551.0, 551.0, 0.07229743163374122, 21.25784540097963, 0.041232128978618034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 818.75, 555, 961, 879.5, 961.0, 961.0, 961.0, 0.07220868309414206, 64.97349997743478, 0.041110998285043776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 161.75, 82, 243, 161.0, 243.0, 243.0, 243.0, 0.07262427829623444, 0.12851092995388358, 0.04021285722066887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 123.08333333333334, 81, 244, 83.0, 243.7, 244.0, 244.0, 0.10633772862611655, 0.07902637840280732, 0.05337655518928116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 121.25000000000003, 80, 243, 81.0, 243.0, 243.0, 243.0, 0.10649060220435547, 0.0284945556679623, 0.06073292156967147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 121.83333333333333, 80, 241, 81.0, 241.0, 241.0, 241.0, 0.10633961327827304, 0.02866184889140953, 0.06251606171242224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 169.0, 80, 328, 161.5, 302.80000000000007, 328.0, 328.0, 0.10633961327827304, 0.02866184889140953, 0.0626199089910143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 82.0, 81, 83, 82.0, 83.0, 83.0, 83.0, 0.07283055970285132, 0.05412505462291978, 0.040896066239394055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 119.29411764705884, 79, 243, 82.0, 241.4, 243.0, 243.0, 0.083812791804095, 0.02259016654094748, 0.04927275455670428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 652.7857142857143, 81, 960, 842.5, 952.5, 960.0, 960.0, 0.0727408762158118, 46.75729332823281, 0.03829855843170671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 118.6470588235294, 80, 244, 81.0, 242.4, 244.0, 244.0, 0.08381320501695985, 0.02259027791472746, 0.04935484631369804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 471.5714285714286, 80, 721, 635.0, 719.0, 721.0, 721.0, 0.07274012033294192, 15.282752051011606, 0.03836919572807664], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 443.53846153846155, 317, 933, 398.0, 760.9999999999998, 933.0, 933.0, 0.09699465783269168, 0.017523448924851526, 0.06687326995105501], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 306.99999999999994, 163, 568, 324.0, 544.0000000000001, 568.0, 568.0, 0.1061101777345477, 0.16445005084446015, 0.23864427668228844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be862d2a-f28c-47d0-a10b-36bf4d4a7a7c", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 502.3, 159, 940, 472.0, 799.3000000000001, 933.05, 940.0, 0.09083724690472081, 0.0557974885772162, 0.04107191925477122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 82.5, 81, 83, 83.0, 83.0, 83.0, 83.0, 0.07274049827241316, 0.0540581242044008, 0.03651232042189489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 150.7857142857143, 80, 248, 82.0, 247.5, 248.0, 248.0, 0.0727408762158118, 0.09750200037409594, 0.03712139023401779], "isController": false}, {"data": ["login", 20, 0, 0.0, 2145.3000000000006, 1350, 3710, 2003.0, 3062.2000000000007, 3679.0499999999997, 3710.0, 0.0866960566298642, 20.863998676801437, 0.15955799641078325], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 104.94117647058823, 82, 260, 84.0, 246.39999999999998, 260.0, 260.0, 0.08376158496627364, 0.06781089251664146, 0.029774625905980085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b5fe0bd-9eba-48e0-942c-4b38263da23f", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 736.6428571428571, 165, 1043, 926.0, 1035.5, 1043.0, 1043.0, 0.07270876504162577, 62.164310285953185, 0.15023570298988828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=619a8b85-a7f0-415e-aaa6-6133f06cbc84", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.5004544667590027, 1.9098424515235457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcd38a74-1dda-4c36-bf03-e0bc244a54c1", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=890d5774-cce0-4923-9dff-8a2f535947ee", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dba9d974-2849-4b16-b09e-244f9d9beada", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 321.7, 163, 1043, 246.5, 909.300000000001, 1038.6499999999999, 1043.0, 0.1178321245721221, 14.261173707381593, 0.26199236447832774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, 20.0, 738.0, 84, 1045, 952.0, 1045.0, 1045.0, 1045.0, 0.047551569677315046, 45.51311189954255, 0.09191755568288809], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b353938-7b41-4994-89db-d5e2f730d0bf", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 932.0434782608696, 470, 1452, 972.0, 1350.2, 1432.9999999999998, 1452.0, 0.09209098589406334, 0.029294568033216818, 0.041548862776423105], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/96aee6df-9ba4-40ce-a43f-cbe65256e037", 3, 0, 0.0, 305.0, 232, 447, 236.0, 447.0, 447.0, 447.0, 0.027236329632218764, 0.027316123566688152, 0.017466005656077786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 250.94117647058823, 165, 485, 178.0, 358.5999999999999, 485.0, 485.0, 0.08377685787502465, 0.12983776703873448, 0.18841611688103688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 93.15, 83, 246, 85.0, 88.9, 238.1499999999999, 246.0, 0.10606028466580404, 0.08234172491143966, 0.03770111681479753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9380ae79-b290-4db6-888c-247941b9df23", 3, 0, 0.0, 229.66666666666666, 167, 347, 175.0, 347.0, 347.0, 347.0, 0.06496459429610862, 0.030156090972086876, 0.04166023787868944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=577ff341-f757-4c10-a238-d19d7ad0a219", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 0.5699181782334385, 2.1749309936908516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 263.53846153846155, 163, 327, 323.0, 327.0, 327.0, 327.0, 0.07143642158478954, 0.110712501030333, 0.16066218643532257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 83.27272727272727, 80, 90, 83.0, 89.4, 90.0, 90.0, 0.060472787245739415, 0.04494120224024189, 0.030354504535459043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 141.18181818181816, 80, 246, 83.0, 245.4, 246.0, 246.0, 0.06041931001147967, 0.024416610366855065, 0.03399658974189969], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=301d7df5-55a5-4b8c-bb32-fdb125ed52ec", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 192.1818181818182, 79, 887, 82.0, 774.8000000000004, 887.0, 887.0, 0.0602070026217413, 4.939694861674411, 0.03492476519268978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 132.9090909090909, 80, 474, 82.0, 427.4000000000002, 474.0, 474.0, 0.060343408854023804, 1.627782739727906, 0.03506282057435954], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 905.1206896551722, 633, 1390, 869.5, 1223.4, 1384.05, 1390.0, 0.2735616787253912, 327.2748731829373, 0.5401774554518955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 932.0434782608696, 470, 1452, 972.0, 1350.2, 1432.9999999999998, 1452.0, 0.09281603861147207, 0.02952521065205285, 0.041875986170410245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 113.7, 80, 242, 82.5, 241.8, 242.0, 242.0, 0.048556889251446994, 0.013087599056054073, 0.028593558807248575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 82.10000000000001, 81, 83, 82.0, 83.0, 83.0, 83.0, 0.048556889251446994, 0.013087599056054073, 0.02854613997008896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 140.64999999999998, 80, 711, 82.0, 302.10000000000014, 690.8999999999996, 711.0, 0.10578092769873591, 4.786178936703338, 0.06173308827418417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 125.69999999999999, 79, 634, 82.0, 243.60000000000002, 614.4999999999998, 634.0, 0.10578148718192829, 1.5822493210150792, 0.06183671701865457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 130.29999999999998, 82, 245, 82.0, 244.7, 245.0, 245.0, 0.048556653475442475, 0.01299269829323363, 0.027692466435213284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 91.45000000000002, 81, 243, 83.0, 91.50000000000001, 235.4499999999999, 243.0, 0.105783725173882, 0.07861466294660567, 0.05309847142517124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 99.5, 81, 246, 83.0, 230.30000000000007, 246.0, 246.0, 0.04855618193030246, 0.03608520942281267, 0.02437292725798385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 97.80000000000001, 80, 244, 82.0, 222.20000000000033, 243.65, 244.0, 0.10578092769873591, 0.0362485620405141, 0.0598839880732004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 105.19999999999999, 84, 245, 86.5, 230.90000000000003, 245.0, 245.0, 0.04958620313483976, 0.03902976535808676, 0.01762634564558757], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 490.0, 347, 688, 447.0, 675.2, 688.0, 688.0, 0.09702144173862425, 0.017528287814106917, 0.06603900868341903], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1212.3999999999996, 765, 2225, 1089.5, 1895.1000000000004, 2209.1499999999996, 2225.0, 0.08788890841975742, 0.04548937642819476, 0.04042546471260327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 230.99999999999997, 164, 489, 167.5, 472.9000000000001, 489.0, 489.0, 0.04853685646195439, 0.07522264766125157, 0.10916052776550875], "isController": false}, {"data": ["addBook", 59, 12, 20.338983050847457, 812.3389830508474, 419, 1653, 681.0, 1372.0, 1485.0, 1653.0, 0.28637162299903896, 82.38291507352227, 1.0423868301209556], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64c935f8-a194-40d4-a59e-722a7697485a", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 140.6379310344828, 81, 394, 83.0, 331.1, 335.1, 394.0, 0.2746992516813489, 0.2041466118452212, 0.1327891890451833], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 523.2586206896551, 393, 803, 480.5, 660.1000000000001, 728.4499999999999, 803.0, 0.27435750675250586, 80.67021651182813, 0.13798253513431694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3f9f095-3a3f-49d9-8e3b-7f493c7c42d9", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 120.8103448275862, 80, 335, 84.0, 243.0, 246.34999999999997, 335.0, 0.2750822875463609, 0.48676670413477136, 0.13378025312313252], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 761.2068965517241, 551, 1058, 730.5, 960.4, 1046.05, 1058.0, 0.2740450945928068, 246.58625783450037, 0.13755779162177997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 89.99999999999999, 83, 105, 88.0, 103.0, 105.0, 105.0, 0.07199583531783392, 0.05378595118959272, 0.025592269585636276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 12, 6.818181818181818, 130.57386363636365, 82, 599, 87.0, 244.50000000000006, 278.0, 442.6899999999979, 0.7348980537728246, 1.5767621373006693, 0.35188855229258964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 86.18181818181819, 83, 93, 85.0, 92.0, 93.0, 93.0, 0.05963869792457331, 0.04618504634197914, 0.021199693402875672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e49ccded-0968-4a4a-870c-8fc0de4562e2", 3, 0, 0.0, 311.3333333333333, 184, 482, 268.0, 482.0, 482.0, 482.0, 0.042075146211133084, 0.02705026489810802, 0.02698178321482167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 86.49999999999999, 83, 103, 85.0, 91.9, 102.44999999999999, 103.0, 0.11482176791076053, 0.09318055579476757, 0.04081555031202816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4931c8d9-6829-4821-b6ef-882cecd8fcad", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.7740885416666667, 3.3148871527777777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dba9d974-2849-4b16-b09e-244f9d9beada", 3, 0, 0.0, 289.3333333333333, 170, 512, 186.0, 512.0, 512.0, 512.0, 0.019947206393744556, 0.02357692266135628, 0.012791665558488534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bb21258-a7d2-4581-8be8-5c706d65eee2", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e49ccded-0968-4a4a-870c-8fc0de4562e2", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 306.0, 163, 971, 169.0, 858.4000000000003, 971.0, 971.0, 0.06017900518633608, 6.629788077581679, 0.13394423286813137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be862d2a-f28c-47d0-a10b-36bf4d4a7a7c", 3, 0, 0.0, 565.3333333333334, 182, 897, 617.0, 897.0, 897.0, 897.0, 0.017852042273636105, 0.024610481454703417, 0.011448087004903362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b5fe0bd-9eba-48e0-942c-4b38263da23f", 3, 0, 0.0, 411.0, 255, 598, 380.0, 598.0, 598.0, 598.0, 0.03588430898782326, 0.0291676821427717, 0.023011747625654888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 249.6, 164, 795, 167.0, 474.8000000000002, 779.3999999999997, 795.0, 0.10573339324892285, 6.480367663093759, 0.2364442355475668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96aee6df-9ba4-40ce-a43f-cbe65256e037", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 87.33333333333334, 83, 98, 86.0, 97.10000000000001, 98.0, 98.0, 0.10067283008104162, 0.08346800072148862, 0.03578604506787027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/619a8b85-a7f0-415e-aaa6-6133f06cbc84", 3, 0, 0.0, 350.0, 199, 614, 237.0, 614.0, 614.0, 614.0, 0.03790750568612586, 0.024370873610058123, 0.024309175195855445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 85.92857142857143, 82, 93, 86.0, 90.5, 93.0, 93.0, 0.07162114460820676, 0.05560430660500427, 0.025459078747448495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b353938-7b41-4994-89db-d5e2f730d0bf", 3, 0, 0.0, 275.0, 188, 377, 260.0, 377.0, 377.0, 377.0, 0.038524263865524634, 0.02476738969219113, 0.024704687439805837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/890d5774-cce0-4923-9dff-8a2f535947ee", 3, 0, 0.0, 279.3333333333333, 192, 427, 219.0, 427.0, 427.0, 427.0, 0.016474645520543885, 0.022711628834473745, 0.010564795467275862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/301d7df5-55a5-4b8c-bb32-fdb125ed52ec", 3, 0, 0.0, 620.0, 177, 1027, 656.0, 1027.0, 1027.0, 1027.0, 0.024943254096929487, 0.025016330036666583, 0.01599551125356481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 82.23076923076924, 80, 85, 82.0, 84.2, 85.0, 85.0, 0.0715307582260372, 0.053159088876967096, 0.03590508762517883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 143.07692307692307, 80, 243, 82.0, 243.0, 243.0, 243.0, 0.0714690181806187, 0.019123545880360863, 0.0407596744311341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 155.53846153846155, 81, 244, 85.0, 243.2, 244.0, 244.0, 0.07153154541152648, 0.019279986849200497, 0.042052724939198184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 142.92307692307693, 80, 244, 82.0, 244.0, 244.0, 244.0, 0.0714690181806187, 0.019263133806494886, 0.042085759729407306], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 23.529411764705884, 0.30303030303030304], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07575757575757576], "isController": false}, {"data": ["401/Unauthorized", 12, 70.58823529411765, 0.9090909090909091], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1320, 17, "401/Unauthorized", 12, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
