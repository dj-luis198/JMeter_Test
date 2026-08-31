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

    var data = {"OkPercent": 97.11026615969581, "KoPercent": 2.8897338403041823};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7396640826873385, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef391dc3-2845-42cb-acb4-40ee7fec43f9"], "isController": false}, {"data": [0.0625, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3da0f037-0b92-4811-b15c-a6970150f584"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b56568a-d8de-49fc-88a6-d3c0e8ce9eea"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=103beb79-263c-4e9d-80ea-cb55e624287d"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe2a590e-84be-49b6-afbd-f4dfda3c96e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eaaef4ef-d960-4f27-8276-9bcc69042255"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af773a56-1393-4112-9ec3-8c4370e32c39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a84cc1a0-f2c1-4103-bbdd-4782f3d16087"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ece35d1b-b51a-46ec-af2c-64d5225b66d4"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f64368a0-8e0c-49f0-8595-3e4bb7d742d6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/34f08040-2604-484a-b006-d810557c3cc2"], "isController": false}, {"data": [0.5869565217391305, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff8ab95e-f02d-43ca-a47a-086a7fbee716"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dd46e93b-900a-4330-b4af-c011d72aa13f"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.17647058823529413, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e784252c-b9f4-47a8-b010-158def076f82"], "isController": false}, {"data": [0.14, 500, 1500, "register"], "isController": true}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/103beb79-263c-4e9d-80ea-cb55e624287d"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.14, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3da0f037-0b92-4811-b15c-a6970150f584"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef391dc3-2845-42cb-acb4-40ee7fec43f9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a84cc1a0-f2c1-4103-bbdd-4782f3d16087"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b56568a-d8de-49fc-88a6-d3c0e8ce9eea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af773a56-1393-4112-9ec3-8c4370e32c39"], "isController": false}, {"data": [0.26785714285714285, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe2a590e-84be-49b6-afbd-f4dfda3c96e4"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eaaef4ef-d960-4f27-8276-9bcc69042255"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ece35d1b-b51a-46ec-af2c-64d5225b66d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd46e93b-900a-4330-b4af-c011d72aa13f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff8ab95e-f02d-43ca-a47a-086a7fbee716"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f64368a0-8e0c-49f0-8595-3e4bb7d742d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e784252c-b9f4-47a8-b010-158def076f82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c28fde80-2d5c-4ecf-bdb7-1fba009ec37f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dd0674c7-d483-4e45-bb04-35c6ed391d67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1315, 38, 2.8897338403041823, 405.7817490494302, 102, 2843, 128.0, 1135.4000000000005, 1376.0000000000005, 1853.0, 5.230104721412406, 745.6356808234134, 3.8149670856384903], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef391dc3-2845-42cb-acb4-40ee7fec43f9", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1826.4821428571427, 1313, 2874, 1806.0, 2226.4, 2304.6, 2874.0, 0.2528456422505068, 304.2586359767743, 1.2432400475891618], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3da0f037-0b92-4811-b15c-a6970150f584", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b56568a-d8de-49fc-88a6-d3c0e8ce9eea", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.2971448396381579, 1.1339689555921053], "isController": false}, {"data": ["deleteBook", 18, 5, 27.77777777777778, 649.1111111111111, 111, 2843, 503.5, 1254.5000000000025, 2843.0, 2843.0, 0.09281843167789942, 0.01971485243158508, 0.06185377584090921], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, 27.77777777777778, 649.1111111111111, 111, 2843, 503.5, 1254.5000000000025, 2843.0, 2843.0, 0.09281029575547581, 0.01971312434259374, 0.061848354099637015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 147.5263157894737, 104, 344, 112.0, 340.0, 344.0, 344.0, 0.09743190022973416, 0.04147466065494749, 0.05470528773178536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 112.52631578947368, 105, 128, 112.0, 121.0, 128.0, 128.0, 0.09742290771486878, 0.07240120387794448, 0.04890173297406499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 215.42105263157893, 107, 908, 112.0, 859.0, 908.0, 908.0, 0.09743239986256903, 3.0391136600224606, 0.056493364661268565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 234.78947368421052, 104, 980, 111.0, 913.0, 980.0, 980.0, 0.09743539776719093, 9.252186126609606, 0.05639995115409664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=103beb79-263c-4e9d-80ea-cb55e624287d", 1, 0, 0.0, 670.0, 670, 670, 670.0, 670.0, 670.0, 670.0, 1.492537313432836, 0.2696478544776119, 1.029034514925373], "isController": false}, {"data": ["goToProfile", 19, 5, 26.31578947368421, 228.421052631579, 109, 399, 222.0, 399.0, 399.0, 399.0, 0.09327396527262999, 0.14243743740826015, 0.0602761906544396], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 124.70588235294116, 104, 328, 111.0, 159.99999999999986, 328.0, 328.0, 0.13293608902026102, 0.09879332396915882, 0.06672768530899821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 125.47058823529413, 105, 331, 114.0, 159.79999999999984, 331.0, 331.0, 0.13294024726885992, 0.059062492668736366, 0.07450396670237806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe2a590e-84be-49b6-afbd-f4dfda3c96e4", 3, 0, 0.0, 402.3333333333333, 222, 586, 399.0, 586.0, 586.0, 586.0, 0.0445751983596327, 0.037160508788743274, 0.028585006760571748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 783.7142857142857, 646, 912, 849.0, 912.0, 912.0, 912.0, 0.07115556639830854, 20.922099108268277, 0.04058090896153533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eaaef4ef-d960-4f27-8276-9bcc69042255", 3, 0, 0.0, 300.6666666666667, 211, 449, 242.0, 449.0, 449.0, 449.0, 0.08726764988218867, 0.039486338976641354, 0.055962653082002496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1095.4285714285713, 748, 1322, 1181.0, 1322.0, 1322.0, 1322.0, 0.07113676551289608, 64.00898665359952, 0.04050071708400236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af773a56-1393-4112-9ec3-8c4370e32c39", 1, 0, 0.0, 835.0, 835, 835, 835.0, 835.0, 835.0, 835.0, 1.1976047904191616, 0.21636414670658682, 0.8256923652694611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 205.14285714285714, 105, 341, 116.0, 341.0, 341.0, 341.0, 0.07153441316233201, 0.12658237954115784, 0.0396093869756272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 139.22222222222223, 110, 345, 114.0, 345.0, 345.0, 345.0, 0.059744294419882896, 0.044399812552276256, 0.029988835284980284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 158.11111111111111, 107, 325, 112.0, 325.0, 325.0, 325.0, 0.05966112481107311, 0.01596401191233792, 0.03402548524381513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a84cc1a0-f2c1-4103-bbdd-4782f3d16087", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 133.66666666666666, 110, 307, 113.0, 307.0, 307.0, 307.0, 0.059744294419882896, 0.016102954355359064, 0.035123110586688974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 184.22222222222223, 105, 345, 113.0, 345.0, 345.0, 345.0, 0.05965835647856608, 0.01607979139461351, 0.035130848590405606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 142.42857142857144, 105, 335, 111.0, 335.0, 335.0, 335.0, 0.07153806847215126, 0.053164521589167096, 0.04017030212059275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 877.4705882352941, 112, 1568, 1217.0, 1507.2, 1568.0, 1568.0, 0.08091616133730616, 42.83751224154426, 0.04347942171123402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 248.23529411764707, 103, 1309, 111.0, 911.3999999999996, 1309.0, 1309.0, 0.13271400132714, 14.080537760060892, 0.07667953959951598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ece35d1b-b51a-46ec-af2c-64d5225b66d4", 3, 0, 0.0, 450.0, 247, 631, 472.0, 631.0, 631.0, 631.0, 0.016461718274153457, 0.02269380758171871, 0.01055650553388096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 541.0588235294117, 104, 1060, 644.0, 989.5999999999999, 1060.0, 1060.0, 0.0810029113399311, 14.019310855819583, 0.04360514028989512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 256.29411764705884, 104, 866, 113.0, 830.8, 866.0, 866.0, 0.13271710957749117, 4.6225320472785185, 0.07681094203775411], "isController": false}, {"data": ["deleteBooks", 18, 5, 27.77777777777778, 437.8888888888889, 112, 1218, 459.5, 873.3000000000005, 1218.0, 1218.0, 0.09413536665725314, 0.019994572507766168, 0.06303780548233916], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 350.2222222222223, 221, 676, 231.0, 676.0, 676.0, 676.0, 0.05961330833990183, 0.0923889847025627, 0.13407172764335343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f64368a0-8e0c-49f0-8595-3e4bb7d742d6", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34f08040-2604-484a-b006-d810557c3cc2", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.5544026692708334, 1.0359022352430556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 903.2608695652174, 169, 1621, 1007.0, 1536.2, 1609.7999999999997, 1621.0, 0.10428332418965057, 0.06405684659696309, 0.047151542089656454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 125.99999999999999, 109, 309, 113.0, 161.79999999999987, 309.0, 309.0, 0.08099596449518073, 0.06019329002034428, 0.04065617749074502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 177.7058823529412, 111, 335, 117.0, 331.8, 335.0, 335.0, 0.0809250205882773, 0.09315116972356965, 0.04215464652427037], "isController": false}, {"data": ["login", 23, 0, 0.0, 3265.8260869565215, 1670, 4506, 3249.0, 4368.8, 4495.599999999999, 4506.0, 0.10436329316102802, 38.14058731719408, 0.21013127229063816], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 120.47058823529412, 112, 150, 118.0, 132.39999999999998, 150.0, 150.0, 0.12677484787018256, 0.10263315320740365, 0.04506449670385396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff8ab95e-f02d-43ca-a47a-086a7fbee716", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1005.1176470588235, 226, 1682, 1327.0, 1622.0, 1682.0, 1682.0, 0.08086727776958534, 56.96065186309883, 0.16970143176704516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd46e93b-900a-4330-b4af-c011d72aa13f", 3, 0, 0.0, 757.6666666666666, 399, 1395, 479.0, 1395.0, 1395.0, 1395.0, 0.032254249497371275, 0.026889040677984324, 0.020683877444603326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 360.94736842105254, 218, 1093, 231.0, 1018.0, 1093.0, 1093.0, 0.09736649260270884, 12.396507065156118, 0.2163571944229498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 10, 58.8235294117647, 576.2941176470589, 109, 1553, 114.0, 1461.0, 1553.0, 1553.0, 0.15192950470981464, 74.86647519080557, 0.20028023173717982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e784252c-b9f4-47a8-b010-158def076f82", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["register", 25, 7, 28.0, 1233.2400000000002, 246, 2317, 1247.0, 2036.2000000000003, 2262.1, 2317.0, 0.10056558082656863, 0.03161530447235251, 0.045372361661987014], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 426.94117647058823, 220, 1420, 232.0, 1072.7999999999997, 1420.0, 1420.0, 0.13259702982653188, 18.843928481939503, 0.2942225109782541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 119.4, 113, 134, 118.5, 127.9, 133.7, 134.0, 0.11239427913119222, 0.08725923038017365, 0.03995265390991599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/103beb79-263c-4e9d-80ea-cb55e624287d", 3, 0, 0.0, 416.33333333333337, 240, 704, 305.0, 704.0, 704.0, 704.0, 0.019408682150481985, 0.026756435191175522, 0.012446322863427573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 353.85714285714283, 218, 1320, 229.5, 884.0, 1320.0, 1320.0, 0.12959843000759075, 11.261132664242869, 0.28910140845722326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 114.66666666666666, 107, 124, 114.5, 124.0, 124.0, 124.0, 0.0469270597068623, 0.03487450433293184, 0.023555184266921114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 114.0, 107, 123, 114.0, 123.0, 123.0, 123.0, 0.04692485766126509, 0.012556065428893199, 0.02676183288494025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 109.66666666666667, 105, 113, 110.0, 113.0, 113.0, 113.0, 0.04692852785208128, 0.012648704772631282, 0.027588841569289972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 112.33333333333333, 105, 119, 112.5, 119.0, 119.0, 119.0, 0.04692632566870014, 0.012648111215391835, 0.02763337341623651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 114.8, 112, 116, 115.0, 116.0, 116.0, 116.0, 0.11144296349128516, 0.03286696774840637, 0.06889003504881201], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1267.7321428571431, 859, 2310, 1220.5, 1763.1000000000001, 1837.9499999999998, 2310.0, 0.2545674399152654, 304.5511601001905, 0.5026712534264323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 1233.2400000000002, 246, 2317, 1247.0, 2036.2000000000003, 2262.1, 2317.0, 0.10100153118321273, 0.0317523563657225, 0.04556905020180106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3da0f037-0b92-4811-b15c-a6970150f584", 3, 0, 0.0, 407.33333333333337, 230, 686, 306.0, 686.0, 686.0, 686.0, 0.040340473597160025, 0.025935037550257504, 0.02586937922734546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef391dc3-2845-42cb-acb4-40ee7fec43f9", 3, 0, 0.0, 375.33333333333337, 240, 641, 245.0, 641.0, 641.0, 641.0, 0.04382120946538125, 0.028686345128542217, 0.028101491747005554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a84cc1a0-f2c1-4103-bbdd-4782f3d16087", 3, 0, 0.0, 461.0, 212, 927, 244.0, 927.0, 927.0, 927.0, 0.053441641727233855, 0.03435782630575744, 0.03427084446700869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 133.8, 105, 333, 111.5, 311.6000000000001, 333.0, 333.0, 0.06212106152469934, 0.01674356736407912, 0.03658105478456416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 154.8, 107, 336, 112.5, 333.7, 336.0, 336.0, 0.06211758859521074, 0.016742631301052892, 0.036518347982731306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b56568a-d8de-49fc-88a6-d3c0e8ce9eea", 3, 0, 0.0, 315.0, 204, 526, 215.0, 526.0, 526.0, 526.0, 0.0462178400862733, 0.02875074622554306, 0.029638393544908336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 171.9, 107, 354, 114.5, 349.70000000000005, 353.85, 354.0, 0.1173048048048048, 0.03161731067004504, 0.0689623950121997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 169.59999999999997, 106, 336, 112.5, 332.9, 335.85, 336.0, 0.11730411678797867, 0.03161712522800988, 0.06907654533510853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 146.24999999999997, 105, 339, 113.0, 337.8, 338.95, 339.0, 0.11730342877922321, 0.08717569267674695, 0.058880822648946035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 175.60000000000002, 105, 333, 115.0, 332.1, 333.0, 333.0, 0.06211681688583551, 0.016621101393280203, 0.035425997130203064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 147.99999999999997, 102, 347, 111.0, 333.90000000000003, 346.4, 347.0, 0.11730618086266965, 0.03138856792614403, 0.06690118127324128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 135.6, 107, 348, 112.0, 325.1000000000001, 348.0, 348.0, 0.06211527352460696, 0.046161839015845606, 0.031178955655906226], "isController": false}, {"data": ["deleteAccount", 18, 5, 27.77777777777778, 470.33333333333337, 110, 927, 504.0, 780.3000000000002, 927.0, 927.0, 0.09495273463875759, 0.01944697120558322, 0.06460515652694547], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 184.2, 116, 514, 120.0, 497.4000000000001, 514.0, 514.0, 0.06210215804999224, 0.048881190808880606, 0.022075376494333176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1690.130434782609, 1196, 2702, 1748.0, 2462.8000000000006, 2687.6, 2702.0, 0.10319222917648115, 0.05341004049173341, 0.047464394474729124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 317.2, 219, 684, 233.5, 660.0000000000001, 684.0, 684.0, 0.062070549386432625, 0.09619722839479353, 0.1395981203485882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af773a56-1393-4112-9ec3-8c4370e32c39", 3, 0, 0.0, 364.0, 227, 556, 309.0, 556.0, 556.0, 556.0, 0.040024548389679004, 0.025731928082557302, 0.02566678396082931], "isController": false}, {"data": ["addBook", 56, 11, 19.642857142857142, 1171.9107142857144, 560, 2704, 938.0, 2138.1000000000004, 2277.95, 2704.0, 0.2812642829518686, 91.25169982822788, 1.0209073378586748], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe2a590e-84be-49b6-afbd-f4dfda3c96e4", 1, 0, 0.0, 1218.0, 1218, 1218, 1218.0, 1218.0, 1218.0, 1218.0, 0.8210180623973727, 0.14832845853858787, 0.5660534688013137], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 211.92857142857144, 107, 775, 117.0, 442.90000000000003, 449.9, 775.0, 0.2554709561456732, 0.18985683361997782, 0.12349426102744944], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 719.6964285714287, 512, 1148, 667.0, 916.8000000000001, 988.4, 1148.0, 0.25561555420647347, 75.15946017190146, 0.128556650797201], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 156.25, 104, 357, 116.0, 326.3, 333.2, 357.0, 0.2562858685802678, 0.45350585338617705, 0.12463902593063805], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1051.8392857142858, 741, 1504, 1023.0, 1327.8, 1479.6, 1504.0, 0.25550359301927683, 229.9025821261549, 0.12825082696475418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 118.71428571428571, 112, 128, 118.5, 126.0, 128.0, 128.0, 0.13695280019564685, 0.10231337123991197, 0.048682440694546344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 11, 6.5476190476190474, 185.81547619047626, 105, 1036, 120.0, 362.29999999999995, 480.6999999999994, 997.3600000000001, 0.694194796018297, 1.553024389532121, 0.3312791572144607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 157.16666666666669, 110, 342, 115.5, 342.0, 342.0, 342.0, 0.04531790510430671, 0.03509482299581565, 0.016109099080046527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eaaef4ef-d960-4f27-8276-9bcc69042255", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ece35d1b-b51a-46ec-af2c-64d5225b66d4", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 141.42105263157896, 107, 343, 119.0, 328.0, 343.0, 343.0, 0.09727925289533777, 0.07894439370705633, 0.0345797344276396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd46e93b-900a-4330-b4af-c011d72aa13f", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 230.33333333333334, 215, 248, 230.0, 248.0, 248.0, 248.0, 0.04688159272397681, 0.07265731216108515, 0.10543780082355331], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff8ab95e-f02d-43ca-a47a-086a7fbee716", 3, 0, 0.0, 301.3333333333333, 203, 482, 219.0, 482.0, 482.0, 482.0, 0.02132529606619372, 0.025205778000113737, 0.013675401448698447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 354.95, 217, 690, 232.5, 684.3000000000001, 689.8, 690.0, 0.11722436156682083, 0.18167486504545374, 0.2636403366097542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f64368a0-8e0c-49f0-8595-3e4bb7d742d6", 3, 0, 0.0, 407.66666666666663, 222, 764, 237.0, 764.0, 764.0, 764.0, 0.06659563132658497, 0.030913206468655655, 0.042706182849405076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 120.0, 113, 133, 120.0, 133.0, 133.0, 133.0, 0.058660965689852955, 0.04863589831121597, 0.020852140147564917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e784252c-b9f4-47a8-b010-158def076f82", 3, 0, 0.0, 545.3333333333334, 391, 624, 621.0, 624.0, 624.0, 624.0, 0.06861534239055853, 0.03104665557385298, 0.04400137516582041], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 122.82352941176471, 112, 155, 119.0, 137.39999999999998, 155.0, 155.0, 0.07741101148870483, 0.06009936927101595, 0.027517195490125542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c28fde80-2d5c-4ecf-bdb7-1fba009ec37f", 2, 0, 0.0, 411.5, 345, 478, 411.5, 478.0, 478.0, 478.0, 0.012835487555994814, 0.025370143372395997, 0.007978308427139355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 129.07142857142856, 105, 333, 112.5, 239.0, 333.0, 333.0, 0.12973173330862253, 0.09641196196080248, 0.06511924894592966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd0674c7-d483-4e45-bb04-35c6ed391d67", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.5661984707446809, 1.0579427083333335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 142.0, 103, 343, 110.5, 338.5, 343.0, 343.0, 0.1297401490158283, 0.04863445597175371, 0.07321413264076806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 204.2857142857143, 102, 986, 111.0, 661.5, 986.0, 986.0, 0.1297401490158283, 8.371072247307891, 0.07547662128850502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 196.64285714285714, 103, 878, 112.0, 607.0, 878.0, 878.0, 0.1297377444166435, 2.757270960754332, 0.07560191942359373], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 18.42105263157895, 0.532319391634981], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 13.157894736842104, 0.38022813688212925], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 13.157894736842104, 0.38022813688212925], "isController": false}, {"data": ["401/Unauthorized", 21, 55.26315789473684, 1.596958174904943], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1315, 38, "401/Unauthorized", 21, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
