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

    var data = {"OkPercent": 97.11964549483014, "KoPercent": 2.880354505169867};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7716635041113219, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.14285714285714285, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/66beef1f-10d5-4671-b9b5-da2873fdbb35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a9cb8c3-4bb4-4278-ab3b-370bbc1c18dd"], "isController": false}, {"data": [0.40625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.40625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=836ddbb7-6e37-4e9c-b5de-09e189e562a4"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a98fe54a-7a36-48b4-a660-5be422c72717"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cf43927-c64a-456a-b275-8c7e19e2d2c4"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bce1a80f-c2db-455a-a0f0-7d4f6dc59a92"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3badfc9-cf51-41b0-9233-27e7a6245efe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b714ee5-4f2e-4e5a-981f-f54a7fc4e55c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39ec05c7-fb0e-427f-9025-35f28e8eaeff"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3cb66dff-6d2d-4ec2-831c-dc4b548e9e97"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8bb1e17-990c-4f6e-a825-ae223c9efcf7"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddb3db7f-03fc-4f33-a01c-1c775f9e1b2a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/38addb62-a464-428d-a141-7015b683e9cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66beef1f-10d5-4671-b9b5-da2873fdbb35"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3b2290b-cafa-446f-b3ab-f1e6ac6f7e00"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6cf43927-c64a-456a-b275-8c7e19e2d2c4"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4732142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/836ddbb7-6e37-4e9c-b5de-09e189e562a4"], "isController": false}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a9cb8c3-4bb4-4278-ab3b-370bbc1c18dd"], "isController": false}, {"data": [0.25396825396825395, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a98fe54a-7a36-48b4-a660-5be422c72717"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8873626373626373, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bce1a80f-c2db-455a-a0f0-7d4f6dc59a92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ddb3db7f-03fc-4f33-a01c-1c775f9e1b2a"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cb66dff-6d2d-4ec2-831c-dc4b548e9e97"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c8bb1e17-990c-4f6e-a825-ae223c9efcf7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39ec05c7-fb0e-427f-9025-35f28e8eaeff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38addb62-a464-428d-a141-7015b683e9cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3badfc9-cf51-41b0-9233-27e7a6245efe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3b2290b-cafa-446f-b3ab-f1e6ac6f7e00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1354, 39, 2.880354505169867, 339.68833087149187, 108, 2954, 122.0, 880.5, 1017.0, 1428.4000000000005, 5.2734276111061344, 711.6417794142561, 3.8644085686869785], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1647.3392857142858, 1314, 2101, 1707.5, 1897.9, 2040.8999999999999, 2101.0, 0.24811477080398045, 298.5644857489078, 1.219978389646525], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/66beef1f-10d5-4671-b9b5-da2873fdbb35", 3, 0, 0.0, 591.3333333333334, 239, 1064, 471.0, 1064.0, 1064.0, 1064.0, 0.06565557087518877, 0.029707436040531374, 0.04210334460420634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a9cb8c3-4bb4-4278-ab3b-370bbc1c18dd", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 523.5, 112, 815, 531.5, 806.6, 815.0, 815.0, 0.08977516931035838, 0.018142430760900666, 0.0602135824921587], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 523.5, 112, 815, 531.5, 806.6, 815.0, 815.0, 0.09157456745325405, 0.018506066457380625, 0.06142046641502739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 125.23529411764707, 109, 330, 112.0, 162.79999999999984, 330.0, 330.0, 0.08668206548065205, 0.030852600971858924, 0.04900763375807545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 155.0, 111, 369, 114.0, 345.0, 369.0, 369.0, 0.08668073953967428, 0.06441801053680872, 0.04350966808925057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 231.64705882352945, 111, 773, 114.0, 436.9999999999997, 773.0, 773.0, 0.08657744097455641, 1.5194122060186601, 0.050544952471531304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=836ddbb7-6e37-4e9c-b5de-09e189e562a4", 1, 0, 0.0, 1501.0, 1501, 1501, 1501.0, 1501.0, 1501.0, 1501.0, 0.6662225183211192, 0.1203624666888741, 0.45932919720186544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 219.0, 109, 1013, 115.0, 476.99999999999955, 1013.0, 1013.0, 0.08658096848452747, 4.604652238945647, 0.0504624601472895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a98fe54a-7a36-48b4-a660-5be422c72717", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 234.29411764705884, 111, 399, 236.0, 367.0, 399.0, 399.0, 0.09492592985532172, 0.1642227311306795, 0.06134631840948813], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 115.0, 109, 130, 114.0, 125.80000000000001, 130.0, 130.0, 0.07009826901086962, 0.05209451437233572, 0.035186045187096664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 141.375, 110, 335, 114.0, 330.8, 335.0, 335.0, 0.07010195453011973, 0.025338365156699776, 0.039612054140615756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 710.0, 560, 798, 767.0, 798.0, 798.0, 798.0, 0.06702092010148882, 19.70637581382546, 0.03822286849538035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 909.7142857142857, 755, 1087, 983.0, 1087.0, 1087.0, 1087.0, 0.06687940687520302, 60.17820786776508, 0.038076849812737665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 245.85714285714283, 113, 348, 329.0, 348.0, 348.0, 348.0, 0.0673063979538855, 0.11910077450433645, 0.037268288710794024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 174.5, 111, 388, 114.0, 376.90000000000003, 388.0, 388.0, 0.07280316451088407, 0.05410469550076443, 0.03654377593612736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 212.0, 110, 399, 114.0, 382.50000000000006, 399.0, 399.0, 0.07292527590062715, 0.028640737426467014, 0.041079814435558366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 263.9166666666667, 109, 1023, 117.0, 819.3000000000008, 1023.0, 1023.0, 0.07282304606664522, 5.478517817751225, 0.04229046685641116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 205.41666666666666, 110, 784, 111.0, 651.4000000000005, 784.0, 784.0, 0.07282525579871099, 1.8024132279491196, 0.0423628685261382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 144.42857142857142, 109, 335, 114.0, 335.0, 335.0, 335.0, 0.0673063979538855, 0.05001969613565124, 0.03779411994480875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cf43927-c64a-456a-b275-8c7e19e2d2c4", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.3031276216442953, 1.1568005453020134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 579.1578947368422, 111, 1117, 770.0, 1025.0, 1117.0, 1117.0, 0.14176142298624167, 67.15345569116155, 0.07692830509296565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 195.875, 110, 992, 114.0, 531.4000000000004, 992.0, 992.0, 0.07010134024999891, 3.9600454193703145, 0.04083539986242612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 471.47368421052636, 110, 910, 542.0, 888.0, 910.0, 910.0, 0.1417593076176975, 21.955963683503693, 0.07706559399015146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 140.0, 109, 558, 112.0, 248.6000000000003, 558.0, 558.0, 0.07010226167421726, 1.3059883624768882, 0.04090439584994611], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 475.06250000000006, 115, 1501, 481.5, 1064.9000000000005, 1501.0, 1501.0, 0.09194134142417139, 0.01858018685641061, 0.06216029290500161], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bce1a80f-c2db-455a-a0f0-7d4f6dc59a92", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 482.5833333333333, 222, 1140, 452.5, 1016.7000000000005, 1140.0, 1140.0, 0.07265153900176785, 7.346254255034147, 0.16184596587193956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3badfc9-cf51-41b0-9233-27e7a6245efe", 3, 0, 0.0, 356.0, 222, 481, 365.0, 481.0, 481.0, 481.0, 0.01709859620525155, 0.02357179522436208, 0.0109649200925604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b714ee5-4f2e-4e5a-981f-f54a7fc4e55c", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.8701251702997276, 1.6258302111716623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39ec05c7-fb0e-427f-9025-35f28e8eaeff", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 489.42857142857144, 166, 1703, 432.0, 807.8, 1613.5999999999988, 1703.0, 0.09259545047686657, 0.05687747885737214, 0.04186688825272385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 137.21052631578948, 110, 338, 113.0, 333.0, 338.0, 338.0, 0.14199980568447643, 0.1055291524666861, 0.07127724621271571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 207.26315789473685, 111, 363, 114.0, 341.0, 363.0, 363.0, 0.14200192823670973, 0.15024936753088544, 0.07470866249131174], "isController": false}, {"data": ["login", 21, 0, 0.0, 2377.4285714285716, 1431, 4664, 2137.0, 3744.0, 4572.499999999999, 4664.0, 0.0940001074286942, 37.6120071778594, 0.19378342459177098], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 116.75, 112, 126, 115.5, 126.0, 126.0, 126.0, 0.07314921067429857, 0.05921942934472023, 0.02600225848187957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cb66dff-6d2d-4ec2-831c-dc4b548e9e97", 3, 0, 0.0, 1252.3333333333333, 294, 2954, 509.0, 2954.0, 2954.0, 2954.0, 0.036861376649546605, 0.030729813020666946, 0.023638317708205344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8bb1e17-990c-4f6e-a825-ae223c9efcf7", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 746.6842105263158, 225, 1235, 900.0, 1142.0, 1235.0, 1235.0, 0.14163672416620698, 89.28648490963205, 0.2994711103014626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddb3db7f-03fc-4f33-a01c-1c775f9e1b2a", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38addb62-a464-428d-a141-7015b683e9cb", 3, 0, 0.0, 348.6666666666667, 203, 501, 342.0, 501.0, 501.0, 501.0, 0.051899522524392776, 0.033366392247941315, 0.0332819203688326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66beef1f-10d5-4671-b9b5-da2873fdbb35", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 415.7647058823529, 224, 1125, 234.0, 791.3999999999997, 1125.0, 1125.0, 0.08652808599873771, 6.215488177464015, 0.19330139800120122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, 50.0, 587.1428571428571, 111, 1423, 497.5, 1269.5, 1423.0, 1423.0, 0.11462162582588975, 68.57899182604531, 0.1670632583448637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3b2290b-cafa-446f-b3ab-f1e6ac6f7e00", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 803.1818181818182, 191, 1832, 763.0, 1327.6999999999998, 1763.599999999999, 1832.0, 0.09812229606172784, 0.030715484367334196, 0.04427002029347486], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 154.05882352941177, 112, 520, 115.0, 376.79999999999984, 520.0, 520.0, 0.0874395638308816, 0.06788520824760827, 0.031082032455508696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 326.9375, 224, 1107, 232.0, 645.0000000000005, 1107.0, 1107.0, 0.07006266229358883, 5.34050334138689, 0.15645218278034917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cf43927-c64a-456a-b275-8c7e19e2d2c4", 3, 0, 0.0, 365.3333333333333, 236, 515, 345.0, 515.0, 515.0, 515.0, 0.02887836432944438, 0.0289629689124408, 0.018519003166993956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 334.1111111111111, 224, 660, 237.0, 570.9000000000001, 660.0, 660.0, 0.09957404436576867, 0.15432032071140123, 0.22394435954527853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 146.92857142857142, 111, 364, 114.0, 346.5, 364.0, 364.0, 0.06987876035079137, 0.051931383424758046, 0.035075862129205826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 161.07142857142856, 109, 338, 114.0, 337.5, 338.0, 338.0, 0.06980280707002717, 0.018677704235534616, 0.03980941340712487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 127.71428571428571, 109, 332, 111.0, 227.5, 332.0, 332.0, 0.06988120195667365, 0.018835167714884696, 0.0410825034940601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 130.0, 108, 342, 113.0, 231.5, 342.0, 342.0, 0.06988120195667365, 0.018835167714884696, 0.041150746855345914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 116.66666666666667, 115, 118, 117.0, 118.0, 118.0, 118.0, 0.07474586406218856, 0.022044190377715763, 0.04620520698375523], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1045.2142857142865, 869, 1649, 899.5, 1436.2, 1543.9499999999998, 1649.0, 0.24274895856361975, 290.4121476347148, 0.47933436935121004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 803.1818181818182, 191, 1832, 763.0, 1327.6999999999998, 1763.599999999999, 1832.0, 0.09440236864124955, 0.029551025553004786, 0.042591693664313764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 111.66666666666667, 109, 114, 112.0, 114.0, 114.0, 114.0, 0.0355741067934686, 0.009588333471677082, 0.020948424215294494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 113.33333333333333, 111, 121, 112.0, 121.0, 121.0, 121.0, 0.035573895875206776, 0.009588276622614324, 0.02091355987976023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 165.23529411764707, 110, 344, 113.0, 341.6, 344.0, 344.0, 0.08259804874256617, 0.022262755325144788, 0.04855861849904769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 178.94117647058823, 109, 370, 113.0, 342.79999999999995, 370.0, 370.0, 0.08259885139009009, 0.02226297166373522, 0.048639753308812816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 138.82352941176472, 109, 339, 113.0, 331.8, 339.0, 339.0, 0.08259644349431541, 0.061382708495287146, 0.041459542925857545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 113.16666666666667, 112, 115, 113.0, 115.0, 115.0, 115.0, 0.03557347404618623, 0.009518683485014674, 0.020287996916965582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 150.58823529411765, 109, 344, 111.0, 336.0, 344.0, 344.0, 0.08259804874256617, 0.022101431011194463, 0.04710669967349477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 113.16666666666666, 110, 116, 113.0, 116.0, 116.0, 116.0, 0.035572630418156274, 0.026436300535368086, 0.017855793002863597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 152.66666666666666, 113, 324, 117.0, 324.0, 324.0, 324.0, 0.03692625826225029, 0.02906500406188841, 0.013126130866659282], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 456.18750000000006, 112, 796, 489.5, 791.1, 796.0, 796.0, 0.09340447640953194, 0.018396987632663547, 0.0635599674981611], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/836ddbb7-6e37-4e9c-b5de-09e189e562a4", 3, 0, 0.0, 417.33333333333337, 217, 796, 239.0, 796.0, 796.0, 796.0, 0.021007226485911152, 0.024829830524200326, 0.013471431047280265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1127.5714285714287, 903, 2276, 1013.0, 1497.0, 2198.499999999999, 2276.0, 0.09238566174529712, 0.047816797583015117, 0.04249379558792476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 228.16666666666666, 223, 238, 227.5, 238.0, 238.0, 238.0, 0.03554881444703819, 0.05509371926508751, 0.07995011686672748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a9cb8c3-4bb4-4278-ab3b-370bbc1c18dd", 3, 0, 0.0, 356.0, 252, 503, 313.0, 503.0, 503.0, 503.0, 0.06720580658168866, 0.030408877327001052, 0.043097473621720915], "isController": false}, {"data": ["addBook", 63, 19, 30.158730158730158, 1001.333333333333, 560, 1777, 914.0, 1617.6000000000001, 1718.3999999999999, 1777.0, 0.27469532799930235, 68.8854826380562, 1.0009355787677952], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a98fe54a-7a36-48b4-a660-5be422c72717", 3, 0, 0.0, 354.0, 243, 498, 321.0, 498.0, 498.0, 498.0, 0.022705599200762906, 0.026837249576162146, 0.014560556779135068], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 202.75000000000003, 110, 452, 116.0, 445.6, 450.0, 452.0, 0.24357569114602362, 0.18101670015832422, 0.11774410851297042], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 653.4107142857144, 540, 998, 560.0, 883.1, 912.5, 998.0, 0.2435100230464843, 71.60003206940036, 0.12246841979388616], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 177.21428571428572, 108, 482, 115.0, 338.90000000000003, 462.3, 482.0, 0.2439800110662362, 0.43173025395705084, 0.11865434131932191], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 831.6607142857143, 753, 1198, 773.5, 1000.3, 1094.45, 1198.0, 0.24326778135439336, 218.89277728183006, 0.12210902306265448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 128.0, 111, 338, 115.5, 140.90000000000032, 338.0, 338.0, 0.09810280083496384, 0.0732896900769017, 0.03487247998430355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 19, 10.43956043956044, 170.10989010989016, 110, 1115, 117.0, 321.3000000000003, 376.0, 845.2499999999959, 0.7344869890876218, 1.5303795938226417, 0.35402518796006327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 132.85714285714283, 112, 337, 116.5, 231.0, 337.0, 337.0, 0.07225769157320479, 0.055957372478077534, 0.025685351301412637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bce1a80f-c2db-455a-a0f0-7d4f6dc59a92", 3, 0, 0.0, 365.0, 241, 526, 328.0, 526.0, 526.0, 526.0, 0.060823550878900304, 0.039103682612574256, 0.03900468594773229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 122.3529411764706, 114, 205, 117.0, 141.79999999999995, 205.0, 205.0, 0.08890143968037317, 0.07214560192811534, 0.03160168363638265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddb3db7f-03fc-4f33-a01c-1c775f9e1b2a", 3, 0, 0.0, 369.3333333333333, 237, 472, 399.0, 472.0, 472.0, 472.0, 0.0771267707021107, 0.03625359924929943, 0.049459550222382194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 310.9285714285714, 222, 696, 232.5, 684.0, 696.0, 696.0, 0.0697610683409323, 0.10811603071978473, 0.156894277723796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cb66dff-6d2d-4ec2-831c-dc4b548e9e97", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 359.4117647058824, 222, 678, 230.0, 672.4, 678.0, 678.0, 0.08255192273140033, 0.127939356811262, 0.18566120903360833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8bb1e17-990c-4f6e-a825-ae223c9efcf7", 3, 0, 0.0, 734.0, 211, 1202, 789.0, 1202.0, 1202.0, 1202.0, 0.019662461084712438, 0.02324036334589546, 0.012609065213829266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39ec05c7-fb0e-427f-9025-35f28e8eaeff", 3, 0, 0.0, 364.6666666666667, 213, 444, 437.0, 444.0, 444.0, 444.0, 0.029011856178558306, 0.029285731122952244, 0.018604608291588495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38addb62-a464-428d-a141-7015b683e9cb", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 135.25, 113, 330, 118.5, 267.60000000000025, 330.0, 330.0, 0.07214009606656127, 0.05981146636768605, 0.02564354977366045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 128.94736842105266, 112, 344, 116.0, 130.0, 344.0, 344.0, 0.14056165478057586, 0.10912745659234162, 0.04996527572278282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3badfc9-cf51-41b0-9233-27e7a6245efe", 1, 0, 0.0, 878.0, 878, 878, 878.0, 878.0, 878.0, 878.0, 1.1389521640091116, 0.2057677249430524, 0.7852541287015945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 126.77777777777777, 110, 327, 114.5, 145.20000000000027, 327.0, 327.0, 0.09975781020522398, 0.07413641949821821, 0.050073744575669064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3b2290b-cafa-446f-b3ab-f1e6ac6f7e00", 3, 0, 0.0, 347.3333333333333, 232, 451, 359.0, 451.0, 451.0, 451.0, 0.021867483052700636, 0.025846624662876305, 0.01402309297324878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 162.16666666666666, 110, 337, 113.5, 333.4, 337.0, 337.0, 0.0996357758859281, 0.026660354094476858, 0.05682352843494338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 174.44444444444446, 110, 338, 113.0, 336.2, 338.0, 338.0, 0.09963522437299, 0.02685480656928246, 0.058574614328652325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 156.55555555555554, 110, 449, 113.5, 350.90000000000015, 449.0, 449.0, 0.09975781020522398, 0.026887847281876775, 0.05874410112670904], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 17.94871794871795, 0.51698670605613], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.256410256410257, 0.29542097488921715], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.6923076923076925, 0.22156573116691286], "isController": false}, {"data": ["401/Unauthorized", 25, 64.1025641025641, 1.846381093057607], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1354, 39, "401/Unauthorized", 25, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
