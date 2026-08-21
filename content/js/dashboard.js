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

    var data = {"OkPercent": 97.96557120500782, "KoPercent": 2.0344287949921753};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7127588510354042, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9aa55138-3796-4fb1-9604-9688489630e4"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78995a37-3dc1-43a5-977a-c9a100529864"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9495dde5-ab36-400a-8f15-ed80566d19b2"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/656f0fa0-832f-474c-bd9c-512ae24a0c54"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19a16b17-f246-492e-86b5-6e1766ed191c"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9ade9ee5-0643-4d4a-a415-b77015049bde"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f94690e7-4bd8-4583-90b6-cbb85b26693b"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79eaad53-c493-4cd4-b50d-217b01fdd4af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1220417-5512-43ec-8a25-6cfa849a9558"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81c88ec8-af9f-4fef-baba-9d74f607a602"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/21419484-39a5-4bbf-8b7b-944cd07a14b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bbef9b59-953c-42c9-98da-7f8df747f88c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80264284-9b0b-4edc-a0a8-34a53059f257"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f3276ee-b28b-459a-83ad-5a8b3a07125b"], "isController": false}, {"data": [0.34375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.18, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=656f0fa0-832f-474c-bd9c-512ae24a0c54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.23214285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9aa55138-3796-4fb1-9604-9688489630e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19a16b17-f246-492e-86b5-6e1766ed191c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9495dde5-ab36-400a-8f15-ed80566d19b2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e9d5ae09-2d05-45ef-8e08-81c106cf1416"], "isController": false}, {"data": [0.2358490566037736, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81c88ec8-af9f-4fef-baba-9d74f607a602"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f94690e7-4bd8-4583-90b6-cbb85b26693b"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3392857142857143, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9382716049382716, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21419484-39a5-4bbf-8b7b-944cd07a14b8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/80264284-9b0b-4edc-a0a8-34a53059f257"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c14c646e-f123-4750-bac6-d7425b54e497"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e9d5ae09-2d05-45ef-8e08-81c106cf1416"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79eaad53-c493-4cd4-b50d-217b01fdd4af"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/78995a37-3dc1-43a5-977a-c9a100529864"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/45222298-d569-4736-b896-9f3a45253046"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a1220417-5512-43ec-8a25-6cfa849a9558"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4c417ea-e4d2-471b-985c-f8f1273e9354"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1278, 26, 2.0344287949921753, 493.25586854460124, 136, 2434, 164.0, 1367.700000000001, 1640.2999999999997, 1948.0400000000009, 5.070442652024011, 762.7159596819467, 3.687740125679927], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/9aa55138-3796-4fb1-9604-9688489630e4", 3, 0, 0.0, 379.6666666666667, 291, 527, 321.0, 527.0, 527.0, 527.0, 0.033039283708329203, 0.02754349139877314, 0.02118730107597934], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2288.32142857143, 1669, 3030, 2284.5, 2827.9000000000005, 2912.8, 3030.0, 0.24211295434009086, 291.34391976279414, 1.190467504982771], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78995a37-3dc1-43a5-977a-c9a100529864", 1, 0, 0.0, 807.0, 807, 807, 807.0, 807.0, 807.0, 807.0, 1.2391573729863692, 0.22387120508054523, 0.8543409231722429], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9495dde5-ab36-400a-8f15-ed80566d19b2", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.30673015704584045, 1.1705485993208828], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 531.0000000000001, 143, 981, 560.0, 846.6000000000001, 981.0, 981.0, 0.09542531060938603, 0.01942054172948833, 0.06394614076187567], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 531.0000000000001, 143, 981, 560.0, 846.6000000000001, 981.0, 981.0, 0.0944733112895607, 0.019226794992914503, 0.06330818965517242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 172.05, 137, 444, 143.0, 408.1000000000006, 443.65, 444.0, 0.08651566798747252, 0.029646824117972766, 0.048977668683923656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 145.09999999999997, 140, 159, 145.0, 148.9, 158.5, 159.0, 0.08651641649002899, 0.06429589155167194, 0.04342718562097158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 226.3, 138, 1252, 145.0, 426.1, 1210.7499999999995, 1252.0, 0.08641025862590407, 1.2925000081009617, 0.05051287188815056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 232.55000000000004, 138, 1383, 144.0, 425.40000000000003, 1335.1999999999994, 1383.0, 0.08641025862590407, 3.909730882000311, 0.0504284868699612], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 260.125, 140, 353, 275.0, 346.0, 353.0, 353.0, 0.08156149481829628, 0.1264989712419267, 0.052713297645931356], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 177.76470588235293, 138, 444, 145.0, 428.0, 444.0, 444.0, 0.0971917306988657, 0.072229401427575, 0.04878569294845408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 177.58823529411765, 139, 427, 144.0, 424.6, 427.0, 427.0, 0.0971939533926407, 0.0431811831076909, 0.05447060025842158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1098.8333333333335, 855, 1159, 1152.5, 1159.0, 1159.0, 1159.0, 0.042844289570271775, 12.59764369796204, 0.02443463389554562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1434.5, 1224, 1588, 1462.0, 1588.0, 1588.0, 1588.0, 0.04282380146885639, 38.532931837890494, 0.02438112915658523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 286.3333333333333, 140, 442, 285.5, 442.0, 442.0, 442.0, 0.0430641584186841, 0.0762033740768121, 0.023845095530658094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 143.38461538461542, 139, 151, 142.0, 149.4, 151.0, 151.0, 0.06863345511372036, 0.05100591732572382, 0.034450777273879164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 221.30769230769232, 137, 582, 145.0, 522.8, 582.0, 582.0, 0.06863635403687356, 0.018365586920022808, 0.03914417066165445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 141.6153846153846, 137, 146, 141.0, 146.0, 146.0, 146.0, 0.06863707880592602, 0.01849983764690975, 0.040351095157390104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 210.07692307692304, 136, 444, 144.0, 440.0, 444.0, 444.0, 0.06863454218120575, 0.018499153947278114, 0.04041662981959675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 239.33333333333334, 141, 436, 151.0, 436.0, 436.0, 436.0, 0.04306570390893039, 0.03200488347138284, 0.02418240209729978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/656f0fa0-832f-474c-bd9c-512ae24a0c54", 3, 0, 0.0, 479.0, 317, 575, 545.0, 575.0, 575.0, 575.0, 0.027609309859284552, 0.02769019650926292, 0.01770518893971047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19a16b17-f246-492e-86b5-6e1766ed191c", 3, 0, 0.0, 455.33333333333337, 245, 796, 325.0, 796.0, 796.0, 796.0, 0.05889050292489498, 0.037860919035373565, 0.037765068607435906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1057.125, 139, 1819, 1465.0, 1758.1000000000001, 1819.0, 1819.0, 0.1077216204024749, 60.59095249897327, 0.05754270152358767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 330.23529411764713, 137, 1384, 142.0, 1265.6, 1384.0, 1384.0, 0.09719117504130625, 10.311677716207486, 0.05615514927421061], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ade9ee5-0643-4d4a-a415-b77015049bde", 1, 0, 0.0, 1080.0, 1080, 1080, 1080.0, 1080.0, 1080.0, 1080.0, 0.9259259259259259, 0.2956814236111111, 0.5524811921296295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 742.25, 139, 1256, 979.0, 1244.8, 1256.0, 1256.0, 0.10792288909574109, 19.843978703778653, 0.0577556086176427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 377.11764705882354, 140, 1120, 423.0, 891.9999999999998, 1120.0, 1120.0, 0.0971917306988657, 3.3851844070160992, 0.05625038412172978], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 497.1333333333333, 143, 1037, 516.0, 899.0000000000001, 1037.0, 1037.0, 0.09452927571668945, 0.01923818462827938, 0.0638257238579288], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f94690e7-4bd8-4583-90b6-cbb85b26693b", 3, 0, 0.0, 368.0, 242, 504, 358.0, 504.0, 504.0, 504.0, 0.05804504295333179, 0.03731736973724944, 0.03722289538348425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 390.3076923076923, 286, 728, 291.0, 671.1999999999999, 728.0, 728.0, 0.06858095454137805, 0.10628708482145213, 0.15424017412968133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79eaad53-c493-4cd4-b50d-217b01fdd4af", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1220417-5512-43ec-8a25-6cfa849a9558", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 707.5833333333335, 209, 1844, 653.0, 1226.5, 1694.0, 1844.0, 0.11128318789238915, 0.06835656756280545, 0.050316519525562674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81c88ec8-af9f-4fef-baba-9d74f607a602", 3, 0, 0.0, 435.6666666666667, 263, 552, 492.0, 552.0, 552.0, 552.0, 0.06996758168715161, 0.031658508640996334, 0.04486853382932574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 162.0, 139, 437, 143.0, 234.70000000000022, 437.0, 437.0, 0.10792070526180889, 0.08020278975023101, 0.05417113525836891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 259.875, 139, 584, 147.5, 481.10000000000014, 584.0, 584.0, 0.10771074280021004, 0.12993134281636665, 0.05577502086895642], "isController": false}, {"data": ["login", 24, 0, 0.0, 3020.208333333333, 1648, 4457, 3033.5, 4005.0, 4351.5, 4457.0, 0.11010386464564906, 33.0816147047152, 0.21176714982383382], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 167.23529411764707, 141, 438, 149.0, 218.7999999999998, 438.0, 438.0, 0.10071746381576999, 0.08153786865554036, 0.03580191096576199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21419484-39a5-4bbf-8b7b-944cd07a14b8", 3, 0, 0.0, 537.3333333333334, 266, 825, 521.0, 825.0, 825.0, 825.0, 0.021927099702522348, 0.02199133925243208, 0.014061323702463874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbef9b59-953c-42c9-98da-7f8df747f88c", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80264284-9b0b-4edc-a0a8-34a53059f257", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f3276ee-b28b-459a-83ad-5a8b3a07125b", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 1.1827256944444444, 2.209924768518518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1238.6249999999998, 286, 1967, 1611.0, 1902.6000000000001, 1967.0, 1967.0, 0.1076035347761174, 80.51955956948498, 0.22479576344707924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 395.5, 282, 1527, 291.0, 591.0, 1480.2999999999993, 1527.0, 0.08635690445040306, 5.292788530561708, 0.1931139409189238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 909.5, 140, 1737, 864.5, 1734.6, 1737.0, 1737.0, 0.08538129864955246, 51.08428134738805, 0.12454913560329003], "isController": false}, {"data": ["register", 25, 6, 24.0, 1273.08, 238, 1994, 1198.0, 1828.4, 1949.0, 1994.0, 0.10742892502320464, 0.03392404022998385, 0.04846890953195366], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=656f0fa0-832f-474c-bd9c-512ae24a0c54", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 148.0909090909091, 142, 156, 149.0, 155.2, 156.0, 156.0, 0.05855642443825757, 0.045461286551186295, 0.02081497899953687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 612.5294117647059, 290, 1527, 572.0, 1410.1999999999998, 1527.0, 1527.0, 0.09711011716050016, 13.800732226349403, 0.21547980787905793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 444.42105263157885, 282, 1667, 291.0, 1283.0, 1667.0, 1667.0, 0.09546107700191928, 12.15391336247827, 0.21212318780962047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 182.7142857142857, 140, 425, 141.0, 425.0, 425.0, 425.0, 0.0378626020261901, 0.02813812513860417, 0.019005251407677455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 226.28571428571428, 137, 436, 146.0, 436.0, 436.0, 436.0, 0.03780371232455027, 0.018226789870765307, 0.02110636952048691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 338.57142857142856, 137, 1243, 143.0, 1243.0, 1243.0, 1243.0, 0.037639467670385805, 4.84698989279473, 0.021665798494421296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 295.0, 141, 1202, 145.0, 1202.0, 1202.0, 1202.0, 0.037647767487388, 1.5900824519722052, 0.021707341381888196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 145.33333333333334, 143, 147, 146.0, 147.0, 147.0, 147.0, 0.4396248534583822, 0.1296549860785463, 0.2717602853898007], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1589.8214285714282, 1097, 2434, 1578.0, 2202.2000000000007, 2315.1, 2434.0, 0.24111844513048383, 288.46148671049855, 0.47611474224007644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 6, 24.0, 1273.08, 238, 1994, 1198.0, 1828.4, 1949.0, 1994.0, 0.10430051899938254, 0.03293614826527377, 0.04705746072042454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 141.66666666666669, 138, 146, 141.0, 146.0, 146.0, 146.0, 0.032888606290494095, 0.008864507164234738, 0.019367021087078065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 142.0, 139, 145, 142.0, 145.0, 145.0, 145.0, 0.03288716413983622, 0.008864118459565232, 0.019334055480645904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 425.5454545454545, 140, 1582, 145.0, 1514.8000000000002, 1582.0, 1582.0, 0.05584890333062551, 9.149214545466084, 0.031960407570064985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 395.27272727272725, 138, 1237, 158.0, 1236.0, 1237.0, 1237.0, 0.05584947044547569, 2.998061452187776, 0.03201527260888108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 142.33333333333334, 139, 145, 142.5, 145.0, 145.0, 145.0, 0.03288716413983622, 0.008799885717104614, 0.018755960798500344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 145.1818181818182, 139, 155, 145.0, 154.4, 155.0, 155.0, 0.05584691851934588, 0.041503422844943565, 0.028032535272406036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 143.83333333333331, 141, 147, 143.5, 147.0, 147.0, 147.0, 0.0328866233659459, 0.02444015662254378, 0.016507543369234566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 286.8181818181818, 140, 540, 168.0, 519.8000000000001, 540.0, 540.0, 0.05584890333062551, 0.03019529663383428, 0.030998521273354996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 242.0, 148, 426, 155.0, 426.0, 426.0, 426.0, 0.031694549065803164, 0.024947076706091167, 0.01126642173823472], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 556.2666666666668, 141, 1291, 504.0, 1039.6000000000001, 1291.0, 1291.0, 0.09299903281005877, 0.01841816782605461, 0.06328293560746968], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1421.375, 932, 2428, 1348.5, 1813.5, 2289.0, 2428.0, 0.11159053712245202, 0.05775682097158161, 0.05132728807097158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9aa55138-3796-4fb1-9604-9688489630e4", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 289.6666666666667, 286, 293, 289.5, 293.0, 293.0, 293.0, 0.032860327179324286, 0.05092708909530042, 0.07390364599021858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19a16b17-f246-492e-86b5-6e1766ed191c", 1, 0, 0.0, 1037.0, 1037, 1037, 1037.0, 1037.0, 1037.0, 1037.0, 0.9643201542912248, 0.17421799662487947, 0.664853543876567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9495dde5-ab36-400a-8f15-ed80566d19b2", 3, 0, 0.0, 607.0, 239, 1291, 291.0, 1291.0, 1291.0, 1291.0, 0.03692671278402797, 0.03042366863814283, 0.02368021620590335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9d5ae09-2d05-45ef-8e08-81c106cf1416", 3, 0, 0.0, 810.0, 289, 1521, 620.0, 1521.0, 1521.0, 1521.0, 0.031594911112983404, 0.026339377395947428, 0.020261059535344173], "isController": false}, {"data": ["addBook", 53, 8, 15.09433962264151, 1482.5283018867922, 735, 2739, 1229.0, 2341.0, 2625.9, 2739.0, 0.25533062907685933, 104.79728389032344, 0.9217298333967645], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81c88ec8-af9f-4fef-baba-9d74f607a602", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 267.8214285714286, 139, 609, 148.0, 567.6, 588.3, 609.0, 0.2424064029919876, 0.18014772722353767, 0.11717887644632213], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 931.9107142857142, 683, 1300, 863.5, 1157.0, 1271.5, 1300.0, 0.24189646831156264, 71.12559340227384, 0.12165691521528786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f94690e7-4bd8-4583-90b6-cbb85b26693b", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 229.16071428571428, 137, 560, 147.5, 435.5, 440.45, 560.0, 0.2426059343144433, 0.42929878220485473, 0.11798608914901636], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1319.9821428571431, 954, 1813, 1263.5, 1718.3, 1790.9, 1813.0, 0.24176488365064974, 217.5404672861892, 0.12135463886370505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 164.63157894736844, 140, 435, 148.0, 160.0, 435.0, 435.0, 0.10286116449665701, 0.07684452230463146, 0.03656392956717105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 8, 4.938271604938271, 218.0308641975308, 140, 1025, 152.0, 400.40000000000003, 441.7, 1018.7, 0.6644545525390777, 1.5722796840969775, 0.3150679681636035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 193.00000000000003, 144, 429, 155.0, 429.0, 429.0, 429.0, 0.03834586878043703, 0.029695580022350163, 0.013630758043045976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 165.74999999999997, 143, 434, 150.5, 165.8, 420.5999999999998, 434.0, 0.09010307792114179, 0.07312075952389534, 0.03202882847978087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21419484-39a5-4bbf-8b7b-944cd07a14b8", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80264284-9b0b-4edc-a0a8-34a53059f257", 3, 0, 0.0, 482.0, 343, 626, 477.0, 626.0, 626.0, 626.0, 0.058970377213846244, 0.026682560002358816, 0.037816290075285516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 528.0, 286, 1385, 293.0, 1385.0, 1385.0, 1385.0, 0.0376095377787807, 6.4776867145651, 0.08321005296228838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c14c646e-f123-4750-bac6-d7425b54e497", 2, 0, 0.0, 274.0, 247, 301, 274.0, 301.0, 301.0, 301.0, 0.02562098871395447, 0.029148878761481402, 0.015925546207453144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 628.6363636363636, 280, 1729, 569.0, 1663.6000000000004, 1729.0, 1729.0, 0.05580696876839093, 12.209771063008604, 0.12291504689053717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e9d5ae09-2d05-45ef-8e08-81c106cf1416", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79eaad53-c493-4cd4-b50d-217b01fdd4af", 3, 0, 0.0, 332.6666666666667, 259, 455, 284.0, 455.0, 455.0, 455.0, 0.04072656186364747, 0.02618325510439575, 0.02611696838261247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78995a37-3dc1-43a5-977a-c9a100529864", 3, 0, 0.0, 608.3333333333334, 248, 1075, 502.0, 1075.0, 1075.0, 1075.0, 0.04454144581533116, 0.028635857905364277, 0.028563362062565885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 174.30769230769232, 145, 437, 150.0, 331.7999999999999, 437.0, 437.0, 0.07293250377285453, 0.06046845283511083, 0.025925225950506878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45222298-d569-4736-b896-9f3a45253046", 1, 0, 0.0, 1738.0, 1738, 1738, 1738.0, 1738.0, 1738.0, 1738.0, 0.5753739930955121, 0.18373759349827387, 0.3433139743958573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1220417-5512-43ec-8a25-6cfa849a9558", 3, 0, 0.0, 784.6666666666666, 353, 1129, 872.0, 1129.0, 1129.0, 1129.0, 0.01832878168588134, 0.025267705221258943, 0.011753808568094479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 148.5625, 140, 163, 148.5, 159.5, 163.0, 163.0, 0.10017844285132893, 0.07777525592461572, 0.03561030585730833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4c417ea-e4d2-471b-985c-f8f1273e9354", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 144.47368421052636, 139, 161, 143.0, 150.0, 161.0, 161.0, 0.09552875164032923, 0.07099353515458061, 0.04795095541321213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 172.84210526315786, 138, 441, 144.0, 419.0, 441.0, 441.0, 0.0955330745560226, 0.04066637147784639, 0.05363915020816155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 280.36842105263156, 138, 1520, 140.0, 1139.0, 1520.0, 1520.0, 0.09553403525708712, 9.071638191867539, 0.05529935778501825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 254.57894736842107, 138, 1149, 145.0, 971.0, 1149.0, 1149.0, 0.0955330745560226, 2.9798698613262005, 0.055392095706542514], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 23.076923076923077, 0.4694835680751174], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.538461538461538, 0.2347417840375587], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.538461538461538, 0.2347417840375587], "isController": false}, {"data": ["401/Unauthorized", 14, 53.84615384615385, 1.0954616588419406], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1278, 26, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
