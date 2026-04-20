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

    var data = {"OkPercent": 97.60802469135803, "KoPercent": 2.3919753086419755};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7481800132362674, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a5efe56f-e7bb-4560-bf30-d6af95deb18b"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/276b1a8c-120a-4590-9e4d-8f3cad2a8ca5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ebe1f0a-68d1-4304-b9fe-4b0106347ce8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/52e26a15-2d0b-4173-9748-7ffd6b7e4496"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a418822-9608-4aed-9d19-810b5b7044ee"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8000bd7-d9f0-477a-b931-1a1aad6e042c"], "isController": false}, {"data": [0.7708333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1bf4ed97-f371-454b-8dac-4ecaadf76d5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a01ff3d-8ab3-4aa7-bf5c-4005c14743f2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b8643ddf-efce-42bf-9b0b-6db18c051f42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d2475d3-e5b2-49e9-82c3-66d34c0bd5e2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c327fd3d-c5ee-467f-bac9-1bd20b70eee0"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2546b6c1-c310-4825-9e7c-9e9359da3606"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e017535f-7c67-495e-8202-d04baa2d01ae"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.32727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb11bf65-db01-41e3-90e9-52526f88a4fa"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5efe56f-e7bb-4560-bf30-d6af95deb18b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32d2733c-54e1-4ded-a5e2-9243469ab701"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a418822-9608-4aed-9d19-810b5b7044ee"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.44545454545454544, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9011976047904192, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ebe1f0a-68d1-4304-b9fe-4b0106347ce8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e017535f-7c67-495e-8202-d04baa2d01ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52e26a15-2d0b-4173-9748-7ffd6b7e4496"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8643ddf-efce-42bf-9b0b-6db18c051f42"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c327fd3d-c5ee-467f-bac9-1bd20b70eee0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb11bf65-db01-41e3-90e9-52526f88a4fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/32d2733c-54e1-4ded-a5e2-9243469ab701"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a01ff3d-8ab3-4aa7-bf5c-4005c14743f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2546b6c1-c310-4825-9e7c-9e9359da3606"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a8000bd7-d9f0-477a-b931-1a1aad6e042c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 31, 2.3919753086419755, 417.93904320987696, 119, 2356, 140.5, 1131.3, 1371.0, 1762.3899999999996, 5.068915345984762, 733.2014795458902, 3.708890995097311], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2055.9090909090914, 1518, 2882, 2023.0, 2485.0, 2696.6, 2882.0, 0.25160570184266867, 302.7663484021322, 1.2371432702908562], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a5efe56f-e7bb-4560-bf30-d6af95deb18b", 3, 0, 0.0, 898.3333333333334, 219, 2012, 464.0, 2012.0, 2012.0, 2012.0, 0.060263956127839934, 0.027267870773990076, 0.03864583124083486], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 551.6428571428572, 128, 855, 566.0, 809.5, 855.0, 855.0, 0.0902224628154564, 0.017772616838089346, 0.060706325077977984], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 551.6428571428572, 128, 855, 566.0, 809.5, 855.0, 855.0, 0.09086130022520622, 0.017898459251951895, 0.06113616782731161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/276b1a8c-120a-4590-9e4d-8f3cad2a8ca5", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 174.75, 120, 390, 127.0, 381.6, 390.0, 390.0, 0.09316462771997042, 0.02492881640163271, 0.05313295174654563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 128.0, 120, 137, 128.0, 136.3, 137.0, 137.0, 0.09316028809819095, 0.06923337816672198, 0.046762097736787245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 189.43750000000003, 119, 502, 127.0, 499.9, 502.0, 502.0, 0.0931651702011203, 0.025110924780770708, 0.05486191174929253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 158.75, 125, 376, 127.5, 375.3, 376.0, 376.0, 0.0930259600569784, 0.02507340329660746, 0.05468908979912206], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 219.42857142857144, 127, 340, 219.0, 304.5, 340.0, 340.0, 0.09052875257845287, 0.15960618173970398, 0.05851279446093361], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9ebe1f0a-68d1-4304-b9fe-4b0106347ce8", 3, 0, 0.0, 338.0, 219, 441, 354.0, 441.0, 441.0, 441.0, 0.07503001200480192, 0.033949126525610246, 0.048114949104641855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52e26a15-2d0b-4173-9748-7ffd6b7e4496", 3, 0, 0.0, 457.33333333333337, 232, 889, 251.0, 889.0, 889.0, 889.0, 0.0207090788601723, 0.024477430124116413, 0.013280236118014137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 128.1875, 120, 139, 128.0, 134.8, 139.0, 139.0, 0.0839978790535539, 0.062424205038822775, 0.04216299788430342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 157.5625, 120, 379, 127.0, 376.2, 379.0, 379.0, 0.08399964300151724, 0.046132128157205333, 0.04658329811473301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 918.6666666666666, 619, 1036, 992.0, 1036.0, 1036.0, 1036.0, 0.04664928548844394, 13.71643883565975, 0.026604670630128183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1180.7777777777778, 1097, 1375, 1120.0, 1375.0, 1375.0, 1375.0, 0.04661256156742507, 41.94206483451246, 0.026538206439266424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 240.22222222222226, 125, 397, 132.0, 397.0, 397.0, 397.0, 0.04685352546749407, 0.08290877748740161, 0.025943309511786264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 145.85714285714286, 123, 376, 128.0, 255.5, 376.0, 376.0, 0.07051973041314488, 0.05240772934023755, 0.03539759905503561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 199.71428571428572, 123, 401, 127.0, 391.5, 401.0, 401.0, 0.07052115130816736, 0.03400126938072355, 0.03937299770302536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 320.00000000000006, 123, 1409, 129.0, 1358.5, 1409.0, 1409.0, 0.07052186177715092, 9.08139175209047, 0.0405933596111223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 270.5, 125, 769, 129.0, 757.0, 769.0, 769.0, 0.07052115130816736, 2.978515133083487, 0.04066181896716737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 128.1111111111111, 125, 136, 127.0, 136.0, 136.0, 136.0, 0.04685352546749407, 0.0348198563288701, 0.026309352679501064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 780.8823529411765, 124, 1530, 1072.0, 1510.8, 1530.0, 1530.0, 0.07643094464151638, 36.418769957749426, 0.04145570882957248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 336.87499999999994, 124, 1625, 127.0, 1263.8000000000004, 1625.0, 1625.0, 0.08399743807813861, 14.189840403227077, 0.0480278320261232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a418822-9608-4aed-9d19-810b5b7044ee", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 574.7058823529412, 125, 1132, 746.0, 1120.8, 1132.0, 1132.0, 0.07642991376907377, 11.907129014256428, 0.04152978827789917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 292.625, 121, 1032, 126.5, 1025.0, 1032.0, 1032.0, 0.08399920200758093, 4.649374287975514, 0.04811087107172481], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 405.4285714285714, 129, 983, 411.0, 743.5, 983.0, 983.0, 0.0911084646271386, 0.017947147328895047, 0.06188715321840651], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 504.0714285714286, 255, 1535, 261.0, 1489.5, 1535.0, 1535.0, 0.07047464674583319, 12.138215726669117, 0.15592318955666415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8000bd7-d9f0-477a-b931-1a1aad6e042c", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 459.5, 161, 873, 446.0, 792.0, 863.25, 873.0, 0.10225210255885886, 0.0628091528413303, 0.04623312840307779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 126.94117647058823, 121, 131, 127.0, 130.2, 131.0, 131.0, 0.07642991376907377, 0.05679996521314955, 0.0383642340598671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 215.64705882352942, 123, 389, 128.0, 386.6, 389.0, 389.0, 0.07643025739013151, 0.08122471057659884, 0.04019086489828032], "isController": false}, {"data": ["login", 24, 0, 0.0, 2359.458333333334, 1286, 3774, 2225.0, 3320.0, 3710.25, 3774.0, 0.10532552169047461, 47.392460482357976, 0.22440816108221973], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1bf4ed97-f371-454b-8dac-4ecaadf76d5a", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.6249235567514677, 1.167670621330724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 149.8125, 127, 378, 134.0, 216.30000000000018, 378.0, 378.0, 0.08766642923675416, 0.0709721385129582, 0.031162676017752453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a01ff3d-8ab3-4aa7-bf5c-4005c14743f2", 3, 0, 0.0, 389.0, 233, 473, 461.0, 473.0, 473.0, 473.0, 0.02524827470122875, 0.025322244256017507, 0.016191113659316615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8643ddf-efce-42bf-9b0b-6db18c051f42", 3, 0, 0.0, 498.66666666666663, 218, 910, 368.0, 910.0, 910.0, 910.0, 0.028535555301906178, 0.028619155561579727, 0.018299167950766655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d2475d3-e5b2-49e9-82c3-66d34c0bd5e2", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.6490567835365854, 1.212763592479675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c327fd3d-c5ee-467f-bac9-1bd20b70eee0", 3, 0, 0.0, 562.6666666666666, 217, 1030, 441.0, 1030.0, 1030.0, 1030.0, 0.09919650828290844, 0.04662752537777337, 0.06361234417881824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 909.2352941176474, 254, 1661, 1195.0, 1640.2, 1661.0, 1661.0, 0.07638561254521355, 48.43534112354249, 0.16144622256296196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, 30.76923076923077, 946.3846153846154, 127, 1502, 1242.0, 1477.2, 1502.0, 1502.0, 0.06728499855078465, 55.733712986781086, 0.11875458540795412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 383.00000000000006, 249, 631, 269.0, 630.3, 631.0, 631.0, 0.0929567809066772, 0.14406485478407882, 0.20906197893366954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2546b6c1-c310-4825-9e7c-9e9359da3606", 3, 0, 0.0, 335.3333333333333, 225, 425, 356.0, 425.0, 425.0, 425.0, 0.02173834281366617, 0.025693985272272745, 0.013940278431940872], "isController": false}, {"data": ["register", 24, 9, 37.5, 903.5, 158, 1684, 1014.5, 1407.0, 1647.5, 1684.0, 0.10916385039094305, 0.03395379526319859, 0.04925165906310125], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e017535f-7c67-495e-8202-d04baa2d01ae", 3, 0, 0.0, 468.33333333333337, 212, 924, 269.0, 924.0, 924.0, 924.0, 0.04402054292002935, 0.028300967534849595, 0.028229319515774027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 468.125, 248, 1754, 256.5, 1390.0000000000005, 1754.0, 1754.0, 0.08393971030307482, 18.93464994353743, 0.18475548296810815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 131.30769230769232, 127, 141, 131.0, 139.0, 141.0, 141.0, 0.07481885204859771, 0.05808690173694843, 0.026595763814149975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 409.11111111111114, 252, 767, 380.5, 761.6, 767.0, 767.0, 0.10475591870940708, 0.16235121385920803, 0.23559851639430127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 158.125, 124, 376, 128.0, 376.0, 376.0, 376.0, 0.04593108041383904, 0.0341343283153628, 0.023055249348352794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 156.875, 120, 375, 126.5, 375.0, 375.0, 375.0, 0.04593239899178384, 0.01229050519897341, 0.026195821300001722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 126.0, 124, 128, 126.0, 128.0, 128.0, 128.0, 0.04593134412337159, 0.0123799325957525, 0.027002606603779], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 130.0, 129, 131, 130.0, 131.0, 131.0, 131.0, 0.015640273704789834, 0.0046126588465298145, 0.00966825513196481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 158.625, 125, 375, 128.5, 375.0, 375.0, 375.0, 0.045932135270138376, 0.012380145834529484, 0.02704792731239594], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1416.2363636363636, 966, 2356, 1270.0, 1947.3999999999999, 2169.0, 2356.0, 0.2520935221131854, 301.59149433591693, 0.4977862321414657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb11bf65-db01-41e3-90e9-52526f88a4fa", 3, 0, 0.0, 677.6666666666666, 210, 1407, 416.0, 1407.0, 1407.0, 1407.0, 0.020093098020829845, 0.02374936162553163, 0.012885222363618097], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 903.5, 158, 1684, 1014.5, 1407.0, 1647.5, 1684.0, 0.10543472053209389, 0.032793904774874906, 0.0475691805525658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 126.11111111111111, 123, 132, 126.0, 132.0, 132.0, 132.0, 0.041487655117732745, 0.011182219543451406, 0.024430718785149266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 152.77777777777777, 126, 360, 127.0, 360.0, 360.0, 360.0, 0.04148727262669752, 0.011182116450164566, 0.024389978634054597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 259.61538461538464, 124, 383, 366.0, 380.2, 383.0, 383.0, 0.07844746433657583, 0.0211440431219677, 0.04611852883849477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 212.53846153846152, 122, 504, 129.0, 453.19999999999993, 504.0, 504.0, 0.07856883838994319, 0.021176757222289375, 0.04626661088782787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 127.55555555555554, 126, 130, 127.0, 130.0, 130.0, 130.0, 0.04148669890336826, 0.011100933105002835, 0.023660382968327207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 150.6153846153846, 125, 384, 127.0, 291.9999999999999, 384.0, 384.0, 0.07856836354186182, 0.05838918423374692, 0.03943763560597361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 127.55555555555556, 125, 130, 127.0, 130.0, 130.0, 130.0, 0.041486125195906706, 0.030830997337973634, 0.020824090186226607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 163.53846153846155, 123, 374, 126.0, 371.2, 374.0, 374.0, 0.07856836354186182, 0.021023175400849744, 0.04480851983246807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 188.88888888888889, 123, 389, 132.0, 389.0, 389.0, 389.0, 0.04210900618066635, 0.03314439353673543, 0.014968435790783743], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 638.7857142857142, 130, 2012, 465.5, 1468.0, 2012.0, 2012.0, 0.09373577224885508, 0.01809853638287046, 0.06378949456332521], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1124.4583333333335, 743, 1614, 1100.5, 1561.5, 1610.75, 1614.0, 0.10467322328106941, 0.05417657064352226, 0.048145593911507516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5efe56f-e7bb-4560-bf30-d6af95deb18b", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 0.6251351643598616, 2.3856509515570936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32d2733c-54e1-4ded-a5e2-9243469ab701", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 282.3333333333333, 255, 486, 256.0, 486.0, 486.0, 486.0, 0.04146147077657335, 0.06425718176017764, 0.0932478195297348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a418822-9608-4aed-9d19-810b5b7044ee", 3, 0, 0.0, 344.3333333333333, 205, 586, 242.0, 586.0, 586.0, 586.0, 0.034239539820584815, 0.028544095534022693, 0.02195699656463284], "isController": false}, {"data": ["addBook", 56, 14, 25.0, 1229.6071428571427, 639, 3606, 974.5, 2224.7, 3045.3999999999996, 3606.0, 0.2414500801959195, 73.18356814982408, 0.8770418161357639], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 220.83636363636364, 120, 521, 130.0, 507.0, 509.2, 521.0, 0.2532578164571534, 0.18821210773817748, 0.12242443276004973], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 807.0909090909091, 622, 1147, 750.0, 1009.4, 1080.1999999999998, 1147.0, 0.25300966496920185, 74.39324221247752, 0.12724607173744037], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 206.85454545454547, 121, 429, 130.0, 382.4, 384.0, 429.0, 0.2537204646313672, 0.44896629092972407, 0.12339139783830164], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1193.9272727272728, 835, 1847, 1125.0, 1519.8, 1649.3999999999999, 1847.0, 0.25271670457417234, 227.39493500442256, 0.12685193960070762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 132.5, 127, 148, 131.0, 145.3, 148.0, 148.0, 0.10215606040828372, 0.0763177599729854, 0.036313287098257103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 14, 8.383233532934131, 195.46107784431146, 122, 1811, 132.0, 319.6, 366.9999999999999, 1548.5199999999973, 0.7011533342570084, 1.5586688477993442, 0.33474200338820803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 166.0, 130, 382, 131.5, 382.0, 382.0, 382.0, 0.048142888091856635, 0.03728252954769757, 0.01711329225140216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ebe1f0a-68d1-4304-b9fe-4b0106347ce8", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e017535f-7c67-495e-8202-d04baa2d01ae", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 165.0, 126, 388, 135.5, 385.2, 388.0, 388.0, 0.09479515359777231, 0.07692848890600468, 0.03369671475545813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52e26a15-2d0b-4173-9748-7ffd6b7e4496", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8643ddf-efce-42bf-9b0b-6db18c051f42", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 318.125, 253, 752, 256.5, 752.0, 752.0, 752.0, 0.045897350575438034, 0.0711319290656447, 0.10322421716331426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 441.2307692307692, 253, 759, 503.0, 707.4, 759.0, 759.0, 0.07838644517471133, 0.12148368016822937, 0.17629295238023457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c327fd3d-c5ee-467f-bac9-1bd20b70eee0", 1, 0, 0.0, 983.0, 983, 983, 983.0, 983.0, 983.0, 983.0, 1.0172939979654119, 0.18378846642929808, 0.701376525940997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 153.21428571428572, 129, 377, 133.5, 265.5, 377.0, 377.0, 0.07051546807160342, 0.058464484758585254, 0.02506604529107778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb11bf65-db01-41e3-90e9-52526f88a4fa", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32d2733c-54e1-4ded-a5e2-9243469ab701", 3, 0, 0.0, 346.0, 228, 470, 340.0, 470.0, 470.0, 470.0, 0.027654612328426177, 0.027735631700482113, 0.017734240327799338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a01ff3d-8ab3-4aa7-bf5c-4005c14743f2", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 163.41176470588235, 124, 383, 133.0, 381.4, 383.0, 383.0, 0.07438067152620387, 0.057746712757160236, 0.026440004331580284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2546b6c1-c310-4825-9e7c-9e9359da3606", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 157.0, 125, 393, 128.0, 384.90000000000003, 393.0, 393.0, 0.10498442730994902, 0.07802065349889765, 0.052697261364564256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 167.5, 121, 379, 127.0, 376.3, 379.0, 379.0, 0.10498381499518825, 0.028091372371759352, 0.059873581989443286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 222.4444444444444, 124, 378, 129.0, 377.1, 378.0, 378.0, 0.10483706572701593, 0.028256865371734764, 0.06163272809342148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8000bd7-d9f0-477a-b931-1a1aad6e042c", 3, 0, 0.0, 382.0, 210, 707, 229.0, 707.0, 707.0, 707.0, 0.04396828421098914, 0.028267370220281106, 0.028195807257698116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 194.38888888888889, 121, 378, 127.0, 377.1, 378.0, 378.0, 0.1048346233816155, 0.028256207083326053, 0.061733669823353654], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 29.032258064516128, 0.6944444444444444], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.451612903225806, 0.15432098765432098], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.15432098765432098], "isController": false}, {"data": ["401/Unauthorized", 18, 58.064516129032256, 1.3888888888888888], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 31, "401/Unauthorized", 18, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
