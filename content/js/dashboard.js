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

    var data = {"OkPercent": 99.38977879481313, "KoPercent": 0.6102212051868803};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8411918795022921, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3392857142857143, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bee7833f-ecd7-4472-9098-6a04ffb0ee75"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39ee04a3-1282-4203-8122-f26f1d675068"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c24f823-ddd6-4584-ba2b-d972a99cbba1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0920080a-86e6-4fef-8b32-2c4dc71d4e94"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ecf04a1-ebd8-4871-9e80-d77afbbd8f81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3c65606-fbf9-4584-9bc4-ea64e9725187"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/238dd9cf-e572-4c65-bad7-2f7f05bc6062"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c46329f-4843-4a26-a128-73079794c4b9"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.15, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29b6c837-0bd0-4414-9754-cabe13d1d815"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c46329f-4843-4a26-a128-73079794c4b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d22ab85d-ce32-4388-95f0-d150b4a81e00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/931d4df9-f01f-4889-bd15-dbaaf0163292"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/03d94d0a-5895-4d8d-a122-6cc84c20184b"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/20c26b23-be7f-428b-a5a2-45ecf7a7eb21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc2d1ec7-dcc5-4f38-a39a-46e3e8c74b2a"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=238dd9cf-e572-4c65-bad7-2f7f05bc6062"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3c65606-fbf9-4584-9bc4-ea64e9725187"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fc2d1ec7-dcc5-4f38-a39a-46e3e8c74b2a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.425, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c24f823-ddd6-4584-ba2b-d972a99cbba1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/577fb263-0e47-49ce-859a-abc516f00f07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59ca4da8-8e13-4591-8017-534abcdd76f3"], "isController": false}, {"data": [0.4426229508196721, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bee7833f-ecd7-4472-9098-6a04ffb0ee75"], "isController": false}, {"data": [0.8303571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/39ee04a3-1282-4203-8122-f26f1d675068"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9831460674157303, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ecf04a1-ebd8-4871-9e80-d77afbbd8f81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83e3ace3-647a-491e-b975-30c0c21e7d46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0920080a-86e6-4fef-8b32-2c4dc71d4e94"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03d94d0a-5895-4d8d-a122-6cc84c20184b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d22ab85d-ce32-4388-95f0-d150b4a81e00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29b6c837-0bd0-4414-9754-cabe13d1d815"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=931d4df9-f01f-4889-bd15-dbaaf0163292"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20c26b23-be7f-428b-a5a2-45ecf7a7eb21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1311, 8, 0.6102212051868803, 288.09687261632354, 79, 1783, 98.0, 804.8, 972.3999999999999, 1286.5599999999986, 5.154740513272179, 708.938286352274, 3.7629309317360584], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1374.1964285714287, 980, 1804, 1375.0, 1644.0, 1702.8, 1804.0, 0.24990628514307137, 300.7206037970136, 1.228787251655629], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bee7833f-ecd7-4472-9098-6a04ffb0ee75", 3, 0, 0.0, 255.66666666666666, 172, 355, 240.0, 355.0, 355.0, 355.0, 0.02645292701637436, 0.026530425825992646, 0.016963628327557777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39ee04a3-1282-4203-8122-f26f1d675068", 1, 0, 0.0, 1046.0, 1046, 1046, 1046.0, 1046.0, 1046.0, 1046.0, 0.9560229445506692, 0.17271898900573612, 0.6591330066921606], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 569.0714285714287, 382, 1190, 523.5, 956.5, 1190.0, 1190.0, 0.07671316945939134, 0.013859312841784568, 0.05214098236693005], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 569.0714285714287, 382, 1190, 523.5, 956.5, 1190.0, 1190.0, 0.07969442879018165, 0.014397919263851177, 0.05416730706832659], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c24f823-ddd6-4584-ba2b-d972a99cbba1", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 82.0769230769231, 81, 85, 82.0, 84.6, 85.0, 85.0, 0.08786871062805851, 0.043815542454105495, 0.04897730114634871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 95.61538461538461, 82, 240, 83.0, 179.99999999999994, 240.0, 240.0, 0.08786752281176073, 0.06529998521459954, 0.04410537766137209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 222.76923076923077, 80, 715, 82.0, 688.6, 715.0, 715.0, 0.08749436334389996, 3.977838687315337, 0.050365783225984485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 211.15384615384616, 80, 953, 82.0, 928.6, 953.0, 953.0, 0.08739025800293093, 12.117454922592398, 0.050220513350542485], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 208.0714285714286, 161, 288, 191.0, 280.5, 288.0, 288.0, 0.07731047888319492, 0.18891346161810832, 0.049980016621752964], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0920080a-86e6-4fef-8b32-2c4dc71d4e94", 3, 0, 0.0, 281.0, 179, 376, 288.0, 376.0, 376.0, 376.0, 0.056289402581807264, 0.025469488798408886, 0.03609704527544281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ecf04a1-ebd8-4871-9e80-d77afbbd8f81", 1, 0, 0.0, 1105.0, 1105, 1105, 1105.0, 1105.0, 1105.0, 1105.0, 0.9049773755656109, 0.1634968891402715, 0.6239394796380091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 82.44444444444444, 81, 85, 82.0, 84.1, 85.0, 85.0, 0.10754936814746213, 0.07992682535177606, 0.05398474143339407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 108.72222222222223, 79, 247, 82.0, 242.5, 247.0, 247.0, 0.10755001075500108, 0.037752201040845104, 0.06083530881790588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 580.0, 476, 632, 632.0, 632.0, 632.0, 632.0, 0.053646149994635385, 15.773749318246844, 0.030595069918815495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 820.0, 716, 884, 860.0, 884.0, 884.0, 884.0, 0.05342831700801425, 48.07489356077471, 0.030418660952804988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 187.66666666666666, 82, 242, 239.0, 242.0, 242.0, 242.0, 0.05417900744058369, 0.09587144676009536, 0.02999950900274507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 96.41666666666667, 82, 246, 83.0, 197.40000000000018, 246.0, 246.0, 0.06650078415507983, 0.049420992912124755, 0.0333802764215928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 82.33333333333334, 81, 85, 82.0, 84.7, 85.0, 85.0, 0.06650152122229795, 0.017794352358310197, 0.037926648822091805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 137.25, 80, 252, 83.0, 249.9, 252.0, 252.0, 0.06650115268664657, 0.017924138810072706, 0.03909540421617308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 95.08333333333333, 79, 244, 81.5, 196.00000000000017, 244.0, 244.0, 0.06650188976203408, 0.017924337474923245, 0.03916078078760405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3c65606-fbf9-4584-9bc4-ea64e9725187", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/238dd9cf-e572-4c65-bad7-2f7f05bc6062", 3, 0, 0.0, 283.0, 161, 434, 254.0, 434.0, 434.0, 434.0, 0.03774059630142156, 0.0308976561517172, 0.02420214020631526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 82.66666666666667, 82, 83, 83.0, 83.0, 83.0, 83.0, 0.05417900744058369, 0.0402638912717619, 0.03042278249837463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c46329f-4843-4a26-a128-73079794c4b9", 1, 0, 0.0, 892.0, 892, 892, 892.0, 892.0, 892.0, 892.0, 1.1210762331838564, 0.20253818665919282, 0.7729295123318386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 595.6875000000001, 82, 1030, 798.0, 991.5, 1030.0, 1030.0, 0.08328301651085802, 46.844795673577416, 0.044488095733827476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 140.44444444444446, 80, 976, 82.0, 316.30000000000103, 976.0, 976.0, 0.10755001075500108, 5.403693680017805, 0.06271416642766664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 410.9375, 80, 647, 553.0, 646.3, 647.0, 647.0, 0.08328301651085802, 15.313400334953881, 0.04456942680463886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 140.16666666666669, 80, 639, 82.0, 284.40000000000055, 639.0, 639.0, 0.10755065337021923, 1.7842368646295776, 0.06281957108201933], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 540.1428571428571, 172, 1105, 451.5, 1075.5, 1105.0, 1105.0, 0.0798039103916092, 0.01441769865473408, 0.055021055406714925], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 234.66666666666666, 164, 490, 167.5, 443.8000000000002, 490.0, 490.0, 0.06647021026743181, 0.10301584345157645, 0.14949306078700728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 404.5, 101, 1030, 381.0, 950.3000000000004, 1027.1, 1030.0, 0.09169685021319518, 0.05632550662509742, 0.04146058754756774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 84.1875, 82, 98, 83.0, 90.30000000000001, 98.0, 98.0, 0.08328258300931203, 0.061892622724693806, 0.04180395279959608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 187.81250000000003, 80, 327, 241.5, 271.00000000000006, 327.0, 327.0, 0.08328605114804616, 0.1004678658990469, 0.04312737170044089], "isController": false}, {"data": ["login", 20, 0, 0.0, 1859.95, 953, 2829, 1737.5, 2741.0, 2824.9, 2829.0, 0.09137927883473143, 16.526437845813458, 0.16060086730358025], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/29b6c837-0bd0-4414-9754-cabe13d1d815", 3, 0, 0.0, 266.0, 211, 348, 239.0, 348.0, 348.0, 348.0, 0.015753572122478774, 0.021717570943586458, 0.010102388372813536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c46329f-4843-4a26-a128-73079794c4b9", 3, 0, 0.0, 238.33333333333331, 165, 381, 169.0, 381.0, 381.0, 381.0, 0.020527136874948684, 0.028298315320770727, 0.013163561081916962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d22ab85d-ce32-4388-95f0-d150b4a81e00", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 87.94444444444444, 83, 104, 86.5, 95.9, 104.0, 104.0, 0.10906909527185472, 0.08829910154332771, 0.03877065495991711], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/931d4df9-f01f-4889-bd15-dbaaf0163292", 3, 0, 0.0, 233.0, 162, 354, 183.0, 354.0, 354.0, 354.0, 0.031258791535119256, 0.026059168333802216, 0.02004551410292478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03d94d0a-5895-4d8d-a122-6cc84c20184b", 3, 0, 0.0, 374.33333333333337, 181, 760, 182.0, 760.0, 760.0, 760.0, 0.02384775592616735, 0.02391762239860729, 0.015292994522965389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 680.9375, 166, 1113, 882.5, 1074.5, 1113.0, 1113.0, 0.08324401943747854, 62.29137170860952, 0.17390602400549413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20c26b23-be7f-428b-a5a2-45ecf7a7eb21", 3, 0, 0.0, 303.3333333333333, 171, 466, 273.0, 466.0, 466.0, 466.0, 0.023530149965489112, 0.03224672244619439, 0.015089321429691913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc2d1ec7-dcc5-4f38-a39a-46e3e8c74b2a", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 0.6251351643598616, 2.3856509515570936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 356.9230769230769, 165, 1193, 173.0, 1107.0, 1193.0, 1193.0, 0.08734035191443333, 16.189831997893755, 0.19299252190227287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 903.3333333333334, 799, 967, 944.0, 967.0, 967.0, 967.0, 0.05334945672469902, 63.82449751480448, 0.12029677302473638], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 839.217391304348, 142, 1428, 889.0, 1327.0000000000002, 1415.7999999999997, 1428.0, 0.08992137743911736, 0.02846695780341623, 0.04056999646178928], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 260.49999999999994, 165, 1058, 167.0, 401.900000000001, 1058.0, 1058.0, 0.10749541651487916, 7.301890939554729, 0.24023172727218434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 87.6111111111111, 83, 96, 85.5, 96.0, 96.0, 96.0, 0.1195560485397557, 0.09281939315342362, 0.04249843912936629], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=238dd9cf-e572-4c65-bad7-2f7f05bc6062", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 340.7647058823529, 163, 1188, 327.0, 637.5999999999995, 1188.0, 1188.0, 0.11531443533234298, 8.283270122368965, 0.2576093219002462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3c65606-fbf9-4584-9bc4-ea64e9725187", 3, 0, 0.0, 284.3333333333333, 180, 389, 284.0, 389.0, 389.0, 389.0, 0.04846839860411012, 0.03116051017028564, 0.03108162280276593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 109.66666666666666, 82, 244, 83.0, 243.4, 244.0, 244.0, 0.06539652090508785, 0.04860034414919126, 0.03282598803243667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 129.08333333333334, 80, 329, 82.0, 303.80000000000007, 329.0, 329.0, 0.06539687729910897, 0.025684027493937164, 0.0368389635957383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 208.33333333333337, 80, 958, 84.0, 743.8000000000008, 958.0, 958.0, 0.06539723369701461, 4.919869868020208, 0.03797808102717255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 140.5, 81, 474, 82.0, 403.2000000000003, 474.0, 474.0, 0.06539687729910897, 1.618562069129949, 0.03804173819450121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc2d1ec7-dcc5-4f38-a39a-46e3e8c74b2a", 3, 0, 0.0, 719.3333333333334, 231, 1129, 798.0, 1129.0, 1129.0, 1129.0, 0.10318142734307824, 0.04668690885640585, 0.06616777730008598], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 951.2857142857146, 644, 1456, 880.5, 1294.3, 1339.7, 1456.0, 0.2506748076294668, 299.89421858843224, 0.49498482522146675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 839.217391304348, 142, 1428, 889.0, 1327.0000000000002, 1415.7999999999997, 1428.0, 0.09043404409249436, 0.028629255806455416, 0.04080129723704336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 82.18181818181819, 80, 85, 82.0, 84.8, 85.0, 85.0, 0.05274666257480436, 0.014216873897115236, 0.031060778840436547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 114.0, 80, 246, 83.0, 245.4, 246.0, 246.0, 0.05274691550423653, 0.014216942069501253, 0.031009417122607807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 145.7777777777778, 81, 884, 83.0, 308.0000000000009, 884.0, 884.0, 0.1140713326066567, 5.731348000345383, 0.0665168556237167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 150.22222222222223, 80, 642, 84.5, 286.50000000000057, 642.0, 642.0, 0.11424726917291324, 1.8953319478207333, 0.06673101670548959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 111.45454545454547, 80, 243, 83.0, 243.0, 243.0, 243.0, 0.05274691550423653, 0.014113920750157041, 0.030082225248509897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 83.05555555555554, 80, 90, 83.0, 86.4, 90.0, 90.0, 0.11465406321260685, 0.08520677939921271, 0.05755096532351555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 114.54545454545455, 82, 243, 84.0, 242.8, 243.0, 243.0, 0.05274590380106163, 0.03919886014903116, 0.026475971243892265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 100.33333333333333, 79, 243, 82.0, 238.5, 243.0, 243.0, 0.114654793525826, 0.04024612164236622, 0.06485410575630761], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 85.81818181818181, 83, 90, 86.0, 90.0, 90.0, 90.0, 0.05283990469602644, 0.04159078436034894, 0.018782934872415648], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 528.6428571428571, 348, 1191, 395.5, 994.5, 1191.0, 1191.0, 0.07891369659938334, 0.014256869014537031, 0.05371371731422871], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1061.6500000000003, 627, 1783, 1006.5, 1557.7, 1771.7499999999998, 1783.0, 0.09169642979950576, 0.047460066204822314, 0.04217677581598361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 229.72727272727272, 165, 489, 173.0, 488.4, 489.0, 489.0, 0.052724919714326794, 0.08171332772132484, 0.11857958017782677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c24f823-ddd6-4584-ba2b-d972a99cbba1", 3, 0, 0.0, 485.3333333333333, 213, 887, 356.0, 887.0, 887.0, 887.0, 0.05685802551030078, 0.03655423189545705, 0.03646168953622804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/577fb263-0e47-49ce-859a-abc516f00f07", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.9237104668674698, 3.5944559487951806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59ca4da8-8e13-4591-8017-534abcdd76f3", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["addBook", 61, 3, 4.918032786885246, 842.1803278688526, 426, 1608, 709.0, 1407.6, 1545.9, 1608.0, 0.30406651579650473, 96.54409790069487, 1.1066562761696592], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 156.21428571428578, 81, 411, 84.0, 332.0, 334.0, 411.0, 0.2517544135695629, 0.1870948327406615, 0.1216976901532555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bee7833f-ecd7-4472-9098-6a04ffb0ee75", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 522.392857142857, 394, 729, 485.5, 644.2, 663.3999999999999, 729.0, 0.2516277167930048, 73.98690356367754, 0.1265510489730444], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 122.67857142857142, 80, 345, 84.5, 246.60000000000002, 264.2499999999999, 345.0, 0.2520773877580417, 0.44605881505622225, 0.12259232334326639], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39ee04a3-1282-4203-8122-f26f1d675068", 3, 0, 0.0, 432.66666666666663, 189, 791, 318.0, 791.0, 791.0, 791.0, 0.018455519122993733, 0.02544242300972606, 0.011835082250096891], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 792.1428571428572, 558, 1128, 789.5, 965.5, 1039.3999999999999, 1128.0, 0.2510884234785611, 225.92980481237868, 0.1260346188163871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 86.11764705882354, 83, 97, 85.0, 91.39999999999999, 97.0, 97.0, 0.11109078077214628, 0.08299262430731631, 0.039489300977598875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 3, 1.6853932584269662, 138.6573033707865, 81, 482, 91.0, 249.0, 284.09999999999997, 406.16000000000076, 0.7791775736935643, 1.6156674813194365, 0.37712345039965683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 100.08333333333333, 82, 245, 85.5, 200.60000000000016, 245.0, 245.0, 0.06763688013617558, 0.052378951121081284, 0.024042797235906164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ecf04a1-ebd8-4871-9e80-d77afbbd8f81", 3, 0, 0.0, 573.0, 193, 1191, 335.0, 1191.0, 1191.0, 1191.0, 0.024481602076039857, 0.024553325519622006, 0.015699464872981288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 87.76923076923076, 82, 97, 87.0, 96.2, 97.0, 97.0, 0.09363363320104581, 0.07598588788092683, 0.033283830551934256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83e3ace3-647a-491e-b975-30c0c21e7d46", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0920080a-86e6-4fef-8b32-2c4dc71d4e94", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 319.25, 165, 1041, 168.0, 875.7000000000006, 1041.0, 1041.0, 0.06536730980836483, 6.609700006604822, 0.14561887521925285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 257.27777777777777, 164, 975, 169.5, 394.5000000000009, 975.0, 975.0, 0.11401136313252555, 7.74450266303625, 0.2547936235978186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03d94d0a-5895-4d8d-a122-6cc84c20184b", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d22ab85d-ce32-4388-95f0-d150b4a81e00", 3, 0, 0.0, 252.66666666666669, 172, 402, 184.0, 402.0, 402.0, 402.0, 0.01888348261775425, 0.02603240523638973, 0.012109524985994751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 99.33333333333333, 83, 245, 85.5, 199.10000000000016, 245.0, 245.0, 0.0651059327781244, 0.053979430594362915, 0.02314312454222391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29b6c837-0bd0-4414-9754-cabe13d1d815", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=931d4df9-f01f-4889-bd15-dbaaf0163292", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 90.6875, 82, 138, 86.0, 110.00000000000003, 138.0, 138.0, 0.07890713616412684, 0.06126091137742269, 0.028049021058341964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20c26b23-be7f-428b-a5a2-45ecf7a7eb21", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 112.05882352941178, 80, 256, 83.0, 248.0, 256.0, 256.0, 0.11550168496575715, 0.08583670142474725, 0.05797643171132732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 148.47058823529414, 80, 245, 83.0, 245.0, 245.0, 245.0, 0.11550325447405253, 0.04111087802856328, 0.06530233401502902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 188.64705882352942, 80, 1105, 83.0, 416.9999999999994, 1105.0, 1105.0, 0.11538017768547364, 6.136286100845669, 0.06724766100625089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 175.64705882352948, 80, 559, 86.0, 306.19999999999976, 559.0, 559.0, 0.11538096078404755, 2.0249066983738073, 0.06736079414339817], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 62.5, 0.38138825324180015], "isController": false}, {"data": ["401/Unauthorized", 3, 37.5, 0.2288329519450801], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1311, 8, "406/Not Acceptable", 5, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
