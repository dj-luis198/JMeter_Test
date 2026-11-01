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

    var data = {"OkPercent": 97.2809667673716, "KoPercent": 2.719033232628399};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7543464262717321, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/16a3e9b0-e3dc-458b-a5c4-66f9a2012431"], "isController": false}, {"data": [0.10526315789473684, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cabf5fdf-3af2-4727-b1f1-169ef1adb2a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5682b547-8e54-40b0-bb6d-682967d81640"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e8d42b35-ca39-43fb-bb53-30baa50b9ac6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3f2d4be0-f5fd-46a0-8f17-4d5201c195c8"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=620c3ed5-6e10-45cd-af01-1d64412f2b4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59bb7f51-318b-41c8-8e5e-3cc55403b5d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eba7c78f-e56f-4d22-bfe2-a41a10305d9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e4968d0-5ec4-423f-b95d-40c51bba28c9"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d870b9cc-4b3e-4927-97ae-51dddfb1a06a"], "isController": false}, {"data": [0.7291666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ec8c7e6-86eb-44a5-aae8-a6fa0c712985"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cccadb5e-a0ef-4232-8179-68b1afdfdad3"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5682b547-8e54-40b0-bb6d-682967d81640"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de29e001-02f5-48bb-a543-2cdd7b591df3"], "isController": false}, {"data": [0.28846153846153844, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/620c3ed5-6e10-45cd-af01-1d64412f2b4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cabf5fdf-3af2-4727-b1f1-169ef1adb2a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ec8c7e6-86eb-44a5-aae8-a6fa0c712985"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f2d4be0-f5fd-46a0-8f17-4d5201c195c8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e4968d0-5ec4-423f-b95d-40c51bba28c9"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eba7c78f-e56f-4d22-bfe2-a41a10305d9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59bb7f51-318b-41c8-8e5e-3cc55403b5d6"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d870b9cc-4b3e-4927-97ae-51dddfb1a06a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16a3e9b0-e3dc-458b-a5c4-66f9a2012431"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/de29e001-02f5-48bb-a543-2cdd7b591df3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bfea79b0-0d73-43d9-901d-8b9caa8b37da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8d42b35-ca39-43fb-bb53-30baa50b9ac6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cccadb5e-a0ef-4232-8179-68b1afdfdad3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8bf53450-e0f0-4c70-9aaf-a78f9906b978"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/584cd182-f0ba-4801-b1eb-c401f042529b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b2e0d514-cc2d-4a08-a885-d61c08748eaf"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1324, 36, 2.719033232628399, 397.7371601208461, 111, 5303, 145.5, 972.0, 1171.5, 2041.25, 5.234298094067137, 760.1362714447098, 3.814897179547494], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/16a3e9b0-e3dc-458b-a5c4-66f9a2012431", 3, 0, 0.0, 643.3333333333334, 245, 1230, 455.0, 1230.0, 1230.0, 1230.0, 0.026354627872654437, 0.026431838696500107, 0.016900591441773843], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1808.0877192982457, 1373, 3510, 1764.0, 2115.6, 2446.3999999999987, 3510.0, 0.2537698174192945, 305.36923682344747, 1.2477842096739726], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cabf5fdf-3af2-4727-b1f1-169ef1adb2a3", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5682b547-8e54-40b0-bb6d-682967d81640", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8d42b35-ca39-43fb-bb53-30baa50b9ac6", 3, 0, 0.0, 385.33333333333337, 228, 668, 260.0, 668.0, 668.0, 668.0, 0.08033203909492569, 0.036348155710269114, 0.05151501204980587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f2d4be0-f5fd-46a0-8f17-4d5201c195c8", 3, 0, 0.0, 1413.0, 228, 3488, 523.0, 3488.0, 3488.0, 3488.0, 0.0622600394313583, 0.028860122444744212, 0.03992587164055204], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 529.2352941176471, 120, 1167, 493.0, 1065.3999999999999, 1167.0, 1167.0, 0.08630011117484909, 0.017911437366425195, 0.05768543736388696], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 529.2352941176471, 120, 1167, 493.0, 1065.3999999999999, 1167.0, 1167.0, 0.08602934106585293, 0.017855239503155252, 0.05750444695785068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 146.61111111111111, 111, 384, 120.0, 347.1000000000001, 384.0, 384.0, 0.09159979033825766, 0.03215335522398693, 0.051813119252749264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 142.50000000000003, 116, 359, 121.5, 212.30000000000024, 359.0, 359.0, 0.09159512917457523, 0.0680702083025896, 0.045976461323956705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 240.11111111111111, 112, 843, 123.0, 428.10000000000065, 843.0, 843.0, 0.09148898320160614, 1.5177780089710031, 0.053438063864392996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 169.94444444444443, 115, 802, 119.0, 395.2000000000006, 802.0, 802.0, 0.09159466308429763, 4.6020404698933435, 0.053410342818469556], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 294.1764705882353, 118, 1237, 234.0, 597.7999999999995, 1237.0, 1237.0, 0.08536579242052193, 0.12280649928694455, 0.05516803565779364], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=620c3ed5-6e10-45cd-af01-1d64412f2b4a", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59bb7f51-318b-41c8-8e5e-3cc55403b5d6", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 0.719777141434263, 2.746825199203187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 145.68750000000003, 113, 357, 119.5, 319.20000000000005, 357.0, 357.0, 0.08121703730400044, 0.060357583387055026, 0.040767145677984604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 163.0, 113, 364, 120.5, 357.7, 364.0, 364.0, 0.0811136909771158, 0.03693286954890649, 0.04540861655530433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 621.2857142857143, 560, 744, 592.0, 744.0, 744.0, 744.0, 0.05900998111680604, 17.350893764120247, 0.03365412985567845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1014.8571428571429, 829, 1197, 1044.0, 1197.0, 1197.0, 1197.0, 0.05875342028839536, 52.866430852994746, 0.033450433621225094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 287.57142857142856, 120, 363, 352.0, 363.0, 363.0, 363.0, 0.05910814256883987, 0.10459370540501743, 0.032728825035675986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 121.25, 114, 132, 121.0, 132.0, 132.0, 132.0, 0.08127190531823031, 0.06039835932341139, 0.04079468684918982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 120.875, 115, 129, 121.5, 129.0, 129.0, 129.0, 0.08125952260030472, 0.02174327069578466, 0.04634332148298628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 236.875, 118, 364, 231.0, 364.0, 364.0, 364.0, 0.08126282428945818, 0.021902870609268026, 0.04777365256079475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 296.5, 112, 367, 351.0, 367.0, 367.0, 367.0, 0.08125787185633608, 0.021901535773778086, 0.04785009446227603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eba7c78f-e56f-4d22-bfe2-a41a10305d9f", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 153.42857142857144, 115, 342, 121.0, 342.0, 342.0, 342.0, 0.05922967575983212, 0.04401736645823462, 0.03325885113467136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 692.4705882352941, 116, 1217, 1039.0, 1172.2, 1217.0, 1217.0, 0.08944026179690748, 47.35022332115368, 0.048059754644317124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e4968d0-5ec4-423f-b95d-40c51bba28c9", 3, 0, 0.0, 411.0, 224, 775, 234.0, 775.0, 775.0, 775.0, 0.03928707062505729, 0.025257800938960986, 0.025193857139115514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 262.625, 114, 1033, 121.0, 1032.3, 1033.0, 1033.0, 0.0812162127864775, 9.153965397451842, 0.046873810309383014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 551.5294117647059, 118, 971, 787.0, 963.0, 971.0, 971.0, 0.08943979123700492, 15.479495927858917, 0.04814684534018688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 222.0625, 113, 580, 120.5, 579.3, 580.0, 580.0, 0.08121456380165373, 3.004125921912197, 0.046952169697831066], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 431.4375, 120, 986, 472.0, 956.6, 986.0, 986.0, 0.08134917608537597, 0.01643964367789794, 0.05499907369981137], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 420.625, 237, 500, 475.5, 500.0, 500.0, 500.0, 0.08116389018525659, 0.12578817746484589, 0.18253949130531827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d870b9cc-4b3e-4927-97ae-51dddfb1a06a", 3, 0, 0.0, 742.6666666666667, 252, 1658, 318.0, 1658.0, 1658.0, 1658.0, 0.026139234991722576, 0.026215814781737387, 0.01676246514768668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 550.0416666666665, 143, 1282, 528.5, 1037.0, 1221.75, 1282.0, 0.11218675354907469, 0.06891158982653123, 0.050725065325411704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 123.94117647058823, 113, 148, 122.0, 139.2, 148.0, 148.0, 0.08943837958700514, 0.0664673895172958, 0.04489387412863344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 149.35294117647055, 112, 368, 120.0, 358.4, 368.0, 368.0, 0.08943979123700492, 0.10295235160886401, 0.046590075076812995], "isController": false}, {"data": ["login", 24, 0, 0.0, 2902.833333333334, 1321, 7174, 2477.5, 5178.5, 6742.5, 7174.0, 0.11560081113235812, 40.49412780241654, 0.23032671378202504], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 123.375, 118, 130, 123.5, 128.6, 130.0, 130.0, 0.08101676034229581, 0.06558876398805003, 0.028798926527925463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ec8c7e6-86eb-44a5-aae8-a6fa0c712985", 3, 0, 0.0, 308.3333333333333, 227, 443, 255.0, 443.0, 443.0, 443.0, 0.044781466443754483, 0.03707007459845951, 0.02871728154107953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 832.3529411764706, 235, 1343, 1161.0, 1295.8, 1343.0, 1343.0, 0.0893814801573114, 62.95781822600107, 0.18756863807598478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cccadb5e-a0ef-4232-8179-68b1afdfdad3", 3, 0, 0.0, 387.3333333333333, 223, 501, 438.0, 501.0, 501.0, 501.0, 0.03402324922030054, 0.028363782960022683, 0.021818294584632834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 396.88888888888886, 236, 1013, 251.0, 753.8000000000004, 1013.0, 1013.0, 0.09143228677228789, 6.210763286571646, 0.20433369990907568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, 50.0, 644.5, 118, 1384, 536.0, 1351.0, 1384.0, 1384.0, 0.09023409301845932, 53.98774518294963, 0.13151795295903373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5682b547-8e54-40b0-bb6d-682967d81640", 3, 0, 0.0, 406.0, 220, 500, 498.0, 500.0, 500.0, 500.0, 0.025810892196506927, 0.025886510044738877, 0.016551906779661018], "isController": false}, {"data": ["register", 26, 7, 26.923076923076923, 947.0000000000001, 143, 4757, 630.5, 2051.9, 3813.399999999996, 4757.0, 0.10046950170991363, 0.03162313793303321, 0.04532901346677744], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 140.125, 116, 368, 125.0, 210.50000000000017, 368.0, 368.0, 0.08544361255593887, 0.06633561716989395, 0.030372534150743893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 455.9374999999999, 234, 1153, 335.5, 1152.3, 1153.0, 1153.0, 0.08106683960925784, 12.232948492790118, 0.17972850842081797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 490.7222222222221, 236, 2051, 470.0, 1096.1000000000015, 2051.0, 2051.0, 0.0847681121199563, 5.758082808732529, 0.1894405422333572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 16, 0, 0.0, 210.5625, 114, 802, 124.0, 496.8000000000003, 802.0, 802.0, 0.0718245684914596, 0.053377438107422626, 0.03605256660606469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 16, 0, 0.0, 177.50000000000003, 114, 362, 121.5, 359.2, 362.0, 362.0, 0.07175306183768561, 0.01919954974953697, 0.04092166807930507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 16, 0, 0.0, 163.12499999999997, 113, 363, 121.0, 351.8, 363.0, 363.0, 0.07175467078060113, 0.019340126108833896, 0.042183898251876836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 16, 0, 0.0, 173.75, 114, 472, 122.0, 411.1000000000001, 472.0, 472.0, 0.07182585820677767, 0.019359313344795542, 0.04229589111199896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 121.66666666666667, 120, 124, 121.0, 124.0, 124.0, 124.0, 0.0245188181929631, 0.007231135834252789, 0.015156652261860977], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1143.7894736842109, 895, 2179, 997.0, 1539.0, 1620.6999999999998, 2179.0, 0.24144664664495058, 288.85412982310856, 0.4767628120274317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de29e001-02f5-48bb-a543-2cdd7b591df3", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 7, 26.923076923076923, 947.0000000000001, 143, 4757, 630.5, 2051.9, 3813.399999999996, 4757.0, 0.10313122258097784, 0.03246092417475189, 0.046529907062902116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/620c3ed5-6e10-45cd-af01-1d64412f2b4a", 3, 0, 0.0, 322.3333333333333, 232, 499, 236.0, 499.0, 499.0, 499.0, 0.05287741253194677, 0.03399508129902177, 0.03390901780206222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 120.75, 116, 127, 120.0, 127.0, 127.0, 127.0, 0.06072474988993639, 0.01636721774377192, 0.03575881267932778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cabf5fdf-3af2-4727-b1f1-169ef1adb2a3", 3, 0, 0.0, 646.0, 231, 1237, 470.0, 1237.0, 1237.0, 1237.0, 0.024615788566786735, 0.024687905134853493, 0.015785515454612587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 117.75, 115, 122, 117.0, 122.0, 122.0, 122.0, 0.06072751563733528, 0.016367963199125524, 0.03570113712273031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 270.75, 114, 1074, 119.5, 929.8000000000002, 1074.0, 1074.0, 0.08634786316022386, 9.732359148421184, 0.04983553430438701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 246.3125, 116, 938, 122.0, 872.2, 938.0, 938.0, 0.08634739716564668, 3.1939893779209707, 0.04991958898638949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 133.9375, 115, 338, 121.5, 188.90000000000015, 338.0, 338.0, 0.0864575115366742, 0.0642521155072354, 0.043397618095557165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 119.75, 117, 122, 120.0, 122.0, 122.0, 122.0, 0.06072567177774404, 0.016248861393654165, 0.03463260968574464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 133.87499999999997, 116, 339, 121.0, 188.50000000000017, 339.0, 339.0, 0.08646031471554558, 0.03936730638293273, 0.048401733799498525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 122.25, 119, 131, 119.5, 131.0, 131.0, 131.0, 0.060721984394450014, 0.04512639660564108, 0.030479589822995416], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 578.8124999999999, 119, 1658, 498.5, 1252.0000000000005, 1658.0, 1658.0, 0.08133676981185789, 0.016020126720145595, 0.05534812296340354], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 143.5, 124, 189, 130.5, 189.0, 189.0, 189.0, 0.05536332179930795, 0.043576989619377164, 0.01967993079584775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ec8c7e6-86eb-44a5-aae8-a6fa0c712985", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1613.041666666667, 844, 5303, 1156.0, 3613.5, 5129.75, 5303.0, 0.11231327917337428, 0.058130896447156605, 0.05165972118228446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 245.25, 237, 254, 245.0, 254.0, 254.0, 254.0, 0.0606134076857801, 0.09393894335677051, 0.13632097451206207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f2d4be0-f5fd-46a0-8f17-4d5201c195c8", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e4968d0-5ec4-423f-b95d-40c51bba28c9", 1, 0, 0.0, 944.0, 944, 944, 944.0, 944.0, 944.0, 944.0, 1.0593220338983051, 0.19138142213983053, 0.7303528866525424], "isController": false}, {"data": ["addBook", 56, 15, 26.785714285714285, 1245.4642857142858, 599, 4245, 961.0, 1977.1000000000001, 3183.3499999999995, 4245.0, 0.26699723467149805, 92.38374371245351, 0.9664914373152474], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/eba7c78f-e56f-4d22-bfe2-a41a10305d9f", 3, 0, 0.0, 874.3333333333334, 242, 1303, 1078.0, 1303.0, 1303.0, 1303.0, 0.10045203415369161, 0.04545192951615604, 0.06441748283944417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59bb7f51-318b-41c8-8e5e-3cc55403b5d6", 3, 0, 0.0, 366.6666666666667, 264, 479, 357.0, 479.0, 479.0, 479.0, 0.06131082544807995, 0.0277415518791768, 0.039317163454660645], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 218.52631578947367, 117, 736, 124.0, 470.0, 492.1, 736.0, 0.24228307163927876, 0.18005607179442493, 0.11711925826312791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d870b9cc-4b3e-4927-97ae-51dddfb1a06a", 1, 0, 0.0, 986.0, 986, 986, 986.0, 986.0, 986.0, 986.0, 1.0141987829614605, 0.18322927231237324, 0.6992425202839757], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 694.6666666666666, 561, 1047, 607.0, 892.4000000000001, 966.6999999999998, 1047.0, 0.24246652260468599, 71.29320829203604, 0.12194361244278641], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 207.77192982456145, 113, 667, 123.0, 361.4, 493.4999999999999, 667.0, 0.24296157370900023, 0.42992809722725434, 0.11815904658894738], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 914.4385964912279, 776, 1401, 844.0, 1129.0, 1163.0, 1401.0, 0.24224497341680162, 217.9724529016804, 0.12159562142210549], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 151.11111111111111, 117, 367, 125.0, 362.5, 367.0, 367.0, 0.0856449540847885, 0.0639828026121711, 0.030444104772327167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 15, 8.875739644970414, 211.91124260355033, 114, 3545, 124.0, 285.0, 438.0, 2708.5000000000136, 0.7046334863513743, 1.642575836700147, 0.33444601710091265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 16, 0, 0.0, 179.625, 118, 372, 127.0, 364.3, 372.0, 372.0, 0.0753146741228194, 0.0583247427533162, 0.026772013067095958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16a3e9b0-e3dc-458b-a5c4-66f9a2012431", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 131.83333333333334, 117, 250, 123.5, 160.90000000000015, 250.0, 250.0, 0.09769971449972319, 0.07928560815358394, 0.034729195388573476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 16, 0, 0.0, 429.81250000000006, 234, 1166, 253.0, 925.9000000000002, 1166.0, 1166.0, 0.0717125402822785, 0.11114043108200777, 0.16128318385750717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 426.3125, 237, 1198, 247.0, 1104.2, 1198.0, 1198.0, 0.08628918742550816, 13.0209983557865, 0.1913066677273046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de29e001-02f5-48bb-a543-2cdd7b591df3", 3, 0, 0.0, 463.0, 224, 853, 312.0, 853.0, 853.0, 853.0, 0.02022599174779537, 0.02390643751179849, 0.012970443926808876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfea79b0-0d73-43d9-901d-8b9caa8b37da", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 127.625, 116, 153, 125.0, 153.0, 153.0, 153.0, 0.0770482803786923, 0.06388084964991188, 0.027388255915863278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8d42b35-ca39-43fb-bb53-30baa50b9ac6", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cccadb5e-a0ef-4232-8179-68b1afdfdad3", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 150.23529411764707, 115, 357, 124.0, 354.6, 357.0, 357.0, 0.08961045806757684, 0.06957061930051131, 0.03185371751620895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bf53450-e0f0-4c70-9aaf-a78f9906b978", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/584cd182-f0ba-4801-b1eb-c401f042529b", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2e0d514-cc2d-4a08-a885-d61c08748eaf", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 219.2222222222222, 113, 1895, 120.0, 311.0000000000025, 1895.0, 1895.0, 0.08481604342581424, 0.06303223539750452, 0.04257367804772316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 213.38888888888883, 113, 365, 123.0, 364.1, 365.0, 365.0, 0.08482043984110303, 0.02977366784786983, 0.04797840200647463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 237.0, 113, 834, 120.0, 420.0000000000007, 834.0, 834.0, 0.08482083953782067, 4.2616995695931426, 0.049460415763481806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 187.66666666666666, 112, 869, 118.5, 415.4000000000007, 869.0, 869.0, 0.08482123923830527, 1.4071619019513597, 0.04954348207680092], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 19.444444444444443, 0.5287009063444109], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.11111111111111, 0.3021148036253776], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.333333333333334, 0.22658610271903323], "isController": false}, {"data": ["401/Unauthorized", 22, 61.111111111111114, 1.661631419939577], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1324, 36, "401/Unauthorized", 22, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
