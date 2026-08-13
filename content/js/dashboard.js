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

    var data = {"OkPercent": 97.45830023828435, "KoPercent": 2.5416997617156474};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7406779661016949, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0625, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97b93fc2-c705-4dd2-b90a-b41002bf506f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/caf1c1cd-f3df-442c-accf-d90451204535"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87be0ce1-4285-40ae-b905-f95abb87ecb2"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33cf870b-5896-4b00-809c-61129a181365"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a19dc0f-e7bf-419d-95c3-738554c2f304"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab820fad-c0b1-4616-b76b-896a93c3d0d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a2e0d26-b0ec-4e9f-92c9-10985cdc4943"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e448a98b-60a2-4d14-a65f-d1ef3dfc015c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8237c2b4-3d72-4685-83c5-09bfca2c5f50"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1402161d-0447-45d7-93a3-7bef0cd2126a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ad2ac78-4bda-4ad4-b0df-9ec7e6ff0dd5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7486ab57-95a4-462f-9fc7-6c9f0c2bb30d"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.15384615384615385, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7bbe23aa-5a60-4fb9-9ed8-ba4b5dee898f"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1402161d-0447-45d7-93a3-7bef0cd2126a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.17391304347826086, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4a19dc0f-e7bf-419d-95c3-738554c2f304"], "isController": false}, {"data": [0.22549019607843138, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/97b93fc2-c705-4dd2-b90a-b41002bf506f"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87be0ce1-4285-40ae-b905-f95abb87ecb2"], "isController": false}, {"data": [0.8987341772151899, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/33cf870b-5896-4b00-809c-61129a181365"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90870299-05d4-4d78-aa00-07905f130464"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8237c2b4-3d72-4685-83c5-09bfca2c5f50"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab820fad-c0b1-4616-b76b-896a93c3d0d5"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4ad2ac78-4bda-4ad4-b0df-9ec7e6ff0dd5"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a2e0d26-b0ec-4e9f-92c9-10985cdc4943"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7486ab57-95a4-462f-9fc7-6c9f0c2bb30d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1c86fd0-b22f-4451-ae2c-7954fa1d2eb8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=caf1c1cd-f3df-442c-accf-d90451204535"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f693866-a6ba-4531-9bb2-11035acfe477"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7bbe23aa-5a60-4fb9-9ed8-ba4b5dee898f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de157145-5461-478d-bb31-74bb149be6a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1259, 32, 2.5416997617156474, 418.3629864972198, 101, 3468, 128.0, 1137.0, 1463.0, 2181.0000000000023, 4.989557201567807, 733.3804022471337, 3.637145450150004], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1804.0178571428564, 1338, 2493, 1760.0, 2241.9, 2341.6499999999996, 2493.0, 0.24068009317757894, 289.62055849869347, 1.1834221378409275], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97b93fc2-c705-4dd2-b90a-b41002bf506f", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/caf1c1cd-f3df-442c-accf-d90451204535", 3, 0, 0.0, 307.3333333333333, 201, 447, 274.0, 447.0, 447.0, 447.0, 0.08431466231977741, 0.037326803631151456, 0.0540689729068885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87be0ce1-4285-40ae-b905-f95abb87ecb2", 1, 0, 0.0, 900.0, 900, 900, 900.0, 900.0, 900.0, 900.0, 1.1111111111111112, 0.2007378472222222, 0.7660590277777778], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 575.4375, 110, 1497, 534.5, 1128.1000000000004, 1497.0, 1497.0, 0.09191968517507829, 0.019232219285898945, 0.06137703587740212], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 575.4375, 110, 1497, 534.5, 1128.1000000000004, 1497.0, 1497.0, 0.09135131431703473, 0.01911329989494599, 0.06099752066823486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 147.0, 103, 353, 113.0, 339.0, 353.0, 353.0, 0.09542032653840166, 0.04061837707601987, 0.053575845348761295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 114.36842105263156, 106, 128, 115.0, 122.0, 128.0, 128.0, 0.09541601382025633, 0.07090975245821783, 0.04789436631212085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 200.89473684210526, 106, 863, 113.0, 844.0, 863.0, 863.0, 0.09542080575337236, 2.976367970248797, 0.05532699988197953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 238.15789473684214, 102, 1242, 114.0, 945.0, 1242.0, 1242.0, 0.09541840972665137, 9.060658722874807, 0.0552324285742983], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 196.18750000000003, 109, 274, 211.0, 264.2, 274.0, 274.0, 0.09175732481519501, 0.12900573590808212, 0.059297275094194635], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33cf870b-5896-4b00-809c-61129a181365", 1, 0, 0.0, 790.0, 790, 790, 790.0, 790.0, 790.0, 790.0, 1.2658227848101267, 0.22868868670886075, 0.8727254746835442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 112.17647058823528, 104, 123, 113.0, 119.8, 123.0, 123.0, 0.09563563946489047, 0.07107297034451332, 0.04800460809077509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 848.6666666666667, 663, 977, 887.0, 977.0, 977.0, 977.0, 0.02864850669658844, 8.423612188745912, 0.016338601475398094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 123.94117647058823, 102, 339, 111.0, 159.79999999999984, 339.0, 339.0, 0.09564101987082836, 0.034041346456781515, 0.05407277789342215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1166.3333333333335, 954, 1353, 1228.5, 1353.0, 1353.0, 1353.0, 0.028603028107242287, 25.737054969656953, 0.01628473182277564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 218.83333333333334, 103, 340, 211.0, 340.0, 340.0, 340.0, 0.028757806546235363, 0.05088783736501804, 0.01592351202315962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 115.0, 105, 124, 115.5, 123.0, 124.0, 124.0, 0.08777154321181155, 0.06522865662518416, 0.04405720040124134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 130.2142857142857, 104, 342, 113.0, 237.5, 342.0, 342.0, 0.08777484498335412, 0.023486628442811554, 0.05005909127956915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 130.0714285714286, 102, 345, 112.0, 240.0, 345.0, 345.0, 0.08764516230005948, 0.0236231101511879, 0.0515257692428084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 151.5, 105, 447, 115.0, 384.0, 447.0, 447.0, 0.08777594562907139, 0.023658360345335645, 0.05168837423274419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 196.5, 106, 397, 119.0, 397.0, 397.0, 397.0, 0.02875449888097075, 0.02136931020353393, 0.0161463250552326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 931.0, 106, 1494, 1228.0, 1455.6, 1494.0, 1494.0, 0.14070939181071337, 87.66513270316271, 0.07435019996969336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 224.0, 106, 1330, 114.0, 537.9999999999993, 1330.0, 1330.0, 0.09563886763580719, 5.086380225327985, 0.055741725128268596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 633.8461538461539, 108, 1024, 858.0, 979.5999999999999, 1024.0, 1024.0, 0.14070786881697153, 28.65436684841433, 0.07448680525489772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 184.35294117647055, 105, 895, 115.0, 443.7999999999996, 895.0, 895.0, 0.09564155794471918, 1.678485167822804, 0.055836693094679514], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 462.26666666666665, 116, 1058, 473.0, 963.2, 1058.0, 1058.0, 0.09490787608827697, 0.019315235719528246, 0.06408135305413545], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 289.6428571428571, 217, 564, 234.5, 513.0, 564.0, 564.0, 0.0875815603280555, 0.13573431273498446, 0.19697298187061701], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a19dc0f-e7bf-419d-95c3-738554c2f304", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 705.6956521739129, 177, 2207, 591.0, 1351.8000000000006, 2071.7999999999984, 2207.0, 0.10286179399913238, 0.06318366057173269, 0.04650879943515458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 114.76923076923077, 104, 135, 114.0, 129.0, 135.0, 135.0, 0.140697208783835, 0.10456110926220548, 0.0706234036278234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 157.3076923076923, 103, 455, 115.0, 414.59999999999997, 455.0, 455.0, 0.140697208783835, 0.18394638083487558, 0.07206081501563903], "isController": false}, {"data": ["login", 23, 0, 0.0, 3119.304347826087, 1712, 5816, 3030.0, 4452.8, 5573.599999999997, 5816.0, 0.1025512979427318, 32.14558215696591, 0.19908937652154915], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab820fad-c0b1-4616-b76b-896a93c3d0d5", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 119.76470588235294, 110, 134, 118.0, 129.2, 134.0, 134.0, 0.09458948164964057, 0.07657683621831253, 0.03362360480514567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a2e0d26-b0ec-4e9f-92c9-10985cdc4943", 3, 0, 0.0, 348.6666666666667, 237, 446, 363.0, 446.0, 446.0, 446.0, 0.030270008475602374, 0.02523486058138596, 0.01941143121645074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e448a98b-60a2-4d14-a65f-d1ef3dfc015c", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 1.064453125, 1.9889322916666667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8237c2b4-3d72-4685-83c5-09bfca2c5f50", 3, 0, 0.0, 822.3333333333334, 222, 1864, 381.0, 1864.0, 1864.0, 1864.0, 0.04279051191715757, 0.027120158431870375, 0.027440530103125135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1048.3846153846152, 224, 1609, 1343.0, 1569.3999999999999, 1609.0, 1609.0, 0.14052079167252168, 116.45204592868029, 0.2911436264362846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1402161d-0447-45d7-93a3-7bef0cd2126a", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ad2ac78-4bda-4ad4-b0df-9ec7e6ff0dd5", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7486ab57-95a4-462f-9fc7-6c9f0c2bb30d", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 366.6842105263159, 219, 1359, 234.0, 1061.0, 1359.0, 1359.0, 0.09536141978096987, 12.141225204462414, 0.2119017404086488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 7, 53.84615384615385, 692.9999999999999, 109, 1627, 145.0, 1599.0, 1627.0, 1627.0, 0.06102742008928781, 33.70572101256226, 0.08520550103511892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7bbe23aa-5a60-4fb9-9ed8-ba4b5dee898f", 1, 0, 0.0, 1058.0, 1058, 1058, 1058.0, 1058.0, 1058.0, 1058.0, 0.945179584120983, 0.17075998345935728, 0.651657017958412], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1356.541666666667, 241, 3200, 1261.5, 2430.5, 3060.25, 3200.0, 0.09783818379718144, 0.030717750088665854, 0.04414183683036897], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 10, 0, 0.0, 117.3, 110, 136, 115.5, 135.0, 136.0, 136.0, 0.047610659074353565, 0.03696335348057723, 0.016924101467836617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 377.2352941176471, 220, 1445, 233.0, 652.9999999999993, 1445.0, 1445.0, 0.09557434559683368, 6.8652993796100565, 0.2135104966633309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 540.4210526315788, 222, 1463, 433.0, 1450.0, 1463.0, 1463.0, 0.0983055232182124, 18.697916666666668, 0.21711999579614538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 155.0, 109, 320, 115.0, 320.0, 320.0, 320.0, 0.025509813625301653, 0.01895797672739703, 0.012804730667387744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 156.4, 103, 340, 114.0, 340.0, 340.0, 340.0, 0.02551085486874665, 0.00682614671292635, 0.014549159417332074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 112.8, 109, 118, 112.0, 118.0, 118.0, 118.0, 0.02550968347584743, 0.006875656874349503, 0.01499690376216812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 155.0, 108, 319, 115.0, 319.0, 319.0, 319.0, 0.025509423180923033, 0.006875586716733161, 0.01502166228329745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 118.33333333333333, 116, 122, 117.0, 122.0, 122.0, 122.0, 0.026762774764487584, 0.00789292771374536, 0.016543785572188125], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1248.8749999999998, 849, 2028, 1159.0, 1769.8000000000002, 1870.35, 2028.0, 0.25259017694844005, 302.185666184039, 0.49876693143529854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1356.541666666667, 241, 3200, 1261.5, 2430.5, 3060.25, 3200.0, 0.1008475395301345, 0.03166258199115063, 0.045499573498947406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 134.70000000000002, 108, 331, 111.5, 310.4000000000001, 331.0, 331.0, 0.05352115691332784, 0.014425624324295392, 0.031516853143297545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 155.9, 107, 340, 114.5, 338.6, 340.0, 340.0, 0.05345535408826548, 0.014407888406602806, 0.0314259015245467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 10, 0, 0.0, 175.20000000000002, 101, 342, 109.5, 341.5, 342.0, 342.0, 0.04908264535825423, 0.01322930675671696, 0.028855227056317427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 10, 0, 0.0, 188.7, 107, 435, 112.0, 425.90000000000003, 435.0, 435.0, 0.04908216354176892, 0.013229176892117405, 0.0289028756012565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 10, 0, 0.0, 113.50000000000001, 104, 126, 113.0, 125.5, 126.0, 126.0, 0.04907999548464041, 0.03647448883184703, 0.024635857108501146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 113.5, 107, 121, 113.0, 120.5, 121.0, 121.0, 0.0535202975728545, 0.014320860873986459, 0.030523294709518586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1402161d-0447-45d7-93a3-7bef0cd2126a", 3, 0, 0.0, 389.0, 225, 583, 359.0, 583.0, 583.0, 583.0, 0.05657068507099621, 0.02559676179970206, 0.036277424996700045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 10, 0, 0.0, 155.8, 108, 341, 113.5, 339.2, 341.0, 341.0, 0.049081681734742956, 0.01313318437042927, 0.027991896614345594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 114.4, 109, 117, 115.0, 116.9, 117.0, 117.0, 0.05352115691332784, 0.039775000401408675, 0.02686511196626026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 119.4, 112, 132, 118.5, 131.0, 132.0, 132.0, 0.051292309744000085, 0.04037265786490631, 0.018232813229312528], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 909.5333333333334, 115, 3120, 516.0, 2565.6000000000004, 3120.0, 3120.0, 0.09433784268221354, 0.018683314937454013, 0.0641939538876625], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1781.0869565217388, 1137, 3468, 1630.0, 2860.8000000000006, 3373.9999999999986, 3468.0, 0.10336846363003079, 0.05350125558976203, 0.04754545543920361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 274.7, 221, 452, 231.5, 451.5, 452.0, 452.0, 0.05342394033614343, 0.08279667315767543, 0.12015169393958822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a19dc0f-e7bf-419d-95c3-738554c2f304", 3, 0, 0.0, 1226.0, 213, 3120, 345.0, 3120.0, 3120.0, 3120.0, 0.04283572499464553, 0.02753924377097166, 0.027469524166488186], "isController": false}, {"data": ["addBook", 51, 11, 21.568627450980394, 1294.3137254901962, 581, 4071, 970.0, 2118.0000000000005, 2898.3999999999996, 4071.0, 0.25012751598854316, 89.03658298838624, 0.9055867099526229], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/97b93fc2-c705-4dd2-b90a-b41002bf506f", 3, 0, 0.0, 444.6666666666667, 208, 610, 516.0, 610.0, 610.0, 610.0, 0.04429482636428066, 0.028477305361150486, 0.028405210917198206], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 200.50000000000003, 107, 501, 116.5, 459.3, 464.54999999999995, 501.0, 0.25360481124556195, 0.1884699817947975, 0.12259216949858706], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 709.8928571428572, 505, 1026, 673.0, 905.7, 974.05, 1026.0, 0.2531576901169046, 74.43676652079962, 0.12732051797871669], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 185.41071428571425, 107, 362, 117.0, 341.0, 345.6, 362.0, 0.2540442944373372, 0.44953931789106943, 0.12354888538065815], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1046.2142857142853, 740, 1573, 1002.0, 1363.4, 1475.5, 1573.0, 0.2532000415971497, 227.8298425073134, 0.12709455212981927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 132.94736842105266, 104, 321, 119.0, 167.0, 321.0, 321.0, 0.10108910206274972, 0.07552066706836283, 0.03593401674886807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87be0ce1-4285-40ae-b905-f95abb87ecb2", 3, 0, 0.0, 300.3333333333333, 213, 458, 230.0, 458.0, 458.0, 458.0, 0.03692307692307692, 0.03078125, 0.023677884615384615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 158, 11, 6.962025316455696, 212.6518987341771, 104, 2400, 119.0, 340.2, 430.7499999999977, 2368.73, 0.6816661992795047, 1.6115293065232867, 0.3217471875876351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 164.8, 116, 346, 120.0, 346.0, 346.0, 346.0, 0.024966669496222543, 0.01933453995166453, 0.008874870797485357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33cf870b-5896-4b00-809c-61129a181365", 3, 0, 0.0, 874.0, 206, 2196, 220.0, 2196.0, 2196.0, 2196.0, 0.021168053174149572, 0.025019922225044625, 0.013574565349308156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90870299-05d4-4d78-aa00-07905f130464", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 122.31578947368422, 112, 147, 119.0, 136.0, 147.0, 147.0, 0.09452783347180832, 0.07671155235846945, 0.033601690804431865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8237c2b4-3d72-4685-83c5-09bfca2c5f50", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.28053425854037267, 1.0705793866459627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab820fad-c0b1-4616-b76b-896a93c3d0d5", 3, 0, 0.0, 389.33333333333337, 209, 654, 305.0, 654.0, 654.0, 654.0, 0.06448977837012833, 0.02917994529117135, 0.04135574980115652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 316.0, 229, 661, 230.0, 661.0, 661.0, 661.0, 0.025494985136423665, 0.039512247472172225, 0.05733881911053096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ad2ac78-4bda-4ad4-b0df-9ec7e6ff0dd5", 3, 0, 0.0, 772.0, 216, 1505, 595.0, 1505.0, 1505.0, 1505.0, 0.017812294045350098, 0.024555685313169817, 0.01142259741840485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 10, 0, 0.0, 370.9, 213, 545, 444.0, 536.9000000000001, 545.0, 545.0, 0.04905230938272574, 0.07602149901404857, 0.11031979346525134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a2e0d26-b0ec-4e9f-92c9-10985cdc4943", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7486ab57-95a4-462f-9fc7-6c9f0c2bb30d", 3, 0, 0.0, 317.0, 203, 500, 248.0, 500.0, 500.0, 500.0, 0.030665126595864296, 0.0249253974967035, 0.01966481100060308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 150.92857142857142, 111, 355, 118.0, 350.0, 355.0, 355.0, 0.09364047408834311, 0.07763746337988602, 0.03328626227359071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 149.30769230769232, 105, 360, 117.0, 344.0, 360.0, 360.0, 0.12832788762425593, 0.09962956119265964, 0.04561655380393473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1c86fd0-b22f-4451-ae2c-7954fa1d2eb8", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=caf1c1cd-f3df-442c-accf-d90451204535", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f693866-a6ba-4531-9bb2-11035acfe477", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bbe23aa-5a60-4fb9-9ed8-ba4b5dee898f", 3, 0, 0.0, 824.6666666666666, 260, 1888, 326.0, 1888.0, 1888.0, 1888.0, 0.02843035983358763, 0.023701221202414684, 0.018231708617242066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de157145-5461-478d-bb31-74bb149be6a7", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 172.21052631578948, 108, 354, 114.0, 344.0, 354.0, 354.0, 0.09847416867070238, 0.07318246324062941, 0.049429416696036156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 111.73684210526315, 106, 117, 113.0, 117.0, 117.0, 117.0, 0.09847365829640571, 0.049702473502811685, 0.05485492951359196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 363.26315789473676, 106, 1173, 312.0, 1130.0, 1173.0, 1173.0, 0.09836201362572736, 13.997006551104244, 0.056491423738377754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 299.7894736842105, 104, 888, 121.0, 860.0, 888.0, 888.0, 0.09836455976682422, 4.589028258455469, 0.05658894518246626], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.875, 0.5559968228752978], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 12.5, 0.3177124702144559], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.375, 0.23828435266084194], "isController": false}, {"data": ["401/Unauthorized", 18, 56.25, 1.4297061159650517], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1259, 32, "401/Unauthorized", 18, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 158, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
