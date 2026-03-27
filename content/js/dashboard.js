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

    var data = {"OkPercent": 97.11163153786104, "KoPercent": 2.888368462138954};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7327989311957248, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8eb56508-889a-4e18-9633-d18e8c313c5d"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0b7065b-567c-4681-9c39-dde997e90626"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0d3d8de5-f86c-44f6-a0f1-9f9fc0cdfb1e"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/84e29023-29ee-457a-8bdd-b7132a4ef235"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=238e5893-55dc-4a79-9468-91a17deb79e6"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a8c2fb1-1894-4f47-9898-5bd15fdb8697"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bf5fb2b-926f-46ee-b2ab-da888239dae9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de56216e-e893-4c1c-90f8-c5def5596098"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41f577b9-2452-4317-a81a-126fb44b9131"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c27ca847-7de7-4f06-9559-f0a1e4e30318"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c5326cf-386d-4d1a-9c77-83f5dbd4b36d"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0a07f0a-ce36-4100-8788-10eed586c573"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aeda0254-3934-449e-b613-ced148c08217"], "isController": false}, {"data": [0.15625, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3113207547169811, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/238e5893-55dc-4a79-9468-91a17deb79e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d3d8de5-f86c-44f6-a0f1-9f9fc0cdfb1e"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84e29023-29ee-457a-8bdd-b7132a4ef235"], "isController": false}, {"data": [0.27586206896551724, 500, 1500, "addBook"], "isController": true}, {"data": [0.9339622641509434, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9811320754716981, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4339622641509434, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9171597633136095, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8eb56508-889a-4e18-9633-d18e8c313c5d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/41f577b9-2452-4317-a81a-126fb44b9131"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/9bf5fb2b-926f-46ee-b2ab-da888239dae9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c27ca847-7de7-4f06-9559-f0a1e4e30318"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a8c2fb1-1894-4f47-9898-5bd15fdb8697"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d6dbe6b-9996-466a-8c82-71a8a26feb82"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0b7065b-567c-4681-9c39-dde997e90626"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de56216e-e893-4c1c-90f8-c5def5596098"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aeda0254-3934-449e-b613-ced148c08217"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1281, 37, 2.888368462138954, 434.90007806401303, 120, 2458, 141.0, 1245.8, 1497.0, 1892.940000000002, 5.020556454805194, 706.5409115276345, 3.6718912281354963], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8eb56508-889a-4e18-9633-d18e8c313c5d", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["see books", 53, 0, 0.0, 2141.4716981132065, 1658, 3012, 2031.0, 2626.6, 2784.7999999999997, 3012.0, 0.24109319844244698, 290.1160522225495, 1.185453373200899], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f0b7065b-567c-4681-9c39-dde997e90626", 3, 0, 0.0, 352.6666666666667, 228, 543, 287.0, 543.0, 543.0, 543.0, 0.028668628875043005, 0.028752618998700356, 0.01838450484499828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d3d8de5-f86c-44f6-a0f1-9f9fc0cdfb1e", 3, 0, 0.0, 434.6666666666667, 283, 591, 430.0, 591.0, 591.0, 591.0, 0.0234571086767845, 0.027725508335092616, 0.015042481801193185], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 481.73333333333335, 128, 1078, 477.0, 914.8000000000001, 1078.0, 1078.0, 0.0907067872865367, 0.019151179112645737, 0.060494813083547], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 481.73333333333335, 128, 1078, 477.0, 914.8000000000001, 1078.0, 1078.0, 0.09125752874612154, 0.019267458705968243, 0.06086211747885867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 184.30769230769232, 123, 381, 127.0, 378.2, 381.0, 381.0, 0.07461230299482305, 0.019964620137286636, 0.04255232905173502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 147.3846153846154, 126, 374, 129.0, 277.9999999999999, 374.0, 374.0, 0.0746161572679007, 0.05545204656335199, 0.03745381331611422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 212.92307692307693, 123, 496, 126.0, 448.79999999999995, 496.0, 496.0, 0.07461059011237503, 0.02010988561622608, 0.04393572835718959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 185.15384615384616, 123, 382, 127.0, 379.2, 382.0, 382.0, 0.07461101832561395, 0.02011000103307564, 0.043863118195331646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84e29023-29ee-457a-8bdd-b7132a4ef235", 3, 0, 0.0, 462.33333333333337, 212, 858, 317.0, 858.0, 858.0, 858.0, 0.024260656493364712, 0.02867527465084872, 0.015557777764299636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=238e5893-55dc-4a79-9468-91a17deb79e6", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 349.3333333333333, 122, 1377, 227.0, 1096.2000000000003, 1377.0, 1377.0, 0.09099346666909315, 0.15483107062912882, 0.05880215821337361], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a8c2fb1-1894-4f47-9898-5bd15fdb8697", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 127.8, 123, 138, 127.0, 136.3, 137.95, 138.0, 0.10351752551707004, 0.07693050480321319, 0.05196094542556055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 151.15, 122, 387, 126.0, 350.7000000000005, 386.4, 387.0, 0.10352127621029313, 0.035474234201359235, 0.0586047693545966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 919.625, 665, 1019, 985.0, 1019.0, 1019.0, 1019.0, 0.03983131438358552, 11.711728952884533, 0.022716296484388613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1310.7500000000002, 1119, 1525, 1294.0, 1525.0, 1525.0, 1525.0, 0.03973891532630617, 35.75714586417239, 0.02262479261253564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 220.25, 123, 381, 128.0, 381.0, 381.0, 381.0, 0.039938095951275523, 0.07067170885128052, 0.022114160551145724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 129.4, 126, 141, 128.5, 140.0, 141.0, 141.0, 0.06283538386136, 0.046696999139155246, 0.031540417289784226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 125.9, 124, 131, 125.0, 130.8, 131.0, 131.0, 0.06283617352837681, 0.026251284214296487, 0.03530852953928518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 248.20000000000002, 125, 1332, 128.0, 1211.8000000000004, 1332.0, 1332.0, 0.06283459421419056, 5.669110130585995, 0.03639988407017367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 214.89999999999998, 126, 998, 128.0, 911.2000000000003, 998.0, 998.0, 0.06283419939804837, 1.8627762937561656, 0.03646101687726596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bf5fb2b-926f-46ee-b2ab-da888239dae9", 1, 0, 0.0, 1075.0, 1075, 1075, 1075.0, 1075.0, 1075.0, 1075.0, 0.930232558139535, 0.16805959302325582, 0.6413517441860466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 128.625, 124, 146, 126.0, 146.0, 146.0, 146.0, 0.039937896570832354, 0.029680409463284593, 0.022426064968973244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 1180.4166666666667, 125, 1859, 1416.5, 1821.2, 1859.0, 1859.0, 0.07067221050895771, 47.697996525651064, 0.03699248518828255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 234.95, 122, 1536, 127.0, 383.9, 1478.3999999999992, 1536.0, 0.10352341958559576, 4.684035402744923, 0.06041562064878127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 737.5833333333334, 125, 1133, 975.5, 1097.9, 1133.0, 1133.0, 0.0706713780918728, 15.58956078842756, 0.03706106448763251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 194.59999999999997, 124, 725, 126.0, 382.40000000000003, 707.8999999999997, 725.0, 0.10352449130653084, 1.5484898203073643, 0.06051734423446227], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 472.40000000000003, 125, 1075, 420.0, 1018.0, 1075.0, 1075.0, 0.09089256498818396, 0.01919040288129431, 0.06093825743804157], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 379.4, 254, 1462, 258.5, 1343.0000000000005, 1462.0, 1462.0, 0.06278370386182562, 7.598685927268219, 0.13959564155527793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de56216e-e893-4c1c-90f8-c5def5596098", 3, 0, 0.0, 331.0, 227, 465, 301.0, 465.0, 465.0, 465.0, 0.04971167230065619, 0.031959815362563794, 0.03187890443759528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 638.6818181818181, 185, 1559, 551.0, 1320.3, 1524.4999999999995, 1559.0, 0.09034907597535935, 0.055497625770020535, 0.040851193531827514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 127.25, 124, 130, 127.0, 130.0, 130.0, 130.0, 0.07067096189068381, 0.05252011913946326, 0.03547351016778465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 168.83333333333331, 124, 386, 125.5, 384.8, 386.0, 386.0, 0.07067262672485379, 0.09852067836887578, 0.03585393514019682], "isController": false}, {"data": ["login", 22, 0, 0.0, 2936.909090909091, 1753, 4348, 2628.5, 4239.0, 4340.65, 4348.0, 0.08996004955980913, 39.25591730115762, 0.18997511531242717], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 144.9, 126, 380, 132.5, 143.9, 368.1999999999998, 380.0, 0.10130891113182316, 0.0820166868440248, 0.03601215200389026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41f577b9-2452-4317-a81a-126fb44b9131", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c27ca847-7de7-4f06-9559-f0a1e4e30318", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 0.6429326067615658, 2.453569839857651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c5326cf-386d-4d1a-9c77-83f5dbd4b36d", 1, 0, 0.0, 1807.0, 1807, 1807, 1807.0, 1807.0, 1807.0, 1807.0, 0.5534034311012728, 0.17672160348644161, 0.33020458633093525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 1309.3333333333333, 255, 1989, 1543.5, 1950.6000000000001, 1989.0, 1989.0, 0.0706177285807602, 63.38987647966209, 0.1452697707571986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0a07f0a-ce36-4100-8788-10eed586c573", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aeda0254-3934-449e-b613-ced148c08217", 3, 0, 0.0, 310.3333333333333, 227, 470, 234.0, 470.0, 470.0, 470.0, 0.036818851251840944, 0.030143037401816394, 0.023611047189494354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 783.1875000000001, 122, 1654, 687.0, 1633.7, 1654.0, 1654.0, 0.07942693466638207, 47.521740020750286, 0.11586326529092596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 458.1538461538462, 253, 757, 503.0, 705.4, 757.0, 757.0, 0.0745541090783965, 0.11554430772208522, 0.16767393867924527], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 1006.7083333333334, 303, 1819, 935.5, 1663.0, 1790.25, 1819.0, 0.09968060672262626, 0.03085815657331301, 0.04497308623618489], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 377.54999999999995, 253, 1660, 257.0, 514.7, 1602.749999999999, 1660.0, 0.10344631394921822, 6.340193265192385, 0.2313297991331199], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 137.15789473684208, 126, 216, 131.0, 153.0, 216.0, 216.0, 0.09616601290649121, 0.07466013697330129, 0.0341840124003543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 603.8000000000001, 253, 1730, 503.0, 1590.2, 1730.0, 1730.0, 0.09228100180255558, 14.843969888324608, 0.20439400796385046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 168.15384615384616, 121, 374, 127.0, 372.0, 374.0, 374.0, 0.06906921266410579, 0.051329756677133305, 0.03466950713803747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 149.69230769230768, 120, 371, 126.0, 300.19999999999993, 371.0, 371.0, 0.06907104754213333, 0.018481901393109897, 0.03939208180137292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 210.0769230769231, 123, 385, 129.0, 383.8, 385.0, 385.0, 0.06906884570019871, 0.018616212317631685, 0.040604926866718384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 169.15384615384616, 122, 376, 126.0, 376.0, 376.0, 376.0, 0.06906957963191228, 0.018616410135163852, 0.040672809099651465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 127.5, 125, 129, 128.0, 129.0, 129.0, 129.0, 0.028733361587805564, 0.008474096874528592, 0.017761931528399336], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1489.6226415094338, 980, 2458, 1397.0, 2023.8000000000002, 2267.3999999999996, 2458.0, 0.23943222938511094, 286.44418645558983, 0.47278512482099055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 1006.7083333333334, 303, 1819, 935.5, 1663.0, 1790.25, 1819.0, 0.0972467027289856, 0.030104692153406675, 0.04387497720780405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 180.77777777777777, 122, 375, 127.0, 375.0, 375.0, 375.0, 0.039642338017002156, 0.010684848918645113, 0.023344072093996387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 152.77777777777777, 121, 367, 126.0, 367.0, 367.0, 367.0, 0.039685514346313434, 0.010696486288654794, 0.023330741832500675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 248.52631578947367, 123, 1443, 128.0, 375.0, 1443.0, 1443.0, 0.09583520380112683, 4.563033437974447, 0.05590715271087528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 210.8947368421053, 124, 972, 127.0, 378.0, 972.0, 972.0, 0.09583617058838365, 1.5075774413003455, 0.05600130671357595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/238e5893-55dc-4a79-9468-91a17deb79e6", 3, 0, 0.0, 542.3333333333334, 211, 969, 447.0, 969.0, 969.0, 969.0, 0.03647992995853448, 0.030411816609312112, 0.02339370508408624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 152.11111111111111, 122, 367, 126.0, 367.0, 367.0, 367.0, 0.03968603933327454, 0.010619115993473852, 0.022633444307258135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 155.31578947368422, 123, 386, 128.0, 386.0, 386.0, 386.0, 0.09583520380112683, 0.07122127938736085, 0.04810478003298749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 155.22222222222223, 124, 379, 127.0, 379.0, 379.0, 379.0, 0.03968428943075091, 0.029491937750782665, 0.019919653093169894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 152.42105263157896, 122, 373, 127.0, 365.0, 373.0, 373.0, 0.09583520380112683, 0.03321919276494651, 0.05423240099971249], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 187.0, 126, 386, 133.0, 386.0, 386.0, 386.0, 0.041029194551322964, 0.032294463680045224, 0.014584596500665585], "isController": false}, {"data": ["deleteAccount", 14, 4, 28.571428571428573, 416.92857142857144, 126, 858, 464.5, 741.0, 858.0, 858.0, 0.09317493594223154, 0.01914713736647699, 0.06339483295065056], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d3d8de5-f86c-44f6-a0f1-9f9fc0cdfb1e", 1, 0, 0.0, 793.0, 793, 793, 793.0, 793.0, 793.0, 793.0, 1.2610340479192939, 0.22782353404791927, 0.8694238650693569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1435.0454545454543, 971, 2236, 1350.5, 1886.3, 2192.0499999999993, 2236.0, 0.09065996332392393, 0.046923613829765315, 0.04170004172418767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 365.2222222222223, 252, 755, 259.0, 755.0, 755.0, 755.0, 0.03961912811505395, 0.061401910467373644, 0.08910434770407152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84e29023-29ee-457a-8bdd-b7132a4ef235", 1, 0, 0.0, 980.0, 980, 980, 980.0, 980.0, 980.0, 980.0, 1.0204081632653061, 0.18435108418367346, 0.7035235969387755], "isController": false}, {"data": ["addBook", 58, 11, 18.96551724137931, 1269.034482758621, 638, 3110, 987.5, 2322.3, 2479.0999999999995, 3110.0, 0.2552199071527579, 74.71389604326637, 0.9283263157026248], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 232.96226415094344, 124, 518, 131.0, 505.0, 511.4, 518.0, 0.24051224570367982, 0.17874005759814487, 0.11626324377277492], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 777.9622641509434, 610, 1136, 746.0, 996.6, 1014.0, 1136.0, 0.24041732819233386, 70.6906770951463, 0.12091301173735541], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 219.28301886792457, 124, 536, 131.0, 384.0, 425.99999999999966, 536.0, 0.2409627598874295, 0.42639113370705295, 0.11718696721087879], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1255.132075471698, 850, 1920, 1246.0, 1639.0, 1787.6999999999998, 1920.0, 0.24001557836961493, 215.9664393193634, 0.12047656961131063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 131.66666666666669, 127, 143, 130.0, 141.8, 143.0, 143.0, 0.09101886517678898, 0.06799749205101911, 0.03235436223081171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 11, 6.508875739644971, 200.34319526627218, 123, 1080, 132.0, 370.0, 426.5, 1000.2000000000013, 0.6906867633355676, 1.4827997858973205, 0.3326596114784784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 134.15384615384616, 127, 161, 130.0, 153.0, 161.0, 161.0, 0.06888074094483182, 0.0533422144230973, 0.024484950882733187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8eb56508-889a-4e18-9633-d18e8c313c5d", 3, 0, 0.0, 538.0, 241, 909, 464.0, 909.0, 909.0, 909.0, 0.027419797093501508, 0.027500128530298876, 0.01758365894342382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41f577b9-2452-4317-a81a-126fb44b9131", 3, 0, 0.0, 397.6666666666667, 243, 624, 326.0, 624.0, 624.0, 624.0, 0.03664704014072464, 0.03055112949231634, 0.023500868840243338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 151.15384615384616, 126, 381, 133.0, 283.3999999999999, 381.0, 381.0, 0.07406521157012552, 0.060105655092553036, 0.026327868175318056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bf5fb2b-926f-46ee-b2ab-da888239dae9", 2, 0, 0.0, 424.5, 321, 528, 424.5, 528.0, 528.0, 528.0, 0.015698217467406576, 0.026828008367149908, 0.00975772990039481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c27ca847-7de7-4f06-9559-f0a1e4e30318", 3, 0, 0.0, 632.6666666666666, 236, 1113, 549.0, 1113.0, 1113.0, 1113.0, 0.05290445455507354, 0.02393788796600007, 0.03392635920361161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 379.6153846153846, 250, 756, 261.0, 755.6, 756.0, 756.0, 0.06902190649124483, 0.10697047422031793, 0.15523188539974303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a8c2fb1-1894-4f47-9898-5bd15fdb8697", 3, 0, 0.0, 764.6666666666666, 441, 1377, 476.0, 1377.0, 1377.0, 1377.0, 0.03154408285579097, 0.02629700396929709, 0.020228464591766995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 418.6315789473685, 253, 1574, 260.0, 760.0, 1574.0, 1574.0, 0.09577288719970159, 6.171020841314407, 0.2141057631964957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 156.9, 126, 381, 131.0, 357.0000000000001, 381.0, 381.0, 0.05867305029453872, 0.04864591767584313, 0.020856435846886807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 134.0, 129, 143, 132.0, 142.1, 143.0, 143.0, 0.0668851581833991, 0.05192744214433817, 0.02377558357300515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d6dbe6b-9996-466a-8c82-71a8a26feb82", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.9020789194915255, 1.6855358403954803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0b7065b-567c-4681-9c39-dde997e90626", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 176.79999999999995, 123, 376, 128.0, 376.0, 376.0, 376.0, 0.0924943886737538, 0.06873850564524085, 0.046427847439755324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 242.86666666666667, 123, 386, 131.0, 381.2, 386.0, 386.0, 0.09235315847801995, 0.04320636698066741, 0.05163599772195543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 374.06666666666666, 121, 1353, 133.0, 1213.2, 1353.0, 1353.0, 0.0924943886737538, 11.11848791329576, 0.053316752429519276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 317.59999999999997, 123, 1009, 128.0, 995.8, 1009.0, 1009.0, 0.09235258987446204, 3.6422033634813236, 0.053325203098737235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de56216e-e893-4c1c-90f8-c5def5596098", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aeda0254-3934-449e-b613-ced148c08217", 1, 0, 0.0, 758.0, 758, 758, 758.0, 758.0, 758.0, 758.0, 1.3192612137203166, 0.23834309036939313, 0.9095687664907651], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 27.027027027027028, 0.78064012490242], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.312256049960968], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.81081081081081, 0.312256049960968], "isController": false}, {"data": ["401/Unauthorized", 19, 51.351351351351354, 1.483216237314598], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1281, 37, "401/Unauthorized", 19, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
