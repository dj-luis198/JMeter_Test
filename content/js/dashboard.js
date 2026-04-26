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

    var data = {"OkPercent": 98.63325740318906, "KoPercent": 1.366742596810934};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7669934640522876, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6fd74e39-b1af-4076-b9b8-8ba96bf95ca0"], "isController": false}, {"data": [0.008928571428571428, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46da4943-5bc8-45e0-b883-7904c2bd4a19"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/39ab9a1f-11fe-4c03-9cbe-9abf66e16eb8"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37fb5749-9835-4131-ab46-e1b7ee255868"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c2cf86a-6265-474f-964c-081d21cc4b96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/657eecce-4742-46ad-bbfd-bf5030fa28fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69360475-c5eb-417f-817a-fa9464560a12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6db91990-91f7-4234-8213-08328917f83b"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fa60c36-c9e4-4582-ad74-735281cca881"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ae5c288-6492-43a0-9179-7422ba5d8585"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ff2a4c7-0742-4980-939c-7ccf4658d85b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b818867a-1a24-4f7b-b9cf-ea7161614637"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c46749c-ff5f-4432-ac91-7e8c3a8924d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8f551ee-055e-4bc7-9fcc-21ddd50f5397"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b894bfea-3115-455b-adeb-bbd4a01e0550"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37fb5749-9835-4131-ab46-e1b7ee255868"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39ab9a1f-11fe-4c03-9cbe-9abf66e16eb8"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6fd74e39-b1af-4076-b9b8-8ba96bf95ca0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46da4943-5bc8-45e0-b883-7904c2bd4a19"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3, 500, 1500, "addBook"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6db91990-91f7-4234-8213-08328917f83b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69360475-c5eb-417f-817a-fa9464560a12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=657eecce-4742-46ad-bbfd-bf5030fa28fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0c2cf86a-6265-474f-964c-081d21cc4b96"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8fa60c36-c9e4-4582-ad74-735281cca881"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b894bfea-3115-455b-adeb-bbd4a01e0550"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c46749c-ff5f-4432-ac91-7e8c3a8924d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b818867a-1a24-4f7b-b9cf-ea7161614637"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1b8c24a-fe13-45af-bfaf-78103ef2e2ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1317, 18, 1.366742596810934, 423.50797266514746, 117, 2579, 140.0, 1193.2000000000007, 1498.1, 1923.0199999999961, 5.200230594887427, 730.8353320773678, 3.8036650125563654], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6fd74e39-b1af-4076-b9b8-8ba96bf95ca0", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2106.2678571428573, 1464, 3091, 2057.5, 2627.7000000000003, 2824.2, 3091.0, 0.2501954652071931, 301.06948264548197, 1.2302091477716968], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/46da4943-5bc8-45e0-b883-7904c2bd4a19", 3, 0, 0.0, 415.6666666666667, 266, 500, 481.0, 500.0, 500.0, 500.0, 0.0211599906896041, 0.025010392641260575, 0.013569395071132837], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 471.92307692307696, 131, 897, 452.0, 770.5999999999999, 897.0, 897.0, 0.0764966871050123, 0.014492536424191783, 0.05171226617022278], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 471.92307692307696, 131, 897, 452.0, 770.5999999999999, 897.0, 897.0, 0.07558886634144071, 0.014320546943593263, 0.051098573332829404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 182.88235294117644, 122, 381, 126.0, 367.4, 381.0, 381.0, 0.10584316533325032, 0.037672578837593, 0.05984078775332316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 142.41176470588235, 123, 373, 127.0, 192.19999999999985, 373.0, 373.0, 0.1060101520310298, 0.07878293524962274, 0.053212127093700504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 205.47058823529414, 120, 1000, 125.0, 490.3999999999995, 1000.0, 1000.0, 0.10543681853703313, 1.8503895153937755, 0.061555284167731365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39ab9a1f-11fe-4c03-9cbe-9abf66e16eb8", 3, 0, 0.0, 422.6666666666667, 321, 537, 410.0, 537.0, 537.0, 537.0, 0.01771311833543923, 0.02441896359068526, 0.011358998411723721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 219.94117647058826, 122, 1001, 127.0, 493.79999999999956, 1001.0, 1001.0, 0.10543616460445933, 5.607431747526901, 0.061451937389524605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37fb5749-9835-4131-ab46-e1b7ee255868", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 260.07692307692304, 124, 368, 256.0, 356.0, 368.0, 368.0, 0.07579998134154306, 0.1750369160486053, 0.04899780945342383], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c2cf86a-6265-474f-964c-081d21cc4b96", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 138.42105263157893, 121, 389, 124.0, 128.0, 389.0, 389.0, 0.10291743854745578, 0.07648454173302133, 0.051659729895890884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 179.89473684210523, 118, 421, 126.0, 378.0, 421.0, 421.0, 0.10292134101090425, 0.043811397319711606, 0.05778745524275894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 859.8333333333333, 725, 1003, 854.0, 1003.0, 1003.0, 1003.0, 0.07725089804168973, 22.714328995480823, 0.04405715278940118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1396.5, 982, 1733, 1425.0, 1733.0, 1733.0, 1733.0, 0.07648866055607256, 68.82463122107772, 0.043547743265810845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 289.1666666666667, 120, 382, 367.0, 382.0, 382.0, 382.0, 0.07759356490701703, 0.13730423790187002, 0.042964405568631514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 128.2142857142857, 123, 146, 127.0, 137.5, 146.0, 146.0, 0.06948787436592314, 0.05164089100826906, 0.03487965568758252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 159.6428571428571, 121, 378, 125.5, 365.5, 378.0, 378.0, 0.06948959889610809, 0.02604890516655168, 0.0392139268324159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 241.99999999999994, 124, 1494, 127.0, 932.0, 1494.0, 1494.0, 0.06948959889610809, 4.483596305448978, 0.040425729268522705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 184.57142857142858, 121, 712, 125.5, 543.5, 712.0, 712.0, 0.06940347711420343, 1.475007854366718, 0.040443404562782885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/657eecce-4742-46ad-bbfd-bf5030fa28fb", 3, 0, 0.0, 371.3333333333333, 232, 544, 338.0, 544.0, 544.0, 544.0, 0.0197853944218378, 0.02727576346890725, 0.01268789941764989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 126.33333333333333, 121, 138, 124.5, 138.0, 138.0, 138.0, 0.07785534476941842, 0.057859294306179115, 0.043717600822671475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 869.7499999999998, 124, 1505, 1127.5, 1498.7, 1505.0, 1505.0, 0.08996547574868144, 50.60352645336415, 0.04805772972121948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 261.68421052631584, 119, 1745, 125.0, 872.0, 1745.0, 1745.0, 0.10292078349800658, 9.773062634744972, 0.059575136911726466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 607.4375000000001, 123, 1003, 741.5, 1002.3, 1003.0, 1003.0, 0.08996547574868144, 16.54211631833159, 0.048145586631130305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 215.68421052631578, 119, 747, 127.0, 616.0, 747.0, 747.0, 0.10291576615371281, 3.210150947637542, 0.05967273632709881], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 438.2307692307692, 233, 608, 433.0, 605.2, 608.0, 608.0, 0.07561216774268598, 0.014324961466876054, 0.0517164052957599], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 406.71428571428567, 249, 1619, 257.0, 1062.0, 1619.0, 1619.0, 0.06935877809649788, 6.026758206320071, 0.15472193942006154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69360475-c5eb-417f-817a-fa9464560a12", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6db91990-91f7-4234-8213-08328917f83b", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 492.49999999999994, 148, 1398, 378.0, 959.6999999999999, 1339.0499999999993, 1398.0, 0.09852746229085307, 0.060521263457955644, 0.044549038125649386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 126.75, 120, 137, 127.0, 132.8, 137.0, 137.0, 0.0899659816132025, 0.06685948438246787, 0.04515870561443954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 274.18750000000006, 124, 511, 361.0, 425.6000000000001, 511.0, 511.0, 0.08996547574868144, 0.10852524796734253, 0.046586126480213215], "isController": false}, {"data": ["login", 22, 0, 0.0, 2523.909090909091, 1521, 4057, 2416.0, 3865.4999999999995, 4048.75, 4057.0, 0.09526036389459007, 31.211173621214485, 0.18680807688810372], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 130.05263157894737, 124, 145, 129.0, 135.0, 145.0, 145.0, 0.09994476736540334, 0.08091231654874938, 0.035527241524420716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fa60c36-c9e4-4582-ad74-735281cca881", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ae5c288-6492-43a0-9179-7422ba5d8585", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.7143980704697986, 1.3348538870246085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ff2a4c7-0742-4980-939c-7ccf4658d85b", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b818867a-1a24-4f7b-b9cf-ea7161614637", 3, 0, 0.0, 333.6666666666667, 215, 451, 335.0, 451.0, 451.0, 451.0, 0.01797365062817909, 0.024778128388782045, 0.011526071529138282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 997.5625000000002, 248, 1633, 1259.5, 1623.2, 1633.0, 1633.0, 0.08990178230283416, 67.27336542054368, 0.18781483182747846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c46749c-ff5f-4432-ac91-7e8c3a8924d9", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 0.6316925262237763, 2.4106752622377625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8f551ee-055e-4bc7-9fcc-21ddd50f5397", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.8895151462395543, 1.6620604108635098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 405.2352941176471, 248, 1125, 270.0, 816.1999999999997, 1125.0, 1125.0, 0.10535187526337969, 7.567639196165191, 0.23535323283074291], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1176.625, 124, 1872, 1461.5, 1872.0, 1872.0, 1872.0, 0.10182651307834277, 91.37174433590022, 0.18907264287532616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b894bfea-3115-455b-adeb-bbd4a01e0550", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1200.9565217391305, 200, 2579, 1170.0, 1971.6000000000001, 2460.7999999999984, 2579.0, 0.09301497945582192, 0.029161965366074606, 0.04196574268416966], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/37fb5749-9835-4131-ab46-e1b7ee255868", 3, 0, 0.0, 317.3333333333333, 212, 494, 246.0, 494.0, 494.0, 494.0, 0.04120935727139109, 0.034354545563812684, 0.026426573510625145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 448.9473684210526, 246, 1873, 255.0, 1001.0, 1873.0, 1873.0, 0.10284613136157451, 13.09416371040424, 0.22853344968929643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 129.9090909090909, 124, 139, 129.0, 138.0, 139.0, 139.0, 0.08215454015863295, 0.06378208928331366, 0.029203371697014056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 381.7368421052631, 244, 750, 261.0, 509.0, 750.0, 750.0, 0.09681725996962995, 0.1500478433318386, 0.2177442868262283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 187.16666666666669, 122, 377, 126.0, 376.7, 377.0, 377.0, 0.05869721530627718, 0.04362166098445013, 0.02946325065178366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 206.75, 119, 377, 124.0, 376.7, 377.0, 377.0, 0.05869778953907561, 0.023053021835577708, 0.03306527499914399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39ab9a1f-11fe-4c03-9cbe-9abf66e16eb8", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 270.25, 121, 1366, 126.0, 1069.000000000001, 1366.0, 1366.0, 0.058697502421271974, 4.415845398421527, 0.034087351666519924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 197.08333333333331, 121, 745, 125.5, 634.6000000000004, 745.0, 745.0, 0.05869778953907561, 1.4527607374154383, 0.03414484046429951], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.7740731627296588, 1.6224778543307086], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1487.3214285714284, 958, 2556, 1452.0, 2088.4, 2231.6, 2556.0, 0.2410935313744484, 288.43168119685714, 0.47606554730384243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1200.9565217391305, 200, 2579, 1170.0, 1971.6000000000001, 2460.7999999999984, 2579.0, 0.0916378472277559, 0.028730208217125918, 0.041344419354710185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 172.25, 121, 479, 129.5, 479.0, 479.0, 479.0, 0.053145905440147745, 0.014324482325664823, 0.03129587986368075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 220.25, 122, 381, 136.0, 381.0, 381.0, 381.0, 0.05306095377064403, 0.014301585195993897, 0.03119403727532002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fd74e39-b1af-4076-b9b8-8ba96bf95ca0", 3, 0, 0.0, 442.6666666666667, 368, 487, 473.0, 487.0, 487.0, 487.0, 0.044623599934552054, 0.02921160789986464, 0.028616045530946467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 147.63636363636365, 121, 380, 125.0, 329.4000000000002, 380.0, 380.0, 0.07928785093884023, 0.02137055357335928, 0.046612584243341616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 192.00000000000003, 120, 386, 126.0, 382.40000000000003, 386.0, 386.0, 0.07929185168098726, 0.021371631898391096, 0.04669236969105011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 125.9090909090909, 120, 131, 127.0, 130.6, 131.0, 131.0, 0.07928785093884023, 0.058923881410602945, 0.03979878455328503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 188.0, 118, 374, 127.5, 374.0, 374.0, 374.0, 0.05305743467303356, 0.014197008887120308, 0.03025931821196445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 147.72727272727272, 119, 385, 124.0, 333.4000000000002, 385.0, 385.0, 0.07928785093884023, 0.02121569448949436, 0.045218852488557316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 215.25, 123, 367, 128.0, 367.0, 367.0, 367.0, 0.05314378715913243, 0.03949455276181619, 0.026675690038861395], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 498.92307692307696, 128, 847, 494.0, 756.9999999999999, 847.0, 847.0, 0.07693354716914137, 0.014413481568497487, 0.05236012149582488], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 157.625, 122, 360, 129.5, 360.0, 360.0, 360.0, 0.05711266901780488, 0.044953917215186254, 0.020301769064922825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1335.090909090909, 956, 2547, 1294.5, 1590.9, 2404.349999999998, 2547.0, 0.09748532181234075, 0.05045627007865293, 0.04483944001329345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46da4943-5bc8-45e0-b883-7904c2bd4a19", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.2971448396381579, 1.1339689555921053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 451.25, 251, 837, 265.5, 837.0, 837.0, 837.0, 0.05301208012775911, 0.08215837027612667, 0.11922541067795825], "isController": false}, {"data": ["addBook", 60, 7, 11.666666666666666, 1266.0666666666666, 643, 3533, 989.5, 2185.2999999999997, 2784.549999999998, 3533.0, 0.2928686484111876, 88.71494251690096, 1.0658006830551081], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 251.60714285714286, 120, 793, 128.0, 505.90000000000003, 546.9, 793.0, 0.2419853166766774, 0.17983479100678854, 0.11697532397944853], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 789.7321428571429, 593, 1143, 742.5, 1008.3, 1106.1499999999999, 1143.0, 0.24222186657900543, 71.22127129714134, 0.12182056766424589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6db91990-91f7-4234-8213-08328917f83b", 3, 0, 0.0, 314.3333333333333, 228, 464, 251.0, 464.0, 464.0, 464.0, 0.018181267234326233, 0.025064344641071483, 0.01165921108451259], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 192.64285714285717, 122, 493, 128.0, 379.6, 386.79999999999995, 493.0, 0.24272265469234905, 0.4295053225610707, 0.11804285355155256], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1234.0535714285716, 834, 1793, 1203.0, 1613.9, 1726.95, 1793.0, 0.24195917803010664, 217.7152937103576, 0.12145216553464337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 132.42105263157896, 123, 146, 130.0, 145.0, 146.0, 146.0, 0.09583375365681429, 0.07159455229244427, 0.0340659046201957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 7, 3.977272727272727, 208.84659090909085, 119, 1631, 132.0, 335.3, 425.25000000000045, 1336.859999999996, 0.7154733303250932, 1.5169746428731132, 0.34489400145737037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 131.58333333333337, 127, 142, 129.0, 141.4, 142.0, 142.0, 0.05958558227527546, 0.046143912836224064, 0.021180812449414325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69360475-c5eb-417f-817a-fa9464560a12", 3, 0, 0.0, 380.6666666666667, 230, 600, 312.0, 600.0, 600.0, 600.0, 0.04645976584278015, 0.029869152844886327, 0.02979353473641826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=657eecce-4742-46ad-bbfd-bf5030fa28fb", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 144.64705882352942, 121, 374, 130.0, 190.79999999999984, 374.0, 374.0, 0.1050426658592799, 0.08524458528228672, 0.037339385129665906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 480.25, 248, 1743, 254.0, 1446.000000000001, 1743.0, 1743.0, 0.05866106127636693, 5.9315890196881185, 0.1306793531395889], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c2cf86a-6265-474f-964c-081d21cc4b96", 3, 0, 0.0, 479.3333333333333, 206, 725, 507.0, 725.0, 725.0, 725.0, 0.023599933920185025, 0.02789432293756244, 0.015134072207931152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 343.3636363636364, 248, 512, 255.0, 511.4, 512.0, 512.0, 0.07921476563231386, 0.12276741509617392, 0.17815586450314339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fa60c36-c9e4-4582-ad74-735281cca881", 3, 0, 0.0, 377.3333333333333, 215, 622, 295.0, 622.0, 622.0, 622.0, 0.0225392746861406, 0.02260530771744765, 0.014453896852765945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 152.07142857142856, 129, 378, 131.5, 267.5, 378.0, 378.0, 0.06991679900917908, 0.057968127303508823, 0.024853237147794124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 159.18749999999997, 120, 371, 129.0, 367.5, 371.0, 371.0, 0.08946244254833767, 0.06945570490813326, 0.03180110262460441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b894bfea-3115-455b-adeb-bbd4a01e0550", 3, 0, 0.0, 610.0, 256, 847, 727.0, 847.0, 847.0, 847.0, 0.12075836251660427, 0.054640014289739566, 0.07743944471279636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c46749c-ff5f-4432-ac91-7e8c3a8924d9", 3, 0, 0.0, 320.3333333333333, 240, 446, 275.0, 446.0, 446.0, 446.0, 0.0647542575924367, 0.029299615251786138, 0.041525353989941505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b818867a-1a24-4f7b-b9cf-ea7161614637", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 137.6315789473684, 118, 374, 125.0, 129.0, 374.0, 374.0, 0.09687995553719936, 0.07199770133184444, 0.04862919643175827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1b8c24a-fe13-45af-bfaf-78103ef2e2ae", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.8403577302631579, 1.5702097039473684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 187.94736842105266, 119, 376, 125.0, 371.0, 376.0, 376.0, 0.09688193151977156, 0.025923485582438874, 0.055252976569869716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 164.05263157894737, 117, 379, 126.0, 375.0, 379.0, 379.0, 0.09688143751657183, 0.0261125749556385, 0.056955688852515854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 214.47368421052633, 121, 383, 126.0, 377.0, 383.0, 383.0, 0.09688143751657183, 0.0261125749556385, 0.05705029963134063], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 38.888888888888886, 0.5315110098709187], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07593014426727411], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07593014426727411], "isController": false}, {"data": ["401/Unauthorized", 9, 50.0, 0.683371298405467], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1317, 18, "401/Unauthorized", 9, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
