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

    var data = {"OkPercent": 97.25722757598221, "KoPercent": 2.742772424017791};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8067173637515843, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a2cd8ba-abbf-4d40-a25a-764daafd9fc9"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3008d850-0e0d-48e8-81ff-60c448a6c520"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.59375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=096bd991-3c2c-49e6-9b69-4bff6db6f071"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9e1bebb-baa5-4190-87d1-bdcd4ddb1233"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2b30960-5182-45a3-ac13-a86a94dfb962"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc5a12a8-c6ec-434d-a493-9dbc5fec3f3e"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c3e2d122-a96c-486a-875d-12c9107d00ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/886fdcb8-61fc-408f-b70d-eec088bf027c"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/62e4c562-5a50-413f-86fe-b12e77a16ce7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=346c68bc-8c8f-4811-9113-dc06aabd3473"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96b7ece8-5641-4289-979e-67f72add610b"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/096bd991-3c2c-49e6-9b69-4bff6db6f071"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21c6347f-4e09-4415-bb35-5a24c133e3ae"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3008d850-0e0d-48e8-81ff-60c448a6c520"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90513bdd-3ba7-4e25-92f1-876edf9ee38e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/384c9de4-e309-4213-9715-94f380981f37"], "isController": false}, {"data": [0.26, 500, 1500, "register"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc5a12a8-c6ec-434d-a493-9dbc5fec3f3e"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f9e1bebb-baa5-4190-87d1-bdcd4ddb1233"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/26e1b176-08a0-449a-9ae8-d6a663fa6f7e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.26, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3898305084745763, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2b30960-5182-45a3-ac13-a86a94dfb962"], "isController": false}, {"data": [0.8596491228070176, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3e2d122-a96c-486a-875d-12c9107d00ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62e4c562-5a50-413f-86fe-b12e77a16ce7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d8cb071-8a37-43b2-9df1-1c90d23ebf20"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90513bdd-3ba7-4e25-92f1-876edf9ee38e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=384c9de4-e309-4213-9715-94f380981f37"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/96b7ece8-5641-4289-979e-67f72add610b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/346c68bc-8c8f-4811-9113-dc06aabd3473"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/21c6347f-4e09-4415-bb35-5a24c133e3ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1349, 37, 2.742772424017791, 273.39733135656047, 79, 2695, 96.0, 647.0, 803.0, 1404.5, 5.272826766729206, 751.5944184475649, 3.8524749355065664], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/9a2cd8ba-abbf-4d40-a25a-764daafd9fc9", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1199.0877192982455, 967, 1624, 1162.0, 1396.6, 1520.0, 1624.0, 0.2589508402273316, 311.60465688445794, 1.27325925834435], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3008d850-0e0d-48e8-81ff-60c448a6c520", 3, 0, 0.0, 397.0, 272, 555, 364.0, 555.0, 555.0, 555.0, 0.02490143183233036, 0.029432649408590996, 0.015968691637269144], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 434.68749999999994, 84, 1107, 407.5, 869.0000000000002, 1107.0, 1107.0, 0.0860756497366623, 0.018009480425859276, 0.057474829597112156], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 434.68749999999994, 84, 1107, 407.5, 869.0000000000002, 1107.0, 1107.0, 0.08557980316645271, 0.017905735183996577, 0.05714374063970903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 113.55000000000001, 79, 245, 82.0, 241.8, 244.85, 245.0, 0.09772114294648791, 0.03348666900383067, 0.05532123688093656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 99.10000000000001, 80, 248, 82.0, 227.1000000000003, 247.7, 248.0, 0.09771971055421734, 0.07262177708179628, 0.04905071408678487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 121.69999999999999, 80, 562, 81.5, 242.5, 546.0499999999997, 562.0, 0.0977206654777319, 1.4616778485573987, 0.0571245999560257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 154.09999999999997, 81, 721, 82.5, 240.9, 696.9999999999997, 721.0, 0.0977206654777319, 4.421483163034716, 0.057029169618645105], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 212.0, 80, 555, 193.5, 418.5000000000001, 555.0, 555.0, 0.08608815426997246, 0.14501629453716858, 0.055633628992338154], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=096bd991-3c2c-49e6-9b69-4bff6db6f071", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 106.47368421052633, 81, 335, 83.0, 242.0, 335.0, 335.0, 0.10302681950785715, 0.07656582973191337, 0.05171463401077986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 116.47368421052632, 81, 245, 82.0, 244.0, 245.0, 245.0, 0.10294476200796467, 0.035683566765096306, 0.05825564503020616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 501.125, 398, 650, 479.0, 650.0, 650.0, 650.0, 0.0529013060009919, 15.554740452967433, 0.030170276078690692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 596.75, 549, 721, 558.5, 721.0, 721.0, 721.0, 0.052937011573354155, 47.63281606704473, 0.03013894311256394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9e1bebb-baa5-4190-87d1-bdcd4ddb1233", 1, 0, 0.0, 1013.0, 1013, 1013, 1013.0, 1013.0, 1013.0, 1013.0, 0.9871668311944718, 0.17834557008884502, 0.6806052566633761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 183.75, 82, 246, 242.0, 246.0, 246.0, 246.0, 0.05310075203940076, 0.09396344013222087, 0.02940246719369163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2b30960-5182-45a3-ac13-a86a94dfb962", 3, 0, 0.0, 320.3333333333333, 200, 432, 329.0, 432.0, 432.0, 432.0, 0.0329590648414669, 0.02715475036254971, 0.021135858638570895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 84.5, 81, 102, 82.0, 102.0, 102.0, 102.0, 0.1445138913978106, 0.10739753061888074, 0.07253919939304165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 142.37499999999997, 80, 247, 82.5, 247.0, 247.0, 247.0, 0.14456350855635267, 0.06582298424257757, 0.08092874148430583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 202.625, 81, 557, 165.5, 557.0, 557.0, 557.0, 0.14415453366008363, 16.247810230692302, 0.0831985638604584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 182.25, 80, 564, 81.5, 564.0, 564.0, 564.0, 0.14457134595923088, 5.3476926752024, 0.08358030938268035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 86.5, 81, 114, 83.0, 114.0, 114.0, 114.0, 0.053100399580506843, 0.039462308672622765, 0.029817118905069762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc5a12a8-c6ec-434d-a493-9dbc5fec3f3e", 3, 0, 0.0, 309.3333333333333, 159, 462, 307.0, 462.0, 462.0, 462.0, 0.01794591102417314, 0.02473988710526473, 0.011508282785683948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 393.90476190476187, 80, 730, 242.0, 729.4, 730.0, 730.0, 0.10673063728355281, 45.7466947649893, 0.058378243849011725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 123.63157894736845, 79, 548, 82.0, 245.0, 548.0, 548.0, 0.10303352385497218, 4.905769445205145, 0.06010641939524744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 342.2380952380953, 81, 651, 243.0, 634.0, 650.8, 651.0, 0.10673009483731284, 14.958969266815071, 0.05848217575651307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 162.31578947368422, 80, 555, 82.0, 326.0, 555.0, 555.0, 0.10294197323508697, 1.619357239123368, 0.060153541000704344], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 403.0625000000001, 82, 1163, 371.5, 1058.0, 1163.0, 1163.0, 0.0857426113984084, 0.017939799308700197, 0.05758738377856971], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c3e2d122-a96c-486a-875d-12c9107d00ef", 3, 0, 0.0, 905.0, 360, 1945, 410.0, 1945.0, 1945.0, 1945.0, 0.05145091582630171, 0.02328019954380188, 0.03299423964121562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/886fdcb8-61fc-408f-b70d-eec088bf027c", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.8772965315934066, 1.6392299107142858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 327.5, 163, 645, 326.0, 645.0, 645.0, 645.0, 0.1438874799906473, 21.71255398590802, 0.3190044447741866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62e4c562-5a50-413f-86fe-b12e77a16ce7", 3, 0, 0.0, 305.6666666666667, 187, 425, 305.0, 425.0, 425.0, 425.0, 0.030680807109765704, 0.02557732650003579, 0.019674866538489072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=346c68bc-8c8f-4811-9113-dc06aabd3473", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96b7ece8-5641-4289-979e-67f72add610b", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 432.95833333333337, 109, 968, 435.5, 786.0, 923.25, 968.0, 0.10739312147056981, 0.06596706387205899, 0.04855763207116584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 112.42857142857143, 81, 245, 83.0, 242.0, 244.7, 245.0, 0.10681586978636826, 0.07938171572990844, 0.05361655963886063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 120.14285714285714, 80, 251, 81.0, 247.0, 250.7, 251.0, 0.10681858643403952, 0.1049806550268318, 0.05664802639945065], "isController": false}, {"data": ["login", 24, 0, 0.0, 2297.083333333334, 1203, 3785, 2173.5, 3277.0, 3666.5, 3785.0, 0.10701625309343857, 42.82012212115132, 0.22061651394555548], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 86.47368421052633, 83, 95, 86.0, 94.0, 95.0, 95.0, 0.10629846370746662, 0.08605608048192367, 0.03778578202101353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/096bd991-3c2c-49e6-9b69-4bff6db6f071", 3, 0, 0.0, 312.3333333333333, 263, 376, 298.0, 376.0, 376.0, 376.0, 0.07094378887128433, 0.0321002169697543, 0.045494552108212925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 519.9047619047619, 163, 946, 487.0, 813.6, 932.7999999999998, 946.0, 0.10668400705130485, 60.863350050865414, 0.22693668780449394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21c6347f-4e09-4415-bb35-5a24c133e3ae", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 285.5, 163, 803, 249.5, 490.20000000000005, 787.3999999999997, 803.0, 0.09768057475250184, 5.986812855313091, 0.2184362774665566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 394.5625, 79, 805, 360.5, 801.5, 805.0, 805.0, 0.10237772260756059, 61.25337126641243, 0.14934250307133168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3008d850-0e0d-48e8-81ff-60c448a6c520", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.5074833216292135, 1.9366660814606742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90513bdd-3ba7-4e25-92f1-876edf9ee38e", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.5018446180555556, 1.9151475694444444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/384c9de4-e309-4213-9715-94f380981f37", 3, 0, 0.0, 385.66666666666663, 205, 675, 277.0, 675.0, 675.0, 675.0, 0.04957530488812506, 0.031872144255874674, 0.03179145528307499], "isController": false}, {"data": ["register", 25, 9, 36.0, 846.0, 105, 1994, 850.0, 1639.8000000000002, 1904.2999999999997, 1994.0, 0.1026276790955628, 0.03197493626821128, 0.04630272240444337], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 270.36842105263156, 163, 636, 169.0, 581.0, 636.0, 636.0, 0.10289068676825769, 6.629648442153773, 0.23001801094702753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 89.5, 84, 106, 86.0, 103.0, 106.0, 106.0, 0.07695352007387539, 0.05974418794797942, 0.02735457158876039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc5a12a8-c6ec-434d-a493-9dbc5fec3f3e", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 319.2666666666667, 163, 795, 324.0, 609.6000000000001, 795.0, 795.0, 0.06851755419738537, 5.563830596628023, 0.15292886136386477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9e1bebb-baa5-4190-87d1-bdcd4ddb1233", 3, 0, 0.0, 498.33333333333337, 257, 894, 344.0, 894.0, 894.0, 894.0, 0.028719401870590376, 0.02880354074325812, 0.018417064350606457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 122.5, 82, 324, 83.0, 315.40000000000003, 324.0, 324.0, 0.05112265347020572, 0.0379925188386978, 0.025661175667661854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 113.7, 80, 243, 82.0, 243.0, 243.0, 243.0, 0.0510813930917524, 0.01366826338587906, 0.02913235699764004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 97.2, 80, 241, 81.5, 225.20000000000005, 241.0, 241.0, 0.05112396026645808, 0.013779504915568778, 0.030055296953523207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 129.6, 81, 242, 82.0, 242.0, 242.0, 242.0, 0.05108165402395729, 0.013768102061144741, 0.03008030993793579], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 86.25, 82, 92, 85.5, 92.0, 92.0, 92.0, 0.04052479610961957, 0.011951648852641711, 0.025050972595106632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26e1b176-08a0-449a-9ae8-d6a663fa6f7e", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 1.9591161809815951, 3.660611579754601], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 746.5438596491226, 636, 1275, 650.0, 1048.4, 1077.0999999999995, 1275.0, 0.2569720576699397, 307.4279189151722, 0.5074194341881035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 846.0, 105, 1994, 850.0, 1639.8000000000002, 1904.2999999999997, 1994.0, 0.10295183501350728, 0.032075931096395865, 0.04644897243773473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 101.77777777777777, 80, 243, 82.0, 243.0, 243.0, 243.0, 0.044900769299847335, 0.012102160475349477, 0.026440589734187444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 118.0, 81, 244, 82.0, 244.0, 244.0, 244.0, 0.044868758880275195, 0.012093532666949174, 0.026377922701099284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 137.92857142857142, 80, 546, 82.0, 393.5, 546.0, 546.0, 0.07285102485781042, 4.700481670487009, 0.04238124632492598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 127.0, 79, 555, 81.5, 397.5, 555.0, 555.0, 0.07285140395062756, 1.5482854389557272, 0.04245261081218908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 118.55555555555556, 81, 243, 83.0, 243.0, 243.0, 243.0, 0.04490211339280369, 0.0120148233101838, 0.025608236544333352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 82.21428571428571, 79, 84, 82.5, 84.0, 84.0, 84.0, 0.07285064576893856, 0.05413998186539282, 0.03656760930198674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 82.55555555555554, 81, 84, 83.0, 84.0, 84.0, 84.0, 0.04490368160296165, 0.03337080244126349, 0.02253954330461161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 105.35714285714286, 80, 248, 81.5, 245.5, 248.0, 248.0, 0.07285178304739008, 0.027309255168573823, 0.0411112531287239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 88.77777777777777, 83, 113, 85.0, 113.0, 113.0, 113.0, 0.04545087265675501, 0.03577480797006303, 0.016156364889705885], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 432.8125, 79, 894, 417.5, 868.1, 894.0, 894.0, 0.08538296929948609, 0.017280879284490718, 0.05809627330021186], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1361.25, 772, 2695, 1150.0, 2444.5, 2656.75, 2695.0, 0.10731148948347403, 0.05554207951781371, 0.049359093307340104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 219.88888888888889, 165, 328, 168.0, 328.0, 328.0, 328.0, 0.044849753326356705, 0.06950835793840635, 0.10086814639706983], "isController": false}, {"data": ["addBook", 59, 12, 20.338983050847457, 795.4745762711864, 416, 1567, 746.0, 1195.0, 1269.0, 1567.0, 0.27379206652683163, 84.39170958202625, 0.9944494386682569], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 138.82456140350882, 81, 465, 84.0, 328.6, 333.4, 465.0, 0.25761431070093693, 0.1914496976986455, 0.12453035527047243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2b30960-5182-45a3-ac13-a86a94dfb962", 1, 0, 0.0, 1163.0, 1163, 1163, 1163.0, 1163.0, 1163.0, 1163.0, 0.8598452278589854, 0.15534313198624247, 0.5928229793637145], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 449.6491228070174, 393, 665, 404.0, 562.6, 577.0999999999996, 665.0, 0.2575782224391302, 75.7365497990212, 0.12954373491811724], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 111.35087719298245, 80, 327, 84.0, 247.8, 254.29999999999998, 327.0, 0.257943062462949, 0.45643830974889016, 0.12544496592436385], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 604.7543859649123, 549, 810, 562.0, 723.4, 744.9999999999995, 810.0, 0.25739793268818273, 231.60711229013037, 0.12920169668137296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 84.60000000000001, 82, 89, 84.0, 88.4, 89.0, 89.0, 0.0692229949559511, 0.05171444447392831, 0.02460661148824824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 12, 6.857142857142857, 144.7428571428571, 81, 798, 88.0, 270.8, 349.5999999999999, 556.3200000000029, 0.7348371600853251, 1.6411226553445757, 0.35158185508591294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 117.8, 84, 250, 86.0, 249.5, 250.0, 250.0, 0.049887752556747315, 0.03863377712646546, 0.017733537041656273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3e2d122-a96c-486a-875d-12c9107d00ef", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 0.9312580541237113, 3.5538820876288657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62e4c562-5a50-413f-86fe-b12e77a16ce7", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 97.4, 82, 254, 85.0, 114.4, 247.0499999999999, 254.0, 0.09985720419799686, 0.08103646160989784, 0.0354961155547567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 253.29999999999998, 164, 567, 167.0, 558.4000000000001, 567.0, 567.0, 0.051059223593446036, 0.07913182406523327, 0.11483339056221312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 222.57142857142856, 163, 635, 166.5, 482.0, 635.0, 635.0, 0.07281919513983887, 6.327442523224121, 0.16244125701534926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d8cb071-8a37-43b2-9df1-1c90d23ebf20", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.8677606997282609, 1.6214121942934783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90513bdd-3ba7-4e25-92f1-876edf9ee38e", 3, 0, 0.0, 335.3333333333333, 198, 516, 292.0, 516.0, 516.0, 516.0, 0.01845336220259331, 0.025439449520827693, 0.01183369906872032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=384c9de4-e309-4213-9715-94f380981f37", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 87.375, 81, 103, 83.5, 103.0, 103.0, 103.0, 0.1304673994585603, 0.10817072474640399, 0.04637708340128511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96b7ece8-5641-4289-979e-67f72add610b", 3, 0, 0.0, 278.3333333333333, 172, 406, 257.0, 406.0, 406.0, 406.0, 0.037503281537134496, 0.031264942713737455, 0.024049955933644195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/346c68bc-8c8f-4811-9113-dc06aabd3473", 3, 0, 0.0, 412.66666666666663, 204, 786, 248.0, 786.0, 786.0, 786.0, 0.06497444338560167, 0.030160662847613273, 0.04166655386381357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 86.04761904761907, 83, 94, 85.0, 90.0, 93.6, 94.0, 0.10478728181790964, 0.08135340727074039, 0.037248604083710064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21c6347f-4e09-4415-bb35-5a24c133e3ae", 3, 0, 0.0, 540.0, 169, 857, 594.0, 857.0, 857.0, 857.0, 0.022970903522205207, 0.027150830302450232, 0.014730690084226648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 92.80000000000001, 80, 243, 82.0, 148.20000000000005, 243.0, 243.0, 0.06854354114211818, 0.050939096493312436, 0.03440564467485229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 150.9333333333333, 79, 327, 81.0, 278.40000000000003, 327.0, 327.0, 0.06854448079840611, 0.02520437679358058, 0.03870799651337074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 176.73333333333332, 80, 712, 82.0, 431.8000000000002, 712.0, 712.0, 0.06854510725024449, 4.129043911423728, 0.039904319598417066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 166.00000000000003, 81, 554, 82.0, 369.2000000000001, 554.0, 554.0, 0.06854448079840611, 1.360866770663876, 0.039970892871830956], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 24.324324324324323, 0.6671608598962194], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.2965159377316531], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.81081081081081, 0.2965159377316531], "isController": false}, {"data": ["401/Unauthorized", 20, 54.054054054054056, 1.4825796886582654], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1349, 37, "401/Unauthorized", 20, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
