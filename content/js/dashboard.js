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

    var data = {"OkPercent": 98.41628959276018, "KoPercent": 1.583710407239819};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.817738791423002, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.35964912280701755, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/61080217-03fa-4361-9fcb-e9593bcbd34a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30451bc8-1182-4f7e-b3a1-8d88bba7ba40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a93181b-d27d-44dc-b7ff-f23c9206cf62"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=714a8c16-84f1-47df-8bb0-22165fe9756f"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/779316ae-aff0-4acc-89f4-c6cb2c8ffb04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/845c220d-2262-45d6-8a76-4788919dca08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ece175e-a5c1-413b-8b69-58f14b66b4f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3aec0105-be22-4168-b9ae-93dd8786f3a4"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=188fd8ee-3e3e-411c-9175-b0bf09a8e7d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3baec074-a14a-4411-8f62-2dc97efde38c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78f5c48c-89a3-453b-9c62-917a0106972b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ca725c3-6dfd-4188-b5e9-6add95bf4d92"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5f3fb62a-9e03-4a65-93c9-1f73f564f66a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30451bc8-1182-4f7e-b3a1-8d88bba7ba40"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9208b162-9196-4e98-acce-ac4ea1bc2edd"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=845c220d-2262-45d6-8a76-4788919dca08"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a93181b-d27d-44dc-b7ff-f23c9206cf62"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a83853c4-3b88-41ae-b50b-c07acea58ab9"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=779316ae-aff0-4acc-89f4-c6cb2c8ffb04"], "isController": false}, {"data": [0.9463276836158192, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3aec0105-be22-4168-b9ae-93dd8786f3a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a83853c4-3b88-41ae-b50b-c07acea58ab9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ca725c3-6dfd-4188-b5e9-6add95bf4d92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/714a8c16-84f1-47df-8bb0-22165fe9756f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3baec074-a14a-4411-8f62-2dc97efde38c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/188fd8ee-3e3e-411c-9175-b0bf09a8e7d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f3fb62a-9e03-4a65-93c9-1f73f564f66a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9208b162-9196-4e98-acce-ac4ea1bc2edd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1326, 21, 1.583710407239819, 303.97963800904915, 1, 2980, 96.0, 814.3, 1050.9499999999996, 1594.9500000000003, 5.440691944411392, 769.31463190575, 3.9788073047238828], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 1, 1.7543859649122806, 1369.8771929824563, 978, 2088, 1366.0, 1691.6000000000001, 1776.5999999999988, 2088.0, 0.25285235197047395, 304.2731146419256, 1.2406608207498624], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/61080217-03fa-4361-9fcb-e9593bcbd34a", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.8515625, 1.5911458333333333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30451bc8-1182-4f7e-b3a1-8d88bba7ba40", 1, 0, 0.0, 826.0, 826, 826, 826.0, 826.0, 826.0, 826.0, 1.2106537530266344, 0.21872162530266345, 0.8346890133171914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a93181b-d27d-44dc-b7ff-f23c9206cf62", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 517.6153846153846, 90, 821, 445.0, 798.1999999999999, 821.0, 821.0, 0.10246143903150294, 0.019411639816515208, 0.06926461011452037], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 517.6153846153846, 90, 821, 445.0, 798.1999999999999, 821.0, 821.0, 0.1050878696263722, 0.019909225300308798, 0.07104009455887346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 124.88235294117646, 80, 330, 83.0, 261.19999999999993, 330.0, 330.0, 0.08826216979564712, 0.02361702590235089, 0.050337018711579994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 94.70588235294116, 79, 245, 83.0, 148.99999999999991, 245.0, 245.0, 0.08826171155034293, 0.06559293211895602, 0.044303241930543226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 120.23529411764704, 80, 401, 83.0, 275.39999999999986, 401.0, 401.0, 0.08826216979564712, 1.5489787710012044, 0.05152851744216232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 101.41176470588233, 79, 245, 82.0, 242.6, 245.0, 245.0, 0.08826400282444809, 0.023789907011277023, 0.05188957978546655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=714a8c16-84f1-47df-8bb0-22165fe9756f", 1, 0, 0.0, 1119.0, 1119, 1119, 1119.0, 1119.0, 1119.0, 1119.0, 0.8936550491510277, 0.16145135165326185, 0.6161332663092046], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 232.92307692307693, 82, 422, 216.0, 382.4, 422.0, 422.0, 0.10330742700932946, 0.23298494393585403, 0.06677887690920072], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/779316ae-aff0-4acc-89f4-c6cb2c8ffb04", 3, 0, 0.0, 380.3333333333333, 246, 612, 283.0, 612.0, 612.0, 612.0, 0.027088280706823537, 0.03201743074429566, 0.017371065427227335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 92.86666666666666, 80, 244, 82.0, 148.00000000000006, 244.0, 244.0, 0.07650524060898171, 0.05685594541351083, 0.03840204460255527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 103.19999999999999, 79, 244, 82.0, 242.8, 244.0, 244.0, 0.07644285896292521, 0.028108676264492292, 0.04316831762007899], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 597.6666666666666, 476, 643, 635.0, 643.0, 643.0, 643.0, 0.10344292536592935, 30.41565468596452, 0.05899479337275658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 857.3333333333334, 718, 1103, 835.0, 1103.0, 1103.0, 1103.0, 0.1026167265264238, 92.33471090944074, 0.05842339020010262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 161.83333333333331, 80, 247, 160.5, 247.0, 247.0, 247.0, 0.10443864229765012, 0.1848074412532637, 0.057828818537859004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 95.0, 81, 240, 83.0, 177.99999999999994, 240.0, 240.0, 0.06646658520249302, 0.049395577479587095, 0.033363110150470124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 95.15384615384615, 80, 243, 82.0, 181.39999999999995, 243.0, 243.0, 0.06646692503553424, 0.02546434177292853, 0.037477519479921874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 173.69230769230768, 79, 960, 83.0, 672.7999999999997, 960.0, 960.0, 0.0664679445555084, 4.617150431338613, 0.03863649000680018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 125.46153846153845, 80, 481, 82.0, 385.3999999999999, 481.0, 481.0, 0.0664679445555084, 1.519904992381751, 0.03870140010890517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/845c220d-2262-45d6-8a76-4788919dca08", 3, 0, 0.0, 326.0, 202, 514, 262.0, 514.0, 514.0, 514.0, 0.037843906500321677, 0.030982234651142256, 0.02426839056172972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ece175e-a5c1-413b-8b69-58f14b66b4f1", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 134.83333333333331, 81, 243, 82.0, 243.0, 243.0, 243.0, 0.10443864229765012, 0.077615045691906, 0.05864474543080939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 544.1578947368421, 80, 1122, 758.0, 1110.0, 1122.0, 1122.0, 0.10196688759492312, 48.3024840173612, 0.05533338811817425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 144.46666666666667, 79, 864, 82.0, 490.8000000000002, 864.0, 864.0, 0.07650563081442795, 4.608572687043517, 0.04453862960563898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 368.31578947368416, 81, 652, 475.0, 650.0, 652.0, 652.0, 0.10196634037437746, 15.79274972361755, 0.055432667667546794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 146.06666666666666, 80, 399, 83.0, 306.6, 399.0, 399.0, 0.07644324853228962, 1.5176871362575426, 0.04457696465518999], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 465.23076923076917, 91, 1119, 384.0, 1001.8, 1119.0, 1119.0, 0.10508277289187791, 0.019908259708031558, 0.07187339597209648], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3aec0105-be22-4168-b9ae-93dd8786f3a4", 3, 0, 0.0, 336.3333333333333, 216, 512, 281.0, 512.0, 512.0, 512.0, 0.02346811856093497, 0.02773852164542802, 0.015049542176120407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 271.2307692307692, 163, 1046, 167.0, 820.7999999999997, 1046.0, 1046.0, 0.06643771208961936, 6.209091298192894, 0.14811237843176336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 417.8095238095238, 102, 890, 315.0, 886.8, 889.9, 890.0, 0.0994624292514268, 0.06109557421791745, 0.04497178197598693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 92.68421052631578, 81, 252, 83.0, 96.0, 252.0, 252.0, 0.10196579315970526, 0.07577731308060127, 0.05118204851961768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 158.42105263157893, 80, 253, 86.0, 246.0, 253.0, 253.0, 0.10196579315970526, 0.10788794294745542, 0.05364524356408014], "isController": false}, {"data": ["login", 21, 0, 0.0, 2372.285714285714, 1105, 3633, 2327.0, 3049.0, 3575.0999999999995, 3633.0, 0.09551750017056697, 32.77907953537559, 0.1893693073275568], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=188fd8ee-3e3e-411c-9175-b0bf09a8e7d6", 1, 0, 0.0, 811.0, 811, 811, 811.0, 811.0, 811.0, 811.0, 1.2330456226880395, 0.22276703144266335, 0.8501271578298396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3baec074-a14a-4411-8f62-2dc97efde38c", 3, 0, 0.0, 259.6666666666667, 163, 421, 195.0, 421.0, 421.0, 421.0, 0.07271669575334497, 0.032902411164436686, 0.04663147481578437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 87.59999999999998, 84, 103, 86.0, 97.60000000000001, 103.0, 103.0, 0.07838792616902526, 0.06346053788488472, 0.027864458130395703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78f5c48c-89a3-453b-9c62-917a0106972b", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ca725c3-6dfd-4188-b5e9-6add95bf4d92", 3, 0, 0.0, 337.6666666666667, 193, 553, 267.0, 553.0, 553.0, 553.0, 0.07122168937847206, 0.03301422059731257, 0.045672763045439435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 646.4736842105265, 164, 1207, 855.0, 1194.0, 1207.0, 1207.0, 0.1019203948074241, 64.24967709842024, 0.2154964679889497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f3fb62a-9e03-4a65-93c9-1f73f564f66a", 3, 0, 0.0, 409.0, 201, 642, 384.0, 642.0, 642.0, 642.0, 0.020025499135565953, 0.02366946203165364, 0.01284187281805499], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30451bc8-1182-4f7e-b3a1-8d88bba7ba40", 3, 0, 0.0, 398.0, 322, 450, 422.0, 450.0, 450.0, 450.0, 0.018419259177395887, 0.021770940779011868, 0.011811829615712857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 258.1764705882353, 162, 576, 167.0, 503.99999999999994, 576.0, 576.0, 0.08822323592450167, 1.6612453569278591, 0.19797014389469259], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 765.375, 82, 1185, 917.0, 1185.0, 1185.0, 1185.0, 0.13662602042559005, 122.59830402278239, 0.2536887691276429], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9208b162-9196-4e98-acce-ac4ea1bc2edd", 3, 0, 0.0, 768.0, 259, 1600, 445.0, 1600.0, 1600.0, 1600.0, 0.029086960315690476, 0.029172176019740353, 0.018652770775361406], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1001.3913043478263, 93, 2014, 1022.0, 1976.8, 2008.3999999999999, 2014.0, 0.09452883540474781, 0.02949209759485763, 0.04264875191112645], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 104.10526315789473, 81, 252, 86.0, 246.0, 252.0, 252.0, 0.10059137137804885, 0.07809584008354378, 0.0357570890445408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 271.8666666666667, 165, 945, 167.0, 672.0000000000002, 945.0, 945.0, 0.07640976007335337, 6.204701349269013, 0.17054399769497225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=845c220d-2262-45d6-8a76-4788919dca08", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 342.1428571428571, 165, 1030, 325.5, 680.0, 1030.0, 1030.0, 0.10815822002472188, 9.39813903884039, 0.24127370789555005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 82.54545454545453, 81, 84, 83.0, 84.0, 84.0, 84.0, 0.051729408168543815, 0.038443437125255706, 0.025965738084601096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 82.54545454545455, 80, 90, 82.0, 88.80000000000001, 90.0, 90.0, 0.05173086780882152, 0.013842048612907321, 0.029502760547218523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 100.0909090909091, 81, 244, 83.0, 216.60000000000008, 244.0, 244.0, 0.05173013797838621, 0.013942888751986907, 0.030411663147449704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 97.36363636363636, 81, 240, 82.0, 209.80000000000013, 240.0, 240.0, 0.05173038125290983, 0.013942954322073355, 0.030462324116703743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 3.2408997252747254, 6.793011675824176], "isController": false}, {"data": ["https://demoqa.com/books", 57, 1, 1.7543859649122806, 965.8070175438597, 639, 1757, 880.0, 1350.2, 1410.6999999999987, 1757.0, 0.25909326448422254, 308.6376468834376, 0.5093219242334022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1001.3913043478263, 93, 2014, 1022.0, 1976.8, 2008.3999999999999, 2014.0, 0.09608876931175375, 0.029978782137515564, 0.0433525502168264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 101.0, 81, 247, 82.0, 247.0, 247.0, 247.0, 0.05647554922471621, 0.015221925376974293, 0.033256597834476445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 136.44444444444446, 80, 247, 82.0, 247.0, 247.0, 247.0, 0.056417489421720736, 0.015206276445698165, 0.03316731311706629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 202.31578947368422, 79, 1094, 83.0, 882.0, 1094.0, 1094.0, 0.09999315836284885, 9.495063742349208, 0.05788049699231105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 156.73684210526315, 80, 640, 82.0, 474.0, 640.0, 640.0, 0.09999210588637739, 3.1189560692576905, 0.05797753631292267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 92.0, 80, 238, 83.0, 93.0, 238.0, 238.0, 0.09999105343206134, 0.07430975748222528, 0.05019082174226517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 81.22222222222223, 79, 87, 81.0, 87.0, 87.0, 87.0, 0.05647590361445783, 0.015111716396837348, 0.03220891378012048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 115.31578947368422, 80, 243, 82.0, 242.0, 243.0, 243.0, 0.09999263212184366, 0.042564709047754376, 0.05614306708979338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 82.22222222222223, 81, 84, 82.0, 84.0, 84.0, 84.0, 0.05647554922471621, 0.041970598593758825, 0.02834807841943763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 109.77777777777777, 83, 257, 86.0, 257.0, 257.0, 257.0, 0.06163032759943027, 0.0485098086378328, 0.021907655513859974], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 533.9230769230769, 83, 1600, 422.0, 1216.7999999999997, 1600.0, 1600.0, 0.10659494739949327, 0.01997053777150963, 0.07254734250596521], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1431.047619047619, 798, 2822, 1384.0, 1961.0000000000002, 2740.3999999999987, 2822.0, 0.09826998039279915, 0.05086239219549175, 0.045200352309578515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 220.44444444444446, 163, 331, 167.0, 331.0, 331.0, 331.0, 0.0563881509698762, 0.0873906206925718, 0.1268182731285399], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a93181b-d27d-44dc-b7ff-f23c9206cf62", 3, 0, 0.0, 346.0, 159, 472, 407.0, 472.0, 472.0, 472.0, 0.02860766494702814, 0.023849033180123394, 0.018345410138556457], "isController": false}, {"data": ["addBook", 60, 7, 11.666666666666666, 953.4333333333335, 419, 3478, 731.5, 1566.6, 1706.4499999999998, 3478.0, 0.2995775955902178, 90.77003183324013, 1.0899573008308285], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a83853c4-3b88-41ae-b50b-c07acea58ab9", 3, 0, 0.0, 338.3333333333333, 211, 422, 382.0, 422.0, 422.0, 422.0, 0.01894704931285368, 0.02612003705727061, 0.012150288784609942], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 155.80701754385964, 81, 541, 84.0, 332.4, 337.29999999999995, 541.0, 0.26004361433250905, 0.1932550688545307, 0.12570467685018752], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 1, 1.7543859649122806, 503.7719298245614, 1, 797, 479.0, 646.0, 739.5, 797.0, 0.2602490172175271, 75.18795554279042, 0.1285906944996142], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 140.15789473684208, 80, 338, 87.0, 246.2, 248.2, 338.0, 0.260623851197498, 0.46118204918932265, 0.12674870888315823], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 802.1929824561405, 556, 1513, 751.0, 1043.2, 1110.1, 1513.0, 0.25977458857629854, 233.7456314359724, 0.13039466653146237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 88.35714285714286, 83, 104, 85.0, 101.5, 104.0, 104.0, 0.10437401683403785, 0.07797472937308492, 0.037101701296474394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=779316ae-aff0-4acc-89f4-c6cb2c8ffb04", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, 3.9548022598870056, 169.87570621468925, 81, 2980, 88.0, 279.20000000000005, 394.1999999999999, 2909.7999999999997, 0.746394534873914, 1.6120364354916927, 0.3589734044235473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 85.27272727272727, 83, 89, 85.0, 88.6, 89.0, 89.0, 0.05031377499679821, 0.03896369489498143, 0.017884974705893116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3aec0105-be22-4168-b9ae-93dd8786f3a4", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a83853c4-3b88-41ae-b50b-c07acea58ab9", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.5147124287749288, 1.9642539173789175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 96.23529411764707, 83, 247, 86.0, 130.1999999999999, 247.0, 247.0, 0.09043515267581657, 0.073390245970316, 0.03214687067773168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 183.8181818181818, 164, 325, 169.0, 297.80000000000007, 325.0, 325.0, 0.05170922492572675, 0.08013919917688316, 0.11629525879291865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 312.47368421052636, 164, 1333, 169.0, 964.0, 1333.0, 1333.0, 0.0999479218722876, 12.725169475838905, 0.22209336483884715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ca725c3-6dfd-4188-b5e9-6add95bf4d92", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 84.76923076923076, 83, 90, 84.0, 90.0, 90.0, 90.0, 0.06934627797188808, 0.05749510742005174, 0.024650434747819593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/714a8c16-84f1-47df-8bb0-22165fe9756f", 3, 0, 0.0, 328.6666666666667, 166, 426, 394.0, 426.0, 426.0, 426.0, 0.0250547027677095, 0.025128105217224275, 0.016066980616011625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3baec074-a14a-4411-8f62-2dc97efde38c", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 103.57894736842104, 83, 247, 84.0, 244.0, 247.0, 247.0, 0.09922655511512891, 0.07703624152004637, 0.035271939513580985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/188fd8ee-3e3e-411c-9175-b0bf09a8e7d6", 3, 0, 0.0, 466.6666666666667, 323, 678, 399.0, 678.0, 678.0, 678.0, 0.024310395124955433, 0.024381616985673076, 0.01558967395708405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f3fb62a-9e03-4a65-93c9-1f73f564f66a", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9208b162-9196-4e98-acce-ac4ea1bc2edd", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 83.00000000000001, 81, 89, 82.5, 87.0, 89.0, 89.0, 0.10836248800272454, 0.08053110680671229, 0.05439288948574259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 150.64285714285714, 79, 245, 82.5, 245.0, 245.0, 245.0, 0.10836248800272454, 0.04062081546642311, 0.061150427451314285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 189.49999999999997, 80, 948, 83.5, 596.0, 948.0, 948.0, 0.10836332675413135, 6.991800488118735, 0.0630406072216417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 201.57142857142858, 80, 481, 239.5, 363.0, 481.0, 481.0, 0.10822929148467396, 2.300159324146728, 0.0630683245719145], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 38.095238095238095, 0.6033182503770739], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 4.761904761904762, 0.07541478129713423], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.761904761904762, 0.07541478129713423], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.07541478129713423], "isController": false}, {"data": ["401/Unauthorized", 9, 42.857142857142854, 0.6787330316742082], "isController": false}, {"data": ["Assertion failed", 1, 4.761904761904762, 0.07541478129713423], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1326, 21, "401/Unauthorized", 9, "406/Not Acceptable", 8, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 57, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
