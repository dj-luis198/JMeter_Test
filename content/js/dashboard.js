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

    var data = {"OkPercent": 98.15261044176707, "KoPercent": 1.8473895582329318};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8089965397923875, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f27f8a35-ec6e-4927-91db-4954849bdec7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4d90826-c173-4936-a58b-a7edf6e15582"], "isController": false}, {"data": [0.35294117647058826, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/edcefb55-d48e-45dd-94b8-118efea09f72"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af2b90b8-92f2-481c-b9d3-91869bf43324"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59d51bf3-f237-40b8-9407-b96fcf665bbb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7437318b-a91a-4fa0-bb37-d5881c8ef089"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/414e3e93-c75d-4528-b91f-cea0da66fe85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/698d94c2-1480-45d9-975e-37641e7e100d"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d780943-f2d0-4e76-8007-2a1ffb5883f5"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d780943-f2d0-4e76-8007-2a1ffb5883f5"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/593688fb-ff37-4f38-b519-68f848c67eaa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af2b90b8-92f2-481c-b9d3-91869bf43324"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a7021e9-95ea-4f9c-a795-e6843512bcff"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/064fb097-6c1d-4abf-9f4c-1e1df233aadc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4d90826-c173-4936-a58b-a7edf6e15582"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f94c15ce-150e-4571-86ca-68086b92a11f"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=511dc268-b74b-4923-8436-c0fca5ae6fe0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7437318b-a91a-4fa0-bb37-d5881c8ef089"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f27f8a35-ec6e-4927-91db-4954849bdec7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=414e3e93-c75d-4528-b91f-cea0da66fe85"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2894736842105263, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3709677419354839, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7843137254901961, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8b59d91-b3d4-469f-bd9a-9a43cba083b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9342857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a7021e9-95ea-4f9c-a795-e6843512bcff"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=064fb097-6c1d-4abf-9f4c-1e1df233aadc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/511dc268-b74b-4923-8436-c0fca5ae6fe0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f94c15ce-150e-4571-86ca-68086b92a11f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae13615c-be4f-4138-8db4-0495e1ab070f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1245, 23, 1.8473895582329318, 306.3261044176702, 77, 2923, 94.0, 878.2000000000003, 1059.0, 1615.62, 4.959151726143293, 670.358340878696, 3.617860825589223], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/f27f8a35-ec6e-4927-91db-4954849bdec7", 3, 0, 0.0, 302.3333333333333, 181, 532, 194.0, 532.0, 532.0, 532.0, 0.03746113407339885, 0.03122980610741356, 0.024022927774933506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4d90826-c173-4936-a58b-a7edf6e15582", 3, 0, 0.0, 287.3333333333333, 178, 435, 249.0, 435.0, 435.0, 435.0, 0.03921722420487078, 0.02521289642077467, 0.025149066303253722], "isController": false}, {"data": ["see books", 51, 0, 0.0, 1391.5294117647063, 1117, 1829, 1369.0, 1668.6000000000001, 1760.6, 1829.0, 0.23169496222463506, 278.80674148577805, 1.1392423191416383], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/edcefb55-d48e-45dd-94b8-118efea09f72", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.116559222027972, 2.0862926136363638], "isController": false}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 692.4166666666666, 84, 1551, 614.5, 1458.0000000000005, 1551.0, 1551.0, 0.07410289186535506, 0.01479886854146983, 0.04977581945447921], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 692.4166666666666, 84, 1551, 614.5, 1458.0000000000005, 1551.0, 1551.0, 0.07347088716096246, 0.014672652758219554, 0.04935129415906447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af2b90b8-92f2-481c-b9d3-91869bf43324", 3, 0, 0.0, 576.3333333333334, 241, 1080, 408.0, 1080.0, 1080.0, 1080.0, 0.024744717002919876, 0.029247417785677757, 0.01586819417179432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 113.13333333333333, 79, 243, 81.0, 241.8, 243.0, 243.0, 0.1006393956268828, 0.03700594443363503, 0.05683242953564983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 92.46666666666667, 79, 246, 81.0, 151.80000000000007, 246.0, 246.0, 0.1006393956268828, 0.07479158210161896, 0.050516259133025154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 149.60000000000002, 79, 637, 81.0, 400.0000000000001, 637.0, 637.0, 0.1005348453774078, 1.995996304506642, 0.05862569075816678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 189.93333333333334, 78, 926, 82.0, 518.6000000000003, 926.0, 926.0, 0.10052810765890142, 6.05564696748586, 0.058523589758196395], "isController": false}, {"data": ["goToProfile", 12, 2, 16.666666666666668, 198.75, 81, 371, 196.5, 334.40000000000015, 371.0, 371.0, 0.07454388460606663, 0.15280040408997445, 0.04817932385590667], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/59d51bf3-f237-40b8-9407-b96fcf665bbb", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 81.57142857142856, 79, 86, 81.0, 85.0, 86.0, 86.0, 0.08200946623553118, 0.06094648809105394, 0.041164907856506866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7437318b-a91a-4fa0-bb37-d5881c8ef089", 2, 0, 0.0, 185.5, 163, 208, 185.5, 208.0, 208.0, 208.0, 0.06592827004219409, 0.04052914647613397, 0.04097982800962553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 91.85714285714286, 77, 240, 80.0, 163.0, 240.0, 240.0, 0.0820128291497027, 0.030743369409214724, 0.046280956181716994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 544.3333333333334, 468, 625, 540.0, 625.0, 625.0, 625.0, 0.0198408761730918, 5.833876373980675, 0.011315499692466419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1056.0, 916, 1290, 962.0, 1290.0, 1290.0, 1290.0, 0.019754126966358723, 17.774798168380887, 0.011246734395885874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/414e3e93-c75d-4528-b91f-cea0da66fe85", 3, 0, 0.0, 472.0, 180, 832, 404.0, 832.0, 832.0, 832.0, 0.022905484336466293, 0.02707350703961885, 0.014688738327746939], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 189.66666666666666, 79, 246, 244.0, 246.0, 246.0, 246.0, 0.019912914188615124, 0.03523652393532285, 0.011025998383735131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 95.13333333333334, 78, 237, 82.0, 169.20000000000005, 237.0, 237.0, 0.07212058561915523, 0.053597427398610474, 0.03620115332836502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 123.86666666666667, 78, 249, 83.0, 242.4, 249.0, 249.0, 0.07213307108954599, 0.04096933022039057, 0.03992678192729948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/698d94c2-1480-45d9-975e-37641e7e100d", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 266.5333333333333, 78, 861, 84.0, 857.4, 861.0, 861.0, 0.07213480552456432, 12.996959029534395, 0.041167558934136116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 180.26666666666668, 78, 482, 85.0, 474.8, 482.0, 482.0, 0.07213411174054803, 4.257518703774057, 0.041237606457926575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 80.66666666666667, 79, 84, 79.0, 84.0, 84.0, 84.0, 0.019912782014775286, 0.014798463977777334, 0.011181493807124793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 628.4285714285713, 80, 1166, 849.5, 1059.0, 1166.0, 1166.0, 0.09007270153766969, 52.11068311498745, 0.04797678215273756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 125.35714285714285, 78, 714, 80.5, 398.0, 714.0, 714.0, 0.08201379003298126, 5.29168007628747, 0.047711705418182454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 419.5, 78, 715, 476.5, 680.0, 715.0, 715.0, 0.09007154253950281, 17.034114496210563, 0.04806412530881672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 142.85714285714286, 80, 631, 81.0, 434.0, 631.0, 631.0, 0.08201234871650674, 1.7429797978688506, 0.04779095711339965], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 416.6666666666667, 84, 814, 416.5, 769.3000000000002, 814.0, 814.0, 0.07357945661571288, 0.014694334841712195, 0.04985535121927291], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3d780943-f2d0-4e76-8007-2a1ffb5883f5", 3, 0, 0.0, 280.6666666666667, 210, 416, 216.0, 416.0, 416.0, 416.0, 0.02204958216041806, 0.026061859643384762, 0.014139868768236844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 364.2, 163, 944, 176.0, 939.2, 944.0, 944.0, 0.07208939084464736, 17.33817433617686, 0.1584417803075814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d780943-f2d0-4e76-8007-2a1ffb5883f5", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 0.2716752819548872, 1.0367716165413534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 730.0526315789473, 118, 1617, 749.0, 1491.0, 1617.0, 1617.0, 0.09292771202191137, 0.05708157310720923, 0.042017119791157194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 81.35714285714285, 79, 84, 81.5, 83.5, 84.0, 84.0, 0.09007154253950281, 0.06693793346929848, 0.045211692251273874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 137.57142857142858, 78, 241, 82.0, 241.0, 241.0, 241.0, 0.09007270153766969, 0.11107039744579553, 0.04650656646078621], "isController": false}, {"data": ["login", 19, 0, 0.0, 2713.5263157894738, 1591, 4322, 2616.0, 4196.0, 4322.0, 4322.0, 0.08873818964752257, 16.886677719533612, 0.15712077997365878], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 84.85714285714286, 81, 92, 84.5, 90.5, 92.0, 92.0, 0.08628180871323009, 0.06985119084303491, 0.030670486691031007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/593688fb-ff37-4f38-b519-68f848c67eaa", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af2b90b8-92f2-481c-b9d3-91869bf43324", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 711.7142857142857, 163, 1249, 931.0, 1142.0, 1249.0, 1249.0, 0.09002347040478412, 69.28513602988458, 0.18765774201845484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a7021e9-95ea-4f9c-a795-e6843512bcff", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/064fb097-6c1d-4abf-9f4c-1e1df233aadc", 3, 0, 0.0, 444.0, 185, 661, 486.0, 661.0, 661.0, 661.0, 0.021920851113579234, 0.025909703904103583, 0.014057316632080435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4d90826-c173-4936-a58b-a7edf6e15582", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 0.2766677833078101, 1.055824081163859], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, 57.142857142857146, 555.8571428571429, 81, 1375, 233.0, 1375.0, 1375.0, 1375.0, 0.04358383662287529, 22.35298724394496, 0.05862050347114127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 316.6, 159, 1008, 319.0, 699.0000000000002, 1008.0, 1008.0, 0.1004728924136268, 8.158699759367423, 0.22425209444116975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f94c15ce-150e-4571-86ca-68086b92a11f", 3, 0, 0.0, 498.0, 175, 1128, 191.0, 1128.0, 1128.0, 1128.0, 0.018128969488944352, 0.024992247977109156, 0.011625673793366006], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1237.6190476190477, 193, 2225, 1176.0, 1860.0000000000002, 2192.4999999999995, 2225.0, 0.08538563813566558, 0.026968901330796158, 0.038523598455739744], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=511dc268-b74b-4923-8436-c0fca5ae6fe0", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 231.85714285714286, 160, 799, 164.5, 559.5, 799.0, 799.0, 0.08197057256444935, 7.122628662694021, 0.18285567177811737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 95.75, 81, 246, 84.0, 142.4000000000001, 246.0, 246.0, 0.1037875986793028, 0.08057728608402903, 0.03689324796803342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 309.18749999999994, 161, 880, 320.5, 602.8000000000003, 880.0, 880.0, 0.0931060769172578, 7.096980026200631, 0.20790887024504354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 82.07142857142857, 79, 89, 82.0, 86.5, 89.0, 89.0, 0.09049832254894989, 0.06725510103491296, 0.04542591581070336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7437318b-a91a-4fa0-bb37-d5881c8ef089", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 0.6145036139455783, 2.345078656462585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 114.64285714285714, 78, 242, 80.0, 239.5, 242.0, 242.0, 0.0904936428215918, 0.03392249138694436, 0.05106679481212874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 140.92857142857142, 79, 931, 80.0, 506.0, 931.0, 931.0, 0.09049890754890172, 5.839155412885105, 0.05264794147306365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 131.50000000000003, 78, 478, 81.0, 361.5, 478.0, 478.0, 0.09049890754890172, 1.9233416681211133, 0.05273631931246687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.0, 84, 88, 86.0, 88.0, 88.0, 88.0, 0.18880392712168415, 0.055682408194090434, 0.1167118026054942], "isController": false}, {"data": ["https://demoqa.com/books", 51, 0, 0.0, 978.5098039215688, 631, 1421, 935.0, 1327.8, 1371.8, 1421.0, 0.22557488422700794, 269.86598405384603, 0.4454222811591895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f27f8a35-ec6e-4927-91db-4954849bdec7", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=414e3e93-c75d-4528-b91f-cea0da66fe85", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1237.6190476190477, 193, 2225, 1176.0, 1860.0000000000002, 2192.4999999999995, 2225.0, 0.08583129654304235, 0.02710966174294753, 0.03872466699500544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 80.44444444444443, 77, 84, 80.0, 84.0, 84.0, 84.0, 0.043151808060757746, 0.01163076076637611, 0.025410683848278243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 97.88888888888889, 78, 234, 81.0, 234.0, 234.0, 234.0, 0.04315160116413431, 0.011630705001270574, 0.025368421778133643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 100.12500000000001, 78, 236, 81.0, 233.9, 236.0, 236.0, 0.10412870307700318, 0.028065939501223512, 0.06121628833237882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 135.81249999999997, 79, 329, 83.0, 267.4000000000001, 329.0, 329.0, 0.10412531481638151, 0.02806502625910283, 0.06131598128347466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 81.55555555555556, 80, 83, 82.0, 83.0, 83.0, 83.0, 0.04315118737683932, 0.011546313809818335, 0.024609661550853677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 92.875, 78, 238, 82.0, 135.8000000000001, 238.0, 238.0, 0.10423249057021687, 0.07746184113665532, 0.052319824368253394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 82.88888888888889, 79, 92, 81.0, 92.0, 92.0, 92.0, 0.04315098048616771, 0.032068257958958624, 0.021659769501845904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 90.3125, 78, 238, 81.0, 130.2000000000001, 238.0, 238.0, 0.10423520674401789, 0.02789106117955166, 0.0594466413461977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 101.55555555555556, 80, 239, 85.0, 239.0, 239.0, 239.0, 0.044095815307127355, 0.03470822962650844, 0.015674684347455427], "isController": false}, {"data": ["deleteAccount", 11, 2, 18.181818181818183, 718.6363636363636, 82, 2923, 435.0, 2564.0000000000014, 2923.0, 2923.0, 0.078103920816825, 0.015344813278376576, 0.053148664156690666], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1509.157894736842, 737, 2510, 1439.0, 2428.0, 2510.0, 2510.0, 0.09082348217230649, 0.04700824760871332, 0.04177525400698863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 182.88888888888886, 160, 314, 166.0, 314.0, 314.0, 314.0, 0.043134228927731, 0.06684963018389559, 0.0970098918169575], "isController": false}, {"data": ["addBook", 62, 10, 16.129032258064516, 854.967741935484, 425, 2409, 698.5, 1484.5000000000002, 1670.1999999999998, 2409.0, 0.29028527551350064, 90.71658105396965, 1.055498440594523], "isController": true}, {"data": ["https://demoqa.com/books-0", 51, 0, 0.0, 153.7647058823529, 79, 332, 87.0, 325.0, 327.2, 332.0, 0.22641609951653502, 0.16826430833211248, 0.10944918873113754], "isController": false}, {"data": ["https://demoqa.com/books-3", 51, 0, 0.0, 523.6862745098041, 385, 784, 476.0, 706.2000000000002, 729.0, 784.0, 0.22616909465841814, 66.50122335029602, 0.11374715209871615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8b59d91-b3d4-469f-bd9a-9a43cba083b8", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["https://demoqa.com/books-1", 51, 0, 0.0, 128.68627450980395, 79, 334, 83.0, 244.20000000000002, 263.19999999999993, 334.0, 0.2267049546145571, 0.4011615017202906, 0.11025299550590767], "isController": false}, {"data": ["https://demoqa.com/books-2", 51, 0, 0.0, 820.9215686274509, 550, 1238, 782.0, 1009.2, 1089.2, 1238.0, 0.22594164503238495, 203.3026893631879, 0.11341211479164635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 121.0, 81, 250, 87.5, 247.9, 250.0, 250.0, 0.09146881770836311, 0.06833363822939235, 0.0325143062947697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 10, 5.714285714285714, 147.25714285714287, 80, 1178, 91.0, 263.6, 335.59999999999985, 794.2000000000046, 0.7486983344670766, 1.501186118651573, 0.3648692759338407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 110.5, 81, 243, 86.0, 241.5, 243.0, 243.0, 0.09466175327090165, 0.0733073929138916, 0.03364929510801582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 87.2, 81, 125, 84.0, 105.20000000000002, 125.0, 125.0, 0.10085389632219459, 0.08184530062865596, 0.03585040845828011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a7021e9-95ea-4f9c-a795-e6843512bcff", 3, 0, 0.0, 321.0, 216, 430, 317.0, 430.0, 430.0, 430.0, 0.06807351940095303, 0.03080149478103018, 0.0436539170637622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 259.0, 160, 1015, 164.5, 672.0, 1015.0, 1015.0, 0.09044628782592966, 7.859104821998475, 0.20176285467865723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 230.5, 161, 477, 167.5, 430.1, 477.0, 477.0, 0.10406842498943054, 0.1612857328693616, 0.23405232690494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 86.99999999999999, 80, 107, 85.0, 104.0, 107.0, 107.0, 0.07415500373246851, 0.06148202946178299, 0.02635978648302592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=064fb097-6c1d-4abf-9f4c-1e1df233aadc", 1, 0, 0.0, 814.0, 814, 814, 814.0, 814.0, 814.0, 814.0, 1.2285012285012284, 0.22194602272727273, 0.8469940110565111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 88.78571428571429, 83, 97, 88.0, 96.0, 97.0, 97.0, 0.08940088634593034, 0.06940791469239709, 0.03177922131827993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/511dc268-b74b-4923-8436-c0fca5ae6fe0", 3, 0, 0.0, 1349.3333333333335, 371, 2923, 754.0, 2923.0, 2923.0, 2923.0, 0.01844655418367849, 0.021803202552388212, 0.01182933324929903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f94c15ce-150e-4571-86ca-68086b92a11f", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae13615c-be4f-4138-8db4-0495e1ab070f", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 1.716859879032258, 3.207955309139785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 92.0, 79, 237, 82.0, 132.7000000000001, 237.0, 237.0, 0.09315161006736025, 0.06922692896607535, 0.046757741772092944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 120.5, 79, 248, 81.0, 241.0, 248.0, 248.0, 0.09315377942349454, 0.03367045176671965, 0.05263779845597611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 165.1875, 78, 796, 82.0, 411.0000000000004, 796.0, 796.0, 0.09315106774411402, 5.262131334636478, 0.05426231631773829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 198.5625, 79, 703, 233.0, 380.3000000000003, 703.0, 703.0, 0.09315161006736025, 1.735392208304466, 0.05435360060082788], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 21.73913043478261, 0.40160642570281124], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.1606425702811245], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.1606425702811245], "isController": false}, {"data": ["401/Unauthorized", 14, 60.869565217391305, 1.1244979919678715], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1245, 23, "401/Unauthorized", 14, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
