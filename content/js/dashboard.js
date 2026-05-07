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

    var data = {"OkPercent": 98.83990719257541, "KoPercent": 1.160092807424594};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.734375, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e07f95a9-5960-4744-a5ad-0222dc800cda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f1b640b-16d8-4225-a7ba-acc40aa25e5c"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc4395ab-ad44-4d95-8114-6e90b2b560b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5217eb37-8dbf-4933-867b-2a5603195e75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8633bbba-86f6-410c-8f11-18c02bbf5283"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b5010c1-e8ec-4182-a29a-798e3f04f2fe"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3750594a-0d9b-4bf4-bf16-4c50f92df257"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5681818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f324f7cd-e7e7-403d-9a4b-6de69b9b9d55"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0c800a82-1699-4444-8e9d-0cf401b03ca0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ec59c27-33dc-482c-952e-fe0e3d576329"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eeebd656-26e9-435f-8192-66dff2e0bbf7"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74c8d7a1-cbef-4fb1-9526-64917838aa58"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee63c2d0-54cd-4c9f-b202-d63d05707127"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c800a82-1699-4444-8e9d-0cf401b03ca0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.18867924528301888, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/86bb2335-9bbd-4e8d-8aca-f050d5185134"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e07f95a9-5960-4744-a5ad-0222dc800cda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8633bbba-86f6-410c-8f11-18c02bbf5283"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc4395ab-ad44-4d95-8114-6e90b2b560b2"], "isController": false}, {"data": [0.29508196721311475, 500, 1500, "addBook"], "isController": true}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.49056603773584906, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.29245283018867924, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.94, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3750594a-0d9b-4bf4-bf16-4c50f92df257"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f324f7cd-e7e7-403d-9a4b-6de69b9b9d55"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b5010c1-e8ec-4182-a29a-798e3f04f2fe"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5217eb37-8dbf-4933-867b-2a5603195e75"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/beed7dc5-90cd-4c5e-ac1c-9630c22938cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f1b640b-16d8-4225-a7ba-acc40aa25e5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74c8d7a1-cbef-4fb1-9526-64917838aa58"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee63c2d0-54cd-4c9f-b202-d63d05707127"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eeebd656-26e9-435f-8192-66dff2e0bbf7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ec59c27-33dc-482c-952e-fe0e3d576329"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 15, 1.160092807424594, 501.5638051044087, 137, 3334, 170.0, 1401.4000000000012, 1696.9999999999995, 2209.5999999999995, 5.045991500255617, 703.5701912771764, 3.691392758777801], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2444.754716981133, 1750, 3446, 2448.0, 2912.0, 3031.1, 3446.0, 0.24515359103755474, 295.00373891749655, 1.2054182918692267], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e07f95a9-5960-4744-a5ad-0222dc800cda", 3, 0, 0.0, 505.0, 243, 1015, 257.0, 1015.0, 1015.0, 1015.0, 0.038367587062449644, 0.031610795200214856, 0.024604214359708918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f1b640b-16d8-4225-a7ba-acc40aa25e5c", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 756.3076923076924, 461, 1969, 558.0, 1630.9999999999998, 1969.0, 1969.0, 0.07768150582611293, 0.014034256423662982, 0.05279914849118614], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 756.3076923076924, 461, 1969, 558.0, 1630.9999999999998, 1969.0, 1969.0, 0.07643237204926949, 0.013808582840932474, 0.05195012787723785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc4395ab-ad44-4d95-8114-6e90b2b560b2", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 215.50000000000003, 141, 464, 149.0, 450.5, 464.0, 464.0, 0.16688763826177255, 0.04465548133176336, 0.09517810619616715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 181.5, 140, 466, 149.0, 436.30000000000007, 466.0, 466.0, 0.16687216664967042, 0.12401339728554608, 0.08376200552532284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 163.33333333333331, 139, 439, 146.5, 188.8000000000004, 439.0, 439.0, 0.16689382770993852, 0.04498310199994437, 0.09827829893466107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 181.22222222222223, 142, 433, 147.0, 430.3, 433.0, 433.0, 0.16689228030485656, 0.04498268492591837, 0.09811440697609732], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 323.07692307692304, 235, 638, 283.0, 563.9999999999999, 638.0, 638.0, 0.07770100652688455, 0.19195277198340785, 0.05023248664140388], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5217eb37-8dbf-4933-867b-2a5603195e75", 1, 0, 0.0, 1433.0, 1433, 1433, 1433.0, 1433.0, 1433.0, 1433.0, 0.6978367062107467, 0.12607401430565246, 0.48112569783670617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 163.7222222222222, 144, 409, 149.0, 185.80000000000035, 409.0, 409.0, 0.12630603953379038, 0.09386610945821726, 0.06339971125035962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 241.66666666666669, 139, 465, 148.5, 436.20000000000005, 465.0, 465.0, 0.12631135749622818, 0.06541711255745412, 0.07026891600294727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1125.5714285714287, 883, 1187, 1170.0, 1187.0, 1187.0, 1187.0, 0.11208787689548606, 32.95755747506045, 0.06392511729195689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1538.857142857143, 1324, 1771, 1573.0, 1771.0, 1771.0, 1771.0, 0.11165520871548658, 100.4675530711164, 0.06356932293078972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 277.42857142857144, 143, 467, 149.0, 467.0, 467.0, 467.0, 0.11343012704174228, 0.20071815449183303, 0.06280750198502721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 165.94117647058823, 140, 431, 149.0, 218.99999999999983, 431.0, 431.0, 0.08804503762630579, 0.06543190784533076, 0.04419448177726677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 182.05882352941174, 141, 443, 148.0, 441.4, 443.0, 443.0, 0.08791936242947057, 0.02352529815007318, 0.05014151138555743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 183.8235294117647, 137, 465, 149.0, 447.4, 465.0, 465.0, 0.08805279023753534, 0.0237329786187107, 0.05176540988573856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 180.0588235294118, 139, 440, 146.0, 420.79999999999995, 440.0, 440.0, 0.08805780736059672, 0.023734330890160835, 0.051854353357851386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 148.57142857142856, 144, 157, 149.0, 157.0, 157.0, 157.0, 0.1139489834122837, 0.08468278943041788, 0.06398502486529603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 341.8333333333333, 137, 1550, 147.0, 1346.6000000000004, 1550.0, 1550.0, 0.1263086984590339, 18.970501601225894, 0.07244659071771409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1168.0666666666664, 145, 1916, 1607.0, 1869.2, 1916.0, 1916.0, 0.08898327707612817, 53.386200677311045, 0.04721443412567998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 355.38888888888897, 139, 1142, 155.5, 876.5000000000005, 1142.0, 1142.0, 0.12604335891546692, 6.205132612493698, 0.07241748974147107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 773.0666666666666, 143, 1326, 854.0, 1242.0, 1326.0, 1326.0, 0.08898274921101962, 17.450583059464204, 0.04730105125702964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8633bbba-86f6-410c-8f11-18c02bbf5283", 3, 0, 0.0, 343.3333333333333, 235, 443, 352.0, 443.0, 443.0, 443.0, 0.08335880407902414, 0.03771768804356887, 0.053456003917863794], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 725.9230769230769, 243, 1433, 596.0, 1387.8, 1433.0, 1433.0, 0.07621280961453906, 0.013768915799501687, 0.052545159753774], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b5010c1-e8ec-4182-a29a-798e3f04f2fe", 1, 0, 0.0, 983.0, 983, 983, 983.0, 983.0, 983.0, 983.0, 1.0172939979654119, 0.18378846642929808, 0.701376525940997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3750594a-0d9b-4bf4-bf16-4c50f92df257", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 388.4117647058823, 291, 873, 305.0, 668.9999999999998, 873.0, 873.0, 0.08784349389746081, 0.13614025860866238, 0.19756207660727756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 842.5, 184, 1671, 747.0, 1450.7999999999997, 1648.0499999999997, 1671.0, 0.09485048115062256, 0.0582626490661539, 0.0428864968483772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 169.06666666666666, 137, 442, 149.0, 278.2000000000001, 442.0, 442.0, 0.08898063781321185, 0.06612721228110763, 0.04466410921483485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 296.2000000000001, 141, 600, 150.0, 522.0, 600.0, 600.0, 0.08898222135217383, 0.11290777956730912, 0.045765595617328986], "isController": false}, {"data": ["login", 22, 0, 0.0, 3415.318181818182, 1781, 6021, 3108.5, 5397.9, 5927.8499999999985, 6021.0, 0.09055696650627107, 34.59327171386263, 0.1844101294141376], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 154.61111111111111, 141, 192, 151.0, 172.20000000000005, 192.0, 192.0, 0.12003841229193342, 0.09717953495118438, 0.04266990436939821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1358.3333333333335, 293, 2054, 1748.0, 2013.8, 2054.0, 2054.0, 0.08890100576671191, 70.95026632333592, 0.18477634173842952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f324f7cd-e7e7-403d-9a4b-6de69b9b9d55", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c800a82-1699-4444-8e9d-0cf401b03ca0", 3, 0, 0.0, 517.6666666666666, 251, 664, 638.0, 664.0, 664.0, 664.0, 0.018053474391146577, 0.024888171890138592, 0.01157726059588501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ec59c27-33dc-482c-952e-fe0e3d576329", 3, 0, 0.0, 448.0, 313, 548, 483.0, 548.0, 548.0, 548.0, 0.0209133559662319, 0.024718878747847665, 0.013411234131991159], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eeebd656-26e9-435f-8192-66dff2e0bbf7", 3, 0, 0.0, 681.0, 453, 1044, 546.0, 1044.0, 1044.0, 1044.0, 0.06020832078993317, 0.027242697232424187, 0.03861015363156522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 400.7777777777777, 287, 906, 302.0, 897.9, 906.0, 906.0, 0.16664352173309263, 0.25826491112345507, 0.37478518608526595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 0, 0.0, 1688.0, 1477, 1928, 1724.0, 1928.0, 1928.0, 1928.0, 0.11138869882087106, 133.25960876708623, 0.25116846247792113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74c8d7a1-cbef-4fb1-9526-64917838aa58", 3, 0, 0.0, 345.0, 251, 500, 284.0, 500.0, 500.0, 500.0, 0.0844642153274396, 0.0382178578467256, 0.05416487766766147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee63c2d0-54cd-4c9f-b202-d63d05707127", 3, 0, 0.0, 416.6666666666667, 258, 586, 406.0, 586.0, 586.0, 586.0, 0.023153686452778058, 0.027366873538423545, 0.014847904398428638], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1190.5217391304348, 505, 1840, 1154.0, 1797.0, 1837.8, 1840.0, 0.09766537295433507, 0.030470667479129337, 0.04406386943838164], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 622.6666666666666, 289, 1694, 572.5, 1497.8000000000004, 1694.0, 1694.0, 0.12591551069232543, 25.269074724297496, 0.2778174907137311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 171.4375, 145, 428, 152.0, 257.9000000000002, 428.0, 428.0, 0.08722435740180445, 0.06771812903753373, 0.031005533295172676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c800a82-1699-4444-8e9d-0cf401b03ca0", 1, 0, 0.0, 949.0, 949, 949, 949.0, 949.0, 949.0, 949.0, 1.053740779768177, 0.1903730900948367, 0.7265048735511065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 466.87499999999994, 289, 910, 445.0, 707.0000000000002, 910.0, 910.0, 0.08978675645342311, 0.13915193602693604, 0.201932519640853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 203.14285714285714, 144, 509, 156.0, 509.0, 509.0, 509.0, 0.049117292093519324, 0.03650220633121895, 0.024654578257879818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 230.71428571428572, 145, 439, 153.0, 439.0, 439.0, 439.0, 0.049019607843137254, 0.023634453781512604, 0.027368369222689072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 445.5714285714286, 144, 1607, 156.0, 1607.0, 1607.0, 1607.0, 0.049119704720403626, 6.325347489018238, 0.028273981818692156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 290.0, 141, 851, 149.0, 851.0, 851.0, 851.0, 0.04911936004490913, 2.074593997789629, 0.028321751543751317], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1696.849056603773, 1112, 2798, 1618.0, 2298.8, 2389.0, 2798.0, 0.25573226279626343, 305.94469322381883, 0.5049713236074654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86bb2335-9bbd-4e8d-8aca-f050d5185134", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.6002555216165413, 1.1215783599624058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1190.5217391304348, 505, 1840, 1154.0, 1797.0, 1837.8, 1840.0, 0.0951809472573403, 0.029695550290715717, 0.04294296643837033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 189.0, 144, 445, 145.0, 445.0, 445.0, 445.0, 0.04258684674819006, 0.011478486037598101, 0.0250779966691002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 145.71428571428572, 137, 155, 144.0, 155.0, 155.0, 155.0, 0.0425881422443951, 0.011478835214309615, 0.025037169561646335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 252.87499999999997, 139, 1287, 147.0, 687.8000000000006, 1287.0, 1287.0, 0.087951231042387, 4.968391023271345, 0.05123330987967172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 252.875, 142, 961, 149.0, 599.1000000000004, 961.0, 961.0, 0.08795703298938469, 1.6386184801849295, 0.05132258516714585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 149.25, 141, 159, 150.0, 157.6, 159.0, 159.0, 0.08795316493966963, 0.06536363136629746, 0.04414836599510761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 193.57142857142856, 145, 433, 156.0, 433.0, 433.0, 433.0, 0.042586587658406894, 0.011395239275784657, 0.02428766327393518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e07f95a9-5960-4744-a5ad-0222dc800cda", 1, 0, 0.0, 1135.0, 1135, 1135, 1135.0, 1135.0, 1135.0, 1135.0, 0.881057268722467, 0.15917538546255505, 0.6074476872246696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 219.6875, 143, 445, 148.5, 441.5, 445.0, 445.0, 0.0879565494645645, 0.03179191198298041, 0.04970103362688832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 186.71428571428572, 137, 427, 146.0, 427.0, 427.0, 427.0, 0.042586069488297955, 0.03164843640683081, 0.021376210661118313], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 626.3846153846154, 443, 1015, 546.0, 998.6, 1015.0, 1015.0, 0.07875685336079725, 0.014228533077878412, 0.05360695975827704], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 158.71428571428572, 146, 170, 159.0, 170.0, 170.0, 170.0, 0.04049683835397708, 0.031875441126274925, 0.014395360508640289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1689.818181818182, 848, 3334, 1523.5, 2717.2, 3244.8999999999987, 3334.0, 0.0924925480435724, 0.04787211959286462, 0.04254295910988535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 382.5714285714286, 286, 873, 303.0, 873.0, 873.0, 873.0, 0.042548535722534926, 0.06594192010904582, 0.09569265407128703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8633bbba-86f6-410c-8f11-18c02bbf5283", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 0.6666570571955719, 2.5441074723247232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc4395ab-ad44-4d95-8114-6e90b2b560b2", 3, 0, 0.0, 384.6666666666667, 323, 469, 362.0, 469.0, 469.0, 469.0, 0.03243243243243243, 0.032527449324324324, 0.020798141891891893], "isController": false}, {"data": ["addBook", 61, 7, 11.475409836065573, 1437.9344262295085, 755, 2725, 1186.0, 2458.6, 2580.3, 2725.0, 0.2783100647869331, 82.93556612287846, 1.0132047575052467], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 282.566037735849, 142, 627, 154.0, 589.0, 604.5999999999999, 627.0, 0.2575440983526896, 0.19139751840468439, 0.1244964147310365], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 968.88679245283, 704, 1548, 884.0, 1231.0, 1305.1999999999998, 1548.0, 0.25720289426049314, 75.62619085243348, 0.12935497123452538], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 216.99999999999997, 137, 574, 150.0, 441.0, 446.5, 574.0, 0.2581210733940486, 0.45675330565431255, 0.12553153764671504], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1409.0943396226414, 945, 2169, 1405.0, 1740.4, 1801.1999999999998, 2169.0, 0.25649339650491454, 230.7932090424206, 0.12874766191750592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 155.5, 145, 169, 156.0, 165.5, 169.0, 169.0, 0.0929378826426887, 0.06943113302896177, 0.03303651297064325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 7, 4.0, 226.0285714285714, 140, 1172, 158.0, 386.6, 457.5999999999995, 990.3600000000022, 0.7526007732435374, 1.5468045780705038, 0.3653179590434659], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 200.42857142857142, 151, 441, 161.0, 441.0, 441.0, 441.0, 0.05254624069180879, 0.04069254772324645, 0.018678546495916406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3750594a-0d9b-4bf4-bf16-4c50f92df257", 3, 0, 0.0, 505.3333333333333, 302, 616, 598.0, 616.0, 616.0, 616.0, 0.02504821781930216, 0.025121601269944643, 0.01606282197396655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 173.88888888888889, 146, 490, 153.0, 199.30000000000047, 490.0, 490.0, 0.16346695243111686, 0.13265726315454893, 0.05810739324699856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f324f7cd-e7e7-403d-9a4b-6de69b9b9d55", 3, 0, 0.0, 655.0, 256, 1207, 502.0, 1207.0, 1207.0, 1207.0, 0.018322400967422773, 0.02525890888575372, 0.011749716766218377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b5010c1-e8ec-4182-a29a-798e3f04f2fe", 3, 0, 0.0, 494.0, 239, 974, 269.0, 974.0, 974.0, 974.0, 0.025787596166244035, 0.025863145764387332, 0.016536967593587484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 692.1428571428571, 300, 1752, 588.0, 1752.0, 1752.0, 1752.0, 0.04896611544810991, 8.43368927764487, 0.10833616418688269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5217eb37-8dbf-4933-867b-2a5603195e75", 3, 0, 0.0, 695.6666666666666, 244, 956, 887.0, 956.0, 956.0, 956.0, 0.020735129456324906, 0.02858504988526562, 0.01329694174119794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 496.56249999999994, 290, 1434, 442.5, 849.5000000000006, 1434.0, 1434.0, 0.08787780591088092, 6.6984567919245785, 0.19623397259860165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/beed7dc5-90cd-4c5e-ac1c-9630c22938cd", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.858429939516129, 1.6039776545698925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f1b640b-16d8-4225-a7ba-acc40aa25e5c", 3, 0, 0.0, 358.3333333333333, 283, 476, 316.0, 476.0, 476.0, 476.0, 0.024030566881072725, 0.028403316518611676, 0.015410226808500413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 205.35294117647058, 145, 438, 159.0, 436.4, 438.0, 438.0, 0.08678915850252965, 0.0719570269225075, 0.030850833686446085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 154.06666666666663, 146, 171, 154.0, 166.8, 171.0, 171.0, 0.09066183136899365, 0.07038687103354488, 0.032227447869446965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74c8d7a1-cbef-4fb1-9526-64917838aa58", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 0.7434735082304527, 2.837255658436214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee63c2d0-54cd-4c9f-b202-d63d05707127", 1, 0, 0.0, 1320.0, 1320, 1320, 1320.0, 1320.0, 1320.0, 1320.0, 0.7575757575757576, 0.13686671401515152, 0.5223129734848485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 168.49999999999994, 141, 469, 148.0, 252.00000000000023, 469.0, 469.0, 0.09000444396942099, 0.06688806822336853, 0.04517801191433827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eeebd656-26e9-435f-8192-66dff2e0bbf7", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 0.5282574926900584, 2.0159448099415203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 221.125, 138, 465, 147.5, 462.9, 465.0, 465.0, 0.09000444396942099, 0.024083220359005224, 0.051330659451310406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 271.18749999999994, 144, 443, 153.5, 435.3, 443.0, 443.0, 0.0898593700858157, 0.024219908343442512, 0.05282748124185649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 238.125, 138, 469, 148.5, 449.40000000000003, 469.0, 469.0, 0.0898588654195005, 0.024219772320099746, 0.05291493735152227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ec59c27-33dc-482c-952e-fe0e3d576329", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.3031276216442953, 1.1568005453020134], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 53.333333333333336, 0.6187161639597835], "isController": false}, {"data": ["401/Unauthorized", 7, 46.666666666666664, 0.5413766434648105], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 15, "406/Not Acceptable", 8, "401/Unauthorized", 7, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
