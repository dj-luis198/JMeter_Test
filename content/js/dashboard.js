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

    var data = {"OkPercent": 99.10380881254667, "KoPercent": 0.8961911874533234};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8096919127086007, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3559322033898305, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9e27c11c-c775-4e72-b1ea-66290d1a322e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88675735-d0de-4dfd-8db5-615b76775b00"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76a848f6-ff40-465e-8dbb-c497b54f8bda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c2c91c8-8a15-438f-b457-452fbac7b466"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab9130af-f619-46a4-b35f-66fe13e4809d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c2fd7fd-c8fc-4d86-9484-5b0880bf4db2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/932c9477-0209-4700-98ec-2becdfc09b9b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af59efbb-47d8-4527-a7f6-053851344e41"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43a6624f-9d96-474b-be80-ca64fc5dcc74"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76e68e62-f340-4bfa-ade6-678912378666"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bc76b8d-1394-45a7-a3bc-8354b0ad0bd3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=341f95c3-c099-4f2f-a5c3-022a79977cea"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1cce857b-d177-4985-81b2-b73ee1fac193"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c2c91c8-8a15-438f-b457-452fbac7b466"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31df20bf-9f98-4dcb-8f29-056b0b6382e4"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/76a848f6-ff40-465e-8dbb-c497b54f8bda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0c2fd7fd-c8fc-4d86-9484-5b0880bf4db2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69c69a2e-bf63-47a1-b3db-1ea6f54b75e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31df20bf-9f98-4dcb-8f29-056b0b6382e4"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1cce857b-d177-4985-81b2-b73ee1fac193"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af59efbb-47d8-4527-a7f6-053851344e41"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf8b0b52-d1a4-4bb2-80c6-acf906fed6ea"], "isController": false}, {"data": [0.3983050847457627, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab9130af-f619-46a4-b35f-66fe13e4809d"], "isController": false}, {"data": [0.8305084745762712, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e27c11c-c775-4e72-b1ea-66290d1a322e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3bc76b8d-1394-45a7-a3bc-8354b0ad0bd3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9689265536723164, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43a6624f-9d96-474b-be80-ca64fc5dcc74"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/341f95c3-c099-4f2f-a5c3-022a79977cea"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7d50c73d-a6af-467f-9eca-5cb5e8a5f0d0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf8b0b52-d1a4-4bb2-80c6-acf906fed6ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/88675735-d0de-4dfd-8db5-615b76775b00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1339, 12, 0.8961911874533234, 326.9387602688563, 79, 3184, 106.0, 890.0, 1110.0, 1787.9999999999986, 5.272857581652504, 757.2186297707744, 3.8513692656689322], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1369.5593220338983, 992, 1723, 1344.0, 1664.0, 1707.0, 1723.0, 0.2738365427904408, 329.5163965794219, 1.3464521415526067], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9e27c11c-c775-4e72-b1ea-66290d1a322e", 3, 0, 0.0, 1234.3333333333333, 214, 2463, 1026.0, 2463.0, 2463.0, 2463.0, 0.030070063247366365, 0.02506817447151864, 0.019283211131937414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88675735-d0de-4dfd-8db5-615b76775b00", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 681.4666666666667, 86, 1293, 576.0, 1269.0, 1293.0, 1293.0, 0.08713989438644801, 0.016406808239948414, 0.058949911625623776], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 681.4666666666667, 86, 1293, 576.0, 1269.0, 1293.0, 1293.0, 0.08988279283813908, 0.016923244589055874, 0.06080547528522807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76a848f6-ff40-465e-8dbb-c497b54f8bda", 1, 0, 0.0, 654.0, 654, 654, 654.0, 654.0, 654.0, 654.0, 1.529051987767584, 0.27624474388379205, 1.0542096712538225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 105.14285714285715, 80, 246, 81.5, 244.5, 246.0, 246.0, 0.11761147888033872, 0.044087896728720724, 0.0663697589384724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 85.57142857142857, 81, 106, 83.0, 100.5, 106.0, 106.0, 0.11761049085578433, 0.08740389017700378, 0.05903495341784487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 220.5, 82, 477, 241.5, 400.0, 477.0, 477.0, 0.11760851485647561, 2.499492682020178, 0.06853386810205059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 156.42857142857142, 80, 958, 82.0, 604.0, 958.0, 958.0, 0.11761246692149369, 7.588571966753476, 0.0684213151594069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c2c91c8-8a15-438f-b457-452fbac7b466", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 236.46666666666667, 84, 409, 205.0, 401.8, 409.0, 409.0, 0.08757027514580451, 0.19110958288818444, 0.056607113406425325], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab9130af-f619-46a4-b35f-66fe13e4809d", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 94.5, 81, 247, 83.0, 166.0, 247.0, 247.0, 0.07716559737196023, 0.057346698828185286, 0.03873351274334722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 93.64285714285714, 79, 249, 82.0, 167.0, 249.0, 249.0, 0.0771668733636489, 0.020648167286757613, 0.04400923246520601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 697.75, 637, 750, 702.0, 750.0, 750.0, 750.0, 0.09108505066605943, 26.78202920414437, 0.05194694295798702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 845.75, 714, 1011, 829.0, 1011.0, 1011.0, 1011.0, 0.09068649678062936, 81.59986921306793, 0.05163108166319035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 82.25, 81, 83, 82.5, 83.0, 83.0, 83.0, 0.0924898261191269, 0.16366363762486127, 0.05121262832963374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 85.26666666666667, 81, 96, 84.0, 94.2, 96.0, 96.0, 0.07532881025677081, 0.05598166465371346, 0.03781153171091815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 126.46666666666667, 81, 244, 83.0, 244.0, 244.0, 244.0, 0.07532994515979992, 0.02769944858480143, 0.04253984012474639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c2fd7fd-c8fc-4d86-9484-5b0880bf4db2", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 134.93333333333334, 80, 711, 82.0, 430.8000000000002, 711.0, 711.0, 0.07532881025677081, 4.537682962694662, 0.04385353003359665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 183.93333333333334, 81, 627, 91.0, 399.60000000000014, 627.0, 627.0, 0.07526682088001968, 1.494330605120151, 0.04389094496239168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 84.5, 81, 91, 83.0, 91.0, 91.0, 91.0, 0.09249196476056143, 0.06873670428006567, 0.05193640599347932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/932c9477-0209-4700-98ec-2becdfc09b9b", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af59efbb-47d8-4527-a7f6-053851344e41", 3, 0, 0.0, 349.0, 186, 526, 335.0, 526.0, 526.0, 526.0, 0.017609147365084583, 0.02427563121456159, 0.011292324319406454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 552.5000000000001, 81, 1135, 784.5, 1066.6000000000001, 1135.0, 1135.0, 0.09832250875343447, 49.16220388879178, 0.053108664124847736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 105.64285714285714, 80, 241, 83.0, 241.0, 241.0, 241.0, 0.0771677240482188, 0.020799113122371475, 0.045366181520534885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 370.22222222222223, 82, 713, 474.0, 667.1, 713.0, 713.0, 0.09832143461897713, 16.072759397890458, 0.05320410095972645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 94.57142857142857, 81, 245, 83.0, 165.5, 245.0, 245.0, 0.0771668733636489, 0.020798883836295988, 0.04544103968582058], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 536.4285714285713, 94, 1322, 523.5, 988.0, 1322.0, 1322.0, 0.08919015340706386, 0.016841360579863414, 0.06103826695568524], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43a6624f-9d96-474b-be80-ca64fc5dcc74", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 287.2, 165, 793, 322.0, 518.8000000000002, 793.0, 793.0, 0.07523473236497874, 6.109285580385803, 0.16792137562946394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76e68e62-f340-4bfa-ade6-678912378666", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bc76b8d-1394-45a7-a3bc-8354b0ad0bd3", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 632.4761904761905, 151, 1136, 679.0, 1101.0, 1135.5, 1136.0, 0.09734074359057555, 0.059792312225070345, 0.04401246511956688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 84.27777777777776, 81, 92, 84.0, 88.4, 92.0, 92.0, 0.09832143461897713, 0.07306895678226719, 0.04935275136147875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 158.22222222222223, 82, 345, 86.0, 332.40000000000003, 345.0, 345.0, 0.09832143461897713, 0.10834987955624259, 0.05148646305025864], "isController": false}, {"data": ["login", 21, 0, 0.0, 3148.523809523809, 2101, 5180, 2833.0, 4462.8, 5108.899999999999, 5180.0, 0.09523852715885332, 21.83496474190359, 0.17377576684021243], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 87.14285714285714, 82, 99, 86.5, 95.0, 99.0, 99.0, 0.08089586391004379, 0.06549088982561163, 0.02875595162427338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=341f95c3-c099-4f2f-a5c3-022a79977cea", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1cce857b-d177-4985-81b2-b73ee1fac193", 3, 0, 0.0, 497.66666666666663, 257, 827, 409.0, 827.0, 827.0, 827.0, 0.021763417146670922, 0.02572362228501371, 0.01395635800095759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c2c91c8-8a15-438f-b457-452fbac7b466", 3, 0, 0.0, 414.6666666666667, 381, 466, 397.0, 466.0, 466.0, 466.0, 0.06327912421692083, 0.028632155814296865, 0.040579386297960304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 647.3333333333333, 167, 1220, 872.5, 1150.7, 1220.0, 1220.0, 0.09827473247433938, 65.38477287617384, 0.20705300352151126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31df20bf-9f98-4dcb-8f29-056b0b6382e4", 3, 0, 0.0, 334.0, 197, 480, 325.0, 480.0, 480.0, 480.0, 0.025330563858351487, 0.029939868935440837, 0.016243883724268368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 354.07142857142856, 168, 1041, 326.5, 723.5, 1041.0, 1041.0, 0.11752558280097043, 10.212092687285411, 0.26216993149937456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 648.8333333333333, 84, 1103, 796.5, 1103.0, 1103.0, 1103.0, 0.10186930168593694, 81.25648620944328, 0.17563501184230632], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1348.772727272727, 341, 2474, 1302.5, 2105.8999999999996, 2447.8999999999996, 2474.0, 0.09380023108966022, 0.0298122183328288, 0.0423200261361553], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/76a848f6-ff40-465e-8dbb-c497b54f8bda", 3, 0, 0.0, 370.0, 212, 585, 313.0, 585.0, 585.0, 585.0, 0.0226218753534668, 0.02673829082305923, 0.014506866681747915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 213.35714285714286, 163, 497, 168.5, 411.0, 497.0, 497.0, 0.07713073659853452, 0.11953757713073661, 0.17346883436174315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 103.36842105263159, 83, 253, 88.0, 213.0, 253.0, 253.0, 0.10924248957884145, 0.08481228438982319, 0.0388322912174788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c2fd7fd-c8fc-4d86-9484-5b0880bf4db2", 3, 0, 0.0, 617.6666666666666, 187, 1145, 521.0, 1145.0, 1145.0, 1145.0, 0.04199974800151199, 0.027001791114253312, 0.0269334321494071], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69c69a2e-bf63-47a1-b3db-1ea6f54b75e6", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.0504471628289473, 1.9627621299342106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31df20bf-9f98-4dcb-8f29-056b0b6382e4", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 338.1, 163, 998, 176.5, 935.2000000000003, 995.55, 998.0, 0.10741830837647968, 19.417952007849593, 0.2374636959685909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 100.88888888888889, 81, 241, 84.0, 241.0, 241.0, 241.0, 0.04561396395483204, 0.03389865875940155, 0.0228960717507653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 118.22222222222223, 80, 242, 84.0, 242.0, 242.0, 242.0, 0.04561488869967157, 0.01981792690467502, 0.02558908144284961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 189.0, 79, 864, 85.0, 864.0, 864.0, 864.0, 0.04561280807650789, 4.571204167046774, 0.02637980328209495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 130.44444444444446, 81, 513, 82.0, 513.0, 513.0, 513.0, 0.04561327042080776, 1.5011299579090875, 0.026424614884623766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 3.137466755319149, 6.576213430851064], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 957.2881355932203, 638, 1372, 954.0, 1289.0, 1359.0, 1372.0, 0.25976884975233905, 310.7738545679692, 0.512942006053935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1348.772727272727, 341, 2474, 1302.5, 2105.8999999999996, 2447.8999999999996, 2474.0, 0.0901447232556996, 0.028650400324521003, 0.040670763812630094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 82.66666666666667, 80, 90, 82.0, 90.0, 90.0, 90.0, 0.05195314980402117, 0.014002997408115081, 0.030593505206860123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 101.0, 80, 246, 83.0, 246.0, 246.0, 246.0, 0.051953749617562675, 0.014003159076608691, 0.030543122333762433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 147.0526315789474, 80, 967, 82.0, 253.0, 967.0, 967.0, 0.10242863689048222, 4.8769687609504295, 0.059753547939297554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1cce857b-d177-4985-81b2-b73ee1fac193", 1, 0, 0.0, 1322.0, 1322, 1322, 1322.0, 1322.0, 1322.0, 1322.0, 0.7564296520423601, 0.13665965393343418, 0.5215227874432677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 120.6315789473684, 80, 636, 83.0, 251.0, 636.0, 636.0, 0.1024280847026351, 1.6112733731455124, 0.05985325323726657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 85.42105263157895, 80, 121, 83.0, 87.0, 121.0, 121.0, 0.10240545012585091, 0.0761040503376685, 0.051402735707702506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 101.44444444444444, 81, 245, 83.0, 245.0, 245.0, 245.0, 0.051951950218486816, 0.013901205429556042, 0.029628846608980762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 117.42105263157893, 81, 247, 83.0, 244.0, 247.0, 247.0, 0.10234091374276881, 0.03547425587382981, 0.057913931964837816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 102.44444444444444, 81, 243, 83.0, 243.0, 243.0, 243.0, 0.051953449709060684, 0.038609936746674976, 0.02607819643599335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 92.22222222222223, 86, 101, 93.0, 101.0, 101.0, 101.0, 0.05582676335035016, 0.04394176880896702, 0.019844669784694784], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 702.0714285714287, 86, 2078, 555.5, 1552.0, 2078.0, 2078.0, 0.0866690603835725, 0.016196038837025025, 0.05898646917986307], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1862.7142857142856, 1289, 3184, 1755.0, 3070.0, 3173.6, 3184.0, 0.09555313892061354, 0.04945621448039568, 0.043950711358993144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 206.22222222222223, 163, 491, 171.0, 491.0, 491.0, 491.0, 0.05192707131317794, 0.08047681852930995, 0.11678520042407109], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af59efbb-47d8-4527-a7f6-053851344e41", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf8b0b52-d1a4-4bb2-80c6-acf906fed6ea", 3, 0, 0.0, 478.66666666666663, 202, 906, 328.0, 906.0, 906.0, 906.0, 0.031669288179966004, 0.026401382496384424, 0.020308755766449558], "isController": false}, {"data": ["addBook", 59, 4, 6.779661016949152, 941.8983050847459, 443, 2280, 752.0, 1624.0, 1651.0, 2280.0, 0.27580661748894436, 96.14084292082714, 1.0011730911494123], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 158.1525423728814, 80, 427, 86.0, 330.0, 340.0, 427.0, 0.2605891965902566, 0.19366052598162625, 0.12596841046111037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab9130af-f619-46a4-b35f-66fe13e4809d", 3, 0, 0.0, 474.0, 205, 780, 437.0, 780.0, 780.0, 780.0, 0.025173909759924815, 0.029754709094494465, 0.01614342520411845], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 508.77966101694904, 395, 738, 480.0, 644.0, 670.0, 738.0, 0.26027536251064265, 76.52959853352479, 0.13090020673142672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e27c11c-c775-4e72-b1ea-66290d1a322e", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 150.71186440677963, 81, 343, 88.0, 256.0, 262.0, 343.0, 0.2607342984921603, 0.4613774891287055, 0.12680242250888266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bc76b8d-1394-45a7-a3bc-8354b0ad0bd3", 3, 0, 0.0, 824.3333333333334, 194, 2078, 201.0, 2078.0, 2078.0, 2078.0, 0.022164921794767603, 0.02237416096535623, 0.014213833312399797], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 796.5762711864409, 554, 1153, 792.0, 1031.0, 1045.0, 1153.0, 0.26019157155709216, 234.12083345506844, 0.13060397244174354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 107.95000000000002, 82, 250, 88.0, 237.50000000000028, 250.0, 250.0, 0.10691528033186504, 0.07987323188855151, 0.03800504105546765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 4, 2.2598870056497176, 157.81920903954796, 82, 1064, 90.0, 292.60000000000014, 357.5999999999998, 895.5199999999998, 0.7336027354678272, 1.6208326857320485, 0.351420837218941], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 92.99999999999999, 84, 116, 88.0, 116.0, 116.0, 116.0, 0.04560009728020754, 0.035313356585160716, 0.01620940958007377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 87.49999999999999, 81, 104, 85.5, 102.5, 104.0, 104.0, 0.11470990683916851, 0.09308977791342679, 0.040775787196735684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43a6624f-9d96-474b-be80-ca64fc5dcc74", 3, 0, 0.0, 385.0, 308, 426, 421.0, 426.0, 426.0, 426.0, 0.04064875411568635, 0.03388719377938566, 0.02606707213798897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/341f95c3-c099-4f2f-a5c3-022a79977cea", 3, 0, 0.0, 356.0, 191, 614, 263.0, 614.0, 614.0, 614.0, 0.05130924079426705, 0.03191795545502745, 0.03290338683746943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 291.1111111111111, 164, 945, 171.0, 945.0, 945.0, 945.0, 0.04559270516717325, 6.123333808257345, 0.10124291571681863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 259.9473684210526, 163, 1050, 170.0, 336.0, 1050.0, 1050.0, 0.10227370596847817, 6.589893961679657, 0.22863871510582637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d50c73d-a6af-467f-9eca-5cb5e8a5f0d0", 2, 0, 0.0, 1102.0, 198, 2006, 1102.0, 2006.0, 2006.0, 2006.0, 0.023997216322906544, 0.02730152052361926, 0.014916238466337904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf8b0b52-d1a4-4bb2-80c6-acf906fed6ea", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 110.53333333333332, 82, 271, 85.0, 254.20000000000002, 271.0, 271.0, 0.07627028153903259, 0.06323580959632683, 0.02711170164082799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88675735-d0de-4dfd-8db5-615b76775b00", 3, 0, 0.0, 417.3333333333333, 228, 513, 511.0, 513.0, 513.0, 513.0, 0.02752697643690817, 0.027607621875688177, 0.017652390488512075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 110.44444444444446, 84, 245, 88.0, 241.4, 245.0, 245.0, 0.09388593901586671, 0.07288996241954496, 0.03337351738454637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 92.3, 80, 245, 83.0, 91.80000000000001, 237.34999999999988, 245.0, 0.10746621530856236, 0.0798650291502109, 0.05394300260605572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 130.25000000000003, 80, 255, 83.0, 246.60000000000002, 254.6, 255.0, 0.10746794768460306, 0.052967844918378096, 0.05993646965105157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 244.0, 80, 911, 83.5, 852.1000000000003, 908.75, 911.0, 0.10746679276103684, 14.529442165066307, 0.061793405837596176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 174.60000000000002, 79, 650, 82.5, 627.4000000000003, 649.7, 650.0, 0.10746679276103684, 4.7644416059031505, 0.06189835387740188], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 33.333333333333336, 0.29873039581777444], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 8.333333333333334, 0.07468259895444361], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 8.333333333333334, 0.07468259895444361], "isController": false}, {"data": ["401/Unauthorized", 6, 50.0, 0.4480955937266617], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1339, 12, "401/Unauthorized", 6, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
