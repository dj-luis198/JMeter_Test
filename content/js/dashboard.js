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

    var data = {"OkPercent": 98.80418535127055, "KoPercent": 1.195814648729447};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8323624595469256, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.40350877192982454, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b251866-f9e8-47d9-9668-27f862ddac7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7dc8958-6721-41f2-847b-0d17e1c83d53"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b170c3b9-f156-4eff-9b22-974942fea4c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d101a26-3ac3-4eba-b5f9-065ad74eba6c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae108596-73c1-4c3b-bbd2-5cc337ce7bab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf674065-af77-452b-a939-8f011ee9bcf5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7e88cf33-df6d-43b8-bbc2-fc7ad4731f46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=579451a8-6cfb-42fc-84b7-1ca3ca6cd06b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0af78de-167f-430b-8e71-f839e3f99643"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d101a26-3ac3-4eba-b5f9-065ad74eba6c"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18ab95e4-c9a3-477b-a320-52044ec3d5a3"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c77dbbc4-e408-4bc4-9c6c-560e834e80b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02b290cc-fe81-42f7-8e92-9444f82149bf"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/657d9e77-da9b-4261-acc1-4f4063c3523f"], "isController": false}, {"data": [0.35, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40926ac2-ba2c-4ebc-8ecb-9da7ad351a71"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.85, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a7dc8958-6721-41f2-847b-0d17e1c83d53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e88cf33-df6d-43b8-bbc2-fc7ad4731f46"], "isController": false}, {"data": [0.4140625, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae108596-73c1-4c3b-bbd2-5cc337ce7bab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b170c3b9-f156-4eff-9b22-974942fea4c0"], "isController": false}, {"data": [0.8245614035087719, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9513513513513514, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c77dbbc4-e408-4bc4-9c6c-560e834e80b2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf674065-af77-452b-a939-8f011ee9bcf5"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18ab95e4-c9a3-477b-a320-52044ec3d5a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1656f31-910e-45c7-a43f-f8ae279ca617"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0256a5cb-1577-4938-8e9d-761328ceb45f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/579451a8-6cfb-42fc-84b7-1ca3ca6cd06b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=657d9e77-da9b-4261-acc1-4f4063c3523f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0af78de-167f-430b-8e71-f839e3f99643"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1338, 16, 1.195814648729447, 282.78624813153976, 0, 2365, 87.5, 792.0000000000014, 948.2499999999998, 1376.2699999999993, 5.2778150319114525, 730.199961682343, 3.8591657228496254], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 1, 1.7543859649122806, 1314.2982456140353, 977, 1718, 1273.0, 1588.0, 1619.7999999999997, 1718.0, 0.26693641293658155, 321.22230553009126, 1.309771109343243], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1b251866-f9e8-47d9-9668-27f862ddac7c", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7dc8958-6721-41f2-847b-0d17e1c83d53", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 509.74999999999994, 377, 733, 504.5, 710.2, 733.0, 733.0, 0.06821010987511866, 0.012323115553610304, 0.04636155905574471], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 509.74999999999994, 377, 733, 504.5, 710.2, 733.0, 733.0, 0.06900517538815411, 0.012466755319148936, 0.046901955146636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 116.17647058823529, 78, 238, 80.0, 237.2, 238.0, 238.0, 0.1153246048436334, 0.04104729156773625, 0.06520133047283089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 89.3529411764706, 78, 234, 81.0, 113.19999999999989, 234.0, 234.0, 0.1154412913127033, 0.08579181903219454, 0.05794611692844677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 151.94117647058826, 78, 464, 80.0, 345.5999999999999, 464.0, 464.0, 0.1154452110610094, 2.0260342744947573, 0.06739830422869017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 138.6470588235294, 77, 930, 79.0, 374.7999999999995, 930.0, 930.0, 0.11544364312974507, 6.139661395730622, 0.06728465091879558], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 236.3846153846154, 79, 530, 196.0, 475.59999999999997, 530.0, 530.0, 0.0744362882631151, 0.17131753303826028, 0.04811630562681081], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b170c3b9-f156-4eff-9b22-974942fea4c0", 1, 0, 0.0, 1288.0, 1288, 1288, 1288.0, 1288.0, 1288.0, 1288.0, 0.7763975155279502, 0.14026712927018634, 0.5352896933229814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 81.38095238095235, 79, 91, 80.0, 89.2, 90.9, 91.0, 0.10330171972767699, 0.07677012569605682, 0.05185262103518161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 101.80952380952381, 77, 240, 79.0, 236.0, 239.6, 240.0, 0.10330426056286064, 0.04241892767717911, 0.058089430744331795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 596.5, 460, 688, 619.0, 688.0, 688.0, 688.0, 0.06363752068219422, 18.711544045119002, 0.03629327351406389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d101a26-3ac3-4eba-b5f9-065ad74eba6c", 3, 0, 0.0, 305.6666666666667, 180, 391, 346.0, 391.0, 391.0, 391.0, 0.08183529283395619, 0.03702833887994763, 0.05247901265719196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae108596-73c1-4c3b-bbd2-5cc337ce7bab", 1, 0, 0.0, 673.0, 673, 673, 673.0, 673.0, 673.0, 673.0, 1.4858841010401187, 0.2684458580980683, 1.0244474368499257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 792.5, 699, 856, 807.5, 856.0, 856.0, 856.0, 0.06362638586221706, 57.25113384207931, 0.0362247880446021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 157.25, 78, 235, 158.0, 235.0, 235.0, 235.0, 0.06410050959905131, 0.11342785487644627, 0.03549315326431845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf674065-af77-452b-a939-8f011ee9bcf5", 1, 0, 0.0, 963.0, 963, 963, 963.0, 963.0, 963.0, 963.0, 1.0384215991692627, 0.18760546469366562, 0.7159430166147456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 103.0, 79, 237, 81.0, 234.0, 237.0, 237.0, 0.07499745544347602, 0.05573541366453638, 0.03764520712690105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 113.21428571428571, 77, 243, 79.5, 240.5, 243.0, 243.0, 0.0749986607382011, 0.028114034794021536, 0.042322765441688545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 156.64285714285714, 79, 850, 80.0, 543.0, 850.0, 850.0, 0.07499825896898822, 4.839025151536661, 0.043630404562036956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 140.92857142857142, 78, 624, 80.0, 432.0, 624.0, 624.0, 0.07499825896898822, 1.5939117986993159, 0.04370364504931136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e88cf33-df6d-43b8-bbc2-fc7ad4731f46", 3, 0, 0.0, 735.3333333333334, 432, 1244, 530.0, 1244.0, 1244.0, 1244.0, 0.04118616144975288, 0.026478733353926413, 0.02641169858594179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 80.0, 79, 81, 80.0, 81.0, 81.0, 81.0, 0.06425702811244981, 0.0477535140562249, 0.036081827309236945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 157.28571428571428, 78, 844, 80.0, 544.6000000000003, 821.6999999999997, 844.0, 0.10330273604675186, 8.87776142663538, 0.05988522635597139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 557.0, 79, 1007, 843.0, 1006.2, 1007.0, 1007.0, 0.0804657547214465, 42.59906421581388, 0.04323740060112652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 130.95238095238093, 78, 615, 80.0, 509.0000000000004, 615.0, 615.0, 0.10330375238582476, 2.9180235532555443, 0.05998669810462211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 393.7647058823529, 78, 706, 469.0, 647.5999999999999, 706.0, 706.0, 0.08046613559017177, 13.926410169026218, 0.04331618546734258], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 566.1818181818181, 177, 1288, 405.0, 1223.0000000000002, 1288.0, 1288.0, 0.06353864015757583, 0.01147914885659329, 0.043806914014891146], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 284.14285714285717, 159, 1082, 163.0, 781.5, 1082.0, 1082.0, 0.07496492712338156, 6.513890557565032, 0.1672278438480568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=579451a8-6cfb-42fc-84b7-1ca3ca6cd06b", 1, 0, 0.0, 704.0, 704, 704, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 0.2566250887784091, 0.9793368252840909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0af78de-167f-430b-8e71-f839e3f99643", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d101a26-3ac3-4eba-b5f9-065ad74eba6c", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.020700918079096, 3.895215395480226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 438.95000000000005, 92, 751, 467.0, 743.0, 750.65, 751.0, 0.10071152693781567, 0.06186284223035748, 0.04553655954317252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 100.76470588235293, 78, 237, 81.0, 237.0, 237.0, 237.0, 0.08045813810402763, 0.05979359677457523, 0.04038621385299825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 153.05882352941177, 78, 238, 81.0, 238.0, 238.0, 238.0, 0.0804657547214465, 0.09262251798646282, 0.04191541037534908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18ab95e4-c9a3-477b-a320-52044ec3d5a3", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["login", 20, 0, 0.0, 2341.75, 1405, 3941, 2239.0, 3674.1000000000017, 3931.35, 3941.0, 0.10192121490088163, 24.52803709295215, 0.18757882968964992], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c77dbbc4-e408-4bc4-9c6c-560e834e80b2", 3, 0, 0.0, 348.0, 168, 566, 310.0, 566.0, 566.0, 566.0, 0.028395377232586536, 0.02847856681432263, 0.018209275113344883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 91.47619047619047, 79, 235, 84.0, 95.4, 221.0999999999998, 235.0, 0.10657734470158343, 0.08628185425548113, 0.037884915499390985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 686.470588235294, 158, 1105, 926.0, 1094.6, 1105.0, 1105.0, 0.08042768604816199, 56.65101573218763, 0.16877894066092633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02b290cc-fe81-42f7-8e92-9444f82149bf", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.947170350609756, 3.6382907774390243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 288.1764705882353, 158, 1010, 165.0, 642.7999999999997, 1010.0, 1010.0, 0.11525892578681167, 8.279282758959686, 0.25748531508061345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, 20.0, 714.4, 79, 937, 848.0, 937.0, 937.0, 937.0, 0.0483143135985467, 46.24315824024775, 0.09339194564156576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/657d9e77-da9b-4261-acc1-4f4063c3523f", 3, 0, 0.0, 317.6666666666667, 233, 405, 315.0, 405.0, 405.0, 405.0, 0.0233029618064456, 0.027543311952865874, 0.01494363110634695], "isController": false}, {"data": ["register", 20, 4, 20.0, 1128.7, 479, 2029, 1077.5, 1853.900000000001, 2022.5, 2029.0, 0.10204498142781337, 0.03236739254663456, 0.04603982560512674], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/40926ac2-ba2c-4ebc-8ecb-9da7ad351a71", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 248.0, 160, 936, 163.0, 625.0000000000002, 912.4999999999997, 936.0, 0.10326057560395144, 11.910082665315265, 0.22971924648053538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 96.90909090909092, 80, 242, 81.0, 211.2000000000001, 242.0, 242.0, 0.0937758416381787, 0.07280448642807819, 0.03333438120732134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 280.5882352941176, 159, 560, 312.0, 487.19999999999993, 560.0, 560.0, 0.09170204387673088, 0.14212025745348816, 0.20624004594542109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 82.85714285714286, 78, 105, 80.5, 95.0, 105.0, 105.0, 0.06904851151137327, 0.05131437232437018, 0.03465911612973229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 90.42857142857143, 78, 236, 79.5, 158.5, 236.0, 236.0, 0.06905021430227225, 0.033292067610024116, 0.03855175190258001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 206.1428571428571, 77, 933, 79.0, 892.0, 933.0, 933.0, 0.068760252644814, 8.85454205978704, 0.03957935301513708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 167.71428571428572, 78, 625, 79.0, 622.5, 625.0, 625.0, 0.0688647643595331, 2.908556354742077, 0.039706762150941724], "isController": false}, {"data": ["https://demoqa.com/books", 57, 1, 1.7543859649122806, 883.684210526316, 545, 1383, 851.0, 1244.4, 1265.9999999999995, 1383.0, 0.2737357729433799, 323.17099593898575, 0.5381106528838304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 4, 20.0, 1128.7, 479, 2029, 1077.5, 1853.900000000001, 2022.5, 2029.0, 0.10209863749368266, 0.032384411580027465, 0.0460640337129701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 78.69999999999999, 77, 80, 79.0, 80.0, 80.0, 80.0, 0.054756116258186036, 0.014758484460214208, 0.03224408017938104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 94.59999999999998, 78, 234, 79.5, 218.60000000000005, 234.0, 234.0, 0.054755816436600976, 0.014758403648927608, 0.03219043114729862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 185.63636363636365, 79, 778, 80.0, 669.8000000000004, 778.0, 778.0, 0.09147837368084026, 7.505360385810041, 0.05306460348283117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 143.18181818181816, 77, 314, 82.0, 298.00000000000006, 314.0, 314.0, 0.09147913444106248, 0.024656485454817623, 0.053869060613242856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 94.80000000000001, 78, 234, 80.0, 218.80000000000007, 234.0, 234.0, 0.054756116258186036, 0.014651538920647437, 0.031228097553496727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 109.27272727272728, 78, 237, 81.0, 237.0, 237.0, 237.0, 0.0915941546275865, 0.06806948405429035, 0.04597597214705025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 80.0, 79, 82, 80.0, 81.9, 82.0, 82.0, 0.05475551661829929, 0.04069233217434157, 0.027484702677544763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 93.09090909090908, 78, 231, 78.0, 201.8000000000001, 231.0, 231.0, 0.0915956800146553, 0.02450900031642144, 0.052238161258358104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 117.80000000000001, 81, 244, 82.0, 243.4, 244.0, 244.0, 0.053374609698166584, 0.04201165568039284, 0.018973005791145154], "isController": false}, {"data": ["deleteAccount", 10, 0, 0.0, 479.0, 381, 777, 421.0, 755.9000000000001, 777.0, 777.0, 0.09382535348701927, 0.01695086952646344, 0.06386354626997306], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1427.6500000000003, 1011, 2365, 1298.0, 2272.2000000000007, 2362.3, 2365.0, 0.1021627861835048, 0.05287722331763432, 0.04699089091057691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7dc8958-6721-41f2-847b-0d17e1c83d53", 3, 0, 0.0, 682.3333333333334, 196, 1074, 777.0, 1074.0, 1074.0, 1074.0, 0.020254121713768752, 0.02393968617926248, 0.012988483000040508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 176.2, 159, 315, 161.0, 299.80000000000007, 315.0, 315.0, 0.05473154178753216, 0.08482320001641946, 0.12309252025067045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e88cf33-df6d-43b8-bbc2-fc7ad4731f46", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["addBook", 64, 9, 14.0625, 798.8281250000002, 402, 1677, 676.0, 1389.5, 1503.5, 1677.0, 0.2972720643222429, 90.04350234827513, 1.081639211578747], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ae108596-73c1-4c3b-bbd2-5cc337ce7bab", 3, 0, 0.0, 274.3333333333333, 175, 410, 238.0, 410.0, 410.0, 410.0, 0.04768338234125407, 0.03065582035285703, 0.030578210681077644], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 128.9122807017544, 79, 329, 81.0, 321.0, 324.29999999999995, 329.0, 0.2746471747478787, 0.20410791013978097, 0.13276401513691402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b170c3b9-f156-4eff-9b22-974942fea4c0", 3, 0, 0.0, 270.3333333333333, 174, 381, 256.0, 381.0, 381.0, 381.0, 0.08213102636405946, 0.03716215060092534, 0.05266865948476469], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 504.5614035087719, 384, 730, 467.0, 646.2000000000002, 702.1999999999998, 730.0, 0.2742942937162546, 80.65162978029988, 0.13795074342174912], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 104.28070175438597, 78, 284, 81.0, 237.0, 240.0, 284.0, 0.27501025257520567, 0.4866392360022194, 0.1337452204906762], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 1, 1.7543859649122806, 745.2105263157896, 0, 1043, 769.0, 929.0, 1001.8999999999999, 1043.0, 0.2742032471437162, 242.40904521196632, 0.13522248947684906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 92.05882352941177, 80, 239, 82.0, 119.7999999999999, 239.0, 239.0, 0.09649989214717936, 0.07209220458260958, 0.03430269603669266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 9, 4.864864864864865, 131.4702702702703, 79, 446, 85.0, 244.0, 314.49999999999983, 386.65999999999906, 0.7896298130071238, 1.6397114903409067, 0.3821518186028247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 107.14285714285715, 81, 247, 84.0, 242.0, 247.0, 247.0, 0.06893495494608301, 0.053384198508050616, 0.024504222265990448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 84.58823529411765, 79, 92, 85.0, 90.4, 92.0, 92.0, 0.11386546460458544, 0.09240449324844774, 0.04047561437116123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 301.8571428571429, 158, 1016, 164.0, 975.5, 1016.0, 1016.0, 0.06873189650940154, 11.8380527701409, 0.15206740328440277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c77dbbc4-e408-4bc4-9c6c-560e834e80b2", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf674065-af77-452b-a939-8f011ee9bcf5", 3, 0, 0.0, 462.6666666666667, 394, 523, 471.0, 523.0, 523.0, 523.0, 0.017396649405324534, 0.023982685622249155, 0.011156054468909288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 310.45454545454544, 159, 862, 170.0, 784.6000000000003, 862.0, 862.0, 0.09141679409613723, 7.617346570415863, 0.20488431879944816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18ab95e4-c9a3-477b-a320-52044ec3d5a3", 3, 0, 0.0, 263.6666666666667, 171, 394, 226.0, 394.0, 394.0, 394.0, 0.022932799253919597, 0.03161471511730127, 0.014706254729889845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1656f31-910e-45c7-a43f-f8ae279ca617", 2, 0, 0.0, 305.0, 287, 323, 305.0, 323.0, 323.0, 323.0, 0.015523852399211389, 0.026530021190058525, 0.009649347707127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 83.42857142857143, 80, 94, 82.0, 90.0, 94.0, 94.0, 0.07665982203969884, 0.06355877823408625, 0.027250171115674196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0256a5cb-1577-4938-8e9d-761328ceb45f", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.0574037665562914, 1.9757605546357617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/579451a8-6cfb-42fc-84b7-1ca3ca6cd06b", 3, 0, 0.0, 307.3333333333333, 171, 563, 188.0, 563.0, 563.0, 563.0, 0.023191453176456035, 0.027411512527249958, 0.014872123293495569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 93.17647058823529, 80, 234, 84.0, 118.7999999999999, 234.0, 234.0, 0.07948493760432397, 0.06170949745648199, 0.028254411414037037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=657d9e77-da9b-4261-acc1-4f4063c3523f", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0af78de-167f-430b-8e71-f839e3f99643", 2, 0, 0.0, 218.5, 178, 259, 218.5, 259.0, 259.0, 259.0, 0.016964103956029042, 0.028693191456877248, 0.010544582195324692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 99.05882352941177, 78, 239, 80.0, 235.0, 239.0, 239.0, 0.09174212906498581, 0.06817945333833418, 0.04605024837832296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 129.58823529411765, 76, 318, 80.0, 252.39999999999995, 318.0, 318.0, 0.09174311926605505, 0.024548451834862383, 0.05232224770642201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 139.0588235294118, 78, 320, 80.0, 251.99999999999994, 320.0, 320.0, 0.09174311926605505, 0.0247276376146789, 0.05393491972477064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 143.35294117647055, 78, 237, 80.0, 236.2, 237.0, 237.0, 0.09174361437460536, 0.02472777106190535, 0.05402480416785843], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 25.0, 0.29895366218236175], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 6.25, 0.07473841554559044], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07473841554559044], "isController": false}, {"data": ["401/Unauthorized", 9, 56.25, 0.672645739910314], "isController": false}, {"data": ["Assertion failed", 1, 6.25, 0.07473841554559044], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1338, 16, "401/Unauthorized", 9, "406/Not Acceptable", 4, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "Test failed: code expected to contain /200/", 1, "Assertion failed", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 57, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
