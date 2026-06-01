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

    var data = {"OkPercent": 97.66390354182366, "KoPercent": 2.3360964581763377};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.741267787839586, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7303c0ac-a39c-49cb-858b-61e1cf2dc13f"], "isController": false}, {"data": [0.017543859649122806, 500, 1500, "see books"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=964ee4c3-f263-4594-a1e2-eaab10a14471"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f312cf2-9344-4f04-8a72-6aad4199016f"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c579ca6d-8872-4842-8900-1380bcfe09f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c69c20c-3805-4164-ab4b-eacc5ce59fc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a214cbb-b046-46e6-8614-a0774c565625"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85d2041e-3b1a-4340-afc9-eb08a947e2ac"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d26c5653-218f-40b1-8fba-fca4ca1f665a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a1d2a34f-1738-4b61-b9b0-0f36a26dfc09"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/59482868-09a3-426b-b047-4136bedb4933"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0459eb19-5275-4098-a06a-5bd9f9475e18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48bff63b-e353-4d46-bfea-409f491cb7b3"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/274a2c80-eb06-4948-9cef-a803f96528b9"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/964ee4c3-f263-4594-a1e2-eaab10a14471"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2982456140350877, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f312cf2-9344-4f04-8a72-6aad4199016f"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94486ac1-dffd-41f3-b7d9-d61cf9b9ec2d"], "isController": false}, {"data": [0.2542372881355932, 500, 1500, "addBook"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c69c20c-3805-4164-ab4b-eacc5ce59fc4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.45614035087719296, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/85d2041e-3b1a-4340-afc9-eb08a947e2ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a214cbb-b046-46e6-8614-a0774c565625"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94486ac1-dffd-41f3-b7d9-d61cf9b9ec2d"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e36e7780-d006-4744-8c1d-e73acf7f1219"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59482868-09a3-426b-b047-4136bedb4933"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c579ca6d-8872-4842-8900-1380bcfe09f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6224a8f9-cfeb-46e7-9338-89d9eb6ec781"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0459eb19-5275-4098-a06a-5bd9f9475e18"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/48bff63b-e353-4d46-bfea-409f491cb7b3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d26c5653-218f-40b1-8fba-fca4ca1f665a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1327, 31, 2.3360964581763377, 427.97513187641334, 120, 2454, 137.0, 1208.6000000000001, 1466.1999999999998, 1885.72, 5.22547923196875, 738.3033194480267, 3.8196565463205063], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/7303c0ac-a39c-49cb-858b-61e1cf2dc13f", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 0.46961167279411764, 0.8774701286764706], "isController": false}, {"data": ["see books", 57, 0, 0.0, 2116.6842105263163, 1481, 3009, 2108.0, 2498.2, 2632.399999999998, 3009.0, 0.24507485531984416, 294.9081407646013, 1.2050311489603667], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 515.3333333333334, 132, 1321, 505.0, 978.4000000000002, 1321.0, 1321.0, 0.08474480514344471, 0.017246891984271363, 0.0567889504779607], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 515.3333333333334, 132, 1321, 505.0, 978.4000000000002, 1321.0, 1321.0, 0.08470795520643329, 0.017239392446309273, 0.05676425670181105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 153.61111111111111, 120, 387, 126.0, 380.7, 387.0, 387.0, 0.08699728858450578, 0.023278571359525962, 0.04961564114585096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 129.16666666666666, 123, 141, 128.5, 138.3, 141.0, 141.0, 0.08698845953103555, 0.06464669697570122, 0.04366412910053933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 146.38888888888886, 122, 500, 127.0, 167.0000000000005, 500.0, 500.0, 0.08699434536755112, 0.02344769464984776, 0.051228115484993474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=964ee4c3-f263-4594-a1e2-eaab10a14471", 1, 0, 0.0, 1544.0, 1544, 1544, 1544.0, 1544.0, 1544.0, 1544.0, 0.6476683937823834, 0.11701040317357513, 0.4465369980569948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 168.38888888888889, 122, 383, 127.0, 382.1, 383.0, 383.0, 0.08699476581492346, 0.023447807973553593, 0.051143407246664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f312cf2-9344-4f04-8a72-6aad4199016f", 3, 0, 0.0, 356.6666666666667, 221, 520, 329.0, 520.0, 520.0, 520.0, 0.021041409493883962, 0.02110305424826058, 0.013493351791325329], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 276.06666666666666, 121, 1112, 228.0, 613.4000000000003, 1112.0, 1112.0, 0.08493001766544368, 0.15741911477442586, 0.054889341495108025], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c579ca6d-8872-4842-8900-1380bcfe09f1", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c69c20c-3805-4164-ab4b-eacc5ce59fc4", 3, 0, 0.0, 377.0, 229, 489, 413.0, 489.0, 489.0, 489.0, 0.07003618536243726, 0.03168955001750905, 0.044912527722656706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 170.23529411764707, 122, 387, 129.0, 371.8, 387.0, 387.0, 0.22355478407237914, 0.16613788152253958, 0.11221402247383094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 168.9411764705882, 121, 380, 128.0, 370.4, 380.0, 380.0, 0.2242655303879794, 0.07982245095840534, 0.12679350586388402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 901.1666666666666, 720, 1002, 924.0, 1002.0, 1002.0, 1002.0, 0.0680619363620895, 20.012469159435085, 0.03881657308150417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1345.8333333333333, 1119, 1508, 1409.0, 1508.0, 1508.0, 1508.0, 0.06772773450728073, 60.94153456230951, 0.038559833220453775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 291.5, 121, 381, 369.0, 381.0, 381.0, 381.0, 0.06874899741045443, 0.1216534993239682, 0.038067071808327795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 142.2941176470588, 122, 385, 128.0, 181.7999999999998, 385.0, 385.0, 0.10835755443373617, 0.08052744035554026, 0.05439041306537147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 185.11764705882354, 120, 381, 128.0, 379.4, 381.0, 381.0, 0.10835617311492128, 0.02899374163426605, 0.06179687997960355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 184.76470588235293, 120, 381, 127.0, 379.4, 381.0, 381.0, 0.10835824510635042, 0.029205933251321016, 0.06370279643947555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 185.52941176470588, 120, 384, 127.0, 383.2, 384.0, 384.0, 0.10835548246872032, 0.029205188634147276, 0.0638069882115609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a214cbb-b046-46e6-8614-a0774c565625", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 167.16666666666666, 123, 376, 125.5, 376.0, 376.0, 376.0, 0.06854792642522564, 0.05094235547812179, 0.038491267279789784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 858.1666666666664, 124, 1658, 1077.0, 1578.8000000000002, 1658.0, 1658.0, 0.10653472144129641, 53.26838953903018, 0.0575444708479572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 226.99999999999997, 122, 1198, 127.0, 645.9999999999995, 1198.0, 1198.0, 0.22426257189594218, 11.926999337930715, 0.1307081832752889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 618.6666666666665, 123, 1099, 864.0, 1089.1, 1099.0, 1099.0, 0.10669385384127511, 17.441411922741796, 0.057734619043667425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 239.0, 122, 1005, 129.0, 508.99999999999955, 1005.0, 1005.0, 0.22351069564417098, 3.9225562145834156, 0.13048823528445022], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 570.3571428571429, 134, 1544, 479.5, 1340.0, 1544.0, 1544.0, 0.08062611940728284, 0.016540277425838367, 0.05435626702506897], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85d2041e-3b1a-4340-afc9-eb08a947e2ac", 1, 0, 0.0, 636.0, 636, 636, 636.0, 636.0, 636.0, 636.0, 1.5723270440251573, 0.28406299135220126, 1.084045794025157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 375.17647058823525, 247, 766, 262.0, 564.3999999999999, 766.0, 766.0, 0.10826715238283266, 0.16779294026519084, 0.2434953632203746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d26c5653-218f-40b1-8fba-fca4ca1f665a", 1, 0, 0.0, 1136.0, 1136, 1136, 1136.0, 1136.0, 1136.0, 1136.0, 0.8802816901408451, 0.15903526628521128, 0.6069129621478874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1d2a34f-1738-4b61-b9b0-0f36a26dfc09", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 624.3181818181818, 154, 1884, 591.5, 1000.5999999999999, 1753.6499999999983, 1884.0, 0.09181586745127499, 0.056398613893410124, 0.04151440100580109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 142.11111111111111, 122, 380, 129.0, 160.40000000000035, 380.0, 380.0, 0.10669322142399887, 0.07929056787467104, 0.05355499591009318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 182.4444444444444, 121, 384, 127.0, 379.5, 384.0, 384.0, 0.10669701604011808, 0.11757974120045998, 0.055872374067883014], "isController": false}, {"data": ["login", 22, 0, 0.0, 2793.1818181818176, 1534, 4780, 2476.5, 4109.3, 4692.399999999999, 4780.0, 0.08963749780999296, 29.368893763776672, 0.17578148873623353], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 146.58823529411765, 123, 379, 130.0, 190.19999999999982, 379.0, 379.0, 0.20786207739805587, 0.1682789669560433, 0.07388847282509017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59482868-09a3-426b-b047-4136bedb4933", 3, 0, 0.0, 467.6666666666667, 218, 625, 560.0, 625.0, 625.0, 625.0, 0.034524823347987205, 0.02878192467258959, 0.022139942055838146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0459eb19-5275-4098-a06a-5bd9f9475e18", 3, 0, 0.0, 991.0, 240, 2247, 486.0, 2247.0, 2247.0, 2247.0, 0.019272154948125782, 0.022779034705939036, 0.012358771239520767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48bff63b-e353-4d46-bfea-409f491cb7b3", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1001.4999999999998, 251, 1783, 1205.0, 1708.3000000000002, 1783.0, 1783.0, 0.10645344436033308, 70.82628572104467, 0.2242845626241957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 335.1111111111111, 249, 629, 260.0, 536.3000000000002, 629.0, 629.0, 0.08693468307478314, 0.13473177933562583, 0.19551813976682186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 820.0833333333334, 121, 1638, 692.5, 1634.1, 1638.0, 1638.0, 0.10460524595308456, 62.586115451502394, 0.15259188099845708], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1054.9565217391305, 320, 1885, 1012.0, 1579.2000000000003, 1832.3999999999992, 1885.0, 0.09215925118604949, 0.029034546696691883, 0.04157966215620592], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 459.4117647058824, 251, 1562, 262.0, 921.1999999999994, 1562.0, 1562.0, 0.2224286592785461, 15.977502404192126, 0.49689959390414634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 130.75, 122, 137, 130.0, 137.0, 137.0, 137.0, 0.09187798603454612, 0.07133105361080484, 0.032659752848217566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/274a2c80-eb06-4948-9cef-a803f96528b9", 2, 0, 0.0, 484.0, 275, 693, 484.0, 693.0, 693.0, 693.0, 0.023192170323298855, 0.03305563729185027, 0.01441583633865207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 516.8947368421053, 251, 1708, 485.0, 1565.0, 1708.0, 1708.0, 0.10331084056962335, 13.15332955716352, 0.22956607577850155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 163.85714285714286, 121, 382, 129.0, 382.0, 382.0, 382.0, 0.03932098279987867, 0.029221941319050457, 0.019737290194470347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/964ee4c3-f263-4594-a1e2-eaab10a14471", 3, 0, 0.0, 708.3333333333334, 310, 1112, 703.0, 1112.0, 1112.0, 1112.0, 0.03004296143485184, 0.02504558080555194, 0.019265831388886108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 160.14285714285714, 124, 361, 127.0, 361.0, 361.0, 361.0, 0.03926848423650847, 0.010507387383596994, 0.02239530741613374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 162.14285714285717, 120, 381, 127.0, 381.0, 381.0, 381.0, 0.03932186632812412, 0.010598471783752205, 0.023116956571807346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 194.85714285714286, 122, 381, 127.0, 381.0, 381.0, 381.0, 0.03926870452543771, 0.010584143016621882, 0.023124051590663025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 221.66666666666669, 134, 387, 144.0, 387.0, 387.0, 387.0, 0.03891908721767445, 0.011478090175525084, 0.024058381063269463], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1467.2280701754385, 975, 2454, 1387.0, 1942.8000000000002, 2054.1999999999975, 2454.0, 0.242105039607535, 289.6417967007879, 0.4780628809437849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1054.9565217391305, 320, 1885, 1012.0, 1579.2000000000003, 1832.3999999999992, 1885.0, 0.0937157479127873, 0.029524917183801028, 0.042281909702839585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 158.625, 124, 379, 128.0, 379.0, 379.0, 379.0, 0.038859851943964095, 0.010473944469271572, 0.022883291720908545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 184.625, 122, 365, 126.5, 365.0, 365.0, 365.0, 0.038859474425608394, 0.010473842716277262, 0.022845120707242435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f312cf2-9344-4f04-8a72-6aad4199016f", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 365.75, 120, 1388, 127.0, 1350.5000000000002, 1388.0, 1388.0, 0.09020860740462319, 13.548572284345047, 0.05174074422101108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 309.3333333333333, 126, 1000, 128.5, 989.2, 1000.0, 1000.0, 0.09020318266896184, 4.440715602519676, 0.051825721813384656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 186.0, 121, 380, 124.5, 380.0, 380.0, 380.0, 0.038814790375872724, 0.01038598883104407, 0.022136560136239915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 149.08333333333331, 122, 378, 129.5, 305.10000000000025, 378.0, 378.0, 0.09020589495523532, 0.06703777935638094, 0.04527913086620211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 157.875, 124, 367, 130.0, 367.0, 367.0, 367.0, 0.03886022946965502, 0.028879526002351042, 0.019506013620510427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 166.16666666666669, 120, 379, 126.0, 374.20000000000005, 379.0, 379.0, 0.09020386072523903, 0.046716908337843525, 0.05018177017559684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 140.24999999999997, 124, 170, 132.5, 170.0, 170.0, 170.0, 0.0380820000666435, 0.02997469927120572, 0.01353696096118968], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 525.3571428571429, 127, 1176, 503.0, 1169.0, 1176.0, 1176.0, 0.08222573313050985, 0.01638664338405878, 0.05595089471875862], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1323.6363636363635, 791, 2392, 1216.5, 2171.4999999999995, 2386.15, 2392.0, 0.09162047467735017, 0.04742075349511288, 0.04214183942678899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 378.875, 253, 746, 258.5, 746.0, 746.0, 746.0, 0.03879107611294022, 0.06011859159300403, 0.08724203934384894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94486ac1-dffd-41f3-b7d9-d61cf9b9ec2d", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["addBook", 59, 13, 22.033898305084747, 1216.457627118644, 632, 2582, 1000.0, 2163.0, 2264.0, 2582.0, 0.27128307699381565, 83.57734710870864, 0.9856507704554337], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 229.28070175438592, 123, 743, 129.0, 510.4, 515.1, 743.0, 0.24353770561845758, 0.180988470679342, 0.11772574636829737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c69c20c-3805-4164-ab4b-eacc5ce59fc4", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 781.140350877193, 598, 1114, 742.0, 1014.2, 1027.1999999999996, 1114.0, 0.2432965400670986, 71.53726098515891, 0.12236105286577713], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 177.7894736842105, 121, 530, 128.0, 380.0, 384.4, 530.0, 0.24422012373819604, 0.43215514083360473, 0.11877111486486487], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1236.3859649122803, 845, 1954, 1256.0, 1501.2, 1648.6, 1954.0, 0.2429066982587425, 218.56787407764705, 0.12192777627440787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 129.15789473684214, 122, 139, 130.0, 133.0, 139.0, 139.0, 0.10564065497206082, 0.07892099712268216, 0.03755195157209975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 13, 7.428571428571429, 183.9885714285714, 122, 1186, 132.0, 295.0, 376.3999999999999, 791.5600000000047, 0.7304571409490099, 1.5941289572515611, 0.34977157561692324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 197.14285714285714, 123, 371, 131.0, 371.0, 371.0, 371.0, 0.042323947494119996, 0.03277626011995816, 0.015044840710800467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85d2041e-3b1a-4340-afc9-eb08a947e2ac", 3, 0, 0.0, 590.6666666666667, 238, 1176, 358.0, 1176.0, 1176.0, 1176.0, 0.02862240370946352, 0.02870625840783109, 0.018354861753790083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 133.16666666666666, 125, 148, 131.0, 145.3, 148.0, 148.0, 0.08605440550748195, 0.06983516696945069, 0.03058965195773773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a214cbb-b046-46e6-8614-a0774c565625", 3, 0, 0.0, 300.0, 225, 450, 225.0, 450.0, 450.0, 450.0, 0.05651101022849285, 0.03633113450562284, 0.03623915694991241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 361.8571428571429, 252, 763, 261.0, 763.0, 763.0, 763.0, 0.03924118755045296, 0.06081617640875864, 0.08825435051630191], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94486ac1-dffd-41f3-b7d9-d61cf9b9ec2d", 3, 0, 0.0, 294.3333333333333, 207, 448, 228.0, 448.0, 448.0, 448.0, 0.022235563560358437, 0.026672542877578396, 0.01425913418421423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 557.9166666666666, 252, 1767, 375.5, 1655.4000000000003, 1767.0, 1767.0, 0.09011918261901364, 18.085368094617632, 0.19883718092176902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e36e7780-d006-4744-8c1d-e73acf7f1219", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.5641977694346291, 1.0542043948763251], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59482868-09a3-426b-b047-4136bedb4933", 1, 0, 0.0, 940.0, 940, 940, 940.0, 940.0, 940.0, 940.0, 1.0638297872340425, 0.19219581117021278, 0.7334607712765958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c579ca6d-8872-4842-8900-1380bcfe09f1", 3, 0, 0.0, 764.6666666666666, 281, 1484, 529.0, 1484.0, 1484.0, 1484.0, 0.03118470701967755, 0.031276068466024265, 0.019998005478113534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 131.23529411764704, 127, 139, 130.0, 135.0, 139.0, 139.0, 0.10992634934593823, 0.09114010800263823, 0.039075381994063976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6224a8f9-cfeb-46e7-9338-89d9eb6ec781", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 1.0042010613207546, 1.876351218553459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 145.55555555555557, 123, 379, 130.5, 174.70000000000033, 379.0, 379.0, 0.10100273268504542, 0.07841520750450304, 0.03590331513413724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0459eb19-5275-4098-a06a-5bd9f9475e18", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48bff63b-e353-4d46-bfea-409f491cb7b3", 3, 0, 0.0, 391.6666666666667, 269, 524, 382.0, 524.0, 524.0, 524.0, 0.039343746311523785, 0.03279926246868893, 0.025230201898991486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d26c5653-218f-40b1-8fba-fca4ca1f665a", 3, 0, 0.0, 578.6666666666667, 228, 1162, 346.0, 1162.0, 1162.0, 1162.0, 0.026503639833203762, 0.0265812872155276, 0.0169961492419959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 139.42105263157896, 122, 366, 128.0, 131.0, 366.0, 366.0, 0.10338223131502199, 0.07682995901438645, 0.05189303407804815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 190.21052631578945, 121, 386, 127.0, 378.0, 386.0, 386.0, 0.10338054378166028, 0.044006870045215384, 0.058045284758987306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 308.6842105263157, 121, 1578, 126.0, 1441.0, 1578.0, 1578.0, 0.10338223131502199, 9.816880396960563, 0.05984224347603709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 270.2105263157895, 122, 996, 128.0, 760.0, 996.0, 996.0, 0.10338110628665947, 3.2246658477794825, 0.05994255037108376], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 19.35483870967742, 0.45214770158251694], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.67741935483871, 0.22607385079125847], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.67741935483871, 0.22607385079125847], "isController": false}, {"data": ["401/Unauthorized", 19, 61.29032258064516, 1.4318010550113036], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1327, 31, "401/Unauthorized", 19, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
