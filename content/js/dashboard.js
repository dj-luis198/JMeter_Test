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

    var data = {"OkPercent": 97.33231707317073, "KoPercent": 2.667682926829268};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7966321243523317, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3482142857142857, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e15c4420-eeec-4548-aeee-8eeffcc6dc82"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b3c68c3-ddd3-4e82-b924-5416c8c00bb8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5297da7a-ab89-415c-9482-c23080f9eaad"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6051cee-a663-4afc-83a3-3646c480d72c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e1e4d231-305a-4f17-b022-76a582590aa2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52d25d2c-ba2d-43a5-a6af-917a78ad1901"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c0546783-5ae1-4383-bf73-c3fb36b31f3c"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1e69b494-5cbd-4003-b6e6-3ac0aff566b4"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6051cee-a663-4afc-83a3-3646c480d72c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=680ac8e7-5763-45f0-9fd0-e7c49ef75ce5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e9208ae-6222-4299-8917-f95c2c2c19c1"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/006a144d-3f75-49d6-bbfa-50889e7f5f24"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7d5ecb4-7da8-4938-a0b7-3dce1619f7b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86d7ccf2-c2c8-4b0c-ac6d-6346b4e13fc0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1e4d231-305a-4f17-b022-76a582590aa2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e15c4420-eeec-4548-aeee-8eeffcc6dc82"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b995a75-b81d-4417-ab7e-6e01dc6a64c5"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5297da7a-ab89-415c-9482-c23080f9eaad"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/52d25d2c-ba2d-43a5-a6af-917a78ad1901"], "isController": false}, {"data": [0.3482142857142857, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b3c68c3-ddd3-4e82-b924-5416c8c00bb8"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7767857142857143, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9255952380952381, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0546783-5ae1-4383-bf73-c3fb36b31f3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/680ac8e7-5763-45f0-9fd0-e7c49ef75ce5"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=006a144d-3f75-49d6-bbfa-50889e7f5f24"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1e9208ae-6222-4299-8917-f95c2c2c19c1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b995a75-b81d-4417-ab7e-6e01dc6a64c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/86d7ccf2-c2c8-4b0c-ac6d-6346b4e13fc0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e69b494-5cbd-4003-b6e6-3ac0aff566b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7d5ecb4-7da8-4938-a0b7-3dce1619f7b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/26cf0e3d-0765-41c1-a73a-b08b15a35855"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1312, 35, 2.667682926829268, 315.06402439024464, 81, 3117, 104.5, 829.7, 1060.0, 1530.529999999998, 5.147762763469717, 735.6021900920281, 3.756222124050489], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1372.7678571428573, 1006, 2137, 1342.5, 1614.8, 1681.6999999999998, 2137.0, 0.2551438829254069, 307.0237768612974, 1.2545404790326402], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e15c4420-eeec-4548-aeee-8eeffcc6dc82", 3, 0, 0.0, 282.3333333333333, 229, 388, 230.0, 388.0, 388.0, 388.0, 0.020897185845639456, 0.028808457700612983, 0.013400864621064363], "isController": false}, {"data": ["deleteBook", 18, 4, 22.22222222222222, 560.5555555555557, 86, 1514, 494.5, 1092.8000000000006, 1514.0, 1514.0, 0.08472821072847432, 0.017458644984089926, 0.0566877330025795], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 4, 22.22222222222222, 560.5555555555557, 86, 1514, 494.5, 1092.8000000000006, 1514.0, 1514.0, 0.08567226550786995, 0.01765317189664117, 0.05731935645849892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 133.76470588235296, 82, 254, 87.0, 250.8, 254.0, 254.0, 0.1173303885706398, 0.05212736817585755, 0.06575570260197391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b3c68c3-ddd3-4e82-b924-5416c8c00bb8", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 95.4705882352941, 83, 248, 85.0, 125.5999999999999, 248.0, 248.0, 0.11733929693054204, 0.08720234859779541, 0.058898826779588485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5297da7a-ab89-415c-9482-c23080f9eaad", 3, 0, 0.0, 676.0, 186, 1467, 375.0, 1467.0, 1467.0, 1467.0, 0.017914511948979472, 0.024696600945289082, 0.011488147311031757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 170.11764705882354, 82, 657, 84.0, 649.8, 657.0, 657.0, 0.11733848702374378, 4.086895189122032, 0.0679104582240475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 229.29411764705878, 83, 738, 245.0, 733.2, 738.0, 738.0, 0.11733200817182927, 12.448556708457566, 0.06779212650461046], "isController": false}, {"data": ["goToProfile", 19, 5, 26.31578947368421, 190.78947368421052, 83, 478, 187.0, 274.0, 478.0, 478.0, 0.08951792243036448, 0.13664642157994422, 0.05784893291102861], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 105.0, 83, 347, 85.0, 222.0, 347.0, 347.0, 0.07691208948172239, 0.05715830087460033, 0.038606263665630185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 563.4285714285714, 413, 746, 496.0, 746.0, 746.0, 746.0, 0.035886209954834644, 10.55173726103629, 0.02046635411486663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 119.7857142857143, 81, 252, 85.0, 251.0, 252.0, 252.0, 0.07691208948172239, 0.04533392551064133, 0.04247976594003054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6051cee-a663-4afc-83a3-3646c480d72c", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 838.0, 566, 1060, 825.0, 1060.0, 1060.0, 1060.0, 0.035870211326787874, 32.276079204949575, 0.020422200394059894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 154.0, 83, 253, 85.0, 253.0, 253.0, 253.0, 0.035990457387298454, 0.06368623904861796, 0.019928309900974828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1e4d231-305a-4f17-b022-76a582590aa2", 3, 0, 0.0, 586.6666666666667, 211, 1321, 228.0, 1321.0, 1321.0, 1321.0, 0.026732249786142002, 0.026984605008732534, 0.01714275132770174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 98.58333333333334, 83, 251, 85.0, 201.80000000000018, 251.0, 251.0, 0.05819677298893776, 0.043249750238849256, 0.0292120520667129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 97.83333333333334, 82, 251, 84.0, 201.50000000000017, 251.0, 251.0, 0.05819818421665244, 0.015572561011096454, 0.03319115193605959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 132.33333333333334, 83, 334, 84.0, 309.4000000000001, 334.0, 334.0, 0.05815221341862324, 0.015673838772988297, 0.03418714109180781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 110.66666666666667, 82, 248, 83.5, 247.4, 248.0, 248.0, 0.05815249522664935, 0.015673914729057832, 0.034244096310224174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52d25d2c-ba2d-43a5-a6af-917a78ad1901", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 88.0, 83, 105, 85.0, 105.0, 105.0, 105.0, 0.035989532187495184, 0.026746126947933428, 0.02020896582793919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0546783-5ae1-4383-bf73-c3fb36b31f3c", 3, 0, 0.0, 591.3333333333333, 211, 1282, 281.0, 1282.0, 1282.0, 1282.0, 0.0417908784442649, 0.026867508114395564, 0.026799489106511018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 528.4444444444445, 83, 1135, 494.0, 1125.1, 1135.0, 1135.0, 0.09051503052367973, 40.73499010148998, 0.049323620148645796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 240.28571428571433, 81, 895, 85.0, 857.0, 895.0, 895.0, 0.07691420220743761, 14.846474402335446, 0.04380074963877795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 370.2222222222222, 82, 750, 371.0, 741.0, 750.0, 750.0, 0.09051594086291863, 13.319544450241375, 0.04941251068590968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 222.42857142857142, 83, 658, 87.5, 615.5, 658.0, 658.0, 0.07691293455808025, 4.86235031163473, 0.04387513803124863], "isController": false}, {"data": ["deleteBooks", 17, 3, 17.647058823529413, 420.7647058823529, 85, 1171, 403.0, 802.1999999999997, 1171.0, 1171.0, 0.08746025703026124, 0.017564399045139782, 0.05919946051169395], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 245.83333333333334, 168, 498, 171.0, 474.6000000000001, 498.0, 498.0, 0.05812714343841429, 0.09008571937183935, 0.1307293079479181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e69b494-5cbd-4003-b6e6-3ac0aff566b4", 3, 0, 0.0, 384.66666666666663, 191, 648, 315.0, 648.0, 648.0, 648.0, 0.0757346258709482, 0.034267945950722, 0.04856680109562758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 532.1818181818182, 86, 1973, 365.5, 1429.0999999999997, 1914.9499999999991, 1973.0, 0.10775070405289579, 0.06618671176686665, 0.048719312477041754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 94.22222222222223, 84, 252, 85.0, 103.50000000000023, 252.0, 252.0, 0.09051457536092687, 0.06726717954068881, 0.04543407396046525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 139.77777777777777, 82, 259, 85.0, 252.70000000000002, 259.0, 259.0, 0.09051457536092687, 0.09219404502094407, 0.047820688740489684], "isController": false}, {"data": ["login", 22, 0, 0.0, 2486.5, 1516, 4067, 2299.0, 3827.8, 4031.7499999999995, 4067.0, 0.1069820367434668, 40.867741139638305, 0.21785812844652358], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a6051cee-a663-4afc-83a3-3646c480d72c", 3, 0, 0.0, 282.3333333333333, 225, 369, 253.0, 369.0, 369.0, 369.0, 0.11530922089403083, 0.05217441961025483, 0.07394504074259138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 112.85714285714286, 85, 254, 88.5, 251.0, 254.0, 254.0, 0.07690152759391598, 0.06225719372593395, 0.027336089886899825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=680ac8e7-5763-45f0-9fd0-e7c49ef75ce5", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 0.6545799365942029, 2.4980185688405796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e9208ae-6222-4299-8917-f95c2c2c19c1", 1, 0, 0.0, 648.0, 648, 648, 648.0, 648.0, 648.0, 648.0, 1.5432098765432098, 0.27880256558641975, 1.0639708719135803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 632.9444444444445, 169, 1221, 663.0, 1211.1, 1221.0, 1221.0, 0.09047590325110079, 54.19042739026027, 0.19190787291151457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/006a144d-3f75-49d6-bbfa-50889e7f5f24", 3, 0, 0.0, 258.0, 168, 408, 198.0, 408.0, 408.0, 408.0, 0.06150313665996966, 0.028509266472590104, 0.0394404880273894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, 53.333333333333336, 478.66666666666663, 83, 1144, 93.0, 1144.0, 1144.0, 1144.0, 0.06665363217859618, 37.221939792884946, 0.09354073536730595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 335.4117647058824, 169, 823, 331.0, 819.8, 823.0, 823.0, 0.11726240567274132, 16.664659751489925, 0.260196170951343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7d5ecb4-7da8-4938-a0b7-3dce1619f7b4", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86d7ccf2-c2c8-4b0c-ac6d-6346b4e13fc0", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["register", 27, 10, 37.03703703703704, 940.9259259259258, 365, 2548, 938.0, 1281.6, 2093.5999999999976, 2548.0, 0.108266335184554, 0.03369225795456824, 0.0488467254445937], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 100.60000000000001, 86, 253, 92.5, 105.4, 245.6499999999999, 253.0, 0.09860036777937181, 0.07655009021933652, 0.03504934948407357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 397.14285714285717, 168, 1072, 256.0, 1027.0, 1072.0, 1072.0, 0.07687619089456431, 19.80160902039141, 0.16868146350302837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1e4d231-305a-4f17-b022-76a582590aa2", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.29472114600326266, 1.124719616639478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 237.26666666666668, 168, 335, 174.0, 335.0, 335.0, 335.0, 0.11265490048817123, 0.1745930928464138, 0.2533635115471273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 103.5, 84, 249, 87.0, 233.40000000000006, 249.0, 249.0, 0.06775480889756151, 0.05035293903422295, 0.0340097380599088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 100.60000000000001, 82, 249, 85.0, 232.70000000000005, 249.0, 249.0, 0.06783018036044958, 0.018149872479260924, 0.0386843997368189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 116.60000000000001, 82, 250, 84.0, 249.9, 250.0, 250.0, 0.06783110055960657, 0.018282601322706458, 0.03987726810242496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e15c4420-eeec-4548-aeee-8eeffcc6dc82", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 0.25445642605633806, 0.9710607394366197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 87.0, 85, 89, 87.0, 89.0, 89.0, 89.0, 0.016556017284482045, 0.004882731660071853, 0.010234334903395639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 125.5, 83, 339, 84.0, 329.80000000000007, 339.0, 339.0, 0.0678306404569072, 0.018282477310650767, 0.03994323847218266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b995a75-b81d-4417-ab7e-6e01dc6a64c5", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 942.8214285714287, 660, 1744, 903.0, 1167.0, 1325.7499999999998, 1744.0, 0.24605218063745088, 294.363949620816, 0.485856942625904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 10, 37.03703703703704, 940.9259259259258, 365, 2548, 938.0, 1281.6, 2093.5999999999976, 2548.0, 0.10734690145156865, 0.033406132092350146, 0.04843190280334445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 118.83333333333334, 83, 262, 87.0, 262.0, 262.0, 262.0, 0.06484663770183516, 0.017478195318072758, 0.03818605716231114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 87.5, 82, 107, 84.0, 107.0, 107.0, 107.0, 0.06485014212989484, 0.017479139870948218, 0.038124790588082706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 166.65, 81, 900, 84.0, 251.9, 867.5999999999996, 900.0, 0.1019451127512947, 4.612623106688109, 0.059494530644700894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 113.05, 82, 481, 84.0, 233.30000000000032, 469.39999999999986, 481.0, 0.10194563239424415, 1.5248736989188667, 0.059594390186713427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 111.83333333333334, 83, 250, 84.5, 250.0, 250.0, 250.0, 0.06486556611422827, 0.017356606557908737, 0.03699364317452081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 93.35, 82, 248, 85.0, 89.0, 240.0499999999999, 248.0, 0.10194459311364273, 0.07576155796824426, 0.05117140709024645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 115.0, 84, 259, 86.5, 259.0, 259.0, 259.0, 0.06486276120774462, 0.048203673124114894, 0.03255806568435618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 126.20000000000003, 81, 254, 84.5, 252.0, 253.9, 254.0, 0.1019451127512947, 0.03493412115666925, 0.05771248228703666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 120.66666666666666, 84, 252, 90.0, 252.0, 252.0, 252.0, 0.06361930209625599, 0.05007534911092025, 0.0226146737920285], "isController": false}, {"data": ["deleteAccount", 17, 3, 17.647058823529413, 591.8235294117646, 84, 1533, 400.0, 1480.2, 1533.0, 1533.0, 0.08974670312846449, 0.01759051878873626, 0.06107188908891259], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1403.454545454546, 887, 3117, 1355.5, 1907.1, 2941.9499999999975, 3117.0, 0.10671116198754389, 0.055231363138084244, 0.049082966109505057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5297da7a-ab89-415c-9482-c23080f9eaad", 1, 0, 0.0, 1171.0, 1171, 1171, 1171.0, 1171.0, 1171.0, 1171.0, 0.8539709649871904, 0.15428186379163109, 0.588772950469684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 235.83333333333331, 170, 522, 177.0, 522.0, 522.0, 522.0, 0.06478292322143882, 0.1004008780785385, 0.14569831267477892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52d25d2c-ba2d-43a5-a6af-917a78ad1901", 3, 0, 0.0, 332.6666666666667, 274, 394, 330.0, 394.0, 394.0, 394.0, 0.02208252977461098, 0.022147224686060032, 0.014160997283848837], "isController": false}, {"data": ["addBook", 56, 10, 17.857142857142858, 952.7321428571429, 444, 2411, 777.5, 1564.2, 1731.9499999999998, 2411.0, 0.2696313273083571, 87.52049788658391, 0.9783539609323466], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8b3c68c3-ddd3-4e82-b924-5416c8c00bb8", 3, 0, 0.0, 258.3333333333333, 184, 382, 209.0, 382.0, 382.0, 382.0, 0.01821980371198134, 0.02510560843516179, 0.011683923604363036], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 153.91071428571428, 83, 609, 86.0, 340.3, 364.9999999999999, 609.0, 0.2471336905003575, 0.1836608774128633, 0.11946403984148138], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 540.125, 403, 742, 494.5, 670.2, 737.15, 742.0, 0.24729957694108087, 72.7142867394434, 0.12437429894986002], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 143.03571428571433, 82, 360, 90.0, 253.3, 265.34999999999997, 360.0, 0.24756195680043855, 0.438068618869526, 0.12039634227208829], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 785.3750000000002, 573, 1101, 747.5, 999.0, 1055.3, 1101.0, 0.24674929830668296, 222.02545235535425, 0.12385658137659672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 91.6, 85, 109, 89.0, 106.0, 109.0, 109.0, 0.11339411257767497, 0.08471337511906381, 0.0403080634553454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 10, 5.9523809523809526, 163.1190476190476, 83, 2064, 95.0, 280.69999999999993, 377.4499999999997, 1657.5900000000013, 0.6933639293924398, 1.5879594567823787, 0.33060052590415895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 90.89999999999999, 85, 99, 91.0, 98.7, 99.0, 99.0, 0.06814867314533386, 0.052775290824462646, 0.024224723657130395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0546783-5ae1-4383-bf73-c3fb36b31f3c", 1, 0, 0.0, 641.0, 641, 641, 641.0, 641.0, 641.0, 641.0, 1.5600624024960998, 0.28184721138845553, 1.0755898985959438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 89.11764705882352, 84, 97, 88.0, 95.4, 97.0, 97.0, 0.11577148071723836, 0.09395126999611825, 0.041153143536205826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/680ac8e7-5763-45f0-9fd0-e7c49ef75ce5", 3, 0, 0.0, 800.3333333333333, 390, 1533, 478.0, 1533.0, 1533.0, 1533.0, 0.0796918581484925, 0.03699237946606455, 0.05110447934652676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 263.19999999999993, 170, 589, 176.0, 563.7, 589.0, 589.0, 0.06771535174739465, 0.10494556955382356, 0.15229341315844716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=006a144d-3f75-49d6-bbfa-50889e7f5f24", 1, 0, 0.0, 287.0, 287, 287, 287.0, 287.0, 287.0, 287.0, 3.484320557491289, 0.6294915069686412, 2.4022756968641117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e9208ae-6222-4299-8917-f95c2c2c19c1", 3, 0, 0.0, 375.0, 187, 517, 421.0, 517.0, 517.0, 517.0, 0.03664390672904274, 0.030548517295923977, 0.02349885945840306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 270.29999999999995, 168, 983, 175.5, 483.00000000000034, 958.7999999999997, 983.0, 0.10190044326692821, 6.245447319063025, 0.22787287601263564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b995a75-b81d-4417-ab7e-6e01dc6a64c5", 3, 0, 0.0, 293.6666666666667, 183, 414, 284.0, 414.0, 414.0, 414.0, 0.07455083124176834, 0.033732309709003254, 0.047807661961680875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 117.25, 86, 251, 89.0, 250.7, 251.0, 251.0, 0.05835866261398176, 0.048385258358662614, 0.02074468085106383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86d7ccf2-c2c8-4b0c-ac6d-6346b4e13fc0", 3, 0, 0.0, 536.3333333333334, 198, 1011, 400.0, 1011.0, 1011.0, 1011.0, 0.04093886462882096, 0.02631974532614629, 0.026253113059497814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e69b494-5cbd-4003-b6e6-3ac0aff566b4", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 0.6208387027491409, 2.3692547250859106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 104.88888888888889, 84, 257, 91.0, 153.50000000000017, 257.0, 257.0, 0.08673946356460645, 0.06734167337291223, 0.030833168688981196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7d5ecb4-7da8-4938-a0b7-3dce1619f7b4", 3, 0, 0.0, 304.6666666666667, 258, 368, 288.0, 368.0, 368.0, 368.0, 0.027949355767349564, 0.02803123864557422, 0.017923252233619347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26cf0e3d-0765-41c1-a73a-b08b15a35855", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 0.4327045223577236, 0.8085090616531165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 85.66666666666667, 83, 97, 85.0, 92.2, 97.0, 97.0, 0.11286596790091873, 0.08387793122324136, 0.05665342529401584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 117.4, 81, 252, 85.0, 250.2, 252.0, 252.0, 0.11272516852412695, 0.030162789233994902, 0.06428857267391615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 116.93333333333332, 82, 249, 84.0, 248.4, 249.0, 249.0, 0.11286681715575621, 0.030421134311512416, 0.06635334367945823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 127.93333333333334, 83, 250, 85.0, 249.4, 250.0, 250.0, 0.11272601566140111, 0.030383183908737017, 0.06638065180061022], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 28.571428571428573, 0.7621951219512195], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 14.285714285714286, 0.38109756097560976], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.571428571428571, 0.22865853658536586], "isController": false}, {"data": ["401/Unauthorized", 17, 48.57142857142857, 1.295731707317073], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1312, 35, "401/Unauthorized", 17, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
