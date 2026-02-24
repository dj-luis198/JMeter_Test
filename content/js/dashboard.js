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

    var data = {"OkPercent": 96.3917525773196, "KoPercent": 3.6082474226804124};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7903834066624764, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1295bdef-e35b-4644-b949-1fa4710daaf1"], "isController": false}, {"data": [0.2807017543859649, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5475fb6d-1e55-4317-b5a0-25960bb0c9a3"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd85bd1d-fe25-4da6-9706-7402b1f3313b"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d12c2c8-d2d8-4dcd-ad48-2a3d600e63e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57acabaa-dd8c-4a3e-95bc-59af18016a68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da0853ae-717e-49d5-b2be-2365df6632e6"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/314e935b-244c-47b6-aafe-9a27a133c69f"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ce70dd98-858b-4eb8-9064-0f53826c48be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aac66b51-cdc1-4fb5-bdf4-01b1ca819a05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d12c2c8-d2d8-4dcd-ad48-2a3d600e63e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71782e57-60f0-4df0-8044-5c26622238f1"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a45aac0a-6d13-4f43-bd8f-e2fb1d859200"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04a6ce6e-73d9-40cc-ae93-29e949e2d3fd"], "isController": false}, {"data": [0.26, 500, 1500, "register"], "isController": true}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71782e57-60f0-4df0-8044-5c26622238f1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04a29d9d-47c6-4314-9cdd-10b3bd8fec09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da0853ae-717e-49d5-b2be-2365df6632e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.26, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1295bdef-e35b-4644-b949-1fa4710daaf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5475fb6d-1e55-4317-b5a0-25960bb0c9a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce70dd98-858b-4eb8-9064-0f53826c48be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/05296e8b-53aa-442f-b5fe-c80d8b071019"], "isController": false}, {"data": [0.3416666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7c18fde7-2f5d-42f5-801b-7d67e080bb32"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7719298245614035, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8926553672316384, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=314e935b-244c-47b6-aafe-9a27a133c69f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a45aac0a-6d13-4f43-bd8f-e2fb1d859200"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dd85bd1d-fe25-4da6-9706-7402b1f3313b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aac66b51-cdc1-4fb5-bdf4-01b1ca819a05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04a29d9d-47c6-4314-9cdd-10b3bd8fec09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04a6ce6e-73d9-40cc-ae93-29e949e2d3fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1358, 49, 3.6082474226804124, 310.8247422680414, 97, 1920, 115.0, 791.0, 909.0999999999999, 1304.2300000000002, 5.382011873716917, 752.6153182986423, 3.9351379388242007], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1295bdef-e35b-4644-b949-1fa4710daaf1", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1465.8947368421057, 1201, 2106, 1423.0, 1720.8, 1750.4999999999995, 2106.0, 0.2604999771491248, 313.46937250782645, 1.2808763524861753], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5475fb6d-1e55-4317-b5a0-25960bb0c9a3", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["deleteBook", 17, 5, 29.41176470588235, 436.1764705882353, 101, 930, 455.0, 749.1999999999998, 930.0, 930.0, 0.09078771695594125, 0.019453020694259013, 0.06042953104138852], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, 29.41176470588235, 436.1764705882353, 101, 930, 455.0, 749.1999999999998, 930.0, 930.0, 0.08784576350886984, 0.018822650384196032, 0.058471327078198236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 172.42857142857144, 98, 301, 105.0, 300.5, 301.0, 301.0, 0.07674849518129091, 0.02876997859265188, 0.043310220843794885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 102.35714285714288, 99, 108, 102.0, 106.5, 108.0, 108.0, 0.07674765371458644, 0.057036098121875274, 0.03852372461845452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 184.71428571428572, 98, 488, 101.5, 394.5, 488.0, 488.0, 0.0767489159215626, 1.6311178993547608, 0.04472380326511816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd85bd1d-fe25-4da6-9706-7402b1f3313b", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 216.5, 99, 911, 102.0, 609.5, 911.0, 911.0, 0.07674933666644738, 4.952007894560117, 0.044649097921189394], "isController": false}, {"data": ["goToProfile", 17, 5, 29.41176470588235, 180.76470588235293, 99, 271, 192.0, 255.79999999999998, 271.0, 271.0, 0.09119927040583675, 0.1397065110243824, 0.05893270868538934], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d12c2c8-d2d8-4dcd-ad48-2a3d600e63e8", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57acabaa-dd8c-4a3e-95bc-59af18016a68", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.6867439516129031, 1.283182123655914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 105.57142857142858, 100, 155, 102.0, 113.0, 150.89999999999995, 155.0, 0.09412524035552447, 0.06995049600640052, 0.047246458537831625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 664.625, 494, 835, 693.5, 835.0, 835.0, 835.0, 0.038146645240967586, 11.216380288674737, 0.021755508613989328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 158.76190476190473, 99, 508, 102.0, 315.2, 488.9999999999997, 508.0, 0.09403588588521353, 0.038613135805730815, 0.052877694016183134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 770.0, 688, 894, 719.0, 894.0, 894.0, 894.0, 0.038112116318179005, 34.29334925705193, 0.02169859747411949], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 244.625, 100, 410, 301.5, 410.0, 410.0, 410.0, 0.038257010597191936, 0.0676969757833123, 0.021183325203718583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 139.8571428571429, 100, 423, 104.5, 361.0, 423.0, 423.0, 0.09759157924087693, 0.07252655449444076, 0.0489863981736433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 185.49999999999997, 99, 304, 101.5, 302.5, 304.0, 304.0, 0.09759498082955734, 0.036584502439874524, 0.05507417654234926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 200.07142857142856, 99, 691, 102.5, 497.0, 691.0, 691.0, 0.09759498082955734, 6.297007069100732, 0.05677609794353434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da0853ae-717e-49d5-b2be-2365df6632e6", 3, 0, 0.0, 362.66666666666663, 194, 623, 271.0, 623.0, 623.0, 623.0, 0.023950374823365986, 0.028308532221237595, 0.01535880156316113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 200.42857142857142, 99, 708, 101.0, 504.0, 708.0, 708.0, 0.09759430049285121, 2.074137575722721, 0.05687100909021199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 102.99999999999999, 100, 109, 102.0, 109.0, 109.0, 109.0, 0.03825463239689181, 0.02842946802151823, 0.021480872683801555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 214.38095238095238, 98, 688, 102.0, 612.0000000000002, 687.7, 688.0, 0.09403504372629533, 8.081302740785686, 0.05451268857384661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 450.235294117647, 100, 900, 683.0, 899.2, 900.0, 900.0, 0.07994244144216164, 38.09197175827522, 0.04336032468387467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 166.42857142857142, 99, 695, 101.0, 450.20000000000016, 674.2999999999997, 695.0, 0.09412777172670674, 2.6588294091017075, 0.05465836521351316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 405.94117647058823, 100, 706, 492.0, 704.4, 706.0, 706.0, 0.07994244144216164, 12.454350882070791, 0.043438393474345534], "isController": false}, {"data": ["deleteBooks", 17, 5, 29.41176470588235, 313.0588235294117, 103, 634, 354.0, 586.8, 634.0, 634.0, 0.08776141285549825, 0.018804576628619514, 0.05866725421641965], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/314e935b-244c-47b6-aafe-9a27a133c69f", 3, 0, 0.0, 287.6666666666667, 190, 439, 234.0, 439.0, 439.0, 439.0, 0.029676232305546488, 0.024739853819825703, 0.01903065678448131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 384.14285714285717, 201, 813, 399.5, 767.0, 813.0, 813.0, 0.09752223855332724, 8.47395192980837, 0.21754751596926658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 500.8695652173913, 116, 1071, 474.0, 977.0000000000001, 1060.9999999999998, 1071.0, 0.10041256466787453, 0.061679202320403394, 0.045401384219947175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 104.23529411764704, 100, 116, 103.0, 114.4, 116.0, 116.0, 0.07994018593146775, 0.05940867333383492, 0.040126226141381276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 188.8823529411765, 98, 402, 102.0, 323.5999999999999, 402.0, 402.0, 0.07994168959112177, 0.08495641414497661, 0.04203735216665491], "isController": false}, {"data": ["login", 23, 0, 0.0, 2324.347826086956, 1039, 3942, 2468.0, 3332.600000000001, 3866.999999999999, 3942.0, 0.10103628081057454, 42.178709088542924, 0.21071675769083778], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ce70dd98-858b-4eb8-9064-0f53826c48be", 3, 0, 0.0, 453.33333333333337, 233, 754, 373.0, 754.0, 754.0, 754.0, 0.021933993302820712, 0.025925237526869142, 0.014065744403176043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 115.66666666666666, 101, 298, 105.0, 125.60000000000001, 281.0999999999998, 298.0, 0.09491568323472648, 0.07684091933748853, 0.03373955927484418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aac66b51-cdc1-4fb5-bdf4-01b1ca819a05", 3, 0, 0.0, 290.6666666666667, 183, 418, 271.0, 418.0, 418.0, 418.0, 0.025056167575648748, 0.02512957431659303, 0.016067919962248708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d12c2c8-d2d8-4dcd-ad48-2a3d600e63e8", 3, 0, 0.0, 261.6666666666667, 181, 361, 243.0, 361.0, 361.0, 361.0, 0.02646412787466589, 0.026713951998482723, 0.01697081116962624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71782e57-60f0-4df0-8044-5c26622238f1", 3, 0, 0.0, 369.6666666666667, 252, 494, 363.0, 494.0, 494.0, 494.0, 0.10112586799703364, 0.04575682178251197, 0.06484959633924357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 558.5294117647059, 204, 1017, 792.0, 1008.2, 1017.0, 1017.0, 0.07990186171337792, 50.66495900916991, 0.1688780559524537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 10, 55.55555555555556, 451.83333333333326, 99, 998, 103.5, 988.1, 998.0, 998.0, 0.07593142548596113, 40.384791067300554, 0.10404730976014105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 376.92857142857144, 204, 1012, 400.5, 711.5, 1012.0, 1012.0, 0.0767043431094845, 6.665032775697324, 0.17110804217643094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a45aac0a-6d13-4f43-bd8f-e2fb1d859200", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04a6ce6e-73d9-40cc-ae93-29e949e2d3fd", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["register", 25, 10, 40.0, 891.8400000000001, 118, 1768, 909.0, 1479.600000000001, 1766.8, 1768.0, 0.0983895596870425, 0.03051613687168427, 0.04439060212442737], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 330.80952380952385, 202, 841, 209.0, 728.4000000000003, 837.4, 841.0, 0.09399043087898955, 10.840863465751678, 0.20909636452845898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 106.21428571428572, 101, 123, 105.0, 117.0, 123.0, 123.0, 0.10893924302788845, 0.08457685371794074, 0.03872449654506972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71782e57-60f0-4df0-8044-5c26622238f1", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 332.8666666666667, 200, 617, 210.0, 608.0, 617.0, 617.0, 0.08182948916577563, 0.12681972588484955, 0.18403643901248173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04a29d9d-47c6-4314-9cdd-10b3bd8fec09", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da0853ae-717e-49d5-b2be-2365df6632e6", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 133.76923076923077, 100, 298, 102.0, 296.8, 298.0, 298.0, 0.07283198780904573, 0.0541261159401209, 0.03655824388071241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 162.15384615384616, 99, 305, 101.0, 303.8, 305.0, 305.0, 0.07274884301359284, 0.02787102609445038, 0.04101959252253815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 191.9230769230769, 99, 685, 101.0, 530.9999999999999, 685.0, 685.0, 0.07282872364860701, 5.058997612408334, 0.042333883983843225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 146.46153846153848, 98, 692, 101.0, 457.5999999999998, 692.0, 692.0, 0.07282994767448374, 1.6653832430895585, 0.04240571848143957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 104.0, 103, 106, 104.0, 106.0, 106.0, 106.0, 0.05823704808050689, 0.017175379414368246, 0.03600005022945397], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 930.280701754386, 781, 1665, 806.0, 1298.6, 1314.9999999999995, 1665.0, 0.2490420618935061, 297.9408870539635, 0.4917607901842474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, 40.0, 891.8400000000001, 118, 1768, 909.0, 1479.600000000001, 1766.8, 1768.0, 0.10085565941447239, 0.03128101311526995, 0.04550323696238891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 100.55555555555556, 99, 103, 100.0, 103.0, 103.0, 103.0, 0.07512897140090488, 0.020249605572900144, 0.044240986088618796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 100.22222222222223, 98, 101, 100.0, 101.0, 101.0, 101.0, 0.07512897140090488, 0.020249605572900144, 0.044167617952485104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 144.35714285714286, 99, 309, 102.0, 307.5, 309.0, 309.0, 0.10712454759008026, 0.028873413217638824, 0.06297751723557453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 143.92857142857142, 99, 312, 100.5, 307.0, 312.0, 312.0, 0.10712618699641129, 0.028873855088876473, 0.06308309644417577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 101.33333333333333, 100, 103, 101.0, 103.0, 103.0, 103.0, 0.07512959855751171, 0.020103037114021685, 0.04284734917733089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 116.57142857142858, 100, 310, 102.0, 207.0, 310.0, 310.0, 0.10712536728697356, 0.07961172314979188, 0.05377191287646915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 101.66666666666667, 99, 105, 102.0, 105.0, 105.0, 105.0, 0.07512897140090488, 0.05583315159774279, 0.03771122197271984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 143.50000000000003, 97, 309, 101.0, 303.5, 309.0, 309.0, 0.10712618699641129, 0.02866462425489911, 0.0610954035213908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1295bdef-e35b-4644-b949-1fa4710daaf1", 3, 0, 0.0, 708.3333333333334, 176, 1504, 445.0, 1504.0, 1504.0, 1504.0, 0.022286109068217777, 0.026341426440982668, 0.014291547807418302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 149.11111111111111, 102, 310, 105.0, 310.0, 310.0, 310.0, 0.07759289593930511, 0.06107409582722649, 0.027581849728424864], "isController": false}, {"data": ["deleteAccount", 17, 5, 29.41176470588235, 360.52941176470586, 99, 754, 413.0, 649.1999999999999, 754.0, 754.0, 0.08742787200559538, 0.01802998968865392, 0.05948389912880697], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1210.9130434782608, 629, 1920, 1158.0, 1759.0000000000002, 1898.9999999999998, 1920.0, 0.10104027553243831, 0.0522962363595628, 0.04647457985915864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 204.66666666666669, 202, 208, 204.0, 208.0, 208.0, 208.0, 0.07506568247216315, 0.11633714656574504, 0.16882447923182786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5475fb6d-1e55-4317-b5a0-25960bb0c9a3", 3, 0, 0.0, 298.0, 194, 497, 203.0, 497.0, 497.0, 497.0, 0.07500375018750938, 0.03393724373718686, 0.04809810803040152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce70dd98-858b-4eb8-9064-0f53826c48be", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.510350459039548, 1.947607697740113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05296e8b-53aa-442f-b5fe-c80d8b071019", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 1.0169934315286624, 1.9002537818471337], "isController": false}, {"data": ["addBook", 60, 19, 31.666666666666668, 870.2333333333331, 512, 1441, 809.5, 1327.4, 1428.75, 1441.0, 0.2812715348518871, 79.66492960740354, 1.0220905829118168], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7c18fde7-2f5d-42f5-801b-7d67e080bb32", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 179.1754385964912, 99, 608, 103.0, 403.4, 414.9999999999999, 608.0, 0.2498159251078153, 0.18565421778031976, 0.12076062785973493], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 551.4912280701757, 487, 817, 500.0, 697.8, 799.1999999999999, 817.0, 0.2497644764805118, 73.43904904640361, 0.1256139701049449], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 149.5087719298246, 99, 310, 104.0, 301.4, 304.2, 310.0, 0.2501920333589378, 0.4427226215296829, 0.12167542247338967], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 748.4561403508769, 679, 1023, 701.0, 888.4, 912.8999999999995, 1023.0, 0.24974258987447148, 224.7188213696957, 0.1253590734330843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 106.93333333333332, 102, 119, 105.0, 116.6, 119.0, 119.0, 0.07913187062466699, 0.05911707131627954, 0.028128907136112095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 19, 10.734463276836157, 151.1412429378531, 100, 458, 107.0, 302.20000000000005, 344.2, 428.35999999999996, 0.7263058116775203, 1.6061172991579775, 0.3471559690437794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 108.15384615384616, 101, 129, 106.0, 123.39999999999999, 129.0, 129.0, 0.07824443561686709, 0.06059359125407775, 0.027813451723183228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=314e935b-244c-47b6-aafe-9a27a133c69f", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 119.07142857142856, 101, 306, 104.5, 207.0, 306.0, 306.0, 0.07734251131134229, 0.06276526064426312, 0.027492845817703702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a45aac0a-6d13-4f43-bd8f-e2fb1d859200", 3, 0, 0.0, 309.6666666666667, 210, 469, 250.0, 469.0, 469.0, 469.0, 0.0401843120445778, 0.02583464071876339, 0.025769236565045005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 343.0769230769231, 204, 792, 208.0, 715.1999999999999, 792.0, 792.0, 0.0727073417636564, 6.7950341584684475, 0.16208952685697348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 304.64285714285705, 200, 607, 207.0, 510.0, 607.0, 607.0, 0.10704018594409444, 0.16589138192702918, 0.24073588694262646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd85bd1d-fe25-4da6-9706-7402b1f3313b", 3, 0, 0.0, 826.6666666666666, 222, 1845, 413.0, 1845.0, 1845.0, 1845.0, 0.05701579337476481, 0.03665566143071631, 0.036562862287853735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 113.5, 102, 160, 106.0, 149.5, 160.0, 160.0, 0.09829251853516063, 0.0814944806995619, 0.034939918698045386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 106.5294117647059, 101, 122, 105.0, 116.39999999999999, 122.0, 122.0, 0.08275727777236881, 0.06425003498929024, 0.029417626083146724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aac66b51-cdc1-4fb5-bdf4-01b1ca819a05", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.28495908911671924, 1.0874654968454258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04a29d9d-47c6-4314-9cdd-10b3bd8fec09", 3, 0, 0.0, 280.3333333333333, 176, 473, 192.0, 473.0, 473.0, 473.0, 0.09174592495183338, 0.04151264182390899, 0.058834463592158784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04a6ce6e-73d9-40cc-ae93-29e949e2d3fd", 3, 0, 0.0, 266.6666666666667, 210, 372, 218.0, 372.0, 372.0, 372.0, 0.02233222912867086, 0.026788497506234413, 0.01432112349722708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 130.60000000000002, 99, 313, 102.0, 305.2, 313.0, 313.0, 0.08187549466444694, 0.06084692523402745, 0.04109766040773996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 140.46666666666664, 99, 304, 100.0, 302.2, 304.0, 304.0, 0.08187504776044452, 0.021907971764025196, 0.04669436317587852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 173.86666666666667, 99, 409, 101.0, 344.20000000000005, 409.0, 409.0, 0.08187594157332809, 0.022068124877186086, 0.04813409846400733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 173.46666666666664, 99, 400, 101.0, 341.8, 400.0, 400.0, 0.08187549466444694, 0.02206800442127671, 0.048213792268224115], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 20.408163265306122, 0.7363770250368189], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 10.204081632653061, 0.36818851251840945], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 10.204081632653061, 0.36818851251840945], "isController": false}, {"data": ["401/Unauthorized", 29, 59.183673469387756, 2.1354933726067746], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1358, 49, "401/Unauthorized", 29, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
