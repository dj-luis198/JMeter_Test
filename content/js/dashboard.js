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

    var data = {"OkPercent": 98.50187265917603, "KoPercent": 1.4981273408239701};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7883376288659794, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a2573e9d-a4e9-4b8a-9a99-edec358f2727"], "isController": false}, {"data": [0.10714285714285714, 500, 1500, "see books"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c777bbf-7d02-479f-b7c4-26170215ddb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/7125c059-54a3-46c8-bde3-64e70a658179"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b2af55f-c07d-4022-913f-fb6cf7aad8aa"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94701fb3-7bbf-4fc3-8eb1-051aaf77815a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2cee043-5ab5-4268-b89e-eac95b868e0a"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5d98b29-50fb-4022-9d5d-7bdc93630612"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8779a518-a885-4b6b-b428-a5dd423f31f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96143f78-f59a-4c64-bc71-abb1f8f3c8ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/486240e0-a8c6-4354-91fa-4df692bbd004"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a90d827d-6f18-47e9-ba0c-7622e39b098d"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/25ff9441-674c-4368-a101-11e3c6263781"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1da84ead-678f-4b2c-ba96-bd7e74080feb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7125c059-54a3-46c8-bde3-64e70a658179"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7417401-543c-413c-8486-1acf052511b5"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b98909a8-8575-4380-9867-ab7c94d041e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1da84ead-678f-4b2c-ba96-bd7e74080feb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3064516129032258, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5089285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b2af55f-c07d-4022-913f-fb6cf7aad8aa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c5d98b29-50fb-4022-9d5d-7bdc93630612"], "isController": false}, {"data": [0.9388888888888889, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94701fb3-7bbf-4fc3-8eb1-051aaf77815a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8779a518-a885-4b6b-b428-a5dd423f31f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7417401-543c-413c-8486-1acf052511b5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d2cee043-5ab5-4268-b89e-eac95b868e0a"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/96143f78-f59a-4c64-bc71-abb1f8f3c8ed"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4bc55727-dd8b-499e-bc98-9dee76b78216"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c777bbf-7d02-479f-b7c4-26170215ddb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2573e9d-a4e9-4b8a-9a99-edec358f2727"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a90d827d-6f18-47e9-ba0c-7622e39b098d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=486240e0-a8c6-4354-91fa-4df692bbd004"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1335, 20, 1.4981273408239701, 361.5887640449438, 98, 4078, 113.0, 1025.2000000000007, 1215.2, 1647.0000000000025, 5.21667773826736, 723.2785848784729, 3.816828761820562], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/a2573e9d-a4e9-4b8a-9a99-edec358f2727", 3, 0, 0.0, 336.6666666666667, 212, 521, 277.0, 521.0, 521.0, 521.0, 0.09626801014023041, 0.04468690835285435, 0.06173436848185348], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1726.6964285714287, 1237, 2380, 1722.5, 2047.6000000000001, 2219.6499999999996, 2380.0, 0.23489735824363892, 282.66101856711566, 1.1549884753483612], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 483.7857142857143, 110, 1122, 446.0, 818.5, 1122.0, 1122.0, 0.07655418669378872, 0.014455369934436807, 0.051771263950633487], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 483.7857142857143, 110, 1122, 446.0, 818.5, 1122.0, 1122.0, 0.07676069852235655, 0.014494364599610714, 0.05191092160813664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c777bbf-7d02-479f-b7c4-26170215ddb7", 3, 0, 0.0, 356.3333333333333, 291, 412, 366.0, 412.0, 412.0, 412.0, 0.018697646589549262, 0.02577621526912146, 0.0119903527934284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 170.33333333333331, 100, 312, 103.5, 310.2, 312.0, 312.0, 0.10532906555564008, 0.04576145599878286, 0.05908759428414271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 103.33333333333334, 101, 110, 103.0, 106.4, 110.0, 110.0, 0.10532783287983849, 0.07827586017730184, 0.05286963486351268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 186.38888888888886, 101, 698, 103.5, 613.4000000000001, 698.0, 698.0, 0.10532906555564008, 3.4663731472324786, 0.061019084310065363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 242.05555555555557, 100, 1205, 103.0, 1111.4, 1205.0, 1205.0, 0.10532844921413273, 10.555759802128804, 0.06091586743829508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7125c059-54a3-46c8-bde3-64e70a658179", 2, 0, 0.0, 380.5, 214, 547, 380.5, 547.0, 547.0, 547.0, 0.011580910027909994, 0.022901701959489977, 0.0071984855788717874], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 255.99999999999997, 103, 547, 210.5, 456.5, 547.0, 547.0, 0.07665184730952017, 0.16328083936510368, 0.04954887479194498], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 113.94999999999999, 98, 305, 104.0, 110.80000000000001, 295.29999999999984, 305.0, 0.09192824081521965, 0.06831776490271693, 0.04614366775295205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 113.3, 98, 302, 103.0, 109.80000000000001, 292.39999999999986, 302.0, 0.09192908590313431, 0.03150187133145491, 0.05204227646293649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 653.0, 503, 809, 602.5, 809.0, 809.0, 809.0, 0.03262784677963153, 9.593670299686773, 0.018608068866508603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1124.0, 950, 1214, 1143.0, 1214.0, 1214.0, 1214.0, 0.03260284840218874, 29.336100301983887, 0.018561973260230503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 238.16666666666666, 102, 311, 302.0, 311.0, 311.0, 311.0, 0.03275287952399149, 0.05795724384518806, 0.01813562762705388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 118.5, 101, 304, 103.5, 211.0, 304.0, 304.0, 0.06480761396881828, 0.04816268967799874, 0.03253038435544199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 174.57142857142856, 101, 309, 103.5, 307.0, 309.0, 309.0, 0.06474617188258745, 0.03121690430053323, 0.036148741611902194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b2af55f-c07d-4022-913f-fb6cf7aad8aa", 1, 0, 0.0, 897.0, 897, 897, 897.0, 897.0, 897.0, 897.0, 1.1148272017837235, 0.20140921125975472, 0.7686210981047937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 267.71428571428567, 100, 1105, 104.0, 956.0, 1105.0, 1105.0, 0.06474856743794544, 8.33794076720115, 0.037270171491205754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 268.35714285714295, 101, 806, 104.0, 802.5, 806.0, 806.0, 0.06480821397820592, 2.7372248254807383, 0.0373677941367083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94701fb3-7bbf-4fc3-8eb1-051aaf77815a", 3, 0, 0.0, 307.6666666666667, 189, 492, 242.0, 492.0, 492.0, 492.0, 0.049228749589760416, 0.03164934259107319, 0.031569217673121104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 136.83333333333334, 100, 305, 104.0, 305.0, 305.0, 305.0, 0.03275413111478685, 0.02434169314292265, 0.018392212295900823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 679.0, 102, 1411, 998.0, 1367.0, 1411.0, 1411.0, 0.10400097883274195, 49.555683777759086, 0.0564095382662425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 309.9, 101, 3831, 103.0, 307.3, 3654.8499999999976, 3831.0, 0.09192866335723479, 4.1594174092779, 0.05364899338113624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 450.5882352941176, 101, 1032, 599.0, 852.7999999999998, 1032.0, 1032.0, 0.10400034258936383, 16.20236679162002, 0.05651075600601978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 143.79999999999995, 101, 507, 103.5, 304.8, 496.89999999999986, 507.0, 0.0919295084529183, 1.3750553731648572, 0.053739261484293845], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 420.5, 104, 897, 422.5, 736.0, 897.0, 897.0, 0.07677290574480686, 0.014496669632477133, 0.05254038631851982], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2cee043-5ab5-4268-b89e-eac95b868e0a", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 453.2857142857143, 207, 1223, 409.0, 1066.5, 1223.0, 1223.0, 0.0647150457858949, 11.14620963399019, 0.14318023313595243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5d98b29-50fb-4022-9d5d-7bdc93630612", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8779a518-a885-4b6b-b428-a5dd423f31f0", 3, 0, 0.0, 318.0, 190, 563, 201.0, 563.0, 563.0, 563.0, 0.08301281164393037, 0.0375611354769086, 0.05323412725864025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96143f78-f59a-4c64-bc71-abb1f8f3c8ed", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/486240e0-a8c6-4354-91fa-4df692bbd004", 3, 0, 0.0, 330.3333333333333, 191, 447, 353.0, 447.0, 447.0, 447.0, 0.04381288975216509, 0.028167466556160824, 0.028096156514246493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a90d827d-6f18-47e9-ba0c-7622e39b098d", 3, 0, 0.0, 376.0, 207, 712, 209.0, 712.0, 712.0, 712.0, 0.024742268041237112, 0.02924452319587629, 0.015866623711340205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 543.4545454545455, 143, 1206, 491.5, 1057.5, 1187.0999999999997, 1206.0, 0.09521872173194199, 0.058488843720108895, 0.04305299625184486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 105.76470588235294, 102, 123, 104.0, 114.19999999999999, 123.0, 123.0, 0.10399143599938829, 0.07728269804251414, 0.05219882627313045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 151.1764705882353, 101, 311, 104.0, 308.6, 311.0, 311.0, 0.10399970635377029, 0.11052358499223061, 0.05468826470372319], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25ff9441-674c-4368-a101-11e3c6263781", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.5816683743169399, 1.0868482468123861], "isController": false}, {"data": ["login", 22, 0, 0.0, 2478.727272727273, 1287, 4071, 2377.0, 3846.5, 4042.0499999999997, 4071.0, 0.09594961772800027, 31.437001239167504, 0.18815972176791532], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 127.94999999999996, 104, 312, 106.0, 284.5000000000004, 311.55, 312.0, 0.09197178305695812, 0.07445762515060379, 0.032693094758528086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1da84ead-678f-4b2c-ba96-bd7e74080feb", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7125c059-54a3-46c8-bde3-64e70a658179", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 786.3529411764707, 206, 1516, 1103.0, 1472.0, 1516.0, 1516.0, 0.1039259558131289, 65.8983930831163, 0.21965462386445608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7417401-543c-413c-8486-1acf052511b5", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 391.49999999999994, 206, 1308, 210.0, 1214.4, 1308.0, 1308.0, 0.10526315789473685, 14.137381213450292, 0.2337468019005848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 971.9999999999999, 103, 1399, 1243.0, 1399.0, 1399.0, 1399.0, 0.04344662039601594, 38.98585320337363, 0.08067218540573713], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1193.2272727272725, 258, 4078, 952.0, 2953.5999999999995, 3960.0999999999985, 4078.0, 0.09799161726255963, 0.030831169351785453, 0.0442110616946314], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 445.90000000000003, 203, 3934, 211.5, 589.1000000000004, 3767.7499999999977, 3934.0, 0.09188389550963404, 5.63153613937179, 0.2054735667260849], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 106.05882352941177, 103, 114, 105.0, 110.8, 114.0, 114.0, 0.09394704702326018, 0.07293740467137876, 0.03339523937154952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 309.8, 204, 521, 216.0, 456.20000000000005, 521.0, 521.0, 0.0819143939973132, 0.1269513117907579, 0.18422739196856672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 126.66666666666667, 102, 306, 103.0, 306.0, 306.0, 306.0, 0.05609049266149388, 0.04168443839394222, 0.028154798074226415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 124.66666666666667, 101, 303, 102.0, 303.0, 303.0, 303.0, 0.05609119181317893, 0.01500877593438577, 0.03198950783095361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 181.66666666666666, 101, 410, 103.0, 410.0, 410.0, 410.0, 0.056091890982293655, 0.01511851749132134, 0.032975896847012486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 124.88888888888889, 100, 307, 102.0, 307.0, 307.0, 307.0, 0.05609119181317893, 0.015118329043395886, 0.033030262366549705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 2.8357872596153846, 5.943885216346154], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1221.8571428571433, 805, 1966, 1211.5, 1622.2, 1794.7499999999998, 1966.0, 0.24460129988119367, 292.62819182856947, 0.4829920198825914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1193.2272727272725, 258, 4078, 952.0, 2953.5999999999995, 3960.0999999999985, 4078.0, 0.09656577006812277, 0.030382554076831235, 0.04356775954245382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 155.375, 102, 314, 103.5, 314.0, 314.0, 314.0, 0.07282459286501052, 0.019628503545647366, 0.04288401318125131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b98909a8-8575-4380-9867-ab7c94d041e3", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.816715952685422, 1.526035006393862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 152.75, 100, 305, 102.5, 305.0, 305.0, 305.0, 0.0726909272636409, 0.01959247648902821, 0.04273431466085139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 167.7058823529412, 101, 1204, 103.0, 324.7999999999992, 1204.0, 1204.0, 0.08831306461918888, 4.6967706396073705, 0.051471987225774944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 156.64705882352942, 99, 604, 103.0, 368.7999999999998, 604.0, 604.0, 0.08831260584525553, 1.54986391092375, 0.051557962615196004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 104.23529411764706, 102, 117, 103.0, 109.0, 117.0, 117.0, 0.08831122955205427, 0.0656297321182747, 0.04432809764624599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 128.625, 101, 303, 103.5, 303.0, 303.0, 303.0, 0.0728239299433794, 0.019486090629380816, 0.041532397545833565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 121.88235294117648, 101, 425, 102.0, 175.39999999999978, 425.0, 425.0, 0.08831260584525553, 0.031432956446300744, 0.04992949602073788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 129.125, 101, 315, 103.0, 315.0, 315.0, 315.0, 0.07282459286501052, 0.05412062028346973, 0.03655453196544473], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 525.8461538461538, 104, 963, 492.0, 909.0, 963.0, 963.0, 0.07116190976669841, 0.01333216668856264, 0.04843200890071272], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1da84ead-678f-4b2c-ba96-bd7e74080feb", 3, 0, 0.0, 290.0, 193, 471, 206.0, 471.0, 471.0, 471.0, 0.08692628650904033, 0.040350548359990725, 0.055743744929299954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 110.50000000000001, 103, 121, 110.0, 121.0, 121.0, 121.0, 0.06964030781016052, 0.05481453915526306, 0.024754953166892996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1368.0909090909088, 925, 2410, 1257.0, 2031.5, 2354.7999999999993, 2410.0, 0.09425151445047084, 0.04878252212768509, 0.04335201494743336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 311.0, 205, 630, 212.0, 630.0, 630.0, 630.0, 0.07262295974872456, 0.11255140343869714, 0.16333073857550065], "isController": false}, {"data": ["addBook", 62, 10, 16.129032258064516, 1056.6451612903224, 520, 4338, 860.5, 1832.6000000000001, 1985.1499999999999, 4338.0, 0.2790140902115557, 81.79751944660705, 1.0158999357592557], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 209.67857142857144, 101, 867, 105.5, 414.3, 420.75, 867.0, 0.24579622615008492, 0.18266692197286585, 0.1188175116643477], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 659.4107142857142, 499, 1030, 604.5, 841.8000000000003, 908.15, 1030.0, 0.2454235089426191, 72.16266045657538, 0.12343076865766489], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 162.48214285714292, 101, 320, 106.0, 308.0, 312.05, 320.0, 0.24595491997680996, 0.43522491699021454, 0.11961479506684704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b2af55f-c07d-4022-913f-fb6cf7aad8aa", 3, 0, 0.0, 330.0, 259, 413, 318.0, 413.0, 413.0, 413.0, 0.019238291896190175, 0.02652153847017103, 0.012337055675616748], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1010.6428571428572, 703, 1430, 1052.0, 1212.9, 1319.55, 1430.0, 0.24508731235502645, 220.52999447459408, 0.12302234233445665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 135.33333333333334, 103, 316, 106.0, 313.6, 316.0, 316.0, 0.08196631730800757, 0.06123460228576737, 0.029136464355580812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5d98b29-50fb-4022-9d5d-7bdc93630612", 3, 0, 0.0, 406.0, 195, 828, 195.0, 828.0, 828.0, 828.0, 0.027938944094172868, 0.028020796469448765, 0.01791657547705747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 10, 5.555555555555555, 159.26111111111106, 102, 591, 108.0, 291.0, 333.0, 530.2499999999998, 0.7358020855901337, 1.5111407589389734, 0.35574146622872815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 130.44444444444446, 105, 305, 107.0, 305.0, 305.0, 305.0, 0.05585482709827967, 0.043254763563413845, 0.019854645570091603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94701fb3-7bbf-4fc3-8eb1-051aaf77815a", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8779a518-a885-4b6b-b428-a5dd423f31f0", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 107.77777777777777, 103, 131, 105.0, 123.80000000000001, 131.0, 131.0, 0.1060439139630378, 0.08605712158523868, 0.03769529754154859], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7417401-543c-413c-8486-1acf052511b5", 3, 0, 0.0, 310.6666666666667, 205, 379, 348.0, 379.0, 379.0, 379.0, 0.03976037745851667, 0.025820948251868737, 0.02549737747177013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2cee043-5ab5-4268-b89e-eac95b868e0a", 3, 0, 0.0, 454.66666666666663, 189, 963, 212.0, 963.0, 963.0, 963.0, 0.02373136099355298, 0.028466818118894118, 0.015218353241308389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 309.44444444444446, 205, 614, 208.0, 614.0, 614.0, 614.0, 0.05605450989673513, 0.08687354219347526, 0.12606790653533304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96143f78-f59a-4c64-bc71-abb1f8f3c8ed", 3, 0, 0.0, 589.6666666666666, 216, 1022, 531.0, 1022.0, 1022.0, 1022.0, 0.019913839454626315, 0.023537484068928437, 0.012770268139848256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 316.7058823529411, 206, 1312, 207.0, 684.7999999999995, 1312.0, 1312.0, 0.08826400282444809, 6.340182609135843, 0.19717938912224045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bc55727-dd8b-499e-bc98-9dee76b78216", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c777bbf-7d02-479f-b7c4-26170215ddb7", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 107.21428571428572, 103, 120, 105.5, 118.5, 120.0, 120.0, 0.06421959431564848, 0.05324456599022027, 0.02282805891689067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 131.88235294117646, 104, 309, 107.0, 307.4, 309.0, 309.0, 0.09947221214497197, 0.07722696157739524, 0.03535926291090801], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2573e9d-a4e9-4b8a-9a99-edec358f2727", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 0.6361410651408451, 2.4276518485915495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a90d827d-6f18-47e9-ba0c-7622e39b098d", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=486240e0-a8c6-4354-91fa-4df692bbd004", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 103.53333333333332, 102, 107, 103.0, 105.8, 107.0, 107.0, 0.08196004720898718, 0.06090976164652271, 0.04114010182169865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 183.33333333333334, 101, 307, 103.0, 307.0, 307.0, 307.0, 0.08196318213858335, 0.021931554595675626, 0.04674462731341082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 164.06666666666663, 100, 415, 103.0, 349.00000000000006, 415.0, 415.0, 0.08196363000524567, 0.022091759649851373, 0.04818564967105263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 151.26666666666668, 101, 416, 103.0, 350.00000000000006, 416.0, 416.0, 0.08196273427681547, 0.02209151822304792, 0.048265164813398174], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.449438202247191], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.0749063670411985], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.0749063670411985], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.898876404494382], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1335, 20, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
