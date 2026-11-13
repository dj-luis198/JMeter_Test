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

    var data = {"OkPercent": 97.83783783783784, "KoPercent": 2.1621621621621623};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7467061923583662, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db481209-e95f-4225-9b71-9f91f7878fae"], "isController": false}, {"data": [0.4411764705882353, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc764967-9d72-4e32-856a-760fc2adb5a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d49b7f0-7131-455f-82b4-80a5948279f0"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=678f454a-efa4-48e5-a559-0a196a83ba22"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e35e8402-9ea2-4f15-a421-063d8d8030d7"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c81aa772-09f2-46ad-9a07-555af35ee478"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c6cd169d-3335-4e02-addb-27cc76e72662"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c26dba95-d8e7-4226-b8db-d2ba82f084d4"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02d5c083-9ba3-4662-863f-bf6a951fdcd3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/678f454a-efa4-48e5-a559-0a196a83ba22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3233198f-f96d-4938-8bbe-db45c5344fab"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/77606f3a-e953-430d-ab01-fce1a7ec86cb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0401b180-a2f0-43f1-87c0-5bfc82d9d3d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/410e8b0c-00c1-4d3a-a5d9-430caf0e1c95"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/49f2e153-613e-49fe-bee4-ebbdd2defe3f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31ecd769-8213-43ab-aa14-3e2eb702ed30"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1d42f51c-6fac-443c-b8cd-7f736981d214"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fc764967-9d72-4e32-856a-760fc2adb5a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35454545454545455, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1d49b7f0-7131-455f-82b4-80a5948279f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3233198f-f96d-4938-8bbe-db45c5344fab"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c81aa772-09f2-46ad-9a07-555af35ee478"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6cd169d-3335-4e02-addb-27cc76e72662"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e35e8402-9ea2-4f15-a421-063d8d8030d7"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9349112426035503, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=410e8b0c-00c1-4d3a-a5d9-430caf0e1c95"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77606f3a-e953-430d-ab01-fce1a7ec86cb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02d5c083-9ba3-4662-863f-bf6a951fdcd3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d42f51c-6fac-443c-b8cd-7f736981d214"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/31ecd769-8213-43ab-aa14-3e2eb702ed30"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49f2e153-613e-49fe-bee4-ebbdd2defe3f"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1295, 28, 2.1621621621621623, 419.51196911196945, 133, 3031, 152.0, 1088.4, 1277.2, 1710.08, 5.1290785085669475, 723.5301752327889, 3.74319304816779], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2024.5818181818174, 1627, 2583, 2053.0, 2334.2, 2496.6, 2583.0, 0.24043295417785046, 289.32207110995876, 1.1822069573100362], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/db481209-e95f-4225-9b71-9f91f7878fae", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.7846091830466831, 1.4660434582309583], "isController": false}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 678.7058823529412, 139, 3031, 598.0, 1359.7999999999986, 3031.0, 3031.0, 0.1069713882998471, 0.021482765021614513, 0.07180380700159199], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 678.7058823529412, 139, 3031, 598.0, 1359.7999999999986, 3031.0, 3031.0, 0.1069397614614262, 0.021476413492023554, 0.07178257770431785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 177.4, 135, 425, 140.0, 416.6, 425.0, 425.0, 0.09897658214066551, 0.02648396826810777, 0.05644758200209831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 141.06666666666666, 135, 146, 143.0, 145.4, 146.0, 146.0, 0.09897266375027218, 0.07355292686909876, 0.049679637859023344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 212.19999999999996, 134, 423, 139.0, 415.8, 423.0, 423.0, 0.0989720107153697, 0.02667604976312699, 0.05828136959117962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 193.46666666666667, 134, 409, 142.0, 403.6, 409.0, 409.0, 0.0989733167937924, 0.026676401792076854, 0.0581854850682256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc764967-9d72-4e32-856a-760fc2adb5a3", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d49b7f0-7131-455f-82b4-80a5948279f0", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 303.6470588235294, 137, 1257, 251.0, 600.9999999999994, 1257.0, 1257.0, 0.10630115743201415, 0.18806658126098186, 0.0687037179611438], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=678f454a-efa4-48e5-a559-0a196a83ba22", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 168.17647058823533, 137, 615, 139.0, 239.79999999999967, 615.0, 615.0, 0.10824509235853322, 0.08044386258285526, 0.05433396237527937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 830.8333333333333, 665, 988, 832.5, 988.0, 988.0, 988.0, 0.028306025881142997, 8.322911457571626, 0.016143280385339367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 188.47058823529412, 135, 427, 140.0, 415.0, 427.0, 427.0, 0.10824647084667842, 0.03852798330457373, 0.06119954998121605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1163.8333333333335, 951, 1354, 1226.0, 1354.0, 1354.0, 1354.0, 0.0283104333383663, 25.473777682295598, 0.01611814710573003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 327.0, 137, 430, 411.5, 430.0, 430.0, 430.0, 0.02838301938560224, 0.05022463977217896, 0.01571598827308249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 160.88235294117652, 134, 500, 139.0, 215.99999999999974, 500.0, 500.0, 0.08262414277451871, 0.06140329360489135, 0.04147344666611584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 201.23529411764707, 133, 413, 140.0, 409.8, 413.0, 413.0, 0.08262695388443891, 0.04400948508826503, 0.04589858938778288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 330.52941176470586, 134, 1221, 142.0, 1220.2, 1221.0, 1221.0, 0.08262735548718547, 13.138618134942623, 0.04732276736025041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 311.76470588235287, 133, 928, 142.0, 927.2, 928.0, 928.0, 0.08262534751249101, 4.305621667646831, 0.04740230615850458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 139.66666666666666, 137, 143, 139.0, 143.0, 143.0, 143.0, 0.028418644525384954, 0.021119715316228468, 0.015957734962984717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e35e8402-9ea2-4f15-a421-063d8d8030d7", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 745.529411764706, 133, 1277, 991.0, 1272.2, 1277.0, 1277.0, 0.08271379082168853, 39.412498882451544, 0.04486348879471411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 236.88235294117646, 135, 991, 140.0, 536.5999999999996, 991.0, 991.0, 0.10824716010391727, 5.756929459862589, 0.06309028529494168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 578.3529411764707, 135, 1120, 685.0, 991.1999999999999, 1120.0, 1120.0, 0.08271097380008272, 12.885664622205464, 0.04494273329359963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 220.5294117647059, 134, 990, 138.0, 537.9999999999995, 990.0, 990.0, 0.10824647084667842, 1.8996982032677698, 0.06319559301555565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c81aa772-09f2-46ad-9a07-555af35ee478", 3, 0, 0.0, 739.6666666666666, 457, 1257, 505.0, 1257.0, 1257.0, 1257.0, 0.028795761263941948, 0.028880123845769903, 0.01846603180011902], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 549.1875, 139, 2490, 473.0, 1262.9000000000012, 2490.0, 2490.0, 0.10228478641658036, 0.020670466786212014, 0.06915335566018438], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 541.1176470588235, 273, 1360, 289.0, 1356.8, 1360.0, 1360.0, 0.08256675765199568, 17.53688905152651, 0.18196654741031792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6cd169d-3335-4e02-addb-27cc76e72662", 3, 0, 0.0, 605.6666666666666, 423, 957, 437.0, 957.0, 957.0, 957.0, 0.021161035480002824, 0.025011627548141353, 0.0135700650701841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 361.0909090909091, 141, 695, 301.5, 657.6, 689.7499999999999, 695.0, 0.09500408085710954, 0.05835699888586124, 0.042955946715665744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 189.58823529411768, 135, 433, 140.0, 415.4, 433.0, 433.0, 0.0827101689720099, 0.06146722518330033, 0.04151662778477841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 228.58823529411762, 134, 431, 141.0, 426.2, 431.0, 431.0, 0.08270936415959988, 0.0878977043286189, 0.043492734347252836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c26dba95-d8e7-4226-b8db-d2ba82f084d4", 2, 0, 0.0, 374.5, 249, 500, 374.5, 500.0, 500.0, 500.0, 0.06488871585231328, 0.03989008459866329, 0.040333659804684965], "isController": false}, {"data": ["login", 22, 0, 0.0, 2190.4999999999995, 1335, 3199, 2244.5, 3069.9, 3179.95, 3199.0, 0.09564302544973959, 31.336549126279227, 0.1875584862534888], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 144.8823529411765, 137, 160, 144.0, 155.2, 160.0, 160.0, 0.11427649534155228, 0.09251485804506528, 0.040621722953442414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02d5c083-9ba3-4662-863f-bf6a951fdcd3", 3, 0, 0.0, 342.3333333333333, 251, 491, 285.0, 491.0, 491.0, 491.0, 0.02366434493149172, 0.027970454572345847, 0.015175377446301657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/678f454a-efa4-48e5-a559-0a196a83ba22", 3, 0, 0.0, 353.6666666666667, 234, 592, 235.0, 592.0, 592.0, 592.0, 0.03984910472344721, 0.03322055898331651, 0.025554276141012695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3233198f-f96d-4938-8bbe-db45c5344fab", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77606f3a-e953-430d-ab01-fce1a7ec86cb", 3, 0, 0.0, 493.3333333333333, 234, 665, 581.0, 665.0, 665.0, 665.0, 0.06422332591197122, 0.030188308143517723, 0.04118488022349717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0401b180-a2f0-43f1-87c0-5bfc82d9d3d9", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.6373970808383234, 1.1909774201596806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/410e8b0c-00c1-4d3a-a5d9-430caf0e1c95", 3, 0, 0.0, 347.3333333333333, 267, 495, 280.0, 495.0, 495.0, 495.0, 0.022116228151009606, 0.026140632948019493, 0.014182607245276342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 954.1764705882352, 276, 1422, 1141.0, 1413.2, 1422.0, 1422.0, 0.08265266433294438, 52.4092150123979, 0.1746920656480941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 394.06666666666666, 274, 571, 290.0, 566.2, 571.0, 571.0, 0.09887545647502406, 0.15323764592369452, 0.22237321900584026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 777.5454545454545, 137, 1498, 1091.0, 1480.8000000000002, 1498.0, 1498.0, 0.051859395036584446, 33.84732513070925, 0.0793222227526024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49f2e153-613e-49fe-bee4-ebbdd2defe3f", 3, 0, 0.0, 676.6666666666667, 240, 1430, 360.0, 1430.0, 1430.0, 1430.0, 0.030597882626522244, 0.02520938832282806, 0.019621689054117455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31ecd769-8213-43ab-aa14-3e2eb702ed30", 1, 0, 0.0, 737.0, 737, 737, 737.0, 737.0, 737.0, 737.0, 1.3568521031207597, 0.2451344131614654, 0.9354859226594301], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 920.8333333333337, 240, 2387, 849.0, 1751.5, 2248.75, 2387.0, 0.10064876516546238, 0.03160017382880484, 0.04540989209613634], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1d42f51c-6fac-443c-b8cd-7f736981d214", 3, 0, 0.0, 600.0, 285, 855, 660.0, 855.0, 855.0, 855.0, 0.06382978723404255, 0.030003324468085107, 0.04093251329787234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 158.0, 138, 413, 142.0, 160.0, 413.0, 413.0, 0.08977805918736681, 0.06970073931050451, 0.031913294476759294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 457.4117647058824, 276, 1607, 288.0, 777.3999999999993, 1607.0, 1607.0, 0.10815006139106426, 7.768638589532347, 0.2416043047700539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 495.74999999999994, 276, 1374, 548.5, 873.5000000000005, 1374.0, 1374.0, 0.08756854975535536, 6.674883843397331, 0.19554339363705026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 201.66666666666666, 138, 501, 144.0, 501.0, 501.0, 501.0, 0.036685131516196484, 0.027263071370923365, 0.018414216405590815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc764967-9d72-4e32-856a-760fc2adb5a3", 3, 0, 0.0, 399.0, 252, 681, 264.0, 681.0, 681.0, 681.0, 0.04400440044004401, 0.02829058947561423, 0.028218967730106344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 187.33333333333334, 137, 410, 144.5, 410.0, 410.0, 410.0, 0.036705554162103964, 0.009821603359781725, 0.020933636358074915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 185.16666666666669, 136, 414, 141.0, 414.0, 414.0, 414.0, 0.03676583228652838, 0.009909540733478354, 0.021614288121572352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 228.16666666666666, 135, 410, 142.0, 410.0, 410.0, 410.0, 0.03670757521993956, 0.009893838633499333, 0.0216158865797105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 143.66666666666666, 139, 152, 140.0, 152.0, 152.0, 152.0, 0.025080885856888464, 0.007396901883574528, 0.015504102292392968], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1304.6181818181813, 1068, 1994, 1134.0, 1736.0, 1932.0, 1994.0, 0.2429360813084979, 290.6360114919809, 0.47970386367752227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 920.8333333333337, 240, 2387, 849.0, 1751.5, 2248.75, 2387.0, 0.09814947346897045, 0.03081548410183008, 0.04428228197525815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 248.8, 134, 426, 138.0, 426.0, 426.0, 426.0, 0.0612347372417425, 0.016504675272188407, 0.03605912749684641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 251.4, 136, 430, 140.0, 430.0, 430.0, 430.0, 0.06123398731231783, 0.016504473142773167, 0.0359988870722806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 242.05263157894737, 137, 1226, 141.0, 426.0, 1226.0, 1226.0, 0.09059223481507264, 4.313398211578164, 0.052848574483505065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 213.21052631578948, 133, 994, 138.0, 427.0, 994.0, 994.0, 0.09059353066829418, 1.425106641101808, 0.05293780068708041], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d49b7f0-7131-455f-82b4-80a5948279f0", 3, 0, 0.0, 743.0, 249, 1712, 268.0, 1712.0, 1712.0, 1712.0, 0.018931027954817947, 0.026097950321827476, 0.012140014671546665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 157.6842105263158, 135, 458, 143.0, 145.0, 458.0, 458.0, 0.09059396262760636, 0.06732617730430512, 0.045473922647060225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 139.2, 134, 143, 140.0, 143.0, 143.0, 143.0, 0.06123248750857255, 0.016384474196629764, 0.034921653032232776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 170.3684210526316, 134, 428, 139.0, 400.0, 428.0, 428.0, 0.09058921130171928, 0.0314007833582851, 0.05126373439720032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 250.0, 138, 431, 143.0, 431.0, 431.0, 431.0, 0.06123023794070464, 0.045504112375855686, 0.030734709278830256], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 803.8666666666667, 138, 2240, 594.0, 1923.2000000000003, 2240.0, 2240.0, 0.1082915207739234, 0.020819326877955457, 0.07369604600584775], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 199.8, 141, 422, 145.0, 422.0, 422.0, 422.0, 0.05675819872180536, 0.04467491032204602, 0.02017576595189175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3233198f-f96d-4938-8bbe-db45c5344fab", 3, 0, 0.0, 900.3333333333334, 230, 2240, 231.0, 2240.0, 2240.0, 2240.0, 0.03489589391648249, 0.028568741276026523, 0.022377900721181808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1152.5454545454547, 821, 2347, 993.0, 1683.0, 2248.7499999999986, 2347.0, 0.09389230552556219, 0.04859660344584761, 0.043186792873574006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 505.8, 277, 861, 286.0, 861.0, 861.0, 861.0, 0.061124694376528114, 0.09473133786674817, 0.1374708702628362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c81aa772-09f2-46ad-9a07-555af35ee478", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6cd169d-3335-4e02-addb-27cc76e72662", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e35e8402-9ea2-4f15-a421-063d8d8030d7", 3, 0, 0.0, 382.0, 238, 648, 260.0, 648.0, 648.0, 648.0, 0.06437630093774811, 0.02912859970816077, 0.041282979442501234], "isController": false}, {"data": ["addBook", 57, 10, 17.54385964912281, 1270.0877192982455, 705, 2752, 1101.0, 1996.0, 2184.499999999999, 2752.0, 0.28599956849187913, 91.1524449827146, 1.0390024071630348], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 243.90909090909076, 135, 664, 143.0, 555.2, 574.2, 664.0, 0.24415146268921736, 0.18144459287743595, 0.11802243557730722], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 763.127272727273, 663, 1100, 685.0, 978.8, 1087.0, 1100.0, 0.24402039123123817, 71.75009726153662, 0.12272509910555435], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 234.19999999999996, 135, 483, 143.0, 425.4, 429.0, 483.0, 0.2446412447346532, 0.43290032759686686, 0.11897591784947002], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1053.781818181818, 930, 1437, 987.0, 1288.0, 1376.3999999999999, 1437.0, 0.24356975837879968, 219.16449673920988, 0.12226060137373344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 196.1875, 138, 422, 147.0, 417.1, 422.0, 422.0, 0.09050746403742484, 0.06761543944202149, 0.03217257510705336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 10, 5.9171597633136095, 198.40828402366864, 135, 1089, 145.0, 328.0, 386.5, 1045.6000000000008, 0.725496256611031, 1.576227984247287, 0.3478949406831685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 150.0, 140, 173, 144.5, 173.0, 173.0, 173.0, 0.03533464856747446, 0.0273636487441477, 0.012560363357969435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 143.20000000000002, 135, 151, 144.0, 149.2, 151.0, 151.0, 0.1011763436218433, 0.08210697416967948, 0.03596502839682711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 435.16666666666663, 280, 915, 287.5, 915.0, 915.0, 915.0, 0.036593398550901414, 0.056712620605742725, 0.08229941099875583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=410e8b0c-00c1-4d3a-a5d9-430caf0e1c95", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 443.2105263157895, 275, 1685, 290.0, 572.0, 1685.0, 1685.0, 0.09053050878145935, 5.833233943342196, 0.20238612661644606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77606f3a-e953-430d-ab01-fce1a7ec86cb", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.506061799719888, 1.9312412464985995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02d5c083-9ba3-4662-863f-bf6a951fdcd3", 1, 0, 0.0, 650.0, 650, 650, 650.0, 650.0, 650.0, 650.0, 1.5384615384615385, 0.2779447115384615, 1.0606971153846154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 143.8235294117647, 137, 162, 145.0, 151.6, 162.0, 162.0, 0.0837694271156708, 0.06945336291133253, 0.029777413545023605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 162.7058823529412, 139, 414, 147.0, 209.19999999999982, 414.0, 414.0, 0.08083689966714218, 0.06275911644079886, 0.028734991678554443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d42f51c-6fac-443c-b8cd-7f736981d214", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 0.6406527039007093, 2.444869237588653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 139.1875, 134, 148, 138.5, 145.2, 148.0, 148.0, 0.08763521840339587, 0.06512734492674244, 0.04398877173764207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31ecd769-8213-43ab-aa14-3e2eb702ed30", 3, 0, 0.0, 717.3333333333334, 278, 1280, 594.0, 1280.0, 1280.0, 1280.0, 0.018356258260316217, 0.02169647582786725, 0.011771428636986637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 214.875, 136, 519, 139.0, 454.6000000000001, 519.0, 519.0, 0.08763569840174394, 0.031675940303657696, 0.04951973240987216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49f2e153-613e-49fe-bee4-ebbdd2defe3f", 1, 0, 0.0, 2490.0, 2490, 2490, 2490.0, 2490.0, 2490.0, 2490.0, 0.40160642570281124, 0.07255584839357429, 0.2768888052208835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 299.75, 134, 1235, 140.5, 733.8000000000005, 1235.0, 1235.0, 0.08763617840535018, 4.950593606735388, 0.051049785565225964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 293.4375, 134, 928, 140.0, 578.7000000000004, 928.0, 928.0, 0.08763665841421467, 1.6326499785016322, 0.051135647853997324], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.5405405405405406], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.23166023166023167], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.15444015444015444], "isController": false}, {"data": ["401/Unauthorized", 16, 57.142857142857146, 1.2355212355212355], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1295, 28, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
