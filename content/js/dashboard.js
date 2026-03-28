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

    var data = {"OkPercent": 97.87234042553192, "KoPercent": 2.127659574468085};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7302674494455317, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61938ebc-1901-4a08-af6b-ed414b8fbe36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/faa5f91b-3035-4541-bffb-cfa0bbc2a6d2"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2631f37-7669-4219-a3f8-3890644f352a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53c2d7de-d785-4c79-afb5-8451dc4d0d06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad6dd5aa-5b2d-4671-8792-b1d9cbe69636"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ca702a8-60ec-4b67-81d7-384f2ae981d1"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b500f371-56d3-42bf-abb3-9555f67fed5b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7f48efc-228a-466b-9cad-9761fa1a9c2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/47b08d12-605f-4421-a151-e3c770f9e774"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6fedab1a-0824-4ab3-a67c-04e4c7b9475a"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7895f194-7d2c-451d-8bd1-ca353a965999"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad2835fd-f2f6-4aa4-9c42-53a4db440809"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dab7e5e0-634d-438d-b935-e8887b0bde52"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f7f48efc-228a-466b-9cad-9761fa1a9c2b"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=faa5f91b-3035-4541-bffb-cfa0bbc2a6d2"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a6e38c9-9633-46c8-aaa1-c1dc2c923db5"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a6e38c9-9633-46c8-aaa1-c1dc2c923db5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6fedab1a-0824-4ab3-a67c-04e4c7b9475a"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.19444444444444445, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c6f02a2-2c65-40fe-be5b-51a93ca59504"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.29365079365079366, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/53c2d7de-d785-4c79-afb5-8451dc4d0d06"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47b08d12-605f-4421-a151-e3c770f9e774"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffa29aa0-99f3-484f-9146-a57e9b567c28"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3055555555555556, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9194444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/61938ebc-1901-4a08-af6b-ed414b8fbe36"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ffa29aa0-99f3-484f-9146-a57e9b567c28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b500f371-56d3-42bf-abb3-9555f67fed5b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad2835fd-f2f6-4aa4-9c42-53a4db440809"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24685948-63ec-4971-bee1-f04490d06324"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7895f194-7d2c-451d-8bd1-ca353a965999"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 28, 2.127659574468085, 482.71200607902773, 137, 3101, 163.0, 1337.9999999999995, 1701.199999999999, 2234.7299999999977, 5.144020857519221, 695.3874167052664, 3.7552828759513117], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61938ebc-1901-4a08-af6b-ed414b8fbe36", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.21482052615933414, 0.8198015755053508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/faa5f91b-3035-4541-bffb-cfa0bbc2a6d2", 3, 0, 0.0, 328.3333333333333, 234, 466, 285.0, 466.0, 466.0, 466.0, 0.026405196542679598, 0.02648255551692573, 0.016933019918319924], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2475.6666666666674, 1746, 3469, 2431.5, 2998.5, 3189.0, 3469.0, 0.2416074952014067, 290.73581192142836, 1.1879821663467605], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e2631f37-7669-4219-a3f8-3890644f352a", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53c2d7de-d785-4c79-afb5-8451dc4d0d06", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 0.6691261574074073, 2.5535300925925926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad6dd5aa-5b2d-4671-8792-b1d9cbe69636", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.8944984243697479, 1.671371673669468], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 496.64285714285717, 151, 968, 489.5, 940.5, 968.0, 968.0, 0.08534035562545336, 0.017507392989289786, 0.057129700958250276], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 496.64285714285717, 151, 968, 489.5, 940.5, 968.0, 968.0, 0.08321890733574669, 0.017072182371263324, 0.055709532205717144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 184.06250000000003, 139, 452, 148.0, 435.20000000000005, 452.0, 452.0, 0.07488112621213823, 0.027065797694597327, 0.04231258950634618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 148.875, 143, 153, 149.0, 152.3, 153.0, 153.0, 0.07487972444261405, 0.05564792021565361, 0.037586111683109005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 304.3125, 144, 1182, 150.0, 672.4000000000005, 1182.0, 1182.0, 0.07488112621213823, 1.3950174654376801, 0.043692844640383394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 348.99999999999994, 142, 1651, 153.0, 813.1000000000008, 1651.0, 1651.0, 0.07488147666271978, 4.230076737425763, 0.04361992268487535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ca702a8-60ec-4b67-81d7-384f2ae981d1", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 256.14285714285717, 147, 494, 243.0, 420.5, 494.0, 494.0, 0.08492002353497796, 0.16332414124626202, 0.05488169768774908], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b500f371-56d3-42bf-abb3-9555f67fed5b", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7f48efc-228a-466b-9cad-9761fa1a9c2b", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.26490331744868034, 1.010928335777126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 170.2857142857143, 148, 427, 150.0, 290.0, 427.0, 427.0, 0.09711162287394912, 0.07216986817097196, 0.04874548257540024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1078.2, 722, 1223, 1178.0, 1223.0, 1223.0, 1223.0, 0.025624074330314817, 7.534328652455556, 0.01461372989150767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 208.0, 144, 430, 149.0, 427.5, 430.0, 430.0, 0.09711835953216699, 0.025986748546693122, 0.055387814420688984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47b08d12-605f-4421-a151-e3c770f9e774", 3, 0, 0.0, 453.33333333333337, 233, 780, 347.0, 780.0, 780.0, 780.0, 0.05374128943267112, 0.03406064144707378, 0.034463001361446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1581.6, 1318, 1854, 1692.0, 1854.0, 1854.0, 1854.0, 0.025515932148033233, 22.959280599024783, 0.014527137150686889], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 208.2, 146, 441, 151.0, 441.0, 441.0, 441.0, 0.025721884693935295, 0.04551567877481519, 0.014242488888145811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 148.23529411764707, 144, 153, 148.0, 152.2, 153.0, 153.0, 0.08038965337872984, 0.059742701387903725, 0.040351837731120256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 214.17647058823528, 142, 445, 148.0, 445.0, 445.0, 445.0, 0.08028676543513065, 0.021482982157447067, 0.04578854591222295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 275.7647058823529, 142, 597, 152.0, 481.7999999999999, 597.0, 597.0, 0.0802909365701601, 0.021640916497425968, 0.04720228888206678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 226.05882352941177, 139, 614, 149.0, 479.5999999999999, 614.0, 614.0, 0.08039117399487389, 0.02166793361580585, 0.04733972453018452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 148.2, 143, 152, 150.0, 152.0, 152.0, 152.0, 0.02572162005051726, 0.019115383650823863, 0.014443292508835377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6fedab1a-0824-4ab3-a67c-04e4c7b9475a", 1, 0, 0.0, 983.0, 983, 983, 983.0, 983.0, 983.0, 983.0, 1.0172939979654119, 0.18378846642929808, 0.701376525940997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 951.6111111111113, 143, 2240, 886.0, 1819.7000000000007, 2240.0, 2240.0, 0.08647817627134931, 38.91826179616373, 0.047123849960364166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 189.42857142857142, 139, 450, 147.5, 446.5, 450.0, 450.0, 0.09711229649771438, 0.026174798665399582, 0.057091408683226624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 659.2222222222222, 143, 1201, 643.0, 1181.2, 1201.0, 1201.0, 0.08647651441995878, 12.725137326506493, 0.047207394102301715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 168.42857142857142, 142, 433, 150.0, 293.5, 433.0, 433.0, 0.09711297013082504, 0.026174980230573935, 0.05718664159071045], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 491.1428571428572, 150, 983, 508.5, 912.0, 983.0, 983.0, 0.0835122882366977, 0.017132368840968745, 0.05630205537162969], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 465.05882352941177, 293, 760, 575.0, 635.9999999999999, 760.0, 760.0, 0.08022917227091031, 0.12433954725970182, 0.1804372888085024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7895f194-7d2c-451d-8bd1-ca353a965999", 3, 0, 0.0, 342.3333333333333, 271, 421, 335.0, 421.0, 421.0, 421.0, 0.053003533568904596, 0.03407616497349823, 0.033989896201413426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 556.2727272727273, 177, 1159, 441.0, 1053.1, 1145.0499999999997, 1159.0, 0.09264250101064547, 0.05690638001532812, 0.04188816207805552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 199.94444444444449, 143, 498, 149.5, 453.9000000000001, 498.0, 498.0, 0.08659424821760173, 0.06435373329452627, 0.043466253499850865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad2835fd-f2f6-4aa4-9c42-53a4db440809", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 259.77777777777777, 142, 454, 149.5, 447.7, 454.0, 454.0, 0.08659341505185984, 0.08820012880770489, 0.045749060100640795], "isController": false}, {"data": ["login", 22, 0, 0.0, 2828.9999999999995, 1729, 4566, 2291.0, 4468.3, 4557.599999999999, 4566.0, 0.09221650759319107, 25.200538975359333, 0.17388837191755846], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 154.57142857142858, 147, 174, 153.0, 170.0, 174.0, 174.0, 0.09381428791604961, 0.07594926238516127, 0.03334804765765826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dab7e5e0-634d-438d-b935-e8887b0bde52", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7f48efc-228a-466b-9cad-9761fa1a9c2b", 3, 0, 0.0, 899.0, 252, 1971, 474.0, 1971.0, 1971.0, 1971.0, 0.01700169450221872, 0.023438208403937594, 0.01090277935200875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1154.9444444444443, 290, 2387, 1212.5, 1969.4000000000005, 2387.0, 2387.0, 0.08641548565502938, 51.75844542592033, 0.1832953465260975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=faa5f91b-3035-4541-bffb-cfa0bbc2a6d2", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 555.8750000000001, 291, 1798, 580.5, 962.9000000000008, 1798.0, 1798.0, 0.07482859574786505, 5.703785048135832, 0.1670946657734003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, 50.0, 940.1, 147, 2007, 806.5, 1992.8, 2007.0, 2007.0, 0.05099205033935209, 30.5089321340428, 0.0742970108460091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a6e38c9-9633-46c8-aaa1-c1dc2c923db5", 3, 0, 0.0, 408.0, 260, 528, 436.0, 528.0, 528.0, 528.0, 0.02116865063964606, 0.02918269383427769, 0.013574948489616778], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1087.3478260869567, 264, 2010, 1087.0, 1784.4000000000003, 1977.5999999999995, 2010.0, 0.09784860693363737, 0.030826964310784195, 0.04414653945638718], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 154.78571428571428, 145, 170, 154.0, 166.0, 170.0, 170.0, 0.07298128551321482, 0.05666027537402908, 0.025942566334775582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 423.7857142857143, 299, 860, 303.5, 732.0, 860.0, 860.0, 0.09700866841744216, 0.15034448904148506, 0.21817476891149343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a6e38c9-9633-46c8-aaa1-c1dc2c923db5", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fedab1a-0824-4ab3-a67c-04e4c7b9475a", 3, 0, 0.0, 881.6666666666666, 255, 1647, 743.0, 1647.0, 1647.0, 1647.0, 0.03674399235724959, 0.03063195456605345, 0.02356304197388727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 546.6666666666666, 298, 1936, 560.0, 1138.0000000000005, 1936.0, 1936.0, 0.09217382754891358, 7.484790838382411, 0.20572886262105497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 177.18181818181816, 145, 443, 150.0, 385.8000000000002, 443.0, 443.0, 0.07218416148253143, 0.05364467469551408, 0.036233065431661285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 258.6363636363637, 138, 481, 151.0, 475.40000000000003, 481.0, 481.0, 0.0720494127972857, 0.029116559575039464, 0.04054058756296136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 283.09090909090907, 143, 1364, 148.0, 1176.4000000000005, 1364.0, 1364.0, 0.07218889865991153, 5.922751777241466, 0.0418752009804565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 240.1818181818182, 140, 887, 146.0, 797.8000000000003, 887.0, 887.0, 0.07218700371434945, 1.9472674963250252, 0.04194459688480266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 153.0, 150, 155, 154.0, 155.0, 155.0, 155.0, 0.09842842612946619, 0.02902869598740116, 0.060844915761671975], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1728.4444444444446, 1139, 2875, 1616.5, 2376.5, 2564.0, 2875.0, 0.24811501509366343, 296.83181678773764, 0.4899302348822143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1087.3478260869567, 264, 2010, 1087.0, 1784.4000000000003, 1977.5999999999995, 2010.0, 0.0953794859460401, 0.030049073782252782, 0.04303254151081106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 197.83333333333334, 144, 450, 149.5, 444.0, 450.0, 450.0, 0.0606747026939568, 0.016353728460480544, 0.03572934152778901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c6f02a2-2c65-40fe-be5b-51a93ca59504", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 1.02680365755627, 1.9185842041800643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 195.75000000000003, 140, 452, 146.0, 449.3, 452.0, 452.0, 0.0607668780003646, 0.016378572586035773, 0.035724277886933095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 454.7142857142858, 139, 1726, 145.0, 1568.0, 1726.0, 1726.0, 0.07202535292422933, 13.902797244451476, 0.04101667001070091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 407.9285714285715, 137, 1180, 150.5, 1180.0, 1180.0, 1180.0, 0.07209099943872008, 4.557512928104676, 0.04112445545548638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 146.64285714285714, 138, 152, 147.0, 151.5, 152.0, 152.0, 0.07247127031783829, 0.05385804366394036, 0.03637718060875867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 218.33333333333337, 137, 450, 147.5, 443.70000000000005, 450.0, 450.0, 0.06068114586230437, 0.01623694723268691, 0.03460721599959546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 189.2142857142857, 137, 443, 149.0, 441.0, 443.0, 443.0, 0.0723611441330618, 0.04265148353267106, 0.039966206699608216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 197.5, 143, 442, 151.0, 439.90000000000003, 442.0, 442.0, 0.06076564715414219, 0.045158845199513874, 0.030501506481669032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 204.08333333333334, 150, 439, 156.0, 436.90000000000003, 439.0, 439.0, 0.058416048835816824, 0.04597981968912926, 0.020765079859606763], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 513.5384615384614, 152, 780, 492.0, 772.0, 780.0, 780.0, 0.09523600213914712, 0.01847916117228193, 0.06480941581869996], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1484.4545454545455, 807, 3101, 1270.0, 2392.5999999999995, 3014.449999999999, 3101.0, 0.09425999477285484, 0.04878691135704401, 0.04335591556446741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 448.33333333333337, 294, 886, 301.5, 885.7, 886.0, 886.0, 0.060627188262576355, 0.09396030055928581, 0.1363519673522591], "isController": false}, {"data": ["addBook", 63, 11, 17.46031746031746, 1400.8253968253969, 757, 3302, 1158.0, 2477.2000000000003, 2598.7999999999997, 3302.0, 0.28653034492795804, 82.68001169430396, 1.043482649848548], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/53c2d7de-d785-4c79-afb5-8451dc4d0d06", 3, 0, 0.0, 449.3333333333333, 241, 615, 492.0, 615.0, 615.0, 615.0, 0.05818351079304125, 0.026326523438257598, 0.03731169149163127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47b08d12-605f-4421-a151-e3c770f9e774", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 263.0925925925926, 140, 623, 152.0, 581.0, 599.75, 623.0, 0.24995602625464042, 0.1857583359177552, 0.12082835253520213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffa29aa0-99f3-484f-9146-a57e9b567c28", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 944.4814814814815, 704, 1335, 878.5, 1286.0, 1326.75, 1335.0, 0.2493500736506236, 73.31720085494753, 0.12540555461921013], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 222.5, 138, 612, 151.0, 451.5, 594.25, 612.0, 0.25050332612749693, 0.44327346381154725, 0.12182681290184909], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1462.629629629629, 993, 2290, 1425.0, 1840.5, 1995.75, 2290.0, 0.24882040695959895, 223.88903956186874, 0.12489618083714243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 152.93333333333334, 142, 163, 154.0, 162.4, 163.0, 163.0, 0.08932240027154009, 0.06673011348410954, 0.03175132197152402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 11, 6.111111111111111, 206.5833333333333, 139, 793, 155.5, 332.5, 455.4499999999999, 613.1799999999995, 0.7469468547312859, 1.4974233899664289, 0.36282359916341955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 156.1818181818182, 139, 179, 155.0, 176.20000000000002, 179.0, 179.0, 0.07847277708024199, 0.06077042209436709, 0.027894619977742268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61938ebc-1901-4a08-af6b-ed414b8fbe36", 3, 0, 0.0, 540.3333333333334, 367, 760, 494.0, 760.0, 760.0, 760.0, 0.026920315865039485, 0.02699918397792534, 0.017263353598348886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffa29aa0-99f3-484f-9146-a57e9b567c28", 3, 0, 0.0, 416.3333333333333, 240, 608, 401.0, 608.0, 608.0, 608.0, 0.0395340256180486, 0.03295789049733804, 0.025352223459490803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 153.06250000000003, 146, 177, 150.0, 171.4, 177.0, 177.0, 0.07479431563201197, 0.06069734012715034, 0.026587041884816757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 518.1818181818182, 295, 1514, 304.0, 1390.6000000000004, 1514.0, 1514.0, 0.07197539750049073, 7.929370562880324, 0.16020021224563238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 647.0, 293, 1876, 301.5, 1715.5, 1876.0, 1876.0, 0.07197018378100502, 18.53792993349184, 0.15791672021591055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b500f371-56d3-42bf-abb3-9555f67fed5b", 3, 0, 0.0, 369.3333333333333, 245, 435, 428.0, 435.0, 435.0, 435.0, 0.027117173305854596, 0.027196618149524093, 0.017389593558767433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad2835fd-f2f6-4aa4-9c42-53a4db440809", 3, 0, 0.0, 438.0, 237, 665, 412.0, 665.0, 665.0, 665.0, 0.021147908471852134, 0.029154099081475843, 0.013561647034358302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 187.11764705882354, 145, 442, 153.0, 432.4, 442.0, 442.0, 0.08328801485466242, 0.06905422325352382, 0.029606286530368283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 174.16666666666669, 144, 418, 154.0, 258.7000000000003, 418.0, 418.0, 0.08951571995504322, 0.06949706773853453, 0.03182004107776927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24685948-63ec-4971-bee1-f04490d06324", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7895f194-7d2c-451d-8bd1-ca353a965999", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 173.60000000000002, 146, 449, 153.0, 282.80000000000007, 449.0, 449.0, 0.09226000098410668, 0.06856431713760272, 0.04631019580647542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 223.73333333333335, 143, 452, 149.0, 446.6, 452.0, 452.0, 0.09226737856075193, 0.03392748399160982, 0.052104638127341285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 329.86666666666673, 143, 1486, 151.0, 852.4000000000003, 1486.0, 1486.0, 0.09226454089164453, 5.5578633704390565, 0.053712859677935244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 312.5333333333333, 144, 1206, 151.0, 748.2000000000003, 1206.0, 1206.0, 0.09226908124600168, 1.831889674628463, 0.05380560942190345], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 21.428571428571427, 0.45592705167173253], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.22796352583586627], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.1519756838905775], "isController": false}, {"data": ["401/Unauthorized", 17, 60.714285714285715, 1.2917933130699089], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 28, "401/Unauthorized", 17, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
