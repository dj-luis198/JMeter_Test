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

    var data = {"OkPercent": 94.77124183006536, "KoPercent": 5.228758169934641};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7697616060225847, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3017241379310345, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4827586206896552, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.34615384615384615, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1838940f-5ea1-4ff0-8f46-77d70946923f"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1838940f-5ea1-4ff0-8f46-77d70946923f"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d9f42745-058a-48da-8ebc-b669af34172f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.234375, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7719298245614035, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d37f9b6-1537-4bd3-b274-6cfc6f7d3ec5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17f14c81-d11d-48b6-a89e-d5ba090d8865"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d37f9b6-1537-4bd3-b274-6cfc6f7d3ec5"], "isController": false}, {"data": [0.8252688172043011, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9f42745-058a-48da-8ebc-b669af34172f"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50fd0e5e-236c-4d8a-8c9f-04bd400c93a2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/50dfc7d0-7dfa-4e34-95ad-899058e16058"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45cb8f92-604e-4798-9acf-a085f1287a33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f3bec3c-1b0e-4904-b792-af1086712e0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/17f14c81-d11d-48b6-a89e-d5ba090d8865"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d231f6cc-f807-4ce8-8894-1b210e8156c1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f3bec3c-1b0e-4904-b792-af1086712e0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a8d549e-5296-4dac-b3a1-9be324736237"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d231f6cc-f807-4ce8-8894-1b210e8156c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/45cb8f92-604e-4798-9acf-a085f1287a33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50fd0e5e-236c-4d8a-8c9f-04bd400c93a2"], "isController": false}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8035063-e860-4e68-a9aa-09acc818ba3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1377, 72, 5.228758169934641, 309.5700798838052, 0, 5020, 95.0, 890.2, 1032.5999999999995, 1695.9200000000023, 5.388209330171624, 743.2331629769466, 3.8876899703296317], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 2, 3.4482758620689653, 1483.5689655172414, 988, 2533, 1413.0, 1851.2, 1946.9999999999998, 2533.0, 0.2624481891074952, 315.82215783882964, 1.2787544090164527], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 114.75, 84, 273, 91.0, 267.4, 273.0, 273.0, 0.0818753550064221, 0.06356533909189996, 0.029104130099939104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 238.625, 166, 616, 171.5, 533.4000000000001, 616.0, 616.0, 0.25441246621084435, 0.3942896326920019, 0.5721795993003657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 1, 6.666666666666667, 261.3333333333333, 0, 640, 176.0, 554.2, 640.0, 640.0, 0.0742750752654096, 0.11743295591279115, 0.15590995942105054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 17, 0, 0.0, 115.70588235294119, 81, 255, 87.0, 255.0, 255.0, 255.0, 0.10440913641360758, 0.07759311797925329, 0.05240849230136162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 17, 0, 0.0, 127.94117647058823, 80, 349, 83.0, 274.5999999999999, 349.0, 349.0, 0.10441298406166509, 0.027938630500875226, 0.059548029972668365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 17, 0, 0.0, 139.41176470588235, 82, 347, 84.0, 292.59999999999997, 347.0, 347.0, 0.10441298406166509, 0.028142562110370667, 0.061383414458127325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 17, 0, 0.0, 113.17647058823529, 81, 268, 83.0, 249.6, 268.0, 268.0, 0.10441362536391219, 0.02814273496136696, 0.061485757904725644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 88.6, 85, 98, 86.0, 98.0, 98.0, 98.0, 0.035406502050036474, 0.010442151971788098, 0.018256477619550054], "isController": false}, {"data": ["https://demoqa.com/books", 58, 1, 1.7241379310344827, 979.2241379310348, 1, 1837, 979.0, 1249.8, 1318.05, 1837.0, 0.26285496750568765, 309.05471543542154, 0.5100869885658089], "isController": false}, {"data": ["deleteBook", 13, 5, 38.46153846153846, 772.4615384615385, 85, 3225, 396.0, 3009.0, 3225.0, 3225.0, 0.07993605115907275, 0.017954386490807356, 0.049707829889934205], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 5, 38.46153846153846, 772.4615384615385, 85, 3225, 396.0, 3009.0, 3225.0, 3225.0, 0.08050482719329209, 0.01808213892036834, 0.05006152039558834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 11, 50.0, 1123.3181818181818, 0, 5020, 807.0, 3315.7999999999993, 4809.549999999997, 5020.0, 0.08983148430194811, 0.05378006164685611, 0.03500269749655986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 135.7142857142857, 82, 259, 86.5, 258.5, 259.0, 259.0, 0.07892659826361484, 0.03805389559138573, 0.044065882568497014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 117.39999999999999, 82, 249, 85.0, 248.9, 249.0, 249.0, 0.05536730671273227, 0.01492321938741612, 0.03260399018337652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 85.5, 82, 98, 84.0, 94.0, 98.0, 98.0, 0.07892526341306663, 0.05865441939193722, 0.039616782611636966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 116.89999999999999, 82, 248, 85.0, 247.9, 248.0, 248.0, 0.0553670001605643, 0.014923136762027096, 0.03254974032876925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 249.49999999999997, 81, 649, 244.5, 608.5, 649.0, 649.0, 0.07892748818906517, 3.33356324487817, 0.045508832126870305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 225.71428571428572, 81, 1062, 84.0, 979.5, 1062.0, 1062.0, 0.07892615330841522, 10.163647124692048, 0.04543098612590976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 207.0, 83, 805, 84.0, 756.0, 805.0, 805.0, 0.08375165540381384, 9.439737821331546, 0.04833713705434959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1838940f-5ea1-4ff0-8f46-77d70946923f", 3, 0, 0.0, 789.6666666666666, 163, 1677, 529.0, 1677.0, 1677.0, 1677.0, 0.018032313906520485, 0.021419242657842855, 0.011563690884064243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 172.1875, 81, 650, 84.5, 537.3000000000001, 650.0, 650.0, 0.08382229673093043, 3.1005859375, 0.04845976529756915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 115.25, 82, 270, 83.5, 252.50000000000003, 270.0, 270.0, 0.08382141846795402, 0.062293065873157236, 0.042074422941922235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 85.39999999999999, 82, 95, 85.0, 94.2, 95.0, 95.0, 0.05536730671273227, 0.014815080116492813, 0.03157666710960512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 129.0, 81, 326, 83.0, 270.70000000000005, 326.0, 326.0, 0.08371528431803436, 0.03811743292312844, 0.0468650261087043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 102.6, 82, 268, 84.0, 250.00000000000006, 268.0, 268.0, 0.0553670001605643, 0.04114676476776312, 0.027791638752470753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 119.40000000000002, 84, 251, 88.0, 250.5, 251.0, 251.0, 0.05662193533774985, 0.04456765613498669, 0.020127328577090764], "isController": false}, {"data": ["deleteAccount", 12, 5, 41.666666666666664, 345.4166666666667, 78, 810, 397.0, 775.8000000000002, 810.0, 810.0, 0.09197164207702625, 0.03336666506993677, 0.053425584403142365], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 3, 14.285714285714286, 1184.4761904761906, 0, 2541, 1115.0, 2294.0, 2521.4999999999995, 2541.0, 0.09219624629568653, 0.07175821122818571, 0.03634857589726704], "isController": false}, {"data": ["goToProfile", 14, 5, 35.714285714285715, 152.92857142857144, 82, 255, 170.0, 254.0, 255.0, 255.0, 0.08191349934469201, 0.12207602633226455, 0.057835410181847964], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1838940f-5ea1-4ff0-8f46-77d70946923f", 1, 0, 0.0, 1328.0, 1328, 1328, 1328.0, 1328.0, 1328.0, 1328.0, 0.7530120481927711, 0.1360422157379518, 0.5191665097891566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 222.00000000000003, 167, 518, 172.5, 499.30000000000007, 518.0, 518.0, 0.05534126189145365, 0.08576814709153999, 0.12446379505470484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9f42745-058a-48da-8ebc-b669af34172f", 3, 0, 0.0, 346.66666666666663, 166, 696, 178.0, 696.0, 696.0, 696.0, 0.04360528496053721, 0.028033996678730792, 0.027963024535240334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 111.125, 82, 357, 84.0, 277.9000000000001, 357.0, 357.0, 0.25546454631093224, 0.18985207006115182, 0.1282312273474797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 590.2, 86, 746, 651.5, 745.5, 746.0, 746.0, 0.04322940983209697, 11.440958825608238, 0.022809423957306632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 105.125, 81, 259, 83.0, 254.8, 259.0, 259.0, 0.25477707006369427, 0.06817277070063694, 0.14530254777070065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 859.7, 85, 1006, 940.5, 1002.8, 1006.0, 1006.0, 0.043145477922458944, 34.941302094119706, 0.022723004144123156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 134.89999999999998, 82, 257, 86.0, 256.4, 257.0, 257.0, 0.04327561808401528, 0.07007776358097084, 0.022106909980223043], "isController": false}, {"data": ["addBook", 64, 30, 46.875, 870.1250000000003, 420, 2586, 663.5, 1448.0, 1592.25, 2586.0, 0.28698264651809335, 65.52246115645039, 1.010937710192368], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 123.86666666666669, 83, 354, 84.0, 288.6, 354.0, 354.0, 0.06940652791530552, 0.05158043724955811, 0.03483882358248735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 153.9333333333333, 81, 329, 85.0, 280.40000000000003, 329.0, 329.0, 0.06940749138190315, 0.025521712976887306, 0.039195350276473175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 198.40000000000003, 82, 1061, 85.0, 630.2000000000003, 1061.0, 1061.0, 0.06940717022339855, 4.180973159379684, 0.040406179436043604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 161.00000000000003, 81, 493, 85.0, 394.6, 493.0, 493.0, 0.06940813370782876, 1.3780135421052875, 0.040474521720118645], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 165.73684210526318, 82, 462, 88.0, 333.6, 342.29999999999995, 462.0, 0.2697509772557334, 0.2004692321207159, 0.13039720091951956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 109.9, 82, 335, 84.5, 310.5000000000001, 335.0, 335.0, 0.04330747876850853, 0.032184561858237294, 0.022097810211470417], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 546.0877192982455, 401, 1374, 493.0, 688.8, 737.1999999999999, 1374.0, 0.2693558143051565, 79.19955286048786, 0.13546703551480038], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 172.45614035087723, 81, 993, 90.0, 262.20000000000005, 351.29999999999995, 993.0, 0.27012553728917177, 0.4779955796562297, 0.13136964606446047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 426.6315789473683, 82, 985, 87.0, 971.0, 985.0, 985.0, 0.09300686292746443, 35.25145583275408, 0.05131248286715683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 93.81249999999999, 81, 248, 83.0, 135.30000000000013, 248.0, 248.0, 0.2555012615374788, 0.0688655743987736, 0.1502067963335569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d37f9b6-1537-4bd3-b274-6cfc6f7d3ec5", 3, 0, 0.0, 292.0, 178, 398, 300.0, 398.0, 398.0, 398.0, 0.052802027597859756, 0.03394661605005632, 0.0338606752499296], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 825.3333333333331, 566, 1175, 812.0, 984.2, 1054.0999999999997, 1175.0, 0.26907099697885195, 242.11055605793288, 0.1350610277804003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 315.3157894736842, 81, 747, 90.0, 728.0, 747.0, 747.0, 0.09300640765197982, 11.529027636364527, 0.051403058258724245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 1, 6.666666666666667, 105.73333333333332, 1, 257, 88.0, 249.8, 257.0, 257.0, 0.07594167679222356, 0.06317101590978129, 0.025195233394086674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 115.25, 82, 251, 85.0, 248.2, 251.0, 251.0, 0.2548257628846276, 0.06868350640249729, 0.15005853029241256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17f14c81-d11d-48b6-a89e-d5ba090d8865", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["deleteBooks", 13, 5, 38.46153846153846, 547.8461538461538, 85, 1464, 438.0, 1409.6, 1464.0, 1464.0, 0.08072277934738736, 0.018131093017479588, 0.050257691949455126], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d37f9b6-1537-4bd3-b274-6cfc6f7d3ec5", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 29, 15.591397849462366, 162.11827956989245, 0, 2248, 90.0, 279.0, 370.5500000000003, 1617.2499999999968, 0.7787868510632953, 1.6399240002428475, 0.35334165897300623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 17, 0, 0.0, 161.2941176470588, 84, 399, 90.0, 368.59999999999997, 399.0, 399.0, 0.10881950045448145, 0.08427135142617556, 0.03868193180217895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9f42745-058a-48da-8ebc-b669af34172f", 1, 0, 0.0, 1012.0, 1012, 1012, 1012.0, 1012.0, 1012.0, 1012.0, 0.9881422924901185, 0.17852180088932806, 0.6812777915019763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 361.8666666666666, 167, 1148, 328.0, 877.4000000000001, 1148.0, 1148.0, 0.06937924080609428, 5.63380212982706, 0.15485211670282095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 1, 7.142857142857143, 131.07142857142856, 1, 620, 86.0, 439.0, 620.0, 620.0, 0.07738312384616235, 0.06946992214705004, 0.025542476425784055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50fd0e5e-236c-4d8a-8c9f-04bd400c93a2", 3, 0, 0.0, 306.3333333333333, 170, 494, 255.0, 494.0, 494.0, 494.0, 0.018458812236961924, 0.025446962833181562, 0.011837194045187172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 2, 9.523809523809524, 451.95238095238085, 0, 1210, 361.0, 1112.2000000000003, 1206.5, 1210.0, 0.08915872375655423, 0.06764437212091622, 0.036473646432589636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 84.47368421052632, 82, 89, 84.0, 87.0, 89.0, 89.0, 0.09300595238095237, 0.06911868140811012, 0.04668462844122023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 123.78947368421056, 81, 332, 85.0, 253.0, 332.0, 332.0, 0.09300822878066213, 0.08370549372683973, 0.0497548131758394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50dfc7d0-7dfa-4e34-95ad-899058e16058", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2018.5546875, 0.0], "isController": false}, {"data": ["login", 21, 4, 19.047619047619047, 2288.238095238095, 1, 4114, 2274.0, 3963.0, 4104.3, 4114.0, 0.09258646914886581, 47.64658835394484, 0.18413099607609726], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45cb8f92-604e-4798-9acf-a085f1287a33", 1, 0, 0.0, 1464.0, 1464, 1464, 1464.0, 1464.0, 1464.0, 1464.0, 0.6830601092896175, 0.12340441427595629, 0.4709379269125683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f3bec3c-1b0e-4904-b792-af1086712e0a", 3, 0, 0.0, 276.6666666666667, 181, 396, 253.0, 396.0, 396.0, 396.0, 0.042225568989542134, 0.026762103783410984, 0.02707824573873633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17f14c81-d11d-48b6-a89e-d5ba090d8865", 3, 0, 0.0, 318.0, 170, 408, 376.0, 408.0, 408.0, 408.0, 0.026927081463397118, 0.027005969397371914, 0.01726769221448318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 17, 0, 0.0, 266.6470588235294, 164, 601, 175.0, 529.8, 601.0, 601.0, 0.10435593969454401, 0.16173132450707164, 0.2346989542153661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d231f6cc-f807-4ce8-8894-1b210e8156c1", 3, 0, 0.0, 427.33333333333337, 189, 810, 283.0, 810.0, 810.0, 810.0, 0.033507198463136496, 0.033605364083633966, 0.02148736359777959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 1, 6.25, 81.1875, 1, 93, 86.0, 91.6, 93.0, 93.0, 0.2628941358176829, 0.23269596909350818, 0.08760998422635186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 339.3125, 166, 1050, 172.0, 887.6000000000001, 1050.0, 1050.0, 0.08367806954693555, 12.626981879121798, 0.18551771229387737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f3bec3c-1b0e-4904-b792-af1086712e0a", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a8d549e-5296-4dac-b3a1-9be324736237", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 1.075205176767677, 2.009022516835017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d231f6cc-f807-4ce8-8894-1b210e8156c1", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 112.93333333333334, 84, 276, 87.0, 267.0, 276.0, 276.0, 0.06830849939888521, 0.05663468358364603, 0.024281536895697474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 513.6315789473682, 166, 1071, 178.0, 1057.0, 1071.0, 1071.0, 0.09296772552012995, 46.913613907788246, 0.1990711560903646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45cb8f92-604e-4798-9acf-a085f1287a33", 3, 1, 33.333333333333336, 211.0, 78, 385, 170.0, 385.0, 385.0, 385.0, 0.040700592871969504, 0.05886482230799495, 0.016865838126958715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 106.78947368421052, 84, 262, 88.0, 259.0, 262.0, 262.0, 0.0925817643160644, 0.07187744397585079, 0.03290992403422602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50fd0e5e-236c-4d8a-8c9f-04bd400c93a2", 1, 0, 0.0, 1074.0, 1074, 1074, 1074.0, 1074.0, 1074.0, 1074.0, 0.931098696461825, 0.16821607309124767, 0.6419489059590316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, 50.0, 523.0, 1, 1226, 128.0, 1090.0, 1219.35, 1226.0, 0.08389050611142337, 45.18942345201044, 0.10841045579809233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 390.28571428571433, 168, 1146, 331.0, 1063.5, 1146.0, 1146.0, 0.07888746140149211, 13.587198642853924, 0.17453630724975772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8035063-e860-4e68-a9aa-09acc818ba3a", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 1.0202426118210863, 1.9063248801916932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 100.0, 82, 250, 84.0, 193.5, 250.0, 250.0, 0.06935362422224864, 0.051541121126104705, 0.0348122684084334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 120.71428571428572, 81, 247, 83.5, 246.0, 247.0, 247.0, 0.0693532806578654, 0.01855742080103039, 0.03955304287518886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 133.21428571428572, 81, 247, 85.5, 246.5, 247.0, 247.0, 0.0693522499851388, 0.018692598628806945, 0.04077153758891949], "isController": false}, {"data": ["register", 22, 11, 50.0, 1123.3181818181818, 0, 5020, 807.0, 3315.7999999999993, 4809.549999999997, 5020.0, 0.09391595375919949, 0.05622534039197104, 0.036594204638594335], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 155.42857142857144, 82, 503, 85.5, 416.5, 503.0, 503.0, 0.06935190643437081, 0.018692506031139006, 0.04083906208977109], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 9, 12.5, 0.6535947712418301], "isController": false}, {"data": ["406/Not Acceptable", 8, 11.11111111111111, 0.5809731299927379], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com: Try again", 1, 1.3888888888888888, 0.07262164124909223], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 6.944444444444445, 0.36310820624546114], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 10, 13.88888888888889, 0.7262164124909223], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 5.555555555555555, 0.29048656499636893], "isController": false}, {"data": ["401/Unauthorized", 35, 48.611111111111114, 2.541757443718228], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1377, 72, "401/Unauthorized", 35, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 10, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 9, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 5], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 58, 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 11, "406/Not Acceptable", 8, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com: Try again", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 3, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 29, "401/Unauthorized", 25, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50dfc7d0-7dfa-4e34-95ad-899058e16058", 1, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45cb8f92-604e-4798-9acf-a085f1287a33", 3, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 20, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
