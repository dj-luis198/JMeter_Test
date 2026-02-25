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

    var data = {"OkPercent": 97.88519637462235, "KoPercent": 2.1148036253776437};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7636010362694301, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=292908b1-e3c6-476a-9e70-7e91f0a4dce1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0d332ad-bd78-4a4c-b3a0-a6e72123c15c"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e05f8bb3-147d-49d4-9c04-af7f4f103c29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a20f68d0-7c40-4a03-932c-1aba7daf3cf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3dd98b1-02c5-4cf0-80cc-a48942efb7dd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/46f07fcb-c98a-4704-aaa2-f0b41f666c20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f665caa-aeae-48ee-8b53-1f01a2504e92"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/efcd0aaf-9242-49a5-a8f2-c86376c1d548"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f665caa-aeae-48ee-8b53-1f01a2504e92"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/96b4036b-6e05-4874-af2e-7cde7f9a3522"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e7ed3277-3480-430b-9937-c28429f34988"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b068fa47-fbd3-4bae-a81f-3264bc16713d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1210585d-9c12-44a3-b5f5-8b05c7fb5ae3"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3dd98b1-02c5-4cf0-80cc-a48942efb7dd"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e05f8bb3-147d-49d4-9c04-af7f4f103c29"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.38181818181818183, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9aee3a02-83c4-49d0-a140-cde526efd824"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efcd0aaf-9242-49a5-a8f2-c86376c1d548"], "isController": false}, {"data": [0.26229508196721313, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46f07fcb-c98a-4704-aaa2-f0b41f666c20"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0d332ad-bd78-4a4c-b3a0-a6e72123c15c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a9d4d8b-a329-461a-941e-6ab9d4f30650"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9152542372881356, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a20f68d0-7c40-4a03-932c-1aba7daf3cf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a9d4d8b-a329-461a-941e-6ab9d4f30650"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/292908b1-e3c6-476a-9e70-7e91f0a4dce1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b068fa47-fbd3-4bae-a81f-3264bc16713d"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9aee3a02-83c4-49d0-a140-cde526efd824"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1210585d-9c12-44a3-b5f5-8b05c7fb5ae3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7ed3277-3480-430b-9937-c28429f34988"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e035b830-2647-4ae7-bd5a-c8c90bc71351"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1324, 28, 2.1148036253776437, 403.1495468277941, 126, 2700, 150.5, 1071.5, 1225.75, 1631.25, 5.229811505585312, 731.1404713508339, 3.825614275726407], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1958.2909090909081, 1566, 2508, 1907.0, 2270.4, 2349.0, 2508.0, 0.2488496360008506, 299.4501386276282, 1.2235917160784013], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=292908b1-e3c6-476a-9e70-7e91f0a4dce1", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0d332ad-bd78-4a4c-b3a0-a6e72123c15c", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 485.8, 133, 815, 456.0, 783.2, 815.0, 815.0, 0.08912761886653435, 0.017459961274049602, 0.060010275671725156], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 485.8, 133, 815, 456.0, 783.2, 815.0, 815.0, 0.08608864835082847, 0.016864631698414248, 0.05796411466434036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e05f8bb3-147d-49d4-9c04-af7f4f103c29", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 151.87500000000003, 129, 420, 135.0, 222.6000000000002, 420.0, 420.0, 0.09790064308484928, 0.02619607051293818, 0.05583396050932809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 153.93750000000003, 131, 406, 137.0, 224.00000000000017, 406.0, 406.0, 0.0978946531164151, 0.07275178810702333, 0.04913852705257555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 185.74999999999997, 130, 416, 135.0, 413.2, 416.0, 416.0, 0.09790303927747557, 0.02638792855525709, 0.057651887387029074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 218.06250000000003, 127, 416, 135.0, 412.5, 416.0, 416.0, 0.09790244021832245, 0.02638776709009472, 0.05755592676897472], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 274.46666666666664, 132, 929, 228.0, 574.4000000000002, 929.0, 929.0, 0.08919757858306673, 0.16902244285408466, 0.05765322657374261], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 135.94444444444446, 130, 141, 137.0, 140.1, 141.0, 141.0, 0.09627315904325874, 0.07154675198429679, 0.04832461303538574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 180.77777777777777, 129, 409, 137.0, 406.3, 409.0, 409.0, 0.09627470382157088, 0.04986102011071591, 0.053559071885112185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 857.1428571428572, 625, 1038, 911.0, 1038.0, 1038.0, 1038.0, 0.037244938678868814, 10.951248619942005, 0.021241254090292372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1262.2857142857142, 898, 2290, 1162.0, 2290.0, 2290.0, 2290.0, 0.03718301479883989, 33.457342076764334, 0.021169626589573883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a20f68d0-7c40-4a03-932c-1aba7daf3cf1", 3, 0, 0.0, 336.0, 216, 567, 225.0, 567.0, 567.0, 567.0, 0.0160794970333328, 0.02216688474484518, 0.010311396209526565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3dd98b1-02c5-4cf0-80cc-a48942efb7dd", 3, 0, 0.0, 296.3333333333333, 211, 399, 279.0, 399.0, 399.0, 399.0, 0.08892314076533184, 0.039367015442985445, 0.0570242797225598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46f07fcb-c98a-4704-aaa2-f0b41f666c20", 3, 0, 0.0, 598.0, 338, 997, 459.0, 997.0, 997.0, 997.0, 0.05167157546633597, 0.03321984425325962, 0.03313574338173238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 175.2857142857143, 131, 409, 137.0, 409.0, 409.0, 409.0, 0.03734189707506255, 0.06607765380860678, 0.02067661683746139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 135.53333333333333, 128, 142, 136.0, 141.4, 142.0, 142.0, 0.09704780574911201, 0.07212244157722095, 0.04871344937015974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 154.13333333333335, 127, 406, 135.0, 256.6000000000001, 406.0, 406.0, 0.09705094527620699, 0.025968709966485076, 0.0553493672278368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 187.66666666666669, 128, 404, 136.0, 400.4, 404.0, 404.0, 0.09689171382063407, 0.02611534474071777, 0.05696173019533369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f665caa-aeae-48ee-8b53-1f01a2504e92", 3, 0, 0.0, 309.3333333333333, 217, 467, 244.0, 467.0, 467.0, 467.0, 0.03811217684050054, 0.02494908451375214, 0.02444042590357619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efcd0aaf-9242-49a5-a8f2-c86376c1d548", 3, 0, 0.0, 838.3333333333334, 243, 1601, 671.0, 1601.0, 1601.0, 1601.0, 0.01900984076090056, 0.026206600137504518, 0.012190555435863967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 251.4, 131, 552, 138.0, 466.20000000000005, 552.0, 552.0, 0.0967891802601693, 0.026087708741998762, 0.05699597236023642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 176.57142857142858, 131, 409, 139.0, 409.0, 409.0, 409.0, 0.03734269390193809, 0.027751748104858285, 0.020968797845326563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 330.0, 131, 1225, 136.5, 1217.8, 1225.0, 1225.0, 0.0962772785622593, 14.460035527318677, 0.05522153802952503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 589.7727272727274, 128, 1352, 405.5, 1224.6, 1333.2499999999998, 1352.0, 0.09878139676895031, 36.37723594638191, 0.05459987360471277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 266.27777777777777, 133, 659, 139.5, 655.4, 659.0, 659.0, 0.09614511502694734, 4.7332377835613215, 0.05523962500734442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 461.8636363636363, 132, 1103, 271.5, 951.8, 1080.9499999999996, 1103.0, 0.09890263036041018, 11.912384562086126, 0.05476346817807868], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 415.7333333333333, 135, 1116, 438.0, 747.0000000000002, 1116.0, 1116.0, 0.08618955957135059, 0.01688440004884075, 0.058604411468957396], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 389.7333333333333, 265, 688, 280.0, 602.8000000000001, 688.0, 688.0, 0.09670182315170582, 0.1498689388103097, 0.21748466671716649], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f665caa-aeae-48ee-8b53-1f01a2504e92", 1, 0, 0.0, 1116.0, 1116, 1116, 1116.0, 1116.0, 1116.0, 1116.0, 0.8960573476702509, 0.16188536066308243, 0.6177895385304659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 585.6363636363639, 192, 1407, 620.5, 961.0, 1343.6999999999991, 1407.0, 0.10294805802526907, 0.06323664892372485, 0.04654780357978475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 161.7727272727273, 128, 415, 137.5, 332.6999999999998, 414.4, 415.0, 0.0989004072898591, 0.07349922846443631, 0.04964336850291756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 200.90909090909088, 130, 564, 136.0, 401.09999999999997, 540.1499999999996, 564.0, 0.09890174112019708, 0.08723267027957723, 0.05300690794945222], "isController": false}, {"data": ["login", 22, 0, 0.0, 2571.909090909091, 1537, 4717, 2387.5, 3811.7999999999997, 4609.749999999998, 4717.0, 0.10616838305552606, 40.556920843930065, 0.2162012047698559], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 142.83333333333331, 132, 159, 142.0, 152.70000000000002, 159.0, 159.0, 0.08968609865470852, 0.0726072029147982, 0.03188060538116592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96b4036b-6e05-4874-af2e-7cde7f9a3522", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7ed3277-3480-430b-9937-c28429f34988", 3, 0, 0.0, 387.6666666666667, 249, 555, 359.0, 555.0, 555.0, 555.0, 0.0727554930397245, 0.03291996592617742, 0.04665635458602124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 762.7272727272726, 265, 1488, 681.5, 1372.6, 1471.4999999999998, 1488.0, 0.09871934091378212, 48.40512787379854, 0.21168918327694364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b068fa47-fbd3-4bae-a81f-3264bc16713d", 3, 0, 0.0, 556.6666666666666, 321, 929, 420.0, 929.0, 929.0, 929.0, 0.02987363452595521, 0.029961154939605467, 0.019157246099001223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1210585d-9c12-44a3-b5f5-8b05c7fb5ae3", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 966.0, 131, 2700, 1074.0, 2449.400000000001, 2700.0, 2700.0, 0.05838889124803601, 44.45785333904837, 0.09785219283462143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 392.875, 264, 810, 275.5, 638.5000000000002, 810.0, 810.0, 0.09781386022399374, 0.1515923790776153, 0.21998566415611093], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 971.9545454545456, 208, 1711, 941.5, 1604.9999999999998, 1703.6499999999999, 1711.0, 0.10575804482218228, 0.03310572319273923, 0.04771505537875802], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 497.7777777777778, 268, 1358, 279.5, 1349.0, 1358.0, 1358.0, 0.09607327188202203, 19.280251279976195, 0.21197416563032073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 161.53846153846152, 133, 432, 139.0, 316.7999999999999, 432.0, 432.0, 0.15389532750109503, 0.11947928258141655, 0.05470497969765487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3dd98b1-02c5-4cf0-80cc-a48942efb7dd", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e05f8bb3-147d-49d4-9c04-af7f4f103c29", 3, 0, 0.0, 463.0, 221, 615, 553.0, 615.0, 615.0, 615.0, 0.051127358249399256, 0.03286996502036573, 0.03278674991904835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 615.6, 267, 1355, 528.0, 1347.8, 1355.0, 1355.0, 0.09774406693513704, 23.508364448527978, 0.21482695023849555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 134.1818181818182, 126, 139, 134.0, 138.8, 139.0, 139.0, 0.06412834997755508, 0.04765788509074161, 0.03218942567232745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 156.90909090909093, 127, 390, 133.0, 340.20000000000016, 390.0, 390.0, 0.06403464856620601, 0.01713427119837934, 0.03651976051041436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 158.0909090909091, 126, 390, 136.0, 339.8000000000002, 390.0, 390.0, 0.06413321050851806, 0.017285904394874006, 0.037703313209109246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 184.72727272727272, 130, 407, 136.0, 406.8, 407.0, 407.0, 0.06402868485081316, 0.017257731463695736, 0.0377043915674222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 137.5, 135, 140, 137.5, 140.0, 140.0, 140.0, 0.020105352044714305, 0.005929508122562226, 0.012428406097953275], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1278.1636363636362, 1021, 1946, 1102.0, 1711.8, 1776.1999999999998, 1946.0, 0.25288170193983256, 302.53443142422975, 0.499342579416349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 971.9545454545456, 208, 1711, 941.5, 1604.9999999999998, 1703.6499999999999, 1711.0, 0.10626992561105207, 0.033265958603033524, 0.04794600159404888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 173.33333333333334, 128, 392, 129.5, 392.0, 392.0, 392.0, 0.031273455091318486, 0.008429173442581936, 0.018415911543032275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 267.5, 133, 408, 261.5, 408.0, 408.0, 408.0, 0.031272966084468286, 0.008429041639954341, 0.01838508357700186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 216.0769230769231, 130, 406, 138.0, 405.2, 406.0, 406.0, 0.15012587477192416, 0.04046361468462018, 0.08825759434833823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 194.6923076923077, 127, 407, 138.0, 405.8, 407.0, 407.0, 0.15012587477192416, 0.04046361468462018, 0.08840420164792019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 180.0, 131, 402, 136.5, 402.0, 402.0, 402.0, 0.03127264008839733, 0.008367874398653193, 0.017835177550414104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 160.46153846153848, 130, 406, 138.0, 313.9999999999999, 406.0, 406.0, 0.15012934220251295, 0.11157073185167221, 0.07535789247274575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 180.83333333333334, 131, 411, 132.5, 411.0, 411.0, 411.0, 0.03127052127958973, 0.023239127630632603, 0.015696335876669066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 197.23076923076923, 132, 404, 137.0, 404.0, 404.0, 404.0, 0.15012934220251295, 0.04017132789403178, 0.08562064047487065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 140.0, 138, 142, 140.0, 142.0, 142.0, 142.0, 0.030225786626096946, 0.023791000020150523, 0.010744322589745399], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 470.0, 131, 913, 459.0, 767.8000000000001, 913.0, 913.0, 0.08623018861416588, 0.016577978318856244, 0.05868256260311693], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1207.3181818181822, 742, 1693, 1211.5, 1620.1, 1684.4499999999998, 1693.0, 0.10492478800423514, 0.054306775041254515, 0.04826130385741675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 452.6666666666667, 267, 820, 409.5, 820.0, 820.0, 820.0, 0.03124837248059997, 0.048428874147179835, 0.07027832209259935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9aee3a02-83c4-49d0-a140-cde526efd824", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efcd0aaf-9242-49a5-a8f2-c86376c1d548", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["addBook", 61, 13, 21.311475409836067, 1232.032786885246, 671, 2610, 1068.0, 2017.6000000000004, 2162.9, 2610.0, 0.2835837548348706, 84.57016086549994, 1.0307014644660257], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 239.63636363636368, 130, 564, 139.0, 548.8, 556.8, 564.0, 0.2539852596191145, 0.1887527173536583, 0.12277607764791178], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 757.8545454545456, 634, 1100, 676.0, 953.0, 1005.9999999999995, 1100.0, 0.2538891196971795, 74.65183110314823, 0.1276883756289526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46f07fcb-c98a-4704-aaa2-f0b41f666c20", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 196.2545454545455, 127, 529, 138.0, 408.4, 413.4, 529.0, 0.2545176889793841, 0.4503770043268007, 0.12377911046067702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0d332ad-bd78-4a4c-b3a0-a6e72123c15c", 3, 0, 0.0, 307.0, 228, 463, 230.0, 463.0, 463.0, 463.0, 0.07721212745148504, 0.03493647693931127, 0.049514287460750504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a9d4d8b-a329-461a-941e-6ab9d4f30650", 3, 0, 0.0, 508.66666666666663, 301, 913, 312.0, 913.0, 913.0, 913.0, 0.01775725827932167, 0.0244798140667081, 0.011387304300216047], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1034.9272727272728, 881, 1354, 953.0, 1218.8, 1222.0, 1354.0, 0.25357190607696595, 228.16444681992013, 0.12728121066753956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 161.53333333333333, 135, 424, 140.0, 277.0000000000001, 424.0, 424.0, 0.09971150138931358, 0.07449150250275868, 0.03544432275948257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 13, 7.344632768361582, 199.81920903954799, 130, 1023, 143.0, 337.8000000000002, 433.5999999999998, 966.8399999999999, 0.7746068979400708, 1.6738146969076992, 0.3731060833993427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 138.72727272727275, 133, 144, 139.0, 143.4, 144.0, 144.0, 0.06339107684151078, 0.04909094134308403, 0.022533546846005784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a20f68d0-7c40-4a03-932c-1aba7daf3cf1", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a9d4d8b-a329-461a-941e-6ab9d4f30650", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/292908b1-e3c6-476a-9e70-7e91f0a4dce1", 3, 0, 0.0, 303.6666666666667, 225, 401, 285.0, 401.0, 401.0, 401.0, 0.021851714266984245, 0.026212098656847965, 0.014012980828762685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 158.31250000000003, 133, 390, 140.0, 233.20000000000016, 390.0, 390.0, 0.10091517448864389, 0.0818950292969366, 0.03587219093151013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b068fa47-fbd3-4bae-a81f-3264bc16713d", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 344.27272727272725, 265, 540, 277.0, 538.4, 540.0, 540.0, 0.063976921779489, 0.09915173326567288, 0.14388559654117494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 441.0769230769231, 262, 811, 526.0, 703.8, 811.0, 811.0, 0.14988873643795184, 0.23229826633498982, 0.33710328126621397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9aee3a02-83c4-49d0-a140-cde526efd824", 3, 0, 0.0, 303.0, 235, 431, 243.0, 431.0, 431.0, 431.0, 0.028141797135165052, 0.028224243806459482, 0.018046660272224985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 178.86666666666667, 132, 412, 145.0, 410.2, 412.0, 412.0, 0.09672801372248087, 0.08019734731483033, 0.034383786127913124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1210585d-9c12-44a3-b5f5-8b05c7fb5ae3", 3, 0, 0.0, 519.3333333333334, 228, 904, 426.0, 904.0, 904.0, 904.0, 0.03450735006556396, 0.028767357915986103, 0.022128736858450848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 144.27272727272725, 130, 161, 143.5, 156.4, 160.39999999999998, 161.0, 0.10295865741910726, 0.0799337232892483, 0.036598585254448285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7ed3277-3480-430b-9937-c28429f34988", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 174.60000000000002, 131, 409, 138.0, 407.8, 409.0, 409.0, 0.09851957912435798, 0.07321621065784807, 0.049452210615156256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 242.46666666666667, 130, 418, 138.0, 418.0, 418.0, 418.0, 0.09870109360811717, 0.05605913676023531, 0.05463259751668049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e035b830-2647-4ae7-bd5a-c8c90bc71351", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 368.1333333333333, 130, 1216, 136.0, 1211.2, 1216.0, 1216.0, 0.09800590648929774, 17.65830991060228, 0.05593227710190001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 332.93333333333334, 129, 955, 140.0, 788.8000000000001, 955.0, 955.0, 0.09816818172893803, 5.794108497928651, 0.056120755453242493], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.5287009063444109], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.142857142857143, 0.1510574018126888], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.1510574018126888], "isController": false}, {"data": ["401/Unauthorized", 17, 60.714285714285715, 1.283987915407855], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1324, 28, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
