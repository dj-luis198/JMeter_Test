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

    var data = {"OkPercent": 96.34873323397913, "KoPercent": 3.651266766020864};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7825537294563844, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36792452830188677, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59483ae3-18b3-43ff-8913-9df3554009c1"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e15bff93-9950-4d53-9b2a-007d27cd0b8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/482d6071-ef89-4bcc-91d6-1f21b6490189"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9186f35d-ff81-4c26-8912-9ff5018c1164"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0816f171-d8dd-4588-b12d-8c5a8dc2dad7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85acef12-e9d1-40a2-a9cf-43f2ce652193"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/85acef12-e9d1-40a2-a9cf-43f2ce652193"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67908a3c-f7bf-4702-a857-49ae4988a120"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67706c70-1126-4a54-b57a-1ba9871441f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=482d6071-ef89-4bcc-91d6-1f21b6490189"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0816f171-d8dd-4588-b12d-8c5a8dc2dad7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/435eec09-e23a-4e6a-a262-56ed1dc55b19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7bfcf765-bd3c-4d9d-b882-2058449bd8a9"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/09c8eaf7-2c77-4d37-b366-8db739cf46c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29849ad0-df14-48aa-bf0c-3743094f560b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=368a9f47-9a51-4d31-af31-857aa4b345af"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21052631578947367, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab805941-8492-48be-a65f-eaf094f3e628"], "isController": false}, {"data": [0.26785714285714285, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9186f35d-ff81-4c26-8912-9ff5018c1164"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4811320754716981, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.26785714285714285, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/59483ae3-18b3-43ff-8913-9df3554009c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/216596ac-7a50-4795-b16b-42a03583b732"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/67908a3c-f7bf-4702-a857-49ae4988a120"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "addBook"], "isController": true}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8207547169811321, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8770949720670391, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/29849ad0-df14-48aa-bf0c-3743094f560b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09c8eaf7-2c77-4d37-b366-8db739cf46c5"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/368a9f47-9a51-4d31-af31-857aa4b345af"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=435eec09-e23a-4e6a-a262-56ed1dc55b19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e15bff93-9950-4d53-9b2a-007d27cd0b8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab805941-8492-48be-a65f-eaf094f3e628"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7bfcf765-bd3c-4d9d-b882-2058449bd8a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1342, 49, 3.651266766020864, 300.46348733233975, 77, 2301, 93.0, 809.5000000000007, 1023.2499999999995, 1607.3899999999983, 5.2645825405729845, 716.7382224825527, 3.838100448538902], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1360.7547169811319, 1035, 2034, 1337.0, 1638.8, 1824.6999999999998, 2034.0, 0.22569422265373823, 271.585756918007, 1.1097367295523164], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59483ae3-18b3-43ff-8913-9df3554009c1", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 0.6187125428082192, 2.361140839041096], "isController": false}, {"data": ["deleteBook", 18, 5, 27.77777777777778, 431.9444444444444, 80, 968, 473.0, 815.9000000000002, 968.0, 968.0, 0.10321515198431129, 0.021923140191980182, 0.06878210242096873], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, 27.77777777777778, 431.9444444444444, 80, 968, 473.0, 815.9000000000002, 968.0, 968.0, 0.10369201168263331, 0.022024426309543696, 0.06909987953004476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e15bff93-9950-4d53-9b2a-007d27cd0b8c", 3, 0, 0.0, 376.6666666666667, 212, 562, 356.0, 562.0, 562.0, 562.0, 0.052021918568356806, 0.0329709229988902, 0.03336041001942152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 114.13333333333334, 78, 275, 80.0, 254.0, 275.0, 275.0, 0.09449771315534164, 0.04420967231343001, 0.052835049516801694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 82.0, 79, 90, 81.0, 87.0, 90.0, 90.0, 0.09449771315534164, 0.07022730440548339, 0.047433422423677346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 146.3333333333333, 78, 658, 80.0, 562.0, 658.0, 658.0, 0.09449711783790594, 3.7267793019812894, 0.05456347253283774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 205.0666666666667, 78, 855, 82.0, 759.6, 855.0, 855.0, 0.09449176031850023, 11.358586289088091, 0.054468101944010486], "isController": false}, {"data": ["goToProfile", 19, 6, 31.57894736842105, 189.89473684210523, 77, 362, 201.0, 311.0, 362.0, 362.0, 0.10015180905794045, 0.13485696410875433, 0.06471569405203678], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/482d6071-ef89-4bcc-91d6-1f21b6490189", 3, 0, 0.0, 269.0, 170, 457, 180.0, 457.0, 457.0, 457.0, 0.07355104442483082, 0.033279932210454055, 0.04716652262920467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 81.53333333333333, 78, 86, 82.0, 84.8, 86.0, 86.0, 0.07616803684501837, 0.05660534769439353, 0.038232784119472105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 79.99999999999999, 78, 85, 79.0, 83.8, 85.0, 85.0, 0.0761707443405137, 0.028008617450209727, 0.0430146508079177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 551.0, 461, 627, 575.5, 627.0, 627.0, 627.0, 0.07456843518138771, 21.92559584840237, 0.04252731068938518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9186f35d-ff81-4c26-8912-9ff5018c1164", 1, 0, 0.0, 1114.0, 1114, 1114, 1114.0, 1114.0, 1114.0, 1114.0, 0.8976660682226212, 0.16217599865350088, 0.6188986759425493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 809.375, 626, 1241, 781.5, 1241.0, 1241.0, 1241.0, 0.07445323406235459, 66.99315088413215, 0.042388901814797576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 159.125, 79, 240, 160.5, 240.0, 240.0, 240.0, 0.07483279547261587, 0.1324189701136523, 0.04143573733688789], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0816f171-d8dd-4588-b12d-8c5a8dc2dad7", 3, 0, 0.0, 288.6666666666667, 192, 391, 283.0, 391.0, 391.0, 391.0, 0.01890311523339046, 0.026059470381968947, 0.012122114912037503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 111.33333333333333, 79, 283, 82.0, 268.6, 283.0, 283.0, 0.060335465186436586, 0.04483914942077953, 0.030285575298660553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 132.00000000000003, 78, 238, 81.5, 237.4, 238.0, 238.0, 0.06033698204471976, 0.01614485652368478, 0.03441093507237924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 118.66666666666666, 78, 241, 79.5, 239.20000000000002, 241.0, 241.0, 0.060336375292254316, 0.016262538652990422, 0.03547118938079795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 92.08333333333334, 77, 234, 79.0, 188.40000000000015, 234.0, 234.0, 0.06033667866696164, 0.016262620421954508, 0.03553029026970496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 80.625, 79, 82, 81.0, 82.0, 82.0, 82.0, 0.07483279547261587, 0.05561304429166082, 0.0420203685515177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 535.7368421052631, 79, 1009, 734.0, 1003.0, 1009.0, 1009.0, 0.08868434441265292, 42.01044309207302, 0.04812547842870012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 136.6, 77, 615, 81.0, 387.0000000000001, 615.0, 615.0, 0.0761703575436583, 4.588376379635601, 0.04434344642938754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85acef12-e9d1-40a2-a9cf-43f2ce652193", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 0.27290643882175225, 1.0414699773413896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 369.1578947368422, 78, 704, 459.0, 626.0, 704.0, 704.0, 0.08874979564191793, 13.745744972791181, 0.04824766593876264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 148.13333333333333, 78, 630, 81.0, 394.20000000000016, 630.0, 630.0, 0.07617113114129745, 1.512284578519741, 0.04441828265837247], "isController": false}, {"data": ["deleteBooks", 18, 5, 27.77777777777778, 405.5, 80, 1114, 387.0, 958.3000000000003, 1114.0, 1114.0, 0.10396271204061476, 0.02208192370003292, 0.06961869328978451], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/85acef12-e9d1-40a2-a9cf-43f2ce652193", 3, 0, 0.0, 895.0, 289, 1687, 709.0, 1687.0, 1687.0, 1687.0, 0.024570427034021854, 0.02904141294288195, 0.01575642619043719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 245.00000000000003, 159, 520, 165.0, 507.1, 520.0, 520.0, 0.06031090270343621, 0.09347011971714186, 0.13564063371681015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67908a3c-f7bf-4702-a857-49ae4988a120", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 567.5652173913044, 93, 1707, 515.0, 1255.8, 1616.9999999999986, 1707.0, 0.11082094226710738, 0.06807262957618217, 0.05010751588835031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 117.2105263157895, 78, 294, 81.0, 238.0, 294.0, 294.0, 0.08874855199730951, 0.06595473444331303, 0.044547613014274505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 172.94736842105263, 78, 251, 236.0, 250.0, 251.0, 251.0, 0.08868475835737158, 0.0938355487019352, 0.046657955722967485], "isController": false}, {"data": ["login", 23, 0, 0.0, 2604.3913043478265, 1370, 4266, 2610.0, 3815.0, 4182.999999999999, 4266.0, 0.11238041258269733, 46.914441936583245, 0.23437557259041736], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/67706c70-1126-4a54-b57a-1ba9871441f8", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.8458724710982661, 3.449015534682081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 85.26666666666668, 81, 106, 83.0, 97.0, 106.0, 106.0, 0.07846706737182405, 0.06352460825316614, 0.02789259035482808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=482d6071-ef89-4bcc-91d6-1f21b6490189", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0816f171-d8dd-4588-b12d-8c5a8dc2dad7", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/435eec09-e23a-4e6a-a262-56ed1dc55b19", 3, 0, 0.0, 323.3333333333333, 257, 422, 291.0, 422.0, 422.0, 422.0, 0.05407548938317892, 0.03476532927466743, 0.034677315782832834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bfcf765-bd3c-4d9d-b882-2058449bd8a9", 3, 0, 0.0, 257.3333333333333, 165, 402, 205.0, 402.0, 402.0, 402.0, 0.05268333801629671, 0.043611239770651865, 0.03378456246487777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 670.842105263158, 161, 1093, 818.0, 1086.0, 1093.0, 1093.0, 0.08865041409075003, 55.88440361454567, 0.18743894348536103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09c8eaf7-2c77-4d37-b366-8db739cf46c5", 3, 0, 0.0, 496.3333333333333, 169, 923, 397.0, 923.0, 923.0, 923.0, 0.049427465194826596, 0.041205643998681936, 0.03169664922975533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29849ad0-df14-48aa-bf0c-3743094f560b", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=368a9f47-9a51-4d31-af31-857aa4b345af", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 0.6208387027491409, 2.3692547250859106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 288.46666666666664, 161, 937, 166.0, 842.2, 937.0, 937.0, 0.09444356996694475, 15.191832352825438, 0.20918389933889503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 11, 57.89473684210526, 421.47368421052624, 77, 1321, 82.0, 950.0, 1321.0, 1321.0, 0.13954786491766677, 70.31541202884235, 0.1858964619107775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab805941-8492-48be-a65f-eaf094f3e628", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["register", 28, 8, 28.571428571428573, 1075.107142857143, 372, 2011, 1029.0, 1678.5000000000005, 1984.8999999999999, 2011.0, 0.10819290795488355, 0.033991410255914865, 0.04881359714370723], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9186f35d-ff81-4c26-8912-9ff5018c1164", 3, 0, 0.0, 399.3333333333333, 237, 508, 453.0, 508.0, 508.0, 508.0, 0.06732042277225501, 0.0432805452393241, 0.04317097423871822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 231.66666666666666, 161, 714, 165.0, 476.40000000000015, 714.0, 714.0, 0.07613672124823616, 6.1825297789750975, 0.1699345842808125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 109.21052631578948, 80, 247, 83.0, 243.0, 247.0, 247.0, 0.16077850645229533, 0.12482315686481912, 0.05715173471546436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 227.79999999999998, 159, 323, 165.0, 321.8, 323.0, 323.0, 0.07943610953709931, 0.12311045491735997, 0.17865367213275363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 81.46153846153847, 79, 84, 81.0, 84.0, 84.0, 84.0, 0.06021501391893207, 0.0447496343674876, 0.030225114408526446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 79.61538461538461, 78, 82, 80.0, 81.6, 82.0, 82.0, 0.06021640850811531, 0.016112593682835543, 0.034342170477284516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 91.92307692307693, 79, 235, 80.0, 173.79999999999995, 235.0, 235.0, 0.06021585066469035, 0.016230053499467323, 0.03540033408217148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 80.3846153846154, 79, 83, 80.0, 82.6, 83.0, 83.0, 0.06021585066469035, 0.016230053499467323, 0.03545913862383621], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 87.6, 80, 109, 82.0, 109.0, 109.0, 109.0, 0.1045019437361535, 0.030819909187810895, 0.06459934607908707], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 933.2075471698112, 623, 1675, 854.0, 1299.0, 1471.3999999999999, 1675.0, 0.22665070133424564, 271.1530353286435, 0.44754659970492644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 28, 8, 28.571428571428573, 1075.107142857143, 372, 2011, 1029.0, 1678.5000000000005, 1984.8999999999999, 2011.0, 0.11312400006464228, 0.035540631716737506, 0.051038367216664784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 137.875, 78, 239, 80.5, 239.0, 239.0, 239.0, 0.04690624028894244, 0.012642697577879017, 0.027621545795148722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59483ae3-18b3-43ff-8913-9df3554009c1", 3, 0, 0.0, 444.0, 242, 558, 532.0, 558.0, 558.0, 558.0, 0.06075457178152656, 0.028201829218898723, 0.03896045130521072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 117.75, 77, 233, 79.5, 233.0, 233.0, 233.0, 0.04690596526613272, 0.012642623450637335, 0.027575577236535056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 174.42105263157896, 77, 766, 82.0, 704.0, 766.0, 766.0, 0.15215337059756234, 14.448048007391451, 0.08807315273795986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 177.57894736842107, 78, 616, 84.0, 464.0, 616.0, 616.0, 0.15196595962504397, 4.740125711840547, 0.08811307517116165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 79.375, 78, 82, 79.0, 82.0, 82.0, 82.0, 0.04690596526613272, 0.01255101023722692, 0.026751058315841316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 92.6842105263158, 79, 291, 80.0, 95.0, 291.0, 291.0, 0.15214971531987476, 0.11307220054533662, 0.07637202507267152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 119.37499999999999, 78, 243, 80.0, 243.0, 243.0, 243.0, 0.046905415230188326, 0.034858418935716125, 0.02354431975421562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 121.94736842105262, 78, 237, 82.0, 237.0, 237.0, 237.0, 0.15215458906248747, 0.06476893023311685, 0.08543054743619517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 107.25, 81, 240, 85.5, 240.0, 240.0, 240.0, 0.047884120428562875, 0.03769004010295086, 0.01702130843359071], "isController": false}, {"data": ["deleteAccount", 18, 5, 27.77777777777778, 426.38888888888897, 77, 1344, 437.5, 772.5000000000009, 1344.0, 1344.0, 0.10157784248662557, 0.020803838725423806, 0.06911283217365297], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/216596ac-7a50-4795-b16b-42a03583b732", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.947584384272997, 1.7705628709198813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1445.9565217391305, 994, 2301, 1327.0, 2022.6000000000001, 2252.999999999999, 2301.0, 0.11278711676899238, 0.05837614442145113, 0.0518776679669877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 259.0, 158, 483, 162.5, 483.0, 483.0, 483.0, 0.046883424365315646, 0.07266015084741789, 0.10544192022785344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67908a3c-f7bf-4702-a857-49ae4988a120", 3, 0, 0.0, 374.0, 278, 560, 284.0, 560.0, 560.0, 560.0, 0.029992202027472856, 0.03008006980685022, 0.01923328059704477], "isController": false}, {"data": ["addBook", 63, 20, 31.746031746031747, 817.1111111111113, 409, 1717, 680.0, 1478.6000000000001, 1654.1999999999998, 1717.0, 0.2951663004418124, 85.27697664057412, 1.0722380721189662], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 144.01886792452828, 79, 550, 82.0, 320.6, 410.9, 550.0, 0.22752347140716828, 0.16908726732505375, 0.10998449057280106], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 503.4528301886793, 384, 783, 467.0, 674.6000000000001, 715.5, 783.0, 0.22771311584582532, 66.95521684572222, 0.11452368619199224], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 121.37735849056604, 77, 248, 84.0, 241.0, 245.6, 248.0, 0.2278668225906308, 0.4032174634123271, 0.11081804458020912], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 785.9433962264153, 542, 1178, 772.0, 999.6, 1053.9999999999998, 1178.0, 0.22722011198093067, 204.4530561707945, 0.11405384527167808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 111.66666666666667, 81, 293, 84.0, 260.6, 293.0, 293.0, 0.08352544184958738, 0.06239937794427182, 0.029690684407470514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 20, 11.1731843575419, 143.3575418994413, 79, 718, 86.0, 326.0, 407.0, 572.3999999999979, 0.7251602239489228, 1.5340935130062954, 0.35050966939378225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 107.76923076923077, 81, 238, 83.0, 237.6, 238.0, 238.0, 0.06035227156665212, 0.04673764780503431, 0.021453346533458373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 103.0, 81, 239, 86.0, 194.60000000000002, 239.0, 239.0, 0.09519216124282885, 0.07725066991483474, 0.03383783856678682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29849ad0-df14-48aa-bf0c-3743094f560b", 3, 0, 0.0, 300.0, 186, 513, 201.0, 513.0, 513.0, 513.0, 0.023700613845898607, 0.023770049238025268, 0.015198635832168053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 174.84615384615387, 160, 317, 163.0, 256.59999999999997, 317.0, 317.0, 0.06019215186942933, 0.09328607911795347, 0.135373560307906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09c8eaf7-2c77-4d37-b366-8db739cf46c5", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 301.05263157894734, 159, 847, 179.0, 786.0, 847.0, 847.0, 0.15186635760530734, 19.33532085514747, 0.33746084695467987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/368a9f47-9a51-4d31-af31-857aa4b345af", 3, 0, 0.0, 640.0, 265, 1344, 311.0, 1344.0, 1344.0, 1344.0, 0.07445646778516828, 0.0336896127022734, 0.04774714893775439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=435eec09-e23a-4e6a-a262-56ed1dc55b19", 1, 0, 0.0, 941.0, 941, 941, 941.0, 941.0, 941.0, 941.0, 1.0626992561105206, 0.19199156482465463, 0.7326813230605739], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e15bff93-9950-4d53-9b2a-007d27cd0b8c", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 85.25, 80, 96, 83.5, 95.4, 96.0, 96.0, 0.06170268560939115, 0.05115779304919247, 0.02193337652521326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab805941-8492-48be-a65f-eaf094f3e628", 3, 0, 0.0, 388.0, 276, 526, 362.0, 526.0, 526.0, 526.0, 0.045845622507144274, 0.02947431785534178, 0.029399699329125725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 86.89473684210526, 80, 106, 86.0, 95.0, 106.0, 106.0, 0.08958756713173616, 0.06955284752903344, 0.03184558050385934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 83.66666666666666, 79, 126, 81.0, 100.20000000000002, 126.0, 126.0, 0.07947061971189251, 0.05905970859448262, 0.03989052591007105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7bfcf765-bd3c-4d9d-b882-2058449bd8a9", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 90.33333333333333, 78, 235, 80.0, 146.20000000000005, 235.0, 235.0, 0.07947188284784842, 0.02126493740264694, 0.04532380818666355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 111.2, 78, 236, 80.0, 235.4, 236.0, 236.0, 0.07947188284784842, 0.021420155923834148, 0.046720774877348395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 132.20000000000002, 78, 241, 80.0, 240.4, 241.0, 241.0, 0.07947146179806831, 0.0214200424377606, 0.04679813619554218], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 16.3265306122449, 0.5961251862891207], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 12.244897959183673, 0.44709388971684055], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 10.204081632653061, 0.37257824143070045], "isController": false}, {"data": ["401/Unauthorized", 30, 61.224489795918366, 2.235469448584203], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1342, 49, "401/Unauthorized", 30, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 11, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 28, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 20, "401/Unauthorized", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
