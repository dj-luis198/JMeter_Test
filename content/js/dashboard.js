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

    var data = {"OkPercent": 99.13928012519561, "KoPercent": 0.8607198748043818};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8233914209115282, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c2ed877-852e-43de-a6c4-013ebb6f641b"], "isController": false}, {"data": [0.39814814814814814, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/60559cfa-c62c-4c9d-aa53-77345d77bccf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/05933e7c-3046-49b4-a7f6-53199ab458d2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d88860b-7e03-45e5-87f3-697d5ed30784"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fb586f6-1c02-4fc7-bdec-719690031c92"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1ec985d-b856-4acd-b975-9f60489ef381"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a438baa-6501-451a-9b84-24dbbdb79ec7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/62cc09e4-c43b-436d-8922-cce2e5723757"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70020451-f978-45a3-9686-b1f17a7d3366"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=739b41a1-2f6b-4e59-a344-4f39399640bf"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c1ec985d-b856-4acd-b975-9f60489ef381"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5d49243-d37c-449b-88e2-0cee5e62ac96"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62cc09e4-c43b-436d-8922-cce2e5723757"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85739182-d859-4248-b56c-8c2f7850be75"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43025ad0-7ce2-4359-9df6-210af0e52f3e"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9bafc8b3-dace-4394-a4ef-799706306820"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c2ed877-852e-43de-a6c4-013ebb6f641b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7e946b6-4f63-466d-ad28-2796233824c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d88860b-7e03-45e5-87f3-697d5ed30784"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7fb586f6-1c02-4fc7-bdec-719690031c92"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e5d49243-d37c-449b-88e2-0cee5e62ac96"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e3f043e-f528-4e5e-b154-16785ba1ec36"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/70020451-f978-45a3-9686-b1f17a7d3366"], "isController": false}, {"data": [0.43103448275862066, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60559cfa-c62c-4c9d-aa53-77345d77bccf"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05933e7c-3046-49b4-a7f6-53199ab458d2"], "isController": false}, {"data": [0.9529411764705882, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43025ad0-7ce2-4359-9df6-210af0e52f3e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/739b41a1-2f6b-4e59-a344-4f39399640bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84c116be-70b6-4814-89d9-3527cc269bcb"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e3f043e-f528-4e5e-b154-16785ba1ec36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7e946b6-4f63-466d-ad28-2796233824c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85739182-d859-4248-b56c-8c2f7850be75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1278, 11, 0.8607198748043818, 316.53677621283265, 76, 2713, 103.5, 875.0, 1037.1, 1711.8900000000003, 5.082117151151231, 726.4044178045592, 3.7039512354853463], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c2ed877-852e-43de-a6c4-013ebb6f641b", 1, 0, 0.0, 964.0, 964, 964, 964.0, 964.0, 964.0, 964.0, 1.037344398340249, 0.18741085321576764, 0.7152003371369294], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1355.018518518519, 985, 2006, 1366.5, 1586.0, 1632.75, 2006.0, 0.25490214589843563, 306.73167267584705, 1.2533518599595932], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/60559cfa-c62c-4c9d-aa53-77345d77bccf", 3, 0, 0.0, 1169.3333333333333, 205, 2713, 590.0, 2713.0, 2713.0, 2713.0, 0.03347616497054098, 0.027907701331235494, 0.02146746256248884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05933e7c-3046-49b4-a7f6-53199ab458d2", 3, 0, 0.0, 255.66666666666669, 163, 420, 184.0, 420.0, 420.0, 420.0, 0.07829014327096219, 0.03542425102429604, 0.050205593178318846], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 508.21428571428567, 384, 903, 458.0, 865.0, 903.0, 903.0, 0.09518499884418216, 0.017196508580247755, 0.06469605390190507], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 508.21428571428567, 384, 903, 458.0, 865.0, 903.0, 903.0, 0.0957526844949046, 0.017299068976130223, 0.06508190274263045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 105.00000000000001, 78, 247, 81.5, 244.0, 247.0, 247.0, 0.09705574466020091, 0.036382364104626086, 0.05476987822970321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 83.57142857142858, 80, 98, 82.5, 92.0, 98.0, 98.0, 0.09716554232253408, 0.07220993916743011, 0.048772547611115734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 177.64285714285714, 79, 629, 88.0, 437.0, 629.0, 629.0, 0.09705709036708379, 2.0627204365835903, 0.05655796128115359], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d88860b-7e03-45e5-87f3-697d5ed30784", 3, 0, 0.0, 483.6666666666667, 404, 610, 437.0, 610.0, 610.0, 610.0, 0.027949616158604754, 0.03303550008850712, 0.017923419216292764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 167.92857142857144, 78, 814, 83.5, 529.0, 814.0, 814.0, 0.09716958869501242, 6.269559988773442, 0.05652862511972681], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 234.57142857142856, 165, 437, 197.0, 392.5, 437.0, 437.0, 0.09467327576296516, 0.19367209530555798, 0.06120479351082318], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fb586f6-1c02-4fc7-bdec-719690031c92", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1ec985d-b856-4acd-b975-9f60489ef381", 1, 0, 0.0, 1488.0, 1488, 1488, 1488.0, 1488.0, 1488.0, 1488.0, 0.6720430107526882, 0.12141402049731183, 0.46334215389784944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 96.94117647058823, 79, 340, 82.0, 136.7999999999998, 340.0, 340.0, 0.09945766321295056, 0.07391336104009315, 0.04992308485493808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 119.41176470588235, 80, 260, 81.0, 244.79999999999998, 260.0, 260.0, 0.09936581231551568, 0.035367105532337725, 0.056178672151269836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 539.8, 470, 641, 484.0, 641.0, 641.0, 641.0, 0.05872956211238489, 17.26844126603317, 0.03349420339221951], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a438baa-6501-451a-9b84-24dbbdb79ec7", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 1.0898837457337884, 2.0364494453924915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 887.6, 842, 942, 885.0, 942.0, 942.0, 942.0, 0.05841530948430965, 52.56219815714303, 0.03325793498960208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62cc09e4-c43b-436d-8922-cce2e5723757", 3, 0, 0.0, 324.3333333333333, 252, 391, 330.0, 391.0, 391.0, 391.0, 0.02344830820456304, 0.027715106474859506, 0.01503683826920221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 178.6, 81, 247, 242.0, 247.0, 247.0, 247.0, 0.058896977407119466, 0.10422004205244186, 0.03261190057601244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 81.81818181818183, 80, 84, 82.0, 83.8, 84.0, 84.0, 0.05277931051027997, 0.039223686814768614, 0.026492739845980377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 126.90909090909092, 78, 246, 82.0, 246.0, 246.0, 246.0, 0.05277931051027997, 0.028535689009908115, 0.029294766451550994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 241.0, 77, 963, 82.0, 927.8000000000002, 963.0, 963.0, 0.05277905727007524, 8.646309769283548, 0.030203640195570397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 193.81818181818184, 78, 636, 82.0, 601.0000000000001, 636.0, 636.0, 0.05274084586727527, 2.8311870406152457, 0.030233277855557204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 125.2, 81, 298, 82.0, 298.0, 298.0, 298.0, 0.059007493951731875, 0.043852248923113235, 0.03313409084203694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 606.4374999999999, 82, 1048, 819.5, 1006.0, 1048.0, 1048.0, 0.08463727637244634, 47.60653593182996, 0.04521151384348451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 136.8235294117647, 76, 704, 81.0, 335.1999999999997, 704.0, 704.0, 0.09936465073325268, 5.284529261793708, 0.057913243700573394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 438.87499999999994, 81, 734, 553.0, 725.6, 734.0, 734.0, 0.08463817181548879, 15.562575215562845, 0.04529464663563267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 122.88235294117646, 78, 635, 82.0, 317.39999999999975, 635.0, 635.0, 0.09946057265887363, 1.7455079107721652, 0.05806627986742491], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 668.7857142857142, 181, 1488, 569.0, 1277.0, 1488.0, 1488.0, 0.09592063252805678, 0.017329411150088382, 0.0661327798484454], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 365.45454545454544, 162, 1045, 315.0, 1009.8000000000002, 1045.0, 1045.0, 0.05272011847648443, 11.534412121253876, 0.11611624816078678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 568.8181818181818, 113, 1095, 567.5, 1040.8, 1093.8, 1095.0, 0.09913258983890953, 0.0608929677819083, 0.04482264560099132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 103.81249999999999, 78, 252, 82.5, 247.8, 252.0, 252.0, 0.08463772409159917, 0.06289971487666697, 0.04248417010066599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 132.25, 79, 253, 82.0, 246.0, 253.0, 253.0, 0.08463817181548879, 0.10209892747566653, 0.043827529887854426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70020451-f978-45a3-9686-b1f17a7d3366", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["login", 22, 0, 0.0, 2847.3181818181815, 1334, 4723, 2838.5, 4560.599999999999, 4714.3, 4723.0, 0.10234319394500449, 27.967917189527967, 0.1929837925596498], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 98.99999999999999, 83, 244, 86.0, 139.99999999999991, 244.0, 244.0, 0.09603000655263574, 0.07774304241419437, 0.03413566639175724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=739b41a1-2f6b-4e59-a344-4f39399640bf", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1ec985d-b856-4acd-b975-9f60489ef381", 3, 0, 0.0, 570.6666666666666, 192, 951, 569.0, 951.0, 951.0, 951.0, 0.03591868010823496, 0.029943925702210192, 0.02303378900170015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5d49243-d37c-449b-88e2-0cee5e62ac96", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62cc09e4-c43b-436d-8922-cce2e5723757", 1, 0, 0.0, 727.0, 727, 727, 727.0, 727.0, 727.0, 727.0, 1.375515818431912, 0.2485062757909216, 0.9483536795048143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85739182-d859-4248-b56c-8c2f7850be75", 3, 0, 0.0, 287.0, 202, 426, 233.0, 426.0, 426.0, 426.0, 0.04839256045037343, 0.031111753544755053, 0.031032989611730354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 711.3749999999999, 166, 1148, 902.0, 1094.1000000000001, 1148.0, 1148.0, 0.08460013218770654, 63.30614879378718, 0.1767390945142102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43025ad0-7ce2-4359-9df6-210af0e52f3e", 3, 0, 0.0, 320.0, 270, 358, 332.0, 358.0, 358.0, 358.0, 0.020587286664241942, 0.028381236661153848, 0.013202133700702025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 309.42857142857144, 163, 897, 319.0, 621.5, 897.0, 897.0, 0.09699858659202394, 8.428450497377574, 0.21637938052545522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1013.4, 926, 1240, 968.0, 1240.0, 1240.0, 1240.0, 0.05835871937626201, 69.81731714754251, 0.13159207328104391], "isController": false}, {"data": ["register", 24, 6, 25.0, 1042.8333333333335, 122, 1770, 1028.0, 1728.0, 1764.0, 1770.0, 0.096247934679735, 0.030359455958549223, 0.04342436115433356], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9bafc8b3-dace-4394-a4ef-799706306820", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.8784466911764706, 3.5098805147058822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 96.14285714285714, 82, 245, 85.0, 167.0, 245.0, 245.0, 0.06682003455550359, 0.05187688229650913, 0.023752434158401666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 253.88235294117644, 161, 785, 167.0, 620.1999999999998, 785.0, 785.0, 0.09931646900741953, 7.134103705380617, 0.22187029889875565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 295.90000000000003, 160, 1192, 167.0, 885.5000000000014, 1179.7499999999998, 1192.0, 0.12915641487623586, 15.631747918160038, 0.2871712162013807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 83.25, 79, 90, 82.0, 90.0, 90.0, 90.0, 0.05825596213362461, 0.04329373748407064, 0.029241762242854543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 120.625, 78, 241, 83.0, 241.0, 241.0, 241.0, 0.05825765906161476, 0.026526009313943243, 0.032613479547920564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 228.12499999999997, 80, 945, 83.5, 945.0, 945.0, 945.0, 0.058258083309059135, 6.566330298299593, 0.03362356175356831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 191.0, 78, 637, 84.0, 637.0, 637.0, 637.0, 0.058258083309059135, 2.1549659326755024, 0.033680454413049815], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 933.7222222222222, 630, 1662, 893.5, 1237.5, 1292.75, 1662.0, 0.24299914950297674, 290.7114629786296, 0.47982839872560445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1042.8333333333335, 122, 1770, 1028.0, 1728.0, 1764.0, 1770.0, 0.09752569192446636, 0.030762498526955694, 0.044000849286233844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 95.0, 79, 241, 82.0, 193.90000000000015, 241.0, 241.0, 0.06389538196126875, 0.017221802169248217, 0.03762589386977056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c2ed877-852e-43de-a6c4-013ebb6f641b", 3, 0, 0.0, 287.3333333333333, 180, 402, 280.0, 402.0, 402.0, 402.0, 0.031000062000124003, 0.025379282529398393, 0.01987959705086077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7e946b6-4f63-466d-ad28-2796233824c8", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 0.9981439917127072, 3.8091332872928176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 108.83333333333334, 79, 243, 82.5, 242.7, 243.0, 243.0, 0.06389606240515429, 0.01722198557013924, 0.03756389606240515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 92.14285714285714, 77, 240, 81.5, 161.5, 240.0, 240.0, 0.06698788954653984, 0.018055329604340815, 0.039381552252946275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 138.42857142857144, 79, 248, 82.0, 245.5, 248.0, 248.0, 0.06693600439865172, 0.018041344935574095, 0.039416416652721664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 85.92857142857142, 78, 139, 82.0, 113.5, 139.0, 139.0, 0.06698564593301434, 0.04978132476076555, 0.033623654306220094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 101.5, 79, 324, 81.0, 253.80000000000024, 324.0, 324.0, 0.06389606240515429, 0.017097188573254173, 0.03644072309043955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 126.85714285714288, 78, 252, 82.5, 247.0, 252.0, 252.0, 0.06693792463745941, 0.017911124365882696, 0.03817553514480108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 95.99999999999999, 80, 240, 82.0, 195.30000000000015, 240.0, 240.0, 0.06389504174476061, 0.04748449879664338, 0.03207231587578804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 99.41666666666667, 83, 247, 85.5, 200.20000000000016, 247.0, 247.0, 0.06462244337458399, 0.0508649310155417, 0.022971259168309156], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 542.5, 358, 1206, 456.0, 963.5, 1206.0, 1206.0, 0.09773055685475145, 0.01765639943176662, 0.06652167785914234], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d88860b-7e03-45e5-87f3-697d5ed30784", 1, 0, 0.0, 953.0, 953, 953, 953.0, 953.0, 953.0, 953.0, 1.0493179433368311, 0.18957404249737672, 0.7234555351521511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fb586f6-1c02-4fc7-bdec-719690031c92", 3, 0, 0.0, 272.3333333333333, 164, 479, 174.0, 479.0, 479.0, 479.0, 0.0916254352208173, 0.0413984713823224, 0.058757196414391304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5d49243-d37c-449b-88e2-0cee5e62ac96", 3, 0, 0.0, 430.66666666666663, 169, 717, 406.0, 717.0, 717.0, 717.0, 0.01787256858598195, 0.021124771007714992, 0.011461250037234519], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e3f043e-f528-4e5e-b154-16785ba1ec36", 3, 0, 0.0, 675.3333333333334, 165, 1419, 442.0, 1419.0, 1419.0, 1419.0, 0.041590994163397156, 0.027226396244333227, 0.026671308106084764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1539.7727272727275, 783, 2574, 1314.5, 2462.1, 2562.2999999999997, 2574.0, 0.10068281252860307, 0.05211122132828089, 0.046310160840793015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 226.66666666666669, 162, 484, 167.0, 461.2000000000001, 484.0, 484.0, 0.06386715631486509, 0.09898161823407313, 0.1436387314386077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70020451-f978-45a3-9686-b1f17a7d3366", 3, 0, 0.0, 425.66666666666663, 167, 721, 389.0, 721.0, 721.0, 721.0, 0.021577611070752987, 0.025504005793588577, 0.013837205016075322], "isController": false}, {"data": ["addBook", 58, 5, 8.620689655172415, 912.3620689655173, 438, 2078, 737.0, 1499.9, 1530.8999999999999, 2078.0, 0.27075475221271983, 95.99433497468677, 0.982233615836352], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60559cfa-c62c-4c9d-aa53-77345d77bccf", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 151.22222222222223, 80, 588, 84.0, 329.0, 334.75, 588.0, 0.24393990043638136, 0.1812873674141467, 0.11792016671485232], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 502.14814814814815, 382, 803, 475.5, 699.5, 731.75, 803.0, 0.24409979161110382, 71.77344360955786, 0.12276503191378757], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 132.79629629629636, 80, 328, 84.0, 245.0, 256.25, 328.0, 0.24437264112520027, 0.432425025116077, 0.11884528835971653], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 779.703703703704, 546, 1078, 780.0, 963.0, 1001.75, 1078.0, 0.2436845097879945, 219.2677502589148, 0.1223182012021769], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 87.09999999999998, 80, 101, 85.0, 98.80000000000001, 100.9, 101.0, 0.12477618272224199, 0.09321658181886242, 0.04435403370204695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05933e7c-3046-49b4-a7f6-53199ab458d2", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, 2.9411764705882355, 151.84705882352935, 79, 1501, 89.0, 287.60000000000014, 392.1999999999996, 886.8499999999931, 0.6898678700126611, 1.4907970167779923, 0.3325378717170405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 106.74999999999999, 81, 246, 85.0, 246.0, 246.0, 246.0, 0.054706839722636326, 0.042365745996143164, 0.01944657193265588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 96.57142857142856, 79, 245, 84.5, 173.0, 245.0, 245.0, 0.09257055198497713, 0.07512317255812109, 0.032905938400909836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43025ad0-7ce2-4359-9df6-210af0e52f3e", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/739b41a1-2f6b-4e59-a344-4f39399640bf", 3, 0, 0.0, 1269.0, 261, 2340, 1206.0, 2340.0, 2340.0, 2340.0, 0.037192695354632356, 0.023911319441861617, 0.023850784455932854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84c116be-70b6-4814-89d9-3527cc269bcb", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 332.875, 161, 1024, 244.0, 1024.0, 1024.0, 1024.0, 0.058219925769594644, 8.785359792318609, 0.12907596335783422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 249.6428571428571, 160, 341, 269.5, 336.0, 341.0, 341.0, 0.06690881284649207, 0.10369559178455362, 0.15047948826706173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e3f043e-f528-4e5e-b154-16785ba1ec36", 1, 0, 0.0, 1066.0, 1066, 1066, 1066.0, 1066.0, 1066.0, 1066.0, 0.9380863039399625, 0.16947848264540336, 0.6467665337711069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7e946b6-4f63-466d-ad28-2796233824c8", 3, 0, 0.0, 359.3333333333333, 260, 470, 348.0, 470.0, 470.0, 470.0, 0.06969774411634877, 0.0308557721348419, 0.044695493460028345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 103.63636363636364, 79, 246, 87.0, 221.2000000000001, 246.0, 246.0, 0.05197677110847552, 0.04309402213974191, 0.018476117854965907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 106.0625, 80, 393, 86.0, 190.70000000000022, 393.0, 393.0, 0.08434503444967502, 0.0654827171752848, 0.029982023964532912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85739182-d859-4248-b56c-8c2f7850be75", 1, 0, 0.0, 1000.0, 1000, 1000, 1000.0, 1000.0, 1000.0, 1000.0, 1.0, 0.1806640625, 0.689453125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 89.7, 78, 235, 82.0, 88.60000000000001, 227.6999999999999, 235.0, 0.12922484476865523, 0.09603526061420568, 0.06486481465926638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 104.80000000000001, 77, 241, 81.0, 240.10000000000002, 241.0, 241.0, 0.1292298546810284, 0.053988800617718706, 0.07261607264010131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 196.85, 77, 957, 83.0, 803.0000000000014, 952.4, 957.0, 0.1292281846670759, 11.65932270296902, 0.07486148353955999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 161.05, 77, 639, 82.5, 581.7000000000007, 638.0, 639.0, 0.12922651469628538, 3.8310361301181777, 0.0749867138989578], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 54.54545454545455, 0.4694835680751174], "isController": false}, {"data": ["401/Unauthorized", 5, 45.45454545454545, 0.39123630672926446], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1278, 11, "406/Not Acceptable", 6, "401/Unauthorized", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
