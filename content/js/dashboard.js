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

    var data = {"OkPercent": 96.76656151419559, "KoPercent": 3.2334384858044163};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7564102564102564, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c267de0f-03fd-43fa-85e2-b0e565d948f7"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10f9e592-bc70-4070-ac5e-e203bdbf6496"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8e018548-2b81-4bf8-a138-5f81aa225739"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac9610a4-7280-4478-b882-3abf64b7c979"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f6ad887-36a1-415b-9e9d-a9d34b29da37"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/384b3ffa-494a-40c6-be61-b82eee3fc380"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bfe8f7c-21af-43ce-8cc3-b39bbbbf57cd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/954d95f7-9a58-4b4f-a48e-e34ff417e2da"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/317eb3a6-10ee-4b48-9e3f-fe53cc741288"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ab9b700-cd26-4592-bed6-1bc6a5282e22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c267de0f-03fd-43fa-85e2-b0e565d948f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14199eb5-e278-4612-8725-88361e1c93e7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f472140-bc32-47ce-8c95-b920c3adca91"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5d8ff6f-d09c-4e12-9944-be5406a443eb"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bbe9c5e0-ddb0-409d-ab76-009a36ea466f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10f9e592-bc70-4070-ac5e-e203bdbf6496"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "addBook"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e018548-2b81-4bf8-a138-5f81aa225739"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/14199eb5-e278-4612-8725-88361e1c93e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=954d95f7-9a58-4b4f-a48e-e34ff417e2da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bfe8f7c-21af-43ce-8cc3-b39bbbbf57cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=384b3ffa-494a-40c6-be61-b82eee3fc380"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9f6ad887-36a1-415b-9e9d-a9d34b29da37"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=317eb3a6-10ee-4b48-9e3f-fe53cc741288"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1f472140-bc32-47ce-8c95-b920c3adca91"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ab9b700-cd26-4592-bed6-1bc6a5282e22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1268, 41, 3.2334384858044163, 364.7705047318609, 100, 2364, 114.0, 1028.1000000000001, 1209.55, 1646.159999999998, 5.012253933117242, 731.5193132238714, 3.66542917794885], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/c267de0f-03fd-43fa-85e2-b0e565d948f7", 3, 0, 0.0, 325.3333333333333, 288, 391, 297.0, 391.0, 391.0, 391.0, 0.08165931732810713, 0.036948714546246396, 0.05236616378137079], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1704.259259259259, 1229, 2242, 1668.5, 2050.5, 2183.25, 2242.0, 0.24016117483288785, 288.995488882261, 1.1808706203941313], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/10f9e592-bc70-4070-ac5e-e203bdbf6496", 3, 0, 0.0, 331.3333333333333, 189, 499, 306.0, 499.0, 499.0, 499.0, 0.022767460745103097, 0.02283416229025477, 0.014600227105420933], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 550.2666666666668, 109, 1408, 458.0, 1110.4, 1408.0, 1408.0, 0.0824307169823763, 0.017403829112880624, 0.0549752776541317], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 550.2666666666668, 109, 1408, 458.0, 1110.4, 1408.0, 1408.0, 0.08259775444238256, 0.0174390962016046, 0.05508667946014108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 124.88888888888889, 100, 306, 102.5, 303.3, 306.0, 306.0, 0.08632348286478865, 0.023098275688429776, 0.04923136132132478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 126.38888888888889, 101, 308, 104.0, 306.2, 308.0, 308.0, 0.0863218269535109, 0.06415127960119316, 0.04332951079502403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 169.83333333333331, 101, 307, 103.0, 307.0, 307.0, 307.0, 0.08632224092537442, 0.023266541499417325, 0.050832335232422636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 158.61111111111111, 101, 307, 103.0, 306.1, 307.0, 307.0, 0.08632224092537442, 0.023266541499417325, 0.05074803616901895], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 228.40000000000006, 102, 518, 211.0, 458.00000000000006, 518.0, 518.0, 0.08262687356435808, 0.1312400933821383, 0.053395465299467336], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8e018548-2b81-4bf8-a138-5f81aa225739", 3, 0, 0.0, 381.3333333333333, 265, 587, 292.0, 587.0, 587.0, 587.0, 0.020559351420993837, 0.024300457359905152, 0.013184219498488886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 124.57894736842104, 102, 304, 104.0, 302.0, 304.0, 304.0, 0.1006947940791461, 0.07483275224045917, 0.05054406655925889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 155.68421052631584, 100, 307, 103.0, 305.0, 307.0, 307.0, 0.10069746242394692, 0.03490458915435331, 0.05698391556782769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 740.3333333333334, 602, 913, 794.0, 913.0, 913.0, 913.0, 0.05105253305651515, 15.0111398222521, 0.0291158977587938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1073.7777777777778, 806, 1207, 1110.0, 1207.0, 1207.0, 1207.0, 0.05093638046080446, 45.83264467523813, 0.028999911922508784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 215.44444444444446, 102, 309, 302.0, 309.0, 309.0, 309.0, 0.05125372301349112, 0.0906950645512167, 0.02837974702016549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 103.66666666666667, 101, 108, 103.0, 107.10000000000001, 108.0, 108.0, 0.06102056901680608, 0.045348293966591235, 0.03062946530726399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 153.74999999999997, 101, 307, 103.5, 306.7, 307.0, 307.0, 0.060959192900286, 0.03920080910628743, 0.03348588477188562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 303.66666666666663, 101, 910, 104.0, 908.2, 910.0, 910.0, 0.06102181021199994, 13.739218487002354, 0.03456313469039059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 266.0833333333333, 101, 844, 104.0, 834.1, 844.0, 844.0, 0.061021499908467745, 4.4979221702550705, 0.03462255024103493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 125.44444444444444, 101, 309, 103.0, 309.0, 309.0, 309.0, 0.05125313925477936, 0.03808949118446005, 0.028779838937009892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 783.0, 102, 1218, 1057.0, 1212.5, 1218.0, 1218.0, 0.07883149205491177, 45.607190989349306, 0.04198920712411455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 187.73684210526312, 100, 1119, 103.0, 413.0, 1119.0, 1119.0, 0.10069639506905653, 4.794490954880065, 0.058743014187592084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 580.9285714285714, 102, 1025, 806.0, 968.0, 1025.0, 1025.0, 0.07892303876248676, 14.925736151120706, 0.042115042308386134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 182.52631578947367, 102, 808, 103.0, 306.0, 808.0, 808.0, 0.10069639506905653, 1.5840325494472298, 0.05884135051090171], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 543.4, 106, 2364, 406.0, 1555.2000000000005, 2364.0, 2364.0, 0.08285690612312537, 0.01749381162482393, 0.055550808545308916], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 425.0833333333333, 205, 1012, 210.5, 1010.8, 1012.0, 1012.0, 0.060926385694484636, 18.293102680951364, 0.1331277226478607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac9610a4-7280-4478-b882-3abf64b7c979", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 1.068013168896321, 1.9955842391304348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 494.21739130434787, 139, 1014, 521.0, 912.4000000000002, 1004.3999999999999, 1014.0, 0.1082944101250565, 0.06652068746939506, 0.04896514832802848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 103.71428571428571, 102, 106, 104.0, 106.0, 106.0, 106.0, 0.07892170403233535, 0.058651774188092975, 0.03961499596935583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 155.92857142857142, 102, 418, 104.5, 362.5, 418.0, 418.0, 0.07883282373543704, 0.09721028585344978, 0.04070316415246268], "isController": false}, {"data": ["login", 23, 0, 0.0, 2535.565217391304, 1578, 4116, 2454.0, 3563.400000000001, 4054.999999999999, 4116.0, 0.10921436881217503, 51.27202372296351, 0.2356465089983143], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f6ad887-36a1-415b-9e9d-a9d34b29da37", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 0.255175229519774, 0.9738038488700566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 111.36842105263159, 103, 141, 109.0, 135.0, 141.0, 141.0, 0.09796036214399143, 0.07930580099352431, 0.03482184748087195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/384b3ffa-494a-40c6-be61-b82eee3fc380", 3, 0, 0.0, 464.0, 418, 490, 484.0, 490.0, 490.0, 490.0, 0.06675715970537839, 0.030205876298983067, 0.04280976712877456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bfe8f7c-21af-43ce-8cc3-b39bbbbf57cd", 3, 0, 0.0, 258.6666666666667, 195, 384, 197.0, 384.0, 384.0, 384.0, 0.05014290728576443, 0.032563509126009124, 0.032155445101873674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/954d95f7-9a58-4b4f-a48e-e34ff417e2da", 3, 0, 0.0, 378.0, 212, 705, 217.0, 705.0, 705.0, 705.0, 0.04511413877109086, 0.02953272560828897, 0.028930616334325844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 893.2857142857143, 206, 1324, 1171.5, 1317.5, 1324.0, 1324.0, 0.07878446820483961, 60.635216261606644, 0.1642295652785594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/317eb3a6-10ee-4b48-9e3f-fe53cc741288", 3, 0, 0.0, 794.6666666666666, 199, 1919, 266.0, 1919.0, 1919.0, 1919.0, 0.025336767872978335, 0.025410996685106203, 0.01624786221021072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ab9b700-cd26-4592-bed6-1bc6a5282e22", 3, 0, 0.0, 398.0, 211, 634, 349.0, 634.0, 634.0, 634.0, 0.024317292026359943, 0.02438853409284342, 0.015594096774716501], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c267de0f-03fd-43fa-85e2-b0e565d948f7", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14199eb5-e278-4612-8725-88361e1c93e7", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f472140-bc32-47ce-8c95-b920c3adca91", 1, 0, 0.0, 1016.0, 1016, 1016, 1016.0, 1016.0, 1016.0, 1016.0, 0.984251968503937, 0.17781895915354332, 0.678595595472441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 319.83333333333337, 206, 614, 210.5, 613.1, 614.0, 614.0, 0.08627838199274303, 0.13371464084226872, 0.194042103251257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, 43.75, 719.8125, 102, 1516, 1004.0, 1364.8000000000002, 1516.0, 1516.0, 0.0846995547979651, 57.00810444050651, 0.13189329477297873], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 863.8749999999999, 128, 1493, 818.0, 1427.0, 1483.25, 1493.0, 0.10072691255225209, 0.03118206179596085, 0.045445149999160606], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 132.8235294117647, 103, 314, 107.0, 310.0, 314.0, 314.0, 0.0819723512081278, 0.0636406437602164, 0.02913860921851418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 366.89473684210526, 206, 1424, 212.0, 610.0, 1424.0, 1424.0, 0.10063985762108564, 6.484618737155176, 0.22498615374327302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5d8ff6f-d09c-4e12-9944-be5406a443eb", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.0973743556701032, 2.0504456615120277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 284.8125, 204, 604, 208.5, 487.8000000000001, 604.0, 604.0, 0.09317439334734831, 0.14440211156468924, 0.20955139441303045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 105.2, 103, 110, 103.0, 110.0, 110.0, 110.0, 0.062808546987074, 0.04667705493863605, 0.03152694643687113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbe9c5e0-ddb0-409d-ab76-009a36ea466f", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 1.6985954122340425, 3.173828125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 142.4, 102, 303, 102.0, 303.0, 303.0, 303.0, 0.06281012499214873, 0.016806615476414797, 0.03582139940958482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 263.4, 103, 305, 304.0, 305.0, 305.0, 305.0, 0.06280933597970002, 0.016929078838278523, 0.03692501978494084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 102.2, 101, 104, 102.0, 104.0, 104.0, 104.0, 0.06281012499214873, 0.016929291501790088, 0.036986821650650085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 164.5, 106, 318, 117.0, 318.0, 318.0, 318.0, 0.048304511641387306, 0.014246057144237271, 0.029860113153318518], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1176.0185185185187, 803, 1818, 1111.0, 1626.5, 1756.5, 1818.0, 0.23733342709468724, 283.93328925450936, 0.46864081014204845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 863.8749999999999, 128, 1493, 818.0, 1427.0, 1483.25, 1493.0, 0.10211592710624737, 0.03161205946550822, 0.04607183429988895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 132.57142857142858, 102, 307, 104.0, 307.0, 307.0, 307.0, 0.06227758007117438, 0.01678575400355872, 0.0366732234208185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 102.71428571428572, 101, 104, 103.0, 104.0, 104.0, 104.0, 0.06227758007117438, 0.01678575400355872, 0.036612405471530246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 197.64705882352942, 100, 1115, 103.0, 467.7999999999994, 1115.0, 1115.0, 0.07868512527134797, 4.18472609621108, 0.045860482594387436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 167.64705882352942, 101, 804, 103.0, 404.7999999999996, 804.0, 804.0, 0.07868548947003008, 1.3809104518629947, 0.04593753616061097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 103.05882352941177, 101, 105, 103.0, 105.0, 105.0, 105.0, 0.07868403269552982, 0.05847514539189277, 0.039495696099123366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 103.0, 102, 104, 103.0, 104.0, 104.0, 104.0, 0.062278134147100955, 0.016664266363579747, 0.03551799838076851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 126.47058823529412, 100, 307, 102.0, 304.6, 307.0, 307.0, 0.07868512527134797, 0.02800626356739844, 0.04448638573762677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 103.85714285714286, 103, 105, 104.0, 105.0, 105.0, 105.0, 0.062275917902547086, 0.04628122414437337, 0.03125959160342695], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 614.4285714285716, 102, 1919, 509.5, 1558.0, 1919.0, 1919.0, 0.08373906906080653, 0.01668823383835967, 0.056980651415190264], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 105.28571428571429, 104, 107, 105.0, 107.0, 107.0, 107.0, 0.060753868719568824, 0.047819939636691865, 0.02159610177140923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1325.6521739130435, 628, 1992, 1236.0, 1829.2, 1960.7999999999995, 1992.0, 0.10951650842324798, 0.05668334908625139, 0.050373315886083785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 237.28571428571428, 206, 411, 209.0, 411.0, 411.0, 411.0, 0.06221890388068192, 0.09642714888539278, 0.13993177308321333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10f9e592-bc70-4070-ac5e-e203bdbf6496", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["addBook", 54, 16, 29.62962962962963, 1036.4444444444443, 519, 2652, 827.5, 1846.0, 2391.0, 2652.0, 0.2483546504408295, 78.07970006864247, 0.9004832280125649], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 178.51851851851848, 101, 828, 104.0, 413.5, 545.5, 828.0, 0.23850115275557165, 0.1772454855927637, 0.11529108458399216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e018548-2b81-4bf8-a138-5f81aa225739", 1, 0, 0.0, 2364.0, 2364, 2364, 2364.0, 2364.0, 2364.0, 2364.0, 0.4230118443316413, 0.07642303828257191, 0.2916468379864636], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 657.4814814814815, 498, 1015, 607.5, 817.0, 908.75, 1015.0, 0.23856121083067897, 70.14491696192297, 0.119979515212695], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 155.29629629629628, 100, 421, 106.0, 308.5, 336.0, 421.0, 0.2390861595678739, 0.42307043079783935, 0.11627432369609492], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 995.7962962962965, 699, 1301, 1002.5, 1194.0, 1227.75, 1301.0, 0.2382349437721415, 214.36422117853502, 0.11958277451062573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 110.5, 102, 141, 106.0, 138.2, 141.0, 141.0, 0.09988762642027718, 0.07462308028467973, 0.0355069297040829], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 16, 9.876543209876543, 168.64197530864203, 102, 2019, 109.0, 295.6000000000005, 328.09999999999997, 1392.7800000000045, 0.6758673631159989, 1.5629677226398877, 0.3211559652595831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 105.6, 104, 110, 105.0, 110.0, 110.0, 110.0, 0.061567256070531456, 0.047678548890558045, 0.021885235556321724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 120.16666666666667, 103, 308, 107.5, 139.70000000000027, 308.0, 308.0, 0.0883353208780531, 0.07168618325162315, 0.031400446093370435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14199eb5-e278-4612-8725-88361e1c93e7", 3, 0, 0.0, 1040.6666666666667, 293, 1632, 1197.0, 1632.0, 1632.0, 1632.0, 0.02162458282575632, 0.02555952481781289, 0.013867326877193996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=954d95f7-9a58-4b4f-a48e-e34ff417e2da", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bfe8f7c-21af-43ce-8cc3-b39bbbbf57cd", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=384b3ffa-494a-40c6-be61-b82eee3fc380", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 0.679188204887218, 2.5919290413533833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 369.0, 206, 412, 408.0, 412.0, 412.0, 412.0, 0.06272738677706688, 0.09721519806172375, 0.141075363034751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 326.1764705882353, 205, 1220, 209.0, 571.1999999999994, 1220.0, 1220.0, 0.07864653932095653, 5.649340670207303, 0.17569423642306287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f6ad887-36a1-415b-9e9d-a9d34b29da37", 3, 0, 0.0, 486.6666666666667, 422, 520, 518.0, 520.0, 520.0, 520.0, 0.025136996631642452, 0.025210640176461716, 0.016119753699328002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 123.5833333333333, 103, 305, 107.0, 248.0000000000002, 305.0, 305.0, 0.06271722371756344, 0.0519989481798939, 0.022294013118352628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=317eb3a6-10ee-4b48-9e3f-fe53cc741288", 1, 0, 0.0, 818.0, 818, 818, 818.0, 818.0, 818.0, 818.0, 1.2224938875305624, 0.2208607121026895, 0.8428522310513448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 155.50000000000003, 105, 310, 115.5, 308.5, 310.0, 310.0, 0.0780696716055028, 0.060610731373412816, 0.027751328578518572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f472140-bc32-47ce-8c95-b920c3adca91", 3, 0, 0.0, 539.3333333333334, 220, 973, 425.0, 973.0, 973.0, 973.0, 0.028801013795685608, 0.024010220159749626, 0.018469400122884325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ab9b700-cd26-4592-bed6-1bc6a5282e22", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 117.81249999999999, 101, 300, 104.0, 182.40000000000012, 300.0, 300.0, 0.09323085708292303, 0.06928582250010197, 0.0467975200592016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 165.75000000000003, 100, 305, 103.0, 305.0, 305.0, 305.0, 0.09323194359467411, 0.02494682865716866, 0.053171342831337585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 127.74999999999999, 101, 305, 103.0, 305.0, 305.0, 305.0, 0.09323140033563304, 0.025128775871713593, 0.05480986621294051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 127.75, 101, 306, 103.0, 304.6, 306.0, 306.0, 0.09323194359467411, 0.025128922297002008, 0.05490123240975439], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 24.390243902439025, 0.7886435331230284], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.75609756097561, 0.31545741324921134], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.317073170731708, 0.23659305993690852], "isController": false}, {"data": ["401/Unauthorized", 24, 58.53658536585366, 1.8927444794952681], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1268, 41, "401/Unauthorized", 24, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
