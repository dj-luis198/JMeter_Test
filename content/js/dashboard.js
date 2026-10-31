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

    var data = {"OkPercent": 97.61354888375674, "KoPercent": 2.386451116243264};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.744429882044561, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bd6474d-e6ae-499a-867d-4588363e175e"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e4ac21f2-fea3-4a35-845e-64365f278601"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f485a83d-2f10-4433-b16a-e27dbb38e592"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc27c7eb-4a8c-4c8b-bb9f-f52ce7142d36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0de37bb2-f5a9-4fa5-8ed9-21827ed1bbc9"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22d6ba0d-90a0-475d-bc43-ddfabeed5f19"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/88f477de-935f-43da-875b-d6af2c103d81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8ffc01a8-2950-4932-a2c5-79e3a2fee834"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/705a823d-7411-4737-853c-abea32accc7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=705a823d-7411-4737-853c-abea32accc7e"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1a41c59-cb3c-4e70-adf0-0431e688d640"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/33a92a97-c8ae-49f4-ad77-9772694d54c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b268f8f2-942f-4dc6-9c28-b283390c5bd9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2826ff2-10e3-4635-8485-687a2f2f9730"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f9f91044-a348-4e3c-a7eb-f752ea4565c4"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f485a83d-2f10-4433-b16a-e27dbb38e592"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88f477de-935f-43da-875b-d6af2c103d81"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0de37bb2-f5a9-4fa5-8ed9-21827ed1bbc9"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3611111111111111, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5bd6474d-e6ae-499a-867d-4588363e175e"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33a92a97-c8ae-49f4-ad77-9772694d54c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/22d6ba0d-90a0-475d-bc43-ddfabeed5f19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc27c7eb-4a8c-4c8b-bb9f-f52ce7142d36"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4ac21f2-fea3-4a35-845e-64365f278601"], "isController": false}, {"data": [0.25862068965517243, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9235294117647059, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ffc01a8-2950-4932-a2c5-79e3a2fee834"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9f91044-a348-4e3c-a7eb-f752ea4565c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1a41c59-cb3c-4e70-adf0-0431e688d640"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/b268f8f2-942f-4dc6-9c28-b283390c5bd9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b2826ff2-10e3-4635-8485-687a2f2f9730"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d8212096-9c7e-49e5-b9e3-1e10c5dd917e"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1299, 31, 2.386451116243264, 424.7752117013085, 132, 3896, 154.0, 1096.0, 1305.0, 1740.0, 5.02514506769826, 706.7034234465667, 3.6682067516924564], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bd6474d-e6ae-499a-867d-4588363e175e", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2010.3148148148157, 1617, 2601, 1968.5, 2318.5, 2549.75, 2601.0, 0.23876795734012496, 287.31812856079296, 1.1740201808667277], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e4ac21f2-fea3-4a35-845e-64365f278601", 3, 0, 0.0, 722.6666666666666, 328, 1332, 508.0, 1332.0, 1332.0, 1332.0, 0.018027112777617534, 0.024851830277737717, 0.011560355524709163], "isController": false}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 555.9411764705882, 146, 1037, 545.0, 880.1999999999998, 1037.0, 1037.0, 0.1197427643673708, 0.02404760479252805, 0.08037650514893886], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 555.9411764705882, 146, 1037, 545.0, 880.1999999999998, 1037.0, 1037.0, 0.12112834617056296, 0.024325867314584564, 0.08130656738298644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f485a83d-2f10-4433-b16a-e27dbb38e592", 3, 0, 0.0, 369.3333333333333, 234, 479, 395.0, 479.0, 479.0, 479.0, 0.04060968676394943, 0.026108115676692748, 0.026042019181308718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 159.18749999999997, 133, 425, 142.0, 231.1000000000002, 425.0, 425.0, 0.08751490488223776, 0.0316322794624397, 0.04945147640379377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 164.125, 140, 422, 147.0, 238.6000000000002, 422.0, 422.0, 0.08751251155438629, 0.06503615360633591, 0.04392717865132281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc27c7eb-4a8c-4c8b-bb9f-f52ce7142d36", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0de37bb2-f5a9-4fa5-8ed9-21827ed1bbc9", 3, 0, 0.0, 323.3333333333333, 238, 475, 257.0, 475.0, 475.0, 475.0, 0.020098482564566377, 0.02375572597393897, 0.012888675342511641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 252.99999999999997, 135, 1104, 142.0, 627.3000000000005, 1104.0, 1104.0, 0.08751442620619493, 1.6303728217112352, 0.05106432583808737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22d6ba0d-90a0-475d-bc43-ddfabeed5f19", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 225.93749999999997, 133, 979, 141.0, 585.6000000000004, 979.0, 979.0, 0.08751729834100022, 4.9438780367818795, 0.050980535605865844], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 473.9411764705883, 141, 3440, 238.0, 1517.5999999999983, 3440.0, 3440.0, 0.11961806654986315, 0.20729079811636728, 0.07731059666547048], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 139.64705882352945, 134, 150, 140.0, 147.6, 150.0, 150.0, 0.10314407406957977, 0.07665296910834982, 0.051773490304457034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 171.2941176470588, 132, 420, 141.0, 404.0, 420.0, 420.0, 0.10313719066426418, 0.02759725609571131, 0.05882042905071316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 930.5714285714286, 687, 1125, 979.0, 1125.0, 1125.0, 1125.0, 0.0705055246114642, 20.73096523951734, 0.04021018200497568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1146.9999999999998, 974, 1315, 1251.0, 1315.0, 1315.0, 1315.0, 0.0704168678577177, 63.36122147802491, 0.04009085347758732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88f477de-935f-43da-875b-d6af2c103d81", 3, 0, 0.0, 972.0, 346, 1654, 916.0, 1654.0, 1654.0, 1654.0, 0.027604736972864544, 0.02768561022571473, 0.017702256457208056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 219.85714285714286, 135, 420, 141.0, 420.0, 420.0, 420.0, 0.0712163756969031, 0.12601960230741058, 0.03943328615248443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 180.78571428571428, 135, 422, 141.0, 420.5, 422.0, 422.0, 0.08390468427865944, 0.062354946031308436, 0.04211621847581148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ffc01a8-2950-4932-a2c5-79e3a2fee834", 3, 0, 0.0, 642.0, 251, 1037, 638.0, 1037.0, 1037.0, 1037.0, 0.07273961641975608, 0.03419140823897388, 0.046646173290012846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 179.0714285714286, 135, 412, 141.0, 405.0, 412.0, 412.0, 0.0840426936883937, 0.03150428542699692, 0.04742643637968088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 237.42857142857144, 133, 967, 141.0, 692.5, 967.0, 967.0, 0.0840502620567099, 5.4230769844116775, 0.04889642756368308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 257.2142857142857, 136, 967, 141.5, 692.5, 967.0, 967.0, 0.08404925286217724, 1.786269410124333, 0.048977919811009255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/705a823d-7411-4737-853c-abea32accc7e", 3, 0, 0.0, 1306.3333333333335, 238, 3346, 335.0, 3346.0, 3346.0, 3346.0, 0.0583203732503888, 0.03749438058903577, 0.037399458106531884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 180.28571428571428, 138, 419, 141.0, 419.0, 419.0, 419.0, 0.0710111994806038, 0.05277297148900341, 0.03987445283334686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 725.2777777777776, 134, 1393, 942.0, 1331.8000000000002, 1393.0, 1393.0, 0.10762975364745277, 53.81591621696364, 0.05813594983257594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 173.41176470588232, 133, 424, 141.0, 422.4, 424.0, 424.0, 0.10314157090679643, 0.027799876533472472, 0.060635962583878364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 590.1111111111111, 133, 1129, 727.0, 1034.5000000000002, 1129.0, 1129.0, 0.10762589239802448, 17.59377373001447, 0.05823896759862717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 156.58823529411765, 133, 419, 141.0, 202.9999999999998, 419.0, 419.0, 0.10314282247300084, 0.027800213869676012, 0.060737423780487805], "isController": false}, {"data": ["deleteBooks", 17, 3, 17.647058823529413, 545.0000000000001, 143, 1366, 510.0, 1332.3999999999999, 1366.0, 1366.0, 0.1211162644894237, 0.024323440984319007, 0.08198029322603857], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 441.2857142857143, 273, 1108, 287.0, 973.0, 1108.0, 1108.0, 0.08382982545432772, 7.2841838099907195, 0.18700319601209545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=705a823d-7411-4737-853c-abea32accc7e", 1, 0, 0.0, 1324.0, 1324, 1324, 1324.0, 1324.0, 1324.0, 1324.0, 0.7552870090634441, 0.13645321941087613, 0.5207349886706948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 598.090909090909, 192, 3084, 496.5, 701.5, 2726.849999999995, 3084.0, 0.09647218750685171, 0.05925879486504857, 0.04361974884343003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 138.55555555555554, 134, 146, 139.0, 144.2, 146.0, 146.0, 0.10762396187720105, 0.07998226073100587, 0.054022183989141936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 249.83333333333334, 132, 445, 144.0, 440.5, 445.0, 445.0, 0.10762589239802448, 0.11860335972160768, 0.05635878436554536], "isController": false}, {"data": ["login", 22, 0, 0.0, 2621.7272727272725, 1425, 4401, 2577.0, 4173.099999999999, 4398.0, 4401.0, 0.09415833151436556, 35.969013449394176, 0.19174394604727604], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 161.11764705882354, 136, 410, 145.0, 215.59999999999982, 410.0, 410.0, 0.09829259972362434, 0.07957477067469197, 0.03493994755800709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1a41c59-cb3c-4e70-adf0-0431e688d640", 3, 0, 0.0, 367.3333333333333, 247, 496, 359.0, 496.0, 496.0, 496.0, 0.07181500454828363, 0.03249441937568823, 0.046053241848996986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33a92a97-c8ae-49f4-ad77-9772694d54c9", 3, 0, 0.0, 348.6666666666667, 241, 531, 274.0, 531.0, 531.0, 531.0, 0.025170107979763233, 0.025096367429041273, 0.01614098721358515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b268f8f2-942f-4dc6-9c28-b283390c5bd9", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2826ff2-10e3-4635-8485-687a2f2f9730", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.26451546486090777, 1.0094482064421668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 886.388888888889, 270, 1529, 1108.0, 1477.7, 1529.0, 1529.0, 0.10753330545432821, 71.54474580321406, 0.2265596996535038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 453.00000000000006, 281, 1527, 297.5, 865.5000000000007, 1527.0, 1527.0, 0.08744555148083576, 6.665508340461057, 0.1952687345262364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 781.4615384615385, 141, 1691, 1115.0, 1596.6, 1691.0, 1691.0, 0.1302252897512697, 83.90554722169352, 0.19794009261021567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9f91044-a348-4e3c-a7eb-f752ea4565c4", 3, 0, 0.0, 332.0, 232, 524, 240.0, 524.0, 524.0, 524.0, 0.037229157876448836, 0.03026080964111092, 0.023874166997592518], "isController": false}, {"data": ["register", 25, 9, 36.0, 871.9600000000002, 331, 1966, 931.0, 1553.8000000000013, 1954.3, 1966.0, 0.10208039852187584, 0.03180442416447194, 0.046055804801861944], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f485a83d-2f10-4433-b16a-e27dbb38e592", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 143.33333333333331, 137, 151, 144.0, 149.8, 151.0, 151.0, 0.07364312541424257, 0.057174106156565284, 0.02617782973709404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 348.41176470588243, 271, 565, 287.0, 561.8, 565.0, 565.0, 0.10304778992798778, 0.15970394786691075, 0.23175689473062094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88f477de-935f-43da-875b-d6af2c103d81", 1, 0, 0.0, 1366.0, 1366, 1366, 1366.0, 1366.0, 1366.0, 1366.0, 0.7320644216691069, 0.13225773243045388, 0.5047241032210834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 487.05263157894746, 284, 1325, 549.0, 587.0, 1325.0, 1325.0, 0.09336379941524778, 6.015793914768679, 0.20872010976388786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 139.71428571428572, 135, 142, 141.0, 142.0, 142.0, 142.0, 0.03703037548800745, 0.027519644283568036, 0.01858751269612874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 218.42857142857144, 140, 418, 142.0, 418.0, 418.0, 418.0, 0.03697892729414624, 0.01782912565967765, 0.020645879887161444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 346.1428571428571, 136, 1312, 141.0, 1312.0, 1312.0, 1312.0, 0.0368014299984228, 4.739072316452868, 0.0211834124125966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 216.57142857142858, 134, 699, 135.0, 699.0, 699.0, 699.0, 0.036920415407416786, 1.5593621767485772, 0.02128795715385792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0de37bb2-f5a9-4fa5-8ed9-21827ed1bbc9", 1, 0, 0.0, 804.0, 804, 804, 804.0, 804.0, 804.0, 804.0, 1.243781094527363, 0.22470654539800994, 0.8575287624378108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 158.33333333333334, 143, 188, 144.0, 188.0, 188.0, 188.0, 0.0971534052268532, 0.028652664432138344, 0.060056743660740305], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1322.1296296296296, 1059, 2012, 1150.0, 1755.5, 1977.5, 2012.0, 0.2529641306231818, 302.6330447863624, 0.4995053438672594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 871.9600000000002, 331, 1966, 931.0, 1553.8000000000013, 1954.3, 1966.0, 0.09743739647276625, 0.030357838838546234, 0.043961012861736336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 187.0, 134, 417, 141.5, 417.0, 417.0, 417.0, 0.03218676909211854, 0.008675340106860073, 0.01895373218998777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 183.16666666666666, 134, 399, 141.5, 399.0, 399.0, 399.0, 0.032234668385848986, 0.008688250463373359, 0.0189504593440245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bd6474d-e6ae-499a-867d-4588363e175e", 3, 0, 0.0, 405.6666666666667, 228, 567, 422.0, 567.0, 567.0, 567.0, 0.10920607185759529, 0.04934180590440829, 0.07003123748680426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 229.26666666666668, 133, 930, 140.0, 627.0000000000002, 930.0, 930.0, 0.07280457795186161, 4.3856273828331656, 0.042384019273798604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 248.8, 133, 975, 140.0, 655.8000000000002, 975.0, 975.0, 0.07269836961789737, 1.4433371489880387, 0.04239318337679081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33a92a97-c8ae-49f4-ad77-9772694d54c9", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22d6ba0d-90a0-475d-bc43-ddfabeed5f19", 3, 0, 0.0, 326.3333333333333, 235, 467, 277.0, 467.0, 467.0, 467.0, 0.04008819402685909, 0.03341987789804236, 0.02570759838310951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 157.2, 133, 404, 141.0, 250.4000000000001, 404.0, 404.0, 0.07280387122451258, 0.05410522070493562, 0.036544130673241665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 186.0, 134, 420, 140.5, 420.0, 420.0, 420.0, 0.03223484156575371, 0.00862533846583644, 0.01838393308046891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 230.06666666666666, 134, 424, 140.0, 423.4, 424.0, 424.0, 0.07270576944515804, 0.026734517306396654, 0.04105793256297531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 140.83333333333331, 135, 144, 141.0, 144.0, 144.0, 144.0, 0.0322338025142366, 0.023955003626302783, 0.01617985790265392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 241.49999999999997, 142, 428, 158.0, 428.0, 428.0, 428.0, 0.030585404644903454, 0.024074058734172052, 0.010872155557368025], "isController": false}, {"data": ["deleteAccount", 17, 3, 17.647058823529413, 655.235294117647, 141, 3346, 524.0, 1401.9999999999982, 3346.0, 3346.0, 0.12023396114321279, 0.023566077402380634, 0.08181821597555715], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dc27c7eb-4a8c-4c8b-bb9f-f52ce7142d36", 3, 0, 0.0, 340.6666666666667, 236, 548, 238.0, 548.0, 548.0, 548.0, 0.028643719864419725, 0.02872763701246002, 0.018368531293263952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1257.4090909090908, 849, 3896, 1070.0, 1797.3999999999999, 3584.8999999999955, 3896.0, 0.0947859130899346, 0.049059115173501304, 0.04359781744663984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 376.5, 278, 562, 287.5, 562.0, 562.0, 562.0, 0.03216175217225834, 0.049844434274779297, 0.07233253442647555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4ac21f2-fea3-4a35-845e-64365f278601", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["addBook", 58, 10, 17.24137931034483, 1286.0000000000002, 702, 2386, 1101.5, 2038.7, 2137.0499999999997, 2386.0, 0.2728307602570254, 85.51077472028966, 0.9911016526840901], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 252.90740740740742, 134, 590, 143.0, 567.5, 572.25, 590.0, 0.25438220455155713, 0.1890477125622412, 0.12296796020802811], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 784.5, 657, 1256, 696.0, 1009.0, 1085.75, 1256.0, 0.25422890959337496, 74.75174061471608, 0.12785926605526182], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 245.96296296296296, 133, 570, 146.5, 423.0, 438.5, 570.0, 0.2546196971911675, 0.45055751104530817, 0.12382871992304828], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1063.5925925925926, 922, 1457, 974.5, 1350.0, 1411.5, 1457.0, 0.2536819110703967, 228.26342950637726, 0.12733642801775774], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 158.47368421052633, 135, 420, 144.0, 153.0, 420.0, 420.0, 0.09745388892308324, 0.07280490725210809, 0.03464181207812724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, 5.882352941176471, 213.57647058823542, 134, 1538, 147.0, 381.8, 425.24999999999994, 1335.6499999999978, 0.7412025793849762, 1.6215637289792768, 0.35629073207924766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 145.85714285714286, 135, 161, 144.0, 161.0, 161.0, 161.0, 0.03778840651688062, 0.029263873406138997, 0.013432597629047409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 163.25, 136, 417, 145.0, 235.7000000000002, 417.0, 417.0, 0.09075748465631275, 0.07365182592714442, 0.032261449623923674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ffc01a8-2950-4932-a2c5-79e3a2fee834", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9f91044-a348-4e3c-a7eb-f752ea4565c4", 1, 0, 0.0, 670.0, 670, 670, 670.0, 670.0, 670.0, 670.0, 1.492537313432836, 0.2696478544776119, 1.029034514925373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1a41c59-cb3c-4e70-adf0-0431e688d640", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 489.42857142857144, 278, 1453, 285.0, 1453.0, 1453.0, 1453.0, 0.03677513580532294, 6.333973313728683, 0.08136396187731815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 467.46666666666664, 270, 1110, 294.0, 941.4000000000001, 1110.0, 1110.0, 0.07264766849415913, 5.89920824635793, 0.162147136652686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b268f8f2-942f-4dc6-9c28-b283390c5bd9", 3, 0, 0.0, 1705.0, 579, 3440, 1096.0, 3440.0, 3440.0, 3440.0, 0.03306295186034209, 0.027563222563260447, 0.02120247889481573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 166.42857142857144, 136, 426, 147.0, 295.0, 426.0, 426.0, 0.08151145527058891, 0.06758127492649414, 0.028974775115717156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 159.72222222222223, 137, 418, 144.0, 181.30000000000038, 418.0, 418.0, 0.10549265067866939, 0.08190103250931853, 0.03749934067093326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2826ff2-10e3-4635-8485-687a2f2f9730", 3, 0, 0.0, 377.6666666666667, 238, 632, 263.0, 632.0, 632.0, 632.0, 0.02342395802426722, 0.027686325386104906, 0.015021223081968236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 142.21052631578948, 133, 150, 141.0, 150.0, 150.0, 150.0, 0.09342853209024213, 0.06943272746159596, 0.04689674364685982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 227.3157894736842, 133, 432, 142.0, 421.0, 432.0, 432.0, 0.09342991035645969, 0.03238545001253928, 0.05287126403292667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 280.3684210526315, 133, 1183, 142.0, 445.0, 1183.0, 1183.0, 0.09343266701089228, 4.448640654581889, 0.054505590592805686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8212096-9c7e-49e5-b9e3-1e10c5dd917e", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.1528373194945847, 2.1540782942238264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 255.26315789473685, 134, 926, 142.0, 424.0, 926.0, 926.0, 0.09343312646911298, 1.4697756898069376, 0.05459710191341208], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 29.032258064516128, 0.6928406466512702], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.67741935483871, 0.23094688221709006], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.67741935483871, 0.23094688221709006], "isController": false}, {"data": ["401/Unauthorized", 16, 51.61290322580645, 1.2317167051578137], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1299, 31, "401/Unauthorized", 16, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
