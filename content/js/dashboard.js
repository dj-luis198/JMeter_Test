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

    var data = {"OkPercent": 97.421875, "KoPercent": 2.578125};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7556742323097463, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e8c1a4f-b7b4-4712-b702-17bcd7b76a9a"], "isController": false}, {"data": [0.10909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe4771c0-e0d1-4443-8dd7-db8ba255212e"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/6829a81e-be40-4168-a944-631ef75f0c79"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1badb728-4d5e-46bf-ac72-c298c7755f67"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6c868999-51fe-4c72-a3bd-fedeaae1081c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9ee3a48-f1b1-45ed-993c-ebbeef218bd7"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67480e6b-6954-4297-8307-454458395d16"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5e7f15c8-7927-4902-acfb-ef3cffbae319"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9ee3a48-f1b1-45ed-993c-ebbeef218bd7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4f9049fc-8c78-468d-8ae0-75f14130fe05"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69f482ab-b290-4444-b034-db34db191006"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8232616-1414-4fcc-9ade-5612aebb60a0"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/67480e6b-6954-4297-8307-454458395d16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c868999-51fe-4c72-a3bd-fedeaae1081c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e7f15c8-7927-4902-acfb-ef3cffbae319"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.38181818181818183, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1badb728-4d5e-46bf-ac72-c298c7755f67"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a30b53b7-fd1c-4b14-8767-fd98e5e79b20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e8c1a4f-b7b4-4712-b702-17bcd7b76a9a"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb6382f5-ec7a-4b03-b845-16a328146878"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6829a81e-be40-4168-a944-631ef75f0c79"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe4771c0-e0d1-4443-8dd7-db8ba255212e"], "isController": false}, {"data": [0.23636363636363636, 500, 1500, "addBook"], "isController": true}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5545454545454546, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.896969696969697, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/3c0c4810-c07d-4bab-a2a3-d9fed465ec55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f9049fc-8c78-468d-8ae0-75f14130fe05"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb6382f5-ec7a-4b03-b845-16a328146878"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a30b53b7-fd1c-4b14-8767-fd98e5e79b20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a63221c9-f5ee-4c7d-95f2-1ec69285f8a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8232616-1414-4fcc-9ade-5612aebb60a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1280, 33, 2.578125, 401.9945312499998, 91, 4267, 137.0, 1106.3000000000006, 1356.8500000000001, 2133.2000000000044, 5.066537892161907, 732.533575245262, 3.700278876049921], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/7e8c1a4f-b7b4-4712-b702-17bcd7b76a9a", 3, 0, 0.0, 343.66666666666663, 196, 608, 227.0, 608.0, 608.0, 608.0, 0.06952652436904679, 0.032228440983568564, 0.04458569433822336], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1767.8000000000002, 1150, 2681, 1743.0, 2141.0, 2303.3999999999996, 2681.0, 0.245425053881955, 295.3286522106662, 1.2067530725543394], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe4771c0-e0d1-4443-8dd7-db8ba255212e", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6829a81e-be40-4168-a944-631ef75f0c79", 3, 0, 0.0, 2189.3333333333335, 183, 4267, 2118.0, 4267.0, 4267.0, 4267.0, 0.030794181952556433, 0.02567184244156804, 0.01974757110889849], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1badb728-4d5e-46bf-ac72-c298c7755f67", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 568.0, 123, 1341, 502.0, 1259.1000000000001, 1341.0, 1341.0, 0.08243216090757809, 0.016658501267394474, 0.05528851417317967], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 568.0, 123, 1341, 502.0, 1259.1000000000001, 1341.0, 1341.0, 0.08281959304522467, 0.016736796421675956, 0.05554837084802087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 174.13333333333335, 92, 401, 106.0, 380.6, 401.0, 401.0, 0.09537555715221302, 0.035070387161178336, 0.0538598686678578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 135.46666666666667, 94, 368, 102.0, 336.20000000000005, 368.0, 368.0, 0.09553288241812832, 0.07099660500019106, 0.047953028870037065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 168.66666666666666, 92, 566, 106.0, 467.00000000000006, 566.0, 566.0, 0.09553896716007236, 1.8968092572482231, 0.05571240422218542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 207.66666666666669, 93, 1003, 105.0, 622.0000000000002, 1003.0, 1003.0, 0.0955188904525685, 5.753900006447525, 0.05560741656424919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c868999-51fe-4c72-a3bd-fedeaae1081c", 3, 0, 0.0, 341.3333333333333, 182, 519, 323.0, 519.0, 519.0, 519.0, 0.06312068675307186, 0.02856046698788083, 0.040477784148291535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9ee3a48-f1b1-45ed-993c-ebbeef218bd7", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 262.3125, 107, 648, 222.0, 631.2, 648.0, 648.0, 0.08255507971724885, 0.13088688664155615, 0.05335545282751148], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 133.2, 95, 366, 107.5, 268.4000000000003, 361.8499999999999, 366.0, 0.10203925450120661, 0.07583190690958812, 0.05121892266955098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 652.9999999999999, 466, 759, 642.0, 759.0, 759.0, 759.0, 0.035583751442412784, 10.46280441581647, 0.02029385824450104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 153.55, 94, 363, 106.0, 356.0000000000001, 362.9, 363.0, 0.10204446077155817, 0.050294764991606844, 0.05691171049476257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1062.5714285714287, 855, 1354, 1038.0, 1354.0, 1354.0, 1354.0, 0.035511003338034315, 31.95286322524883, 0.020217690377025394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 202.57142857142856, 98, 415, 123.0, 415.0, 415.0, 415.0, 0.0356205092715097, 0.06303160429685115, 0.01972346558295508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 125.15384615384616, 93, 373, 97.0, 274.5999999999999, 373.0, 373.0, 0.0720241557937893, 0.05352576421784537, 0.036152750076179394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 128.15384615384613, 92, 367, 106.0, 270.19999999999993, 367.0, 367.0, 0.07202934364645781, 0.019273476717899845, 0.04107923504837047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 153.23076923076923, 91, 385, 103.0, 345.4, 385.0, 385.0, 0.07202934364645781, 0.019414159029709332, 0.042345375854655865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 153.0, 93, 360, 96.0, 358.0, 360.0, 360.0, 0.07192373870658987, 0.019385695198260552, 0.04235352972663446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 113.0, 99, 126, 108.0, 126.0, 126.0, 126.0, 0.03567678868128396, 0.026513707213337005, 0.02003335301927566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67480e6b-6954-4297-8307-454458395d16", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 972.4166666666665, 106, 1462, 1155.5, 1453.3, 1462.0, 1462.0, 0.08907165072036696, 60.11612281542498, 0.046623442173942084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 282.90000000000003, 93, 1239, 106.5, 1176.000000000001, 1237.75, 1239.0, 0.10193264290956536, 13.781228618035453, 0.05861126967300008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 635.5833333333334, 99, 1038, 742.0, 1020.0000000000001, 1038.0, 1038.0, 0.08906503974527398, 19.64706064494222, 0.04670695931954309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 261.9, 93, 1023, 127.0, 750.3000000000001, 1009.3999999999999, 1023.0, 0.10194927004322649, 4.5198273011224614, 0.058720390108881824], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 380.66666666666663, 127, 846, 421.0, 672.0000000000001, 846.0, 846.0, 0.0866651259533164, 0.017637707274092904, 0.058515886800901314], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 332.53846153846155, 199, 687, 241.0, 603.3999999999999, 687.0, 687.0, 0.07188078847695668, 0.11140118292278345, 0.1616615779906555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e7f15c8-7927-4902-acfb-ef3cffbae319", 3, 0, 0.0, 630.6666666666666, 247, 1021, 624.0, 1021.0, 1021.0, 1021.0, 0.02326338807983995, 0.027496537147753533, 0.01491825342359528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 894.0454545454546, 189, 2622, 687.0, 1973.8, 2525.3999999999987, 2622.0, 0.1040017018460302, 0.06388385787221973, 0.04702420698702343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 106.16666666666666, 94, 137, 98.5, 133.70000000000002, 137.0, 137.0, 0.08925649340989557, 0.06633221824700247, 0.04480257579363899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 175.16666666666669, 92, 399, 104.5, 373.80000000000007, 399.0, 399.0, 0.08925848513474312, 0.12443016360336505, 0.045282991237792045], "isController": false}, {"data": ["login", 22, 0, 0.0, 3495.136363636363, 1961, 6063, 3144.0, 5510.4, 5983.799999999999, 6063.0, 0.1035152849728743, 39.543422419705074, 0.21079843809550697], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 153.70000000000002, 96, 312, 125.0, 308.1, 311.85, 312.0, 0.10320290206560609, 0.08355000567615961, 0.03668540659363341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9ee3a48-f1b1-45ed-993c-ebbeef218bd7", 3, 0, 0.0, 439.6666666666667, 371, 497, 451.0, 497.0, 497.0, 497.0, 0.04762055938283755, 0.03117348467411664, 0.03053792382297851], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f9049fc-8c78-468d-8ae0-75f14130fe05", 3, 0, 0.0, 432.0, 231, 569, 496.0, 569.0, 569.0, 569.0, 0.026802705286386907, 0.02688122883703062, 0.017187932752012434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 1081.5, 201, 1560, 1255.5, 1559.4, 1560.0, 1560.0, 0.0890016242796431, 79.89214724067152, 0.18308781400885565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69f482ab-b290-4444-b034-db34db191006", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.9676846590909091, 1.8081202651515151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 688.8461538461539, 105, 1479, 981.0, 1369.0, 1479.0, 1479.0, 0.06317948319182749, 40.707216858716095, 0.09603167539839524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 395.13333333333327, 201, 1100, 230.0, 901.4000000000001, 1100.0, 1100.0, 0.09531071292413268, 7.739515325168383, 0.21273028458190368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8232616-1414-4fcc-9ade-5612aebb60a0", 3, 0, 0.0, 392.6666666666667, 288, 478, 412.0, 478.0, 478.0, 478.0, 0.05440992437020512, 0.02461907385240401, 0.034891780927507846], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1331.2916666666663, 163, 3060, 1163.0, 2642.5, 2959.25, 3060.0, 0.09801919542577088, 0.0306309985705534, 0.044223504186236474], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/67480e6b-6954-4297-8307-454458395d16", 3, 0, 0.0, 471.0, 197, 995, 221.0, 995.0, 995.0, 995.0, 0.06599208095028597, 0.029859698086229652, 0.04231914045314562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 118.16666666666666, 95, 149, 111.5, 147.20000000000002, 149.0, 149.0, 0.054848617814831066, 0.042582667151162795, 0.019496969613865732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 470.9000000000001, 193, 1581, 387.0, 1321.500000000001, 1570.1999999999998, 1581.0, 0.10187760424625854, 18.416361789976772, 0.22521516868384323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c868999-51fe-4c72-a3bd-fedeaae1081c", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e7f15c8-7927-4902-acfb-ef3cffbae319", 1, 0, 0.0, 846.0, 846, 846, 846.0, 846.0, 846.0, 846.0, 1.1820330969267139, 0.2135509013002364, 0.8149564125295509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 403.0, 189, 1496, 243.0, 710.0, 1496.0, 1496.0, 0.09592713576718989, 6.180959678416899, 0.21445059468513178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 111.41666666666666, 94, 130, 107.0, 129.7, 130.0, 130.0, 0.06336365988499497, 0.047089594895001134, 0.03180558709071036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 147.75, 93, 361, 105.0, 361.0, 361.0, 361.0, 0.06336834434358317, 0.01695598276381034, 0.03613975888344977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 140.91666666666666, 95, 398, 98.5, 368.60000000000014, 398.0, 398.0, 0.06336800971642817, 0.017079658868881027, 0.03725345883719702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 122.5, 94, 311, 104.0, 256.4000000000002, 311.0, 311.0, 0.06335663449557559, 0.01707659289138561, 0.03730864316487508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 130.66666666666666, 127, 136, 129.0, 136.0, 136.0, 136.0, 0.0503389489227465, 0.014846057201825627, 0.031117729168064972], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1208.0727272727274, 751, 2198, 1132.0, 1638.3999999999999, 1790.7999999999995, 2198.0, 0.2394448362632674, 286.45926866472496, 0.4728100184807878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1331.2916666666663, 163, 3060, 1163.0, 2642.5, 2959.25, 3060.0, 0.0971203807118924, 0.03035011897246637, 0.04381798426649832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 127.28571428571429, 92, 316, 95.0, 316.0, 316.0, 316.0, 0.03428045328553658, 0.009239653424617283, 0.020186634112479063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 136.85714285714286, 96, 277, 126.0, 277.0, 277.0, 277.0, 0.03428028540786194, 0.009239608176337788, 0.020153058413606335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1badb728-4d5e-46bf-ac72-c298c7755f67", 3, 0, 0.0, 297.6666666666667, 201, 478, 214.0, 478.0, 478.0, 478.0, 0.03513333099111127, 0.022587346584454673, 0.02253016342854466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a30b53b7-fd1c-4b14-8767-fd98e5e79b20", 3, 0, 0.0, 610.3333333333334, 499, 684, 648.0, 684.0, 684.0, 684.0, 0.06237784339002786, 0.028914729488085832, 0.040001416496860315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e8c1a4f-b7b4-4712-b702-17bcd7b76a9a", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 0.5790514823717948, 2.209785657051282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 234.58333333333334, 94, 1224, 111.5, 950.700000000001, 1224.0, 1224.0, 0.05557099194220617, 4.180636295093545, 0.03227169584143744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 159.91666666666666, 93, 623, 96.5, 520.1000000000004, 623.0, 623.0, 0.055572793412771555, 1.3754175919150848, 0.03232701231400481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 125.91666666666666, 95, 299, 107.5, 249.80000000000018, 299.0, 299.0, 0.05556944791753494, 0.04129721666527743, 0.027893258036731407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 155.28571428571428, 100, 398, 125.0, 398.0, 398.0, 398.0, 0.03428129269857439, 0.009172924022860724, 0.019551049742155706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 123.08333333333333, 95, 277, 106.5, 232.30000000000015, 277.0, 277.0, 0.055570477257782185, 0.021824798441248114, 0.031303616827666685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb6382f5-ec7a-4b03-b845-16a328146878", 3, 0, 0.0, 463.3333333333333, 186, 981, 223.0, 981.0, 981.0, 981.0, 0.019428290180942144, 0.02678346644410481, 0.012458897023585946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 138.28571428571428, 94, 282, 127.0, 282.0, 282.0, 282.0, 0.03428028540786194, 0.025475876167366147, 0.0172070963863682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 162.85714285714286, 108, 375, 131.0, 375.0, 375.0, 375.0, 0.03570900223946457, 0.028106890434578556, 0.01269343438980967], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 640.0666666666667, 105, 2118, 496.0, 1459.8000000000004, 2118.0, 2118.0, 0.0861692594039385, 0.017065552546014384, 0.058635488235023785], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1771.0454545454545, 1087, 4011, 1519.5, 3219.1999999999994, 3941.999999999999, 4011.0, 0.10622272007416277, 0.05497855628838503, 0.04885830190911198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 325.0, 208, 680, 252.0, 680.0, 680.0, 680.0, 0.03426233199220777, 0.053099922726204805, 0.07705678767388133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6829a81e-be40-4168-a944-631ef75f0c79", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe4771c0-e0d1-4443-8dd7-db8ba255212e", 3, 0, 0.0, 612.6666666666666, 197, 1229, 412.0, 1229.0, 1229.0, 1229.0, 0.01614109468904181, 0.02225180208596747, 0.01035089731035559], "isController": false}, {"data": ["addBook", 55, 13, 23.636363636363637, 1215.363636363636, 522, 2808, 943.0, 2127.4, 2420.0, 2808.0, 0.25941193672235374, 85.70084648620636, 0.9405709361940967], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 190.07272727272732, 95, 704, 122.0, 387.6, 424.59999999999997, 704.0, 0.24035520128655585, 0.17862334783112208, 0.11618732874691909], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 663.909090909091, 462, 1032, 622.0, 840.0, 962.4, 1032.0, 0.24059387316765893, 70.74258717973674, 0.12100180144662534], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 138.5272727272728, 93, 427, 104.0, 299.99999999999994, 367.39999999999975, 427.0, 0.24103355187042036, 0.4265164023332048, 0.11722139534323178], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1016.3272727272728, 626, 1495, 1003.0, 1370.8, 1484.0, 1495.0, 0.2402166317260657, 216.14734748291187, 0.12057748897187281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 132.3157894736842, 98, 319, 111.0, 284.0, 319.0, 319.0, 0.10226820104851818, 0.0764015369161293, 0.03635314959146545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 13, 7.878787878787879, 195.89696969696976, 94, 2332, 127.0, 353.8000000000001, 475.49999999999994, 1487.2000000000044, 0.6771286462351647, 1.5398665261453734, 0.3225298077672812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 136.66666666666666, 96, 332, 122.5, 273.5000000000002, 332.0, 332.0, 0.06514657980456026, 0.05045042752442997, 0.02315757328990228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c0c4810-c07d-4bab-a2a3-d9fed465ec55", 2, 0, 0.0, 432.0, 237, 627, 432.0, 627.0, 627.0, 627.0, 0.022032740652609777, 0.030962025194438934, 0.013695155688853636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 122.8, 96, 148, 124.0, 143.2, 148.0, 148.0, 0.09537495072294214, 0.0773990078620751, 0.033902814514795834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 289.25, 193, 493, 244.0, 491.2, 493.0, 493.0, 0.06332052851534467, 0.0981344519080586, 0.14240935270589725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f9049fc-8c78-468d-8ae0-75f14130fe05", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 379.25, 190, 1347, 227.5, 1116.9000000000008, 1347.0, 1347.0, 0.05554244136801033, 5.616245737406909, 0.1237319978847587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb6382f5-ec7a-4b03-b845-16a328146878", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a30b53b7-fd1c-4b14-8767-fd98e5e79b20", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 119.07692307692307, 96, 134, 126.0, 132.8, 134.0, 134.0, 0.07112803593607231, 0.0589723657321537, 0.025283794024150704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a63221c9-f5ee-4c7d-95f2-1ec69285f8a2", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8232616-1414-4fcc-9ade-5612aebb60a0", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 127.58333333333333, 95, 188, 125.0, 180.50000000000003, 188.0, 188.0, 0.08775201281179387, 0.06812778338415637, 0.031193098304192354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 150.05263157894737, 93, 400, 106.0, 319.0, 400.0, 400.0, 0.09597365270670957, 0.0713241696384824, 0.048174274893797574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 123.0, 92, 290, 99.0, 284.0, 290.0, 290.0, 0.0959886834394261, 0.03327239314943922, 0.05431925394058806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 219.0526315789474, 91, 1401, 102.0, 315.0, 1401.0, 1401.0, 0.0959872286466306, 4.570271847514183, 0.05599583907993715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 222.21052631578945, 92, 956, 108.0, 361.0, 956.0, 956.0, 0.09599062323175168, 1.5100071014115672, 0.05609156021390752], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 24.242424242424242, 0.625], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.090909090909092, 0.234375], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.090909090909092, 0.234375], "isController": false}, {"data": ["401/Unauthorized", 19, 57.57575757575758, 1.484375], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1280, 33, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
