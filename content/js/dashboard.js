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

    var data = {"OkPercent": 99.00306748466258, "KoPercent": 0.9969325153374233};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7508294625082946, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5f06d24a-db47-46e9-8b9e-c15bc273ef09"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4fbfe23c-8fbd-4ae9-a56b-fd8c424f3cc7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c039710-98ea-4202-9cb1-fd138449babb"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da7f3cb9-e161-4696-bc4c-2d94694c1d8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b71cf46-1e84-4afb-a159-2452f374b788"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0864ba8-1bf0-44ec-ab81-efe5ade33d77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eaf9edbf-85a2-4f80-a8a3-6285be8f891c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/050a4a4d-2369-4cff-a9ee-9da9195be453"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/70cb6551-3fc9-499a-a108-5c65560f67df"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/38d589be-b015-494a-9d4a-094169621122"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70b8936f-70ca-44d0-acc1-92b5abc4f13c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6526a3d0-ae42-4d39-9757-ce08e169c55c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=139ad882-d64c-4cfa-ac56-e2daccbef37f"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/70b8936f-70ca-44d0-acc1-92b5abc4f13c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f06d24a-db47-46e9-8b9e-c15bc273ef09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da7f3cb9-e161-4696-bc4c-2d94694c1d8b"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dad7badc-916d-4eb6-af3d-45fc65c36091"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0864ba8-1bf0-44ec-ab81-efe5ade33d77"], "isController": false}, {"data": [0.31451612903225806, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eaf9edbf-85a2-4f80-a8a3-6285be8f891c"], "isController": false}, {"data": [0.952513966480447, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b71cf46-1e84-4afb-a159-2452f374b788"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=050a4a4d-2369-4cff-a9ee-9da9195be453"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/11d7e771-6684-4de9-b07b-797041720131"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90b12d8b-65cb-4ebf-8951-21a2d370c610"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70cb6551-3fc9-499a-a108-5c65560f67df"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38d589be-b015-494a-9d4a-094169621122"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/139ad882-d64c-4cfa-ac56-e2daccbef37f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6526a3d0-ae42-4d39-9757-ce08e169c55c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1304, 13, 0.9969325153374233, 438.18404907975395, 125, 3318, 143.0, 1175.5, 1539.75, 2070.550000000004, 5.039224021331685, 696.7615576815319, 3.6885358498859993], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2109.9636363636364, 1541, 2775, 2100.0, 2541.3999999999996, 2754.6, 2775.0, 0.25342702453634375, 304.95798115136506, 1.2460986997465728], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5f06d24a-db47-46e9-8b9e-c15bc273ef09", 3, 0, 0.0, 666.0, 300, 1128, 570.0, 1128.0, 1128.0, 1128.0, 0.019838252117733414, 0.023448142395667324, 0.01272179579164545], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 936.4545454545455, 503, 2160, 649.0, 2111.4, 2160.0, 2160.0, 0.11028563980710039, 0.019924651722962473, 0.07495977080638855], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 936.4545454545455, 503, 2160, 649.0, 2111.4, 2160.0, 2160.0, 0.10940374956487145, 0.019765325849122283, 0.07436036103237356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 185.64285714285714, 126, 397, 131.0, 395.5, 397.0, 397.0, 0.07297177555966747, 0.019525650882176646, 0.04161671574887285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fbfe23c-8fbd-4ae9-a56b-fd8c424f3cc7", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.7657936151079137, 1.430886540767386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 131.0, 127, 137, 131.5, 135.0, 137.0, 137.0, 0.07297215591022341, 0.054230283835625004, 0.036628601697123855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 169.14285714285714, 126, 397, 132.0, 391.0, 397.0, 397.0, 0.07297177555966747, 0.01966817388131662, 0.04297068424070262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 186.85714285714286, 127, 400, 131.0, 396.0, 400.0, 400.0, 0.07297253626474437, 0.01966837891510688, 0.042899869952515726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c039710-98ea-4202-9cb1-fd138449babb", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.8725025614754098, 1.6302723702185793], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 308.7272727272727, 217, 493, 250.0, 488.20000000000005, 493.0, 493.0, 0.1119012014119897, 0.2989264160588397, 0.07234237825657928], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da7f3cb9-e161-4696-bc4c-2d94694c1d8b", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b71cf46-1e84-4afb-a159-2452f374b788", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 132.0, 126, 138, 131.5, 137.5, 138.0, 138.0, 0.09162783391800618, 0.06809451329258076, 0.0459928775721242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 149.28571428571428, 127, 379, 130.5, 262.0, 379.0, 379.0, 0.09162963302331974, 0.02451808539881798, 0.05225752508361205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 951.6, 629, 1051, 1026.0, 1051.0, 1051.0, 1051.0, 0.07222198148228395, 21.235660551270385, 0.04118909881411507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1173.6, 881, 1430, 1170.0, 1430.0, 1430.0, 1430.0, 0.07182876023559832, 64.63164472148398, 0.0408946945481971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 209.0, 127, 525, 132.0, 525.0, 525.0, 525.0, 0.07319786847806992, 0.12952591570533464, 0.040530460377993786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 145.15, 128, 384, 131.0, 143.9, 371.99999999999983, 384.0, 0.10324765498763609, 0.07672994672421002, 0.051825483069965775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 156.29999999999998, 127, 397, 131.0, 359.8000000000005, 396.4, 397.0, 0.10324712198647462, 0.04313390506427133, 0.058016009756853025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 269.9, 126, 1509, 130.0, 1205.300000000002, 1498.2999999999997, 1509.0, 0.10324712198647462, 9.315239678514274, 0.05981073511950854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 260.80000000000007, 127, 1041, 132.0, 972.8000000000013, 1040.8, 1041.0, 0.10324658899081621, 3.060837891240043, 0.05991125310385058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0864ba8-1bf0-44ec-ab81-efe5ade33d77", 1, 0, 0.0, 1550.0, 1550, 1550, 1550.0, 1550.0, 1550.0, 1550.0, 0.6451612903225806, 0.11655745967741934, 0.4448084677419355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 130.6, 128, 136, 129.0, 136.0, 136.0, 136.0, 0.07318822547828506, 0.05439085897360833, 0.04109690395509171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 907.1666666666667, 127, 1986, 1278.0, 1720.5000000000005, 1986.0, 1986.0, 0.08141075797938498, 40.706165182993296, 0.04397382304919471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 151.14285714285714, 128, 391, 132.0, 269.5, 391.0, 391.0, 0.09147337471414571, 0.02465493302842208, 0.05377633943155831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 624.0555555555557, 126, 1186, 766.0, 1165.3, 1186.0, 1186.0, 0.08141112618724558, 13.308404709407508, 0.0440535249886929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 160.1428571428572, 127, 529, 131.0, 336.0, 529.0, 529.0, 0.09162903331369855, 0.02469688788533281, 0.05395733114078147], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 645.8181818181819, 244, 1550, 501.0, 1435.0000000000005, 1550.0, 1550.0, 0.10959996014546904, 0.019800774049718528, 0.07556403502216909], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eaf9edbf-85a2-4f80-a8a3-6285be8f891c", 1, 0, 0.0, 857.0, 857, 857, 857.0, 857.0, 857.0, 857.0, 1.1668611435239205, 0.21080987456242709, 0.8044960618436406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/050a4a4d-2369-4cff-a9ee-9da9195be453", 3, 0, 0.0, 1355.0, 225, 3318, 522.0, 3318.0, 3318.0, 3318.0, 0.033144776383242, 0.027631436301263922, 0.021254951000972248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 457.65, 259, 1640, 266.5, 1362.6000000000013, 1629.35, 1640.0, 0.10317681410633403, 12.487447492674445, 0.22940719761455206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70cb6551-3fc9-499a-a108-5c65560f67df", 3, 0, 0.0, 494.3333333333333, 457, 557, 469.0, 557.0, 557.0, 557.0, 0.025645190244569634, 0.03031174667253657, 0.01644564608782623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 705.0952380952382, 131, 2617, 400.0, 1997.4000000000008, 2577.0999999999995, 2617.0, 0.09622125390039726, 0.059104656936865105, 0.043506289605355394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 132.61111111111111, 128, 144, 132.0, 141.3, 144.0, 144.0, 0.08140633974483635, 0.060498266158027794, 0.040862166629732306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 203.11111111111114, 127, 410, 131.0, 398.3, 410.0, 410.0, 0.08141038977485504, 0.08971396685692576, 0.04263091808305669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38d589be-b015-494a-9d4a-094169621122", 3, 0, 0.0, 346.3333333333333, 217, 589, 233.0, 589.0, 589.0, 589.0, 0.025090744860579096, 0.02516425290216282, 0.01609009354666042], "isController": false}, {"data": ["login", 21, 0, 0.0, 2904.5714285714284, 1441, 5662, 2678.0, 4677.8, 5564.899999999999, 5662.0, 0.08950834345630075, 25.619061913933464, 0.17038802266479125], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 134.78571428571428, 129, 141, 135.0, 139.5, 141.0, 141.0, 0.09340992947550325, 0.07562190579608612, 0.03320431086824529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1055.5000000000002, 256, 2117, 1408.5, 1849.7000000000005, 2117.0, 2117.0, 0.08135924173186705, 54.1304505042013, 0.1714141055455363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 412.35714285714283, 261, 533, 513.0, 531.5, 533.0, 533.0, 0.07292198389465898, 0.113014832461742, 0.1640032508880856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1305.0, 1011, 1558, 1307.0, 1558.0, 1558.0, 1558.0, 0.07168767115431489, 85.76337736748533, 0.16164729755401666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70b8936f-70ca-44d0-acc1-92b5abc4f13c", 1, 0, 0.0, 975.0, 975, 975, 975.0, 975.0, 975.0, 975.0, 1.0256410256410255, 0.18529647435897437, 0.7071314102564102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6526a3d0-ae42-4d39-9757-ce08e169c55c", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=139ad882-d64c-4cfa-ac56-e2daccbef37f", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1227.5714285714282, 133, 2098, 1268.0, 1844.8, 2072.7999999999997, 2098.0, 0.09546669576127871, 0.030152985379957448, 0.04307188812667066], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 331.57142857142856, 258, 658, 269.5, 590.5, 658.0, 658.0, 0.09139335700856487, 0.1416418530982348, 0.20554580194406727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 152.27777777777783, 130, 410, 134.5, 188.60000000000036, 410.0, 410.0, 0.13594139415452006, 0.10554043784457368, 0.048322917453364554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 569.4705882352941, 263, 1555, 521.0, 1527.0, 1555.0, 1555.0, 0.08710578228678298, 12.378973600863372, 0.1932809657853611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70b8936f-70ca-44d0-acc1-92b5abc4f13c", 3, 0, 0.0, 560.6666666666666, 250, 981, 451.0, 981.0, 981.0, 981.0, 0.019568578081887975, 0.023129396814887775, 0.012548860293398216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 153.66666666666669, 128, 390, 133.0, 314.7000000000003, 390.0, 390.0, 0.05472330528763937, 0.040668393870989805, 0.027468534099459607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f06d24a-db47-46e9-8b9e-c15bc273ef09", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 174.41666666666666, 126, 411, 132.0, 400.8, 411.0, 411.0, 0.054654017297996474, 0.021464867145192953, 0.030787362283262665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 258.5833333333333, 126, 1158, 132.5, 928.2000000000008, 1158.0, 1158.0, 0.054468703190958194, 4.097710505934819, 0.03163156461349916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da7f3cb9-e161-4696-bc4c-2d94694c1d8b", 3, 0, 0.0, 406.0, 233, 512, 473.0, 512.0, 512.0, 512.0, 0.09863878477017163, 0.04366821200762806, 0.06325468945222594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 248.83333333333334, 126, 1034, 132.0, 840.2000000000007, 1034.0, 1034.0, 0.054499377798770135, 1.348850730178122, 0.03170260030156322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dad7badc-916d-4eb6-af3d-45fc65c36091", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1450.8727272727274, 1013, 2216, 1296.0, 2011.3999999999999, 2192.7999999999997, 2216.0, 0.23709655865122234, 283.6499122473305, 0.46817308749294095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1227.5714285714282, 133, 2098, 1268.0, 1844.8, 2072.7999999999997, 2098.0, 0.09023292986323267, 0.028499909767070137, 0.040710560153138176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 195.25, 127, 396, 129.0, 396.0, 396.0, 396.0, 0.0191044776119403, 0.005149253731343284, 0.01125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 257.0, 129, 391, 254.0, 391.0, 391.0, 391.0, 0.019104933849166547, 0.005149376701533171, 0.011231611501170177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 223.38888888888889, 125, 512, 132.0, 410.3000000000002, 512.0, 512.0, 0.1329306028402839, 0.03582895154679527, 0.07814865518540128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 218.61111111111114, 127, 428, 132.5, 397.40000000000003, 428.0, 428.0, 0.13293256626319172, 0.035829480750625885, 0.07827962642256309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 196.75, 128, 393, 133.0, 393.0, 393.0, 393.0, 0.019128871205310174, 0.005118467490483386, 0.010909434359278459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 174.38888888888889, 127, 389, 132.0, 382.7, 389.0, 389.0, 0.13292274972861604, 0.09878341068698908, 0.06672098960987173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 194.75, 130, 385, 132.0, 385.0, 385.0, 385.0, 0.019128596773962152, 0.014215685688462109, 0.009601658927555223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 158.33333333333337, 126, 397, 130.0, 378.1, 397.0, 397.0, 0.132933547996396, 0.03557010952247315, 0.0758136640916946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 136.5, 132, 145, 134.5, 145.0, 145.0, 145.0, 0.019665490014847443, 0.015478891554655315, 0.006990467153715303], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 597.5454545454546, 445, 981, 557.0, 955.0000000000001, 981.0, 981.0, 0.11008807045636508, 0.019888958041433147, 0.0749329932696157], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1437.5238095238094, 881, 2996, 1340.0, 2067.6000000000004, 2907.0999999999985, 2996.0, 0.09371067498460468, 0.048502595451016095, 0.04310324991967657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 459.0, 261, 781, 397.0, 781.0, 781.0, 781.0, 0.01909244082536622, 0.029589554286968932, 0.042939346895330466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0864ba8-1bf0-44ec-ab81-efe5ade33d77", 3, 0, 0.0, 406.0, 262, 493, 463.0, 493.0, 493.0, 493.0, 0.03622357188567841, 0.030198101432038542, 0.0232293087938758], "isController": false}, {"data": ["addBook", 62, 8, 12.903225806451612, 1267.5161290322585, 659, 2704, 1074.5, 2270.1, 2375.7499999999995, 2704.0, 0.28034382814019, 82.20735686356298, 1.0208254557282834], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 232.6, 127, 549, 135.0, 522.6, 532.5999999999999, 549.0, 0.23870284533791641, 0.17739537627163515, 0.11538858246315296], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 838.9272727272728, 624, 1198, 775.0, 1079.8, 1139.8, 1198.0, 0.23847204457259305, 70.1186991214473, 0.1199346708543803], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 203.72727272727272, 128, 411, 136.0, 396.4, 400.4, 411.0, 0.23886145601257713, 0.42267281083475566, 0.11616504403736662], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1216.7636363636364, 882, 1690, 1158.0, 1573.2, 1666.8, 1690.0, 0.237662096352535, 213.84877206341474, 0.11929523195820604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 135.58823529411762, 127, 149, 135.0, 145.0, 149.0, 149.0, 0.08733803931239276, 0.06524765632224655, 0.031045943661827113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eaf9edbf-85a2-4f80-a8a3-6285be8f891c", 3, 0, 0.0, 444.3333333333333, 237, 590, 506.0, 590.0, 590.0, 590.0, 0.0353440150801131, 0.029464851113336476, 0.022665270087181905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 8, 4.4692737430167595, 192.77094972067042, 127, 651, 138.0, 339.0, 389.0, 529.3999999999983, 0.7488568428362848, 1.5456325813911167, 0.3627397897657626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 183.33333333333331, 128, 406, 137.5, 400.90000000000003, 406.0, 406.0, 0.05622399640166423, 0.04354065346339818, 0.019985873720904084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b71cf46-1e84-4afb-a159-2452f374b788", 3, 0, 0.0, 342.3333333333333, 252, 445, 330.0, 445.0, 445.0, 445.0, 0.019082634166820385, 0.026306951724115995, 0.012237236103071668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=050a4a4d-2369-4cff-a9ee-9da9195be453", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 152.35714285714286, 129, 385, 134.0, 264.0, 385.0, 385.0, 0.07273709695855024, 0.059027858957573495, 0.02585576493448466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11d7e771-6684-4de9-b07b-797041720131", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.9825721153846153, 1.8359375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 457.5833333333333, 260, 1549, 276.5, 1240.900000000001, 1549.0, 1549.0, 0.05443559362014843, 5.504325396982908, 0.12126627113915553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90b12d8b-65cb-4ebf-8951-21a2d370c610", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.790435488861386, 1.4769299195544554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70cb6551-3fc9-499a-a108-5c65560f67df", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 429.33333333333326, 263, 781, 275.0, 779.2, 781.0, 781.0, 0.13279330721731625, 0.2058036899940243, 0.29865526027488215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38d589be-b015-494a-9d4a-094169621122", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/139ad882-d64c-4cfa-ac56-e2daccbef37f", 3, 0, 0.0, 464.66666666666663, 231, 851, 312.0, 851.0, 851.0, 851.0, 0.021052336107563404, 0.029022344861826498, 0.013500358766894498], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 137.85, 131, 163, 135.0, 152.10000000000002, 162.5, 163.0, 0.11141626788927451, 0.09237540179491607, 0.03960500147626555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 136.55555555555554, 128, 157, 135.0, 147.10000000000002, 157.0, 157.0, 0.08189561039528281, 0.06358106471118148, 0.029111330257698187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6526a3d0-ae42-4d39-9757-ce08e169c55c", 3, 0, 0.0, 405.6666666666667, 313, 493, 411.0, 493.0, 493.0, 493.0, 0.01827084703646861, 0.025187837630027528, 0.011716656465443738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 146.64705882352945, 127, 397, 132.0, 188.19999999999982, 397.0, 397.0, 0.08716473622412617, 0.06477769947906252, 0.043752611737500835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 208.9411764705882, 125, 427, 132.0, 402.2, 427.0, 427.0, 0.08716697089648666, 0.03872641043850114, 0.0488511585515926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 355.5294117647059, 125, 1390, 132.0, 1203.6, 1390.0, 1390.0, 0.08716786479751418, 9.248236052500692, 0.05036387776501594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 342.82352941176475, 128, 1035, 383.0, 1011.0, 1035.0, 1035.0, 0.08716741784470868, 3.036037958846724, 0.050448743955965075], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 38.46153846153846, 0.3834355828220859], "isController": false}, {"data": ["401/Unauthorized", 8, 61.53846153846154, 0.6134969325153374], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1304, 13, "401/Unauthorized", 8, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
