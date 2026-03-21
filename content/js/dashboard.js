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

    var data = {"OkPercent": 97.76334776334777, "KoPercent": 2.236652236652237};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8187732342007435, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.47540983606557374, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b212705-d416-4a91-b4e5-9babe6975ef7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/52ad3d4f-d010-44f6-ba39-fcf0bc48ba16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99e6f1f9-9413-463d-8ce4-9897ec8da853"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.65625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66b49982-3a97-45b8-a8be-52a1d6197df3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bd40932-68d7-4a34-93fb-575521efa6f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8559495-15d2-4766-a7f5-f56c63144db9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/625793aa-f709-4183-9f65-ba90aec6cc17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d03c98fe-186f-4d97-8e0c-f35b74980cb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0bca54d6-ef09-4f2c-be99-627cf4e35988"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27b61175-1133-45d7-93e3-d77deff72a03"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d2dcf937-eba4-48db-a610-13d05ccf9658"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29f8aea9-ae80-4a47-9617-965675f08b5f"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52ad3d4f-d010-44f6-ba39-fcf0bc48ba16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=625793aa-f709-4183-9f65-ba90aec6cc17"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/99e6f1f9-9413-463d-8ce4-9897ec8da853"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8559495-15d2-4766-a7f5-f56c63144db9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/7f5c69dc-adfd-408a-b860-fb20373c7ce2"], "isController": false}, {"data": [0.3813559322033898, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1b212705-d416-4a91-b4e5-9babe6975ef7"], "isController": false}, {"data": [0.9918032786885246, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8360655737704918, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d03c98fe-186f-4d97-8e0c-f35b74980cb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9217877094972067, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4bd40932-68d7-4a34-93fb-575521efa6f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8223c10-4dca-4691-82f9-5ddc48f76e32"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/29f8aea9-ae80-4a47-9617-965675f08b5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e8d7464-370e-470d-9255-0528550b5f54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bca54d6-ef09-4f2c-be99-627cf4e35988"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/66b49982-3a97-45b8-a8be-52a1d6197df3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8637e1fe-8b28-4f9b-9773-fb0e20eeead7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27b61175-1133-45d7-93e3-d77deff72a03"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2dcf937-eba4-48db-a610-13d05ccf9658"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1386, 31, 2.236652236652237, 273.9249639249639, 81, 1964, 95.0, 691.4999999999998, 843.5999999999995, 1176.5199999999995, 5.450469935899957, 784.5156028795864, 3.9891247443863307], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 61, 0, 0.0, 1213.606557377049, 987, 1788, 1191.0, 1416.8, 1496.0, 1788.0, 0.257574158133643, 309.9478823036525, 1.2664901232450123], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b212705-d416-4a91-b4e5-9babe6975ef7", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52ad3d4f-d010-44f6-ba39-fcf0bc48ba16", 3, 0, 0.0, 270.3333333333333, 170, 455, 186.0, 455.0, 455.0, 455.0, 0.035785003697783715, 0.0298324851790443, 0.02294806552234177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99e6f1f9-9413-463d-8ce4-9897ec8da853", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 1.108368481595092, 4.229773773006134], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 482.1875, 88, 1176, 416.0, 928.2000000000003, 1176.0, 1176.0, 0.08533879501621437, 0.01724589540397252, 0.057238038234447], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 482.1875, 88, 1176, 416.0, 928.2000000000003, 1176.0, 1176.0, 0.08424644190418021, 0.017025144601119424, 0.05650538025421364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 122.29411764705883, 81, 251, 83.0, 248.6, 251.0, 251.0, 0.1039965252925667, 0.037015307370906664, 0.05879674873216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 95.8235294117647, 82, 249, 84.0, 136.1999999999999, 249.0, 249.0, 0.10399461674925062, 0.07728506186150363, 0.0522004228604637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66b49982-3a97-45b8-a8be-52a1d6197df3", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 170.35294117647058, 81, 570, 85.0, 382.79999999999984, 570.0, 570.0, 0.10383518302477997, 1.8222812169788847, 0.0606202300712798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 141.8235294117647, 83, 577, 84.0, 313.7999999999998, 577.0, 577.0, 0.1039958891036778, 5.530833299560159, 0.060612493729659635], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 207.875, 82, 476, 176.0, 410.9000000000001, 476.0, 476.0, 0.08535882716971468, 0.1497322200230469, 0.05516751836548516], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bd40932-68d7-4a34-93fb-575521efa6f6", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 0.8603050595238095, 3.283110119047619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8559495-15d2-4766-a7f5-f56c63144db9", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/625793aa-f709-4183-9f65-ba90aec6cc17", 3, 0, 0.0, 398.33333333333337, 188, 771, 236.0, 771.0, 771.0, 771.0, 0.029641632661126974, 0.02972847338181387, 0.01900846886146489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 84.85714285714286, 82, 88, 84.0, 88.0, 88.0, 88.0, 0.06897061359213734, 0.051256481390250505, 0.034620015025740816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 107.57142857142858, 81, 253, 84.0, 249.5, 253.0, 253.0, 0.0689159520738779, 0.025833867637068908, 0.038890210119815305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 556.4285714285714, 420, 597, 574.0, 597.0, 597.0, 597.0, 0.04100905714319191, 12.05802442894888, 0.023387977901976637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 677.1428571428571, 568, 757, 727.0, 757.0, 757.0, 757.0, 0.040962501755535785, 36.85813108402872, 0.023321424339333364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 155.57142857142856, 83, 259, 84.0, 259.0, 259.0, 259.0, 0.04112470184591162, 0.0727714450632733, 0.0227711972135077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 85.35714285714286, 82, 89, 85.0, 88.5, 89.0, 89.0, 0.08526291428641031, 0.06336433376167797, 0.0427979862726708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 108.07142857142858, 82, 250, 84.0, 249.5, 250.0, 250.0, 0.08526654932365355, 0.022815463393243234, 0.048628578911146164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 95.85714285714285, 81, 248, 84.0, 169.5, 248.0, 248.0, 0.08526447212156278, 0.022981439751514968, 0.05012618380584062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 96.57142857142856, 82, 251, 85.0, 170.5, 251.0, 251.0, 0.08526603001364257, 0.022981859652114595, 0.05021036728342428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 84.28571428571429, 83, 85, 85.0, 85.0, 85.0, 85.0, 0.04112421863984584, 0.03056204139152606, 0.023092212615147812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 457.20000000000005, 82, 772, 576.0, 766.0, 772.0, 772.0, 0.06973079265316369, 37.653851732868304, 0.03739858527843506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 142.57142857142856, 82, 741, 84.0, 494.5, 741.0, 741.0, 0.06891527359363617, 4.446539784110599, 0.040091614241833544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 329.8666666666667, 82, 667, 406.0, 614.8000000000001, 667.0, 667.0, 0.0697288477540338, 12.309075514598897, 0.037465636752216216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 131.2142857142857, 83, 403, 85.5, 330.0, 403.0, 403.0, 0.06897163295267561, 1.4658300212580426, 0.040191756535062226], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 450.79999999999995, 84, 1474, 412.0, 1077.4000000000003, 1474.0, 1474.0, 0.08121805423200208, 0.0165291430683098, 0.05483804950781859], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d03c98fe-186f-4d97-8e0c-f35b74980cb7", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 207.0, 167, 337, 173.0, 337.0, 337.0, 337.0, 0.08521828053857954, 0.1320716906393806, 0.1916579102347155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bca54d6-ef09-4f2c-be99-627cf4e35988", 3, 0, 0.0, 594.3333333333333, 192, 1313, 278.0, 1313.0, 1313.0, 1313.0, 0.024356580336120807, 0.024427937505074288, 0.015619291426483722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27b61175-1133-45d7-93e3-d77deff72a03", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.29665691707717573, 1.1321069376026274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 493.34782608695656, 114, 1088, 456.0, 993.6, 1071.1999999999998, 1088.0, 0.10272580695587703, 0.06310012946801431, 0.046447313106026435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 84.93333333333334, 82, 89, 84.0, 88.4, 89.0, 89.0, 0.06972852361472666, 0.05181973288164745, 0.035000450330048345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 162.33333333333334, 82, 259, 88.0, 257.2, 259.0, 259.0, 0.0697288477540338, 0.08149559081252702, 0.0362535532658668], "isController": false}, {"data": ["login", 23, 0, 0.0, 2143.3478260869574, 1233, 3349, 2117.0, 2813.6000000000004, 3256.3999999999987, 3349.0, 0.10399428483582468, 38.0057296117509, 0.20938828894359893], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 92.28571428571429, 85, 110, 90.0, 108.5, 110.0, 110.0, 0.07071385638015769, 0.057247838807764385, 0.02513656613513418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2dcf937-eba4-48db-a610-13d05ccf9658", 3, 0, 0.0, 294.3333333333333, 173, 411, 299.0, 411.0, 411.0, 411.0, 0.04040730564085986, 0.033685908120521524, 0.025912237015785787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 544.8000000000001, 167, 856, 667.0, 853.6, 856.0, 856.0, 0.0696996872807364, 50.074242872626144, 0.14605623922559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 479.58333333333337, 82, 840, 659.5, 834.3000000000001, 840.0, 840.0, 0.06286902809721648, 43.8813843989197, 0.09996216397814255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 296.4117647058824, 167, 661, 327.0, 530.5999999999999, 661.0, 661.0, 0.10378130227220005, 7.454821747982369, 0.23184461535291745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29f8aea9-ae80-4a47-9617-965675f08b5f", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 0.22221901906519068, 0.8480358241082412], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 805.875, 174, 1092, 889.0, 1024.0, 1085.75, 1092.0, 0.0969728314450568, 0.03044605987264235, 0.04375141418712524], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 104.57142857142858, 84, 251, 90.5, 180.5, 251.0, 251.0, 0.06588731386833832, 0.05115274855989157, 0.023420881101635888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 253.35714285714286, 168, 824, 174.0, 582.5, 824.0, 824.0, 0.068886111575819, 5.98568702671551, 0.15366753963411633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 332.4117647058824, 169, 825, 330.0, 589.7999999999998, 825.0, 825.0, 0.08178306320868632, 5.874643552127082, 0.1827011457446348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52ad3d4f-d010-44f6-ba39-fcf0bc48ba16", 1, 0, 0.0, 1474.0, 1474, 1474, 1474.0, 1474.0, 1474.0, 1474.0, 0.6784260515603798, 0.1225672065807327, 0.46774296132971505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 95.73333333333333, 82, 248, 84.0, 153.80000000000007, 248.0, 248.0, 0.08750896966939112, 0.06503352140469398, 0.043925400791081086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 95.19999999999999, 82, 248, 84.0, 153.80000000000007, 248.0, 248.0, 0.0874273624330452, 0.03214776972798433, 0.049371415478140245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 138.0, 82, 730, 84.0, 439.60000000000014, 730.0, 730.0, 0.08750999072394099, 5.2714571306786695, 0.050944943818585955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 138.4, 81, 572, 84.0, 377.0000000000001, 572.0, 572.0, 0.0874294007588872, 1.7358037421240682, 0.05098340772118181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 84.66666666666667, 84, 85, 85.0, 85.0, 85.0, 85.0, 0.023971234518577706, 0.007069641430283659, 0.014818155713144225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=625793aa-f709-4183-9f65-ba90aec6cc17", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 0.2923366707119741, 1.1156199433656957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99e6f1f9-9413-463d-8ce4-9897ec8da853", 3, 0, 0.0, 471.6666666666667, 312, 708, 395.0, 708.0, 708.0, 708.0, 0.08127658421608734, 0.03767508330849882, 0.05212072620627997], "isController": false}, {"data": ["https://demoqa.com/books", 61, 0, 0.0, 800.7540983606557, 643, 1431, 680.0, 1069.8, 1123.5, 1431.0, 0.2563876244635825, 306.728733618512, 0.5062654068997693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 805.875, 174, 1092, 889.0, 1024.0, 1085.75, 1092.0, 0.09955944943624462, 0.031258166986086564, 0.04491842347611817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 14, 0, 0.0, 96.35714285714288, 82, 256, 84.0, 172.5, 256.0, 256.0, 0.06840145792821756, 0.018436330457214888, 0.04027937415108905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8559495-15d2-4766-a7f5-f56c63144db9", 3, 0, 0.0, 675.0, 170, 1371, 484.0, 1371.0, 1371.0, 1371.0, 0.024155367322619088, 0.028550826415504525, 0.015490258341653516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 14, 0, 0.0, 83.99999999999999, 82, 88, 83.0, 87.5, 88.0, 88.0, 0.06840145792821756, 0.018436330457214888, 0.040212575852331026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 189.42857142857144, 82, 738, 85.0, 736.0, 738.0, 738.0, 0.06531495805846622, 8.410877229456112, 0.037596193770819145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 155.85714285714283, 83, 602, 84.5, 503.5, 602.0, 602.0, 0.06526654390340551, 2.7565827428265077, 0.037632062772429545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 98.00000000000001, 84, 247, 85.0, 170.5, 247.0, 247.0, 0.0653146533424774, 0.048539503118774696, 0.03278489435354822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 14, 0, 0.0, 106.28571428571429, 81, 248, 83.0, 246.5, 248.0, 248.0, 0.0683460261667643, 0.01828790153290373, 0.038978593048232764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 131.85714285714286, 82, 260, 84.0, 258.5, 260.0, 260.0, 0.06531648168105962, 0.031491875096225176, 0.036467153974274635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 14, 0, 0.0, 96.14285714285714, 82, 245, 84.5, 167.5, 245.0, 245.0, 0.06840112373274704, 0.05083325699279345, 0.034334157811164036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 14, 0, 0.0, 87.28571428571429, 84, 92, 87.0, 91.0, 92.0, 92.0, 0.06859685140452053, 0.05399322483598003, 0.024384037022700658], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 560.4285714285713, 83, 1313, 453.5, 1230.5, 1313.0, 1313.0, 0.08377163851341243, 0.016174657882612, 0.05700865690128709], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1146.7826086956522, 841, 1964, 1087.0, 1651.8000000000004, 1924.1999999999994, 1964.0, 0.104657723740012, 0.054168548420123405, 0.04813846472807193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 14, 0, 0.0, 205.78571428571428, 166, 502, 171.5, 416.5, 502.0, 502.0, 0.06831801057953192, 0.10587957303683317, 0.15364880699674024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f5c69dc-adfd-408a-b860-fb20373c7ce2", 2, 0, 0.0, 385.0, 171, 599, 385.0, 599.0, 599.0, 599.0, 0.02219731190552824, 0.031193292804741347, 0.013797450222528053], "isController": false}, {"data": ["addBook", 59, 13, 22.033898305084747, 821.0508474576271, 429, 1663, 718.0, 1343.0, 1381.0, 1663.0, 0.27311274464421276, 84.16184222936378, 0.9920588997722518], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1b212705-d416-4a91-b4e5-9babe6975ef7", 3, 0, 0.0, 488.6666666666667, 181, 902, 383.0, 902.0, 902.0, 902.0, 0.05410279531109107, 0.03478288435527502, 0.034694826420198374], "isController": false}, {"data": ["https://demoqa.com/books-0", 61, 0, 0.0, 165.72131147540983, 82, 562, 87.0, 339.8, 348.8, 562.0, 0.25700442384664, 0.19099645170634086, 0.12423553691805352], "isController": false}, {"data": ["https://demoqa.com/books-3", 61, 0, 0.0, 473.55737704918033, 402, 674, 414.0, 592.0, 666.1, 674.0, 0.2572114066933998, 75.62869379034741, 0.12935925238974696], "isController": false}, {"data": ["https://demoqa.com/books-1", 61, 0, 0.0, 135.70491803278685, 82, 341, 87.0, 251.8, 258.7, 341.0, 0.257554582571577, 0.4557508824411108, 0.1252560372271927], "isController": false}, {"data": ["https://demoqa.com/books-2", 61, 0, 0.0, 630.7540983606557, 560, 832, 576.0, 757.6, 819.4999999999999, 832.0, 0.25703474604124354, 231.28031630680047, 0.12901939400898357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d03c98fe-186f-4d97-8e0c-f35b74980cb7", 3, 0, 0.0, 442.3333333333333, 399, 476, 452.0, 476.0, 476.0, 476.0, 0.020834780193068964, 0.028722426470588234, 0.013360845371206333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 88.3529411764706, 85, 107, 86.0, 96.6, 107.0, 107.0, 0.08568116526384759, 0.06400985490902676, 0.030456976714883323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 13, 7.262569832402234, 141.60893854748593, 82, 1006, 91.0, 258.0, 356.0, 836.3999999999976, 0.7402904088967192, 1.6748860485241752, 0.3519343899531425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 131.39999999999998, 84, 253, 89.0, 252.4, 253.0, 253.0, 0.09005223029357028, 0.06973771349882932, 0.03201075373716756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bd40932-68d7-4a34-93fb-575521efa6f6", 3, 0, 0.0, 255.0, 167, 398, 200.0, 398.0, 398.0, 398.0, 0.06479481641468682, 0.02931796706263499, 0.04155136339092873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 89.82352941176471, 84, 114, 88.0, 102.79999999999998, 114.0, 114.0, 0.10457419846952586, 0.08486441301579686, 0.03717285961221427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 246.2, 166, 816, 171.0, 623.4000000000001, 816.0, 816.0, 0.0873825432980502, 7.095724208314158, 0.1950348783780635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8223c10-4dca-4691-82f9-5ddc48f76e32", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 325.0, 170, 986, 179.5, 902.5, 986.0, 986.0, 0.06523947547461718, 11.236534892634463, 0.1443405191897257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 89.42857142857143, 85, 102, 89.0, 98.0, 102.0, 102.0, 0.08926465056077329, 0.07400946125595363, 0.031730793754024884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29f8aea9-ae80-4a47-9617-965675f08b5f", 3, 0, 0.0, 382.33333333333337, 169, 805, 173.0, 805.0, 805.0, 805.0, 0.06648641460928151, 0.030083371193652765, 0.04263614478524888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e8d7464-370e-470d-9255-0528550b5f54", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 1.9008091517857142, 3.5516648065476186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bca54d6-ef09-4f2c-be99-627cf4e35988", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66b49982-3a97-45b8-a8be-52a1d6197df3", 3, 0, 0.0, 588.0, 233, 1148, 383.0, 1148.0, 1148.0, 1148.0, 0.01710961560396943, 0.023586986355081555, 0.01097198656895175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 107.8, 84, 378, 86.0, 213.0000000000001, 378.0, 378.0, 0.07010951105626989, 0.054430723915756415, 0.02492174025828344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8637e1fe-8b28-4f9b-9773-fb0e20eeead7", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.947584384272997, 1.7705628709198813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27b61175-1133-45d7-93e3-d77deff72a03", 3, 0, 0.0, 300.6666666666667, 165, 386, 351.0, 386.0, 386.0, 386.0, 0.03925006214593173, 0.024876260090536808, 0.02517012448811377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2dcf937-eba4-48db-a610-13d05ccf9658", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 106.3529411764706, 81, 284, 84.0, 261.59999999999997, 284.0, 284.0, 0.08188035834698006, 0.06085053974809748, 0.04110010174838648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 151.47058823529412, 81, 252, 85.0, 251.2, 252.0, 252.0, 0.08181888187278608, 0.029121656254812875, 0.04625812473529185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 186.1764705882353, 82, 741, 86.0, 427.39999999999975, 741.0, 741.0, 0.08181848809059714, 4.351368331492417, 0.047686717610707634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 141.70588235294122, 81, 407, 84.0, 282.9999999999999, 407.0, 407.0, 0.08188351347706298, 1.4370349648623395, 0.047804581081536714], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 22.580645161290324, 0.5050505050505051], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.67741935483871, 0.21645021645021645], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.1443001443001443], "isController": false}, {"data": ["401/Unauthorized", 19, 61.29032258064516, 1.3708513708513708], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1386, 31, "401/Unauthorized", 19, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
