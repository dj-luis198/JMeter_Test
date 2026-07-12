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

    var data = {"OkPercent": 99.28286852589642, "KoPercent": 0.7171314741035857};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7372013651877133, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fa1e4371-d11d-4f0f-b408-55fd052e9e1d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98ee7525-3c79-4e4e-aa0d-747ba0ea4ec1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/675a2e3b-e414-4b8d-80da-ba97f4883060"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3f23320-52fe-4e67-ad52-436054c38296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6e49f727-4287-4f7b-901f-2433a512ed8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b1f251bb-4e62-44b9-bd90-da52b4c1ba97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21f1fad3-4cc2-4c16-8443-1a2647b50822"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac56e965-c427-456e-9fb3-3f790c8a6cd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b25fb1b-303d-4e52-a29e-3bde183ba0e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f653bad-14ea-4abe-9487-7efc914d9d57"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2ee3fe7-dbb1-44f6-8dc7-052b1b704b10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/337ccf66-6c81-4d75-80ca-163f1e1160fc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae5fe648-595a-48bc-8176-612a57d344cb"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5207b519-1b7e-4cf9-99c3-d87cf41b3220"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=457f4be7-679d-4f83-9dda-abb5076341b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/428e83ea-6396-4ef8-9984-1346539902ba"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=675a2e3b-e414-4b8d-80da-ba97f4883060"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5207b519-1b7e-4cf9-99c3-d87cf41b3220"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa1e4371-d11d-4f0f-b408-55fd052e9e1d"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/21f1fad3-4cc2-4c16-8443-1a2647b50822"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b25fb1b-303d-4e52-a29e-3bde183ba0e8"], "isController": false}, {"data": [0.2966101694915254, 500, 1500, "addBook"], "isController": true}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9903846153846154, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3269230769230769, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac56e965-c427-456e-9fb3-3f790c8a6cd8"], "isController": false}, {"data": [0.9588235294117647, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f653bad-14ea-4abe-9487-7efc914d9d57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2ee3fe7-dbb1-44f6-8dc7-052b1b704b10"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a9cb1f5-10aa-4583-b461-cb08012fce4e"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e49f727-4287-4f7b-901f-2433a512ed8a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1f251bb-4e62-44b9-bd90-da52b4c1ba97"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98ee7525-3c79-4e4e-aa0d-747ba0ea4ec1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3f23320-52fe-4e67-ad52-436054c38296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/457f4be7-679d-4f83-9dda-abb5076341b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae5fe648-595a-48bc-8176-612a57d344cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d655a1f4-6439-49dc-9dd2-2e01eba46a5a"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1255, 9, 0.7171314741035857, 505.99681274900354, 140, 2626, 172.0, 1448.4, 1751.4, 2299.6400000000044, 4.987521261544821, 697.3950905143208, 3.6306618177428587], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 52, 0, 0.0, 2479.6730769230776, 2052, 3170, 2372.0, 2998.4, 3148.2, 3170.0, 0.2283596312870261, 274.793346713323, 1.1228425229786878], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fa1e4371-d11d-4f0f-b408-55fd052e9e1d", 3, 0, 0.0, 603.0, 252, 1236, 321.0, 1236.0, 1236.0, 1236.0, 0.029133567696700138, 0.02428745666381805, 0.01868265897216773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98ee7525-3c79-4e4e-aa0d-747ba0ea4ec1", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.3302816499085923, 1.2604261882998171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/675a2e3b-e414-4b8d-80da-ba97f4883060", 3, 0, 0.0, 373.3333333333333, 243, 586, 291.0, 586.0, 586.0, 586.0, 0.016891606560699986, 0.02328644328924624, 0.010832182592636385], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 638.0714285714286, 475, 1018, 568.5, 960.5, 1018.0, 1018.0, 0.07231255552571227, 0.013064280051032003, 0.049149940083882564], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 638.0714285714286, 475, 1018, 568.5, 960.5, 1018.0, 1018.0, 0.07202275919190464, 0.013011924268068709, 0.04895296913824768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3f23320-52fe-4e67-ad52-436054c38296", 1, 0, 0.0, 814.0, 814, 814, 814.0, 814.0, 814.0, 814.0, 1.2285012285012284, 0.22194602272727273, 0.8469940110565111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e49f727-4287-4f7b-901f-2433a512ed8a", 3, 0, 0.0, 475.33333333333337, 254, 848, 324.0, 848.0, 848.0, 848.0, 0.0232067020955652, 0.023274690480610802, 0.01488190205998159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 239.5, 146, 445, 148.0, 443.6, 445.0, 445.0, 0.09176311352244182, 0.041781788749842286, 0.051370317213613056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 167.50000000000003, 145, 441, 149.0, 238.70000000000022, 441.0, 441.0, 0.09191598878624938, 0.06830865963509353, 0.04613751780872283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 310.75000000000006, 141, 1171, 148.0, 965.9000000000002, 1171.0, 1171.0, 0.09176206097588951, 3.3942777393842767, 0.053049941501686126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 392.4375, 141, 1610, 148.5, 1503.6000000000001, 1610.0, 1610.0, 0.09191757291648714, 10.360127036548725, 0.05305008358754287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1f251bb-4e62-44b9-bd90-da52b4c1ba97", 3, 0, 0.0, 464.6666666666667, 257, 577, 560.0, 577.0, 577.0, 577.0, 0.05028157683024939, 0.032915446290895684, 0.03224437055846071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21f1fad3-4cc2-4c16-8443-1a2647b50822", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.510350459039548, 1.947607697740113], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 349.71428571428567, 243, 1448, 253.0, 891.5, 1448.0, 1448.0, 0.07167871551741793, 0.1557872082932274, 0.04633916960208073], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 164.2105263157895, 142, 443, 149.0, 158.0, 443.0, 443.0, 0.09226212154320539, 0.06856589306091727, 0.04631126022774176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 210.47368421052636, 142, 456, 149.0, 444.0, 456.0, 456.0, 0.09226704997960412, 0.03198236970921311, 0.05221321033488083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1062.75, 873, 1329, 1024.5, 1329.0, 1329.0, 1329.0, 0.1091494528883674, 32.09356325210795, 0.06224929735039703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1612.0, 1326, 1753, 1684.5, 1753.0, 1753.0, 1753.0, 0.10781671159029649, 97.01366661051213, 0.06138392857142857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 221.5, 141, 451, 147.0, 451.0, 451.0, 451.0, 0.11135547451351577, 0.1970469920102447, 0.06165874418863618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 174.83333333333334, 142, 443, 150.0, 358.7000000000003, 443.0, 443.0, 0.07854585441525884, 0.05837245625977733, 0.039426337079534225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac56e965-c427-456e-9fb3-3f790c8a6cd8", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 146.41666666666669, 140, 150, 147.0, 150.0, 150.0, 150.0, 0.0785494534267199, 0.021018115467696535, 0.044797735157426195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 195.75, 143, 440, 148.0, 439.7, 440.0, 440.0, 0.07854791095285163, 0.021171116624010788, 0.046177580462516285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 269.5833333333333, 142, 443, 150.5, 442.1, 443.0, 443.0, 0.07839806618103419, 0.021130728775356874, 0.04616604873746448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b25fb1b-303d-4e52-a29e-3bde183ba0e8", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 0.2716752819548872, 1.0367716165413534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 292.0, 148, 440, 290.0, 440.0, 440.0, 440.0, 0.11047892614483787, 0.08210396757443517, 0.06203650638015798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 246.8421052631579, 141, 1318, 148.0, 589.0, 1318.0, 1318.0, 0.0922683941900049, 4.393205745467922, 0.053826391553071326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1350.928571428571, 144, 2205, 1697.0, 2196.0, 2205.0, 2205.0, 0.0748611059124232, 48.120161181976655, 0.039414873564939334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 264.57894736842104, 141, 1161, 149.0, 447.0, 1161.0, 1161.0, 0.09225405796468127, 1.4512280259331012, 0.05390812011721121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 848.0714285714286, 143, 1280, 1168.5, 1246.5, 1280.0, 1280.0, 0.07486190651886789, 15.72854086791686, 0.039488402420178495], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 606.2857142857142, 245, 1449, 501.0, 1214.0, 1449.0, 1449.0, 0.0721314853933742, 0.013031567185326394, 0.0497312780153537], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 446.0833333333333, 297, 884, 309.0, 797.0000000000003, 884.0, 884.0, 0.07832080200501253, 0.12138194607612782, 0.17614531935307018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f653bad-14ea-4abe-9487-7efc914d9d57", 1, 0, 0.0, 1449.0, 1449, 1449, 1449.0, 1449.0, 1449.0, 1449.0, 0.6901311249137336, 0.12468189268461007, 0.47581306073153895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 654.3636363636364, 252, 1275, 575.5, 1115.6, 1255.9499999999998, 1275.0, 0.10440295745104926, 0.06413033226241209, 0.0472056340818709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 173.42857142857144, 142, 438, 149.0, 321.0, 438.0, 438.0, 0.07485710313704731, 0.055631108874309575, 0.037574756848088205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 253.5, 143, 446, 149.5, 445.5, 446.0, 446.0, 0.0748611059124232, 0.10034396004555833, 0.038203393614347665], "isController": false}, {"data": ["login", 22, 0, 0.0, 3032.772727272727, 1720, 5149, 2986.0, 4390.599999999999, 5060.3499999999985, 5149.0, 0.10125696716972969, 22.166250419986284, 0.18330351718376758], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2ee3fe7-dbb1-44f6-8dc7-052b1b704b10", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 171.6842105263158, 150, 446, 153.0, 176.0, 446.0, 446.0, 0.09374522022725815, 0.07589334723476271, 0.03332349625265817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/337ccf66-6c81-4d75-80ca-163f1e1160fc", 1, 0, 0.0, 692.0, 692, 692, 692.0, 692.0, 692.0, 692.0, 1.445086705202312, 0.46146811777456653, 0.8622538836705202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae5fe648-595a-48bc-8176-612a57d344cb", 3, 0, 0.0, 636.6666666666666, 247, 1164, 499.0, 1164.0, 1164.0, 1164.0, 0.06457445434586077, 0.04151515212665203, 0.041410050475698484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1525.8571428571427, 298, 2354, 1854.5, 2350.5, 2354.0, 2354.0, 0.0747971128314447, 63.949799283283376, 0.15455078657178117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5207b519-1b7e-4cf9-99c3-d87cf41b3220", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 617.4375, 294, 1760, 585.0, 1652.9, 1760.0, 1760.0, 0.09168266338137124, 13.834871375669714, 0.20326422513824027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1904.75, 1475, 2194, 1975.0, 2194.0, 2194.0, 2194.0, 0.10657572205051688, 127.50161528828734, 0.24031576388148781], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=457f4be7-679d-4f83-9dda-abb5076341b0", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/428e83ea-6396-4ef8-9984-1346539902ba", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1261.7727272727273, 231, 2535, 1252.0, 2140.1, 2481.2999999999993, 2535.0, 0.09829854160709178, 0.031241901540606236, 0.04434953732663712], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 204.88888888888886, 148, 448, 156.5, 445.3, 448.0, 448.0, 0.08796278196958443, 0.06829141764240197, 0.03126802015325071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 493.7368421052631, 292, 1467, 310.0, 1034.0, 1467.0, 1467.0, 0.09218512714269772, 5.939847460906228, 0.20608512053205374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=675a2e3b-e414-4b8d-80da-ba97f4883060", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5207b519-1b7e-4cf9-99c3-d87cf41b3220", 3, 0, 0.0, 432.6666666666667, 317, 533, 448.0, 533.0, 533.0, 533.0, 0.04543526988550312, 0.029210500658811412, 0.02913655002423214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 588.0, 291, 1760, 308.0, 1712.8, 1760.0, 1760.0, 0.09722563782877994, 13.817149360383985, 0.21573613927000704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 149.6, 144, 161, 149.5, 160.0, 161.0, 161.0, 0.04880167487348166, 0.0362676509557808, 0.024496153207978096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 177.59999999999997, 144, 448, 148.0, 418.2000000000001, 448.0, 448.0, 0.048801198557436566, 0.013058133207751581, 0.02783193355228804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 234.89999999999998, 142, 445, 148.5, 444.7, 445.0, 445.0, 0.048801198557436566, 0.013153448048684076, 0.02868976712068048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 176.7, 146, 437, 148.0, 408.2000000000001, 437.0, 437.0, 0.048801198557436566, 0.013153448048684076, 0.02873742454114673], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1700.8846153846157, 1173, 2568, 1601.5, 2392.3, 2522.8, 2568.0, 0.23422579366509316, 280.21547928453026, 0.4625044480379085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa1e4371-d11d-4f0f-b408-55fd052e9e1d", 1, 0, 0.0, 979.0, 979, 979, 979.0, 979.0, 979.0, 979.0, 1.021450459652707, 0.18453938968335037, 0.7042422114402451], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1261.7727272727273, 231, 2535, 1252.0, 2140.1, 2481.2999999999993, 2535.0, 0.1016870811185579, 0.03231886988675757, 0.04587835105153686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 236.4, 143, 595, 148.0, 595.0, 595.0, 595.0, 0.04050288380532694, 0.010916792900654526, 0.023850819272082175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 150.0, 146, 153, 150.0, 153.0, 153.0, 153.0, 0.04064842365413069, 0.010956020438027413, 0.023896827187291678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 325.8888888888889, 140, 1621, 148.5, 1610.2, 1621.0, 1621.0, 0.08726384222697325, 8.74536903212279, 0.050468346253229976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21f1fad3-4cc2-4c16-8443-1a2647b50822", 3, 0, 0.0, 1046.3333333333333, 693, 1448, 998.0, 1448.0, 1448.0, 1448.0, 0.06544502617801048, 0.029612170047993016, 0.041968327334205933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 310.3888888888889, 143, 1180, 148.0, 1169.2, 1180.0, 1180.0, 0.08745080891998251, 2.8780008077053876, 0.05066187812758101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 197.38888888888889, 143, 449, 149.0, 444.5, 449.0, 449.0, 0.087890625, 0.06531715393066406, 0.044116973876953125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 207.0, 147, 438, 148.0, 438.0, 438.0, 438.0, 0.04055446058511976, 0.010851486523752748, 0.023128715802451114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 212.83333333333334, 141, 452, 148.0, 443.0, 452.0, 452.0, 0.0878936291767785, 0.03818642482897364, 0.04930664744400443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 149.8, 149, 151, 149.0, 151.0, 151.0, 151.0, 0.04064875411568635, 0.030208693244177066, 0.02040376915572538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 152.6, 149, 164, 150.0, 164.0, 164.0, 164.0, 0.0412796697626419, 0.03249161506707946, 0.014673632610939112], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 731.5384615384614, 458, 1437, 586.0, 1356.6, 1437.0, 1437.0, 0.06852383838916269, 0.012379795021479588, 0.046641714216060934], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1638.2727272727273, 1190, 2626, 1547.0, 2449.2, 2620.45, 2626.0, 0.10307394618602973, 0.05334881980331617, 0.04740998891955079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 390.2, 299, 747, 301.0, 747.0, 747.0, 747.0, 0.04045274714605869, 0.06269385714921401, 0.09097917644274722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b25fb1b-303d-4e52-a29e-3bde183ba0e8", 3, 0, 0.0, 669.6666666666667, 237, 1437, 335.0, 1437.0, 1437.0, 1437.0, 0.023977365367093464, 0.024047611554692372, 0.01537610995220512], "isController": false}, {"data": ["addBook", 59, 5, 8.474576271186441, 1498.0677966101696, 754, 3181, 1165.0, 2676.0, 2923.0, 3181.0, 0.27682375241634294, 96.51641848566851, 1.004457478229454], "isController": true}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 257.98076923076934, 142, 603, 151.0, 593.7, 598.4, 603.0, 0.2357100766057749, 0.17517125810253387, 0.11394188273423689], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 957.3653846153846, 702, 1339, 882.5, 1182.8, 1324.8999999999999, 1339.0, 0.2356513266716516, 69.28931440192147, 0.11851604808193415], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 215.15384615384613, 140, 614, 151.0, 444.0, 457.54999999999995, 614.0, 0.236240147195784, 0.4180343229675397, 0.11489022783544965], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1437.5769230769233, 989, 1972, 1423.0, 1829.6000000000001, 1922.6, 1972.0, 0.23491039523673998, 211.37278656244777, 0.11791400698406676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 170.58823529411762, 147, 444, 151.0, 231.99999999999983, 444.0, 444.0, 0.0978862331650074, 0.07312789880002994, 0.034795496945373726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac56e965-c427-456e-9fb3-3f790c8a6cd8", 3, 0, 0.0, 346.3333333333333, 252, 526, 261.0, 526.0, 526.0, 526.0, 0.019814012469618517, 0.023535589681522775, 0.012706251486050936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, 2.9411764705882355, 220.82352941176464, 143, 598, 157.0, 394.0000000000001, 454.5999999999999, 535.5199999999993, 0.7154550925672633, 1.5276906109144779, 0.3465197910134632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 183.4, 148, 449, 154.0, 420.2000000000001, 449.0, 449.0, 0.05158707640561887, 0.0399497574117732, 0.01833759356605983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 152.375, 148, 159, 151.5, 158.3, 159.0, 159.0, 0.09172839223060518, 0.07443974017932901, 0.032606576925722934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f653bad-14ea-4abe-9487-7efc914d9d57", 3, 0, 0.0, 562.6666666666666, 252, 966, 470.0, 966.0, 966.0, 966.0, 0.019248166612130194, 0.02653515156327193, 0.012343388094367344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2ee3fe7-dbb1-44f6-8dc7-052b1b704b10", 3, 0, 0.0, 316.6666666666667, 242, 458, 250.0, 458.0, 458.0, 458.0, 0.03820244750347006, 0.03184780861210509, 0.02449831431700391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 387.59999999999997, 293, 599, 300.0, 598.4, 599.0, 599.0, 0.04876645258193983, 0.07557847680423684, 0.10967689482051507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a9cb1f5-10aa-4583-b461-cb08012fce4e", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.6557206108829569, 1.2252149640657084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 575.4444444444446, 293, 1764, 301.0, 1758.6, 1764.0, 1764.0, 0.08720043018878894, 11.7114643737798, 0.1936368059693539], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e49f727-4287-4f7b-901f-2433a512ed8a", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1f251bb-4e62-44b9-bd90-da52b4c1ba97", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98ee7525-3c79-4e4e-aa0d-747ba0ea4ec1", 3, 0, 0.0, 521.0, 267, 882, 414.0, 882.0, 882.0, 882.0, 0.019253725595902806, 0.026542815071174605, 0.012346952937476736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 181.25, 149, 446, 155.5, 365.0000000000003, 446.0, 446.0, 0.08147137299631342, 0.06754804265026376, 0.028960527119783287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3f23320-52fe-4e67-ad52-436054c38296", 3, 0, 0.0, 438.0, 260, 782, 272.0, 782.0, 782.0, 782.0, 0.03502422508901991, 0.022197970783958906, 0.02246019642752904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 151.92857142857142, 146, 157, 151.0, 156.5, 157.0, 157.0, 0.07094894210059546, 0.055082430634739644, 0.025220131762321046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/457f4be7-679d-4f83-9dda-abb5076341b0", 2, 0, 0.0, 245.0, 240, 250, 245.0, 250.0, 250.0, 250.0, 0.09850760971285032, 0.05795979966014875, 0.061230560138895725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae5fe648-595a-48bc-8176-612a57d344cb", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 165.82352941176472, 141, 425, 149.0, 209.7999999999998, 425.0, 425.0, 0.0973085597188355, 0.07231622455667365, 0.0488443356401186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 267.29411764705884, 142, 451, 148.0, 449.4, 451.0, 451.0, 0.09731301590209167, 0.04323408001992055, 0.05453732669696727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 349.2352941176471, 141, 1609, 148.0, 1562.6, 1609.0, 1609.0, 0.09731023073972947, 10.324309151025478, 0.056223937315039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 320.88235294117646, 146, 1166, 149.0, 940.3999999999997, 1166.0, 1166.0, 0.09731134478554297, 3.3893505612574915, 0.056319611598939875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d655a1f4-6439-49dc-9dd2-2e01eba46a5a", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.6666721033402923, 1.245677844467641], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 44.44444444444444, 0.3187250996015936], "isController": false}, {"data": ["401/Unauthorized", 5, 55.55555555555556, 0.398406374501992], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1255, 9, "401/Unauthorized", 5, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
