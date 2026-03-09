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

    var data = {"OkPercent": 98.68725868725869, "KoPercent": 1.3127413127413128};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.813037723362012, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7770c0db-d45c-4e8f-abf9-1d7588e811c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c3f8c2a4-8da8-41f8-81a3-55d5e3d16353"], "isController": false}, {"data": [0.2631578947368421, 500, 1500, "see books"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab0e73be-10a8-428b-8fda-754ef4cb47aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=773b741a-9c83-41ee-951a-4fa9155207a1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a285db6d-fc09-472b-a231-400200e95d2f"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67aec0d1-5d54-4974-9ae2-b9660628924d"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/34360e9b-acfa-44b6-8c14-9e8bb989a549"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d46541ac-c819-4e37-85f7-a9606470290e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f43283c9-1551-417c-83a4-6ea68b190ff0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=770e5793-2f15-409e-bcc3-b0297a72374a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd82d0e9-8a65-4578-a65b-823cbfcf1288"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e92a51e1-239b-45bd-9142-f6a594307455"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=070e7822-e527-4f29-b336-67521827a536"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ab0aaad-5482-4658-8dd6-8d744314a0de"], "isController": false}, {"data": [0.375, 500, 1500, "register"], "isController": true}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e92a51e1-239b-45bd-9142-f6a594307455"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/070e7822-e527-4f29-b336-67521827a536"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/773b741a-9c83-41ee-951a-4fa9155207a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7770c0db-d45c-4e8f-abf9-1d7588e811c9"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab0e73be-10a8-428b-8fda-754ef4cb47aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d46541ac-c819-4e37-85f7-a9606470290e"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/770e5793-2f15-409e-bcc3-b0297a72374a"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/83413d7c-b010-4b5b-bc61-0cfd07c54ddd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9733727810650887, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67aec0d1-5d54-4974-9ae2-b9660628924d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db3675f6-28cf-4129-901f-f774b54981bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a285db6d-fc09-472b-a231-400200e95d2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71f8754a-3fe9-4c9c-9792-e3779d4c1c78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34360e9b-acfa-44b6-8c14-9e8bb989a549"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ab0aaad-5482-4658-8dd6-8d744314a0de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34e985a8-cc78-4344-9f75-a99ebcfaa6a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd82d0e9-8a65-4578-a65b-823cbfcf1288"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1295, 17, 1.3127413127413128, 322.27567567567536, 98, 1818, 123.0, 807.0, 983.2, 1325.2399999999998, 5.152403725645443, 755.3906355683956, 3.7517416094398404], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7770c0db-d45c-4e8f-abf9-1d7588e811c9", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3f8c2a4-8da8-41f8-81a3-55d5e3d16353", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.7341056034482759, 1.3716774425287357], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1466.421052631579, 1205, 2177, 1431.0, 1720.2, 1838.3999999999999, 2177.0, 0.24565365420584914, 295.6055158874885, 1.2078770985609868], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 458.99999999999994, 104, 1071, 442.5, 835.0, 1071.0, 1071.0, 0.0789729010131095, 0.015556603826801145, 0.053137039841828555], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 458.99999999999994, 104, 1071, 442.5, 835.0, 1071.0, 1071.0, 0.07935518246023739, 0.01563190815204453, 0.05339425851084332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 157.22222222222226, 99, 332, 101.5, 301.40000000000003, 332.0, 332.0, 0.10669638358535413, 0.0463555034587411, 0.059854633586836035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab0e73be-10a8-428b-8fda-754ef4cb47aa", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 114.05555555555556, 100, 308, 103.0, 128.00000000000028, 308.0, 308.0, 0.10669575113808802, 0.07929244786727048, 0.05355626570798558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 226.88888888888889, 98, 698, 103.0, 686.3000000000001, 698.0, 698.0, 0.10669448626604863, 3.511309059843752, 0.061810097892191156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 188.7222222222222, 99, 893, 102.0, 705.8000000000003, 893.0, 893.0, 0.10669511869831955, 10.692724078272724, 0.06170626982010017], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 320.1333333333334, 101, 1523, 232.0, 851.6000000000004, 1523.0, 1523.0, 0.07429346910877554, 0.12632308155689395, 0.048019893314578364], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 127.23529411764706, 100, 344, 102.0, 307.99999999999994, 344.0, 344.0, 0.1121261088942387, 0.0833280945981598, 0.05628205075355341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 124.58823529411765, 99, 303, 102.0, 296.6, 303.0, 303.0, 0.11212832757301533, 0.06962932106297655, 0.06173241563992296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 543.75, 490, 687, 499.0, 687.0, 687.0, 687.0, 0.03770099342117665, 11.085343856623123, 0.02150134781051481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 839.75, 703, 891, 882.5, 891.0, 891.0, 891.0, 0.037561506967659544, 33.79790999558652, 0.02138511578334523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 250.25, 99, 303, 299.5, 303.0, 303.0, 303.0, 0.03784044576045106, 0.06695985128704816, 0.020952668697437258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 145.0666666666667, 100, 305, 102.0, 301.4, 305.0, 305.0, 0.08298525628613317, 0.06167166018920638, 0.041654708721750436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 166.86666666666667, 100, 301, 103.0, 299.2, 301.0, 301.0, 0.08289582757667864, 0.030481486598507877, 0.04681239638021553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=773b741a-9c83-41ee-951a-4fa9155207a1", 1, 0, 0.0, 676.0, 676, 676, 676.0, 676.0, 676.0, 676.0, 1.4792899408284024, 0.2672545303254438, 1.0199010724852071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 178.5333333333333, 99, 880, 101.0, 530.8000000000002, 880.0, 880.0, 0.08298709274084237, 4.999005235448213, 0.04831188693285238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 153.13333333333333, 98, 495, 102.0, 376.20000000000005, 495.0, 495.0, 0.08289628569375901, 1.645804290849908, 0.048339975973893196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 101.25, 100, 103, 101.0, 103.0, 103.0, 103.0, 0.03783972982432905, 0.028121127340150792, 0.02124789516502852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a285db6d-fc09-472b-a231-400200e95d2f", 3, 0, 0.0, 437.33333333333337, 251, 764, 297.0, 764.0, 764.0, 764.0, 0.03689946126786549, 0.030761562599936038, 0.02366274046148926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 310.4117647058824, 99, 907, 101.0, 899.8, 907.0, 907.0, 0.11198503352963651, 23.732335596089744, 0.06357054810086557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 480.27777777777777, 100, 898, 685.5, 886.3000000000001, 898.0, 898.0, 0.1088665779605661, 54.434340317678725, 0.058804017479133906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 228.41176470588235, 98, 697, 102.0, 686.6, 697.0, 697.0, 0.11213128594797109, 7.780834248522505, 0.06376307442549206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 429.3333333333333, 99, 788, 512.0, 719.6000000000001, 788.0, 788.0, 0.10886723640520386, 17.796698185243653, 0.05891068879695656], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 497.57142857142867, 103, 1570, 380.0, 1373.0, 1570.0, 1570.0, 0.07979253939756632, 0.01571806161123935, 0.05420059630674531], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67aec0d1-5d54-4974-9ae2-b9660628924d", 1, 0, 0.0, 631.0, 631, 631, 631.0, 631.0, 631.0, 631.0, 1.5847860538827259, 0.28631388668779717, 1.0926356973058637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 351.8, 203, 982, 210.0, 755.2000000000002, 982.0, 982.0, 0.08284866862189524, 6.727560006600277, 0.18491542359143456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 546.5, 226, 955, 474.0, 945.5, 953.8, 955.0, 0.09223854564969478, 0.0566582472789629, 0.041705514292781916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 114.55555555555556, 99, 298, 102.0, 144.10000000000025, 298.0, 298.0, 0.10887184574069146, 0.0809096431725256, 0.05464856319405802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 202.94444444444446, 100, 309, 203.0, 306.3, 309.0, 309.0, 0.1088698702634046, 0.11997421900988901, 0.05701019898992953], "isController": false}, {"data": ["login", 22, 0, 0.0, 2207.6363636363635, 1418, 2966, 2193.5, 2892.8, 2957.0, 2966.0, 0.09163306787511245, 20.059474286511612, 0.16588155957398953], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/34360e9b-acfa-44b6-8c14-9e8bb989a549", 3, 0, 0.0, 976.3333333333334, 581, 1523, 825.0, 1523.0, 1523.0, 1523.0, 0.05912961210974456, 0.026754609646010723, 0.03791840359902239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d46541ac-c819-4e37-85f7-a9606470290e", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 0.9765625, 3.7267736486486487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f43283c9-1551-417c-83a4-6ea68b190ff0", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 118.94117647058822, 102, 308, 105.0, 161.59999999999985, 308.0, 308.0, 0.10400543275436976, 0.08419971069665286, 0.03697068117440487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=770e5793-2f15-409e-bcc3-b0297a72374a", 1, 0, 0.0, 1570.0, 1570, 1570, 1570.0, 1570.0, 1570.0, 1570.0, 0.6369426751592356, 0.11507265127388534, 0.4391421178343949], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd82d0e9-8a65-4578-a65b-823cbfcf1288", 3, 0, 0.0, 390.3333333333333, 249, 599, 323.0, 599.0, 599.0, 599.0, 0.08946144211844695, 0.04047897283354208, 0.057369479483509275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 603.7777777777778, 204, 999, 798.5, 988.2, 999.0, 999.0, 0.10879814317835641, 72.38627571867218, 0.2292245601230628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e92a51e1-239b-45bd-9142-f6a594307455", 3, 0, 0.0, 563.6666666666666, 383, 904, 404.0, 904.0, 904.0, 904.0, 0.027624055027117612, 0.027704984875829872, 0.01771464466257217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=070e7822-e527-4f29-b336-67521827a536", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 377.94444444444446, 201, 993, 303.5, 825.6000000000003, 993.0, 993.0, 0.106630017534714, 14.320957463508838, 0.23678204306075543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 522.75, 101, 992, 457.5, 992.0, 992.0, 992.0, 0.07505183267193906, 44.90408317150282, 0.10948112798213766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ab0aaad-5482-4658-8dd6-8d744314a0de", 1, 0, 0.0, 1176.0, 1176, 1176, 1176.0, 1176.0, 1176.0, 1176.0, 0.8503401360544217, 0.15362590348639457, 0.5862696641156463], "isController": false}, {"data": ["register", 24, 6, 25.0, 832.4166666666666, 213, 1435, 864.0, 1158.5, 1378.75, 1435.0, 0.1007214171503393, 0.03177052513628867, 0.04544267062837574], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 451.82352941176475, 200, 1234, 207.0, 1053.1999999999998, 1234.0, 1234.0, 0.11190689346463742, 31.63369638960385, 0.2449441843797725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 105.24999999999999, 100, 121, 104.0, 110.7, 120.5, 121.0, 0.11683676151864422, 0.09070822793683804, 0.04153181757108056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e92a51e1-239b-45bd-9142-f6a594307455", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/070e7822-e527-4f29-b336-67521827a536", 3, 0, 0.0, 267.0, 179, 401, 221.0, 401.0, 401.0, 401.0, 0.03196011377800505, 0.025977996127499545, 0.02049525525477537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/773b741a-9c83-41ee-951a-4fa9155207a1", 3, 0, 0.0, 291.0, 180, 392, 301.0, 392.0, 392.0, 392.0, 0.04858693011579885, 0.031236714511296462, 0.031157634221394444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 11, 0, 0.0, 293.81818181818176, 202, 407, 206.0, 406.4, 407.0, 407.0, 0.07878414576499405, 0.12210003840727104, 0.17718739032888797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 101.66666666666667, 99, 104, 102.0, 104.0, 104.0, 104.0, 0.0455763124711983, 0.03387067752986515, 0.02287717247089446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 145.44444444444443, 98, 301, 101.0, 301.0, 301.0, 301.0, 0.0455767740759309, 0.0121953477507862, 0.025993003965179347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 123.99999999999999, 99, 297, 101.0, 297.0, 297.0, 297.0, 0.045576081672338356, 0.012284178263247448, 0.02679375113940204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 167.44444444444446, 98, 298, 104.0, 298.0, 298.0, 298.0, 0.045576543272395804, 0.012284302678887932, 0.026838530852787767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 104.0, 103, 105, 104.0, 105.0, 105.0, 105.0, 0.07621951219512195, 0.022478801448170733, 0.04711616330030488], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 959.0350877192982, 784, 1745, 815.0, 1290.6, 1393.3999999999999, 1745.0, 0.24371264141746693, 291.5650473582832, 0.4812372665489435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7770c0db-d45c-4e8f-abf9-1d7588e811c9", 3, 0, 0.0, 262.3333333333333, 192, 363, 232.0, 363.0, 363.0, 363.0, 0.07842317143305275, 0.03548444280336697, 0.05029090095153448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 832.4166666666666, 213, 1435, 864.0, 1158.5, 1378.75, 1435.0, 0.09750310791156469, 0.030755374858823625, 0.04399066001478797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 101.4, 100, 102, 102.0, 102.0, 102.0, 102.0, 0.02425783164094528, 0.0065382436844735325, 0.014284641093251957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 101.4, 101, 103, 101.0, 103.0, 103.0, 103.0, 0.02425783164094528, 0.0065382436844735325, 0.014260951804540095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 169.95, 99, 685, 102.0, 302.9, 665.8999999999997, 685.0, 0.11464997363050605, 5.18746905346415, 0.06690900804842816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 199.7, 99, 686, 102.5, 303.9, 666.8999999999997, 686.0, 0.11478354692638358, 1.716899563679042, 0.06709905389661446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 101.0, 98, 103, 101.0, 103.0, 103.0, 103.0, 0.02425783164094528, 0.006490865107049811, 0.013834544607726604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 111.6, 100, 297, 102.0, 103.9, 287.34999999999985, 297.0, 0.11478157067101306, 0.08530153836000091, 0.057614968090723355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 102.8, 101, 105, 103.0, 105.0, 105.0, 105.0, 0.02425724321282335, 0.018027111411092353, 0.01217599903456172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 111.15, 98, 304, 100.5, 104.0, 293.9999999999999, 304.0, 0.11478288816703205, 0.039333315876769095, 0.06498011745159032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 107.6, 104, 116, 105.0, 116.0, 116.0, 116.0, 0.02296042541076201, 0.018072366094799005, 0.00816171372023181], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 405.6428571428571, 103, 764, 387.5, 681.5, 764.0, 764.0, 0.0790134605073793, 0.015255947173857832, 0.053770599937917996], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1194.7272727272727, 811, 1818, 1163.0, 1682.6999999999998, 1807.6499999999999, 1818.0, 0.09150158256146203, 0.04735921753669422, 0.04208715369770373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 206.4, 204, 210, 206.0, 210.0, 210.0, 210.0, 0.024245127941540146, 0.037575212932836145, 0.05452786098570992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab0e73be-10a8-428b-8fda-754ef4cb47aa", 3, 0, 0.0, 333.3333333333333, 239, 391, 370.0, 391.0, 391.0, 391.0, 0.02249600695876482, 0.022561913229151825, 0.014426150295822492], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d46541ac-c819-4e37-85f7-a9606470290e", 3, 0, 0.0, 391.0, 291, 449, 433.0, 449.0, 449.0, 449.0, 0.06836516111389636, 0.03093345506130076, 0.04384093990702338], "isController": false}, {"data": ["addBook", 56, 3, 5.357142857142857, 999.1249999999999, 521, 1741, 957.5, 1465.1000000000004, 1575.9499999999998, 1741.0, 0.27107879679739766, 105.29749631048446, 0.9815828278843268], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/770e5793-2f15-409e-bcc3-b0297a72374a", 3, 0, 0.0, 294.0, 182, 405, 295.0, 405.0, 405.0, 405.0, 0.02162988384752374, 0.025565790446080303, 0.013870726295449793], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 192.3684210526315, 100, 698, 104.0, 402.2, 412.29999999999995, 698.0, 0.24445578566802903, 0.18167075477868175, 0.11816954482976014], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 575.1403508771931, 488, 817, 498.0, 790.6, 800.0, 817.0, 0.24470555910927175, 71.9515593673932, 0.12306969037233884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83413d7c-b010-4b5b-bc61-0cfd07c54ddd", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.5496315619621343, 1.0269874139414803], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 158.1052631578948, 99, 407, 103.0, 306.0, 313.4, 407.0, 0.24511911929130473, 0.4337459415584416, 0.11920832168659155], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 761.3333333333331, 680, 1011, 703.0, 905.0, 990.0999999999999, 1011.0, 0.24447990117865046, 219.983444830376, 0.12271745039631479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 11, 0, 0.0, 122.72727272727272, 102, 264, 105.0, 239.60000000000008, 264.0, 264.0, 0.0796587707927496, 0.05951070278950532, 0.02831620368023521], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 3, 1.7751479289940828, 165.4615384615386, 100, 795, 107.0, 301.0, 358.0, 719.4000000000012, 0.6978453508634288, 1.5706077100039642, 0.3336073055943247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 106.8888888888889, 102, 119, 105.0, 119.0, 119.0, 119.0, 0.04450752424423751, 0.03446725266179722, 0.015821034008693804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67aec0d1-5d54-4974-9ae2-b9660628924d", 3, 0, 0.0, 326.3333333333333, 266, 379, 334.0, 379.0, 379.0, 379.0, 0.050199123188648304, 0.03227319931561862, 0.03219149501355376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db3675f6-28cf-4129-901f-f774b54981bb", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a285db6d-fc09-472b-a231-400200e95d2f", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 119.3888888888889, 100, 303, 104.5, 157.20000000000022, 303.0, 303.0, 0.11479591836734693, 0.09315957828443877, 0.040806361607142856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71f8754a-3fe9-4c9c-9792-e3779d4c1c78", 2, 0, 0.0, 256.5, 198, 315, 256.5, 315.0, 315.0, 315.0, 0.011755232547887878, 0.023234951832934635, 0.0073068413249322605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34360e9b-acfa-44b6-8c14-9e8bb989a549", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.5298066348973607, 2.021856671554252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 271.22222222222223, 201, 405, 207.0, 405.0, 405.0, 405.0, 0.04555232190307478, 0.07059720201189422, 0.10244823959255979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 323.75000000000006, 202, 789, 207.5, 581.5000000000005, 779.5999999999999, 789.0, 0.11458297526153564, 7.022755865574118, 0.2562339404798735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ab0aaad-5482-4658-8dd6-8d744314a0de", 3, 0, 0.0, 278.6666666666667, 185, 379, 272.0, 379.0, 379.0, 379.0, 0.019355712838644328, 0.0228777973037492, 0.012412354912802515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34e985a8-cc78-4344-9f75-a99ebcfaa6a5", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 1.6128077651515151, 3.013533775252525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 122.13333333333334, 102, 307, 105.0, 217.60000000000005, 307.0, 307.0, 0.0821908800999441, 0.06814458711411381, 0.029216289410527008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 119.0, 102, 299, 105.5, 148.70000000000024, 299.0, 299.0, 0.11340225670490843, 0.08804179109414277, 0.04031095843807292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd82d0e9-8a65-4578-a65b-823cbfcf1288", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 11, 0, 0.0, 101.27272727272728, 99, 103, 101.0, 103.0, 103.0, 103.0, 0.07884174311926606, 0.058592350111095176, 0.03957485933916284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 11, 0, 0.0, 136.63636363636363, 99, 303, 101.0, 301.6, 303.0, 303.0, 0.07884287332100519, 0.021096628212847086, 0.044965076190885765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 11, 0, 0.0, 154.45454545454547, 98, 301, 101.0, 300.6, 301.0, 301.0, 0.0788440035551478, 0.02125092283322343, 0.04635165052753806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 11, 0, 0.0, 154.90909090909093, 98, 303, 101.0, 302.8, 303.0, 303.0, 0.07884456868437086, 0.021251075153209335, 0.04642897941081604], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 35.294117647058826, 0.46332046332046334], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.764705882352942, 0.15444015444015444], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 11.764705882352942, 0.15444015444015444], "isController": false}, {"data": ["401/Unauthorized", 7, 41.1764705882353, 0.5405405405405406], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1295, 17, "401/Unauthorized", 7, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
