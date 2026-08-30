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

    var data = {"OkPercent": 98.39572192513369, "KoPercent": 1.6042780748663101};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7157894736842105, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/313985de-4430-4b07-b8b5-5f96b69de193"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5dc0e1a-221f-495a-9eca-8c8b76c7ce7a"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53bfdbec-59c1-40a2-b9de-5923bb07dc92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/42da7518-2823-4ae3-b6ff-ec5fe2140f52"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/43c7580f-9ce1-4cb4-af29-6ca9af5a1138"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a16cb47-da48-4164-a2d6-45bb7f8cae3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fcd4410b-21e8-448a-850b-fd2d4f190db8"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6b89f2ef-a8c2-4901-b8bb-c654e462a227"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b7e6c4c-ab50-41e4-abb4-b1973b0a09d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=affe66ba-01f8-4558-afeb-066407ec90d3"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=526a84b2-0c45-4bbe-8571-259e933e0f1d"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ce7fa8ca-0c5b-45f0-ab48-1d94665d7088"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d8aac89-1516-4ac2-9a48-3cf184688a67"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.21052631578947367, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8efb9de6-9cfc-4b8a-91ac-57de5190b80b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/53bfdbec-59c1-40a2-b9de-5923bb07dc92"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42da7518-2823-4ae3-b6ff-ec5fe2140f52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/250442c1-1fbf-42d0-b5cf-1a6f9ba53444"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b7e6c4c-ab50-41e4-abb4-b1973b0a09d1"], "isController": false}, {"data": [0.2033898305084746, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5941d1b3-80e2-4251-b40d-f228856f51d1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fcd4410b-21e8-448a-850b-fd2d4f190db8"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a16cb47-da48-4164-a2d6-45bb7f8cae3a"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/8efb9de6-9cfc-4b8a-91ac-57de5190b80b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/526a84b2-0c45-4bbe-8571-259e933e0f1d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/affe66ba-01f8-4558-afeb-066407ec90d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6d8aac89-1516-4ac2-9a48-3cf184688a67"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e5dc0e1a-221f-495a-9eca-8c8b76c7ce7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce7fa8ca-0c5b-45f0-ab48-1d94665d7088"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b89f2ef-a8c2-4901-b8bb-c654e462a227"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/706fc7f6-f84e-4650-a6ed-c29a7e9a16b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 21, 1.6042780748663101, 516.8930481283426, 137, 4662, 162.0, 1420.0, 1695.5, 2459.6000000000085, 5.04484088903277, 722.5414251615293, 3.6820312530109103], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2414.3508771929833, 1694, 3539, 2304.0, 2930.4, 3061.7, 3539.0, 0.24833246925251926, 298.8266954545355, 1.221048811217221], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/313985de-4430-4b07-b8b5-5f96b69de193", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 0.9392233455882353, 1.7549402573529411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5dc0e1a-221f-495a-9eca-8c8b76c7ce7a", 1, 0, 0.0, 3761.0, 3761, 3761, 3761.0, 3761.0, 3761.0, 3761.0, 0.26588673225206066, 0.048036177213507045, 0.18331643844722148], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 713.5384615384614, 157, 1239, 661.0, 1190.6, 1239.0, 1239.0, 0.0672818644322187, 0.012746759472510182, 0.04548298512812019], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 713.5384615384614, 157, 1239, 661.0, 1190.6, 1239.0, 1239.0, 0.06793123269059936, 0.012869784318336207, 0.04592196236348435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53bfdbec-59c1-40a2-b9de-5923bb07dc92", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 163.1333333333333, 139, 431, 144.0, 266.6000000000001, 431.0, 431.0, 0.09052777693955762, 0.033287817978816504, 0.05112226153474758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 144.60000000000002, 140, 156, 145.0, 150.6, 156.0, 156.0, 0.09052613791355357, 0.06727577241427174, 0.045439877819889195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 274.5333333333333, 139, 1120, 144.0, 786.4000000000002, 1120.0, 1120.0, 0.09052723059096177, 1.7973073618252704, 0.05278987007833623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 261.86666666666673, 137, 1649, 141.0, 919.4000000000004, 1649.0, 1649.0, 0.09052886965653346, 5.4533094054214715, 0.05270241878051577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42da7518-2823-4ae3-b6ff-ec5fe2140f52", 3, 0, 0.0, 589.6666666666666, 260, 1012, 497.0, 1012.0, 1012.0, 1012.0, 0.06875845155967088, 0.03111140874607504, 0.044093147647314986], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 473.84615384615387, 146, 2773, 261.0, 1842.1999999999991, 2773.0, 2773.0, 0.06742808535358251, 0.11252872177097273, 0.04358613840651874], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/43c7580f-9ce1-4cb4-af29-6ca9af5a1138", 1, 0, 0.0, 3857.0, 3857, 3857, 3857.0, 3857.0, 3857.0, 3857.0, 0.2592688618096966, 0.08279386505055743, 0.15470046344309046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 180.9333333333333, 140, 421, 145.0, 420.4, 421.0, 421.0, 0.07564449106386413, 0.05621626728476621, 0.03796998867854117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a16cb47-da48-4164-a2d6-45bb7f8cae3a", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 161.4666666666667, 139, 433, 142.0, 261.4000000000001, 433.0, 433.0, 0.07564525401676299, 0.03538976532320695, 0.042294364680726594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1039.0, 869, 1150, 1068.5, 1150.0, 1150.0, 1150.0, 0.07253472600007253, 21.327617823595546, 0.041367460921916364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1405.75, 1146, 1669, 1404.0, 1669.0, 1669.0, 1669.0, 0.07181070697641019, 64.61540036713224, 0.04088441617895228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 287.75, 141, 432, 289.0, 432.0, 432.0, 432.0, 0.07328960386969109, 0.12968824434753928, 0.040581255267690276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 168.1538461538462, 139, 436, 145.0, 328.7999999999999, 436.0, 436.0, 0.06000323094320463, 0.044592244870877665, 0.030118809282038264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 165.0, 138, 431, 143.0, 317.39999999999986, 431.0, 431.0, 0.06000516967615672, 0.01605607079225287, 0.03422169833093313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 186.0, 140, 418, 144.0, 417.6, 418.0, 418.0, 0.06000544664823423, 0.01617334304190688, 0.03527663953343457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 209.61538461538464, 139, 434, 143.0, 432.4, 434.0, 434.0, 0.06000516967615672, 0.016173268389276615, 0.03533507550265869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 144.0, 141, 147, 144.0, 147.0, 147.0, 147.0, 0.07367567965814484, 0.05475311740219553, 0.04137062090179032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1108.9375000000002, 141, 1950, 1474.5, 1843.6000000000001, 1950.0, 1950.0, 0.10974614345192776, 61.72970050020235, 0.05862416061348094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 368.8666666666667, 140, 1577, 146.0, 1542.8, 1577.0, 1577.0, 0.07553973138071521, 9.080416686600763, 0.043543540471670084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 795.3125, 140, 1286, 1116.0, 1284.6, 1286.0, 1286.0, 0.10974388520789607, 20.17880858437247, 0.058730126068288126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 355.8666666666667, 138, 1114, 146.0, 1025.2, 1114.0, 1114.0, 0.07554011179936546, 2.979152502895704, 0.04361752939769351], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 873.1538461538462, 189, 3761, 557.0, 2852.999999999999, 3761.0, 3761.0, 0.06828161438746139, 0.012936165225749521, 0.04670253147519802], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fcd4410b-21e8-448a-850b-fd2d4f190db8", 3, 0, 0.0, 361.3333333333333, 236, 504, 344.0, 504.0, 504.0, 504.0, 0.027487630566245192, 0.027568160733919735, 0.01762715892431739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 400.99999999999994, 285, 868, 296.0, 751.5999999999999, 868.0, 868.0, 0.059963652801225106, 0.09293195019096118, 0.13485966054806778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b89f2ef-a8c2-4901-b8bb-c654e462a227", 3, 0, 0.0, 515.3333333333334, 238, 687, 621.0, 687.0, 687.0, 687.0, 0.01797235851260761, 0.024776347103155346, 0.011525242926379228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 668.2857142857144, 173, 1247, 467.0, 1238.0, 1246.8, 1247.0, 0.09798249379444206, 0.0601865123014688, 0.04430263147151042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 161.5625, 140, 429, 145.0, 233.0000000000002, 429.0, 429.0, 0.10974087436041648, 0.08155547401198919, 0.05508477482544342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 258.6875, 140, 574, 146.0, 478.80000000000007, 574.0, 574.0, 0.10974614345192776, 0.1323866442372986, 0.05682899664588349], "isController": false}, {"data": ["login", 21, 0, 0.0, 3425.761904761905, 1820, 9766, 3043.0, 6011.200000000001, 9402.299999999996, 9766.0, 0.09568069983597595, 21.936339942705487, 0.1745825715896665], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b7e6c4c-ab50-41e4-abb4-b1973b0a09d1", 1, 0, 0.0, 976.0, 976, 976, 976.0, 976.0, 976.0, 976.0, 1.0245901639344264, 0.18510662141393444, 0.7064068903688525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 162.4, 142, 270, 148.0, 261.6, 270.0, 270.0, 0.07914481390416091, 0.06407329172514589, 0.028133508067494695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=affe66ba-01f8-4558-afeb-066407ec90d3", 1, 0, 0.0, 987.0, 987, 987, 987.0, 987.0, 987.0, 987.0, 1.0131712259371835, 0.18304362968591692, 0.6985340678824722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1282.8124999999998, 291, 2091, 1624.0, 1984.6000000000001, 2091.0, 2091.0, 0.10963184256867407, 82.03733917094344, 0.22903312423343358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=526a84b2-0c45-4bbe-8571-259e933e0f1d", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 475.26666666666665, 281, 1794, 292.0, 1150.2000000000003, 1794.0, 1794.0, 0.09044917058110577, 7.3447435276081015, 0.20187948665573238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1083.1666666666665, 146, 1818, 1343.0, 1818.0, 1818.0, 1818.0, 0.08451299387280795, 67.4121527044158, 0.14571063543207266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce7fa8ca-0c5b-45f0-ab48-1d94665d7088", 3, 0, 0.0, 1025.6666666666667, 314, 1889, 874.0, 1889.0, 1889.0, 1889.0, 0.08330093852390737, 0.03769150538679402, 0.05341889612372966], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1298.0909090909086, 284, 3621, 1213.0, 1748.8, 3343.949999999996, 3621.0, 0.0932736946982384, 0.02949581858266381, 0.042082467725181774], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d8aac89-1516-4ac2-9a48-3cf184688a67", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 609.4, 284, 1718, 307.0, 1685.0, 1718.0, 1718.0, 0.07548537093511277, 12.142288784069065, 0.16719321644423643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 149.64285714285714, 142, 168, 147.0, 164.5, 168.0, 168.0, 0.08260366760284156, 0.06413077709400297, 0.029363022468197587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 588.6666666666666, 287, 1668, 559.0, 1658.1, 1668.0, 1668.0, 0.08285080411308214, 11.127287315081608, 0.18397804971508527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 161.93333333333337, 141, 415, 144.0, 254.2000000000001, 415.0, 415.0, 0.09405273223187134, 0.06989661057466219, 0.04721006285857604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 180.20000000000002, 139, 434, 142.0, 425.6, 434.0, 434.0, 0.09405450144843933, 0.02516692714538318, 0.05364045785731305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 160.99999999999997, 139, 421, 142.0, 259.6000000000001, 421.0, 421.0, 0.09405332196333174, 0.025350309435429257, 0.05529306623234932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 217.93333333333334, 139, 434, 144.0, 431.0, 434.0, 434.0, 0.09388378439275968, 0.02530461376211101, 0.05528508006722079], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.5604332010582012, 3.2707093253968256], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1641.4736842105262, 1109, 2944, 1571.0, 2295.2000000000003, 2383.4999999999995, 2944.0, 0.24617457664451095, 294.51037779699664, 0.4860986269289074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1298.0909090909086, 284, 3621, 1213.0, 1748.8, 3343.949999999996, 3621.0, 0.08907315335157984, 0.02816748688195378, 0.04018730160979481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 178.9, 137, 432, 145.5, 410.1000000000001, 432.0, 432.0, 0.04542398749931864, 0.012243184130675728, 0.026748695763758927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 206.7, 139, 435, 144.5, 433.5, 435.0, 435.0, 0.045423781166391855, 0.012243128517504054, 0.026704215099773335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 393.00000000000006, 140, 1575, 145.0, 1480.0, 1575.0, 1575.0, 0.07937542876905718, 10.221502183533, 0.045689595298706746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 363.5714285714286, 140, 1136, 145.0, 1127.0, 1136.0, 1136.0, 0.07937767899666615, 3.3525774003243143, 0.045768407825505175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 178.20000000000002, 140, 436, 142.0, 413.70000000000005, 436.0, 436.0, 0.04542460650934611, 0.012154631038633627, 0.025906220899861453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 164.57142857142858, 139, 419, 146.0, 286.0, 419.0, 419.0, 0.07925320833970188, 0.05889813627589174, 0.039781395592389426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8efb9de6-9cfc-4b8a-91ac-57de5190b80b", 1, 0, 0.0, 1491.0, 1491, 1491, 1491.0, 1491.0, 1491.0, 1491.0, 0.670690811535882, 0.1211697266934943, 0.46240987592219984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 199.4, 139, 428, 145.5, 426.4, 428.0, 428.0, 0.04542254320819423, 0.0337564017396834, 0.022799987508800617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53bfdbec-59c1-40a2-b9de-5923bb07dc92", 3, 0, 0.0, 434.0, 240, 676, 386.0, 676.0, 676.0, 676.0, 0.07151370679380215, 0.03235808998808105, 0.045860026817640044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42da7518-2823-4ae3-b6ff-ec5fe2140f52", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 222.07142857142858, 138, 433, 144.0, 425.0, 433.0, 433.0, 0.07937767899666615, 0.03827138094482117, 0.04431772758714535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 177.9, 144, 443, 149.0, 413.9000000000001, 443.0, 443.0, 0.0483038116537776, 0.0380203830009226, 0.017170495548803757], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 739.4615384615385, 151, 1928, 676.0, 1599.1999999999998, 1928.0, 1928.0, 0.06799163179916318, 0.012738215873430964, 0.04627435277196653], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1762.3333333333333, 778, 4662, 1625.0, 3326.8000000000006, 4544.499999999998, 4662.0, 0.09699589845915087, 0.050202955257177696, 0.04461432438892584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/250442c1-1fbf-42d0-b5cf-1a6f9ba53444", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.7603236607142857, 1.4206659226190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 410.3, 287, 861, 292.5, 859.7, 861.0, 861.0, 0.04539264639128461, 0.07034973615524284, 0.10208912562414889], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b7e6c4c-ab50-41e4-abb4-b1973b0a09d1", 3, 0, 0.0, 404.0, 242, 524, 446.0, 524.0, 524.0, 524.0, 0.03216709734835894, 0.026816385517300537, 0.02062798885946195], "isController": false}, {"data": ["addBook", 59, 12, 20.338983050847457, 1750.050847457627, 722, 4934, 1196.0, 3038.0, 4574.0, 4934.0, 0.27163654109998986, 94.7083892528614, 0.9845026173792139], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 260.8070175438596, 141, 588, 147.0, 567.2, 570.4, 588.0, 0.24770008300125587, 0.18408179996480054, 0.11973783309142741], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 913.736842105263, 684, 1396, 837.0, 1145.6, 1286.8, 1396.0, 0.24716733228395624, 72.67540241931287, 0.12430778918577877], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 235.7719298245615, 139, 585, 147.0, 430.6, 436.4, 585.0, 0.24790584796847684, 0.4386771450379688, 0.1205635862190444], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1374.7192982456143, 953, 2375, 1392.0, 1772.6000000000001, 1906.6999999999982, 2375.0, 0.24682376782976956, 222.09246016313102, 0.12389396158642729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 180.27777777777777, 142, 442, 147.0, 434.8, 442.0, 442.0, 0.08450783575432634, 0.06313329526568325, 0.03003989474079569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 12, 6.857142857142857, 319.3942857142858, 140, 4367, 151.0, 489.20000000000005, 751.599999999999, 3866.160000000006, 0.7207340779545979, 1.5912336406234555, 0.3450474178672037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 186.86666666666667, 141, 442, 148.0, 430.0, 442.0, 442.0, 0.09984490757689722, 0.07732130049656201, 0.035491744490225186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5941d1b3-80e2-4251-b40d-f228856f51d1", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 1.1570142663043477, 2.1618829257246377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 237.33333333333334, 141, 1216, 147.0, 753.4000000000003, 1216.0, 1216.0, 0.09201381434065967, 0.07467136691121894, 0.03270803556640637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fcd4410b-21e8-448a-850b-fd2d4f190db8", 1, 0, 0.0, 820.0, 820, 820, 820.0, 820.0, 820.0, 820.0, 1.2195121951219512, 0.2203220274390244, 0.840796493902439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 382.8, 282, 836, 289.0, 681.8000000000001, 836.0, 836.0, 0.09379748497676949, 0.1453677818927082, 0.2109527420913087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a16cb47-da48-4164-a2d6-45bb7f8cae3a", 3, 0, 0.0, 482.33333333333337, 249, 911, 287.0, 911.0, 911.0, 911.0, 0.08207934336525308, 0.036337209302325583, 0.05263551641586868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 600.3571428571428, 283, 1728, 428.5, 1627.0, 1728.0, 1728.0, 0.07918686403049825, 13.638766318150195, 0.17519872721256582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8efb9de6-9cfc-4b8a-91ac-57de5190b80b", 3, 0, 0.0, 1466.6666666666667, 521, 2773, 1106.0, 2773.0, 2773.0, 2773.0, 0.03350046342307735, 0.021930153627541846, 0.021483044577949993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/526a84b2-0c45-4bbe-8571-259e933e0f1d", 3, 0, 0.0, 846.0, 331, 1724, 483.0, 1724.0, 1724.0, 1724.0, 0.04047217537942665, 0.02601970910623946, 0.02595383642495784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/affe66ba-01f8-4558-afeb-066407ec90d3", 3, 0, 0.0, 454.6666666666667, 373, 592, 399.0, 592.0, 592.0, 592.0, 0.0339312778519239, 0.027955750079172982, 0.021759315549573596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 146.92307692307693, 143, 153, 146.0, 151.8, 153.0, 153.0, 0.062228051448238224, 0.05159337468706471, 0.022120127663240934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d8aac89-1516-4ac2-9a48-3cf184688a67", 3, 0, 0.0, 675.3333333333334, 261, 1085, 680.0, 1085.0, 1085.0, 1085.0, 0.038715672104067726, 0.038829096924685114, 0.024827432957361138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 170.6875, 140, 528, 145.5, 271.10000000000025, 528.0, 528.0, 0.11239270009412888, 0.08725800446760983, 0.039952092611584875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5dc0e1a-221f-495a-9eca-8c8b76c7ce7a", 3, 0, 0.0, 1092.3333333333333, 267, 1928, 1082.0, 1928.0, 1928.0, 1928.0, 0.025152803279925546, 0.025226493133284705, 0.016129890124171004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce7fa8ca-0c5b-45f0-ab48-1d94665d7088", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b89f2ef-a8c2-4901-b8bb-c654e462a227", 1, 0, 0.0, 667.0, 667, 667, 667.0, 667.0, 667.0, 667.0, 1.4992503748125936, 0.27086066341829085, 1.033662856071964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 161.05555555555554, 139, 430, 145.5, 181.6000000000004, 430.0, 430.0, 0.0834349230776362, 0.062005836388751116, 0.04188042037295411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/706fc7f6-f84e-4650-a6ed-c29a7e9a16b5", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 226.66666666666666, 139, 495, 145.0, 440.1000000000001, 495.0, 495.0, 0.08343840391604243, 0.036250799618037524, 0.04680735115515835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 327.3888888888889, 141, 1520, 144.0, 1518.2, 1520.0, 1520.0, 0.0829103370765815, 8.309071384072924, 0.047950531317076765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 329.44444444444446, 140, 1112, 148.5, 855.5000000000005, 1112.0, 1112.0, 0.08306644392553555, 2.733711622149206, 0.04812193404062872], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 23.80952380952381, 0.3819709702062643], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.761904761904762, 0.07639419404125286], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.07639419404125286], "isController": false}, {"data": ["401/Unauthorized", 14, 66.66666666666667, 1.0695187165775402], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 21, "401/Unauthorized", 14, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
