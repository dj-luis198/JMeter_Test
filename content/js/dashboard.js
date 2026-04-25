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

    var data = {"OkPercent": 99.22720247295209, "KoPercent": 0.7727975270479135};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7995330220146765, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11818181818181818, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c64c971-6f19-42b1-a2c8-bd9c67fee104"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9afe7ca5-4dcb-4118-a10e-9e9030114d8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8594070-e2fc-4c28-b8f3-2b457b9c5dc1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/18a594e1-9524-4ebc-808c-81fd068cb560"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e527ddd0-d030-4196-8a26-69e2db88d5ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8630a351-1ce6-4998-a1a1-0e2de930834f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7a842dd1-2b6d-47cc-94d6-03551a69c127"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00ab9be8-9668-458d-b4b6-0da13bb1b84e"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dd52178-3108-4393-879f-48b81be60700"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5b17a24-ddbf-4708-b5fb-4ba27ec199e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2670ccca-3825-422f-9124-e91a405da1b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/798f263f-512a-41bf-bead-6da20b70f2f6"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7d267e86-08e9-4013-8fcd-bc121bc5a547"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f857626-5922-4b95-bc99-b525278a1c9d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0acb952a-96ab-4c11-9da9-7f2dfa73ad0d"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a842dd1-2b6d-47cc-94d6-03551a69c127"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9afe7ca5-4dcb-4118-a10e-9e9030114d8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.42727272727272725, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18a594e1-9524-4ebc-808c-81fd068cb560"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2631578947368421, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c64c971-6f19-42b1-a2c8-bd9c67fee104"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6c7236d-85d8-4a5f-8ff6-6b3ef2b004af"], "isController": false}, {"data": [0.33064516129032256, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5363636363636364, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e527ddd0-d030-4196-8a26-69e2db88d5ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9413407821229051, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=798f263f-512a-41bf-bead-6da20b70f2f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5b17a24-ddbf-4708-b5fb-4ba27ec199e4"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2670ccca-3825-422f-9124-e91a405da1b4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8dd52178-3108-4393-879f-48b81be60700"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/00ab9be8-9668-458d-b4b6-0da13bb1b84e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d267e86-08e9-4013-8fcd-bc121bc5a547"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f857626-5922-4b95-bc99-b525278a1c9d"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1294, 10, 0.7727975270479135, 370.727202472952, 97, 12149, 115.0, 1009.0, 1218.0, 1783.3999999999978, 5.116950392470886, 684.5618901625245, 3.7449357847934834], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1693.5090909090911, 1225, 2189, 1643.0, 2066.6, 2129.6, 2189.0, 0.2416307881556981, 290.7639848967028, 1.188096697621035], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4c64c971-6f19-42b1-a2c8-bd9c67fee104", 3, 0, 0.0, 454.0, 213, 922, 227.0, 922.0, 922.0, 922.0, 0.02705676509316546, 0.027312183774057974, 0.017350855219249988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9afe7ca5-4dcb-4118-a10e-9e9030114d8c", 3, 0, 0.0, 863.3333333333334, 190, 1964, 436.0, 1964.0, 1964.0, 1964.0, 0.024347684940956862, 0.024419016049182323, 0.015613587022683926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8594070-e2fc-4c28-b8f3-2b457b9c5dc1", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.7426417151162791, 1.3876271802325582], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 579.4166666666667, 421, 1440, 483.5, 1224.000000000001, 1440.0, 1440.0, 0.07941182309692875, 0.01434686257122248, 0.053975223511193764], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 579.4166666666667, 421, 1440, 483.5, 1224.000000000001, 1440.0, 1440.0, 0.07988549745364977, 0.014432438504809773, 0.05429717405052758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 180.72222222222223, 99, 316, 104.0, 307.90000000000003, 316.0, 316.0, 0.10887843118278269, 0.0382185031332793, 0.06158672545093817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 125.6666666666667, 99, 304, 104.0, 303.1, 304.0, 304.0, 0.10887974836680378, 0.08091551612025163, 0.0546525299419308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 203.94444444444446, 101, 917, 102.5, 375.20000000000084, 917.0, 917.0, 0.10888040697076562, 1.8062971248011421, 0.06359627069483847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 184.83333333333334, 100, 1204, 102.5, 387.7000000000013, 1204.0, 1204.0, 0.10887908977080951, 5.470471319811155, 0.06348917409161571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18a594e1-9524-4ebc-808c-81fd068cb560", 3, 0, 0.0, 798.0, 217, 1691, 486.0, 1691.0, 1691.0, 1691.0, 0.017461250574766166, 0.02063860704328644, 0.011197481651135854], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 258.0769230769231, 187, 517, 213.0, 493.0, 517.0, 517.0, 0.08163419091097478, 0.2129344960187633, 0.0527752288897122], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 103.44444444444446, 99, 109, 103.5, 107.2, 109.0, 109.0, 0.09520887769890722, 0.07075581633678554, 0.047790393688709285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e527ddd0-d030-4196-8a26-69e2db88d5ab", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 0.6975446428571428, 2.6619811776061777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 124.11111111111111, 99, 305, 102.0, 299.6, 305.0, 305.0, 0.09521089212605921, 0.02547635199466819, 0.05429996191564315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 761.0, 598, 898, 787.0, 898.0, 898.0, 898.0, 0.030050785828049403, 8.83592881344472, 0.017138338792559424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 934.3333333333334, 898, 993, 912.0, 993.0, 993.0, 993.0, 0.029988904105480975, 26.984068628982275, 0.017073760833491606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 306.0, 304, 310, 304.0, 310.0, 310.0, 310.0, 0.03019688368160406, 0.05343432932721343, 0.016720344772919435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8630a351-1ce6-4998-a1a1-0e2de930834f", 2, 0, 0.0, 348.5, 240, 457, 348.5, 457.0, 457.0, 457.0, 0.02439917042820544, 0.03477596605465414, 0.01516608591557887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a842dd1-2b6d-47cc-94d6-03551a69c127", 3, 0, 0.0, 692.0, 200, 1073, 803.0, 1073.0, 1073.0, 1073.0, 0.018346043064278422, 0.02529150142487601, 0.01176487787650667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 117.41176470588236, 101, 307, 104.0, 156.59999999999985, 307.0, 307.0, 0.09284543965046423, 0.06899939411523758, 0.046604058574549426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 149.23529411764707, 99, 308, 103.0, 302.4, 308.0, 308.0, 0.09284645381162, 0.024843680023812383, 0.05295149318943953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 114.17647058823529, 99, 306, 102.0, 147.59999999999985, 306.0, 306.0, 0.09284594672827268, 0.025024884079104748, 0.054583261650800935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 150.23529411764707, 100, 310, 104.0, 307.6, 310.0, 310.0, 0.09284493257819455, 0.025024610733966498, 0.05467333432094855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 103.66666666666667, 101, 105, 105.0, 105.0, 105.0, 105.0, 0.030257491250542112, 0.022486280118811083, 0.01699029049713058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 135.2777777777778, 98, 304, 103.0, 301.3, 304.0, 304.0, 0.09520988490182804, 0.025662039289945836, 0.05597299874111374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 714.1176470588235, 100, 1605, 913.0, 1315.3999999999996, 1605.0, 1605.0, 0.0879298216576323, 46.55058704470455, 0.047248136017089416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 112.83333333333331, 97, 306, 102.0, 125.10000000000028, 306.0, 306.0, 0.09520988490182804, 0.025662039289945836, 0.05606597714433818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 498.5294117647058, 100, 811, 606.0, 809.4, 811.0, 811.0, 0.08792936685683547, 15.218084225988818, 0.04733376015713495], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 491.75, 259, 834, 442.5, 829.5, 834.0, 834.0, 0.07967439729638212, 0.01439430029280341, 0.054931762198482205], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 292.88235294117646, 207, 618, 214.0, 452.39999999999986, 618.0, 618.0, 0.09278969488565035, 0.14380590408547567, 0.2086861985563015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 588.1578947368421, 103, 1519, 583.0, 1301.0, 1519.0, 1519.0, 0.08167897583162094, 0.05017194902157185, 0.036931021298867675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 117.0, 99, 305, 103.0, 165.79999999999987, 305.0, 305.0, 0.087928002482673, 0.06534493153253336, 0.04413573562118547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 203.35294117647058, 99, 409, 105.0, 328.19999999999993, 409.0, 409.0, 0.08792936685683547, 0.10121373236886887, 0.04580328002399955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00ab9be8-9668-458d-b4b6-0da13bb1b84e", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["login", 19, 0, 0.0, 2786.368421052631, 1636, 4295, 2711.0, 4253.0, 4295.0, 4295.0, 0.08648510862984829, 16.45792147408178, 0.15313145082183613], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 109.05555555555553, 102, 149, 105.5, 130.10000000000002, 149.0, 149.0, 0.09633344215444392, 0.07798869486917383, 0.034243528265837486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dd52178-3108-4393-879f-48b81be60700", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5b17a24-ddbf-4708-b5fb-4ba27ec199e4", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2670ccca-3825-422f-9124-e91a405da1b4", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/798f263f-512a-41bf-bead-6da20b70f2f6", 3, 0, 0.0, 297.6666666666667, 191, 430, 272.0, 430.0, 430.0, 430.0, 0.036112381731949826, 0.03010540677588656, 0.02315800521222043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 832.2352941176472, 204, 1707, 1045.0, 1419.7999999999997, 1707.0, 1707.0, 0.08788163894087117, 61.90137196323704, 0.1844211944019396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d267e86-08e9-4013-8fcd-bc121bc5a547", 3, 0, 0.0, 414.0, 218, 517, 507.0, 517.0, 517.0, 517.0, 0.01991132821833435, 0.027449373373908195, 0.012768657744179254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f857626-5922-4b95-bc99-b525278a1c9d", 1, 0, 0.0, 834.0, 834, 834, 834.0, 834.0, 834.0, 834.0, 1.199040767386091, 0.21662357613908872, 0.8266824040767387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0acb952a-96ab-4c11-9da9-7f2dfa73ad0d", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.6298539201183432, 1.1768830128205128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 391.3888888888889, 206, 1304, 400.5, 688.400000000001, 1304.0, 1304.0, 0.10881063926250567, 7.391230684222457, 0.24317099894211877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1039.0, 1004, 1095, 1018.0, 1095.0, 1095.0, 1095.0, 0.029957161259399057, 35.839179660585366, 0.06754988803510979], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1824.9047619047617, 349, 12149, 1186.0, 4456.400000000002, 11444.19999999999, 12149.0, 0.0860070607701318, 0.027309161594980466, 0.038803966870899306], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a842dd1-2b6d-47cc-94d6-03551a69c127", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 273.9444444444444, 203, 409, 210.5, 408.1, 409.0, 409.0, 0.09515602945607755, 0.14747326049491707, 0.2140081404661588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 141.7222222222222, 100, 313, 106.5, 313.0, 313.0, 313.0, 0.10146332664426957, 0.07877279754120539, 0.0360670418930802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 425.2142857142857, 207, 1506, 409.0, 1009.5, 1506.0, 1506.0, 0.14865783214407066, 12.917251923924354, 0.3316181272298675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 106.45454545454545, 102, 114, 104.0, 113.8, 114.0, 114.0, 0.049769476832308535, 0.03698688659119804, 0.02498194442559237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9afe7ca5-4dcb-4118-a10e-9e9030114d8c", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 121.18181818181817, 100, 302, 102.0, 263.60000000000014, 302.0, 302.0, 0.04977217916174601, 0.013317946377264068, 0.02838569592818327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 122.27272727272728, 100, 303, 103.0, 265.0000000000001, 303.0, 303.0, 0.04977082796034622, 0.013414793473687068, 0.029259803156375417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 122.36363636363639, 101, 294, 104.0, 257.8000000000001, 294.0, 294.0, 0.04977150355187548, 0.013414975566716439, 0.029308805314239177], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1160.8545454545458, 792, 1762, 1084.0, 1578.6, 1631.6, 1762.0, 0.24474248640566737, 292.79709999621764, 0.4832708081174408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1824.9047619047617, 349, 12149, 1186.0, 4456.400000000002, 11444.19999999999, 12149.0, 0.08701921881604137, 0.02763054436737028, 0.039260624114268665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 204.25, 104, 304, 204.5, 304.0, 304.0, 304.0, 0.02110094162952022, 0.005687363173581621, 0.012425652150977238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 151.75, 100, 303, 102.0, 303.0, 303.0, 303.0, 0.021123673829352402, 0.00569349021181764, 0.012418409809834127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18a594e1-9524-4ebc-808c-81fd068cb560", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 273.8888888888889, 100, 1299, 103.0, 1216.2, 1299.0, 1299.0, 0.09908347783007183, 9.929904030082845, 0.05730413811135882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 192.7222222222222, 100, 809, 103.0, 622.7000000000003, 809.0, 809.0, 0.09918940216343107, 3.2643171980647043, 0.05746226325418386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 102.75, 101, 104, 103.0, 104.0, 104.0, 104.0, 0.021123339177457172, 0.005652143490843032, 0.012046904374643543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 126.88888888888889, 102, 312, 103.5, 303.90000000000003, 312.0, 312.0, 0.09918830900464531, 0.07371318667239754, 0.049787881668347356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 154.5, 102, 304, 106.0, 304.0, 304.0, 304.0, 0.021122892991424103, 0.015697774967259517, 0.010602702146085928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 135.7222222222222, 100, 306, 102.0, 305.1, 306.0, 306.0, 0.09907802394385579, 0.04304561717352415, 0.0555808793174625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 106.25, 104, 109, 106.0, 109.0, 109.0, 109.0, 0.021251049270557733, 0.016726900109442906, 0.007554083920393569], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 774.090909090909, 377, 2836, 486.0, 2453.2000000000016, 2836.0, 2836.0, 0.0807843425256123, 0.014594827507068631, 0.054986998769874784], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1576.3684210526314, 1060, 2853, 1479.0, 2128.0, 2853.0, 2853.0, 0.08496480668270565, 0.043975925333822254, 0.03908049213628355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c64c971-6f19-42b1-a2c8-bd9c67fee104", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 360.0, 211, 607, 311.0, 607.0, 607.0, 607.0, 0.021089037918090178, 0.032683889820321395, 0.047429740552111015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6c7236d-85d8-4a5f-8ff6-6b3ef2b004af", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["addBook", 62, 6, 9.67741935483871, 1114.3225806451615, 530, 3685, 891.5, 1871.3000000000004, 2451.499999999997, 3685.0, 0.29296551984841396, 80.19938950504185, 1.0690601979171097], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 174.94545454545457, 100, 422, 104.0, 411.4, 415.4, 422.0, 0.24605638717643585, 0.18286026429811297, 0.11894327309798412], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 633.5999999999999, 491, 926, 603.0, 807.4, 921.2, 926.0, 0.24600466067011667, 72.33353836051312, 0.12372304711436533], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 163.20000000000007, 99, 425, 106.0, 307.4, 334.39999999999964, 425.0, 0.24644337403382996, 0.43608925170830065, 0.1198523440125462], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 984.6181818181816, 689, 1309, 950.0, 1209.2, 1220.0, 1309.0, 0.24523683189684, 220.66453242114522, 0.12309739413571852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e527ddd0-d030-4196-8a26-69e2db88d5ab", 3, 0, 0.0, 436.33333333333337, 187, 823, 299.0, 823.0, 823.0, 823.0, 0.07436602959767978, 0.033648691777595996, 0.047689153094866266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 107.28571428571429, 103, 120, 105.5, 117.5, 120.0, 120.0, 0.14351908803870916, 0.10721884995079345, 0.051016550826259895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 6, 3.35195530726257, 200.6033519553073, 101, 2238, 110.0, 316.0, 406.0, 2135.5999999999985, 0.7545102006407014, 1.5006889120721632, 0.36642910396644746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 113.72727272727273, 104, 159, 109.0, 150.8, 159.0, 159.0, 0.0506303478304896, 0.03920885334919751, 0.01799750645536935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 118.94444444444444, 103, 301, 107.0, 139.00000000000026, 301.0, 301.0, 0.10521578002887588, 0.0853850714882772, 0.03740092180713948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=798f263f-512a-41bf-bead-6da20b70f2f6", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 249.0909090909091, 206, 407, 217.0, 406.6, 407.0, 407.0, 0.0497449441047719, 0.07709494755300098, 0.11187754518875946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5b17a24-ddbf-4708-b5fb-4ba27ec199e4", 3, 0, 0.0, 333.0, 213, 464, 322.0, 464.0, 464.0, 464.0, 0.017086423128182347, 0.023555013654899815, 0.01095711378988256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 415.38888888888886, 204, 1401, 214.0, 1319.1000000000001, 1401.0, 1401.0, 0.09902188383632783, 13.299146142547503, 0.219887462316672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2670ccca-3825-422f-9124-e91a405da1b4", 3, 0, 0.0, 1106.6666666666665, 216, 2836, 268.0, 2836.0, 2836.0, 2836.0, 0.017361111111111112, 0.023933693214699073, 0.011133264612268517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dd52178-3108-4393-879f-48b81be60700", 3, 0, 0.0, 399.0, 188, 578, 431.0, 578.0, 578.0, 578.0, 0.026257746035080347, 0.0263346730254175, 0.016838463440464937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00ab9be8-9668-458d-b4b6-0da13bb1b84e", 3, 0, 0.0, 285.3333333333333, 205, 377, 274.0, 377.0, 377.0, 377.0, 0.05376247737495744, 0.03456409271339223, 0.03447658868120643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 107.11764705882354, 103, 116, 106.0, 116.0, 116.0, 116.0, 0.08973533355151336, 0.0743997052590184, 0.031898106848389514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 124.05882352941177, 101, 312, 107.0, 189.59999999999988, 312.0, 312.0, 0.09095043201455207, 0.07061093110504775, 0.03233003638017281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d267e86-08e9-4013-8fcd-bc121bc5a547", 1, 0, 0.0, 819.0, 819, 819, 819.0, 819.0, 819.0, 819.0, 1.221001221001221, 0.22059104090354092, 0.8418231074481075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 118.28571428571429, 101, 296, 104.0, 206.5, 296.0, 296.0, 0.14914560872714877, 0.11083965648570333, 0.07486410438061959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 174.8571428571429, 100, 315, 103.5, 311.5, 315.0, 315.0, 0.14914878656808642, 0.055909987375620564, 0.08416669108090256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 214.7857142857143, 99, 1210, 103.0, 758.5, 1210.0, 1210.0, 0.14904240256352932, 9.61648903007995, 0.08670575037526747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f857626-5922-4b95-bc99-b525278a1c9d", 2, 0, 0.0, 246.5, 213, 280, 246.5, 280.0, 280.0, 280.0, 0.028379260436473028, 0.03228695157079206, 0.017640038347475663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 252.71428571428572, 101, 887, 202.5, 647.0, 887.0, 887.0, 0.1488237607764348, 3.162899399124066, 0.08672389073146879], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 40.0, 0.3091190108191654], "isController": false}, {"data": ["401/Unauthorized", 6, 60.0, 0.46367851622874806], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1294, 10, "401/Unauthorized", 6, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
