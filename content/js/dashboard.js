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

    var data = {"OkPercent": 98.67704280155642, "KoPercent": 1.3229571984435797};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7208445040214477, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=812f0f19-3102-47f6-93e1-4d74b539c462"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.38461538461538464, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d87a07ba-2fc0-4236-beb1-37ab0b3eb732"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38de168c-0d74-43fe-8c17-77aa096c9330"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6c20332a-78c5-4fcd-8997-fd61d29dd902"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43a3af1e-95bd-42a4-97e3-3c3c049d0b28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b3a5ce86-f51a-47e6-852d-1f7fcf7f4c1f"], "isController": false}, {"data": [0.4411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/89eb5b61-6ab8-4c8d-b9d4-2fd2066d15ab"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c27ba970-9e81-4362-be3f-9cffd83c1e38"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=404944c6-52e6-4d47-9b9d-43b3eb17d126"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3f1e238-fdc5-424d-a4de-be956120e794"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7754a2f7-314f-44ed-85dc-0ed2f1c55bee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b9302504-d85b-4c98-957c-c136a71dc4cc"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d87a07ba-2fc0-4236-beb1-37ab0b3eb732"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c3f1e238-fdc5-424d-a4de-be956120e794"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/43a3af1e-95bd-42a4-97e3-3c3c049d0b28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.26785714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe526438-fcfb-4cb8-a6d9-0c64e3ff26e5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3a5ce86-f51a-47e6-852d-1f7fcf7f4c1f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/812f0f19-3102-47f6-93e1-4d74b539c462"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3482142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9127906976744186, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50091fc7-5498-4860-9aac-8889e373f6c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3fc3e2c0-5ea6-4aff-bf5e-acdfe0e52297"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c20332a-78c5-4fcd-8997-fd61d29dd902"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe526438-fcfb-4cb8-a6d9-0c64e3ff26e5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/38de168c-0d74-43fe-8c17-77aa096c9330"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c27ba970-9e81-4362-be3f-9cffd83c1e38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbd3f31a-3c5c-460f-bdb7-d90736d311e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89eb5b61-6ab8-4c8d-b9d4-2fd2066d15ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/404944c6-52e6-4d47-9b9d-43b3eb17d126"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9302504-d85b-4c98-957c-c136a71dc4cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1285, 17, 1.3229571984435797, 515.7470817120625, 143, 4512, 174.0, 1377.4000000000005, 1722.1000000000001, 2326.2600000000057, 5.113349223845318, 717.4102017783314, 3.738273928783182], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2399.9821428571436, 1740, 3137, 2363.0, 2921.9, 3092.7, 3137.0, 0.23674042258165431, 284.8779487195408, 1.164050808299443], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=812f0f19-3102-47f6-93e1-4d74b539c462", 1, 0, 0.0, 784.0, 784, 784, 784.0, 784.0, 784.0, 784.0, 1.2755102040816326, 0.23043885522959182, 0.8794044961734694], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 1077.0769230769233, 153, 3049, 851.0, 2732.9999999999995, 3049.0, 3049.0, 0.07371369600471768, 0.013965290063393778, 0.04983094578924687], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 1077.0769230769233, 153, 3049, 851.0, 2732.9999999999995, 3049.0, 3049.0, 0.07599006283793658, 0.014396554873593453, 0.05136978481660091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 192.66666666666669, 144, 471, 150.0, 432.8, 467.19999999999993, 471.0, 0.11017029179388711, 0.0373587131585298, 0.062390895343469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 167.04761904761904, 145, 477, 148.0, 167.6, 446.1999999999996, 477.0, 0.11017029179388711, 0.08187460161635557, 0.055300322248103495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 278.6190476190476, 144, 1382, 158.0, 462.8, 1290.7999999999988, 1382.0, 0.11000984850072293, 1.568550950930369, 0.06433100097175366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 241.1904761904762, 143, 1246, 146.0, 439.8, 1165.3999999999987, 1246.0, 0.11000235719336843, 4.741585515374139, 0.06421919606610618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d87a07ba-2fc0-4236-beb1-37ab0b3eb732", 3, 0, 0.0, 419.33333333333337, 251, 740, 267.0, 740.0, 740.0, 740.0, 0.02669347878313328, 0.026771682334255743, 0.01711788841236086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38de168c-0d74-43fe-8c17-77aa096c9330", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 329.61538461538464, 149, 519, 274.0, 507.4, 519.0, 519.0, 0.07399480897955465, 0.1642815940047129, 0.04783092933211147], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6c20332a-78c5-4fcd-8997-fd61d29dd902", 3, 0, 0.0, 956.3333333333334, 304, 2174, 391.0, 2174.0, 2174.0, 2174.0, 0.025477707006369428, 0.02555234872611465, 0.016338243099787687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43a3af1e-95bd-42a4-97e3-3c3c049d0b28", 1, 0, 0.0, 1541.0, 1541, 1541, 1541.0, 1541.0, 1541.0, 1541.0, 0.6489292667099286, 0.11723819759896172, 0.4474063108371188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 168.88235294117646, 145, 434, 150.0, 221.99999999999983, 434.0, 434.0, 0.10043126366160572, 0.07463690590476753, 0.05041178664264193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 219.8235294117647, 144, 472, 148.0, 468.0, 472.0, 472.0, 0.10043067034518613, 0.035746118649975483, 0.05678071332360535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 974.75, 858, 1171, 935.0, 1171.0, 1171.0, 1171.0, 0.05863726984871584, 17.241304276122904, 0.033441567960595754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1541.25, 1189, 1747, 1614.5, 1747.0, 1747.0, 1747.0, 0.05840609759658908, 52.55390928437929, 0.03325269033087054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 223.75, 148, 431, 158.0, 431.0, 431.0, 431.0, 0.059307583957298536, 0.10494662317443844, 0.03283925791385574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 207.63636363636363, 145, 452, 157.0, 449.8, 452.0, 452.0, 0.054436042598677695, 0.040454910564056375, 0.027324341695039393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 236.9090909090909, 144, 470, 155.0, 469.8, 470.0, 470.0, 0.054436042598677695, 0.021998656419494042, 0.030629939452274435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 341.27272727272725, 146, 1327, 156.0, 1157.6000000000006, 1327.0, 1327.0, 0.054120008659201385, 4.440286296383308, 0.0313938331480133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 365.72727272727275, 145, 1248, 158.0, 1094.6000000000006, 1248.0, 1248.0, 0.05414078573045764, 1.4604649985972613, 0.03145875733361552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 232.0, 145, 475, 154.0, 475.0, 475.0, 475.0, 0.05930934270420948, 0.044076572068265055, 0.033303585991133255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3a5ce86-f51a-47e6-852d-1f7fcf7f4c1f", 3, 0, 0.0, 886.6666666666666, 460, 1215, 985.0, 1215.0, 1215.0, 1215.0, 0.024841840283528205, 0.024914619112483855, 0.01593047700473651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1048.6470588235295, 147, 1887, 1573.0, 1872.6, 1887.0, 1887.0, 0.08216768006805417, 43.500073935807706, 0.044151911727744644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 283.82352941176475, 143, 1549, 146.0, 688.9999999999992, 1549.0, 1549.0, 0.10042651732652796, 5.3410027163157645, 0.05853213722397477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 765.7058823529412, 145, 1449, 1143.0, 1288.9999999999998, 1449.0, 1449.0, 0.08216569437261659, 14.220555681757766, 0.04423108467174805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 277.70588235294116, 144, 1285, 157.0, 723.3999999999995, 1285.0, 1285.0, 0.10043067034518613, 1.762532879967626, 0.05863263457709827], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 844.076923076923, 152, 1999, 729.0, 1913.0, 1999.0, 1999.0, 0.0765561509922855, 0.014503802043460337, 0.052362060906307045], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 612.7272727272726, 294, 1476, 620.0, 1367.6000000000004, 1476.0, 1476.0, 0.05408089518630868, 5.9579727684256065, 0.12037128224573375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 778.9499999999999, 243, 1792, 644.5, 1546.1000000000001, 1779.8999999999999, 1792.0, 0.09241119284367723, 0.05676429716667283, 0.04178357645177984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 155.17647058823533, 144, 203, 150.0, 172.59999999999997, 203.0, 203.0, 0.08216887153138609, 0.06106495237830549, 0.041244921842902786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 235.58823529411765, 144, 444, 158.0, 437.6, 444.0, 444.0, 0.08216926869350863, 0.09458339878679492, 0.04280278771327759], "isController": false}, {"data": ["login", 20, 0, 0.0, 3127.55, 1417, 4693, 3002.5, 4635.900000000001, 4691.15, 4693.0, 0.0886803914352478, 21.34154241250571, 0.16321002509655078], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 193.58823529411768, 148, 479, 160.0, 447.79999999999995, 479.0, 479.0, 0.09627582457412105, 0.07794204938666636, 0.034223047016582096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89eb5b61-6ab8-4c8d-b9d4-2fd2066d15ab", 3, 0, 0.0, 678.3333333333334, 274, 1024, 737.0, 1024.0, 1024.0, 1024.0, 0.07952075491703334, 0.03598107074696496, 0.05099475494354026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c27ba970-9e81-4362-be3f-9cffd83c1e38", 1, 0, 0.0, 1999.0, 1999, 1999, 1999.0, 1999.0, 1999.0, 1999.0, 0.5002501250625312, 0.09037721985992996, 0.344899012006003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=404944c6-52e6-4d47-9b9d-43b3eb17d126", 1, 0, 0.0, 1784.0, 1784, 1784, 1784.0, 1784.0, 1784.0, 1784.0, 0.5605381165919282, 0.10126909332959641, 0.3864647561659193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1222.9411764705883, 301, 2035, 1720.0, 2028.6, 2035.0, 2035.0, 0.08210616810513453, 57.833291613639766, 0.17230126534057155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3f1e238-fdc5-424d-a4de-be956120e794", 1, 0, 0.0, 729.0, 729, 729, 729.0, 729.0, 729.0, 729.0, 1.371742112482853, 0.24782450274348422, 0.9457518861454047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 478.3809523809523, 292, 1541, 319.0, 860.6000000000001, 1478.6999999999991, 1541.0, 0.10991714341046725, 6.424100903937651, 0.2458670254458187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1232.0, 148, 2223, 1550.0, 2223.0, 2223.0, 2223.0, 0.08742277654738315, 69.73315335776314, 0.15072745311953606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7754a2f7-314f-44ed-85dc-0ed2f1c55bee", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.6298539201183432, 1.1768830128205128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9302504-d85b-4c98-957c-c136a71dc4cc", 3, 0, 0.0, 400.0, 239, 596, 365.0, 596.0, 596.0, 596.0, 0.039070639716607625, 0.03257158473770577, 0.02505506518285059], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1418.5454545454547, 198, 4512, 1232.0, 2898.9999999999995, 4286.699999999997, 4512.0, 0.08962982880702698, 0.028200294148801812, 0.04043845791879538], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d87a07ba-2fc0-4236-beb1-37ab0b3eb732", 1, 0, 0.0, 627.0, 627, 627, 627.0, 627.0, 627.0, 627.0, 1.594896331738437, 0.2881404505582137, 1.099606259968102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 536.5294117647059, 293, 1706, 322.0, 1062.7999999999995, 1706.0, 1706.0, 0.10033997544621778, 7.207624251876948, 0.22415678453170743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 181.5294117647059, 149, 471, 162.0, 261.3999999999998, 471.0, 471.0, 0.14046800634584877, 0.10905475102045875, 0.04993198663075093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 550.8, 295, 1768, 468.0, 892.6, 1724.2999999999993, 1768.0, 0.1038621126592336, 6.365677442252665, 0.23225962087732327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 150.5, 144, 159, 147.5, 159.0, 159.0, 159.0, 0.03562543418497913, 0.026475542397235464, 0.0178822980186321], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3f1e238-fdc5-424d-a4de-be956120e794", 3, 0, 0.0, 506.66666666666663, 261, 828, 431.0, 828.0, 828.0, 828.0, 0.03403791824092039, 0.02837601191894437, 0.021827701476111055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 199.0, 147, 433, 154.0, 433.0, 433.0, 433.0, 0.03562522265764161, 0.00953253028143926, 0.020317509796936233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 148.83333333333331, 145, 157, 146.5, 157.0, 157.0, 157.0, 0.03562353052936566, 0.00960165471299309, 0.02094273962761536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43a3af1e-95bd-42a4-97e3-3c3c049d0b28", 3, 0, 0.0, 531.0, 236, 838, 519.0, 838.0, 838.0, 838.0, 0.040257108734450694, 0.02588144197608728, 0.02581591933817313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 250.5, 143, 464, 153.5, 464.0, 464.0, 464.0, 0.03562501113281598, 0.009602053781891808, 0.020978400110437535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 152.0, 152, 152, 152.0, 152.0, 152.0, 152.0, 6.578947368421052, 1.9402754934210527, 4.0668688322368425], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1616.1607142857144, 1151, 2511, 1488.0, 2316.6, 2459.1, 2511.0, 0.24644958565663413, 294.8393841840978, 0.48664166230245526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1418.5454545454547, 198, 4512, 1232.0, 2898.9999999999995, 4286.699999999997, 4512.0, 0.08930927395619787, 0.02809943775752532, 0.04029383258570646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 266.8, 146, 446, 160.0, 446.0, 446.0, 446.0, 0.039411352045843284, 0.010622590981106197, 0.023208052034808104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 212.0, 145, 433, 157.0, 433.0, 433.0, 433.0, 0.039412284020683565, 0.010622842177449868, 0.023170112285597174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 316.5882352941176, 144, 1431, 156.0, 662.9999999999993, 1431.0, 1431.0, 0.1348510688930314, 7.171810239261492, 0.07859598718914845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 271.70588235294116, 145, 937, 158.0, 566.5999999999997, 937.0, 937.0, 0.13483395594895345, 2.366301846630341, 0.07871768694331421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 151.2, 145, 159, 150.0, 159.0, 159.0, 159.0, 0.03941259468875874, 0.010545948188203022, 0.02247749540843272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 169.6470588235294, 146, 433, 151.0, 216.19999999999982, 433.0, 433.0, 0.13518564169443273, 0.10046511067330402, 0.0678568553036508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 227.6, 146, 526, 158.0, 526.0, 526.0, 526.0, 0.03929767200591037, 0.029204617574704876, 0.01972558926859173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 239.52941176470586, 144, 480, 156.0, 472.0, 480.0, 480.0, 0.13517489245644584, 0.048112570867425236, 0.07642413209767579], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 160.2, 149, 169, 161.0, 169.0, 169.0, 169.0, 0.03950164721868902, 0.031092116853772802, 0.014041601159768363], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 844.2500000000001, 148, 2174, 779.5, 1886.300000000001, 2174.0, 2174.0, 0.0809301572742723, 0.015207335054223205, 0.05507966351601068], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1551.6000000000001, 759, 3930, 1314.5, 3037.4000000000015, 3888.7999999999993, 3930.0, 0.091760797951899, 0.047493381752447716, 0.04220638265170354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 503.6, 318, 960, 326.0, 960.0, 960.0, 960.0, 0.03924831624723299, 0.0608272244964441, 0.08827038312243904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe526438-fcfb-4cb8-a6d9-0c64e3ff26e5", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3a5ce86-f51a-47e6-852d-1f7fcf7f4c1f", 1, 0, 0.0, 742.0, 742, 742, 742.0, 742.0, 742.0, 742.0, 1.3477088948787064, 0.24348256401617252, 0.9291821091644205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/812f0f19-3102-47f6-93e1-4d74b539c462", 3, 0, 0.0, 1169.6666666666667, 270, 2760, 479.0, 2760.0, 2760.0, 2760.0, 0.015661461840848222, 0.021590589484372473, 0.010043320256012697], "isController": false}, {"data": ["addBook", 58, 7, 12.068965517241379, 1609.0344827586207, 760, 3317, 1411.5, 2707.3, 2922.7999999999993, 3317.0, 0.2821862623943018, 88.37777070115987, 1.0263556039515807], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 256.1964285714286, 144, 649, 159.0, 586.0, 629.25, 649.0, 0.24799170999140885, 0.18429852666353724, 0.11987880512280018], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 1000.9107142857142, 717, 1582, 935.5, 1278.4, 1401.1, 1582.0, 0.2473541935369883, 72.73034583208184, 0.12440176725737205], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 233.0714285714286, 145, 476, 156.0, 462.90000000000003, 469.6, 476.0, 0.2481851461190048, 0.43917137184339516, 0.12069941676490661], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1354.9464285714284, 1004, 1882, 1324.0, 1729.3, 1867.05, 1882.0, 0.24711842267841067, 222.3575911138863, 0.1240418645084991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 188.45, 147, 439, 163.0, 411.20000000000056, 438.95, 439.0, 0.10627274901033502, 0.07939321581338506, 0.03777664124976753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, 4.069767441860465, 263.2325581395349, 145, 2294, 163.0, 472.70000000000005, 648.5499999999997, 2266.9900000000002, 0.7255485906640456, 1.551368451343952, 0.34866109656967376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 156.0, 148, 164, 156.0, 164.0, 164.0, 164.0, 0.036370690073226325, 0.028165973855535622, 0.01292864373696717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50091fc7-5498-4860-9aac-8889e373f6c9", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.7846091830466831, 1.4660434582309583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fc3e2c0-5ea6-4aff-bf5e-acdfe0e52297", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c20332a-78c5-4fcd-8997-fd61d29dd902", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 176.1428571428571, 146, 472, 159.0, 238.60000000000008, 450.49999999999966, 472.0, 0.11115816218505187, 0.09020745388259581, 0.03951325296421766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe526438-fcfb-4cb8-a6d9-0c64e3ff26e5", 3, 0, 0.0, 333.6666666666667, 240, 478, 283.0, 478.0, 478.0, 478.0, 0.020991204685236884, 0.021052702355213164, 0.013461156650363498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 405.1666666666667, 295, 623, 310.5, 623.0, 623.0, 623.0, 0.03559225512528474, 0.05516104383186219, 0.08004781597024488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38de168c-0d74-43fe-8c17-77aa096c9330", 3, 0, 0.0, 460.33333333333337, 263, 819, 299.0, 819.0, 819.0, 819.0, 0.01701162461015027, 0.02345189785937057, 0.010909147292316417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 543.9999999999999, 292, 1593, 580.0, 1042.5999999999995, 1593.0, 1593.0, 0.13467693380232595, 9.67411771754286, 0.30086461848797413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c27ba970-9e81-4362-be3f-9cffd83c1e38", 3, 0, 0.0, 542.0, 272, 1079, 275.0, 1079.0, 1079.0, 1079.0, 0.026247637712605864, 0.026324535088717013, 0.01683198121544061], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 158.72727272727272, 150, 168, 160.0, 167.0, 168.0, 168.0, 0.05585457499746115, 0.046309115403168476, 0.01985455595612877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbd3f31a-3c5c-460f-bdb7-d90736d311e5", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.8104973032994923, 1.5144154505076142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 159.05882352941174, 147, 191, 157.0, 183.79999999999998, 191.0, 191.0, 0.08419843093747524, 0.06536889901884063, 0.029929910997305652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89eb5b61-6ab8-4c8d-b9d4-2fd2066d15ab", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/404944c6-52e6-4d47-9b9d-43b3eb17d126", 2, 0, 0.0, 379.0, 268, 490, 379.0, 490.0, 490.0, 490.0, 0.018412815319462348, 0.02587504027803351, 0.011445075147302522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9302504-d85b-4c98-957c-c136a71dc4cc", 1, 0, 0.0, 815.0, 815, 815, 815.0, 815.0, 815.0, 815.0, 1.2269938650306749, 0.22167369631901843, 0.845954754601227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 182.25, 145, 461, 155.5, 407.7000000000006, 459.7, 461.0, 0.10411027360179903, 0.07737101387789946, 0.052258477179028026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 243.64999999999995, 144, 480, 156.0, 478.3, 479.95, 480.0, 0.10410648010785432, 0.035674769404146565, 0.05893606105324526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 301.7, 143, 1611, 150.0, 494.40000000000003, 1555.2499999999993, 1611.0, 0.10394362097998046, 4.70304789494678, 0.060660847556285466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 279.0, 145, 1221, 153.0, 468.8, 1183.3999999999994, 1221.0, 0.10410864778482824, 1.557227466333866, 0.06085882476952948], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 35.294117647058826, 0.4669260700389105], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07782101167315175], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07782101167315175], "isController": false}, {"data": ["401/Unauthorized", 9, 52.94117647058823, 0.7003891050583657], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1285, 17, "401/Unauthorized", 9, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
