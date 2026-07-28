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

    var data = {"OkPercent": 99.14263445050662, "KoPercent": 0.857365549493375};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8136333109469442, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3482142857142857, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5959ff01-2654-475f-9cf5-bc4d509c65bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5cd026e-c818-46b9-b645-c203e04f5def"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/de9524dd-81dd-4d06-9a57-3db449abe328"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/59978ae4-47da-48d4-aaaa-7f7b4bcc8ffa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b004c6d-7e41-4715-8945-5d928a5f4986"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7009e7e-cae7-4905-a028-ae850765d745"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3ea3c60b-43d8-4443-aead-91f33ecba9ef"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/133f1cce-ab8c-4fda-ab6a-0b116388df64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed55312a-e9ef-4d72-9b25-7b521bccd411"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f981770b-7753-46aa-9f6c-6f15f4527a6a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c3a9a5d-94b1-4974-be36-ea8b9a5c8efd"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b680fdd-7b08-4de0-af49-efa57644e6c0"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/52083993-8901-4dac-9bb9-c8ccf7a04027"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/045f876f-1a86-4858-aff8-6f38a0ee82f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7b004c6d-7e41-4715-8945-5d928a5f4986"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de9524dd-81dd-4d06-9a57-3db449abe328"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f981770b-7753-46aa-9f6c-6f15f4527a6a"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.40350877192982454, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5cd026e-c818-46b9-b645-c203e04f5def"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bade0b1d-7934-4234-b567-8dde28a2d5b4"], "isController": false}, {"data": [0.7946428571428571, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9529411764705882, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bade0b1d-7934-4234-b567-8dde28a2d5b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7009e7e-cae7-4905-a028-ae850765d745"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ea3c60b-43d8-4443-aead-91f33ecba9ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59978ae4-47da-48d4-aaaa-7f7b4bcc8ffa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52083993-8901-4dac-9bb9-c8ccf7a04027"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ed55312a-e9ef-4d72-9b25-7b521bccd411"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d893f122-4f17-4ef1-b92b-30149e0c9ff5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5959ff01-2654-475f-9cf5-bc4d509c65bf"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3c3a9a5d-94b1-4974-be36-ea8b9a5c8efd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2b680fdd-7b08-4de0-af49-efa57644e6c0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1283, 11, 0.857365549493375, 320.7957911145755, 76, 2743, 98.0, 886.8000000000004, 1085.6, 1612.7200000000034, 5.049272715823941, 728.3645379108683, 3.691433614165512], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1370.3928571428573, 969, 1791, 1394.5, 1643.0, 1696.0, 1791.0, 0.25218977280403504, 303.470124940893, 1.2400151426448403], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5959ff01-2654-475f-9cf5-bc4d509c65bf", 3, 0, 0.0, 333.3333333333333, 172, 527, 301.0, 527.0, 527.0, 527.0, 0.0793168178092695, 0.03728303545461756, 0.05086397496232451], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5cd026e-c818-46b9-b645-c203e04f5def", 3, 0, 0.0, 355.3333333333333, 276, 435, 355.0, 435.0, 435.0, 435.0, 0.0421674045962471, 0.02710957815025652, 0.02704094630683815], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 803.3076923076923, 411, 1974, 638.0, 1721.1999999999998, 1974.0, 1974.0, 0.08982180735295134, 0.016227572617476562, 0.061050759685209115], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 803.3076923076923, 411, 1974, 638.0, 1721.1999999999998, 1974.0, 1974.0, 0.08900025330841327, 0.016079147326227006, 0.060492359670562136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de9524dd-81dd-4d06-9a57-3db449abe328", 3, 0, 0.0, 517.0, 256, 1033, 262.0, 1033.0, 1033.0, 1033.0, 0.024791339558714154, 0.024863970436327574, 0.01589809209982646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 150.0, 79, 264, 82.5, 252.0, 264.0, 264.0, 0.09025096213972138, 0.0435138567459371, 0.050388441752673686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59978ae4-47da-48d4-aaaa-7f7b4bcc8ffa", 3, 0, 0.0, 452.0, 179, 638, 539.0, 638.0, 638.0, 638.0, 0.02780970744187771, 0.027891181194148837, 0.01783369910823538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 94.14285714285714, 81, 241, 83.0, 164.5, 241.0, 241.0, 0.09024921676572593, 0.06706997456905998, 0.04530087638435852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 184.42857142857142, 78, 650, 83.0, 565.5, 650.0, 650.0, 0.09025212575989067, 3.8118680336640427, 0.05203850945391017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 206.92857142857142, 79, 1016, 82.0, 955.5, 1016.0, 1016.0, 0.09025038034088859, 11.621914665847967, 0.05194936792501483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b004c6d-7e41-4715-8945-5d928a5f4986", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 251.38461538461536, 172, 468, 212.0, 422.79999999999995, 468.0, 468.0, 0.08976784653841373, 0.19597604838486926, 0.05803351016448231], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 101.05882352941177, 78, 240, 83.0, 234.4, 240.0, 240.0, 0.09621207404933982, 0.0715013558120582, 0.04829395123179752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 118.05882352941178, 76, 245, 81.0, 242.6, 245.0, 245.0, 0.09612720456434586, 0.025721537158819106, 0.0548225463531035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 540.2, 467, 634, 486.0, 634.0, 634.0, 634.0, 0.10858706510880424, 31.928202571884636, 0.06192856056986492], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 848.2, 724, 894, 877.0, 894.0, 894.0, 894.0, 0.10764726145366862, 96.8611950797128, 0.06128745451903204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7009e7e-cae7-4905-a028-ae850765d745", 3, 0, 0.0, 292.0, 199, 391, 286.0, 391.0, 391.0, 391.0, 0.032285837279380114, 0.026915374112139474, 0.02070413393241498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 178.8, 81, 250, 237.0, 250.0, 250.0, 250.0, 0.10916553862276757, 0.19317183201606916, 0.060446152733505086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 110.76470588235296, 80, 249, 83.0, 242.6, 249.0, 249.0, 0.09216489926918656, 0.06849364096079197, 0.046262459203478414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 138.64705882352942, 77, 246, 83.0, 246.0, 246.0, 246.0, 0.09216539894064006, 0.0409471045155624, 0.05165243750372728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 201.05882352941174, 78, 942, 82.0, 938.0, 942.0, 942.0, 0.09216539894064006, 9.778458692959106, 0.05325135469582708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 151.76470588235293, 77, 484, 82.0, 482.4, 484.0, 484.0, 0.09216489926918656, 3.2101000531303536, 0.05334107077993191], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 114.8, 81, 243, 83.0, 243.0, 243.0, 243.0, 0.10954582301776834, 0.08141051886379072, 0.0615125471047039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 600.4117647058822, 80, 1187, 793.0, 1125.3999999999999, 1187.0, 1187.0, 0.07977325625046926, 42.232451276724035, 0.04286529405830017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 100.47058823529412, 78, 244, 82.0, 241.6, 244.0, 244.0, 0.09621588580872281, 0.02593318797188232, 0.05656441724301869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 432.82352941176464, 79, 743, 640.0, 727.8, 743.0, 743.0, 0.07977475363679024, 13.806751525105584, 0.042944003695448145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 110.05882352941177, 79, 243, 82.0, 241.4, 243.0, 243.0, 0.0961266610121572, 0.025909139100932996, 0.056605836513994916], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 649.9230769230769, 214, 1307, 532.0, 1215.8, 1307.0, 1307.0, 0.08898563224291708, 0.016076505825136388, 0.06135142222997994], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3ea3c60b-43d8-4443-aead-91f33ecba9ef", 3, 0, 0.0, 1085.6666666666665, 199, 2743, 315.0, 2743.0, 2743.0, 2743.0, 0.026994682047636616, 0.02707376803019805, 0.017311042849558637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 337.05882352941177, 161, 1027, 168.0, 1022.2, 1027.0, 1027.0, 0.09212344541685859, 13.092055072547213, 0.2044147705719782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 668.095238095238, 111, 1430, 669.0, 1184.4, 1407.8999999999996, 1430.0, 0.09916184629913824, 0.06091093879116987, 0.04483587386377051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 96.4705882352941, 78, 313, 82.0, 134.59999999999985, 313.0, 313.0, 0.07976913872791686, 0.05928155719916477, 0.04004036846303639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 128.0588235294118, 78, 247, 82.0, 246.2, 247.0, 247.0, 0.07977512799215387, 0.09182755139629938, 0.041555656056574644], "isController": false}, {"data": ["login", 21, 0, 0.0, 2639.333333333333, 1531, 3671, 2693.0, 3488.0, 3653.7999999999997, 3671.0, 0.09938993511257094, 28.447369294840243, 0.1891986139245299], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 87.52941176470587, 83, 106, 85.0, 100.39999999999999, 106.0, 106.0, 0.09321913075902306, 0.07546744081956065, 0.033136487886996475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/133f1cce-ab8c-4fda-ab6a-0b116388df64", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed55312a-e9ef-4d72-9b25-7b521bccd411", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f981770b-7753-46aa-9f6c-6f15f4527a6a", 1, 0, 0.0, 1079.0, 1079, 1079, 1079.0, 1079.0, 1079.0, 1079.0, 0.9267840593141798, 0.1674365732159407, 0.6389741658943466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c3a9a5d-94b1-4974-be36-ea8b9a5c8efd", 1, 0, 0.0, 875.0, 875, 875, 875.0, 875.0, 875.0, 875.0, 1.142857142857143, 0.20647321428571427, 0.7879464285714286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 698.7058823529412, 163, 1268, 875.0, 1208.8, 1268.0, 1268.0, 0.07973883187301825, 56.16580609069823, 0.16733336782819566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 368.00000000000006, 162, 1097, 317.0, 1040.0, 1097.0, 1097.0, 0.09020037368726241, 15.535680489337027, 0.19956581003157012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 963.2, 807, 1131, 960.0, 1131.0, 1131.0, 1131.0, 0.10745524489050311, 128.5538303765232, 0.24229898481657391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b680fdd-7b08-4de0-af49-efa57644e6c0", 1, 0, 0.0, 806.0, 806, 806, 806.0, 806.0, 806.0, 806.0, 1.2406947890818858, 0.22414896091811412, 0.855400899503722], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1074.8095238095239, 467, 1860, 1103.0, 1639.6000000000001, 1838.7999999999997, 1860.0, 0.1015562282984012, 0.03207635335764235, 0.045819313939317735], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/52083993-8901-4dac-9bb9-c8ccf7a04027", 3, 0, 0.0, 310.6666666666667, 195, 519, 218.0, 519.0, 519.0, 519.0, 0.05084745762711864, 0.03269001588983051, 0.0326072563559322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/045f876f-1a86-4858-aff8-6f38a0ee82f7", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 250.1176470588235, 161, 482, 169.0, 476.4, 482.0, 482.0, 0.09608048153276627, 0.14890598065673835, 0.21608725485347727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 87.85714285714286, 82, 100, 85.5, 98.5, 100.0, 100.0, 0.07549204637368563, 0.05860954772175789, 0.026835063359396064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 274.85714285714283, 164, 884, 169.0, 607.0, 884.0, 884.0, 0.14405367028172783, 12.517184750761425, 0.32134740343259316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 82.41666666666667, 80, 85, 82.5, 85.0, 85.0, 85.0, 0.05773144294930698, 0.04290393367619395, 0.028978478199163854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 94.25, 78, 234, 81.0, 189.60000000000016, 234.0, 234.0, 0.057731720693935284, 0.015447745576306902, 0.032925121958259966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 81.25, 77, 84, 81.5, 84.0, 84.0, 84.0, 0.057731720693935284, 0.015560502843287244, 0.03393993736108305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 81.41666666666666, 78, 84, 82.0, 83.7, 84.0, 84.0, 0.05773199844123604, 0.015560577704864402, 0.03399647955084505], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 965.3928571428572, 638, 1450, 945.0, 1279.9, 1364.95, 1450.0, 0.24494794856093077, 293.0429041641151, 0.48367651561543173], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1074.8095238095239, 467, 1860, 1103.0, 1639.6000000000001, 1838.7999999999997, 1860.0, 0.1000829258528495, 0.03161101341111207, 0.045154601312516085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 121.5, 80, 245, 81.5, 245.0, 245.0, 245.0, 0.057342326521542794, 0.01545554894525958, 0.03376701454344756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 101.625, 79, 245, 81.5, 245.0, 245.0, 245.0, 0.05734150449772426, 0.015455327384152243, 0.03371053291760743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 140.5, 81, 734, 83.0, 487.5, 734.0, 734.0, 0.07362918240052171, 4.750689821620158, 0.042833941212357084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 144.64285714285717, 79, 479, 83.0, 361.0, 479.0, 479.0, 0.07356650411972424, 1.5634832130433411, 0.04286932027177569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b004c6d-7e41-4715-8945-5d928a5f4986", 2, 0, 0.0, 194.5, 178, 211, 194.5, 211.0, 211.0, 211.0, 0.019544037602728347, 0.02223515996794778, 0.012148222591930267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 83.64285714285714, 78, 86, 84.0, 86.0, 86.0, 86.0, 0.07362802072102868, 0.054717698992873855, 0.0369578150884851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 100.375, 78, 242, 80.5, 242.0, 242.0, 242.0, 0.0573419155066875, 0.015343442235187865, 0.03270281118740771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 112.92857142857143, 77, 343, 82.0, 293.5, 343.0, 343.0, 0.07362918240052171, 0.027600671471847357, 0.041549950168821195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 122.12500000000001, 80, 249, 83.5, 249.0, 249.0, 249.0, 0.05734027150618558, 0.04261322911738987, 0.02878212847087831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de9524dd-81dd-4d06-9a57-3db449abe328", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 85.625, 83, 89, 85.5, 89.0, 89.0, 89.0, 0.0545129945350723, 0.04290768905787917, 0.01937766602613898], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 1092.6666666666667, 391, 2743, 842.0, 2651.5000000000005, 2743.0, 2743.0, 0.09526909549932915, 0.01721170182360927, 0.06484624957327384], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f981770b-7753-46aa-9f6c-6f15f4527a6a", 3, 0, 0.0, 661.3333333333333, 201, 1483, 300.0, 1483.0, 1483.0, 1483.0, 0.04943316635908252, 0.03133020016312945, 0.03170030524980227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1498.9523809523812, 844, 2614, 1265.0, 2362.6000000000004, 2592.9999999999995, 2614.0, 0.10109130470363399, 0.05232264794231056, 0.04649805128458165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 245.5, 164, 491, 166.5, 491.0, 491.0, 491.0, 0.05730659025787966, 0.08881402220630373, 0.12888386461318052], "isController": false}, {"data": ["addBook", 57, 6, 10.526315789473685, 924.9824561403509, 428, 1745, 794.0, 1492.0, 1612.0999999999995, 1745.0, 0.2788445074970037, 94.7379660402857, 1.01219199453318], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5cd026e-c818-46b9-b645-c203e04f5def", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 163.53571428571425, 80, 351, 86.5, 327.90000000000003, 334.6, 351.0, 0.2458933613183397, 0.18273910933911766, 0.11886446665290834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bade0b1d-7934-4234-b567-8dde28a2d5b4", 1, 0, 0.0, 679.0, 679, 679, 679.0, 679.0, 679.0, 679.0, 1.4727540500736376, 0.2660737297496318, 1.0153948821796759], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 531.6249999999997, 385, 735, 481.0, 650.1, 728.3, 735.0, 0.24576062914721059, 72.26178499016957, 0.12360031641681002], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 125.64285714285712, 78, 279, 85.0, 245.3, 251.64999999999998, 279.0, 0.2460229943634375, 0.43534537674467644, 0.1196479015556561], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 800.1607142857143, 554, 1126, 798.5, 980.5000000000001, 1056.1499999999999, 1126.0, 0.24533319314293728, 220.7512384397685, 0.12314576296432593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 89.5, 82, 110, 88.5, 103.0, 110.0, 110.0, 0.15111120705473463, 0.1128906966766328, 0.0537153118827377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, 3.5294117647058822, 153.5529411764706, 79, 794, 89.0, 306.6, 383.84999999999985, 775.5399999999997, 0.7052361711483734, 1.5607401505471803, 0.33796077590498397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bade0b1d-7934-4234-b567-8dde28a2d5b4", 3, 0, 0.0, 529.6666666666666, 302, 980, 307.0, 980.0, 980.0, 980.0, 0.021862861557073, 0.025841162211501324, 0.01402012931882611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 101.08333333333333, 83, 245, 86.5, 202.70000000000016, 245.0, 245.0, 0.06010187267418274, 0.04654373538147159, 0.021364337552150895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7009e7e-cae7-4905-a028-ae850765d745", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 97.64285714285715, 82, 252, 85.5, 173.5, 252.0, 252.0, 0.08758101243650378, 0.07107404427220179, 0.03113231301453845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ea3c60b-43d8-4443-aead-91f33ecba9ef", 1, 0, 0.0, 1307.0, 1307, 1307, 1307.0, 1307.0, 1307.0, 1307.0, 0.7651109410864575, 0.13822805087987758, 0.527508129303749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 178.66666666666666, 162, 319, 165.5, 274.3000000000002, 319.0, 319.0, 0.05770784441965145, 0.08943588778709653, 0.12978629462739968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 259.71428571428567, 161, 820, 170.5, 575.0, 820.0, 820.0, 0.07353366003288005, 6.389524169923157, 0.16403504798071317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59978ae4-47da-48d4-aaaa-7f7b4bcc8ffa", 1, 0, 0.0, 677.0, 677, 677, 677.0, 677.0, 677.0, 677.0, 1.4771048744460857, 0.26685976735598227, 1.0183945716395864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 95.88235294117648, 83, 239, 85.0, 130.1999999999999, 239.0, 239.0, 0.09147752343438909, 0.07584415761308236, 0.032517400908318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52083993-8901-4dac-9bb9-c8ccf7a04027", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed55312a-e9ef-4d72-9b25-7b521bccd411", 3, 0, 0.0, 385.66666666666663, 192, 704, 261.0, 704.0, 704.0, 704.0, 0.02016657591707504, 0.023836210011360506, 0.01293234197807221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 107.6470588235294, 83, 248, 90.0, 244.8, 248.0, 248.0, 0.07773454111471333, 0.06035054705683309, 0.02763220016187075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d893f122-4f17-4ef1-b92b-30149e0c9ff5", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5959ff01-2654-475f-9cf5-bc4d509c65bf", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c3a9a5d-94b1-4974-be36-ea8b9a5c8efd", 3, 0, 0.0, 943.6666666666666, 181, 2438, 212.0, 2438.0, 2438.0, 2438.0, 0.03110677920408121, 0.02593244190808984, 0.019948032236992184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 86.92857142857142, 80, 146, 83.0, 116.0, 146.0, 146.0, 0.14417828675001546, 0.1071481213054314, 0.07237074159131635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 115.57142857142857, 77, 244, 81.5, 243.5, 244.0, 244.0, 0.14417234774370274, 0.054044517074125185, 0.08135841889275637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b680fdd-7b08-4de0-af49-efa57644e6c0", 3, 0, 0.0, 929.3333333333334, 468, 1320, 1000.0, 1320.0, 1320.0, 1320.0, 0.018700676964506113, 0.025780392885639127, 0.011992296100285496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 162.99999999999997, 78, 737, 81.5, 493.0, 737.0, 737.0, 0.14417531718569782, 9.302455759417738, 0.08387431259268413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 167.3571428571429, 79, 635, 83.0, 442.0, 635.0, 635.0, 0.14417234774370274, 3.0640445428191874, 0.08401337842151876], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 45.45454545454545, 0.3897116134060795], "isController": false}, {"data": ["401/Unauthorized", 6, 54.54545454545455, 0.4676539360872954], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1283, 11, "401/Unauthorized", 6, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
