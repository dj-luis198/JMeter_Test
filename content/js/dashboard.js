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

    var data = {"OkPercent": 98.27067669172932, "KoPercent": 1.7293233082706767};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7713178294573644, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.017543859649122806, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67ae27e9-c406-4762-9aa1-9bc22e2c6fcd"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f9a2d36-0777-4808-804c-0f15de9aac61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3eb40d7-26af-4a66-96bc-b89cc881e49c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f760aa4-c761-45c7-90a9-c3938b3b145e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2179fa6b-3e8a-4782-8790-78f0bacef0e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83954d45-5fbc-4941-b85d-bff24fef8977"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a17eccb6-3a7c-410e-a82e-cefff11bd63b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d5fbe54b-b00c-4525-b7b8-8fde4f3e32b3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5b7e84a1-0667-4fd3-93fc-230c759e6790"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6caaab62-eaae-4b7a-a266-a2dd3230cf86"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46e5c4d6-e806-4456-8a24-09e1f1e20c7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca7f5929-cf77-4db1-924a-3d4693619558"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35abf9c1-3eda-4e38-9281-00b6d5d3ab7f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81685d90-fba8-4876-9c78-6086df2a7aed"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/67ae27e9-c406-4762-9aa1-9bc22e2c6fcd"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f9a2d36-0777-4808-804c-0f15de9aac61"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81685d90-fba8-4876-9c78-6086df2a7aed"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2179fa6b-3e8a-4782-8790-78f0bacef0e4"], "isController": false}, {"data": [0.41228070175438597, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3eb40d7-26af-4a66-96bc-b89cc881e49c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/35abf9c1-3eda-4e38-9281-00b6d5d3ab7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5fbe54b-b00c-4525-b7b8-8fde4f3e32b3"], "isController": false}, {"data": [0.2966101694915254, 500, 1500, "addBook"], "isController": true}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.94, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f760aa4-c761-45c7-90a9-c3938b3b145e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a17eccb6-3a7c-410e-a82e-cefff11bd63b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83954d45-5fbc-4941-b85d-bff24fef8977"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca7f5929-cf77-4db1-924a-3d4693619558"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b7e84a1-0667-4fd3-93fc-230c759e6790"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6caaab62-eaae-4b7a-a266-a2dd3230cf86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4424e5b-bff4-4d63-ab86-cdd7aa374671"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1330, 23, 1.7293233082706767, 397.26766917293276, 107, 2337, 131.0, 1122.9, 1348.9, 1817.5600000000013, 5.302586306569227, 757.0743498662891, 3.881289003163611], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1875.6491228070172, 1402, 2530, 1832.0, 2328.6, 2414.7999999999997, 2530.0, 0.25971422322665305, 312.5245528900042, 1.2770128065880841], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67ae27e9-c406-4762-9aa1-9bc22e2c6fcd", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 567.2666666666667, 116, 958, 570.0, 935.8000000000001, 958.0, 958.0, 0.08268790827154708, 0.0161984320305394, 0.055674371571897134], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 567.2666666666667, 116, 958, 570.0, 935.8000000000001, 958.0, 958.0, 0.08123608831987522, 0.015914022770475558, 0.05469685061224932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f9a2d36-0777-4808-804c-0f15de9aac61", 3, 0, 0.0, 505.0, 389, 701, 425.0, 701.0, 701.0, 701.0, 0.03659563048172048, 0.030508271374897835, 0.02346790105761372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 189.4, 110, 343, 115.0, 342.4, 343.0, 343.0, 0.11934693357945324, 0.05583509535819993, 0.066728611040387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 129.6, 110, 327, 116.0, 201.00000000000006, 327.0, 327.0, 0.11934313538285278, 0.08869152932260836, 0.05990465975272102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 200.2, 114, 860, 115.0, 731.6000000000001, 860.0, 860.0, 0.11934598400763814, 4.7067694036678995, 0.06891142787524367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 291.46666666666664, 107, 1246, 116.0, 1205.8, 1246.0, 1246.0, 0.11934598400763814, 14.346241969009826, 0.06879487906273621], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3eb40d7-26af-4a66-96bc-b89cc881e49c", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 296.8, 109, 853, 244.0, 574.6000000000001, 853.0, 853.0, 0.08276136037606763, 0.17204233312551037, 0.053493150118072874], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2f760aa4-c761-45c7-90a9-c3938b3b145e", 3, 0, 0.0, 352.33333333333337, 217, 614, 226.0, 614.0, 614.0, 614.0, 0.07118957784580338, 0.03304568294535014, 0.045652170688877815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2179fa6b-3e8a-4782-8790-78f0bacef0e4", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83954d45-5fbc-4941-b85d-bff24fef8977", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 117.15789473684211, 108, 137, 116.0, 130.0, 137.0, 137.0, 0.08391003078173234, 0.062358919360252264, 0.042118902169736745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 138.1052631578947, 109, 340, 115.0, 338.0, 340.0, 340.0, 0.08382821392960195, 0.022430596305381773, 0.047808278256726115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 924.8571428571429, 865, 1023, 909.0, 1023.0, 1023.0, 1023.0, 0.09425959091337544, 27.71544944151192, 0.053757422942784426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1208.5714285714287, 1018, 1466, 1188.0, 1466.0, 1466.0, 1466.0, 0.09355912268274101, 84.1846630493257, 0.05326657082425587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 176.14285714285714, 108, 343, 115.0, 343.0, 343.0, 343.0, 0.09528865656606908, 0.16861625556417692, 0.052762371360313635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 142.5, 110, 373, 115.0, 345.1, 373.0, 373.0, 0.10044642857142858, 0.07464817592075894, 0.05041939871651786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a17eccb6-3a7c-410e-a82e-cefff11bd63b", 1, 0, 0.0, 751.0, 751, 751, 751.0, 751.0, 751.0, 751.0, 1.3315579227696406, 0.2405646637816245, 0.9180467709720372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 139.94444444444446, 111, 341, 115.0, 341.0, 341.0, 341.0, 0.10044642857142858, 0.026877267020089288, 0.05728585379464286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 176.77777777777777, 109, 344, 116.0, 342.2, 344.0, 344.0, 0.10044754963783079, 0.027073753613321577, 0.05905217273630286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 168.05555555555557, 109, 431, 116.0, 352.7000000000001, 431.0, 431.0, 0.10044923128435503, 0.027074206869611317, 0.05915125631295516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 145.28571428571428, 108, 341, 114.0, 341.0, 341.0, 341.0, 0.09528476532723511, 0.07081221329494719, 0.053504628967929874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 138.21052631578948, 108, 343, 115.0, 341.0, 343.0, 343.0, 0.08391262487523518, 0.022617074673403233, 0.04933144548329256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 740.6666666666666, 109, 1469, 1017.5, 1373.6000000000001, 1469.0, 1469.0, 0.09132003104881056, 45.66089741272595, 0.04932629281260622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 173.42105263157893, 109, 346, 116.0, 344.0, 346.0, 346.0, 0.08383302226869807, 0.022595619283360027, 0.04936651604299311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 489.72222222222223, 108, 911, 664.5, 907.4, 911.0, 911.0, 0.0913209576524426, 14.928380429157768, 0.04941597393801336], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 477.92857142857144, 112, 751, 479.5, 665.0, 751.0, 751.0, 0.08032589362556658, 0.015167563758678067, 0.05497191283206151], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d5fbe54b-b00c-4525-b7b8-8fde4f3e32b3", 3, 0, 0.0, 505.66666666666663, 239, 957, 321.0, 957.0, 957.0, 957.0, 0.01976414783582581, 0.027246473334870545, 0.012674274491073194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 375.1111111111111, 226, 718, 342.5, 685.6, 718.0, 718.0, 0.1003814495081309, 0.15557164098574583, 0.22576023263400924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b7e84a1-0667-4fd3-93fc-230c759e6790", 3, 0, 0.0, 618.6666666666666, 260, 1092, 504.0, 1092.0, 1092.0, 1092.0, 0.05262696254714499, 0.033834066090693796, 0.03374841022717305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 666.0, 259, 1328, 502.0, 1296.3, 1326.35, 1328.0, 0.10406860959607188, 0.06392495648039963, 0.047054459221661404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 127.99999999999999, 110, 342, 115.5, 143.1000000000003, 342.0, 342.0, 0.09131725135073435, 0.06786369949014534, 0.045836979681911576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 242.66666666666666, 113, 354, 339.5, 348.6, 354.0, 354.0, 0.09132049434827608, 0.10063486768675041, 0.047820389076039534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6caaab62-eaae-4b7a-a266-a2dd3230cf86", 3, 0, 0.0, 454.3333333333333, 210, 600, 553.0, 600.0, 600.0, 600.0, 0.02069179570300376, 0.02852531080801462, 0.013269152843397592], "isController": false}, {"data": ["login", 22, 0, 0.0, 2890.9545454545455, 1888, 4072, 2723.0, 3926.1, 4057.45, 4072.0, 0.10263683356037845, 39.20784902792421, 0.2090095603877806], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 119.78947368421053, 111, 145, 119.0, 124.0, 145.0, 145.0, 0.086794055977598, 0.07026589102092651, 0.030852574585786788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46e5c4d6-e806-4456-8a24-09e1f1e20c7d", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca7f5929-cf77-4db1-924a-3d4693619558", 3, 0, 0.0, 309.3333333333333, 212, 488, 228.0, 488.0, 488.0, 488.0, 0.027656141968195436, 0.022479617999539066, 0.017735221249135746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35abf9c1-3eda-4e38-9281-00b6d5d3ab7f", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 870.3333333333334, 226, 1587, 1134.0, 1495.2, 1587.0, 1587.0, 0.09126308104161596, 60.71973614829237, 0.19228029997667723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81685d90-fba8-4876-9c78-6086df2a7aed", 3, 0, 0.0, 394.66666666666663, 203, 750, 231.0, 750.0, 750.0, 750.0, 0.03353116721993092, 0.02795355444343851, 0.021502734187260394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 467.46666666666664, 225, 1506, 238.0, 1420.8, 1506.0, 1506.0, 0.11923404052367591, 19.179532868353697, 0.2640925320739569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67ae27e9-c406-4762-9aa1-9bc22e2c6fcd", 3, 0, 0.0, 702.3333333333333, 210, 1577, 320.0, 1577.0, 1577.0, 1577.0, 0.022949289719483183, 0.027125283519350073, 0.0147168296703717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, 30.0, 982.1999999999999, 109, 1730, 1201.5, 1714.5, 1730.0, 1730.0, 0.10410268689034864, 87.18846050994702, 0.18483310062045202], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 989.391304347826, 243, 1825, 1019.0, 1495.8000000000004, 1778.5999999999995, 1825.0, 0.09582614637235541, 0.0298968462781958, 0.043234062132840034], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 316.7894736842105, 224, 481, 234.0, 470.0, 481.0, 481.0, 0.08378422475338775, 0.12984918426135386, 0.18843268516313672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 149.18749999999997, 115, 354, 119.5, 354.0, 354.0, 354.0, 0.11019056080108539, 0.0855483357781864, 0.03916930090976082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f9a2d36-0777-4808-804c-0f15de9aac61", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 506.92857142857144, 228, 1593, 345.0, 1476.0, 1593.0, 1593.0, 0.10257236846925394, 17.666573634139013, 0.2269385032859791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 174.83333333333331, 110, 349, 117.0, 346.6, 349.0, 349.0, 0.06247852300771609, 0.04643179297741401, 0.031361289869107495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 170.91666666666666, 113, 340, 116.0, 339.1, 340.0, 340.0, 0.06241158358991429, 0.02451158059935924, 0.03515730644607639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81685d90-fba8-4876-9c78-6086df2a7aed", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 265.16666666666663, 108, 1244, 119.5, 974.300000000001, 1244.0, 1244.0, 0.06211855325889459, 4.673212934959286, 0.03607405566857681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 214.58333333333331, 113, 863, 115.0, 706.1000000000006, 863.0, 863.0, 0.06224130955715308, 1.5404622811180613, 0.036206126360231954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 112.0, 112, 112, 112.0, 112.0, 112.0, 112.0, 8.928571428571429, 2.6332310267857144, 5.519321986607142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2179fa6b-3e8a-4782-8790-78f0bacef0e4", 3, 0, 0.0, 1015.6666666666667, 438, 1756, 853.0, 1756.0, 1756.0, 1756.0, 0.04327817770019764, 0.027823698228479923, 0.027753258486129345], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1278.7543859649122, 904, 2060, 1238.0, 1850.8000000000002, 1942.8999999999999, 2060.0, 0.25519569480385745, 305.3027713636852, 0.5039118114193357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 989.391304347826, 243, 1825, 1019.0, 1495.8000000000004, 1778.5999999999995, 1825.0, 0.09307746473173456, 0.02903928374867466, 0.041993934283263055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 114.25, 114, 115, 114.0, 115.0, 115.0, 115.0, 0.03962593120938342, 0.010680426771279125, 0.02333441066333809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 114.5, 110, 119, 114.5, 119.0, 119.0, 119.0, 0.03962553865966616, 0.010680320966863143, 0.0232954826885928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 176.37500000000003, 107, 428, 115.0, 375.50000000000006, 428.0, 428.0, 0.1041815885087708, 0.028080193777754624, 0.06124737918191407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 142.18749999999997, 109, 341, 115.5, 330.5, 341.0, 341.0, 0.10417616188975558, 0.02807873113434818, 0.061345923456565046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3eb40d7-26af-4a66-96bc-b89cc881e49c", 2, 0, 0.0, 333.0, 277, 389, 333.0, 389.0, 389.0, 389.0, 0.02159267576438072, 0.024565886001468303, 0.013421619261746417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 128.49999999999997, 110, 324, 115.5, 184.00000000000014, 324.0, 324.0, 0.10417751849150954, 0.0774209878633191, 0.052292230961558495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 116.0, 113, 120, 115.5, 120.0, 120.0, 120.0, 0.03962632376687834, 0.010603137414184243, 0.022599387773297803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35abf9c1-3eda-4e38-9281-00b6d5d3ab7f", 3, 0, 0.0, 602.3333333333334, 244, 1052, 511.0, 1052.0, 1052.0, 1052.0, 0.03077080875942356, 0.025652357172162674, 0.019732582440125133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 184.375, 108, 344, 117.0, 343.3, 344.0, 344.0, 0.10417616188975558, 0.027875262068157252, 0.05941296732775122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 116.5, 116, 117, 116.5, 117.0, 117.0, 117.0, 0.039624753583563654, 0.029447692848722597, 0.019889768888624725], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 673.2307692307692, 111, 1577, 511.0, 1516.2, 1577.0, 1577.0, 0.08232381121250308, 0.015423346241284757, 0.05602867559985561], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 118.5, 117, 121, 118.0, 121.0, 121.0, 121.0, 0.038446381714900855, 0.030261507482627042, 0.013666487250218665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1424.9090909090908, 951, 2337, 1361.5, 2081.0, 2307.5999999999995, 2337.0, 0.10370314503356211, 0.05367447936307414, 0.0476993958113357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 233.75, 231, 238, 233.0, 238.0, 238.0, 238.0, 0.03957966396865291, 0.06134074874829313, 0.08901559191387465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5fbe54b-b00c-4525-b7b8-8fde4f3e32b3", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 1130.5593220338985, 576, 2221, 945.0, 2057.0, 2082.0, 2221.0, 0.28202137626431617, 86.90685978906951, 1.0250909399437869], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 199.3157894736842, 110, 553, 117.0, 466.2, 480.2, 553.0, 0.25610610880465845, 0.190328856250337, 0.12380129283037689], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 730.4210526315793, 537, 1031, 679.0, 919.4000000000001, 1017.5999999999999, 1031.0, 0.2560290345908701, 75.28103713375496, 0.12876460235771298], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 181.19298245614038, 109, 466, 118.0, 347.2, 385.09999999999957, 466.0, 0.25655220837440423, 0.4539771499750199, 0.12476855446333329], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1077.19298245614, 755, 1576, 1051.0, 1410.6000000000001, 1480.3, 1576.0, 0.255767099376736, 230.13968560979137, 0.12838309480433815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 138.57142857142858, 115, 349, 118.5, 247.5, 349.0, 349.0, 0.10501759044639977, 0.07845552411278889, 0.037330471603993665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, 5.142857142857143, 174.45714285714286, 110, 523, 120.0, 334.00000000000006, 382.1999999999996, 523.0, 0.7371897484287326, 1.627354597220584, 0.3533697667426323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 156.66666666666666, 116, 345, 119.5, 343.8, 345.0, 345.0, 0.06435006435006435, 0.04983359475546976, 0.02287443693693694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f760aa4-c761-45c7-90a9-c3938b3b145e", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a17eccb6-3a7c-410e-a82e-cefff11bd63b", 3, 0, 0.0, 678.6666666666667, 297, 1425, 314.0, 1425.0, 1425.0, 1425.0, 0.02046091623982922, 0.028207024829321855, 0.0131210953751509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 119.66666666666667, 111, 137, 118.0, 134.6, 137.0, 137.0, 0.1160065891742651, 0.09414206601934991, 0.041236717245539546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83954d45-5fbc-4941-b85d-bff24fef8977", 3, 0, 0.0, 446.0, 361, 578, 399.0, 578.0, 578.0, 578.0, 0.022675908359095685, 0.02680215600647019, 0.014541516753716958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 461.74999999999994, 226, 1594, 247.5, 1320.700000000001, 1594.0, 1594.0, 0.06207613638127162, 6.276908752282591, 0.13828712217618241], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca7f5929-cf77-4db1-924a-3d4693619558", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 349.25000000000006, 226, 651, 239.5, 573.3000000000001, 651.0, 651.0, 0.10409686213021216, 0.16132980488344403, 0.23411628270105334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 145.3888888888889, 111, 346, 118.5, 345.1, 346.0, 346.0, 0.101710430404638, 0.08432827677103286, 0.03615487955789866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 123.16666666666666, 115, 148, 120.0, 132.70000000000002, 148.0, 148.0, 0.0920400681096504, 0.07145688881559772, 0.03271736796085229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b7e84a1-0667-4fd3-93fc-230c759e6790", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6caaab62-eaae-4b7a-a266-a2dd3230cf86", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4424e5b-bff4-4d63-ab86-cdd7aa374671", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 0.9618552334337349, 1.7972279743975903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 146.64285714285714, 109, 343, 115.0, 341.5, 343.0, 343.0, 0.10283078459888649, 0.07642014363257092, 0.05161623367561295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 151.21428571428572, 107, 351, 114.5, 347.5, 351.0, 351.0, 0.10283380587915558, 0.049580584977450014, 0.057413628784651324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 342.2857142857143, 113, 1250, 119.0, 1247.0, 1250.0, 1250.0, 0.1026611229660265, 13.220097312661782, 0.05909316313585733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 301.85714285714283, 110, 1027, 119.5, 962.5, 1027.0, 1027.0, 0.1026611229660265, 4.3359715867009845, 0.05919341813875384], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 34.78260869565217, 0.6015037593984962], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.15037593984962405], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.07518796992481203], "isController": false}, {"data": ["401/Unauthorized", 12, 52.17391304347826, 0.9022556390977443], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1330, 23, "401/Unauthorized", 12, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
