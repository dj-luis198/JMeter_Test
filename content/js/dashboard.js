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

    var data = {"OkPercent": 97.109375, "KoPercent": 2.890625};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6919494344644045, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1353f6c-5d1c-4fec-8169-7a176262fb5e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/53baf2f3-4202-4ab2-be3d-91a0c0618dbc"], "isController": false}, {"data": [0.40625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.40625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/835b4583-fd88-468d-a2a5-9ac02d5d8351"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c98a9591-d6fb-4b8a-8b64-e41f06222c3d"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b929c04-e885-4e40-9e0c-807b2f2e75f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b773f40-bad6-40dd-920b-fc085f9116a1"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=835b4583-fd88-468d-a2a5-9ac02d5d8351"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf6824f7-8498-4d42-b498-999d7367aae1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a7a5793-cb86-45f0-8980-1ef43d896d83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/670f3aef-fbd3-4dc8-9245-84c69689bba2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69712777-2444-4bdd-a3d5-edd16e511fab"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9dd4f48c-ba5f-4eb3-83ed-79b7edf48027"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.17307692307692307, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ef95c95-d8fb-42e8-885b-0db4e063dc18"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ec6de7a-7a1c-466a-b787-43da25b5bfd8"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/69712777-2444-4bdd-a3d5-edd16e511fab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2037037037037037, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.17307692307692307, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7df38f88-30d5-4f46-bfa0-42ba2b753490"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1b929c04-e885-4e40-9e0c-807b2f2e75f3"], "isController": false}, {"data": [0.22641509433962265, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b773f40-bad6-40dd-920b-fc085f9116a1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c1353f6c-5d1c-4fec-8169-7a176262fb5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3055555555555556, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.89375, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/29299cdc-bfd7-40fe-a4ec-5e2245c66f7e"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a7a5793-cb86-45f0-8980-1ef43d896d83"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bf6824f7-8498-4d42-b498-999d7367aae1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a069a94c-1ac3-4a2a-ae4f-1bb9965c8a82"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dd4f48c-ba5f-4eb3-83ed-79b7edf48027"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7df38f88-30d5-4f46-bfa0-42ba2b753490"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53baf2f3-4202-4ab2-be3d-91a0c0618dbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3ec6de7a-7a1c-466a-b787-43da25b5bfd8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ef95c95-d8fb-42e8-885b-0db4e063dc18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1280, 37, 2.890625, 537.6585937499992, 144, 4945, 188.5, 1461.0, 1758.95, 2407.4700000000007, 5.046622114455813, 748.4746935803419, 3.681232689199046], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2518.5925925925917, 1977, 3610, 2506.0, 3078.0, 3251.75, 3610.0, 0.24208407490260597, 291.3081957927805, 1.1903255050142785], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1353f6c-5d1c-4fec-8169-7a176262fb5e", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53baf2f3-4202-4ab2-be3d-91a0c0618dbc", 3, 0, 0.0, 988.6666666666666, 238, 2336, 392.0, 2336.0, 2336.0, 2336.0, 0.02535068446848065, 0.0254249540518844, 0.016256786589487916], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 565.0625, 151, 1387, 518.0, 1112.6000000000004, 1387.0, 1387.0, 0.08842612549877861, 0.01850126698057941, 0.059044300107216674], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 565.0625, 151, 1387, 518.0, 1112.6000000000004, 1387.0, 1387.0, 0.09120342924893976, 0.019082358121665376, 0.06089877416890876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 218.8, 145, 585, 149.0, 498.6, 585.0, 585.0, 0.07896399241945672, 0.0290357180459044, 0.044592035823331225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 168.60000000000002, 146, 436, 148.0, 274.0000000000001, 436.0, 436.0, 0.07907722154274387, 0.05876734921291806, 0.03969305846969761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 315.3333333333333, 146, 1147, 153.0, 724.0000000000002, 1147.0, 1147.0, 0.07908514306502382, 1.5701387186361502, 0.046117553804259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 335.79999999999995, 146, 1759, 153.0, 967.6000000000005, 1759.0, 1759.0, 0.07896357673417176, 4.756635284676855, 0.045969550986781495], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 339.62499999999994, 150, 1245, 255.5, 967.1000000000003, 1245.0, 1245.0, 0.0893570203901551, 0.11338699059517361, 0.05774610179998548], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 166.1578947368421, 146, 449, 150.0, 163.0, 449.0, 449.0, 0.11872625474905019, 0.08823308580471405, 0.05959501459083183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 195.4736842105263, 145, 451, 148.0, 442.0, 451.0, 451.0, 0.11873367411980852, 0.07870011623401783, 0.06509114762345178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 1018.0, 729, 1189, 1082.5, 1187.1, 1189.0, 1189.0, 0.05201749868655816, 15.294871757359177, 0.0296662297196777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 1490.5, 1308, 1736, 1459.0, 1735.7, 1736.0, 1736.0, 0.051982617012870894, 46.774050163875195, 0.0295955719907263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/835b4583-fd88-468d-a2a5-9ac02d5d8351", 3, 0, 0.0, 747.6666666666667, 276, 1395, 572.0, 1395.0, 1395.0, 1395.0, 0.07012786647654222, 0.032507188106313846, 0.04497132062460553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 325.1, 146, 455, 435.5, 454.1, 455.0, 455.0, 0.05221932114882506, 0.09240372062663185, 0.028914409268929502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 174.15384615384616, 147, 437, 149.0, 330.9999999999999, 437.0, 437.0, 0.06177943790216038, 0.04591225805033599, 0.031010381915732847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 194.07692307692307, 145, 442, 148.0, 440.8, 442.0, 442.0, 0.06174921269753811, 0.01652273855383344, 0.035216347866564704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 295.6153846153846, 146, 586, 172.0, 528.8, 586.0, 586.0, 0.06174921269753811, 0.01664334248488332, 0.036301783246013616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c98a9591-d6fb-4b8a-8b64-e41f06222c3d", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 204.92307692307693, 145, 587, 148.0, 527.8, 587.0, 587.0, 0.06178090589817556, 0.01665188479286763, 0.0363807482974608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b929c04-e885-4e40-9e0c-807b2f2e75f3", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 238.5, 147, 446, 150.0, 445.9, 446.0, 446.0, 0.05229578495973224, 0.038864348002301013, 0.02936530893734965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 527.2105263157895, 145, 1903, 149.0, 1644.0, 1903.0, 1903.0, 0.11873367411980852, 28.138519869533567, 0.06711723622376924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 1230.923076923077, 146, 2405, 1489.0, 2195.3999999999996, 2405.0, 2405.0, 0.06003426571166004, 37.40270498382538, 0.03172183180707758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 463.36842105263156, 146, 1302, 163.0, 1299.0, 1302.0, 1302.0, 0.11873293214100472, 9.21079752988633, 0.06723276693037876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 904.1538461538462, 147, 1524, 1166.0, 1439.6, 1524.0, 1524.0, 0.06003426571166004, 12.225640880217785, 0.03178045901968662], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 569.8125, 154, 2418, 391.0, 1713.1000000000008, 2418.0, 2418.0, 0.0914839845849486, 0.019141058298169176, 0.06144346718583828], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 471.53846153846155, 297, 1025, 346.0, 858.5999999999999, 1025.0, 1025.0, 0.06170407674088559, 0.09562926737088422, 0.1387739147795503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b773f40-bad6-40dd-920b-fc085f9116a1", 3, 0, 0.0, 357.3333333333333, 287, 452, 333.0, 452.0, 452.0, 452.0, 0.05631476197627271, 0.0362049657887821, 0.036113307647544675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 26, 0, 0.0, 637.0384615384614, 207, 1610, 534.5, 1255.1000000000004, 1575.6999999999998, 1610.0, 0.10987757102951057, 0.06749315642340054, 0.049680972057288476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 152.15384615384613, 145, 173, 148.0, 169.4, 173.0, 173.0, 0.060033988473474215, 0.044615102762025266, 0.03013424812047436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 244.99999999999997, 145, 487, 148.0, 484.6, 487.0, 487.0, 0.060034542952406456, 0.07848867078903861, 0.03074786011489688], "isController": false}, {"data": ["login", 26, 0, 0.0, 3392.2692307692314, 1752, 7302, 3331.5, 5010.1, 6675.499999999997, 7302.0, 0.11003614264069814, 50.77750553090323, 0.23619912679972577], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 171.8421052631579, 148, 448, 153.0, 176.0, 448.0, 448.0, 0.11528146880726152, 0.09332845472775371, 0.040978959615081245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=835b4583-fd88-468d-a2a5-9ac02d5d8351", 1, 0, 0.0, 951.0, 951, 951, 951.0, 951.0, 951.0, 951.0, 1.0515247108307044, 0.18997272607781285, 0.7249769978969506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf6824f7-8498-4d42-b498-999d7367aae1", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 0.5576051311728395, 2.1279417438271606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a7a5793-cb86-45f0-8980-1ef43d896d83", 3, 0, 0.0, 326.3333333333333, 236, 488, 255.0, 488.0, 488.0, 488.0, 0.04990102962457792, 0.03266633156739134, 0.032000334752740396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/670f3aef-fbd3-4dc8-9245-84c69689bba2", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69712777-2444-4bdd-a3d5-edd16e511fab", 1, 0, 0.0, 2418.0, 2418, 2418, 2418.0, 2418.0, 2418.0, 2418.0, 0.41356492969396197, 0.07471632030603804, 0.28513363316790735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1384.1538461538462, 297, 2553, 1655.0, 2344.2, 2553.0, 2553.0, 0.05999270857849584, 49.71701035566446, 0.12429829441883217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dd4f48c-ba5f-4eb3-83ed-79b7edf48027", 3, 0, 0.0, 771.3333333333334, 357, 1245, 712.0, 1245.0, 1245.0, 1245.0, 0.07613633479684288, 0.034449708778519404, 0.0488244074055275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 556.4666666666666, 296, 1908, 341.0, 1290.0000000000005, 1908.0, 1908.0, 0.07889421863165867, 6.406446824639191, 0.1760892250878356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 8, 44.44444444444444, 1029.0555555555557, 146, 2082, 1459.0, 2063.1, 2082.0, 2082.0, 0.09348755317104587, 62.14645961337703, 0.1446439909576761], "isController": false}, {"data": ["register", 26, 10, 38.46153846153846, 1262.8846153846152, 190, 3191, 1183.0, 1977.8000000000002, 2838.8999999999987, 3191.0, 0.11107076489309438, 0.03450936625584723, 0.05011200525450157], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ef95c95-d8fb-42e8-885b-0db4e063dc18", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 748.4736842105264, 293, 2054, 336.0, 1792.0, 2054.0, 2054.0, 0.11861729689909414, 37.479541930434074, 0.25878641043769784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 176.91666666666666, 147, 436, 151.5, 354.10000000000025, 436.0, 436.0, 0.061713474622904954, 0.04791231672383734, 0.021937211682360746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ec6de7a-7a1c-466a-b787-43da25b5bfd8", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 0.6691261574074073, 2.5535300925925926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 476.95238095238096, 293, 881, 353.0, 878.4, 880.8, 881.0, 0.12450125390548575, 0.19295262690234952, 0.28000623803157587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69712777-2444-4bdd-a3d5-edd16e511fab", 3, 0, 0.0, 611.0, 418, 848, 567.0, 848.0, 848.0, 848.0, 0.02066044557694294, 0.024419947229778586, 0.013249048758651561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 264.125, 146, 478, 152.5, 478.0, 478.0, 478.0, 0.04035247890321962, 0.02998851215366224, 0.020255052886967665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 294.375, 146, 449, 293.5, 449.0, 449.0, 449.0, 0.040291103220770064, 0.010781017853995115, 0.022978519805595427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 222.25, 145, 445, 149.0, 445.0, 445.0, 445.0, 0.040291914923621636, 0.010859930194257395, 0.023687239046894754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 256.875, 144, 441, 150.0, 441.0, 441.0, 441.0, 0.0403526824445655, 0.010876308940136794, 0.023762370619211912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 158.75, 154, 165, 158.0, 165.0, 165.0, 165.0, 0.027893808271908845, 0.008226494236441865, 0.017242949839959273], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1713.62962962963, 1159, 2897, 1599.5, 2414.0, 2618.5, 2897.0, 0.2504301369481841, 299.60150739232665, 0.49450169620041834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, 38.46153846153846, 1262.8846153846152, 190, 3191, 1183.0, 1977.8000000000002, 2838.8999999999987, 3191.0, 0.11135618990513309, 0.03459804698374628, 0.05024078099235497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 247.83333333333334, 146, 442, 156.5, 442.0, 442.0, 442.0, 0.04669042690613668, 0.012584529127044651, 0.027494460375391033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 150.16666666666669, 146, 157, 149.0, 157.0, 157.0, 157.0, 0.046691153582767854, 0.012584724989105399, 0.027449291461744383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 246.33333333333331, 145, 442, 151.5, 441.7, 442.0, 442.0, 0.062217106593457874, 0.016769454511517942, 0.03657685368091957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 220.25, 146, 437, 149.5, 436.4, 437.0, 437.0, 0.06221742917582646, 0.01676954145754697, 0.03663780253224937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7df38f88-30d5-4f46-bfa0-42ba2b753490", 3, 0, 0.0, 511.66666666666663, 332, 773, 430.0, 773.0, 773.0, 773.0, 0.01756543123133673, 0.02421536499502313, 0.011264290210199661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 174.5, 147, 444, 149.5, 359.7000000000003, 444.0, 444.0, 0.0622167840144343, 0.04623727796385205, 0.03122990916349534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 245.66666666666666, 145, 439, 152.5, 439.0, 439.0, 439.0, 0.046691153582767854, 0.012493531329764055, 0.026628548527672293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 173.58333333333337, 145, 439, 147.0, 356.5000000000003, 439.0, 439.0, 0.06221807435059885, 0.016648195675843833, 0.035483745528075906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 149.33333333333334, 146, 155, 148.0, 155.0, 155.0, 155.0, 0.046691880282018955, 0.03469972743614885, 0.023437135219685296], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 633.75, 146, 2336, 539.0, 1677.3000000000006, 2336.0, 2336.0, 0.08969715996367264, 0.01815403945553824, 0.06103173457489153], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 203.5, 149, 442, 156.0, 442.0, 442.0, 442.0, 0.049319392385085814, 0.038819756115604655, 0.017531502761885972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 26, 0, 0.0, 1767.346153846154, 990, 4945, 1549.5, 2851.2000000000007, 4438.549999999997, 4945.0, 0.1093011035207567, 0.05657186022070415, 0.0502742380451918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 447.0, 301, 598, 447.0, 598.0, 598.0, 598.0, 0.04663381573424943, 0.07227330622095102, 0.10488054456638324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b929c04-e885-4e40-9e0c-807b2f2e75f3", 3, 0, 0.0, 468.6666666666667, 256, 639, 511.0, 639.0, 639.0, 639.0, 0.02699419624780672, 0.022240335515364196, 0.01731073131776668], "isController": false}, {"data": ["addBook", 53, 11, 20.754716981132077, 1603.0188679245284, 754, 3596, 1258.0, 3004.4000000000005, 3468.7, 3596.0, 0.2509030141499832, 86.01203306298139, 0.9088808201806502], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 248.05555555555557, 146, 694, 150.0, 593.0, 657.5, 694.0, 0.25185040086188804, 0.18716616704677422, 0.12174409026038532], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 958.3888888888888, 714, 1370, 875.5, 1300.5, 1321.25, 1370.0, 0.25172712779347184, 74.01613369857075, 0.12660104571644337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b773f40-bad6-40dd-920b-fc085f9116a1", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1353f6c-5d1c-4fec-8169-7a176262fb5e", 3, 0, 0.0, 434.6666666666667, 249, 627, 428.0, 627.0, 627.0, 627.0, 0.0836866770810087, 0.03786604203860745, 0.05366626101874582], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 217.2962962962963, 145, 484, 151.0, 442.5, 448.75, 484.0, 0.25241547587328744, 0.4466570725414032, 0.12275674510243861], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1460.8703703703704, 1008, 2202, 1444.0, 1874.5, 2034.75, 2202.0, 0.25116395890213444, 225.99777171928707, 0.12607253405829794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 157.0952380952381, 149, 202, 155.0, 173.0, 199.29999999999995, 202.0, 0.11973794495475616, 0.08945266395545748, 0.042563097620635974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 11, 6.875, 249.84375000000006, 147, 1608, 158.0, 432.40000000000003, 613.6999999999999, 1470.7499999999968, 0.6801390884435867, 1.5901862770780375, 0.32321551163462925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 194.99999999999997, 148, 449, 156.5, 449.0, 449.0, 449.0, 0.04061305405089831, 0.03145132017808824, 0.01443667155715526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29299cdc-bfd7-40fe-a4ec-5e2245c66f7e", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.5980073735955056, 1.1173776919475655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 205.5333333333333, 150, 522, 155.0, 471.0, 522.0, 522.0, 0.08012221308235494, 0.06502105378070017, 0.02848094293161836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a7a5793-cb86-45f0-8980-1ef43d896d83", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 596.625, 294, 922, 590.5, 922.0, 922.0, 922.0, 0.040261093189332825, 0.06239683094870233, 0.09054814220218114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf6824f7-8498-4d42-b498-999d7367aae1", 3, 0, 0.0, 463.3333333333333, 238, 599, 553.0, 599.0, 599.0, 599.0, 0.0769151881858271, 0.03480211965439442, 0.049323867423853966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 470.33333333333326, 296, 881, 445.5, 797.6000000000004, 881.0, 881.0, 0.062169079172322325, 0.09634993031882376, 0.13981971614634603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a069a94c-1ac3-4a2a-ae4f-1bb9965c8a82", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.9202764769452451, 1.7195380043227666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dd4f48c-ba5f-4eb3-83ed-79b7edf48027", 1, 0, 0.0, 1411.0, 1411, 1411, 1411.0, 1411.0, 1411.0, 1411.0, 0.7087172218284905, 0.12803973245924877, 0.48862730333097093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7df38f88-30d5-4f46-bfa0-42ba2b753490", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 155.53846153846152, 145, 178, 153.0, 175.2, 178.0, 178.0, 0.061500905955653114, 0.050990497222997554, 0.02186165016392357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53baf2f3-4202-4ab2-be3d-91a0c0618dbc", 1, 0, 0.0, 669.0, 669, 669, 669.0, 669.0, 669.0, 669.0, 1.4947683109118086, 0.2700509155455904, 1.030572683109118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 159.46153846153848, 148, 174, 159.0, 172.0, 174.0, 174.0, 0.05903723887375113, 0.045834575102179836, 0.020985893505903724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ec6de7a-7a1c-466a-b787-43da25b5bfd8", 3, 0, 0.0, 1037.6666666666667, 286, 2361, 466.0, 2361.0, 2361.0, 2361.0, 0.0881057268722467, 0.039865546989721, 0.05650009177679883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ef95c95-d8fb-42e8-885b-0db4e063dc18", 3, 0, 0.0, 398.3333333333333, 265, 600, 330.0, 600.0, 600.0, 600.0, 0.091279741982596, 0.04130170617051056, 0.05853551162295381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 193.66666666666666, 147, 439, 150.0, 435.8, 438.7, 439.0, 0.1248335552596538, 0.09277181206308256, 0.0626605931674434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 232.42857142857142, 144, 448, 149.0, 440.6, 447.3, 448.0, 0.12460985248566986, 0.03334287068464213, 0.0710665564957336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 191.38095238095238, 144, 442, 148.0, 439.8, 441.9, 442.0, 0.12483281319661169, 0.03364634418189924, 0.0733880405706643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 223.7142857142857, 145, 588, 147.0, 443.2, 573.5999999999998, 588.0, 0.12461281019688825, 0.033587046498380034, 0.0733803950671129], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 27.027027027027028, 0.78125], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.3125], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.81081081081081, 0.3125], "isController": false}, {"data": ["401/Unauthorized", 19, 51.351351351351354, 1.484375], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1280, 37, "401/Unauthorized", 19, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
