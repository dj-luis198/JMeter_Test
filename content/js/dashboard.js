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

    var data = {"OkPercent": 99.14728682170542, "KoPercent": 0.8527131782945736};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7503351206434317, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba233270-a9ef-4076-945c-bf2791da5e10"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7028d291-eb9c-4325-9d6d-993925ea7648"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b3c0ad06-9f29-402d-aced-2cf50f606ba4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2914b6d-223c-447b-84f3-1afd51a7cde3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=480806c5-73b9-4572-af53-c251aa7fcae2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ae1f855-62e2-4cb9-b999-70764fa67bf4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=795624f9-feb7-4e5b-87ea-6ad47ff4d5dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ce7972c2-4248-4e26-8d07-bb7dc75dd82b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0fd1d2c4-3e43-430a-94ff-131a3bda6030"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/812955eb-483e-45d3-b8fe-d11d2b05a0dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d064f59a-1ae8-47f8-905e-f6877c0f0c97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/63b0e293-3ecb-4a8a-9553-4f6620850e77"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/22ce0268-b7f9-4254-a1dd-2e80373cee78"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7028d291-eb9c-4325-9d6d-993925ea7648"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f767e19-ae64-4149-8961-94a0ba2112a5"], "isController": false}, {"data": [0.3125, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/795624f9-feb7-4e5b-87ea-6ad47ff4d5dc"], "isController": false}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b2914b6d-223c-447b-84f3-1afd51a7cde3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ae1f855-62e2-4cb9-b999-70764fa67bf4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4396551724137931, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9764705882352941, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef5eb38b-e697-4fb9-84ac-d07fd85e7c85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba233270-a9ef-4076-945c-bf2791da5e10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/480806c5-73b9-4572-af53-c251aa7fcae2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce7972c2-4248-4e26-8d07-bb7dc75dd82b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=812955eb-483e-45d3-b8fe-d11d2b05a0dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/618bcbd7-19fe-4e45-a109-0fd876e4ceb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22ce0268-b7f9-4254-a1dd-2e80373cee78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/092ef307-5c45-48e9-835b-55ab9d13b3ec"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fd1d2c4-3e43-430a-94ff-131a3bda6030"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1290, 11, 0.8527131782945736, 451.4310077519379, 127, 2779, 152.0, 1264.0, 1473.9500000000005, 1969.09, 5.004791408829384, 727.3330566230073, 3.6588368394354287], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba233270-a9ef-4076-945c-bf2791da5e10", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.32788396098003625, 1.2512760889292196], "isController": false}, {"data": ["see books", 58, 0, 0.0, 2120.3620689655168, 1542, 3318, 2104.5, 2579.1000000000004, 2727.6499999999996, 3318.0, 0.2446741193840962, 294.42462939648806, 1.2030607334950432], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7028d291-eb9c-4325-9d6d-993925ea7648", 3, 0, 0.0, 530.3333333333334, 233, 885, 473.0, 885.0, 885.0, 885.0, 0.08706503758307456, 0.039394662187654174, 0.055832722668833615], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 636.5, 144, 1025, 564.5, 1019.3000000000001, 1025.0, 1025.0, 0.06098676587180581, 0.011598801419466976, 0.04120874975859405], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 636.5, 144, 1025, 564.5, 1019.3000000000001, 1025.0, 1025.0, 0.060467413103288424, 0.011500028029165449, 0.0408578231605309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 209.93333333333337, 128, 551, 130.0, 457.40000000000003, 551.0, 551.0, 0.09526168384552366, 0.025489942747728006, 0.054328929068150206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 168.53333333333336, 130, 403, 133.0, 394.0, 403.0, 403.0, 0.09525684420425608, 0.07079146331976453, 0.04781447062596448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 193.00000000000003, 129, 536, 131.0, 452.6, 536.0, 536.0, 0.09526107886347182, 0.02567583766242014, 0.056096123588548354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 184.53333333333333, 128, 406, 131.0, 400.6, 406.0, 406.0, 0.09526047388910411, 0.025675674602922593, 0.0560027395324616], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 243.75, 130, 300, 243.5, 296.40000000000003, 300.0, 300.0, 0.06081276257177173, 0.1527495049461047, 0.03930955184794782], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b3c0ad06-9f29-402d-aced-2cf50f606ba4", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.6117546695402298, 1.143064535440613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2914b6d-223c-447b-84f3-1afd51a7cde3", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 160.1111111111111, 129, 397, 130.0, 386.20000000000005, 397.0, 397.0, 0.12573432337470924, 0.09344123055483763, 0.06311273653769585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 159.38888888888886, 127, 393, 130.0, 390.3, 393.0, 393.0, 0.1255125094134382, 0.044057396696231835, 0.07099573693275318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 938.5, 757, 1055, 971.0, 1055.0, 1055.0, 1055.0, 0.03955148614709198, 11.629450160183518, 0.022556706943263394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1298.5, 1150, 1450, 1297.0, 1450.0, 1450.0, 1450.0, 0.03945278980539912, 35.499689617505204, 0.022461891070847347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=480806c5-73b9-4572-af53-c251aa7fcae2", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.5345090606508875, 2.0398021449704142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 256.75, 128, 385, 257.0, 385.0, 385.0, 385.0, 0.039764988915509336, 0.07036539054189739, 0.022018309292083788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ae1f855-62e2-4cb9-b999-70764fa67bf4", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 156.45454545454544, 129, 384, 134.0, 334.8000000000002, 384.0, 384.0, 0.061962405718566746, 0.0460482331560833, 0.031102223182952454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 131.63636363636365, 128, 136, 131.0, 135.8, 136.0, 136.0, 0.061964499974650894, 0.025041051481233208, 0.03486603345519685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 298.36363636363643, 128, 1447, 132.0, 1237.6000000000008, 1447.0, 1447.0, 0.061964499974650894, 5.0838890627728555, 0.035944250961858035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 285.7272727272727, 129, 1149, 138.0, 1026.8000000000004, 1149.0, 1149.0, 0.06196484903109508, 1.6715216067203695, 0.03600496598974763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=795624f9-feb7-4e5b-87ea-6ad47ff4d5dc", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 0.2458014455782313, 0.938031462585034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 196.5, 132, 387, 133.5, 387.0, 387.0, 387.0, 0.03986525543662421, 0.02962642518288186, 0.022385275269588792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 236.8888888888889, 127, 1537, 131.0, 501.1000000000016, 1537.0, 1537.0, 0.1257448636716103, 6.317867570137691, 0.07332388209323283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 832.2777777777775, 129, 1674, 1137.5, 1581.3000000000002, 1674.0, 1674.0, 0.08087379644065436, 40.43767922812701, 0.04368378457916422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 270.27777777777777, 129, 1075, 134.0, 466.60000000000093, 1075.0, 1075.0, 0.12551688550768092, 2.082291899105343, 0.07331351938887222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 696.3333333333334, 128, 1195, 885.5, 1190.5, 1195.0, 1195.0, 0.08087379644065436, 13.22056657149019, 0.04376276289600079], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 469.3636363636364, 142, 735, 487.0, 723.6, 735.0, 735.0, 0.06915238041353124, 0.013211640860255613, 0.047229160380086635], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 494.2727272727272, 260, 1581, 276.0, 1449.4000000000005, 1581.0, 1581.0, 0.06191706490597049, 6.821266277855643, 0.13781274274303854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce7972c2-4248-4e26-8d07-bb7dc75dd82b", 3, 0, 0.0, 601.6666666666667, 252, 1289, 264.0, 1289.0, 1289.0, 1289.0, 0.02157047433473062, 0.025495570413218385, 0.013832628398248477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fd1d2c4-3e43-430a-94ff-131a3bda6030", 3, 0, 0.0, 541.0, 251, 983, 389.0, 983.0, 983.0, 983.0, 0.019221281803212517, 0.02271890437091948, 0.012326147510523652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 676.952380952381, 157, 1498, 551.0, 1234.2, 1474.9999999999995, 1498.0, 0.08936816705889361, 0.05489509480473055, 0.04040767709791772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/812955eb-483e-45d3-b8fe-d11d2b05a0dc", 3, 0, 0.0, 326.0, 216, 533, 229.0, 533.0, 533.0, 533.0, 0.018827900438062484, 0.025955780714581583, 0.012073881465814808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 160.50000000000003, 128, 383, 133.5, 381.2, 383.0, 383.0, 0.08096510404015869, 0.06017035563921949, 0.04064068698890778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 217.44444444444446, 127, 403, 133.5, 391.3, 403.0, 403.0, 0.08096765342245772, 0.08922607293386292, 0.04239907719366113], "isController": false}, {"data": ["login", 21, 0, 0.0, 2962.7619047619055, 1866, 4334, 2945.0, 4037.2000000000003, 4305.9, 4334.0, 0.08731554590926667, 20.018493809431742, 0.15931919990894236], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 166.33333333333334, 131, 407, 136.5, 401.6, 407.0, 407.0, 0.1340772135775525, 0.10854493169510841, 0.04766025951389561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d064f59a-1ae8-47f8-905e-f6877c0f0c97", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.6002555216165413, 1.1215783599624058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63b0e293-3ecb-4a8a-9553-4f6620850e77", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1008.5, 264, 1804, 1269.0, 1716.7, 1804.0, 1804.0, 0.08082513482081517, 53.775095081790546, 0.1702888067291415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22ce0268-b7f9-4254-a1dd-2e80373cee78", 3, 0, 0.0, 973.6666666666666, 236, 1970, 715.0, 1970.0, 1970.0, 1970.0, 0.016987061521474476, 0.02341803565867331, 0.010893395572039298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 444.3333333333333, 261, 794, 279.0, 791.0, 794.0, 794.0, 0.09517766497461928, 0.14750679132296954, 0.21405679925444163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1040.8333333333333, 130, 1585, 1426.0, 1585.0, 1585.0, 1585.0, 0.05910165484633569, 47.14268894060284, 0.10189840979609929], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1311.333333333333, 523, 2402, 1273.0, 1833.4, 2346.1999999999994, 2402.0, 0.09251468119881405, 0.02937547634047165, 0.04174002218149618], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 138.06666666666666, 130, 152, 137.0, 150.2, 152.0, 152.0, 0.0685432279290806, 0.05321471308947176, 0.02436497555291537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 472.72222222222223, 260, 1666, 277.5, 874.9000000000012, 1666.0, 1666.0, 0.12539010254123942, 8.517431564433098, 0.2802229331531431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 396.99999999999994, 259, 653, 272.0, 580.1999999999999, 653.0, 653.0, 0.09770002643647774, 0.1514159589401271, 0.21972964930000805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 182.33333333333334, 128, 396, 132.0, 388.2, 396.0, 396.0, 0.07135925101330136, 0.05303163088000228, 0.035818999043786034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 198.93333333333334, 127, 396, 131.0, 391.8, 396.0, 396.0, 0.07136128792852454, 0.03338556087593602, 0.03989913676628702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 336.7333333333333, 127, 1441, 131.0, 1414.6, 1441.0, 1441.0, 0.07136196692610706, 8.578219480270795, 0.041135342133056765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 278.93333333333334, 127, 921, 133.0, 836.4000000000001, 921.0, 921.0, 0.07136264593661094, 2.814401517169853, 0.04120542362056006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 2.0769146126760565, 4.353268045774648], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1441.7068965517242, 1018, 2765, 1348.0, 1975.0, 2174.7, 2765.0, 0.24788655343664792, 296.55849721982406, 0.4894791123524434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1311.333333333333, 523, 2402, 1273.0, 1833.4, 2346.1999999999994, 2402.0, 0.08785434586164195, 0.02789571584557716, 0.03963740994929549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 233.2, 127, 399, 129.0, 399.0, 399.0, 399.0, 0.03537594011560857, 0.009534921359285123, 0.020831730361046845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7028d291-eb9c-4325-9d6d-993925ea7648", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 130.2, 128, 134, 130.0, 134.0, 134.0, 134.0, 0.035443899396035955, 0.009553238509087816, 0.020837136168372697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 334.1333333333333, 127, 1402, 133.0, 1393.6, 1402.0, 1402.0, 0.06951395840284728, 8.356075621338931, 0.04007009034497461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 280.2666666666667, 128, 891, 138.0, 832.8000000000001, 891.0, 891.0, 0.0694248383558347, 2.737978221428208, 0.04008651636574856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 133.66666666666666, 129, 143, 133.0, 140.6, 143.0, 143.0, 0.06950880444856349, 0.05165644549351251, 0.034890161607970344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 235.2, 128, 400, 135.0, 400.0, 400.0, 400.0, 0.03537568982595161, 0.009465760754209707, 0.020175198103863024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 218.4, 127, 406, 136.0, 400.6, 406.0, 406.0, 0.06943222951517788, 0.03248307300104611, 0.03882057207528305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 185.6, 131, 391, 137.0, 391.0, 391.0, 391.0, 0.03544188947801185, 0.026339138567155293, 0.01779016717939267], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 704.5454545454545, 132, 1289, 542.0, 1285.8, 1289.0, 1289.0, 0.06829074474161266, 0.012877267563137899, 0.04647699300330279], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 138.8, 131, 145, 141.0, 145.0, 145.0, 145.0, 0.03635570420999055, 0.02861591561841053, 0.012923316730895078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1603.9523809523807, 1086, 2779, 1428.0, 2466.0, 2749.4999999999995, 2779.0, 0.08684755772260891, 0.04495039608689719, 0.039946484069676554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 422.6, 267, 792, 273.0, 792.0, 792.0, 792.0, 0.035341433589912145, 0.05477231944061579, 0.07948371245856217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f767e19-ae64-4149-8961-94a0ba2112a5", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.6882240032327586, 1.2859476023706895], "isController": false}, {"data": ["addBook", 56, 3, 5.357142857142857, 1341.1071428571427, 688, 2428, 1097.0, 2256.9000000000005, 2377.6, 2428.0, 0.2686560003837943, 92.8497465983233, 0.9757613669073377], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/795624f9-feb7-4e5b-87ea-6ad47ff4d5dc", 3, 0, 0.0, 748.0, 275, 1273, 696.0, 1273.0, 1273.0, 1273.0, 0.01756645977280712, 0.024216782922473357, 0.011264949789202483], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 234.70689655172407, 129, 616, 135.0, 526.3, 538.2, 616.0, 0.2488640215567732, 0.18494679727021912, 0.12030047917051047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2914b6d-223c-447b-84f3-1afd51a7cde3", 3, 0, 0.0, 344.3333333333333, 230, 542, 261.0, 542.0, 542.0, 542.0, 0.023562121533422867, 0.02363115118635282, 0.015109824030222348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ae1f855-62e2-4cb9-b999-70764fa67bf4", 3, 0, 0.0, 439.0, 237, 792, 288.0, 792.0, 792.0, 792.0, 0.0215486280706795, 0.02161175881698032, 0.01381861891251257], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 817.8275862068967, 631, 1178, 770.0, 1053.4, 1070.3999999999999, 1178.0, 0.24874661726044198, 73.13976463959617, 0.1251020584854762], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 221.6724137931035, 128, 552, 136.0, 401.4, 409.04999999999995, 552.0, 0.2493218874526611, 0.4411828711564667, 0.12125224604631368], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1205.6034482758616, 889, 2238, 1189.5, 1529.8000000000002, 1641.95, 2238.0, 0.24848765273422105, 223.58962672495414, 0.12472915381385703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 152.0, 131, 387, 136.0, 204.59999999999985, 387.0, 387.0, 0.09684402415403896, 0.07234929538851544, 0.03442502421100604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 3, 1.7647058823529411, 198.17058823529416, 129, 951, 140.0, 331.5, 404.1499999999999, 649.9599999999966, 0.7017485923748823, 1.552429294959381, 0.3353219865057874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 135.33333333333334, 129, 148, 134.0, 144.4, 148.0, 148.0, 0.0693349850467549, 0.053693987443434205, 0.02464642046583865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef5eb38b-e697-4fb9-84ac-d07fd85e7c85", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba233270-a9ef-4076-945c-bf2791da5e10", 3, 0, 0.0, 359.0, 228, 499, 350.0, 499.0, 499.0, 499.0, 0.027323150905762456, 0.02740319919943168, 0.017521682058708344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 137.8, 132, 151, 136.0, 147.4, 151.0, 151.0, 0.09751214026146256, 0.07913338726296423, 0.03466251860856677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/480806c5-73b9-4572-af53-c251aa7fcae2", 3, 0, 0.0, 366.6666666666667, 281, 519, 300.0, 519.0, 519.0, 519.0, 0.07530687551773477, 0.03407440005522504, 0.04829249504229736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 556.2666666666667, 258, 1577, 269.0, 1546.4, 1577.0, 1577.0, 0.07131514638622381, 11.471482372975839, 0.15795654916703908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce7972c2-4248-4e26-8d07-bb7dc75dd82b", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 542.3333333333334, 263, 1539, 511.0, 1527.6, 1539.0, 1539.0, 0.06937859901482389, 11.159976750942391, 0.1536672732476122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=812955eb-483e-45d3-b8fe-d11d2b05a0dc", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 161.0909090909091, 133, 387, 138.0, 338.60000000000014, 387.0, 387.0, 0.05922352573800589, 0.04910231772613965, 0.021052112664681783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/618bcbd7-19fe-4e45-a109-0fd876e4ceb9", 2, 0, 0.0, 283.0, 230, 336, 283.0, 336.0, 336.0, 336.0, 0.01249570460154322, 0.02469854112648777, 0.007767105448127206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 136.55555555555554, 128, 165, 134.0, 151.50000000000003, 165.0, 165.0, 0.08202735156467174, 0.06368334423233792, 0.029158160126504407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22ce0268-b7f9-4254-a1dd-2e80373cee78", 1, 0, 0.0, 678.0, 678, 678, 678.0, 678.0, 678.0, 678.0, 1.4749262536873156, 0.26646616887905605, 1.0168925147492625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/092ef307-5c45-48e9-835b-55ab9d13b3ec", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.64252703722334, 1.2005627515090542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fd1d2c4-3e43-430a-94ff-131a3bda6030", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 133.1764705882353, 130, 140, 133.0, 137.6, 140.0, 140.0, 0.0977753238088665, 0.0726631068540502, 0.049078629333747445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 177.23529411764707, 128, 397, 133.0, 388.2, 397.0, 397.0, 0.09777363677669076, 0.026162086403137958, 0.05576152722420645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 230.58823529411765, 127, 521, 130.0, 440.99999999999994, 521.0, 521.0, 0.09777644852932718, 0.026353808392670215, 0.05748185743618649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 220.0, 128, 384, 134.0, 383.2, 384.0, 384.0, 0.09777363677669076, 0.02635305053746743, 0.057575686500336454], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 36.36363636363637, 0.31007751937984496], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 9.090909090909092, 0.07751937984496124], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 9.090909090909092, 0.07751937984496124], "isController": false}, {"data": ["401/Unauthorized", 5, 45.45454545454545, 0.3875968992248062], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1290, 11, "401/Unauthorized", 5, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
