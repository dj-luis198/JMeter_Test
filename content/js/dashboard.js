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

    var data = {"OkPercent": 98.48363926576216, "KoPercent": 1.5163607342378291};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7654109589041096, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e5dc47a2-d609-4dd8-8ce5-9f80aa8540e4"], "isController": false}, {"data": [0.0196078431372549, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3b8c14b-9025-442e-be35-5be4c7edc527"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/977d495d-36ba-4ed0-983e-6ea40a0871ee"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/470df27a-c698-4b1d-a4dc-161d7e458c31"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf8b0597-75cf-402f-811d-722d59ff690c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b060700b-0937-454c-92c8-59b36fdbe2a5"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5130f0cb-b8bc-4c5b-8ceb-996c718732e2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24bf744f-45c8-4e36-a10e-694cb6f3b415"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca26cacb-586f-43a9-abb7-1bb2071f7bfb"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f69f2fe8-8466-4e87-9c48-8d94d3cee85d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0dc6256-fd88-46da-99df-5c1967f0c091"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=977d495d-36ba-4ed0-983e-6ea40a0871ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf8b0597-75cf-402f-811d-722d59ff690c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=359ada81-4a54-416c-a6da-e1ac882bab45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5dc47a2-d609-4dd8-8ce5-9f80aa8540e4"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c3b8c14b-9025-442e-be35-5be4c7edc527"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5130f0cb-b8bc-4c5b-8ceb-996c718732e2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3a7b6dbc-fc45-40bc-a825-4d6efd678fea"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.30392156862745096, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b060700b-0937-454c-92c8-59b36fdbe2a5"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65d61361-5a6b-4af2-abdb-50b2b877c3fd"], "isController": false}, {"data": [0.2627118644067797, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c5fa799-cc64-4a2c-8372-9ce12b004be9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=470df27a-c698-4b1d-a4dc-161d7e458c31"], "isController": false}, {"data": [0.9509803921568627, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4215686274509804, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9142011834319527, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f69f2fe8-8466-4e87-9c48-8d94d3cee85d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65d61361-5a6b-4af2-abdb-50b2b877c3fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c5fa799-cc64-4a2c-8372-9ce12b004be9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0dc6256-fd88-46da-99df-5c1967f0c091"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca26cacb-586f-43a9-abb7-1bb2071f7bfb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/359ada81-4a54-416c-a6da-e1ac882bab45"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1253, 19, 1.5163607342378291, 428.71588188347926, 114, 2710, 145.0, 1217.2000000000003, 1444.4999999999998, 1937.4000000000015, 4.8993157380254155, 686.1168820259041, 3.5795683651026393], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/e5dc47a2-d609-4dd8-8ce5-9f80aa8540e4", 3, 0, 0.0, 422.3333333333333, 212, 552, 503.0, 552.0, 552.0, 552.0, 0.07905138339920949, 0.03669507575757575, 0.0506937582345191], "isController": false}, {"data": ["see books", 51, 0, 0.0, 2123.862745098039, 1445, 2999, 2069.0, 2602.4, 2886.2, 2999.0, 0.23588832769051452, 283.85402664410697, 1.1598610643766998], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3b8c14b-9025-442e-be35-5be4c7edc527", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/977d495d-36ba-4ed0-983e-6ea40a0871ee", 3, 0, 0.0, 354.0, 242, 429, 391.0, 429.0, 429.0, 429.0, 0.05076915266284206, 0.03263967334281024, 0.03255704125839806], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 638.6923076923077, 411, 1428, 497.0, 1273.1999999999998, 1428.0, 1428.0, 0.07588980799878577, 0.013710561015405631, 0.0515813538741747], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 638.6923076923077, 411, 1428, 497.0, 1273.1999999999998, 1428.0, 1428.0, 0.07709094359314958, 0.01392756305149675, 0.052397750723468854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 180.64705882352942, 115, 372, 124.0, 367.2, 372.0, 372.0, 0.08259604219200178, 0.029398269612916077, 0.04669750960786315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 140.2941176470588, 117, 385, 125.0, 188.19999999999982, 385.0, 385.0, 0.08259483830845772, 0.06138151557884406, 0.04145873719780006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/470df27a-c698-4b1d-a4dc-161d7e458c31", 3, 0, 0.0, 353.0, 228, 513, 318.0, 513.0, 513.0, 513.0, 0.01826283877565929, 0.025176797596001655, 0.0117115209596513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 230.64705882352942, 120, 968, 128.0, 484.79999999999956, 968.0, 968.0, 0.08259724611064144, 1.44956079218047, 0.048221266786675605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 201.3529411764706, 120, 1423, 125.0, 390.9999999999991, 1423.0, 1423.0, 0.08259443702174177, 4.392635772197255, 0.04813896817684927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf8b0597-75cf-402f-811d-722d59ff690c", 3, 0, 0.0, 407.0, 212, 581, 428.0, 581.0, 581.0, 581.0, 0.0506799560773714, 0.0315264961145367, 0.032499841625137256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b060700b-0937-454c-92c8-59b36fdbe2a5", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 238.0, 208, 321, 228.0, 309.8, 321.0, 321.0, 0.07639554085104633, 0.1664667558192834, 0.04938852347987565], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 174.30000000000004, 116, 387, 126.0, 375.6, 386.45, 387.0, 0.10443482483669005, 0.07761220869211047, 0.05242138668560418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 158.95000000000002, 117, 360, 124.0, 358.7, 359.95, 360.0, 0.10430900499640135, 0.03574416977855198, 0.0590507130824354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 956.5714285714286, 735, 1120, 954.0, 1120.0, 1120.0, 1120.0, 0.09072293216516758, 26.675554341416316, 0.051740422250447136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1320.142857142857, 1197, 1378, 1338.0, 1378.0, 1378.0, 1378.0, 0.09034006581919081, 81.28815002500484, 0.051433846066980704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 229.7142857142857, 120, 377, 129.0, 377.0, 377.0, 377.0, 0.09140290400083569, 0.16174029497022877, 0.050610787664525224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 124.84615384615384, 120, 130, 125.0, 129.6, 130.0, 130.0, 0.0826645979321133, 0.06143335842415841, 0.041493753258892804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 123.84615384615384, 120, 129, 123.0, 128.6, 129.0, 129.0, 0.08266039295479113, 0.022118112958606218, 0.04714225535702931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 142.53846153846155, 119, 361, 125.0, 268.19999999999993, 361.0, 361.0, 0.08266249538997622, 0.02228012571057953, 0.04859650607887274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 124.92307692307693, 117, 129, 126.0, 129.0, 129.0, 129.0, 0.08266144415901519, 0.02227984237098456, 0.048676612136607574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 126.85714285714285, 121, 135, 128.0, 135.0, 135.0, 135.0, 0.09170225587549453, 0.06814982101684701, 0.05149296594571226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5130f0cb-b8bc-4c5b-8ceb-996c718732e2", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 249.8, 116, 1429, 128.5, 370.0, 1376.0999999999992, 1429.0, 0.10443537017116956, 4.725297648964001, 0.060947829310830995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 965.7857142857143, 120, 1550, 1229.0, 1520.0, 1550.0, 1550.0, 0.10104728291073915, 64.95244067532064, 0.053202071108416515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24bf744f-45c8-4e36-a10e-694cb6f3b415", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 192.1, 116, 739, 125.5, 374.3, 720.8499999999997, 739.0, 0.10430954901766482, 1.5602324896863933, 0.060976265665990396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 727.2857142857143, 114, 1230, 934.5, 1169.0, 1230.0, 1230.0, 0.10104655359076145, 21.229954213280404, 0.05330036539155539], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 561.076923076923, 228, 1376, 451.0, 1175.9999999999998, 1376.0, 1376.0, 0.07735148514851485, 0.01397463354733911, 0.053330223159034656], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 270.7692307692307, 246, 489, 252.0, 396.9999999999999, 489.0, 489.0, 0.08259684480052862, 0.12800897724456928, 0.1857622398199389], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca26cacb-586f-43a9-abb7-1bb2071f7bfb", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 544.7727272727271, 182, 1070, 518.5, 994.3, 1059.4999999999998, 1070.0, 0.09400865734271711, 0.057745552215399475, 0.042505867528982444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 123.35714285714286, 117, 133, 123.0, 130.5, 133.0, 133.0, 0.10105165905170237, 0.07509796146322802, 0.05072319604743653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 234.49999999999997, 120, 475, 126.5, 428.5, 475.0, 475.0, 0.10104947093384146, 0.13544689128520493, 0.051567935920199794], "isController": false}, {"data": ["login", 22, 0, 0.0, 2762.909090909091, 1574, 4936, 2740.5, 3917.6, 4787.649999999998, 4936.0, 0.09411603651702218, 35.952856521973956, 0.19165781655073283], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f69f2fe8-8466-4e87-9c48-8d94d3cee85d", 3, 0, 0.0, 317.0, 237, 421, 293.0, 421.0, 421.0, 421.0, 0.03046365685736916, 0.025098800620443146, 0.0195356132841853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 130.55, 123, 168, 129.0, 136.8, 166.45, 168.0, 0.10083694665725522, 0.08163459841685994, 0.03584438338207119], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0dc6256-fd88-46da-99df-5c1967f0c091", 1, 0, 0.0, 876.0, 876, 876, 876.0, 876.0, 876.0, 876.0, 1.141552511415525, 0.2062375142694064, 0.787046946347032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=977d495d-36ba-4ed0-983e-6ea40a0871ee", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf8b0597-75cf-402f-811d-722d59ff690c", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1093.3571428571427, 239, 1684, 1361.0, 1651.0, 1684.0, 1684.0, 0.10095692744802522, 86.31583495886005, 0.2086039414666157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=359ada81-4a54-416c-a6da-e1ac882bab45", 1, 0, 0.0, 853.0, 853, 853, 853.0, 853.0, 853.0, 853.0, 1.1723329425556857, 0.21179843200468934, 0.8082686107854631], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5dc47a2-d609-4dd8-8ce5-9f80aa8540e4", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 442.764705882353, 240, 1545, 268.0, 908.9999999999994, 1545.0, 1545.0, 0.08254310449471482, 5.92923886153637, 0.18439905736988535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 0, 0.0, 1447.7142857142858, 1318, 1508, 1463.0, 1508.0, 1508.0, 1508.0, 0.09019921140118031, 107.90961515540036, 0.20338865148957555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3b8c14b-9025-442e-be35-5be4c7edc527", 3, 0, 0.0, 461.6666666666667, 236, 674, 475.0, 674.0, 674.0, 674.0, 0.06232730143560551, 0.028201480792803272, 0.03996900515239025], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1061.652173913044, 259, 2018, 1118.0, 1851.0000000000002, 1998.1999999999998, 2018.0, 0.09575712662006487, 0.029875312771919012, 0.04320292236178708], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5130f0cb-b8bc-4c5b-8ceb-996c718732e2", 3, 0, 0.0, 340.0, 221, 453, 346.0, 453.0, 453.0, 453.0, 0.03160855959793912, 0.03170116279988621, 0.020269811981751325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 438.95000000000005, 236, 1802, 256.0, 747.9, 1749.2999999999993, 1802.0, 0.10423833051889841, 6.388735720977443, 0.23310093071799362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 178.33333333333334, 124, 379, 132.0, 372.4, 379.0, 379.0, 0.09994536320144988, 0.07759430053237563, 0.035527453325515386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a7b6dbc-fc45-40bc-a825-4d6efd678fea", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.555366847826087, 1.0377038043478262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 579.8666666666667, 244, 1918, 500.0, 1603.6000000000001, 1918.0, 1918.0, 0.07521700104802355, 12.099119827890965, 0.1665988016051308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 174.9, 121, 383, 127.5, 380.5, 383.0, 383.0, 0.053418518063471886, 0.0396987228967794, 0.02681359207482866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 173.1, 119, 376, 124.5, 376.0, 376.0, 376.0, 0.05341965950309033, 0.022317314780685587, 0.030017257888748216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 300.0, 118, 1150, 126.0, 1072.5000000000002, 1150.0, 1150.0, 0.053418803418803416, 4.819591554821048, 0.03094534588675214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 233.1, 122, 954, 127.0, 895.3000000000002, 954.0, 954.0, 0.053417947361954675, 1.583623042232229, 0.030997015939915492], "isController": false}, {"data": ["https://demoqa.com/books", 51, 0, 0.0, 1485.666666666667, 951, 2423, 1426.0, 2058.2000000000003, 2364.7999999999997, 2423.0, 0.2303387786624995, 275.56525799636876, 0.45482911177302143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b060700b-0937-454c-92c8-59b36fdbe2a5", 3, 0, 0.0, 328.0, 220, 536, 228.0, 536.0, 536.0, 536.0, 0.03871867014274283, 0.024892374196587595, 0.024829355527735474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1061.652173913044, 259, 2018, 1118.0, 1851.0000000000002, 1998.1999999999998, 2018.0, 0.09420901293530709, 0.029392316026181912, 0.04250445700792175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 250.0, 125, 375, 250.0, 375.0, 375.0, 375.0, 0.03490848159741212, 0.009408926680552486, 0.020556459378163583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 205.33333333333334, 121, 377, 126.5, 377.0, 377.0, 377.0, 0.03486081818340277, 0.009396079900995277, 0.020494348189852015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 139.66666666666666, 119, 374, 123.0, 225.80000000000007, 374.0, 374.0, 0.09564008722375955, 0.025777992259528943, 0.056225910653030516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 124.73333333333333, 120, 131, 125.0, 128.6, 131.0, 131.0, 0.09568706502255026, 0.025790654244359248, 0.056346972859958794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 244.0, 121, 382, 238.0, 382.0, 382.0, 382.0, 0.03486081818340277, 0.009327992365480818, 0.01988156037022189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 127.8, 121, 138, 127.0, 137.4, 138.0, 138.0, 0.09568462348100659, 0.07110937350492777, 0.04802919577073965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 166.0, 122, 363, 126.5, 363.0, 363.0, 363.0, 0.034860210555671754, 0.0259068556961584, 0.01749819162657742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 157.26666666666668, 119, 375, 125.0, 374.4, 375.0, 375.0, 0.09563947742589535, 0.025591032045600905, 0.05454438946945594], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 474.0, 421, 580, 453.0, 568.8, 580.0, 580.0, 0.07743165167669308, 0.013989116757996307, 0.05270494259634285], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 131.33333333333334, 123, 147, 129.5, 147.0, 147.0, 147.0, 0.036512563364511, 0.028739380929488155, 0.012979075258478521], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1507.318181818182, 999, 2710, 1343.5, 2545.3999999999996, 2709.7, 2710.0, 0.09374067919383015, 0.048518124973369124, 0.043117050683880866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 457.6666666666667, 252, 739, 494.0, 739.0, 739.0, 739.0, 0.03478724699525154, 0.053913438458461124, 0.07823733381842217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65d61361-5a6b-4af2-abdb-50b2b877c3fd", 1, 0, 0.0, 1376.0, 1376, 1376, 1376.0, 1376.0, 1376.0, 1376.0, 0.7267441860465116, 0.13129655704941862, 0.5010560501453489], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 1224.9830508474577, 623, 3452, 972.0, 2163.0, 2406.0, 3452.0, 0.26618062385519775, 82.00498704484241, 0.9674292830830935], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c5fa799-cc64-4a2c-8372-9ce12b004be9", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=470df27a-c698-4b1d-a4dc-161d7e458c31", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books-0", 51, 0, 0.0, 253.9803921568627, 119, 510, 131.0, 499.40000000000003, 507.8, 510.0, 0.23190778255234978, 0.17234552980697088, 0.11210385972989564], "isController": false}, {"data": ["https://demoqa.com/books-3", 51, 0, 0.0, 773.8235294117648, 569, 1113, 735.0, 983.2, 1070.2, 1113.0, 0.23170864682150258, 68.13003561668575, 0.11653315733698615], "isController": false}, {"data": ["https://demoqa.com/books-1", 51, 0, 0.0, 208.62745098039218, 119, 389, 132.0, 379.40000000000003, 383.6, 389.0, 0.23209352914139045, 0.4106967527384761, 0.11287361085196529], "isController": false}, {"data": ["https://demoqa.com/books-2", 51, 0, 0.0, 1229.980392156862, 829, 1915, 1230.0, 1605.8, 1847.0, 1915.0, 0.2308956487488625, 207.76031061548406, 0.11589879243839388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 130.46666666666667, 123, 138, 131.0, 137.4, 138.0, 138.0, 0.07673615551860852, 0.05732730368333547, 0.027277305282005372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 11, 6.508875739644971, 200.50887573964502, 118, 1906, 133.0, 289.0, 399.0, 1376.8000000000086, 0.6802638940881445, 1.424848921791791, 0.32942420592272365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 130.3, 123, 139, 130.0, 138.6, 139.0, 139.0, 0.0522444202959124, 0.040458813764314976, 0.018571258777062612], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 127.76470588235294, 122, 138, 126.0, 137.2, 138.0, 138.0, 0.08329209558012945, 0.06759348772176521, 0.02960773710074914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f69f2fe8-8466-4e87-9c48-8d94d3cee85d", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65d61361-5a6b-4af2-abdb-50b2b877c3fd", 3, 0, 0.0, 366.0, 262, 435, 401.0, 435.0, 435.0, 435.0, 0.023651285447364064, 0.027955018704224906, 0.015167002712014065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c5fa799-cc64-4a2c-8372-9ce12b004be9", 3, 0, 0.0, 300.6666666666667, 210, 430, 262.0, 430.0, 430.0, 430.0, 0.01719463756569784, 0.023704195993076292, 0.011026509116023682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0dc6256-fd88-46da-99df-5c1967f0c091", 3, 0, 0.0, 371.0, 312, 480, 321.0, 480.0, 480.0, 480.0, 0.022430409654048314, 0.026511984848258275, 0.014384084315909889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 478.8, 249, 1282, 258.0, 1229.8000000000002, 1282.0, 1282.0, 0.0533825876675546, 6.46087269020216, 0.11869284726707842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 287.79999999999995, 247, 505, 254.0, 503.8, 505.0, 505.0, 0.09556087865042558, 0.14810069767404824, 0.21491865579290048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca26cacb-586f-43a9-abb7-1bb2071f7bfb", 3, 0, 0.0, 345.3333333333333, 227, 580, 229.0, 580.0, 580.0, 580.0, 0.025027947875127222, 0.02510127194116764, 0.01604982334440125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 133.07692307692307, 124, 144, 132.0, 144.0, 144.0, 144.0, 0.08342210300704596, 0.06916539595017775, 0.029653950678285867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 144.14285714285717, 118, 361, 127.5, 249.0, 361.0, 361.0, 0.10532888945733052, 0.0817738936704861, 0.03744112867428546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 140.93333333333334, 117, 388, 123.0, 232.60000000000008, 388.0, 388.0, 0.07536325086918949, 0.05600725967915352, 0.037828819283948635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 270.06666666666666, 118, 388, 358.0, 381.4, 388.0, 388.0, 0.0752751306023516, 0.03521660732477204, 0.04208742328209606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 376.6, 116, 1530, 121.0, 1370.4, 1530.0, 1530.0, 0.07526455491051044, 9.047338504217324, 0.04338491986833721], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/359ada81-4a54-416c-a6da-e1ac882bab45", 3, 0, 0.0, 282.0, 208, 430, 208.0, 430.0, 430.0, 430.0, 0.0298109982709621, 0.024852202660134746, 0.01911707896933442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 302.0, 120, 1066, 124.0, 1015.6, 1066.0, 1066.0, 0.07536362951239732, 2.97219239078554, 0.04351562696259452], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 42.10526315789474, 0.6384676775738228], "isController": false}, {"data": ["401/Unauthorized", 11, 57.89473684210526, 0.8778930566640064], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1253, 19, "401/Unauthorized", 11, "406/Not Acceptable", 8, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
