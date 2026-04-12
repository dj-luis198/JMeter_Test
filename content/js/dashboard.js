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

    var data = {"OkPercent": 95.95330739299611, "KoPercent": 4.046692607003891};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7333110814419226, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dabe26b9-cb62-48e9-be8d-9352c27cd7fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=645662b1-129e-4497-833c-80e6acebf0b5"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1ee0402-2ffd-4798-853c-81361220dea8"], "isController": false}, {"data": [0.3173076923076923, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bc33fd8-5595-4518-b2aa-b342e257b04f"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b15838f-b66d-466b-9d53-34c8f1094ad3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b15838f-b66d-466b-9d53-34c8f1094ad3"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45565627-0fc4-41b0-8365-de0d09fde1b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dabe26b9-cb62-48e9-be8d-9352c27cd7fe"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/645662b1-129e-4497-833c-80e6acebf0b5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4bc33fd8-5595-4518-b2aa-b342e257b04f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8921568627450981, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9803921568627451, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8808139534883721, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45565627-0fc4-41b0-8365-de0d09fde1b2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95bcbca7-0707-4a86-8521-dda1e8f305ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9a1e6f6-ab4a-466c-a22f-ac39477cbc6c"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e4681aa2-d372-4ba1-a19b-919716dd9d82"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4681aa2-d372-4ba1-a19b-919716dd9d82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9a1e6f6-ab4a-466c-a22f-ac39477cbc6c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95bcbca7-0707-4a86-8521-dda1e8f305ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a1ee0402-2ffd-4798-853c-81361220dea8"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d77ade28-3d9f-4411-9a39-44de2fba0e59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.19444444444444445, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb1e262a-2f16-452b-89ee-2c2251709570"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb1e262a-2f16-452b-89ee-2c2251709570"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e60d29ab-b02f-4672-a4e2-af87fada1ce4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1285, 52, 4.046692607003891, 428.1416342412454, 0, 6902, 138.0, 1162.2000000000007, 1453.5000000000002, 1995.7800000000027, 4.968795192835654, 678.6658277394109, 3.596202526980365], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 1, 1.9230769230769231, 2217.26923076923, 1648, 7425, 2028.5, 2566.9, 3070.3499999999935, 7425.0, 0.2522006935519073, 303.4871785350535, 1.2292510366903509], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 428.3529411764706, 249, 1425, 261.0, 900.1999999999996, 1425.0, 1425.0, 0.08386571618854986, 6.024244746059544, 0.18735373603265829], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 131.82352941176472, 123, 150, 130.0, 145.2, 150.0, 150.0, 0.11066699649771505, 0.08591822482000339, 0.03933865891129715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dabe26b9-cb62-48e9-be8d-9352c27cd7fe", 3, 0, 0.0, 346.0, 218, 565, 255.0, 565.0, 565.0, 565.0, 0.029761314259637708, 0.030042264166385585, 0.019085217803218188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=645662b1-129e-4497-833c-80e6acebf0b5", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 0.6522168321299638, 2.4890004512635375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 407.6000000000001, 252, 525, 503.0, 519.6, 525.0, 525.0, 0.10812914945611038, 0.16757906268246792, 0.2431849914037326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 126.4, 124, 128, 127.0, 128.0, 128.0, 128.0, 0.03617212142257719, 0.026881820705645744, 0.018156709385942067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 126.0, 122, 128, 126.0, 128.0, 128.0, 128.0, 0.03617238310894398, 0.009678938449072902, 0.020629562241819614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 124.6, 123, 126, 125.0, 126.0, 126.0, 126.0, 0.03617316819076282, 0.009749799238916543, 0.021265866455897675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 134.25, 130, 141, 133.0, 141.0, 141.0, 141.0, 0.026938566598871273, 0.00794477257115149, 0.013199634561507483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 176.8, 125, 373, 129.0, 373.0, 373.0, 373.0, 0.036108382922179216, 0.009732337584493616, 0.021263041896556704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1ee0402-2ffd-4798-853c-81361220dea8", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["https://demoqa.com/books", 52, 1, 1.9230769230769231, 1531.5000000000005, 1, 6902, 1361.0, 2031.6000000000001, 2545.0999999999935, 6902.0, 0.256134923996887, 300.54514004761893, 0.49604014483937386], "isController": false}, {"data": ["deleteBook", 14, 4, 28.571428571428573, 367.0714285714286, 129, 502, 451.5, 491.0, 502.0, 502.0, 0.07044946760330911, 0.015027516178217026, 0.0443405096389968], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, 28.571428571428573, 367.0714285714286, 129, 502, 451.5, 491.0, 502.0, 502.0, 0.06954690193390065, 0.014834990660844597, 0.043772439742577114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bc33fd8-5595-4518-b2aa-b342e257b04f", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 11, 47.82608695652174, 981.3478260869565, 1, 5020, 964.0, 1385.4000000000003, 4306.99999999999, 5020.0, 0.08893563380172767, 0.0521824695782131, 0.034891527527512047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 167.10526315789474, 122, 378, 127.0, 375.0, 378.0, 378.0, 0.10914459360872238, 0.03783260378789185, 0.06176408180674514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 210.0, 125, 386, 131.0, 386.0, 386.0, 386.0, 0.05919339138670385, 0.01595446877219752, 0.03485704590447502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 128.73684210526318, 124, 143, 128.0, 138.0, 143.0, 143.0, 0.1091452205882353, 0.08111280553481158, 0.05478578455307904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 155.55555555555554, 125, 374, 128.0, 374.0, 374.0, 374.0, 0.059189887736512924, 0.015953524428982, 0.03479718009509842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 219.15789473684214, 120, 1028, 127.0, 502.0, 1028.0, 1028.0, 0.10914647456887143, 1.7169588668585347, 0.06377910512816094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 168.42105263157896, 121, 880, 127.0, 157.0, 880.0, 880.0, 0.10914396663641272, 5.196707989984605, 0.06367105372755369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 216.58823529411762, 121, 384, 130.0, 381.6, 384.0, 384.0, 0.11409166258397482, 0.030751268430836965, 0.06707341882378208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b15838f-b66d-466b-9d53-34c8f1094ad3", 3, 0, 0.0, 577.0, 213, 1291, 227.0, 1291.0, 1291.0, 1291.0, 0.019874920500317996, 0.023491483182504772, 0.012745310346883613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 184.76470588235293, 124, 380, 127.0, 376.0, 380.0, 380.0, 0.11408936552890488, 0.03075064930271264, 0.06718348380266566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 158.7058823529412, 125, 386, 128.0, 378.0, 386.0, 386.0, 0.11408936552890488, 0.0847871163745084, 0.05726751355650108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 155.66666666666666, 125, 379, 128.0, 379.0, 379.0, 379.0, 0.059286975310268504, 0.01586389769044294, 0.03381210310663751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 172.64705882352942, 123, 386, 128.0, 380.4, 386.0, 386.0, 0.11409089688867413, 0.03052822826903976, 0.06506746463182198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 155.77777777777777, 126, 381, 127.0, 381.0, 381.0, 381.0, 0.05928580368494206, 0.04405907871507902, 0.02975869442779319], "isController": false}, {"data": ["deleteAccount", 14, 4, 28.571428571428573, 691.7142857142856, 126, 1877, 547.5, 1597.0, 1877.0, 1877.0, 0.06953239464600561, 0.014288674290397079, 0.04476244909235392], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 188.44444444444443, 128, 380, 135.0, 380.0, 380.0, 380.0, 0.06203174646935976, 0.04882576919365622, 0.02205034737778023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b15838f-b66d-466b-9d53-34c8f1094ad3", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 3, 13.636363636363637, 1121.9545454545457, 0, 3033, 1163.0, 1959.6999999999998, 2886.899999999998, 3033.0, 0.09284855135157948, 0.07116548012196923, 0.0368830648990272], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 222.6428571428571, 126, 508, 219.5, 372.5, 508.0, 508.0, 0.07043103795226788, 0.13844002639906225, 0.04973799025033203], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 368.44444444444446, 253, 767, 259.0, 767.0, 767.0, 767.0, 0.05914010290377905, 0.09165560869950913, 0.1330074775267609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45565627-0fc4-41b0-8365-de0d09fde1b2", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 142.47058823529412, 122, 378, 128.0, 180.3999999999998, 378.0, 378.0, 0.08401949252226516, 0.062440267392034954, 0.04217384683246513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dabe26b9-cb62-48e9-be8d-9352c27cd7fe", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 800.3, 382, 1130, 747.0, 1117.7, 1130.0, 1130.0, 0.04272171502052779, 11.30659392315645, 0.022541545532803867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 143.0, 121, 374, 126.0, 200.39999999999986, 374.0, 374.0, 0.08400786708967099, 0.029900778061098428, 0.04749571621648333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 1252.8000000000002, 376, 1526, 1363.0, 1519.8, 1526.0, 1526.0, 0.04259361010661181, 34.49437275185602, 0.022432357353999753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 263.1, 125, 520, 244.0, 505.90000000000003, 520.0, 520.0, 0.042791732637254484, 0.06929419048739784, 0.021859722014206856], "isController": false}, {"data": ["addBook", 60, 18, 30.0, 1171.616666666667, 642, 2832, 998.0, 2151.2, 2261.2999999999997, 2832.0, 0.26498255531510845, 64.4483722204434, 0.9587676102989886], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/645662b1-129e-4497-833c-80e6acebf0b5", 3, 0, 0.0, 314.0, 211, 510, 221.0, 510.0, 510.0, 510.0, 0.06298419096806702, 0.02960585018160442, 0.04039025267157943], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bc33fd8-5595-4518-b2aa-b342e257b04f", 3, 0, 0.0, 406.3333333333333, 222, 530, 467.0, 530.0, 530.0, 530.0, 0.024108585067142408, 0.028495531373305367, 0.015460258002041195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 143.4, 123, 362, 128.0, 224.00000000000009, 362.0, 362.0, 0.07170686234672659, 0.05328996313072161, 0.035993483638884244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 193.46666666666667, 124, 382, 128.0, 380.2, 382.0, 382.0, 0.07170583398665316, 0.033546752801307915, 0.040091777492016756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 298.7333333333333, 123, 1496, 127.0, 1243.4, 1496.0, 1496.0, 0.07170686234672659, 8.619678379783446, 0.041334150990749816], "isController": false}, {"data": ["https://demoqa.com/books-0", 51, 0, 0.0, 330.3921568627451, 125, 5113, 130.0, 515.0, 1014.9999999999983, 5113.0, 0.2548993147706656, 0.1894320102934341, 0.12321793047996041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 285.46666666666664, 124, 1141, 129.0, 1050.4, 1141.0, 1141.0, 0.07170583398665316, 2.8279361746371685, 0.041403583439298626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 400.3, 125, 2865, 126.0, 2591.500000000001, 2865.0, 2865.0, 0.042331446761855976, 0.03145920994704336, 0.021599786067450926], "isController": false}, {"data": ["https://demoqa.com/books-3", 51, 0, 0.0, 819.0784313725491, 602, 1148, 756.0, 1019.8, 1049.1999999999998, 1148.0, 0.26076552577488266, 76.67372280816349, 0.13114672438873493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 926.5999999999999, 122, 1788, 1278.0, 1759.8, 1788.0, 1788.0, 0.07444833781677768, 40.201273601674096, 0.03992873743063897], "isController": false}, {"data": ["https://demoqa.com/books-1", 51, 0, 0.0, 196.01960784313735, 123, 530, 130.0, 385.8, 460.39999999999986, 530.0, 0.2614084276026797, 0.46257038165630426, 0.12713027045520944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 224.29411764705878, 122, 1298, 127.0, 556.3999999999994, 1298.0, 1298.0, 0.0839195359743305, 4.463108763729483, 0.04891128285820067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 662.5333333333333, 121, 1158, 746.0, 1141.2, 1158.0, 1158.0, 0.07430855885980947, 13.1175215401935, 0.03992633699674529], "isController": false}, {"data": ["https://demoqa.com/books-2", 51, 0, 0.0, 1229.2352941176468, 866, 1762, 1232.0, 1551.4, 1632.4, 1762.0, 0.26042863489437323, 234.33414346266682, 0.13072296712471468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 237.64705882352942, 119, 978, 128.0, 507.59999999999957, 978.0, 978.0, 0.0840074519551499, 1.4743095483116972, 0.049044561938200164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 151.53333333333336, 127, 376, 132.0, 258.4000000000001, 376.0, 376.0, 0.11092705436904692, 0.08287030917218838, 0.03943110135774715], "isController": false}, {"data": ["deleteBooks", 14, 4, 28.571428571428573, 402.5, 130, 760, 427.5, 731.0, 760.0, 760.0, 0.06949580791358692, 0.014824091838710158, 0.04395357773106115], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 19, 11.046511627906977, 184.83720930232562, 0, 1974, 133.0, 273.80000000000007, 375.04999999999995, 1001.6400000000136, 0.7113993473324592, 1.4761593004607552, 0.33694207368773704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 179.4, 127, 373, 133.0, 373.0, 373.0, 373.0, 0.037603597912248245, 0.029120755023840678, 0.013366903945369492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 492.8666666666667, 254, 1622, 261.0, 1511.6000000000001, 1622.0, 1622.0, 0.07166198475032966, 11.527273469001415, 0.15872476453066178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45565627-0fc4-41b0-8365-de0d09fde1b2", 3, 0, 0.0, 357.0, 218, 625, 228.0, 625.0, 625.0, 625.0, 0.024698066141421126, 0.024770423757069823, 0.015838278091992064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95bcbca7-0707-4a86-8521-dda1e8f305ea", 3, 0, 0.0, 572.0, 216, 1187, 313.0, 1187.0, 1187.0, 1187.0, 0.018322960501804812, 0.025259680249070108, 0.011750075582212069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 147.26315789473682, 128, 383, 133.0, 169.0, 383.0, 383.0, 0.10997470581766194, 0.08924705130320026, 0.039092571208622015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9a1e6f6-ab4a-466c-a22f-ac39477cbc6c", 3, 0, 0.0, 304.3333333333333, 215, 467, 231.0, 467.0, 467.0, 467.0, 0.029246322274973924, 0.029332004859763887, 0.01875496578180294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 2, 9.090909090909092, 619.3636363636364, 0, 1359, 593.5, 1082.8, 1318.1999999999994, 1359.0, 0.0905647949942368, 0.06811656100773918, 0.03722611868104726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 154.00000000000003, 123, 512, 128.0, 288.8000000000001, 512.0, 512.0, 0.07430561403682587, 0.05522126199416453, 0.037297935170828606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 193.0, 123, 381, 127.0, 378.0, 381.0, 381.0, 0.0744490768314473, 0.08701235854675403, 0.038707703618225134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4681aa2-d372-4ba1-a19b-919716dd9d82", 3, 0, 0.0, 772.3333333333334, 214, 1877, 226.0, 1877.0, 1877.0, 1877.0, 0.022988329591344128, 0.027171427326227383, 0.014741865004865863], "isController": false}, {"data": ["login", 22, 3, 13.636363636363637, 2645.272727272727, 2, 4760, 2635.0, 4227.4, 4701.349999999999, 4760.0, 0.09405970225828794, 46.20346349468135, 0.18755992297793017], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 304.4, 253, 501, 254.0, 501.0, 501.0, 501.0, 0.03607477579526843, 0.05590885662801856, 0.08113301626611641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 162.23529411764704, 126, 379, 133.0, 375.8, 379.0, 379.0, 0.08258440612096186, 0.06685788347097402, 0.029356175613310664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 419.70588235294116, 251, 762, 486.0, 757.2, 762.0, 762.0, 0.11399220829729168, 0.17666565875761903, 0.25637114815299095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4681aa2-d372-4ba1-a19b-919716dd9d82", 1, 0, 0.0, 760.0, 760, 760, 760.0, 760.0, 760.0, 760.0, 1.3157894736842104, 0.2377158717105263, 0.9071751644736842], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9a1e6f6-ab4a-466c-a22f-ac39477cbc6c", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95bcbca7-0707-4a86-8521-dda1e8f305ea", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 161.33333333333331, 124, 473, 132.0, 299.0000000000001, 473.0, 473.0, 0.07357557683252236, 0.06100162571368309, 0.026153818327185684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1ee0402-2ffd-4798-853c-81361220dea8", 3, 0, 0.0, 684.0, 214, 1317, 521.0, 1317.0, 1317.0, 1317.0, 0.02006890323443824, 0.02372076420711108, 0.012869706826771916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1124.5333333333333, 250, 1916, 1409.0, 1905.8, 1916.0, 1916.0, 0.07411982705373688, 53.2497973285979, 0.1553186766522545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d77ade28-3d9f-4411-9a39-44de2fba0e59", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.8677606997282609, 1.6214121942934783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 134.4, 125, 159, 131.0, 150.0, 159.0, 159.0, 0.07221085569864003, 0.056062138945721506, 0.02566870261162595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 8, 44.44444444444444, 971.6666666666666, 1, 4369, 882.5, 1926.4000000000037, 4369.0, 4369.0, 0.07324576395331804, 43.83716055166268, 0.09991815803180494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 391.3684210526315, 253, 1156, 266.0, 628.0, 1156.0, 1156.0, 0.1090643996578822, 7.027444854312923, 0.24381969896790637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb1e262a-2f16-452b-89ee-2c2251709570", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 127.33333333333334, 121, 134, 127.0, 132.2, 134.0, 134.0, 0.10843478009426596, 0.08058483169114883, 0.0544291767270046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb1e262a-2f16-452b-89ee-2c2251709570", 3, 0, 0.0, 457.0, 237, 801, 333.0, 801.0, 801.0, 801.0, 0.06189650903689032, 0.02869161095980853, 0.039692748308162086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 226.86666666666667, 124, 388, 129.0, 384.4, 388.0, 388.0, 0.10823291723789595, 0.028960761057796377, 0.06172658561223753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 192.8, 122, 386, 129.0, 379.4, 386.0, 386.0, 0.10843556397336822, 0.029226773102196908, 0.06374825147653093], "isController": false}, {"data": ["register", 23, 11, 47.82608695652174, 981.3478260869565, 1, 5020, 964.0, 1385.4000000000003, 4306.99999999999, 5020.0, 0.08934675865498166, 0.05242369471183728, 0.035052821415252663], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 245.13333333333333, 123, 391, 131.0, 390.4, 391.0, 391.0, 0.10823213628590601, 0.029171942983310602, 0.06373435369179817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e60d29ab-b02f-4672-a4e2-af87fada1ce4", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.6942085597826086, 1.2971297554347825], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 10, 19.23076923076923, 0.7782101167315175], "isController": false}, {"data": ["406/Not Acceptable", 8, 15.384615384615385, 0.622568093385214], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com: Try again", 1, 1.9230769230769231, 0.07782101167315175], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 5.769230769230769, 0.23346303501945526], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 7.6923076923076925, 0.311284046692607], "isController": false}, {"data": ["401/Unauthorized", 26, 50.0, 2.0233463035019454], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1285, 52, "401/Unauthorized", 26, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 10, "406/Not Acceptable", 8, "Test failed: code expected to contain /204/", 4, "Test failed: code expected to contain /200/", 3], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 52, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 11, "406/Not Acceptable", 8, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com: Try again", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 3, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 19, "401/Unauthorized", 18, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 8, "Test failed: code expected to contain /204/", 4, "Test failed: code expected to contain /200/", 3, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
