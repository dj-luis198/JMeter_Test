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

    var data = {"OkPercent": 97.57709251101322, "KoPercent": 2.4229074889867843};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.810853199498118, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.47413793103448276, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f56d12f-e187-46a9-9c96-d2719de889f4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/103662b1-025b-44a1-be04-6fbe85ab1c5a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8ec1729-e7b8-4a12-8e61-ba1bd532fa3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5bd51de-fe9a-4bc8-b462-0eb9e281ed24"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/170d7f2f-39ea-44c3-a746-abd7d3a7c160"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fadecee8-917e-483d-ae47-932567ab97a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8269230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34d97a1b-9c70-446c-842c-116fe9d40fb1"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f6279936-5682-4260-8ffc-7ddd7caf5480"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d341839-954c-4de5-a75e-74911aaffe52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e36c662f-4620-4ddd-b288-ddf691187737"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d9e63a0-9632-48e1-a4fa-bb9d038cc117"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0003b73a-a409-41d6-818d-e58318ab05e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/efda4e48-d19f-4feb-ad81-92116559bb02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef7a13c7-c6c7-4831-9ec6-f1ea0ba5fabe"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.36538461538461536, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f56d12f-e187-46a9-9c96-d2719de889f4"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e8ec1729-e7b8-4a12-8e61-ba1bd532fa3c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36538461538461536, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0003b73a-a409-41d6-818d-e58318ab05e2"], "isController": false}, {"data": [0.4791666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d9e63a0-9632-48e1-a4fa-bb9d038cc117"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9be93f8-2a01-45ca-b478-f956360dc674"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5bd51de-fe9a-4bc8-b462-0eb9e281ed24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd065444-5cbd-4c50-90d1-d034d508d6dd"], "isController": false}, {"data": [0.4083333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.853448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34d97a1b-9c70-446c-842c-116fe9d40fb1"], "isController": false}, {"data": [0.9382022471910112, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fadecee8-917e-483d-ae47-932567ab97a2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=103662b1-025b-44a1-be04-6fbe85ab1c5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a1eef67-a1a6-457f-943d-1edabc25c6c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d341839-954c-4de5-a75e-74911aaffe52"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e36c662f-4620-4ddd-b288-ddf691187737"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=170d7f2f-39ea-44c3-a746-abd7d3a7c160"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6279936-5682-4260-8ffc-7ddd7caf5480"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cc8f1775-489d-4f26-9ab3-3945f4e36383"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1362, 33, 2.4229074889867843, 278.73127753303936, 83, 2108, 97.0, 740.1000000000001, 845.8499999999999, 1248.1099999999997, 5.379571846117387, 768.9715953694011, 3.9197501530531635], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1253.8793103448277, 1014, 1824, 1206.5, 1478.3, 1545.4499999999998, 1824.0, 0.25387820849529014, 305.5007463827827, 1.2483171677478377], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f56d12f-e187-46a9-9c96-d2719de889f4", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.4949700342465754, 1.8889126712328768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/103662b1-025b-44a1-be04-6fbe85ab1c5a", 3, 0, 0.0, 622.6666666666667, 183, 1469, 216.0, 1469.0, 1469.0, 1469.0, 0.018267064482737624, 0.025182623074346953, 0.01171423080435974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8ec1729-e7b8-4a12-8e61-ba1bd532fa3c", 1, 0, 0.0, 994.0, 994, 994, 994.0, 994.0, 994.0, 994.0, 1.006036217303823, 0.18175459004024144, 0.6936148138832998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5bd51de-fe9a-4bc8-b462-0eb9e281ed24", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 406.5, 86, 755, 442.0, 750.8, 755.0, 755.0, 0.08304914952480315, 0.017376250278993234, 0.05545396092537515], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 406.5, 86, 755, 442.0, 750.8, 755.0, 755.0, 0.08193992779043864, 0.01714416946201316, 0.05471330627608635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 141.0, 83, 255, 86.0, 254.4, 255.0, 255.0, 0.13224597751818382, 0.04862794798324884, 0.07468109433546397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 97.53333333333333, 84, 259, 86.0, 157.60000000000008, 259.0, 259.0, 0.13224364569282449, 0.09827872497289004, 0.06638011121690603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 140.66666666666669, 84, 418, 85.0, 319.6, 418.0, 418.0, 0.13224364569282449, 2.6255357245188535, 0.07711629781709822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 162.53333333333333, 84, 742, 86.0, 449.20000000000016, 742.0, 742.0, 0.13224481159522508, 7.966208764414684, 0.07698783237529314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/170d7f2f-39ea-44c3-a746-abd7d3a7c160", 3, 0, 0.0, 261.6666666666667, 209, 359, 217.0, 359.0, 359.0, 359.0, 0.03315796454308325, 0.02695163979950484, 0.02126340825191211], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 225.125, 83, 920, 185.0, 560.2000000000004, 920.0, 920.0, 0.08296818688584096, 0.13927453881355492, 0.05361738053877466], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 86.31250000000001, 84, 90, 86.0, 89.3, 90.0, 90.0, 0.07896204393250719, 0.05868175335218553, 0.03963524470830928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 106.68750000000001, 83, 255, 86.0, 251.5, 255.0, 255.0, 0.07896282331574765, 0.028541127909903416, 0.0446190074619868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 518.6666666666666, 413, 686, 502.0, 686.0, 686.0, 686.0, 0.03115038366889219, 9.15924708873706, 0.017765453186165077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 712.0, 577, 849, 750.0, 849.0, 849.0, 849.0, 0.03109694472518075, 27.98108552631579, 0.017704608178496464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fadecee8-917e-483d-ae47-932567ab97a2", 3, 0, 0.0, 471.33333333333337, 177, 831, 406.0, 831.0, 831.0, 831.0, 0.01942061822301343, 0.026772890030749313, 0.012453977180773589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 170.33333333333334, 84, 258, 171.0, 258.0, 258.0, 258.0, 0.03117628108535027, 0.05516740363931121, 0.017262647827532812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 98.92307692307693, 83, 250, 87.0, 186.39999999999995, 250.0, 250.0, 0.06624710168930109, 0.04923246522027161, 0.03325293971513746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 123.76923076923076, 83, 255, 85.0, 254.2, 255.0, 255.0, 0.06624811447674181, 0.025380512607525788, 0.037354142672958536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 149.3846153846154, 83, 745, 85.0, 550.5999999999999, 745.0, 745.0, 0.06624811447674181, 4.601880084861286, 0.03850870716804599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 137.3846153846154, 83, 418, 86.0, 354.4, 418.0, 418.0, 0.06624845207943698, 1.514885915706489, 0.038573599163740695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 85.83333333333334, 84, 92, 84.5, 92.0, 92.0, 92.0, 0.03120319520718922, 0.023189093313155267, 0.01752132543372441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 126.43750000000001, 83, 748, 85.0, 285.30000000000047, 748.0, 748.0, 0.07896360271437385, 4.460677243985194, 0.04599784083898828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 26, 0, 0.0, 336.30769230769243, 84, 765, 171.0, 760.9, 764.3, 765.0, 0.15708830779641356, 48.95595395839879, 0.08767774390980715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 116.6875, 84, 420, 86.0, 301.7000000000001, 420.0, 420.0, 0.07896282331574765, 1.4710585059000034, 0.04607449895621018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 26, 0, 0.0, 258.50000000000006, 83, 595, 89.0, 586.3, 592.2, 595.0, 0.15708830779641356, 16.016245706504666, 0.08783115046038958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34d97a1b-9c70-446c-842c-116fe9d40fb1", 3, 0, 0.0, 277.6666666666667, 159, 399, 275.0, 399.0, 399.0, 399.0, 0.025453064548971695, 0.02552763407401751, 0.01632244048225073], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 433.4375, 87, 1326, 368.5, 1093.6000000000001, 1326.0, 1326.0, 0.082115711301688, 0.017180948385143214, 0.0551514457497421], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 275.6923076923077, 169, 832, 175.0, 700.8, 832.0, 832.0, 0.06621841890790546, 6.1885967425631625, 0.14762349894305216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6279936-5682-4260-8ffc-7ddd7caf5480", 3, 0, 0.0, 758.3333333333334, 519, 920, 836.0, 920.0, 920.0, 920.0, 0.0750206306734352, 0.03394488171747231, 0.048108933081597444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d341839-954c-4de5-a75e-74911aaffe52", 3, 0, 0.0, 470.3333333333333, 191, 803, 417.0, 803.0, 803.0, 803.0, 0.06860592755214051, 0.031801706000731796, 0.04399533765550677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e36c662f-4620-4ddd-b288-ddf691187737", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 529.0, 86, 2056, 526.0, 860.0, 1764.75, 2056.0, 0.10197794726890311, 0.06264075081263677, 0.04610916951709193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 26, 0, 0.0, 111.3846153846154, 83, 347, 86.0, 253.3, 314.4499999999999, 347.0, 0.15724791948906522, 0.11686100266716663, 0.07893108458728469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 26, 0, 0.0, 124.34615384615387, 83, 257, 86.0, 253.6, 256.3, 257.0, 0.1572507726456233, 0.123832620916772, 0.0851105631694498], "isController": false}, {"data": ["login", 24, 0, 0.0, 2091.875, 1397, 3766, 1957.0, 3194.5, 3739.75, 3766.0, 0.10400190670162286, 31.248231087361603, 0.2000310109852014], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d9e63a0-9632-48e1-a4fa-bb9d038cc117", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 101.875, 86, 256, 90.0, 162.9000000000001, 256.0, 256.0, 0.07438608236398969, 0.06022076394506588, 0.026441927715324463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0003b73a-a409-41d6-818d-e58318ab05e2", 3, 0, 0.0, 317.6666666666667, 180, 390, 383.0, 390.0, 390.0, 390.0, 0.052368816115630344, 0.03366810280871417, 0.03358286710540097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efda4e48-d19f-4feb-ad81-92116559bb02", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.8995378521126761, 1.6807878521126762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef7a13c7-c6c7-4831-9ec6-f1ea0ba5fabe", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 26, 0, 0.0, 455.5384615384616, 171, 852, 338.0, 847.9, 851.3, 852.0, 0.15700483091787437, 65.17799266870472, 0.3392021437198068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, 57.142857142857146, 391.21428571428567, 83, 937, 87.0, 890.0, 937.0, 937.0, 0.06658549577657713, 34.149924675157905, 0.0895578633903432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 316.4, 171, 828, 334.0, 639.0000000000001, 828.0, 828.0, 0.13214229081875362, 10.730349753114155, 0.29493711954032104], "isController": false}, {"data": ["register", 26, 7, 26.923076923076923, 853.6923076923076, 152, 1362, 865.0, 1279.7, 1359.9, 1362.0, 0.10157281598912389, 0.031970410080711324, 0.04582679783884301], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 245.93749999999997, 170, 839, 173.5, 490.4000000000003, 839.0, 839.0, 0.07892854500160325, 6.016302328700392, 0.17624998458426855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 103.93333333333334, 86, 257, 93.0, 164.60000000000005, 257.0, 257.0, 0.0794600951402206, 0.06169021058249547, 0.028245580694375286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 333.4615384615385, 170, 826, 337.0, 802.0, 826.0, 826.0, 0.09101601881931219, 16.871171474617032, 0.2011144977140977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 117.45454545454547, 84, 254, 87.0, 254.0, 254.0, 254.0, 0.057181175956875, 0.042494995022638545, 0.028702269962728268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 130.72727272727272, 83, 257, 86.0, 256.0, 257.0, 257.0, 0.057182067703568165, 0.023108378212592533, 0.032175066149255596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f56d12f-e187-46a9-9c96-d2719de889f4", 3, 0, 0.0, 271.6666666666667, 185, 378, 252.0, 378.0, 378.0, 378.0, 0.03219160442956477, 0.032285915770667015, 0.02064370466349043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 146.1818181818182, 85, 578, 86.0, 513.8000000000002, 578.0, 578.0, 0.057181175956875, 4.691440343463931, 0.03316954933435913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 145.72727272727275, 83, 585, 85.0, 518.6000000000003, 585.0, 585.0, 0.05718147320268233, 1.5424885149711494, 0.03322556304257421], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 93.25, 87, 104, 91.0, 104.0, 104.0, 104.0, 0.047834874014900566, 0.014107550734863254, 0.029569800050226618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8ec1729-e7b8-4a12-8e61-ba1bd532fa3c", 3, 0, 0.0, 296.0, 162, 541, 185.0, 541.0, 541.0, 541.0, 0.019400649275062406, 0.022930910650309767, 0.012441171572875307], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 810.5689655172415, 662, 1463, 678.0, 1105.1, 1170.05, 1463.0, 0.25435026662924504, 304.29134534845986, 0.5022424210198568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 7, 26.923076923076923, 853.6923076923076, 152, 1362, 865.0, 1279.7, 1359.9, 1362.0, 0.10408618335982193, 0.03276150152326126, 0.04696075850804466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 104.55555555555556, 86, 252, 86.0, 252.0, 252.0, 252.0, 0.05427473872743829, 0.014628738172629852, 0.03196061274672392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 85.55555555555557, 84, 87, 85.0, 87.0, 87.0, 87.0, 0.05427506603466368, 0.014628826392155443, 0.0319078024930347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 173.66666666666663, 84, 747, 85.0, 648.6, 747.0, 747.0, 0.07774034724021767, 9.344946472531744, 0.0448120465146411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 163.26666666666668, 84, 585, 86.0, 584.4, 585.0, 585.0, 0.07773994433819985, 3.0659095443921, 0.04488773218330042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 96.46666666666665, 83, 250, 86.0, 152.80000000000007, 250.0, 250.0, 0.07773994433819985, 0.05777353285290048, 0.039021807997885474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 104.66666666666667, 84, 254, 86.0, 254.0, 254.0, 254.0, 0.054275393345836774, 0.014522907985116481, 0.030953935267547538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 117.73333333333333, 83, 253, 85.0, 251.8, 253.0, 253.0, 0.07774034724021767, 0.036369930681523714, 0.043465761855402955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 104.33333333333333, 85, 251, 86.0, 251.0, 251.0, 251.0, 0.054274411424160555, 0.040334792083775564, 0.02724321042189309], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 461.81249999999994, 83, 1469, 395.5, 1049.7000000000005, 1469.0, 1469.0, 0.08333637163854933, 0.016866663107509127, 0.0567037274796477], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 110.22222222222223, 85, 258, 88.0, 258.0, 258.0, 258.0, 0.05178961905857981, 0.040764094688686844, 0.018409591149729544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0003b73a-a409-41d6-818d-e58318ab05e2", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1120.4166666666665, 714, 2108, 1051.0, 1451.0, 1950.5, 2108.0, 0.10414361404376635, 0.05390245648749626, 0.04790199435020894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d9e63a0-9632-48e1-a4fa-bb9d038cc117", 3, 0, 0.0, 256.6666666666667, 164, 392, 214.0, 392.0, 392.0, 392.0, 0.03736222678871661, 0.031147351173796623, 0.02395950090292048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 210.33333333333334, 172, 505, 174.0, 505.0, 505.0, 505.0, 0.05424595114248, 0.08407062935851149, 0.12200041550891744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9be93f8-2a01-45ca-b478-f956360dc674", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 1.7545930631868132, 3.2784598214285716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5bd51de-fe9a-4bc8-b462-0eb9e281ed24", 3, 0, 0.0, 465.33333333333337, 239, 870, 287.0, 870.0, 870.0, 870.0, 0.07474213961831681, 0.03308896806019234, 0.04793034344013155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd065444-5cbd-4c50-90d1-d034d508d6dd", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.8566042877906979, 3.4690679505813957], "isController": false}, {"data": ["addBook", 60, 10, 16.666666666666668, 830.7166666666666, 435, 1549, 715.0, 1346.9, 1426.8499999999997, 1549.0, 0.27675915034940846, 94.91955966466017, 1.003612283493623], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 157.89655172413794, 84, 578, 88.0, 345.0, 356.7499999999997, 578.0, 0.25518172898820446, 0.18964189039064805, 0.12335444907144649], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 477.2586206896552, 414, 686, 423.0, 591.6, 677.4499999999999, 686.0, 0.2552176610621455, 75.04246637617322, 0.12835653852246576], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 123.3965517241379, 83, 262, 88.0, 256.2, 259.1, 262.0, 0.2557804169220796, 0.4526114408816486, 0.12439321057343324], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 649.1724137931035, 573, 846, 588.0, 758.1, 765.2499999999998, 846.0, 0.25504034474419013, 229.48575051392828, 0.12801829804542356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 88.84615384615383, 85, 96, 88.0, 95.6, 96.0, 96.0, 0.09297202972244273, 0.06945664329850458, 0.03304865119039956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34d97a1b-9c70-446c-842c-116fe9d40fb1", 1, 0, 0.0, 1326.0, 1326, 1326, 1326.0, 1326.0, 1326.0, 1326.0, 0.7541478129713424, 0.1362474076168929, 0.5199495663650076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 10, 5.617977528089888, 143.74157303370788, 85, 991, 91.0, 254.0, 339.4499999999998, 641.8200000000036, 0.7327816886912848, 1.629863555432053, 0.3509771494586472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 104.72727272727273, 86, 259, 88.0, 226.40000000000012, 259.0, 259.0, 0.05618235771817908, 0.043508407881363294, 0.01997107247013397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fadecee8-917e-483d-ae47-932567ab97a2", 1, 0, 0.0, 822.0, 822, 822, 822.0, 822.0, 822.0, 822.0, 1.2165450121654502, 0.21978596411192217, 0.8387507603406327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=103662b1-025b-44a1-be04-6fbe85ab1c5a", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 91.86666666666666, 87, 115, 89.0, 108.4, 115.0, 115.0, 0.13768668019055838, 0.11173596800620508, 0.04894331209898754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a1eef67-a1a6-457f-943d-1edabc25c6c4", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d341839-954c-4de5-a75e-74911aaffe52", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 167.0, 5.9880239520958085, 1.0818207335329342, 4.128461826347305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e36c662f-4620-4ddd-b288-ddf691187737", 3, 0, 0.0, 430.6666666666667, 209, 594, 489.0, 594.0, 594.0, 594.0, 0.026462960676040436, 0.02654048888114602, 0.01697006267311187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 280.27272727272725, 172, 670, 174.0, 638.2000000000002, 670.0, 670.0, 0.0571553273961072, 6.2966761741522825, 0.12721424122405928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=170d7f2f-39ea-44c3-a746-abd7d3a7c160", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 304.99999999999994, 169, 997, 174.0, 800.8000000000002, 997.0, 997.0, 0.07770531038091143, 12.499379774020007, 0.1721101799784497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 87.84615384615385, 86, 91, 87.0, 90.2, 91.0, 91.0, 0.0647894343384002, 0.05371702124345876, 0.023030619237478196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6279936-5682-4260-8ffc-7ddd7caf5480", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 26, 0, 0.0, 114.07692307692307, 86, 383, 90.5, 231.8, 338.8999999999998, 383.0, 0.15071153233052198, 0.11700748847926268, 0.05357324000811524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 87.23076923076923, 84, 97, 86.0, 94.6, 97.0, 97.0, 0.09107021513586976, 0.06768011105312195, 0.04571297908187212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 149.9230769230769, 84, 255, 87.0, 255.0, 255.0, 255.0, 0.09107021513586976, 0.045411965750593704, 0.05076179359286009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc8f1775-489d-4f26-9ab3-3945f4e36383", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.0574037665562914, 1.9757605546357617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 212.9230769230769, 83, 738, 87.0, 676.4, 738.0, 738.0, 0.09107021513586976, 12.62771448349177, 0.052335272369997264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 207.0769230769231, 84, 668, 88.0, 567.5999999999999, 668.0, 668.0, 0.09107085312373027, 4.140440012329592, 0.05242457538214731], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.21212121212121, 0.5139500734214391], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 12.121212121212121, 0.2936857562408223], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 12.121212121212121, 0.2936857562408223], "isController": false}, {"data": ["401/Unauthorized", 18, 54.54545454545455, 1.3215859030837005], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1362, 33, "401/Unauthorized", 18, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
