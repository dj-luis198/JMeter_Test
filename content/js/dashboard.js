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

    var data = {"OkPercent": 99.68354430379746, "KoPercent": 0.31645569620253167};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7824609109449354, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.027777777777777776, 500, 1500, "see books"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2fcccb7d-199a-4416-a758-3abe8d932f84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4ae71f82-1226-445c-8f46-6a94ad4f2fd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=424cc359-5d0f-4025-b95c-618ad3f49d5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04c4d388-2adf-4c9e-a44b-2bce0b9b1c82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dae5722a-5527-45ce-aaa0-d8b8a144d4b8"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e98b2df-69a4-4452-a86a-71c79912abb9"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c0dbee3-5189-4c1d-980f-daa78ee7a383"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b84f1bb7-4a27-4842-93a1-0e8a3899acd9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/424cc359-5d0f-4025-b95c-618ad3f49d5e"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/8c0b6444-a0d6-4f23-b30d-0c9e1723322c"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e6f67fe4-008d-4e7f-aba5-8ab419d9126d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=612ae1fd-ce7a-48c5-aeed-ffa56066bccb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93b1782d-6430-4063-8edd-c9d63fa13dbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1bb9bd5-c7b0-4f02-837b-c59b8937e2b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2fcccb7d-199a-4416-a758-3abe8d932f84"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c0d1920-428f-42d7-9312-9ff72714a818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.39814814814814814, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2c0dbee3-5189-4c1d-980f-daa78ee7a383"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/224e2a2a-6c98-425f-883f-2395f15b1cd2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04c4d388-2adf-4c9e-a44b-2bce0b9b1c82"], "isController": false}, {"data": [0.3220338983050847, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ae71f82-1226-445c-8f46-6a94ad4f2fd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4011e3c-0d50-4bfd-be12-95aec25a780a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c0b6444-a0d6-4f23-b30d-0c9e1723322c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5473006a-8d10-4de5-b697-762ed09b3352"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dae5722a-5527-45ce-aaa0-d8b8a144d4b8"], "isController": false}, {"data": [0.9796511627906976, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0fd8a112-e11d-4abf-ae65-332b7e768245"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/612ae1fd-ce7a-48c5-aeed-ffa56066bccb"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a4011e3c-0d50-4bfd-be12-95aec25a780a"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/b84f1bb7-4a27-4842-93a1-0e8a3899acd9"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d04e4f2b-a19d-4b60-842b-158e28f76a3b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=224e2a2a-6c98-425f-883f-2395f15b1cd2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1bb9bd5-c7b0-4f02-837b-c59b8937e2b8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/93b1782d-6430-4063-8edd-c9d63fa13dbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1264, 4, 0.31645569620253167, 407.462025316456, 102, 3299, 137.0, 1148.0, 1356.0, 1797.199999999997, 5.03002495115225, 707.8711704632279, 3.6591976533182646], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1870.7962962962963, 1294, 2547, 1867.0, 2246.5, 2329.5, 2547.0, 0.2520067201792048, 303.24794077842074, 1.2391150743186485], "isController": true}, {"data": ["deleteBook", 13, 0, 0.0, 698.6153846153846, 491, 1153, 599.0, 1152.6, 1153.0, 1153.0, 0.0979535248199162, 0.017696681730160643, 0.0665777864010368], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 698.6153846153846, 491, 1153, 599.0, 1152.6, 1153.0, 1153.0, 0.09773627745073717, 0.017657432937877318, 0.06643012607979791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2fcccb7d-199a-4416-a758-3abe8d932f84", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 153.8125, 110, 339, 115.5, 327.1, 339.0, 339.0, 0.0969485445599748, 0.025941309774837006, 0.055290966819360625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 116.31249999999999, 108, 125, 116.0, 123.6, 125.0, 125.0, 0.0969420831641896, 0.072043872351512, 0.048660381588274855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 210.0, 108, 346, 121.0, 345.3, 346.0, 346.0, 0.09694971945174934, 0.026130979070979315, 0.057090508622465674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 127.0, 107, 325, 114.5, 183.60000000000014, 325.0, 325.0, 0.09694913200230254, 0.02613082073499561, 0.05699548580604114], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 526.9230769230769, 208, 1382, 370.0, 1278.0, 1382.0, 1382.0, 0.09985329247029365, 0.24360242835526263, 0.06455359337434999], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 114.37499999999999, 108, 122, 114.5, 118.5, 122.0, 122.0, 0.0894984729323056, 0.06651204873191852, 0.044924038171098704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 175.74999999999997, 107, 454, 114.5, 377.70000000000005, 454.0, 454.0, 0.08949947419058912, 0.023948101492403732, 0.051042668874320365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 775.0, 639, 911, 775.0, 911.0, 911.0, 911.0, 0.033085741699614556, 9.728306609704049, 0.018869212063061424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1193.5, 1153, 1234, 1193.5, 1234.0, 1234.0, 1234.0, 0.032762179340169714, 29.479466560053076, 0.018652686089178652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 232.0, 120, 344, 232.0, 344.0, 344.0, 344.0, 0.03324689141565264, 0.05883141332535408, 0.018409167414721723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 114.81818181818181, 109, 120, 115.0, 119.6, 120.0, 120.0, 0.06313131313131314, 0.04691692313762626, 0.03168895991161616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 131.1818181818182, 104, 340, 111.0, 295.20000000000016, 340.0, 340.0, 0.06313566131735426, 0.016893721875932684, 0.036007056845053606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 134.54545454545453, 109, 347, 114.0, 301.40000000000015, 347.0, 347.0, 0.06313312480270898, 0.017016350044480155, 0.03711537219846758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 153.18181818181816, 105, 344, 114.0, 343.0, 344.0, 344.0, 0.06313240012167334, 0.01701615472029477, 0.03717659889977445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ae71f82-1226-445c-8f46-6a94ad4f2fd4", 3, 0, 0.0, 415.0, 222, 560, 463.0, 560.0, 560.0, 560.0, 0.029712678399873228, 0.02477023742906098, 0.01905402879158537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=424cc359-5d0f-4025-b95c-618ad3f49d5e", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04c4d388-2adf-4c9e-a44b-2bce0b9b1c82", 3, 0, 0.0, 352.0, 208, 492, 356.0, 492.0, 492.0, 492.0, 0.02879189220315559, 0.024002615863372875, 0.01846355066413298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 113.5, 110, 117, 113.5, 117.0, 117.0, 117.0, 0.033372824509002315, 0.024801483839209732, 0.01873962313737923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dae5722a-5527-45ce-aaa0-d8b8a144d4b8", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 862.6874999999999, 110, 1358, 1232.0, 1356.6, 1358.0, 1358.0, 0.07911705368092092, 44.501536678789705, 0.04226272301119506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 156.0625, 109, 345, 114.0, 342.9, 345.0, 345.0, 0.08949997482813209, 0.024123040090394978, 0.05261619613919484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 586.25, 108, 1031, 673.5, 1028.9, 1031.0, 1031.0, 0.07920909716480938, 14.564321345118985, 0.042389243404605016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 142.68750000000003, 112, 345, 115.0, 330.3, 345.0, 345.0, 0.08949697108688477, 0.024122230488261915, 0.05270182965370266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e98b2df-69a4-4452-a86a-71c79912abb9", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 596.3846153846154, 205, 1459, 488.0, 1194.9999999999998, 1459.0, 1459.0, 0.09751706548646014, 0.017617829213862426, 0.06723344554046957], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 292.0, 222, 464, 232.0, 463.8, 464.0, 464.0, 0.06308931152354952, 0.09777611073034481, 0.1418893402722017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c0dbee3-5189-4c1d-980f-daa78ee7a383", 1, 0, 0.0, 703.0, 703, 703, 703.0, 703.0, 703.0, 703.0, 1.4224751066856332, 0.2569901315789474, 0.9807299075391182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b84f1bb7-4a27-4842-93a1-0e8a3899acd9", 1, 0, 0.0, 1459.0, 1459, 1459, 1459.0, 1459.0, 1459.0, 1459.0, 0.6854009595613434, 0.12382732179575051, 0.4725518334475668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/424cc359-5d0f-4025-b95c-618ad3f49d5e", 3, 0, 0.0, 636.6666666666666, 301, 1098, 511.0, 1098.0, 1098.0, 1098.0, 0.09585277014505719, 0.04243482011630136, 0.061468085021407125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 557.3809523809523, 129, 1183, 538.0, 1112.4, 1177.3, 1183.0, 0.08812606223378584, 0.054132122211964166, 0.039846061342034035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 127.87500000000001, 105, 339, 115.5, 185.00000000000017, 339.0, 339.0, 0.07920478396895173, 0.05886214902380103, 0.03975708882816522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 181.93750000000003, 102, 355, 116.0, 348.7, 355.0, 355.0, 0.07921105786367777, 0.09555220627549606, 0.0410172494455226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c0b6444-a0d6-4f23-b30d-0c9e1723322c", 2, 0, 0.0, 783.0, 228, 1338, 783.0, 1338.0, 1338.0, 1338.0, 0.03263281555932646, 0.028840525469912545, 0.020283971780772746], "isController": false}, {"data": ["login", 21, 0, 0.0, 2770.190476190476, 1811, 4701, 2700.0, 4096.8, 4642.9, 4701.0, 0.09027443428021184, 10.413935148565926, 0.15046158849688768], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 119.125, 110, 130, 118.0, 129.3, 130.0, 130.0, 0.09411211105229104, 0.07619037115463796, 0.03345391447561908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 991.9999999999999, 220, 1477, 1350.0, 1476.3, 1477.0, 1477.0, 0.07907013520993121, 59.16806056092848, 0.1651863151834427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6f67fe4-008d-4e7f-aba5-8ab419d9126d", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=612ae1fd-ce7a-48c5-aeed-ffa56066bccb", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93b1782d-6430-4063-8edd-c9d63fa13dbe", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 342.99999999999994, 225, 469, 343.5, 466.2, 469.0, 469.0, 0.09687399720276334, 0.1501357749617045, 0.21787189019332415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1308.0, 1271, 1345, 1308.0, 1345.0, 1345.0, 1345.0, 0.03269897325223988, 39.11934001209862, 0.07373235277287293], "isController": false}, {"data": ["register", 22, 2, 9.090909090909092, 1345.7727272727273, 142, 3299, 1289.5, 2522.899999999999, 3225.199999999999, 3299.0, 0.09342936739824692, 0.02999295032955086, 0.042152702869130934], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 130.88888888888886, 109, 348, 117.5, 150.90000000000032, 348.0, 348.0, 0.09435396365275645, 0.07325332139056775, 0.03353988551719077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 335.68750000000006, 224, 570, 243.0, 494.4000000000001, 570.0, 570.0, 0.0894409382354421, 0.13861598533168612, 0.20115476636349913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1bb9bd5-c7b0-4f02-837b-c59b8937e2b8", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2fcccb7d-199a-4416-a758-3abe8d932f84", 3, 0, 0.0, 357.6666666666667, 207, 461, 405.0, 461.0, 461.0, 461.0, 0.03979835500132661, 0.024757375132661186, 0.025521731560095517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 610.4705882352941, 219, 1462, 461.0, 1398.0, 1462.0, 1462.0, 0.09711400041130636, 20.626672270953776, 0.21402680524929735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c0d1920-428f-42d7-9312-9ff72714a818", 1, 0, 0.0, 2411.0, 2411, 2411, 2411.0, 2411.0, 2411.0, 2411.0, 0.41476565740356697, 0.13244958004977186, 0.2474822428452924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 133.07692307692307, 109, 344, 116.0, 253.5999999999999, 344.0, 344.0, 0.06507679061292325, 0.0483627320863619, 0.03266549841312749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 145.61538461538458, 104, 336, 115.0, 326.0, 336.0, 336.0, 0.06500487536565241, 0.03992486936520239, 0.03581323286746506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 395.8461538461538, 108, 1390, 115.0, 1380.0, 1390.0, 1390.0, 0.06471267571980407, 13.450781460005077, 0.036760611012106245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 297.7692307692308, 104, 913, 115.0, 912.6, 913.0, 913.0, 0.06489260274246123, 4.416665028752415, 0.03692619184000479], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1278.1481481481485, 822, 2025, 1247.0, 1785.0, 1844.0, 2025.0, 0.25786241607533406, 308.4930971066882, 0.5091775442425053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 2, 9.090909090909092, 1345.7727272727273, 142, 3299, 1289.5, 2522.899999999999, 3225.199999999999, 3299.0, 0.09506401697324812, 0.030517709994252948, 0.04289021078285218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 115.33333333333333, 104, 127, 115.5, 127.0, 127.0, 127.0, 0.035538497076958615, 0.009578735540274002, 0.020927454821685593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 153.0, 111, 339, 116.5, 339.0, 339.0, 339.0, 0.03553891807687068, 0.00957884901290655, 0.020892996760035303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 259.55555555555554, 104, 1275, 113.5, 1190.4, 1275.0, 1275.0, 0.09293440379998451, 9.313658856519606, 0.05374787025324625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 256.3888888888889, 110, 1036, 115.0, 913.6000000000001, 1036.0, 1036.0, 0.0930040301746409, 3.0607569817608766, 0.05387896235920223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 137.1111111111111, 105, 348, 114.5, 328.20000000000005, 348.0, 348.0, 0.09344678465188477, 0.06944629210945734, 0.0469059055772156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 155.83333333333334, 114, 343, 116.0, 343.0, 343.0, 343.0, 0.03549014852627158, 0.009496387398631264, 0.02024047533138926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 122.05555555555554, 102, 324, 110.5, 138.6000000000003, 324.0, 324.0, 0.0934501806703493, 0.04060053422353283, 0.052423766717198984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 117.0, 113, 119, 117.5, 119.0, 119.0, 119.0, 0.03553702365581208, 0.02640983886921191, 0.0178379200772338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 163.66666666666669, 118, 354, 125.0, 354.0, 354.0, 354.0, 0.03590341980073602, 0.02825991831971995, 0.01276254375729288], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 612.8333333333334, 402, 1324, 535.5, 1166.5000000000005, 1324.0, 1324.0, 0.11183284717109493, 0.020204176490871643, 0.07612060007641912], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1571.1428571428573, 1038, 2918, 1441.0, 2481.8, 2887.2999999999997, 2918.0, 0.08724553385957624, 0.04515637982966348, 0.04012953754673868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 311.83333333333337, 236, 457, 242.5, 457.0, 457.0, 457.0, 0.03546476575522219, 0.05496346020853283, 0.0797610893889421], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c0dbee3-5189-4c1d-980f-daa78ee7a383", 3, 0, 0.0, 680.6666666666666, 370, 984, 688.0, 984.0, 984.0, 984.0, 0.018883007181837063, 0.026031749809596345, 0.012109220100331712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/224e2a2a-6c98-425f-883f-2395f15b1cd2", 3, 0, 0.0, 519.3333333333334, 289, 702, 567.0, 702.0, 702.0, 702.0, 0.017454037700721434, 0.024061800020363046, 0.011192856207819409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04c4d388-2adf-4c9e-a44b-2bce0b9b1c82", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["addBook", 59, 2, 3.389830508474576, 1219.4576271186438, 637, 2308, 956.0, 2001.0, 2122.0, 2308.0, 0.28701942489090826, 105.83989040205826, 1.041224533106961], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ae71f82-1226-445c-8f46-6a94ad4f2fd4", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 202.9629629629629, 109, 467, 117.0, 460.0, 464.25, 467.0, 0.25912205608552946, 0.19257019988387494, 0.12525919703353233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4011e3c-0d50-4bfd-be12-95aec25a780a", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 699.7222222222221, 518, 985, 673.5, 906.0, 912.25, 985.0, 0.2589034002646568, 76.12619607977102, 0.13021020618779128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c0b6444-a0d6-4f23-b30d-0c9e1723322c", 1, 0, 0.0, 799.0, 799, 799, 799.0, 799.0, 799.0, 799.0, 1.2515644555694618, 0.22611271902377972, 0.862895025031289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5473006a-8d10-4de5-b697-762ed09b3352", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.6927026843817787, 1.29431602494577], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 176.96296296296296, 109, 468, 118.0, 343.5, 347.25, 468.0, 0.2595929198434751, 0.4593577839417743, 0.12624733797075252], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1071.9259259259259, 711, 1528, 1066.0, 1343.0, 1375.25, 1528.0, 0.25847585404730106, 232.5770278238487, 0.12974276267608667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 119.82352941176471, 113, 135, 118.0, 130.2, 135.0, 135.0, 0.09745862308164166, 0.07280844400142175, 0.03464349492355231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dae5722a-5527-45ce-aaa0-d8b8a144d4b8", 3, 0, 0.0, 314.6666666666667, 215, 409, 320.0, 409.0, 409.0, 409.0, 0.03852673755586377, 0.032118155885601275, 0.024706273758154828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 2, 1.1627906976744187, 185.94186046511624, 104, 943, 124.0, 339.60000000000014, 418.35, 767.0700000000024, 0.7434205123550438, 1.5703264121207798, 0.3597017660019104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 152.6153846153846, 111, 345, 118.0, 344.2, 345.0, 345.0, 0.06540847593219656, 0.05065324356858582, 0.023250669179023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fd8a112-e11d-4abf-ae65-332b7e768245", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 132.06250000000003, 110, 352, 118.0, 190.30000000000018, 352.0, 352.0, 0.09077808163218991, 0.07366854085581037, 0.03226877120519251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/612ae1fd-ce7a-48c5-aeed-ffa56066bccb", 3, 0, 0.0, 634.3333333333333, 270, 1324, 309.0, 1324.0, 1324.0, 1324.0, 0.029141774734081305, 0.02922715102724756, 0.018687921948613337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 548.3076923076923, 226, 1507, 235.0, 1496.6, 1507.0, 1507.0, 0.06467565160718994, 17.932772225414546, 0.1416383166544778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4011e3c-0d50-4bfd-be12-95aec25a780a", 3, 0, 0.0, 718.3333333333334, 211, 1382, 562.0, 1382.0, 1382.0, 1382.0, 0.017999208034846465, 0.024813361337101165, 0.011542460881721204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b84f1bb7-4a27-4842-93a1-0e8a3899acd9", 3, 0, 0.0, 1224.6666666666667, 799, 1753, 1122.0, 1753.0, 1753.0, 1753.0, 0.018511205449698885, 0.025519191106599864, 0.011870792557261329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 447.1666666666666, 217, 1601, 238.0, 1324.7000000000005, 1601.0, 1601.0, 0.0928773399929826, 12.473902434934264, 0.20624292132773317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d04e4f2b-a19d-4b60-842b-158e28f76a3b", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.9020789194915255, 1.6855358403954803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=224e2a2a-6c98-425f-883f-2395f15b1cd2", 1, 0, 0.0, 691.0, 691, 691, 691.0, 691.0, 691.0, 691.0, 1.447178002894356, 0.2614530571635311, 0.9977613965267729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 120.0909090909091, 111, 148, 117.0, 143.60000000000002, 148.0, 148.0, 0.06344775077723494, 0.05260462930651608, 0.022553692659095233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1bb9bd5-c7b0-4f02-837b-c59b8937e2b8", 3, 0, 0.0, 282.6666666666667, 214, 402, 232.0, 402.0, 402.0, 402.0, 0.028996993978290916, 0.029081946109086692, 0.018595077518630567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93b1782d-6430-4063-8edd-c9d63fa13dbe", 3, 0, 0.0, 396.0, 213, 531, 444.0, 531.0, 531.0, 531.0, 0.023978131943667377, 0.024048380377096088, 0.01537660153939607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 118.81250000000001, 111, 133, 117.0, 129.5, 133.0, 133.0, 0.07752276019787685, 0.06018612730206259, 0.027556918664089037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 168.99999999999997, 103, 341, 117.0, 340.2, 341.0, 341.0, 0.09774047030414534, 0.07263720498188926, 0.04906113450813546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 219.9411764705882, 109, 348, 122.0, 346.4, 348.0, 348.0, 0.09763549796975596, 0.05200346606017793, 0.054235711475616975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 385.70588235294116, 102, 1273, 339.0, 1151.3999999999999, 1273.0, 1273.0, 0.0972028451844567, 15.45627422030453, 0.05567051737643803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 369.0, 107, 912, 338.0, 905.6, 912.0, 912.0, 0.0973191438205206, 5.071318026797113, 0.05583216276054339], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 50.0, 0.15822784810126583], "isController": false}, {"data": ["401/Unauthorized", 2, 50.0, 0.15822784810126583], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1264, 4, "406/Not Acceptable", 2, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
