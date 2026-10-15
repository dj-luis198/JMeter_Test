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

    var data = {"OkPercent": 98.18867924528301, "KoPercent": 1.8113207547169812};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7519455252918288, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05172413793103448, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=237c19bf-db6d-41e6-af35-97293e690321"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e3f9135-8184-4eb1-a377-2d78864cbc71"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=818e735c-18d4-45b8-a763-9b2e774fbacf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e03da018-59f1-42d1-bc18-69014b52a5cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a92d11c-9b01-4daa-87ab-ad88c1788577"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00762473-8915-464c-8780-cf7fdfb3b4b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/00762473-8915-464c-8780-cf7fdfb3b4b2"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa28c804-d488-418c-be9e-da2725531cfb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d14e448f-1f6a-4518-bf2a-eebea33e98b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=546a3ca9-1dcd-483d-bf65-7a44ea04bbcf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c264bbbb-6a81-4946-8633-c4fded678c40"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4d134579-c7de-4dd0-9898-9ec50538854c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3255b4fe-05d2-4c51-b04f-881f1e31f303"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d6f713c-799e-4c1b-8c41-ec9a77a35bb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/440f66a1-c73d-4ce3-bd64-16020ce63076"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c4a3a8a-38f4-470f-89cc-9f8e25f441fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/237c19bf-db6d-41e6-af35-97293e690321"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e3f9135-8184-4eb1-a377-2d78864cbc71"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3879310344827586, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/4c8812d1-65ef-4294-afaf-f832437e9c33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d14e448f-1f6a-4518-bf2a-eebea33e98b8"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25862068965517243, 500, 1500, "addBook"], "isController": true}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9224137931034483, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e03da018-59f1-42d1-bc18-69014b52a5cb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/818e735c-18d4-45b8-a763-9b2e774fbacf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e25c79f-a9fa-4295-80da-8405cb45c5b1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8d6f713c-799e-4c1b-8c41-ec9a77a35bb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d134579-c7de-4dd0-9898-9ec50538854c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c8812d1-65ef-4294-afaf-f832437e9c33"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/546a3ca9-1dcd-483d-bf65-7a44ea04bbcf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c4a3a8a-38f4-470f-89cc-9f8e25f441fa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fa28c804-d488-418c-be9e-da2725531cfb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1325, 24, 1.8113207547169812, 411.1086792452834, 108, 3147, 128.0, 1108.8000000000002, 1350.2000000000003, 1844.48, 5.146970279645577, 746.8872399869578, 3.7566054808435596], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1842.8620689655172, 1336, 2620, 1832.5, 2290.3, 2335.45, 2620.0, 0.2613954913784556, 314.546535861884, 1.28527958895559], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=237c19bf-db6d-41e6-af35-97293e690321", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 624.4285714285714, 123, 1059, 634.0, 1046.5, 1059.0, 1059.0, 0.08086876155268022, 0.015930062962107208, 0.05441267256816081], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 624.4285714285714, 123, 1059, 634.0, 1046.5, 1059.0, 1059.0, 0.08082907537311279, 0.015922245316243755, 0.054385969660229204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 173.6111111111111, 108, 340, 112.5, 337.3, 340.0, 340.0, 0.09968874957078455, 0.05994737957045225, 0.05499322947242498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 140.1111111111111, 109, 330, 114.0, 330.0, 330.0, 330.0, 0.09981146722856826, 0.0741762954696684, 0.050100677886214924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 306.5, 108, 887, 116.5, 874.4, 887.0, 887.0, 0.09981368112856003, 6.542821455505279, 0.056870837630866825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e3f9135-8184-4eb1-a377-2d78864cbc71", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 0.6022135416666667, 2.2981770833333335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 367.94444444444446, 109, 1201, 117.0, 1181.2, 1201.0, 1201.0, 0.09969371874186526, 19.955251193555355, 0.05670512951875627], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 273.14285714285717, 113, 573, 237.0, 519.5, 573.0, 573.0, 0.08102648987458257, 0.13416621209841248, 0.05237105574622504], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=818e735c-18d4-45b8-a763-9b2e774fbacf", 1, 0, 0.0, 1607.0, 1607, 1607, 1607.0, 1607.0, 1607.0, 1607.0, 0.6222775357809583, 0.11242318761667704, 0.429031191661481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 129.64285714285714, 110, 329, 114.5, 224.0, 329.0, 329.0, 0.08346399422906098, 0.06202744102374551, 0.04189501272825912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e03da018-59f1-42d1-bc18-69014b52a5cb", 1, 0, 0.0, 1084.0, 1084, 1084, 1084.0, 1084.0, 1084.0, 1084.0, 0.9225092250922509, 0.16666426429889297, 0.6360268680811808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 143.35714285714283, 108, 336, 112.0, 330.5, 336.0, 336.0, 0.08346598463033511, 0.03128809998628773, 0.04710099160570669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 902.8, 865, 1017, 871.0, 1017.0, 1017.0, 1017.0, 0.048521077556090364, 14.266807852893796, 0.027672177043707787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a92d11c-9b01-4daa-87ab-ad88c1788577", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.732421875, 1.3685313933486238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1120.2, 993, 1298, 1076.0, 1298.0, 1298.0, 1298.0, 0.04834935308565571, 43.50483289557023, 0.027527024266540315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 157.4, 110, 335, 114.0, 335.0, 335.0, 335.0, 0.048878244293464976, 0.08649158072242046, 0.02706441847108852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 113.85714285714286, 110, 117, 115.0, 116.5, 117.0, 117.0, 0.06303580433686334, 0.046845944433938476, 0.03164101897377711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 177.50000000000003, 109, 368, 113.0, 352.5, 368.0, 368.0, 0.06296464535163507, 0.02360295787665226, 0.035531806703036246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 205.28571428571428, 109, 976, 112.5, 655.0, 976.0, 976.0, 0.06279322192021672, 4.05153378751895, 0.03653009701552787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 199.21428571428572, 110, 873, 113.0, 605.5, 873.0, 873.0, 0.0628222444593024, 1.3351392157764606, 0.0366083307905282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00762473-8915-464c-8780-cf7fdfb3b4b2", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 115.2, 113, 121, 113.0, 121.0, 121.0, 121.0, 0.04887681088584332, 0.03632348933996755, 0.02744547486265616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 898.2857142857143, 112, 1536, 1039.5, 1492.0, 1536.0, 1536.0, 0.09305664490913683, 59.81611809636016, 0.04899494669183627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 246.78571428571428, 110, 1306, 114.0, 824.0, 1306.0, 1306.0, 0.08346648224548685, 5.385410440837169, 0.04855681235542413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 657.0, 109, 1235, 758.0, 1123.0, 1235.0, 1235.0, 0.09305107839553355, 19.550099074474094, 0.049082886078894016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 205.00000000000003, 108, 988, 111.0, 657.5, 988.0, 988.0, 0.08346648224548685, 1.7738839897872798, 0.04863832259199199], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 667.2857142857143, 115, 1607, 539.5, 1345.5, 1607.0, 1607.0, 0.08033926122310787, 0.015825758488703726, 0.05457196747981476], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 353.85714285714283, 226, 1087, 232.0, 769.0, 1087.0, 1087.0, 0.06276000573805766, 5.4533743239290455, 0.14000174271087362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00762473-8915-464c-8780-cf7fdfb3b4b2", 3, 0, 0.0, 667.3333333333334, 239, 1239, 524.0, 1239.0, 1239.0, 1239.0, 0.058534301100444865, 0.037631915583782094, 0.03753664491141809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 682.4545454545454, 115, 1568, 615.5, 1288.8999999999999, 1531.3999999999994, 1568.0, 0.09217786976942963, 0.05662097664547972, 0.04167807978832609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 116.35714285714285, 108, 148, 113.5, 136.5, 148.0, 148.0, 0.09305602637473662, 0.06915589460075641, 0.046709763238881465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 257.7142857142857, 108, 343, 334.0, 341.5, 343.0, 343.0, 0.09305788200260562, 0.12473495121108187, 0.04748963900188775], "isController": false}, {"data": ["login", 22, 0, 0.0, 3268.7727272727266, 1826, 4905, 3326.0, 4630.9, 4896.599999999999, 4905.0, 0.08868965072403005, 24.23673437777155, 0.16723794223884927], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa28c804-d488-418c-be9e-da2725531cfb", 1, 0, 0.0, 995.0, 995, 995, 995.0, 995.0, 995.0, 995.0, 1.0050251256281408, 0.18157192211055276, 0.6929177135678392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 118.5, 112, 143, 116.5, 135.0, 143.0, 143.0, 0.0836450105751192, 0.06771651735036505, 0.0297331873528744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d14e448f-1f6a-4518-bf2a-eebea33e98b8", 3, 0, 0.0, 439.33333333333337, 217, 825, 276.0, 825.0, 825.0, 825.0, 0.04594251060506287, 0.029536607566731495, 0.029461831345043567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=546a3ca9-1dcd-483d-bf65-7a44ea04bbcf", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c264bbbb-6a81-4946-8633-c4fded678c40", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.5394188133445946, 1.0079048775337838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1027.1428571428569, 233, 1649, 1154.5, 1623.0, 1649.0, 1649.0, 0.09298124435471017, 79.49681061879018, 0.1921240527535731], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d134579-c7de-4dd0-9898-9ec50538854c", 3, 0, 0.0, 825.6666666666666, 239, 1616, 622.0, 1616.0, 1616.0, 1616.0, 0.023576750180755085, 0.023645822691050266, 0.015119205031278489], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3255b4fe-05d2-4c51-b04f-881f1e31f303", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.6071025427756653, 1.1343720294676805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 535.2222222222222, 223, 1320, 350.5, 1296.6000000000001, 1320.0, 1320.0, 0.099626400996264, 26.606270323093952, 0.21839758890272587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 737.6666666666667, 112, 1412, 1110.0, 1412.0, 1412.0, 1412.0, 0.08693048458915686, 57.78760558431774, 0.13449889103263757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d6f713c-799e-4c1b-8c41-ec9a77a35bb5", 1, 0, 0.0, 1026.0, 1026, 1026, 1026.0, 1026.0, 1026.0, 1026.0, 0.9746588693957114, 0.17608583089668617, 0.6719816033138402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/440f66a1-c73d-4ce3-bd64-16020ce63076", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1387.173913043478, 183, 3147, 1356.0, 2106.2000000000003, 2957.3999999999974, 3147.0, 0.09536643516119, 0.03004496216440344, 0.04302665336374002], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c4a3a8a-38f4-470f-89cc-9f8e25f441fa", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 132.44444444444446, 112, 342, 119.5, 162.9000000000003, 342.0, 342.0, 0.09381400851622722, 0.07283411793984437, 0.033347948339752645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 424.2142857142857, 228, 1420, 337.0, 1038.5, 1420.0, 1420.0, 0.08340780458742926, 7.2475133582812035, 0.18606177390527256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/237c19bf-db6d-41e6-af35-97293e690321", 3, 0, 0.0, 605.6666666666666, 222, 1075, 520.0, 1075.0, 1075.0, 1075.0, 0.03437922577983544, 0.02866054597075474, 0.022046573823657493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 404.66666666666674, 226, 1383, 340.0, 737.700000000001, 1383.0, 1383.0, 0.09342447409806455, 6.346087517646844, 0.20878585812974582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e3f9135-8184-4eb1-a377-2d78864cbc71", 3, 0, 0.0, 537.0, 225, 1151, 235.0, 1151.0, 1151.0, 1151.0, 0.07102104590326934, 0.03296745164650458, 0.045544095191875196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 155.0909090909091, 110, 346, 115.0, 343.2, 346.0, 346.0, 0.06694255111976631, 0.049749298244279455, 0.03360202273003895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 133.54545454545456, 110, 334, 113.0, 290.60000000000014, 334.0, 334.0, 0.06694295851362289, 0.017912471321028002, 0.038178406027300556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 133.00000000000003, 108, 328, 113.0, 288.60000000000014, 328.0, 328.0, 0.06694458813863616, 0.018043658521741775, 0.039356095761190396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 173.36363636363635, 108, 336, 111.0, 336.0, 336.0, 336.0, 0.06694458813863616, 0.018043658521741775, 0.039421471335544536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 116.5, 115, 118, 116.5, 118.0, 118.0, 118.0, 0.07958615200955034, 0.023471697174691605, 0.049197299044966177], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1248.46551724138, 868, 1843, 1189.0, 1781.1000000000001, 1820.1, 1843.0, 0.24710293115201093, 295.62101253621336, 0.4879317644427403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1387.173913043478, 183, 3147, 1356.0, 2106.2000000000003, 2957.3999999999974, 3147.0, 0.09284338934884491, 0.029250082751716592, 0.04188832605387338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 138.55555555555554, 111, 344, 113.0, 344.0, 344.0, 344.0, 0.054090114130140816, 0.014578976074139516, 0.03185189337937003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 137.0, 111, 325, 114.0, 325.0, 325.0, 325.0, 0.054090114130140816, 0.014578976074139516, 0.03179907100228981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 159.83333333333331, 108, 342, 112.0, 329.40000000000003, 342.0, 342.0, 0.09721322099805572, 0.02620200097213221, 0.057150741250810114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c8812d1-65ef-4294-afaf-f832437e9c33", 3, 0, 0.0, 1067.0, 566, 2062, 573.0, 2062.0, 2062.0, 2062.0, 0.04510803374080923, 0.029000119348339272, 0.02892670132467259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 185.88888888888889, 109, 337, 114.0, 336.1, 337.0, 337.0, 0.09721269597809475, 0.026201859462845846, 0.05724536686991321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 137.61111111111111, 109, 340, 114.0, 326.5, 340.0, 340.0, 0.09721112095223693, 0.07224381156704328, 0.04879542594672831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 162.66666666666666, 108, 344, 112.0, 344.0, 344.0, 344.0, 0.05409043921436642, 0.01447341830540664, 0.03084845361444335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 125.61111111111111, 108, 348, 113.0, 141.90000000000032, 348.0, 348.0, 0.09721374602368775, 0.026012271885244576, 0.05544221452913442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 113.33333333333331, 111, 115, 114.0, 115.0, 115.0, 115.0, 0.0540897890498227, 0.04019758737003426, 0.02715053864414929], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 143.44444444444446, 115, 348, 118.0, 348.0, 348.0, 348.0, 0.05531755348900103, 0.04354096495325667, 0.019663661591793332], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 620.4285714285714, 112, 1151, 557.5, 1113.0, 1151.0, 1151.0, 0.08090053856644246, 0.015620304879458199, 0.05505480289161639], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d14e448f-1f6a-4518-bf2a-eebea33e98b8", 1, 0, 0.0, 1028.0, 1028, 1028, 1028.0, 1028.0, 1028.0, 1028.0, 0.9727626459143969, 0.17574325145914396, 0.6706742461089494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1765.0454545454543, 1028, 3093, 1671.0, 2506.1, 3010.4999999999986, 3093.0, 0.08955940841939856, 0.04635399068582153, 0.04119382945853196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 279.0, 227, 460, 228.0, 460.0, 460.0, 460.0, 0.05405275548935761, 0.0837712138296978, 0.12156591395702206], "isController": false}, {"data": ["addBook", 58, 10, 17.24137931034483, 1184.655172413793, 578, 2578, 949.5, 1976.3000000000002, 2388.1, 2578.0, 0.27289879689271784, 96.77552739603968, 0.9889410923833005], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 206.31034482758616, 110, 535, 115.5, 458.0, 466.05, 535.0, 0.2481336499176453, 0.18440401131575007, 0.11994741866136174], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 708.8620689655173, 539, 1013, 660.0, 967.1, 985.1999999999999, 1013.0, 0.24797027776946456, 72.91149505235165, 0.12471161430788502], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 164.58620689655183, 109, 343, 116.5, 336.1, 341.1, 343.0, 0.2485387634768002, 0.4397971088085566, 0.12087139083149072], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1038.6896551724144, 754, 1405, 1002.5, 1307.9, 1340.7999999999997, 1405.0, 0.2476240895545328, 222.81259105788854, 0.1242956855771776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 118.5, 110, 130, 116.5, 127.30000000000001, 130.0, 130.0, 0.09254546295867845, 0.06913796793299709, 0.03289702003609273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, 5.747126436781609, 194.7528735632184, 110, 1754, 122.0, 351.5, 452.25, 1142.0, 0.6965377271253408, 1.5632810717373813, 0.33253406004435426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 162.09090909090907, 113, 354, 123.0, 352.6, 354.0, 354.0, 0.06483096798528927, 0.0502060132932953, 0.023045383151020792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e03da018-59f1-42d1-bc18-69014b52a5cb", 3, 0, 0.0, 362.0, 235, 582, 269.0, 582.0, 582.0, 582.0, 0.025671524289540566, 0.025746733833357578, 0.01646253347994626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/818e735c-18d4-45b8-a763-9b2e774fbacf", 3, 0, 0.0, 419.3333333333333, 223, 533, 502.0, 533.0, 533.0, 533.0, 0.021335760868792183, 0.025593189714029685, 0.013682112275885611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 121.77777777777777, 112, 147, 117.5, 141.60000000000002, 147.0, 147.0, 0.10103845074375525, 0.0819950708672467, 0.03591601178781925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 331.5454545454545, 224, 674, 230.0, 673.0, 674.0, 674.0, 0.06689573387660777, 0.10367532193571928, 0.15045007335725363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e25c79f-a9fa-4295-80da-8405cb45c5b1", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.8748929794520548, 1.6347388698630136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 338.77777777777777, 222, 669, 231.5, 651.9, 669.0, 669.0, 0.09715235648438006, 0.15056717748116322, 0.21849792674172586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d6f713c-799e-4c1b-8c41-ec9a77a35bb5", 3, 0, 0.0, 509.6666666666667, 223, 1075, 231.0, 1075.0, 1075.0, 1075.0, 0.04678216663807756, 0.030076425491602603, 0.030000282642256775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 122.28571428571428, 113, 146, 123.5, 138.0, 146.0, 146.0, 0.06339287735742262, 0.052559133668409974, 0.022534186873146324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d134579-c7de-4dd0-9898-9ec50538854c", 1, 0, 0.0, 800.0, 800, 800, 800.0, 800.0, 800.0, 800.0, 1.25, 0.225830078125, 0.86181640625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 121.21428571428571, 115, 132, 120.5, 130.0, 132.0, 132.0, 0.09325002997322393, 0.07239626350460256, 0.033147471592044446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c8812d1-65ef-4294-afaf-f832437e9c33", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/546a3ca9-1dcd-483d-bf65-7a44ea04bbcf", 3, 0, 0.0, 340.3333333333333, 242, 524, 255.0, 524.0, 524.0, 524.0, 0.018309652848981985, 0.025241334575338115, 0.01174154170328597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c4a3a8a-38f4-470f-89cc-9f8e25f441fa", 3, 0, 0.0, 434.3333333333333, 372, 466, 465.0, 466.0, 466.0, 466.0, 0.07483349547257352, 0.03386020791239492, 0.047988927760732374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa28c804-d488-418c-be9e-da2725531cfb", 3, 0, 0.0, 1055.6666666666667, 427, 2191, 549.0, 2191.0, 2191.0, 2191.0, 0.03979624323463865, 0.025585149866019313, 0.025520377334712935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 139.5555555555556, 108, 339, 114.0, 336.3, 339.0, 339.0, 0.09347978499649451, 0.0694708167796214, 0.04692247020331853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 174.38888888888889, 109, 340, 113.5, 339.1, 340.0, 340.0, 0.09348852428364418, 0.03281633854791546, 0.05288147537875837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 213.27777777777777, 108, 1043, 113.5, 408.500000000001, 1043.0, 1043.0, 0.0934894954164178, 4.697243561235619, 0.054515250473939805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 206.44444444444443, 108, 889, 114.0, 392.2000000000008, 889.0, 889.0, 0.09348658207862222, 1.5509176454625249, 0.0546048471494383], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 25.0, 0.4528301886792453], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.1509433962264151], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.1509433962264151], "isController": false}, {"data": ["401/Unauthorized", 14, 58.333333333333336, 1.0566037735849056], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1325, 24, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
