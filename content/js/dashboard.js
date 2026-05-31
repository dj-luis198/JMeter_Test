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

    var data = {"OkPercent": 98.54517611026034, "KoPercent": 1.454823889739663};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.819197896120973, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.375, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb93ad9f-8eb4-460e-a096-8ca512155398"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02953c32-f0bf-4bed-9f54-149c7b025440"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=570efdf0-97c8-4a80-b445-62a795cee7ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ffc2f6a-10cb-4e52-a00c-0bffbb62b412"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6143375-36c5-42da-afd8-887f2c89344e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aade14fc-992b-4373-9e1c-16a6760d4f48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d5bf0e1-c31d-47e0-a7e0-c69d85c9b7d5"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=229e8ff7-25ee-4447-8ed9-0909cca8eddb"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31d90331-293a-493c-aa91-3d7d91936e32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a28d7f09-5bb7-4f18-9a34-e0bdebe0dea2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab71def4-2ab9-4ab8-bc47-f20ae98d985d"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1b3ab205-7c36-4169-8b0a-f1f719ed99ce"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9e9bc22-d4a9-407c-ae63-e3146a98d8c8"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa832c18-5f73-4ecb-a52d-bf3c3dcff2e7"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a28d7f09-5bb7-4f18-9a34-e0bdebe0dea2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fd1fef9-5a2d-4da6-bcf7-c988bb778f5a"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6143375-36c5-42da-afd8-887f2c89344e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aade14fc-992b-4373-9e1c-16a6760d4f48"], "isController": false}, {"data": [0.4067796610169492, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd703ac5-1250-48b1-bf28-0aa70db08916"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb93ad9f-8eb4-460e-a096-8ca512155398"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9655172413793104, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1d5bf0e1-c31d-47e0-a7e0-c69d85c9b7d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/229e8ff7-25ee-4447-8ed9-0909cca8eddb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/570efdf0-97c8-4a80-b445-62a795cee7ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0fd1fef9-5a2d-4da6-bcf7-c988bb778f5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ffc2f6a-10cb-4e52-a00c-0bffbb62b412"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31d90331-293a-493c-aa91-3d7d91936e32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b9e9bc22-d4a9-407c-ae63-e3146a98d8c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b3ab205-7c36-4169-8b0a-f1f719ed99ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1306, 19, 1.454823889739663, 295.1684532924964, 76, 3141, 90.5, 819.3, 1023.5999999999995, 1411.7200000000003, 5.052341640424922, 697.4663633089646, 3.695488942683389], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1322.7142857142862, 942, 1739, 1281.5, 1659.8000000000002, 1712.65, 1739.0, 0.23529807223650817, 283.14293819538983, 1.1569587829207213], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb93ad9f-8eb4-460e-a096-8ca512155398", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02953c32-f0bf-4bed-9f54-149c7b025440", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.6794381648936171, 1.26953125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=570efdf0-97c8-4a80-b445-62a795cee7ba", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ffc2f6a-10cb-4e52-a00c-0bffbb62b412", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 453.7857142857142, 84, 780, 468.0, 779.0, 780.0, 780.0, 0.07157391028721587, 0.014099101747425895, 0.048158617370988026], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 453.7857142857142, 84, 780, 468.0, 779.0, 780.0, 780.0, 0.07194022794775083, 0.014171261420511188, 0.048405094781250324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6143375-36c5-42da-afd8-887f2c89344e", 3, 0, 0.0, 348.0, 167, 550, 327.0, 550.0, 550.0, 550.0, 0.03359161553276302, 0.02800394771465042, 0.021541498242038784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 115.2222222222222, 77, 240, 80.0, 238.2, 240.0, 240.0, 0.10585993554306147, 0.03715895089863323, 0.05987932334917312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 80.33333333333333, 78, 83, 80.0, 82.1, 83.0, 83.0, 0.1058574453069866, 0.07866944910021172, 0.05313547547635851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 135.33333333333334, 77, 626, 80.0, 275.00000000000057, 626.0, 626.0, 0.10585931297305881, 1.7561779752348017, 0.06183167119509283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 126.83333333333337, 78, 764, 80.5, 287.9000000000008, 764.0, 764.0, 0.10585931297305881, 5.318747031895999, 0.061728292959767575], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 199.5, 79, 388, 190.0, 334.5, 388.0, 388.0, 0.07166734068094212, 0.16039666753264703, 0.046321817714118974], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 113.63157894736844, 79, 545, 81.0, 242.0, 545.0, 545.0, 0.09828009828009827, 0.0730382371007371, 0.049332002457002457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 97.4736842105263, 78, 241, 80.0, 237.0, 241.0, 241.0, 0.09820136448211701, 0.034039370994418026, 0.05557139303804011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 592.6, 388, 713, 621.0, 713.0, 713.0, 713.0, 0.05966587112171838, 17.54374720316229, 0.03402819212410501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 785.6, 693, 864, 772.0, 864.0, 864.0, 864.0, 0.05932887180217381, 53.384223136628464, 0.033778058848307944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 177.6, 79, 244, 241.0, 244.0, 244.0, 244.0, 0.05976857607344363, 0.10576236312996079, 0.03309451429066654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aade14fc-992b-4373-9e1c-16a6760d4f48", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 103.46153846153845, 79, 360, 81.0, 253.1999999999999, 360.0, 360.0, 0.07882227396197128, 0.05857788133306655, 0.039565086734817616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 92.0, 78, 239, 80.0, 176.19999999999993, 239.0, 239.0, 0.07882322981215818, 0.030198202527194018, 0.04444464866061143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d5bf0e1-c31d-47e0-a7e0-c69d85c9b7d5", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 186.53846153846152, 78, 852, 80.0, 605.9999999999998, 852.0, 852.0, 0.07882322981215818, 5.4754018942586375, 0.04581837081478966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 145.76923076923077, 78, 620, 80.0, 467.59999999999985, 620.0, 620.0, 0.07882275188416693, 1.8024191195195451, 0.04589506834842082], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 80.4, 79, 85, 79.0, 85.0, 85.0, 85.0, 0.05988669437424393, 0.044505639080859014, 0.03362778248553736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 659.5999999999999, 78, 1027, 928.0, 1022.2, 1027.0, 1027.0, 0.09352962083091716, 56.113814539335436, 0.04962671938619627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 154.21052631578948, 78, 1012, 80.0, 242.0, 1012.0, 1012.0, 0.09828162340550999, 4.679515628394595, 0.05733431464085826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 437.66666666666674, 79, 711, 615.0, 662.4, 711.0, 711.0, 0.09352903764855529, 18.34216468281186, 0.049717746901071225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 133.15789473684208, 78, 630, 80.0, 235.0, 630.0, 630.0, 0.09820237959871407, 1.5447997479041544, 0.057383987132904], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 422.64285714285717, 85, 1149, 402.5, 902.5, 1149.0, 1149.0, 0.07211290821056969, 0.01420527711960441, 0.04898406111568971], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 304.2307692307692, 161, 1213, 174.0, 856.9999999999997, 1213.0, 1213.0, 0.07878358150161507, 7.3629033113345335, 0.17563554298553413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=229e8ff7-25ee-4447-8ed9-0909cca8eddb", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.0565149853801168, 4.0318896198830405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 565.4285714285713, 96, 1299, 498.0, 1154.2, 1287.9999999999998, 1299.0, 0.08535197528857097, 0.052428117633311656, 0.03859176226426597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 82.20000000000002, 78, 103, 81.0, 91.0, 103.0, 103.0, 0.09352787130564907, 0.06950655279648335, 0.04694660727646839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 101.93333333333334, 77, 238, 81.0, 238.0, 238.0, 238.0, 0.09352787130564907, 0.1186756648272852, 0.048103527559546076], "isController": false}, {"data": ["login", 21, 0, 0.0, 2500.2380952380954, 1449, 4532, 2583.0, 3427.8, 4433.899999999999, 4532.0, 0.08671307880980106, 24.81900177116625, 0.16506695875554345], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/31d90331-293a-493c-aa91-3d7d91936e32", 3, 0, 0.0, 267.6666666666667, 222, 355, 226.0, 355.0, 355.0, 355.0, 0.016522826284512054, 0.02277804990719679, 0.010595692636877846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 100.36842105263159, 80, 240, 83.0, 238.0, 240.0, 240.0, 0.09833401477080411, 0.0796082990673795, 0.034954669313059274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 743.6666666666666, 160, 1109, 1011.0, 1104.2, 1109.0, 1109.0, 0.09348065885168358, 74.60520366903795, 0.19429492407812488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a28d7f09-5bb7-4f18-9a34-e0bdebe0dea2", 3, 0, 0.0, 278.0, 190, 426, 218.0, 426.0, 426.0, 426.0, 0.02726529128419522, 0.027345170067254385, 0.01748457806961738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab71def4-2ab9-4ab8-bc47-f20ae98d985d", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 251.44444444444449, 158, 844, 163.0, 370.60000000000076, 844.0, 844.0, 0.10580828714017834, 7.187288521196927, 0.23646131531457393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 518.2222222222222, 79, 943, 779.0, 943.0, 943.0, 943.0, 0.10669195661193764, 70.92417276687807, 0.1650738508387173], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b3ab205-7c36-4169-8b0a-f1f719ed99ce", 3, 0, 0.0, 1113.6666666666665, 175, 2858, 308.0, 2858.0, 2858.0, 2858.0, 0.01676595839806856, 0.023113227153587358, 0.010751607436261416], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 969.7391304347827, 97, 1670, 983.0, 1628.4, 1664.3999999999999, 1670.0, 0.09250991464954832, 0.029003617942096837, 0.04173787164852668], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9e9bc22-d4a9-407c-ae63-e3146a98d8c8", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.2754025342987805, 1.0509956173780488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 294.05263157894746, 159, 1255, 164.0, 783.0, 1255.0, 1255.0, 0.09815925564286564, 6.324783872046828, 0.21944062624313532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 97.53846153846153, 81, 240, 85.0, 183.59999999999997, 240.0, 240.0, 0.09820659646154078, 0.07624437908879388, 0.034909376085938325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa832c18-5f73-4ecb-a52d-bf3c3dcff2e7", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.2005110432330826, 2.2431567199248117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 311.83333333333337, 158, 1017, 244.0, 551.7000000000007, 1017.0, 1017.0, 0.12346356453028974, 8.386566724768848, 0.27591748861391574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 109.9090909090909, 79, 242, 81.0, 240.20000000000002, 242.0, 242.0, 0.05877638258081753, 0.04368049525781459, 0.02950298891263692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a28d7f09-5bb7-4f18-9a34-e0bdebe0dea2", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 93.27272727272727, 77, 234, 79.0, 203.4000000000001, 234.0, 234.0, 0.058776696642781956, 0.01572735828136939, 0.03352108480408658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 112.36363636363636, 78, 243, 80.0, 241.6, 243.0, 243.0, 0.05877638258081753, 0.015842071867485975, 0.03455408429067593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 94.18181818181819, 78, 233, 80.0, 203.2000000000001, 233.0, 233.0, 0.05877701070810268, 0.0158422411674183, 0.03461185298533781], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 90.5, 85, 96, 90.5, 96.0, 96.0, 96.0, 0.09930979691146533, 0.029288631510998562, 0.06138974750484136], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 909.4642857142854, 619, 1407, 794.0, 1277.8000000000002, 1341.15, 1407.0, 0.24634334103156275, 294.71227867590454, 0.48643187066974597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fd1fef9-5a2d-4da6-bcf7-c988bb778f5a", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 969.7391304347827, 97, 1670, 983.0, 1628.4, 1664.3999999999999, 1670.0, 0.09001921714592115, 0.028222736897311557, 0.04061413898575739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 120.75, 78, 237, 81.0, 237.0, 237.0, 237.0, 0.04093767750321105, 0.011033983389537353, 0.02410685501409791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 101.5, 78, 237, 80.5, 237.0, 237.0, 237.0, 0.040937886990962964, 0.011034039853032985, 0.024066999969296583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 103.84615384615384, 78, 238, 80.0, 237.6, 238.0, 238.0, 0.0918572114976965, 0.024758389036488512, 0.054001993478137986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 116.00000000000001, 79, 238, 80.0, 237.6, 238.0, 238.0, 0.09185850963101144, 0.024758738923983552, 0.05409246221435537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 100.625, 78, 234, 80.0, 234.0, 234.0, 234.0, 0.04097080318138287, 0.010962890695018462, 0.023366161189382416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 92.84615384615385, 79, 238, 81.0, 175.99999999999994, 238.0, 238.0, 0.09185786055976768, 0.06826546082615546, 0.04610834016378963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 103.25, 81, 244, 82.5, 244.0, 244.0, 244.0, 0.040969754079051145, 0.03044724888101359, 0.020564896090461218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 133.53846153846155, 78, 318, 80.0, 285.2, 318.0, 318.0, 0.09185786055976768, 0.024579154095094084, 0.0523876861004925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 105.75, 81, 239, 84.5, 239.0, 239.0, 239.0, 0.040818617371383085, 0.032128716407553486, 0.01450974289373383], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 582.0, 84, 2858, 420.0, 1781.0, 2858.0, 2858.0, 0.06991784653032686, 0.013499762778734985, 0.047580811296726346], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1424.5238095238094, 753, 3141, 1306.0, 2387.0, 3066.8999999999987, 3141.0, 0.08477210432620305, 0.043876186809460566, 0.03899185657972816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 225.875, 162, 481, 165.0, 481.0, 481.0, 481.0, 0.04091987887715852, 0.06341782009575252, 0.09202976665439071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6143375-36c5-42da-afd8-887f2c89344e", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aade14fc-992b-4373-9e1c-16a6760d4f48", 3, 0, 0.0, 287.6666666666667, 173, 504, 186.0, 504.0, 504.0, 504.0, 0.022507990336569483, 0.02660368258856894, 0.014433834948906862], "isController": false}, {"data": ["addBook", 59, 4, 6.779661016949152, 869.9152542372882, 430, 1845, 676.0, 1534.0, 1633.0, 1845.0, 0.27704082830512056, 79.65628154861128, 1.010229637205644], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fd703ac5-1250-48b1-bf28-0aa70db08916", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb93ad9f-8eb4-460e-a096-8ca512155398", 3, 0, 0.0, 578.3333333333334, 191, 1146, 398.0, 1146.0, 1146.0, 1146.0, 0.021847576739613298, 0.025823096074718714, 0.014010327531587955], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 144.94642857142858, 79, 370, 81.0, 322.0, 324.0, 370.0, 0.24709988571630284, 0.18363575491221337, 0.11944769866168937], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 512.3749999999997, 386, 725, 469.0, 659.3, 704.3, 725.0, 0.2470671802134484, 72.64595438522186, 0.12425741973625579], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 119.73214285714288, 78, 325, 81.5, 238.3, 242.15, 325.0, 0.24739790418632596, 0.4377783226422096, 0.12031655887186556], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 761.1964285714286, 538, 1091, 708.5, 960.9000000000002, 1029.55, 1091.0, 0.24672972961065168, 222.0078444082672, 0.12384675880847164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 82.94444444444446, 80, 86, 83.0, 85.1, 86.0, 86.0, 0.12310470054781593, 0.09196786710847575, 0.043759874022856436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 4, 2.2988505747126435, 146.43103448275875, 80, 1360, 87.0, 241.5, 324.75, 1035.25, 0.7413214267455137, 1.5305814393778012, 0.35780441842481975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 83.63636363636364, 81, 89, 83.0, 88.6, 89.0, 89.0, 0.06159773320341812, 0.04770215081085016, 0.021896069224652533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 84.72222222222221, 80, 97, 83.0, 91.60000000000001, 97.0, 97.0, 0.10391109828258045, 0.08432629167268005, 0.03693714821763602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 223.63636363636363, 159, 485, 164.0, 482.0, 485.0, 485.0, 0.05875064091608272, 0.0910520186853743, 0.1321315683884165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d5bf0e1-c31d-47e0-a7e0-c69d85c9b7d5", 3, 0, 0.0, 572.6666666666666, 281, 920, 517.0, 920.0, 920.0, 920.0, 0.01730952312263797, 0.023862575007933533, 0.011100182471222918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 263.9230769230769, 159, 472, 317.0, 443.2, 472.0, 472.0, 0.09180596456289768, 0.1422813142200377, 0.2064737660042513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/229e8ff7-25ee-4447-8ed9-0909cca8eddb", 3, 0, 0.0, 375.0, 323, 414, 388.0, 414.0, 414.0, 414.0, 0.10539258738802038, 0.04768740119444932, 0.06758574126119796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/570efdf0-97c8-4a80-b445-62a795cee7ba", 3, 0, 0.0, 534.3333333333334, 197, 1010, 396.0, 1010.0, 1010.0, 1010.0, 0.050074276843985244, 0.03219293514546577, 0.03211143404383168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fd1fef9-5a2d-4da6-bcf7-c988bb778f5a", 3, 0, 0.0, 276.3333333333333, 188, 442, 199.0, 442.0, 442.0, 442.0, 0.018222902543917195, 0.025121742276526474, 0.01168591081104065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ffc2f6a-10cb-4e52-a00c-0bffbb62b412", 3, 0, 0.0, 285.3333333333333, 187, 411, 258.0, 411.0, 411.0, 411.0, 0.03683919690550746, 0.03071132268066556, 0.023624094369742738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 95.23076923076924, 81, 242, 83.0, 179.99999999999994, 242.0, 242.0, 0.08410211290385187, 0.06972919321813499, 0.029895672946291096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31d90331-293a-493c-aa91-3d7d91936e32", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 83.80000000000001, 79, 90, 83.0, 88.8, 90.0, 90.0, 0.0920589914016902, 0.07147158023861691, 0.032724094599819564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9e9bc22-d4a9-407c-ae63-e3146a98d8c8", 3, 0, 0.0, 362.0, 190, 704, 192.0, 704.0, 704.0, 704.0, 0.04415855866464519, 0.027469728388065415, 0.02831782570616895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 109.33333333333334, 78, 264, 81.0, 246.00000000000003, 264.0, 264.0, 0.12366289494837075, 0.09190181939034194, 0.06207297656588141], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b3ab205-7c36-4169-8b0a-f1f719ed99ce", 1, 0, 0.0, 1149.0, 1149, 1149, 1149.0, 1149.0, 1149.0, 1149.0, 0.8703220191470844, 0.15723591166231504, 0.6000462358572671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 123.05555555555557, 78, 236, 80.5, 236.0, 236.0, 236.0, 0.12353304508956145, 0.043362565197996014, 0.06987605946743532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 170.72222222222223, 77, 936, 80.5, 308.70000000000095, 936.0, 936.0, 0.12353389289611487, 6.2067805630571895, 0.0720346289522267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 165.83333333333334, 76, 619, 80.0, 347.20000000000044, 619.0, 619.0, 0.12366629337766998, 2.05159106562558, 0.07223260169835043], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 36.8421052631579, 0.5359877488514548], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.526315789473685, 0.15313935681470137], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 10.526315789473685, 0.15313935681470137], "isController": false}, {"data": ["401/Unauthorized", 8, 42.10526315789474, 0.6125574272588055], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1306, 19, "401/Unauthorized", 8, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
