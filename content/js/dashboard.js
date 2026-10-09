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

    var data = {"OkPercent": 99.31972789115646, "KoPercent": 0.6802721088435374};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7376783398184177, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/527c3400-a692-4ab3-8213-21dfaa2de12a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d39ec585-10a2-4232-85f6-db6b84cb1479"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc58408f-ed47-4b1b-8667-aba747643805"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/06c2b04b-7342-4778-bec9-4de2b0bfbc0c"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/f4742f7a-f64b-484f-b5a1-6cf965b3c8e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c3fce199-ef05-464e-8c9f-97d139ec45f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.90625, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/77884a80-3483-4713-a4cc-a643f0b44155"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1448cf1a-084a-48e1-89cd-b88c72b92584"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8dc243ee-c306-4650-8fdb-2a8a44a45181"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d77a5ade-7379-41fb-82d1-12287c30be12"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=178c8557-3ede-4b40-b5a5-0e854d46c53b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7bcab43f-f751-4331-9c1b-00241b90beda"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3391dace-aa24-404a-9909-a51f1faefec6"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d728660-86c5-4e88-9123-8526c4704c8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4742f7a-f64b-484f-b5a1-6cf965b3c8e5"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.28448275862068967, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c67821b-65ee-4859-a184-5c27e5a1770f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc58408f-ed47-4b1b-8667-aba747643805"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3fce199-ef05-464e-8c9f-97d139ec45f9"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06c2b04b-7342-4778-bec9-4de2b0bfbc0c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=527c3400-a692-4ab3-8213-21dfaa2de12a"], "isController": false}, {"data": [0.30833333333333335, 500, 1500, "addBook"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/6bd3b421-e857-4d3b-9337-73d0c7563eef"], "isController": false}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77884a80-3483-4713-a4cc-a643f0b44155"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dc243ee-c306-4650-8fdb-2a8a44a45181"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.41379310344827586, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9606741573033708, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1448cf1a-084a-48e1-89cd-b88c72b92584"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/178c8557-3ede-4b40-b5a5-0e854d46c53b"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c67821b-65ee-4859-a184-5c27e5a1770f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d77a5ade-7379-41fb-82d1-12287c30be12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b8c85d2-ca24-453d-85c9-6915ced199e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d728660-86c5-4e88-9123-8526c4704c8d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3391dace-aa24-404a-9909-a51f1faefec6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d39ec585-10a2-4232-85f6-db6b84cb1479"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1323, 9, 0.6802721088435374, 475.30007558578984, 125, 3785, 159.0, 1369.6000000000001, 1578.7999999999993, 2322.0399999999995, 5.181326858306572, 724.9101687945484, 3.779966937465732], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2192.534482758621, 1554, 3021, 2169.0, 2561.8, 2943.95, 3021.0, 0.24480010804970284, 294.5769859738507, 1.2036802187795448], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/527c3400-a692-4ab3-8213-21dfaa2de12a", 3, 0, 0.0, 507.0, 272, 953, 296.0, 953.0, 953.0, 953.0, 0.05241914347119568, 0.032608392960109034, 0.033615140832765456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d39ec585-10a2-4232-85f6-db6b84cb1479", 3, 0, 0.0, 1146.0, 429, 2138, 871.0, 2138.0, 2138.0, 2138.0, 0.038839979285344384, 0.024970364286639048, 0.024907148174520975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc58408f-ed47-4b1b-8667-aba747643805", 3, 0, 0.0, 374.6666666666667, 247, 592, 285.0, 592.0, 592.0, 592.0, 0.017833259028087384, 0.024584587234358746, 0.011436041759548224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06c2b04b-7342-4778-bec9-4de2b0bfbc0c", 3, 0, 0.0, 901.3333333333334, 635, 1416, 653.0, 1416.0, 1416.0, 1416.0, 0.022042777683891873, 0.02605381698249069, 0.014135505220464516], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 760.0714285714287, 506, 1253, 628.0, 1240.0, 1253.0, 1253.0, 0.07680786512538884, 0.01387642094550482, 0.05220534582741273], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 760.0714285714287, 506, 1253, 628.0, 1240.0, 1253.0, 1253.0, 0.07590215128383067, 0.01371279100342644, 0.051589743450728656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4742f7a-f64b-484f-b5a1-6cf965b3c8e5", 3, 0, 0.0, 1029.3333333333333, 618, 1851, 619.0, 1851.0, 1851.0, 1851.0, 0.0715597643298428, 0.032378929823724444, 0.04588956241204112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 225.33333333333334, 126, 419, 140.0, 417.8, 419.0, 419.0, 0.132013201320132, 0.061760863586358634, 0.07381050605060506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3fce199-ef05-464e-8c9f-97d139ec45f9", 3, 0, 0.0, 343.0, 235, 540, 254.0, 540.0, 540.0, 540.0, 0.02121250689406474, 0.029243153221472716, 0.013603072454852715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 149.8666666666667, 127, 386, 131.0, 239.00000000000009, 386.0, 386.0, 0.13229846533780207, 0.09831946496295643, 0.06640762810901393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 260.59999999999997, 126, 880, 139.0, 805.0, 880.0, 880.0, 0.13228796444099516, 5.217175497623226, 0.07638424196791577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 351.6666666666667, 125, 1566, 128.0, 1535.4, 1566.0, 1566.0, 0.13230196600721486, 15.903643789084207, 0.07626312545754431], "isController": false}, {"data": ["goToProfile", 16, 0, 0.0, 427.875, 224, 1851, 287.0, 999.8000000000009, 1851.0, 1851.0, 0.07649755924975019, 0.16657735726033554, 0.049454476780600214], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/77884a80-3483-4713-a4cc-a643f0b44155", 3, 0, 0.0, 441.0, 301, 516, 506.0, 516.0, 516.0, 516.0, 0.09262975885386113, 0.042998058634637355, 0.05940124509834192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1448cf1a-084a-48e1-89cd-b88c72b92584", 3, 0, 0.0, 470.3333333333333, 371, 573, 467.0, 573.0, 573.0, 573.0, 0.058605196327407696, 0.02651732516116429, 0.03758210832193788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 149.35294117647058, 127, 393, 130.0, 214.59999999999985, 393.0, 393.0, 0.07620857839621288, 0.0566354767182793, 0.03825313407778654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 192.47058823529412, 126, 419, 132.0, 388.59999999999997, 419.0, 419.0, 0.07612428857374429, 0.033820384181372835, 0.04266248617448583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 934.0, 825, 1043, 934.0, 1043.0, 1043.0, 1043.0, 0.046210720887245836, 13.587486281192236, 0.026354551756007392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1402.0, 1390, 1414, 1402.0, 1414.0, 1414.0, 1414.0, 0.04561523548865321, 41.044669075721295, 0.025970392861215646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 260.0, 127, 393, 260.0, 393.0, 393.0, 393.0, 0.046676624346527265, 0.08259574542569081, 0.025845357426250933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 177.88235294117646, 128, 384, 135.0, 381.6, 384.0, 384.0, 0.07786984742090484, 0.0578700721555748, 0.03908701325619638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 184.58823529411762, 127, 418, 133.0, 416.4, 418.0, 418.0, 0.07787305775432425, 0.02083712678191879, 0.044411978250513046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 197.00000000000006, 128, 413, 141.0, 394.59999999999997, 413.0, 413.0, 0.07777152555709574, 0.02096185649781096, 0.04572115076696449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 149.58823529411765, 125, 415, 130.0, 210.19999999999982, 415.0, 415.0, 0.07777152555709574, 0.02096185649781096, 0.04579709952239134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 273.5, 129, 418, 273.5, 418.0, 418.0, 418.0, 0.04696599661844825, 0.03490344084632726, 0.02637250786680443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 349.2352941176471, 126, 1526, 138.0, 1412.3999999999999, 1526.0, 1526.0, 0.07612497033365127, 8.076619712673017, 0.04398351054778633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 1218.6153846153845, 128, 1764, 1502.0, 1724.8, 1764.0, 1764.0, 0.10503522719927606, 72.70721165305248, 0.05480579087486265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 299.3529411764706, 127, 1004, 140.0, 998.4, 1004.0, 1004.0, 0.07621131155184162, 2.65443717946419, 0.044107821914338485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 799.0000000000001, 127, 1181, 817.0, 1160.2, 1181.0, 1181.0, 0.10502504443367265, 23.761032678946517, 0.05490304118193569], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 643.8571428571428, 228, 1450, 542.5, 1197.0, 1450.0, 1450.0, 0.07617969702246213, 0.013762933544097161, 0.05252233017368971], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8dc243ee-c306-4650-8fdb-2a8a44a45181", 3, 0, 0.0, 354.0, 241, 511, 310.0, 511.0, 511.0, 511.0, 0.04656938838869916, 0.029939629579323192, 0.029863833048742627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 383.94117647058823, 257, 799, 278.0, 798.2, 799.0, 799.0, 0.07772210233714934, 0.12045407852446874, 0.17479882976802238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 668.6315789473684, 160, 1674, 641.0, 994.0, 1674.0, 1674.0, 0.09063112654490295, 0.055670877535882776, 0.040978722256142644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 155.9230769230769, 126, 407, 134.0, 302.9999999999999, 407.0, 407.0, 0.10501825702006656, 0.07804579452370182, 0.0527142422932756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 267.6923076923077, 126, 559, 142.0, 502.59999999999997, 559.0, 559.0, 0.10503692451885008, 0.14945984256580966, 0.05311813220108915], "isController": false}, {"data": ["login", 19, 0, 0.0, 3394.157894736842, 2090, 5891, 3133.0, 5291.0, 5891.0, 5891.0, 0.08888015680330821, 11.318789294385114, 0.14961523516987807], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 139.70588235294116, 128, 170, 141.0, 158.0, 170.0, 170.0, 0.07647564250786125, 0.06191240980372751, 0.027184701047716302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d77a5ade-7379-41fb-82d1-12287c30be12", 1, 0, 0.0, 816.0, 816, 816, 816.0, 816.0, 816.0, 816.0, 1.2254901960784315, 0.22140203737745098, 0.8449180453431373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=178c8557-3ede-4b40-b5a5-0e854d46c53b", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 0.22985249681933842, 0.8771668256997455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bcab43f-f751-4331-9c1b-00241b90beda", 2, 0, 0.0, 358.5, 285, 432, 358.5, 432.0, 432.0, 432.0, 0.04385580212262082, 0.03875927824313657, 0.027259978565476715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3391dace-aa24-404a-9909-a51f1faefec6", 3, 0, 0.0, 368.3333333333333, 224, 502, 379.0, 502.0, 502.0, 502.0, 0.05217754278558508, 0.03245810034611103, 0.033460208101433145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1405.7692307692307, 262, 1907, 1644.0, 1863.0, 1907.0, 1907.0, 0.10489961913369052, 96.57321974503341, 0.21527589356319798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 577.9333333333334, 262, 1695, 507.0, 1665.0, 1695.0, 1695.0, 0.13186117655332466, 21.210685796243716, 0.2920604874687929], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1676.5, 1544, 1809, 1676.5, 1809.0, 1809.0, 1809.0, 0.04548038658328596, 54.4103538942581, 0.1025529420125071], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1419.375, 217, 3785, 1301.5, 2849.5, 3741.25, 3785.0, 0.0962900255569776, 0.03023168282867998, 0.04344335137433951], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 566.1764705882352, 261, 1661, 511.0, 1553.0, 1661.0, 1661.0, 0.07607829799421804, 10.811810855086506, 0.16881183459459217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 183.75000000000003, 130, 421, 145.5, 412.70000000000005, 420.7, 421.0, 0.12042824283150884, 0.09349653618266555, 0.04280847694401291], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d728660-86c5-4e88-9123-8526c4704c8d", 3, 0, 0.0, 383.3333333333333, 255, 582, 313.0, 582.0, 582.0, 582.0, 0.03447206039504981, 0.028737938369701357, 0.022106106438231812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4742f7a-f64b-484f-b5a1-6cf965b3c8e5", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 489.33333333333337, 256, 1802, 281.0, 1317.8000000000009, 1802.0, 1802.0, 0.16905694401397536, 22.705213410911686, 0.3754069400223531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 163.66666666666669, 128, 392, 135.0, 392.0, 392.0, 392.0, 0.051969049543827237, 0.03862152998325442, 0.0260860268218039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 162.22222222222223, 125, 375, 140.0, 375.0, 375.0, 375.0, 0.051967549152640236, 0.013905379363108815, 0.029637742876115137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 161.11111111111111, 127, 381, 131.0, 381.0, 381.0, 381.0, 0.05196784922394679, 0.014006959361141907, 0.03055141136017184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 196.88888888888889, 126, 413, 139.0, 413.0, 413.0, 413.0, 0.051968149298718694, 0.014007040240670274, 0.030602337917116577], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1495.7758620689651, 1004, 2428, 1398.0, 2031.3, 2338.1499999999996, 2428.0, 0.2460546410996097, 294.366893188953, 0.4858618010775496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1419.375, 217, 3785, 1301.5, 2849.5, 3741.25, 3785.0, 0.0940564181748352, 0.029530408635946796, 0.04243561054372448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c67821b-65ee-4859-a184-5c27e5a1770f", 3, 0, 0.0, 385.3333333333333, 258, 514, 384.0, 514.0, 514.0, 514.0, 0.025028156676260793, 0.025101481354023278, 0.016049957243565678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 193.44444444444446, 126, 420, 139.0, 420.0, 420.0, 420.0, 0.05381584218803256, 0.01450505121474315, 0.03169038363221058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 133.33333333333334, 127, 139, 132.0, 139.0, 139.0, 139.0, 0.05381391149405356, 0.014504530832381625, 0.03163669406193383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 268.8, 127, 1530, 139.0, 417.9, 1474.3999999999992, 1530.0, 0.12242599348693715, 5.539303956578561, 0.07144704463651723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 226.1, 125, 818, 135.5, 551.1000000000004, 805.5499999999998, 818.0, 0.12243573654278211, 1.8313588338914362, 0.0715722967719818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 162.77777777777777, 125, 419, 129.0, 419.0, 419.0, 419.0, 0.05381616398383123, 0.014400028253486092, 0.030692031022028752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 174.85, 127, 422, 138.5, 394.3, 420.7, 422.0, 0.12242974063259447, 0.09098538341934022, 0.06145399090347027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 164.22222222222223, 128, 397, 135.0, 397.0, 397.0, 397.0, 0.05381487682372638, 0.03999328248325759, 0.02701254559315953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 190.65, 125, 538, 134.0, 390.0, 530.6499999999999, 538.0, 0.12243573654278211, 0.041955761672717036, 0.0693124965564949], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 609.3571428571429, 502, 953, 577.5, 912.0, 953.0, 953.0, 0.07774926971221663, 0.014046498922617263, 0.05292113377872558], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 142.55555555555554, 134, 159, 142.0, 159.0, 159.0, 159.0, 0.05451505827054006, 0.042909313443413366, 0.019378399619606038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc58408f-ed47-4b1b-8667-aba747643805", 1, 0, 0.0, 1450.0, 1450, 1450, 1450.0, 1450.0, 1450.0, 1450.0, 0.689655172413793, 0.1245959051724138, 0.4754849137931035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3fce199-ef05-464e-8c9f-97d139ec45f9", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1933.421052631579, 1365, 3656, 1648.0, 3362.0, 3656.0, 3656.0, 0.08959136905042579, 0.04637053280930241, 0.04120853010034233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 361.5555555555555, 261, 818, 279.0, 818.0, 818.0, 818.0, 0.053772113781792766, 0.08333627399580577, 0.12093474417916869], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06c2b04b-7342-4778-bec9-4de2b0bfbc0c", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=527c3400-a692-4ab3-8213-21dfaa2de12a", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["addBook", 60, 2, 3.3333333333333335, 1554.75, 660, 4713, 1170.5, 2440.8, 3631.949999999999, 4713.0, 0.2980255805289954, 102.12409680398609, 1.0831561219421335], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6bd3b421-e857-4d3b-9337-73d0c7563eef", 1, 0, 0.0, 2879.0, 2879, 2879, 2879.0, 2879.0, 2879.0, 2879.0, 0.3473428273706148, 0.11091904741229594, 0.2072524096908649], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 226.01724137931046, 127, 807, 140.0, 514.1, 527.8499999999999, 807.0, 0.24725462110360819, 0.1837507486912557, 0.11952249750613873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77884a80-3483-4713-a4cc-a643f0b44155", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 840.7758620689656, 627, 1255, 758.0, 1152.8, 1244.1, 1255.0, 0.24747300197551725, 72.76527945782078, 0.12446151954823377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dc243ee-c306-4650-8fdb-2a8a44a45181", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 0.25445642605633806, 0.9710607394366197], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 214.93103448275855, 127, 558, 139.0, 411.6, 420.29999999999995, 558.0, 0.24800950988189613, 0.43886057803319906, 0.12061399992303154], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1267.8793103448277, 872, 1884, 1247.5, 1523.7, 1686.7499999999995, 1884.0, 0.24694091300016177, 222.1978675933692, 0.12395276297078434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 144.11111111111111, 131, 174, 142.0, 162.3, 174.0, 174.0, 0.17224056265250465, 0.1286758109659825, 0.06122613750538252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 2, 1.1235955056179776, 264.07865168539325, 127, 3478, 145.5, 380.0999999999999, 450.7999999999997, 3147.7800000000034, 0.7312043510766779, 1.5524292518711438, 0.35222746463107046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 204.66666666666666, 131, 421, 145.0, 421.0, 421.0, 421.0, 0.05259989596909464, 0.04073409912450395, 0.01869761927026411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1448cf1a-084a-48e1-89cd-b88c72b92584", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 156.06666666666666, 129, 382, 141.0, 242.80000000000007, 382.0, 382.0, 0.13889274702075058, 0.11271471950609739, 0.04937203116753243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/178c8557-3ede-4b40-b5a5-0e854d46c53b", 3, 0, 0.0, 475.0, 273, 629, 523.0, 629.0, 629.0, 629.0, 0.02069308023396976, 0.028513609580206378, 0.013269976582330869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 364.8888888888889, 257, 805, 281.0, 805.0, 805.0, 805.0, 0.05192437503245273, 0.08047263982080322, 0.11677913642552602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 489.95000000000005, 260, 1669, 282.5, 947.5, 1632.9999999999995, 1669.0, 0.12232490718597666, 7.497256529474186, 0.2735466845362969], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c67821b-65ee-4859-a184-5c27e5a1770f", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d77a5ade-7379-41fb-82d1-12287c30be12", 3, 0, 0.0, 438.0, 256, 593, 465.0, 593.0, 593.0, 593.0, 0.016136406422289758, 0.022245338931769897, 0.010347890837210553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 149.41176470588238, 135, 199, 143.0, 177.39999999999998, 199.0, 199.0, 0.08005500249583243, 0.06637372765523607, 0.028457051668440432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b8c85d2-ca24-453d-85c9-6915ced199e5", 2, 0, 0.0, 314.0, 284, 344, 314.0, 344.0, 344.0, 344.0, 0.015211786091863976, 0.02599670474683785, 0.009455372897921309], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 138.46153846153845, 129, 158, 134.0, 154.4, 158.0, 158.0, 0.10592098294672174, 0.08223357562758182, 0.03765159940684249], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d728660-86c5-4e88-9123-8526c4704c8d", 1, 0, 0.0, 944.0, 944, 944, 944.0, 944.0, 944.0, 944.0, 1.0593220338983051, 0.19138142213983053, 0.7303528866525424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3391dace-aa24-404a-9909-a51f1faefec6", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 133.9444444444444, 127, 146, 132.5, 141.5, 146.0, 146.0, 0.17174589241073984, 0.12763537512165335, 0.08620838740148465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 194.88888888888889, 126, 425, 137.5, 420.5, 425.0, 425.0, 0.17174589241073984, 0.07461703051352021, 0.09634616577295194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 301.16666666666663, 126, 1666, 136.5, 1186.3000000000009, 1666.0, 1666.0, 0.16926201760324983, 16.963025799527948, 0.09789133613556007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d39ec585-10a2-4232-85f6-db6b84cb1479", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 285.6666666666667, 127, 1112, 132.5, 858.2000000000004, 1112.0, 1112.0, 0.1706031770102741, 5.614540188895629, 0.09883358963301361], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 77.77777777777777, 0.5291005291005291], "isController": false}, {"data": ["401/Unauthorized", 2, 22.22222222222222, 0.15117157974300832], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1323, 9, "406/Not Acceptable", 7, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
