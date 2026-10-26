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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5546577946768061, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3bb877a-e187-4192-84a4-60752689f234"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.47959183673469385, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.0, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a78b2247-8529-45a0-890f-0daf9efbac33"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/a78b2247-8529-45a0-890f-0daf9efbac33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/3913d8ba-1840-425e-b39b-1283c48b983c"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/48e5add1-d0a1-4b7a-bcaa-e4de28cde103"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.7755102040816326, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bce67be-fba3-40d1-bb31-406625bd6773"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.4897959183673469, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.0, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.05405405405405406, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.0625, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/485f9794-9c77-4e73-bb3f-4bd6427f21c7"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e066df85-6a57-499a-acee-f5f3baadad9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.10714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.038461538461538464, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e066df85-6a57-499a-acee-f5f3baadad9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.11764705882352941, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf42a7d9-e8b2-4158-8d11-43632887baf1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5389595-f1a4-48cd-ba01-32bac41a7b9a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf42a7d9-e8b2-4158-8d11-43632887baf1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/8dd8f9a3-7ad3-4947-924e-69b1fdc1e42e"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/a94c8690-2827-4c62-83a4-56e934bc60c3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f7967fb-7803-42fd-9b12-35a3d208964b"], "isController": false}, {"data": [0.11538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f7967fb-7803-42fd-9b12-35a3d208964b"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3bb877a-e187-4192-84a4-60752689f234"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dd8f9a3-7ad3-4947-924e-69b1fdc1e42e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a94c8690-2827-4c62-83a4-56e934bc60c3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/15f7238b-0a8f-41e9-b112-8be483172c6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.0, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 917, 0, 0.0, 1766.3369683751366, 79, 16380, 331.0, 5863.400000000003, 8879.399999999994, 13060.319999999992, 3.536062438302073, 546.7086596173572, 2.5912489142610906], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 49, 0, 0.0, 8069.34693877551, 2610, 13217, 7625.0, 11624.0, 12809.0, 13217.0, 0.2144927028707003, 258.1070812071015, 1.0546589442909922], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 6, 0, 0.0, 3780.1666666666665, 1304, 6116, 3613.0, 6116.0, 6116.0, 6116.0, 0.031823148157970105, 0.024706448032799058, 0.011312134696778437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 229.76470588235298, 162, 482, 164.0, 481.2, 482.0, 482.0, 0.08816101312561907, 0.13663235139683347, 0.19827618479326242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3bb877a-e187-4192-84a4-60752689f234", 1, 0, 0.0, 6218.0, 6218, 6218, 6218.0, 6218.0, 6218.0, 6218.0, 0.16082341588935348, 0.029055011659697653, 0.11088020665808943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 9, 0, 0.0, 226.00000000000003, 163, 404, 165.0, 404.0, 404.0, 404.0, 0.05129169587443793, 0.07949211069602831, 0.11535622617073295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 81.125, 81, 82, 81.0, 82.0, 82.0, 82.0, 0.04354547235951142, 0.03236143014217597, 0.02185778593045788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 80.875, 80, 82, 81.0, 82.0, 82.0, 82.0, 0.04354570938682198, 0.011651879269520726, 0.02483466238467191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 80.125, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.043546183449184324, 0.011737057257787963, 0.02560039300430563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 81.00000000000001, 80, 82, 81.0, 82.0, 82.0, 82.0, 0.043546183449184324, 0.011737057257787963, 0.025642918574080225], "isController": false}, {"data": ["https://demoqa.com/books", 49, 0, 0.0, 1002.2653061224489, 638, 1634, 955.0, 1283.0, 1479.0, 1634.0, 0.22397235541213198, 267.9488024620961, 0.4422579127376278], "isController": false}, {"data": ["deleteBook", 7, 0, 0.0, 7954.857142857143, 3939, 14444, 8702.0, 14444.0, 14444.0, 14444.0, 0.09585889570552147, 0.017318257524923313, 0.06515409317484662], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 7, 0, 0.0, 7954.857142857143, 3939, 14444, 8702.0, 14444.0, 14444.0, 14444.0, 0.09549795361527967, 0.017253048260572987, 0.06490876534788541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 15, 0, 0.0, 8882.866666666669, 5180, 13083, 9303.0, 12093.0, 13083.0, 13083.0, 0.05960896518836433, 0.019326344182164997, 0.026893888590844066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 80.99999999999999, 80, 83, 80.0, 83.0, 83.0, 83.0, 0.0380343830823064, 0.010251454815152898, 0.022397200193975352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 138.21428571428572, 80, 251, 81.0, 245.5, 251.0, 251.0, 0.0829560806807139, 0.02219723252589415, 0.04731088976321964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 81.14285714285714, 79, 83, 81.0, 83.0, 83.0, 83.0, 0.0380345897426145, 0.010251510516564064, 0.022360178735404225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 105.78571428571429, 80, 246, 82.0, 242.5, 246.0, 246.0, 0.08295509759074694, 0.06164924733062347, 0.04163957047035541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 195.28571428571428, 80, 252, 238.5, 247.0, 252.0, 252.0, 0.08295558913281782, 0.022359123633454808, 0.048849824460048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 138.35714285714286, 80, 242, 82.0, 241.5, 242.0, 242.0, 0.0829560806807139, 0.022359256120973666, 0.048769102118935315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 6, 0, 0.0, 134.16666666666666, 80, 241, 81.5, 241.0, 241.0, 241.0, 0.03264417845484222, 0.008798626224156692, 0.019191206474428724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 6, 0, 0.0, 107.0, 80, 239, 80.5, 239.0, 239.0, 239.0, 0.032672620344151596, 0.008806292202134611, 0.019239834050315836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 80.57142857142858, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.0380345897426145, 0.010177224208473019, 0.02169160196258483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 6, 0, 0.0, 108.5, 82, 239, 82.5, 239.0, 239.0, 239.0, 0.03267208660281089, 0.024280720610096763, 0.01639985597055156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 81.85714285714285, 81, 83, 82.0, 83.0, 83.0, 83.0, 0.03803417642424407, 0.028265633065282948, 0.019091373712950638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 6, 0, 0.0, 133.83333333333331, 80, 241, 81.0, 241.0, 241.0, 241.0, 0.032672620344151596, 0.008742478490524942, 0.01863360379002396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 2629.285714285714, 94, 5104, 1998.0, 5104.0, 5104.0, 5104.0, 0.037225528203655545, 0.02930056223842419, 0.013232511978643183], "isController": false}, {"data": ["deleteAccount", 6, 0, 0.0, 11444.666666666668, 7751, 14500, 11722.0, 14500.0, 14500.0, 14500.0, 0.08482843449124147, 0.015325449590702804, 0.05773966683632354], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a78b2247-8529-45a0-890f-0daf9efbac33", 1, 0, 0.0, 14191.0, 14191, 14191, 14191.0, 14191.0, 14191.0, 14191.0, 0.07046719751955464, 0.012730890176872666, 0.048583829539849195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 13, 0, 0.0, 10464.153846153848, 7537, 16380, 9682.0, 15315.199999999999, 16380.0, 16380.0, 0.05816268550541137, 0.030103733708855492, 0.026752563352586675], "isController": false}, {"data": ["goToProfile", 7, 0, 0.0, 3824.8571428571427, 2007, 4833, 4399.0, 4833.0, 4833.0, 4833.0, 0.11346873936230568, 0.2167271917702744, 0.07335576704867809], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 164.85714285714283, 163, 167, 165.0, 167.0, 167.0, 167.0, 0.03801703163017032, 0.058918973825273724, 0.08550119516043188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a78b2247-8529-45a0-890f-0daf9efbac33", 3, 0, 0.0, 7869.0, 4719, 12957, 5931.0, 12957.0, 12957.0, 12957.0, 0.015063870812243915, 0.015108003246264162, 0.009660099446653813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 99.82352941176472, 80, 240, 81.0, 239.2, 240.0, 240.0, 0.08819851930250536, 0.06554596991133455, 0.044271522384265384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 80.70588235294117, 79, 83, 81.0, 82.2, 83.0, 83.0, 0.08819943448597888, 0.023600239305818567, 0.05030123998028483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3913d8ba-1840-425e-b39b-1283c48b983c", 1, 0, 0.0, 2133.0, 2133, 2133, 2133.0, 2133.0, 2133.0, 2133.0, 0.46882325363338023, 0.14971211322081576, 0.27973731247069855], "isController": false}, {"data": ["addBook", 31, 0, 0.0, 15954.870967741936, 5824, 25887, 17329.0, 21319.8, 25730.4, 25887.0, 0.1564352938208059, 60.95739937362804, 0.5669843075845886], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 6, 0, 0.0, 108.0, 82, 238, 82.0, 238.0, 238.0, 238.0, 0.03422957777815811, 0.025438192079275702, 0.017181643533177016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 6, 0, 0.0, 80.33333333333333, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.03422977305660463, 0.009159138493661787, 0.019521667446344832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 6, 0, 0.0, 108.0, 81, 240, 81.5, 240.0, 240.0, 240.0, 0.03422996833727929, 0.009226046153407308, 0.02012347747953333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48e5add1-d0a1-4b7a-bcaa-e4de28cde103", 1, 0, 0.0, 3096.0, 3096, 3096, 3096.0, 3096.0, 3096.0, 3096.0, 0.32299741602067183, 0.10314468265503876, 0.19272599725452197], "isController": false}, {"data": ["https://demoqa.com/books-0", 49, 0, 0.0, 162.8571428571429, 80, 400, 83.0, 327.0, 362.5, 400.0, 0.22501733551921602, 0.16722479719738612, 0.10877302840040227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 6, 0, 0.0, 107.66666666666666, 80, 240, 81.5, 240.0, 240.0, 240.0, 0.03422996833727929, 0.009226046153407308, 0.020156905182987708], "isController": false}, {"data": ["https://demoqa.com/books-3", 49, 0, 0.0, 544.3469387755099, 395, 806, 479.0, 711.0, 739.5, 806.0, 0.22490682431564066, 66.13007395819946, 0.11311231886968257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bce67be-fba3-40d1-bb31-406625bd6773", 1, 0, 0.0, 4807.0, 4807, 4807, 4807.0, 4807.0, 4807.0, 4807.0, 0.20802995631370916, 0.06643144112752236, 0.12412724932390264], "isController": false}, {"data": ["https://demoqa.com/books-1", 49, 0, 0.0, 134.9591836734694, 79, 331, 84.0, 243.0, 283.0, 331.0, 0.225150713130422, 0.39841122284406705, 0.109497124159131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 118.94117647058823, 79, 242, 81.0, 240.4, 242.0, 242.0, 0.08820080729680091, 0.02377287384171587, 0.051852427727220846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 706.7692307692308, 80, 1030, 862.0, 1026.8, 1030.0, 1030.0, 0.08377962092943822, 57.99371119150732, 0.04371493742306775], "isController": false}, {"data": ["https://demoqa.com/books-2", 49, 0, 0.0, 837.612244897959, 555, 1549, 844.0, 1025.0, 1250.0, 1549.0, 0.22435383805315812, 201.87397785221262, 0.11261511011652664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 109.17647058823529, 79, 241, 81.0, 240.2, 241.0, 241.0, 0.08819943448597888, 0.023772503826298995, 0.051937752924848896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 9, 0, 0.0, 3804.1111111111113, 1181, 6903, 3580.0, 6903.0, 6903.0, 6903.0, 0.04993480733486837, 0.0373048121202874, 0.01775026354481649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 499.69230769230757, 79, 714, 633.0, 683.1999999999999, 714.0, 714.0, 0.08386555706083478, 18.97387668537514, 0.04384167755306109], "isController": false}, {"data": ["deleteBooks", 7, 0, 0.0, 8113.428571428571, 4824, 14191, 7372.0, 14191.0, 14191.0, 14191.0, 0.10048664245417091, 0.018154325052755486, 0.0692808296607858], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 111, 0, 0.0, 4945.729729729729, 82, 14990, 4210.0, 10818.8, 11255.8, 14889.919999999996, 0.45364448168052807, 1.1724337541124303, 0.20733768671965996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 4255.875, 901, 6853, 4437.0, 6853.0, 6853.0, 6853.0, 0.04141429828648341, 0.032071814981622405, 0.0147214888440234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/485f9794-9c77-4e73-bb3f-4bd6427f21c7", 1, 0, 0.0, 2492.0, 2492, 2492, 2492.0, 2492.0, 2492.0, 2492.0, 0.4012841091492777, 0.12814443719903693, 0.2394380768459069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e066df85-6a57-499a-acee-f5f3baadad9e", 1, 0, 0.0, 10183.0, 10183, 10183, 10183.0, 10183.0, 10183.0, 10183.0, 0.09820288716488265, 0.017741732544436808, 0.06770628743985073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 6, 0, 0.0, 217.16666666666669, 164, 478, 165.0, 478.0, 478.0, 478.0, 0.03421357252422036, 0.05302435507415792, 0.07694712648757762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 3264.2142857142853, 339, 7348, 3051.5, 6390.5, 7348.0, 7348.0, 0.07589433340380664, 0.06159003033062824, 0.026978063827134392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 13, 0, 0.0, 4016.9230769230767, 1336, 6278, 4081.0, 6210.8, 6278.0, 6278.0, 0.05769674590353104, 0.03544067692707131, 0.026087493509116086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 142.30769230769232, 81, 243, 82.0, 241.8, 243.0, 243.0, 0.08377962092943822, 0.062262003444631335, 0.04205344253684692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e066df85-6a57-499a-acee-f5f3baadad9e", 3, 0, 0.0, 7492.333333333334, 2007, 14500, 5970.0, 14500.0, 14500.0, 14500.0, 0.01528234125468022, 0.012740259099360688, 0.00980019930720053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 142.46153846153848, 80, 245, 82.0, 243.8, 245.0, 245.0, 0.08377908100792679, 0.11921148981761939, 0.042367846555390866], "isController": false}, {"data": ["login", 13, 0, 0.0, 19860.307692307688, 14896, 27749, 19271.0, 25332.6, 27749.0, 27749.0, 0.05668341007395005, 0.08225737047840798, 0.08552330914477815], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 163.75, 163, 165, 164.0, 165.0, 165.0, 165.0, 0.04352604489711531, 0.06745686840988477, 0.09789109511528961], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 2691.4705882352937, 584, 6605, 2460.0, 5739.4, 6605.0, 6605.0, 0.08569930633973222, 0.06937961421449024, 0.030463425300451687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 6, 0, 0.0, 270.33333333333337, 164, 481, 244.5, 481.0, 481.0, 481.0, 0.032629266276565656, 0.05056898982510714, 0.07338398460442454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf42a7d9-e8b2-4158-8d11-43632887baf1", 1, 0, 0.0, 5064.0, 5064, 5064, 5064.0, 5064.0, 5064.0, 5064.0, 0.19747235387045814, 0.035676157681674564, 0.1361479314770932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5389595-f1a4-48cd-ba01-32bac41a7b9a", 1, 0, 0.0, 7688.0, 7688, 7688, 7688.0, 7688.0, 7688.0, 7688.0, 0.1300728407908429, 0.04153693255723205, 0.07761182199531738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf42a7d9-e8b2-4158-8d11-43632887baf1", 2, 0, 0.0, 4523.0, 2889, 6157, 4523.0, 6157.0, 6157.0, 6157.0, 0.0149774589243189, 0.01737619258016685, 0.009309719341141583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 6, 0, 0.0, 3380.3333333333335, 2302, 5509, 2823.5, 5509.0, 5509.0, 5509.0, 0.03562353052936566, 0.029535524823663523, 0.012663051867860452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dd8f9a3-7ad3-4947-924e-69b1fdc1e42e", 3, 0, 0.0, 8828.333333333334, 4399, 13149, 8937.0, 13149.0, 13149.0, 13149.0, 0.018278639581784727, 0.015238149729476133, 0.011721653638058565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 850.3076923076924, 165, 1274, 951.0, 1269.2, 1274.0, 1274.0, 0.08365023904664466, 77.01050760613929, 0.17166773441370836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a94c8690-2827-4c62-83a4-56e934bc60c3", 3, 0, 0.0, 6765.666666666667, 4833, 10487, 4977.0, 10487.0, 10487.0, 10487.0, 0.020544568016216513, 0.017127161031748207, 0.013174739255190927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f7967fb-7803-42fd-9b12-35a3d208964b", 3, 0, 0.0, 6099.333333333333, 3237, 9824, 5237.0, 9824.0, 9824.0, 9824.0, 0.025966382190524002, 0.016693881779389616, 0.01665161878754306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 3399.538461538462, 929, 7851, 3241.0, 7044.599999999999, 7851.0, 7851.0, 0.07764624371364065, 0.06028199585189875, 0.0276008131950832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f7967fb-7803-42fd-9b12-35a3d208964b", 1, 0, 0.0, 4824.0, 4824, 4824, 4824.0, 4824.0, 4824.0, 4824.0, 0.20729684908789386, 0.037451090899668325, 0.14292146040630183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3bb877a-e187-4192-84a4-60752689f234", 3, 0, 0.0, 5080.0, 2799, 7751, 4690.0, 7751.0, 7751.0, 7751.0, 0.027160136162815963, 0.017461350560404144, 0.01741714460961831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dd8f9a3-7ad3-4947-924e-69b1fdc1e42e", 1, 0, 0.0, 8942.0, 8942, 8942, 8942.0, 8942.0, 8942.0, 8942.0, 0.11183180496533214, 0.020203988201744575, 0.07710278740773877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 302.0714285714286, 165, 499, 321.0, 490.0, 499.0, 499.0, 0.08291481095423103, 0.12850176268004357, 0.1864773531519473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a94c8690-2827-4c62-83a4-56e934bc60c3", 1, 0, 0.0, 7372.0, 7372, 7372, 7372.0, 7372.0, 7372.0, 7372.0, 0.13564839934888767, 0.024506790897992403, 0.09352321283233858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15f7238b-0a8f-41e9-b112-8be483172c6c", 1, 0, 0.0, 9706.0, 9706, 9706, 9706.0, 9706.0, 9706.0, 9706.0, 0.10302905419328251, 0.032900879610550174, 0.06147534385946837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 9, 0, 0.0, 81.66666666666666, 80, 83, 82.0, 83.0, 83.0, 83.0, 0.051362533885004995, 0.03817078934227422, 0.025781584391496647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 9, 0, 0.0, 98.22222222222223, 79, 239, 81.0, 239.0, 239.0, 239.0, 0.051362827009998634, 0.01374356894603479, 0.029292862279139846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 9, 0, 0.0, 80.55555555555556, 79, 83, 80.0, 83.0, 83.0, 83.0, 0.051363413270023174, 0.013844044982935932, 0.030196069129447212], "isController": false}, {"data": ["register", 15, 0, 0.0, 8882.866666666669, 5180, 13083, 9303.0, 12093.0, 13083.0, 13083.0, 0.06290204892940714, 0.020394023676331217, 0.028379635356822357], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 9, 0, 0.0, 125.55555555555556, 79, 323, 81.0, 323.0, 323.0, 323.0, 0.05131596952971765, 0.013831257412306711, 0.03021829065080053], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 917, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
