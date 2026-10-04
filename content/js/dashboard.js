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

    var data = {"OkPercent": 97.00404858299595, "KoPercent": 2.9959514170040484};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7602217602217602, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f2e221fb-eea4-450e-8318-17971f4bb572"], "isController": false}, {"data": [0.10576923076923077, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ab653aa-9350-410d-9ac6-7b1230d8579d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65114ca4-45c6-47c0-a6c0-4cf0b7871fcd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb6e0e47-7bbc-4deb-bc23-e183648a338c"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c9ab0100-24d8-4c11-b72d-c6b5fc042502"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9005e797-c7e3-4f67-b758-d7817a91fc70"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc1730e3-5c7a-45bd-8752-4ae9f23eba3a"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a0072b6-98f6-4e1f-93a6-5a51654a0bd5"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34bdf22c-4d00-4760-ac8a-b2997e46f97d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1969f922-3574-4bdd-984a-e772eb0b49e7"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f242e69-3d52-4301-b602-150a745033cb"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ab653aa-9350-410d-9ac6-7b1230d8579d"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14921932-7be6-4dcf-9bb2-1f2082669645"], "isController": false}, {"data": [0.3942307692307692, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/efe3edf9-f21e-4bb8-8ce7-2155078fd48b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2e221fb-eea4-450e-8318-17971f4bb572"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9ab0100-24d8-4c11-b72d-c6b5fc042502"], "isController": false}, {"data": [0.2636363636363636, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb864392-99ae-4116-a164-ded3e4383d13"], "isController": false}, {"data": [0.9903846153846154, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5192307692307693, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8950617283950617, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65114ca4-45c6-47c0-a6c0-4cf0b7871fcd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc1730e3-5c7a-45bd-8752-4ae9f23eba3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb864392-99ae-4116-a164-ded3e4383d13"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9005e797-c7e3-4f67-b758-d7817a91fc70"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efe3edf9-f21e-4bb8-8ce7-2155078fd48b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/14921932-7be6-4dcf-9bb2-1f2082669645"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1969f922-3574-4bdd-984a-e772eb0b49e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34bdf22c-4d00-4760-ac8a-b2997e46f97d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1235, 37, 2.9959514170040484, 373.74817813765213, 99, 2807, 126.0, 1006.2000000000003, 1216.4, 1654.040000000001, 4.775973950639245, 660.0397510402728, 3.493994442371203], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/f2e221fb-eea4-450e-8318-17971f4bb572", 3, 0, 0.0, 317.0, 203, 469, 279.0, 469.0, 469.0, 469.0, 0.06617111851247326, 0.029940707920682885, 0.042433952952334736], "isController": false}, {"data": ["see books", 52, 0, 0.0, 1757.8846153846152, 1275, 2279, 1787.0, 2111.1, 2133.0499999999997, 2279.0, 0.24440109980494912, 294.0963741172773, 1.2017182983573427], "isController": true}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 670.5714285714286, 109, 2807, 524.0, 1978.0, 2807.0, 2807.0, 0.08291530201898761, 0.017009898384336114, 0.0555062886074375], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 670.5714285714286, 109, 2807, 524.0, 1978.0, 2807.0, 2807.0, 0.08156416769592878, 0.016732716043089183, 0.05460179390191326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 150.9333333333333, 103, 330, 109.0, 328.2, 330.0, 330.0, 0.08081374049091654, 0.029715885826347436, 0.045636613607956386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 138.3333333333333, 106, 324, 112.0, 317.4, 324.0, 324.0, 0.08089829466394849, 0.06012070531178203, 0.040607151813739764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 217.73333333333335, 104, 881, 113.0, 557.6000000000001, 881.0, 881.0, 0.08090178523272747, 1.6062059253815868, 0.04717690692249609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 187.13333333333335, 100, 916, 108.0, 550.6000000000003, 916.0, 916.0, 0.08081635291962544, 4.868243458252966, 0.04704816587287049], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 218.92857142857144, 106, 308, 211.5, 305.5, 308.0, 308.0, 0.08281524510354864, 0.1463939691276597, 0.053521431772068785], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 110.8125, 104, 124, 110.0, 121.2, 124.0, 124.0, 0.10692971376252247, 0.07946632048171837, 0.05367370397845366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 831.7142857142857, 636, 997, 859.0, 997.0, 997.0, 997.0, 0.03004691611330263, 8.834790988822547, 0.017136131845867906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 145.5, 104, 317, 109.5, 305.1, 317.0, 317.0, 0.10693114302708699, 0.04868813030896418, 0.05986159935573987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1018.8571428571428, 853, 1209, 1090.0, 1209.0, 1209.0, 1209.0, 0.03002487775585485, 27.016437782823626, 0.01709424192545252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 215.0, 104, 415, 115.0, 415.0, 415.0, 415.0, 0.03015252872028361, 0.05335584183706435, 0.016695784945703913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ab653aa-9350-410d-9ac6-7b1230d8579d", 3, 0, 0.0, 376.6666666666667, 225, 619, 286.0, 619.0, 619.0, 619.0, 0.024992502249325203, 0.02506572247075877, 0.016027092913792527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 129.20000000000005, 101, 310, 111.0, 290.70000000000005, 310.0, 310.0, 0.06839992065609203, 0.05083236290945902, 0.034333553923077444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 140.1, 105, 425, 107.5, 393.8000000000001, 425.0, 425.0, 0.06840600331085056, 0.018303950104661185, 0.03901279876321946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 173.39999999999998, 100, 337, 111.0, 336.1, 337.0, 337.0, 0.06840834308152222, 0.018438186221191536, 0.04021662356941052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 128.60000000000002, 101, 321, 109.5, 300.1000000000001, 321.0, 321.0, 0.06840366370022778, 0.01843692498170202, 0.04028067305784898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65114ca4-45c6-47c0-a6c0-4cf0b7871fcd", 3, 0, 0.0, 296.6666666666667, 205, 477, 208.0, 477.0, 477.0, 477.0, 0.0587452024751312, 0.026580674297015744, 0.037671890910159], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 108.42857142857143, 103, 115, 110.0, 115.0, 115.0, 115.0, 0.030153827597644556, 0.022409241017390145, 0.016932080926411738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 23, 0, 0.0, 526.2608695652174, 100, 1249, 318.0, 1217.6000000000001, 1246.3999999999999, 1249.0, 0.10683909567673278, 37.63518284727351, 0.05921694781606953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 218.56249999999997, 103, 1138, 109.0, 937.8000000000002, 1138.0, 1138.0, 0.10694543777446544, 12.053933607770922, 0.0617233923092862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 23, 0, 0.0, 420.3913043478261, 100, 967, 298.0, 912.6, 956.5999999999999, 967.0, 0.10684256979607004, 12.310457869768198, 0.05932321183862126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 220.6875, 103, 734, 110.5, 667.5000000000001, 734.0, 734.0, 0.10693328699557564, 3.955461241695962, 0.06182080654431716], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 429.64285714285717, 109, 1049, 418.5, 1022.0, 1049.0, 1049.0, 0.08205320564291617, 0.016833041140891215, 0.055318375595618356], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 316.80000000000007, 211, 648, 226.0, 636.3000000000001, 648.0, 648.0, 0.0683484953078758, 0.10592681841171767, 0.15371736786527146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb6e0e47-7bbc-4deb-bc23-e183648a338c", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 1.0042010613207546, 1.876351218553459], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 674.952380952381, 144, 1551, 678.0, 1461.2000000000003, 1549.0, 1551.0, 0.08794227636488507, 0.054019230306164755, 0.039762962848575965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 23, 0, 0.0, 142.65217391304347, 101, 328, 107.0, 311.2, 324.79999999999995, 328.0, 0.1068351255312725, 0.07939602590751794, 0.05362622512018952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 23, 0, 0.0, 179.5217391304348, 99, 335, 106.0, 325.0, 333.4, 335.0, 0.10684008825920334, 0.0913802113575659, 0.05742110382069446], "isController": false}, {"data": ["login", 21, 0, 0.0, 2789.047619047619, 1576, 4427, 2842.0, 3933.8, 4384.7, 4427.0, 0.0884683599229904, 35.39860410224625, 0.1823795974584304], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c9ab0100-24d8-4c11-b72d-c6b5fc042502", 3, 0, 0.0, 853.6666666666666, 277, 1492, 792.0, 1492.0, 1492.0, 1492.0, 0.018434765509782715, 0.025413812478492774, 0.011821773455166652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 115.3125, 107, 135, 114.5, 129.4, 135.0, 135.0, 0.0999675105590683, 0.08093072876315198, 0.035535326019043814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9005e797-c7e3-4f67-b758-d7817a91fc70", 3, 0, 0.0, 314.3333333333333, 205, 507, 231.0, 507.0, 507.0, 507.0, 0.016457473887474764, 0.022687956352036336, 0.010553783710392346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc1730e3-5c7a-45bd-8752-4ae9f23eba3a", 3, 0, 0.0, 456.0, 303, 624, 441.0, 624.0, 624.0, 624.0, 0.08922198429693076, 0.04037062440518677, 0.05721592091958125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 0, 0.0, 682.1304347826087, 211, 1361, 663.0, 1329.2, 1358.0, 1361.0, 0.10678205318674788, 50.089261309031905, 0.2294644401254457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a0072b6-98f6-4e1f-93a6-5a51654a0bd5", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.9447808801775147, 1.7653245192307692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 663.076923076923, 106, 1315, 967.0, 1276.2, 1315.0, 1315.0, 0.055735146583435514, 35.910751149001484, 0.08471641796643886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 374.1333333333333, 214, 1028, 232.0, 811.4000000000001, 1028.0, 1028.0, 0.08076457127473415, 6.558325060573429, 0.18026378886794994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34bdf22c-4d00-4760-ac8a-b2997e46f97d", 3, 0, 0.0, 297.0, 207, 462, 222.0, 462.0, 462.0, 462.0, 0.0393623302499508, 0.025306185626189068, 0.02524211933346454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1969f922-3574-4bdd-984a-e772eb0b49e7", 3, 0, 0.0, 420.6666666666667, 308, 486, 468.0, 486.0, 486.0, 486.0, 0.040659221511438796, 0.026139961746449093, 0.02607378462810365], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 1027.2083333333335, 127, 2260, 1071.0, 1551.0, 2094.75, 2260.0, 0.09872886585215351, 0.030563525854621746, 0.04454368752313958], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6f242e69-3d52-4301-b602-150a745033cb", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 385.25, 218, 1248, 230.0, 1043.6000000000001, 1248.0, 1248.0, 0.10684188736194025, 16.122391242470986, 0.2368728464682079], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 119.74999999999999, 104, 142, 120.5, 138.70000000000002, 142.0, 142.0, 0.06492241771083555, 0.05040363484386158, 0.023077890670648575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ab653aa-9350-410d-9ac6-7b1230d8579d", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 328.91666666666663, 210, 655, 227.5, 594.4000000000002, 655.0, 655.0, 0.0647263155623638, 0.10031314726315563, 0.1455710007227772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 161.00000000000003, 100, 346, 109.0, 338.4, 346.0, 346.0, 0.06670326794702734, 0.049571471589538875, 0.03348191379372271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 157.76923076923077, 101, 329, 113.0, 324.6, 329.0, 329.0, 0.06670805987304942, 0.017849617583218305, 0.03804444039634851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 187.38461538461536, 100, 336, 108.0, 334.8, 336.0, 336.0, 0.06670703297379954, 0.017979629981219405, 0.03921643930686261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 203.84615384615387, 104, 454, 113.0, 407.19999999999993, 454.0, 454.0, 0.06670874449011428, 0.017980091288351114, 0.03928259074954971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 116.33333333333333, 109, 126, 114.0, 126.0, 126.0, 126.0, 0.05161911972194501, 0.0152236075742455, 0.03190908474999139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14921932-7be6-4dcf-9bb2-1f2082669645", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1176.0192307692307, 799, 1823, 1077.5, 1632.1000000000001, 1690.7499999999998, 1823.0, 0.22859554414531644, 273.47974346744274, 0.4513869045525682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 1027.2083333333335, 127, 2260, 1071.0, 1551.0, 2094.75, 2260.0, 0.09537282828122268, 0.02952459625502694, 0.04302953775969226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efe3edf9-f21e-4bb8-8ce7-2155078fd48b", 3, 0, 0.0, 569.3333333333334, 292, 994, 422.0, 994.0, 994.0, 994.0, 0.03714388302153107, 0.024315217694107744, 0.023819482276177154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 107.33333333333333, 103, 113, 106.5, 113.0, 113.0, 113.0, 0.028938953278059933, 0.007799952250727092, 0.017041200026045058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 181.5, 104, 331, 111.5, 331.0, 331.0, 331.0, 0.02890716464075621, 0.007791384219578822, 0.01699425108763207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2e221fb-eea4-450e-8318-17971f4bb572", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 125.91666666666667, 103, 307, 110.5, 248.8000000000002, 307.0, 307.0, 0.06442503342048608, 0.01736455978911539, 0.03787487316321545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 175.75000000000003, 104, 331, 110.0, 325.0, 331.0, 331.0, 0.06436145392524417, 0.017347423128288467, 0.03790034835636937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 178.5, 102, 342, 109.0, 342.0, 342.0, 342.0, 0.028905632744300774, 0.0077345150116586055, 0.016485243674484035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 147.16666666666669, 105, 332, 112.5, 328.7, 332.0, 332.0, 0.0644257251920692, 0.04787888366324673, 0.03233869409055036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 193.33333333333331, 104, 394, 114.0, 394.0, 394.0, 394.0, 0.028937697138061755, 0.021505456564516596, 0.014525367508753653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 124.0, 103, 312, 107.5, 252.00000000000023, 312.0, 312.0, 0.06442537930442066, 0.017238822196690682, 0.036742599134552405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 115.0, 110, 122, 114.0, 122.0, 122.0, 122.0, 0.02962582581989473, 0.023318765244956203, 0.010531055271915704], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 486.5, 106, 994, 481.5, 893.0, 994.0, 994.0, 0.08181106319320267, 0.01630400443240653, 0.05566873056987249], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1410.4761904761906, 773, 2316, 1310.0, 1966.0000000000002, 2285.4999999999995, 2316.0, 0.08742314048898676, 0.04524830513590135, 0.04021122965850856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 378.5, 215, 714, 226.0, 714.0, 714.0, 714.0, 0.028889905385559862, 0.04477371078797217, 0.06497407431928161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9ab0100-24d8-4c11-b72d-c6b5fc042502", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["addBook", 55, 15, 27.272727272727273, 1050.2000000000003, 549, 2647, 913.0, 1812.8, 1895.599999999999, 2647.0, 0.2558734589439405, 67.79401823098395, 0.9317074101535241], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/eb864392-99ae-4116-a164-ded3e4383d13", 3, 0, 0.0, 365.3333333333333, 208, 609, 279.0, 609.0, 609.0, 609.0, 0.01796547036595663, 0.024766851236922634, 0.011520825722960471], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 213.21153846153854, 101, 568, 114.5, 444.8, 460.7, 568.0, 0.22955625011036357, 0.17059795540428388, 0.11096713262170896], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 662.6730769230767, 494, 962, 623.5, 893.8, 923.9499999999997, 962.0, 0.22948634776890725, 67.4766059079495, 0.11541549716893285], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 174.73076923076923, 100, 446, 113.0, 331.4, 344.7, 446.0, 0.22993384980013443, 0.40687513265414416, 0.111823298047331], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 961.9230769230766, 689, 1418, 961.0, 1210.9, 1252.8999999999996, 1418.0, 0.22907589901277098, 206.12289660417008, 0.1149853633716448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 113.41666666666666, 107, 121, 114.5, 119.80000000000001, 121.0, 121.0, 0.06639922534237101, 0.04960489002628303, 0.023602849633420943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 15, 9.25925925925926, 177.537037037037, 103, 1087, 116.0, 331.1, 443.49999999999994, 1062.4300000000003, 0.6800236748983113, 1.460426760768091, 0.3260086493134699], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 115.15384615384615, 111, 126, 115.0, 122.39999999999999, 126.0, 126.0, 0.06744732623234048, 0.05223215791234961, 0.023975416746652278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65114ca4-45c6-47c0-a6c0-4cf0b7871fcd", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 155.66666666666666, 109, 339, 116.0, 333.0, 339.0, 339.0, 0.08376425388386924, 0.06797665525146028, 0.02977557462278164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc1730e3-5c7a-45bd-8752-4ae9f23eba3a", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb864392-99ae-4116-a164-ded3e4383d13", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 397.6923076923077, 218, 801, 397.0, 746.5999999999999, 801.0, 801.0, 0.06666564104141987, 0.10331872298118491, 0.14993258917811522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9005e797-c7e3-4f67-b758-d7817a91fc70", 1, 0, 0.0, 1049.0, 1049, 1049, 1049.0, 1049.0, 1049.0, 1049.0, 0.9532888465204957, 0.17222503574833176, 0.6572479742612012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 325.33333333333337, 215, 641, 226.5, 638.9, 641.0, 641.0, 0.06432315955359728, 0.09968833419097546, 0.14466429341009232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efe3edf9-f21e-4bb8-8ce7-2155078fd48b", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 155.8, 110, 334, 116.5, 331.0, 334.0, 334.0, 0.06515464454883665, 0.05401981759957259, 0.023160440054469284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14921932-7be6-4dcf-9bb2-1f2082669645", 3, 0, 0.0, 773.6666666666666, 215, 1658, 448.0, 1658.0, 1658.0, 1658.0, 0.017907133605123828, 0.024686429302636526, 0.011483415755889955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 23, 0, 0.0, 113.43478260869567, 104, 132, 112.0, 124.80000000000001, 130.79999999999998, 132.0, 0.1060064156926367, 0.08229990280824823, 0.03768196807824196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1969f922-3574-4bdd-984a-e772eb0b49e7", 1, 0, 0.0, 720.0, 720, 720, 720.0, 720.0, 720.0, 720.0, 1.3888888888888888, 0.2509223090277778, 0.9575737847222222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 126.41666666666666, 102, 320, 109.5, 258.8000000000002, 320.0, 320.0, 0.06476544116059671, 0.048131348362513766, 0.03250921558256514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 198.08333333333331, 101, 346, 109.0, 343.3, 346.0, 346.0, 0.06476509161561918, 0.017329721779960602, 0.036936341312032814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34bdf22c-4d00-4760-ac8a-b2997e46f97d", 1, 0, 0.0, 995.0, 995, 995, 995.0, 995.0, 995.0, 995.0, 1.0050251256281408, 0.18157192211055276, 0.6929177135678392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 125.66666666666667, 101, 328, 107.0, 263.5000000000002, 328.0, 328.0, 0.06476544116059671, 0.01745631031281708, 0.03807499568230392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 177.41666666666669, 102, 335, 111.0, 331.40000000000003, 335.0, 335.0, 0.06476369347343879, 0.0174558392565128, 0.03813721402781601], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 27.027027027027028, 0.8097165991902834], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.108108108108109, 0.242914979757085], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.108108108108109, 0.242914979757085], "isController": false}, {"data": ["401/Unauthorized", 21, 56.75675675675676, 1.7004048582995952], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1235, 37, "401/Unauthorized", 21, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
