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

    var data = {"OkPercent": 97.3097617217525, "KoPercent": 2.690238278247502};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7365982792852416, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ccca72d-586a-43a8-9fb4-b48d137c897c"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aeb77a14-83e4-4286-aa7c-d7f07e8eb889"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82d86cff-db09-4879-8a56-8ca0d85b9db6"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de57a6e3-ba10-463b-a903-9be2d801e261"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.33636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/daa57426-aae5-4317-97e2-557ea149062c"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e011e24-7b1f-40c7-9a11-e52fdb642e98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=028ffc15-c450-489d-8af6-18c711566796"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/82d86cff-db09-4879-8a56-8ca0d85b9db6"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7a1adfd-e481-447b-b7d5-628cc58530e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.44545454545454544, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8918128654970761, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21ff11ee-2617-4eba-9a4a-1495eb84aa8c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/21ff11ee-2617-4eba-9a4a-1495eb84aa8c"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/328ebfd6-195d-4676-96cf-51fdc3bb965d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/427bfc2a-9c65-497d-b948-8e64d607b7cc"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c04db0cc-a461-41d5-93c7-697fd91b3dab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c04db0cc-a461-41d5-93c7-697fd91b3dab"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=328ebfd6-195d-4676-96cf-51fdc3bb965d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/028ffc15-c450-489d-8af6-18c711566796"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=427bfc2a-9c65-497d-b948-8e64d607b7cc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7e011e24-7b1f-40c7-9a11-e52fdb642e98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aeb77a14-83e4-4286-aa7c-d7f07e8eb889"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92c4348a-3084-407d-b746-0e6a6909e671"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ccca72d-586a-43a8-9fb4-b48d137c897c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/92c4348a-3084-407d-b746-0e6a6909e671"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1301, 35, 2.690238278247502, 443.6302843966186, 126, 3636, 147.0, 1194.3999999999999, 1446.8999999999999, 2028.9, 5.00991585959913, 712.7041949561487, 3.6760394504399563], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2134.8000000000006, 1597, 2823, 2116.0, 2629.0, 2721.9999999999995, 2823.0, 0.25766072173110527, 310.05333942935175, 1.266915755777456], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 139.875, 131, 174, 137.0, 155.10000000000002, 174.0, 174.0, 0.08039877793857533, 0.06241897310660877, 0.02857925309535295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ccca72d-586a-43a8-9fb4-b48d137c897c", 3, 0, 0.0, 402.0, 248, 560, 398.0, 560.0, 560.0, 560.0, 0.0504261005496445, 0.0324191238885247, 0.032337050157161346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 569.1764705882351, 262, 1989, 272.0, 1547.3999999999996, 1989.0, 1989.0, 0.10252451542089329, 14.570195416626461, 0.22749393710724064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aeb77a14-83e4-4286-aa7c-d7f07e8eb889", 3, 0, 0.0, 391.6666666666667, 231, 496, 448.0, 496.0, 496.0, 496.0, 0.037439161362785474, 0.03121148836266068, 0.024008837202046676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82d86cff-db09-4879-8a56-8ca0d85b9db6", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 469.07142857142856, 265, 1719, 278.0, 1256.5, 1719.0, 1719.0, 0.11692780543213176, 10.16015031225988, 0.2608364409681622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 181.72727272727275, 128, 409, 133.0, 407.2, 409.0, 409.0, 0.07327715418179395, 0.05445694759018086, 0.036781696532658295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 227.45454545454544, 126, 409, 134.0, 408.2, 409.0, 409.0, 0.07328740655855664, 0.01961010683305129, 0.04179672405292684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 181.72727272727275, 128, 402, 134.0, 399.8, 402.0, 402.0, 0.07341065922771986, 0.01978646674497137, 0.04315743833504625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de57a6e3-ba10-463b-a903-9be2d801e261", 2, 0, 0.0, 343.0, 244, 442, 343.0, 442.0, 442.0, 442.0, 0.016821282286348688, 0.02824628407360993, 0.01045580681177826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 204.90909090909093, 131, 402, 136.0, 401.4, 402.0, 402.0, 0.0734086995982542, 0.019785938563591954, 0.043227974470456336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 135.5, 135, 136, 135.5, 136.0, 136.0, 136.0, 0.015103116528095572, 0.004454239444809436, 0.009336203869418455], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 562.7692307692307, 132, 1467, 515.0, 1246.1999999999998, 1467.0, 1467.0, 0.058130695690279656, 0.011523956274537861, 0.03908276190114205], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 562.7692307692307, 132, 1467, 515.0, 1246.1999999999998, 1467.0, 1467.0, 0.058268267101736396, 0.011551228732082508, 0.039175254699559854], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1416.6545454545455, 1046, 2295, 1316.0, 2062.6, 2165.1999999999994, 2295.0, 0.2626978592512633, 314.2779682171413, 0.5187256556699751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/daa57426-aae5-4317-97e2-557ea149062c", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.7807724633251835, 1.4588745415647923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, 40.90909090909091, 995.5454545454544, 231, 1758, 1011.0, 1662.0, 1748.1, 1758.0, 0.08921113030502097, 0.027640877553668605, 0.04024955293058563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e011e24-7b1f-40c7-9a11-e52fdb642e98", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.29472114600326266, 1.124719616639478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 133.2, 129, 135, 134.0, 135.0, 135.0, 135.0, 0.024262422360248444, 0.006539481026785714, 0.014287344417216614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 206.5, 130, 406, 133.5, 402.4, 406.0, 406.0, 0.16676549066113253, 0.04462279730581085, 0.09510844389267714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 133.6, 132, 136, 133.0, 136.0, 136.0, 136.0, 0.02426171598264802, 0.0065392906359480986, 0.014263235372611434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 163.16666666666669, 128, 394, 135.0, 383.20000000000005, 394.0, 394.0, 0.16676240063740297, 0.12393182312994497, 0.0837069081324464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 205.61111111111114, 127, 403, 134.0, 400.3, 403.0, 403.0, 0.16676240063740297, 0.04494767829680001, 0.09820090584409569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=028ffc15-c450-489d-8af6-18c711566796", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 205.7222222222222, 128, 406, 133.5, 405.1, 406.0, 406.0, 0.16676703571594015, 0.044948927595311994, 0.09804077685644137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 286.1875, 128, 1275, 133.0, 666.0000000000007, 1275.0, 1275.0, 0.08226305668952895, 4.647064373733921, 0.047919837221976576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 298.5, 129, 1071, 145.0, 686.0000000000005, 1071.0, 1071.0, 0.08215365814835925, 1.5305029953993952, 0.04793633861684047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 133.4, 131, 136, 134.0, 136.0, 136.0, 136.0, 0.024262069166306778, 0.006491998976140681, 0.013836961321409335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 185.87499999999997, 131, 403, 134.5, 400.2, 403.0, 403.0, 0.08225967322344813, 0.06113243293266017, 0.04129050003598861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 134.4, 132, 136, 135.0, 136.0, 136.0, 136.0, 0.024261833709391757, 0.01803052290317102, 0.012178303248659534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 182.25, 131, 391, 134.0, 391.0, 391.0, 391.0, 0.0821528145040794, 0.029694150847971085, 0.04642155497306928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 209.0, 135, 475, 144.0, 475.0, 475.0, 475.0, 0.024413943291292525, 0.019216443645294703, 0.00867839390432664], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 619.5, 132, 1799, 500.0, 1526.000000000001, 1799.0, 1799.0, 0.06310044012556988, 0.012314034458098679, 0.042939931667481716], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/82d86cff-db09-4879-8a56-8ca0d85b9db6", 3, 0, 0.0, 351.0, 234, 452, 367.0, 452.0, 452.0, 452.0, 0.08013676674858425, 0.03714673041991666, 0.05138978857249706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1722.8636363636363, 940, 3636, 1429.5, 3054.3999999999996, 3565.949999999999, 3636.0, 0.0881710518405707, 0.045635407690920386, 0.040555239664950005], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 228.25, 127, 398, 234.0, 370.0, 398.0, 398.0, 0.07010994115146815, 0.11575586047902618, 0.04530786480174223], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 270.0, 267, 273, 270.0, 273.0, 273.0, 273.0, 0.024245950926195328, 0.037576488398312485, 0.05452971189748812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 165.11764705882354, 129, 404, 135.0, 399.2, 404.0, 404.0, 0.10260619741432382, 0.07625323850810589, 0.05150350143648677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 963.6666666666669, 644, 1133, 1041.0, 1133.0, 1133.0, 1133.0, 0.047788963935261886, 14.051542139910156, 0.02725464349432904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 178.47058823529412, 127, 403, 133.0, 399.8, 403.0, 403.0, 0.10260495883730475, 0.045585176450351275, 0.05750310078221192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1272.888888888889, 922, 1446, 1365.0, 1446.0, 1446.0, 1446.0, 0.04765939419614488, 42.88400667397003, 0.027134205875344205], "isController": false}, {"data": ["addBook", 58, 16, 27.586206896551722, 1270.086206896552, 667, 4082, 978.5, 2146.4, 2583.949999999996, 4082.0, 0.244469921769625, 66.53136630761904, 0.8895622934650661], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 289.55555555555554, 127, 490, 394.0, 490.0, 490.0, 490.0, 0.04785146904009953, 0.08467466982486363, 0.02649588178294574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 151.85714285714286, 128, 384, 134.0, 262.0, 384.0, 384.0, 0.07010024334798762, 0.05209598162872908, 0.03518703621178285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 170.35714285714286, 129, 400, 133.0, 398.0, 400.0, 400.0, 0.07010129637325936, 0.01875757344362604, 0.03997964558787448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 170.21428571428572, 127, 404, 133.0, 401.5, 404.0, 404.0, 0.07000630056705104, 0.018868885699712973, 0.04115604779430149], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 216.7636363636364, 128, 551, 135.0, 534.0, 537.4, 551.0, 0.264524817237399, 0.19658533781021548, 0.12787088333253174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 167.57142857142858, 127, 384, 132.5, 380.5, 384.0, 384.0, 0.07001575354454752, 0.018871433572553824, 0.041229979870470855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7a1adfd-e481-447b-b7d5-628cc58530e4", 2, 0, 0.0, 230.5, 220, 241, 230.5, 241.0, 241.0, 241.0, 0.011154551893764048, 0.022058562094601754, 0.0069334690238093905], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 801.4909090909091, 622, 1171, 787.0, 1053.8, 1059.8, 1171.0, 0.2642211002166613, 77.68977642991656, 0.13288463536287165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 190.33333333333337, 127, 399, 132.0, 399.0, 399.0, 399.0, 0.04791821957193058, 0.035611098724842936, 0.026907203372910235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 752.2222222222223, 126, 1761, 775.5, 1482.0000000000005, 1761.0, 1761.0, 0.08198998811145172, 36.898417144846704, 0.04467813805291999], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 206.36363636363637, 126, 535, 137.0, 404.6, 420.59999999999997, 535.0, 0.264723436206465, 0.4684363929747213, 0.12874245237384724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 333.52941176470586, 128, 1857, 133.0, 1410.5999999999997, 1857.0, 1857.0, 0.10260495883730475, 10.886063134490959, 0.05928312706718814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 590.4444444444445, 130, 1202, 574.0, 1190.3, 1202.0, 1202.0, 0.08198812083227053, 12.064664073602557, 0.04475718705589768], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1195.7454545454548, 910, 1760, 1169.0, 1533.0, 1621.5999999999995, 1760.0, 0.2633872558879024, 236.99631583334528, 0.13220805617810724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 278.29411764705884, 128, 797, 135.0, 793.8, 797.0, 797.0, 0.10260743602124578, 3.5738132242877834, 0.05938476090958474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 137.7857142857143, 134, 146, 137.0, 145.0, 146.0, 146.0, 0.11600351324925841, 0.08666278089422136, 0.04123562385032232], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 638.75, 135, 1568, 495.5, 1504.4000000000003, 1568.0, 1568.0, 0.061784013386536225, 0.01233870189213541, 0.04186309370575364], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 16, 9.35672514619883, 202.5906432748538, 127, 2292, 140.0, 301.8, 405.8, 2015.5200000000004, 0.7023106430865526, 1.5286599086380102, 0.33635539536803544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 141.72727272727272, 134, 154, 142.0, 152.8, 154.0, 154.0, 0.07267153786187122, 0.05627786086373426, 0.025832460724337036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21ff11ee-2617-4eba-9a4a-1495eb84aa8c", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21ff11ee-2617-4eba-9a4a-1495eb84aa8c", 3, 0, 0.0, 524.0, 241, 775, 556.0, 775.0, 775.0, 775.0, 0.037632655109260144, 0.024635178849193407, 0.0241329201058732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 361.35714285714283, 262, 785, 269.0, 665.0, 785.0, 785.0, 0.06995837476701362, 0.10842181714379943, 0.15733802450042225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/328ebfd6-195d-4676-96cf-51fdc3bb965d", 3, 0, 0.0, 408.3333333333333, 226, 507, 492.0, 507.0, 507.0, 507.0, 0.019862156632967205, 0.023476396723406227, 0.012737125184552538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 150.61111111111114, 132, 332, 138.0, 175.40000000000026, 332.0, 332.0, 0.15820281601012498, 0.12838529307071664, 0.05623615725359911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/427bfc2a-9c65-497d-b948-8e64d607b7cc", 3, 0, 0.0, 461.66666666666663, 234, 770, 381.0, 770.0, 770.0, 770.0, 0.04432558620587757, 0.028497080975458403, 0.02842493646665977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 680.4545454545455, 151, 2384, 606.5, 1270.8999999999999, 2222.2999999999975, 2384.0, 0.0880778608289728, 0.05410251412248428, 0.039824267152162515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 147.8333333333333, 126, 396, 133.5, 166.50000000000037, 396.0, 396.0, 0.08198625363814001, 0.06092923732287553, 0.041153256220706994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 241.00000000000006, 127, 531, 134.0, 415.8000000000002, 531.0, 531.0, 0.08198924118957279, 0.08351052593820744, 0.04331658152691297], "isController": false}, {"data": ["login", 22, 0, 0.0, 3238.136363636364, 1807, 4993, 3136.5, 4804.799999999999, 4981.599999999999, 4993.0, 0.08880026801535439, 43.57744256867893, 0.19421905209750268], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 460.72727272727275, 262, 812, 513.0, 810.8, 812.0, 812.0, 0.07309212930662148, 0.11327852461875809, 0.16438591190737234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c04db0cc-a461-41d5-93c7-697fd91b3dab", 1, 0, 0.0, 1187.0, 1187, 1187, 1187.0, 1187.0, 1187.0, 1187.0, 0.8424599831508003, 0.15220224304970514, 0.5808366680707666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c04db0cc-a461-41d5-93c7-697fd91b3dab", 3, 0, 0.0, 379.0, 304, 475, 358.0, 475.0, 475.0, 475.0, 0.03289149097128573, 0.02742028267495532, 0.021092525134581017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 190.76470588235296, 133, 533, 137.0, 428.19999999999993, 533.0, 533.0, 0.10283025145020899, 0.08324831880099927, 0.03655294094519148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 531.875, 262, 1410, 528.0, 1067.7000000000003, 1410.0, 1410.0, 0.08209464486369723, 6.257637247174149, 0.18331998760883955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=328ebfd6-195d-4676-96cf-51fdc3bb965d", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/028ffc15-c450-489d-8af6-18c711566796", 3, 0, 0.0, 499.0, 253, 889, 355.0, 889.0, 889.0, 889.0, 0.02429976186233375, 0.024370952570914806, 0.015582855100520016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 159.1428571428571, 130, 412, 138.0, 289.0, 412.0, 412.0, 0.0707871531429496, 0.0586897392757463, 0.025162620843782863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 919.7222222222224, 261, 1903, 1045.0, 1617.7000000000005, 1903.0, 1903.0, 0.08193624449775358, 49.07560962130661, 0.173794456102657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=427bfc2a-9c65-497d-b948-8e64d607b7cc", 1, 0, 0.0, 1356.0, 1356, 1356, 1356.0, 1356.0, 1356.0, 1356.0, 0.7374631268436578, 0.13323308443952803, 0.5084462573746312], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e011e24-7b1f-40c7-9a11-e52fdb642e98", 3, 0, 0.0, 763.6666666666666, 243, 1799, 249.0, 1799.0, 1799.0, 1799.0, 0.0776618602604261, 0.0351399693235652, 0.04980269033627586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 168.1111111111111, 133, 400, 137.0, 398.2, 400.0, 400.0, 0.0777967947720554, 0.060398878753695345, 0.027654329391629064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aeb77a14-83e4-4286-aa7c-d7f07e8eb889", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, 40.0, 938.8, 127, 1826, 1286.0, 1674.8000000000002, 1826.0, 1826.0, 0.07920039283394846, 56.85919952162963, 0.1279632909479231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 430.8888888888889, 263, 792, 401.0, 788.4, 792.0, 792.0, 0.16655408844022096, 0.258126306986944, 0.3745840485135048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92c4348a-3084-407d-b746-0e6a6909e671", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ccca72d-586a-43a8-9fb4-b48d137c897c", 1, 0, 0.0, 1568.0, 1568, 1568, 1568.0, 1568.0, 1568.0, 1568.0, 0.6377551020408163, 0.11521942761479591, 0.4397022480867347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 173.5, 131, 400, 135.5, 397.5, 400.0, 400.0, 0.11705881369253666, 0.08699390353517618, 0.05875803734176157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92c4348a-3084-407d-b746-0e6a6909e671", 3, 0, 0.0, 424.3333333333333, 228, 552, 493.0, 552.0, 552.0, 552.0, 0.018523435232808708, 0.021894073349716284, 0.011878635224164439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 188.07142857142858, 128, 399, 133.5, 397.0, 399.0, 399.0, 0.11707056009900825, 0.04388512764872142, 0.06606451110497885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 254.57142857142858, 127, 1324, 132.5, 862.0, 1324.0, 1324.0, 0.11706860220088973, 7.553480817995953, 0.0681049206442118], "isController": false}, {"data": ["register", 22, 9, 40.90909090909091, 995.5454545454544, 231, 1758, 1011.0, 1662.0, 1748.1, 1758.0, 0.09286109246854331, 0.02877176959474575, 0.04189631320358106], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 235.92857142857144, 128, 781, 134.5, 594.5, 781.0, 781.0, 0.11706860220088973, 2.4880181069588923, 0.0682192454510486], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 25.714285714285715, 0.6917755572636434], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.428571428571429, 0.3074558032282859], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.714285714285714, 0.15372790161414296], "isController": false}, {"data": ["401/Unauthorized", 20, 57.142857142857146, 1.5372790161414296], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1301, 35, "401/Unauthorized", 20, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
