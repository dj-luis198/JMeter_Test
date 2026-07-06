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

    var data = {"OkPercent": 98.07098765432099, "KoPercent": 1.9290123456790123};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7883720930232558, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5b56a25-d408-4732-9ecc-dff7edb31c9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5003bcb7-6439-40bc-a91f-64b650f57b19"], "isController": false}, {"data": [0.16071428571428573, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a24c4b1-9796-45d4-b513-43ed981ae79f"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c190de8-cd7d-4f35-aea6-210cf645be03"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d64835f4-c574-4407-9002-5625feef15e0"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/beb64d65-acb1-4bd5-abed-db1037917fa5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b186c8f5-52f9-430b-a144-9158c034c85c"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e17fa58a-c5df-44a8-bc20-fb9c537e6cb6"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e95c2ed-1c95-4b0c-aa5e-11c1fb21b863"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/27abb0de-b86f-451b-a8f4-bee7999c5e99"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c190de8-cd7d-4f35-aea6-210cf645be03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a804723-e55b-4f73-8e2d-6ffb52e5f8d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f70bca2-b4d2-4369-bfb4-0a5ecb79702c"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3a24c4b1-9796-45d4-b513-43ed981ae79f"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.44642857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f0b01ce-3706-4813-a976-60e2d26f008c"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5b56a25-d408-4732-9ecc-dff7edb31c9a"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e95c2ed-1c95-4b0c-aa5e-11c1fb21b863"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3050847457627119, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5003bcb7-6439-40bc-a91f-64b650f57b19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b186c8f5-52f9-430b-a144-9158c034c85c"], "isController": false}, {"data": [0.5535714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=beb64d65-acb1-4bd5-abed-db1037917fa5"], "isController": false}, {"data": [0.9454022988505747, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27abb0de-b86f-451b-a8f4-bee7999c5e99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f70bca2-b4d2-4369-bfb4-0a5ecb79702c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f0b01ce-3706-4813-a976-60e2d26f008c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e17fa58a-c5df-44a8-bc20-fb9c537e6cb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97500fb7-6e23-4054-aab2-d499a6518ec6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 25, 1.9290123456790123, 344.45833333333377, 94, 2906, 112.0, 960.8999999999994, 1190.5999999999995, 1561.2999999999997, 5.101739551472065, 709.729716488834, 3.7373983453299005], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5b56a25-d408-4732-9ecc-dff7edb31c9a", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5003bcb7-6439-40bc-a91f-64b650f57b19", 3, 0, 0.0, 327.3333333333333, 187, 467, 328.0, 467.0, 467.0, 467.0, 0.018917061297584293, 0.026078696157314285, 0.012131058188880552], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1636.428571428572, 1232, 2187, 1584.5, 1960.9, 2171.15, 2187.0, 0.2499754488398461, 300.8050818878838, 1.2291273290123292], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a24c4b1-9796-45d4-b513-43ed981ae79f", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 508.57142857142856, 106, 1335, 484.0, 1054.5, 1335.0, 1335.0, 0.06828968484310445, 0.014009484034847251, 0.04571540914057432], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 508.57142857142856, 106, 1335, 484.0, 1054.5, 1335.0, 1335.0, 0.06731351751593888, 0.013809225377676914, 0.045061929938648534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 112.58823529411765, 96, 294, 102.0, 141.99999999999986, 294.0, 294.0, 0.09126928734792926, 0.03248532309327721, 0.0516011216726976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 115.70588235294116, 98, 326, 103.0, 149.99999999999983, 326.0, 326.0, 0.09136101034529087, 0.0678962196023109, 0.04585894464597609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c190de8-cd7d-4f35-aea6-210cf645be03", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 0.27373342803030304, 1.044625946969697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 164.88235294117646, 97, 778, 102.0, 400.39999999999964, 778.0, 778.0, 0.09136297434850138, 1.603397107152646, 0.05333880447517345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 194.64705882352945, 99, 1095, 102.0, 461.3999999999994, 1095.0, 1095.0, 0.09126487751716585, 4.853757470634184, 0.05319240850696029], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d64835f4-c574-4407-9002-5625feef15e0", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.9447808801775147, 1.7653245192307692], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 226.71428571428572, 100, 578, 210.5, 453.0, 578.0, 578.0, 0.06790940884859598, 0.13809730721003893, 0.04388816078280146], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 113.57894736842105, 98, 307, 103.0, 105.0, 307.0, 307.0, 0.11957205789804909, 0.08886165630899936, 0.06001956812460667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 768.6, 603, 894, 784.0, 894.0, 894.0, 894.0, 0.024242071630473254, 7.127973971893742, 0.013825556476754278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 134.05263157894737, 99, 313, 102.0, 311.0, 313.0, 313.0, 0.11957130540399367, 0.05089892842084064, 0.06713594470771109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 944.4, 876, 1027, 903.0, 1027.0, 1027.0, 1027.0, 0.02422950184144214, 21.801748347850843, 0.013794726146055437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 261.2, 102, 305, 300.0, 305.0, 305.0, 305.0, 0.02430121846309374, 0.043001765483521345, 0.013455850457591944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/beb64d65-acb1-4bd5-abed-db1037917fa5", 3, 0, 0.0, 657.3333333333334, 214, 1049, 709.0, 1049.0, 1049.0, 1049.0, 0.020881767432795514, 0.02468154217072933, 0.013390977162307019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 102.13333333333335, 96, 104, 103.0, 104.0, 104.0, 104.0, 0.08805504027050508, 0.06543934145102966, 0.04419950263578087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 148.73333333333338, 94, 410, 102.0, 347.6, 410.0, 410.0, 0.08805659103583903, 0.023562017523261616, 0.05021977457512695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 127.60000000000001, 98, 304, 102.0, 299.2, 304.0, 304.0, 0.08805504027050508, 0.023733585072909572, 0.0517667326590274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 154.26666666666665, 94, 306, 100.0, 306.0, 306.0, 306.0, 0.087951778971316, 0.023705752925862515, 0.05179191671846049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 102.0, 101, 104, 102.0, 104.0, 104.0, 104.0, 0.024323798404358825, 0.01807657283761432, 0.013658382893072581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 206.10526315789477, 99, 1100, 102.0, 1092.0, 1100.0, 1100.0, 0.1195698004442962, 11.354005568648798, 0.06921233000635608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 713.2666666666665, 99, 1323, 946.0, 1285.2, 1323.0, 1323.0, 0.11642256735045521, 62.86689025863273, 0.06244069725475586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 195.15789473684214, 95, 804, 102.0, 783.0, 804.0, 804.0, 0.11957055291940945, 3.7296474399315303, 0.06932953369057658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 534.1333333333333, 100, 913, 789.0, 906.4, 913.0, 913.0, 0.1164234709717479, 20.551971558716236, 0.06255487668814033], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 454.38461538461536, 107, 832, 432.0, 763.1999999999999, 832.0, 832.0, 0.06452253325392099, 0.01279108813529879, 0.043777608199325], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b186c8f5-52f9-430b-a144-9158c034c85c", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 292.8666666666666, 199, 514, 208.0, 451.6, 514.0, 514.0, 0.08789869382540975, 0.13622580771574733, 0.19768622253898305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e17fa58a-c5df-44a8-bc20-fb9c537e6cb6", 1, 0, 0.0, 832.0, 832, 832, 832.0, 832.0, 832.0, 832.0, 1.201923076923077, 0.2171443058894231, 0.8286696213942308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 529.6842105263157, 126, 1363, 500.0, 1097.0, 1363.0, 1363.0, 0.08749551009882388, 0.053744800636875215, 0.039560958179448685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 104.13333333333333, 100, 109, 104.0, 109.0, 109.0, 109.0, 0.11642256735045521, 0.08652106811884415, 0.05843867150208396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 141.26666666666665, 95, 311, 102.0, 307.4, 311.0, 311.0, 0.1164234709717479, 0.13606993169823037, 0.06053110932163924], "isController": false}, {"data": ["login", 19, 0, 0.0, 2536.9999999999995, 1557, 4244, 2351.0, 3464.0, 4244.0, 4244.0, 0.08671245692900988, 27.418085786858498, 0.1686694558222851], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 130.21052631578945, 101, 333, 105.0, 301.0, 333.0, 333.0, 0.118861432593056, 0.09622668712855803, 0.04225152486706287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e95c2ed-1c95-4b0c-aa5e-11c1fb21b863", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27abb0de-b86f-451b-a8f4-bee7999c5e99", 3, 0, 0.0, 359.6666666666667, 273, 506, 300.0, 506.0, 506.0, 506.0, 0.09600921688482095, 0.043441670400358436, 0.061568410567414474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c190de8-cd7d-4f35-aea6-210cf645be03", 3, 0, 0.0, 592.3333333333333, 237, 1269, 271.0, 1269.0, 1269.0, 1269.0, 0.0217964646134397, 0.025762683271939958, 0.013977550549634182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a804723-e55b-4f73-8e2d-6ffb52e5f8d0", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 1.071597105704698, 2.002280830536913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f70bca2-b4d2-4369-bfb4-0a5ecb79702c", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 818.2666666666667, 200, 1432, 1052.0, 1391.8, 1432.0, 1432.0, 0.11633047160373187, 83.5751280362253, 0.24377141207742953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 627.1111111111111, 100, 1129, 978.0, 1129.0, 1129.0, 1129.0, 0.04155853750888891, 27.62630837242914, 0.06414156223160111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 335.29411764705884, 204, 1194, 208.0, 741.9999999999995, 1194.0, 1194.0, 0.09121248215991157, 6.5519778689008366, 0.2037662120126839], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a24c4b1-9796-45d4-b513-43ed981ae79f", 3, 0, 0.0, 630.0, 192, 1137, 561.0, 1137.0, 1137.0, 1137.0, 0.023688636561041667, 0.023758036863466597, 0.01519095508634508], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1056.4090909090908, 194, 1942, 1060.5, 1829.6999999999998, 1931.9499999999998, 1942.0, 0.08892302095753925, 0.027835810715224025, 0.04011956609607728], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 364.42105263157896, 201, 1400, 208.0, 1202.0, 1400.0, 1400.0, 0.11949535225972001, 15.213909209868428, 0.2655295314681576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 133.35294117647058, 101, 371, 106.0, 317.4, 371.0, 371.0, 0.0984936268829664, 0.07646722008980301, 0.035011406431054465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 334.3529411764706, 203, 607, 397.0, 450.1999999999999, 607.0, 607.0, 0.08545247083306107, 0.13243463985553505, 0.19218460969583948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 123.0, 100, 305, 103.0, 285.00000000000006, 305.0, 305.0, 0.05716572343223003, 0.04248351126164752, 0.02869451351969359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 119.90000000000002, 96, 295, 101.0, 275.80000000000007, 295.0, 295.0, 0.05716572343223003, 0.015296297090264676, 0.03260232664494369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 120.6, 96, 303, 101.5, 283.00000000000006, 303.0, 303.0, 0.05716637702368975, 0.015408125057166377, 0.033607577117442604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 141.2, 98, 304, 101.5, 304.0, 304.0, 304.0, 0.05716703063009501, 0.015408301224517798, 0.033663788544870406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 122.0, 107, 137, 122.0, 137.0, 137.0, 137.0, 0.03262908883269435, 0.009623032058079777, 0.02017013010849172], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1116.2142857142853, 795, 1772, 1010.5, 1533.9000000000003, 1734.25, 1772.0, 0.2614232629357832, 312.7531079024518, 0.5162088258360876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1056.4090909090908, 194, 1942, 1060.5, 1829.6999999999998, 1931.9499999999998, 1942.0, 0.08671420181548005, 0.027144378160634117, 0.03912300902221855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 158.4, 96, 393, 99.0, 393.0, 393.0, 393.0, 0.023811451403208832, 0.006417930261021131, 0.014021782418100513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 181.2, 101, 300, 103.0, 300.0, 300.0, 300.0, 0.023844382025151052, 0.006426806092716494, 0.014017888651504818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f0b01ce-3706-4813-a976-60e2d26f008c", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 236.35294117647058, 96, 1099, 102.0, 1046.2, 1099.0, 1099.0, 0.09723898482499843, 10.316750183753081, 0.05618277282685169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 206.76470588235293, 98, 800, 103.0, 643.1999999999998, 800.0, 800.0, 0.09723842862699339, 3.3868108941359507, 0.05627741086954035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 181.8, 100, 303, 102.0, 303.0, 303.0, 303.0, 0.02384472316276408, 0.0063803263150364825, 0.01359894367876389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 137.88235294117646, 98, 312, 103.0, 304.8, 312.0, 312.0, 0.09723676007115442, 0.07226286563881693, 0.04880829558259119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 102.0, 98, 106, 102.0, 106.0, 106.0, 106.0, 0.023843927190183932, 0.0177199497966113, 0.011968533765385293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 135.64705882352945, 97, 302, 101.0, 301.2, 302.0, 302.0, 0.09723787243535112, 0.04320069539378478, 0.05449521389471998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 110.6, 101, 121, 106.0, 121.0, 121.0, 121.0, 0.02427537990969559, 0.01910737910860805, 0.008629138952274603], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 597.25, 103, 1269, 510.0, 1197.6000000000004, 1269.0, 1269.0, 0.062940914216779, 0.011827032139204321, 0.04283649622354515], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c5b56a25-d408-4732-9ecc-dff7edb31c9a", 3, 0, 0.0, 273.0, 187, 409, 223.0, 409.0, 409.0, 409.0, 0.04456526583181068, 0.02865117188080277, 0.02857863726844631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1440.2631578947369, 1042, 2906, 1294.0, 2182.0, 2906.0, 2906.0, 0.08710801393728224, 0.045085202526132406, 0.0400662837543554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e95c2ed-1c95-4b0c-aa5e-11c1fb21b863", 3, 0, 0.0, 470.6666666666667, 189, 1031, 192.0, 1031.0, 1031.0, 1031.0, 0.021010610358230906, 0.024833830146724096, 0.01347360104352698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 343.8, 205, 495, 402.0, 495.0, 495.0, 495.0, 0.023799324099195582, 0.03688430404826503, 0.05352523769574944], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 985.728813559322, 513, 1941, 823.0, 1772.0, 1847.0, 1941.0, 0.27539851098093215, 79.22615188198706, 1.002937231603146], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5003bcb7-6439-40bc-a91f-64b650f57b19", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 180.53571428571425, 97, 499, 104.5, 412.3, 423.45, 499.0, 0.26228893936910147, 0.1949237137303576, 0.12679006346455587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b186c8f5-52f9-430b-a144-9158c034c85c", 3, 0, 0.0, 588.6666666666666, 536, 652, 578.0, 652.0, 652.0, 652.0, 0.022065313327449248, 0.02646832018608414, 0.0141499567887614], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 663.2678571428573, 486, 1011, 605.0, 809.0, 909.4, 1011.0, 0.2621980625436021, 77.09493618286442, 0.13186718965815927], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 147.80357142857144, 96, 410, 104.0, 305.6, 309.15, 410.0, 0.2627011305530797, 0.46485785992400436, 0.12775894825725947], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 928.6249999999999, 688, 1328, 903.5, 1205.3, 1278.75, 1328.0, 0.26195644038619864, 235.7088655298069, 0.13148985386572862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 116.94117647058823, 100, 298, 105.0, 153.9999999999999, 298.0, 298.0, 0.08686365982146964, 0.06489326148771901, 0.03087731657716303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=beb64d65-acb1-4bd5-abed-db1037917fa5", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 0.2942411441368078, 1.1228878257328991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, 5.172413793103448, 152.90229885057477, 98, 939, 108.5, 267.5, 297.75, 528.75, 0.7485770582642478, 1.5843444210036095, 0.360104822298992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 149.1, 103, 320, 106.5, 318.8, 320.0, 320.0, 0.055219941025102984, 0.04276309886026042, 0.01962896341126708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27abb0de-b86f-451b-a8f4-bee7999c5e99", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 119.05882352941177, 101, 306, 107.0, 153.19999999999987, 306.0, 306.0, 0.09114841643030631, 0.07396907622420366, 0.03240041365296045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 266.09999999999997, 203, 610, 206.0, 589.7, 610.0, 610.0, 0.057132083664223315, 0.08854357106945548, 0.12849139519404912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 411.5882352941176, 198, 1412, 209.0, 1352.0, 1412.0, 1412.0, 0.0971806187547161, 13.810751508086, 0.2156362454410857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f70bca2-b4d2-4369-bfb4-0a5ecb79702c", 3, 0, 0.0, 297.0, 218, 449, 224.0, 449.0, 449.0, 449.0, 0.027941546285171422, 0.028023406284053757, 0.017918244199800683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f0b01ce-3706-4813-a976-60e2d26f008c", 3, 0, 0.0, 344.3333333333333, 207, 514, 312.0, 514.0, 514.0, 514.0, 0.08666762964032934, 0.03921484544272714, 0.055577874476383064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e17fa58a-c5df-44a8-bc20-fb9c537e6cb6", 3, 0, 0.0, 334.6666666666667, 217, 497, 290.0, 497.0, 497.0, 497.0, 0.019655504524041956, 0.027083903206467974, 0.012604604138138886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 113.60000000000001, 103, 174, 107.0, 154.8, 174.0, 174.0, 0.09247842170160296, 0.07667400393033293, 0.03287318896424168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97500fb7-6e23-4054-aab2-d499a6518ec6", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 122.13333333333334, 102, 300, 109.0, 193.20000000000005, 300.0, 300.0, 0.11713259409651726, 0.0909379026432922, 0.04163697680774637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 113.88235294117646, 97, 304, 102.0, 144.79999999999984, 304.0, 304.0, 0.08558281899737209, 0.06360207544628922, 0.04295856344204029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 195.0588235294118, 95, 310, 101.0, 307.6, 310.0, 310.0, 0.08549630605665891, 0.022876941269066933, 0.04875961204793828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 147.1764705882353, 96, 303, 101.0, 302.2, 303.0, 303.0, 0.08549630605665891, 0.023043926241833844, 0.05026247680284049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 181.64705882352942, 99, 304, 103.0, 304.0, 304.0, 304.0, 0.08558281899737209, 0.02306724418288545, 0.050396913921304076], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5401234567901234], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.0, 0.23148148148148148], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.07716049382716049], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.0802469135802468], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 25, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
