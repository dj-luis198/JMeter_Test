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

    var data = {"OkPercent": 99.52076677316293, "KoPercent": 0.4792332268370607};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.71866391184573, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2f875b4-b01f-425f-808a-5afe395ae604"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9eb5835-e025-459b-b061-1094b6cc68f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7150ff49-4c80-4167-9be7-b25219fb2965"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/372a2ab7-5c7f-4671-9502-4c7413d965c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/696a2944-76e0-4ad7-b843-d7007fbaa6ad"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7150ff49-4c80-4167-9be7-b25219fb2965"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f9eb5835-e025-459b-b061-1094b6cc68f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7832e5bf-1aa1-4f0f-a212-974781d0881c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23da83d0-db3e-4cd8-a234-976b5fe4c56a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1dfa8626-f8ee-43da-b984-210c7ef52fb4"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a633134-9f1a-40b7-9fe0-157062cdcec4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/b2da6d8b-c6ac-4e44-954e-377a16b86e0c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e450e1f-a6e0-4f24-aa33-e011aa9a2c84"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=915917d3-cea1-4fc7-8bfd-e686ddd4f6b1"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af197ed1-4f9d-4683-acb5-05d42433df3a"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fcc9f062-5286-4fea-bcb1-128a3934d30f"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1dfa8626-f8ee-43da-b984-210c7ef52fb4"], "isController": false}, {"data": [0.2037037037037037, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a2f875b4-b01f-425f-808a-5afe395ae604"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b026a31b-cc24-464c-9637-6141c2ae6d42"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=372a2ab7-5c7f-4671-9502-4c7413d965c2"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7e4c7870-7cc7-40f7-ac52-3ad6048598ab"], "isController": false}, {"data": [0.8981481481481481, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.4537037037037037, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.26851851851851855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=696a2944-76e0-4ad7-b843-d7007fbaa6ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5e450e1f-a6e0-4f24-aa33-e011aa9a2c84"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/39a6fa11-ac11-4859-bf63-37eed210dde6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b026a31b-cc24-464c-9637-6141c2ae6d42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/5a633134-9f1a-40b7-9fe0-157062cdcec4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/23da83d0-db3e-4cd8-a234-976b5fe4c56a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/af197ed1-4f9d-4683-acb5-05d42433df3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/915917d3-cea1-4fc7-8bfd-e686ddd4f6b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1252, 6, 0.4792332268370607, 629.4992012779545, 137, 27839, 228.5, 1568.5000000000002, 2056.149999999999, 4540.310000000002, 4.8234546260089, 657.6055318814651, 3.5253656056768055], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2f875b4-b01f-425f-808a-5afe395ae604", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["see books", 54, 0, 0.0, 3146.203703703705, 2021, 15447, 2654.0, 5146.0, 5997.5, 15447.0, 0.2409047311012469, 289.8893335178225, 1.1845266807566193], "isController": true}, {"data": ["deleteBook", 12, 0, 0.0, 739.0833333333334, 466, 1386, 597.0, 1341.0000000000002, 1386.0, 1386.0, 0.08076946375806852, 0.014592139448479178, 0.054897994898062207], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 739.0833333333334, 466, 1386, 597.0, 1341.0000000000002, 1386.0, 1386.0, 0.07936245494527297, 0.01433794352038623, 0.05394166859561522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 180.23529411764707, 139, 440, 145.0, 433.6, 440.0, 440.0, 0.09583349775355006, 0.03410985478406458, 0.05418159954563648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 165.5294117647059, 142, 432, 150.0, 215.9999999999998, 432.0, 432.0, 0.09583295751781365, 0.07121961003032831, 0.048103652504058805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 265.3529411764706, 139, 1141, 146.0, 716.9999999999997, 1141.0, 1141.0, 0.09567169974843971, 1.6790141488595371, 0.055854290242612174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 278.7058823529411, 140, 1640, 147.0, 815.9999999999993, 1640.0, 1640.0, 0.09583079663577533, 5.096587622113803, 0.0558535881586958], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 331.0833333333333, 240, 619, 286.0, 549.7000000000003, 619.0, 619.0, 0.0807602228982152, 0.21442075781691658, 0.05221022222521334], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9eb5835-e025-459b-b061-1094b6cc68f6", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 162.59090909090912, 140, 449, 150.0, 158.7, 405.4999999999994, 449.0, 0.11317221724950359, 0.08410552473327366, 0.05680714811156723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7150ff49-4c80-4167-9be7-b25219fb2965", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 198.22727272727275, 139, 442, 147.5, 431.0, 440.34999999999997, 442.0, 0.11317512822227595, 0.03800972212933859, 0.06411314747748072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1717.0, 1190, 2638, 1323.0, 2638.0, 2638.0, 2638.0, 0.07311366738155586, 21.497845812414702, 0.04169763842854358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1483.0, 1316, 1576, 1557.0, 1576.0, 1576.0, 1576.0, 0.07269907429845393, 65.41475484509039, 0.041390195621092425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 344.0, 144, 452, 436.0, 452.0, 452.0, 452.0, 0.0747291069871715, 0.1322354900983933, 0.04137832388840453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 158.99999999999997, 139, 279, 148.0, 254.2000000000001, 279.0, 279.0, 0.061356537260151715, 0.04559797349118697, 0.030798105616912094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 255.8181818181818, 143, 450, 151.0, 450.0, 450.0, 450.0, 0.06125471939769905, 0.024754215438416733, 0.03446665585428059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 595.7272727272727, 139, 4444, 154.0, 3644.400000000003, 4444.0, 4444.0, 0.059921992460723855, 4.916311149371909, 0.034759437032880834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 321.45454545454544, 142, 1136, 164.0, 998.6000000000005, 1136.0, 1136.0, 0.06102161274575067, 1.6460775064627435, 0.035456894124728175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/372a2ab7-5c7f-4671-9502-4c7413d965c2", 3, 0, 0.0, 523.0, 262, 838, 469.0, 838.0, 838.0, 838.0, 0.01928627909817359, 0.02658769270207199, 0.01236782871855533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 148.33333333333334, 143, 156, 146.0, 156.0, 156.0, 156.0, 0.07525209451663072, 0.05592465227261326, 0.04225581479205338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 267.45454545454544, 140, 1637, 149.0, 445.5, 1458.9499999999975, 1637.0, 0.11300769993373638, 4.651098558445528, 0.0659947310159906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1221.9285714285716, 144, 1833, 1564.0, 1813.0, 1833.0, 1833.0, 0.07377118286822358, 47.41956676884853, 0.03884102178357642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/696a2944-76e0-4ad7-b843-d7007fbaa6ad", 3, 0, 0.0, 562.0, 320, 978, 388.0, 978.0, 978.0, 978.0, 0.01805499551634278, 0.02134039346348979, 0.011578236057029713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 252.0454545454545, 139, 1332, 147.5, 445.7, 1199.5499999999981, 1332.0, 0.11300537802867254, 1.5394073349479405, 0.06610373187419419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 792.5000000000001, 140, 1343, 850.0, 1293.0, 1343.0, 1343.0, 0.07377273781168982, 15.499705732405202, 0.038913884160993194], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 665.9166666666666, 427, 1015, 577.0, 1002.1, 1015.0, 1015.0, 0.07982385535917409, 0.01442130199360079, 0.055034806526930574], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 837.4545454545455, 288, 4599, 575.0, 3823.800000000003, 4599.0, 4599.0, 0.059872417321634626, 6.596011969720886, 0.13326184079107792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7150ff49-4c80-4167-9be7-b25219fb2965", 3, 0, 0.0, 1083.6666666666667, 258, 1962, 1031.0, 1962.0, 1962.0, 1962.0, 0.021472590238560477, 0.025379874725329786, 0.013769857672514369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 647.3, 230, 1044, 664.5, 881.9000000000001, 1036.1, 1044.0, 0.09106680205264572, 0.055938494620228665, 0.04117571225622555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 146.42857142857142, 139, 161, 145.5, 156.0, 161.0, 161.0, 0.07377273781168982, 0.054825247533882765, 0.03703045628438337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 278.6428571428571, 142, 577, 149.0, 509.5, 577.0, 577.0, 0.07377196033176305, 0.09888406736433863, 0.037647576854574386], "isController": false}, {"data": ["login", 20, 0, 0.0, 3762.7999999999997, 1960, 6318, 3624.5, 5621.600000000001, 6286.0, 6318.0, 0.09000738060520963, 16.278322615423214, 0.15818972937030837], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f9eb5835-e025-459b-b061-1094b6cc68f6", 3, 0, 0.0, 1033.0, 240, 2408, 451.0, 2408.0, 2408.0, 2408.0, 0.017192666754540297, 0.02370147907079367, 0.011025245282045699], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 164.59090909090907, 141, 354, 152.0, 212.69999999999996, 335.5499999999997, 354.0, 0.11236414153795865, 0.09096667317867942, 0.03994194093732124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7832e5bf-1aa1-4f0f-a212-974781d0881c", 1, 0, 0.0, 720.0, 720, 720, 720.0, 720.0, 720.0, 720.0, 1.3888888888888888, 0.4435221354166667, 0.8287217881944444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23da83d0-db3e-4cd8-a234-976b5fe4c56a", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1dfa8626-f8ee-43da-b984-210c7ef52fb4", 1, 0, 0.0, 834.0, 834, 834, 834.0, 834.0, 834.0, 834.0, 1.199040767386091, 0.21662357613908872, 0.8266824040767387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1369.9999999999998, 297, 1980, 1710.5, 1956.5, 1980.0, 1980.0, 0.07371486038931978, 63.02449850859042, 0.1523145643451751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a633134-9f1a-40b7-9fe0-157062cdcec4", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2da6d8b-c6ac-4e44-954e-377a16b86e0c", 1, 0, 0.0, 2942.0, 2942, 2942, 2942.0, 2942.0, 2942.0, 2942.0, 0.3399048266485384, 0.10854382647858599, 0.20281430574439155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e450e1f-a6e0-4f24-aa33-e011aa9a2c84", 1, 0, 0.0, 972.0, 972, 972, 972.0, 972.0, 972.0, 972.0, 1.02880658436214, 0.18586837705761317, 0.7093139146090535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 508.2352941176471, 287, 1787, 305.0, 1190.9999999999995, 1787.0, 1787.0, 0.09559369306552105, 6.866689147585415, 0.21355371838379178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 2072.6666666666665, 1700, 2795, 1723.0, 2795.0, 2795.0, 2795.0, 0.07242353281993096, 86.64372374646935, 0.16330657937619197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=915917d3-cea1-4fc7-8bfd-e686ddd4f6b1", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 4393.190476190476, 386, 27839, 1498.0, 20339.600000000006, 27250.19999999999, 27839.0, 0.08623344625808439, 0.02738104404065291, 0.03890610563597167], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af197ed1-4f9d-4683-acb5-05d42433df3a", 1, 0, 0.0, 1015.0, 1015, 1015, 1015.0, 1015.0, 1015.0, 1015.0, 0.9852216748768472, 0.17799415024630544, 0.6792641625615764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 189.3529411764706, 141, 777, 152.0, 291.3999999999996, 777.0, 777.0, 0.08368530387610637, 0.06497052400537555, 0.029747510362209687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 496.77272727272725, 293, 1784, 311.0, 806.6999999999998, 1651.3999999999983, 1784.0, 0.11291721628266259, 6.307419968319022, 0.2526402418994729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 566.421052631579, 296, 908, 587.0, 906.0, 908.0, 908.0, 0.14254846647860273, 0.2209222815444751, 0.3205948420900606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fcc9f062-5286-4fea-bcb1-128a3934d30f", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 202.14285714285717, 140, 535, 149.0, 535.0, 535.0, 535.0, 0.05166204168388735, 0.03839337277484206, 0.025931923267107516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 188.85714285714286, 145, 437, 149.0, 437.0, 437.0, 437.0, 0.05166432947080966, 0.013824244409181488, 0.02946481290132113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 226.57142857142858, 137, 431, 149.0, 431.0, 431.0, 431.0, 0.05166432947080966, 0.013925151302679163, 0.030372974942800203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 187.85714285714286, 142, 442, 148.0, 442.0, 442.0, 442.0, 0.05166738016858328, 0.013925973561063463, 0.030425224845366913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1dfa8626-f8ee-43da-b984-210c7ef52fb4", 3, 0, 0.0, 1143.3333333333333, 291, 2151, 988.0, 2151.0, 2151.0, 2151.0, 0.017304930174606745, 0.02385624325828762, 0.011097237123689874], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 2038.055555555556, 1138, 4973, 1714.0, 3134.5, 4756.5, 4973.0, 0.24173403883860226, 289.19795080040825, 0.4773302993473181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 4393.190476190476, 386, 27839, 1498.0, 20339.600000000006, 27250.19999999999, 27839.0, 0.08542975233507989, 0.027125853280502488, 0.038543501541803624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2f875b4-b01f-425f-808a-5afe395ae604", 3, 0, 0.0, 1120.6666666666667, 252, 2326, 784.0, 2326.0, 2326.0, 2326.0, 0.01758870570577613, 0.02424745073696677, 0.011279215573040033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 326.4, 145, 451, 434.0, 451.0, 451.0, 451.0, 0.03969230524970429, 0.01069831664933436, 0.02337349615778485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 204.2, 142, 438, 148.0, 438.0, 438.0, 438.0, 0.03969135998475852, 0.010698061870891945, 0.023334178428539677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 446.3529411764706, 142, 4362, 149.0, 1231.5999999999972, 4362.0, 4362.0, 0.08235715877491304, 4.380016557725101, 0.048000673996453795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 316.9411764705882, 138, 2257, 144.0, 793.7999999999987, 2257.0, 2257.0, 0.08224479922593131, 1.443375438437349, 0.04801550405176585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 180.76470588235293, 143, 428, 150.0, 418.4, 428.0, 428.0, 0.08235157339947295, 0.06120072984081926, 0.041336629616532325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 264.4, 148, 441, 152.0, 441.0, 441.0, 441.0, 0.03969009970153045, 0.010620202459198577, 0.022635759986029087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 237.41176470588235, 138, 575, 147.0, 467.7999999999999, 575.0, 575.0, 0.0822392290797914, 0.029271269725320976, 0.046495777378406884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 210.4, 147, 444, 152.0, 444.0, 444.0, 444.0, 0.03969041476483429, 0.029496489878944238, 0.019922727723754714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 154.8, 153, 160, 154.0, 160.0, 160.0, 160.0, 0.036862554280111176, 0.029014862060321882, 0.013103486091758269], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 1081.909090909091, 451, 2567, 838.0, 2446.0000000000005, 2567.0, 2567.0, 0.0843810648890389, 0.01524462598092988, 0.057435158425449336], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b026a31b-cc24-464c-9637-6141c2ae6d42", 2, 0, 0.0, 311.0, 256, 366, 311.0, 366.0, 366.0, 366.0, 0.031950412959087494, 0.03678665710816812, 0.01985980258638593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1820.95, 784, 3946, 1696.5, 2905.8000000000006, 3895.149999999999, 3946.0, 0.0898089314982375, 0.04648313837311121, 0.0413086003278026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 539.8, 303, 885, 595.0, 885.0, 885.0, 885.0, 0.03964289678575393, 0.06143874726464012, 0.089157804001554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=372a2ab7-5c7f-4671-9502-4c7413d965c2", 1, 0, 0.0, 921.0, 921, 921, 921.0, 921.0, 921.0, 921.0, 1.0857763300760044, 0.19616076275787186, 0.7485918838219326], "isController": false}, {"data": ["addBook", 58, 2, 3.4482758620689653, 1634.758620689655, 740, 5338, 1264.5, 2594.3, 4139.999999999997, 5338.0, 0.28689436846140526, 83.8756061339129, 1.0463828664086268], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7e4c7870-7cc7-40f7-ac52-3ad6048598ab", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.5891806964944649, 1.1008850322878228], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 259.8148148148148, 140, 607, 152.0, 583.5, 598.25, 607.0, 0.24307462390954024, 0.18064432499527355, 0.11750189339377189], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 1078.2037037037042, 687, 2791, 882.5, 1560.0, 2348.75, 2791.0, 0.24276536727253112, 71.38107854695936, 0.12209391029819679], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 216.07407407407402, 139, 495, 152.5, 443.0, 449.0, 495.0, 0.24356470476800463, 0.43099535648400816, 0.11845236618600224], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1752.6851851851848, 990, 4821, 1476.0, 2815.0, 4606.25, 4821.0, 0.24239486122894194, 218.107322218519, 0.12167085807780875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 184.5263157894737, 145, 459, 154.0, 417.0, 459.0, 459.0, 0.13529968881071575, 0.10107838080097416, 0.04809481125693411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 2, 1.1764705882352942, 348.37058823529424, 142, 12579, 159.0, 446.8, 600.0499999999997, 6091.729999999927, 0.7046807381737992, 1.4300428521020212, 0.3411880515681219], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 154.7142857142857, 150, 160, 155.0, 160.0, 160.0, 160.0, 0.05049521377509432, 0.03910420363637675, 0.01794947052161556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=696a2944-76e0-4ad7-b843-d7007fbaa6ad", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 159.58823529411768, 142, 258, 153.0, 192.39999999999995, 258.0, 258.0, 0.0927441352973268, 0.07526403948445172, 0.03296764184397163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e450e1f-a6e0-4f24-aa33-e011aa9a2c84", 3, 0, 0.0, 832.0, 265, 1792, 439.0, 1792.0, 1792.0, 1792.0, 0.04613468251649315, 0.029660155589216787, 0.029585066587725098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 434.2857142857143, 289, 973, 300.0, 973.0, 973.0, 973.0, 0.05160529322864831, 0.07997812534557115, 0.11606151397029009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 702.7058823529411, 288, 4506, 312.0, 1694.7999999999975, 4506.0, 4506.0, 0.08217602103706138, 5.902870511134851, 0.18357900287857767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39a6fa11-ac11-4859-bf63-37eed210dde6", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.6737045094936709, 1.2588179061181435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b026a31b-cc24-464c-9637-6141c2ae6d42", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 152.8181818181818, 146, 160, 155.0, 159.4, 160.0, 160.0, 0.06190347559877543, 0.05132426834312534, 0.022004751091752206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 173.42857142857142, 145, 445, 149.5, 306.5, 445.0, 445.0, 0.0718453477571422, 0.05577837057317192, 0.025538775960546642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a633134-9f1a-40b7-9fe0-157062cdcec4", 3, 0, 0.0, 1244.0, 506, 2607, 619.0, 2607.0, 2607.0, 2607.0, 0.02852361755533582, 0.028607182841142467, 0.018291512559899598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23da83d0-db3e-4cd8-a234-976b5fe4c56a", 3, 0, 0.0, 962.0, 281, 2073, 532.0, 2073.0, 2073.0, 2073.0, 0.019642377775304292, 0.02321662555407874, 0.012596186268668444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af197ed1-4f9d-4683-acb5-05d42433df3a", 3, 0, 0.0, 1056.0, 238, 2567, 363.0, 2567.0, 2567.0, 2567.0, 0.03620521113672294, 0.022946466823958196, 0.023217534485463605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 225.3684210526316, 140, 464, 147.0, 448.0, 464.0, 464.0, 0.14271121259464006, 0.10605784451613388, 0.07163433913441894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/915917d3-cea1-4fc7-8bfd-e686ddd4f6b1", 3, 0, 0.0, 441.0, 388, 503, 432.0, 503.0, 503.0, 503.0, 0.07169829358061279, 0.03244161070216529, 0.04597839790162994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 241.4736842105264, 140, 450, 146.0, 444.0, 450.0, 450.0, 0.14271442842871415, 0.03818725916940202, 0.08139182246325102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 287.6315789473683, 143, 452, 227.0, 450.0, 452.0, 452.0, 0.14271121259464006, 0.03846513151964908, 0.08389858396677083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 270.9473684210526, 139, 465, 152.0, 441.0, 465.0, 465.0, 0.1427122845232283, 0.03846542043790138, 0.08403858160889323], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 66.66666666666667, 0.3194888178913738], "isController": false}, {"data": ["401/Unauthorized", 2, 33.333333333333336, 0.1597444089456869], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1252, 6, "406/Not Acceptable", 4, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
