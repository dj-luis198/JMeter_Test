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

    var data = {"OkPercent": 98.2932505818464, "KoPercent": 1.7067494181536074};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7156208277703605, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=028870f1-eb6a-458b-9671-2d0301482c7f"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4eff6b86-6a0f-4c49-ac9f-fb05c1b26bae"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c5c3e85-59a3-4bb5-b85c-1e850a6bf96b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73b5632c-3bf0-4b85-a3e3-cccd9ceb84b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/82db26bd-0618-40c3-b2fb-7cfe40ddeb43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f5f31818-6fc8-41ce-8f4d-2a6785cd8445"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc1d0cc5-9c55-4cbf-a1de-0590972acc12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/70e744dc-3afe-461b-9197-611704dc373d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3cdaf55-2bc2-4b8f-8207-a4f98772066a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/df3e1601-b976-48b9-a92a-33e763b705a9"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df3e1601-b976-48b9-a92a-33e763b705a9"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/73b5632c-3bf0-4b85-a3e3-cccd9ceb84b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/33df1ee1-ea53-416f-a98e-99da123ff2ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c28e67d8-d6da-4389-a5d5-14a2b7074c4c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a62883dd-03fe-47ca-af43-4cc4d2755f45"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23ae995f-246c-4399-890f-143261451140"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80cab9be-0241-4f89-bcd5-8a99a44b3316"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cab90f19-3472-4dfc-90d5-5e32544223ed"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc1d0cc5-9c55-4cbf-a1de-0590972acc12"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3cdaf55-2bc2-4b8f-8207-a4f98772066a"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.23275862068965517, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/add043b8-4d52-4718-90be-3311576053bf"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/028870f1-eb6a-458b-9671-2d0301482c7f"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70e744dc-3afe-461b-9197-611704dc373d"], "isController": false}, {"data": [0.21296296296296297, 500, 1500, "addBook"], "isController": true}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c5c3e85-59a3-4bb5-b85c-1e850a6bf96b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3017241379310345, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9156626506024096, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a62883dd-03fe-47ca-af43-4cc4d2755f45"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c28e67d8-d6da-4389-a5d5-14a2b7074c4c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33df1ee1-ea53-416f-a98e-99da123ff2ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/23ae995f-246c-4399-890f-143261451140"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80cab9be-0241-4f89-bcd5-8a99a44b3316"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1289, 22, 1.7067494181536074, 487.77579519006997, 135, 3082, 155.0, 1392.0, 1672.5, 2123.7999999999975, 4.9896838576565905, 725.6651450114773, 3.6453600464323177], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=028870f1-eb6a-458b-9671-2d0301482c7f", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["see books", 58, 0, 0.0, 2322.913793103448, 1698, 3182, 2254.0, 2845.4, 2952.2999999999997, 3182.0, 0.26061559200179735, 313.6079760868344, 1.281444829813525], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4eff6b86-6a0f-4c49-ac9f-fb05c1b26bae", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.5412473516949153, 1.0113215042372883], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 702.3846153846154, 145, 1064, 618.0, 1055.2, 1064.0, 1064.0, 0.08164905977967316, 0.015468669528570891, 0.05519530415844943], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 702.3846153846154, 145, 1064, 618.0, 1055.2, 1064.0, 1064.0, 0.08239059479671705, 0.015609155654846786, 0.05569658673194537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 175.2941176470588, 140, 423, 142.0, 419.8, 423.0, 423.0, 0.10981415569063414, 0.029383865878157965, 0.0626283856673148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 161.11764705882354, 137, 423, 145.0, 208.5999999999998, 423.0, 423.0, 0.10981628381695563, 0.08161151561006176, 0.05512262683780781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 247.41176470588238, 138, 560, 143.0, 454.3999999999999, 560.0, 560.0, 0.10981983087746044, 0.02959987629119051, 0.06466929494053579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 200.64705882352945, 136, 575, 142.0, 454.9999999999999, 575.0, 575.0, 0.10981486505690993, 0.029598537847370255, 0.06455912965259744], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 282.61538461538464, 141, 413, 268.0, 397.4, 413.0, 413.0, 0.0812555863215596, 0.14949147871103638, 0.05252436300308146], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2c5c3e85-59a3-4bb5-b85c-1e850a6bf96b", 3, 0, 0.0, 450.66666666666663, 240, 824, 288.0, 824.0, 824.0, 824.0, 0.03724533502178852, 0.02316921719617118, 0.023884541013321416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73b5632c-3bf0-4b85-a3e3-cccd9ceb84b7", 1, 0, 0.0, 1039.0, 1039, 1039, 1039.0, 1039.0, 1039.0, 1039.0, 0.9624639076034649, 0.17388263955726663, 0.6635737487969202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 143.33333333333331, 138, 156, 143.0, 151.2, 156.0, 156.0, 0.0850933474021001, 0.06323831774706853, 0.04271287164519478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 898.2, 699, 1274, 837.0, 1274.0, 1274.0, 1274.0, 0.0239697789027594, 7.047910868976395, 0.01367026453047997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 160.26666666666668, 137, 421, 141.0, 256.6000000000001, 421.0, 421.0, 0.08509576109648725, 0.03129042048652083, 0.04805472862961786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1561.0, 1127, 1813, 1539.0, 1813.0, 1813.0, 1813.0, 0.0239053729716291, 21.510096621035295, 0.013610187932089617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 252.2, 138, 424, 150.0, 424.0, 424.0, 424.0, 0.024066346102936575, 0.04258615150246199, 0.013325799062856483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82db26bd-0618-40c3-b2fb-7cfe40ddeb43", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.5753800675675675, 1.075098536036036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5f31818-6fc8-41ce-8f4d-2a6785cd8445", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.64252703722334, 1.2005627515090542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 142.6, 139, 145, 142.5, 144.9, 145.0, 145.0, 0.05393597799412098, 0.040083280521021544, 0.027073332704080258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 168.7, 139, 418, 141.5, 390.4000000000001, 418.0, 418.0, 0.05393743257820928, 0.014432477076591154, 0.030761192017259978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 223.1, 137, 423, 141.0, 422.4, 423.0, 423.0, 0.05385667661219961, 0.014516057368131928, 0.031661835273968916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc1d0cc5-9c55-4cbf-a1de-0590972acc12", 3, 0, 0.0, 382.0, 268, 592, 286.0, 592.0, 592.0, 592.0, 0.016293190532570088, 0.022461478484841903, 0.010448432730847354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 281.8, 140, 424, 281.5, 424.0, 424.0, 424.0, 0.05385464630961036, 0.014515510138137167, 0.03171323410614751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70e744dc-3afe-461b-9197-611704dc373d", 3, 0, 0.0, 751.0, 236, 1411, 606.0, 1411.0, 1411.0, 1411.0, 0.036039066347921145, 0.03004428675684442, 0.02311098981295725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3cdaf55-2bc2-4b8f-8207-a4f98772066a", 3, 0, 0.0, 395.0, 316, 548, 321.0, 548.0, 548.0, 548.0, 0.020428174538323254, 0.020488022705916, 0.013100098906411723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 143.2, 139, 151, 142.0, 151.0, 151.0, 151.0, 0.024065882760645543, 0.017884899200050056, 0.013513557214229675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 893.8888888888887, 138, 1922, 966.0, 1695.2000000000003, 1922.0, 1922.0, 0.10411485024814039, 46.855393736696435, 0.05673445941256088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df3e1601-b976-48b9-a92a-33e763b705a9", 3, 0, 0.0, 999.3333333333334, 267, 2183, 548.0, 2183.0, 2183.0, 2183.0, 0.023025204924323826, 0.023092661579375555, 0.014765512272434224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 301.3333333333333, 139, 1966, 143.0, 1043.2000000000005, 1966.0, 1966.0, 0.08509576109648725, 5.12602793020162, 0.04953947237791595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 663.6111111111112, 140, 1271, 697.5, 1155.8000000000002, 1271.0, 1271.0, 0.10411485024814039, 15.320642558535683, 0.05683613407100633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 327.2, 139, 1126, 145.0, 786.4000000000002, 1126.0, 1126.0, 0.08495887990212736, 1.686754574327692, 0.04954275307834341], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 526.8461538461538, 149, 1039, 472.0, 1035.8, 1039.0, 1039.0, 0.08244493629543191, 0.015619450821595498, 0.05638980956805195], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 453.9, 285, 568, 561.0, 568.0, 568.0, 568.0, 0.053812334863397385, 0.08339860881661294, 0.12102520233437909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df3e1601-b976-48b9-a92a-33e763b705a9", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 665.4545454545455, 154, 1547, 575.5, 1229.1999999999998, 1507.2499999999995, 1547.0, 0.09141679409613723, 0.05615347996725616, 0.04133396061182767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 143.44444444444443, 138, 161, 143.0, 147.50000000000003, 161.0, 161.0, 0.10411545246840385, 0.07737486262544466, 0.05226107672730428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73b5632c-3bf0-4b85-a3e3-cccd9ceb84b7", 3, 0, 0.0, 417.33333333333337, 268, 678, 306.0, 678.0, 678.0, 678.0, 0.04477879276374709, 0.029079977722550603, 0.028715566974147712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 157.94444444444443, 138, 431, 141.0, 179.9000000000004, 431.0, 431.0, 0.10411665692983116, 0.10604850896270888, 0.05500694472562368], "isController": false}, {"data": ["login", 22, 0, 0.0, 3068.545454545455, 1810, 4574, 2998.0, 4101.8, 4506.049999999999, 4574.0, 0.0908096505892308, 24.8160790160052, 0.17123552721193736], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/33df1ee1-ea53-416f-a98e-99da123ff2ad", 3, 0, 0.0, 444.6666666666667, 351, 570, 413.0, 570.0, 570.0, 570.0, 0.02840962897024565, 0.02340650095172257, 0.01821841441125779], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 149.33333333333331, 142, 183, 145.0, 170.4, 183.0, 183.0, 0.08200395805770892, 0.0663879699510163, 0.029149844465826216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c28e67d8-d6da-4389-a5d5-14a2b7074c4c", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 0.6843335700757576, 2.611564867424242], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a62883dd-03fe-47ca-af43-4cc4d2755f45", 3, 0, 0.0, 605.6666666666666, 279, 831, 707.0, 831.0, 831.0, 831.0, 0.01873688418107325, 0.025830307456655342, 0.012015514920805437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1055.1666666666667, 283, 2066, 1112.0, 1836.5000000000005, 2066.0, 2066.0, 0.10402940564532909, 62.30828044268847, 0.22065612213052224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1259.0, 141, 1958, 1682.0, 1958.0, 1958.0, 1958.0, 0.03344433667935959, 28.58188099310569, 0.06019793970941649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 430.1764705882353, 283, 849, 296.0, 744.9999999999999, 849.0, 849.0, 0.109709978445216, 0.1700290388599197, 0.24674031285091058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23ae995f-246c-4399-890f-143261451140", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 0.6642061121323529, 2.5347541360294117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80cab9be-0241-4f89-bcd5-8a99a44b3316", 1, 0, 0.0, 1031.0, 1031, 1031, 1031.0, 1031.0, 1031.0, 1031.0, 0.9699321047526673, 0.17523187439379245, 0.6687227206595538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cab90f19-3472-4dfc-90d5-5e32544223ed", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 1.0202426118210863, 1.9063248801916932], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1238.869565217391, 147, 2101, 1235.0, 2025.0000000000002, 2097.4, 2101.0, 0.09212418339922215, 0.029023498676215537, 0.04156384055707093], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 146.42105263157893, 140, 158, 145.0, 156.0, 158.0, 158.0, 0.08684999634315806, 0.0674274873953229, 0.03087245963760696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 547.7333333333335, 284, 2116, 551.0, 1267.0000000000005, 2116.0, 2116.0, 0.08488868264083033, 6.893215254354789, 0.18946866581872304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc1d0cc5-9c55-4cbf-a1de-0590972acc12", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3cdaf55-2bc2-4b8f-8207-a4f98772066a", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 561.3749999999999, 280, 1649, 422.0, 1461.4, 1649.0, 1649.0, 0.09941346058256288, 15.00144508726638, 0.2204037196167611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 141.85714285714286, 140, 144, 142.0, 144.0, 144.0, 144.0, 0.04841141402824461, 0.03597762312059975, 0.02430026055714622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 220.85714285714286, 138, 421, 143.0, 421.0, 421.0, 421.0, 0.048318849183066316, 0.0232965879989784, 0.026977125339094778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 397.0, 138, 1935, 142.0, 1935.0, 1935.0, 1935.0, 0.04841208365608056, 6.234224198520664, 0.027866665341097708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 281.71428571428567, 140, 840, 141.0, 840.0, 840.0, 840.0, 0.04831718158977332, 2.0407133729879345, 0.027859223146000717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 149.0, 149, 149, 149.0, 149.0, 149.0, 149.0, 6.7114093959731544, 1.9793414429530203, 4.148752097315437], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1615.3965517241381, 1097, 2601, 1540.0, 2253.9, 2331.1, 2601.0, 0.2593268233358372, 310.2450373005866, 0.5120691765479128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1238.869565217391, 147, 2101, 1235.0, 2025.0000000000002, 2097.4, 2101.0, 0.09065396985558428, 0.028560311494923378, 0.040900521555937444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 140.4, 137, 147, 140.0, 146.6, 147.0, 147.0, 0.05902525690743069, 0.015909151275830927, 0.034758037026543655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 172.1, 139, 424, 143.0, 397.10000000000014, 424.0, 424.0, 0.05902037973712323, 0.015907836726021495, 0.03469752793139471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/add043b8-4d52-4718-90be-3311576053bf", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.856128518766756, 1.599677446380697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 371.36842105263156, 135, 1613, 143.0, 1392.0, 1613.0, 1613.0, 0.0856546494696174, 8.13352003135411, 0.04958072894360768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 286.57894736842104, 138, 1119, 142.0, 836.0, 1119.0, 1119.0, 0.08565349105597231, 2.6717056653022215, 0.04966370438951601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 169.6, 138, 417, 143.0, 389.80000000000007, 417.0, 417.0, 0.05902630212022477, 0.01579414724701327, 0.033663437927940694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 172.9473684210526, 137, 425, 142.0, 422.0, 425.0, 425.0, 0.08564847162556291, 0.06365086612016932, 0.042991517983925136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 141.79999999999998, 138, 145, 141.5, 144.9, 145.0, 145.0, 0.05902525690743069, 0.043865449713432376, 0.029627912158612667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 215.52631578947367, 139, 425, 143.0, 423.0, 425.0, 425.0, 0.0856538771903725, 0.03646101001699553, 0.04809225711490693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 150.0, 143, 167, 147.0, 165.8, 167.0, 167.0, 0.05935457831539836, 0.04671854504122175, 0.02109869776055176], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 611.3076923076923, 143, 1102, 592.0, 990.8, 1102.0, 1102.0, 0.0825978943890615, 0.015474695658527595, 0.056215213579093835], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/028870f1-eb6a-458b-9671-2d0301482c7f", 3, 0, 0.0, 706.0, 249, 1102, 767.0, 1102.0, 1102.0, 1102.0, 0.06394134447333645, 0.028931793235005755, 0.041004052282706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1551.2272727272727, 886, 3082, 1529.0, 1945.7, 2912.0499999999975, 3082.0, 0.09269754056570781, 0.04797821923811049, 0.04263724766254725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 316.4, 283, 565, 289.5, 538.2, 565.0, 565.0, 0.058971304563199545, 0.0913940042400368, 0.13262784610258646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70e744dc-3afe-461b-9197-611704dc373d", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["addBook", 54, 12, 22.22222222222222, 1448.7407407407406, 713, 2864, 1229.5, 2426.5, 2669.5, 2864.0, 0.25408058118580346, 85.41699229318311, 0.9216762054712018], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 240.77586206896555, 139, 578, 144.5, 566.2, 571.0, 578.0, 0.2612000792607137, 0.194114512028714, 0.12626371018950516], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 914.2241379310344, 679, 1348, 840.5, 1142.9, 1257.25, 1348.0, 0.2609098556448747, 76.71616058214387, 0.13121931216514693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c5c3e85-59a3-4bb5-b85c-1e850a6bf96b", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 211.67241379310337, 138, 437, 144.5, 427.2, 432.0, 437.0, 0.26141905474475585, 0.4625891867163062, 0.12713543873328945], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1370.6379310344828, 954, 2025, 1397.5, 1697.1, 1724.8499999999997, 2025.0, 0.2600337147161149, 233.97879359207434, 0.13052473570711237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 146.125, 141, 165, 145.5, 155.20000000000002, 165.0, 165.0, 0.09730111044892299, 0.07269077098967393, 0.0345875041048906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 12, 7.228915662650603, 209.1265060240964, 138, 723, 147.0, 390.1000000000002, 430.65, 708.2600000000002, 0.6850389151624698, 1.5487769759864973, 0.32468258917886117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 225.0, 144, 424, 150.0, 424.0, 424.0, 424.0, 0.04880633645693887, 0.037796313291359886, 0.017349127412427487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 165.58823529411762, 145, 425, 147.0, 212.99999999999983, 425.0, 425.0, 0.10815625397633287, 0.08777133501399668, 0.03844616840564957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a62883dd-03fe-47ca-af43-4cc4d2755f45", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 581.5714285714286, 283, 2077, 287.0, 2077.0, 2077.0, 2077.0, 0.04826887140483102, 8.313599301997643, 0.10679353119548204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 591.0, 278, 1767, 562.0, 1537.0, 1767.0, 1767.0, 0.0855932966933958, 10.897567313215156, 0.1901960832620056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c28e67d8-d6da-4389-a5d5-14a2b7074c4c", 3, 0, 0.0, 381.6666666666667, 289, 482, 374.0, 482.0, 482.0, 482.0, 0.06605310669778502, 0.0298873106477608, 0.04235827480294157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33df1ee1-ea53-416f-a98e-99da123ff2ad", 1, 0, 0.0, 678.0, 678, 678, 678.0, 678.0, 678.0, 678.0, 1.4749262536873156, 0.26646616887905605, 1.0168925147492625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 175.29999999999995, 143, 429, 147.0, 401.4000000000001, 429.0, 429.0, 0.05461466622246738, 0.04528110510046368, 0.019413807133767703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 169.05555555555551, 141, 460, 147.0, 231.40000000000038, 460.0, 460.0, 0.10457151820415846, 0.08118589548076756, 0.037171906861634456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23ae995f-246c-4399-890f-143261451140", 3, 0, 0.0, 504.3333333333333, 365, 651, 497.0, 651.0, 651.0, 651.0, 0.05980742010725464, 0.0270613001136341, 0.038353065628675666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80cab9be-0241-4f89-bcd5-8a99a44b3316", 3, 0, 0.0, 369.3333333333333, 253, 496, 359.0, 496.0, 496.0, 496.0, 0.03513621137944766, 0.02929161371834813, 0.022532010552575484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 159.5, 138, 419, 142.5, 227.9000000000002, 419.0, 419.0, 0.0996679810381666, 0.07406966168949687, 0.050028654544548475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 230.0, 140, 429, 143.5, 424.8, 429.0, 429.0, 0.09966984364293278, 0.045381899021989656, 0.05579661901202267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 329.43749999999994, 136, 1505, 142.0, 1320.2000000000003, 1505.0, 1505.0, 0.09950186876947284, 11.21496105823347, 0.05742734808863129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 330.5000000000001, 136, 1100, 143.0, 1091.6, 1100.0, 1100.0, 0.09967046452665873, 3.6868095094967264, 0.057621987304474584], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.46547711404189296], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.07757951900698215], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07757951900698215], "isController": false}, {"data": ["401/Unauthorized", 14, 63.63636363636363, 1.0861132660977502], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1289, 22, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
