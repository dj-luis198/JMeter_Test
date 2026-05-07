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

    var data = {"OkPercent": 98.89589905362776, "KoPercent": 1.1041009463722398};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7400539447066756, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/970d9c4d-7f08-4463-a550-a25acf338ba4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/843b3801-7adc-4260-ac20-cc0cad8d02c8"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/50eeefea-f912-48e4-9d8b-1e4f4d293e6a"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/62dd4d0f-6ada-4494-a1ab-e0d23ca2e109"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c289701-9c82-45b4-a61d-01d6b766f9d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=460eed8b-3fa2-444a-9088-e5fc0040d7bf"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c751e1b-4f0e-4c67-ae8d-b9cb029c1dcd"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c16478bd-53d5-4d53-986d-7be72784cc9c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1476cd3-5e44-4eae-9287-44eb3e557a40"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8ac06f0-0db6-4685-87eb-ba172d492bf2"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aee69aba-8087-4248-831c-6915b8d2a9f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=970d9c4d-7f08-4463-a550-a25acf338ba4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c75f542-1173-4167-ac91-59d43dbe66d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c75f542-1173-4167-ac91-59d43dbe66d8"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2358490566037736, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62dd4d0f-6ada-4494-a1ab-e0d23ca2e109"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8fa97ff8-da97-438f-85e3-d08885778626"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a188a8fd-02d3-4fe0-8ce8-cd8ed505eb03"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50eeefea-f912-48e4-9d8b-1e4f4d293e6a"], "isController": false}, {"data": [0.27586206896551724, 500, 1500, "addBook"], "isController": true}, {"data": [0.8962264150943396, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f775eb70-78d3-4487-976a-8b98f3909d47"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c289701-9c82-45b4-a61d-01d6b766f9d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f85a0c58-d9a5-4767-b105-cec461428a69"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3490566037735849, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9497041420118343, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c751e1b-4f0e-4c67-ae8d-b9cb029c1dcd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/460eed8b-3fa2-444a-9088-e5fc0040d7bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aee69aba-8087-4248-831c-6915b8d2a9f3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b1476cd3-5e44-4eae-9287-44eb3e557a40"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c16478bd-53d5-4d53-986d-7be72784cc9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8ac06f0-0db6-4685-87eb-ba172d492bf2"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fa97ff8-da97-438f-85e3-d08885778626"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a188a8fd-02d3-4fe0-8ce8-cd8ed505eb03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=843b3801-7adc-4260-ac20-cc0cad8d02c8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/277f6fa1-13ac-40cb-a41b-15bef3a3785c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1268, 14, 1.1041009463722398, 479.71293375394407, 125, 3236, 163.5, 1353.4000000000005, 1611.7499999999998, 2083.579999999999, 4.953879692609421, 694.9540965530393, 3.6099669175675198], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2347.4150943396235, 1617, 3108, 2367.0, 2817.6, 2919.1999999999994, 3108.0, 0.22999080036798528, 276.7555385269849, 1.130862968606256], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/970d9c4d-7f08-4463-a550-a25acf338ba4", 3, 0, 0.0, 426.66666666666663, 235, 781, 264.0, 781.0, 781.0, 781.0, 0.0719890576632352, 0.033416795647061646, 0.04616485794159288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/843b3801-7adc-4260-ac20-cc0cad8d02c8", 3, 0, 0.0, 568.6666666666666, 264, 1003, 439.0, 1003.0, 1003.0, 1003.0, 0.02097447406506282, 0.02515981019848844, 0.013450427704483642], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 543.3333333333333, 152, 918, 558.0, 799.2, 918.0, 918.0, 0.0812510494927226, 0.01529804916230168, 0.05496612339055213], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 543.3333333333333, 152, 918, 558.0, 799.2, 918.0, 918.0, 0.07928537449125217, 0.014927949415931075, 0.053636349371002694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 188.99999999999997, 127, 411, 139.0, 394.2, 411.0, 411.0, 0.08437489453138183, 0.039473827610840485, 0.0471752339997075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 141.93333333333337, 129, 155, 142.0, 153.8, 155.0, 155.0, 0.0843668269636379, 0.06269839386653168, 0.042348192440732305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 345.40000000000003, 127, 1053, 151.0, 961.8000000000001, 1053.0, 1053.0, 0.084374419925863, 3.3275601308366007, 0.04871853713036973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 379.6666666666667, 127, 1577, 151.0, 1411.4, 1577.0, 1577.0, 0.084374419925863, 10.142409518981433, 0.04863614023591088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50eeefea-f912-48e4-9d8b-1e4f4d293e6a", 3, 0, 0.0, 381.3333333333333, 218, 598, 328.0, 598.0, 598.0, 598.0, 0.020902718746951685, 0.02470630591477265, 0.013404412738116805], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 352.40000000000003, 146, 1003, 264.0, 841.0000000000001, 1003.0, 1003.0, 0.0813418145731995, 0.16900668426361254, 0.05258091646466782], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/62dd4d0f-6ada-4494-a1ab-e0d23ca2e109", 3, 0, 0.0, 304.0, 249, 405, 258.0, 405.0, 405.0, 405.0, 0.061613029101887415, 0.028560206198270727, 0.0395109594175515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c289701-9c82-45b4-a61d-01d6b766f9d9", 1, 0, 0.0, 785.0, 785, 785, 785.0, 785.0, 785.0, 785.0, 1.2738853503184713, 0.23014530254777069, 0.8782842356687898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 155.42857142857142, 128, 384, 137.5, 267.0, 384.0, 384.0, 0.09622919043756788, 0.0715140760966691, 0.048302542856357315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 157.5, 127, 398, 139.0, 275.5, 398.0, 398.0, 0.09639284214295059, 0.056816372496368055, 0.0532392943699695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1055.8, 820, 1197, 1046.0, 1197.0, 1197.0, 1197.0, 0.0892920922923066, 26.25483991044003, 0.0509243963854561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1435.4, 1071, 1754, 1527.0, 1754.0, 1754.0, 1754.0, 0.08924109373884485, 80.2992930153227, 0.05080816176733062], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 184.2, 127, 377, 134.0, 377.0, 377.0, 377.0, 0.09036199013247068, 0.15989836535159851, 0.05003442227061609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 161.92857142857144, 130, 393, 143.5, 289.5, 393.0, 393.0, 0.07004728191529283, 0.05205662259525179, 0.035160452055137216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 136.49999999999997, 128, 149, 134.5, 148.0, 149.0, 149.0, 0.07005078682044483, 0.026259272347451904, 0.03953061281929399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 264.57142857142856, 126, 1562, 146.0, 1001.0, 1562.0, 1562.0, 0.07005078682044483, 4.519805179067324, 0.040752201596157216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 280.5, 133, 1257, 148.0, 846.0, 1257.0, 1257.0, 0.07004517914054566, 1.4886457233665713, 0.04081734281111317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 192.2, 133, 402, 140.0, 402.0, 402.0, 402.0, 0.09075068970524175, 0.0674426512360244, 0.050958639238783215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=460eed8b-3fa2-444a-9088-e5fc0040d7bf", 1, 0, 0.0, 664.0, 664, 664, 664.0, 664.0, 664.0, 664.0, 1.5060240963855422, 0.2720844314759036, 1.0383330195783131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 922.5882352941177, 127, 1801, 1185.0, 1781.8, 1801.0, 1801.0, 0.13812491367192897, 73.12417670949893, 0.0742199243156723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 462.2857142857143, 125, 1566, 147.5, 1495.5, 1566.0, 1566.0, 0.09638686935448336, 18.605213959486534, 0.05488995545549681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 721.6470588235295, 131, 1187, 1001.0, 1184.6, 1187.0, 1187.0, 0.1381439947992849, 23.908814805785795, 0.07436508359743214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 346.64285714285717, 132, 1053, 142.0, 1041.5, 1053.0, 1053.0, 0.09638554216867469, 6.093386940619621, 0.05498332616179002], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 545.7857142857143, 215, 1071, 521.5, 1021.5, 1071.0, 1071.0, 0.08389764487325464, 0.01515728935698448, 0.057843493438005635], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c751e1b-4f0e-4c67-ae8d-b9cb029c1dcd", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 471.78571428571433, 282, 1956, 296.0, 1291.5, 1956.0, 1956.0, 0.06999405050570702, 6.081958619454847, 0.15613907192888604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 155.1176470588235, 129, 391, 140.0, 205.39999999999984, 391.0, 391.0, 0.13813389236932128, 0.10265614462212255, 0.06933673894319446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 775.0, 266, 2211, 769.5, 1408.6, 2104.0499999999984, 2211.0, 0.10479633784433932, 0.06437196924227484, 0.04738350041204015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 219.52941176470588, 131, 426, 147.0, 419.6, 426.0, 426.0, 0.1381260359452696, 0.15899411237771785, 0.07195122322792422], "isController": false}, {"data": ["login", 22, 0, 0.0, 3116.954545454545, 1711, 5403, 2990.0, 4728.7, 5315.8499999999985, 5403.0, 0.09985883591831547, 27.28900228682408, 0.18829915437722128], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 148.28571428571428, 129, 161, 149.5, 159.0, 161.0, 161.0, 0.0993873479906008, 0.08046104637129693, 0.03532909635603388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c16478bd-53d5-4d53-986d-7be72784cc9c", 3, 0, 0.0, 434.6666666666667, 249, 556, 499.0, 556.0, 556.0, 556.0, 0.07241828803167093, 0.03356889393134746, 0.04644011309322647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1476cd3-5e44-4eae-9287-44eb3e557a40", 1, 0, 0.0, 972.0, 972, 972, 972.0, 972.0, 972.0, 972.0, 1.02880658436214, 0.18586837705761317, 0.7093139146090535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8ac06f0-0db6-4685-87eb-ba172d492bf2", 3, 0, 0.0, 590.3333333333334, 328, 1017, 426.0, 1017.0, 1017.0, 1017.0, 0.08632348286478865, 0.039059127988950594, 0.055357181394411994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1098.0588235294117, 266, 1943, 1320.0, 1927.8, 1943.0, 1943.0, 0.13796461613374453, 97.17842229599496, 0.28952121966807337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aee69aba-8087-4248-831c-6915b8d2a9f3", 3, 0, 0.0, 438.0, 264, 707, 343.0, 707.0, 707.0, 707.0, 0.05565656190864903, 0.025183144874030648, 0.035691219713554226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=970d9c4d-7f08-4463-a550-a25acf338ba4", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 600.5999999999999, 277, 1733, 545.0, 1554.8000000000002, 1733.0, 1733.0, 0.08430139434506247, 13.560400675745928, 0.18671990475347464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, 16.666666666666668, 1381.3333333333335, 146, 1930, 1549.5, 1930.0, 1930.0, 1930.0, 0.08649646085314343, 86.23705593978404, 0.17183850930557756], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 1206.7500000000002, 334, 2403, 1251.0, 1823.0, 2284.5, 2403.0, 0.09653596769262947, 0.030591720230720962, 0.04355431354882307], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c75f542-1173-4167-ac91-59d43dbe66d8", 1, 0, 0.0, 1071.0, 1071, 1071, 1071.0, 1071.0, 1071.0, 1071.0, 0.9337068160597572, 0.168687266573296, 0.6437470821661998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 167.9230769230769, 132, 412, 150.0, 311.9999999999999, 412.0, 412.0, 0.06710335465155293, 0.05209684272264119, 0.023853145598794204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 643.5, 263, 1709, 290.5, 1641.5, 1709.0, 1709.0, 0.09613073780341265, 24.761155081625297, 0.21092972156418444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c75f542-1173-4167-ac91-59d43dbe66d8", 3, 0, 0.0, 435.3333333333333, 322, 590, 394.0, 590.0, 590.0, 590.0, 0.02385211687537269, 0.03288206867421983, 0.015295791095209699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 440.52941176470586, 268, 889, 307.0, 652.1999999999998, 889.0, 889.0, 0.10048172119277714, 0.15572704251263408, 0.22598574600289623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 146.45454545454544, 134, 161, 148.0, 159.4, 161.0, 161.0, 0.06814056779676766, 0.05063962118490253, 0.03420337094486189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 166.8181818181818, 131, 406, 142.0, 355.20000000000016, 406.0, 406.0, 0.06814352264842899, 0.01823371602116166, 0.03886310276043215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 163.45454545454544, 132, 380, 142.0, 334.40000000000015, 380.0, 380.0, 0.068139723600503, 0.018365784876698075, 0.04005870469482696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 138.9090909090909, 128, 152, 137.0, 151.8, 152.0, 152.0, 0.068139723600503, 0.018365784876698075, 0.040125247393655576], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1635.3207547169811, 1051, 2513, 1602.0, 2180.8, 2350.2, 2513.0, 0.23110801029084724, 276.485526452056, 0.45634804375790344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 1206.7500000000002, 334, 2403, 1251.0, 1823.0, 2284.5, 2403.0, 0.09483654526271698, 0.030053182556398106, 0.04278758194470239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 218.2, 130, 440, 139.5, 435.40000000000003, 440.0, 440.0, 0.05668516492548736, 0.01527842335882276, 0.03338003364264538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62dd4d0f-6ada-4494-a1ab-e0d23ca2e109", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 215.2, 128, 595, 138.5, 580.9000000000001, 595.0, 595.0, 0.05668098806298392, 0.015277297563851135, 0.033322221497965154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 244.84615384615384, 128, 443, 151.0, 439.8, 443.0, 443.0, 0.06631367387955396, 0.01787360741284853, 0.03898518718309715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 162.00000000000003, 128, 438, 139.0, 323.19999999999993, 438.0, 438.0, 0.06639563627448977, 0.01789569883960857, 0.039098211595231774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 213.92307692307696, 127, 521, 144.0, 483.4, 521.0, 521.0, 0.06639597538241528, 0.04934310279884573, 0.03332766733062642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 166.9, 134, 398, 140.5, 373.1000000000001, 398.0, 398.0, 0.05668516492548736, 0.015167710146077668, 0.032328258121567005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 242.46153846153845, 128, 442, 147.0, 428.0, 442.0, 442.0, 0.06631502698511484, 0.01774445058000143, 0.0378202888274483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 141.4, 129, 154, 141.5, 153.7, 154.0, 154.0, 0.05668516492548736, 0.04212637744950769, 0.028453295675488766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 149.2, 137, 170, 149.0, 168.6, 170.0, 170.0, 0.05837302699168768, 0.04594595679228542, 0.02074978693845148], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 560.0714285714286, 405, 823, 536.5, 802.0, 823.0, 823.0, 0.08452881224943246, 0.01527131861928223, 0.057535724743998456], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8fa97ff8-da97-438f-85e3-d08885778626", 3, 0, 0.0, 446.0, 243, 823, 272.0, 823.0, 823.0, 823.0, 0.02000280039205489, 0.02757547514985431, 0.012827316657665405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1529.181818181818, 1017, 3236, 1443.0, 2077.2999999999997, 3081.4999999999977, 3236.0, 0.10350992754305072, 0.053574474216618054, 0.047610523313258685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a188a8fd-02d3-4fe0-8ce8-cd8ed505eb03", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.28272936228482004, 1.0789563771517996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 387.30000000000007, 267, 747, 293.5, 731.5, 747.0, 747.0, 0.05663829088293432, 0.08777828870236012, 0.12738084365566185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50eeefea-f912-48e4-9d8b-1e4f4d293e6a", 1, 0, 0.0, 861.0, 861, 861, 861.0, 861.0, 861.0, 861.0, 1.1614401858304297, 0.20983050232288036, 0.8007585656213705], "isController": false}, {"data": ["addBook", 58, 7, 12.068965517241379, 1397.6034482758619, 721, 2681, 1140.0, 2317.2000000000003, 2489.15, 2681.0, 0.27342626683575094, 91.30934646407981, 0.9927999468468767], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 266.2075471698112, 133, 657, 151.0, 597.6, 610.3, 657.0, 0.23265410041877738, 0.17290016642450154, 0.11246462862040507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f775eb70-78d3-4487-976a-8b98f3909d47", 1, 0, 0.0, 1415.0, 1415, 1415, 1415.0, 1415.0, 1415.0, 1415.0, 0.7067137809187278, 0.22567910777385158, 0.42168175795053003], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 879.7924528301888, 634, 1336, 809.0, 1200.4, 1248.3, 1336.0, 0.23248265153043768, 68.35761870048778, 0.11692242728337443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c289701-9c82-45b4-a61d-01d6b766f9d9", 3, 0, 0.0, 669.6666666666666, 371, 1190, 448.0, 1190.0, 1190.0, 1190.0, 0.02140899748801096, 0.025304710247059832, 0.01372907716516328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f85a0c58-d9a5-4767-b105-cec461428a69", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.7096354166666666, 1.3259548611111112], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 216.62264150943398, 128, 539, 148.0, 433.20000000000005, 448.9, 539.0, 0.23316483874231766, 0.41259246855574183, 0.11339461884147871], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1367.3773584905657, 905, 1913, 1328.0, 1772.4, 1832.3999999999996, 1913.0, 0.23175477720932267, 208.53335591439284, 0.1163300346538983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 165.35294117647058, 134, 429, 147.0, 220.99999999999983, 429.0, 429.0, 0.09959109069819212, 0.07440154725011423, 0.03540152052162298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, 4.1420118343195265, 214.26035502958584, 129, 2078, 154.0, 341.0, 401.5, 1479.5000000000098, 0.6927620710716497, 1.4869829456017807, 0.3342356021291161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 198.63636363636363, 141, 424, 154.0, 419.40000000000003, 424.0, 424.0, 0.06920458763502758, 0.05359300585407898, 0.02460006826088871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c751e1b-4f0e-4c67-ae8d-b9cb029c1dcd", 3, 0, 0.0, 356.0, 235, 538, 295.0, 538.0, 538.0, 538.0, 0.07128261179489617, 0.03225352551917502, 0.04571183113149266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/460eed8b-3fa2-444a-9088-e5fc0040d7bf", 3, 0, 0.0, 385.3333333333333, 228, 614, 314.0, 614.0, 614.0, 614.0, 0.017819700272641414, 0.024565895395389448, 0.011427346854525906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 167.20000000000002, 129, 452, 149.0, 278.0000000000001, 452.0, 452.0, 0.08536550664428193, 0.06927610939589676, 0.030344769939959593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aee69aba-8087-4248-831c-6915b8d2a9f3", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1476cd3-5e44-4eae-9287-44eb3e557a40", 3, 0, 0.0, 977.3333333333333, 438, 1761, 733.0, 1761.0, 1761.0, 1761.0, 0.01910037245726292, 0.022575993617292203, 0.012248611243752587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 319.09090909090907, 285, 546, 298.0, 499.60000000000014, 546.0, 546.0, 0.06807857505353451, 0.10550849473628836, 0.15311031088700194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c16478bd-53d5-4d53-986d-7be72784cc9c", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8ac06f0-0db6-4685-87eb-ba172d492bf2", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 506.3076923076923, 266, 928, 523.0, 904.8, 928.0, 928.0, 0.06626668773607507, 0.10270042327846791, 0.14903533384392667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fa97ff8-da97-438f-85e3-d08885778626", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a188a8fd-02d3-4fe0-8ce8-cd8ed505eb03", 3, 0, 0.0, 369.6666666666667, 242, 535, 332.0, 535.0, 535.0, 535.0, 0.027212118463422377, 0.027291841466733184, 0.017450479613587918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 150.2142857142857, 137, 161, 151.0, 159.0, 161.0, 161.0, 0.07455850712566303, 0.06181657475555461, 0.026503219329825533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 146.47058823529412, 130, 167, 146.0, 160.6, 167.0, 167.0, 0.1478685187923491, 0.11480026605460697, 0.05256263753946785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=843b3801-7adc-4260-ac20-cc0cad8d02c8", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/277f6fa1-13ac-40cb-a41b-15bef3a3785c", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.6310986907114624, 1.1792088685770752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 160.47058823529417, 127, 447, 143.0, 213.3999999999998, 447.0, 447.0, 0.10057326762546515, 0.0747424381474404, 0.050483065976063564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 215.00000000000003, 128, 426, 142.0, 412.4, 426.0, 426.0, 0.10056493833003047, 0.026908977639090184, 0.0573534413913455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 221.35294117647055, 128, 439, 150.0, 414.2, 439.0, 439.0, 0.10056255878473105, 0.027104752172447042, 0.059119785535554775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 240.4705882352941, 127, 450, 148.0, 445.2, 450.0, 450.0, 0.10057683774589558, 0.027108600798698416, 0.059226399571069364], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 35.714285714285715, 0.3943217665615142], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.07886435331230283], "isController": false}, {"data": ["401/Unauthorized", 8, 57.142857142857146, 0.6309148264984227], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1268, 14, "401/Unauthorized", 8, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
