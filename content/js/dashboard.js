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

    var data = {"OkPercent": 98.37712519319938, "KoPercent": 1.6228748068006182};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.774867374005305, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13392857142857142, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d98c85c-a85e-483e-976d-c317665618f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e7a6fd4-5d78-42ed-8e28-37dec8dfb4a2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25e243c7-c730-47d6-a0f4-cf4e6afd73e4"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e04aa65c-11af-459b-a866-9cad89b79173"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d67184f9-9c1d-4a60-ab2b-94ebad57ab2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afbe3f0a-3f5f-4b5a-b725-05333ec88b3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b2133ae-45bd-4fd1-afc8-3ba8cae7c1ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4df39bb9-d447-471b-a24c-18adbc8fd6cb"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b2b64db-5024-4bd6-85d6-e56c16de0123"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9a231f41-207b-44e7-b94d-2e3181f53b5d"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b2133ae-45bd-4fd1-afc8-3ba8cae7c1ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea94b4ed-3207-4509-8619-f81e07675787"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/400617be-0ff3-4ebe-904a-ff26770d60f9"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a231f41-207b-44e7-b94d-2e3181f53b5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/313d10ea-b9fe-41f8-98ba-ba493b738335"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=179f4a90-3804-4ac6-80ae-b60818533c1d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7dda77c2-2517-4e54-bdc4-5c4066ea8079"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/179f4a90-3804-4ac6-80ae-b60818533c1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/afbe3f0a-3f5f-4b5a-b725-05333ec88b3c"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25e243c7-c730-47d6-a0f4-cf4e6afd73e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4107142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e04aa65c-11af-459b-a866-9cad89b79173"], "isController": false}, {"data": [0.11904761904761904, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d67184f9-9c1d-4a60-ab2b-94ebad57ab2b"], "isController": false}, {"data": [0.31896551724137934, 500, 1500, "addBook"], "isController": true}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d98c85c-a85e-483e-976d-c317665618f3"], "isController": false}, {"data": [0.6160714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.938953488372093, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4df39bb9-d447-471b-a24c-18adbc8fd6cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b2b64db-5024-4bd6-85d6-e56c16de0123"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ebbf9636-3cd3-4507-876e-6b0ee2b6cf20"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=313d10ea-b9fe-41f8-98ba-ba493b738335"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7dda77c2-2517-4e54-bdc4-5c4066ea8079"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/17eacc3b-6671-4b62-9516-bba395cde432"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1294, 21, 1.6228748068006182, 383.68469860896437, 93, 4844, 124.5, 1016.5, 1303.25, 1940.6499999999867, 5.215260480900216, 736.2897029462796, 3.804664955283373], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1725.8392857142862, 1233, 4314, 1638.0, 2151.2000000000007, 2273.3999999999996, 4314.0, 0.2446974927246192, 294.45254005419395, 1.2031756600277905], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d98c85c-a85e-483e-976d-c317665618f3", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 0.2458014455782313, 0.938031462585034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e7a6fd4-5d78-42ed-8e28-37dec8dfb4a2", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.8272951748704663, 1.545802299222798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25e243c7-c730-47d6-a0f4-cf4e6afd73e4", 3, 0, 0.0, 412.3333333333333, 297, 590, 350.0, 590.0, 590.0, 590.0, 0.03062693332516615, 0.02553241414249691, 0.01964031857115147], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 608.6428571428571, 104, 1323, 499.5, 1268.0, 1323.0, 1323.0, 0.08261634151235114, 0.016274312809073634, 0.05558853447461908], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 608.6428571428571, 104, 1323, 499.5, 1268.0, 1323.0, 1323.0, 0.08417963935037369, 0.01658226154613946, 0.05664040186758543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 141.0, 98, 305, 103.5, 304.3, 305.0, 305.0, 0.08656228697562189, 0.047539517712807976, 0.048004451871368446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 117.25000000000001, 97, 304, 102.5, 180.10000000000014, 304.0, 304.0, 0.0865632236144474, 0.06433067692440866, 0.043450680603345664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 244.18750000000003, 97, 801, 103.5, 789.1, 801.0, 801.0, 0.08656135035706557, 4.7911897620915385, 0.049578351547284134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 311.1875, 97, 1265, 100.0, 1112.4, 1265.0, 1265.0, 0.0865650969529086, 14.62359969965969, 0.04949596119719529], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 252.26666666666668, 99, 456, 228.0, 397.8, 456.0, 456.0, 0.08734234706355029, 0.1585809488872585, 0.05645408995097183], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 113.58823529411765, 98, 298, 102.0, 145.99999999999986, 298.0, 298.0, 0.07773987323827729, 0.05777348001399318, 0.03902177230905715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e04aa65c-11af-459b-a866-9cad89b79173", 1, 0, 0.0, 920.0, 920, 920, 920.0, 920.0, 920.0, 920.0, 1.0869565217391304, 0.19637398097826086, 0.7494055706521738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 147.70588235294122, 97, 310, 100.0, 303.6, 310.0, 310.0, 0.07774093975077169, 0.027670201211844058, 0.04395256945238367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 630.75, 456, 810, 628.5, 810.0, 810.0, 810.0, 0.04412186458999757, 12.973293173244501, 0.02516325089898299], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1062.5, 898, 1311, 1020.5, 1311.0, 1311.0, 1311.0, 0.043816409245262346, 39.42608205991894, 0.024946256435535104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 199.25, 98, 307, 196.0, 307.0, 307.0, 307.0, 0.04440645225751302, 0.07857860497130233, 0.024588338310556523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d67184f9-9c1d-4a60-ab2b-94ebad57ab2b", 3, 0, 0.0, 613.0, 216, 1395, 228.0, 1395.0, 1395.0, 1395.0, 0.05984918006623309, 0.038477256064716914, 0.038379845289869534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 120.63636363636364, 97, 306, 103.0, 266.0000000000001, 306.0, 306.0, 0.05691166275183411, 0.042294702494282965, 0.02856698696722923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 182.72727272727275, 97, 412, 103.0, 390.80000000000007, 412.0, 412.0, 0.05691166275183411, 0.01522831600976811, 0.032457432663155386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afbe3f0a-3f5f-4b5a-b725-05333ec88b3c", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 190.72727272727275, 97, 306, 105.0, 305.8, 306.0, 306.0, 0.05691313503417375, 0.015339868427179645, 0.03345869852594981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 135.45454545454547, 96, 304, 101.0, 300.40000000000003, 304.0, 304.0, 0.05691166275183411, 0.015339471601080287, 0.03351341078062106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b2133ae-45bd-4fd1-afc8-3ba8cae7c1ba", 3, 0, 0.0, 408.3333333333333, 284, 483, 458.0, 483.0, 483.0, 483.0, 0.04391550656536823, 0.02823343927949292, 0.02816196221802585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 103.5, 98, 107, 104.5, 107.0, 107.0, 107.0, 0.04440448041207358, 0.03299981405623827, 0.024934156481388973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4df39bb9-d447-471b-a24c-18adbc8fd6cb", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 145.82352941176472, 97, 861, 102.0, 256.1999999999995, 861.0, 861.0, 0.07774165077535863, 4.134549111287173, 0.045310592185592184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 623.8500000000001, 93, 1447, 604.5, 1208.5, 1435.1, 1447.0, 0.10433403584917472, 46.95403506992989, 0.0568538984412495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b2b64db-5024-4bd6-85d6-e56c16de0123", 2, 0, 0.0, 196.5, 195, 198, 196.5, 198.0, 198.0, 198.0, 0.02329481923220276, 0.026502406646011927, 0.014479641055954156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 175.35294117647058, 94, 778, 102.0, 397.19999999999965, 778.0, 778.0, 0.07774165077535863, 1.3643463213336808, 0.045386511766427495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 461.90000000000003, 99, 905, 405.5, 901.8, 904.85, 905.0, 0.10421768991068543, 15.335775555480287, 0.05689227408210269], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 532.7857142857143, 102, 1107, 528.0, 1013.5, 1107.0, 1107.0, 0.08456557456267517, 0.01665828561418769, 0.057442771002464484], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9a231f41-207b-44e7-b94d-2e3181f53b5d", 3, 0, 0.0, 639.0, 221, 1474, 222.0, 1474.0, 1474.0, 1474.0, 0.023408057053237723, 0.027667530976662167, 0.015011026170207786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 343.0, 203, 608, 400.0, 590.2, 608.0, 608.0, 0.056881350673526905, 0.08815498390516328, 0.1279274908214184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b2133ae-45bd-4fd1-afc8-3ba8cae7c1ba", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea94b4ed-3207-4509-8619-f81e07675787", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.1486904226618704, 2.146329811151079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 650.1904761904761, 125, 1668, 470.0, 1310.4, 1634.8999999999996, 1668.0, 0.09480941051120331, 0.05823742110502625, 0.04286792682293665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 123.10000000000001, 99, 310, 104.0, 265.2000000000004, 308.59999999999997, 310.0, 0.10432587229469974, 0.07753123907838524, 0.05236669761667545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 169.5, 98, 306, 104.0, 302.40000000000003, 305.85, 306.0, 0.10422692285644305, 0.10616082083913095, 0.05506520045442938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/400617be-0ff3-4ebe-904a-ff26770d60f9", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.8701251702997276, 1.6258302111716623], "isController": false}, {"data": ["login", 21, 0, 0.0, 3202.238095238096, 1582, 6010, 2874.0, 4700.6, 5888.499999999998, 6010.0, 0.09035716898081417, 20.71583483838975, 0.16486905874721935], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a231f41-207b-44e7-b94d-2e3181f53b5d", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 125.41176470588236, 97, 269, 105.0, 255.39999999999998, 269.0, 269.0, 0.0797470610862488, 0.06456085316455103, 0.0283475881205025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/313d10ea-b9fe-41f8-98ba-ba493b738335", 3, 0, 0.0, 318.6666666666667, 221, 509, 226.0, 509.0, 509.0, 509.0, 0.018577231744773604, 0.021957659005622708, 0.011913133638412761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 768.7000000000002, 202, 1555, 812.5, 1324.3, 1543.5499999999997, 1555.0, 0.1041590717343527, 62.38594378209401, 0.22093115606153718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 458.62499999999994, 197, 1369, 232.0, 1357.1, 1369.0, 1369.0, 0.08651314188695977, 19.515150233788248, 0.19041973405319476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 634.625, 99, 1410, 554.0, 1410.0, 1410.0, 1410.0, 0.07024075017121183, 42.02557586440023, 0.10246300836742936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=179f4a90-3804-4ac6-80ae-b60818533c1d", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7dda77c2-2517-4e54-bdc4-5c4066ea8079", 3, 0, 0.0, 349.0, 254, 508, 285.0, 508.0, 508.0, 508.0, 0.07903055848261327, 0.035759269625922026, 0.050680403714436245], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1309.1304347826087, 184, 3767, 1277.0, 2224.400000000001, 3506.399999999996, 3767.0, 0.09269969731533616, 0.029204812927980398, 0.04182349624969268], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/179f4a90-3804-4ac6-80ae-b60818533c1d", 3, 0, 0.0, 341.3333333333333, 228, 554, 242.0, 554.0, 554.0, 554.0, 0.02118778735936606, 0.02124986095514545, 0.013587220409489302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 107.47058823529412, 101, 118, 106.0, 117.2, 118.0, 118.0, 0.07701298348298012, 0.05979035338766524, 0.027375708972465596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 320.1764705882353, 200, 1159, 211.0, 562.1999999999995, 1159.0, 1159.0, 0.07770433955882218, 5.581660547449927, 0.1735893877012314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afbe3f0a-3f5f-4b5a-b725-05333ec88b3c", 3, 0, 0.0, 609.6666666666667, 230, 1240, 359.0, 1240.0, 1240.0, 1240.0, 0.07076306168180209, 0.03201844262295082, 0.045378656091520225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 377.8421052631579, 198, 1171, 208.0, 1069.0, 1171.0, 1171.0, 0.10679797196272188, 13.597304150436186, 0.237314798615561], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25e243c7-c730-47d6-a0f4-cf4e6afd73e4", 1, 0, 0.0, 1107.0, 1107, 1107, 1107.0, 1107.0, 1107.0, 1107.0, 0.9033423667570009, 0.16320150180668475, 0.6228122177055104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 151.875, 98, 307, 104.0, 307.0, 307.0, 307.0, 0.062045324109261814, 0.04610985512416821, 0.031143844328281812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 190.75, 99, 404, 102.0, 404.0, 404.0, 404.0, 0.06213833546933862, 0.01662685929550662, 0.03543826944735718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 153.5, 96, 317, 100.0, 317.0, 317.0, 317.0, 0.062040031330215815, 0.016721727194472232, 0.036472752793740154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 200.50000000000003, 95, 309, 202.0, 309.0, 309.0, 309.0, 0.06213978344285471, 0.016748613506081932, 0.03659207950785292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 105.5, 102, 109, 105.5, 109.0, 109.0, 109.0, 0.030487340132010182, 0.00899138351549519, 0.0188461780308227], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1177.8035714285716, 771, 3898, 1052.5, 1702.2000000000005, 1840.6, 3898.0, 0.2538404703301286, 303.681451740847, 0.5012357724682813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1309.1304347826087, 184, 3767, 1277.0, 2224.400000000001, 3506.399999999996, 3767.0, 0.09405568096313018, 0.029632012259953544, 0.04243527793453725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 135.16666666666669, 99, 304, 101.5, 304.0, 304.0, 304.0, 0.03626889760685724, 0.00977560130809824, 0.021357563727475503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 136.83333333333331, 102, 302, 104.0, 302.0, 302.0, 302.0, 0.036313018217030806, 0.009787493191309084, 0.021348082975246627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 148.88235294117646, 96, 310, 102.0, 308.4, 310.0, 310.0, 0.07627183281214248, 0.020557642437647777, 0.044839495461825946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 171.7058823529412, 97, 306, 104.0, 305.2, 306.0, 306.0, 0.07627593942793046, 0.020558749298934382, 0.044916397924845766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 126.1764705882353, 97, 307, 104.0, 301.4, 307.0, 307.0, 0.07634170547370028, 0.05673441197801359, 0.038319957630353466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 132.83333333333334, 98, 292, 101.5, 292.0, 292.0, 292.0, 0.03631411711302769, 0.009716863368134362, 0.020710394916023604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 147.3529411764706, 97, 305, 102.0, 303.4, 305.0, 305.0, 0.07634444818681935, 0.020428104299988772, 0.04354019310654541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 134.66666666666666, 98, 294, 103.5, 294.0, 294.0, 294.0, 0.03631213914811722, 0.026985876847380078, 0.018226991720832274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 108.83333333333333, 103, 117, 107.5, 117.0, 117.0, 117.0, 0.03731969920322442, 0.029374685115037973, 0.013265986826146181], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 696.0769230769231, 102, 1474, 581.0, 1442.3999999999999, 1474.0, 1474.0, 0.08378880065999794, 0.01625799820498608, 0.05701943698759926], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e04aa65c-11af-459b-a866-9cad89b79173", 3, 0, 0.0, 642.3333333333334, 197, 1049, 681.0, 1049.0, 1049.0, 1049.0, 0.032277500430366673, 0.02690842402414357, 0.020698787710879667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 2021.4761904761906, 1122, 4844, 1725.0, 3621.000000000001, 4744.899999999999, 4844.0, 0.09148851819096704, 0.047352455704309106, 0.042081144597603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 305.66666666666663, 207, 597, 209.5, 597.0, 597.0, 597.0, 0.03624545421595042, 0.05617337484444659, 0.08151687603450566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d67184f9-9c1d-4a60-ab2b-94ebad57ab2b", 1, 0, 0.0, 788.0, 788, 788, 788.0, 788.0, 788.0, 788.0, 1.2690355329949237, 0.22926911484771573, 0.8749405139593909], "isController": false}, {"data": ["addBook", 58, 7, 12.068965517241379, 1152.706896551724, 515, 4859, 852.0, 1897.0, 2113.9499999999994, 4859.0, 0.27967172326000794, 93.39433584897245, 1.0154769517952031], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 213.3571428571429, 98, 2590, 104.0, 414.6, 420.65, 2590.0, 0.2546114220502585, 0.18921805876977216, 0.12307876358874799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d98c85c-a85e-483e-976d-c317665618f3", 3, 0, 0.0, 412.3333333333333, 200, 581, 456.0, 581.0, 581.0, 581.0, 0.03797324152247383, 0.031656729016619624, 0.024351330012784323], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 637.6785714285714, 467, 1009, 586.0, 811.0, 969.15, 1009.0, 0.25441246621084435, 74.80571235490538, 0.12795158212752425], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 140.35714285714286, 97, 398, 104.0, 300.8, 309.45, 398.0, 0.25499517330564814, 0.4512219277635102, 0.12401132451778592], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 962.2142857142859, 667, 1508, 949.0, 1277.6000000000001, 1392.3, 1508.0, 0.254341980960686, 228.8573615539387, 0.12766775216190684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 120.26315789473685, 101, 316, 108.0, 130.0, 316.0, 316.0, 0.10412442320549777, 0.07778826538301348, 0.03701297856132929], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, 4.069767441860465, 198.25000000000003, 94, 3321, 109.0, 357.70000000000005, 475.2499999999999, 1455.1200000000263, 0.742377680328718, 1.625902715882998, 0.3563014970563862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4df39bb9-d447-471b-a24c-18adbc8fd6cb", 3, 0, 0.0, 475.33333333333337, 271, 850, 305.0, 850.0, 850.0, 850.0, 0.023860464006490046, 0.028147891132656228, 0.015301143910411912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 113.875, 106, 142, 109.5, 142.0, 142.0, 142.0, 0.06766243212612277, 0.052398738941421254, 0.024051880169832705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b2b64db-5024-4bd6-85d6-e56c16de0123", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 111.375, 94, 148, 107.0, 138.20000000000002, 148.0, 148.0, 0.08589819989584843, 0.06970840245454106, 0.030534125744227373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebbf9636-3cd3-4507-876e-6b0ee2b6cf20", 1, 0, 0.0, 1246.0, 1246, 1246, 1246.0, 1246.0, 1246.0, 1246.0, 0.8025682182985554, 0.25628887439807385, 0.4788761536918138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 397.5, 200, 614, 414.5, 614.0, 614.0, 614.0, 0.061899382553659024, 0.09593195323501649, 0.13921316212995777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 324.35294117647055, 202, 614, 215.0, 609.2, 614.0, 614.0, 0.07623523502874517, 0.11814972460021346, 0.17145483034296888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=313d10ea-b9fe-41f8-98ba-ba493b738335", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7dda77c2-2517-4e54-bdc4-5c4066ea8079", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 113.81818181818183, 103, 140, 109.0, 137.8, 140.0, 140.0, 0.057296739815504504, 0.04750481650719074, 0.020367200481292615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 148.54999999999998, 94, 319, 105.5, 313.0, 318.7, 319.0, 0.10341047754958532, 0.08028450161320345, 0.03675919319145416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 124.57894736842105, 98, 305, 104.0, 296.0, 305.0, 305.0, 0.10685743530907106, 0.07941260573262021, 0.053637423582873565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17eacc3b-6671-4b62-9516-bba395cde432", 2, 0, 0.0, 282.0, 237, 327, 282.0, 327.0, 327.0, 327.0, 0.021196994266213052, 0.03018087660169788, 0.013175670752387313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 152.68421052631578, 95, 320, 103.0, 305.0, 320.0, 320.0, 0.10686044026501389, 0.04548818700014623, 0.059999149334653154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 239.0526315789473, 97, 1059, 102.0, 968.0, 1059.0, 1059.0, 0.10686164229471316, 10.147275291760405, 0.06185628163667041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 173.47368421052633, 96, 800, 102.0, 594.0, 800.0, 800.0, 0.10686164229471316, 3.333230807086614, 0.061960638709223845], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 28.571428571428573, 0.46367851622874806], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.1545595054095827], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.523809523809524, 0.1545595054095827], "isController": false}, {"data": ["401/Unauthorized", 11, 52.38095238095238, 0.8500772797527048], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1294, 21, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
