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

    var data = {"OkPercent": 97.0917225950783, "KoPercent": 2.9082774049217};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7447351627313338, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/532f4f12-2194-4b0d-8c6c-a36d053df7ca"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd2dd833-21e6-462e-a9f0-77e881f91eaa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cdc5902e-09cb-4ac6-a6d8-f414e1380aff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e929eb3-ae46-45ef-a6c7-820a30d36726"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bce03b1a-a463-420e-9159-410e5f9a4ea3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bce03b1a-a463-420e-9159-410e5f9a4ea3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e929eb3-ae46-45ef-a6c7-820a30d36726"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd2dd833-21e6-462e-a9f0-77e881f91eaa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/286d755b-c885-41b7-8ad1-cb539e237932"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4fe34fbc-2b97-4039-9bec-5b84abae9597"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da8b662b-1665-4f24-97db-740efe774abc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65a0b1c9-a4f5-40f4-ac95-76bf8be0b234"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=532f4f12-2194-4b0d-8c6c-a36d053df7ca"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.17857142857142858, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8edff25c-1ac4-43d2-bafe-1a03f6b8148d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ed6b68f-23ed-450b-9a66-4e9acfede069"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35964912280701755, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/acf4e867-ae34-4208-8dc8-554059e4aebf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65e6c862-0289-4ff1-9e97-71b38c4177ce"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "addBook"], "isController": true}, {"data": [0.9035087719298246, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8954802259887006, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdc5902e-09cb-4ac6-a6d8-f414e1380aff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65e6c862-0289-4ff1-9e97-71b38c4177ce"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acf4e867-ae34-4208-8dc8-554059e4aebf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=286d755b-c885-41b7-8ad1-cb539e237932"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/faa6d976-f29a-46ca-a947-e9954ffc1baa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/943ec83d-1fa5-45d7-815c-c1bf8aa9ce02"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da8b662b-1665-4f24-97db-740efe774abc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65a0b1c9-a4f5-40f4-ac95-76bf8be0b234"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/32d1e0aa-b58f-43bb-9644-33c432d52218"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ed6b68f-23ed-450b-9a66-4e9acfede069"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8edff25c-1ac4-43d2-bafe-1a03f6b8148d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1341, 39, 2.9082774049217, 439.92020879940327, 138, 3790, 161.0, 1150.0, 1302.8999999999999, 1891.3999999999978, 5.219889296307541, 739.1310086141798, 3.8114682957898345], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2134.98245614035, 1687, 2777, 2100.0, 2479.0, 2671.1, 2777.0, 0.2592877320511479, 312.01012174582524, 1.2749157528100876], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/532f4f12-2194-4b0d-8c6c-a36d053df7ca", 3, 0, 0.0, 381.3333333333333, 243, 470, 431.0, 470.0, 470.0, 470.0, 0.052971713105201816, 0.034055707481371614, 0.03396949050040612], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 624.5, 149, 2651, 468.0, 1967.8000000000006, 2651.0, 2651.0, 0.09029192508027517, 0.018891645457469682, 0.060290140403943496], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 624.5, 149, 2651, 468.0, 1967.8000000000006, 2651.0, 2651.0, 0.09002773979732505, 0.018836370362868057, 0.06011373738908301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 161.8, 140, 431, 148.0, 156.70000000000002, 417.2999999999998, 431.0, 0.0998716649105899, 0.04172372875854527, 0.05611929295854826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 149.45, 140, 159, 148.0, 156.8, 158.9, 159.0, 0.09987316108542152, 0.07422214412695877, 0.050131645310455726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 248.4, 143, 1032, 147.0, 929.7000000000012, 1029.6, 1032.0, 0.09987365982032728, 2.9608443756148475, 0.05795403189964695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 248.75, 139, 1306, 147.0, 929.5000000000018, 1291.4499999999998, 1306.0, 0.09987515605493133, 9.011011626092385, 0.057857365792759054], "isController": false}, {"data": ["goToProfile", 17, 5, 29.41176470588235, 232.88235294117644, 145, 314, 247.0, 307.6, 314.0, 314.0, 0.09245059331527827, 0.12063506589823908, 0.05974130998412025], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fd2dd833-21e6-462e-a9f0-77e881f91eaa", 3, 0, 0.0, 332.3333333333333, 247, 467, 283.0, 467.0, 467.0, 467.0, 0.06695681285570806, 0.03029621415020645, 0.04293779991072425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 168.71428571428572, 141, 437, 147.0, 299.0, 437.0, 437.0, 0.08436835222581791, 0.06269952738656977, 0.04234895805085001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 211.0, 140, 468, 146.5, 452.0, 468.0, 468.0, 0.08435869316333049, 0.031622741145350027, 0.04760475918605912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1049.6666666666665, 1005, 1071, 1058.5, 1071.0, 1071.0, 1071.0, 0.0503917962155761, 14.816861252488096, 0.028739071279195748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1112.5, 987, 1334, 1045.0, 1334.0, 1334.0, 1334.0, 0.05026725423501617, 45.230563721075384, 0.028618954315443777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 245.16666666666666, 146, 441, 151.5, 441.0, 441.0, 441.0, 0.0507725895713101, 0.08984368388985732, 0.02811333817083284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 197.83333333333331, 143, 439, 149.5, 438.4, 439.0, 439.0, 0.06576747907772071, 0.04887602693178268, 0.03301219164643403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 248.83333333333334, 144, 468, 151.0, 468.0, 468.0, 468.0, 0.06576567689322942, 0.025828870173073337, 0.037046713497309085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 319.33333333333337, 141, 1010, 154.5, 841.7000000000006, 1010.0, 1010.0, 0.06576819997917341, 4.9477778655067715, 0.038193511967072054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 313.66666666666663, 146, 985, 150.5, 823.9000000000005, 985.0, 985.0, 0.06577108374303237, 1.6278236177110568, 0.038259416226822544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdc5902e-09cb-4ac6-a6d8-f414e1380aff", 3, 0, 0.0, 342.3333333333333, 239, 544, 244.0, 544.0, 544.0, 544.0, 0.0657620728205353, 0.029755625397312524, 0.04217164175014797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e929eb3-ae46-45ef-a6c7-820a30d36726", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 196.66666666666666, 142, 438, 148.5, 438.0, 438.0, 438.0, 0.050647015624604316, 0.03763904188508192, 0.02843948631264403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 795.2941176470587, 146, 1386, 1086.0, 1319.6, 1386.0, 1386.0, 0.08183109100098679, 43.32188161869118, 0.04397104924306241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 207.71428571428572, 138, 1009, 146.0, 581.0, 1009.0, 1009.0, 0.08436987754314917, 5.443699161499011, 0.049082364586346544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 714.8235294117648, 143, 1226, 993.0, 1198.8, 1226.0, 1226.0, 0.08171466201373767, 14.142494748631279, 0.04398828686412774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bce03b1a-a463-420e-9159-410e5f9a4ea3", 3, 0, 0.0, 914.0, 240, 2250, 252.0, 2250.0, 2250.0, 2250.0, 0.06950558361521708, 0.031449466544645754, 0.04457226553449794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 283.85714285714283, 139, 987, 147.0, 807.5, 987.0, 987.0, 0.0843566599583037, 1.7928026257516783, 0.04915705477759969], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 446.81250000000006, 147, 1217, 432.5, 1074.2, 1217.0, 1217.0, 0.09027052949307457, 0.018887168890518773, 0.060628473299669944], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 570.0833333333334, 297, 1450, 588.5, 1286.5000000000005, 1450.0, 1450.0, 0.06570913849843667, 6.644264456352705, 0.1463803676152511], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bce03b1a-a463-420e-9159-410e5f9a4ea3", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e929eb3-ae46-45ef-a6c7-820a30d36726", 3, 0, 0.0, 323.3333333333333, 251, 462, 257.0, 462.0, 462.0, 462.0, 0.02674488058410819, 0.026823234726444444, 0.017150851155824588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 570.7727272727274, 240, 1136, 481.0, 1056.8, 1125.6499999999999, 1136.0, 0.09911829768829097, 0.06088418871673342, 0.04481618342742063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 150.76470588235293, 140, 162, 151.0, 157.2, 162.0, 162.0, 0.0818306971012679, 0.06081363329498522, 0.04107517413090986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 251.7058823529412, 139, 600, 150.0, 583.1999999999999, 600.0, 600.0, 0.08172605426610004, 0.09407322353998808, 0.04257191291848547], "isController": false}, {"data": ["login", 22, 0, 0.0, 2573.9545454545455, 1490, 6632, 2220.5, 3933.0999999999995, 6246.649999999994, 6632.0, 0.09859192800996674, 32.30272966597503, 0.1933413616665621], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd2dd833-21e6-462e-a9f0-77e881f91eaa", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 183.9285714285714, 146, 498, 157.0, 360.0, 498.0, 498.0, 0.08859077390368918, 0.0717204605138265, 0.03149125166107701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/286d755b-c885-41b7-8ad1-cb539e237932", 3, 0, 0.0, 358.3333333333333, 301, 468, 306.0, 468.0, 468.0, 468.0, 0.03441235174011792, 0.028688161720847004, 0.02206781670834385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fe34fbc-2b97-4039-9bec-5b84abae9597", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 0.9795580904907976, 1.8303057898773005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 992.8235294117649, 295, 1527, 1383.0, 1470.2, 1527.0, 1527.0, 0.08165617945146261, 57.51633217403574, 0.17135695608578702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da8b662b-1665-4f24-97db-740efe774abc", 3, 0, 0.0, 320.6666666666667, 233, 479, 250.0, 479.0, 479.0, 479.0, 0.031093238257120355, 0.025273377580738776, 0.019939348752124705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65a0b1c9-a4f5-40f4-ac95-76bf8be0b234", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=532f4f12-2194-4b0d-8c6c-a36d053df7ca", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 416.54999999999995, 288, 1455, 302.0, 1105.800000000001, 1440.3999999999999, 1455.0, 0.09979741125515204, 12.078439751679092, 0.2218933065876271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, 57.142857142857146, 660.0714285714287, 145, 1706, 157.5, 1594.5, 1706.0, 1706.0, 0.10187968009780449, 52.25137037266131, 0.13678000856880881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8edff25c-1ac4-43d2-bafe-1a03f6b8148d", 3, 0, 0.0, 332.6666666666667, 239, 454, 305.0, 454.0, 454.0, 454.0, 0.029215846675236648, 0.02913025337443029, 0.018735422509836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ed6b68f-23ed-450b-9a66-4e9acfede069", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1118.7391304347827, 297, 2715, 1073.0, 2137.0000000000005, 2614.9999999999986, 2715.0, 0.09058185054782328, 0.028537590483392015, 0.040867983352631206], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 478.71428571428567, 287, 1446, 308.0, 1110.5, 1446.0, 1446.0, 0.08428403720538213, 7.323651408371211, 0.1880164278618946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 198.3888888888889, 148, 607, 153.5, 464.80000000000024, 607.0, 607.0, 0.11285549480864723, 0.0876173030985103, 0.04011660167026132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 524.5625, 293, 1456, 303.5, 1295.0000000000002, 1456.0, 1456.0, 0.08395468545852376, 12.668723091867413, 0.18613098111544293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 195.08333333333331, 142, 431, 150.0, 428.0, 431.0, 431.0, 0.05327319381675797, 0.039590723139211734, 0.026740646115052343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 195.58333333333331, 142, 440, 148.0, 438.2, 440.0, 440.0, 0.05327484938756121, 0.014255184308781026, 0.0303833125413435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 240.66666666666663, 139, 435, 148.5, 434.1, 435.0, 435.0, 0.05327555894940598, 0.01435942799808208, 0.031320201647990625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 217.58333333333334, 141, 438, 149.0, 436.2, 438.0, 438.0, 0.05327484938756121, 0.014359236748991106, 0.03137181072333926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 153.0, 147, 160, 152.5, 160.0, 160.0, 160.0, 0.05326941004128379, 0.01571031428951924, 0.03292923491809828], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1384.228070175439, 1110, 2149, 1213.0, 1880.0, 2064.3, 2149.0, 0.2514624526853543, 300.8365159050001, 0.4965401165329945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1118.7391304347827, 297, 2715, 1073.0, 2137.0000000000005, 2614.9999999999986, 2715.0, 0.0901462328673165, 0.028400350198517683, 0.040671444906933814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 148.49999999999997, 142, 155, 149.5, 155.0, 155.0, 155.0, 0.05220466840247189, 0.014070789530353752, 0.03074161625653374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 219.75, 142, 446, 147.0, 446.0, 446.0, 446.0, 0.05220637178767668, 0.014071248645897231, 0.030691636539239613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 246.0, 143, 621, 150.0, 590.4000000000001, 621.0, 621.0, 0.10755579456843238, 0.02898964775477279, 0.06323104329120732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 244.44444444444446, 138, 588, 150.5, 587.1, 588.0, 588.0, 0.10757700720765948, 0.02899536522393947, 0.06334856967404166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 221.375, 143, 448, 146.5, 448.0, 448.0, 448.0, 0.05220569042025581, 0.01396910075698251, 0.029773557817802138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 181.66666666666663, 143, 455, 150.0, 418.1000000000001, 455.0, 455.0, 0.10785676621446719, 0.08015527254805618, 0.054139040853746226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 187.50000000000003, 147, 456, 149.0, 456.0, 456.0, 456.0, 0.05220466840247189, 0.0387966334514464, 0.026204296444209525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 210.88888888888889, 140, 440, 148.0, 439.1, 440.0, 440.0, 0.10786516853932585, 0.028862359550561798, 0.06151685393258427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acf4e867-ae34-4208-8dc8-554059e4aebf", 3, 0, 0.0, 839.3333333333334, 287, 1926, 305.0, 1926.0, 1926.0, 1926.0, 0.05503678291658259, 0.03538334839200866, 0.0352937702948137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 154.5, 146, 167, 154.5, 167.0, 167.0, 167.0, 0.05146415521589213, 0.04050791904688384, 0.018293898924399154], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 649.8000000000001, 145, 2250, 468.0, 2055.6, 2250.0, 2250.0, 0.08671372331385165, 0.017173381921922963, 0.05900597891122249], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1386.227272727273, 793, 3790, 1156.0, 3001.3999999999987, 3745.5999999999995, 3790.0, 0.10171293834808942, 0.05264439191844472, 0.04678397847846691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 412.875, 295, 903, 300.0, 903.0, 903.0, 903.0, 0.052154298492088844, 0.08082897627631348, 0.11729623967507873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65e6c862-0289-4ff1-9e97-71b38c4177ce", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["addBook", 60, 17, 28.333333333333332, 1302.5833333333333, 745, 2122, 1124.5, 2064.7, 2114.9, 2122.0, 0.27350801378480394, 88.33820056513592, 0.9921031327493937], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 270.98245614035073, 143, 734, 153.0, 601.4, 620.7999999999997, 734.0, 0.2525912762949734, 0.1877167590434324, 0.12210222828712095], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 818.7894736842105, 699, 1204, 742.0, 1037.4, 1069.2, 1204.0, 0.2521755672844231, 74.14798979850288, 0.12682657924949012], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 244.9824561403508, 140, 611, 152.0, 449.2, 585.0, 611.0, 0.25283328528022353, 0.4473963993435206, 0.12295993756792123], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1107.7719298245613, 961, 1534, 1037.0, 1330.2, 1368.8999999999994, 1534.0, 0.25217668294754725, 226.9090225955285, 0.12658087405765556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 189.0, 146, 456, 152.0, 442.7, 456.0, 456.0, 0.08240074572674883, 0.061559150860315284, 0.029290890082555247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 17, 9.6045197740113, 204.29943502824864, 141, 956, 157.0, 307.60000000000014, 439.89999999999986, 902.18, 0.7140206218837235, 1.5608013015748794, 0.34177638976852825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 154.75, 147, 173, 153.5, 171.8, 173.0, 173.0, 0.054343888124048986, 0.04208467117419028, 0.019317553981595535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdc5902e-09cb-4ac6-a6d8-f414e1380aff", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 170.3, 148, 463, 153.5, 164.70000000000002, 448.0999999999998, 463.0, 0.09957184108334163, 0.08080488275415712, 0.035394677885094095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 464.83333333333337, 294, 862, 304.0, 862.0, 862.0, 862.0, 0.05323868677905945, 0.08250956632653061, 0.11973505434782608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65e6c862-0289-4ff1-9e97-71b38c4177ce", 3, 0, 0.0, 472.0, 253, 779, 384.0, 779.0, 779.0, 779.0, 0.018821049461717983, 0.022245843292805344, 0.012069488098823059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 479.2777777777778, 297, 898, 310.5, 855.7, 898.0, 898.0, 0.10745627126738702, 0.166536232911468, 0.24167167258671127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acf4e867-ae34-4208-8dc8-554059e4aebf", 1, 0, 0.0, 1217.0, 1217, 1217, 1217.0, 1217.0, 1217.0, 1217.0, 0.8216926869350862, 0.14845033894823334, 0.5665185907970419], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=286d755b-c885-41b7-8ad1-cb539e237932", 1, 0, 0.0, 1013.0, 1013, 1013, 1013.0, 1013.0, 1013.0, 1013.0, 0.9871668311944718, 0.17834557008884502, 0.6806052566633761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/faa6d976-f29a-46ca-a947-e9954ffc1baa", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 155.91666666666666, 146, 172, 155.5, 169.0, 172.0, 172.0, 0.06558559740281034, 0.05437712128416599, 0.023313630326780237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/943ec83d-1fa5-45d7-815c-c1bf8aa9ce02", 1, 0, 0.0, 1099.0, 1099, 1099, 1099.0, 1099.0, 1099.0, 1099.0, 0.9099181073703367, 0.2905695518653321, 0.5429296519563239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 152.58823529411768, 144, 165, 153.0, 160.2, 165.0, 165.0, 0.08253789460396375, 0.06407971309585077, 0.02933964222250274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da8b662b-1665-4f24-97db-740efe774abc", 1, 0, 0.0, 747.0, 747, 747, 747.0, 747.0, 747.0, 747.0, 1.3386880856760375, 0.241852827978581, 0.9229626840696118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65a0b1c9-a4f5-40f4-ac95-76bf8be0b234", 3, 0, 0.0, 397.0, 301, 549, 341.0, 549.0, 549.0, 549.0, 0.04281799497602192, 0.027527845077357848, 0.02745815433032656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32d1e0aa-b58f-43bb-9644-33c432d52218", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ed6b68f-23ed-450b-9a66-4e9acfede069", 3, 0, 0.0, 364.6666666666667, 314, 449, 331.0, 449.0, 449.0, 449.0, 0.030783122639960598, 0.025662622747701525, 0.01974047903669348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 188.24999999999997, 146, 462, 151.0, 443.8, 462.0, 462.0, 0.08402081615720294, 0.06244125106995258, 0.04217451123515851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8edff25c-1ac4-43d2-bafe-1a03f6b8148d", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 199.125, 140, 435, 147.5, 428.0, 435.0, 435.0, 0.08402302230811243, 0.03825755288198966, 0.04703730228332563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 334.3125, 143, 1305, 149.0, 1138.4, 1305.0, 1305.0, 0.08402169860366439, 9.47017467651646, 0.04849299206520084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 271.87500000000006, 145, 1038, 149.0, 964.5000000000001, 1038.0, 1038.0, 0.08402302230811243, 3.108010774639751, 0.04857580977187749], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 15.384615384615385, 0.44742729306487694], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 12.820512820512821, 0.37285607755406414], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.6923076923076925, 0.22371364653243847], "isController": false}, {"data": ["401/Unauthorized", 25, 64.1025641025641, 1.8642803877703207], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1341, 39, "401/Unauthorized", 25, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
