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

    var data = {"OkPercent": 98.1117824773414, "KoPercent": 1.8882175226586102};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7741726151849448, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.00909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4bb9f2d-8844-4cc2-bc4b-cb7529c33638"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2244db8c-71f8-42b6-90d1-7074d18701f7"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4353e9d1-1e39-43af-a1bb-e4733c7e20b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41fc4443-4bc3-4448-9751-7764e702344e"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65d5b9de-163c-4c04-b48f-5fa226b62d14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=054b6503-5be6-4085-b043-ebf33c1553a9"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/054b6503-5be6-4085-b043-ebf33c1553a9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ec85c6df-87da-4acc-aa24-601e28a28734"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/738cd6ba-0f8f-48fb-9069-3abd3136e58b"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65d5b9de-163c-4c04-b48f-5fa226b62d14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b0525a6-5821-4093-9bd6-2c5f9c8efcfa"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd4fa584-ad59-4b50-b001-4c1cb3887034"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f16cb49a-2d0c-475d-a7e2-830bd0a36f4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3db1746-e416-4de6-95ca-723664427593"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27758bc0-331b-4b97-8aa8-b82b775b3ce7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa78e110-5248-449d-be3b-38c202d919a2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/49dd614b-3903-46ca-85b2-975490f9c7bb"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41818181818181815, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41fc4443-4bc3-4448-9751-7764e702344e"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4353e9d1-1e39-43af-a1bb-e4733c7e20b6"], "isController": false}, {"data": [0.4772727272727273, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40498738-fe62-4537-9e33-9c6b9c85949a"], "isController": false}, {"data": [0.28225806451612906, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec85c6df-87da-4acc-aa24-601e28a28734"], "isController": false}, {"data": [0.9454545454545454, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9727272727272728, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9301675977653632, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd4fa584-ad59-4b50-b001-4c1cb3887034"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2244db8c-71f8-42b6-90d1-7074d18701f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27758bc0-331b-4b97-8aa8-b82b775b3ce7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b0525a6-5821-4093-9bd6-2c5f9c8efcfa"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f16cb49a-2d0c-475d-a7e2-830bd0a36f4c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fa78e110-5248-449d-be3b-38c202d919a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49dd614b-3903-46ca-85b2-975490f9c7bb"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1324, 25, 1.8882175226586102, 374.8308157099701, 118, 3425, 136.0, 991.5, 1134.25, 1535.25, 5.132220576948422, 708.2230228328579, 3.751345651324919], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1833.0181818181823, 1482, 2285, 1792.0, 2142.8, 2194.8, 2285.0, 0.2401285342554269, 288.9554867528182, 1.1807101269297602], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d4bb9f2d-8844-4cc2-bc4b-cb7529c33638", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2244db8c-71f8-42b6-90d1-7074d18701f7", 3, 0, 0.0, 738.0, 279, 1503, 432.0, 1503.0, 1503.0, 1503.0, 0.024912598300960796, 0.02498558442879564, 0.015975852426071864], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 442.49999999999994, 133, 752, 434.0, 674.0, 752.0, 752.0, 0.08718558697696432, 0.01717439297035067, 0.0586629584249301], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 442.49999999999994, 133, 752, 434.0, 674.0, 752.0, 752.0, 0.08459521191100583, 0.016664123774880055, 0.056920020514338886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 171.33333333333331, 120, 375, 127.0, 362.6, 373.9, 375.0, 0.1099487952753432, 0.03728360375501314, 0.06226545893150714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 150.23809523809524, 121, 379, 127.0, 323.60000000000014, 378.3, 379.0, 0.1100819324096935, 0.08180893609743824, 0.055255969979084434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 255.6666666666667, 120, 870, 129.0, 385.2, 821.5999999999993, 870.0, 0.10994016114086475, 1.5675573292131948, 0.06429024955107768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 243.8095238095238, 122, 863, 128.0, 384.6, 815.2999999999993, 863.0, 0.11008308652006395, 4.745065304497681, 0.06426632571488482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4353e9d1-1e39-43af-a1bb-e4733c7e20b6", 3, 0, 0.0, 343.3333333333333, 252, 396, 382.0, 396.0, 396.0, 396.0, 0.0203620370181833, 0.024067238415697773, 0.013057686499290722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41fc4443-4bc3-4448-9751-7764e702344e", 3, 0, 0.0, 272.3333333333333, 209, 386, 222.0, 386.0, 386.0, 386.0, 0.023249866313268697, 0.02748055487743446, 0.014909582238652129], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 221.64285714285714, 128, 307, 225.0, 293.0, 307.0, 307.0, 0.08650732840653502, 0.1795739108572876, 0.055913567593118954], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 147.35714285714286, 121, 384, 128.0, 263.5, 384.0, 384.0, 0.06959945513569407, 0.0517238138264289, 0.03493566400365894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 142.07142857142858, 119, 354, 126.0, 244.0, 354.0, 354.0, 0.06959807113917128, 0.02608956712485397, 0.03927513919614228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 863.5, 831, 876, 868.0, 876.0, 876.0, 876.0, 0.054242191384531936, 15.949005277313205, 0.03093499977399087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1105.8333333333335, 1063, 1151, 1112.5, 1151.0, 1151.0, 1151.0, 0.05412036368884399, 48.69759838067362, 0.03081266799862895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65d5b9de-163c-4c04-b48f-5fa226b62d14", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.30517578125, 1.1646167652027029], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 127.83333333333333, 126, 129, 128.0, 129.0, 129.0, 129.0, 0.054608999563128, 0.09663233125819135, 0.0302376003440367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 145.49999999999997, 120, 374, 126.0, 301.10000000000025, 374.0, 374.0, 0.11550678602367889, 0.08584049234767542, 0.057978992203291946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 188.25, 120, 385, 126.0, 381.7, 385.0, 385.0, 0.11551234538191268, 0.0453664208018482, 0.06506969846464841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 219.75, 119, 840, 129.0, 739.5000000000003, 840.0, 840.0, 0.11551345731777753, 8.690140941458742, 0.0670820338069385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 245.75, 119, 849, 127.5, 708.3000000000005, 849.0, 849.0, 0.11551234538191268, 2.8589117473648744, 0.06719419309813736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 212.16666666666669, 126, 386, 129.0, 386.0, 386.0, 386.0, 0.05448552047293432, 0.04049168074209279, 0.030594896749938705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 272.5, 124, 1150, 132.0, 766.5, 1150.0, 1150.0, 0.06959807113917128, 4.490595133417017, 0.04048883323805026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 793.4285714285713, 124, 1256, 977.5, 1252.5, 1256.0, 1256.0, 0.09225396197818853, 59.30015948815525, 0.04857232875358308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 194.7857142857143, 120, 621, 124.5, 497.5, 621.0, 621.0, 0.0696032614099632, 1.4792538002137816, 0.04055982462463956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 683.4285714285714, 123, 1112, 872.0, 1044.5, 1112.0, 1112.0, 0.09225517782185526, 19.38287978656106, 0.04866306185050708], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=054b6503-5be6-4085-b043-ebf33c1553a9", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 412.2142857142858, 131, 739, 396.5, 686.5, 739.0, 739.0, 0.08473396561011481, 0.016691456395296053, 0.05755715381635728], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/054b6503-5be6-4085-b043-ebf33c1553a9", 3, 0, 0.0, 272.3333333333333, 199, 375, 243.0, 375.0, 375.0, 375.0, 0.044060627423334504, 0.02884307348578311, 0.02825502474738574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec85c6df-87da-4acc-aa24-601e28a28734", 3, 0, 0.0, 1191.0, 234, 2522, 817.0, 2522.0, 2522.0, 2522.0, 0.04028251470311787, 0.03358187505035314, 0.025832211577194723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 409.58333333333337, 248, 972, 260.5, 906.6000000000003, 972.0, 972.0, 0.11536686663590216, 11.665469810533956, 0.25700297910898323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/738cd6ba-0f8f-48fb-9069-3abd3136e58b", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 474.9545454545454, 145, 1076, 489.5, 818.8999999999999, 1042.6999999999996, 1076.0, 0.09737874133550518, 0.05981565263675074, 0.04402964574056533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 126.57142857142857, 121, 133, 127.0, 131.5, 133.0, 133.0, 0.09225456989601592, 0.0685602809481134, 0.04630746965483612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 180.2142857142857, 119, 377, 127.5, 377.0, 377.0, 377.0, 0.09225639369757035, 0.12366063485578348, 0.047080620556042466], "isController": false}, {"data": ["login", 22, 0, 0.0, 2335.2727272727275, 1471, 4217, 2129.5, 3639.9999999999995, 4161.049999999999, 4217.0, 0.10026798898875175, 32.851875481400285, 0.19662816129017555], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 131.07142857142858, 128, 144, 129.5, 138.5, 144.0, 144.0, 0.0688258313177197, 0.05571934976795862, 0.024465432226220673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65d5b9de-163c-4c04-b48f-5fa226b62d14", 3, 0, 0.0, 387.66666666666663, 218, 694, 251.0, 694.0, 694.0, 694.0, 0.044574536053370584, 0.02825085341663819, 0.028584582039433606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b0525a6-5821-4093-9bd6-2c5f9c8efcfa", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 924.0714285714286, 256, 1378, 1106.5, 1374.5, 1378.0, 1378.0, 0.09217621458622755, 78.80852881000506, 0.1904606465173851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd4fa584-ad59-4b50-b001-4c1cb3887034", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f16cb49a-2d0c-475d-a7e2-830bd0a36f4c", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3db1746-e416-4de6-95ca-723664427593", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 432.76190476190476, 251, 995, 499.0, 758.6, 971.6999999999997, 995.0, 0.10986653831464731, 6.421143292124662, 0.24575382996060502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 949.2222222222222, 128, 1538, 1193.0, 1538.0, 1538.0, 1538.0, 0.0710244087217974, 56.65292479994792, 0.12231981502087329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27758bc0-331b-4b97-8aa8-b82b775b3ce7", 3, 0, 0.0, 295.3333333333333, 209, 422, 255.0, 422.0, 422.0, 422.0, 0.019533284717158036, 0.026928209888399834, 0.012526227504167101], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa78e110-5248-449d-be3b-38c202d919a2", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.28495908911671924, 1.0874654968454258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49dd614b-3903-46ca-85b2-975490f9c7bb", 3, 0, 0.0, 614.6666666666667, 252, 1332, 260.0, 1332.0, 1332.0, 1332.0, 0.023853823767950002, 0.028194412142391424, 0.01529688568452523], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1034.5217391304348, 271, 3425, 994.0, 2120.600000000001, 3220.599999999997, 3425.0, 0.0925735859384748, 0.02902358010231394, 0.04176659834333531], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 456.57142857142856, 253, 1277, 389.0, 1017.0, 1277.0, 1277.0, 0.06955243011222782, 6.043585115717855, 0.1551539282218921], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 131.55555555555554, 124, 141, 132.0, 136.5, 141.0, 141.0, 0.10100443297233601, 0.07841652755176477, 0.03590391953313506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 458.5, 252, 1501, 261.0, 983.7000000000005, 1501.0, 1501.0, 0.08464578384641022, 6.452096975301948, 0.18901676317167754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 126.41666666666667, 120, 132, 127.5, 131.4, 132.0, 132.0, 0.06503042882148606, 0.048328277669092666, 0.03264222696703499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 125.25, 118, 135, 125.0, 134.7, 135.0, 135.0, 0.06503078123645192, 0.017400814510534986, 0.03708786742391399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 126.75, 120, 133, 127.5, 131.8, 133.0, 133.0, 0.06503007641033978, 0.017527637782474393, 0.03823057226467241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 125.83333333333333, 120, 131, 127.5, 130.1, 131.0, 131.0, 0.0650328958064621, 0.01752839769783549, 0.03829573844853188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 134.5, 131, 138, 134.5, 138.0, 138.0, 138.0, 0.12287276525158199, 0.036237866314431405, 0.07595552773852675], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1189.2545454545455, 951, 1758, 1021.0, 1625.8, 1657.6, 1758.0, 0.2404550283518338, 287.66780960224366, 0.4748047532494218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1034.5217391304348, 271, 3425, 994.0, 2120.600000000001, 3220.599999999997, 3425.0, 0.09254378729414038, 0.029014237660493058, 0.04175315403309848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 149.6, 120, 380, 124.5, 354.9000000000001, 380.0, 380.0, 0.05074442065094943, 0.013677207128576212, 0.02988172427004151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 151.70000000000002, 123, 382, 127.0, 356.6000000000001, 382.0, 382.0, 0.05074287570025168, 0.013676790716083461, 0.029831260909718275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 223.05555555555554, 119, 868, 127.5, 429.70000000000067, 868.0, 868.0, 0.10019649646250703, 5.034227062308305, 0.0584262122384454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41fc4443-4bc3-4448-9751-7764e702344e", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 151.8333333333333, 120, 599, 126.0, 178.70000000000067, 599.0, 599.0, 0.10019593872461703, 1.662224095870814, 0.058523734608790526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 176.1, 123, 381, 126.0, 380.5, 381.0, 381.0, 0.05074313318550167, 0.013577752434401815, 0.028939443144856424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 139.0, 119, 363, 126.0, 155.10000000000034, 363.0, 363.0, 0.10019538099293623, 0.07446160638244577, 0.05029338459996994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 181.7, 123, 372, 130.5, 370.9, 372.0, 372.0, 0.05072768869432002, 0.03769899521130619, 0.025462921864141105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 166.72222222222223, 118, 377, 127.0, 375.2, 377.0, 377.0, 0.10019593872461703, 0.03517077493208942, 0.056675502232142856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 134.29999999999995, 127, 164, 131.0, 161.3, 164.0, 164.0, 0.04984746675173968, 0.039235408400295095, 0.017719216696907465], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 554.923076923077, 375, 1332, 422.0, 1125.9999999999998, 1332.0, 1332.0, 0.08439530762089628, 0.015811440595441355, 0.05743851314943812], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4353e9d1-1e39-43af-a1bb-e4733c7e20b6", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1114.1363636363635, 728, 2106, 1046.0, 1346.4, 1993.0499999999984, 2106.0, 0.09951193917106554, 0.05150520289127416, 0.04577160483356628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 360.7, 248, 754, 259.5, 752.9, 754.0, 754.0, 0.05069502884547141, 0.0785673933376593, 0.11401430803820377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40498738-fe62-4537-9e33-9c6b9c85949a", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["addBook", 62, 11, 17.741935483870968, 1109.8064516129034, 635, 2048, 989.0, 1815.5, 1870.6, 2048.0, 0.2848099812117286, 83.5578149906518, 1.036128196360404], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec85c6df-87da-4acc-aa24-601e28a28734", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 227.98181818181826, 121, 526, 130.0, 501.0, 515.2, 526.0, 0.241390055607491, 0.17939241437236392, 0.11668757570869925], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 724.763636363636, 591, 1012, 635.0, 893.4, 919.7999999999995, 1012.0, 0.24127674881774394, 70.9433752944673, 0.12134523988392394], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 177.2, 121, 570, 128.0, 385.6, 510.79999999999995, 570.0, 0.24180819773755455, 0.42788716240278213, 0.11759812741533415], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 953.7090909090911, 823, 1305, 886.0, 1145.0, 1248.2, 1305.0, 0.24100292270817175, 216.85485349076302, 0.12097217018750028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 130.3125, 125, 135, 131.0, 133.6, 135.0, 135.0, 0.08269588587967748, 0.061779641306595, 0.02939580318379161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 11, 6.145251396648045, 185.659217877095, 121, 980, 132.0, 302.0, 378.0, 893.5999999999988, 0.7374874338733334, 1.559170169560309, 0.35637152191244087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 195.0, 128, 391, 132.0, 388.3, 391.0, 391.0, 0.06683672901048222, 0.05175930283721915, 0.023758368515444855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 148.38095238095238, 128, 386, 131.0, 212.60000000000005, 370.19999999999976, 386.0, 0.11690697544953516, 0.09487275058453488, 0.04155677642932695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd4fa584-ad59-4b50-b001-4c1cb3887034", 3, 0, 0.0, 407.0, 228, 537, 456.0, 537.0, 537.0, 537.0, 0.0811600476138946, 0.036722808002380695, 0.05204599407531653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 256.1666666666667, 246, 263, 257.0, 263.0, 263.0, 263.0, 0.06498499929599584, 0.10071405652611856, 0.14615278650261565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 364.0555555555556, 245, 994, 258.0, 767.2000000000004, 994.0, 994.0, 0.100124599501602, 6.801210038812188, 0.2237593588688145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2244db8c-71f8-42b6-90d1-7074d18701f7", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27758bc0-331b-4b97-8aa8-b82b775b3ce7", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 158.66666666666669, 127, 431, 131.5, 351.8000000000003, 431.0, 431.0, 0.10855111400580748, 0.08999989823333063, 0.03858652880675188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 149.2142857142857, 124, 381, 130.5, 261.5, 381.0, 381.0, 0.09610830032470875, 0.07461533081849947, 0.03416349738104881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b0525a6-5821-4093-9bd6-2c5f9c8efcfa", 3, 0, 0.0, 300.3333333333333, 222, 410, 269.0, 410.0, 410.0, 410.0, 0.02304908687200842, 0.02724324037508547, 0.01478082719331269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f16cb49a-2d0c-475d-a7e2-830bd0a36f4c", 3, 0, 0.0, 549.3333333333334, 307, 961, 380.0, 961.0, 961.0, 961.0, 0.04866180048661801, 0.03128484894566099, 0.03120564679643147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa78e110-5248-449d-be3b-38c202d919a2", 3, 0, 0.0, 383.66666666666663, 205, 657, 289.0, 657.0, 657.0, 657.0, 0.01999120387029707, 0.023628926189143442, 0.01281988008609545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 174.0, 125, 381, 128.0, 376.8, 381.0, 381.0, 0.085154395563456, 0.06328368654666992, 0.04274351496056287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 187.625, 123, 379, 127.0, 378.3, 379.0, 379.0, 0.08504350506806138, 0.03073899151691037, 0.04805497863281935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 235.3125, 121, 1129, 127.0, 608.9000000000005, 1129.0, 1129.0, 0.0847049356507192, 4.785006837607403, 0.04934227940981836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 243.75000000000003, 123, 741, 128.5, 489.0000000000002, 741.0, 741.0, 0.08487928574081048, 1.5812807853190667, 0.049526731670053004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49dd614b-3903-46ca-85b2-975490f9c7bb", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5287009063444109], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.1510574018126888], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.0755287009063444], "isController": false}, {"data": ["401/Unauthorized", 15, 60.0, 1.1329305135951662], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1324, 25, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
