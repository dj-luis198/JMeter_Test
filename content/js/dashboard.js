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

    var data = {"OkPercent": 98.8619119878604, "KoPercent": 1.1380880121396055};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8176470588235294, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3793103448275862, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f898b83-40aa-4ffa-b9c1-454183f1c7e4"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4558e487-46b0-4484-a0cf-f84abda631e5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28ce86a8-ee8e-4719-818a-85f48b5ff642"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6db47f42-af2c-4bef-8150-3b48d65580b7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/63f501f9-de1b-4781-9b46-ddda82dc1ebd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c547fa43-ba43-4ea6-a5ad-aff0405fb4e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e98cd026-8002-4fbc-a4f6-b4c6ba05a1d2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d561cc85-4dce-4736-91a3-65efd5306f7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81be44ae-c64f-4c59-b229-555a45d39b06"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/abdb581d-e8f7-4915-a38d-d17c5de8a16b"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee227e0f-027e-4e79-9426-93379ae29e2b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/60563853-ed8f-4be5-9466-b3a962e26a97"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e98cd026-8002-4fbc-a4f6-b4c6ba05a1d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c82503b8-f6af-478a-a48e-430cdcca27c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c547fa43-ba43-4ea6-a5ad-aff0405fb4e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f898b83-40aa-4ffa-b9c1-454183f1c7e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/068a05a2-fd39-4c5d-945c-140cd4ef5fe1"], "isController": false}, {"data": [0.3793103448275862, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/28ce86a8-ee8e-4719-818a-85f48b5ff642"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8275862068965517, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81be44ae-c64f-4c59-b229-555a45d39b06"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6db47f42-af2c-4bef-8150-3b48d65580b7"], "isController": false}, {"data": [0.9224137931034483, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63f501f9-de1b-4781-9b46-ddda82dc1ebd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ee227e0f-027e-4e79-9426-93379ae29e2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/526eaf24-9779-416d-9acf-81e67891ab75"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d561cc85-4dce-4736-91a3-65efd5306f7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=068a05a2-fd39-4c5d-945c-140cd4ef5fe1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abdb581d-e8f7-4915-a38d-d17c5de8a16b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1348061a-ba41-454b-a2db-8e3256efe7eb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c82503b8-f6af-478a-a48e-430cdcca27c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60563853-ed8f-4be5-9466-b3a962e26a97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1318, 15, 1.1380880121396055, 323.0166919575118, 77, 3519, 99.0, 861.1000000000001, 1088.3499999999997, 2023.7199999999993, 5.2078188406083425, 740.820973880398, 3.810276527080263], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1319.2931034482756, 981, 2165, 1279.5, 1601.2, 1643.75, 2165.0, 0.24817611946684925, 298.6386416636358, 1.2202800405425642], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f898b83-40aa-4ffa-b9c1-454183f1c7e4", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 554.0769230769231, 427, 996, 494.0, 960.0, 996.0, 996.0, 0.07854984894259819, 0.014191134818731117, 0.0533893504531722], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 554.0769230769231, 427, 996, 494.0, 960.0, 996.0, 996.0, 0.07870535741313653, 0.014219229610771737, 0.05349504761674123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 122.53333333333332, 77, 244, 81.0, 239.8, 244.0, 244.0, 0.10114700706006109, 0.03719259738770996, 0.057119084585870436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 83.86666666666666, 79, 117, 81.0, 98.4, 117.0, 117.0, 0.10114564298285245, 0.07516780694331124, 0.05077037157537711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 128.0, 79, 618, 81.0, 389.40000000000015, 618.0, 618.0, 0.10114700706006109, 2.00815002545533, 0.05898266551021922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 138.20000000000002, 78, 772, 81.0, 449.8000000000002, 772.0, 772.0, 0.10114768911246275, 6.092969529680103, 0.05888428620075793], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 342.69230769230774, 172, 1437, 249.0, 1042.9999999999995, 1437.0, 1437.0, 0.07841954456341427, 0.17117162758256674, 0.05069701025486352], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4558e487-46b0-4484-a0cf-f84abda631e5", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.9097889957264957, 1.6999421296296298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28ce86a8-ee8e-4719-818a-85f48b5ff642", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6db47f42-af2c-4bef-8150-3b48d65580b7", 3, 0, 0.0, 348.6666666666667, 207, 469, 370.0, 469.0, 469.0, 469.0, 0.02191620703510246, 0.02198041467290061, 0.014054338495817657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63f501f9-de1b-4781-9b46-ddda82dc1ebd", 3, 0, 0.0, 688.0, 197, 1400, 467.0, 1400.0, 1400.0, 1400.0, 0.025531914893617023, 0.025772938829787234, 0.016373005319148936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c547fa43-ba43-4ea6-a5ad-aff0405fb4e6", 3, 0, 0.0, 381.0, 249, 458, 436.0, 458.0, 458.0, 458.0, 0.022400095573741112, 0.02246572085374231, 0.014364644622483724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 82.75000000000001, 79, 100, 82.0, 85.0, 99.24999999999999, 100.0, 0.09865338134464559, 0.07331564765944854, 0.04951937305776156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 104.25000000000003, 77, 242, 81.0, 239.20000000000002, 241.9, 242.0, 0.09866457497767714, 0.04121943864790067, 0.05544101215054241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e98cd026-8002-4fbc-a4f6-b4c6ba05a1d2", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 498.4, 463, 628, 468.0, 628.0, 628.0, 628.0, 0.08008841761304479, 23.548653963976232, 0.045675425669939616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 748.0, 695, 870, 702.0, 870.0, 870.0, 870.0, 0.0795696871319902, 71.59694434995544, 0.045301882419873325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 223.2, 83, 319, 237.0, 319.0, 319.0, 319.0, 0.0803793907242183, 0.14223384374246445, 0.04450694779358572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d561cc85-4dce-4736-91a3-65efd5306f7a", 3, 0, 0.0, 270.6666666666667, 208, 396, 208.0, 396.0, 396.0, 396.0, 0.02374958438227331, 0.028071204717459112, 0.015230039463892715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 81.75, 79, 92, 81.0, 89.9, 92.0, 92.0, 0.09207396608608916, 0.06842606268702524, 0.04621681500805647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 131.91666666666663, 78, 239, 81.0, 238.4, 239.0, 239.0, 0.09207608553868346, 0.03616204336016328, 0.05186772982574601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 161.41666666666669, 79, 896, 80.0, 699.5000000000007, 896.0, 896.0, 0.09207537904364373, 6.9268814189007735, 0.05347085814253268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 163.25, 78, 461, 80.5, 393.80000000000024, 461.0, 461.0, 0.09207608553868346, 2.2788681307403684, 0.05356118647709224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 79.6, 79, 80, 80.0, 80.0, 80.0, 80.0, 0.08058277462609593, 0.059886222158651366, 0.04524911661133316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 165.60000000000002, 79, 868, 80.5, 749.5000000000011, 864.9, 868.0, 0.09866360151744619, 8.901701839212862, 0.057155516035301834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 500.55000000000007, 78, 1016, 491.0, 977.5000000000001, 1014.3, 1016.0, 0.09288845953778703, 41.80311775760292, 0.05061695353719254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 151.5, 78, 621, 81.5, 451.1000000000005, 613.6999999999999, 621.0, 0.09866262807642406, 2.9249422515305037, 0.057251302346690604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 327.85, 79, 699, 347.0, 656.7, 697.0, 699.0, 0.09288845953778703, 13.668663816926134, 0.050707664923459905], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 473.30769230769226, 188, 674, 476.0, 656.4, 674.0, 674.0, 0.07869630490580658, 0.014217594148021696, 0.054257413343261174], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81be44ae-c64f-4c59-b229-555a45d39b06", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 296.3333333333333, 159, 977, 240.0, 782.6000000000007, 977.0, 977.0, 0.09201748332183114, 9.30446674191013, 0.20498751533624723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 796.5238095238095, 102, 2184, 721.0, 1774.2000000000003, 2150.4999999999995, 2184.0, 0.09691934925579786, 0.05953346746278989, 0.04382193232952578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 89.30000000000001, 79, 237, 81.5, 87.50000000000001, 229.5499999999999, 237.0, 0.09288845953778703, 0.06903136494946867, 0.04662565254142825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 160.25000000000003, 78, 253, 158.5, 242.9, 252.5, 253.0, 0.09288889095308646, 0.09461241529694256, 0.04907508789611306], "isController": false}, {"data": ["login", 21, 0, 0.0, 3333.6666666666665, 1936, 5722, 3288.0, 5372.800000000001, 5712.3, 5722.0, 0.09103441100736077, 26.05585269304714, 0.1732930438330689], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 89.85000000000001, 81, 126, 85.0, 102.60000000000001, 124.84999999999998, 126.0, 0.09414334265352425, 0.07621565533180821, 0.033465016333869946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abdb581d-e8f7-4915-a38d-d17c5de8a16b", 3, 0, 0.0, 429.0, 176, 857, 254.0, 857.0, 857.0, 857.0, 0.06120450465154235, 0.039747066009058266, 0.03924898247511017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 599.1, 160, 1098, 650.5, 1060.2, 1096.35, 1098.0, 0.09285352820193785, 55.61450283609495, 0.1969510383345791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee227e0f-027e-4e79-9426-93379ae29e2b", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60563853-ed8f-4be5-9466-b3a962e26a97", 3, 0, 0.0, 970.0, 172, 1658, 1080.0, 1658.0, 1658.0, 1658.0, 0.023389259651967816, 0.02764531308473149, 0.014998971847127798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 255.00000000000003, 161, 853, 167.0, 539.2000000000002, 853.0, 853.0, 0.10109042875820518, 8.208845559939885, 0.22563041465609035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 828.2, 775, 950, 782.0, 950.0, 950.0, 950.0, 0.07946851457452557, 95.07197115690263, 0.17919218764900346], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1040.086956521739, 346, 2075, 1006.0, 1641.4000000000005, 2014.5999999999992, 2075.0, 0.09453621764703465, 0.02963890247561582, 0.04265208257122071], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 97.72222222222223, 80, 255, 83.0, 161.40000000000015, 255.0, 255.0, 0.08901680934083052, 0.06910972990816433, 0.03164269394537335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 281.24999999999994, 163, 950, 168.0, 834.5000000000011, 947.05, 950.0, 0.0986130080418908, 11.935091916568465, 0.2192598600681416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e98cd026-8002-4fbc-a4f6-b4c6ba05a1d2", 3, 0, 0.0, 593.3333333333334, 172, 1044, 564.0, 1044.0, 1044.0, 1044.0, 0.029475049370707697, 0.024572135884890104, 0.018901642988377005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c82503b8-f6af-478a-a48e-430cdcca27c5", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 272.0526315789474, 161, 484, 317.0, 481.0, 484.0, 484.0, 0.1090174657455647, 0.1689557794318469, 0.24518283555862846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 99.99999999999999, 78, 236, 81.0, 236.0, 236.0, 236.0, 0.04685788588933339, 0.034823096837678424, 0.023520462253044296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c547fa43-ba43-4ea6-a5ad-aff0405fb4e6", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 120.87499999999999, 80, 239, 81.5, 239.0, 239.0, 239.0, 0.04685898374579001, 0.012538439010103968, 0.026724264167520866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 80.0, 79, 81, 80.0, 81.0, 81.0, 81.0, 0.04685925821794241, 0.012630034441554791, 0.027548118600782552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 100.875, 78, 239, 80.5, 239.0, 239.0, 239.0, 0.04685898374579001, 0.012629960462732464, 0.02759371796749158], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 909.9827586206894, 622, 1806, 857.5, 1255.6, 1306.1, 1806.0, 0.24869648737650935, 297.5274597904946, 0.49107841550322445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1040.086956521739, 346, 2075, 1006.0, 1641.4000000000005, 2014.5999999999992, 2075.0, 0.09322535405368158, 0.02922792180419433, 0.04206065778593837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 119.5, 80, 233, 82.5, 233.0, 233.0, 233.0, 0.021853266243805965, 0.0058901381672758265, 0.012868671430678708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 81.0, 78, 88, 79.0, 88.0, 88.0, 88.0, 0.021871787581199013, 0.005895130246495047, 0.012858218870978325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 159.6111111111111, 78, 877, 81.5, 305.5000000000009, 877.0, 877.0, 0.08903794500422929, 4.473581892959077, 0.05191947878176305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 141.88888888888886, 78, 467, 81.0, 335.6000000000002, 467.0, 467.0, 0.08903794500422929, 1.4771159342059053, 0.05200642989993124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 91.88888888888889, 79, 239, 81.0, 124.70000000000019, 239.0, 239.0, 0.08903574290434593, 0.06616816440449927, 0.04469176938753302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 122.5, 80, 235, 87.5, 235.0, 235.0, 235.0, 0.021853027463792266, 0.00584739211433504, 0.012463054725444027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 98.27777777777777, 78, 238, 81.0, 238.0, 238.0, 238.0, 0.08903970676256573, 0.031254714776139336, 0.050365016422879244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 127.0, 84, 238, 93.0, 238.0, 238.0, 238.0, 0.021870950456829477, 0.016253704392233625, 0.010978191928525734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 82.25, 81, 84, 82.0, 84.0, 84.0, 84.0, 0.023214109535775844, 0.018272043247886064, 0.00825189049904532], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 779.5384615384614, 396, 1658, 562.0, 1622.0, 1658.0, 1658.0, 0.07703795007940835, 0.01391798902801811, 0.05243696406772229], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1791.5714285714287, 1098, 3330, 1594.0, 3145.0000000000005, 3321.7, 3330.0, 0.09427482458148712, 0.048794586941590015, 0.043362736697148865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f898b83-40aa-4ffa-b9c1-454183f1c7e4", 3, 0, 0.0, 339.0, 189, 539, 289.0, 539.0, 539.0, 539.0, 0.029116319697190272, 0.02427307771630999, 0.01867159824331538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 250.25, 166, 473, 181.0, 473.0, 473.0, 473.0, 0.02184288413442111, 0.033852204220045215, 0.04912515836090997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/068a05a2-fd39-4c5d-945c-140cd4ef5fe1", 3, 0, 0.0, 1352.3333333333333, 488, 2132, 1437.0, 2132.0, 2132.0, 2132.0, 0.06799175033429278, 0.030764496407769192, 0.043601480520363535], "isController": false}, {"data": ["addBook", 58, 8, 13.793103448275861, 1051.5517241379305, 401, 4695, 729.5, 1520.9, 3373.799999999997, 4695.0, 0.2941832863316359, 92.15784787807624, 1.0695498187349104], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/28ce86a8-ee8e-4719-818a-85f48b5ff642", 3, 0, 0.0, 695.6666666666667, 176, 1568, 343.0, 1568.0, 1568.0, 1568.0, 0.023541413269509946, 0.023610382253697965, 0.015096544316710479], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 151.4310344827586, 80, 633, 83.0, 323.0, 324.25, 633.0, 0.2494441266660072, 0.1853779105398745, 0.12058090107389997], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 517.603448275862, 387, 721, 475.0, 645.4000000000001, 713.2, 721.0, 0.24965779664081128, 73.40768163142761, 0.12556031764650177], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 128.01724137931035, 80, 341, 84.5, 242.8, 262.29999999999984, 341.0, 0.2500754538007158, 0.44251633035829774, 0.1216187265554262], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 756.844827586207, 539, 1133, 772.5, 936.1, 1021.05, 1133.0, 0.24941623699702853, 224.42516847690533, 0.12519525958639907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 96.1578947368421, 81, 254, 84.0, 119.0, 254.0, 254.0, 0.1100957833314984, 0.08224929125839481, 0.03913561048111858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81be44ae-c64f-4c59-b229-555a45d39b06", 3, 0, 0.0, 334.3333333333333, 171, 562, 270.0, 562.0, 562.0, 562.0, 0.06560962274466922, 0.04218066566429743, 0.042073879168944776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6db47f42-af2c-4bef-8150-3b48d65580b7", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 0.28722426470588236, 1.0961098966613672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, 4.597701149425287, 204.43678160919532, 78, 3519, 89.0, 329.5, 482.75, 3354.0, 0.707653640145923, 1.5517693819316503, 0.3385478624488069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 102.625, 80, 236, 83.5, 236.0, 236.0, 236.0, 0.04587340088191613, 0.035525006737655754, 0.016306560469743624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63f501f9-de1b-4781-9b46-ddda82dc1ebd", 1, 0, 0.0, 674.0, 674, 674, 674.0, 674.0, 674.0, 674.0, 1.483679525222552, 0.26804757047477745, 1.0229274851632046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 115.46666666666667, 81, 393, 84.0, 306.6, 393.0, 393.0, 0.09997067526858788, 0.08112854604316067, 0.035536450974380844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee227e0f-027e-4e79-9426-93379ae29e2b", 3, 0, 0.0, 1310.6666666666667, 209, 2827, 896.0, 2827.0, 2827.0, 2827.0, 0.018018559115889364, 0.02484003836451545, 0.011554870266374365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/526eaf24-9779-416d-9acf-81e67891ab75", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 1.2572281003937007, 2.349132627952756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d561cc85-4dce-4736-91a3-65efd5306f7a", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.2867683531746032, 1.0943700396825398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=068a05a2-fd39-4c5d-945c-140cd4ef5fe1", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 221.875, 158, 476, 164.5, 476.0, 476.0, 476.0, 0.04683593955822, 0.07258655867079604, 0.10533512578377018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 284.3888888888888, 160, 958, 181.0, 529.6000000000007, 958.0, 958.0, 0.08900008405563493, 6.0455499262659025, 0.198898191320514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abdb581d-e8f7-4915-a38d-d17c5de8a16b", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1348061a-ba41-454b-a2db-8e3256efe7eb", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 1.1570142663043477, 2.1618829257246377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c82503b8-f6af-478a-a48e-430cdcca27c5", 3, 0, 0.0, 695.3333333333334, 452, 902, 732.0, 902.0, 902.0, 902.0, 0.06396588486140725, 0.028942897121535183, 0.041019789445629], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 96.33333333333334, 81, 238, 83.0, 193.00000000000017, 238.0, 238.0, 0.08995502248875563, 0.07458184970014992, 0.031976199400299846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 84.25, 80, 92, 84.0, 87.0, 91.75, 92.0, 0.0930427298736945, 0.07223532250936242, 0.033073782884789835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60563853-ed8f-4be5-9466-b3a962e26a97", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 106.94736842105264, 79, 246, 81.0, 241.0, 246.0, 246.0, 0.10906815611671442, 0.0810555339890817, 0.05474710180077266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 129.1578947368421, 78, 239, 80.0, 237.0, 239.0, 239.0, 0.10907566981072501, 0.029186263211072903, 0.0622072179389291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 105.21052631578948, 78, 241, 80.0, 238.0, 241.0, 241.0, 0.10907629599862219, 0.02939947040587864, 0.064124931827315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 154.84210526315786, 78, 244, 85.0, 240.0, 244.0, 244.0, 0.10907692219370912, 0.029399639185023165, 0.06423182039336583], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 46.666666666666664, 0.5311077389984825], "isController": false}, {"data": ["401/Unauthorized", 8, 53.333333333333336, 0.6069802731411229], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1318, 15, "401/Unauthorized", 8, "406/Not Acceptable", 7, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
