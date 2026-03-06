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

    var data = {"OkPercent": 98.94498869630746, "KoPercent": 1.0550113036925395};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.833117723156533, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44b697ad-9fdc-4ef2-8f8b-18589a2f46b2"], "isController": false}, {"data": [0.4636363636363636, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ee8e4e7-2a67-4ef5-97be-46ef7cf6cb68"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d01fbea2-c80d-4fc1-9a80-ecd12825e1e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c536da1-47a4-4731-be9f-a386ba62e5e3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2174049f-0b35-48c5-b7c9-56122c1e2696"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9257fa53-ae45-40c4-91c0-158323231f7d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f745afa2-486a-4149-b12f-642e513b9237"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/400aa6cc-75cb-4fba-b057-1a3b2d610caf"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60875a36-d35b-4220-b423-e643ead1be5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8afd7411-38f5-42b2-b812-0d7f0a3adfb5"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ee8e4e7-2a67-4ef5-97be-46ef7cf6cb68"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3dc15aa-63e4-416c-b93d-26119c1a628d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7faeae8c-c1e0-4f9f-b6a9-c41df3ad8877"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a1f2da2-e912-472f-9e3c-c7738517111c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=809ae40b-089e-4eff-90ee-e915d5594f83"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1fb05434-d4a5-444b-a456-ba0bffcd4748"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c536da1-47a4-4731-be9f-a386ba62e5e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44b697ad-9fdc-4ef2-8f8b-18589a2f46b2"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8afd7411-38f5-42b2-b812-0d7f0a3adfb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4365079365079365, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2174049f-0b35-48c5-b7c9-56122c1e2696"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60875a36-d35b-4220-b423-e643ead1be5b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9530386740331491, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=400aa6cc-75cb-4fba-b057-1a3b2d610caf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3dc15aa-63e4-416c-b93d-26119c1a628d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/809ae40b-089e-4eff-90ee-e915d5594f83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a7c0c7a-4fed-4e77-8069-d4b7310e5998"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d01fbea2-c80d-4fc1-9a80-ecd12825e1e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9257fa53-ae45-40c4-91c0-158323231f7d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f745afa2-486a-4149-b12f-642e513b9237"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a1f2da2-e912-472f-9e3c-c7738517111c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7faeae8c-c1e0-4f9f-b6a9-c41df3ad8877"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1327, 14, 1.0550113036925395, 275.23511680482295, 81, 1803, 101.0, 675.2, 839.0, 1272.6000000000001, 5.216379510281417, 718.206257327549, 3.810686293441985], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/44b697ad-9fdc-4ef2-8f8b-18589a2f46b2", 3, 0, 0.0, 366.0, 179, 591, 328.0, 591.0, 591.0, 591.0, 0.020624084806236724, 0.024376970029767426, 0.013225731467541127], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1233.3272727272729, 998, 1634, 1202.0, 1463.6, 1573.9999999999998, 1634.0, 0.2377494207559567, 286.093355045529, 1.1690120444396894], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0ee8e4e7-2a67-4ef5-97be-46ef7cf6cb68", 3, 0, 0.0, 290.3333333333333, 182, 501, 188.0, 501.0, 501.0, 501.0, 0.01953481103326127, 0.0230894853065663, 0.012527206294116114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d01fbea2-c80d-4fc1-9a80-ecd12825e1e4", 3, 0, 0.0, 409.3333333333333, 319, 545, 364.0, 545.0, 545.0, 545.0, 0.07554201395009191, 0.03550868103643643, 0.04844328368544305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c536da1-47a4-4731-be9f-a386ba62e5e3", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 475.78571428571433, 350, 841, 431.5, 764.5, 841.0, 841.0, 0.09450392191275937, 0.01707346245494188, 0.06423313442507864], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 475.78571428571433, 350, 841, 431.5, 764.5, 841.0, 841.0, 0.09592391862911016, 0.017330004830454472, 0.06519828844322331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 109.875, 83, 248, 86.0, 245.2, 248.0, 248.0, 0.0707563857638152, 0.025574909453937596, 0.03998184932869879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 85.3125, 82, 90, 85.0, 87.9, 90.0, 90.0, 0.07075607286106603, 0.05258337055397583, 0.03551623188533978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 136.125, 82, 584, 85.5, 347.4000000000002, 584.0, 584.0, 0.07075701157761602, 1.3181861965231774, 0.04128643986096247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 147.25, 81, 763, 85.5, 401.80000000000035, 763.0, 763.0, 0.07075795031907414, 3.997137516141658, 0.04121788805207785], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 215.28571428571428, 161, 328, 199.5, 323.5, 328.0, 328.0, 0.09490045620005017, 0.22062237752757197, 0.061351662113704304], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2174049f-0b35-48c5-b7c9-56122c1e2696", 3, 0, 0.0, 261.0, 165, 368, 250.0, 368.0, 368.0, 368.0, 0.029586674161957455, 0.029673353871416314, 0.018973225292661516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 114.1, 84, 295, 86.0, 263.3, 293.5, 295.0, 0.11369256393785565, 0.0844922276920978, 0.057068337757868945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 110.80000000000001, 82, 266, 84.5, 250.9, 265.25, 266.0, 0.11357634886111316, 0.03039054647260255, 0.0647740114598536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 559.8, 435, 609, 585.0, 609.0, 609.0, 609.0, 0.05636025474835146, 16.57178623259877, 0.03214295778616919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 723.0, 603, 784, 743.0, 784.0, 784.0, 784.0, 0.05628729032984352, 50.64740278129573, 0.032046377209276146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 156.0, 85, 265, 89.0, 265.0, 265.0, 265.0, 0.056692556267362096, 0.1003192499574806, 0.03139128848007257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 104.5625, 83, 383, 86.0, 177.9000000000002, 383.0, 383.0, 0.07737505138187005, 0.057502357521096795, 0.03883864883816524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 137.6875, 81, 261, 88.0, 257.5, 261.0, 261.0, 0.0773735546861777, 0.02796668645334133, 0.04372096980497028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 138.375, 83, 760, 86.5, 401.60000000000036, 760.0, 760.0, 0.0773731805213018, 4.370833824471687, 0.04507138884859036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 121.43750000000001, 82, 424, 84.0, 361.00000000000006, 424.0, 424.0, 0.0773735546861777, 1.4414508115760511, 0.0451471669189367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 121.6, 83, 263, 88.0, 263.0, 263.0, 263.0, 0.05669577049552103, 0.042134259128019054, 0.03183600394035605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 437.88888888888886, 82, 834, 573.5, 766.5000000000001, 834.0, 834.0, 0.09479122233281198, 47.396526576430695, 0.05120124834773634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 110.64999999999999, 82, 259, 85.0, 252.00000000000003, 258.7, 259.0, 0.1135808638960508, 0.030613592221982438, 0.06677312506388923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 350.4444444444445, 83, 589, 417.0, 586.3, 589.0, 589.0, 0.09479072314789459, 15.495588446327387, 0.051293547779790616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 110.39999999999999, 82, 252, 86.0, 249.9, 251.9, 252.0, 0.11368933252992872, 0.03064282790845735, 0.06694791749565138], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 497.9285714285714, 169, 896, 495.5, 806.0, 896.0, 896.0, 0.09601470396609309, 0.01734640647824924, 0.06619763769537278], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 280.8125, 168, 847, 177.5, 756.7, 847.0, 847.0, 0.0773406420240046, 5.89526494758963, 0.17270414606263623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9257fa53-ae45-40c4-91c0-158323231f7d", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f745afa2-486a-4149-b12f-642e513b9237", 3, 0, 0.0, 345.33333333333337, 163, 654, 219.0, 654.0, 654.0, 654.0, 0.01989323961407115, 0.027424436772653424, 0.012757057955638074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/400aa6cc-75cb-4fba-b057-1a3b2d610caf", 3, 0, 0.0, 280.6666666666667, 237, 362, 243.0, 362.0, 362.0, 362.0, 0.034223134839151265, 0.028329893195300025, 0.02194647644307552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 460.4285714285714, 133, 1274, 336.0, 997.6000000000001, 1251.8999999999996, 1274.0, 0.09146899201170804, 0.056185542944691746, 0.041357561817793764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 100.05555555555554, 82, 245, 85.5, 187.4000000000001, 245.0, 245.0, 0.09478972479383235, 0.07044431696104142, 0.04757999857815413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 130.27777777777777, 82, 256, 85.0, 253.3, 256.0, 256.0, 0.09479022396823474, 0.10445849768027257, 0.04963732865350487], "isController": false}, {"data": ["login", 21, 0, 0.0, 2133.0952380952385, 1517, 2926, 2046.0, 2807.2, 2914.5, 2926.0, 0.09329560044604182, 26.703049926196517, 0.17759744253435278], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/60875a36-d35b-4220-b423-e643ead1be5b", 3, 0, 0.0, 243.66666666666666, 176, 352, 203.0, 352.0, 352.0, 352.0, 0.025976724854530342, 0.030703609357682182, 0.016658251290177336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 90.0, 85, 101, 90.0, 98.50000000000001, 100.9, 101.0, 0.11458954026676446, 0.09276828992299582, 0.040733000641701426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8afd7411-38f5-42b2-b812-0d7f0a3adfb5", 1, 0, 0.0, 169.0, 169, 169, 169.0, 169.0, 169.0, 169.0, 5.9171597633136095, 1.069018121301775, 4.0796042899408285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 550.3888888888889, 170, 932, 671.5, 920.3000000000001, 932.0, 932.0, 0.09474731417683006, 63.03788839819138, 0.19962115878597106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ee8e4e7-2a67-4ef5-97be-46ef7cf6cb68", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3dc15aa-63e4-416c-b93d-26119c1a628d", 1, 0, 0.0, 896.0, 896, 896, 896.0, 896.0, 896.0, 896.0, 1.1160714285714286, 0.20163399832589285, 0.7694789341517857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7faeae8c-c1e0-4f9f-b6a9-c41df3ad8877", 3, 0, 0.0, 476.6666666666667, 219, 852, 359.0, 852.0, 852.0, 852.0, 0.026318559848405098, 0.02639566500421097, 0.016877461881952487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 274.81250000000006, 169, 848, 177.0, 488.9000000000004, 848.0, 848.0, 0.07072854825234177, 5.391260279123585, 0.15793912758545997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a1f2da2-e912-472f-9e3c-c7738517111c", 3, 0, 0.0, 275.6666666666667, 211, 376, 240.0, 376.0, 376.0, 376.0, 0.03879276902785321, 0.03233993537771226, 0.024876873367470968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=809ae40b-089e-4eff-90ee-e915d5594f83", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 845.0, 691, 1048, 828.0, 1048.0, 1048.0, 1048.0, 0.05623411386283375, 67.27555032109679, 0.1268013368254718], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 801.875, 129, 1373, 804.5, 1259.0, 1371.5, 1373.0, 0.09479983410029033, 0.029624948156340727, 0.042771018900716926], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 251.15, 169, 545, 175.0, 528.8000000000001, 544.35, 545.0, 0.11352026336701102, 0.1759342362924282, 0.2553097329435804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 99.88235294117646, 86, 257, 90.0, 128.9999999999999, 257.0, 257.0, 0.12169456096897505, 0.09447966403353043, 0.04325861346944035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 335.53846153846155, 169, 808, 332.0, 687.1999999999999, 808.0, 808.0, 0.09504869417717077, 8.882997342292283, 0.2118960409477086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 101.25, 84, 254, 86.0, 208.10000000000016, 254.0, 254.0, 0.07461201750895344, 0.055448970043274974, 0.037451735351173895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 142.58333333333331, 84, 262, 89.0, 259.6, 262.0, 262.0, 0.07453092101585646, 0.029271339910687113, 0.041984296490214706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 157.41666666666669, 83, 778, 87.0, 618.7000000000005, 778.0, 778.0, 0.07461201750895344, 5.613103123523304, 0.043329374751293274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 140.25000000000003, 82, 414, 87.5, 365.1000000000002, 414.0, 414.0, 0.07453925423476138, 1.844834410270267, 0.04335991123617142], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 784.9090909090908, 646, 1288, 677.0, 1098.2, 1186.1999999999998, 1288.0, 0.2430466561199148, 290.7682974084598, 0.47992220573678485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 801.875, 129, 1373, 804.5, 1259.0, 1371.5, 1373.0, 0.09551516502234657, 0.029848489069483303, 0.043093756094066515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 113.66666666666667, 82, 256, 86.0, 256.0, 256.0, 256.0, 0.03709175882938409, 0.00999738812198243, 0.0218421197012877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fb05434-d4a5-444b-a456-ba0bffcd4748", 1, 0, 0.0, 771.0, 771, 771, 771.0, 771.0, 771.0, 771.0, 1.297016861219196, 0.4141840953307393, 0.7739036154345006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 141.33333333333334, 84, 260, 86.5, 260.0, 260.0, 260.0, 0.037091988130563795, 0.009997449925816025, 0.021806032084569733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 182.8235294117647, 82, 739, 86.0, 614.9999999999999, 739.0, 739.0, 0.12177039833246184, 12.919455932546363, 0.07035654104020572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 181.64705882352942, 83, 574, 85.0, 566.8, 574.0, 574.0, 0.12176342083587006, 4.241015471117, 0.07047141917057623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 113.0, 83, 253, 85.5, 253.0, 253.0, 253.0, 0.037091529531039426, 0.00992488192529766, 0.021153762935670922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 105.76470588235294, 82, 255, 86.0, 249.4, 255.0, 255.0, 0.12191273916410889, 0.09060116650770203, 0.06119448040073435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 88.16666666666667, 84, 96, 87.0, 96.0, 96.0, 96.0, 0.037091300235529756, 0.0275649213664435, 0.018618094063537396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 95.47058823529412, 82, 264, 85.0, 123.19999999999987, 264.0, 264.0, 0.12191536205276784, 0.05416437328332413, 0.06832526839308381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c536da1-47a4-4731-be9f-a386ba62e5e3", 3, 0, 0.0, 260.6666666666667, 171, 375, 236.0, 375.0, 375.0, 375.0, 0.021069487168682316, 0.029045988984169793, 0.013511357331479219], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 94.33333333333333, 87, 97, 96.0, 97.0, 97.0, 97.0, 0.0363145566900492, 0.0285835280197067, 0.012908690073415928], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 449.8571428571429, 346, 691, 375.5, 672.5, 691.0, 691.0, 0.09266491044598298, 0.01674121917236997, 0.06307367439536146], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44b697ad-9fdc-4ef2-8f8b-18589a2f46b2", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.5147124287749288, 1.9642539173789175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1240.5714285714287, 604, 1738, 1191.0, 1637.8, 1729.3, 1738.0, 0.09029927760577916, 0.04673693079205366, 0.04153414038312694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8afd7411-38f5-42b2-b812-0d7f0a3adfb5", 3, 0, 0.0, 268.6666666666667, 188, 354, 264.0, 354.0, 354.0, 354.0, 0.07082989021367016, 0.03204868079329477, 0.04542151162790698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 260.33333333333337, 173, 350, 259.5, 350.0, 350.0, 350.0, 0.03707159142163374, 0.057453726158332774, 0.08337487797267824], "isController": false}, {"data": ["addBook", 63, 6, 9.523809523809524, 874.7619047619047, 428, 2799, 724.0, 1371.6000000000001, 1483.8, 2799.0, 0.283236448484685, 87.14134710542466, 1.0306615748733303], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 150.72727272727272, 83, 436, 86.0, 342.4, 344.4, 436.0, 0.24370574525216898, 0.181113351696192, 0.11780697646467153], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 491.4545454545453, 406, 809, 423.0, 598.6, 667.0, 809.0, 0.24348134047545267, 71.59159844116606, 0.12245399447740052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2174049f-0b35-48c5-b7c9-56122c1e2696", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 137.07272727272732, 82, 345, 87.0, 254.4, 262.4, 345.0, 0.24402363923545176, 0.43180745536585796, 0.11867555892505369], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60875a36-d35b-4220-b423-e643ead1be5b", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 627.0909090909093, 562, 942, 585.0, 754.2, 795.5999999999997, 942.0, 0.2434522413098616, 219.0587546740064, 0.12220161331373912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 102.99999999999999, 85, 259, 89.0, 194.99999999999994, 259.0, 259.0, 0.09566490790412904, 0.07146841264322142, 0.03400588523154587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 6, 3.314917127071823, 161.35911602209936, 83, 1803, 94.0, 307.4000000000002, 408.5000000000001, 1246.2200000000046, 0.7685840219449847, 1.589608444126914, 0.37301272197640745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 134.0, 85, 275, 91.5, 269.0, 275.0, 275.0, 0.07841036062231689, 0.060722085911618456, 0.027872432877464208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 89.9375, 84, 103, 88.0, 100.9, 103.0, 103.0, 0.07277523822519388, 0.05905881148939074, 0.025869322962861888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 301.4166666666667, 171, 1032, 184.5, 826.8000000000008, 1032.0, 1032.0, 0.07449067004357704, 7.5322203670682955, 0.1659430014463605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 330.3529411764706, 168, 993, 332.0, 733.7999999999997, 993.0, 993.0, 0.12168759216045583, 17.293541844873374, 0.27001531608352064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=400aa6cc-75cb-4fba-b057-1a3b2d610caf", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3dc15aa-63e4-416c-b93d-26119c1a628d", 3, 0, 0.0, 400.0, 177, 691, 332.0, 691.0, 691.0, 691.0, 0.03722084367245657, 0.030254051643920598, 0.02386883529776675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/809ae40b-089e-4eff-90ee-e915d5594f83", 3, 0, 0.0, 266.3333333333333, 161, 424, 214.0, 424.0, 424.0, 424.0, 0.0509614731263165, 0.03276331686994632, 0.032680371763946454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 91.4375, 87, 103, 90.0, 101.6, 103.0, 103.0, 0.07771819382917541, 0.06443627593844718, 0.027626389212714694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 93.16666666666667, 85, 112, 89.5, 107.5, 112.0, 112.0, 0.09360812518526608, 0.07267427687723295, 0.03327476324945005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a7c0c7a-4fed-4e77-8069-d4b7310e5998", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d01fbea2-c80d-4fc1-9a80-ecd12825e1e4", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9257fa53-ae45-40c4-91c0-158323231f7d", 3, 0, 0.0, 255.33333333333334, 176, 346, 244.0, 346.0, 346.0, 346.0, 0.02984747938036633, 0.024882615459999403, 0.019140473430768773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f745afa2-486a-4149-b12f-642e513b9237", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.2724948152337858, 1.039899132730015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 98.07692307692307, 81, 255, 83.0, 192.59999999999994, 255.0, 255.0, 0.09511058434479781, 0.07068276824842885, 0.04774105503244734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 173.00000000000003, 81, 253, 245.0, 251.8, 253.0, 253.0, 0.09511267193444542, 0.03643889925373134, 0.0536294858428446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 172.46153846153848, 81, 725, 87.0, 536.9999999999998, 725.0, 725.0, 0.09511197606104725, 6.60688854202486, 0.0552866940174567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 199.69230769230768, 82, 594, 245.0, 457.5999999999999, 594.0, 594.0, 0.09510919266927607, 2.1748368740169, 0.055377956158320224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a1f2da2-e912-472f-9e3c-c7738517111c", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 0.30569215313028764, 1.1665873519458545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7faeae8c-c1e0-4f9f-b6a9-c41df3ad8877", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 57.142857142857146, 0.6028636021100227], "isController": false}, {"data": ["401/Unauthorized", 6, 42.857142857142854, 0.45214770158251694], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1327, 14, "406/Not Acceptable", 8, "401/Unauthorized", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
