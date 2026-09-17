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

    var data = {"OkPercent": 98.35698282300224, "KoPercent": 1.6430171769977595};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8108974358974359, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.33620689655172414, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee08bcb6-0acb-4a94-9a7d-e65f202213c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eeaabd15-cdcc-4374-8210-804125ad1234"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d51d26a8-addd-4b21-8e0b-b98db04bef54"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1f0d993-c351-45f2-b5c9-e37b39a18120"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/53ea6701-38b6-4b9b-93c3-09eb525deb26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b4ea470-42ee-4df0-8a2c-f404ebb760f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0b045af-ec30-4785-99ca-6fda8d883b83"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f5561bce-59df-4b7b-9540-fc912dfdf00a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df22dcf8-4eff-40cf-9f4d-06dc7ab6cebd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/613fdec8-8198-4dac-b5ff-b116c249d4b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ccbbb49-db09-4a5f-8b17-49556d68da28"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d0aaf4b3-47f7-428b-8291-2db05b603edc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb8fb302-d1ba-4b18-826a-0cb85d0cd42b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f5d334b-4234-4ba4-869f-711ff57cdf77"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5fa65813-f7fc-4bb4-a4ce-ac441a759a25"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d51d26a8-addd-4b21-8e0b-b98db04bef54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eeaabd15-cdcc-4374-8210-804125ad1234"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4827586206896552, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.375, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b4ea470-42ee-4df0-8a2c-f404ebb760f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1f0d993-c351-45f2-b5c9-e37b39a18120"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0b045af-ec30-4785-99ca-6fda8d883b83"], "isController": false}, {"data": [0.8103448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9410112359550562, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/033c36ba-9080-411a-a31b-021fef7daeb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7baaafcc-2628-42f6-ae15-a2f27a0d9e23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fa65813-f7fc-4bb4-a4ce-ac441a759a25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df22dcf8-4eff-40cf-9f4d-06dc7ab6cebd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ccbbb49-db09-4a5f-8b17-49556d68da28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef332c88-61b8-4e3c-b9ee-7f101f5506f9"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=613fdec8-8198-4dac-b5ff-b116c249d4b9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f5d334b-4234-4ba4-869f-711ff57cdf77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5561bce-59df-4b7b-9540-fc912dfdf00a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0aaf4b3-47f7-428b-8291-2db05b603edc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1339, 22, 1.6430171769977595, 312.68707991038127, 77, 2646, 95.0, 869.0, 1087.0, 1625.3999999999987, 5.180004178046686, 725.3553160627035, 3.778957695826595], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1382.6724137931037, 975, 2307, 1363.0, 1682.8, 1777.6999999999994, 2307.0, 0.24298791344602946, 292.39602725889733, 1.194769672071053], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ee08bcb6-0acb-4a94-9a7d-e65f202213c1", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.1871224442379182, 2.218140102230483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eeaabd15-cdcc-4374-8210-804125ad1234", 3, 0, 0.0, 383.0, 204, 493, 452.0, 493.0, 493.0, 493.0, 0.04973227458846543, 0.03197306064850886, 0.03189211619117086], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 486.9285714285715, 86, 989, 497.0, 790.0, 989.0, 989.0, 0.08224505501606716, 0.016201174341892693, 0.05533871377545924], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 486.9285714285715, 86, 989, 497.0, 790.0, 989.0, 989.0, 0.08084914704149872, 0.015926199166098796, 0.05439947491366466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 132.94736842105263, 79, 265, 82.0, 253.0, 265.0, 265.0, 0.09332069410949956, 0.04710162500798138, 0.051984461490478834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 99.63157894736841, 80, 244, 82.0, 241.0, 244.0, 244.0, 0.09331794405834827, 0.06935054241054985, 0.0468412336386631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 189.57894736842107, 79, 662, 82.0, 620.0, 662.0, 662.0, 0.09332069410949956, 4.353715437575823, 0.05368721881001381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d51d26a8-addd-4b21-8e0b-b98db04bef54", 3, 0, 0.0, 305.3333333333333, 187, 421, 308.0, 421.0, 421.0, 421.0, 0.01768357019493189, 0.024378229093599137, 0.011340049897140566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 207.0, 79, 812, 82.0, 800.0, 812.0, 812.0, 0.09331931906366342, 13.279426397763775, 0.05359529560122199], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 200.33333333333334, 81, 305, 200.0, 304.4, 305.0, 305.0, 0.08136387552411897, 0.1477103951165402, 0.05258987996116231], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1f0d993-c351-45f2-b5c9-e37b39a18120", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53ea6701-38b6-4b9b-93c3-09eb525deb26", 2, 0, 0.0, 315.5, 190, 441, 315.5, 441.0, 441.0, 441.0, 0.08016353360856147, 0.04716653222574051, 0.04982821205258727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 81.53333333333335, 79, 88, 81.0, 86.2, 88.0, 88.0, 0.07201947406578739, 0.05352228492584395, 0.036150400068178434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 100.8, 78, 239, 80.0, 236.0, 239.0, 239.0, 0.07201912828047129, 0.019270743309422984, 0.041073409097456284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 546.75, 460, 632, 547.5, 632.0, 632.0, 632.0, 0.04048501042489018, 11.903937293779478, 0.02308910750794518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 844.5, 562, 1043, 886.5, 1043.0, 1043.0, 1043.0, 0.04025278750553476, 36.219528954333214, 0.022917358511451918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b4ea470-42ee-4df0-8a2c-f404ebb760f2", 1, 0, 0.0, 2131.0, 2131, 2131, 2131.0, 2131.0, 2131.0, 2131.0, 0.46926325668700136, 0.08477900633505397, 0.3235350187705303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 158.75, 81, 240, 157.0, 240.0, 240.0, 240.0, 0.04058276855647092, 0.07181247717219269, 0.022471122823749037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 95.81818181818181, 78, 242, 82.0, 210.40000000000012, 242.0, 242.0, 0.0682602328294487, 0.05072855193672897, 0.03426343718196937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 123.0909090909091, 78, 240, 82.0, 239.2, 240.0, 240.0, 0.06826192722037432, 0.027585963486074568, 0.038409454432060765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 184.36363636363635, 78, 902, 81.0, 769.8000000000005, 902.0, 902.0, 0.06826108001439689, 5.600493157214576, 0.03959675930522632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 192.00000000000003, 80, 656, 89.0, 573.4000000000003, 656.0, 656.0, 0.0682615036147569, 1.8413758765397623, 0.03966366665115269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 120.25, 82, 233, 83.0, 233.0, 233.0, 233.0, 0.040644623732395795, 0.030205623691751175, 0.02282290883410897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 556.3333333333334, 81, 1076, 804.5, 1031.9, 1076.0, 1076.0, 0.12169068931014901, 60.84651983642743, 0.06573093005489603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 107.86666666666667, 78, 333, 81.0, 275.40000000000003, 333.0, 333.0, 0.07201981985442393, 0.0194115920701377, 0.0423397769066047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 354.77777777777777, 77, 650, 467.0, 649.1, 650.0, 650.0, 0.12169315746418503, 19.89337165259308, 0.0658511041963857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 119.8, 79, 324, 81.0, 273.6, 324.0, 324.0, 0.07201947406578739, 0.019411498869294257, 0.04240990513834941], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 484.6428571428571, 85, 2131, 427.0, 1356.5, 2131.0, 2131.0, 0.08090755156411635, 0.015937704074851042, 0.054957989476239186], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0b045af-ec30-4785-99ca-6fda8d883b83", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 325.5454545454545, 161, 985, 322.0, 884.2000000000004, 985.0, 985.0, 0.06822593950219874, 7.516301057036885, 0.1518548055095547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 774.4545454545454, 97, 1720, 776.5, 1475.9999999999995, 1704.5499999999997, 1720.0, 0.09594334109602184, 0.05893394682558373, 0.043380631765095816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 83.44444444444446, 79, 105, 82.0, 89.70000000000002, 105.0, 105.0, 0.1216701252526345, 0.0904208645676317, 0.061072699589701296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 135.0, 78, 245, 83.0, 243.2, 245.0, 245.0, 0.12169151201703682, 0.1341036237028023, 0.06372430956968529], "isController": false}, {"data": ["login", 22, 0, 0.0, 2824.636363636364, 1565, 3838, 2675.5, 3561.9, 3801.8499999999995, 3838.0, 0.09533879942450034, 20.87069919092028, 0.17258997328346826], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f5561bce-59df-4b7b-9540-fc912dfdf00a", 3, 0, 0.0, 461.33333333333337, 206, 970, 208.0, 970.0, 970.0, 970.0, 0.09498780989772979, 0.04297951033783998, 0.06091340673780198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 86.39999999999999, 81, 95, 85.0, 94.4, 95.0, 95.0, 0.07223554566731197, 0.05847975327949378, 0.025677479123927302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df22dcf8-4eff-40cf-9f4d-06dc7ab6cebd", 3, 0, 0.0, 261.6666666666667, 172, 403, 210.0, 403.0, 403.0, 403.0, 0.025257202512249742, 0.02985315830793581, 0.016196838850628902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/613fdec8-8198-4dac-b5ff-b116c249d4b9", 3, 0, 0.0, 384.6666666666667, 216, 479, 459.0, 479.0, 479.0, 479.0, 0.05154107823935677, 0.03313594711026355, 0.03305205863656668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ccbbb49-db09-4a5f-8b17-49556d68da28", 3, 0, 0.0, 293.3333333333333, 200, 454, 226.0, 454.0, 454.0, 454.0, 0.03798478076450702, 0.024420554039681436, 0.024358729852239202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 641.1666666666666, 163, 1157, 886.5, 1112.0, 1157.0, 1157.0, 0.12160272390101538, 80.90550117211515, 0.25620226670855206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0aaf4b3-47f7-428b-8291-2db05b603edc", 3, 0, 0.0, 724.0, 304, 1142, 726.0, 1142.0, 1142.0, 1142.0, 0.020536832809644096, 0.02427384112363858, 0.013169778852538694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb8fb302-d1ba-4b18-826a-0cb85d0cd42b", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.8146324936224489, 1.5221420599489794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f5d334b-4234-4ba4-869f-711ff57cdf77", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fa65813-f7fc-4bb4-a4ce-ac441a759a25", 3, 0, 0.0, 436.0, 264, 613, 431.0, 613.0, 613.0, 613.0, 0.051453563159248775, 0.03307968334619672, 0.032995937312408886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 339.2631578947368, 161, 1044, 169.0, 898.0, 1044.0, 1044.0, 0.09328037626358088, 17.742123177964228, 0.20602133266973346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 531.125, 81, 1125, 395.0, 1125.0, 1125.0, 1125.0, 0.08043677167016902, 48.12593319223383, 0.11733635515851072], "isController": false}, {"data": ["register", 24, 6, 25.0, 1193.125, 243, 1632, 1320.5, 1583.0, 1620.75, 1632.0, 0.0939926920681917, 0.029648085486353438, 0.04240685911670368], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d51d26a8-addd-4b21-8e0b-b98db04bef54", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eeaabd15-cdcc-4374-8210-804125ad1234", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 229.06666666666663, 161, 415, 165.0, 410.2, 415.0, 415.0, 0.07199078517949703, 0.11157165632799002, 0.16190896315271644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 109.00000000000001, 81, 246, 84.0, 245.6, 246.0, 246.0, 0.07100565860479342, 0.05512646346758865, 0.025240292707172665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 233.23529411764707, 162, 483, 170.0, 361.39999999999986, 483.0, 483.0, 0.09288754596567532, 0.14395755414797534, 0.20890626792866238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 96.90909090909092, 80, 240, 83.0, 208.80000000000013, 240.0, 240.0, 0.08942725905450997, 0.06645912513718955, 0.044888292142595834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 110.63636363636364, 78, 245, 82.0, 244.8, 245.0, 245.0, 0.08942653203908753, 0.023928583768271467, 0.051001069053542104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 126.27272727272725, 79, 261, 82.0, 257.2, 261.0, 261.0, 0.08942871312081818, 0.024103832833345527, 0.052574302049543505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 95.63636363636364, 79, 245, 81.0, 212.6000000000001, 245.0, 245.0, 0.08942944017170452, 0.024104028796279736, 0.05266206291361116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 89.5, 85, 94, 89.5, 94.0, 94.0, 94.0, 0.2028809089064719, 0.05983401805640089, 0.1254136868533171], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 962.5344827586209, 626, 1964, 876.5, 1341.4, 1427.5999999999995, 1964.0, 0.24094083240903444, 288.2490001474724, 0.47576402649518323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1193.125, 243, 1632, 1320.5, 1583.0, 1620.75, 1632.0, 0.09377784029633797, 0.029580314859098795, 0.04230992403994936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 14, 0, 0.0, 127.00000000000001, 77, 246, 83.0, 243.5, 246.0, 246.0, 0.06081879474525614, 0.016392565771182317, 0.03581419260877876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 14, 0, 0.0, 104.57142857142857, 79, 246, 81.5, 240.0, 246.0, 246.0, 0.06086109758642276, 0.01640396770884051, 0.03577966869826806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 214.3846153846154, 78, 737, 82.0, 718.6, 737.0, 737.0, 0.06901824205228398, 9.570007641779396, 0.039662676660154175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 178.99999999999997, 78, 620, 82.0, 574.0, 620.0, 620.0, 0.06901824205228398, 3.137841374843382, 0.03973007728715836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 14, 0, 0.0, 103.92857142857143, 78, 241, 82.0, 240.0, 241.0, 241.0, 0.06081879474525614, 0.01627377906269549, 0.03468571887815389], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 82.3076923076923, 78, 90, 82.0, 87.6, 90.0, 90.0, 0.06901824205228398, 0.0512918771501837, 0.034643922280150355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 14, 0, 0.0, 117.14285714285714, 79, 244, 83.5, 242.0, 244.0, 244.0, 0.06085977473189096, 0.04522879743258693, 0.0305487541134687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 95.76923076923077, 77, 242, 81.0, 188.79999999999995, 242.0, 242.0, 0.06901787562978812, 0.034415614365274454, 0.03846999978763731], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 14, 0, 0.0, 97.42857142857143, 81, 252, 86.0, 170.5, 252.0, 252.0, 0.061167156732100963, 0.04814524250593103, 0.021743012744614012], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 469.2857142857143, 81, 970, 453.0, 848.0, 970.0, 970.0, 0.08156511809463884, 0.015748622132112186, 0.05550706557835495], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1570.4545454545455, 1126, 2646, 1520.0, 2077.3, 2561.549999999999, 2646.0, 0.09563096878518242, 0.04949649751576825, 0.04398651005646574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 14, 0, 0.0, 246.28571428571428, 162, 488, 168.5, 486.5, 488.0, 488.0, 0.06079608125830518, 0.09422205171575226, 0.13673181165808285], "isController": false}, {"data": ["addBook", 60, 8, 13.333333333333334, 905.8333333333334, 412, 2113, 728.0, 1545.1, 1799.0999999999992, 2113.0, 0.2755339618569152, 88.97115851841946, 1.0011426048980754], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9b4ea470-42ee-4df0-8a2c-f404ebb760f2", 3, 0, 0.0, 293.3333333333333, 208, 457, 215.0, 457.0, 457.0, 457.0, 0.023157439713465282, 0.02322528377512582, 0.01485031127458548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1f0d993-c351-45f2-b5c9-e37b39a18120", 3, 0, 0.0, 301.0, 199, 500, 204.0, 500.0, 500.0, 500.0, 0.0679532481652623, 0.03194156586934855, 0.04357679000181208], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 165.60344827586206, 80, 1102, 84.0, 335.2, 354.3499999999999, 1102.0, 0.2415760756383023, 0.17953065777416802, 0.11677749750093715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0b045af-ec30-4785-99ca-6fda8d883b83", 3, 0, 0.0, 353.0, 305, 423, 331.0, 423.0, 423.0, 423.0, 0.03770833857060257, 0.037818812218758636, 0.02418145409638251], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 509.2068965517242, 383, 727, 478.0, 641.1, 651.9999999999999, 727.0, 0.24156098373628204, 71.02694979800505, 0.12148819006268091], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 125.0, 78, 330, 85.0, 243.1, 250.6999999999998, 330.0, 0.24186923214859113, 0.4279951647004366, 0.11762781016601404], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 795.5000000000003, 542, 1217, 790.0, 1005.2, 1026.1999999999998, 1217.0, 0.24131575334201516, 217.13633904499292, 0.1211291965017537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 96.23529411764706, 83, 252, 86.0, 126.39999999999989, 252.0, 252.0, 0.08957457346695752, 0.06691850459201416, 0.031840961662082556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 8, 4.49438202247191, 158.8764044943821, 79, 1602, 90.0, 317.1, 374.99999999999966, 820.6900000000079, 0.7407499885558289, 1.6102794146410484, 0.3555170788649047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 89.72727272727272, 80, 108, 85.0, 107.2, 108.0, 108.0, 0.09064539521392313, 0.07019706875453227, 0.032221605329949235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/033c36ba-9080-411a-a31b-021fef7daeb6", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7baaafcc-2628-42f6-ae15-a2f27a0d9e23", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.8515625, 1.5911458333333333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 87.42105263157896, 79, 103, 87.0, 97.0, 103.0, 103.0, 0.08977593815855375, 0.07285527793921696, 0.0319125405172984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fa65813-f7fc-4bb4-a4ce-ac441a759a25", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df22dcf8-4eff-40cf-9f4d-06dc7ab6cebd", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 240.0, 161, 486, 167.0, 457.60000000000014, 486.0, 486.0, 0.08936623093858914, 0.138500203612833, 0.20098674790192464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ccbbb49-db09-4a5f-8b17-49556d68da28", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.31041935137457044, 1.1846273625429553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef332c88-61b8-4e3c-b9ee-7f101f5506f9", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.8870442708333334, 1.6574435763888888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 322.07692307692304, 164, 818, 315.0, 800.0, 818.0, 818.0, 0.06898857443071159, 12.788057356371095, 0.15244132488577083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 86.54545454545455, 83, 95, 85.0, 94.6, 95.0, 95.0, 0.06493161520344255, 0.05383490362082298, 0.023081160091848723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=613fdec8-8198-4dac-b5ff-b116c249d4b9", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f5d334b-4234-4ba4-869f-711ff57cdf77", 3, 0, 0.0, 355.33333333333337, 177, 710, 179.0, 710.0, 710.0, 710.0, 0.02105632567117038, 0.028856487980347432, 0.01350291717845236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 104.50000000000001, 81, 245, 86.0, 244.1, 245.0, 245.0, 0.12567726079428027, 0.09757170149555941, 0.044674338797966825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5561bce-59df-4b7b-9540-fc912dfdf00a", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0aaf4b3-47f7-428b-8291-2db05b603edc", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 92.94117647058825, 80, 242, 82.0, 129.1999999999999, 242.0, 242.0, 0.09292969048946614, 0.06906200631101928, 0.04664634854647031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 119.0, 79, 246, 82.0, 241.2, 246.0, 246.0, 0.092930198487971, 0.02486608826728912, 0.05299925382517097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 119.99999999999999, 79, 247, 82.0, 243.0, 247.0, 247.0, 0.09292969048946614, 0.02504745563973892, 0.05463249382290881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 109.58823529411765, 78, 242, 81.0, 239.6, 242.0, 242.0, 0.092930198487971, 0.025047592561210936, 0.05472354461742824], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.4480955937266617], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.14936519790888722], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.14936519790888722], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.8961911874533234], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1339, 22, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
