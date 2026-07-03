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

    var data = {"OkPercent": 98.65168539325843, "KoPercent": 1.348314606741573};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7571151358344114, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.008771929824561403, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/018858c5-0a9c-435b-96c0-aba4e6e8778b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e27dd86a-5552-42af-9270-20c89e9acee5"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c2dafe2e-d1f6-409c-b428-72df48359999"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb9df1e2-36e7-4d2e-a6c9-cd96b7c3afbf"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/424f7800-63b4-4a73-8da1-4729e3ba0933"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d75d62a-ff9e-40be-be01-08bce6f3b040"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/81e44eca-e373-47f3-b307-b75b8c83a726"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a84df549-b741-44be-ab9b-c2d4d5d180be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/13d17000-f14e-441a-88e3-60c41e9fda98"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2dfc4fb1-afcd-4568-993b-53a7ab50d029"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d5523387-a04e-4e8b-8562-4131486d6301"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=018858c5-0a9c-435b-96c0-aba4e6e8778b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e69938c-542c-470a-ab81-d63fce2f671f"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb761730-fd55-43d7-b674-7b97d9b2fc34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2dafe2e-d1f6-409c-b428-72df48359999"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a84df549-b741-44be-ab9b-c2d4d5d180be"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e27dd86a-5552-42af-9270-20c89e9acee5"], "isController": false}, {"data": [0.3157894736842105, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/69ab16b3-6c52-480c-9acf-3f9a5645ad61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5523387-a04e-4e8b-8562-4131486d6301"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d222288-2599-4dd1-994d-223ce5bfe5eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81e44eca-e373-47f3-b307-b75b8c83a726"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.43859649122807015, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9480874316939891, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0e69938c-542c-470a-ab81-d63fce2f671f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69ab16b3-6c52-480c-9acf-3f9a5645ad61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8affec8d-bcdb-42ec-93ab-343d3c9d03a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2dfc4fb1-afcd-4568-993b-53a7ab50d029"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13d17000-f14e-441a-88e3-60c41e9fda98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1335, 18, 1.348314606741573, 430.316853932584, 115, 2862, 140.0, 1201.6000000000004, 1452.2000000000003, 2028.2400000000066, 5.164170328650121, 697.49845918057, 3.7816562311420747], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2115.526315789474, 1497, 3018, 2063.0, 2620.8, 2873.399999999999, 3018.0, 0.2625094986989661, 315.886848367663, 1.2907571542473577], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/018858c5-0a9c-435b-96c0-aba4e6e8778b", 3, 0, 0.0, 444.33333333333337, 226, 776, 331.0, 776.0, 776.0, 776.0, 0.021926298402303725, 0.025916142414962505, 0.01406080984783149], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e27dd86a-5552-42af-9270-20c89e9acee5", 1, 0, 0.0, 999.0, 999, 999, 999.0, 999.0, 999.0, 999.0, 1.001001001001001, 0.1808449074074074, 0.6901432682682682], "isController": false}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 559.0000000000001, 132, 1162, 540.0, 1054.0000000000005, 1162.0, 1162.0, 0.0802122952079838, 0.016018959345735044, 0.05387958045627427], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 559.0000000000001, 132, 1162, 540.0, 1054.0000000000005, 1162.0, 1162.0, 0.07846060296973383, 0.015669134089170474, 0.052702947339858634], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2dafe2e-d1f6-409c-b428-72df48359999", 3, 0, 0.0, 408.3333333333333, 238, 661, 326.0, 661.0, 661.0, 661.0, 0.03147128245476003, 0.026236313270390766, 0.020181779438762128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 200.79999999999998, 117, 390, 128.0, 371.9, 389.09999999999997, 390.0, 0.11497556769186548, 0.039399342483472266, 0.06508919588962346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 180.05, 124, 388, 131.5, 386.7, 387.95, 388.0, 0.1151383963524156, 0.08556671838299636, 0.05779407785658361], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb9df1e2-36e7-4d2e-a6c9-cd96b7c3afbf", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.6557206108829569, 1.2252149640657084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 236.60000000000005, 115, 1092, 129.0, 388.9, 1056.8499999999995, 1092.0, 0.1151364078592112, 1.7221775568917776, 0.06730532592238656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 256.25, 117, 1231, 130.0, 389.7, 1188.9499999999994, 1231.0, 0.11496565401086425, 5.201752372962952, 0.06709323714540281], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/424f7800-63b4-4a73-8da1-4729e3ba0933", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.8748929794520548, 1.6347388698630136], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 254.8461538461539, 128, 401, 243.0, 381.79999999999995, 401.0, 401.0, 0.07714950386934435, 0.17094364228742345, 0.04986435781939895], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6d75d62a-ff9e-40be-be01-08bce6f3b040", 2, 0, 0.0, 323.5, 235, 412, 323.5, 412.0, 412.0, 412.0, 0.01585854180708084, 0.02710200015858542, 0.009857384629108354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 126.00000000000001, 119, 138, 123.0, 134.4, 138.0, 138.0, 0.09019518237465876, 0.06702981815147979, 0.04527375365290488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 174.06666666666666, 117, 386, 128.0, 372.8, 386.0, 386.0, 0.09019301304792256, 0.03316472250616319, 0.05093321583188022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 985.5, 924, 1024, 997.0, 1024.0, 1024.0, 1024.0, 0.032, 9.4090625, 0.01825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1302.25, 1208, 1392, 1304.5, 1392.0, 1392.0, 1392.0, 0.031928480204342274, 28.729302612148786, 0.018178031210089398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 255.25, 127, 393, 250.5, 393.0, 393.0, 393.0, 0.03222791582068388, 0.05702830416706951, 0.01784494948274195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 149.99999999999997, 119, 384, 130.0, 311.10000000000025, 384.0, 384.0, 0.05842486562280907, 0.043419260487263384, 0.029326543877074084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 167.0, 118, 387, 128.0, 379.8, 387.0, 387.0, 0.058422874502797, 0.030257419705061857, 0.03250152751473961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81e44eca-e373-47f3-b307-b75b8c83a726", 3, 0, 0.0, 876.6666666666666, 325, 1239, 1066.0, 1239.0, 1239.0, 1239.0, 0.016815672206496452, 0.023181761651859534, 0.010783487710546229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 387.33333333333326, 116, 1393, 241.5, 1287.4000000000003, 1393.0, 1393.0, 0.058422874502797, 8.774623187673747, 0.0335094742428152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 380.58333333333337, 128, 1143, 252.0, 1091.4, 1143.0, 1143.0, 0.05842230563629194, 2.876138474252803, 0.03356620099220549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a84df549-b741-44be-ab9b-c2d4d5d180be", 3, 0, 0.0, 466.33333333333337, 243, 902, 254.0, 902.0, 902.0, 902.0, 0.01764903136232873, 0.02433061452456451, 0.011317900971285027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 128.5, 124, 132, 129.0, 132.0, 132.0, 132.0, 0.032228435148331375, 0.023951014792851732, 0.018097021689736856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1041.2666666666667, 120, 1920, 1388.0, 1701.0000000000002, 1920.0, 1920.0, 0.06855920544451503, 41.132621998249455, 0.036377442993020676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 186.66666666666666, 118, 1049, 126.0, 498.20000000000033, 1049.0, 1049.0, 0.09019735180575099, 5.433339318303449, 0.05250942186504071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 679.8000000000001, 121, 1114, 774.0, 1068.4, 1114.0, 1114.0, 0.06857456340861295, 13.448293350553168, 0.03645255925985188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 250.06666666666666, 121, 975, 129.0, 625.2000000000003, 975.0, 975.0, 0.09019680943819414, 1.7907472542587928, 0.05259718894126985], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 492.66666666666663, 130, 1016, 450.0, 1010.9, 1016.0, 1016.0, 0.07862459377293217, 0.015701884205629523, 0.05327379294868435], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 587.4166666666666, 250, 1519, 506.0, 1443.7000000000003, 1519.0, 1519.0, 0.05838790981014198, 11.717448056047528, 0.12882592861104894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13d17000-f14e-441a-88e3-60c41e9fda98", 3, 0, 0.0, 347.0, 243, 480, 318.0, 480.0, 480.0, 480.0, 0.0411020838756525, 0.02642467957500445, 0.026357781652029757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 672.85, 157, 1566, 697.0, 1471.500000000001, 1563.6499999999999, 1566.0, 0.08302165619901951, 0.05099670092693679, 0.03753811212904886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 144.0, 119, 384, 128.0, 235.2000000000001, 384.0, 384.0, 0.06863763447256553, 0.05100902327502185, 0.034452875116112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 245.53333333333336, 119, 396, 129.0, 392.4, 396.0, 396.0, 0.06856014553033558, 0.08699461174389586, 0.035262054016253326], "isController": false}, {"data": ["login", 20, 0, 0.0, 2954.9999999999995, 1597, 4813, 3046.5, 4218.6, 4784.849999999999, 4813.0, 0.08467615604122035, 20.377895792230117, 0.15584051140164443], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2dfc4fb1-afcd-4568-993b-53a7ab50d029", 3, 0, 0.0, 533.0, 239, 933, 427.0, 933.0, 933.0, 933.0, 0.07011639321273314, 0.03172584198102183, 0.04496396309540504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 135.2, 128, 163, 132.0, 151.6, 163.0, 163.0, 0.09249324799289652, 0.07487978768174923, 0.032878459247474935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5523387-a04e-4e8b-8562-4131486d6301", 3, 0, 0.0, 446.0, 288, 588, 462.0, 588.0, 588.0, 588.0, 0.020673116679070538, 0.0244349240435238, 0.013257174432867497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1186.7333333333333, 249, 2052, 1520.0, 1836.0, 2052.0, 2052.0, 0.06852037110632991, 54.68485464973528, 0.1424162010136447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 490.15, 254, 1357, 497.0, 772.4000000000001, 1327.8499999999995, 1357.0, 0.11488310643919812, 7.041150814593027, 0.25690510296398417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, 50.0, 780.125, 128, 1522, 732.0, 1522.0, 1522.0, 1522.0, 0.06379330967664766, 38.16802310513935, 0.09305786750926996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=018858c5-0a9c-435b-96c0-aba4e6e8778b", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e69938c-542c-470a-ab81-d63fce2f671f", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1305.7727272727273, 187, 2257, 1267.5, 1976.7, 2216.3499999999995, 2257.0, 0.08648308665998389, 0.02748663443206164, 0.03901873636417242], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bb761730-fd55-43d7-b674-7b97d9b2fc34", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.7392035590277778, 1.3812029803240742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 155.7619047619048, 127, 408, 132.0, 318.00000000000017, 403.49999999999994, 408.0, 0.1073476940692955, 0.08334122732918937, 0.03815875062619488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 401.4, 251, 1169, 260.0, 782.6000000000003, 1169.0, 1169.0, 0.09012527413104215, 7.318442165860546, 0.20115656074443475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2dafe2e-d1f6-409c-b428-72df48359999", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a84df549-b741-44be-ab9b-c2d4d5d180be", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 421.2352941176471, 248, 772, 260.0, 764.0, 772.0, 772.0, 0.10318351491608753, 0.1599142950896786, 0.2320621434099117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 127.3076923076923, 119, 134, 128.0, 132.8, 134.0, 134.0, 0.06367586048129155, 0.04732161115845983, 0.031962297155648293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 143.30769230769232, 117, 371, 124.0, 274.9999999999999, 371.0, 371.0, 0.063674924814608, 0.01703801699140878, 0.03631460555833113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 166.84615384615387, 123, 385, 129.0, 384.2, 385.0, 385.0, 0.063674924814608, 0.017162382078937315, 0.03743389134608791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 185.92307692307696, 121, 395, 129.0, 393.0, 395.0, 395.0, 0.06359238261090756, 0.01714013437559618, 0.03744746749450904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 131.0, 130, 132, 131.0, 132.0, 132.0, 132.0, 0.0463510162460312, 0.01366992861943498, 0.02865253250365014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e27dd86a-5552-42af-9270-20c89e9acee5", 3, 0, 0.0, 380.6666666666667, 331, 458, 353.0, 458.0, 458.0, 458.0, 0.05177323323841574, 0.03328520040555699, 0.03320093407541634], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1447.385964912281, 936, 2495, 1333.0, 2058.0, 2185.599999999999, 2495.0, 0.26816462485180376, 320.8181204306159, 0.5295203822757296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1305.7727272727273, 187, 2257, 1267.5, 1976.7, 2216.3499999999995, 2257.0, 0.08531926858117936, 0.02711674196738477, 0.03849365437939927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 196.85714285714283, 122, 379, 129.0, 379.0, 379.0, 379.0, 0.03634192560288659, 0.009795284635153025, 0.021400567518106064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 158.14285714285714, 118, 369, 123.0, 369.0, 369.0, 369.0, 0.036342869009916415, 0.009795538912829032, 0.02136563197653289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69ab16b3-6c52-480c-9acf-3f9a5645ad61", 3, 0, 0.0, 811.0, 401, 1154, 878.0, 1154.0, 1154.0, 1154.0, 0.025222589351022777, 0.029812246723165268, 0.016174642259607703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 138.47619047619042, 116, 407, 125.0, 130.8, 379.39999999999964, 407.0, 0.10156703424260011, 0.027375489698200813, 0.059710307240278586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 173.28571428571428, 118, 392, 127.0, 375.2, 390.4, 392.0, 0.10144486471602683, 0.02734256119299161, 0.05973755217164471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 150.8095238095238, 118, 387, 129.0, 320.60000000000014, 385.0, 387.0, 0.1015699817174033, 0.07548316024115616, 0.05098336972924345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 124.28571428571429, 118, 131, 122.0, 131.0, 131.0, 131.0, 0.03634211428037422, 0.009724354797678258, 0.020726362050525922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5523387-a04e-4e8b-8562-4131486d6301", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 175.0952380952381, 115, 390, 126.0, 387.4, 389.9, 390.0, 0.10143849445952605, 0.02714272215030287, 0.05785164137144845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 127.99999999999999, 124, 131, 127.0, 131.0, 131.0, 131.0, 0.03634192560288659, 0.027008013070113957, 0.01824194312488643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 133.2857142857143, 125, 150, 133.0, 150.0, 150.0, 150.0, 0.03768627788784564, 0.0296632226343785, 0.013396294092945129], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 821.3333333333334, 128, 2855, 718.5, 2318.300000000002, 2855.0, 2855.0, 0.07956135174736619, 0.015526377074396493, 0.05414160345959278], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1616.9, 1056, 2862, 1646.0, 2202.1000000000004, 2829.5499999999993, 2862.0, 0.08438177691145819, 0.04367416187800083, 0.03881232121611017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 326.14285714285717, 248, 511, 258.0, 511.0, 511.0, 511.0, 0.036317791048183334, 0.05628548280612007, 0.081679563265592], "isController": false}, {"data": ["addBook", 63, 6, 9.523809523809524, 1247.0158730158732, 637, 2656, 1051.0, 2130.0, 2301.5999999999995, 2656.0, 0.2757485698278541, 74.29983492016423, 1.0065600735220095], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8d222288-2599-4dd1-994d-223ce5bfe5eb", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.7923968672456575, 1.480594758064516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81e44eca-e373-47f3-b307-b75b8c83a726", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 218.45614035087723, 122, 527, 130.0, 521.0, 523.2, 527.0, 0.2692680161560809, 0.20011031278786875, 0.1301637382785743], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 807.7894736842105, 579, 1240, 741.0, 1090.2, 1169.3, 1240.0, 0.2691993444759822, 79.15354553542332, 0.13538834219251059], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 190.70175438596496, 117, 527, 131.0, 390.0, 411.39999999999947, 527.0, 0.2698007734288838, 0.4774208998565796, 0.1312117042652189], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1224.3684210526317, 804, 1966, 1191.0, 1553.2000000000003, 1804.1, 1966.0, 0.26886411984736064, 241.9244076513658, 0.1349571851577572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 150.41176470588238, 123, 438, 132.0, 215.5999999999998, 438.0, 438.0, 0.10290681485248006, 0.07687862633022191, 0.036580156842092516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 6, 3.278688524590164, 204.59562841530052, 118, 816, 134.0, 368.2, 461.39999999999986, 762.2399999999998, 0.7614783498805768, 1.5220708440134485, 0.36919866886926705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 152.76923076923077, 121, 368, 135.0, 281.9999999999999, 368.0, 368.0, 0.06575486586007365, 0.050921492799842184, 0.023373799973698053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e69938c-542c-470a-ab81-d63fce2f671f", 3, 0, 0.0, 1114.3333333333335, 223, 2855, 265.0, 2855.0, 2855.0, 2855.0, 0.01806434519759383, 0.02135144447020286, 0.01158423178361323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 144.64999999999998, 125, 391, 132.5, 143.10000000000002, 378.64999999999986, 391.0, 0.10834177496329922, 0.08792188964306802, 0.03851211531898527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 335.0, 251, 529, 258.0, 524.6, 529.0, 529.0, 0.06355290045660315, 0.09849458303186445, 0.14293196264800492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 354.6666666666667, 247, 777, 260.0, 706.8000000000002, 774.0999999999999, 777.0, 0.10137875101378752, 0.15711726353406325, 0.228003187094485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69ab16b3-6c52-480c-9acf-3f9a5645ad61", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8affec8d-bcdb-42ec-93ab-343d3c9d03a9", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.7676344651442308, 1.434326171875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2dfc4fb1-afcd-4568-993b-53a7ab50d029", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 134.33333333333337, 121, 149, 133.0, 146.9, 149.0, 149.0, 0.06102584444512251, 0.050596622982333014, 0.02169278064260214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 133.59999999999997, 124, 169, 131.0, 151.60000000000002, 169.0, 169.0, 0.06587239200221331, 0.05114116371265585, 0.023415576844536764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 173.05882352941177, 123, 393, 130.0, 387.4, 393.0, 393.0, 0.10326374167056436, 0.07674190176884715, 0.0518335578307325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 216.64705882352942, 122, 395, 128.0, 391.0, 395.0, 395.0, 0.1032681326691775, 0.02763229331186976, 0.058895106912890294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 155.47058823529412, 121, 369, 129.0, 367.4, 369.0, 369.0, 0.10326625076690378, 0.027833481652017034, 0.06070926070476179], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13d17000-f14e-441a-88e3-60c41e9fda98", 1, 0, 0.0, 1016.0, 1016, 1016, 1016.0, 1016.0, 1016.0, 1016.0, 0.984251968503937, 0.17781895915354332, 0.678595595472441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 214.76470588235293, 121, 391, 130.0, 391.0, 391.0, 391.0, 0.10327001464004325, 0.027834496133449158, 0.0608123230741661], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 22.22222222222222, 0.299625468164794], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.11111111111111, 0.149812734082397], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 11.11111111111111, 0.149812734082397], "isController": false}, {"data": ["401/Unauthorized", 10, 55.55555555555556, 0.7490636704119851], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1335, 18, "401/Unauthorized", 10, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
