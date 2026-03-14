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

    var data = {"OkPercent": 98.64757358790771, "KoPercent": 1.3524264120922833};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7609289617486339, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/27becbca-36a3-40b7-a0cd-788eeafd6f27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89b64677-c43c-4927-9ce2-413626e85db2"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1308ee66-90be-4572-a01c-9c0ee6f4d963"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a1352b7d-3ca8-4353-9538-bad2e1857dd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8b2e95b-18e8-4fd0-8f49-9c100cb57522"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b7406bc-6c63-4f06-a005-93141c0ab5c8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb3d569f-5317-4686-b37f-330785673fdb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/780ce487-5cac-496e-bb47-6473280b5f5b"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/20233676-0b26-4b9e-8adf-840c6d21fb7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1801f8de-1fc7-4e8d-8438-5ba53ba9934f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1352b7d-3ca8-4353-9538-bad2e1857dd1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78bcc5f5-f0a1-46e8-9193-5dc15836e9c7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d9c25e33-2c93-4dab-ab0d-8054b8864491"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e72e8c2-f81f-4278-b59b-abb20cdd6c75"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=957374e5-f693-43df-8453-3b8c428bcd27"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42da93d7-54d9-44b1-9ef0-8b9de1ed6924"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27becbca-36a3-40b7-a0cd-788eeafd6f27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d8b2e95b-18e8-4fd0-8f49-9c100cb57522"], "isController": false}, {"data": [0.2767857142857143, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6b7406bc-6c63-4f06-a005-93141c0ab5c8"], "isController": false}, {"data": [0.9337349397590361, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e31e51a-4753-40ce-b442-eb79b85b41f0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1801f8de-1fc7-4e8d-8438-5ba53ba9934f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d91147e1-d7a1-4771-8029-a3eb78e7f200"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9c25e33-2c93-4dab-ab0d-8054b8864491"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb3d569f-5317-4686-b37f-330785673fdb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e72e8c2-f81f-4278-b59b-abb20cdd6c75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/957374e5-f693-43df-8453-3b8c428bcd27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89b64677-c43c-4927-9ce2-413626e85db2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78bcc5f5-f0a1-46e8-9193-5dc15836e9c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20233676-0b26-4b9e-8adf-840c6d21fb7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1257, 17, 1.3524264120922833, 413.8607796340485, 126, 4491, 156.0, 1052.6000000000004, 1287.0, 1801.42, 4.844098639259165, 694.6977975030926, 3.5325315955081296], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1950.3148148148146, 1546, 2447, 1871.5, 2371.5, 2410.0, 2447.0, 0.23963150000443761, 288.3573863913715, 1.178266213400726], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/27becbca-36a3-40b7-a0cd-788eeafd6f27", 3, 0, 0.0, 458.6666666666667, 362, 599, 415.0, 599.0, 599.0, 599.0, 0.025149429527106894, 0.029725774288061564, 0.016127726617317897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89b64677-c43c-4927-9ce2-413626e85db2", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 554.1538461538462, 141, 1061, 477.0, 1025.0, 1061.0, 1061.0, 0.09675642685958409, 0.01833080743238214, 0.0654079841728814], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 554.1538461538462, 141, 1061, 477.0, 1025.0, 1061.0, 1061.0, 0.09888112207254832, 0.018733337580150757, 0.06684429218230636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 183.49999999999997, 129, 403, 135.5, 396.7, 403.0, 403.0, 0.09776544846844315, 0.03533734044373293, 0.05524368419927042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 133.375, 127, 142, 132.5, 138.5, 142.0, 142.0, 0.09776425372267947, 0.07265487996382723, 0.04907307266939185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 231.75, 126, 907, 131.5, 566.8000000000004, 907.0, 907.0, 0.09777202009215012, 1.8214693415971062, 0.05704959180181612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 259.93750000000006, 127, 870, 133.5, 555.0000000000003, 870.0, 870.0, 0.09776843546061154, 5.522967800958742, 0.056952023195561315], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 258.8461538461538, 132, 362, 243.0, 358.8, 362.0, 362.0, 0.09665427509293681, 0.19442669609665428, 0.06247821793680297], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1308ee66-90be-4572-a01c-9c0ee6f4d963", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1.3141396604938271, 2.455471965020576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1352b7d-3ca8-4353-9538-bad2e1857dd1", 3, 0, 0.0, 631.3333333333334, 248, 992, 654.0, 992.0, 992.0, 992.0, 0.020427896335235396, 0.024145081898841056, 0.013099920501436761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 159.63157894736844, 126, 391, 132.0, 379.0, 391.0, 391.0, 0.11378540073421527, 0.08456122066282991, 0.05711493747791665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 215.57894736842104, 129, 415, 135.0, 407.0, 415.0, 415.0, 0.11378812650844128, 0.039442183654036185, 0.06439182117896476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 847.2, 646, 1120, 898.0, 1120.0, 1120.0, 1120.0, 0.058082128129174654, 17.07807417813789, 0.03312496369866992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1052.2, 887, 1294, 994.0, 1294.0, 1294.0, 1294.0, 0.05790589134538548, 52.103822820277486, 0.03296790493589818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 239.2, 127, 410, 133.0, 410.0, 410.0, 410.0, 0.058607028154816325, 0.10370696778957733, 0.03245135250369224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 136.0, 128, 148, 134.5, 146.8, 148.0, 148.0, 0.06516568375093676, 0.0484287942719364, 0.03271011860154443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 157.50000000000003, 127, 417, 133.0, 335.10000000000025, 417.0, 417.0, 0.06516356053694773, 0.025592394462183414, 0.03670753304335549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 265.9166666666667, 130, 1203, 133.5, 959.1000000000008, 1203.0, 1203.0, 0.06516285282969689, 4.902237266431899, 0.037841969221412516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 218.75, 128, 639, 136.0, 562.2000000000003, 639.0, 639.0, 0.06516356053694773, 1.612787517241192, 0.037906016497241415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 131.0, 128, 136, 130.0, 136.0, 136.0, 136.0, 0.05860496735703318, 0.04355310562373267, 0.03290806272489657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 671.95, 129, 1288, 677.5, 1226.0, 1284.95, 1288.0, 0.0941340374559335, 42.36367221880987, 0.051295696191807516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 212.52631578947367, 126, 1151, 132.0, 390.0, 1151.0, 1151.0, 0.1137915339098771, 5.417994156580145, 0.06638229388759792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8b2e95b-18e8-4fd0-8f49-9c100cb57522", 1, 0, 0.0, 1048.0, 1048, 1048, 1048.0, 1048.0, 1048.0, 1048.0, 0.9541984732824427, 0.17238937261450382, 0.6578751192748091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 485.05, 130, 1083, 519.0, 993.0000000000002, 1078.95, 1083.0, 0.0941340374559335, 13.85195231051995, 0.05138762396276057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 213.57894736842104, 126, 909, 132.0, 394.0, 909.0, 909.0, 0.11378880797240322, 1.7899863790305193, 0.06649182554678516], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 539.3076923076924, 151, 1048, 477.0, 965.5999999999999, 1048.0, 1048.0, 0.09906950869144421, 0.018769028013808763, 0.06776050755976558], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b7406bc-6c63-4f06-a005-93141c0ab5c8", 1, 0, 0.0, 842.0, 842, 842, 842.0, 842.0, 842.0, 842.0, 1.187648456057007, 0.21456539489311163, 0.8188279394299288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 425.4166666666667, 261, 1336, 278.5, 1094.500000000001, 1336.0, 1336.0, 0.06511723816087213, 6.584413688796579, 0.1450617901542736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb3d569f-5317-4686-b37f-330785673fdb", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/780ce487-5cac-496e-bb47-6473280b5f5b", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 479.04545454545456, 161, 1075, 473.5, 893.4999999999999, 1053.3999999999996, 1075.0, 0.09248282762041685, 0.05680829938793183, 0.04181596600415332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 176.40000000000003, 128, 422, 135.0, 418.3, 421.9, 422.0, 0.094132265245897, 0.06995571665246839, 0.04724998470350689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 284.0999999999999, 127, 523, 384.5, 420.1, 517.8999999999999, 523.0, 0.09400881802713094, 0.09575312226786872, 0.04966676811784945], "isController": false}, {"data": ["login", 22, 0, 0.0, 2633.8636363636365, 1651, 5337, 2228.0, 4691.9, 5292.749999999999, 5337.0, 0.0910354872881356, 24.877794718338272, 0.171661376953125], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/20233676-0b26-4b9e-8adf-840c6d21fb7a", 3, 0, 0.0, 399.3333333333333, 233, 499, 466.0, 499.0, 499.0, 499.0, 0.03529328721677137, 0.023103776234676833, 0.022632739523775914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 149.4210526315789, 131, 392, 136.0, 142.0, 392.0, 392.0, 0.10713641284734754, 0.08673445922895616, 0.03808364675433057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1801f8de-1fc7-4e8d-8438-5ba53ba9934f", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 0.7344067581300813, 2.802654979674797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1352b7d-3ca8-4353-9538-bad2e1857dd1", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78bcc5f5-f0a1-46e8-9193-5dc15836e9c7", 1, 0, 0.0, 603.0, 603, 603, 603.0, 603.0, 603.0, 603.0, 1.658374792703151, 0.2996087271973466, 1.1433716832504146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9c25e33-2c93-4dab-ab0d-8054b8864491", 3, 0, 0.0, 398.66666666666663, 217, 751, 228.0, 751.0, 751.0, 751.0, 0.02185251012499636, 0.021916531150753184, 0.014013491193438421], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e72e8c2-f81f-4278-b59b-abb20cdd6c75", 3, 0, 0.0, 384.33333333333337, 216, 668, 269.0, 668.0, 668.0, 668.0, 0.019296823742811935, 0.02660222934596632, 0.012374590746529787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 894.2000000000002, 265, 1425, 992.0, 1370.9, 1422.3999999999999, 1425.0, 0.09394964299135664, 56.271019397665356, 0.19927600056369787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=957374e5-f693-43df-8453-3b8c428bcd27", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 418.375, 263, 1034, 281.0, 701.5000000000003, 1034.0, 1034.0, 0.09768009768009768, 7.445633251297314, 0.218122806013431], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 882.8571428571428, 131, 1427, 1062.0, 1427.0, 1427.0, 1427.0, 0.08012545356729965, 68.4760532204709, 0.144221345134668], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1017.5652173913043, 169, 3235, 878.0, 1692.0, 2927.1999999999957, 3235.0, 0.099930048965724, 0.03148271753250985, 0.045085627560707504], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 457.5263157894737, 264, 1284, 278.0, 786.0, 1284.0, 1284.0, 0.11369348237152636, 7.325714716873309, 0.2541682779476531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 166.0, 133, 392, 146.5, 323.9000000000002, 392.0, 392.0, 0.07409602845287493, 0.05752572521487848, 0.026338822614107884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 526.4117647058823, 263, 1410, 526.0, 1362.0, 1410.0, 1410.0, 0.09077559738352689, 12.900506649646243, 0.20142400046722733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42da93d7-54d9-44b1-9ef0-8b9de1ed6924", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 133.79999999999998, 129, 145, 132.5, 144.1, 145.0, 145.0, 0.05090742484791407, 0.03783256866138926, 0.025553140988113118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 186.20000000000002, 128, 405, 133.5, 403.6, 405.0, 405.0, 0.05091027573005335, 0.021268960895817212, 0.02860719985846943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 257.8, 129, 1125, 132.5, 1051.4000000000003, 1125.0, 1125.0, 0.050654968745884286, 4.570230779288703, 0.029344265097713436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 207.0, 126, 886, 131.0, 811.2000000000003, 886.0, 886.0, 0.05071662592431051, 1.5035399412447887, 0.029429510863501273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 151.0, 151, 151, 151.0, 151.0, 151.0, 151.0, 6.622516556291391, 1.953125, 4.093801738410596], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1265.0740740740744, 1014, 1896, 1090.5, 1789.5, 1824.0, 1896.0, 0.2503349388765524, 299.4876174024505, 0.49431371719569234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1017.5652173913043, 169, 3235, 878.0, 1692.0, 2927.1999999999957, 3235.0, 0.0953699941119395, 0.03004608340313311, 0.043028259062222705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 133.5, 130, 138, 133.0, 138.0, 138.0, 138.0, 0.04519161243673174, 0.012180551789587853, 0.026611857714208244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 134.75, 131, 137, 135.5, 137.0, 137.0, 137.0, 0.04519161243673174, 0.012180551789587853, 0.026567725280187998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 157.91666666666666, 127, 390, 135.5, 321.9000000000002, 390.0, 390.0, 0.07015861693979807, 0.018909939722054948, 0.04124559316187347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 180.66666666666666, 128, 452, 132.5, 432.80000000000007, 452.0, 452.0, 0.0700562201166436, 0.0188823405783141, 0.04125380930696884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 135.75, 134, 138, 135.5, 138.0, 138.0, 138.0, 0.04518854922162724, 0.012091467272193226, 0.025771594477959285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 138.0, 131, 143, 138.5, 142.7, 143.0, 143.0, 0.07015820675623531, 0.05213905795067878, 0.03521613112568843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27becbca-36a3-40b7-a0cd-788eeafd6f27", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 135.25, 128, 139, 137.0, 139.0, 139.0, 139.0, 0.04518752824220515, 0.03358174706281067, 0.022682021012200633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 158.66666666666666, 131, 386, 136.0, 316.10000000000025, 386.0, 386.0, 0.07005703810519065, 0.018745730899240465, 0.039954404544366544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 140.5, 138, 143, 140.5, 143.0, 143.0, 143.0, 0.043590553926964024, 0.03431053365735645, 0.015495079716225492], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 507.2307692307692, 131, 751, 466.0, 727.8, 751.0, 751.0, 0.09732797280806176, 0.01823437230944306, 0.06624034207039059], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1469.9999999999998, 721, 4491, 1334.0, 2150.1, 4140.899999999995, 4491.0, 0.09233494080071182, 0.04779054553161842, 0.042470465934702405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 273.0, 266, 278, 274.0, 278.0, 278.0, 278.0, 0.045117191905975775, 0.06992283550271831, 0.10146962203072481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8b2e95b-18e8-4fd0-8f49-9c100cb57522", 3, 0, 0.0, 407.0, 243, 693, 285.0, 693.0, 693.0, 693.0, 0.043225174341536506, 0.02739564272232148, 0.0277192687020921], "isController": false}, {"data": ["addBook", 56, 7, 12.5, 1343.0892857142858, 678, 4730, 1095.5, 2016.4000000000008, 2698.3999999999996, 4730.0, 0.2609846578304718, 90.24039261151269, 0.9467611687452231], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 228.51851851851856, 130, 551, 137.5, 526.5, 546.0, 551.0, 0.25140367049358925, 0.18683417309142714, 0.12152814149836587], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 727.4814814814814, 631, 1079, 657.5, 981.0, 1073.0, 1079.0, 0.2513276148543929, 73.89866362940347, 0.12640011879884017], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 226.5185185185185, 128, 545, 138.0, 422.0, 498.75, 545.0, 0.25192442267319803, 0.44578813855843247, 0.1225179321203639], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1025.9814814814818, 875, 1339, 942.0, 1265.5, 1304.75, 1339.0, 0.25100634953099, 225.85595453008358, 0.12599342154192272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 197.2941176470588, 135, 400, 144.0, 396.8, 400.0, 400.0, 0.08849557522123894, 0.06611241703539823, 0.03145741150442478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b7406bc-6c63-4f06-a005-93141c0ab5c8", 3, 0, 0.0, 505.0, 263, 670, 582.0, 670.0, 670.0, 670.0, 0.035453030643236155, 0.029555732902775973, 0.022735179155981517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 7, 4.216867469879518, 229.42771084337352, 128, 3081, 143.5, 341.1000000000001, 408.95000000000005, 2460.5800000000118, 0.6858228841744304, 1.5140803814889794, 0.32901616951393337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 164.6, 128, 387, 139.5, 364.4000000000001, 387.0, 387.0, 0.05069991228915174, 0.039262725044235676, 0.018022234446534408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 156.1875, 133, 394, 139.5, 224.60000000000016, 394.0, 394.0, 0.10534563243592023, 0.08549044976000948, 0.03744708027995602], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e31e51a-4753-40ce-b442-eb79b85b41f0", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1801f8de-1fc7-4e8d-8438-5ba53ba9934f", 3, 0, 0.0, 1349.0, 220, 3428, 399.0, 3428.0, 3428.0, 3428.0, 0.06086921235239216, 0.02754173345371911, 0.03903396755670981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d91147e1-d7a1-4771-8029-a3eb78e7f200", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.0504471628289473, 1.9627621299342106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 421.5, 263, 1261, 273.5, 1188.6000000000004, 1261.0, 1261.0, 0.05061753391374772, 6.126219368482992, 0.11254492306134845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 345.5, 264, 595, 280.5, 574.6, 595.0, 595.0, 0.06999941667152773, 0.10848542407979933, 0.15743032870559412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9c25e33-2c93-4dab-ab0d-8054b8864491", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb3d569f-5317-4686-b37f-330785673fdb", 3, 0, 0.0, 378.3333333333333, 242, 541, 352.0, 541.0, 541.0, 541.0, 0.0182824269312337, 0.025203801449796455, 0.011724082374521608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e72e8c2-f81f-4278-b59b-abb20cdd6c75", 1, 0, 0.0, 723.0, 723, 723, 723.0, 723.0, 723.0, 723.0, 1.3831258644536653, 0.2498811376210235, 0.953600449515906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/957374e5-f693-43df-8453-3b8c428bcd27", 3, 0, 0.0, 322.0, 233, 419, 314.0, 419.0, 419.0, 419.0, 0.04043017708417563, 0.0259927082491038, 0.025926903924422522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 142.66666666666669, 131, 168, 140.0, 164.70000000000002, 168.0, 168.0, 0.06473225122586701, 0.05366961063550888, 0.023010292427944914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89b64677-c43c-4927-9ce2-413626e85db2", 3, 0, 0.0, 335.0, 231, 420, 354.0, 420.0, 420.0, 420.0, 0.09994003597841296, 0.045220263675128256, 0.0640891506762609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78bcc5f5-f0a1-46e8-9193-5dc15836e9c7", 3, 0, 0.0, 305.0, 221, 455, 239.0, 455.0, 455.0, 455.0, 0.03310673611724199, 0.027599723696698154, 0.02123055668976781], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 137.45000000000002, 128, 152, 135.5, 144.8, 151.65, 152.0, 0.08981457780412339, 0.0697290911662872, 0.03192627570380949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20233676-0b26-4b9e-8adf-840c6d21fb7a", 1, 0, 0.0, 692.0, 692, 692, 692.0, 692.0, 692.0, 692.0, 1.445086705202312, 0.2610752348265896, 0.9963195447976879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 150.7058823529412, 129, 400, 134.0, 199.19999999999982, 400.0, 400.0, 0.09084156696359391, 0.06751018794853024, 0.04559820841727272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 178.4705882352941, 127, 406, 132.0, 398.0, 406.0, 406.0, 0.09084253781988597, 0.04035938577085237, 0.05091106381955466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 324.4117647058823, 129, 1260, 133.0, 1217.6, 1260.0, 1260.0, 0.09083865451922307, 9.637695286408933, 0.052484787865024446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 292.5882352941176, 130, 736, 140.0, 661.5999999999999, 736.0, 736.0, 0.09083962531326312, 3.1639408099688473, 0.052574059342321115], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 35.294117647058826, 0.477326968973747], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07955449482895784], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07955449482895784], "isController": false}, {"data": ["401/Unauthorized", 9, 52.94117647058823, 0.7159904534606205], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1257, 17, "401/Unauthorized", 9, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
