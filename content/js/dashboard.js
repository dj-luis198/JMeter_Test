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

    var data = {"OkPercent": 98.32953682611996, "KoPercent": 1.6704631738800304};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7684210526315789, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.008771929824561403, 500, 1500, "see books"], "isController": true}, {"data": [0.8181818181818182, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79cd806c-c0b0-4f0e-a4a1-53ca71fed226"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89a1e7ff-08eb-417a-a4a2-f04a557c5efc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24beef40-66a3-46d5-ab9e-0c43cb9fb2ae"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ec287b8-f7aa-4938-8642-fb3c9dca3be9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b84baae-1c05-4940-afce-284fd443f422"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5af1f6a5-7b6a-4425-9594-d21e9767f535"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bcb051f-5d07-4a0c-a938-4caedb6f314d"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b693e216-f323-4d48-8115-8929269f56fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e83de9af-6b80-40d8-b5b1-99bd003b9418"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f301c9a-0f3c-4224-a8d7-1475eb1dd20d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=677d6b29-2994-49d3-8daf-e9cecdef006c"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7dc9981-7f03-413b-ba6a-800445c55f77"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/24beef40-66a3-46d5-ab9e-0c43cb9fb2ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b84baae-1c05-4940-afce-284fd443f422"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75c9b155-6ff6-42d4-8477-c044400bcd9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89a1e7ff-08eb-417a-a4a2-f04a557c5efc"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ec287b8-f7aa-4938-8642-fb3c9dca3be9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3bcb051f-5d07-4a0c-a938-4caedb6f314d"], "isController": false}, {"data": [0.26229508196721313, 500, 1500, "addBook"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/89b85735-6aa1-4319-9da3-3aa8b6c0741f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4473684210526316, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9217877094972067, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5af1f6a5-7b6a-4425-9594-d21e9767f535"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71cb4fd5-d4d2-436b-8e27-cff407523528"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f301c9a-0f3c-4224-a8d7-1475eb1dd20d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/677d6b29-2994-49d3-8daf-e9cecdef006c"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b693e216-f323-4d48-8115-8929269f56fd"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75c9b155-6ff6-42d4-8477-c044400bcd9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1317, 22, 1.6704631738800304, 414.8823082763857, 117, 3459, 138.0, 1131.2, 1382.1, 1878.0999999999997, 5.146561729432315, 723.3042641457176, 3.77109917511401], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2065.6315789473674, 1468, 3788, 2075.0, 2543.4, 2708.1, 3788.0, 0.24184207288356363, 291.01751024779264, 1.189135582977288], "isController": true}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 457.1818181818182, 126, 750, 450.0, 707.8000000000002, 750.0, 750.0, 0.07291963593214497, 0.013931379308058945, 0.049245354273422116], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 457.1818181818182, 126, 750, 450.0, 707.8000000000002, 750.0, 750.0, 0.07628452741735264, 0.014574245650048197, 0.05151779119884602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 175.6842105263158, 121, 376, 126.0, 370.0, 376.0, 376.0, 0.0886421423406191, 0.030725874174811634, 0.05016190312346917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 153.10526315789477, 123, 378, 128.0, 362.0, 378.0, 378.0, 0.08864172879363272, 0.06587534727729932, 0.04449399277336642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 208.89473684210526, 119, 964, 126.0, 377.0, 964.0, 964.0, 0.08864421013343286, 1.39444231419707, 0.05179872661425772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 267.5263157894737, 119, 1371, 128.0, 376.0, 1371.0, 1371.0, 0.08864048817582541, 4.220469049599019, 0.051709988733327425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79cd806c-c0b0-4f0e-a4a1-53ca71fed226", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.5352689302884617, 2.86865234375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89a1e7ff-08eb-417a-a4a2-f04a557c5efc", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24beef40-66a3-46d5-ab9e-0c43cb9fb2ae", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["goToProfile", 11, 1, 9.090909090909092, 220.1818181818182, 122, 296, 214.0, 286.8, 296.0, 296.0, 0.07271621505490074, 0.16118416703575655, 0.04700344121224541], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 126.46666666666668, 120, 138, 128.0, 133.8, 138.0, 138.0, 0.12048289544494334, 0.08953855804062684, 0.060476765877637575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 182.2, 120, 507, 124.0, 430.20000000000005, 507.0, 507.0, 0.12024433649175123, 0.032174754100331875, 0.06857684815545188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 959.4, 620, 1131, 994.0, 1131.0, 1131.0, 1131.0, 0.038885389203860546, 11.433595542373409, 0.022176823530326715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1131.4, 872, 1460, 1082.0, 1460.0, 1460.0, 1460.0, 0.03878614869057962, 34.899844770560534, 0.022082348326765543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 272.0, 130, 377, 361.0, 377.0, 377.0, 377.0, 0.03919048141587372, 0.06934878156793278, 0.02170019820585976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 126.33333333333331, 119, 132, 128.0, 130.2, 132.0, 132.0, 0.08051529790660225, 0.05983607588566827, 0.040414905394524955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 157.9333333333333, 120, 378, 126.0, 370.2, 378.0, 378.0, 0.08051789107539696, 0.02154482632290895, 0.04592035975393732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 126.06666666666666, 122, 130, 126.0, 130.0, 130.0, 130.0, 0.08051875550211496, 0.02170232081892942, 0.047336221496360555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 124.20000000000002, 118, 128, 125.0, 128.0, 128.0, 128.0, 0.0805174588689981, 0.021701971335784644, 0.04741408954883384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ec287b8-f7aa-4938-8642-fb3c9dca3be9", 1, 0, 0.0, 930.0, 930, 930, 930.0, 930.0, 930.0, 930.0, 1.075268817204301, 0.1942624327956989, 0.7413474462365591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 126.2, 123, 128, 126.0, 128.0, 128.0, 128.0, 0.039191095783038095, 0.029125413955949208, 0.022006718823483304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b84baae-1c05-4940-afce-284fd443f422", 3, 0, 0.0, 288.6666666666667, 208, 447, 211.0, 447.0, 447.0, 447.0, 0.021611964383482694, 0.0297938376185056, 0.013859234972480764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 159.13333333333333, 121, 381, 126.0, 378.6, 381.0, 381.0, 0.12049450946685196, 0.03247703575473744, 0.07083759247953601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 937.1764705882351, 120, 1901, 1132.0, 1802.6, 1901.0, 1901.0, 0.08122545319024911, 43.001253246031894, 0.043645616333960836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 157.86666666666667, 121, 377, 125.0, 374.6, 377.0, 377.0, 0.12025012025012026, 0.032411165223665224, 0.0708113501082251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 627.8823529411764, 121, 1269, 736.0, 1128.1999999999998, 1269.0, 1269.0, 0.08122467701246082, 14.057692215809189, 0.043724520236889386], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 472.54545454545456, 125, 930, 433.0, 899.6000000000001, 930.0, 930.0, 0.0764775816398184, 0.014611128878630078, 0.05223206991789089], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5af1f6a5-7b6a-4425-9594-d21e9767f535", 3, 0, 0.0, 372.0, 232, 445, 439.0, 445.0, 445.0, 445.0, 0.07641170627340109, 0.034574307200529786, 0.04900099653600264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 286.93333333333334, 247, 505, 255.0, 497.8, 505.0, 505.0, 0.0804608799201828, 0.12469864886067394, 0.18095840474236427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bcb051f-5d07-4a0c-a938-4caedb6f314d", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 573.3, 213, 1220, 467.0, 1196.5000000000002, 1219.5, 1220.0, 0.0860229853416833, 0.05284029080070195, 0.038895158411327506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 142.0, 121, 384, 127.0, 186.3999999999998, 384.0, 384.0, 0.08122390084950645, 0.06036268412741641, 0.040770590856099916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b693e216-f323-4d48-8115-8929269f56fd", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 0.7344067581300813, 2.802654979674797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 199.05882352941174, 120, 380, 128.0, 377.6, 380.0, 380.0, 0.08122467701246082, 0.09349609822930205, 0.04231074053015824], "isController": false}, {"data": ["login", 20, 0, 0.0, 2594.1999999999994, 1467, 5544, 2432.5, 3510.2000000000007, 5444.149999999999, 5544.0, 0.08173540614323313, 24.55807725247454, 0.1572049632803688], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 146.06666666666663, 126, 375, 129.0, 230.4000000000001, 375.0, 375.0, 0.12270340133828511, 0.0993370309662484, 0.043617224694468534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e83de9af-6b80-40d8-b5b1-99bd003b9418", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 1.0368049918831168, 1.9372717126623378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f301c9a-0f3c-4224-a8d7-1475eb1dd20d", 3, 0, 0.0, 319.3333333333333, 200, 544, 214.0, 544.0, 544.0, 544.0, 0.017569134544432343, 0.02076612224310997, 0.011266665056162667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=677d6b29-2994-49d3-8daf-e9cecdef006c", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1081.4117647058824, 248, 2030, 1261.0, 1933.1999999999998, 2030.0, 2030.0, 0.08117425725554611, 57.17687963916849, 0.17034563372026396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7dc9981-7f03-413b-ba6a-800445c55f77", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.5352689302884617, 2.86865234375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 462.7368421052632, 251, 1498, 497.0, 743.0, 1498.0, 1498.0, 0.0885888266176786, 5.70812378481774, 0.19804538516323658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 947.1428571428572, 122, 1586, 1092.0, 1586.0, 1586.0, 1586.0, 0.054246745195288285, 46.35983755037198, 0.09764111418939864], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 1009.9047619047618, 269, 1553, 1059.0, 1505.0, 1550.0, 1553.0, 0.08326328644156504, 0.026159168675558658, 0.03756605306250298], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/24beef40-66a3-46d5-ab9e-0c43cb9fb2ae", 3, 0, 0.0, 909.3333333333334, 250, 1340, 1138.0, 1340.0, 1340.0, 1340.0, 0.017730601244688206, 0.024443065192465675, 0.011370209782563727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b84baae-1c05-4940-afce-284fd443f422", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 346.46666666666675, 248, 630, 257.0, 562.8000000000001, 630.0, 630.0, 0.12011627255183017, 0.18615676224585398, 0.270144312194204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 128.78571428571428, 123, 143, 128.5, 138.0, 143.0, 143.0, 0.11852353538774128, 0.09201778382153741, 0.04213141296986116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 491.57142857142867, 251, 1254, 501.0, 736.8000000000001, 1204.6999999999994, 1254.0, 0.12184366877088748, 7.1211459687151875, 0.2725447503510258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 125.54545454545456, 122, 128, 126.0, 128.0, 128.0, 128.0, 0.0601888836603596, 0.04473021529837271, 0.03021199824357894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 213.63636363636363, 121, 373, 128.0, 372.8, 373.0, 373.0, 0.06010961808534473, 0.024291457876819, 0.033822333045535766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 237.72727272727275, 121, 1131, 126.0, 976.6000000000006, 1131.0, 1131.0, 0.05985905912442521, 4.911147771950589, 0.034722930781160725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 221.36363636363637, 120, 950, 126.0, 832.4000000000004, 950.0, 950.0, 0.05991807564929406, 1.616309240592862, 0.03481567872200192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 125.0, 125, 125, 125.0, 125.0, 125.0, 125.0, 8.0, 2.359375, 4.9453125], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1437.7894736842102, 964, 3281, 1371.0, 2022.2, 2180.2, 3281.0, 0.2565198802907225, 306.8869575673364, 0.5065265604959384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 1009.9047619047618, 269, 1553, 1059.0, 1505.0, 1550.0, 1553.0, 0.08235229527611547, 0.025872958839538513, 0.037155039470278664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 125.5, 122, 127, 126.5, 127.0, 127.0, 127.0, 0.03157429431452207, 0.008510259014461027, 0.01859306589028985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 125.66666666666666, 122, 128, 126.0, 128.0, 128.0, 128.0, 0.0315741281593862, 0.008510214230459561, 0.018562133937451653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 381.57142857142856, 117, 1500, 128.0, 1433.0, 1500.0, 1500.0, 0.12705096558733847, 16.360878200096195, 0.07313229408668506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 296.8571428571429, 119, 963, 128.0, 852.5, 963.0, 963.0, 0.12705442467033914, 5.366241469202915, 0.07325836176932363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 125.16666666666667, 123, 128, 125.0, 128.0, 128.0, 128.0, 0.0315741281593862, 0.00844854601139826, 0.018007119965899942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 177.35714285714286, 122, 374, 127.0, 369.0, 374.0, 374.0, 0.12704635376964682, 0.09441628439326291, 0.06377131429452974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75c9b155-6ff6-42d4-8477-c044400bcd9e", 3, 0, 0.0, 546.6666666666666, 218, 955, 467.0, 955.0, 955.0, 955.0, 0.0249291596380286, 0.02500219428540564, 0.015986472814751417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 126.83333333333333, 123, 130, 127.0, 130.0, 130.0, 130.0, 0.031573131265293236, 0.023464016496961088, 0.015848231904649145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 195.3571428571429, 117, 377, 127.0, 375.5, 377.0, 377.0, 0.12705096558733847, 0.06125671555103819, 0.07093442582038624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 130.83333333333331, 127, 138, 130.0, 138.0, 138.0, 138.0, 0.030352698354883748, 0.023890893431676077, 0.010789435743337584], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 551.9090909090909, 123, 1138, 467.0, 1127.6000000000001, 1138.0, 1138.0, 0.07587253414264036, 0.014306930266243622, 0.05163697147882467], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/89a1e7ff-08eb-417a-a4a2-f04a557c5efc", 3, 0, 0.0, 304.0, 214, 477, 221.0, 477.0, 477.0, 477.0, 0.046567219781754966, 0.029938235374012388, 0.02986244237306552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1357.8999999999999, 894, 3459, 1185.5, 2633.8000000000025, 3423.3999999999996, 3459.0, 0.0844202439745051, 0.04369407158836689, 0.038830014562492084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 254.83333333333331, 251, 259, 254.5, 259.0, 259.0, 259.0, 0.03155221102118731, 0.04889976454162526, 0.07096166209159607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ec287b8-f7aa-4938-8642-fb3c9dca3be9", 3, 0, 0.0, 551.0, 271, 1086, 296.0, 1086.0, 1086.0, 1086.0, 0.01976258547318217, 0.027244319491838052, 0.012673272585341433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bcb051f-5d07-4a0c-a938-4caedb6f314d", 3, 0, 0.0, 494.6666666666667, 208, 881, 395.0, 881.0, 881.0, 881.0, 0.02433563710697946, 0.024406932918816314, 0.01560586103540024], "isController": false}, {"data": ["addBook", 61, 12, 19.672131147540984, 1236.1475409836062, 638, 2518, 1006.0, 2254.2000000000003, 2356.9, 2518.0, 0.282264968141077, 84.11407029409926, 1.026789432647414], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 228.28070175438592, 122, 526, 129.0, 503.20000000000005, 513.0999999999999, 526.0, 0.2575258542403665, 0.19138396003605362, 0.12448759555564592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89b85735-6aa1-4319-9da3-3aa8b6c0741f", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.5743452113309352, 1.0731649055755395], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 787.2280701754388, 585, 1111, 748.0, 1003.2, 1046.3999999999999, 1111.0, 0.2573526091942606, 75.67021201396477, 0.12943026731937912], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 210.1052631578947, 121, 524, 130.0, 379.2, 394.8999999999994, 524.0, 0.25802713359015333, 0.456587076235701, 0.1254858520780238], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1206.1578947368419, 836, 2789, 1202.0, 1512.0, 1674.3999999999994, 2789.0, 0.2571668335995236, 231.399168923926, 0.12908569577163587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 133.09523809523807, 124, 148, 132.0, 143.4, 147.6, 148.0, 0.11753709414721242, 0.0878084736548999, 0.041780763935141914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 12, 6.70391061452514, 186.08379888268155, 120, 1696, 132.0, 302.0, 373.0, 1026.3999999999905, 0.7693729395633917, 1.6262497944936107, 0.37016754412074426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 130.0, 122, 138, 130.0, 137.4, 138.0, 138.0, 0.05804473666158335, 0.04495066032483946, 0.020633089985172208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5af1f6a5-7b6a-4425-9594-d21e9767f535", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71cb4fd5-d4d2-436b-8e27-cff407523528", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 143.73684210526324, 124, 386, 130.0, 138.0, 386.0, 386.0, 0.09340924063203641, 0.07580378805197487, 0.03320406600591919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f301c9a-0f3c-4224-a8d7-1475eb1dd20d", 1, 0, 0.0, 778.0, 778, 778, 778.0, 778.0, 778.0, 778.0, 1.2853470437017993, 0.23221601863753213, 0.8861865359897172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/677d6b29-2994-49d3-8daf-e9cecdef006c", 3, 0, 0.0, 332.3333333333333, 213, 420, 364.0, 420.0, 420.0, 420.0, 0.034990727457223834, 0.029170329758447345, 0.02243871519880565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 432.27272727272725, 249, 1259, 257.0, 1107.2000000000005, 1259.0, 1259.0, 0.0598186949735982, 6.590093497300002, 0.1331422675499894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b693e216-f323-4d48-8115-8929269f56fd", 3, 0, 0.0, 384.3333333333333, 247, 529, 377.0, 529.0, 529.0, 529.0, 0.07980633662312787, 0.036110289031949135, 0.05117789164959698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 596.0714285714284, 248, 1874, 497.0, 1682.5, 1874.0, 1874.0, 0.12690240298764516, 21.857062288684837, 0.2807680258065101], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75c9b155-6ff6-42d4-8477-c044400bcd9e", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 133.8, 125, 171, 130.0, 156.0, 171.0, 171.0, 0.0777657384893746, 0.06447569529050688, 0.02764328985364488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 147.76470588235296, 127, 383, 131.0, 194.19999999999982, 383.0, 383.0, 0.08441039340208642, 0.0655334597213464, 0.03000525702964791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 140.38095238095238, 123, 382, 127.0, 148.0, 358.79999999999967, 382.0, 0.12220883744478779, 0.09082121610887062, 0.061343107858028253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 204.80952380952385, 118, 380, 126.0, 376.2, 379.7, 380.0, 0.12221310473663075, 0.041442427443243654, 0.0692108998085328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 302.95238095238096, 120, 1113, 372.0, 380.0, 1039.699999999999, 1113.0, 0.12220954863940037, 5.2677691683494725, 0.0713457344502898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 245.38095238095232, 119, 980, 126.0, 503.6, 933.3999999999994, 980.0, 0.12193493319707589, 1.738582118096886, 0.07130449148778037], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.45558086560364464], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07593014426727411], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07593014426727411], "isController": false}, {"data": ["401/Unauthorized", 14, 63.63636363636363, 1.0630220197418374], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1317, 22, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
