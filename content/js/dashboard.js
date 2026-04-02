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

    var data = {"OkPercent": 97.11246200607903, "KoPercent": 2.8875379939209727};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7140544041450777, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/971db825-b7cc-4688-89f0-192c09b9a7af"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02a5c884-00c7-4bb6-9820-23b41235429c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/47ac5bce-88a5-493e-a427-21ed1aafb607"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e007f249-a9ff-47b8-af71-fd7c274c2d3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1862673f-521f-4bee-b4fd-2bd06b2b053f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/872fb891-59f3-4d61-83e3-0738bf4bff76"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c7b1366b-3f77-48a3-a6a2-26f764b902de"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b048c84-c83b-4eab-a6a0-854253f20e8e"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7b1366b-3f77-48a3-a6a2-26f764b902de"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/653ff502-1974-4654-b1bd-83608f52995b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abbaa5ab-682b-4e6a-a29f-6716fafaf700"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd028ec3-0509-4ce1-aa2b-374c6454d4d6"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.06666666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47ac5bce-88a5-493e-a427-21ed1aafb607"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e163d354-71e1-4414-bbd9-c5f430dedaef"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24107142857142858, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d63bf887-0cb2-49d8-a23f-1b8afe16e8aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e007f249-a9ff-47b8-af71-fd7c274c2d3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.20535714285714285, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1862673f-521f-4bee-b4fd-2bd06b2b053f"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02a5c884-00c7-4bb6-9820-23b41235429c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=001a0055-ac71-4557-b746-126d0ce712df"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=971db825-b7cc-4688-89f0-192c09b9a7af"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=872fb891-59f3-4d61-83e3-0738bf4bff76"], "isController": false}, {"data": [0.3482142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8958333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/001a0055-ac71-4557-b746-126d0ce712df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5b048c84-c83b-4eab-a6a0-854253f20e8e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0751d5b2-9c79-4cd8-abfc-a3e9a08c8f08"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e163d354-71e1-4414-bbd9-c5f430dedaef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d542d61-2fd5-4018-b891-c2dd439bee28"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd028ec3-0509-4ce1-aa2b-374c6454d4d6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/abbaa5ab-682b-4e6a-a29f-6716fafaf700"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=653ff502-1974-4654-b1bd-83608f52995b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 38, 2.8875379939209727, 488.06458966565333, 137, 2498, 163.0, 1362.3, 1627.0, 2070.49, 5.189356298995252, 758.1556770229519, 3.7851789854729567], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2382.339285714286, 1787, 3182, 2353.5, 2780.5, 2861.6499999999996, 3182.0, 0.24321601056252387, 292.67157128536405, 1.1958912238108474], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/971db825-b7cc-4688-89f0-192c09b9a7af", 3, 0, 0.0, 376.3333333333333, 236, 455, 438.0, 455.0, 455.0, 455.0, 0.02348410126344465, 0.027757412658713385, 0.01505979150032095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02a5c884-00c7-4bb6-9820-23b41235429c", 1, 0, 0.0, 1426.0, 1426, 1426, 1426.0, 1426.0, 1426.0, 1426.0, 0.7012622720897616, 0.1266928909537167, 0.48348746493688644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47ac5bce-88a5-493e-a427-21ed1aafb607", 3, 0, 0.0, 478.6666666666667, 298, 594, 544.0, 594.0, 594.0, 594.0, 0.026955873235513465, 0.02703484552038313, 0.017286155688138516], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 517.8823529411765, 151, 1833, 487.0, 938.5999999999992, 1833.0, 1833.0, 0.08583690987124463, 0.017815300744761422, 0.05737582049987377], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 517.8823529411765, 151, 1833, 487.0, 938.5999999999992, 1833.0, 1833.0, 0.0870576065303447, 0.018068654204626344, 0.05819176870330256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 199.47058823529412, 139, 457, 147.0, 454.6, 457.0, 457.0, 0.09522529183751204, 0.0338933770809527, 0.05383773680289485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 200.11764705882354, 142, 447, 149.0, 447.0, 447.0, 447.0, 0.09538130077651599, 0.07088395497161004, 0.04787694199133714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 274.70588235294116, 143, 1138, 149.0, 584.3999999999995, 1138.0, 1138.0, 0.09538397661409326, 1.6739646805758948, 0.05568631401246724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 290.8823529411765, 141, 1690, 150.0, 701.1999999999991, 1690.0, 1690.0, 0.09522529183751204, 5.0643849443912305, 0.05550067848020434], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 268.8235294117647, 147, 528, 236.0, 447.99999999999994, 528.0, 528.0, 0.08521687695184244, 0.1198117568587054, 0.05507179835180534], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e007f249-a9ff-47b8-af71-fd7c274c2d3e", 3, 0, 0.0, 321.0, 233, 497, 233.0, 497.0, 497.0, 497.0, 0.06652179697547562, 0.0308356246396736, 0.042658834648986656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1862673f-521f-4bee-b4fd-2bd06b2b053f", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 0.6948617788461539, 2.6517427884615383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 162.42857142857142, 139, 435, 150.0, 155.0, 406.9999999999996, 435.0, 0.1084201124471452, 0.08057393122292723, 0.05442181425569593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 214.52380952380952, 143, 443, 149.0, 428.8, 441.59999999999997, 443.0, 0.10842291131005855, 0.05227533223877823, 0.060534108686224095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/872fb891-59f3-4d61-83e3-0738bf4bff76", 3, 0, 0.0, 373.0, 236, 530, 353.0, 530.0, 530.0, 530.0, 0.04451963315822278, 0.02862183446858398, 0.028549374128157185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 942.125, 838, 1177, 872.0, 1177.0, 1177.0, 1177.0, 0.07008076808521821, 20.606072717556984, 0.039967938048601014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1538.7500000000002, 992, 1862, 1581.5, 1862.0, 1862.0, 1862.0, 0.06972102873377897, 62.73510421115014, 0.03969468725761049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 256.0, 142, 439, 161.0, 439.0, 439.0, 439.0, 0.07071260628988633, 0.12512816659890041, 0.039154343521841356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 183.6875, 144, 443, 148.5, 432.5, 443.0, 443.0, 0.08130122612411649, 0.060420149492629534, 0.040809404519331904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 254.6875, 142, 445, 149.0, 443.6, 445.0, 445.0, 0.0813028786300465, 0.03701901089966717, 0.04551452653776773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 371.5, 142, 1769, 148.5, 1416.9000000000003, 1769.0, 1769.0, 0.08119189704867455, 9.151224744879837, 0.04685977651930338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7b1366b-3f77-48a3-a6a2-26f764b902de", 3, 0, 0.0, 511.33333333333337, 227, 801, 506.0, 801.0, 801.0, 801.0, 0.08082114281095935, 0.036569462404698404, 0.051828662544788386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 379.5625, 140, 1185, 287.5, 1143.7, 1185.0, 1185.0, 0.08130411805357941, 3.0074385328163746, 0.0470039432497256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 148.125, 144, 153, 149.0, 153.0, 153.0, 153.0, 0.07071635669330316, 0.052553854925394244, 0.03970889169789973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 11, 0, 0.0, 1501.3636363636363, 445, 1927, 1576.0, 1893.8000000000002, 1927.0, 1927.0, 0.07254883855904816, 59.346843527819175, 0.036982904031077284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 364.2857142857143, 140, 1688, 148.0, 1540.2, 1674.8999999999999, 1688.0, 0.10842347109998193, 13.962138709438005, 0.06241005046854429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 11, 0, 0.0, 1133.909090909091, 441, 1458, 1151.0, 1432.8000000000002, 1458.0, 1458.0, 0.0725502740421715, 19.394677200746607, 0.037054485668023135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 319.33333333333337, 137, 1180, 147.0, 1088.2000000000003, 1175.8999999999999, 1180.0, 0.1084251505044351, 4.579419728601523, 0.06251690109302878], "isController": false}, {"data": ["deleteBooks", 17, 4, 23.529411764705884, 491.82352941176447, 151, 1426, 447.0, 1282.8, 1426.0, 1426.0, 0.08724480893386843, 0.018107507736561734, 0.05868777071551007], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b048c84-c83b-4eab-a6a0-854253f20e8e", 1, 0, 0.0, 789.0, 789, 789, 789.0, 789.0, 789.0, 789.0, 1.2674271229404308, 0.2289785329531052, 0.8738315906210392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 665.5625000000001, 293, 1918, 588.0, 1562.4000000000003, 1918.0, 1918.0, 0.08113096566131879, 12.242625084300144, 0.1798706785084072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7b1366b-3f77-48a3-a6a2-26f764b902de", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/653ff502-1974-4654-b1bd-83608f52995b", 3, 0, 0.0, 401.3333333333333, 232, 538, 434.0, 538.0, 538.0, 538.0, 0.034820558057477136, 0.028688422019360227, 0.022329589639723292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 608.1666666666666, 152, 1665, 558.0, 1226.5, 1576.5, 1665.0, 0.1126168399714704, 0.06917577377153797, 0.050919528229287886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 11, 0, 0.0, 172.8181818181818, 140, 434, 149.0, 377.8000000000002, 434.0, 434.0, 0.0726878650913224, 0.05401900911571909, 0.036485901032167686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 11, 0, 0.0, 247.63636363636363, 144, 432, 149.0, 431.4, 432.0, 432.0, 0.07269170785863446, 0.11870483614628213, 0.03590701904522746], "isController": false}, {"data": ["login", 24, 0, 0.0, 2778.1666666666665, 1778, 4558, 2546.5, 4193.5, 4518.0, 4558.0, 0.10958003451771088, 43.845961005488135, 0.22590180944031998], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 150.85714285714286, 145, 160, 151.0, 157.0, 159.7, 160.0, 0.1049543448599859, 0.08496792176653156, 0.037307989774448116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abbaa5ab-682b-4e6a-a29f-6716fafaf700", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 11, 0, 0.0, 1675.4545454545453, 879, 2082, 1720.0, 2046.8000000000002, 2082.0, 2082.0, 0.07247474913853877, 78.8329349452651, 0.14613982396871728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd028ec3-0509-4ce1-aa2b-374c6454d4d6", 3, 0, 0.0, 352.0, 269, 462, 325.0, 462.0, 462.0, 462.0, 0.042486899872539306, 0.027314982828211303, 0.027245830972950007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 545.0, 292, 2137, 300.0, 1149.799999999999, 2137.0, 2137.0, 0.09514428350757796, 6.8344071461752005, 0.2125497496166245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, 46.666666666666664, 969.8000000000001, 147, 2006, 1137.0, 1949.0, 2006.0, 2006.0, 0.11077468429214976, 70.69385050494793, 0.16734477697363562], "isController": false}, {"data": ["register", 25, 8, 32.0, 993.4800000000001, 191, 2285, 917.0, 1912.0000000000002, 2198.2999999999997, 2285.0, 0.10150264515893284, 0.03176715597708476, 0.0457951387338154], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 212.79999999999998, 151, 455, 156.0, 440.6, 455.0, 455.0, 0.07983139609145484, 0.061978476457721296, 0.028377566579384342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 584.7619047619048, 286, 1993, 305.0, 1797.4, 1977.7999999999997, 1993.0, 0.10833789040332649, 18.65959952705352, 0.2396945596967571], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47ac5bce-88a5-493e-a427-21ed1aafb607", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.27923348145285937, 1.0656153400309119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e163d354-71e1-4414-bbd9-c5f430dedaef", 3, 0, 0.0, 386.6666666666667, 305, 511, 344.0, 511.0, 511.0, 511.0, 0.02618509369899362, 0.02626180784068989, 0.016791873237961403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 410.79999999999995, 288, 847, 302.0, 817.6000000000005, 846.7, 847.0, 0.11281270271032517, 0.17483765547000593, 0.2537184124432411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 148.42857142857144, 146, 151, 149.0, 151.0, 151.0, 151.0, 0.03311023342714566, 0.024606335584040868, 0.016619785138235227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 147.0, 142, 149, 147.0, 149.0, 149.0, 149.0, 0.03311211288392312, 0.008860077080268492, 0.018884251879112406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 147.28571428571428, 144, 151, 147.0, 151.0, 151.0, 151.0, 0.03311085988903132, 0.008924411454465472, 0.01946556411445005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 188.14285714285717, 143, 437, 148.0, 437.0, 437.0, 437.0, 0.03311195625437551, 0.008924706959187149, 0.01949854455213714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 151.75, 151, 152, 152.0, 152.0, 152.0, 152.0, 0.04229089794149054, 0.01247251091633803, 0.02614271327828468], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1633.4107142857142, 1103, 2498, 1513.5, 2173.2000000000003, 2257.7999999999997, 2498.0, 0.25499517330564814, 305.06287793927476, 0.5035158597890825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 993.4800000000001, 191, 2285, 917.0, 1912.0000000000002, 2198.2999999999997, 2285.0, 0.10243718551784046, 0.03205963790503663, 0.04621677705980693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d63bf887-0cb2-49d8-a23f-1b8afe16e8aa", 1, 0, 0.0, 1011.0, 1011, 1011, 1011.0, 1011.0, 1011.0, 1011.0, 0.9891196834817012, 0.31586146142433236, 0.5901876236399605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 147.0, 143, 150, 147.0, 150.0, 150.0, 150.0, 0.028882534731248015, 0.007784745689281691, 0.017007976995061087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 148.6, 142, 152, 149.0, 152.0, 152.0, 152.0, 0.028882868415428073, 0.007784835627595848, 0.01697996756453877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e007f249-a9ff-47b8-af71-fd7c274c2d3e", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 246.46666666666667, 141, 454, 150.0, 452.2, 454.0, 454.0, 0.07650367982699968, 0.020620132453371007, 0.044975796148294736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 246.60000000000002, 139, 452, 151.0, 449.6, 452.0, 452.0, 0.07650446021003024, 0.020620342790984715, 0.04505096631508617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 147.8, 140, 154, 149.0, 153.4, 154.0, 154.0, 0.07655365645781129, 0.05689192633241639, 0.0384263470891748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 145.8, 138, 156, 144.0, 156.0, 156.0, 156.0, 0.02888353580691934, 0.007728602354585838, 0.016472641514883684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 167.0666666666667, 138, 443, 145.0, 274.4000000000001, 443.0, 443.0, 0.07655170302021985, 0.020483561159707266, 0.043658393128719136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 144.6, 139, 149, 145.0, 149.0, 149.0, 149.0, 0.028884370089657083, 0.021465825818583046, 0.014498599830159904], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 458.875, 149, 801, 471.5, 721.2, 801.0, 801.0, 0.08527875493017802, 0.016796541879863555, 0.058030568769320966], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 208.2, 150, 430, 154.0, 430.0, 430.0, 430.0, 0.02854712273549949, 0.02246970793438729, 0.010147610034884584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1280.7499999999998, 874, 1781, 1302.0, 1615.0, 1742.5, 1781.0, 0.11246432772105099, 0.05820907587124709, 0.051729197613881846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 297.2, 292, 302, 297.0, 302.0, 302.0, 302.0, 0.028859195982799922, 0.044726117211624485, 0.06490500815272286], "isController": false}, {"data": ["addBook", 56, 15, 26.785714285714285, 1465.178571428571, 738, 2754, 1196.0, 2570.4, 2693.8, 2754.0, 0.25931088133285796, 89.72444094773496, 0.9386679480753113], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1862673f-521f-4bee-b4fd-2bd06b2b053f", 3, 0, 0.0, 811.3333333333334, 428, 1525, 481.0, 1525.0, 1525.0, 1525.0, 0.06853383286882625, 0.031009774637912917, 0.04394910506236579], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 258.0714285714286, 140, 629, 150.0, 580.3, 596.6, 629.0, 0.25636095622636673, 0.19051824969557135, 0.12392448567583157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02a5c884-00c7-4bb6-9820-23b41235429c", 3, 0, 0.0, 413.66666666666663, 261, 687, 293.0, 687.0, 687.0, 687.0, 0.021366456088371663, 0.025254427752889812, 0.013701796384795628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=001a0055-ac71-4557-b746-126d0ce712df", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 0.6869355988593155, 2.6214947718631176], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 938.2500000000001, 688, 1332, 881.0, 1181.0, 1291.05, 1332.0, 0.2557112654511249, 75.1876024557414, 0.12860478682356377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=971db825-b7cc-4688-89f0-192c09b9a7af", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.28053425854037267, 1.0705793866459627], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 241.80357142857136, 141, 558, 153.0, 444.0, 485.04999999999995, 558.0, 0.2565759029410013, 0.4540190782510687, 0.12478007779747916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=872fb891-59f3-4d61-83e3-0738bf4bff76", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1370.5, 958, 2059, 1328.5, 1733.1000000000001, 1908.6, 2059.0, 0.25592746284481654, 230.2839809402592, 0.12846358974827704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 152.55, 141, 166, 152.5, 162.0, 165.8, 166.0, 0.11036735775027179, 0.08245217644429484, 0.039232146700291924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 15, 8.928571428571429, 214.4047619047618, 139, 1520, 153.0, 369.0, 459.54999999999995, 918.320000000002, 0.7257144831876146, 1.6816992113254656, 0.34504257767952795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 247.42857142857142, 149, 457, 161.0, 457.0, 457.0, 457.0, 0.032640119369579404, 0.02527696744148093, 0.01160254243215518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/001a0055-ac71-4557-b746-126d0ce712df", 3, 0, 0.0, 478.0, 347, 559, 528.0, 559.0, 559.0, 559.0, 0.06494490507219709, 0.029385878271599594, 0.041647611651115975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b048c84-c83b-4eab-a6a0-854253f20e8e", 3, 0, 0.0, 334.0, 231, 452, 319.0, 452.0, 452.0, 452.0, 0.04193809936533676, 0.026962156981295605, 0.026893898356026503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 157.94117647058826, 146, 188, 155.0, 176.0, 188.0, 188.0, 0.09837165970349625, 0.07983090743516151, 0.03496805091022718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0751d5b2-9c79-4cd8-abfc-a3e9a08c8f08", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.6867439516129031, 1.283182123655914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 339.2857142857143, 295, 586, 299.0, 586.0, 586.0, 586.0, 0.03308691459794672, 0.05127825533881001, 0.07441324640534307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 417.8, 290, 607, 306.0, 601.6, 607.0, 607.0, 0.07644714444433119, 0.11847814280581406, 0.17193141958524877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 151.37499999999997, 146, 158, 150.0, 157.3, 158.0, 158.0, 0.08286634694067806, 0.06870461772718327, 0.029456396764069154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 11, 0, 0.0, 155.54545454545453, 144, 185, 154.0, 180.20000000000002, 185.0, 185.0, 0.06809416804402597, 0.052866077729492825, 0.02420534879689986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e163d354-71e1-4414-bbd9-c5f430dedaef", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d542d61-2fd5-4018-b891-c2dd439bee28", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 1.247406005859375, 2.330780029296875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd028ec3-0509-4ce1-aa2b-374c6454d4d6", 1, 0, 0.0, 1247.0, 1247, 1247, 1247.0, 1247.0, 1247.0, 1247.0, 0.8019246190858059, 0.14487895950280671, 0.5528894346431436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abbaa5ab-682b-4e6a-a29f-6716fafaf700", 3, 0, 0.0, 421.0, 330, 501, 432.0, 501.0, 501.0, 501.0, 0.0455325026181189, 0.03795857395996175, 0.029198903046124425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 176.10000000000002, 139, 431, 149.0, 400.1000000000006, 430.8, 431.0, 0.11290823383295226, 0.08390934174499676, 0.056674640810681125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=653ff502-1974-4654-b1bd-83608f52995b", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 216.55, 138, 453, 149.0, 442.80000000000007, 452.65, 453.0, 0.1129056842366729, 0.03021109128989099, 0.06439152304122751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 201.89999999999998, 142, 440, 148.0, 432.1, 439.7, 440.0, 0.11290632162494778, 0.030431782000474205, 0.06637656798654157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 159.95, 139, 425, 147.0, 150.9, 411.2999999999998, 425.0, 0.1129056842366729, 0.03043161020441574, 0.06648645272921265], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 21.05263157894737, 0.60790273556231], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.526315789473685, 0.303951367781155], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.894736842105263, 0.22796352583586627], "isController": false}, {"data": ["401/Unauthorized", 23, 60.526315789473685, 1.7477203647416413], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 38, "401/Unauthorized", 23, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
