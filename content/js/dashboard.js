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

    var data = {"OkPercent": 98.32953682611996, "KoPercent": 1.6704631738800304};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7782834850455137, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09821428571428571, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4522e44c-1893-4744-8ed3-ba4eb5d10fd7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d662d235-292f-4580-8561-5baf6ee6785b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1b7bf28-f9ae-48c1-b590-239ca4670b31"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/72638317-45d4-40fb-8828-21e61e87d969"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/14823e76-d50f-443f-9e70-f54e558c2b99"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1e848cca-4beb-4dab-a437-6e55a840aa07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e76f2de-c5b2-4df1-b14a-c3d0c34f3fe7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae908244-918f-4a00-8304-a400bf053dd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a3eb925a-c82b-47d9-b41b-0602d3931cee"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e2ec11a-00f4-41a1-8cde-33c9431c24b5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff40493c-02dd-450f-9a0b-6c773c0f7a53"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0864df61-9a60-4939-9150-cf4ace3101aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c140a6d-d834-433e-9ed7-e3c3e8a42431"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76a6de2a-586c-4ba8-bf73-020cbad0cf6f"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd4cc74e-b40e-437a-945b-1e4988ed563a"], "isController": false}, {"data": [0.18, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e848cca-4beb-4dab-a437-6e55a840aa07"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ae908244-918f-4a00-8304-a400bf053dd8"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9e76f2de-c5b2-4df1-b14a-c3d0c34f3fe7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14823e76-d50f-443f-9e70-f54e558c2b99"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d662d235-292f-4580-8561-5baf6ee6785b"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72638317-45d4-40fb-8828-21e61e87d969"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1b7bf28-f9ae-48c1-b590-239ca4670b31"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4522e44c-1893-4744-8ed3-ba4eb5d10fd7"], "isController": false}, {"data": [0.3, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3eb925a-c82b-47d9-b41b-0602d3931cee"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9289772727272727, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0864df61-9a60-4939-9150-cf4ace3101aa"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e2ec11a-00f4-41a1-8cde-33c9431c24b5"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff40493c-02dd-450f-9a0b-6c773c0f7a53"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2c140a6d-d834-433e-9ed7-e3c3e8a42431"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd4cc74e-b40e-437a-945b-1e4988ed563a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1317, 22, 1.6704631738800304, 367.6674259681101, 100, 4377, 117.0, 1012.2, 1228.1999999999998, 1751.5799999999988, 5.213116311472814, 713.7245215187011, 3.812320916639618], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1673.4464285714282, 1224, 2170, 1648.5, 2010.4, 2137.8, 2170.0, 0.24878163636121317, 299.3689248412906, 1.223257362381551], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4522e44c-1893-4744-8ed3-ba4eb5d10fd7", 3, 0, 0.0, 330.3333333333333, 221, 468, 302.0, 468.0, 468.0, 468.0, 0.01717701486384353, 0.023679901675904086, 0.011015208099535077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d662d235-292f-4580-8561-5baf6ee6785b", 3, 0, 0.0, 326.6666666666667, 220, 466, 294.0, 466.0, 466.0, 466.0, 0.024673284589888888, 0.029162987091759945, 0.01582238627671911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1b7bf28-f9ae-48c1-b590-239ca4670b31", 3, 0, 0.0, 313.0, 225, 418, 296.0, 418.0, 418.0, 418.0, 0.02845435920783064, 0.023721228493246833, 0.0182470988409591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72638317-45d4-40fb-8828-21e61e87d969", 3, 0, 0.0, 784.0, 287, 1501, 564.0, 1501.0, 1501.0, 1501.0, 0.028385436378775265, 0.028468596836916205, 0.018202900281962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14823e76-d50f-443f-9e70-f54e558c2b99", 3, 0, 0.0, 784.0, 249, 1587, 516.0, 1587.0, 1587.0, 1587.0, 0.05216393385613187, 0.033875992201491886, 0.033451481021022064], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 551.0, 110, 1171, 466.0, 1058.2, 1171.0, 1171.0, 0.08889626398634554, 0.01673749970367912, 0.06013809108607529], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 551.0, 110, 1171, 466.0, 1058.2, 1171.0, 1171.0, 0.08770391159445712, 0.016513002104893877, 0.05933146779804713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e848cca-4beb-4dab-a437-6e55a840aa07", 3, 0, 0.0, 377.33333333333337, 190, 711, 231.0, 711.0, 711.0, 711.0, 0.03715078264315435, 0.030971078889686945, 0.023823906838220728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 138.76470588235293, 101, 305, 103.0, 303.4, 305.0, 305.0, 0.07630915081381465, 0.027160586996920703, 0.043143075730099026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 116.17647058823529, 102, 307, 103.0, 153.39999999999986, 307.0, 307.0, 0.07630778070041565, 0.05670920030567999, 0.03830292898438832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 180.11764705882354, 100, 800, 103.0, 412.79999999999967, 800.0, 800.0, 0.07630846575096507, 1.3391942864036268, 0.044549801093006554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 186.47058823529412, 101, 910, 103.0, 427.59999999999957, 910.0, 910.0, 0.07623865389444982, 4.054614940141445, 0.044434592280163596], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 334.8666666666667, 102, 1587, 221.0, 886.8000000000004, 1587.0, 1587.0, 0.08900545306742459, 0.1945371790611705, 0.05753484007203508], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e76f2de-c5b2-4df1-b14a-c3d0c34f3fe7", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 104.05555555555556, 101, 108, 104.0, 107.1, 108.0, 108.0, 0.08384689556869156, 0.062311999538842075, 0.042087211252253384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 103.66666666666667, 101, 115, 103.0, 106.00000000000001, 115.0, 115.0, 0.0838476767206242, 0.029432208571095842, 0.047428161756143006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 674.8, 549, 815, 609.0, 815.0, 815.0, 815.0, 0.11563367252543941, 34.00013912176225, 0.06594732886216466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1025.8, 708, 1194, 1106.0, 1194.0, 1194.0, 1194.0, 0.11521268261210194, 103.66857433666297, 0.065594720666851], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 196.2, 101, 333, 132.0, 333.0, 333.0, 333.0, 0.11682515946634267, 0.2067257704619267, 0.0646873685716956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 146.13333333333338, 102, 314, 105.0, 308.6, 314.0, 314.0, 0.08444899843487856, 0.0627594607509205, 0.0423894386675074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 131.00000000000003, 101, 303, 104.0, 302.4, 303.0, 303.0, 0.0844499493300304, 0.02259695909807454, 0.048162861727282964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae908244-918f-4a00-8304-a400bf053dd8", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 157.53333333333336, 101, 304, 103.0, 304.0, 304.0, 304.0, 0.08445042478563668, 0.022762028555503633, 0.04964761300874344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 144.66666666666666, 101, 305, 105.0, 303.8, 305.0, 305.0, 0.08445042478563668, 0.022762028555503633, 0.04973008412669816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 147.8, 102, 318, 105.0, 318.0, 318.0, 318.0, 0.11682242990654206, 0.0868182316004673, 0.0655985324182243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 170.72222222222223, 100, 1111, 103.0, 387.4000000000011, 1111.0, 1111.0, 0.08384806730204869, 4.212824045121906, 0.048893176397700695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 644.4761904761906, 101, 1512, 305.0, 1394.0, 1502.1999999999998, 1512.0, 0.10138070869943033, 43.45361794860964, 0.05545200407936662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 153.94444444444443, 101, 807, 103.5, 353.4000000000007, 807.0, 807.0, 0.0838476767206242, 1.391010757540468, 0.04897483114009549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 454.7619047619049, 101, 918, 307.0, 908.4, 917.1, 918.0, 0.10137875101378752, 14.20894100239447, 0.05554993597449118], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 439.66666666666663, 113, 651, 446.0, 610.2, 651.0, 651.0, 0.08788221439745024, 0.01654657317951993, 0.06017299796992085], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 318.79999999999995, 206, 621, 211.0, 613.2, 621.0, 621.0, 0.08439958137807636, 0.13080286684278047, 0.18981663663448228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3eb925a-c82b-47d9-b41b-0602d3931cee", 3, 0, 0.0, 522.3333333333334, 388, 649, 530.0, 649.0, 649.0, 649.0, 0.07507507507507508, 0.03323636136136136, 0.04814384697197197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 656.75, 135, 2101, 648.0, 1046.9, 2048.749999999999, 2101.0, 0.08572102093735937, 0.052654806806249066, 0.03875862567773182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 104.19047619047616, 102, 121, 103.0, 108.2, 119.79999999999998, 121.0, 0.10137875101378752, 0.07534104445458231, 0.05088738087996756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 162.33333333333331, 101, 315, 104.0, 309.4, 314.5, 315.0, 0.10137875101378752, 0.09963441796528019, 0.05376317320318232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e2ec11a-00f4-41a1-8cde-33c9431c24b5", 3, 0, 0.0, 285.0, 202, 427, 226.0, 427.0, 427.0, 427.0, 0.025381569596263833, 0.030148876125249587, 0.016276592481979085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff40493c-02dd-450f-9a0b-6c773c0f7a53", 3, 0, 0.0, 383.3333333333333, 203, 504, 443.0, 504.0, 504.0, 504.0, 0.017043808268519516, 0.0234962656305925, 0.0109297859013618], "isController": false}, {"data": ["login", 20, 0, 0.0, 3024.0499999999993, 1654, 5806, 2800.0, 4572.6, 5744.499999999999, 5806.0, 0.08645134518293104, 25.975020052659676, 0.16627531673611592], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 130.66666666666666, 104, 309, 107.0, 305.4, 309.0, 309.0, 0.08544939259723429, 0.06917729146787814, 0.030374588774798126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0864df61-9a60-4939-9150-cf4ace3101aa", 3, 0, 0.0, 769.0, 218, 1755, 334.0, 1755.0, 1755.0, 1755.0, 0.027173913043478264, 0.027253524116847824, 0.01742597939311594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c140a6d-d834-433e-9ed7-e3c3e8a42431", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76a6de2a-586c-4ba8-bf73-020cbad0cf6f", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.879713326446281, 1.6437456955922864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 769.6190476190477, 207, 1617, 410.0, 1502.8000000000002, 1607.6999999999998, 1617.0, 0.1013273887931908, 57.807393107144065, 0.2155421663675096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 352.0588235294118, 206, 1014, 219.0, 691.5999999999997, 1014.0, 1014.0, 0.0762024295127527, 5.473775298085974, 0.17023416138105696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 867.5714285714286, 102, 1424, 1116.0, 1424.0, 1424.0, 1424.0, 0.10270405094120927, 87.77195940989188, 0.18486156044133398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd4cc74e-b40e-437a-945b-1e4988ed563a", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["register", 25, 9, 36.0, 1193.8799999999999, 198, 2410, 1088.0, 2088.8, 2332.8999999999996, 2410.0, 0.09846434999743993, 0.030677799046077377, 0.04442434540900122], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 287.44444444444446, 206, 1214, 209.0, 493.10000000000116, 1214.0, 1214.0, 0.08380551533408137, 5.6926960510724784, 0.18728932224617406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 122.35714285714286, 103, 309, 106.5, 218.5, 309.0, 309.0, 0.09565585755476298, 0.07426406909769195, 0.03400266811516965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e848cca-4beb-4dab-a437-6e55a840aa07", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae908244-918f-4a00-8304-a400bf053dd8", 3, 0, 0.0, 702.3333333333334, 278, 977, 852.0, 977.0, 977.0, 977.0, 0.04998000799680128, 0.0321323293599227, 0.03205098169065707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 359.21428571428567, 206, 1109, 311.0, 762.0, 1109.0, 1109.0, 0.08623769572877012, 7.49340969796787, 0.1923745472520974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e76f2de-c5b2-4df1-b14a-c3d0c34f3fe7", 3, 0, 0.0, 783.3333333333333, 420, 1385, 545.0, 1385.0, 1385.0, 1385.0, 0.025870989996550537, 0.025946783912556056, 0.01659044605898586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 126.0, 101, 306, 104.0, 306.0, 306.0, 306.0, 0.049711946885546525, 0.036944132402246976, 0.024953067089034095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 124.44444444444443, 100, 304, 102.0, 304.0, 304.0, 304.0, 0.04971222147347025, 0.013301903011455906, 0.0283515013090885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 146.77777777777777, 101, 303, 103.0, 303.0, 303.0, 303.0, 0.04965763817237821, 0.013384285288648814, 0.029193259941183283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 147.44444444444446, 101, 307, 103.0, 307.0, 307.0, 307.0, 0.049712496064427396, 0.013399071204865196, 0.029274057741064178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 2.609928097345133, 5.470478429203539], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1141.946428571429, 803, 1736, 1069.0, 1566.3000000000004, 1715.95, 1736.0, 0.24994086220671002, 299.0161647021017, 0.4935355697089528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1193.8799999999999, 198, 2410, 1088.0, 2088.8, 2332.8999999999996, 2410.0, 0.0999552200614125, 0.031142298250383827, 0.04509698405114509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 203.625, 102, 305, 204.0, 305.0, 305.0, 305.0, 0.04329238595162076, 0.011668650901022783, 0.025493465555495427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 152.75, 100, 305, 103.0, 305.0, 305.0, 305.0, 0.043292620231723755, 0.011668714046831792, 0.02545132556591572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14823e76-d50f-443f-9e70-f54e558c2b99", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 242.8571428571429, 100, 1256, 104.0, 782.0, 1256.0, 1256.0, 0.09624374415662983, 6.209822801947561, 0.055990012992905465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 189.71428571428572, 101, 906, 103.5, 607.0, 906.0, 906.0, 0.09637757982128842, 2.0482790363274637, 0.05616199091985516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 127.375, 101, 301, 103.0, 301.0, 301.0, 301.0, 0.043292854514362406, 0.011584220836850878, 0.02469045609022231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 117.64285714285715, 101, 307, 103.0, 207.0, 307.0, 307.0, 0.09637757982128842, 0.07162435375390673, 0.048377027371232666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 128.75, 102, 302, 104.0, 302.0, 302.0, 302.0, 0.04329238595162076, 0.032173345419124415, 0.02173074841712214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 131.71428571428572, 101, 306, 103.0, 304.0, 306.0, 306.0, 0.09637824329999105, 0.03612839561203627, 0.054387554987229886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 108.625, 105, 115, 109.0, 115.0, 115.0, 115.0, 0.04347826086956522, 0.03422214673913043, 0.01545516304347826], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 659.4666666666668, 102, 1755, 516.0, 1533.0000000000002, 1755.0, 1755.0, 0.08821298142234611, 0.016448045494374952, 0.060037663267526444], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1653.95, 1089, 4377, 1386.5, 2358.9000000000005, 4277.299999999998, 4377.0, 0.08499932000543996, 0.0439937886746906, 0.03909636691656467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d662d235-292f-4580-8561-5baf6ee6785b", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 333.37499999999994, 206, 606, 310.5, 606.0, 606.0, 606.0, 0.04326803465769576, 0.06705700293140934, 0.09731082403972005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72638317-45d4-40fb-8828-21e61e87d969", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1b7bf28-f9ae-48c1-b590-239ca4670b31", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 0.2775177611367127, 1.0590677803379416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4522e44c-1893-4744-8ed3-ba4eb5d10fd7", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["addBook", 60, 9, 15.0, 1072.1333333333337, 526, 2534, 849.0, 1851.7, 2248.8999999999996, 2534.0, 0.2806334833163394, 79.42052730154536, 1.0221426030275675], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 185.8035714285714, 102, 426, 105.0, 412.3, 417.9, 426.0, 0.25095452345528524, 0.18650038315378134, 0.121311024521842], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 632.9464285714286, 501, 1000, 604.5, 809.3, 827.8999999999999, 1000.0, 0.25078145292026044, 73.73807388648557, 0.12612543774798254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3eb925a-c82b-47d9-b41b-0602d3931cee", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 175.94642857142856, 101, 501, 107.0, 310.6, 427.15, 501.0, 0.2513408585983259, 0.44475550369156885, 0.12223412849801396], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 954.7321428571429, 700, 1326, 912.5, 1146.5000000000002, 1278.45, 1326.0, 0.2504461071283223, 225.3518474313621, 0.12571220611714617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 134.49999999999997, 102, 311, 105.0, 309.0, 311.0, 311.0, 0.08785030308354565, 0.06563035337784416, 0.031228037424229114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 9, 5.113636363636363, 183.1136363636364, 102, 1687, 111.0, 309.6, 392.0, 1252.7199999999943, 0.7261385109209582, 1.5397243664854072, 0.3497450585964898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 106.11111111111111, 103, 112, 106.0, 112.0, 112.0, 112.0, 0.05032037304169881, 0.03896880451373746, 0.017887320104666374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 123.11764705882354, 103, 308, 108.0, 166.39999999999986, 308.0, 308.0, 0.07716679830414612, 0.06262266542064984, 0.027430385334676944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0864df61-9a60-4939-9150-cf4ace3101aa", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 319.00000000000006, 204, 611, 211.0, 611.0, 611.0, 611.0, 0.04962915988861011, 0.07691550463205492, 0.11161714377291902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e2ec11a-00f4-41a1-8cde-33c9431c24b5", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 390.6428571428571, 205, 1564, 308.5, 988.0, 1564.0, 1564.0, 0.09617498351285997, 8.356885559927319, 0.21454212979500986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff40493c-02dd-450f-9a0b-6c773c0f7a53", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c140a6d-d834-433e-9ed7-e3c3e8a42431", 3, 0, 0.0, 838.0, 190, 1628, 696.0, 1628.0, 1628.0, 1628.0, 0.06543217954590066, 0.02960635728151105, 0.04196008909681782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 106.86666666666666, 102, 116, 105.0, 113.0, 116.0, 116.0, 0.08770750133023045, 0.07271842639586489, 0.03117727586348035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 107.47619047619048, 102, 126, 106.0, 116.4, 125.19999999999999, 126.0, 0.10081661457808247, 0.07827071151325739, 0.03583715596330275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd4cc74e-b40e-437a-945b-1e4988ed563a", 3, 0, 0.0, 383.3333333333333, 197, 513, 440.0, 513.0, 513.0, 513.0, 0.018834638155209974, 0.022261904668478976, 0.01207820220239702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 103.35714285714286, 102, 105, 103.0, 105.0, 105.0, 105.0, 0.0862924450964318, 0.06412944406092247, 0.04331476248004487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 146.64285714285717, 100, 310, 103.0, 309.0, 310.0, 310.0, 0.08629404078009813, 0.03234822650336547, 0.0486969021980325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 225.35714285714286, 101, 1005, 104.0, 658.5, 1005.0, 1005.0, 0.08629404078009813, 5.567849700821643, 0.050201750844448834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 225.6428571428571, 100, 808, 106.5, 558.5, 808.0, 808.0, 0.08629404078009813, 1.8339771035713406, 0.050286022368648146], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 40.90909090909091, 0.683371298405467], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07593014426727411], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07593014426727411], "isController": false}, {"data": ["401/Unauthorized", 11, 50.0, 0.8352315869400152], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1317, 22, "401/Unauthorized", 11, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
