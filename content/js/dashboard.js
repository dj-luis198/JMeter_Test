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

    var data = {"OkPercent": 98.44357976653697, "KoPercent": 1.556420233463035};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7203333333333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc701a79-f604-4256-8d89-0ca3d1cf115b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27c8dd6e-7ed4-45f6-822e-42570c6df2ab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc942c82-c2d1-4b17-8a34-1f1427daf939"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2c4b72f4-732e-42c9-934e-3071e3f7d47b"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5d8fc9f0-8b51-4561-bca2-b68c2d0a1b2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40855355-d3ec-48e6-9f1f-f943dad86f82"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/4a4fb6be-3d38-4947-881b-39eca9e14be9"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fde5021-f472-457b-91e9-e6a480f93c49"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/674a489d-1861-48a5-8c41-5ebd36b05f0d"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/800791a3-6a87-4720-8641-e61e3d75a131"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5211b8a0-6389-496c-99d9-2d131d6e7c7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/89da4462-6455-496c-b485-19e2cb052710"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc701a79-f604-4256-8d89-0ca3d1cf115b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5351ac97-5d9b-4c77-a90c-0d75fe44d21e"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/27c8dd6e-7ed4-45f6-822e-42570c6df2ab"], "isController": false}, {"data": [0.10416666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c4b72f4-732e-42c9-934e-3071e3f7d47b"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d8fc9f0-8b51-4561-bca2-b68c2d0a1b2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40855355-d3ec-48e6-9f1f-f943dad86f82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.28703703703703703, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.10416666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0d23e248-6d0d-453d-8e5d-c8bbc9db8486"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a4fb6be-3d38-4947-881b-39eca9e14be9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fc641d7-3b55-4d02-b192-bb436f7f9972"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.13043478260869565, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89da4462-6455-496c-b485-19e2cb052710"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=674a489d-1861-48a5-8c41-5ebd36b05f0d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=800791a3-6a87-4720-8641-e61e3d75a131"], "isController": false}, {"data": [0.2413793103448276, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cc942c82-c2d1-4b17-8a34-1f1427daf939"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1fde5021-f472-457b-91e9-e6a480f93c49"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee5b1bfb-7494-4c36-962b-11cd5594ba93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5351ac97-5d9b-4c77-a90c-0d75fe44d21e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5211b8a0-6389-496c-99d9-2d131d6e7c7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/13d220a6-1ca4-431d-acee-140919174764"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1285, 20, 1.556420233463035, 477.1237354085608, 125, 2761, 168.0, 1374.6000000000004, 1556.7, 2175.7000000000007, 4.980504329356682, 717.309323717278, 3.6295826514208978], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2196.8518518518513, 1556, 3308, 2170.0, 2638.0, 2733.5, 3308.0, 0.2518856439176614, 303.1036259798468, 1.2385197432865478], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc701a79-f604-4256-8d89-0ca3d1cf115b", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27c8dd6e-7ed4-45f6-822e-42570c6df2ab", 1, 0, 0.0, 869.0, 869, 869, 869.0, 869.0, 869.0, 869.0, 1.1507479861910241, 0.20789880609896433, 0.7933867951668585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc942c82-c2d1-4b17-8a34-1f1427daf939", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c4b72f4-732e-42c9-934e-3071e3f7d47b", 3, 0, 0.0, 504.6666666666667, 307, 673, 534.0, 673.0, 673.0, 673.0, 0.023488514116596984, 0.02776262850174598, 0.015062621357322937], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 722.8571428571429, 135, 1519, 548.0, 1471.0, 1519.0, 1519.0, 0.08688366897322121, 0.01640583788438266, 0.05875677808980048], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 722.8571428571429, 135, 1519, 548.0, 1471.0, 1519.0, 1519.0, 0.08543044741145744, 0.0161314328364129, 0.057774008625424096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d8fc9f0-8b51-4561-bca2-b68c2d0a1b2b", 3, 0, 0.0, 460.0, 227, 743, 410.0, 743.0, 743.0, 743.0, 0.021318173743116006, 0.025197359655356192, 0.0136708340735477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 203.73333333333335, 127, 399, 133.0, 393.0, 399.0, 399.0, 0.1355466596784833, 0.04984163631927564, 0.07654503424812269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 153.66666666666666, 127, 379, 132.0, 246.4000000000001, 379.0, 379.0, 0.13550992384342278, 0.1007061055125437, 0.06801962974171809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 278.8, 128, 753, 164.0, 535.8000000000002, 753.0, 753.0, 0.1355466596784833, 2.6911130244526174, 0.07904241085548015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40855355-d3ec-48e6-9f1f-f943dad86f82", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 0.7002483042635659, 2.672298934108527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 258.6, 126, 1412, 129.0, 873.2000000000003, 1412.0, 1412.0, 0.135542985198706, 8.16488528827734, 0.07890790193013211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a4fb6be-3d38-4947-881b-39eca9e14be9", 3, 0, 0.0, 1372.0, 688, 2175, 1253.0, 2175.0, 2175.0, 2175.0, 0.07430892697909441, 0.03362285432973348, 0.047652534553651045], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 399.3571428571429, 138, 1253, 358.5, 895.5, 1253.0, 1253.0, 0.0872758102623885, 0.16468317127566065, 0.056416359772708854], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fde5021-f472-457b-91e9-e6a480f93c49", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 0.6406527039007093, 2.444869237588653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 135.4375, 126, 163, 129.5, 160.2, 163.0, 163.0, 0.10032731787456577, 0.07455965713139116, 0.050359610730006645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 170.125, 126, 478, 129.0, 407.30000000000007, 478.0, 478.0, 0.10033549681748345, 0.04568498573354655, 0.05616926127990468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 911.8333333333334, 651, 1039, 1000.5, 1039.0, 1039.0, 1039.0, 0.05037191262152224, 14.8110148156388, 0.028727731416961902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1352.1666666666665, 891, 1715, 1388.5, 1715.0, 1715.0, 1715.0, 0.050071769536335416, 45.05466624557699, 0.028507657851253462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 214.5, 126, 387, 132.5, 387.0, 387.0, 387.0, 0.050742961528378, 0.08979125614201264, 0.028096932799404617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 159.74999999999997, 127, 395, 133.0, 324.80000000000024, 395.0, 395.0, 0.0988687764165012, 0.07347572153609122, 0.049627491287189074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 131.25000000000003, 127, 158, 128.5, 150.20000000000002, 158.0, 158.0, 0.0988932200456557, 0.05121715920984317, 0.05501579201107604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 378.75, 127, 1380, 131.5, 1377.9, 1380.0, 1380.0, 0.09889485005068362, 14.853172696162057, 0.056722892509539234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/674a489d-1861-48a5-8c41-5ebd36b05f0d", 3, 0, 0.0, 531.6666666666666, 292, 716, 587.0, 716.0, 716.0, 716.0, 0.04329691581636335, 0.02834313076390192, 0.027765274791092382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 302.83333333333337, 126, 1020, 132.5, 1018.2, 1020.0, 1020.0, 0.09889648010944545, 4.868687880648431, 0.056820406052464585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 130.0, 127, 133, 130.0, 133.0, 133.0, 133.0, 0.05074210326018013, 0.03770970759862996, 0.028492880248636304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/800791a3-6a87-4720-8641-e61e3d75a131", 3, 0, 0.0, 645.0, 389, 1081, 465.0, 1081.0, 1081.0, 1081.0, 0.015628662967883095, 0.02154537359016436, 0.010022287124586492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 768.8421052631578, 126, 1665, 1125.0, 1560.0, 1665.0, 1665.0, 0.09089908766020964, 43.059583679188414, 0.04932733180080661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 322.06250000000006, 126, 1424, 129.5, 1396.0, 1424.0, 1424.0, 0.10033612602217429, 11.308991077139668, 0.057908838358500976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 582.3684210526316, 126, 1257, 756.0, 1144.0, 1257.0, 1257.0, 0.09089995742054625, 14.078766308169993, 0.0494165732749341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 259.625, 127, 930, 130.0, 715.8000000000002, 930.0, 930.0, 0.10033612602217429, 3.7114323217152463, 0.05800682285656951], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 549.6428571428572, 143, 1066, 494.0, 1035.0, 1066.0, 1066.0, 0.08595284872298625, 0.01623007543897348, 0.058822781725810416], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 546.4166666666667, 258, 1768, 305.5, 1690.0000000000002, 1768.0, 1768.0, 0.09876218066894918, 19.819868970363114, 0.21790692075981036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 745.0434782608696, 164, 2329, 490.0, 1567.8000000000009, 2224.5999999999985, 2329.0, 0.1091703056768559, 0.06705871315502183, 0.04936118313318777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 131.3684210526316, 127, 157, 129.0, 138.0, 157.0, 157.0, 0.09089604363010095, 0.06755067304932307, 0.045625553150265515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 234.15789473684202, 127, 466, 134.0, 461.0, 466.0, 466.0, 0.0908995225382974, 0.09617894587651062, 0.047823165743318886], "isController": false}, {"data": ["login", 23, 0, 0.0, 3384.4782608695655, 1991, 4719, 3378.0, 4680.4, 4716.0, 4719.0, 0.10416006231488946, 32.64986312009202, 0.20221257342152218], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5211b8a0-6389-496c-99d9-2d131d6e7c7b", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 145.43749999999997, 129, 168, 140.0, 165.9, 168.0, 168.0, 0.09915101939641817, 0.08026972175745181, 0.03524508892607052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89da4462-6455-496c-b485-19e2cb052710", 3, 0, 0.0, 493.0, 374, 554, 551.0, 554.0, 554.0, 554.0, 0.039260335283263316, 0.03234632441469384, 0.025176712404957273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 902.2105263157894, 256, 1798, 1254.0, 1718.0, 1798.0, 1798.0, 0.0908404172921906, 57.26496143913931, 0.1920693999870911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc701a79-f604-4256-8d89-0ca3d1cf115b", 3, 0, 0.0, 355.6666666666667, 242, 465, 360.0, 465.0, 465.0, 465.0, 0.045099896270238575, 0.02899488773884153, 0.028921482959755856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5351ac97-5d9b-4c77-a90c-0d75fe44d21e", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 0.2831725117554859, 1.0806475313479624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 505.4, 257, 1539, 507.0, 1077.0000000000002, 1539.0, 1539.0, 0.13534974373781852, 10.990804535795496, 0.30209604587002814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1164.125, 133, 1848, 1401.0, 1848.0, 1848.0, 1848.0, 0.06668889629876626, 59.84178971115372, 0.12382871113287763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27c8dd6e-7ed4-45f6-822e-42570c6df2ab", 3, 0, 0.0, 462.3333333333333, 247, 602, 538.0, 602.0, 602.0, 602.0, 0.02277281836400073, 0.026916700351460498, 0.014603662818060364], "isController": false}, {"data": ["register", 24, 6, 25.0, 1478.8333333333333, 309, 2640, 1553.5, 2341.5, 2589.75, 2640.0, 0.10058802080495564, 0.031728447968750656, 0.045382485949110846], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 138.3125, 131, 159, 135.0, 158.3, 159.0, 159.0, 0.08444073843425762, 0.06555701860862773, 0.03001604374030251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 515.0, 257, 1581, 303.5, 1532.7, 1581.0, 1581.0, 0.10024622980195104, 15.127109576177737, 0.2222500031326947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c4b72f4-732e-42c9-934e-3071e3f7d47b", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 564.1428571428571, 263, 1400, 554.0, 1081.0, 1400.0, 1400.0, 0.08462845087620671, 7.353578376146262, 0.18878472788930598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d8fc9f0-8b51-4561-bca2-b68c2d0a1b2b", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 0.22985249681933842, 0.8771668256997455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 131.83333333333334, 128, 145, 129.5, 145.0, 145.0, 145.0, 0.03782243626919489, 0.028108275391462215, 0.018985090080435713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 128.16666666666666, 126, 131, 127.5, 131.0, 131.0, 131.0, 0.037826966844663565, 0.010121668862732242, 0.02157319202859719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 131.5, 129, 134, 131.5, 134.0, 134.0, 134.0, 0.037825536019366675, 0.010195164005219925, 0.02223727801138549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40855355-d3ec-48e6-9f1f-f943dad86f82", 3, 0, 0.0, 353.0, 236, 480, 343.0, 480.0, 480.0, 480.0, 0.09903604912188037, 0.044811233163871644, 0.063509445563185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 133.33333333333334, 128, 158, 128.0, 158.0, 158.0, 158.0, 0.03782672836626361, 0.010195485379969487, 0.022274919145368118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 143.0, 6.993006993006993, 2.0623907342657346, 4.3228256118881125], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1502.4074074074072, 1003, 2651, 1427.0, 2048.0, 2176.0, 2651.0, 0.24004694251320258, 287.1795970656484, 0.4739989431266559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1478.8333333333333, 309, 2640, 1553.5, 2341.5, 2589.75, 2640.0, 0.09498179515592844, 0.029960077964223522, 0.04285311461136616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 14, 0, 0.0, 177.35714285714286, 127, 510, 128.5, 444.0, 510.0, 510.0, 0.0666298616002589, 0.01795882988444478, 0.03923613920405871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 14, 0, 0.0, 166.85714285714286, 128, 381, 129.0, 380.5, 381.0, 381.0, 0.06671018712207488, 0.017980480122746743, 0.039218293601063554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 305.375, 127, 1396, 144.0, 698.8000000000006, 1396.0, 1396.0, 0.08256530399512865, 4.664138413314172, 0.048095902180756094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 282.87500000000006, 127, 766, 146.0, 677.1000000000001, 766.0, 766.0, 0.0828346000124252, 1.5431887794062829, 0.0483336655345938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d23e248-6d0d-453d-8e5d-c8bbc9db8486", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.5902697550831792, 1.1029199399260627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 14, 0, 0.0, 174.42857142857144, 128, 461, 130.0, 420.5, 461.0, 461.0, 0.06660386873328956, 0.017821738313399747, 0.03798501888695421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 157.99999999999997, 126, 476, 130.5, 254.10000000000022, 476.0, 476.0, 0.083108248493663, 0.06176306357781009, 0.04171644504467068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 14, 0, 0.0, 155.57142857142856, 128, 389, 133.0, 274.0, 389.0, 389.0, 0.06669906335458174, 0.04956834688753585, 0.03347980328540529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 229.1875, 126, 393, 157.5, 384.6, 393.0, 393.0, 0.08300132802124834, 0.03000084622447709, 0.04690101897099103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a4fb6be-3d38-4947-881b-39eca9e14be9", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fc641d7-3b55-4d02-b192-bb436f7f9972", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 14, 0, 0.0, 210.0, 132, 557, 152.0, 471.5, 557.0, 557.0, 0.06474617188258745, 0.05096231888414597, 0.023015240786388502], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 592.7857142857142, 133, 1241, 539.5, 992.0, 1241.0, 1241.0, 0.08307274205320217, 0.015523986883407408, 0.05653883539432851], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1811.5652173913043, 1347, 2761, 1715.0, 2493.0000000000005, 2725.7999999999993, 2761.0, 0.10897220261249012, 0.05640162830529274, 0.0501229564750809], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89da4462-6455-496c-b485-19e2cb052710", 1, 0, 0.0, 1004.0, 1004, 1004, 1004.0, 1004.0, 1004.0, 1004.0, 0.9960159362549801, 0.17994428535856574, 0.6867062998007968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 14, 0, 0.0, 360.42857142857144, 258, 770, 267.5, 705.0, 770.0, 770.0, 0.06655289291164153, 0.10314398540114755, 0.1496790159917094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=674a489d-1861-48a5-8c41-5ebd36b05f0d", 1, 0, 0.0, 1066.0, 1066, 1066, 1066.0, 1066.0, 1066.0, 1066.0, 0.9380863039399625, 0.16947848264540336, 0.6467665337711069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=800791a3-6a87-4720-8641-e61e3d75a131", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["addBook", 58, 10, 17.24137931034483, 1410.5517241379314, 657, 3051, 1179.5, 2204.2000000000003, 2429.8999999999987, 3051.0, 0.27078256160303277, 96.04567004678003, 0.9810305581622268], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cc942c82-c2d1-4b17-8a34-1f1427daf939", 3, 0, 0.0, 559.6666666666666, 404, 756, 519.0, 756.0, 756.0, 756.0, 0.020208552259316143, 0.0238858246268154, 0.01295926040066823], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 225.07407407407405, 126, 633, 133.0, 516.0, 563.75, 633.0, 0.24158371546806845, 0.17953633542109385, 0.11678119058270886], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 841.111111111111, 626, 1238, 766.0, 1136.5, 1147.75, 1238.0, 0.2414832437460312, 71.00409165966067, 0.12144909231367779], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 204.7222222222222, 127, 512, 135.5, 393.0, 413.25, 512.0, 0.2418921340261602, 0.42803569028847877, 0.11763894799319118], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1272.2407407407406, 876, 2014, 1278.0, 1594.5, 1773.5, 2014.0, 0.24075865728005136, 216.63506302916747, 0.12084956039252578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 149.00000000000003, 132, 168, 150.5, 166.0, 168.0, 168.0, 0.083579594638966, 0.06243983388555566, 0.029709934031819946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, 5.882352941176471, 221.68235294117645, 128, 1246, 142.0, 385.9, 605.7999999999997, 959.8699999999968, 0.702467727806152, 1.5552751710715527, 0.33745729667691443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 142.0, 130, 160, 141.5, 160.0, 160.0, 160.0, 0.03777956880918799, 0.02925702936102156, 0.013429456100141044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fde5021-f472-457b-91e9-e6a480f93c49", 3, 0, 0.0, 395.0, 277, 528, 380.0, 528.0, 528.0, 528.0, 0.08197393228953194, 0.03805170164221111, 0.052567918818482384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 209.4, 128, 539, 139.0, 498.8, 539.0, 539.0, 0.13265297098437348, 0.10765099500782653, 0.04715398577960151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee5b1bfb-7494-4c36-962b-11cd5594ba93", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.8919998254189945, 1.6667030377094973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5351ac97-5d9b-4c77-a90c-0d75fe44d21e", 3, 0, 0.0, 324.3333333333333, 235, 495, 243.0, 495.0, 495.0, 495.0, 0.034032512393506596, 0.028371505286383592, 0.021824234835679687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5211b8a0-6389-496c-99d9-2d131d6e7c7b", 3, 0, 0.0, 941.0, 242, 1340, 1241.0, 1340.0, 1340.0, 1340.0, 0.09576098059244126, 0.043329349942543414, 0.061409222580439224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 268.8333333333333, 259, 290, 263.5, 290.0, 290.0, 290.0, 0.03779075260283808, 0.05856828552803129, 0.08499228832454699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 562.0000000000001, 256, 1526, 510.5, 1066.8000000000004, 1526.0, 1526.0, 0.08250995276305204, 6.289293954921203, 0.1842473835320448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 160.5, 127, 386, 132.5, 318.5000000000002, 386.0, 386.0, 0.10171732754674759, 0.08433399520233271, 0.03615733127638293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 161.68421052631578, 129, 491, 142.0, 176.0, 491.0, 491.0, 0.08971447188867851, 0.06965137221826115, 0.03189069117917869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 151.57142857142858, 127, 377, 132.0, 268.5, 377.0, 377.0, 0.08486957365163465, 0.06307201713759177, 0.042600547711855674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13d220a6-1ca4-431d-acee-140919174764", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.0574037665562914, 1.9757605546357617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 242.64285714285714, 125, 469, 132.0, 426.0, 469.0, 469.0, 0.08469961885171516, 0.03175054071631678, 0.04779714819408313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 334.7142857142857, 126, 1267, 268.0, 888.0, 1267.0, 1267.0, 0.08474627570384809, 5.4679850608205856, 0.0493013350565076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 309.57142857142856, 127, 1012, 157.0, 761.0, 1012.0, 1012.0, 0.0848736897624143, 1.8037908795642343, 0.04945834293214349], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.4669260700389105], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.07782101167315175], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07782101167315175], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.933852140077821], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1285, 20, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
