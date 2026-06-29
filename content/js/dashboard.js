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

    var data = {"OkPercent": 98.8830975428146, "KoPercent": 1.1169024571854058};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.826935380678183, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4051724137931034, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6174551b-d3d0-447b-86e0-15052fb281be"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/309185c6-c88c-4906-bbb1-6200183882ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c06fe54b-d00a-48a9-80bf-4a39dff4bfa3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/010743bf-0bbd-4cd6-8327-be65d6fa7de8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39651fb4-6e00-467d-9f46-d522a2ec3130"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2246f6f4-fd50-4781-8e4d-ff675c592216"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/39f17ed8-7dba-4a88-86a7-b42b41ef3b27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18f0319b-a575-44bd-ad2a-cca7af8b9153"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f69bbc5-357a-499e-9907-b422296caae2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d383884d-e966-4dbe-a14d-897841ae28e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39f17ed8-7dba-4a88-86a7-b42b41ef3b27"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=407f8e7f-9e9f-4195-819b-9762909d2712"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2246f6f4-fd50-4781-8e4d-ff675c592216"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d89e094e-1bd1-46f7-81b8-8bfd4c3199ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8045e288-000f-4453-b474-f142cbeb3d93"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99d24ca9-0c1b-48ae-8004-9bfab3ebf7b3"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e4ecf0f-d3f1-4926-8598-db2cdf4e0dec"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=309185c6-c88c-4906-bbb1-6200183882ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d89e094e-1bd1-46f7-81b8-8bfd4c3199ef"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0430a6ba-4e38-4b3b-9a55-6ab207c7ccf1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/18f0319b-a575-44bd-ad2a-cca7af8b9153"], "isController": false}, {"data": [0.4098360655737705, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5f69bbc5-357a-499e-9907-b422296caae2"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8103448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9611111111111111, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=010743bf-0bbd-4cd6-8327-be65d6fa7de8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02b981ea-ddec-4bb2-8e28-8d58af33113c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0430a6ba-4e38-4b3b-9a55-6ab207c7ccf1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/407f8e7f-9e9f-4195-819b-9762909d2712"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d383884d-e966-4dbe-a14d-897841ae28e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39651fb4-6e00-467d-9f46-d522a2ec3130"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6174551b-d3d0-447b-86e0-15052fb281be"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/99d24ca9-0c1b-48ae-8004-9bfab3ebf7b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1343, 15, 1.1169024571854058, 292.6023827252426, 77, 2843, 94.0, 791.6000000000001, 944.5999999999999, 1470.7599999999989, 5.275915035375737, 745.9824527271826, 3.851405085581392], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1301.965517241379, 947, 1937, 1275.0, 1537.0, 1696.0999999999997, 1937.0, 0.25333042148940815, 304.8425684852042, 1.2456237033195021], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6174551b-d3d0-447b-86e0-15052fb281be", 3, 0, 0.0, 456.0, 226, 815, 327.0, 815.0, 815.0, 815.0, 0.02802742951101478, 0.028109541120910332, 0.017973319054915077], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 508.6428571428571, 96, 1138, 425.0, 986.5, 1138.0, 1138.0, 0.09812373402861008, 0.018528246931881102, 0.06635809161602782], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 508.6428571428571, 96, 1138, 425.0, 986.5, 1138.0, 1138.0, 0.09751204970328477, 0.01841274543434653, 0.06594442814406709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/309185c6-c88c-4906-bbb1-6200183882ad", 3, 0, 0.0, 321.6666666666667, 243, 453, 269.0, 453.0, 453.0, 453.0, 0.049949218294733685, 0.032437724771482324, 0.03203123699239107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 100.40909090909092, 77, 236, 79.0, 235.0, 235.85, 236.0, 0.11450759133281631, 0.030639726587101238, 0.0653051106819968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 96.68181818181817, 79, 243, 81.0, 197.1999999999999, 242.25, 243.0, 0.11459407652800783, 0.0851621994509902, 0.05752085481972268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 115.54545454545456, 78, 237, 80.0, 236.7, 237.0, 237.0, 0.11450699533644236, 0.030863213586775486, 0.06742941229284644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 100.68181818181819, 78, 234, 80.0, 232.5, 234.0, 234.0, 0.11459944888083219, 0.0308881327061618, 0.06737194162720798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c06fe54b-d00a-48a9-80bf-4a39dff4bfa3", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 454.2142857142857, 81, 2010, 235.5, 1892.0, 2010.0, 2010.0, 0.09837678307919331, 0.2197351402747523, 0.06359219090366101], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/010743bf-0bbd-4cd6-8327-be65d6fa7de8", 3, 0, 0.0, 876.3333333333334, 208, 2010, 411.0, 2010.0, 2010.0, 2010.0, 0.02122301140383146, 0.025084880991963553, 0.013609808745295566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39651fb4-6e00-467d-9f46-d522a2ec3130", 3, 0, 0.0, 298.0, 176, 440, 278.0, 440.0, 440.0, 440.0, 0.02610034713461689, 0.026176812995362838, 0.016737527296613045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2246f6f4-fd50-4781-8e4d-ff675c592216", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 167.0, 5.9880239520958085, 1.0818207335329342, 4.128461826347305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 82.06666666666668, 79, 103, 81.0, 90.4, 103.0, 103.0, 0.09589076124478993, 0.07126256768289564, 0.0481326672654512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 80.46666666666667, 78, 91, 80.0, 85.60000000000001, 91.0, 91.0, 0.09590547556328483, 0.03526524257691619, 0.05415912077056853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 571.75, 393, 794, 550.0, 794.0, 794.0, 794.0, 0.030999581505649677, 9.114906245640684, 0.01767944882744083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 792.5, 685, 864, 810.5, 864.0, 864.0, 864.0, 0.03092958879111702, 27.830498362664894, 0.017609326430880104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 126.75, 80, 231, 98.0, 231.0, 231.0, 231.0, 0.031074960573643774, 0.05498811382758058, 0.017206545552007832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 80.3529411764706, 78, 82, 80.0, 82.0, 82.0, 82.0, 0.1394048234068899, 0.10360065489515936, 0.06997468674916152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39f17ed8-7dba-4a88-86a7-b42b41ef3b27", 3, 0, 0.0, 1198.0, 899, 1774, 921.0, 1774.0, 1774.0, 1774.0, 0.01987162927488425, 0.02348759306546377, 0.012743199762865224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 107.88235294117646, 78, 240, 80.0, 236.8, 240.0, 240.0, 0.1394036802571588, 0.08656673848689606, 0.07674890117099092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18f0319b-a575-44bd-ad2a-cca7af8b9153", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 276.70588235294116, 78, 943, 81.0, 878.1999999999999, 943.0, 943.0, 0.1394048234068899, 29.543251884015188, 0.0791359412285665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 216.17647058823533, 78, 631, 81.0, 623.8, 631.0, 631.0, 0.13940825296857573, 9.673593770501213, 0.07927402896001443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 136.75, 80, 305, 81.0, 305.0, 305.0, 305.0, 0.031074719162225574, 0.02309361453364615, 0.01744918312332002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 442.1428571428571, 79, 940, 238.0, 923.4000000000001, 939.7, 940.0, 0.11171282356821398, 47.88215053502463, 0.061103340346416145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 183.8, 78, 846, 82.0, 481.8000000000002, 846.0, 846.0, 0.0959048623765225, 5.777150316885649, 0.05583211454237397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 346.80952380952374, 78, 779, 238.0, 633.6, 764.5999999999998, 779.0, 0.11171282356821398, 15.657333547892883, 0.06121243490068198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 159.26666666666665, 78, 706, 81.0, 473.20000000000016, 706.0, 706.0, 0.09590670196033299, 1.9041101816153247, 0.055926844365800955], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 420.2142857142857, 81, 688, 405.5, 682.0, 688.0, 688.0, 0.09751340809361288, 0.018413001932855055, 0.06673437826495786], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 385.17647058823536, 158, 1024, 164.0, 957.5999999999999, 1024.0, 1024.0, 0.13931000573629435, 39.37997284223142, 0.3049246983323773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f69bbc5-357a-499e-9907-b422296caae2", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d383884d-e966-4dbe-a14d-897841ae28e2", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39f17ed8-7dba-4a88-86a7-b42b41ef3b27", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 387.95238095238096, 95, 854, 360.0, 759.4, 845.2999999999998, 854.0, 0.09169184553853676, 0.056322432464589484, 0.04145832469174075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 99.99999999999999, 79, 316, 81.0, 206.0000000000001, 307.89999999999986, 316.0, 0.11170985227701916, 0.08301874763946443, 0.05607310944373813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 140.38095238095238, 77, 247, 80.0, 245.4, 247.0, 247.0, 0.11171222929733009, 0.10979009737582654, 0.05924322279142263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=407f8e7f-9e9f-4195-819b-9762909d2712", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["login", 21, 0, 0.0, 2275.190476190476, 1430, 3738, 2250.0, 2965.8, 3661.499999999999, 3738.0, 0.08806434568191158, 20.190168205521218, 0.16068548788695894], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 96.33333333333333, 80, 237, 84.0, 151.80000000000007, 237.0, 237.0, 0.08967591125671823, 0.07259895549982363, 0.031876984079536555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2246f6f4-fd50-4781-8e4d-ff675c592216", 3, 0, 0.0, 280.0, 178, 417, 245.0, 417.0, 417.0, 417.0, 0.08956293288750897, 0.04052489476355386, 0.05743456308215906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d89e094e-1bd1-46f7-81b8-8bfd4c3199ef", 3, 0, 0.0, 317.6666666666667, 199, 425, 329.0, 425.0, 425.0, 425.0, 0.0552822157112057, 0.03590104828901542, 0.0354511604658448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8045e288-000f-4453-b474-f142cbeb3d93", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.8352640086206897, 3.429193606321839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 550.8571428571429, 159, 1031, 554.0, 1006.0, 1029.8, 1031.0, 0.11166233310469141, 63.70349085199689, 0.23752651149590304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 227.36363636363637, 160, 479, 165.0, 428.1999999999999, 478.4, 479.0, 0.11445278562473013, 0.17737946365863938, 0.25740699735718114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 649.5, 81, 1148, 820.0, 1148.0, 1148.0, 1148.0, 0.04636534345128162, 36.98351542999992, 0.07993946666331805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99d24ca9-0c1b-48ae-8004-9bfab3ebf7b3", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 999.0416666666665, 216, 1710, 982.5, 1506.0, 1662.25, 1710.0, 0.09682104243989026, 0.030682058859125384, 0.04368293125705987], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9e4ecf0f-d3f1-4926-8598-db2cdf4e0dec", 1, 0, 0.0, 166.0, 166, 166, 166.0, 166.0, 166.0, 166.0, 6.024096385542169, 1.9237104668674698, 3.5944559487951806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=309185c6-c88c-4906-bbb1-6200183882ad", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 106.0, 80, 237, 83.5, 237.0, 237.0, 237.0, 0.0857449088960343, 0.06656953376205788, 0.03047963558413719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 282.9333333333333, 160, 927, 186.0, 609.6000000000001, 927.0, 927.0, 0.09584113373671803, 7.782587083650142, 0.2139141658786396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 259.11764705882354, 160, 475, 312.0, 417.4, 475.0, 475.0, 0.09855243859313495, 0.15273703129619645, 0.22164674421874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 81.25, 80, 86, 80.5, 86.0, 86.0, 86.0, 0.04217073877862998, 0.03133977754935294, 0.021167734113492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 79.375, 77, 82, 79.5, 82.0, 82.0, 82.0, 0.042170961076202926, 0.01128402669421836, 0.02405062623877198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 79.75, 79, 81, 80.0, 81.0, 81.0, 81.0, 0.04217118337611951, 0.011366451769344713, 0.02479204335197651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 80.375, 79, 83, 80.0, 83.0, 83.0, 83.0, 0.042171627982983746, 0.011366571604788588, 0.024833487962635938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 3.6410108024691357, 7.631655092592593], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 895.2241379310343, 621, 1587, 860.5, 1199.2, 1358.7499999999998, 1587.0, 0.2500517348416914, 299.14880691910395, 0.49375449985341796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 999.0416666666665, 216, 1710, 982.5, 1506.0, 1662.25, 1710.0, 0.09533153527465413, 0.03021004218420436, 0.04301090751649434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 110.0, 78, 233, 80.0, 233.0, 233.0, 233.0, 0.03233148828306865, 0.008714346451295846, 0.01903895257293984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 80.6, 79, 84, 80.0, 84.0, 84.0, 84.0, 0.03236350690960872, 0.008722976471730476, 0.019026202304281693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d89e094e-1bd1-46f7-81b8-8bfd4c3199ef", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 230.71428571428572, 79, 942, 81.5, 823.0, 942.0, 942.0, 0.08534399726899208, 10.990099429566818, 0.04912518592799405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 175.71428571428572, 78, 708, 80.0, 674.0, 708.0, 708.0, 0.08534399726899208, 3.6045694471537777, 0.04920852967532705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 110.2, 78, 235, 80.0, 235.0, 235.0, 235.0, 0.03233065204459044, 0.008650975254118926, 0.018438574994180484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 80.64285714285714, 79, 83, 80.0, 82.5, 83.0, 83.0, 0.08542314967356153, 0.06348341494294954, 0.04287841692598695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 111.2, 79, 236, 80.0, 236.0, 236.0, 236.0, 0.032362669014038926, 0.02405077257781604, 0.01624454284493751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 114.28571428571429, 78, 248, 81.0, 242.0, 248.0, 248.0, 0.08542471336957783, 0.041186915374617876, 0.04769387596331619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 118.6, 82, 244, 83.0, 244.0, 244.0, 244.0, 0.031966243646709074, 0.025160930057858903, 0.011363000671291118], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 532.5714285714286, 82, 1046, 437.5, 983.5, 1046.0, 1046.0, 0.09712105445716268, 0.018149226066597295, 0.06610003685397156], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1446.8095238095239, 977, 2843, 1285.0, 2335.2000000000003, 2795.6999999999994, 2843.0, 0.08840281373527147, 0.045755362577826045, 0.04066184108331334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 223.8, 159, 472, 160.0, 472.0, 472.0, 472.0, 0.03231330985232818, 0.050079319077778135, 0.07267339120108572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0430a6ba-4e38-4b3b-9a55-6ab207c7ccf1", 3, 0, 0.0, 363.6666666666667, 184, 472, 435.0, 472.0, 472.0, 472.0, 0.02099193909538737, 0.028939082704741378, 0.013461627609997761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18f0319b-a575-44bd-ad2a-cca7af8b9153", 3, 0, 0.0, 502.3333333333333, 181, 1046, 280.0, 1046.0, 1046.0, 1046.0, 0.017817689402038345, 0.021059905670182687, 0.011426057331385265], "isController": false}, {"data": ["addBook", 61, 6, 9.836065573770492, 865.1475409836067, 410, 2199, 699.0, 1494.8000000000006, 1582.8999999999999, 2199.0, 0.3065372844816756, 103.35559392855168, 1.113572849088177], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5f69bbc5-357a-499e-9907-b422296caae2", 3, 0, 0.0, 336.0, 204, 539, 265.0, 539.0, 539.0, 539.0, 0.05926042983565107, 0.026813801260271806, 0.03800229387247155], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 142.31034482758616, 78, 553, 81.0, 323.0, 336.84999999999974, 553.0, 0.2507240738339169, 0.18632912127696363, 0.12119962553495006], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 508.2241379310344, 387, 730, 466.5, 702.0, 706.05, 730.0, 0.2506850617636126, 73.70973168594348, 0.1260769597736919], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 122.62068965517243, 78, 247, 82.5, 239.1, 241.14999999999998, 247.0, 0.25109746911068204, 0.44432481838726157, 0.12211576134484342], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 751.2931034482763, 539, 1096, 773.5, 911.6, 1003.6499999999999, 1096.0, 0.25068397826829236, 225.56588430124003, 0.12583160627920145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 105.94117647058823, 82, 242, 88.0, 240.4, 242.0, 242.0, 0.09993886093213564, 0.0746613560674646, 0.035525141971970084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 6, 3.3333333333333335, 145.0111111111111, 78, 1074, 87.0, 248.9, 360.24999999999983, 654.4199999999988, 0.7402655085624044, 1.5747469924143347, 0.3564415372744246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 105.50000000000001, 82, 243, 83.5, 243.0, 243.0, 243.0, 0.0445154218114438, 0.034473368648901305, 0.015823841347036665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=010743bf-0bbd-4cd6-8327-be65d6fa7de8", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.28272936228482004, 1.0789563771517996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02b981ea-ddec-4bb2-8e28-8d58af33113c", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 88.54545454545456, 81, 116, 85.0, 105.39999999999999, 114.94999999999999, 116.0, 0.11299028797115666, 0.09169426689846796, 0.040164516427247096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 162.75, 160, 169, 162.0, 169.0, 169.0, 169.0, 0.042152740455038834, 0.06532851474819007, 0.09480250123823675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0430a6ba-4e38-4b3b-9a55-6ab207c7ccf1", 1, 0, 0.0, 676.0, 676, 676, 676.0, 676.0, 676.0, 676.0, 1.4792899408284024, 0.2672545303254438, 1.0199010724852071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 323.57142857142856, 161, 1023, 239.5, 904.0, 1023.0, 1023.0, 0.08530135751017523, 14.69189739922254, 0.1887268734310643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/407f8e7f-9e9f-4195-819b-9762909d2712", 3, 0, 0.0, 501.3333333333333, 183, 922, 399.0, 922.0, 922.0, 922.0, 0.0213228709113395, 0.02520291154917765, 0.013673846254993106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d383884d-e966-4dbe-a14d-897841ae28e2", 3, 0, 0.0, 254.0, 175, 377, 210.0, 377.0, 377.0, 377.0, 0.02767834077573163, 0.027759429664723032, 0.017749456812562275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39651fb4-6e00-467d-9f46-d522a2ec3130", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 86.0, 81, 99, 84.0, 93.39999999999999, 99.0, 99.0, 0.14148391660771503, 0.11730453632807623, 0.0502931109816487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 93.7142857142857, 81, 248, 84.0, 97.0, 232.89999999999978, 248.0, 0.11037179527608716, 0.08568904027782158, 0.03923372410204661], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6174551b-d3d0-447b-86e0-15052fb281be", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99d24ca9-0c1b-48ae-8004-9bfab3ebf7b3", 3, 0, 0.0, 433.33333333333337, 261, 696, 343.0, 696.0, 696.0, 696.0, 0.024247126715484214, 0.02865928291143333, 0.015549101441895802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 90.35294117647058, 78, 238, 81.0, 119.5999999999999, 238.0, 238.0, 0.09860102545066468, 0.07327673864058186, 0.04949309285316567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 125.52941176470588, 78, 237, 80.0, 236.2, 237.0, 237.0, 0.09860102545066468, 0.026383477513166137, 0.0562333973273322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 121.23529411764706, 78, 318, 80.0, 253.19999999999993, 318.0, 318.0, 0.0986004535620864, 0.026575903499156093, 0.05796628226989844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 148.52941176470588, 78, 317, 81.0, 252.99999999999994, 317.0, 317.0, 0.098601597345877, 0.02657621178463091, 0.058063245312074054], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 33.333333333333336, 0.37230081906180196], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.666666666666667, 0.07446016381236038], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.666666666666667, 0.07446016381236038], "isController": false}, {"data": ["401/Unauthorized", 8, 53.333333333333336, 0.5956813104988831], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1343, 15, "401/Unauthorized", 8, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
