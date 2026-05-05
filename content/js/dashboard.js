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

    var data = {"OkPercent": 97.89719626168224, "KoPercent": 2.102803738317757};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7134308510638298, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20940766-1ffd-4dcd-b788-99cfef80689b"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.53125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5925dd3-859f-43f8-a778-029f24a074f1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d018c720-5031-496e-a064-8e3a30d344e7"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4be83a6-bb6b-42e2-be24-92c06b937b3b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7cb1dcf-f888-4090-96ee-c6bbee29d882"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a236bdaf-f75d-4c3b-9223-305d68595274"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cbc42818-a157-47b5-a2bc-c9d40309447c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/68d01209-f2a4-4474-bec3-d50a768fad3b"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c05c78d-bc12-4523-8643-62a5c15b0e86"], "isController": false}, {"data": [0.6086956521739131, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cbfa6970-b1ae-4fee-9eff-b2489443ec2c"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3675906-861a-45fa-ae0b-7d7d7d7ed9bb"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eacce8df-2eb0-4bbe-a186-8a9db9e99a2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57bdd42c-969d-4b8f-84d3-f74c45b4f4a8"], "isController": false}, {"data": [0.11538461538461539, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f610f262-16e7-4941-917b-a0c25ec6e7dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d018c720-5031-496e-a064-8e3a30d344e7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57bdd42c-969d-4b8f-84d3-f74c45b4f4a8"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d1d42ad6-8f8d-4820-9165-50df6b1b6f53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4be83a6-bb6b-42e2-be24-92c06b937b3b"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3675906-861a-45fa-ae0b-7d7d7d7ed9bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/20940766-1ffd-4dcd-b788-99cfef80689b"], "isController": false}, {"data": [0.2636363636363636, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e5925dd3-859f-43f8-a778-029f24a074f1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68d01209-f2a4-4474-bec3-d50a768fad3b"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e7cb1dcf-f888-4090-96ee-c6bbee29d882"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cbc42818-a157-47b5-a2bc-c9d40309447c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9727272727272728, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.33636363636363636, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9393939393939394, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ebba5b3-ed4f-4455-a1a6-3bd666386435"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a236bdaf-f75d-4c3b-9223-305d68595274"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c05c78d-bc12-4523-8643-62a5c15b0e86"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eacce8df-2eb0-4bbe-a186-8a9db9e99a2a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f610f262-16e7-4941-917b-a0c25ec6e7dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1284, 27, 2.102803738317757, 509.4135514018694, 136, 2410, 167.5, 1444.5, 1701.75, 2116.9000000000005, 5.019644637307218, 732.8361166290389, 3.662230588703845], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2416.6727272727276, 1888, 3251, 2394.0, 2848.8, 2979.2, 3251.0, 0.23988659906226148, 288.66430187547707, 1.1795205334750845], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20940766-1ffd-4dcd-b788-99cfef80689b", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 580.6875, 154, 1249, 527.5, 1025.0000000000002, 1249.0, 1249.0, 0.08154819243334709, 0.016479862374683362, 0.05469562296448066], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 580.6875, 154, 1249, 527.5, 1025.0000000000002, 1249.0, 1249.0, 0.08206011929489843, 0.01658331634432426, 0.05503898015940178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 176.15, 141, 444, 147.0, 388.90000000000043, 442.34999999999997, 444.0, 0.09860620134400253, 0.026384862469000677, 0.05623634920400144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 146.9, 138, 155, 149.0, 152.8, 154.9, 155.0, 0.09874982718780242, 0.0733873227440602, 0.04956778435012738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 161.65, 137, 428, 148.0, 173.60000000000005, 415.3999999999998, 428.0, 0.09875421557057718, 0.02661734716550713, 0.058153117176814484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 189.89999999999995, 136, 452, 144.5, 439.6, 451.45, 452.0, 0.09861446674227109, 0.026579680489127754, 0.05797452048715546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5925dd3-859f-43f8-a778-029f24a074f1", 1, 0, 0.0, 1455.0, 1455, 1455, 1455.0, 1455.0, 1455.0, 1455.0, 0.6872852233676976, 0.12416774054982817, 0.4738509450171821], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d018c720-5031-496e-a064-8e3a30d344e7", 3, 0, 0.0, 698.0, 235, 1328, 531.0, 1328.0, 1328.0, 1328.0, 0.08046994447573831, 0.037301172178857867, 0.051603447466537916], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 322.74999999999994, 147, 1328, 256.0, 681.9000000000007, 1328.0, 1328.0, 0.08183264201799295, 0.14674334854056598, 0.05288854042532516], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4be83a6-bb6b-42e2-be24-92c06b937b3b", 1, 0, 0.0, 1666.0, 1666, 1666, 1666.0, 1666.0, 1666.0, 1666.0, 0.6002400960384153, 0.10844181422569028, 0.4138374099639856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7cb1dcf-f888-4090-96ee-c6bbee29d882", 1, 0, 0.0, 833.0, 833, 833, 833.0, 833.0, 833.0, 833.0, 1.2004801920768307, 0.21688362845138057, 0.8276748199279712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 162.73684210526318, 143, 432, 149.0, 153.0, 432.0, 432.0, 0.10375199995631496, 0.07710475778003484, 0.05207864060307216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1137.4285714285716, 716, 1329, 1176.0, 1329.0, 1329.0, 1329.0, 0.031215161649944256, 9.17829396599777, 0.017802396878483836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 190.3684210526316, 138, 459, 145.0, 424.0, 459.0, 459.0, 0.10375653256589906, 0.05236889133414518, 0.057797764183244955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1593.5714285714287, 1268, 2034, 1470.0, 2034.0, 2034.0, 2034.0, 0.03118790265810039, 28.062929634243872, 0.017756393798508328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a236bdaf-f75d-4c3b-9223-305d68595274", 3, 0, 0.0, 421.0, 244, 745, 274.0, 745.0, 745.0, 745.0, 0.08872852030404306, 0.0401473447990299, 0.0568994742835172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 279.57142857142856, 143, 446, 207.0, 446.0, 446.0, 446.0, 0.03133168618183121, 0.05544239781394349, 0.01734869732919755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbc42818-a157-47b5-a2bc-c9d40309447c", 3, 0, 0.0, 630.6666666666666, 360, 1052, 480.0, 1052.0, 1052.0, 1052.0, 0.03617203419462966, 0.030155136579572448, 0.02319625890736342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 203.79999999999998, 140, 445, 149.5, 442.6, 445.0, 445.0, 0.057138612560209814, 0.04246336343585905, 0.028680905132761565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 200.6, 137, 426, 148.5, 424.8, 426.0, 426.0, 0.05722755392266268, 0.023908151921987395, 0.032156967311621196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 326.0, 138, 1659, 146.0, 1537.5000000000005, 1659.0, 1659.0, 0.05722788142382969, 5.163257062278242, 0.033151932871695086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 340.0, 139, 1136, 151.0, 1072.3000000000002, 1136.0, 1136.0, 0.05722788142382969, 1.6965719604841478, 0.03320781947464805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 189.2857142857143, 144, 436, 150.0, 436.0, 436.0, 436.0, 0.0313721272094941, 0.023314637506274428, 0.017616184712362412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 979.2666666666668, 138, 1857, 1468.0, 1827.0, 1857.0, 1857.0, 0.07037825968639448, 33.782975880197434, 0.03814904883782034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 406.05263157894734, 143, 1627, 148.0, 1618.0, 1627.0, 1627.0, 0.10375596596804317, 14.76457101515656, 0.059589286786950774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 676.6, 137, 1279, 852.0, 1235.8, 1279.0, 1279.0, 0.07037594831590356, 11.045046911434216, 0.03821652245461924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68d01209-f2a4-4474-bec3-d50a768fad3b", 3, 0, 0.0, 368.0, 236, 551, 317.0, 551.0, 551.0, 551.0, 0.015870160923431766, 0.0218782980178169, 0.010177153977591334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 312.0, 139, 888, 151.0, 857.0, 888.0, 888.0, 0.10375993228299156, 4.840740023345985, 0.05969289278595418], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 641.0625, 152, 1666, 554.0, 1518.3000000000002, 1666.0, 1666.0, 0.08199241570154761, 0.016569634301014657, 0.055433959272829764], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 627.6, 285, 2105, 441.0, 1981.1000000000004, 2105.0, 2105.0, 0.05708968218173929, 6.909540818765949, 0.12693534022596095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c05c78d-bc12-4523-8643-62a5c15b0e86", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 804.5217391304348, 184, 1434, 816.0, 1374.2, 1423.3999999999999, 1434.0, 0.09710623422023694, 0.05964826301223538, 0.04390643207418916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 148.86666666666667, 139, 165, 149.0, 163.2, 165.0, 165.0, 0.07037000548886042, 0.052296459157248815, 0.035322444161400644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 212.53333333333333, 136, 576, 149.0, 487.20000000000005, 576.0, 576.0, 0.07037991075827316, 0.07520936557202446, 0.036986109351613346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbfa6970-b1ae-4fee-9eff-b2489443ec2c", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 1.0368049918831168, 1.9372717126623378], "isController": false}, {"data": ["login", 23, 0, 0.0, 3278.043478260869, 2061, 4773, 3045.0, 4599.8, 4763.8, 4773.0, 0.09830152068178516, 35.92525321323096, 0.19792613842777404], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 174.31578947368422, 139, 433, 152.0, 283.0, 433.0, 433.0, 0.10546708039366975, 0.08538301723276584, 0.037490251233687294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3675906-861a-45fa-ae0b-7d7d7d7ed9bb", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.5628163940809968, 2.1478290498442365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1131.7333333333333, 289, 2003, 1618.0, 1977.8, 2003.0, 2003.0, 0.07032085060100887, 44.91922423356133, 0.1485573750750089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eacce8df-2eb0-4bbe-a186-8a9db9e99a2a", 3, 0, 0.0, 859.0, 256, 1840, 481.0, 1840.0, 1840.0, 1840.0, 0.030790705312423023, 0.025668944109738072, 0.019745341622875442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57bdd42c-969d-4b8f-84d3-f74c45b4f4a8", 3, 0, 0.0, 378.3333333333333, 256, 480, 399.0, 480.0, 480.0, 480.0, 0.04069783216214016, 0.0333187004843042, 0.0260985447133516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 1029.3076923076924, 147, 2205, 1415.0, 2197.4, 2205.0, 2205.0, 0.05788119217446282, 37.29347127979768, 0.08797836857407457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 356.1, 283, 602, 300.5, 587.7, 601.3, 602.0, 0.0985333313626667, 0.15270741882085162, 0.22160377160959124], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1152.75, 404, 2067, 1158.0, 1884.0, 2027.75, 2067.0, 0.09839937024403043, 0.03074980320125951, 0.04439502837181842], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f610f262-16e7-4941-917b-a0c25ec6e7dc", 3, 0, 0.0, 627.6666666666666, 265, 904, 714.0, 904.0, 904.0, 904.0, 0.02367256113438913, 0.023741914340837535, 0.015180646300373237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d018c720-5031-496e-a064-8e3a30d344e7", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57bdd42c-969d-4b8f-84d3-f74c45b4f4a8", 1, 0, 0.0, 1008.0, 1008, 1008, 1008.0, 1008.0, 1008.0, 1008.0, 0.992063492063492, 0.17923022073412698, 0.6839812748015873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 628.9473684210527, 287, 1775, 304.0, 1768.0, 1775.0, 1775.0, 0.10366934933842586, 19.718127642886373, 0.22896667405538126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 153.69230769230768, 143, 166, 152.0, 164.8, 166.0, 166.0, 0.08925322513096196, 0.06929327537022925, 0.03172673237077163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 790.4705882352941, 288, 1838, 603.0, 1776.3999999999999, 1838.0, 1838.0, 0.1136994455479979, 24.149362509781497, 0.25057899979600984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 173.33333333333334, 142, 434, 151.5, 349.7000000000003, 434.0, 434.0, 0.059280922411152716, 0.04405545112781955, 0.029756244257160645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 146.66666666666669, 141, 153, 145.0, 152.7, 153.0, 153.0, 0.05928180098111381, 0.015862513153149592, 0.03380915212204147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 171.58333333333334, 142, 440, 148.0, 353.6000000000003, 440.0, 440.0, 0.05928385107896609, 0.01597885048612758, 0.0348524202632203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1d42ad6-8f8d-4820-9165-50df6b1b6f53", 1, 0, 0.0, 810.0, 810, 810, 810.0, 810.0, 810.0, 810.0, 1.2345679012345678, 0.39424189814814814, 0.7366415895061728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 194.66666666666666, 138, 444, 148.5, 438.0, 444.0, 444.0, 0.059201957611398355, 0.01595677763744721, 0.03486209027311837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 154.0, 152, 158, 152.0, 158.0, 158.0, 158.0, 0.024586939417781273, 0.0072512262736034614, 0.015198762354937057], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1659.6181818181822, 1095, 2410, 1627.0, 2215.0, 2382.4, 2410.0, 0.23457959072259044, 280.63874356505534, 0.4632030590244901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4be83a6-bb6b-42e2-be24-92c06b937b3b", 3, 0, 0.0, 445.33333333333337, 267, 739, 330.0, 739.0, 739.0, 739.0, 0.03917727717923604, 0.0251872143323539, 0.02512344923277832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1152.75, 404, 2067, 1158.0, 1884.0, 2027.75, 2067.0, 0.09660202381239887, 0.030188132441374645, 0.043584116212234646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 216.75, 137, 430, 150.0, 430.0, 430.0, 430.0, 0.021381913039759667, 0.005763093748997723, 0.01259110699509285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3675906-861a-45fa-ae0b-7d7d7d7ed9bb", 2, 0, 0.0, 271.0, 255, 287, 271.0, 287.0, 287.0, 287.0, 0.06710058377507884, 0.041249821764074344, 0.0417085171609743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 145.5, 138, 151, 146.5, 151.0, 151.0, 151.0, 0.021383170375755763, 0.00576343264034042, 0.012570965396684541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 325.8461538461538, 138, 1592, 150.0, 1132.7999999999997, 1592.0, 1592.0, 0.0869524503869384, 6.04009265661474, 0.05054372454132582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 273.9230769230769, 136, 1230, 148.0, 915.9999999999998, 1230.0, 1230.0, 0.08716349860873646, 1.9931447794092996, 0.05075152326594924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 147.0, 142, 150, 148.0, 150.0, 150.0, 150.0, 0.021381798743819323, 0.00572130161699853, 0.01219430709608446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 168.46153846153848, 138, 430, 150.0, 318.39999999999986, 430.0, 430.0, 0.08763296617367505, 0.06512567115055344, 0.043987641223895486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 146.0, 139, 149, 148.0, 149.0, 149.0, 149.0, 0.02138202733692195, 0.015890354300192974, 0.010732775440603401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 212.0, 138, 442, 150.0, 435.6, 442.0, 442.0, 0.08779927734440955, 0.033637042852801134, 0.04950581248100497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 226.25, 153, 443, 154.5, 443.0, 443.0, 443.0, 0.0213620439203623, 0.01681426503887892, 0.007593539049816287], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 511.66666666666663, 149, 904, 551.0, 808.6, 904.0, 904.0, 0.07988624199140423, 0.015821220581891386, 0.05436009123008836], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1588.6956521739128, 1043, 2396, 1530.0, 2300.8, 2378.7999999999997, 2396.0, 0.09764256876371773, 0.050537657660908585, 0.04491176746846782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 367.25, 290, 579, 300.0, 579.0, 579.0, 579.0, 0.021364782292868433, 0.0331112397449045, 0.048049896113746104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20940766-1ffd-4dcd-b788-99cfef80689b", 3, 0, 0.0, 409.6666666666667, 260, 564, 405.0, 564.0, 564.0, 564.0, 0.019997067096825798, 0.023987367269467146, 0.012823640032795191], "isController": false}, {"data": ["addBook", 55, 7, 12.727272727272727, 1530.654545454545, 742, 2900, 1235.0, 2652.2, 2713.2, 2900.0, 0.2603525647094465, 91.64554044902533, 0.9440138066740196], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e5925dd3-859f-43f8-a778-029f24a074f1", 3, 0, 0.0, 386.6666666666667, 255, 562, 343.0, 562.0, 562.0, 562.0, 0.02086709745630082, 0.024664202755152433, 0.013381569657849158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68d01209-f2a4-4474-bec3-d50a768fad3b", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 0.2783729776579353, 1.062331471494607], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 264.4363636363637, 142, 801, 152.0, 597.0, 604.1999999999999, 801.0, 0.23581467539038048, 0.17524899216023393, 0.11399244562327962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7cb1dcf-f888-4090-96ee-c6bbee29d882", 3, 0, 0.0, 388.0, 246, 620, 298.0, 620.0, 620.0, 620.0, 0.023842828077314342, 0.0239126801126971, 0.015289834411559003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cbc42818-a157-47b5-a2bc-c9d40309447c", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 946.8363636363637, 680, 1349, 875.0, 1185.2, 1325.1999999999998, 1349.0, 0.23556924236648577, 69.26517889074726, 0.11847476544798845], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 247.01818181818174, 139, 604, 154.0, 453.8, 524.1999999999996, 604.0, 0.23627154903923397, 0.418089889510832, 0.11490549943509622], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1392.418181818182, 952, 1914, 1353.0, 1692.6, 1792.3999999999999, 1914.0, 0.23517942051790783, 211.6148559833386, 0.11804904506465295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 169.0, 144, 452, 151.0, 216.79999999999978, 452.0, 452.0, 0.12226785290458074, 0.09134268307812916, 0.04346240083717518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 7, 4.242424242424242, 230.64848484848483, 138, 1085, 154.0, 427.20000000000005, 472.8999999999997, 1075.1000000000001, 0.6824555163086188, 1.5330973799395302, 0.3261536341790267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 202.41666666666666, 147, 449, 155.5, 445.1, 449.0, 449.0, 0.058532302514450164, 0.04532823817769432, 0.020806404409433456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 154.2, 141, 168, 153.0, 164.70000000000002, 167.85, 168.0, 0.10139931048468871, 0.08228791700466437, 0.03604428614885419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ebba5b3-ed4f-4455-a1a6-3bd666386435", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1.3141396604938271, 2.455471965020576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 371.0833333333333, 288, 879, 302.0, 788.7000000000003, 879.0, 879.0, 0.05915672094295813, 0.09168136341452593, 0.13304485188635995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a236bdaf-f75d-4c3b-9223-305d68595274", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c05c78d-bc12-4523-8643-62a5c15b0e86", 3, 0, 0.0, 356.3333333333333, 243, 568, 258.0, 568.0, 568.0, 568.0, 0.02172071504593931, 0.025673149847592985, 0.013928974166829573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 541.0769230769231, 287, 1734, 303.0, 1389.5999999999997, 1734.0, 1734.0, 0.08670250370152996, 8.102984650322133, 0.19328952842174768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 185.5, 145, 463, 155.0, 432.7000000000001, 463.0, 463.0, 0.05734339518774227, 0.0475434985492121, 0.020383785008142762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 172.8666666666667, 146, 431, 155.0, 270.2000000000001, 431.0, 431.0, 0.06981712567548069, 0.05420372550000698, 0.024817806392456027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eacce8df-2eb0-4bbe-a186-8a9db9e99a2a", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.2961705942622951, 1.130251024590164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f610f262-16e7-4941-917b-a0c25ec6e7dc", 1, 0, 0.0, 1041.0, 1041, 1041, 1041.0, 1041.0, 1041.0, 1041.0, 0.9606147934678194, 0.17354857108549473, 0.6622988712776178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 216.94117647058823, 137, 457, 149.0, 455.4, 457.0, 457.0, 0.11500784759430643, 0.08546969923756562, 0.057728548499485846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 257.88235294117646, 142, 604, 151.0, 480.7999999999999, 604.0, 604.0, 0.1147880809458538, 0.06113942362878885, 0.06376382943166396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 493.4117647058823, 136, 1700, 161.0, 1633.6, 1700.0, 1700.0, 0.11381057902805766, 18.09707848871267, 0.06518218479490664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 440.11764705882354, 142, 1176, 442.0, 1104.0, 1176.0, 1176.0, 0.11448813700862702, 5.965997338992639, 0.06568204413517682], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 29.62962962962963, 0.6230529595015576], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.11111111111111, 0.2336448598130841], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.11111111111111, 0.2336448598130841], "isController": false}, {"data": ["401/Unauthorized", 13, 48.148148148148145, 1.0124610591900312], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1284, 27, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
