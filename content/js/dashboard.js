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

    var data = {"OkPercent": 97.65861027190333, "KoPercent": 2.3413897280966767};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7446670976082741, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.008928571428571428, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0864c078-6a7f-45a5-b752-fbaeb7860c09"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbd3107d-54b6-4223-ba3f-148ef66a4436"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=663b399e-7fea-44b6-8b7a-970782db2526"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e5c28bc-322f-4744-80ad-75873ce735d2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fbe670f-dc3d-4ae6-93fb-e5773a471f75"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92bb15ad-fa3d-4412-8221-1f38993305e1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8fbe670f-dc3d-4ae6-93fb-e5773a471f75"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/663b399e-7fea-44b6-8b7a-970782db2526"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0e042d9-5fe8-4995-a9ce-84c1f37e5f2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f014097-3ca7-4f35-872c-f39156f7e12b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/56f8100e-99df-4ba5-90a4-b7f3c52a2551"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e522f05d-e3ed-4173-9b7c-c438833c89d4"], "isController": false}, {"data": [0.11538461538461539, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.26, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a392db88-bc2f-416d-a873-4e88925e8855"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbd543be-56b7-4014-aeee-44d3965d7f7d"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/381a8db1-1dda-4cd9-8f59-eed740e443f1"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0864c078-6a7f-45a5-b752-fbaeb7860c09"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26b0d07d-393d-4cb9-ad30-693ae322f4c3"], "isController": false}, {"data": [0.26, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bbd3107d-54b6-4223-ba3f-148ef66a4436"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2627118644067797, 500, 1500, "addBook"], "isController": true}, {"data": [0.9196428571428571, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4732142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9281609195402298, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2e5c28bc-322f-4744-80ad-75873ce735d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f014097-3ca7-4f35-872c-f39156f7e12b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56f8100e-99df-4ba5-90a4-b7f3c52a2551"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/26b0d07d-393d-4cb9-ad30-693ae322f4c3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dbd543be-56b7-4014-aeee-44d3965d7f7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0e042d9-5fe8-4995-a9ce-84c1f37e5f2d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e522f05d-e3ed-4173-9b7c-c438833c89d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=381a8db1-1dda-4cd9-8f59-eed740e443f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83b87e89-7b84-49da-9cc6-e43ca1d35c45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1324, 31, 2.3413897280966767, 425.07703927492395, 118, 2263, 138.0, 1186.5, 1491.75, 1784.5, 5.107453255615692, 723.2191007094597, 3.7334079797688533], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2060.839285714285, 1471, 2635, 2075.0, 2459.3, 2528.3, 2635.0, 0.24555480037710203, 295.48456478426255, 1.2073910350573327], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0864c078-6a7f-45a5-b752-fbaeb7860c09", 3, 0, 0.0, 642.3333333333334, 433, 1060, 434.0, 1060.0, 1060.0, 1060.0, 0.022809872112650353, 0.022876697909855387, 0.014627424499323308], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 523.1999999999999, 129, 1311, 464.0, 1268.4, 1311.0, 1311.0, 0.09911392154141971, 0.020171231688702995, 0.06641794234543183], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 523.1999999999999, 129, 1311, 464.0, 1268.4, 1311.0, 1311.0, 0.0990988610237573, 0.020168166638038106, 0.06640785003369361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 141.56250000000003, 121, 359, 127.0, 199.40000000000015, 359.0, 359.0, 0.08304483902276985, 0.02222098231663959, 0.047361509755173434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 158.75, 122, 612, 127.0, 289.3000000000003, 612.0, 612.0, 0.08304225293632217, 0.06171401805130973, 0.041683318368427334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 221.68749999999997, 123, 384, 130.0, 381.2, 384.0, 384.0, 0.08304095995349707, 0.022382133737466007, 0.04890009653511595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 205.75000000000003, 125, 386, 128.0, 380.4, 386.0, 386.0, 0.08304268393954493, 0.02238259840558047, 0.04882001536289653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbd3107d-54b6-4223-ba3f-148ef66a4436", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.5628163940809968, 2.1478290498442365], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 306.625, 126, 1259, 227.0, 681.5000000000006, 1259.0, 1259.0, 0.09431848996097572, 0.1720460443709546, 0.060958159802049064], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=663b399e-7fea-44b6-8b7a-970782db2526", 1, 0, 0.0, 677.0, 677, 677, 677.0, 677.0, 677.0, 677.0, 1.4771048744460857, 0.26685976735598227, 1.0183945716395864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e5c28bc-322f-4744-80ad-75873ce735d2", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 162.5, 122, 564, 128.0, 359.7000000000005, 555.0499999999998, 564.0, 0.09618621651517338, 0.07148213942192083, 0.048280971961717885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 178.3, 125, 387, 128.0, 383.7, 386.85, 387.0, 0.09618806690841934, 0.040184819358810346, 0.05404942744053173], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 919.7142857142857, 628, 1048, 996.0, 1048.0, 1048.0, 1048.0, 0.03416100570000781, 10.044469927944679, 0.019482448563285702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1351.142857142857, 1000, 1503, 1470.0, 1503.0, 1503.0, 1503.0, 0.034144009677387885, 30.722839926480628, 0.019439411759684704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 202.85714285714286, 126, 394, 129.0, 394.0, 394.0, 394.0, 0.03426618955077026, 0.06063509322851143, 0.018973563940709703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 127.33333333333333, 125, 130, 127.0, 130.0, 130.0, 130.0, 0.060510100144215734, 0.04496893184545721, 0.03037323386145204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 169.41666666666666, 125, 383, 128.0, 380.6, 383.0, 383.0, 0.06043574169763998, 0.03129989096384936, 0.03362131593791235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 369.75, 125, 1504, 128.0, 1474.9, 1504.0, 1504.0, 0.060123252667969335, 9.030005652212035, 0.034484756250313144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 251.58333333333334, 124, 999, 127.0, 922.5000000000002, 999.0, 999.0, 0.060323636308796696, 2.96974125558622, 0.03465859963705279], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 127.99999999999999, 127, 131, 128.0, 131.0, 131.0, 131.0, 0.03431019355850624, 0.025498102830100823, 0.019265977828262778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 300.3, 120, 1502, 126.5, 1375.4000000000024, 1501.2, 1502.0, 0.09618991737286098, 8.678519243394158, 0.05572251854060657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 703.1874999999999, 125, 1614, 252.5, 1553.1000000000001, 1614.0, 1614.0, 0.09980164423208873, 39.303372584098476, 0.054920143090607415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 208.3, 125, 733, 128.0, 610.9000000000005, 728.15, 733.0, 0.0960744000153719, 2.848211905299464, 0.05574942235266991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 502.9374999999999, 126, 1157, 129.5, 1136.0, 1157.0, 1157.0, 0.09980164423208873, 12.853567304513529, 0.05501760563380281], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 424.0, 129, 836, 422.0, 800.0, 836.0, 836.0, 0.09867706942260757, 0.02008232545671037, 0.06662629472538172], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fbe670f-dc3d-4ae6-93fb-e5773a471f75", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 0.8101527466367713, 3.0917180493273544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 498.91666666666674, 253, 1633, 258.5, 1602.7, 1633.0, 1633.0, 0.06008381692460983, 12.057787410312386, 0.1325677445035825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92bb15ad-fa3d-4412-8221-1f38993305e1", 2, 0, 0.0, 316.0, 291, 341, 316.0, 341.0, 341.0, 341.0, 0.08512449457331348, 0.05232995052138753, 0.05291185624600979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fbe670f-dc3d-4ae6-93fb-e5773a471f75", 3, 0, 0.0, 516.0, 212, 1024, 312.0, 1024.0, 1024.0, 1024.0, 0.0836703388648724, 0.039329417096639244, 0.05365578371217404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 502.54545454545456, 146, 1247, 474.0, 825.0999999999999, 1189.249999999999, 1247.0, 0.09410194662708682, 0.05780285588714611, 0.0425480481331457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 143.81249999999994, 125, 377, 128.0, 204.80000000000018, 377.0, 377.0, 0.09979977669799964, 0.07416760748747825, 0.0500948097878631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 220.3125, 123, 381, 127.0, 378.9, 381.0, 381.0, 0.09980351183607274, 0.09228657252908337, 0.05325209353460375], "isController": false}, {"data": ["login", 22, 0, 0.0, 2716.045454545455, 1740, 3685, 2739.5, 3515.0, 3667.1499999999996, 3685.0, 0.0918956399695909, 35.10465252352738, 0.1871362029139272], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 144.85, 128, 397, 131.0, 144.00000000000003, 384.3999999999998, 397.0, 0.1011848748849022, 0.08191627078084368, 0.03596806099424258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/663b399e-7fea-44b6-8b7a-970782db2526", 3, 0, 0.0, 560.6666666666666, 230, 1009, 443.0, 1009.0, 1009.0, 1009.0, 0.023923254200524716, 0.028276476563185302, 0.015341409757497947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0e042d9-5fe8-4995-a9ce-84c1f37e5f2d", 3, 0, 0.0, 385.33333333333337, 209, 713, 234.0, 713.0, 713.0, 713.0, 0.03694945314809341, 0.030803238773524488, 0.0236947990565573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f014097-3ca7-4f35-872c-f39156f7e12b", 3, 0, 0.0, 383.6666666666667, 311, 421, 419.0, 421.0, 421.0, 421.0, 0.019025995852332903, 0.02248808298822291, 0.012200915308950462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56f8100e-99df-4ba5-90a4-b7f3c52a2551", 3, 0, 0.0, 444.33333333333337, 240, 762, 331.0, 762.0, 762.0, 762.0, 0.03627964349203661, 0.029701596153148466, 0.023265266171651085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 848.8125, 252, 1741, 509.5, 1682.2, 1741.0, 1741.0, 0.0997189173018554, 52.28002216213984, 0.21310779848676545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e522f05d-e3ed-4173-9b7c-c438833c89d4", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 855.8461538461538, 126, 1631, 1128.0, 1630.2, 1631.0, 1631.0, 0.0633691937976183, 40.82944943138335, 0.09632003209893394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 413.56249999999994, 252, 990, 383.5, 669.4000000000003, 990.0, 990.0, 0.08298626058723153, 0.12861249565618793, 0.1866380450511662], "isController": false}, {"data": ["register", 25, 8, 32.0, 1007.8800000000002, 315, 2089, 947.0, 1619.2000000000003, 1971.0999999999997, 2089.0, 0.10083491308030491, 0.03155817670310168, 0.045493876799903195], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a392db88-bc2f-416d-a873-4e88925e8855", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 1.0368049918831168, 1.9372717126623378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 503.25, 250, 1633, 259.5, 1544.4000000000015, 1631.9, 1633.0, 0.09601259685270708, 11.62036521691646, 0.21347800831469088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 131.8095238095238, 126, 164, 129.0, 140.0, 161.69999999999996, 164.0, 0.11493120546415789, 0.08922881674219289, 0.040854451942337375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbd543be-56b7-4014-aeee-44d3965d7f7d", 1, 0, 0.0, 776.0, 776, 776, 776.0, 776.0, 776.0, 776.0, 1.288659793814433, 0.23281451353092783, 0.8884705219072164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 532.2105263157895, 248, 1606, 503.0, 1496.0, 1606.0, 1606.0, 0.10308215647871354, 13.124213956171095, 0.22905791894758545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 128.16666666666669, 126, 132, 127.5, 132.0, 132.0, 132.0, 0.038305370412931895, 0.02846717469164177, 0.019227500383053705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 127.0, 125, 130, 126.5, 130.0, 130.0, 130.0, 0.038307082341073495, 0.019839377605679664, 0.02131080850289538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 333.66666666666663, 125, 1367, 127.5, 1367.0, 1367.0, 1367.0, 0.038307082341073495, 5.753400801017054, 0.021971705431305825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 275.0, 124, 1015, 127.5, 1015.0, 1015.0, 1015.0, 0.03830659320313348, 1.8858390700116836, 0.022008833660003446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 130.33333333333334, 129, 132, 130.0, 132.0, 132.0, 132.0, 0.025277206700144925, 0.007454801194769304, 0.015625460782413805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/381a8db1-1dda-4cd9-8f59-eed740e443f1", 3, 0, 0.0, 309.0, 226, 405, 296.0, 405.0, 405.0, 405.0, 0.05395780499649274, 0.03504095734635515, 0.03460184760517276], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1417.2678571428567, 969, 2087, 1342.5, 1882.4, 2002.35, 2087.0, 0.25335124888593313, 303.0961728126965, 0.5002697512181219], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0864c078-6a7f-45a5-b752-fbaeb7860c09", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26b0d07d-393d-4cb9-ad30-693ae322f4c3", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1007.8800000000002, 315, 2089, 947.0, 1619.2000000000003, 1971.0999999999997, 2089.0, 0.09833383155807988, 0.030775416345442817, 0.04436545915999308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 222.4, 125, 378, 128.0, 378.0, 378.0, 378.0, 0.024291891366661808, 0.006547423844920565, 0.01430469774814167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 227.6, 126, 379, 131.0, 379.0, 379.0, 379.0, 0.024289649208886124, 0.006546819513332589, 0.014279657054442821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 231.61904761904762, 124, 1574, 127.0, 381.6, 1454.8999999999983, 1574.0, 0.10883817835986048, 4.691404286215904, 0.06353955036875411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 205.04761904761907, 122, 1013, 128.0, 375.0, 949.1999999999991, 1013.0, 0.10883987063603948, 1.5518690818320342, 0.06364682725298533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 126.2, 125, 128, 126.0, 128.0, 128.0, 128.0, 0.024318711302850637, 0.006507155172833081, 0.013869265039907005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 128.1904761904762, 125, 134, 127.0, 133.0, 133.9, 134.0, 0.10883648613630474, 0.08088336518528116, 0.05463081433013735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbd3107d-54b6-4223-ba3f-148ef66a4436", 3, 0, 0.0, 576.0, 214, 1107, 407.0, 1107.0, 1107.0, 1107.0, 0.10017363429945239, 0.04532596083210899, 0.06423895168291706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 128.2, 126, 130, 129.0, 130.0, 130.0, 130.0, 0.024318238192279445, 0.01807244068781705, 0.012206615655109018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 162.14285714285714, 123, 377, 127.0, 374.4, 376.8, 377.0, 0.108838742446073, 0.03690718517098048, 0.06163682131269889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 132.8, 128, 138, 133.0, 138.0, 138.0, 138.0, 0.02380589624438181, 0.018737844114230212, 0.008462252180620095], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 510.59999999999997, 126, 1024, 443.0, 972.4000000000001, 1024.0, 1024.0, 0.10130275340883765, 0.020062693741515893, 0.06893335798367], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1342.2272727272727, 824, 2263, 1223.5, 1904.0, 2211.399999999999, 2263.0, 0.09258830609693995, 0.04792168186658025, 0.04258700407388547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 357.2, 255, 509, 262.0, 509.0, 509.0, 509.0, 0.02427420137877464, 0.0376202710821439, 0.05459324782745898], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 1254.1016949152545, 643, 2478, 1000.0, 2245.0, 2422.0, 2478.0, 0.28232907128091267, 86.95890541856481, 1.026368234270921], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 242.3035714285714, 126, 523, 131.0, 513.0, 515.6, 523.0, 0.2548663544553824, 0.189407515371627, 0.12320199751505304], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 823.0178571428572, 610, 1156, 763.0, 1027.1000000000001, 1130.35, 1156.0, 0.2543246545044983, 74.77989279761661, 0.12790741901349284], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 193.62500000000003, 124, 522, 131.0, 384.3, 411.6999999999998, 522.0, 0.25536610835731194, 0.4518783089291496, 0.12419172066595832], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1173.3928571428573, 834, 1531, 1139.5, 1498.3, 1504.2, 1531.0, 0.25399013973993223, 228.54077420503356, 0.1274911443616457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 132.1578947368421, 126, 138, 132.0, 137.0, 138.0, 138.0, 0.10624734381640459, 0.07937423634721631, 0.03776761049723757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, 6.32183908045977, 197.2931034482759, 119, 1248, 133.0, 342.5, 385.75, 1221.75, 0.7549887836436453, 1.6174360103615701, 0.3626595334147622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 133.16666666666666, 129, 144, 131.5, 144.0, 144.0, 144.0, 0.03858372024230577, 0.029879775539207492, 0.013715306804882126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e5c28bc-322f-4744-80ad-75873ce735d2", 3, 0, 0.0, 925.0, 228, 1609, 938.0, 1609.0, 1609.0, 1609.0, 0.023397103438594302, 0.027654584174979138, 0.015004001879567309], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 151.24999999999997, 127, 389, 134.5, 223.10000000000016, 389.0, 389.0, 0.086411285313862, 0.07012478329669855, 0.03071651157641188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f014097-3ca7-4f35-872c-f39156f7e12b", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56f8100e-99df-4ba5-90a4-b7f3c52a2551", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 463.5, 254, 1493, 258.0, 1493.0, 1493.0, 1493.0, 0.038274337694481485, 7.681000489193878, 0.08444774117617039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 397.33333333333337, 252, 1702, 263.0, 509.2, 1582.7999999999984, 1702.0, 0.10876433358539037, 6.3567250023306645, 0.24328837471125658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26b0d07d-393d-4cb9-ad30-693ae322f4c3", 3, 0, 0.0, 643.3333333333334, 215, 1259, 456.0, 1259.0, 1259.0, 1259.0, 0.027878190891265763, 0.027959865278642516, 0.017877615903578628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 185.58333333333331, 128, 511, 132.5, 472.0000000000001, 511.0, 511.0, 0.060157914525629776, 0.0498770209299411, 0.021384258679032462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbd543be-56b7-4014-aeee-44d3965d7f7d", 3, 0, 0.0, 410.66666666666663, 209, 737, 286.0, 737.0, 737.0, 737.0, 0.02771772271190199, 0.027798926977659517, 0.017774711504702775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0e042d9-5fe8-4995-a9ce-84c1f37e5f2d", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e522f05d-e3ed-4173-9b7c-c438833c89d4", 3, 0, 0.0, 687.3333333333334, 257, 1265, 540.0, 1265.0, 1265.0, 1265.0, 0.020368258106566728, 0.028079288112405624, 0.013061675934224104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 134.00000000000003, 127, 154, 131.0, 150.5, 154.0, 154.0, 0.0972260201136329, 0.07548309178743962, 0.034560811837267946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=381a8db1-1dda-4cd9-8f59-eed740e443f1", 1, 0, 0.0, 836.0, 836, 836, 836.0, 836.0, 836.0, 836.0, 1.1961722488038278, 0.2161053379186603, 0.8247046949760766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 140.99999999999997, 122, 379, 129.0, 133.0, 379.0, 379.0, 0.10329230635410777, 0.0767631300151133, 0.051847895962901756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83b87e89-7b84-49da-9cc6-e43ca1d35c45", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 205.9473684210526, 123, 383, 129.0, 378.0, 383.0, 383.0, 0.10329118328205017, 0.04396883120589738, 0.05799511133702282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 336.47368421052624, 123, 1480, 129.0, 1372.0, 1480.0, 1480.0, 0.10329118328205017, 9.808234736689029, 0.05978954081632653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 290.8947368421053, 118, 1002, 128.0, 741.0, 1002.0, 1002.0, 0.10315547158338219, 3.217627844919322, 0.059811722601363825], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 25.806451612903224, 0.6042296072507553], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.67741935483871, 0.22658610271903323], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.67741935483871, 0.22658610271903323], "isController": false}, {"data": ["401/Unauthorized", 17, 54.83870967741935, 1.283987915407855], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1324, 31, "401/Unauthorized", 17, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
