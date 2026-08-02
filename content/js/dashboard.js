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

    var data = {"OkPercent": 98.88888888888889, "KoPercent": 1.1111111111111112};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7764505119453925, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.00909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6147b5d2-2462-4b72-bf03-9d5980b93be8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5834d04c-7956-4917-9059-ba1023098e3b"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24a6c9ea-39e1-4800-8b3e-5dc846a1ea2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0317897d-edc6-4ed8-9270-7e5e7cac6a01"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9ff85f6-d7d6-42bb-a310-a864bf20cf7d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e1321ed7-5a4b-45d7-9834-7ad9eb0a8e43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f78e79ed-e7a8-405e-82a0-010e3dbdf6a9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/06c9b25d-9d23-4f09-8ee7-5bab8ff6f8ed"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88c73bad-f5f8-4601-9696-5dc541d2b994"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9ff85f6-d7d6-42bb-a310-a864bf20cf7d"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5012c6a5-aad8-4471-8321-37252726f037"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d02bc55-9f89-41ac-af1e-b579fbf7b9fb"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b68f3ca0-0cc4-470d-beb7-b6093409adc9"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24a6c9ea-39e1-4800-8b3e-5dc846a1ea2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0317897d-edc6-4ed8-9270-7e5e7cac6a01"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6147b5d2-2462-4b72-bf03-9d5980b93be8"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a5c5d63-7e2a-40c5-ab5d-286d1d46fad3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af87ce84-4775-4a10-93a2-5fb9a6e1be6f"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5834d04c-7956-4917-9059-ba1023098e3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.18421052631578946, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f78e79ed-e7a8-405e-82a0-010e3dbdf6a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4818181818181818, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9550898203592815, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/88c73bad-f5f8-4601-9696-5dc541d2b994"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1321ed7-5a4b-45d7-9834-7ad9eb0a8e43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06c9b25d-9d23-4f09-8ee7-5bab8ff6f8ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b68f3ca0-0cc4-470d-beb7-b6093409adc9"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a5c5d63-7e2a-40c5-ab5d-286d1d46fad3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d02bc55-9f89-41ac-af1e-b579fbf7b9fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5012c6a5-aad8-4471-8321-37252726f037"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1260, 14, 1.1111111111111112, 395.3912698412699, 101, 2543, 144.0, 1088.0, 1305.6500000000003, 1782.1400000000026, 4.921067637340749, 694.7161775460668, 3.6033516962060914], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1904.8727272727274, 1439, 2693, 1874.0, 2243.6, 2429.199999999999, 2693.0, 0.24393380966953623, 293.53409432366027, 1.1994206364122215], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6147b5d2-2462-4b72-bf03-9d5980b93be8", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5834d04c-7956-4917-9059-ba1023098e3b", 3, 0, 0.0, 358.6666666666667, 228, 536, 312.0, 536.0, 536.0, 536.0, 0.05472854640980736, 0.03518518201802393, 0.03509610560785172], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 745.9999999999999, 459, 1583, 595.0, 1510.6, 1583.0, 1583.0, 0.07187959614725364, 0.012986059850822192, 0.04885566300633646], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 745.9999999999999, 459, 1583, 595.0, 1510.6, 1583.0, 1583.0, 0.07182399805522713, 0.012976015273649433, 0.04881787367816219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24a6c9ea-39e1-4800-8b3e-5dc846a1ea2f", 3, 0, 0.0, 309.3333333333333, 217, 457, 254.0, 457.0, 457.0, 457.0, 0.02069750595053296, 0.02482757468350064, 0.013272814688330057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 163.1176470588235, 107, 339, 114.0, 338.2, 339.0, 339.0, 0.10489230028814531, 0.04660139306229986, 0.05878500009255203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 141.0, 103, 352, 115.0, 329.59999999999997, 352.0, 352.0, 0.1048819461153578, 0.0779444931579954, 0.052645820608685466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 284.5882352941176, 108, 906, 302.0, 824.4, 906.0, 906.0, 0.10489294749182453, 3.6534175047818844, 0.06070751642808663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 289.5294117647059, 107, 1198, 117.0, 960.3999999999997, 1198.0, 1198.0, 0.10489165309245274, 11.128674196499087, 0.06060433403055432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0317897d-edc6-4ed8-9270-7e5e7cac6a01", 3, 0, 0.0, 604.0, 207, 1052, 553.0, 1052.0, 1052.0, 1052.0, 0.021895732521731513, 0.02588001457890857, 0.014041208680928086], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 255.69230769230765, 197, 402, 228.0, 381.2, 402.0, 402.0, 0.07255476489465607, 0.17341853285893677, 0.04690552183619366], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9ff85f6-d7d6-42bb-a310-a864bf20cf7d", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1321ed7-5a4b-45d7-9834-7ad9eb0a8e43", 3, 0, 0.0, 445.6666666666667, 295, 640, 402.0, 640.0, 640.0, 640.0, 0.023086157539939055, 0.023153792767106843, 0.014804599724505187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f78e79ed-e7a8-405e-82a0-010e3dbdf6a9", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 0.6166008959044369, 2.353082337883959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06c9b25d-9d23-4f09-8ee7-5bab8ff6f8ed", 3, 0, 0.0, 382.6666666666667, 223, 555, 370.0, 555.0, 555.0, 555.0, 0.04870683356874969, 0.031313800878346565, 0.031234525433084928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88c73bad-f5f8-4601-9696-5dc541d2b994", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 124.94444444444444, 104, 343, 113.5, 140.5000000000003, 343.0, 343.0, 0.09721847150958682, 0.07224927423710505, 0.048799115581960574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 122.55555555555559, 101, 348, 110.5, 140.10000000000034, 348.0, 348.0, 0.09722477287212782, 0.034127836397714134, 0.054994872068403026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 790.2, 633, 912, 813.0, 912.0, 912.0, 912.0, 0.05630313608467991, 16.554991448961207, 0.032110382298294014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1120.0, 1024, 1176, 1138.0, 1176.0, 1176.0, 1176.0, 0.05616904636193087, 50.54100665111721, 0.03197905666895087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 325.2, 307, 343, 327.0, 343.0, 343.0, 343.0, 0.056625141562853906, 0.10019995753114383, 0.031353960220838056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 135.60000000000002, 108, 346, 111.0, 323.5000000000001, 346.0, 346.0, 0.05436259853220984, 0.0404003295732536, 0.027287476216363144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 132.9, 106, 339, 109.5, 316.6000000000001, 339.0, 339.0, 0.054298544256028494, 0.014529102662257624, 0.030967138521016253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 151.79999999999998, 107, 319, 113.0, 317.7, 319.0, 319.0, 0.054363780674763246, 0.014652737759994781, 0.03195995699824949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 177.39999999999998, 107, 339, 115.0, 338.4, 339.0, 339.0, 0.054366440683494895, 0.014653454715473233, 0.03201461301967521], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 200.6, 112, 331, 120.0, 331.0, 331.0, 331.0, 0.056744671675329685, 0.04217060072746669, 0.03186346309894001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 693.1578947368422, 108, 1356, 839.0, 1350.0, 1356.0, 1356.0, 0.08924168056175288, 42.27445743113125, 0.0484279226650384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 206.0, 103, 1371, 111.5, 444.0000000000015, 1371.0, 1371.0, 0.09709942441618971, 4.878619187183415, 0.056620258985742564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 544.1578947368422, 112, 922, 647.0, 910.0, 922.0, 922.0, 0.08923623178876375, 13.821085171286597, 0.048512110589522726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 184.6111111111111, 102, 507, 115.0, 356.7000000000002, 507.0, 507.0, 0.09710047201618341, 1.6108711227242076, 0.05671569453809845], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 537.4615384615385, 293, 805, 527.0, 751.4, 805.0, 805.0, 0.07188317325503597, 0.012986706105646147, 0.04956007843560097], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 338.20000000000005, 224, 686, 235.0, 662.3000000000001, 686.0, 686.0, 0.05426259841878788, 0.08409642938536756, 0.1220378556235044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 663.6315789473683, 121, 2288, 651.0, 957.0, 2288.0, 2288.0, 0.08450040248875922, 0.051905032388114794, 0.038206724953413596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 148.7894736842105, 108, 344, 115.0, 325.0, 344.0, 344.0, 0.08937727559247725, 0.06642197922448749, 0.04486320278763019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 193.3684210526316, 107, 344, 115.0, 341.0, 344.0, 344.0, 0.08937937782544678, 0.09457051150877094, 0.04702340210841248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9ff85f6-d7d6-42bb-a310-a864bf20cf7d", 3, 0, 0.0, 311.6666666666667, 197, 494, 244.0, 494.0, 494.0, 494.0, 0.034422222987160515, 0.027979261327779878, 0.022074146902573633], "isController": false}, {"data": ["login", 19, 0, 0.0, 2978.368421052631, 1751, 4131, 2971.0, 4058.0, 4131.0, 4131.0, 0.08142729185684225, 25.746940550309212, 0.1583889730839944], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 120.27777777777779, 116, 128, 119.0, 125.30000000000001, 128.0, 128.0, 0.09805256707067957, 0.07938044736483726, 0.03485462345090563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5012c6a5-aad8-4471-8321-37252726f037", 1, 0, 0.0, 805.0, 805, 805, 805.0, 805.0, 805.0, 805.0, 1.2422360248447206, 0.22442740683229812, 0.8564635093167702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d02bc55-9f89-41ac-af1e-b579fbf7b9fb", 3, 0, 0.0, 358.3333333333333, 197, 548, 330.0, 548.0, 548.0, 548.0, 0.024808355454116946, 0.024881036182986427, 0.015909003985875775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 858.2631578947369, 229, 1478, 962.0, 1471.0, 1478.0, 1478.0, 0.08918680410822584, 56.22253893561417, 0.18857306540913274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 481.9411764705882, 228, 1315, 436.0, 1070.9999999999998, 1315.0, 1315.0, 0.10480758560313683, 14.894652241109851, 0.2325598925259861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1321.0, 1136, 1493, 1294.0, 1493.0, 1493.0, 1493.0, 0.056092799928201216, 67.10648972660368, 0.12648269046310215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b68f3ca0-0cc4-470d-beb7-b6093409adc9", 3, 0, 0.0, 401.0, 289, 530, 384.0, 530.0, 530.0, 530.0, 0.019204424699450752, 0.026474849805395162, 0.012315337453749345], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1032.304347826087, 198, 2020, 1066.0, 1677.6000000000004, 1969.9999999999993, 2020.0, 0.09198307511417898, 0.02869784459659423, 0.04150017646752997], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24a6c9ea-39e1-4800-8b3e-5dc846a1ea2f", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 124.12500000000001, 108, 180, 118.0, 161.10000000000002, 180.0, 180.0, 0.08072857539292111, 0.06267501702868387, 0.02869648578420243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 372.72222222222223, 217, 1477, 230.0, 761.5000000000011, 1477.0, 1477.0, 0.0970397485592293, 6.591663940231601, 0.2168653061334512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0317897d-edc6-4ed8-9270-7e5e7cac6a01", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 347.72222222222223, 222, 571, 340.0, 475.60000000000014, 571.0, 571.0, 0.09754511461550967, 0.15117587587384165, 0.21938124898390504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 146.14285714285714, 103, 341, 117.0, 341.0, 341.0, 341.0, 0.03752626838787151, 0.027888174065595916, 0.018836427686880815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 110.42857142857143, 102, 116, 112.0, 116.0, 116.0, 116.0, 0.037528682636014665, 0.010041854533464862, 0.021403076815852115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 178.85714285714286, 109, 347, 115.0, 347.0, 347.0, 347.0, 0.03752807904485678, 0.010114990055059054, 0.022062405844730255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 170.99999999999997, 103, 348, 114.0, 348.0, 348.0, 348.0, 0.03752727428684776, 0.010114773147626935, 0.02209858046383711], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6147b5d2-2462-4b72-bf03-9d5980b93be8", 3, 0, 0.0, 306.0, 224, 469, 225.0, 469.0, 469.0, 469.0, 0.0268173204133443, 0.02179780243233096, 0.01719730508277613], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1265.636363636364, 835, 2200, 1217.0, 1754.6, 1935.1999999999996, 2200.0, 0.24482092462186295, 292.89093937232366, 0.48342569295449894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1032.304347826087, 198, 2020, 1066.0, 1677.6000000000004, 1969.9999999999993, 2020.0, 0.0910465604192892, 0.028405660918857722, 0.041077647376671494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 144.33333333333331, 107, 318, 109.5, 318.0, 318.0, 318.0, 0.03449306689355439, 0.009296959436153333, 0.02031183528985674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 146.0, 102, 322, 113.5, 322.0, 322.0, 322.0, 0.03449227373068433, 0.00929674565397351, 0.020277684361203092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a5c5d63-7e2a-40c5-ab5d-286d1d46fad3", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 231.6875, 104, 1361, 115.5, 647.7000000000007, 1361.0, 1361.0, 0.07979691684662533, 4.507751405485539, 0.04648326259669142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af87ce84-4775-4a10-93a2-5fb9a6e1be6f", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 211.68749999999997, 108, 601, 117.0, 417.6000000000002, 601.0, 601.0, 0.07979492703751359, 1.4865603991491865, 0.04656002822745544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5834d04c-7956-4917-9059-ba1023098e3b", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 168.81249999999997, 110, 338, 116.0, 330.3, 338.0, 338.0, 0.07979373319967882, 0.059299834926714444, 0.04005271373499504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 110.5, 102, 121, 111.5, 121.0, 121.0, 121.0, 0.034533566626761214, 0.00924042700755134, 0.019694924716824755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 227.5, 108, 458, 212.0, 379.6000000000001, 458.0, 458.0, 0.07979731482035629, 0.028842755027230833, 0.04509054813274283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 112.33333333333333, 106, 119, 112.0, 119.0, 119.0, 119.0, 0.034534361689881436, 0.02566469652929665, 0.017334630770116266], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 533.1538461538461, 457, 640, 530.0, 636.4, 640.0, 640.0, 0.0719480203225485, 0.012998421640304174, 0.048972431801578425], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 162.66666666666666, 116, 355, 125.0, 355.0, 355.0, 355.0, 0.03346122958864995, 0.026337647508253768, 0.011894421455340412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1645.7894736842109, 1241, 2543, 1578.0, 2131.0, 2543.0, 2543.0, 0.08141089363452507, 0.04213649768193192, 0.03744583095884894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 262.5, 217, 438, 229.5, 438.0, 438.0, 438.0, 0.03447047603727407, 0.05342250534292378, 0.07752490850961151], "isController": false}, {"data": ["addBook", 56, 6, 10.714285714285714, 1123.9285714285718, 583, 2140, 954.0, 1984.5, 2082.2999999999997, 2140.0, 0.2819028441983388, 85.37643252107979, 1.0261796422728418], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f78e79ed-e7a8-405e-82a0-010e3dbdf6a9", 3, 0, 0.0, 639.6666666666666, 302, 986, 631.0, 986.0, 986.0, 986.0, 0.07203054094936254, 0.03259194398424932, 0.04619146017911594], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 196.92727272727276, 105, 470, 117.0, 460.0, 463.59999999999997, 470.0, 0.24631424323307596, 0.18305189365270588, 0.11906792031286387], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 706.6545454545454, 505, 1088, 664.0, 992.8, 1018.2, 1088.0, 0.24611033797661502, 72.36461099744045, 0.12377619536909838], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 148.39999999999998, 102, 478, 115.0, 327.59999999999997, 340.59999999999997, 478.0, 0.2467573836538936, 0.4366449015438039, 0.12000505572230373], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1066.8727272727274, 720, 1732, 1049.0, 1358.0, 1498.5999999999997, 1732.0, 0.24538453988168002, 220.7974403255472, 0.12317153662029642], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 133.27777777777777, 114, 337, 118.5, 154.3000000000003, 337.0, 337.0, 0.09708318950638592, 0.07252796872303245, 0.03451004001984812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 6, 3.592814371257485, 185.99401197604777, 106, 759, 123.0, 349.2000000000003, 400.59999999999997, 652.2399999999989, 0.7251505664424633, 1.5532634557223932, 0.3480941526051143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 120.28571428571428, 115, 124, 121.0, 124.0, 124.0, 124.0, 0.03952881650723377, 0.030611671377183965, 0.014051258992805755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88c73bad-f5f8-4601-9696-5dc541d2b994", 3, 0, 0.0, 363.6666666666667, 244, 517, 330.0, 517.0, 517.0, 517.0, 0.0329840686948204, 0.027497460913878596, 0.021151893010675844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1321ed7-5a4b-45d7-9834-7ad9eb0a8e43", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06c9b25d-9d23-4f09-8ee7-5bab8ff6f8ed", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 123.58823529411765, 106, 138, 123.0, 134.8, 138.0, 138.0, 0.10567473317129875, 0.08575752272006763, 0.0375640653069851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b68f3ca0-0cc4-470d-beb7-b6093409adc9", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 326.7142857142857, 226, 689, 233.0, 689.0, 689.0, 689.0, 0.037502946660094724, 0.05812224252887727, 0.08434500601386538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 491.1875, 228, 1666, 431.5, 1057.7000000000007, 1666.0, 1666.0, 0.07974759884964089, 6.078734438315232, 0.17807895822222664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a5c5d63-7e2a-40c5-ab5d-286d1d46fad3", 3, 0, 0.0, 323.6666666666667, 244, 478, 249.0, 478.0, 478.0, 478.0, 0.023440796361988404, 0.027706227731243455, 0.015032021104530325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 146.79999999999998, 111, 362, 121.0, 339.70000000000005, 362.0, 362.0, 0.0571271879712993, 0.04736424080823545, 0.0203069300991728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 133.1052631578947, 110, 386, 118.0, 143.0, 386.0, 386.0, 0.0887854616143066, 0.06893011912438843, 0.031560457058210555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d02bc55-9f89-41ac-af1e-b579fbf7b9fb", 1, 0, 0.0, 671.0, 671, 671, 671.0, 671.0, 671.0, 671.0, 1.4903129657228018, 0.2692459947839046, 1.0275009314456036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 115.33333333333333, 104, 140, 114.0, 137.3, 140.0, 140.0, 0.0976054138469547, 0.07253683587649662, 0.04899334249739719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 147.33333333333331, 102, 341, 110.0, 339.2, 341.0, 341.0, 0.09760647239363607, 0.0261173568709534, 0.05566619128699557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 160.05555555555554, 102, 338, 114.0, 326.3, 338.0, 338.0, 0.09760964817144592, 0.026308850483710036, 0.057383797069541456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5012c6a5-aad8-4471-8321-37252726f037", 3, 0, 0.0, 561.3333333333334, 350, 811, 523.0, 811.0, 811.0, 811.0, 0.015589517608360137, 0.021491408551889708, 0.00999718414338199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 206.94444444444443, 107, 459, 116.0, 358.20000000000016, 459.0, 459.0, 0.09760911886079313, 0.026308707817948147, 0.057478807297908455], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 57.142857142857146, 0.6349206349206349], "isController": false}, {"data": ["401/Unauthorized", 6, 42.857142857142854, 0.47619047619047616], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1260, 14, "406/Not Acceptable", 8, "401/Unauthorized", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
