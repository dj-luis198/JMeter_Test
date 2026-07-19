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

    var data = {"OkPercent": 97.82945736434108, "KoPercent": 2.1705426356589146};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7614465826144659, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05263157894736842, 500, 1500, "see books"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee4a0174-b224-475f-bde8-8ec22225cfe3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/11671797-e132-499b-90e5-a1885db9a707"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e0c8e84-3dfd-4899-a94e-233294380f96"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5024bfce-0e47-4c0b-9713-00701073f3d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/646567ff-d987-4f50-b954-90e157ed4e0f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b611999-6ac3-4236-83c3-50a21208deed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9d66a122-7435-4e1a-a698-5eec03306cba"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25a77d4c-ddd3-44af-8174-0bbf9b897c62"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5024bfce-0e47-4c0b-9713-00701073f3d9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b1ca574f-2ff4-48ff-b83a-2a0b5dd021c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93e5fed8-c827-4202-ae2e-72a390db2f53"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fb0ac1b-3c8d-4a3c-814d-728397a8b7a9"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e0c8e84-3dfd-4899-a94e-233294380f96"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee4a0174-b224-475f-bde8-8ec22225cfe3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35964912280701755, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/93e5fed8-c827-4202-ae2e-72a390db2f53"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9d1e028-5db6-4a5f-b687-520313b3b392"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e6a040f-eeae-42b8-93cf-485529cc55a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76b59c73-2bd2-4750-905c-8923c6f44628"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=646567ff-d987-4f50-b954-90e157ed4e0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/00e3ea38-0cf6-48dc-a4f4-50d6630be24d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25a77d4c-ddd3-44af-8174-0bbf9b897c62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.906060606060606, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6a9391b7-bed2-4c28-98ed-15e034465abc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d66a122-7435-4e1a-a698-5eec03306cba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a9391b7-bed2-4c28-98ed-15e034465abc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1ca574f-2ff4-48ff-b83a-2a0b5dd021c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76b59c73-2bd2-4750-905c-8923c6f44628"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9d1e028-5db6-4a5f-b687-520313b3b392"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0fb0ac1b-3c8d-4a3c-814d-728397a8b7a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11671797-e132-499b-90e5-a1885db9a707"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1290, 28, 2.1705426356589146, 385.73643410852634, 100, 2375, 124.0, 1099.8000000000002, 1311.45, 1854.5199999999977, 5.017385825301627, 719.8339742715553, 3.666334969817896], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1825.561403508772, 1295, 2586, 1784.0, 2246.4, 2372.9999999999995, 2586.0, 0.2436584677729616, 293.2045019241538, 1.1980667824578728], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 584.9333333333333, 120, 1052, 519.0, 912.2, 1052.0, 1052.0, 0.07907680466447711, 0.01549102247626378, 0.05324298918229312], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 584.9333333333333, 120, 1052, 519.0, 912.2, 1052.0, 1052.0, 0.08022162561102138, 0.015715291110909073, 0.05401380547325411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee4a0174-b224-475f-bde8-8ec22225cfe3", 3, 0, 0.0, 330.3333333333333, 218, 484, 289.0, 484.0, 484.0, 484.0, 0.0368423638060618, 0.02411783646288746, 0.023626125227194577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 120.10526315789473, 101, 347, 108.0, 115.0, 347.0, 347.0, 0.1300585948195608, 0.034800834941952796, 0.07417404235803078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 123.94736842105262, 102, 340, 112.0, 121.0, 340.0, 340.0, 0.13004969267204206, 0.09664825793303125, 0.0652788496420211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11671797-e132-499b-90e5-a1885db9a707", 3, 0, 0.0, 455.0, 210, 722, 433.0, 722.0, 722.0, 722.0, 0.11882599912860935, 0.05376567017863509, 0.07620026636828138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 142.21052631578945, 101, 340, 108.0, 334.0, 340.0, 340.0, 0.1300621560198242, 0.03505581548971824, 0.07658933601558007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 132.57894736842107, 105, 325, 111.0, 314.0, 325.0, 325.0, 0.1300639366930902, 0.035056295436809465, 0.07646336903246122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e0c8e84-3dfd-4899-a94e-233294380f96", 3, 0, 0.0, 357.0, 243, 514, 314.0, 514.0, 514.0, 514.0, 0.05668291576918717, 0.03644165320447417, 0.03634939585458943], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 226.06666666666663, 109, 445, 221.0, 356.20000000000005, 445.0, 445.0, 0.07961149590000796, 0.1390246845394475, 0.051457222089536396], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5024bfce-0e47-4c0b-9713-00701073f3d9", 1, 0, 0.0, 1006.0, 1006, 1006, 1006.0, 1006.0, 1006.0, 1006.0, 0.9940357852882703, 0.17958654324055665, 0.6853410785288271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 121.21052631578947, 106, 304, 111.0, 119.0, 304.0, 304.0, 0.10018666357318373, 0.07445512790936798, 0.05028900886388324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 141.68421052631578, 102, 351, 108.0, 319.0, 351.0, 351.0, 0.10019036168720569, 0.05056894283348889, 0.055811222243314924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 671.3333333333334, 515, 815, 637.0, 815.0, 815.0, 815.0, 0.04771106180968057, 14.028636328395239, 0.027210214938333453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/646567ff-d987-4f50-b954-90e157ed4e0f", 3, 0, 0.0, 394.0, 312, 445, 425.0, 445.0, 445.0, 445.0, 0.018572286434182912, 0.021951813815923878, 0.01190996232921235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1056.0, 769, 1260, 1132.5, 1260.0, 1260.0, 1260.0, 0.04747023220855256, 42.713798385023146, 0.027026509157798966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b611999-6ac3-4236-83c3-50a21208deed", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.0861766581632655, 2.0295227465986394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 291.0, 108, 339, 330.5, 339.0, 339.0, 339.0, 0.047823245285425066, 0.08462472700897483, 0.02648025398128517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 140.2142857142857, 105, 325, 109.0, 324.0, 325.0, 325.0, 0.06794731171314586, 0.05049600020869532, 0.03410636544976267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 156.2142857142857, 104, 342, 113.0, 331.5, 342.0, 342.0, 0.06794500337298409, 0.02546989733024669, 0.03834229054739407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 160.42857142857142, 103, 837, 108.5, 476.5, 837.0, 837.0, 0.06794830104980125, 4.384148942979242, 0.03952907580603672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 187.14285714285717, 101, 801, 109.5, 563.0, 801.0, 801.0, 0.06794599264241966, 1.4440324460314689, 0.03959408639332965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 109.33333333333333, 105, 113, 110.0, 113.0, 113.0, 113.0, 0.047905339050037125, 0.03560152638386548, 0.026899970657979833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 855.8, 106, 1401, 1095.0, 1353.6000000000001, 1401.0, 1401.0, 0.06735125475387606, 40.40790270157108, 0.035736505614849604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 301.42105263157896, 103, 1299, 109.0, 1180.0, 1299.0, 1299.0, 0.10019141834135743, 14.257332553444211, 0.057542090283014394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 562.9333333333333, 104, 869, 674.0, 868.4, 869.0, 869.0, 0.0673479283777231, 13.207735526930191, 0.03580051010443419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 250.47368421052627, 104, 957, 112.0, 813.0, 957.0, 957.0, 0.10019089001149559, 4.674232534486759, 0.057639629517818154], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 418.6, 116, 1006, 405.0, 806.8000000000002, 1006.0, 1006.0, 0.08023235289398097, 0.015717392568879475, 0.05455382119952717], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9d66a122-7435-4e1a-a698-5eec03306cba", 3, 0, 0.0, 432.0, 196, 742, 358.0, 742.0, 742.0, 742.0, 0.016407160084660945, 0.022618594713066115, 0.010521518674082703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 335.5, 216, 947, 224.5, 807.5, 947.0, 947.0, 0.06790940884859598, 5.900818876814758, 0.15148876220550356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25a77d4c-ddd3-44af-8174-0bbf9b897c62", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 580.9090909090909, 117, 1767, 488.0, 1246.0, 1692.899999999999, 1767.0, 0.09618958091948494, 0.059085201560894564, 0.043491968716524936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 112.6, 102, 141, 111.0, 127.2, 141.0, 141.0, 0.06741148871531678, 0.05009779581284773, 0.0338374074215555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 195.59999999999997, 101, 344, 113.0, 342.2, 344.0, 344.0, 0.06741603333048689, 0.08554287041739514, 0.034673610892633225], "isController": false}, {"data": ["login", 22, 0, 0.0, 2665.545454545455, 1788, 3897, 2462.5, 3776.8999999999996, 3891.9, 3897.0, 0.09638131954788398, 31.578444331573646, 0.18900630038114433], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 116.52631578947368, 109, 157, 112.0, 123.0, 157.0, 157.0, 0.09859323027746211, 0.07981815224610946, 0.035046812325191606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5024bfce-0e47-4c0b-9713-00701073f3d9", 3, 0, 0.0, 372.6666666666667, 235, 517, 366.0, 517.0, 517.0, 517.0, 0.04809310825758669, 0.03148282575065327, 0.03084095809487167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1ca574f-2ff4-48ff-b83a-2a0b5dd021c0", 3, 0, 0.0, 564.3333333333334, 201, 1031, 461.0, 1031.0, 1031.0, 1031.0, 0.02174574870612795, 0.02570273878644225, 0.013945027653343772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93e5fed8-c827-4202-ae2e-72a390db2f53", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 970.9999999999999, 217, 1520, 1212.0, 1468.4, 1520.0, 1520.0, 0.06731226608987534, 53.72068813750325, 0.1399052145129733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fb0ac1b-3c8d-4a3c-814d-728397a8b7a9", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 282.4210526315789, 214, 655, 227.0, 457.0, 655.0, 655.0, 0.12995007181451337, 0.20139723043909444, 0.2922607572156487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 743.9999999999999, 109, 1367, 918.5, 1361.2, 1367.0, 1367.0, 0.07846460461685734, 56.33096566388902, 0.12695327825118088], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1207.9999999999998, 189, 2315, 1074.5, 2203.5, 2300.75, 2315.0, 0.09788047977748504, 0.030731029539513125, 0.04416091958710751], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 146.125, 106, 356, 117.5, 345.5, 356.0, 356.0, 0.07851103816127149, 0.060953393884971514, 0.027908220596389473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 459.6315789473684, 214, 1604, 232.0, 1287.0, 1604.0, 1604.0, 0.10012911385734237, 19.04476743037074, 0.22114762292166215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e0c8e84-3dfd-4899-a94e-233294380f96", 1, 0, 0.0, 674.0, 674, 674, 674.0, 674.0, 674.0, 674.0, 1.483679525222552, 0.26804757047477745, 1.0229274851632046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 376.6875, 218, 665, 331.0, 663.6, 665.0, 665.0, 0.10575645610115605, 0.16390185139895963, 0.23784874843843984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee4a0174-b224-475f-bde8-8ec22225cfe3", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 110.83333333333334, 108, 118, 109.0, 118.0, 118.0, 118.0, 0.037100933088467174, 0.027572080156565936, 0.018622929304172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 110.5, 106, 116, 110.5, 116.0, 116.0, 116.0, 0.0371016213408526, 0.009927582272845323, 0.021159518420955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 107.33333333333334, 102, 110, 108.0, 110.0, 110.0, 110.0, 0.03710116250309176, 0.009999922705911452, 0.021811425612169182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 108.16666666666667, 103, 113, 108.0, 113.0, 113.0, 113.0, 0.03710230961877377, 0.010000231889435118, 0.021848332714961505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 117.0, 116, 118, 117.0, 118.0, 118.0, 118.0, 0.1374570446735395, 0.04053908934707903, 0.08497100515463916], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1264.754385964912, 846, 2112, 1202.0, 1795.4, 1900.5999999999992, 2112.0, 0.25128951196931626, 300.6296186846978, 0.4961986261737865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1207.9999999999998, 189, 2315, 1074.5, 2203.5, 2300.75, 2315.0, 0.09520333846373547, 0.029890501285245067, 0.04295306872094314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93e5fed8-c827-4202-ae2e-72a390db2f53", 3, 0, 0.0, 454.33333333333337, 203, 938, 222.0, 938.0, 938.0, 938.0, 0.02410994133247609, 0.02418057592622358, 0.015461127742505826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9d1e028-5db6-4a5f-b687-520313b3b392", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 141.16666666666666, 100, 318, 105.5, 318.0, 318.0, 318.0, 0.03422918722794927, 0.009225835620033204, 0.020156445213333412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 145.16666666666666, 106, 328, 109.0, 328.0, 328.0, 328.0, 0.03422860141934601, 0.009225677726308104, 0.02012267388129521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 162.875, 102, 335, 110.0, 330.8, 335.0, 335.0, 0.07882860690144453, 0.021246772953904973, 0.046342598979169536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 175.8125, 103, 338, 110.0, 331.7, 338.0, 338.0, 0.07883287922310198, 0.021247924478101702, 0.04642209587063524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 112.25000000000001, 107, 120, 111.5, 117.2, 120.0, 120.0, 0.07891180619260399, 0.058644418469308235, 0.039610027717771924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 111.0, 107, 115, 110.5, 115.0, 115.0, 115.0, 0.03422801563079381, 0.0091586682449585, 0.019520665164437092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 147.0, 102, 327, 109.0, 311.6, 327.0, 327.0, 0.07891414141414142, 0.021115697995580808, 0.04500572127525252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 113.33333333333334, 102, 119, 115.0, 119.0, 119.0, 119.0, 0.034226063147086504, 0.02543558013177034, 0.017179879353127404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e6a040f-eeae-42b8-93cf-485529cc55a1", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.7241177721088435, 1.3530151643990929], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 153.83333333333331, 110, 333, 119.5, 333.0, 333.0, 333.0, 0.03507889828873441, 0.02761092970773431, 0.01246945212607356], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 488.99999999999994, 110, 938, 486.0, 820.4000000000001, 938.0, 938.0, 0.07873850417838996, 0.015137682476483434, 0.05358421771983791], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1481.8636363636363, 1100, 2375, 1424.0, 2206.2, 2372.45, 2375.0, 0.09554333758935474, 0.04945114152574025, 0.04394620312947859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 262.83333333333337, 214, 440, 232.5, 440.0, 440.0, 440.0, 0.03420460051876977, 0.05301045021805433, 0.07692694823703788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76b59c73-2bd2-4750-905c-8923c6f44628", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["addBook", 54, 13, 24.074074074074073, 1118.0, 553, 2631, 952.5, 1906.5, 2289.0, 2631.0, 0.267335996791968, 83.98036225265233, 0.9705965599674247], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 192.50877192982458, 103, 476, 115.0, 438.8, 463.4, 476.0, 0.2525554625088062, 0.18769014352461086, 0.12208491595884674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=646567ff-d987-4f50-b954-90e157ed4e0f", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00e3ea38-0cf6-48dc-a4f4-50d6630be24d", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 698.7894736842104, 503, 1019, 636.0, 960.4000000000001, 1013.5999999999999, 1019.0, 0.2520584775667955, 74.11356153377584, 0.12676769135439422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25a77d4c-ddd3-44af-8174-0bbf9b897c62", 3, 0, 0.0, 331.0, 229, 530, 234.0, 530.0, 530.0, 530.0, 0.07037958053769999, 0.031844927391732746, 0.045132738821376625], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 152.40350877192984, 101, 346, 114.0, 321.20000000000005, 329.0, 346.0, 0.2529387488850726, 0.44758302048803866, 0.1230112274851232], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1070.8070175438597, 736, 1686, 1089.0, 1368.0000000000002, 1595.7999999999995, 1686.0, 0.2517912518000866, 226.56221097152772, 0.12638740568871534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 130.0, 109, 325, 115.0, 199.70000000000013, 325.0, 325.0, 0.10256015794264324, 0.07661964924425983, 0.03645693114367396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 13, 7.878787878787879, 180.2424242424243, 105, 2168, 118.0, 301.80000000000007, 401.19999999999993, 1185.920000000005, 0.7042343691980691, 1.6011078486920447, 0.3339903186447116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 150.66666666666666, 112, 305, 121.5, 305.0, 305.0, 305.0, 0.03739622547430879, 0.028960162891725465, 0.013293189524070704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a9391b7-bed2-4c28-98ed-15e034465abc", 3, 0, 0.0, 453.0, 207, 591, 561.0, 591.0, 591.0, 591.0, 0.058517174790801096, 0.026477497708077318, 0.03752566221936138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d66a122-7435-4e1a-a698-5eec03306cba", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 118.1578947368421, 109, 131, 118.0, 128.0, 131.0, 131.0, 0.12685271731873415, 0.10294395321471492, 0.045092176859393776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a9391b7-bed2-4c28-98ed-15e034465abc", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 0.7787244073275862, 2.9717807112068964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1ca574f-2ff4-48ff-b83a-2a0b5dd021c0", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 223.83333333333331, 217, 232, 222.0, 232.0, 232.0, 232.0, 0.037076172997423204, 0.05746082670596741, 0.08338518204400941], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76b59c73-2bd2-4750-905c-8923c6f44628", 3, 0, 0.0, 357.6666666666667, 290, 486, 297.0, 486.0, 486.0, 486.0, 0.03173293561387364, 0.02645444274320651, 0.02034957134092808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 344.6875, 217, 452, 420.0, 449.9, 452.0, 452.0, 0.07878396943181987, 0.12209976512529114, 0.17718699375144645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9d1e028-5db6-4a5f-b687-520313b3b392", 3, 0, 0.0, 312.6666666666667, 237, 460, 241.0, 460.0, 460.0, 460.0, 0.01922756463666312, 0.02650675007691026, 0.012330176541089305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fb0ac1b-3c8d-4a3c-814d-728397a8b7a9", 3, 0, 0.0, 379.3333333333333, 221, 561, 356.0, 561.0, 561.0, 561.0, 0.06334860738644763, 0.028663595139050195, 0.040623944189876894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 148.35714285714286, 110, 344, 117.0, 336.0, 344.0, 344.0, 0.06762958311192696, 0.056071793029322255, 0.024040203371817788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 132.93333333333337, 110, 347, 118.0, 220.4000000000001, 347.0, 347.0, 0.06869798989681562, 0.053334865203094155, 0.024419988596133677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11671797-e132-499b-90e5-a1885db9a707", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 0.7958769273127753, 3.037238436123348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 152.62500000000003, 107, 336, 112.0, 330.4, 336.0, 336.0, 0.10583410504034925, 0.07865210345283767, 0.053123759756581554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 179.31249999999997, 103, 346, 112.0, 345.3, 346.0, 346.0, 0.10598272481585502, 0.028358658788617458, 0.06044327274654232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 177.6875, 101, 341, 110.0, 338.2, 341.0, 341.0, 0.10597921482649215, 0.02856471024620296, 0.06230418684135573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 175.0, 103, 333, 109.0, 330.2, 333.0, 333.0, 0.10598412887670071, 0.028566034736298238, 0.062410575891260284], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.5426356589147286], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.142857142857143, 0.15503875968992248], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.15503875968992248], "isController": false}, {"data": ["401/Unauthorized", 17, 60.714285714285715, 1.317829457364341], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1290, 28, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
