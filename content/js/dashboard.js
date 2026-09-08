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

    var data = {"OkPercent": 98.84704073789393, "KoPercent": 1.1529592621060722};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8129543952412426, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.375, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bae60e49-fa13-49ab-81a2-835f0effa5db"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c55e16a7-a4d6-49ac-b07d-868852c77379"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8db3ea9c-b038-4e07-8424-e668d899bad2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8db3ea9c-b038-4e07-8424-e668d899bad2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e650b43-43f7-4952-93f1-7a80569ea098"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff98d352-e16b-4f29-a934-5684cb6242f0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=337eeb81-df7e-4327-a958-775ad5905248"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad28acb8-13dc-40fb-8852-cd4f5da34665"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e5992bf-9a55-4254-be9e-8f2a5e292025"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0afd8930-0ac5-4083-b532-316770dc0a16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/83ccdf96-bd36-45b0-b3c9-604f1a4f14d7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=790ce0cf-2ef7-42cf-a325-4a3549221fa9"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ebf68a9-d067-47b2-a4bf-86181d078b40"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b1dc090-02d7-4866-a034-e2106af71736"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b1dc090-02d7-4866-a034-e2106af71736"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c55e16a7-a4d6-49ac-b07d-868852c77379"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0afd8930-0ac5-4083-b532-316770dc0a16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eae87648-67a7-4393-a0f5-7dcfbec2bb9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3898305084745763, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bae60e49-fa13-49ab-81a2-835f0effa5db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6078d476-93eb-4833-b856-a6a0922dc7a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e89f3b4c-3718-48fb-b842-b3b01552a02a"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9540229885057471, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb1e7b85-4ac2-4c5f-a702-b59dd3ef3cc5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e89f3b4c-3718-48fb-b842-b3b01552a02a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ad28acb8-13dc-40fb-8852-cd4f5da34665"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/790ce0cf-2ef7-42cf-a325-4a3549221fa9"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83ccdf96-bd36-45b0-b3c9-604f1a4f14d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/337eeb81-df7e-4327-a958-775ad5905248"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ebf68a9-d067-47b2-a4bf-86181d078b40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6226355e-8bd3-4021-92ee-86972999851d"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1301, 15, 1.1529592621060722, 317.1913912375091, 78, 2642, 94.0, 876.0, 1107.8999999999999, 1603.020000000001, 5.120071783327692, 728.3871681644483, 3.7332345074538167], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1363.3392857142858, 994, 1911, 1339.5, 1643.1000000000001, 1719.85, 1911.0, 0.254969631295701, 306.81376015752346, 1.2536836851307176], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bae60e49-fa13-49ab-81a2-835f0effa5db", 3, 0, 0.0, 506.33333333333337, 203, 992, 324.0, 992.0, 992.0, 992.0, 0.031155883269290686, 0.025973377946827293, 0.019979521497559456], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 495.9285714285714, 87, 930, 475.5, 853.5, 930.0, 930.0, 0.07700812435711968, 0.01516956913954422, 0.05181503679888228], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 495.9285714285714, 87, 930, 475.5, 853.5, 930.0, 930.0, 0.07674218463073305, 0.015117182575138822, 0.05163609883845222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 91.41176470588233, 79, 243, 82.0, 119.7999999999999, 243.0, 243.0, 0.09185415721109166, 0.03269349483455446, 0.0519317908588904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 84.64705882352939, 81, 107, 83.0, 94.19999999999999, 107.0, 107.0, 0.09185167575277851, 0.06826086449986762, 0.0461052356805939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 181.47058823529412, 80, 643, 84.0, 394.19999999999976, 643.0, 643.0, 0.09185366090870287, 1.612008532259546, 0.053625273197101746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 156.64705882352942, 79, 1025, 83.0, 396.99999999999943, 1025.0, 1025.0, 0.0918526683200147, 4.885018061543989, 0.05353499384046812], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 215.13333333333335, 82, 354, 206.0, 336.0, 354.0, 354.0, 0.08234293085938572, 0.15258638288090468, 0.05322269645650921], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c55e16a7-a4d6-49ac-b07d-868852c77379", 3, 0, 0.0, 309.0, 206, 428, 293.0, 428.0, 428.0, 428.0, 0.04160195251830486, 0.034681836067506105, 0.026678335436543157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 83.07142857142858, 81, 86, 83.5, 85.0, 86.0, 86.0, 0.07689941556444171, 0.05714888207474623, 0.038599901953245155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 105.21428571428572, 79, 244, 82.5, 243.0, 244.0, 244.0, 0.07689983796105572, 0.037076707588366155, 0.04293431243305594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 602.75, 487, 648, 638.0, 648.0, 648.0, 648.0, 0.05383145371840767, 15.828234765698598, 0.030700750948779373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 925.0, 882, 959, 929.5, 959.0, 959.0, 959.0, 0.05365382551775942, 48.277806514245086, 0.03054705105161498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 124.5, 82, 252, 82.0, 252.0, 252.0, 252.0, 0.05423581733376722, 0.09597197364139279, 0.030030965261959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8db3ea9c-b038-4e07-8424-e668d899bad2", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 82.66666666666667, 81, 85, 82.5, 85.0, 85.0, 85.0, 0.09946702253756952, 0.07392031655379923, 0.04992778279717845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 95.5, 80, 242, 82.0, 195.80000000000018, 242.0, 242.0, 0.09946867151300139, 0.026615640619689823, 0.0567282267222586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 108.91666666666667, 80, 244, 82.5, 242.5, 244.0, 244.0, 0.09933363685277927, 0.02677351930797566, 0.058397313852903435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 122.25000000000001, 81, 244, 82.5, 243.7, 244.0, 244.0, 0.09933363685277927, 0.02677351930797566, 0.05849431935764248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 146.25, 83, 334, 84.0, 334.0, 334.0, 334.0, 0.054050401999864876, 0.04016831632997771, 0.030350567529221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 603.0588235294118, 81, 1057, 794.0, 1035.4, 1057.0, 1057.0, 0.09192568079077715, 48.66601938482794, 0.049395267584842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 196.28571428571428, 80, 948, 83.5, 792.0, 948.0, 948.0, 0.07689941556444171, 9.902655724749527, 0.0442643678318759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 477.4117647058824, 83, 801, 632.0, 757.8, 801.0, 801.0, 0.09192667495809226, 15.909905099226734, 0.0494855739333802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 174.21428571428572, 81, 645, 83.5, 639.5, 645.0, 645.0, 0.07690026036231008, 3.24794171646874, 0.04433995201973041], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 541.1666666666666, 89, 913, 537.5, 912.4, 913.0, 913.0, 0.078504746266118, 0.014930468100904768, 0.05365896516024781], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 219.33333333333334, 163, 328, 168.5, 327.1, 328.0, 328.0, 0.09926543577526305, 0.15384203767123286, 0.22325029159221757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8db3ea9c-b038-4e07-8424-e668d899bad2", 3, 0, 0.0, 314.0, 224, 437, 281.0, 437.0, 437.0, 437.0, 0.017670446178766015, 0.02436013657782359, 0.011331633780002945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e650b43-43f7-4952-93f1-7a80569ea098", 2, 0, 0.0, 296.0, 253, 339, 296.0, 339.0, 339.0, 339.0, 0.023272862678473765, 0.032704735736644286, 0.014465993256688039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 727.0454545454545, 157, 1506, 612.5, 1254.2, 1470.2999999999995, 1506.0, 0.09146316113314541, 0.05618196128198093, 0.04135492539516243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 122.76470588235294, 81, 260, 84.0, 247.2, 260.0, 260.0, 0.09200329047062389, 0.06837353910951638, 0.04618133916201238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 120.0, 80, 246, 83.0, 244.4, 246.0, 246.0, 0.09200478424878095, 0.10590486367055793, 0.04792620539797481], "isController": false}, {"data": ["login", 22, 0, 0.0, 2773.181818181818, 1292, 4142, 2811.5, 4100.3, 4138.4, 4142.0, 0.09147457006952067, 20.024777394554768, 0.16559463408093006], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ff98d352-e16b-4f29-a934-5684cb6242f0", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.6927026843817787, 1.29431602494577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=337eeb81-df7e-4327-a958-775ad5905248", 1, 0, 0.0, 911.0, 911, 911, 911.0, 911.0, 911.0, 911.0, 1.0976948408342482, 0.19831400933040613, 0.7568091383095499], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad28acb8-13dc-40fb-8852-cd4f5da34665", 1, 0, 0.0, 913.0, 913, 913, 913.0, 913.0, 913.0, 913.0, 1.095290251916758, 0.1978795865279299, 0.7551512869660459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 97.85714285714286, 83, 248, 85.5, 171.0, 248.0, 248.0, 0.07254788160185723, 0.05873261117962855, 0.025788504788160187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e5992bf-9a55-4254-be9e-8f2a5e292025", 2, 0, 0.0, 282.5, 211, 354, 282.5, 354.0, 354.0, 354.0, 0.024368253039939565, 0.027509473158369276, 0.015146868222579624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0afd8930-0ac5-4083-b532-316770dc0a16", 3, 0, 0.0, 328.3333333333333, 239, 407, 339.0, 407.0, 407.0, 407.0, 0.07745733391856652, 0.03504742648008055, 0.04967153249335158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83ccdf96-bd36-45b0-b3c9-604f1a4f14d7", 3, 0, 0.0, 305.6666666666667, 191, 449, 277.0, 449.0, 449.0, 449.0, 0.042673039173849965, 0.027434652463656794, 0.027365197647293105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=790ce0cf-2ef7-42cf-a325-4a3549221fa9", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 736.8235294117648, 169, 1143, 876.0, 1121.4, 1143.0, 1143.0, 0.0918829519290015, 64.7197850766547, 0.19281802142224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ebf68a9-d067-47b2-a4bf-86181d078b40", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 0.2307331577266922, 0.8805276181353767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b1dc090-02d7-4866-a034-e2106af71736", 3, 0, 0.0, 350.0, 196, 561, 293.0, 561.0, 561.0, 561.0, 0.05261219550691851, 0.03272848490029989, 0.03373894047806948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 299.64705882352933, 164, 1108, 197.0, 554.3999999999995, 1108.0, 1108.0, 0.0918105031215571, 6.594934929305913, 0.20510217462627725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, 42.857142857142854, 648.1428571428571, 82, 1282, 965.0, 1282.0, 1282.0, 1282.0, 0.07881640281937533, 53.89007768341703, 0.12374439136847795], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1210.9999999999995, 314, 2040, 1173.0, 1720.6, 1993.3499999999995, 2040.0, 0.09153546583230703, 0.029092415454515196, 0.0412982277485604], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 87.39999999999999, 83, 97, 86.0, 92.9, 96.8, 97.0, 0.09809451406430096, 0.07615736199328053, 0.03486953429629448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 314.5714285714285, 167, 1030, 170.5, 875.0, 1030.0, 1030.0, 0.0768643728141694, 13.238751551013236, 0.17006028019809047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b1dc090-02d7-4866-a034-e2106af71736", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 365.5294117647059, 164, 1037, 173.0, 1006.6, 1037.0, 1037.0, 0.08540610603419259, 18.13995666582098, 0.1882241071921989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 136.66666666666669, 81, 243, 84.0, 243.0, 243.0, 243.0, 0.04613184481247405, 0.03428352920145777, 0.02315602366563639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 99.00000000000001, 79, 243, 81.0, 243.0, 243.0, 243.0, 0.04613373657636415, 0.02004334648999154, 0.025880145193120947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 248.33333333333334, 80, 1105, 83.0, 1105.0, 1105.0, 1105.0, 0.04613373657636415, 4.623410348373786, 0.026681078119793936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 186.22222222222226, 80, 710, 82.0, 710.0, 710.0, 710.0, 0.046133973057759736, 1.51826625005126, 0.026726267594984723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 3.31372893258427, 6.945663623595506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c55e16a7-a4d6-49ac-b07d-868852c77379", 1, 0, 0.0, 814.0, 814, 814, 814.0, 814.0, 814.0, 814.0, 1.2285012285012284, 0.22194602272727273, 0.8469940110565111], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 938.5892857142856, 639, 1543, 851.0, 1303.3, 1373.8999999999999, 1543.0, 0.2569314130768913, 307.37929385153956, 0.5073391769936272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1210.9999999999995, 314, 2040, 1173.0, 1720.6, 1993.3499999999995, 2040.0, 0.0919909347115248, 0.029237175627419988, 0.041503722496801225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 99.88888888888889, 81, 242, 82.0, 242.0, 242.0, 242.0, 0.05544739890090934, 0.01494480673501072, 0.03265115384496907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 82.22222222222223, 81, 83, 83.0, 83.0, 83.0, 83.0, 0.05544739890090934, 0.01494480673501072, 0.0325970059944799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 106.6, 80, 249, 82.0, 241.60000000000002, 248.65, 249.0, 0.0994624056972066, 0.026808226535575217, 0.05847301584933435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 106.45, 79, 246, 82.0, 242.60000000000002, 245.85, 246.0, 0.09946191106115913, 0.026808093215703047, 0.05856985582995992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0afd8930-0ac5-4083-b532-316770dc0a16", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 83.45, 80, 94, 83.0, 85.0, 93.55, 94.0, 0.09945993256616573, 0.07391504754184776, 0.04992422396387615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 81.55555555555554, 78, 83, 82.0, 83.0, 83.0, 83.0, 0.05544876534082508, 0.014836876663462959, 0.0316231239834393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eae87648-67a7-4393-a0f5-7dcfbec2bb9a", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 98.39999999999999, 79, 247, 82.0, 226.70000000000033, 246.75, 247.0, 0.09946141643003138, 0.02661369931819199, 0.056724089057752274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 85.55555555555556, 80, 102, 84.0, 102.0, 102.0, 102.0, 0.05544671570620634, 0.04120600649650685, 0.02783165221971685], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 492.0833333333333, 83, 992, 443.0, 926.3000000000002, 992.0, 992.0, 0.07679901697258276, 0.014431065282364385, 0.0522680809685636], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 107.0, 84, 258, 87.0, 258.0, 258.0, 258.0, 0.057824637150401884, 0.04551431400705461, 0.020554851487056918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1565.1818181818182, 853, 2642, 1502.0, 2241.1, 2591.4499999999994, 2642.0, 0.09211881652444079, 0.047678684333939084, 0.04237105720997228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 186.55555555555554, 162, 344, 168.0, 344.0, 344.0, 344.0, 0.05541871921182266, 0.08588819080972906, 0.12463799838362069], "isController": false}, {"data": ["addBook", 59, 5, 8.474576271186441, 991.050847457627, 418, 2642, 843.0, 1539.0, 1588.0, 2642.0, 0.2729295517941649, 95.13776834699523, 0.9905667639460062], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bae60e49-fa13-49ab-81a2-835f0effa5db", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 150.98214285714286, 80, 431, 85.0, 331.6, 337.15, 431.0, 0.2576892635608975, 0.1915053999705498, 0.12456658736586354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6078d476-93eb-4833-b856-a6a0922dc7a3", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.816715952685422, 1.526035006393862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e89f3b4c-3718-48fb-b842-b3b01552a02a", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 0.7958769273127753, 3.037238436123348], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 517.6785714285714, 398, 736, 483.0, 649.6, 701.4499999999999, 736.0, 0.2576525095814527, 75.75839268542929, 0.12958109612739074], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 121.21428571428567, 81, 338, 85.0, 248.3, 317.95, 338.0, 0.2580312217778351, 0.4565943104115598, 0.1254878402786737], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 785.7857142857143, 554, 1121, 739.0, 1032.8000000000002, 1110.9, 1121.0, 0.2573694998759111, 231.5815283956688, 0.1291874247424007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 90.76470588235296, 82, 145, 85.0, 115.39999999999998, 145.0, 145.0, 0.08720139932598447, 0.06514557664490052, 0.030997372416658547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 5, 2.8735632183908044, 178.5344827586207, 81, 2300, 89.0, 351.0, 437.5, 1388.75, 0.7137583066699483, 1.5470171299429814, 0.3435074016531299], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 90.88888888888889, 84, 111, 88.0, 111.0, 111.0, 111.0, 0.047276604909412774, 0.03661166766910579, 0.016805355651392823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb1e7b85-4ac2-4c5f-a702-b59dd3ef3cc5", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.1486904226618704, 2.146329811151079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e89f3b4c-3718-48fb-b842-b3b01552a02a", 3, 0, 0.0, 283.6666666666667, 190, 468, 193.0, 468.0, 468.0, 468.0, 0.08210854749979474, 0.03715197950023264, 0.05265424432766785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 97.58823529411767, 83, 255, 87.0, 126.99999999999989, 255.0, 255.0, 0.08818936851224536, 0.07156773948601161, 0.031348564588337215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad28acb8-13dc-40fb-8852-cd4f5da34665", 3, 0, 0.0, 418.3333333333333, 201, 550, 504.0, 550.0, 550.0, 550.0, 0.03763690423916998, 0.031376338462407005, 0.02413564497108231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/790ce0cf-2ef7-42cf-a325-4a3549221fa9", 3, 0, 0.0, 615.6666666666666, 214, 1252, 381.0, 1252.0, 1252.0, 1252.0, 0.015310496876658638, 0.02110675594812804, 0.009818254833013514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 386.1111111111111, 162, 1189, 173.0, 1189.0, 1189.0, 1189.0, 0.04611222691314506, 6.1931082394864125, 0.10239656290988647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 207.45000000000002, 164, 334, 167.5, 330.5, 333.85, 334.0, 0.0994188965496672, 0.15407987189875177, 0.22359542847058939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83ccdf96-bd36-45b0-b3c9-604f1a4f14d7", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/337eeb81-df7e-4327-a958-775ad5905248", 3, 0, 0.0, 272.3333333333333, 193, 422, 202.0, 422.0, 422.0, 422.0, 0.03350083752093803, 0.027928269821328868, 0.021483284477945282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 116.66666666666667, 84, 265, 88.5, 259.0, 265.0, 265.0, 0.09756811474010293, 0.08089387638119862, 0.03468241578652097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ebf68a9-d067-47b2-a4bf-86181d078b40", 3, 0, 0.0, 432.0, 180, 773, 343.0, 773.0, 773.0, 773.0, 0.02316781218626921, 0.027383569677195147, 0.01485696289288748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 89.3529411764706, 84, 106, 87.0, 101.19999999999999, 106.0, 106.0, 0.09076396563783043, 0.07046616472858905, 0.03226375341032253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 84.05882352941177, 82, 90, 83.0, 89.2, 90.0, 90.0, 0.08554535161655555, 0.06357423103535036, 0.04293975657315386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 134.29411764705878, 79, 324, 82.0, 262.3999999999999, 324.0, 324.0, 0.0854438809615955, 0.0455098612290851, 0.04746336907735687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 233.1764705882353, 81, 954, 82.0, 923.6, 954.0, 954.0, 0.08554793452060447, 13.603020903574897, 0.04899545652403645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6226355e-8bd3-4021-92ee-86972999851d", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.1486904226618704, 2.146329811151079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 204.41176470588235, 80, 645, 83.0, 516.1999999999999, 645.0, 645.0, 0.08554793452060447, 4.4579182004488755, 0.04907899942884173], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 26.666666666666668, 0.3074558032282859], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 13.333333333333334, 0.15372790161414296], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.666666666666667, 0.07686395080707148], "isController": false}, {"data": ["401/Unauthorized", 8, 53.333333333333336, 0.6149116064565718], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1301, 15, "401/Unauthorized", 8, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
