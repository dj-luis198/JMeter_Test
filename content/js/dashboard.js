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

    var data = {"OkPercent": 99.15188897455667, "KoPercent": 0.8481110254433307};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8044914134742405, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.07407407407407407, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9786e4e2-b331-43d9-87f4-b511d4325bdf"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/82dddb21-8158-4cd7-97ad-7f6a234132d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0743f1ed-2e97-4a04-ae5a-10bbadff8cba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a31dd48-960c-492e-b55e-f48b4342efd5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b025f39c-4919-45de-aa33-b7b5c73acd35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d2d1345-a1b7-4963-9b75-6d21eb9a720c"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8be0f2ae-6925-413a-bbcd-ec6168237a3d"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d2d1345-a1b7-4963-9b75-6d21eb9a720c"], "isController": false}, {"data": [0.9130434782608695, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e98cc9b1-7d91-4df5-9450-bffd17e758ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7006641c-76fa-4b55-8351-fecfbac76121"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f24ef79c-a599-4616-86c4-8a9fae368cfe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a31dd48-960c-492e-b55e-f48b4342efd5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78c98ec1-16ef-4de1-bcb9-7eac716ccf71"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7faa89b4-f5ce-4286-a424-441a3b0c9b59"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/72480582-0bc0-4d1a-a35e-f5ae8d534a6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d530f25c-6159-4629-981f-2775c86fbd31"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=210bb04a-f644-4dc2-b07b-c34a9d987994"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9b93640-2863-4475-bd57-f3240fefa920"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35af58a0-51fd-4847-9f2e-f3c486a5f4e5"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82dddb21-8158-4cd7-97ad-7f6a234132d9"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b025f39c-4919-45de-aa33-b7b5c73acd35"], "isController": false}, {"data": [0.3416666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0743f1ed-2e97-4a04-ae5a-10bbadff8cba"], "isController": false}, {"data": [0.6111111111111112, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.48148148148148145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7006641c-76fa-4b55-8351-fecfbac76121"], "isController": false}, {"data": [0.9597701149425287, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f24ef79c-a599-4616-86c4-8a9fae368cfe"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/051e2bc6-8df6-44fc-8a17-f52e58e2cac7"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e98cc9b1-7d91-4df5-9450-bffd17e758ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7faa89b4-f5ce-4286-a424-441a3b0c9b59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d530f25c-6159-4629-981f-2775c86fbd31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72480582-0bc0-4d1a-a35e-f5ae8d534a6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35af58a0-51fd-4847-9f2e-f3c486a5f4e5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/210bb04a-f644-4dc2-b07b-c34a9d987994"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9b93640-2863-4475-bd57-f3240fefa920"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1297, 11, 0.8481110254433307, 350.0200462606016, 92, 1968, 110.0, 995.2, 1197.0, 1577.3799999999997, 5.063320788894267, 713.1668810644197, 3.6887159338450006], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1730.2962962962965, 1264, 2381, 1700.0, 2093.0, 2234.75, 2381.0, 0.24132029012061545, 290.3889542270712, 1.1865699812082997], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9786e4e2-b331-43d9-87f4-b511d4325bdf", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 644.5714285714286, 430, 1255, 547.5, 1242.5, 1255.0, 1255.0, 0.07612170773614041, 0.013752456964048806, 0.05173897322690794], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 644.5714285714286, 430, 1255, 547.5, 1242.5, 1255.0, 1255.0, 0.0770157497208179, 0.013913978221046203, 0.05234664238836842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82dddb21-8158-4cd7-97ad-7f6a234132d9", 3, 0, 0.0, 324.6666666666667, 211, 429, 334.0, 429.0, 429.0, 429.0, 0.021664247492363353, 0.029865914104869398, 0.01389276287758978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 162.89473684210523, 96, 302, 101.0, 302.0, 302.0, 302.0, 0.1108615106339528, 0.038427735799515715, 0.0627356718791026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 137.10526315789477, 98, 354, 102.0, 332.0, 354.0, 354.0, 0.1107084173357728, 0.08227451718019833, 0.05557043604549533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 194.05263157894734, 96, 792, 101.0, 405.0, 792.0, 792.0, 0.11086086378117233, 1.7439275414853022, 0.06478089845436617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 172.21052631578948, 96, 900, 101.0, 301.0, 900.0, 900.0, 0.11085762963049402, 5.27830119616841, 0.06467074919336488], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 258.85714285714283, 196, 410, 213.5, 407.0, 410.0, 410.0, 0.07633129964942124, 0.1711277881370256, 0.04934699254679381], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0743f1ed-2e97-4a04-ae5a-10bbadff8cba", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a31dd48-960c-492e-b55e-f48b4342efd5", 3, 0, 0.0, 280.6666666666667, 205, 428, 209.0, 428.0, 428.0, 428.0, 0.023270606121720782, 0.023338781725593012, 0.014922882180921205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 101.14285714285714, 98, 104, 102.0, 104.0, 104.0, 104.0, 0.13010426927866478, 0.09668881730572645, 0.06530624454026727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 114.0, 98, 289, 101.0, 196.0, 289.0, 289.0, 0.13010668748373666, 0.048771856761830414, 0.07342097528902271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 706.4, 598, 838, 697.0, 838.0, 838.0, 838.0, 0.09546357110126776, 28.069459592656944, 0.05444406789369177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1033.0, 790, 1151, 1098.0, 1151.0, 1151.0, 1151.0, 0.09446617166392715, 85.00082731701902, 0.053782986406317894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 182.6, 101, 305, 103.0, 305.0, 305.0, 305.0, 0.0963743952506698, 0.17053750409591178, 0.05336355674524392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 115.14285714285714, 97, 290, 103.0, 197.0, 290.0, 290.0, 0.07790632321107605, 0.05789717965198132, 0.03910532239305966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 142.35714285714286, 96, 300, 101.5, 297.5, 300.0, 300.0, 0.07790719027718265, 0.029204327605299917, 0.043964088263281784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 229.00000000000003, 96, 1102, 103.0, 702.0, 1102.0, 1102.0, 0.07782101167315175, 5.02115433053085, 0.04527254724847137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 180.1428571428571, 97, 802, 102.0, 552.5, 802.0, 802.0, 0.07790762381747357, 1.6557435134947136, 0.04539901572064552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b025f39c-4919-45de-aa33-b7b5c73acd35", 3, 0, 0.0, 449.66666666666663, 234, 711, 404.0, 711.0, 711.0, 711.0, 0.02561650385955325, 0.025691552210704283, 0.016427250196393198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 102.0, 101, 103, 102.0, 103.0, 103.0, 103.0, 0.09637625289128758, 0.07162336762721665, 0.054117524816885115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d2d1345-a1b7-4963-9b75-6d21eb9a720c", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 655.6111111111111, 97, 1516, 877.0, 1399.0000000000002, 1516.0, 1516.0, 0.08414871883575573, 42.07517205198988, 0.04545272595099739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 182.21428571428575, 95, 1052, 101.0, 677.0, 1052.0, 1052.0, 0.1301054783699642, 8.394643966939269, 0.0756891524557409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 471.44444444444434, 96, 913, 597.0, 906.7, 913.0, 913.0, 0.08414832544832357, 13.755858973250183, 0.0455346895628027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 178.6428571428571, 94, 810, 101.5, 558.0, 810.0, 810.0, 0.1301054783699642, 2.765086282003624, 0.07581620858696157], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 501.92857142857144, 201, 1047, 458.0, 997.5, 1047.0, 1047.0, 0.07714731279377973, 0.013937746940282469, 0.05318945589102391], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8be0f2ae-6925-413a-bbcd-ec6168237a3d", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.6897104481641468, 1.28872502699784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 361.2857142857142, 201, 1204, 210.5, 899.5, 1204.0, 1204.0, 0.07777518527160206, 6.758080937232648, 0.17349682093930202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d2d1345-a1b7-4963-9b75-6d21eb9a720c", 3, 0, 0.0, 280.6666666666667, 195, 450, 197.0, 450.0, 450.0, 450.0, 0.019152318388140882, 0.026403017048755417, 0.0122819229246867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 425.82608695652175, 111, 940, 400.0, 891.8000000000001, 933.3999999999999, 940.0, 0.09541588881974694, 0.05860995514416096, 0.0431421450425223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 101.77777777777777, 92, 119, 102.0, 104.60000000000002, 119.0, 119.0, 0.08414793206456951, 0.0625357190440795, 0.04223831746209837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 191.7222222222222, 96, 402, 102.0, 313.8000000000001, 402.0, 402.0, 0.08414832544832357, 0.092731162462367, 0.0440646504572059], "isController": false}, {"data": ["login", 23, 0, 0.0, 2028.4347826086957, 1214, 3800, 1895.0, 2998.0, 3651.199999999998, 3800.0, 0.09525979001428897, 24.906370207241817, 0.17806607741928804], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e98cc9b1-7d91-4df5-9450-bffd17e758ae", 3, 0, 0.0, 532.0, 230, 949, 417.0, 949.0, 949.0, 949.0, 0.055151114052503857, 0.03545685229612471, 0.03536708811309655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7006641c-76fa-4b55-8351-fecfbac76121", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f24ef79c-a599-4616-86c4-8a9fae368cfe", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a31dd48-960c-492e-b55e-f48b4342efd5", 1, 0, 0.0, 641.0, 641, 641, 641.0, 641.0, 641.0, 641.0, 1.5600624024960998, 0.28184721138845553, 1.0755898985959438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 117.35714285714285, 99, 302, 103.0, 206.0, 302.0, 302.0, 0.12816170345212702, 0.10375591031427081, 0.04555748052399828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78c98ec1-16ef-4de1-bcb9-7eac716ccf71", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7faa89b4-f5ce-4286-a424-441a3b0c9b59", 3, 0, 0.0, 613.3333333333334, 212, 1192, 436.0, 1192.0, 1192.0, 1192.0, 0.07048044167743452, 0.03184467872665336, 0.04519741865382357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 761.6666666666666, 199, 1620, 1000.0, 1501.2000000000003, 1620.0, 1620.0, 0.08410743322804329, 55.95889482832738, 0.17720421343195708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72480582-0bc0-4d1a-a35e-f5ae8d534a6b", 3, 0, 0.0, 610.3333333333334, 208, 1112, 511.0, 1112.0, 1112.0, 1112.0, 0.018857724752649508, 0.022289192245074987, 0.012093007084218598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d530f25c-6159-4629-981f-2775c86fbd31", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.889970751231527, 3.3963208128078817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=210bb04a-f644-4dc2-b07b-c34a9d987994", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 370.68421052631584, 200, 1003, 206.0, 707.0, 1003.0, 1003.0, 0.11064201484932304, 7.1290967571698936, 0.24734654789634591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1135.2, 892, 1252, 1201.0, 1252.0, 1252.0, 1252.0, 0.09428447511832701, 112.79701082857197, 0.2126004424298995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9b93640-2863-4475-bd57-f3240fefa920", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35af58a0-51fd-4847-9f2e-f3c486a5f4e5", 3, 0, 0.0, 329.0, 218, 451, 318.0, 451.0, 451.0, 451.0, 0.019370960347644166, 0.02669182133840422, 0.01242213277501921], "isController": false}, {"data": ["register", 24, 6, 25.0, 757.3333333333333, 216, 1441, 745.5, 1139.0, 1367.5, 1441.0, 0.09594665366056473, 0.030264422980822662, 0.0432884316320126], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82dddb21-8158-4cd7-97ad-7f6a234132d9", 1, 0, 0.0, 948.0, 948, 948, 948.0, 948.0, 948.0, 948.0, 1.0548523206751055, 0.1905739055907173, 0.7272712289029536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 327.50000000000006, 200, 1156, 205.0, 781.5, 1156.0, 1156.0, 0.12997985312276597, 11.294275475470945, 0.28995226722000944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 118.6923076923077, 100, 307, 103.0, 228.59999999999994, 307.0, 307.0, 0.07146351787412526, 0.055481930380790606, 0.025403047369317963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 333.42105263157896, 196, 1097, 208.0, 408.0, 1097.0, 1097.0, 0.10350105952400408, 6.6689771405653335, 0.23138253412811252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 100.99999999999999, 98, 103, 101.5, 103.0, 103.0, 103.0, 0.05653923351645763, 0.042017926470726816, 0.028380044948690647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 132.66666666666666, 96, 303, 99.0, 302.4, 303.0, 303.0, 0.05654003269898558, 0.022205582503686882, 0.031849780789581554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 190.83333333333334, 97, 989, 101.5, 782.6000000000007, 989.0, 989.0, 0.05653896712730219, 4.253457600780709, 0.032833827264032264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 173.91666666666666, 98, 775, 101.5, 632.8000000000005, 775.0, 775.0, 0.05653923351645763, 1.3993368271831212, 0.03288919605921543], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1229.1481481481483, 777, 1968, 1197.0, 1682.5, 1822.0, 1968.0, 0.2336084722005918, 279.4769481973213, 0.4612854792867154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 757.3333333333333, 216, 1441, 745.5, 1139.0, 1367.5, 1441.0, 0.09970669613553464, 0.03145045200368915, 0.04498485704552442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 140.8, 99, 297, 102.0, 297.0, 297.0, 297.0, 0.037502906475251827, 0.01010820526090772, 0.022084231059157085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 140.2, 98, 299, 101.0, 299.0, 299.0, 299.0, 0.03750262518376286, 0.010108129444061083, 0.02204744175842309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 275.69230769230774, 96, 1187, 102.0, 1154.2, 1187.0, 1187.0, 0.0729235032450959, 10.111507661876153, 0.04190691104454504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 242.69230769230768, 95, 797, 101.0, 785.0, 797.0, 797.0, 0.07284096575914295, 3.3116374649102656, 0.041930613026766254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 100.2, 97, 103, 101.0, 103.0, 103.0, 103.0, 0.037503469070889056, 0.010035107934983986, 0.021388697204491415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 100.00000000000001, 97, 103, 101.0, 102.6, 103.0, 103.0, 0.07292227607251839, 0.05419321493279932, 0.03660356435671334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 139.0, 99, 290, 102.0, 290.0, 290.0, 290.0, 0.03750206261344374, 0.027870185203936217, 0.018824277522763753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 129.6153846153846, 96, 303, 100.0, 297.4, 303.0, 303.0, 0.07284463919489864, 0.036323821737961025, 0.04060300652239693], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 486.92857142857144, 417, 711, 450.5, 686.0, 711.0, 711.0, 0.07606380666753597, 0.013741996321771633, 0.051773899655539614], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 105.6, 103, 113, 104.0, 113.0, 113.0, 113.0, 0.03982413661271824, 0.03134595127915127, 0.014156236061552184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1058.1304347826087, 777, 1889, 869.0, 1757.6000000000004, 1886.8, 1889.0, 0.09564204923486361, 0.04950223251413839, 0.043991606630489025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 281.4, 202, 590, 205.0, 590.0, 590.0, 590.0, 0.03747339389033786, 0.05807644150777948, 0.08427854114203916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b025f39c-4919-45de-aa33-b7b5c73acd35", 1, 0, 0.0, 748.0, 748, 748, 748.0, 748.0, 748.0, 748.0, 1.3368983957219251, 0.2415294953208556, 0.9217287767379679], "isController": false}, {"data": ["addBook", 60, 5, 8.333333333333334, 1038.8500000000001, 518, 2613, 822.0, 1706.2, 1935.4499999999994, 2613.0, 0.29178905596514093, 100.03070243959968, 1.0594735243984283], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 191.27777777777774, 97, 676, 103.0, 407.5, 411.25, 676.0, 0.2343170309428657, 0.1741359966284383, 0.11326848663742044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0743f1ed-2e97-4a04-ae5a-10bbadff8cba", 3, 0, 0.0, 280.3333333333333, 196, 429, 216.0, 429.0, 429.0, 429.0, 0.10853049706967657, 0.0491072236090008, 0.06959800756095796], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 645.3333333333333, 476, 1009, 600.5, 801.0, 850.25, 1009.0, 0.23454296696853213, 68.96341984819857, 0.11795862108280669], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 150.61111111111111, 97, 409, 102.0, 302.5, 304.25, 409.0, 0.2347519888710168, 0.41540098030691647, 0.11416649458766248], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1036.1851851851857, 672, 1689, 1029.0, 1301.0, 1425.5, 1689.0, 0.23433126630012627, 210.85168532728267, 0.11762331140455556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 112.73684210526315, 98, 292, 103.0, 109.0, 292.0, 292.0, 0.10312187920628718, 0.07703929452422822, 0.036656605499109894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7006641c-76fa-4b55-8351-fecfbac76121", 3, 0, 0.0, 287.6666666666667, 198, 465, 200.0, 465.0, 465.0, 465.0, 0.03452919443389386, 0.028785568667058, 0.022142745128506152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 5, 2.8735632183908044, 161.52298850574718, 94, 1533, 104.0, 235.0, 318.0, 1071.0, 0.7222374417851717, 1.5287107867095857, 0.349428410288978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 104.16666666666667, 102, 107, 104.0, 106.7, 107.0, 107.0, 0.057946380282778334, 0.04487449176195627, 0.020598127366143863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 136.31578947368422, 100, 333, 104.0, 304.0, 333.0, 333.0, 0.10635856270397054, 0.08631246641308547, 0.037807145336177024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f24ef79c-a599-4616-86c4-8a9fae368cfe", 3, 0, 0.0, 280.3333333333333, 199, 427, 215.0, 427.0, 427.0, 427.0, 0.08269018743109151, 0.03660763506063947, 0.05302723608048512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 310.91666666666663, 202, 1092, 204.5, 885.6000000000007, 1092.0, 1092.0, 0.05651180861334149, 5.714264559149027, 0.12589145906425864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/051e2bc6-8df6-44fc-8a17-f52e58e2cac7", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 1.02680365755627, 1.9185842041800643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 417.0, 199, 1289, 205.0, 1256.6, 1289.0, 1289.0, 0.07280058240465924, 13.49466967610741, 0.16086456816654535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e98cc9b1-7d91-4df5-9450-bffd17e758ae", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7faa89b4-f5ce-4286-a424-441a3b0c9b59", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 0.8770100121359223, 3.3468598300970878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d530f25c-6159-4629-981f-2775c86fbd31", 3, 0, 0.0, 350.3333333333333, 204, 453, 394.0, 453.0, 453.0, 453.0, 0.05845902022682099, 0.027136250925601155, 0.03748836909076737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 130.78571428571428, 101, 306, 103.0, 298.5, 306.0, 306.0, 0.07953596445878616, 0.06594339240772408, 0.028272549866209147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72480582-0bc0-4d1a-a35e-f5ae8d534a6b", 1, 0, 0.0, 1047.0, 1047, 1047, 1047.0, 1047.0, 1047.0, 1047.0, 0.9551098376313276, 0.17255402340019102, 0.6585034622731615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 137.2777777777778, 94, 334, 103.5, 310.6, 334.0, 334.0, 0.08628127696289906, 0.06698595232959448, 0.030670297670405522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35af58a0-51fd-4847-9f2e-f3c486a5f4e5", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/210bb04a-f644-4dc2-b07b-c34a9d987994", 3, 0, 0.0, 387.0, 202, 549, 410.0, 549.0, 549.0, 549.0, 0.02286341396497325, 0.027023781284771443, 0.014661759606444435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 100.89473684210526, 96, 103, 101.0, 103.0, 103.0, 103.0, 0.10355916498610127, 0.07696144976017878, 0.05198184648716411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 153.31578947368422, 96, 304, 101.0, 302.0, 304.0, 304.0, 0.10356085835599863, 0.0358971231883663, 0.058604289190971666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 198.52631578947367, 94, 996, 101.0, 304.0, 996.0, 996.0, 0.10356029389321297, 4.9308507222649185, 0.060413719967514774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 198.36842105263156, 94, 805, 102.0, 305.0, 805.0, 805.0, 0.10356085835599863, 1.629092783034551, 0.06051518290755285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9b93640-2863-4475-bd57-f3240fefa920", 3, 0, 0.0, 355.0, 201, 661, 203.0, 661.0, 661.0, 661.0, 0.024291104597496397, 0.024362269942996874, 0.015577303403993457], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 54.54545454545455, 0.4626060138781804], "isController": false}, {"data": ["401/Unauthorized", 5, 45.45454545454545, 0.3855050115651503], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1297, 11, "406/Not Acceptable", 6, "401/Unauthorized", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
