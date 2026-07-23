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

    var data = {"OkPercent": 97.6, "KoPercent": 2.4};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7167808219178082, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/188e16ff-0d27-4671-bde6-908157bd27ae"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bc5c489f-740c-4577-9e57-9a9ab0059770"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4e05494-b1f2-490f-8739-6ce8205c2582"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ee63e35-d17e-4a8a-ba15-7509496c6d0b"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fef9fdbe-f75e-40eb-b581-11e3c0ae1d52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=506fa0f1-d5dd-46b7-8f63-f3cae297be3b"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6c439417-87ca-4103-b97f-1f8c5e4153f0"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29124cef-e7c8-452b-83f9-043ad120534e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14192397-c648-40ca-aaa4-4c8561b94df5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9308a0e6-4022-48a5-a2c6-0b0c9effede8"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a524435-0bac-4ccd-bcf5-b959febb2fc3"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a715772-2d07-404d-a762-8c10895c5dc0"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16919833-707c-4a97-a226-0831bf9d429b"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f6c5287-47e7-4a96-8fd1-59d164aa4e27"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/506fa0f1-d5dd-46b7-8f63-f3cae297be3b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fef9fdbe-f75e-40eb-b581-11e3c0ae1d52"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/310aca44-402a-4f7d-bd39-275fd6906321"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ee63e35-d17e-4a8a-ba15-7509496c6d0b"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=188e16ff-0d27-4671-bde6-908157bd27ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca677b68-4550-4205-9200-d0030a891af4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95084d16-44de-441e-82e9-86ba924714d4"], "isController": false}, {"data": [0.22641509433962265, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9006211180124224, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9308a0e6-4022-48a5-a2c6-0b0c9effede8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d4e05494-b1f2-490f-8739-6ce8205c2582"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/14192397-c648-40ca-aaa4-4c8561b94df5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29124cef-e7c8-452b-83f9-043ad120534e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca677b68-4550-4205-9200-d0030a891af4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a715772-2d07-404d-a762-8c10895c5dc0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=310aca44-402a-4f7d-bd39-275fd6906321"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1250, 30, 2.4, 495.6591999999995, 140, 4213, 162.0, 1329.9, 1612.1500000000003, 2259.0, 5.00757144802942, 731.7346640620618, 3.6477575969866436], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/188e16ff-0d27-4671-bde6-908157bd27ae", 3, 0, 0.0, 504.6666666666667, 347, 736, 431.0, 736.0, 736.0, 736.0, 0.017425144483489675, 0.024021968387883716, 0.011174327679842012], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2328.9636363636373, 1724, 3192, 2291.0, 2857.0, 2996.7999999999993, 3192.0, 0.25243948337112276, 303.76883453136907, 1.2412429675523469], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bc5c489f-740c-4577-9e57-9a9ab0059770", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.5733140709156194, 1.0712382181328546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4e05494-b1f2-490f-8739-6ce8205c2582", 1, 0, 0.0, 888.0, 888, 888, 888.0, 888.0, 888.0, 888.0, 1.1261261261261262, 0.20345052083333334, 0.7764111768018018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ee63e35-d17e-4a8a-ba15-7509496c6d0b", 3, 0, 0.0, 399.6666666666667, 268, 508, 423.0, 508.0, 508.0, 508.0, 0.03434262492129815, 0.028630033340965026, 0.022023102569973096], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 552.7142857142856, 146, 1257, 522.5, 1052.0, 1257.0, 1257.0, 0.1012467817987214, 0.020770562588590932, 0.06777799699514014], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 552.7142857142856, 146, 1257, 522.5, 1052.0, 1257.0, 1257.0, 0.10196278358399184, 0.020917448836531807, 0.06825731264338517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fef9fdbe-f75e-40eb-b581-11e3c0ae1d52", 3, 0, 0.0, 554.3333333333333, 249, 1135, 279.0, 1135.0, 1135.0, 1135.0, 0.07208419433898794, 0.03261622074583113, 0.04622586681243692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 196.93749999999997, 140, 441, 142.5, 434.0, 441.0, 441.0, 0.09120602871849828, 0.04152813563476546, 0.05105845308874917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 181.4375, 142, 447, 143.5, 431.6, 447.0, 447.0, 0.09120550881273229, 0.06778065645164968, 0.04578089016576601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 287.8125, 140, 1121, 143.0, 960.7000000000002, 1121.0, 1121.0, 0.09120550881273229, 3.3736908803041703, 0.052728184782360854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 359.0625, 142, 1620, 148.0, 1365.9000000000003, 1620.0, 1620.0, 0.0910575768440582, 10.263195967998954, 0.05255373819808438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=506fa0f1-d5dd-46b7-8f63-f3cae297be3b", 1, 0, 0.0, 733.0, 733, 733, 733.0, 733.0, 733.0, 733.0, 1.364256480218281, 0.24647211800818555, 0.9405908935879945], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 256.4285714285714, 142, 431, 247.0, 427.0, 431.0, 431.0, 0.10093727469358327, 0.15427856885364097, 0.06523324846791637], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 162.5625, 142, 427, 144.5, 233.80000000000018, 427.0, 427.0, 0.08244108039035852, 0.06126724821978792, 0.04138155793031668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1022.0, 843, 1172, 1124.0, 1172.0, 1172.0, 1172.0, 0.02795435612731532, 8.219508873411494, 0.01594271872885952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 214.75, 141, 429, 143.5, 426.2, 429.0, 429.0, 0.08244490361675487, 0.029799726514796284, 0.046586603862543735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c439417-87ca-4103-b97f-1f8c5e4153f0", 1, 0, 0.0, 693.0, 693, 693, 693.0, 693.0, 693.0, 693.0, 1.443001443001443, 0.46080221861471865, 0.8610096500721501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1302.4, 1172, 1547, 1265.0, 1547.0, 1547.0, 1547.0, 0.02793249275151813, 25.133706077900932, 0.01590297194739753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 418.2, 143, 566, 459.0, 566.0, 566.0, 566.0, 0.02806355834694416, 0.04965934348111603, 0.0155390992018724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29124cef-e7c8-452b-83f9-043ad120534e", 3, 0, 0.0, 339.3333333333333, 248, 495, 275.0, 495.0, 495.0, 495.0, 0.03976353948519471, 0.025564124506269385, 0.02549940520372187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14192397-c648-40ca-aaa4-4c8561b94df5", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 147.8888888888889, 143, 159, 146.0, 159.0, 159.0, 159.0, 0.04726468750164113, 0.0351254171765126, 0.02372465759359721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 175.77777777777777, 142, 433, 143.0, 433.0, 433.0, 433.0, 0.047265680389469204, 0.020535132842820606, 0.026515144055290343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 315.22222222222223, 142, 1685, 144.0, 1685.0, 1685.0, 1685.0, 0.047264439286201936, 4.736726610995284, 0.027335011002111144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 226.55555555555554, 143, 886, 144.0, 886.0, 886.0, 886.0, 0.047265183940340835, 1.5554943314602316, 0.027381599073077228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 201.2, 143, 426, 145.0, 426.0, 426.0, 426.0, 0.02810852137934136, 0.020889242939139428, 0.01578359354797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 267.5625, 141, 1550, 143.0, 763.9000000000008, 1550.0, 1550.0, 0.0824427795583128, 4.657216971683481, 0.04802452930325546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 794.3888888888888, 140, 1683, 706.5, 1565.1000000000001, 1683.0, 1683.0, 0.09224950415891514, 41.51556506184561, 0.05026877277409634], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9308a0e6-4022-48a5-a2c6-0b0c9effede8", 3, 0, 0.0, 1633.6666666666667, 282, 4213, 406.0, 4213.0, 4213.0, 4213.0, 0.059393003504187206, 0.027569799152659814, 0.038087310189859634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 287.6875, 140, 838, 144.0, 667.9000000000002, 838.0, 838.0, 0.08244490361675487, 1.535928828792852, 0.048106279209971715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 610.5, 141, 1177, 491.5, 1174.3, 1177.0, 1177.0, 0.09224997693750576, 13.574710229369316, 0.05035911826959543], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 514.5714285714284, 143, 1028, 490.5, 967.5, 1028.0, 1028.0, 0.1022300760883852, 0.020972283327004806, 0.0689211555102011], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1a524435-0bac-4ccd-bcf5-b959febb2fc3", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.0334496359223302, 1.931002224919094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 465.3333333333333, 286, 1845, 293.0, 1845.0, 1845.0, 1845.0, 0.0472282277869902, 6.34299287247329, 0.10487474844409228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a715772-2d07-404d-a762-8c10895c5dc0", 3, 0, 0.0, 698.0, 296, 1429, 369.0, 1429.0, 1429.0, 1429.0, 0.03676740936833591, 0.02363790153074981, 0.02357805874206437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 638.2272727272725, 179, 1316, 512.5, 1242.1, 1307.75, 1316.0, 0.10133578995854445, 0.06224630066789498, 0.04581881909258406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 146.72222222222223, 142, 151, 147.5, 151.0, 151.0, 151.0, 0.09224950415891514, 0.06855651627435003, 0.04630492689226796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 249.2777777777778, 141, 572, 146.0, 461.3000000000002, 572.0, 572.0, 0.09224761309301122, 0.09395923872657294, 0.04873628777667877], "isController": false}, {"data": ["login", 22, 0, 0.0, 3100.545454545455, 1702, 6994, 2829.5, 5192.199999999999, 6766.749999999996, 6994.0, 0.10140304946625123, 27.71099846426234, 0.19121100591825071], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 152.5625, 144, 173, 151.5, 168.1, 173.0, 173.0, 0.08363126973175271, 0.06770539317150683, 0.029728302912458968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16919833-707c-4a97-a226-0831bf9d429b", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.0539139851485149, 1.969239892739274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 943.3333333333334, 289, 1827, 853.5, 1714.5000000000002, 1827.0, 1827.0, 0.09217958631850096, 55.210846200600706, 0.1955215444177579], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 762.0, 141, 1694, 151.0, 1693.2, 1694.0, 1694.0, 0.05145909937219899, 27.990680055388705, 0.07134102412963951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 580.125, 286, 2068, 297.5, 1600.4000000000005, 2068.0, 2068.0, 0.09098353198071149, 13.729372771614276, 0.20171422214766627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f6c5287-47e7-4a96-8fd1-59d164aa4e27", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.1323969414893618, 2.115885416666667], "isController": false}, {"data": ["register", 24, 6, 25.0, 1303.7083333333333, 453, 2344, 1333.0, 1982.0, 2282.75, 2344.0, 0.0997120813650584, 0.03145215066495494, 0.04498728670962595], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/506fa0f1-d5dd-46b7-8f63-f3cae297be3b", 3, 0, 0.0, 432.3333333333333, 246, 633, 418.0, 633.0, 633.0, 633.0, 0.019805117642398798, 0.02340897856756186, 0.012700547446460165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fef9fdbe-f75e-40eb-b581-11e3c0ae1d52", 1, 0, 0.0, 907.0, 907, 907, 907.0, 907.0, 907.0, 907.0, 1.1025358324145536, 0.1991886025358324, 0.7601467750826901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 549.75, 286, 1696, 567.0, 1117.1000000000006, 1696.0, 1696.0, 0.08237826037708648, 6.279255746205451, 0.18395331019019082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 192.92857142857142, 144, 436, 151.5, 433.5, 436.0, 436.0, 0.07592561459073381, 0.05894615585901698, 0.026989183311549914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/310aca44-402a-4f7d-bd39-275fd6906321", 3, 0, 0.0, 348.0, 239, 503, 302.0, 503.0, 503.0, 503.0, 0.0304989630352568, 0.025425730577243705, 0.019558254290187465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 617.9444444444445, 287, 1824, 567.5, 1767.3000000000002, 1824.0, 1824.0, 0.08191610880279607, 11.001752947842194, 0.18190247033954227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 145.8, 141, 155, 144.0, 154.6, 155.0, 155.0, 0.05373541755106208, 0.03993423120738109, 0.026972660762935457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 173.6, 140, 443, 143.5, 413.6000000000001, 443.0, 443.0, 0.053649795594278786, 0.022413459526594202, 0.030146574594675794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ee63e35-d17e-4a8a-ba15-7509496c6d0b", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 298.0, 141, 1394, 148.0, 1296.6000000000004, 1394.0, 1394.0, 0.05337717378540241, 4.8158356146515, 0.030921229970215538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 296.90000000000003, 142, 1115, 144.0, 1045.9, 1115.0, 1115.0, 0.0534570686281847, 1.5847828273176312, 0.03101971697155015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 143.33333333333334, 143, 144, 143.0, 144.0, 144.0, 144.0, 0.02524784972479844, 0.007446143180555789, 0.01560731335527091], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1602.4727272727278, 1126, 2586, 1471.0, 2259.0, 2376.399999999999, 2586.0, 0.2560247273336654, 306.2945824876759, 0.5055488268248745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1303.7083333333333, 453, 2344, 1333.0, 1982.0, 2282.75, 2344.0, 0.09618351815263523, 0.030339137073536308, 0.043395298229020975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=188e16ff-0d27-4671-bde6-908157bd27ae", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.26490331744868034, 1.010928335777126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 184.85714285714283, 142, 431, 143.0, 431.0, 431.0, 431.0, 0.03715597547705619, 0.010014696515300299, 0.021879934777993045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 144.14285714285714, 141, 149, 143.0, 149.0, 149.0, 149.0, 0.03721207159602575, 0.010029816172366316, 0.02187662802813233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 225.14285714285714, 141, 444, 145.5, 434.5, 444.0, 444.0, 0.0787516734730613, 0.021226036990786054, 0.04629737053787393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 162.00000000000003, 140, 422, 142.5, 283.0, 422.0, 422.0, 0.07875433148823185, 0.021226753408937492, 0.04637584168691778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca677b68-4550-4205-9200-d0030a891af4", 1, 0, 0.0, 1028.0, 1028, 1028, 1028.0, 1028.0, 1028.0, 1028.0, 0.9727626459143969, 0.17574325145914396, 0.6706742461089494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 185.0, 140, 428, 143.0, 428.0, 428.0, 428.0, 0.037156567157841096, 0.0099422845715317, 0.02119085470720625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 167.0, 141, 422, 146.5, 292.0, 422.0, 422.0, 0.07874768678670065, 0.05852245082488202, 0.0395276474691056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 187.0, 144, 428, 146.0, 428.0, 428.0, 428.0, 0.0372110825235493, 0.027653939258223646, 0.018678219157328455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 205.35714285714286, 141, 441, 145.0, 434.0, 441.0, 441.0, 0.07875388847324337, 0.021072817814129573, 0.04491432701989661], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 237.85714285714283, 145, 452, 154.0, 452.0, 452.0, 452.0, 0.03709021930916818, 0.02919405933905229, 0.013184413895055872], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 888.7142857142857, 141, 4213, 570.5, 2821.0, 4213.0, 4213.0, 0.10358783878772633, 0.020643865472693503, 0.07048684203224541], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1819.9545454545455, 1158, 4102, 1473.5, 3535.8999999999987, 4083.5499999999997, 4102.0, 0.10352892456976674, 0.053584306662086294, 0.04761926120347669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 374.8571428571429, 287, 860, 297.0, 860.0, 860.0, 860.0, 0.03712582472367779, 0.05753777718405923, 0.08349684994006831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95084d16-44de-441e-82e9-86ba924714d4", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 0.9765625, 1.8247085244648318], "isController": false}, {"data": ["addBook", 53, 12, 22.641509433962263, 1496.3018867924525, 729, 4280, 1184.0, 2461.6, 3015.2999999999984, 4280.0, 0.2516690883880833, 91.92647957236436, 0.9105197678946219], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 262.0727272727274, 142, 856, 151.0, 573.4, 578.5999999999999, 856.0, 0.25753042370778256, 0.191387355900022, 0.12448980442905505], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 907.4909090909093, 700, 1270, 841.0, 1133.4, 1219.9999999999998, 1270.0, 0.2574207378146383, 75.69024409043892, 0.12946453122513552], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 238.34545454545452, 141, 566, 150.0, 436.8, 455.19999999999976, 566.0, 0.2580887355998217, 0.45669608291687197, 0.12551581086788205], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1339.018181818182, 982, 1977, 1287.0, 1711.8, 1795.7999999999993, 1977.0, 0.25675259320119137, 231.0264346853497, 0.12887776650919175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 170.16666666666669, 144, 445, 153.0, 211.90000000000038, 445.0, 445.0, 0.08126814424192623, 0.060713017915110905, 0.028888285648497217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 12, 7.453416149068323, 226.02484472049693, 143, 3403, 153.0, 349.0000000000002, 490.6, 1955.9199999999894, 0.6828746903735876, 1.5875188015867294, 0.3240034628851244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 210.6, 144, 449, 150.0, 448.8, 449.0, 449.0, 0.05335410586521686, 0.04131816987413767, 0.018965717319276307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9308a0e6-4022-48a5-a2c6-0b0c9effede8", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.5345090606508875, 2.0398021449704142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4e05494-b1f2-490f-8739-6ce8205c2582", 3, 0, 0.0, 666.0, 236, 1197, 565.0, 1197.0, 1197.0, 1197.0, 0.038735167658717345, 0.02454992559619879, 0.024839934989476946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 154.75, 144, 211, 152.0, 174.60000000000002, 211.0, 211.0, 0.09560058077352819, 0.07758211193633001, 0.0339830189468401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 473.79999999999995, 284, 1536, 298.0, 1439.8000000000002, 1536.0, 1536.0, 0.053335608985983406, 6.455186879640198, 0.11858839310477248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 435.5, 285, 846, 307.0, 716.0, 846.0, 846.0, 0.07868218579112127, 0.12194202036182564, 0.17695807995796123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14192397-c648-40ca-aaa4-4c8561b94df5", 3, 0, 0.0, 415.6666666666667, 269, 497, 481.0, 497.0, 497.0, 497.0, 0.07105973755270265, 0.03215268072859917, 0.04556890721966933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29124cef-e7c8-452b-83f9-043ad120534e", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca677b68-4550-4205-9200-d0030a891af4", 3, 0, 0.0, 445.3333333333333, 244, 678, 414.0, 678.0, 678.0, 678.0, 0.021504297275405534, 0.02541735136946533, 0.013790190635595346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 151.22222222222226, 145, 168, 152.0, 168.0, 168.0, 168.0, 0.046953745343753586, 0.0389294236297332, 0.016690589165162407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 179.4444444444444, 145, 426, 151.0, 341.40000000000015, 426.0, 426.0, 0.09267840593141798, 0.0719524733549583, 0.032944277108433735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a715772-2d07-404d-a762-8c10895c5dc0", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 162.22222222222223, 142, 446, 144.5, 179.60000000000042, 446.0, 446.0, 0.0820744780291182, 0.06099480251968648, 0.041197540729459727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=310aca44-402a-4f7d-bd39-275fd6906321", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 159.8888888888889, 141, 427, 144.0, 177.7000000000004, 427.0, 427.0, 0.08207485226526591, 0.03565838850587291, 0.046042424719121615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 421.33333333333337, 141, 1679, 282.5, 1622.3000000000002, 1679.0, 1679.0, 0.08197057256444935, 8.214890481053413, 0.04740702601654895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 350.38888888888886, 141, 1182, 284.5, 882.3000000000005, 1182.0, 1182.0, 0.08207634924398563, 2.7011276663414012, 0.04754835379922301], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 20.0, 0.48], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.24], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.24], "isController": false}, {"data": ["401/Unauthorized", 18, 60.0, 1.44], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1250, 30, "401/Unauthorized", 18, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
