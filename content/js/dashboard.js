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

    var data = {"OkPercent": 97.71428571428571, "KoPercent": 2.2857142857142856};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8220183486238533, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d8d6230-4e07-4d9b-af6c-c36364a3e92e"], "isController": false}, {"data": [0.4838709677419355, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17a63ee8-744d-46f4-b419-dfeda087d8ce"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=356aeaee-9d17-4352-aacd-1131ade34c46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67cd17df-9f5c-47e3-b1b9-47e2dd460385"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1e40a33-4b89-41f7-ac59-db65f4b88075"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=982e5a46-5c8f-4d65-89be-82bb555b90a7"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f089e38-eb96-4453-b475-941119bf3788"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6634a869-c82c-462c-85bb-705be9835964"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.08695652173913043, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4555c52d-c44b-4532-9497-fcef7593d4ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f9ccbd10-fac4-40e3-b970-9c49b0a63e9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc02da37-10f6-4bae-b5e1-d1e2187a24fb"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dcceb72b-7249-4ef5-95c5-73f428dc53fc"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8697f6bf-8c6a-47e7-b722-8eb815ea041d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67cd17df-9f5c-47e3-b1b9-47e2dd460385"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/62760f8d-ca7c-4c23-ad26-90c09212ffb6"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d8d6230-4e07-4d9b-af6c-c36364a3e92e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/17a63ee8-744d-46f4-b419-dfeda087d8ce"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/356aeaee-9d17-4352-aacd-1131ade34c46"], "isController": false}, {"data": [0.4067796610169492, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8548387096774194, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1892f5aa-86a2-4f5a-a135-9b1c789b2995"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6634a869-c82c-462c-85bb-705be9835964"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1f089e38-eb96-4453-b475-941119bf3788"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/982e5a46-5c8f-4d65-89be-82bb555b90a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1892f5aa-86a2-4f5a-a135-9b1c789b2995"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80baa723-635d-4a93-b05b-26f512f65672"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e53f924f-d2e2-4889-994d-20e3c155bc6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4555c52d-c44b-4532-9497-fcef7593d4ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc02da37-10f6-4bae-b5e1-d1e2187a24fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9ccbd10-fac4-40e3-b970-9c49b0a63e9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8697f6bf-8c6a-47e7-b722-8eb815ea041d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dcceb72b-7249-4ef5-95c5-73f428dc53fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1400, 32, 2.2857142857142856, 268.3614285714286, 80, 2731, 91.0, 669.0, 822.0, 1144.99, 5.465590205662351, 778.8661204594121, 3.9949171536084602], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/8d8d6230-4e07-4d9b-af6c-c36364a3e92e", 3, 0, 0.0, 324.6666666666667, 159, 427, 388.0, 427.0, 427.0, 427.0, 0.046823786483533636, 0.030651899289839243, 0.030026972452005623], "isController": false}, {"data": ["see books", 62, 0, 0.0, 1202.3709677419354, 981, 1580, 1175.5, 1424.9, 1454.8, 1580.0, 0.2677214315324029, 322.1591023330088, 1.3163841872711413], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17a63ee8-744d-46f4-b419-dfeda087d8ce", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.5206457132564842, 1.9868966138328532], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 400.3125, 84, 959, 423.0, 675.5000000000002, 959.0, 959.0, 0.08585441238020627, 0.017350095177664976, 0.05758387070593791], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 400.3125, 84, 959, 423.0, 675.5000000000002, 959.0, 959.0, 0.0842149586820359, 0.01701878223853887, 0.056484263974419704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=356aeaee-9d17-4352-aacd-1131ade34c46", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 128.22727272727275, 82, 251, 83.5, 248.4, 250.7, 251.0, 0.11084240225715437, 0.0372262790961306, 0.06279166981559856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 100.68181818181819, 83, 257, 85.0, 205.2999999999999, 256.4, 257.0, 0.11083961004609921, 0.08237201488777489, 0.05563628863642089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 120.81818181818183, 81, 575, 84.0, 246.9, 526.0999999999992, 575.0, 0.11084296071624705, 1.509949966369238, 0.06483880221585155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 135.31818181818187, 81, 732, 84.0, 248.9, 659.849999999999, 732.0, 0.11084296071624705, 4.562003607749434, 0.06473055713702709], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 207.41176470588238, 83, 388, 187.0, 383.2, 388.0, 388.0, 0.08118937660886302, 0.135267433926175, 0.0524690077464217], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 111.83333333333331, 82, 249, 85.0, 248.1, 249.0, 249.0, 0.08707472462618338, 0.06471080609426323, 0.043707430134627204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 119.72222222222221, 82, 249, 83.5, 248.1, 249.0, 249.0, 0.08700906344410876, 0.03780211480362538, 0.048810422960725075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 516.6666666666666, 403, 576, 569.5, 576.0, 576.0, 576.0, 0.03693034936110495, 10.858748915170988, 0.02106183987000517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 735.6666666666667, 727, 747, 735.5, 747.0, 747.0, 747.0, 0.03685594240644733, 33.16304176315757, 0.0209834125224207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67cd17df-9f5c-47e3-b1b9-47e2dd460385", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 110.83333333333333, 83, 246, 84.0, 246.0, 246.0, 246.0, 0.03696607130755155, 0.06541261836844083, 0.02046851799939622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1e40a33-4b89-41f7-ac59-db65f4b88075", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 97.23076923076924, 83, 245, 85.0, 182.99999999999994, 245.0, 245.0, 0.11366915281506029, 0.08447482938697351, 0.05705658647162205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 132.76923076923077, 82, 248, 83.0, 246.4, 248.0, 248.0, 0.11367014672192785, 0.04354850873511358, 0.06409315815014952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 197.3846153846154, 82, 750, 85.0, 550.3999999999999, 750.0, 750.0, 0.11367114064617671, 7.896088250885324, 0.06607476609976828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 134.3846153846154, 81, 583, 83.0, 449.39999999999986, 583.0, 583.0, 0.11367213458780735, 2.599310780708964, 0.06618635180214053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 86.66666666666666, 82, 102, 83.5, 102.0, 102.0, 102.0, 0.03700231881197888, 0.0274987935702304, 0.020777669254773302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 173.38888888888889, 80, 737, 83.0, 729.8, 737.0, 737.0, 0.08700990462747676, 8.719920026417174, 0.05032148347053506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 415.6666666666667, 83, 830, 411.5, 755.3000000000001, 830.0, 830.0, 0.08353637312913331, 37.5943455229725, 0.04552079707622694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 161.61111111111111, 81, 586, 84.0, 577.9, 586.0, 586.0, 0.08707725203543076, 2.8657070733335592, 0.05044546968502223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 335.66666666666663, 82, 669, 332.0, 600.6000000000001, 669.0, 669.0, 0.08353676081569006, 12.29254856444397, 0.04560258720309643], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 402.56250000000006, 85, 943, 377.0, 772.2000000000002, 943.0, 943.0, 0.08414232674569035, 0.0170041042391956, 0.056887484946411854], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=982e5a46-5c8f-4d65-89be-82bb555b90a7", 1, 0, 0.0, 654.0, 654, 654, 654.0, 654.0, 654.0, 654.0, 1.529051987767584, 0.27624474388379205, 1.0542096712538225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 308.3076923076923, 168, 833, 329.0, 697.3999999999999, 833.0, 833.0, 0.11358572664284279, 10.615418934740632, 0.253221424998471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f089e38-eb96-4453-b475-941119bf3788", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.5074833216292135, 1.9366660814606742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6634a869-c82c-462c-85bb-705be9835964", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 472.73913043478257, 146, 1041, 433.0, 871.6, 1010.3999999999995, 1041.0, 0.10078966511538226, 0.06191083921638226, 0.04557188959806834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 93.55555555555554, 82, 249, 84.0, 106.80000000000022, 249.0, 249.0, 0.08353482241889, 0.06208007798903837, 0.041930565159481896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 101.94444444444446, 81, 249, 84.0, 248.1, 249.0, 249.0, 0.08353637312913331, 0.08508636442742777, 0.04413396275670031], "isController": false}, {"data": ["login", 23, 0, 0.0, 2169.0434782608695, 1327, 4036, 1987.0, 3162.0, 3870.399999999998, 4036.0, 0.1021346134204882, 32.014968826739725, 0.19828044027789496], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4555c52d-c44b-4532-9497-fcef7593d4ac", 3, 0, 0.0, 281.6666666666667, 210, 421, 214.0, 421.0, 421.0, 421.0, 0.07764176091513755, 0.03437265457180569, 0.049789801107689116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 88.0, 84, 98, 87.0, 90.80000000000001, 98.0, 98.0, 0.08815491757515208, 0.0713676041697276, 0.031336318356792334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 510.8333333333333, 167, 918, 581.0, 839.7000000000002, 918.0, 918.0, 0.0835022707978642, 50.01357908563854, 0.17711614470015727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9ccbd10-fac4-40e3-b970-9c49b0a63e9e", 3, 0, 0.0, 504.0, 187, 997, 328.0, 997.0, 997.0, 997.0, 0.048642864091837726, 0.03082931523008075, 0.031193503340143335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc02da37-10f6-4bae-b5e1-d1e2187a24fb", 3, 0, 0.0, 290.0, 189, 393, 288.0, 393.0, 393.0, 393.0, 0.029405422359883162, 0.02949157105820313, 0.018856992854482366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 7, 53.84615384615385, 425.46153846153845, 83, 837, 91.0, 836.2, 837.0, 837.0, 0.05623299492605361, 31.05773824135634, 0.07851160184011662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 274.63636363636357, 166, 816, 176.5, 505.7, 769.4999999999993, 816.0, 0.11079327988396923, 6.188779434186273, 0.24788816047902984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcceb72b-7249-4ef5-95c5-73f428dc53fc", 3, 0, 0.0, 353.66666666666663, 175, 638, 248.0, 638.0, 638.0, 638.0, 0.033174831361273915, 0.027332518937299568, 0.021274224538316927], "isController": false}, {"data": ["register", 26, 8, 30.76923076923077, 742.6153846153846, 246, 1145, 773.0, 1085.2, 1144.65, 1145.0, 0.10246224660298245, 0.03211181586746114, 0.04622808391657997], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8697f6bf-8c6a-47e7-b722-8eb815ea041d", 3, 0, 0.0, 275.3333333333333, 183, 382, 261.0, 382.0, 382.0, 382.0, 0.08888098835659053, 0.040216332622285425, 0.05699724839273546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67cd17df-9f5c-47e3-b1b9-47e2dd460385", 3, 0, 0.0, 337.6666666666667, 290, 382, 341.0, 382.0, 382.0, 382.0, 0.023746388570071636, 0.02806742737562829, 0.015227990066094115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 318.77777777777777, 165, 985, 172.5, 831.1000000000003, 985.0, 985.0, 0.08697164724299879, 11.680737652441971, 0.1931287717912294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 100.95238095238093, 84, 370, 86.0, 96.6, 342.6999999999996, 370.0, 0.10182608105356052, 0.07905442816169982, 0.036195989749507836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62760f8d-ca7c-4c23-ad26-90c09212ffb6", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 246.375, 168, 656, 171.5, 487.3000000000002, 656.0, 656.0, 0.08976106725908971, 6.8420077674879805, 0.2004393558801914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 84.14285714285715, 82, 87, 84.0, 87.0, 87.0, 87.0, 0.03776210949932837, 0.028063442704090714, 0.01895480886978006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 83.42857142857143, 82, 87, 83.0, 87.0, 87.0, 87.0, 0.037762516925699555, 0.01010442347425945, 0.021536435434188025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 107.0, 81, 244, 84.0, 244.0, 244.0, 244.0, 0.03776210949932837, 0.01017806857599085, 0.022199990154878595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 87.0, 85, 89, 87.0, 89.0, 89.0, 89.0, 0.018724955372189697, 0.005522398947657508, 0.011575094483003982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 107.28571428571428, 81, 245, 84.0, 245.0, 245.0, 245.0, 0.037762720642182036, 0.010178233298088127, 0.02223722709690993], "isController": false}, {"data": ["https://demoqa.com/books", 62, 0, 0.0, 778.5645161290322, 641, 1214, 669.0, 1075.4, 1091.25, 1214.0, 0.2678428712755801, 320.43319129381064, 0.5288850446476786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, 30.76923076923077, 742.6153846153846, 246, 1145, 773.0, 1085.2, 1144.65, 1145.0, 0.10150381810515795, 0.03181144299389415, 0.04579566793416306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 139.66666666666666, 83, 250, 85.0, 250.0, 250.0, 250.0, 0.03283515112378305, 0.008850099326332149, 0.019335543093399587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d8d6230-4e07-4d9b-af6c-c36364a3e92e", 1, 0, 0.0, 699.0, 699, 699, 699.0, 699.0, 699.0, 699.0, 1.4306151645207439, 0.2584607474964235, 0.9863420958512161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 111.33333333333334, 81, 251, 84.0, 251.0, 251.0, 251.0, 0.03283586990428344, 0.008850293060138896, 0.01930390008044788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 122.95238095238095, 82, 576, 83.0, 253.6, 543.8999999999995, 576.0, 0.09784599041109293, 4.217592628993631, 0.05712232903742842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17a63ee8-744d-46f4-b419-dfeda087d8ce", 3, 0, 0.0, 606.0, 243, 1184, 391.0, 1184.0, 1184.0, 1184.0, 0.05804728919159475, 0.03731881385201811, 0.037224335842266164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 143.00000000000003, 82, 668, 84.0, 252.2, 626.4999999999994, 668.0, 0.09784599041109293, 1.3951152864557854, 0.057217881762439256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 93.0, 82, 251, 84.0, 93.4, 235.29999999999978, 251.0, 0.0978450786255096, 0.07271494612696563, 0.04911364298194525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 83.66666666666667, 82, 85, 84.0, 85.0, 85.0, 85.0, 0.032835690206208135, 0.008786112418458036, 0.018726604570728077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 111.42857142857143, 80, 339, 84.0, 250.2, 330.1999999999999, 339.0, 0.09784599041109293, 0.03317954622757114, 0.05541148024675827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 112.5, 84, 248, 86.0, 248.0, 248.0, 248.0, 0.03283479174533335, 0.024401637224803402, 0.01648152632529428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 91.66666666666667, 87, 103, 88.5, 103.0, 103.0, 103.0, 0.03168534341631373, 0.02493983085307506, 0.01126314941751777], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 411.5, 83, 997, 407.0, 745.7000000000003, 997.0, 997.0, 0.08211065437059617, 0.01617255137047814, 0.055874736668565475], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1244.3478260869565, 690, 2731, 1106.0, 1950.6, 2575.399999999998, 2731.0, 0.10103716849924661, 0.05229462822714912, 0.046473150745258936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 253.33333333333334, 170, 500, 172.0, 500.0, 500.0, 500.0, 0.03281952542966229, 0.05086385435241606, 0.07381188189893774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/356aeaee-9d17-4352-aacd-1131ade34c46", 3, 0, 0.0, 531.6666666666666, 170, 885, 540.0, 885.0, 885.0, 885.0, 0.025114690419582763, 0.02968471383903158, 0.01610544925995379], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 803.2542372881354, 422, 1440, 696.0, 1277.0, 1413.0, 1440.0, 0.276679656542067, 85.26110580124553, 1.0053451344241078], "isController": true}, {"data": ["https://demoqa.com/books-0", 62, 0, 0.0, 148.90322580645156, 82, 447, 86.0, 336.4, 343.0, 447.0, 0.26868905742145177, 0.19968005146262188, 0.12988387053087758], "isController": false}, {"data": ["https://demoqa.com/books-3", 62, 0, 0.0, 464.1935483870966, 404, 664, 415.5, 578.6, 644.6499999999997, 664.0, 0.26846335042261327, 78.9371388464303, 0.1350181889332479], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1892f5aa-86a2-4f5a-a135-9b1c789b2995", 3, 0, 0.0, 336.6666666666667, 171, 474, 365.0, 474.0, 474.0, 474.0, 0.01755957084408857, 0.024207285978097362, 0.011260532084262526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6634a869-c82c-462c-85bb-705be9835964", 3, 0, 0.0, 257.6666666666667, 174, 332, 267.0, 332.0, 332.0, 332.0, 0.03848324695982349, 0.02474101977397506, 0.02467838428087639], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f089e38-eb96-4453-b475-941119bf3788", 3, 0, 0.0, 320.0, 190, 530, 240.0, 530.0, 530.0, 530.0, 0.015477799675998058, 0.021337396363233004, 0.009925542109933651], "isController": false}, {"data": ["https://demoqa.com/books-1", 62, 0, 0.0, 126.01612903225806, 82, 344, 86.0, 248.4, 251.85, 344.0, 0.2690306651566236, 0.4760581692029316, 0.13083717895312358], "isController": false}, {"data": ["https://demoqa.com/books-2", 62, 0, 0.0, 625.0806451612906, 557, 839, 578.5, 741.1, 752.25, 839.0, 0.2682774854610911, 241.3965529994072, 0.13466272219433675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 97.18749999999999, 85, 246, 86.5, 143.8000000000001, 246.0, 246.0, 0.08783438826093401, 0.06561846388634231, 0.031222380202128884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 11, 6.111111111111111, 139.90000000000006, 83, 1073, 89.0, 262.6, 309.4999999999999, 662.3299999999988, 0.7243868869875969, 1.6483810330360664, 0.3441034215710342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 110.57142857142857, 84, 252, 88.0, 252.0, 252.0, 252.0, 0.03875775847272284, 0.03001455319225509, 0.013777171957100697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/982e5a46-5c8f-4d65-89be-82bb555b90a7", 3, 0, 0.0, 264.3333333333333, 164, 459, 170.0, 459.0, 459.0, 459.0, 0.03730183400683867, 0.031097004196456328, 0.02392077245881256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 98.13636363636363, 84, 252, 87.5, 120.19999999999999, 233.39999999999975, 252.0, 0.10963327668947372, 0.08896997356343032, 0.038971203823211356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1892f5aa-86a2-4f5a-a135-9b1c789b2995", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 193.0, 167, 332, 171.0, 332.0, 332.0, 332.0, 0.037744802001552925, 0.05849707107076611, 0.08488894434528946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80baa723-635d-4a93-b05b-26f512f65672", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 245.47619047619048, 166, 762, 170.0, 470.4000000000001, 736.0999999999997, 762.0, 0.09780679896976839, 5.7163125439548415, 0.2187781267319954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e53f924f-d2e2-4889-994d-20e3c155bc6b", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4555c52d-c44b-4532-9497-fcef7593d4ac", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 87.92307692307692, 85, 97, 87.0, 94.6, 97.0, 97.0, 0.10750287363450677, 0.08913080050360961, 0.038213912112266074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc02da37-10f6-4bae-b5e1-d1e2187a24fb", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.5147124287749288, 1.9642539173789175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9ccbd10-fac4-40e3-b970-9c49b0a63e9e", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 91.66666666666667, 85, 106, 90.0, 99.70000000000002, 106.0, 106.0, 0.08283860278889962, 0.06431317306364766, 0.029446534585116667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8697f6bf-8c6a-47e7-b722-8eb815ea041d", 1, 0, 0.0, 943.0, 943, 943, 943.0, 943.0, 943.0, 943.0, 1.0604453870625663, 0.19158437168610817, 0.7311273860021209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dcceb72b-7249-4ef5-95c5-73f428dc53fc", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 83.93750000000001, 81, 86, 84.0, 86.0, 86.0, 86.0, 0.09005104768765794, 0.06692270243194111, 0.04520140479634393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 114.0625, 81, 248, 83.5, 246.6, 248.0, 248.0, 0.08996800512817629, 0.03251895302545532, 0.050837633757120124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 144.25, 81, 565, 84.5, 343.80000000000024, 565.0, 565.0, 0.08980792330403349, 5.0732761176175085, 0.05231486938560155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 150.6875, 82, 573, 85.0, 403.60000000000014, 573.0, 573.0, 0.0898038907535669, 1.6730249984564955, 0.05240021945825803], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 25.0, 0.5714285714285714], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 12.5, 0.2857142857142857], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.375, 0.21428571428571427], "isController": false}, {"data": ["401/Unauthorized", 17, 53.125, 1.2142857142857142], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1400, 32, "401/Unauthorized", 17, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
