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

    var data = {"OkPercent": 97.99382716049382, "KoPercent": 2.006172839506173};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7493351063829787, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.044642857142857144, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5d2951a1-4092-4789-8b19-1ca2d3439185"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dce267b8-7204-4d14-9937-126466c9c9b3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f4e05721-d26c-4ae8-9749-9e64d9f1df65"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e16aac6d-af28-4325-853b-50e1d81b14c1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0c1e0ee-b94c-4a7b-b7a1-ec0a344cdfc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5c28fd1-7863-4075-b13a-39a83c9ea71a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d52534fa-3d46-47ee-a9e7-bf35f7a20091"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ef90c10-65fb-425b-828c-af8b5abe41f9"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ba07336-de04-48e8-bf13-0ca4f92941a6"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7db3bed-45e9-4457-9a2c-cba402013550"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dad11315-8821-4a34-be9f-9ffdeed55de9"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/3a8923da-4625-4e8e-b711-28502d378daf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f6f8aa22-8957-43b3-8ee6-2212217057c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dce267b8-7204-4d14-9937-126466c9c9b3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a0c1e0ee-b94c-4a7b-b7a1-ec0a344cdfc4"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4017857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4e05721-d26c-4ae8-9749-9e64d9f1df65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d2951a1-4092-4789-8b19-1ca2d3439185"], "isController": false}, {"data": [0.23275862068965517, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e52ef9f1-02e0-4f8c-aa7e-6ed28ce09889"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8808139534883721, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ef90c10-65fb-425b-828c-af8b5abe41f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d5c28fd1-7863-4075-b13a-39a83c9ea71a"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e7db3bed-45e9-4457-9a2c-cba402013550"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c9478a0-cbae-4d20-a9c0-48b8c61a0c63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a8923da-4625-4e8e-b711-28502d378daf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dad11315-8821-4a34-be9f-9ffdeed55de9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6f8aa22-8957-43b3-8ee6-2212217057c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 26, 2.006172839506173, 415.3047839506173, 107, 2462, 128.0, 1144.3, 1434.5999999999995, 1978.1799999999998, 5.065567042545291, 714.075703031865, 3.708799975326858], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1840.053571428571, 1360, 2675, 1810.5, 2212.2000000000003, 2442.05, 2675.0, 0.24854424087487573, 299.0821434208453, 1.2220900906298822], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5d2951a1-4092-4789-8b19-1ca2d3439185", 3, 0, 0.0, 1065.3333333333333, 338, 2147, 711.0, 2147.0, 2147.0, 2147.0, 0.02988881361335831, 0.024917074109313354, 0.019166980084087196], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 717.3076923076924, 119, 2343, 574.0, 1863.3999999999996, 2343.0, 2343.0, 0.07820207415962847, 0.015502950248441975, 0.05257726590509878], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 717.3076923076924, 119, 2343, 574.0, 1863.3999999999996, 2343.0, 2343.0, 0.07963148996643227, 0.015786320764829834, 0.05353829891823683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 211.92857142857142, 110, 349, 116.0, 346.0, 349.0, 349.0, 0.08439581637881664, 0.031636657172137324, 0.04762570832203032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 128.92857142857144, 110, 323, 114.5, 220.5, 323.0, 323.0, 0.0845114633763537, 0.06280588245059097, 0.04242079314008379], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dce267b8-7204-4d14-9937-126466c9c9b3", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 168.57142857142856, 108, 678, 114.0, 502.0, 678.0, 678.0, 0.08451044307618014, 1.7960709246347941, 0.04924666862851624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 255.5, 109, 1200, 115.0, 773.0, 1200.0, 1200.0, 0.08451044307618014, 5.4527687073674995, 0.049164138898949654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4e05721-d26c-4ae8-9749-9e64d9f1df65", 3, 0, 0.0, 886.0, 311, 1917, 430.0, 1917.0, 1917.0, 1917.0, 0.020497263615307355, 0.024227071675514654, 0.013144404076222492], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 484.00000000000017, 116, 1973, 312.0, 1824.0, 1973.0, 1973.0, 0.08170983669705494, 0.16645187436528966, 0.05281273345667628], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e16aac6d-af28-4325-853b-50e1d81b14c1", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 1.4992297535211268, 2.80131308685446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0c1e0ee-b94c-4a7b-b7a1-ec0a344cdfc4", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 115.85000000000002, 110, 127, 116.0, 126.10000000000002, 127.0, 127.0, 0.09378575581940615, 0.06969820329938288, 0.04707605321403785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 148.2, 109, 344, 114.5, 341.1, 343.9, 344.0, 0.09368515230863636, 0.02506809739508434, 0.05342981342601918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 791.6666666666666, 670, 910, 794.5, 910.0, 910.0, 910.0, 0.06235969069593415, 18.335819601209778, 0.03556451110002495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1197.8333333333333, 980, 1353, 1260.0, 1353.0, 1353.0, 1353.0, 0.06209701623836975, 55.87500436619645, 0.03535406295602496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 222.5, 110, 341, 218.5, 341.0, 341.0, 341.0, 0.06288187639519163, 0.11127144533992894, 0.03481838273054068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5c28fd1-7863-4075-b13a-39a83c9ea71a", 1, 0, 0.0, 1754.0, 1754, 1754, 1754.0, 1754.0, 1754.0, 1754.0, 0.5701254275940707, 0.10300117588369441, 0.39307475769669326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 113.9090909090909, 109, 122, 115.0, 121.4, 122.0, 122.0, 0.0649876228118372, 0.04829646578106261, 0.032620740356722966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 211.36363636363635, 110, 458, 118.0, 437.00000000000006, 458.0, 458.0, 0.06498647099831036, 0.02626228835087968, 0.0365664287275649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 223.4545454545455, 108, 1297, 115.0, 1065.6000000000008, 1297.0, 1297.0, 0.0649880067587527, 5.3319532459293875, 0.037698121108104596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d52534fa-3d46-47ee-a9e7-bf35f7a20091", 2, 0, 0.0, 1066.5, 211, 1922, 1066.5, 1922.0, 1922.0, 1922.0, 0.015331309600466072, 0.025931472878913318, 0.009529666563180326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 212.18181818181816, 108, 754, 113.0, 671.8000000000003, 754.0, 754.0, 0.06498877466619402, 1.753092967180669, 0.03776203215467329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 225.5, 111, 349, 221.5, 349.0, 349.0, 349.0, 0.06273197762559465, 0.046620151340896025, 0.035225475717497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 157.79999999999998, 108, 342, 115.0, 341.5, 342.0, 342.0, 0.09368515230863636, 0.025251076208187145, 0.055076622743944426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 999.5000000000001, 110, 1587, 1270.5, 1531.0, 1587.0, 1587.0, 0.08570449091532396, 55.09020828104339, 0.04512398838091973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 135.65, 110, 338, 115.0, 307.00000000000045, 337.5, 338.0, 0.0937848762508558, 0.025277954926988474, 0.055226836307876996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 655.8571428571429, 111, 1036, 826.0, 1026.0, 1036.0, 1036.0, 0.08570606492846604, 18.006906416629427, 0.045208514438411014], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 873.6666666666667, 122, 2157, 487.5, 2064.6000000000004, 2157.0, 2157.0, 0.08818082948766938, 0.01761033167014491, 0.05974882701125775], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9ef90c10-65fb-425b-828c-af8b5abe41f9", 3, 0, 0.0, 685.3333333333333, 264, 1467, 325.0, 1467.0, 1467.0, 1467.0, 0.019410565817993598, 0.026759031978907184, 0.012447530814273236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 413.3636363636364, 226, 1406, 237.0, 1240.4000000000005, 1406.0, 1406.0, 0.06494196549810487, 7.154512894670035, 0.1445454560549527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ba07336-de04-48e8-bf13-0ca4f92941a6", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.1283955388692581, 2.1084087897526502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 701.5714285714286, 125, 1256, 729.0, 1076.2, 1238.8999999999996, 1256.0, 0.08937006868728135, 0.054896262894824195, 0.04040853691622194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 131.07142857142856, 108, 345, 115.5, 234.0, 345.0, 345.0, 0.0857029169599951, 0.06369132793609011, 0.04301884698968504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 219.14285714285714, 110, 462, 117.0, 403.5, 462.0, 462.0, 0.08570658961236134, 0.11488126576389059, 0.04373810055831721], "isController": false}, {"data": ["login", 21, 0, 0.0, 3296.190476190476, 1726, 4743, 3496.0, 4646.8, 4739.9, 4743.0, 0.08756494400013344, 30.049972609894006, 0.1736028765605324], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 134.2, 114, 350, 119.0, 158.60000000000002, 340.4499999999999, 350.0, 0.09399202947590045, 0.07609315667531394, 0.033411229227761484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1131.7142857142858, 223, 1704, 1383.5, 1648.0, 1704.0, 1704.0, 0.08564314946564792, 73.22290942778142, 0.1769615913414776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 435.28571428571433, 226, 1315, 446.5, 994.0, 1315.0, 1315.0, 0.0843388735941011, 7.328416279736983, 0.18813875401362673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 899.9000000000001, 108, 1607, 1229.0, 1604.3, 1607.0, 1607.0, 0.09961250734642242, 71.51337546942395, 0.1611699239956569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7db3bed-45e9-4457-9a2c-cba402013550", 1, 0, 0.0, 2157.0, 2157, 2157, 2157.0, 2157.0, 2157.0, 2157.0, 0.46360686138154844, 0.0837570989800649, 0.3196351993509504], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1002.4090909090908, 120, 1679, 979.5, 1636.0, 1672.55, 1679.0, 0.09246611327098876, 0.028944914363770093, 0.041718109698434376], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 136.64705882352942, 114, 343, 122.0, 190.19999999999987, 343.0, 343.0, 0.07845164148522801, 0.0609072802546448, 0.027887106934202148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 310.45000000000005, 222, 461, 239.5, 458.6, 460.9, 461.0, 0.09363515063554859, 0.1451161953697418, 0.2105876483531918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dad11315-8821-4a34-be9f-9ffdeed55de9", 3, 0, 0.0, 922.0, 328, 1723, 715.0, 1723.0, 1723.0, 1723.0, 0.01943836095740407, 0.022975484582140035, 0.01246535517125196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 372.62499999999994, 227, 1361, 232.0, 732.4000000000007, 1361.0, 1361.0, 0.09321945023829223, 7.105621870229785, 0.20816203652454585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a8923da-4625-4e8e-b711-28502d378daf", 3, 0, 0.0, 1043.3333333333333, 545, 1675, 910.0, 1675.0, 1675.0, 1675.0, 0.03244155113869844, 0.027045186349676665, 0.02080398949975128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6f8aa22-8957-43b3-8ee6-2212217057c6", 3, 0, 0.0, 962.0, 337, 1973, 576.0, 1973.0, 1973.0, 1973.0, 0.04878604068755794, 0.031364723423804336, 0.0312853190607061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 134.07692307692307, 110, 350, 117.0, 261.19999999999993, 350.0, 350.0, 0.07042444269888135, 0.05233691493539912, 0.03534976908908692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 148.84615384615384, 108, 342, 115.0, 340.8, 342.0, 342.0, 0.07042482420880418, 0.026980664322784058, 0.03970918949153277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dce267b8-7204-4d14-9937-126466c9c9b3", 3, 0, 0.0, 829.0, 201, 1320, 966.0, 1320.0, 1320.0, 1320.0, 0.018234200065643122, 0.02155220717394211, 0.011693155641053693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 219.76923076923077, 110, 1252, 116.0, 887.5999999999997, 1252.0, 1252.0, 0.06999445428554506, 4.862117024333841, 0.04068637975221963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0c1e0ee-b94c-4a7b-b7a1-ec0a344cdfc4", 3, 0, 0.0, 409.3333333333333, 282, 501, 445.0, 501.0, 501.0, 501.0, 0.01753493836469165, 0.024173328116689173, 0.011244735865378434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 209.38461538461542, 107, 889, 116.0, 671.3999999999999, 889.0, 889.0, 0.07013152358037612, 1.6036790896119029, 0.04083454321450535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 131.5, 122, 141, 131.5, 141.0, 141.0, 141.0, 0.07482229704451927, 0.02206673213617658, 0.04625245510662177], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1266.4821428571427, 868, 2181, 1199.0, 1746.8, 1959.3, 2181.0, 0.2472908405239033, 295.8458174728642, 0.4883028120501294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1002.4090909090908, 120, 1679, 979.5, 1636.0, 1672.55, 1679.0, 0.09058940762762813, 0.028357444184571798, 0.04087139289449628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 117.33333333333334, 109, 146, 114.0, 146.0, 146.0, 146.0, 0.0393718010411654, 0.010611930749376613, 0.023184761745920643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 119.55555555555556, 109, 156, 116.0, 156.0, 156.0, 156.0, 0.0393714565689088, 0.0106118379033387, 0.023146110209456148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4e05721-d26c-4ae8-9749-9e64d9f1df65", 1, 0, 0.0, 889.0, 889, 889, 889.0, 889.0, 889.0, 889.0, 1.124859392575928, 0.2032216676040495, 0.7755378233970753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 138.7058823529412, 110, 329, 113.0, 328.2, 329.0, 329.0, 0.0798129559901971, 0.02151208579423281, 0.04692128858017446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 167.58823529411765, 109, 350, 115.0, 346.0, 350.0, 350.0, 0.07981408014272635, 0.021512388788469214, 0.046999892896546866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 144.55555555555554, 108, 380, 115.0, 380.0, 380.0, 380.0, 0.03937128433504088, 0.010534894441212111, 0.022453935597328004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 130.76470588235293, 112, 342, 116.0, 172.39999999999986, 342.0, 342.0, 0.07981258127972432, 0.059313842142451376, 0.040062174587674124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 118.33333333333333, 110, 132, 119.0, 132.0, 132.0, 132.0, 0.039370939871825716, 0.02925906761958923, 0.01976236630285002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 113.6470588235294, 109, 119, 114.0, 117.4, 119.0, 119.0, 0.07981183186933394, 0.021355900324411623, 0.04551768536297952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 169.1111111111111, 115, 349, 120.0, 349.0, 349.0, 349.0, 0.04021573507661098, 0.03165418210131684, 0.014295437078014056], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 767.2500000000001, 108, 2337, 643.5, 2076.000000000001, 2337.0, 2337.0, 0.09073998457420261, 0.017707884359451323, 0.06174867765376646], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1501.619047619048, 880, 2263, 1457.0, 2228.2000000000003, 2262.2, 2263.0, 0.08874689385871494, 0.045933450922967696, 0.04082010449946752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 269.1111111111111, 226, 513, 235.0, 513.0, 513.0, 513.0, 0.039350971313141914, 0.06098631979878536, 0.0885012567716463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d2951a1-4092-4789-8b19-1ca2d3439185", 1, 0, 0.0, 1849.0, 1849, 1849, 1849.0, 1849.0, 1849.0, 1849.0, 0.5408328826392645, 0.09770906571119524, 0.37287892103839915], "isController": false}, {"data": ["addBook", 58, 11, 18.96551724137931, 1350.1379310344832, 582, 4069, 983.0, 2372.1, 2732.8499999999967, 4069.0, 0.26177065280184864, 76.63170579263476, 0.9521537265083405], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 197.0178571428572, 111, 472, 118.0, 444.1, 461.15, 472.0, 0.24829518750720503, 0.1845240602470537, 0.12002550567975241], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e52ef9f1-02e0-4f8c-aa7e-6ed28ce09889", 2, 0, 0.0, 271.5, 254, 289, 271.5, 289.0, 289.0, 289.0, 0.03276808388629475, 0.027616070697140987, 0.020368052142213485], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 727.9464285714287, 536, 1145, 676.5, 941.1000000000003, 994.2499999999999, 1145.0, 0.24825886306307104, 72.99634871060553, 0.12485675241941561], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 195.12500000000003, 109, 420, 120.0, 348.6, 354.9, 420.0, 0.24872086412734512, 0.4401193416003411, 0.1209599514994315], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1065.3035714285716, 750, 1718, 1020.5, 1371.0000000000005, 1488.05, 1718.0, 0.24784244301836691, 223.0090658884709, 0.1244052887807037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 134.625, 115, 359, 118.5, 197.30000000000018, 359.0, 359.0, 0.09794739000814187, 0.07317358726194192, 0.03481723629195668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 11, 6.395348837209302, 250.43604651162772, 110, 2462, 124.0, 449.70000000000005, 769.6999999999994, 2138.6100000000047, 0.7052157263106967, 1.5447855229359115, 0.33788917555361486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 135.92307692307693, 116, 351, 118.0, 259.79999999999995, 351.0, 351.0, 0.07489859882005899, 0.05800252818779959, 0.026624111299317844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ef90c10-65fb-425b-828c-af8b5abe41f9", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 122.78571428571428, 116, 139, 119.0, 135.5, 139.0, 139.0, 0.0874344241818636, 0.07095508446789907, 0.031080205470896828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5c28fd1-7863-4075-b13a-39a83c9ea71a", 3, 0, 0.0, 1087.6666666666665, 313, 2337, 613.0, 2337.0, 2337.0, 2337.0, 0.07546600256584408, 0.034146400900560966, 0.04839453940583101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 408.15384615384613, 227, 1369, 239.0, 1098.1999999999998, 1369.0, 1369.0, 0.06995001264480999, 6.537341536317508, 0.15594249739032645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 313.05882352941177, 225, 671, 238.0, 510.9999999999999, 671.0, 671.0, 0.07976913872791686, 0.12362658511836332, 0.17940266258827392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7db3bed-45e9-4457-9a2c-cba402013550", 3, 0, 0.0, 879.3333333333334, 332, 1513, 793.0, 1513.0, 1513.0, 1513.0, 0.06167002425687621, 0.02790407998602146, 0.03954750904493689], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 142.0909090909091, 116, 353, 122.0, 308.00000000000017, 353.0, 353.0, 0.06762322796404903, 0.056066523966286745, 0.024037944315345554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c9478a0-cbae-4d20-a9c0-48b8c61a0c63", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.698765727571116, 1.3056448304157549], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 136.78571428571428, 112, 341, 119.5, 238.0, 341.0, 341.0, 0.08912599232243237, 0.06919449599251343, 0.03168150508336463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a8923da-4625-4e8e-b711-28502d378daf", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dad11315-8821-4a34-be9f-9ffdeed55de9", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6f8aa22-8957-43b3-8ee6-2212217057c6", 1, 0, 0.0, 1413.0, 1413, 1413, 1413.0, 1413.0, 1413.0, 1413.0, 0.7077140835102619, 0.12785850141542818, 0.487935686482661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 114.0, 109, 118, 114.5, 117.3, 118.0, 118.0, 0.09328249437389956, 0.06932419747904059, 0.046823439558773806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 168.68749999999997, 107, 345, 114.0, 342.2, 345.0, 345.0, 0.09328086284798134, 0.033716386095321384, 0.05270960865763008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 241.6875, 113, 1252, 116.0, 615.7000000000007, 1252.0, 1252.0, 0.0932819505255855, 5.269524941625905, 0.05433855809424975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 187.375, 110, 640, 113.5, 432.8000000000002, 640.0, 640.0, 0.0932819505255855, 1.7378204198562293, 0.05442965374905989], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 26.923076923076923, 0.5401234567901234], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.6923076923076925, 0.15432098765432098], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.15432098765432098], "isController": false}, {"data": ["401/Unauthorized", 15, 57.69230769230769, 1.1574074074074074], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 26, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
