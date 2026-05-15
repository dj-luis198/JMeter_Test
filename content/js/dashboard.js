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

    var data = {"OkPercent": 98.53054911059552, "KoPercent": 1.4694508894044858};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7498332221480988, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=edc41fe1-f102-4791-b231-f30b71844456"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13af4a94-e894-4f99-a047-d3d987c5f411"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbf8e2b9-395d-4fa6-8e54-3fe684869b5b"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/015bb419-bf03-46d6-ba34-3a308ce2157c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0af374fa-a9d6-45cb-a6ee-79045c886600"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac2fca92-56ec-4282-927b-2a33e862be2f"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bd0bd8a-9272-46c5-a131-bebcc4ca8041"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd9f588c-c33f-4c6c-94d7-2ecd525abbb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3bd0bd8a-9272-46c5-a131-bebcc4ca8041"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d3f377f7-e292-4546-9ad4-731f79d0a731"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/673b6878-546f-4255-b882-072c713e6752"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/940df076-550d-40ee-ad3a-68365dbf20f9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d9cac685-ddb0-45d4-a399-a1d47eeaea6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/edc41fe1-f102-4791-b231-f30b71844456"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [0.8409090909090909, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd9f588c-c33f-4c6c-94d7-2ecd525abbb0"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fbf8e2b9-395d-4fa6-8e54-3fe684869b5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c845163-dace-4e0e-b45d-62e547676770"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13af4a94-e894-4f99-a047-d3d987c5f411"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=940df076-550d-40ee-ad3a-68365dbf20f9"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9428571428571428, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=015bb419-bf03-46d6-ba34-3a308ce2157c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c294cbd0-24d9-4eb4-8cc1-c8b48b23ef3f"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/63a5e0a1-bc3e-4ee7-bc6d-97a06db9a234"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac2fca92-56ec-4282-927b-2a33e862be2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3f377f7-e292-4546-9ad4-731f79d0a731"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d41b23af-b7e0-4b8c-8d8f-2718b79ccf05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=673b6878-546f-4255-b882-072c713e6752"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9cac685-ddb0-45d4-a399-a1d47eeaea6b"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1293, 19, 1.4694508894044858, 456.40139211136807, 124, 5056, 152.0, 1271.2000000000003, 1521.3, 2102.5399999999995, 5.063182090510743, 715.3526678072369, 3.7003318430296077], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2330.8363636363633, 1636, 6406, 2228.0, 2732.6, 2871.399999999999, 6406.0, 0.24227473955465498, 291.5386106438451, 1.191263001618836], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=edc41fe1-f102-4791-b231-f30b71844456", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 0.8101527466367713, 3.0917180493273544], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 478.41666666666663, 129, 620, 498.0, 606.2, 620.0, 620.0, 0.07870968588276192, 0.014969444653972543, 0.053184124502325215], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 478.41666666666663, 129, 620, 498.0, 606.2, 620.0, 620.0, 0.07875566056310297, 0.014978188373695609, 0.05321518958784537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 184.75000000000003, 128, 420, 134.0, 406.7, 420.0, 420.0, 0.12021307768018814, 0.04345104040662073, 0.06792801960224497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 151.56250000000003, 127, 383, 137.0, 217.10000000000016, 383.0, 383.0, 0.1199868014518403, 0.08916987881333052, 0.060227749947505765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 256.4375, 126, 971, 142.0, 596.5000000000003, 971.0, 971.0, 0.12021940040574047, 2.239658666128184, 0.07014755052971673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 230.875, 126, 1387, 140.5, 693.3000000000006, 1387.0, 1387.0, 0.12021217448797127, 6.790821248722745, 0.07002593953327622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13af4a94-e894-4f99-a047-d3d987c5f411", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 0.2307331577266922, 0.8805276181353767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbf8e2b9-395d-4fa6-8e54-3fe684869b5b", 1, 0, 0.0, 693.0, 693, 693, 693.0, 693.0, 693.0, 693.0, 1.443001443001443, 0.2606985028860029, 0.9948818542568544], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 279.6666666666667, 126, 413, 262.0, 404.00000000000006, 413.0, 413.0, 0.0790263948158685, 0.1552166372787261, 0.051082898276566036], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/015bb419-bf03-46d6-ba34-3a308ce2157c", 3, 0, 0.0, 417.33333333333337, 242, 706, 304.0, 706.0, 706.0, 706.0, 0.045724040176189966, 0.02939615213150234, 0.029321731493194735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 148.77272727272725, 128, 399, 138.0, 143.7, 360.74999999999943, 399.0, 0.12438021902225842, 0.09243490886322132, 0.06243303962640705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 159.54545454545453, 127, 429, 135.0, 308.0999999999998, 421.3499999999999, 429.0, 0.12437881263462593, 0.041772465216334334, 0.07045997899694141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 872.4, 631, 1049, 1006.0, 1049.0, 1049.0, 1049.0, 0.06002040693835904, 17.64799250495168, 0.03423038833203289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0af374fa-a9d6-45cb-a6ee-79045c886600", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac2fca92-56ec-4282-927b-2a33e862be2f", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1413.6, 1157, 1637, 1391.0, 1637.0, 1637.0, 1637.0, 0.059700066864074884, 53.71822510581837, 0.03398939353687076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bd0bd8a-9272-46c5-a131-bebcc4ca8041", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 275.0, 134, 542, 161.0, 542.0, 542.0, 542.0, 0.060646491600460914, 0.1073158620898781, 0.03358062572017709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 154.46153846153845, 125, 394, 134.0, 293.9999999999999, 394.0, 394.0, 0.06965168798186913, 0.05176263140058829, 0.03496188244402415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 192.00000000000003, 124, 394, 134.0, 392.8, 394.0, 394.0, 0.06965877914951989, 0.03473519951881859, 0.03882723417138203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 410.99999999999994, 127, 1452, 140.0, 1425.6, 1452.0, 1452.0, 0.06965579321874062, 9.658409915636119, 0.04002905785181533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 271.2307692307692, 127, 791, 134.0, 779.0, 791.0, 791.0, 0.06965653967743664, 3.1668609012484596, 0.040097510783368165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd9f588c-c33f-4c6c-94d7-2ecd525abbb0", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 135.4, 129, 142, 132.0, 142.0, 142.0, 142.0, 0.060681084492342045, 0.04509600126823467, 0.03407385115536785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1121.5999999999997, 141, 1681, 1507.0, 1655.8, 1681.0, 1681.0, 0.07228915662650602, 43.370434864457835, 0.038356551204819275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 237.5909090909091, 127, 1297, 137.5, 421.4, 1165.7499999999982, 1297.0, 0.12438092222800154, 5.119190359701147, 0.07263651512924309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 808.5333333333334, 127, 1270, 1045.0, 1264.0, 1270.0, 1270.0, 0.07238439006500118, 14.195445996419386, 0.03847776984900616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 216.90909090909093, 126, 1117, 140.5, 397.7, 1009.1499999999985, 1117.0, 0.12437951582446659, 1.6943506788577438, 0.07275715818247606], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 460.58333333333326, 130, 783, 452.0, 757.5000000000001, 783.0, 783.0, 0.07894425220057104, 0.015014055777403524, 0.0539593729030433], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 570.0, 258, 1582, 285.0, 1557.6, 1582.0, 1582.0, 0.06960209020430891, 12.901781621099605, 0.1537969864302694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bd0bd8a-9272-46c5-a131-bebcc4ca8041", 3, 0, 0.0, 870.3333333333334, 234, 1797, 580.0, 1797.0, 1797.0, 1797.0, 0.02762685330140897, 0.02770779134819044, 0.017716439128833226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 613.2380952380951, 163, 1237, 659.0, 1003.8000000000001, 1214.6999999999996, 1237.0, 0.09638554216867469, 0.05920557228915663, 0.04358057228915663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 471.73333333333335, 128, 4653, 141.0, 2090.4000000000015, 4653.0, 4653.0, 0.07237740473927247, 0.053788286139244475, 0.03633006448826762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 207.73333333333332, 127, 422, 142.0, 410.0, 422.0, 422.0, 0.07228950500966269, 0.09172672217697435, 0.03718014906095933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3f377f7-e292-4546-9ad4-731f79d0a731", 3, 0, 0.0, 378.3333333333333, 222, 500, 413.0, 500.0, 500.0, 500.0, 0.01846562930864684, 0.021825748704328345, 0.011841565669933031], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/673b6878-546f-4255-b882-072c713e6752", 3, 0, 0.0, 350.3333333333333, 230, 471, 350.0, 471.0, 471.0, 471.0, 0.023217657802680865, 0.027442485508311923, 0.014888927692474385], "isController": false}, {"data": ["login", 21, 0, 0.0, 2862.190476190476, 1365, 4615, 2814.0, 4402.6, 4604.0, 4615.0, 0.09880307136404698, 28.279397258626446, 0.1880814604858288], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 156.7272727272727, 130, 425, 145.0, 156.7, 384.79999999999944, 425.0, 0.12459788863214172, 0.10087075163676316, 0.044290655724706626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1594.3333333333333, 276, 5056, 1649.0, 3116.800000000001, 5056.0, 5056.0, 0.07223798080396057, 57.651810938455654, 0.1501430688259402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/940df076-550d-40ee-ad3a-68365dbf20f9", 3, 0, 0.0, 485.6666666666667, 331, 570, 556.0, 570.0, 570.0, 570.0, 0.03606549493880888, 0.023186638184943858, 0.023127937835108556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9cac685-ddb0-45d4-a399-a1d47eeaea6b", 3, 0, 0.0, 348.6666666666667, 247, 527, 272.0, 527.0, 527.0, 527.0, 0.028124648441894474, 0.033242382321783476, 0.018035663226084672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/edc41fe1-f102-4791-b231-f30b71844456", 3, 0, 0.0, 314.6666666666667, 237, 436, 271.0, 436.0, 436.0, 436.0, 0.06992192052208367, 0.0324572456590141, 0.04483925241813309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 471.3125000000001, 262, 1527, 284.0, 1004.1000000000006, 1527.0, 1527.0, 0.11986634902084176, 9.136772947382418, 0.26766542024392803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1142.857142857143, 126, 1770, 1530.0, 1770.0, 1770.0, 1770.0, 0.0804986315232641, 68.79497501667471, 0.1448930446307413], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1044.8636363636363, 344, 1535, 1104.5, 1455.2, 1523.2999999999997, 1535.0, 0.09112032438835482, 0.028669249789801978, 0.04111092760490227], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 413.27272727272725, 261, 1441, 286.0, 742.2999999999998, 1347.8499999999985, 1441.0, 0.12428114655006835, 6.942195452934165, 0.2780658252268131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 144.50000000000006, 134, 167, 144.0, 161.5, 167.0, 167.0, 0.08045884530062872, 0.062465607435546716, 0.028600605165457867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd9f588c-c33f-4c6c-94d7-2ecd525abbb0", 3, 0, 0.0, 633.3333333333334, 253, 1213, 434.0, 1213.0, 1213.0, 1213.0, 0.07361421245061714, 0.03330851409712168, 0.0472070307707408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 568.6666666666666, 268, 1637, 523.5, 1293.2000000000005, 1637.0, 1637.0, 0.1099391059507595, 14.765384985371991, 0.24413018698809602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 133.0, 131, 135, 133.0, 135.0, 135.0, 135.0, 0.07381163271331562, 0.05485415282698554, 0.03704997970180101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 186.2, 132, 397, 133.0, 397.0, 397.0, 397.0, 0.07381381204050902, 0.019750961424901826, 0.0420969396793528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 183.2, 127, 397, 131.0, 397.0, 397.0, 397.0, 0.07381599149639778, 0.01989571645801346, 0.04339572937581197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 183.2, 128, 381, 132.0, 381.0, 381.0, 381.0, 0.07354455329038331, 0.019822555379048628, 0.04330797425205189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 130.0, 130, 130, 130.0, 130.0, 130.0, 130.0, 7.6923076923076925, 2.2686298076923075, 4.755108173076923], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1537.3999999999994, 1042, 2400, 1443.0, 2126.8, 2221.3999999999996, 2400.0, 0.2315116871308967, 276.96846429353155, 0.4571451478307355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1044.8636363636363, 344, 1535, 1104.5, 1455.2, 1523.2999999999997, 1535.0, 0.09168691419355107, 0.028847516326522108, 0.041366556989668554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbf8e2b9-395d-4fa6-8e54-3fe684869b5b", 3, 0, 0.0, 709.3333333333334, 274, 1429, 425.0, 1429.0, 1429.0, 1429.0, 0.02104126191461456, 0.024870059248686675, 0.013493257152275612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 262.9166666666667, 126, 421, 257.5, 420.7, 421.0, 421.0, 0.05793407102717108, 0.015615042581542204, 0.03411547346619547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 220.83333333333331, 128, 421, 138.5, 412.6, 421.0, 421.0, 0.0580066030849845, 0.015634592237749732, 0.034101538141758474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 154.7142857142857, 128, 396, 138.0, 268.5, 396.0, 396.0, 0.07789331953508816, 0.020994683780941728, 0.045792752304807685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 154.57142857142856, 126, 428, 132.5, 286.0, 428.0, 428.0, 0.07800833574787705, 0.02102568424454499, 0.045936549273408074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c845163-dace-4e0e-b45d-62e547676770", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 136.5, 127, 144, 134.5, 144.0, 144.0, 144.0, 0.07800225092209805, 0.05796846967941075, 0.039153473607381244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 177.08333333333331, 127, 398, 136.0, 392.0, 398.0, 398.0, 0.05800688348350671, 0.015521373119610193, 0.03308205073668742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 151.57142857142856, 126, 376, 133.5, 259.0, 376.0, 376.0, 0.07790198817002665, 0.020844867928307913, 0.044428477628218326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 201.91666666666666, 129, 419, 135.0, 413.0, 419.0, 419.0, 0.058007724695338596, 0.043109256340969404, 0.02911715868496488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 164.16666666666669, 130, 435, 139.0, 351.3000000000003, 435.0, 435.0, 0.06050094784818296, 0.04762086324769088, 0.021506196305408787], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 499.66666666666663, 126, 706, 513.5, 693.7, 706.0, 706.0, 0.07915410644908083, 0.014873602847568978, 0.053870914081515536], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/13af4a94-e894-4f99-a047-d3d987c5f411", 3, 0, 0.0, 374.0, 232, 570, 320.0, 570.0, 570.0, 570.0, 0.029547625848263093, 0.02463263990800839, 0.018948184544621837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=940df076-550d-40ee-ad3a-68365dbf20f9", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1495.5238095238094, 897, 3383, 1344.0, 2414.0000000000005, 3296.799999999999, 3383.0, 0.09931144067796611, 0.051401429257150424, 0.045679383358712924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 492.8333333333333, 266, 841, 512.5, 835.0, 841.0, 841.0, 0.05789773330374116, 0.0897301784697629, 0.13021335917823817], "isController": false}, {"data": ["addBook", 60, 9, 15.0, 1305.8666666666659, 654, 2457, 1102.0, 2262.4, 2374.95, 2457.0, 0.2806124835140166, 90.61136033332086, 1.0194308068076587], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 260.4545454545454, 128, 914, 143.0, 567.8, 586.4, 914.0, 0.23254339048263326, 0.17281789077859755, 0.11241111161025728], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 858.5272727272727, 627, 1379, 794.0, 1125.4, 1167.9999999999995, 1379.0, 0.2327342893775839, 68.43160858271165, 0.11704898342720284], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 191.03636363636363, 126, 541, 141.0, 414.2, 426.59999999999997, 541.0, 0.2333425256146454, 0.4129068910290405, 0.11348103296493497], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1275.4363636363635, 886, 1817, 1261.0, 1578.6, 1689.7999999999997, 1817.0, 0.23243823482178327, 209.1483322754752, 0.11667309833827792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 142.22222222222223, 129, 161, 142.0, 152.0, 161.0, 161.0, 0.10905059341697917, 0.08146846090233308, 0.038764078128691815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, 5.142857142857143, 196.40571428571428, 126, 543, 144.0, 346.4000000000001, 396.2, 518.6800000000003, 0.6996613638998724, 1.4913211693040567, 0.3373601551848905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 139.4, 132, 150, 135.0, 150.0, 150.0, 150.0, 0.08059576388665012, 0.06241449293175151, 0.02864927544408266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=015bb419-bf03-46d6-ba34-3a308ce2157c", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 145.56250000000003, 135, 168, 145.5, 161.70000000000002, 168.0, 168.0, 0.12057908103667865, 0.09785275033347651, 0.04286209521225686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c294cbd0-24d9-4eb4-8cc1-c8b48b23ef3f", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 371.2, 265, 531, 280.0, 531.0, 531.0, 531.0, 0.0733977276063533, 0.11375214229617452, 0.16507320964592936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63a5e0a1-bc3e-4ee7-bc6d-97a06db9a234", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 314.7142857142858, 260, 571, 279.0, 550.0, 571.0, 571.0, 0.07783052958116056, 0.12062211957549006, 0.1750426851810672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac2fca92-56ec-4282-927b-2a33e862be2f", 3, 0, 0.0, 435.0, 257, 665, 383.0, 665.0, 665.0, 665.0, 0.039573659772055715, 0.03299093186075348, 0.025377639892887292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3f377f7-e292-4546-9ad4-731f79d0a731", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 160.92307692307693, 128, 432, 136.0, 319.19999999999993, 432.0, 432.0, 0.07086167800453515, 0.05875152795493198, 0.025189112103174604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d41b23af-b7e0-4b8c-8d8f-2718b79ccf05", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 142.06666666666666, 129, 156, 142.0, 154.2, 156.0, 156.0, 0.07041228741356892, 0.05466578954471415, 0.025029367791542075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 193.83333333333334, 131, 402, 137.0, 401.1, 402.0, 402.0, 0.11002983030955059, 0.08177021568903124, 0.055229817167098634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=673b6878-546f-4255-b882-072c713e6752", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 227.0555555555556, 127, 512, 133.5, 428.3000000000001, 512.0, 512.0, 0.11003722926256718, 0.047806973303745545, 0.06172878421088024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 325.33333333333326, 131, 1257, 142.5, 1136.4, 1257.0, 1257.0, 0.1100325207227914, 11.027190353968507, 0.06363642962809009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9cac685-ddb0-45d4-a399-a1d47eeaea6b", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 340.6111111111111, 129, 1067, 260.5, 1018.4000000000001, 1067.0, 1067.0, 0.11003521126760564, 3.62125211664955, 0.06374544194419993], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 31.57894736842105, 0.46403712296983757], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07733952049497293], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07733952049497293], "isController": false}, {"data": ["401/Unauthorized", 11, 57.89473684210526, 0.8507347254447022], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1293, 19, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
