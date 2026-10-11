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

    var data = {"OkPercent": 98.88888888888889, "KoPercent": 1.1111111111111112};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6637168141592921, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.009433962264150943, 500, 1500, "see books"], "isController": true}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63e460d9-ee7d-4c17-9cff-83c0916fb8b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0ea3022-7561-4d99-a731-fc7b894f93c4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.32075471698113206, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bdd1556b-068d-462c-ba7a-9fe93d57e1bf"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d27d640-d797-40bc-956f-d1f656bab6d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.13157894736842105, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bdd1556b-068d-462c-ba7a-9fe93d57e1bf"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/fde1f154-f8dc-421b-b0c3-ac5706482d74"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/5534bcfe-b076-4f58-bee8-68ecfbe51fe5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/408b15fb-cf2c-4776-899c-bbc107e63e8e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.12244897959183673, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c5939edf-6692-41af-9561-37f02dfcef32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54e4e72f-cb95-4ede-ba82-788692144273"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.4716981132075472, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5939edf-6692-41af-9561-37f02dfcef32"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5993377483443708, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/63e460d9-ee7d-4c17-9cff-83c0916fb8b8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/70f3274f-d882-4969-b09b-d4a2b16fdd31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=408b15fb-cf2c-4776-899c-bbc107e63e8e"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5534bcfe-b076-4f58-bee8-68ecfbe51fe5"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a566a5b-f3c9-4915-9c9c-5545971b5a64"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34699542-93e0-4041-a149-ae4b280f148f"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70f3274f-d882-4969-b09b-d4a2b16fdd31"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d13ce1e2-a654-4e07-a6ca-e77648d5e5c2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5238095238095238, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d13ce1e2-a654-4e07-a6ca-e77648d5e5c2"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f0ea3022-7561-4d99-a731-fc7b894f93c4"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a566a5b-f3c9-4915-9c9c-5545971b5a64"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7b7fb3a-e94d-4228-8330-7ccb879f5dd0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/34699542-93e0-4041-a149-ae4b280f148f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1170, 13, 1.1111111111111112, 739.2444444444445, 114, 10077, 285.0, 1676.6000000000004, 2740.4000000000015, 5904.669999999992, 4.5141327077851425, 649.1329917269837, 3.3076662367951974], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 3309.490566037736, 1485, 7807, 2441.0, 6103.8, 6552.499999999998, 7807.0, 0.23344006976774914, 280.9082575364255, 1.1478229992974776], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 428.7692307692308, 117, 2120, 129.0, 1990.0, 2120.0, 2120.0, 0.062368965202915023, 0.048421218101872505, 0.022170218099473702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 436.0952380952381, 239, 1215, 266.0, 1078.0000000000005, 1210.1999999999998, 1215.0, 0.11422790098072813, 13.175054810694451, 0.2541177713456591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 353.3846153846154, 240, 725, 248.0, 628.1999999999999, 725.0, 725.0, 0.10046212577858148, 0.15569667344786017, 0.2259416754571027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63e460d9-ee7d-4c17-9cff-83c0916fb8b8", 1, 0, 0.0, 1342.0, 1342, 1342, 1342.0, 1342.0, 1342.0, 1342.0, 0.7451564828614009, 0.1346229973919523, 0.5137504657228018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 158.83333333333331, 118, 351, 121.5, 351.0, 351.0, 351.0, 0.029741693392882813, 0.0221029576874842, 0.014928935941349381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 159.66666666666669, 117, 352, 122.5, 352.0, 352.0, 352.0, 0.02974154596555929, 0.00795818710406567, 0.01696197543348303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 117.83333333333333, 116, 124, 116.5, 124.0, 124.0, 124.0, 0.029741840821667923, 0.008016355533965182, 0.01748494938930087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 159.66666666666666, 117, 356, 121.5, 356.0, 356.0, 356.0, 0.02974198825191464, 0.008016395271023867, 0.017514080972563014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0ea3022-7561-4d99-a731-fc7b894f93c4", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 2.1685431985294117, 4.545323988970588], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1390.2641509433963, 937, 2171, 1312.0, 1884.4, 1954.7999999999995, 2171.0, 0.23717785206367106, 283.7471674307821, 0.468333610227288], "isController": false}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 1576.9090909090908, 130, 5840, 1030.0, 5282.000000000002, 5840.0, 5840.0, 0.06308171375812177, 0.012051833097254798, 0.04260143790465486], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 1576.9090909090908, 130, 5840, 1030.0, 5282.000000000002, 5840.0, 5840.0, 0.06256790039190259, 0.011953668469759796, 0.04225444054343066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdd1556b-068d-462c-ba7a-9fe93d57e1bf", 3, 0, 0.0, 1248.0, 431, 2522, 791.0, 2522.0, 2522.0, 2522.0, 0.02715423606082549, 0.022637369320238958, 0.017413361015568427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1849.8095238095239, 256, 4398, 1561.0, 3611.6000000000004, 4327.5999999999985, 4398.0, 0.08457340770423472, 0.026712359799440203, 0.03815714292905902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 262.59999999999997, 118, 367, 354.0, 362.2, 367.0, 367.0, 0.0682354760789166, 0.018258320747678858, 0.038915544951257125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 191.2, 117, 481, 118.0, 481.0, 481.0, 481.0, 0.032507639295234377, 0.008761824653793642, 0.01914268212404915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 153.93333333333337, 117, 382, 121.0, 367.0, 382.0, 382.0, 0.06823516567498226, 0.05070992292838037, 0.03425085464545008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 121.8, 118, 129, 122.0, 129.0, 129.0, 129.0, 0.032506793919929264, 0.008761596798730936, 0.019110439394333417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d27d640-d797-40bc-956f-d1f656bab6d5", 1, 0, 0.0, 1619.0, 1619, 1619, 1619.0, 1619.0, 1619.0, 1619.0, 0.6176652254478073, 0.19724270382952439, 0.3685482936998147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 246.33333333333334, 115, 362, 348.0, 360.8, 362.0, 362.0, 0.0682360968952576, 0.0183917604912999, 0.04018199846468782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 213.26666666666665, 116, 358, 124.0, 356.2, 358.0, 358.0, 0.06823578648567503, 0.0183916768262171, 0.040115179164430054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 157.23076923076923, 117, 356, 121.0, 354.0, 356.0, 356.0, 0.06347253348176142, 0.017107831290006006, 0.03731490737892614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 176.0, 117, 359, 123.0, 358.2, 359.0, 359.0, 0.06347222357846632, 0.0171077477613835, 0.03737670978302265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 121.07692307692307, 117, 126, 121.0, 125.2, 126.0, 126.0, 0.06347253348176142, 0.04717050583947308, 0.031860236532837274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 121.2, 117, 127, 121.0, 127.0, 127.0, 127.0, 0.032507850645930994, 0.008698389723618255, 0.018539633571507518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 139.6923076923077, 116, 360, 120.0, 270.79999999999995, 360.0, 360.0, 0.06347191367819739, 0.016983695652173912, 0.03619882576959695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 120.4, 119, 122, 120.0, 122.0, 122.0, 122.0, 0.03250700525963345, 0.024158038088458064, 0.016316992874464448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 479.6, 121, 832, 575.0, 832.0, 832.0, 832.0, 0.03240629719167029, 0.025507300328599856, 0.011519425954851547], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 1522.6363636363635, 121, 4198, 1143.0, 3910.6000000000013, 4198.0, 4198.0, 0.06448587173173877, 0.01215980038691523, 0.043887490473678036], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 3350.0526315789475, 1166, 9325, 2458.0, 7090.0, 9325.0, 9325.0, 0.08001448683340563, 0.04141374806807127, 0.03680353837747466], "isController": false}, {"data": ["goToProfile", 11, 1, 9.090909090909092, 1117.0, 122, 6063, 356.0, 5504.800000000002, 6063.0, 6063.0, 0.06249964488838131, 0.12894435791558, 0.040399495244345204], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 315.0, 242, 603, 243.0, 603.0, 603.0, 603.0, 0.03248124208269724, 0.05033958123558645, 0.07305107472309741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bdd1556b-068d-462c-ba7a-9fe93d57e1bf", 1, 0, 0.0, 964.0, 964, 964, 964.0, 964.0, 964.0, 964.0, 1.037344398340249, 0.18741085321576764, 0.7152003371369294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fde1f154-f8dc-421b-b0c3-ac5706482d74", 1, 0, 0.0, 1913.0, 1913, 1913, 1913.0, 1913.0, 1913.0, 1913.0, 0.5227391531625718, 0.16692939754312597, 0.31190783455305804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5534bcfe-b076-4f58-bee8-68ecfbe51fe5", 3, 0, 0.0, 1520.3333333333333, 360, 2242, 1959.0, 2242.0, 2242.0, 2242.0, 0.023915435021763045, 0.019937314157140354, 0.01533639550549258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 132.57142857142858, 114, 366, 122.0, 129.6, 342.39999999999964, 366.0, 0.11430375406186553, 0.08494644222761688, 0.057375126550584854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 165.76190476190476, 114, 360, 121.0, 359.6, 360.0, 360.0, 0.11430499839428693, 0.04693606472384457, 0.06427529950631126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 937.6, 709, 1085, 951.0, 1085.0, 1085.0, 1085.0, 0.09950644801783155, 29.25819964227432, 0.05674977113516956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/408b15fb-cf2c-4776-899c-bbc107e63e8e", 3, 0, 0.0, 659.6666666666666, 340, 871, 768.0, 871.0, 871.0, 871.0, 0.08266740148801323, 0.03831978506475613, 0.05301262400110223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1355.6, 1160, 1464, 1405.0, 1464.0, 1464.0, 1464.0, 0.0980315269390636, 88.20894026081288, 0.05581287129440828], "isController": false}, {"data": ["addBook", 49, 4, 8.16326530612245, 4734.571428571429, 610, 13191, 2582.0, 12021.0, 12929.5, 13191.0, 0.23194497697117727, 68.83519595652452, 0.844803737272611], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 168.0, 116, 368, 118.0, 368.0, 368.0, 368.0, 0.10068262821932704, 0.17816105696623105, 0.055749072461287526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5939edf-6692-41af-9561-37f02dfcef32", 3, 0, 0.0, 1786.0, 435, 4232, 691.0, 4232.0, 4232.0, 4232.0, 0.01974112800805438, 0.023333344986082503, 0.01265951242704008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 132.07692307692307, 119, 166, 123.0, 160.79999999999998, 166.0, 166.0, 0.05757307351638618, 0.04278623920504871, 0.02889898416740478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 139.23076923076923, 118, 366, 121.0, 269.19999999999993, 366.0, 366.0, 0.05757383844780931, 0.015405499740917728, 0.03283507973976625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54e4e72f-cb95-4ede-ba82-788692144273", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.6666721033402923, 1.245677844467641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 158.15384615384616, 118, 356, 123.0, 354.8, 356.0, 356.0, 0.05757383844780931, 0.015517948644136104, 0.03384711986873165], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 214.5471698113208, 118, 507, 123.0, 484.2, 488.3, 507.0, 0.2382033177677203, 0.17702414533323746, 0.11514711161623199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 167.23076923076928, 117, 486, 120.0, 432.79999999999995, 486.0, 486.0, 0.057480666598868954, 0.015492835919226398, 0.03384847847570115], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 781.4905660377359, 582, 1070, 720.0, 960.6, 999.8999999999999, 1070.0, 0.23801611324177946, 69.98464017184314, 0.11970536945265275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 164.8, 117, 351, 118.0, 351.0, 351.0, 351.0, 0.10068668317928271, 0.07482672451116615, 0.05653793244930426], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 147.56603773584908, 116, 490, 121.0, 271.4000000000003, 370.79999999999995, 490.0, 0.23862802393484103, 0.4222597454784492, 0.11605151945268637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 917.8749999999999, 120, 1630, 1116.0, 1513.8000000000002, 1630.0, 1630.0, 0.08530148744468732, 47.98013949792078, 0.045566321906488245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 233.2857142857143, 117, 1098, 120.0, 909.8000000000005, 1093.0, 1098.0, 0.1143056205706572, 9.823341258749824, 0.06626366564517358], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1173.9245283018868, 809, 1677, 1153.0, 1457.8, 1546.2, 1677.0, 0.23773319159052475, 213.91274368353004, 0.11933091843508763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 662.3749999999999, 116, 1061, 906.0, 995.9000000000001, 1061.0, 1061.0, 0.08530103267562683, 15.684456652414285, 0.04564938076781592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 255.61904761904756, 115, 962, 122.0, 820.8000000000004, 959.4, 962.0, 0.11430686494371747, 3.22882873565721, 0.06637601481362537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 313.38461538461536, 120, 1529, 126.0, 1380.6, 1529.0, 1529.0, 0.10885857596235168, 0.08132501036249905, 0.0386958219241172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5939edf-6692-41af-9561-37f02dfcef32", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 0.25553615629420084, 0.9751812234794909], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 790.8181818181819, 136, 1581, 707.0, 1533.2000000000003, 1581.0, 1581.0, 0.06466632177961718, 0.012354574260452429, 0.04416530659184969], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 151, 4, 2.6490066225165565, 1368.0794701986756, 117, 10077, 459.0, 3956.4000000000024, 5266.600000000002, 9959.999999999998, 0.61124941809865, 1.360965266814419, 0.29076487769951626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 917.6666666666667, 122, 3475, 152.5, 3475.0, 3475.0, 3475.0, 0.030795288320886904, 0.02384830433443683, 0.010946762645315267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63e460d9-ee7d-4c17-9cff-83c0916fb8b8", 3, 0, 0.0, 2693.3333333333335, 334, 4198, 3548.0, 4198.0, 4198.0, 4198.0, 0.017249905125521808, 0.020388803877203678, 0.011061950878020171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70f3274f-d882-4969-b09b-d4a2b16fdd31", 3, 0, 0.0, 1775.6666666666665, 356, 4482, 489.0, 4482.0, 4482.0, 4482.0, 0.019373962685747866, 0.02289936800519222, 0.012424058102514094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=408b15fb-cf2c-4776-899c-bbc107e63e8e", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 0.8065359933035714, 3.077915736607143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 321.00000000000006, 240, 608, 261.0, 574.0, 608.0, 608.0, 0.057449168533764645, 0.08903499068660595, 0.1292045264973242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5534bcfe-b076-4f58-bee8-68ecfbe51fe5", 1, 0, 0.0, 999.0, 999, 999, 999.0, 999.0, 999.0, 999.0, 1.001001001001001, 0.1808449074074074, 0.6901432682682682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 863.4666666666667, 122, 4081, 133.0, 3735.4, 4081.0, 4081.0, 0.0673412766110278, 0.054649024281019636, 0.02393771942032629], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a566a5b-f3c9-4915-9c9c-5545971b5a64", 3, 0, 0.0, 3621.6666666666665, 2224, 6063, 2578.0, 6063.0, 6063.0, 6063.0, 0.04425627332674407, 0.020024811173233806, 0.028380487777892514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34699542-93e0-4041-a149-ae4b280f148f", 1, 0, 0.0, 1086.0, 1086, 1086, 1086.0, 1086.0, 1086.0, 1086.0, 0.9208103130755064, 0.16635733195211785, 0.6348555478821363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 1503.1578947368423, 369, 4326, 1043.0, 4149.0, 4326.0, 4326.0, 0.08272991295942315, 0.050817495362770665, 0.03740620087911418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 173.375, 116, 437, 121.0, 385.90000000000003, 437.0, 437.0, 0.0854107724336732, 0.06347421662307158, 0.04287220413174611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 209.74999999999997, 118, 372, 121.5, 368.5, 372.0, 372.0, 0.08541031649860407, 0.10303036470205146, 0.04422736359705548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70f3274f-d882-4969-b09b-d4a2b16fdd31", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.28451033464566927, 1.0857529527559056], "isController": false}, {"data": ["login", 19, 0, 0.0, 7186.8421052631575, 3651, 17890, 6631.0, 10975.0, 17890.0, 17890.0, 0.0800515700640834, 25.311943556006604, 0.15571297641217288], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d13ce1e2-a654-4e07-a6ca-e77648d5e5c2", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 320.8333333333333, 237, 708, 245.5, 708.0, 708.0, 708.0, 0.029723129052872495, 0.046065044733309225, 0.06684801387574742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 1298.9999999999995, 118, 4897, 1238.0, 3261.0000000000005, 4749.099999999998, 4897.0, 0.10951931451339526, 0.08866358567539517, 0.03893069383093347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 317.61538461538464, 238, 485, 248.0, 484.2, 485.0, 485.0, 0.06343443806847016, 0.09831098946744349, 0.1426655379606316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d13ce1e2-a654-4e07-a6ca-e77648d5e5c2", 3, 0, 0.0, 822.6666666666666, 348, 1143, 977.0, 1143.0, 1143.0, 1143.0, 0.021636747852552776, 0.025573903467649456, 0.013875128017424795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 467.53846153846155, 124, 1759, 133.0, 1521.3999999999999, 1759.0, 1759.0, 0.05814109502043883, 0.04820487272690681, 0.020667342370546616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0ea3022-7561-4d99-a731-fc7b894f93c4", 3, 0, 0.0, 1779.0, 226, 3861, 1250.0, 3861.0, 3861.0, 3861.0, 0.015386430194330614, 0.021211436156572314, 0.009866949050400817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1092.6875, 244, 1754, 1257.0, 1649.7, 1754.0, 1754.0, 0.08524649556984619, 63.78982151847984, 0.1780894195779233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 813.8125000000001, 122, 2599, 732.0, 1894.8000000000006, 2599.0, 2599.0, 0.0829208882900158, 0.06437705682672125, 0.029475784509341553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a566a5b-f3c9-4915-9c9c-5545971b5a64", 1, 0, 0.0, 1581.0, 1581, 1581, 1581.0, 1581.0, 1581.0, 1581.0, 0.6325110689437066, 0.1142720192915876, 0.4360867330803289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7b7fb3a-e94d-4228-8330-7ccb879f5dd0", 1, 0, 0.0, 4239.0, 4239, 4239, 4239.0, 4239.0, 4239.0, 4239.0, 0.2359046945034206, 0.07533284677990092, 0.140759539396084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 480.93333333333334, 247, 742, 478.0, 728.8, 742.0, 742.0, 0.06819669746126428, 0.10569156139748673, 0.1533759709504801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1121.0, 121, 1584, 1511.0, 1584.0, 1584.0, 1584.0, 0.1369246718698042, 117.01726106644759, 0.24645676847994055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34699542-93e0-4041-a149-ae4b280f148f", 3, 0, 0.0, 3186.3333333333335, 2761, 3526, 3272.0, 3526.0, 3526.0, 3526.0, 0.062033456710986125, 0.028068523707119375, 0.0397805695705217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 140.15384615384613, 116, 362, 122.0, 270.79999999999995, 362.0, 362.0, 0.10074473608753942, 0.07486986734630616, 0.05056913510644069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 138.23076923076925, 117, 357, 120.0, 264.5999999999999, 357.0, 357.0, 0.10074629757356417, 0.02695750540542635, 0.05745687283492332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 138.46153846153848, 116, 363, 120.0, 267.3999999999999, 363.0, 363.0, 0.10055770852187904, 0.02710344487503771, 0.059116934111495295], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1849.8095238095239, 256, 4398, 1561.0, 3611.6000000000004, 4327.5999999999985, 4398.0, 0.08641833056245987, 0.02729507538970552, 0.038989520234234826], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 211.3846153846154, 117, 361, 122.0, 360.6, 361.0, 361.0, 0.10056004208050992, 0.027104073842012435, 0.059216509154831516], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 38.46153846153846, 0.42735042735042733], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.08547008547008547], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.08547008547008547], "isController": false}, {"data": ["401/Unauthorized", 6, 46.15384615384615, 0.5128205128205128], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1170, 13, "401/Unauthorized", 6, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 151, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
