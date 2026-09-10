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

    var data = {"OkPercent": 98.21981424148606, "KoPercent": 1.7801857585139318};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7094414893617021, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/510dbfeb-6018-4711-9435-f3fe3699bb13"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4d566397-eeb6-45a2-8599-169217649325"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c5a18e8-f128-40e2-b090-a10fdfed4fe5"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb59fc6b-117e-438c-8ff6-f60d4e74da42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cc48c798-9277-4d93-8fbb-9f882da5445b"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cda966b2-1b7e-4004-aef9-e630ee65f376"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2b01c53-0b25-4acc-a67c-a02f28cf0245"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b9c91f76-86ba-40e9-b692-15cac6ca58d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92fd8726-6e69-4ea2-a42e-edb046ae6590"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd945297-2683-4c7c-bb27-6e635fed7893"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71704262-c516-439e-8b65-8bd458f7b8d1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40eace72-cbce-4a45-914b-9a534d277a8d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/75e64235-de00-4edf-a6a1-5dafeff8236d"], "isController": false}, {"data": [0.4411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e6760c3a-c68a-4265-b490-830ce054d52b"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a2b01c53-0b25-4acc-a67c-a02f28cf0245"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4aa10b12-7572-49d7-b504-90733feaf506"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.23684210526315788, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d566397-eeb6-45a2-8599-169217649325"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c5a18e8-f128-40e2-b090-a10fdfed4fe5"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.11363636363636363, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb59fc6b-117e-438c-8ff6-f60d4e74da42"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9c91f76-86ba-40e9-b692-15cac6ca58d3"], "isController": false}, {"data": [0.2818181818181818, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a0a77c7d-3e09-44de-b232-1cd7d577c90f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3157894736842105, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cda966b2-1b7e-4004-aef9-e630ee65f376"], "isController": false}, {"data": [0.9131736526946108, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0a77c7d-3e09-44de-b232-1cd7d577c90f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc48c798-9277-4d93-8fbb-9f882da5445b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40eace72-cbce-4a45-914b-9a534d277a8d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75e64235-de00-4edf-a6a1-5dafeff8236d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6760c3a-c68a-4265-b490-830ce054d52b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71704262-c516-439e-8b65-8bd458f7b8d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1292, 23, 1.7801857585139318, 497.7376160990714, 136, 4597, 161.5, 1389.4, 1669.3999999999996, 2227.3999999999987, 5.0466778641459324, 722.9179661561072, 3.6911590672727628], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2313.1578947368416, 1700, 3310, 2260.0, 2928.8, 3048.7999999999997, 3310.0, 0.2568284836305635, 309.0520265654147, 1.2628236475389525], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/510dbfeb-6018-4711-9435-f3fe3699bb13", 1, 0, 0.0, 620.0, 620, 620, 620.0, 620.0, 620.0, 620.0, 1.6129032258064515, 0.5150579637096774, 0.9623865927419355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d566397-eeb6-45a2-8599-169217649325", 3, 0, 0.0, 470.3333333333333, 243, 641, 527.0, 641.0, 641.0, 641.0, 0.018514861261972944, 0.021883939206453044, 0.011873136942085513], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 620.8571428571428, 161, 1033, 624.5, 1030.5, 1033.0, 1033.0, 0.07464079119238663, 0.014703236211446698, 0.05022217298003359], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 620.8571428571428, 161, 1033, 624.5, 1030.5, 1033.0, 1033.0, 0.074289474242778, 0.014634031477511515, 0.04998578882155668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 143.35714285714283, 138, 153, 142.5, 152.0, 153.0, 153.0, 0.09332835582102288, 0.024972626459922136, 0.05322632792917711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 164.92857142857144, 140, 415, 146.0, 283.0, 415.0, 415.0, 0.09316377526235585, 0.06923596970180937, 0.04676384812973721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 222.7142857142857, 138, 431, 145.0, 429.0, 431.0, 431.0, 0.09333208890548127, 0.025155914587805493, 0.0549602046972707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 280.0, 139, 438, 276.5, 435.5, 438.0, 438.0, 0.09333582228859437, 0.0251569208512227, 0.054871254900130666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c5a18e8-f128-40e2-b090-a10fdfed4fe5", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 0.705718994140625, 2.69317626953125], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 335.8571428571429, 146, 962, 250.5, 768.0, 962.0, 962.0, 0.07512261083268049, 0.15024522166536097, 0.048555113837584915], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fb59fc6b-117e-438c-8ff6-f60d4e74da42", 3, 0, 0.0, 702.3333333333333, 239, 1485, 383.0, 1485.0, 1485.0, 1485.0, 0.024146423914618242, 0.024217165390930603, 0.015484523148371726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 24, 0, 0.0, 170.41666666666666, 138, 470, 145.5, 297.0, 460.0, 470.0, 0.13944408292274799, 0.10362983115645627, 0.06999439318583248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 24, 0, 0.0, 187.70833333333334, 137, 418, 144.5, 413.5, 417.25, 418.0, 0.1392248655609892, 0.04596641272631292, 0.0789144847519767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1031.5, 814, 1193, 1107.0, 1193.0, 1193.0, 1193.0, 0.04185063508338739, 12.305476286383897, 0.023867940320994374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1555.3333333333333, 1420, 1657, 1569.5, 1657.0, 1657.0, 1657.0, 0.04169359377931581, 37.51596897214868, 0.023737661302090932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc48c798-9277-4d93-8fbb-9f882da5445b", 3, 0, 0.0, 1539.6666666666667, 329, 3659, 631.0, 3659.0, 3659.0, 3659.0, 0.023983882830737744, 0.02405414811246842, 0.015380289445492629], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 298.0, 138, 525, 280.0, 525.0, 525.0, 525.0, 0.042056860875904226, 0.0744209295968149, 0.023287343863904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cda966b2-1b7e-4004-aef9-e630ee65f376", 3, 0, 0.0, 520.0, 340, 876, 344.0, 876.0, 876.0, 876.0, 0.049292650465815546, 0.0320113403903978, 0.031610195773976765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 145.0, 137, 157, 146.0, 155.5, 157.0, 157.0, 0.08308358802409424, 0.06174473680306222, 0.04170406664490668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 184.28571428571425, 137, 432, 145.0, 423.0, 432.0, 432.0, 0.08295706379398206, 0.03109732567165594, 0.0468138006482502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 294.5, 137, 1717, 144.0, 1065.5, 1717.0, 1717.0, 0.08295903009042534, 5.352668697558041, 0.04826160093151139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 235.64285714285714, 136, 1145, 144.5, 788.0, 1145.0, 1145.0, 0.0830939436385651, 1.765966556913416, 0.048421233618622536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2b01c53-0b25-4acc-a67c-a02f28cf0245", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 237.83333333333331, 139, 434, 144.5, 434.0, 434.0, 434.0, 0.04213719871902916, 0.03131485178240351, 0.023661024671329852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 984.4117647058823, 139, 1855, 1248.0, 1759.0, 1855.0, 1855.0, 0.08059431193791393, 42.66712319492446, 0.04330647942711667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 24, 0, 0.0, 249.24999999999994, 138, 1284, 143.0, 433.5, 1071.5, 1284.0, 0.13921275188807294, 5.25528704835613, 0.08134338855439159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 778.3529411764707, 136, 1285, 1101.0, 1261.0, 1285.0, 1285.0, 0.08059354777538104, 13.948461611396876, 0.0433847734491668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 24, 0, 0.0, 255.70833333333343, 138, 1159, 144.5, 430.5, 977.25, 1159.0, 0.13945056477478734, 1.7444825330904568, 0.08161852716961836], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 504.2857142857142, 149, 1332, 503.0, 952.0, 1332.0, 1332.0, 0.07434273060849525, 0.014644522268302915, 0.05049871028637882], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 464.78571428571433, 282, 1858, 298.5, 1219.0, 1858.0, 1858.0, 0.08287946957139473, 7.201605003477979, 0.18488319174757284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9c91f76-86ba-40e9-b692-15cac6ca58d3", 3, 0, 0.0, 568.0, 258, 872, 574.0, 872.0, 872.0, 872.0, 0.020598736610821202, 0.024347009320928318, 0.01320947627712167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92fd8726-6e69-4ea2-a42e-edb046ae6590", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd945297-2683-4c7c-bb27-6e635fed7893", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.7392035590277778, 1.3812029803240742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 818.6363636363635, 158, 1593, 779.5, 1447.1999999999998, 1588.05, 1593.0, 0.09558775607742608, 0.05871552594990333, 0.04321985455453933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 144.23529411764704, 138, 163, 142.0, 152.6, 163.0, 163.0, 0.08059087332062842, 0.05989224081738108, 0.04045284070976856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71704262-c516-439e-8b65-8bd458f7b8d1", 2, 0, 0.0, 374.5, 269, 480, 374.5, 480.0, 480.0, 480.0, 0.015036237331970048, 0.0256966946591285, 0.009346254943163023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 237.2941176470588, 137, 577, 144.0, 481.7999999999999, 577.0, 577.0, 0.08059354777538104, 0.09276961801028753, 0.041981979045677575], "isController": false}, {"data": ["login", 22, 0, 0.0, 3610.818181818182, 2287, 6573, 3315.5, 5548.099999999999, 6461.699999999999, 6573.0, 0.09335483323432063, 30.58684419555716, 0.1830712811890011], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 24, 0, 0.0, 176.33333333333334, 144, 586, 151.0, 245.0, 517.25, 586.0, 0.13987318164863857, 0.1132371753776576, 0.04972054503916449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40eace72-cbce-4a45-914b-9a534d277a8d", 3, 0, 0.0, 371.0, 241, 607, 265.0, 607.0, 607.0, 607.0, 0.03638215818962381, 0.030330308308472193, 0.023331006391132454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75e64235-de00-4edf-a6a1-5dafeff8236d", 3, 0, 0.0, 708.0, 571, 962, 591.0, 962.0, 962.0, 962.0, 0.018321617676696732, 0.021655531830757108, 0.01174921446064211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1149.294117647059, 284, 2003, 1388.0, 1902.1999999999998, 2003.0, 2003.0, 0.0805370399321594, 56.72804155385559, 0.16900842174642203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6760c3a-c68a-4265-b490-830ce054d52b", 3, 0, 0.0, 528.3333333333334, 248, 708, 629.0, 708.0, 708.0, 708.0, 0.0724112961622013, 0.032764225802558535, 0.046435629374849144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 467.7857142857143, 282, 843, 558.5, 714.5, 843.0, 843.0, 0.09307025474658298, 0.14424071707307343, 0.20931718425916077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 1134.6, 144, 2081, 1604.0, 2072.3, 2081.0, 2081.0, 0.06942082208137508, 49.838292872564196, 0.11232072072697484], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1475.0869565217392, 178, 2664, 1489.0, 2324.0, 2606.399999999999, 2664.0, 0.09513921348825857, 0.029973376532051572, 0.042924137335522916], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a2b01c53-0b25-4acc-a67c-a02f28cf0245", 3, 0, 0.0, 709.3333333333334, 238, 1224, 666.0, 1224.0, 1224.0, 1224.0, 0.020332366416352644, 0.024032168768807437, 0.013038659453194892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 150.8235294117647, 142, 209, 148.0, 163.39999999999995, 209.0, 209.0, 0.07622429671876821, 0.05917804286271555, 0.027095355474249638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 24, 0, 0.0, 469.5833333333333, 284, 1433, 296.5, 884.0, 1300.5, 1433.0, 0.13909414935234288, 7.1401267151322845, 0.31134314599090096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 430.99999999999994, 284, 581, 430.5, 577.5, 581.0, 581.0, 0.112165781024354, 0.1738350532086424, 0.25226347040926494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 148.0, 139, 158, 147.5, 158.0, 158.0, 158.0, 0.034865072170699396, 0.025910468673732655, 0.017500631929433096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 143.75, 142, 145, 144.0, 145.0, 145.0, 145.0, 0.034863552770345065, 0.009328724081127487, 0.019883119939337418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 143.0, 138, 145, 144.5, 145.0, 145.0, 145.0, 0.034863552770345065, 0.009396816957632068, 0.02049595582787864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4aa10b12-7572-49d7-b504-90733feaf506", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.6249235567514677, 1.167670621330724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 143.25, 139, 145, 144.5, 145.0, 145.0, 145.0, 0.034863552770345065, 0.009396816957632068, 0.02053000226613093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 174.0, 149, 199, 174.0, 199.0, 199.0, 199.0, 0.06617476756112894, 0.019516386526817326, 0.04090686315058068], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1577.157894736842, 1095, 2635, 1516.0, 2311.4, 2444.5, 2635.0, 0.2486390284757119, 297.45871896919493, 0.49096495661903267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1475.0869565217392, 178, 2664, 1489.0, 2324.0, 2606.399999999999, 2664.0, 0.0969331203614341, 0.03053854250517328, 0.04373349766306891], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d566397-eeb6-45a2-8599-169217649325", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 150.5, 138, 195, 143.5, 195.0, 195.0, 195.0, 0.04835823782581363, 0.01303405628898883, 0.028476579500942987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 191.83333333333334, 139, 437, 144.5, 437.0, 437.0, 437.0, 0.048263712927435504, 0.013008578874972853, 0.028373784357730643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c5a18e8-f128-40e2-b090-a10fdfed4fe5", 3, 0, 0.0, 422.0, 262, 648, 356.0, 648.0, 648.0, 648.0, 0.07758754461283816, 0.03510634342833498, 0.049755033491956764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 348.29411764705884, 140, 1628, 144.0, 1588.8, 1628.0, 1628.0, 0.07918541497815414, 8.40132325524254, 0.04575177526713432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 344.6470588235294, 137, 1153, 147.0, 1145.0, 1153.0, 1153.0, 0.07918541497815414, 2.758025092460617, 0.04582910477394893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 162.76470588235296, 139, 418, 146.0, 220.3999999999998, 418.0, 418.0, 0.07918725923579636, 0.05884912527191507, 0.039748292233593094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 200.0, 136, 434, 145.5, 434.0, 434.0, 434.0, 0.04835784807576063, 0.012939502317146887, 0.027579085230707234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 176.0, 137, 430, 145.0, 413.2, 430.0, 430.0, 0.07918799696290742, 0.03518152392642038, 0.04437948634938676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 141.66666666666666, 138, 146, 140.0, 146.0, 146.0, 146.0, 0.04837695321948624, 0.035952013085965843, 0.024282962846499927], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 644.7692307692307, 144, 1485, 629.0, 1241.3999999999999, 1485.0, 1485.0, 0.0765448817970383, 0.01485242109989107, 0.052089850075072865], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 247.66666666666666, 143, 439, 164.5, 439.0, 439.0, 439.0, 0.047135349155098864, 0.037100675213876645, 0.016755143644976548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1813.4090909090912, 1285, 4597, 1646.0, 2232.6, 4255.749999999995, 4597.0, 0.09432870122241421, 0.048822472312382355, 0.04338751784741904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb59fc6b-117e-438c-8ff6-f60d4e74da42", 1, 0, 0.0, 1332.0, 1332, 1332, 1332.0, 1332.0, 1332.0, 1332.0, 0.7507507507507507, 0.13563368055555555, 0.5176074512012012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 384.0, 282, 581, 289.5, 581.0, 581.0, 581.0, 0.04820671037408407, 0.07471098570671038, 0.10841802147608948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9c91f76-86ba-40e9-b692-15cac6ca58d3", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["addBook", 55, 9, 16.363636363636363, 1453.327272727273, 738, 3855, 1152.0, 2591.8, 2700.3999999999996, 3855.0, 0.2975240588773065, 91.75538962296939, 1.0817419036265477], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 237.38596491228066, 138, 864, 147.0, 582.2, 590.3, 864.0, 0.2501942297309754, 0.18593536018092993, 0.12094349972346953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0a77c7d-3e09-44de-b232-1cd7d577c90f", 3, 0, 0.0, 365.3333333333333, 253, 559, 284.0, 559.0, 559.0, 559.0, 0.03754176521380035, 0.03129702497153083, 0.02407463459348525], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 915.3684210526314, 679, 1296, 855.0, 1194.0000000000002, 1257.1, 1296.0, 0.25038986140701536, 73.62293297952952, 0.1259284947505985], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 197.33333333333334, 138, 594, 146.0, 420.6, 434.29999999999995, 594.0, 0.25102612433279897, 0.4441985715732732, 0.122081064372787], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1329.4561403508767, 950, 1874, 1322.0, 1738.4, 1786.9999999999995, 1874.0, 0.24962337525838207, 224.61155184858154, 0.1252992332839926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 154.37500000000003, 146, 170, 152.5, 165.1, 170.0, 170.0, 0.11303985361338957, 0.08444871876390919, 0.04018213546413457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cda966b2-1b7e-4004-aef9-e630ee65f376", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 9, 5.389221556886228, 229.63473053892218, 139, 1514, 154.0, 417.60000000000014, 526.8, 1032.5599999999952, 0.697111370846552, 1.5489456907977124, 0.3321274550217065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 257.25, 147, 557, 162.5, 557.0, 557.0, 557.0, 0.03354775942901713, 0.025979856667197838, 0.011925180109533435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0a77c7d-3e09-44de-b232-1cd7d577c90f", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 148.07142857142858, 140, 163, 146.5, 159.0, 163.0, 163.0, 0.08931476436851271, 0.07248102459983796, 0.031748607646619756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc48c798-9277-4d93-8fbb-9f882da5445b", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 293.75, 285, 304, 293.0, 304.0, 304.0, 304.0, 0.034821063261166685, 0.05396584706589015, 0.07831338739303405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 595.1764705882352, 283, 1770, 564.0, 1728.3999999999999, 1770.0, 1770.0, 0.07913049549654386, 11.245571637826703, 0.17558442380198758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40eace72-cbce-4a45-914b-9a534d277a8d", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75e64235-de00-4edf-a6a1-5dafeff8236d", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 174.2857142857143, 146, 449, 151.0, 312.0, 449.0, 449.0, 0.07960651636198221, 0.06600188710090125, 0.02829762886304836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6760c3a-c68a-4265-b490-830ce054d52b", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 169.7058823529412, 141, 433, 152.0, 223.3999999999998, 433.0, 433.0, 0.07864908628267407, 0.0610605699167245, 0.027957292389544298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71704262-c516-439e-8b65-8bd458f7b8d1", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 143.125, 138, 150, 142.5, 148.6, 150.0, 150.0, 0.11227991382516614, 0.08344239689546037, 0.056359253619272846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 196.5625, 137, 434, 144.0, 432.6, 434.0, 434.0, 0.11228227764600204, 0.030044281323246644, 0.06403598646998555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 230.25, 137, 434, 142.5, 432.6, 434.0, 434.0, 0.11228621756858231, 0.030264644579031955, 0.06601201462527984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 249.75, 138, 434, 145.5, 433.3, 434.0, 434.0, 0.11228621756858231, 0.030264644579031955, 0.06612166913462415], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 26.08695652173913, 0.46439628482972134], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.15479876160990713], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.15479876160990713], "isController": false}, {"data": ["401/Unauthorized", 13, 56.52173913043478, 1.0061919504643964], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1292, 23, "401/Unauthorized", 13, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
