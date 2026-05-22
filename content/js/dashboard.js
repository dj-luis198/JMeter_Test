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

    var data = {"OkPercent": 97.27479182437547, "KoPercent": 2.7252081756245268};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7870967741935484, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.40350877192982454, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b745f5b-d029-4493-8ab8-e075e37d3f4b"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2fc1b41b-4d7a-441b-8eee-9585ef804484"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/768f5124-7cf8-4590-8c48-f5515c7f0a56"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0cf058e9-ae0f-4f34-ada1-83e464f1ef65"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11cc5d42-48cd-46df-a7f8-0c81f7253ed8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ed34ff1-e1ba-4883-ad22-281fd9a4e5a7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd206b7c-c0d0-42ef-b451-43910b954285"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c24ef1c-c592-4e3a-857c-8731b46e818e"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db2222b6-1acf-4c40-851b-46a05bdfaac0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c7320704-ad8a-47c8-a910-a31ca8c465ab"], "isController": false}, {"data": [0.7708333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4ed34ff1-e1ba-4883-ad22-281fd9a4e5a7"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8d96fed-65e4-4d1c-b107-675683dfc317"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1850301c-c6dd-490d-9e29-0fc772957bee"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "register"], "isController": true}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab8bd631-3a9e-42f7-8d4c-613cc66fe1fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0cf058e9-ae0f-4f34-ada1-83e464f1ef65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b745f5b-d029-4493-8ab8-e075e37d3f4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de849e17-c79b-4081-9fb8-55386d7a64ba"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db2222b6-1acf-4c40-851b-46a05bdfaac0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2fc1b41b-4d7a-441b-8eee-9585ef804484"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fd206b7c-c0d0-42ef-b451-43910b954285"], "isController": false}, {"data": [0.2909090909090909, 500, 1500, "addBook"], "isController": true}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=768f5124-7cf8-4590-8c48-f5515c7f0a56"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8862275449101796, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4c24ef1c-c592-4e3a-857c-8731b46e818e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/11cc5d42-48cd-46df-a7f8-0c81f7253ed8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c260bc09-f13c-49be-a879-2686ee51648b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16077577-e553-4805-bb42-e8806644c1b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/de849e17-c79b-4081-9fb8-55386d7a64ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ab8bd631-3a9e-42f7-8d4c-613cc66fe1fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7320704-ad8a-47c8-a910-a31ca8c465ab"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b8d96fed-65e4-4d1c-b107-675683dfc317"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1850301c-c6dd-490d-9e29-0fc772957bee"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 36, 2.7252081756245268, 313.88493565480684, 77, 2306, 97.0, 854.8, 1057.5999999999995, 1698.1799999999992, 5.274611192078101, 777.2453587302102, 3.8476628788256906], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1314.7017543859645, 949, 2001, 1278.0, 1641.2, 1668.8999999999996, 2001.0, 0.273362939658728, 328.948128370577, 1.344123438653999], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b745f5b-d029-4493-8ab8-e075e37d3f4b", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 591.5882352941176, 83, 1190, 565.0, 1092.3999999999999, 1190.0, 1190.0, 0.09464741055819702, 0.01900777500640262, 0.06353142189640006], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 591.5882352941176, 83, 1190, 565.0, 1092.3999999999999, 1190.0, 1190.0, 0.09172975335488083, 0.018421830062538107, 0.061572964611200744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 99.74999999999999, 77, 236, 80.5, 233.9, 236.0, 236.0, 0.10243933670529483, 0.03702671825981177, 0.05788472773545041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 82.0, 78, 89, 81.5, 86.9, 89.0, 89.0, 0.1024386808458874, 0.07612874621457062, 0.051419415971470823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 134.125, 79, 619, 81.0, 353.7000000000003, 619.0, 619.0, 0.10208834470129588, 1.9018814363511074, 0.05956815035060966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 156.0625, 78, 855, 81.0, 486.8000000000004, 855.0, 855.0, 0.10193420147294921, 5.758293153605285, 0.059378663260365436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2fc1b41b-4d7a-441b-8eee-9585ef804484", 3, 0, 0.0, 261.0, 180, 415, 188.0, 415.0, 415.0, 415.0, 0.02933440240933225, 0.02942034304139084, 0.018811449461713713], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 256.35294117647055, 78, 1269, 185.0, 534.5999999999993, 1269.0, 1269.0, 0.09455581017643001, 0.1308018419610875, 0.06111255861069704], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/768f5124-7cf8-4590-8c48-f5515c7f0a56", 3, 0, 0.0, 610.0, 198, 1406, 226.0, 1406.0, 1406.0, 1406.0, 0.036454219575915915, 0.030034384683152074, 0.02337721763169087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0cf058e9-ae0f-4f34-ada1-83e464f1ef65", 3, 0, 0.0, 1010.3333333333334, 216, 1955, 860.0, 1955.0, 1955.0, 1955.0, 0.03675074420257011, 0.03063758330168686, 0.023567371770528353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11cc5d42-48cd-46df-a7f8-0c81f7253ed8", 1, 0, 0.0, 1054.0, 1054, 1054, 1054.0, 1054.0, 1054.0, 1054.0, 0.9487666034155597, 0.17140802893738138, 0.6541300996204933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 111.21052631578947, 78, 334, 81.0, 239.0, 334.0, 334.0, 0.09498907625623053, 0.07059246780370257, 0.04768006366767822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 104.73684210526316, 78, 239, 80.0, 238.0, 239.0, 239.0, 0.09499002604726503, 0.04794418461061589, 0.05291436586658401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 602.875, 475, 625, 620.0, 625.0, 625.0, 625.0, 0.05677624481916766, 16.694101125589054, 0.03238020212343156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ed34ff1-e1ba-4883-ad22-281fd9a4e5a7", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 846.875, 706, 1089, 855.5, 1089.0, 1089.0, 1089.0, 0.05662353840491492, 50.949959390306056, 0.03223781532232949], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 186.50000000000003, 78, 318, 232.0, 318.0, 318.0, 318.0, 0.05687473339968719, 0.10064161808616523, 0.03149216195080336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 82.07142857142857, 79, 89, 82.0, 86.5, 89.0, 89.0, 0.07481709891354885, 0.0556013791730573, 0.03755467660308995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 91.35714285714286, 78, 239, 80.0, 162.0, 239.0, 239.0, 0.07482069754267452, 0.020020381959660955, 0.04267117906730656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 113.71428571428572, 79, 243, 80.0, 239.0, 243.0, 243.0, 0.0747591686780443, 0.020149932182754127, 0.043950214398615885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 135.7142857142857, 78, 238, 81.0, 237.0, 238.0, 238.0, 0.07475876947065452, 0.02014982458388735, 0.04402298631914518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd206b7c-c0d0-42ef-b451-43910b954285", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 82.25, 79, 89, 81.5, 89.0, 89.0, 89.0, 0.0569358546427631, 0.04231268103822532, 0.03197081681600467], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c24ef1c-c592-4e3a-857c-8731b46e818e", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 1.0753813244047619, 4.103887648809524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 649.0, 80, 943, 857.0, 942.5, 943.0, 943.0, 0.13058605154418004, 83.9397410956636, 0.06875443059817739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 235.0, 78, 1013, 81.0, 855.0, 1013.0, 1013.0, 0.09499050094990501, 13.517237143473151, 0.05455509136586341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 453.49999999999994, 79, 707, 543.5, 703.0, 707.0, 707.0, 0.13058605154418004, 27.436224162616945, 0.0688819560391385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 145.36842105263156, 78, 471, 80.0, 463.0, 471.0, 471.0, 0.09499097585729356, 4.431639541118594, 0.054648128740269676], "isController": false}, {"data": ["deleteBooks", 17, 3, 17.647058823529413, 359.70588235294116, 82, 1054, 373.0, 751.5999999999997, 1054.0, 1054.0, 0.09196446925681889, 0.018468967401300485, 0.062248238812792796], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 219.28571428571428, 161, 323, 166.0, 322.0, 323.0, 323.0, 0.07472245943637916, 0.11580521789602903, 0.16805256258005977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db2222b6-1acf-4c40-851b-46a05bdfaac0", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.009296438547486, 3.85169343575419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7320704-ad8a-47c8-a910-a31ca8c465ab", 3, 0, 0.0, 306.6666666666667, 171, 546, 203.0, 546.0, 546.0, 546.0, 0.02750577621300473, 0.027586359541753768, 0.01763879529284483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 527.2916666666666, 119, 1558, 413.0, 1169.5, 1487.0, 1558.0, 0.10530564964810361, 0.06468481799673553, 0.047613784948312476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 83.14285714285715, 78, 94, 81.5, 92.5, 94.0, 94.0, 0.13057143656559816, 0.09703599924455097, 0.06554074061984126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 156.2142857142857, 80, 331, 82.0, 289.0, 331.0, 331.0, 0.13058605154418004, 0.1750377766791967, 0.06664115186225036], "isController": false}, {"data": ["login", 24, 0, 0.0, 2801.4166666666665, 1842, 4119, 2630.0, 3866.5, 4109.25, 4119.0, 0.10360994310087292, 41.457164573601915, 0.21359432606049095], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 101.47368421052632, 80, 240, 85.0, 238.0, 240.0, 240.0, 0.09839308555537718, 0.07965612102090594, 0.03497566713101298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ed34ff1-e1ba-4883-ad22-281fd9a4e5a7", 3, 0, 0.0, 414.66666666666663, 165, 872, 207.0, 872.0, 872.0, 872.0, 0.09120204292576153, 0.042275946981212384, 0.05848568507934578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 733.2857142857143, 162, 1025, 944.0, 1025.0, 1025.0, 1025.0, 0.13047287096233062, 111.55128311914036, 0.2695917538815679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8d96fed-65e4-4d1c-b107-675683dfc317", 1, 0, 0.0, 676.0, 676, 676, 676.0, 676.0, 676.0, 676.0, 1.4792899408284024, 0.2672545303254438, 1.0199010724852071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 278.625, 159, 936, 180.0, 567.8000000000004, 936.0, 936.0, 0.10188032881876126, 7.765794485488421, 0.2275020575050781], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, 38.46153846153846, 602.6923076923078, 78, 1174, 802.0, 1105.6, 1174.0, 1174.0, 0.09196052771195133, 67.71208673027269, 0.1509210974251052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1850301c-c6dd-490d-9e29-0fc772957bee", 3, 0, 0.0, 530.3333333333334, 351, 851, 389.0, 851.0, 851.0, 851.0, 0.04057618178129438, 0.026086575201190235, 0.026020533238655576], "isController": false}, {"data": ["register", 26, 8, 30.76923076923077, 987.6538461538461, 199, 1881, 899.0, 1748.4, 1836.5499999999997, 1881.0, 0.10514524197559821, 0.032952670486943794, 0.04743857596945936], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 347.89473684210526, 159, 1095, 164.0, 1091.0, 1095.0, 1095.0, 0.09495110018340555, 18.059898371088888, 0.2097113346001809], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 85.92857142857144, 81, 100, 85.5, 95.5, 100.0, 100.0, 0.07817516821621018, 0.060692635480358484, 0.02778882932685596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 322.3333333333333, 160, 924, 316.5, 646.8000000000004, 924.0, 924.0, 0.11299647827642705, 7.6755641094151175, 0.25252554975925473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 119.625, 79, 241, 80.0, 241.0, 241.0, 241.0, 0.05579928995403534, 0.04146802700685633, 0.02800862796520914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 118.625, 78, 237, 80.0, 237.0, 237.0, 237.0, 0.05579928995403534, 0.01493066938223211, 0.031823032551910775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 137.875, 79, 237, 81.0, 237.0, 237.0, 237.0, 0.055798900761654995, 0.015039547470914821, 0.03280365064308233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab8bd631-3a9e-42f7-8d4c-613cc66fe1fe", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0cf058e9-ae0f-4f34-ada1-83e464f1ef65", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 118.375, 78, 239, 79.0, 239.0, 239.0, 239.0, 0.055799679151844875, 0.01503975727139569, 0.032858600125549274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 134.66666666666666, 82, 240, 82.0, 240.0, 240.0, 240.0, 0.12619888944977284, 0.03721881309944473, 0.07801161818525998], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 885.8771929824561, 620, 1639, 792.0, 1274.8000000000002, 1336.9999999999995, 1639.0, 0.2655992991906211, 317.74909908834206, 0.5244548661752303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b745f5b-d029-4493-8ab8-e075e37d3f4b", 3, 0, 0.0, 711.3333333333334, 417, 1269, 448.0, 1269.0, 1269.0, 1269.0, 0.02277835145477738, 0.02692324027744032, 0.014607211056611795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de849e17-c79b-4081-9fb8-55386d7a64ba", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, 30.76923076923077, 987.6538461538461, 199, 1881, 899.0, 1748.4, 1836.5499999999997, 1881.0, 0.10580288109383902, 0.033158775535118416, 0.047735284243509396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 79.44444444444444, 77, 82, 79.0, 82.0, 82.0, 82.0, 0.04257493188010899, 0.011475274608310626, 0.02507098039424387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 97.55555555555557, 78, 237, 81.0, 237.0, 237.0, 237.0, 0.04257493188010899, 0.011475274608310626, 0.025029403312329702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 136.14285714285717, 78, 865, 80.0, 475.0, 865.0, 865.0, 0.07423235788480198, 4.789607809575443, 0.04318483989671097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 141.78571428571428, 79, 624, 80.5, 430.5, 624.0, 624.0, 0.07423275148995737, 1.5776427356624743, 0.043257561798765616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 113.66666666666666, 78, 235, 80.0, 235.0, 235.0, 235.0, 0.04254393843419398, 0.011383827276337062, 0.024263339888251256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 93.64285714285714, 78, 237, 81.0, 166.5, 237.0, 237.0, 0.07423196428382062, 0.05516652814451903, 0.03726096644715214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 110.00000000000001, 80, 336, 82.0, 336.0, 336.0, 336.0, 0.042574126284319475, 0.031639560646842896, 0.0213702157325588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 114.5, 78, 240, 80.5, 238.0, 240.0, 240.0, 0.07417061360289054, 0.027803632638248726, 0.04185548716848385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 103.77777777777777, 81, 246, 85.0, 246.0, 246.0, 246.0, 0.04313691657320335, 0.03395347144336123, 0.015333825813130877], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 609.375, 80, 1406, 586.0, 1044.8000000000004, 1406.0, 1406.0, 0.09364337092724496, 0.017935357542095624, 0.0637282462059803], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1525.458333333333, 1037, 2306, 1515.0, 1912.0, 2238.25, 2306.0, 0.10547642382185031, 0.05459228967341863, 0.04851503478524561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 226.44444444444446, 160, 574, 163.0, 574.0, 574.0, 574.0, 0.04252665003402132, 0.06590800156639827, 0.09564343264487411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db2222b6-1acf-4c40-851b-46a05bdfaac0", 3, 0, 0.0, 341.66666666666663, 185, 626, 214.0, 626.0, 626.0, 626.0, 0.10414135453188461, 0.04712125091123685, 0.06678335560801195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2fc1b41b-4d7a-441b-8eee-9585ef804484", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd206b7c-c0d0-42ef-b451-43910b954285", 3, 0, 0.0, 752.0, 238, 1640, 378.0, 1640.0, 1640.0, 1640.0, 0.04468874290566207, 0.028730555741758652, 0.0286578201576023], "isController": false}, {"data": ["addBook", 55, 17, 30.90909090909091, 882.0000000000001, 407, 3031, 664.0, 1542.6, 1736.7999999999988, 3031.0, 0.25809115779693387, 90.89205744258645, 0.933678674455545], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 142.59649122807028, 77, 634, 82.0, 319.4, 324.99999999999994, 634.0, 0.26677025464858867, 0.19825406619880467, 0.12895632426860487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=768f5124-7cf8-4590-8c48-f5515c7f0a56", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 496.6140350877193, 384, 722, 468.0, 628.8, 642.7999999999996, 722.0, 0.2668426892125332, 78.46061063965001, 0.13420311029731893], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 124.89473684210525, 78, 321, 83.0, 239.2, 241.49999999999997, 321.0, 0.26751018415964256, 0.47336763056374254, 0.1300977262807637], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 739.1929824561402, 539, 1078, 705.0, 946.6000000000001, 988.9999999999999, 1078.0, 0.2664310854963331, 239.73515906549298, 0.13373591596202655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 102.16666666666664, 81, 246, 84.0, 242.4, 246.0, 246.0, 0.11613577562568149, 0.08676159018910774, 0.04128263899194146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 17, 10.179640718562874, 143.82634730538922, 80, 1898, 86.0, 242.80000000000015, 317.79999999999984, 1470.2799999999957, 0.6912537770603088, 1.6104206442216151, 0.3273155837369096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 106.0, 81, 238, 84.0, 238.0, 238.0, 238.0, 0.05521125205316844, 0.04275636999820564, 0.01962587475327472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c24ef1c-c592-4e3a-857c-8731b46e818e", 3, 0, 0.0, 934.3333333333334, 172, 1887, 744.0, 1887.0, 1887.0, 1887.0, 0.07770410277662661, 0.0351590829620804, 0.049829779449854956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11cc5d42-48cd-46df-a7f8-0c81f7253ed8", 3, 0, 0.0, 282.3333333333333, 172, 372, 303.0, 372.0, 372.0, 372.0, 0.03259735744089012, 0.027175075653033728, 0.020903904348487483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 87.75000000000001, 79, 108, 84.5, 103.10000000000001, 108.0, 108.0, 0.10409821666742572, 0.08447814262756911, 0.03700366295599899], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c260bc09-f13c-49be-a879-2686ee51648b", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16077577-e553-4805-bb42-e8806644c1b2", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.7208486173814899, 1.346906743792325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 278.25, 160, 478, 238.0, 478.0, 478.0, 478.0, 0.05576739419879682, 0.08642856893895562, 0.12542217660139557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 276.7142857142857, 159, 1103, 174.5, 711.5, 1103.0, 1103.0, 0.07413879842190271, 6.442106162456642, 0.16538495909127016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de849e17-c79b-4081-9fb8-55386d7a64ba", 3, 0, 0.0, 518.3333333333334, 204, 890, 461.0, 890.0, 890.0, 890.0, 0.0683168993236627, 0.031712206521986655, 0.043809990777218595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 86.07142857142857, 81, 98, 83.0, 96.5, 98.0, 98.0, 0.07593879333257395, 0.06296097220640164, 0.026993867942438392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab8bd631-3a9e-42f7-8d4c-613cc66fe1fe", 3, 0, 0.0, 715.0, 179, 1604, 362.0, 1604.0, 1604.0, 1604.0, 0.06136224176723256, 0.027764816424626713, 0.0393501355082839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 87.7857142857143, 80, 116, 84.0, 107.0, 116.0, 116.0, 0.1335011633672808, 0.1036459227314338, 0.04745549166571309], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7320704-ad8a-47c8-a910-a31ca8c465ab", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8d96fed-65e4-4d1c-b107-675683dfc317", 3, 0, 0.0, 471.0, 291, 820, 302.0, 820.0, 820.0, 820.0, 0.04090425676965449, 0.02677684256633307, 0.02623091986856099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 107.44444444444443, 80, 377, 81.0, 253.7000000000002, 377.0, 377.0, 0.11316342055299192, 0.08409898734455747, 0.05680273258226352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 122.94444444444444, 78, 240, 80.0, 238.2, 240.0, 240.0, 0.11316484345529988, 0.039723119420344524, 0.06401132041368038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 165.22222222222223, 78, 843, 81.0, 296.70000000000084, 843.0, 843.0, 0.11316413199967308, 5.685767026879625, 0.06598785214477464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1850301c-c6dd-490d-9e29-0fc772957bee", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 193.88888888888889, 80, 636, 232.0, 349.80000000000047, 636.0, 636.0, 0.11305467449674968, 1.8755471178909022, 0.0660344306440976], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.22222222222222, 0.6056018168054504], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.333333333333334, 0.22710068130204392], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.555555555555555, 0.1514004542013626], "isController": false}, {"data": ["401/Unauthorized", 23, 63.888888888888886, 1.7411052233156699], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 36, "401/Unauthorized", 23, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
