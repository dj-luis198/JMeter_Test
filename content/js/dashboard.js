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

    var data = {"OkPercent": 98.42814371257485, "KoPercent": 1.5718562874251496};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8162805662805663, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.43859649122807015, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7d913c6-165c-4da6-abb2-d8c728a51f3e"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=274b241b-afc8-4386-b489-179511524057"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/63f9f8b6-d1d5-4b44-8ddc-4719aff5e2fe"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/637962f5-fbb9-4741-bd8c-a9832dbf4d5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02f477f3-6ae1-43da-9bf4-b33c087a7953"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19a8ec3c-f2fb-4898-9a57-4e16678e4f44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b8fe9f89-0ccc-4714-ae36-e3e4876e01a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6af05e12-8812-4634-bdea-821d8ea491ca"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/be22cbf6-6835-4cca-addf-c42b04ad8860"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02f477f3-6ae1-43da-9bf4-b33c087a7953"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3cdfe5c-e460-436e-8dfa-7e01fff18eb8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29463a44-161b-4095-8671-a3b8b6c86801"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2104318-5f92-480f-87e7-10bf4b02fadc"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38b88439-5541-4828-8c1c-94970de4909f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfcedfaf-c0b0-4d61-9955-2d47274ac922"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63f9f8b6-d1d5-4b44-8ddc-4719aff5e2fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dfcedfaf-c0b0-4d61-9955-2d47274ac922"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b2104318-5f92-480f-87e7-10bf4b02fadc"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be22cbf6-6835-4cca-addf-c42b04ad8860"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c44797a0-053d-45e1-a3b5-e9a6926cd342"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3cdfe5c-e460-436e-8dfa-7e01fff18eb8"], "isController": false}, {"data": [0.38524590163934425, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8fe9f89-0ccc-4714-ae36-e3e4876e01a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a767a2d0-3dc3-4329-b673-db5a8478bcc2"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9413407821229051, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a767a2d0-3dc3-4329-b673-db5a8478bcc2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=637962f5-fbb9-4741-bd8c-a9832dbf4d5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19a8ec3c-f2fb-4898-9a57-4e16678e4f44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/274b241b-afc8-4386-b489-179511524057"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ca6801d-4af3-4633-bfab-06f91e87b077"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/38b88439-5541-4828-8c1c-94970de4909f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1336, 21, 1.5718562874251496, 298.7305389221558, 76, 2413, 91.5, 840.0, 1006.1499999999999, 1762.4499999999982, 5.218688843490115, 732.3928302353879, 3.81155887943696], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1285.7017543859647, 949, 1886, 1275.0, 1558.0, 1667.6999999999994, 1886.0, 0.2601801176744462, 313.0840367872434, 1.2793036059480827], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f7d913c6-165c-4da6-abb2-d8c728a51f3e", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 509.71428571428567, 88, 1200, 446.5, 1055.0, 1200.0, 1200.0, 0.07852067056652663, 0.015467520485482089, 0.05283275587923521], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 509.71428571428567, 88, 1200, 446.5, 1055.0, 1200.0, 1200.0, 0.07911392405063292, 0.015584383476491862, 0.05323192741297468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=274b241b-afc8-4386-b489-179511524057", 1, 0, 0.0, 777.0, 777, 777, 777.0, 777.0, 777.0, 777.0, 1.287001287001287, 0.23251488095238096, 0.8873270592020591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 121.06666666666666, 78, 235, 80.0, 235.0, 235.0, 235.0, 0.07261636772928619, 0.02670164355045627, 0.041007446203374244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 92.66666666666667, 79, 248, 81.0, 153.20000000000005, 248.0, 248.0, 0.07261531311723017, 0.0539650910959103, 0.036449483342047166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 137.0666666666667, 78, 619, 81.0, 388.60000000000014, 619.0, 619.0, 0.07261636772928619, 1.4417091018565584, 0.04234536495776148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 152.13333333333335, 78, 691, 81.0, 418.00000000000017, 691.0, 691.0, 0.07261636772928619, 4.374289910258272, 0.04227445053615085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63f9f8b6-d1d5-4b44-8ddc-4719aff5e2fe", 3, 0, 0.0, 281.0, 202, 397, 244.0, 397.0, 397.0, 397.0, 0.024274397792648093, 0.024345514192431243, 0.01556658973031144], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 195.21428571428572, 79, 444, 182.5, 345.0, 444.0, 444.0, 0.07816032916664341, 0.15049243624350292, 0.050518527487312906], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/637962f5-fbb9-4741-bd8c-a9832dbf4d5b", 3, 0, 0.0, 382.3333333333333, 192, 505, 450.0, 505.0, 505.0, 505.0, 0.023648861701456768, 0.027952153918616385, 0.01516544842183263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 80.14285714285717, 78, 84, 80.0, 83.0, 83.9, 84.0, 0.09385642648360194, 0.0697507231972862, 0.047111526574776755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 102.76190476190477, 77, 238, 80.0, 236.8, 238.0, 238.0, 0.09385474860335195, 0.025113477653631287, 0.05352653631284916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 571.2, 390, 620, 615.0, 620.0, 620.0, 620.0, 0.038270773375788374, 11.252878081754027, 0.02182630044087931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 826.2, 690, 931, 848.0, 931.0, 931.0, 931.0, 0.03820380968390168, 34.37585510870894, 0.02175080180245574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02f477f3-6ae1-43da-9bf4-b33c087a7953", 3, 0, 0.0, 662.3333333333334, 246, 1386, 355.0, 1386.0, 1386.0, 1386.0, 0.021000168001344008, 0.024821487634401077, 0.013466904610236882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 112.8, 79, 236, 85.0, 236.0, 236.0, 236.0, 0.038383295589759336, 0.06792044102406633, 0.02125325058534526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19a8ec3c-f2fb-4898-9a57-4e16678e4f44", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 80.75, 79, 88, 80.0, 86.2, 88.0, 88.0, 0.06486766995329528, 0.04820732112740011, 0.03256052964452517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 93.58333333333333, 78, 240, 80.0, 192.90000000000015, 240.0, 240.0, 0.06486872192400629, 0.025476599284281767, 0.03654144638329847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 170.33333333333331, 78, 846, 81.5, 664.5000000000007, 846.0, 846.0, 0.06486872192400629, 4.8801096365865, 0.037671158825659905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 125.0, 78, 629, 79.5, 464.6000000000006, 629.0, 629.0, 0.06486837126331153, 1.6054816307638249, 0.037734303205578676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 79.2, 78, 81, 79.0, 81.0, 81.0, 81.0, 0.0384293169573204, 0.028559287309102364, 0.021578962158651592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 95.3809523809524, 77, 239, 80.0, 203.4000000000001, 238.29999999999998, 239.0, 0.09385432914266305, 0.025296674651733398, 0.055176080218635896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 727.9166666666667, 79, 1014, 817.5, 991.8000000000001, 1014.0, 1014.0, 0.06251497754670389, 46.87871386178459, 0.03227498515269283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 107.66666666666666, 78, 322, 80.0, 236.6, 313.4999999999999, 322.0, 0.09385181245726391, 0.025295996326371913, 0.055266252843486456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 546.0833333333333, 78, 712, 621.0, 710.5, 712.0, 712.0, 0.06242619403101542, 15.298949126553502, 0.032290111430756344], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 515.9999999999999, 82, 1232, 424.5, 1194.0, 1232.0, 1232.0, 0.07948448633150709, 0.015657379282936385, 0.053991345416867745], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b8fe9f89-0ccc-4714-ae36-e3e4876e01a2", 3, 0, 0.0, 450.0, 207, 699, 444.0, 699.0, 699.0, 699.0, 0.05333238520204085, 0.034287584887379784, 0.03420078087500667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6af05e12-8812-4634-bdea-821d8ea491ca", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.879713326446281, 1.6437456955922864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 252.08333333333331, 160, 934, 163.0, 749.8000000000006, 934.0, 934.0, 0.0648396299818449, 6.556342979016275, 0.14444336190779805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 506.6818181818182, 88, 1551, 423.5, 1199.2999999999997, 1521.1499999999996, 1551.0, 0.09929993545504195, 0.06099576113400527, 0.044898310659848076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 80.08333333333333, 79, 83, 79.5, 83.0, 83.0, 83.0, 0.06251497754670389, 0.04645888468070475, 0.03137958833887285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 173.25, 79, 242, 234.5, 242.0, 242.0, 242.0, 0.06251530322526869, 0.09497360682041958, 0.03127800164623632], "isController": false}, {"data": ["login", 22, 0, 0.0, 2773.909090909091, 1941, 4690, 2638.0, 3819.2999999999997, 4569.699999999998, 4690.0, 0.09367601723638716, 25.59938762630295, 0.17664050125185224], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 107.99999999999999, 80, 253, 84.0, 237.8, 251.49999999999997, 253.0, 0.09224362860079593, 0.0746777032324803, 0.03278972735418918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be22cbf6-6835-4cca-addf-c42b04ad8860", 3, 0, 0.0, 574.0, 205, 946, 571.0, 946.0, 946.0, 946.0, 0.09237306401453335, 0.0417964059180343, 0.05923663284786157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02f477f3-6ae1-43da-9bf4-b33c087a7953", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3cdfe5c-e460-436e-8dfa-7e01fff18eb8", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 0.24816492101648352, 0.9470509958791209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29463a44-161b-4095-8671-a3b8b6c86801", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 1.9008091517857142, 3.5516648065476186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2104318-5f92-480f-87e7-10bf4b02fadc", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 832.4166666666667, 159, 1094, 898.0, 1071.8000000000002, 1094.0, 1094.0, 0.06239925120898549, 62.22544938835734, 0.12703285060579272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38b88439-5541-4828-8c1c-94970de4909f", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfcedfaf-c0b0-4d61-9955-2d47274ac922", 1, 0, 0.0, 1232.0, 1232, 1232, 1232.0, 1232.0, 1232.0, 1232.0, 0.8116883116883118, 0.14664290787337664, 0.5596210430194806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 266.4, 161, 782, 165.0, 602.6000000000001, 782.0, 782.0, 0.07258685016622389, 5.894269615991367, 0.16201139220368838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 595.75, 79, 1012, 809.5, 1012.0, 1012.0, 1012.0, 0.059444638465139435, 44.45374847208702, 0.09841890032991774], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1089.0000000000002, 267, 2234, 970.0, 1800.2000000000005, 2171.7999999999993, 2234.0, 0.09943409032938623, 0.03147845522655841, 0.044861864972828555], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 218.76190476190476, 159, 402, 164.0, 322.0, 393.9999999999999, 402.0, 0.09381659302808691, 0.1453973956402089, 0.21099571654656654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 91.14285714285715, 80, 254, 82.0, 95.0, 238.19999999999976, 254.0, 0.12236407390790063, 0.09499945191091895, 0.04349660439694906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 426.9333333333333, 159, 1246, 317.0, 1059.4, 1246.0, 1246.0, 0.08423606314335293, 26.969234050252428, 0.18370152390057898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63f9f8b6-d1d5-4b44-8ddc-4719aff5e2fe", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 79.86666666666667, 78, 82, 80.0, 81.4, 82.0, 82.0, 0.08083072429717685, 0.0600704894435074, 0.04057323465698135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 110.53333333333333, 78, 237, 80.0, 235.8, 237.0, 237.0, 0.08083203103949993, 0.02162888330549119, 0.0460995177022148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 100.46666666666667, 77, 242, 79.0, 235.4, 242.0, 242.0, 0.08083246662966337, 0.021786875771276453, 0.04752064932720444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 79.00000000000003, 76, 84, 79.0, 81.6, 84.0, 84.0, 0.08083246662966337, 0.021786875771276453, 0.04759958728289747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 85.5, 82, 89, 85.5, 89.0, 89.0, 89.0, 0.05039052658100277, 0.014861268581506678, 0.03114961262282691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfcedfaf-c0b0-4d61-9955-2d47274ac922", 3, 0, 0.0, 502.6666666666667, 183, 925, 400.0, 925.0, 925.0, 925.0, 0.039446175693266534, 0.0328846536297056, 0.02529588740746585], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 890.4561403508773, 617, 1512, 857.0, 1217.0, 1334.3999999999996, 1512.0, 0.24938419604222906, 298.3501984409113, 0.4924363714818234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2104318-5f92-480f-87e7-10bf4b02fadc", 3, 0, 0.0, 445.0, 173, 817, 345.0, 817.0, 817.0, 817.0, 0.036411302068161955, 0.03035460436086028, 0.023349695662200215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1089.0000000000002, 267, 2234, 970.0, 1800.2000000000005, 2171.7999999999993, 2234.0, 0.09816474605207, 0.031076611182244984, 0.044289172535211266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 100.57142857142857, 77, 233, 79.0, 233.0, 233.0, 233.0, 0.05364354629821214, 0.01445861208818999, 0.03158892423615421], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be22cbf6-6835-4cca-addf-c42b04ad8860", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 123.71428571428572, 78, 233, 79.0, 233.0, 233.0, 233.0, 0.05364354629821214, 0.01445861208818999, 0.031536537960472365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 109.47619047619048, 78, 242, 80.0, 236.2, 241.5, 242.0, 0.12462981976154162, 0.033591631107603014, 0.07326870263325005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 109.95238095238095, 77, 239, 81.0, 235.4, 238.7, 239.0, 0.12463203874275947, 0.03359222919238439, 0.0733917181268398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 89.09523809523809, 78, 238, 81.0, 91.4, 223.4999999999998, 238.0, 0.12463055941316811, 0.09262095284513763, 0.0625586987679379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 100.57142857142857, 78, 233, 79.0, 233.0, 233.0, 233.0, 0.05370734102627056, 0.014370909610545051, 0.030629967929044925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 125.42857142857142, 78, 242, 81.0, 241.2, 242.0, 242.0, 0.12463277842072465, 0.03334900516335796, 0.07107963144306953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 80.85714285714286, 80, 83, 81.0, 83.0, 83.0, 83.0, 0.05370486872995658, 0.03991152842138374, 0.026957326686716482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c44797a0-053d-45e1-a3b5-e9a6926cd342", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.8492977061170213, 1.5869140625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 88.28571428571429, 80, 132, 81.0, 132.0, 132.0, 132.0, 0.05522551734475713, 0.04346852244128344, 0.019630945618644136], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 469.5384615384615, 79, 817, 408.0, 779.8, 817.0, 817.0, 0.08899050539761642, 0.016672349794295025, 0.060565953943990745], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1541.7727272727275, 849, 2413, 1564.0, 2027.8, 2362.5999999999995, 2413.0, 0.09555080696999704, 0.049455007513768, 0.043949638752801376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 205.42857142857142, 159, 314, 163.0, 314.0, 314.0, 314.0, 0.05360903695194333, 0.08308353676048248, 0.12056798056672412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3cdfe5c-e460-436e-8dfa-7e01fff18eb8", 3, 0, 0.0, 380.66666666666663, 169, 724, 249.0, 724.0, 724.0, 724.0, 0.0294930150709307, 0.024587113149952322, 0.018913163961501785], "isController": false}, {"data": ["addBook", 61, 9, 14.754098360655737, 870.4590163934423, 409, 2347, 702.0, 1469.2, 1575.1999999999998, 2347.0, 0.28328217226342456, 89.98700105621293, 1.02955092374369], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8fe9f89-0ccc-4714-ae36-e3e4876e01a2", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 0.5329323377581121, 2.033785029498525], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 135.47368421052636, 79, 350, 81.0, 320.6, 331.2, 350.0, 0.2501536030896164, 0.18590516792109188, 0.12092386086851575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a767a2d0-3dc3-4329-b673-db5a8478bcc2", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 500.91228070175436, 384, 722, 469.0, 632.2, 654.1999999999996, 722.0, 0.2500504487747528, 73.5231343960843, 0.12575779406152118], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 131.43859649122808, 78, 331, 82.0, 241.4, 255.8999999999996, 331.0, 0.25047128149017234, 0.44321675982440645, 0.1218112286934627], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 753.0526315789471, 537, 1180, 767.0, 930.4000000000001, 1008.5999999999999, 1180.0, 0.24978746154587764, 224.75919697850296, 0.12538159690877063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 86.0, 81, 102, 82.0, 100.8, 102.0, 102.0, 0.08922251500425295, 0.06665549216626318, 0.03171581588041804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 9, 5.027932960893855, 149.82122905027936, 79, 1825, 88.0, 276.0, 367.0, 1120.19999999999, 0.7228614004127175, 1.5457701060970734, 0.3480064017655587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 106.73333333333333, 79, 240, 83.0, 240.0, 240.0, 240.0, 0.08043067947838023, 0.06228664924448781, 0.028590593095830473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 86.33333333333333, 80, 100, 84.0, 99.4, 100.0, 100.0, 0.07388616604684382, 0.059960355454030494, 0.02626422308696402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a767a2d0-3dc3-4329-b673-db5a8478bcc2", 3, 0, 0.0, 915.6666666666667, 190, 2209, 348.0, 2209.0, 2209.0, 2209.0, 0.027643400138217, 0.02304516528449666, 0.017727050218843583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=637962f5-fbb9-4741-bd8c-a9832dbf4d5b", 1, 0, 0.0, 1156.0, 1156, 1156, 1156.0, 1156.0, 1156.0, 1156.0, 0.8650519031141869, 0.1562837910899654, 0.5964127378892734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 212.60000000000002, 158, 322, 163.0, 319.0, 322.0, 322.0, 0.08079589341405741, 0.12521785434385654, 0.181711857941967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 237.71428571428572, 159, 480, 165.0, 322.4, 464.2999999999998, 480.0, 0.12456993712184128, 0.19305907247300982, 0.2801607081949223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19a8ec3c-f2fb-4898-9a57-4e16678e4f44", 3, 0, 0.0, 504.3333333333333, 182, 969, 362.0, 969.0, 969.0, 969.0, 0.016594847852903268, 0.02287733745346528, 0.01064187834317039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/274b241b-afc8-4386-b489-179511524057", 3, 0, 0.0, 299.0, 166, 408, 323.0, 408.0, 408.0, 408.0, 0.037122740153193175, 0.03017431059977974, 0.023805923861259945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 98.75, 82, 246, 84.5, 199.80000000000018, 246.0, 246.0, 0.06657789613848202, 0.05519983771637816, 0.02366636151797603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 84.25000000000001, 80, 96, 83.0, 93.60000000000001, 96.0, 96.0, 0.06096507717162685, 0.047331285499456394, 0.021671179775851732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ca6801d-4af3-4633-bfab-06f91e87b077", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 1.9712094907407407, 3.683207947530864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38b88439-5541-4828-8c1c-94970de4909f", 3, 0, 0.0, 853.0, 181, 1939, 439.0, 1939.0, 1939.0, 1939.0, 0.03510496384188724, 0.028739903666128393, 0.022511972255376912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 93.19999999999999, 79, 234, 81.0, 159.60000000000005, 234.0, 234.0, 0.08471752353735196, 0.06295901895695785, 0.04252422568183487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 121.0, 78, 238, 80.0, 237.4, 238.0, 238.0, 0.08472230851346237, 0.056602886065439506, 0.04642076487300126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 332.6, 78, 1011, 234.0, 918.0, 1011.0, 1011.0, 0.08427865895797866, 20.239080997409836, 0.047615247554514246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 233.2, 77, 622, 80.0, 620.8, 622.0, 622.0, 0.0844642153274396, 6.639437221971958, 0.04780256665634326], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 23.80952380952381, 0.37425149700598803], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.1497005988023952], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.0748502994011976], "isController": false}, {"data": ["401/Unauthorized", 13, 61.904761904761905, 0.9730538922155688], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1336, 21, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
