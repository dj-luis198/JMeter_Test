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

    var data = {"OkPercent": 99.6906419180201, "KoPercent": 0.30935808197989173};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8190854870775348, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.48148148148148145, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05094ad9-9be0-43a4-bd8e-d02730060f5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7d3f8e7e-04e0-4a9b-912e-afd46bf475fb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3fa97887-51e7-4469-a0b9-f0a146cdc07b"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2058add8-db36-4718-82a1-9bf1e909bfc2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9a0deef-2a6c-4534-b533-5d0060d4af52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57bec904-a4c0-41f6-96bc-faf4dc74456f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f3470935-c5b7-45a5-b243-be58fabc161a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6a9f9e2-2556-4e77-8e78-627277245e7b"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/fc119652-72ef-41a7-b9c4-c3c1fc637ddf"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db2fe70d-c9a3-4fc4-bf41-2cd66ee6b807"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43b82999-b984-46d6-9792-d1f2d7200def"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2058add8-db36-4718-82a1-9bf1e909bfc2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccc99556-5c13-46e9-92f7-1909dc6dab9e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/05094ad9-9be0-43a4-bd8e-d02730060f5d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddf5116b-dce5-4d46-b29b-52d720d076fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43387e9c-789a-4d2c-b0eb-59773a6ddd8d"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b202626-998d-411a-8289-12db72802acd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b263e6a3-adc9-4b16-bc7a-69666cc07dd3"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/29ae79dd-933e-4219-8574-dc4f269bfe31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd983da4-8cd6-45de-9b6d-46d0d459083a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ec8f349c-fe6c-4351-9a45-2969df013333"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3fa97887-51e7-4469-a0b9-f0a146cdc07b"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/ccc99556-5c13-46e9-92f7-1909dc6dab9e"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57bec904-a4c0-41f6-96bc-faf4dc74456f"], "isController": false}, {"data": [0.4426229508196721, 500, 1500, "addBook"], "isController": true}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8240740740740741, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9744318181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d3f8e7e-04e0-4a9b-912e-afd46bf475fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/43b82999-b984-46d6-9792-d1f2d7200def"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ddf5116b-dce5-4d46-b29b-52d720d076fc"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3470935-c5b7-45a5-b243-be58fabc161a"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc119652-72ef-41a7-b9c4-c3c1fc637ddf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db2fe70d-c9a3-4fc4-bf41-2cd66ee6b807"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c6a9f9e2-2556-4e77-8e78-627277245e7b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b202626-998d-411a-8289-12db72802acd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/43387e9c-789a-4d2c-b0eb-59773a6ddd8d"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 4, 0.30935808197989173, 319.68832173240617, 81, 5265, 111.0, 707.8000000000004, 942.4999999999998, 2200.699999999995, 5.210810113727039, 726.5624763866276, 3.791252876423603], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1231.9999999999998, 991, 1901, 1197.5, 1438.0, 1522.0, 1901.0, 0.2580398528217136, 310.50880553531323, 1.2687799403880153], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05094ad9-9be0-43a4-bd8e-d02730060f5d", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d3f8e7e-04e0-4a9b-912e-afd46bf475fb", 3, 0, 0.0, 288.6666666666667, 181, 499, 186.0, 499.0, 499.0, 499.0, 0.025545176644896497, 0.03064257029181107, 0.01638150976251501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fa97887-51e7-4469-a0b9-f0a146cdc07b", 3, 0, 0.0, 305.0, 186, 532, 197.0, 532.0, 532.0, 532.0, 0.053509319539819855, 0.03440133661821101, 0.034314244626772496], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 882.7142857142858, 426, 1956, 717.0, 1695.5, 1956.0, 1956.0, 0.0974360401993263, 0.0176031908563236, 0.0662260585729796], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 882.7142857142858, 426, 1956, 717.0, 1695.5, 1956.0, 1956.0, 0.0963497219622309, 0.017406932190442106, 0.06548770164620382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 136.0625, 81, 253, 85.0, 253.0, 253.0, 253.0, 0.13099292638197538, 0.07194057321685879, 0.07264414850504322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 126.74999999999999, 82, 253, 86.0, 252.3, 253.0, 253.0, 0.13098863673576316, 0.09734604741788651, 0.06575015554900612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 227.87499999999997, 83, 585, 243.5, 580.1, 585.0, 585.0, 0.13098970912097718, 7.250309181764595, 0.07502486757759093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 209.99999999999997, 83, 741, 85.0, 646.5000000000001, 741.0, 741.0, 0.13098434737048922, 22.127424681441973, 0.07489388221232562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2058add8-db36-4718-82a1-9bf1e909bfc2", 3, 0, 0.0, 311.3333333333333, 204, 501, 229.0, 501.0, 501.0, 501.0, 0.022839915035516068, 0.02699600634568973, 0.014646690305978729], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 440.6428571428571, 178, 2427, 259.0, 1469.0, 2427.0, 2427.0, 0.09843973027513905, 0.24015970747579438, 0.06363974750209185], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 105.44444444444444, 84, 263, 86.0, 263.0, 263.0, 263.0, 0.09206407659731172, 0.06841871317436936, 0.04621185094825999], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9a0deef-2a6c-4534-b533-5d0060d4af52", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 1.013764880952381, 1.8942212301587302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 103.11111111111111, 82, 246, 85.0, 246.0, 246.0, 246.0, 0.09198926791874282, 0.0322900696307653, 0.05203342596141561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 533.6666666666666, 413, 610, 578.0, 610.0, 610.0, 610.0, 0.24598228927517218, 72.32696042759922, 0.14028677435224665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 711.0, 580, 823, 730.0, 823.0, 823.0, 823.0, 0.24594195769798327, 221.29900585649287, 0.14002359505656664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 138.66666666666666, 84, 247, 85.0, 247.0, 247.0, 247.0, 0.2528445006321112, 0.4474162452591656, 0.14000276548672566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 109.58333333333334, 82, 249, 85.5, 237.30000000000004, 249.0, 249.0, 0.07480270785802445, 0.05559068425777013, 0.037547452967797434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 142.41666666666669, 82, 412, 85.5, 368.20000000000016, 412.0, 412.0, 0.07480177529546701, 0.029377715460280257, 0.04213687244427267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 188.24999999999997, 81, 648, 86.5, 577.8000000000002, 648.0, 648.0, 0.07480224157383916, 5.627413784572661, 0.043439843413974305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 170.25, 83, 585, 88.5, 485.10000000000036, 585.0, 585.0, 0.07480177529546701, 1.851331763794694, 0.04351262124121079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 86.66666666666667, 85, 89, 86.0, 89.0, 89.0, 89.0, 0.2562350529552443, 0.19042468290912196, 0.1438819877434233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 412.05263157894734, 83, 782, 564.0, 759.0, 782.0, 782.0, 0.09415542583030219, 44.60213564018256, 0.05109441745046929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 141.55555555555551, 82, 582, 85.0, 288.6000000000005, 582.0, 582.0, 0.0919855071723144, 4.621677861962971, 0.05363825038455052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 343.31578947368416, 84, 671, 406.0, 668.0, 671.0, 671.0, 0.0941549592408137, 14.582907467974925, 0.05118611245323224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 130.55555555555554, 82, 568, 85.0, 283.6000000000005, 568.0, 568.0, 0.09206360572226456, 1.5273108444534236, 0.053773696788514555], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 629.3571428571427, 180, 1312, 505.5, 1275.0, 1312.0, 1312.0, 0.09676460627172884, 0.01748188687526351, 0.06671466018343804], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 313.4166666666667, 167, 733, 249.5, 663.7000000000003, 733.0, 733.0, 0.07476076555023924, 7.55953142327365, 0.16654469369891348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57bec904-a4c0-41f6-96bc-faf4dc74456f", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3470935-c5b7-45a5-b243-be58fabc161a", 3, 0, 0.0, 1186.0, 473, 2582, 503.0, 2582.0, 2582.0, 2582.0, 0.016934514233459215, 0.023345594980045497, 0.010859698255180551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6a9f9e2-2556-4e77-8e78-627277245e7b", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 546.5454545454547, 93, 1832, 449.0, 1433.1999999999994, 1813.3999999999996, 1832.0, 0.10110944637982223, 0.06210726735635565, 0.04571647819712665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 86.15789473684211, 83, 95, 85.0, 89.0, 95.0, 95.0, 0.09416755878038142, 0.0699819455389358, 0.04726770040343364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 153.05263157894737, 83, 331, 97.0, 263.0, 331.0, 331.0, 0.09416102526488983, 0.0996298759304596, 0.04953907558652407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc119652-72ef-41a7-b9c4-c3c1fc637ddf", 3, 0, 0.0, 1459.0, 423, 2003, 1951.0, 2003.0, 2003.0, 2003.0, 0.018355022852003453, 0.025303880787185744, 0.011770636399233984], "isController": false}, {"data": ["login", 22, 0, 0.0, 3126.7272727272725, 1228, 7567, 2684.5, 6174.599999999999, 7381.899999999998, 7567.0, 0.10149005858744291, 16.699777377808275, 0.1760758811182359], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db2fe70d-c9a3-4fc4-bf41-2cd66ee6b807", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 91.11111111111113, 84, 116, 87.5, 107.9, 116.0, 116.0, 0.08922552246500377, 0.07223433410496888, 0.03171688493873181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43b82999-b984-46d6-9792-d1f2d7200def", 1, 0, 0.0, 858.0, 858, 858, 858.0, 858.0, 858.0, 858.0, 1.1655011655011656, 0.2105641754079254, 0.8035584207459208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2058add8-db36-4718-82a1-9bf1e909bfc2", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 0.2831725117554859, 1.0806475313479624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 504.5789473684209, 170, 868, 666.0, 846.0, 868.0, 868.0, 0.09411484983728038, 59.32913352265691, 0.1989927311757917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccc99556-5c13-46e9-92f7-1909dc6dab9e", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.3302816499085923, 1.2604261882998171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05094ad9-9be0-43a4-bd8e-d02730060f5d", 3, 0, 0.0, 359.66666666666663, 178, 622, 279.0, 622.0, 622.0, 622.0, 0.022088545616528125, 0.030450843322264515, 0.014164855099140755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddf5116b-dce5-4d46-b29b-52d720d076fc", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43387e9c-789a-4d2c-b0eb-59773a6ddd8d", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 390.5625, 166, 989, 336.5, 783.2000000000003, 989.0, 989.0, 0.1308911231276434, 29.525686807708666, 0.288097880995427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 798.3333333333334, 665, 910, 820.0, 910.0, 910.0, 910.0, 0.244140625, 292.07706451416016, 0.5505084991455078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b202626-998d-411a-8289-12db72802acd", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b263e6a3-adc9-4b16-bc7a-69666cc07dd3", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["register", 23, 3, 13.043478260869565, 1013.1304347826087, 456, 3712, 787.0, 1796.4, 3329.5999999999945, 3712.0, 0.09302626576390742, 0.0297342785610859, 0.04197083474895042], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 267.1666666666667, 169, 668, 179.0, 532.1000000000003, 668.0, 668.0, 0.09194462890126169, 6.245565387636001, 0.20547868672421718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 108.17647058823529, 84, 267, 87.0, 264.6, 267.0, 267.0, 0.10244851961889151, 0.07953766904005737, 0.03641724720827784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29ae79dd-933e-4219-8574-dc4f269bfe31", 1, 0, 0.0, 2290.0, 2290, 2290, 2290.0, 2290.0, 2290.0, 2290.0, 0.4366812227074236, 0.1394480076419214, 0.2605588155021834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd983da4-8cd6-45de-9b6d-46d0d459083a", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 227.3125, 170, 419, 172.0, 363.00000000000006, 419.0, 419.0, 0.09744867195731749, 0.15102640859010044, 0.21916434718525601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 85.5, 82, 90, 85.0, 89.9, 90.0, 90.0, 0.04912122135004764, 0.036505126413463145, 0.024656550560473136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 102.1, 83, 250, 85.0, 234.20000000000005, 250.0, 250.0, 0.04912170393366605, 0.02789959278107439, 0.027189630653908125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 222.79999999999998, 82, 790, 85.5, 786.5, 790.0, 790.0, 0.04912194522903107, 8.850594452290311, 0.028034047648286875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 201.0, 83, 662, 86.0, 645.7, 662.0, 662.0, 0.04912146264067159, 2.8992600158662323, 0.028081742411962058], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 800.8703703703702, 651, 1551, 685.5, 1081.0, 1166.0, 1551.0, 0.2570779755585495, 307.5546335329655, 0.5076285806439327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, 13.043478260869565, 1013.1304347826087, 456, 3712, 787.0, 1796.4, 3329.5999999999945, 3712.0, 0.09303717846553378, 0.029737766622305463, 0.041975758253004494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 145.42857142857144, 83, 338, 86.0, 338.0, 338.0, 338.0, 0.03203602680042471, 0.008634710348551972, 0.01886496500064072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 110.85714285714286, 82, 262, 86.0, 262.0, 262.0, 262.0, 0.03207257565691508, 0.008644561407527892, 0.01885516654830359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 159.58823529411765, 82, 729, 85.0, 454.59999999999974, 729.0, 729.0, 0.09964362749695208, 5.299366136479532, 0.058075841255978616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 147.2941176470588, 82, 501, 84.0, 303.3999999999998, 501.0, 501.0, 0.09964245941035109, 1.7486999772873804, 0.058172467542934175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 136.28571428571428, 82, 279, 85.0, 279.0, 279.0, 279.0, 0.03207301651302165, 0.008582037621648369, 0.018291642230082655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 104.94117647058822, 83, 254, 85.0, 254.0, 254.0, 254.0, 0.0996407073317977, 0.07404939285107232, 0.050014964422406265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 109.85714285714286, 83, 251, 86.0, 251.0, 251.0, 251.0, 0.032072869559639505, 0.023835404037974278, 0.016099077103178424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 103.88235294117646, 82, 254, 84.0, 253.2, 254.0, 254.0, 0.0996407073317977, 0.035464948450587, 0.056334090163117696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 88.71428571428572, 86, 94, 88.0, 94.0, 94.0, 94.0, 0.03244751614263928, 0.025539744151335215, 0.011534078003828807], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 1019.0714285714286, 410, 4337, 527.5, 3170.0, 4337.0, 4337.0, 0.09467967835960694, 0.017105215328639928, 0.0644450545084434], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ec8f349c-fe6c-4351-9a45-2969df013333", 1, 0, 0.0, 1047.0, 1047, 1047, 1047.0, 1047.0, 1047.0, 1047.0, 0.9551098376313276, 0.3050008954154728, 0.5698946394460364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3fa97887-51e7-4469-a0b9-f0a146cdc07b", 1, 0, 0.0, 820.0, 820, 820, 820.0, 820.0, 820.0, 820.0, 1.2195121951219512, 0.2203220274390244, 0.840796493902439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccc99556-5c13-46e9-92f7-1909dc6dab9e", 3, 0, 0.0, 1323.6666666666667, 523, 2427, 1021.0, 2427.0, 2427.0, 2427.0, 0.032343967311030376, 0.026290002075404568, 0.020741411329013616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1666.0000000000002, 786, 5265, 1282.5, 2898.5999999999995, 4932.449999999995, 5265.0, 0.10156033607238482, 0.0525654083187148, 0.04671378739266919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 308.8571428571429, 169, 514, 334.0, 514.0, 514.0, 514.0, 0.032023129849216805, 0.04962959674873737, 0.07202076957299443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57bec904-a4c0-41f6-96bc-faf4dc74456f", 3, 0, 0.0, 306.6666666666667, 179, 410, 331.0, 410.0, 410.0, 410.0, 0.02695635765695339, 0.0270353313610265, 0.017286466336002015], "isController": false}, {"data": ["addBook", 61, 1, 1.639344262295082, 990.7213114754098, 427, 3499, 851.0, 1500.0, 1893.2, 3499.0, 0.28025360654231374, 99.98195023919186, 1.0177229538040982], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 170.07407407407405, 84, 644, 89.0, 342.0, 346.5, 644.0, 0.2577873254564984, 0.19157827604726102, 0.1246139903329753], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 488.351851851852, 404, 698, 421.0, 633.0, 673.25, 698.0, 0.2579153750997034, 75.83568387575166, 0.1297132990003391], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 135.44444444444449, 82, 264, 87.0, 253.0, 261.75, 264.0, 0.2583175871223899, 0.45710104283766656, 0.12562710779975603], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 626.6481481481482, 563, 912, 582.5, 752.0, 836.0, 912.0, 0.2579301582449286, 232.086009781643, 0.1294688489627864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 89.5, 85, 128, 87.0, 102.10000000000002, 128.0, 128.0, 0.09902828495388995, 0.07398109178684162, 0.035201460667203074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 1, 0.5681818181818182, 194.13068181818178, 83, 3000, 91.0, 387.3, 474.2500000000001, 1754.1399999999835, 0.7391914253794656, 1.529725614557871, 0.3590753269137078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 88.4, 86, 93, 87.5, 92.9, 93.0, 93.0, 0.05034714355481042, 0.03898953597555142, 0.017896836185499015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d3f8e7e-04e0-4a9b-912e-afd46bf475fb", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 87.875, 84, 95, 87.0, 93.6, 95.0, 95.0, 0.12474660845158272, 0.10123479650709497, 0.04434352097302355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43b82999-b984-46d6-9792-d1f2d7200def", 3, 0, 0.0, 521.0, 183, 1192, 188.0, 1192.0, 1192.0, 1192.0, 0.0370004933399112, 0.0300749452701036, 0.023727529908732118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddf5116b-dce5-4d46-b29b-52d720d076fc", 3, 0, 0.0, 1735.6666666666665, 220, 4527, 460.0, 4527.0, 4527.0, 4527.0, 0.046869141357330335, 0.030132341855705538, 0.030056057445944258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 327.3, 167, 875, 176.0, 871.5, 875.0, 875.0, 0.04910072030756691, 11.809183553222725, 0.10791609484786141], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3470935-c5b7-45a5-b243-be58fabc161a", 1, 0, 0.0, 1238.0, 1238, 1238, 1238.0, 1238.0, 1238.0, 1238.0, 0.8077544426494346, 0.14593219911147012, 0.556908824717286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 294.7647058823529, 168, 984, 173.0, 603.9999999999997, 984.0, 984.0, 0.0995905072671779, 7.153788430219274, 0.2224824929407905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc119652-72ef-41a7-b9c4-c3c1fc637ddf", 1, 0, 0.0, 1312.0, 1312, 1312, 1312.0, 1312.0, 1312.0, 1312.0, 0.7621951219512195, 0.13770126714939024, 0.5254978086890244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db2fe70d-c9a3-4fc4-bf41-2cd66ee6b807", 3, 0, 0.0, 375.6666666666667, 201, 511, 415.0, 511.0, 511.0, 511.0, 0.08608568395075898, 0.038951530173032226, 0.05520468664811042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 129.16666666666669, 85, 256, 91.5, 253.60000000000002, 256.0, 256.0, 0.07661807803551247, 0.06352416821499032, 0.027235332426686076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 88.78947368421053, 86, 94, 88.0, 93.0, 94.0, 94.0, 0.0891152729507005, 0.06918617382403017, 0.03167769468169432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6a9f9e2-2556-4e77-8e78-627277245e7b", 3, 0, 0.0, 2047.0, 329, 4337, 1475.0, 4337.0, 4337.0, 4337.0, 0.016218583252690932, 0.022358626326544954, 0.010400588869726932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b202626-998d-411a-8289-12db72802acd", 3, 0, 0.0, 380.0, 258, 584, 298.0, 584.0, 584.0, 584.0, 0.07416930379746836, 0.0476837158203125, 0.04756299755241297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 84.875, 82, 87, 85.0, 86.3, 87.0, 87.0, 0.09749914688246478, 0.07245786208745673, 0.0489400014624872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 114.8125, 81, 255, 83.5, 252.2, 255.0, 255.0, 0.09750152346130408, 0.026089274832419258, 0.05560633759902499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 103.9375, 81, 248, 84.0, 247.3, 248.0, 248.0, 0.0975003351574021, 0.026279387210393534, 0.057319532973394594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 139.99999999999997, 82, 334, 84.0, 275.20000000000005, 334.0, 334.0, 0.09750092930573245, 0.0262795473519357, 0.057415098018902995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43387e9c-789a-4d2c-b0eb-59773a6ddd8d", 3, 0, 0.0, 758.3333333333333, 220, 1686, 369.0, 1686.0, 1686.0, 1686.0, 0.03421571870117132, 0.027811409373966398, 0.021941720651467284], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 75.0, 0.23201856148491878], "isController": false}, {"data": ["401/Unauthorized", 1, 25.0, 0.07733952049497293], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 4, "406/Not Acceptable", 3, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
