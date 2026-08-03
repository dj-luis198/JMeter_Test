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

    var data = {"OkPercent": 98.39939024390245, "KoPercent": 1.600609756097561};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7998691955526488, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4107142857142857, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b49120d3-6ac0-4d17-bd94-a046b644f6ae"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fcdd905d-8f61-48a5-8476-fb2bfb103c7e"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97895714-52fe-4106-be76-187892e8b72f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/218afb2d-42c7-497b-8c28-6305d89c98c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/27bdcea0-43a8-4a93-ac02-6d03c8c26253"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cc71963d-c1ff-4cbc-b431-7e3bd84ea161"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8f791d1-1462-4801-840a-0db2a5bdcf85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5476190476190477, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a4e6cfe-ba87-4d77-a70f-dd6ebddfc118"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/3c205fe6-c37d-4a8f-944f-6fd8178a049d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a0a88c2a-0fe8-4637-9bf1-4f14981c5ea9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8e3fbc4-03c5-4df6-9f89-d604ddfad28a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04c7d52e-d88e-4d57-889e-2420ddc54272"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35782f10-1f1d-49ca-8b69-e68c41be5e7f"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35782f10-1f1d-49ca-8b69-e68c41be5e7f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b49120d3-6ac0-4d17-bd94-a046b644f6ae"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe438a26-dcfd-4260-a316-cfb4261be30d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8e3fbc4-03c5-4df6-9f89-d604ddfad28a"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc71963d-c1ff-4cbc-b431-7e3bd84ea161"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/82cc44c3-52ff-42bc-93b0-da3902528ee9"], "isController": false}, {"data": [0.3389830508474576, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8035714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b8f791d1-1462-4801-840a-0db2a5bdcf85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9252873563218391, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c205fe6-c37d-4a8f-944f-6fd8178a049d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82cc44c3-52ff-42bc-93b0-da3902528ee9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a4e6cfe-ba87-4d77-a70f-dd6ebddfc118"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27bdcea0-43a8-4a93-ac02-6d03c8c26253"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fcdd905d-8f61-48a5-8476-fb2bfb103c7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0a88c2a-0fe8-4637-9bf1-4f14981c5ea9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe438a26-dcfd-4260-a316-cfb4261be30d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/04c7d52e-d88e-4d57-889e-2420ddc54272"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1312, 21, 1.600609756097561, 332.6227134146344, 79, 4167, 101.0, 888.0, 1130.6999999999998, 1753.9599999999991, 5.117224217887663, 721.8859932746237, 3.743259144308063], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1358.7321428571427, 977, 1858, 1372.5, 1584.1000000000004, 1714.8999999999999, 1858.0, 0.25627531290758077, 308.3843285930028, 1.2601037114156923], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b49120d3-6ac0-4d17-bd94-a046b644f6ae", 3, 0, 0.0, 700.6666666666666, 266, 1390, 446.0, 1390.0, 1390.0, 1390.0, 0.02007226013649137, 0.023724731951692758, 0.01287185952763281], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 697.0000000000001, 82, 1644, 554.0, 1470.0, 1644.0, 1644.0, 0.0763343239832268, 0.014953774795932908, 0.05139645694235232], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 697.0000000000001, 82, 1644, 554.0, 1470.0, 1644.0, 1644.0, 0.07616919717666175, 0.014921426712537449, 0.05128527585944244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 111.9375, 79, 243, 82.0, 241.6, 243.0, 243.0, 0.12607260205971113, 0.03373427047300864, 0.071900780862179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 103.8125, 80, 249, 83.0, 245.5, 249.0, 249.0, 0.12607061530339683, 0.09369115063074705, 0.06328153932221285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 121.31250000000001, 79, 241, 82.0, 241.0, 241.0, 241.0, 0.1260716086737267, 0.03398023827534039, 0.07423943362329803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 132.68750000000003, 80, 253, 81.5, 247.4, 253.0, 253.0, 0.1260716086737267, 0.03398023827534039, 0.0741163168179526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fcdd905d-8f61-48a5-8476-fb2bfb103c7e", 3, 0, 0.0, 270.3333333333333, 176, 452, 183.0, 452.0, 452.0, 452.0, 0.01807653605365116, 0.02491996425364995, 0.011592049487530202], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 337.6, 82, 1630, 202.0, 964.6000000000004, 1630.0, 1630.0, 0.07544512624484458, 0.14533992744693694, 0.048764271703047986], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/97895714-52fe-4106-be76-187892e8b72f", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/218afb2d-42c7-497b-8c28-6305d89c98c0", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 98.16666666666666, 80, 345, 83.0, 116.40000000000036, 345.0, 345.0, 0.09707795359673818, 0.07214484637413843, 0.04872858217648772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 91.83333333333333, 80, 243, 82.5, 103.50000000000023, 243.0, 243.0, 0.09707847716228825, 0.042176890468511516, 0.05445917175879234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27bdcea0-43a8-4a93-ac02-6d03c8c26253", 3, 0, 0.0, 733.0, 222, 1654, 323.0, 1654.0, 1654.0, 1654.0, 0.02456318469877348, 0.024635147153945665, 0.01575178185435669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 531.5, 470, 634, 518.0, 634.0, 634.0, 634.0, 0.056552556175539136, 16.62832923720027, 0.03225262969386216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 892.6666666666666, 680, 1046, 948.0, 1046.0, 1046.0, 1046.0, 0.056296796712267075, 50.65595664091088, 0.03205178953442549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 168.16666666666666, 81, 270, 163.5, 270.0, 270.0, 270.0, 0.05667327854916407, 0.10028513743270048, 0.031380614196656276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 86.81818181818183, 81, 104, 84.0, 101.60000000000001, 104.0, 104.0, 0.05336101638183203, 0.03965598971345134, 0.02678472892603678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 99.18181818181819, 79, 241, 85.0, 212.0000000000001, 241.0, 241.0, 0.05336023983002338, 0.014278032923267975, 0.030432011778060212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 98.90909090909092, 82, 243, 84.0, 212.80000000000013, 243.0, 243.0, 0.05336231068507505, 0.014382810301836633, 0.03137120218009295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 84.54545454545455, 81, 94, 84.0, 93.0, 94.0, 94.0, 0.053360757528717793, 0.014382391677662216, 0.0314223992088055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc71963d-c1ff-4cbc-b431-7e3bd84ea161", 3, 0, 0.0, 405.0, 278, 549, 388.0, 549.0, 549.0, 549.0, 0.027761326621261476, 0.027842658632847204, 0.017802673647098016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 111.0, 81, 249, 84.0, 249.0, 249.0, 249.0, 0.056758520872946056, 0.04218089295342963, 0.03187123974799217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 646.9333333333333, 80, 1103, 805.0, 1062.2, 1103.0, 1103.0, 0.06919904413053707, 41.51649813335579, 0.03671694073332534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 180.11111111111111, 80, 1032, 83.0, 747.6000000000005, 1032.0, 1032.0, 0.09707795359673818, 9.728915292069809, 0.056144259187349665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 439.86666666666673, 81, 718, 487.0, 676.6, 718.0, 718.0, 0.06920000184533337, 13.570949320225315, 0.03678502702260072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 172.33333333333334, 81, 646, 84.0, 637.0, 646.0, 646.0, 0.09707847716228825, 3.1948467845451063, 0.05623936518765809], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 513.7857142857143, 86, 1082, 461.0, 1033.0, 1082.0, 1082.0, 0.07616767770191235, 0.014382387244634259, 0.05212619182013547], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8f791d1-1462-4801-840a-0db2a5bdcf85", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 202.1818181818182, 164, 325, 176.0, 325.0, 325.0, 325.0, 0.05333591931730023, 0.0826602577700737, 0.11995373260521722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 924.0476190476189, 153, 1756, 1002.0, 1735.2, 1755.9, 1756.0, 0.09070294784580499, 0.055714994331065755, 0.04101119614512472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 88.06666666666665, 80, 153, 83.0, 114.00000000000003, 153.0, 153.0, 0.0692488804764323, 0.05146327933844236, 0.03475969195789668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a4e6cfe-ba87-4d77-a70f-dd6ebddfc118", 3, 0, 0.0, 261.3333333333333, 176, 430, 178.0, 430.0, 430.0, 430.0, 0.11786892975011787, 0.053332621208549424, 0.075586520705642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 158.2, 80, 249, 88.0, 248.4, 249.0, 249.0, 0.06925143812153166, 0.08787177923103202, 0.03561760163802735], "isController": false}, {"data": ["login", 21, 0, 0.0, 3352.714285714286, 2016, 5957, 2864.0, 5289.800000000001, 5918.4, 5957.0, 0.08894084163447856, 30.52214428428034, 0.1763306780786237], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3c205fe6-c37d-4a8f-944f-6fd8178a049d", 3, 0, 0.0, 1178.6666666666667, 294, 1630, 1612.0, 1630.0, 1630.0, 1630.0, 0.08147303242626691, 0.036864425479333, 0.05224670373689642], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 89.33333333333334, 84, 121, 86.0, 103.00000000000003, 121.0, 121.0, 0.09841658647537399, 0.0796751466680518, 0.034984020973668095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0a88c2a-0fe8-4637-9bf1-4f14981c5ea9", 3, 0, 0.0, 546.3333333333334, 380, 871, 388.0, 871.0, 871.0, 871.0, 0.030152572014392826, 0.025136958635696625, 0.019336122027458942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8e3fbc4-03c5-4df6-9f89-d604ddfad28a", 3, 0, 0.0, 347.6666666666667, 181, 484, 378.0, 484.0, 484.0, 484.0, 0.031963518970348506, 0.026646670599955253, 0.0204974389230425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04c7d52e-d88e-4d57-889e-2420ddc54272", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 736.7333333333333, 166, 1185, 888.0, 1149.0, 1185.0, 1185.0, 0.06917000604084719, 55.20331640637609, 0.14376643508164366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 277.68750000000006, 163, 494, 321.0, 490.5, 494.0, 494.0, 0.12598921217370762, 0.19525867160124413, 0.2833526910508288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 698.0, 82, 1269, 800.0, 1269.0, 1269.0, 1269.0, 0.08437790049032935, 67.30439488740238, 0.14531749528890056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35782f10-1f1d-49ca-8b69-e68c41be5e7f", 3, 0, 0.0, 373.66666666666663, 202, 691, 228.0, 691.0, 691.0, 691.0, 0.04133768756975735, 0.02706057607512436, 0.026508868656387363], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1281.3913043478262, 550, 2337, 1284.0, 1825.2, 2238.7999999999984, 2337.0, 0.09394734047333121, 0.029597879853605534, 0.042386397752616226], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 297.72222222222223, 163, 1116, 170.5, 1067.4, 1116.0, 1116.0, 0.09703399424264968, 13.032162389084753, 0.21547316538366162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 112.89473684210526, 83, 506, 88.0, 102.0, 506.0, 506.0, 0.11505389366598039, 0.08932406783638126, 0.040898063764078965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35782f10-1f1d-49ca-8b69-e68c41be5e7f", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b49120d3-6ac0-4d17-bd94-a046b644f6ae", 1, 0, 0.0, 816.0, 816, 816, 816.0, 816.0, 816.0, 816.0, 1.2254901960784315, 0.22140203737745098, 0.8449180453431373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 410.4736842105263, 165, 1200, 324.0, 1180.0, 1200.0, 1200.0, 0.09947331497439871, 18.920033107598716, 0.21969920938347487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe438a26-dcfd-4260-a316-cfb4261be30d", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.0565149853801168, 4.0318896198830405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 125.0, 81, 249, 84.5, 248.1, 249.0, 249.0, 0.0827717500017244, 0.061512989991515894, 0.04154753857508432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 122.41666666666667, 80, 246, 82.0, 245.4, 246.0, 246.0, 0.08277403378560147, 0.02214852075903789, 0.04720706614335082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 109.08333333333333, 80, 241, 83.0, 240.7, 241.0, 241.0, 0.08277289187790998, 0.022309881013967928, 0.04866140713916193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 142.16666666666669, 79, 323, 84.0, 299.30000000000007, 323.0, 323.0, 0.08277403378560147, 0.02231018879377539, 0.0487429124733571], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 3.429324127906977, 7.18795421511628], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 917.4285714285713, 638, 1518, 887.0, 1164.2000000000003, 1306.1, 1518.0, 0.25909972100512185, 309.9733439595064, 0.511620738156598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8e3fbc4-03c5-4df6-9f89-d604ddfad28a", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1281.3913043478262, 550, 2337, 1284.0, 1825.2, 2238.7999999999984, 2337.0, 0.09398381026711833, 0.029609369572945736, 0.04240285189786003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 82.6, 80, 87, 82.0, 87.0, 87.0, 87.0, 0.03515531618691379, 0.009475456316004107, 0.020701812168661144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 81.8, 81, 83, 82.0, 83.0, 83.0, 83.0, 0.03515630493172645, 0.009475722813629395, 0.020668062079003246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 116.26315789473684, 80, 245, 83.0, 243.0, 245.0, 245.0, 0.11561045361891144, 0.031160630076972222, 0.06796630183455536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 109.10526315789474, 79, 262, 82.0, 247.0, 262.0, 262.0, 0.11561115708513849, 0.031160819683103736, 0.0680796169163462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 92.47368421052632, 81, 250, 83.0, 93.0, 250.0, 250.0, 0.11561537806228626, 0.08592119404824204, 0.05803350031642104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 114.2, 80, 239, 82.0, 239.0, 239.0, 239.0, 0.035154821835362934, 0.009406661311415473, 0.020049234327980423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 117.21052631578947, 80, 258, 83.0, 244.0, 258.0, 258.0, 0.1156125640432756, 0.030935393113142105, 0.06593529043093062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 83.4, 82, 87, 83.0, 87.0, 87.0, 87.0, 0.03515655212661983, 0.026127086101911813, 0.017646941204182223], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 711.0000000000001, 92, 1654, 493.0, 1633.0, 1654.0, 1654.0, 0.0748242965179979, 0.013982581638652094, 0.0509249903129259], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 119.8, 85, 245, 90.0, 245.0, 245.0, 245.0, 0.03795959580622386, 0.02987835373028948, 0.013493450071743636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1757.8571428571431, 1028, 4167, 1610.0, 3020.400000000001, 4076.5999999999985, 4167.0, 0.09049578763655168, 0.046838640085324595, 0.04162452732110922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 199.0, 165, 326, 166.0, 326.0, 326.0, 326.0, 0.03513431849962406, 0.054451331502835335, 0.07901790576624435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc71963d-c1ff-4cbc-b431-7e3bd84ea161", 1, 0, 0.0, 984.0, 984, 984, 984.0, 984.0, 984.0, 984.0, 1.016260162601626, 0.18360168953252032, 0.7006637449186992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82cc44c3-52ff-42bc-93b0-da3902528ee9", 3, 0, 0.0, 446.6666666666667, 317, 521, 502.0, 521.0, 521.0, 521.0, 0.028220420296126276, 0.028303097308712586, 0.01809707942166952], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 975.2881355932204, 422, 3801, 736.0, 1712.0, 1902.0, 3801.0, 0.2747112040266144, 84.61240584448088, 0.9990019165762604], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 154.9107142857143, 81, 360, 85.0, 332.6, 344.4, 360.0, 0.2599645334100848, 0.1931962987549556, 0.12566644925585152], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 530.1607142857143, 396, 885, 485.0, 658.3, 736.3, 885.0, 0.2596415092590017, 76.34322463163362, 0.13058142311365808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8f791d1-1462-4801-840a-0db2a5bdcf85", 3, 0, 0.0, 683.6666666666667, 196, 1256, 599.0, 1256.0, 1256.0, 1256.0, 0.029925187032418952, 0.030012858478802994, 0.01919030548628429], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 138.46428571428575, 80, 338, 91.0, 251.3, 270.19999999999993, 338.0, 0.2601227221842876, 0.4602952857401653, 0.12650499574978052], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 760.8571428571429, 555, 1177, 735.0, 958.4000000000001, 1032.45, 1177.0, 0.25954163094107013, 233.53601574629806, 0.13027773271846685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 118.10526315789473, 82, 343, 90.0, 250.0, 343.0, 343.0, 0.10070386702849389, 0.07523286941093538, 0.03579707773278494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, 5.172413793103448, 177.5344827586207, 81, 2585, 89.5, 327.0, 482.0, 1829.0, 0.728975956361991, 1.5615688143876392, 0.35045882411779244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 87.08333333333333, 82, 91, 86.5, 90.7, 91.0, 91.0, 0.08737503549610816, 0.06766445619962283, 0.0310590946490072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 94.06250000000001, 85, 151, 90.5, 116.00000000000003, 151.0, 151.0, 0.12885041272397824, 0.10456512985705657, 0.045802295147976645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c205fe6-c37d-4a8f-944f-6fd8178a049d", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82cc44c3-52ff-42bc-93b0-da3902528ee9", 1, 0, 0.0, 1082.0, 1082, 1082, 1082.0, 1082.0, 1082.0, 1082.0, 0.9242144177449169, 0.16697233133086875, 0.6372025184842883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 282.5833333333333, 163, 496, 174.0, 494.2, 496.0, 496.0, 0.0827249601886129, 0.12820753107356317, 0.18605037433044486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a4e6cfe-ba87-4d77-a70f-dd6ebddfc118", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 236.8421052631579, 164, 494, 170.0, 347.0, 494.0, 494.0, 0.11555209575011555, 0.1790831796439779, 0.259879371594254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27bdcea0-43a8-4a93-ac02-6d03c8c26253", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 103.72727272727273, 84, 251, 89.0, 220.6000000000001, 251.0, 251.0, 0.052405408238130176, 0.043449405853684106, 0.018628484959647838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fcdd905d-8f61-48a5-8476-fb2bfb103c7e", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 87.66666666666664, 82, 99, 87.0, 94.8, 99.0, 99.0, 0.06878209831254585, 0.05340016421725972, 0.024449886509537784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0a88c2a-0fe8-4637-9bf1-4f14981c5ea9", 1, 0, 0.0, 857.0, 857, 857, 857.0, 857.0, 857.0, 857.0, 1.1668611435239205, 0.21080987456242709, 0.8044960618436406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe438a26-dcfd-4260-a316-cfb4261be30d", 3, 0, 0.0, 377.0, 179, 479, 473.0, 479.0, 479.0, 479.0, 0.06337938902268983, 0.02805858368191997, 0.04064368371572231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04c7d52e-d88e-4d57-889e-2420ddc54272", 3, 0, 0.0, 1136.6666666666667, 179, 2795, 436.0, 2795.0, 2795.0, 2795.0, 0.016162138574176137, 0.022280812780480448, 0.010364392249715816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 109.6842105263158, 81, 246, 83.0, 245.0, 246.0, 246.0, 0.09959898304196263, 0.07401838485833356, 0.04999402078473515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 149.36842105263156, 80, 246, 84.0, 244.0, 246.0, 246.0, 0.09951812277393673, 0.050229644615545785, 0.05543675034045674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 274.0, 80, 1098, 93.0, 955.0, 1098.0, 1098.0, 0.09960159362549802, 14.173399944629377, 0.05720334124030195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 197.42105263157896, 80, 512, 89.0, 482.0, 512.0, 512.0, 0.09951864403228596, 4.642870062042017, 0.057252887677496735], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 28.571428571428573, 0.4573170731707317], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.1524390243902439], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.07621951219512195], "isController": false}, {"data": ["401/Unauthorized", 12, 57.142857142857146, 0.9146341463414634], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1312, 21, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
