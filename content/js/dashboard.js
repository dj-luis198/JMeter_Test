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

    var data = {"OkPercent": 98.07840122982321, "KoPercent": 1.9215987701767872};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.813907284768212, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2118ebc1-6b39-4b67-a4d2-df9d32c6a7f9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/811ea135-b18f-4c3b-8f7b-e3a893b3fe96"], "isController": false}, {"data": [0.37037037037037035, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3630d537-7c1d-414c-b1e4-ad7f940f578a"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d78c5058-3a50-4a5e-9274-3cbfb2469e54"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7fcd4f29-6260-4e89-8176-fcd2d6f73416"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/de4c0dac-9ab7-4fab-b36e-39c11e4a604a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21358c5f-51eb-46aa-87fb-10b22961fb25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/847ce16b-a0b1-48a1-8bbe-922eda876b25"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/21358c5f-51eb-46aa-87fb-10b22961fb25"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1557c644-2ba4-405a-a034-b6f59d42a258"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f2402f2-68f8-444b-ad1f-e03c41805560"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90f44ac7-1ab1-415e-a4bd-6d97dde36909"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f88a4565-f026-48c5-80e1-b13054c7112e"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3630d537-7c1d-414c-b1e4-ad7f940f578a"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d78c5058-3a50-4a5e-9274-3cbfb2469e54"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de4c0dac-9ab7-4fab-b36e-39c11e4a604a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3548387096774194, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0654a28-b6b1-4067-91a4-08fefd8cb6eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fcd4f29-6260-4e89-8176-fcd2d6f73416"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2118ebc1-6b39-4b67-a4d2-df9d32c6a7f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=811ea135-b18f-4c3b-8f7b-e3a893b3fe96"], "isController": false}, {"data": [0.7962962962962963, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9129213483146067, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90f44ac7-1ab1-415e-a4bd-6d97dde36909"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1557c644-2ba4-405a-a034-b6f59d42a258"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0654a28-b6b1-4067-91a4-08fefd8cb6eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f2402f2-68f8-444b-ad1f-e03c41805560"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4d1149d-04cc-4251-ac30-5d035a591ea9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1301, 25, 1.9215987701767872, 301.679477325134, 77, 2618, 91.0, 852.8, 1041.499999999998, 1658.6000000000013, 5.057297902445851, 691.5649396979907, 3.7046488280460403], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2118ebc1-6b39-4b67-a4d2-df9d32c6a7f9", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/811ea135-b18f-4c3b-8f7b-e3a893b3fe96", 3, 0, 0.0, 327.66666666666663, 172, 601, 210.0, 601.0, 601.0, 601.0, 0.08633590422470358, 0.04002028893749281, 0.05536514691493036], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1364.4999999999995, 955, 2159, 1350.5, 1641.5, 1710.0, 2159.0, 0.2420721374969741, 291.29384860797313, 1.1902668088840473], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3630d537-7c1d-414c-b1e4-ad7f940f578a", 3, 0, 0.0, 584.3333333333334, 269, 1078, 406.0, 1078.0, 1078.0, 1078.0, 0.045146047463544565, 0.029024558509277515, 0.02895107861431732], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 508.4615384615384, 88, 1007, 464.0, 949.8, 1007.0, 1007.0, 0.06672689196402908, 0.012641618204122695, 0.04510782007093582], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 508.4615384615384, 88, 1007, 464.0, 949.8, 1007.0, 1007.0, 0.06662634918357097, 0.012622570060168719, 0.04503985248670036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 111.3125, 79, 251, 82.0, 246.8, 251.0, 251.0, 0.07743084457693722, 0.0352559875820283, 0.043346905911844986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 82.875, 79, 91, 83.0, 87.5, 91.0, 91.0, 0.07743084457693722, 0.05754382101860276, 0.03886665440678294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 183.75, 78, 633, 82.5, 629.5, 633.0, 633.0, 0.07743159402615253, 2.8641939068594717, 0.04476514029636943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 223.31249999999997, 78, 897, 84.0, 879.5, 897.0, 897.0, 0.0774300951422294, 8.727228066110783, 0.04468865842681404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d78c5058-3a50-4a5e-9274-3cbfb2469e54", 1, 0, 0.0, 943.0, 943, 943, 943.0, 943.0, 943.0, 943.0, 1.0604453870625663, 0.19158437168610817, 0.7311273860021209], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 199.85714285714286, 81, 305, 201.5, 287.0, 305.0, 305.0, 0.07160832293307691, 0.14859626108650284, 0.0462836718957792], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 84.41176470588236, 79, 94, 82.0, 93.2, 94.0, 94.0, 0.09415830780904695, 0.06997507054949681, 0.04726305684946302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 81.05882352941177, 78, 85, 81.0, 85.0, 85.0, 85.0, 0.09416091546565342, 0.03351453539896534, 0.053235967946516596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 566.6666666666666, 466, 724, 554.5, 724.0, 724.0, 724.0, 0.08012820512820513, 23.560352814503208, 0.04569811698717949], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 908.6666666666666, 848, 972, 924.5, 972.0, 972.0, 972.0, 0.07980209081477935, 71.80606159225121, 0.045434198188492536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fcd4f29-6260-4e89-8176-fcd2d6f73416", 3, 0, 0.0, 386.0, 205, 740, 213.0, 740.0, 740.0, 740.0, 0.028151568042339956, 0.028234043339339, 0.0180529261209016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 111.0, 80, 250, 84.5, 250.0, 250.0, 250.0, 0.08071133590712816, 0.14282123111691036, 0.04469074947201335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de4c0dac-9ab7-4fab-b36e-39c11e4a604a", 3, 0, 0.0, 448.6666666666667, 222, 606, 518.0, 606.0, 606.0, 606.0, 0.019104751351661158, 0.022581169322227104, 0.012251419323819167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 93.46153846153847, 79, 237, 81.0, 176.19999999999993, 237.0, 237.0, 0.05938974750220428, 0.044136326024587356, 0.02981086935169238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 116.53846153846153, 77, 237, 81.0, 236.6, 237.0, 237.0, 0.059390832796531574, 0.0227533989830462, 0.03348764956210682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 179.38461538461542, 79, 886, 84.0, 625.9999999999998, 886.0, 886.0, 0.059390290144409774, 4.1255059952784725, 0.034522390710444925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 165.23076923076925, 79, 703, 83.0, 516.9999999999998, 703.0, 703.0, 0.059390832796531574, 1.358074540634751, 0.03458070500344924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21358c5f-51eb-46aa-87fb-10b22961fb25", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 0.6545799365942029, 2.4980185688405796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 82.66666666666667, 81, 85, 82.5, 85.0, 85.0, 85.0, 0.08070807887869576, 0.05997934377606198, 0.045319477885986385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 505.09999999999997, 79, 1146, 479.5, 1117.9000000000003, 1145.55, 1146.0, 0.09473913578960333, 42.63598803740775, 0.05162542751035025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 134.41176470588235, 78, 813, 81.0, 372.1999999999996, 813.0, 813.0, 0.09416039392277739, 5.00775027451909, 0.05488001819511141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 364.69999999999993, 78, 739, 355.5, 726.2, 738.4, 739.0, 0.09474048213431359, 13.94119147406716, 0.05171868116511845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 148.64705882352945, 79, 641, 82.0, 384.9999999999998, 641.0, 641.0, 0.09415987238567884, 1.652481960768566, 0.054971667225163945], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 454.25, 84, 943, 441.0, 832.3000000000004, 943.0, 943.0, 0.07012704683317944, 0.01333715075269697, 0.04793270396743768], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 286.6153846153846, 160, 971, 168.0, 772.1999999999998, 971.0, 971.0, 0.05936804994223032, 5.548379537659894, 0.13235168405465514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/847ce16b-a0b1-48a1-8bbe-922eda876b25", 2, 0, 0.0, 278.5, 252, 305, 278.5, 305.0, 305.0, 305.0, 0.012985157964446638, 0.025520146878368028, 0.008071340863642857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21358c5f-51eb-46aa-87fb-10b22961fb25", 3, 0, 0.0, 476.3333333333333, 227, 604, 598.0, 604.0, 604.0, 604.0, 0.06983890492597077, 0.03160028575751932, 0.04478601650526119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 660.5, 124, 2152, 540.0, 1263.9000000000003, 2108.1499999999996, 2152.0, 0.09163677017039856, 0.056288601989434285, 0.04143342245009233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 89.74999999999997, 80, 240, 81.0, 85.9, 232.2999999999999, 240.0, 0.09473868701653664, 0.07040638751912537, 0.04755438000634749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 129.75, 78, 262, 82.5, 247.20000000000002, 261.3, 262.0, 0.09474048213431359, 0.0964983621739151, 0.05005332112760122], "isController": false}, {"data": ["login", 20, 0, 0.0, 2855.1, 2041, 5065, 2746.0, 3659.5000000000005, 4995.449999999999, 5065.0, 0.09512847100008562, 34.27095137686571, 0.19085149494392178], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 86.29411764705883, 82, 91, 86.0, 91.0, 91.0, 91.0, 0.08887773560442087, 0.07195277618756339, 0.031593257578133985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1557c644-2ba4-405a-a034-b6f59d42a258", 3, 0, 0.0, 592.6666666666666, 267, 1071, 440.0, 1071.0, 1071.0, 1071.0, 0.02147043878420062, 0.025377331779112125, 0.013768477996378653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f2402f2-68f8-444b-ad1f-e03c41805560", 3, 0, 0.0, 313.6666666666667, 194, 549, 198.0, 549.0, 549.0, 549.0, 0.016584114629400317, 0.022862540838382277, 0.010634995384088096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90f44ac7-1ab1-415e-a4bd-6d97dde36909", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f88a4565-f026-48c5-80e1-b13054c7112e", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 596.95, 160, 1233, 642.5, 1203.5000000000005, 1232.5, 1233.0, 0.09470235051233972, 56.721852611772455, 0.20087256378203308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3630d537-7c1d-414c-b1e4-ad7f940f578a", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 351.125, 159, 979, 319.5, 968.5, 979.0, 979.0, 0.07739863197917977, 11.679417662972494, 0.1715959416511063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 688.6666666666666, 81, 1055, 938.0, 1055.0, 1055.0, 1055.0, 0.0888195876797363, 70.84732575940748, 0.152967067670657], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1014.0000000000001, 109, 2038, 1082.0, 1891.8999999999999, 2024.4999999999998, 2038.0, 0.08892373980913731, 0.027836035739259427, 0.040119890421700624], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 245.23529411764707, 161, 900, 168.0, 503.99999999999966, 900.0, 900.0, 0.09411504179815092, 6.760474623539833, 0.21025045154459393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 106.13333333333334, 80, 239, 85.0, 238.4, 239.0, 239.0, 0.08846947803007962, 0.06868479983780595, 0.031448134768504866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d78c5058-3a50-4a5e-9274-3cbfb2469e54", 3, 0, 0.0, 310.3333333333333, 187, 458, 286.0, 458.0, 458.0, 458.0, 0.029649835443413288, 0.029736700195688914, 0.019013729109220112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 283.1764705882353, 161, 576, 317.0, 385.59999999999985, 576.0, 576.0, 0.07731349256880901, 0.11982081319013663, 0.17387985682223356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 100.22222222222223, 79, 235, 82.0, 235.0, 235.0, 235.0, 0.04677122634155467, 0.03475869457609679, 0.02347696322222569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 81.66666666666667, 78, 89, 81.0, 89.0, 89.0, 89.0, 0.04677584495366593, 0.01251619288799264, 0.026676849075137597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 98.88888888888889, 79, 234, 82.0, 234.0, 234.0, 234.0, 0.04677535874101523, 0.012607420910664262, 0.02749879488485466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 118.55555555555557, 79, 244, 82.0, 244.0, 244.0, 244.0, 0.04677560184607708, 0.012607486435075466, 0.027544617102719222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 3.510974702380952, 7.359095982142857], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 938.3703703703703, 630, 1813, 885.5, 1280.0, 1363.25, 1813.0, 0.232643301811602, 278.3222688645714, 0.4593796447881438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1014.0000000000001, 109, 2038, 1082.0, 1891.8999999999999, 2024.4999999999998, 2038.0, 0.08927122220418764, 0.027944809081317967, 0.04027666470540497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 132.44444444444446, 79, 238, 82.0, 238.0, 238.0, 238.0, 0.04483590060379013, 0.012084676334615308, 0.026402390687583446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 116.11111111111111, 78, 242, 81.0, 242.0, 242.0, 242.0, 0.04487121959974872, 0.012094195907744772, 0.026379369335008524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 117.46666666666667, 78, 329, 80.0, 272.6, 329.0, 329.0, 0.0884992300566985, 0.02385330810121952, 0.05202786767005127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de4c0dac-9ab7-4fab-b36e-39c11e4a604a", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 138.66666666666663, 78, 320, 83.0, 274.40000000000003, 320.0, 320.0, 0.08849766366167933, 0.023852885908812006, 0.05211337030077406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 79.88888888888887, 78, 82, 80.0, 82.0, 82.0, 82.0, 0.04487077217613274, 0.012006437086191767, 0.025590362256700704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 91.46666666666667, 79, 236, 81.0, 144.80000000000007, 236.0, 236.0, 0.08849818578719137, 0.06576867127348889, 0.04442194091271129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 99.0, 79, 235, 81.0, 235.0, 235.0, 235.0, 0.04487010105743871, 0.0333458465866317, 0.022522687444847166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 100.93333333333335, 78, 238, 80.0, 235.6, 238.0, 238.0, 0.0884992300566985, 0.02368045804251503, 0.05047221714171087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 84.55555555555556, 80, 88, 85.0, 88.0, 88.0, 88.0, 0.04347385047893692, 0.03421867527931949, 0.01545359528743461], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 496.33333333333337, 82, 740, 503.5, 705.2000000000002, 740.0, 740.0, 0.06909576673269151, 0.012983571401837948, 0.0470253822579345], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1520.1999999999998, 998, 2618, 1422.0, 2135.500000000001, 2595.45, 2618.0, 0.09276136674597764, 0.04801125427282046, 0.0426666052122612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 233.7777777777778, 162, 478, 168.0, 478.0, 478.0, 478.0, 0.04481736922042676, 0.06945816889923562, 0.10079531378383089], "isController": false}, {"data": ["addBook", 62, 13, 20.967741935483872, 886.8064516129031, 416, 2857, 705.0, 1386.8, 1915.549999999999, 2857.0, 0.27596398224928453, 75.62499791357877, 1.0050030294836358], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0654a28-b6b1-4067-91a4-08fefd8cb6eb", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fcd4f29-6260-4e89-8176-fcd2d6f73416", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2118ebc1-6b39-4b67-a4d2-df9d32c6a7f9", 3, 0, 0.0, 856.6666666666666, 198, 1925, 447.0, 1925.0, 1925.0, 1925.0, 0.019358710451767774, 0.02288134038097942, 0.012414277210280766], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 147.9074074074074, 78, 443, 83.0, 329.0, 377.25, 443.0, 0.23346101633362445, 0.1734998373338752, 0.11285469051283603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=811ea135-b18f-4c3b-8f7b-e3a893b3fe96", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 519.3888888888888, 387, 737, 485.0, 640.0, 706.0, 737.0, 0.23333491770623135, 68.60821325407149, 0.11735105724483315], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 107.16666666666667, 78, 249, 83.0, 239.5, 247.0, 249.0, 0.23374700782186747, 0.4136226349347889, 0.11367774403836914], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 786.4629629629632, 540, 1468, 774.0, 997.0, 1043.0, 1468.0, 0.23301071417783895, 209.66345020636552, 0.11696045614004807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 88.41176470588233, 81, 110, 86.0, 102.0, 110.0, 110.0, 0.07618125761812576, 0.05691275593541622, 0.027080056418943142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, 7.303370786516854, 160.56179775280907, 79, 2515, 87.0, 275.19999999999993, 361.2999999999999, 2325.400000000002, 0.7238479431332042, 1.5019948072551523, 0.3502961473396555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 107.33333333333333, 85, 238, 90.0, 238.0, 238.0, 238.0, 0.047668229125287995, 0.0369149469690951, 0.016944565821879715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 107.1875, 81, 389, 87.0, 190.20000000000022, 389.0, 389.0, 0.0819735123088352, 0.06652342649281451, 0.029139021953531265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90f44ac7-1ab1-415e-a4bd-6d97dde36909", 3, 0, 0.0, 303.6666666666667, 178, 405, 328.0, 405.0, 405.0, 405.0, 0.02524806221122529, 0.025322031143484736, 0.0161909773945683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1557c644-2ba4-405a-a034-b6f59d42a258", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0654a28-b6b1-4067-91a4-08fefd8cb6eb", 3, 0, 0.0, 376.3333333333333, 210, 624, 295.0, 624.0, 624.0, 624.0, 0.04932831280727428, 0.03171335214660374, 0.031633065179143986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 220.1111111111111, 161, 480, 171.0, 480.0, 480.0, 480.0, 0.04675130384191826, 0.07245538984094167, 0.10514477807415795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 242.60000000000002, 161, 474, 166.0, 435.0, 474.0, 474.0, 0.0884548703251601, 0.13708777266213779, 0.19893707652230833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f2402f2-68f8-444b-ad1f-e03c41805560", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 86.3076923076923, 80, 101, 85.0, 96.6, 101.0, 101.0, 0.06172106824925816, 0.05117303412462908, 0.021939910979228486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4d1149d-04cc-4251-ac30-5d035a591ea9", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 1.040182206840391, 1.9435820439739413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 114.85, 81, 274, 85.5, 263.00000000000006, 273.6, 274.0, 0.09292082680951695, 0.07214068097027927, 0.03303045015494548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 92.00000000000001, 77, 253, 81.0, 122.59999999999988, 253.0, 253.0, 0.07740008559538877, 0.05752096204891685, 0.03885121483987288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 142.35294117647058, 78, 321, 82.0, 265.79999999999995, 321.0, 321.0, 0.07740043799541972, 0.020710664072993167, 0.04414243729426281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 127.82352941176471, 78, 246, 82.0, 245.2, 246.0, 246.0, 0.07734303912647862, 0.02084636601455869, 0.045469247611464966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 160.23529411764707, 77, 322, 85.0, 265.19999999999993, 322.0, 322.0, 0.07740290488548923, 0.02086250170741702, 0.04558003090424805], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5380476556495004], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.15372790161414296], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.07686395080707148], "isController": false}, {"data": ["401/Unauthorized", 15, 60.0, 1.1529592621060722], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1301, 25, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
