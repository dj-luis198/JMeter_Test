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

    var data = {"OkPercent": 98.78787878787878, "KoPercent": 1.2121212121212122};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7803129074315515, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.02631578947368421, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bca839a3-a730-4f11-ba96-bd51a09fd893"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c6e4c91-6612-4483-bd8d-c3e32fb9d7be"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d8ccaa9-2e27-4d13-aa8c-35789b1bccfb"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31e16dbe-ad7e-46ab-b482-d45c79379898"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90935938-8514-41c0-9f84-b510af736e7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a0d1b3a-209f-4273-9962-d4e6e4e26714"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aaf89d48-2cac-4de7-be9a-1adfd3f20405"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/31e16dbe-ad7e-46ab-b482-d45c79379898"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cdfe3123-9e00-4e06-9d33-b5b97f81b616"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9d566b5f-c6ce-410d-9d2d-15157ee5d18d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d8ccaa9-2e27-4d13-aa8c-35789b1bccfb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c6e4c91-6612-4483-bd8d-c3e32fb9d7be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/befb2dfb-328b-45f5-a9f3-eaa1eebe4bfc"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19766c4c-0fe4-41e2-b5c5-8b55e692f67c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b11eb315-6136-41ee-ad5f-6e3405a42e70"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abf0248c-055b-4492-b542-f721ec5c4425"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/590eaf95-1e7e-490a-a021-933083621613"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.39473684210526316, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aaf89d48-2cac-4de7-be9a-1adfd3f20405"], "isController": false}, {"data": [0.3305084745762712, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bca839a3-a730-4f11-ba96-bd51a09fd893"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ed7df620-eb95-42ea-b503-64fb20460c98"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9542857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d566b5f-c6ce-410d-9d2d-15157ee5d18d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90935938-8514-41c0-9f84-b510af736e7a"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdfe3123-9e00-4e06-9d33-b5b97f81b616"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/19766c4c-0fe4-41e2-b5c5-8b55e692f67c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=befb2dfb-328b-45f5-a9f3-eaa1eebe4bfc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a0d1b3a-209f-4273-9962-d4e6e4e26714"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/abf0248c-055b-4492-b542-f721ec5c4425"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1320, 16, 1.2121212121212122, 396.8121212121218, 112, 4021, 134.0, 1121.9, 1326.9, 1824.1599999999999, 5.134228971053839, 729.2486793095434, 3.758738915948393], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1884.0175438596493, 1379, 2595, 1837.0, 2307.4, 2359.2999999999997, 2595.0, 0.24974915545351378, 300.53227104136636, 1.2280146461996502], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bca839a3-a730-4f11-ba96-bd51a09fd893", 3, 0, 0.0, 486.33333333333337, 245, 825, 389.0, 825.0, 825.0, 825.0, 0.021830247991617185, 0.021894203796280126, 0.013999215020665968], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 478.85714285714283, 128, 737, 448.0, 731.0, 737.0, 737.0, 0.10021905020974416, 0.018923895711340503, 0.0677750901076639], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 478.85714285714283, 128, 737, 448.0, 731.0, 737.0, 737.0, 0.10012300826729982, 0.01890576055940155, 0.06771013986826672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 165.66666666666669, 114, 346, 115.0, 343.3, 346.0, 346.0, 0.09206972747360669, 0.03231831254091988, 0.05207893764321958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 168.0, 115, 344, 116.0, 343.1, 344.0, 344.0, 0.09217533797623924, 0.06850139863273248, 0.04626769894510446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 235.16666666666666, 113, 672, 121.5, 379.50000000000045, 672.0, 672.0, 0.09217817016090211, 1.5292114381586899, 0.05384061306164671], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c6e4c91-6612-4483-bd8d-c3e32fb9d7be", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 255.11111111111111, 113, 1238, 118.0, 438.80000000000126, 1238.0, 1238.0, 0.09217675404681555, 4.631286782685621, 0.053749769558114883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d8ccaa9-2e27-4d13-aa8c-35789b1bccfb", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 256.7142857142857, 114, 453, 223.0, 421.0, 453.0, 453.0, 0.09905683739820141, 0.23299362144722038, 0.06403178795822631], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31e16dbe-ad7e-46ab-b482-d45c79379898", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 140.8, 114, 366, 116.0, 320.90000000000043, 364.79999999999995, 366.0, 0.13454332631465646, 0.09998776496626326, 0.06753444309153654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 150.1, 113, 346, 116.0, 340.9, 345.75, 346.0, 0.13454332631465646, 0.036000850986538935, 0.07673174078882751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 809.3333333333334, 676, 1018, 791.0, 1018.0, 1018.0, 1018.0, 0.0613747954173486, 18.046227687704583, 0.03500281301145663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1145.5, 1007, 1346, 1129.5, 1346.0, 1346.0, 1346.0, 0.06137605106487449, 55.226278635763826, 0.03494359157306819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 268.1666666666667, 114, 350, 341.5, 350.0, 350.0, 350.0, 0.06180024102093998, 0.1093574577440852, 0.03421946939343063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 116.53846153846153, 114, 120, 116.0, 119.6, 120.0, 120.0, 0.0779942284270964, 0.05796250764943394, 0.03914944669094487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 168.69230769230768, 113, 343, 116.0, 342.2, 343.0, 343.0, 0.07798954940038035, 0.029878808739628893, 0.04397457615679499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 247.00000000000003, 113, 1251, 115.0, 936.5999999999997, 1251.0, 1251.0, 0.07798954940038035, 5.417490853100685, 0.045333769024950656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 248.53846153846155, 113, 796, 124.0, 662.7999999999998, 796.0, 796.0, 0.077989081528586, 1.7833557989381488, 0.0454096582728418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 114.66666666666666, 114, 115, 115.0, 115.0, 115.0, 115.0, 0.06194763360039647, 0.04603725504873214, 0.034785048164285126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 737.3157894736842, 113, 1568, 1007.0, 1462.0, 1568.0, 1568.0, 0.08964505277262712, 42.465537890958586, 0.048646816774948455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 127.69999999999999, 114, 341, 115.0, 123.9, 330.14999999999986, 341.0, 0.13454423141607805, 0.03626387487386478, 0.07909729229734275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 585.6315789473684, 114, 1032, 897.0, 1024.0, 1032.0, 1032.0, 0.08964420686108451, 13.884273162411711, 0.048733900903047425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 126.85, 112, 340, 115.0, 121.9, 329.09999999999985, 340.0, 0.13454604165545447, 0.03626436278994672, 0.07922974913890533], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 427.53846153846155, 132, 815, 416.0, 719.3999999999999, 815.0, 815.0, 0.10924186148131963, 0.020696212038453135, 0.07471808509520848], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 401.0769230769231, 230, 1371, 240.0, 1054.5999999999997, 1371.0, 1371.0, 0.07793297763923025, 7.283408143996163, 0.1737392561147413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90935938-8514-41c0-9f84-b510af736e7a", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a0d1b3a-209f-4273-9962-d4e6e4e26714", 3, 0, 0.0, 330.3333333333333, 227, 436, 328.0, 436.0, 436.0, 436.0, 0.016407967709119547, 0.022619708088581148, 0.010522036584298669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 520.6666666666669, 151, 1061, 528.0, 825.6, 1038.4999999999998, 1061.0, 0.0922322848132955, 0.05665440151129186, 0.04170268346538654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 152.73684210526318, 113, 351, 115.0, 344.0, 351.0, 351.0, 0.08964124629640113, 0.06661815276519656, 0.04499570370737323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 213.42105263157896, 114, 462, 116.0, 462.0, 462.0, 462.0, 0.08964505277262712, 0.09485161679570836, 0.047163176407309375], "isController": false}, {"data": ["login", 21, 0, 0.0, 2827.2857142857147, 1919, 4877, 2701.0, 4125.6, 4805.5999999999985, 4877.0, 0.09038166887599636, 31.016598082402258, 0.1791872065285692], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/aaf89d48-2cac-4de7-be9a-1adfd3f20405", 3, 0, 0.0, 329.0, 206, 567, 214.0, 567.0, 567.0, 567.0, 0.03041886780974012, 0.030507985586526468, 0.019506891141011732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 121.85000000000002, 114, 147, 118.5, 144.70000000000002, 146.95, 147.0, 0.1313551251485955, 0.10634120971502506, 0.0466926421426648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31e16dbe-ad7e-46ab-b482-d45c79379898", 3, 0, 0.0, 403.6666666666667, 198, 615, 398.0, 615.0, 615.0, 615.0, 0.02169479758753851, 0.025642516289177186, 0.013912353921696242], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdfe3123-9e00-4e06-9d33-b5b97f81b616", 3, 0, 0.0, 536.3333333333334, 343, 702, 564.0, 702.0, 702.0, 702.0, 0.09565411472116825, 0.04440194257564646, 0.06134069205752001], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d566b5f-c6ce-410d-9d2d-15157ee5d18d", 3, 0, 0.0, 496.0, 348, 687, 453.0, 687.0, 687.0, 687.0, 0.020182449342052152, 0.023854971862301875, 0.012942521225209225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d8ccaa9-2e27-4d13-aa8c-35789b1bccfb", 3, 0, 0.0, 406.6666666666667, 297, 519, 404.0, 519.0, 519.0, 519.0, 0.022341708991793146, 0.026407143668359674, 0.014327202706325683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c6e4c91-6612-4483-bd8d-c3e32fb9d7be", 3, 0, 0.0, 328.6666666666667, 209, 407, 370.0, 407.0, 407.0, 407.0, 0.07892659826361484, 0.034941462772954485, 0.050613736516706136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/befb2dfb-328b-45f5-a9f3-eaa1eebe4bfc", 3, 0, 0.0, 297.3333333333333, 229, 427, 236.0, 427.0, 427.0, 427.0, 0.05974310465000498, 0.03840905979289057, 0.03831182166683262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 903.6315789473684, 229, 1684, 1123.0, 1578.0, 1684.0, 1684.0, 0.08959221396506847, 56.47810557116215, 0.18943024804075975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19766c4c-0fe4-41e2-b5c5-8b55e692f67c", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b11eb315-6136-41ee-ad5f-6e3405a42e70", 2, 0, 0.0, 234.5, 219, 250, 234.5, 250.0, 250.0, 250.0, 0.02201358238032866, 0.031375804183681334, 0.0136832472510539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 499.72222222222223, 231, 1355, 458.0, 760.1000000000009, 1355.0, 1355.0, 0.09201372026806665, 6.250258588905702, 0.20563309273449443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 974.375, 114, 1461, 1189.0, 1461.0, 1461.0, 1461.0, 0.08173690932311621, 73.34478767560664, 0.15177003512132822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abf0248c-055b-4492-b542-f721ec5c4425", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1067.782608695652, 312, 2523, 1074.0, 1810.0000000000002, 2395.999999999998, 2523.0, 0.09197682184089609, 0.02883648320623203, 0.041497355166498044], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/590eaf95-1e7e-490a-a021-933083621613", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 1.02680365755627, 1.9185842041800643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 292.25000000000006, 230, 707, 233.0, 661.9000000000004, 705.85, 707.0, 0.13443660977757463, 0.20835048800489347, 0.302351086247807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 135.43749999999997, 115, 345, 119.5, 195.90000000000015, 345.0, 345.0, 0.10557780754485407, 0.08196714550601464, 0.03752961127570985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 364.95000000000005, 231, 1247, 239.5, 476.1, 1208.5499999999995, 1247.0, 0.09849354128603016, 6.036639328040127, 0.22025425799890672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 3, 0, 0.0, 115.66666666666667, 115, 117, 115.0, 117.0, 117.0, 117.0, 0.01834795053392536, 0.013635537457341015, 0.009209811107849254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 3, 0, 0.0, 115.0, 114, 116, 115.0, 116.0, 116.0, 116.0, 0.01834795053392536, 0.0049095102014604965, 0.010464065538879307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 3, 0, 0.0, 114.66666666666667, 114, 115, 115.0, 115.0, 115.0, 115.0, 0.018348062750374608, 0.004945376288186905, 0.010786654077856946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 3, 0, 0.0, 115.66666666666667, 115, 116, 116.0, 116.0, 116.0, 116.0, 0.01834795053392536, 0.00494534604234707, 0.01080450602730175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 2.234256628787879, 4.683061079545454], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1277.6315789473683, 901, 2115, 1240.0, 1821.8, 1843.4999999999995, 2115.0, 0.25283104232923925, 302.4738249178299, 0.49924254647433763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1067.782608695652, 312, 2523, 1074.0, 1810.0000000000002, 2395.999999999998, 2523.0, 0.09196615645442477, 0.02883313940469907, 0.041492543244086175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 181.0, 114, 343, 115.0, 343.0, 343.0, 343.0, 0.033351438399893275, 0.008989254881221235, 0.019639567729624652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 181.42857142857142, 115, 344, 117.0, 344.0, 344.0, 344.0, 0.03331508935582895, 0.008979457677938271, 0.01958562870332913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 255.625, 113, 1013, 115.5, 1010.9, 1013.0, 1013.0, 0.10024622980195104, 11.29885877890694, 0.05785695489546198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 256.5, 113, 917, 115.0, 905.1, 917.0, 917.0, 0.10024685788754809, 3.7081302942871823, 0.05795521471623874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 181.71428571428572, 113, 344, 121.0, 344.0, 344.0, 344.0, 0.03331493080012945, 0.008914346718003388, 0.018999921471948827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 144.18750000000003, 114, 344, 116.0, 342.6, 344.0, 344.0, 0.10010135261952727, 0.0743917278744729, 0.05024618676409865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 213.85714285714286, 116, 344, 119.0, 344.0, 344.0, 344.0, 0.0333509616988027, 0.024785236184364116, 0.016740619446469325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 172.4375, 114, 349, 115.5, 346.9, 349.0, 349.0, 0.10024560172422435, 0.04564405449601524, 0.05611893670743321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 120.71428571428571, 117, 125, 120.0, 125.0, 125.0, 125.0, 0.03329607344162484, 0.02620765155659143, 0.011835713606202582], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 595.6923076923076, 115, 1181, 564.0, 1087.3999999999999, 1181.0, 1181.0, 0.10532712173384647, 0.01973301093781649, 0.07168447437715211], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1677.2380952380954, 1003, 4021, 1389.0, 3131.4000000000005, 3951.499999999999, 4021.0, 0.09071548599741676, 0.046952351151006724, 0.04172557998513994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 429.8571428571429, 232, 688, 242.0, 688.0, 688.0, 688.0, 0.033296390195640076, 0.05160290160203203, 0.07488436193413973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aaf89d48-2cac-4de7-be9a-1adfd3f20405", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["addBook", 59, 5, 8.474576271186441, 1167.6949152542377, 588, 4174, 930.0, 1937.0, 2245.0, 4174.0, 0.2796950849514563, 86.14714168807836, 1.0177927109801654], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bca839a3-a730-4f11-ba96-bd51a09fd893", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 194.98245614035093, 114, 551, 116.0, 464.2, 468.59999999999997, 551.0, 0.25384553721731845, 0.18864888068591737, 0.12270853605719986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed7df620-eb95-42ea-b503-64fb20460c98", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.5226447422258592, 0.9765625], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 712.4912280701752, 559, 1029, 679.0, 915.2, 1027.0, 1029.0, 0.2536478566756111, 74.58089176412084, 0.12756703729290989], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 186.91228070175438, 113, 476, 119.0, 347.0, 382.2999999999995, 476.0, 0.25428492402680253, 0.44996511946930295, 0.12366591031772232], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1081.0, 786, 1609, 1121.0, 1352.0, 1360.2, 1609.0, 0.253399780386857, 228.0095678213954, 0.12719481163949659], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 146.4, 115, 373, 120.0, 325.70000000000044, 371.65, 373.0, 0.09416816550996769, 0.07035024083508329, 0.03347384008362133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 5, 2.857142857142857, 190.52000000000004, 114, 2485, 122.0, 312.20000000000005, 414.9999999999999, 1072.920000000017, 0.7305608202319426, 1.5751576184969651, 0.3512114068200983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 3, 0, 0.0, 120.33333333333333, 118, 122, 121.0, 122.0, 122.0, 122.0, 0.017839091395611587, 0.013814843238984362, 0.006341239519533805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 121.72222222222221, 116, 148, 119.0, 129.10000000000002, 148.0, 148.0, 0.09132003104881056, 0.07410834550933747, 0.03246141728688188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d566b5f-c6ce-410d-9d2d-15157ee5d18d", 1, 0, 0.0, 815.0, 815, 815, 815.0, 815.0, 815.0, 815.0, 1.2269938650306749, 0.22167369631901843, 0.845954754601227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 3, 0, 0.0, 232.0, 231, 233, 232.0, 233.0, 233.0, 233.0, 0.018334942733862193, 0.028415580193983693, 0.0412357159336764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90935938-8514-41c0-9f84-b510af736e7a", 3, 0, 0.0, 484.33333333333337, 228, 947, 278.0, 947.0, 947.0, 947.0, 0.016807287639920673, 0.023170202849955742, 0.010778110888881419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 429.56249999999994, 229, 1131, 234.5, 1127.5, 1131.0, 1131.0, 0.10002938363144173, 15.094387589635705, 0.22176924627859435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdfe3123-9e00-4e06-9d33-b5b97f81b616", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 137.9230769230769, 115, 345, 120.0, 258.9999999999999, 345.0, 345.0, 0.07471908497859012, 0.061949710104319336, 0.0265602997384832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19766c4c-0fe4-41e2-b5c5-8b55e692f67c", 3, 0, 0.0, 678.0, 218, 1181, 635.0, 1181.0, 1181.0, 1181.0, 0.02771132192242677, 0.02779250743587138, 0.017770606831764565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 120.78947368421053, 115, 134, 120.0, 129.0, 134.0, 134.0, 0.08684721746086162, 0.06742532996229002, 0.03087147183179065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=befb2dfb-328b-45f5-a9f3-eaa1eebe4bfc", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a0d1b3a-209f-4273-9962-d4e6e4e26714", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abf0248c-055b-4492-b542-f721ec5c4425", 3, 0, 0.0, 346.3333333333333, 206, 454, 379.0, 454.0, 454.0, 454.0, 0.025504348491417785, 0.03014527648839127, 0.01635532764586362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 116.95000000000002, 114, 133, 116.0, 119.9, 132.35, 133.0, 0.09855032472331997, 0.07323905968207665, 0.04946764346463521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 149.3, 113, 343, 115.5, 341.7, 342.95, 343.0, 0.09855275282476827, 0.03377164156856561, 0.055792022277849775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 222.9, 114, 1131, 116.0, 343.0, 1091.5999999999995, 1131.0, 0.09855226719490681, 4.459109932898225, 0.05751448718327765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 211.95, 113, 903, 116.0, 359.90000000000003, 875.9499999999996, 903.0, 0.09855323845941577, 1.4741312378040368, 0.0576112974041077], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 43.75, 0.5303030303030303], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07575757575757576], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07575757575757576], "isController": false}, {"data": ["401/Unauthorized", 7, 43.75, 0.5303030303030303], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1320, 16, "406/Not Acceptable", 7, "401/Unauthorized", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
