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

    var data = {"OkPercent": 97.79179810725552, "KoPercent": 2.2082018927444795};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7306648575305291, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75fa2330-7ceb-44f6-9edc-134c8d0f550c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4cdff35-67d4-4a49-a689-2347b838bd60"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0a3f26a-5a76-4898-9969-02e064af7e77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d799856-b457-4cc4-adba-c1ee45171d35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b49c5999-f810-40c1-9d31-299ebbbbc3f1"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/71ea50be-ce5b-4c5d-ba02-a54bd0921413"], "isController": false}, {"data": [0.25925925925925924, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=966b5114-03f3-4762-9314-cae4e075892e"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f42f509a-4699-4efd-b393-9f18b23ccdab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38562f82-6dbb-4b64-a2ad-36e1052e9564"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/966b5114-03f3-4762-9314-cae4e075892e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71ea50be-ce5b-4c5d-ba02-a54bd0921413"], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3d799856-b457-4cc4-adba-c1ee45171d35"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.31896551724137934, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75fa2330-7ceb-44f6-9edc-134c8d0f550c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.32407407407407407, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4cdff35-67d4-4a49-a689-2347b838bd60"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/38562f82-6dbb-4b64-a2ad-36e1052e9564"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1530cfea-3b64-4f29-9404-79433e313e27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e789e8fb-5b28-4afe-ace9-d682012b58ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f42f509a-4699-4efd-b393-9f18b23ccdab"], "isController": false}, {"data": [0.4411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d0a3f26a-5a76-4898-9969-02e064af7e77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=946f5d02-a757-450f-abdd-e3fdf98d5b0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/06df9346-9682-462f-93b2-af00696a47c5"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/946f5d02-a757-450f-abdd-e3fdf98d5b0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06df9346-9682-462f-93b2-af00696a47c5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1268, 28, 2.2082018927444795, 484.55599369085127, 141, 2739, 159.0, 1367.2000000000016, 1711.6499999999999, 2174.0599999999986, 5.007503356764868, 683.5659556475101, 3.673204747847721], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/75fa2330-7ceb-44f6-9edc-134c8d0f550c", 3, 0, 0.0, 407.3333333333333, 316, 555, 351.0, 555.0, 555.0, 555.0, 0.03434144554591451, 0.02862905014423407, 0.022022346264795437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4cdff35-67d4-4a49-a689-2347b838bd60", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2391.037037037038, 1752, 3326, 2318.0, 3013.0, 3086.5, 3326.0, 0.24989125102964452, 300.7031815798333, 1.2287133290373633], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 406.2222222222223, 290, 864, 298.5, 619.2000000000004, 864.0, 864.0, 0.08958834157048363, 0.13884443171128663, 0.20148627991877321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 150.91666666666669, 147, 172, 148.5, 166.3, 172.0, 172.0, 0.07474260515350262, 0.05802770614944784, 0.026568660425659137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0a3f26a-5a76-4898-9969-02e064af7e77", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d799856-b457-4cc4-adba-c1ee45171d35", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b49c5999-f810-40c1-9d31-299ebbbbc3f1", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.9532416044776119, 1.781133395522388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 516.7499999999999, 290, 1015, 578.0, 844.0000000000007, 1007.8999999999999, 1015.0, 0.10352717070595177, 0.16044689444369675, 0.23283503333574895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 210.11111111111111, 143, 433, 147.0, 433.0, 433.0, 433.0, 0.0502883196996111, 0.03737247196426177, 0.025242379224218858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 177.11111111111111, 143, 435, 145.0, 435.0, 435.0, 435.0, 0.05020948512962416, 0.03019324724266244, 0.02769802760405916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 542.2222222222222, 143, 1854, 152.0, 1854.0, 1854.0, 1854.0, 0.0499730700677968, 10.002888634319284, 0.028424352571114454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 430.6666666666667, 143, 1144, 153.0, 1144.0, 1144.0, 1144.0, 0.05001278104404459, 3.2783551629860965, 0.02849578051891039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 158.66666666666666, 146, 177, 153.0, 177.0, 177.0, 177.0, 0.04763265694960465, 0.014047912498809184, 0.029444796727636467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71ea50be-ce5b-4c5d-ba02-a54bd0921413", 3, 0, 0.0, 424.0, 367, 529, 376.0, 529.0, 529.0, 529.0, 0.016120798516886536, 0.02222382217415836, 0.010337881861414868], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1662.5185185185182, 1143, 2718, 1479.0, 2373.0, 2477.0, 2718.0, 0.24839120695127392, 297.1622382692653, 0.49047560591355066], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 513.0714285714286, 145, 947, 567.0, 850.5, 947.0, 947.0, 0.08101148627144635, 0.01661933462083731, 0.05423181038972311], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 513.0714285714286, 145, 947, 567.0, 850.5, 947.0, 947.0, 0.08139440239066988, 0.016697889050708712, 0.054488147303519724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=966b5114-03f3-4762-9314-cae4e075892e", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, 36.36363636363637, 1279.181818181818, 170, 2256, 1329.0, 2150.0, 2246.3999999999996, 2256.0, 0.08688097306689835, 0.027057746228575943, 0.03919825152041703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 180.56249999999997, 142, 434, 145.0, 432.6, 434.0, 434.0, 0.1212893053155038, 0.03245436489887504, 0.06917280693774827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 146.83333333333331, 145, 149, 146.5, 149.0, 149.0, 149.0, 0.036538133632134075, 0.009848168830536137, 0.02151610798845395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 165.0, 143, 448, 146.0, 240.1000000000002, 448.0, 448.0, 0.12128470827237513, 0.09013443651882566, 0.06087923833203205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 146.0, 144, 149, 145.5, 149.0, 149.0, 149.0, 0.03653791112762083, 0.009848108858616554, 0.021480295409011467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 216.12500000000003, 143, 434, 145.0, 432.6, 434.0, 434.0, 0.1212911442303319, 0.03269175371833164, 0.07142437497157239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 180.0625, 142, 434, 144.0, 431.9, 434.0, 434.0, 0.12129206370865646, 0.03269200154647381, 0.07130646714122187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 192.5, 144, 430, 145.0, 430.0, 430.0, 430.0, 0.07385251652450057, 0.019905561094494297, 0.04341720209741147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 169.49999999999997, 144, 433, 145.0, 348.1000000000003, 433.0, 433.0, 0.07385342556805594, 0.019905806110140076, 0.043489859001501686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f42f509a-4699-4efd-b393-9f18b23ccdab", 3, 0, 0.0, 425.0, 309, 485, 481.0, 485.0, 485.0, 485.0, 0.02385534121089712, 0.02392522990585092, 0.015297858784331812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 146.83333333333331, 145, 150, 146.0, 150.0, 150.0, 150.0, 0.036538133632134075, 0.009776805288285876, 0.020838154337076465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 145.66666666666669, 144, 149, 145.0, 148.4, 149.0, 149.0, 0.07385206201111473, 0.05488419842818195, 0.03707027331417283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 147.66666666666666, 145, 152, 147.5, 152.0, 152.0, 152.0, 0.036538133632134075, 0.02715382782622464, 0.018340430358317297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 193.41666666666666, 144, 435, 145.0, 433.8, 435.0, 435.0, 0.07385297104348093, 0.01976143951749392, 0.04211927254823522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38562f82-6dbb-4b64-a2ad-36e1052e9564", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/966b5114-03f3-4762-9314-cae4e075892e", 3, 0, 0.0, 967.0, 360, 2066, 475.0, 2066.0, 2066.0, 2066.0, 0.03125227881199671, 0.026053738944506372, 0.020041337649620287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 247.33333333333334, 146, 441, 158.0, 441.0, 441.0, 441.0, 0.0377802824705786, 0.029737214522740585, 0.013429709784463489], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 602.9999999999999, 146, 1807, 512.0, 1498.600000000001, 1807.0, 1807.0, 0.07188426633120676, 0.014028195854673974, 0.04891733683769132], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71ea50be-ce5b-4c5d-ba02-a54bd0921413", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1657.6315789473683, 1263, 2739, 1556.0, 2432.0, 2739.0, 2739.0, 0.08133283106742921, 0.04209609420482175, 0.03740992522730386], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 290.85714285714283, 144, 481, 270.0, 448.5, 481.0, 481.0, 0.08169600914995302, 0.17652743271750104, 0.052798097431244057], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 296.16666666666663, 294, 299, 295.5, 299.0, 299.0, 299.0, 0.03650478821138706, 0.05657529188620241, 0.0821001242683832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 162.77777777777777, 144, 430, 146.0, 184.30000000000038, 430.0, 430.0, 0.08978227797590842, 0.06672296244108038, 0.0450664949996259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 193.3888888888889, 144, 434, 145.5, 434.0, 434.0, 434.0, 0.08965572202741473, 0.023989909995616832, 0.051131778968759964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d799856-b457-4cc4-adba-c1ee45171d35", 3, 0, 0.0, 800.6666666666667, 236, 1807, 359.0, 1807.0, 1807.0, 1807.0, 0.017844396859386154, 0.02459994163395194, 0.01144318418391625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1141.8333333333333, 858, 1282, 1145.5, 1282.0, 1282.0, 1282.0, 0.04949637439057589, 14.553577505135248, 0.028228401019625312], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1553.0, 1288, 1723, 1566.0, 1723.0, 1723.0, 1723.0, 0.04932101404004866, 44.37913513033078, 0.028080225766941767], "isController": false}, {"data": ["addBook", 58, 9, 15.517241379310345, 1347.3275862068967, 727, 3420, 1143.0, 2510.7000000000003, 2618.6499999999996, 3420.0, 0.2834023923070909, 71.20072829528574, 1.0346916746882573], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 335.5, 144, 433, 429.5, 433.0, 433.0, 433.0, 0.049670107701350205, 0.08789280776840484, 0.02750288190104059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 165.85714285714286, 144, 430, 146.0, 289.0, 430.0, 430.0, 0.08033649514824952, 0.05970319610138466, 0.04032515479121119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 206.3571428571429, 141, 431, 146.0, 430.5, 431.0, 431.0, 0.0803388001974039, 0.021496905521570967, 0.04581822198758192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 168.64285714285714, 143, 432, 146.5, 300.0, 432.0, 432.0, 0.08033649514824952, 0.02165319595792663, 0.047229072343013885], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 265.3333333333333, 144, 618, 147.0, 583.5, 588.25, 618.0, 0.2500370425248185, 0.1858185442982294, 0.12086751567361832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 227.7142857142857, 144, 432, 146.0, 431.5, 432.0, 432.0, 0.08020578512870165, 0.021617965522970364, 0.04723055510996786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75fa2330-7ceb-44f6-9edc-134c8d0f550c", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 965.5740740740741, 710, 1302, 861.5, 1275.5, 1296.75, 1302.0, 0.2499398293003536, 73.49060859769871, 0.12570216024383019], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 244.00000000000003, 146, 433, 152.0, 433.0, 433.0, 433.0, 0.04966969651815427, 0.036912733447573634, 0.02789069872845577], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 249.25925925925924, 144, 590, 151.5, 437.0, 482.0, 590.0, 0.25058702330459315, 0.44342156858195586, 0.1218675171930541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 209.66666666666669, 143, 436, 145.5, 435.1, 436.0, 436.0, 0.08965616859344415, 0.02416513919120174, 0.05270802098950525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1014.4117647058821, 143, 1872, 1324.0, 1860.0, 1872.0, 1872.0, 0.08500892593722341, 45.00424693030268, 0.04567862438055995], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1392.8703703703702, 994, 2139, 1290.0, 1792.0, 1989.0, 2139.0, 0.2491073652744333, 224.1472451579756, 0.12504022046001828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 146.11111111111111, 144, 154, 146.0, 151.3, 154.0, 154.0, 0.08978496500880391, 0.02419985385002918, 0.05287141982452027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 709.2941176470589, 143, 1294, 867.0, 1198.8, 1294.0, 1294.0, 0.08500935102861315, 14.712712148336317, 0.04576186974317175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 148.4, 146, 152, 148.0, 151.0, 151.95, 152.0, 0.10247266541650014, 0.07655428617541271, 0.03642583028477154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4cdff35-67d4-4a49-a689-2347b838bd60", 3, 0, 0.0, 443.3333333333333, 274, 561, 495.0, 561.0, 561.0, 561.0, 0.09782502364104738, 0.04419958750448365, 0.06273284393647895], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 454.38461538461536, 146, 848, 501.0, 758.3999999999999, 848.0, 848.0, 0.07573639075316928, 0.01567979964811708, 0.050970727520856636], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 9, 5.294117647058823, 206.464705882353, 145, 1195, 152.0, 339.70000000000005, 402.89999999999975, 754.7999999999951, 0.7394615849706607, 1.5205561145317252, 0.356732444312018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 150.33333333333337, 146, 158, 147.0, 158.0, 158.0, 158.0, 0.05001583834881046, 0.03873296856504559, 0.017779067538053715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 415.5, 290, 861, 294.5, 720.0, 861.0, 861.0, 0.08013783707977722, 0.12419799555235003, 0.1802318738229755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 171.1875, 146, 469, 149.5, 257.60000000000025, 469.0, 469.0, 0.12579803126081077, 0.10208805075950561, 0.04471726892474133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 709.6315789473686, 170, 1454, 688.0, 1433.0, 1454.0, 1454.0, 0.08322127661438326, 0.05111931932660847, 0.037628370187948686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 166.64705882352942, 144, 431, 146.0, 252.59999999999985, 431.0, 431.0, 0.08500552535914835, 0.06317305156085146, 0.04266878909629126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 288.3529411764706, 143, 580, 147.0, 464.7999999999999, 580.0, 580.0, 0.08500892593722341, 0.09785207134249095, 0.044281993359302725], "isController": false}, {"data": ["login", 19, 0, 0.0, 3378.5789473684213, 1988, 5761, 3383.0, 4847.0, 5761.0, 5761.0, 0.08224645366278088, 31.183276211728344, 0.1671603370264877], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 754.2222222222222, 291, 2004, 309.0, 2004.0, 2004.0, 2004.0, 0.04993009786299181, 13.334353823050506, 0.10945505285655636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 182.77777777777777, 146, 438, 150.5, 435.3, 438.0, 438.0, 0.08930343322087717, 0.0722974083399484, 0.03174457977773368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38562f82-6dbb-4b64-a2ad-36e1052e9564", 3, 0, 0.0, 431.66666666666663, 260, 754, 281.0, 754.0, 754.0, 754.0, 0.019065898099129962, 0.026283879703715946, 0.012226503663830086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 388.0, 290, 581, 294.5, 580.1, 581.0, 581.0, 0.073785763037022, 0.11435352142554094, 0.16594591042408366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1530cfea-3b64-4f29-9404-79433e313e27", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e789e8fb-5b28-4afe-ace9-d682012b58ee", 2, 0, 0.0, 276.0, 266, 286, 276.0, 286.0, 286.0, 286.0, 0.011712070459815887, 0.019706931056897237, 0.0072800125465554795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 170.9285714285714, 145, 438, 149.0, 303.0, 438.0, 438.0, 0.08015664899403406, 0.0664580029257177, 0.028493183822098044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f42f509a-4699-4efd-b393-9f18b23ccdab", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 0.2895257411858974, 1.104892828525641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1182.4705882352944, 292, 2020, 1471.0, 2006.4, 2020.0, 2020.0, 0.08494351256414484, 59.831837804422555, 0.17825548354094525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0a3f26a-5a76-4898-9969-02e064af7e77", 3, 0, 0.0, 853.3333333333334, 416, 1365, 779.0, 1365.0, 1365.0, 1365.0, 0.021760733481789894, 0.02999892783052741, 0.013954637030965524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=946f5d02-a757-450f-abdd-e3fdf98d5b0e", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 0.5735367063492064, 2.1887400793650795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 168.47058823529412, 146, 434, 149.0, 227.59999999999982, 434.0, 434.0, 0.08298755186721991, 0.06442881224066391, 0.02949948132780083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06df9346-9682-462f-93b2-af00696a47c5", 3, 0, 0.0, 464.0, 364, 535, 493.0, 535.0, 535.0, 535.0, 0.01725496511621219, 0.0237873623916532, 0.011065195728820969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 418.5625, 287, 880, 295.0, 670.0000000000002, 880.0, 880.0, 0.12114971075506557, 0.18775838961746977, 0.27246853893448825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 1046.6363636363637, 144, 1997, 1434.0, 1977.8000000000002, 1997.0, 1997.0, 0.081720589874076, 53.33697729003381, 0.12499680778945806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/946f5d02-a757-450f-abdd-e3fdf98d5b0e", 3, 0, 0.0, 740.6666666666666, 263, 1388, 571.0, 1388.0, 1388.0, 1388.0, 0.06473050532947827, 0.029288867971345965, 0.0415101222327709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 175.95, 144, 441, 146.5, 401.50000000000057, 440.4, 441.0, 0.10376188722120477, 0.07711210563997738, 0.05208360354658131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 238.85000000000005, 143, 586, 145.5, 435.6, 578.4999999999999, 586.0, 0.10360654378930574, 0.02772284472487282, 0.05908810700483842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 202.25, 142, 433, 145.0, 432.0, 432.95, 433.0, 0.10376457892333874, 0.02796779666293114, 0.06100222315610343], "isController": false}, {"data": ["register", 22, 8, 36.36363636363637, 1279.181818181818, 170, 2256, 1329.0, 2150.0, 2246.3999999999996, 2256.0, 0.08566811393859153, 0.02668001985942641, 0.03865104359338798], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 331.65, 144, 435, 430.0, 433.9, 434.95, 435.0, 0.10360708050788191, 0.027925345918140044, 0.06101081010376249], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06df9346-9682-462f-93b2-af00696a47c5", 1, 0, 0.0, 848.0, 848, 848, 848.0, 848.0, 848.0, 848.0, 1.1792452830188678, 0.21304724351415094, 0.813034345518868], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 28.571428571428573, 0.6309148264984227], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.23659305993690852], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.15772870662460567], "isController": false}, {"data": ["401/Unauthorized", 15, 53.57142857142857, 1.1829652996845426], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1268, 28, "401/Unauthorized", 15, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
