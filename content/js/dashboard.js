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

    var data = {"OkPercent": 98.65612648221344, "KoPercent": 1.3438735177865613};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7124915139171758, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bb5a029c-f899-4523-8b86-755c530e6255"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e56bd37f-3fc9-4b70-87dd-9227d79d326e"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea0d9f93-5de7-4add-87a3-7d91c1018a85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/46e4b0bd-6f96-4c1e-8350-31b552d130c8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9cfcabf8-c6cb-45ac-990a-b191f8de8e63"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cfcabf8-c6cb-45ac-990a-b191f8de8e63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67d6ad3b-f6f5-4ec6-b49e-180873434ff1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6086956521739131, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f060639-ce50-4fda-a4f8-b5a6d8ae48b4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/438e98eb-a175-4a7a-a26e-a3d92023bf91"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1dc76fdf-d993-4331-b10f-81952cb7f9de"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c03da79c-361d-4598-87e8-2e3f9d8ef509"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d31a31bd-8df2-4113-b619-5919571d6fb1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50c6ec4e-cf43-46ee-ada2-d8a3cd0a4e1b"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3e282a8-add7-4e72-b35b-cff941159618"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09f1b570-5b0a-439d-947f-1b1eef5bb539"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "register"], "isController": true}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24545454545454545, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/fe510387-97ae-45dc-bd86-fdd18c4cf950"], "isController": false}, {"data": [0.2962962962962963, 500, 1500, "addBook"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.34545454545454546, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/67d6ad3b-f6f5-4ec6-b49e-180873434ff1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9478527607361963, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46e4b0bd-6f96-4c1e-8350-31b552d130c8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=438e98eb-a175-4a7a-a26e-a3d92023bf91"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea0d9f93-5de7-4add-87a3-7d91c1018a85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c03da79c-361d-4598-87e8-2e3f9d8ef509"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1dc76fdf-d993-4331-b10f-81952cb7f9de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d31a31bd-8df2-4113-b619-5919571d6fb1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3f060639-ce50-4fda-a4f8-b5a6d8ae48b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/50c6ec4e-cf43-46ee-ada2-d8a3cd0a4e1b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dea4a3d4-28fc-4cf4-b59d-be1b7d4d0dc5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/09f1b570-5b0a-439d-947f-1b1eef5bb539"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3e282a8-add7-4e72-b35b-cff941159618"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1265, 17, 1.3438735177865613, 522.9486166007903, 137, 3456, 198.0, 1416.6000000000004, 1707.7, 2414.0399999999995, 4.944032767407685, 723.2707999598908, 3.6127934725576867], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2395.381818181818, 1712, 3113, 2334.0, 2854.6, 3031.4, 3113.0, 0.2367882897427618, 284.93652711629534, 1.164286170756646], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bb5a029c-f899-4523-8b86-755c530e6255", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.6048029119318181, 1.130075165719697], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 815.3846153846154, 159, 1639, 672.0, 1560.1999999999998, 1639.0, 1639.0, 0.1167626215903069, 0.02212104354347611, 0.07893230406333923], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 815.3846153846154, 159, 1639, 672.0, 1560.1999999999998, 1639.0, 1639.0, 0.11889518931772454, 0.02252506516370953, 0.08037393394457655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 201.9, 138, 439, 144.5, 431.7, 438.65, 439.0, 0.11448262439968174, 0.04782779952947641, 0.06432939656208679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 147.09999999999997, 139, 186, 145.0, 160.10000000000002, 184.74999999999997, 186.0, 0.11467166635131958, 0.0852198614192912, 0.05755980127400221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 261.3, 139, 1147, 146.0, 823.200000000001, 1132.9499999999998, 1147.0, 0.11448327971699733, 3.3939596832820067, 0.06643160625765607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 298.6, 138, 1715, 143.5, 1028.8000000000015, 1684.0499999999997, 1715.0, 0.11467692642901785, 10.346468111930415, 0.06643198511493495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e56bd37f-3fc9-4b70-87dd-9227d79d326e", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.7713428442028986, 1.4412552838164252], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 320.6428571428571, 156, 820, 254.0, 640.0, 820.0, 820.0, 0.08689607229753216, 0.17432554682456924, 0.056170891600253244], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 145.11111111111111, 139, 151, 145.0, 149.2, 151.0, 151.0, 0.11708611683893504, 0.08701419425237261, 0.05877174224141856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 173.99999999999997, 139, 413, 144.0, 412.1, 413.0, 413.0, 0.11708078574216209, 0.031328257122414466, 0.06677263561857681], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1138.142857142857, 851, 1319, 1173.0, 1319.0, 1319.0, 1319.0, 0.06889695967559374, 20.25799373898879, 0.039292797314987055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1442.5714285714287, 1236, 1706, 1363.0, 1706.0, 1706.0, 1706.0, 0.06877376379159585, 61.88275355105961, 0.03915537528369178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea0d9f93-5de7-4add-87a3-7d91c1018a85", 1, 0, 0.0, 697.0, 697, 697, 697.0, 697.0, 697.0, 697.0, 1.4347202295552368, 0.25920238522238165, 0.9891723457675754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 270.1428571428571, 148, 441, 150.0, 441.0, 441.0, 441.0, 0.06939694058630501, 0.12280005502186003, 0.038425845031674746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 210.5, 140, 517, 145.0, 508.1, 517.0, 517.0, 0.06355218587743325, 0.04722970063742842, 0.03190021830175849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 175.3, 141, 434, 146.5, 406.10000000000014, 434.0, 434.0, 0.06355097423643505, 0.017004850528108593, 0.03624391499421686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 201.0, 139, 434, 145.5, 432.4, 434.0, 434.0, 0.06354774341963117, 0.017128102718572465, 0.03735912259630661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 228.2, 138, 438, 147.5, 436.5, 438.0, 438.0, 0.06354895493743606, 0.01712842926048081, 0.037421894362572206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 146.71428571428572, 139, 153, 148.0, 153.0, 153.0, 153.0, 0.06960602987093052, 0.05172869993337709, 0.039085417163852595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46e4b0bd-6f96-4c1e-8350-31b552d130c8", 3, 0, 0.0, 648.6666666666666, 399, 820, 727.0, 820.0, 820.0, 820.0, 0.06692544505420961, 0.031066303596127248, 0.04291768449114353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1043.1176470588234, 140, 1992, 1366.0, 1990.4, 1992.0, 1992.0, 0.08370879188517123, 44.31594798668045, 0.0449800114484083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 189.6111111111111, 138, 425, 144.5, 415.1, 425.0, 425.0, 0.1170830704384761, 0.031557546329120514, 0.06883203945699475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 730.764705882353, 138, 1413, 880.0, 1301.0, 1413.0, 1413.0, 0.083707555345466, 14.487408167887812, 0.045061092666725755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 214.27777777777777, 138, 573, 145.5, 445.2000000000002, 573.0, 573.0, 0.11707850113501103, 0.03155631475904594, 0.0689436876800895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cfcabf8-c6cb-45ac-990a-b191f8de8e63", 3, 0, 0.0, 493.66666666666663, 336, 766, 379.0, 766.0, 766.0, 766.0, 0.01920319541171651, 0.026473155133014136, 0.01231454914097706], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 715.2307692307693, 154, 2245, 635.0, 1804.1999999999996, 2245.0, 2245.0, 0.11946004061641381, 0.022632078007406523, 0.08170700644624758], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cfcabf8-c6cb-45ac-990a-b191f8de8e63", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.28451033464566927, 1.0857529527559056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67d6ad3b-f6f5-4ec6-b49e-180873434ff1", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 471.59999999999997, 286, 942, 294.0, 934.5, 942.0, 942.0, 0.06349085414246078, 0.09839842336336452, 0.14279241903328826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 881.4782608695652, 181, 2471, 806.0, 1787.4000000000003, 2350.999999999998, 2471.0, 0.100289968822901, 0.061603896864848365, 0.0453459527001984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 160.1176470588235, 138, 416, 144.0, 206.3999999999998, 416.0, 416.0, 0.08371167728655984, 0.06221151017096879, 0.04201933801298023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 244.3529411764706, 139, 446, 147.0, 442.0, 446.0, 446.0, 0.08370673100595796, 0.09635314084888473, 0.043603667093406864], "isController": false}, {"data": ["login", 23, 0, 0.0, 3738.3043478260875, 1949, 5815, 3639.0, 5572.8, 5789.599999999999, 5815.0, 0.09994351018989267, 36.52533435585321, 0.20123221793116935], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 152.94444444444443, 142, 175, 149.0, 173.2, 175.0, 175.0, 0.11629559756554549, 0.09414946326351291, 0.0413394506971275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f060639-ce50-4fda-a4f8-b5a6d8ae48b4", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.28053425854037267, 1.0705793866459627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/438e98eb-a175-4a7a-a26e-a3d92023bf91", 3, 0, 0.0, 404.33333333333337, 245, 683, 285.0, 683.0, 683.0, 683.0, 0.0228173320454217, 0.026969314015926494, 0.014632208375482014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1dc76fdf-d993-4331-b10f-81952cb7f9de", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c03da79c-361d-4598-87e8-2e3f9d8ef509", 1, 0, 0.0, 848.0, 848, 848, 848.0, 848.0, 848.0, 848.0, 1.1792452830188678, 0.21304724351415094, 0.813034345518868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d31a31bd-8df2-4113-b619-5919571d6fb1", 3, 0, 0.0, 1208.0, 269, 2707, 648.0, 2707.0, 2707.0, 2707.0, 0.02566515527418941, 0.02574034615878176, 0.01645844918299256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50c6ec4e-cf43-46ee-ada2-d8a3cd0a4e1b", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1206.1176470588239, 283, 2139, 1507.0, 2134.2, 2139.0, 2139.0, 0.08364783278306182, 58.91919715455905, 0.17553647629814056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3e282a8-add7-4e72-b35b-cff941159618", 3, 0, 0.0, 430.6666666666667, 340, 566, 386.0, 566.0, 566.0, 566.0, 0.021065344699257096, 0.0211270595763057, 0.01350870086508349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 481.49999999999994, 280, 1862, 298.0, 1217.7000000000016, 1833.2999999999997, 1862.0, 0.1143831033279764, 13.843740080840258, 0.2543236813057975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 1274.111111111111, 148, 1855, 1502.0, 1855.0, 1855.0, 1855.0, 0.08830281980337905, 82.1703729322423, 0.16786733973038206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09f1b570-5b0a-439d-947f-1b1eef5bb539", 1, 0, 0.0, 838.0, 838, 838, 838.0, 838.0, 838.0, 838.0, 1.1933174224343677, 0.2155895733890215, 0.8227364260143198], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1564.3913043478262, 213, 2949, 1628.0, 2472.0, 2859.9999999999986, 2949.0, 0.10463153776516133, 0.032803977363194264, 0.047206807077641154], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 422.94444444444446, 288, 713, 301.5, 596.0000000000002, 713.0, 713.0, 0.11696970484644477, 0.1812801968665116, 0.2630676076771116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 153.07142857142856, 144, 188, 150.5, 172.5, 188.0, 188.0, 0.10036777620853557, 0.07792224813065017, 0.035677607949127874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 572.5714285714287, 283, 1044, 577.5, 962.0, 1044.0, 1044.0, 0.11300985607387616, 0.17514320467699362, 0.2541618149786492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 227.63636363636363, 140, 436, 151.0, 436.0, 436.0, 436.0, 0.05407291979019707, 0.040185050742519504, 0.027142071066563765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 171.54545454545453, 139, 441, 144.0, 384.6000000000002, 441.0, 441.0, 0.05407504633248288, 0.014469299506933896, 0.030839674861494144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 250.36363636363637, 141, 442, 148.0, 440.6, 442.0, 442.0, 0.05399488521178267, 0.014553308904738296, 0.03174308681395817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 196.36363636363635, 139, 435, 144.0, 433.2, 435.0, 435.0, 0.05407265398417146, 0.014574270019171214, 0.03184161167231971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 154.0, 154, 154, 154.0, 154.0, 154.0, 154.0, 6.493506493506494, 1.9150771103896105, 4.014052353896104], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1602.7454545454545, 1105, 2519, 1507.0, 2261.2, 2413.2, 2519.0, 0.23791705778789043, 284.63151446643855, 0.46979325278038525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1564.3913043478262, 213, 2949, 1628.0, 2472.0, 2859.9999999999986, 2949.0, 0.10080556797363277, 0.03160446305695076, 0.04548063711310384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 197.2, 139, 413, 145.0, 413.0, 413.0, 413.0, 0.0342353198948291, 0.009227488565403156, 0.020160056539630804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 252.6, 139, 424, 145.0, 424.0, 424.0, 424.0, 0.034173079814645214, 0.009210712918791093, 0.02009003325040666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 518.0714285714286, 140, 1601, 289.5, 1578.0, 1601.0, 1601.0, 0.10344776626716125, 19.96815373215526, 0.05891096287703016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 457.9285714285714, 140, 1208, 431.0, 1052.0, 1208.0, 1208.0, 0.10400647811777991, 6.575174048340725, 0.059330704383873056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 218.35714285714286, 141, 522, 150.5, 476.0, 522.0, 522.0, 0.1045751633986928, 0.07771650326797386, 0.05249183006535948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 142.0, 138, 151, 140.0, 151.0, 151.0, 151.0, 0.03423602314355165, 0.009160810880208156, 0.0195252319490568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 184.6428571428571, 138, 440, 143.0, 431.0, 440.0, 440.0, 0.10435690060005218, 0.061510589430136785, 0.05763797007193172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 200.8, 140, 414, 151.0, 414.0, 414.0, 414.0, 0.034232038449425586, 0.025440020761731318, 0.017182878674809325], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 633.4615384615386, 148, 936, 640.0, 885.5999999999999, 936.0, 936.0, 0.11389920796243078, 0.02133898923214411, 0.07751854147683465], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 208.2, 140, 427, 158.0, 427.0, 427.0, 427.0, 0.0374175877629521, 0.029451734118104873, 0.013300783150111878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1930.7826086956518, 1195, 3456, 1698.0, 3241.8, 3428.9999999999995, 3456.0, 0.09841930045272879, 0.050939676992135016, 0.04526903370433131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 456.6, 286, 839, 303.0, 839.0, 839.0, 839.0, 0.0341359841062858, 0.05290410818034723, 0.07677262831716425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe510387-97ae-45dc-bd86-fdd18c4cf950", 2, 0, 0.0, 412.5, 245, 580, 412.5, 580.0, 580.0, 580.0, 0.055052437446667955, 0.03239169293126703, 0.034219605893363425], "isController": false}, {"data": ["addBook", 54, 6, 11.11111111111111, 1480.0740740740732, 720, 3534, 1190.0, 2518.0, 2764.25, 3534.0, 0.2616177667532266, 87.99389342800426, 0.9495377480524011], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 260.3818181818183, 140, 719, 149.0, 572.4, 587.0, 719.0, 0.23905975624597944, 0.17766061963202182, 0.11556111263843732], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 910.6909090909094, 686, 1294, 860.0, 1149.8, 1238.0, 1294.0, 0.2389590076684118, 70.26188244031457, 0.12017957905198445], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 230.70909090909092, 138, 574, 147.0, 435.8, 438.2, 574.0, 0.23953869203163652, 0.4238712011341068, 0.11649440296069823], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1340.272727272727, 961, 1941, 1321.0, 1716.3999999999999, 1849.0, 1941.0, 0.23854030680620553, 214.6389873733568, 0.11973605243983364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67d6ad3b-f6f5-4ec6-b49e-180873434ff1", 3, 0, 0.0, 515.6666666666666, 247, 936, 364.0, 936.0, 936.0, 936.0, 0.019782263222794444, 0.02338196541730684, 0.012685891454721696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 151.42857142857144, 142, 172, 149.5, 164.0, 172.0, 172.0, 0.1054590103425158, 0.07878529581252403, 0.037487382582691166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 6, 3.6809815950920246, 221.58282208588957, 139, 1625, 154.0, 374.0, 420.79999999999995, 1496.999999999997, 0.6766152632780557, 1.5366372377078101, 0.32283051150868597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 175.36363636363635, 145, 429, 151.0, 374.0000000000002, 429.0, 429.0, 0.053835537327603926, 0.041690997168740154, 0.01913685115942171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46e4b0bd-6f96-4c1e-8350-31b552d130c8", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=438e98eb-a175-4a7a-a26e-a3d92023bf91", 1, 0, 0.0, 2245.0, 2245, 2245, 2245.0, 2245.0, 2245.0, 2245.0, 0.44543429844098, 0.08047396993318486, 0.30710606904231624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea0d9f93-5de7-4add-87a3-7d91c1018a85", 3, 0, 0.0, 426.0, 246, 640, 392.0, 640.0, 640.0, 640.0, 0.04532132821705895, 0.02913724714475632, 0.02906348196211137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 194.0, 141, 476, 150.5, 440.90000000000003, 474.29999999999995, 476.0, 0.11967878214871285, 0.09712213668513708, 0.04254206709192527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c03da79c-361d-4598-87e8-2e3f9d8ef509", 3, 0, 0.0, 380.0, 253, 609, 278.0, 609.0, 609.0, 609.0, 0.04826177185051721, 0.03102766907707405, 0.03094911801611943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 481.0909090909091, 284, 878, 303.0, 875.4, 878.0, 878.0, 0.0539554230105164, 0.08362036749774368, 0.12134701093087819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 809.3571428571428, 288, 1778, 588.5, 1742.5, 1778.0, 1778.0, 0.10333933685671264, 26.617931001155185, 0.22674680386193866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1dc76fdf-d993-4331-b10f-81952cb7f9de", 3, 0, 0.0, 490.33333333333337, 255, 810, 406.0, 810.0, 810.0, 810.0, 0.02448759703210324, 0.02455933803903323, 0.01570330929467558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d31a31bd-8df2-4113-b619-5919571d6fb1", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f060639-ce50-4fda-a4f8-b5a6d8ae48b4", 3, 0, 0.0, 965.3333333333334, 387, 1945, 564.0, 1945.0, 1945.0, 1945.0, 0.01765671808695345, 0.02434121129500256, 0.011322830283625747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 155.20000000000002, 145, 169, 152.5, 168.9, 169.0, 169.0, 0.0690216866139341, 0.05722598821799809, 0.024535052663546886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 152.8235294117647, 140, 164, 153.0, 164.0, 164.0, 164.0, 0.08420635510315279, 0.06537505108106101, 0.029932727790573842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50c6ec4e-cf43-46ee-ada2-d8a3cd0a4e1b", 3, 0, 0.0, 369.0, 230, 628, 249.0, 628.0, 628.0, 628.0, 0.07256016446970613, 0.033681899262305, 0.046531095053815454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dea4a3d4-28fc-4cf4-b59d-be1b7d4d0dc5", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.5632027116402117, 1.0523451278659612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09f1b570-5b0a-439d-947f-1b1eef5bb539", 3, 0, 0.0, 409.0, 257, 510, 460.0, 510.0, 510.0, 510.0, 0.05022349455075084, 0.03228886775316827, 0.032207123784172904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3e282a8-add7-4e72-b35b-cff941159618", 1, 0, 0.0, 1143.0, 1143, 1143, 1143.0, 1143.0, 1143.0, 1143.0, 0.8748906386701663, 0.15806129702537183, 0.6031960848643919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 189.00000000000003, 138, 451, 146.5, 447.5, 451.0, 451.0, 0.11355341065779868, 0.08438881397518047, 0.05699848933409035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 296.3571428571429, 138, 592, 282.5, 514.5, 592.0, 592.0, 0.11313679855184898, 0.030272932425006466, 0.06452333042410137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 225.57142857142858, 137, 439, 148.0, 433.0, 439.0, 439.0, 0.11354235941022854, 0.03060321405978816, 0.06675048863765388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 327.0714285714286, 142, 574, 413.5, 574.0, 574.0, 574.0, 0.11329335696309063, 0.030536100118958028, 0.06671474047728873], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 41.1764705882353, 0.5533596837944664], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07905138339920949], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07905138339920949], "isController": false}, {"data": ["401/Unauthorized", 8, 47.05882352941177, 0.6324110671936759], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1265, 17, "401/Unauthorized", 8, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
