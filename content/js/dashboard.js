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

    var data = {"OkPercent": 98.52180339985217, "KoPercent": 1.4781966001478197};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8286713286713286, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.49122807017543857, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4ba5a31-008e-4bc8-905e-9adc51cbc45d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0df1d3c8-834b-4880-b2a5-c5d3ea1a1a0a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c8001b6-0bed-4bcc-b29a-23a03db24fa7"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9647eee8-2594-4069-8ea7-7f34e467d9e2"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7ebc8b4-94d3-44ac-8909-c97a2f7000e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb16c34e-2339-4920-b5b9-34481b23a351"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/598d4953-344f-4b21-b0f0-ce7094de3025"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eadeb37e-6f82-472b-bfc0-93437d59c453"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1166cf20-0ed5-4b98-b7aa-394e3563042f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1054de23-17aa-425c-92e7-bd0df56f5f4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b10b4e40-b494-4bbb-8fc8-77230060f91d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ec3824c-704f-4c07-b6da-9effa09024c8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c8001b6-0bed-4bcc-b29a-23a03db24fa7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e36af001-e88e-480f-8574-67eb4189400d"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df04ee4e-c22e-438c-90f9-119b69c389c6"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9647eee8-2594-4069-8ea7-7f34e467d9e2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9ce349f7-d038-4363-898b-7a2135018653"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4375, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e4ba5a31-008e-4bc8-905e-9adc51cbc45d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0df1d3c8-834b-4880-b2a5-c5d3ea1a1a0a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb16c34e-2339-4920-b5b9-34481b23a351"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9540540540540541, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7761ed3a-2461-48db-af14-3f354444f253"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1054de23-17aa-425c-92e7-bd0df56f5f4e"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b10b4e40-b494-4bbb-8fc8-77230060f91d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ec3824c-704f-4c07-b6da-9effa09024c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ce349f7-d038-4363-898b-7a2135018653"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eadeb37e-6f82-472b-bfc0-93437d59c453"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df04ee4e-c22e-438c-90f9-119b69c389c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d70581c6-b444-4023-aa5c-b876e5903839"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e36af001-e88e-480f-8574-67eb4189400d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1353, 20, 1.4781966001478197, 255.74501108647485, 77, 2740, 85.0, 641.6000000000001, 795.3, 1134.7600000000002, 5.320675918534278, 737.3837907100035, 3.885320176982276], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1157.6315789473676, 937, 1515, 1131.0, 1379.2, 1466.2, 1515.0, 0.25576365643312904, 307.76946783491576, 1.2575879005281296], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4ba5a31-008e-4bc8-905e-9adc51cbc45d", 1, 0, 0.0, 2507.0, 2507, 2507, 2507.0, 2507.0, 2507.0, 2507.0, 0.39888312724371755, 0.07206384623055444, 0.27501121858795374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0df1d3c8-834b-4880-b2a5-c5d3ea1a1a0a", 3, 0, 0.0, 745.6666666666666, 189, 1611, 437.0, 1611.0, 1611.0, 1611.0, 0.020485226737317938, 0.02421284449322963, 0.013136685114751412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c8001b6-0bed-4bcc-b29a-23a03db24fa7", 3, 0, 0.0, 303.3333333333333, 171, 545, 194.0, 545.0, 545.0, 545.0, 0.05183227077178251, 0.0333231558509995, 0.03323879343112355], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 626.4285714285716, 82, 2740, 466.0, 1798.0, 2740.0, 2740.0, 0.08565677330934944, 0.016873237153013587, 0.05763429375990406], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 626.4285714285716, 82, 2740, 466.0, 1798.0, 2740.0, 2740.0, 0.08484797061835989, 0.016713913855067545, 0.05709008960551754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 116.54545454545455, 77, 241, 81.0, 240.0, 240.85, 241.0, 0.12359411692003462, 0.0499467702610083, 0.06954363574566577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 88.63636363636363, 79, 243, 81.5, 84.7, 219.29999999999967, 243.0, 0.12359133961776571, 0.09184864204015596, 0.06203705914407379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 157.81818181818184, 78, 543, 81.0, 451.39999999999975, 542.85, 543.0, 0.12359481126510526, 3.3340095350587915, 0.0718153444362672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 136.68181818181816, 78, 697, 81.0, 448.89999999999975, 673.5999999999997, 697.0, 0.12359481126510526, 10.140359552053079, 0.07169464637839112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9647eee8-2594-4069-8ea7-7f34e467d9e2", 3, 0, 0.0, 327.33333333333337, 173, 596, 213.0, 596.0, 596.0, 596.0, 0.019313221831665957, 0.022827574371998404, 0.012385106448040995], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 339.42857142857144, 80, 1611, 175.0, 1314.0, 1611.0, 1611.0, 0.08571446064175642, 0.1782030900828369, 0.055401101583880785], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 80.99999999999999, 79, 85, 80.5, 83.6, 85.0, 85.0, 0.08226517149717472, 0.06113651905209956, 0.041293259911667775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 90.37499999999999, 77, 242, 80.5, 130.7000000000001, 242.0, 242.0, 0.08226770940988343, 0.029735679634114363, 0.046486477887982235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 508.5, 398, 562, 537.0, 562.0, 562.0, 562.0, 0.0783254028862911, 23.03026909671229, 0.04466995633358789], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 648.0, 536, 804, 626.0, 804.0, 804.0, 804.0, 0.07805639574592643, 70.23528210069276, 0.04444031124987804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 162.5, 82, 244, 162.0, 244.0, 244.0, 244.0, 0.0790295175247955, 0.13984520093254832, 0.043759508238827204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 81.15384615384615, 78, 83, 81.0, 83.0, 83.0, 83.0, 0.05889921890574313, 0.04377178280006887, 0.02956464698979684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 97.92307692307692, 77, 318, 80.0, 223.5999999999999, 318.0, 318.0, 0.05890028634600747, 0.022565464270180146, 0.03321105388470043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 153.0, 79, 711, 80.0, 522.1999999999998, 711.0, 711.0, 0.05890082008064882, 4.091505291162611, 0.03423787152824974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 142.53846153846152, 79, 557, 82.0, 430.1999999999999, 557.0, 557.0, 0.05890001948231413, 1.3468512417709877, 0.03429492570668696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7ebc8b4-94d3-44ac-8909-c97a2f7000e4", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 121.25, 79, 243, 81.5, 243.0, 243.0, 243.0, 0.0790295175247955, 0.05873189730114198, 0.04437692634448967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 139.62500000000003, 78, 552, 81.0, 335.7000000000002, 552.0, 552.0, 0.08226728641355764, 4.647303312093805, 0.047922301118835095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 462.4666666666667, 78, 795, 561.0, 748.8000000000001, 795.0, 795.0, 0.08617519992646383, 51.701473218902244, 0.04572447131514845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 146.25, 78, 562, 81.0, 394.00000000000017, 562.0, 562.0, 0.08226686342158168, 1.5326119825542832, 0.04800239345155767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 402.8666666666666, 80, 632, 546.0, 603.2, 632.0, 632.0, 0.0861766851850788, 16.900280289668565, 0.04580941631094846], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 599.1428571428572, 84, 2507, 400.5, 2014.5, 2507.0, 2507.0, 0.08506294658046955, 0.0167562612404608, 0.057780620382297185], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb16c34e-2339-4920-b5b9-34481b23a351", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/598d4953-344f-4b21-b0f0-ce7094de3025", 1, 0, 0.0, 1270.0, 1270, 1270, 1270.0, 1270.0, 1270.0, 1270.0, 0.7874015748031495, 0.25144562007874016, 0.46982652559055116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 254.5384615384616, 162, 790, 165.0, 634.7999999999998, 790.0, 790.0, 0.058877344903486444, 5.502519554072047, 0.13125773472812255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eadeb37e-6f82-472b-bfc0-93437d59c453", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 412.95238095238096, 112, 1246, 361.0, 889.2, 1212.3999999999996, 1246.0, 0.09744417840637007, 0.05985584786875661, 0.044059233009911464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 93.26666666666667, 79, 234, 82.0, 156.00000000000006, 234.0, 234.0, 0.08617470485163589, 0.06404194374228019, 0.04325566239623129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 144.2, 78, 249, 82.0, 244.8, 249.0, 249.0, 0.08617569500698023, 0.10934663383372688, 0.04432213480176718], "isController": false}, {"data": ["login", 21, 0, 0.0, 1847.2857142857142, 1279, 2473, 1734.0, 2353.0, 2462.2, 2473.0, 0.09931942546077119, 22.770576339393397, 0.1812219260046633], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1166cf20-0ed5-4b98-b7aa-394e3563042f", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1054de23-17aa-425c-92e7-bd0df56f5f4e", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.29520271650326796, 1.1265573937908497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b10b4e40-b494-4bbb-8fc8-77230060f91d", 3, 0, 0.0, 324.3333333333333, 232, 405, 336.0, 405.0, 405.0, 405.0, 0.0600540486437794, 0.02783755379841858, 0.03851122260034031], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 85.125, 82, 92, 83.5, 92.0, 92.0, 92.0, 0.07894139588123267, 0.06390861053275575, 0.028061199317156928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ec3824c-704f-4c07-b6da-9effa09024c8", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 574.6666666666666, 161, 879, 668.0, 831.6, 879.0, 879.0, 0.08613363346119392, 68.74167711336048, 0.17902449532868595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c8001b6-0bed-4bcc-b29a-23a03db24fa7", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e36af001-e88e-480f-8574-67eb4189400d", 3, 0, 0.0, 280.6666666666667, 216, 401, 225.0, 401.0, 401.0, 401.0, 0.01778842447924387, 0.024522779189322202, 0.011407290437535947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 276.8636363636364, 160, 940, 167.5, 533.5999999999998, 892.4499999999994, 940.0, 0.12353581977246947, 13.609668397571959, 0.27496151789023277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 428.00000000000006, 80, 956, 351.0, 956.0, 956.0, 956.0, 0.11103246311640365, 66.43156843763445, 0.16196752126965622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df04ee4e-c22e-438c-90f9-119b69c389c6", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 628.7272727272726, 134, 1158, 683.5, 949.9999999999999, 1131.2999999999997, 1158.0, 0.09169455709444956, 0.028996449961863402, 0.04137000525159736], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 239.25, 162, 644, 166.0, 479.50000000000017, 644.0, 644.0, 0.08223092499511753, 6.268025155275113, 0.18362430553414125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 82.66666666666666, 80, 86, 83.0, 84.8, 86.0, 86.0, 0.09238216654656986, 0.07172248281691702, 0.032838973264601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 301.61904761904754, 161, 807, 315.0, 698.8000000000002, 803.4, 807.0, 0.09805523778395163, 11.309698604172016, 0.21813916110242104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 80.7, 79, 82, 80.5, 82.0, 82.0, 82.0, 0.05606072497729541, 0.04166231612082208, 0.028139856092118984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 95.9, 78, 241, 79.5, 225.10000000000005, 241.0, 241.0, 0.056060096423365846, 0.023420419189371006, 0.031500956525395224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 142.0, 78, 696, 80.5, 634.7000000000003, 696.0, 696.0, 0.05605946788353085, 5.057839574971129, 0.032475074559092286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 112.39999999999999, 78, 403, 81.0, 370.8000000000001, 403.0, 403.0, 0.05606041069856878, 1.6619612419343086, 0.03253036722372028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 0.6966213862765587, 0.20544888540578196, 0.4306263061650993], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 745.3859649122808, 617, 1138, 647.0, 1025.0, 1058.3999999999996, 1138.0, 0.259805373869049, 310.81755010939173, 0.5130141269172042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 628.7272727272726, 134, 1158, 683.5, 949.9999999999999, 1131.2999999999997, 1158.0, 0.09000421383364766, 0.028461914921471324, 0.040607369913227755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 124.77777777777777, 78, 328, 80.0, 328.0, 328.0, 328.0, 0.05426230397742688, 0.01462538661891584, 0.031953290330457434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 97.11111111111111, 78, 235, 80.0, 235.0, 235.0, 235.0, 0.05429307401352501, 0.014633680105207913, 0.031918389214982475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 100.86666666666667, 78, 234, 81.0, 233.4, 234.0, 234.0, 0.09028693186948121, 0.024335149605446107, 0.053078840806081724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 119.26666666666668, 78, 325, 81.0, 281.20000000000005, 325.0, 325.0, 0.09028638842408118, 0.02433500312992813, 0.053166691620821244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 80.1111111111111, 78, 82, 80.0, 82.0, 82.0, 82.0, 0.054343888124048986, 0.014541235689442794, 0.030992998695746687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 82.4, 79, 90, 82.0, 86.4, 90.0, 90.0, 0.09028584498522321, 0.06709719534546374, 0.04531926203359837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 81.44444444444444, 79, 85, 82.0, 85.0, 85.0, 85.0, 0.05434355998623297, 0.040386180810081336, 0.027277919758714592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 102.2, 77, 240, 81.0, 234.6, 240.0, 240.0, 0.09028638842408118, 0.024158662527537348, 0.0514914558981088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 137.66666666666666, 82, 258, 85.0, 258.0, 258.0, 258.0, 0.05292810011644182, 0.041660203802589946, 0.01881428558826643], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 568.8571428571429, 80, 1132, 546.0, 1101.5, 1132.0, 1132.0, 0.08309197094155073, 0.016043427425098525, 0.05654612643036893], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9647eee8-2594-4069-8ea7-7f34e467d9e2", 1, 0, 0.0, 1522.0, 1522, 1522, 1522.0, 1522.0, 1522.0, 1522.0, 0.657030223390276, 0.11870174934296977, 0.45299154073587383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 983.7142857142856, 766, 1424, 915.0, 1306.4, 1412.8999999999999, 1424.0, 0.09759724868708464, 0.050514200980619976, 0.04489092200353209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ce349f7-d038-4363-898b-7a2135018653", 3, 0, 0.0, 552.3333333333334, 176, 934, 547.0, 934.0, 934.0, 934.0, 0.021347147309547867, 0.029428765903624747, 0.01368941412754209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 208.22222222222223, 161, 414, 164.0, 414.0, 414.0, 414.0, 0.05423581733376722, 0.08405492393426618, 0.12197762433561123], "isController": false}, {"data": ["addBook", 64, 7, 10.9375, 776.2968750000002, 410, 1929, 679.5, 1242.5, 1288.25, 1929.0, 0.2706668978613086, 87.0565202836293, 0.9838313864171738], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e4ba5a31-008e-4bc8-905e-9adc51cbc45d", 3, 0, 0.0, 466.0, 294, 743, 361.0, 743.0, 743.0, 743.0, 0.021843122692820165, 0.025817831542197276, 0.014007471258091058], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 132.5263157894737, 78, 330, 82.0, 317.2, 325.0, 330.0, 0.26046426613050633, 0.1935676821536282, 0.12590801927207093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0df1d3c8-834b-4880-b2a5-c5d3ea1a1a0a", 1, 0, 0.0, 776.0, 776, 776, 776.0, 776.0, 776.0, 776.0, 1.288659793814433, 0.23281451353092783, 0.8884705219072164], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 463.140350877193, 382, 647, 401.0, 630.2, 637.8, 647.0, 0.2604273750291268, 76.57429526124977, 0.130976658339844], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 117.84210526315786, 78, 248, 82.0, 242.0, 243.1, 248.0, 0.2607907908823879, 0.46147745417860053, 0.12682989634709882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb16c34e-2339-4920-b5b9-34481b23a351", 3, 0, 0.0, 340.66666666666663, 170, 677, 175.0, 677.0, 677.0, 677.0, 0.035336105254478854, 0.02945825701716157, 0.022660197705508898], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 605.8421052631578, 535, 794, 557.0, 722.4, 765.9999999999999, 794.0, 0.2602252546326943, 234.15114154570378, 0.13062087976680165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 90.76190476190476, 81, 238, 83.0, 89.80000000000001, 223.29999999999978, 238.0, 0.09810287721724181, 0.07328974713983397, 0.034872507135816425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 7, 3.7837837837837838, 140.4648648648648, 79, 994, 84.0, 243.4, 275.7, 932.939999999999, 0.768495825198355, 1.6142387867112533, 0.37200082171935367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 82.3, 80, 84, 82.5, 84.0, 84.0, 84.0, 0.056589893045102146, 0.04382400896949805, 0.020115938543376153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7761ed3a-2461-48db-af14-3f354444f253", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.580870977722772, 2.953859839108911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 117.81818181818181, 81, 326, 83.0, 277.29999999999995, 320.8999999999999, 326.0, 0.12265970851592904, 0.09954122829759475, 0.04360169326152165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1054de23-17aa-425c-92e7-bd0df56f5f4e", 3, 0, 0.0, 726.0, 174, 1071, 933.0, 1071.0, 1071.0, 1071.0, 0.023276564379097645, 0.0275121110874035, 0.014926703068627072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 224.09999999999997, 158, 777, 163.5, 715.8000000000002, 777.0, 777.0, 0.056034651828690864, 6.781850927863791, 0.12458954617535484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b10b4e40-b494-4bbb-8fc8-77230060f91d", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 0.6208387027491409, 2.3692547250859106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ec3824c-704f-4c07-b6da-9effa09024c8", 3, 0, 0.0, 256.6666666666667, 184, 400, 186.0, 400.0, 400.0, 400.0, 0.09071391853890115, 0.04104568579722415, 0.058172662604698985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 224.66666666666669, 161, 405, 167.0, 363.6, 405.0, 405.0, 0.09024184815305017, 0.13985723927626037, 0.20295603153952593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ce349f7-d038-4363-898b-7a2135018653", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eadeb37e-6f82-472b-bfc0-93437d59c453", 3, 0, 0.0, 784.0, 203, 1132, 1017.0, 1132.0, 1132.0, 1132.0, 0.020406219815799858, 0.024119460986708748, 0.013086019868856026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 83.84615384615385, 82, 87, 84.0, 86.6, 87.0, 87.0, 0.060273921792268245, 0.04997320273597241, 0.021425495637095355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df04ee4e-c22e-438c-90f9-119b69c389c6", 3, 0, 0.0, 405.0, 172, 849, 194.0, 849.0, 849.0, 849.0, 0.06250781347668459, 0.029015671229737052, 0.040084763199566616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 85.06666666666665, 81, 99, 83.0, 95.4, 99.0, 99.0, 0.08395882659143955, 0.06518287806659614, 0.02984473913992578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d70581c6-b444-4023-aa5c-b876e5903839", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 1.0202426118210863, 1.9063248801916932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e36af001-e88e-480f-8574-67eb4189400d", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 80.95238095238093, 79, 83, 81.0, 82.8, 83.0, 83.0, 0.09809417040358744, 0.0729000621846973, 0.049238675378363225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 110.42857142857142, 77, 242, 81.0, 237.8, 241.7, 242.0, 0.0980955450608893, 0.040280118251843966, 0.055160497157564804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 189.2380952380952, 77, 728, 82.0, 617.8000000000002, 724.3, 728.0, 0.09809371219304842, 8.430101734273476, 0.056865523446732784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 192.66666666666669, 79, 563, 231.0, 496.80000000000024, 562.8, 563.0, 0.09809462861840722, 2.7708813101705445, 0.05696185023986472], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 25.0, 0.36954915003695493], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.0, 0.14781966001478197], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 10.0, 0.14781966001478197], "isController": false}, {"data": ["401/Unauthorized", 11, 55.0, 0.8130081300813008], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1353, 20, "401/Unauthorized", 11, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
