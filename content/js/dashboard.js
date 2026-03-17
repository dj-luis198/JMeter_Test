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

    var data = {"OkPercent": 98.53157121879589, "KoPercent": 1.4684287812041117};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8321744627054362, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89316c50-e338-4a49-85f6-2708cb1ebea7"], "isController": false}, {"data": [0.47413793103448276, 500, 1500, "see books"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3481c9b-694b-4ee9-91aa-f8ae30d47ca6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a3a0193-aff1-4850-bec3-c10aa123c7af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba9b0f2e-9383-4f2a-a86e-4c6315ee816a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/850e04e0-488d-4b88-895a-481469b20f85"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c5d06a4-c9b4-4c05-8e20-9000b63e8c76"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f9519dba-0e34-47f8-938f-e7124e8b7364"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a966f44c-90b1-44c0-b040-84ae2fc8b89e"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e534ae4e-5152-4769-a481-f4098a5d2697"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf5a03de-66ba-4b76-a336-3637d447516e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=477cab33-3c6b-4e13-9e65-e392ae2fd281"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a3a0193-aff1-4850-bec3-c10aa123c7af"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22f96e70-1b69-4581-8b78-d981ac68b168"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89316c50-e338-4a49-85f6-2708cb1ebea7"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a729847-6c71-4112-94ea-db6ea139366d"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=850e04e0-488d-4b88-895a-481469b20f85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3481c9b-694b-4ee9-91aa-f8ae30d47ca6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e4625833-6fc3-4d8b-aa5d-23bf41927db3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac1702f4-cf04-4efe-b892-6c83481ab504"], "isController": false}, {"data": [0.40625, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8362068965517241, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9354838709677419, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9519dba-0e34-47f8-938f-e7124e8b7364"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf5a03de-66ba-4b76-a336-3637d447516e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/22f96e70-1b69-4581-8b78-d981ac68b168"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c5d06a4-c9b4-4c05-8e20-9000b63e8c76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4625833-6fc3-4d8b-aa5d-23bf41927db3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/477cab33-3c6b-4e13-9e65-e392ae2fd281"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f32882b5-d1f8-4588-be44-92545a572d09"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e534ae4e-5152-4769-a481-f4098a5d2697"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1a729847-6c71-4112-94ea-db6ea139366d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a966f44c-90b1-44c0-b040-84ae2fc8b89e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1362, 20, 1.4684287812041117, 270.75110132158585, 80, 2079, 95.0, 657.7, 819.8499999999999, 1380.5499999999984, 5.360811757574803, 738.0703096402608, 3.9201758536659765], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/89316c50-e338-4a49-85f6-2708cb1ebea7", 3, 0, 0.0, 447.66666666666663, 192, 945, 206.0, 945.0, 945.0, 945.0, 0.028897001454482405, 0.024090241121396305, 0.018530954708766388], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1218.5344827586205, 990, 1574, 1211.0, 1422.9, 1527.85, 1574.0, 0.24987506246876562, 300.68393705894897, 1.228633730009995], "isController": true}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 434.2857142857142, 83, 633, 433.5, 591.0, 633.0, 633.0, 0.08330556481172943, 0.015730201168063025, 0.05633701526574475], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 434.2857142857142, 83, 633, 433.5, 591.0, 633.0, 633.0, 0.08356363072037819, 0.015778930549669626, 0.05651153737681825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3481c9b-694b-4ee9-91aa-f8ae30d47ca6", 3, 0, 0.0, 327.3333333333333, 264, 368, 350.0, 368.0, 368.0, 368.0, 0.04170315692897952, 0.034766206020545753, 0.026743235400419813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 116.66666666666666, 81, 260, 83.5, 248.3, 260.0, 260.0, 0.11263022870193662, 0.030137385414385383, 0.06423442730657322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 98.38888888888889, 82, 248, 84.0, 177.80000000000013, 248.0, 248.0, 0.1126288192119737, 0.08370169084014842, 0.05653438776851023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 104.22222222222223, 82, 283, 84.0, 248.80000000000007, 283.0, 283.0, 0.11262952395254543, 0.03035717637783451, 0.06632383099939931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 128.44444444444443, 81, 248, 84.0, 247.1, 248.0, 248.0, 0.11251476756324268, 0.03032624594478025, 0.06614637702448446], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 218.35714285714283, 83, 364, 190.5, 357.0, 364.0, 364.0, 0.08288682987478167, 0.18943826596311536, 0.05357925868091531], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7a3a0193-aff1-4850-bec3-c10aa123c7af", 2, 0, 0.0, 187.5, 187, 188, 187.5, 188.0, 188.0, 188.0, 0.015104371205026735, 0.025363248327190887, 0.009388605734374528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 95.85714285714286, 82, 249, 84.0, 169.0, 249.0, 249.0, 0.08690901867302345, 0.06458765938493247, 0.04362425351360747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 83.50000000000001, 82, 85, 83.5, 85.0, 85.0, 85.0, 0.08691009771178129, 0.03257916190730417, 0.049044551512856485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 489.0, 401, 573, 491.0, 573.0, 573.0, 573.0, 0.05757383844780931, 16.92862013501065, 0.03283507973976625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba9b0f2e-9383-4f2a-a86e-4c6315ee816a", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.6680668148535566, 1.2482838650627615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 689.75, 575, 732, 726.0, 732.0, 732.0, 732.0, 0.05730987449137487, 51.56752580735285, 0.03262857112155424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 213.25, 106, 252, 247.5, 252.0, 252.0, 252.0, 0.057698410408793234, 0.10209914029368491, 0.03194824091971266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 118.92857142857143, 82, 248, 84.0, 248.0, 248.0, 248.0, 0.07425676930012995, 0.055184962341209856, 0.03727341740260429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 141.92857142857142, 82, 255, 84.0, 252.0, 255.0, 255.0, 0.07425795090488617, 0.03580294061485583, 0.04145930796893896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/850e04e0-488d-4b88-895a-481469b20f85", 3, 0, 0.0, 274.0, 160, 484, 178.0, 484.0, 484.0, 484.0, 0.027562129633883044, 0.02764287806054481, 0.017674933391520053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 199.9285714285714, 82, 734, 83.5, 730.0, 734.0, 734.0, 0.07425795090488617, 9.56250339796427, 0.04274390421785161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 164.7142857142857, 81, 576, 83.5, 493.0, 576.0, 576.0, 0.07425755703245585, 3.1363251062148274, 0.042816194644969316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 83.5, 82, 85, 83.5, 85.0, 85.0, 85.0, 0.05783773623100392, 0.042982927023236306, 0.03247724446565161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 500.5, 82, 743, 570.0, 741.0, 743.0, 743.0, 0.07616270529929223, 48.956819571231165, 0.0401001743581932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 147.64285714285714, 81, 735, 83.5, 534.5, 735.0, 735.0, 0.08691117677733357, 5.607668446664473, 0.05056077108837625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 442.07142857142844, 82, 649, 568.0, 646.0, 649.0, 649.0, 0.0761631196413805, 16.001926688917177, 0.04017477055860208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 129.50000000000003, 82, 571, 83.0, 408.0, 571.0, 571.0, 0.08691009771178129, 1.8470699463330145, 0.05064501648187924], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 436.14285714285717, 83, 876, 393.5, 769.5, 876.0, 876.0, 0.08347743128018603, 0.01576265391151392, 0.05712870244767754], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 354.85714285714283, 167, 820, 251.0, 814.0, 820.0, 820.0, 0.074223699627291, 12.783934644707054, 0.1642178644516194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c5d06a4-c9b4-4c05-8e20-9000b63e8c76", 3, 0, 0.0, 307.0, 243, 388, 290.0, 388.0, 388.0, 388.0, 0.025680973822527348, 0.03035404165025938, 0.016468593239055626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9519dba-0e34-47f8-938f-e7124e8b7364", 3, 0, 0.0, 491.0, 167, 944, 362.0, 944.0, 944.0, 944.0, 0.08169934640522876, 0.036966826661220045, 0.05239183346949891], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 622.85, 100, 2079, 546.5, 926.0000000000001, 2021.5499999999993, 2079.0, 0.10287642483848401, 0.06319264767910786, 0.04651541474630674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 83.64285714285712, 82, 85, 84.0, 85.0, 85.0, 85.0, 0.07616146230007616, 0.056600461728865195, 0.03822948400609292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 130.71428571428575, 82, 248, 84.5, 247.5, 248.0, 248.0, 0.07616063365647202, 0.10208584935426662, 0.03886657336989044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a966f44c-90b1-44c0-b040-84ae2fc8b89e", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.49769714187327824, 1.8993199035812673], "isController": false}, {"data": ["login", 20, 0, 0.0, 2281.8500000000004, 1341, 3651, 2242.0, 3116.600000000001, 3626.0999999999995, 3651.0, 0.10205487490623708, 24.56020328693238, 0.18782482153153748], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e534ae4e-5152-4769-a481-f4098a5d2697", 3, 0, 0.0, 253.0, 169, 384, 206.0, 384.0, 384.0, 384.0, 0.03818591448900882, 0.03183402571821341, 0.02448771209093339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 87.57142857142857, 84, 93, 87.5, 91.5, 93.0, 93.0, 0.09428688806125954, 0.0763318654324064, 0.03351604224052585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf5a03de-66ba-4b76-a336-3637d447516e", 3, 0, 0.0, 273.3333333333333, 182, 454, 184.0, 454.0, 454.0, 454.0, 0.02188822413541515, 0.030174683988764044, 0.014036393732671822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=477cab33-3c6b-4e13-9e65-e392ae2fd281", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a3a0193-aff1-4850-bec3-c10aa123c7af", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.2724948152337858, 1.039899132730015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 591.7857142857143, 168, 828, 694.5, 826.5, 828.0, 828.0, 0.07612501903125475, 65.08512833182897, 0.15729459498771126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22f96e70-1b69-4581-8b78-d981ac68b168", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89316c50-e338-4a49-85f6-2708cb1ebea7", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.4949700342465754, 1.8889126712328768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 258.77777777777777, 167, 509, 217.0, 380.3000000000002, 509.0, 509.0, 0.11245501799280287, 0.17428331401814276, 0.2529139711302979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 543.1666666666666, 82, 816, 731.0, 816.0, 816.0, 816.0, 0.06321845135866988, 50.42646936802621, 0.10899626550169109], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1000.391304347826, 122, 1822, 1008.0, 1671.4, 1797.3999999999996, 1822.0, 0.0936695663506337, 0.02951036779558857, 0.04226107388085231], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a729847-6c71-4112-94ea-db6ea139366d", 1, 0, 0.0, 876.0, 876, 876, 876.0, 876.0, 876.0, 876.0, 1.141552511415525, 0.2062375142694064, 0.787046946347032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 256.57142857142856, 166, 984, 169.0, 702.5, 984.0, 984.0, 0.0868637232273596, 7.547806797629241, 0.19377105669719308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 113.10526315789473, 84, 257, 87.0, 252.0, 257.0, 257.0, 0.10779774872912128, 0.08369063499965959, 0.03831873099355483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 314.59999999999997, 167, 986, 173.0, 826.4000000000001, 986.0, 986.0, 0.14078690494068177, 22.64644441205042, 0.3118301623038369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 83.5, 81, 86, 83.0, 86.0, 86.0, 86.0, 0.10783498166805312, 0.08013908305604338, 0.054128106032596976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 107.64285714285715, 83, 248, 84.0, 246.0, 248.0, 248.0, 0.10770142088945987, 0.04037300752371354, 0.06077737827816199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 152.07142857142858, 81, 719, 82.5, 483.0, 719.0, 719.0, 0.10769893531909656, 6.948932734802911, 0.06265409602129363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 118.64285714285714, 81, 571, 83.5, 332.5, 571.0, 571.0, 0.10783332049603327, 2.2917438910498342, 0.06283758087499036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 3.5532756024096384, 7.447759789156626], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 783.3620689655172, 645, 1201, 658.0, 1067.1, 1177.1499999999999, 1201.0, 0.260319654582748, 311.4328086358801, 0.5140296304358559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1000.391304347826, 122, 1822, 1008.0, 1671.4, 1797.3999999999996, 1822.0, 0.0906668348602154, 0.028564364583169084, 0.04090632588419874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 14, 0, 0.0, 115.5, 83, 344, 84.0, 294.5, 344.0, 344.0, 0.061910742398245275, 0.016686879787027046, 0.036457204752091694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=850e04e0-488d-4b88-895a-481469b20f85", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 14, 0, 0.0, 135.35714285714286, 82, 396, 85.0, 351.5, 396.0, 396.0, 0.06191019484022747, 0.016686732203030064, 0.03639642313849311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 108.89473684210526, 82, 248, 83.0, 246.0, 248.0, 248.0, 0.10640204291922405, 0.028678675630572106, 0.06255276351305945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 125.42105263157895, 80, 247, 83.0, 247.0, 247.0, 247.0, 0.10640144705968001, 0.02867851502780438, 0.06265632087596391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 14, 0, 0.0, 119.92857142857144, 82, 247, 84.0, 246.5, 247.0, 247.0, 0.061910468618025676, 0.016565887110682652, 0.035308314133717766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 84.10526315789474, 81, 88, 84.0, 87.0, 88.0, 88.0, 0.10639906368823955, 0.07907196041674833, 0.05340734251538586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 14, 0, 0.0, 122.71428571428572, 83, 252, 85.5, 250.5, 252.0, 252.0, 0.06190882598755632, 0.046008414625517934, 0.031075328669535107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 91.6842105263158, 81, 246, 83.0, 89.0, 246.0, 246.0, 0.10630441107356266, 0.028444734994293133, 0.0606267344403912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3481c9b-694b-4ee9-91aa-f8ae30d47ca6", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 14, 0, 0.0, 120.78571428571429, 85, 395, 87.0, 293.5, 395.0, 395.0, 0.06319799933190687, 0.049743737755387624, 0.02246491382501377], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 453.3846153846155, 82, 945, 434.0, 817.3999999999999, 945.0, 945.0, 0.08485695076338619, 0.015897929327214927, 0.05775270236750892], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1263.25, 716, 1912, 1245.5, 1870.6000000000001, 1910.05, 1912.0, 0.10134073796325385, 0.05245174914113724, 0.04661278084052008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 14, 0, 0.0, 285.00000000000006, 169, 597, 186.0, 546.0, 597.0, 597.0, 0.061885564749982316, 0.09591053833810737, 0.13918208556563408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4625833-6fc3-4d8b-aa5d-23bf41927db3", 3, 0, 0.0, 375.3333333333333, 189, 626, 311.0, 626.0, 626.0, 626.0, 0.020217404489611623, 0.027871324223146234, 0.012964937123872037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac1702f4-cf04-4efe-b892-6c83481ab504", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 1.1827256944444444, 2.209924768518518], "isController": false}, {"data": ["addBook", 64, 10, 15.625, 826.4531250000002, 425, 2616, 716.5, 1340.5, 1490.75, 2616.0, 0.291577067463644, 88.3183271278292, 1.0607575138043517], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 154.31034482758622, 83, 374, 85.0, 334.2, 339.05, 374.0, 0.2609861677331102, 0.19395554066884454, 0.12616030569129835], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 469.5689655172414, 400, 668, 410.0, 582.6, 666.1, 668.0, 0.26095446344612866, 76.72927675683094, 0.13124174675269165], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 131.3793103448276, 82, 300, 87.0, 249.1, 257.0, 300.0, 0.2613307140185905, 0.462432865040709, 0.12709247615357233], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 626.0689655172413, 560, 833, 570.0, 736.1, 819.2, 833.0, 0.2607667441473602, 234.63837476283715, 0.1308926821208429], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 89.73333333333333, 85, 99, 87.0, 97.2, 99.0, 99.0, 0.15462642256308756, 0.1155168098249629, 0.05496486114547254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 10, 5.376344086021505, 149.5107526881721, 83, 1608, 88.5, 263.80000000000007, 356.35000000000014, 895.4699999999963, 0.7786401426669681, 1.6277349865831094, 0.37607455479366036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 104.57142857142857, 84, 248, 87.5, 183.0, 248.0, 248.0, 0.10947078693857125, 0.0847757168381709, 0.03891344379457025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9519dba-0e34-47f8-938f-e7124e8b7364", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 110.16666666666667, 84, 282, 89.0, 270.3, 282.0, 282.0, 0.1126767616698696, 0.09143983295670083, 0.040053067624836465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf5a03de-66ba-4b76-a336-3637d447516e", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22f96e70-1b69-4581-8b78-d981ac68b168", 3, 0, 0.0, 346.6666666666667, 262, 411, 367.0, 411.0, 411.0, 411.0, 0.04019400305474423, 0.03290622320399796, 0.02577545117768429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 237.42857142857142, 166, 802, 168.0, 568.0, 802.0, 802.0, 0.10762938589747532, 9.352187315011994, 0.24009401234662814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c5d06a4-c9b4-4c05-8e20-9000b63e8c76", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.5004544667590027, 1.9098424515235457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4625833-6fc3-4d8b-aa5d-23bf41927db3", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 219.73684210526318, 165, 334, 169.0, 333.0, 334.0, 334.0, 0.10625209708086343, 0.16466999811262722, 0.23896345661838722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/477cab33-3c6b-4e13-9e65-e392ae2fd281", 3, 0, 0.0, 343.0, 231, 434, 364.0, 434.0, 434.0, 434.0, 0.03522367030644594, 0.029364524627216157, 0.02258809586708935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f32882b5-d1f8-4588-be44-92545a572d09", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 1.1827256944444444, 2.209924768518518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 87.92857142857142, 83, 110, 86.0, 100.0, 110.0, 110.0, 0.07725970851015689, 0.06405614504406563, 0.027463412009469834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e534ae4e-5152-4769-a481-f4098a5d2697", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 108.78571428571429, 85, 286, 88.0, 221.5, 286.0, 286.0, 0.07396332475710972, 0.057422698419826404, 0.02629165059725385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a729847-6c71-4112-94ea-db6ea139366d", 3, 0, 0.0, 322.0, 201, 503, 262.0, 503.0, 503.0, 503.0, 0.03802715138608966, 0.03170167145174988, 0.02438590111673068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a966f44c-90b1-44c0-b040-84ae2fc8b89e", 3, 0, 0.0, 311.0, 190, 453, 290.0, 453.0, 453.0, 453.0, 0.02261437218733746, 0.026729422334707785, 0.014502055081072525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 99.93333333333335, 82, 248, 85.0, 185.60000000000002, 248.0, 248.0, 0.14089798985534474, 0.10471032253898178, 0.0707241863141086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 116.33333333333334, 82, 257, 83.0, 252.2, 257.0, 257.0, 0.1409046075806679, 0.06592060612465361, 0.07878182095721196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 202.13333333333335, 82, 737, 83.0, 633.8000000000001, 737.0, 737.0, 0.1409046075806679, 16.937742913672444, 0.08122196585411677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 169.73333333333332, 81, 575, 83.0, 572.0, 575.0, 575.0, 0.14090857851425997, 5.557155455040769, 0.08136186086217262], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.44052863436123346], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.07342143906020558], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07342143906020558], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.8810572687224669], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1362, 20, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
