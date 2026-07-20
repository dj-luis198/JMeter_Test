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

    var data = {"OkPercent": 97.75019394879752, "KoPercent": 2.2498060512024827};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7951687624090007, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3888888888888889, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c9386a7-af98-48b6-b97b-11cf8270c34a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed993a47-0e4c-46e1-b3fb-d255e73d6ba8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f723b055-7d58-4832-b5fa-28e2bc36a4e5"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1baedb45-efb4-46de-92b5-ed33adf856ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de9a6e2d-efa8-4d55-9255-f25d28c3faf9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f19a3319-91a2-4ea4-b7cd-42f7db4dc8e5"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=671b37b1-cc58-4e54-8c4c-ec93c69673c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ce49591-5773-44d8-9f12-d9ad52e814f7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22581243-abff-4b46-ba6f-70530d03b26e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=648f4571-7c64-4c80-9499-e4732ab3a2de"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7160057e-8e1c-440b-8b42-962ccd2d49e9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c47445ca-753c-4dc6-b723-f7d8e186a3f6"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/32c20f3b-c88d-427d-b1c8-d763c63560bb"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0116c5eb-b0e7-4008-a877-fb99eddbc1a6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/acc5d0d7-375a-4258-8932-9cc04ef04619"], "isController": false}, {"data": [0.26, 500, 1500, "register"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ed993a47-0e4c-46e1-b3fb-d255e73d6ba8"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5c9386a7-af98-48b6-b97b-11cf8270c34a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32c20f3b-c88d-427d-b1c8-d763c63560bb"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.26, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de9a6e2d-efa8-4d55-9255-f25d28c3faf9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1baedb45-efb4-46de-92b5-ed33adf856ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f19a3319-91a2-4ea4-b7cd-42f7db4dc8e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f723b055-7d58-4832-b5fa-28e2bc36a4e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/671b37b1-cc58-4e54-8c4c-ec93c69673c1"], "isController": false}, {"data": [0.35964912280701755, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81111828-1b35-430b-93cf-79eed0def40a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8425925925925926, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9226190476190477, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/648f4571-7c64-4c80-9499-e4732ab3a2de"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acc5d0d7-375a-4258-8932-9cc04ef04619"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7160057e-8e1c-440b-8b42-962ccd2d49e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c47445ca-753c-4dc6-b723-f7d8e186a3f6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/22581243-abff-4b46-ba6f-70530d03b26e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1289, 29, 2.2498060512024827, 319.1931730023272, 77, 2363, 102.0, 869.0, 1100.0, 1634.3999999999987, 4.99053385935909, 707.2216821261746, 3.6411150336928793], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1341.1851851851854, 969, 1883, 1325.5, 1616.0, 1704.5, 1883.0, 0.25033145739265883, 301.2323364573579, 1.2308778202851924], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c9386a7-af98-48b6-b97b-11cf8270c34a", 1, 0, 0.0, 673.0, 673, 673, 673.0, 673.0, 673.0, 673.0, 1.4858841010401187, 0.2684458580980683, 1.0244474368499257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed993a47-0e4c-46e1-b3fb-d255e73d6ba8", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f723b055-7d58-4832-b5fa-28e2bc36a4e5", 1, 0, 0.0, 800.0, 800, 800, 800.0, 800.0, 800.0, 800.0, 1.25, 0.225830078125, 0.86181640625], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 647.375, 80, 2152, 493.5, 1613.0000000000005, 2152.0, 2152.0, 0.0840071406069516, 0.016976784823585004, 0.05634487720518744], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 647.375, 80, 2152, 493.5, 1613.0000000000005, 2152.0, 2152.0, 0.08372667427183958, 0.016920106110477347, 0.056156764134109194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 115.92857142857143, 78, 245, 81.0, 244.0, 245.0, 245.0, 0.08626320135063527, 0.05084570671127706, 0.04764453322365583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 82.14285714285714, 80, 85, 82.0, 84.5, 85.0, 85.0, 0.0862621383151772, 0.064106921150244, 0.043299549896485434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 240.57142857142858, 79, 724, 157.5, 683.0, 724.0, 724.0, 0.08626320135063527, 5.453463794872269, 0.04920901650707974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 282.85714285714283, 80, 961, 82.0, 948.0, 961.0, 961.0, 0.08626266982963122, 16.6509757983148, 0.04912447241134971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1baedb45-efb4-46de-92b5-ed33adf856ee", 1, 0, 0.0, 732.0, 732, 732, 732.0, 732.0, 732.0, 732.0, 1.366120218579235, 0.24680882855191258, 0.9418758538251366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de9a6e2d-efa8-4d55-9255-f25d28c3faf9", 3, 0, 0.0, 294.0, 212, 388, 282.0, 388.0, 388.0, 388.0, 0.04197154329364691, 0.034989948689788324, 0.026915345145991018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f19a3319-91a2-4ea4-b7cd-42f7db4dc8e5", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 270.74999999999994, 78, 996, 215.5, 615.9000000000003, 996.0, 996.0, 0.0839674626082393, 0.14135172034898977, 0.05426827768302282], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 106.2666666666667, 78, 276, 82.0, 258.6, 276.0, 276.0, 0.08184824244540723, 0.06082667236421377, 0.0410839810712298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 103.8, 77, 251, 81.0, 249.8, 251.0, 251.0, 0.08177863069860758, 0.030070683996467163, 0.04618150017446108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 553.8571428571429, 391, 640, 628.0, 640.0, 640.0, 640.0, 0.05258650480039666, 15.462178447608816, 0.029990741018976214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 752.5714285714286, 554, 1026, 730.0, 1026.0, 1026.0, 1026.0, 0.0523720811916893, 47.124490716581, 0.029817307944096545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 171.2857142857143, 78, 250, 234.0, 250.0, 250.0, 250.0, 0.052684263210579, 0.09322645013434488, 0.02917185277382646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 111.16666666666666, 79, 276, 82.0, 263.70000000000005, 276.0, 276.0, 0.06994474365251452, 0.05198041984332378, 0.035108982653703574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 141.41666666666666, 78, 334, 82.5, 307.0000000000001, 334.0, 334.0, 0.06994555903988063, 0.018715901539968056, 0.03989082663993192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 94.74999999999999, 77, 240, 81.5, 195.30000000000015, 240.0, 240.0, 0.06994474365251452, 0.018852294187591802, 0.041119859061341545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 133.58333333333334, 80, 239, 82.0, 238.7, 239.0, 239.0, 0.06994474365251452, 0.018852294187591802, 0.0411881644750647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=671b37b1-cc58-4e54-8c4c-ec93c69673c1", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 110.0, 79, 245, 82.0, 245.0, 245.0, 245.0, 0.052745795406594735, 0.03919877959415878, 0.029618000350382787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 604.7499999999999, 79, 1032, 829.5, 1022.9, 1032.0, 1032.0, 0.10578232641781374, 59.50014390115303, 0.056506770068890745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 135.53333333333333, 78, 731, 81.0, 438.8000000000002, 731.0, 731.0, 0.08185449544889005, 4.930779447495798, 0.04765253244166503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 423.62500000000006, 80, 649, 549.0, 644.1, 649.0, 649.0, 0.10577882968947303, 19.449746585327155, 0.05660820182600705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 153.13333333333335, 78, 645, 83.0, 404.40000000000015, 645.0, 645.0, 0.08178487306987699, 1.6237385535254734, 0.04769186901607346], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 443.3124999999999, 84, 861, 438.5, 818.3000000000001, 861.0, 861.0, 0.08387986306612355, 0.016951063635982366, 0.05671003681539615], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 268.25, 163, 514, 167.5, 502.6, 514.0, 514.0, 0.06991051454138703, 0.10834764314177853, 0.157230385731264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 644.9565217391306, 89, 1647, 670.0, 1215.0, 1563.7999999999988, 1647.0, 0.10237191270791514, 0.0628827471614049, 0.04628730037477022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 93.06249999999999, 78, 240, 83.0, 140.6000000000001, 240.0, 240.0, 0.10588523364238585, 0.07869010039243715, 0.053149423918150716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 131.125, 78, 245, 83.0, 244.3, 245.0, 245.0, 0.10589154058955116, 0.1277368413215264, 0.05483299745860302], "isController": false}, {"data": ["login", 23, 0, 0.0, 2795.0, 1956, 3781, 2820.0, 3609.4, 3755.7999999999997, 3781.0, 0.10228768634148076, 37.382036482515474, 0.2059521218579891], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 100.39999999999999, 83, 241, 88.0, 165.40000000000003, 241.0, 241.0, 0.07933863315402802, 0.06423020203582933, 0.0282024047539709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ce49591-5773-44d8-9f12-d9ad52e814f7", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.6557206108829569, 1.2252149640657084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22581243-abff-4b46-ba6f-70530d03b26e", 1, 0, 0.0, 861.0, 861, 861, 861.0, 861.0, 861.0, 861.0, 1.1614401858304297, 0.20983050232288036, 0.8007585656213705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=648f4571-7c64-4c80-9499-e4732ab3a2de", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7160057e-8e1c-440b-8b42-962ccd2d49e9", 3, 0, 0.0, 548.0, 215, 1023, 406.0, 1023.0, 1023.0, 1023.0, 0.11343441600181495, 0.05132611921957122, 0.07274277328241388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c47445ca-753c-4dc6-b723-f7d8e186a3f6", 3, 0, 0.0, 587.0, 316, 996, 449.0, 996.0, 996.0, 996.0, 0.032901591340301156, 0.02674325311742578, 0.021099002259242605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 709.0, 164, 1118, 913.0, 1106.8, 1118.0, 1118.0, 0.10571802360154876, 79.1086344576335, 0.22085672069298165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32c20f3b-c88d-427d-b1c8-d763c63560bb", 3, 0, 0.0, 329.3333333333333, 196, 577, 215.0, 577.0, 577.0, 577.0, 0.023810468669391644, 0.028143167883646174, 0.015269083098535656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 411.1428571428572, 163, 1043, 323.0, 1030.0, 1043.0, 1043.0, 0.0862185764081341, 22.208001208984594, 0.18918049243124072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 537.8333333333333, 78, 1141, 671.0, 1131.4, 1141.0, 1141.0, 0.08387209505504106, 58.54112517473354, 0.1333571771798008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0116c5eb-b0e7-4008-a877-fb99eddbc1a6", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 1.040182206840391, 1.9435820439739413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acc5d0d7-375a-4258-8932-9cc04ef04619", 3, 0, 0.0, 453.0, 190, 716, 453.0, 716.0, 716.0, 716.0, 0.02647346917164515, 0.026551028163358956, 0.01697680151957713], "isController": false}, {"data": ["register", 25, 7, 28.0, 1162.7199999999996, 210, 2363, 1109.0, 1807.000000000001, 2274.5, 2363.0, 0.0995837399669382, 0.031306638252106195, 0.044929382680395945], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 268.26666666666665, 159, 979, 170.0, 707.2000000000002, 979.0, 979.0, 0.08173674230039887, 6.637268259307091, 0.18243364168519366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 88.93749999999999, 80, 116, 87.0, 101.30000000000001, 116.0, 116.0, 0.14190058090550306, 0.11016695490222164, 0.05044122211875305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed993a47-0e4c-46e1-b3fb-d255e73d6ba8", 3, 0, 0.0, 573.0, 219, 1259, 241.0, 1259.0, 1259.0, 1259.0, 0.023942537909018357, 0.028439557561851556, 0.015353775937749402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 280.05882352941177, 160, 1294, 169.0, 522.7999999999993, 1294.0, 1294.0, 0.10598239445400365, 7.612930670369816, 0.23676179560671803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 105.57142857142858, 79, 250, 83.0, 244.0, 250.0, 250.0, 0.07251781866401459, 0.0538926367219874, 0.03640054569658544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c9386a7-af98-48b6-b97b-11cf8270c34a", 3, 0, 0.0, 647.6666666666667, 186, 1555, 202.0, 1555.0, 1555.0, 1555.0, 0.01732321657485362, 0.02388145253727379, 0.01110896375405652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 81.21428571428571, 78, 83, 81.5, 83.0, 83.0, 83.0, 0.07251894557453135, 0.019404483483810145, 0.04135846114797491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 103.85714285714288, 79, 242, 82.0, 238.0, 242.0, 242.0, 0.0724581424837616, 0.01952973371632637, 0.042597462671117664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 103.64285714285714, 78, 242, 82.0, 238.5, 242.0, 242.0, 0.07246076767007578, 0.01953044128607511, 0.042669768461968446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32c20f3b-c88d-427d-b1c8-d763c63560bb", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 87.33333333333333, 84, 93, 85.0, 93.0, 93.0, 93.0, 0.0548185505975222, 0.01616718972700362, 0.033886857937726125], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 902.0000000000001, 617, 1549, 855.5, 1276.5, 1355.5, 1549.0, 0.2450602212803035, 293.17722136879746, 0.4838982103796618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 1162.7199999999996, 210, 2363, 1109.0, 1807.000000000001, 2274.5, 2363.0, 0.09708775568060458, 0.030521963192090065, 0.04380326476996027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de9a6e2d-efa8-4d55-9255-f25d28c3faf9", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 125.28571428571429, 79, 238, 81.0, 238.0, 238.0, 238.0, 0.03259755983980627, 0.008786061050572785, 0.01919563338222967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 115.57142857142857, 79, 319, 83.0, 319.0, 319.0, 319.0, 0.03259725624237457, 0.008785979221577521, 0.019163621345614737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1baedb45-efb4-46de-92b5-ed33adf856ee", 3, 0, 0.0, 305.3333333333333, 225, 462, 229.0, 462.0, 462.0, 462.0, 0.05136458583022292, 0.03302247949696949, 0.032938878283053113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 132.5, 78, 259, 82.5, 250.60000000000002, 259.0, 259.0, 0.139739211696172, 0.037664084402483866, 0.08215137250106988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 141.4375, 79, 260, 82.0, 249.5, 260.0, 260.0, 0.13994454697326186, 0.03771942867638698, 0.08240875178210634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 103.57142857142857, 80, 239, 81.0, 239.0, 239.0, 239.0, 0.03259740804038353, 0.008722353323305749, 0.018590709273031233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f19a3319-91a2-4ea4-b7cd-42f7db4dc8e5", 3, 0, 0.0, 767.6666666666666, 174, 1360, 769.0, 1360.0, 1360.0, 1360.0, 0.03898888816687244, 0.025066098349470402, 0.0250026398726363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 122.5625, 81, 246, 83.5, 243.2, 246.0, 246.0, 0.13975263783103906, 0.10385913807560618, 0.07014927328628327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 104.85714285714285, 80, 236, 85.0, 236.0, 236.0, 236.0, 0.03259619369589614, 0.024224319729079066, 0.01636176128876037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 110.9375, 79, 246, 82.0, 239.0, 246.0, 246.0, 0.13994332295420353, 0.03744577196235525, 0.07981142637231922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 113.28571428571429, 84, 248, 90.0, 248.0, 248.0, 248.0, 0.03259148896545302, 0.025653066509917125, 0.01158525584318838], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 682.2666666666665, 79, 1555, 496.0, 1474.6000000000001, 1555.0, 1555.0, 0.07979699644105395, 0.015341180370470855, 0.05430455753895423], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1620.0434782608695, 1126, 2323, 1542.0, 2172.8, 2293.9999999999995, 2323.0, 0.1026703211349088, 0.05313991230615397, 0.04722433716263871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 243.57142857142858, 161, 556, 168.0, 556.0, 556.0, 556.0, 0.03258390355164549, 0.050498686461388075, 0.07328196277289019], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f723b055-7d58-4832-b5fa-28e2bc36a4e5", 3, 0, 0.0, 403.6666666666667, 297, 496, 418.0, 496.0, 496.0, 496.0, 0.04773877343178129, 0.030691431486903665, 0.03061373166035454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/671b37b1-cc58-4e54-8c4c-ec93c69673c1", 3, 0, 0.0, 299.3333333333333, 206, 478, 214.0, 478.0, 478.0, 478.0, 0.028662329100862735, 0.02874630076815042, 0.018380464950748566], "isController": false}, {"data": ["addBook", 57, 11, 19.29824561403509, 887.438596491228, 428, 1995, 742.0, 1471.8000000000004, 1698.3999999999996, 1995.0, 0.2629624332790493, 83.8094766888993, 0.955149046645845], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/81111828-1b35-430b-93cf-79eed0def40a", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 147.87037037037032, 80, 414, 83.5, 332.5, 366.75, 414.0, 0.24614374794880212, 0.18292518768460783, 0.11898550315884478], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 512.0370370370372, 385, 830, 478.0, 650.5, 732.25, 830.0, 0.24585237930469303, 72.28876258286135, 0.12364646029484073], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 127.16666666666663, 78, 324, 85.5, 244.5, 248.5, 324.0, 0.24645942775772126, 0.43611765927440516, 0.11986015138998553], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 750.6296296296298, 534, 1155, 751.0, 944.5, 985.0, 1155.0, 0.2454623556204061, 220.8674590640384, 0.12321059647352416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 86.3529411764706, 81, 92, 86.0, 91.2, 92.0, 92.0, 0.10518304944222047, 0.07857913361650261, 0.037389287106414315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 11, 6.5476190476190474, 149.9761904761905, 80, 704, 91.0, 270.69999999999993, 354.3499999999997, 694.34, 0.7004173319936462, 1.5114800172602842, 0.3363128538566729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 111.14285714285714, 83, 255, 87.0, 254.0, 255.0, 255.0, 0.07594579640016924, 0.05881349272005294, 0.02699635731412266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 87.57142857142858, 81, 91, 87.5, 91.0, 91.0, 91.0, 0.0893369918958586, 0.0724990627592368, 0.03175650883798098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/648f4571-7c64-4c80-9499-e4732ab3a2de", 3, 0, 0.0, 334.6666666666667, 223, 481, 300.0, 481.0, 481.0, 481.0, 0.07797878976918278, 0.03528337167290497, 0.050005929637138694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acc5d0d7-375a-4258-8932-9cc04ef04619", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7160057e-8e1c-440b-8b42-962ccd2d49e9", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 0.6406527039007093, 2.444869237588653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c47445ca-753c-4dc6-b723-f7d8e186a3f6", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22581243-abff-4b46-ba6f-70530d03b26e", 3, 0, 0.0, 883.6666666666667, 271, 1421, 959.0, 1421.0, 1421.0, 1421.0, 0.061664953751284696, 0.03964462358684481, 0.03954425745118191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 211.71428571428575, 162, 493, 166.5, 487.0, 493.0, 493.0, 0.07242665507840186, 0.11224716954045287, 0.16288924477105415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 295.8125, 163, 507, 316.5, 493.7, 507.0, 507.0, 0.13945178018913146, 0.2161230226173356, 0.31363032204645486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 88.66666666666666, 84, 97, 88.0, 96.4, 97.0, 97.0, 0.06916227198063456, 0.05734254776519409, 0.024585026368116193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 97.62499999999999, 83, 249, 86.0, 146.1000000000001, 249.0, 249.0, 0.1036571539632665, 0.08047601308671569, 0.03684687894787989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 91.05882352941175, 78, 248, 81.0, 116.79999999999988, 248.0, 248.0, 0.10614120526460377, 0.07888032930308934, 0.05327790967383433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 101.99999999999999, 78, 245, 82.0, 238.6, 245.0, 245.0, 0.10614319341162955, 0.03777936732413009, 0.06001041530085351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 168.0588235294118, 78, 1046, 83.0, 401.99999999999943, 1046.0, 1046.0, 0.1060379241516966, 5.639435240846432, 0.06180266420284431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 152.6470588235294, 79, 637, 84.0, 320.9999999999997, 637.0, 637.0, 0.10604123132582728, 1.8609968070673362, 0.061908147631226026], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 24.137931034482758, 0.5430566330488751], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.23273855702094648], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.1551590380139643], "isController": false}, {"data": ["401/Unauthorized", 17, 58.62068965517241, 1.3188518231186968], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1289, 29, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
