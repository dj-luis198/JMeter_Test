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

    var data = {"OkPercent": 98.31189710610933, "KoPercent": 1.6881028938906752};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7272411396803335, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4340861-ff33-421d-ac79-85386ce19507"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0d9735a-4ee5-4375-a3f6-da8dc81d2ff0"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fc5535d-f0f3-48bf-a877-0b2bc8716954"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa5e42e9-de52-4780-bf84-14b398171297"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa8b8f46-31ab-404e-bf2f-d9867c25f1ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b504bc3d-da28-41dc-9e26-31805d97d530"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/60cb4279-fb1e-4bd9-a352-bf2091f7fde3"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a5bf878-e72b-4404-a8f2-d0819c3f9584"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bed3d344-fef3-47f8-8ea3-7e8a1b7fe44b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5476190476190477, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/047f7cb7-6e72-45df-bc07-b517c73adbc6"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c363dd26-aec1-4c45-b2c3-391b52c86a73"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/08a40a34-1ad7-4ca5-bdc1-de125d18092c"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "register"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.20909090909090908, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0fc5535d-f0f3-48bf-a877-0b2bc8716954"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccbd6a3b-ccaa-4b4d-ae0b-4a577cec6430"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0d9735a-4ee5-4375-a3f6-da8dc81d2ff0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64e10d74-7fda-4bc4-9211-53b4b6215d0b"], "isController": false}, {"data": [0.25925925925925924, 500, 1500, "addBook"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8957055214723927, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64e10d74-7fda-4bc4-9211-53b4b6215d0b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ccbd6a3b-ccaa-4b4d-ae0b-4a577cec6430"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bed3d344-fef3-47f8-8ea3-7e8a1b7fe44b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08a40a34-1ad7-4ca5-bdc1-de125d18092c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0a5bf878-e72b-4404-a8f2-d0819c3f9584"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b504bc3d-da28-41dc-9e26-31805d97d530"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4340861-ff33-421d-ac79-85386ce19507"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c363dd26-aec1-4c45-b2c3-391b52c86a73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbf29d9a-e2c5-4311-98ae-428beda82e9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1244, 21, 1.6881028938906752, 494.5980707395496, 135, 3061, 163.0, 1368.5, 1641.5, 2239.1499999999987, 4.822770922258018, 689.5543351329073, 3.5337832328750927], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4340861-ff33-421d-ac79-85386ce19507", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2354.4909090909096, 1684, 3436, 2298.0, 2856.0, 2949.799999999999, 3436.0, 0.26091205366249365, 313.96562898780354, 1.282902529483062], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b0d9735a-4ee5-4375-a3f6-da8dc81d2ff0", 3, 0, 0.0, 607.0, 235, 1324, 262.0, 1324.0, 1324.0, 1324.0, 0.06501246072163831, 0.029416445443710044, 0.04169093347058186], "isController": false}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 729.8181818181819, 162, 1366, 541.0, 1357.6000000000001, 1366.0, 1366.0, 0.09584052137243626, 0.018310440517887328, 0.06472468448864725], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 729.8181818181819, 162, 1366, 541.0, 1357.6000000000001, 1366.0, 1366.0, 0.09655898876404495, 0.01844770452949438, 0.06520989235867275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 205.52631578947367, 135, 570, 141.0, 414.0, 570.0, 570.0, 0.1091496096465276, 0.02920604789369977, 0.062249386751535275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 185.73684210526312, 135, 427, 142.0, 426.0, 427.0, 427.0, 0.10915337197745695, 0.08111886335434057, 0.05478987616837195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 244.57894736842104, 135, 446, 143.0, 423.0, 446.0, 446.0, 0.1091577616913708, 0.029421427955877284, 0.06427942412099276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 228.78947368421055, 135, 441, 142.0, 421.0, 441.0, 441.0, 0.10915399905782865, 0.029420413808555375, 0.06417061272735629], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fc5535d-f0f3-48bf-a877-0b2bc8716954", 1, 0, 0.0, 1216.0, 1216, 1216, 1216.0, 1216.0, 1216.0, 1216.0, 0.8223684210526315, 0.14857241981907895, 0.5669844777960527], "isController": false}, {"data": ["goToProfile", 11, 1, 9.090909090909092, 310.54545454545456, 149, 673, 249.0, 636.6000000000001, 673.0, 673.0, 0.09752897053738463, 0.21576899376701214, 0.06304229709540993], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/aa5e42e9-de52-4780-bf84-14b398171297", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.8701251702997276, 1.6258302111716623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 179.0, 137, 424, 143.0, 418.6, 424.0, 424.0, 0.10100533981563159, 0.07506353867157776, 0.050699945962143195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1071.1666666666665, 833, 1130, 1120.0, 1130.0, 1130.0, 1130.0, 0.029698853624250104, 8.732449060278773, 0.016937627457580137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 233.26666666666668, 136, 422, 146.0, 418.4, 422.0, 422.0, 0.1008301683863812, 0.037076093167075594, 0.056940161496319704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1406.3333333333333, 1213, 1881, 1315.0, 1881.0, 1881.0, 1881.0, 0.029643097110786134, 26.672910887292005, 0.016876880483972966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 280.8333333333333, 140, 434, 275.5, 434.0, 434.0, 434.0, 0.029759838106480703, 0.05266096352435843, 0.016478347857787654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 166.08333333333331, 137, 426, 142.0, 343.5000000000003, 426.0, 426.0, 0.05651500237833968, 0.041999918759684084, 0.028367882053190036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa8b8f46-31ab-404e-bf2f-d9867c25f1ee", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 0.9337308114035087, 1.7446774488304093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 162.33333333333331, 136, 414, 140.0, 332.4000000000003, 414.0, 414.0, 0.05651819650434955, 0.015123033049015406, 0.03223303394388685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 186.99999999999997, 135, 423, 139.5, 419.7, 423.0, 423.0, 0.0565171317555634, 0.0152331331684917, 0.03322589191098552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 186.33333333333331, 137, 421, 141.0, 416.8, 421.0, 421.0, 0.05651766412494171, 0.015233276658675696, 0.033281397917324075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 141.66666666666666, 138, 146, 141.5, 146.0, 146.0, 146.0, 0.02980048574791769, 0.02214665005289586, 0.0167336711963405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 770.2380952380953, 135, 1807, 405.0, 1764.4, 1804.8, 1807.0, 0.09868792059851875, 38.07215588608829, 0.054382991959284185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 298.53333333333336, 138, 1389, 143.0, 810.0000000000003, 1389.0, 1389.0, 0.10100738027258525, 6.084517557187012, 0.0588026038019178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 606.7142857142857, 138, 1274, 431.0, 1251.8, 1272.1, 1274.0, 0.09855175844494711, 12.434102677440094, 0.054404200358071385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 273.4, 136, 844, 142.0, 694.0000000000001, 844.0, 844.0, 0.10070223021872524, 1.9993195256589282, 0.058723299223250126], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 582.4545454545455, 154, 1216, 535.0, 1188.6000000000001, 1216.0, 1216.0, 0.09678242431174498, 0.018490392144786507, 0.06609971504174841], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 379.83333333333337, 278, 848, 289.0, 763.1000000000004, 848.0, 848.0, 0.05647776423357321, 0.0875295037487116, 0.12701981545890537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b504bc3d-da28-41dc-9e26-31805d97d530", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60cb4279-fb1e-4bd9-a352-bf2091f7fde3", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.5287018832781457, 0.9878802773178809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 782.7142857142858, 161, 1625, 815.0, 1488.2000000000003, 1615.6999999999998, 1625.0, 0.09157469224362356, 0.05625047013792893, 0.041405354012497765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 182.90476190476193, 136, 429, 144.0, 412.0, 427.4, 429.0, 0.0986837467869042, 0.07333821416487706, 0.04953461508639528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a5bf878-e72b-4404-a8f2-d0819c3f9584", 1, 0, 0.0, 1079.0, 1079, 1079, 1079.0, 1079.0, 1079.0, 1079.0, 0.9267840593141798, 0.1674365732159407, 0.6389741658943466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 246.90476190476195, 137, 431, 144.0, 426.8, 430.8, 431.0, 0.0985536084699787, 0.0898091755756, 0.052659084882815066], "isController": false}, {"data": ["login", 21, 0, 0.0, 3182.1428571428564, 1270, 5039, 3101.0, 4729.0, 5013.2, 5039.0, 0.09262158788686052, 31.785279039073078, 0.183627983462636], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bed3d344-fef3-47f8-8ea3-7e8a1b7fe44b", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.28495908911671924, 1.0874654968454258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 147.79999999999995, 139, 181, 146.0, 163.60000000000002, 181.0, 181.0, 0.10737371062069163, 0.08692656846147788, 0.038167998697198974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 974.2380952380954, 286, 1973, 841.0, 1907.0, 1968.5, 1973.0, 0.09848335631278314, 50.58164534033034, 0.21069228083935956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/047f7cb7-6e72-45df-bc07-b517c73adbc6", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1199.0, 149, 2027, 1379.0, 2027.0, 2027.0, 2027.0, 0.03949583565782783, 35.440704871070785, 0.07333632277724843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 471.2631578947369, 277, 855, 302.0, 849.0, 855.0, 855.0, 0.10906001744960278, 0.1690217262622262, 0.24527853533831565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c363dd26-aec1-4c45-b2c3-391b52c86a73", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08a40a34-1ad7-4ca5-bdc1-de125d18092c", 3, 0, 0.0, 533.0, 290, 973, 336.0, 973.0, 973.0, 973.0, 0.015103610769881386, 0.0208215467481926, 0.009685583729383572], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 1411.0000000000002, 511, 2706, 1438.0, 2263.0, 2667.8999999999996, 2706.0, 0.09404304484509766, 0.029545889647204237, 0.042429576873471805], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 582.3333333333333, 279, 1533, 556.0, 1224.6000000000001, 1533.0, 1533.0, 0.10060227226998968, 8.169205791169803, 0.22454086590052447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 167.76923076923077, 141, 427, 145.0, 319.39999999999986, 427.0, 427.0, 0.07262772703148133, 0.05638578416994888, 0.025816887343221878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 407.14285714285717, 282, 572, 298.0, 571.5, 572.0, 572.0, 0.0959219469414602, 0.14866028300400133, 0.21573070684197546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 143.22222222222223, 138, 152, 141.0, 152.0, 152.0, 152.0, 0.04436732198844477, 0.0329721992511782, 0.02227031591998107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 173.22222222222223, 137, 426, 141.0, 426.0, 426.0, 426.0, 0.044307474178588664, 0.011855710864192669, 0.025269106367476344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 140.66666666666666, 136, 150, 141.0, 150.0, 150.0, 150.0, 0.04437016550071732, 0.011959146170115214, 0.02608480432757014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 139.22222222222223, 136, 146, 139.0, 146.0, 146.0, 146.0, 0.04437060299649472, 0.011959264088898969, 0.02612839219422492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 154.0, 154, 154, 154.0, 154.0, 154.0, 154.0, 6.493506493506494, 1.9150771103896105, 4.014052353896104], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1616.8181818181818, 1093, 2835, 1545.0, 2171.7999999999997, 2348.999999999999, 2835.0, 0.24668655109775514, 295.12287723419524, 0.48710957648404385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 1411.0000000000002, 511, 2706, 1438.0, 2263.0, 2667.8999999999996, 2706.0, 0.09284886857021585, 0.029170710382272057, 0.04189079812445285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 233.0, 136, 423, 142.5, 423.0, 423.0, 423.0, 0.03534130868866074, 0.009525587107490591, 0.020811337050060965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 232.16666666666669, 139, 416, 141.5, 416.0, 416.0, 416.0, 0.035341100521870256, 0.009525531000035342, 0.02077670167399013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 530.4615384615385, 138, 1528, 408.0, 1522.4, 1528.0, 1528.0, 0.06987744571059987, 14.52429899987906, 0.03969450454203397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fc5535d-f0f3-48bf-a877-0b2bc8716954", 3, 0, 0.0, 441.33333333333337, 269, 758, 297.0, 758.0, 758.0, 758.0, 0.03806623524933384, 0.03136251348179165, 0.024410964661844944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 361.6153846153846, 137, 1108, 142.0, 1098.0, 1108.0, 1108.0, 0.07014552498529641, 4.774184946095862, 0.03991529084762773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 140.0, 136, 148, 139.5, 148.0, 148.0, 148.0, 0.03539948316754575, 0.009472127331940954, 0.020188767743990938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 164.23076923076923, 137, 416, 143.0, 309.19999999999993, 416.0, 416.0, 0.0704004159039955, 0.052319059084902905, 0.03533770876431024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 235.66666666666666, 137, 443, 144.0, 443.0, 443.0, 443.0, 0.03539760358223748, 0.026306226880940163, 0.0177679377356153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 207.0, 135, 442, 142.0, 434.4, 442.0, 442.0, 0.0702949685024468, 0.043173953010517206, 0.03872771176359261], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 146.33333333333334, 141, 155, 144.5, 155.0, 155.0, 155.0, 0.036737917817277845, 0.02891675953195893, 0.013059181724110485], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 647.8181818181819, 151, 1324, 539.0, 1253.8000000000002, 1324.0, 1324.0, 0.09150805270863836, 0.01725524715493145, 0.06227811896878743], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccbd6a3b-ccaa-4b4d-ae0b-4a577cec6430", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1639.5714285714287, 814, 3061, 1508.0, 2786.2000000000003, 3044.3999999999996, 3061.0, 0.09380108809262187, 0.04854939129793906, 0.043144836417602445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 471.0, 278, 867, 286.5, 867.0, 867.0, 867.0, 0.03531073446327684, 0.054724741790254244, 0.0794146694032486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0d9735a-4ee5-4375-a3f6-da8dc81d2ff0", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 0.6383889134275619, 2.4362301236749118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64e10d74-7fda-4bc4-9211-53b4b6215d0b", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["addBook", 54, 11, 20.37037037037037, 1510.592592592593, 713, 4713, 1205.0, 2525.0, 3110.75, 4713.0, 0.2417145619594994, 70.54354425586605, 0.879498121956187], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 261.23636363636365, 138, 639, 144.0, 576.1999999999999, 596.3999999999999, 639.0, 0.24792978628452422, 0.1842525071899638, 0.11984887129964794], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 915.2909090909092, 676, 1268, 838.0, 1225.6, 1250.6, 1268.0, 0.24784040880148886, 72.8733092637112, 0.12464629934840503], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 211.94545454545457, 135, 570, 144.0, 423.0, 425.59999999999997, 570.0, 0.2484752654167608, 0.4396847470070025, 0.12084050993901062], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1353.7636363636366, 951, 2262, 1370.0, 1680.6, 1807.9999999999993, 2262.0, 0.2473811333654179, 222.59397865185153, 0.12417373295881329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 149.64285714285714, 140, 168, 148.5, 161.5, 168.0, 168.0, 0.09417209277296454, 0.07035317477667762, 0.033475236102889744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 11, 6.748466257668712, 247.8343558282209, 137, 2581, 151.0, 434.99999999999994, 584.5999999999997, 2350.599999999995, 0.662399674895865, 1.4502454155237225, 0.3159645496799756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 207.66666666666666, 140, 430, 149.0, 430.0, 430.0, 430.0, 0.04321002472573637, 0.033462450788582954, 0.0153598134767266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 179.36842105263162, 139, 446, 146.0, 410.0, 446.0, 446.0, 0.10620398991621065, 0.0861870269730186, 0.037752199540528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 318.44444444444446, 280, 567, 284.0, 567.0, 567.0, 567.0, 0.04427434350987318, 0.06861658510758666, 0.0995740362336308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 698.7692307692308, 279, 1780, 553.0, 1734.8, 1780.0, 1780.0, 0.06982265046781176, 19.35989287929812, 0.15291013589904717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64e10d74-7fda-4bc4-9211-53b4b6215d0b", 3, 0, 0.0, 348.0, 249, 472, 323.0, 472.0, 472.0, 472.0, 0.024354405306013103, 0.02030326562132147, 0.015617896631785746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccbd6a3b-ccaa-4b4d-ae0b-4a577cec6430", 3, 0, 0.0, 582.3333333333334, 452, 804, 491.0, 804.0, 804.0, 804.0, 0.022284453622337937, 0.02234974010755963, 0.014290486209637285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bed3d344-fef3-47f8-8ea3-7e8a1b7fe44b", 3, 0, 0.0, 503.3333333333333, 353, 673, 484.0, 673.0, 673.0, 673.0, 0.017985395858562847, 0.021258129024232325, 0.011533603463987243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08a40a34-1ad7-4ca5-bdc1-de125d18092c", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 149.16666666666666, 143, 160, 147.5, 158.5, 160.0, 160.0, 0.0559357112225682, 0.04637638557418007, 0.01988339734864729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 196.52380952380955, 139, 439, 155.0, 421.8, 437.59999999999997, 439.0, 0.09427778725543894, 0.07319418053522847, 0.033512807188456804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a5bf878-e72b-4404-a8f2-d0819c3f9584", 3, 0, 0.0, 695.6666666666666, 236, 1152, 699.0, 1152.0, 1152.0, 1152.0, 0.015973335179140954, 0.022020532058483706, 0.010243317155894428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b504bc3d-da28-41dc-9e26-31805d97d530", 3, 0, 0.0, 375.6666666666667, 238, 488, 401.0, 488.0, 488.0, 488.0, 0.0210551434206186, 0.021116828411108693, 0.013502159029498256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4340861-ff33-421d-ac79-85386ce19507", 3, 0, 0.0, 376.0, 244, 539, 345.0, 539.0, 539.0, 539.0, 0.021656896999797868, 0.025597719077560567, 0.013888049182813087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c363dd26-aec1-4c45-b2c3-391b52c86a73", 3, 0, 0.0, 579.3333333333334, 314, 786, 638.0, 786.0, 786.0, 786.0, 0.0697852939123962, 0.03157602816999698, 0.04475163704668637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbf29d9a-e2c5-4311-98ae-428beda82e9d", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 144.5, 140, 156, 143.0, 154.0, 156.0, 156.0, 0.09601470396609309, 0.0713546774591766, 0.04819488070173032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 160.57142857142856, 135, 421, 140.0, 284.5, 421.0, 421.0, 0.0960166794688906, 0.025691963061011742, 0.05475951250960167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 240.42857142857142, 136, 425, 142.5, 424.0, 425.0, 425.0, 0.09601931359907821, 0.02588020561850155, 0.05644885428383309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 180.64285714285714, 137, 416, 141.0, 416.0, 416.0, 416.0, 0.09601602095892571, 0.025879318149085447, 0.05654068421702364], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 28.571428571428573, 0.48231511254019294], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.761904761904762, 0.08038585209003216], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.08038585209003216], "isController": false}, {"data": ["401/Unauthorized", 13, 61.904761904761905, 1.045016077170418], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1244, 21, "401/Unauthorized", 13, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
