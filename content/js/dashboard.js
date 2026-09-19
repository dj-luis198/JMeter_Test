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

    var data = {"OkPercent": 99.15123456790124, "KoPercent": 0.8487654320987654};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.816522893165229, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.33636363636363636, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c942d945-d9ca-4108-b647-edb8cff1585f"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/412a2f6c-3c05-4e1f-b9d7-45a130a8c5a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=766c7e46-1a63-4e9b-9988-28feac580af9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31c0b260-8356-41ae-b3c5-6a2c1f07523c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a4f0677-92a5-42fb-803b-e7e953e3b221"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a1af6a3-910f-4a54-bdba-3f6703c4819b"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05263157894736842, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fa618b6b-ff49-4e80-b0e8-d1600aff4a14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/415224c5-6f6c-4feb-ac99-aa7e1181e319"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc2a16da-e33a-4508-8b1e-55a077193f86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3bc1fa8c-584e-4413-b560-f3da63ca615a"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/305e4fad-1e7b-4dd2-a425-67c9fc2f06e4"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45735973-2105-4c7e-ad1e-490c0e7023df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f2743fe8-0c84-4ca1-b33c-7a3909762a5c"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31c0b260-8356-41ae-b3c5-6a2c1f07523c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/766c7e46-1a63-4e9b-9988-28feac580af9"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e31986e2-e7ba-4b1a-a302-e2c9102532de"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.21052631578947367, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/757540b8-0cea-4a4d-ad56-b4bb37e5dac9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=415224c5-6f6c-4feb-ac99-aa7e1181e319"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa618b6b-ff49-4e80-b0e8-d1600aff4a14"], "isController": false}, {"data": [0.3790322580645161, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c942d945-d9ca-4108-b647-edb8cff1585f"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a1af6a3-910f-4a54-bdba-3f6703c4819b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9497206703910615, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7662ff45-b333-458b-bf7d-3dc6c793a4c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7662ff45-b333-458b-bf7d-3dc6c793a4c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e31986e2-e7ba-4b1a-a302-e2c9102532de"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cc2a16da-e33a-4508-8b1e-55a077193f86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=412a2f6c-3c05-4e1f-b9d7-45a130a8c5a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6d23b17-bcf1-4b46-831f-2c8a6896ffdd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=305e4fad-1e7b-4dd2-a425-67c9fc2f06e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45735973-2105-4c7e-ad1e-490c0e7023df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2743fe8-0c84-4ca1-b33c-7a3909762a5c"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 11, 0.8487654320987654, 327.48996913580316, 77, 4918, 100.0, 881.3, 1115.1499999999999, 1771.2899999999988, 5.111377547800846, 701.6377827267681, 3.7287908705610686], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1432.7818181818182, 1005, 2937, 1372.0, 1691.6, 1927.3999999999987, 2937.0, 0.25103380284261545, 302.0769311987663, 1.2343312473755557], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c942d945-d9ca-4108-b647-edb8cff1585f", 3, 0, 0.0, 353.6666666666667, 231, 578, 252.0, 578.0, 578.0, 578.0, 0.03563749539682351, 0.029709513577885746, 0.022853471982989038], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 693.4285714285713, 85, 1661, 587.5, 1600.0, 1661.0, 1661.0, 0.08064051609930303, 0.015226972452623696, 0.054534724022233735], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 693.4285714285713, 85, 1661, 587.5, 1600.0, 1661.0, 1661.0, 0.08037016200328369, 0.0151759227499225, 0.05435189178444723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 139.13333333333333, 80, 255, 84.0, 252.6, 255.0, 255.0, 0.08086994495452414, 0.037834077112188176, 0.04521556557743836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/412a2f6c-3c05-4e1f-b9d7-45a130a8c5a9", 3, 0, 0.0, 268.6666666666667, 179, 435, 192.0, 435.0, 435.0, 435.0, 0.02061175694616209, 0.02824723201280677, 0.013217825906230246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 82.26666666666667, 79, 85, 82.0, 85.0, 85.0, 85.0, 0.08086863698607981, 0.060098664791412834, 0.040592265049653346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 174.06666666666666, 78, 707, 83.0, 671.6, 707.0, 707.0, 0.08087038095340787, 3.189367768840103, 0.04669527400232907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 209.9333333333333, 78, 933, 82.0, 847.8000000000001, 933.0, 933.0, 0.08086994495452414, 9.72114653027501, 0.046616047697093536], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 243.6428571428571, 83, 447, 225.0, 410.0, 447.0, 447.0, 0.08081834345486873, 0.17226889922529845, 0.05224215881670399], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 104.125, 81, 246, 84.0, 242.5, 246.0, 246.0, 0.0798156259041614, 0.05931610479791682, 0.04006370284642476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 120.5625, 79, 243, 82.0, 240.2, 243.0, 243.0, 0.07981841311017435, 0.02135766132049587, 0.04552143872689631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 516.0, 480, 552, 516.0, 552.0, 552.0, 552.0, 0.21231422505307856, 62.42743166135881, 0.12108545647558387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 917.5, 887, 948, 917.5, 948.0, 948.0, 948.0, 0.20376974019358124, 183.35237041518084, 0.11601343606724401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 162.0, 81, 243, 162.0, 243.0, 243.0, 243.0, 0.21953896816684962, 0.38848106476399563, 0.12156112788144896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 85.81818181818183, 82, 95, 84.0, 94.6, 95.0, 95.0, 0.06393861892583119, 0.047516883791560105, 0.03209418957800512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=766c7e46-1a63-4e9b-9988-28feac580af9", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 140.63636363636363, 79, 246, 83.0, 245.8, 246.0, 246.0, 0.0638829200301992, 0.017093671961205644, 0.03643322782972298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 141.36363636363635, 80, 251, 85.0, 249.6, 251.0, 251.0, 0.06388366204381257, 0.01721864328524636, 0.037556606006225755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 98.09090909090911, 81, 246, 83.0, 214.2000000000001, 246.0, 246.0, 0.06394382244544429, 0.017234858393498656, 0.03765441888144815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31c0b260-8356-41ae-b3c5-6a2c1f07523c", 1, 0, 0.0, 1268.0, 1268, 1268, 1268.0, 1268.0, 1268.0, 1268.0, 0.7886435331230284, 0.14247954455835962, 0.5437327484227129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 83.0, 81, 85, 83.0, 85.0, 85.0, 85.0, 0.22341376228775692, 0.16603307920017873, 0.12545206378462914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 91.62499999999999, 78, 246, 81.0, 136.1000000000001, 246.0, 246.0, 0.0798208022988391, 0.021514200619608976, 0.04692590135146595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 553.5263157894736, 80, 1176, 873.0, 995.0, 1176.0, 1176.0, 0.11372682815876266, 53.87325659391142, 0.06171504171978907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 131.375, 79, 242, 83.0, 242.0, 242.0, 242.0, 0.07982000588672544, 0.021513985961656466, 0.04700338237274945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 363.36842105263156, 80, 727, 466.0, 648.0, 727.0, 727.0, 0.11372750888870267, 17.614342909389105, 0.06182647314534376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a4f0677-92a5-42fb-803b-e7e953e3b221", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 745.7692307692307, 407, 1371, 573.0, 1329.8, 1371.0, 1371.0, 0.07899854156538648, 0.014272197450777832, 0.054465791352698106], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 243.72727272727272, 164, 345, 183.0, 342.0, 345.0, 345.0, 0.06384732363627921, 0.09895088145583507, 0.14359412727963966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a1af6a3-910f-4a54-bdba-3f6703c4819b", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 729.7368421052632, 249, 2056, 559.0, 1443.0, 2056.0, 2056.0, 0.10320421942303411, 0.06339399806356294, 0.046663626555532016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 99.26315789473685, 79, 244, 82.0, 241.0, 244.0, 244.0, 0.11372682815876266, 0.08451769162970545, 0.05708553679062891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 132.73684210526318, 79, 253, 83.0, 245.0, 253.0, 253.0, 0.11372682815876266, 0.120332056151125, 0.05983284400869112], "isController": false}, {"data": ["login", 19, 0, 0.0, 3077.5263157894738, 1312, 5928, 2786.0, 5627.0, 5928.0, 5928.0, 0.10410046242521204, 13.257078317791317, 0.17523613511966074], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fa618b6b-ff49-4e80-b0e8-d1600aff4a14", 3, 0, 0.0, 575.3333333333334, 329, 950, 447.0, 950.0, 950.0, 950.0, 0.03644624785878294, 0.029837992631783557, 0.023372105560482546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 87.62499999999999, 82, 112, 86.0, 99.4, 112.0, 112.0, 0.07685029083031937, 0.062215713963217525, 0.027317876818590086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/415224c5-6f6c-4feb-ac99-aa7e1181e319", 3, 0, 0.0, 562.0, 302, 1011, 373.0, 1011.0, 1011.0, 1011.0, 0.03287707262545343, 0.02740826269328979, 0.0210832789948383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc2a16da-e33a-4508-8b1e-55a077193f86", 1, 0, 0.0, 1141.0, 1141, 1141, 1141.0, 1141.0, 1141.0, 1141.0, 0.8764241893076249, 0.15833835451358458, 0.6042533961437335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bc1fa8c-584e-4413-b560-f3da63ca615a", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.1244223151408452, 2.1009848151408455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 662.3684210526314, 164, 1258, 956.0, 1079.0, 1258.0, 1258.0, 0.11367035596769369, 71.65674426974275, 0.2403401230182471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/305e4fad-1e7b-4dd2-a425-67c9fc2f06e4", 3, 0, 0.0, 361.0, 239, 551, 293.0, 551.0, 551.0, 551.0, 0.02977785718539694, 0.024824574300716655, 0.01909582638516666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 347.73333333333335, 162, 1016, 324.0, 930.8000000000001, 1016.0, 1016.0, 0.08083333782407433, 13.002542334776656, 0.17903847565838754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 1, 33.333333333333336, 695.3333333333333, 83, 1030, 973.0, 1030.0, 1030.0, 1030.0, 0.036032573446395544, 28.741537036981434, 0.06191925625765692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45735973-2105-4c7e-ad1e-490c0e7023df", 3, 0, 0.0, 341.0, 242, 495, 286.0, 495.0, 495.0, 495.0, 0.018301833843751145, 0.025230555445405627, 0.011736527562561768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2743fe8-0c84-4ca1-b33c-7a3909762a5c", 3, 0, 0.0, 324.3333333333333, 176, 455, 342.0, 455.0, 455.0, 455.0, 0.029097398692556887, 0.029182644977788986, 0.01865946465635972], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1278.8095238095236, 174, 2645, 1213.0, 2404.2000000000003, 2629.2999999999997, 2645.0, 0.08389764487325464, 0.0267798286090969, 0.03785225774555043], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 257.75, 164, 489, 174.5, 484.8, 489.0, 489.0, 0.07978179678579085, 0.12364620263579111, 0.17943113085710582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 171.2777777777778, 81, 1567, 87.5, 253.00000000000207, 1567.0, 1567.0, 0.09173330071704863, 0.07121872467778678, 0.03260832173926338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 436.83333333333337, 165, 1453, 327.0, 974.2000000000007, 1453.0, 1453.0, 0.108670059587416, 29.021473750898036, 0.23822278796056484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31c0b260-8356-41ae-b3c5-6a2c1f07523c", 3, 0, 0.0, 358.6666666666667, 186, 457, 433.0, 457.0, 457.0, 457.0, 0.029930262488402023, 0.02984257617251803, 0.019193560254606765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 96.83333333333333, 82, 240, 83.0, 194.40000000000015, 240.0, 240.0, 0.056288082405752636, 0.04183127999099391, 0.02825397886382506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 113.08333333333334, 80, 297, 81.5, 279.9000000000001, 297.0, 297.0, 0.05628913854164224, 0.015061742148837863, 0.03210239932453034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 110.25, 79, 249, 82.0, 246.3, 249.0, 249.0, 0.056289402581807264, 0.01517175303962774, 0.03309201206469529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 112.0, 79, 283, 82.5, 270.1, 283.0, 283.0, 0.05628913854164224, 0.01517168187255201, 0.03314682669981472], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 956.6545454545457, 642, 1519, 946.0, 1245.2, 1381.1999999999996, 1519.0, 0.24247126715484216, 290.07993216866305, 0.4787860372920809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/766c7e46-1a63-4e9b-9988-28feac580af9", 3, 0, 0.0, 1526.3333333333333, 219, 3849, 511.0, 3849.0, 3849.0, 3849.0, 0.034220011862937445, 0.0220001703871424, 0.021944473753250898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1278.8095238095236, 174, 2645, 1213.0, 2404.2000000000003, 2629.2999999999997, 2645.0, 0.08282324730232853, 0.02643688474159147, 0.03736751977898025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 103.5, 81, 244, 83.0, 244.0, 244.0, 244.0, 0.0362341815151323, 0.009766244236500504, 0.021337120560180445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 121.375, 81, 238, 84.0, 238.0, 238.0, 238.0, 0.036234017401386855, 0.009766200002717551, 0.021301639136362193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e31986e2-e7ba-4b1a-a302-e2c9102532de", 3, 0, 0.0, 282.3333333333333, 170, 493, 184.0, 493.0, 493.0, 493.0, 0.036311260121763764, 0.030271203506457352, 0.023285541158813348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 143.72222222222223, 79, 1033, 82.0, 325.6000000000011, 1033.0, 1033.0, 0.09044453488897933, 4.544253953493922, 0.052739684298326275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 114.55555555555554, 77, 643, 82.0, 170.50000000000074, 643.0, 643.0, 0.09044453488897933, 1.5004508879894682, 0.052828009039428796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 103.375, 80, 244, 82.0, 244.0, 244.0, 244.0, 0.03623434563036438, 0.009695518264374845, 0.020664900242317187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 92.83333333333331, 80, 245, 83.0, 110.00000000000021, 245.0, 245.0, 0.09044135380657609, 0.06721276391289492, 0.04539732017244152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 104.375, 82, 246, 84.0, 246.0, 246.0, 246.0, 0.03623319685495851, 0.026927209772093192, 0.0181873663900866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 93.3888888888889, 78, 246, 82.0, 133.50000000000017, 246.0, 246.0, 0.09037006541788624, 0.03172169722513694, 0.05111752940792545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 125.0, 83, 244, 87.0, 244.0, 244.0, 244.0, 0.0350698767293833, 0.02760382875379193, 0.012466245243647967], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 632.0769230769231, 403, 1236, 511.0, 1146.0, 1236.0, 1236.0, 0.07896495170989491, 0.014266128971025938, 0.0537486048259734], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1806.0526315789473, 767, 4918, 1569.0, 4272.0, 4918.0, 4918.0, 0.1032844453625284, 0.0534577695724024, 0.04750681031811609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 248.12499999999997, 166, 490, 174.0, 490.0, 490.0, 490.0, 0.03621941722957678, 0.05613302260091635, 0.08145831824190948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/757540b8-0cea-4a4d-ad56-b4bb37e5dac9", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=415224c5-6f6c-4feb-ac99-aa7e1181e319", 1, 0, 0.0, 796.0, 796, 796, 796.0, 796.0, 796.0, 796.0, 1.256281407035176, 0.22696490263819094, 0.8661471419597989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa618b6b-ff49-4e80-b0e8-d1600aff4a14", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["addBook", 62, 6, 9.67741935483871, 1030.6290322580642, 424, 5464, 735.0, 1625.0, 1960.549999999998, 5464.0, 0.3048750504027301, 101.1506488045333, 1.1079812799957711], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 150.78181818181815, 81, 344, 85.0, 329.2, 334.4, 344.0, 0.24331868997217318, 0.18082570612189824, 0.11761987454709544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c942d945-d9ca-4108-b647-edb8cff1585f", 1, 0, 0.0, 1116.0, 1116, 1116, 1116.0, 1116.0, 1116.0, 1116.0, 0.8960573476702509, 0.16188536066308243, 0.6177895385304659], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 512.7272727272727, 388, 752, 479.0, 717.4, 727.0, 752.0, 0.24330684975138464, 71.54029237465274, 0.12236623791207334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a1af6a3-910f-4a54-bdba-3f6703c4819b", 3, 0, 0.0, 312.0, 214, 403, 319.0, 403.0, 403.0, 403.0, 0.050247047985930826, 0.03230401034251738, 0.032222228037852775], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 129.3818181818182, 79, 307, 84.0, 251.4, 255.6, 307.0, 0.24364204995990982, 0.4311322212181216, 0.11848998132815926], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 804.1636363636362, 559, 1192, 792.0, 966.0, 1081.3999999999996, 1192.0, 0.24288244048276197, 218.54604688817912, 0.12191560000794888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 87.50000000000001, 83, 100, 86.0, 95.5, 100.0, 100.0, 0.11167153678646541, 0.08342648988441995, 0.03969574159206387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 6, 3.35195530726257, 198.40782122905014, 80, 4246, 90.0, 338.0, 412.0, 3873.199999999995, 0.7449921130723225, 1.5375176298325641, 0.36116038634500214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 115.25000000000001, 83, 256, 88.5, 254.5, 256.0, 256.0, 0.05518992232018433, 0.04273985195303338, 0.019618292699753025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7662ff45-b333-458b-bf7d-3dc6c793a4c7", 3, 0, 0.0, 408.0, 273, 666, 285.0, 666.0, 666.0, 666.0, 0.03343773336751413, 0.027875662485092347, 0.02144281729622488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 92.06666666666666, 83, 128, 89.0, 110.00000000000001, 128.0, 128.0, 0.07898020755998547, 0.0640942895335429, 0.028074995656088585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7662ff45-b333-458b-bf7d-3dc6c793a4c7", 1, 0, 0.0, 1371.0, 1371, 1371, 1371.0, 1371.0, 1371.0, 1371.0, 0.7293946024799417, 0.13177539204959884, 0.5028833880379285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 225.58333333333337, 164, 490, 169.5, 457.3000000000001, 490.0, 490.0, 0.056266440350539924, 0.08720199300420592, 0.12654454309306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 247.38888888888889, 164, 1278, 166.5, 435.60000000000133, 1278.0, 1278.0, 0.09032970341747378, 6.135867596414412, 0.20186963667385957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e31986e2-e7ba-4b1a-a302-e2c9102532de", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc2a16da-e33a-4508-8b1e-55a077193f86", 3, 0, 0.0, 584.6666666666667, 188, 1236, 330.0, 1236.0, 1236.0, 1236.0, 0.023843396571319574, 0.02391325027221211, 0.015290198973144388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=412a2f6c-3c05-4e1f-b9d7-45a130a8c5a9", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6d23b17-bcf1-4b46-831f-2c8a6896ffdd", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.8654090447154472, 1.617018123306233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 117.27272727272727, 83, 249, 87.0, 248.2, 249.0, 249.0, 0.06500989923465618, 0.053899809033420995, 0.02310898761856919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 96.99999999999999, 82, 244, 87.0, 107.0, 244.0, 244.0, 0.10948484499250893, 0.08500044118070763, 0.03891844099343091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=305e4fad-1e7b-4dd2-a425-67c9fc2f06e4", 1, 0, 0.0, 793.0, 793, 793, 793.0, 793.0, 793.0, 793.0, 1.2610340479192939, 0.22782353404791927, 0.8694238650693569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45735973-2105-4c7e-ad1e-490c0e7023df", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 101.8888888888889, 79, 253, 83.0, 247.60000000000002, 253.0, 253.0, 0.10882971776826526, 0.08087833517739244, 0.05462741692664878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 116.27777777777777, 77, 244, 81.0, 240.4, 244.0, 244.0, 0.10883234981135727, 0.06544584230192513, 0.06003729019541453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 313.50000000000006, 78, 1199, 237.0, 873.2000000000005, 1199.0, 1199.0, 0.10872716729486807, 21.76343667699575, 0.06184329546003673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2743fe8-0c84-4ca1-b33c-7a3909762a5c", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 264.1666666666667, 81, 717, 241.5, 644.1000000000001, 717.0, 717.0, 0.10872716729486807, 7.127103568667247, 0.06194947433434812], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 27.272727272727273, 0.23148148148148148], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 9.090909090909092, 0.07716049382716049], "isController": false}, {"data": ["401/Unauthorized", 7, 63.63636363636363, 0.5401234567901234], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 11, "401/Unauthorized", 7, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
