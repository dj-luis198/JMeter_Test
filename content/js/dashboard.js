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

    var data = {"OkPercent": 97.52252252252252, "KoPercent": 2.4774774774774775};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8096774193548387, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/80447e0e-a1ef-4e01-ae91-1b4c67778083"], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2cefcb46-1d29-4c88-9e5c-3d1daea6fa81"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/eb8d0231-6b32-4e3e-95f6-7b6a59adaf11"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48d8bde1-6b90-41a7-8c24-cce4fd84977d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b33d825-d356-4e56-8051-5b82091b61c3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=707f1d93-33c6-4108-b297-eb5960d34e19"], "isController": false}, {"data": [0.8260869565217391, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f771287-0b02-47d0-9a0b-7555c05bcc6c"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3293a5d3-db74-4976-8597-787346feb8d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/218a0621-b24e-40f8-b642-8935d6b00f8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f426ba2a-2a03-46f5-b324-c2736309a6e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5c77f53-deaa-423f-87ad-2b11e84ab97e"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/afd6be7d-6626-40a1-921b-e7b5823c526c"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.325, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cefcb46-1d29-4c88-9e5c-3d1daea6fa81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8392857142857143, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7b33d825-d356-4e56-8051-5b82091b61c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8948863636363636, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80447e0e-a1ef-4e01-ae91-1b4c67778083"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da6e325e-8e4c-4b9d-8f11-6a6c656a45b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/48d8bde1-6b90-41a7-8c24-cce4fd84977d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebc9e0ae-360b-40b0-992c-b4c7cc16406a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afd6be7d-6626-40a1-921b-e7b5823c526c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da6e325e-8e4c-4b9d-8f11-6a6c656a45b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f426ba2a-2a03-46f5-b324-c2736309a6e8"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=218a0621-b24e-40f8-b642-8935d6b00f8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3293a5d3-db74-4976-8597-787346feb8d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f5c77f53-deaa-423f-87ad-2b11e84ab97e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/020286e4-38ce-4995-860a-e2a7b492baa9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/707f1d93-33c6-4108-b297-eb5960d34e19"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1332, 33, 2.4774774774774775, 295.146396396396, 79, 2794, 93.0, 806.0, 1008.3499999999999, 1488.1200000000026, 5.1618103538475255, 726.561826375514, 3.779449651519673], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/80447e0e-a1ef-4e01-ae91-1b4c67778083", 3, 0, 0.0, 505.6666666666667, 187, 896, 434.0, 896.0, 896.0, 896.0, 0.044896737503741395, 0.028864276227177493, 0.028791202110146664], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1346.7678571428569, 999, 1727, 1323.5, 1638.4, 1708.75, 1727.0, 0.2656886792900419, 319.7137367570799, 1.3063891603763291], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2cefcb46-1d29-4c88-9e5c-3d1daea6fa81", 3, 0, 0.0, 265.6666666666667, 203, 387, 207.0, 387.0, 387.0, 387.0, 0.0820860809368758, 0.03714181396557857, 0.05263983705912934], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 486.4666666666666, 83, 1446, 407.0, 1044.6000000000004, 1446.0, 1446.0, 0.0756425837489473, 0.014818263964881671, 0.050930703198672725], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 486.4666666666666, 83, 1446, 407.0, 1044.6000000000004, 1446.0, 1446.0, 0.076025585143587, 0.014893293339651904, 0.051188580830402126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 162.78947368421055, 80, 328, 83.0, 249.0, 328.0, 328.0, 0.10117684647744822, 0.03507075722881943, 0.05725519529793919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 99.63157894736842, 81, 244, 83.0, 242.0, 244.0, 244.0, 0.10117576893584392, 0.07519019546892307, 0.050785493391624775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 157.8421052631579, 81, 722, 82.0, 244.0, 722.0, 722.0, 0.10117684647744822, 1.5915904234783536, 0.05912209948612812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 123.89473684210526, 79, 716, 82.0, 242.0, 716.0, 716.0, 0.10117630770377707, 4.817341194799005, 0.05902297966888722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb8d0231-6b32-4e3e-95f6-7b6a59adaf11", 2, 0, 0.0, 600.0, 289, 911, 600.0, 911.0, 911.0, 911.0, 0.012297778406330897, 0.024307327631263413, 0.0076440780816695465], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 185.20000000000002, 82, 289, 187.0, 268.6, 289.0, 289.0, 0.07546334493791883, 0.1342766068032721, 0.04877604743122774], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 94.4705882352941, 81, 242, 83.0, 138.7999999999999, 242.0, 242.0, 0.09480258755297792, 0.07045387610138301, 0.04758645508030337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 91.58823529411765, 81, 239, 82.0, 115.7999999999999, 239.0, 239.0, 0.09480311623419715, 0.04211898557877303, 0.05313069864320011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 560.0, 467, 721, 487.5, 721.0, 721.0, 721.0, 0.04125306175067681, 12.12976988526492, 0.023527136779682864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 830.5, 637, 1007, 858.0, 1007.0, 1007.0, 1007.0, 0.04121926588487459, 37.08916789895097, 0.02346760938562684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 175.875, 81, 331, 166.5, 331.0, 331.0, 331.0, 0.04133811477527567, 0.07314908591093702, 0.022889366286700494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 107.53846153846155, 80, 246, 83.0, 244.4, 246.0, 246.0, 0.06694302119004093, 0.04974964758361441, 0.03360225868328227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 119.3076923076923, 81, 243, 82.0, 241.8, 243.0, 243.0, 0.06688997627978532, 0.025626418196131703, 0.03771605783924795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 173.38461538461536, 80, 954, 82.0, 668.3999999999997, 954.0, 954.0, 0.06664513516146066, 4.629458855920908, 0.03873948737074689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 137.46153846153845, 80, 483, 83.0, 387.79999999999995, 483.0, 483.0, 0.06680644630817299, 1.5276454228591103, 0.038898494992086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48d8bde1-6b90-41a7-8c24-cce4fd84977d", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 104.0, 82, 245, 83.0, 245.0, 245.0, 245.0, 0.04133875560010955, 0.030721477550472037, 0.02321268014654589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 502.875, 81, 957, 438.5, 956.3, 957.0, 957.0, 0.09377893959464054, 42.20386552393121, 0.05110219559942326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 162.1764705882353, 81, 800, 83.0, 613.5999999999998, 800.0, 800.0, 0.09480311623419715, 10.058312194329659, 0.0547753758664726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 364.25, 80, 806, 307.0, 696.1000000000001, 806.0, 806.0, 0.09377838994226768, 13.799618292647187, 0.05119347654074964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 166.52941176470588, 80, 635, 84.0, 632.6, 635.0, 635.0, 0.09480258755297792, 3.301970639080973, 0.05486765105677002], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 470.30769230769226, 86, 1411, 394.0, 1204.1999999999998, 1411.0, 1411.0, 0.07938204133972461, 0.015736869523402437, 0.05385957011571459], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b33d825-d356-4e56-8051-5b82091b61c3", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 295.46153846153845, 164, 1036, 169.0, 818.3999999999999, 1036.0, 1036.0, 0.06661576538952288, 6.2257316845077355, 0.14850932012206058], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=707f1d93-33c6-4108-b297-eb5960d34e19", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 443.86956521739125, 93, 1925, 336.0, 776.8000000000002, 1706.399999999997, 1925.0, 0.09184349867825227, 0.05641558659044987, 0.041526894421905075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 83.68749999999999, 81, 98, 83.0, 89.60000000000001, 98.0, 98.0, 0.09377948925345665, 0.06969354621277393, 0.047072907691676484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 103.0, 80, 246, 82.0, 246.0, 246.0, 246.0, 0.09378003891871615, 0.09552009823459078, 0.049545899467798284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f771287-0b02-47d0-9a0b-7555c05bcc6c", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["login", 23, 0, 0.0, 2435.565217391304, 1213, 3736, 2313.0, 3506.4, 3696.7999999999993, 3736.0, 0.09458909264384739, 39.48725932473669, 0.19727078980864216], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3293a5d3-db74-4976-8597-787346feb8d1", 3, 0, 0.0, 355.6666666666667, 187, 473, 407.0, 473.0, 473.0, 473.0, 0.08818601369822746, 0.03990187468767454, 0.056551577794761755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 87.3529411764706, 83, 110, 85.0, 97.19999999999999, 110.0, 110.0, 0.09281553186029624, 0.07514069913299375, 0.032993021090964685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/218a0621-b24e-40f8-b642-8935d6b00f8c", 3, 0, 0.0, 258.3333333333333, 176, 415, 184.0, 415.0, 415.0, 415.0, 0.027288604278853153, 0.02736855136170135, 0.01749952813455101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f426ba2a-2a03-46f5-b324-c2736309a6e8", 3, 0, 0.0, 303.6666666666667, 173, 485, 253.0, 485.0, 485.0, 485.0, 0.024247126715484214, 0.024318163219533485, 0.015549101441895802], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5c77f53-deaa-423f-87ad-2b11e84ab97e", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 588.8125000000001, 163, 1055, 531.0, 1045.2, 1055.0, 1055.0, 0.0937327912453573, 56.141136319699115, 0.19881603768058206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 297.5263157894737, 162, 805, 324.0, 486.0, 805.0, 805.0, 0.10113053290468181, 6.516234860360025, 0.2260830863841044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 658.4166666666667, 82, 1210, 840.0, 1174.3000000000002, 1210.0, 1210.0, 0.06180215071484488, 49.296751073812366, 0.1065543916865807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afd6be7d-6626-40a1-921b-e7b5823c526c", 3, 0, 0.0, 983.0, 163, 2230, 556.0, 2230.0, 2230.0, 2230.0, 0.017532376455187244, 0.024169796317616534, 0.011243092974192343], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 822.4782608695651, 144, 1710, 839.0, 1465.2, 1667.9999999999993, 1710.0, 0.10021611823759063, 0.03126647574769939, 0.045214693970475464], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 281.05882352941177, 165, 882, 168.0, 752.3999999999999, 882.0, 882.0, 0.09475767119088097, 13.466416113332961, 0.21025991297622698], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 87.43750000000001, 83, 105, 86.0, 95.20000000000002, 105.0, 105.0, 0.14973982705049976, 0.11625308838393292, 0.053227829146857336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 284.4, 165, 1128, 168.0, 648.6000000000004, 1128.0, 1128.0, 0.09297885660800734, 7.5501616088751415, 0.2075256602273643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 119.44444444444444, 80, 246, 84.0, 246.0, 246.0, 246.0, 0.04536244594308525, 0.03371173961199988, 0.022769821498775215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 116.88888888888889, 81, 244, 81.0, 244.0, 244.0, 244.0, 0.04536290322580645, 0.012138120589717742, 0.025871030745967742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 135.0, 79, 244, 84.0, 244.0, 244.0, 244.0, 0.04532703455430934, 0.01221705228221619, 0.026647338673529516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 144.66666666666666, 80, 326, 83.0, 326.0, 326.0, 326.0, 0.04532634971796938, 0.012216867697421434, 0.026691200078062048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 101.0, 86, 116, 101.0, 116.0, 116.0, 116.0, 0.028621311428489653, 0.008441050831449097, 0.017692666146712843], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 931.3571428571428, 644, 1373, 880.5, 1300.2, 1355.8, 1373.0, 0.25222271265527463, 301.746051138155, 0.49804133299703635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 822.4782608695651, 144, 1710, 839.0, 1465.2, 1667.9999999999993, 1710.0, 0.09476095519042832, 0.029564516760328945, 0.04275347783005653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 97.18181818181817, 80, 244, 83.0, 212.2000000000001, 244.0, 244.0, 0.04628616632723478, 0.0124755682678875, 0.02725640458527595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 97.45454545454545, 81, 242, 82.0, 211.4000000000001, 242.0, 242.0, 0.0462859715635822, 0.012475515772996765, 0.027211088751246566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 182.9375, 80, 721, 83.0, 396.9000000000003, 721.0, 721.0, 0.1605088129370103, 9.06719025874522, 0.09349951847356118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 136.9375, 80, 641, 82.0, 362.4000000000003, 641.0, 641.0, 0.16051042314560302, 2.9902707798298587, 0.09365720491161894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 111.54545454545455, 80, 243, 82.0, 242.4, 243.0, 243.0, 0.04628616632723478, 0.012385165599279619, 0.026397579233501087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 101.50000000000001, 80, 378, 83.0, 175.0000000000002, 378.0, 378.0, 0.16051364365971107, 0.11928797150882824, 0.0805703250401284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 97.72727272727273, 81, 244, 83.0, 212.6000000000001, 244.0, 244.0, 0.04628519252536219, 0.03439749171074279, 0.023232997029332188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 122.81249999999999, 80, 256, 82.0, 248.3, 256.0, 256.0, 0.16051203338650294, 0.058017105817558014, 0.09069948761549343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 89.63636363636364, 83, 116, 86.0, 112.4, 116.0, 116.0, 0.04848313888656267, 0.038161533147040544, 0.017234240776082824], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 437.2307692307693, 83, 979, 415.0, 816.1999999999998, 979.0, 979.0, 0.07980503017244026, 0.015485005478922264, 0.054308426106680914], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1370.086956521739, 749, 2794, 1293.0, 2191.4000000000005, 2713.799999999999, 2794.0, 0.09279132441460779, 0.048026759706779415, 0.04268038456960963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 225.63636363636365, 165, 489, 170.0, 456.4000000000001, 489.0, 489.0, 0.04626903339782956, 0.0717079648460503, 0.10406014054218894], "isController": false}, {"data": ["addBook", 60, 17, 28.333333333333332, 847.2166666666665, 417, 2375, 716.5, 1447.1, 1538.6, 2375.0, 0.27065064414853307, 76.61589359257155, 0.9842802722745481], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cefcb46-1d29-4c88-9e5c-3d1daea6fa81", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.555889423076923, 2.121394230769231], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 144.73214285714283, 81, 347, 84.0, 330.3, 338.3, 347.0, 0.2532149252111631, 0.18818023250556168, 0.12240369919875563], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 513.9642857142856, 395, 724, 480.0, 651.0, 716.9, 724.0, 0.25291872727683307, 74.36650351150554, 0.1272003364722354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b33d825-d356-4e56-8051-5b82091b61c3", 3, 0, 0.0, 231.33333333333334, 163, 354, 177.0, 354.0, 354.0, 354.0, 0.026746072784979407, 0.026824430420091652, 0.017151615685680154], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 129.21428571428572, 81, 333, 85.0, 244.3, 246.6, 333.0, 0.2533718820553889, 0.44834946316832486, 0.12322187232771843], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 785.1785714285716, 562, 1184, 784.5, 1035.6, 1046.75, 1184.0, 0.25265741459277036, 227.3415857749364, 0.1268221788092617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 101.39999999999999, 82, 244, 86.0, 163.60000000000005, 244.0, 244.0, 0.09763082530590991, 0.07293709117091904, 0.03470470743296017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 17, 9.659090909090908, 142.44318181818184, 82, 2043, 87.0, 259.0000000000001, 329.0, 858.7399999999843, 0.6983905272848481, 1.499134731089886, 0.33505880765689977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 104.88888888888889, 83, 244, 86.0, 244.0, 244.0, 244.0, 0.044515008977193474, 0.03447304894425237, 0.015823694597361743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80447e0e-a1ef-4e01-ae91-1b4c67778083", 1, 0, 0.0, 894.0, 894, 894, 894.0, 894.0, 894.0, 894.0, 1.1185682326621924, 0.20208508109619686, 0.7712003635346756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da6e325e-8e4c-4b9d-8f11-6a6c656a45b1", 3, 0, 0.0, 457.0, 171, 979, 221.0, 979.0, 979.0, 979.0, 0.037313896939016655, 0.030329687713777535, 0.02392850812821055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 97.78947368421052, 83, 264, 86.0, 125.0, 264.0, 264.0, 0.10274602264738647, 0.08338080548825992, 0.036523000237938155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48d8bde1-6b90-41a7-8c24-cce4fd84977d", 3, 0, 0.0, 331.0, 166, 572, 255.0, 572.0, 572.0, 572.0, 0.03392283685376996, 0.028280073301596632, 0.02175390253968972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebc9e0ae-360b-40b0-992c-b4c7cc16406a", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afd6be7d-6626-40a1-921b-e7b5823c526c", 1, 0, 0.0, 1411.0, 1411, 1411, 1411.0, 1411.0, 1411.0, 1411.0, 0.7087172218284905, 0.12803973245924877, 0.48862730333097093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da6e325e-8e4c-4b9d-8f11-6a6c656a45b1", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.2976343698517298, 1.1358371087314663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 301.1111111111111, 167, 490, 322.0, 490.0, 490.0, 490.0, 0.045306726538666776, 0.07021657716490642, 0.10189588986186483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f426ba2a-2a03-46f5-b324-c2736309a6e8", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 295.25, 162, 808, 245.5, 677.1000000000001, 808.0, 808.0, 0.16037849324405598, 12.224797788405638, 0.3581303438615132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=218a0621-b24e-40f8-b642-8935d6b00f8c", 1, 0, 0.0, 669.0, 669, 669, 669.0, 669.0, 669.0, 669.0, 1.4947683109118086, 0.2700509155455904, 1.030572683109118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 86.0, 82, 94, 85.0, 92.4, 94.0, 94.0, 0.06614698878554129, 0.05484257175676226, 0.023513187419860377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3293a5d3-db74-4976-8597-787346feb8d1", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 115.0, 83, 245, 84.5, 245.0, 245.0, 245.0, 0.09301838857269096, 0.07221642472196223, 0.03306513031294874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5c77f53-deaa-423f-87ad-2b11e84ab97e", 3, 0, 0.0, 254.66666666666669, 170, 415, 179.0, 415.0, 415.0, 415.0, 0.0815971277811021, 0.03692057539574607, 0.05232628311483436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/020286e4-38ce-4995-860a-e2a7b492baa9", 2, 0, 0.0, 255.0, 206, 304, 255.0, 304.0, 304.0, 304.0, 0.060849458439819884, 0.03740696688268224, 0.037822929977485695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 83.73333333333332, 82, 90, 83.0, 88.8, 90.0, 90.0, 0.09302671727320086, 0.06913411312979087, 0.04669505144377465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 103.46666666666667, 80, 244, 82.0, 243.4, 244.0, 244.0, 0.09302729420812067, 0.034206911307777706, 0.052533772783934805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 188.66666666666666, 80, 1045, 82.0, 563.8000000000003, 1045.0, 1045.0, 0.0930278711501966, 5.603845122936332, 0.05415724113444388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/707f1d93-33c6-4108-b297-eb5960d34e19", 3, 0, 0.0, 290.6666666666667, 173, 510, 189.0, 510.0, 510.0, 510.0, 0.023943875555697446, 0.024014023628614527, 0.015354633738516916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 149.73333333333335, 80, 625, 82.0, 395.8000000000001, 625.0, 625.0, 0.09302729420812067, 1.8469430649702623, 0.054247752228003696], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 24.242424242424242, 0.6006006006006006], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.0606060606060606, 0.15015015015015015], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.0606060606060606, 0.15015015015015015], "isController": false}, {"data": ["401/Unauthorized", 21, 63.63636363636363, 1.5765765765765767], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1332, 33, "401/Unauthorized", 21, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
