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

    var data = {"OkPercent": 98.76256767208044, "KoPercent": 1.237432327919567};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7604790419161677, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.043859649122807015, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9fb12100-ef28-414d-b2ac-4b5f71eca833"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a0832266-f7c8-4399-870c-b5f7e9a5e4d0"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d0aaf254-c68c-4b65-8d18-626721ada03c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25410129-6758-4dff-b257-8e16769449dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/25fdb49a-9d82-4a8d-9ae5-4b0e2be8adaf"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/faac1126-8b97-4a02-951e-36451e184b64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0aaf254-c68c-4b65-8d18-626721ada03c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/97301fc5-be8f-4142-b95e-8baceb7f54a0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/af59486e-7cd8-480e-bf74-0bb90c5aa8b0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8cfee773-0e5c-495a-a584-b1feec5a36a5"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=800265c6-d9ca-4577-879d-24643410e044"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3aa76974-4d95-4a60-8800-84c777a97e04"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/78c95019-3f90-40ec-945c-1029319d18a6"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "register"], "isController": true}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f808c13f-fa36-4d85-ad4d-5a8df3a75d59"], "isController": false}, {"data": [0.40350877192982454, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=011bea93-7635-44f2-a494-3d1976a84a30"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/73a01d0d-6d66-4763-9e93-85291a26aa69"], "isController": false}, {"data": [0.11363636363636363, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25410129-6758-4dff-b257-8e16769449dd"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c42a67a3-e054-464c-a278-b81292434827"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9319526627218935, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3aa76974-4d95-4a60-8800-84c777a97e04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/800265c6-d9ca-4577-879d-24643410e044"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03e82d32-f3b8-413e-9dc1-c408180a75fa"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/011bea93-7635-44f2-a494-3d1976a84a30"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0832266-f7c8-4399-870c-b5f7e9a5e4d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af59486e-7cd8-480e-bf74-0bb90c5aa8b0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73a01d0d-6d66-4763-9e93-85291a26aa69"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25fdb49a-9d82-4a8d-9ae5-4b0e2be8adaf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97301fc5-be8f-4142-b95e-8baceb7f54a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8cfee773-0e5c-495a-a584-b1feec5a36a5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78c95019-3f90-40ec-945c-1029319d18a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 16, 1.237432327919567, 426.37432327919566, 101, 4596, 129.0, 1173.8000000000004, 1413.6999999999991, 2449.299999999997, 5.183465826408015, 741.963641543845, 3.7877417660364725], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1871.9824561403507, 1341, 2552, 1845.0, 2251.8, 2483.5, 2552.0, 0.26518781810907127, 319.10982726590197, 1.3039264298624744], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9fb12100-ef28-414d-b2ac-4b5f71eca833", 2, 0, 0.0, 232.5, 208, 257, 232.5, 257.0, 257.0, 257.0, 0.06850253459377997, 0.04023854937320181, 0.04257994459857514], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 694.6923076923076, 125, 1844, 593.0, 1488.3999999999996, 1844.0, 1844.0, 0.07445675208192533, 0.01410606435927101, 0.05033325660946861], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 694.6923076923076, 125, 1844, 593.0, 1488.3999999999996, 1844.0, 1844.0, 0.07533218596619323, 0.014271918044376454, 0.05092505570235674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 161.21428571428572, 108, 345, 114.0, 344.5, 345.0, 345.0, 0.08786905001004218, 0.032938635236744326, 0.049585701351928094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 145.85714285714283, 108, 342, 116.5, 335.0, 342.0, 342.0, 0.08786574114752659, 0.06529866114576927, 0.04410448334944205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 216.5, 107, 911, 114.5, 627.0, 911.0, 911.0, 0.08786905001004218, 1.8674502245368045, 0.05120382559876481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 241.8571428571429, 106, 1021, 115.0, 683.0, 1021.0, 1021.0, 0.087870704534756, 5.669578936529107, 0.051118978503059784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0832266-f7c8-4399-870c-b5f7e9a5e4d0", 3, 0, 0.0, 490.0, 391, 586, 493.0, 586.0, 586.0, 586.0, 0.027898672023211696, 0.027980406413904698, 0.01789074996280177], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 329.49999999999994, 116, 595, 256.0, 580.5, 595.0, 595.0, 0.07501634284612005, 0.15939926309838928, 0.04849166079485173], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d0aaf254-c68c-4b65-8d18-626721ada03c", 3, 0, 0.0, 345.6666666666667, 221, 586, 230.0, 586.0, 586.0, 586.0, 0.06561105765024933, 0.030413459014959322, 0.042074799339515356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 115.76190476190479, 109, 126, 116.0, 123.80000000000001, 125.9, 126.0, 0.10802802555634433, 0.08028254633630667, 0.0542250050155869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 144.42857142857144, 101, 339, 114.0, 335.4, 338.7, 339.0, 0.10803469457048492, 0.03663453277566853, 0.06118147835190501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 765.8, 683, 898, 691.0, 898.0, 898.0, 898.0, 0.07303961668809163, 21.476072449821782, 0.04165540639242725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1055.4, 894, 1213, 1057.0, 1213.0, 1213.0, 1213.0, 0.07281730139081045, 65.52113579061384, 0.04145750655355712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 250.2, 115, 362, 324.0, 362.0, 362.0, 362.0, 0.07365288866629349, 0.13033108814777716, 0.0407824100329965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25410129-6758-4dff-b257-8e16769449dd", 3, 0, 0.0, 426.33333333333337, 211, 830, 238.0, 830.0, 830.0, 830.0, 0.04045471095109025, 0.026008481161589603, 0.02594263690548431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 117.55555555555554, 109, 129, 117.0, 129.0, 129.0, 129.0, 0.05613212254266041, 0.04171537622555134, 0.028175694323171338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 161.88888888888889, 102, 346, 115.0, 346.0, 346.0, 346.0, 0.056136674089182464, 0.015020945996519526, 0.03201544694148687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 138.77777777777777, 107, 343, 115.0, 343.0, 343.0, 343.0, 0.05613212254266041, 0.015129361154076438, 0.032999548604181216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 211.66666666666666, 108, 346, 116.0, 346.0, 346.0, 346.0, 0.056131772454268196, 0.015129266794314476, 0.03305415897453489], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 163.2, 117, 347, 117.0, 347.0, 347.0, 347.0, 0.07365071883101579, 0.05473456741250294, 0.041356604812337966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 190.1904761904762, 108, 846, 114.0, 345.2, 795.9999999999993, 846.0, 0.10790147054289854, 4.6510280585571, 0.06299270187851322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 728.0, 102, 1552, 676.0, 1471.5, 1548.05, 1552.0, 0.09911146570991065, 44.60369235119652, 0.05400800572864271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 182.04761904761907, 110, 658, 115.0, 344.6, 626.8999999999996, 658.0, 0.10803247147428313, 1.5403569605064151, 0.0631746804682436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 500.2500000000001, 110, 1020, 494.0, 959.6000000000001, 1017.25, 1020.0, 0.09910901000009911, 14.584026322114193, 0.054103453701225976], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 572.3076923076923, 122, 1172, 532.0, 1091.1999999999998, 1172.0, 1172.0, 0.07535314541418146, 0.014275888877296099, 0.05153924196184813], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 359.5555555555555, 231, 473, 443.0, 473.0, 473.0, 473.0, 0.056091541395557554, 0.08693093378393538, 0.1261511912441104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25fdb49a-9d82-4a8d-9ae5-4b0e2be8adaf", 3, 0, 0.0, 849.3333333333334, 233, 2079, 236.0, 2079.0, 2079.0, 2079.0, 0.03469933030292516, 0.02892740394068728, 0.02225184918514406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 668.9999999999999, 118, 1656, 682.0, 1143.5, 1581.149999999999, 1656.0, 0.09911070665933848, 0.06087952586789444, 0.04481275115554074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 113.25, 103, 117, 113.5, 117.0, 117.0, 117.0, 0.09910753663262323, 0.07365315954826786, 0.04974733772379721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 157.9, 103, 346, 114.5, 342.1, 345.85, 346.0, 0.09910606330895323, 0.10094494534300609, 0.05235974633803096], "isController": false}, {"data": ["login", 22, 0, 0.0, 3654.636363636363, 2001, 7085, 3494.0, 5795.799999999999, 6940.849999999998, 7085.0, 0.09710151963878236, 26.535494501902306, 0.18309981153477778], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 156.38095238095238, 110, 429, 120.0, 340.8, 420.1999999999999, 429.0, 0.1082764452327428, 0.08765739560346072, 0.03848889264132654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/faac1126-8b97-4a02-951e-36451e184b64", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.7963489713216957, 1.487979270573566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0aaf254-c68c-4b65-8d18-626721ada03c", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97301fc5-be8f-4142-b95e-8baceb7f54a0", 3, 0, 0.0, 752.6666666666667, 386, 1330, 542.0, 1330.0, 1330.0, 1330.0, 0.018899661696055642, 0.022338760292440765, 0.01211990024128568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af59486e-7cd8-480e-bf74-0bb90c5aa8b0", 3, 0, 0.0, 914.6666666666666, 386, 1332, 1026.0, 1332.0, 1332.0, 1332.0, 0.018786281005191276, 0.025898404966466487, 0.012047191920646749], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8cfee773-0e5c-495a-a584-b1feec5a36a5", 3, 0, 0.0, 435.0, 222, 595, 488.0, 595.0, 595.0, 595.0, 0.0342434480869327, 0.027833948526390283, 0.02195950284220619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 844.6500000000003, 225, 1669, 792.0, 1584.8, 1664.85, 1669.0, 0.09904912836767037, 59.32534968985242, 0.21009248712361334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=800265c6-d9ca-4577-879d-24643410e044", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3aa76974-4d95-4a60-8800-84c777a97e04", 1, 0, 0.0, 1172.0, 1172, 1172, 1172.0, 1172.0, 1172.0, 1172.0, 0.8532423208191127, 0.15415022397610922, 0.5882705844709898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78c95019-3f90-40ec-945c-1029319d18a6", 3, 0, 0.0, 1177.3333333333333, 457, 2509, 566.0, 2509.0, 2509.0, 2509.0, 0.015902043412578514, 0.02192225060295248, 0.010197599454029843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 421.7857142857143, 226, 1364, 344.0, 1010.5, 1364.0, 1364.0, 0.08780181875195986, 7.629320270852933, 0.1958637111947319], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 904.0, 116, 1561, 1143.0, 1561.0, 1561.0, 1561.0, 0.10176933253856331, 86.9731392567931, 0.1831791194771964], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1487.0, 177, 3274, 1404.5, 2486.0, 3162.5499999999984, 3274.0, 0.09528965890633459, 0.03013332430969139, 0.04299201407688143], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 351.1428571428571, 226, 955, 238.0, 462.8, 905.7999999999993, 955.0, 0.10783553540343327, 6.3024414478717885, 0.24121080210381993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 117.46153846153845, 112, 123, 118.0, 122.2, 123.0, 123.0, 0.09610053594529662, 0.07460930280909259, 0.034160737386804654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 398.64705882352933, 227, 1477, 236.0, 836.9999999999994, 1477.0, 1477.0, 0.09040389268526151, 6.493895244489352, 0.2019598450503869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 135.0, 110, 327, 116.0, 267.9000000000002, 327.0, 327.0, 0.06800523640320304, 0.050539047756677266, 0.03413544092895153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 168.41666666666669, 109, 343, 114.0, 342.4, 343.0, 343.0, 0.06791824906753903, 0.03517510881069486, 0.03778394780482559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 308.4166666666667, 110, 1255, 114.5, 1201.6000000000001, 1255.0, 1255.0, 0.06800600719730243, 10.213928923096539, 0.03900604970105692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 245.5, 108, 907, 115.0, 838.9000000000002, 907.0, 907.0, 0.0680071634212137, 3.3480023958356946, 0.03907312611928457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 2.417392418032787, 5.066918545081967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f808c13f-fa36-4d85-ad4d-5a8df3a75d59", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 0.42578125, 0.7955729166666666], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1285.7192982456143, 867, 2077, 1247.0, 1740.0, 1857.699999999999, 2077.0, 0.25972369044581345, 310.7198283374494, 0.5128528340639011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1487.0, 177, 3274, 1404.5, 2486.0, 3162.5499999999984, 3274.0, 0.09775605421017551, 0.03091326927349478, 0.04410478227060653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 173.28571428571428, 112, 338, 117.0, 338.0, 338.0, 338.0, 0.03566097619375118, 0.009611747489721998, 0.02099957875471871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 147.42857142857142, 110, 348, 114.0, 348.0, 348.0, 348.0, 0.03566097619375118, 0.009611747489721998, 0.0209647535826545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 148.46153846153845, 111, 343, 115.0, 337.0, 343.0, 343.0, 0.09593741928342128, 0.025858132541234643, 0.05640070938341759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 147.84615384615384, 108, 344, 114.0, 337.6, 344.0, 344.0, 0.09593600330610227, 0.025857750891097875, 0.05649356444685514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 178.28571428571428, 111, 341, 117.0, 341.0, 341.0, 341.0, 0.03566097619375118, 0.009542097145593577, 0.020337900485498717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 133.3846153846154, 110, 344, 116.0, 254.79999999999993, 344.0, 344.0, 0.09577414982023928, 0.07117590626289268, 0.048074133796487305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 148.85714285714286, 113, 349, 115.0, 349.0, 349.0, 349.0, 0.03566043118555651, 0.026501550910359866, 0.017899864872437544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 164.15384615384613, 109, 341, 116.0, 334.6, 341.0, 341.0, 0.09593529533311686, 0.025670186446556657, 0.05471309811966821], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 119.42857142857143, 117, 125, 118.0, 125.0, 125.0, 125.0, 0.037107521694647504, 0.02920767820887294, 0.01319056435239423], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 933.9999999999999, 116, 3280, 586.0, 2799.5999999999995, 3280.0, 3280.0, 0.07369196757553427, 0.013806172410861062, 0.050153938268805626], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=011bea93-7635-44f2-a494-3d1976a84a30", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 633.0, 1.5797788309636651, 0.2854092614533965, 1.0891834518167456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73a01d0d-6d66-4763-9e93-85291a26aa69", 3, 0, 0.0, 1770.3333333333335, 221, 3280, 1810.0, 3280.0, 3280.0, 3280.0, 0.018913960394166932, 0.02607442131162011, 0.012129069653811478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 2220.59090909091, 959, 4596, 1765.0, 4090.9999999999995, 4537.349999999999, 4596.0, 0.09678540476096203, 0.05009400832354481, 0.044517505510169066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 363.2857142857143, 230, 690, 239.0, 690.0, 690.0, 690.0, 0.035639551756266194, 0.055234344372260206, 0.08015418720183697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25410129-6758-4dff-b257-8e16769449dd", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["addBook", 56, 7, 12.5, 1250.75, 573, 4253, 964.5, 2170.9, 2407.85, 4253.0, 0.27241196472265056, 88.35738416562891, 0.9897118498596592], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c42a67a3-e054-464c-a278-b81292434827", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 1.101158405172414, 2.0575161637931036], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 187.31578947368422, 110, 497, 117.0, 466.0, 474.5999999999999, 497.0, 0.26097706148985855, 0.19394877323611556, 0.12615590374753904], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 684.8947368421053, 538, 1025, 652.0, 913.8, 1018.2, 1025.0, 0.26058572355969245, 76.62085498690215, 0.1310562965168375], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 176.08771929824562, 103, 475, 116.0, 345.2, 364.8999999999993, 475.0, 0.2614894807828169, 0.46271380779146903, 0.1271696888963309], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1094.350877192983, 750, 1536, 1127.0, 1362.2, 1386.1999999999991, 1536.0, 0.2603655166428379, 234.27734954898526, 0.130691284721112], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 146.0, 115, 330, 120.0, 329.2, 330.0, 330.0, 0.09277602230990466, 0.06931021197956745, 0.03297897668047392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, 4.1420118343195265, 209.86982248520712, 105, 2446, 122.0, 382.0, 493.5, 1662.7000000000128, 0.6988669258125879, 1.5547139918120916, 0.3337281797928211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 137.0, 112, 334, 118.0, 272.8000000000002, 334.0, 334.0, 0.0647224754189432, 0.05012199512424018, 0.02300681743407746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 120.14285714285714, 111, 130, 119.0, 128.5, 130.0, 130.0, 0.08592858107361624, 0.0697330574923585, 0.030544925303512025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3aa76974-4d95-4a60-8800-84c777a97e04", 3, 0, 0.0, 435.3333333333333, 237, 574, 495.0, 574.0, 574.0, 574.0, 0.028201319821767656, 0.02351027996860253, 0.01808483074507887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/800265c6-d9ca-4577-879d-24643410e044", 3, 0, 0.0, 323.3333333333333, 255, 435, 280.0, 435.0, 435.0, 435.0, 0.0801239250040062, 0.03625398950376582, 0.05138155346936595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03e82d32-f3b8-413e-9dc1-c408180a75fa", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 464.25, 224, 1372, 234.5, 1322.5000000000002, 1372.0, 1372.0, 0.06787291927081861, 13.620926122448404, 0.14975346576094029], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/011bea93-7635-44f2-a494-3d1976a84a30", 3, 0, 0.0, 448.3333333333333, 382, 529, 434.0, 529.0, 529.0, 529.0, 0.02012396361587378, 0.023785843713944568, 0.01290501573023156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 335.9230769230769, 226, 690, 233.0, 598.3999999999999, 690.0, 690.0, 0.09569096235664758, 0.14830230201171846, 0.21521121709703062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0832266-f7c8-4399-870c-b5f7e9a5e4d0", 1, 0, 0.0, 910.0, 910, 910, 910.0, 910.0, 910.0, 910.0, 1.098901098901099, 0.19853193681318682, 0.7576407967032966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af59486e-7cd8-480e-bf74-0bb90c5aa8b0", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73a01d0d-6d66-4763-9e93-85291a26aa69", 1, 0, 0.0, 970.0, 970, 970, 970.0, 970.0, 970.0, 970.0, 1.0309278350515465, 0.1862516108247423, 0.7107764175257733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25fdb49a-9d82-4a8d-9ae5-4b0e2be8adaf", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97301fc5-be8f-4142-b95e-8baceb7f54a0", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 128.55555555555554, 115, 152, 123.0, 152.0, 152.0, 152.0, 0.05470160275696078, 0.04535318431705049, 0.0194447103550134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 135.65000000000003, 115, 371, 119.0, 165.10000000000005, 360.79999999999984, 371.0, 0.09699038825252417, 0.07530015494214523, 0.03447705207413945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8cfee773-0e5c-495a-a584-b1feec5a36a5", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78c95019-3f90-40ec-945c-1029319d18a6", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 128.7058823529412, 110, 335, 116.0, 171.79999999999984, 335.0, 335.0, 0.09057150620414818, 0.06730948849741872, 0.04546265057512906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 153.05882352941177, 110, 348, 115.0, 333.59999999999997, 348.0, 348.0, 0.09046739714655186, 0.032199907670038795, 0.05114775521118815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 264.9411764705882, 108, 1361, 115.0, 549.7999999999993, 1361.0, 1361.0, 0.09046836002149954, 4.811396128020712, 0.0527281698516851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 201.1764705882353, 108, 921, 116.0, 459.3999999999996, 921.0, 921.0, 0.09058308867018698, 1.5897103106200678, 0.05288349782600587], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.3866976024748647], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07733952049497293], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07733952049497293], "isController": false}, {"data": ["401/Unauthorized", 9, 56.25, 0.6960556844547564], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 16, "401/Unauthorized", 9, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
