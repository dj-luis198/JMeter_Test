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

    var data = {"OkPercent": 98.69029275808937, "KoPercent": 1.3097072419106317};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.742686170212766, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/349eac0a-70fb-42b9-b13d-003050cf836b"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ce988ea-9db6-42e7-8a78-07d1dd8be72d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a429c89-8f9e-4429-b042-3ec97c1417d2"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54915edc-1eea-4b89-8a5d-2db95b5dd172"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fbf8b2db-dff2-43e0-897e-6a04041a2f5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8d4fa46-38ce-4174-a069-7fc83da71cbb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9cd8242e-99d8-4ea3-b927-0a4ef5807cd2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/620239e2-1c4e-4480-899d-98e0404b3b3d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b00514dc-55fb-45db-8c40-dca9365ac142"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5037fc7c-c1ba-43a2-9426-f2ecb000982d"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f752eb2b-db09-4804-b8b2-6f8574156e45"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/429ef3ac-aea5-4213-af69-6b257b2f6fe5"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.20909090909090908, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1576f8b1-0d78-4448-a23d-9909a13e31d7"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5037fc7c-c1ba-43a2-9426-f2ecb000982d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ce988ea-9db6-42e7-8a78-07d1dd8be72d"], "isController": false}, {"data": [0.30327868852459017, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eaae58ce-2a84-4239-9f30-6b847e67e8b2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9491525423728814, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a429c89-8f9e-4429-b042-3ec97c1417d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47517a0b-de3e-4d9c-94d2-de2f9f7c6eeb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eaae58ce-2a84-4239-9f30-6b847e67e8b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=620239e2-1c4e-4480-899d-98e0404b3b3d"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b00514dc-55fb-45db-8c40-dca9365ac142"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbf8b2db-dff2-43e0-897e-6a04041a2f5a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cd8242e-99d8-4ea3-b927-0a4ef5807cd2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8d4fa46-38ce-4174-a069-7fc83da71cbb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=429ef3ac-aea5-4213-af69-6b257b2f6fe5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f752eb2b-db09-4804-b8b2-6f8574156e45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 17, 1.3097072419106317, 470.42912172573244, 140, 3141, 153.0, 1307.0, 1620.8999999999974, 2199.4199999999996, 5.112329457730724, 710.1345791251634, 3.7423587684524375], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2394.763636363637, 1746, 3035, 2289.0, 2953.6, 2981.7999999999997, 3035.0, 0.2341322208505385, 281.73906695649396, 1.1512263007641224], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 833.0, 146, 1963, 648.0, 1772.6, 1963.0, 1963.0, 0.06930043872508515, 0.013129184680338399, 0.04684755469403856], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 833.0, 146, 1963, 648.0, 1772.6, 1963.0, 1963.0, 0.07047827642664295, 0.01335232971364134, 0.047643780766478364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 11, 0, 0.0, 193.63636363636363, 141, 426, 142.0, 425.6, 426.0, 426.0, 0.07731071175052535, 0.03124275212077339, 0.04350100240366032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 11, 0, 0.0, 170.27272727272728, 141, 423, 144.0, 370.0000000000002, 423.0, 423.0, 0.07746260668713557, 0.05756742547745134, 0.038882597497253604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 11, 0, 0.0, 308.9090909090909, 140, 842, 145.0, 758.8000000000003, 842.0, 842.0, 0.07708587366326088, 2.07941607888688, 0.044791108232070526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 11, 0, 0.0, 359.6363636363636, 141, 1687, 143.0, 1434.6000000000008, 1687.0, 1687.0, 0.07663102163084747, 6.287206592444878, 0.044451979344456445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/349eac0a-70fb-42b9-b13d-003050cf836b", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.8725025614754098, 1.6302723702185793], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 319.8461538461538, 144, 905, 256.0, 762.9999999999999, 905.0, 905.0, 0.06954623754854862, 0.15771719992135927, 0.04495533158843607], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 162.12500000000003, 141, 418, 143.0, 240.90000000000018, 418.0, 418.0, 0.08757286335896665, 0.06508100489860703, 0.0439574724282313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 213.62500000000003, 141, 429, 144.5, 426.2, 429.0, 429.0, 0.08757286335896665, 0.031653228565173365, 0.049484226622150455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1037.6, 837, 1257, 1123.0, 1257.0, 1257.0, 1257.0, 0.1542781326174828, 45.36289350566201, 0.08798674750840817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1430.6, 1262, 1552, 1530.0, 1552.0, 1552.0, 1552.0, 0.15288649706457924, 137.56753880450404, 0.08704377713735323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 313.8, 143, 434, 423.0, 434.0, 434.0, 434.0, 0.15976993129892952, 0.2827178862438089, 0.08846635844384086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 159.50000000000003, 142, 425, 143.0, 181.1000000000004, 425.0, 425.0, 0.08334182185222569, 0.06193664690385132, 0.041833687921917974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 220.2777777777778, 140, 425, 143.0, 422.3, 425.0, 425.0, 0.08334336540509506, 0.029255185230629616, 0.04714289972404086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 236.00000000000003, 141, 1539, 142.5, 540.0000000000016, 1539.0, 1539.0, 0.08334182185222569, 4.18738847967154, 0.048597976414264416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 244.11111111111111, 141, 988, 143.0, 610.0000000000006, 988.0, 988.0, 0.08334143597294182, 1.3826123575671707, 0.048679139522823975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ce988ea-9db6-42e7-8a78-07d1dd8be72d", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.24381115047233468, 0.9304360661268556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 198.4, 141, 421, 142.0, 421.0, 421.0, 421.0, 0.15836315839483103, 0.1176898081430336, 0.0889246250752225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 969.4444444444445, 141, 1968, 1262.5, 1842.9, 1968.0, 1968.0, 0.13229749296250834, 66.15002409376218, 0.07146016926729239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 238.62500000000003, 140, 1396, 143.0, 712.8000000000006, 1396.0, 1396.0, 0.08757382199526006, 4.94707107470868, 0.05101346173844983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 761.2777777777778, 144, 1276, 985.5, 1268.8, 1276.0, 1276.0, 0.13229846533780207, 21.62703799354677, 0.07158989221350032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 221.0, 141, 1118, 142.5, 630.8000000000005, 1118.0, 1118.0, 0.08757382199526006, 1.6314793510506123, 0.05109898304899208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a429c89-8f9e-4429-b042-3ec97c1417d2", 3, 0, 0.0, 402.66666666666663, 253, 691, 264.0, 691.0, 691.0, 691.0, 0.021817864467425927, 0.02188178399223284, 0.013991273763290716], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 737.1666666666666, 380, 1682, 614.0, 1507.7000000000007, 1682.0, 1682.0, 0.06792132446582708, 0.01291765423800764, 0.04642506544502618], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/54915edc-1eea-4b89-8a5d-2db95b5dd172", 2, 0, 0.0, 238.0, 234, 242, 238.0, 242.0, 242.0, 242.0, 0.039221069558566864, 0.03462485046967231, 0.02437911208401153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 452.16666666666663, 286, 1682, 289.0, 1062.800000000001, 1682.0, 1682.0, 0.08328590663649867, 5.65740035043702, 0.18612809603790434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 551.4999999999999, 211, 1343, 508.5, 908.7000000000004, 1322.1999999999998, 1343.0, 0.0927402900916274, 0.056966447722298474, 0.041932377258226065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 189.88888888888889, 141, 425, 143.0, 423.2, 425.0, 425.0, 0.13229749296250834, 0.09831874232858288, 0.06640714002219658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbf8b2db-dff2-43e0-897e-6a04041a2f5a", 3, 0, 0.0, 642.6666666666667, 245, 1427, 256.0, 1427.0, 1427.0, 1427.0, 0.028655210950111278, 0.028739161763441684, 0.018375900251210685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 252.7777777777778, 141, 429, 143.5, 428.1, 429.0, 429.0, 0.13230041013127142, 0.14579459258823702, 0.06927970695459156], "isController": false}, {"data": ["login", 20, 0, 0.0, 2573.45, 1351, 4143, 2258.0, 4087.0, 4140.7, 4143.0, 0.09458724491002388, 28.419518262727898, 0.1819234168459883], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 147.43750000000003, 143, 161, 145.5, 158.9, 161.0, 161.0, 0.08854503898748747, 0.07168343488342492, 0.03147499432758344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8d4fa46-38ce-4174-a069-7fc83da71cbb", 2, 0, 0.0, 290.0, 249, 331, 290.0, 331.0, 331.0, 331.0, 0.01634895203217474, 0.027940103570611125, 0.010162214812967989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cd8242e-99d8-4ea3-b927-0a4ef5807cd2", 3, 0, 0.0, 486.0, 234, 627, 597.0, 627.0, 627.0, 627.0, 0.020799822508181263, 0.024584686044012424, 0.01333842784541572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/620239e2-1c4e-4480-899d-98e0404b3b3d", 3, 0, 0.0, 558.6666666666666, 318, 905, 453.0, 905.0, 905.0, 905.0, 0.0401972344302712, 0.025842948567638545, 0.02577752338139136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b00514dc-55fb-45db-8c40-dca9365ac142", 3, 0, 0.0, 422.0, 256, 645, 365.0, 645.0, 645.0, 645.0, 0.03990422984836392, 0.033266514531790366, 0.025589626562915666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5037fc7c-c1ba-43a2-9426-f2ecb000982d", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1177.2777777777778, 289, 2111, 1406.0, 1986.8000000000002, 2111.0, 2111.0, 0.13215664968208984, 87.92730650063876, 0.27843811489552284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f752eb2b-db09-4804-b8b2-6f8574156e45", 1, 0, 0.0, 747.0, 747, 747, 747.0, 747.0, 747.0, 747.0, 1.3386880856760375, 0.241852827978581, 0.9229626840696118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 11, 0, 0.0, 633.909090909091, 287, 2110, 569.0, 1802.0000000000011, 2110.0, 2110.0, 0.07655315920969302, 8.433692458991864, 0.17038922714366245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1204.7142857142858, 141, 1966, 1408.0, 1966.0, 1966.0, 1966.0, 0.1083994053518335, 92.63926903958128, 0.19511288055934095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/429ef3ac-aea5-4213-af69-6b257b2f6fe5", 3, 0, 0.0, 372.0, 237, 620, 259.0, 620.0, 620.0, 620.0, 0.03705167473569805, 0.03088845670511807, 0.023760351311629284], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1169.3333333333335, 236, 2299, 1213.0, 1924.4000000000003, 2269.2, 2299.0, 0.08531279326272684, 0.02694589340775859, 0.038490732897831836], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 181.62500000000003, 143, 426, 146.0, 424.6, 426.0, 426.0, 0.0880276847068403, 0.06834180599798637, 0.03129109104813464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 455.5, 285, 1538, 291.0, 1055.0000000000005, 1538.0, 1538.0, 0.08750341810226962, 6.669919204607602, 0.1953979525567405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 468.31818181818187, 285, 1727, 290.0, 767.9999999999998, 1595.7499999999982, 1727.0, 0.12465224855658362, 6.962924764931356, 0.27889612643137607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 168.54545454545453, 142, 423, 142.0, 367.8000000000002, 423.0, 423.0, 0.07095126293248019, 0.052728428800407644, 0.0356142081516551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 193.8181818181818, 140, 426, 143.0, 425.2, 426.0, 426.0, 0.07082380967710782, 0.028621269677751665, 0.03985096819367093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 269.81818181818187, 140, 1267, 142.0, 1098.4000000000005, 1267.0, 1267.0, 0.07044102485287432, 5.779347141775371, 0.040861297619733734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 257.27272727272725, 142, 1121, 143.0, 981.0000000000005, 1121.0, 1121.0, 0.07050649300703783, 1.9019351829002524, 0.0409681282609253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.6923048708920188, 1.4510893485915493], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1658.981818181818, 1128, 2437, 1545.0, 2305.7999999999997, 2393.0, 2437.0, 0.2343437097887498, 280.356547962701, 0.4627372863211446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1169.3333333333335, 236, 2299, 1213.0, 1924.4000000000003, 2269.2, 2299.0, 0.08515400710427716, 0.02689574108315897, 0.03841909304900005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 157.5, 141, 203, 143.0, 203.0, 203.0, 203.0, 0.01997752528405544, 0.005384567361718068, 0.011764109127231864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 150.75, 142, 175, 143.0, 175.0, 175.0, 175.0, 0.01997752528405544, 0.005384567361718068, 0.011744599825196654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 195.31250000000003, 141, 430, 142.0, 426.5, 430.0, 430.0, 0.08921253213045104, 0.024045565300785627, 0.052447211272003434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 177.8125, 142, 423, 143.0, 423.0, 423.0, 423.0, 0.08921253213045104, 0.024045565300785627, 0.05253433288541207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 161.4375, 142, 424, 143.0, 231.5000000000002, 424.0, 424.0, 0.08921004505107276, 0.06629769949596324, 0.044779260894776754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 159.5, 141, 213, 142.0, 213.0, 213.0, 213.0, 0.019977625059932873, 0.0053455754554898515, 0.011393489291992968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 187.1875, 141, 569, 143.0, 468.2000000000001, 569.0, 569.0, 0.0892120347034815, 0.02387118897339251, 0.05087873854182929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 143.0, 142, 144, 143.0, 144.0, 144.0, 144.0, 0.019977325735290444, 0.014846430551324247, 0.010027681081971962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 217.5, 145, 427, 149.0, 427.0, 427.0, 427.0, 0.019993701983875078, 0.015737230272464174, 0.007107136252080595], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 637.1818181818182, 141, 1427, 624.0, 1321.2000000000003, 1427.0, 1427.0, 0.06490862635644278, 0.012239517256843436, 0.04417520682248671], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1576f8b1-0d78-4448-a23d-9909a13e31d7", 1, 0, 0.0, 334.0, 334, 334, 334.0, 334.0, 334.0, 334.0, 2.9940119760479043, 0.9560956212574849, 1.7864661302395208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1320.45, 770, 3141, 1236.0, 2166.2000000000007, 3093.899999999999, 3141.0, 0.09323965855637037, 0.04825880765124638, 0.04288660076176801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 304.5, 285, 358, 287.5, 358.0, 358.0, 358.0, 0.01996306832360134, 0.030938856864800118, 0.04489740854419324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5037fc7c-c1ba-43a2-9426-f2ecb000982d", 3, 0, 0.0, 374.3333333333333, 267, 446, 410.0, 446.0, 446.0, 446.0, 0.06105254589116366, 0.02762468710570231, 0.03915153496275795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ce988ea-9db6-42e7-8a78-07d1dd8be72d", 3, 0, 0.0, 326.0, 263, 437, 278.0, 437.0, 437.0, 437.0, 0.022797911711287245, 0.026946359838438797, 0.014619754580480426], "isController": false}, {"data": ["addBook", 61, 8, 13.114754098360656, 1329.5245901639344, 718, 2788, 1122.0, 2444.0000000000005, 2535.8, 2788.0, 0.2796869340351488, 83.36643003843403, 1.0178188302093985], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eaae58ce-2a84-4239-9f30-6b847e67e8b2", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 248.01818181818186, 141, 600, 145.0, 570.2, 579.8, 600.0, 0.23604339765158278, 0.17541897032505321, 0.11410300960696627], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 925.8909090909092, 700, 1286, 845.0, 1142.4, 1275.2, 1286.0, 0.23554704731069512, 69.2586528073996, 0.11846360289551562], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 211.83636363636367, 141, 439, 146.0, 428.4, 429.59999999999997, 439.0, 0.23654794826911416, 0.4185789865855809, 0.11503992015431529], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1409.3272727272727, 984, 1961, 1399.0, 1766.3999999999999, 1831.7999999999997, 1961.0, 0.2349834870694996, 211.43855472204658, 0.1179506956579324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 187.00000000000006, 144, 472, 146.0, 430.4, 466.2999999999999, 472.0, 0.12572793617592767, 0.09392760856893034, 0.04469235231253679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 8, 4.519774011299435, 200.51977401129946, 142, 599, 148.0, 341.20000000000005, 411.69999999999993, 585.74, 0.7284070519679336, 1.536885509432254, 0.352002322054684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 148.45454545454544, 144, 162, 147.0, 160.20000000000002, 162.0, 162.0, 0.06713375485193955, 0.051989323825769596, 0.023863951920025387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a429c89-8f9e-4429-b042-3ec97c1417d2", 1, 0, 0.0, 1101.0, 1101, 1101, 1101.0, 1101.0, 1101.0, 1101.0, 0.9082652134423251, 0.16409088328792007, 0.6262062897366031], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47517a0b-de3e-4d9c-94d2-de2f9f7c6eeb", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eaae58ce-2a84-4239-9f30-6b847e67e8b2", 3, 0, 0.0, 556.6666666666666, 496, 624, 550.0, 624.0, 624.0, 624.0, 0.01696487140627474, 0.023387444793480965, 0.010879165582799881], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 11, 0, 0.0, 150.1818181818182, 144, 171, 148.0, 167.8, 171.0, 171.0, 0.07281826546891654, 0.05909372910612269, 0.025884617803403922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=620239e2-1c4e-4480-899d-98e0404b3b3d", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 466.8181818181818, 285, 1410, 290.0, 1298.0000000000005, 1410.0, 1410.0, 0.07037567816562595, 7.753133017229246, 0.15663961534893542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 384.8125, 286, 855, 287.5, 754.9000000000001, 855.0, 855.0, 0.08913897323045211, 0.13814799855149168, 0.20047563998997187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b00514dc-55fb-45db-8c40-dca9365ac142", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.28009932170542634, 1.0689195736434107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbf8b2db-dff2-43e0-897e-6a04041a2f5a", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cd8242e-99d8-4ea3-b927-0a4ef5807cd2", 1, 0, 0.0, 1682.0, 1682, 1682, 1682.0, 1682.0, 1682.0, 1682.0, 0.5945303210463733, 0.10741026307966707, 0.4099007877526754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8d4fa46-38ce-4174-a069-7fc83da71cbb", 1, 0, 0.0, 1029.0, 1029, 1029, 1029.0, 1029.0, 1029.0, 1029.0, 0.9718172983479105, 0.1755724611273081, 0.6700224732750244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 178.22222222222223, 143, 426, 146.5, 424.2, 426.0, 426.0, 0.08703514769381036, 0.07216097694535643, 0.03093827515678415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 162.83333333333331, 143, 425, 146.0, 182.90000000000038, 425.0, 425.0, 0.13012455811868806, 0.10102443721128614, 0.04625521401875239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=429ef3ac-aea5-4213-af69-6b257b2f6fe5", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f752eb2b-db09-4804-b8b2-6f8574156e45", 3, 0, 0.0, 779.3333333333334, 276, 1164, 898.0, 1164.0, 1164.0, 1164.0, 0.02129441660396644, 0.029356072369074827, 0.01365559918939254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 155.95454545454544, 141, 424, 143.0, 145.7, 382.2999999999994, 424.0, 0.1247533286456325, 0.09271219052668586, 0.06262032316782724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 155.3636363636364, 140, 426, 142.5, 144.7, 383.8499999999994, 426.0, 0.1247533286456325, 0.04189824593984621, 0.07067214045523623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 297.49999999999994, 141, 1583, 143.0, 427.0, 1409.5999999999976, 1583.0, 0.12475474351558867, 5.134575856909144, 0.07285482092023635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 264.3181818181818, 142, 1122, 143.0, 426.0, 1017.5999999999985, 1122.0, 0.12475403607659899, 1.6994525530629951, 0.07297623790027616], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 29.41176470588235, 0.3852080123266564], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07704160246533127], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07704160246533127], "isController": false}, {"data": ["401/Unauthorized", 10, 58.8235294117647, 0.7704160246533128], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 17, "401/Unauthorized", 10, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
