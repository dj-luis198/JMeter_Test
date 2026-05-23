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

    var data = {"OkPercent": 96.6973886328725, "KoPercent": 3.302611367127496};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7289196310935442, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5433a012-aa89-4fc3-b206-3dc668f48868"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2395c74b-be83-4d1f-a7f1-51dc70766fef"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0fac438d-f56d-4194-b533-a32978de0f3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca5ed200-445a-4199-8b84-914797a1ef92"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/176e567f-df96-41c5-b906-74406946eb97"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=176e567f-df96-41c5-b906-74406946eb97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2395c74b-be83-4d1f-a7f1-51dc70766fef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ca5ed200-445a-4199-8b84-914797a1ef92"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=176da23f-6c36-421e-bbea-54d879ec443b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abb170a7-ad78-4f33-a73f-fad2d1d4f658"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.21296296296296297, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9464285714285714, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c5f1ea0-07b1-4ba8-a2f4-70a04929d13c"], "isController": false}, {"data": [0.44642857142857145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8871951219512195, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c5f1ea0-07b1-4ba8-a2f4-70a04929d13c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3c54ed5-0f17-4ddf-a611-3ac215c1ac25"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15f529a1-0487-4b25-9c32-917123b0ba0f"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0576069-b0be-4c74-87c6-cb7cb73314dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/176da23f-6c36-421e-bbea-54d879ec443b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15f529a1-0487-4b25-9c32-917123b0ba0f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/abb170a7-ad78-4f33-a73f-fad2d1d4f658"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3c54ed5-0f17-4ddf-a611-3ac215c1ac25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6f13bdb-b1c8-4356-8382-6d89c29ed275"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5433a012-aa89-4fc3-b206-3dc668f48868"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9e3d0c9-5bb4-489a-a01d-5ca129d5b39a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d0576069-b0be-4c74-87c6-cb7cb73314dd"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6f13bdb-b1c8-4356-8382-6d89c29ed275"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.125, 500, 1500, "register"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1302, 43, 3.302611367127496, 431.40168970814045, 119, 2748, 138.0, 1227.4, 1468.1499999999983, 1790.5800000000004, 5.260436026310261, 776.7882005644767, 3.8571196436074793], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/5433a012-aa89-4fc3-b206-3dc668f48868", 3, 0, 0.0, 381.0, 217, 474, 452.0, 474.0, 474.0, 474.0, 0.07624275693809088, 0.034497862026024194, 0.04889265337501271], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2395c74b-be83-4d1f-a7f1-51dc70766fef", 1, 0, 0.0, 795.0, 795, 795, 795.0, 795.0, 795.0, 795.0, 1.2578616352201257, 0.22725039308176098, 0.8672366352201257], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2070.446428571429, 1582, 3289, 2076.5, 2440.9, 2568.1499999999996, 3289.0, 0.2612842119014958, 314.41090051632796, 1.2847324286367496], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 164.9411764705882, 128, 414, 132.0, 395.59999999999997, 414.0, 414.0, 0.08970313538841458, 0.06964257093143514, 0.03188666140760049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 352.0, 250, 1588, 257.0, 925.5, 1588.0, 1588.0, 0.07686648291916941, 6.679121510467568, 0.17146973519496636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fac438d-f56d-4194-b533-a32978de0f3d", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 1.0936162243150687, 2.043423587328767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca5ed200-445a-4199-8b84-914797a1ef92", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 0.6339089912280702, 2.419133771929825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/176e567f-df96-41c5-b906-74406946eb97", 3, 0, 0.0, 713.6666666666666, 351, 1154, 636.0, 1154.0, 1154.0, 1154.0, 0.01683435555281218, 0.02320751815304674, 0.010795468892916665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 501.85, 254, 1514, 378.0, 1330.5000000000014, 1508.0, 1514.0, 0.12334866968459744, 14.928838899699029, 0.27425805775184714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=176e567f-df96-41c5-b906-74406946eb97", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 129.0, 128, 130, 129.0, 130.0, 130.0, 130.0, 0.04955217224335071, 0.03682539363006826, 0.024872867708088154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 158.5, 120, 379, 128.0, 379.0, 379.0, 379.0, 0.04947555907381753, 0.013238577330298833, 0.028216529784286563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 194.0, 126, 389, 130.0, 389.0, 389.0, 389.0, 0.04947311136397368, 0.01333454954732103, 0.029084778360461087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 159.75, 121, 388, 127.0, 388.0, 388.0, 388.0, 0.04955309304212632, 0.01335610710901061, 0.029180190531642745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 130.33333333333334, 126, 133, 132.0, 133.0, 133.0, 133.0, 0.06969936341248084, 0.020555866943915244, 0.04308564164072301], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1425.2321428571431, 970, 2748, 1301.5, 1900.0, 2043.6, 2748.0, 0.25561438743837867, 305.80367331568374, 0.5047385658207048], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 523.8000000000001, 128, 1037, 567.0, 936.8000000000001, 1037.0, 1037.0, 0.07531746310699598, 0.01590198781614505, 0.05023125599401477], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 523.8000000000001, 128, 1037, 567.0, 936.8000000000001, 1037.0, 1037.0, 0.0758955676988464, 0.016024044664541593, 0.05061680960331917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, 45.833333333333336, 1025.4583333333333, 177, 1795, 1019.0, 1720.0, 1794.0, 1795.0, 0.1154912226670773, 0.03558347729635048, 0.05210639147674777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 124.66666666666667, 121, 128, 124.0, 128.0, 128.0, 128.0, 0.04324324324324324, 0.011655405405405406, 0.025464527027027027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 142.23529411764707, 123, 379, 128.0, 180.59999999999982, 379.0, 379.0, 0.11457610212100584, 0.03065805857534727, 0.06534418324088614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 182.11111111111111, 121, 388, 127.0, 388.0, 388.0, 388.0, 0.043243658797922385, 0.011655517410377517, 0.02542254159799734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 142.52941176470588, 124, 369, 129.0, 180.19999999999982, 369.0, 369.0, 0.11457455770850884, 0.08514769376579613, 0.05751105728727885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 196.35294117647058, 121, 370, 128.0, 368.4, 370.0, 370.0, 0.1145753299095529, 0.030881631889684177, 0.06746965228072303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 184.2941176470588, 120, 384, 128.0, 380.8, 384.0, 384.0, 0.11457378551787352, 0.030881215627864344, 0.06735685437671861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2395c74b-be83-4d1f-a7f1-51dc70766fef", 3, 0, 0.0, 394.3333333333333, 312, 557, 314.0, 557.0, 557.0, 557.0, 0.022936305878575196, 0.023003502087203836, 0.0147085034442686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 169.23529411764707, 121, 376, 127.0, 376.0, 376.0, 376.0, 0.08610995735024465, 0.02320932444205813, 0.05062323664535867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 127.94117647058825, 125, 131, 128.0, 131.0, 131.0, 131.0, 0.08610908501499312, 0.023209089320447362, 0.050706814710977384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 181.66666666666666, 122, 385, 127.0, 385.0, 385.0, 385.0, 0.04324261992619926, 0.011570779159940038, 0.024661806676660517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 128.0, 123, 131, 128.0, 131.0, 131.0, 131.0, 0.08611126588626221, 0.06399479818305229, 0.04322381900931521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 153.22222222222223, 122, 371, 126.0, 371.0, 371.0, 371.0, 0.04324261992619926, 0.03213636109749769, 0.02170576820514299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 171.58823529411765, 123, 386, 127.0, 379.6, 386.0, 386.0, 0.08600061718089977, 0.023011883894107944, 0.0490472269859819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 171.44444444444446, 127, 483, 132.0, 483.0, 483.0, 483.0, 0.0435575903940994, 0.03428458775160558, 0.01548336221040252], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 532.2857142857142, 125, 1228, 555.0, 1016.0, 1228.0, 1228.0, 0.1009780444880413, 0.020123763469749863, 0.06871099497634228], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ca5ed200-445a-4199-8b84-914797a1ef92", 3, 0, 0.0, 654.0, 278, 1131, 553.0, 1131.0, 1131.0, 1131.0, 0.06389095942924077, 0.028908995314662976, 0.04097174156106911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1394.4999999999998, 782, 2535, 1323.0, 1904.5, 2417.75, 2535.0, 0.11101962271831546, 0.05746132816475312, 0.05106468974641268], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 229.33333333333334, 124, 397, 222.0, 369.40000000000003, 397.0, 397.0, 0.07467070220328352, 0.11305124868081759, 0.04825399674933543], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 339.1111111111111, 248, 756, 258.0, 756.0, 756.0, 756.0, 0.04321541926159254, 0.0669754593438939, 0.09719249078071056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=176da23f-6c36-421e-bbea-54d879ec443b", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abb170a7-ad78-4f33-a73f-fad2d1d4f658", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 144.6428571428571, 120, 376, 126.0, 254.5, 376.0, 376.0, 0.07692265427113038, 0.057166152246416226, 0.03861156669468849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 144.57142857142858, 119, 384, 126.5, 259.5, 384.0, 384.0, 0.07692054108106326, 0.02883447180312737, 0.043407308687625684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 11, 0, 0.0, 916.0909090909091, 617, 1023, 993.0, 1019.8, 1023.0, 1023.0, 0.076436130664091, 22.47476033364371, 0.0435924807693644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 11, 0, 0.0, 1289.8181818181818, 1115, 1525, 1304.0, 1515.4, 1525.0, 1525.0, 0.07637138711267556, 68.71910837056438, 0.043480975279970566], "isController": false}, {"data": ["addBook", 54, 18, 33.333333333333336, 1144.9444444444448, 634, 2412, 920.0, 2098.5, 2220.75, 2412.0, 0.2559084037476364, 74.81362041378966, 0.9285056267267893], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 11, 0, 0.0, 289.6363636363636, 127, 386, 380.0, 386.0, 386.0, 386.0, 0.07676257336059568, 0.13583377239199157, 0.042504276460407955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 7, 0, 0.0, 129.0, 125, 131, 129.0, 131.0, 131.0, 131.0, 0.03613500036135, 0.026854233666979838, 0.018138076353255764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 7, 0, 0.0, 128.14285714285714, 126, 137, 126.0, 137.0, 137.0, 137.0, 0.0361351868963488, 0.009668985556249579, 0.020608348776823923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 7, 0, 0.0, 164.28571428571428, 122, 379, 128.0, 379.0, 379.0, 379.0, 0.03613500036135, 0.00973951181614512, 0.02124342794680928], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 229.0714285714286, 124, 817, 131.0, 508.5, 518.05, 817.0, 0.25688073394495414, 0.19090452981651376, 0.12417574541284404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 7, 0, 0.0, 129.14285714285714, 126, 139, 128.0, 139.0, 139.0, 139.0, 0.0361351868963488, 0.00973956209315651, 0.021278825877439768], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 821.3928571428572, 607, 1158, 760.5, 1050.0000000000002, 1129.2, 1158.0, 0.25697267829773957, 75.55849971549453, 0.1292391887923202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 11, 0, 0.0, 175.09090909090907, 124, 389, 129.0, 387.8, 389.0, 389.0, 0.07690049076495015, 0.057149681125124085, 0.043181427919771816], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 198.6607142857143, 120, 525, 131.0, 381.90000000000003, 388.9, 525.0, 0.2577307725940142, 0.4560626561917517, 0.1253417233904483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 846.0000000000001, 126, 1543, 1239.0, 1490.8000000000002, 1543.0, 1543.0, 0.08718522501053487, 43.59345446327807, 0.0470928873809074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 203.6428571428571, 121, 1212, 126.5, 671.5, 1212.0, 1212.0, 0.07692392224090375, 4.96327247586512, 0.04475066346882933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c5f1ea0-07b1-4ba8-a2f4-70a04929d13c", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.2867683531746032, 1.0943700396825398], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1189.696428571429, 843, 1894, 1147.5, 1530.5, 1649.8999999999999, 1894.0, 0.2566147021894733, 230.90236011061927, 0.12880855168495048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 647.2222222222222, 124, 1167, 825.0, 1137.3, 1167.0, 1167.0, 0.08708146471023642, 14.23534385688645, 0.04712188199977746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 188.5, 123, 976, 128.0, 556.5, 976.0, 976.0, 0.07691927322275272, 1.6347384435659775, 0.044823075369899296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 157.74999999999997, 127, 387, 133.0, 343.80000000000047, 385.95, 387.0, 0.12643184059473536, 0.09445347466305916, 0.04494256833640985], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 432.85714285714283, 126, 795, 478.0, 719.0, 795.0, 795.0, 0.10289956267685862, 0.021109627080959904, 0.06937250790121642], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 18, 10.975609756097562, 174.82926829268297, 122, 560, 134.0, 301.5, 381.25, 505.3999999999995, 0.6914288123445339, 1.6376350776276403, 0.3268781422593701], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 138.25, 129, 152, 136.5, 152.0, 152.0, 152.0, 0.04984516844551611, 0.03860079939188894, 0.017718399720867056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 0, 0.0, 294.99999999999994, 253, 508, 259.0, 508.0, 508.0, 508.0, 0.03611076719904255, 0.05596463627429738, 0.08121396177675291], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c5f1ea0-07b1-4ba8-a2f4-70a04929d13c", 3, 0, 0.0, 424.33333333333337, 239, 724, 310.0, 724.0, 724.0, 724.0, 0.022375702970001642, 0.026447323399764307, 0.014349002230111728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 131.23529411764707, 125, 143, 131.0, 135.79999999999998, 143.0, 143.0, 0.1092678411888341, 0.08867341408976676, 0.03884130292259338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3c54ed5-0f17-4ddf-a611-3ac215c1ac25", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15f529a1-0487-4b25-9c32-917123b0ba0f", 3, 0, 0.0, 562.0, 219, 1228, 239.0, 1228.0, 1228.0, 1228.0, 0.07852169816259226, 0.035529023582683346, 0.05035408378265194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 581.75, 147, 1217, 498.5, 1172.0, 1209.5, 1217.0, 0.11275387239080492, 0.06925994700567997, 0.05098148722357683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 157.16666666666666, 120, 384, 130.0, 381.3, 384.0, 384.0, 0.08718649190618734, 0.06479386752012554, 0.043763532070097935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 239.05555555555554, 121, 392, 129.0, 388.4, 392.0, 392.0, 0.08707346097657723, 0.09595465165778194, 0.04559641088031269], "isController": false}, {"data": ["login", 24, 0, 0.0, 2914.416666666666, 1668, 4219, 2987.0, 4104.0, 4218.0, 4219.0, 0.11472165658072103, 63.05455802734917, 0.26028036001089855], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 323.75, 255, 518, 259.5, 518.0, 518.0, 518.0, 0.049433675455562216, 0.07661254194138402, 0.11117749470132791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0576069-b0be-4c74-87c6-cb7cb73314dd", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.2809705482115085, 1.072244362363919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 134.07142857142858, 127, 155, 133.0, 147.0, 155.0, 155.0, 0.07690490708239262, 0.062259929659476056, 0.02733729118944425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 316.5294117647059, 255, 515, 258.0, 508.6, 515.0, 515.0, 0.08594670293280483, 0.13320060308043094, 0.19329614927172808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/176da23f-6c36-421e-bbea-54d879ec443b", 3, 0, 0.0, 584.6666666666666, 245, 1053, 456.0, 1053.0, 1053.0, 1053.0, 0.06216070614562181, 0.02812610076250466, 0.0398621715842692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15f529a1-0487-4b25-9c32-917123b0ba0f", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abb170a7-ad78-4f33-a73f-fad2d1d4f658", 3, 0, 0.0, 377.33333333333337, 222, 661, 249.0, 661.0, 661.0, 661.0, 0.027243007628042135, 0.027322821126952414, 0.017470288094805667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 132.0, 130, 136, 131.0, 136.0, 136.0, 136.0, 0.034946880741273265, 0.02897451342709082, 0.01242252401349948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1035.2777777777778, 259, 1673, 1367.5, 1622.6000000000001, 1673.0, 1673.0, 0.08702084149153722, 57.89726222763685, 0.183342413112107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3c54ed5-0f17-4ddf-a611-3ac215c1ac25", 3, 0, 0.0, 428.66666666666663, 241, 804, 241.0, 804.0, 804.0, 804.0, 0.04252062250191343, 0.02783495177452731, 0.027267456487229638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6f13bdb-b1c8-4356-8382-6d89c29ed275", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 132.22222222222223, 124, 158, 132.0, 140.90000000000003, 158.0, 158.0, 0.0876590646777799, 0.06805562150276856, 0.031160058147179568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5433a012-aa89-4fc3-b206-3dc668f48868", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9e3d0c9-5bb4-489a-a01d-5ca129d5b39a", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.9097889957264957, 1.6999421296296298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0576069-b0be-4c74-87c6-cb7cb73314dd", 3, 0, 0.0, 335.6666666666667, 211, 562, 234.0, 562.0, 562.0, 562.0, 0.02976840183373355, 0.02481669176308321, 0.019089762894679393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 387.00000000000006, 254, 748, 264.0, 556.7999999999998, 748.0, 748.0, 0.11447426012592168, 0.17741274494124779, 0.25745529401366957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 7, 38.888888888888886, 945.0555555555555, 124, 1771, 1254.5, 1696.3000000000002, 1771.0, 1771.0, 0.11369163040114197, 83.13193449861991, 0.18585300106428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6f13bdb-b1c8-4356-8382-6d89c29ed275", 3, 0, 0.0, 395.6666666666667, 354, 436, 397.0, 436.0, 436.0, 436.0, 0.020622100017185084, 0.02437462407630177, 0.01322445866987455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 153.8, 123, 384, 129.0, 350.8000000000005, 383.55, 384.0, 0.1243193515502623, 0.09238967434545861, 0.06240248700862776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 214.85, 122, 393, 129.0, 384.5, 392.6, 393.0, 0.1241264600374862, 0.05185673789456698, 0.06974840342340777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 308.34999999999997, 122, 1384, 128.5, 1176.5000000000018, 1378.05, 1384.0, 0.1234484078241601, 11.137855319237582, 0.0715132768762615], "isController": false}, {"data": ["register", 24, 11, 45.833333333333336, 1025.4583333333333, 177, 1795, 1019.0, 1720.0, 1794.0, 1795.0, 0.11435105774728416, 0.035232186249285306, 0.05159198113207547], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 264.54999999999995, 120, 1013, 129.0, 716.0000000000008, 999.9999999999998, 1013.0, 0.12364072478192868, 3.6654403696239473, 0.0717454283842012], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 25.58139534883721, 0.8448540706605223], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.30232558139535, 0.30721966205837176], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 6.976744186046512, 0.2304147465437788], "isController": false}, {"data": ["401/Unauthorized", 25, 58.13953488372093, 1.9201228878648233], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1302, 43, "401/Unauthorized", 25, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
