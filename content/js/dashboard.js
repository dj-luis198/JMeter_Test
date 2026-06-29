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

    var data = {"OkPercent": 97.83281733746131, "KoPercent": 2.1671826625387};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7662682602921647, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.037037037037037035, 500, 1500, "see books"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f8ed6f95-f702-4568-b50e-938923899042"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45ffb929-75ed-48fa-a0c3-fa911cbb7ffe"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11e803ca-591a-409f-97b1-8f11db27399d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=481c379d-68ba-4441-a37a-bea529a677ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/608cf24d-83ad-4c2b-85ad-1d22fa4e2469"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aba1b3c9-e7ae-407b-8945-eec2ee1932e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d78ca90d-c99e-4da2-a13c-970789af8669"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/11e803ca-591a-409f-97b1-8f11db27399d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0be33bdb-9962-4873-aa2f-43498baff2cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2761824c-2b46-47ad-a63c-9f9b3f3e9bc1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7399af0-ed00-4f30-8588-4bce64804a84"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f1abdd05-d8bf-4c19-b9da-71ae8653a6e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4359504-eac6-4dfc-84f5-8c44b3f6b462"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cd176c2-a46f-42ba-9c16-f984bf53c89b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=687e8f28-36c3-4691-ae26-49197e0c62b0"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/481c379d-68ba-4441-a37a-bea529a677ac"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/687e8f28-36c3-4691-ae26-49197e0c62b0"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.35185185185185186, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.28448275862068967, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/aba1b3c9-e7ae-407b-8945-eec2ee1932e8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=608cf24d-83ad-4c2b-85ad-1d22fa4e2469"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.48148148148148145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9205882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1abdd05-d8bf-4c19-b9da-71ae8653a6e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a75f77d-5350-4618-94d4-af41a69a4f53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0be33bdb-9962-4873-aa2f-43498baff2cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8ed6f95-f702-4568-b50e-938923899042"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d78ca90d-c99e-4da2-a13c-970789af8669"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2761824c-2b46-47ad-a63c-9f9b3f3e9bc1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5cd176c2-a46f-42ba-9c16-f984bf53c89b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7399af0-ed00-4f30-8588-4bce64804a84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1292, 28, 2.1671826625387, 391.3482972136221, 103, 2250, 126.5, 1119.1000000000001, 1355.0499999999997, 1747.6299999999994, 5.1700887158411994, 721.4319897738686, 3.7848884699418566], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1846.7592592592587, 1410, 2513, 1785.0, 2231.0, 2414.0, 2513.0, 0.2470163625468302, 297.24325969110373, 1.2145775248274315], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 567.4285714285713, 116, 893, 531.0, 868.5, 893.0, 893.0, 0.07438460026247137, 0.014652770029381916, 0.050049794512541775], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 567.4285714285713, 116, 893, 531.0, 868.5, 893.0, 893.0, 0.07301668431236538, 0.014383308907513938, 0.04912939012814428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 122.5625, 103, 312, 109.5, 177.60000000000014, 312.0, 312.0, 0.09458556742473058, 0.025309028783570487, 0.05394333142191666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 140.49999999999997, 104, 340, 115.0, 329.5, 340.0, 340.0, 0.09458388999893592, 0.07029134793866235, 0.047476679159622136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 178.5, 104, 344, 112.5, 343.3, 344.0, 344.0, 0.09459060005911912, 0.025495122672184452, 0.055701300620750814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8ed6f95-f702-4568-b50e-938923899042", 3, 0, 0.0, 733.0, 216, 1457, 526.0, 1457.0, 1457.0, 1457.0, 0.03201331754009668, 0.02668818561855065, 0.02052937355273127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 139.74999999999997, 103, 345, 113.5, 331.7, 345.0, 345.0, 0.0945878040850108, 0.025494369069788064, 0.05560728326091455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45ffb929-75ed-48fa-a0c3-fa911cbb7ffe", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 231.33333333333334, 111, 355, 218.0, 338.8, 355.0, 355.0, 0.07583570951889826, 0.1460528619132844, 0.04901178960899109], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 112.84615384615385, 106, 122, 112.0, 120.4, 122.0, 122.0, 0.11521452057465457, 0.08562329116925013, 0.057832288647824664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 766.375, 642, 1031, 738.5, 1031.0, 1031.0, 1031.0, 0.03684852951336911, 10.834691163262017, 0.02101517698809332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 146.46153846153848, 103, 342, 113.0, 341.6, 342.0, 342.0, 0.11522371126710629, 0.057456054341274904, 0.0642247549280295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1199.75, 788, 1650, 1227.5, 1650.0, 1650.0, 1650.0, 0.036779749070161974, 33.094482865234404, 0.02094003291787542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11e803ca-591a-409f-97b1-8f11db27399d", 1, 0, 0.0, 875.0, 875, 875, 875.0, 875.0, 875.0, 875.0, 1.142857142857143, 0.20647321428571427, 0.7879464285714286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 195.75, 107, 339, 119.5, 339.0, 339.0, 339.0, 0.03696926006025989, 0.06541826096600677, 0.020470283646647814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 115.36363636363636, 111, 120, 115.0, 119.4, 120.0, 120.0, 0.06328130842734443, 0.04702839425118077, 0.03176425051919437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 132.9090909090909, 105, 343, 113.0, 297.60000000000014, 343.0, 343.0, 0.0632856773005782, 0.016933862871443776, 0.036092612835486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 132.54545454545453, 104, 346, 113.0, 300.00000000000017, 346.0, 346.0, 0.0631995035966263, 0.01703424120377818, 0.037154395669110385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 173.72727272727275, 108, 346, 114.0, 345.4, 346.0, 346.0, 0.0631995035966263, 0.01703424120377818, 0.03721611393434146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=481c379d-68ba-4441-a37a-bea529a677ac", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.32493536420863306, 1.2400236061151078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 165.625, 108, 342, 112.5, 342.0, 342.0, 342.0, 0.03696926006025989, 0.02747422549400174, 0.020759105990868595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 670.5499999999998, 104, 1578, 330.0, 1492.6000000000004, 1574.3999999999999, 1578.0, 0.0964301556382712, 39.05990561446501, 0.05296124954195676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 297.7692307692308, 106, 1335, 115.0, 1229.8, 1335.0, 1335.0, 0.11522371126710629, 15.97681662921896, 0.06621554921825144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 456.45000000000005, 110, 923, 340.0, 911.5, 922.5, 923.0, 0.09642504158329918, 12.772767986283538, 0.05305260588674879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 258.2307692307692, 104, 855, 115.0, 770.9999999999999, 855.0, 855.0, 0.11523290342596286, 5.2389420733058545, 0.06633336380357222], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 406.1428571428571, 116, 875, 431.0, 716.5, 875.0, 875.0, 0.0728862973760933, 0.014357624427321948, 0.04950940038004997], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/608cf24d-83ad-4c2b-85ad-1d22fa4e2469", 3, 0, 0.0, 395.0, 328, 436, 421.0, 436.0, 436.0, 436.0, 0.029503456821690942, 0.029589892730348236, 0.01891986000609738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aba1b3c9-e7ae-407b-8945-eec2ee1932e8", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 291.09090909090907, 227, 462, 232.0, 460.8, 462.0, 462.0, 0.06315559816963594, 0.0978788420851682, 0.14203842049284332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d78ca90d-c99e-4da2-a13c-970789af8669", 3, 0, 0.0, 464.66666666666663, 304, 758, 332.0, 758.0, 758.0, 758.0, 0.016285760816459476, 0.02245123602138863, 0.010443668231909233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 668.2173913043476, 166, 1462, 603.0, 1158.6, 1401.3999999999992, 1462.0, 0.09886987434928576, 0.06073159273994214, 0.044703859202850894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 125.55, 106, 325, 115.0, 121.80000000000001, 314.84999999999985, 325.0, 0.09642457669610831, 0.07165928014232267, 0.04840061759941374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 184.30000000000004, 105, 417, 114.5, 341.90000000000003, 413.29999999999995, 417.0, 0.09642690117689033, 0.09097463791698608, 0.051349208214607714], "isController": false}, {"data": ["login", 23, 0, 0.0, 2896.391304347826, 1384, 4696, 2890.0, 4277.2, 4616.799999999999, 4696.0, 0.09878197529591644, 41.237624403550136, 0.20601527872622788], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 132.6153846153846, 107, 352, 116.0, 259.9999999999999, 352.0, 352.0, 0.11067126378070063, 0.08959616960371174, 0.03934017579704593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11e803ca-591a-409f-97b1-8f11db27399d", 3, 0, 0.0, 331.3333333333333, 213, 548, 233.0, 548.0, 548.0, 548.0, 0.03571811265492731, 0.02296330484813849, 0.02290516989915586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0be33bdb-9962-4873-aa2f-43498baff2cb", 2, 0, 0.0, 290.5, 226, 355, 290.5, 355.0, 355.0, 355.0, 0.013010245568385105, 0.025715563506261183, 0.008086934867458123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2761824c-2b46-47ad-a63c-9f9b3f3e9bc1", 3, 0, 0.0, 286.6666666666667, 203, 448, 209.0, 448.0, 448.0, 448.0, 0.10913059294288832, 0.04831302291742452, 0.06998283466715169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 801.0500000000001, 221, 1695, 558.0, 1613.9000000000003, 1691.6, 1695.0, 0.09637114455189827, 51.9641728600185, 0.20564510543003214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7399af0-ed00-4f30-8588-4bce64804a84", 3, 0, 0.0, 297.3333333333333, 198, 448, 246.0, 448.0, 448.0, 448.0, 0.023083315379643594, 0.023150942280169895, 0.014802777115201133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1abdd05-d8bf-4c19-b9da-71ae8653a6e1", 3, 0, 0.0, 640.0, 272, 1352, 296.0, 1352.0, 1352.0, 1352.0, 0.022080254364530278, 0.026098113150263492, 0.014159538117879119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4359504-eac6-4dfc-84f5-8c44b3f6b462", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, 38.46153846153846, 894.3846153846155, 111, 1759, 1142.0, 1717.8, 1759.0, 1759.0, 0.05883098311098239, 43.31824457680158, 0.0965505174298101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 336.75, 219, 654, 234.0, 653.3, 654.0, 654.0, 0.09451684171973394, 0.1464826443449392, 0.2125705922661594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cd176c2-a46f-42ba-9c16-f984bf53c89b", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 0.9217554209183673, 3.5176179846938775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=687e8f28-36c3-4691-ae26-49197e0c62b0", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1069.5217391304352, 359, 1913, 1073.0, 1685.6000000000006, 1900.7999999999997, 1913.0, 0.09879215847980344, 0.030822213846365305, 0.044572243376630065], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 120.24999999999999, 108, 155, 118.0, 127.9, 153.64999999999998, 155.0, 0.09385661524888428, 0.0728671964090459, 0.033363093701751834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 461.9230769230769, 223, 1446, 241.0, 1340.8, 1446.0, 1446.0, 0.11509721287672203, 21.33497861017902, 0.2543257599736162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/481c379d-68ba-4441-a37a-bea529a677ac", 3, 0, 0.0, 333.0, 215, 451, 333.0, 451.0, 451.0, 451.0, 0.03217468710116794, 0.026822712781930696, 0.020632855986100537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/687e8f28-36c3-4691-ae26-49197e0c62b0", 3, 0, 0.0, 412.6666666666667, 302, 517, 419.0, 517.0, 517.0, 517.0, 0.020060180541624874, 0.027654578318288197, 0.012864113172851887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 479.2857142857142, 225, 1357, 338.0, 1299.5, 1357.0, 1357.0, 0.08578904473898684, 14.775894312492722, 0.18980586781746542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 137.88888888888889, 106, 344, 114.0, 344.0, 344.0, 344.0, 0.06643586355549978, 0.04937274625560092, 0.03334768932375673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 186.11111111111111, 107, 342, 116.0, 342.0, 342.0, 342.0, 0.06643488274243196, 0.0177765213588148, 0.03788864406404323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 112.77777777777777, 107, 116, 114.0, 116.0, 116.0, 116.0, 0.06643292120317403, 0.017905748293043, 0.03905529156670973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 116.5, 116, 117, 116.5, 117.0, 117.0, 117.0, 0.012444466567940564, 0.0036701454135918466, 0.007692722009283572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 134.44444444444446, 104, 326, 110.0, 326.0, 326.0, 326.0, 0.06643243083645813, 0.017905616123889103, 0.039119878705453366], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1282.6666666666665, 862, 2025, 1223.0, 1751.5, 1932.25, 2025.0, 0.2528184576201356, 302.45876923058916, 0.4992176965897599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1069.5217391304352, 359, 1913, 1073.0, 1685.6000000000006, 1900.7999999999997, 1913.0, 0.09891452065163166, 0.030860389680205054, 0.04462744974712288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 113.11111111111111, 107, 117, 115.0, 117.0, 117.0, 117.0, 0.05421327502394419, 0.01461217178379746, 0.031924418788514014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 112.88888888888889, 107, 117, 114.0, 117.0, 117.0, 117.0, 0.05421360159026564, 0.014612259803626288, 0.03187166812240227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 145.15000000000003, 105, 344, 111.5, 340.00000000000006, 343.9, 344.0, 0.09153108624516601, 0.0246704880895174, 0.05381026749959955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 192.6, 104, 421, 116.0, 341.9, 417.04999999999995, 421.0, 0.09153485647334506, 0.024671504283831282, 0.053901873489674866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 123.75000000000001, 106, 327, 112.0, 126.10000000000002, 316.9999999999999, 327.0, 0.09152480322167308, 0.06801794458173165, 0.04594116099212887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 138.77777777777777, 109, 341, 115.0, 341.0, 341.0, 341.0, 0.05421523448088913, 0.014506810788831662, 0.030919625914882082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 142.75, 104, 326, 114.0, 320.20000000000005, 325.75, 326.0, 0.09153066735009564, 0.024491604349537312, 0.05220108372310143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 114.0, 110, 119, 114.0, 119.0, 119.0, 119.0, 0.05421360159026564, 0.04028960040057828, 0.027212686735738813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 145.0, 118, 323, 120.0, 323.0, 323.0, 323.0, 0.05186751883079087, 0.04082541032970453, 0.01843728208438269], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 514.9999999999999, 116, 1352, 451.0, 1114.3999999999999, 1352.0, 1352.0, 0.07852991989948171, 0.015237588874726656, 0.05344069594121129], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1388.5217391304345, 919, 1887, 1378.0, 1808.8000000000002, 1875.9999999999998, 1887.0, 0.10010053575547614, 0.051809847607814805, 0.04604233627034108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 255.55555555555554, 223, 453, 233.0, 453.0, 453.0, 453.0, 0.054175746120414627, 0.08396182528622852, 0.12184252276886219], "isController": false}, {"data": ["addBook", 58, 11, 18.96551724137931, 1110.7758620689656, 555, 3040, 915.0, 1993.4, 2224.7499999999995, 3040.0, 0.2726935066034143, 74.19082958624637, 0.9933303590738763], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 206.25925925925932, 105, 465, 116.0, 449.5, 461.5, 465.0, 0.2544433345270181, 0.1890931421631453, 0.12299751034265036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aba1b3c9-e7ae-407b-8945-eec2ee1932e8", 3, 0, 0.0, 981.6666666666666, 218, 2250, 477.0, 2250.0, 2250.0, 2250.0, 0.032096889811377274, 0.02675785638246654, 0.020582966448051184], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 733.9074074074074, 529, 1075, 679.5, 911.0, 929.25, 1075.0, 0.2543007435942114, 74.7728621960753, 0.12789539350685433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=608cf24d-83ad-4c2b-85ad-1d22fa4e2469", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 188.16666666666674, 104, 468, 116.0, 343.0, 371.5, 468.0, 0.2546244995921293, 0.450566009043885, 0.1238310554657035], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1074.9259259259259, 751, 1527, 1074.5, 1401.0, 1493.0, 1527.0, 0.2534092935512028, 228.01812778339607, 0.12719958680206858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 134.64285714285714, 107, 323, 117.5, 230.5, 323.0, 323.0, 0.08460339138737476, 0.06320468204232586, 0.03007386178223087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, 6.470588235294118, 182.14117647058828, 106, 1178, 119.0, 325.00000000000006, 393.9, 1086.409999999999, 0.7086079189019078, 1.5130944621249067, 0.34090765510176857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 115.77777777777777, 111, 120, 117.0, 120.0, 120.0, 120.0, 0.06957973838018369, 0.05388352786668522, 0.024733422627330918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 135.37500000000003, 109, 347, 118.5, 204.90000000000015, 347.0, 347.0, 0.09450679267572357, 0.076694477259303, 0.03359421145894861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 325.77777777777777, 218, 687, 232.0, 687.0, 687.0, 687.0, 0.06637853465697048, 0.10287376416075406, 0.14928688019043262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 341.95, 220, 649, 240.0, 530.1000000000001, 643.4499999999999, 649.0, 0.09147666201660301, 0.14177095959018457, 0.2057331568596062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1abdd05-d8bf-4c19-b9da-71ae8653a6e1", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a75f77d-5350-4618-94d4-af41a69a4f53", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0be33bdb-9962-4873-aa2f-43498baff2cb", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 148.36363636363637, 117, 343, 122.0, 311.0000000000001, 343.0, 343.0, 0.06585485589760169, 0.0546003639229139, 0.0234093433073506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 118.3, 113, 142, 117.0, 126.30000000000001, 141.25, 142.0, 0.09550049421505757, 0.07414345009860426, 0.033947441303008745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8ed6f95-f702-4568-b50e-938923899042", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d78ca90d-c99e-4da2-a13c-970789af8669", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2761824c-2b46-47ad-a63c-9f9b3f3e9bc1", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 131.5, 106, 341, 116.0, 236.0, 341.0, 341.0, 0.08584848967978513, 0.06379951234991844, 0.0430919176712984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cd176c2-a46f-42ba-9c16-f984bf53c89b", 3, 0, 0.0, 644.6666666666666, 205, 1142, 587.0, 1142.0, 1142.0, 1142.0, 0.06631153157534095, 0.03000424117504034, 0.042523996485488824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7399af0-ed00-4f30-8588-4bce64804a84", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 188.57142857142856, 107, 337, 115.0, 335.5, 337.0, 337.0, 0.08584954254458044, 0.04139174372685129, 0.04793106435036425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 329.7857142857143, 108, 1240, 116.5, 1187.5, 1240.0, 1240.0, 0.08584848967978513, 11.055065003403278, 0.04941557874146114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 249.64285714285714, 105, 898, 114.0, 867.0, 898.0, 898.0, 0.08585217481955712, 3.6260327173439793, 0.04950153997338583], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 28.571428571428573, 0.6191950464396285], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.23219814241486067], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.15479876160990713], "isController": false}, {"data": ["401/Unauthorized", 15, 53.57142857142857, 1.1609907120743035], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1292, 28, "401/Unauthorized", 15, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
