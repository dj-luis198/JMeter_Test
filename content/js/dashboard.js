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

    var data = {"OkPercent": 96.10951008645533, "KoPercent": 3.8904899135446684};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7846153846153846, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/96c5bd48-c8d9-436e-8b2f-d748c400a296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31b651a0-31ab-4a8e-920d-fb31133dcea5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0dc66a81-c8b2-47e5-86f5-4c474e99e2dc"], "isController": false}, {"data": [0.3474576271186441, 500, 1500, "see books"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c7f45b84-44d6-40a8-b3fe-2ee6bd908af1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c1f4a65-ec45-48ca-ae33-fa91870c81e0"], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.18518518518518517, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7f45b84-44d6-40a8-b3fe-2ee6bd908af1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31b651a0-31ab-4a8e-920d-fb31133dcea5"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c1fe9bf-babf-44af-a19b-750c89f7ce5a"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a81d2221-1423-44b4-a786-568d37d7a6a3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c1f4a65-ec45-48ca-ae33-fa91870c81e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.29310344827586204, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0dc66a81-c8b2-47e5-86f5-4c474e99e2dc"], "isController": false}, {"data": [0.847457627118644, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55b92acc-0908-4630-8cb8-3c847f1f93de"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.88, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a81d2221-1423-44b4-a786-568d37d7a6a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55b92acc-0908-4630-8cb8-3c847f1f93de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/057cdfec-c4f6-4649-8b6c-86f1c813d7b9"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0693fab6-ef36-4c1e-a4c4-d61725e9d8ee"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=057cdfec-c4f6-4649-8b6c-86f1c813d7b9"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c1fe9bf-babf-44af-a19b-750c89f7ce5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5139f807-d46b-4e60-8d61-c8f51e79a2a8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0693fab6-ef36-4c1e-a4c4-d61725e9d8ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5139f807-d46b-4e60-8d61-c8f51e79a2a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96c5bd48-c8d9-436e-8b2f-d748c400a296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fa6c522c-a42e-4959-a64e-918a054c8e64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.18518518518518517, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa6c522c-a42e-4959-a64e-918a054c8e64"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1388, 54, 3.8904899135446684, 301.474783861671, 77, 2066, 92.0, 852.1000000000001, 1004.6499999999999, 1497.6499999999985, 5.465363064698401, 785.4990541498663, 4.012218622889948], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/96c5bd48-c8d9-436e-8b2f-d748c400a296", 3, 0, 0.0, 808.6666666666666, 178, 1795, 453.0, 1795.0, 1795.0, 1795.0, 0.08574858514834506, 0.038799001743554565, 0.054988513262447844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31b651a0-31ab-4a8e-920d-fb31133dcea5", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0dc66a81-c8b2-47e5-86f5-4c474e99e2dc", 3, 0, 0.0, 336.3333333333333, 218, 411, 380.0, 411.0, 411.0, 411.0, 0.0214987494894047, 0.025788701780096457, 0.013786632973348716], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1366.9830508474581, 1051, 1871, 1339.0, 1636.0, 1789.0, 1871.0, 0.2640707172429227, 317.76606820661294, 1.2984336536309724], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 320.1176470588235, 160, 1383, 168.0, 911.7999999999996, 1383.0, 1383.0, 0.09444444444444444, 13.42190212673611, 0.20956488715277777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 85.58333333333334, 83, 89, 85.5, 88.7, 89.0, 89.0, 0.05850490709908293, 0.04542129017946381, 0.02079666619537714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7f45b84-44d6-40a8-b3fe-2ee6bd908af1", 3, 0, 0.0, 537.0, 181, 1135, 295.0, 1135.0, 1135.0, 1135.0, 0.028634424304899347, 0.02359170830589201, 0.018362570273649646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 220.7058823529412, 162, 325, 165.0, 325.0, 325.0, 325.0, 0.09534759808183067, 0.1477701544490872, 0.21443898279536724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 114.10000000000001, 81, 236, 84.5, 235.9, 236.0, 236.0, 0.05287060975674233, 0.03929153713367276, 0.0265385677880523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 112.5, 79, 240, 81.0, 239.9, 240.0, 240.0, 0.05282759713674423, 0.014135509390105392, 0.030128238992049448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 112.2, 77, 241, 81.0, 241.0, 241.0, 241.0, 0.052827318062716594, 0.014238613071591582, 0.031056685032964246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 112.30000000000001, 79, 241, 82.0, 240.2, 241.0, 241.0, 0.05287200744437865, 0.014250658256492682, 0.031134590321250318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 91.4, 80, 105, 89.0, 105.0, 105.0, 105.0, 0.04378360391600553, 0.012912742561165695, 0.02706545046760889], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c1f4a65-ec45-48ca-ae33-fa91870c81e0", 3, 0, 0.0, 265.0, 169, 441, 185.0, 441.0, 441.0, 441.0, 0.02088031403992316, 0.02467982430955762, 0.01339004513627885], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 934.5762711864404, 636, 1511, 877.0, 1286.0, 1447.0, 1511.0, 0.2632013311741902, 314.8802956721225, 0.5197198160490357], "isController": false}, {"data": ["deleteBook", 17, 5, 29.41176470588235, 387.1764705882353, 82, 778, 437.0, 687.5999999999999, 778.0, 778.0, 0.10144166507542486, 0.021735834715724652, 0.0675209428555232], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, 29.41176470588235, 387.1764705882353, 82, 778, 437.0, 687.5999999999999, 778.0, 778.0, 0.09991830209417006, 0.02140942479384503, 0.06650697187299795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 13, 48.148148148148145, 984.8888888888889, 115, 2066, 954.0, 1720.0, 1949.9999999999993, 2066.0, 0.10640394088669951, 0.03269704433497537, 0.04800646551724138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 23, 0, 0.0, 129.91304347826087, 78, 249, 81.0, 242.6, 247.79999999999998, 249.0, 0.11649521609862587, 0.031171571495140125, 0.06643867793124757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 129.7142857142857, 79, 251, 84.0, 251.0, 251.0, 251.0, 0.04239418109582902, 0.011426556623485165, 0.024964542188266502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 23, 0, 0.0, 102.65217391304348, 79, 244, 82.0, 242.8, 244.0, 244.0, 0.11649344597743065, 0.08657374256721165, 0.05847424925039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 107.42857142857143, 79, 256, 82.0, 256.0, 256.0, 256.0, 0.042394437849754114, 0.011426625826691537, 0.024923292564015598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 23, 0, 0.0, 143.73913043478262, 78, 248, 82.0, 242.0, 246.79999999999998, 248.0, 0.11649639620930857, 0.031399419290790195, 0.0686009051896612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 23, 0, 0.0, 135.82608695652175, 78, 245, 81.0, 244.0, 244.8, 245.0, 0.11649580615097856, 0.031399260251630944, 0.06848679228797763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 168.83333333333334, 78, 968, 82.0, 750.2000000000007, 968.0, 968.0, 0.057497424594523366, 4.325562883316164, 0.03339043147025706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 203.25, 78, 643, 164.5, 547.9000000000003, 643.0, 643.0, 0.057496047146758655, 1.4230178088016865, 0.03344578002970629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 82.16666666666667, 79, 84, 82.5, 84.0, 84.0, 84.0, 0.05749770009199632, 0.042730224384774605, 0.02886115024149034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 81.57142857142858, 78, 90, 80.0, 90.0, 90.0, 90.0, 0.042394437849754114, 0.011343824190266236, 0.02417807783618789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 135.66666666666669, 78, 244, 85.5, 243.1, 244.0, 244.0, 0.057498526600255874, 0.02258202224713825, 0.032389713633379814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 106.0, 80, 253, 81.0, 253.0, 253.0, 253.0, 0.042394437849754114, 0.03150602265982703, 0.021280020561302355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7f45b84-44d6-40a8-b3fe-2ee6bd908af1", 1, 0, 0.0, 1014.0, 1014, 1014, 1014.0, 1014.0, 1014.0, 1014.0, 0.9861932938856016, 0.1781696868836292, 0.6799340483234714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31b651a0-31ab-4a8e-920d-fb31133dcea5", 3, 0, 0.0, 315.0, 204, 461, 280.0, 461.0, 461.0, 461.0, 0.02568163335188118, 0.02575687251209177, 0.016469016179429013], "isController": false}, {"data": ["deleteAccount", 17, 5, 29.41176470588235, 411.4117647058823, 80, 1135, 452.0, 901.3999999999997, 1135.0, 1135.0, 0.10112727164569763, 0.020855176080425926, 0.06880465334166147], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 86.42857142857143, 82, 96, 86.0, 96.0, 96.0, 96.0, 0.04029751076519216, 0.031718548512446175, 0.014324505779814402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c1fe9bf-babf-44af-a19b-750c89f7ce5a", 3, 0, 0.0, 288.6666666666667, 188, 487, 191.0, 487.0, 487.0, 487.0, 0.039116998943841026, 0.032610232517961225, 0.025084794244585557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1378.75, 768, 2041, 1404.0, 1966.5, 2040.25, 2041.0, 0.10702627495050035, 0.05539445871461444, 0.04922790576336491], "isController": false}, {"data": ["goToProfile", 18, 6, 33.333333333333336, 280.16666666666663, 79, 1795, 186.0, 660.1000000000017, 1795.0, 1795.0, 0.09345212136315495, 0.1365226384519137, 0.06038491565946047], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 237.42857142857144, 161, 509, 165.0, 509.0, 509.0, 509.0, 0.0423733943510212, 0.06567048519049867, 0.09529875702187678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a81d2221-1423-44b4-a786-568d37d7a6a3", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c1f4a65-ec45-48ca-ae33-fa91870c81e0", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 102.4705882352941, 78, 244, 83.0, 242.4, 244.0, 244.0, 0.09457001240536045, 0.07028103460984307, 0.04746971325815945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 99.29411764705883, 78, 240, 81.0, 238.4, 240.0, 240.0, 0.09448906428035461, 0.041979459050107, 0.05295469388322264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 12, 0, 0.0, 551.4166666666666, 464, 680, 519.5, 672.2, 680.0, 680.0, 0.07015615591036381, 20.628239241261173, 0.04001093266762937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 12, 0, 0.0, 831.6666666666666, 557, 957, 876.5, 954.0, 957.0, 957.0, 0.06999288405678757, 62.979720108663955, 0.03984946426279995], "isController": false}, {"data": ["addBook", 58, 20, 34.48275862068966, 796.1896551724136, 416, 2003, 677.0, 1450.9, 1546.9499999999996, 2003.0, 0.266197913559112, 67.00236264990843, 0.9686785740512109], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 12, 0, 0.0, 160.91666666666669, 78, 243, 160.0, 243.0, 243.0, 243.0, 0.0703152466893238, 0.1244250263682175, 0.038934321164889256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 98.27272727272727, 81, 241, 83.0, 212.0000000000001, 241.0, 241.0, 0.0632209341755128, 0.04698352627691919, 0.031733945474817955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 110.72727272727273, 78, 238, 83.0, 237.0, 238.0, 238.0, 0.06322275099432144, 0.01691702516840242, 0.03605672517644895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 112.63636363636363, 80, 243, 83.0, 242.2, 243.0, 243.0, 0.06322202425426748, 0.01704031122478303, 0.03716763535260647], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 145.20338983050848, 80, 506, 84.0, 333.0, 344.0, 506.0, 0.2643132335812203, 0.19642809644073111, 0.12776860412373442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 112.27272727272727, 79, 242, 82.0, 241.4, 242.0, 242.0, 0.063222387622206, 0.01704040916379771, 0.03722958958612326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0dc66a81-c8b2-47e5-86f5-4c474e99e2dc", 1, 0, 0.0, 821.0, 821, 821, 821.0, 821.0, 821.0, 821.0, 1.2180267965895248, 0.22005366930572473, 0.8397723812423874], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 502.3559322033899, 384, 744, 476.0, 642.0, 673.0, 744.0, 0.26400454624777947, 77.6261023727968, 0.13277572394297502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 12, 0, 0.0, 94.33333333333333, 78, 236, 82.0, 191.00000000000017, 236.0, 236.0, 0.07031483467224497, 0.05225545818904143, 0.03948342767240318], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 111.10169491525423, 79, 339, 84.0, 241.0, 249.0, 339.0, 0.26466537773132426, 0.4683336566886324, 0.1287142169044917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 206.52941176470586, 79, 1276, 81.0, 824.7999999999996, 1276.0, 1276.0, 0.09448906428035461, 10.024992270655588, 0.054593922824667206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 465.5, 79, 1115, 83.5, 961.8, 1107.35, 1115.0, 0.09373652537447741, 37.96882634400602, 0.05148185729551377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55b92acc-0908-4630-8cb8-3c847f1f93de", 3, 0, 0.0, 304.6666666666667, 204, 412, 298.0, 412.0, 412.0, 412.0, 0.05454148789178969, 0.035064921414806195, 0.03497614946185732], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 786.406779661017, 540, 1129, 790.0, 964.0, 1116.0, 1129.0, 0.2636506227070216, 237.23329376013825, 0.13234025397598545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 94.41176470588235, 82, 239, 84.0, 125.39999999999989, 239.0, 239.0, 0.09404215301211484, 0.07025610063893345, 0.0334290465785252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 154.7058823529412, 78, 632, 81.0, 628.0, 632.0, 632.0, 0.0945721168021273, 3.2939433513020355, 0.054734264520992226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 316.29999999999995, 79, 708, 165.0, 642.5, 704.75, 708.0, 0.09373828271466067, 12.416871352994937, 0.051574363751406074], "isController": false}, {"data": ["deleteBooks", 17, 5, 29.41176470588235, 402.2352941176471, 80, 1014, 402.0, 930.8, 1014.0, 1014.0, 0.10007122716757222, 0.02144219194250025, 0.06689618971444382], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 20, 11.428571428571429, 132.79999999999995, 80, 527, 86.0, 276.6, 330.59999999999997, 526.24, 0.738200393988096, 1.686474824202849, 0.3501343788360056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 86.3, 82, 102, 84.5, 100.7, 102.0, 102.0, 0.05246121804456056, 0.04062670498958645, 0.018648323601777386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a81d2221-1423-44b4-a786-568d37d7a6a3", 3, 0, 0.0, 315.3333333333333, 209, 452, 285.0, 452.0, 452.0, 452.0, 0.02154398563734291, 0.025464261669658886, 0.01381564183123878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 226.27272727272725, 164, 482, 167.0, 453.4000000000001, 482.0, 482.0, 0.06319151625170903, 0.0979345080971311, 0.14211920110125578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55b92acc-0908-4630-8cb8-3c847f1f93de", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 94.52173913043478, 81, 246, 86.0, 104.0, 217.9999999999996, 246.0, 0.11008629808497705, 0.08933761104357024, 0.03913223877239419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/057cdfec-c4f6-4649-8b6c-86f1c813d7b9", 3, 0, 0.0, 563.0, 312, 843, 534.0, 843.0, 843.0, 843.0, 0.07157854552395496, 0.0323874278249666, 0.045901606341859136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 542.3749999999999, 106, 1333, 604.0, 949.0, 1251.5, 1333.0, 0.10612096906131582, 0.06518563431598402, 0.04798243034705978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 82.2, 80, 90, 81.5, 84.0, 89.69999999999999, 90.0, 0.09373696470334594, 0.06966194349535768, 0.047051562360859195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 121.14999999999996, 79, 243, 81.5, 241.9, 242.95, 243.0, 0.09373652537447741, 0.08843638394949475, 0.04991653055342044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0693fab6-ef36-4c1e-a4c4-d61725e9d8ee", 1, 0, 0.0, 910.0, 910, 910, 910.0, 910.0, 910.0, 910.0, 1.098901098901099, 0.19853193681318682, 0.7576407967032966], "isController": false}, {"data": ["login", 24, 0, 0.0, 2552.625, 1211, 4013, 2498.0, 3636.5, 4008.5, 4013.0, 0.1060806301189429, 63.59166015633633, 0.24800491064916927], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 244.5, 163, 477, 168.0, 477.0, 477.0, 477.0, 0.052803049904162465, 0.08183441425576742, 0.1187552968059435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 89.3529411764706, 82, 114, 85.0, 106.8, 114.0, 114.0, 0.0891550721369422, 0.07217729961086433, 0.03169184204867867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=057cdfec-c4f6-4649-8b6c-86f1c813d7b9", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 339.58333333333337, 165, 1049, 324.0, 857.0000000000007, 1049.0, 1049.0, 0.0574729158883876, 5.811448163321264, 0.1280325194928973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c1fe9bf-babf-44af-a19b-750c89f7ce5a", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.277092120398773, 1.0574434432515336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5139f807-d46b-4e60-8d61-c8f51e79a2a8", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 0.9765625, 3.7267736486486487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0693fab6-ef36-4c1e-a4c4-d61725e9d8ee", 3, 0, 0.0, 660.0, 183, 1322, 475.0, 1322.0, 1322.0, 1322.0, 0.025622411068881582, 0.025697476726309947, 0.016431038348208568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5139f807-d46b-4e60-8d61-c8f51e79a2a8", 3, 0, 0.0, 352.3333333333333, 219, 469, 369.0, 469.0, 469.0, 469.0, 0.0726797005596337, 0.032885671802698836, 0.04660775068440051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 85.72727272727272, 80, 94, 85.0, 92.60000000000001, 94.0, 94.0, 0.0642703561746284, 0.05328665272681593, 0.02284610317144994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 557.35, 162, 1196, 249.0, 1044.8, 1188.4499999999998, 1196.0, 0.09370095340720092, 50.524382195940404, 0.1999472200098386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 102.14999999999998, 81, 241, 85.0, 223.00000000000028, 240.75, 241.0, 0.09179322657781083, 0.07126524914976524, 0.03262962351008119], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96c5bd48-c8d9-436e-8b2f-d748c400a296", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 0, 0.0, 289.5652173913044, 162, 485, 323.0, 483.4, 485.0, 485.0, 0.11644626258125924, 0.18046896359029144, 0.2618903737545313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 23, 11, 47.82608695652174, 522.7391304347826, 79, 1184, 639.0, 1026.6000000000001, 1155.7999999999995, 1184.0, 0.12535494525259022, 78.26026539481357, 0.18710630712506607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa6c522c-a42e-4959-a64e-918a054c8e64", 3, 0, 0.0, 310.6666666666667, 187, 549, 196.0, 549.0, 549.0, 549.0, 0.02473553589538517, 0.024808003285703685, 0.01586230654749635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 82.41176470588235, 80, 92, 82.0, 87.19999999999999, 92.0, 92.0, 0.09547772560824927, 0.07095561444128681, 0.04792534273695325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 99.05882352941178, 78, 240, 81.0, 233.6, 240.0, 240.0, 0.0954846971730913, 0.02554961623576857, 0.05445611635652863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 118.17647058823529, 79, 243, 81.0, 242.2, 243.0, 243.0, 0.09539789339004832, 0.025712713452786463, 0.056083527168758876], "isController": false}, {"data": ["register", 27, 13, 48.148148148148145, 984.8888888888889, 115, 2066, 954.0, 1720.0, 1949.9999999999993, 2066.0, 0.1082693742030171, 0.03327027644780213, 0.04884809656425186], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 117.76470588235294, 79, 244, 81.0, 240.8, 244.0, 244.0, 0.0954846971730913, 0.025736109784934763, 0.05622780507360747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa6c522c-a42e-4959-a64e-918a054c8e64", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 13, 24.074074074074073, 0.9365994236311239], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 11.11111111111111, 0.4322766570605187], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 9.25925925925926, 0.36023054755043227], "isController": false}, {"data": ["401/Unauthorized", 30, 55.55555555555556, 2.161383285302594], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1388, 54, "401/Unauthorized", 30, "406/Not Acceptable", 13, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 13, "406/Not Acceptable", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 20, "401/Unauthorized", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 23, 11, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
