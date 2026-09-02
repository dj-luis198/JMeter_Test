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

    var data = {"OkPercent": 99.6937212863706, "KoPercent": 0.30627871362940273};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7342402123424021, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dafaa4c0-39fb-411d-9de2-8b03dcbb0ff0"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f34e8992-b90c-48d1-9589-1505ebf7bc48"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35c5f80d-5b3b-46ef-ab88-ff890b6f565e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd29e601-3fc1-494b-ada4-540a941e3e3b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1bffa8ea-183f-4621-aab6-6f55d66aa72b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2b5271c-dd8d-40ae-bdbc-094580d36d93"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/57b797ef-584b-4b19-8114-1267c4028f6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0872de60-bc81-468e-ac13-85d23bafabe5"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a0222c5-be41-49a1-8d1b-1df2c3d91bcc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed5d41e6-f830-4cac-97de-8d6dad720811"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd29e601-3fc1-494b-ada4-540a941e3e3b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/643b482a-dd85-4868-883d-3f74abb6b280"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2d69eb27-369a-4160-b80b-8188a93ea960"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db632d86-982a-44c2-9e5f-8327327ce9e9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.025, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.025, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69253f1b-cce5-4cc1-ac58-b3e21fcae4e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c36270f-0e34-45a7-9154-1835fca86e9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57b797ef-584b-4b19-8114-1267c4028f6e"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a2b5271c-dd8d-40ae-bdbc-094580d36d93"], "isController": false}, {"data": [0.9478021978021978, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1bffa8ea-183f-4621-aab6-6f55d66aa72b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d69eb27-369a-4160-b80b-8188a93ea960"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=643b482a-dd85-4868-883d-3f74abb6b280"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db632d86-982a-44c2-9e5f-8327327ce9e9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ed5d41e6-f830-4cac-97de-8d6dad720811"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/3a0222c5-be41-49a1-8d1b-1df2c3d91bcc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f34e8992-b90c-48d1-9589-1505ebf7bc48"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0872de60-bc81-468e-ac13-85d23bafabe5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1306, 4, 0.30627871362940273, 485.08652373659964, 125, 6678, 146.5, 1302.0, 1653.0, 2670.6900000000023, 5.037997145392122, 686.2884642740038, 3.692448248177294], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2148.9642857142862, 1527, 2824, 2150.0, 2626.4, 2678.1499999999996, 2824.0, 0.24699090103162805, 297.21358738019836, 1.2144523307561008], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dafaa4c0-39fb-411d-9de2-8b03dcbb0ff0", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 0.43447066326530615, 0.8118090986394558], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 1256.9090909090908, 530, 2767, 952.0, 2660.2000000000003, 2767.0, 2767.0, 0.08438948046767117, 0.01524614637355387, 0.05735847500537023], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 1256.9090909090908, 530, 2767, 952.0, 2660.2000000000003, 2767.0, 2767.0, 0.08134169427354472, 0.014695520938091577, 0.05528693282654993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 190.375, 126, 528, 132.5, 447.5000000000001, 528.0, 528.0, 0.13877444815473353, 0.0371330066351533, 0.07914480246324646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 149.875, 127, 389, 134.0, 214.00000000000017, 389.0, 389.0, 0.139105032993975, 0.103377861433999, 0.06982420601455386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 193.75, 127, 393, 132.0, 383.90000000000003, 393.0, 393.0, 0.13879852526566905, 0.03741054001301236, 0.08173389720234223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 162.12500000000003, 126, 388, 131.5, 379.6, 388.0, 388.0, 0.13911470877205184, 0.0374957613487171, 0.08178423308669454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f34e8992-b90c-48d1-9589-1505ebf7bc48", 3, 0, 0.0, 782.3333333333334, 394, 1079, 874.0, 1079.0, 1079.0, 1079.0, 0.02420584651879584, 0.028610491116454327, 0.01552262944076426], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 438.27272727272725, 244, 874, 383.0, 813.8000000000002, 874.0, 874.0, 0.08425761382437649, 0.24624257719146395, 0.0544712308122434], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/35c5f80d-5b3b-46ef-ab88-ff890b6f565e", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 1.013764880952381, 1.8942212301587302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd29e601-3fc1-494b-ada4-540a941e3e3b", 1, 0, 0.0, 903.0, 903, 903, 903.0, 903.0, 903.0, 903.0, 1.1074197120708749, 0.20007094407530454, 0.7635139811738648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1bffa8ea-183f-4621-aab6-6f55d66aa72b", 1, 0, 0.0, 1134.0, 1134, 1134, 1134.0, 1134.0, 1134.0, 1134.0, 0.8818342151675485, 0.15931575176366844, 0.6079833553791888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 145.8421052631579, 127, 403, 132.0, 136.0, 403.0, 403.0, 0.0995760158063823, 0.07400131643423528, 0.04998249230906299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 159.78947368421052, 125, 388, 133.0, 382.0, 388.0, 388.0, 0.09957549394685813, 0.02664422396624915, 0.056789148891567526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 931.3333333333334, 761, 1035, 998.0, 1035.0, 1035.0, 1035.0, 0.09678980480722697, 28.45941633731247, 0.05520043555412163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1384.0, 1287, 1483, 1382.0, 1483.0, 1483.0, 1483.0, 0.09458649935365893, 85.10909838375319, 0.05385149328435855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2b5271c-dd8d-40ae-bdbc-094580d36d93", 1, 0, 0.0, 823.0, 823, 823, 823.0, 823.0, 823.0, 823.0, 1.215066828675577, 0.21951890947752128, 0.8377316221142164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 343.0, 132, 502, 395.0, 502.0, 502.0, 502.0, 0.0976054138469547, 0.17271582997136908, 0.05404518520627277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57b797ef-584b-4b19-8114-1267c4028f6e", 3, 0, 0.0, 573.3333333333334, 403, 744, 573.0, 744.0, 744.0, 744.0, 0.03522615189516697, 0.02936659342562585, 0.022589687250481424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 165.375, 125, 413, 132.0, 392.70000000000005, 413.0, 413.0, 0.07096445124520435, 0.05273822988046925, 0.035620828066440464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 178.625, 126, 393, 131.5, 383.90000000000003, 393.0, 393.0, 0.07096413649951656, 0.03231155140908164, 0.039726749265964714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 315.9375, 125, 1259, 131.0, 1239.4, 1259.0, 1259.0, 0.07061118392889454, 7.958661358139925, 0.040753134474586596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 275.625, 126, 1050, 131.0, 1017.1, 1050.0, 1050.0, 0.07069073686256837, 2.614849666207177, 0.04086808224867234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 217.66666666666666, 126, 394, 133.0, 394.0, 394.0, 394.0, 0.09795278675678323, 0.07279499093936723, 0.0550027855323734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 893.8823529411765, 128, 1625, 1258.0, 1565.8, 1625.0, 1625.0, 0.09639046074640237, 51.02970128525339, 0.051794368670832244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 172.57894736842104, 126, 396, 132.0, 394.0, 396.0, 396.0, 0.09944728247215476, 0.026804150353822963, 0.0584641250471066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 662.2941176470588, 126, 1182, 999.0, 1178.8, 1182.0, 1182.0, 0.09639210038386736, 16.682743829488043, 0.05188938262277235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 214.4736842105263, 126, 394, 139.0, 394.0, 394.0, 394.0, 0.09944207760669088, 0.0268027474799284, 0.05855817655940879], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 887.0909090909091, 554, 1288, 828.0, 1262.4, 1288.0, 1288.0, 0.08123236888357187, 0.014675769769004683, 0.05600591057793139], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 502.43750000000006, 254, 1645, 270.0, 1467.2000000000003, 1645.0, 1645.0, 0.07057038513787689, 10.64903838201955, 0.15645743833912598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0872de60-bc81-468e-ac13-85d23bafabe5", 1, 0, 0.0, 828.0, 828, 828, 828.0, 828.0, 828.0, 828.0, 1.2077294685990339, 0.21819331219806765, 0.8326728562801933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 18, 0, 0.0, 1181.2777777777776, 160, 2788, 869.0, 2628.7000000000003, 2788.0, 2788.0, 0.07439953376292176, 0.045700494860232206, 0.033639632941633565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 135.64705882352945, 127, 180, 132.0, 147.99999999999997, 180.0, 180.0, 0.09638991421297635, 0.071633520230542, 0.0483832186576854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 225.88235294117646, 126, 416, 134.0, 408.8, 416.0, 416.0, 0.09638991421297635, 0.11095249890852597, 0.05021046312518782], "isController": false}, {"data": ["login", 18, 0, 0.0, 4531.944444444444, 2137, 8699, 3976.5, 7571.300000000002, 8699.0, 8699.0, 0.07280875970277846, 14.61921445289273, 0.12997501243816312], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a0222c5-be41-49a1-8d1b-1df2c3d91bcc", 1, 0, 0.0, 1288.0, 1288, 1288, 1288.0, 1288.0, 1288.0, 1288.0, 0.7763975155279502, 0.14026712927018634, 0.5352896933229814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed5d41e6-f830-4cac-97de-8d6dad720811", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 151.57894736842104, 129, 387, 136.0, 163.0, 387.0, 387.0, 0.09765675193643059, 0.07906000718291109, 0.03471392353990306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd29e601-3fc1-494b-ada4-540a941e3e3b", 3, 0, 0.0, 600.3333333333333, 244, 1235, 322.0, 1235.0, 1235.0, 1235.0, 0.01895255543622465, 0.02240127890264704, 0.01215381972961021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/643b482a-dd85-4868-883d-3f74abb6b280", 3, 0, 0.0, 413.3333333333333, 317, 603, 320.0, 603.0, 603.0, 603.0, 0.01959414004585029, 0.027012103871802074, 0.01256525256846519], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d69eb27-369a-4160-b80b-8188a93ea960", 3, 0, 0.0, 541.3333333333334, 415, 652, 557.0, 652.0, 652.0, 652.0, 0.0473081653893462, 0.03943887095120951, 0.03033759303939193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db632d86-982a-44c2-9e5f-8327327ce9e9", 1, 0, 0.0, 1160.0, 1160, 1160, 1160.0, 1160.0, 1160.0, 1160.0, 0.8620689655172413, 0.15574488146551727, 0.5943561422413793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1031.4705882352941, 261, 1767, 1388.0, 1701.3999999999999, 1767.0, 1767.0, 0.09631837187956804, 67.84397100994063, 0.2021258296836225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 388.68749999999994, 260, 802, 272.5, 706.1000000000001, 802.0, 802.0, 0.1386073427239808, 0.21481430947554447, 0.31173116239582793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1602.0, 1420, 1776, 1610.0, 1776.0, 1776.0, 1776.0, 0.09342592880944225, 111.76989096415559, 0.21066452111425993], "isController": false}, {"data": ["register", 20, 3, 15.0, 1954.8, 696, 3451, 1812.0, 3328.2000000000016, 3448.5, 3451.0, 0.07965747286667331, 0.02540637757642139, 0.03593921139101862], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 148.33333333333337, 128, 395, 132.5, 170.90000000000035, 395.0, 395.0, 0.10497340673695997, 0.08149790855066716, 0.03731476567602874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 402.7894736842105, 260, 798, 279.0, 529.0, 798.0, 798.0, 0.09937342440820511, 0.15400939896076318, 0.22349316055868784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 598.1428571428571, 263, 1653, 522.0, 1642.0, 1653.0, 1653.0, 0.06890306323332547, 11.867533707132452, 0.1524461048852272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 193.85714285714286, 126, 401, 133.0, 396.0, 401.0, 401.0, 0.08978330158852313, 0.06672372315318954, 0.045067008805176646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 203.78571428571428, 127, 395, 132.0, 387.5, 395.0, 395.0, 0.0896430286537538, 0.023986513526492715, 0.05112453977909396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 186.5, 126, 414, 132.0, 399.5, 414.0, 414.0, 0.0897890598444084, 0.0242009575361882, 0.05278614651009165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 204.07142857142858, 126, 394, 131.5, 393.5, 394.0, 394.0, 0.0896372891122707, 0.024160050581041714, 0.052784458334667224], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1446.8035714285716, 1009, 2221, 1332.5, 2001.1000000000004, 2154.5499999999997, 2221.0, 0.24097837219109586, 288.2939107777577, 0.4758381529007772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 3, 15.0, 1954.8, 696, 3451, 1812.0, 3328.2000000000016, 3448.5, 3451.0, 0.07851173161549664, 0.025040948775020708, 0.0354222851624604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 181.8, 126, 392, 131.0, 392.0, 392.0, 392.0, 0.04445590418863529, 0.011982255425843106, 0.026178623267331134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69253f1b-cce5-4cc1-ac58-b3e21fcae4e7", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.9150026862464185, 1.709683918338109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c36270f-0e34-45a7-9154-1835fca86e9d", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 1.0470030737704918, 1.9563268442622952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 183.4, 126, 392, 136.0, 392.0, 392.0, 392.0, 0.044456694733659936, 0.011982468502431782, 0.026135674052405553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 222.3333333333333, 126, 1123, 131.0, 569.5000000000009, 1123.0, 1123.0, 0.11124914245452691, 5.589551165721049, 0.06487119048943442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 225.55555555555554, 125, 1041, 132.0, 458.70000000000095, 1041.0, 1041.0, 0.1112512052213899, 1.8456280400936984, 0.06498103707755445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 133.61111111111114, 126, 164, 132.0, 143.30000000000004, 164.0, 164.0, 0.11124639221769682, 0.08267432077897197, 0.05584047421864861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 198.4, 125, 434, 132.0, 434.0, 434.0, 434.0, 0.04445709001671587, 0.01189574478962905, 0.025354434150158266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 161.55555555555557, 127, 395, 132.0, 382.40000000000003, 395.0, 395.0, 0.1112470797641562, 0.039049946076068286, 0.06292654370774156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 180.4, 128, 379, 128.0, 379.0, 379.0, 379.0, 0.04445116150885022, 0.03303450576976076, 0.022312399429247086], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 1379.8181818181818, 485, 3748, 744.0, 3746.4, 3748.0, 3748.0, 0.08052119171363736, 0.01454728561232706, 0.05480788146914574], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 134.4, 129, 145, 133.0, 145.0, 145.0, 145.0, 0.04485230137158337, 0.03530366689989863, 0.01594359150318003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 18, 0, 0.0, 2707.666666666667, 1636, 6678, 2172.5, 4874.400000000003, 6678.0, 6678.0, 0.07295571993109737, 0.03776028472996251, 0.03355678133549499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 425.2, 256, 771, 277.0, 771.0, 771.0, 771.0, 0.0444006358171049, 0.06881231351732957, 0.09985807059257089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57b797ef-584b-4b19-8114-1267c4028f6e", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["addBook", 63, 1, 1.5873015873015872, 1385.5238095238094, 658, 2533, 1163.0, 2323.6, 2452.0, 2533.0, 0.29015544041450775, 83.68459898531951, 1.0587804044329303], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 216.30357142857136, 127, 537, 134.5, 527.3, 533.3, 537.0, 0.24245992916706355, 0.1801875059532572, 0.11720475091571919], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 826.5, 626, 1136, 776.5, 1042.2, 1100.85, 1136.0, 0.24237387902080954, 71.26596800231987, 0.12189701923409854], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 193.4285714285714, 126, 535, 135.0, 399.1000000000001, 413.75, 535.0, 0.2429237609803709, 0.4298611864222969, 0.11814065719553193], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1227.2321428571424, 878, 1822, 1176.0, 1571.3000000000002, 1651.05, 1822.0, 0.24157298523816506, 217.36779675731407, 0.12125831485587583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 138.21428571428575, 127, 159, 136.0, 158.0, 159.0, 159.0, 0.07143768337798188, 0.053368972445464985, 0.025393864013267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2b5271c-dd8d-40ae-bdbc-094580d36d93", 3, 0, 0.0, 442.0, 268, 555, 503.0, 555.0, 555.0, 555.0, 0.032763610549882596, 0.026823073090154536, 0.02101051848413695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 1, 0.5494505494505495, 242.79670329670327, 126, 1298, 137.5, 489.4000000000002, 644.0999999999999, 1021.6099999999958, 0.7415647015202076, 1.4711246559567612, 0.3608586387194563], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 232.50000000000003, 128, 699, 138.0, 551.5, 699.0, 699.0, 0.09187135385564386, 0.0711464683667242, 0.0326573953158734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bffa8ea-183f-4621-aab6-6f55d66aa72b", 3, 0, 0.0, 1578.3333333333333, 330, 3740, 665.0, 3740.0, 3740.0, 3740.0, 0.019809825673534072, 0.023414543300977284, 0.01270356659403064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 152.25, 127, 393, 135.5, 220.80000000000018, 393.0, 393.0, 0.1327349200686903, 0.10771749861043131, 0.047183116118167265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d69eb27-369a-4160-b80b-8188a93ea960", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.2956858633387889, 1.1284011865793782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=643b482a-dd85-4868-883d-3f74abb6b280", 1, 0, 0.0, 988.0, 988, 988, 988.0, 988.0, 988.0, 988.0, 1.0121457489878543, 0.18285836285425103, 0.6978270495951417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 440.2857142857143, 259, 816, 316.5, 801.0, 816.0, 816.0, 0.08955930425214782, 0.1387994295392174, 0.20142097430927386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 401.72222222222223, 256, 1250, 274.0, 702.8000000000009, 1250.0, 1250.0, 0.11115571062463335, 7.550525432658165, 0.24841178559298482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db632d86-982a-44c2-9e5f-8327327ce9e9", 3, 0, 0.0, 436.0, 281, 644, 383.0, 644.0, 644.0, 644.0, 0.01751385053679952, 0.024144256843537097, 0.01123121274658042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed5d41e6-f830-4cac-97de-8d6dad720811", 3, 0, 0.0, 568.0, 324, 895, 485.0, 895.0, 895.0, 895.0, 0.022677108215160405, 0.022743545055634504, 0.014542286192664712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 154.75, 127, 384, 135.5, 251.70000000000013, 384.0, 384.0, 0.07392485538450165, 0.06129121310687686, 0.02627797593745957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a0222c5-be41-49a1-8d1b-1df2c3d91bcc", 3, 0, 0.0, 1638.0, 573, 3748, 593.0, 3748.0, 3748.0, 3748.0, 0.019455126750150778, 0.02682046282125278, 0.012476106672459972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f34e8992-b90c-48d1-9589-1505ebf7bc48", 1, 0, 0.0, 797.0, 797, 797, 797.0, 797.0, 797.0, 797.0, 1.2547051442910915, 0.22668012860727726, 0.865060382685069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 162.05882352941177, 128, 396, 135.0, 302.3999999999999, 396.0, 396.0, 0.09809012751716578, 0.07615395642201835, 0.03486797501586752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0872de60-bc81-468e-ac13-85d23bafabe5", 3, 0, 0.0, 781.3333333333333, 258, 1745, 341.0, 1745.0, 1745.0, 1745.0, 0.01528296407994009, 0.021068799765151785, 0.009800598710117831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 134.7142857142857, 126, 192, 131.5, 164.5, 192.0, 192.0, 0.06895023270703539, 0.051241335048880794, 0.03460978477677362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 242.78571428571428, 126, 395, 139.5, 394.0, 395.0, 395.0, 0.06894819528098851, 0.033242879867619465, 0.03849479318003852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 384.14285714285717, 125, 1527, 131.0, 1516.0, 1527.0, 1527.0, 0.06895125146521408, 8.879137767678609, 0.039689294579446616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 313.92857142857144, 129, 748, 257.5, 748.0, 748.0, 748.0, 0.06895125146521408, 2.912209204253307, 0.039756629785955615], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 75.0, 0.22970903522205208], "isController": false}, {"data": ["401/Unauthorized", 1, 25.0, 0.07656967840735068], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1306, 4, "406/Not Acceptable", 3, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
